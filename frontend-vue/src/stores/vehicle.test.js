/**
 * Unit tests for vehicle store (with mocked vehicleService)
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('@services/vehicleService', () => ({
  vehicleService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  }
}))

describe('vehicle store', () => {
  beforeEach(async () => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    const { vehicleService } = await import('@services/vehicleService')
    vehicleService.getAll.mockResolvedValue([])
  })

  it('has correct initial state', async () => {
    const { useVehicleStore } = await import('./vehicle')
    const store = useVehicleStore()
    expect(store.vehicles).toEqual([])
    expect(store.selectedVehicle).toBe(null)
    expect(store.isLoading).toBe(false)
    expect(store.error).toBe(null)
  })

  it('vehicleCount returns vehicles length', async () => {
    const { useVehicleStore } = await import('./vehicle')
    const store = useVehicleStore()
    store.vehicles = [{ id: 1 }, { id: 2 }]
    expect(store.vehicleCount).toBe(2)
  })

  it('vehicleById returns vehicle by id', async () => {
    const { useVehicleStore } = await import('./vehicle')
    const store = useVehicleStore()
    store.vehicles = [{ id: 1, model: 'A' }, { id: 2, model: 'B' }]
    expect(store.vehicleById(1)).toEqual({ id: 1, model: 'A' })
    expect(store.vehicleById(2)).toEqual({ id: 2, model: 'B' })
    expect(store.vehicleById(3)).toBeUndefined()
  })

  it('fetchVehicles sets vehicles from service', async () => {
    const { useVehicleStore } = await import('./vehicle')
    const { vehicleService } = await import('@services/vehicleService')
    const mockVehicles = [{ id: 1, model: 'Test' }]
    vehicleService.getAll.mockResolvedValue(mockVehicles)

    const store = useVehicleStore()
    await store.fetchVehicles()

    expect(store.vehicles).toEqual(mockVehicles)
    expect(store.isLoading).toBe(false)
    expect(store.error).toBe(null)
  })

  it('selectVehicle sets selectedVehicle', async () => {
    const { useVehicleStore } = await import('./vehicle')
    const store = useVehicleStore()
    store.vehicles = [{ id: 1, model: 'A' }]
    store.selectVehicle(1)
    expect(store.selectedVehicle).toEqual({ id: 1, model: 'A' })
  })

  it('clearError clears error', async () => {
    const { useVehicleStore } = await import('./vehicle')
    const store = useVehicleStore()
    store.error = 'Some error'
    store.clearError()
    expect(store.error).toBe(null)
  })
})
