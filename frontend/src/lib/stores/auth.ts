import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';
import type { User, AuthState } from '../types';

// Helper function to safely get token from localStorage
function getToken(): string | null {
  if (!browser) return null;
  return localStorage.getItem('token');
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: getToken(),
  isLoading: false,
  error: null,
};

// Create the store
function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>(initialState);

  return {
    subscribe,
    
    // Check if user is authenticated
    isAuthenticated(): boolean {
      const state = get({ subscribe });
      return !!state.token;
    },

    // Set loading state
    setLoading(isLoading: boolean) {
      update(state => ({ ...state, isLoading, error: null }));
    },

    // Login success
    loginSuccess(user: User, token: string) {
      if (browser) {
        localStorage.setItem('token', token);
      }
      update(state => ({
        ...state,
        user,
        token,
        isLoading: false,
        error: null,
      }));
    },

    // Login failure
    loginFailure(error: string) {
      update(state => ({
        ...state,
        user: null,
        token: null,
        isLoading: false,
        error,
      }));
    },

    // Logout
    logout() {
      if (browser) {
        localStorage.removeItem('token');
      }
      set({
        user: null,
        token: null,
        isLoading: false,
        error: null,
      });
    },

    // Update user profile
    updateUser(user: Partial<User>) {
      update(state => ({
        ...state,
        user: state.user ? { ...state.user, ...user } : null,
      }));
    },

    // Clear error
    clearError() {
      update(state => ({ ...state, error: null }));
    },

    // Check if user is Pro
    isPro(): boolean {
      const state = get({ subscribe });
      return state.user?.tier === 'pro';
    },
  };
}

export const authStore = createAuthStore();

// Derived store for checking if authenticated
export const isAuthenticated = derived(authStore, $auth => !!$auth.token);

// Derived store for current user
export const currentUser = derived(authStore, $auth => $auth.user);

// Derived store for checking Pro status
export const isPro = derived(authStore, $auth => $auth.user?.tier === 'pro');
