# Cursor Rules — OilChenger Monorepo

قوانین توسعه در ریشه مونورپو اعمال می‌شوند. هر قانون با **globs** به مسیر مشخص (مثلاً `frontend-vue/**` یا `backend/**`) محدود می‌شود.

## تفکیک فیزیکی

- **frontend/** — همه قوانین مخصوص واسط کاربری (frontend-vue: Vue 3، Vite، Pinia).
- **backend/** — قوانین backend در آینده اینجا اضافه می‌شوند (Django، API، دیتابیس و …).
- **\_archive/** — قوانین قدیمی فقط برای مرجع (مثلاً Svelte).

با این ساختار قوانین UI و backend قاطی نمی‌شوند.

## ساختار پوشه‌ها

```
.cursor/rules/
├── frontend/           # همه قوانین واسط کاربری
│   ├── core/           # AI behavior، meta-principles، git، code quality
│   ├── architecture/   # ساختار پروژه، Atomic Design، SOLID، component design
│   ├── patterns/       # props-emits، reactivity، component-patterns، api، anti-patterns
│   ├── state/          # Pinia، local vs global
│   ├── performance/    # Bundle، Core Web Vitals، optimization، runtime، assets
│   ├── ui-ux/          # Accessibility، responsive، styling، user-feedback، interaction-patterns
│   ├── testing/        # Strategy، unit (Vitest + Vue)، e2e
│   └── tools/          # Vue 3، Vite
├── backend/            # قوانین backend (آینده)
│   └── README.md
├── _archive/           # قوانین قدیمی (مرجع)
│   └── svelte/
└── README.md
```

## Globها

- قوانین داخل **frontend/** از globهای `frontend-vue/**` (یا الگوی دقیق‌تر مثل `frontend-vue/src/**/*.vue`) استفاده می‌کنند.
- قوانین داخل **backend/** (بعداً) از globهای `backend/**/*.py` یا مشابه استفاده خواهند کرد.

## نحوه استفاده

1. workspace را روی ریشه مونورپو (OilChenger) باز کن.
2. هنگام کار روی فایل‌های داخل `frontend-vue/`، Cursor قوانین داخل `frontend/` را بر اساس glob اعمال می‌کند.
3. هنگام کار روی `backend/`، بعد از اضافه شدن قوانین، فقط قوانین داخل `backend/` اعمال می‌شوند.
