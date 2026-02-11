# Regression Gate دوره‌ای

این سند دستورالعمل اجرای smoke روزانه و تست suite هفتگی (frontend + backend) را تعریف می‌کند.

---

## Smoke روزانه (اختیاری، ~۲ دقیقه)

- **Backend:** از ریشه پروژه، با venv فعال:
  ```bash
  cd backend/django && python manage.py check && python manage.py test khodroban.tests.test_auth khodroban.tests.test_api_vehicles --verbosity=1
  ```
- **Frontend:** در صورت نیاز:
  ```bash
  cd frontend-vue && npm run build
  ```
- در صورت شکست: لاگ را ثبت و در backlog همان بخش (auth/vehicle/…) رفع کنید.

---

## تست suite هفتگی (قبل از PR یا rehearsal)

- **Backend (Django):**
  ```bash
  source backend/django/venv/bin/activate
  cd backend/django && python manage.py test khodroban --verbosity=2
  ```
- **Frontend:**
  ```bash
  cd frontend-vue && npm ci && npm run build && npm run test
  ```
- **دمو:** یک بار سناریوی `docs/development/DEMO_SCENARIO.md` را به‌صورت دستی یا با چک‌لیست اجرا کنید.

---

## چک‌لیست قبل از PR به develop

- [ ] `git status` تمیز یا قابل‌انتظار
- [ ] branch با `origin/develop` همگام
- [ ] تست‌های backend مرتبط پاس
- [ ] build فرانت بدون خطا
- [ ] در صورت تغییر API، `API_CONTRACT_REGISTRY.md` و `PAGE_REVIEW_LOG.md` به‌روز
