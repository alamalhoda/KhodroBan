<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { fade, fly } from 'svelte/transition';
  import { authStore, currentUser, isPro, reminderStats } from '../../stores';
  import { MENU_ITEMS, APP_NAME } from '../../utils/constants';
  import { navigateTo } from '../../utils/navigation';
  import { getBasePath } from '../../utils/config';

  interface Props {
    open?: boolean;
  }

  let {
    open = $bindable(false),
  }: Props = $props();

  const dispatch = createEventDispatcher();

  function close() {
    open = false;
    dispatch('close');
  }

  async function handleLogout() {
    authStore.logout();
    await navigateTo('/login');
    close();
  }

  async function handleNavigation(path: string) {
    console.log('Sidebar navigation:', path);
    await navigateTo(path);
    close();
  }

  // Check if current path matches menu item
  function isActive(path: string): boolean {
    const currentPath = $page.url.pathname;
    const basePath = getBasePath();
    
    // Remove base path from current path for comparison
    const cleanPath = basePath && currentPath.startsWith(basePath) 
      ? currentPath.slice(basePath.length) || '/' 
      : currentPath;
    
    // Handle dashboard route (can be / or /dashboard)
    if (path === '/dashboard') {
      return cleanPath === '/' || cleanPath === '/dashboard' || cleanPath.startsWith('/dashboard/');
    }
    
    return cleanPath === path || cleanPath.startsWith(path + '/');
  }
</script>

{#if open}
  <div class="sidebar-backdrop" transition:fade={{ duration: 200 }} onclick={close}></div>
{/if}

<aside class="sidebar" class:open transition:fly={{ x: 200, duration: 300 }}>
  <div class="sidebar-header">
    <div class="sidebar-logo">
      <span class="logo-icon">🚗</span>
      <span class="logo-text">{APP_NAME}</span>
    </div>
    <button class="sidebar-close hide-desktop" onclick={close} aria-label="بستن">✕</button>
  </div>

  <div class="sidebar-user">
    <div class="user-avatar">👤</div>
    <div class="user-info">
      <span class="user-name">{$currentUser?.name || 'کاربر'}</span>
      <span class="user-tier" class:pro={$isPro}>
        {$isPro ? '✨ Pro' : 'رایگان'}
      </span>
    </div>
  </div>

  <nav class="sidebar-nav">
    {#each MENU_ITEMS as item}
      {@const isItemActive = isActive(item.path)}
      <button
        onclick={() => handleNavigation(item.path)}
        class="nav-item"
        class:active={isItemActive}
        type="button"
      >
        <span class="nav-icon">{item.icon}</span>
        <span class="nav-label">{item.label}</span>
        {#if item.path === '/dashboard' && $reminderStats.overdue > 0}
          <span class="nav-badge danger">{$reminderStats.overdue}</span>
        {/if}
      </button>
    {/each}
  </nav>

  <div class="sidebar-footer">
    {#if !$isPro}
      <button class="upgrade-btn" onclick={() => handleNavigation('/settings')} type="button">
        <span>🌟</span>
        <span>ارتقا به Pro</span>
      </button>
    {/if}
    
    <button class="logout-btn" onclick={handleLogout}>
      <span>🚪</span>
      <span>خروج</span>
    </button>
  </div>
</aside>

<style>
  .sidebar-backdrop {
    position: fixed;
    inset: 0;
    z-index: calc(var(--z-fixed) - 1);
    background: rgba(0, 0, 0, 0.5);
  }

  .sidebar {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: var(--z-fixed);
    width: 280px;
    max-width: 85vw;
    background: var(--glass-bg-solid);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border-left: 1px solid var(--glass-border);
    box-shadow: -4px 0 30px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  }

  .sidebar.open {
    transform: translateX(0);
  }

  @media (min-width: 1024px) {
    .sidebar {
      transform: translateX(0);
      position: sticky;
      top: 0;
      height: 100vh;
      box-shadow: none;
    }
  }

  .sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }

  .sidebar-logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .logo-icon {
    font-size: 1.5rem;
  }

  .logo-text {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--color-primary);
  }

  .sidebar-close {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
  }

  .sidebar-user {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1.25rem;
    background: rgba(30, 58, 138, 0.05);
  }

  .user-avatar {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
    color: white;
    border-radius: 12px;
    font-size: 1.5rem;
  }

  .user-info {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .user-name {
    font-weight: 600;
    color: var(--color-text);
  }

  .user-tier {
    font-size: 0.75rem;
    color: var(--color-text-muted);
  }

  .user-tier.pro {
    color: var(--color-warning);
  }

  .sidebar-nav {
    flex: 1;
    padding: 1rem 0.75rem;
    overflow-y: auto;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1rem;
    text-decoration: none;
    color: var(--color-text);
    border-radius: 12px;
    transition: all 0.2s;
    margin-bottom: 0.25rem;
  }

  .nav-item:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  .nav-item.active {
    background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
    color: white;
    box-shadow: 0 4px 15px rgba(30, 58, 138, 0.3);
  }

  .nav-icon {
    font-size: 1.25rem;
    width: 24px;
    text-align: center;
  }

  .nav-label {
    flex: 1;
    font-weight: 500;
  }

  .nav-badge {
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    font-size: 0.6875rem;
    font-weight: 600;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-badge.danger {
    background: var(--color-danger);
    color: white;
  }

  .sidebar-footer {
    padding: 1rem;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .upgrade-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.875rem;
    background: linear-gradient(135deg, var(--color-warning), #F97316);
    color: white;
    text-decoration: none;
    border-radius: 12px;
    font-weight: 600;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .upgrade-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
  }

  .logout-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.875rem;
    border: none;
    background: transparent;
    color: var(--color-text-light);
    font-family: inherit;
    font-size: 0.9375rem;
    border-radius: 12px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .logout-btn:hover {
    background: rgba(239, 68, 68, 0.1);
    color: var(--color-danger);
  }

  .hide-desktop {
    display: flex;
  }

  @media (min-width: 1024px) {
    .hide-desktop {
      display: none;
    }

    .sidebar-backdrop {
      display: none;
    }
  }
</style>
