# راهنمای اتصال به سرویس‌دهندگان نوتیفیکیشن

**مستند مستقل** برای جایگزینی handlerهای STUB با سرویس‌دهندگان واقعی (Email، SMS، Push).

**آخرین به‌روزرسانی:** ۱۴۰۴/۱۱/۲۶

---

## ۱. نمای کلی

سیستم نوتیفیکیشن از **ChannelDispatcher** با اولویت fallback استفاده می‌کند:

```
telegram → push → email → sms
```

هر کانال یک **Handler** دارد که کلاس `BaseChannelHandler` را extend می‌کند. برای اتصال به سرویس واقعی، کافی است متد `send()` را در handler مربوط پیاده‌سازی کنید.

### مسیر فایل‌ها

| کانال | فایل | وضعیت فعلی |
|-------|------|-----------|
| Telegram | `notifications/handlers/telegram.py` | پیاده‌سازی واقعی |
| Email | `notifications/handlers/email.py` | STUB |
| SMS | `notifications/handlers/sms.py` | STUB |
| Push | `notifications/handlers/push.py` | STUB |

---

## ۲. کلاس پایه `BaseChannelHandler`

```python
# notifications/handlers/base.py

class BaseChannelHandler(ABC):
    channel: str = ""  # telegram, push, email, sms

    @abstractmethod
    def send(self, notification) -> tuple[bool, str | None]:
        """
        ارسال نوتیفیکیشن به کانال.
        Returns: (success: bool, failure_reason: str | None)
        """
        pass

    def is_available_for_user(self, user_profile, event_type: str) -> bool:
        """آیا این کانال برای کاربر در دسترس است؟"""
        return True
```

### قرارداد `send()`

- **موفق:** `return (True, None)`
- **ناموفق:** `return (False, "توضیح خطا")`
- **Exception:** در dispatcher گرفته می‌شود و به `NotificationDelivery` با status=FAILED ذخیره می‌شود.

---

## ۳. اتصال Email

### ۳.۱ گزینه A: SMTP (smtplib)

**متغیرهای محیطی:**
```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=notifications@example.com
SMTP_PASSWORD=...
SMTP_USE_TLS=true
```

**نمونه پیاده‌سازی در `notifications/handlers/email.py`:**

```python
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send(self, notification) -> tuple[bool, str | None]:
    email = notification.user_profile.user.email
    if not email:
        return (False, "ایمیل کاربر خالی است")

    msg = MIMEMultipart("alternative")
    msg["Subject"] = notification.title
    msg["From"] = os.environ.get("SMTP_FROM", "noreply@example.com")
    msg["To"] = email
    msg.attach(MIMEText(notification.body or "", "plain", "utf-8"))

    try:
        with smtplib.SMTP(
            host=os.environ["SMTP_HOST"],
            port=int(os.environ.get("SMTP_PORT", 587)),
        ) as smtp:
            if os.environ.get("SMTP_USE_TLS", "true").lower() == "true":
                smtp.starttls()
            smtp.login(
                os.environ["SMTP_USER"],
                os.environ["SMTP_PASSWORD"],
            )
            smtp.send_message(msg)
        return (True, None)
    except Exception as e:
        logger.exception("خطا در ارسال ایمیل")
        return (False, str(e))
```

### ۳.۲ گزینه B: SendGrid

**متغیر محیطی:** `SENDGRID_API_KEY`

```python
import requests
import os

def send(self, notification) -> tuple[bool, str | None]:
    api_key = os.environ.get("SENDGRID_API_KEY")
    if not api_key:
        return (False, "SENDGRID_API_KEY تنظیم نشده")

    email = notification.user_profile.user.email
    if not email:
        return (False, "ایمیل کاربر خالی است")

    resp = requests.post(
        "https://api.sendgrid.com/v3/mail/send",
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        json={
            "personalizations": [{"to": [{"email": email}]}],
            "from": {"email": "noreply@example.com", "name": "OilChenger"},
            "subject": notification.title,
            "content": [{"type": "text/plain", "value": notification.body or ""}],
        },
        timeout=10,
    )
    if resp.status_code in (200, 202):
        return (True, None)
    return (False, f"SendGrid: {resp.status_code} - {resp.text[:200]}")
```

### ۳.۳ گزینه C: Mailgun

**متغیرهای محیطی:** `MAILGUN_API_KEY`, `MAILGUN_DOMAIN`

```python
resp = requests.post(
    f"https://api.mailgun.net/v3/{os.environ['MAILGUN_DOMAIN']}/messages",
    auth=("api", os.environ["MAILGUN_API_KEY"]),
    data={
        "from": "OilChenger <noreply@example.com>",
        "to": [email],
        "subject": notification.title,
        "text": notification.body or "",
    },
    timeout=10,
)
```

---

## ۴. اتصال SMS

### ۴.۱ Kavenegar (ایران)

**متغیر محیطی:** `KAVENEGAR_API_KEY`

**شماره تلفن:** در `UserProfile` یا مدل جداگانه (مثلاً `phone_number`) ذخیره شود.

