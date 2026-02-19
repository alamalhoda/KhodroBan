# برنامه اجرایی فرانت (نسخه همگام با واقعیت)

**آخرین به‌روزرسانی:** 2026-02-19  
**مبنای وضعیت:** PRهای merge شده تا `#37` روی `develop`

---

## 1) هدف این سند

این فایل مرجع اجرایی فرانت است (نه آرشیو جزئیات تاریخی).  
برای کارهای روزانه: `frontend-vue/TODO.md`  
برای اولویت‌های بین‌بخشی: `../TODO.md`

---

## 2) وضعیت واقعی فعلی

### انجام‌شده (تاییدشده)

- مسیر اصلی فرانت روی backend Django فعال است (`VITE_BACKEND_TYPE=django`).
- صفحات و جریان‌های اصلی عملیاتی هستند: `Auth`, `Vehicles`, `Services`, `Reminders`, `Reports`.
- `AddServiceView` در تب هزینه operational است و به `expenseStore/expenseService` متصل شده.
- Smart Assistant backend-first فعال است:
  - تاریخچه گفتگو
  - شروع گفتگوی جدید
  - ارسال `vehicle_id` برای context
- مسیر offline/asset policy تثبیت شده و وابستگی runtime به CDN حذف شده است.

### باز (واقعی)

- Settings هنوز عمدتا نمایشی است و باید به تنظیمات عملیاتی متصل شود.
- Expense هنوز نمای dedicated کامل برای list/manage ندارد.
- PWA release checklist کامل نشده (icons واقعی + Lighthouse + A2HS).
- پوشش تست برخی viewهای ریسکی کامل نیست (`ReportsView`, `SettingsView`, `SmartAssistantView`).

---

## 3) برنامه اجرایی کوتاه‌مدت

### Sprint 1 (اولویت بحرانی)

1. تکمیل Expense Management
   - ساخت/تکمیل نمای dedicated برای لیست و مدیریت هزینه
   - فیلتر/مرتب‌سازی و stateهای loading/error/empty
2. تکمیل Settings اعلان‌ها
   - اتصال Telegram settings و channel preferences
   - تعیین تکلیف UX برای SMS/Push (placeholder یا اتصال واقعی)
3. تعریف smoke regression flow
   - سناریوی پایه: `login -> vehicles -> service/expense -> reminders -> reports`

### Sprint 2 (کیفیت و انتشار)

1. PWA release readiness
   - جایگزینی iconهای placeholder
   - اجرای Lighthouse و ثبت baseline
   - تست A2HS در Android/iOS/Desktop
2. افزایش پوشش تست viewها
   - `ReportsView`
   - `SettingsView`
   - `SmartAssistantView`
3. یکدست‌سازی i18n و اتمام migration `group_name`

---

## 4) معیار Done برای این برنامه

- Expense flow مستقل از AddService قابل استفاده روزمره باشد.
- Settings اعلان از حالت static خارج شود و state واقعی کاربر را نگه دارد.
- Smoke flow به‌صورت تکرارپذیر در PRها قابل اجرا باشد.
- PWA checklist حداقلی با evidence (گزارش/اسکرین‌شات) ثبت شود.
- برای viewهای ریسکی حداقل تست‌های حیاتی وجود داشته باشد.

---

## 5) وابستگی‌ها و ریسک‌ها

- وابستگی به contract backend برای preference/channelها.
- ریسک regression به دلیل چند-بک‌اند بودن تاریخی پروژه (legacy paths).
- ریسک drift مستندات اگر پس از merge هر PR، TODO/plan همزمان sync نشود.

---

## 6) آرشیو خلاصه (بدون تناقض)

این آرشیو فقط milestoneهای تاییدشده را نگه می‌دارد و عمدا شامل چک‌لیست‌های قدیمی نیست:

- `PR #31`: Expense tab عملیاتی + reusable reminder interval components + تست‌ها
- `PR #32`: بهبود Header/Sidebar
- `PR #35`: offline track + asset policy بدون CDN
- `PR #36`: Reminder/Notification backend فاز 1-4 تکمیل
- `PR #37`: AI Assistant backend-first + chat history/new chat/vehicle context

برای جزئیات تاریخی قدیمی‌تر به تاریخچه Git مراجعه شود.

---

## 7) اسناد مرتبط

- `frontend-vue/TODO.md`
- `../TODO.md`
- `docs/development/API_CONTRACT_REGISTRY.md`
- `docs/development/PAGE_REVIEW_LOG.md`
- `docs/technical/reminder-system-status.md`
- `docs/technical/ai-assistant-architecture.md`
