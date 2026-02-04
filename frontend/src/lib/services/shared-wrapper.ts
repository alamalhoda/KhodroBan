/**
 * Wrapper برای Services مشترک
 * 
 * این فایل services را از shared import می‌کند و stores را به‌روز می‌کند
 * تا frontend فعلی بدون تغییر کار کند
 */

import { setErrorHandlers } from '@shared/services/api';
import { authStore } from '../stores/auth';
import { toastStore } from '../stores/ui';

// Setup error handlers برای shared services
setErrorHandlers({
  onAuthError: () => {
    authStore.logout();
    if (typeof window !== 'undefined') {
      window.location.hash = '#/login';
    }
  },
  onToast: (message: string, type?: 'error' | 'warning' | 'info') => {
    if (type === 'error') {
      toastStore.error(message);
    } else if (type === 'warning') {
      toastStore.warning(message);
    } else {
      toastStore.info(message);
    }
  },
});

// Import services from shared
import { authService as sharedAuthService } from '@shared/services/authService';
import type { User, LoginCredentials, RegisterData } from '../types';

// Wrapper برای authService که stores را به‌روز می‌کند
export const authService = {
  async login(credentials: LoginCredentials) {
    const result = await sharedAuthService.login(credentials);
    authStore.loginSuccess(result.user, result.token);
    return result;
  },

  async register(data: RegisterData) {
    const result = await sharedAuthService.register(data);
    authStore.loginSuccess(result.user, result.token);
    return result;
  },

  async loginWithGoogle() {
    await sharedAuthService.loginWithGoogle();
    // Store update handled by callback or redirect
  },

  async logout() {
    await sharedAuthService.logout();
    authStore.logout();
  },

  async getProfile() {
    return await sharedAuthService.getProfile();
  },

  async updateProfile(data: Partial<{ firstName: string; lastName: string }>) {
    const user = await sharedAuthService.updateProfile(data);
    authStore.updateUser(user);
    return user;
  },

  async forgotPassword(email: string) {
    return await sharedAuthService.forgotPassword(email);
  },

  async resetPassword(token: string, password: string) {
    return await sharedAuthService.resetPassword(token, password);
  },

  async upgradeToPro() {
    return await sharedAuthService.upgradeToPro();
  },
};

// سایر services را مستقیماً از shared export می‌کنیم (بدون wrapper)
export { vehicleService } from '@shared/services/vehicleService';
export { serviceService } from '@shared/services/serviceService';
export { expenseService } from '@shared/services/expenseService';
export { reminderService } from '@shared/services/reminderService';
export { reportService } from '@shared/services/reportService';
export { upgradeService } from '@shared/services/upgradeService';
export { notificationService } from '@shared/services/notificationService';
