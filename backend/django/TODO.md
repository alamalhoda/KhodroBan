# TODO - خودروبان (KhodroBan)

## اولویت بالا (قبل از MVP)

- [ ] تکمیل و تست کامل بخش اتصال تلگرام

  - [ ] نمایش connection_code در پروفایل کاربر (API + frontend ساده)
  - [ ] تست واقعی webhook و ذخیره chat_id
  - [ ] invalidate کد بعد از استفاده موفق
- [ ] نوشتن تست‌های بیشتر

  - [ ] تست CRUD کامل برای Notification و ReminderSetting
  - [ ] تست ارسال تلگرام با mock requests
  - [ ] تست retry و error handling در Huey tasks
- [ ] تولید requirements.txt دقیق و freeze
- [ ] تنظیم logging مناسب (فایل + console + سطح DEBUG/INFO)
- [ ] اضافه کردن custom exception handler در DRF (پاسخ‌های خواناتر)

## اولویت متوسط (بعد از MVP اولیه)

- [ ] اضافه کردن تأیید ایمیل بعد از ثبت‌نام
- [ ] پیاده‌سازی reset password (فراموشی رمز عبور)
- [ ] اضافه کردن فیلتر و جستجو در لیست خودروها و سرویس‌ها
- [ ] محاسبه و نمایش آمار کلی (میانگین هزینه ماهانه، کیلومتر سالانه و ...)
- [ ] مستندسازی API با drf-spectacular یا swagger

## اولویت پایین / آینده

- [ ] اضافه کردن کانال‌های دیگر اعلان (ایمیل، SMS، push notification)
- [ ] پیاده‌سازی export به CSV/PDF (فقط پلن Pro)
- [ ] داشبورد ادمین سفارشی‌تر
- [ ] نسخه موبایل (PWA یا اپ native)
- [ ] قابلیت چندکاربره / اشتراک‌گذاری خودرو (خانواده/شرکت)
- [ ] اضافه کردن Realtime (اگر نیاز واقعی ایجاد شد)

## نکات فنی باز

- [ ] بررسی دقیق امنیت CSRF + CORS در تولید
- [ ] تنظیم rate limiting برای APIها
- [ ] بررسی و بهینه‌سازی queryها (select_related/prefetch_related)
- [ ] اضافه کردن health check endpoint برای مانیتورینگ
