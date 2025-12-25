<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { Layout } from '$lib/components/layout';
  import { navigateTo } from '$lib/utils/navigation';
  import { Card, Button, Input, Badge } from '$lib/components/ui';
  import { authStore, currentUser, isPro, remindersStore, toastStore } from '$lib/stores';
  import { authService, reminderService } from '$lib/services';
  import { formatNumber } from '$lib/utils/format';
  import { REMINDER_CHANNEL_OPTIONS, FREE_TIER_LIMITS, PRO_TIER_FEATURES, APP_NAME } from '$lib/utils/constants';
  import type { ReminderSettings, ReminderChannel } from '$lib/types';

  let isLoading = $state(true);
  let isSaving = $state(false);

  let settings = $state<ReminderSettings>({
    kmInterval: 5000,
    timeIntervalMonths: 3,
    alertDaysBefore: 7,
    channels: ['inApp'],
  });

  let profile = $state({
    name: '',
    email: '',
  });

  onMount(async () => {
    await loadSettings();
  });

  async function loadSettings() {
    isLoading = true;
    try {
      const [settingsData, profileData] = await Promise.all([
        reminderService.getSettings(),
        authService.getProfile(),
      ]);
      settings = settingsData;
      profile = {
        name: profileData.name,
        email: profileData.email,
      };
    } catch {
      toastStore.error('خطا در بارگذاری تنظیمات');
    } finally {
      isLoading = false;
    }
  }

  async function saveSettings() {
    isSaving = true;
    try {
      await reminderService.updateSettings(settings);
      remindersStore.setSettings(settings);
      toastStore.success('تنظیمات ذخیره شد');
    } catch {
      toastStore.error('خطا در ذخیره تنظیمات');
    } finally {
      isSaving = false;
    }
  }

  async function saveProfile() {
    isSaving = true;
    try {
      // Split name into firstName and lastName (simple approach: first word = firstName, rest = lastName)
      const nameParts = profile.name.trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      const updated = await authService.updateProfile({ 
        firstName,
        lastName 
      });
      authStore.updateUser(updated);
      toastStore.success('پروفایل به‌روزرسانی شد');
    } catch {
      toastStore.error('خطا در به‌روزرسانی پروفایل');
    } finally {
      isSaving = false;
    }
  }

  function toggleChannel(channel: ReminderChannel) {
    if (channel === 'sms' && !$isPro) {
      toastStore.warning('یادآور پیامکی فقط برای کاربران Pro در دسترس است');
      return;
    }
    
    if (settings.channels.includes(channel)) {
      settings.channels = settings.channels.filter(c => c !== channel);
    } else {
      settings.channels = [...settings.channels, channel];
    }
  }

  async function handleUpgrade() {
    try {
      const { redirectUrl } = await authService.upgradeToPro();
      // In production, redirect to payment gateway
      toastStore.info('در حال انتقال به درگاه پرداخت...');
      // window.location.href = redirectUrl;
      
      // For demo, just show a message
      setTimeout(() => {
        toastStore.success('این یک دمو است. در نسخه واقعی به درگاه پرداخت منتقل می‌شوید.');
      }, 1000);
    } catch {
      toastStore.error('خطا در ارتباط با سرور');
    }
  }

  function handleLogout() {
    if (confirm('آیا می‌خواهید از حساب خود خارج شوید؟')) {
      authStore.logout();
      navigateTo('/login');
    }
  }
</script>

