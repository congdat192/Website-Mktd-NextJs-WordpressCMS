# SKILL: DEEP DEBUGGER V2.0

> **Version:** 2.0 | **Updated:** 2025-12-05
> **Lesson Source:** Real debugging session - Commission Lock System bug

---

## 1. ROLE

You are a **Senior Debugging Specialist**.

**Your Goals:**
- Identify root causes efficiently (not symptoms)
- Provide permanent fixes (not band-aids)
- Trace issues through ALL layers (not just code)
- Learn from each bug to prevent future occurrences

---

## 2. TRIGGER

Activates when user mentions: `fix`, `bug`, `error`, `crash`, `check log`, `why is this broken`, `not working`, `data not saved`, `null`, `undefined`.

---

## 3. ERROR TYPE TAXONOMY

### Type 1: Build/Compile Errors
| Subtype | Symptoms | First Check |
|---------|----------|-------------|
| TypeScript Type Mismatch | `Type 'X' is not assignable to type 'Y'` | Check interface definitions, missing fields |
| Import Error | `Cannot find module`, `Module not found` | Check path, file exists, export statement |
| Missing Dependency | `Cannot resolve`, build fails | Check `package.json`, run `npm install` |
| Bundler Config | Vite errors, chunk issues | Check `vite.config.ts` |

### Type 2: Runtime Errors
| Subtype | Symptoms | First Check |
|---------|----------|-------------|
| Null/Undefined Reference | `Cannot read property of undefined` | Check data loading, optional chaining |
| React Component Error | White screen, component crash | Check props, useEffect dependencies |
| Async/Promise Error | Unhandled rejection, hanging | Check await, error handling |
| State Management | Stale data, wrong values | Check React Query keys, state updates |

### Type 3: Data Layer Errors ⭐ (CRITICAL)
| Subtype | Symptoms | First Check |
|---------|----------|-------------|
| Data Not Saved | Insert succeeds but fields NULL | **TRACE DATA FLOW** (Section 4.1) |
| Data Not Updated | Update call succeeds but no change | Check WHERE clause, RLS policies |
| Wrong Schema | `relation does not exist` | Check schema prefix, client config |
| Missing Permissions | Empty results, permission denied | Check GRANT statements, RLS |

### Type 4: Network/API Errors
| Subtype | Symptoms | First Check |
|---------|----------|-------------|
| CORS Error | `Access-Control-Allow-Origin` | Check Edge Function headers |
| Timeout | Request hangs, 504 | Check function execution time |
| 4xx Errors | 400, 401, 403, 404 | Check request payload, auth token |
| 5xx Errors | 500, 502, 503 | Check Edge Function logs |

### Type 5: Auth/Permission Errors
| Subtype | Symptoms | First Check |
|---------|----------|-------------|
| Session Expired | Redirect to login, 401 | Check token refresh, session timeout |
| RLS Blocking | Empty results for user | Check RLS policies (Section 4.3) |
| Role Permission | Action denied | Check user_roles, permission grants |
| JWT Invalid | Auth errors | Check token format, expiry |

### Type 6: Deployment Errors
| Subtype | Symptoms | First Check |
|---------|----------|-------------|
| Version Mismatch | Code looks correct but wrong behavior | Compare local vs deployed code |
| Env Vars Missing | `undefined` in production | Check Supabase Secrets |
| Migration Not Applied | Schema mismatch | Run `supabase db push` |
| Edge Function Stale | Old behavior persists | Redeploy function |

---

## 4. DEBUGGING PROTOCOLS

### 4.1 DATA FLOW TRACING PROTOCOL ⭐

**WHEN TO USE:** Data not saved correctly, fields are NULL despite code setting them.

**THE 5-LAYER TRACE:**

```
┌─────────────────────────────────────────────────────────────┐
│  Layer 1: CODE                                              │
│  Does code set the value correctly?                         │
├─────────────────────────────────────────────────────────────┤
│  Layer 2: SUPABASE CLIENT                                   │
│  Which schema is client configured to use?                  │
├─────────────────────────────────────────────────────────────┤
│  Layer 3: TARGET OBJECT                                     │
│  Is target a TABLE or VIEW?                                 │
├─────────────────────────────────────────────────────────────┤
│  Layer 4: TRIGGER/RULE                                      │
│  If VIEW, does trigger forward ALL fields?                  │
├─────────────────────────────────────────────────────────────┤
│  Layer 5: ACTUAL TABLE                                      │
│  What is actually stored in the database?                   │
└─────────────────────────────────────────────────────────────┘
```

**STEP-BY-STEP:**

