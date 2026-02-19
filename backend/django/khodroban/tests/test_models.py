from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from django.utils import timezone
from django.utils.crypto import get_random_string
from django.contrib.auth.models import User
from datetime import timedelta, date

from khodroban.models import (
    Reminder, Vehicle, UserProfile, Service, ServiceItem, DailyExpense,
    VehicleImage, ServiceType, ExpenseCategory,
)
from khodroban.sample_data import ensure_service_types, ensure_expense_categories


class ReminderModelTests(TestCase):
    def setUp(self):
        self._pwd = get_random_string(12)
        self.user = User.objects.create_user(username="test", password=self._pwd)
        self.profile, _ = UserProfile.objects.get_or_create(
            user=self.user, defaults={"email": "a@b.com"}
        )
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
        self._pwd = get_random_string(12)
        self.user = User.objects.create_user(username="tester", password=self._pwd)
        self.profile, _ = UserProfile.objects.get_or_create(
            user=self.user, defaults={"email": "t@e.com"}
        )
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
        self.assertIn("روز دیگر", r.message)

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


class VehicleValidationTests(TestCase):
    def setUp(self):
        self._pwd = get_random_string(12)
        self.user = User.objects.create_user(username="valuser", password=self._pwd)
        self.profile, _ = UserProfile.objects.get_or_create(
            user=self.user, defaults={"email": "val@test.com"}
        )

    def test_vehicle_year_out_of_range_raises_validation_error(self):
        v = Vehicle(
            user_profile=self.profile,
            model="Test",
            year=1200,
            plate_number="12ب345",
            current_km=50000,
        )
        with self.assertRaises(ValidationError) as ctx:
            v.save()
        self.assertIn("year", str(ctx.exception).lower() or str(ctx.exception))

    def test_vehicle_current_km_negative_raises_validation_error(self):
        v = Vehicle(
            user_profile=self.profile,
            model="Test",
            year=1400,
            plate_number="12ب345",
            current_km=-100,
        )
        with self.assertRaises(ValidationError):
            v.save()


class ServiceValidationTests(TestCase):
    def setUp(self):
        self._pwd = get_random_string(12)
        self.user = User.objects.create_user(username="svcval", password=self._pwd)
        self.profile, _ = UserProfile.objects.get_or_create(
            user=self.user, defaults={"email": "svcval@test.com"}
        )
        self.vehicle = Vehicle.objects.create(
            user_profile=self.profile,
            model="Test",
            year=1400,
            plate_number="12ب345",
            current_km=50000,
        )
        ensure_service_types()

    def test_service_km_negative_raises_validation_error(self):
        s = Service(
            vehicle=self.vehicle,
            service_date=date(1403, 1, 1),
            service_date_gregorian=date(2024, 3, 20),
            service_km=-100,
            total_cost=500000,
        )
        with self.assertRaises(ValidationError):
            s.save()

    def test_service_total_cost_negative_raises_validation_error(self):
        s = Service(
            vehicle=self.vehicle,
            service_date=date(1403, 1, 1),
            service_date_gregorian=date(2024, 3, 20),
            service_km=50000,
            total_cost=-500000,
        )
        with self.assertRaises(ValidationError):
            s.save()


class ServiceItemValidationTests(TestCase):
    def setUp(self):
        self._pwd = get_random_string(12)
        self.user = User.objects.create_user(username="itemval", password=self._pwd)
        self.profile, _ = UserProfile.objects.get_or_create(
            user=self.user, defaults={"email": "itemval@test.com"}
        )
        self.vehicle = Vehicle.objects.create(
            user_profile=self.profile,
            model="Test",
            year=1400,
            plate_number="12ب345",
            current_km=50000,
        )
        ensure_service_types()
        self.service = Service.objects.create(
            vehicle=self.vehicle,
            service_date=date(1403, 1, 1),
            service_date_gregorian=date(2024, 3, 20),
            service_km=50000,
            total_cost=500000,
        )
        self.service_type = ServiceType.objects.filter(code="oil_change").first()

    def test_service_item_cost_negative_raises_validation_error(self):
        if not self.service_type:
            self.skipTest("ServiceType oil_change not found")
        item = ServiceItem(
            service=self.service,
            service_type=self.service_type,
            cost=-1000,
        )
        with self.assertRaises(ValidationError):
            item.save()


class DailyExpenseValidationTests(TestCase):
    def setUp(self):
        self._pwd = get_random_string(12)
        self.user = User.objects.create_user(username="expval", password=self._pwd)
        self.profile, _ = UserProfile.objects.get_or_create(
            user=self.user, defaults={"email": "expval@test.com"}
        )
        self.vehicle = Vehicle.objects.create(
            user_profile=self.profile,
            model="Test",
            year=1400,
            plate_number="12ب345",
            current_km=50000,
        )
        ensure_expense_categories()

    def test_daily_expense_amount_zero_raises_validation_error(self):
        exp = DailyExpense(
            vehicle=self.vehicle,
            expense_date=date(1403, 9, 1),
            expense_date_gregorian=date(2024, 11, 21),
            amount=0,
        )
        with self.assertRaises(ValidationError):
            exp.save()

    def test_daily_expense_amount_negative_raises_validation_error(self):
        exp = DailyExpense(
            vehicle=self.vehicle,
            expense_date=date(1403, 9, 1),
            expense_date_gregorian=date(2024, 11, 21),
            amount=-50000,
        )
        with self.assertRaises(ValidationError):
            exp.save()

    def test_daily_expense_km_at_expense_negative_raises_validation_error(self):
        exp = DailyExpense(
            vehicle=self.vehicle,
            expense_date=date(1403, 9, 1),
            expense_date_gregorian=date(2024, 11, 21),
            amount=50000,
            km_at_expense=-100,
        )
        with self.assertRaises(ValidationError):
            exp.save()


class VehicleImageValidationTests(TestCase):
    def setUp(self):
        self._pwd = get_random_string(12)
        self.user = User.objects.create_user(username="imgval", password=self._pwd)
        self.profile, _ = UserProfile.objects.get_or_create(
            user=self.user, defaults={"email": "imgval@test.com"}
        )
        self.vehicle = Vehicle.objects.create(
            user_profile=self.profile,
            model="Test",
            year=1400,
            plate_number="12ب345",
            current_km=50000,
        )
        self.valid_image = SimpleUploadedFile(
            "test.jpg", b"x" * 100, content_type="image/jpeg"
        )

    def test_vehicle_image_max_per_vehicle_raises_validation_error(self):
        """وقتی تعداد تصاویر به حداکثر رسیده، ذخیرهٔ تصویر جدید باید ValidationError بدهد."""
        for i in range(VehicleImage.MAX_IMAGES_PER_VEHICLE):
            VehicleImage.objects.create(
                vehicle=self.vehicle,
                image=SimpleUploadedFile(
                    f"img{i}.jpg", b"x" * 100, content_type="image/jpeg"
                ),
            )
        img = VehicleImage(
            vehicle=self.vehicle,
            image=SimpleUploadedFile("extra.jpg", b"x" * 100, content_type="image/jpeg"),
        )
        with self.assertRaises(ValidationError) as ctx:
            img.save()
        self.assertIn("maximum", str(ctx.exception).lower())
