import { supabase, api } from '@services/index'

const isDjango = () => import.meta.env.VITE_BACKEND_TYPE === 'django'
const isOfflineMode = () =>
  import.meta.env.VITE_OFFLINE_MODE === 'true' ||
  (typeof navigator !== 'undefined' && navigator.onLine === false)
const OFFLINE_TELEGRAM_ERROR = 'اتصال تلگرام در حالت آفلاین غیرفعال است.'

/**
 * سرویس مدیریت اتصال تلگرام (Django یا Supabase)
 */
export const telegramService = {
  /**
   * ایجاد لینک اتصال خودکار با کد یکتا
   * @param {string} userId - شناسه کاربر
   * @returns {Promise<string>} لینک اتصال به ربات تلگرام
   */
  async getTelegramLink(userId) {
    if (isOfflineMode()) {
      throw new Error(OFFLINE_TELEGRAM_ERROR)
    }
    if (isDjango()) {
      const listRes = await api.get('/telegram-settings/')
      const list = listRes.data?.data ?? []
      const existing = Array.isArray(list) ? list[0] : list
      if (existing?.chat_id && existing.is_enabled) {
        const botUsername = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'your_bot'
        return `https://t.me/${botUsername}`
      }
      const codeRes = await api.post('/telegram-settings/generate_code/')
      const connectionCode = codeRes.data?.connection_code
      const botUsername = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'your_bot'
      return connectionCode
        ? `https://t.me/${botUsername}?start=${connectionCode}`
        : `https://t.me/${botUsername}`
    }
    if (!supabase) {
      throw new Error('Supabase client not available. Check VITE_BACKEND_TYPE and environment variables.')
    }

    const { data: existing } = await supabase
      .from('telegram_settings')
      .select('chat_id, is_enabled')
      .eq('user_id', userId)
      .maybeSingle()

    if (existing?.chat_id && existing.is_enabled) {
      const botUsername = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'your_bot'
      return `https://t.me/${botUsername}`
    }

    const connectionCode = Math.random().toString(36).substring(2, 10).toUpperCase()
    const { error } = await supabase
      .from('telegram_settings')
      .upsert({
        user_id: userId,
        connection_code: connectionCode,
        is_enabled: false,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })

    if (error) throw error
    const botUsername = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'your_bot'
    return `https://t.me/${botUsername}?start=${connectionCode}`
  },

  /**
   * چک کردن وضعیت اتصال
   * @param {string} userId - شناسه کاربر
   * @returns {Promise<boolean>} true اگر متصل باشد
   */
  async checkConnection(userId) {
    if (isOfflineMode()) {
      return false
    }
    if (isDjango()) {
      const res = await api.get('/telegram-settings/')
      const list = res.data?.data ?? []
      const data = Array.isArray(list) ? list[0] : list
      return !!(data?.chat_id && data.is_enabled)
    }
    if (!supabase) {
      throw new Error('Supabase client not available. Check VITE_BACKEND_TYPE and environment variables.')
    }
    const { data, error } = await supabase
      .from('telegram_settings')
      .select('chat_id, is_enabled')
      .eq('user_id', userId)
      .maybeSingle()
    if (error) throw error
    return !!(data?.chat_id && data.is_enabled)
  },

  /**
   * دریافت تنظیمات کامل تلگرام
   * @param {string} userId - شناسه کاربر
   * @returns {Promise<Object|null>} تنظیمات تلگرام
   */
  async getSettings(userId) {
    if (isOfflineMode()) {
      return null
    }
    if (isDjango()) {
      const res = await api.get('/telegram-settings/')
      const list = res.data?.data ?? []
      return Array.isArray(list) ? list[0] ?? null : list
    }
    if (!supabase) {
      throw new Error('Supabase client not available. Check VITE_BACKEND_TYPE and environment variables.')
    }
    const { data, error } = await supabase
      .from('telegram_settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()
    if (error) throw error
    return data
  },

  /**
   * فعال/غیرفعال کردن تلگرام
   * @param {string} userId - شناسه کاربر
   * @param {boolean} enabled - وضعیت فعال/غیرفعال
   */
  async toggleTelegram(userId, enabled) {
    if (isOfflineMode()) {
      throw new Error(OFFLINE_TELEGRAM_ERROR)
    }
    if (isDjango()) {
      const listRes = await api.get('/telegram-settings/')
      const list = listRes.data?.data ?? []
      const setting = Array.isArray(list) ? list[0] : list
      if (setting?.id) {
        await api.patch(`/telegram-settings/${setting.id}/`, { is_enabled: enabled })
      }
      return
    }
    if (!supabase) {
      throw new Error('Supabase client not available. Check VITE_BACKEND_TYPE and environment variables.')
    }
    const { error } = await supabase
      .from('telegram_settings')
      .upsert({
        user_id: userId,
        is_enabled: enabled,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })
    if (error) throw error
  },

  /**
   * قطع اتصال تلگرام
   * @param {string} userId - شناسه کاربر
   */
  async disconnect(userId) {
    if (isOfflineMode()) {
      throw new Error(OFFLINE_TELEGRAM_ERROR)
    }
    if (isDjango()) {
      const listRes = await api.get('/telegram-settings/')
      const list = listRes.data?.data ?? []
      const setting = Array.isArray(list) ? list[0] : list
      if (setting?.id) {
        await api.patch(`/telegram-settings/${setting.id}/`, {
          is_enabled: false,
          chat_id: null,
          connection_code: null
        })
      }
      return
    }
    if (!supabase) {
      throw new Error('Supabase client not available. Check VITE_BACKEND_TYPE and environment variables.')
    }
    const { error } = await supabase
      .from('telegram_settings')
      .update({
        is_enabled: false,
        chat_id: null,
        connection_code: null,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
    if (error) throw error
  },

  /**
   * دریافت وضعیت اتصال برای نمایش در UI
   * @param {string} userId - شناسه کاربر
   * @returns {Promise<Object>} وضعیت اتصال
   */
  async getConnectionStatus(userId) {
    if (isOfflineMode()) {
      return { isConnected: false, hasCode: false, chatId: null, code: null }
    }
    if (isDjango()) {
      const res = await api.get('/telegram-settings/')
      const list = res.data?.data ?? []
      const data = Array.isArray(list) ? list[0] : list
      if (!data) {
        return { isConnected: false, hasCode: false, chatId: null, code: null }
      }
      return {
        isConnected: !!(data.chat_id && data.is_enabled),
        hasCode: !!data.connection_code,
        chatId: data.chat_id || null,
        code: data.connection_code || null
      }
    }
    if (!supabase) {
      throw new Error('Supabase client not available. Check VITE_BACKEND_TYPE and environment variables.')
    }
    const { data, error } = await supabase
      .from('telegram_settings')
      .select('chat_id, connection_code, is_enabled')
      .eq('user_id', userId)
      .maybeSingle()
    if (error) throw error
    if (!data) {
      return { isConnected: false, hasCode: false, chatId: null, code: null }
    }
    return {
      isConnected: !!(data.chat_id && data.is_enabled),
      hasCode: !!data.connection_code,
      chatId: data.chat_id || null,
      code: data.connection_code || null
    }
  }
}

