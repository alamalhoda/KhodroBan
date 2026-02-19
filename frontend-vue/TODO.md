# TODO - Frontend Vue (KhodroBan)

این فایل برای کارهای اجرایی کوتاه‌مدت فرانت است و با PRهای merge شده تا `#37` به‌روز شده است.

---

## نسبت با سایر مستندات

- `frontend-vue/IMPLEMENTATION_PLAN.md` = برنامه اجرایی میان‌مدت فرانت
- `frontend-vue/TODO.md` (این فایل) = کارهای اسپرینت جاری/بعدی
- `../TODO.md` = اولویت‌های سطح کل پروژه

---

## ✅ انجام‌شده‌های اخیر (واقعی)

- `PR #37`: Smart Assistant backend-first + تاریخچه گفتگو + گفتگوی جدید + `vehicle_id`.
- `PR #35`: Offline track + حذف وابستگی CDN runtime + بهبود icon picker و vehicle icon.
- `PR #32`: بهبود Header/Sidebar (جستجو و active link) + i18n مرتبط.
- `PR #31`: عملیاتی‌سازی Expense tab در `AddServiceView` + reusable reminder interval components + تست‌های expense.
- `PR #30` و `#29`: Reminders Phase 1/2 (Date Picker شمسی، retry/error/loading، تست‌ها).
- `PR #26` و `#25`: Service presets + تکمیل add-service flow + فیلتر خودرو و pagination در service list.

---

## 🔴 اولویت بالا (Sprint جاری)

### 1) تکمیل Expense Management UI
- [x] اتصال کامل `expenseStore` به `expenseService` در سناریوهای اصلی
- [x] ثبت هزینه در تب هزینه با UX کامل (تاریخ، دسته، مبلغ، quick chips، رسید، یادآور)
- [ ] افزودن نمای dedicated برای لیست/مدیریت هزینه‌ها
- [ ] بهبود فیلتر/مرتب‌سازی و stateهای empty/loading/error برای expense-centric flow

### 2) تکمیل Settings اعلان و کانال‌ها
- [ ] تبدیل `SettingsView` از صفحه عمدتا نمایشی به فرم عملیاتی
- [ ] یکپارچه‌سازی تنظیمات کانال‌ها با backend preference model
- [ ] تکمیل UX اتصال Telegram در Settings (حالت‌ها، خطاها، وضعیت اتصال)
- [ ] تعیین تکلیف UI برای SMS/Push (placeholder یا اتصال واقعی)

### 3) Regression تست جریان اصلی
- [ ] تعریف smoke flow: `login -> vehicles -> services/expenses -> reminders -> reports`
- [ ] اجرای حداقلی این flow در CI برای PRهای فرانت

---

## 🟡 اولویت متوسط

### 1) PWA Release Readiness
- [ ] جایگزینی iconهای placeholder
- [ ] اجرای Lighthouse PWA و ثبت خروجی
- [ ] تست A2HS روی Android/iOS/Desktop

### 2) i18n یکپارچه
- [ ] مرور ترجمه‌های Service/Expense/Settings/SmartAssistant
- [ ] یکسان‌سازی پیام‌های error/success در localeهای `fa/en/ar`

### 3) migration `group_name` به کد انگلیسی
- [ ] اجرای برنامه `frontend-vue/docs/TODO_GROUP_NAME_MIGRATION.md`
- [ ] همگام‌سازی UI tags و localeها بعد از migration

---

## 🟢 Backlog (آینده)

- [ ] Reports PDF export (Pro)
- [ ] پروفایل/امنیت کامل در Settings
- [ ] UX پیشرفته (global search, bulk actions)

---

## 🧪 Testing Debt

- [ ] افزایش پوشش تست viewها: `ReportsView`, `SettingsView`, `SmartAssistantView`
- [ ] تکمیل تست composableهای کلیدی
- [ ] تعریف baseline حداقلی coverage برای PRهای فرانت

---

## روش به‌روزرسانی

1. بعد از merge هر PR فرانت، این فایل sync شود.
2. آیتم‌های done به چک‌شده یا بخش "انجام‌شده‌های اخیر" منتقل شوند.
3. آیتم‌های roadmapی به `frontend-vue/IMPLEMENTATION_PLAN.md` منتقل شوند.

---

**آخرین به‌روزرسانی:** 2026-02-19