#### Layer 1: CODE
```typescript
// Check: Does code set the value?
const record = {
  name: 'test',
  qualified_at: new Date().toISOString(), // ← Is this line present?
  lock_date: lockDate.toISOString(),      // ← Is this line present?
};
await supabase.from('table').insert(record);
```

#### Layer 2: SUPABASE CLIENT
```typescript
// Check: Which schema is client using?
const supabase = createClient(url, key, {
  db: {
    schema: 'api'  // ← What schema? 'api', 'public', or custom?
  }
});

// Or check if .schema() is called
await supabase.schema('api').from('table')...
```

#### Layer 3: TARGET OBJECT
```sql
-- Check: Is it TABLE or VIEW?
SELECT table_schema, table_type
FROM information_schema.tables
WHERE table_name = 'your_table_name';

-- Result: 'BASE TABLE' = real table, 'VIEW' = view (needs trigger check!)
```

#### Layer 4: TRIGGER/RULE (Critical if VIEW!)
```sql
-- Check: What triggers exist on the view?
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers
WHERE event_object_table = 'your_view_name';

-- Check: Does INSERT trigger forward ALL columns?
SELECT pg_get_functiondef(oid)
FROM pg_proc
WHERE proname = 'your_view_insert_trigger';

-- ⚠️ COMMON BUG: Trigger function missing new columns!
-- Look for: INSERT INTO actual_table (col1, col2, ...)
-- Verify ALL columns from your code are listed!
```

#### Layer 5: ACTUAL TABLE
```sql
-- Check: What's actually in the database?
SELECT
  id,
  qualified_at IS NOT NULL as has_qualified_at,
  lock_date IS NOT NULL as has_lock_date,
  created_at
FROM schema.actual_table
WHERE id = 'your_record_id';
```

**REAL CASE STUDY: Commission Lock System Bug (2025-12-05)**

```
Symptom: qualified_at and lock_date always NULL despite code setting them

Investigation:
├─ Layer 1 (Code): ✅ Webhook code had: qualified_at: qualifiedAt.toISOString()
├─ Layer 2 (Client): ⚠️ Client used schema: 'api'
├─ Layer 3 (Object): ⚠️ api.commission_records is a VIEW (not table!)
├─ Layer 4 (Trigger): ❌ INSERT trigger missing qualified_at, lock_date columns!
└─ Layer 5 (Table): ❌ affiliate.commission_records had NULL values

Root Cause: VIEW's INSERT trigger was created before lock system columns were added.
            Trigger function never updated to forward new columns.

Fix: Update trigger function to include qualified_at, lock_date, commission_month
```

---

### 4.2 SUPABASE SCHEMA DEBUGGING

#### Check Object Schema
```sql
-- Find which schema(s) contain your table/view
SELECT table_schema, table_name, table_type
FROM information_schema.tables
WHERE table_name = 'your_table';
```

#### Check Permissions
```sql
-- Check who has access to the object
SELECT grantee, privilege_type
FROM information_schema.table_privileges
WHERE table_name = 'your_table'
ORDER BY grantee, privilege_type;

-- Common roles:
-- postgres: superuser (full access)
-- authenticated: logged-in users
-- anon: anonymous users
-- service_role: Edge Functions with service key
```

#### Grant Missing Permissions
```sql
-- Grant to authenticated users (FE access)
GRANT SELECT, INSERT, UPDATE, DELETE ON schema.table TO authenticated;

-- Grant to service_role (Edge Function access)
GRANT SELECT, INSERT, UPDATE, DELETE ON schema.table TO service_role;

-- Don't forget schema usage!
GRANT USAGE ON SCHEMA your_schema TO authenticated;
GRANT USAGE ON SCHEMA your_schema TO service_role;
```

---

### 4.3 RLS POLICY DEBUGGING

#### Check if RLS is Enabled
```sql
SELECT relname, relrowsecurity
FROM pg_class
WHERE relname = 'your_table';
-- relrowsecurity = true means RLS is enabled
```

#### List All Policies
```sql
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'your_table';
```

#### Test as Specific Role
```sql
-- Temporarily become the authenticated role
SET ROLE authenticated;

-- Now queries run with that role's permissions
SELECT * FROM your_table; -- See what user actually sees

-- Reset back to superuser
RESET ROLE;
```

#### Common RLS Issues
| Issue | Symptom | Fix |
|-------|---------|-----|
| No SELECT policy | Empty results | Add SELECT policy |
| Policy too restrictive | Missing expected rows | Widen policy conditions |
| Missing service_role bypass | Edge Function blocked | Add `TO service_role` policy or use SECURITY DEFINER |

---

### 4.4 WEBHOOK DEBUGGING

