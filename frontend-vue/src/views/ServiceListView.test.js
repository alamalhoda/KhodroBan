/**
 * Unit tests for ServiceListView
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import ServiceListView from './ServiceListView.vue'
import Button from '../components/ui/Button.vue'
import Modal from '../components/ui/Modal.vue'

const mockPush = vi.fn()
const mockReplace = vi.fn()
const mockBack = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace, back: mockBack }),
  useRoute: () => ({ query: {} })
}))

vi.mock('vue-i18n', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useI18n: () => ({ t: (key) => key })
  }
})

const mockToastError = vi.fn()
const mockToastSuccess = vi.fn()
vi.mock('../composables/useToast', () => ({
  useToast: () => ({ error: mockToastError, success: mockToastSuccess })
}))

const mockGetAll = vi.fn()
vi.mock('@services/serviceService', () => ({
  serviceService: {
    getAll: (...args) => mockGetAll(...args),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
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

describe('ServiceListView', () => {
  const defaultGlobal = {
    stubs: {
      MainLayout: { template: '<div><slot /></div>' }
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockPush.mockClear()
    mockReplace.mockClear()
    mockBack.mockClear()
    setActivePinia(createPinia())
    mockGetAll.mockResolvedValue([])
  })

  it('renders title and subtitle', async () => {
    const wrapper = mount(ServiceListView, { global: defaultGlobal })
    await flushPromises()
    expect(wrapper.text()).toContain('services.serviceList')
    expect(wrapper.text()).toContain('services.selectDetails.subtitle')
  })

  it('shows empty state when no services', async () => {
    const wrapper = mount(ServiceListView, { global: defaultGlobal })
    await flushPromises()
    expect(wrapper.text()).toContain('services.noServices')
    const addButton = wrapper.findAll('button').find(b => b.text().includes('services.addService'))
    expect(addButton).toBeDefined()
  })

  it('calls router.push when add service button is clicked', async () => {
    const wrapper = mount(ServiceListView, { global: defaultGlobal })
    await flushPromises()
    const headerAddBtn = wrapper.find('header').findAll('button').find(b => b.text().includes('services.addService'))
    if (headerAddBtn) {
      await headerAddBtn.trigger('click')
      expect(mockPush).toHaveBeenCalledWith({ name: 'add-service' })
    } else {
      const emptyAddBtn = wrapper.findAll('button').find(b => b.text().includes('services.addService'))
      await emptyAddBtn.trigger('click')
      expect(mockPush).toHaveBeenCalled()
    }
  })

  it('calls router.back when back button is clicked', async () => {
    const wrapper = mount(ServiceListView, { global: defaultGlobal })
    await flushPromises()
    const backButton = wrapper.findAll('button').find(b => b.text().includes('services.selectDetails.back'))
    await backButton.trigger('click')
    expect(mockBack).toHaveBeenCalled()
  })

  it('shows table when services exist', async () => {
    mockGetAll.mockResolvedValue([
      { id: 1, vehicleId: 'v1', date: '2024-01-15', type: 'oil_change', km: 50000, cost: 500000, note: 'تعویض روغن' }
    ])
    const wrapper = mount(ServiceListView, { global: defaultGlobal })
    await flushPromises()
    expect(wrapper.find('table').exists()).toBe(true)
    expect(wrapper.find('tbody').findAll('tr').length).toBeGreaterThanOrEqual(1)
  })

  it('handleEdit pushes to add-service with edit query', async () => {
    const service = { id: 99, vehicleId: 'v1', date: '2024-01-15', type: 'oil_change', km: 50000, cost: 500000 }
    mockGetAll.mockResolvedValue([service])
    const wrapper = mount(ServiceListView, { global: defaultGlobal })
    await flushPromises()
    const editButtons = wrapper.findAllComponents(Button).filter(b => b.props('icon') === 'edit')
    await editButtons[0].trigger('click')
    expect(mockPush).toHaveBeenCalledWith({ name: 'add-service', query: { edit: 99 } })
  })

  it('handleDelete opens delete modal', async () => {
    const service = { id: 1, vehicleId: 'v1', date: '2024-01-15', type: 'oil_change', km: 50000, cost: 500000 }
    mockGetAll.mockResolvedValue([service])
    const wrapper = mount(ServiceListView, { global: defaultGlobal })
    await flushPromises()
    const deleteButtons = wrapper.findAllComponents(Button).filter(b => b.props('icon') === 'delete')
    await deleteButtons[0].trigger('click')
    await wrapper.vm.$nextTick()
    const modal = wrapper.findComponent(Modal)
    expect(modal.exists()).toBe(true)
    expect(modal.props('open')).toBe(true)
  })
})