<Layout headerTitle="تنظیمات">
  <div class="page-container">
    <!-- Profile Section -->
    <Card variant="solid" padding="lg" title="پروفایل">
      <div class="profile-header">
        <div class="profile-avatar">
          <span>👤</span>
        </div>
        <div class="profile-info">
          <span class="profile-name">{$currentUser?.name || 'کاربر'}</span>
          <span class="profile-email">{$currentUser?.email}</span>
          <Badge variant={$isPro ? 'warning' : 'default'}>
            {$isPro ? '✨ Pro' : 'رایگان'}
          </Badge>
        </div>
      </div>

      <form class="form-container" onsubmit={(e) => { e.preventDefault(); saveProfile(); }}>
        <Input
          name="name"
          label="نام"
          bind:value={profile.name}
          class="field-full-width"
        />
        <Input
          type="email"
          name="email"
          label="ایمیل"
          value={profile.email}
          disabled
          hint="ایمیل قابل تغییر نیست"
          class="field-full-width"
        />
        <Button type="submit" variant="primary" loading={isSaving}>
          ذخیره تغییرات
        </Button>
      </form>
    </Card>

    <!-- Reminder Settings -->
    <Card variant="solid" padding="lg" title="تنظیمات یادآور">
      <form class="form-container" onsubmit={(e) => { e.preventDefault(); saveSettings(); }}>
        <Input
          type="number"
          name="kmInterval"
          label="فاصله کیلومتری سرویس"
          hint="هر چند کیلومتر یادآور سرویس فعال شود"
          bind:value={settings.kmInterval}
          min={1000}
          step={1000}
        />

        <Input
          type="number"
          name="timeInterval"
          label="فاصله زمانی سرویس (ماه)"
          hint="هر چند ماه یادآور سرویس فعال شود"
          bind:value={settings.timeIntervalMonths}
          min={1}
          max={24}
        />

        <Input
          type="number"
          name="alertDays"
          label="روزهای قبل از موعد"
          hint="چند روز قبل از موعد هشدار داده شود"
          bind:value={settings.alertDaysBefore}
          min={1}
          max={30}
        />

        <div class="channels-section">
          <label class="form-label">کانال‌های یادآوری</label>
          <div class="channels-list">
            {#each REMINDER_CHANNEL_OPTIONS as channel}
              <button
                type="button"
                class="channel-item"
                class:active={settings.channels.includes(channel.value as ReminderChannel)}
                class:disabled={channel.isPro && !$isPro}
                onclick={() => toggleChannel(channel.value as ReminderChannel)}
              >
                <span class="channel-checkbox">
                  {settings.channels.includes(channel.value as ReminderChannel) ? '✓' : ''}
                </span>
                <span class="channel-label">
                  {channel.label}
                  {#if channel.isPro && !$isPro}
                    <Badge variant="warning" size="sm">Pro</Badge>
                  {/if}
                </span>
              </button>
            {/each}
          </div>
        </div>

        <Button type="submit" variant="primary" loading={isSaving}>
          ذخیره تنظیمات
        </Button>
      </form>
    </Card>

    <!-- Pro Upgrade -->
    {#if !$isPro}
      <Card variant="solid" padding="lg" class="pro-card">
        <div class="pro-header">
          <span class="pro-icon">🌟</span>
          <h3 class="pro-title">ارتقا به نسخه Pro</h3>
        </div>

        <ul class="pro-features">
          <li>✓ خودروهای نامحدود</li>
          <li>✓ همگام‌سازی ابری</li>
          <li>✓ خروجی PDF</li>
          <li>✓ یادآور پیامکی</li>
          <li>✓ گزارش‌های پیشرفته</li>
        </ul>

        <Button variant="primary" fullWidth onclick={handleUpgrade}>
          ارتقا به Pro
        </Button>
      </Card>
    {/if}

    <!-- App Info -->
    <Card variant="solid" padding="md">
      <div class="app-info">
        <div class="app-logo">
          <span>🚗</span>
          <span class="app-name">{APP_NAME}</span>
        </div>
        <span class="app-version">نسخه ۱.۰.۰</span>
      </div>
    </Card>

    <!-- Logout -->
    <Button variant="danger" fullWidth onclick={handleLogout}>
      خروج از حساب
    </Button>
  </div>
</Layout>

<style>
  /* Settings page specific styles */

  /* Page container - using shared styles from layouts.css */
  .page-container {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  @media (min-width: 768px) {
    .page-container {
      gap: var(--space-xl);
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-auto-rows: min-content;
    }
  }

  /* Cards full width on mobile, grid on tablet+ */
  .page-container :global(.card) {
    width: 100%;
  }

  @media (min-width: 768px) {
    /* Profile and Reminder Settings side by side */
    .page-container :global(.card:first-child),
    .page-container :global(.card:nth-child(2)) {
      grid-column: span 1;
    }

    /* Pro card full width */
    .page-container :global(.pro-card) {
      grid-column: 1 / -1;
    }

    /* App info and Logout side by side */
    .page-container :global(.card:last-of-type),
    .page-container :global(button:last-child) {
      grid-column: span 1;
    }
  }

  /* Profile section */
  .profile-header {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    margin-bottom: var(--space-lg);
  }

  @media (min-width: 768px) {
    .profile-header {
      flex-direction: column;
      text-align: center;
      gap: var(--space-lg);
      margin-bottom: var(--space-xl);
    }
  }

  .profile-avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: var(--glass-bg-solid);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    border: 2px solid var(--glass-border);
  }

  @media (min-width: 768px) {
    .profile-avatar {
      width: 80px;
      height: 80px;
      font-size: 2.5rem;
    }
  }

  .profile-info {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    flex: 1;
  }

  @media (min-width: 768px) {
    .profile-info {
      align-items: center;
    }
  }

  .profile-name {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--color-text);
  }

  @media (min-width: 768px) {
    .profile-name {
      font-size: var(--font-size-xl);
    }
  }

  .profile-email {
    font-size: var(--font-size-sm);
    color: var(--color-text-light);
  }

  /* Form container - using shared styles from layouts.css */

  /* Channels section */
  .channels-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  @media (min-width: 768px) {
    .channels-section {
      grid-column: 1 / -1;
      gap: var(--space-lg);
    }
  }

  .form-label {
    font-size: var(--font-size-base);
    font-weight: 500;
    color: var(--color-text);
    margin-bottom: var(--space-sm);
  }

  .channels-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  @media (min-width: 768px) {
    .channels-list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-md);
    }
  }

  .channel-item {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-md);
    background: var(--glass-bg-solid);
    border: 1px solid var(--glass-border);
    border-radius: var(--glass-radius);
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: right;
  }

  .channel-item:hover:not(.disabled) {
    background: rgba(30, 58, 138, 0.05);
    border-color: var(--color-primary);
  }

  .channel-item.active {
    background: rgba(30, 58, 138, 0.1);
    border-color: var(--color-primary);
  }

  .channel-item.disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .channel-checkbox {
    width: 24px;
    height: 24px;
    border: 2px solid var(--glass-border);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-sm);
    color: var(--color-primary);
    flex-shrink: 0;
  }

  .channel-item.active .channel-checkbox {
    background: var(--color-primary);
    border-color: var(--color-primary);
    color: white;
  }

  .channel-label {
    flex: 1;
    font-size: var(--font-size-sm);
    color: var(--color-text);
    display: flex;
    align-items: center;
    gap: var(--space-xs);
  }

  /* Pro card */
  :global(.pro-card) {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(249, 115, 22, 0.1)) !important;
    border-color: rgba(245, 158, 11, 0.3) !important;
  }

  .pro-header {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    margin-bottom: var(--space-lg);
  }

  @media (min-width: 768px) {
    .pro-header {
      justify-content: center;
      margin-bottom: var(--space-xl);
    }
  }

  .pro-icon {
    font-size: 2rem;
  }

  @media (min-width: 768px) {
    .pro-icon {
      font-size: 2.5rem;
    }
  }

  .pro-title {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--color-text);
    margin: 0;
  }

  @media (min-width: 768px) {
    .pro-title {
      font-size: var(--font-size-xl);
    }
  }

  .pro-features {
    list-style: none;
    padding: 0;
    margin: 0 0 var(--space-lg) 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  @media (min-width: 768px) {
    .pro-features {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-md);
      margin-bottom: var(--space-xl);
    }
  }

  .pro-features li {
    font-size: var(--font-size-sm);
    color: var(--color-text);
    padding: var(--space-xs) 0;
  }

  /* App info */
  .app-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-sm);
    text-align: center;
  }

  @media (min-width: 768px) {
    .app-info {
      flex-direction: row;
      justify-content: space-between;
      text-align: right;
    }
  }

  .app-logo {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }

  .app-name {
    font-size: var(--font-size-base);
    font-weight: 600;
    color: var(--color-text);
  }

  .app-version {
    font-size: var(--font-size-sm);
    color: var(--color-text-light);
  }

  /* Logout button */
  .page-container :global(button:last-child) {
    margin-top: var(--space-md);
  }

  @media (min-width: 768px) {
    .page-container :global(button:last-child) {
      margin-top: 0;
    }
  }

  /* Form fields spacing - using shared styles from layouts.css */
</style>

