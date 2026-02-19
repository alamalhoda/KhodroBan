# طرح اجرایی پروژه KhodroBan (نسخه همگام با واقعیت)

**آخرین به‌روزرسانی:** 2026-02-19  
**مبنای وضعیت:** PRهای merge شده تا `#37` روی `develop`

---

## 1) جایگاه فعلی پروژه

- مسیر عملیاتی محصول: `Django + Vue` (backend-first).
- قابلیت‌های فعال:
  - Auth, Vehicles, Services, Reminders, Notifications, Reports
  - Expense flow در AddService
  - AI Assistant با تاریخچه گفتگو و context خودرو/سرویس/هزینه
- مسیر Reminder/Notification در Django کامل شده (Outbox + Dispatcher).
- مسیر offline frontend فعال است، اما release readiness کامل نشده است.

---

## 2) هدف 90 روز آینده

### فاز A (هفته 1 تا 4) — پایداری جریان اصلی

- تکمیل Expense flow به صورت مستقل (list/manage)
- تعریف regression smoke flow برای جلوگیری از شکستن مسیرهای اصلی
- کاهش خطاهای بحرانی در PRهای توسعه

### فاز B (هفته 5 تا 8) — اعلان و آمادگی انتشار

- عملیاتی‌سازی Settings برای اعلان‌ها (اولویت با Telegram)
- تعیین scope اجرایی Push/SMS
- تکمیل PWA release checklist

### فاز C (هفته 9 تا 12) — کیفیت و مقیاس‌پذیری

- افزایش پوشش تست viewهای پرریسک
- یکدست‌سازی i18n و کاهش ناهمگونی پیام‌ها
- آماده‌سازی backlog ویژگی‌های Pro بدون شکستن MVP فعلی

---

## 3) اولویت‌های تصمیم‌گیری محصول

1. **قابلیت اتکا در جریان اصلی کاربر**  
   (ثبت/پیگیری سرویس و هزینه + یادآور)
2. **پایداری و شفافیت اعلان‌ها از دید کاربر**
3. **آمادگی انتشار PWA**
4. **پوشش تست و کاهش ریسک regression**
5. **گسترش قابلیت‌های Pro**

---

## 4) شاخص‌های موفقیت

- smoke flow اصلی در PRها قابل اجرا و پایدار باشد.
- Settings اعلان از حالت نمایشی خارج شود.
- PWA checklist با evidence واقعی تکمیل شود.
- صفحات ریسکی تست‌های حیاتی داشته باشند.
- اختلاف بین مستندات و وضعیت واقعی هر اسپرینت کاهش یابد.

---

## 5) ریسک‌ها و کنترل‌ها

- **ریسک drift مستندات:**  
  کنترل: بعد از هر PR، همزمان `TODO.md` + TODO دامنه‌ای + contract registry به‌روزرسانی شود.
- **ریسک legacy pathها:**  
  کنترل: backend-first path به‌عنوان مرجع رسمی حفظ شود؛ مسیرهای legacy فقط با برچسب روشن.
- **ریسک تاخیر در release readiness:**  
  کنترل: شکستن PWA checklist به آیتم‌های قابل تحویل هفتگی.

---

## 6) آرشیو خلاصه تصمیم‌ها (بدون تناقض)

این بخش صرفا milestoneهای تاییدشده را نگه می‌دارد:

- `PR #31`: عملیاتی‌سازی expense tab + reusable reminder interval components
- `PR #32`: بهبود ناوبری UI (header/sidebar)
- `PR #35`: offline track و سیاست بدون CDN
- `PR #36`: تکمیل reminder/notification backend phase 1-4
- `PR #37`: AI Assistant backend-first

جزئیات تاریخی قدیمی که ممکن است با وضعیت فعلی تضاد داشته باشد، از این سند حذف شده است.

---

## 7) اسناد مرجع اجرا

- `TODO.md`
- `frontend-vue/TODO.md`
- `backend/django/TODO.md`
- `frontend-vue/IMPLEMENTATION_PLAN.md`
- `docs/development/API_CONTRACT_REGISTRY.md`
- `docs/development/PAGE_REVIEW_LOG.md`
