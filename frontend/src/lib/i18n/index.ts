import { register, init, getLocaleFromNavigator, locale, dictionary } from 'svelte-i18n';

import fa from './fa.json';
import en from './en.json';
import ar from './ar.json';

// متغیر برای پیگیری مقداردهی اولیه
let isInitialized = false;

// تابع مقداردهی اولیه سیستم i18n
export function initializeI18n(initialLocale: string = 'fa') {
  if (isInitialized) return;

  // ثبت زبان‌ها
  register('fa', () => Promise.resolve(fa));
  register('en', () => Promise.resolve(en));
  register('ar', () => Promise.resolve(ar));

  // مقداردهی اولیه سیستم i18n
  init({
    fallbackLocale: 'fa',
    initialLocale,
  });

  isInitialized = true;
}

// تنظیم زبان پیش‌فرض بر اساس مرورگر یا ذخیره شده (فقط در کلاینت)
export function initializeLocale(): string {
  // بررسی وجود localStorage (کلاینت)
  if (typeof localStorage === 'undefined') {
    return 'fa'; // در SSR پیش‌فرض فارسی
  }

  // ابتدا بررسی localStorage
  const savedLocale = localStorage.getItem('locale');
  if (savedLocale && ['fa', 'en', 'ar'].includes(savedLocale)) {
    return savedLocale;
  }

  // سپس بررسی زبان مرورگر
  const browserLocale = getLocaleFromNavigator();
  if (browserLocale?.startsWith('fa')) return 'fa';
  if (browserLocale?.startsWith('ar')) return 'ar';
  if (browserLocale?.startsWith('en')) return 'en';

  // پیش‌فرض فارسی
  return 'fa';
}

// تابع تغییر زبان با ذخیره در localStorage و تنظیم جهت صفحه
export function setLocale(newLocale: string) {
  if (!['fa', 'en', 'ar'].includes(newLocale)) {
    console.warn(`Unsupported locale: ${newLocale}`);
    return;
  }

  // ذخیره در localStorage (اگر در کلاینت هستیم)
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('locale', newLocale);
  }

  // تغییر زبان در svelte-i18n
  locale.set(newLocale);

  // تنظیم جهت صفحه و زبان HTML (اگر در کلاینت هستیم)
  if (typeof document !== 'undefined') {
    updateDocumentAttributes(newLocale);
  }
}

// تنظیم ویژگی‌های document بر اساس زبان
export function updateDocumentAttributes(locale: string) {
  // چک کردن وجود document (کلاینت)
  if (typeof document === 'undefined') {
    return;
  }

  const html = document.documentElement;

  switch (locale) {
    case 'ar':
      html.setAttribute('dir', 'rtl');
      html.setAttribute('lang', 'ar');
      break;
    case 'fa':
      html.setAttribute('dir', 'rtl');
      html.setAttribute('lang', 'fa');
      break;
    case 'en':
    default:
      html.setAttribute('dir', 'ltr');
      html.setAttribute('lang', 'en');
      break;
  }
}

// صادر کردن locale store برای استفاده در کامپوننت‌ها
export { locale };
