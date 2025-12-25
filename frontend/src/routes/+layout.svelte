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

  // Track if auth initialization is complete
  let authInitialized = $state(false);

  // Initialize auth state from localStorage
  $effect(() => {
    if (browser && !authInitialized) {
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
          authInitialized = true;
        }).catch((error: unknown) => {
          console.error('Token validation failed:', error);
          // Token validation failed, remove it
          localStorage.removeItem('token');
          authInitialized = true;
        });
      } else {
        console.log('No token or already authenticated');
        authInitialized = true;
      }
    }
  });

  // Client-side route guard (only after auth initialization)
  $effect(() => {
    if (!browser || !authInitialized) return;
    
    const path = $page.url.pathname;
    // Handle base path for GitHub Pages
    const basePath = path.startsWith('/KhodroBan') ? '/KhodroBan' : '';
    let cleanPath = basePath ? path.slice(basePath.length) || '/' : path;
    
    // Handle /index.html - redirect to root
    if (cleanPath === '/index.html' || cleanPath.endsWith('/index.html')) {
      cleanPath = cleanPath.replace(/\/index\.html$/, '') || '/';
      if (cleanPath !== path) {
        navigateTo(cleanPath);
        return;
      }
    }
    
    const isProtected = protectedRoutes.some(route => 
      cleanPath === route || cleanPath.startsWith(route + '/')
    );
    const isAuth = authStore.isAuthenticated();

    // Redirect to login if accessing protected route without auth
    if (isProtected && !isAuth) {
      console.log('Redirecting to login - protected route without auth', { path, cleanPath });
      navigateTo('/login');
    }
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

