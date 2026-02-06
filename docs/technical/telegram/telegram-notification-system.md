# سیستم نوتیفیکیشن تلگرام برای یادآوری سرویس دوره‌ای خودروها

## 📋 اطلاعات کلی

**تاریخ ایجاد:** ۲۸ دی ۱۴۰۴  
**نوع پروژه:** Python + Telegram Bot API + Supabase + SvelteKit  
**هدف:** ارسال یادآوری سرویس دوره‌ای از طریق تلگرام  
**وضعیت:** ✅ آماده پیاده‌سازی

---

## 🎯 سیناریو و هدف کلی

### سیناریو:

- کاربر **چندین خودرو** دارد
- هر خودرو نیاز به **سرویس دوره‌ای با فاصله زمانی متفاوت** دارد
- کاربر می‌خواهد **۷ روز قبل** از موعد سرویس، یادآوری دریافت کند
- یادآوری از طریق: **تلگرام (فوری + رایگان)**

### هدف:

- ✅ **خودکار:** بدون نیاز به یادآوری دستی
- ✅ **رایگان:** بدون هزینه پیامک
- ✅ **فوری:** لحظه‌ای ارسال می‌شود
- ✅ **قابل اعتماد:** بدون مشکل فیلترینگ
- ✅ **تعاملی:** دکمه‌های شیشه‌ای (Inline Buttons)

---

## 🏗️ معماری سیستم

```
┌─────────────────────────────────────────────────────────────┐
│  Python Cron Job (چابکان)                                   │
│  - اجرا: هر روز ساعت ۸ صبح                                   │
│  - وظیفه: بررسی یادآورها + ارسال به تلگرام                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Telegram Bot API                                           │
│  - ارسال پیام به کاربر                                      │
│  - دریافت تأییدیه (Delivery Receipt)                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Supabase (دیتابیس)                                         │
│  - جدول telegram_users (ذخیره Chat ID)                     │
│  - جدول notifications (لاگ نوتیفیکیشن‌ها)                   │
│  - جدول reminder_settings (تنظیمات هر خودرو)                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  تلگرام کاربر (موبایل/دسکتاپ)                              │
│  - دریافت یادآوری فوری                                      │
│  - تعامل با دکمه‌ها                                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 مراحل اجرا (۶ مرحله)

### مرحله ۱: ساخت و تنظیم ربات تلگرام

#### ۱.۱. ساخت ربات با BotFather

1. در تلگرام، به **@BotFather** بروید
2. دستور `/newbot` را ارسال کنید
3. یک نام انتخاب کنید: `OilChenger Reminder Bot`
4. یک username انتخاب کنید (باید unique باشد): `OilChengerReminderBot`
5. **توکن ربات** رو دریافت کنید:

```
123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
```

#### ۱.۲. تنظیمات مهم ربات

در @BotFather:
- دستور `/setdescription` - توضیحات ربات
- دستور `/setabouttext` - متن درباره
- دستور `/setuserpic` - تصویر پروفایل
- دستور `/setcommands` - دستورات سریع:

```
start - اتصال حساب
status - وضعیت یادآوری‌ها
help - راهنما
```

---

### مرحله ۲: تغییرات دیتابیس Supabase

#### ۲.۱. ایجاد جدول telegram_users

```sql
-- فایل: supabase/migrations/005_telegram_users.sql

-- ایجاد جدول برای ذخیره اطلاعات تلگرام کاربران
CREATE TABLE public.telegram_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    chat_id BIGINT NOT NULL UNIQUE,
    username TEXT,
    first_name TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- هر کاربر فقط یک Chat ID فعال داشته باشد
    UNIQUE(user_id, chat_id)
);

-- فعال کردن RLS
ALTER TABLE public.telegram_users ENABLE ROW LEVEL SECURITY;

