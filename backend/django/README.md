# 🔧 Backend - KhodroBan (خودروبان)

Backend API برای اپلیکیشن KhodroBan (خودروبان) با Django

---

## 📋 درباره

این بخش شامل کدهای Backend برای API و منطق سمت سرور پروژه است که با **Django** و **Django REST Framework** توسعه داده می‌شود.

در این پروژه دو Backend در دسترس هستند:
- **Supabase** (پیش‌فرض): دیتابیس و Auth در Supabase
- **Django**: API و دیتابیس روی سرور خودتان (PostgreSQL + JWT)

با تنظیم `VITE_BACKEND_TYPE=django` در فرانت‌اند، تمام درخواست‌ها به این Django API ارسال می‌شوند.

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

## 📁 ساختار Django (پروژه و اپ)

ساختار مطابق استاندارد Django: یک **پروژه** (`khodroban_prj`) و یک **اپ** (`khodroban`).

```
backend/django/
├── manage.py                    # فایل مدیریت Django (اجرا از این پوشه)
├── requirements.txt
├── pytest.ini
├── khodroban_prj/               # پروژه (Project) – تنظیمات و URL ریشه
│   ├── __init__.py
│   ├── settings.py              # تنظیمات پروژه
│   ├── urls.py                  # URL ریشه (شامل اپ khodroban)
│   ├── wsgi.py
│   └── asgi.py
├── khodroban/                   # اپ (App) – مدل‌ها، ویوها، API
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── views.py
│   ├── urls.py                  # مسیرهای API (api/vehicles/, api/token/, ...)
│   ├── serializers.py
│   ├── signals.py
│   ├── huey_tasks.py
│   ├── migrations/
│   └── tests/
│       ├── test_models.py
│       ├── test_auth.py
│       ├── test_api_vehicles.py
│       └── test_huey_tasks.py
├── docs/
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

# اجرای تست‌های اپ khodroban
python manage.py test khodroban

# اجرای یک تست خاص
python manage.py test khodroban.tests.test_models.ReminderModelTests

# با pytest (از پوشه backend/django)
pytest khodroban -v
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

## 🌐 استفاده به عنوان Backend در فرانت‌اند (Vue)

برای اینکه فرانت‌اند Vue از این Django به‌جای Supabase استفاده کند:

1. **اجرای Django** (همان مراحل بالا؛ سرور روی `http://127.0.0.1:8000`).
2. **تنظیم متغیرهای محیطی فرانت‌اند** (در `frontend-vue/.env` یا `.env.local`):

```env
VITE_BACKEND_TYPE=django
VITE_API_URL=http://127.0.0.1:8000/api
```

3. **CORS**: در Django باید دامنه فرانت‌اند (مثلاً `http://localhost:5173`) در `CORS_ALLOWED_ORIGINS` یا `CORS_ALLOW_ALL_ORIGINS` قرار بگیرد (در `settings.py` با `django-cors-headers`).

4. **Auth**: لاگین با `POST /api/token/` (username + password)، ثبت‌نام با `POST /api/register/`. توکن JWT در هدر `Authorization: Bearer <access>` برای درخواست‌های بعدی استفاده می‌شود.

برای بازگشت به Supabase کافی است `VITE_BACKEND_TYPE=supabase` و `VITE_API_URL` را به آدرس Supabase Rest API تنظیم کنید.

---

## 🔧 تنظیمات محیط

برای تنظیمات محیطی از فایل `.env` استفاده کنید:

```env
SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_URL=postgresql://user:password@localhost/oilchenger_db
```

در `settings.py` از `python-decouple` برای خواندن متغیرها استفاده کنید.
