from django.test import TestCase
from django.utils import timezone
from django.utils.crypto import get_random_string
from datetime import timedelta
from django.contrib.auth.models import User

from reminders.huey_tasks import check_reminders
from reminders.models import ReminderDueEventOutbox
from notifications.huey_tasks import process_outbox
from khodroban.models import ReminderSetting, Vehicle, UserProfile, Notification, Service


class HueyReminderTaskTests(TestCase):
    def setUp(self):
        self._huey_password = get_random_string(12)
        self.user = User.objects.create_user(username="huey", password=self._huey_password)
        self.profile, _ = UserProfile.objects.get_or_create(
            user=self.user, defaults={"email": "h@t.com"}
        )
        self.vehicle = Vehicle.objects.create(
            user_profile=self.profile,
            model="Test Huey",
            year=1402,
            plate_number="55ه555",
            current_km=20000
        )
        ReminderSetting.objects.create(
            vehicle=self.vehicle,
            interval_days=90,
            warning_days_before=7,
            is_enabled=True,
            reminder_mode='time'
        )

    def test_check_reminders_and_process_outbox_create_notification(self):
        Service.objects.create(
            vehicle=self.vehicle,
            service_date=timezone.now().date() - timedelta(days=100),
            service_date_gregorian=timezone.now().date() - timedelta(days=100),
            service_km=18000,
            total_cost=500000
        )

        check_reminders()
        process_outbox()

        self.assertGreaterEqual(Notification.objects.count(), 1)
        n = Notification.objects.first()
        self.assertIn("یادآوری سرویس دوره‌ای", n.title)
        self.assertIn(self.vehicle.plate_number, n.body)

    def test_check_reminders_only_writes_outbox(self):
        """check_reminders فقط در Outbox می‌نویسد؛ Notification ایجاد نمی‌کند."""
        Service.objects.create(
            vehicle=self.vehicle,
            service_date=timezone.now().date() - timedelta(days=100),
            service_date_gregorian=timezone.now().date() - timedelta(days=100),
            service_km=18000,
            total_cost=500000,
        )

        check_reminders()

        self.assertGreaterEqual(ReminderDueEventOutbox.objects.count(), 1)
        self.assertEqual(Notification.objects.count(), 0)

    def test_process_outbox_idempotency(self):
        """رویداد تکراری (idempotency_key یکسان) نباید Notification تکراری ایجاد کند."""
        Service.objects.create(
            vehicle=self.vehicle,
            service_date=timezone.now().date() - timedelta(days=100),
            service_date_gregorian=timezone.now().date() - timedelta(days=100),
            service_km=18000,
            total_cost=500000,
        )
        check_reminders()
        process_outbox()
        count_after_first = Notification.objects.count()
        self.assertGreaterEqual(count_after_first, 1)

        process_outbox()

        self.assertEqual(Notification.objects.count(), count_after_first)

    def test_process_outbox_marks_processed(self):
        """بعد از پردازش، processed_at روی رویداد ست می‌شود."""
        Service.objects.create(
            vehicle=self.vehicle,
            service_date=timezone.now().date() - timedelta(days=100),
            service_date_gregorian=timezone.now().date() - timedelta(days=100),
            service_km=18000,
            total_cost=500000,
        )
        check_reminders()
        event = ReminderDueEventOutbox.objects.filter(processed_at__isnull=True).first()
        self.assertIsNotNone(event)
        self.assertIsNone(event.processed_at)

        process_outbox()

        event.refresh_from_db()
        self.assertIsNotNone(event.processed_at)

    def test_process_outbox_unknown_event_type_skips_notification(self):
        """رویداد با event_type ناشناخته Notification ایجاد نمی‌کند ولی processed می‌شود."""
        ReminderDueEventOutbox.objects.create(
            idempotency_key="unknown_event_test_1",
            event_type="unknown.event.type.v1",
            payload={
                "user_profile_id": self.profile.pk,
                "vehicle_id": self.vehicle.pk,
            },
        )

        process_outbox()

        self.assertEqual(Notification.objects.count(), 0)
        event = ReminderDueEventOutbox.objects.get(idempotency_key="unknown_event_test_1")
        self.assertIsNotNone(event.processed_at)