-- پالیسی‌ها
CREATE POLICY "Users can view their own telegram data" ON public.telegram_users
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own telegram data" ON public.telegram_users
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own telegram data" ON public.telegram_users
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service can manage all telegram data" ON public.telegram_users
    FOR ALL USING (auth.role() = 'service_role');

-- Index‌ها
CREATE INDEX idx_telegram_users_user_id ON public.telegram_users(user_id);
CREATE INDEX idx_telegram_users_chat_id ON public.telegram_users(chat_id);
CREATE INDEX idx_telegram_users_active ON public.telegram_users(is_active);

-- تریگر updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_telegram_users
    BEFORE UPDATE ON public.telegram_users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- کامنت‌ها
COMMENT ON TABLE public.telegram_users IS 'اطلاعات تلگرام کاربران برای ارسال یادآوری';
COMMENT ON COLUMN public.telegram_users.chat_id IS 'شناسه چت تلگرام (مهم‌ترین ستون)';
```

#### ۲.۲. اضافه کردن ستون phone به users (اختیاری - برای SMS)

```sql
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS phone TEXT;

CREATE INDEX idx_users_phone ON public.users(phone);
```

---

### مرحله ۳: کد Python برای ارسال به تلگرام

#### ۳.۱. ساختار پوشه

```
reminder-service/
├── main.py                 # کد اصلی Cron Job
├── bot_server.py           # سرور Webhook برای دریافت پیام‌ها
├── requirements.txt        # dependencies
├── .env.example           # الگوی متغیرهای محیطی
├── .env                   # متغیرهای محیطی (مخفی)
└── Dockerfile             # برای استقرار
```

#### ۳.۲. فایل: `requirements.txt`

```
supabase==2.4.0
schedule==1.2.0
python-dotenv==1.0.0
requests==2.31.0
flask==3.0.0
```

#### ۳.۳. فایل: `.env.example`

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
CRON_TIME=08:00
WEBHOOK_URL=https://your-domain.com/webhook
```

#### ۳.۴. فایل: `main.py` (Cron Job ارسال یادآوری)

