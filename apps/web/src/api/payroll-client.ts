import axios from "axios";
import { getPayrollToken } from "@/lib/sso-manager";

export const payrollApi = axios.create({
  baseURL: "/api/payroll",
  headers: { "Content-Type": "application/json" },
});

payrollApi.interceptors.request.use(async (config) => {
  try {
    const token = await getPayrollToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    console.warn("Could not attach payroll token:", err);
  }
  return config;
});

export async function payrollGet<T = any>(url: string, params?: Record<string, any>): Promise<T> {
  const { data } = await payrollApi.get(url, { params });
  return data.data !== undefined ? data.data : data;
}

export async function payrollPost<T = any>(url: string, body?: any): Promise<T> {
  const { data } = await payrollApi.post(url, body);
  return data.data !== undefined ? data.data : data;
}

export async function payrollPut<T = any>(url: string, body?: any): Promise<T> {
  const { data } = await payrollApi.put(url, body);
  return data.data !== undefined ? data.data : data;
}

export async function payrollPatch<T = any>(url: string, body?: any): Promise<T> {
  const { data } = await payrollApi.patch(url, body);
  return data.data !== undefined ? data.data : data;
}

export async function payrollDelete<T = any>(url: string): Promise<T> {
  const { data } = await payrollApi.delete(url);
  return data.data !== undefined ? data.data : data;
}
