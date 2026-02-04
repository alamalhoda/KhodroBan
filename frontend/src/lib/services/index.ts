// Re-export all services
// Note: فعلاً از services محلی استفاده می‌کنیم
// Shared services برای frontend-vue آماده است و در آینده می‌توانیم migrate کنیم

// Option 1: استفاده از services فعلی (موجود) - فعال
export { default as api, getErrorMessage } from './api';
export { authService } from './authService';
export { vehicleService } from './vehicleService';
export { serviceService } from './serviceService';
export { expenseService } from './expenseService';
export { reminderService } from './reminderService';
export { reportService } from './reportService';
export { upgradeService } from './upgradeService';

// Option 2: استفاده از shared services (برای آینده - غیرفعال)
// Uncomment when ready to migrate:
// export { default as api, getErrorMessage } from '@shared/services/api';
// export { authService, vehicleService, serviceService, expenseService, reminderService, reportService, upgradeService, notificationService } from './shared-wrapper';

export {
  analyzeCarIssue,
  getCurrentProviderInfo,
  isAIServiceConfigured,
  resetAIProvider,
  type AIModelMode,
  type AIProvider,
  type AIRequestParams,
  type AIResponse,
} from './ai';
