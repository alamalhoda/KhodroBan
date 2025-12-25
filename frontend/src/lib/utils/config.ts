/**
 * تنظیمات برنامه بر اساس محیط deploy
 */

// نوع محیط deploy
export type DeployPlatform = 'deno' | 'netlify' | 'github-pages' | 'development';

// Cache برای platform detection
let cachedPlatform: DeployPlatform | null = null;

// تشخیص محیط deploy (memoized)
export function getDeployPlatform(): DeployPlatform {
  // Return cached value if available
  if (cachedPlatform !== null) {
    return cachedPlatform;
  }

  // بررسی hostname (اولویت بالاتر برای runtime)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname.includes('deno.dev')) {
      cachedPlatform = 'deno';
      return cachedPlatform;
    }
    if (hostname.includes('netlify.app')) {
      cachedPlatform = 'netlify';
      return cachedPlatform;
    }
    if (hostname.includes('github.io')) {
      cachedPlatform = 'github-pages';
      return cachedPlatform;
    }
  }

  // بررسی متغیر محیطی (برای build time)
  if (import.meta.env.DEPLOY_PLATFORM === 'deno') {
    cachedPlatform = 'deno';
    return cachedPlatform;
  }
  if (import.meta.env.NETLIFY) {
    cachedPlatform = 'netlify';
    return cachedPlatform;
  }
  if (import.meta.env.GITHUB_PAGES === 'true') {
    cachedPlatform = 'github-pages';
    return cachedPlatform;
  }

  cachedPlatform = 'development';
  return cachedPlatform;
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
      case 'github-pages':
        // GitHub Pages URL pattern: username.github.io/repository-name
        if (typeof window !== 'undefined') {
          const { hostname, pathname } = window.location;
          // pathname might be '/KhodroBan/' so we take the first segment
          const pathSegments = pathname.split('/').filter(Boolean);
          const repoName = pathSegments[0] || 'KhodroBan';
          return `https://${hostname}/${repoName}`;
        }
        return 'https://alamalhoda.github.io/KhodroBan'; // fallback
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

/**
 * Get the base path for the current deployment
 * This matches the base path configured in svelte.config.js
 * For GitHub Pages, we detect the base path from the URL pathname
 */
export function getBasePath(): string {
  const platform = getDeployPlatform();
  if (platform === 'github-pages') {
    // Detect base path from current URL pathname
    // GitHub Pages URLs: username.github.io/repository-name/...
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      // Extract the first segment after the root (e.g., '/KhodroBan' from '/KhodroBan/...')
      const segments = pathname.split('/').filter(Boolean);
      if (segments.length > 0) {
        return `/${segments[0]}`;
      }
    }
    // Fallback: use env variable if available (for build time)
    return `/${import.meta.env.VITE_REPO_NAME || import.meta.env.REPO_NAME || 'KhodroBan'}`;
  }
  return '';
}

export default config;
