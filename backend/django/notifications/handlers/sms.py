# notifications/handlers/sms.py
"""
Handler SMS – STUB (فعلاً ارسال واقعی ندارد).

برای اتصال به سرویس‌دهنده واقعی:
1. متغیر env: KAVENEGAR_API_KEY یا TWILIO_ACCOUNT_SID + TWILIO_AUTH_TOKEN
2. شماره تلفن کاربر: در UserProfile یا جدول جداگانه ذخیره شود
3. در متد send() از API سرویس استفاده کنید
4. ر.ک. docs/technical/notification-channel-providers.md
"""
import logging

from notifications.constants import CHANNEL_SMS
from .base import BaseChannelHandler

logger = logging.getLogger(__name__)


class SmsHandler(BaseChannelHandler):
    """
    ارسال نوتیفیکیشن از طریق SMS – STUB.

    TODO: اتصال به Kavenegar، Twilio، یا سرویس داخلی
    - Kavenegar: POST https://api.kavenegar.com/v1/{API_KEY}/sms/send.json
    - Twilio: POST https://api.twilio.com/2010-04-01/Accounts/{sid}/Messages.json
    """

    channel = CHANNEL_SMS

    def is_available_for_user(self, user_profile, event_type: str) -> bool:
        # TODO: چک کنید شماره تلفن کاربر در UserProfile یا جداگانه وجود دارد
        phone = getattr(user_profile, "phone_number", None) or getattr(
            user_profile.user, "phone", None
        )
        return bool(phone)

    def send(self, notification) -> tuple[bool, str | None]:
        # STUB
        logger.info(
            "[STUB] SmsHandler.send: notification_id=%s, title=%s",
            notification.id,
            notification.title,
        )
        return (False, "SMS هنوز پیاده‌سازی نشده (STUB)")
