# Django Management Commands

مستند مرجع دستورات مدیریتی (management commands) پروژه KhodroBan.

---

## پیش‌نیازها

برای اجرای دستورات، محیط مجازی و دیتابیس باید آماده باشند:

```bash
source backend/django/venv/bin/activate
cd backend/django
```

---

## فهرست دستورات

| دستور | اپ | توضیح کوتاه |
|-------|-----|--------------|
| `run_check_reminders` | reminders | بررسی یادآوری‌های موعد گذشته و emit به Outbox |
| `run_process_outbox` | notifications | خواندن Outbox و ایجاد Notification |
| `run_process_pending_notifications` | khodroban | ارسال نوتیفیکیشن‌های pending از طریق کانال‌ها |
| `load_sample_data` | khodroban | بارگذاری داده‌های نمونه برای نمایش و تست دستی |

---

## توضیح هر دستور

### `run_check_reminders`

**هدف:** بررسی یادآوری‌های موعد گذشته و emit رویداد به Outbox.

**مسیر کد:** `reminders/management/commands/run_check_reminders.py`

**اجرا:**
```bash
python manage.py run_check_reminders
```

**آرگومان‌ها:** ندارد.

**زمان‌بندی پیشنهادی (crontab):** هر روز ساعت ۹ صبح  
مثال: `0 9 * * *`

**جریان:** پس از بررسی ReminderSetting و آخرین سرویس هر خودرو، رویدادها به Outbox نوشته می‌شوند و توسط `run_process_outbox` پردازش می‌شوند.

---

### `run_process_outbox`

**هدف:** خواندن رویدادهای Outbox و ایجاد Notification در جدول نوتیفیکیشن‌ها.

**مسیر کد:** `notifications/management/commands/run_process_outbox.py`

**اجرا:**
```bash
python manage.py run_process_outbox
```

**آرگومان‌ها:** ندارد.

**زمان‌بندی پیشنهادی (crontab):** هر ۵ دقیقه  
مثال: `*/5 * * * *`

**جریان:** رویدادهای Outbox را consume می‌کند و رکوردهای Notification با وضعیت pending ایجاد می‌کند. ارسال واقعی (Telegram، Email، SMS، Push) توسط `run_process_pending_notifications` انجام می‌شود.

---

### `run_process_pending_notifications`

**هدف:** پردازش نوتیفیکیشن‌های در انتظار ارسال از طریق کانال‌ها (Telegram، Email، SMS، Push).

**مسیر کد:** `khodroban/management/commands/run_process_pending_notifications.py`

**اجرا:**
```bash
python manage.py run_process_pending_notifications
python manage.py run_process_pending_notifications --limit 200
```

**آرگومان‌ها:**

| آرگومان | نوع | پیش‌فرض | توضیح |
|---------|-----|---------|-------|
| `--limit` | int | 100 | حداکثر تعداد نوتیفیکیشن‌ای که در هر اجرا پردازش می‌شوند |

**زمان‌بندی پیشنهادی (crontab):** هر ۵۰ دقیقه  
مثال: `*/50 * * * *`

---

### `load_sample_data`

**هدف:** بارگذاری داده‌های نمونه برای نمایش و تست دستی (خودرو، سرویس، هزینه، یادآور، نوتیفیکیشن، تنظیمات تلگرام).

**مسیر کد:** `khodroban/management/commands/load_sample_data.py`

**اجرا:**
```bash
python manage.py load_sample_data
python manage.py load_sample_data --force
```

**آرگومان‌ها:**

| آرگومان | نوع | پیش‌فرض | توضیح |
|---------|-----|---------|-------|
| `--force` | flag | False | حتی در صورت وجود دادهٔ نمونه، خودروها و سرویس‌ها را دوباره بساز |

**کاربر نمونه ایجاد شده:**
- نام کاربری: `sample_user`
- رمز عبور: `sample123`
- ایمیل: `sample@khodroban.local`

**نکته:** برای تست‌های خودکار از ماژول `khodroban.sample_data` استفاده کنید تا داده‌ها در setUp هر تست ساخته شوند؛ تست‌ها بهتر است روی دیتابیس ایزوله اجرا شوند نه روی همین دادهٔ نمایشی.

---

## جریان یادآوری و نوتیفیکیشن

```
run_check_reminders  →  Outbox (جدول رویدادها)
                              ↓
run_process_outbox   →  Notification (pending)
                              ↓
run_process_pending_notifications  →  ارسال واقعی (Telegram, Email, ...)
```

ترتیب اجرای crontab در All-in-One مهم است؛ معمولاً هر سه دستور جداگانه زمان‌بندی می‌شوند (مثلاً طبق `scripts/standalone-crontab`).

---

## استقرار All-in-One (بدون Huey/Redis)

در محیط All-in-One، به جای Huey از crontab استفاده می‌شود. نمونه کامل در `scripts/standalone-crontab`:

```text
0 9 * * * cd /app/backend && python manage.py run_check_reminders >> /var/log/cron.log 2>&1
*/5 * * * * cd /app/backend && python manage.py run_process_outbox >> /var/log/cron.log 2>&1
*/50 * * * * cd /app/backend && python manage.py run_process_pending_notifications >> /var/log/cron.log 2>&1
```

جزئیات بیشتر در `docs/deployment/DOCKER_DEPLOYMENT.md`.

---

## افزودن دستور جدید

1. در اپ مربوطه پوشه `management/commands/` را ایجاد کنید (در صورت نبود).
2. فایل `command_name.py` بسازید و کلاس `Command(BaseCommand)` تعریف کنید.
3. توابع `add_arguments` و `handle` را پیاده‌سازی کنید.
4. این مستند را با نام، آرگومان‌ها و زمان‌بندی پیشنهادی به‌روز کنید.

---

**آخرین به‌روزرسانی:** 2026-02-20
