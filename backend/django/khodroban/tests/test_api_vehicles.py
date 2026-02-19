from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from django.contrib.auth.models import User
from django.utils.crypto import get_random_string

from django.core.files.uploadedfile import SimpleUploadedFile

from khodroban.models import Vehicle, UserProfile, VehicleKmHistory, VehicleImage


class VehicleAPITests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self._test_password = get_random_string(12)
        self.user = User.objects.create_user(username="apiuser", password=self._test_password)
        self.profile, _ = UserProfile.objects.get_or_create(
            user=self.user, defaults={"email": "api@test.com"}
        )
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

    def test_create_vehicle_with_icon_and_color(self):
        data = {
            "model": "پژو 206",
            "year": 1398,
            "plateNumber": "12ب34567",
            "currentKm": 85000,
            "iconName": "car",
            "iconStyle": "solid",
            "iconColor": "#FF5733",
        }
        response = self.client.post(self.list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        vehicle = Vehicle.objects.first()
        self.assertEqual(vehicle.icon_name, "car")
        self.assertEqual(vehicle.icon_style, "solid")
        self.assertEqual(vehicle.icon_color, "#FF5733")
        payload = response.json().get("data", {})
        self.assertEqual(payload.get("iconName"), "car")
        self.assertEqual(payload.get("iconColor"), "#FF5733")

    def test_list_vehicles_only_own(self):
        other_pass = get_random_string(12)
        other_user = User.objects.create_user(
            username="other", password=other_pass, email="other@test.com"
        )
        other_profile = UserProfile.objects.get(user=other_user)
        Vehicle.objects.create(user_profile=other_profile, model="سمند", year=1400, plate_number="99ج999")

        Vehicle.objects.create(user_profile=self.profile, model="پراید", year=1395, plate_number="11ا111")

        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        payload = response.data.get("data", response.data)
        self.assertEqual(len(payload), 1)
        self.assertEqual(payload[0]["plateNumber"], "11ا111")

    def test_update_vehicle_own(self):
        vehicle = Vehicle.objects.create(
            user_profile=self.profile,
            model="Test",
            year=1400,
            plate_number="88و888",
            current_km=10000
        )
        data = {"current_km": 15000}
        response = self.client.patch(self.detail_url(vehicle.id), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        vehicle.refresh_from_db()
        self.assertEqual(vehicle.current_km, 15000)

    def test_cannot_update_other_vehicle(self):
        other2_pass = get_random_string(12)
        other_user = User.objects.create_user(
            username="other2", password=other2_pass, email="o2@test.com"
        )
        other_profile = UserProfile.objects.get(user=other_user)
        other_vehicle = Vehicle.objects.create(
            user_profile=other_profile,
            model="دیگر",
            year=1401,
            plate_number="77ز777"
        )

        data = {"current_km": 99999}
        response = self.client.patch(self.detail_url(other_vehicle.id), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_vehicle_update_km(self):
        vehicle = Vehicle.objects.create(
            user_profile=self.profile,
            model="KmTest",
            year=1400,
            plate_number="22ب222",
            current_km=50000,
        )
        url = f'/api/vehicles/{vehicle.id}/km/'
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
        url = f'/api/vehicles/{vehicle.id}/km-history/'
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

    def test_vehicle_images_list_empty(self):
        vehicle = Vehicle.objects.create(
            user_profile=self.profile,
            model="ImgTest",
            year=1400,
            plate_number="44ث444",
            current_km=0,
        )
        url = f'/api/vehicles/{vehicle.id}/images/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        payload = response.json()
        self.assertTrue(payload.get('success'))
        self.assertEqual(payload.get('data', []), [])

    def test_vehicle_update_km_missing_returns_400(self):
        vehicle = Vehicle.objects.create(
            user_profile=self.profile,
            model="KmErr",
            year=1400,
            plate_number="55پ555",
            current_km=10000,
        )
        url = f'/api/vehicles/{vehicle.id}/km/'
        response = self.client.patch(url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.json().get('success'))
        self.assertIn('km', str(response.json().get('errors', [])))

    def test_vehicle_update_km_invalid_type_returns_400(self):
        vehicle = Vehicle.objects.create(
            user_profile=self.profile,
            model="KmErr2",
            year=1400,
            plate_number="66چ666",
            current_km=10000,
        )
        url = f'/api/vehicles/{vehicle.id}/km/'
        response = self.client.patch(url, {'km': 'not-a-number'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.json().get('success'))

    def test_vehicle_update_km_negative_returns_400(self):
        vehicle = Vehicle.objects.create(
            user_profile=self.profile,
            model="KmErr3",
            year=1400,
            plate_number="77ح777",
            current_km=10000,
        )
        url = f'/api/vehicles/{vehicle.id}/km/'
        response = self.client.patch(url, {'km': -100}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.json().get('success'))

    def test_vehicle_km_history_post_missing_km_returns_400(self):
        vehicle = Vehicle.objects.create(
            user_profile=self.profile,
            model="KmHistErr",
            year=1399,
            plate_number="88خ888",
            current_km=5000,
        )
        url = f'/api/vehicles/{vehicle.id}/km-history/'
        response = self.client.post(url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_vehicle_km_history_post_invalid_km_returns_400(self):
        vehicle = Vehicle.objects.create(
            user_profile=self.profile,
            model="KmHistErr2",
            year=1399,
            plate_number="99د999",
            current_km=5000,
        )
        url = f'/api/vehicles/{vehicle.id}/km-history/'
        response = self.client.post(url, {'km': 'invalid'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_vehicle_km_history_post_negative_km_returns_400(self):
        vehicle = Vehicle.objects.create(
            user_profile=self.profile,
            model="KmHistErr3",
            year=1399,
            plate_number="00ذ000",
            current_km=5000,
        )
        url = f'/api/vehicles/{vehicle.id}/km-history/'
        response = self.client.post(url, {'km': -500}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_vehicle_images_post_max_exceeded_returns_400(self):
        """وقتی تعداد تصاویر به حداکثر رسیده، آپلود جدید باید 400 برگرداند."""
        vehicle = Vehicle.objects.create(
            user_profile=self.profile,
            model="MaxImg",
            year=1400,
            plate_number="11ر111",
            current_km=0,
        )
        fake_img = SimpleUploadedFile(
            "test.jpg", b"x" * 100, content_type="image/jpeg"
        )
        for i in range(VehicleImage.MAX_IMAGES_PER_VEHICLE):
            VehicleImage.objects.create(
                vehicle=vehicle,
                image=SimpleUploadedFile(f"img{i}.jpg", b"x" * 100, content_type="image/jpeg"),
                display_order=i,
            )
        url = f'/api/vehicles/{vehicle.id}/images/'
        data = {'image': fake_img}
        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.json().get('success'))
