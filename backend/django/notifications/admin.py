# notifications/admin.py
from django.contrib import admin

from .models import NotificationDelivery, NotificationPreference


@admin.register(NotificationDelivery)
class NotificationDeliveryAdmin(admin.ModelAdmin):
    list_display = ("id", "notification", "channel", "status", "attempt_number", "sent_at", "created_at")
    list_filter = ("channel", "status")
    search_fields = ("notification__title", "failure_reason")
    raw_id_fields = ("notification",)
    readonly_fields = ("created_at", "updated_at")
    date_hierarchy = "created_at"
    list_per_page = 25


@admin.register(NotificationPreference)
class NotificationPreferenceAdmin(admin.ModelAdmin):
    list_display = ("user_profile", "event_type", "channel", "is_enabled", "updated_at")
    list_filter = ("channel", "event_type", "is_enabled")
    search_fields = ("user_profile__user__username",)
    raw_id_fields = ("user_profile",)
    readonly_fields = ("created_at", "updated_at")
    list_per_page = 25
