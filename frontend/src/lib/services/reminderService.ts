import { supabase } from '../supabase';
import api from './api';
import type { Reminder, ReminderSettings, ApiResponse } from '../types';
import { selectService } from './base/router';
import type { IReminderService } from './base/types';

// ============================================
// MOCK IMPLEMENTATION
// ============================================
// استفاده: VITE_BACKEND_TYPE=mock
// ویژگی‌ها:
// - داده‌ها در memory (بعد از refresh از بین می‌روند)
// - مناسب برای تست و یادگیری
// - بدون نیاز به backend واقعی

const mockReminders: Reminder[] = [
  {
    id: '1',
    vehicleId: '1',
    vehicleName: 'پژو ۲۰۶',
    type: 'oil_change',
    status: 'near',
    dueKm: 87000,
    currentKm: 85000,
    lastServiceDate: '1403/09/15',
    lastServiceKm: 82000,
    message: 'تعویض روغن موتور تا ۲۰۰۰ کیلومتر دیگر',
    dismissed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    vehicleId: '2',
    vehicleName: 'سمند LX',
    type: 'oil_change',
    status: 'overdue',
    dueKm: 140000,
    currentKm: 142000,
    lastServiceDate: '1403/05/10',
    lastServiceKm: 135000,
    message: 'موعد تعویض روغن گذشته است! ۲۰۰۰ کیلومتر تأخیر',
    dismissed: false,
    createdAt: new Date().toISOString(),
  },
];

const reminderServiceMock: IReminderService = {
  async getAll(): Promise<Reminder[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockReminders.filter((r) => !r.dismissed);
  },

  async getById(id: string): Promise<Reminder> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const reminder = mockReminders.find((r) => r.id === id);
    if (!reminder) throw new Error('یادآور یافت نشد');
    return reminder;
  },

  async getByVehicle(vehicleId: string): Promise<Reminder[]> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return mockReminders.filter((r) => r.vehicleId === vehicleId && !r.dismissed);
  },

  async dismiss(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const reminder = mockReminders.find((r) => r.id === id);
    if (reminder) {
      reminder.dismissed = true;
    }
  },

  async getSettings(): Promise<ReminderSettings> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      kmInterval: 5000,
      timeIntervalMonths: 3,
      alertDaysBefore: 7,
      channels: ['inApp', 'email'],
    };
  },

  async updateSettings(settings: Partial<ReminderSettings>): Promise<ReminderSettings> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      kmInterval: settings.kmInterval ?? 5000,
      timeIntervalMonths: settings.timeIntervalMonths ?? 3,
      alertDaysBefore: settings.alertDaysBefore ?? 7,
      channels: settings.channels ?? ['inApp'],
    };
  },

  calculateStatus(
    currentKm: number,
    lastServiceKm: number,
    kmInterval: number,
    lastServiceDate: string,
    timeIntervalMonths: number,
    alertDaysBefore: number
  ): { status: 'ok' | 'near' | 'overdue'; dueKm: number; message: string } {
    const dueKm = lastServiceKm + kmInterval;
    const kmRemaining = dueKm - currentKm;
    const alertKmThreshold = 1000;

    if (kmRemaining <= 0) {
      return {
        status: 'overdue',
        dueKm,
        message: `موعد تعویض روغن گذشته است! ${Math.abs(kmRemaining).toLocaleString('fa-IR')} کیلومتر تأخیر`,
      };
    } else if (kmRemaining <= alertKmThreshold) {
      return {
        status: 'near',
        dueKm,
        message: `تعویض روغن تا ${kmRemaining.toLocaleString('fa-IR')} کیلومتر دیگر`,
      };
    } else {
      return {
        status: 'ok',
        dueKm,
        message: `سرویس بعدی در کیلومتر ${dueKm.toLocaleString('fa-IR')}`,
      };
    }
  },

  async refresh(): Promise<Reminder[]> {
    return this.getAll();
  },
};

// ============================================
// SUPABASE IMPLEMENTATION
// ============================================
// استفاده: VITE_BACKEND_TYPE=supabase
// نیاز به: VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY
// جداول: reminder_settings, reminder_logs, vehicles, services

