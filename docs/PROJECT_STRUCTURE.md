# 📁 ساختار پروژه KhodroBan (خودروبان)

این سند ساختار کامل پروژه و نحوه سازمان‌دهی فایل‌ها را توضیح می‌دهد.

**آخرین به‌روزرسانی:** 2026-02-20

---

## 🌳 ساختار کلی (Monorepo)

```
OilChenger/
│
├── 📄 README.md                          # معرفی کلی پروژه
├── 📄 TODO.md                            # TODO مرکزی پروژه
│
├── 📂 backend/django/                    # Backend اصلی (Django + DRF + Huey)
│   ├── khodroban/                        # مدل‌ها، APIها، views، مدیریت
│   ├── reminders/                        # Outbox emit یادآوری‌ها
│   ├── notifications/                    # OutboxConsumer، ارسال نوتیفیکیشن
│   ├── ai_assistant/                     # سشن/پیام چت AI، context، providerها
│   ├── khodroban_prj/                    # تنظیمات Django
│   ├── manage.py
│   ├── pytest.ini
│   └── README.md                         # راهنمای Backend
│
├── 📂 frontend-vue/                      # Frontend اصلی (Vue 3 + Vite + Pinia)
│   ├── src/                              # components، views، stores، services
│   ├── public/                           # فایل‌های استاتیک
│   ├── docs/                             # مستندات فنی فرانت
│   ├── IMPLEMENTATION_PLAN.md
│   ├── TODO.md
│   └── README.md                         # راهنمای Frontend
│
├── 📂 shared/                            # سرویس‌های مشترک (auth، report، ai، …)
├── 📂 supabase/                          # Edge functions و artifacts قبلی
├── 📂 reminder-service/                  # آرشیو — منسوخ (Django جایگزین)
│
├── 📂 docs/                              # مستندات پروژه
│   ├── product/                          # مستندات محصول
│   ├── strategy/                         # project-plan.md، اهداف و فازها
│   ├── deployment/                       # DOCKER_DEPLOYMENT، CHABOKAN_NET
│   ├── development/                      # API_CONTRACT_REGISTRY، PAGE_REVIEW_LOG
│   ├── technical/                        # reminder-system، django-management-commands، …
│   ├── presentations/
│   ├── research/
│   └── tutorials/                        # pull-request-guide و …
│
└── 📂 scripts/                           # manage-branches، create-pr، standalone-*
```

---

## 📂 توضیح هر بخش

### 📄 README.md

فایل اصلی پروژه که شامل:

- معرفی کلی پروژه
- لینک به مستندات مهم
- دستورالعمل نصب و راه‌اندازی

---

### 📂 docs/

#### 📂 product/

مستندات مرتبط با محصول:

- معرفی محصول
- ویژگی‌ها و قابلیت‌ها
- نقشه راه محصول

#### 📂 strategy/

استراتژی و برنامه‌ریزی:

- اهداف کوتاه‌مدت و بلندمدت
- فازبندی پروژه
- معیارهای موفقیت (KPIs)
- ریسک‌ها و چالش‌ها

#### 📂 presentations/

ارائه‌های محصول برای مخاطبان مختلف:

- **pitch-deck-investors.md**: ارائه ۱۰ دقیقه‌ای برای سرمایه‌گذاران (جذب سرمایه)
- **detailed-deck-technical.md**: ارائه تفصیلی فنی و استراتژیک (۲۰-۳۰ دقیقه)
- تمام فایل‌ها آماده برای استفاده در Gamma.app
- Theme: Glassmorphism، راست‌چین، فارسی

#### 📂 research/

تحقیقات بازار:

- تحلیل رقبا
- تحقیقات کاربری (آینده)
- مطالعات بازار (آینده)

#### 📂 deployment/

مستندات استقرار:

- **DOCKER_DEPLOYMENT.md**: راهنمای دو نوع استقرار Docker
  - نوع ۱: استاندارد (Multi-Container با compose)
  - نوع ۲: تک‌تصویری (All-in-One، یک image)
- **CHABOKAN_NET.md**: راهنمای deploy به پلتفرم chabokan.net

#### 📂 technical/

مستندات فنی:

- معماری سیستم
- راهنمای راه‌اندازی Backend
- راهنمای راه‌اندازی Frontend
- استراتژی مدیریت کنترل ورژن (Monorepo)
- راهنمای Deploy بخش‌های Monorepo
- مستندات API
- طراحی دیتابیس
- راهنماهای توسعه

