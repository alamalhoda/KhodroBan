# notifications/handlers/email.py
"""
Handler ایمیل – STUB (فعلاً ارسال واقعی ندارد).

برای اتصال به سرویس‌دهنده واقعی:
1. متغیرهای env را اضافه کنید: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD
   یا SENDGRID_API_KEY / MAILGUN_API_KEY
2. در متد send() به‌جای logger.info از smtplib یا API سرویس استفاده کنید
3. ر.ک. docs/technical/notification-channel-providers.md
"""
import logging

from notifications.constants import CHANNEL_EMAIL
from .base import BaseChannelHandler

logger = logging.getLogger(__name__)


class EmailHandler(BaseChannelHandler):
    """
    ارسال نوتیفیکیشن از طریق ایمیل – STUB.

    TODO: اتصال به SMTP یا SendGrid/Mailgun
    - SMTP: smtplib.SMTP(host=os.environ['SMTP_HOST'], port=...)
    - SendGrid: requests.post('https://api.sendgrid.com/v3/mail/send', ...)
    - Mailgun: requests.post(f'https://api.mailgun.net/v3/{domain}/messages', ...)
    """

    channel = CHANNEL_EMAIL

    def is_available_for_user(self, user_profile, event_type: str) -> bool:
        # TODO: چک کنید کاربر email دارد و تأیید شده
        return bool(user_profile and getattr(user_profile.user, "email", None))

    def send(self, notification) -> tuple[bool, str | None]:
        # STUB: فعلاً فقط log می‌کنیم، ارسال واقعی نداریم
        logger.info(
            "[STUB] EmailHandler.send: notification_id=%s, title=%s, user=%s",
            notification.id,
            notification.title,
            notification.user_profile_id,
        )
        # TODO: ارسال واقعی
        # email = notification.user_profile.user.email
        # send_mail(subject=notification.title, message=notification.body, ...)
        return (False, "ایمیل هنوز پیاده‌سازی نشده (STUB)")
