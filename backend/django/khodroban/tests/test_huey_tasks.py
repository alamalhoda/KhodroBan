from unittest.mock import patch, MagicMock

from django.test import TestCase
from django.utils import timezone
from django.utils.crypto import get_random_string
from datetime import timedelta
from django.contrib.auth.models import User

# Runtime value for mocking TELEGRAM_BOT_TOKEN to avoid credential-like literals (GitGuardian).
_MOCK_TELEGRAM_TOKEN = get_random_string(12)

from reminders.huey_tasks import check_reminders
from reminders.models import ReminderDueEventOutbox
from notifications.huey_tasks import process_outbox
from khodroban.huey_tasks import send_telegram, process_pending_notifications
from khodroban.models import ReminderSetting, Vehicle, UserProfile, Notification, Service, TelegramSetting


class HueyReminderTaskTests(TestCase):
    def setUp(self):
        self._huey_password = get_random_string(12)
        self.user = User.objects.create_user(username="huey", password=self._huey_password)
        self.profile, _ = UserProfile.objects.get_or_create(
            user=self.user, defaults={"email": "h@t.com"}
        )
        self.vehicle = Vehicle.objects.create(
            user_profile=self.profile,
            model="Test Huey",
            year=1402,
            plate_number="55ه555",
            current_km=20000
        )
        ReminderSetting.objects.create(
            vehicle=self.vehicle,
            interval_days=90,
            warning_days_before=7,
            is_enabled=True,
            reminder_mode='time'
        )

    def test_check_reminders_and_process_outbox_create_notification(self):
        Service.objects.create(
            vehicle=self.vehicle,
            service_date=timezone.now().date() - timedelta(days=100),
            service_date_gregorian=timezone.now().date() - timedelta(days=100),
            service_km=18000,
            total_cost=500000
        )

        check_reminders()
        process_outbox()

        self.assertGreaterEqual(Notification.objects.count(), 1)
        n = Notification.objects.first()
        self.assertIn("یادآوری سرویس دوره‌ای", n.title)
        self.assertIn(self.vehicle.plate_number, n.body)

    def test_check_reminders_only_writes_outbox(self):
        """check_reminders فقط در Outbox می‌نویسد؛ Notification ایجاد نمی‌کند."""
        Service.objects.create(
            vehicle=self.vehicle,
            service_date=timezone.now().date() - timedelta(days=100),
            service_date_gregorian=timezone.now().date() - timedelta(days=100),
            service_km=18000,
            total_cost=500000,
        )

        check_reminders()

        self.assertGreaterEqual(ReminderDueEventOutbox.objects.count(), 1)
        self.assertEqual(Notification.objects.count(), 0)

    def test_process_outbox_idempotency(self):
        """رویداد تکراری (idempotency_key یکسان) نباید Notification تکراری ایجاد کند."""
        Service.objects.create(
            vehicle=self.vehicle,
            service_date=timezone.now().date() - timedelta(days=100),
            service_date_gregorian=timezone.now().date() - timedelta(days=100),
            service_km=18000,
            total_cost=500000,
        )
        check_reminders()
        process_outbox()
        count_after_first = Notification.objects.count()
        self.assertGreaterEqual(count_after_first, 1)

        process_outbox()

        self.assertEqual(Notification.objects.count(), count_after_first)

    def test_process_outbox_marks_processed(self):
        """بعد از پردازش، processed_at روی رویداد ست می‌شود."""
        Service.objects.create(
            vehicle=self.vehicle,
            service_date=timezone.now().date() - timedelta(days=100),
            service_date_gregorian=timezone.now().date() - timedelta(days=100),
            service_km=18000,
            total_cost=500000,
        )
        check_reminders()
        event = ReminderDueEventOutbox.objects.filter(processed_at__isnull=True).first()
        self.assertIsNotNone(event)
        self.assertIsNone(event.processed_at)

        process_outbox()

        event.refresh_from_db()
        self.assertIsNotNone(event.processed_at)

    def test_process_outbox_unknown_event_type_skips_notification(self):
        """رویداد با event_type ناشناخته Notification ایجاد نمی‌کند ولی processed می‌شود."""
        ReminderDueEventOutbox.objects.create(
            idempotency_key="unknown_event_test_1",
            event_type="unknown.event.type.v1",
            payload={
                "user_profile_id": self.profile.pk,
                "vehicle_id": self.vehicle.pk,
            },
        )

        process_outbox()

        self.assertEqual(Notification.objects.count(), 0)
        event = ReminderDueEventOutbox.objects.get(idempotency_key="unknown_event_test_1")
        self.assertIsNotNone(event.processed_at)


