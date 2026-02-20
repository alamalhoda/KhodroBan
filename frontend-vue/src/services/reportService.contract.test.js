import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

const mockApiGet = vi.fn()
const mockServiceGetAll = vi.fn()
const mockExpenseGetAll = vi.fn()

vi.mock('@services/api', () => ({
  default: {
    get: (...args) => mockApiGet(...args),
  },
}))

vi.mock('@services/serviceService', () => ({
  serviceService: {
    getAll: (...args) => mockServiceGetAll(...args),
  },
}))

vi.mock('@services/expenseService', () => ({
  expenseService: {
    getAll: (...args) => mockExpenseGetAll(...args),
  },
}))

function buildHttpError(statusCode) {
  const err = new Error(`http-${statusCode}`)
  err.response = { status: statusCode, data: { errors: [`e-${statusCode}`] } }
  return err
}

async function readBlobText(blob) {
  if (typeof blob.text === 'function') {
    return blob.text()
  }
  if (typeof blob.arrayBuffer === 'function') {
    const buffer = await blob.arrayBuffer()
    return new TextDecoder().decode(buffer)
  }
  if (typeof FileReader !== 'undefined') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result || '')
      reader.onerror = () => reject(reader.error)
      reader.readAsText(blob)
    })
  }
  return String(blob)
}

describe('reportService contract (django)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
    vi.stubEnv('VITE_BACKEND_TYPE', 'django')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('getSummary maps filters to django query params and reads envelope', async () => {
    const summary = {
      totalCost: 1500000,
      totalKm: 55000,
      costByCategory: { fuel: 500000, service_oil_change: 1000000 },
      costByMonth: [{ month: '1403/11', amount: 1500000 }],
    }
    mockApiGet.mockResolvedValueOnce({ data: { success: true, data: summary } })

    const { reportService } = await import('@services/reportService')
    const result = await reportService.getSummary({
      vehicleId: 'veh-1',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    })

    expect(mockApiGet).toHaveBeenCalledWith('/reports/summary/', {
      params: {
        vehicle_id: 'veh-1',
        date_from: '2024-01-01',
        date_to: '2024-12-31',
      },
    })
    expect(result).toEqual(summary)
  })

  it('exportCSV builds csv blob from services and expenses', async () => {
    mockServiceGetAll.mockResolvedValueOnce([
      { type: 'oil_change', date: '1403/01/01', cost: 900000, note: 'n1' },
    ])
    mockExpenseGetAll.mockResolvedValueOnce([
      { category: 'fuel', date: '1403/01/02', amount: 200000, note: 'n2' },
    ])

    const { reportService } = await import('@services/reportService')
    const blob = await reportService.exportCSV({ vehicleId: 'veh-1' })
    const csvText = await readBlobText(blob)

    expect(blob).toBeInstanceOf(Blob)
    expect(csvText).toContain('نوع,تاریخ,مبلغ,توضیحات')
    expect(csvText).toContain('سرویس - oil_change')
    expect(csvText).toContain('هزینه - fuel')
  })

  it('getMonthlyTrend returns first N items from summary', async () => {
    mockApiGet.mockResolvedValueOnce({
      data: {
        success: true,
        data: {
          totalCost: 1,
          totalKm: 1,
          costByCategory: {},
          costByMonth: [
            { month: '1403/11', amount: 1 },
            { month: '1403/10', amount: 2 },
            { month: '1403/09', amount: 3 },
          ],
        },
      },
    })

    const { reportService } = await import('@services/reportService')
    const trend = await reportService.getMonthlyTrend('veh-1', 2)

    expect(trend).toEqual([
      { month: '1403/11', amount: 1 },
      { month: '1403/10', amount: 2 },
    ])
  })

  it.each([400, 401, 403, 404, 429, 500])(
    'getSummary propagates HTTP %s error',
    async (statusCode) => {
      const httpError = buildHttpError(statusCode)
      mockApiGet.mockRejectedValueOnce(httpError)

      const { reportService } = await import('@services/reportService')
      await expect(reportService.getSummary({ vehicleId: 'veh-err' })).rejects.toBe(httpError)
    }
  )

  it('getSummary propagates timeout errors', async () => {
    const timeoutError = new Error('timeout')
    timeoutError.code = 'ECONNABORTED'
    mockApiGet.mockRejectedValueOnce(timeoutError)

    const { reportService } = await import('@services/reportService')
    await expect(reportService.getSummary()).rejects.toBe(timeoutError)
  })
})
