"""
API tests for Reminder CRUD, dismiss, by_vehicle, user list.
"""
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from django.contrib.auth.models import User

from khodroban.models import Reminder, Vehicle, UserProfile


class ReminderAPITests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="remuser", password="rempass")
        self.profile, _ = UserProfile.objects.get_or_create(
            user=self.user, defaults={"email": "rem@test.com"}
        )
        self.client.force_authenticate(user=self.user)

        self.vehicle = Vehicle.objects.create(
            user_profile=self.profile,
            model="پژو ۲۰۶",
            year=1398,
            plate_number="12ب34567",
            current_km=85000,
        )

    def test_list_reminders_requires_auth(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(reverse("reminder-list"))
        self.assertIn(response.status_code, (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN))

    def test_list_reminders_empty(self):
        response = self.client.get(reverse("reminder-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json().get("data", response.json())
        self.assertIsInstance(data, list)
        self.assertEqual(len(data), 0)

    def test_create_reminder(self):
        payload = {
            "title": "تعویض روغن",
            "description": "روغن موتور",
            "vehicleId": str(self.vehicle.id),
            "dueDate": "2025-06-01",
            "dueKm": 90000,
            "warningDaysBefore": 7,
            "warningKmBefore": 500,
        }
        response = self.client.post(reverse("reminder-list"), payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        out = response.json().get("data", response.json())
        self.assertEqual(out["title"], "تعویض روغن")
        self.assertEqual(out["vehicleId"], str(self.vehicle.id))
        self.assertEqual(out["warningDaysBefore"], 7)
        self.assertEqual(out.get("warningKmBefore"), 500)
        self.assertTrue(Reminder.objects.filter(user_profile=self.profile).exists())

    def test_retrieve_reminder(self):
        reminder = Reminder.objects.create(
            user_profile=self.profile,
            vehicle=self.vehicle,
            title="یادآور تست",
            due_km=90000,
            warning_days_before=7,
            warning_km_before=500,
        )
        response = self.client.get(
            reverse("reminder-detail", kwargs={"pk": reminder.id})
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json().get("data", response.json())
        self.assertEqual(data["title"], "یادآور تست")
        self.assertEqual(data.get("warningKmBefore"), 500)

    def test_update_reminder(self):
        reminder = Reminder.objects.create(
            user_profile=self.profile,
            vehicle=self.vehicle,
            title="قبل",
            warning_km_before=500,
        )
        payload = {"title": "بعد", "warningKmBefore": 1000}
        response = self.client.patch(
            reverse("reminder-detail", kwargs={"pk": reminder.id}),
            payload,
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        reminder.refresh_from_db()
        self.assertEqual(reminder.title, "بعد")
        self.assertEqual(reminder.warning_km_before, 1000)

    def test_delete_reminder(self):
        reminder = Reminder.objects.create(
            user_profile=self.profile,
            vehicle=self.vehicle,
            title="حذف",
        )
        response = self.client.delete(
            reverse("reminder-detail", kwargs={"pk": reminder.id})
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Reminder.objects.filter(pk=reminder.id).exists())

    def test_dismiss_reminder(self):
        reminder = Reminder.objects.create(
            user_profile=self.profile,
            vehicle=self.vehicle,
            title="dismiss",
            dismissed=False,
        )
        response = self.client.post(
            reverse("reminder-dismiss", kwargs={"pk": reminder.id})
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        reminder.refresh_from_db()
        self.assertTrue(reminder.dismissed)

    def test_by_vehicle_returns_only_that_vehicle_reminders(self):
        Reminder.objects.create(
            user_profile=self.profile,
            vehicle=self.vehicle,
            title="یادآور ۱",
        )
        other_vehicle = Vehicle.objects.create(
            user_profile=self.profile,
            model="سمند",
            year=1400,
            plate_number="99ج999",
            current_km=10000,
        )
        Reminder.objects.create(
            user_profile=self.profile,
            vehicle=other_vehicle,
            title="یادآور ۲",
        )
        response = self.client.get(
            reverse(
                "reminder-by-vehicle",
                kwargs={"vehicle_id": str(self.vehicle.id)},
            )
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json().get("data", response.json())
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]["title"], "یادآور ۱")

    def test_user_list_returns_all_own_reminders(self):
        Reminder.objects.create(
            user_profile=self.profile,
            vehicle=self.vehicle,
            title="یادآور الف",
        )
        Reminder.objects.create(
            user_profile=self.profile,
            vehicle=self.vehicle,
            title="یادآور ب",
        )
        response = self.client.get(reverse("reminder-user-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json().get("data", response.json())
        self.assertEqual(len(data), 2)

    def test_cannot_access_other_user_reminder(self):
        other_user = User.objects.create_user(
            username="otherrem", password="pass", email="otherrem@test.com"
        )
        other_profile = UserProfile.objects.get(user=other_user)
        other_vehicle = Vehicle.objects.create(
            user_profile=other_profile,
            model="دیگر",
            year=1401,
            plate_number="77ز777",
            current_km=5000,
        )
        other_reminder = Reminder.objects.create(
            user_profile=other_profile,
            vehicle=other_vehicle,
            title="یادآور دیگر",
        )
        response = self.client.get(
            reverse("reminder-detail", kwargs={"pk": other_reminder.id})
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
