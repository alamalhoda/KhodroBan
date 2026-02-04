// ========================================
// AI Service Configuration
// ========================================
//
// حالت‌ها:
// 1) Mock: VITE_AI_USE_MOCK=true → فقط پاسخ تستی، بدون فراخوانی بیرونی
// 2) Real via Proxy: VITE_AI_PROXY_URL (یا VITE_OPENROUTER_API_URL / VITE_OPENAI_API_URL)
//    به آدرس proxy (مثلاً Supabase Edge Function) اشاره می‌کند؛ API Key در سرور است
// 3) تعویض سرویس‌دهنده: فقط URL را عوض کنید (Supabase امروز، سرویس دیگر فردا)

import type { AIProvider, AIProviderConfig } from './types';

/** خواندن env در Vite (برای TypeScript) */
function getEnv(key: string): string | undefined {
  try {
    const v = (import.meta as unknown as { env?: Record<string, unknown> }).env?.[key];
    return v != null ? String(v) : undefined;
  } catch (_) {
    return undefined;
  }
}

/**
 * تنظیمات پیش‌فرض AI Provider
 * این مقدار می‌تواند از environment variable یا admin settings بیاید
 */
export function getAIProviderConfig(): AIProviderConfig | null {
  const provider = (getEnv('VITE_AI_PROVIDER') || 'openai') as AIProvider;
  const useMock = getEnv('VITE_AI_USE_MOCK') === 'true';
  const apiKey = getEnv('VITE_AI_API_KEY');
  // URL پایه: یا proxy (Supabase/سرویس دیگر) یا مستقیم OpenAI/OpenRouter
  const proxyUrl =
    getEnv('VITE_AI_PROXY_URL') ||
    getEnv('VITE_OPENROUTER_API_URL') ||
    getEnv('VITE_OPENAI_API_URL');

  // حالت Mock: نیازی به API Key یا URL نیست
  if (useMock) {
    const config: AIProviderConfig = {
      provider,
      apiKey: 'mock',
      useMock: true,
    };
    if (provider === 'openrouter' || provider === 'openai') {
      config.defaultModels = {
        expert: getEnv('VITE_AI_MODEL_EXPERT') || (provider === 'openrouter' ? 'anthropic/claude-3.5-sonnet' : 'gpt-4-turbo-preview'),
        fast: getEnv('VITE_AI_MODEL_FAST') || (provider === 'openrouter' ? 'anthropic/claude-3-haiku' : 'gpt-3.5-turbo'),
        maps: getEnv('VITE_AI_MODEL_MAPS') || (provider === 'openrouter' ? 'anthropic/claude-3-haiku' : 'gpt-4-turbo-preview'),
      };
    }
    return config;
  }

  // حالت واقعی: باید یا proxy URL داشته باشیم (API Key در سرور) یا apiKey برای فراخوانی مستقیم
  if (!proxyUrl && !apiKey) {
    console.warn(
      'AI not configured: set VITE_AI_USE_MOCK=true for mock, or VITE_AI_PROXY_URL (e.g. Supabase) or VITE_AI_API_KEY'
    );
    return null;
  }

  const config: AIProviderConfig = {
    provider,
    apiKey: apiKey || '',
    useMock: false,
  };

  if (proxyUrl) {
    config.baseURL = proxyUrl.replace(/\/$/, ''); // بدون اسلش انتهایی
  }

  if (provider === 'openrouter') {
    if (!config.baseURL) config.baseURL = 'https://openrouter.ai/api/v1';
    config.defaultModels = {
      expert: getEnv('VITE_AI_MODEL_EXPERT') || 'anthropic/claude-3.5-sonnet',
      fast: getEnv('VITE_AI_MODEL_FAST') || 'anthropic/claude-3-haiku',
      maps: getEnv('VITE_AI_MODEL_MAPS') || 'anthropic/claude-3-haiku',
    };
  } else if (provider === 'openai') {
    if (!config.baseURL) config.baseURL = 'https://api.openai.com/v1';
    config.defaultModels = {
      expert: getEnv('VITE_AI_MODEL_EXPERT') || 'gpt-4-turbo-preview',
      fast: getEnv('VITE_AI_MODEL_FAST') || 'gpt-3.5-turbo',
      maps: getEnv('VITE_AI_MODEL_MAPS') || 'gpt-4-turbo-preview',
    };
  } else if (provider === 'gemini') {
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

