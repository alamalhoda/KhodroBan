import { goto } from '$app/navigation';
import { base } from '$app/paths';
import { config, getBasePath, getDeployPlatform } from './config';

/**
 * Navigate to a path with proper base path handling
 * This works across all deployment platforms
 * For GitHub Pages (static sites), we use direct navigation to ensure base path is included
 */
export async function navigateTo(path: string): Promise<void> {
  // Ensure path starts with /
  const fullPath = path.startsWith('/') ? path : `/${path}`;

  const platform = getDeployPlatform();
  const detectedBasePath = getBasePath();
  
  console.log('navigateTo called:', { path, fullPath, platform, base, detectedBasePath });

  // For GitHub Pages (static sites), use direct navigation to ensure base path is correct
  if (platform === 'github-pages' && typeof window !== 'undefined') {
    const effectiveBase = detectedBasePath || base;
    const pathWithBase = `${effectiveBase}${fullPath}`.replace(/\/+/g, '/');
    console.log('GitHub Pages navigation:', pathWithBase);
    window.location.href = pathWithBase;
    return;
  }

  // For other platforms, use SvelteKit's goto()
  try {
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
      const effectiveBase = detectedBasePath || base;
      const pathWithBase = `${effectiveBase}${fullPath}`.replace(/\/+/g, '/');
      console.log('Fallback navigation:', pathWithBase);
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
