-- Migration: Initial Schema for KhodroBan (خودروبان)
-- این migration ساختار اولیه دیتابیس را ایجاد می‌کند
-- برای Supabase: استفاده از auth.users برای احراز هویت

-- ============================================
-- 1. Extension ها
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 2. جداول اصلی
-- ============================================

-- جدول User Profiles (لینک به auth.users)
-- در Supabase از auth.users برای احراز هویت استفاده می‌کنیم
-- این جدول اطلاعات اضافی کاربر را نگه می‌دارد
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login TIMESTAMPTZ
);

-- جدول Subscription Plans
CREATE TABLE IF NOT EXISTS public.subscription_plans (
    plan_id SERIAL PRIMARY KEY,
    plan_code VARCHAR(20) NOT NULL UNIQUE,
    plan_name VARCHAR(100) NOT NULL,
    max_vehicles INTEGER,
    allow_csv_export BOOLEAN NOT NULL DEFAULT TRUE,
    allow_pdf_export BOOLEAN NOT NULL DEFAULT FALSE,
    allow_sms_reminder BOOLEAN NOT NULL DEFAULT FALSE,
    monthly_price BIGINT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- جدول User Subscriptions
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    subscription_id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    plan_id INTEGER NOT NULL REFERENCES public.subscription_plans(plan_id) ON DELETE RESTRICT,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    auto_renew BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- جدول Vehicles
CREATE TABLE IF NOT EXISTS public.vehicles (
    vehicle_id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL CHECK (year >= 1300 AND year <= 1500),
    plate_number VARCHAR(20) NOT NULL,
    current_km INTEGER NOT NULL DEFAULT 0 CHECK (current_km >= 0),
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_vehicles_user_plate UNIQUE (user_id, plate_number)
);

-- جدول Services
CREATE TABLE IF NOT EXISTS public.services (
    service_id BIGSERIAL PRIMARY KEY,
    vehicle_id BIGINT NOT NULL REFERENCES public.vehicles(vehicle_id) ON DELETE CASCADE,
    service_date DATE NOT NULL,
    service_date_gregorian DATE NOT NULL,
    service_km INTEGER NOT NULL CHECK (service_km >= 0),
    cost BIGINT NOT NULL DEFAULT 0 CHECK (cost >= 0),
    service_type VARCHAR(50) NOT NULL DEFAULT 'oil_change',
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- جدول Daily Expenses
CREATE TABLE IF NOT EXISTS public.daily_expenses (
    expense_id BIGSERIAL PRIMARY KEY,
    vehicle_id BIGINT NOT NULL REFERENCES public.vehicles(vehicle_id) ON DELETE CASCADE,
    expense_date DATE NOT NULL,
    expense_date_gregorian DATE NOT NULL,
    amount BIGINT NOT NULL CHECK (amount > 0),
    category VARCHAR(50) NOT NULL CHECK (category IN ('fuel', 'carwash', 'parking', 'toll', 'repair', 'other')),
    km_at_expense INTEGER CHECK (km_at_expense >= 0),
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- جدول Reminder Settings
CREATE TABLE IF NOT EXISTS public.reminder_settings (
    reminder_setting_id BIGSERIAL PRIMARY KEY,
    vehicle_id BIGINT NOT NULL UNIQUE REFERENCES public.vehicles(vehicle_id) ON DELETE CASCADE,
    interval_km INTEGER NOT NULL DEFAULT 5000 CHECK (interval_km > 0),
    interval_days INTEGER NOT NULL DEFAULT 90 CHECK (interval_days > 0),
    warning_days_before INTEGER NOT NULL DEFAULT 7 CHECK (warning_days_before >= 0),
    warning_km_before INTEGER NOT NULL DEFAULT 500 CHECK (warning_km_before >= 0),
    enable_email_reminder BOOLEAN NOT NULL DEFAULT TRUE,
    enable_sms_reminder BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- جدول Reminder Logs
CREATE TABLE IF NOT EXISTS public.reminder_logs (
    reminder_log_id BIGSERIAL PRIMARY KEY,
    vehicle_id BIGINT NOT NULL REFERENCES public.vehicles(vehicle_id) ON DELETE CASCADE,
    reminder_type VARCHAR(20) NOT NULL CHECK (reminder_type IN ('in_app', 'email', 'sms')),
    reminder_status VARCHAR(20) NOT NULL CHECK (reminder_status IN ('pending', 'sent', 'failed')),
    due_date DATE NOT NULL,
    due_km INTEGER NOT NULL CHECK (due_km >= 0),
    sent_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 3. Index ها
-- ============================================

-- User Profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON public.user_profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_active ON public.user_profiles(is_active);

-- User Subscriptions
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_plan_id ON public.user_subscriptions(plan_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_is_active ON public.user_subscriptions(is_active);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_active ON public.user_subscriptions(user_id, is_active, end_date);

-- Vehicles
CREATE INDEX IF NOT EXISTS idx_vehicles_user_id ON public.vehicles(user_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_current_km ON public.vehicles(current_km);

-- Services
CREATE INDEX IF NOT EXISTS idx_services_vehicle_id ON public.services(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_services_date_gregorian ON public.services(service_date_gregorian);
CREATE INDEX IF NOT EXISTS idx_services_km ON public.services(service_km);
CREATE INDEX IF NOT EXISTS idx_services_vehicle_date_desc ON public.services(vehicle_id, service_date_gregorian DESC);

-- Daily Expenses
CREATE INDEX IF NOT EXISTS idx_daily_expenses_vehicle_id ON public.daily_expenses(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_daily_expenses_date_gregorian ON public.daily_expenses(expense_date_gregorian);
CREATE INDEX IF NOT EXISTS idx_daily_expenses_category ON public.daily_expenses(category);
CREATE INDEX IF NOT EXISTS idx_daily_expenses_vehicle_date_desc ON public.daily_expenses(vehicle_id, expense_date_gregorian DESC);

-- Reminder Settings
CREATE INDEX IF NOT EXISTS idx_reminder_settings_email ON public.reminder_settings(enable_email_reminder);

-- Reminder Logs
CREATE INDEX IF NOT EXISTS idx_reminder_logs_vehicle_id ON public.reminder_logs(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_reminder_logs_status ON public.reminder_logs(reminder_status);
CREATE INDEX IF NOT EXISTS idx_reminder_logs_sent_at ON public.reminder_logs(sent_at);
CREATE INDEX IF NOT EXISTS idx_reminder_logs_vehicle_type_sent ON public.reminder_logs(vehicle_id, reminder_type, sent_at DESC);

-- ============================================
-- 4. Functions برای updated_at
-- ============================================

-- Function برای به‌روزرسانی خودکار updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers برای updated_at
CREATE TRIGGER set_updated_at_user_profiles
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_subscription_plans
    BEFORE UPDATE ON public.subscription_plans
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_user_subscriptions
    BEFORE UPDATE ON public.user_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_vehicles
    BEFORE UPDATE ON public.vehicles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_services
    BEFORE UPDATE ON public.services
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_daily_expenses
    BEFORE UPDATE ON public.daily_expenses
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_reminder_settings
    BEFORE UPDATE ON public.reminder_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- 5. Function برای ایجاد خودکار User Profile
-- ============================================

-- وقتی کاربر جدید در auth.users ثبت می‌شود، profile ایجاد می‌شود
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, is_email_verified)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.email_confirmed_at IS NOT NULL
    );
    
    -- ایجاد اشتراک رایگان پیش‌فرض
    INSERT INTO public.user_subscriptions (user_id, plan_id, is_active)
    SELECT NEW.id, plan_id, TRUE
    FROM public.subscription_plans
    WHERE plan_code = 'free'
    LIMIT 1;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger برای ایجاد خودکار profile
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 6. Function برای به‌روزرسانی last_login
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_user_login()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.user_profiles
    SET last_login = NOW()
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 7. داده‌های اولیه (Seed Data)
-- ============================================

-- ایجاد پلن‌های اشتراک
INSERT INTO public.subscription_plans (plan_code, plan_name, max_vehicles, allow_csv_export, allow_pdf_export, allow_sms_reminder, monthly_price)
VALUES
    ('free', 'رایگان', 1, TRUE, FALSE, FALSE, NULL),
    ('pro', 'حرفه‌ای', NULL, TRUE, TRUE, TRUE, 50000)
ON CONFLICT (plan_code) DO NOTHING;

-- ============================================
-- 8. Comments برای مستندسازی
-- ============================================

COMMENT ON TABLE public.user_profiles IS 'پروفایل کاربران - لینک به auth.users';
COMMENT ON TABLE public.subscription_plans IS 'پلن‌های اشتراک (Free/Pro)';
COMMENT ON TABLE public.user_subscriptions IS 'اشتراک‌های کاربران';
COMMENT ON TABLE public.vehicles IS 'خودروهای کاربران';
COMMENT ON TABLE public.services IS 'سوابق سرویس و تعویض روغن';
COMMENT ON TABLE public.daily_expenses IS 'هزینه‌های روزانه خودرو';
COMMENT ON TABLE public.reminder_settings IS 'تنظیمات یادآوری برای هر خودرو';
COMMENT ON TABLE public.reminder_logs IS 'لاگ یادآوری‌های ارسال شده';

