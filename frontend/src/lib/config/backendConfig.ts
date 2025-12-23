/**
 * تنظیمات Backend
 * 
 * این فایل نوع backend را تعیین می‌کند:
 * - 'mock': استفاده از Mock data (برای تست و یادگیری)
 * - 'supabase': استفاده از Supabase (برای production)
 * - 'django': استفاده از Django REST API (برای آینده)
 * 
 * برای تغییر:
 * 1. متغیر BACKEND_TYPE را تغییر دهید
 * 2. یا در .env: VITE_BACKEND_TYPE=mock|supabase|django
 */

export type BackendType = 'mock' | 'supabase' | 'django';

// دریافت از environment variable یا استفاده از پیش‌فرض
const backendTypeFromEnv = import.meta.env.VITE_BACKEND_TYPE as BackendType | undefined;

// تعیین نوع backend
export const BACKEND_TYPE: BackendType = 
  backendTypeFromEnv && ['mock', 'supabase', 'django'].includes(backendTypeFromEnv)
    ? backendTypeFromEnv
    : 'supabase'; // پیش‌فرض: supabase

// Helper functions
export const isMock = () => BACKEND_TYPE === 'mock';
export const isSupabase = () => BACKEND_TYPE === 'supabase';
export const isDjango = () => BACKEND_TYPE === 'django';

// Log برای debugging
if (import.meta.env.DEV) {
  console.log(`🔧 Backend Type: ${BACKEND_TYPE}`);
}

