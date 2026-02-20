import { supabase } from './supabase';
import { isMock } from './config';
import { selectService } from './base/router';
import api from './api';
import type { Notification } from '../types';
import type { ApiResponse } from '../types';

/** در حالت mock یا وقتی user_id شبیه UUID نیست (مثلاً "1") به Supabase درخواست نزن. */
function shouldSkipSupabase(userId: string): boolean {
  return isMock() || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
}

/** Map Django notification response to shared Notification shape */
function mapDjangoNotification(raw: Record<string, unknown>): Notification {
  const userProfile = raw.user_profile as Record<string, unknown> | undefined;
  const vehicle = raw.vehicle as Record<string, unknown> | undefined;
  return {
    id: String(raw.id),
    user_id: String(userProfile?.id ?? (raw as any).user_profile_id ?? ''),
    vehicle_id: vehicle?.id != null ? Number(vehicle.id) : undefined,
    title: String(raw.title ?? ''),
    body: String(raw.body ?? ''),
    type: (raw.type as Notification['type']) ?? 'info',
    read: Boolean(raw.read),
    metadata: (raw.metadata as Notification['metadata']) ?? {},
    created_at: String(raw.created_at ?? ''),
    updated_at: String(raw.updated_at ?? ''),
  };
}

// ============================================
// MOCK IMPLEMENTATION
// ============================================
const notificationServiceMock = {
  async getNotifications(): Promise<Notification[]> {
    return [];
  },
  async markAsRead(): Promise<void> {},
  async markAllAsRead(): Promise<void> {},
  subscribeToNotifications(): null {
    return null;
  },
  async getUnreadCount(): Promise<number> {
    return 0;
  },
  async deleteNotification(): Promise<void> {},
  async getAllNotifications(): Promise<Notification[]> {
    return [];
  },
};

// ============================================
// SUPABASE IMPLEMENTATION
// ============================================
const notificationServiceSupabase = {
  /**
   * خواندن نوتیفیکیشن‌های کاربر
   * @param userId - شناسه کاربر
   * @param onlyUnread - فقط نوتیفیکیشن‌های خوانده نشده
   */
  async getNotifications(userId: string, onlyUnread: boolean = true): Promise<Notification[]> {
    if (shouldSkipSupabase(userId)) return [];
    if (!supabase) {
      throw new Error('Supabase client not available. Check VITE_BACKEND_TYPE and environment variables.');
    }

    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (onlyUnread) {
      query = query.eq('read', false);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  /**
   * علامت‌گذاری نوتیفیکیشن به عنوان خوانده‌شده
   * @param notificationId - شناسه نوتیفیکیشن
   */
  async markAsRead(notificationId: string): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase client not available. Check VITE_BACKEND_TYPE and environment variables.');
    }

    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) throw error;
  },

  /**
   * علامت‌گذاری همه نوتیفیکیشن‌ها به عنوان خوانده‌شده
   * @param userId - شناسه کاربر
   */
  async markAllAsRead(userId: string): Promise<void> {
    if (shouldSkipSupabase(userId)) return;
    if (!supabase) {
      throw new Error('Supabase client not available. Check VITE_BACKEND_TYPE and environment variables.');
    }

    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) throw error;
  },

  /**
   * گوش دادن به نوتیفیکیشن‌های جدید (Realtime)
   * @param userId - شناسه کاربر
   * @param callback - تابع callback برای نوتیفیکیشن‌های جدید
   */
  subscribeToNotifications(userId: string, callback: (notification: Notification) => void) {
    if (shouldSkipSupabase(userId)) return null;
    if (!supabase) {
      console.error('Supabase client not available. Realtime subscription will not work.');
      return null;
    }

    const channel = supabase
      .channel('public:notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          callback(payload.new as Notification);
        }
      )
      .subscribe();

    return channel;
  },

  /**
   * دریافت تعداد نوتیفیکیشن‌های خوانده نشده
   * @param userId - شناسه کاربر
   */
  async getUnreadCount(userId: string): Promise<number> {
    if (shouldSkipSupabase(userId)) return 0;
    if (!supabase) {
      throw new Error('Supabase client not available. Check VITE_BACKEND_TYPE and environment variables.');
    }

    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) throw error;
    return count || 0;
  },

  /**
   * حذف نوتیفیکیشن
   * @param notificationId - شناسه نوتیفیکیشن
   */
  async deleteNotification(notificationId: string): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase client not available. Check VITE_BACKEND_TYPE and environment variables.');
    }

    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) throw error;
  },

  /**
   * خواندن همه نوتیفیکیشن‌ها (خوانده شده و نشده)
   * @param userId - شناسه کاربر
   */
  async getAllNotifications(userId: string): Promise<Notification[]> {
    if (shouldSkipSupabase(userId)) return [];
    if (!supabase) {
      throw new Error('Supabase client not available. Check VITE_BACKEND_TYPE and environment variables.');
    }

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    return data || [];
  },
};

// ============================================
// DJANGO IMPLEMENTATION
// ============================================
const notificationServiceDjango = {
  async getNotifications(userId: string, onlyUnread: boolean = true): Promise<Notification[]> {
    const params = new URLSearchParams();
    if (onlyUnread) params.set('read', 'false');
    const url = params.toString() ? `/notifications/?${params}` : '/notifications/';
    const { data } = await api.get<ApiResponse<unknown[]>>(url);
    const list = (data?.data ?? []) as Record<string, unknown>[];
    return list.map(mapDjangoNotification);
  },

  async markAsRead(notificationId: string): Promise<void> {
    await api.post(`/notifications/${notificationId}/mark_as_read/`);
  },

  async markAllAsRead(): Promise<void> {
    await api.post('/notifications/mark_all_read/');
  },

  subscribeToNotifications(): null {
    return null;
  },

  async getUnreadCount(): Promise<number> {
    const { data } = await api.get<ApiResponse<{ count: number }>>('/notifications/unread_count/');
    return (data?.data?.count ?? 0) as number;
  },

  async deleteNotification(notificationId: string): Promise<void> {
    await api.delete(`/notifications/${notificationId}/`);
  },

  async getAllNotifications(): Promise<Notification[]> {
    const { data } = await api.get<ApiResponse<unknown[]>>('/notifications/');
    const list = (data?.data ?? []) as Record<string, unknown>[];
    return list.map(mapDjangoNotification);
  },
};

// ============================================
// EXPORTED SERVICE (Router)
// ============================================
export const notificationService = selectService(
  notificationServiceMock,
  notificationServiceSupabase,
  notificationServiceDjango
);

