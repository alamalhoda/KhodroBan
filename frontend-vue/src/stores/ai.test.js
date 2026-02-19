/**
 * Unit tests for AI store (with mocked aiAssistantService)
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

const mockListSessions = vi.fn()
const mockListMessages = vi.fn()
const mockCreateSession = vi.fn()
const mockSendMessage = vi.fn()
vi.mock('../services/aiAssistantService', () => ({
  aiAssistantService: {
    listSessions: (...args) => mockListSessions(...args),
    listMessages: (...args) => mockListMessages(...args),
    createSession: (...args) => mockCreateSession(...args),
    sendMessage: (...args) => mockSendMessage(...args)
  }
}))

describe('ai store', () => {
  beforeEach(async () => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    mockListSessions.mockResolvedValue([])
    mockListMessages.mockResolvedValue([])
    mockCreateSession.mockResolvedValue({ id: 1, title: 'گفتگوی جدید' })
  })

  it('has correct initial state', async () => {
    const { useAIStore } = await import('./ai')
    const store = useAIStore()
    expect(store.sessions).toEqual([])
    expect(store.currentSessionId).toBe(null)
    expect(store.messages).toEqual([])
    expect(store.isLoading).toBe(false)
    expect(store.error).toBe(null)
  })

  it('loadSessions populates sessions', async () => {
    const sessions = [{ id: 1, title: 'سشن ۱' }, { id: 2, title: 'سشن ۲' }]
    mockListSessions.mockResolvedValue(sessions)

    const { useAIStore } = await import('./ai')
    const store = useAIStore()
    await store.loadSessions()

    expect(store.sessions).toEqual(sessions)
    expect(store.currentSessionId).toBe(1)
  })

  it('loadSessions sets error on failure', async () => {
    mockListSessions.mockRejectedValue(new Error('network'))

    const { useAIStore } = await import('./ai')
    const store = useAIStore()
    await store.loadSessions()

    expect(store.sessions).toEqual([])
    expect(store.error).toBeTruthy()
  })

  it('ensureSession creates session when none exist', async () => {
    mockListSessions.mockResolvedValue([])
    mockCreateSession.mockResolvedValue({ id: 10, title: 'گفتگوی جدید' })

    const { useAIStore } = await import('./ai')
    const store = useAIStore()
    await store.ensureSession()

    expect(mockCreateSession).toHaveBeenCalledWith({ title: 'گفتگوی جدید' })
    expect(store.sessions).toHaveLength(1)
    expect(store.currentSessionId).toBe(10)
  })

  it('ensureSession skips create when sessions exist', async () => {
    mockListSessions.mockResolvedValue([{ id: 5 }])

    const { useAIStore } = await import('./ai')
    const store = useAIStore()
    await store.loadSessions()
    await store.ensureSession()

    expect(mockCreateSession).not.toHaveBeenCalled()
  })

  it('loadMessages maps messages to store shape', async () => {
    const raw = [
      { id: 1, role: 'user', content: 'سلام', provider: null, model: null, created_at: '2024-01-01' },
      { id: 2, role: 'assistant', content: 'پاسخ', provider: 'openai', model: 'gpt-4', created_at: '2024-01-01' }
    ]
    mockListMessages.mockResolvedValue(raw)

    const { useAIStore } = await import('./ai')
    const store = useAIStore()
    store.currentSessionId = 1
    await store.loadMessages(1)

    expect(mockListMessages).toHaveBeenCalledWith(1)
    expect(store.messages).toHaveLength(2)
    expect(store.messages[0]).toMatchObject({ role: 'user', text: 'سلام' })
    expect(store.messages[1]).toMatchObject({ role: 'model', text: 'پاسخ' })
    expect(store.messages[1].metadata).toMatchObject({ provider: 'openai', model: 'gpt-4' })
  })

  it('sendMessage adds user msg, calls api, adds model msg', async () => {
    mockListSessions.mockResolvedValue([{ id: 1 }])
    mockSendMessage.mockResolvedValue({
      content: 'پاسخ مدل',
      provider: 'openai',
      model: 'gpt-4',
      usage: {},
      latency_ms: 100
    })

    const { useAIStore } = await import('./ai')
    const store = useAIStore()
    await store.loadSessions()
    await store.ensureSession()
    const result = await store.sendMessage('سوال کاربر', 42)

    expect(store.messages).toHaveLength(2)
    expect(store.messages[0]).toMatchObject({ role: 'user', text: 'سوال کاربر' })
    expect(store.messages[1]).toMatchObject({ role: 'model', text: 'پاسخ مدل' })
    expect(mockSendMessage).toHaveBeenCalledWith(1, 'سوال کاربر', 42)
    expect(result).toMatchObject({ text: 'پاسخ مدل' })
  })

  it('sendMessage skips empty text', async () => {
    const { useAIStore } = await import('./ai')
    const store = useAIStore()
    store.currentSessionId = 1
    store.sessions = [{ id: 1 }]
    await store.sendMessage('   ')
    await store.sendMessage('')

    expect(mockSendMessage).not.toHaveBeenCalled()
  })

  it('sendMessage adds error entry on failure', async () => {
    mockListSessions.mockResolvedValue([{ id: 1 }])
    mockSendMessage.mockRejectedValue(new Error('خطای سرور'))

    const { useAIStore } = await import('./ai')
    const store = useAIStore()
    await store.loadSessions()
    await store.ensureSession()

    await expect(store.sendMessage('سوال')).rejects.toThrow('خطای سرور')
    const errEntry = store.messages.find((m) => m.isError)
    expect(errEntry).toBeDefined()
    expect(errEntry.role).toBe('model')
  })

  it('startNewSession creates and switches', async () => {
    mockCreateSession.mockResolvedValue({ id: 99, title: 'جدید' })

    const { useAIStore } = await import('./ai')
    const store = useAIStore()
    store.sessions = [{ id: 1 }]
    store.currentSessionId = 1
    store.messages = [{ id: 1, role: 'user', text: 'قدیم' }]

    await store.startNewSession()

    expect(store.currentSessionId).toBe(99)
    expect(store.sessions[0]).toEqual({ id: 99, title: 'جدید' })
    expect(store.messages).toEqual([])
  })

  it('clearHistory empties messages', async () => {
    const { useAIStore } = await import('./ai')
    const store = useAIStore()
    store.messages = [{ id: 1, text: 'x' }]
    store.error = 'err'
    store.clearHistory()

    expect(store.messages).toEqual([])
    expect(store.error).toBe(null)
  })
})
