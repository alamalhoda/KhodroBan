# Cursor Rules — OilChenger Monorepo

قوانین توسعه در ریشه مونورپو اعمال می‌شوند. هر قانون با **globs** به مسیر مشخص (مثلاً `frontend-vue/**` یا `backend/**`) محدود می‌شود.

## تفکیک فیزیکی

- **frontend/** — همه قوانین مخصوص واسط کاربری (frontend-vue: Vue 3، Vite، Pinia). راهنما: `frontend/FRONTEND-RULES-GUIDE.md`.
- **backend/** — قوانین backend (Django، DRF، API، دیتابیس، امنیت، تست و …).
- **\_archive/** — قوانین قدیمی فقط برای مرجع (مثلاً Svelte).

با این ساختار قوانین UI و backend قاطی نمی‌شوند.

## ساختار پوشه‌ها

```
.cursor/rules/
├── frontend/           # همه قوانین واسط کاربری
│   ├── FRONTEND-RULES-GUIDE.md  # راهنما و مستند دسته‌بندی‌شده
│   ├── core/           # AI behavior، meta-principles، git، code quality
│   ├── architecture/   # ساختار پروژه، Atomic Design، SOLID، component design
│   ├── patterns/       # props-emits، reactivity، component-patterns، api، anti-patterns
│   ├── state/          # Pinia، local vs global
│   ├── performance/    # Bundle، Core Web Vitals، optimization، runtime، assets
│   ├── ui-ux/          # Accessibility، responsive، styling، user-feedback، interaction-patterns
│   ├── testing/        # Strategy، unit (Vitest + Vue)، e2e
│   └── tools/          # Vue 3، Vite
├── backend/            # قوانین backend (Django/DRF)
│   ├── README.md
│   ├── core/           # AI guardrails، design principles، git، quick-ref
│   ├── architecture/   # Django architecture
│   ├── api/            # REST rules
│   ├── python/         # Python best practices
│   ├── database/       # Models، migrations
│   ├── security/       # Permissions، secrets
│   ├── performance/    # N+1، caching
│   ├── logging/        # Monitoring
│   ├── configuration/  # Settings
│   ├── testing/        # APITestCase، coverage
│   ├── patterns/       # Progressive dev، anti-patterns
│   └── documentation/  # File header
├── _archive/           # قوانین قدیمی (مرجع)
│   └── svelte/
└── README.md
```

## Globها

- قوانین داخل **frontend/** از globهای `frontend-vue/**` (یا الگوی دقیق‌تر مثل `frontend-vue/src/**/*.vue`) استفاده می‌کنند.
- قوانین داخل **backend/** از globهای `backend/django/**/*.py` و الگوهای تخصصی‌تر (مثلاً `**/models.py`, `**/test*.py`) استفاده می‌کنند. جزئیات در `backend/README.md`.

## نحوه استفاده

1. workspace را روی ریشه مونورپو (OilChenger) باز کن.
2. هنگام کار روی فایل‌های داخل `frontend-vue/`، Cursor قوانین داخل `frontend/` را بر اساس glob اعمال می‌کند.
3. هنگام کار روی `backend/django/`، قوانین داخل `backend/` بر اساس glob اعمال می‌شوند.
