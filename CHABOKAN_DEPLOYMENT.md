# 🚀 آماده‌سازی برای Deploy به chabokan.net

این branch شامل فایل‌ها و تنظیمات لازم برای deploy به chabokan.net است.

## 📁 فایل‌های مرتبط

### برای Static Site (توصیه می‌شود)
- `frontend-vue/public/` – فایل‌های static
- `docs/deployment/CHABOKAN_NET.md` – راهنمای کامل

### برای Docker
- `docker-compose.yml` – Backend (Django + PostgreSQL) + Frontend (Vue) + Redis + Huey
- `docker-compose.lite.yml` – نسخه سبک با SQLite (بدون PostgreSQL)
- `frontend-vue/Dockerfile` – build و serve frontend با nginx
- `backend/django/Dockerfile` – Backend Django
- `frontend-vue/nginx.conf` – تنظیمات nginx (SPA + proxy به API)
- `.env.example` – نمونه متغیرهای محیطی
- `.dockerignore` – فایل‌های غیرضروری

## 🎯 مراحل Deploy

### گزینه 1: Static Site (ساده‌ترین – فقط frontend)

```bash
cd frontend-vue
npm install
npm run build
```

خروجی در `frontend-vue/dist/` است. محتوای آن را آپلود کنید. برای SPA routing فایل `.htaccess` لازم است (مطابق `docs/deployment/CHABOKAN_NET.md`).

**توجه:** در این حالت Backend جداگانه باید در جای دیگری (مثلاً Django hosting) اجرا شود.

### گزینه 2: Docker (کامل – Backend + Frontend)

```bash
cp .env.example .env
# ویرایش .env و تنظیم DJANGO_SECRET_KEY و سایر متغیرها

# نسخه کامل با PostgreSQL:
docker compose up -d

# یا نسخه سبک با SQLite:
docker compose -f docker-compose.lite.yml up -d
```

در chabokan.net (اگر Docker Compose پشتیبانی شود):
- Docker Compose path: `docker-compose.yml` یا `docker-compose.lite.yml`
- Port: `80` (frontend) یا `5174` (بسته به پیکربندی)

### گزینه 3: Node.js (فقط frontend با API جداگانه)

```bash
cd frontend-vue
npm install
npm run build
npm run preview  # یا serve با port مناسب
```

## ⚙️ Environment Variables

برای Docker، متغیرهای `.env.example` را کپی و تنظیم کنید:

```env
DB_ENGINE=sqlite
DJANGO_SECRET_KEY=...
REDIS_HOST=redis
```

## ✅ چک‌لیست قبل از Deploy

- [ ] Build موفق (`npm run build` در frontend-vue)
- [ ] فایل `index.html` در `dist/` است
- [ ] `.env` تنظیم شده (برای Docker)
- [ ] `ALLOWED_HOSTS` شامل دامنه production است

## 📚 راهنماها

- **Docker (دو نوع استقرار):** `docs/deployment/DOCKER_DEPLOYMENT.md` – استقرار استاندارد و تک‌تصویری
- **chabokan.net:** `docs/deployment/CHABOKAN_NET.md`
