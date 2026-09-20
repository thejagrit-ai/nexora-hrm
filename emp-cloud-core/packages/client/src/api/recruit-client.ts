import axios from "axios";
import { getRecruitToken } from "@/lib/sso-manager";

export const recruitApi = axios.create({
  baseURL: "/api/recruit",
  headers: { "Content-Type": "application/json" },
});

recruitApi.interceptors.request.use(async (config) => {
  try {
    const token = await getRecruitToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    console.warn("Could not attach recruit token:", err);
  }
  return config;
});

export async function recruitGet<T = any>(url: string, params?: Record<string, any>): Promise<T> {
  const { data } = await recruitApi.get(url, { params });
  return data.data !== undefined ? data.data : data;
}

export async function recruitPost<T = any>(url: string, body?: any): Promise<T> {
  const { data } = await recruitApi.post(url, body);
  return data.data !== undefined ? data.data : data;
}

export async function recruitPut<T = any>(url: string, body?: any): Promise<T> {
  const { data } = await recruitApi.put(url, body);
  return data.data !== undefined ? data.data : data;
}

export async function recruitPatch<T = any>(url: string, body?: any): Promise<T> {
  const { data } = await recruitApi.patch(url, body);
  return data.data !== undefined ? data.data : data;
}

export async function recruitDelete<T = any>(url: string): Promise<T> {
  const { data } = await recruitApi.delete(url);
  return data.data !== undefined ? data.data : data;
}
