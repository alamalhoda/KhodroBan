# khodroban/views.py
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.http import JsonResponse
from django.utils.crypto import get_random_string
from django.utils import timezone
import json
import requests
import logging
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, MyTokenObtainPairSerializer

from .models import (
    Vehicle, Service, DailyExpense, ReminderSetting, Reminder,
    Notification, TelegramSetting, UserProfile
)
from .serializers import (
    VehicleSerializer, ServiceSerializer, DailyExpenseSerializer,
    ReminderSettingSerializer, ReminderSerializer, NotificationSerializer,
    TelegramSettingSerializer
)
from .huey_tasks import send_telegram

logger = logging.getLogger(__name__)


class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if hasattr(obj, 'user_profile'):
            return obj.user_profile == request.user.userprofile
        if hasattr(obj, 'user'):
            return obj.user == request.user
        return False


class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Vehicle.objects.filter(user_profile=self.request.user.userprofile)

    def perform_create(self, serializer):
        serializer.save(user_profile=self.request.user.userprofile)


class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Service.objects.filter(vehicle__user_profile=self.request.user.userprofile)

    def perform_create(self, serializer):
        serializer.save()


class DailyExpenseViewSet(viewsets.ModelViewSet):
    queryset = DailyExpense.objects.all()
    serializer_class = DailyExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return DailyExpense.objects.filter(vehicle__user_profile=self.request.user.userprofile)


class ReminderSettingViewSet(viewsets.ModelViewSet):
    queryset = ReminderSetting.objects.all()
    serializer_class = ReminderSettingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ReminderSetting.objects.filter(vehicle__user_profile=self.request.user.userprofile)


class ReminderViewSet(viewsets.ModelViewSet):
    queryset = Reminder.objects.all()
    serializer_class = ReminderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Reminder.objects.filter(user_profile=self.request.user.userprofile)

    def perform_create(self, serializer):
        serializer.save(user_profile=self.request.user.userprofile)


class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user_profile=self.request.user.userprofile).order_by('-created_at')

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        notification = self.get_object()
        notification.read = True
        notification.save(update_fields=['read'])
        return Response({'status': 'read'})


class TelegramSettingViewSet(viewsets.ModelViewSet):
    queryset = TelegramSetting.objects.all()
    serializer_class = TelegramSettingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TelegramSetting.objects.filter(user_profile=self.request.user.userprofile)

    def get_object(self):
        obj, created = TelegramSetting.objects.get_or_create(
            user_profile=self.request.user.userprofile,
            defaults={'is_enabled': True}
        )
        return obj

    @action(detail=False, methods=['post'])
    def generate_code(self, request):
        setting, _ = TelegramSetting.objects.get_or_create(
            user_profile=request.user.userprofile,
            defaults={'is_enabled': True}
        )
        setting.connection_code = get_random_string(length=32)
        setting.save(update_fields=['connection_code'])
        return Response({
            'connection_code': setting.connection_code,
            'message': 'کد را در ربات تلگرام با دستور /start [کد] استفاده کنید'
        })


@csrf_exempt
@require_POST
@api_view(['POST'])
def telegram_webhook(request):
    try:
        update = json.loads(request.body)
        message = update.get('message', {})
        if not message:
            return JsonResponse({'ok': True})

        chat_id = message.get('chat', {}).get('id')
        text = message.get('text', '').strip()

        if not chat_id:
            return JsonResponse({'ok': True})

        if text.startswith('/start'):
            parts = text.split()
            code = parts[1] if len(parts) > 1 else None

            if code:
                try:
                    setting = TelegramSetting.objects.get(connection_code=code)
                    setting.chat_id = str(chat_id)
                    setting.connection_code = None
                    setting.is_enabled = True
                    setting.save()

                    send_telegram_message(
                        chat_id,
                        "اتصال با موفقیت انجام شد!\nاز این پس یادآوری‌ها را در تلگرام دریافت خواهید کرد. ✓"
                    )
                    return JsonResponse({'ok': True})
                except TelegramSetting.DoesNotExist:
                    send_telegram_message(chat_id, "کد نامعتبر یا منقضی شده است.")
                    return JsonResponse({'ok': True})
            else:
                send_telegram_message(
                    chat_id,
                    "سلام!\nبرای اتصال ربات به حساب خود، کد اتصال را از برنامه وارد کنید.\n"
                    "دستور: /start [کد اتصال]"
                )
                return JsonResponse({'ok': True})

        elif text == '/status':
            setting = TelegramSetting.objects.filter(chat_id=str(chat_id), is_enabled=True).first()
            if setting:
                send_telegram_message(chat_id, "وضعیت: فعال ✓")
            else:
                send_telegram_message(chat_id, "وضعیت: غیرفعال ✗")
            return JsonResponse({'ok': True})

        return JsonResponse({'ok': True})

    except Exception as e:
        logger.exception("خطا در webhook تلگرام")
        return JsonResponse({'ok': False, 'error': str(e)}, status=500)


def send_telegram_message(chat_id, text):
    from django.conf import settings
    try:
        requests.post(
            f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}/sendMessage",
            json={
                'chat_id': chat_id,
                'text': text,
                'parse_mode': 'HTML'
            },
            timeout=10
        )
    except Exception as e:
        logger.error(f"خطا در ارسال پیام تلگرام: {e}")


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def huey_health(request):
    from huey.contrib.djhuey import Huey

    huey = Huey.get('khodroban-tasks')
    try:
        connected = huey.storage.connection_available()
        result = {'status': 'healthy', 'huey_connected': connected}
        try:
            from huey_monitor.models import Task
            last_tasks = Task.objects.order_by('-started')[:5]
            result['recent_tasks'] = [
                {
                    'name': t.name,
                    'started': t.started,
                    'finished': t.finished,
                    'success': t.success,
                    'exception': t.exception
                }
                for t in last_tasks
            ]
        except ImportError:
            result['recent_tasks'] = []
        return Response(result)
    except Exception as e:
        return Response({'status': 'error', 'detail': str(e)}, status=500)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def _get_profile(self, request):
        try:
            return request.user.userprofile
        except UserProfile.DoesNotExist:
            return UserProfile.objects.create(
                user=request.user,
                email=request.user.email,
                first_name=request.user.first_name or '',
                last_name=request.user.last_name or '',
            )

    def _user_response(self, request, profile):
        name = f'{profile.first_name or ""} {profile.last_name or ""}'.strip() or request.user.username or ''
        return {
            'id': str(request.user.pk),
            'email': profile.email,
            'name': name,
            'tier': profile.tier or 'free',
            'createdAt': profile.created_at.isoformat() if profile.created_at else None,
            'updatedAt': profile.updated_at.isoformat() if profile.updated_at else None,
        }

    def get(self, request):
        profile = self._get_profile(request)
        return Response(self._user_response(request, profile))

    def patch(self, request):
        profile = self._get_profile(request)
        first_name = request.data.get('firstName') or request.data.get('first_name')
        last_name = request.data.get('lastName') or request.data.get('last_name')
        if first_name is not None:
            profile.first_name = first_name
        if last_name is not None:
            profile.last_name = last_name
        profile.updated_at = timezone.now()
        profile.save(update_fields=['first_name', 'last_name', 'updated_at'])
        return Response(self._user_response(request, profile))


class RegisterView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                },
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
