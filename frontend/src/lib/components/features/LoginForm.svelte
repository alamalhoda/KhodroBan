<!--
  @component LoginForm
  Handles email/password login form with validation

  @typedef {Object} LoginCredentials
  @property {string} email - User's email
  @property {string} password - User's password

  @typedef {Object} FormError
  @property {string} field - Field name that has error
  @property {string} message - Error message

  @prop {boolean} isLoading - Loading state
  @prop {(credentials: LoginCredentials) => Promise<void>} onSubmit - Submit handler
  @prop {FormError[]} errors - Form validation errors
-->

<script lang="ts">
  import { Button, Input } from '$lib/components/ui';
  import { validators, validateForm, getFieldError, type FieldError } from '$lib/utils/validation';
  import { _ } from 'svelte-i18n';

  interface Props {
    isLoading?: boolean;
    onSubmit?: (credentials: { email: string; password: string }) => Promise<void>;
    errors?: FieldError[];
  }

  let {
    isLoading = false,
    onSubmit,
    errors = []
  }: Props = $props();

  let email = $state('');
  let password = $state('');

  // Safe translation helper
  function t(key: string, options?: any): string {
    try {
      return $_(key, options);
    } catch {
      // Fallback values
      const fallbacks: Record<string, string> = {
        'auth.email': 'ایمیل',
        'auth.password': 'رمز عبور',
        'auth.forgotPassword': 'رمز عبور را فراموش کرده‌ام',
        'auth.login': 'ورود',
        'auth.loginError': 'خطا در ورود. لطفاً دوباره تلاش کنید.',
      };
      return options?.values?.name ? `${fallbacks[key] || key} ${options.values.name}` : fallbacks[key] || key;
    }
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();

    // Client-side validation
    const validation = validateForm(
      { email, password },
      {
        email: [(v) => validators.required(v, t('auth.email')), validators.email],
        password: [(v) => validators.required(v, t('auth.password'))],
      }
    );

    if (!validation.valid) {
      // Emit validation errors
      const customEvent = new CustomEvent('validation-error', {
        detail: validation.errors
      });
      e.target?.dispatchEvent(customEvent);
      return;
    }

    try {
      await onSubmit?.({ email, password });

      // Clear form on success
      email = '';
      password = '';
    } catch (error) {
      // Error handling is done in parent component
    }
  }

  // Clear field errors when user starts typing
  function clearFieldError(field: string) {
    const customEvent = new CustomEvent('clear-field-error', {
      detail: { field }
    });
    document.dispatchEvent(customEvent);
  }
</script>

<form
  class="auth-form"
  onsubmit={handleSubmit}
  role="form"
  aria-labelledby="login-form-title"
>
  <div id="login-form-title" class="sr-only">فرم ورود به سیستم</div>

  <Input
    type="email"
    name="email"
    label={t('auth.email')}
    placeholder="email@example.com"
    bind:value={email}
    error={getFieldError(errors, 'email')}
    required
    icon="📧"
    disabled={isLoading}
    oninput={() => clearFieldError('email')}
    aria-describedby={getFieldError(errors, 'email') ? 'email-error' : undefined}
  />

  <Input
    type="password"
    name="password"
    label={t('auth.password')}
    placeholder={t('auth.password')}
    bind:value={password}
    error={getFieldError(errors, 'password')}
    required
    icon="🔒"
    disabled={isLoading}
    oninput={() => clearFieldError('password')}
    aria-describedby={getFieldError(errors, 'password') ? 'password-error' : undefined}
  />

  <div class="forgot-link">
    <a href="/forgot-password" tabindex={isLoading ? -1 : 0}>
      {t('auth.forgotPassword')}
    </a>
  </div>

  <Button
    type="submit"
    variant="primary"
    fullWidth
    loading={isLoading}
    disabled={isLoading}
    aria-label={isLoading ? 'در حال ورود...' : t('auth.login')}
  >
    {t('auth.login')}
  </Button>
</form>

<style>
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
    text-decoration: none;
  }

  .forgot-link a:hover {
    color: var(--color-primary);
    text-decoration: underline;
  }

  .forgot-link a:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
</style>
