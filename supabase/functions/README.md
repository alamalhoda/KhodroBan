# Supabase Edge Functions

این پوشه شامل تمام Edge Function‌های پروژه KhodroBan است.

## 📋 فهرست Functions

### 1. check-reminders
**مسئولیت:** بررسی یادآورها و ایجاد نوتیفیکیشن‌ها

- ✅ بررسی خودروهای نیازمند یادآوری
- ✅ محاسبه روزهای مانده تا موعد سرویس
- ✅ ایجاد نوتیفیکیشن در جدول `notifications`
- ❌ اعلان ارسال نمی‌کند

**Secrets:** نیاز ندارد  
**Cron Job:** هر روز یکبار (مثلاً ساعت ۹ صبح)

---

### 2. send-notifications
**مسئولیت:** مدیریت و هماهنگی ارسال اعلان‌ها از طریق کانال‌های مختلف

- ✅ خواندن نوتیفیکیشن‌های ارسال نشده (`sent_at IS NULL`)
- ✅ فراخوانی Edge Function‌های کانال‌ها
- ❌ خودش اعلان ارسال نمی‌کند

**Secrets:** نیاز ندارد (هر کانال Secrets خودش را دارد)  
**Cron Job:** به صورت دوره‌ای (مثلاً هر ۵ دقیقه)

**کانال‌ها:**
- تلگرام: `send-telegram-notification`
- SMS: `send-sms-notification` (آینده)
- Email: `send-email-notification` (آینده)
- Push: `send-push-notification` (آینده)
- API: `send-api-notification` (آینده)

---

### 3. send-telegram-notification
**مسئولیت:** فقط و فقط ارسال اعلان از طریق کانال تلگرام

- ✅ دریافت نوتیفیکیشن از دیتابیس
- ✅ بررسی تنظیمات تلگرام کاربر
- ✅ ساخت پیام
- ✅ ارسال از طریق API تلگرام
- ✅ به‌روزرسانی `notification_channels` و `sent_at`

**Secrets:** `TELEGRAM_BOT_TOKEN`, `SERVICE_ROLE_KEY`  
**فراخوانی:** توسط `send-notifications`

---

### 4. telegram-bot
**مسئولیت:** مدیریت Webhook ربات تلگرام (اتصال کاربران)

- ✅ دریافت Updates از Telegram Webhook
- ✅ پردازش دستورات `/start` و `/status`
- ✅ اتصال کاربران به حساب KhodroBan
- ✅ ذخیره `chat_id` در `telegram_settings`

**Secrets:** `TELEGRAM_BOT_TOKEN`, `SERVICE_ROLE_KEY`  
**Webhook:** توسط Telegram فراخوانی می‌شود

**تفاوت با send-telegram-notification:**
- `telegram-bot`: مدیریت اتصال کاربران و دستورات ربات
- `send-telegram-notification`: ارسال اعلان‌های یادآوری

---

### 5. ai-proxy
**مسئولیت:** Proxy کردن درخواست‌های AI API (حل مشکل CORS)

- ✅ دریافت درخواست از Frontend
- ✅ Forward کردن به AI API
- ✅ برگرداندن پاسخ به Frontend
- ✅ مدیریت CORS

**Secrets:** `AI_API_KEY`, `AI_API_URL`  
**فراخوانی:** توسط Frontend

---

## 🔄 Flow سیستم یادآوری

```
1. check-reminders (هر روز)
   └──> بررسی یادآورها
   └──> ایجاد نوتیفیکیشن در جدول (sent_at = NULL)

2. send-notifications (هر 5 دقیقه)
   └──> خواندن نوتیفیکیشن‌های ارسال نشده
   └──> فراخوانی send-telegram-notification
   └──> (آینده) فراخوانی send-sms-notification
   └──> (آینده) فراخوانی send-email-notification

3. send-telegram-notification
   └──> دریافت نوتیفیکیشن
   └──> بررسی تنظیمات تلگرام
   └──> ارسال به تلگرام
   └──> به‌روزرسانی notification_channels
```

---

## 📊 جدول تفکیک مسئولیت‌ها

| Function | مسئولیت اصلی | Secrets | Cron Job | فراخوانی توسط |
|----------|-------------|---------|----------|---------------|
| `check-reminders` | بررسی یادآورها | ❌ ندارد | ✅ هر روز | Cron Job |
| `send-notifications` | مدیریت ارسال | ❌ ندارد | ✅ هر 5 دقیقه | Cron Job |
| `send-telegram-notification` | ارسال تلگرام | ✅ دارد | ❌ ندارد | `send-notifications` |
| `telegram-bot` | Webhook ربات | ✅ دارد | ❌ ندارد | Telegram |
| `ai-proxy` | Proxy AI API | ✅ دارد | ❌ ندارد | Frontend |

---

## 🔐 Secrets مورد نیاز

### برای Cron Jobs:
- `SERVICE_ROLE_KEY`: برای فراخوانی Edge Functions

### برای Functions:
- `check-reminders`: ❌ نیاز ندارد
- `send-notifications`: ❌ نیاز ندارد
- `send-telegram-notification`: `TELEGRAM_BOT_TOKEN`, `SERVICE_ROLE_KEY`
- `telegram-bot`: `TELEGRAM_BOT_TOKEN`, `SERVICE_ROLE_KEY`
- `ai-proxy`: `AI_API_KEY`, `AI_API_URL`

---

## 📝 نکات مهم

1. **Separation of Concerns:** هر function فقط یک مسئولیت دارد
2. **Independence:** هر function می‌تواند به صورت مستقل تست و deploy شود
3. **Scalability:** هر function می‌تواند به صورت مستقل scale شود
4. **Maintainability:** تغییرات در یک function روی بقیه تأثیر نمی‌گذارد

---

**تاریخ ایجاد:** ۱۴۰۴/۱۱/۰۵  
**وضعیت:** ✅ آماده استفاده
