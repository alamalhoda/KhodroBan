# 🚗 KhodroBan (خودروبان)

اپلیکیشن مدیریت و نگهداری خودرو - یادآوری تعویض روغن و سرویس‌های دوره‌ای

---

## 📋 درباره پروژه

KhodroBan (خودروبان) یک وب‌اپلیکیشن واکنش‌گرا برای مدیریت نگهداری خودرو است که به کاربران کمک می‌کند:

- ثبت و مدیریت اطلاعات خودرو
- یادآوری هوشمند تعویض روغن و سرویس‌های دوره‌ای
- ثبت هزینه‌ها و پیگیری تاریخچه سرویس‌ها
- مدیریت چند خودرو

**ویژگی کلیدی**: طراحی کاملاً واکنش‌گرا که روی همه دستگاه‌ها (موبایل اندروید، iOS، تبلت و دسکتاپ) به صورت کامل و دقیق کار می‌کند.

[📖 اطلاعات بیشتر درباره محصول](./docs/product/overview.md)

---

## 🏗️ ساختار پروژه

```
KhodroBan/
├── docs/                    # مستندات پروژه
│   ├── product/            # مستندات محصول
│   ├── strategy/           # استراتژی و برنامه‌ریزی
│   ├── research/           # تحقیقات (تحلیل رقبا، کاربری)
│   └── technical/          # مستندات فنی
│       ├── backend-setup.md
│       ├── frontend-setup.md
│       ├── api/           # مستندات API
│       └── database/      # طراحی دیتابیس
├── backend/                # Backend API (Django)
│   ├── src/
│   └── tests/
├── frontend/               # Frontend Web (Vite + Svelte) - واکنش‌گرا
│   └── src/
└── scripts/                # اسکریپت‌های کمکی
```

---

## 📚 مستندات

- [📱 معرفی محصول](./docs/product/overview.md)
- [📈 استراتژی و برنامه‌ریزی](./docs/strategy/project-plan.md)
- [🔍 تحلیل رقبا](./docs/research/competitors/list.md)
- [🔧 راهنمای Backend](./docs/technical/backend-setup.md)
- [🌐 راهنمای Frontend](./docs/technical/frontend-setup.md) (نقشه راه)

---

## 🚀 شروع کار

### پیش‌نیازها

- Python 3.9+ (برای Backend با Django)
- PostgreSQL / MySQL (یا SQLite برای توسعه)
- Node.js 18+ و npm (برای Frontend)
- Git

### نصب

```bash
# کلون کردن پروژه
git clone <repository-url>
cd KhodroBan

# نصب وابستگی‌های Backend
cd backend
python -m venv venv
source venv/bin/activate  # در Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate

# نصب وابستگی‌های Frontend
cd ../frontend
npm install
```

برای راهنمای کامل:

- **Backend**: [backend/README.md](./backend/README.md) و [مستندات فنی Backend](./docs/technical/backend-setup.md)
- **Frontend**: [مستندات فنی Frontend](./docs/technical/frontend-setup.md) - وب‌اپلیکیشن واکنش‌گرا

---

## 📝 وضعیت پروژه

- [X] تعریف پروژه
- [X] تحلیل رقبا
- [X] استراتژی و برنامه‌ریزی
- [ ] طراحی MVP
- [ ] توسعه Backend
- [ ] توسعه Frontend (وب‌اپلیکیشن واکنش‌گرا)
- [ ] تست و انتشار
- [ ] تبدیل به PWA (فاز ۲)

---

## 👥 تیم

- توسعه‌دهنده اصلی

---

## 📄 لایسنس

[لایسنس پروژه را اینجا قرار دهید]

---

## 🔗 لینک‌های مفید

- [استراتژی پروژه](./docs/strategy/project-plan.md)
- [تحلیل رقبا](./docs/research/competitors/list.md)
