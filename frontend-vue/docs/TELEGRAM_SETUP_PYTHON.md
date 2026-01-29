# راه‌اندازی ربات تلگرام برای یادآوری سرویس دوره‌ای

این مستند راهنمای کامل راه‌اندازی ربات تلگرام برای ارسال یادآوری‌های سرویس دوره‌ای خودروها است.

---

## 📋 فهرست مطالب

1. [مراحل راه‌اندازی ربات](#مراحل-راه‌اندازی-ربات)
2. [تنظیمات Backend (Python)](#تنظیمات-backend-python)
3. [تنظیمات Frontend](#تنظیمات-frontend)
4. [تست سیستم](#تست-سیستم)
5. [عیب‌یابی](#عیب‌یابی)

---

## 🤖 مراحل راه‌اندازی ربات

### مرحله ۱: ایجاد ربات در BotFather

1. **باز کردن BotFather در تلگرام:**
   - به `@BotFather` در تلگرام پیام بدهید
   - دستور `/start` را بزنید

2. **ایجاد ربات جدید:**
   ```
   /newbot
   ```

3. **تنظیم نام ربات:**
   - نام نمایشی: `KhodroBan Reminder Bot` (یا هر نام دیگری)
   - نام کاربری: `KhodroBanReminderBot` (باید به `bot` ختم شود)

4. **دریافت توکن:**
   - BotFather یک توکن به شما می‌دهد، مثل:
     ```
     123456789:ABCdefGHIjklMNOpqrsTUVwxyz
     ```
   - این توکن را در جایی امن نگه دارید

5. **تنظیمات اختیاری ربات:**
   ```
   /setdescription
   ```
   توضیحات: `ربات یادآوری سرویس دوره‌ای خودرو - KhodroBan`

   ```
   /setabouttext
   ```
   درباره: `با اتصال به این ربات، یادآوری سرویس دوره‌ای خودروهای خود را در تلگرام دریافت کنید.`

---

## ⚙️ تنظیمات Backend (Python)

### مرحله ۲: نصب وابستگی‌ها

در پوشه `reminder-service`:

```bash
pip install python-telegram-bot
# یا
pip install -r requirements.txt
```

**فایل `requirements.txt` باید شامل باشد:**
```
supabase==2.4.0
schedule==1.2.0
python-dotenv==1.0.0
requests==2.31.0
python-telegram-bot==20.7
```

### مرحله ۳: ایجاد فایل ربات تلگرام

**فایل: `reminder-service/bot.py`**

```python
import os
import logging
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes
from supabase import create_client, Client

# تنظیمات
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN")

if not BOT_TOKEN:
    logging.error("❌ TELEGRAM_BOT_TOKEN not found!")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """
    شروع ربات و ذخیره chat_id با استفاده از کد یکتا
    مثال: /start ABC123XYZ
    """
    user = update.effective_user
    chat_id = str(update.effective_chat.id)
    
    # دریافت کد از پارامتر start
    if context.args and len(context.args) > 0:
        connection_code = context.args[0]
        
        # پیدا کردن کاربر با کد یکتا
        result = supabase.table("telegram_settings") \
            .select("user_id") \
            .eq("connection_code", connection_code) \
            .eq("is_enabled", False) \
            .maybe_single() \
            .execute()
        
        if result.data:
            user_id = result.data["user_id"]
            
            # ذخیره chat_id و فعال‌سازی
            supabase.table("telegram_settings") \
                .update({
                    "chat_id": chat_id,
                    "is_enabled": True,
                    "connection_code": None  # پاک کردن کد بعد از استفاده
                }) \
                .eq("user_id", user_id) \
                .execute()
            
            logging.info(f"✅ کاربر {user_id} با chat_id {chat_id} متصل شد")
            
            await update.message.reply_text(
                "✅ اتصال با موفقیت انجام شد!\n\n"
                "حالا هر روز یادآوری سرویس دوره‌ای خودرو رو در تلگرام دریافت می‌کنید.\n"
                "می‌توانید از طریق برنامه KhodroBan وضعیت رو مدیریت کنید."
            )
        else:
            await update.message.reply_text(
                "❌ کد نامعتبر یا منقضی شده است.\n\n"
                "لطفاً دوباره در برنامه KhodroBan اقدام کنید:\n"
                "1. به بخش تنظیمات تلگرام بروید\n"
                "2. روی 'اتصال به ربات تلگرام' کلیک کنید\n"
                "3. دکمه Start رو در تلگرام بزنید"
            )
    else:
        # اگر کد ارسال نشده باشد
        await update.message.reply_text(
            "سلام! 👋\n\n"
            "برای اتصال ربات به حساب KhodroBan خود:\n"
            "1. به برنامه KhodroBan بروید\n"
            "2. به بخش تنظیمات تلگرام بروید\n"
            "3. روی 'اتصال به ربات تلگرام' کلیک کنید\n"
            "4. دکمه Start رو بزنید\n\n"
            "اتصال به صورت خودکار انجام می‌شود!"
        )

async def status(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """نمایش وضعیت اتصال"""
    chat_id = str(update.effective_chat.id)
    
    # پیدا کردن کاربر با chat_id
    result = supabase.table("telegram_settings") \
        .select("user_id, is_enabled") \
        .eq("chat_id", chat_id) \
        .eq("is_enabled", True) \
        .maybe_single() \
        .execute()
    
    if result.data:
        await update.message.reply_text(
            "✅ وضعیت اتصال: فعال\n\n"
            f"کاربر: {result.data['user_id']}\n"
            "حالا یادآوری‌ها رو دریافت می‌کنید!"
        )
    else:
        await update.message.reply_text(
            "❌ وضعیت اتصال: غیرفعال\n\n"
            "لطفاً از برنامه KhodroBan مجدداً اقدام کنید."
        )

def main():
    """اجرای ربات"""
    if not BOT_TOKEN:
        logging.error("توکن تلگرام یافت نشد!")
        return
    
    application = Application.builder().token(BOT_TOKEN).build()
    
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("status", status))
    
    logging.info("ربات تلگرام در حال اجرا...")
    logging.info("منتظر دستور /start و /status")
    application.run_polling()

if __name__ == "__main__":
    main()
```

### مرحله ۴: تنظیم متغیرهای محیطی

**فایل: `.env` در `reminder-service/`**

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
CRON_TIME=08:00
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_BOT_USERNAME=KhodroBanReminderBot
```

### مرحله ۵: اجرای ربات

```bash
cd reminder-service
python bot.py
```

ربات باید در حال اجرا باشد و پیام زیر را نمایش دهد:
```
ربات تلگرام در حال اجرا...
منتظر دستور /start و /status
```

---

## 🎨 تنظیمات Frontend

### مرحله ۶: افزودن متغیر محیطی

**فایل: `.env` در `frontend-vue/`**

```bash
VITE_TELEGRAM_BOT_USERNAME=KhodroBanReminderBot
```

**نکته:** نام کاربری ربات را بدون `@` وارد کنید.

### مرحله ۷: اجرای Migration

در Supabase SQL Editor یا از طریق CLI:

```bash
supabase migration up
```

یا مستقیماً فایل `010_telegram_settings.sql` را در SQL Editor اجرا کنید.

---

## 🧪 تست سیستم

### تست ۱: اتصال از Frontend

1. **اجرای Frontend:**
   ```bash
   cd frontend-vue
   npm run dev
   ```

2. **لاگین در برنامه:**
   - وارد حساب کاربری شوید

3. **رفتن به تنظیمات:**
   - به صفحه Settings بروید
   - بخش "اتصال به تلگرام" را پیدا کنید

4. **کلیک روی "اتصال به ربات تلگرام":**
   - لینک تلگرام باز می‌شود
   - دکمه **Start** را بزنید

5. **بررسی:**
   - در برنامه باید پیام "اتصال با موفقیت برقرار شد!" نمایش داده شود
   - در Supabase، جدول `telegram_settings` باید `chat_id` و `is_enabled = true` داشته باشد

### تست ۲: ارسال یادآوری

1. **ایجاد یادآوری تست:**
   - یک خودرو اضافه کنید
   - یک سرویس با تاریخ ۲۵ روز پیش ثبت کنید
   - تنظیمات یادآوری: ۳۰ روز، هشدار ۷ روز قبل

2. **اجرای Cron Job:**
   ```bash
   cd reminder-service
   python main.py
   ```

3. **بررسی:**
   - ✅ نوتیفیکیشن در داشبورد
   - ✅ پیام در تلگرام
   - ✅ لاگ‌ها: "✅ پیام تلگرام ارسال شد"

---

## 🔧 عیب‌یابی

### مشکل ۱: ربات Start نمی‌کند

**علت:** ربات در حال اجرا نیست

**راه‌حل:**
```bash
# بررسی اینکه ربات در حال اجرا است
ps aux | grep bot.py

# اجرای ربات
cd reminder-service
python bot.py
```

### مشکل ۲: کد نامعتبر است

**علت:** کد منقضی شده یا قبلاً استفاده شده

**راه‌حل:**
- در Frontend، روی "دریافت لینک جدید" کلیک کنید
- لینک جدید را باز کنید و Start بزنید

### مشکل ۳: پیام تلگرام ارسال نمی‌شود

**علت:** `chat_id` ذخیره نشده یا `is_enabled = false`

**راه‌حل:**
```sql
-- بررسی وضعیت در Supabase
SELECT * FROM telegram_settings WHERE user_id = 'your-user-id';

-- اگر chat_id null است، دوباره اتصال برقرار کنید
```

### مشکل ۴: خطای "TELEGRAM_BOT_TOKEN not found"

**علت:** متغیر محیطی تنظیم نشده

**راه‌حل:**
- فایل `.env` را بررسی کنید
- مطمئن شوید `TELEGRAM_BOT_TOKEN` تنظیم شده است

---

## 📝 نکات مهم

1. **امنیت:**
   - هرگز توکن ربات را در کد commit نکنید
   - از `.env` و `.gitignore` استفاده کنید
   - Service Role Key فقط در Backend استفاده شود

2. **محدودیت‌ها:**
   - تلگرام: ۳۰ پیام/ثانیه
   - کد اتصال: یک‌بار مصرف (بعد از استفاده پاک می‌شود)

3. **بهینه‌سازی:**
   - ربات را در production با systemd یا supervisor اجرا کنید
   - از Webhook به جای Polling استفاده کنید (اختیاری)

---

## ✅ چک‌لیست نهایی

- [ ] ربات در BotFather ایجاد شد
- [ ] توکن ربات دریافت شد
- [ ] فایل `bot.py` ایجاد شد
- [ ] متغیرهای محیطی تنظیم شدند
- [ ] ربات در حال اجرا است
- [ ] Migration اجرا شد
- [ ] Frontend متغیر `VITE_TELEGRAM_BOT_USERNAME` دارد
- [ ] تست اتصال موفق بود
- [ ] تست ارسال یادآوری موفق بود

---

**تاریخ ایجاد:** ۱۴۰۴/۱۱/۰۵  
**وضعیت:** ✅ آماده استفاده
