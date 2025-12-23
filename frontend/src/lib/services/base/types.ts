/**
 * Type definitions برای Service Interfaces
 * 
 * این فایل interface های مشترک برای تمام service ها را تعریف می‌کند
 * تا بتوانیم به راحتی بین Mock، Supabase و Django جابه‌جا شویم
 */

import type { 
  User, 
  LoginCredentials, 
  RegisterData,
  Vehicle,
  VehicleFormData,
  ServiceRecord,
  ServiceFormData,
  Expense,
  ExpenseFormData,
  Reminder,
  ReminderSettings,
  ReportFilter,
  ReportSummary,
} from '../../types';

// ============================================
// Auth Service Interface
// ============================================

export interface IAuthService {
  login(credentials: LoginCredentials): Promise<{ user: User; token: string }>;
  register(data: RegisterData): Promise<{ user: User; token: string }>;
  loginWithGoogle(): Promise<void>;
  logout(): Promise<void>;
  getProfile(): Promise<User>;
  updateProfile(data: Partial<{ firstName: string; lastName: string }>): Promise<User>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(token: string, password: string): Promise<void>;
  upgradeToPro(): Promise<{ redirectUrl: string }>;
}

// ============================================
// Vehicle Service Interface
// ============================================

export interface IVehicleService {
  getAll(): Promise<Vehicle[]>;
  getById(id: string): Promise<Vehicle>;
  create(data: VehicleFormData): Promise<Vehicle>;
  update(id: string, data: Partial<VehicleFormData>): Promise<Vehicle>;
  delete(id: string): Promise<void>;
  updateKm(id: string, km: number): Promise<Vehicle>;
}

// ============================================
// Service Record Service Interface
// ============================================

export interface IServiceService {
  getAll(vehicleId?: string): Promise<ServiceRecord[]>;
  getById(id: string): Promise<ServiceRecord>;
  create(data: ServiceFormData): Promise<ServiceRecord>;
  update(id: string, data: Partial<ServiceFormData>): Promise<ServiceRecord>;
  delete(id: string): Promise<void>;
  getLatestForVehicle(vehicleId: string): Promise<ServiceRecord | null>;
}

// ============================================
// Expense Service Interface
// ============================================

export interface IExpenseService {
  getAll(vehicleId?: string): Promise<Expense[]>;
  getById(id: string): Promise<Expense>;
  create(data: ExpenseFormData): Promise<Expense>;
  update(id: string, data: Partial<ExpenseFormData>): Promise<Expense>;
  delete(id: string): Promise<void>;
  getByCategory(category: string): Promise<Expense[]>;
}

// ============================================
// Reminder Service Interface
// ============================================

export interface IReminderService {
  getAll(): Promise<Reminder[]>;
  getById(id: string): Promise<Reminder>;
  getByVehicle(vehicleId: string): Promise<Reminder[]>;
  dismiss(id: string): Promise<void>;
  getSettings(): Promise<ReminderSettings>;
  updateSettings(settings: Partial<ReminderSettings>): Promise<ReminderSettings>;
  calculateStatus(
    currentKm: number,
    lastServiceKm: number,
    kmInterval: number,
    lastServiceDate: string,
    timeIntervalMonths: number,
    alertDaysBefore: number
  ): { status: 'ok' | 'near' | 'overdue'; dueKm: number; message: string };
  refresh(): Promise<Reminder[]>;
}

// ============================================
// Report Service Interface
// ============================================

export interface IReportService {
  getSummary(filter?: ReportFilter): Promise<ReportSummary>;
  exportCSV(filter?: ReportFilter): Promise<Blob>;
  exportPDF(filter?: ReportFilter): Promise<Blob>;
  getMonthlyTrend(vehicleId?: string, months?: number): Promise<{ month: string; amount: number }[]>;
  downloadFile(blob: Blob, filename: string): void;
}

