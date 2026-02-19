import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

const mockApiPost = vi.fn()
const mockApiGet = vi.fn()
const mockApiPatch = vi.fn()

vi.mock('@services/api', () => ({
  default: {
    post: (...args) => mockApiPost(...args),
    get: (...args) => mockApiGet(...args),
    patch: (...args) => mockApiPatch(...args),
  },
}))

function buildHttpError(statusCode) {
  const err = new Error(`http-${statusCode}`)
  err.response = { status: statusCode, data: { errors: [`e-${statusCode}`] } }
  return err
}

describe('authService contract (django)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
    vi.stubEnv('VITE_BACKEND_TYPE', 'django')
    localStorage.clear()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('login maps email to username and returns user + token', async () => {
    const runtimeEmail = `user-${crypto.randomUUID().slice(0, 8)}@test.local`
    const runtimePassword = crypto.randomUUID().slice(0, 12)
    const runtimeAccess = `acc_${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`
    const runtimeRefresh = `ref_${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`
    const profile = { id: '1', email: runtimeEmail, name: 'User', tier: 'free' }

    mockApiPost.mockResolvedValueOnce({ data: { access: runtimeAccess, refresh: runtimeRefresh } })
    mockApiGet.mockResolvedValueOnce({ data: profile })

    const { authService } = await import('@services/authService')
    const result = await authService.login({ email: runtimeEmail, password: runtimePassword })

    expect(mockApiPost).toHaveBeenCalledWith('/token/', {
      username: runtimeEmail,
      password: runtimePassword,
    })
    expect(mockApiGet).toHaveBeenCalledWith('/me/')
    expect(result).toEqual({ user: profile, token: runtimeAccess })
    expect(localStorage.getItem('token')).toBe(runtimeAccess)
  })

  it('register sends password2 and returns user + token', async () => {
    const runtimeEmail = `user-${crypto.randomUUID().slice(0, 8)}@test.local`
    const runtimePassword = crypto.randomUUID().slice(0, 12)
    const runtimeAccess = `acc_${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`
    const runtimeRefresh = `ref_${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`
    const profile = { id: '2', email: runtimeEmail, name: 'User Two', tier: 'free' }

    mockApiPost.mockResolvedValueOnce({ data: { access: runtimeAccess, refresh: runtimeRefresh } })
    mockApiGet.mockResolvedValueOnce({ data: profile })

    const { authService } = await import('@services/authService')
    const result = await authService.register({
      name: 'User Two',
      email: runtimeEmail,
      password: runtimePassword,
    })

    expect(mockApiPost).toHaveBeenCalledWith('/register/', {
      username: runtimeEmail,
      email: runtimeEmail,
      password: runtimePassword,
      password2: runtimePassword,
      first_name: 'User Two',
      last_name: '',
    })
    expect(result).toEqual({ user: profile, token: runtimeAccess })
  })

  it.each([400, 401, 403, 404, 429, 500])(
    'login propagates HTTP %s error',
    async (statusCode) => {
      const runtimeEmail = `user-${crypto.randomUUID().slice(0, 8)}@test.local`
      const runtimePassword = crypto.randomUUID().slice(0, 12)
      const httpError = buildHttpError(statusCode)
      mockApiPost.mockRejectedValueOnce(httpError)

      const { authService } = await import('@services/authService')
      await expect(
        authService.login({ email: runtimeEmail, password: runtimePassword })
      ).rejects.toBe(httpError)
    }
  )

  it('login propagates timeout error', async () => {
    const runtimeEmail = `user-${crypto.randomUUID().slice(0, 8)}@test.local`
    const runtimePassword = crypto.randomUUID().slice(0, 12)
    const timeoutError = new Error('timeout')
    timeoutError.code = 'ECONNABORTED'
    mockApiPost.mockRejectedValueOnce(timeoutError)

    const { authService } = await import('@services/authService')
    await expect(
      authService.login({ email: runtimeEmail, password: runtimePassword })
    ).rejects.toBe(timeoutError)
  })

  it('logout clears token even when backend call fails', async () => {
    const runtimeAccess = `acc_${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`
    localStorage.setItem('token', runtimeAccess)
    mockApiPost.mockRejectedValueOnce(buildHttpError(500))

    const { authService } = await import('@services/authService')
    await authService.logout()

    expect(localStorage.getItem('token')).toBe(null)
    expect(mockApiPost).toHaveBeenCalledWith('/auth/logout/')
  })
})