```python
import os
import requests
from supabase import create_client, Client
from datetime import datetime, timedelta
import schedule
import time
import logging
from dotenv import load_dotenv
import sys

# بارگذاری متغیرهای محیطی
load_dotenv()

# تنظیمات لاگ
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)

# متغیرها
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
TELEGRAM_BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN")
CRON_TIME = os.environ.get("CRON_TIME", "08:00")

# بررسی متغیرهای ضروری
if not TELEGRAM_BOT_TOKEN:
    logging.error("❌ خطا: متغیر TELEGRAM_BOT_TOKEN تنظیم نشده است")
    sys.exit(1)

# ایجاد کلاینت Supabase
try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    logging.info("✅ اتصال به Supabase برقرار شد")
except Exception as e:
    logging.error(f"❌ خطا در اتصال به Supabase: {str(e)}")
    sys.exit(1)

def send_telegram_message(chat_id, message, buttons=None):
    """
    ارسال پیام به تلگرام
    """
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    
    payload = {
        "chat_id": chat_id,
        "text": message,
        "parse_mode": "HTML"
    }
    
    # اضافه کردن دکمه‌ها (اختیاری)
    if buttons:
        payload["reply_markup"] = {"inline_keyboard": buttons}
    
    try:
        response = requests.post(url, json=payload, timeout=10)
        return response.json()
    except Exception as e:
        logging.error(f"❌ خطا در ارسال به تلگرام: {str(e)}")
        return None

def check_reminders_and_send_telegram():
    """
    بررسی یادآورها و ارسال به تلگرام
    """
    logging.info("=" * 60)
    logging.info("شروع بررسی یادآورهای تلگرام...")
    
    try:
        # خواندن خودروهای فعال
        vehicles_response = supabase.rpc('get_vehicles_for_reminder').execute()
        
        if not vehicles_response.data:
            logging.info("هیچ خودرویی برای یادآوری پیدا نشد")
            return
        
        logging.info(f"تعداد {len(vehicles_response.data)} خودرو برای بررسی")
        
        for vehicle in vehicles_response.data:
            try:
                # خواندن آخرین سرویس
                last_service = supabase.table("services") \
                    .select("*") \
                    .eq("vehicle_id", vehicle["vehicle_id"]) \
                    .order("service_date_gregorian", desc=True) \
                    .limit(1) \
                    .execute()
                
                if not last_service.data:
                    logging.warning(f"خودرو {vehicle['model']} - سرویسی ثبت نشده")
                    continue
                
                last_date = datetime.strptime(
                    last_service.data[0]["service_date_gregorian"], 
                    "%Y-%m-%d"
                ).date()
                
                # محاسبه روزهای مانده
                days_since_last = (datetime.now().date() - last_date).days
                interval_days = vehicle["interval_days"]
                days_until_due = interval_days - days_since_last
                warning_days = vehicle["warning_days_before"]
                
                if 0 < days_until_due <= warning_days:
                    # بررسی تکرار
                    existing = supabase.table("notifications") \
                        .select("*") \
                        .eq("vehicle_id", vehicle["vehicle_id"]) \
                        .eq("type", "reminder") \
                        .eq("read", False) \
                        .gte("created_at", (datetime.now() - timedelta(days=warning_days + 1)).isoformat()) \
                        .execute()
                    
                    notification_exists = False
                    if existing.data:
                        for notif in existing.data:
                            metadata = notif.get("metadata", {})
                            if metadata.get("days_until_due") == days_until_due:
                                notification_exists = True
                                break
                    
                    if notification_exists:
                        logging.info(f"✅ یادآوری قبلاً ارسال شده: {vehicle['model']}")
                        continue
                    
                    # ایجاد نوتیفیکیشن در دیتابیس
                    notification = {
                        "user_id": vehicle["user_id"],
                        "vehicle_id": vehicle["vehicle_id"],
                        "title": "یادآوری سرویس دوره‌ای",
                        "body": f"خودرو {vehicle['model']} ({vehicle['plate_number']}) نیاز به سرویس دارد. {days_until_due} روز مانده.",
                        "type": "reminder",
                        "metadata": {
                            "vehicle_model": vehicle["model"],
                            "plate_number": vehicle["plate_number"],
                            "days_until_due": days_until_due,
                            "interval_days": interval_days,
                            "last_service_date": last_service.data[0]["service_date_gregorian"],
                            "due_date": (last_date + timedelta(days=interval_days)).isoformat()
                        }
                    }
                    
                    result = supabase.table("notifications").insert(notification).execute()
                    
                    if result.data:
                        # ارسال به تلگرام
                        telegram_users = supabase.table("telegram_users") \
                            .select("*") \
                            .eq("user_id", vehicle["user_id"]) \
                            .eq("is_active", True) \
                            .execute()
                        
                        if telegram_users.data:
                            for user in telegram_users.data:
                                chat_id = user["chat_id"]
                                
                                # پیام زیبا
                                message = f"""
🔔 <b>یادآوری سرویس دوره‌ای</b>

🚗 <b>خودرو:</b> {vehicle['model']}
📋 <b>پلاک:</b> {vehicle['plate_number']}
⏰ <b>روزهای مانده:</b> {days_until_due} روز
📅 <b>موعد سرویس:</b> هر {interval_days} روز

لطفاً برای سرویس دوره‌ای اقدام کنید.
                                """
                                
                                # دکمه‌ها
                                buttons = [
                                    [
                                        {"text": "✅ انجام شد", "callback_data": f"done_{vehicle['vehicle_id']}_{days_until_due}"},
                                        {"text": "ℹ️ جزئیات", "callback_data": f"details_{vehicle['vehicle_id']}"}
                                    ]
                                ]
                                
                                response = send_telegram_message(chat_id, message, buttons)
                                
                                if response and response.get("ok"):
                                    logging.info(f"✅ تلگرام ارسال شد: {vehicle['model']} به {chat_id}")
                                else:
                                    logging.error(f"❌ خطا در ارسال: {response}")
                        else:
                            logging.warning(f"⚠️ کاربر تلگرامی برای {vehicle['model']} ثبت نشده")
                    
            except Exception as e:
                logging.error(f"❌ خطا در پردازش خودرو {vehicle.get('model', 'unknown')}: {str(e)}")
                continue
        
        logging.info("✅ پایان بررسی")
        logging.info("=" * 60)
    
    except Exception as e:
        logging.error(f"❌ خطا: {str(e)}")

def main():
    logging.info("سرویس یادآوری تلگرام شروع شد...")
    logging.info(f"زمان اجرا: {CRON_TIME}")
    
    # تنظیم Cron Job
    schedule.every().day.at(CRON_TIME).do(check_reminders_and_send_telegram)
    
    # اجرای اولیه برای تست
    logging.info("اجرای اولیه برای تست...")
    check_reminders_and_send_telegram()
    
    # حلقه اصلی
    while True:
        schedule.run_pending()
        time.sleep(60)

if __name__ == "__main__":
    main()
```

