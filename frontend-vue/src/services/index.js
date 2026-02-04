// Re-export services from shared
// This allows us to use services in Vue components
export { default as api, getErrorMessage, setErrorHandlers } from '@services/api';
export { authService } from '@services/authService';
export { vehicleService } from '@services/vehicleService';
export { serviceService } from '@services/serviceService';
export { expenseService } from '@services/expenseService';
export { reminderService } from '@services/reminderService';
export { reportService } from '@services/reportService';
export { upgradeService } from '@services/upgradeService';
export { notificationService } from '@services/notificationService';
export { supabase } from '@services/supabase';
export { dashboardService } from './dashboardService';
export { serviceTypeService } from './serviceTypeService';
export { expenseCategoryService } from './expenseCategoryService';
export { telegramService } from './telegramService';
export { analyzeCarIssue, isAIServiceConfigured } from '@services/ai';
export { aiService } from '@services/aiService';