class KhodrobanHueyTaskTests(TestCase):
    """تست‌های khodroban.huey_tasks: send_telegram و process_pending_notifications."""

    def setUp(self):
        self._pwd = get_random_string(12)
        self.user = User.objects.create_user(
            username="tguser", password=self._pwd, email="tg@test.com"
        )
        self.profile = UserProfile.objects.get(user=self.user)
        self.vehicle = Vehicle.objects.create(
            user_profile=self.profile,
            model="TestCar",
            year=1402,
            plate_number="12ب345",
            current_km=50000,
        )

    @patch("notifications.senders.requests.post")
    @patch("notifications.senders.settings.TELEGRAM_BOT_TOKEN", _MOCK_TELEGRAM_TOKEN)
    def test_send_telegram_success_updates_notification(self, mock_post):
        """ارسال موفق تلگرام باید notification_channels و sent_at را به‌روز کند."""
        notification = Notification.objects.create(
            user_profile=self.profile,
            vehicle=self.vehicle,
            title="یادآوری تست",
            body="بدنه تست",
            type="reminder",
            metadata={
                "vehicle_model": "پژو 206",
                "plate_number": "12ب345",
                "days_until_due": 5,
                "interval_days": 90,
                "last_service_date": "1403/06/01",
            },
        )
        TelegramSetting.objects.create(
            user_profile=self.profile,
            chat_id="123456",
            is_enabled=True,
        )

        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"result": {"message_id": 42}}
        mock_post.return_value = mock_response

        result = send_telegram.call_local(str(notification.id))

        self.assertTrue(result)
        notification.refresh_from_db()
        self.assertIsNotNone(notification.sent_at)
        self.assertIn("telegram", notification.notification_channels)
        self.assertEqual(
            notification.notification_channels["telegram"]["status"],
            "sent",
        )
        mock_post.assert_called_once()

    @patch("notifications.senders.requests.post")
    @patch("notifications.senders.settings.TELEGRAM_BOT_TOKEN", _MOCK_TELEGRAM_TOKEN)
    def test_send_telegram_no_telegram_setting_returns_false(self, mock_post):
        """وقتی TelegramSetting یا chat_id نیست، باید False برگرداند."""
        notification = Notification.objects.create(
            user_profile=self.profile,
            vehicle=self.vehicle,
            title="یادآوری بدون تلگرام",
            body="بدنه",
            type="reminder",
        )
        # هیچ TelegramSetting با chat_id نمی‌سازیم

        result = send_telegram.call_local(str(notification.id))

        self.assertFalse(result)
        mock_post.assert_not_called()

    @patch("notifications.senders.requests.post")
    @patch("notifications.senders.settings.TELEGRAM_BOT_TOKEN", _MOCK_TELEGRAM_TOKEN)
    def test_send_telegram_no_chat_id_returns_false(self, mock_post):
        """TelegramSetting بدون chat_id نباید ارسال کند."""
        notification = Notification.objects.create(
            user_profile=self.profile,
            vehicle=self.vehicle,
            title="یادآوری",
            body="بدنه",
            type="reminder",
        )
        TelegramSetting.objects.create(
            user_profile=self.profile,
            chat_id=None,
            is_enabled=True,
        )

        result = send_telegram.call_local(str(notification.id))

        self.assertFalse(result)
        mock_post.assert_not_called()

    def test_send_telegram_notification_not_found_returns_false(self):
        """notification_id نامعتبر باید False برگرداند."""
        result = send_telegram.call_local("00000000-0000-0000-0000-000000000000")
        self.assertFalse(result)

    @patch("notifications.senders.requests.post")
    @patch("notifications.senders.settings.TELEGRAM_BOT_TOKEN", _MOCK_TELEGRAM_TOKEN)
    def test_send_telegram_request_exception_reraises(self, mock_post):
        """وقتی requests.post استثنا پرتاب کند، باید همان استثنا دوباره پرتاب شود."""
        notification = Notification.objects.create(
            user_profile=self.profile,
            vehicle=self.vehicle,
            title="یادآوری",
            body="بدنه",
            type="reminder",
        )
        TelegramSetting.objects.create(
            user_profile=self.profile,
            chat_id="999",
            is_enabled=True,
        )
        mock_post.side_effect = ConnectionError("network error")

        with self.assertRaises(ConnectionError):
            send_telegram.call_local(str(notification.id))

    @patch("notifications.senders.requests.post")
    @patch("notifications.senders.settings.TELEGRAM_BOT_TOKEN", _MOCK_TELEGRAM_TOKEN)
    def test_send_telegram_api_failure_returns_false(self, mock_post):
        """وقتی API تلگرام خطا برمی‌گرداند، باید False برگردد."""
        notification = Notification.objects.create(
            user_profile=self.profile,
            vehicle=self.vehicle,
            title="یادآوری",
            body="بدنه",
            type="reminder",
        )
        TelegramSetting.objects.create(
            user_profile=self.profile,
            chat_id="999",
            is_enabled=True,
        )

        mock_response = MagicMock()
        mock_response.status_code = 500
        mock_post.return_value = mock_response

        result = send_telegram.call_local(str(notification.id))

        self.assertFalse(result)
        mock_post.assert_called_once()

    @patch("notifications.dispatcher.process_pending_notifications")
    def test_process_pending_notifications_calls_dispatcher(self, mock_dispatch):
        """process_pending_notifications باید dispatcher را با limit=100 فراخوانی کند."""
        mock_dispatch.return_value = {
            "processed": 0,
            "success": 0,
            "failed": 0,
        }

        process_pending_notifications.call_local()

        mock_dispatch.assert_called_once_with(limit=100)
