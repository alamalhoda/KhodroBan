# TODO - Frontend Vue (KhodroBan)

این فایل برای کارهای اجرایی کوتاه‌مدت فرانت (`frontend-vue`) است.
نقشه راه بلندمدت همچنان در `frontend-vue/IMPLEMENTATION_PLAN.md` نگه‌داری می‌شود.

---

## نسبت با سایر مستندات

- `frontend-vue/IMPLEMENTATION_PLAN.md` = Roadmap و برنامه فازبندی
- `frontend-vue/TODO.md` (این فایل) = کارهای قابل اجرا در اسپرینت جاری/بعدی
- `../TODO.md` = نمای کلی پروژه و اولویت‌های بین‌بخشی

---

## ✅ انجام‌شده‌های اخیر (خلاصه)

- Reminders Phase 1/2: باگ‌فیکس + Date Picker شمسی + Retry/Error/Loading
- Service List: فیلتر خودرو + صفحه‌بندی + ویرایش/حذف
- Service Presets: دریافت از API و اتصال در Add Service
- Reports: داده واقعی + فیلتر بازه/خودرو + خروجی CSV
- بهبود تاریخ شمسی و برخی UXهای مدیریت خودرو

---

## 🔴 اولویت بالا (Sprint فعلی)

### 1) تکمیل Expense Management UI
- [ ] تکمیل اتصال `expenseStore` به `expenseService` در همه سناریوها
- [ ] تکمیل فرم افزودن/ویرایش هزینه با UX هم‌سطح سرویس
- [ ] تکمیل لیست هزینه با فیلتر پایه و مدیریت خطا/empty/loading
- [ ] افزودن تست واحد/Integration برای flow هزینه

### 2) تکمیل تنظیمات کانال‌های یادآوری (UI)
- [ ] تکمیل UX تنظیمات کانال‌ها در `SettingsView`
- [ ] تکمیل جریان Telegram در فرانت (اتصال، خطا، وضعیت)
- [ ] تعریف placeholder اجرایی برای SMS/Push تا زمان تکمیل backend

### 3) Regression تست جریان اصلی کاربر
- [ ] تعریف smoke flow: login -> vehicles -> services/expenses -> reminders -> reports
- [ ] اجرای تست‌های حداقلی قابل تکرار برای هر PR فرانت

---

## 🟡 اولویت متوسط

### 1) تکمیل i18n باقی‌مانده
- [ ] مرور و تکمیل ترجمه‌های Service/Expense/Settings
- [ ] یکسان‌سازی پیام‌های خطا و success در localeها

### 2) PWA Release Readiness
- [ ] جایگزینی iconهای placeholder
- [ ] اجرای Lighthouse برای PWA و ثبت نتیجه
- [ ] تست Add to Home Screen روی Android/iOS/Desktop

### 3) بهبود UX یادآور بعد از ثبت سرویس/هزینه
- [ ] تصمیم نهایی برای مدل UX (مودال بعد از ثبت یا مودال با checkbox)
- [ ] پیاده‌سازی نهایی و تست سناریوهای اصلی

### 4) مهاجرت `group_name` به کد انگلیسی
- [ ] اجرای برنامه `docs/TODO_GROUP_NAME_MIGRATION.md`
- [ ] همگام‌سازی i18n و UI tags پس از مهاجرت

---

## 🟢 Backlog (آینده)

- [ ] Reports PDF export (Pro)
- [ ] بهبود Settings کامل (پروفایل/امنیت)
- [ ] تکمیل Smart Assistant integration
- [ ] بهبودهای پیشرفته UX (global search, bulk actions)

---

## 🧪 Testing Debt

- [ ] افزایش پوشش تست viewها: `ReportsView`, `SettingsView`, `SmartAssistantView`
- [ ] تکمیل تست composableهای کلیدی
- [ ] تعریف یک استاندارد حداقلی coverage برای PRهای فرانت

---

## روش به‌روزرسانی

1. هر PR فرانت که merge شد، آیتم‌های مرتبط را در همین فایل به‌روز کن.
2. آیتم‌های تمام‌شده را یا تیک بزن یا به بخش «انجام‌شده‌های اخیر» منتقل کن.
3. اگر آیتمی ماهیت roadmap داشت، به `IMPLEMENTATION_PLAN.md` منتقل شود.

---

**آخرین به‌روزرسانی:** 2026-02-14

