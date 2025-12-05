import { getCurrentUser } from "@/lib/auth";

export interface AuthEventDetail {
  redirectTo?: string;
}

export const requireAuthForCart = (redirectTo?: string): boolean => {
  const user = getCurrentUser();
  if (user) return true;
  if (typeof window !== "undefined") {
    const back = redirectTo || (window.location?.pathname + window.location?.search);
    window.dispatchEvent(new CustomEvent<AuthEventDetail>("open-otp-login", { detail: { redirectTo: back } as AuthEventDetail } as any));
  }
  return false;
};
