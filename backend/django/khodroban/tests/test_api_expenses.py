"""تست API هزینه‌ها؛ از جمله فیلتر بر اساس vehicle_id."""
from datetime import date
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from django.contrib.auth.models import User
from django.utils.crypto import get_random_string

from khodroban.models import Vehicle, UserProfile, DailyExpense


class ExpenseAPITests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        # Password generated at runtime to avoid GitGuardian false positives on literals.
        self.user = User.objects.create_user(
            username="expuser",
            password=get_random_string(12),
            email="exp@test.com",
        )
        self.profile = UserProfile.objects.get(user=self.user)
        self.client.force_authenticate(user=self.user)
        self.v1 = Vehicle.objects.create(
            user_profile=self.profile,
            model="V1",
            year=1400,
            plate_number="11الف111",
            current_km=10000,
        )
        self.v2 = Vehicle.objects.create(
            user_profile=self.profile,
            model="V2",
            year=1401,
            plate_number="22ب222",
            current_km=20000,
        )
        self.list_url = reverse("dailyexpense-list")

    def test_expenses_list_filter_by_vehicle_id(self):
        DailyExpense.objects.create(
            vehicle=self.v1,
            expense_date=date(1403, 9, 1),
            expense_date_gregorian=date(2024, 11, 21),
            amount=100000,
        )
        DailyExpense.objects.create(
            vehicle=self.v2,
            expense_date=date(1403, 9, 2),
            expense_date_gregorian=date(2024, 11, 22),
            amount=200000,
        )
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        payload = response.data.get("data", response.data)
        self.assertEqual(len(payload), 2)

        response_v1 = self.client.get(self.list_url, {"vehicle_id": self.v1.id})
        self.assertEqual(response_v1.status_code, status.HTTP_200_OK)
        data_v1 = response_v1.data.get("data", response_v1.data)
        self.assertEqual(len(data_v1), 1)
        self.assertEqual(str(data_v1[0]["vehicleId"]), str(self.v1.id))
        self.assertEqual(data_v1[0]["amount"], 100000)

        response_v2 = self.client.get(self.list_url, {"vehicleId": self.v2.id})
        self.assertEqual(response_v2.status_code, status.HTTP_200_OK)
        data_v2 = response_v2.data.get("data", response_v2.data)
        self.assertEqual(len(data_v2), 1)
        self.assertEqual(str(data_v2[0]["vehicleId"]), str(self.v2.id))
        self.assertEqual(data_v2[0]["amount"], 200000)
