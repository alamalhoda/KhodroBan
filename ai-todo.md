## TODOهای مربوط به سرویس هوش مصنوعی (AI)

این فایل لیست کارهای باز و وضعیت فعلی سرویس AI را شرح می‌دهد.

### 0. مسیر Backend-first (Django، فعال با VITE_BACKEND_TYPE=django)

- **وضعیت:** پیاده‌سازی شده.
- **Backend:** اپ `ai_assistant` با endpointهای `/api/ai/sessions/`، `/api/ai/sessions/<id>/messages/`، `/api/ai/sessions/<id>/messages/send/`، `/api/ai/providers/`.
- **فرانت:** با `VITE_BACKEND_TYPE=django` و `VITE_API_URL` pointing به Django، Smart Assistant از `aiAssistantService` و همین APIها استفاده می‌کند (session + send message). تاریخچه و context سمت سرور مدیریت می‌شود.
- **تنظیمات سرور:** `AI_DEFAULT_PROVIDER`، `AI_OPENAI_BASE_URL`، `AI_OPENAI_API_KEY` (یا معادل openrouter/zai). ر.ک. `docs/technical/ai-proxy-setup.md` و `docs/development/API_CONTRACT_REGISTRY.md`.

### 1. وضعیت فعلی (Mock + اتصال واقعی به Proxy) — مسیر legacy

- **دو حالت پشتیبانی‌شده**
  1. **Mock**: با `VITE_AI_USE_MOCK=true` فقط پاسخ تستی برمی‌گردد (بدون فراخوانی بیرونی). برای dev/demo.
  2. **واقعی از طریق Proxy**: با تنظیم `VITE_AI_PROXY_URL` یا `VITE_OPENROUTER_API_URL` / `VITE_OPENAI_API_URL` به آدرس proxy (مثلاً Supabase Edge Function `ai-proxy`)، درخواست واقعی به `/chat/completions` ارسال می‌شود. API Key در سرور (Supabase Secrets) نگهداری می‌شود.
- **تعویض سرویس‌دهنده**
  - فرانت به یک **URL پایه** وابسته است، نه به نام سرویس. برای استفاده از سرویس دیگری (غیر از Supabase) کافی است همان URL را در env عوض کنید (مثلاً به یک BFF یا سرویس دیگر).
- **حذف Gemini از مسیر فرانت‌اند**
  - در `shared/services/ai/index.ts` فقط `OpenAIProvider` (openai/openrouter) استفاده می‌شود. پشتیبانی Gemini در صورت نیاز در backend/proxy انجام می‌شود.
- **وضعیت فرانت‌اند Smart Assistant**
  - ویو و استور از `aiService.analyzeCarIssue` استفاده می‌کنند. با Mock پاسخ تستی، با Proxy پاسخ واقعی از AI دریافت می‌شود.

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

#### 2.2. پیاده‌سازی واقعی OpenAI / OpenRouter (انجام‌شده)

- **Mock حفظ شده؛ مسیر واقعی اضافه شده**
  - `shared/services/ai/providers/openai.ts`: با `useMock=true` پاسخ Mock؛ با `baseURL` (مثلاً Supabase ai-proxy) فراخوانی واقعی به `/chat/completions` با `fetch`. API Key در حالت proxy از فرانت ارسال نمی‌شود.
- **همگام‌سازی با `.env`**
  - **Mock**: `VITE_AI_USE_MOCK=true` (نیازی به API Key یا URL نیست).
  - **واقعی با Proxy (مثلاً Supabase)**:
    - `VITE_AI_PROVIDER=openai` یا `openrouter`
    - `VITE_AI_PROXY_URL` یا `VITE_OPENROUTER_API_URL` یا `VITE_OPENAI_API_URL` = آدرس proxy (مثلاً `https://YOUR_PROJECT_REF.supabase.co/functions/v1/ai-proxy`)
    - `VITE_AI_API_KEY` در حالت proxy لازم نیست (می‌توان خالی یا dummy باشد).
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
  - با تنظیم proxy (مثلاً Supabase ai-proxy)، `aiService.analyzeCarIssue` به همان proxy درخواست می‌فرستد و پاسخ واقعی دریافت می‌کند. ساختار پاسخ (`text`, `groundingChunks`, `metadata`) با فرانت سازگار است.
- **مدیریت خطا و وضعیت‌ها**
  - طراحی استراتژی نهایی برای:
    - نمایش خطاهای شبکه / rate limit به کاربر.
    - هندل‌کردن timeouts و retryها.
    - لاگ‌کردن خطاها در backend برای تشخیص مشکلات.

