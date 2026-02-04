import { supabase } from './supabase';
import api from './api';
import type { ServiceRecord, ServiceFormData, ApiResponse, ServiceType } from '../types';
import { selectService } from './base/router';
import type { IServiceService } from './base/types';
import { parseJalaliDate, formatJalaliDate } from '../utils/format';
import { vehicleService } from './vehicleService';

// ============================================
// MOCK IMPLEMENTATION
// ============================================
// استفاده: VITE_BACKEND_TYPE=mock
// ویژگی‌ها:
// - داده‌ها در memory (بعد از refresh از بین می‌روند)
// - مناسب برای تست و یادگیری
// - بدون نیاز به backend واقعی

const mockServices: ServiceRecord[] = [
  {
    id: '1',
    vehicleId: '1',
    date: '1403/09/15',
    km: 82000,
    cost: 1500000,
    type: 'oil_change',
    note: 'روغن موتور شل هلیکس',
    createdAt: '2024-12-05',
    updatedAt: '2024-12-05',
  },
  {
    id: '2',
    vehicleId: '1',
    date: '1403/06/10',
    km: 77000,
    cost: 800000,
    type: 'filter',
    note: 'فیلتر هوا و روغن',
    createdAt: '2024-08-31',
    updatedAt: '2024-08-31',
  },
  {
    id: '3',
    vehicleId: '2',
    date: '1403/08/20',
    km: 140000,
    cost: 2500000,
    type: 'brakes',
    note: 'تعویض لنت جلو',
    createdAt: '2024-11-10',
    updatedAt: '2024-11-10',
  },
];

const serviceServiceMock: IServiceService = {
  async getAll(vehicleId?: string): Promise<ServiceRecord[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (vehicleId) {
      return mockServices.filter((s) => s.vehicleId === vehicleId);
    }
    return [...mockServices];
  },

  async getById(id: string): Promise<ServiceRecord> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const service = mockServices.find((s) => s.id === id);
    if (!service) throw new Error('سرویس یافت نشد');
    return service;
  },

  async create(data: ServiceFormData): Promise<ServiceRecord> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const newService: ServiceRecord = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockServices.unshift(newService);
    
    // ثبت کیلومتر در تاریخچه
    if (data.km) {
      const typesText = data.types && data.types.length > 0 
        ? data.types.join(', ') 
        : (data.type || 'سرویس');
      await vehicleService.addKmHistory(
        data.vehicleId,
        data.km,
        'service',
        newService.id,
        `سرویس: ${typesText}`
      );
    }
    
    return newService;
  },

  async update(id: string, data: Partial<ServiceFormData>): Promise<ServiceRecord> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const index = mockServices.findIndex((s) => s.id === id);
    if (index === -1) throw new Error('سرویس یافت نشد');

    mockServices[index] = {
      ...mockServices[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return mockServices[index];
  },

  async delete(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const index = mockServices.findIndex((s) => s.id === id);
    if (index !== -1) {
      mockServices.splice(index, 1);
    }
  },

  async getLatestForVehicle(vehicleId: string): Promise<ServiceRecord | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const services = mockServices
      .filter((s) => s.vehicleId === vehicleId)
      .sort((a, b) => b.km - a.km);
    return services[0] || null;
  },
};

// ============================================
// SUPABASE IMPLEMENTATION
// ============================================
// استفاده: VITE_BACKEND_TYPE=supabase
// نیاز به: VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY
// جدول: services

