# 🚗 KhodroBan (خودروبان)

پلتفرم مدیریت نگهداری خودرو شامل ثبت خودرو، سرویس و هزینه، یادآورها، گزارش‌ها و تنظیمات اعلان.

---

## وضعیت فعلی پروژه

این وضعیت بر اساس بررسی ۱۰ PR اخیر (از `#21` تا `#30`) به‌روز شده است:

- بخش‌های اصلی `Auth`, `Vehicles`, `Services`, `Reminders`, `Reports` در مسیر Django فعال و قابل استفاده هستند.
- در فرانت `frontend-vue`، بهبودهای مهم UX برای یادآورها، فهرست سرویس، تاریخ شمسی و فیلتر خودرو اعمال شده است.
- قرارداد API برای بخش‌های اصلی به‌روز است و در `docs/development/API_CONTRACT_REGISTRY.md` ثبت شده است.
- گزارش‌ها با داده واقعی، فیلتر بازه/خودرو و خروجی CSV کلاینتی فعال هستند.
- قواعد GitFlow پروژه روی مسیر `feature/*` -> PR -> `develop` تثبیت شده است.

---

## ساختار پروژه (Monorepo)

```text
OilChenger/
├── backend/
│   └── django/                    # Django + DRF API
├── frontend-vue/                  # Vue 3 + Vite + Pinia
├── shared/                        # سرویس‌ها/تایپ‌های مشترک
├── supabase/                      # functions و تنظیمات Supabase
├── docs/                          # مستندات توسعه و فنی
├── scripts/                       # اسکریپت‌های کمکی
└── TODO.md                        # TODO مرکزی پروژه
```

---

## شروع سریع

### 1) Backend (Django)

```bash
# از ریشه پروژه
source backend/django/venv/bin/activate
cd backend/django
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 2) Frontend (Vue)

```bash
# از ریشه پروژه
cd frontend-vue
npm install
npm run dev
```

پیش‌فرض فرانت روی `http://localhost:5174` اجرا می‌شود.

---

## مستندات کلیدی

- `TODO.md` - لیست مرکزی کارها و اولویت‌ها
- `backend/django/README.md` - راهنمای کامل بک‌اند
- `backend/django/TODO.md` - کارهای باز بک‌اند
- `frontend-vue/README.md` - راهنمای فرانت Vue
- `frontend-vue/IMPLEMENTATION_PLAN.md` - نقشه راه اجرایی فرانت
- `docs/technical/offline-setup.md` - راهنمای کامل راه اندازی آفلاین پروژه
- `docs/technical/offline-final-checklist.md` - چک لیست نهایی پذیرش اجرای strict-offline
- `docs/development/PAGE_REVIEW_LOG.md` - وضعیت بررسی صفحات
- `docs/development/API_CONTRACT_REGISTRY.md` - رجیستری قرارداد API

---

## Workflow توسعه (خلاصه)

- توسعه روزمره روی `feature/*` یا `bugfix/*` انجام می‌شود.
- ادغام به `develop` فقط از طریق Pull Request انجام می‌شود.
- قبل از PR، همگام‌سازی با `origin/develop` اجباری است.

