# notifications/huey_tasks.py
"""
OutboxConsumer: خواندن رویدادها از Outbox و ایجاد Notification.

مسئولیت: consume ReminderDueEventOutbox، ایجاد Notification، علامت processed.
"""
import logging

from django.utils import timezone
from huey import crontab
from huey.contrib.djhuey import periodic_task

from khodroban.models import Notification, UserProfile, Vehicle
from reminders.models import ReminderDueEventOutbox

logger = logging.getLogger(__name__)


@periodic_task(crontab(minute="*/5"))
def process_outbox():
    """خواندن رویدادهای پردازش‌نشده و ایجاد Notification."""
    logger.info("شروع پردازش Outbox یادآوری‌ها")
    batch = ReminderDueEventOutbox.objects.filter(
        processed_at__isnull=True
    ).order_by("created_at")[:50]

    created_count = 0
    for event in batch.iterator():
        try:
            _process_reminder_due_event(event)
            created_count += 1
        except Exception:
            logger.exception(
                f"خطا در پردازش رویداد {event.id} ({event.idempotency_key})"
            )

    logger.info(f"پردازش Outbox پایان یافت → {created_count} نوتیفیکیشن ایجاد شد")


def _process_reminder_due_event(event: ReminderDueEventOutbox) -> None:
    """پردازش رویداد reminder.due.detected.v1 و ایجاد Notification."""
    if event.event_type != "reminder.due.detected.v1":
        logger.warning(f"نوع رویداد ناشناخته: {event.event_type}")
        event.processed_at = event.occurred_at
        event.save(update_fields=["processed_at"])
        return

    payload = event.payload
    idempotency_key = event.idempotency_key

    if Notification.objects.filter(idempotency_key=idempotency_key).exists():
        event.processed_at = event.occurred_at
        event.save(update_fields=["processed_at"])
        return

    user_profile = UserProfile.objects.get(pk=payload["user_profile_id"])
    vehicle = Vehicle.objects.get(pk=payload["vehicle_id"])

    days_until_due = payload.get("days_until_due", 0)
    title = "یادآوری سرویس دوره‌ای خودرو"
    body = (
        f"خودرو {payload.get('vehicle_model', '')} ({payload.get('plate_number', '')}) - "
        f"{days_until_due:+} روز تا موعد سرویس"
    )
    metadata = {
        "vehicle_model": payload.get("vehicle_model", ""),
        "plate_number": payload.get("plate_number", ""),
        "days_until_due": days_until_due,
        "interval_days": payload.get("interval_days"),
        "last_service_date": payload.get("last_service_date"),
        "warning_days_before": payload.get("warning_days_before"),
    }

    Notification.objects.create(
        user_profile=user_profile,
        vehicle=vehicle,
        title=title,
        body=body,
        type="reminder",
        metadata=metadata,
        idempotency_key=idempotency_key,
    )
    event.processed_at = timezone.now()
    event.save(update_fields=["processed_at"])