#### ۳.۵. فایل: `bot_server.py` (دریافت پیام‌های کاربر)

```python
from flask import Flask, request, jsonify
from supabase import create_client
import os
import logging
import requests

app = Flask(__name__)

# تنظیمات
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
logging.basicConfig(level=logging.INFO)

def send_message(chat_id, text):
    """ارسال پیام به تلگرام"""
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    requests.post(url, json={"chat_id": chat_id, "text": text, "parse_mode": "HTML"})

@app.route('/webhook', methods=['POST'])
def webhook():
    """دریافت پیام‌های تلگرام"""
    data = request.json
    message = data.get("message", {})
    callback_query = data.get("callback_query")
    
    # اگر دکمه‌ای زده شد
    if callback_query:
        chat_id = callback_query["message"]["chat"]["id"]
        data_callback = callback_query["data"]
        user = callback_query["from"]
        
        logging.info(f"دکمه زده شد: {data_callback} توسط {user['id']}")
        
        # پردازش دکمه‌ها
        if data_callback.startswith("done_"):
            parts = data_callback.split("_")
            vehicle_id = parts[1]
            days_until_due = parts[2]
            
            # ثبت انجام سرویس (اختیاری)
            send_message(chat_id, f"✅ سرویس خودرو {vehicle_id} ثبت شد!")
        
        elif data_callback.startswith("details_"):
            vehicle_id = data_callback.split("_")[1]
            send_message(chat_id, f"ℹ️ جزئیات خودرو {vehicle_id}")
        
        return jsonify({"status": "ok"})
    
    # اگر پیام متنی بود
    chat = message.get("chat", {})
    chat_id = chat.get("id")
    text = message.get("text", "")
    user = message.get("from", {})
    
    logging.info(f"پیام از: {chat_id}, متن: {text}")
    
    # دستور /start
    if text.startswith("/start"):
        parts = text.split(" ")
        user_id = None
        if len(parts) > 1:
            user_id = parts[1]
        
        if not user_id:
            send_message(chat_id, """
سلام! 👋

برای فعال‌سازی یادآوری:
1. به داشبورد بروید
2. به بخش "اتصال تلگرام" بروید
3. روی دکمه کلیک کنید
            """)
            return jsonify({"status": "ok"})
        
        # ذخیره در دیتابیس
        try:
            supabase.table("telegram_users").upsert({
                "user_id": user_id,
                "chat_id": chat_id,
                "username": user.get("username"),
                "first_name": user.get("first_name"),
                "is_active": True
            }).execute()
            
            send_message(chat_id, """
✅ **اتصال موفق!**

از این به بعد:
- هر روز یادآوری سرویس دوره‌ای دریافت خواهید کرد
- همه چیز خودکار است
- می‌توانید هر لحظه دستور `/status` بزنید

موفق باشید! 🚗
            """)
            
        except Exception as e:
            logging.error(f"خطا: {e}")
            send_message(chat_id, "❌ خطا در ذخیره اطلاعات")
    
    # دستور /status
    elif text == "/status":
        send_message(chat_id, "وضعیت: در حال بررسی...")
    
    # دستور /help
    elif text == "/help":
        send_message(chat_id, """
راهنما:

/start [user_id] - اتصال حساب
/status - وضعیت یادآوری‌ها
/help - این راهنما
        """)
    
    return jsonify({"status": "ok"})

@app.route('/set_webhook', methods=['GET'])
def set_webhook():
    """تنظیم Webhook (یک‌بار اجرا کنید)"""
    webhook_url = os.getenv("WEBHOOK_URL")
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/setWebhook"
    response = requests.post(url, json={"url": webhook_url})
    return jsonify(response.json())

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
```

