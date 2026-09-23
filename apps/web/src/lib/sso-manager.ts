import axios from "axios";
import { useAuthStore } from "@/lib/auth-store";

let recruitTokenCache: string | null = null;
let payrollTokenCache: string | null = null;
let recruitExchangePromise: Promise<string> | null = null;
let payrollExchangePromise: Promise<string> | null = null;

export function clearModuleTokenCache() {
  recruitTokenCache = null;
  payrollTokenCache = null;
  recruitExchangePromise = null;
  payrollExchangePromise = null;
}

export async function getRecruitToken(): Promise<string> {
  if (recruitTokenCache) return recruitTokenCache;
  if (recruitExchangePromise) return recruitExchangePromise;

  const mainToken = useAuthStore.getState().accessToken;
  if (!mainToken) throw new Error("No main access token available");

  recruitExchangePromise = (async () => {
    try {
      // 1. Get SSO ticket token from Cloud Core
      const { data: ssoRes } = await axios.post(
        "/api/v1/auth/sso/token",
        { module_id: "emp-recruit" },
        { headers: { Authorization: `Bearer ${mainToken}` } }
      );
      const ssoToken = ssoRes.data?.token || ssoRes.token;

      // 2. Exchange ticket with recruit server
      const { data: recruitRes } = await axios.post(
        "/api/recruit/auth/sso",
        { token: ssoToken }
      );

      const token = recruitRes.data?.tokens?.accessToken || recruitRes.tokens?.accessToken || ssoToken;
      recruitTokenCache = token;
      return token;
    } catch (err) {
      console.warn("Recruit SSO exchange fallback to main token:", err);
      recruitTokenCache = mainToken;
      return mainToken;
    } finally {
      recruitExchangePromise = null;
    }
  })();

  return recruitExchangePromise;
}

export async function getPayrollToken(): Promise<string> {
  if (payrollTokenCache) return payrollTokenCache;
  if (payrollExchangePromise) return payrollExchangePromise;

  const mainToken = useAuthStore.getState().accessToken;
  if (!mainToken) throw new Error("No main access token available");

  payrollExchangePromise = (async () => {
    try {
      // 1. Get SSO ticket token from Cloud Core
      const { data: ssoRes } = await axios.post(
        "/api/v1/auth/sso/token",
        { module_id: "emp-payroll" },
        { headers: { Authorization: `Bearer ${mainToken}` } }
      );
      const ssoToken = ssoRes.data?.token || ssoRes.token;

      // 2. Exchange ticket with payroll server
      const { data: payrollRes } = await axios.post(
        "/api/payroll/auth/sso",
        { token: ssoToken }
      );

      const token = payrollRes.data?.tokens?.accessToken || payrollRes.tokens?.accessToken || ssoToken;
      payrollTokenCache = token;
      return token;
    } catch (err) {
      console.warn("Payroll SSO exchange fallback to main token:", err);
      payrollTokenCache = mainToken;
      return mainToken;
    } finally {
      payrollExchangePromise = null;
    }
  })();

  return payrollExchangePromise;
}
