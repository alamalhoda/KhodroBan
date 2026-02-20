# 🎨 Frontend Vue - KhodroBan

نسخه اصلی UI پروژه با `Vue 3 + Vite + Pinia + Vue Router`.

---

## وضعیت فعلی

بر اساس PRهای اخیر:

- صفحات اصلی `Auth`, `Dashboard`, `Vehicles`, `Services`, `Reminders`, `Reports` و **مشاور هوشمند (Smart Assistant)** به backend Django متصل هستند.
- فرم یادآور و بخش «ایجاد یادآور» در افزودن سرویس/هزینه از کامپوننت‌های مشترک بازه زمانی و کیلومتری (`ReminderTimeIntervalFields`, `ReminderKmIntervalFields`) استفاده می‌کنند.
- بهبودهای مهم UX در reminders/service list اعمال شده‌اند (Date Picker شمسی، فیلتر خودرو، pagination، retry states).
- i18n (fa/en/ar) فعال است.
- زیرساخت تست (Vitest) فعال و برای چند view/component/store پوشش مناسب دارد.

---

## اجرا

```bash
cd frontend-vue
npm install
npm run dev
```

پورت پیش‌فرض: `5174`

---

## تنظیم Backend

در `.env.local`:

```env
VITE_BACKEND_TYPE=django
VITE_API_URL=http://127.0.0.1:8000/api
```

گزینه‌های معمول:

- `VITE_BACKEND_TYPE=django`
- `VITE_BACKEND_TYPE=supabase`

---

## اسکریپت‌های مهم

- `npm run dev` اجرای محیط توسعه
- `npm run build` بیلد production
- `npm run preview` پیش‌نمایش بیلد
- `npm run test:run` اجرای تست‌ها یک‌باره
- `npm run test:watch` اجرای تست در حالت watch

---

## ساختار کلیدی

```text
frontend-vue/
├── src/components/
├── src/views/
├── src/stores/
├── src/services/
├── src/composables/
├── src/locales/
└── docs/
```

---

## وضعیت برنامه‌ریزی

- Roadmap اصلی: `frontend-vue/IMPLEMENTATION_PLAN.md`
- TODO اجرایی فرانت: `frontend-vue/TODO.md`
- TODO مرکزی پروژه: `../TODO.md`
- TODOهای موضوعی فرانت: `frontend-vue/docs/*.md`
