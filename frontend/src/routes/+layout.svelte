<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import '../styles/global.css';
  import Toast from '$lib/components/ui/Toast.svelte';
  import { toastStore } from '$lib/stores/ui';
  import { authStore } from '$lib/stores/auth';
  import { locale, initializeI18n, initializeLocale, setLocale, updateDocumentAttributes } from '$lib/i18n';
  
  // Protected routes
  const protectedRoutes = ['/', '/dashboard', '/vehicles', '/add', '/reports', '/settings'];
  
  // Initialize i18n on mount (only in browser)
  onMount(() => {
    if (browser) {
      // مقداردهی اولیه سیستم i18n
      initializeI18n();

      // تنظیم زبان اولیه
      const initialLocale = initializeLocale();
      setLocale(initialLocale);
    }
  });

  // Update document attributes when locale changes
  $effect(() => {
    if (browser && $locale) {
      updateDocumentAttributes($locale);
    }
  });

  // Client-side route guard
  $effect(() => {
    const path = $page.url.pathname;
    const isProtected = protectedRoutes.some(route => path === route || path.startsWith(route + '/'));
    const isAuth = authStore.isAuthenticated();

    // Redirect to login if accessing protected route without auth
    if (isProtected && !isAuth && typeof window !== 'undefined') {
      goto('/login');
    }

    // Redirect to dashboard if accessing login/register with auth
    if ((path === '/login' || path === '/register') && isAuth && typeof window !== 'undefined') {
      goto('/dashboard');
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

