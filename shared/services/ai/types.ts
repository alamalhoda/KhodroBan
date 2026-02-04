// ========================================
// AI Service Types
// ========================================

/**
 * حالت‌های مختلف مدل AI
 */
export type AIModelMode = 'expert' | 'fast' | 'maps';

/**
 * Providerهای مختلف AI
 */
export type AIProvider = 'gemini' | 'openai' | 'openrouter';

/**
 * Context اطلاعات کاربر (خودرو و سوابق)
 */
export interface UserContext {
  /** لیست خودروهای کاربر */
  vehicles?: Array<{
    id: string;
    model: string;
    year: number;
    plateNumber: string;
    currentKm: number;
    note?: string;
  }>;
  /** آخرین سرویس‌ها (حداکثر 10) */
  recentServices?: Array<{
    date: string;
    km: number;
    cost: number;
    type: string;
    types?: string[];
    note?: string;
    vehicleModel?: string;
  }>;
  /** آخرین هزینه‌ها (حداکثر 10) */
  recentExpenses?: Array<{
    date: string;
    amount: number;
    category: string;
    km?: number;
    note?: string;
    vehicleModel?: string;
  }>;
}

/**
 * Context گفتگو (تاریخچه پیام‌ها)
 */
export interface ConversationContext {
  /** تاریخچه پیام‌ها (برای حفظ context) */
  messages?: Array<{
    role: 'user' | 'model';
    text: string;
  }>;
  /** حداکثر تعداد پیام‌های قبلی که باید ارسال شود (default: 10) */
  maxHistoryMessages?: number;
}

/**
 * تنظیمات برای درخواست AI
 */
export interface AIRequestParams {
  prompt: string;
  base64Image?: string;
  deepThinking?: boolean;
  mode: AIModelMode;
  location?: {
    latitude: number;
    longitude: number;
  };
  /** مدل خاص (اختیاری - اگر provider به پشتیبانی از مدل‌های مختلف نیاز داشته باشد) */
  model?: string;
  /** Context اطلاعات کاربر (خودرو و سوابق) */
  userContext?: UserContext;
  /** Context گفتگو (تاریخچه پیام‌ها) */
  conversationContext?: ConversationContext;
}

/**
 * پاسخ از AI
 */
export interface AIResponse {
  text: string;
  groundingChunks?: any[];
  /** متادیتای اضافی که provider می‌تواند برگرداند */
  metadata?: Record<string, any>;
}

/**
 * تنظیمات Provider
 */
export interface AIProviderConfig {
  provider: AIProvider;
  /** در حالت proxy (مثلاً Supabase) API Key در سرور است؛ در فرانت خالی یا dummy */
  apiKey: string;
  /** URL پایه: مستقیم (OpenAI/OpenRouter) یا proxy (مثلاً Supabase Edge Function) */
  baseURL?: string;
  /** مدل پیش‌فرض برای هر mode */
  defaultModels?: {
    expert?: string;
    fast?: string;
    maps?: string;
  };
  /** true = فقط پاسخ Mock بدون فراخوانی واقعی (برای dev/demo) */
  useMock?: boolean;
}

/**
 * اطلاعات Provider
 */
export interface AIProviderInfo {
  id: AIProvider;
  name: string;
  description: string;
  /** آیا این provider نیاز به API Key دارد؟ */
  requiresApiKey: boolean;
  /** آیا این provider از تصویر پشتیبانی می‌کند؟ */
  supportsImages: boolean;
  /** آیا این provider از maps پشتیبانی می‌کند؟ */
  supportsMaps: boolean;
  /** آیا این provider از deep thinking پشتیبانی می‌کند؟ */
  supportsDeepThinking: boolean;
}

