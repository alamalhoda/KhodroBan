// ========================================
// User & Auth Types
// ========================================

export interface User {
  id: string;
  email: string;
  name: string;
  tier: 'free' | 'pro' | 'pro+';
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

// ========================================
// Vehicle Types
// ========================================

export interface Vehicle {
  id: string;
  userId: string;
  model: string;
  year: number;
  plateNumber: string;
  currentKm: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VehiclesState {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  isLoading: boolean;
  error: string | null;
}

export interface VehicleFormData {
  model: string;
  year: number;
  plateNumber: string;
  currentKm: number;
  note?: string;
}

// ========================================
// Service Record Types
// ========================================

export type ServiceType = 
  | 'oil_change' 
  | 'filter' 
  | 'brakes' 
  | 'battery'
  | 'tire'
  | 'alignment'
  | 'suspension'
  | 'transmission'
  | 'cooling'
  | 'electrical'
  | 'ac'
  | 'exhaust'
  | 'clutch'
  | 'body'
  | 'glass'
  | 'lighting'
  | 'other';

export interface ServiceItem {
  type: ServiceType;
  cost: number;
  description?: string;
}

export interface ServiceRecord {
  id: string;
  vehicleId: string;
  date: string; // Jalali date string
  km: number;
  cost: number; // Total cost (sum of all items)
  type: ServiceType; // Primary type (for backward compatibility)
  types: ServiceType[]; // All service types
  items?: ServiceItem[]; // Detailed items with individual costs
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServicesState {
  services: ServiceRecord[];
  isLoading: boolean;
  error: string | null;
}

export interface ServiceFormData {
  vehicleId: string;
  date: string;
  km: number;
  cost: number; // Total cost
  type: ServiceType; // Primary type (for backward compatibility)
  types: ServiceType[]; // Selected service types
  items?: ServiceItem[]; // Optional: individual costs per type
  note?: string;
}

// ========================================
// Expense Types
// ========================================

export type ExpenseCategory = 'fuel' | 'wash' | 'parking' | 'toll' | 'minor_repair' | 'other';

export interface Expense {
  id: string;
  vehicleId: string;
  date: string;
  amount: number;
  category: ExpenseCategory;
  km?: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpensesState {
  expenses: Expense[];
  isLoading: boolean;
  error: string | null;
}

export interface ExpenseFormData {
  vehicleId: string;
  date: string;
  amount: number;
  category: ExpenseCategory;
  km?: number;
  note?: string;
}

// ========================================
// Reminder Types
// ========================================

export type ReminderStatus = 'ok' | 'near' | 'overdue';
export type ReminderSource = 'manual' | 'auto';
export type ReminderChannel = 'inApp' | 'email' | 'sms';

// جدید: ساختار کامل یادآور
export interface Reminder {
  id: string;
  userId: string;
  
  // ارتباطات (اختیاری)
  vehicleId?: string;
  vehicleName?: string;  // برای نمایش سریع
  serviceId?: string;
  
  // اطلاعات یادآور
  title: string;
  description?: string;
  
  // زمان‌بندی (یکی از این دو یا هر دو)
  dueDate?: string;      // تاریخ سررسید (ISO string)
  dueKm?: number;        // کیلومتر سررسید
  
  // هشدار
  warningDaysBefore: number;
  
  // وضعیت و پیام
  status: ReminderStatus;
  message: string;
  
  // متادیتا
  source: ReminderSource;
  dismissed: boolean;
  createdAt: string;
  updatedAt: string;
}

// جدید: داده ورودی برای ایجاد یادآور
export interface ReminderCreateData {
  title: string;
  description?: string;
  vehicleId?: string;
  serviceId?: string;
  dueDate?: string;
  dueKm?: number;
  warningDaysBefore?: number;
  warningKmBefore?: number;
  type?: string;
  source?: 'manual' | 'auto';
}

// جدید: داده ورودی برای ایجاد یادآور از فرم سرویس
export interface ServiceReminderData {
  vehicleId: string;
  serviceType: ServiceType;
  lastServiceDate: string;
  lastServiceKm: number;
  currentKm: number;
  warningDaysBefore?: number;
}

// ساختارهای قدیمی (برای سازگاری)
export interface ReminderSettings {
  kmInterval: number;
  timeIntervalMonths: number;
  alertDaysBefore: number;
  channels: ReminderChannel[];
}

export interface RemindersState {
  reminders: Reminder[];
  settings: ReminderSettings;
  isLoading: boolean;
  error: string | null;
}

// ========================================
// Notification Types (New System)
// ========================================

export type NotificationType = 'reminder' | 'warning' | 'info' | 'subscription';

export interface Notification {
  id: string;
  user_id: string;
  vehicle_id?: number;
  title: string;
  body: string;
  type: NotificationType;
  read: boolean;
  metadata?: {
    vehicle_model?: string;
    plate_number?: string;
    days_until_due?: number;
    interval_days?: number;
    last_service_date?: string;
    due_date?: string;
    warning_days_before?: number;
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
}

// ========================================
// Report Types
// ========================================

export interface ReportFilter {
  vehicleId?: string;
  startDate?: string;
  endDate?: string;
  type?: 'service' | 'expense' | 'all';
}

export interface ReportSummary {
  totalServiceCost: number;
  totalExpenses: number;
  totalCost: number;
  serviceCount: number;
  expenseCount: number;
  costByCategory: Record<string, number>;
  costByMonth: { month: string; amount: number }[];
}

// ========================================
// KM History Types
// ========================================

export type KmHistorySource = 'manual' | 'service' | 'expense' | 'initial';

export interface KmHistoryRecord {
  id: string;
  vehicleId: string;
  km: number;
  recordedAt: string;
  sourceType: KmHistorySource;
  sourceId?: string;
  note?: string;
  createdAt: string;
}

export interface KmHistoryState {
  history: KmHistoryRecord[];
  isLoading: boolean;
  error: string | null;
}

// ========================================
// API Response Types
// ========================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

// ========================================
// UI Types
// ========================================

export interface SelectOption {
  value: string;
  label: string;
}

export interface TabItem {
  id: string;
  label: string;
  icon?: string;
}

export interface MenuItem {
  path: string;
  label: string;
  icon: string;
  badge?: number;
}

// ========================================
// AI Chat Types
// ========================================

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  image?: string;
  isThinking?: boolean;
  mode?: 'expert' | 'fast' | 'maps';
  groundingLinks?: { title: string; uri: string }[];
}
