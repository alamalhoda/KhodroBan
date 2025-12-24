<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { Layout } from '$lib/components/layout';
  import { Card, Button, Badge, Spinner, EmptyState } from '$lib/components/ui';
  import { vehiclesStore, servicesStore, expensesStore, remindersStore, activeReminders, toastStore } from '$lib/stores';
  import { vehicleService, serviceService, expenseService, reminderService } from '$lib/services';
  import { formatNumber, formatCurrency, formatKm, formatJalaliDate, getRelativeTime } from '$lib/utils/format';
  import { REMINDER_STATUS, SERVICE_TYPES, POLL_INTERVAL } from '$lib/utils/constants';
  import type { Vehicle, Reminder } from '$lib/types';

  let isLoading = $state(true);
  let vehicles = $derived($vehiclesStore.vehicles);
  let reminders = $derived($activeReminders);

  onMount(async () => {
    await loadData();
    
    // Set up polling for reminders
    const pollInterval = setInterval(() => {
      reminderService.refresh().then(data => {
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
    return reminders.find(r => r.vehicleId === vehicleId && !r.dismissed);
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
              <Button variant="primary" onclick={() => goto('/vehicles')}>
                افزودن خودرو
              </Button>
            </EmptyState>
          </Card>
        {:else}
          <div class="vehicles-grid">
            {#each vehicles as vehicle}
              {@const status = getVehicleStatus(vehicle.id)}
              <a href="/vehicles/{vehicle.id}" class="vehicle-card-link">
                <Card hoverable clickable padding="md" variant="solid">
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
  /* Home page specific styles */

  /* Quick actions */
  .quick-actions {
    display: grid;
    gap: var(--space-lg);
  }

  @media (min-width: 768px) {
    .quick-actions {
      grid-template-columns: repeat(2, 1fr);
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
    font-size: 3rem;
    margin-bottom: var(--space-sm);
    display: block;
  }

  .action-label {
    font-size: var(--font-size-base);
    font-weight: 500;
    color: var(--color-text);
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

  /* Alerts */
  .alerts-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
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
    gap: 0.75rem;
  }

  .alert-icon {
    font-size: 1.5rem;
  }

  .alert-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .alert-vehicle {
    font-weight: 600;
    font-size: 0.9375rem;
  }

  .alert-message {
    font-size: 0.8125rem;
    color: var(--color-text-light);
  }

  .alert-dismiss {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 50%;
    cursor: pointer;
    font-size: 0.75rem;
    color: var(--color-text-light);
    transition: background 0.2s;
  }

  .alert-dismiss:hover {
    background: rgba(0, 0, 0, 0.1);
  }

  /* Vehicles Grid */
  .vehicles-grid {
    display: grid;
    gap: 1rem;
  }

  @media (min-width: 768px) {
    .vehicles-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .vehicle-card-link {
    text-decoration: none;
    color: inherit;
  }

  .vehicle-card {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .vehicle-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .vehicle-icon {
    font-size: 2rem;
  }

  .vehicle-info {
    flex: 1;
  }

  .vehicle-model {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
  }

  .vehicle-plate {
    font-size: 0.8125rem;
    color: var(--color-text-light);
  }

  .vehicle-stats {
    display: flex;
    gap: 1.5rem;
  }

  .stat {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .stat-label {
    font-size: 0.75rem;
    color: var(--color-text-muted);
  }

  .stat-value {
    font-size: 1rem;
    font-weight: 600;
  }

  .vehicle-alert {
    padding-top: 0.75rem;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
  }

  .alert-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
    border-radius: 9999px;
  }

  .alert-badge.near {
    background: var(--color-warning-bg);
    color: var(--color-warning);
  }

  .alert-badge.overdue {
    background: var(--color-danger-bg);
    color: var(--color-danger);
  }

  /* Quick Actions */
  .quick-actions {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  @media (min-width: 768px) {
    .quick-actions {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .quick-action {
    text-decoration: none;
    color: inherit;
  }

  .quick-action :global(.card) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    text-align: center;
  }

  .action-icon {
    font-size: 1.75rem;
  }

  .action-label {
    font-size: 0.875rem;
    font-weight: 500;
  }
</style>

