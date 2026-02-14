/**
 * Unit tests for dashboard store (with mocked dashboardService)
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

const mockGetSummary = vi.fn()
vi.mock('../services/dashboardService', () => ({
  dashboardService: {
    getSummary: () => mockGetSummary()
  }
}))

describe('dashboard store', () => {
  beforeEach(async () => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    mockGetSummary.mockResolvedValue({
      vehicles: [],
      reminders: [],
      recentServices: [],
      thisMonthExpenses: 0,
      servicesThisMonth: 0,
      avgMonthlyExpense: 0,
      nextServiceDue: null
    })
  })

  it('has correct initial state', async () => {
    const { useDashboardStore } = await import('./dashboard')
    const store = useDashboardStore()
    expect(store.isLoading).toBe(false)
    expect(store.error).toBe(null)
    expect(store.lastUpdated).toBe(null)
    expect(store.summary).toBe(null)
  })

  it('dashboardSummary returns fallback when summary is null', async () => {
    const { useDashboardStore } = await import('./dashboard')
    const store = useDashboardStore()
    expect(store.dashboardSummary).toBeDefined()
    expect(store.dashboardSummary.vehicles).toEqual([])
    expect(store.dashboardSummary.reminders).toEqual([])
    expect(store.dashboardSummary.recentServices).toEqual([])
  })

  it('quickStats returns zeros when summary is null', async () => {
    const { useDashboardStore } = await import('./dashboard')
    const store = useDashboardStore()
    expect(store.quickStats.thisMonthExpenses).toBe(0)
    expect(store.quickStats.servicesThisMonth).toBe(0)
    expect(store.quickStats.avgMonthlyExpense).toBe(0)
    expect(store.quickStats.nextServiceDue).toBe(null)
  })

  it('fetchDashboardData sets summary and clears error on success', async () => {
    const { useDashboardStore } = await import('./dashboard')
    const store = useDashboardStore()
    const data = {
      vehicles: [{ id: 1, model: 'پژو' }],
      reminders: [],
      recentServices: [],
      thisMonthExpenses: 1000000,
      servicesThisMonth: 5,
      avgMonthlyExpense: 800000,
      nextServiceDue: { title: 'روغن', dueDate: '2025-03-01' }
    }
    mockGetSummary.mockResolvedValue(data)

    const result = await store.fetchDashboardData()

    expect(mockGetSummary).toHaveBeenCalledTimes(1)
    expect(store.isLoading).toBe(false)
    expect(store.error).toBe(null)
    expect(store.summary).toEqual(data)
    expect(store.lastUpdated).toBeDefined()
    expect(result).toEqual(data)
  })

  it('fetchDashboardData sets isLoading during request', async () => {
    const { useDashboardStore } = await import('./dashboard')
    const store = useDashboardStore()
    let resolvePromise
    mockGetSummary.mockImplementation(
      () => new Promise((r) => { resolvePromise = r })
    )

    const promise = store.fetchDashboardData()
    expect(store.isLoading).toBe(true)

    resolvePromise({ vehicles: [], reminders: [], recentServices: [] })
    await promise
    expect(store.isLoading).toBe(false)
  })

  it('fetchDashboardData sets error on failure', async () => {
    const { useDashboardStore } = await import('./dashboard')
    const store = useDashboardStore()
    mockGetSummary.mockRejectedValue(new Error('خطای شبکه'))

    await expect(store.fetchDashboardData()).rejects.toThrow('خطای شبکه')
    expect(store.isLoading).toBe(false)
    expect(store.error).toContain('خطای شبکه')
  })

  it('refreshDashboard calls fetchDashboardData', async () => {
    const { useDashboardStore } = await import('./dashboard')
    const store = useDashboardStore()
    await store.refreshDashboard()
    expect(mockGetSummary).toHaveBeenCalledTimes(1)
  })

  it('dashboardSummary returns summary when set', async () => {
    const { useDashboardStore } = await import('./dashboard')
    const store = useDashboardStore()
    const data = { vehicles: [{ id: 1 }], reminders: [], recentServices: [] }
    mockGetSummary.mockResolvedValue(data)
    await store.fetchDashboardData()
    expect(store.dashboardSummary).toEqual(data)
  })

  it('quickStats returns summary values when set', async () => {
    const { useDashboardStore } = await import('./dashboard')
    const store = useDashboardStore()
    const data = {
      vehicles: [],
      reminders: [],
      recentServices: [],
      thisMonthExpenses: 2000000,
      servicesThisMonth: 10,
      avgMonthlyExpense: 1500000,
      nextServiceDue: { title: 'فیلتر' }
    }
    mockGetSummary.mockResolvedValue(data)
    await store.fetchDashboardData()
    expect(store.quickStats.thisMonthExpenses).toBe(2000000)
    expect(store.quickStats.servicesThisMonth).toBe(10)
    expect(store.quickStats.nextServiceDue?.title).toBe('فیلتر')
  })
})
