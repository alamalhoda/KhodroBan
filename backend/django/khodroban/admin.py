# khodroban/admin.py
from django.contrib import admin
from .models import (
    SubscriptionPlan,
    UserProfile,
    UserSubscription,
    Vehicle,
    ServiceType,
    Service,
    ServiceItem,
    DailyExpense,
    ReminderSetting,
    Reminder,
    Notification,
    TelegramSetting,
    VehicleKmHistory,
)


# ─── Inlines ─────────────────────────────────────────────────────────────────

class UserSubscriptionInline(admin.TabularInline):
    model = UserSubscription
    extra = 0
    autocomplete_fields = ("plan",)
    readonly_fields = ("created_at", "updated_at")


class VehicleInline(admin.TabularInline):
    model = Vehicle
    extra = 0
    show_change_link = True
    fields = ("model", "plate_number", "year", "current_km")
    readonly_fields = ()


class ServiceItemInline(admin.TabularInline):
    model = ServiceItem
    extra = 0
    autocomplete_fields = ("service_type_code",)
    readonly_fields = ("created_at",)


class ReminderSettingInline(admin.StackedInline):
    model = ReminderSetting
    extra = 0
    max_num = 1


# ─── Subscription & Users ────────────────────────────────────────────────────

@admin.register(SubscriptionPlan)
class SubscriptionPlanAdmin(admin.ModelAdmin):
    list_display = (
        "plan_code",
        "plan_name",
        "max_vehicles",
        "monthly_price",
        "allow_csv_export",
        "allow_pdf_export",
        "allow_sms_reminder",
        "is_active",
        "created_at",
    )
    list_filter = ("is_active", "allow_csv_export", "allow_pdf_export", "allow_sms_reminder")
    search_fields = ("plan_code", "plan_name")
    ordering = ("plan_code",)
    readonly_fields = ("created_at", "updated_at")
    list_per_page = 25


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "email",
        "first_name",
        "last_name",
        "tier",
        "is_active",
        "is_email_verified",
        "last_login",
        "created_at",
    )
    list_filter = ("tier", "is_active", "is_email_verified")
    search_fields = ("user__username", "email", "first_name", "last_name")
    raw_id_fields = ("user",)
    readonly_fields = ("created_at", "updated_at", "last_login")
    inlines = (UserSubscriptionInline, VehicleInline)
    list_per_page = 25


@admin.register(UserSubscription)
class UserSubscriptionAdmin(admin.ModelAdmin):
    list_display = (
        "subscription_id",
        "user_profile",
        "plan",
        "start_date",
        "end_date",
        "is_active",
        "auto_renew",
        "created_at",
    )
    list_filter = ("is_active", "auto_renew", "plan")
    search_fields = ("user_profile__user__username", "user_profile__email")
    autocomplete_fields = ("user_profile", "plan")
    readonly_fields = ("created_at", "updated_at")
    date_hierarchy = "start_date"
    list_per_page = 25


# ─── Vehicles & Services ─────────────────────────────────────────────────────

@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = (
        "vehicle_id",
        "model",
        "plate_number",
        "year",
        "current_km",
        "user_profile",
        "updated_at",
    )
    list_filter = ("year",)
    search_fields = ("model", "plate_number", "user_profile__user__username")
    raw_id_fields = ("user_profile",)
    readonly_fields = ("created_at", "updated_at")
    inlines = (ReminderSettingInline,)
    list_per_page = 25


@admin.register(ServiceType)
class ServiceTypeAdmin(admin.ModelAdmin):
    list_display = ("code", "name", "group_name", "icon", "is_active", "created_at")
    list_filter = ("group_name", "is_active")
    search_fields = ("code", "name", "group_name")
    ordering = ("group_name", "code")
    readonly_fields = ("created_at", "updated_at")
    list_per_page = 25


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = (
        "service_id",
        "vehicle",
        "service_date",
        "service_date_gregorian",
        "service_km",
        "total_cost",
        "created_at",
    )
    list_filter = ("service_date_gregorian",)
    search_fields = ("vehicle__model", "vehicle__plate_number", "general_note")
    raw_id_fields = ("vehicle",)
    readonly_fields = ("created_at", "updated_at")
    date_hierarchy = "service_date_gregorian"
    inlines = (ServiceItemInline,)
    list_per_page = 25


