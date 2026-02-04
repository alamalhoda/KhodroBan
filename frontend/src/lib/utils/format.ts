// ========================================
// Formatting Utilities
// ========================================

// Lazy load persian-date only when needed (browser-only)
let PersianDate: any = null;
let persianDateLoaded = false;

function loadPersianDate() {
  if (persianDateLoaded || typeof window === 'undefined') return;
  
  persianDateLoaded = true;
  import('persian-date')
    .then((module) => {
      PersianDate = module.default || module;
    })
    .catch((error) => {
      console.warn('Failed to load persian-date:', error);
    });
}

/**
 * Format number with Persian digits and thousand separators
 */
export function formatNumber(num: number | string, usePersianDigits = true): string {
  if (num === null || num === undefined) return '';

  const formatted = Number(num).toLocaleString('fa-IR');

  if (!usePersianDigits) {
    return formatted.replace(/[۰-۹]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1728));
  }

  return formatted;
}

/**
 * Format currency (Rial/Toman)
 */
export function formatCurrency(amount: number, unit: 'rial' | 'toman' = 'rial'): string {
  const value = unit === 'toman' ? amount / 10 : amount;
  const formatted = formatNumber(Math.round(value));
  const unitLabel = unit === 'toman' ? 'تومان' : 'ریال';
  return `${formatted} ${unitLabel}`;
}

/**
 * Format kilometers
 */
export function formatKm(km: number): string {
  return `${formatNumber(km)} کیلومتر`;
}

/**
 * Convert to Persian digits
 */
export function toPersianDigits(str: string | number): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(str).replace(/[0-9]/g, (d) => persianDigits[parseInt(d)]);
}

/**
 * Convert from Persian digits to English
 */
export function toEnglishDigits(str: string): string {
  return str.replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776));
}

/**
 * Get current Jalali date
 */
export function getCurrentJalaliDate(): string {
  loadPersianDate();
  if (!PersianDate) return new Date().toISOString().split('T')[0]; // SSR fallback
  const pd = new PersianDate();
  return pd.format('YYYY/MM/DD');
}

/**
 * Add months to Jalali date
 */
export function addMonths(dateStr: string, months: number): string {
  if (!dateStr) return '';
  loadPersianDate();
  if (!PersianDate) return dateStr; // SSR fallback
  const pd = new PersianDate(dateStr);
  return pd.add('month', months).format('YYYY/MM/DD');
}

/**
 * Add days to Jalali date
 */
export function addDays(dateStr: string, days: number): string {
  if (!dateStr) return '';
  loadPersianDate();
  if (!PersianDate) return dateStr; // SSR fallback
  const pd = new PersianDate(dateStr);
  return pd.add('day', days).format('YYYY/MM/DD');
}

/**
 * Format Jalali date
 */
export function formatJalaliDate(dateStr: string): string {
  if (!dateStr) return '';

  // If already in Jalali format (contains Persian year like 1403)
  if (dateStr.includes('1403') || dateStr.includes('1402') || dateStr.includes('1404')) {
    return dateStr;
  }

  // Convert from Gregorian to Jalali
  try {
    loadPersianDate();
    if (!PersianDate) return dateStr; // SSR fallback
    const pd = new PersianDate(new Date(dateStr));
    return pd.format('YYYY/MM/DD');
  } catch {
    return dateStr;
  }
}

/**
 * Format Jalali date and time
 */
export function formatJalaliDateTime(dateStr: string): string {
  if (!dateStr) return '';

  try {
    loadPersianDate();
    if (!PersianDate) return dateStr; // SSR fallback
    
    const date = new Date(dateStr);
    const pd = new PersianDate(date);
    
    // Format: YYYY/MM/DD - HH:MM
    const datePart = pd.format('YYYY/MM/DD');
    const timePart = date.toLocaleTimeString('fa-IR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
    
    return `${datePart} - ${timePart}`;
  } catch {
    return dateStr;
  }
}

/**
 * Parse Jalali date to Date object
 */
export function parseJalaliDate(jalaliStr: string): Date {
  loadPersianDate();
  if (!PersianDate) return new Date(); // SSR fallback
  const pd = new PersianDate().parse(jalaliStr.replace(/\//g, '-'));
  return pd.toDate();
}

/**
 * Get relative time string (e.g., "۲ روز پیش")
 */
export function getRelativeTime(dateStr: string): string {
  const now = new Date();
  const date =
    dateStr.includes('1403') || dateStr.includes('1402')
      ? parseJalaliDate(dateStr)
      : new Date(dateStr);

  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'امروز';
  if (diffDays === 1) return 'دیروز';
  if (diffDays < 7) return `${toPersianDigits(diffDays)} روز پیش`;
  if (diffDays < 30) return `${toPersianDigits(Math.floor(diffDays / 7))} هفته پیش`;
  if (diffDays < 365) return `${toPersianDigits(Math.floor(diffDays / 30))} ماه پیش`;
  return `${toPersianDigits(Math.floor(diffDays / 365))} سال پیش`;
}

/**
 * Format date for display with day name
 */
export function formatDateFull(dateStr: string): string {
  if (!dateStr) return '';

  try {
    loadPersianDate();
    if (!PersianDate) return dateStr; // SSR fallback
    
    const pd =
      dateStr.includes('1403') || dateStr.includes('1402')
        ? new PersianDate().parse(dateStr.replace(/\//g, '-'))
        : new PersianDate(new Date(dateStr));

    return pd.format('dddd D MMMM YYYY');
  } catch {
    return dateStr;
  }
}

/**
 * Get current Jalali year
 */
export function getCurrentJalaliYear(): number {
  loadPersianDate();
  if (!PersianDate) return new Date().getFullYear(); // SSR fallback (Gregorian year)
  const pd = new PersianDate();
  return pd.year();
}

/**
 * Get months in Jalali calendar
 */
export function getJalaliMonths(): { value: number; label: string }[] {
  return [
    { value: 1, label: 'فروردین' },
    { value: 2, label: 'اردیبهشت' },
    { value: 3, label: 'خرداد' },
    { value: 4, label: 'تیر' },
    { value: 5, label: 'مرداد' },
    { value: 6, label: 'شهریور' },
    { value: 7, label: 'مهر' },
    { value: 8, label: 'آبان' },
    { value: 9, label: 'آذر' },
    { value: 10, label: 'دی' },
    { value: 11, label: 'بهمن' },
    { value: 12, label: 'اسفند' },
  ];
}

/**
 * Truncate text with ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}

/**
 * Capitalize first letter (for English text)
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generate a random ID
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '۰ بایت';

  const k = 1024;
  const sizes = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${formatNumber(parseFloat((bytes / Math.pow(k, i)).toFixed(2)))} ${sizes[i]}`;
}
