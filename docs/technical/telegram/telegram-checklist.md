# چک‌لیست اجرای سیستم تلگرام

## ✅ مراحل اجرا

### مرحله ۱: آماده‌سازی (۵ دقیقه)

- [ ] **ساخت ربات تلگرام**
  - [ ] رفتن به @BotFather
  - [ ] ارسال `/newbot`
  - [ ] انتخاب نام و username
  - [ ] دریافت توکن
  - [ ] ذخیره توکن در `.env`

- [ ] **تنظیمات ربات**
  - [ ] توضیحات ربات (`/setdescription`)
  - [ ] تصویر پروفایل (`/setuserpic`)
  - [ ] دستورات سریع (`/setcommands`)

### مرحله ۲: دیتابیس (۳ دقیقه)

- [ ] **اجرای SQL**
  - [ ] کپی کردن `005_telegram_users.sql`
  - [ ] اجرا در Supabase SQL Editor
  - [ ] بررسی ایجاد جدول
  - [ ] بررسی RLS Policies

- [ ] **تست دیتابیس**
  - [ ] `SELECT * FROM telegram_users;`
  - [ ] باید خالی باشد

### مرحله ۳: سرویس Python (۵ دقیقه)

- [ ] **فایل‌ها را آماده کنید**
  - [ ] `telegram_main.py`
  - [ ] `telegram_bot_server.py`
  - [ ] `telegram_requirements.txt`
  - [ ] `telegram_env.example`

- [ ] **پر کردن .env**
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `TELEGRAM_BOT_TOKEN`
  - [ ] `CRON_TIME`
  - [ ] `WEBHOOK_URL`

- [ ] **نصب dependencies**
  ```bash
  pip install -r telegram_requirements.txt
  ```

### مرحله ۴: تست لوکال (۱۰ دقیقه)

- [ ] **اجرای سرویس‌ها**
  - [ ] ترمینال ۱: `python telegram_main.py`
  - [ ] ترمینال ۲: `python telegram_bot_server.py`

- [ ] **تنظیم Webhook**
  ```bash
  curl http://localhost:5000/set_webhook
  ```
  - [ ] پاسخ باید `{"ok": true}` باشد

- [ ] **تست اتصال**
  - [ ] وارد داشبورد شوید
  - [ ] به `/profile/telegram` بروید
  - [ ] کلیک "اتصال به تلگرام"
  - [ ] در تلگرام، دکمه "Start" را بزنید
  - [ ] بررسی ذخیره در دیتابیس

- [ ] **تست ارسال**
  - [ ] اجرای دستی `check_reminders_and_send_telegram()`
  - [ ] بررسی دریافت پیام در تلگرام

### مرحله ۵: فرانت‌اند (۵ دقیقه)

- [ ] **فایل‌ها را اضافه کنید**
  - [ ] `frontend/src/routes/profile/telegram/+page.svelte`
  - [ ] `frontend/src/lib/services/telegramService.ts`

- [ ] **تست فرانت‌اند**
  - [ ] `npm run dev`
  - [ ] ورود به داشبورد
  - [ ] رفتن به پروفایل
  - [ ] بررسی صفحه اتصال تلگرام

### مرحله ۶: استقرار (۱۰ دقیقه)

- [ ] **سرویس Cron Job (چابکان)**
  - [ ] نام: `reminder-telegram`
  - [ ] فایل‌ها: `telegram_main.py`, `telegram_requirements.txt`, `.env`
  - [ ] Cron: `0 8 * * *`
  - [ ] دستور: `python telegram_main.py`
  - [ ] استقرار

- [ ] **سرویس Webhook (چابکان)**
  - [ ] نام: `telegram-bot`
  - [ ] فایل‌ها: `telegram_bot_server.py`, `telegram_requirements.txt`, `.env`
  - [ ] دامنه: `https://telegram.yourdomain.com`
  - [ ] استقرار

