<script lang="ts">
  import { goto } from '$app/navigation';
  import { Button, Input, Card } from '$lib/components/ui';
  import { authStore, toastStore } from '$lib/stores';
  import { authService } from '$lib/services';
  import { validators, validateForm, getFieldError, type FieldError } from '$lib/utils/validation';
  import { APP_NAME } from '$lib/utils/constants';

  let name = $state('');
  let email = $state('');
  let password = $state('');
  let confirmPassword = $state('');
  let isLoading = $state(false);
  let errors = $state<FieldError[]>([]);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    
    // Validate
    const validation = validateForm(
      { name, email, password, confirmPassword },
      {
        name: [(v) => validators.required(v, 'نام')],
        email: [(v) => validators.required(v, 'ایمیل'), validators.email],
        password: [(v) => validators.required(v, 'رمز عبور'), validators.password],
        confirmPassword: [
          (v) => validators.required(v, 'تکرار رمز عبور'),
          () => validators.passwordMatch(password, confirmPassword),
        ],
      }
    );

    if (!validation.valid) {
      errors = validation.errors;
      return;
    }

    errors = [];
    isLoading = true;

    try {
      const { user, token } = await authService.register({ name, email, password });
      authStore.loginSuccess(user, token);
      toastStore.success('حساب شما با موفقیت ایجاد شد!');
      goto('/dashboard');
    } catch (err: any) {
      const message = err?.message || 'خطا در ثبت‌نام. لطفاً دوباره تلاش کنید.';
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
        <h1 class="auth-title">ثبت‌نام در {APP_NAME}</h1>
        <p class="auth-subtitle">حساب کاربری خود را بسازید</p>
      </div>

      <form class="auth-form" onsubmit={handleSubmit}>
        <Input
          type="text"
          name="name"
          label="نام"
          placeholder="نام خود را وارد کنید"
          bind:value={name}
          error={getFieldError(errors, 'name')}
          required
          icon="👤"
        />

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
          placeholder="حداقل ۶ کاراکتر"
          bind:value={password}
          error={getFieldError(errors, 'password')}
          required
          icon="🔒"
        />

        <Input
          type="password"
          name="confirmPassword"
          label="تکرار رمز عبور"
          placeholder="رمز عبور را تکرار کنید"
          bind:value={confirmPassword}
          error={getFieldError(errors, 'confirmPassword')}
          required
          icon="🔒"
        />

        <Button type="submit" variant="primary" fullWidth loading={isLoading}>
          ثبت‌نام
        </Button>
      </form>

      <div class="auth-footer">
        <span>قبلاً ثبت‌نام کرده‌اید؟</span>
        <a href="/login">وارد شوید</a>
      </div>
    </Card>
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

  @media (min-width: 768px) {
    .auth-header {
      margin-bottom: 2.5rem;
    }
  }

  .auth-logo {
    font-size: 3rem;
    display: block;
    margin-bottom: 0.5rem;
  }

  @media (min-width: 768px) {
    .auth-logo {
      font-size: 3.5rem;
    }
  }

  .auth-title {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-primary);
  }

  @media (min-width: 768px) {
    .auth-title {
      font-size: 1.75rem;
    }
  }

  .auth-subtitle {
    margin: 0.5rem 0 0;
    color: var(--color-text-light);
    font-size: 0.9375rem;
  }

  /* Form - using shared styles from layouts.css */
  .auth-form {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  @media (min-width: 768px) {
    .auth-form {
      gap: var(--space-xl);
    }
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
</style>

