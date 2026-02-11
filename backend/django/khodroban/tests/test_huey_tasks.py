from django.test import TestCase
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth.models import User

from khodroban.huey_tasks import check_reminders
from khodroban.models import ReminderSetting, Vehicle, UserProfile, Notification, Service


class HueyReminderTaskTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="huey", password="pass")
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

    def test_check_reminders_creates_notification(self):
        Service.objects.create(
            vehicle=self.vehicle,
            service_date=timezone.now().date() - timedelta(days=100),
            service_date_gregorian=timezone.now().date() - timedelta(days=100),
            service_km=18000,
            total_cost=500000
        )

        result = check_reminders()

        self.assertGreaterEqual(Notification.objects.count(), 1)
        n = Notification.objects.first()
        self.assertIn("یادآوری سرویس دوره‌ای", n.title)
        self.assertIn(self.vehicle.plate_number, n.body)
