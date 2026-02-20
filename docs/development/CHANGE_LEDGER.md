# Change Ledger

ثبت تصمیم‌های مرتبط با schema، API، فرمت خطا و i18n برای جلوگیری از دوباره‌کاری و تعارض در صفحات بعدی.

---

## قالب هر ورودی

```
تاریخ: YYYY-MM-DD
حوزه: [ schema | API | error-format | i18n | a11y | other ]
تصمیم: توضیح کوتاه
مسیر/فایل‌های مرتبط: …
```

---

## ورودی‌ها

### 2025-02-11 — API response shape
- **حوزه:** API
- **تصمیم:** پاسخ موفق همه endpointهای Django به صورت `{ "success": true, "data": ... }` برگردانده می‌شود. میکسین `ApiResponseMixin` در `backend/django/khodroban/views.py` این قرارداد را اعمال می‌کند.
- **مسیر:** `backend/django/khodroban/views.py` (تابع `api_response`, کلاس `ApiResponseMixin`)

### 2025-02-11 — Auth token
- **حوزه:** API
- **تصمیم:** ورود با `POST /api/token/` (username + password)، خروجی شامل `access` و `refresh`. فرانت توکن را در localStorage ذخیره و در هدر `Authorization: Bearer <access>` ارسال می‌کند.
- **مسیر:** `backend/django/khodroban/urls.py`, `shared/services/api.ts`

### 2025-02-11 — Naming: camelCase in API payload (frontend-facing)
- **حوزه:** API
- **تصمیم:** خروجی API برای فرانت با camelCase (مثلاً `vehicleId`, `currentKm`) از طریق `*ApiSerializer`ها در Django تولید می‌شود. ورودی فرانت نیز camelCase پذیرفته و در serializers به snake_case داخلی map می‌شود.
- **مسیر:** `backend/django/khodroban/serializers.py` (VehicleApiSerializer, ServiceApiSerializer, …)

### 2025-02-11 — Error handling (frontend)
- **حوزه:** error-format
- **تصمیم:** تابع `getErrorMessage` در `shared/services/api.ts` از فیلدهای `message`, `detail`, `error` در پاسخ خطا استفاده می‌کند. 401 باعث پاک شدن token و فراخوانی onAuthError می‌شود.
- **مسیر:** `shared/services/api.ts`

### 2025-02-11 — Reports summary & Regression Gate
- **حوزه:** API, other
- **تصمیم:** گزارش خلاصه فقط از Django — GET `/api/reports/summary/` با `totalServiceCost`, `totalExpenses`, `costByCategory`, `costByMonth`. Export CSV/PDF و trend ماهانه در MVP پیاده نشده (backlog). Regression Gate: smoke روزانه (auth + vehicle tests)، suite هفتگی (همه تست‌های khodroban + build فرانت)، چک‌لیست قبل از PR در `REGRESSION_GATE.md`.
- **مسیر:** `backend/django/khodroban/views.py` (ReportSummaryView), `docs/development/REGRESSION_GATE.md`, `API_CONTRACT_REGISTRY.md`, `PAGE_REVIEW_LOG.md`

### 2026-02-14 — Expense tab operational + reusable reminder intervals
- **حوزه:** API, other
- **تصمیم:** فرم AddService برای تب هزینه به‌صورت عملیاتی به `expenseStore/expenseService` متصل شد. کامپوننت‌های بازه زمانی/کیلومتری یادآور به‌صورت reusable استخراج و در فرم یادآور و AddService یکپارچه شدند.
- **مسیر:** `frontend-vue/src/views/AddServiceView.vue`, `frontend-vue/src/components/ReminderTimeIntervalFields.vue`, `frontend-vue/src/components/ReminderKmIntervalFields.vue`, `frontend-vue/src/stores/expense.js`, `backend/django/khodroban/serializers.py`

### 2026-02-15 — Reminder/Notification architecture finalized on Django
- **حوزه:** schema, API
- **تصمیم:** معماری Outbox برای reminders/notifications نهایی شد. Notification API کامل (`list`, `unread_count`, `mark_as_read`, `mark_all_read`, `delete`) و dispatcher چندکاناله (telegram/push/email/sms با fallback) فعال شد. reminder-service در مسیر production منسوخ شد.
- **مسیر:** `backend/django/reminders/*`, `backend/django/notifications/*`, `backend/django/khodroban/views.py`, `shared/services/notificationService.ts`, `docs/technical/reminder-system-status.md`

### 2026-02-16 — AI Assistant backend-first contract
- **حوزه:** API
- **تصمیم:** API اختصاصی AI در Django (`/api/ai/*`) به‌عنوان مرجع اصلی فعال شد. فرانت از service/store جدید استفاده می‌کند؛ تاریخچه گفتگو، گفتگوی جدید و ارسال `vehicle_id` در قرارداد لحاظ شد.
- **مسیر:** `backend/django/ai_assistant/*`, `frontend-vue/src/services/aiAssistantService.js`, `frontend-vue/src/stores/ai.js`, `frontend-vue/src/views/SmartAssistantView.vue`, `docs/technical/ai-assistant-architecture.md`, `docs/development/API_CONTRACT_REGISTRY.md`

---

*ورودی‌های بعدی با تکمیل هر صفحه یا تصمیم جدید اضافه شوند.*
