# reminders/models.py
"""
دامنه یادآوری‌ها (Reminders).

مسئولیت: ارزیابی موعد سرویس، emit رویداد به Outbox فقط.
بدون فراخوانی مستقیم Notification.
"""
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
import uuid


class ReminderDueEventOutbox(models.Model):
    """
    جدول Outbox برای رویداد reminder.due.detected.v1.

    Producer: reminders domain (check_reminders)
    Consumer: notifications domain (process_outbox)
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event_type = models.CharField(max_length=64, default="reminder.due.detected.v1")
    occurred_at = models.DateTimeField(default=timezone.now)
    idempotency_key = models.CharField(max_length=255, unique=True, db_index=True)
    payload = models.JSONField()
    processed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name = _("Reminder Due Event Outbox")
        verbose_name_plural = _("Reminder Due Event Outbox")
        ordering = ["created_at"]
        indexes = [
            models.Index(fields=["processed_at"]),
        ]
