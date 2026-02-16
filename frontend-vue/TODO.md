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

- **یادآور – کامپوننت‌های قابل استفاده مجدد:** استخراج `ReminderTimeIntervalFields` و `ReminderKmIntervalFields` از فرم یادآور؛ استفاده در `ReminderForm` و در `AddServiceView` (تب سرویس و تب هزینه) زیر چک‌باکس «ایجاد یادآور» با همان منطق موعد و هشدار.
- **Expense Tab (add-service):** اتصال `expenseStore` به `expenseService` (create/update/delete)، فیلد تاریخ تب هزینه، اعتبارسنجی، متن جداگانه یادآور، Quick chips (سوخت/پارکینگ/عوارض/کارواش)، آپلود رسید (preview + validation)، پریست‌های تکرارشونده (بیمه/معاینه/سرویس قراردادی)، تست‌های view و store
- Backend: parse تاریخ هزینه (ISO + شمسی) در serializer، تست‌های API (create با ISO/شمسی، رد amount≤0 و vehicleId نامعتبر)
- Reminders Phase 1/2: باگ‌فیکس + Date Picker شمسی + Retry/Error/Loading
- Service List: فیلتر خودرو + صفحه‌بندی + ویرایش/حذف
- Service Presets: دریافت از API و اتصال در Add Service
- Reports: داده واقعی + فیلتر بازه/خودرو + خروجی CSV
- بهبود تاریخ شمسی و برخی UXهای مدیریت خودرو
- **مشاور هوشمند (Smart Assistant):** اتصال کامل به Django AI API؛ تاریخچه گفتگوها (لیست سشن‌ها + انتخاب سشن)، گفتگوی جدید، ارسال `vehicle_id` خودروی انتخاب‌شده در هر پیام؛ i18n برای newChat/chatHistory. ر.ک. `docs/technical/ai-assistant-architecture.md`.

---

## 🔴 اولویت بالا (Sprint فعلی)

### 1) تکمیل Expense Management UI
- [x] تکمیل اتصال `expenseStore` به `expenseService` در همه سناریوها
- [x] تکمیل فرم افزودن هزینه در تب هزینه با UX هم‌سطح سرویس (تاریخ، دسته، مبلغ، Quick chips، رسید، یادآور)
- [ ] تکمیل لیست هزینه با فیلتر پایه و مدیریت خطا/empty/loading
- [x] افزودن تست واحد/Integration برای flow هزینه (AddServiceView + expense store + test_api_expenses)

### 2) تکمیل تنظیمات کانال‌های یادآوری (UI)
- **زمینه:** Backend یادآوری/نوتیفیکیشن (فازهای ۱–۴) انجام شده؛ Notification API و ChannelDispatcher با fallback (telegram فعال؛ Email/SMS/Push stub). ر.ک. `docs/technical/reminder-system-status.md`.
- [ ] تکمیل UX تنظیمات کانال‌ها در `SettingsView` (اتصال به NotificationPreference در صورت نیاز)
- [ ] تکمیل جریان Telegram در فرانت (اتصال، خطا، وضعیت)
- [ ] تعریف placeholder یا اتصال برای SMS/Push (backend اسکلت/stub آماده است)

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
- [x] استفاده از همان کامپوننت‌های بازه زمانی/کیلومتری زیر چک‌باکس در AddServiceView (تب سرویس و هزینه)؛ منطق یکسان با صفحه تعریف یادآور
- [ ] در صورت نیاز: مودال بعد از ثبت یا بهبودهای بعدی

### 4) مهاجرت `group_name` به کد انگلیسی
- [ ] اجرای برنامه `docs/TODO_GROUP_NAME_MIGRATION.md`
- [ ] همگام‌سازی i18n و UI tags پس از مهاجرت

---

## 🟢 Backlog (آینده)

- [ ] Reports PDF export (Pro)
- [ ] بهبود Settings کامل (پروفایل/امنیت)
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

**آخرین به‌روزرسانی:** 2026-02-16 (Smart Assistant: تاریخچه، گفتگوی جدید، vehicle_id)