const serviceServiceSupabase: IServiceService = {
  async getAll(vehicleId?: string): Promise<ServiceRecord[]> {
    if (!supabase) throw new Error('Supabase client not available. Check VITE_BACKEND_TYPE and environment variables.');
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('کاربر لاگین نشده است');

    let query = supabase
      .from('services')
      .select(
        `
        *,
        vehicle:vehicles!inner(user_id)
      `
      )
      .eq('vehicles.user_id', user.id)
      .order('service_date_gregorian', { ascending: false });

    if (vehicleId) {
      query = query.eq('vehicle_id', parseInt(vehicleId));
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    return (data || []).map((s: any) => ({
      id: s.service_id.toString(),
      vehicleId: s.vehicle_id.toString(),
      // تبدیل تاریخ میلادی به شمسی برای نمایش در UI
      date: s.service_date_gregorian
        ? formatJalaliDate(s.service_date_gregorian)
        : formatJalaliDate(s.service_date),
      km: s.service_km,
      cost: s.cost,
      type: s.service_type as any,
      note: s.description || undefined,
      createdAt: s.created_at,
      updatedAt: s.updated_at,
    }));
  },

  async getById(id: string): Promise<ServiceRecord> {
    if (!supabase) throw new Error('Supabase client not available. Check VITE_BACKEND_TYPE and environment variables.');
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('کاربر لاگین نشده است');

    const { data, error } = await supabase
      .from('services')
      .select(
        `
        *,
        vehicle:vehicles!inner(user_id)
      `
      )
      .eq('service_id', id)
      .eq('vehicles.user_id', user.id)
      .single();

    if (error) throw new Error(error.message);

    // Fetch service items
    const { data: items } = await supabase
      .from('service_items')
      .select('service_type_code, cost, description')
      .eq('service_id', parseInt(id));

    const serviceItems = (items || []).map((item: any) => ({
      type: item.service_type_code as ServiceType,
      cost: item.cost,
      description: item.description || undefined,
    }));

    const serviceData = data as any;
    const types = serviceItems.length > 0
      ? serviceItems.map(item => item.type)
      : [serviceData.service_type as ServiceType];

    return {
      id: serviceData.service_id.toString(),
      vehicleId: serviceData.vehicle_id.toString(),
      date: serviceData.service_date_gregorian
        ? formatJalaliDate(serviceData.service_date_gregorian)
        : formatJalaliDate(serviceData.service_date),
      km: serviceData.service_km,
      cost: serviceData.total_cost || serviceData.cost,
      type: serviceData.service_type as any,
      types: types,
      items: serviceItems.length > 0 ? serviceItems : undefined,
      note: serviceData.description || undefined,
      createdAt: serviceData.created_at,
      updatedAt: serviceData.updated_at,
    };
  },

  async create(data: ServiceFormData): Promise<ServiceRecord> {
    if (!supabase) throw new Error('Supabase client not available. Check VITE_BACKEND_TYPE and environment variables.');
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('کاربر لاگین نشده است');

    // تبدیل تاریخ شمسی به میلادی
    let serviceDateGregorian: string;
    try {
      const gregorianDate = parseJalaliDate(data.date);
      serviceDateGregorian = gregorianDate.toISOString().split('T')[0];
    } catch (error) {
      // اگر تبدیل ناموفق بود، از تاریخ امروز استفاده می‌کنیم
      serviceDateGregorian = new Date().toISOString().split('T')[0];
    }

    // استفاده از types اگر موجود باشد، در غیر این صورت از type
    const serviceTypes = data.types && data.types.length > 0 ? data.types : [data.type];
    const primaryType = serviceTypes[0] || data.type;

    // محاسبه total_cost از items اگر موجود باشد، در غیر این صورت از cost
    const totalCost = data.items && data.items.length > 0
      ? data.items.reduce((sum, item) => sum + item.cost, 0)
      : data.cost;

    // ایجاد سرویس اصلی
    const { data: newService, error: serviceError } = await supabase
      .from('services')
      .insert({
        vehicle_id: parseInt(data.vehicleId),
        service_date: serviceDateGregorian,
        service_date_gregorian: serviceDateGregorian,
        service_km: data.km,
        cost: totalCost,
        total_cost: totalCost,
        service_type: primaryType,
        description: data.note || null,
        general_note: data.note || null,
      } as any)
      .select()
      .single();

    if (serviceError) throw new Error(serviceError.message);

    const newServiceData = newService as any;
    const serviceId = newServiceData.service_id;

    // ایجاد service_items برای هر نوع سرویس
    if (serviceTypes.length > 0) {
      // فیلتر کردن service types تکراری
      const uniqueServiceTypes = [...new Set(serviceTypes)];
      
      const itemsToInsert = data.items && data.items.length > 0
        ? data.items
            .filter(item => item.type && item.cost !== undefined)
            .map(item => ({
              service_id: serviceId,
              service_type_code: item.type,
              cost: Math.max(0, Math.floor(item.cost || 0)),
              description: item.description || null,
            }))
        : uniqueServiceTypes
            .filter(type => type) // فیلتر کردن مقادیر null/undefined
            .map(type => ({
              service_id: serviceId,
              service_type_code: type,
              cost: Math.max(0, Math.floor(totalCost / uniqueServiceTypes.length)), // تقسیم هزینه به صورت مساوی
              description: null,
            }));

      // بررسی اینکه آیا itemsToInsert خالی نیست
      if (itemsToInsert.length > 0) {
        // بررسی اینکه آیا service_id معتبر است
        if (!serviceId || isNaN(Number(serviceId))) {
          await supabase.from('services').delete().eq('service_id', serviceId);
          throw new Error('شناسه سرویس معتبر نیست');
        }

        const { error: itemsError, data: insertedItems } = await supabase
          .from('service_items')
          .insert(itemsToInsert)
          .select();

        if (itemsError) {
          // اگر insert items ناموفق بود، سرویس را حذف می‌کنیم
          await supabase.from('services').delete().eq('service_id', serviceId);
          console.error('Error inserting service items:', itemsError);
          console.error('Items to insert:', JSON.stringify(itemsToInsert, null, 2));
          console.error('Service ID:', serviceId);
          console.error('Service Types:', serviceTypes);
          throw new Error(`خطا در ثبت اقلام سرویس: ${itemsError.message} (کد خطا: ${itemsError.code || 'unknown'})`);
        }
      }
    }

    // Fetch service items for response
    const { data: serviceItems } = await supabase
      .from('service_items')
      .select('service_type_code, cost, description')
      .eq('service_id', serviceId);

    const items = serviceItems?.map((item: any) => ({
      type: item.service_type_code as ServiceType,
      cost: item.cost,
      description: item.description || undefined,
    })) || [];

    // ثبت کیلومتر در تاریخچه
    if (data.km) {
      const typesText = serviceTypes.join(', ');
      try {
        await vehicleService.addKmHistory(
          data.vehicleId,
          data.km,
          'service',
          serviceId.toString(),
          `سرویس: ${typesText}`
        );
      } catch (error) {
        // Log error but don't fail the service creation
        console.error('Failed to add KM history:', error);
      }
    }

    return {
      id: newServiceData.service_id.toString(),
      vehicleId: newServiceData.vehicle_id.toString(),
      date: newServiceData.service_date_gregorian
        ? formatJalaliDate(newServiceData.service_date_gregorian)
        : formatJalaliDate(newServiceData.service_date),
      km: newServiceData.service_km,
      cost: newServiceData.total_cost || newServiceData.cost,
      type: primaryType as any,
      types: serviceTypes as ServiceType[],
      items: items,
      note: newServiceData.description || undefined,
      createdAt: newServiceData.created_at,
      updatedAt: newServiceData.updated_at,
    };
  },

  async update(id: string, data: Partial<ServiceFormData>): Promise<ServiceRecord> {
    if (!supabase) throw new Error('Supabase client not available. Check VITE_BACKEND_TYPE and environment variables.');
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('کاربر لاگین نشده است');

    const updates: any = {};
    if (data.date !== undefined) {
      // تبدیل تاریخ شمسی به میلادی
      try {
        const gregorianDate = parseJalaliDate(data.date);
        const serviceDateGregorian = gregorianDate.toISOString().split('T')[0];
        updates.service_date = serviceDateGregorian;
        updates.service_date_gregorian = serviceDateGregorian;
      } catch (error) {
        // اگر تبدیل ناموفق بود، از تاریخ امروز استفاده می‌کنیم
        const today = new Date().toISOString().split('T')[0];
        updates.service_date = today;
        updates.service_date_gregorian = today;
      }
    }
    if (data.km !== undefined) updates.service_km = data.km;
    if (data.cost !== undefined) updates.cost = data.cost;
    if (data.type !== undefined) updates.service_type = data.type;
    if (data.note !== undefined) updates.description = data.note || null;

    const { data: updatedService, error } = await supabase
      .from('services')
      // @ts-ignore - Supabase type inference issue with dynamic updates
      .update(updates)
      .eq('service_id', id)
      .select(
        `
        *,
        vehicle:vehicles!inner(user_id)
      `
      )
      .eq('vehicles.user_id', user.id)
      .single();

    if (error) throw new Error(error.message);

    const updatedServiceData = updatedService as any;
    return {
      id: updatedServiceData.service_id.toString(),
      vehicleId: updatedServiceData.vehicle_id.toString(),
      // تبدیل تاریخ میلادی به شمسی برای نمایش در UI
      date: updatedServiceData.service_date_gregorian
        ? formatJalaliDate(updatedServiceData.service_date_gregorian)
        : formatJalaliDate(updatedServiceData.service_date),
      km: updatedServiceData.service_km,
      cost: updatedServiceData.cost,
      type: updatedServiceData.service_type as any,
      note: updatedServiceData.description || undefined,
      createdAt: updatedServiceData.created_at,
      updatedAt: updatedServiceData.updated_at,
    };
  },

  async delete(id: string): Promise<void> {
    if (!supabase) throw new Error('Supabase client not available. Check VITE_BACKEND_TYPE and environment variables.');
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('کاربر لاگین نشده است');

    const { error } = await supabase
      .from('services')
      .delete()
      .eq('service_id', id)
      .select(
        `
        vehicle:vehicles!inner(user_id)
      ` as any
      )
      .eq('vehicles.user_id', user.id);

    if (error) throw new Error(error.message);
  },

  async getLatestForVehicle(vehicleId: string): Promise<ServiceRecord | null> {
    if (!supabase) throw new Error('Supabase client not available. Check VITE_BACKEND_TYPE and environment variables.');
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('کاربر لاگین نشده است');

    const { data, error } = await supabase
      .from('services')
      .select(
        `
        *,
        vehicle:vehicles!inner(user_id)
      `
      )
      .eq('vehicle_id', parseInt(vehicleId))
      .eq('vehicles.user_id', user.id)
      .order('service_km', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows
      throw new Error(error.message);
    }

    const serviceData = data as any;
    return {
      id: serviceData.service_id.toString(),
      vehicleId: serviceData.vehicle_id.toString(),
      // تبدیل تاریخ میلادی به شمسی برای نمایش در UI
      date: serviceData.service_date_gregorian
        ? formatJalaliDate(serviceData.service_date_gregorian)
        : formatJalaliDate(serviceData.service_date),
      km: serviceData.service_km,
      cost: serviceData.cost,
      type: serviceData.service_type as any,
      note: serviceData.description || undefined,
      createdAt: serviceData.created_at,
      updatedAt: serviceData.updated_at,
    };
  },
};

// ============================================
// DJANGO IMPLEMENTATION (Placeholder)
// ============================================
// استفاده: VITE_BACKEND_TYPE=django
// نیاز به: VITE_DJANGO_API_URL
// API: Django REST Framework

const serviceServiceDjango: IServiceService = {
  async getAll(vehicleId?: string): Promise<ServiceRecord[]> {
    const params = vehicleId ? { vehicle_id: vehicleId } : {};
    const response = await api.get<ApiResponse<ServiceRecord[]>>('/services/', { params });
    return response.data.data;
  },

  async getById(id: string): Promise<ServiceRecord> {
    const response = await api.get<ApiResponse<ServiceRecord>>(`/services/${id}/`);
    return response.data.data;
  },

  async create(data: ServiceFormData): Promise<ServiceRecord> {
    const response = await api.post<ApiResponse<ServiceRecord>>('/services/', data);
    return response.data.data;
  },

  async update(id: string, data: Partial<ServiceFormData>): Promise<ServiceRecord> {
    const response = await api.patch<ApiResponse<ServiceRecord>>(`/services/${id}/`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/services/${id}/`);
  },

  async getLatestForVehicle(vehicleId: string): Promise<ServiceRecord | null> {
    const response = await api.get<ApiResponse<ServiceRecord | null>>(
      `/services/latest/${vehicleId}/`
    );
    return response.data.data;
  },
};

// ============================================
// EXPORTED SERVICE (Router)
// ============================================
// این service به صورت خودکار بر اساس VITE_BACKEND_TYPE
// یکی از implementations بالا را انتخاب می‌کند

export const serviceService = selectService(
  serviceServiceMock,
  serviceServiceSupabase,
  serviceServiceDjango
);
