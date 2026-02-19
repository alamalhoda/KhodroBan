/**
 * Unit tests for report store (with mocked reportService)
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

const mockGetSummary = vi.fn()
const mockExportCSV = vi.fn()
const mockDownloadFile = vi.fn()
vi.mock('../services', () => ({
  reportService: {
    getSummary: (...args) => mockGetSummary(...args),
    exportCSV: (...args) => mockExportCSV(...args),
    downloadFile: (...args) => mockDownloadFile(...args)
  }
}))

describe('report store', () => {
  beforeEach(async () => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    mockGetSummary.mockResolvedValue({
      totalCost: 0,
      totalKm: 0,
      costByCategory: {},
      costByMonth: []
    })
  })

  it('has correct initial state', async () => {
    const { useReportStore } = await import('./report')
    const store = useReportStore()
    expect(store.reportData).toEqual({})
    expect(store.filters).toEqual({
      dateRange: 'last30days',
      vehicleId: null,
      category: 'all'
    })
    expect(store.isLoading).toBe(false)
    expect(store.error).toBe(null)
  })

  it('fetchReportData calls getSummary with date range', async () => {
    const { useReportStore } = await import('./report')
    const store = useReportStore()
    const data = {
      totalCost: 1000000,
      totalKm: 50000,
      costByCategory: { oil: 500000 },
      costByMonth: [{ month: '1403/01', amount: 500000 }]
    }
    mockGetSummary.mockResolvedValue(data)

    const result = await store.fetchReportData()

    expect(mockGetSummary).toHaveBeenCalled()
    const callArg = mockGetSummary.mock.calls[0][0]
    expect(callArg).toHaveProperty('startDate')
    expect(callArg).toHaveProperty('endDate')
    expect(store.reportData).toEqual(data)
    expect(store.isLoading).toBe(false)
    expect(store.error).toBe(null)
    expect(result).toEqual(data)
  })

  it('fetchReportData passes vehicleId when set', async () => {
    const { useReportStore } = await import('./report')
    const store = useReportStore()
    store.updateFilters({ vehicleId: 42 })
    await store.fetchReportData()

    const callArg = mockGetSummary.mock.calls[0][0]
    expect(callArg.vehicleId).toBe(42)
  })

  it('fetchReportData sets error on failure', async () => {
    const { useReportStore } = await import('./report')
    const store = useReportStore()
    mockGetSummary.mockRejectedValue(new Error('شبکه'))

    await expect(store.fetchReportData()).rejects.toThrow('شبکه')
    expect(store.error).toBeTruthy()
    expect(store.reportData).toEqual({})
    expect(store.isLoading).toBe(false)
  })

  it('updateFilters merges new filters', async () => {
    const { useReportStore } = await import('./report')
    const store = useReportStore()
    store.updateFilters({ vehicleId: 5, dateRange: 'thisYear' })

    expect(store.filters.vehicleId).toBe(5)
    expect(store.filters.dateRange).toBe('thisYear')
    expect(store.filters.category).toBe('all')
  })

  it('exportReport calls exportCSV and downloadFile', async () => {
    const { useReportStore } = await import('./report')
    const store = useReportStore()
    const blob = new Blob(['csv'], { type: 'text/csv' })
    mockExportCSV.mockResolvedValue(blob)

    await store.exportReport('csv')

    expect(mockExportCSV).toHaveBeenCalled()
    expect(mockDownloadFile).toHaveBeenCalledWith(blob, 'report.csv')
  })
})
