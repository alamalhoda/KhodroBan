# reminders/management/commands/run_check_reminders.py
"""
دستور مدیریت برای اجرای check_reminders (بررسی یادآوری‌ها و emit به Outbox).

برای استفاده با crontab در حالت All-in-One:
    python manage.py run_check_reminders

مثال crontab: 0 9 * * * (هر روز ۹ صبح)
"""
from django.core.management.base import BaseCommand

from reminders.huey_tasks import check_reminders


class Command(BaseCommand):
    help = "بررسی یادآوری‌های موعد گذشته و emit رویداد به Outbox"

    def handle(self, *args, **options):
        check_reminders()
        self.stdout.write(self.style.SUCCESS("check_reminders اجرا شد"))
