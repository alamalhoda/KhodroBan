# 📋 خلاصه راه‌اندازی Supabase

این فایل خلاصه‌ای از تمام فایل‌ها و مراحل راه‌اندازی Supabase است.

---

## ✅ فایل‌های ایجاد شده

### 1. Migration Scripts (`supabase/migrations/`)

- **001_initial_schema.sql**: ایجاد تمام جداول، index‌ها، functions و triggers
- **002_row_level_security.sql**: فعال‌سازی RLS و ایجاد policies
- **003_seed_data.sql**: داده‌های اولیه برای تست (اختیاری)

### 2. پیکربندی (`supabase/`)

- **config.toml**: تنظیمات Supabase محلی
- **README.md**: راهنمای استفاده از پوشه supabase

### 3. Frontend Integration (`frontend/`)

- **src/lib/supabase.ts**: Supabase client configuration
- **src/lib/types/supabase.ts**: TypeScript types برای Database
- **src/lib/services/authService.supabase.example.ts**: مثال به‌روزرسانی authService
- **.env.example**: الگوی فایل environment variables

### 4. مستندات (`docs/technical/`)

- **supabase-setup.md**: راهنمای کامل راه‌اندازی
- **supabase-quick-start.md**: راهنمای سریع ۵ دقیقه‌ای
- **supabase-frontend-integration.md**: راهنمای اتصال Frontend

---

## 🚀 مراحل بعدی

### 1. ایجاد پروژه Supabase

1. به [supabase.com/dashboard](https://supabase.com/dashboard) بروید
2. پروژه جدید ایجاد کنید
3. API keys را دریافت کنید

### 2. اعمال Migration ها

1. به **SQL Editor** در Dashboard بروید
2. فایل `supabase/migrations/001_initial_schema.sql` را اجرا کنید
3. فایل `supabase/migrations/002_row_level_security.sql` را اجرا کنید

### 3. تنظیم Frontend

```bash
cd frontend

# نصب Supabase Client
npm install @supabase/supabase-js

# کپی و ویرایش .env
cp .env.example .env
# مقادیر را از Supabase Dashboard پر کنید
```

### 4. به‌روزرسانی Service ها

- فایل `authService.supabase.example.ts` را مطالعه کنید
- `authService.ts` را به‌روزرسانی کنید
- سایر service ها را به‌روزرسانی کنید

---

## 📚 مستندات

برای جزئیات بیشتر:

- **راهنمای سریع**: [supabase-quick-start.md](./docs/technical/supabase-quick-start.md)
- **راهنمای کامل**: [supabase-setup.md](./docs/technical/supabase-setup.md)
- **اتصال Frontend**: [supabase-frontend-integration.md](./docs/technical/supabase-frontend-integration.md)

---

## 🔍 بررسی صحت نصب

### در Supabase Dashboard:

- ✅ **Authentication → Users**: کاربران جدید
- ✅ **Table Editor**: تمام جداول ایجاد شده
- ✅ **SQL Editor**: اجرای migration ها موفق

### در Frontend:

- ✅ ثبت‌نام و ورود کار می‌کند
- ✅ داده‌ها در Supabase ذخیره می‌شوند
- ✅ RLS policies فعال هستند

---

## ⚠️ نکات مهم

1. **امنیت**: هرگز `service_role` key را در Frontend استفاده نکنید
2. **RLS**: همیشه RLS را فعال نگه دارید
3. **Environment Variables**: فایل `.env` را commit نکنید
4. **Types**: Types را از Supabase Dashboard تولید کنید

---

## 🆘 مشکلات رایج

### خطا: "Missing Supabase environment variables"
- بررسی کنید که فایل `.env` وجود دارد
- بررسی کنید که متغیرها با `VITE_` شروع می‌شوند

### خطا: "Row Level Security policy violation"
- بررسی کنید که migration `002_row_level_security.sql` اجرا شده است
- بررسی کنید که کاربر لاگین کرده است

### خطا: "relation does not exist"
- بررسی کنید که migration `001_initial_schema.sql` اجرا شده است

---

**تاریخ ایجاد:** ۱۴۰۴/۰۹/XX  
**Branch:** `feature/supabase-setup`

