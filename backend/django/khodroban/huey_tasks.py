# khodroban/huey_tasks.py
import logging
from datetime import date

from django.conf import settings
from django.utils import timezone
from huey import crontab
from huey.contrib.djhuey import db_task, periodic_task

import requests

from .models import (
    ReminderSetting, Vehicle, Service, Notification, TelegramSetting
)

logger = logging.getLogger(__name__)


@periodic_task(crontab(hour=9, minute=0))
def check_reminders():
    logger.info("اجرای روزانه بررسی یادآوری‌ها شروع شد")
    today = date.today()
    created_count = 0

    active_settings = ReminderSetting.objects.filter(
        is_enabled=True,
        reminder_mode__in=['time', 'both']
    ).select_related('vehicle', 'vehicle__user_profile')

    for rs in active_settings.iterator():
        vehicle = rs.vehicle
        if not vehicle:
            continue

        last_service = Service.objects.filter(vehicle=vehicle).order_by(
            '-service_date_gregorian'
        ).first()

        if not last_service:
            continue

        days_since_last = (today - last_service.service_date_gregorian).days
        days_until_due = rs.interval_days - days_since_last

        if days_until_due <= rs.warning_days_before:
            if Notification.objects.filter(
                user_profile=vehicle.user_profile,
                vehicle=vehicle,
                type="reminder",
                created_at__date=today,
            ).exists():
                continue
            try:
                Notification.objects.create(
                    user_profile=vehicle.user_profile,
                    vehicle=vehicle,
                    title="یادآوری سرویس دوره‌ای خودرو",
                    body=(
                        f"خودرو {vehicle.model} ({vehicle.plate_number}) - "
                        f"{days_until_due:+} روز تا موعد سرویس"
                    ),
                    type="reminder",
                    metadata={
                        "vehicle_model": vehicle.model,
                        "plate_number": vehicle.plate_number,
                        "days_until_due": days_until_due,
                        "interval_days": rs.interval_days,
                        "last_service_date": last_service.service_date_gregorian.isoformat(),
                        "warning_days_before": rs.warning_days_before,
                    }
                )
                created_count += 1
            except Exception:
                logger.exception(f"خطا در ایجاد نوتیفیکیشن برای {vehicle.plate_number}")

    logger.info(f"بررسی یادآوری‌ها پایان یافت → {created_count} نوتیفیکیشن جدید")


@periodic_task(crontab(minute='*/50'))
def process_pending_notifications():
    logger.info("شروع پردازش نوتیفیکیشن‌های در انتظار ارسال")
    pending = Notification.objects.filter(
        sent_at__isnull=True
    ).select_related('user_profile', 'vehicle')[:100]

    telegram_success = 0
    telegram_failed = 0
    processed = 0

    for n in pending.iterator():
        processed += 1
        try:
            success = send_telegram(str(n.id))
            if success:
                telegram_success += 1
            else:
                telegram_failed += 1
        except Exception:
            logger.exception(f"خطا در پردازش نوتیفیکیشن {n.id}")
            telegram_failed += 1

    logger.info(
        f"پردازش نوتیفیکیشن‌ها پایان یافت → "
        f"کل: {processed} | تلگرام موفق: {telegram_success} | ناموفق: {telegram_failed}"
    )


@db_task(retries=3, retry_delay=60)
def send_telegram(notification_id: str) -> bool:
    try:
        notification = Notification.objects.select_related(
            'user_profile', 'vehicle'
        ).get(id=notification_id)

        telegram_setting = TelegramSetting.objects.filter(
            user_profile=notification.user_profile,
            is_enabled=True,
            chat_id__isnull=False
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

        response = requests.post(
            f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}/sendMessage",
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
                "message_id": response.json().get("result", {}).get("message_id")
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
