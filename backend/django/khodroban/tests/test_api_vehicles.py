from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from django.contrib.auth.models import User

from khodroban.models import Vehicle, UserProfile, VehicleKmHistory


class VehicleAPITests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="apiuser", password="apipass")
        self.profile = UserProfile.objects.create(user=self.user, email="api@test.com")
        self.client.force_authenticate(user=self.user)

        self.list_url = reverse('vehicle-list')
        self.detail_url = lambda pk: reverse('vehicle-detail', kwargs={'pk': pk})

    def test_create_vehicle(self):
        data = {
            "model": "پژو 206",
            "year": 1398,
            "plate_number": "12ب34567",
            "current_km": 85000,
            "description": "خودرو شخصی"
        }
        response = self.client.post(self.list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Vehicle.objects.count(), 1)
        self.assertEqual(Vehicle.objects.first().plate_number, "12ب34567")

    def test_list_vehicles_only_own(self):
        other_user = User.objects.create_user(username="other", password="pass")
        other_profile = UserProfile.objects.create(user=other_user, email="o@t.com")
        Vehicle.objects.create(user_profile=other_profile, model="سمند", year=1400, plate_number="99ج999")

        Vehicle.objects.create(user_profile=self.profile, model="پراید", year=1395, plate_number="11ا111")

        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['plate_number'], "11ا111")

    def test_update_vehicle_own(self):
        vehicle = Vehicle.objects.create(
            user_profile=self.profile,
            model="Test",
            year=1400,
            plate_number="88و888",
            current_km=10000
        )
        data = {"current_km": 15000}
        response = self.client.patch(self.detail_url(vehicle.vehicle_id), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        vehicle.refresh_from_db()
        self.assertEqual(vehicle.current_km, 15000)

    def test_cannot_update_other_vehicle(self):
        other_user = User.objects.create_user(username="other2", password="pass")
        other_profile = UserProfile.objects.create(user=other_user, email="o2@t.com")
        other_vehicle = Vehicle.objects.create(
            user_profile=other_profile,
            model="دیگر",
            year=1401,
            plate_number="77ز777"
        )

        data = {"current_km": 99999}
        response = self.client.patch(self.detail_url(other_vehicle.vehicle_id), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_vehicle_update_km(self):
        vehicle = Vehicle.objects.create(
            user_profile=self.profile,
            model="KmTest",
            year=1400,
            plate_number="22ب222",
            current_km=50000,
        )
        url = f'/api/vehicles/{vehicle.vehicle_id}/km/'
        response = self.client.patch(url, {'km': 55000}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        payload = response.json()
        self.assertTrue(payload.get('success'))
        self.assertEqual(payload['data']['currentKm'], 55000)
        vehicle.refresh_from_db()
        self.assertEqual(vehicle.current_km, 55000)
        self.assertEqual(VehicleKmHistory.objects.filter(vehicle=vehicle).count(), 1)

    def test_vehicle_km_history_post_and_get(self):
        vehicle = Vehicle.objects.create(
            user_profile=self.profile,
            model="HistoryTest",
            year=1399,
            plate_number="33ت333",
            current_km=10000,
        )
        url = f'/api/vehicles/{vehicle.vehicle_id}/km-history/'
        response = self.client.post(
            url,
            {'km': 12000, 'sourceType': 'manual', 'note': 'تست'},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        payload = response.json()
        self.assertTrue(payload.get('success'))
        self.assertEqual(payload['data']['currentKm'], 12000)
        response2 = self.client.get(url)
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        data_list = response2.json().get('data', [])
        self.assertEqual(len(data_list), 1)
        self.assertEqual(data_list[0]['km'], 12000)
        self.assertEqual(data_list[0]['sourceType'], 'manual')
