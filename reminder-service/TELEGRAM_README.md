# سیستم یادآوری تلگرام

> **⚠️ منسوخ (Deprecated)**  
> Webhook و ارسال تلگرام اکنون در **Django** انجام می‌شود (`backend/django/khodroban/`, webhook و Huey tasks).  
> **مرجع:** [reminder-notification-api-blueprint.md](../docs/technical/reminder-notification-api-blueprint.md) §۴ (Telegram Parity) و [reminder-system-status.md](../docs/technical/reminder-system-status.md).  
> این فایل فقط برای آرشیو نگه‌داری شده است.

---

## 📋 خلاصه (آرشیو)

این سرویس یادآوری سرویس دوره‌ای خودروها را از طریق **تلگرام** ارسال می‌کرد.

**ویژگی‌ها:**
- ✅ کاملاً رایگان
- ✅ ارسال فوری
- ✅ دکمه‌های تعاملی
- ✅ جلوگیری از تکرار

---

## 🎯 ساختار پوشه

```
reminder-service/
├── telegram_main.py          # Cron Job ارسال یادآوری
├── telegram_bot_server.py    # سرور Webhook
├── telegram_requirements.txt # dependencies
├── telegram_env.example      # الگوی متغیرها
└── TELEGRAM_README.md        # این فایل
```

---

## 🚀 راه‌اندازی سریع

### ۱. پیش‌نیازها

```bash
cd reminder-service
pip install -r telegram_requirements.txt
```

### ۲. متغیرهای محیطی

```bash
cp telegram_env.example .env
# سپس .env را ویرایش کنید
```

**محتوای `.env`:**
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-key
TELEGRAM_BOT_TOKEN=123456:ABC-DEF... (از @BotFather)
CRON_TIME=08:00
WEBHOOK_URL=https://your-domain.com/webhook
```

### ۳. اجرای سرویس

**ترمینال ۱: Cron Job (ارسال یادآوری)**
```bash
python telegram_main.py
```

**ترمینال ۲: Webhook Server (دریافت پیام‌ها)**
```bash
python telegram_bot_server.py
```

### ۴. تنظیم Webhook

```bash
# اجرا در مرورگر یا curl
curl http://localhost:5000/set_webhook
```

**پاسخ موفق:**
```json
{"ok": true, "result": true, "description": "Webhook was set"}
```

---

## 🧪 تست

### تست ۱: بررسی اتصال Supabase
```python
python -c "
from telegram_main import supabase
users = supabase.table('telegram_users').select('*').execute()
print(users.data)
"
```

### تست ۲: ارسال دستی
```python
python -c "
from telegram_main import send_telegram_message
send_telegram_message(123456789, '✅ تست موفق!')
"
```

### تست ۳: اجرای کامل
```python
python -c "
from telegram_main import check_reminders_and_send_telegram
check_reminders_and_send_telegram()
"
```

---

## 📱 نحوه کار

### برای کاربران:

1. **در وب‌سایت:**
   - بروید به `/profile/telegram`
   - کلیک "اتصال به تلگرام"

2. **در تلگرام:**
   - دکمه "Start" را بزنید

3. **تمام!** یادآوری خودکار دریافت می‌کنند.

### جریان خودکار:

```
هر روز ساعت ۸ صبح
    ↓
Python Cron Job اجرا می‌شود
    ↓
خودروهای در بازه هشدار پیدا می‌شوند
    ↓
Chat ID کاربر خوانده می‌شود
    ↓
پیام به تلگرام ارسال می‌شود
    ↓
کاربر پیام را دریافت می‌کند
```

---

## 📊 دیتابیس

### جدول telegram_users

| ستون | نوع | توضیحات |
|------|-----|---------|
| id | UUID | شناسه |
| user_id | UUID | شناسه کاربر (Supabase Auth) |
| chat_id | BIGINT | شناسه چت تلگرام (مهم!) |
| username | TEXT | نام کاربری (اختیاری) |
| first_name | TEXT | نام (اختیاری) |
| is_active | BOOLEAN | فعال/غیرفعال |
| created_at | TIMESTAMPTZ | تاریخ ایجاد |

---

## 🔧 دستورات تلگرام

| دستور | توضیحات |
|-------|---------|
| `/start [user_id]` | اتصال حساب کاربری |
| `/status` | وضعیت یادآوری‌ها |
| `/help` | راهنما |

---

## 💰 هزینه

| سرویس | هزینه |
|-------|-------|
| تلگرام | رایگان |
| Python | رایگان |
| Supabase | رایگان |

**محدودیت تلگرام:** ۱۰۰۰ پیام/روز (برای ربات جدید)

---

## ⚠️ نکات مهم

### امنیت:
- ❌ توکن تلگرام را در کد نگذارید
- ✅ فقط در `.env` نگه دارید
- ✅ از Service Role Key فقط در Python استفاده کنید

### خطایابی:

**پیام دریافت نمی‌شود:**
```bash
# بررسی Webhook
curl https://api.telegram.org/bot{TOKEN}/getWebhookInfo
```

**خطای اتصال:**
```bash
# بررسی توکن
echo $TELEGRAM_BOT_TOKEN
```

---

## 🚀 استقرار در چابکان

### سرویس ۱: Cron Job
- نام: `reminder-telegram`
- فایل‌ها: `telegram_main.py`, `telegram_requirements.txt`, `.env`
- Cron: `0 8 * * *`
- دستور: `python telegram_main.py`

### سرویس ۲: Webhook
- نام: `telegram-bot`
- فایل‌ها: `telegram_bot_server.py`, `telegram_requirements.txt`, `.env`
- دامنه: `https://telegram.yourdomain.com`
- پس از استقرار: رفتن به `/set_webhook`

---

## 📞 پشتیبانی

**مشکلات رایج:**

1. **پیام نمی‌رسد:**
   - بررسی `TELEGRAM_BOT_TOKEN`
   - بررسی Webhook
   - بررسی Chat ID در دیتابیس

2. **اتصال کاربر نمی‌شود:**
   - بررسی RLS Policies
   - بررسی `is_active = true`

3. **خطای Python:**
   - بررسی لاگ‌ها
   - بررسی اتصال اینترنت

---

**تاریخ:** ۲۸ دی ۱۴۰۴  
**وضعیت:** ✅ آماده استقرار

