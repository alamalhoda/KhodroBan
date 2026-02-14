# TODO: کارهای باقی‌مانده پروژه

این فایل مرجع مرکزی TODOهای پروژه است و با بررسی وضعیت سورس کد و ۱۰ PR اخیر (`#21` تا `#30`) به‌روز شده است.

---

## 🔄 همگام‌سازی اخیر (2026-02-14)

### ✅ انجام‌شده‌های مهم (Recent Done)

- ✅ `PR #30`: تکمیل فاز ۲ یادآورها (Date Picker شمسی، Retry/Error/Loading، تست‌های فرم/ویو/utility)
- ✅ `PR #29`: باگ‌فیکس فاز ۱ یادآورها + تست‌های API و store
- ✅ `PR #28`: بهبود مدیریت خودرو، پشتیبانی تاریخ شمسی، `VehicleFilterSelect` و `PersianDatePicker`
- ✅ `PR #27`: نرمال‌سازی DB (PK=`id`، بهبود `related_name`، `ServiceItem`)
- ✅ `PR #26`: Service Presets + بهبود `ServiceListView` (فیلتر خودرو، صفحه‌بندی، ویرایش/حذف)
- ✅ `PR #25`: تکمیل Add-Service در Django (types/items، seed، `VehicleKmHistory`)
- ✅ `PR #24`: Reports با داده واقعی + فیلتر + CSV
- ✅ `PR #23`: تثبیت MVP برای Django-only flow
- ✅ `PR #22`: enforce مسیر PR-only به develop
- ✅ `PR #21`: ادغام بزرگ Vue UI + i18n + PWA foundation + Smart Assistant

---

## 🔴 اولویت بالا (Sprint فعلی)

### 1) تکمیل Expense Management در فرانت

- **وضعیت:** 📝 در انتظار
- **توضیح:** فرم/لیست/ویرایش هزینه در UI هنوز نسبت به Services/Reminders عقب‌تر است.
- **خروجی مورد انتظار:**
  - اتصال کامل `expenseStore` به `expenseService`
  - صفحات افزودن/ویرایش/لیست هزینه با UX کامل
  - تست واحد/Integration برای flow هزینه

### 2) تکمیل کانال‌های یادآوری چندگانه

- **وضعیت:** 📝 در انتظار
- **توضیح:** In-App آماده است، اما Telegram/SMS/Push هنوز کامل نشده‌اند.
- **خروجی مورد انتظار:**
  - UI تنظیم کانال‌ها در Settings
  - تکمیل جریان Telegram end-to-end
  - تعریف scope مشخص برای Push/SMS

### 3) بسته تست یکپارچگی End-to-End (Backend + Frontend)

- **وضعیت:** 📝 در انتظار
- **توضیح:** تست‌های واحد/بخشی وجود دارد، اما regression end-to-end کافی نیست.
- **خروجی مورد انتظار:**
  - تست سناریوهای اصلی: login -> vehicle -> service/expense -> reminder -> reports
  - smoke tests قابل اجرا در CI

### 4) تکمیل PWA Release Readiness

- **وضعیت:** 📝 در انتظار
- **توضیح:** foundation کامل است ولی آیکون واقعی و تست Lighthouse/A2HS باقی مانده.
- **خروجی مورد انتظار:**
  - جایگزینی iconهای placeholder
  - تست Lighthouse (PWA)
  - تست Add to Home Screen در Android/iOS/Desktop

### 5) تثبیت Auth Issues باقی‌مانده

- **وضعیت:** 🔍 در حال بررسی
- **مرجع:** `frontend-vue/docs/AUTH_ISSUES_TODO.md`
- **خروجی مورد انتظار:** حذف رفتارهای non-deterministic در login و race/timeout edge cases

---

## 🟡 اولویت متوسط

### 1) migration `group_name` به کد انگلیسی

- **وضعیت:** 📝 در انتظار
- **مرجع:** `frontend-vue/docs/TODO_GROUP_NAME_MIGRATION.md`

### 2) Reports PDF export (Pro backlog)

- **وضعیت:** 📝 در انتظار
- **توضیح:** CSV سمت کلاینت فعال است؛ PDF فعلا backlog است.

### 3) تکمیل صفحه Settings

- **وضعیت:** 📝 در انتظار
- **توضیح:** بخش Telegram وصل است اما تنظیمات کامل پروفایل/کانال‌ها تکمیل نشده است.

### 4) پوشش تست کامپوننت‌های باقی‌مانده

- **وضعیت:** 📝 در انتظار
- **توضیح:** برخی Viewها مثل Reports/Settings/SmartAssistant هنوز پوشش تست کامل ندارند.

---

## 🟢 اولویت پایین / آینده

- Smart Assistant: تکمیل اتصال عملیاتی end-to-end
- Upgrade/Subscription flow
- Export/Import پیشرفته داده
- قابلیت‌های پیشرفته UX (global search، bulk actions)

---

## 🧱 Technical Debt

- هم‌راستاسازی کامل مستندات قدیمی با وضعیت واقعی (پراکندگی TODOهای قدیمی)
- کاهش موارد تکراری در `frontend-vue/IMPLEMENTATION_PLAN.md`
- تعریف معیار ثابت برای "Done" در Page Review Log

---

## 🎯 پیشنهاد عملیاتی دو اسپرینت بعدی

### Sprint 1 (تمرکز: تکمیل جریان مالی)

1. Expense Management کامل (UI + Store + Tests)
2. تکمیل Regression تست برای flow اصلی
3. آپدیت API/PAGE logs بعد از تکمیل

### Sprint 2 (تمرکز: اعلان و انتشار)

1. Multi-channel reminders (ابتدا Telegram)
2. PWA readiness (icons + Lighthouse + A2HS)
3. بستن Auth edge cases

---

## 🔗 لینک‌های مرجع

- `frontend-vue/IMPLEMENTATION_PLAN.md`
- `docs/development/PAGE_REVIEW_LOG.md`
- `docs/development/API_CONTRACT_REGISTRY.md`
- `backend/django/TODO.md`
- `frontend-vue/TODO.md`

---

**آخرین به‌روزرسانی:** 2026-02-14 (بر پایه بررسی PR #21 تا #30)