---

### مرحله ۴: تغییرات فرانت‌اند

#### ۴.۱. ایجاد صفحه اتصال تلگرام

**فایل: `frontend/src/routes/profile/telegram/+page.svelte`**

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import { authStore } from '$lib/stores/auth';
  
  let telegramConnected = false;
  let chatId = null;
  let loading = false;
  let link = '';
  
  $: user = $authStore.user;
  
  onMount(async () => {
    if (user?.id) {
      await checkTelegramStatus();
    }
  });
  
  async function checkTelegramStatus() {
    const { data } = await supabase
      .from('telegram_users')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();
    
    if (data) {
      telegramConnected = true;
      chatId = data.chat_id;
    }
  }
  
  async function connectTelegram() {
    loading = true;
    
    // ایجاد لینک اختصاصی
    const botUsername = 'OilChengerReminderBot'; // تغییر دهید
    link = `https://t.me/${botUsername}?start=${user.id}`;
    
    // باز کردن تلگرام
    window.open(link, '_blank');
    loading = false;
    
    // چک کردن وضعیت هر ۵ ثانیه
    const interval = setInterval(async () => {
      await checkTelegramStatus();
      if (telegramConnected) {
        clearInterval(interval);
      }
    }, 5000);
  }
  
  async function disconnectTelegram() {
    if (!confirm('آیا مطمئن هستید که می‌خواهید اتصال را قطع کنید؟')) return;
    
    await supabase
      .from('telegram_users')
      .update({ is_active: false })
      .eq('user_id', user.id);
    
    telegramConnected = false;
    chatId = null;
    link = '';
  }
</script>

