# 🎨 Vue UI - خودروبان

نسخه جدید واسط کاربری با Vue 3 برای پروژه خودروبان.

## ✨ ویژگی‌ها

- ✅ Vue 3 + Vite
- ✅ Pinia برای State Management
- ✅ Vue Router برای Routing
- ✅ Tailwind CSS برای Styling
- ✅ SPA Mode (بدون SSR)
- ✅ استفاده از Shared Services

## 🏗️ ساختار

```
frontend-vue/
├── src/
│   ├── components/     # Vue Components
│   ├── views/          # Page Views
│   ├── stores/         # Pinia Stores
│   ├── services/       # Service Wrappers (از shared استفاده می‌کند)
│   └── router/         # Vue Router
└── package.json
```

## 🚀 شروع

```bash
# نصب dependencies
npm install

# اجرای development server
npm run dev

# Build برای production
npm run build
```

## 📦 وابستگی‌ها

- **Vue 3**: Framework اصلی
- **Pinia**: State Management
- **Vue Router**: Routing
- **Tailwind CSS**: Styling
- **Shared Services**: از پوشه `../shared` استفاده می‌کند

## 🔗 اتصال به Shared

این پروژه از بخش `shared/` برای:
- Services (API calls)
- Types (TypeScript types)
- Utils (Helper functions)

استفاده می‌کند.

## 🌐 Port

Development server روی پورت **5174** اجرا می‌شود (متفاوت از SvelteKit که روی 5173 است).

## 📝 نکات

- این پروژه **SPA** است و SSR ندارد
- از Shared Services استفاده می‌کند
- مستقل از پروژه اصلی (frontend) است
