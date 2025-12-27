<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { Layout } from '$lib/components/layout';
  import { Card, Button, Badge, Spinner, EmptyState } from '$lib/components/ui';
  import {
    vehiclesStore,
    servicesStore,
    expensesStore,
    remindersStore,
    activeReminders,
    toastStore,
  } from '$lib/stores';
  import { vehicleService, serviceService, expenseService, reminderService } from '$lib/services';
  import {
    formatNumber,
    formatCurrency,
    formatKm,
    formatJalaliDate,
    getRelativeTime,
  } from '$lib/utils/format';
  import { REMINDER_STATUS, SERVICE_TYPES, POLL_INTERVAL } from '$lib/utils/constants';
  import type { Vehicle, Reminder } from '$lib/types';

  let isLoading = $state(true);
  let vehicles = $derived($vehiclesStore.vehicles);
  let reminders = $derived($activeReminders);

  onMount(async () => {
    await loadData();

    // Set up polling for reminders
    const pollInterval = setInterval(() => {
      reminderService.refresh().then((data) => {
        remindersStore.setReminders(data);
      });
    }, POLL_INTERVAL);

    return () => clearInterval(pollInterval);
  });

  async function loadData() {
    isLoading = true;
    try {
      const [vehiclesData, servicesData, expensesData, remindersData] = await Promise.all([
        vehicleService.getAll(),
        serviceService.getAll(),
        expenseService.getAll(),
        reminderService.getAll(),
      ]);

      vehiclesStore.setVehicles(vehiclesData);
      servicesStore.setServices(servicesData);
      expensesStore.setExpenses(expensesData);
      remindersStore.setReminders(remindersData);
    } catch (error) {
      toastStore.error('خطا در بارگذاری اطلاعات');
    } finally {
      isLoading = false;
    }
  }

  function dismissReminder(id: string) {
    remindersStore.dismissReminder(id);
    toastStore.success('یادآور بسته شد');
  }

  function getVehicleStatus(vehicleId: string): Reminder | undefined {
    return reminders.find((r) => r.vehicleId === vehicleId && !r.dismissed);
  }

  function getStatusVariant(status: string): 'success' | 'warning' | 'danger' {
    if (status === 'ok') return 'success';
    if (status === 'near') return 'warning';
    return 'danger';
  }
</script>

