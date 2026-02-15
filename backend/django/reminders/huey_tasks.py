# reminders/huey_tasks.py
"""
Periodic task برای ارزیابی یادآوری‌ها و emit رویداد به Outbox.

مسئولیت: فقط نوشتن در ReminderDueEventOutbox.
بدون ایجاد مستقیم Notification.
"""
import logging
from datetime import date

from huey import crontab
from huey.contrib.djhuey import periodic_task

from khodroban.models import ReminderSetting, Vehicle, Service
from .models import ReminderDueEventOutbox

logger = logging.getLogger(__name__)


@periodic_task(crontab(hour=9, minute=0))
def check_reminders():
    """بررسی یادآوری‌های موعد گذشته و emit رویداد به Outbox."""
    logger.info("اجرای روزانه بررسی یادآوری‌ها شروع شد")
    today = date.today()
    emitted_count = 0

    active_settings = ReminderSetting.objects.filter(
        is_enabled=True,
        reminder_mode__in=["time", "both"],
    ).select_related("vehicle", "vehicle__user_profile")

    for rs in active_settings.iterator():
        vehicle = rs.vehicle
        if not vehicle:
            continue

        last_service = (
            Service.objects.filter(vehicle=vehicle)
            .order_by("-service_date_gregorian")
            .first()
        )
        if not last_service:
            continue

        days_since_last = (today - last_service.service_date_gregorian).days
        days_until_due = rs.interval_days - days_since_last

        if days_until_due <= rs.warning_days_before:
            idempotency_key = (
                f"reminder_due:{vehicle.user_profile_id}:{vehicle.id}:{today.isoformat()}"
            )
            if ReminderDueEventOutbox.objects.filter(
                idempotency_key=idempotency_key
            ).exists():
                continue
            try:
                ReminderDueEventOutbox.objects.create(
                    idempotency_key=idempotency_key,
                    payload={
                        "user_profile_id": vehicle.user_profile_id,
                        "vehicle_id": vehicle.id,
                        "reminder_setting_id": rs.id,
                        "due_type": "time",
                        "days_until_due": days_until_due,
                        "km_until_due": None,
                        "last_service_date": last_service.service_date_gregorian.isoformat(),
                        "last_service_km": last_service.service_km,
                        "interval_days": rs.interval_days,
                        "interval_km": rs.interval_km,
                        "warning_days_before": rs.warning_days_before,
                        "warning_km_before": rs.warning_km_before,
                        "vehicle_model": vehicle.model or "",
                        "plate_number": vehicle.plate_number or "",
                    },
                )
                emitted_count += 1
            except Exception:
                logger.exception(
                    f"خطا در emit رویداد یادآوری برای {vehicle.plate_number}"
                )

    logger.info(
        f"بررسی یادآوری‌ها پایان یافت → {emitted_count} رویداد به Outbox"
    )
