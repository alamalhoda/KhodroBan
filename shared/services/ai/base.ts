// ========================================
// AI Provider Base Interface
// ========================================

import type { AIRequestParams, AIResponse, AIProviderInfo } from './types';

/**
 * Interface پایه که همه AI Providers باید آن را پیاده‌سازی کنند
 */
export interface IAIProvider {
  /**
   * اطلاعات Provider
   */
  getInfo(): AIProviderInfo;

  /**
   * بررسی می‌کند که آیا Provider به درستی پیکربندی شده است
   */
  isConfigured(): boolean;

  /**
   * تحلیل مشکل خودرو و پاسخ به سوال کاربر
   */
  analyzeCarIssue(params: AIRequestParams): Promise<AIResponse>;
}

