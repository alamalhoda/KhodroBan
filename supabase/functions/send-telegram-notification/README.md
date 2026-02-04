# Edge Function: send-telegram-notification

این Edge Function **فقط و فقط** برای **ارسال اعلان از طریق کانال تلگرام** استفاده می‌شود.

## 📋 مسئولیت

این function:
- ✅ تنظیمات تلگرام کاربر را بررسی می‌کند
- ✅ پیام را از نوتیفیکیشن می‌سازد
- ✅ از طریق تلگرام ارسال می‌کند
- ✅ وضعیت را در `notification_channels` به‌روزرسانی می‌کند

این function:
- ❌ از زمان‌بندی اطلاع ندارد (توسط send-notifications فراخوانی می‌شود)
- ❌ از سایر کانال‌ها اطلاع ندارد (فقط تلگرام)
- ❌ از یادآورها اطلاع ندارد (فقط notificationId می‌گیرد)
- ✅ فقط و فقط ارسال تلگرام را انجام می‌دهد

## 🔄 استفاده

این function توسط `send-notifications` فراخوانی می‌شود.

### Request Format

```json
{
  "notificationId": "uuid-of-notification"
}
```

### Response Format

```json
{
  "success": true,
  "message": "Telegram notification sent",
  "error": null
}
```

یا در صورت خطا:

```json
{
  "success": false,
  "message": "Failed to send telegram notification",
  "error": "Error message here"
}
```

## ⚙️ تنظیمات

### Secrets

این function نیاز به Secret زیر دارد:
- `TELEGRAM_BOT_TOKEN`: توکن ربات تلگرام از BotFather
- `SERVICE_ROLE_KEY`: برای دسترسی به دیتابیس

## 🧪 تست

### تست دستی

```bash
curl -X POST \
  'https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-telegram-notification' \
  -H 'Authorization: Bearer YOUR_SERVICE_ROLE_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"notificationId": "your-notification-id"}'
```

## 📝 نکات

- این function مستقل است و می‌تواند به صورت جداگانه تست شود
- در آینده، کانال‌های دیگر (SMS، Email، Push، API) هم به همین صورت مستقل خواهند بود
- `send-notifications` این function را برای هر نوتیفیکیشن فراخوانی می‌کند

---

**تاریخ ایجاد:** ۱۴۰۴/۱۱/۰۵  
**وضعیت:** ✅ آماده استفاده
