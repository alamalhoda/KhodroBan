# AI Service Tests

این پوشه شامل تست‌های واحد برای بخش AI Service است.

## ساختار تست‌ها

### 1. `utils.test.ts`
تست‌های مربوط به utility functions:
- `buildUserContext`: ساخت context از اطلاعات کاربر (خودروها، سرویس‌ها، هزینه‌ها)
- `formatUserContextForPrompt`: تبدیل context به متن برای system prompt
- `formatConversationContextForPrompt`: تبدیل تاریخچه گفتگو به متن

**تعداد تست‌ها**: 19 تست

### 2. `config.test.ts`
تست‌های مربوط به configuration:
- `getAIProviderConfig`: خواندن تنظیمات provider از environment variables
- `getUserSelectedProvider`: (هنوز پیاده‌سازی نشده)

**تعداد تست‌ها**: 10 تست

### 3. `providers.test.ts`
تست‌های مربوط به AI providers:
- `OpenAIProvider`: تست OpenAI/OpenRouter provider
  - Constructor و configuration
  - getInfo() و isConfigured()
  - analyzeCarIssue() با mock API calls
  - پشتیبانی از user context و conversation context
  - Error handling
  
- `GeminiProvider`: تست Google Gemini provider
  - Constructor و configuration
  - getInfo() و isConfigured()
  - analyzeCarIssue() با mock API calls
  - انتخاب مدل برای modes مختلف (expert, fast, maps)
  - Error handling

**تعداد تست‌ها**: 20 تست

## اجرای تست‌ها

### اجرای همه تست‌های AI:
```bash
npm test -- src/lib/services/ai/__tests__
```

### اجرای تست‌های خاص:
```bash
# فقط تست‌های utils
npm test -- src/lib/services/ai/__tests__/utils.test.ts

# فقط تست‌های config
npm test -- src/lib/services/ai/__tests__/config.test.ts
```

### اجرا در watch mode:
```bash
npm test -- src/lib/services/ai/__tests__ --watch
```

## Coverage

تست‌های فعلی موارد زیر را پوشش می‌دهند:

✅ **Utils Functions**:
- ساخت user context از داده‌های مختلف
- محدود کردن تعداد سرویس‌ها و هزینه‌ها
- مرتب‌سازی بر اساس تاریخ
- تبدیل به متن فارسی برای prompt
- مدیریت conversation history

✅ **Configuration**:
- خواندن provider از environment variables
- تنظیمات پیش‌فرض برای هر provider
- پشتیبانی از custom base URLs و models

✅ **Providers (OpenAI/Gemini)**:
- ساخت و پیکربندی provider
- دریافت اطلاعات provider
- فراخوانی API با پارامترهای صحیح
- پشتیبانی از modes مختلف (expert, fast, maps)
- مدیریت user context و conversation context
- Error handling

## نکات مهم

1. **Environment Variables**: تست‌های config از `vi.stubEnv` استفاده می‌کنند تا environment variables را mock کنند.
2. **Mocking API Clients**: تست‌های provider از `vi.mock()` برای mock کردن OpenAI و GoogleGenAI استفاده می‌کنند. API calls به صورت کامل mock می‌شوند تا نیاز به API key واقعی نباشد.
3. **Persian Numbers**: توجه داشته باشید که تست‌های formatting باید با فرمت فارسی اعداد (مثل `۱۵۰٬۰۰۰`) مطابقت داشته باشند.
4. **Error Logs**: پیام‌های خطا در console (stderr) طبیعی هستند و مربوط به تست‌های error handling هستند.

## افزودن تست‌های جدید

برای افزودن تست جدید:

1. فایل تست را در پوشه `__tests__` قرار دهید
2. از naming convention `*.test.ts` استفاده کنید
3. از Vitest API (`describe`, `it`, `expect`) استفاده کنید
4. برای mock کردن، از `vi.mock()` و `vi.fn()` استفاده کنید

### مثال:
```typescript
import { describe, it, expect } from 'vitest';
import { yourFunction } from '../your-file';

describe('YourFunction', () => {
  it('should do something', () => {
    const result = yourFunction('input');
    expect(result).toBe('expected');
  });
});
```

