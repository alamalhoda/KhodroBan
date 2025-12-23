# 🚀 راهنمای راه‌اندازی Supabase برای KhodroBan

این سند راهنمای کامل راه‌اندازی Supabase به عنوان Backend برای پروژه KhodroBan است.

---

## 📋 فهرست مطالب

1. [پیش‌نیازها](#پیش‌نیازها)
2. [نصب Supabase CLI](#نصب-supabase-cli)
3. [ایجاد پروژه Supabase](#ایجاد-پروژه-supabase)
4. [راه‌اندازی محلی (اختیاری)](#راه‌اندازی-محلی-اختیاری)
5. [اعمال Migration ها](#اعمال-migration-ها)
6. [تنظیمات Frontend](#تنظیمات-frontend)
7. [تست و بررسی](#تست-و-بررسی)
8. [Deployment](#deployment)

---

## پیش‌نیازها

- Node.js 18+ و npm
- Git
- حساب کاربری Supabase (رایگان) - [ثبت‌نام در supabase.com](https://supabase.com)

---

## نصب Supabase CLI

### macOS

```bash
brew install supabase/tap/supabase
```

### Linux

```bash
# با npm
npm install -g supabase

# یا با Homebrew
brew install supabase/tap/supabase
```

### Windows

```bash
# با npm
npm install -g supabase

# یا با Scoop
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### بررسی نصب

```bash
supabase --version
```

---

## ایجاد پروژه Supabase

### 1. ورود به Supabase CLI

```bash
supabase login
```

این دستور شما را به مرورگر هدایت می‌کند تا وارد حساب Supabase شوید.

### 2. ایجاد پروژه جدید در Supabase Dashboard

1. به [supabase.com/dashboard](https://supabase.com/dashboard) بروید
2. روی "New Project" کلیک کنید
3. اطلاعات پروژه را وارد کنید:
   - **Name**: `khodroban` یا `oilchenger`
   - **Database Password**: یک رمز قوی انتخاب کنید (ذخیره کنید!)
   - **Region**: نزدیک‌ترین منطقه را انتخاب کنید
4. روی "Create new project" کلیک کنید
5. منتظر بمانید تا پروژه آماده شود (2-3 دقیقه)

### 3. دریافت اطلاعات پروژه

پس از ایجاد پروژه:

1. به **Settings** → **API** بروید
2. اطلاعات زیر را کپی کنید:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGc...`
   - **service_role key**: `eyJhbGc...` (این را محرمانه نگه دارید!)

---

## راه‌اندازی محلی (اختیاری)

اگر می‌خواهید در محیط محلی توسعه دهید:

```bash
# در ریشه پروژه
cd /Users/alamalhoda/Projects/OilChenger

# راه‌اندازی Supabase محلی
supabase start
```

این دستور:
- Docker containers را راه‌اندازی می‌کند
- دیتابیس محلی ایجاد می‌کند
- API محلی در `http://localhost:54321` راه‌اندازی می‌کند
- Studio در `http://localhost:54323` راه‌اندازی می‌کند

### متوقف کردن Supabase محلی

```bash
supabase stop
```

---

## اعمال Migration ها

### روش 1: از طریق Supabase Dashboard (ساده‌تر)

1. به پروژه خود در [supabase.com/dashboard](https://supabase.com/dashboard) بروید
2. به **SQL Editor** بروید
3. فایل `supabase/migrations/001_initial_schema.sql` را باز کنید
4. محتوای آن را در SQL Editor کپی کنید
5. روی "Run" کلیک کنید
6. همین کار را برای `supabase/migrations/002_row_level_security.sql` تکرار کنید

### روش 2: از طریق Supabase CLI (پیشرفته‌تر)

#### برای پروژه Cloud:

```bash
# لینک کردن پروژه محلی به پروژه Cloud
supabase link --project-ref YOUR_PROJECT_REF

# اعمال migration ها
supabase db push
```

#### برای پروژه محلی:

```bash
# اگر از Supabase محلی استفاده می‌کنید
supabase migration up
```

### بررسی Migration ها

پس از اعمال migration ها:

1. به **Table Editor** در Dashboard بروید
2. باید جداول زیر را ببینید:
   - `user_profiles`
   - `subscription_plans`
   - `user_subscriptions`
   - `vehicles`
   - `services`
   - `daily_expenses`
   - `reminder_settings`
   - `reminder_logs`

---

## تنظیمات Frontend

### 1. نصب Supabase Client

```bash
cd frontend
npm install @supabase/supabase-js
```

### 2. ایجاد فایل پیکربندی Supabase

فایل `.env` را به‌روزرسانی کنید:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY

# API URL (برای سازگاری با کد موجود)
VITE_API_URL=https://YOUR_PROJECT_REF.supabase.co/rest/v1

# سایر تنظیمات
VITE_APP_NAME=خودروبان
VITE_APP_VERSION=1.0.0
```

### 3. ایجاد Supabase Client

فایل جدید ایجاد کنید: `frontend/src/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
```

### 4. به‌روزرسانی Service ها

Service های موجود را به‌روزرسانی کنید تا از Supabase استفاده کنند. مثال برای `authService.ts`:

```typescript
import { supabase } from '../supabase';

export const authService = {
  async login(credentials: LoginCredentials) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });
    
    if (error) throw error;
    return data;
  },
  
  async register(data: RegisterData) {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
        }
      }
    });
    
    if (error) throw error;
    return authData;
  },
  
  async logout() {
    await supabase.auth.signOut();
  },
  
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }
};
```

---

## تست و بررسی

### 1. تست Authentication

```bash
cd frontend
npm run dev
```

1. به صفحه ثبت‌نام بروید
2. یک حساب کاربری ایجاد کنید
3. بررسی کنید که در Dashboard → Authentication → Users کاربر جدید ایجاد شده است
4. بررسی کنید که در Table Editor → `user_profiles` پروفایل کاربر ایجاد شده است

### 2. تست RLS Policies

1. در Dashboard → Authentication → Users یک کاربر تست ایجاد کنید
2. در SQL Editor این کوئری را اجرا کنید:

```sql
-- تست دسترسی کاربر
SET ROLE authenticated;
SET request.jwt.claim.sub = 'USER_UUID_HERE';

-- تلاش برای خواندن داده‌ها
SELECT * FROM vehicles;
```

### 3. تست API

از Postman یا curl استفاده کنید:

```bash
curl -X GET 'https://YOUR_PROJECT_REF.supabase.co/rest/v1/vehicles' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Deployment

### تنظیمات Production

1. در Dashboard → Settings → API:
   - **Site URL** را به دامنه production تنظیم کنید
   - **Redirect URLs** را اضافه کنید

2. در Dashboard → Settings → Auth:
   - **Site URL** را تنظیم کنید
   - **Redirect URLs** را اضافه کنید

### Environment Variables در Production

در پلتفرم deployment (Vercel, Netlify, etc.) متغیرهای زیر را تنظیم کنید:

```
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

---

## نکات مهم

### امنیت

1. **هرگز** `service_role` key را در Frontend استفاده نکنید
2. همیشه از `anon` key در Frontend استفاده کنید
3. RLS Policies را همیشه فعال نگه دارید
4. به‌طور منظم Security Advisors را بررسی کنید

### بهینه‌سازی

1. از Index ها برای کوئری‌های متداول استفاده کنید
2. از Real-time subscriptions برای به‌روزرسانی‌های زنده استفاده کنید
3. از Storage برای فایل‌های بزرگ استفاده کنید

### Monitoring

1. به Dashboard → Logs بروید تا خطاها را ببینید
2. از Dashboard → Database → Query Performance برای بهینه‌سازی استفاده کنید

---

## منابع مفید

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Discord Community](https://discord.supabase.com)

---

## پشتیبانی

اگر مشکلی پیش آمد:

1. لاگ‌ها را در Dashboard بررسی کنید
2. مستندات Supabase را مطالعه کنید
3. در Discord Community سوال بپرسید

---

**آخرین به‌روزرسانی:** ۱۴۰۴/۰۹/XX

