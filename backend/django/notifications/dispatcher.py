# notifications/dispatcher.py
"""
ChannelDispatcher: انتخاب کانال بر اساس اولویت و fallback.

ترتیب: telegram → push → email → sms
اگر یک کانال شکست خورد، کانال بعدی امتحان می‌شود.
ر.ک. docs/technical/notification-channel-providers.md
"""
import logging

from django.utils import timezone

from .constants import CHANNEL_PRIORITY_ORDER, EVENT_TYPE_REMINDER_DUE
from .handlers.base import BaseChannelHandler
from .handlers.telegram import TelegramHandler
from .handlers.push import PushHandler
from .handlers.email import EmailHandler
from .handlers.sms import SmsHandler
from .models import NotificationDelivery, NotificationPreference
from .models import STATUS_QUEUED, STATUS_SENT, STATUS_FAILED

logger = logging.getLogger(__name__)

_HANDLERS: dict[str, BaseChannelHandler] = {
    TelegramHandler.channel: TelegramHandler(),
    PushHandler.channel: PushHandler(),
    EmailHandler.channel: EmailHandler(),
    SmsHandler.channel: SmsHandler(),
}


def _is_channel_enabled_for_user(user_profile, event_type: str, channel: str) -> bool:
    pref = NotificationPreference.objects.filter(
        user_profile=user_profile,
        event_type=event_type,
        channel=channel,
    ).first()
    if pref is None:
        return True  # پیش‌فرض: فعال
    return pref.is_enabled


def dispatch_notification(notification, event_type: str = EVENT_TYPE_REMINDER_DUE) -> bool:
    """
    ارسال نوتیفیکیشن با fallback بر اساس اولویت کانال‌ها.

    Returns:
        True اگر حداقل یک کانال موفق شد، False اگر همه شکست خوردند.
    """
    user_profile = notification.user_profile

    for channel in CHANNEL_PRIORITY_ORDER:
        if not _is_channel_enabled_for_user(user_profile, event_type, channel):
            continue

        handler = _HANDLERS.get(channel)
        if not handler or not handler.is_available_for_user(user_profile, event_type):
            continue

        delivery = NotificationDelivery.objects.create(
            notification=notification,
            channel=channel,
            status=STATUS_QUEUED,
            attempt_number=1,
        )

        try:
            success, failure_reason = handler.send(notification)
            if success:
                delivery.status = STATUS_SENT
                delivery.sent_at = timezone.now()
                delivery.save(update_fields=["status", "sent_at", "updated_at"])
                notification.refresh_from_db()
                channels = notification.notification_channels or {}
                channels[channel] = {
                    "status": "sent",
                    "sent_at": delivery.sent_at.isoformat(),
                }
                notification.notification_channels = channels
                if not notification.sent_at:
                    notification.sent_at = timezone.now()
                notification.save(update_fields=["notification_channels", "sent_at", "updated_at"])
                logger.info("نوتیفیکیشن %s از طریق %s ارسال شد", notification.id, channel)
                return True

            delivery.status = STATUS_FAILED
            delivery.failure_reason = failure_reason or "نامشخص"
            delivery.save(update_fields=["status", "failure_reason", "updated_at"])
            logger.warning("کانال %s برای نوتیفیکیشن %s شکست خورد: %s", channel, notification.id, failure_reason)

        except Exception as e:
            logger.exception("خطا در ارسال از طریق %s", channel)
            delivery.status = STATUS_FAILED
            delivery.failure_reason = str(e)
            delivery.save(update_fields=["status", "failure_reason", "updated_at"])

    return False


def process_pending_notifications(limit: int = 100) -> dict:
    """
    پردازش نوتیفیکیشن‌های pending و ارسال از طریق dispatcher.
    """
    from khodroban.models import Notification

    pending = Notification.objects.filter(
        sent_at__isnull=True
    ).select_related("user_profile", "vehicle")[:limit]

    success_count = 0
    failed_count = 0

    for n in pending.iterator():
        try:
            if dispatch_notification(n):
                success_count += 1
            else:
                failed_count += 1
        except Exception:
            logger.exception("خطا در پردازش نوتیفیکیشن %s", n.id)
            failed_count += 1

    return {"processed": success_count + failed_count, "success": success_count, "failed": failed_count}
