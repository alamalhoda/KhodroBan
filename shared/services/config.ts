/**
 * Configuration helper
 */

export type BackendType = 'mock' | 'supabase' | 'django';

const VALID_BACKEND_TYPES: BackendType[] = ['mock', 'supabase', 'django'];

function normalizeBackendType(value: unknown): BackendType | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  return VALID_BACKEND_TYPES.includes(value as BackendType) ? (value as BackendType) : undefined;
}

function readRuntimeBackendType(): BackendType | undefined {
  const globalBackendType = normalizeBackendType(
    (globalThis as { __OILCHENGER_BACKEND_TYPE__?: unknown }).__OILCHENGER_BACKEND_TYPE__
  );
  if (globalBackendType) {
    return globalBackendType;
  }

  const processBackendType = normalizeBackendType(
    (
      globalThis as {
        process?: { env?: Record<string, string | undefined> };
      }
    ).process?.env?.VITE_BACKEND_TYPE
  );
  if (processBackendType) {
    return processBackendType;
  }

  return normalizeBackendType((import.meta as any).env?.VITE_BACKEND_TYPE);
}

export function getBackendType(): BackendType {
  return readRuntimeBackendType() ?? 'supabase';
}

// تعیین نوع backend (default snapshot for app startup)
export const BACKEND_TYPE: BackendType = getBackendType();

// Helper functions
export const isMock = () => getBackendType() === 'mock';
export const isSupabase = () => getBackendType() === 'supabase';
export const isDjango = () => getBackendType() === 'django';

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
  backendType: getBackendType(),
};

// Log برای debugging
if ((import.meta as any).env?.DEV) {
  console.log(`🔧 Backend Type: ${BACKEND_TYPE}`);
}

