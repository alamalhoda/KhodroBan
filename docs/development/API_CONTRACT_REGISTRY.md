# API Contract Registry

ثبت endpointهای موردنیاز فرانت و وضعیت پیاده‌سازی در Django. به‌روزرسانی دوره‌ای با هر صفحه/PR.

پایه URL API (Django): `/api/` (مثلاً `http://localhost:8000/api`).

---

## Auth

| انتظار FE (shared/services) | مسیر Django | وضعیت |
|-----------------------------|-------------|--------|
| POST login | POST `/api/token/` | دارد |
| POST refresh | POST `/api/token/refresh/` | دارد |
| POST register | POST `/api/register/` | دارد |
| GET profile | GET `/api/me/` | دارد |
| PATCH profile | PATCH `/api/me/` | دارد |
| POST logout | — | ندارد |
| POST forgot-password | — | ندارد |
| POST reset-password | — | ندارد |

---

## Vehicles

| انتظار FE | مسیر Django | وضعیت |
|-----------|-------------|--------|
| GET list | GET `/api/vehicles/` | دارد |
| GET one | GET `/api/vehicles/<id>/` | دارد |
| POST create | POST `/api/vehicles/` | دارد |
| PATCH update | PATCH `/api/vehicles/<id>/` | دارد |
| DELETE | DELETE `/api/vehicles/<id>/` | دارد |
| PATCH km | PATCH `/api/vehicles/<id>/km/` | دارد |
| POST km-history | POST `/api/vehicles/<id>/km-history/` | دارد |
| GET km-history | GET `/api/vehicles/<id>/km-history/` | دارد |

---

## Services

| انتظار FE | مسیر Django | وضعیت |
|-----------|-------------|--------|
| GET list | GET `/api/services/` | دارد |
| GET one | GET `/api/services/<id>/` | دارد |
| POST create | POST `/api/services/` | دارد |
| PATCH update | PATCH `/api/services/<id>/` | دارد |
| DELETE | DELETE `/api/services/<id>/` | دارد |
| GET latest for vehicle | GET `/api/services/latest/<vehicleId>/` | دارد |

---

## Expenses

| انتظار FE | مسیر Django | وضعیت |
|-----------|-------------|--------|
| GET list | GET `/api/expenses/` | دارد |
| GET one | GET `/api/expenses/<id>/` | دارد |
| POST create | POST `/api/expenses/` | دارد |
| PATCH update | PATCH `/api/expenses/<id>/` | دارد |
| DELETE | DELETE `/api/expenses/<id>/` | دارد |

---

## Reminders

| انتظار FE | مسیر Django | وضعیت |
|-----------|-------------|--------|
| GET list | GET `/api/reminders/` | دارد |
| GET one | GET `/api/reminders/<id>/` | دارد |
| POST create | POST `/api/reminders/` | دارد |
| PATCH update | PATCH `/api/reminders/<id>/` | دارد |
| DELETE | DELETE `/api/reminders/<id>/` | دارد |
| POST dismiss | POST `/api/reminders/<id>/dismiss/` | دارد |
| GET by vehicle | GET `/api/reminders/vehicle/<vehicleId>/` | دارد |
| GET/PATCH settings | `/api/reminder-settings/` (per-vehicle) | دارد (ساختار متفاوت) |
| GET user reminders | GET `/api/reminders/user/` | دارد |

---

## Reports

| انتظار FE | مسیر Django | وضعیت |
|-----------|-------------|--------|
| GET summary | GET `/api/reports/summary/` | دارد |
| GET export CSV | GET `/api/reports/export/csv/` | ندارد (MVP: بعداً) |
| GET export PDF | GET `/api/reports/export/pdf/` | ندارد (MVP: بعداً) |
| GET trend monthly | GET `/api/reports/trend/monthly/` | ندارد (MVP: خلاصه شامل costByMonth) |

---

## Notifications

| انتظار FE | مسیر Django | وضعیت |
|-----------|-------------|--------|
| GET list | GET `/api/notifications/` | دارد |
| POST mark_as_read | POST `/api/notifications/<id>/mark_as_read/` | دارد |

---

## Telegram

| انتظار FE (frontend-vue telegramService) | مسیر Django | وضعیت |
|------------------------------------------|-------------|--------|
| CRUD telegram_settings | GET/POST `/api/telegram-settings/` | دارد |
| generate_code | POST `/api/telegram-settings/generate_code/` | دارد |
| Webhook | POST `/telegram/webhook/` | دارد |

---

## Service Types / Expense Categories

| انتظار FE | مسیر Django | وضعیت |
|-----------|-------------|--------|
| service_types list | GET `/api/service-types/` | دارد |
| expense_categories list | GET `/api/expense-categories/` | دارد |

---

## قرارداد پاسخ موفق

- فرمت: `{ "success": true, "data": ... }`
- خطا: توسط DRF (مثلاً 400 با `serializer.errors` یا 401/403/404).

---

## فایل‌های مرجع

- Django URLs: `backend/django/khodroban/urls.py`
- Django Views: `backend/django/khodroban/views.py`
- Shared services: `shared/services/*.ts`
