-- مهاجرت ۰۱۱: راه‌اندازی Cron Job برای یادآوری‌های سرویس دوره‌ای
-- تاریخ ایجاد: ۱۴۰۴/۱۱/۰۵
-- هدف: استفاده از pg_cron برای فراخوانی Edge Function به جای Python Cron Job

-- 1. فعال کردن extension pg_cron (اگر قبلاً فعال نشده باشد)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 2. فعال کردن extension pg_net برای درخواست‌های HTTP
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 3. حذف Cron Job قبلی (اگر وجود داشته باشد)
SELECT cron.unschedule('check-reminders') WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'check-reminders'
);

-- 4. مثال استفاده: ایجاد Cron Job برای فراخوانی Edge Function
-- این Cron Job هر روز ساعت ۹ صبح (UTC) اجرا می‌شود
-- برای تنظیم زمان محلی ایران (UTC+3:30)، می‌توانید از '0 5:30 * * *' استفاده کنید (9:00 IRST = 5:30 UTC)
-- ⚠️ قبل از اجرا، مطمئن شوید که Secret SERVICE_ROLE_KEY در Supabase Vault تنظیم شده است
-- برای راهنمای کامل مدیریت Cron Jobs، به فایل CRON-JOB.md مراجعه کنید

-- مرحله 1: حذف Cron Job قبلی (اگر وجود داشته باشد)
SELECT cron.unschedule('check-reminders') WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'check-reminders'
);

-- مرحله 2: ایجاد Cron Job جدید با استفاده از Secrets از Vault
SELECT cron.schedule(
  'check-reminders',
  '0 9 * * *', -- هر روز ساعت ۹ صبح UTC (12:30 ظهر ایران)
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

-- مرحله 3: بررسی Cron Job ایجاد شده
SELECT * FROM cron.job WHERE jobname = 'check-reminders';


-- 5. کامنت برای مستندسازی
COMMENT ON EXTENSION pg_cron IS 'Extension برای اجرای Cron Jobs در PostgreSQL';
COMMENT ON EXTENSION pg_net IS 'Extension برای ارسال درخواست‌های HTTP از PostgreSQL';

-- 6. توابع کمکی برای تست و دیباگ

-- تابع برای بررسی وجود Secrets در Vault
CREATE OR REPLACE FUNCTION public.check_vault_secrets()
RETURNS TABLE(
  secret_name TEXT,
  exists BOOLEAN,
  has_value BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    'SUPABASE_URL'::TEXT,
    EXISTS(SELECT 1 FROM vault.decrypted_secrets WHERE name = 'SUPABASE_URL'),
    COALESCE((SELECT decrypted_secret IS NOT NULL AND decrypted_secret != '' FROM vault.decrypted_secrets WHERE name = 'SUPABASE_URL' LIMIT 1), false);
  
  RETURN QUERY
  SELECT 
    'SERVICE_ROLE_KEY'::TEXT,
    EXISTS(SELECT 1 FROM vault.decrypted_secrets WHERE name = 'SERVICE_ROLE_KEY'),
    COALESCE((SELECT decrypted_secret IS NOT NULL AND decrypted_secret != '' FROM vault.decrypted_secrets WHERE name = 'SERVICE_ROLE_KEY' LIMIT 1), false);
END;
$$;

COMMENT ON FUNCTION public.check_vault_secrets() IS 
'بررسی وجود و مقدار Secrets در Vault. استفاده: SELECT * FROM public.check_vault_secrets();';

-- تابع کمکی برای تست دستی با خروجی کامل
-- این تابع درخواست HTTP را ارسال می‌کند و request_id را برمی‌گرداند
-- برای مشاهده پاسخ، باید از لاگ‌های Edge Function یا بررسی جدول notifications استفاده کنید
CREATE OR REPLACE FUNCTION public.test_check_reminders()
RETURNS TABLE(
  request_id BIGINT,
  function_url TEXT,
  secrets_status TEXT,
  error_message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_request_id BIGINT;
  v_supabase_url TEXT;
  v_auth_header TEXT;
  v_function_url TEXT;
  v_secrets_ok BOOLEAN := true;
  v_secrets_error TEXT;
BEGIN
  -- بررسی وجود Secrets
  BEGIN
    v_supabase_url := public.get_supabase_url();
    IF v_supabase_url IS NULL OR v_supabase_url = '' THEN
      v_secrets_ok := false;
      v_secrets_error := 'SUPABASE_URL در Vault تنظیم نشده است';
    END IF;
  EXCEPTION WHEN OTHERS THEN
    v_secrets_ok := false;
    v_secrets_error := 'خطا در خواندن SUPABASE_URL: ' || SQLERRM;
  END;
  
  IF v_secrets_ok THEN
    BEGIN
      v_auth_header := public.get_auth_header();
      IF v_auth_header IS NULL OR v_auth_header = '' THEN
        v_secrets_ok := false;
        v_secrets_error := 'SERVICE_ROLE_KEY در Vault تنظیم نشده است';
      END IF;
    EXCEPTION WHEN OTHERS THEN
      v_secrets_ok := false;
      v_secrets_error := 'خطا در خواندن SERVICE_ROLE_KEY: ' || SQLERRM;
    END;
  END IF;
  
  IF NOT v_secrets_ok THEN
    RETURN QUERY SELECT 
      NULL::BIGINT,
      NULL::TEXT,
      ('❌ خطا: ' || v_secrets_error)::TEXT,
      v_secrets_error;
    RETURN;
  END IF;
  
  -- ساخت URL Edge Function
  BEGIN
    v_function_url := public.get_supabase_function_url('check-reminders');
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 
      NULL::BIGINT,
      NULL::TEXT,
      '❌ خطا در ساخت URL Edge Function'::TEXT,
      SQLERRM::TEXT;
    RETURN;
  END;
  
  -- ارسال درخواست HTTP
  BEGIN
    SELECT request_id INTO v_request_id
    FROM net.http_post(
      url := v_function_url,
      headers := jsonb_build_object(
        'Authorization', v_auth_header,
        'Content-Type', 'application/json'
      ),
      body := '{}'::jsonb
    );
    
    RETURN QUERY SELECT 
      v_request_id,
      v_function_url,
      '✅ Secrets OK - درخواست ارسال شد'::TEXT,
      NULL::TEXT;
      
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 
      NULL::BIGINT,
      v_function_url,
      '❌ خطا در ارسال درخواست HTTP'::TEXT,
      SQLERRM::TEXT;
  END;
END;
$$;

COMMENT ON FUNCTION public.test_check_reminders() IS 
'تابع تست برای فراخوانی دستی Edge Function check-reminders. استفاده: SELECT * FROM public.test_check_reminders();';

-- 7. نکات مهم:
-- - برای استفاده از این Cron Job، باید Secrets زیر را در Supabase Vault تنظیم کنید:
--   1. SERVICE_ROLE_KEY: Service Role Key پروژه Supabase
--   2. TELEGRAM_BOT_TOKEN: توکن ربات تلگرام (در Edge Function استفاده می‌شود)
--
-- - برای راهنمای کامل مدیریت Cron Jobs، مشاهده لاگ‌ها و تنظیمات، به فایل CRON-JOB.md مراجعه کنید

