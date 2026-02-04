# سیستم یادآوری با Supabase Edge Functions

این مستند راهنمای استفاده از Supabase Edge Functions و pg_cron به جای Python Cron Job برای **بررسی یادآورها (Reminders)** و **ایجاد نوتیفیکیشن‌ها (Notifications)** است.

---

## 🎯 مزایا استفاده از Edge Functions

✅ **همه چیز در Supabase:** نیازی به سرور جداگانه نیست  
✅ **مدیریت راحت‌تر:** همه چیز در یک پلتفرم  
✅ **مقیاس‌پذیری:** Supabase به صورت خودکار scale می‌کند  
✅ **هزینه کمتر:** نیازی به سرور جداگانه برای Python نیست  
✅ **امنیت بهتر:** Secrets در Supabase Vault نگهداری می‌شوند  

---

## 📋 فهرست مطالب

1. [مراحل راه‌اندازی](#مراحل-راه‌اندازی)
2. [تنظیم Secrets](#تنظیم-secrets)
3. [Deploy Edge Function](#deploy-edge-function)
4. [تنظیم Cron Job](#تنظیم-cron-job)
5. [تست سیستم](#تست-سیستم)
6. [عیب‌یابی](#عیب‌یابی)

---

## 🚀 مراحل راه‌اندازی

### مرحله ۱: تنظیم Secrets در Supabase Vault

1. به [Supabase Dashboard](https://supabase.com/dashboard) بروید
2. پروژه خود را انتخاب کنید
3. به **Project Settings** > **Vault** بروید
4. این Secrets را اضافه کنید:

**Secret 1: TELEGRAM_BOT_TOKEN**
- Name: `TELEGRAM_BOT_TOKEN`
- Value: توکن ربات تلگرام از BotFather
  ```
  123456789:ABCdefGHIjklMNOpqrsTUVwxyz
  ```

**Secret 2: SERVICE_ROLE_KEY** (برای Cron Job)
- Name: `SERVICE_ROLE_KEY`
- Value: Service Role Key از **Settings** > **API** > **service_role key**

---

### مرحله ۲: Deploy Edge Function

#### روش A: از Dashboard (پیشنهادی)

1. به **Edge Functions** > **New Function** بروید
2. در صفحه Editor:
   - **Function name**: `check-reminders`
   - **File name**: `index.ts`
   - کد موجود در `supabase/functions/check-reminders/index.ts` را کپی کنید
3. مطمئن شوید که Secrets را قبلاً تنظیم کرده‌اید
4. روی **Deploy function** کلیک کنید

#### روش B: از CLI

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy function
supabase functions deploy check-reminders
```

**نکته:** `PROJECT_REF` را از URL Dashboard می‌توانید بگیرید:
```
https://supabase.com/dashboard/project/YOUR_PROJECT_REF
```

---

### مرحله ۳: اجرای Migration

Migration `011_setup_reminder_cron.sql` را در Supabase SQL Editor اجرا کنید:

```sql
-- این migration:
-- 1. Extension pg_cron و pg_net را فعال می‌کند
-- 2. تابع تست را ایجاد می‌کند
```

**⚠️ مهم:** برای تنظیم Cron Job، باید به صورت دستی در SQL Editor انجام دهید (به دلیل محدودیت‌های pg_cron با Secrets).

---

### مرحله ۴: تنظیم Cron Job

در Supabase SQL Editor، این کد را اجرا کنید (باید `PROJECT_REF` و `SERVICE_ROLE_KEY` را جایگزین کنید):

```sql
-- 1. فعال کردن extensions (اگر قبلاً فعال نشده باشند)
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 2. حذف Cron Job قبلی (اگر وجود داشته باشد)
SELECT cron.unschedule('check-reminders') WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'check-reminders'
);

-- 3. ایجاد Cron Job جدید
-- ⚠️ PROJECT_REF و SERVICE_ROLE_KEY را جایگزین کنید!
SELECT cron.schedule(
  'check-reminders',
  '0 9 * * *', -- هر روز ساعت ۹ صبح UTC (12:30 ظهر ایران)
  $$
  SELECT net.http_post(
    url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/check-reminders',
    headers := jsonb_build_object(
      'Authorization', 'Bearer YOUR_SERVICE_ROLE_KEY_HERE',
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  );
  $$
);
```

**نکات:**
- `YOUR_PROJECT_REF`: از URL Dashboard بگیرید
- `YOUR_SERVICE_ROLE_KEY_HERE`: از Settings > API > service_role key بگیرید
- برای تغییر زمان: `'0 5:30 * * *'` = 9:00 IRST (5:30 UTC)

---

## 🧪 تست سیستم

### تست ۱: تست دستی Edge Function

```sql
-- در SQL Editor
SELECT public.test_check_reminders();
```

یا از HTTP Request:

```bash
curl -X POST \
  'https://YOUR_PROJECT_REF.supabase.co/functions/v1/check-reminders' \
  -H 'Authorization: Bearer YOUR_SERVICE_ROLE_KEY' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### تست ۲: بررسی Cron Job

```sql
-- مشاهده Cron Jobs
SELECT * FROM cron.job WHERE jobname = 'check-reminders';

-- مشاهده لاگ‌های اجرا
SELECT * FROM cron.job_run_details 
WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'check-reminders')
ORDER BY start_time DESC 
LIMIT 10;
```

### تست ۳: بررسی نتایج

```sql
-- بررسی نوتیفیکیشن‌های ایجاد شده
SELECT * FROM notifications 
WHERE type = 'reminder' 
ORDER BY created_at DESC 
LIMIT 10;

-- بررسی تنظیمات تلگرام
SELECT * FROM telegram_settings WHERE is_enabled = true;
```

---

## 🔧 تنظیمات پیشرفته

### تغییر زمان اجرا

```sql
-- حذف Cron Job قبلی
SELECT cron.unschedule('check-reminders');

-- ایجاد با زمان جدید
SELECT cron.schedule(
  'check-reminders',
  '0 5:30 * * *', -- هر روز ساعت ۵:۳۰ UTC (9:00 IRST)
  $$
  SELECT net.http_post(
    url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/check-reminders',
    headers := jsonb_build_object(
      'Authorization', 'Bearer YOUR_SERVICE_ROLE_KEY_HERE',
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  );
  $$
);
```

### اجرای هر ۶ ساعت

```sql
SELECT cron.schedule(
  'check-reminders',
  '0 */6 * * *', -- هر ۶ ساعت
  -- ... بقیه کد
);
```

---

## 🐛 عیب‌یابی

### مشکل ۱: Edge Function اجرا نمی‌شود

**بررسی:**
1. Secrets را در Vault چک کنید
2. Function را در Dashboard بررسی کنید
3. لاگ‌های Function را در Dashboard ببینید

### مشکل ۲: Cron Job اجرا نمی‌شود

**بررسی:**
```sql
-- بررسی Cron Job
SELECT * FROM cron.job WHERE jobname = 'check-reminders';

-- بررسی لاگ‌ها
SELECT * FROM cron.job_run_details 
WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'check-reminders')
ORDER BY start_time DESC;
```

**راه‌حل:**
- مطمئن شوید `pg_cron` و `pg_net` فعال هستند
- URL و SERVICE_ROLE_KEY را دوباره چک کنید

### مشکل ۳: پیام تلگرام ارسال نمی‌شود

**بررسی:**
1. `TELEGRAM_BOT_TOKEN` در Secrets تنظیم شده باشد
2. کاربر `chat_id` در `telegram_settings` داشته باشد
3. `is_enabled = true` باشد

**تست:**
```sql
-- بررسی تنظیمات تلگرام
SELECT * FROM telegram_settings WHERE is_enabled = true;
```

### مشکل ۴: نوتیفیکیشن ایجاد نمی‌شود

**بررسی:**
```sql
-- تست تابع دیتابیس
SELECT * FROM get_vehicles_for_reminder();

-- بررسی خودروها و سرویس‌ها
SELECT v.*, rs.* 
FROM vehicles v
JOIN reminder_settings rs ON v.vehicle_id = rs.vehicle_id
WHERE rs.is_enabled = TRUE;
```

---

## 📊 مانیتورینگ

### مشاهده لاگ‌های Edge Function

1. به **Edge Functions** > **check-reminders** > **Logs** بروید
2. لاگ‌های real-time را مشاهده کنید

### مشاهده لاگ‌های Cron Job

```sql
SELECT 
  jobid,
  runid,
  job_pid,
  database,
  username,
  command,
  status,
  return_message,
  start_time,
  end_time
FROM cron.job_run_details
WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'check-reminders')
ORDER BY start_time DESC
LIMIT 20;
```

---

## ✅ چک‌لیست نهایی

- [ ] Secrets در Vault تنظیم شدند (`TELEGRAM_BOT_TOKEN`, `SERVICE_ROLE_KEY`)
- [ ] Edge Function `check-reminders` deploy شد
- [ ] Extensions `pg_cron` و `pg_net` فعال شدند
- [ ] Cron Job با `PROJECT_REF` و `SERVICE_ROLE_KEY` صحیح تنظیم شد
- [ ] تست دستی موفق بود
- [ ] Cron Job در حال اجرا است
- [ ] نوتیفیکیشن‌ها ایجاد می‌شوند
- [ ] پیام‌های تلگرام ارسال می‌شوند

---

## 📝 نکات مهم

1. **امنیت:** هرگز `SERVICE_ROLE_KEY` را در کد commit نکنید
2. **Secrets:** از Supabase Vault برای نگهداری Secrets استفاده کنید
3. **Rate Limiting:** تلگرام محدودیت ۳۰ پیام/ثانیه دارد
4. **Error Handling:** خطاها در console log می‌شوند

---

**تاریخ ایجاد:** ۱۴۰۴/۱۱/۰۵  
**وضعیت:** ✅ آماده استفاده  
**جایگزین:** Python Cron Job

