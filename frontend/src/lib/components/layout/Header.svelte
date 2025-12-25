<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore, currentUser, activeReminders } from '../../stores';
  import { APP_NAME } from '../../utils/constants';

  interface Props {
    showBack?: boolean;
    title?: string;
  }

  let {
    showBack = false,
    title = '',
  }: Props = $props();

  const dispatch = createEventDispatcher();

  function toggleSidebar() {
    dispatch('toggleSidebar');
  }

  function goBack() {
    window.history.back();
  }

  async function handleLogoClick(event: Event) {
    event.preventDefault();
    await goto('/');
  }

  let reminderCount = $derived($activeReminders?.length || 0);
</script>

<header class="header">
  <div class="header-start">
    {#if showBack}
      <button class="header-btn" onclick={goBack} aria-label="بازگشت">
        →
      </button>
    {:else}
      <button class="header-btn menu-btn hide-desktop" onclick={toggleSidebar} aria-label="منو">
        ☰
      </button>
    {/if}
    
    {#if title}
      <h1 class="header-title">{title}</h1>
    {:else}
      <a href="/" on:click={handleLogoClick} class="header-logo">
        <span class="logo-icon">🚗</span>
        <span class="logo-text">{APP_NAME}</span>
      </a>
    {/if}
  </div>
  
  <div class="header-end">
    <a href="/settings" class="header-btn notification-btn" aria-label="یادآورها">
      🔔
      {#if reminderCount > 0}
        <span class="notification-badge">{reminderCount > 9 ? '۹+' : reminderCount}</span>
      {/if}
    </a>
    
    <a href="/settings" class="header-user hide-mobile">
      <span class="user-avatar">👤</span>
      <span class="user-name">{$currentUser?.name || 'کاربر'}</span>
    </a>
  </div>
</header>

<style>
  .header {
    position: sticky;
    top: 0;
    z-index: var(--z-sticky);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    background: var(--glass-bg-solid);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border-bottom: 1px solid var(--glass-border);
    min-height: 60px;
  }

  .header-start,
  .header-end {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .header-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: none;
    background: rgba(0, 0, 0, 0.05);
    color: var(--color-text);
    border-radius: 10px;
    font-size: 1.25rem;
    cursor: pointer;
    transition: background 0.2s;
    text-decoration: none;
  }

  .header-btn:hover {
    background: rgba(0, 0, 0, 0.1);
  }

  .header-logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: var(--color-text);
  }

  .logo-icon {
    font-size: 1.5rem;
  }

  .logo-text {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--color-primary);
  }

  .header-title {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
  }

  .notification-btn {
    position: relative;
  }

  .notification-badge {
    position: absolute;
    top: -2px;
    right: -2px;
    min-width: 18px;
    height: 18px;
    padding: 0 4px;
    background: var(--color-danger);
    color: white;
    font-size: 0.6875rem;
    font-weight: 600;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .header-user {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0.75rem 0.375rem 0.5rem;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 9999px;
    text-decoration: none;
    color: var(--color-text);
    transition: background 0.2s;
  }

  .header-user:hover {
    background: rgba(0, 0, 0, 0.1);
  }

  .user-avatar {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-primary);
    color: white;
    border-radius: 50%;
    font-size: 0.875rem;
  }

  .user-name {
    font-size: 0.875rem;
    font-weight: 500;
  }

  .hide-mobile {
    display: none;
  }

  .hide-desktop {
    display: flex;
  }

  @media (min-width: 768px) {
    .header {
      padding: 0.75rem 1.5rem;
    }

    .hide-mobile {
      display: flex;
    }

    .hide-desktop {
      display: none;
    }
  }
</style>
