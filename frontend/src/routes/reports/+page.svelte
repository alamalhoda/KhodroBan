<script lang="ts">
  import { onMount } from 'svelte';
  import { Layout } from '$lib/components/layout';
  import { Card, Button, Select, Spinner, EmptyState, Badge } from '$lib/components/ui';
  import { vehiclesStore, isPro, toastStore } from '$lib/stores';
  import { vehicleService, reportService } from '$lib/services';
  import { formatNumber, formatCurrency, toPersianDigits } from '$lib/utils/format';
  import { EXPENSE_CATEGORIES, SERVICE_TYPES, EXPENSE_ICONS } from '$lib/utils/constants';
  import type { ReportSummary, ReportFilter, SelectOption } from '$lib/types';

  let isLoading = $state(true);
  let isExporting = $state(false);
  let summary = $state<ReportSummary | null>(null);
  let vehicleOptions = $state<SelectOption[]>([]);
  
  let filter = $state<ReportFilter>({
    vehicleId: '',
    type: 'all',
  });

  const typeOptions: SelectOption[] = [
    { value: 'all', label: 'همه' },
    { value: 'service', label: 'سرویس‌ها' },
    { value: 'expense', label: 'هزینه‌ها' },
  ];

  onMount(async () => {
    await loadData();
  });

  async function loadData() {
    isLoading = true;
    try {
      // Load vehicles if not already loaded
      let vehicles = $vehiclesStore.vehicles;
      if (vehicles.length === 0) {
        vehicles = await vehicleService.getAll();
        vehiclesStore.setVehicles(vehicles);
      }
      
      vehicleOptions = [
        { value: '', label: 'همه خودروها' },
        ...vehicles.map(v => ({
          value: v.id,
          label: `${v.model} (${v.plateNumber})`,
        })),
      ];

      // Load summary
      await loadSummary();
    } catch {
      toastStore.error('خطا در بارگذاری گزارش‌ها');
    } finally {
      isLoading = false;
    }
  }

  async function loadSummary() {
    try {
      summary = await reportService.getSummary(filter.vehicleId ? filter : undefined);
    } catch {
      toastStore.error('خطا در بارگذاری گزارش');
    }
  }

  function handleFilterChange() {
    loadSummary();
  }

  async function exportCSV() {
    isExporting = true;
    try {
      const blob = await reportService.exportCSV(filter.vehicleId ? filter : undefined);
      reportService.downloadFile(blob, `khodroban-report-${Date.now()}.csv`);
      toastStore.success('فایل CSV با موفقیت دانلود شد');
    } catch {
      toastStore.error('خطا در خروجی گرفتن');
    } finally {
      isExporting = false;
    }
  }

  async function exportPDF() {
    if (!$isPro) {
      toastStore.warning('خروجی PDF فقط برای کاربران Pro در دسترس است');
      return;
    }
    
    isExporting = true;
    try {
      const blob = await reportService.exportPDF(filter.vehicleId ? filter : undefined);
      reportService.downloadFile(blob, `khodroban-report-${Date.now()}.pdf`);
      toastStore.success('فایل PDF با موفقیت دانلود شد');
    } catch {
      toastStore.error('خطا در خروجی گرفتن');
    } finally {
      isExporting = false;
    }
  }

  function getCategoryLabel(key: string): string {
    if (key.startsWith('service_')) {
      const type = key.replace('service_', '') as keyof typeof SERVICE_TYPES;
      return `سرویس: ${SERVICE_TYPES[type] || type}`;
    }
    return EXPENSE_CATEGORIES[key as keyof typeof EXPENSE_CATEGORIES] || key;
  }

  function getCategoryIcon(key: string): string {
    if (key.startsWith('service_')) return '🔧';
    return EXPENSE_ICONS[key as keyof typeof EXPENSE_ICONS] || '📋';
  }
</script>

