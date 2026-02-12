/**
 * Unit tests for servicePresetService (with mocked api)
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockApiGet = vi.fn()
vi.mock('./index', () => ({
  api: { get: (...args) => mockApiGet(...args) }
}))

describe('servicePresetService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getAll returns empty array when backend is not django', async () => {
    const { servicePresetService } = await import('./servicePresetService')
    const result = await servicePresetService.getAll({ VITE_BACKEND_TYPE: 'supabase' })
    expect(result).toEqual([])
    expect(mockApiGet).not.toHaveBeenCalled()
  })

  it('getAll returns empty array when env has no VITE_BACKEND_TYPE', async () => {
    const { servicePresetService } = await import('./servicePresetService')
    const result = await servicePresetService.getAll({})
    expect(result).toEqual([])
    expect(mockApiGet).not.toHaveBeenCalled()
  })

  it('getAll fetches and maps presets when backend is django', async () => {
    mockApiGet.mockResolvedValue({
      data: {
        data: [
          {
            preset_id: 1,
            name: 'سرویس ۵۰۰۰',
            display_order: 10,
            service_type_codes: ['oil_change', 'filter']
          }
        ]
      }
    })
    const { servicePresetService } = await import('./servicePresetService')
    const result = await servicePresetService.getAll({ VITE_BACKEND_TYPE: 'django' })
    expect(mockApiGet).toHaveBeenCalledWith('/service-presets/')
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      preset_id: 1,
      name: 'سرویس ۵۰۰۰',
      display_order: 10,
      service_type_codes: ['oil_change', 'filter']
    })
  })

  it('getAll uses display_order 0 when missing', async () => {
    mockApiGet.mockResolvedValue({
      data: { data: [{ preset_id: 2, name: 'پیش‌فرض', service_type_codes: [] }] }
    })
    const { servicePresetService } = await import('./servicePresetService')
    const result = await servicePresetService.getAll({ VITE_BACKEND_TYPE: 'django' })
    expect(result[0].display_order).toBe(0)
    expect(result[0].service_type_codes).toEqual([])
  })

  it('getAll returns empty array on api error', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockApiGet.mockRejectedValue(new Error('Network error'))
    const { servicePresetService } = await import('./servicePresetService')
    const result = await servicePresetService.getAll({ VITE_BACKEND_TYPE: 'django' })
    expect(result).toEqual([])
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })
})
