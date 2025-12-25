<script lang="ts">
  import { goto } from '$app/navigation';
  import { Card, LanguageSwitcher, LoadingSpinner } from '$lib/components/ui';
  import { AuthWelcome, LoginForm, SocialLoginButtons } from '$lib/components/features';
  import { authStore, toastStore } from '$lib/stores';
  import { authService } from '$lib/services';
  import { APP_NAME } from '$lib/utils/constants';
  import { _ } from 'svelte-i18n';
  import { browser } from '$app/environment';
  import { initializeLocale, setLocale } from '$lib/i18n';
  import { isAuthenticated, currentUser } from '$lib/stores/auth';
  import { locale } from 'svelte-i18n';
  import type { FieldError } from '$lib/utils/validation';

  // Reactive state
  let isGoogleLoading = $state(false);
  let formErrors = $state<FieldError[]>([]);

  // Derived state
  let isUserAuthenticated = $derived($isAuthenticated);
  let user = $derived($currentUser);
  let isI18nReady = $derived(!!$locale);

  // Safe translation helper
  function t(key: string, options?: any): string {
    try {
      return $_(key, options);
    } catch {
      // Fallback values for common keys
      const fallbacks: Record<string, string> = {
        'auth.subtitle': 'مدیریت هوشمند نگهداری خودرو',
        'auth.demoHint': 'برای تست، هر ایمیل و رمز عبوری وارد کنید',
        'auth.registerPrompt': 'حساب کاربری ندارید؟',
        'auth.register': 'ثبت نام',
        'auth.user': 'کاربر',
        'auth.userInfo': 'اطلاعات کاربر',
        'auth.userAvatar': 'آواتار کاربر {{name}}',
      };
      return options?.values?.name ? `${fallbacks[key] || key} ${options.values.name}` : fallbacks[key] || key;
    }
  }

  // Event handlers
  async function handleGoogleLogin() {
    isGoogleLoading = true;
    try {
      await authService.loginWithGoogle();
    } catch (error: any) {
      const message = error?.message || 'خطا در ورود با Google. لطفاً دوباره تلاش کنید.';
      toastStore.error(message);
    } finally {
      isGoogleLoading = false;
    }
  }

  async function handleFormSubmit(credentials: { email: string; password: string }) {
    try {
      const { user, token } = await authService.login(credentials);
      authStore.loginSuccess(user, token);
      toastStore.success($_('auth.welcome'));
      await goto('/dashboard');
    } catch (error: any) {
      const message = error?.message || $_('auth.loginError');
      toastStore.error(message);
      throw error; // Re-throw for form handling
    }
  }

  function handleFormValidationError(errors: FieldError[]) {
    formErrors = errors;
  }

  function handleClearFieldError(event: Event) {
    const customEvent = event as CustomEvent<{ field: string }>;
    const { field } = customEvent.detail;
    formErrors = formErrors.filter(error => error.field !== field);
  }

  // Listen for field error clearing
  $effect(() => {
    if (browser) {
      document.addEventListener('clear-field-error', handleClearFieldError);
      return () => document.removeEventListener('clear-field-error', handleClearFieldError);
    }
  });
</script>

{#if isI18nReady}
  <div class="auth-page">
    <div class="auth-container">
      <Card padding="lg" variant="solid">
        <header class="auth-header">
          <span class="auth-logo" role="img" aria-label="خودروبان">🚗</span>
          <h1 class="auth-title">{APP_NAME}</h1>
          <p class="auth-subtitle">{t('auth.subtitle')}</p>
        </header>

        {#if isUserAuthenticated && user}
          <AuthWelcome
            {user}
            onSuccess={(message) => toastStore.success(message)}
            onLogout={() => authStore.logout()}
            onNavigate={(route) => goto(route)}
          />
        {:else}
          <LoginForm
            onSubmit={handleFormSubmit}
            errors={formErrors}
            onValidationError={handleFormValidationError}
          />

          <SocialLoginButtons
            isGoogleLoading={isGoogleLoading}
            onGoogleLogin={handleGoogleLogin}
          />

          <footer class="auth-footer">
            <span>{t('auth.registerPrompt')}</span>
            <a href="/register" class="register-link">{t('auth.register')}</a>
          </footer>
        {/if}
      </Card>

      <div class="auth-language">
        <LanguageSwitcher />
      </div>
    </div>
  </div>
{:else}
  <div class="auth-page">
    <div class="auth-container">
      <LoadingSpinner message="در حال بارگذاری..." />
    </div>
  </div>
{/if}

<style>
  .auth-page {
    min-height: 100vh;
    min-height: 100dvh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background: linear-gradient(135deg, var(--color-bg) 0%, var(--color-bg-dark) 100%);
  }

  .auth-container {
    width: 100%;
    max-width: 400px;
  }

  @media (min-width: 768px) {
    .auth-container {
      max-width: 450px;
    }
  }

  @media (min-width: 1024px) {
    .auth-container {
      max-width: 500px;
    }
  }

  .auth-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .auth-logo {
    font-size: 3rem;
    display: block;
    margin-bottom: 0.5rem;
  }

  .auth-title {
    margin: 0;
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--color-primary);
  }

  .auth-subtitle {
    margin: 0.5rem 0 0;
    color: var(--color-text-light);
    font-size: 0.9375rem;
  }

  .auth-footer {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    text-align: center;
    font-size: 0.9375rem;
    color: var(--color-text-light);
  }

  .register-link {
    color: var(--color-primary);
    font-weight: 500;
    text-decoration: none;
    margin-right: 0.25rem;
  }

  .register-link:hover {
    text-decoration: underline;
  }

  .register-link:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  .auth-language {
    margin-top: 2rem;
    display: flex;
    justify-content: center;
  }

  .demo-hint {
    margin-top: 1rem;
    text-align: center;
    font-size: 0.8125rem;
    color: var(--color-text-muted);
  }
</style>

