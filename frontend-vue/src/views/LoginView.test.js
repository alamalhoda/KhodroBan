import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { reactive } from 'vue'

const mockPush = vi.fn()
const mockShowToast = vi.fn()
const mockLogin = vi.fn()
const mockLoginWithGoogle = vi.fn()
const mockFocus = vi.fn()

const routeState = reactive({
  query: {},
})

const authState = reactive({
  isLoading: false,
  error: null,
  login: (...args) => mockLogin(...args),
  loginWithGoogle: (...args) => mockLoginWithGoogle(...args),
})

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
  useRoute: () => routeState,
}))

vi.mock('vue-i18n', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useI18n: () => ({ t: (key) => key }),
  }
})

vi.mock('../stores/auth', () => ({
  useAuthStore: () => authState,
}))

vi.mock('../stores/ui', () => ({
  useUIStore: () => ({
    showToast: (...args) => mockShowToast(...args),
  }),
}))

vi.mock('../composables', () => ({
  useKeyboardNavigation: () => ({ onKeyPress: vi.fn() }),
  useFocus: () => ({ focus: (...args) => mockFocus(...args) }),
}))

const globalStubs = {
  stubs: {
    LanguageSwitcherCard: { template: '<div data-testid="lang-switcher" />' },
    RouterLink: { template: '<a><slot /></a>', props: ['to'] },
    Input: {
      template: `
        <div>
          <input
            :id="name"
            :value="modelValue"
            :type="type || 'text'"
            :disabled="disabled"
            @input="$emit('update:modelValue', $event.target.value)"
          />
          <span v-if="error" data-testid="input-error">{{ error }}</span>
        </div>
      `,
      props: ['modelValue', 'name', 'type', 'error', 'disabled'],
      emits: ['update:modelValue'],
    },
    Button: {
      template: `
        <button
          :type="type || 'button'"
          :disabled="disabled || loading"
          @click="$emit('click', $event)"
        >
          <slot />
        </button>
      `,
      props: ['type', 'disabled', 'loading'],
      emits: ['click'],
    },
  },
}

describe('LoginView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    routeState.query = {}
    authState.isLoading = false
    authState.error = null
    mockLogin.mockResolvedValue(undefined)
    mockLoginWithGoogle.mockResolvedValue(undefined)
  })

  it('shows loading state when authStore is loading', async () => {
    authState.isLoading = true
    const { default: LoginView } = await import('./LoginView.vue')
    const wrapper = mount(LoginView, { global: globalStubs })
    await flushPromises()

    expect(wrapper.text()).toContain('common.loading')
    expect(wrapper.get('button[type="submit"]').attributes('disabled')).toBeDefined()
  })

  it('submits successfully and redirects to route query redirect', async () => {
    const runtimeEmail = `user-${crypto.randomUUID().slice(0, 8)}@test.local`
    const runtimePassword = crypto.randomUUID().slice(0, 12)
    routeState.query = { redirect: '/reports' }
    const { default: LoginView } = await import('./LoginView.vue')
    const wrapper = mount(LoginView, { global: globalStubs })

    await wrapper.get('input#email').setValue(` ${runtimeEmail} `)
    await wrapper.get('input#password').setValue(runtimePassword)
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(mockLogin).toHaveBeenCalledWith({
      email: runtimeEmail,
      password: runtimePassword,
    })
    expect(mockShowToast).toHaveBeenCalledWith({
      message: 'auth.welcomeBack',
      type: 'success',
    })
    expect(mockPush).toHaveBeenCalledWith('/reports')
  })

  it('shows error toast on failed login', async () => {
    const runtimeEmail = `user-${crypto.randomUUID().slice(0, 8)}@test.local`
    const runtimePassword = crypto.randomUUID().slice(0, 12)
    const runtimeErrorText = `err-${crypto.randomUUID().slice(0, 8)}`
    mockLogin.mockRejectedValue(new Error(runtimeErrorText))
    const { default: LoginView } = await import('./LoginView.vue')
    const wrapper = mount(LoginView, { global: globalStubs })

    await wrapper.get('input#email').setValue(runtimeEmail)
    await wrapper.get('input#password').setValue(runtimePassword)
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(mockShowToast).toHaveBeenCalledWith({
      message: runtimeErrorText,
      type: 'error',
    })
  })

  it('shows validation error and does not call login for empty fields', async () => {
    const { default: LoginView } = await import('./LoginView.vue')
    const wrapper = mount(LoginView, { global: globalStubs })

    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(mockLogin).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('validation.required')
  })
})
