# notifications/constants.py
"""
ثابت‌های کانال و اولویت ارسال.

ترتیب اولویت (fallback): telegram → push → email → sms
اگر تلگرام موفق نشد، push امتحان می‌شود، بعد email، بعد sms.
"""

CHANNEL_TELEGRAM = "telegram"
CHANNEL_PUSH = "push"
CHANNEL_EMAIL = "email"
CHANNEL_SMS = "sms"

CHANNEL_PRIORITY_ORDER = [CHANNEL_TELEGRAM, CHANNEL_PUSH, CHANNEL_EMAIL, CHANNEL_SMS]

EVENT_TYPE_REMINDER_DUE = "reminder.due"
