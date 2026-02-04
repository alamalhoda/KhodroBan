import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { telegramService } from '../services'
import { useAuthStore } from './auth'

export const useTelegramStore = defineStore('telegram', () => {
  // State
  const isConnected = ref(false)
  const connectionCode = ref(null)
  const telegramLink = ref('')
  const isLoading = ref(false)
  const error = ref(null)
  const chatId = ref(null)

  // Getters
  const hasConnectionCode = computed(() => !!connectionCode.value)
  const canConnect = computed(() => !isConnected.value && !isLoading.value)

  // Actions
  /**
   * بارگذاری وضعیت اتصال
   */
  const loadStatus = async () => {
    const authStore = useAuthStore()
    if (!authStore.user) {
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const status = await telegramService.getConnectionStatus(authStore.user.id)
      isConnected.value = status.isConnected
      connectionCode.value = status.code
      chatId.value = status.chatId

      // اگر متصل نیست، لینک اتصال را دریافت کن
      if (!status.isConnected) {
        telegramLink.value = await telegramService.getTelegramLink(authStore.user.id)
        // بعد از دریافت لینک، ممکن است کد جدید ایجاد شده باشد
        const newStatus = await telegramService.getConnectionStatus(authStore.user.id)
        connectionCode.value = newStatus.code
      } else {
        const botUsername = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'your_bot'
        telegramLink.value = `https://t.me/${botUsername}`
      }
    } catch (err) {
      error.value = err.message || 'خطا در بارگذاری وضعیت تلگرام'
      console.error('Error loading telegram status:', err)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * ایجاد لینک اتصال جدید
   */
  const generateLink = async () => {
    const authStore = useAuthStore()
    if (!authStore.user) {
      throw new Error('کاربر لاگین نشده است')
    }

    isLoading.value = true
    error.value = null

    try {
      telegramLink.value = await telegramService.getTelegramLink(authStore.user.id)
      const status = await telegramService.getConnectionStatus(authStore.user.id)
      connectionCode.value = status.code
    } catch (err) {
      error.value = err.message || 'خطا در ایجاد لینک اتصال'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * قطع اتصال تلگرام
   */
  const disconnect = async () => {
    const authStore = useAuthStore()
    if (!authStore.user) {
      throw new Error('کاربر لاگین نشده است')
    }

    isLoading.value = true
    error.value = null

    try {
      await telegramService.disconnect(authStore.user.id)
      isConnected.value = false
      connectionCode.value = null
      chatId.value = null
      // ایجاد لینک جدید برای اتصال مجدد
      await generateLink()
    } catch (err) {
      error.value = err.message || 'خطا در قطع اتصال'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * بررسی وضعیت اتصال (polling)
   * این تابع برای چک کردن اینکه آیا کاربر در تلگرام Start زده یا نه
   */
  const checkConnection = async () => {
    const authStore = useAuthStore()
    if (!authStore.user) {
      return false
    }

    try {
      const status = await telegramService.getConnectionStatus(authStore.user.id)
      if (status.isConnected && !isConnected.value) {
        // اتصال جدید برقرار شده
        isConnected.value = true
        chatId.value = status.chatId
        connectionCode.value = null
        return true
      }
      return status.isConnected
    } catch (err) {
      console.error('Error checking connection:', err)
      return false
    }
  }

  /**
   * پاک کردن خطا
   */
  const clearError = () => {
    error.value = null
  }

  /**
   * ریست کردن state
   */
  const reset = () => {
    isConnected.value = false
    connectionCode.value = null
    telegramLink.value = ''
    isLoading.value = false
    error.value = null
    chatId.value = null
  }

  return {
    // State
    isConnected,
    connectionCode,
    telegramLink,
    isLoading,
    error,
    chatId,
    // Getters
    hasConnectionCode,
    canConnect,
    // Actions
    loadStatus,
    generateLink,
    disconnect,
    checkConnection,
    clearError,
    reset
  }
})

