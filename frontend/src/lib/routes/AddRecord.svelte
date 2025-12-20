<script lang="ts">
  import { onMount } from 'svelte';
  import { push, querystring } from '../../lib/router';
  import { Layout } from '../components/layout';
  import { Card, Button, Input, Select, Tabs } from '../components/common';
  import { vehiclesStore, servicesStore, expensesStore, toastStore } from '../stores';
  import { vehicleService, serviceService, expenseService } from '../services';
  import { validators, validateForm, getFieldError, type FieldError } from '../utils/validation';
  import { getCurrentJalaliDate } from '../utils/format';
  import { SERVICE_TYPE_OPTIONS, EXPENSE_CATEGORY_OPTIONS } from '../utils/constants';
  import type { ServiceFormData, ExpenseFormData, SelectOption } from '../types';

  // Parse query params
  let initialTab = 'service';
  let initialVehicle = '';

  $effect(() => {
    const params = new URLSearchParams($querystring);
    const tab = params.get('tab');
    const vehicle = params.get('vehicle');
    if (tab === 'expense') initialTab = 'expense';
    if (vehicle) initialVehicle = vehicle;
  });

  let activeTab = $state(initialTab);
  let isLoading = $state(true);
  let isSubmitting = $state(false);
  let vehicleOptions = $state<SelectOption[]>([]);
  let errors = $state<FieldError[]>([]);

  const tabs = [
    { id: 'service', label: 'ثبت سرویس', icon: '🔧' },
    { id: 'expense', label: 'ثبت هزینه', icon: '💰' },
  ];

  // Service form
  let serviceForm = $state<ServiceFormData>({
    vehicleId: initialVehicle,
    date: getCurrentJalaliDate(),
    km: 0,
    cost: 0,
    type: 'oil_change',
    note: '',
  });

  // Expense form
  let expenseForm = $state<ExpenseFormData>({
    vehicleId: initialVehicle,
    date: getCurrentJalaliDate(),
    amount: 0,
    category: 'fuel',
    km: undefined,
    note: '',
  });

  onMount(async () => {
    await loadVehicles();
    
    // Set initial vehicle after loading
    const params = new URLSearchParams($querystring);
    const tab = params.get('tab');
    const vehicle = params.get('vehicle');
    
    if (tab === 'expense') activeTab = 'expense';
    if (vehicle) {
      serviceForm.vehicleId = vehicle;
      expenseForm.vehicleId = vehicle;
    } else if (vehicleOptions.length > 0) {
      serviceForm.vehicleId = vehicleOptions[0].value;
      expenseForm.vehicleId = vehicleOptions[0].value;
    }
  });

  async function loadVehicles() {
    isLoading = true;
    try {
      let vehicles = $vehiclesStore.vehicles;
      if (vehicles.length === 0) {
        vehicles = await vehicleService.getAll();
        vehiclesStore.setVehicles(vehicles);
      }
      vehicleOptions = vehicles.map(v => ({
        value: v.id,
        label: `${v.model} (${v.plateNumber})`,
      }));
    } catch {
      toastStore.error('خطا در بارگذاری خودروها');
    } finally {
      isLoading = false;
    }
  }

  async function submitService(e: Event) {
    e.preventDefault();
    
    const validation = validateForm(
      serviceForm,
      {
        vehicleId: [(v) => validators.required(v, 'خودرو')],
        date: [(v) => validators.required(v, 'تاریخ')],
        km: [(v) => validators.required(v, 'کیلومتر'), validators.kilometers],
        cost: [(v) => validators.required(v, 'هزینه'), validators.amount],
        type: [(v) => validators.required(v, 'نوع سرویس')],
      }
    );

    if (!validation.valid) {
      errors = validation.errors;
      return;
    }

    errors = [];
    isSubmitting = true;

    try {
      const created = await serviceService.create(serviceForm);
      servicesStore.addService(created);
      
      // Update vehicle km if service km is higher
      const vehicle = $vehiclesStore.vehicles.find(v => v.id === serviceForm.vehicleId);
      if (vehicle && serviceForm.km > vehicle.currentKm) {
        await vehicleService.updateKm(vehicle.id, serviceForm.km);
        vehiclesStore.updateKilometers(vehicle.id, serviceForm.km);
      }
      
      toastStore.success('سرویس با موفقیت ثبت شد');
      push('/dashboard');
    } catch {
      toastStore.error('خطا در ثبت سرویس');
    } finally {
      isSubmitting = false;
    }
  }

  async function submitExpense(e: Event) {
    e.preventDefault();
    
    const validation = validateForm(
      expenseForm,
      {
        vehicleId: [(v) => validators.required(v, 'خودرو')],
        date: [(v) => validators.required(v, 'تاریخ')],
        amount: [(v) => validators.required(v, 'مبلغ'), validators.amount],
        category: [(v) => validators.required(v, 'دسته‌بندی')],
      }
    );

    if (!validation.valid) {
      errors = validation.errors;
      return;
    }

    errors = [];
    isSubmitting = true;

    try {
      const created = await expenseService.create(expenseForm);
      expensesStore.addExpense(created);
      
      // Update vehicle km if expense has km and it's higher
      if (expenseForm.km) {
        const vehicle = $vehiclesStore.vehicles.find(v => v.id === expenseForm.vehicleId);
        if (vehicle && expenseForm.km > vehicle.currentKm) {
          await vehicleService.updateKm(vehicle.id, expenseForm.km);
          vehiclesStore.updateKilometers(vehicle.id, expenseForm.km);
        }
      }
      
      toastStore.success('هزینه با موفقیت ثبت شد');
      push('/dashboard');
    } catch {
      toastStore.error('خطا در ثبت هزینه');
    } finally {
      isSubmitting = false;
    }
  }

  function handleTabChange(e: CustomEvent<{ id: string }>) {
    errors = [];
  }