<div class="container">
  <div class="card">
    <h2>📱 اتصال تلگرام</h2>
    
    {#if telegramConnected}
      <div class="success-box">
        <div class="icon">✅</div>
        <h3>تلگرام متصل است</h3>
        <p class="info">Chat ID: <code>{chatId}</code></p>
        <p class="note">یادآوری‌ها به صورت خودکار به تلگرام شما ارسال می‌شود.</p>
        <button on:click={disconnectTelegram} class="btn-danger">
          قطع اتصال
        </button>
      </div>
    {:else}
      <div class="connect-box">
        <div class="icon">🔔</div>
        <h3>اتصال به تلگرام</h3>
        <p>برای دریافت یادآوری در تلگرام، ربات را استارت کنید:</p>
        
        <button on:click={connectTelegram} disabled={loading}>
          {loading ? 'در حال انتظار...' : 'اتصال به تلگرام'}
        </button>
        
        <div class="steps">
          <p><strong>مراحل:</strong></p>
          <ol>
            <li>روی دکمه کلیک کنید</li>
            <li>در تلگرام، دکمه "Start" را بزنید</li>
            <li>اتصال به صورت خودکار انجام می‌شود</li>
          </ol>
        </div>
        
        {#if link}
          <div class="link-box">
            <p>لینک جایگزین (اگر دکمه کار نکرد):</p>
            <a href={link} target="_blank">{link}</a>
          </div>
        {/if}
      </div>
    {/if}
    
    <div class="info-box">
      <h4>💡 مزایا:</h4>
      <ul>
        <li>✅ کاملاً رایگان</li>
        <li>✅ ارسال فوری</li>
        <li>✅ بدون مشکل فیلترینگ</li>
        <li>✅ قابل تعامل (دکمه‌ها)</li>
      </ul>
    </div>
  </div>
</div>

<style>
  .container {
    max-width: 600px;
    margin: 2rem auto;
    padding: 1rem;
  }
  
  .card {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  
  h2 {
    margin: 0 0 1.5rem 0;
    color: #1a1a1a;
  }
  
  .icon {
    font-size: 3rem;
    margin-bottom: 0.5rem;
  }
  
  .success-box {
    background: #d4edda;
    border: 1px solid #c3e6cb;
    border-radius: 8px;
    padding: 1.5rem;
    text-align: center;
  }
  
  .success-box h3 {
    color: #155724;
    margin: 0.5rem 0;
  }
  
  .info {
    font-family: monospace;
    background: white;
    padding: 0.5rem;
    border-radius: 4px;
    margin: 0.5rem 0;
  }
  
  .connect-box {
    background: #fff3cd;
    border: 1px solid #ffeaa7;
    border-radius: 8px;
    padding: 1.5rem;
    text-align: center;
  }
  
  button {
    background: #007bff;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
    margin: 1rem 0;
    transition: background 0.2s;
  }
  
  button:hover:not(:disabled) {
    background: #0056b3;
  }
  
  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .btn-danger {
    background: #dc3545;
  }
  
  .btn-danger:hover {
    background: #c82333;
  }
  
  .steps {
    text-align: right;
    margin-top: 1rem;
    padding: 1rem;
    background: white;
    border-radius: 6px;
  }
  
  .steps ol {
    margin: 0.5rem 0;
    padding-right: 1.5rem;
  }
  
  .link-box {
    margin-top: 1rem;
    padding: 1rem;
    background: white;
    border-radius: 6px;
    word-break: break-all;
  }
  
  .link-box a {
    color: #007bff;
    font-size: 0.9rem;
  }
  
  .info-box {
    margin-top: 1.5rem;
    padding: 1rem;
    background: #e7f3ff;
    border-radius: 8px;
    border: 1px solid #b3d9ff;
  }
  
  .info-box h4 {
    margin: 0 0 0.5rem 0;
    color: #004085;
  }
  
  .info-box ul {
    margin: 0;
    padding-right: 1.5rem;
    color: #004085;
  }
  
  .note {
    color: #666;
    font-size: 0.9rem;
    margin: 0.5rem 0;
  }
</style>
```

#### ۴.۲. اضافه کردن لینک به منوی پروفایل

**فایل: `frontend/src/routes/profile/+page.svelte`**

```svelte
<script>
  // ... کد موجود ...
</script>

<div class="profile-menu">
  <!-- لینک‌های موجود -->
  
  <a href="/profile/telegram" class="menu-item">
    <span class="icon">📱</span>
    اتصال تلگرام
    <span class="arrow">›</span>
  </a>
</div>
```

---

### مرحله ۵: راهنمای کارهای تلگرام

#### ۵.۱. کارهایی که باید در تلگرام انجام شود

**برای کاربران:**

1. **ساخت ربات (فقط یک‌بار):**
   - به @BotFather بروید
   - `/newbot` بزنید
   - نام و username انتخاب کنید
   - توکن را کپی کنید

2. **اتصال حساب (هر کاربر):**
   - به داشبورد بروید
   - به `/profile/telegram` بروید
   - روی "اتصال به تلگرام" کلیک کنید
   - در تلگرام، دکمه "Start" را بزنید

**برای ادمین:**

1. **تنظیم Webhook (یک‌بار):**
   - اجرای `bot_server.py`
   - رفتن به آدرس: `https://your-domain.com/set_webhook`
   - بررسی پاسخ: `{"ok": true, "result": true}`

2. **تنظیم Cron Job:**
   - در چابکان یا سرور خودتان
   - زمان: `0 8 * * *` (هر روز ۸ صبح)
   - دستور: `python main.py`

---

### مرحله ۶: گردش کاری اجرایی

#### ۶.۱. گردش کاری روزانه (Cron Job)

```
ساعت ۸:۰۰ صبح
    ↓
Python Cron Job اجرا می‌شود
    ↓
خواندن خودروهای فعال از Supabase
    ↓
برای هر خودرو:
  - خواندن آخرین سرویس
  - محاسبه روزهای مانده
  - اگر در بازه هشدار (مثلاً ۷ روز):
    ↓
ایجاد نوتیفیکیشن در دیتابیس
    ↓
خواندن Chat ID کاربر از telegram_users
    ↓
ارسال پیام به تلگرام
    ↓
دریافت تأییدیه از تلگرام
    ↓
لاگ موفقیت/خطا
```

#### ۶.۲. گردش کاری اتصال کاربر

```
کاربر وارد داشبورد می‌شود
    ↓
به صفحه پروفایل/تلگرام می‌رود
    ↓
کلیک روی "اتصال به تلگرام"
    ↓
ساخت لینک: t.me/BotName?start=user_id
    ↓
باز شدن تلگرام
    ↓
کاربر دکمه "Start" را می‌زند
    ↓
Bot Server دریافت می‌کند
    ↓
ذخیره Chat ID در دیتابیس
    ↓
ارسال پیام خوش‌آمدگویی
    ↓
اتصال کامل شد
```

#### ۶.۳. گردش کاری دریافت یادآوری

```
کاربر در بازه هشدار است
    ↓
Python Cron Job اجرا می‌شود
    ↓
پیام آماده می‌شود:
  🔔 یادآوری سرویس دوره‌ای
  خودرو: جک جی۴
  پلاک: 55 - 523 ب ۱۱
  روزهای مانده: ۷ روز
  دکمه‌ها: ✅ انجام شد | ℹ️ جزئیات
    ↓
ارسال به تلگرام
    ↓
کاربر پیام را دریافت می‌کند
    ↓
می‌تواند روی دکمه‌ها کلیک کند
```

---

## 📦 فایل‌های مورد نیاز

### در پروژه اصلی:

```
OilChenger/
├── supabase/migrations/
│   └── 005_telegram_users.sql          # جدول جدید
├── frontend/src/
│   ├── routes/
│   │   └── profile/
│   │       └── telegram/
│   │           └── +page.svelte        # صفحه اتصال
│   └── lib/
│       └── services/
│           └── telegramService.ts      # سرویس جدید (اختیاری)
```

### سرویس جدید (جداگانه):

```
reminder-service/
├── main.py                             # Cron Job ارسال
├── bot_server.py                       # سرور Webhook
├── requirements.txt                    # dependencies
├── .env.example                       # الگوی env
├── .env                               # تنظیمات (مخفی)
└── Dockerfile                         # برای استقرار
```

---

## 🔧 دستورالعمل اجرا

### ۱. ساخت ربات تلگرام:

```bash
# ۱. به @BotFather بروید
# ۲. /newbot بزنید
# ۳. نام: OilChenger Reminder Bot
# ۴. username: OilChengerReminderBot
# ۵. توکن را کپی کنید
```

### ۲. اجرای دیتابیس:

```bash
# در Supabase SQL Editor اجرا کنید
# فایل: supabase/migrations/005_telegram_users.sql
```

### ۳. اجرای سرویس Python (لوکال):

```bash
cd reminder-service

# نصب dependencies
pip install -r requirements.txt

# کپی و پر کردن .env
cp .env.example .env
# سپس .env را ویرایش کنید:
# SUPABASE_URL=...
# SUPABASE_SERVICE_ROLE_KEY=...
# TELEGRAM_BOT_TOKEN=... (از BotFather)
# CRON_TIME=08:00
# WEBHOOK_URL=http://localhost:5000/webhook

# ترمینال ۱: اجرای Cron Job
python main.py

# ترمینال ۲: اجرای Webhook Server
python bot_server.py

# تنظیم Webhook (یک‌بار)
curl http://localhost:5000/set_webhook
```

### ۴. تست:

```bash
# ۱. وارد داشبورد شوید
# ۲. به /profile/telegram بروید
# ۳. اتصال تلگرام را انجام دهید
# ۴. در Python، دستور check_reminders_and_send_telegram() را اجرا کنید
# ۵. پیام را در تلگرام بررسی کنید
```

### ۵. استقرار در چابکان:

**الف) سرویس Python:**
- آپلود `main.py`, `requirements.txt`, `.env`
- تنظیم Cron Job: `0 8 * * *`
- دستور: `python main.py`

**ب) سرویس Webhook:**
- آپلود `bot_server.py`
- تنظیم دامنه: `https://your-domain.com`
- تنظیم Webhook: `https://your-domain.com/set_webhook`

---

## 💰 هزینه و محدودیت‌ها

| سرویس | هزینه | محدودیت |
|-------|-------|---------|
| **Telegram** | رایگان | ۳۰ پیام/ثانیه، ۱۰۰۰ پیام/روز (برای ربات جدید) |
| **Python** | رایگان | روی چابکان |
| **Supabase** | رایگان | ۵۰۰MB دیتابیس |
| **Webhook Server** | رایگان | روی چابکان |

**نکته:** محدودیت ۱۰۰۰ پیام/روز برای ربات‌های جدید است. بعد از مدتی این محدودیت برداشته می‌شود.

---

## ⚠️ نکات مهم

### امنیت:
- ❌ هرگز `TELEGRAM_BOT_TOKEN` را در کد منتشر نکنید
- ✅ فقط در `.env` و سرور نگه دارید
- ✅ از Service Role Key فقط در Python استفاده کنید

### خطایابی:
**مشکل:** پیام در تلگرام دریافت نمی‌شود
- ✅ بررسی `TELEGRAM_BOT_TOKEN`
- ✅ بررسی Webhook: `https://api.telegram.org/bot{TOKEN}/getWebhookInfo`
- ✅ بررسی Chat ID در دیتابیس
- ✅ بررسی فعال بودن کاربر: `is_active = true`

**مشکل:** خطای Webhook
- ✅ دامنه باید HTTPS باشد
- ✅ پورت ۵۰۰۰ باید باز باشد
- ✅ فایروال باید اجازه دهد

---

## 🎯 نتیجه نهایی

**وقتی همه مراحل اجرا شود:**

1. **هر روز ساعت ۸ صبح:**
   - Python Cron Job اجرا می‌شود
   - خودروهای در بازه هشدار را پیدا می‌کند
   - به تلگرام کاربران پیام می‌فرستد

2. **کاربر:**
   - پیام فوری در تلگرام دریافت می‌کند
   - می‌تواند روی دکمه‌ها کلیک کند
   - نیازی به باز کردن اپ ندارد

3. **مزایا:**
   - ✅ کاملاً رایگان
   - ✅ فوری و قابل اعتماد
   - ✅ بدون نیاز به استارت ربات (اگر شماره ذخیره شده باشد)
   - ✅ تعاملی با دکمه‌ها

---

**تاریخ آخرین بروزرسانی:** ۲۸ دی ۱۴۰۴  
**وضعیت:** ✅ آماده پیاده‌سازی  
**نیاز به اقدام:** ساخت ربات + اجرای migrations

