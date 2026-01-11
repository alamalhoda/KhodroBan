# Edge Function: send-notifications

این Edge Function برای **ارسال اعلان‌ها از طریق کانال‌های مختلف** استفاده می‌شود.

## 📋 مفاهیم

### Reminder (یادآور)
- منطق و محاسبه اینکه چه زمانی باید یادآوری شود
- توسط Edge Function `check-reminders` انجام می‌شود

### Notification (اعلان)
- کانال‌های ارسال اعلان به کاربر
- توسط این Edge Function (`send-notifications`) انجام می‌شود
- کانال‌های فعلی: تلگرام
- کانال‌های آینده: SMS، Email، Push Notification، API خصوصی

## 🔄 عملکرد

1. **خواندن نوتیفیکیشن‌های ارسال نشده:** از جدول `notifications` که `sent_at IS NULL`
2. **فراخوانی Edge Function‌های کانال‌ها:** برای هر کانال، Edge Function مستقل را فراخوانی می‌کند
   - تلگرام: `send-telegram-notification`
   - SMS: `send-sms-notification` (آینده)
   - Email: `send-email-notification` (آینده)
   - Push: `send-push-notification` (آینده)
   - API: `send-api-notification` (آینده)
3. **مدیریت وضعیت:** هر Edge Function کانال، خودش وضعیت را در `notification_channels` به‌روزرسانی می‌کند

## ⚙️ تنظیمات

### 1. تنظیم Secrets در Supabase

**توجه:** این function خودش Secrets نیاز ندارد. هر Edge Function کانال (مثل `send-telegram-notification`) Secrets خودش را دارد.

برای Cron Job:
- Name: `SERVICE_ROLE_KEY`
- Value: Service Role Key از **Settings** > **API**

### 2. Deploy Function

#### روش A: از Dashboard (پیشنهادی)

1. به [Supabase Dashboard](https://supabase.com/dashboard) بروید
2. پروژه خود را انتخاب کنید
3. به **Edge Functions** > **New Function** بروید
4. در صفحه Editor:
   - **Function name**: `send-notifications`
   - **File name**: `index.ts`
   - کد موجود در `supabase/functions/send-notifications/index.ts` را کپی کنید
5. روی **Deploy function** کلیک کنید

#### روش B: از CLI

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy function
supabase functions deploy send-notifications
```

### 3. تنظیم Cron Job

بعد از deploy function، migration `013_setup_send_notifications_cron.sql` را اجرا کنید.

## 🧪 تست

### تست دستی از SQL Editor

```sql
-- فراخوانی دستی Edge Function
SELECT public.test_send_notifications();
```

### تست از HTTP Request

```bash
curl -X POST \
  'https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-notifications' \
  -H 'Authorization: Bearer YOUR_SERVICE_ROLE_KEY' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

## 📊 Response Format

```json
{
  "success": true,
  "message": "Notifications processed and sent",
  "processed": 10,
  "telegramSent": 8,
  "telegramFailed": 2
}
```

## 🔧 تنظیم زمان اجرا

این function باید به صورت دوره‌ای (مثلاً هر 5 دقیقه) اجرا شود تا اعلان‌های جدید را ارسال کند.

```sql
-- حذف Cron Job قبلی
SELECT cron.unschedule('send-notifications');

-- ایجاد Cron Job جدید (هر 5 دقیقه)
SELECT cron.schedule(
  'send-notifications',
  '*/5 * * * *', -- هر 5 دقیقه
  $$
  SELECT net.http_post(
    url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-notifications',
    headers := jsonb_build_object(
      'Authorization', 'Bearer YOUR_SERVICE_ROLE_KEY_HERE',
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  );
  $$
);
```

## ⚠️ نکات مهم

1. **Secrets:** هر Edge Function کانال Secrets خودش را دارد (مثلاً `send-telegram-notification` نیاز به `TELEGRAM_BOT_TOKEN` دارد)
2. **Permissions:** Edge Function باید با Service Role Key اجرا شود (نه Anon Key)
3. **Separation of Concerns:** هر کانال یک Edge Function مستقل دارد که می‌تواند به صورت جداگانه تست و deploy شود
4. **Retry Logic:** اگر ارسال ناموفق باشد، در اجرای بعدی دوباره تلاش می‌کند
5. **Batch Size:** هر بار حداکثر 100 نوتیفیکیشن پردازش می‌شود
6. **Function Calls:** این function سایر Edge Function‌های کانال را فراخوانی می‌کند

## 🐛 عیب‌یابی

### مشکل: Function اجرا نمی‌شود

**بررسی:**
1. Secrets را در Vault چک کنید
2. Cron Job را در `cron.job` بررسی کنید
3. لاگ‌های Cron Job را بررسی کنید

### مشکل: پیام تلگرام ارسال نمی‌شود

**بررسی:**
1. Edge Function `send-telegram-notification` deploy شده باشد
2. `TELEGRAM_BOT_TOKEN` در Secrets تنظیم شده باشد (برای `send-telegram-notification`)
3. کاربر `chat_id` در `telegram_settings` داشته باشد
4. `is_enabled = true` باشد
5. نوتیفیکیشن در جدول `notifications` وجود داشته باشد و `sent_at IS NULL`
6. لاگ‌های `send-telegram-notification` را بررسی کنید

### مشکل: نوتیفیکیشن‌ها پردازش نمی‌شوند

**بررسی:**
```sql
-- بررسی نوتیفیکیشن‌های ارسال نشده
SELECT * FROM notifications 
WHERE sent_at IS NULL 
ORDER BY created_at DESC 
LIMIT 10;

-- بررسی وضعیت کانال‌ها
SELECT id, notification_channels, sent_at 
FROM notifications 
WHERE notification_channels IS NOT NULL;
```

---

**تاریخ ایجاد:** ۱۴۰۴/۱۱/۰۵  
**وضعیت:** ✅ آماده استفاده
