# راهبرد تست (Testing Strategy)

## هدف

پس از هر تغییر در کد، با اجرای تست‌ها از درستی رفتار اطمینان حاصل کنیم. تست‌ها باید **سریع**، **قابل اعتماد** و **خوانا** باشند.

---

## سطوح تست

### ۱. تست واحد (Unit Tests)

**چه چیزی:** توابع، کامپوننت‌های کوچک، storeها به صورت ایزوله.

**فعلاً پیاده‌سازی شده:**
- `src/utils/formatters.test.js` — formatCurrency، formatNumber، formatDate، getRelativeTime
- `src/components/ui/Button.test.js`، `Input.test.js`، `Card.test.js`، `Modal.test.js`
- `src/stores/auth.test.js`، `vehicle.test.js`، `ui.test.js`، `dashboard.test.js` (با mock سرویس‌ها)

**اقدامات بعدی:**
- تست سایر storeها (service، reminder، expense و …)
- تست composableها (useToast، useFocusTrap و …)
- تست سرویس‌ها (با mock کردن axios / API)

---

### ۲. تست صفحه / View (Page / View Tests)

**چه چیزی:** یک صفحه (View) به صورت یک واحد؛ با mock کردن storeها و router، بررسی می‌کنیم که:
- در حالت‌های مختلف (loading، error، موفق) محتوای درست نمایش داده می‌شود
- رویدادها و ناوبری (مثلاً `router.push`) درست فراخوانی می‌شوند
- داده‌ها به زیرکامپوننت‌ها درست پاس داده می‌شوند

**مزیت:** بعد از هر تغییر در آن صفحه یا کامپوننت‌هایش، با یک دستور (`npm run test:run`) می‌توانید از نشکستن رفتار اصلی اطمینان بگیرید.

**فعلاً پیاده‌سازی شده:**
- `src/views/DashboardView.test.js` — تست کامل صفحه داشبورد (حالت loading، error، موفق، ناوبری و رویدادها)

**اقدامات بعدی:**
- تست مشابه برای صفحات دیگر (مثلاً LoginView، VehicleListView، RemindersView)
- در صورت نیاز، استفاده از `mount` واقعی (بدون stub) برای تست یکپارچه‌تر

---

### ۳. تست یکپارچه (Integration Tests)

**چه چیزی:** چند لایه با هم (مثلاً View + Store + سرویس mock‌شده) بدون mock کردن خود store.

**اقدامات پیشنهادی:**
- یک صفحه را با store واقعی و mock سرویس (مثلاً `dashboardService.getSummary`) تست کنید
- سناریوهای جریان کاربر (مثلاً ورود → داشبورد → لیست خودروها) در یک تست

---

### ۴. تست End-to-End (E2E)

**چه چیزی:** اجرای اپ در مرورگر واقعی و تست سناریوهای کامل کاربر (کلیک، پر کردن فرم، ناوبری).

**ابزار پیشنهادی:** Playwright یا Cypress.

**اقدامات پیشنهادی:**
- نصب و پیکربندی Playwright/Cypress
- یک سناریوی E2E برای ورود و مشاهده داشبورد
- در صورت امکان، اجرای E2E در CI روی یک مرورگر

---

## استفاده در کار روزمره

### بعد از هر تغییر در داشبورد

```bash
cd frontend-vue
npm run test:run
```

اگر همه تست‌ها (از جمله `DashboardView.test.js`) سبز باشند، تغییر شما رفتار اصلی داشبورد را نشکسته است.

### فقط تست داشبورد

```bash
npm run test:run -- --grep DashboardView
# یا
npm run test:run -- src/views/DashboardView.test.js
```

### حالت تماشا (Watch)

```bash
npm run test
# یا
npm run test:watch
```

با تغییر فایل‌ها، تست‌ها دوباره اجرا می‌شوند.

### گزارش پوشش (Coverage)

پکیج `@vitest/coverage-v8@2.1.9` نصب است. برای گزارش پوشش خط:

```bash
npm run test:coverage
```

خروجی متنی و HTML در پوشه `coverage/` ایجاد می‌شود.

---

## اصول نوشتن تست برای صفحات

1. **حالت‌ها را پوشش دهید:** loading، error، و حالت موفق (با داده خالی و با داده).
2. **رویدادها و ناوبری:** کلیک دکمه‌ها و اطمینان از فراخوانی `router.push` یا متدهای store با آرگومان درست.
3. **Mock حداقلی:** فقط router، i18n و storeهای آن صفحه را mock کنید تا تست سریع و پایدار بماند.
4. **نام‌گذاری واضح:** نام تست‌ها باید بگویند «چه شرطی» و «چه رفتاری انتظار می‌رود».

---

## خلاصه اقدامات پیشنهادی

| اقدام | سطح | اولویت |
|--------|------|--------|
| تست کامل صفحه داشبورد | View | ✅ انجام شده |
| تست store داشبورد | Unit | ✅ انجام شده |
| تست صفحه Login | View | بالا |
| تست صفحه لیست خودرو / جزئیات خودرو | View | بالا |
| تست سایر storeها (service، reminder، …) | Unit | متوسط |
| تست composableها | Unit | متوسط |
| Integration برای یک جریان (مثلاً Auth → Dashboard) | Integration | متوسط |
| راه‌اندازی E2E (Playwright/Cypress) | E2E | بعدی |

### اجرای خودکار در CI (قبل از merge)

تست‌های frontend-vue در **GitHub Actions** روی هر **push** و **pull request** به شاخه‌های `main` و `develop` اجرا می‌شوند (فقط وقتی فایل‌های داخل `frontend-vue/` تغییر کرده باشند).

- Workflow: `.github/workflows/ci-frontend-vue.yml`
- مرحله **Test:** `npm run test:run`
- مرحله **Build:** بعد از موفق تست‌ها، `npm run build`

اگر تست‌ها fail شوند، CI قرمز می‌شود و merge بدون رفع خطا توصیه نمی‌شود.

---

آخرین به‌روزرسانی: ۱۴۰۴/۱۱/۱۷
