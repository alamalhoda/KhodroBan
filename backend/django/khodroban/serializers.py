# khodroban/serializers.py
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer as JWTTokenObtainPairSerializer
from .models import (
    SubscriptionPlan, UserProfile, UserSubscription,
    Vehicle, Service, ServiceItem, ServiceType, ExpenseCategory,
    DailyExpense, ReminderSetting, Reminder,
    Notification, TelegramSetting, VehicleKmHistory,
)
from django.contrib.auth.models import User
from django.contrib.auth import authenticate


class UserProfileMinimalSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ['id', 'email', 'first_name', 'last_name', 'tier']
        read_only_fields = fields

    def get_id(self, obj):
        return obj.pk


class SubscriptionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPlan
        fields = [
            'plan_id', 'plan_code', 'plan_name', 'max_vehicles',
            'allow_csv_export', 'allow_pdf_export', 'allow_sms_reminder',
            'monthly_price', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['plan_id', 'created_at', 'updated_at']


class UserSubscriptionSerializer(serializers.ModelSerializer):
    plan = SubscriptionPlanSerializer(read_only=True)
    user_profile = UserProfileMinimalSerializer(read_only=True)

    class Meta:
        model = UserSubscription
        fields = [
            'subscription_id', 'user_profile', 'plan',
            'start_date', 'end_date', 'is_active', 'auto_renew',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['subscription_id', 'created_at', 'updated_at']


class VehicleMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = ['vehicle_id', 'model', 'plate_number', 'year', 'current_km']
        read_only_fields = fields


class VehicleSerializer(serializers.ModelSerializer):
    user_profile = UserProfileMinimalSerializer(read_only=True)

    class Meta:
        model = Vehicle
        fields = [
            'vehicle_id', 'user_profile', 'model', 'year',
            'plate_number', 'current_km', 'description',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['vehicle_id', 'user_profile', 'created_at', 'updated_at']

    def validate_year(self, value):
        if value < 1300 or value > 1500:
            raise serializers.ValidationError("سال باید بین ۱۳۰۰ تا ۱۵۰۰ باشد")
        return value

    def validate_current_km(self, value):
        if value < 0:
            raise serializers.ValidationError("کیلومتر فعلی نمی‌تواند منفی باشد")
        return value


# ---------- خروجی مطابق فرانت (camelCase + نام فیلدهای فرانت) ----------

class VehicleApiSerializer(VehicleSerializer):
    """خروجی: id, userId, plateNumber, currentKm, note, createdAt, updatedAt"""

    def to_representation(self, instance):
        return {
            'id': str(instance.vehicle_id),
            'userId': str(instance.user_profile_id),
            'model': instance.model,
            'year': instance.year,
            'plateNumber': instance.plate_number,
            'currentKm': instance.current_km,
            'note': instance.description or '',
            'createdAt': instance.created_at.isoformat() if instance.created_at else None,
            'updatedAt': instance.updated_at.isoformat() if instance.updated_at else None,
        }

    def to_internal_value(self, data):
        # فرانت camelCase می‌فرستد؛ فقط فیلدهای مدل را به parent بفرست
        key_map = [
            ('model', 'model'), ('year', 'year'),
            ('plate_number', 'plateNumber'), ('current_km', 'currentKm'), ('description', 'note'),
        ]
        internal = {}
        for snake, camel in key_map:
            if camel in data or snake in data:
                internal[snake] = data.get(camel) or data.get(snake)
        return super().to_internal_value(internal)


class ServiceTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceType
        fields = ['code', 'name', 'group_name', 'icon', 'is_active']
        read_only_fields = ['code']


class ExpenseCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpenseCategory
        fields = ['code', 'name', 'group_name', 'icon', 'is_active']
        read_only_fields = ['code']


class ServiceItemSerializer(serializers.ModelSerializer):
    service_type = ServiceTypeSerializer(source='service_type_code', read_only=True)

    class Meta:
        model = ServiceItem
        fields = [
            'service_item_id', 'service_type', 'cost', 'description', 'created_at'
        ]
        read_only_fields = ['service_item_id', 'created_at']

    def validate_cost(self, value):
        if value < 0:
            raise serializers.ValidationError("هزینه نمی‌تواند منفی باشد")
        return value


class ServiceSerializer(serializers.ModelSerializer):
    vehicle = VehicleMinimalSerializer(read_only=True)
    items = ServiceItemSerializer(many=True, read_only=True, source='serviceitem_set')

    class Meta:
        model = Service
        fields = [
            'service_id', 'vehicle', 'service_date', 'service_date_gregorian',
            'service_km', 'total_cost', 'general_note', 'description',
            'items', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'service_id', 'vehicle', 'created_at', 'updated_at', 'total_cost'
        ]

    def validate(self, data):
        if data.get('service_km', 0) < 0:
            raise serializers.ValidationError({"service_km": "کیلومتر سرویس نمی‌تواند منفی باشد"})
        if data.get('total_cost', 0) < 0:
            raise serializers.ValidationError({"total_cost": "هزینه کل نمی‌تواند منفی باشد"})
        return data


class ServiceApiSerializer(ServiceSerializer):
    """خروجی فرانت: id, vehicleId, date, km, cost, type, types, items, note, createdAt, updatedAt"""

    def to_representation(self, instance):
        items = list(instance.serviceitem_set.select_related('service_type_code').all())
        types = [item.service_type_code.code for item in items] if items else []
        primary_type = types[0] if types else 'other'
        items_data = [
            {'type': item.service_type_code.code, 'cost': item.cost, 'description': item.description}
            for item in items
        ]
        return {
            'id': str(instance.service_id),
            'vehicleId': str(instance.vehicle_id),
            'date': instance.service_date.isoformat() if instance.service_date else None,
            'km': instance.service_km,
            'cost': instance.total_cost,
            'type': primary_type,
            'types': types,
            'items': items_data,
            'note': instance.general_note or instance.description or '',
            'createdAt': instance.created_at.isoformat() if instance.created_at else None,
            'updatedAt': instance.updated_at.isoformat() if instance.updated_at else None,
        }

    def to_internal_value(self, data):
        # vehicle از request در perform_create ست می‌شود
        key_map = [
            ('service_date', 'date'), ('service_km', 'km'), ('total_cost', 'cost'),
            ('general_note', 'note'), ('description', 'note'),
        ]
        internal = {}
        for snake, camel in key_map:
            if camel in data or snake in data:
                internal[snake] = data.get(camel) or data.get(snake)
        if 'date' in data and 'service_date' not in internal:
            internal['service_date'] = data['date']
        if 'date' in data:
            internal['service_date_gregorian'] = data['date']  # همان تاریخ برای گرگوری
        return super().to_internal_value(internal)


class DailyExpenseSerializer(serializers.ModelSerializer):
    vehicle = VehicleMinimalSerializer(read_only=True)

    class Meta:
        model = DailyExpense
        fields = [
            'expense_id', 'vehicle', 'expense_date', 'expense_date_gregorian',
            'amount', 'category_code', 'km_at_expense', 'description',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['expense_id', 'vehicle', 'created_at', 'updated_at']

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("مبلغ باید مثبت باشد")
        return value


class DailyExpenseApiSerializer(DailyExpenseSerializer):
    """خروجی فرانت: id, vehicleId, date, amount, category, km, note, createdAt, updatedAt"""

    def to_representation(self, instance):
        return {
            'id': str(instance.expense_id),
            'vehicleId': str(instance.vehicle_id),
            'date': instance.expense_date.isoformat() if instance.expense_date else None,
            'amount': instance.amount,
            'category': instance.category_code or 'other',
            'km': getattr(instance, 'km_at_expense', None),
            'note': instance.description or '',
            'createdAt': instance.created_at.isoformat() if instance.created_at else None,
            'updatedAt': instance.updated_at.isoformat() if instance.updated_at else None,
        }

    def to_internal_value(self, data):
        key_map = [
            ('vehicle_id', 'vehicleId'), ('expense_date', 'date'), ('amount', 'amount'),
            ('category_code', 'category'), ('km_at_expense', 'km'), ('description', 'note'),
        ]
        internal = {}
        for snake, camel in key_map:
            if camel in data or snake in data:
                internal[snake] = data.get(camel) or data.get(snake)
        if 'date' in data and 'expense_date' not in internal:
            internal['expense_date'] = data['date']
        if 'date' in data:
            internal['expense_date_gregorian'] = data['date']
        return super().to_internal_value(internal)


class ReminderSettingSerializer(serializers.ModelSerializer):
    vehicle = VehicleMinimalSerializer(read_only=True)

    class Meta:
        model = ReminderSetting
        fields = [
            'reminder_setting_id', 'vehicle', 'interval_km', 'interval_days',
            'warning_km_before', 'warning_days_before', 'reminder_mode',
            'is_enabled', 'created_at', 'updated_at'
        ]
        read_only_fields = ['reminder_setting_id', 'vehicle', 'created_at', 'updated_at']


class ReminderSerializer(serializers.ModelSerializer):
    user_profile = UserProfileMinimalSerializer(read_only=True)
    vehicle = VehicleMinimalSerializer(read_only=True)

    class Meta:
        model = Reminder
        fields = [
            'id', 'user_profile', 'vehicle', 'title', 'description',
            'due_date', 'due_km', 'warning_days_before', 'warning_km_before',
            'status', 'message', 'source', 'dismissed', 'type',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'user_profile', 'status', 'message',
            'created_at', 'updated_at'
        ]


class ReminderApiSerializer(ReminderSerializer):
    """خروجی فرانت: id, userId, vehicleId, vehicleName, dueDate, dueKm, warningDaysBefore, ..."""

    def to_representation(self, instance):
        vehicle = instance.vehicle
        return {
            'id': str(instance.id),
            'userId': str(instance.user_profile_id),
            'vehicleId': str(instance.vehicle_id) if instance.vehicle_id else None,
            'vehicleName': vehicle.model if vehicle else None,
            'title': instance.title,
            'description': instance.description or '',
            'dueDate': instance.due_date.isoformat() if instance.due_date else None,
            'dueKm': instance.due_km,
            'warningDaysBefore': instance.warning_days_before,
            'status': instance.status or 'ok',
            'message': instance.message or instance.title,
            'source': instance.source or 'manual',
            'dismissed': instance.dismissed,
            'createdAt': instance.created_at.isoformat() if instance.created_at else None,
            'updatedAt': instance.updated_at.isoformat() if instance.updated_at else None,
        }

    def to_internal_value(self, data):
        key_map = [
            ('vehicle_id', 'vehicleId'), ('title', 'title'), ('description', 'description'),
            ('due_date', 'dueDate'), ('due_km', 'dueKm'), ('warning_days_before', 'warningDaysBefore'),
            ('source', 'source'), ('type', 'type'),
        ]
        internal = {}
        for snake, camel in key_map:
            if camel in data or snake in data:
                internal[snake] = data.get(camel) or data.get(snake)
        return super().to_internal_value(internal)


class NotificationSerializer(serializers.ModelSerializer):
    user_profile = UserProfileMinimalSerializer(read_only=True)
    vehicle = VehicleMinimalSerializer(read_only=True)

    class Meta:
        model = Notification
        fields = [
            'id', 'user_profile', 'vehicle', 'title', 'body', 'type',
            'read', 'metadata', 'notification_channels', 'sent_at',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'user_profile', 'created_at', 'updated_at',
            'notification_channels', 'sent_at'
        ]


class TelegramSettingSerializer(serializers.ModelSerializer):
    user_profile = UserProfileMinimalSerializer(read_only=True)

    class Meta:
        model = TelegramSetting
        fields = [
            'id', 'user_profile', 'chat_id', 'connection_code',
            'is_enabled', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'user_profile', 'created_at', 'updated_at', 'connection_code'
        ]


class VehicleKmHistorySerializer(serializers.ModelSerializer):
    vehicle = VehicleMinimalSerializer(read_only=True)

    class Meta:
        model = VehicleKmHistory
        fields = [
            'id', 'vehicle', 'km', 'recorded_at', 'source_type',
            'source_id', 'note', 'created_at'
        ]
        read_only_fields = ['id', 'vehicle', 'created_at']

    def validate_km(self, value):
        if value < 0:
            raise serializers.ValidationError("کیلومتر نمی‌تواند منفی باشد")
        return value


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True, label="تکرار رمز عبور")
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'first_name', 'last_name']
        extra_kwargs = {
            'username': {'required': True},
            'email': {'required': True},
        }

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "رمز عبور و تکرار آن یکسان نیستند"})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user


class MyTokenObtainPairSerializer(JWTTokenObtainPairSerializer):
    # فرانت‌اند ایمیل یا نام کاربری را در فیلد username می‌فرستد
    default_error_messages = {
        'no_active_account': 'نام کاربری/ایمیل یا رمز عبور اشتباه است.',
    }

    def validate(self, attrs):
        login_value = (attrs.get('username') or '').strip()
        if not login_value:
            raise serializers.ValidationError(
                {'username': 'نام کاربری/ایمیل الزامی است.'},
                code='authorization'
            )
        # اگر مقدار وارد شده ایمیل است، کاربر را با ایمیل پیدا کن و username واقعی را بگذار
        if '@' in login_value:
            user_by_email = User.objects.filter(email__iexact=login_value).first()
            if user_by_email:
                attrs = dict(attrs)
                attrs['username'] = user_by_email.username
        return super().validate(attrs)


class TokenObtainPairResponseSerializer(serializers.Serializer):
    access = serializers.CharField()
    refresh = serializers.CharField()
