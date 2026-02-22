# خلاصه فنی برای بازسازی توسط AI - خودروبان (KhodroBan)

**هدف:** این مستندات برای بازسازی دقیق پروژه توسط ابزارهای AI (z.ai, dreamflow.app, stitch.withgoogle.com) طراحی شده است.

---

## ۱. ساختار کلی پروژه

```
KhodroBan/
├── frontend/ (Vite + SvelteKit)
│   ├── src/
│   │   ├── lib/
│   │   │   ├── components/{ui,layout,features,organisms}
│   │   │   ├── stores/{auth,vehicles,services,expenses,reminders,ui}
│   │   │   ├── services/{auth,vehicle,service,expense,reminder,report,notification}
│   │   │   ├── utils/{validation,format,navigation,config,constants}
│   │   │   ├── i18n/{fa,en,ar}
│   │   │   └── supabase.ts
│   │   ├── routes/
│   │   │   ├── +layout.svelte (Global: i18n, Auth Guard, Toast)
│   │   │   ├── login/+page.svelte
│   │   │   ├── register/+page.svelte
│   │   │   ├── dashboard/+page.svelte
│   │   │   ├── vehicles/+page.svelte
│   │   │   ├── vehicles/[id]/+page.svelte
│   │   │   ├── add/+page.svelte
│   │   │   ├── reminders/+page.svelte
│   │   │   ├── reports/+page.svelte
│   │   │   └── settings/+page.svelte
│   │   └── styles/global.css
│   ├── package.json
│   ├── vite.config.ts
│   └── svelte.config.js
│
├── supabase/
│   └── migrations/001_initial_schema.sql
│
└── reminder-service/ (Python Cron)
```

---

## ۲. تکنولوژی‌های کلیدی

**Frontend:**
- SvelteKit 2.0.0
- Vite 5.4.0
- TypeScript 5.6.0
- Supabase JS 2.89.0
- Axios 1.7.0
- svelte-i18n 4.0.1
- Chart.js 4.4.0

**Backend:**
- Supabase (PostgreSQL)
- Optional: Django 4.2 + DRF

**Additional:**
- Python 3.11 (Reminder Service)
- Cron Job (Daily at 9 AM)

---

## ۳. معماری State Management

### Stores اصلی:
```typescript
// auth.ts
export const authStore = createAuthStore();
export const isAuthenticated = derived(authStore, $auth => !!$auth.token);
export const currentUser = derived(authStore, $auth => $auth.user);
export const isPro = derived(authStore, $auth => $auth.user?.tier === 'pro');

// vehicles.ts
export const vehiclesStore = createVehiclesStore();
export const vehicleCount = derived(vehiclesStore, $store => $store.vehicles.length);
export const vehicleOptions = derived(vehiclesStore, $store => 
  $store.vehicles.map(v => ({ value: v.id, label: `${v.model} (${v.plateNumber})` }))
);

// reminders.ts
export const remindersStore = createRemindersStore();
export const activeReminders = derived(remindersStore, $store => 
  $store?.reminders?.filter(r => !r.dismissed) || []
);
export const overdueReminders = derived(remindersStore, $store => 
  $store?.reminders?.filter(r => !r.dismissed && r.status === 'overdue') || []
);
```

---

## ۴. Service Layer (Backend Abstraction)

**Router Pattern:**
```typescript
// services/base/router.ts
export function selectService<T>(mockService: T, supabaseService: T, djangoService?: T): T {
  const backendType = import.meta.env.VITE_BACKEND_TYPE || 'supabase';
  switch (backendType) {
    case 'mock': return mockService;
    case 'supabase': return supabaseService;
    case 'django': return djangoService || supabaseService;
    default: return supabaseService;
  }
}

// Usage in each service
export const vehicleService = selectService(
  vehicleServiceMock,
  vehicleServiceSupabase,
  vehicleServiceDjango
);
```

**Service Structure (Example - Vehicle):**
```typescript
// Mock
const vehicleServiceMock: IVehicleService = {
  async getAll() { /* return mock data */ },
  async create(data) { /* add to mock array */ },
  // ... other methods
};

// Supabase
const vehicleServiceSupabase: IVehicleService = {
  async getAll() {
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase
      .from('vehicles')
      .select('*')
      .eq('user_id', user.id);
    return data || [];
  },
  // ... other methods
};

// Django (Placeholder)
const vehicleServiceDjango: IVehicleService = {
  async getAll() {
    const response = await api.get('/vehicles/');
    return response.data.data;
  },
  // ... other methods
};
```

