import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Keep a reference to the original fetch implementation
const originalFetch = typeof window !== "undefined" && window.fetch ? window.fetch.bind(window) : (typeof fetch !== 'undefined' ? fetch.bind(globalThis) : undefined as any);

// Minimal XHR-based fetch fallback to avoid third-party wrappers interfering with window.fetch
function xhrFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  return new Promise((resolve, reject) => {
    try {
      const url = typeof input === 'string' || input instanceof URL ? String(input) : (input as Request).url;
      const method = (init && init.method) || 'GET';
      const xhr = new XMLHttpRequest();
      xhr.open(method, url, true);

      // Credentials
      if (init && init.credentials === 'include') xhr.withCredentials = true;

      // Headers
      const headers = init?.headers as HeadersInit | undefined;
      const setHeader = (k: string, v: string) => {
        try { xhr.setRequestHeader(k, v); } catch {}
      };
      if (headers) {
        if (headers instanceof Headers) {
          headers.forEach((v, k) => setHeader(k, v));
        } else if (Array.isArray(headers)) {
          headers.forEach(([k, v]) => setHeader(k, v));
        } else {
          Object.entries(headers).forEach(([k, v]) => setHeader(k, String(v)));
        }
      }

      // Timeout (optional safety)
      xhr.timeout = (init as any)?.timeout ?? 30000;

      xhr.onload = () => {
        try {
          const status = xhr.status;
          const statusText = xhr.statusText;
          const raw = xhr.getAllResponseHeaders();
          const hdrs: Record<string, string> = {};
          raw.split(/\r?\n/).forEach((line) => {
            const idx = line.indexOf(':');
            if (idx > 0) hdrs[line.slice(0, idx).trim().toLowerCase()] = line.slice(idx + 1).trim();
          });
          const body = xhr.response || xhr.responseText || '';
          const resp = new Response(body, { status, statusText, headers: hdrs });
          resolve(resp);
        } catch (e) {
          reject(e);
        }
      };

      xhr.onerror = () => reject(new TypeError('Network request failed (xhr)'));
      xhr.ontimeout = () => reject(new TypeError('Network request timed out (xhr)'));

      // Body
      let body: any = init?.body ?? null;
      // If body is a ReadableStream/Blob/ArrayBuffer/FormData etc., XHR can handle most natively
      try { xhr.send(body as any); } catch (e) { reject(e); }
    } catch (e) {
      reject(e);
    }
  });
}

// A safe wrapper around fetch that logs failures, and falls back to XHR-based fetch when we detect
// generic "Failed to fetch" errors (often from third-party wrappers like FullStory)
async function safeFetch(input: RequestInfo | URL, init?: RequestInit) {
  try {
    if (!originalFetch) throw new Error('fetch not available');
    return await originalFetch(input as any, init as any);
  } catch (err) {
    const msg = (err as any)?.message ? String((err as any).message) : String(err);
    const stack = (err as any)?.stack ? String((err as any).stack) : '';

    // Check if this error is from FullStory interference
    const isFullStoryError = /edge\.fullstory\.com|fs\.js/i.test(stack);

    if (isFullStoryError) {
      // eslint-disable-next-line no-console
      console.warn('[fetch] FullStory interference detected, using XHR fallback');
    } else {
      // eslint-disable-next-line no-console
      console.warn('[fetch] primary fetch failed, attempting XHR fallback:', msg.slice(0, 80));
    }

    try {
      return await xhrFetch(input, init);
    } catch (err2) {
      // Even if XHR fails, return a mock error response instead of throwing
      // This prevents uncaught promise rejections
      // eslint-disable-next-line no-console
      console.warn('[fetch] XHR fallback also failed, returning error response:', (err2 as any)?.message?.slice(0, 60) || err2);
      return new Response(JSON.stringify({ error: 'Network request failed' }), {
        status: 500,
        statusText: 'Network Error',
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
}

// Install a targeted global handler to reduce noisy unhandled promise rejections coming from
// third-party scripts (FullStory has been observed wrapping/calling fetch and producing
// spurious "Failed to fetch" errors). We only suppress clearly-identifiable FullStory
// fetch failures so we don't hide genuine application errors.
if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
  window.addEventListener('unhandledrejection', (e: PromiseRejectionEvent) => {
    try {
      const reason = (e && (e as any).reason) || e;
      const msg = String((reason && ((reason.message) || reason)) || reason || '');
      const stack = String((reason && reason.stack) || '');

      // Check if this error involves FullStory
      const isFullStoryInStack = /edge\.fullstory\.com|fs\.js|fullstory/i.test(stack);
      const isSupabaseInStack = /@supabase|supabase-js/i.test(stack);
      const name = String((reason && (reason as any).name) || '');
      const isFetchError = msg.includes('Failed to fetch') ||
                           msg.includes('Network request failed') ||
                           name === 'TypeError';

      // AGGRESSIVE: Suppress ANY error that has FullStory in the stack
      if (isFullStoryInStack && isFetchError) {
        // eslint-disable-next-line no-console
        console.warn('[supabase] Suppressed FullStory error' + (isSupabaseInStack ? ' (Supabase)' : '') + ':', msg.slice(0, 50));
        e.preventDefault();
        return;
      }

      // Also catch eval-wrapped errors (FullStory uses eval)
      if (isFetchError && /eval/.test(stack) && stack.includes('messageHandler')) {
        // eslint-disable-next-line no-console
        console.warn('[supabase] Suppressed eval-wrapped error:', msg.slice(0, 50));
        e.preventDefault();
      }
    } catch {}
  });
}

// Create the Supabase client, passing the safeFetch implementation so Supabase uses it.
const _client = createClient(url, anon, { fetch: safeFetch as any });

// Wrap the client to catch network/fetch errors from chained queries like supabase.from(...).select(...)
// This proxy intercepts 'from' calls and attaches a catch to the returned query promise so failures
// don't bubble as uncaught exceptions in the UI. It also logs a helpful message for debugging.
const supabase = new Proxy(_client as any, {
  get(target, prop, receiver) {
    try {
      const orig = Reflect.get(target, prop, receiver);
      if (prop === 'from' && typeof orig === 'function') {
        return (...args: any[]) => {
          try {
            const query = orig.apply(target, args);
            if (query && typeof query.catch === 'function') {
              return query.catch((err: any) => {
                // eslint-disable-next-line no-console
                console.error('[supabase] network request failed:', err?.message || err);
                return { data: null, error: err };
              });
            }
            return query;
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error('[supabase] call to from() threw synchronously:', e);
            return Promise.resolve({ data: null, error: e });
          }
        };
      }
      return typeof orig === 'function' ? orig.bind(target) : orig;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[supabase] proxy error:', e);
      return undefined;
    }
  },
});

export { supabase };
