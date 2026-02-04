from django.test import TestCase
from django.utils import timezone
from django.contrib.auth.models import User
from datetime import timedelta

from khodroban.models import Reminder, Vehicle, UserProfile


class ReminderModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="test", password="pass")
        self.profile = UserProfile.objects.create(user=self.user, email="a@b.com")
        self.vehicle = Vehicle.objects.create(
            user_profile=self.profile,
            model="Test Car",
            year=1400,
            plate_number="12ب345",
            current_km=50000
        )

    def test_reminder_status_overdue_date(self):
        r = Reminder.objects.create(
            user_profile=self.profile,
            title="Test",
            due_date=timezone.now() - timedelta(days=1)
        )
        self.assertEqual(r.status, 'overdue')

    def test_reminder_status_near_km(self):
        r = Reminder.objects.create(
            user_profile=self.profile,
            vehicle=self.vehicle,
            title="Oil Change",
            due_km=51000,
            warning_km_before=1000
        )
        self.assertEqual(r.status, 'near')


class ReminderStatusTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="tester", password="pass")
        self.profile = UserProfile.objects.create(user=self.user, email="t@e.com")
        self.vehicle = Vehicle.objects.create(
            user_profile=self.profile,
            model="TestModel",
            year=1403,
            plate_number="99ب123",
            current_km=120000
        )

    def test_status_overdue_by_date(self):
        r = Reminder.objects.create(
            user_profile=self.profile,
            title="موعد گذشته",
            due_date=timezone.now() - timedelta(days=3)
        )
        self.assertEqual(r.status, 'overdue')
        self.assertIn("موعد گذشته است", r.message)

    def test_status_near_by_date(self):
        r = Reminder.objects.create(
            user_profile=self.profile,
            title="نزدیک",
            due_date=timezone.now() + timedelta(days=4),
            warning_days_before=7
        )
        self.assertEqual(r.status, 'near')
        self.assertIn("4 روز دیگر", r.message)

    def test_status_overdue_by_km(self):
        r = Reminder.objects.create(
            user_profile=self.profile,
            vehicle=self.vehicle,
            title="کیلومتر گذشته",
            due_km=119000
        )
        self.assertEqual(r.status, 'overdue')
        self.assertIn("کیلومتر گذشته است", r.message)

    def test_status_near_by_km(self):
        r = Reminder.objects.create(
            user_profile=self.profile,
            vehicle=self.vehicle,
            title="نزدیک به تعویض",
            due_km=121000,
            warning_km_before=1500
        )
        self.assertEqual(r.status, 'near')
        self.assertIn("1000 کیلومتر دیگر", r.message)

    def test_status_ok_when_far(self):
        r = Reminder.objects.create(
            user_profile=self.profile,
            vehicle=self.vehicle,
            title="خیلی دور",
            due_km=150000,
            warning_km_before=5000
        )
        self.assertEqual(r.status, 'ok')
        self.assertEqual(r.message, r.title)
