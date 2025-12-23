# 📧 راهنمای تنظیمات Email در Supabase

## مشکل: خطای "Error sending confirmation email"

اگر هنگام ثبت‌نام این خطا را می‌بینید:
```
500: Error sending confirmation email
535 5.7.8 Error: authentication failed
```

این یعنی Supabase نمی‌تواند ایمیل تأیید را ارسال کند.

---

## راه‌حل 1: غیرفعال کردن Email Confirmation (برای تست)

برای محیط Development و تست، می‌توانید Email Confirmation را غیرفعال کنید:

### در Supabase Dashboard:

1. به **Settings** → **Authentication** بروید
2. بخش **Email Auth** را پیدا کنید
3. **"Enable email confirmations"** را **غیرفعال** کنید
4. تغییرات را ذخیره کنید

### نتیجه:

- کاربران می‌توانند بدون تأیید ایمیل وارد شوند
- مناسب برای Development و تست
- **⚠️ برای Production باید فعال باشد**

---

## راه‌حل 2: تنظیم SMTP (برای Production)

اگر می‌خواهید ایمیل واقعی ارسال شود:

### در Supabase Dashboard:

1. به **Settings** → **Auth** → **SMTP Settings** بروید
2. یکی از گزینه‌های زیر را انتخاب کنید:

#### گزینه A: استفاده از Supabase SMTP (محدود)

- Supabase یک SMTP محدود برای تست فراهم می‌کند
- برای Production کافی نیست

#### گزینه B: استفاده از SMTP شخصی (توصیه می‌شود)

تنظیمات برای سرویس‌های مختلف:

**Gmail:**
```
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP User: your-email@gmail.com
SMTP Pass: your-app-password (نه رمز عادی!)
Sender Email: your-email@gmail.com
Sender Name: KhodroBan
```

**SendGrid:**
```
SMTP Host: smtp.sendgrid.net
SMTP Port: 587
SMTP User: apikey
SMTP Pass: YOUR_SENDGRID_API_KEY
Sender Email: your-verified-email@domain.com
Sender Name: KhodroBan
```

**Mailgun:**
```
SMTP Host: smtp.mailgun.org
SMTP Port: 587
SMTP User: postmaster@your-domain.mailgun.org
SMTP Pass: YOUR_MAILGUN_PASSWORD
Sender Email: noreply@your-domain.com
Sender Name: KhodroBan
```

### نکات مهم:

1. **برای Gmail**: باید App Password ایجاد کنید (نه رمز عادی)
   - Google Account → Security → 2-Step Verification → App Passwords

2. **برای Production**: از سرویس‌های حرفه‌ای مثل SendGrid یا Mailgun استفاده کنید

3. **Domain Verification**: برخی سرویس‌ها نیاز به تأیید دامنه دارند

---

## راه‌حل 3: استفاده از Inbucket (برای Development محلی)

اگر از Supabase CLI برای توسعه محلی استفاده می‌کنید:

```bash
supabase start
```

Inbucket به صورت خودکار در `http://localhost:54324` راه‌اندازی می‌شود.

تمام ایمیل‌ها در Inbucket نمایش داده می‌شوند (بدون نیاز به SMTP واقعی).

---

## بررسی وضعیت Email

### در Supabase Dashboard:

1. به **Logs** → **API** بروید
2. خطاهای مربوط به email را بررسی کنید
3. اگر خطای "authentication failed" می‌بینید، SMTP تنظیم نشده است

---

## توصیه برای این پروژه

### برای Development (حالا):

✅ **غیرفعال کردن Email Confirmation**
- سریع‌تر است
- برای تست کافی است
- نیازی به تنظیم SMTP نیست

### برای Production (بعداً):

✅ **فعال کردن Email Confirmation + تنظیم SMTP**
- امنیت بیشتر
- تجربه کاربری بهتر
- استفاده از SendGrid یا Mailgun

---

## تغییرات در کد

اگر Email Confirmation را غیرفعال کردید، کد `authService.ts` باید با این تغییر کار کند:

```typescript
// در register function
if (!authData.session) {
  // اگر email confirmation غیرفعال باشد، این خط اجرا نمی‌شود
  // اما اگر فعال باشد و ایمیل ارسال نشود، این خط اجرا می‌شود
  throw new Error('لطفاً ایمیل خود را تأیید کنید...');
}
```

---

**آخرین به‌روزرسانی:** ۱۴۰۴/۰۹/XX

