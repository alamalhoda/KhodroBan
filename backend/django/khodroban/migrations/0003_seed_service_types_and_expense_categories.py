# Generated manually for add-service Django complete.
# Seed service_types and expense_categories from Supabase 005 (single source: seed_data).
# از مدل تاریخی (apps) استفاده می‌کنیم تا با schema همان migration سازگار باشد.

from django.db import migrations


def seed_service_types_and_expense_categories(apps, schema_editor):
    """درج انواع سرویس و دسته‌بندی هزینه‌ها مطابق seed_data (Supabase 005)."""
    from khodroban.seed_data import SERVICE_TYPES_SEED, EXPENSE_CATEGORIES_SEED

    ServiceType = apps.get_model("khodroban", "ServiceType")
    ExpenseCategory = apps.get_model("khodroban", "ExpenseCategory")

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


def noop(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("khodroban", "0002_add_expense_category"),
    ]

    operations = [
        migrations.RunPython(seed_service_types_and_expense_categories, noop),
    ]
