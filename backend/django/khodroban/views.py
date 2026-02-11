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
from django.db.models import Sum
from django.db.models.functions import TruncMonth
from collections import defaultdict
from .serializers import RegisterSerializer, MyTokenObtainPairSerializer

from .models import (
    Vehicle, Service, DailyExpense, ReminderSetting, Reminder,
    Notification, TelegramSetting, UserProfile, VehicleKmHistory,
    ServiceType, ExpenseCategory
)
from rest_framework.exceptions import PermissionDenied
from .serializers import (
    VehicleSerializer, VehicleApiSerializer,
    ServiceSerializer, ServiceApiSerializer,
    DailyExpenseSerializer, DailyExpenseApiSerializer,
    ReminderSettingSerializer, ReminderSerializer, ReminderApiSerializer,
    NotificationSerializer, TelegramSettingSerializer,
    VehicleKmHistorySerializer,
    ServiceTypeSerializer, ExpenseCategorySerializer
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


def api_response(data, status_code=200, headers=None):
    """پاسخ یکسان برای فرانت: { success: true, data: ... }"""
    return Response({'success': True, 'data': data}, status=status_code, headers=headers or {})


class ApiResponseMixin:
    """میکسین برای wrap کردن خروجی ViewSetها مطابق ApiResponse<T> فرانت"""

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return api_response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return api_response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return api_response(serializer.data, status.HTTP_201_CREATED, headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}
        return api_response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)


