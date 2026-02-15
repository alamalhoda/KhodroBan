# 🔧 Backend Django - KhodroBan

Backend اصلی پروژه با Django + DRF که API مورد استفاده `frontend-vue` را ارائه می‌کند.

---

## وضعیت فعلی

- APIهای `Auth`, `Vehicles`, `Services`, `Expenses`, `Reminders`, `Notifications`, `Reports` فعال هستند.
- **Apps:** `reminders` (Outbox emit)، `notifications` (OutboxConsumer)، `khodroban` (مدل‌ها و API).
- **Huey:** Tasks برای یادآوری خودکار (check_reminders → Outbox → process_outbox → Notification → send_telegram).
- تست‌های backend برای reminders، notifications، reports، services افزایش یافته‌اند.

---

## پیش‌نیازها

- Python 3.11+ (یا نسخه سازگار پروژه)
- Virtual environment پروژه (الزامی)
- SQLite برای توسعه محلی (یا PostgreSQL برای محیط واقعی)

---

## راه‌اندازی سریع

از ریشه پروژه:

```bash
source backend/django/venv/bin/activate
cd backend/django
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Backend روی `http://127.0.0.1:8000` اجرا می‌شود.

---

## اجرای تست‌ها

```bash
source backend/django/venv/bin/activate
cd backend/django
python manage.py test
```

اجرای یک ماژول خاص:

```bash
source backend/django/venv/bin/activate
cd backend/django
python manage.py test khodroban.tests.test_api_reminders
```

---

## داده نمونه

```bash
source backend/django/venv/bin/activate
cd backend/django
python manage.py load_sample_data
```

برای بازسازی داده‌ها:

```bash
python manage.py load_sample_data --force
```

---

## Endpointهای مهم

Base URL: `/api/`

- Auth:
  - `POST /api/token/`
  - `POST /api/token/refresh/`
  - `POST /api/register/`
  - `GET/PATCH /api/me/`
- Vehicles:
  - `GET/POST /api/vehicles/`
  - `GET/PATCH/DELETE /api/vehicles/<id>/`
  - `PATCH /api/vehicles/<id>/km/`
  - `GET/POST /api/vehicles/<id>/km-history/`
- Services:
  - `GET/POST /api/services/`
  - `GET/PATCH/DELETE /api/services/<id>/`
  - `GET /api/services/latest/<vehicleId>/`
  - `GET /api/service-presets/`
- Expenses:
  - `GET/POST /api/expenses/`
  - `GET/PATCH/DELETE /api/expenses/<id>/`
- Reminders:
  - `GET/POST /api/reminders/`
  - `GET/PATCH/DELETE /api/reminders/<id>/`
  - `POST /api/reminders/<id>/dismiss/`
  - `GET /api/reminders/vehicle/<vehicleId>/`
  - `GET /api/reminders/user/`
- Reports:
  - `GET /api/reports/summary/`
- Notifications:
  - `GET /api/notifications/` (query: `?read=true|false`)
  - `GET /api/notifications/unread_count/`
  - `POST /api/notifications/<id>/mark_as_read/`
  - `POST /api/notifications/mark_all_read/`
  - `DELETE /api/notifications/<id>/`
- Telegram:
  - `GET/POST /api/telegram-settings/`
  - `POST /api/telegram-settings/generate_code/`
  - `POST /telegram/webhook/`
- Health:
  - `GET /huey-health/` – وضعیت Huey و Redis

---

## Huey و Redis

Tasks دوره‌ای برای یادآوری و نوتیفیکیشن:

| Task | App | زمان اجرا |
|------|-----|-----------|
| check_reminders | reminders | هر روز ۹ صبح |
| process_outbox | notifications | هر ۵ دقیقه |
| process_pending_notifications | khodroban | هر ۵۰ دقیقه |

اجرای Huey consumer (در محیط واقعی):

```bash
python manage.py run_huey
```

**متغیرهای محیطی:**

```env
TELEGRAM_BOT_TOKEN=...   # برای ارسال تلگرام
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
```

---

## اتصال فرانت Vue به Django

در `frontend-vue/.env.local`:

```env
VITE_BACKEND_TYPE=django
VITE_API_URL=http://127.0.0.1:8000/api
```

---

## فایل‌های مرجع

- `backend/django/khodroban/urls.py`
- `backend/django/khodroban/views.py`
- `backend/django/reminders/huey_tasks.py` – check_reminders (emit به Outbox)
- `backend/django/notifications/huey_tasks.py` – process_outbox (consume Outbox)
- `backend/django/khodroban/huey_tasks.py` – send_telegram، process_pending_notifications
- `docs/technical/reminder-notification-api-blueprint.md`
- `docs/technical/reminder-system-status.md`
- `docs/development/API_CONTRACT_REGISTRY.md`
