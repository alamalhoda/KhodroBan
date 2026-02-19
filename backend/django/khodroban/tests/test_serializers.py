"""
تست‌های واحد برای serializers و parse_service_date.
"""
from datetime import date
from django.test import TestCase
from django.contrib.auth.models import User
from django.utils.crypto import get_random_string

from khodroban.serializers import (
    parse_service_date,
    VehicleSerializer,
    VehicleApiSerializer,
    ServiceApiSerializer,
    DailyExpenseApiSerializer,
    RegisterSerializer,
    VehicleKmHistorySerializer,
    ServiceItemSerializer,
    DailyExpenseSerializer,
)
from khodroban.models import (
    Vehicle, UserProfile, VehicleKmHistory, Service, ServiceItem,
    ServiceType, DailyExpense, ExpenseCategory,
)
from khodroban.sample_data import ensure_service_types, ensure_expense_categories


class ParseServiceDateTests(TestCase):
    def test_parse_iso_date(self):
        svc, greg = parse_service_date("2024-09-06")
        self.assertEqual(greg, date(2024, 9, 6))
        self.assertEqual(svc, date(2024, 9, 6))

    def test_parse_jalali_date(self):
        svc, greg = parse_service_date("1403/06/16")
        self.assertEqual(greg, date(2024, 9, 6))
        self.assertEqual(svc, date(2024, 9, 6))

    def test_parse_empty_returns_none(self):
        self.assertEqual(parse_service_date(""), (None, None))
        self.assertEqual(parse_service_date(None), (None, None))

    def test_parse_invalid_returns_none(self):
        self.assertEqual(parse_service_date("not-a-date"), (None, None))


class VehicleSerializerValidationTests(TestCase):
    def setUp(self):
        self._pwd = get_random_string(12)
        self.user = User.objects.create_user(username="srvuser", password=self._pwd)
        self.profile, _ = UserProfile.objects.get_or_create(
            user=self.user, defaults={"email": "srv@test.com"}
        )

    def test_validate_year_out_of_range_raises_error(self):
        data = {
            "model": "Test",
            "year": 1200,
            "plate_number": "12ب345",
            "current_km": 50000,
        }
        s = VehicleSerializer(data=data)
        self.assertFalse(s.is_valid())
        self.assertIn("year", s.errors)

    def test_validate_current_km_negative_raises_error(self):
        data = {
            "model": "Test",
            "year": 1400,
            "plate_number": "12ب345",
            "current_km": -100,
        }
        s = VehicleSerializer(data=data)
        self.assertFalse(s.is_valid())
        self.assertIn("current_km", s.errors)


class VehicleApiSerializerTests(TestCase):
    def setUp(self):
        self._pwd = get_random_string(12)
        self.user = User.objects.create_user(username="apiuser", password=self._pwd)
        self.profile, _ = UserProfile.objects.get_or_create(
            user=self.user, defaults={"email": "api@test.com"}
        )
        self.vehicle = Vehicle.objects.create(
            user_profile=self.profile,
            model="Test",
            year=1400,
            plate_number="12ب345",
            current_km=50000,
        )

    def test_to_internal_value_accepts_camel_case(self):
        """VehicleApiSerializer باید camelCase را به snake_case تبدیل کند."""
        data = {
            "model": "Test",
            "year": 1400,
            "plateNumber": "99ج999",
            "currentKm": 100000,
            "note": "یادداشت",
        }
        s = VehicleApiSerializer(data=data)
        self.assertTrue(s.is_valid(), s.errors)
        self.assertEqual(s.validated_data.get("plate_number"), "99ج999")
        self.assertEqual(s.validated_data.get("current_km"), 100000)
        self.assertEqual(s.validated_data.get("description"), "یادداشت")