- [ ] **تنظیم Webhook نهایی**
  - [ ] رفتن به `https://telegram.yourdomain.com/set_webhook`
  - [ ] بررسی پاسخ

### مرحله ۷: تست نهایی (۵ دقیقه)

- [ ] **اتصال کاربر تستی**
  - [ ] وارد داشبورد شوید
  - [ ] اتصال تلگرام را انجام دهید

- [ ] **تست ارسال دستی**
  - [ ] اجرای Cron Job
  - [ ] بررسی دریافت پیام

- [ ] **تست خودکار**
  - [ ] انتظار تا ساعت ۸ صبح
  - [ ] بررسی دریافت خودکار

---

## 📋 چک‌لیست فایل‌ها

### فایل‌های اصلی:

| فایل | مسیر | وضعیت |
|------|------|-------|
| `005_telegram_users.sql` | `supabase/migrations/` | ✅ |
| `telegram_main.py` | `reminder-service/` | ✅ |
| `telegram_bot_server.py` | `reminder-service/` | ✅ |
| `telegram_requirements.txt` | `reminder-service/` | ✅ |
| `telegram_env.example` | `reminder-service/` | ✅ |
| `TELEGRAM_README.md` | `reminder-service/` | ✅ |
| `telegram-checklist.md` | `docs/technical/` | ✅ |
| `telegram-notification-system.md` | `docs/technical/` | ✅ |
| `telegram_quick_start.md` | `docs/technical/` | ✅ |
| `+page.svelte` | `frontend/src/routes/profile/telegram/` | ✅ |
| `telegramService.ts` | `frontend/src/lib/services/` | ✅ |

---

## 🎯 تست‌های کلیدی

### تست ۱: اتصال کاربر
```
ورود به داشبورد → پروفایل → تلگرام → اتصال → Start در تلگرام
```
**خروجی موفق:** پیام خوش‌آمدگویی در تلگرام

### تست ۲: ارسال دستی
```python
# در Python
from telegram_main import check_reminders_and_send_telegram
check_reminders_and_send_telegram()
```
**خروجی موفق:** پیام یادآوری در تلگرام

### تست ۳: Cron Job
```
انتظار تا ساعت ۸ صبح
```
**خروجی موفق:** پیام خودکار در تلگرام

---

## ⚠️ نکات هشدار

### قبل از استقرار:
- [ ] **پشتیبان از دیتابیس** گرفته شود
- [ ] **توکن‌ها** در `.env` ذخیره شوند
- [ ] **تست لوکال** کامل انجام شود
- [ ] **RLS Policies** بررسی شود

### بعد از استقرار:
- [ ] **لاگ‌ها** را چک کنید
- [ ] **تست اتصال** کاربر واقعی
- [ ] **تست ارسال** در زمان واقعی
- [ ] **بررسی محدودیت** تلگرام (۱۰۰۰ پیام/روز)

---

## 🆘 مشکلات و راه‌حل

| مشکل | راه‌حل |
|------|-------|
| پیام دریافت نمی‌شود | بررسی `TELEGRAM_BOT_TOKEN` و Webhook |
| کاربر متصل نمی‌شود | بررسی RLS و `is_active` |
| خطای Python | بررسی لاگ‌ها و اتصال اینترنت |
| محدودیت تلگرام | افزایش لیمیت با پیام به @BotFather |

---

## 📞 پشتیبانی

**مستندات:**
- کامل: `telegram-notification-system.md`
- سریع: `telegram-quick-start.md`
- راهنما: `TELEGRAM_README.md`

**فایل‌های کد:**
- Python: `reminder-service/telegram_*.py`
- SQL: `supabase/migrations/005_telegram_users.sql`
- Frontend: `frontend/src/routes/profile/telegram/`

---

**تاریخ:** ۲۸ دی ۱۴۰۴  
**وضعیت:** ✅ آماده اجرا  
**زمان تقریبی:** ۳۵ دقیقه

