# TODO - Backend Django (KhodroBan)

این فایل بر اساس وضعیت واقعی کد و PRهای merge شده تا `#37` به‌روز شده است.

---

## ✅ انجام‌شده‌های اخیر

- **AI Assistant (PR #37):** اپ `ai_assistant` با مدل‌های `ChatSession`/`ChatMessage`، API سشن و پیام، `vehicle_id` اختیاری، Context Builder، Memory Service، Provider Factory (`openai/openrouter/zai`) و throttle.
- **Reminder/Notification (PR #36):** معماری Outbox، Notification API کامل، ChannelDispatcher با fallback، مدل‌های delivery/preference و مسیر آرشیو `reminder-service`.
- **Offline track و contractهای مرتبط (PR #35):** هم‌راستاسازی چند بخش backend/frontend contract (icon color secondary و asset policy).
- **Expense flow integration (PR #31):** بهبود serializerها و تست‌های API هزینه.
- **Reports/Services/Reminders:** APIها و تست‌های عملیاتی در وضعیت پایدار MVP هستند.

---

## 🔴 اولویت بالا

- [ ] تکمیل تست‌های API برای `telegram-settings` و `POST /telegram/webhook/` با سناریوهای خطا/edge.
- [ ] تعریف regression suite سریع برای endpointهای بحرانی:
  - [ ] `auth`
  - [ ] `vehicles`
  - [ ] `services`
  - [ ] `expenses`
  - [ ] `reminders`
  - [ ] `reports`
- [ ] تکمیل تست‌های امنیتی (auth error flows, permission boundaries, abuse cases).

---

## 🟡 اولویت متوسط

- [ ] مستندسازی OpenAPI/Swagger (ترجیحا `drf-spectacular`).
- [ ] سخت‌گیری بیشتر rate limit برای endpointهای حساس (AI/auth/report-heavy).
- [ ] بهبود logging ساختاریافته (request-id, correlation-id, error context).
- [ ] آماده‌سازی contract سمت backend برای export PDF (فعلا backlog).

---

## 🟢 آینده

- [ ] اتصال providerهای واقعی Email/SMS/Push (اسکلت آماده است).
- [ ] endpointهای Upgrade/Subscription بعد از نهایی‌شدن scope محصول.

---

## 🔗 اسناد مرتبط

- `backend/django/README.md`
- `docs/development/API_CONTRACT_REGISTRY.md`
- `docs/technical/reminder-system-status.md`
- `docs/technical/notification-channel-providers.md`
- `docs/technical/ai-assistant-architecture.md`

---

**آخرین به‌روزرسانی:** 2026-02-20
