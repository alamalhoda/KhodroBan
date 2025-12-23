<script lang="ts">
  import { goto } from '$app/navigation';
  import { Button, Input, Card } from '$lib/components/ui';
  import { authStore, toastStore } from '$lib/stores';
  import { authService } from '$lib/services';
  import { validators, validateForm, getFieldError, type FieldError } from '$lib/utils/validation';
  import { APP_NAME } from '$lib/utils/constants';

  let email = $state('');
  let password = $state('');
  let isLoading = $state(false);
  let isGoogleLoading = $state(false);
  let errors = $state<FieldError[]>([]);

  async function handleGoogleLogin() {
    isGoogleLoading = true;
    try {
      await authService.loginWithGoogle();
      // Supabase خودش redirect می‌کند، پس نیازی به goto نیست
    } catch (err: any) {
      const message = err?.message || 'خطا در ورود با Google. لطفاً دوباره تلاش کنید.';
      toastStore.error(message);
      isGoogleLoading = false;
    }
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    
    // Validate
    const validation = validateForm(
      { email, password },
      {
        email: [(v) => validators.required(v, 'ایمیل'), validators.email],
        password: [(v) => validators.required(v, 'رمز عبور')],
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
      toastStore.success('خوش آمدید!');
      goto('/dashboard');
    } catch (err: any) {
      const message = err?.message || 'خطا در ورود. لطفاً دوباره تلاش کنید.';
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
        <p class="auth-subtitle">مدیریت هوشمند نگهداری خودرو</p>
      </div>

      <form class="auth-form" onsubmit={handleSubmit}>
        <Input
          type="email"
          name="email"
          label="ایمیل"
          placeholder="email@example.com"
          bind:value={email}
          error={getFieldError(errors, 'email')}
          required
          icon="📧"
        />

        <Input
          type="password"
          name="password"
          label="رمز عبور"
          placeholder="رمز عبور خود را وارد کنید"
          bind:value={password}
          error={getFieldError(errors, 'password')}
          required
          icon="🔒"
        />

        <div class="forgot-link">
          <a href="/forgot-password">رمز عبور را فراموش کردم</a>
        </div>

        <Button type="submit" variant="primary" fullWidth loading={isLoading}>
          ورود
        </Button>
      </form>

      <div class="auth-divider">
        <span>یا</span>
      </div>

      <Button 
        variant="secondary" 
        fullWidth 
        loading={isGoogleLoading}
        onclick={handleGoogleLogin}
      >
        <span class="google-icon">🔍</span>
        ورود با Google
      </Button>

      <div class="auth-footer">
        <span>حساب کاربری ندارید؟</span>
        <a href="/register">ثبت‌نام کنید</a>
      </div>
    </Card>

    <p class="demo-hint">
      برای تست، هر ایمیل و رمز عبوری وارد کنید
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

  .demo-hint {
    margin-top: 1rem;
    text-align: center;
    font-size: 0.8125rem;
    color: var(--color-text-muted);
  }

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

  .google-icon {
    font-size: 1.2rem;
    margin-left: 0.5rem;
  }
</style>

