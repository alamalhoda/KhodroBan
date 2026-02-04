import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '../services'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  const isInitializing = ref(false) // Flag to prevent multiple simultaneous initializations

  // Getters
  const isAuthenticated = computed(() => !!user.value && !!token.value)
  const userTier = computed(() => user.value?.tier || 'free')

  // Helper: Save token to localStorage
  const saveToken = (newToken) => {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('token', newToken)
    } else {
      localStorage.removeItem('token')
    }
  }

  // Helper: Load token from localStorage
  const loadToken = () => {
    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      token.value = savedToken
    }
  }

  // Actions
  const login = async (credentials) => {
    // Prevent multiple simultaneous login attempts
    if (isLoading.value) {
      throw new Error('در حال پردازش درخواست قبلی...')
    }

    isLoading.value = true
    error.value = null
    isInitializing.value = true // Set flag to prevent initialization during login

    try {
      const result = await authService.login(credentials)
      user.value = result.user
      saveToken(result.token)
      return result
    } catch (err) {
      error.value = err.message || 'خطا در ورود به سیستم'
      throw err
    } finally {
      isLoading.value = false
      isInitializing.value = false
    }
  }

  const register = async (data) => {
    isLoading.value = true
    error.value = null

    try {
      const result = await authService.register(data)
      user.value = result.user
      saveToken(result.token)
      return result
    } catch (err) {
      error.value = err.message || 'خطا در ثبت‌نام'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const loginWithGoogle = async () => {
    isLoading.value = true
    error.value = null

    try {
      await authService.loginWithGoogle()
      // OAuth redirect will happen, so we don't need to return anything
    } catch (err) {
      error.value = err.message || 'خطا در ورود با Google'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    isLoading.value = true
    error.value = null

    try {
      await authService.logout()
      user.value = null
      saveToken(null)
    } catch (err) {
      // Even if logout fails, clear local state
      user.value = null
      saveToken(null)
      error.value = err.message || 'خطا در خروج از سیستم'
    } finally {
      isLoading.value = false
    }
  }

  const refreshToken = async () => {
    // This can be implemented later if token refresh is needed
    // For now, just check if we have a valid token
    loadToken()
    if (token.value && !user.value) {
      try {
        const profile = await authService.getProfile()
        user.value = profile
      } catch (err) {
        // Token is invalid, clear it
        saveToken(null)
      }
    }
  }

  const updateProfile = async (data) => {
    isLoading.value = true
    error.value = null

    try {
      const updatedUser = await authService.updateProfile(data)
      user.value = updatedUser
      return updatedUser
    } catch (err) {
      error.value = err.message || 'خطا در به‌روزرسانی پروفایل'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Initialize: Load token and user from localStorage on store creation
  const initialize = async () => {
    // Prevent multiple simultaneous initializations
    if (isInitializing.value) {
      // Wait for the current initialization to complete
      while (isInitializing.value) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      return
    }

    // If user is already loaded, no need to initialize again
    if (user.value && token.value) {
      return
    }

    loadToken()
    if (!token.value) {
      return
    }

    isInitializing.value = true
    
    try {
      // Add timeout for initialization (8 seconds)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Initialization timeout')), 8000)
      )
      
      const profilePromise = authService.getProfile()
      const profile = await Promise.race([profilePromise, timeoutPromise])
      user.value = profile
      
      // Verify token is still valid after successful profile fetch
      if (!token.value) {
        console.warn('Token was cleared during initialization')
      }
    } catch (err) {
      // Token is invalid or timeout occurred, clear it
      console.debug('Auth initialization failed or timeout:', err.message || err)
      // Only clear token if it's actually invalid (not just a timeout that might be network-related)
      const isAuthError = err.message?.includes('کاربر لاگین نشده') || 
                          err.message?.includes('Invalid') ||
                          err.message?.includes('JWT');
      
      if (isAuthError) {
        saveToken(null)
      }
      // Don't throw error - just silently fail and user will be redirected to login if needed
    } finally {
      isInitializing.value = false
    }
  }

  return {
    // State
    user,
    token,
    isLoading,
    error,
    // Getters
    isAuthenticated,
    userTier,
    // Actions
    login,
    register,
    loginWithGoogle,
    logout,
    refreshToken,
    updateProfile,
    initialize,
    // Helpers (for internal use)
    saveToken
  }
})