# TODO: کارهای باقی‌مانده پروژه

این فایل مرجع مرکزی TODOهای پروژه است و با وضعیت واقعی کد/PRها تا `PR #37` به‌روز شده است.

---

## 🔄 همگام‌سازی اخیر (2026-02-19)

### ✅ انجام‌شده‌های مهم (واقعی)

- ✅ `PR #37` — AI Assistant backend-first: APIهای `/api/ai/*`، تاریخچه گفتگو، سشن جدید، context خودرو/سرویس/هزینه، ارسال `vehicle_id`.
- ✅ `PR #36` — Reminder/Notification فازهای ۱ تا ۴ در Django: Outbox، Notification API، ChannelDispatcher، آرشیو reminder-service.
- ✅ `PR #35` — Offline track: حذف وابستگی runtime به CDN، مسیر دارایی‌های محلی، Font Awesome Pro و بهبود icon handling.
- ✅ `PR #32` — بهبود Header/Sidebar (جستجو و فعال‌سازی لینک‌ها + i18n مرتبط).
- ✅ `PR #31` — عملیاتی‌سازی تب هزینه در AddService + کامپوننت‌های reusable بازه زمانی/کیلومتری + تست‌های هزینه.
- ✅ `PR #21` تا `#30` — تثبیت مسیر Django-first در Auth/Vehicles/Services/Reminders/Reports و بهبودهای UX.

---

## 🔴 اولویت بالا (Sprint جاری)

### 1) تکمیل Expense Management در فرانت
- **وضعیت:** 🔄 بخشی انجام شده
- **انجام‌شده:** اتصال `expenseStore` + ثبت هزینه در `AddServiceView` + تست store/view/API.
- **باقی‌مانده:**
  - [ ] صفحه/نمای dedicated برای لیست و مدیریت کامل هزینه‌ها
  - [ ] فیلتر/مرتب‌سازی/empty-loading state یکپارچه برای سناریوی expense-centric

### 2) تکمیل کانال‌های یادآوری چندگانه (UI + عملیاتی)
- **وضعیت:** 🔄 Backend آماده، UI ناقص
- **انجام‌شده:** Notification API، Outbox/Dispatcher، تلگرام backend، in-app notification.
- **باقی‌مانده:**
  - [ ] UI تنظیم کانال‌ها در `SettingsView`
  - [ ] تکمیل جریان Telegram end-to-end از دید کاربر
  - [ ] تعیین scope اجرایی Push/SMS (فعلا stub)

### 3) بسته Regression تست End-to-End
- **وضعیت:** 📝 در انتظار
- **خروجی مورد انتظار:**
  - [ ] smoke flow تکرارپذیر: `login -> vehicles -> service/expense -> reminders -> reports`
  - [ ] اجرای حداقلی در CI برای جلوگیری از regressionهای اصلی

### 4) PWA Release Readiness
- **وضعیت:** 🔄 Foundation انجام شده، release checklist ناقص
- **باقی‌مانده:**
  - [ ] جایگزینی iconهای placeholder
  - [ ] تست Lighthouse (PWA)
  - [ ] تست Add to Home Screen در Android/iOS/Desktop

---

## 🟡 اولویت متوسط

### 1) تکمیل Settings واقعی
- [ ] اتصال تنظیمات پروفایل/امنیت به API
- [ ] یکپارچه‌سازی Preferenceهای اعلان در UI

### 2) مهاجرت `group_name` به کد انگلیسی
- [ ] اجرای برنامه `frontend-vue/docs/TODO_GROUP_NAME_MIGRATION.md`

### 3) Reports PDF export (Pro backlog)
- [ ] CSV فعال است؛ PDF هنوز backlog

### 4) پوشش تست viewهای باقی‌مانده
- [ ] `ReportsView`, `SettingsView`, `SmartAssistantView`

---

## 🟢 اولویت پایین / آینده

- [ ] Upgrade/Subscription flow (UI + backend contract)
- [ ] Export/Import پیشرفته داده
- [ ] قابلیت‌های UX پیشرفته (global search, bulk actions)

---

## 🧱 Technical Debt

- [ ] هم‌راستاسازی کامل docs قدیمی که هنوز روی بازه PRهای قدیمی قفل هستند
- [ ] کاهش تکرار و هم‌پوشانی بین `TODO.md` و `frontend-vue/IMPLEMENTATION_PLAN.md`
- [ ] تعریف معیار یکسان Done در `docs/development/PAGE_REVIEW_LOG.md`

---

## 🎯 پیشنهاد اجرایی دو اسپرینت بعدی

### Sprint 1 (تمرکز: جریان مالی + پایداری)
1. Expense list/management view کامل
2. Smoke regression اصلی و اجرای نیمه‌خودکار
3. تثبیت Settings پایه

### Sprint 2 (تمرکز: اعلان و انتشار)
1. تکمیل UI کانال‌های اعلان (اولویت با Telegram)
2. PWA release readiness (icons + Lighthouse + A2HS)
3. بستن edge caseهای auth و chat UX

---

## 🔗 لینک‌های مرجع

- `frontend-vue/IMPLEMENTATION_PLAN.md`
- `frontend-vue/TODO.md`
- `backend/django/TODO.md`
- `ai-todo.md`
- `docs/development/PAGE_REVIEW_LOG.md`
- `docs/development/API_CONTRACT_REGISTRY.md`

---

**آخرین به‌روزرسانی:** 2026-02-19 (مبنای وضعیت: PRهای merge شده تا #37)
