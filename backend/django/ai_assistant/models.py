"""
Domain models for AI Assistant: sessions and messages.
"""
from django.conf import settings
from django.db import models


class ChatSession(models.Model):
    """One conversation session per user."""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="ai_chat_sessions",
    )
    title = models.CharField(max_length=255, default="گفتگوی جدید")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]
        indexes = [
            models.Index(fields=["user", "-updated_at"]),
        ]


class ChatMessage(models.Model):
    """Single message in a session (user or assistant)."""
    class Role(models.TextChoices):
        USER = "user", "کاربر"
        ASSISTANT = "assistant", "دستیار"
        SYSTEM = "system", "سیستم"

    session = models.ForeignKey(
        ChatSession,
        on_delete=models.CASCADE,
        related_name="messages",
    )
    role = models.CharField(max_length=20, choices=Role.choices)
    content = models.TextField()
    provider = models.CharField(max_length=50, blank=True)
    model = models.CharField(max_length=100, blank=True)
    usage_json = models.JSONField(null=True, blank=True)
    latency_ms = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]
        indexes = [
            models.Index(fields=["session", "created_at"]),
        ]
