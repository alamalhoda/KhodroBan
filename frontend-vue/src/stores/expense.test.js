/**
 * Unit tests for expense store (with mocked expenseService)
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('@services/expenseService', () => ({
  expenseService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  }
}))

describe('expense store', () => {
  beforeEach(async () => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    const { expenseService } = await import('@services/expenseService')
    expenseService.getAll.mockResolvedValue([])
  })

  it('has correct initial state', async () => {
    const { useExpenseStore } = await import('./expense')
    const store = useExpenseStore()
    expect(store.expenses).toEqual([])
    expect(store.isLoading).toBe(false)
    expect(store.error).toBe(null)
  })

  it('expensesByVehicle filters by vehicleId', async () => {
    const { useExpenseStore } = await import('./expense')
    const store = useExpenseStore()
    store.expenses = [
      { id: '1', vehicleId: 'v1', date: '2024-01-01', amount: 100 },
      { id: '2', vehicleId: 'v2', date: '2024-01-02', amount: 200 },
      { id: '3', vehicleId: 'v1', date: '2024-01-03', amount: 300 }
    ]
    expect(store.expensesByVehicle('v1')).toHaveLength(2)
    expect(store.expensesByVehicle('v2')).toHaveLength(1)
  })

  it('totalExpenses sums amount of all expenses', async () => {
    const { useExpenseStore } = await import('./expense')
    const store = useExpenseStore()
    store.expenses = [
      { id: '1', amount: 100 },
      { id: '2', amount: 200 },
      { id: '3', amount: 300 }
    ]
    expect(store.totalExpenses).toBe(600)
  })

  it('createExpense success: adds to state and returns created', async () => {
    const { useExpenseStore } = await import('./expense')
    const { expenseService } = await import('@services/expenseService')
    const created = { id: 'e1', vehicleId: 'v1', date: '2024-09-28', amount: 50000, category: 'fuel', note: '' }
    expenseService.create.mockResolvedValue(created)

    const store = useExpenseStore()
    const result = await store.createExpense({
      vehicleId: 'v1',
      date: '2024-09-28',
      amount: 50000,
      category: 'fuel'
    })

    expect(result).toEqual(created)
    expect(store.expenses).toHaveLength(1)
    expect(store.expenses[0]).toEqual(created)
    expect(store.error).toBe(null)
  })

  it('createExpense failure: sets error and throws', async () => {
    const { useExpenseStore } = await import('./expense')
    const { expenseService } = await import('@services/expenseService')
    expenseService.create.mockRejectedValue(new Error('Network error'))

    const store = useExpenseStore()
    await expect(store.createExpense({ vehicleId: 'v1', date: '2024-09-28', amount: 100, category: 'fuel' })).rejects.toThrow('Network error')
    expect(store.expenses).toHaveLength(0)
    expect(store.error).toBeTruthy()
  })

  it('updateExpense success: replaces item in state', async () => {
    const { useExpenseStore } = await import('./expense')
    const { expenseService } = await import('@services/expenseService')
    const updated = { id: 'e1', vehicleId: 'v1', date: '2024-09-28', amount: 60000, category: 'fuel', note: 'updated' }
    expenseService.update.mockResolvedValue(updated)

    const store = useExpenseStore()
    store.expenses = [{ id: 'e1', vehicleId: 'v1', amount: 50000, category: 'fuel' }]
    const result = await store.updateExpense('e1', { amount: 60000, note: 'updated' })

    expect(result).toEqual(updated)
    expect(store.expenses[0].amount).toBe(60000)
    expect(store.error).toBe(null)
  })

  it('updateExpense failure: sets error and throws', async () => {
    const { useExpenseStore } = await import('./expense')
    const { expenseService } = await import('@services/expenseService')
    expenseService.update.mockRejectedValue(new Error('Not found'))

    const store = useExpenseStore()
    store.expenses = [{ id: 'e1', vehicleId: 'v1', amount: 50000 }]
    await expect(store.updateExpense('e1', { amount: 60000 })).rejects.toThrow('Not found')
    expect(store.expenses[0].amount).toBe(50000)
    expect(store.error).toBeTruthy()
  })

  it('deleteExpense success: removes from state', async () => {
    const { useExpenseStore } = await import('./expense')
    const { expenseService } = await import('@services/expenseService')
    expenseService.delete.mockResolvedValue(undefined)

    const store = useExpenseStore()
    store.expenses = [{ id: 'e1', vehicleId: 'v1', amount: 50000 }, { id: 'e2', vehicleId: 'v1', amount: 10000 }]
    await store.deleteExpense('e1')

    expect(store.expenses).toHaveLength(1)
    expect(store.expenses[0].id).toBe('e2')
    expect(store.error).toBe(null)
  })

  it('deleteExpense failure: sets error and throws', async () => {
    const { useExpenseStore } = await import('./expense')
    const { expenseService } = await import('@services/expenseService')
    expenseService.delete.mockRejectedValue(new Error('Forbidden'))

    const store = useExpenseStore()
    store.expenses = [{ id: 'e1', vehicleId: 'v1', amount: 50000 }]
    await expect(store.deleteExpense('e1')).rejects.toThrow('Forbidden')
    expect(store.expenses).toHaveLength(1)
    expect(store.error).toBeTruthy()
  })
})
