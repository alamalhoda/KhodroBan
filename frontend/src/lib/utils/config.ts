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

export const BASE_PATH = getBasePath();
export default BASE_PATH;
