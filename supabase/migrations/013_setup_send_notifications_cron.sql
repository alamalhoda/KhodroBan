-- مهاجرت ۰۱۳: راه‌اندازی Cron Job برای ارسال اعلان‌ها
-- تاریخ ایجاد: ۱۴۰۴/۱۱/۰۵
-- هدف: اجرای دوره‌ای Edge Function send-notifications برای ارسال اعلان‌ها

-- 1. تابع کمکی برای تست دستی (اختیاری)
CREATE OR REPLACE FUNCTION public.test_send_notifications()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- این تابع می‌تواند برای تست دستی استفاده شود
  PERFORM net.http_post(
    url := public.get_supabase_function_url('send-notifications'),
    headers := jsonb_build_object(
      'Authorization', public.get_auth_header(),
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  );
END;
$$;

COMMENT ON FUNCTION public.test_send_notifications() IS 
'تابع تست برای فراخوانی دستی Edge Function send-notifications (ارسال اعلان‌ها از طریق کانال‌های مختلف)';

-- 2. مثال استفاده: ایجاد Cron Job برای ارسال اعلان‌ها
-- این Cron Job هر ۵۰ دقیقه یکبار اجرا می‌شود
-- ⚠️ قبل از اجرا، مطمئن شوید که Secret SERVICE_ROLE_KEY در Supabase Vault تنظیم شده است
-- برای راهنمای کامل مدیریت Cron Jobs، به فایل CRON-JOB.md مراجعه کنید

-- حذف Cron Job قبلی (اگر وجود داشته باشد)
SELECT cron.unschedule('send-notifications') WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'send-notifications'
);

-- ایجاد Cron Job برای ارسال اعلان‌ها (هر 50 دقیقه یکبار) با استفاده از Secrets از Vault
SELECT cron.schedule(
  'send-notifications',
  $$*/50 * * * *$$,
  $$
  SELECT net.http_post(
    url := public.get_supabase_function_url('send-notifications'),
    headers := jsonb_build_object(
      'Authorization', public.get_auth_header(),
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  );
  $$
);


-- 3. نکات مهم:
-- - برای استفاده از این Cron Job، باید Secrets زیر را در Supabase Vault تنظیم کنید:
--   1. SERVICE_ROLE_KEY: Service Role Key پروژه Supabase
--   2. TELEGRAM_BOT_TOKEN: توکن ربات تلگرام (در Edge Function استفاده می‌شود)
--
-- - برای راهنمای کامل مدیریت Cron Jobs، مشاهده لاگ‌ها و تنظیمات، به فایل CRON-JOB.md مراجعه کنید
