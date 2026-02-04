# khodroban/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, MyTokenObtainPairView, MeView
from .views import (
    VehicleViewSet, ServiceViewSet, DailyExpenseViewSet,
    ReminderSettingViewSet, ReminderViewSet, NotificationViewSet,
    TelegramSettingViewSet, telegram_webhook, huey_health
)

router = DefaultRouter()
router.register(r'vehicles', VehicleViewSet)
router.register(r'services', ServiceViewSet)
router.register(r'expenses', DailyExpenseViewSet)
router.register(r'reminder-settings', ReminderSettingViewSet)
router.register(r'reminders', ReminderViewSet)
router.register(r'notifications', NotificationViewSet)
router.register(r'telegram-settings', TelegramSettingViewSet)

urlpatterns = [
    path('api/', include(router.urls)),

    path('api/me/', MeView.as_view(), name='me'),

    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', RegisterView.as_view(), name='register'),

    path('telegram/webhook/', telegram_webhook, name='telegram_webhook'),
    path('huey-health/', huey_health, name='huey_health'),
]
