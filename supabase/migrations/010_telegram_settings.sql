-- مهاجرت ۰۱۰: ایجاد جدول تنظیمات تلگرام
-- تاریخ ایجاد: ۱۴۰۴/۱۱/۰۵
-- هدف: پشتیبانی از اتصال کاربران به ربات تلگرام برای دریافت یادآوری‌ها

-- 1. ایجاد جدول telegram_settings
CREATE TABLE public.telegram_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    chat_id TEXT UNIQUE,
    connection_code TEXT UNIQUE,  -- کد یکتا برای اتصال خودکار
    is_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- اطمینان از اینکه هر کاربر فقط یک رکورد داشته باشد
    CONSTRAINT unique_user_telegram UNIQUE (user_id)
);

-- 2. فعال کردن RLS
ALTER TABLE public.telegram_settings ENABLE ROW LEVEL SECURITY;

-- 3. پالیسی‌های RLS
CREATE POLICY "Users can view their own telegram settings" ON public.telegram_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own telegram settings" ON public.telegram_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own telegram settings" ON public.telegram_settings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own telegram settings" ON public.telegram_settings
    FOR DELETE USING (auth.uid() = user_id);

-- 4. Index‌ها برای بهبود کارایی
CREATE INDEX idx_telegram_settings_user_id ON public.telegram_settings(user_id);
CREATE INDEX idx_telegram_settings_connection_code ON public.telegram_settings(connection_code) WHERE connection_code IS NOT NULL;
CREATE INDEX idx_telegram_settings_chat_id ON public.telegram_settings(chat_id) WHERE chat_id IS NOT NULL;
CREATE INDEX idx_telegram_settings_enabled ON public.telegram_settings(user_id, is_enabled) WHERE is_enabled = TRUE;

-- 5. تریگر updated_at (تابع handle_updated_at قبلاً در migration 004 ایجاد شده)
CREATE TRIGGER set_updated_at_telegram_settings
    BEFORE UPDATE ON public.telegram_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 6. کامنت‌ها برای مستندسازی
COMMENT ON TABLE public.telegram_settings IS 'تنظیمات اتصال کاربران به ربات تلگرام برای دریافت یادآوری سرویس دوره‌ای';
COMMENT ON COLUMN public.telegram_settings.connection_code IS 'کد یکتا و یک‌بار مصرف برای اتصال خودکار ربات تلگرام';
COMMENT ON COLUMN public.telegram_settings.chat_id IS 'شناسه چت کاربر در تلگرام (بعد از اتصال موفق ذخیره می‌شود)';
COMMENT ON COLUMN public.telegram_settings.is_enabled IS 'وضعیت فعال/غیرفعال بودن اتصال تلگرام';