<Layout headerTitle="داشبورد">
  <div class="page-container">
    {#if isLoading}
      <div class="loading-container">
        <Spinner size="lg" />
        <p>در حال بارگذاری...</p>
      </div>
    {:else}
      <!-- Active Alerts -->
      {#if reminders.length > 0}
        <section class="section">
          <h2 class="section-title">
            <span>🔔</span>
            <span>یادآورها</span>
            <Badge variant="danger">{reminders.length}</Badge>
          </h2>

          <div class="alerts-list">
            {#each reminders as reminder}
              <Card padding="md" variant="solid" class="alert-card alert-{reminder.status}">
                <div class="alert-content">
                  <div class="alert-icon">
                    {#if reminder.status === 'overdue'}⚠️{:else}🔔{/if}
                  </div>
                  <div class="alert-info">
                    <span class="alert-vehicle">{reminder.vehicleName}</span>
                    <span class="alert-message">{reminder.message}</span>
                  </div>
                  <button class="alert-dismiss" onclick={() => dismissReminder(reminder.id)}>
                    ✕
                  </button>
                </div>
              </Card>
            {/each}
          </div>
        </section>
      {/if}

      <!-- Vehicles Overview -->
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">
            <span>🚗</span>
            <span>خودروهای من</span>
          </h2>
          <a href="/vehicles" class="section-link">مشاهده همه</a>
        </div>

        {#if vehicles.length === 0}
          <Card>
            <EmptyState
              icon="🚗"
              title="خودرویی ثبت نشده"
              description="اولین خودرو خود را اضافه کنید"
            >
              <Button variant="primary" onclick={() => goto('/vehicles')}>افزودن خودرو</Button>
            </EmptyState>
          </Card>
        {:else}
          <div class="vehicles-grid">
            {#each vehicles as vehicle}
              {@const status = getVehicleStatus(vehicle.id)}
              <a href="/vehicles/{vehicle.id}" class="vehicle-card-link">
                <Card hoverable clickable padding="lg" variant="solid" class="vehicle-card-large">
                  <div class="vehicle-card">
                    <div class="vehicle-header">
                      <span class="vehicle-icon">🚗</span>
                      <div class="vehicle-info">
                        <h3 class="vehicle-model">{vehicle.model}</h3>
                        <span class="vehicle-plate">{vehicle.plateNumber}</span>
                      </div>
                      {#if status}
                        <Badge variant={getStatusVariant(status.status)}>
                          {REMINDER_STATUS[status.status].label}
                        </Badge>
                      {:else}
                        <Badge variant="success">عادی</Badge>
                      {/if}
                    </div>

                    <div class="vehicle-stats">
                      <div class="stat">
                        <span class="stat-label">کیلومتر فعلی</span>
                        <span class="stat-value">{formatNumber(vehicle.currentKm)}</span>
                      </div>
                      <div class="stat">
                        <span class="stat-label">سال</span>
                        <span class="stat-value">{formatNumber(vehicle.year)}</span>
                      </div>
                    </div>

                    {#if status}
                      <div class="vehicle-alert">
                        <span class="alert-badge {status.status}">
                          {status.message}
                        </span>
                      </div>
                    {/if}
                  </div>
                </Card>
              </a>
            {/each}
          </div>
        {/if}
      </section>

      <!-- Quick Actions -->
      <section class="section">
        <h2 class="section-title">
          <span>⚡</span>
          <span>دسترسی سریع</span>
        </h2>

        <div class="quick-actions">
          <a href="/add?tab=service" class="quick-action">
            <Card hoverable padding="md">
              <span class="action-icon">🔧</span>
              <span class="action-label">ثبت سرویس</span>
            </Card>
          </a>

          <a href="/add?tab=expense" class="quick-action">
            <Card hoverable padding="md">
              <span class="action-icon">💰</span>
              <span class="action-label">ثبت هزینه</span>
            </Card>
          </a>

          <a href="/reports" class="quick-action">
            <Card hoverable padding="md">
              <span class="action-icon">📊</span>
              <span class="action-label">گزارش‌ها</span>
            </Card>
          </a>

          <a href="/vehicles" class="quick-action">
            <Card hoverable padding="md">
              <span class="action-icon">➕</span>
              <span class="action-label">افزودن خودرو</span>
            </Card>
          </a>
        </div>
      </section>
    {/if}
  </div>
</Layout>

<style>
  /* Dashboard specific styles */

  /* Page container - using shared styles from layouts.css */
  .page-container {
    max-width: 1200px;
  }

  /* Quick actions */
  .quick-actions {
    display: grid;
    gap: var(--space-lg);
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 640px) {
    .quick-actions {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  @media (min-width: 1024px) {
    .quick-actions {
      gap: var(--space-xl);
    }
  }

  /* Vehicles grid */
  .vehicles-grid {
    display: grid;
    gap: var(--space-lg);
    grid-template-columns: 1fr;
  }

  @media (min-width: 640px) {
    .vehicles-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 1024px) {
    .vehicles-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-xl);
      max-width: 100%;
    }
  }

  @media (min-width: 1280px) {
    .vehicles-grid {
      gap: calc(var(--space-xl) * 1.25);
    }
  }

  @media (min-width: 1440px) {
    .vehicles-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-xl);
    }
  }

  /* Section spacing */
  .section {
    margin-bottom: var(--space-xl);
  }

  @media (min-width: 1024px) {
    .section {
      margin-bottom: var(--space-2xl);
    }
  }

  /* Section headers */
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-lg);
  }

  @media (min-width: 1024px) {
    .section-header {
      margin-bottom: var(--space-xl);
    }
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--color-text);
    margin: 0;
  }

  @media (min-width: 1024px) {
    .section-title {
      font-size: var(--font-size-xl);
    }
  }

  .section-link {
    font-size: var(--font-size-sm);
    color: var(--color-primary);
    text-decoration: none;
    font-weight: 500;
  }

  .section-link:hover {
    text-decoration: underline;
  }

  /* Alerts responsive */
  .alerts-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  @media (min-width: 1024px) {
    .alerts-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: var(--space-md);
    }
  }

  /* Loading state responsive */
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    gap: var(--space-md);
    text-align: center;
  }

  @media (min-width: 1024px) {
    .loading-container {
      min-height: 400px;
    }
  }

  /* Vehicle card improvements for larger screens */
  .vehicle-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
    min-height: 160px;
  }

  @media (min-width: 640px) {
    .vehicle-card {
      min-height: 180px;
    }
  }

  @media (min-width: 1024px) {
    .vehicle-card {
      gap: var(--space-xl);
      min-height: 200px;
    }
  }

  /* Large vehicle card style */
  .vehicle-card-large {
    min-height: 180px;
  }

  @media (min-width: 640px) {
    .vehicle-card-large {
      min-height: 200px;
    }
  }

  @media (min-width: 1024px) {
    .vehicle-card-large {
      min-height: 240px;
      padding: var(--space-xl);
    }
  }

  @media (min-width: 1440px) {
    .vehicle-card-large {
      min-height: 260px;
    }
  }

  .vehicle-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--space-md);
    margin-bottom: var(--space-md);
  }

  @media (min-width: 1024px) {
    .vehicle-header {
      margin-bottom: var(--space-lg);
    }
  }

  .vehicle-info {
    flex: 1;
    min-width: 0;
  }

  .vehicle-icon {
    font-size: 2.5rem;
    display: block;
    margin-bottom: var(--space-sm);
  }

  @media (min-width: 640px) {
    .vehicle-icon {
      font-size: 3rem;
    }
  }

  @media (min-width: 1024px) {
    .vehicle-icon {
      font-size: 3.5rem;
      margin-bottom: var(--space-md);
    }
  }

  .vehicle-model {
    font-size: var(--font-size-xl);
    font-weight: 700;
    color: var(--color-text);
    margin: 0 0 var(--space-xs) 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (min-width: 1024px) {
    .vehicle-model {
      font-size: var(--font-size-2xl);
      margin-bottom: var(--space-sm);
    }
  }

  .vehicle-plate {
    font-size: var(--font-size-base);
    color: var(--color-text-light);
    font-weight: 500;
  }

  @media (min-width: 1024px) {
    .vehicle-plate {
      font-size: var(--font-size-lg);
    }
  }

  @media (min-width: 1440px) {
    .vehicle-plate {
      font-size: var(--font-size-xl);
    }
  }

  .vehicle-stats {
    display: flex;
    gap: var(--space-lg);
    margin-top: auto;
  }

  @media (min-width: 640px) {
    .vehicle-stats {
      gap: var(--space-xl);
    }
  }

  @media (min-width: 1024px) {
    .vehicle-stats {
      gap: var(--space-2xl);
    }
  }

  .stat {
    flex: 1;
    text-align: center;
    padding: var(--space-md);
    background: rgba(0, 0, 0, 0.02);
    border-radius: var(--glass-radius);
    border: 1px solid rgba(0, 0, 0, 0.05);
  }

  @media (min-width: 640px) {
    .stat {
      padding: var(--space-lg);
    }
  }

  @media (min-width: 1024px) {
    .stat {
      text-align: left;
      padding: var(--space-xl);
    }
  }

  .stat-label {
    font-size: var(--font-size-sm);
    color: var(--color-text-light);
    margin-bottom: var(--space-sm);
    display: block;
  }

  @media (min-width: 1024px) {
    .stat-label {
      font-size: var(--font-size-base);
      margin-bottom: var(--space-md);
    }
  }

  .stat-value {
    font-size: var(--font-size-lg);
    font-weight: 700;
    color: var(--color-text);
    display: block;
  }

  @media (min-width: 1024px) {
    .stat-value {
      font-size: var(--font-size-xl);
    }
  }

  @media (min-width: 1440px) {
    .stat-value {
      font-size: var(--font-size-2xl);
    }
  }

  /* Vehicle alert styling */
  .vehicle-alert {
    margin-top: var(--space-md);
    padding: var(--space-sm) var(--space-md);
    background: rgba(255, 193, 7, 0.1);
    border: 1px solid rgba(255, 193, 7, 0.3);
    border-radius: var(--glass-radius);
    text-align: center;
  }

  @media (min-width: 1024px) {
    .vehicle-alert {
      margin-top: var(--space-lg);
      padding: var(--space-md) var(--space-lg);
    }
  }

  .alert-badge {
    font-size: var(--font-size-sm);
    font-weight: 600;
    color: var(--color-text);
    display: block;
  }

  .alert-badge.ok {
    color: var(--color-success);
  }

  .alert-badge.near {
    color: var(--color-warning);
  }

  .alert-badge.overdue {
    color: var(--color-danger);
  }

  @media (min-width: 1024px) {
    .alert-badge {
      font-size: var(--font-size-lg);
    }
  }

  .quick-action {
    display: block;
    padding: var(--space-lg);
    text-decoration: none;
    color: inherit;
    background: var(--glass-bg-solid);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border: 1px solid var(--glass-border);
    border-radius: var(--glass-radius);
    box-shadow: var(--glass-shadow);
    transition: all var(--transition-fast);
  }

  .quick-action:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }

  .action-icon {
    font-size: 2.5rem;
    margin-bottom: var(--space-sm);
    display: block;
  }

  @media (min-width: 640px) {
    .action-icon {
      font-size: 2rem;
    }
  }

  @media (min-width: 1024px) {
    .action-icon {
      font-size: 2.5rem;
    }
  }

  .action-label {
    font-size: var(--font-size-sm);
    font-weight: 500;
    color: var(--color-text);
  }

  @media (min-width: 1024px) {
    .action-label {
      font-size: var(--font-size-base);
    }
  }

  /* Alerts */
  .alerts-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  :global(.alert-card) {
    border-right: 4px solid var(--color-warning) !important;
  }

  :global(.alert-overdue) {
    border-right-color: var(--color-danger) !important;
  }

  .alert-content {
    display: flex;
    align-items: center;
    gap: var(--space-md);
  }

  .alert-icon {
    font-size: 1.5rem;
  }

  .alert-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .alert-vehicle {
    font-size: var(--font-size-sm);
    font-weight: 600;
    color: var(--color-text);
  }

  .alert-message {
    font-size: var(--font-size-sm);
    color: var(--color-text-light);
  }

  .alert-date {
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
  }

  /* Recent expenses */
  .expenses-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .expense-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-lg);
    background: var(--glass-bg-solid);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border: 1px solid var(--glass-border);
    border-radius: var(--glass-radius);
    box-shadow: var(--glass-shadow);
  }

  .expense-info {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }

  .expense-icon {
    font-size: var(--font-size-lg);
  }

  .expense-details {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .expense-description {
    font-size: var(--font-size-sm);
    font-weight: 600;
    color: var(--color-text);
  }

  .expense-meta {
    font-size: var(--font-size-xs);
    color: var(--color-text-light);
  }

  .expense-amount {
    font-size: var(--font-size-sm);
    font-weight: 600;
    color: var(--color-danger);
  }
</style>