```python
# در UserProfile یا مدل مرتبط فیلد phone_number اضافه کنید
# سپس در handlers/sms.py:

def is_available_for_user(self, user_profile, event_type: str) -> bool:
    phone = getattr(user_profile, "phone_number", None)
    return bool(phone)

def send(self, notification) -> tuple[bool, str | None]:
    api_key = os.environ.get("KAVENEGAR_API_KEY")
    if not api_key:
        return (False, "KAVENEGAR_API_KEY تنظیم نشده")

    phone = notification.user_profile.phone_number
    if not phone:
        return (False, "شماره تلفن کاربر خالی است")

    # حذف کاراکترهای غیرعددی
    phone = "".join(c for c in str(phone) if c.isdigit())
    if phone.startswith("0"):
        phone = "98" + phone[1:]
    elif not phone.startswith("98"):
        phone = "98" + phone

    resp = requests.post(
        f"https://api.kavenegar.com/v1/{api_key}/sms/send.json",
        data={
            "receptor": phone,
            "message": f"{notification.title}\n{notification.body or ''}",
            "sender": os.environ.get("KAVENEGAR_SENDER", ""),
        },
        timeout=10,
    )
    data = resp.json()
    if data.get("return", {}).get("status") == 200:
        return (True, None)
    return (False, str(data))
```

### ۴.۲ Twilio

**متغیرهای محیطی:** `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`

```python
from twilio.rest import Client

def send(self, notification) -> tuple[bool, str | None]:
    client = Client(
        os.environ["TWILIO_ACCOUNT_SID"],
        os.environ["TWILIO_AUTH_TOKEN"],
    )
    try:
        client.messages.create(
            body=f"{notification.title}\n{notification.body or ''}",
            from_=os.environ["TWILIO_FROM_NUMBER"],
            to=notification.user_profile.phone_number,
        )
        return (True, None)
    except Exception as e:
        return (False, str(e))
```

---

## ۵. اتصال Push Notification

### ۵.۱ پیش‌نیازها

- **مدل `PushDeviceToken`** برای ذخیره token دستگاه کاربر
- **FCM** (Firebase) برای Android یا **APNs** برای iOS یا **Web Push**

### ۵.۲ مدل PushDeviceToken (نمونه)

```python
# notifications/models.py یا khodroban/models.py

class PushDeviceToken(models.Model):
    user_profile = models.ForeignKey("khodroban.UserProfile", on_delete=models.CASCADE)
    token = models.CharField(max_length=500)
    platform = models.CharField(max_length=20, choices=[("ios", "iOS"), ("android", "Android"), ("web", "Web")])
    last_used_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

### ۵.۳ FCM (Firebase Cloud Messaging)

**متغیر محیطی:** `FIREBASE_CREDENTIALS_JSON` (مسیر فایل) یا `FIREBASE_SERVER_KEY` (legacy)

```python
# pip install firebase-admin

import firebase_admin
from firebase_admin import credentials, messaging

# در apps.py یا startup:
if not firebase_admin._apps:
    cred = credentials.Certificate(os.environ["FIREBASE_CREDENTIALS_JSON"])
    firebase_admin.initialize_app(cred)

def send(self, notification) -> tuple[bool, str | None]:
    tokens = PushDeviceToken.objects.filter(
        user_profile=notification.user_profile,
    ).values_list("token", flat=True)
    if not tokens:
        return (False, "Push token یافت نشد")

    message = messaging.MulticastMessage(
        notification=messaging.Notification(
            title=notification.title,
            body=notification.body or "",
        ),
        data={"notification_id": str(notification.id)},
        tokens=list(tokens),
    )
    try:
        response = messaging.send_multicast(message)
        if response.failure_count == 0:
            return (True, None)
        return (False, f"{response.failure_count} از {len(tokens)} شکست خورد")
    except Exception as e:
        return (False, str(e))
```

---

## ۶. تنظیمات Admin و NotificationPreference

Admin می‌تواند کانال‌ها را برای event یا کاربر خاص غیرفعال کند:

- **مدل:** `NotificationPreference(user_profile, event_type, channel, is_enabled)`
- **مسیر Admin:** `/admin/notifications/notificationpreference/`
- **پیش‌فرض:** اگر رکورد نباشد، کانال فعال است.

---

## ۷. چک‌لیست اتصال به سرویس واقعی

| مرحله | اقدام |
|-------|------|
| 1 | متغیرهای env را در `.env` یا settings اضافه کنید |
| 2 | Handler مربوط را باز کنید (مثلاً `handlers/email.py`) |
| 3 | متد `send()` را با منطق واقعی جایگزین کنید |
| 4 | `is_available_for_user()` را در صورت نیاز اصلاح کنید |
| 5 | تست کنید: `python manage.py test notifications` |
| 6 | در production، env واقعی را تنظیم کنید |

---

## ۸. مراجع

- **Blueprint:** `docs/technical/reminder-notification-api-blueprint.md`
- **معماری:** `docs/technical/reminder-system-status.md`
- **Handler پایه:** `notifications/handlers/base.py`