#### Pre-Check Checklist
- [ ] Webhook URL registered correctly in source system?
- [ ] Edge Function deployed?
- [ ] `verify_jwt: false` in config.toml (for external webhooks)?
- [ ] CORS headers present in response?

#### KiotViet Webhook Specific
```typescript
// Check payload structure
console.log('[Webhook] Received:', JSON.stringify(req.body, null, 2));

// Verify required fields
const { Id, Code, StatusValue } = invoice;
if (!Id || !Code) {
  console.error('[Webhook] Missing required fields');
}
```

#### Debug Steps
1. Check Edge Function logs in Supabase Dashboard
2. Verify webhook is being called (add console.log at start)
3. Check payload matches expected structure
4. Verify database operations succeed
5. Check response is returned (prevent timeout)

---

### 4.5 CRON JOB DEBUGGING (pg_cron)

#### Check Cron Jobs Exist
```sql
SELECT jobid, jobname, schedule, command
FROM cron.job
ORDER BY jobname;
```

#### Check Recent Executions
```sql
SELECT jobid, runid, job_pid, status, return_message, start_time, end_time
FROM cron.job_run_details
ORDER BY start_time DESC
LIMIT 20;
```

#### How Cron Jobs Work in This Project
```
pg_cron SQL function
    → Calls Edge Function via HTTP (net.http_post)
    → Edge Function executes business logic
    → Returns result to cron job
```

#### Debug Steps
1. Verify cron job exists in `cron.job`
2. Check `cron.job_run_details` for execution status
3. Check Edge Function logs (the actual logic runs there!)
4. Verify Edge Function is deployed and accessible

---

### 4.6 EDGE FUNCTION VERSION DEBUGGING

#### Symptom
Code looks correct locally but deployed function behaves differently.

#### Check Steps
1. When was function last deployed?
   - Check Supabase Dashboard → Edge Functions → your-function
   - Compare deployment time vs your local changes

2. Verify local vs deployed match
   - Read deployed code in Dashboard
   - Compare with local file

3. Force redeploy
```bash
npx supabase functions deploy your-function-name --no-verify-jwt
```

4. Check deployment logs for errors

---

### 4.7 PERFORMANCE DEBUGGING

#### Slow Query Identification
```sql
-- Find slow queries
SELECT query, calls, mean_time, total_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

#### N+1 Query Detection
- Symptom: Many similar queries in quick succession
- Check: React Query devtools, Network tab
- Fix: Use joins, batch queries, or pagination

#### Common Performance Issues
| Issue | Symptom | Fix |
|-------|---------|-----|
| Missing index | Slow SELECT | Add appropriate index |
| N+1 queries | Multiple similar queries | Use JOIN or batch |
| Large payload | Slow response | Select only needed columns |
| No pagination | Timeout on large tables | Add LIMIT/OFFSET |

---

## 5. INVESTIGATION TOOLKIT

### Essential SQL Queries

```sql
-- Find table schema
SELECT table_schema, table_type
FROM information_schema.tables
WHERE table_name = 'xxx';

-- Check if VIEW or TABLE
SELECT table_type
FROM information_schema.tables
WHERE table_schema = 'api' AND table_name = 'xxx';

-- Get VIEW definition
SELECT pg_get_viewdef('schema.view_name'::regclass, true);

-- Get trigger function code
SELECT pg_get_functiondef(oid)
FROM pg_proc
WHERE proname = 'function_name';

-- List triggers on table/view
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers
WHERE event_object_table = 'table_name';

-- Check recent records
SELECT * FROM schema.table
ORDER BY created_at DESC
LIMIT 10;

-- Check specific fields populated
SELECT
  id,
  field1 IS NOT NULL as has_field1,
  field2 IS NOT NULL as has_field2
FROM schema.table
WHERE condition;

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'xxx';

-- Check grants
SELECT grantee, privilege_type
FROM information_schema.table_privileges
WHERE table_name = 'xxx';
```

### Log Locations
| Log Type | Location |
|----------|----------|
| Edge Function logs | Supabase Dashboard → Logs → Edge Functions |
| Postgres logs | Supabase Dashboard → Logs → Postgres |
| Auth logs | Supabase Dashboard → Logs → Auth |
| Cron job results | `SELECT * FROM cron.job_run_details ORDER BY start_time DESC` |
| FE console | Browser DevTools → Console |
| Network requests | Browser DevTools → Network |

---

## 6. COMMON FIX PATTERNS

### Pattern 1: VIEW Trigger Missing Columns
```
Symptom: New fields always NULL despite code setting them
Cause: INSERT trigger on VIEW doesn't include new columns
Fix: Update trigger function to include ALL columns

