<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { Layout } from '$lib/components/layout';
  import { Card, Button, Input, Modal, Spinner, EmptyState, Badge, Tabs } from '$lib/components/ui';
  import { vehiclesStore, servicesStore, expensesStore, toastStore } from '$lib/stores';
  import { vehicleService, serviceService, expenseService } from '$lib/services';
  import { formatNumber, formatCurrency, formatJalaliDate } from '$lib/utils/format';
  import { SERVICE_TYPES, EXPENSE_CATEGORIES, EXPENSE_ICONS } from '$lib/utils/constants';
  import type { Vehicle, ServiceRecord, Expense } from '$lib/types';

  let isLoading = $state(true);
  let vehicle = $state<Vehicle | null>(null);
  let services = $state<ServiceRecord[]>([]);
  let expenses = $state<Expense[]>([]);

  let activeTab = $state('services');
  let showKmModal = $state(false);
  let newKm = $state(0);
  let isUpdatingKm = $state(false);

  const tabs = [
    { id: 'services', label: 'سرویس‌ها', icon: '🔧' },
    { id: 'expenses', label: 'هزینه‌ها', icon: '💰' },
  ];

  onMount(async () => {
    const id = $page.params.id;
    if (id) {
      await loadVehicleData(id);
    }
  });

  async function loadVehicleData(id: string) {
    isLoading = true;
    try {
      const [vehicleData, servicesData, expensesData] = await Promise.all([
        vehicleService.getById(id),
        serviceService.getAll(id),
        expenseService.getAll(id),
      ]);
      vehicle = vehicleData;
      services = servicesData;
      expenses = expensesData;
      newKm = vehicleData.currentKm;
    } catch {
      toastStore.error('خطا در بارگذاری اطلاعات خودرو');
    } finally {
      isLoading = false;
    }
  }

  async function updateKilometers() {
    if (!vehicle) return;
    
    isUpdatingKm = true;
    try {
      const updated = await vehicleService.updateKm(vehicle.id, newKm);
      vehicle = updated;
      vehiclesStore.updateKilometers(vehicle.id, newKm);
      showKmModal = false;
      toastStore.success('کیلومتر به‌روزرسانی شد');
    } catch {
      toastStore.error('خطا در به‌روزرسانی کیلومتر');
    } finally {
      isUpdatingKm = false;
    }
  }

  function getTotalServiceCost(): number {
    return services.reduce((sum, s) => sum + s.cost, 0);
  }

  function getTotalExpenses(): number {
    return expenses.reduce((sum, e) => sum + e.amount, 0);
  }
</script>