class ServiceApiSerializerTests(TestCase):
    def setUp(self):
        self._pwd = get_random_string(12)
        self.user = User.objects.create_user(username="svcapi", password=self._pwd)
        self.profile, _ = UserProfile.objects.get_or_create(
            user=self.user, defaults={"email": "svcapi@test.com"}
        )
        self.vehicle = Vehicle.objects.create(
            user_profile=self.profile,
            model="Test",
            year=1400,
            plate_number="12ب345",
            current_km=50000,
        )
        ensure_service_types()

    def test_invalid_date_raises_validation_error(self):
        data = {
            "date": "invalid-date",
            "km": 50000,
            "cost": 500000,
        }
        s = ServiceApiSerializer(data=data)
        self.assertFalse(s.is_valid())
        self.assertIn("date", s.errors)


class DailyExpenseSerializerValidationTests(TestCase):
    def setUp(self):
        ensure_expense_categories()
        self._pwd = get_random_string(12)
        self.user = User.objects.create_user(username="expapi", password=self._pwd)
        self.profile, _ = UserProfile.objects.get_or_create(
            user=self.user, defaults={"email": "expapi@test.com"}
        )
        self.vehicle = Vehicle.objects.create(
            user_profile=self.profile,
            model="Test",
            year=1400,
            plate_number="12ب345",
            current_km=50000,
        )

    def test_validate_amount_zero_raises_error(self):
        data = {
            "date": "2024-11-21",
            "amount": 0,
            "category": "fuel",
        }
        s = DailyExpenseApiSerializer(data=data)
        self.assertFalse(s.is_valid())
        self.assertIn("amount", s.errors)

    def test_validate_amount_negative_raises_error(self):
        data = {
            "date": "2024-11-21",
            "amount": -100,
            "category": "fuel",
        }
        s = DailyExpenseApiSerializer(data=data)
        self.assertFalse(s.is_valid())
        self.assertIn("amount", s.errors)


class RegisterSerializerTests(TestCase):
    def test_password_mismatch_raises_validation_error(self):
        data = {
            "username": "reguser",
            "email": "reg@test.com",
            "password": "Pass123!",
            "password2": "Different1!",
        }
        s = RegisterSerializer(data=data)
        self.assertFalse(s.is_valid())
        self.assertIn("password", s.errors)

    def test_create_creates_user(self):
        data = {
            "username": "newuser",
            "email": "new@test.com",
            "password": "NewPass123!",
            "password2": "NewPass123!",
            "first_name": "New",
            "last_name": "User",
        }
        s = RegisterSerializer(data=data)
        self.assertTrue(s.is_valid())
        user = s.save()
        self.assertEqual(user.username, "newuser")
        self.assertEqual(user.email, "new@test.com")
        self.assertTrue(user.check_password("NewPass123!"))


class VehicleKmHistorySerializerValidationTests(TestCase):
    def setUp(self):
        self._pwd = get_random_string(12)
        self.user = User.objects.create_user(username="kmuser", password=self._pwd)
        self.profile, _ = UserProfile.objects.get_or_create(
            user=self.user, defaults={"email": "km@test.com"}
        )
        self.vehicle = Vehicle.objects.create(
            user_profile=self.profile,
            model="Test",
            year=1400,
            plate_number="12ب345",
            current_km=50000,
        )

    def test_validate_km_negative_raises_error(self):
        data = {"km": -100, "source_type": "manual"}
        s = VehicleKmHistorySerializer(data=data)
        self.assertFalse(s.is_valid())
        self.assertIn("km", s.errors)


class ServiceItemSerializerValidationTests(TestCase):
    def setUp(self):
        self._pwd = get_random_string(12)
        self.user = User.objects.create_user(username="itemuser", password=self._pwd)
        self.profile, _ = UserProfile.objects.get_or_create(
            user=self.user, defaults={"email": "item@test.com"}
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

    def test_validate_cost_negative_raises_error(self):
        if not self.service_type:
            self.skipTest("ServiceType oil_change not found")
        data = {
            "service": self.service.pk,
            "service_type": self.service_type.pk,
            "cost": -1000,
        }
        s = ServiceItemSerializer(data=data)
        self.assertFalse(s.is_valid())
        self.assertIn("cost", s.errors)