class VehicleViewSet(ApiResponseMixin, viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleApiSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Vehicle.objects.filter(user_profile=self.request.user.userprofile)

    def perform_create(self, serializer):
        serializer.save(user_profile=self.request.user.userprofile)

    @action(detail=True, methods=['patch'], url_path='km')
    def update_km(self, request, pk=None):
        vehicle = self.get_object()
        km = request.data.get('km')
        if km is None:
            return Response(
                {'success': False, 'errors': ['km الزامی است.']},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            km = int(km)
        except (TypeError, ValueError):
            return Response(
                {'success': False, 'errors': ['کیلومتر باید عدد باشد.']},
                status=status.HTTP_400_BAD_REQUEST
            )
        if km < 0:
            return Response(
                {'success': False, 'errors': ['کیلومتر نمی‌تواند منفی باشد.']},
                status=status.HTTP_400_BAD_REQUEST
            )
        vehicle.current_km = km
        vehicle.save(update_fields=['current_km', 'updated_at'])
        VehicleKmHistory.objects.create(
            vehicle=vehicle,
            km=km,
            source_type='manual',
            source_id=None,
            note=request.data.get('note', '')
        )
        serializer = self.get_serializer(vehicle)
        return api_response(serializer.data)

    @action(detail=True, methods=['post', 'get'], url_path='km-history')
    def km_history(self, request, pk=None):
        vehicle = self.get_object()
        if request.method == 'GET':
            records = VehicleKmHistory.objects.filter(vehicle=vehicle).order_by('-recorded_at')
            data = [
                {
                    'id': str(r.id),
                    'vehicleId': str(vehicle.vehicle_id),
                    'km': r.km,
                    'recordedAt': r.recorded_at.isoformat() if r.recorded_at else None,
                    'sourceType': r.source_type,
                    'sourceId': r.source_id,
                    'note': r.note or '',
                    'createdAt': r.created_at.isoformat() if r.created_at else None,
                }
                for r in records
            ]
            return api_response(data)
        # POST
        km = request.data.get('km')
        source_type = request.data.get('sourceType') or request.data.get('source_type') or 'manual'
        source_id = request.data.get('sourceId') or request.data.get('source_id')
        note = request.data.get('note') or ''
        if km is None:
            return Response(
                {'success': False, 'errors': ['km الزامی است.']},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            km = int(km)
        except (TypeError, ValueError):
            return Response(
                {'success': False, 'errors': ['کیلومتر باید عدد باشد.']},
                status=status.HTTP_400_BAD_REQUEST
            )
        if km < 0:
            return Response(
                {'success': False, 'errors': ['کیلومتر نمی‌تواند منفی باشد.']},
                status=status.HTTP_400_BAD_REQUEST
            )
        VehicleKmHistory.objects.create(
            vehicle=vehicle,
            km=km,
            source_type=source_type,
            source_id=source_id,
            note=note
        )
        vehicle.current_km = km
        vehicle.save(update_fields=['current_km', 'updated_at'])
        serializer = self.get_serializer(vehicle)
        return api_response(serializer.data, status.HTTP_200_OK)


class ServiceViewSet(ApiResponseMixin, viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceApiSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Service.objects.filter(vehicle__user_profile=self.request.user.userprofile)

    def perform_create(self, serializer):
        vehicle_id = self.request.data.get('vehicleId')
        if not vehicle_id:
            raise PermissionDenied('vehicleId الزامی است.')
        vehicle = Vehicle.objects.filter(pk=vehicle_id, user_profile=self.request.user.userprofile).first()
        if not vehicle:
            raise PermissionDenied('خودرو یافت نشد یا دسترسی ندارید.')
        total_cost = self.request.data.get('cost', 0)
        serializer.save(vehicle=vehicle, total_cost=total_cost)

    @action(detail=False, methods=['get'], url_path='latest/(?P<vehicle_id>[^/.]+)')
    def latest(self, request, vehicle_id=None):
        vehicle = Vehicle.objects.filter(
            vehicle_id=vehicle_id,
            user_profile=request.user.userprofile
        ).first()
        if not vehicle:
            return Response(
                {'success': False, 'errors': ['خودرو یافت نشد.']},
                status=status.HTTP_404_NOT_FOUND
            )
        service = (
            Service.objects.filter(vehicle=vehicle)
            .order_by('-service_date_gregorian')
            .first()
        )
        if not service:
            return api_response(None)
        serializer = self.get_serializer(service)
        return api_response(serializer.data)


class DailyExpenseViewSet(ApiResponseMixin, viewsets.ModelViewSet):
    queryset = DailyExpense.objects.all()
    serializer_class = DailyExpenseApiSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return DailyExpense.objects.filter(vehicle__user_profile=self.request.user.userprofile)

    def perform_create(self, serializer):
        vehicle_id = self.request.data.get('vehicleId')
        if not vehicle_id:
            raise PermissionDenied('vehicleId الزامی است.')
        vehicle = Vehicle.objects.filter(pk=vehicle_id, user_profile=self.request.user.userprofile).first()
        if not vehicle:
            raise PermissionDenied('خودرو یافت نشد یا دسترسی ندارید.')
        serializer.save(vehicle=vehicle)


class ServiceTypeViewSet(ApiResponseMixin, viewsets.ReadOnlyModelViewSet):
    """انواع سرویس (فقط خواندنی) برای فرانت در حالت Django."""
    queryset = ServiceType.objects.filter(is_active=True).order_by('group_name', 'code')
    serializer_class = ServiceTypeSerializer
    permission_classes = [IsAuthenticated]


class ExpenseCategoryViewSet(ApiResponseMixin, viewsets.ReadOnlyModelViewSet):
    """دسته‌بندی هزینه (فقط خواندنی) برای فرانت در حالت Django."""
    queryset = ExpenseCategory.objects.filter(is_active=True).order_by('group_name', 'code')
    serializer_class = ExpenseCategorySerializer
    permission_classes = [IsAuthenticated]


class ReminderSettingViewSet(ApiResponseMixin, viewsets.ModelViewSet):
    queryset = ReminderSetting.objects.all()
    serializer_class = ReminderSettingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ReminderSetting.objects.filter(vehicle__user_profile=self.request.user.userprofile)


class ReminderViewSet(ApiResponseMixin, viewsets.ModelViewSet):
    queryset = Reminder.objects.all()
    serializer_class = ReminderApiSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Reminder.objects.filter(user_profile=self.request.user.userprofile)

    def perform_create(self, serializer):
        serializer.save(user_profile=self.request.user.userprofile)

    @action(detail=True, methods=['post'], url_path='dismiss')
    def dismiss(self, request, pk=None):
        reminder = self.get_object()
        reminder.dismissed = True
        reminder.save(update_fields=['dismissed', 'updated_at'])
        return api_response({'status': 'dismissed'})

    @action(detail=False, methods=['get'], url_path='vehicle/(?P<vehicle_id>[^/.]+)')
    def by_vehicle(self, request, vehicle_id=None):
        vehicle = Vehicle.objects.filter(
            vehicle_id=vehicle_id,
            user_profile=request.user.userprofile
        ).first()
        if not vehicle:
            return api_response([])
        reminders = Reminder.objects.filter(
            user_profile=request.user.userprofile,
            vehicle=vehicle
        ).order_by('-created_at')
        serializer = self.get_serializer(reminders, many=True)
        return api_response(serializer.data)

    @action(detail=False, methods=['get'], url_path='user')
    def user_list(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return api_response(serializer.data)


class NotificationViewSet(ApiResponseMixin, viewsets.ReadOnlyModelViewSet):
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


class TelegramSettingViewSet(ApiResponseMixin, viewsets.ModelViewSet):
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


class ReportSummaryView(APIView):
    """خلاصه گزارش سرویس و هزینه برای فرانت (Django)."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = request.user.userprofile
        vehicle_id = request.query_params.get('vehicle_id') or request.query_params.get('vehicleId')
        vehicles = Vehicle.objects.filter(user_profile=profile)
        if vehicle_id:
            vehicles = vehicles.filter(vehicle_id=vehicle_id)
        if not vehicles.exists():
            return api_response({
                'totalServiceCost': 0,
                'totalExpenses': 0,
                'totalCost': 0,
                'serviceCount': 0,
                'expenseCount': 0,
                'costByCategory': {},
                'costByMonth': [],
            })
        vehicle_ids = list(vehicles.values_list('vehicle_id', flat=True))
        services = Service.objects.filter(vehicle_id__in=vehicle_ids)
        expenses = DailyExpense.objects.filter(vehicle_id__in=vehicle_ids)
        total_service_cost = services.aggregate(s=Sum('total_cost'))['s'] or 0
        total_expenses = expenses.aggregate(s=Sum('amount'))['s'] or 0
        cost_by_category = {}
        services_prefetch = Service.objects.filter(vehicle_id__in=vehicle_ids).prefetch_related('serviceitem_set')
        for s in services_prefetch:
            items = list(s.serviceitem_set.all())
            types = [it.service_type_code_id for it in items]
            key = f"service_{types[0]}" if types else 'service_other'
            cost_by_category[key] = cost_by_category.get(key, 0) + (s.total_cost or 0)
        for e in expenses:
            key = e.category_code or 'other'
            cost_by_category[key] = cost_by_category.get(key, 0) + e.amount
        month_agg = list(
            Service.objects.filter(vehicle_id__in=vehicle_ids)
            .annotate(month=TruncMonth('service_date_gregorian'))
            .values('month')
            .annotate(amount=Sum('total_cost'))
            .order_by('-month')[:12]
        )
        expense_month = list(
            DailyExpense.objects.filter(vehicle_id__in=vehicle_ids)
            .annotate(month=TruncMonth('expense_date_gregorian'))
            .values('month')
            .annotate(amount=Sum('amount'))
            .order_by('-month')[:12]
        )
        by_month = defaultdict(int)
        for r in month_agg:
            key = r['month'].strftime('%Y-%m') if r['month'] else ''
            if key:
                by_month[key] += r['amount'] or 0
        for r in expense_month:
            key = r['month'].strftime('%Y-%m') if r['month'] else ''
            if key:
                by_month[key] += r['amount'] or 0
        cost_by_month = [{'month': k, 'amount': v} for k, v in sorted(by_month.items(), reverse=True)[:12]]
        return api_response({
            'totalServiceCost': total_service_cost,
            'totalExpenses': total_expenses,
            'totalCost': total_service_cost + total_expenses,
            'serviceCount': services.count(),
            'expenseCount': expenses.count(),
            'costByCategory': cost_by_category,
            'costByMonth': cost_by_month,
        })


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
