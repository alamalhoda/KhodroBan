# 🔧 Backend Django - KhodroBan

Backend اصلی پروژه با Django + DRF که API مورد استفاده `frontend-vue` را ارائه می‌کند.

---

## وضعیت فعلی

بر اساس PRهای اخیر:

- APIهای `Auth`, `Vehicles`, `Services`, `Expenses`, `Reminders`, `Reports` فعال هستند.
- `ServicePreset` و `ServiceItem` اضافه شده‌اند.
- قرارداد تاریخ (ISO/شمسی) در سرویس‌ها و یادآورها پایدارتر شده است.
- تست‌های backend برای بخش‌های کلیدی افزایش یافته‌اند (خصوصا reminders/reports/services).

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
- Telegram:
  - `GET/POST /api/telegram-settings/`
  - `POST /api/telegram-settings/generate_code/`
  - `POST /telegram/webhook/`

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
- `docs/development/API_CONTRACT_REGISTRY.md`
- `docs/development/PAGE_REVIEW_LOG.md`
