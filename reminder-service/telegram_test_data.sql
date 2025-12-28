-- ============================================
-- نمونه داده‌های تست برای سیستم تلگرام
-- ============================================

-- ۱. اضافه کردن یک کاربر تستی به جدول users (اگر نیاز است)
INSERT INTO auth.users (id, email, raw_user_metadata)
VALUES 
    ('123e4567-e89b-12d3-a456-426614174000', 'test@example.com', '{"name": "Test User"}')
ON CONFLICT DO NOTHING;

-- ۲. اضافه کردن خودروی تستی
INSERT INTO public.vehicles (vehicle_id, user_id, model, plate_number, current_km)
VALUES 
    (1, '123e4567-e89b-12d3-a456-426614174000', 'جک جی۴', '55 - 523 ب ۱۱', 50000)
ON CONFLICT (vehicle_id) DO NOTHING;

-- ۳. اضافه کردن تنظیمات یادآوری
INSERT INTO public.reminder_settings (vehicle_id, interval_days, interval_km, warning_days_before, warning_km_before, reminder_mode, is_enabled)
VALUES 
    (1, 90, 5000, 7, 500, 'time', TRUE)
ON CONFLICT (vehicle_id) DO NOTHING;

-- ۴. اضافه کردن آخرین سرویس (۸۰ روز پیش - باید ۱۰ روز مانده باشد)
INSERT INTO public.services (vehicle_id, service_type, service_date_gregorian, service_km, description)
VALUES 
    (1, 'oil_change', CURRENT_DATE - INTERVAL '80 days', 49000, 'سرویس دوره‌ای')
ON CONFLICT DO NOTHING;

-- ۵. اضافه کردن اتصال تلگرام (فرض کنید Chat ID واقعی دارید)
-- این را با Chat ID واقعی خودتان جایگزین کنید
INSERT INTO public.telegram_users (user_id, chat_id, username, first_name, is_active)
VALUES 
    ('123e4567-e89b-12d3-a456-426614174000', 123456789, 'testuser', 'Test', TRUE)
ON CONFLICT (user_id, chat_id) DO NOTHING;

-- ============================================
-- تست:
-- ۱. اجرای این SQL
-- ۲. اجرای Python: python telegram_main.py
-- ۳. باید پیام در تلگرام دریافت کنید
-- ============================================

