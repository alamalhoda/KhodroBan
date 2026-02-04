# AI Service - سیستم هوش مصنوعی قابل گسترش

این ماژول یک سیستم قابل گسترش برای استفاده از سرویس‌های مختلف هوش مصنوعی است که با استاندارد OpenAI سازگار است.

## معماری

سیستم از الگوی **Factory Pattern** و **Strategy Pattern** استفاده می‌کند:

```
ai/
├── types.ts          # Types مشترک
├── base.ts           # Interface پایه (IAIProvider)
├── config.ts         # تنظیمات و انتخاب provider
├── index.ts          # Service اصلی (Factory)
└── providers/
    ├── gemini.ts     # Google Gemini provider
    └── openai.ts     # OpenAI/OpenRouter provider
```

## Providers پشتیبانی شده

### 1. Google Gemini
- **ID**: `gemini`
- **پشتیبانی از تصویر**: ✅ بله
- **پشتیبانی از Maps**: ✅ بله
- **پشتیبانی از Deep Thinking**: ✅ بله

### 2. OpenAI
- **ID**: `openai`
- **پشتیبانی از تصویر**: ✅ بله (GPT-4 Vision)
- **پشتیبانی از Maps**: ❌ خیر
- **پشتیبانی از Deep Thinking**: ❌ خیر

### 3. OpenRouter
- **ID**: `openrouter`
- **پشتیبانی از تصویر**: ✅ بله (بسته به مدل)
- **پشتیبانی از Maps**: ❌ خیر
- **پشتیبانی از Deep Thinking**: ❌ خیر

## تنظیمات

### Environment Variables

در فایل `.env`:

```env
# انتخاب provider (gemini | openai | openrouter)
VITE_AI_PROVIDER=gemini

# API Key
VITE_AI_API_KEY=your_api_key_here

# برای OpenAI
VITE_OPENAI_API_URL=https://api.openai.com/v1

# برای OpenRouter
VITE_OPENROUTER_API_URL=https://openrouter.ai/api/v1

# مدل‌های پیش‌فرض (اختیاری - برای OpenAI/OpenRouter)
VITE_AI_MODEL_EXPERT=anthropic/claude-3.5-sonnet
VITE_AI_MODEL_FAST=anthropic/claude-3-haiku
VITE_AI_MODEL_MAPS=anthropic/claude-3-haiku
```

### انتخاب Provider توسط Admin

فعلاً provider از environment variable خوانده می‌شود. در آینده می‌توان این را در database ذخیره کرد و admin آن را تنظیم کند.

### انتخاب Provider توسط کاربر (ویژگی Pro)

برای پیاده‌سازی این قابلیت، باید:

1. یک فیلد در جدول `user_profiles` برای ذخیره `ai_provider` اضافه شود
2. تابع `getUserSelectedProvider()` در `config.ts` به‌روزرسانی شود
3. در UI یک تنظیمات برای کاربر Pro اضافه شود

## استفاده

### مثال ساده

```typescript
import { analyzeCarIssue } from '$lib/services/ai';
import type { AIModelMode } from '$lib/services/ai';

const response = await analyzeCarIssue({
  prompt: 'مشکل موتور من چیست؟',
  mode: 'expert',
  deepThinking: false
});

console.log(response.text);
```

### مثال با تصویر

```typescript
import { analyzeCarIssue } from '$lib/services/ai';

// تبدیل تصویر به base64
const file = event.target.files[0];
const reader = new FileReader();
reader.onloadend = async () => {
  const base64Image = reader.result.split(',')[1];
  
  const response = await analyzeCarIssue({
    prompt: 'این عکس چه مشکلی نشان می‌دهد؟',
    base64Image,
    mode: 'expert'
  });
  
  console.log(response.text);
};
reader.readAsDataURL(file);
```

### مثال با Maps

```typescript
import { analyzeCarIssue } from '$lib/services/ai';

// گرفتن موقعیت کاربر
navigator.geolocation.getCurrentPosition(async (position) => {
  const response = await analyzeCarIssue({
    prompt: 'تعویض روغنی‌های نزدیک من',
    mode: 'maps',
    location: {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }
  });
  
  console.log(response.text);
  // response.groundingChunks شامل لینک‌های maps است
});
```

### بررسی وضعیت Service

```typescript
import { isAIServiceConfigured, getCurrentProviderInfo } from '$lib/services/ai';

if (isAIServiceConfigured()) {
  const info = getCurrentProviderInfo();
  console.log(`Using ${info.name} (${info.provider})`);
} else {
  console.error('AI service is not configured');
}
```

## اضافه کردن Provider جدید

برای اضافه کردن یک provider جدید:

1. یک کلاس جدید در `providers/` بسازید که `IAIProvider` را پیاده‌سازی کند:

```typescript
import type { IAIProvider } from '../base';
import type { AIRequestParams, AIResponse, AIProviderInfo, AIProviderConfig } from '../types';

export class MyProvider implements IAIProvider {
  constructor(config: AIProviderConfig) {
    // Initialize your provider
  }

  getInfo(): AIProviderInfo {
    return {
      id: 'myprovider',
      name: 'My Provider',
      description: 'My custom AI provider',
      requiresApiKey: true,
      supportsImages: true,
      supportsMaps: false,
      supportsDeepThinking: false,
    };
  }

  isConfigured(): boolean {
    // Check if provider is configured
    return true;
  }

  async analyzeCarIssue(params: AIRequestParams): Promise<AIResponse> {
    // Implement your provider logic
    return {
      text: 'Response from my provider',
    };
  }
}
```

2. در `index.ts` provider جدید را به factory اضافه کنید:

```typescript
import { MyProvider } from './providers/myprovider';

function createAIProvider(config: AIProviderConfig): IAIProvider {
  switch (config.provider) {
    case 'gemini':
      return new GeminiProvider(config);
    case 'openai':
    case 'openrouter':
      return new OpenAIProvider(config);
    case 'myprovider': // اضافه کردن provider جدید
      return new MyProvider(config);
    default:
      throw new Error(`Unknown AI provider: ${config.provider}`);
  }
}
```

3. Type جدید را به `types.ts` اضافه کنید:

```typescript
export type AIProvider = 'gemini' | 'openai' | 'openrouter' | 'myprovider';
```

## نکات مهم

1. **API Key Security**: API Key در frontend ذخیره می‌شود (در .env). برای production، بهتر است از backend proxy استفاده شود.

2. **Error Handling**: همه providers باید خطاها را به درستی handle کنند و پیام خطای مناسب فارسی برگردانند.

3. **Rate Limiting**: در production باید rate limiting را در نظر بگیرید.

4. **Cost Management**: استفاده از AI می‌تواند هزینه‌بر باشد. بهتر است usage tracking داشته باشید.

## آینده

- [ ] پشتیبانی از انتخاب provider توسط کاربر (Pro feature)
- [ ] Caching برای کاهش هزینه‌ها
- [ ] Rate limiting
- [ ] Usage tracking
- [ ] Streaming responses
- [ ] Context/history management برای conversation

