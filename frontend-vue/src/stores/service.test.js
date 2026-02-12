/**
 * Unit tests for service store (with mocked serviceService)
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('@services/serviceService', () => ({
  serviceService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  }
}))

describe('service store', () => {
  beforeEach(async () => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    const { serviceService } = await import('@services/serviceService')
    serviceService.getAll.mockResolvedValue([])
  })

  it('has correct initial state', async () => {
    const { useServiceStore } = await import('./service')
    const store = useServiceStore()
    expect(store.services).toEqual([])
    expect(store.isLoading).toBe(false)
    expect(store.error).toBe(null)
    expect(store.searchQuery).toBe('')
    expect(store.filterVehicleId).toBe(null)
    expect(store.currentPage).toBe(1)
    expect(store.pageSize).toBe(10)
    expect(store.totalItems).toBe(0)
  })

  it('servicesByVehicle filters by vehicleId', async () => {
    const { useServiceStore } = await import('./service')
    const store = useServiceStore()
    store.services = [
      { id: 1, vehicleId: 'v1', date: '2024-01-01', cost: 100 },
      { id: 2, vehicleId: 'v2', date: '2024-01-02', cost: 200 },
      { id: 3, vehicleId: 'v1', date: '2024-01-03', cost: 300 }
    ]
    expect(store.servicesByVehicle('v1')).toHaveLength(2)
    expect(store.servicesByVehicle('v2')).toHaveLength(1)
    expect(store.servicesByVehicle(999)).toHaveLength(0)
  })

  it('recentServices returns at most 5 sorted by date desc', async () => {
    const { useServiceStore } = await import('./service')
    const store = useServiceStore()
    store.services = [
      { id: 1, date: '2024-01-01' },
      { id: 2, date: '2024-01-05' },
      { id: 3, date: '2024-01-03' },
      { id: 4, date: '2024-01-02' },
      { id: 5, date: '2024-01-04' },
      { id: 6, date: '2024-01-06' }
    ]
    const recent = store.recentServices
    expect(recent).toHaveLength(5)
    expect(recent[0].date).toBe('2024-01-06')
    expect(recent[4].date).toBe('2024-01-02')
  })

  it('totalServiceCost sums cost of all services', async () => {
    const { useServiceStore } = await import('./service')
    const store = useServiceStore()
    store.services = [
      { id: 1, cost: 100 },
      { id: 2, cost: 200 },
      { id: 3, cost: 300 }
    ]
    expect(store.totalServiceCost).toBe(600)
  })

  it('fetchServices sets services and resets pagination', async () => {
    const { useServiceStore } = await import('./service')
    const { serviceService } = await import('@services/serviceService')
    const mockData = [{ id: 1, vehicleId: 'v1', date: '2024-01-01', cost: 500 }]
    serviceService.getAll.mockResolvedValue(mockData)

    const store = useServiceStore()
    store.currentPage = 3
    await store.fetchServices('v1')

    expect(store.services).toEqual(mockData)
    expect(store.totalItems).toBe(1)
    expect(store.currentPage).toBe(1)
    expect(store.isLoading).toBe(false)
    expect(store.error).toBe(null)
  })

  it('fetchServices sets error on failure', async () => {
    const { useServiceStore } = await import('./service')
    const { serviceService } = await import('@services/serviceService')
    serviceService.getAll.mockRejectedValue(new Error('Network error'))

    const store = useServiceStore()
    await expect(store.fetchServices()).rejects.toThrow('Network error')
    expect(store.error).toBe('Network error')
    expect(store.isLoading).toBe(false)
  })

  it('createService unshifts new service and returns it', async () => {
    const { useServiceStore } = await import('./service')
    const { serviceService } = await import('@services/serviceService')
    const newService = { id: 10, vehicleId: 'v1', date: '2024-02-01', cost: 1000 }
    serviceService.create.mockResolvedValue(newService)

    const store = useServiceStore()
    store.services = [{ id: 1 }]
    const result = await store.createService({ vehicleId: 'v1', cost: 1000 })

    expect(result).toEqual(newService)
    expect(store.services).toHaveLength(2)
    expect(store.services[0]).toEqual(newService)
    expect(store.totalItems).toBe(2)
  })

  it('updateService replaces service in list', async () => {
    const { useServiceStore } = await import('./service')
    const { serviceService } = await import('@services/serviceService')
    const updated = { id: 1, vehicleId: 'v1', date: '2024-01-01', cost: 999 }
    serviceService.update.mockResolvedValue(updated)

    const store = useServiceStore()
    store.services = [{ id: 1, cost: 100 }]
    const result = await store.updateService(1, { cost: 999 })

    expect(result).toEqual(updated)
    expect(store.services[0].cost).toBe(999)
  })

  it('deleteService removes service from list', async () => {
    const { useServiceStore } = await import('./service')
    const { serviceService } = await import('@services/serviceService')
    serviceService.delete.mockResolvedValue(undefined)

    const store = useServiceStore()
    store.services = [{ id: 1 }, { id: 2 }]
    await store.deleteService(1)

    expect(store.services).toHaveLength(1)
    expect(store.services[0].id).toBe(2)
    expect(store.totalItems).toBe(1)
  })

  it('getServiceById returns service or undefined', async () => {
    const { useServiceStore } = await import('./service')
    const store = useServiceStore()
    store.services = [{ id: 1, note: 'A' }, { id: 2, note: 'B' }]
    expect(store.getServiceById(1)).toEqual({ id: 1, note: 'A' })
    expect(store.getServiceById(3)).toBeUndefined()
  })

  it('fetchServiceById updates service in list', async () => {
    const { useServiceStore } = await import('./service')
    const { serviceService } = await import('@services/serviceService')
    const fetched = { id: 1, vehicleId: 'v1', cost: 1500 }
    serviceService.getById.mockResolvedValue(fetched)

    const store = useServiceStore()
    store.services = [{ id: 1, cost: 100 }]
    const result = await store.fetchServiceById(1)

    expect(result).toEqual(fetched)
    expect(store.services[0].cost).toBe(1500)
  })

  it('setSearchQuery and clearFilters reset filters', async () => {
    const { useServiceStore } = await import('./service')
    const store = useServiceStore()
    store.searchQuery = 'test'
    store.filterVehicleId = 'v1'
    store.currentPage = 2
    store.setSearchQuery('oil')
    expect(store.searchQuery).toBe('oil')
    expect(store.currentPage).toBe(1)

    store.clearFilters()
    expect(store.searchQuery).toBe('')
    expect(store.filterVehicleId).toBe(null)
    expect(store.filterType).toBe(null)
    expect(store.filterDateFrom).toBe(null)
    expect(store.filterDateTo).toBe(null)
    expect(store.currentPage).toBe(1)
  })

  it('filteredServices filters by searchQuery', async () => {
    const { useServiceStore } = await import('./service')
    const store = useServiceStore()
    store.services = [
      { id: 1, note: 'روغن', cost: 100 },
      { id: 2, note: 'فیلتر', cost: 200 }
    ]
    store.setSearchQuery('روغن')
    expect(store.filteredServices).toHaveLength(1)
    expect(store.filteredServices[0].note).toBe('روغن')
  })

  it('paginatedServices and totalPages respect pageSize', async () => {
    const { useServiceStore } = await import('./service')
    const store = useServiceStore()
    store.services = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }))
    store.pageSize = 10
    expect(store.totalPages).toBe(3)
    expect(store.paginatedServices).toHaveLength(10)
    store.setPage(2)
    expect(store.paginatedServices).toHaveLength(10)
    store.setPage(3)
    expect(store.paginatedServices).toHaveLength(5)
  })

  it('nextPage and previousPage change currentPage within bounds', async () => {
    const { useServiceStore } = await import('./service')
    const store = useServiceStore()
    store.services = Array.from({ length: 15 }, (_, i) => ({ id: i + 1 }))
    store.pageSize = 5
    expect(store.currentPage).toBe(1)
    store.nextPage()
    expect(store.currentPage).toBe(2)
    store.nextPage()
    expect(store.currentPage).toBe(3)
    store.nextPage()
    expect(store.currentPage).toBe(3)
    store.previousPage()
    store.previousPage()
    expect(store.currentPage).toBe(1)
    store.previousPage()
    expect(store.currentPage).toBe(1)
  })

  it('clearError clears error', async () => {
    const { useServiceStore } = await import('./service')
    const store = useServiceStore()
    store.error = 'Some error'
    store.clearError()
    expect(store.error).toBe(null)
  })
})
