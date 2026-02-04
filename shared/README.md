# 📦 Shared - بخش مشترک

بخش مشترک برای استفاده در پروژه‌های مختلف (SvelteKit و Vue).

## 📁 ساختار

```
shared/
├── services/    # API Services (بدون وابستگی به Framework)
├── types/       # TypeScript Types
└── utils/       # Utility Functions
```

## 🔧 استفاده

### در SvelteKit (frontend):

```typescript
import { authService } from '$lib/services/authService';
```

### در Vue (frontend-vue):

```javascript
import { authService } from '@services/authService';
```

## 📦 Services

- `api.ts` - Axios instance مشترک
- `supabase.ts` - Supabase client
- `config.ts` - Configuration helper

## 🎯 هدف

این بخش شامل کدهای مشترک است که:
- ✅ بدون وابستگی به Framework (Svelte/Vue)
- ✅ قابل استفاده مجدد
- ✅ TypeScript برای type safety

## ⚠️ نکات

- هرگز وابستگی به Svelte یا Vue اضافه نکنید
- فقط منطق کسب‌وکار (Business Logic)
- State Management در هر Framework جداگانه است

