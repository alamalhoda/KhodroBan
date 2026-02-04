// ========================================
// Application Constants
// ========================================

// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'خودروبان';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

// Service Types
export const SERVICE_TYPES = {
  oil_change: 'تعویض روغن',
  filter: 'فیلتر',
  brakes: 'ترمز',
  battery: 'باتری',
  tire: 'لاستیک',
  alignment: 'همراستایی',
  suspension: 'تعلیق',
  transmission: 'گیربکس',
  cooling: 'سیستم خنک‌کننده',
  electrical: 'برق',
  ac: 'کولر',
  exhaust: 'اگزوز',
  clutch: 'کلاچ',
  body: 'بدنه',
  glass: 'شیشه',
  lighting: 'چراغ',
  other: 'سایر',
} as const;

export const SERVICE_TYPE_OPTIONS = [
  { value: 'oil_change', label: 'تعویض روغن' },
  { value: 'filter', label: 'فیلتر (هوا/روغن/بنزین)' },
  { value: 'brakes', label: 'ترمز (لنت/دیسک)' },
  { value: 'battery', label: 'باتری' },
  { value: 'tire', label: 'لاستیک' },
  { value: 'alignment', label: 'همراستایی' },
  { value: 'suspension', label: 'تعلیق' },
  { value: 'transmission', label: 'گیربکس' },
  { value: 'cooling', label: 'سیستم خنک‌کننده' },
  { value: 'electrical', label: 'برق' },
  { value: 'ac', label: 'کولر' },
  { value: 'exhaust', label: 'اگزوز' },
  { value: 'clutch', label: 'کلاچ' },
  { value: 'body', label: 'بدنه' },
  { value: 'glass', label: 'شیشه' },
  { value: 'lighting', label: 'چراغ' },
  { value: 'other', label: 'سایر' },
];

// Service Categories (Grouped)
export const SERVICE_CATEGORIES = [
  {
    id: 'engine',
    label: 'موتور و روغن',
    icon: '🔧',
    items: [
      { value: 'oil_change', label: 'تعویض روغن' },
      { value: 'filter', label: 'فیلتر (هوا/روغن/بنزین)' },
      { value: 'battery', label: 'باتری' },
      { value: 'cooling', label: 'سیستم خنک‌کننده' },
    ]
  },
  {
    id: 'brakes',
    label: 'ترمز و ایمنی',
    icon: '🛡️',
    items: [
      { value: 'brakes', label: 'ترمز (لنت/دیسک)' },
      { value: 'clutch', label: 'کلاچ' },
    ]
  },
  {
    id: 'wheels',
    label: 'چرخ و تعلیق',
    icon: '🚗',
    items: [
      { value: 'tire', label: 'لاستیک' },
      { value: 'alignment', label: 'همراستایی' },
      { value: 'suspension', label: 'تعلیق' },
    ]
  },
  {
    id: 'electrical',
    label: 'برق و الکترونیک',
    icon: '⚡',
    items: [
      { value: 'electrical', label: 'برق' },
      { value: 'ac', label: 'کولر' },
      { value: 'lighting', label: 'چراغ' },
    ]
  },
  {
    id: 'transmission',
    label: 'گیربکس و اگزوز',
    icon: '⚙️',
    items: [
      { value: 'transmission', label: 'گیربکس' },
      { value: 'exhaust', label: 'اگزوز' },
    ]
  },
  {
    id: 'body',
    label: 'بدنه و شیشه',
    icon: '🔲',
    items: [
      { value: 'body', label: 'بدنه' },
      { value: 'glass', label: 'شیشه' },
    ]
  },
  {
    id: 'other',
    label: 'سایر',
    icon: '📋',
    items: [
      { value: 'other', label: 'سایر' },
    ]
  },
];

// Expense Categories
export const EXPENSE_CATEGORIES = {
  fuel: 'سوخت',
  wash: 'کارواش',
  parking: 'پارکینگ',
  toll: 'عوارض',
  minor_repair: 'تعمیرات جزئی',
  insurance: 'بیمه',
  tax: 'مالیات',
  fine: 'جریمه',
  maintenance: 'نگهداری',
  accessories: 'لوازم جانبی',
  service: 'سرویس',
  parts: 'قطعات',
  labor: 'دستمزد',
  diagnostic: 'دیاگ',
  registration: 'ثبت‌نام',
  other: 'سایر',
} as const;

export const EXPENSE_CATEGORY_OPTIONS = [
  { value: 'fuel', label: 'سوخت' },
  { value: 'wash', label: 'کارواش' },
  { value: 'parking', label: 'پارکینگ' },
  { value: 'toll', label: 'عوارض' },
  { value: 'minor_repair', label: 'تعمیرات جزئی' },
  { value: 'insurance', label: 'بیمه' },
  { value: 'tax', label: 'مالیات' },
  { value: 'fine', label: 'جریمه' },
  { value: 'maintenance', label: 'نگهداری' },
  { value: 'accessories', label: 'لوازم جانبی' },
  { value: 'service', label: 'سرویس' },
  { value: 'parts', label: 'قطعات' },
  { value: 'labor', label: 'دستمزد' },
  { value: 'diagnostic', label: 'دیاگ' },
  { value: 'registration', label: 'ثبت‌نام' },
  { value: 'other', label: 'سایر' },
];

