/**
 * تست‌های صفحه داشبورد (DashboardView)
 * بعد از هر تغییر در داشبورد یا زیرکامپوننت‌ها، با npm run test:run از درستی رفتار اطمینان حاصل کنید.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import DashboardView from './DashboardView.vue'
import DashboardHeader from '../components/dashboard/DashboardHeader.vue'
import RemindersSection from '../components/dashboard/RemindersSection.vue'
import VehiclesSection from '../components/dashboard/VehiclesSection.vue'

const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush })
}))

vi.mock('vue-i18n', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useI18n: () => ({ t: (key) => key })
  }
})

const mockGetSummary = vi.fn()
vi.mock('../services/dashboardService', () => ({
  dashboardService: {
    getSummary: () => mockGetSummary()
  }
}))

describe('DashboardView', () => {
  const defaultGlobal = {
    stubs: {
      MainLayout: { template: '<div><slot /></div>' },
      RouterLink: { template: '<a><slot /></a>', props: ['to'] }
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockPush.mockClear()
    setActivePinia(createPinia())
    mockGetSummary.mockResolvedValue({
      vehicles: [],
      reminders: [],
      recentServices: [],
      upcomingReminders: [],
      thisMonthExpenses: 0,
      servicesThisMonth: 0,
      avgMonthlyExpense: 0,
      nextServiceDue: null
    })
  })

  it('renders loading state while fetchDashboardData is in progress', async () => {
    let resolvePromise
    mockGetSummary.mockImplementation(() => new Promise((r) => { resolvePromise = r }))
    const wrapper = mount(DashboardView, { global: defaultGlobal })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.min-h-\\[400px\\]').exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'LoadingSpinner' }).exists()).toBe(true)
    resolvePromise({ vehicles: [], reminders: [], recentServices: [] })
    await flushPromises()
  })

  it('renders error state when fetchDashboardData fails', async () => {
    mockGetSummary.mockRejectedValue(new Error('خطای شبکه'))
    const wrapper = mount(DashboardView, { global: defaultGlobal })
    await flushPromises()
    expect(wrapper.text()).toContain('common.error')
    expect(wrapper.text()).toContain('خطای شبکه')
    expect(wrapper.text()).toContain('dashboard.refresh')
  })

  it('calls fetchDashboardData on mount', async () => {
    mount(DashboardView, { global: defaultGlobal })
    await flushPromises()
    expect(mockGetSummary).toHaveBeenCalledTimes(1)
  })

  it('renders main content when data is loaded', async () => {
    const wrapper = mount(DashboardView, { global: defaultGlobal })
    await flushPromises()
    expect(wrapper.find('.grid').exists()).toBe(true)
    expect(wrapper.text()).toContain('۱۴۰۳')
    expect(wrapper.findComponent(DashboardHeader).exists()).toBe(true)
    expect(wrapper.findComponent(RemindersSection).exists()).toBe(true)
    expect(wrapper.findComponent(VehiclesSection).exists()).toBe(true)
  })

  it('passes correct props to DashboardHeader when user has firstName', async () => {
    const { useAuthStore } = await import('../stores/auth')
    const authStore = useAuthStore()
    authStore.user = { firstName: 'علی', name: 'علی محمدی' }
    const wrapper = mount(DashboardView, { global: defaultGlobal })
    await flushPromises()
    const header = wrapper.findComponent(DashboardHeader)
    expect(header.props('userName')).toBe('علی')
  })

  it('calls router.push when add-service is emitted from header', async () => {
    const wrapper = mount(DashboardView, { global: defaultGlobal })
    await flushPromises()
    const header = wrapper.findComponent(DashboardHeader)
    await header.vm.$emit('add-service')
    expect(mockPush).toHaveBeenCalledWith({ name: 'add-service' })
  })

  it('calls router.push when add-expense is emitted', async () => {
    const wrapper = mount(DashboardView, { global: defaultGlobal })
    await flushPromises()
    const header = wrapper.findComponent(DashboardHeader)
    await header.vm.$emit('add-expense')
    expect(mockPush).toHaveBeenCalledWith({ name: 'add-service', query: { tab: 'expense' } })
  })

  it('calls router.push when add-vehicle is emitted', async () => {
    const wrapper = mount(DashboardView, { global: defaultGlobal })
    await flushPromises()
    const header = wrapper.findComponent(DashboardHeader)
    await header.vm.$emit('add-vehicle')
    expect(mockPush).toHaveBeenCalledWith({ name: 'vehicle-management', query: { action: 'add' } })
  })

  it('calls router.push when view-vehicle is emitted from VehiclesSection', async () => {
    const wrapper = mount(DashboardView, { global: defaultGlobal })
    await flushPromises()
    const section = wrapper.findComponent(VehiclesSection)
    await section.vm.$emit('view-vehicle', 'vehicle-123')
    expect(mockPush).toHaveBeenCalledWith({ name: 'vehicle-details', params: { id: 'vehicle-123' } })
  })

  it('calls router.push when view-all is emitted from RemindersSection', async () => {
    const wrapper = mount(DashboardView, { global: defaultGlobal })
    await flushPromises()
    const section = wrapper.findComponent(RemindersSection)
    await section.vm.$emit('view-all')
    expect(mockPush).toHaveBeenCalledWith({ name: 'reminders' })
  })

  it('calls refreshDashboard when retry button is clicked in error state', async () => {
    mockGetSummary.mockRejectedValue(new Error('خطا'))
    const wrapper = mount(DashboardView, { global: defaultGlobal })
    await flushPromises()
    expect(mockGetSummary).toHaveBeenCalledTimes(1)
    const retryButton = wrapper.find('button')
    await retryButton.trigger('click')
    await flushPromises()
    expect(mockGetSummary).toHaveBeenCalledTimes(2)
  })

  it('uses userName from auth store (fallback to first part of name)', async () => {
    const { useAuthStore } = await import('../stores/auth')
    const authStore = useAuthStore()
    authStore.user = { name: 'رضا احمدی' }
    const wrapper = mount(DashboardView, { global: defaultGlobal })
    await flushPromises()
    const header = wrapper.findComponent(DashboardHeader)
    expect(header.props('userName')).toBe('رضا')
  })

  it('uses default userName when user is null', async () => {
    const { useAuthStore } = await import('../stores/auth')
    const authStore = useAuthStore()
    authStore.user = null
    const wrapper = mount(DashboardView, { global: defaultGlobal })
    await flushPromises()
    const header = wrapper.findComponent(DashboardHeader)
    expect(header.props('userName')).toBe('کاربر')
  })
})
