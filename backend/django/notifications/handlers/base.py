# notifications/handlers/base.py
"""
کلاس پایه برای Channel Handlerها.

برای اتصال به سرویس‌دهندگان واقعی (Email/SMS/Push) این کلاس را extend کنید
و متد send را با منطق واقعی پیاده‌سازی کنید.
ر.ک. docs/technical/notification-channel-providers.md
"""
import logging
from abc import ABC, abstractmethod

logger = logging.getLogger(__name__)


class BaseChannelHandler(ABC):
    """
    Handler پایه برای ارسال نوتیفیکیشن به یک کانال.

    Subclassها باید متد send را پیاده‌سازی کنند.
    """

    channel: str = ""  # باید در subclass ست شود: telegram, push, email, sms

    @abstractmethod
    def send(self, notification) -> tuple[bool, str | None]:
        """
        ارسال نوتیفیکیشن به کانال.

        Returns:
            (success: bool, failure_reason: str | None)
            در صورت موفقیت: (True, None)
            در صورت شکست: (False, "توضیح خطا")
        """
        pass

    def is_available_for_user(self, user_profile, event_type: str) -> bool:
        """
        آیا این کانال برای کاربر فعال است؟

        Override برای چک‌های خاص (مثلاً تلگرام: آیا chat_id دارد؟).
        """
        return True