---

## ۵. دیتابیس Schema (Supabase)

**جدول‌های اصلی:**
1. `user_profiles` - اطلاعات کاربر
2. `vehicles` - خودروها
3. `services` - رکوردهای سرویس
4. `daily_expenses` - رکوردهای هزینه
5. `reminder_settings` - تنظیمات یادآور
6. `reminder_logs` - لاگ یادآورها
7. `notifications` - نوتیفیکیشن‌ها

**نکات مهم:**
- RLS (Row Level Security) فعال باشد
- Triggers برای `updated_at` خودکار
- Trigger `handle_new_user` برای ایجاد پروفایل

---

## ۶. صفحات و مسیرها

| مسیر | کامپوننت | توضیحات |
|------|----------|---------|
| `/` یا `/dashboard` | `dashboard/+page.svelte` | داشبورد اصلی |
| `/login` | `login/+page.svelte` | فرم لاگین |
| `/register` | `register/+page.svelte` | فرم ثبت‌نام |
| `/vehicles` | `vehicles/+page.svelte` | لیست خودروها |
| `/vehicles/[id]` | `vehicles/[id]/+page.svelte` | جزئیات خودرو |
| `/add` | `add/+page.svelte` | ثبت سرویس/هزینه |
| `/reminders` | `reminders/+page.svelte` | مدیریت یادآورها |
| `/reports` | `reports/+page.svelte` | گزارش‌ها |
| `/settings` | `settings/+page.svelte` | تنظیمات |

---

## ۷. کامپوننت‌های UI کلیدی

### Atoms (ساده):
- `Button.svelte` - دکمه با variant و size
- `Input.svelte` - ورودی متن/عدد/ایمیل/رمز
- `Select.svelte` - انتخاب از لیست
- `GroupedSelect.svelte` - انتخاب گروهی (سرویس/هزینه)
- `Card.svelte` - کارت با Glassmorphism
- `Badge.svelte` - نشانگر وضعیت
- `Modal.svelte` - مودال با انیمیشن
- `Toast.svelte` - نوتیفیکیشن
- `Spinner.svelte` - لودینگ
- `EmptyState.svelte` - حالت خالی

### Organisms (پیچیده):
- `Layout.svelte` - ساختار کلی صفحه
- `Header.svelte` - هدر با منو
- `BottomNav.svelte` - نویگیشن پایین (موبایل)
- `ReminderModal.svelte` - مودال یادآور
- `NotificationBell.svelte` - زنگ نوتیفیکیشن

---

## ۸. Validation Rules

```typescript
export const validators = {
  required: (value, fieldName) => !value ? `${fieldName} الزامی است` : null,
  email: (value) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'ایمیل نامعتبر است' : null,
  minLength: (value, min) => value.length < min ? `حداقل ${min} کاراکتر` : null,
  maxLength: (value, max) => value.length > max ? `حداکثر ${max} کاراکتر` : null,
  numeric: (value) => isNaN(value) ? 'عدد وارد کنید' : null,
  positiveNumber: (value) => value < 0 ? 'عدد مثبت وارد کنید' : null,
  year: (value) => value < 1350 || value > 1405 ? 'سال نامعتبر' : null,
  kilometers: (value) => value < 0 || value > 1000000 ? 'کیلومتر نامعتبر' : null,
  amount: (value) => value <= 0 ? 'مبلغ باید مثبت باشد' : null,
  plateNumber: (value) => !/^\d{2}[آ-ی]\d{3}-\d{2}$/.test(value) ? 'فرمت: ۱۲ب۳۴۵-۷۸' : null,
  password: (value) => value.length < 6 ? 'رمز عبور باید حداقل ۶ کاراکتر باشد' : null,
  passwordMatch: (password, confirm) => password !== confirm ? 'رمزها مطابقت ندارند' : null,
};
```

---

## ۹. i18n Setup

```typescript
// src/lib/i18n/index.ts
import { register, init, locale } from 'svelte-i18n';
import fa from './fa.json';
import en from './en.json';
import import ar from './ar.json';

register('fa', fa);
register('en', en);
register('ar', ar);

init({
  fallbackLocale: 'fa',
  initialLocale: localStorage.getItem('locale') || 'fa',
});

export function setLocale(newLocale: string) {
  locale.set(newLocale);
  localStorage.setItem('locale', newLocale);
  updateDocumentAttributes(newLocale);
}

export function updateDocumentAttributes(locale: string) {
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('lang', locale);
  document.documentElement.setAttribute('dir', dir);
}
```

