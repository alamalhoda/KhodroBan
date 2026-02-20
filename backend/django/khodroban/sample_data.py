# khodroban/sample_data.py
"""
داده‌های مرجع نمونه برای استفاده در تست‌ها و دستور load_sample_data.

در تست‌ها ترجیحاً هر تست در setUp خودش دادهٔ موردنیاز را بسازد (ایزوله بودن).
اگر بخواهید همان ساختار دادهٔ نمایشی را در تست داشته باشید، می‌توانید از
این ماژول استفاده کنید؛ مثلاً:

    from khodroban.sample_data import SAMPLE_SERVICE_TYPES, make_sample_user_and_vehicle

    def setUp(self):
        self.user, self.profile, self.vehicle = make_sample_user_and_vehicle()
"""

from django.contrib.auth.models import User
from khodroban.models import (
    SubscriptionPlan,
    ServiceType,
    ExpenseCategory,
    UserProfile,
    Vehicle,
)
from khodroban.seed_data import SERVICE_TYPES_SEED, EXPENSE_CATEGORIES_SEED


SAMPLE_PLANS = [
    {"plan_code": "free", "plan_name": "رایگان", "max_vehicles": 1, "monthly_price": 0},
    {"plan_code": "pro", "plan_name": "حرفه‌ای", "max_vehicles": 3, "monthly_price": 99000},
    {"plan_code": "pro+", "plan_name": "حرفه‌ای پلاس", "max_vehicles": None, "monthly_price": 199000},
]

# برای سازگاری با تست‌های قدیمی؛ منبع حقیقت: seed_data.SERVICE_TYPES_SEED
SAMPLE_SERVICE_TYPES = SERVICE_TYPES_SEED


def ensure_plans():
    """طرح‌های اشتراک نمونه را در دیتابیس ایجاد می‌کند (get_or_create)."""
    for p in SAMPLE_PLANS:
        SubscriptionPlan.objects.get_or_create(
            plan_code=p["plan_code"],
            defaults={
                "plan_name": p["plan_name"],
                "max_vehicles": p.get("max_vehicles"),
                "monthly_price": p.get("monthly_price") or 0,
                "allow_csv_export": True,
                "allow_pdf_export": p["plan_code"] != "free",
                "allow_sms_reminder": p["plan_code"] != "free",
                "is_active": True,
            },
        )


def ensure_service_types():
    """انواع سرویس را مطابق seed_data (Supabase 005) در دیتابیس ایجاد می‌کند (get_or_create)."""
    for s in SERVICE_TYPES_SEED:
        ServiceType.objects.get_or_create(
            code=s["code"],
            defaults={
                "name": s["name"],
                "group_name": s["group_name"],
                "icon": s["icon"],
                "is_active": s.get("is_active", True),
            },
        )


def ensure_expense_categories():
    """دسته‌بندی هزینه‌ها را مطابق seed_data (Supabase 005) در دیتابیس ایجاد می‌کند (get_or_create)."""
    for c in EXPENSE_CATEGORIES_SEED:
        ExpenseCategory.objects.get_or_create(
            code=c["code"],
            defaults={
                "name": c["name"],
                "group_name": c["group_name"],
                "icon": c["icon"],
                "is_active": c.get("is_active", True),
            },
        )


def make_sample_user_and_vehicle(username="test_sample", email="test_sample@test.com", password="testpass"):
    """
    یک کاربر، پروفایل و یک خودرو با دادهٔ نمونه می‌سازد.
    برای استفاده در تست‌ها؛ طرح free و نوع سرویس‌ها باید از قبل وجود داشته باشند
    (مثلاً با ensure_plans و ensure_service_types یا load_sample_data).

    Returns:
        tuple: (user, user_profile, vehicle)
    """
    ensure_plans()
    ensure_service_types()
    user = User.objects.create_user(username=username, password=password, email=email)
    profile = UserProfile.objects.get(user=user)
    vehicle = Vehicle.objects.create(
        user_profile=profile,
        model="پژو 206",
        year=1398,
        plate_number="22ب123۴۵",
        current_km=95000,
        description="خودرو تست",
    )
    return user, profile, vehicle
