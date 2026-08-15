export interface Branch {
  id: number;
  address: string;
  note: string | null;
  workingHours: string;
  sortOrder: number;
}

export interface Trainer {
  id: number;
  fullName: string;
  title: string;
  fideRating: string | null;
  headCoach: boolean;
  achievements: string;
  sortOrder: number;
}

export interface Tariff {
  id: number;
  name: string;
  description: string;
  price: number;
  oldPrice: number | null;
  highlighted: boolean;
  sortOrder: number;
  lessonsCount: number;
}

export interface ScheduleSlot {
  id: number;
  groupName: string;
  ageRange: string;
  dayOfWeek: string;
  timeRange: string;
  capacity: number;
  booked: number;
  branch: Branch;
  trainer: Trainer;
}

export interface NewsPost {
  id: number;
  title: string;
  excerpt: string;
  body: string;
  publishedAt: string;
}

export interface Review {
  id: number;
  authorName: string;
  rating: number;
  text: string;
}

export interface LeadPayload {
  childName: string;
  childAge: string;
  parentPhone: string;
  preferredBranch: string;
  comment: string;
}

export interface Lead extends LeadPayload {
  id: number;
  createdAt: string;
  status: string;
}

export type Role = "PARENT" | "ADMIN";

export interface AuthUser {
  fullName: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  fullName: string;
  role: Role;
}

export interface Subscription {
  id: number;
  tariff: Tariff;
  lessonsTotal: number;
  lessonsUsed: number;
  validUntil: string;
  status: "ACTIVE" | "EXPIRED";
}

export interface StudentView {
  id: number;
  fullName: string;
  age: string;
  branch: Branch | null;
  subscriptions: Subscription[];
}

export interface CreateStudentPayload {
  fullName: string;
  age: string;
  branchId: number | null;
}

export interface Payment {
  id: number;
  amount: number;
  status: string;
  provider: string;
  createdAt: string;
}

export interface CheckoutResponse {
  payment: Payment;
  subscription: Subscription;
}

export interface ScheduleSlotPayload {
  groupName: string;
  ageRange: string;
  dayOfWeek: string;
  timeRange: string;
  capacity: number;
  booked: number;
  branchId: number;
  trainerId: number;
}
