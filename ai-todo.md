## TODOهای سرویس هوش مصنوعی (AI)

این فایل وضعیت واقعی و backlog فعلی AI Assistant را تا بعد از `PR #37` نگه می‌دارد.

---

## 1) وضعیت واقعی فعلی (Backend-first)

### ✅ انجام‌شده

- مسیر اصلی AI روی Django فعال است:
  - `GET/POST /api/ai/sessions/`
  - `GET /api/ai/sessions/<id>/messages/`
  - `POST /api/ai/sessions/<id>/messages/send/`
  - `GET /api/ai/providers/`
- در `send_message` امکان ارسال `vehicle_id` وجود دارد و context شامل:
  - خودروی انتخاب‌شده
  - آخرین سرویس‌ها
  - آخرین هزینه‌ها
- تاریخچه گفتگو در دیتابیس ذخیره می‌شود (Session/Message).
- فرانت در `SmartAssistantView`:
  - لیست تاریخچه گفتگو
  - انتخاب سشن
  - شروع گفتگوی جدید
  - ارسال پیام با `vehicle_id`
- providerهای backend: `openai`, `openrouter`, `zai`.
- مستندات فنی همگام موجود است:
  - `docs/technical/ai-assistant-architecture.md`
  - `docs/development/API_CONTRACT_REGISTRY.md`

---

## 2) اولویت‌های باز (High Priority)

- [ ] افزایش پوشش تست فرانت برای `SmartAssistantView` (UI flow کامل، session switch، error state).
- [ ] بهبود UX خطاها (rate limit/timeout/provider error) با پیام‌های دقیق‌تر و recoverable action.
- [ ] ثبت telemetry پایه برای خطاهای AI (backend log context + frontend trace id ساده).

---

## 3) اولویت متوسط

- [ ] تعریف policy واضح برای سوالات off-topic:
  - ادامه صرفا با prompt steering (وضعیت فعلی)، یا
  - افزودن validator ساده قبل از orchestrator.
- [ ] اضافه کردن تست‌های performance سبک برای سنجش latency API AI در سناریوهای معمول.
- [ ] مستندسازی سناریوهای fallback provider در محیط staging/production.

---

## 4) آینده / اختیاری

- [ ] بررسی افزودن provider جدید (در صورت نیاز واقعی کسب‌وکار).
- [ ] ابزار تبدیل پاسخ AI به action واقعی (ایجاد سرویس/یادآور با تایید کاربر).
- [ ] بهبود prompt tuning برای کاهش پاسخ‌های طولانی/کم‌دقت.

---

## 5) نکات اجرایی

- مسیر legacy مبتنی بر proxy فرانت، مبنای فعلی محصول نیست؛ مرجع اصلی، معماری backend-first است.
- هر تغییر در AI باید همزمان در این فایل، `frontend-vue/TODO.md` و `docs/development/API_CONTRACT_REGISTRY.md` منعکس شود.

---

**آخرین به‌روزرسانی:** 2026-02-19

