// ========================================
// AI Service Configuration
// ========================================

import type { AIProvider, AIProviderConfig } from './types';

/**
 * تنظیمات پیش‌فرض AI Provider
 * این مقدار می‌تواند از environment variable یا admin settings بیاید
 */
export function getAIProviderConfig(): AIProviderConfig | null {
  const provider = (import.meta.env.VITE_AI_PROVIDER || 'openai') as AIProvider;
  const apiKey = import.meta.env.VITE_AI_API_KEY;

  if (!apiKey) {
    console.warn('AI API Key not found. Please set VITE_AI_API_KEY in your .env file');
    return null;
  }

  const config: AIProviderConfig = {
    provider,
    apiKey,
  };

  // تنظیمات خاص برای OpenRouter
  if (provider === 'openrouter') {
    config.baseURL = import.meta.env.VITE_OPENROUTER_API_URL || 'https://openrouter.ai/api/v1';
    config.defaultModels = {
      expert: import.meta.env.VITE_AI_MODEL_EXPERT || 'anthropic/claude-3.5-sonnet',
      fast: import.meta.env.VITE_AI_MODEL_FAST || 'anthropic/claude-3-haiku',
      maps: import.meta.env.VITE_AI_MODEL_MAPS || 'anthropic/claude-3-haiku',
    };
  } else if (provider === 'openai') {
    config.baseURL = import.meta.env.VITE_OPENAI_API_URL || 'https://api.openai.com/v1';
    config.defaultModels = {
      expert: import.meta.env.VITE_AI_MODEL_EXPERT || 'gpt-4-turbo-preview',
      fast: import.meta.env.VITE_AI_MODEL_FAST || 'gpt-3.5-turbo',
      maps: import.meta.env.VITE_AI_MODEL_MAPS || 'gpt-4-turbo-preview',
    };
  } else if (provider === 'gemini') {
    // Gemini models are handled in the provider itself
    config.defaultModels = {
      expert: 'gemini-3-pro-preview',
      fast: 'gemini-flash-lite-latest',
      maps: 'gemini-2.5-flash',
    };
  }

  return config;
}

/**
 * تنظیمات Provider انتخابی (می‌تواند از user settings بیاید)
 * در آینده اگر کاربر بتواند provider را انتخاب کند، این تابع استفاده می‌شود
 */
export function getUserSelectedProvider(): AIProvider | null {
  // TODO: در آینده می‌تواند از user settings در database بیاید
  // const userSettings = getUserSettings();
  // return userSettings?.aiProvider || null;
  return null;
}

