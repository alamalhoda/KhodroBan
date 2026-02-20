# 🚀 راهنمای کامل Deploy به chabokan.net

چابکان یک پلتفرم ابری ایرانی است که از انواع پلتفرم‌ها پشتیبانی می‌کند:
- ✅ **Static Site** – برای SPA های static (توصیه می‌شود برای frontend)
- ✅ **Node.js** – برای اجرای Node.js applications
- ✅ **Docker** – برای containerized applications

---

## 🎯 گزینه 1: Static Site (فقط Frontend – ساده‌ترین)

### مزایا
- ساده و سریع
- هزینه کمتر
- بدون نیاز به Node.js runtime
- مناسب برای SPA های Vue/React

### مراحل

#### 1. Build محلی

```bash
cd frontend-vue
npm install
npm run build
```

خروجی در `frontend-vue/dist/` قرار می‌گیرد.

#### 2. ایجاد پروژه در chabokan.net

1. **ایجاد پروژه جدید** → **Static Site** را انتخاب کنید
2. نام پروژه را وارد کنید (مثلاً: `khodroban`)

#### 3. آپلود فایل‌ها

1. تمام محتویات `frontend-vue/dist/` را به root directory پروژه آپلود کنید
2. `index.html` باید در root باشد

#### 4. تنظیمات .htaccess (برای Apache / SPA routing)

در root پروژه فایل `.htaccess` ایجاد کنید:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

**توجه:** Backend Django باید روی سرویس دیگری اجرا شود. Frontend با `VITE_API_URL` به API متصل می‌شود.

---

## 🐳 گزینه 2: Docker (Backend + Frontend)

### مراحل

#### 1. انتخاب نوع دیتابیس

- **PostgreSQL:** `docker-compose.yml`
- **SQLite:** `docker-compose.lite.yml`

#### 2. تنظیم Environment Variables

```bash
cp .env.example .env
```

ویرایش `.env` و تنظیم حداقل:
- `DJANGO_SECRET_KEY`
- `ALLOWED_HOSTS` (شامل دامنه chabokan)
- برای PostgreSQL: `POSTGRES_PASSWORD`

#### 3. ایجاد پروژه Docker در chabokan.net

1. **ایجاد پروژه جدید** → **Docker** را انتخاب کنید
2. Docker Compose path: `docker-compose.yml` یا `docker-compose.lite.yml` (اگر پشتیبانی شود)
3. یا Dockerfile path: `frontend-vue/Dockerfile` با context مناسب (فقط frontend)

**نکته:** اگر chabokan فقط single-container Docker پشتیبانی کند، می‌توانید فقط frontend را با `frontend-vue/Dockerfile` deploy کنید و backend را روی سرویس دیگری اجرا کنید.

#### 4. Port

- Frontend (nginx): `80`
- Backend: `8000` (در حالت compose داخلی است؛ ترافیک از nginx proxy می‌شود)

---

## 📊 مقایسه گزینه‌ها

| ویژگی        | Static Site | Docker (Compose) |
|--------------|-------------|------------------|
| سادگی        | ⭐⭐⭐⭐⭐     | ⭐⭐              |
| هزینه        | 💰 کم       | 💰💰💰 بیشتر     |
| Backend      | جداگانه     | یکپارچه          |
| کنترل        | ⭐⭐         | ⭐⭐⭐⭐⭐          |

---

## ✅ توصیه

- **فقط frontend:** Static Site – ساده و ارزان
- **Backend + Frontend یکجا:** Docker Compose (در صورت پشتیبانی پلتفرم)
