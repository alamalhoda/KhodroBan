/**
 * Unit tests for ui store
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUIStore } from './ui'

describe('ui store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('has correct initial state', () => {
    const store = useUIStore()
    expect(store.sidebarCollapsed).toBe(false)
    expect(store.theme).toBe('light')
    expect(store.toasts).toEqual([])
    expect(store.modals).toEqual([])
  })

  it('toggleSidebar toggles sidebarCollapsed', () => {
    const store = useUIStore()
    expect(store.sidebarCollapsed).toBe(false)
    store.toggleSidebar()
    expect(store.sidebarCollapsed).toBe(true)
    store.toggleSidebar()
    expect(store.sidebarCollapsed).toBe(false)
  })

  it('setTheme updates theme', () => {
    const store = useUIStore()
    store.setTheme('dark')
    expect(store.theme).toBe('dark')
    store.setTheme('light')
    expect(store.theme).toBe('light')
  })

  it('showToast adds toast and returns id', () => {
    const store = useUIStore()
    const id = store.showToast({ message: 'Test', type: 'info' })
    expect(id).toBeTruthy()
    expect(store.toasts).toHaveLength(1)
    expect(store.toasts[0].message).toBe('Test')
    expect(store.toasts[0].type).toBe('info')
    expect(store.toasts[0].visible).toBe(true)
  })

  it('hideToast sets visible to false', () => {
    const store = useUIStore()
    const id = store.showToast({ message: 'Test', type: 'info', duration: 0 })
    expect(store.toasts[0].visible).toBe(true)
    store.hideToast(id)
    expect(store.toasts[0].visible).toBe(false)
  })

  it('success adds success toast', () => {
    const store = useUIStore()
    store.success('Done!', 0)
    expect(store.toasts[0].type).toBe('success')
    expect(store.toasts[0].message).toBe('Done!')
  })

  it('error adds error toast', () => {
    const store = useUIStore()
    store.error('Failed!', 0)
    expect(store.toasts[0].type).toBe('error')
    expect(store.toasts[0].message).toBe('Failed!')
  })

  it('warning adds warning toast', () => {
    const store = useUIStore()
    store.warning('Careful!', 0)
    expect(store.toasts[0].type).toBe('warning')
  })

  it('info adds info toast', () => {
    const store = useUIStore()
    store.info('Note', 0)
    expect(store.toasts[0].type).toBe('info')
  })
})
