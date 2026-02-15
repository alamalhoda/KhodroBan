# TODO - Backend Django (KhodroBan)

به‌روزرسانی‌شده بر اساس وضعیت فعلی کد و PRهای اخیر (`#21` تا `#30`).

---

## ✅ انجام‌شده‌های اخیر

- **یادآوری/نوتیفیکیشن (فازهای ۱–۴):** Notification API کامل (list, unread_count, mark_as_read, mark_all_read, delete)؛ Outbox و appهای `reminders`/`notifications`؛ ChannelDispatcher با fallback (telegram→push→email→sms)؛ مدل‌های NotificationDelivery و NotificationPreference؛ process_pending_notifications با dispatcher؛ آرشیو reminder-service در مستندات. ر.ک. `docs/technical/reminder-system-status.md`.
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

- [ ] اتصال سرویس‌دهندگان واقعی برای Email/SMS/Push (اسکلت و stubها در Phase 3 آماده است؛ ر.ک. `docs/technical/notification-channel-providers.md`)
- [ ] endpointهای پرداخت/اشتراک برای Upgrade (در صورت نهایی شدن scope)

---

**آخرین به‌روزرسانی:** 2026-02-15