@admin.register(ServiceItem)
class ServiceItemAdmin(admin.ModelAdmin):
    list_display = ("service_item_id", "service", "service_type_code", "cost", "created_at")
    list_filter = ("service_type_code",)
    search_fields = ("service__vehicle__plate_number", "description")
    autocomplete_fields = ("service", "service_type_code")
    readonly_fields = ("created_at",)
    list_per_page = 25


@admin.register(DailyExpense)
class DailyExpenseAdmin(admin.ModelAdmin):
    list_display = (
        "expense_id",
        "vehicle",
        "expense_date",
        "expense_date_gregorian",
        "amount",
        "category_code",
        "km_at_expense",
        "created_at",
    )
    list_filter = ("category_code",)
    search_fields = ("vehicle__plate_number", "description", "category_code")
    raw_id_fields = ("vehicle",)
    readonly_fields = ("created_at", "updated_at")
    date_hierarchy = "expense_date_gregorian"
    list_per_page = 25


# ─── Reminders & Notifications ───────────────────────────────────────────────

@admin.register(ReminderSetting)
class ReminderSettingAdmin(admin.ModelAdmin):
    list_display = (
        "reminder_setting_id",
        "vehicle",
        "reminder_mode",
        "interval_km",
        "interval_days",
        "warning_km_before",
        "warning_days_before",
        "is_enabled",
        "updated_at",
    )
    list_filter = ("reminder_mode", "is_enabled")
    search_fields = ("vehicle__plate_number", "vehicle__model")
    raw_id_fields = ("vehicle",)
    readonly_fields = ("created_at", "updated_at")
    list_per_page = 25


@admin.register(Reminder)
class ReminderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "user_profile",
        "vehicle",
        "status",
        "source",
        "dismissed",
        "due_date",
        "due_km",
        "created_at",
    )
    list_filter = ("status", "source", "dismissed", "type")
    search_fields = ("title", "description", "message", "user_profile__user__username")
    raw_id_fields = ("user_profile", "vehicle")
    readonly_fields = ("created_at", "updated_at", "status", "message")
    date_hierarchy = "due_date"
    list_per_page = 25


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title_short",
        "user_profile",
        "vehicle",
        "type",
        "read",
        "sent_at",
        "created_at",
    )
    list_filter = ("type", "read")
    search_fields = ("title", "body", "user_profile__user__username")
    raw_id_fields = ("user_profile", "vehicle")
    readonly_fields = ("created_at", "updated_at")
    date_hierarchy = "created_at"
    list_per_page = 25

    def title_short(self, obj):
        return obj.title[:50] + "…" if len(obj.title) > 50 else obj.title

    title_short.short_description = "Title"


# ─── Telegram & KM History ───────────────────────────────────────────────────

@admin.register(TelegramSetting)
class TelegramSettingAdmin(admin.ModelAdmin):
    list_display = ("id", "user_profile", "chat_id", "connection_code", "is_enabled", "updated_at")
    list_filter = ("is_enabled",)
    search_fields = ("user_profile__user__username", "chat_id", "connection_code")
    raw_id_fields = ("user_profile",)
    readonly_fields = ("created_at", "updated_at")
    list_per_page = 25


@admin.register(VehicleKmHistory)
class VehicleKmHistoryAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "vehicle",
        "km",
        "source_type",
        "source_id",
        "recorded_at",
        "created_at",
    )
    list_filter = ("source_type",)
    search_fields = ("vehicle__plate_number", "note")
    raw_id_fields = ("vehicle",)
    readonly_fields = ("created_at",)
    date_hierarchy = "recorded_at"
    list_per_page = 25
