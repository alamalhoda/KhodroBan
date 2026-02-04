# khodroban/admin.py
from django.contrib import admin
from .models import (
    SubscriptionPlan, UserProfile, UserSubscription,
    Vehicle, ServiceType, Service, ServiceItem, DailyExpense,
    ReminderSetting, Reminder, Notification, TelegramSetting, VehicleKmHistory,
)


@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ('vehicle_id', 'model', 'plate_number', 'year', 'current_km', 'user_profile')
    list_filter = ('year',)
    search_fields = ('model', 'plate_number')


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('service_id', 'vehicle', 'service_date', 'service_km', 'total_cost')
    list_filter = ('service_date',)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'email', 'tier', 'created_at')


admin.site.register(SubscriptionPlan)
admin.site.register(UserSubscription)
admin.site.register(ServiceType)
admin.site.register(ServiceItem)
admin.site.register(DailyExpense)
admin.site.register(ReminderSetting)
admin.site.register(Reminder)
admin.site.register(Notification)
admin.site.register(TelegramSetting)
admin.site.register(VehicleKmHistory)
