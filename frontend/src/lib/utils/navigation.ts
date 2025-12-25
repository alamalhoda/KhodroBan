import { goto } from '$app/navigation';
import { base } from '$app/paths';
import { config } from './config';
import { getDeployPlatform } from './config';

/**
 * Navigate to a path with proper base path handling
 * This works across all deployment platforms
 * SvelteKit's goto() automatically handles base paths configured in svelte.config.js
 */
export async function navigateTo(path: string): Promise<void> {
  // Ensure path starts with /
  const fullPath = path.startsWith('/') ? path : `/${path}`;

  const platform = getDeployPlatform();
  console.log('navigateTo called:', { path, fullPath, platform, base });

  try {
    // Use goto() - SvelteKit handles base path automatically based on kit.paths.base
    await goto(fullPath, { 
      noScroll: false,
      replaceState: false,
      keepFocus: false,
      invalidateAll: false
    });
  } catch (error) {
    console.error('Navigation error:', error);
    // Fallback: try direct navigation with base path
    if (typeof window !== 'undefined') {
      const pathWithBase = `${base}${fullPath}`.replace(/\/+/g, '/');
      window.location.href = pathWithBase;
    }
  }
}

/**
 * Get the full URL for a path (for redirects, etc.)
 */
export function getFullPath(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${config.redirectBaseUrl}${cleanPath}`;
}
