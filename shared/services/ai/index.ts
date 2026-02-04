// ========================================
// AI Service - Main Entry Point
// ========================================

import { OpenAIProvider } from './providers/openai';
import { getAIProviderConfig, getUserSelectedProvider } from './config';
import type { IAIProvider } from './base';
import type { AIRequestParams, AIResponse, AIProvider, AIProviderConfig } from './types';

/**
 * Factory function برای ایجاد provider مناسب
 */
function createAIProvider(config: AIProviderConfig): IAIProvider {
  switch (config.provider) {
    case 'openai':
    case 'openrouter':
      return new OpenAIProvider(config);
    default:
      throw new Error(`Unknown or unsupported AI provider: ${config.provider}`);
  }
}

/**
 * Singleton instance برای AI Provider
 */
let aiProviderInstance: IAIProvider | null = null;
let currentConfig: AIProviderConfig | null = null;

/**
 * دریافت یا ایجاد instance AI Provider
 */
function getAIProvider(): IAIProvider | null {
  // ابتدا بررسی می‌کنیم که آیا config تغییر کرده یا نه
  const config = getAIProviderConfig();
  
  if (!config) {
    return null;
  }

  // اگر config تغییر کرده یا instance وجود ندارد، instance جدید بساز
  if (!aiProviderInstance || !currentConfig || currentConfig.provider !== config.provider) {
    try {
      aiProviderInstance = createAIProvider(config);
      currentConfig = config;
    } catch (error) {
      console.error('Failed to create AI provider:', error);
      return null;
    }
  }

  return aiProviderInstance;
}

/**
 * تحلیل مشکل خودرو - اصلی ترین تابع که از خارج استفاده می‌شود
 */
export async function analyzeCarIssue(params: AIRequestParams): Promise<AIResponse> {
  const provider = getAIProvider();
  
  if (!provider) {
    return {
      text: "خطا: سرویس AI پیکربندی نشده است. لطفاً با مدیر سیستم تماس بگیرید.",
      groundingChunks: []
    };
  }

  if (!provider.isConfigured()) {
    return {
      text: "خطا: API Key تنظیم نشده است. لطفاً با مدیر سیستم تماس بگیرید.",
      groundingChunks: []
    };
  }

  try {
    return await provider.analyzeCarIssue(params);
  } catch (error) {
    console.error('AI Service Error:', error);
    return {
      text: "متاسفانه مشکلی در برقراری ارتباط با هوش مصنوعی رخ داده است. لطفاً دوباره تلاش کنید.",
      groundingChunks: [],
      metadata: {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    };
  }
}

/**
 * دریافت اطلاعات provider فعلی
 */
export function getCurrentProviderInfo(): { provider: AIProvider; name: string } | null {
  const provider = getAIProvider();
  if (!provider) {
    return null;
  }
  
  const info = provider.getInfo();
  return {
    provider: info.id,
    name: info.name
  };
}

/**
 * بررسی می‌کند که آیا AI service پیکربندی شده است
 */
export function isAIServiceConfigured(): boolean {
  const provider = getAIProvider();
  return provider !== null && provider.isConfigured();
}

/**
 * Reset کردن provider instance (برای تست یا تغییر تنظیمات)
 */
export function resetAIProvider(): void {
  aiProviderInstance = null;
  currentConfig = null;
}

// Export types
export type { AIModelMode, AIProvider, AIRequestParams, AIResponse } from './types';
export type { IAIProvider } from './base';

