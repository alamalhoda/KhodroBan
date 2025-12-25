// Utilities for resolving the app's base path when deployed (e.g. GitHub Pages)
// This implementation prefers explicit Vite env vars (VITE_REPO_NAME / REPO_NAME)
// and falls back to parsing window.location.pathname in a robust way.

export function getBasePath(): string {
  // access Vite env variables (only available at build time / in browser via import.meta.env)
  const env = typeof import.meta !== 'undefined' ? (import.meta as any).env || {} : {};

  // Prefer explicitly-provided repository name(s) from env. These are commonly set for GitHub Pages deploys.
  // VITE_REPO_NAME may contain "owner/repo" or just "repo"; take the last segment as the repo name.
  const rawRepo = String(env.VITE_REPO_NAME || env.REPO_NAME || env.VITE_REPOSITORY || env.VITE_GITHUB_REPOSITORY || '').trim();
  if (rawRepo) {
    const repo = rawRepo.split('/').pop();
    if (repo) return `/${repo}`;
  }

  // Fallback: derive repository name from the current pathname (browser only)
  if (typeof window !== 'undefined' && typeof window.location === 'object') {
    const pathname = window.location.pathname || '/';
    // Normalize: remove leading and trailing slashes, then split into path segments
    const cleaned = pathname.replace(/^\/+|\/+$/g, '');
    if (!cleaned) return '';

    const segments = cleaned.split('/');

    // Typical GitHub Pages paths:
    // - https://<user>.github.io/<repo>/...  => segments[0] may be "<user>.github.io" and segments[1] is repo
    // - https://<user>.github.io/             => segments[0] is "<user>.github.io" (no repo)
    // - https://<user>.github.io/<repo>/sub   => segments[0] could be repo (if no username host segment present)
    // Heuristics:
    // If the first segment looks like a hostname (contains a dot), treat second segment as repo.
    if (segments[0].includes('.')) {
      return segments[1] ? `/${segments[1]}` : '';
    }

    // Otherwise assume the first segment is the repo name (if present)
    return `/${segments[0]}`;
  }

  // Unable to determine a base path
  return '';
}

/**
 * Detect the deployment platform
 */
export function getDeployPlatform(): 'github-pages' | 'netlify' | 'deno' | 'other' {
  if (typeof window === 'undefined') {
    return 'other';
  }

  const hostname = window.location.hostname;
  const env = typeof import.meta !== 'undefined' ? (import.meta as any).env || {} : {};

  // Check for GitHub Pages (hostname contains github.io)
  if (hostname.includes('github.io')) {
    return 'github-pages';
  }

  // Check for Netlify (hostname contains netlify.app or netlify.com)
  if (hostname.includes('netlify.app') || hostname.includes('netlify.com')) {
    return 'netlify';
  }

  // Check for Deno Deploy (via environment variable)
  if (env.DEPLOY_PLATFORM === 'deno' || (typeof process !== 'undefined' && process.env.DEPLOY_PLATFORM === 'deno')) {
    return 'deno';
  }

  return 'other';
}

/**
 * Get the redirect base URL for OAuth callbacks
 */
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
    const basePath = getBasePath();
    
    // Ensure the URL is valid
    const url = `${protocol}//${hostname}${port}${basePath}`;
    
    // Validate URL by trying to create a URL object
    try {
      new URL(url);
      return url;
    } catch {
      // If URL is invalid, return a safe fallback
      return `${protocol}//${hostname}${port}`;
    }
  } catch (error) {
    // If anything goes wrong, return empty string
    console.warn('Error getting redirect base URL:', error);
    return '';
  }
}

/**
 * Configuration object with lazy evaluation
 */
export const config = {
  get redirectBaseUrl(): string {
    return getRedirectBaseUrl();
  },
};

export const BASE_PATH = getBasePath();
export default BASE_PATH;
