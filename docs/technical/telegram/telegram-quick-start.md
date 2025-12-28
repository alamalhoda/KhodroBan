# راهنمای سریع اجرای سیستم تلگرام

## ⚡ ۵ مرحله تا اجرا

---

### مرحله ۱: ساخت ربات (۲ دقیقه)

1. در تلگرام، به **@BotFather** بروید
2. ارسال: `/newbot`
3. نام: `OilChenger Reminder Bot`
4. Username: `OilChengerReminderBot` (باید unique باشد)
5. **توکن را کپی کنید** (مثل: `123456:ABC-DEF...`)

---

### مرحله ۲: اجرای SQL (۱ دقیقه)

در Supabase SQL Editor کپی کنید:

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

CREATE POLICY "Users can update their own telegram data" ON public.telegram_users
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service can manage all telegram data" ON public.telegram_users
    FOR ALL USING (auth.role() = 'service_role');

CREATE INDEX idx_telegram_users_user_id ON public.telegram_users(user_id);
CREATE INDEX idx_telegram_users_chat_id ON public.telegram_users(chat_id);
CREATE INDEX idx_telegram_users_active ON public.telegram_users(is_active);
```

---

### مرحله ۳: فایل‌های Python (۳ دقیقه)

**پوشه: `reminder-service/`**

**فایل ۱: `requirements.txt`**
```
supabase==2.4.0
schedule==1.2.0
python-dotenv==1.0.0
requests==2.31.0
flask==3.0.0
```

**فایل ۲: `.env`**
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-key-here
TELEGRAM_BOT_TOKEN=123456:ABC-DEF... (از مرحله ۱)
CRON_TIME=08:00
WEBHOOK_URL=https://your-domain.com/webhook
```

**فایل ۳: `main.py`** (کد کامل در مستند اصلی)

**فایل ۴: `bot_server.py`** (کد کامل در مستند اصلی)

---

### مرحله ۴: اجرا و تست (۵ دقیقه)

**ترمینال ۱:**
```bash
cd reminder-service
pip install -r requirements.txt
python main.py
```

**ترمینال ۲:**
```bash
cd reminder-service
python bot_server.py
```

**تنظیم Webhook (یک‌بار):**
```bash
curl http://localhost:5000/set_webhook
```

---

### مرحله ۵: اتصال کاربر

1. **در فرانت‌اند:** به `/profile/telegram` بروید
2. **کلیک:** "اتصال به تلگرام"
3. **در تلگرام:** دکمه "Start" را بزنید
4. **تمام!** اتصال برقرار شد

---

## 🧪 تست سریع

### تست ۱: اتصال کاربر
```bash
# در Python
python -c "
from supabase import create_client
import os
from dotenv import load_dotenv
load_dotenv()

supabase = create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_SERVICE_ROLE_KEY'))
users = supabase.table('telegram_users').select('*').execute()
print(users.data)
"
```

### تست ۲: ارسال دستی
```python
# در Python
from main import send_telegram_message

# جایگزین کنید با Chat ID واقعی
send_telegram_message(123456789, "✅ تست موفق!")
```

### تست ۳: اجرای کامل
```python
# در Python
from main import check_reminders_and_send_telegram
check_reminders_and_send_telegram()
```

---

## 📱 کارهای کاربر

### برای کاربران:

**فقط ۲ کار:**

1. **در وب‌سایت:**
   - بروید به پروفایل → اتصال تلگرام
   - کلیک کنید "اتصال به تلگرام"

2. **در تلگرام:**
   - دکمه "Start" را بزنید

**تمام!** از این به بعد یادآوری خودکار دریافت می‌کنند.

---

## 🚀 استقرار

### در چابکان:

**سرویس ۱: Cron Job**
- نام: `reminder-telegram`
- فایل‌ها: `main.py`, `requirements.txt`, `.env`
- Cron: `0 8 * * *`
- دستور: `python main.py`

**سرویس ۲: Webhook Server**
- نام: `telegram-bot`
- فایل‌ها: `bot_server.py`, `requirements.txt`, `.env`
- دامنه: `https://telegram.yourdomain.com`
- پس از استقرار: رفتن به `/set_webhook`

---

## ✅ چک‌لیست نهایی

- [ ] ربات ساخته شد
- [ ] توکن ذخیره شد
- [ ] SQL اجرا شد
- [ ] فایل‌های Python آماده شد
- [ ] `.env` پر شد
- [ ] تست لوکال انجام شد
- [ ] Webhook تنظیم شد
- [ ] کاربر اتصال برقرار کرد
- [ ] یادآوری دریافت شد

---

## 🆘 مشکلات؟

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

**کاربر متصل نمی‌شود:**
- بررسی RLS Policies
- بررسی `is_active = true`

---

**تاریخ:** ۲۸ دی ۱۴۰۴  
**زمان تقریبی اجرا:** ۱۵ دقیقه  
**سطح دشواری:** ⭐⭐ (متوسط)

