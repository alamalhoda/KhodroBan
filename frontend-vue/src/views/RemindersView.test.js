/**
 * Unit tests for RemindersView
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { ref, reactive } from 'vue'
import RemindersView from './RemindersView.vue'

const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
  useRoute: () => ({})
}))

vi.mock('vue-i18n', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useI18n: () => ({ t: (key) => key, locale: ref('fa') })
  }
})

const mockError = vi.fn()
const mockSuccess = vi.fn()
vi.mock('../stores/ui', () => ({
  useUIStore: () => ({ error: mockError, success: mockSuccess })
}))

const storeState = reactive({
  reminders: [],
  isLoading: false,
  error: null,
  fetchReminders: vi.fn(),
  clearError: vi.fn(),
  deleteReminder: vi.fn(),
  markCompleted: vi.fn()
})
vi.mock('../stores/reminder', () => ({
  useReminderStore: () => storeState
}))

const vehicles = ref([{ id: 'v1', model: 'پژو', year: 1400 }])
const fetchVehicles = vi.fn().mockResolvedValue([])
vi.mock('../stores/vehicle', () => ({
  useVehicleStore: () => ({
    vehicles,
    fetchVehicles
  })
}))

vi.mock('../composables/useFormatDate', () => ({
  useFormatDate: () => (dateStr) => dateStr || '-'
}))

describe('RemindersView', () => {
  const defaultGlobal = {
    stubs: {
      MainLayout: { template: '<div><slot /></div>' },
      VehicleFilterSelect: { template: '<div data-testid="vehicle-filter" />', props: ['modelValue', 'showAllOption'] },
      Card: { template: '<div class="card"><slot /></div>' },
      Modal: { template: '<div class="modal"><slot /></div>' },
      Button: { template: '<button><slot /></button>' },
      LoadingSpinner: { template: '<div data-testid="spinner" />' }
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
    storeState.reminders = []
    storeState.isLoading = false
    storeState.error = null
    storeState.fetchReminders.mockResolvedValue([])
    setActivePinia(createPinia())
  })

  it('renders and fetches reminders and vehicles on mount', async () => {
    const wrapper = mount(RemindersView, { global: defaultGlobal })
    await flushPromises()
    expect(storeState.fetchReminders).toHaveBeenCalled()
    expect(wrapper.text()).toContain('reminders.allReminders')
  })

  it('shows empty state when no reminders', async () => {
    const wrapper = mount(RemindersView, { global: defaultGlobal })
    await flushPromises()
    expect(wrapper.text()).toContain('reminders.empty')
    expect(wrapper.text()).toContain('reminders.addReminder')
  })

  it('shows loading state when loading and no data', async () => {
    storeState.isLoading = true
    const wrapper = mount(RemindersView, { global: defaultGlobal })
    await flushPromises()
    expect(wrapper.find('[data-testid="spinner"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('reminders.loading')
  })

  it('shows error state with retry button when store has error', async () => {
    storeState.error = 'خطای شبکه'
    const wrapper = mount(RemindersView, { global: defaultGlobal })
    await flushPromises()
    expect(wrapper.text()).toContain('خطای شبکه')
    expect(wrapper.text()).toContain('reminders.retry')
    const retryBtn = wrapper.findAll('button').find(b => b.text().includes('reminders.retry'))
    expect(retryBtn).toBeDefined()
    await retryBtn.trigger('click')
    expect(storeState.clearError).toHaveBeenCalled()
    expect(storeState.fetchReminders).toHaveBeenCalled()
  })

  it('navigates to add reminder on add button click', async () => {
    const wrapper = mount(RemindersView, { global: defaultGlobal })
    await flushPromises()
    const addBtn = wrapper.findAll('button').find(b => b.text().includes('reminders.addReminder'))
    await addBtn.trigger('click')
    expect(mockPush).toHaveBeenCalledWith(expect.objectContaining({ name: 'reminder-management', query: { action: 'add' } }))
  })

  it('shows reminder cards when reminders exist', async () => {
    storeState.reminders = [
      { id: 'r1', title: 'تعویض روغن', vehicleId: 'v1', vehicleName: 'پژو', status: 'ok', dismissed: false, dueDate: '2025-06-01' }
    ]
    const wrapper = mount(RemindersView, { global: defaultGlobal })
    await flushPromises()
    expect(wrapper.findAll('.card').length).toBeGreaterThanOrEqual(1)
    expect(wrapper.text()).toContain('تعویض روغن')
  })
})
