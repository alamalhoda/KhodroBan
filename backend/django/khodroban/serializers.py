# khodroban/serializers.py
from rest_framework import serializers
from .models import (
    SubscriptionPlan, UserProfile, UserSubscription,
    Vehicle, Service, ServiceItem, ServiceType,
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


class ServiceTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceType
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


class MyTokenObtainPairSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(style={'input_type': 'password'}, trim_whitespace=False)

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if username and password:
            user = authenticate(
                request=self.context.get('request'),
                username=username,
                password=password
            )
            if not user:
                raise serializers.ValidationError(
                    'نام کاربری یا رمز عبور اشتباه است.',
                    code='authorization'
                )
        else:
            raise serializers.ValidationError(
                'نام کاربری و رمز عبور الزامی است.',
                code='authorization'
            )
        attrs['user'] = user
        return attrs


class TokenObtainPairResponseSerializer(serializers.Serializer):
    access = serializers.CharField()
    refresh = serializers.CharField()
