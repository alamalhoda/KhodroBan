<script lang="ts">
  import { onMount } from 'svelte';
  import { Layout } from '$lib/components/layout';
  import { Card, Button, Input, Modal, Spinner, EmptyState, Badge } from '$lib/components/ui';
  import { vehiclesStore, remindersStore, activeReminders, toastStore, isPro } from '$lib/stores';
  import { vehicleService, reminderService } from '$lib/services';
  import { validators, validateForm, getFieldError, type FieldError } from '$lib/utils/validation';
  import { formatNumber, getCurrentJalaliYear } from '$lib/utils/format';
  import { FREE_TIER_LIMITS, REMINDER_STATUS } from '$lib/utils/constants';
  import type { Vehicle, VehicleFormData, Reminder } from '$lib/types';

  let isLoading = $state(true);
  let vehicles = $derived($vehiclesStore.vehicles);
  let reminders = $derived($activeReminders);

  // Modal state
  let showModal = $state(false);
  let editingVehicle = $state<Vehicle | null>(null);
  let isSubmitting = $state(false);

  // Form state
  let formData = $state<VehicleFormData>({
    model: '',
    year: getCurrentJalaliYear(),
    plateNumber: '',
    currentKm: 0,
    note: '',
  });
  let errors = $state<FieldError[]>([]);

  onMount(async () => {
    await loadVehicles();
  });

  async function loadVehicles() {
    isLoading = true;
    try {
      const [vehiclesData, remindersData] = await Promise.all([
        vehicleService.getAll(),
        reminderService.getAll(),
      ]);
      vehiclesStore.setVehicles(vehiclesData);
      remindersStore.setReminders(remindersData);
    } catch {
      toastStore.error('خطا در بارگذاری خودروها');
    } finally {
      isLoading = false;
    }
  }

  function openAddModal() {
    // Check free tier limit
    if (!$isPro && vehicles.length >= FREE_TIER_LIMITS.maxVehicles) {
      toastStore.warning(`در نسخه رایگان فقط ${FREE_TIER_LIMITS.maxVehicles} خودرو می‌توانید ثبت کنید. برای خودروهای بیشتر، به Pro ارتقا دهید.`);
      return;
    }
    
    editingVehicle = null;
    formData = {
      model: '',
      year: getCurrentJalaliYear(),
      plateNumber: '',
      currentKm: 0,
      note: '',
    };
    errors = [];
    showModal = true;
  }

  function openEditModal(vehicle: Vehicle) {
    editingVehicle = vehicle;
    formData = {
      model: vehicle.model,
      year: vehicle.year,
      plateNumber: vehicle.plateNumber,
      currentKm: vehicle.currentKm,
      note: vehicle.note || '',
    };
    errors = [];
    showModal = true;
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();

    const validation = validateForm(
      formData,
      {
        model: [(v) => validators.required(v, 'مدل خودرو')],
        year: [(v) => validators.required(v, 'سال'), validators.year],
        plateNumber: [(v) => validators.required(v, 'شماره پلاک'), validators.plateNumber],
        currentKm: [(v) => validators.required(v, 'کیلومتر فعلی'), validators.kilometers],
      }
    );

    if (!validation.valid) {
      errors = validation.errors;
      return;
    }

    errors = [];
    isSubmitting = true;

    try {
      if (editingVehicle) {
        const updated = await vehicleService.update(editingVehicle.id, formData);
        vehiclesStore.updateVehicle(editingVehicle.id, updated);
        toastStore.success('خودرو با موفقیت ویرایش شد');
      } else {
        const created = await vehicleService.create(formData);
        vehiclesStore.addVehicle(created);
        toastStore.success('خودرو با موفقیت اضافه شد');
      }
      showModal = false;
    } catch {
      toastStore.error('خطا در ذخیره خودرو');
    } finally {
      isSubmitting = false;
    }
  }

  async function handleDelete(vehicle: Vehicle) {
    if (!confirm(`آیا از حذف "${vehicle.model}" مطمئن هستید؟`)) return;

    try {
      await vehicleService.delete(vehicle.id);
      vehiclesStore.deleteVehicle(vehicle.id);
      toastStore.success('خودرو حذف شد');
    } catch {
      toastStore.error('خطا در حذف خودرو');
    }
  }

  function getVehicleStatus(vehicleId: string): Reminder | undefined {
    return reminders.find(r => r.vehicleId === vehicleId);
  }

  function getStatusVariant(status: string): 'success' | 'warning' | 'danger' {
    if (status === 'ok') return 'success';
    if (status === 'near') return 'warning';
    return 'danger';
  }
</script>

