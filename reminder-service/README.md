# سرویس یادآوری خودروها

## 📋 خلاصه

این سرویس یادآوری سرویس دوره‌ای خودروها را از طریق **تلگرام** ارسال می‌کند.

---

## 🎯 ساختار پوشه

```
reminder-service/
├── README.md                      # این فایل
├── QUICK_START.md                 # راهنمای سریع
├── TELEGRAM_README.md             # راهنمای تلگرام
├── main.py                        # سرویس اصلی (SMS/Email)
├── telegram_main.py               # Cron Job تلگرام
├── telegram_bot_server.py         # Webhook تلگرام
├── telegram_requirements.txt      # Dependencies تلگرام
├── telegram_env.example           # الگوی env
├── telegram_Dockerfile            # Dockerfile
├── telegram_supervisord.conf      # Supervisord
├── telegram_test_data.sql         # داده‌های تست
├── test_run.py                    # تست سریع
└── requirements.txt               # Dependencies اصلی
```

---

## 🚀 شروع سریع

### گزینه ۱: تلگرام (پیشنهادی)

```bash
# ۱. نصب
pip install -r telegram_requirements.txt

# ۲. تنظیم .env
cp telegram_env.example .env
# سپس .env را ویرایش کنید

# ۳. اجرا
python telegram_main.py          # Cron Job
python telegram_bot_server.py    # Webhook
```

**راهنمای کامل:** [TELEGRAM_README.md](./TELEGRAM_README.md)

### گزینه ۲: سرویس اصلی (SMS/Email)

```bash
pip install -r requirements.txt
cp .env.example .env
python main.py
```

---

## 📚 مستندات

| سرویس | مستندات |
|-------|---------|
| **تلگرام** | [TELEGRAM_README.md](./TELEGRAM_README.md) |
| **سریع** | [QUICK_START.md](./QUICK_START.md) |
| **اصلی** | [../docs/technical/reminder-system-python.md](../docs/technical/reminder-system-python.md) |

---

## 🧪 تست

### تست سریع
```bash
python test_run.py
```

### تست تلگرام
```bash
python -c "
from telegram_main import check_reminders_and_send_telegram
check_reminders_and_send_telegram()
"
```

---

## 🐳 Docker

### ساخت تصویر
```bash
docker build -f telegram_Dockerfile -t reminder-telegram .
```

### اجرا
```bash
docker run -d \
  --env-file .env \
  -p 5000:5000 \
  reminder-telegram
```

---

## 🚀 استقرار

### چابکان

**سرویس ۱: Cron Job**
- نام: `reminder-telegram`
- فایل‌ها: `telegram_main.py`, `telegram_requirements.txt`, `.env`
- Cron: `0 8 * * *`
- دستور: `python telegram_main.py`

**سرویس ۲: Webhook**
- نام: `telegram-bot`
- فایل‌ها: `telegram_bot_server.py`, `telegram_requirements.txt`, `.env`
- دامنه: `https://telegram.yourdomain.com`
- پس از استقرار: `/set_webhook`

---

## 📊 مقایسه سرویس‌ها

| ویژگی | تلگرام | اصلی (SMS/Email) |
|-------|--------|------------------|
| هزینه | رایگان | پولی (SMS) |
| سرعت | ⚡ فوری | ⚡ فوری |
| تعامل | ✅ دکمه‌ها | ❌ محدود |
| پیچیدگی | ⭐⭐ | ⭐⭐⭐ |

---

## ⚠️ نکات مهم

### امنیت
- ❌ توکن‌ها را در کد نگذارید
- ✅ فقط در `.env` نگه دارید
- ✅ از Service Role Key فقط در Python استفاده کنید

### محدودیت‌ها
- تلگرام: ۱۰۰۰ پیام/روز (برای ربات جدید)
- Supabase: ۵۰۰MB دیتابیس

---

## 📞 پشتیبانی

**مستندات کامل:** `../docs/technical/telegram-notification-system.md`

**چک‌لیست:** `../docs/technical/telegram-checklist.md`

---

## 🎯 نتیجه

**وقتی اجرا شود:**
- ✅ هر روز ساعت ۸ صبح
- ✅ خودروهای نیازمند سرویس
- ✅ یادآوری در تلگرام
- ✅ بدون هزینه

---

**تاریخ:** ۲۸ دی ۱۴۰۴  
**وضعیت:** ✅ آماده استقرار
