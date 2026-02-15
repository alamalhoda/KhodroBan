# وضعیت فعلی سیستم یادآوری و نوتیفیکیشن

**تاریخ ایجاد:** ۲۸ دی ۱۴۰۴  
**آخرین به‌روزرسانی:** ۲۶ بهمن ۱۴۰۴  
**وضعیت پروژه:** ✅ Django backend فعال، reminder-service منسوخ شده

---

## 📋 خلاصه اجرایی

سیستم یادآوری و نوتیفیکیشن بر پایه Django backend پیاده‌سازی شده است:

1. **دامنه Reminders** (app `reminders`) – ارزیابی موعد سرویس، emit رویداد به Outbox
2. **دامنه Notifications** (app `notifications`) – consume Outbox، ایجاد و ارسال نوتیفیکیشن
3. **Backend Django** (app `khodroban`) – مدل‌های اصلی، API، ارسال تلگرام

**مرجع طراحی:** `docs/technical/reminder-notification-api-blueprint.md`

---

## 🏗️ معماری (Django + Outbox)

### جریان یادآوری خودکار (Phase 1 & 2)

```
┌─────────────────────────────────────────────────────────────────┐
│  reminders app                                                   │
│  check_reminders (Huey periodic, هر روز ۹ صبح)                   │
│  - ارزیابی ReminderSetting + آخرین Service                      │
│  - emit به ReminderDueEventOutbox (فقط رویداد، بدون Notification)│
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  ReminderDueEventOutbox (جدول reminders_reminderdueeventoutbox)  │
│  - event_type: reminder.due.detected.v1                          │
│  - idempotency_key برای dedup                                    │
│  - payload: user_profile_id, vehicle_id, days_until_due, ...     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  notifications app                                               │
│  process_outbox (Huey periodic, هر ۵ دقیقه)                      │
│  - consume رویدادهای پردازش‌نشده                                 │
│  - ایجاد Notification (مدل khodroban)                            │
│  - علامت processed_at                                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  khodroban app                                                   │
│  process_pending_notifications (Huey periodic, هر ۵۰ دقیقه)      │
│  send_telegram (task) – ارسال به تلگرام                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Frontend (Vue)                                                  │
│  notificationServiceDjango – GET /api/notifications/, ...        │
│  short-poll (۳۰–۶۰ ثانیه) – Realtime در فاز بعد                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 فایل‌های اصلی

### Django Apps

| App | مسیر | مسئولیت |
|-----|------|---------|
| reminders | `backend/django/reminders/` | Outbox emit، بدون وابستگی به Notification |
| notifications | `backend/django/notifications/` | OutboxConsumer، ایجاد Notification از رویداد |
| khodroban | `backend/django/khodroban/` | مدل‌ها (Vehicle, Service, Notification)، API، تلگرام |

### Huey Tasks

| Task | App | Schedule | توضیحات |
|------|-----|----------|---------|
| check_reminders | reminders | crontab(hour=9) | emit رویداد به Outbox |
| process_outbox | notifications | crontab(minute='*/5') | consume Outbox، ایجاد Notification |
| process_pending_notifications | khodroban | crontab(minute='*/50') | ارسال نوتیفیکیشن‌های pending به تلگرام |
| send_telegram | khodroban | db_task | ارسال یک نوتیفیکیشن به تلگرام |

### Frontend (shared + Vue)

| فایل | توضیحات |
|------|---------|
| `shared/services/notificationService.ts` | notificationServiceMock، Supabase، Django (انتخاب با VITE_BACKEND_TYPE) |
| `frontend-vue/src/stores/notification.js` | Pinia store نوتیفیکیشن |
| `frontend-vue/src/components/NotificationBell.vue` | زنگوله نوتیفیکیشن در header |

---

## 🔌 APIهای Notification (Django)

| Method | Path | توضیحات |
|--------|------|---------|
| GET | `/api/notifications/` | لیست با فیلتر `?read=true|false` |
| GET | `/api/notifications/unread_count/` | تعداد خوانده‌نشده |
| GET | `/api/notifications/<id>/` | جزئیات |
| POST | `/api/notifications/<id>/mark_as_read/` | خوانده‌شده |
| POST | `/api/notifications/mark_all_read/` | همه خوانده‌شده |
| DELETE | `/api/notifications/<id>/` | حذف |

---

## 📊 مدل‌های کلیدی

### ReminderDueEventOutbox (reminders)

- `idempotency_key` (unique)
- `event_type`: `reminder.due.detected.v1`
- `payload`: JSON با user_profile_id، vehicle_id، days_until_due، ...
- `processed_at`: زمان پردازش (null = pending)

### Notification (khodroban)

- `idempotency_key` (nullable, unique) برای dedup از Outbox
- `user_profile`, `vehicle`, `title`, `body`, `type`, `read`, `metadata`, ...

---

## 🚀 پیکربندی

### متغیرهای محیطی (Backend)

```env
TELEGRAM_BOT_TOKEN=...      # ارسال تلگرام
REDIS_HOST=localhost        # Huey broker
REDIS_PORT=6379
REDIS_DB=0
```

### Frontend (حالت Django)

```env
VITE_BACKEND_TYPE=django
VITE_API_URL=http://127.0.0.1:8000/api
```

---

## ⚠️ reminder-service (منسوخ)

سرویس قدیمی Python در `reminder-service/` (Cron + Supabase) دیگر مسیر اصلی نیست.  
برای جزئیات تلگرام و رفتارهای legacy ر.ک. `reminder-service/TELEGRAM_README.md` و Blueprint §۴.

مسیر فعلی: Django + Huey + Outbox.

---

## 📅 تاریخچه پیاده‌سازی

| تاریخ | مرحله | وضعیت |
|-------|-------|--------|
| ۲۸ دی ۱۴۰۴ | دیتابیس Supabase، Python Cron | انجام شده (legacy) |
| ۲۶ بهمن ۱۴۰۴ | Phase 1: Notification API، notificationServiceDjango، dedup، تلگرام callback | ✅ |
| ۲۶ بهمن ۱۴۰۴ | Phase 2: تفکیک reminders/notifications، Outbox، OutboxConsumer | ✅ |

---

## 📞 مراجع

- **Blueprint:** `docs/technical/reminder-notification-api-blueprint.md`
- **اتصال سرویس‌دهندگان واقعی:** `docs/technical/notification-channel-providers.md`
- **API Registry:** `docs/development/API_CONTRACT_REGISTRY.md`
- **Backend README:** `backend/django/README.md`
