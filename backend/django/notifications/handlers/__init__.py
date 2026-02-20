# notifications/handlers/
"""
Channel handlers برای ارسال نوتیفیکیشن.

- TelegramHandler: ارسال واقعی (notifications.senders.do_send_telegram)
- EmailHandler, SmsHandler, PushHandler: STUB (فعلاً log، بعداً سرویس‌دهنده واقعی)

ر.ک. docs/technical/notification-channel-providers.md برای اتصال به سرویس‌دهندگان واقعی.
"""

from .base import BaseChannelHandler
from .telegram import TelegramHandler
from .push import PushHandler
from .email import EmailHandler
from .sms import SmsHandler

__all__ = ["BaseChannelHandler", "TelegramHandler", "PushHandler", "EmailHandler", "SmsHandler"]
