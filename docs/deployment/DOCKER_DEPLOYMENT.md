# راهنمای استقرار Docker – خودروبان (KhodroBan)

این سند دو نوع استقرار Docker را شرح می‌دهد. هر دو خروجی در پروژه موجودند و می‌توانید بر اساس نیاز خود انتخاب کنید.

---

## خلاصه دو نوع استقرار

| ویژگی | نوع ۱: استاندارد (Multi-Container) | نوع ۲: تک‌تصویری (All-in-One) |
|-------|------------------------------------|--------------------------------|
| **تعداد Dockerfile** | چند فایل | یک فایل |
| **تعداد Image** | چند image (backend, frontend, postgres, redis, huey) | یک image |
| **تعداد Container** | ۵–۶ container | ۱ container |
| **دیتابیس** | SQLite یا PostgreSQL | فقط SQLite |
| **Redis** | دارد | ندارد |
| **Huey (صف وظایف)** | دارد | ندارد |
| **زمان‌بندی** | Huey periodic tasks | crontab (OS) |
| **مناسب برای** | Production، توسعه، مقیاس‌پذیری | Demo، پورت‌بل، نصب سریع |
| **فایل‌ها** | `docker-compose.yml`, `docker-compose.lite.yml` | `Dockerfile.all-in-one` |

---

## نوع ۱: استقرار استاندارد (Multi-Container)

### معماری

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  frontend   │     │   backend   │     │  huey       │
│  (nginx)    │────▶│  (gunicorn) │────▶│  (worker)   │
│  :5174      │     │  :8000      │     │             │
└─────────────┘     └──────┬──────┘     └──────┬──────┘
                          │                    │
                    ┌─────┴─────┐         ┌────┴────┐
                    │ postgres  │         │  redis  │
                    │ (optional)│         │  :6379  │
                    └───────────┘         └─────────┘
```

### فایل‌ها

- `backend/django/Dockerfile` – Backend Django
- `frontend-vue/Dockerfile` – Frontend Vue + nginx
- `docker-compose.yml` – نسخه کامل با PostgreSQL
- `docker-compose.lite.yml` – نسخه سبک با SQLite

### اجرا

#### نسخه کامل (PostgreSQL)

```bash
cp .env.example .env
# ویرایش .env: DJANGO_SECRET_KEY، POSTGRES_PASSWORD و ...

docker compose up -d
```

- Frontend: http://localhost:5174
- Backend API: http://localhost:8000/api/
- Admin: http://localhost:8000/admin/

#### نسخه سبک (SQLite)

```bash
cp .env.example .env

docker compose -f docker-compose.lite.yml up -d
```

### متغیرهای محیطی

```env
DB_ENGINE=postgresql   # یا sqlite در lite
POSTGRES_DB=khodroban_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=...
POSTGRES_HOST=postgres
REDIS_HOST=redis
DJANGO_SECRET_KEY=...
ALLOWED_HOSTS=localhost,127.0.0.1,backend,frontend
```

### مزایا

- معماری استاندارد و مقیاس‌پذیر
- پشتیبانی از PostgreSQL و SQLite
- Huey و Redis برای وظایف پس‌زمینه
- جدا بودن سرویس‌ها و امکان scale مستقل

---

## نوع ۲: استقرار تک‌تصویری (All-in-One)

### معماری

```
┌─────────────────────────────────────────────────────┐
│                  یک Container / یک Image            │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │  nginx   │  │ gunicorn │  │ crond (crontab)  │  │
│  │ frontend │  │  Django  │  │ • check_reminders│  │
│  │  :80     │  │  :8000   │  │ • process_outbox │  │
│  └──────────┘  └────┬─────┘  │ • process_notifs │  │
│                     │        └──────────────────┘  │
│                     │                              │
│              ┌──────┴──────┐                        │
│              │   SQLite    │                        │
│              │ database/   │                        │
│              └─────────────┘                        │
└─────────────────────────────────────────────────────┘
```

- بدون Redis
- بدون Huey
- بدون PostgreSQL
- زمان‌بندی با crontab

### فایل‌ها

- `Dockerfile.all-in-one` – یک Dockerfile برای ساخت همه چیز
- `docker-compose.standalone.yml` – برای اجرای همان image با compose
- `scripts/standalone-entrypoint.sh` – اسکریپت راه‌اندازی (migrate, gunicorn, cron, nginx)
- `scripts/standalone-crontab` – زمان‌بندی crontab

### اجرا

```bash
# Build
docker build -f Dockerfile.all-in-one -t khodroban-standalone .

# Run
docker run -d -p 80:80 \
  -e DJANGO_SECRET_KEY=your-secret \
  -v khodroban-data:/app/database \
  -v khodroban-media:/app/media \
  khodroban-standalone
```

با compose:

```bash
docker compose -f docker-compose.standalone.yml up -d
```

- اپلیکیشن: http://localhost
- API: http://localhost/api/
- Admin: http://localhost/admin/

### متغیرهای محیطی

```env
DB_ENGINE=sqlite
DISABLE_HUEY=true
DJANGO_SECRET_KEY=...
ALLOWED_HOSTS=*
```

### Volumeها

| Volume | مسیر | توضیح |
|--------|------|--------|
| database | `/app/database` | فایل SQLite |
| media | `/app/media` | فایل‌های آپلود شده |

### مزایا

- یک image و یک container
- بدون Redis و PostgreSQL
- مناسب Demo، محیط تست، نصب سریع
- قابل حمل و ساده برای استفاده

### محدودیت‌ها

- فقط SQLite (مناسب داده کم)
- بدون صف وظایف Huey (زمان‌بندی با crontab)
- مقیاس افقی محدود

---

## مقایسه تفصیلی

### زمان‌بندی (Scheduled Tasks)

| Task | نوع ۱ (استاندارد) | نوع ۲ (تک‌تصویری) |
|------|-------------------|-------------------|
| check_reminders | Huey، هر روز ۹ صبح | crontab |
| process_outbox | Huey، هر ۵ دقیقه | crontab |
| process_pending_notifications | Huey، هر ۵۰ دقیقه | crontab |

در نوع ۲، همان منطق به‌صورت Management Commands اجرا می‌شود و crontab آن‌ها را زمان‌بندی می‌کند.

### دیتابیس

| | نوع ۱ | نوع ۲ |
|---|-------|-------|
| SQLite | ✅ (در lite) | ✅ |
| PostgreSQL | ✅ (در full) | ❌ |

### وابستگی‌ها

| سرویس | نوع ۱ | نوع ۲ |
|-------|-------|-------|
| nginx | ✅ | ✅ (درون image) |
| gunicorn | ✅ | ✅ |
| Redis | ✅ | ❌ |
| PostgreSQL | ✅ (اختیاری) | ❌ |
| Huey consumer | ✅ | ❌ |
| crond | ❌ | ✅ |

---

## انتخاب نوع استقرار

| سناریو | پیشنهاد |
|--------|---------|
| Production با داده زیاد | نوع ۱ + PostgreSQL |
| توسعه محلی | نوع ۱ + docker-compose.lite.yml |
| Demo یا نمایش سریع | نوع ۲ |
| نصب روی سرور محدود | نوع ۲ |
| نیاز به scale و Redis | نوع ۱ |

---

## مسیرهای مرتبط

- `backend/django/README.md` – راهنمای Backend
- `frontend-vue/README.md` – راهنمای Frontend
- `.env.example` – نمونه متغیرهای محیطی
- `docs/technical/notification-channel-providers.md` – کانال‌های نوتیفیکیشن
