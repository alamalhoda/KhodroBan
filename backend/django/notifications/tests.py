# notifications/tests.py
"""تست‌های Phase 3a: NotificationDelivery، NotificationPreference، ChannelDispatcher."""
from unittest.mock import patch

from django.db import IntegrityError
from django.test import TestCase
from django.contrib.auth.models import User

from khodroban.models import UserProfile, Notification, Vehicle, TelegramSetting
from notifications.constants import CHANNEL_TELEGRAM, CHANNEL_EMAIL, EVENT_TYPE_REMINDER_DUE
from notifications.models import NotificationDelivery, NotificationPreference
from notifications.models import STATUS_FAILED
from notifications.dispatcher import (
    dispatch_notification,
    _is_channel_enabled_for_user,
    process_pending_notifications,
)


class NotificationDeliveryTests(TestCase):
    """تست مدل NotificationDelivery."""

    def setUp(self):
        self.user = User.objects.create_user(username="delivery_test", password="pass")
        self.profile, _ = UserProfile.objects.get_or_create(
            user=self.user, defaults={"email": "d@t.com"}
        )
        self.notification = Notification.objects.create(
            user_profile=self.profile,
            title="Test",
            body="Body",
            type="reminder",
            metadata={},
        )

    def test_notification_delivery_creation(self):
        delivery = NotificationDelivery.objects.create(
            notification=self.notification,
            channel=CHANNEL_TELEGRAM,
            status="sent",
            attempt_number=1,
        )
        self.assertEqual(delivery.channel, CHANNEL_TELEGRAM)
        self.assertEqual(delivery.status, "sent")
        self.assertEqual(delivery.notification, self.notification)


class NotificationPreferenceTests(TestCase):
    """تست مدل NotificationPreference."""

    def setUp(self):
        self.user = User.objects.create_user(username="pref_test", password="pass")
        self.profile, _ = UserProfile.objects.get_or_create(
            user=self.user, defaults={"email": "p@t.com"}
        )

    def test_notification_preference_creation(self):
        pref = NotificationPreference.objects.create(
            user_profile=self.profile,
            event_type=EVENT_TYPE_REMINDER_DUE,
            channel=CHANNEL_EMAIL,
            is_enabled=True,
        )
        self.assertEqual(pref.channel, CHANNEL_EMAIL)
        self.assertTrue(pref.is_enabled)

    def test_preference_disabled_skips_channel(self):
        NotificationPreference.objects.create(
            user_profile=self.profile,
            event_type=EVENT_TYPE_REMINDER_DUE,
            channel=CHANNEL_TELEGRAM,
            is_enabled=False,
        )
        self.assertFalse(_is_channel_enabled_for_user(self.profile, EVENT_TYPE_REMINDER_DUE, CHANNEL_TELEGRAM))

    def test_preference_unique_per_user_event_channel(self):
        """هر (user_profile, event_type, channel) فقط یک رکورد داشته باشد."""
        NotificationPreference.objects.create(
            user_profile=self.profile,
            event_type=EVENT_TYPE_REMINDER_DUE,
            channel=CHANNEL_EMAIL,
            is_enabled=True,
        )
        with self.assertRaises(IntegrityError):
            NotificationPreference.objects.create(
                user_profile=self.profile,
                event_type=EVENT_TYPE_REMINDER_DUE,
                channel=CHANNEL_EMAIL,
                is_enabled=False,
            )


