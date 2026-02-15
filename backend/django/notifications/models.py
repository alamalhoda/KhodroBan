# notifications/models.py
"""
مدل‌های دامنه نوتیفیکیشن (Phase 3a).

NotificationDelivery: لاگ هر تلاش ارسال به هر کانال
NotificationPreference: تنظیمات enable/disable کانال به‌ازای کاربر و event
"""
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from .constants import CHANNEL_EMAIL, CHANNEL_PUSH, CHANNEL_SMS, CHANNEL_TELEGRAM, EVENT_TYPE_REMINDER_DUE

CHANNEL_CHOICES = [
    (CHANNEL_TELEGRAM, "Telegram"),
    (CHANNEL_PUSH, "Push"),
    (CHANNEL_EMAIL, "Email"),
    (CHANNEL_SMS, "SMS"),
]

STATUS_QUEUED = "queued"
STATUS_RETRYING = "retrying"
STATUS_SENT = "sent"
STATUS_FAILED = "failed"
STATUS_CANCELLED = "cancelled"

DELIVERY_STATUS_CHOICES = [
    (STATUS_QUEUED, "Queued"),
    (STATUS_RETRYING, "Retrying"),
    (STATUS_SENT, "Sent"),
    (STATUS_FAILED, "Failed"),
    (STATUS_CANCELLED, "Cancelled"),
]


class NotificationDelivery(models.Model):
    """
    لاگ هر تلاش ارسال نوتیفیکیشن به هر کانال.

    State machine: queued → retrying → sent | failed | cancelled
    ر.ک. docs/technical/notification-channel-providers.md برای اتصال به سرویس‌دهندگان واقعی.
    """
    notification = models.ForeignKey(
        "khodroban.Notification",
        on_delete=models.CASCADE,
        related_name="deliveries",
    )
    channel = models.CharField(max_length=32, choices=CHANNEL_CHOICES, db_index=True)
    status = models.CharField(
        max_length=20,
        choices=DELIVERY_STATUS_CHOICES,
        default=STATUS_QUEUED,
        db_index=True,
    )
    attempt_number = models.PositiveSmallIntegerField(default=1)
    provider_message_id = models.CharField(max_length=255, blank=True, null=True)
    provider_response = models.JSONField(default=dict, blank=True, null=True)
    failure_reason = models.TextField(blank=True, null=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name = _("Notification Delivery")
        verbose_name_plural = _("Notification Deliveries")
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["notification", "channel"]),
            models.Index(fields=["status"]),
        ]

    def __str__(self):
        return f"{self.notification_id} @ {self.channel} → {self.status}"


class NotificationPreference(models.Model):
    """
    تنظیمات enable/disable کانال برای هر کاربر و event.

    Admin می‌تواند کانال را برای event خاص یا به‌طور کلی غیرفعال کند.
    ر.ک. docs/technical/notification-channel-providers.md
    """
    user_profile = models.ForeignKey(
        "khodroban.UserProfile",
        on_delete=models.CASCADE,
        related_name="notification_preferences",
    )
    event_type = models.CharField(max_length=64, default=EVENT_TYPE_REMINDER_DUE, db_index=True)
    channel = models.CharField(max_length=32, choices=CHANNEL_CHOICES, db_index=True)
    is_enabled = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name = _("Notification Preference")
        verbose_name_plural = _("Notification Preferences")
        ordering = ["user_profile", "event_type", "channel"]
        unique_together = [["user_profile", "event_type", "channel"]]
        indexes = [
            models.Index(fields=["user_profile", "event_type"]),
        ]

    def __str__(self):
        return f"{self.user_profile_id} / {self.event_type} / {self.channel} = {self.is_enabled}"
