# notifications/management/commands/run_process_outbox.py
"""
دستور مدیریت برای اجرای process_outbox (خواندن Outbox و ایجاد Notification).

برای استفاده با crontab در حالت All-in-One:
    python manage.py run_process_outbox

مثال crontab: */5 * * * * (هر ۵ دقیقه)
"""
from django.core.management.base import BaseCommand

from notifications.huey_tasks import process_outbox


class Command(BaseCommand):
    help = "خواندن رویدادهای Outbox و ایجاد Notification"

    def handle(self, *args, **options):
        process_outbox()
        self.stdout.write(self.style.SUCCESS("process_outbox اجرا شد"))
