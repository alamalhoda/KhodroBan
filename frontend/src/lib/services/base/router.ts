/**
 * Service Router
 * 
 * این فایل service های مناسب را بر اساس نوع backend انتخاب می‌کند
 */

import { BACKEND_TYPE } from '../../config/backendConfig';
import type { BackendType } from '../../config/backendConfig';

/**
 * انتخاب service مناسب بر اساس نوع backend
 * 
 * @param mockService - Implementation با Mock
 * @param supabaseService - Implementation با Supabase
 * @param djangoService - Implementation با Django (اختیاری)
 * @returns Service انتخاب شده
 */
export function selectService<T>(
  mockService: T,
  supabaseService: T,
  djangoService?: T
): T {
  switch (BACKEND_TYPE) {
    case 'mock':
      return mockService;
    
    case 'supabase':
      return supabaseService;
    
    case 'django':
      if (djangoService) {
        return djangoService;
      }
      // اگر Django implementation وجود ندارد، از Supabase استفاده می‌کنیم
      console.warn('Django service not implemented, falling back to Supabase');
      return supabaseService;
    
    default:
      console.warn(`Unknown backend type: ${BACKEND_TYPE}, using Supabase`);
      return supabaseService;
  }
}

/**
 * بررسی اینکه آیا backend type معتبر است
 */
export function isValidBackendType(type: string): type is BackendType {
  return ['mock', 'supabase', 'django'].includes(type);
}

