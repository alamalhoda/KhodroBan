# notifications/handlers/push.py
"""
Handler Push Notification – STUB (فعلاً ارسال واقعی ندارد).

برای اتصال به سرویس‌دهنده واقعی:
1. FCM (Firebase Cloud Messaging) برای Android
2. APNs (Apple Push Notification service) برای iOS
3. Web Push برای مرورگر
4. نیاز به PushDeviceToken model برای ذخیره token دستگاه کاربر
5. ر.ک. docs/technical/notification-channel-providers.md
"""
import logging

from notifications.constants import CHANNEL_PUSH
from .base import BaseChannelHandler

logger = logging.getLogger(__name__)


class PushHandler(BaseChannelHandler):
    """
    ارسال نوتیفیکیشن Push – STUB.

    TODO: اتصال به FCM / APNs / Web Push
    - FCM: firebase_admin.messaging.send() یا requests به fcm.googleapis.com
    - نیاز به PushDeviceToken: user_profile, token, platform (ios/android/web)
    """

    channel = CHANNEL_PUSH

    def is_available_for_user(self, user_profile, event_type: str) -> bool:
        # TODO: چک کنید PushDeviceToken برای کاربر وجود دارد
        # return PushDeviceToken.objects.filter(user_profile=user_profile).exists()
        return False

    def send(self, notification) -> tuple[bool, str | None]:
        # STUB
        logger.info(
            "[STUB] PushHandler.send: notification_id=%s, title=%s",
            notification.id,
            notification.title,
        )
        return (False, "Push هنوز پیاده‌سازی نشده (STUB)")
