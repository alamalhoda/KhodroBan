# khodroban/tests/test_api_services.py
from datetime import date
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from django.contrib.auth.models import User

from khodroban.models import (
    Vehicle, UserProfile, Service, ServiceItem, ServiceType,
    VehicleKmHistory,
)
from khodroban.sample_data import ensure_plans, ensure_service_types, ensure_expense_categories


class ServiceAPITests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="svcuser", password="svcpass")
        self.profile, _ = UserProfile.objects.get_or_create(
            user=self.user, defaults={"email": "svc@test.com"}
        )
        self.client.force_authenticate(user=self.user)
        ensure_plans()
        ensure_service_types()
        ensure_expense_categories()

        self.vehicle = Vehicle.objects.create(
            user_profile=self.profile,
            model="پژو 206",
            year=1398,
            plate_number="12ب34567",
            current_km=80000,
        )
        self.list_url = reverse("service-list")
        self.detail_url = lambda pk: reverse("service-detail", kwargs={"pk": pk})

    def test_create_service_with_types_creates_service_and_items(self):
        data = {
            "vehicleId": str(self.vehicle.vehicle_id),
            "date": "2024-09-06",
            "km": 82000,
            "cost": 1500000,
            "types": ["oil_change", "filter"],
            "note": "تعویض روغن و فیلتر",
        }
        response = self.client.post(self.list_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Service.objects.count(), 1)
        service = Service.objects.first()
        self.assertEqual(service.total_cost, 1500000)
        items = list(service.serviceitem_set.select_related("service_type_code").all())
        self.assertEqual(len(items), 2)
        codes = {item.service_type_code.code for item in items}
        self.assertEqual(codes, {"oil_change", "filter"})
        payload = response.data.get("data", response.data)
        self.assertIn("types", payload)
        self.assertEqual(set(payload["types"]), {"oil_change", "filter"})
        self.assertEqual(len(payload.get("items", [])), 2)

    def test_create_service_with_items_creates_items_with_costs(self):
        data = {
            "vehicleId": str(self.vehicle.vehicle_id),
            "date": "2024-10-01",
            "km": 83000,
            "cost": 2000000,
            "types": ["oil_change", "filter"],
            "items": [
                {"type": "oil_change", "cost": 1200000, "description": "روغن ۵W30"},
                {"type": "filter", "cost": 800000, "description": "فیلتر روغن"},
            ],
            "note": "سرویس دوره‌ای",
        }
        response = self.client.post(self.list_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        service = Service.objects.first()
        self.assertEqual(service.total_cost, 2000000)
        items = list(service.serviceitem_set.select_related("service_type_code").order_by("service_type_code__code"))
        self.assertEqual(len(items), 2)
        by_code = {item.service_type_code.code: item for item in items}
        self.assertEqual(by_code["oil_change"].cost, 1200000)
        self.assertEqual(by_code["filter"].cost, 800000)

    def test_create_service_with_km_creates_vehicle_km_history(self):
        data = {
            "vehicleId": str(self.vehicle.vehicle_id),
            "date": "2024-09-15",
            "km": 82500,
            "cost": 500000,
            "types": ["oil_change"],
            "note": "تعویض روغن",
        }
        response = self.client.post(self.list_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        service = Service.objects.first()
        history = VehicleKmHistory.objects.filter(
            vehicle=self.vehicle, source_type="service", source_id=service.service_id
        ).first()
        self.assertIsNotNone(history)
        self.assertEqual(history.km, 82500)
        self.vehicle.refresh_from_db()
        self.assertEqual(self.vehicle.current_km, 82500)

    def test_create_service_invalid_type_returns_400(self):
        data = {
            "vehicleId": str(self.vehicle.vehicle_id),
            "date": "2024-09-06",
            "km": 82000,
            "cost": 500000,
            "types": ["invalid_code_xyz"],
            "note": "",
        }
        response = self.client.post(self.list_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Service.objects.count(), 0)

    def test_create_service_jalali_date_parsed(self):
        data = {
            "vehicleId": str(self.vehicle.vehicle_id),
            "date": "1403/06/16",
            "km": 81000,
            "cost": 500000,
            "types": ["oil_change"],
            "note": "",
        }
        response = self.client.post(self.list_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        service = Service.objects.first()
        self.assertEqual(service.service_date_gregorian, date(2024, 9, 6))