---

## ۱۰. Authentication Flow

```typescript
// +layout.svelte
$effect(() => {
  if (browser && !authInitialized) {
    const token = localStorage.getItem('token');
    if (token && !authStore.isAuthenticated()) {
      authService.getProfile()
        .then(user => {
          if (user) authStore.loginSuccess(user, token);
          else localStorage.removeItem('token');
        })
        .catch(() => localStorage.removeItem('token'));
    }
  }
});

// Route Guard
$effect(() => {
  if (!browser || !authInitialized) return;
  const path = $page.url.pathname;
  const isProtected = protectedRoutes.some(route => path === route || path.startsWith(route + '/'));
  if (isProtected && !authStore.isAuthenticated()) {
    navigateTo('/login');
  }
});
```

---

## ۱۱. Realtime Notifications

```typescript
// NotificationBell.svelte
function subscribeToRealtime(userId: string) {
  if (!supabase || isMockMode) return;
  
  const channel = notificationService.subscribeToNotifications(
    userId,
    (newNotification) => {
      notifications.update(list => [newNotification, ...list]);
      unreadCount.update(c => c + 1);
      showToast(newNotification.title, newNotification.body);
    }
  );
  
  onDestroy(() => {
    if (channel) supabase.removeChannel(channel);
  });
}
```

---

## ۱۲. Reminder Service (Python)

```python
# reminder-service/main.py
from supabase import create_client
from datetime import datetime, timedelta
import os

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def check_reminders():
    users = supabase.table('user_profiles').select('*').execute()
    
    for user in users.data:
        settings = supabase.table('reminder_settings').select('*').eq('user_id', user['user_id']).execute()
        vehicles = supabase.table('vehicles').select('*').eq('user_id', user['user_id']).execute()
        
        for vehicle in vehicles.data:
            last_service = supabase.table('services').select('*').eq('vehicle_id', vehicle['vehicle_id']).order('service_date_gregorian', desc=True).limit(1).execute()
            
            if last_service.data:
                # Calculate remaining days/km
                # Check if near due
                # Create notification if needed
                pass

# Cron: 0 9 * * * python /path/to/main.py
```

---

## ۱۳. Environment Variables

```
# Frontend (.env)
VITE_SUPABASE_URL=https://xyz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
VITE_BACKEND_TYPE=supabase
VITE_APP_NAME=خودروبان

# Backend (.env)
SUPABASE_URL=https://xyz.supabase.co
SUPABASE_KEY=eyJhbGciOi...
DATABASE_URL=postgresql://...
SECRET_KEY=your-secret-key

# Reminder Service (.env)
SUPABASE_URL=https://xyz.supabase.co
SUPABASE_KEY=eyJhbGciOi...
```

---

## ۱۴. نکات پیاده‌سازی

### برای AI Tools:
1. **شروع با Supabase** - اول پروژه Supabase ایجاد کنید
2. **اجرای مایگریشن** - از فایل `001_initial_schema.sql` استفاده کنید
3. **نصب وابستگی‌ها** - `npm install` در frontend
4. **ایجاد فایل‌ها** - ساختار پوشه‌ها را رعایت کنید
5. **کپی کدها** - از مستندات کامل استفاده کنید
6. **تست** - هر بخش را جداگانه تست کنید

### مراحل تست:
1. لاگین/ثبت‌نام
2. افزودن خودرو
3. ثبت سرویس
4. ثبت هزینه
5. ایجاد یادآور
6. بررسی گزارش‌ها
7. تست خروجی CSV
8. تست تنظیمات
9. تست لاگین Google
10. تست محدودیت نسخه رایگان

---

## ۱۵. فایل‌های ضروری برای کپی

**از مستندات کامل استفاده کنید:**
- تمام فایل‌های `src/lib/`
- تمام فایل‌های `src/routes/`
- `src/styles/global.css`
- `package.json`
- `vite.config.ts`
- `svelte.config.js`
- `tsconfig.json`
- `supabase/migrations/001_initial_schema.sql`

---

**این خلاصه برای شروع سریع توسط ابزارهای AI طراحی شده است. برای جزئیات کامل، به `RECONSTRUCTION_GUIDE.md` مراجعه کنید.**
