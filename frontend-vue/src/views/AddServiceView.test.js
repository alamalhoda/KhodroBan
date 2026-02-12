/**
 * Unit tests for AddServiceView
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
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
    useI18n: () => ({ t: (key) => key })
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
vi.mock('@services/serviceService', () => ({
  serviceService: {
    getAll: vi.fn().mockResolvedValue([]),
    getById: (...args) => mockGetById(...args),
    create: vi.fn(),
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
      ServiceTypeSelector: { template: '<div data-testid="service-type-selector" />' }
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
    routeQuery = {}
    mockPush.mockClear()
    mockBack.mockClear()
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
    const cancelButton = wrapper.findAll('button').find(b => b.text().includes('common.cancel'))
    if (cancelButton) {
      await cancelButton.trigger('click')
      expect(mockBack).toHaveBeenCalled()
    }
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
})
