# Edge Function: ai-proxy

این Edge Function به عنوان **proxy برای API های AI** عمل می‌کند تا مشکل CORS حل شود.

## ⚠️ تفکیک مسئولیت‌ها

این function **مستقل** از سایر Edge Function‌ها است:
- **ai-proxy**: Proxy کردن درخواست‌های AI API (CORS و امنیت)
- **check-reminders**: بررسی یادآورها
- **send-notifications**: مدیریت ارسال اعلان‌ها
- **send-telegram-notification**: ارسال اعلان تلگرام
- **telegram-bot**: مدیریت Webhook ربات تلگرام

هر function مسئولیت کاملاً جداگانه‌ای دارد.

## تنظیمات

### 1. تنظیم Secrets در Supabase Dashboard

قبل از deploy function، باید Secrets را تنظیم کنید:

1. به [Supabase Dashboard](https://supabase.com/dashboard) بروید
2. پروژه خود را انتخاب کنید (`zwrzokyzjwircrhrtyyi`)
3. به بخش **Edge Functions** > **Settings** > **Secrets** بروید
4. روی **Add secret** کلیک کنید و این دو secret را اضافه کنید:

**Secret 1:**
- Name: `AI_API_KEY`
- Value: API Key خود را قرار دهید:
  - برای **xiaomimimo**: API Key خود را از xiaomimimo بگیرید
  - برای **OpenRouter**: API Key خود را از https://openrouter.ai/keys بگیرید
  - برای **OpenAI**: API Key خود را از https://platform.openai.com/api-keys بگیرید

**Secret 2:**
- Name: `AI_API_URL`
- Value: URL API مورد نظر:
  - برای **xiaomimimo**: `https://api.xiaomimimo.com/v1`
  - برای **OpenRouter**: `https://openrouter.ai/api/v1`
  - برای **OpenAI**: `https://api.openai.com/v1`

### 2. Deploy Function از Dashboard

#### روش A: Deploy از Dashboard (پیشنهادی - ساده‌تر)

1. به [Supabase Dashboard](https://supabase.com/dashboard) بروید
2. پروژه خود را انتخاب کنید
3. به **Edge Functions** > **New Function** بروید
   - یا مستقیم به: `https://supabase.com/dashboard/project/YOUR_PROJECT_REF/functions/new`
4. در صفحه Editor:
   - **Function name**: `ai-proxy` را وارد کنید (مهم است!)
   - **File name**: `index.ts` (پیش‌فرض - درست است)
   - کد موجود در `supabase/functions/ai-proxy/index.ts` را کپی و در Editor قرار دهید
5. مطمئن شوید که Secrets را قبلاً تنظیم کرده‌اید (مرحله 1)
6. روی دکمه سبز **"Deploy function"** کلیک کنید
7. منتظر بمانید تا deploy کامل شود

#### روش B: Deploy با CLI (پیشرفته)

```bash
# نصب Supabase CLI (اگر نصب ندارید)
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project (project-ref را از Dashboard بگیرید)
# project-ref: از URL Dashboard - https://supabase.com/dashboard/project/YOUR_PROJECT_REF
supabase link --project-ref YOUR_PROJECT_REF

# Deploy function
supabase functions deploy ai-proxy
```

**نکته**: اگر از CLI استفاده می‌کنید، باید Secrets را از CLI هم تنظیم کنید:

برای **xiaomimimo**:
```bash
supabase secrets set AI_API_KEY=your_xiaomimimo_api_key_here
supabase secrets set AI_API_URL=https://api.xiaomimimo.com/v1
```

برای **OpenRouter**:
```bash
supabase secrets set AI_API_KEY=your_openrouter_api_key_here
supabase secrets set AI_API_URL=https://openrouter.ai/api/v1
```

برای **OpenAI**:
```bash
supabase secrets set AI_API_KEY=your_openai_api_key_here
supabase secrets set AI_API_URL=https://api.openai.com/v1
```

### 3. استفاده در Frontend

در فایل `.env`:

برای **OpenRouter**:
```env
VITE_AI_PROVIDER=openrouter
# URL Supabase Edge Function (project-ref خود را جایگزین کنید)
VITE_OPENROUTER_API_URL=https://YOUR_PROJECT_REF.supabase.co/functions/v1/ai-proxy
# این API Key استفاده نمی‌شود (از Supabase secret استفاده می‌شود)
VITE_AI_API_KEY=dummy

# مدل‌های OpenRouter (می‌توانید مدل‌های مختلف را انتخاب کنید)
VITE_AI_MODEL_EXPERT=anthropic/claude-3.5-sonnet
VITE_AI_MODEL_FAST=anthropic/claude-3-haiku
VITE_AI_MODEL_MAPS=anthropic/claude-3-haiku
```

برای **xiaomimimo**:
```env
VITE_AI_PROVIDER=openai
VITE_OPENAI_API_URL=https://YOUR_PROJECT_REF.supabase.co/functions/v1/ai-proxy
VITE_AI_API_KEY=dummy
VITE_AI_MODEL_EXPERT=mimo-v2-flash
VITE_AI_MODEL_FAST=mimo-v2-flash
VITE_AI_MODEL_MAPS=mimo-v2-flash
```

برای **OpenAI استاندارد**:
```env
VITE_AI_PROVIDER=openai
VITE_OPENAI_API_URL=https://YOUR_PROJECT_REF.supabase.co/functions/v1/ai-proxy
VITE_AI_API_KEY=dummy
VITE_AI_MODEL_EXPERT=gpt-4-turbo-preview
VITE_AI_MODEL_FAST=gpt-3.5-turbo
VITE_AI_MODEL_MAPS=gpt-4-turbo-preview
```

## نحوه کار

1. Frontend درخواست را به Supabase Edge Function می‌فرستد: 
   `https://YOUR_PROJECT_REF.supabase.co/functions/v1/ai-proxy/chat/completions`

2. Edge Function path `/chat/completions` را استخراج می‌کند

3. درخواست را به API مورد نظر (xiaomimimo/OpenRouter/OpenAI) forward می‌کند:
   - xiaomimimo: `https://api.xiaomimimo.com/v1/chat/completions`
   - OpenRouter: `https://openrouter.ai/api/v1/chat/completions`
   - OpenAI: `https://api.openai.com/v1/chat/completions`

4. پاسخ برگشته و به frontend ارسال می‌شود

## امنیت

- ✅ API Key در Supabase Secrets نگهداری می‌شود (نه در frontend)
- ✅ می‌توانید authentication اضافه کنید (کد موجود را uncomment کنید)
- ✅ می‌توانید rate limiting اضافه کنید

## عیب‌یابی

### خطای "AI API Key not configured"
- بررسی کنید که `AI_API_KEY` در Supabase Secrets تنظیم شده باشد
- بعد از اضافه کردن secret، function را دوباره deploy کنید

### خطای 404
- بررسی کنید که function به درستی deploy شده باشد
- URL را بررسی کنید: باید شامل `/functions/v1/ai-proxy` باشد
- در Dashboard، به **Edge Functions** بروید و بررسی کنید که `ai-proxy` در لیست functions وجود دارد

### بررسی Deploy موفق

بعد از deploy، می‌توانید function را تست کنید:

1. به **Edge Functions** > **ai-proxy** بروید
2. در تب **Logs** می‌توانید لاگ‌های function را ببینید
3. URL function شما باید باشد:
   ```
   https://YOUR_PROJECT_REF.supabase.co/functions/v1/ai-proxy
   ```

### نکات مهم

- ✅ نام function **باید** `ai-proxy` باشد (نه چیز دیگری)
- ✅ نام فایل در Editor باید `index.ts` باشد
- ✅ Secrets را **قبل از deploy** تنظیم کنید
- ✅ بعد از تغییر Secrets، function را دوباره deploy کنید
