/**
 * Configuration helper
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

// Get redirect base URL
function getRedirectBaseUrl(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  try {
    const env = typeof import.meta !== 'undefined' ? (import.meta as any).env || {} : {};

    // Use explicit environment variable if provided
    if (env.VITE_REDIRECT_BASE_URL) {
      return String(env.VITE_REDIRECT_BASE_URL);
    }

    // Otherwise, construct from current location
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const port = window.location.port ? `:${window.location.port}` : '';

    const url = `${protocol}//${hostname}${port}`;

    // Validate URL
    try {
      new URL(url);
      return url;
    } catch {
      return `${protocol}//${hostname}${port}`;
    }
  } catch (error) {
    console.warn('Error getting redirect base URL:', error);
    return typeof window !== 'undefined' ? window.location.origin : '';
  }
}

export const config = {
  redirectBaseUrl: getRedirectBaseUrl(),
  backendType: BACKEND_TYPE,
};

// Log برای debugging
if (import.meta.env.DEV) {
  console.log(`🔧 Backend Type: ${BACKEND_TYPE}`);
}

