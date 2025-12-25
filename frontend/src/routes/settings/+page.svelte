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
        />
        <Input
          type="email"
          name="email"
          label="ایمیل"
          value={profile.email}
          disabled
          hint="ایمیل قابل تغییر نیست"
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
  /* Custom overrides for settings page */

  /* Pro card gradient */
  :global(.pro-card) {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(249, 115, 22, 0.1)) !important;
    border-color: rgba(245, 158, 11, 0.3) !important;
  }
</style>