<Layout headerTitle="خودروها">
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">خودروهای من</h1>
      <Button variant="primary" onclick={openAddModal} icon="➕">
        افزودن خودرو
      </Button>
    </div>

    {#if isLoading}
      <div class="loading-container">
        <Spinner size="lg" />
        <p>در حال بارگذاری...</p>
      </div>
    {:else if vehicles.length === 0}
      <Card>
        <EmptyState
          icon="🚗"
          title="خودرویی ثبت نشده"
          description="اولین خودرو خود را اضافه کنید تا بتوانید سرویس و هزینه‌ها را مدیریت کنید"
        >
          <Button variant="primary" onclick={openAddModal}>
            افزودن خودرو
          </Button>
        </EmptyState>
      </Card>
    {:else}
      <div class="vehicles-list">
        {#each vehicles as vehicle}
          {@const status = getVehicleStatus(vehicle.id)}
          <Card padding="none" variant="solid" class="vehicle-card">
            <a href="/vehicles/{vehicle.id}" class="vehicle-link">
              <div class="vehicle-main">
                <div class="vehicle-icon">🚗</div>
                <div class="vehicle-info">
                  <h3 class="vehicle-model">{vehicle.model}</h3>
                  <div class="vehicle-meta">
                    <span>{vehicle.plateNumber}</span>
                    <span>•</span>
                    <span>{formatNumber(vehicle.year)}</span>
                  </div>
                </div>
                {#if status}
                  <Badge variant={getStatusVariant(status.status)}>
                    {REMINDER_STATUS[status.status].label}
                  </Badge>
                {/if}
              </div>
              
              <div class="vehicle-stats">
                <div class="stat">
                  <span class="stat-value">{formatNumber(vehicle.currentKm)}</span>
                  <span class="stat-label">کیلومتر</span>
                </div>
              </div>
            </a>
            
            <div class="vehicle-actions">
              <Button size="sm" variant="ghost" onclick={() => openEditModal(vehicle)}>
                ✏️ ویرایش
              </Button>
              <Button size="sm" variant="ghost" onclick={() => handleDelete(vehicle)}>
                🗑️ حذف
              </Button>
            </div>
          </Card>
        {/each}
      </div>

      {#if !$isPro}
        <Card padding="md" class="limit-notice">
          <div class="limit-content">
            <span class="limit-icon">💡</span>
            <div class="limit-text">
              <strong>نسخه رایگان:</strong>
              {vehicles.length} از {FREE_TIER_LIMITS.maxVehicles} خودرو استفاده شده
            </div>
            <a href="/settings" class="limit-link">ارتقا به Pro</a>
          </div>
        </Card>
      {/if}
    {/if}
  </div>
</Layout>

<!-- Add/Edit Modal -->
<Modal bind:open={showModal} title={editingVehicle ? 'ویرایش خودرو' : 'افزودن خودرو'}>
  <form class="form" onsubmit={handleSubmit}>
    <Input
      name="model"
      label="مدل خودرو"
      placeholder="مثال: پژو ۲۰۶"
      bind:value={formData.model}
      error={getFieldError(errors, 'model')}
      required
    />

    <Input
      type="number"
      name="year"
      label="سال ساخت (شمسی)"
      placeholder="مثال: ۱۳۹۸"
      bind:value={formData.year}
      error={getFieldError(errors, 'year')}
      min={1350}
      max={getCurrentJalaliYear() + 1}
      required
    />

    <Input
      name="plateNumber"
      label="شماره پلاک"
      placeholder="مثال: ۱۲ب۳۴۵ - ۷۸"
      bind:value={formData.plateNumber}
      error={getFieldError(errors, 'plateNumber')}
      required
    />

    <Input
      type="number"
      name="currentKm"
      label="کیلومتر فعلی"
      placeholder="مثال: ۸۵۰۰۰"
      bind:value={formData.currentKm}
      error={getFieldError(errors, 'currentKm')}
      min={0}
      required
    />

    <Input
      name="note"
      label="یادداشت (اختیاری)"
      placeholder="توضیحات بیشتر..."
      bind:value={formData.note}
    />

    <div class="form-actions">
      <Button type="button" variant="secondary" onclick={() => showModal = false}>
        انصراف
      </Button>
      <Button type="submit" variant="primary" loading={isSubmitting}>
        {editingVehicle ? 'ذخیره تغییرات' : 'افزودن خودرو'}
      </Button>
    </div>
  </form>
</Modal>

<style>
  /* Vehicles page specific styles */
  /* Using shared page-container from layouts.css */

  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--space-xl);
    flex-wrap: wrap;
    gap: var(--space-md);
  }

  @media (min-width: 768px) {
    .page-header {
      margin-bottom: var(--space-2xl);
    }
  }

  .page-title {
    margin: 0;
    font-size: var(--font-size-xl);
    font-weight: 600;
  }

  @media (min-width: 1024px) {
    .page-title {
      font-size: var(--font-size-2xl);
    }
  }

  .vehicles-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  @media (min-width: 768px) {
    .vehicles-list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-lg);
    }
  }

  @media (min-width: 1024px) {
    .vehicles-list {
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-xl);
    }
  }

  :global(.vehicle-card) {
    overflow: hidden;
  }

  .vehicle-link {
    display: block;
    padding: var(--space-lg);
    text-decoration: none;
    color: inherit;
  }

  .vehicle-main {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    margin-bottom: var(--space-lg);
  }

  .vehicle-icon {
    font-size: 2.5rem;
  }

  @media (min-width: 768px) {
    .vehicle-icon {
      font-size: 3rem;
    }
  }

  .vehicle-info {
    flex: 1;
    min-width: 0;
  }

  .vehicle-model {
    margin: 0;
    font-size: 1.0625rem;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (min-width: 768px) {
    .vehicle-model {
      font-size: var(--font-size-lg);
    }
  }

  .vehicle-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.25rem;
    font-size: 0.8125rem;
    color: var(--color-text-light);
  }

  .vehicle-stats {
    display: flex;
    gap: 1rem;
    padding-top: 0.75rem;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
  }

  .stat {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .stat-value {
    font-size: 1.125rem;
    font-weight: 600;
  }

  .stat-label {
    font-size: 0.75rem;
    color: var(--color-text-muted);
  }

  .vehicle-actions {
    display: flex;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: rgba(0, 0, 0, 0.02);
    border-top: 1px solid rgba(0, 0, 0, 0.05);
  }

  :global(.limit-notice) {
    margin-top: 1.5rem;
  }

  .limit-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .limit-icon {
    font-size: 1.25rem;
  }

  .limit-text {
    flex: 1;
    font-size: 0.875rem;
    color: var(--color-text-light);
  }

  .limit-link {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-primary);
  }

  /* Form - using shared styles from layouts.css */
</style>

