# khodroban/management/commands/load_sample_data.py
"""
دستور مدیریت برای بارگذاری داده‌های نمونه در دیتابیس جنگو.

اجرا:
    python manage.py load_sample_data

برای استفاده در تست‌ها: از ماژول khodroban.sample_data استفاده کنید تا داده‌های
همان ساختار را در setUp ایجاد کنید؛ تست‌ها بهتر است روی دیتابیس ایزوله و دادهٔ
ساخته‌شده در همان تست اجرا شوند، نه روی همین دادهٔ نمایشی.
"""

from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta

from khodroban.models import (
    SubscriptionPlan,
    ServiceType,
    UserProfile,
    Vehicle,
    Service,
    ServiceItem,
    DailyExpense,
    ReminderSetting,
    Reminder,
    Notification,
    TelegramSetting,
    VehicleKmHistory,
)
from khodroban.sample_data import (
    SAMPLE_PLANS,
    SAMPLE_SERVICE_TYPES,
    ensure_plans,
    ensure_service_types,
    ensure_expense_categories,
)

SAMPLE_USERNAME = "sample_user"
SAMPLE_EMAIL = "sample@khodroban.local"
SAMPLE_PASSWORD = "sample123"


def ensure_sample_user():
    user, created = User.objects.get_or_create(
        username=SAMPLE_USERNAME,
        defaults={
            "email": SAMPLE_EMAIL,
            "first_name": "کاربر",
            "last_name": "نمونه",
            "is_staff": False,
            "is_active": True,
        },
    )
    # همیشه رمز را ست کن تا بعد از هر بار اجرای دستور، sample_user/sample123 کار کند
    user.set_password(SAMPLE_PASSWORD)
    user.is_active = True
    user.save(update_fields=["password", "is_active"])
    return user


class Command(BaseCommand):
    help = "بارگذاری داده‌های نمونه برای نمایش و تست دستی (خودرو، سرویس، هزینه، یادآور و ...)"

    def add_arguments(self, parser):
        parser.add_argument(
            "--force",
            action="store_true",
            help="حتی اگر دادهٔ نمونه وجود داشت، خودروها و سرویس‌ها را دوباره اضافه نکن (پیش‌فرض: فقط در نبود خودرو اضافه می‌کند)",
        )

    def handle(self, *args, **options):
        force = options["force"]
        self.stdout.write("در حال بارگذاری داده‌های نمونه...")

        ensure_plans()
        self.stdout.write(self.style.SUCCESS("  طرح‌های اشتراک ایجاد/بروز شدند."))

        ensure_service_types()
        self.stdout.write(self.style.SUCCESS("  انواع سرویس ایجاد/بروز شدند."))

        ensure_expense_categories()
        self.stdout.write(self.style.SUCCESS("  دسته‌بندی هزینه‌ها ایجاد/بروز شدند."))

        user = ensure_sample_user()
        profile = UserProfile.objects.get(user=user)
        if not profile.email:
            profile.email = SAMPLE_EMAIL
            profile.first_name = "کاربر"
            profile.last_name = "نمونه"
            profile.save(update_fields=["email", "first_name", "last_name"])

        self.stdout.write(self.style.SUCCESS("  کاربر نمونه: %s / %s" % (SAMPLE_USERNAME, SAMPLE_PASSWORD)))

        vehicles = list(Vehicle.objects.filter(user_profile=profile))
        if not vehicles or force:
            if force and vehicles:
                for v in vehicles:
                    v.delete()
            vehicles = self._create_vehicles_and_related(profile)
            self.stdout.write(self.style.SUCCESS("  خودروها و سرویس‌ها و هزینه‌ها ایجاد شدند."))
        else:
            self.stdout.write("  خودروهای نمونه از قبل وجود دارند. برای ایجاد مجدد از --force استفاده کنید.")

        self._create_reminders_notifications(profile, vehicles)
        self.stdout.write(self.style.SUCCESS("  یادآورها و اعلان‌ها ایجاد شدند."))

        if not TelegramSetting.objects.filter(user_profile=profile).exists():
            TelegramSetting.objects.create(
                user_profile=profile,
                connection_code="SAMPLE_TG_001",
                is_enabled=True,
            )
            self.stdout.write(self.style.SUCCESS("  تنظیمات تلگرام نمونه ایجاد شد."))

        self.stdout.write(self.style.SUCCESS("بارگذاری داده‌های نمونه انجام شد."))

    def _create_vehicles_and_related(self, profile):
        v1, _ = Vehicle.objects.get_or_create(
            user_profile=profile,
            plate_number="22ب123۴۵",
            defaults={
                "model": "پژو 206",
                "year": 1398,
                "current_km": 95000,
                "description": "خودرو نمونه اول",
            },
        )
        v2, _ = Vehicle.objects.get_or_create(
            user_profile=profile,
            plate_number="11الف۱۱۱۱۱",
            defaults={
                "model": "سمند LX",
                "year": 1400,
                "current_km": 62000,
                "description": "خودرو نمونه دوم",
            },
        )
        vehicles = [v1, v2]

        # تاریخ شمسی تقریبی برای سرویس/هزینه
        today = timezone.now().date()
        service_date_gregorian = today - timedelta(days=30)
        service_date_jalali = service_date_gregorian  # در مدل هر دو ذخیره می‌شوند؛ برای نمونه یکی‌اند

        # سرویس برای خودرو اول
        service1, created = Service.objects.get_or_create(
            vehicle=v1,
            service_date=service_date_gregorian,
            service_km=92000,
            defaults={
                "service_date_gregorian": service_date_gregorian,
                "total_cost": 850000,
                "general_note": "سرویس دوره‌ای نمونه",
            },
        )
        if created:
            st_oil = ServiceType.objects.get(code="oil_change")
            st_filter = ServiceType.objects.get(code="filter")
            ServiceItem.objects.create(service=service1, service_type_code=st_oil, cost=500000, description="روغن ۵W30")
            ServiceItem.objects.create(service=service1, service_type_code=st_filter, cost=350000, description="فیلتر روغن اصل")

            VehicleKmHistory.objects.create(
                vehicle=v1,
                km=92000,
                source_type="service",
                source_id=service1.service_id,
                note="سرویس دوره‌ای",
            )

        # هزینه روزانه برای خودرو اول
        exp_date = today - timedelta(days=5)
        DailyExpense.objects.get_or_create(
            vehicle=v1,
            expense_date=exp_date,
            amount=200000,
            defaults={
                "expense_date_gregorian": exp_date,
                "category_code": "fuel",
                "km_at_expense": 94800,
                "description": "باک بنزین نمونه",
            },
        )

        # ReminderSetting برای هر خودرو
        for v in vehicles:
            ReminderSetting.objects.get_or_create(
                vehicle=v,
                defaults={
                    "interval_km": 5000,
                    "interval_days": 90,
                    "reminder_mode": "both",
                    "is_enabled": True,
                },
            )

        return vehicles

    def _create_reminders_notifications(self, profile, vehicles):
        if not vehicles:
            return
        v = vehicles[0]
        due_future = timezone.now() + timedelta(days=14)
        Reminder.objects.get_or_create(
            user_profile=profile,
            vehicle=v,
            title="تعویض روغن بعدی",
            defaults={
                "due_date": due_future,
                "due_km": 100000,
                "warning_km_before": 500,
                "warning_days_before": 7,
                "source": "manual",
            },
        )
        Notification.objects.get_or_create(
            user_profile=profile,
            title="خوش آمدید به خودروبان",
            defaults={
                "body": "داده‌های نمونه بارگذاری شده‌اند.",
                "type": "info",
                "read": False,
            },
        )
