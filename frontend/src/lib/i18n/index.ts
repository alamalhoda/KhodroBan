import { register, init, getLocaleFromNavigator, locale } from 'svelte-i18n';

import fa from './fa.json';
import en from './en.json';
import ar from './ar.json';

// ثبت زبان‌ها
register('fa', () => Promise.resolve(fa));
register('en', () => Promise.resolve(en));
register('ar', () => Promise.resolve(ar));

// تنظیم زبان پیش‌فرض بر اساس مرورگر یا ذخیره شده
const getInitialLocale = (): string => {
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
};

// مقداردهی اولیه سیستم i18n
init({
  fallbackLocale: 'fa',
  initialLocale: getInitialLocale(),
});

// تابع تغییر زبان با ذخیره در localStorage و تنظیم جهت صفحه
export function setLocale(newLocale: string) {
  if (!['fa', 'en', 'ar'].includes(newLocale)) {
    console.warn(`Unsupported locale: ${newLocale}`);
    return;
  }

  // ذخیره در localStorage
  localStorage.setItem('locale', newLocale);

  // مقداردهی مجدد سیستم i18n
  init({
    fallbackLocale: 'fa',
    initialLocale: newLocale,
  });

  // تنظیم جهت صفحه و زبان HTML
  updateDocumentAttributes(newLocale);
}

// تنظیم ویژگی‌های document بر اساس زبان
export function updateDocumentAttributes(locale: string) {
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
