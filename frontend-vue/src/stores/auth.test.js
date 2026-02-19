/**
 * Unit tests for auth store (with mocked authService)
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('@services/authService', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    getProfile: vi.fn(),
    updateProfile: vi.fn(),
    loginWithGoogle: vi.fn()
  }
}))

describe('auth store', () => {
  beforeEach(async () => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('has correct initial state', async () => {
    const { useAuthStore } = await import('./auth')
    const store = useAuthStore()
    expect(store.user).toBe(null)
    expect(store.token).toBe(null)
    expect(store.isLoading).toBe(false)
    expect(store.error).toBe(null)
    expect(store.isAuthenticated).toBe(false)
    expect(store.userTier).toBe('free')
  })

  it('isAuthenticated is true when user and token exist', async () => {
    const { useAuthStore } = await import('./auth')
    const store = useAuthStore()
    const runtimeToken = `tk_${crypto.randomUUID().slice(0, 8)}`
    store.user = { id: 1, name: 'Test' }
    store.token = runtimeToken
    expect(store.isAuthenticated).toBe(true)
  })

  it('userTier returns user tier or free', async () => {
    const { useAuthStore } = await import('./auth')
    const store = useAuthStore()
    expect(store.userTier).toBe('free')
    store.user = { tier: 'pro' }
    expect(store.userTier).toBe('pro')
  })

  it('login sets user and token on success', async () => {
    const { useAuthStore } = await import('./auth')
    const { authService } = await import('@services/authService')
    const mockUser = { id: 1, name: 'Test' }
    const mockToken = `t_${crypto.randomUUID().slice(0, 8)}`
    authService.login.mockResolvedValue({ user: mockUser, token: mockToken })

    const runtimePwd = crypto.randomUUID().slice(0, 12)
    const store = useAuthStore()
    await store.login({ email: 'a@b.com', password: runtimePwd })

    expect(store.user).toEqual(mockUser)
    expect(store.token).toBe(mockToken)
    expect(localStorage.getItem('token')).toBe(mockToken)
    expect(store.isLoading).toBe(false)
  })

  it('login sets error on failure', async () => {
    const { useAuthStore } = await import('./auth')
    const { authService } = await import('@services/authService')
    authService.login.mockRejectedValue(new Error('Invalid credentials'))

    const runtimePwd = crypto.randomUUID().slice(0, 12)
    const store = useAuthStore()
    await expect(store.login({ email: 'a@b.com', password: runtimePwd })).rejects.toThrow()
    expect(store.error).toBeTruthy()
    expect(store.isLoading).toBe(false)
  })

  it('logout clears user and token', async () => {
    const { useAuthStore } = await import('./auth')
    const { authService } = await import('@services/authService')
    authService.logout.mockResolvedValue(undefined)

    const runtimeToken = `t_${crypto.randomUUID().slice(0, 8)}`
    const store = useAuthStore()
    store.user = { id: 1 }
    store.token = runtimeToken
    localStorage.setItem('token', runtimeToken)

    await store.logout()

    expect(store.user).toBe(null)
    expect(store.token).toBe(null)
    expect(localStorage.getItem('token')).toBe(null)
  })

  it('saveToken updates token and localStorage', async () => {
    const { useAuthStore } = await import('./auth')
    const store = useAuthStore()
    const runtimeToken = `t_${crypto.randomUUID().slice(0, 8)}`
    store.saveToken(runtimeToken)
    expect(store.token).toBe(runtimeToken)
    expect(localStorage.getItem('token')).toBe(runtimeToken)
    store.saveToken(null)
    expect(store.token).toBe(null)
    expect(localStorage.getItem('token')).toBe(null)
  })
})
