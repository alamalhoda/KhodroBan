## TODOهای مربوط به سرویس هوش مصنوعی (AI)

این فایل لیست کارهای باز و موقت‌هایی است که برای ساده‌سازی فرانت‌اند انجام شده تا بعداً بتوانیم پیاده‌سازی نهایی را کامل کنیم.

### 1. وضعیت فعلی (موقت / Mock)

- **حذف Gemini از مسیر فرانت‌اند**
  - در `shared/services/ai/index.ts` دیگر از `GeminiProvider` استفاده نمی‌شود.
  - در `shared/services/ai/config.ts`، مقدار پیش‌فرض `VITE_AI_PROVIDER` از `gemini` به `openai` تغییر کرده است.
- **استفاده از نسخه‌ی Mock برای OpenAIProvider**
  - فایل `shared/services/ai/providers/openai.ts` اکنون یک **پیاده‌سازی Mock** است که:
    - هیچ ایمپورتی از پکیج `openai` انجام نمی‌دهد.
    - همیشه خود را `isConfigured = true` گزارش می‌کند.
    - در متد `analyzeCarIssue` فقط یک پاسخ تستی برمی‌گرداند که شامل:
      - متن ثابت توضیحی (این‌که نسخه‌ی Mock است).
      - اضافه‌کردن خلاصه‌ای از `userContext` (در صورت وجود) با `formatUserContextForPrompt`.
      - اضافه‌کردن متن `prompt` کاربر برای دیباگ/تست.
    - در `metadata` فیلد `mock: true` و `provider: 'openai-mock'` را ست می‌کند.
- **وضعیت فرانت‌اند Smart Assistant**
  - ویو `SmartAssistantView.vue` و استور `smartAssistant.js` از `aiService.analyzeCarIssue` استفاده می‌کنند اما در حال حاضر این سرویس صرفاً به نسخه‌ی Mock `OpenAIProvider` متصل است.

### 2. کارهایی که بعداً باید انجام شود

#### 2.1. بازگرداندن و تکمیل پشتیبانی Gemini

- **فعال‌سازی دوباره `GeminiProvider`**
  - بازگرداندن ایمپورت `GeminiProvider` در `shared/services/ai/index.ts`.
  - اصلاح `createAIProvider` تا دوباره case مربوط به `gemini` را مدیریت کند.
- **بررسی و تثبیت پکیج `@google/genai`**
  - تصمیم‌گیری نهایی درباره‌ی این‌که:
    - آیا `@google/genai` فقط در backend استفاده شود (ترجیح امنیتی)، و
    - یا یک لایه‌ی proxy/bff بین فرانت و Gemini قرار بگیرد تا API key در مرورگر لو نرود.
  - اگر `@google/genai` فقط سروری باشد:
    - اطمینان از این‌که هیچ import مستقیمی از این پکیج در باندل فرانت (`frontend-vue`) انجام نشود.
    - جا‌به‌جا کردن `GeminiProvider` به لایه‌ی backend مناسب، یا ایجاد نسخه‌ی مجزا برای backend.

#### 2.2. پیاده‌سازی واقعی OpenAI / OpenRouter

- **حذف نسخه‌ی Mock و بازگرداندن نسخه‌ی واقعی**
  - جایگزین کردن محتوای فعلی `shared/services/ai/providers/openai.ts` با نسخه‌ای که:
    - از SDK رسمی `openai` (یا فقط `fetch`) استفاده می‌کند.
    - پیکربندی‌های `baseURL`, `defaultModels` و ... را از `AIProviderConfig` می‌گیرد.
  - اگر قرار است همچنان از SDK رسمی `openai` در فرانت استفاده شود:
    - بررسی دقیق داکیومنت رسمی برای استفاده در مرورگر (`dangerouslyAllowBrowser`) و ریسک‌های امنیتی.
    - **ترجیحاً** به‌جای آن:
      - یک endpoint backend (مثلاً در SvelteKit یا سرویس Node) بسازیم که درخواست‌های فرانت را به OpenAI/OpenRouter فوروارد کند.
      - در این صورت:
        - API Key فقط در backend نگهداری می‌شود.
        - فرانت فقط به endpoint داخلی (مثلاً `/api/ai/analyze-car-issue`) درخواست می‌فرستد.
- **همگام‌سازی با `.env`**
  - تنظیم و مستندسازی متغیرهای زیر (نمونه):
    - `VITE_AI_PROVIDER=openai` یا `openrouter`
    - `VITE_AI_API_KEY` (اگر قرار است در backend فقط استفاده شود، این را به فضای backend منتقل کنیم و نسخه‌ی VITE-y آن را حذف/تغییر دهیم).
    - `VITE_OPENAI_API_URL` یا `VITE_OPENROUTER_API_URL` در صورت نیاز.
    - `VITE_AI_MODEL_EXPERT`, `VITE_AI_MODEL_FAST`, `VITE_AI_MODEL_MAPS` برای مدل‌های پیش‌فرض.

#### 2.3. تمیزکاری Vite و وابستگی‌ها

- **بهینه‌سازی `frontend-vue/vite.config.js`**
  - بررسی این‌که آیا هنوز لازم است `openai` و `persian-date` در `optimizeDeps.include` باقی بمانند یا خیر.
    - اگر `openai` فقط در backend استفاده شود یا با `fetch` دستی جایگزین شود، می‌توان آن را از این لیست و حتی از `dependencies` حذف کرد.
- **مرور `package.json`**
  - اگر در نسخه‌ی نهایی از `@google/genai` در فرانت استفاده نشود، آن را از `dependencies` فرانت حذف کنیم.
  - بررسی نیاز واقعی به `persian-date` در UI (اگر استفاده نمی‌شود، حذف برای کاهش حجم وابستگی‌ها).

#### 2.4. تست و پوشش‌دهی

- **به‌روزرسانی تست‌ها**
  - فایل `shared/services/ai/__tests__/providers.test.ts` اکنون تست‌هایی برای نسخه‌ی واقعی OpenAI/Gemini دارد.
  - وقتی پیاده‌سازی واقعی برگردد:
    - تست‌ها را با وضعیت جدید هماهنگ کنیم (یا تست‌های جدید برای لایه‌ی backend بنویسیم).
  - اگر قرار است نسخه‌ی Mock برای فرانت حفظ شود:
    - تست جداگانه‌ای برای رفتار Mock (مثلاً برگرداندن `metadata.mock === true`) اضافه شود.

#### 2.5. تکمیل تجربه‌ی Smart Assistant

- **اتصال مکالمه‌ی واقعی به AI**
  - زمانی که backend/Proxy واقعی برای AI آماده شد:
    - `aiService.analyzeCarIssue` را به endpoint واقعی متصل کنیم.
    - مطمئن شویم ساختار پاسخ (`text`, `groundingChunks`, `metadata`) با چیزی که فرانت انتظار دارد سازگار است.
- **مدیریت خطا و وضعیت‌ها**
  - طراحی استراتژی نهایی برای:
    - نمایش خطاهای شبکه / rate limit به کاربر.
    - هندل‌کردن timeouts و retryها.
    - لاگ‌کردن خطاها در backend برای تشخیص مشکلات.

