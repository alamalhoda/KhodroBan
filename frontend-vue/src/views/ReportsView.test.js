import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { reactive } from 'vue'

const mockFetchReportData = vi.fn()
const mockUpdateFilters = vi.fn()
const mockExportReport = vi.fn()
const mockFetchVehicles = vi.fn()
const mockGetServices = vi.fn()
const mockGetExpenses = vi.fn()

const reportState = reactive({
  reportData: {
    totalCost: 0,
    totalKm: 0,
    costByCategory: {},
    costByMonth: [],
  },
  filters: {
    vehicleId: null,
    dateRange: 'last30days',
    category: 'all',
  },
  isLoading: false,
  error: null,
  fetchReportData: (...args) => mockFetchReportData(...args),
  updateFilters: (...args) => mockUpdateFilters(...args),
  exportReport: (...args) => mockExportReport(...args),
})

const vehicleState = reactive({
  vehicles: [],
  fetchVehicles: (...args) => mockFetchVehicles(...args),
})

vi.mock('vue-i18n', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useI18n: () => ({ t: (key) => key }),
  }
})

vi.mock('../stores/report', () => ({
  useReportStore: () => reportState,
}))

vi.mock('../stores/vehicle', () => ({
  useVehicleStore: () => vehicleState,
}))

vi.mock('../composables/useFormatDate', () => ({
  useFormatDate: () => (value) => `f-${value}`,
}))

vi.mock('../services', () => ({
  serviceService: {
    getAll: (...args) => mockGetServices(...args),
  },
  expenseService: {
    getAll: (...args) => mockGetExpenses(...args),
  },
}))

const defaultGlobal = {
  stubs: {
    MainLayout: { template: '<div><slot /></div>' },
    VehicleFilterSelect: {
      template: `
        <button data-testid="vehicle-filter" @click="$emit('update:model-value', 'veh-1')">
          vehicle-filter
        </button>
      `,
      emits: ['update:model-value'],
    },
  },
}

describe('ReportsView', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    reportState.reportData = {
      totalCost: 1200000,
      totalKm: 60000,
      costByCategory: { fuel: 500000, service_oil_change: 700000 },
      costByMonth: [{ month: '1403/10', amount: 1200000 }],
    }
    reportState.filters = { vehicleId: null, dateRange: 'last30days', category: 'all' }
    reportState.isLoading = false
    reportState.error = null

    vehicleState.vehicles = [{ id: 'veh-1', model: 'پژو', plateNumber: '12ب345' }]
    mockFetchVehicles.mockResolvedValue(vehicleState.vehicles)
    mockFetchReportData.mockResolvedValue(reportState.reportData)
    mockGetServices.mockResolvedValue([
      { type: 'oil_change', date: '1403/10/01', cost: 700000, vehicleId: 'veh-1' },
    ])
    mockGetExpenses.mockResolvedValue([
      { category: 'fuel', date: '1403/10/02', amount: 500000, vehicleId: 'veh-1' },
    ])
  })

  it('renders loading state', async () => {
    reportState.isLoading = true
    const { default: ReportsView } = await import('./ReportsView.vue')
    const wrapper = mount(ReportsView, { global: defaultGlobal })
    await flushPromises()

    expect(wrapper.text()).toContain('در حال بارگذاری گزارش')
  })

  it('renders error state and retries fetch on click', async () => {
    reportState.error = `report-error-${crypto.randomUUID().slice(0, 8)}`
    const { default: ReportsView } = await import('./ReportsView.vue')
    const wrapper = mount(ReportsView, { global: defaultGlobal })
    await flushPromises()

    expect(wrapper.text()).toContain(reportState.error)
    const retryButton = wrapper.findAll('button').find((btn) => btn.text().includes('تلاش مجدد'))
    expect(retryButton).toBeTruthy()
    await retryButton.trigger('click')
    expect(mockFetchReportData).toHaveBeenCalled()
  })

  it('renders success state and loads recent merged rows', async () => {
    const { default: ReportsView } = await import('./ReportsView.vue')
    const wrapper = mount(ReportsView, { global: defaultGlobal })
    await flushPromises()

    expect(mockFetchReportData).toHaveBeenCalled()
    expect(mockGetServices).toHaveBeenCalled()
    expect(mockGetExpenses).toHaveBeenCalled()
    expect(wrapper.text()).toContain('کل هزینه‌ها')
    expect(wrapper.text()).toContain('نمایش 2 رکورد اخیر')
  })

  it('shows empty states for chart, category and table', async () => {
    reportState.reportData = {
      totalCost: 0,
      totalKm: 0,
      costByCategory: {},
      costByMonth: [],
    }
    mockGetServices.mockResolvedValue([])
    mockGetExpenses.mockResolvedValue([])
    const { default: ReportsView } = await import('./ReportsView.vue')
    const wrapper = mount(ReportsView, { global: defaultGlobal })
    await flushPromises()

    expect(wrapper.text()).toContain('داده‌ای وجود ندارد')
    expect(wrapper.text()).toContain('هزینه‌ای ثبت نشده است.')
  })

  it('triggers csv export from export button', async () => {
    const { default: ReportsView } = await import('./ReportsView.vue')
    const wrapper = mount(ReportsView, { global: defaultGlobal })
    await flushPromises()

    const exportButton = wrapper.findAll('button').find((btn) => btn.text().includes('دانلود CSV'))
    expect(exportButton).toBeTruthy()
    await exportButton.trigger('click')
    expect(mockExportReport).toHaveBeenCalledWith('csv')
  })
})