class ChannelDispatcherTests(TestCase):
    """تست ChannelDispatcher و fallback order."""

    def setUp(self):
        self.user = User.objects.create_user(
            username="dispatch_test", email="disp@t.com", password="pass"
        )
        self.profile, _ = UserProfile.objects.get_or_create(
            user=self.user, defaults={"email": "disp@t.com"}
        )
        self.vehicle = Vehicle.objects.create(
            user_profile=self.profile,
            model="Test",
            year=1402,
            plate_number="11الف111",
            current_km=20000,
        )
        self.notification = Notification.objects.create(
            user_profile=self.profile,
            vehicle=self.vehicle,
            title="یادآوری سرویس",
            body="Body",
            type="reminder",
            metadata={
                "vehicle_model": "Test",
                "plate_number": "11الف111",
                "days_until_due": -5,
                "interval_days": 90,
                "last_service_date": "2025-01-01",
                "warning_days_before": 7,
            },
        )

    def test_dispatch_creates_delivery_record(self):
        """dispatch_notification باید NotificationDelivery ایجاد کند."""
        initial_count = NotificationDelivery.objects.count()
        dispatch_notification(self.notification)
        self.assertGreater(NotificationDelivery.objects.count(), initial_count)

    @patch("notifications.handlers.telegram.send_telegram", return_value=True)
    def test_dispatch_with_telegram_connected_succeeds(self, mock_send):
        """وقتی کاربر تلگرام متصل دارد، dispatch باید موفق شود (با mock)."""
        TelegramSetting.objects.create(
            user_profile=self.profile,
            chat_id="123456",
            is_enabled=True,
        )
        result = dispatch_notification(self.notification)
        self.assertTrue(result)
        self.notification.refresh_from_db()
        self.assertIsNotNone(self.notification.sent_at)
        self.assertIn("telegram", self.notification.notification_channels or {})

    @patch("notifications.handlers.telegram.send_telegram", return_value=False)
    def test_dispatch_telegram_failure_records_failed_delivery(self, mock_send):
        """وقتی handler تلگرام شکست بخورد، رکورد Delivery با status failed و failure_reason ذخیره شود."""
        TelegramSetting.objects.create(
            user_profile=self.profile,
            chat_id="123456",
            is_enabled=True,
        )
        initial_count = NotificationDelivery.objects.count()
        result = dispatch_notification(self.notification)
        self.assertFalse(result)
        deliveries = NotificationDelivery.objects.filter(notification=self.notification).order_by("created_at")
        self.assertGreater(deliveries.count(), 0)
        first = deliveries.first()
        self.assertEqual(first.channel, CHANNEL_TELEGRAM)
        self.assertEqual(first.status, STATUS_FAILED)
        self.assertTrue(bool(first.failure_reason))

    def test_dispatch_returns_false_when_no_channel_available(self):
        """وقتی هیچ کانالی در دسترس نباشد (بدون تلگرام و stubها شکست)، False برگردد."""
        # کاربر تلگرام ندارد؛ push/email/sms فعلاً stub و False برمی‌گردانند
        result = dispatch_notification(self.notification)
        self.assertFalse(result)
        self.notification.refresh_from_db()
        self.assertIsNone(self.notification.sent_at)

    def test_dispatch_respects_fallback_order(self):
        """اول تلگرام امتحان شود؛ در صورت شکست کانال بعدی (تا حد ممکن با stubها)."""
        TelegramSetting.objects.create(
            user_profile=self.profile,
            chat_id="123456",
            is_enabled=True,
        )
        with patch("notifications.handlers.telegram.send_telegram", return_value=False):
            dispatch_notification(self.notification)
        # حداقل یک delivery برای telegram با وضعیت failed
        telegram_delivery = NotificationDelivery.objects.filter(
            notification=self.notification, channel=CHANNEL_TELEGRAM
        ).first()
        self.assertIsNotNone(telegram_delivery)
        self.assertEqual(telegram_delivery.status, STATUS_FAILED)


class ProcessPendingNotificationsTests(TestCase):
    """تست process_pending_notifications: فقط نوتیفیکیشن‌های بدون sent_at پردازش شوند."""

    def setUp(self):
        self.user = User.objects.create_user(username="pending_test", password="pass")
        self.profile, _ = UserProfile.objects.get_or_create(
            user=self.user, defaults={"email": "pending@t.com"}
        )
        self.vehicle = Vehicle.objects.create(
            user_profile=self.profile,
            model="Test",
            year=1402,
            plate_number="22ب222",
            current_km=10000,
        )

    def test_process_pending_returns_structure(self):
        """خروجی باید شامل processed, success, failed باشد."""
        result = process_pending_notifications(limit=10)
        self.assertIn("processed", result)
        self.assertIn("success", result)
        self.assertIn("failed", result)
        self.assertIsInstance(result["processed"], int)
        self.assertIsInstance(result["success"], int)
        self.assertIsInstance(result["failed"], int)

    def test_process_pending_only_considers_unsent(self):
        """فقط نوتیفیکیشن‌هایی که sent_at آن‌ها null است پردازش شوند؛ ارسال‌شده‌ها دست‌نخورده بمانند."""
        from django.utils import timezone
        pending = Notification.objects.create(
            user_profile=self.profile,
            vehicle=self.vehicle,
            title="پندینگ",
            body="Body",
            type="reminder",
            metadata={},
            sent_at=None,
        )
        already_sent_at = timezone.now()
        already_sent = Notification.objects.create(
            user_profile=self.profile,
            vehicle=self.vehicle,
            title="ارسال‌شده",
            body="Body",
            type="reminder",
            metadata={},
            sent_at=already_sent_at,
        )
        result = process_pending_notifications(limit=10)
        self.assertGreaterEqual(result["processed"], 1)
        already_sent.refresh_from_db()
        self.assertIsNotNone(already_sent.sent_at)
        self.assertEqual(already_sent.sent_at, already_sent_at)

    @patch("notifications.handlers.telegram.send_telegram", return_value=True)
    def test_process_pending_increments_success_when_dispatch_succeeds(self, mock_send):
        """وقتی dispatch موفق شود، success افزایش یابد."""
        TelegramSetting.objects.create(
            user_profile=self.profile,
            chat_id="999",
            is_enabled=True,
        )
        Notification.objects.create(
            user_profile=self.profile,
            vehicle=self.vehicle,
            title="یادآوری",
            body="Body",
            type="reminder",
            metadata={},
            sent_at=None,
        )
        result = process_pending_notifications(limit=10)
        self.assertGreaterEqual(result["processed"], 1)
        self.assertGreaterEqual(result["success"], 1)