const reminderServiceSupabase: IReminderService = {
  async getAll(): Promise<Reminder[]> {    if (!supabase) throw new Error('Supabase client not available. Check VITE_BACKEND_TYPE and environment variables.');    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('کاربر لاگین نشده است');

    // دریافت تمام خودروهای کاربر
    const { data: vehicles } = await supabase
      .from('vehicles')
      .select('vehicle_id, model, current_km')
      .eq('user_id', user.id);

    if (!vehicles || vehicles.length === 0) {
      return [];
    }

    const reminders: Reminder[] = [];

    // برای هر خودرو، یادآوری‌ها را محاسبه کن
    for (const vehicle of vehicles) {
      // دریافت تنظیمات یادآوری
      const { data: settings } = await supabase
        .from('reminder_settings')
        .select('*')
        .eq('vehicle_id', vehicle.vehicle_id)
        .single();

      if (!settings) continue;

      // دریافت آخرین سرویس
      const { data: lastService } = await supabase
        .from('services')
        .select('service_date, service_km, service_type')
        .eq('vehicle_id', vehicle.vehicle_id)
        .order('service_km', { ascending: false })
        .limit(1)
        .single();

      if (!lastService) continue;

      // محاسبه وضعیت
      const dueKm = lastService.service_km + settings.interval_km;
      const kmRemaining = dueKm - vehicle.current_km;
      const alertKmThreshold = settings.warning_km_before;

      let status: 'ok' | 'near' | 'overdue' = 'ok';
      let message = '';

      if (kmRemaining <= 0) {
        status = 'overdue';
        message = `موعد تعویض روغن گذشته است! ${Math.abs(kmRemaining).toLocaleString('fa-IR')} کیلومتر تأخیر`;
      } else if (kmRemaining <= alertKmThreshold) {
        status = 'near';
        message = `تعویض روغن تا ${kmRemaining.toLocaleString('fa-IR')} کیلومتر دیگر`;
      } else {
        message = `سرویس بعدی در کیلومتر ${dueKm.toLocaleString('fa-IR')}`;
      }

      reminders.push({
        id: `reminder-${vehicle.vehicle_id}`,
        vehicleId: vehicle.vehicle_id.toString(),
        vehicleName: vehicle.model,
        type: lastService.service_type as any,
        status,
        dueKm,
        currentKm: vehicle.current_km,
        lastServiceDate: lastService.service_date,
        lastServiceKm: lastService.service_km,
        message,
        dismissed: false,
        createdAt: new Date().toISOString(),
      });
    }

    return reminders.filter((r) => !r.dismissed);
  },

  async getById(id: string): Promise<Reminder> {
    // در Supabase، reminder ها dynamic هستند
    // پس باید از getAll استفاده کنیم
    const reminders = await this.getAll();
    const reminder = reminders.find((r) => r.id === id);
    if (!reminder) throw new Error('یادآور یافت نشد');
    return reminder;
  },

  async getByVehicle(vehicleId: string): Promise<Reminder[]> {
    const reminders = await this.getAll();
    return reminders.filter((r) => r.vehicleId === vehicleId);
  },

  async dismiss(id: string): Promise<void> {
    // در Supabase، می‌توانیم یک reminder_log ایجاد کنیم
    // یا از یک جدول dismissed_reminders استفاده کنیم
    // برای MVP، فقط در client-side dismiss می‌کنیم
    // TODO: پیاده‌سازی dismiss در Supabase
  },

  async getSettings(): Promise<ReminderSettings> {
    if (!supabase) throw new Error('Supabase client not available. Check VITE_BACKEND_TYPE and environment variables.');
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('کاربر لاگین نشده است');

    // دریافت تنظیمات اولین خودرو (برای MVP)
    // در production باید برای هر خودرو جداگانه باشد
    const { data: vehicle } = await supabase
      .from('vehicles')
      .select('vehicle_id')
      .eq('user_id', user.id)
      .limit(1)
      .single();

    if (!vehicle) {
      // تنظیمات پیش‌فرض
      return {
        kmInterval: 5000,
        timeIntervalMonths: 3,
        alertDaysBefore: 7,
        channels: ['inApp'],
      };
    }

    const { data: settings } = await supabase
      .from('reminder_settings')
      .select('*')
      .eq('vehicle_id', vehicle.vehicle_id)
      .single();

    if (!settings) {
      return {
        kmInterval: 5000,
        timeIntervalMonths: 3,
        alertDaysBefore: 7,
        channels: ['inApp'],
      };
    }

    const channels: ('inApp' | 'email' | 'sms')[] = [];
    if (settings.enable_email_reminder) channels.push('email');
    if (settings.enable_sms_reminder) channels.push('sms');
    if (channels.length === 0) channels.push('inApp');

    return {
      kmInterval: settings.interval_km,
      timeIntervalMonths: Math.floor(settings.interval_days / 30),
      alertDaysBefore: settings.warning_days_before,
      channels,
    };
  },

  async updateSettings(settings: Partial<ReminderSettings>): Promise<ReminderSettings> {
    if (!supabase) throw new Error('Supabase client not available. Check VITE_BACKEND_TYPE and environment variables.');
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('کاربر لاگین نشده است');

    // دریافت اولین خودرو
    const { data: vehicle } = await supabase
      .from('vehicles')
      .select('vehicle_id')
      .eq('user_id', user.id)
      .limit(1)
      .single();

    if (!vehicle) throw new Error('خودرویی یافت نشد');

    const updates: any = {};
    if (settings.kmInterval !== undefined) updates.interval_km = settings.kmInterval;
    if (settings.timeIntervalMonths !== undefined)
      updates.interval_days = settings.timeIntervalMonths * 30;
    if (settings.alertDaysBefore !== undefined)
      updates.warning_days_before = settings.alertDaysBefore;
    if (settings.channels !== undefined) {
      updates.enable_email_reminder = settings.channels.includes('email');
      updates.enable_sms_reminder = settings.channels.includes('sms');
    }

    const { data: updatedSettings, error } = await supabase
      .from('reminder_settings')
      .upsert({
        vehicle_id: vehicle.vehicle_id,
        ...updates,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    const channels: ('inApp' | 'email' | 'sms')[] = [];
    if (updatedSettings.enable_email_reminder) channels.push('email');
    if (updatedSettings.enable_sms_reminder) channels.push('sms');
    if (channels.length === 0) channels.push('inApp');

    return {
      kmInterval: updatedSettings.interval_km,
      timeIntervalMonths: Math.floor(updatedSettings.interval_days / 30),
      alertDaysBefore: updatedSettings.warning_days_before,
      channels,
    };
  },

  calculateStatus(
    currentKm: number,
    lastServiceKm: number,
    kmInterval: number,
    lastServiceDate: string,
    timeIntervalMonths: number,
    alertDaysBefore: number
  ): { status: 'ok' | 'near' | 'overdue'; dueKm: number; message: string } {
    const dueKm = lastServiceKm + kmInterval;
    const kmRemaining = dueKm - currentKm;
    const alertKmThreshold = 1000;

    if (kmRemaining <= 0) {
      return {
        status: 'overdue',
        dueKm,
        message: `موعد تعویض روغن گذشته است! ${Math.abs(kmRemaining).toLocaleString('fa-IR')} کیلومتر تأخیر`,
      };
    } else if (kmRemaining <= alertKmThreshold) {
      return {
        status: 'near',
        dueKm,
        message: `تعویض روغن تا ${kmRemaining.toLocaleString('fa-IR')} کیلومتر دیگر`,
      };
    } else {
      return {
        status: 'ok',
        dueKm,
        message: `سرویس بعدی در کیلومتر ${dueKm.toLocaleString('fa-IR')}`,
      };
    }
  },

  async refresh(): Promise<Reminder[]> {
    return this.getAll();
  },
};

// ============================================
// DJANGO IMPLEMENTATION (Placeholder)
// ============================================
// استفاده: VITE_BACKEND_TYPE=django
// نیاز به: VITE_DJANGO_API_URL
// API: Django REST Framework

const reminderServiceDjango: IReminderService = {
  async getAll(): Promise<Reminder[]> {
    const response = await api.get<ApiResponse<Reminder[]>>('/reminders/');
    return response.data.data;
  },

  async getById(id: string): Promise<Reminder> {
    const response = await api.get<ApiResponse<Reminder>>(`/reminders/${id}/`);
    return response.data.data;
  },

  async getByVehicle(vehicleId: string): Promise<Reminder[]> {
    const response = await api.get<ApiResponse<Reminder[]>>(`/reminders/vehicle/${vehicleId}/`);
    return response.data.data;
  },

  async dismiss(id: string): Promise<void> {
    await api.post(`/reminders/${id}/dismiss/`);
  },

  async getSettings(): Promise<ReminderSettings> {
    const response = await api.get<ApiResponse<ReminderSettings>>('/reminders/settings/');
    return response.data.data;
  },

  async updateSettings(settings: Partial<ReminderSettings>): Promise<ReminderSettings> {
    const response = await api.patch<ApiResponse<ReminderSettings>>(
      '/reminders/settings/',
      settings
    );
    return response.data.data;
  },

  calculateStatus(
    currentKm: number,
    lastServiceKm: number,
    kmInterval: number,
    lastServiceDate: string,
    timeIntervalMonths: number,
    alertDaysBefore: number
  ): { status: 'ok' | 'near' | 'overdue'; dueKm: number; message: string } {
    const dueKm = lastServiceKm + kmInterval;
    const kmRemaining = dueKm - currentKm;
    const alertKmThreshold = 1000;

    if (kmRemaining <= 0) {
      return {
        status: 'overdue',
        dueKm,
        message: `موعد تعویض روغن گذشته است! ${Math.abs(kmRemaining).toLocaleString('fa-IR')} کیلومتر تأخیر`,
      };
    } else if (kmRemaining <= alertKmThreshold) {
      return {
        status: 'near',
        dueKm,
        message: `تعویض روغن تا ${kmRemaining.toLocaleString('fa-IR')} کیلومتر دیگر`,
      };
    } else {
      return {
        status: 'ok',
        dueKm,
        message: `سرویس بعدی در کیلومتر ${dueKm.toLocaleString('fa-IR')}`,
      };
    }
  },

  async refresh(): Promise<Reminder[]> {
    return this.getAll();
  },
};

// ============================================
// EXPORTED SERVICE (Router)
// ============================================
// این service به صورت خودکار بر اساس VITE_BACKEND_TYPE
// یکی از implementations بالا را انتخاب می‌کند

export const reminderService = selectService(
  reminderServiceMock,
  reminderServiceSupabase,
  reminderServiceDjango
);
