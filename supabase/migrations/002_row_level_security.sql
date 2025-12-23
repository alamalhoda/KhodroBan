-- Migration: Row Level Security (RLS) Policies
-- این migration سیاست‌های امنیتی RLS را برای تمام جداول تنظیم می‌کند

-- ============================================
-- 1. فعال‌سازی RLS برای تمام جداول
-- ============================================

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminder_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminder_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. User Profiles Policies
-- ============================================

-- کاربران فقط می‌توانند پروفایل خودشان را ببینند
CREATE POLICY "Users can view own profile"
    ON public.user_profiles
    FOR SELECT
    USING (auth.uid() = id);

-- کاربران فقط می‌توانند پروفایل خودشان را به‌روزرسانی کنند
CREATE POLICY "Users can update own profile"
    ON public.user_profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- ============================================
-- 3. Subscription Plans Policies
-- ============================================

-- همه کاربران می‌توانند پلن‌های فعال را ببینند
CREATE POLICY "Anyone can view active plans"
    ON public.subscription_plans
    FOR SELECT
    USING (is_active = TRUE);

-- ============================================
-- 4. User Subscriptions Policies
-- ============================================

-- کاربران فقط می‌توانند اشتراک خودشان را ببینند
CREATE POLICY "Users can view own subscriptions"
    ON public.user_subscriptions
    FOR SELECT
    USING (auth.uid() = user_id);

-- ============================================
-- 5. Vehicles Policies
-- ============================================

-- کاربران فقط می‌توانند خودروهای خودشان را ببینند
CREATE POLICY "Users can view own vehicles"
    ON public.vehicles
    FOR SELECT
    USING (auth.uid() = user_id);

-- کاربران فقط می‌توانند خودروهای خودشان را ایجاد کنند
CREATE POLICY "Users can insert own vehicles"
    ON public.vehicles
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- کاربران فقط می‌توانند خودروهای خودشان را به‌روزرسانی کنند
CREATE POLICY "Users can update own vehicles"
    ON public.vehicles
    FOR UPDATE
    USING (auth.uid() = user_id);

-- کاربران فقط می‌توانند خودروهای خودشان را حذف کنند
CREATE POLICY "Users can delete own vehicles"
    ON public.vehicles
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- 6. Services Policies
-- ============================================

-- کاربران فقط می‌توانند سرویس‌های خودروهای خودشان را ببینند
CREATE POLICY "Users can view own services"
    ON public.services
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.vehicles
            WHERE vehicles.vehicle_id = services.vehicle_id
            AND vehicles.user_id = auth.uid()
        )
    );

-- کاربران فقط می‌توانند سرویس‌های خودروهای خودشان را ایجاد کنند
CREATE POLICY "Users can insert own services"
    ON public.services
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.vehicles
            WHERE vehicles.vehicle_id = services.vehicle_id
            AND vehicles.user_id = auth.uid()
        )
    );

-- کاربران فقط می‌توانند سرویس‌های خودروهای خودشان را به‌روزرسانی کنند
CREATE POLICY "Users can update own services"
    ON public.services
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.vehicles
            WHERE vehicles.vehicle_id = services.vehicle_id
            AND vehicles.user_id = auth.uid()
        )
    );

-- کاربران فقط می‌توانند سرویس‌های خودروهای خودشان را حذف کنند
CREATE POLICY "Users can delete own services"
    ON public.services
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.vehicles
            WHERE vehicles.vehicle_id = services.vehicle_id
            AND vehicles.user_id = auth.uid()
        )
    );

-- ============================================
-- 7. Daily Expenses Policies
-- ============================================

-- کاربران فقط می‌توانند هزینه‌های خودروهای خودشان را ببینند
CREATE POLICY "Users can view own expenses"
    ON public.daily_expenses
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.vehicles
            WHERE vehicles.vehicle_id = daily_expenses.vehicle_id
            AND vehicles.user_id = auth.uid()
        )
    );

-- کاربران فقط می‌توانند هزینه‌های خودروهای خودشان را ایجاد کنند
CREATE POLICY "Users can insert own expenses"
    ON public.daily_expenses
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.vehicles
            WHERE vehicles.vehicle_id = daily_expenses.vehicle_id
            AND vehicles.user_id = auth.uid()
        )
    );

-- کاربران فقط می‌توانند هزینه‌های خودروهای خودشان را به‌روزرسانی کنند
CREATE POLICY "Users can update own expenses"
    ON public.daily_expenses
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.vehicles
            WHERE vehicles.vehicle_id = daily_expenses.vehicle_id
            AND vehicles.user_id = auth.uid()
        )
    );

-- کاربران فقط می‌توانند هزینه‌های خودروهای خودشان را حذف کنند
CREATE POLICY "Users can delete own expenses"
    ON public.daily_expenses
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.vehicles
            WHERE vehicles.vehicle_id = daily_expenses.vehicle_id
            AND vehicles.user_id = auth.uid()
        )
    );

-- ============================================
-- 8. Reminder Settings Policies
-- ============================================

-- کاربران فقط می‌توانند تنظیمات یادآوری خودروهای خودشان را ببینند
CREATE POLICY "Users can view own reminder settings"
    ON public.reminder_settings
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.vehicles
            WHERE vehicles.vehicle_id = reminder_settings.vehicle_id
            AND vehicles.user_id = auth.uid()
        )
    );

-- کاربران فقط می‌توانند تنظیمات یادآوری خودروهای خودشان را ایجاد کنند
CREATE POLICY "Users can insert own reminder settings"
    ON public.reminder_settings
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.vehicles
            WHERE vehicles.vehicle_id = reminder_settings.vehicle_id
            AND vehicles.user_id = auth.uid()
        )
    );

-- کاربران فقط می‌توانند تنظیمات یادآوری خودروهای خودشان را به‌روزرسانی کنند
CREATE POLICY "Users can update own reminder settings"
    ON public.reminder_settings
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.vehicles
            WHERE vehicles.vehicle_id = reminder_settings.vehicle_id
            AND vehicles.user_id = auth.uid()
        )
    );

-- کاربران فقط می‌توانند تنظیمات یادآوری خودروهای خودشان را حذف کنند
CREATE POLICY "Users can delete own reminder settings"
    ON public.reminder_settings
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.vehicles
            WHERE vehicles.vehicle_id = reminder_settings.vehicle_id
            AND vehicles.user_id = auth.uid()
        )
    );

-- ============================================
-- 9. Reminder Logs Policies
-- ============================================

-- کاربران فقط می‌توانند لاگ‌های یادآوری خودروهای خودشان را ببینند
CREATE POLICY "Users can view own reminder logs"
    ON public.reminder_logs
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.vehicles
            WHERE vehicles.vehicle_id = reminder_logs.vehicle_id
            AND vehicles.user_id = auth.uid()
        )
    );

-- کاربران فقط می‌توانند لاگ‌های یادآوری خودروهای خودشان را ایجاد کنند
CREATE POLICY "Users can insert own reminder logs"
    ON public.reminder_logs
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.vehicles
            WHERE vehicles.vehicle_id = reminder_logs.vehicle_id
            AND vehicles.user_id = auth.uid()
        )
    );

-- کاربران فقط می‌توانند لاگ‌های یادآوری خودروهای خودشان را به‌روزرسانی کنند
CREATE POLICY "Users can update own reminder logs"
    ON public.reminder_logs
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.vehicles
            WHERE vehicles.vehicle_id = reminder_logs.vehicle_id
            AND vehicles.user_id = auth.uid()
        )
    );

