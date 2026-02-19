"""
Smoke flow integration test: login -> create vehicle -> add service/expense -> reports summary -> AI message.
انتهای به انتهای یک مسیر حیاتی کاربر را پوشش می‌دهد.
"""
from unittest.mock import patch, MagicMock

from django.contrib.auth.models import User
from django.utils.crypto import get_random_string
from rest_framework.test import APITestCase, APIClient
from rest_framework import status

from khodroban.models import UserProfile
from khodroban.sample_data import ensure_service_types, ensure_expense_categories


class SmokeFlowTest(APITestCase):
    """Smoke flow: login -> vehicle -> service/expense -> reports -> AI message."""

    def setUp(self):
        self.client = APIClient()
        self._pwd = get_random_string(12)
        self.user = User.objects.create_user(
            username="smokeuser",
            password=self._pwd,
            email="smoke@test.com",
        )
        self.profile = UserProfile.objects.get(user=self.user)
        ensure_service_types()
        ensure_expense_categories()

    def _login(self):
        r = self.client.post(
            "/api/token/",
            {"username": "smokeuser", "password": self._pwd},
            format="json",
        )
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        return r.json()["access"]

    def test_smoke_login_create_vehicle_add_service_reports_ai(self):
        """انتهای به انتهای: ورود، ایجاد خودرو، سرویس، گزارش، پیام AI."""

        # 1. Login
        token = self._login()
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

        # 2. Create vehicle
        r = self.client.post(
            "/api/vehicles/",
            {
                "model": "سمند",
                "year": 1402,
                "plateNumber": "22ب333",
                "currentKm": 50000,
            },
            format="json",
        )
        self.assertEqual(r.status_code, status.HTTP_201_CREATED)
        v_data = r.json().get("data", r.json())
        vehicle_id = v_data["id"]

        # 3. Add service
        r = self.client.post(
            "/api/services/",
            {
                "vehicleId": vehicle_id,
                "date": "1403/01/01",
                "km": 50100,
                "cost": 800000,
                "types": ["oil_change"],
            },
            format="json",
        )
        self.assertEqual(r.status_code, status.HTTP_201_CREATED)

        # 4. Add expense
        r = self.client.post(
            "/api/expenses/",
            {
                "vehicleId": vehicle_id,
                "date": "1403/02/15",
                "amount": 200000,
                "category": "insurance",
            },
            format="json",
        )
        self.assertEqual(r.status_code, status.HTTP_201_CREATED)

        # 5. Reports summary
        r = self.client.get("/api/reports/summary/")
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        summary = r.json().get("data", r.json())
        self.assertIn("totalCost", summary)
        self.assertIn("costByMonth", summary)

        # 6. AI message (with mocked provider)
        with patch("ai_assistant.services.orchestrator.get_provider") as mock_get_provider:
            mock_provider = MagicMock()
            mock_provider.generate.return_value = (
                "پاسخ تست",
                {"provider": "openai", "model": "gpt-3.5", "latency_ms": 50},
            )
            mock_get_provider.return_value = mock_provider

            r = self.client.post(
                "/api/ai/sessions/",
                {"title": "گفتگوی تست"},
                format="json",
            )
            self.assertEqual(r.status_code, status.HTTP_201_CREATED)
            session_id = r.json().get("data", {}).get("id")
            self.assertIsNotNone(session_id)

            r = self.client.post(
                f"/api/ai/sessions/{session_id}/messages/send/",
                {"content": "سلام", "vehicle_id": vehicle_id},
                format="json",
            )
            self.assertEqual(r.status_code, status.HTTP_200_OK)
            self.assertTrue(r.json().get("success"))
            self.assertIn("content", r.json().get("data", {}))

