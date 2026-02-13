/**
 * Unit tests for reminder store (with mocked reminderService)
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

const mockGetAll = vi.fn()
const mockGetById = vi.fn()
const mockGetByVehicle = vi.fn()
const mockCreate = vi.fn()
const mockUpdate = vi.fn()
const mockDelete = vi.fn()
const mockDismiss = vi.fn()

vi.mock('../services', () => ({
  reminderService: {
    getAll: (...args) => mockGetAll(...args),
    getById: (...args) => mockGetById(...args),
    getByVehicle: (...args) => mockGetByVehicle(...args),
    create: (...args) => mockCreate(...args),
    update: (...args) => mockUpdate(...args),
    delete: (...args) => mockDelete(...args),
    dismiss: (...args) => mockDismiss(...args)
  }
}))

const sampleReminder = {
  id: 'r1',
  userId: 'u1',
  vehicleId: 'v1',
  vehicleName: 'پژو ۲۰۶',
  title: 'تعویض روغن',
  status: 'near',
  dueKm: 90000,
  currentKm: 85000,
  dismissed: false,
  warningDaysBefore: 7,
  warningKmBefore: 500,
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z'
}

describe('reminder store', () => {
  beforeEach(async () => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    mockGetAll.mockResolvedValue([])
    mockGetById.mockResolvedValue(sampleReminder)
    mockGetByVehicle.mockResolvedValue([])
    mockCreate.mockResolvedValue({ ...sampleReminder, id: 'r-new' })
    mockUpdate.mockResolvedValue({ ...sampleReminder, title: 'ویرایش شده' })
    mockDelete.mockResolvedValue(undefined)
    mockDismiss.mockResolvedValue(undefined)
  })

  it('has correct initial state', async () => {
    const { useReminderStore } = await import('./reminder')
    const store = useReminderStore()
    expect(store.reminders).toEqual([])
    expect(store.isLoading).toBe(false)
    expect(store.error).toBe(null)
  })

  it('fetchReminders calls getAll and sets reminders', async () => {
    const { useReminderStore } = await import('./reminder')
    const store = useReminderStore()
    const list = [{ ...sampleReminder }]
    mockGetAll.mockResolvedValue(list)

    await store.fetchReminders()

    expect(mockGetAll).toHaveBeenCalledTimes(1)
    expect(mockGetByVehicle).not.toHaveBeenCalled()
    expect(store.reminders).toEqual(list)
    expect(store.isLoading).toBe(false)
    expect(store.error).toBe(null)
  })

  it('fetchReminders with vehicleId calls getByVehicle', async () => {
    const { useReminderStore } = await import('./reminder')
    const store = useReminderStore()
    mockGetByVehicle.mockResolvedValue([sampleReminder])

    await store.fetchReminders('v1')

    expect(mockGetByVehicle).toHaveBeenCalledWith('v1')
    expect(mockGetAll).not.toHaveBeenCalled()
    expect(store.reminders).toHaveLength(1)
  })

  it('getReminderById fetches and returns reminder', async () => {
    const { useReminderStore } = await import('./reminder')
    const store = useReminderStore()

    const result = await store.getReminderById('r1')

    expect(mockGetById).toHaveBeenCalledWith('r1')
    expect(result).toEqual(sampleReminder)
    expect(store.isLoading).toBe(false)
  })

  it('createReminder calls service and prepends to list', async () => {
    const { useReminderStore } = await import('./reminder')
    const store = useReminderStore()
    store.reminders = []
    const newReminder = { ...sampleReminder, id: 'r-new' }
    mockCreate.mockResolvedValue(newReminder)

    const result = await store.createReminder({
      title: 'جدید',
      vehicleId: 'v1',
      dueKm: 90000
    })

    expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({ title: 'جدید' }))
    expect(store.reminders).toHaveLength(1)
    expect(store.reminders[0]).toEqual(newReminder)
    expect(result).toEqual(newReminder)
  })

  it('updateReminder calls service and updates item in list', async () => {
    const { useReminderStore } = await import('./reminder')
    const store = useReminderStore()
    store.reminders = [{ ...sampleReminder }]
    const updated = { ...sampleReminder, title: 'ویرایش شده' }
    mockUpdate.mockResolvedValue(updated)

    await store.updateReminder('r1', { title: 'ویرایش شده' })

    expect(mockUpdate).toHaveBeenCalledWith('r1', expect.objectContaining({ title: 'ویرایش شده' }))
    expect(store.reminders[0].title).toBe('ویرایش شده')
  })

  it('deleteReminder calls service and removes from list', async () => {
    const { useReminderStore } = await import('./reminder')
    const store = useReminderStore()
    store.reminders = [{ ...sampleReminder }]

    await store.deleteReminder('r1')

    expect(mockDelete).toHaveBeenCalledWith('r1')
    expect(store.reminders).toHaveLength(0)
  })

  it('markCompleted calls dismiss and sets dismissed true', async () => {
    const { useReminderStore } = await import('./reminder')
    const store = useReminderStore()
    store.reminders = [{ ...sampleReminder }]

    await store.markCompleted('r1')

    expect(mockDismiss).toHaveBeenCalledWith('r1')
    expect(store.reminders[0].dismissed).toBe(true)
  })

  it('overdueReminders filters only overdue and not dismissed', async () => {
    const { useReminderStore } = await import('./reminder')
    const store = useReminderStore()
    store.reminders = [
      { ...sampleReminder, id: '1', status: 'overdue', dismissed: false },
      { ...sampleReminder, id: '2', status: 'overdue', dismissed: true },
      { ...sampleReminder, id: '3', status: 'near', dismissed: false }
    ]

    expect(store.overdueReminders).toHaveLength(1)
    expect(store.overdueReminders[0].id).toBe('1')
  })

  it('clearError sets error to null', async () => {
    const { useReminderStore } = await import('./reminder')
    const store = useReminderStore()
    store.error = 'خطا'

    store.clearError()

    expect(store.error).toBe(null)
  })

  it('sets error and rethrows on fetchReminders failure', async () => {
    const { useReminderStore } = await import('./reminder')
    const store = useReminderStore()
    mockGetAll.mockRejectedValue(new Error('شبکه'))

    await expect(store.fetchReminders()).rejects.toThrow('شبکه')
    expect(store.error).toBeTruthy()
    expect(store.isLoading).toBe(false)
  })
})
