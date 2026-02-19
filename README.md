# 🚗 KhodroBan (خودروبان)

پلتفرم مدیریت نگهداری خودرو با تمرکز بر ثبت سرویس/هزینه، یادآورهای هوشمند، گزارش‌گیری و مشاور هوشمند AI.

---

## وضعیت واقعی فعلی پروژه (2026-02-19)

این وضعیت بر اساس PRهای merge شده تا `#37` (به ویژه `#31`, `#32`, `#35`, `#36`, `#37`) ثبت شده است:

- مسیر اصلی محصول روی `Django + Vue` فعال است (`VITE_BACKEND_TYPE=django`).
- ماژول‌های عملیاتی: `Auth`, `Vehicles`, `Services`, `Expenses (در AddService tab)`, `Reminders`, `Notifications`, `Reports`, `AI Assistant`.
- AI Assistant به صورت backend-first پیاده‌سازی شده (`/api/ai/*`) با تاریخچه گفتگو، سشن جدید، context خودرو/سرویس/هزینه و ارسال `vehicle_id`.
- سیستم Notification سمت Django با معماری Outbox + Dispatcher فعال است؛ Telegram در مسیر واقعی، Push/SMS/Email فعلا در سطح stub/provider آماده اتصال.
- مسیر آفلاین فرانت (strict-offline) تقویت شده و وابستگی runtime به CDN حذف شده است.

---

## ساختار پروژه (Monorepo)

```text
OilChenger/
├── backend/
│   └── django/                    # Django + DRF + Huey
├── frontend-vue/                  # Vue 3 + Vite + Pinia
├── shared/                        # سرویس‌های مشترک frontend/backend modes
├── supabase/                      # Edge functions و artifacts قبلی
├── docs/                          # مستندات توسعه/فنی/استراتژی
├── scripts/                       # اسکریپت‌های کمکی
└── TODO.md                        # TODO مرکزی پروژه
```

---

## شروع سریع

### 1) Backend (Django)

```bash
source backend/django/venv/bin/activate
cd backend/django
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 2) Frontend (Vue)

```bash
cd frontend-vue
npm install
npm run dev
```

Frontend به صورت پیش‌فرض روی `http://localhost:5174` اجرا می‌شود.

---

## مستندات مرجع

- `TODO.md` - لیست مرکزی اولویت‌ها و اسپرینت‌های بعدی
- `frontend-vue/TODO.md` - TODO اجرایی فرانت
- `backend/django/TODO.md` - TODO اجرایی بک‌اند
- `frontend-vue/IMPLEMENTATION_PLAN.md` - برنامه اجرایی فرانت (به‌روز)
- `docs/strategy/project-plan.md` - طرح اجرایی کل پروژه (به‌روز)
- `ai-todo.md` - نقشه وضعیت و backlog سرویس AI
- `docs/development/API_CONTRACT_REGISTRY.md` - قرارداد API واقعی
- `docs/development/PAGE_REVIEW_LOG.md` - وضعیت بررسی صفحات
- `docs/technical/reminder-system-status.md` - وضعیت Reminder/Notification
- `docs/technical/offline-setup.md` - راهنمای اجرای آفلاین

---

## Workflow توسعه (GitFlow)

- توسعه روی `feature/*` یا `bugfix/*`
- ادغام به `develop` فقط از مسیر PR
- قبل از PR، همگام‌سازی branch با `origin/develop` الزامی است

