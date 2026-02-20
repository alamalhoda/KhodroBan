# notifications/handlers/telegram.py
"""
Handler تلگرام – ارسال واقعی به API تلگرام.

استفاده از notifications.senders.do_send_telegram (تابع خالص).
برای تنظیمات ر.ک. TELEGRAM_BOT_TOKEN در env و docs/technical/notification-channel-providers.md
"""
import logging

from notifications.constants import CHANNEL_TELEGRAM
from notifications.senders import do_send_telegram
from .base import BaseChannelHandler

logger = logging.getLogger(__name__)


class TelegramHandler(BaseChannelHandler):
    """ارسال نوتیفیکیشن از طریق تلگرام."""

    channel = CHANNEL_TELEGRAM

    def is_available_for_user(self, user_profile, event_type: str) -> bool:
        from khodroban.models import TelegramSetting
        return TelegramSetting.objects.filter(
            user_profile=user_profile,
            is_enabled=True,
            chat_id__isnull=False,
        ).exclude(chat_id="").exists()

    def send(self, notification) -> tuple[bool, str | None]:
        try:
            result = do_send_telegram(str(notification.id))
            if result:
                return (True, None)
            return (False, "تلگرام: chat_id یافت نشد یا غیرفعال")
        except Exception as e:
            logger.exception("خطا در ارسال تلگرام")
            return (False, str(e))
