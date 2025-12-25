<!--
  @component SocialLoginButtons
  Social login buttons for Google, Facebook, and Twitter

  @prop {boolean} isGoogleLoading - Loading state for Google login
  @prop {() => Promise<void>} onGoogleLogin - Google login handler
-->

<script lang="ts">
  import { Button } from '$lib/components/ui';
  import { _ } from 'svelte-i18n';

  interface Props {
    isGoogleLoading?: boolean;
    onGoogleLogin?: () => Promise<void>;
  }

  let { isGoogleLoading = false, onGoogleLogin }: Props = $props();

  // Safe translation helper
  function t(key: string): string {
    try {
      return $_(key);
    } catch {
      // Fallback values
      const fallbacks: Record<string, string> = {
        'auth.loginWithGoogle': 'ورود با گوگل',
        'auth.loginWithFacebook': 'ورود با فیسبوک',
        'auth.loginWithTwitter': 'ورود با ایکس',
      };
      return fallbacks[key] || key;
    }
  }

  async function handleGoogleLogin() {
    try {
      await onGoogleLogin?.();
    } catch (error) {
      // Error handling is done in parent component
    }
  }
</script>

<div class="auth-divider" role="separator" aria-label="یا">
  <span>یا</span>
</div>

<div class="social-buttons" role="group" aria-label="ورود با شبکه‌های اجتماعی">
  <Button
    variant="secondary"
    size="sm"
    loading={isGoogleLoading}
    onclick={handleGoogleLogin}
    class="social-button google-button"
    aria-label={isGoogleLoading ? 'در حال ورود با گوگل...' : t('auth.loginWithGoogle')}
    disabled={isGoogleLoading}
  >
    <svg class="social-icon google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
    {t('auth.loginWithGoogle')}
  </Button>

  <Button
    variant="secondary"
    size="sm"
    disabled
    class="social-button facebook-button"
    aria-label={t('auth.loginWithFacebook') + ' (غیرفعال)'}
  >
    <svg class="social-icon facebook-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
    {t('auth.loginWithFacebook')}
  </Button>

  <Button
    variant="secondary"
    size="sm"
    disabled
    class="social-button twitter-button"
    aria-label={t('auth.loginWithTwitter') + ' (غیرفعال)'}
  >
    <svg class="social-icon twitter-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fill="#000000" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
    {t('auth.loginWithTwitter')}
  </Button>
</div>

<style>
  .auth-divider {
    display: flex;
    align-items: center;
    margin: 1.5rem 0;
    text-align: center;
  }

  .auth-divider::before,
  .auth-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(0, 0, 0, 0.1);
  }

  .auth-divider span {
    padding: 0 1rem;
    color: var(--color-text-light);
    font-size: 0.875rem;
  }

  .social-buttons {
    display: flex;
    flex-direction: row;
    gap: 0.75rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  :global(.social-button) {
    flex: 1;
    min-width: 120px;
    max-width: 160px;
    position: relative;
  }

  .social-icon {
    width: 18px;
    height: 18px;
    margin-left: 0.5rem;
    flex-shrink: 0;
  }

  .google-icon {
    margin-left: 0.5rem;
  }

  .facebook-icon {
    margin-left: 0.5rem;
  }

  .twitter-icon {
    margin-left: 0.5rem;
  }

  /* Responsive: در صفحات کوچک به حالت عمودی برمی‌گردد */
  @media (max-width: 640px) {
    .social-buttons {
      flex-direction: column;
    }

    :global(.social-button) {
      flex: none;
      min-width: unset;
      max-width: unset;
    }
  }

  /* Focus states for better accessibility */
  :global(.social-button:focus) {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  /* Disabled state styling */
  :global(.social-button:disabled) {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>