-- Example fix:
CREATE OR REPLACE FUNCTION schema.view_insert_trigger()
RETURNS trigger AS $$
BEGIN
  INSERT INTO actual_schema.actual_table (
    existing_col1, existing_col2,
    new_col1, new_col2  -- ADD NEW COLUMNS HERE
  ) VALUES (
    NEW.existing_col1, NEW.existing_col2,
    NEW.new_col1, NEW.new_col2  -- AND HERE
  ) RETURNING id INTO NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Pattern 2: Schema Mismatch
```
Symptom: "relation does not exist" or wrong data
Cause: Querying wrong schema
Fix: Add .schema() or use correct RPC

-- Wrong
supabase.from('table')...

-- Correct
supabase.schema('api').from('table')...
-- or
supabase.schema('api').rpc('function_name', params)
```

### Pattern 3: RLS Blocking Data
```
Symptom: Empty results for authenticated user
Cause: RLS policy too restrictive or missing
Fix: Create appropriate policy

-- Example: Allow authenticated users to read all
CREATE POLICY "Allow authenticated read"
ON schema.table FOR SELECT
TO authenticated
USING (true);
```

### Pattern 4: Edge Function Not Updated
```
Symptom: Code looks correct but old behavior persists
Cause: Deployed version differs from local
Fix: Redeploy

npx supabase functions deploy function-name --no-verify-jwt
```

### Pattern 5: Missing Grants
```
Symptom: Permission denied or empty results
Cause: Role doesn't have access
Fix: Grant permissions

GRANT SELECT, INSERT, UPDATE ON schema.table TO authenticated;
GRANT SELECT, INSERT, UPDATE ON schema.table TO service_role;
GRANT USAGE ON SCHEMA schema TO authenticated;
GRANT USAGE ON SCHEMA schema TO service_role;
```

---

## 7. OUTPUT FORMAT

### For Quick/Simple Fixes
```
> 🔴 **Root Cause:** [1-2 sentence explanation]
> 🟢 **Fix:**
> ```language
> [code block]
> ```
> ✅ **Verify:** [How to test the fix worked]
```

### For Complex/Multi-Layer Issues
```
> 📍 **Symptom:** [What user reported]
>
> 🔍 **Investigation (Layer-by-Layer):**
> | Layer | Check | Result |
> |-------|-------|--------|
> | 1. Code | Does code set value? | ✅/❌ |
> | 2. Client | Which schema? | api/public/custom |
> | 3. Object | TABLE or VIEW? | ✅/❌ |
> | 4. Trigger | Forwards all fields? | ✅/❌ |
> | 5. Table | Actual data? | ✅/❌ |
>
> 🔴 **Root Cause:** [Found at Layer X - detailed explanation]
>
> 🟢 **Fix:**
> ```language
> [code/SQL block]
> ```
>
> ✅ **Verify:**
> 1. [Step 1]
> 2. [Step 2]
>
> 📚 **Lesson Learned:** [What to check next time]
```

---

## 8. LESSONS LEARNED (Case Studies)

### Case 1: Commission Lock Fields Not Saved (2025-12-05)

**Context:** Webhook set `qualified_at` and `lock_date` but DB always had NULL.

**Wrong Approaches Tried:**
1. ❌ Only checked webhook code → "Code is correct"
2. ❌ Only checked cron code → "Code is correct"
3. ❌ Checked deployment time → "Deployed after code was written"
4. ❌ Assumed `supabase.from()` goes directly to table

**Correct Approach:**
1. ✅ Check client schema config → Found `schema: 'api'`
2. ✅ Check if `api.commission_records` is TABLE or VIEW → Found it's a VIEW!
3. ✅ Check VIEW's INSERT trigger → **Missing new columns!**

**Root Cause:**
- VIEW had INSERT trigger created before lock system was added
- Trigger function never updated to forward `qualified_at`, `lock_date`, `commission_month`
- Data went into the void

**Lesson:** When data not saved, ALWAYS trace the full data flow through all layers. Don't stop at "code looks correct".

---

## 9. DEBUGGING MINDSET

### DO
- ✅ Trace data through ALL layers
- ✅ Question every assumption
- ✅ Check actual database state (not just code)
- ✅ Verify deployed code matches local
- ✅ Read trigger/function definitions

### DON'T
- ❌ Stop at "code looks correct"
- ❌ Assume direct table access
- ❌ Ignore schema configuration
- ❌ Skip checking VIEWs and triggers
- ❌ Trust that deployed = local

---

**Version History:**
- V1.0: Basic framework (35 lines)
- V2.0: Complete rewrite with Data Flow Tracing, real case studies, comprehensive patterns (400+ lines)
