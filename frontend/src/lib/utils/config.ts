/**
 * تنظیمات برنامه بر اساس محیط deploy
 */

// نوع محیط deploy
export type DeployPlatform = 'deno' | 'netlify' | 'development';

// تشخیص محیط deploy
export function getDeployPlatform(): DeployPlatform {
  // بررسی متغیر محیطی
  if (import.meta.env.DEPLOY_PLATFORM === 'deno') return 'deno';
  if (import.meta.env.NETLIFY) return 'netlify';

  // بررسی hostname
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname.includes('deno.dev')) return 'deno';
    if (hostname.includes('netlify.app')) return 'netlify';
  }

  return 'development';
}

// تنظیمات بر اساس محیط
export const config = {
  // URL پایه برای redirect
  get redirectBaseUrl(): string {
    const platform = getDeployPlatform();

    switch (platform) {
      case 'deno':
        return 'https://khodroban.deno.dev';
      case 'netlify':
        return 'https://khodroban.netlify.app';
      case 'development':
      default:
        return 'http://localhost:5173';
    }
  },

  // سایر تنظیمات
  app: {
    name: import.meta.env.VITE_APP_NAME || 'خودروبان',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  },

  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  },

  backend: {
    type: import.meta.env.VITE_BACKEND_TYPE || 'supabase',
  }
};

export default config;
