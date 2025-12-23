# 🔄 راهنمای جابه‌جایی بین Backend ها

این سند راهنمای استفاده از ساختار قابل انعطاف برای جابه‌جایی بین Mock، Supabase و Django است.

---

## 📋 ساختار

هر service شامل سه implementation است:
1. **Mock**: برای تست و یادگیری (بدون نیاز به backend)
2. **Supabase**: برای production با Supabase
3. **Django**: برای آینده با Django REST API

یک router مرکزی بر اساس `VITE_BACKEND_TYPE` implementation مناسب را انتخاب می‌کند.

---

## ⚙️ تنظیمات

### در فایل `.env`:

```env
# انتخاب نوع backend
VITE_BACKEND_TYPE=mock      # استفاده از Mock
VITE_BACKEND_TYPE=supabase  # استفاده از Supabase
VITE_BACKEND_TYPE=django    # استفاده از Django
```

### پیش‌فرض:

اگر `VITE_BACKEND_TYPE` تنظیم نشده باشد، پیش‌فرض `supabase` است.

---

## 🔧 نحوه کار

### 1. فایل Config

`frontend/src/lib/config/backendConfig.ts`:
- نوع backend را از environment variable می‌خواند
- Helper functions برای بررسی نوع backend

### 2. Service Router

`frontend/src/lib/services/base/router.ts`:
- تابع `selectService()` implementation مناسب را انتخاب می‌کند
- بر اساس `BACKEND_TYPE` یکی از Mock، Supabase یا Django را برمی‌گرداند

### 3. Service Implementation

هر service (مثل `authService.ts`) شامل:
- `serviceMock`: Implementation با Mock data
- `serviceSupabase`: Implementation با Supabase
- `serviceDjango`: Implementation با Django (placeholder)
- `service`: Export شده که از router استفاده می‌کند

---

## 📝 مثال استفاده

### تغییر Backend Type:

```typescript
// در .env
VITE_BACKEND_TYPE=mock

// در کد
import { authService } from '$lib/services';

// authService به صورت خودکار از Mock استفاده می‌کند
const { user, token } = await authService.login({ email, password });
```

### بررسی نوع Backend:

```typescript
import { BACKEND_TYPE, isMock, isSupabase, isDjango } from '$lib/config/backendConfig';

console.log(BACKEND_TYPE); // 'mock' | 'supabase' | 'django'

if (isMock()) {
  console.log('Using Mock backend');
}
```

---

## 🎯 مزایا

1. **یادگیری**: می‌توانید Mock و Supabase را کنار هم ببینید
2. **تست**: بدون نیاز به backend واقعی تست کنید
3. **انعطاف**: به راحتی بین backend ها جابه‌جا شوید
4. **توسعه**: بدون اتصال به اینترنت کار کنید
5. **آینده‌نگر**: آماده برای Django

---

## 📦 Service های موجود

- ✅ `authService` - Mock + Supabase + Django (placeholder)
- ✅ `vehicleService` - Mock + Supabase + Django (placeholder)
- ⏳ `serviceService` - در حال پیاده‌سازی
- ⏳ `expenseService` - در حال پیاده‌سازی
- ⏳ `reminderService` - در حال پیاده‌سازی

---

## 🔄 جابه‌جایی بین Backend ها

### از Mock به Supabase:

```env
# در .env
VITE_BACKEND_TYPE=supabase
```

سپس سرور را restart کنید:
```bash
npm run dev
```

### از Supabase به Django:

```env
# در .env
VITE_BACKEND_TYPE=django
VITE_DJANGO_API_URL=http://localhost:8000/api
```

---

## 🧪 تست

### تست با Mock:

```env
VITE_BACKEND_TYPE=mock
```

- نیازی به Supabase نیست
- نیازی به Django نیست
- داده‌ها در memory هستند

### تست با Supabase:

```env
VITE_BACKEND_TYPE=supabase
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=...
```

- نیاز به Supabase project
- داده‌ها در Supabase ذخیره می‌شوند

### تست با Django:

```env
VITE_BACKEND_TYPE=django
VITE_DJANGO_API_URL=http://localhost:8000/api
```

- نیاز به Django backend
- داده‌ها در Django database ذخیره می‌شوند

---

## 📚 ساختار فایل‌ها

```
frontend/src/lib/
├── config/
│   └── backendConfig.ts          # تنظیمات backend
├── services/
│   ├── base/
│   │   ├── types.ts              # Interface های service ها
│   │   └── router.ts             # Router برای انتخاب service
│   ├── authService.ts            # Auth service (Mock + Supabase + Django)
│   ├── vehicleService.ts         # Vehicle service (Mock + Supabase + Django)
│   ├── serviceService.ts         # Service service (Mock + Supabase + Django)
│   ├── expenseService.ts         # Expense service (Mock + Supabase + Django)
│   └── reminderService.ts        # Reminder service (Mock + Supabase + Django)
```

---

## ⚠️ نکات مهم

1. **Environment Variables**: پس از تغییر `.env`، سرور را restart کنید
2. **Type Safety**: تمام service ها از interface مشترک استفاده می‌کنند
3. **Consistency**: تمام service ها باید سه implementation داشته باشند
4. **Django**: Django implementation ها placeholder هستند و باید پیاده‌سازی شوند

---

## 🚀 مراحل بعدی

1. ✅ پیاده‌سازی ساختار پایه
2. ✅ Refactor `authService` و `vehicleService`
3. ⏳ Refactor سایر service ها
4. ⏳ پیاده‌سازی Django implementations (وقتی Django آماده شد)

---

**آخرین به‌روزرسانی:** ۱۴۰۴/۰۹/XX

