import { supabase } from '../supabase';

export interface TelegramUser {
  id: string;
  user_id: string;
  chat_id: number;
  username?: string;
  first_name?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const telegramService = {
  /**
   * بررسی وضعیت اتصال تلگرام کاربر
   */
  async checkConnection(userId: string): Promise<TelegramUser | null> {
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    const { data, error } = await supabase
      .from('telegram_users')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows found
      throw error;
    }

    return data;
  },

  /**
   * ایجاد لینک اتصال تلگرام
   */
  generateConnectionLink(userId: string, botUsername: string = 'OilChengerReminderBot'): string {
    return `https://t.me/${botName}?start=${userId}`;
  },

  /**
   * قطع اتصال تلگرام
   */
  async disconnect(userId: string): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    const { error } = await supabase
      .from('telegram_users')
      .update({ is_active: false })
      .eq('user_id', userId);

    if (error) throw error;
  },

  /**
   * دریافت تمام اتصالات تلگرام کاربر (تاریخچه)
   */
  async getAllConnections(userId: string): Promise<TelegramUser[]> {
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    const { data, error } = await supabase
      .from('telegram_users')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * فعال کردن مجدد اتصال
   */
  async reactivate(userId: string, chatId: number): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    // غیرفعال کردن اتصالات قدیمی
    await supabase
      .from('telegram_users')
      .update({ is_active: false })
      .eq('user_id', userId);

    // فعال کردن اتصال جدید
    const { error } = await supabase
      .from('telegram_users')
      .update({ is_active: true })
      .eq('user_id', userId)
      .eq('chat_id', chatId);

    if (error) throw error;
  },

  /**
   * ارسال پیام تست به تلگرام
   */
  async sendTestMessage(userId: string): Promise<boolean> {
    const connection = await this.checkConnection(userId);
    
    if (!connection) {
      throw new Error('کاربر اتصال تلگرام ندارد');
    }

    // این تابع باید از طریق یک Edge Function یا API اجرا شود
    // نمی‌تواند مستقیماً به Telegram API وصل شود (محدودیت CORS)
    
    return true;
  }
};

