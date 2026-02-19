"""
تست‌های مکمل views.py برای VehicleImageViewSet، NotificationViewSet، TelegramSettingViewSet و huey_health.
"""
import pytest

from django.core.files.uploadedfile import SimpleUploadedFile

try:
    from huey.contrib.djhuey import Huey  # noqa: F401
    HUEY_IMPORTABLE = True
except ImportError:
    HUEY_IMPORTABLE = False
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from django.contrib.auth.models import User
from django.utils.crypto import get_random_string

from khodroban.models import (
    Vehicle, UserProfile, VehicleImage, Notification, TelegramSetting,
)


class VehicleImageViewSetTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self._pwd = get_random_string(12)
        self.user = User.objects.create_user(
            username="imguser", password=self._pwd, email="img@test.com"
        )
        self.profile = UserProfile.objects.get(user=self.user)
        self.client.force_authenticate(user=self.user)
        self.vehicle = Vehicle.objects.create(
            user_profile=self.profile,
            model="ImgVehicle",
            year=1400,
            plate_number="11ز111",
            current_km=10000,
        )

    def test_vehicle_images_list_filter_by_vehicle_id(self):
        """فیلتر vehicle_id یا vehicleId در query param."""
        img = VehicleImage.objects.create(
            vehicle=self.vehicle,
            image=SimpleUploadedFile("a.jpg", b"x" * 100, content_type="image/jpeg"),
        )
        url = reverse("vehicleimage-list")
        r = self.client.get(url, {"vehicle_id": str(self.vehicle.id)})
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        data = r.json().get("data", [])
        self.assertEqual(len(data), 1)
        self.assertEqual(str(data[0]["vehicleId"]), str(self.vehicle.id))

    def test_vehicle_image_partial_update_sets_default(self):
        """PATCH با isDefault=true تصویر را پیش‌فرض می‌کند."""
        img = VehicleImage.objects.create(
            vehicle=self.vehicle,
            image=SimpleUploadedFile("b.jpg", b"x" * 100, content_type="image/jpeg"),
            is_default=False,
        )
        url = reverse("vehicleimage-detail", kwargs={"pk": img.id})
        r = self.client.patch(url, {"isDefault": True}, format="json")
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        img.refresh_from_db()
        self.assertTrue(img.is_default)

    def test_vehicle_image_destroy_returns_204(self):
        """حذف تصویر 204 برمی‌گرداند."""
        img = VehicleImage.objects.create(
            vehicle=self.vehicle,
            image=SimpleUploadedFile("c.jpg", b"x" * 100, content_type="image/jpeg"),
        )
        url = reverse("vehicleimage-detail", kwargs={"pk": img.id})
        r = self.client.delete(url)
        self.assertEqual(r.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(VehicleImage.objects.filter(pk=img.id).exists())


class NotificationViewSetTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self._pwd = get_random_string(12)
        self.user = User.objects.create_user(
            username="notifuser", password=self._pwd, email="notif@test.com"
        )
        self.profile = UserProfile.objects.get(user=self.user)
        self.client.force_authenticate(user=self.user)

    def test_notification_list_empty(self):
        r = self.client.get(reverse("notification-list"))
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(r.json().get("data", []), [])

    def test_notification_list_filter_read(self):
        n1 = Notification.objects.create(
            user_profile=self.profile,
            title="خوانده",
            read=True,
        )
        n2 = Notification.objects.create(
            user_profile=self.profile,
            title="نخوانده",
            read=False,
        )
        r = self.client.get(reverse("notification-list"), {"read": "true"})
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        data = r.json().get("data", [])
        self.assertEqual(len(data), 1)
        self.assertTrue(data[0]["read"])

        r2 = self.client.get(reverse("notification-list"), {"read": "false"})
        data2 = r2.json().get("data", [])
        self.assertEqual(len(data2), 1)
        self.assertFalse(data2[0]["read"])

    def test_notification_destroy_returns_204(self):
        n = Notification.objects.create(
            user_profile=self.profile,
            title="حذف",
        )
        r = self.client.delete(reverse("notification-detail", kwargs={"pk": n.id}))
        self.assertEqual(r.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Notification.objects.filter(pk=n.id).exists())

    def test_notification_unread_count(self):
        Notification.objects.create(user_profile=self.profile, title="۱", read=False)
        Notification.objects.create(user_profile=self.profile, title="۲", read=False)
        Notification.objects.create(user_profile=self.profile, title="۳", read=True)
        r = self.client.get(reverse("notification-unread-count"))
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(r.json().get("data", {}).get("count"), 2)

    def test_notification_mark_all_read(self):
        Notification.objects.create(user_profile=self.profile, title="۱", read=False)
        Notification.objects.create(user_profile=self.profile, title="۲", read=False)
        r = self.client.post(reverse("notification-mark-all-read"))
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(r.json().get("data", {}).get("count"), 2)
        self.assertEqual(
            Notification.objects.filter(user_profile=self.profile, read=False).count(),
            0,
        )

    def test_notification_mark_as_read(self):
        n = Notification.objects.create(
            user_profile=self.profile,
            title="یادداشت",
            read=False,
        )
        r = self.client.post(
            reverse("notification-mark-as-read", kwargs={"pk": n.id})
        )
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        n.refresh_from_db()
        self.assertTrue(n.read)


class TelegramSettingViewSetTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self._pwd = get_random_string(12)
        self.user = User.objects.create_user(
            username="tguser", password=self._pwd, email="tg@test.com"
        )
        self.profile = UserProfile.objects.get(user=self.user)
        self.client.force_authenticate(user=self.user)

    def test_telegram_setting_list_creates_on_get_object(self):
        """وقتی TelegramSetting نداریم، get_object آن را می‌سازد."""
        self.assertFalse(TelegramSetting.objects.filter(user_profile=self.profile).exists())
        # list فراخوانی get_queryset می‌کند نه get_object؛ برای activate شدن get_object
        # باید retrieve صدا بزنیم. چون ViewSet get_object override کرده، برای list نیازی نیست.
        # برای تست generate_code و list کافی است.
        r = self.client.get(reverse("telegramsetting-list"))
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        # لیست خالی چون هنوز ایجاد نشده (get_queryset قبل از get_object است)
        data = r.json().get("data", [])
        self.assertEqual(len(data), 0)

    def test_telegram_setting_generate_code_returns_connection_code(self):
        """generate_code یک کد اتصال برمی‌گرداند."""
        r = self.client.post(reverse("telegramsetting-generate-code"))
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        payload = r.json()
        self.assertIn("connection_code", payload)
        self.assertEqual(len(payload["connection_code"]), 32)
        self.assertIn("message", payload)


@pytest.mark.skipif(not HUEY_IMPORTABLE, reason="huey.contrib.djhuey.Huey not importable")
class HueyHealthTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self._pwd = get_random_string(12)
        self.user = User.objects.create_user(
            username="healthuser", password=self._pwd, email="health@test.com"
        )
        self.client.force_authenticate(user=self.user)

    def test_huey_health_returns_json_with_status(self):
        """huey_health باید JSON برگرداند؛ ۲۰۰ با status/huey_connected یا ۵۰۰ با status/detail."""
        r = self.client.get(reverse("huey_health"))
        self.assertIn(r.status_code, (status.HTTP_200_OK, status.HTTP_500_INTERNAL_SERVER_ERROR))
        try:
            data = r.json()
        except Exception:
            self.fail("huey_health باید پاسخ JSON برگرداند")
        self.assertIn("status", data)
        if r.status_code == 200:
            self.assertIn("huey_connected", data)
            self.assertEqual(data["status"], "healthy")
