<script lang="ts">
  import { goto } from '$app/navigation';
  import { Button, Input, Card, LanguageSwitcher } from '$lib/components';
  import { authStore, toastStore } from '$lib/stores';
  import { authService } from '$lib/services';
  import { validators, validateForm, getFieldError, type FieldError } from '$lib/utils/validation';
  import { APP_NAME } from '$lib/utils/constants';
  import { _ } from 'svelte-i18n';
  import { browser } from '$app/environment';
  import { initializeI18n, initializeLocale, setLocale } from '$lib/i18n';

  // مقداردهی اولیه i18n اگر در کلاینت هستیم
  if (browser) {
    initializeI18n();
    const initialLocale = initializeLocale();
    setLocale(initialLocale);
  }

  let email = $state('');
  let password = $state('');
  let isLoading = $state(false);
  let errors = $state<FieldError[]>([]);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    
    // Validate
    const validation = validateForm(
      { email, password },
      {
        email: [(v) => validators.required(v, $_('auth.email')), validators.email],
        password: [(v) => validators.required(v, $_('auth.password'))],
      }
    );

    if (!validation.valid) {
      errors = validation.errors;
      return;
    }

    errors = [];
    isLoading = true;

    try {
      const { user, token } = await authService.login({ email, password });
      authStore.loginSuccess(user, token);
      toastStore.success($_('auth.welcome'));
      goto('/dashboard');
    } catch (err: any) {
      const message = err?.message || $_('auth.loginError');
      toastStore.error(message);
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="auth-page">
  <div class="auth-container">
    <Card padding="lg" variant="solid">
      <div class="auth-header">
        <span class="auth-logo">🚗</span>
        <h1 class="auth-title">{APP_NAME}</h1>
        <p class="auth-subtitle">{$_('dashboard.welcome')}</p>
      </div>

      <form class="auth-form" onsubmit={handleSubmit}>
        <Input
          type="email"
          name="email"
          label={$_('auth.email')}
          placeholder="email@example.com"
          bind:value={email}
          error={getFieldError(errors, 'email')}
          required
          icon="📧"
        />

        <Input
          type="password"
          name="password"
          label={$_('auth.password')}
          placeholder="Enter your password"
          bind:value={password}
          error={getFieldError(errors, 'password')}
          required
          icon="🔒"
        />

        <div class="forgot-link">
          <a href="/forgot-password">{$_('auth.forgotPassword')}</a>
        </div>

        <Button type="submit" variant="primary" fullWidth loading={isLoading}>
          {$_('auth.login')}
        </Button>
      </form>

      <div class="auth-footer">
        <span>Don't have an account?</span>
        <a href="/register">{$_('auth.register')}</a>
      </div>
    </Card>

    <div class="auth-language">
      <LanguageSwitcher />
    </div>

    <p class="demo-hint">
      For testing, enter any email and password
    </p>
  </div>
</div>

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

  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .forgot-link {
    text-align: left;
  }

  .forgot-link a {
    font-size: 0.875rem;
    color: var(--color-text-light);
  }

  .forgot-link a:hover {
    color: var(--color-primary);
  }

  .auth-footer {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    text-align: center;
    font-size: 0.9375rem;
    color: var(--color-text-light);
  }

  .auth-footer a {
    color: var(--color-primary);
    font-weight: 500;
    margin-right: 0.25rem;
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

