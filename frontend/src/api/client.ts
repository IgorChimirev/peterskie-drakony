import type {
  AdminUserView,
  AuthResponse,
  BackupFile,
  Branch,
  ChatMessage,
  CheckoutResponse,
  CreateStudentPayload,
  DashboardStats,
  EmailLog,
  EventItem,
  GalleryItem,
  Homework,
  IntegrationStatus,
  Lead,
  LeadPayload,
  LearningMaterial,
  Me,
  NewsPost,
  Notification,
  RatingEntry,
  Review,
  ScheduleSlot,
  ScheduleSlotPayload,
  StudentView,
  Tariff,
  TournamentResult,
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
  const isFormData = options.body instanceof FormData;
  const headers: Record<string, string> = {
    "ngrok-skip-browser-warning": "true",
    ...(options.body && !isFormData ? { "Content-Type": "application/json" } : {}),
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
const postForm = <T>(path: string, form: FormData) => request<T>(path, { method: "POST", body: form });

export const api = {
  branches: () => getJson<Branch[]>("/branches"),
  trainers: () => getJson<Trainer[]>("/trainers"),
  tariffs: () => getJson<Tariff[]>("/tariffs"),
  schedule: () => getJson<ScheduleSlot[]>("/schedule"),
  news: () => getJson<NewsPost[]>("/news"),
  reviews: () => getJson<Review[]>("/reviews"),
  submitReview: (payload: { authorName: string; rating: number; text: string }) => postJson("/reviews", payload),
  submitLead: (payload: LeadPayload) => postJson("/leads", payload),
  events: () => getJson<EventItem[]>("/events"),
  gallery: () => getJson<GalleryItem[]>("/gallery"),
  materials: () => getJson<LearningMaterial[]>("/materials"),
  rating: () => getJson<RatingEntry[]>("/rating"),

  auth: {
    login: (email: string, password: string) => postJson<AuthResponse>("/auth/login", { email, password }),
    register: (fullName: string, email: string, password: string, phone: string, accountType: string) =>
      postJson<AuthResponse>("/auth/register", { fullName, email, password, phone, accountType }),
    me: () => getJson<Me>("/auth/me"),
    updateMe: (payload: { fullName: string; phone: string }) => putJson<Me>("/auth/me", payload),
    requestVerification: (channel: "email" | "phone") =>
      postJson<{ sent: boolean; debugCode: string }>(`/auth/verify/${channel}/request`, {}),
    confirmVerification: (channel: "email" | "phone", code: string) =>
      request(`/auth/verify/${channel}/confirm`, { method: "POST", body: JSON.stringify({ code }) }),
  },

  students: {
    list: () => getJson<StudentView[]>("/students"),
    create: (payload: CreateStudentPayload) => postJson<StudentView>("/students", payload),
    update: (id: number, payload: CreateStudentPayload) => putJson<StudentView>(`/students/${id}`, payload),
    remove: (id: number) => del(`/students/${id}`),
    enroll: (id: number, scheduleSlotId: number) => postJson<StudentView>(`/students/${id}/enroll`, { scheduleSlotId }),
    unenroll: (id: number) => postJson<StudentView>(`/students/${id}/unenroll`, {}),
  },

  payments: {
    checkout: (studentId: number, tariffId: number) =>
      postJson<CheckoutResponse>("/payments/checkout", { studentId, tariffId }),
  },

  notifications: {
    list: () => getJson<Notification[]>("/notifications"),
    markRead: (id: number) => patchJson<Notification>(`/notifications/${id}/read`, {}),
  },

  chat: {
    messages: () => getJson<ChatMessage[]>("/chat/messages"),
    send: (text: string) => postJson<ChatMessage>("/chat/messages", { text }),
  },

  trainer: {
    me: () => getJson<Trainer>("/trainer/me"),
    schedule: () => getJson<ScheduleSlot[]>("/trainer/schedule"),
    students: () => getJson<StudentView[]>("/trainer/students"),
    homework: () => getJson<Homework[]>("/trainer/homework"),
    addHomework: (payload: { studentId: number; description: string; points: number }) =>
      postJson<Homework>("/trainer/homework", payload),
    tournamentResults: () => getJson<TournamentResult[]>("/trainer/tournament-results"),
    addTournamentResult: (payload: { studentId: number; tournamentName: string; place: string; points: number }) =>
      postJson<TournamentResult>("/trainer/tournament-results", payload),
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
    trainers: {
      create: (payload: Partial<Trainer>) => postJson<Trainer>("/admin/trainers", payload),
      update: (id: number, payload: Partial<Trainer>) => putJson<Trainer>(`/admin/trainers/${id}`, payload),
      remove: (id: number) => del(`/admin/trainers/${id}`),
    },
    tariffs: {
      create: (payload: Partial<Tariff>) => postJson<Tariff>("/admin/tariffs", payload),
      update: (id: number, payload: Partial<Tariff>) => putJson<Tariff>(`/admin/tariffs/${id}`, payload),
      remove: (id: number) => del(`/admin/tariffs/${id}`),
    },
    events: {
      list: () => getJson<EventItem[]>("/admin/events"),
      create: (payload: Partial<EventItem>) => postJson<EventItem>("/admin/events", payload),
      update: (id: number, payload: Partial<EventItem>) => putJson<EventItem>(`/admin/events/${id}`, payload),
      remove: (id: number) => del(`/admin/events/${id}`),
    },
    gallery: {
      list: () => getJson<GalleryItem[]>("/admin/gallery"),
      create: (payload: Partial<GalleryItem>) => postJson<GalleryItem>("/admin/gallery", payload),
      remove: (id: number) => del(`/admin/gallery/${id}`),
    },
    materials: {
      list: () => getJson<LearningMaterial[]>("/admin/materials"),
      create: (payload: Partial<LearningMaterial>) => postJson<LearningMaterial>("/admin/materials", payload),
      remove: (id: number) => del(`/admin/materials/${id}`),
    },
    reviews: {
      list: () => getJson<Review[]>("/admin/reviews"),
      approve: (id: number) => patchJson<Review>(`/admin/reviews/${id}/approve`, {}),
      remove: (id: number) => del(`/admin/reviews/${id}`),
    },
    users: {
      list: () => getJson<AdminUserView[]>("/admin/users"),
      create: (payload: { fullName: string; email: string; password: string; role: string; trainerId?: number }) =>
        postJson<AdminUserView>("/admin/users", payload),
      setRole: (id: number, role: string) => patchJson<AdminUserView>(`/admin/users/${id}/role`, { role }),
      setStatus: (id: number, status: string) => patchJson<AdminUserView>(`/admin/users/${id}/status`, { status }),
    },
    chat: {
      threads: () => getJson<{ id: number; fullName: string; email: string }[]>("/admin/chat/threads"),
      messages: (parentId: number) => getJson<ChatMessage[]>(`/admin/chat/threads/${parentId}/messages`),
      reply: (parentId: number, text: string) => postJson<ChatMessage>(`/admin/chat/threads/${parentId}/messages`, { text }),
    },
    stats: () => getJson<DashboardStats>("/admin/stats"),
    integrations: {
      list: () => getJson<IntegrationStatus[]>("/admin/integrations"),
      emails: () => getJson<EmailLog[]>("/admin/integrations/emails"),
    },
    backup: {
      list: () => getJson<BackupFile[]>("/admin/backup"),
      create: () => postJson<BackupFile>("/admin/backup", {}),
    },
    rating: {
      recalculate: () => postJson<{ studentsUpdated: number }>("/admin/rating/recalculate", {}),
    },
    media: {
      upload: (file: File) => {
        const form = new FormData();
        form.append("file", file);
        return postForm<{ url: string }>("/admin/media/upload", form);
      },
    },
  },
};
