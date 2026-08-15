import type {
  AuthResponse,
  Branch,
  CheckoutResponse,
  CreateStudentPayload,
  Lead,
  LeadPayload,
  NewsPost,
  Review,
  ScheduleSlot,
  ScheduleSlotPayload,
  StudentView,
  Tariff,
  Trainer,
} from "./types";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080"}/api`;
const TOKEN_KEY = "cd_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed: ${path} (${res.status})`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

const getJson = <T>(path: string) => request<T>(path);
const postJson = <T>(path: string, body: unknown) => request<T>(path, { method: "POST", body: JSON.stringify(body) });
const putJson = <T>(path: string, body: unknown) => request<T>(path, { method: "PUT", body: JSON.stringify(body) });
const patchJson = <T>(path: string, body: unknown) => request<T>(path, { method: "PATCH", body: JSON.stringify(body) });
const del = (path: string) => request<void>(path, { method: "DELETE" });

export const api = {
  branches: () => getJson<Branch[]>("/branches"),
  trainers: () => getJson<Trainer[]>("/trainers"),
  tariffs: () => getJson<Tariff[]>("/tariffs"),
  schedule: () => getJson<ScheduleSlot[]>("/schedule"),
  news: () => getJson<NewsPost[]>("/news"),
  reviews: () => getJson<Review[]>("/reviews"),
  submitLead: (payload: LeadPayload) => postJson("/leads", payload),

  auth: {
    login: (email: string, password: string) => postJson<AuthResponse>("/auth/login", { email, password }),
    register: (fullName: string, email: string, password: string) =>
      postJson<AuthResponse>("/auth/register", { fullName, email, password }),
  },

  students: {
    list: () => getJson<StudentView[]>("/students"),
    create: (payload: CreateStudentPayload) => postJson<StudentView>("/students", payload),
  },

  payments: {
    checkout: (studentId: number, tariffId: number) =>
      postJson<CheckoutResponse>("/payments/checkout", { studentId, tariffId }),
  },

  admin: {
    leads: {
      list: () => getJson<Lead[]>("/admin/leads"),
      setStatus: (id: number, status: string) => patchJson<Lead>(`/admin/leads/${id}`, { status }),
    },
    schedule: {
      create: (payload: ScheduleSlotPayload) => postJson<ScheduleSlot>("/admin/schedule", payload),
      update: (id: number, payload: ScheduleSlotPayload) => putJson<ScheduleSlot>(`/admin/schedule/${id}`, payload),
      remove: (id: number) => del(`/admin/schedule/${id}`),
    },
    news: {
      create: (payload: Partial<NewsPost>) => postJson<NewsPost>("/admin/news", payload),
      update: (id: number, payload: Partial<NewsPost>) => putJson<NewsPost>(`/admin/news/${id}`, payload),
      remove: (id: number) => del(`/admin/news/${id}`),
    },
  },
};
