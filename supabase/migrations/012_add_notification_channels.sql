-- مهاجرت ۰۱۲: اضافه کردن فیلدهای لازم برای مدیریت کانال‌های اعلان
-- تاریخ ایجاد: ۱۴۰۴/۱۱/۰۵
-- هدف: جداسازی منطق یادآوری از ارسال اعلان‌ها

-- 1. اضافه کردن فیلد notification_channels برای ذخیره کانال‌های ارسال شده
ALTER TABLE public.notifications 
ADD COLUMN IF NOT EXISTS notification_channels JSONB DEFAULT '{}'::jsonb;

-- 2. اضافه کردن فیلد sent_at برای ذخیره زمان ارسال (اگر حداقل یک کانال ارسال شده باشد)
ALTER TABLE public.notifications 
ADD COLUMN IF NOT EXISTS sent_at TIMESTAMPTZ;

-- 3. اضافه کردن index برای query کردن نوتیفیکیشن‌های ارسال نشده
CREATE INDEX IF NOT EXISTS idx_notifications_sent_at 
ON public.notifications(sent_at) 
WHERE sent_at IS NULL;

-- 4. اضافه کردن index برای query کردن بر اساس کانال‌ها
CREATE INDEX IF NOT EXISTS idx_notifications_channels 
ON public.notifications USING GIN (notification_channels);

-- 5. کامنت‌ها
COMMENT ON COLUMN public.notifications.notification_channels IS 
'کانال‌های اعلان که ارسال شده‌اند: {telegram: {sent_at, status}, sms: {...}, email: {...}, push: {...}}';

COMMENT ON COLUMN public.notifications.sent_at IS 
'زمان اولین ارسال موفق از طریق هر کانال (NULL = هنوز ارسال نشده)';
