import { goto } from '$app/navigation';
import { config } from './config';

/**
 * Navigate to a path with proper base path handling
 * This works across all deployment platforms
 */
export async function navigateTo(path: string): Promise<void> {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // For GitHub Pages, we need to manually add base path
  // For other platforms, goto() handles base path automatically
  if (config.getDeployPlatform() === 'github-pages') {
    await goto(`/KhodroBan/${cleanPath}`);
  } else {
    await goto(`/${cleanPath}`);
  }
}

/**
 * Get the full URL for a path (for redirects, etc.)
 */
export function getFullPath(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${config.redirectBaseUrl}${cleanPath}`;
}
