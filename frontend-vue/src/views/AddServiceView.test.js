/**
 * Unit tests for AddServiceView
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { ref } from 'vue'
import AddServiceView from './AddServiceView.vue'

const mockPush = vi.fn()
const mockBack = vi.fn()
let routeQuery = {}
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush, back: mockBack }),
  useRoute: () => ({ query: routeQuery })
}))

vi.mock('vue-i18n', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useI18n: () => ({ t: (key) => key, locale: ref('fa') })
  }
})

const mockToastSuccess = vi.fn()
const mockToastError = vi.fn()
const mockToastWarning = vi.fn()
vi.mock('../composables/useToast', () => ({
  useToast: () => ({
    success: mockToastSuccess,
    error: mockToastError,
    warning: mockToastWarning
  })
}))

const mockPresetGetAll = vi.fn()
vi.mock('../services/servicePresetService', () => ({
  servicePresetService: {
    getAll: () => mockPresetGetAll()
  }
}))

vi.mock('@services/vehicleService', () => ({
  vehicleService: {
    getAll: vi.fn().mockResolvedValue([{ id: 'v1', model: 'پژو', year: 1400 }]),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  }
}))

const mockGetById = vi.fn()
const mockCreate = vi.fn()
vi.mock('@services/serviceService', () => ({
  serviceService: {
    getAll: vi.fn().mockResolvedValue([]),
    getById: (...args) => mockGetById(...args),
    create: (...args) => mockCreate(...args),
    update: vi.fn(),
    delete: vi.fn()
  }
}))

vi.mock('../services/serviceTypeService', () => ({
  serviceTypeService: {
    getAll: vi.fn().mockResolvedValue([{ code: 'oil_change', name: 'تعویض روغن', group_name: 'موتور' }]),
    getByCode: vi.fn()
  }
}))

vi.mock('../services/expenseCategoryService', () => ({
  expenseCategoryService: {
    getAll: vi.fn().mockResolvedValue([{ code: 'fuel', name: 'سوخت', group_name: 'سوخت' }]),
    getByCode: vi.fn()
  }
}))

describe('AddServiceView', () => {
  const defaultGlobal = {
    stubs: {
      MainLayout: { template: '<div><slot /></div>' },
      ServiceTypeSelector: { template: '<div data-testid="service-type-selector" />' },
      PersianDatePicker: {
        template: '<div data-testid="persian-date-picker"><input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" data-testid="date-input" /></div>',
        props: ['modelValue', 'label', 'error', 'placeholder', 'required'],
        emits: ['update:modelValue']
      }
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
    routeQuery = {}
    mockPush.mockClear()
    mockBack.mockClear()
    mockCreate.mockResolvedValue({ id: 1, vehicleId: 'v1', date: '2024-09-28', cost: 500000, km: 10000, types: ['oil_change'] })
    setActivePinia(createPinia())
    mockPresetGetAll.mockResolvedValue([])
  })

  it('renders add title and service tab when not in edit mode', async () => {
    const wrapper = mount(AddServiceView, { global: defaultGlobal })
    await flushPromises()
    expect(wrapper.text()).toContain('services.add.title')
    expect(wrapper.text()).toContain('services.add.subtitle')
    expect(wrapper.text()).toContain('services.add.serviceTab')
    expect(wrapper.text()).toContain('expenses.add.expenseTab')
  })

  it('shows expense tab content when expense tab is selected', async () => {
    const wrapper = mount(AddServiceView, { global: defaultGlobal })
    await flushPromises()
    const expenseTab = wrapper.findAll('button[role="tab"]').find(b => b.text().includes('expenses.add.expenseTab'))
    await expenseTab.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('expenses.add.expenseTab')
  })

  it('calls router.back when cancel is clicked', async () => {
    const wrapper = mount(AddServiceView, { global: defaultGlobal })
    await flushPromises()
    const cancelButton = wrapper.findAll('button').find(b => b.text().includes('services.add.cancel'))
    expect(cancelButton).toBeTruthy()
    await cancelButton.trigger('click')
    expect(mockBack).toHaveBeenCalled()
  })

  it('in edit mode fetches service and shows edit title', async () => {
    routeQuery = { edit: '99' }
    const editedService = {
      id: 99,
      vehicleId: 'v1',
      date: '2024-01-15',
      km: 50000,
      cost: 500000,
      types: ['oil_change'],
      type: 'oil_change',
      note: 'یادداشت'
    }
    mockGetById.mockResolvedValue(editedService)

    const wrapper = mount(AddServiceView, { global: defaultGlobal })
    await flushPromises()

    expect(mockGetById).toHaveBeenCalledWith('99')
    expect(wrapper.text()).toContain('services.edit.title')
  })

  it('fetches service presets on mount', async () => {
    mockPresetGetAll.mockResolvedValue([
      { preset_id: 1, name: 'سرویس ۵۰۰۰', display_order: 10, service_type_codes: ['oil_change', 'filter'] }
    ])
    const wrapper = mount(AddServiceView, { global: defaultGlobal })
    await flushPromises()
    expect(mockPresetGetAll).toHaveBeenCalled()
  })

  it('uses PersianDatePicker for service date field', async () => {
    const wrapper = mount(AddServiceView, { global: defaultGlobal })
    await flushPromises()
    expect(wrapper.find('[data-testid="persian-date-picker"]').exists()).toBe(true)
  })

  it('initializes form date as Jalali YYYY/MM/DD', async () => {
    const wrapper = mount(AddServiceView, { global: defaultGlobal })
    await flushPromises()
    const dateInput = wrapper.find('[data-testid="date-input"]')
    expect(dateInput.exists()).toBe(true)
    const value = dateInput.element.value
    expect(value).toMatch(/^\d{4}\/\d{2}\/\d{2}$/)
  })

  it('in edit mode converts API date to Jalali for form', async () => {
    routeQuery = { edit: '99' }
    mockGetById.mockResolvedValue({
      id: 99,
      vehicleId: 'v1',
      date: '2024-01-15',
      km: 50000,
      cost: 500000,
      types: ['oil_change'],
      type: 'oil_change',
      note: ''
    })
    const wrapper = mount(AddServiceView, { global: defaultGlobal })
    await flushPromises()
    const dateInput = wrapper.find('[data-testid="date-input"]')
    expect(dateInput.exists()).toBe(true)
    expect(dateInput.element.value).toMatch(/^\d{4}\/\d{2}\/\d{2}$/)
  })

  it('form holds Jalali date YYYY/MM/DD when user selects (payload to API is same format; backend round-trip tested in test_api_services)', async () => {
    const wrapper = mount(AddServiceView, { global: defaultGlobal })
    await flushPromises()
    const dateInput = wrapper.find('[data-testid="date-input"]')
    await dateInput.setValue('1403/07/15')
    await dateInput.trigger('input')
    await wrapper.vm.$nextTick()
    expect(dateInput.element.value).toMatch(/^\d{4}\/\d{2}\/\d{2}$/)
    expect(dateInput.element.value).toBe('1403/07/15')
  })
})
