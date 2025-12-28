# 📱 راهنمای قدم‌به‌قدم اتصال به تلگرام

### 🎯 هدف: دریافت یادآوری سرویس دوره‌ای در تلگرام

---

## 📋 ۵ قدم ساده

### قدم ۱: ساخت ربات تلگرام (۲ دقیقه)

1. در تلگرام، به **@BotFather** بروید
2. دستور `/newbot` را ارسال کنید
3. یک نام انتخاب کنید: `OilChenger Reminder Bot`
4. یک username انتخاب کنید (باید unique باشد): `OilChengerReminderBot`
5. **توکن را کپی کنید** (مثل: `123456:ABC-DEF...`)

---

### قدم ۲: اجرای SQL در Supabase (۱ دقیقه)

در Supabase SQL Editor این کد را اجرا کنید:

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

---

### قدم ۳: آماده‌سازی سرویس Python (۳ دقیقه)

**۳.۱. فایل‌های مورد نیاز را در پوشه `reminder-service/` ذخیره کنید:**

- `telegram_main.py` (کد اصلی)
- `telegram_bot_server.py` (سرور Webhook)
- `telegram_requirements.txt` (dependencies)
- `telegram_env.example` (الگوی تنظیمات)

**۳.۲. نصب dependencies:**
```bash
cd reminder-service
pip install -r telegram_requirements.txt
```

**۳.۳. ایجاد فایل `.env`:**
```bash
cp telegram_env.example .env
```

**۳.۴. پر کردن `.env`:**
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
TELEGRAM_BOT_TOKEN=123456:ABC-DEF... (از قدم ۱)
CRON_TIME=08:00
WEBHOOK_URL=https://your-domain.com/webhook
```

---

### قدم ۴: اجرا و تست (۵ دقیقه)

**۴.۱. اجرای سرویس‌ها:**

**ترمینال ۱ (Cron Job):**
```bash
python telegram_main.py
```

**ترمینال ۲ (Webhook Server):**
```bash
python telegram_bot_server.py
```

**۴.۲. تنظیم Webhook (یک‌بار):**

در مرورگر باز کنید:
```
http://localhost:5000/set_webhook
```

**پاسخ باید این باشد:**
```json
{"ok": true, "result": true}
```

---

### قدم ۵: اتصال حساب کاربری (۲ دقیقه)

**۵.۱. در وب‌سایت:**
- وارد داشبورد شوید
- به بخش **پروفایل** بروید
- روی **"اتصال تلگرام"** کلیک کنید

**۵.۲. در تلگرام:**
- لینک باز می‌شود
- دکمه **"Start"** را بزنید

**۵.۳. تأیید:**
- پیام خوش‌آمدگویی دریافت می‌کنید
- اتصال کامل شد!

---

## ✅ تمام! حالا چه اتفاقی می‌افتد؟

### هر روز ساعت ۸ صبح:
1. Python Cron Job اجرا می‌شود
2. خودروهای نیازمند سرویس را پیدا می‌کند
3. به تلگرام شما پیام می‌فرستد

### نمونه پیام:
```
🔔 یادآوری سرویس دوره‌ای

🚗 خودرو: جک جی۴
📋 پلاک: 55 - 523 ب ۱۱
⏰ روزهای مانده: ۷ روز
📅 موعد سرویس: هر ۹۰ روز

دکمه‌ها: ✅ انجام شد | ℹ️ جزئیات
```

---

## 🆘 مشکل؟

**پیام دریافت نمی‌شود؟**
```bash
# بررسی Webhook
curl https://api.telegram.org/bot{TOKEN}/getWebhookInfo
```

**اتصال کاربر نمی‌شود؟**
- بررسی RLS Policies
- بررسی `.env`

---

## 📚 مستندات بیشتر

- **کامل:** `telegram-notification-system.md`
- **سریع:** `telegram-quick-start.md`
- **چک‌لیست:** `telegram-checklist.md`

---

**تاریخ:** ۲۸ دی ۱۴۰۴  
**زمان کل:** ۱۳ دقیقه  
**هزینه:** ۰ تومان ✅

