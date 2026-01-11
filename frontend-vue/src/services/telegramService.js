import { supabase } from '@services/supabase'

/**
 * سرویس مدیریت اتصال تلگرام
 * این سرویس برای اتصال کاربران به ربات تلگرام و دریافت یادآوری‌ها استفاده می‌شود
 */
export const telegramService = {
  /**
   * ایجاد لینک اتصال خودکار با کد یکتا
   * @param {string} userId - شناسه کاربر
   * @returns {Promise<string>} لینک اتصال به ربات تلگرام
   */
  async getTelegramLink(userId) {
    if (!supabase) {
      throw new Error('Supabase client not available. Check VITE_BACKEND_TYPE and environment variables.')
    }

    // چک کردن اینکه کاربر قبلاً متصل بوده یا نه
    const { data: existing } = await supabase
      .from('telegram_settings')
      .select('chat_id, is_enabled')
      .eq('user_id', userId)
      .maybeSingle()

    if (existing?.chat_id && existing.is_enabled) {
      const botUsername = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'your_bot'
      return `https://t.me/${botUsername}`
    }

    // ایجاد کد یکتا برای اتصال (8 کاراکتر)
    const connectionCode = Math.random().toString(36).substring(2, 10).toUpperCase()
    
    // ذخیره کد در دیتابیس
    const { error } = await supabase
      .from('telegram_settings')
      .upsert({
        user_id: userId,
        connection_code: connectionCode,
        is_enabled: false,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })

    if (error) throw error

    // ساخت لینک با کد
    const botUsername = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'your_bot'
    return `https://t.me/${botUsername}?start=${connectionCode}`
  },

  /**
   * چک کردن وضعیت اتصال
   * @param {string} userId - شناسه کاربر
   * @returns {Promise<boolean>} true اگر متصل باشد
   */
  async checkConnection(userId) {
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
    if (!supabase) {
      throw new Error('Supabase client not available. Check VITE_BACKEND_TYPE and environment variables.')
    }

    const { error } = await supabase
      .from('telegram_settings')
      .upsert({
        user_id: userId,
        is_enabled: enabled,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })

    if (error) throw error
  },

  /**
   * قطع اتصال تلگرام
   * @param {string} userId - شناسه کاربر
   */
  async disconnect(userId) {
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
      return { 
        isConnected: false, 
        hasCode: false,
        chatId: null,
        code: null
      }
    }

    return {
      isConnected: !!(data.chat_id && data.is_enabled),
      hasCode: !!data.connection_code,
      chatId: data.chat_id || null,
      code: data.connection_code || null
    }
  }
}

