-- ============================================
-- سیستم نوتیفیکیشن تلگرام
-- تاریخ: ۲۸ دی ۱۴۰۴
-- ============================================

-- 1. ایجاد جدول telegram_users
CREATE TABLE public.telegram_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    chat_id BIGINT NOT NULL UNIQUE,
    username TEXT,
    first_name TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- هر کاربر فقط یک Chat ID فعال داشته باشد
    UNIQUE(user_id, chat_id)
);

-- 2. فعال کردن RLS
ALTER TABLE public.telegram_users ENABLE ROW LEVEL SECURITY;

-- 3. پالیسی‌ها
CREATE POLICY "Users can view their own telegram data" ON public.telegram_users
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own telegram data" ON public.telegram_users
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own telegram data" ON public.telegram_users
    FOR UPDATE USING (auth.uid() = user_id);

-- پالیسی برای سرویس Python (Service Role)
CREATE POLICY "Service can manage all telegram data" ON public.telegram_users
    FOR ALL USING (auth.role() = 'service_role');

-- 4. Index‌ها برای بهبود کارایی
CREATE INDEX idx_telegram_users_user_id ON public.telegram_users(user_id);
CREATE INDEX idx_telegram_users_chat_id ON public.telegram_users(chat_id);
CREATE INDEX idx_telegram_users_active ON public.telegram_users(is_active);

-- 5. تریگر updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_telegram_users
    BEFORE UPDATE ON public.telegram_users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 6. کامنت‌ها
COMMENT ON TABLE public.telegram_users IS 'اطلاعات تلگرام کاربران برای ارسال یادآوری';
COMMENT ON COLUMN public.telegram_users.user_id IS 'شناسه کاربر در Supabase Auth';
COMMENT ON COLUMN public.telegram_users.chat_id IS 'شناسه چت تلگرام (مهم‌ترین ستون)';
COMMENT ON COLUMN public.telegram_users.is_active IS 'آیا این اتصال فعال است؟';

-- 7. فعال کردن Realtime (اختیاری - برای نمایش وضعیت در فرانت‌اند)
ALTER TABLE public.telegram_users REPLICA IDENTITY FULL;

-- ============================================
-- نکات مهم:
-- 1. کاربر باید ابتدا در وب‌سایت لاگین کند
-- 2. سپس به تلگرام ربات پیام دهد با دستور /start [user_id]
-- 3. Chat ID ذخیره می‌شود
-- 4. Python Cron Job از این جدول برای ارسال استفاده می‌کند
-- ============================================

