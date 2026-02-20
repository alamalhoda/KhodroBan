# khodroban/huey_tasks.py
"""
Tasks مربوط به khodroban: ارسال تلگرام و پردازش نوتیفیکیشن‌های pending.

check_reminders به reminders app منتقل شده (emit به Outbox).
process_outbox در notifications app (consume Outbox → ایجاد Notification).
منطق ارسال تلگرام در notifications.senders.do_send_telegram (SSOT).
"""
import logging

from huey import crontab
from huey.contrib.djhuey import db_task, periodic_task

from notifications.senders import do_send_telegram

logger = logging.getLogger(__name__)


@periodic_task(crontab(minute='*/50'))
def process_pending_notifications():
    """پردازش نوتیفیکیشن‌های pending از طریق ChannelDispatcher (telegram → push → email → sms)."""
    from notifications.dispatcher import process_pending_notifications as dispatch_pending

    logger.info("شروع پردازش نوتیفیکیشن‌های در انتظار ارسال")
    result = dispatch_pending(limit=100)
    logger.info(
        "پردازش نوتیفیکیشن‌ها پایان یافت → کل: %(processed)s | موفق: %(success)s | ناموفق: %(failed)s",
        result,
    )


@db_task(retries=3, retry_delay=60)
def send_telegram(notification_id: str) -> bool:
    """Wrapper Huey برای do_send_telegram (صف‌بندی async)."""
    return do_send_telegram(notification_id)
