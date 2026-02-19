"""
تست‌های قرارداد API مطابق docs/development/API_CONTRACT_REGISTRY.md.

هدف: جلوگیری از شکستن قرارداد با فرانت با بررسی ساختار پاسخ endpointها.
"""
from datetime import date
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from django.contrib.auth.models import User
from django.utils.crypto import get_random_string

from khodroban.models import Vehicle, UserProfile, Service, DailyExpense, Notification
from khodroban.sample_data import ensure_service_types, ensure_expense_categories


class APIEnvelopeContractTests(APITestCase):
    """قرارداد پوشش موفق: { success: true, data: ... }."""

    def setUp(self):
        self.client = APIClient()
        self._pwd = get_random_string(12)
        self.user = User.objects.create_user(
            username="contract", password=self._pwd, email="contract@test.com"
        )
        self.profile = UserProfile.objects.get(user=self.user)
        self.client.force_authenticate(user=self.user)

    def test_vehicle_list_has_success_data_envelope(self):
        response = self.client.get(reverse("vehicle-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertTrue(data.get("success"))
        self.assertIn("data", data)
        self.assertIsInstance(data["data"], list)

    def test_vehicle_detail_has_success_data_envelope(self):
        v = Vehicle.objects.create(
            user_profile=self.profile,
            model="Test",
            year=1400,
            plate_number="12ب345",
            current_km=50000,
        )
        response = self.client.get(reverse("vehicle-detail", kwargs={"pk": v.id}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertTrue(data.get("success"))
        self.assertIn("data", data)
        self.assertIsInstance(data["data"], dict)

    def test_me_endpoint_has_required_fields(self):
        response = self.client.get("/api/me/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data
        for key in ("id", "email", "name", "tier"):
            self.assertIn(key, data)

    def test_reports_summary_has_contract_fields(self):
        response = self.client.get(reverse("report_summary"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        payload = response.data.get("data", response.data)
        for key in ("totalCost", "totalKm", "costByCategory", "costByMonth"):
            self.assertIn(key, payload)
        self.assertIsInstance(payload["costByCategory"], dict)
        self.assertIsInstance(payload["costByMonth"], list)

    def test_notifications_unread_count_has_contract_shape(self):
        response = self.client.get(reverse("notification-unread-count"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertTrue(data.get("success"))
        self.assertIn("data", data)
        self.assertIn("count", data["data"])
        self.assertIsInstance(data["data"]["count"], int)

    def test_notifications_mark_all_read_returns_count(self):
        response = self.client.post(reverse("notification-mark-all-read"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertTrue(data.get("success"))
        self.assertIn("data", data)
        self.assertIn("status", data["data"])
        self.assertIn("count", data["data"])

    def test_vehicle_response_has_camel_case_fields(self):
        """پاسخ خودرو باید id, userId, model, year, plateNumber, currentKm, note, iconName, iconStyle, iconColor داشته باشد."""
        v = Vehicle.objects.create(
            user_profile=self.profile,
            model="پژو 206",
            year=1400,
            plate_number="12ب345",
            current_km=50000,
            icon_name="car",
            icon_style="solid",
            icon_color="#FF5733",
        )
        response = self.client.get(reverse("vehicle-detail", kwargs={"pk": v.id}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        d = response.json().get("data", {})
        required = ("id", "userId", "model", "year", "plateNumber", "currentKm", "note")
        for key in required:
            self.assertIn(key, d, f"vehicle response باید فیلد {key} داشته باشد")
        self.assertIn("iconName", d)
        self.assertIn("iconColor", d)
        self.assertIn("createdAt", d)
        self.assertIn("updatedAt", d)

    def test_service_response_has_contract_fields(self):
        """پاسخ سرویس: id, vehicleId, date, km, cost, type, types, items, note."""
        ensure_service_types()
        v = Vehicle.objects.create(
            user_profile=self.profile,
            model="Test",
            year=1400,
            plate_number="12ب345",
            current_km=50000,
        )
        s = Service.objects.create(
            vehicle=v,
            service_date=date(1403, 1, 1),
            service_date_gregorian=date(2024, 3, 20),
            service_km=50000,
            total_cost=500000,
        )
        response = self.client.get(reverse("service-detail", kwargs={"pk": s.id}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        d = response.json().get("data", {})
        for key in ("id", "vehicleId", "date", "km", "cost", "type", "types", "items", "note"):
            self.assertIn(key, d)

    def test_expense_response_has_contract_fields(self):
        """پاسخ هزینه: id, vehicleId, date, amount, category, km, note."""
        ensure_expense_categories()
        v = Vehicle.objects.create(
            user_profile=self.profile,
            model="Test",
            year=1400,
            plate_number="12ب345",
            current_km=50000,
        )
        exp = DailyExpense.objects.create(
            vehicle=v,
            expense_date=date(1403, 9, 1),
            expense_date_gregorian=date(2024, 11, 21),
            amount=100000,
        )
        response = self.client.get(reverse("dailyexpense-detail", kwargs={"pk": exp.id}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        d = response.json().get("data", {})
        for key in ("id", "vehicleId", "date", "amount", "category", "note"):
            self.assertIn(key, d)
