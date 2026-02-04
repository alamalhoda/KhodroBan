# Edge Function: check-reminders

این Edge Function **فقط** برای **بررسی یادآورها (Reminders)** و **ایجاد نوتیفیکیشن‌ها (Notifications)** استفاده می‌شود.

## 📋 مفاهیم

### Reminder (یادآور)
- منطق و محاسبه اینکه چه زمانی باید یادآوری شود
- بررسی خودروهای نیازمند یادآوری
- محاسبه روزهای مانده تا موعد سرویس

### Notification (اعلان)
- کانال‌های ارسال اعلان به کاربر
- در حال حاضر: تلگرام
- در آینده: Push Notification، SMS، Email، API خصوصی

## ⚠️ تفکیک مسئولیت‌ها

این function **فقط** یادآورها را بررسی و نوتیفیکیشن‌ها را در جدول ایجاد می‌کند.

**ارسال اعلان‌ها** توسط Edge Function جداگانه `send-notifications` انجام می‌شود.

## 🔄 عملکرد

1. **بررسی یادآورها:** از تابع دیتابیس `get_vehicles_for_reminder()` استفاده می‌کند
2. **محاسبه موعد:** برای هر خودرو، آخرین سرویس را بررسی و روزهای مانده را محاسبه می‌کند
3. **ایجاد نوتیفیکیشن:** اگر در بازه هشدار باشد، نوتیفیکیشن در جدول `notifications` ایجاد می‌کند (با `sent_at = NULL`)

## ⚙️ تنظیمات

### 1. تنظیم Secrets در Supabase

این function **نیازی به Secrets ندارد** چون فقط یادآورها را بررسی و نوتیفیکیشن‌ها را ایجاد می‌کند.

**نکته:** برای Cron Job، `SERVICE_ROLE_KEY` در Vault نیاز است (اما این برای فراخوانی function است، نه برای خود function).

### 2. Deploy Function

#### روش A: از Dashboard (پیشنهادی)

1. به [Supabase Dashboard](https://supabase.com/dashboard) بروید
2. پروژه خود را انتخاب کنید
3. به **Edge Functions** > **New Function** بروید
4. در صفحه Editor:
   - **Function name**: `check-reminders`
   - **File name**: `index.ts`
   - کد موجود در `supabase/functions/check-reminders/index.ts` را کپی کنید
5. روی **Deploy function** کلیک کنید

#### روش B: از CLI

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy function
supabase functions deploy check-reminders
```

### 3. تنظیم Cron Job

بعد از deploy function، migration `011_setup_reminder_cron.sql` را اجرا کنید:

```sql
-- در Supabase SQL Editor
-- فایل supabase/migrations/011_setup_reminder_cron.sql را اجرا کنید
```

این migration:
- Extension `pg_cron` و `pg_net` را فعال می‌کند
- Cron Job را برای فراخوانی Edge Function هر روز ساعت ۹ صبح تنظیم می‌کند

## 🧪 تست

### تست دستی از SQL Editor

```sql
-- فراخوانی دستی Edge Function
SELECT public.test_check_reminders();
```

### تست از HTTP Request

```bash
curl -X POST \
  'https://YOUR_PROJECT_REF.supabase.co/functions/v1/check-reminders' \
  -H 'Authorization: Bearer YOUR_SERVICE_ROLE_KEY' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### بررسی لاگ‌ها

```sql
-- مشاهده لاگ‌های Cron Job
SELECT * FROM cron.job_run_details 
WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'check-reminders')
ORDER BY start_time DESC 
LIMIT 10;
```

## 📊 Response Format

```json
{
  "success": true,
  "message": "Reminders checked and notifications created (not sent yet)",
  "processed": 5,
  "notificationsCreated": 3
}
```

**توجه:** این function اعلان ارسال نمی‌کند. اعلان‌ها توسط `send-notifications` ارسال می‌شوند.

## 🔧 تنظیم زمان اجرا

برای تغییر زمان اجرا Cron Job:

```sql
-- حذف Cron Job قبلی
SELECT cron.unschedule('check-reminders');

-- ایجاد Cron Job جدید با زمان متفاوت
SELECT cron.schedule(
  'check-reminders',
  '0 5:30 * * *', -- هر روز ساعت ۵:۳۰ UTC (9:00 IRST)
  $$
  SELECT net.http_post(
    url := public.get_supabase_function_url('check-reminders'),
    headers := jsonb_build_object(
      'Authorization', public.get_auth_header(),
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  );
  $$
);
```

## ⚠️ نکات مهم

1. **Secrets:** این function نیاز به Secrets ندارد (ارسال اعلان‌ها توسط `send-notifications` انجام می‌شود)
2. **Permissions:** Edge Function باید با Service Role Key اجرا شود (نه Anon Key)
3. **Error Handling:** خطاها در console log می‌شوند و در Supabase Dashboard قابل مشاهده هستند
4. **Separation of Concerns:** این function فقط یادآورها را بررسی می‌کند و اعلان ارسال نمی‌کند

## 🐛 عیب‌یابی

### مشکل: Function اجرا نمی‌شود

**بررسی:**
1. Secrets را در Vault چک کنید
2. Cron Job را در `cron.job` بررسی کنید:
   ```sql
   SELECT * FROM cron.job WHERE jobname = 'check-reminders';
   ```
3. لاگ‌های Cron Job را بررسی کنید

### مشکل: نوتیفیکیشن ایجاد نمی‌شود

**بررسی:**
1. تابع `get_vehicles_for_reminder()` کار می‌کند:
   ```sql
   SELECT * FROM get_vehicles_for_reminder();
   ```
2. خودروها سرویس دارند
3. در بازه هشدار هستند

---

**تاریخ ایجاد:** ۱۴۰۴/۱۱/۰۵  
**وضعیت:** ✅ آماده استفاده
