-- مهاجرت ۰۰۰: تنظیمات اولیه پروژه
-- هدف: تعریف توابع برای استفاده از Supabase Vault Secrets

-- 1. ایجاد تابع برای خواندن Supabase URL از Vault
-- این تابع از Supabase Vault Secrets استفاده می‌کند
-- ⚠️ مهم: قبل از استفاده، باید Secret زیر را در Supabase Vault تنظیم کنید:
--   Name: SUPABASE_URL
--   Value: Project ID یا URL کامل (مثال: zwrzokyzjwircrhrtyyi.supabase.co)
CREATE OR REPLACE FUNCTION public.get_supabase_url()
RETURNS TEXT
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
    supabase_url TEXT;
    cleaned_url TEXT;
BEGIN
    -- خواندن از Vault Secrets
    SELECT decrypted_secret INTO supabase_url
    FROM vault.decrypted_secrets
    WHERE name = 'SUPABASE_URL'
    LIMIT 1;
    
    -- اگر در Vault پیدا نشد، خطا بده
    IF supabase_url IS NULL THEN
        RAISE EXCEPTION 'Secret SUPABASE_URL not found in Vault. Please add it in Supabase Dashboard > Project Settings > Vault';
    END IF;
    
    -- حذف https:// از ابتدای URL (اگر وجود داشته باشد)
    cleaned_url := TRIM(supabase_url);
    IF cleaned_url LIKE 'https://%' THEN
        cleaned_url := SUBSTRING(cleaned_url FROM 9);
    ELSIF cleaned_url LIKE 'http://%' THEN
        cleaned_url := SUBSTRING(cleaned_url FROM 8);
    END IF;
    
    RETURN cleaned_url;
END;
$$;

COMMENT ON FUNCTION public.get_supabase_url() IS 
'خواندن Supabase URL از Vault Secrets. نیاز به Secret با نام SUPABASE_URL در Vault دارد.';

-- 2. ایجاد تابع کمکی برای ساخت URL کامل Edge Function
-- این تابع URL کامل Edge Function را برمی‌گرداند
CREATE OR REPLACE FUNCTION public.get_supabase_function_url(function_name TEXT)
RETURNS TEXT
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
BEGIN
    RETURN 'https://' || public.get_supabase_url() || '/functions/v1/' || function_name;
END;
$$;

COMMENT ON FUNCTION public.get_supabase_function_url(TEXT) IS 
'تابع برای ساخت URL کامل Edge Function. استفاده: get_supabase_function_url(''check-reminders'')';

-- 3. ایجاد تابع برای خواندن SERVICE_ROLE_KEY از Vault
-- این تابع Service Role Key را از Vault Secrets می‌خواند
-- ⚠️ مهم: قبل از استفاده، باید Secret زیر را در Supabase Vault تنظیم کنید:
--   Name: SERVICE_ROLE_KEY
--   Value: Service Role Key از Settings > API
CREATE OR REPLACE FUNCTION public.get_service_role_key()
RETURNS TEXT
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
    service_key TEXT;
BEGIN
    -- خواندن از Vault Secrets
    SELECT decrypted_secret INTO service_key
    FROM vault.decrypted_secrets
    WHERE name = 'SERVICE_ROLE_KEY'
    LIMIT 1;
    
    -- اگر در Vault پیدا نشد، خطا بده
    IF service_key IS NULL THEN
        RAISE EXCEPTION 'Secret SERVICE_ROLE_KEY not found in Vault. Please add it in Supabase Dashboard > Project Settings > Vault';
    END IF;
    
    RETURN service_key;
END;
$$;

COMMENT ON FUNCTION public.get_service_role_key() IS 
'خواندن Service Role Key از Vault Secrets. نیاز به Secret با نام SERVICE_ROLE_KEY در Vault دارد.';

-- 4. ایجاد تابع کمکی برای ساخت Authorization Header
-- این تابع header Authorization کامل را برمی‌گرداند
CREATE OR REPLACE FUNCTION public.get_auth_header()
RETURNS TEXT
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
BEGIN
    RETURN 'Bearer ' || public.get_service_role_key();
END;
$$;

COMMENT ON FUNCTION public.get_auth_header() IS 
'تابع برای ساخت Authorization Header. استفاده: get_auth_header()';

-- 5. نکات مهم:
-- 
-- ⚠️ قبل از استفاده از این توابع، باید Secrets زیر را در Supabase Vault تنظیم کنید:
--   1. به Supabase Dashboard > Project Settings > Vault بروید
--   2. Secrets زیر را اضافه کنید:
--      
--      Secret 1: SUPABASE_URL
--      - Name: SUPABASE_URL
--      - Value: Project ID یا URL کامل (بدون https://)
--        مثال: zwrzokyzjwircrhrtyyi.supabase.co
--        یا: https://zwrzokyzjwircrhrtyyi.supabase.co (تابع خودش https:// را اضافه می‌کند)
--      
--      Secret 2: SERVICE_ROLE_KEY
--      - Name: SERVICE_ROLE_KEY
--      - Value: Service Role Key از Settings > API
--
-- - برای استفاده در Cron Jobs و توابع:
--   url := public.get_supabase_function_url('check-reminders')
--   auth_header := public.get_auth_header()
--
-- - برای خواندن مستقیم:
--   SELECT public.get_supabase_url();
--   SELECT public.get_supabase_function_url('check-reminders')
--   SELECT public.get_service_role_key();
--   SELECT public.get_auth_header();
--
-- - مزایای استفاده از Vault:
--   ✓ امنیت بیشتر (رمزگذاری شده)
--   ✓ مدیریت از طریق Dashboard
--   ✓ بدون نیاز به جدول اضافی
--   ✓ کد تمیزتر و قابل استفاده مجدد