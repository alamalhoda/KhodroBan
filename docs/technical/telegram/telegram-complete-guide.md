# 📘 راهنمای کامل سیستم نوتیفیکیشن تلگرام

## 🎯 هدف نهایی

**ارسال یادآوری سرویس دوره‌ای خودروها از طریق تلگرام، بدون هزینه و به صورت خودکار.**

---

## 📋 محتوای این راهنما

1. **معماری** - چطور کار می‌کند
2. **پیش‌نیازها** - چه چیزهایی لازم است
3. **مراحل اجرا** - قدم‌به‌قدم
4. **فایل‌های مورد نیاز** - لیست کامل
5. **تست** - چطور تست کنیم
6. **استقرار** - چطور به production ببریم
7. **عیب‌یابی** - مشکلات رایج

---

## 🏗️ معماری سیستم

```
┌─────────────────────────────────────────┐
│  Python Cron Job (هر روز ۸ صبح)        │
│  - خواندن خودروها                      │
│  - محاسبه روزهای مانده                 │
│  - اگر در بازه هشدار:                  │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  Telegram Bot API                       │
│  - ارسال پیام به کاربر                  │
│  - دریافت تأییدیه                       │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  Supabase (دیتابیس)                     │
│  - telegram_users (Chat ID)             │
│  - notifications (لاگ)                  │
│  - reminder_settings (تنظیمات)         │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  تلگرام کاربر                           │
│  - دریافت یادآوری                      │
│  - تعامل با دکمه‌ها                     │
└─────────────────────────────────────────┘
```

---

## 📦 فایل‌های مورد نیاز

### تعداد کل: ۱۱ فایل

| شماره | فایل | مسیر | توضیحات |
|-------|------|------|---------|
| ۱ | `005_telegram_users.sql` | `supabase/migrations/` | جدول دیتابیس |
| ۲ | `telegram_main.py` | `reminder-service/` | Cron Job |
| ۳ | `telegram_bot_server.py` | `reminder-service/` | Webhook |
| ۴ | `telegram_requirements.txt` | `reminder-service/` | Dependencies |
| ۵ | `telegram_env.example` | `reminder-service/` | الگوی env |
| ۶ | `+page.svelte` | `frontend/src/routes/profile/telegram/` | UI |
| ۷ | `telegramService.ts` | `frontend/src/lib/services/` | سرویس |
| ۸ | `TELEGRAM_README.md` | `reminder-service/` | راهنما |
| ۹ | `QUICK_START.md` | `reminder-service/` | سریع |
| ۱۰ | `telegram-checklist.md` | `docs/technical/` | چک‌لیست |
| ۱۱ | `telegram-summary.md` | `docs/technical/` | خلاصه |

---

## 🚀 مراحل اجرا (۶ مرحله)

### مرحله ۱: ساخت ربات (۲ دقیقه)

```
1. به @BotFather بروید
2. /newbot بزنید
3. نام: OilChenger Reminder Bot
4. Username: OilChengerReminderBot
5. توکن را کپی کنید
```

### مرحله ۲: اجرای SQL (۱ دقیقه)

```
1. باز کردن Supabase SQL Editor
2. کپی کردن 005_telegram_users.sql
3. اجرا
```

### مرحله ۳: آماده‌سازی Python (۳ دقیقه)

```bash
cd reminder-service
pip install -r telegram_requirements.txt
cp telegram_env.example .env
# .env را پر کنید
```

### مرحله ۴: تست لوکال (۵ دقیقه)

```bash
# ترمینال ۱
python telegram_main.py

# ترمینال ۲
python telegram_bot_server.py

# مرورگر
http://localhost:5000/set_webhook
```

### مرحله ۵: اتصال کاربر (۲ دقیقه)

```
1. وارد داشبورد شوید
2. بروید به /profile/telegram
3. کلیک "اتصال به تلگرام"
4. در تلگرام، Start را بزنید
```

### مرحله ۶: استقرار (۵ دقیقه)

```
1. آپلود فایل‌ها به چابکان
2. تنظیم Cron Job
3. تنظیم Webhook
```

**کل زمان: ۱۸ دقیقه**

---

## 🧪 تست

### تست ۱: اتصال
```python
# در Python
from supabase import create_client
import os

supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_SERVICE_ROLE_KEY"))
users = supabase.table('telegram_users').select('*').execute()
print(users.data)
```

### تست ۲: ارسال دستی
```python
from telegram_main import check_reminders_and_send_telegram
check_reminders_and_send_telegram()
```

### تست ۳: دریافت پیام
```
باید در تلگرام پیام دریافت کنید:
🔔 یادآوری سرویس دوره‌ای
خودرو: جک جی۴
...
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
- پس از استقرار: رفتن به `/set_webhook`

---

## ⚠️ مشکلات رایج

### مشکل ۱: پیام دریافت نمی‌شود
**راه‌حل:**
```bash
# بررسی Webhook
curl https://api.telegram.org/bot{TOKEN}/getWebhookInfo
```

### مشکل ۲: کاربر متصل نمی‌شود
**راه‌حل:**
```sql
-- بررسی RLS
SELECT * FROM telegram_users WHERE user_id = '...';
```

### مشکل ۳: خطای Python
**راه‌حل:**
```bash
# بررسی لاگ‌ها
tail -f logs/cron.log
```

---

## 💰 هزینه

| سرویس | هزینه |
|-------|-------|
| تلگرام | رایگان |
| Python | رایگان |
| Supabase | رایگان |
| **کل** | **۰ تومان** |

---

## ✅ چک‌لیست نهایی

- [ ] ربات ساخته شد
- [ ] توکن ذخیره شد
- [ ] SQL اجرا شد
- [ ] فایل‌های Python آماده شد
- [ ] `.env` پر شد
- [ ] تست لوکال انجام شد
- [ ] کاربر متصل شد
- [ ] پیام دریافت شد
- [ ] استقرار شد

---

## 📞 پشتیبانی

**مستندات کامل:**
- `telegram-notification-system.md` (۸۲۰ خط)

**راهنمای سریع:**
- `telegram-quick-start.md` (۱۰۰ خط)

**چک‌لیست:**
- `telegram-checklist.md` (۲۰۰ خط)

---

## 🎯 نتیجه نهایی

**وقتی همه چیز اجرا شود:**

✅ **هر روز ساعت ۸ صبح:**
- Python Cron Job اجرا می‌شود
- خودروهای نیازمند سرویس را پیدا می‌کند
- به تلگرام کاربران پیام می‌فرستد

✅ **کاربر:**
- پیام فوری در تلگرام دریافت می‌کند
- می‌تواند روی دکمه‌ها کلیک کند
- نیازی به باز کردن اپ ندارد

✅ **مزایا:**
- کاملاً رایگان
- کاملاً خودکار
- کاملاً قابل اعتماد

---

**تاریخ:** ۲۸ دی ۱۴۰۴  
**وضعیت:** ✅ آماده اجرا  
**توصیه:** شروع کنید!

