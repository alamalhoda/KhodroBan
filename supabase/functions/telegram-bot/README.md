# Edge Function: telegram-bot

این Edge Function به عنوان **Webhook برای ربات تلگرام** عمل می‌کند و دستورات `/start` و `/status` را پردازش می‌کند.

## ⚠️ تفکیک مسئولیت‌ها

این function **مستقل** از سایر Edge Function‌های اعلان است:
- **telegram-bot**: مدیریت اتصال کاربران و دستورات ربات (Webhook)
- **send-telegram-notification**: ارسال اعلان‌های یادآوری از طریق تلگرام

این دو function مسئولیت‌های کاملاً متفاوتی دارند و مستقل از هم کار می‌کنند.

## 📋 عملکرد

1. **دریافت Updates:** از Telegram Webhook Updates دریافت می‌کند
2. **پردازش دستورات:** دستورات `/start` و `/status` را پردازش می‌کند
3. **اتصال کاربران:** با استفاده از کد یکتا، کاربران را به حساب KhodroBan متصل می‌کند
4. **ذخیره chat_id:** `chat_id` را در جدول `telegram_settings` ذخیره می‌کند

## ⚙️ تنظیمات

### 1. تنظیم Secrets در Supabase

قبل از deploy function، باید Secrets زیر را در Supabase Dashboard تنظیم کنید:

1. به **Project Settings** > **Vault** بروید
2. این Secrets را اضافه کنید:

**Secret 1:**
- Name: `TELEGRAM_BOT_TOKEN`
- Value: توکن ربات تلگرام از BotFather

**Secret 2:**
- Name: `SERVICE_ROLE_KEY` (اگر قبلاً تنظیم نشده)
- Value: Service Role Key از **Settings** > **API**

### 2. Deploy Function

#### روش A: از Dashboard (پیشنهادی)

1. به **Edge Functions** > **New Function** بروید
2. در صفحه Editor:
   - **Function name**: `telegram-bot`
   - **File name**: `index.ts`
   - کد موجود در `supabase/functions/telegram-bot/index.ts` را کپی کنید
3. روی **Deploy function** کلیک کنید

#### روش B: از CLI

```bash
supabase functions deploy telegram-bot
```

### 3. تنظیم Webhook در BotFather

بعد از deploy function:

1. **دریافت URL:**
   ```
   https://YOUR_PROJECT_REF.supabase.co/functions/v1/telegram-bot
   ```

2. **تنظیم Webhook:**
   - به `@BotFather` در تلگرام پیام بدهید
   - دستور `/setwebhook` را بزنید
   - URL را ارسال کنید

3. **بررسی Webhook:**
   ```
   /getwebhookinfo
   ```

## 🧪 تست

### تست دستی

```bash
curl -X POST \
  'https://YOUR_PROJECT_REF.supabase.co/functions/v1/telegram-bot' \
  -H 'Content-Type: application/json' \
  -d '{
    "update_id": 123456789,
    "message": {
      "message_id": 1,
      "from": {
        "id": 123456789,
        "is_bot": false,
        "first_name": "Test"
      },
      "chat": {
        "id": 123456789,
        "type": "private"
      },
      "text": "/start TESTCODE123",
      "date": 1234567890
    }
  }'
```

## 🔧 عیب‌یابی

### مشکل: Webhook کار نمی‌کند

**بررسی:**
- URL را از `/getwebhookinfo` چک کنید
- لاگ‌های Edge Function را ببینید
- مطمئن شوید Secrets تنظیم شده‌اند

### مشکل: پیام ارسال نمی‌شود

**بررسی:**
- `TELEGRAM_BOT_TOKEN` در Secrets تنظیم شده باشد
- لاگ‌های Edge Function را بررسی کنید

---

**تاریخ ایجاد:** ۱۴۰۴/۱۱/۰۵  
**وضعیت:** ✅ آماده استفاده

