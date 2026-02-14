/**
 * سرویس گالری تصاویر خودرو.
 * لیست، آپلود، حذف، تنظیم تصویر پیش‌فرض.
 * پیاده‌سازی کامل برای Django؛ mock/supabase خالی برمی‌گردانند.
 */
import api from './api';
import type { ApiResponse } from '../types';
import type { VehicleImageRecord } from '../types';
import { selectService } from './base/router';

const mockGalleryService = {
  async listByVehicleId(_vehicleId: string): Promise<VehicleImageRecord[]> {
    return [];
  },
  async upload(
    _vehicleId: string,
    _file: File,
    _options?: { displayOrder?: number; isDefault?: boolean }
  ): Promise<VehicleImageRecord> {
    throw new Error('گالری در حالت mock پشتیبانی نمی‌شود.');
  },
  async delete(imageId: string): Promise<void> {
    void imageId;
  },
  async setDefault(imageId: string): Promise<VehicleImageRecord> {
    void imageId;
    throw new Error('گالری در حالت mock پشتیبانی نمی‌شود.');
  },
};

const supabaseGalleryService = {
  async listByVehicleId(_vehicleId: string): Promise<VehicleImageRecord[]> {
    return [];
  },
  async upload(
    _vehicleId: string,
    _file: File,
    _options?: { displayOrder?: number; isDefault?: boolean }
  ): Promise<VehicleImageRecord> {
    throw new Error('گالری در حالت Supabase هنوز پیاده‌سازی نشده است.');
  },
  async delete(_imageId: string): Promise<void> {},
  async setDefault(_imageId: string): Promise<VehicleImageRecord> {
    throw new Error('گالری در حالت Supabase هنوز پیاده‌سازی نشده است.');
  },
};

const djangoGalleryService = {
  async listByVehicleId(vehicleId: string): Promise<VehicleImageRecord[]> {
    const response = await api.get<ApiResponse<VehicleImageRecord[]>>(
      `/vehicles/${vehicleId}/images/`
    );
    return response.data.data ?? [];
  },

  async upload(
    vehicleId: string,
    file: File,
    options?: { displayOrder?: number; isDefault?: boolean }
  ): Promise<VehicleImageRecord> {
    const formData = new FormData();
    formData.append('image', file);
    if (options?.displayOrder != null) formData.append('display_order', String(options.displayOrder));
    if (options?.isDefault === true) formData.append('is_default', 'true');
    const response = await api.post<ApiResponse<VehicleImageRecord>>(
      `/vehicles/${vehicleId}/images/`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data.data;
  },

  async delete(imageId: string): Promise<void> {
    await api.delete(`/vehicle-images/${imageId}/`);
  },

  async setDefault(imageId: string): Promise<VehicleImageRecord> {
    const response = await api.patch<ApiResponse<VehicleImageRecord>>(
      `/vehicle-images/${imageId}/`,
      { isDefault: true }
    );
    return response.data.data;
  },
};

export const vehicleGalleryService = selectService(
  mockGalleryService,
  supabaseGalleryService,
  djangoGalleryService
);
