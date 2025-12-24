<!--
  @component AuthWelcome
  Shows welcome screen for already authenticated users

  @typedef {Object} User
  @property {string} name - User's display name
  @property {string} email - User's email address

  @prop {User} user - Current authenticated user
  @prop {(message: string) => void} onSuccess - Success callback
  @prop {() => void} onLogout - Logout callback
  @prop {(route: string) => void} onNavigate - Navigation callback
-->

<script lang="ts">
  import { Button } from '$lib/components/ui';
  import { _ } from 'svelte-i18n';
  import type { User } from '$lib/types';

  interface Props {
    user: User;
    onSuccess?: (message: string) => void;
    onLogout?: () => void;
    onNavigate?: (route: string) => void;
  }

  let { user, onSuccess, onLogout, onNavigate }: Props = $props();

  function handleContinueToDashboard() {
    onNavigate?.('/dashboard');
  }

  function handleLogout() {
    onLogout?.();
    onSuccess?.($_('auth.loggedOut'));
  }

  // Generate user avatar initial
  let userInitial = $derived(
    user.name
      ? user.name.charAt(0).toUpperCase()
      : user.email.charAt(0).toUpperCase()
  );
</script>

<div class="auth-welcome" role="main" aria-labelledby="welcome-heading">
  <div class="welcome-message">
    <h2 id="welcome-heading">{$_('auth.welcomeBack')}</h2>
    <p>{$_('auth.alreadyLoggedIn', { values: { name: user.name || user.email } })}</p>
  </div>

  <div class="user-info" role="region" aria-label={$_('auth.userInfo')}>
    <div
      class="user-avatar"
      role="img"
      aria-label={$_('auth.userAvatar', { values: { name: user.name || user.email } })}
    >
      {userInitial}
    </div>
    <div class="user-details">
      <div class="user-name">{user.name || $_('auth.user')}</div>
      <div class="user-email">{user.email}</div>
    </div>
  </div>

  <div class="auth-actions">
    <Button
      variant="primary"
      onclick={handleContinueToDashboard}
      aria-label={$_('auth.continueToDashboard')}
    >
      {$_('auth.continueToDashboard')}
    </Button>
    <Button
      variant="secondary"
      onclick={handleLogout}
      aria-label={$_('auth.logout')}
    >
      {$_('auth.logout')}
    </Button>
  </div>
</div>

<style>
  .auth-welcome {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    text-align: center;
  }

  .welcome-message h2 {
    margin: 0 0 0.5rem;
    color: var(--color-primary);
    font-size: 1.25rem;
    font-weight: 600;
  }

  .welcome-message p {
    margin: 0;
    color: var(--color-text-light);
    font-size: 0.9375rem;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: var(--color-bg-secondary);
    border-radius: 0.5rem;
    border: 1px solid var(--color-border);
  }

  .user-avatar {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background: var(--color-primary);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 1.25rem;
  }

  .user-details {
    text-align: right;
  }

  .user-name {
    font-weight: 500;
    color: var(--color-text);
    margin-bottom: 0.25rem;
  }

  .user-email {
    font-size: 0.875rem;
    color: var(--color-text-light);
  }

  .auth-actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
  }
</style>
