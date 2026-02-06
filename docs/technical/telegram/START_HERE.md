# 🚀 شروع از اینجا

## سیستم نوتیفیکیشن تلگرام برای یادآوری سرویس دوره‌ای خودروها

---

## 🎯 چرا این فایل؟

این فایل شما را به **اولین پیام تلگرام** می‌رساند.

---

## ⚡ ۵ دقیقه تا اجرا

### مرحله ۱: ساخت ربات (۲ دقیقه)

در تلگرام:
1. به **@BotFather** بروید
2. ارسال: `/newbot`
3. نام: `OilChenger Reminder`
4. Username: `OilChengerReminderBot`
5. **توکن را کپی کنید**

### مرحله ۲: اجرای SQL (۱ دقیقه)

در Supabase SQL Editor:
```sql
CREATE TABLE public.telegram_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    chat_id BIGINT NOT NULL UNIQUE,
    username TEXT,
    first_name TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, chat_id)
);

ALTER TABLE public.telegram_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own telegram data" ON public.telegram_users
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own telegram data" ON public.telegram_users
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service can manage all telegram data" ON public.telegram_users
    FOR ALL USING (auth.role() = 'service_role');

CREATE INDEX idx_telegram_users_user_id ON public.telegram_users(user_id);
CREATE INDEX idx_telegram_users_chat_id ON public.telegram_users(chat_id);
```

### مرحله ۳: دانلود فایل‌ها (۲ دقیقه)

**فایل‌های زیر را در `reminder-service/` ذخیره کنید:**

**telegram_main.py:**
```python
# کد کامل در: reminder-service/telegram_main.py
# یا از مستند کپی کنید
```

**telegram_bot_server.py:**
```python
# کد کامل در: reminder-service/telegram_bot_server.py
```

**telegram_requirements.txt:**
```
supabase==2.4.0
schedule==1.2.0
python-dotenv==1.0.0
requests==2.31.0
flask==3.0.0
```

**.env:**
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-key
TELEGRAM_BOT_TOKEN=123456:ABC-DEF... (از مرحله ۱)
CRON_TIME=08:00
WEBHOOK_URL=http://localhost:5000/webhook
```

### مرحله ۴: اجرا (۲ دقیقه)

**ترمینال ۱:**
```bash
cd reminder-service
pip install -r telegram_requirements.txt
python telegram_main.py
```

**ترمینال ۲:**
```bash
cd reminder-service
python telegram_bot_server.py
```

**مرورگر:**
```
http://localhost:5000/set_webhook
```

### مرحله ۵: تست (۱ دقیقه)

1. وارد داشبورد شوید
2. بروید به `/profile/telegram`
3. کلیک "اتصال به تلگرام"
4. در تلگرام، دکمه "Start" را بزنید
5. پیام دریافت کنید!

---

## ✅ تمام! پیام دریافت شد.

---

## 📚 مستندات بیشتر

| فایل | توضیحات |
|------|---------|
| **[telegram-complete-guide.md](./docs/technical/telegram-complete-guide.md)** | راهنمای کامل |
| **[telegram-quick-start.md](./docs/technical/telegram-quick-start.md)** | راهنمای سریع |
| **[telegram-checklist.md](./docs/technical/telegram-checklist.md)** | چک‌لیست |
| **[reminder-service/QUICK_START.md](./reminder-service/QUICK_START.md)** | راهنمای اجرا |

---

## 🆘 مشکل؟

**پیام دریافت نمی‌شود؟**
```bash
curl https://api.telegram.org/bot{TOKEN}/getWebhookInfo
```

**اتصال کاربر نمی‌شود؟**
- بررسی RLS Policies
- بررسی `.env`

**بیشتر سوالات:** `docs/technical/telegram-notification-system.md`

---

## 🎯 نتیجه

**وقتی اجرا شود:**
- ✅ هر روز ساعت ۸ صبح
- ✅ یادآوری خودکار در تلگرام
- ✅ بدون هزینه
- ✅ بدون نیاز به باز کردن اپ

---

**تاریخ:** ۲۸ دی ۱۴۰۴  
**وضعیت:** ✅ آماده شروع  
**موفق باشید! 🚀**

