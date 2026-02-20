# 📁 ساختار پروژه KhodroBan (خودروبان)

این سند ساختار کامل پروژه و نحوه سازمان‌دهی فایل‌ها را توضیح می‌دهد.

---

## 🌳 ساختار کلی

```
KhodroBan/
│
├── 📄 README.md                          # معرفی کلی پروژه
│
├── 📂 docs/                              # تمام مستندات پروژه
│   ├── 📂 product/                       # مستندات محصول
│   │   └── overview.md                  # معرفی محصول و ویژگی‌ها
│   │
│   ├── 📂 strategy/                      # استراتژی و برنامه‌ریزی
│   │   └── project-plan.md              # اهداف، فازبندی، KPIs
│   │
│   ├── 📂 presentations/                 # ارائه‌های محصول
│   │   ├── README.md                    # راهنمای ارائه‌ها
│   │   ├── pitch-deck-investors.md      # ارائه برای سرمایه‌گذاران (۱۰ دقیقه)
│   │   └── detailed-deck-technical.md   # ارائه تفصیلی فنی (۲۰-۳۰ دقیقه)
│   │
│   ├── 📂 research/                      # تحقیقات بازار و کاربری
│   │   └── 📂 competitors/              # تحلیل رقبا
│   │       ├── list.md                  # لیست کامل رقبا
│   │       ├── 📂 prompts/              # پرامپت‌های تحلیل
│   │       │   ├── identify-competitors.md
│   │       │   └── analyze-competitors.md
│   │       └── 📂 analysis/             # تحلیل‌های عمیق (آینده)
│   │
│   ├── 📂 tutorials/                     # مستندات آموزشی
│   │   ├── README.md                    # فهرست آموزش‌ها
│   │   ├── pull-request-guide.md        # راهنمای کامل Pull Request
│   │   └── pr-quick-start.md            # راهنمای سریع Pull Request
│   │
│   ├── 📂 deployment/                   # مستندات استقرار
│   │   ├── DOCKER_DEPLOYMENT.md       # دو نوع استقرار Docker (استاندارد + تک‌تصویری)
│   │   └── CHABOKAN_NET.md            # راهنمای deploy به chabokan.net
│   │
│   └── 📂 technical/                     # مستندات فنی
│       ├── backend-setup.md            # راهنمای Backend
│       ├── frontend-setup.md           # راهنمای Frontend
│       ├── version-control-strategy.md # استراتژی مدیریت کنترل ورژن
│       ├── deployment-monorepo.md      # راهنمای Deploy بخش‌های Monorepo
│       ├── 📂 api/                      # مستندات API
│       └── 📂 database/                 # طراحی دیتابیس
│
├── 📂 backend/                           # Backend API
│   ├── 📂 src/                          # کدهای اصلی
│   ├── 📂 tests/                        # تست‌ها
│   └── README.md                        # راهنمای Backend
│
├── 📂 frontend/                          # Frontend Web App (Vite + Svelte)
│   ├── 📂 src/                          # کدهای اصلی
│   ├── 📂 public/                       # فایل‌های استاتیک
│   └── README.md                        # راهنمای Frontend
└── 📂 scripts/                           # اسکریپت‌های کمکی
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

### 📂 backend/

کدهای Backend شامل:

- API endpoints
- منطق کسب‌وکار
- مدیریت دیتابیس
- سرویس‌ها

---

### 📂 frontend/

Frontend وب (Vite + Svelte) - **وب‌اپلیکیشن واکنش‌گرا** شامل:

- کامپوننت‌های UI (Svelte)
- صفحات و routing
- State management (Svelte Stores)
- سرویس‌های API
- استایل‌های واکنش‌گرا (Mobile-First)
- Service Worker و PWA (فاز ۲)

**ویژگی کلیدی**: طراحی کاملاً واکنش‌گرا که روی همه دستگاه‌ها (موبایل اندروید، iOS، تبلت و دسکتاپ) به صورت کامل و دقیق کار می‌کند.

برای جزئیات به [frontend-setup.md](./technical/frontend-setup.md) مراجعه کنید.

---

### 📂 mobile/

کدهای اپلیکیشن موبایل بومی (Flutter) شامل:

- صفحات (Screens)
- ویجت‌ها (Widgets)
- مدل‌ها (Models)
- سرویس‌ها (Services)

**نکته**: این بخش برای آینده در نظر گرفته شده است. در MVP و فاز ۱، از وب‌اپلیکیشن واکنش‌گرا استفاده می‌شود که روی موبایل نیز به صورت کامل کار می‌کند.

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

1. **Backend**: در `backend/src/` با ساختار مناسب
2. **Frontend**: در `frontend/src/` با ساختار Vite + Svelte - **وب‌اپلیکیشن واکنش‌گرا** (به [frontend-setup.md](./technical/frontend-setup.md) مراجعه کنید)
3. **Mobile**: در `mobile/lib/` با ساختار Flutter استاندارد (برای آینده)

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
- **کد Backend**: در پوشه `backend/src/`
- **کد Frontend**: در پوشه `frontend/src/` (آینده)
- **کد Mobile**: در پوشه `mobile/lib/`
- **تست‌ها**: در پوشه‌های `tests/` یا `test/`

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
