// Simple router for Svelte 5 with runes mode
import { writable, derived } from 'svelte/store';

// Location store (hash-based routing)
function createLocation() {
  const initialHash = typeof window !== 'undefined' ? getHash() : '/';
  const { subscribe, set, update } = writable<string>(initialHash);

  // Listen to hash changes (only in browser)
  if (typeof window !== 'undefined') {
    window.addEventListener('hashchange', () => {
      set(getHash());
    });
    
    // Initialize on mount
    set(getHash());
  }

  return {
    subscribe,
    set: (path: string) => {
      if (typeof window !== 'undefined') {
        window.location.hash = path.startsWith('#') ? path : '#' + path;
        set(getHash());
      }
    },
    update,
  };
}

function getHash(): string {
  if (typeof window === 'undefined') return '/';
  const hash = window.location.hash.slice(1) || '/';
  return hash;
}

export const location = createLocation();

// Navigation functions
export function push(path: string) {
  if (typeof window !== 'undefined') {
    location.set(path);
  }
}

export function replace(path: string) {
  if (typeof window !== 'undefined') {
    window.location.hash = path.startsWith('#') ? path : '#' + path;
    location.set(path);
  }
}

// Link action for <a> tags
export function link(node: HTMLAnchorElement) {
  if (typeof window === 'undefined') {
    return {
      destroy() {},
    };
  }

  function handleClick(e: MouseEvent) {
    const href = node.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      push(href.slice(1));
    } else if (href && !href.includes('://')) {
      e.preventDefault();
      push(href);
    }
  }

  node.addEventListener('click', handleClick);

  return {
    destroy() {
      node.removeEventListener('click', handleClick);
    },
  };
}

// Query string parser
export const querystring = derived(location, ($location) => {
  const [, query] = $location.split('?');
  const params = new URLSearchParams(query || '');
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
});

// Route matching utility
export function matchRoute(routePattern: string, path: string): { matched: boolean; params: Record<string, string> } {
  const patternParts = routePattern.split('/');
  const pathParts = path.split('/').filter((p) => p);

  if (patternParts.length !== pathParts.length && !patternParts.includes('*')) {
    // Handle catch-all
    if (patternParts[patternParts.length - 1] === '*') {
      return { matched: true, params: {} };
    }
    return { matched: false, params: {} };
  }

  const params: Record<string, string> = {};
  let matched = true;

  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i];
    const pathPart = pathParts[i];

    if (patternPart === '*') {
      break; // Catch-all matched
    }

    if (patternPart.startsWith(':')) {
      // Param match
      const paramName = patternPart.slice(1);
      params[paramName] = pathPart || '';
    } else if (patternPart !== pathPart) {
      matched = false;
      break;
    }
  }

  return { matched, params };
}

