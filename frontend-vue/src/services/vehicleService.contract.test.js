import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

const mockApiGet = vi.fn()
const mockApiPost = vi.fn()
const mockApiPatch = vi.fn()
const mockApiDelete = vi.fn()

vi.mock('@services/api', () => ({
  default: {
    get: (...args) => mockApiGet(...args),
    post: (...args) => mockApiPost(...args),
    patch: (...args) => mockApiPatch(...args),
    delete: (...args) => mockApiDelete(...args),
  },
}))

function buildHttpError(statusCode) {
  const err = new Error(`http-${statusCode}`)
  err.response = { status: statusCode, data: { errors: [`e-${statusCode}`] } }
  return err
}

describe('vehicleService contract (django envelope)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
    vi.stubEnv('VITE_BACKEND_TYPE', 'django')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('reads vehicles list from success envelope', async () => {
    const vehicles = [
      {
        id: 'veh-1',
        userId: 'u-1',
        model: 'پژو',
        year: 1402,
        plateNumber: '11ب111',
        currentKm: 30000,
      },
    ]
    mockApiGet.mockResolvedValueOnce({ data: { success: true, data: vehicles } })

    const { vehicleService } = await import('@services/vehicleService')
    const result = await vehicleService.getAll()

    expect(mockApiGet).toHaveBeenCalledWith('/vehicles/')
    expect(result).toEqual(vehicles)
  })

  it('creates and returns vehicle from envelope', async () => {
    const payload = {
      model: 'سمند',
      year: 1401,
      plateNumber: '22پ222',
      currentKm: 45000,
      note: 'note',
    }
    const created = { id: 'veh-2', userId: 'u-1', ...payload }
    mockApiPost.mockResolvedValueOnce({ data: { success: true, data: created } })

    const { vehicleService } = await import('@services/vehicleService')
    const result = await vehicleService.create(payload)

    expect(mockApiPost).toHaveBeenCalledWith('/vehicles/', payload)
    expect(result).toEqual(created)
  })

  it('updates km-history using expected endpoint and payload', async () => {
    const updatedVehicle = {
      id: 'veh-3',
      userId: 'u-1',
      model: 'پراید',
      year: 1399,
      plateNumber: '33ت333',
      currentKm: 80100,
    }
    mockApiPost.mockResolvedValueOnce({ data: { success: true, data: updatedVehicle } })

    const { vehicleService } = await import('@services/vehicleService')
    const result = await vehicleService.addKmHistory('veh-3', 80100, 'manual', 'src-1', 'run-note')

    expect(mockApiPost).toHaveBeenCalledWith('/vehicles/veh-3/km-history/', {
      km: 80100,
      sourceType: 'manual',
      sourceId: 'src-1',
      note: 'run-note',
    })
    expect(result).toEqual(updatedVehicle)
  })

  it.each([400, 401, 403, 404, 429, 500])(
    'getById propagates HTTP %s error',
    async (statusCode) => {
      const httpError = buildHttpError(statusCode)
      mockApiGet.mockRejectedValueOnce(httpError)

      const { vehicleService } = await import('@services/vehicleService')
      await expect(vehicleService.getById('veh-x')).rejects.toBe(httpError)
    }
  )

  it('propagates timeout on km-history fetch', async () => {
    const timeoutError = new Error('timeout')
    timeoutError.code = 'ECONNABORTED'
    mockApiGet.mockRejectedValueOnce(timeoutError)

    const { vehicleService } = await import('@services/vehicleService')
    await expect(vehicleService.getKmHistory('veh-x')).rejects.toBe(timeoutError)
  })
})
