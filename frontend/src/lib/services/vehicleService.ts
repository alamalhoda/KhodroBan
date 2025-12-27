import { supabase } from '../supabase';
import api from './api';
import type { Vehicle, VehicleFormData, ApiResponse } from '../types';
import { selectService } from './base/router';
import type { IVehicleService } from './base/types';

// ============================================
// MOCK IMPLEMENTATION
// ============================================

const mockVehicles: Vehicle[] = [
  {
    id: '1',
    userId: '1',
    model: 'پژو ۲۰۶',
    year: 1398,
    plateNumber: '۱۲ب۳۴۵ - ۷۸',
    currentKm: 85000,
    note: 'خودروی اصلی',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    userId: '1',
    model: 'سمند LX',
    year: 1395,
    plateNumber: '۲۲ج۱۱۱ - ۳۳',
    currentKm: 142000,
    createdAt: '2024-02-01',
    updatedAt: '2024-02-10',
  },
];

const vehicleServiceMock: IVehicleService = {
  async getAll(): Promise<Vehicle[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [...mockVehicles];
  },

  async getById(id: string): Promise<Vehicle> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const vehicle = mockVehicles.find((v) => v.id === id);
    if (!vehicle) throw new Error('خودرو یافت نشد');
    return vehicle;
  },

  async create(data: VehicleFormData): Promise<Vehicle> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const newVehicle: Vehicle = {
      id: Date.now().toString(),
      userId: '1',
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockVehicles.push(newVehicle);
    return newVehicle;
  },

  async update(id: string, data: Partial<VehicleFormData>): Promise<Vehicle> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const index = mockVehicles.findIndex((v) => v.id === id);
    if (index === -1) throw new Error('خودرو یافت نشد');

    mockVehicles[index] = {
      ...mockVehicles[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return mockVehicles[index];
  },

  async delete(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const index = mockVehicles.findIndex((v) => v.id === id);
    if (index !== -1) {
      mockVehicles.splice(index, 1);
    }
  },

  async updateKm(id: string, km: number): Promise<Vehicle> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = mockVehicles.findIndex((v) => v.id === id);
    if (index === -1) throw new Error('خودرو یافت نشد');

    mockVehicles[index].currentKm = km;
    mockVehicles[index].updatedAt = new Date().toISOString();
    return mockVehicles[index];
  },
};

// ============================================
// SUPABASE IMPLEMENTATION
// ============================================

const vehicleServiceSupabase: IVehicleService = {
  async getAll(): Promise<Vehicle[]> {
    if (!supabase) throw new Error('Supabase client not available. Check VITE_BACKEND_TYPE and environment variables.');
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('کاربر لاگین نشده است');

    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return data.map((v) => ({
      id: v.vehicle_id.toString(),
      userId: v.user_id,
      model: v.model,
      year: v.year,
      plateNumber: v.plate_number,
      currentKm: v.current_km,
      note: v.description || undefined,
      createdAt: v.created_at,
      updatedAt: v.updated_at,
    }));
  },

  async getById(id: string): Promise<Vehicle> {
    if (!supabase) throw new Error('Supabase client not available. Check VITE_BACKEND_TYPE and environment variables.');
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('کاربر لاگین نشده است');

    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('vehicle_id', id)
      .eq('user_id', user.id)
      .single();

    if (error) throw new Error(error.message);

    return {
      id: data.vehicle_id.toString(),
      userId: data.user_id,
      model: data.model,
      year: data.year,
      plateNumber: data.plate_number,
      currentKm: data.current_km,
      note: data.description || undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async create(data: VehicleFormData): Promise<Vehicle> {
    if (!supabase) throw new Error('Supabase client not available. Check VITE_BACKEND_TYPE and environment variables.');
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('کاربر لاگین نشده است');

    const { data: newVehicle, error } = await supabase
      .from('vehicles')
      .insert({
        user_id: user.id,
        model: data.model,
        year: data.year,
        plate_number: data.plateNumber,
        current_km: data.currentKm,
        description: data.note || null,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return {
      id: newVehicle.vehicle_id.toString(),
      userId: newVehicle.user_id,
      model: newVehicle.model,
      year: newVehicle.year,
      plateNumber: newVehicle.plate_number,
      currentKm: newVehicle.current_km,
      note: newVehicle.description || undefined,
      createdAt: newVehicle.created_at,
      updatedAt: newVehicle.updated_at,
    };
  },

  async update(id: string, data: Partial<VehicleFormData>): Promise<Vehicle> {
    if (!supabase) throw new Error('Supabase client not available. Check VITE_BACKEND_TYPE and environment variables.');
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('کاربر لاگین نشده است');

    const updates: any = {};
    if (data.model) updates.model = data.model;
    if (data.year) updates.year = data.year;
    if (data.plateNumber) updates.plate_number = data.plateNumber;
    if (data.currentKm !== undefined) updates.current_km = data.currentKm;
    if (data.note !== undefined) updates.description = data.note;

    const { data: updatedVehicle, error } = await supabase
      .from('vehicles')
      .update(updates)
      .eq('vehicle_id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return {
      id: updatedVehicle.vehicle_id.toString(),
      userId: updatedVehicle.user_id,
      model: updatedVehicle.model,
      year: updatedVehicle.year,
      plateNumber: updatedVehicle.plate_number,
      currentKm: updatedVehicle.current_km,
      note: updatedVehicle.description || undefined,
      createdAt: updatedVehicle.created_at,
      updatedAt: updatedVehicle.updated_at,
    };
  },

  async delete(id: string): Promise<void> {
    if (!supabase) throw new Error('Supabase client not available. Check VITE_BACKEND_TYPE and environment variables.');
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('کاربر لاگین نشده است');

    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('vehicle_id', id)
      .eq('user_id', user.id);

    if (error) throw new Error(error.message);
  },

  async updateKm(id: string, km: number): Promise<Vehicle> {
    return this.update(id, { currentKm: km });
  },
};

// ============================================
// DJANGO IMPLEMENTATION (Placeholder)
// ============================================

const vehicleServiceDjango: IVehicleService = {
  async getAll(): Promise<Vehicle[]> {
    const response = await api.get<ApiResponse<Vehicle[]>>('/vehicles/');
    return response.data.data;
  },

  async getById(id: string): Promise<Vehicle> {
    const response = await api.get<ApiResponse<Vehicle>>(`/vehicles/${id}/`);
    return response.data.data;
  },

  async create(data: VehicleFormData): Promise<Vehicle> {
    const response = await api.post<ApiResponse<Vehicle>>('/vehicles/', data);
    return response.data.data;
  },

  async update(id: string, data: Partial<VehicleFormData>): Promise<Vehicle> {
    const response = await api.patch<ApiResponse<Vehicle>>(`/vehicles/${id}/`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/vehicles/${id}/`);
  },

  async updateKm(id: string, km: number): Promise<Vehicle> {
    const response = await api.patch<ApiResponse<Vehicle>>(`/vehicles/${id}/km/`, { km });
    return response.data.data;
  },
};

// ============================================
// EXPORTED SERVICE (Router)
// ============================================

export const vehicleService = selectService(
  vehicleServiceMock,
  vehicleServiceSupabase,
  vehicleServiceDjango
);
