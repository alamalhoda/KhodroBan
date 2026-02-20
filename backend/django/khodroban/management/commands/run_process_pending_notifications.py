# khodroban/management/commands/run_process_pending_notifications.py
"""
دستور مدیریت برای پردازش نوتیفیکیشن‌های pending (ارسال از طریق کانال‌ها).

برای استفاده با crontab در حالت All-in-One:
    python manage.py run_process_pending_notifications

مثال crontab: */50 * * * * (هر ۵۰ دقیقه)
"""
from django.core.management.base import BaseCommand

from notifications.dispatcher import process_pending_notifications


class Command(BaseCommand):
    help = "پردازش نوتیفیکیشن‌های در انتظار ارسال (telegram, email, sms, push)"

    def add_arguments(self, parser):
        parser.add_argument(
            "--limit",
            type=int,
            default=100,
            help="حداکثر تعداد نوتیفیکیشن پردازش‌شده",
        )

    def handle(self, *args, **options):
        limit = options["limit"]
        result = process_pending_notifications(limit=limit)
        self.stdout.write(
            self.style.SUCCESS(
                f"پردازش شد: {result['processed']} | موفق: {result['success']} | ناموفق: {result['failed']}"
            )
        )
