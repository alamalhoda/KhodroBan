import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { reactive } from 'vue'

const mockInitialize = vi.fn()
const mockSetCurrentSession = vi.fn()
const mockStartNewSession = vi.fn()
const mockSendMessage = vi.fn()
const mockSelectVehicle = vi.fn()

const aiState = reactive({
  sessions: [],
  currentSession: null,
  currentSessionId: null,
  messages: [],
  isLoading: false,
  error: null,
  initialize: (...args) => mockInitialize(...args),
  setCurrentSession: (...args) => mockSetCurrentSession(...args),
  startNewSession: (...args) => mockStartNewSession(...args),
  sendMessage: (...args) => mockSendMessage(...args),
})

const authState = reactive({
  user: { name: 'کاربر تست' },
})

const vehicleState = reactive({
  selectedVehicle: null,
  vehicles: [],
  selectVehicle: (...args) => mockSelectVehicle(...args),
})

vi.mock('vue-i18n', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useI18n: () => ({
      t: (key, params) => (params ? `${key}:${JSON.stringify(params)}` : key),
    }),
  }
})

vi.mock('../stores/ai', () => ({
  useAIStore: () => aiState,
}))

vi.mock('../stores/auth', () => ({
  useAuthStore: () => authState,
}))

vi.mock('../stores/vehicle', () => ({
  useVehicleStore: () => vehicleState,
}))

const defaultGlobal = {
  stubs: {
    MainLayout: { template: '<div><slot /></div>' },
    RouterLink: { template: '<a><slot /></a>', props: ['to'] },
    VehicleFilterSelect: {
      template: '<button data-testid="vehicle-filter" @click="$emit(\'update:model-value\', \'veh-1\')">vf</button>',
      emits: ['update:model-value'],
    },
  },
}

describe('SmartAssistantView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    aiState.sessions = []
    aiState.currentSession = null
    aiState.currentSessionId = null
    aiState.messages = []
    aiState.isLoading = false
    aiState.error = null
    authState.user = { name: 'کاربر تست' }
    vehicleState.selectedVehicle = null
    vehicleState.vehicles = [{ id: 'veh-1', model: 'پژو', year: 1401 }]

    mockInitialize.mockResolvedValue(undefined)
    mockSetCurrentSession.mockResolvedValue(undefined)
    mockStartNewSession.mockResolvedValue(undefined)
    mockSendMessage.mockResolvedValue(undefined)
  })

  it('shows empty state welcome and initializes store on mount', async () => {
    const { default: SmartAssistantView } = await import('./SmartAssistantView.vue')
    const wrapper = mount(SmartAssistantView, { global: defaultGlobal })
    await flushPromises()

    expect(mockInitialize).toHaveBeenCalled()
    expect(wrapper.text()).toContain('smartAssistant.agentName')
    expect(wrapper.text()).toContain('smartAssistant.welcome')
  })

  it('shows loading state while model is typing', async () => {
    aiState.isLoading = true
    const { default: SmartAssistantView } = await import('./SmartAssistantView.vue')
    const wrapper = mount(SmartAssistantView, { global: defaultGlobal })
    await flushPromises()

    expect(wrapper.text()).toContain('smartAssistant.loading')
  })

  it('sends message with selected vehicle id', async () => {
    vehicleState.selectedVehicle = { id: 'veh-1', model: 'پژو', year: 1401 }
    const runtimeText = `msg-${crypto.randomUUID().slice(0, 8)}`
    const { default: SmartAssistantView } = await import('./SmartAssistantView.vue')
    const wrapper = mount(SmartAssistantView, { global: defaultGlobal })
    await flushPromises()

    const input = wrapper.get('textarea[aria-label="متن پیام"]')
    await input.setValue(runtimeText)
    const sendButton = wrapper.get('button[aria-label="ارسال پیام"]')
    await sendButton.trigger('click')
    await flushPromises()

    expect(mockSendMessage).toHaveBeenCalledWith(runtimeText, 'veh-1')
  })

  it('renders model error message bubble', async () => {
    const runtimeError = `ai-error-${crypto.randomUUID().slice(0, 8)}`
    aiState.messages = [
      {
        id: 'm-1',
        role: 'model',
        text: runtimeError,
        isError: true,
        timestamp: new Date().toISOString(),
      },
    ]
    const { default: SmartAssistantView } = await import('./SmartAssistantView.vue')
    const wrapper = mount(SmartAssistantView, { global: defaultGlobal })
    await flushPromises()

    expect(wrapper.text()).toContain(runtimeError)
    expect(wrapper.find('.text-red-600').exists()).toBe(true)
  })

  it('shows empty history dropdown and starts a new chat', async () => {
    aiState.sessions = []
    const { default: SmartAssistantView } = await import('./SmartAssistantView.vue')
    const wrapper = mount(SmartAssistantView, { global: defaultGlobal })
    await flushPromises()

    const historyButton = wrapper.findAll('button').find((btn) => btn.text().includes('smartAssistant.chatHistory'))
    expect(historyButton).toBeTruthy()
    await historyButton.trigger('click')
    expect(wrapper.text()).toContain('smartAssistant.chatHistoryEmpty')

    const newChatButton = wrapper.findAll('button').find((btn) => btn.text().includes('smartAssistant.newChat'))
    expect(newChatButton).toBeTruthy()
    await newChatButton.trigger('click')
    expect(mockStartNewSession).toHaveBeenCalled()
  })
})
