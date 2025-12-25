<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { navigateTo } from '$lib/utils/navigation';
  import '../styles/global.css';
  import Toast from '$lib/components/ui/Toast.svelte';
  import { toastStore } from '$lib/stores/ui';
  import { authStore } from '$lib/stores/auth';
  import { authService } from '$lib/services';
  import { locale, initializeI18n, initializeLocale, setLocale, updateDocumentAttributes } from '$lib/i18n';
  
  // Protected routes
  const protectedRoutes = ['/', '/dashboard', '/vehicles', '/add', '/reports', '/settings'];
  
  // Initialize i18n immediately in browser (before hydration completes)
  $effect(() => {
    if (browser) {
      // مقداردهی اولیه سیستم i18n به صورت synchronous
      try {
        initializeI18n();
        const initialLocale = initializeLocale();
        setLocale(initialLocale);
      } catch (error) {
        console.warn('i18n initialization failed:', error);
        // Fallback to Persian if initialization fails
        initializeI18n();
        setLocale('fa');
      }
    }
  });

  // Update document attributes when locale changes
  $effect(() => {
    if (browser && $locale) {
      updateDocumentAttributes($locale);
    }
  });

  // Initialize auth state from localStorage
  $effect(() => {
    if (browser) {
      console.log('Initializing auth state...');
      // Check if we have a token and try to restore user session
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token ? 'exists' : 'not found');
      if (token && !authStore.isAuthenticated()) {
        console.log('Attempting to restore user session...');
        // Try to validate token and restore user session
        authService.getProfile().then((user) => {
          console.log('getProfile result:', user);
          if (user) {
            authStore.loginSuccess(user, token);
            console.log('User session restored successfully');
          } else {
            // Token is invalid, remove it
            console.log('Token invalid, removing...');
            localStorage.removeItem('token');
          }
        }).catch((error: unknown) => {
          console.error('Token validation failed:', error);
          // Token validation failed, remove it
          localStorage.removeItem('token');
        });
      } else {
        console.log('No token or already authenticated');
      }
    }
  });

  // Client-side route guard
  $effect(() => {
    const path = $page.url.pathname;
    const isProtected = protectedRoutes.some(route => path === route || path.startsWith(route + '/'));
    const isAuth = authStore.isAuthenticated();

    // Redirect to login if accessing protected route without auth
    if (isProtected && !isAuth && typeof window !== 'undefined') {
      navigateTo('/login');
    }

    // Note: We allow access to login/register pages even when authenticated
    // Users can access these pages to logout, switch accounts, etc.
  });
</script>

<div class="app">
  <slot />
  
  {#if $toastStore.visible}
    <Toast 
      message={$toastStore.message} 
      type={$toastStore.type} 
      on:close={() => toastStore.hide()} 
    />
  {/if}
</div>

<style>
  .app {
    min-height: 100vh;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
  }
</style>

