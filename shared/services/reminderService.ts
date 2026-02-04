import { supabase } from './supabase';
import api from './api';
import type { Reminder, ReminderSettings, ReminderCreateData, ApiResponse } from '../types';
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
    userId: 'mock-user',
    vehicleId: '1',
    vehicleName: 'پژو ۲۰۶',
    title: 'یادآوری سرویس دوره‌ای',
    description: 'تعویض روغن موتور',
    type: 'oil_change',
    status: 'near',
    dueKm: 87000,
    currentKm: 85000,
    lastServiceDate: '1403/09/15',
    lastServiceKm: 82000,
    warningDaysBefore: 7,
    message: 'تعویض روغن موتور تا ۲۰۰۰ کیلومتر دیگر',
    source: 'auto',
    dismissed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    userId: 'mock-user',
    vehicleId: '2',
    vehicleName: 'سمند LX',
    title: 'یادآوری سرویس دوره‌ای',
    description: 'تعویض روغن موتور',
    type: 'oil_change',
    status: 'overdue',
    dueKm: 140000,
    currentKm: 142000,
    lastServiceDate: '1403/05/10',
    lastServiceKm: 135000,
    warningDaysBefore: 7,
    message: 'موعد تعویض روغن گذشته است! ۲۰۰۰ کیلومتر تأخیر',
    source: 'auto',
    dismissed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    userId: 'mock-user',
    title: 'پرداخت قسط خودرو',
    description: 'قسط ماهانه ۵,۰۰۰,۰۰۰ تومان',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'near',
    warningDaysBefore: 2,
    message: '۲ روز دیگر سررسید قسط خودرو',
    source: 'manual',
    dismissed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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

  async create(data: ReminderCreateData): Promise<Reminder> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const newReminder: Reminder = {
      id: String(Date.now()),
      userId: 'mock-user',
      vehicleId: data.vehicleId,
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      dueKm: data.dueKm,
      warningDaysBefore: data.warningDaysBefore || 7,
      status: 'ok',
      message: data.description || data.title,
      source: data.source || 'manual',
      dismissed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockReminders.push(newReminder);
    return newReminder;
  },

  async getUserReminders(): Promise<Reminder[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockReminders.filter((r) => r.userId === 'mock-user' && !r.dismissed);
  },

  async delete(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = mockReminders.findIndex((r) => r.id === id);
    if (index !== -1) {
      mockReminders.splice(index, 1);
    }
  },

  async update(id: string, data: Partial<ReminderCreateData>): Promise<Reminder> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const index = mockReminders.findIndex((r) => r.id === id);
    if (index === -1) throw new Error('یادآور یافت نشد');

    const reminder = mockReminders[index];
    const updatedReminder: Reminder = {
      ...reminder,
      ...(data.title && { title: data.title }),
      ...(data.description && { description: data.description }),
      ...(data.vehicleId !== undefined && { vehicleId: data.vehicleId }),
      ...(data.dueDate !== undefined && { dueDate: data.dueDate }),
      ...(data.dueKm !== undefined && { dueKm: data.dueKm }),
      ...(data.warningDaysBefore !== undefined && { warningDaysBefore: data.warningDaysBefore }),
      ...(data.source !== undefined && { source: data.source }),
      updatedAt: new Date().toISOString(),
    };

    mockReminders[index] = updatedReminder;
    return updatedReminder;
  },
};

// ============================================
// SUPABASE IMPLEMENTATION
// ============================================
// استفاده: VITE_BACKEND_TYPE=supabase
// نیاز به: VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY
// جداول: reminder_settings, reminder_logs, vehicles, services