<Layout showBack={true} headerTitle={vehicle?.model || 'جزئیات خودرو'}>
  <div class="page-container">
    {#if isLoading}
      <div class="loading-container">
        <Spinner size="lg" />
        <p>در حال بارگذاری...</p>
      </div>
    {:else if !vehicle}
      <Card>
        <EmptyState
          icon="❌"
          title="خودرو یافت نشد"
          description="این خودرو وجود ندارد یا حذف شده است"
        >
          <Button variant="primary" onclick={() => goto('/vehicles')}>
            بازگشت به لیست
          </Button>
        </EmptyState>
      </Card>
    {:else}
      <!-- Vehicle Info Card -->
      <Card variant="solid" padding="lg" class="vehicle-info-card">
        <div class="vehicle-header">
          <div class="vehicle-icon">🚗</div>
          <div class="vehicle-details">
            <h1 class="vehicle-model">{vehicle.model}</h1>
            <div class="vehicle-meta">
              <span>{vehicle.plateNumber}</span>
              <span>•</span>
              <span>سال {formatNumber(vehicle.year)}</span>
            </div>
          </div>
        </div>

        <div class="km-section">
          <div class="km-display">
            <span class="km-value">{formatNumber(vehicle.currentKm)}</span>
            <span class="km-label">کیلومتر</span>
          </div>
          <Button variant="secondary" size="sm" onclick={() => showKmModal = true}>
            به‌روزرسانی کیلومتر
          </Button>
        </div>

        <div class="stats-row">
          <div class="stat-box">
            <span class="stat-icon">🔧</span>
            <span class="stat-value">{formatCurrency(getTotalServiceCost(), 'toman')}</span>
            <span class="stat-label">هزینه سرویس</span>
          </div>
          <div class="stat-box">
            <span class="stat-icon">💰</span>
            <span class="stat-value">{formatCurrency(getTotalExpenses(), 'toman')}</span>
            <span class="stat-label">سایر هزینه‌ها</span>
          </div>
        </div>

        {#if vehicle.note}
          <div class="vehicle-note">
            <span class="note-icon">📝</span>
            <span>{vehicle.note}</span>
          </div>
        {/if}
      </Card>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <a href="/add?tab=service&vehicle={vehicle.id}" class="quick-btn">
          <span class="quick-icon">🔧</span>
          <span>ثبت سرویس</span>
        </a>
        <a href="/add?tab=expense&vehicle={vehicle.id}" class="quick-btn">
          <span class="quick-icon">💰</span>
          <span>ثبت هزینه</span>
        </a>
      </div>

      <!-- Services & Expenses Tabs -->
      <Tabs {tabs} bind:activeTab />

      {#if activeTab === 'services'}
        <div class="records-list">
          {#if services.length === 0}
            <Card>
              <EmptyState
                icon="🔧"
                title="سرویسی ثبت نشده"
                description="اولین سرویس این خودرو را ثبت کنید"
              >
                <a href="/add?tab=service&vehicle={vehicle.id}">
                  <Button variant="primary">ثبت سرویس</Button>
                </a>
              </EmptyState>
            </Card>
          {:else}
            {#each services as service}
              <Card padding="md" variant="solid">
                <div class="record-header">
                  <div class="record-type">
                    <span class="type-icon">🔧</span>
                    <span class="type-label">{SERVICE_TYPES[service.type]}</span>
                  </div>
                  <Badge variant="primary">{formatJalaliDate(service.date)}</Badge>
                </div>
                <div class="record-details">
                  <div class="detail-item">
                    <span class="detail-label">هزینه</span>
                    <span class="detail-value">{formatCurrency(service.cost, 'toman')}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">کیلومتر</span>
                    <span class="detail-value">{formatNumber(service.km)}</span>
                  </div>
                </div>
                {#if service.note}
                  <p class="record-note">{service.note}</p>
                {/if}
              </Card>
            {/each}
          {/if}
        </div>
      {:else}
        <div class="records-list">
          {#if expenses.length === 0}
            <Card>
              <EmptyState
                icon="💰"
                title="هزینه‌ای ثبت نشده"
                description="هزینه‌های این خودرو را ثبت کنید"
              >
                <a href="/add?tab=expense&vehicle={vehicle.id}">
                  <Button variant="primary">ثبت هزینه</Button>
                </a>
              </EmptyState>
            </Card>
          {:else}
            {#each expenses as expense}
              <Card padding="md" variant="solid">
                <div class="record-header">
                  <div class="record-type">
                    <span class="type-icon">{EXPENSE_ICONS[expense.category]}</span>
                    <span class="type-label">{EXPENSE_CATEGORIES[expense.category]}</span>
                  </div>
                  <Badge variant="default">{formatJalaliDate(expense.date)}</Badge>
                </div>
                <div class="record-details">
                  <div class="detail-item">
                    <span class="detail-label">مبلغ</span>
                    <span class="detail-value">{formatCurrency(expense.amount, 'toman')}</span>
                  </div>
                  {#if expense.km}
                    <div class="detail-item">
                      <span class="detail-label">کیلومتر</span>
                      <span class="detail-value">{formatNumber(expense.km)}</span>
                    </div>
                  {/if}
                </div>
                {#if expense.note}
                  <p class="record-note">{expense.note}</p>
                {/if}
              </Card>
            {/each}
          {/if}
        </div>
      {/if}
    {/if}
  </div>
</Layout>

<!-- Update KM Modal -->
<Modal bind:open={showKmModal} title="به‌روزرسانی کیلومتر" size="sm">
  <form onsubmit={(e) => { e.preventDefault(); updateKilometers(); }}>
    <Input
      type="number"
      name="km"
      label="کیلومتر فعلی"
      bind:value={newKm}
      min={0}
      required
    />
    <div class="modal-actions">
      <Button type="button" variant="secondary" onclick={() => showKmModal = false}>
        انصراف
      </Button>
      <Button type="submit" variant="primary" loading={isUpdatingKm}>
        ذخیره
      </Button>
    </div>
  </form>
</Modal>

<style>
  /* Vehicle detail page specific styles */

  /* Vehicle Info Card */
  :global(.vehicle-info-card) {
    margin-bottom: 1rem;
  }

  .vehicle-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .vehicle-icon {
    font-size: 3rem;
  }

  .vehicle-details {
    flex: 1;
  }

  .vehicle-model {
    margin: 0;
    font-size: 1.375rem;
    font-weight: 700;
  }

  .vehicle-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.25rem;
    font-size: 0.875rem;
    color: var(--color-text-light);
  }

  .km-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    background: rgba(30, 58, 138, 0.05);
    border-radius: 12px;
    margin-bottom: 1.5rem;
  }

  .km-display {
    display: flex;
    flex-direction: column;
  }

  .km-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-primary);
  }

  .km-label {
    font-size: 0.75rem;
    color: var(--color-text-muted);
  }

  .stats-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .stat-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    padding: 1rem;
    background: rgba(0, 0, 0, 0.02);
    border-radius: 12px;
  }

  .stat-icon {
    font-size: 1.25rem;
  }

  .stat-box .stat-value {
    font-size: 0.9375rem;
    font-weight: 600;
  }

  .stat-box .stat-label {
    font-size: 0.75rem;
    color: var(--color-text-muted);
  }

  .vehicle-note {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.75rem;
    background: rgba(0, 0, 0, 0.02);
    border-radius: 8px;
    font-size: 0.875rem;
    color: var(--color-text-light);
  }

  /* Quick Actions */
  .quick-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .quick-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 1rem;
    background: var(--glass-bg-solid);
    border: 1px solid var(--glass-border);
    border-radius: 12px;
    text-decoration: none;
    color: var(--color-text);
    font-weight: 500;
    transition: all 0.2s;
  }

  .quick-btn:hover {
    background: white;
    box-shadow: var(--glass-shadow);
  }

  .quick-icon {
    font-size: 1.25rem;
  }

  /* Records List */
  .records-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .record-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
  }

  .record-type {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .type-icon {
    font-size: 1.25rem;
  }

  .type-label {
    font-weight: 600;
  }

  .record-details {
    display: flex;
    gap: 1.5rem;
  }

  .detail-item {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .detail-label {
    font-size: 0.75rem;
    color: var(--color-text-muted);
  }

  .detail-value {
    font-weight: 500;
  }

  .record-note {
    margin: 0.75rem 0 0;
    padding-top: 0.75rem;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    font-size: 0.875rem;
    color: var(--color-text-light);
  }

  .modal-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
    margin-top: 1.5rem;
  }
</style>

