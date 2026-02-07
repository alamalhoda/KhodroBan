# Backend Rules — Django/DRF

قوانین backend برای پروژه Django (`backend/django/`). منبع: `ai-rules-4.4.md`.

## ساختار

```
backend/
├── README.md                    # این فایل
├── ai-rules-4.4.md              # سند منبع یگانه (مرجع کامل)
│
├── core/                        # قوانین پایه
│   ├── ai-guardrails.mdc        # AI محدودیت‌ها (alwaysApply: true)
│   ├── design-principles.mdc    # SOLID، DRY، KISS، SSOT
│   ├── git-workflow.mdc         # Branch، commit، high-risk
│   └── quick-reference.mdc      # AI Checklist (alwaysApply: true)
│
├── architecture/                # معماری Django
│   └── django-architecture.mdc  # View/Service/Serializer، business logic
│
├── api/                         # API و REST
│   └── rest.mdc                 # HTTP methods، status codes، response structure
│
├── python/                      # پایتون
│   └── best-practices.mdc       # Type hints، context manager، exception
│
├── database/                    # دیتابیس
│   └── models.mdc               # Migrations، ORM، transactions
│
├── security/                    # امنیت
│   └── security.mdc             # Permissions، secrets، password hashing
│
├── performance/                 # عملکرد
│   └── optimization.mdc         # N+1، select_related، caching
│
├── logging/                     # لاگ
│   └── monitoring.mdc           # سطوح logging، چه چیزی log شود
│
├── configuration/               # تنظیمات
│   └── settings.mdc             # settings، env، django-environ
│
├── testing/                     # تست
│   └── strategy.mdc             # APITestCase، AAA، coverage
│
├── patterns/                    # الگوها
│   ├── progressive-development.mdc  # Feature flags، deprecation
│   └── anti-patterns.mdc        # God class، magic numbers، ...
│
└── documentation/               # مستندسازی
    └── file-header.mdc          # Minimal و Full header
```

## Globs (محدوده اثر)

| فایل | Globs | alwaysApply |
|------|-------|-------------|
| ai-guardrails.mdc | `backend/django/**/*.py` | ✅ true |
| quick-reference.mdc | `backend/django/**/*.py` | ✅ true |
| design-principles.mdc | `backend/django/**/*.py` | false |
| git-workflow.mdc | `backend/django/**/*`, `.github/**/*` | false |
| django-architecture.mdc | `**/views.py`, `**/serializers.py`, `**/urls.py` | false |
| rest.mdc | `**/views.py`, `**/serializers.py`, `**/urls.py` | false |
| best-practices.mdc | `backend/django/**/*.py` | false |
| models.mdc | `**/models.py`, `**/migrations/*.py` | false |
| security.mdc | `**/views.py`, `**/serializers.py`, `**/settings*.py` | false |
| optimization.mdc | `**/views.py`, `**/models.py` | false |
| monitoring.mdc | `backend/django/**/*.py` | false |
| settings.mdc | `**/settings*.py`, `.env*` | false |
| strategy.mdc | `**/test*.py`, `**/tests/**/*.py` | false |
| progressive-development.mdc | `backend/django/**/*.py` | false |
| anti-patterns.mdc | `backend/django/**/*.py` | false |
| file-header.mdc | `backend/django/**/*.py` | false |

## نحوه کار

* هنگام ویرایش فایل در `backend/django/`، Cursor بر اساس globها، فایل‌های rule مربوط را بارگذاری می‌کند.
* `ai-guardrails.mdc` و `quick-reference.mdc` همیشه اعمال می‌شوند (برای هر فایل Python در backend).
* بقیه قوانین فقط وقتی اعمال می‌شوند که glob با فایل باز مطابقت کند.
