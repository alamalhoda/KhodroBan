# API Contract Registry

ثبت endpointهای موردنیاز فرانت و وضعیت پیاده‌سازی در Django. به‌روزرسانی دوره‌ای با هر صفحه/PR.

پایه URL API (Django): `/api/` (مثلاً `http://localhost:8000/api`).

**آخرین همگام‌سازی:** 2026-02-16 (AI Assistant: vehicle_id، context، تاریخچه UI)

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
| POST create | POST `/api/vehicles/` | دارد (شامل iconName, iconStyle, iconColor) |
| PATCH update | PATCH `/api/vehicles/<id>/` | دارد |
| DELETE | DELETE `/api/vehicles/<id>/` | دارد |
| PATCH km | PATCH `/api/vehicles/<id>/km/` | دارد |
| POST km-history | POST `/api/vehicles/<id>/km-history/` | دارد |
| GET km-history | GET `/api/vehicles/<id>/km-history/` | دارد |
| GET images | GET `/api/vehicles/<id>/images/` | دارد |
| POST image (upload) | POST `/api/vehicles/<id>/images/` (multipart: image, display_order?, is_default?) | دارد |

**Vehicle response:** id, userId, model, year, plateNumber, currentKm, note, **iconName**, **iconStyle**, **iconColor**, createdAt, updatedAt.

---

## Vehicle Images (گالری خودرو)

| انتظار FE | مسیر Django | وضعیت |
|-----------|-------------|--------|
| GET list | GET `/api/vehicle-images/` یا `?vehicle_id=<id>` | دارد |
| GET one | GET `/api/vehicle-images/<id>/` | دارد |
| PATCH (set default) | PATCH `/api/vehicle-images/<id>/` با `isDefault: true` | دارد |
| DELETE | DELETE `/api/vehicle-images/<id>/` | دارد |

**پاسخ هر تصویر:** id, vehicleId, url, displayOrder, isDefault, createdAt. حداکثر ۱۵ تصویر به‌ازای هر خودرو؛ JPG/PNG/WebP؛ حداکثر ۵ مگابایت.

---

## Services

| انتظار FE | مسیر Django | وضعیت |
|-----------|-------------|--------|
| GET list | GET `/api/services/` | دارد |
| GET one | GET `/api/services/<id>/` | دارد |
| POST create | POST `/api/services/` | دارد (پشتیبانی از `types` و `items`) |
| PATCH update | PATCH `/api/services/<id>/` | دارد (پشتیبانی از `types` و `items`) |
| DELETE | DELETE `/api/services/<id>/` | دارد |
| GET latest for vehicle | GET `/api/services/latest/<vehicleId>/` | دارد |
| GET presets | GET `/api/service-presets/` | دارد |

**نکته فیلتر:** لیست سرویس از `vehicle_id`/`vehicleId` برای فیلتر خودرو پشتیبانی می‌کند.

---

## Expenses

| انتظار FE | مسیر Django | وضعیت |
|-----------|-------------|--------|
| GET list | GET `/api/expenses/` | دارد |
| GET list by vehicle | GET `/api/expenses/?vehicle_id=<id>` یا `?vehicleId=<id>` | دارد |
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

**فیلدهای کلیدی در payload یادآور (camelCase):**
- `dueDate`, `dueKm`
- `warningDaysBefore`, `warningKmBefore`
- `timeInterval`, `timeIntervalType`
- `isCompleted`, `dismissed`

---

## Reports

| انتظار FE | مسیر Django | وضعیت |
|-----------|-------------|--------|
| GET summary | GET `/api/reports/summary/` | دارد |
| GET export CSV | GET `/api/reports/export/csv/` | ندارد (MVP: ساخته‌شده سمت کلاینت از GET services + GET expenses) |
| GET export PDF | GET `/api/reports/export/pdf/` | ندارد (MVP: بعداً) |
| GET trend monthly | — | از خلاصه: پاسخ summary شامل `costByMonth` است |

**خلاصه گزارش (GET summary):**
- **Query params (اختیاری):** `vehicle_id` (یا camelCase `vehicleId`)، `date_from` / `date_to` (یا `dateFrom` / `dateTo`) به صورت ISO `YYYY-MM-DD`.
- **پاسخ:** `totalCost`, `totalKm`, `costByCategory`, `costByMonth` (آرایه `{ month, amount }`).
- **هزینه‌های اخیر (جدول در صفحه):** از لیست سرویس و هزینه (GET `/api/services/`, GET `/api/expenses/`) با همان فیلتر vehicle/بازه ادغام و مرتب‌سازی بر اساس تاریخ.

---

## Notifications

| انتظار FE | مسیر Django | وضعیت |
|-----------|-------------|--------|
| GET list | GET `/api/notifications/` | دارد |
| GET list (filter) | GET `/api/notifications/?read=true|false` | دارد |
| GET unread_count | GET `/api/notifications/unread_count/` → `{ "count": number }` | دارد |
| GET one | GET `/api/notifications/<id>/` | دارد |
| POST mark_as_read | POST `/api/notifications/<id>/mark_as_read/` | دارد |
| POST mark_all_read | POST `/api/notifications/mark_all_read/` → `{ "status": "read", "count": number }` | دارد |
| DELETE | DELETE `/api/notifications/<id>/` | دارد |

**Response shape:** id, user_profile, vehicle, title, body, type, read, metadata, notification_channels, sent_at, created_at, updated_at. Envelope: `{ "success": true, "data": ... }`.

---

## Telegram

| انتظار FE (frontend-vue telegramService) | مسیر Django | وضعیت |
|------------------------------------------|-------------|--------|
| CRUD telegram_settings | GET/POST `/api/telegram-settings/` | دارد |
| generate_code | POST `/api/telegram-settings/generate_code/` | دارد |
| Webhook | POST `/telegram/webhook/` | دارد |

**Webhook:** `message` (دستورات /start، /status، /help) و `callback_query` (دکمه‌های done_، details_). ر.ک. Blueprint §۴.

---

## AI Assistant (backend-first)

| انتظار FE (aiAssistantService) | مسیر Django | وضعیت |
|---------------------------------|-------------|--------|
| list sessions | GET `/api/ai/sessions/` | دارد |
| create session | POST `/api/ai/sessions/` | دارد |
| retrieve session | GET `/api/ai/sessions/<id>/` | دارد |
| list messages | GET `/api/ai/sessions/<id>/messages/` | دارد |
| send message | POST `/api/ai/sessions/<id>/messages/send/` با `{ "content": "...", "vehicle_id"?: number \| null }` | دارد |
| providers (diagnostic) | GET `/api/ai/providers/` | دارد |

**بدن send message:** `content` اجباری (غیر خالی، حداکثر ۱۶٬۰۰۰ کاراکتر)؛ `vehicle_id` اختیاری (خودروی انتخاب‌شده برای قرار گرفتن در context).  
**پاسخ send message:** `{ "success": true, "data": { "content", "provider", "model", "usage", "latency_ms" } }`. Envelope کلی: `{ "success", "data" }` / خطا: `{ "success": false, "errors": ["..."] }`. Throttle: ۳۰ درخواست/دقیقه به ازای هر کاربر.

---

## Service Types / Service Presets / Expense Categories

| انتظار FE | مسیر Django | وضعیت |
|-----------|-------------|--------|
| service_types list | GET `/api/service-types/` | دارد |
| service_presets list | GET `/api/service-presets/` | دارد |
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
