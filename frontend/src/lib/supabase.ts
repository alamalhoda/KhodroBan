/**
 * Supabase Client Configuration
 * 
 * این فایل client Supabase را برای استفاده در کل اپلیکیشن ایجاد می‌کند.
 */

import { createClient } from '@supabase/supabase-js';
import { browser } from '$app/environment';
import type { Database } from './types/supabase';

// دریافت متغیرهای محیطی
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// بررسی وجود متغیرهای محیطی
if (!supabaseUrl) {
  throw new Error(
    'Missing VITE_SUPABASE_URL environment variable. ' +
    'Please check your .env file.'
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    'Missing VITE_SUPABASE_ANON_KEY environment variable. ' +
    'Please check your .env file.'
  );
}

/**
 * Supabase Client Instance
 * 
 * این client برای تمام عملیات با Supabase استفاده می‌شود.
 * شامل:
 * - Authentication (ورود، ثبت‌نام، خروج)
 * - Database queries (خواندن و نوشتن داده‌ها)
 * - Real-time subscriptions (به‌روزرسانی‌های زنده)
 * - Storage (آپلود و دانلود فایل‌ها)
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // به‌روزرسانی خودکار token
    autoRefreshToken: true,
    // ذخیره session در localStorage
    persistSession: true,
    // تشخیص session از URL (برای OAuth redirects)
    detectSessionInUrl: true,
    // مدت زمان session (ثانیه)
    // فقط در مرورگر از localStorage استفاده می‌کنیم
    storage: browser ? window.localStorage : undefined,
    storageKey: 'khodroban-auth-token',
  },
  // تنظیمات Real-time
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  // تنظیمات Global
  global: {
    headers: {
      'x-client-info': 'khodroban-frontend',
    },
  },
});

/**
 * Helper Functions
 */

/**
 * بررسی اینکه آیا کاربر لاگین کرده است یا نه
 */
export async function isAuthenticated(): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
}

/**
 * دریافت کاربر فعلی
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

/**
 * دریافت session فعلی
 */
export async function getCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}

/**
 * گوش دادن به تغییرات authentication
 * 
 * @param callback تابعی که هنگام تغییر وضعیت authentication فراخوانی می‌شود
 * @returns تابع unsubscribe
 * 
 * @example
 * ```typescript
 * const unsubscribe = onAuthStateChange((event, session) => {
 *   if (event === 'SIGNED_IN') {
 *     console.log('User signed in:', session.user);
 *   }
 * });
 * 
 * // برای توقف گوش دادن
 * unsubscribe();
 * ```
 */
export function onAuthStateChange(
  callback: (event: string, session: any) => void
) {
  return supabase.auth.onAuthStateChange(callback);
}

