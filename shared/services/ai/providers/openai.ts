// ========================================
// OpenAI/OpenRouter AI Provider (Mock for frontend)
// ========================================
//
// توجه: این نسخه‌ی موقت برای فرانت‌اند است و هیچ فراخوانی واقعی به
// OpenAI / OpenRouter انجام نمی‌دهد. فقط برای این است که UI و باندل
// بدون وابستگی به SDK رسمی openai بالا بیاید.

import type { IAIProvider } from '../base';
import type { AIRequestParams, AIResponse, AIProviderInfo, AIProviderConfig } from '../types';
import { formatUserContextForPrompt } from '../utils';

export class OpenAIProvider implements IAIProvider {
  private apiKey: string;
  private baseURL?: string;

  constructor(config: AIProviderConfig) {
    this.apiKey = config.apiKey;
    this.baseURL = config.baseURL;
  }

  getInfo(): AIProviderInfo {
    const isOpenRouter = this.baseURL?.includes('openrouter.ai');
    return {
      id: isOpenRouter ? 'openrouter' : 'openai',
      name: isOpenRouter ? 'OpenRouter (Mock)' : 'OpenAI (Mock)',
      description:
        'نسخه‌ی موقت/Mock برای فرانت‌اند که فقط پاسخ تستی برمی‌گرداند و به هیچ API واقعی وصل نیست.',
      requiresApiKey: false,
      supportsImages: false,
      supportsMaps: false,
      supportsDeepThinking: false,
    };
  }

  isConfigured(): boolean {
    // در نسخه‌ی mock همیشه خودمان را «پیکربندی شده» در نظر می‌گیریم
    return true;
  }

  async analyzeCarIssue(params: AIRequestParams): Promise<AIResponse> {
    // ساخت یک پاسخ تستی که کمی هم از ورودی استفاده کند
    let userContextText = '';
    if (params.userContext) {
      const ctx = formatUserContextForPrompt(params.userContext);
      if (ctx) {
        userContextText = `\n\nبر اساس اطلاعات خودرو / سوابق شما:\n${ctx}`;
      }
    }

    const promptSnippet = params.prompt ? `\n\nسوال شما:\n${params.prompt}` : '';

    return {
      text:
        'این یک پاسخ تستی از نسخه‌ی Mock هوش مصنوعی است.\n' +
        'در این محیط، هنوز اتصال واقعی به OpenAI/OpenRouter پیاده‌سازی نشده است و این پیام فقط برای تست UI و جریان گفتگو است.' +
        userContextText +
        promptSnippet,
      groundingChunks: [],
      metadata: {
        mock: true,
        provider: 'openai-mock',
      },
    };
  }
}