<Layout headerTitle="گزارش‌ها">
  <div class="page-container">
    <!-- Filters -->
    <Card variant="solid" padding="md" class="filters-card">
      <div class="filters">
        <Select
          name="vehicle"
          label="خودرو"
          options={vehicleOptions}
          bind:value={filter.vehicleId}
          onchange={handleFilterChange}
        />
      </div>
    </Card>

    {#if isLoading}
      <div class="loading-container">
        <Spinner size="lg" />
        <p>در حال بارگذاری گزارش...</p>
      </div>
    {:else if !summary}
      <Card>
        <EmptyState
          icon="📊"
          title="گزارشی وجود ندارد"
          description="ابتدا سرویس یا هزینه‌ای ثبت کنید"
        />
      </Card>
    {:else}
      <!-- Summary Cards -->
      <div class="summary-grid">
        <Card variant="solid" padding="md" class="summary-card total">
          <span class="summary-icon">💰</span>
          <span class="summary-value">{formatCurrency(summary.totalCost, 'toman')}</span>
          <span class="summary-label">مجموع هزینه‌ها</span>
        </Card>

        <Card variant="solid" padding="md" class="summary-card">
          <span class="summary-icon">🔧</span>
          <span class="summary-value">{formatCurrency(summary.totalServiceCost, 'toman')}</span>
          <span class="summary-label">هزینه سرویس</span>
          <Badge variant="primary">{toPersianDigits(summary.serviceCount)} مورد</Badge>
        </Card>

        <Card variant="solid" padding="md" class="summary-card">
          <span class="summary-icon">🧾</span>
          <span class="summary-value">{formatCurrency(summary.totalExpenses, 'toman')}</span>
          <span class="summary-label">سایر هزینه‌ها</span>
          <Badge variant="default">{toPersianDigits(summary.expenseCount)} مورد</Badge>
        </Card>
      </div>

      <!-- Cost by Category -->
      <Card variant="solid" padding="md" title="هزینه به تفکیک دسته‌بندی">
        <div class="category-list">
          {#each Object.entries(summary.costByCategory) as [category, amount]}
            <div class="category-item">
              <div class="category-info">
                <span class="category-icon">{getCategoryIcon(category)}</span>
                <span class="category-name">{getCategoryLabel(category)}</span>
              </div>
              <span class="category-amount">{formatCurrency(amount, 'toman')}</span>
            </div>
          {/each}
        </div>
      </Card>

      <!-- Monthly Trend -->
      <Card variant="solid" padding="md" title="روند ماهانه">
        <div class="trend-list">
          {#each summary.costByMonth as item}
            <div class="trend-item">
              <span class="trend-month">{item.month}</span>
              <div class="trend-bar-container">
                <div 
                  class="trend-bar" 
                  style="width: {Math.min(100, (item.amount / Math.max(...summary.costByMonth.map(i => i.amount))) * 100)}%"
                ></div>
              </div>
              <span class="trend-amount">{formatCurrency(item.amount, 'toman')}</span>
            </div>
          {/each}
        </div>
      </Card>

      <!-- Export Section -->
      <Card variant="solid" padding="md" title="خروجی گرفتن">
        <div class="export-actions">
          <Button variant="secondary" onclick={exportCSV} loading={isExporting}>
            📄 دانلود CSV
          </Button>
          <Button 
            variant={$isPro ? 'secondary' : 'ghost'} 
            onclick={exportPDF} 
            loading={isExporting}
            disabled={!$isPro}
          >
            📑 دانلود PDF
            {#if !$isPro}
              <Badge variant="warning" size="sm">Pro</Badge>
            {/if}
          </Button>
        </div>
      </Card>
    {/if}
  </div>
</Layout>

<style>
  /* Reports page specific styles */

  :global(.filters-card) {
    margin-bottom: var(--space-lg);
  }

  .filters {
    display: grid;
    gap: var(--space-lg);
  }

  @media (min-width: 768px) {
    .filters {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  /* Summary Grid */
  .summary-grid {
    display: grid;
    gap: var(--space-sm);
    margin-bottom: var(--space-lg);
  }

  @media (min-width: 768px) {
    .summary-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  :global(.summary-card) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    text-align: center;
  }

  :global(.summary-card.total) {
    background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light)) !important;
    color: white !important;
  }

  .summary-icon {
    font-size: 2rem;
  }

  .summary-value {
    font-size: 1.125rem;
    font-weight: 700;
  }

  .summary-label {
    font-size: 0.8125rem;
    opacity: 0.8;
  }

  /* Category List */
  .category-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .category-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem;
    background: rgba(0, 0, 0, 0.02);
    border-radius: 10px;
  }

  .category-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .category-icon {
    font-size: 1.25rem;
  }

  .category-name {
    font-size: 0.9375rem;
  }

  .category-amount {
    font-weight: 600;
    font-size: 0.9375rem;
  }

  /* Trend List */
  .trend-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .trend-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .trend-month {
    min-width: 70px;
    font-size: 0.875rem;
    color: var(--color-text-light);
  }

  .trend-bar-container {
    flex: 1;
    height: 8px;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    overflow: hidden;
  }

  .trend-bar {
    height: 100%;
    background: linear-gradient(90deg, var(--color-primary), var(--color-primary-light));
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .trend-amount {
    min-width: 100px;
    text-align: left;
    font-size: 0.875rem;
    font-weight: 500;
  }

  /* Export Actions */
  .export-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  :global(.card) {
    margin-bottom: 1rem;
  }
</style>

