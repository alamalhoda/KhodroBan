# 🔧 Backend - KhodroBan (خودروبان)

Backend API برای اپلیکیشن KhodroBan (خودروبان) با Django

---

## 📋 درباره

این بخش شامل کدهای Backend برای API و منطق سمت سرور پروژه است که با **Django** و **Django REST Framework** توسعه داده می‌شود.

---

## 🚀 شروع کار

### پیش‌نیازها

- Python 3.9+
- PostgreSQL / MySQL (یا SQLite برای توسعه)
- pip و virtualenv

### نصب

```bash
# ایجاد محیط مجازی
python -m venv venv

# فعال کردن محیط مجازی
# در macOS/Linux:
source venv/bin/activate
# در Windows:
venv\Scripts\activate

# نصب وابستگی‌ها
pip install -r requirements.txt

# اجرای migrations
python manage.py migrate

# ایجاد superuser (برای دسترسی به admin)
python manage.py createsuperuser

# اجرای سرور توسعه
python manage.py runserver
```

سرور در آدرس `http://127.0.0.1:8000` اجرا می‌شود.

---

## 📁 ساختار Django

```
backend/
├── manage.py                    # فایل مدیریت Django
├── requirements.txt             # وابستگی‌های Python
├── oilchenger/                  # پروژه اصلی Django
│   ├── __init__.py
│   ├── settings.py              # تنظیمات پروژه
│   ├── urls.py                  # URLهای اصلی
│   ├── wsgi.py                  # WSGI config
│   └── asgi.py                  # ASGI config (برای async)
├── apps/                        # اپلیکیشن‌های Django
│   ├── accounts/                # مدیریت کاربران
│   ├── vehicles/                # مدیریت خودروها
│   ├── services/                # سرویس‌ها و تعویض روغن
│   ├── notifications/           # یادآوری‌ها و نوتیفیکیشن
│   └── core/                    # ابزارهای مشترک
├── tests/                       # تست‌های یکپارچه
└── README.md
```

---

## 🔌 API Endpoints

API با استفاده از Django REST Framework ساخته می‌شود.

[مستندات کامل API در اینجا قرار می‌گیرد](./../docs/technical/api/)

### Endpoint های اصلی (پیشنهادی)

- `/api/auth/` - احراز هویت
- `/api/vehicles/` - مدیریت خودروها
- `/api/services/` - ثبت و مدیریت سرویس‌ها
- `/api/notifications/` - مدیریت یادآوری‌ها

---

## 🧪 تست

```bash
# اجرای تمام تست‌ها
python manage.py test

# اجرای تست‌های یک اپ خاص
python manage.py test apps.vehicles

# اجرای یک تست خاص
python manage.py test apps.vehicles.tests.test_models.VehicleModelTest
```

---

## 🗄️ دیتابیس

### ایجاد Migration

```bash
# پس از تغییر مدل‌ها
python manage.py makemigrations

# اعمال migrations
python manage.py migrate
```

### دسترسی به Django Admin

```
http://127.0.0.1:8000/admin/
```

---

## 📝 نکات توسعه

- از `flake8` یا `pylint` برای کد کیفیت استفاده کنید
- تست‌های واحد را برای هر ویژگی بنویسید (Django TestCase)
- از Django REST Framework برای ساخت API استفاده کنید
- مستندات API را به‌روز نگه دارید
- از `.env` برای متغیرهای محیطی استفاده کنید (python-decouple)
- از Django Admin برای مدیریت داده‌ها استفاده کنید

---

## 🔧 تنظیمات محیط

برای تنظیمات محیطی از فایل `.env` استفاده کنید:

```env
SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_URL=postgresql://user:password@localhost/oilchenger_db
```

در `settings.py` از `python-decouple` برای خواندن متغیرها استفاده کنید.