</script>

<Layout headerTitle="ثبت جدید" showBack={true}>
  <div class="page">
    <Card variant="solid" padding="lg">
      <Tabs {tabs} bind:activeTab on:change={handleTabChange} />

      {#if vehicleOptions.length === 0 && !isLoading}
        <div class="no-vehicles">
          <p>ابتدا یک خودرو اضافه کنید</p>
          <Button variant="primary" onclick={() => push('/vehicles')}>
            افزودن خودرو
          </Button>
        </div>
      {:else if activeTab === 'service'}
        <form class="form" onsubmit={submitService}>
          <Select
            name="vehicleId"
            label="خودرو"
            options={vehicleOptions}
            bind:value={serviceForm.vehicleId}
            error={getFieldError(errors, 'vehicleId')}
            required
          />

          <Input
            name="date"
            label="تاریخ (شمسی)"
            placeholder="۱۴۰۳/۰۹/۱۵"
            bind:value={serviceForm.date}
            error={getFieldError(errors, 'date')}
            required
          />

          <Input
            type="number"
            name="km"
            label="کیلومتر در زمان سرویس"
            placeholder="مثال: ۸۵۰۰۰"
            bind:value={serviceForm.km}
            error={getFieldError(errors, 'km')}
            min={0}
            required
          />

          <Input
            type="number"
            name="cost"
            label="هزینه (ریال)"
            placeholder="مثال: ۱۵۰۰۰۰۰"
            bind:value={serviceForm.cost}
            error={getFieldError(errors, 'cost')}
            min={0}
            required
          />

          <Select
            name="type"
            label="نوع سرویس"
            options={SERVICE_TYPE_OPTIONS}
            bind:value={serviceForm.type}
            error={getFieldError(errors, 'type')}
            required
          />

          <Input
            name="note"
            label="یادداشت (اختیاری)"
            placeholder="توضیحات بیشتر..."
            bind:value={serviceForm.note}
          />

          <div class="form-actions">
            <Button type="button" variant="secondary" onclick={() => window.history.back()}>
              انصراف
            </Button>
            <Button type="submit" variant="primary" loading={isSubmitting}>
              ثبت سرویس
            </Button>
          </div>
        </form>
      {:else}
        <form class="form" onsubmit={submitExpense}>
          <Select
            name="vehicleId"
            label="خودرو"
            options={vehicleOptions}
            bind:value={expenseForm.vehicleId}
            error={getFieldError(errors, 'vehicleId')}
            required
          />

          <Input
            name="date"
            label="تاریخ (شمسی)"
            placeholder="۱۴۰۳/۰۹/۱۵"
            bind:value={expenseForm.date}
            error={getFieldError(errors, 'date')}
            required
          />

          <Input
            type="number"
            name="amount"
            label="مبلغ (ریال)"
            placeholder="مثال: ۳۵۰۰۰۰"
            bind:value={expenseForm.amount}
            error={getFieldError(errors, 'amount')}
            min={0}
            required
          />

          <Select
            name="category"
            label="دسته‌بندی"
            options={EXPENSE_CATEGORY_OPTIONS}
            bind:value={expenseForm.category}
            error={getFieldError(errors, 'category')}
            required
          />

          <Input
            type="number"
            name="km"
            label="کیلومتر (اختیاری)"
            placeholder="کیلومتر در زمان هزینه"
            bind:value={expenseForm.km}
            min={0}
          />

          <Input
            name="note"
            label="یادداشت (اختیاری)"
            placeholder="توضیحات بیشتر..."
            bind:value={expenseForm.note}
          />

          <div class="form-actions">
            <Button type="button" variant="secondary" onclick={() => window.history.back()}>
              انصراف
            </Button>
            <Button type="submit" variant="primary" loading={isSubmitting}>
              ثبت هزینه
            </Button>
          </div>
        </form>
      {/if}
    </Card>
  </div>
</Layout>

<style>
  .page {
    padding: 1rem;
    padding-bottom: calc(70px + 1rem);
  }

  @media (min-width: 768px) {
    .page {
      padding: 1.5rem;
      padding-bottom: 1.5rem;
      max-width: 600px;
      margin: 0 auto;
    }
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .form-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
    margin-top: 0.5rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
  }

  .no-vehicles {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 2rem;
    text-align: center;
    color: var(--color-text-light);
  }
</style>
