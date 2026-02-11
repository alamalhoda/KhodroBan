from datetime import date
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from django.contrib.auth.models import User

from khodroban.models import Vehicle, UserProfile, Service, DailyExpense, ServiceType


class ReportSummaryTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="reportuser",
            email="report@test.com",
            password="ReportPass123!",
        )
        self.profile = UserProfile.objects.get(user=self.user)
        self.vehicle = Vehicle.objects.create(
            user_profile=self.profile,
            model="Test Car",
            year=1402,
            plate_number="12ب345",
            current_km=50000,
        )
        self.summary_url = reverse("report_summary")

    def test_report_summary_requires_auth(self):
        response = self.client.get(self.summary_url)
        self.assertIn(response.status_code, (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN))

    def test_report_summary_empty_returns_zeros(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.summary_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        payload = response.data.get("data", response.data)
        self.assertEqual(payload["totalCost"], 0)
        self.assertEqual(payload["totalServiceCost"], 0)
        self.assertEqual(payload["totalExpenses"], 0)
        self.assertEqual(payload["serviceCount"], 0)
        self.assertEqual(payload["expenseCount"], 0)
        self.assertEqual(payload["totalKm"], 50000)
        self.assertIsInstance(payload["costByCategory"], dict)
        self.assertIsInstance(payload["costByMonth"], list)

    def test_report_summary_with_vehicle_filter(self):
        self.client.force_authenticate(user=self.user)
        other_user = User.objects.create_user(
            username="otherreport",
            email="other@test.com",
            password="Other123!",
        )
        other_profile = UserProfile.objects.get(user=other_user)
        other_vehicle = Vehicle.objects.create(
            user_profile=other_profile,
            model="Other Car",
            year=1401,
            plate_number="99ج999",
            current_km=10000,
        )
        response = self.client.get(
            self.summary_url,
            {"vehicle_id": str(self.vehicle.vehicle_id)},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        payload = response.data.get("data", response.data)
        self.assertEqual(payload["totalKm"], 50000)

    def test_report_summary_with_date_filter(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(
            self.summary_url,
            {"date_from": "2024-01-01", "date_to": "2024-12-31"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        payload = response.data.get("data", response.data)
        self.assertIn("totalKm", payload)
        self.assertIn("costByMonth", payload)
