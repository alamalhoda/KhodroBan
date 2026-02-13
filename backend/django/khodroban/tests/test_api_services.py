# khodroban/tests/test_api_services.py
from datetime import date
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from django.contrib.auth.models import User
from django.utils.crypto import get_random_string

from khodroban.serializers import parse_service_date
from khodroban.models import (
    Vehicle, UserProfile, Service, ServiceItem, ServiceType,
    VehicleKmHistory, ServicePreset,
)
from khodroban.sample_data import ensure_plans, ensure_service_types, ensure_expense_categories


class ServiceAPITests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        # Password generated at runtime to avoid GitGuardian false positive on literal strings.
        self.user = User.objects.create_user(
            username="svcuser",
            password=get_random_string(12),
        )
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
        self.presets_list_url = reverse("servicepreset-list")

    def test_create_service_with_types_creates_service_and_items(self):
        data = {
            "vehicleId": str(self.vehicle.id),
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
        items = list(service.items.select_related("service_type").all())
        self.assertEqual(len(items), 2)
        codes = {item.service_type.code for item in items}
        self.assertEqual(codes, {"oil_change", "filter"})
        payload = response.data.get("data", response.data)
        self.assertIn("types", payload)
        self.assertEqual(set(payload["types"]), {"oil_change", "filter"})
        self.assertEqual(len(payload.get("items", [])), 2)

    def test_create_service_with_items_creates_items_with_costs(self):
        data = {
            "vehicleId": str(self.vehicle.id),
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
        items = list(service.items.select_related("service_type").order_by("service_type__code"))
        self.assertEqual(len(items), 2)
        by_code = {item.service_type.code: item for item in items}
        self.assertEqual(by_code["oil_change"].cost, 1200000)
        self.assertEqual(by_code["filter"].cost, 800000)

    def test_create_service_with_km_creates_vehicle_km_history(self):
        data = {
            "vehicleId": str(self.vehicle.id),
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
            vehicle=self.vehicle, source_type="service", source_id=service.id
        ).first()
        self.assertIsNotNone(history)
        self.assertEqual(history.km, 82500)
        self.vehicle.refresh_from_db()
        self.assertEqual(self.vehicle.current_km, 82500)

    def test_create_service_invalid_type_returns_400(self):
        data = {
            "vehicleId": str(self.vehicle.id),
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
            "vehicleId": str(self.vehicle.id),
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

    def test_create_service_jalali_then_get_returns_iso_date(self):
        """Round-trip: user sends Jalali → DB stores gregorian → GET returns ISO for display."""
        data = {
            "vehicleId": str(self.vehicle.id),
            "date": "1403/06/16",
            "km": 81000,
            "cost": 500000,
            "types": ["oil_change"],
            "note": "",
        }
        create_response = self.client.post(self.list_url, data, format="json")
        self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)
        payload = create_response.data.get("data", create_response.data)
        service_id = payload.get("id")
        self.assertIsNotNone(service_id)

        get_response = self.client.get(self.detail_url(service_id))
        self.assertEqual(get_response.status_code, status.HTTP_200_OK)
        get_payload = get_response.data.get("data", get_response.data)
        self.assertIn("date", get_payload)
        self.assertEqual(get_payload["date"], "2024-09-06")

    def test_create_service_iso_date_parsed(self):
        """ISO date YYYY-MM-DD is accepted."""
        data = {
            "vehicleId": str(self.vehicle.id),
            "date": "2024-09-06",
            "km": 81000,
            "cost": 500000,
            "types": ["oil_change"],
            "note": "",
        }
        response = self.client.post(self.list_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        service = Service.objects.first()
        self.assertEqual(service.service_date_gregorian, date(2024, 9, 6))

    def test_create_service_invalid_date_returns_400(self):
        """Invalid date string returns 400 with date error message."""
        data = {
            "vehicleId": str(self.vehicle.id),
            "date": "not-a-date",
            "km": 82000,
            "cost": 500000,
            "types": ["oil_change"],
            "note": "",
        }
        response = self.client.post(self.list_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("date", response.data.get("errors", response.data))
        self.assertEqual(Service.objects.count(), 0)

    def test_create_service_invalid_jalali_year_returns_400(self):
        """Jalali year outside 1300-1500 is rejected."""
        data = {
            "vehicleId": str(self.vehicle.id),
            "date": "1200/06/16",
            "km": 82000,
            "cost": 500000,
            "types": ["oil_change"],
            "note": "",
        }
        response = self.client.post(self.list_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Service.objects.count(), 0)

    def test_list_service_presets_returns_active_presets_with_type_codes(self):
        oil = ServiceType.objects.get(code="oil_change")
        filt = ServiceType.objects.get(code="filter")
        preset = ServicePreset.objects.create(
            name="سرویس ۵۰۰۰",
            display_order=10,
            is_active=True,
        )
        preset.service_types.set([oil, filt])
        response = self.client.get(self.presets_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        payload = response.data.get("data", response.data)
        self.assertIsInstance(payload, list)
        self.assertGreaterEqual(len(payload), 1)
        first = next((p for p in payload if p.get("id") == preset.id), None)
        self.assertIsNotNone(first)
        self.assertEqual(first["name"], "سرویس ۵۰۰۰")
        self.assertEqual(first["display_order"], 10)
        self.assertEqual(set(first["service_type_codes"]), {"oil_change", "filter"})

    def test_list_service_presets_unauthorized_returns_401(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.presets_list_url)
        # DRF returns 403 Forbidden for unauthenticated access to authenticated-only views
        self.assertIn(response.status_code, (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN))


class ParseServiceDateTests(APITestCase):
    """Unit tests for parse_service_date (ISO and Jalali date parsing)."""

    def test_parse_iso_date(self):
        svc, greg = parse_service_date("2024-09-06")
        self.assertEqual(greg, date(2024, 9, 6))
        self.assertEqual(svc, date(2024, 9, 6))

    def test_parse_jalali_date_slash(self):
        svc, greg = parse_service_date("1403/06/16")
        self.assertEqual(greg, date(2024, 9, 6))
        self.assertEqual(svc, date(2024, 9, 6))

    def test_parse_empty_returns_none(self):
        self.assertEqual(parse_service_date(""), (None, None))
        self.assertEqual(parse_service_date(None), (None, None))

    def test_parse_invalid_returns_none(self):
        self.assertEqual(parse_service_date("not-a-date"), (None, None))

    def test_parse_jalali_year_out_of_range_returns_none(self):
        self.assertEqual(parse_service_date("1200/06/16"), (None, None))
        self.assertEqual(parse_service_date("1600/01/01"), (None, None))
