# 🔧 راهنمای راه‌اندازی Backend با Django

این سند راهنمای کامل راه‌اندازی و توسعه Backend با Django است.

---

## 📋 پیش‌نیازها

- Python 3.9 یا بالاتر
- pip (Python package manager)
- PostgreSQL (یا SQLite برای توسعه محلی)
- Git

---

## 🚀 راه‌اندازی اولیه

### ۱. ایجاد محیط مجازی

```bash
cd backend
python -m venv venv

# فعال کردن محیط مجازی
# macOS/Linux:
source venv/bin/activate

# Windows:
venv\Scripts\activate
```

### ۲. نصب وابستگی‌ها

```bash
pip install -r requirements.txt
```

### ۳. تنظیم دیتابیس

#### استفاده از SQLite (برای توسعه)

SQLite به صورت پیش‌فرض در Django پشتیبانی می‌شود و نیازی به تنظیم اضافی ندارد.

#### استفاده از PostgreSQL (برای production)

```bash
# نصب PostgreSQL (در صورت نیاز)
# macOS: brew install postgresql
# Ubuntu: sudo apt-get install postgresql

# ایجاد دیتابیس
createdb oilchenger_db

# در settings.py:
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'oilchenger_db',
        'USER': 'your_username',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

### ۴. اجرای Migrations

```bash
python manage.py migrate
```

### ۵. ایجاد Superuser

```bash
python manage.py createsuperuser
```

### ۶. اجرای سرور توسعه

```bash
python manage.py runserver
```

سرور در `http://127.0.0.1:8000` اجرا می‌شود.

---

## 📁 ساختار پروژه

```
backend/
├── manage.py
├── requirements.txt
├── .env                    # متغیرهای محیطی (نباید commit شود)
├── oilchenger/             # پروژه اصلی Django
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
└── apps/                   # اپلیکیشن‌های Django
    ├── accounts/           # مدیریت کاربران و احراز هویت
    │   ├── models.py
    │   ├── views.py
    │   ├── serializers.py
    │   ├── urls.py
    │   └── tests.py
    ├── vehicles/           # مدیریت خودروها
    ├── services/           # سرویس‌ها و تعویض روغن
    ├── notifications/      # یادآوری‌ها و نوتیفیکیشن
    └── core/               # ابزارهای مشترک و utilities
```

---

## 🔐 تنظیمات امنیتی

### استفاده از .env برای متغیرهای حساس

```env
# .env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=postgresql://user:pass@localhost/dbname
```

در `settings.py`:

```python
from decouple import config

SECRET_KEY = config('SECRET_KEY')
DEBUG = config('DEBUG', default=False, cast=bool)
```

---

## 🔌 API با Django REST Framework

### ایجاد یک API Endpoint

```python
# apps/vehicles/serializers.py
from rest_framework import serializers
from .models import Vehicle

class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = '__all__'

# apps/vehicles/views.py
from rest_framework import viewsets
from .models import Vehicle
from .serializers import VehicleSerializer

class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    permission_classes = [IsAuthenticated]
```

---

## 🧪 تست‌نویسی

```bash
# اجرای تمام تست‌ها
python manage.py test

# با coverage
pytest --cov=apps --cov-report=html
```

مثال تست:

```python
# apps/vehicles/tests.py
from django.test import TestCase
from .models import Vehicle

class VehicleModelTest(TestCase):
    def setUp(self):
        self.vehicle = Vehicle.objects.create(
            brand='پراید',
            model='111',
            year=1400
        )
    
    def test_vehicle_creation(self):
        self.assertEqual(self.vehicle.brand, 'پراید')
```

---

## 📝 دستورالعمل‌های توسعه

### ایجاد یک اپلیکیشن جدید

```bash
python manage.py startapp app_name apps/
```

### ایجاد Migration

```bash
# پس از تغییر مدل‌ها
python manage.py makemigrations

# اعمال migrations
python manage.py migrate

# مشاهده SQL
python manage.py sqlmigrate app_name 0001
```

### Django Admin

```
http://127.0.0.1:8000/admin/
```

برای ثبت مدل در admin:

```python
# apps/vehicles/admin.py
from django.contrib import admin
from .models import Vehicle

@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ['brand', 'model', 'year']
    search_fields = ['brand', 'model']
```

---

## 🔗 منابع مفید

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Django Best Practices](https://docs.djangoproject.com/en/stable/misc/design-philosophies/)

