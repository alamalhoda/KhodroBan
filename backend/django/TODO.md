# TODO - Backend Django (KhodroBan)

به‌روزرسانی‌شده بر اساس وضعیت فعلی کد و PRهای اخیر (`#21` تا `#30`).

---

## ✅ انجام‌شده‌های اخیر

- تست‌های API مربوط به `reports` تکمیل و پایدار شد.
- API و تست‌های `reminders` گسترش یافت (CRUD، dismiss، by_vehicle، user list).
- `ServicePreset` و endpoint مربوط اضافه شد.
- ساختار مدل‌ها برای PK/related_name نرمال شد (`id`, `ServiceItem`).
- مسیر ثبت سرویس با `types/items` و ثبت `VehicleKmHistory` تکمیل شد.

---

## 🔴 اولویت بالا

- [ ] تکمیل تست‌های API برای `telegram-settings` و webhook با سناریوهای خطا
- [ ] تکمیل تست‌های امنیتی/سخت‌گیری برای CORS و auth error flows
- [ ] اضافه‌کردن health check endpoint ساده برای مانیتورینگ
- [ ] تعریف regression suite سریع برای endpointهای بحرانی (`auth`, `vehicles`, `services`, `reminders`, `reports`)

---

## 🟡 اولویت متوسط

- [ ] مستندسازی OpenAPI/Swagger (drf-spectacular یا معادل)
- [ ] rate limiting برای endpointهای حساس
- [ ] بهبود logging ساختاریافته (request id / error context)
- [ ] آماده‌سازی سناریوهای تست export/report در صورت اضافه شدن PDF

---

## 🟢 آینده

- [ ] کانال‌های اعلان تکمیلی (SMS/Push) در backend
- [ ] endpointهای پرداخت/اشتراک برای Upgrade (در صورت نهایی شدن scope)

---

**آخرین به‌روزرسانی:** 2026-02-14