const reminderServiceSupabase: IReminderService = {
  async getAll(): Promise<Reminder[]> {
    if (!supabase) throw new Error('Supabase client not available. Check VITE_BACKEND_TYPE and environment variables.');
    
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('کاربر لاگین نشده است');

    const reminders: Reminder[] = [];

    // 1. دریافت یادآورهای دستی (manual reminders) از جدول reminders
    const { data: manualReminders, error: manualError } = await supabase
      .from('reminders')
      .select(`
        id,
        user_id,
        vehicle_id,
        service_id,
        title,
        description,
        due_date,
        due_km,
        warning_days_before,
        warning_km_before,
        status,
        message,
        source,
        dismissed,
        type,
        created_at,
        updated_at,
        vehicles(model)
      `)
      .eq('user_id', user.id)
      .eq('dismissed', false)
      .order('created_at', { ascending: false });

    if (manualError) {
      console.error('[REMINDER-SERVICE] Error fetching manual reminders:', manualError);
    } else if (manualReminders) {
      // تبدیل یادآورهای دستی به فرمت Reminder
      for (const reminder of manualReminders) {
        // دریافت کیلومتر فعلی خودرو
        let currentKm = 0;
        let vehicleName = undefined;
        if (reminder.vehicle_id) {
          const { data: vehicle } = await supabase
            .from('vehicles')
            .select('current_km, model')
            .eq('vehicle_id', reminder.vehicle_id)
            .maybeSingle();
          currentKm = vehicle?.current_km || 0;
          vehicleName = vehicle?.model;
        }

        reminders.push({
          id: reminder.id,
          userId: reminder.user_id,
          vehicleId: reminder.vehicle_id?.toString(),
          vehicleName: vehicleName || reminder.vehicles?.model,
          serviceId: reminder.service_id?.toString(),
          title: reminder.title,
          description: reminder.description || undefined,
          dueDate: reminder.due_date || undefined,
          dueKm: reminder.due_km || undefined,
          warningDaysBefore: reminder.warning_days_before || 7,
          warningKmBefore: reminder.warning_km_before || undefined,
          status: (reminder.status as 'ok' | 'near' | 'overdue') || 'ok',
          message: reminder.message || reminder.title,
          source: (reminder.source as 'manual' | 'auto') || 'manual',
          dismissed: reminder.dismissed || false,
          type: reminder.type || undefined,
          currentKm: currentKm,
          createdAt: reminder.created_at || new Date().toISOString(),
          updatedAt: reminder.updated_at || new Date().toISOString(),
        });
      }
    }

    // 2. دریافت یادآورهای خودکار (dynamic reminders) از reminder_settings
    const { data: vehicles } = await supabase
      .from('vehicles')
      .select('vehicle_id, model, current_km')
      .eq('user_id', user.id);

    if (vehicles && vehicles.length > 0) {
      for (const vehicle of vehicles) {
        // دریافت تنظیمات یادآوری
        const { data: settings, error: settingsError } = await supabase
          .from('reminder_settings')
          .select('*')
          .eq('vehicle_id', vehicle.vehicle_id)
          .maybeSingle();
        
        if (settingsError && settingsError.code !== 'PGRST116') {
          console.error(`[REMINDER-SERVICE] Settings error for vehicle ${vehicle.vehicle_id}:`, settingsError);
        }
        
        if (!settings) {
          continue;
        }

        // دریافت آخرین سرویس
        const { data: lastService, error: lastServiceError } = await supabase
          .from('services')
          .select('service_date, service_km, service_type')
          .eq('vehicle_id', vehicle.vehicle_id)
          .order('service_km', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (lastServiceError && lastServiceError.code !== 'PGRST116') {
          console.error(`[REMINDER-SERVICE] Last service error for vehicle ${vehicle.vehicle_id}:`, lastServiceError);
        }

        if (!lastService) {
          continue;
        }

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
          userId: user.id,
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
          source: 'auto',
          warningDaysBefore: settings.warning_days_before || 7,
          createdAt: new Date().toISOString(),
        });
      }
    }

    return reminders.filter((r) => !r.dismissed);
  },

  async getById(id: string): Promise<Reminder> {
    if (!supabase) throw new Error('Supabase client not available.');
    
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('کاربر لاگین نشده است');

    // اگر id با "reminder-" شروع می‌شود، یک یادآور خودکار است
    if (id.startsWith('reminder-')) {
      const reminders = await this.getAll();
      const reminder = reminders.find((r) => r.id === id);
      if (!reminder) throw new Error('یادآور یافت نشد');
      return reminder;
    }

    // در غیر این صورت، یک یادآور دستی است - از جدول reminders بگیر
    const { data: reminder, error } = await supabase
      .from('reminders')
      .select(`
        id,
        user_id,
        vehicle_id,
        service_id,
        title,
        description,
        due_date,
        due_km,
        warning_days_before,
        warning_km_before,
        status,
        message,
        source,
        dismissed,
        type,
        created_at,
        updated_at,
        vehicles(model)
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!reminder) throw new Error('یادآور یافت نشد');

    // دریافت کیلومتر فعلی خودرو
    let currentKm = 0;
    let vehicleName = undefined;
    if (reminder.vehicle_id) {
      const { data: vehicle } = await supabase
        .from('vehicles')
        .select('current_km, model')
        .eq('vehicle_id', reminder.vehicle_id)
        .maybeSingle();
      currentKm = vehicle?.current_km || 0;
      vehicleName = vehicle?.model;
    }

    return {
      id: reminder.id,
      userId: reminder.user_id,
      vehicleId: reminder.vehicle_id?.toString(),
      vehicleName: vehicleName || reminder.vehicles?.model,
      serviceId: reminder.service_id?.toString(),
      title: reminder.title,
      description: reminder.description || undefined,
      dueDate: reminder.due_date || undefined,
      dueKm: reminder.due_km || undefined,
      warningDaysBefore: reminder.warning_days_before || 7,
      warningKmBefore: reminder.warning_km_before || undefined,
      status: (reminder.status as 'ok' | 'near' | 'overdue') || 'ok',
      message: reminder.message || reminder.title,
      source: (reminder.source as 'manual' | 'auto') || 'manual',
      dismissed: reminder.dismissed || false,
      type: reminder.type || undefined,
      currentKm: currentKm,
      createdAt: reminder.created_at || new Date().toISOString(),
      updatedAt: reminder.updated_at || new Date().toISOString(),
    };
  },

  async getByVehicle(vehicleId: string): Promise<Reminder[]> {
    const reminders = await this.getAll();
    return reminders.filter((r) => r.vehicleId === vehicleId);
  },

  async dismiss(id: string): Promise<void> {
    if (!supabase) throw new Error('Supabase client not available.');
    
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('کاربر لاگین نشده است');

    const { error } = await supabase
      .from('reminders')
      .update({ dismissed: true })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw new Error(error.message);
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
      .maybeSingle();

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
      .maybeSingle();

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
      .maybeSingle();

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

  async create(data: ReminderCreateData): Promise<Reminder> {
    if (!supabase) throw new Error('Supabase client not available. Check VITE_BACKEND_TYPE and environment variables.');
    
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('کاربر لاگین نشده است');

    // تولید پیام
    let message = data.title;
    if (data.description) message += ` - ${data.description}`;
    if (data.dueDate) {
      const days = Math.ceil((new Date(data.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      message += ` (${days} روز دیگر)`;
    }
    if (data.dueKm) {
      message += ` (${data.dueKm} کیلومتر)`;
    }

    const { data: newReminder, error } = await supabase
      .from('reminders')
      .insert({
        user_id: user.id,
        vehicle_id: data.vehicleId,
        service_id: data.serviceId,
        title: data.title,
        description: data.description,
        due_date: data.dueDate,
        due_km: data.dueKm,
        warning_days_before: data.warningDaysBefore || 7,
        warning_km_before: data.warningKmBefore || 500,
        type: data.type || null,
        message,
        source: data.source || 'manual',
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return newReminder;
  },

  async getUserReminders(): Promise<Reminder[]> {
    if (!supabase) throw new Error('Supabase client not available.');
    
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('کاربر لاگین نشده است');

    const { data: reminders, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return reminders || [];
  },

  async delete(id: string): Promise<void> {
    if (!supabase) throw new Error('Supabase client not available.');
    
    const { error } = await supabase
      .from('reminders')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  async update(id: string, data: Partial<ReminderCreateData>): Promise<Reminder> {
    if (!supabase) throw new Error('Supabase client not available.');
    
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('کاربر لاگین نشده است');

    // Get current reminder to verify ownership
    const { data: current } = await supabase
      .from('reminders')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (!current) throw new Error('یادآور یافت نشد یا دسترسی غیرمجاز');

    // Update data
    const updates: any = {
      updated_at: new Date().toISOString(),
    };

    if (data.title) updates.title = data.title;
    if (data.description !== undefined) updates.description = data.description;
    if (data.vehicleId !== undefined) updates.vehicle_id = data.vehicleId;
    if (data.serviceId !== undefined) updates.service_id = data.serviceId;
    if (data.dueDate !== undefined) updates.due_date = data.dueDate;
    if (data.dueKm !== undefined) updates.due_km = data.dueKm;
    if (data.warningDaysBefore !== undefined) updates.warning_days_before = data.warningDaysBefore;
    if (data.warningKmBefore !== undefined) updates.warning_km_before = data.warningKmBefore;
    if (data.type !== undefined) updates.type = data.type;
    if (data.source !== undefined) updates.source = data.source;

    // Recalculate message if needed
    if (data.dueDate || data.dueKm) {
      const days = data.dueDate ? Math.ceil((new Date(data.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
      let message = data.title || current.title;
      if (days) message += ` (${days} روز دیگر)`;
      if (data.dueKm) message += ` (${data.dueKm} کیلومتر)`;
      updates.message = message;
    }

    const { data: updatedReminder, error } = await supabase
      .from('reminders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return updatedReminder;
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

  async create(data: ReminderCreateData): Promise<Reminder> {
    const response = await api.post<ApiResponse<Reminder>>('/reminders/', data);
    return response.data.data;
  },

  async getUserReminders(): Promise<Reminder[]> {
    const response = await api.get<ApiResponse<Reminder[]>>('/reminders/user/');
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/reminders/${id}/`);
  },

  async update(id: string, data: Partial<ReminderCreateData>): Promise<Reminder> {
    const response = await api.patch<ApiResponse<Reminder>>(`/reminders/${id}/`, data);
    return response.data.data;
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