// Expense Categories (Grouped)
export const EXPENSE_CATEGORIES_GROUPED = [
  {
    id: 'fuel',
    label: 'سوخت',
    icon: '⛽',
    items: [
      { value: 'fuel', label: 'سوخت' },
    ]
  },
  {
    id: 'maintenance',
    label: 'نگهداری و سرویس',
    icon: '🛠️',
    items: [
      { value: 'wash', label: 'کارواش' },
      { value: 'maintenance', label: 'نگهداری' },
      { value: 'service', label: 'سرویس' },
    ]
  },
  {
    id: 'legal',
    label: 'اجباری و قانونی',
    icon: '📄',
    items: [
      { value: 'insurance', label: 'بیمه' },
      { value: 'tax', label: 'مالیات' },
      { value: 'registration', label: 'ثبت‌نام' },
    ]
  },
  {
    id: 'fines',
    label: 'جریمه و عوارض',
    icon: '💸',
    items: [
      { value: 'fine', label: 'جریمه' },
      { value: 'toll', label: 'عوارض' },
    ]
  },
  {
    id: 'parts',
    label: 'قطعات و دستمزد',
    icon: '🔩',
    items: [
      { value: 'parts', label: 'قطعات' },
      { value: 'labor', label: 'دستمزد' },
      { value: 'accessories', label: 'لوازم جانبی' },
    ]
  },
  {
    id: 'parking',
    label: 'پارکینگ',
    icon: '🅿️',
    items: [
      { value: 'parking', label: 'پارکینگ' },
    ]
  },
  {
    id: 'repairs',
    label: 'تعمیرات',
    icon: '🔧',
    items: [
      { value: 'minor_repair', label: 'تعمیرات جزئی' },
      { value: 'diagnostic', label: 'دیاگ' },
    ]
  },
  {
    id: 'other',
    label: 'سایر',
    icon: '📎',
    items: [
      { value: 'other', label: 'سایر' },
    ]
  },
];

// Expense Category Icons (emoji)
export const EXPENSE_ICONS = {
  fuel: '⛽',
  wash: '🚿',
  parking: '🅿️',
  toll: '🛣️',
  minor_repair: '🔧',
  insurance: '🛡️',
  tax: '📄',
  fine: '💸',
  maintenance: '🛠️',
  accessories: '🎒',
  service: '⚙️',
  parts: '🔩',
  labor: '👷',
  diagnostic: '🔍',
  registration: '📋',
  other: '📎',
} as const;

// Reminder Channels
export const REMINDER_CHANNELS = {
  inApp: 'اعلان داخل برنامه',
  email: 'ایمیل',
  sms: 'پیامک (Pro)',
} as const;

export const REMINDER_CHANNEL_OPTIONS = [
  { value: 'inApp', label: 'اعلان داخل برنامه' },
  { value: 'email', label: 'ایمیل' },
  { value: 'sms', label: 'پیامک', isPro: true },
];

// Reminder Status
export const REMINDER_STATUS = {
  ok: { label: 'عادی', color: 'success' },
  near: { label: 'نزدیک موعد', color: 'warning' },
  overdue: { label: 'گذشته از موعد', color: 'danger' },
} as const;

// Default Settings
export const DEFAULT_KM_INTERVAL = 5000;
export const DEFAULT_TIME_INTERVAL_MONTHS = 3;
export const DEFAULT_ALERT_DAYS_BEFORE = 7;

// Freemium Limits
export const FREE_TIER_LIMITS = {
  maxVehicles: 2,
  hasCloudSync: false,
  hasExportPDF: false,
  hasSMSReminder: false,
  hasAdvancedReports: false,
};

export const PRO_TIER_FEATURES = {
  maxVehicles: Infinity,
  hasCloudSync: true,
  hasExportPDF: true,
  hasSMSReminder: true,
  hasAdvancedReports: true,
};

// Navigation Menu Items
export const MENU_ITEMS = [
  { path: '/dashboard', label: 'داشبورد', icon: '🏠' },
  { path: '/reminders', label: 'یادآورها', icon: '🔔' },
  { path: '/vehicles', label: 'خودروها', icon: '🚗' },
  { path: '/add', label: 'ثبت جدید', icon: '➕' },
  { path: '/ai-consultant', label: 'مشاور هوشمند', icon: '🤖' },
  { path: '/reports', label: 'گزارش‌ها', icon: '📊' },
  { path: '/settings', label: 'تنظیمات', icon: '⚙️' },
];

// Breakpoints for responsive design
export const BREAKPOINTS = {
  mobile: 320,
  tablet: 768,
  desktop: 1024,
  largeDesktop: 1440,
} as const;

// Date format patterns
export const DATE_FORMATS = {
  display: 'jYYYY/jMM/jDD',
  api: 'YYYY-MM-DD',
  full: 'jYYYY/jMM/jDD - HH:mm',
} as const;

// Polling intervals (in milliseconds)
export const POLL_INTERVAL = 5 * 60 * 1000; // 5 minutes for reminder refresh
