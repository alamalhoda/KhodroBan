// ========================================
// OpenAI/OpenRouter AI Provider
// ========================================
//
// دو حالت:
// 1) useMock=true: فقط پاسخ تستی (بدون فراخوانی بیرونی)
// 2) useMock=false: فراخوانی واقعی به baseURL (مثلاً Supabase ai-proxy یا OpenAI/OpenRouter)
//    وقتی baseURL به proxy اشاره دارد، API Key در سرور است و از فرانت ارسال نمی‌شود.

import type { IAIProvider } from '../base';
import type {
  AIRequestParams,
  AIResponse,
  AIProviderInfo,
  AIProviderConfig,
  AIModelMode,
} from '../types';
import { formatUserContextForPrompt } from '../utils';

/** آیا این config به یک proxy (مثلاً Supabase) اشاره می‌کند؛ API Key در سرور است */
function isProxyConfig(config: AIProviderConfig): boolean {
  if (!config.baseURL) return false;
  const u = config.baseURL.toLowerCase();
  return (
    u.includes('supabase.co') ||
    u.includes('/functions/') ||
    !(u.includes('openai.com') || u.includes('openrouter.ai'))
  );
}

/** ارسال Authorization فقط وقتی API Key واقعی داریم (فراخوانی مستقیم)، نه در حالت proxy */
function shouldSendAuth(config: AIProviderConfig): boolean {
  const k = config.apiKey || '';
  return k !== '' && k !== 'mock' && k !== 'dummy' && !isProxyConfig(config);
}

export class OpenAIProvider implements IAIProvider {
  private config: AIProviderConfig;

  constructor(config: AIProviderConfig) {
    this.config = config;
  }

  getInfo(): AIProviderInfo {
    const isMock = this.config.useMock === true;
    const isOpenRouter = this.config.provider === 'openrouter';
    const isProxy = !isMock && isProxyConfig(this.config);

    let name: string;
    let description: string;
    if (isMock) {
      name = isOpenRouter ? 'OpenRouter (Mock)' : 'OpenAI (Mock)';
      description =
        'نسخه‌ی Mock برای تست UI؛ بدون فراخوانی به API واقعی.';
    } else if (isProxy) {
      name = isOpenRouter ? 'OpenRouter (Proxy)' : 'OpenAI (Proxy)';
      description =
        'اتصال از طریق proxy (مثلاً Supabase). API Key در سرور نگهداری می‌شود.';
    } else {
      name = isOpenRouter ? 'OpenRouter' : 'OpenAI';
      description = 'اتصال مستقیم به API (API Key در فرانت).';
    }

    return {
      id: isOpenRouter ? 'openrouter' : 'openai',
      name,
      description,
      requiresApiKey: !isMock && !isProxy,
      supportsImages: false,
      supportsMaps: false,
      supportsDeepThinking: false,
    };
  }

  isConfigured(): boolean {
    if (this.config.useMock) return true;
    if (isProxyConfig(this.config) && this.config.baseURL) return true;
    return !!(this.config.apiKey && this.config.apiKey !== 'mock' && this.config.apiKey !== 'dummy');
  }

  async analyzeCarIssue(params: AIRequestParams): Promise<AIResponse> {
    if (this.config.useMock) {
      return this.mockAnalyze(params);
    }
    if (!this.config.baseURL) {
      return {
        text: 'خطا: آدرس سرویس AI (baseURL) تنظیم نشده است.',
        groundingChunks: [],
        metadata: { error: 'missing_base_url' },
      };
    }
    return this.realAnalyze(params);
  }

  /** پاسخ Mock برای تست UI */
  private async mockAnalyze(params: AIRequestParams): Promise<AIResponse> {
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
        'در این محیط اتصال واقعی به API غیرفعال است و این پیام فقط برای تست UI و جریان گفتگو است.' +
        userContextText +
        promptSnippet,
      groundingChunks: [],
      metadata: {
        mock: true,
        provider: 'openai-mock',
      },
    };
  }

  /** فراخوانی واقعی به Chat Completions (proxy یا مستقیم) */
  private async realAnalyze(params: AIRequestParams): Promise<AIResponse> {
    const model = this.resolveModel(params.mode);
    const messages = this.buildMessages(params);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (shouldSendAuth(this.config)) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    const url = `${this.config.baseURL}/chat/completions`;
    let res: Response;
    try {
      res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({ model, messages }),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        text: 'متاسفانه در برقراری ارتباط با سرویس هوش مصنوعی خطایی رخ داد. لطفاً دوباره تلاش کنید.',
        groundingChunks: [],
        metadata: { error: message, network: true },
      };
    }

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMessage =
        data?.error?.message || data?.error || data?.message || res.statusText || `HTTP ${res.status}`;
      return {
        text: `خطا از سرویس هوش مصنوعی: ${errorMessage}. لطفاً بعداً تلاش کنید.`,
        groundingChunks: [],
        metadata: { error: errorMessage, status: res.status },
      };
    }

    const content =
      data?.choices?.[0]?.message?.content ??
      data?.choices?.[0]?.text ??
      '';
    return {
      text: typeof content === 'string' ? content : String(content),
      groundingChunks: [],
      metadata: {
        model: data?.model,
        usage: data?.usage,
        provider: this.config.provider,
      },
    };
  }

  private resolveModel(mode: AIModelMode): string {
    const models = this.config.defaultModels;
    if (models) {
      if (mode === 'expert' && models.expert) return models.expert;
      if (mode === 'fast' && models.fast) return models.fast;
      if (mode === 'maps' && models.maps) return models.maps;
    }
    return this.config.provider === 'openrouter'
      ? 'anthropic/claude-3-haiku'
      : 'gpt-3.5-turbo';
  }

  private buildMessages(params: AIRequestParams): Array<{ role: 'system' | 'user' | 'assistant'; content: string }> {
    const systemParts: string[] = [
      'شما یک مشاور خودرو هستید. به سوالات کاربر درباره خودرو، سرویس، تعمیر و هزینه‌ها به زبان فارسی پاسخ دهید. مختصر و مفید باشید.',
    ];
    if (params.userContext) {
      const ctx = formatUserContextForPrompt(params.userContext);
      if (ctx) {
        systemParts.push('اطلاعات خودرو و سوابق کاربر:');
        systemParts.push(ctx);
      }
    }

    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemParts.join('\n\n') },
    ];

    const history = params.conversationContext?.messages ?? [];
    const maxHistory = params.conversationContext?.maxHistoryMessages ?? 10;
    const recent = history.slice(-maxHistory);
    for (const msg of recent) {
      messages.push({
        role: msg.role === 'model' ? 'assistant' : 'user',
        content: msg.text,
      });
    }
    messages.push({ role: 'user', content: params.prompt });

    return messages;
  }
}
