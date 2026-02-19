/**
 * Contract tests for aiAssistantService (API_CONTRACT_REGISTRY).
 * Tests success/error envelope, field shapes, edge cases (401/404/400/500).
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockApiGet = vi.fn()
const mockApiPost = vi.fn()
vi.mock('@services/api', () => ({
  default: {
    get: (...args) => mockApiGet(...args),
    post: (...args) => mockApiPost(...args)
  }
}))

describe('aiAssistantService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('listSessions', () => {
    it('returns sessions array from success envelope', async () => {
      const sessions = [{ id: 1, title: 'گفتگو ۱', created_at: '2024-01-01', updated_at: '2024-01-02' }]
      mockApiGet.mockResolvedValue({ data: { success: true, data: sessions } })

      const { listSessions } = await import('./aiAssistantService')
      const result = await listSessions()

      expect(mockApiGet).toHaveBeenCalledWith('/ai/sessions/')
      expect(result).toEqual(sessions)
    })

    it('returns empty array when data is not array', async () => {
      mockApiGet.mockResolvedValue({ data: { data: null } })

      const { listSessions } = await import('./aiAssistantService')
      const result = await listSessions()

      expect(result).toEqual([])
    })
  })

  describe('createSession', () => {
    it('returns session from success envelope', async () => {
      const session = { id: 2, title: 'گفتگوی جدید', created_at: '2024-01-01', updated_at: '2024-01-01' }
      mockApiPost.mockResolvedValue({ data: { success: true, data: session } })

      const { createSession } = await import('./aiAssistantService')
      const result = await createSession({ title: 'گفتگوی جدید' })

      expect(mockApiPost).toHaveBeenCalledWith('/ai/sessions/', { title: 'گفتگوی جدید' })
      expect(result).toEqual(session)
    })
  })

  describe('listMessages', () => {
    it('returns messages array from success envelope', async () => {
      const messages = [
        { id: 1, role: 'user', content: 'سلام', provider: null, model: null, created_at: '2024-01-01' },
        { id: 2, role: 'assistant', content: 'پاسخ', provider: 'openai', model: 'gpt-4', created_at: '2024-01-01' }
      ]
      mockApiGet.mockResolvedValue({ data: { data: messages } })

      const { listMessages } = await import('./aiAssistantService')
      const result = await listMessages('session-1')

      expect(mockApiGet).toHaveBeenCalledWith('/ai/sessions/session-1/messages/')
      expect(result).toEqual(messages)
    })

    it('returns empty array when data is not array', async () => {
      mockApiGet.mockResolvedValue({ data: {} })

      const { listMessages } = await import('./aiAssistantService')
      const result = await listMessages('s1')

      expect(result).toEqual([])
    })
  })

  describe('sendMessage (contract: content, provider, model, usage, latency_ms)', () => {
    it('sends content and vehicle_id and returns contract fields', async () => {
      const payload = {
        content: 'متن پاسخ',
        provider: 'openai',
        model: 'gpt-4',
        usage: { prompt_tokens: 10, completion_tokens: 20 },
        latency_ms: 500
      }
      mockApiPost.mockResolvedValue({ data: { success: true, data: payload } })

      const { sendMessage } = await import('./aiAssistantService')
      const result = await sendMessage('session-1', 'سلام', 42)

      expect(mockApiPost).toHaveBeenCalledWith('/ai/sessions/session-1/messages/send/', {
        content: 'سلام',
        vehicle_id: 42
      })
      expect(result).toHaveProperty('content', payload.content)
      expect(result).toHaveProperty('provider', payload.provider)
      expect(result).toHaveProperty('model', payload.model)
      expect(result).toHaveProperty('usage', payload.usage)
      expect(result).toHaveProperty('latency_ms', payload.latency_ms)
    })

    it('sends content without vehicle_id when null', async () => {
      mockApiPost.mockResolvedValue({ data: { success: true, data: { content: 'ok' } } })

      const { sendMessage } = await import('./aiAssistantService')
      await sendMessage('s1', 'test', null)

      expect(mockApiPost).toHaveBeenCalledWith('/ai/sessions/s1/messages/send/', { content: 'test' })
    })

    it('trims content before sending', async () => {
      mockApiPost.mockResolvedValue({ data: { success: true, data: { content: 'ok' } } })

      const { sendMessage } = await import('./aiAssistantService')
      await sendMessage('s1', '  trimmed  ', undefined)

      expect(mockApiPost).toHaveBeenCalledWith('/ai/sessions/s1/messages/send/', { content: 'trimmed' })
    })
  })

  describe('getProviders', () => {
    it('returns allowed and active from envelope', async () => {
      const providers = { allowed: ['openai', 'anthropic'], active: 'openai' }
      mockApiGet.mockResolvedValue({ data: { data: providers } })

      const { getProviders } = await import('./aiAssistantService')
      const result = await getProviders()

      expect(mockApiGet).toHaveBeenCalledWith('/ai/providers/')
      expect(result).toEqual(providers)
    })

    it('returns fallback when data missing', async () => {
      mockApiGet.mockResolvedValue({ data: {} })

      const { getProviders } = await import('./aiAssistantService')
      const result = await getProviders()

      expect(result).toEqual({ allowed: [], active: '' })
    })
  })

  describe('error envelope (401/404/400/500)', () => {
    it('propagates 401 error', async () => {
      const err = { response: { status: 401, data: { errors: ['Unauthorized'] } } }
      mockApiPost.mockRejectedValue(err)

      const { sendMessage } = await import('./aiAssistantService')
      await expect(sendMessage('s1', 'hi')).rejects.toEqual(err)
    })

    it('propagates 404 error', async () => {
      const err = { response: { status: 404 } }
      mockApiGet.mockRejectedValue(err)

      const { listSessions } = await import('./aiAssistantService')
      await expect(listSessions()).rejects.toEqual(err)
    })

    it('propagates 400 validation error', async () => {
      const err = { response: { status: 400, data: { errors: ['content الزامی است'] } } }
      mockApiPost.mockRejectedValue(err)

      const { sendMessage } = await import('./aiAssistantService')
      await expect(sendMessage('s1', '')).rejects.toEqual(err)
    })

    it('propagates 500 server error', async () => {
      const err = { response: { status: 500 } }
      mockApiPost.mockRejectedValue(err)

      const { sendMessage } = await import('./aiAssistantService')
      await expect(sendMessage('s1', 'hi')).rejects.toEqual(err)
    })
  })
})