---

### 📂 backend/django/

Backend اصلی پروژه (Django + DRF):

- **khodroban**: مدل‌ها، APIها (Auth، Vehicles، Services، Expenses، Reminders، Reports، Notifications)، views
- **reminders**: Outbox emit یادآوری‌ها (run_check_reminders)
- **notifications**: OutboxConsumer، process_outbox، ChannelDispatcher
- **ai_assistant**: سشن/پیام چت AI، context builder، providerهای OpenAI/OpenRouter/Z.ai
- تست‌ها در `khodroban/tests/` و `ai_assistant/tests/` با pytest

برای جزئیات به `backend/django/README.md` مراجعه کنید.

---

### 📂 frontend-vue/

Frontend وب (Vue 3 + Vite + Pinia) شامل:

- کامپوننت‌های UI (components/ui، features، layout)
- صفحات (views) و Vue Router
- State management (Pinia stores)
- سرویس‌های API (متصل به Django با VITE_BACKEND_TYPE=django)
- i18n (fa/en/ar)
- PWA foundation (فاز بعدی: icons، Lighthouse، A2HS)
- تست‌ها با Vitest در `src/**/*.test.js`

**ویژگی کلیدی**: طراحی واکنش‌گرا، مسیر اصلی محصول روی Django فعال است.

برای جزئیات به `frontend-vue/README.md` مراجعه کنید.

---

### 📂 shared/ و reminder-service/

- **shared/**: سرویس‌های مشترک (auth، report، vehicle، notification و …) برای frontend و backend modes
- **reminder-service/**: آرشیو و منسوخ — مسیر فعلی Django + Outbox است. ر.ک. `docs/technical/reminder-system-status.md`

---

### 📂 scripts/

اسکریپت‌های کمکی برای:

- ساخت و deploy
- تست خودکار
- تولید داده نمونه
- ابزارهای کمکی دیگر

---

## 🔄 مدیریت کنترل ورژن

پروژه از **Monorepo** (یک Git repository مشترک) استفاده می‌کند. تمام بخش‌ها (Backend، Frontend، Docs) در یک repository قرار دارند.

**نکته مهم**: هر پروژه (`backend/` و `frontend/`) می‌تواند `.gitignore` خودش را داشته باشد تا فایل‌های خاص آن پروژه (مثل `node_modules/` در frontend یا `venv/` در backend) ignore شوند.

برای اطلاعات بیشتر به [استراتژی مدیریت کنترل ورژن](./technical/version-control-strategy.md) مراجعه کنید.

---

## 🔄 نحوه استفاده

### افزودن مستندات جدید

1. **مستندات محصول**: در `docs/product/`
2. **تحقیقات**: در `docs/research/`
3. **مستندات فنی**: در `docs/technical/`

### افزودن کد جدید

1. **Backend**: در `backend/django/` — در اپ مربوطه (khodroban، reminders، notifications، ai_assistant)
2. **Frontend**: در `frontend-vue/src/` با ساختار Vue 3 (components، views، stores، services)

---

## 📝 قوانین نام‌گذاری

### فایل‌های Markdown

- استفاده از `kebab-case`: `project-plan.md`
- استفاده از emoji برای وضوح بیشتر: `🎯 goal.md`

### پوشه‌ها

- استفاده از `lowercase`: `docs/`, `backend/`
- نام‌های واضح و توصیفی

---

## 🔍 جستجو در پروژه

- **مستندات**: در پوشه `docs/`
- **کد Backend**: در پوشه `backend/django/` (khodroban، reminders، notifications، ai_assistant)
- **کد Frontend**: در پوشه `frontend-vue/src/`
- **تست Backend**: `backend/django/khodroban/tests/`، `ai_assistant/tests/` (pytest)
- **تست Frontend**: `frontend-vue/src/**/*.test.js` (Vitest)

---

## 🆕 افزودن بخش جدید

اگر نیاز به بخش جدیدی دارید:

1. پوشه جدید را در محل مناسب ایجاد کنید
2. یک `README.md` برای آن بخش بنویسید
3. این فایل را به‌روزرسانی کنید

---

## 📚 منابع بیشتر

- [استراتژی پروژه](./strategy/project-plan.md)
- [معرفی محصول](./product/overview.md)
- [تحلیل رقبا](./research/competitors/list.md)
- [استراتژی مدیریت کنترل ورژن](./technical/version-control-strategy.md)
