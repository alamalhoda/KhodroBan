# 📦 Supabase Setup برای KhodroBan

این پوشه شامل تمام فایل‌های مربوط به راه‌اندازی Supabase است.

## 📁 ساختار

```
supabase/
├── migrations/           # Migration scripts
│   ├── 001_initial_schema.sql
│   └── 002_row_level_security.sql
├── config.toml          # تنظیمات Supabase محلی
└── README.md            # این فایل
```

## 🚀 شروع سریع

برای راهنمای کامل، به [مستندات راه‌اندازی](../docs/technical/supabase-setup.md) مراجعه کنید.

### مراحل خلاصه:

1. **نصب Supabase CLI**
   ```bash
   brew install supabase/tap/supabase
   ```

2. **ورود به Supabase**
   ```bash
   supabase login
   ```

3. **ایجاد پروژه در Dashboard**
   - به [supabase.com/dashboard](https://supabase.com/dashboard) بروید
   - پروژه جدید ایجاد کنید

4. **اعمال Migration ها**
   - از طریق SQL Editor در Dashboard
   - یا با `supabase db push` (اگر CLI را لینک کرده‌اید)

## 📝 Migration ها

### 001_initial_schema.sql
- ایجاد تمام جداول
- ایجاد Index ها
- ایجاد Functions و Triggers
- Seed data برای subscription plans

### 002_row_level_security.sql
- فعال‌سازی RLS برای تمام جداول
- ایجاد Policies برای امنیت

## 🔧 توسعه محلی

```bash
# راه‌اندازی Supabase محلی
supabase start

# متوقف کردن
supabase stop

# مشاهده لاگ‌ها
supabase logs
```

## 📚 منابع

- [مستندات کامل راه‌اندازی](../docs/technical/supabase-setup.md)
- [Supabase Documentation](https://supabase.com/docs)

