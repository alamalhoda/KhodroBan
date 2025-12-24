-- Migration: Seed Data
-- این migration داده‌های اولیه را برای تست و توسعه اضافه می‌کند
-- فقط برای محیط Development استفاده شود!

-- ============================================
-- 1. Seed Subscription Plans (اگر وجود ندارند)
-- ============================================

INSERT INTO public.subscription_plans (plan_code, plan_name, max_vehicles, allow_csv_export, allow_pdf_export, allow_sms_reminder, monthly_price)
VALUES
    ('free', 'رایگان', 1, TRUE, FALSE, FALSE, NULL),
    ('pro', 'حرفه‌ای', NULL, TRUE, TRUE, TRUE, 50000)
ON CONFLICT (plan_code) DO UPDATE
SET
    plan_name = EXCLUDED.plan_name,
    max_vehicles = EXCLUDED.max_vehicles,
    allow_csv_export = EXCLUDED.allow_csv_export,
    allow_pdf_export = EXCLUDED.allow_pdf_export,
    allow_sms_reminder = EXCLUDED.allow_sms_reminder,
    monthly_price = EXCLUDED.monthly_price;

-- ============================================
-- 2. Function برای ایجاد داده‌های تست (اختیاری)
-- ============================================

-- این function فقط برای محیط Development استفاده می‌شود
-- در Production حذف شود!

CREATE OR REPLACE FUNCTION public.create_test_data(user_email TEXT)
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_vehicle_id BIGINT;
    v_service_id BIGINT;
    v_expense_id BIGINT;
    v_reminder_setting_id BIGINT;
    result JSONB;
BEGIN
    -- پیدا کردن user_id از email
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = user_email;
    
    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('error', 'User not found');
    END IF;
    
    -- ایجاد خودرو تست
    INSERT INTO public.vehicles (user_id, model, year, plate_number, current_km, description)
    VALUES (v_user_id, 'پژو ۲۰۶', 1395, '12ب34567', 85000, 'خودرو تست')
    RETURNING vehicle_id INTO v_vehicle_id;
    
    -- ایجاد تنظیمات یادآوری
    INSERT INTO public.reminder_settings (vehicle_id, interval_km, interval_days)
    VALUES (v_vehicle_id, 5000, 90)
    RETURNING reminder_setting_id INTO v_reminder_setting_id;
    
    -- ایجاد سرویس تست
    INSERT INTO public.services (vehicle_id, service_date, service_date_gregorian, service_km, cost, service_type, description)
    VALUES (
        v_vehicle_id,
        '1403-06-15',
        '2024-09-06',
        80000,
        150000,
        'oil_change',
        'تعویض روغن و فیلتر'
    )
    RETURNING service_id INTO v_service_id;
    
    -- ایجاد هزینه تست
    INSERT INTO public.daily_expenses (vehicle_id, expense_date, expense_date_gregorian, amount, category, km_at_expense, description)
    VALUES (
        v_vehicle_id,
        '1403-09-20',
        '2024-12-10',
        500000,
        'fuel',
        85000,
        'سوخت کامل'
    )
    RETURNING expense_id INTO v_expense_id;
    
    result := jsonb_build_object(
        'user_id', v_user_id,
        'vehicle_id', v_vehicle_id,
        'service_id', v_service_id,
        'expense_id', v_expense_id,
        'reminder_setting_id', v_reminder_setting_id,
        'message', 'Test data created successfully'
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 3. Comments
-- ============================================

COMMENT ON FUNCTION public.create_test_data IS 'ایجاد داده‌های تست برای کاربر - فقط برای Development';

