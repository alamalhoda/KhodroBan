# notifications/senders.py
"""
تابع‌های خالص ارسال نوتیفیکیشن به هر کانال.

منطق ارسال در این ماژول متمرکز است (SSOT). Handlerها و Huey taskها از این توابع استفاده می‌کنند.
ر.ک. docs/technical/notification-channel-providers.md
"""
import logging

import requests
from django.conf import settings
from django.utils import timezone

logger = logging.getLogger(__name__)


def do_send_telegram(notification_id: str) -> bool:
    """
    ارسال نوتیفیکیشن از طریق API تلگرام (تابع خالص).

    Returns:
        True اگر ارسال موفق، False در غیر این صورت.
    """
    from khodroban.models import Notification, TelegramSetting

    try:
        notification = Notification.objects.select_related(
            "user_profile", "vehicle"
        ).get(id=notification_id)

        telegram_setting = TelegramSetting.objects.filter(
            user_profile=notification.user_profile,
            is_enabled=True,
            chat_id__isnull=False,
        ).first()

        if not telegram_setting or not telegram_setting.chat_id:
            return False

        meta = notification.metadata or {}
        message_lines = [
            "🚨 <b>یادآوری سرویس دوره‌ای خودرو</b> 🚨\n",
            f"🚗 <b>خودرو:</b> {meta.get('vehicle_model', 'نامشخص')}",
            f"🔢 <b>پلاک:</b> {meta.get('plate_number', 'نامشخص')}",
            f"⏳ <b>روزهای باقی‌مانده:</b> {meta.get('days_until_due')} روز",
            f"📅 <b>دوره سرویس:</b> هر {meta.get('interval_days')} روز",
            f"📆 <b>آخرین سرویس:</b> {meta.get('last_service_date')}\n",
            "لطفاً برای سرویس اقدام کنید!",
        ]
        message = "\n".join(line for line in message_lines if line)

        token = getattr(settings, "TELEGRAM_BOT_TOKEN", None)
        if not token:
            logger.warning("TELEGRAM_BOT_TOKEN تنظیم نشده")
            return False

        response = requests.post(
            f"https://api.telegram.org/bot{token}/sendMessage",
            json={
                "chat_id": telegram_setting.chat_id,
                "text": message,
                "parse_mode": "HTML",
                "disable_web_page_preview": True,
            },
            timeout=12,
        )

        if response.status_code == 200:
            channels = notification.notification_channels or {}
            channels["telegram"] = {
                "status": "sent",
                "sent_at": timezone.now().isoformat(),
                "message_id": response.json().get("result", {}).get("message_id"),
            }
            notification.notification_channels = channels
            if not notification.sent_at:
                notification.sent_at = timezone.now()
            notification.save(update_fields=["notification_channels", "sent_at"])
            return True

        logger.error(f"تلگرام شکست خورد {notification_id} → {response.status_code}")
        return False

    except Notification.DoesNotExist:
        logger.error(f"نوتیفیکیشن یافت نشد: {notification_id}")
        return False
    except Exception:
        logger.exception(f"خطای غیرمنتظره در ارسال تلگرام {notification_id}")
        raise
