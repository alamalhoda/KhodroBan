# Generated manually for add-service Django complete.
# Seed service_types and expense_categories from Supabase 005 (single source: seed_data).

from django.db import migrations


def seed_service_types_and_expense_categories(apps, schema_editor):
    """درج انواع سرویس و دسته‌بندی هزینه‌ها مطابق seed_data (Supabase 005)."""
    from khodroban.sample_data import ensure_service_types, ensure_expense_categories

    ensure_service_types()
    ensure_expense_categories()


def noop(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("khodroban", "0002_add_expense_category"),
    ]

    operations = [
        migrations.RunPython(seed_service_types_and_expense_categories, noop),
    ]
