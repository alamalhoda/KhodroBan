import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockAnalyzeCarIssue = vi.fn()
const mockGetCurrentProviderInfo = vi.fn()
const mockIsAIServiceConfigured = vi.fn()
const mockResetAIProvider = vi.fn()

vi.mock('@services/ai', () => ({
  analyzeCarIssue: (...args) => mockAnalyzeCarIssue(...args),
  getCurrentProviderInfo: (...args) => mockGetCurrentProviderInfo(...args),
  isAIServiceConfigured: (...args) => mockIsAIServiceConfigured(...args),
  resetAIProvider: (...args) => mockResetAIProvider(...args),
}))

function buildHttpError(statusCode) {
  const err = new Error(`http-${statusCode}`)
  err.response = { status: statusCode, data: { errors: [`e-${statusCode}`] } }
  return err
}

describe('aiService contract', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('proxies success path to analyzeCarIssue', async () => {
    const runtimeText = `msg-${crypto.randomUUID().slice(0, 8)}`
    const response = { summary: `summary-${crypto.randomUUID().slice(0, 8)}` }
    mockAnalyzeCarIssue.mockResolvedValueOnce(response)

    const { aiService } = await import('@services/aiService')
    const result = await aiService.analyzeCarIssue(runtimeText)

    expect(mockAnalyzeCarIssue).toHaveBeenCalledWith(runtimeText)
    expect(result).toEqual(response)
  })

  it('proxies helper methods as pass-through', async () => {
    mockGetCurrentProviderInfo.mockReturnValueOnce({ active: 'x' })
    mockIsAIServiceConfigured.mockReturnValueOnce(true)

    const { aiService } = await import('@services/aiService')

    expect(aiService.getCurrentProviderInfo()).toEqual({ active: 'x' })
    expect(aiService.isAIServiceConfigured()).toBe(true)
    aiService.resetAIProvider()
    expect(mockResetAIProvider).toHaveBeenCalled()
  })

  it.each([400, 401, 403, 404, 429, 500])(
    'propagates HTTP %s from analyzeCarIssue',
    async (statusCode) => {
      const httpError = buildHttpError(statusCode)
      mockAnalyzeCarIssue.mockRejectedValueOnce(httpError)
      const { aiService } = await import('@services/aiService')

      await expect(aiService.analyzeCarIssue('anything')).rejects.toBe(httpError)
    }
  )

  it('propagates timeout errors from analyzeCarIssue', async () => {
    const timeoutError = new Error('timeout')
    timeoutError.code = 'ECONNABORTED'
    mockAnalyzeCarIssue.mockRejectedValueOnce(timeoutError)
    const { aiService } = await import('@services/aiService')

    await expect(aiService.analyzeCarIssue('anything')).rejects.toBe(timeoutError)
  })
})
