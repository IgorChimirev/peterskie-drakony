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
  photoUrl: string | null;
  user: AuthUserRef | null;
}

export interface AuthUserRef {
  id: number;
  email: string;
  fullName: string;
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
  coverImageUrl: string | null;
}

export interface Review {
  id: number;
  authorName: string;
  rating: number;
  text: string;
  approved: boolean;
  createdAt: string;
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

export type Role = "PARENT" | "TRAINER" | "ADMIN";
export type AccountType = "ADULT" | "PARENT";
export type UserStatus = "ACTIVE" | "BLOCKED";

export interface AuthUser {
  fullName: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  fullName: string;
  role: Role;
  emailVerified: boolean;
}

export interface Me {
  id: number;
  email: string;
  fullName: string;
  phone: string | null;
  role: Role;
  accountType: AccountType;
  status: UserStatus;
  emailVerified: boolean;
  phoneVerified: boolean;
}

export interface Subscription {
  id: number;
  tariff: Tariff;
  lessonsTotal: number;
  lessonsUsed: number;
  validUntil: string;
  status: "ACTIVE" | "EXPIRED";
}

export interface Homework {
  id: number;
  description: string;
  points: number;
  date: string;
  trainer: Trainer;
}

export interface TournamentResult {
  id: number;
  tournamentName: string;
  date: string;
  place: string;
  points: number;
}

export interface StudentView {
  id: number;
  fullName: string;
  age: string;
  branch: Branch | null;
  scheduleSlot: ScheduleSlot | null;
  subscriptions: Subscription[];
  homework: Homework[];
  tournamentResults: TournamentResult[];
  ratingPoints: number;
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

export interface RatingEntry {
  studentId: number;
  studentName: string;
  homeworkPoints: number;
  tournamentPoints: number;
  totalPoints: number;
}

export interface ChatMessage {
  id: number;
  threadOwner: AuthUserRef;
  sender: AuthUserRef;
  text: string;
  createdAt: string;
  readByParent: boolean;
  readByStaff: boolean;
}

export interface Notification {
  id: number;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export interface EventItem {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  coverImageUrl: string | null;
}

export interface GalleryItem {
  id: number;
  title: string;
  imageUrl: string | null;
  eventDate: string;
}

export interface LearningMaterial {
  id: number;
  title: string;
  description: string;
  fileUrl: string | null;
  category: string;
}

export interface EmailLog {
  id: number;
  toAddress: string;
  subject: string;
  body: string;
  sentAt: string;
  status: string;
}

export interface IntegrationStatus {
  key: string;
  name: string;
  status: "NOT_CONNECTED" | "STUBBED" | "CONNECTED";
  description: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalParents: number;
  totalTrainers: number;
  totalStudents: number;
  leadsByStatus: Record<string, number>;
  activeSubscriptions: number;
  totalRevenue: number;
  pendingReviews: number;
  topRating: RatingEntry[];
}

export interface BackupFile {
  name: string;
  sizeBytes: number;
  createdAtEpochMs: number;
}

export interface AdminUserView {
  id: number;
  email: string;
  fullName: string;
  phone: string | null;
  role: Role;
  accountType: AccountType;
  status: UserStatus;
  emailVerified: boolean;
  phoneVerified: boolean;
}
