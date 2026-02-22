# 🔧 راهنمای عیب‌یابی Supabase

این سند مشکلات رایج و راه‌حل‌های آن‌ها را پوشش می‌دهد.

---

## 🧪 تست اتصال

### تنظیمات اولیه

قبل از تست، در `.env` مطمئن شوید:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

### مراحل تست

1. `cd frontend-vue && npm run dev`
2. به `http://localhost:5173` بروید
3. ثبت‌نام و ورود را تست کنید
4. در Supabase Dashboard → Authentication → Users کاربر جدید را بررسی کنید
5. Console مرورگر: باید `Active Backend Type: supabase` نمایش دهد

---

## ❌ مشکل: کاربر جدید در Authentication → Users اضافه نمی‌شود

### علل احتمالی:

1. **authService هنوز از Mock استفاده می‌کند**
   - ✅ **راه‌حل**: بررسی کنید که `authService.ts` به‌روزرسانی شده و از Supabase استفاده می‌کند
   - فایل `frontend/src/lib/services/authService.ts` را بررسی کنید
   - باید `import { supabase } from '../supabase'` داشته باشد

2. **Environment Variables تنظیم نشده‌اند**
   - ✅ **راه‌حل**: بررسی کنید که فایل `.env` وجود دارد و مقادیر درست را دارد:
   ```env
   VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
   ```
   - پس از تغییر `.env`، سرور را restart کنید

3. **خطا در Console مرورگر**
   - ✅ **راه‌حل**: Console مرورگر را باز کنید (F12) و خطاها را بررسی کنید
   - خطاهای شبکه را بررسی کنید

4. **ایمیل تأیید نشده است**
   - ✅ **راه‌حل**: در Supabase Dashboard → Settings → Auth → Email:
     - اگر "Enable email confirmations" فعال است، کاربر باید ایمیل را تأیید کند
     - برای تست، می‌توانید آن را غیرفعال کنید

---

## ❌ مشکل: Trigger پروفایل کاربر ایجاد نمی‌شود

### بررسی Trigger:

در SQL Editor این کوئری را اجرا کنید:

```sql
-- بررسی وجود trigger
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

اگر نتیجه خالی است، trigger ایجاد نشده است.

### راه‌حل:

1. **اجرای مجدد Migration 001**
   - به SQL Editor بروید
   - بخش "5. Function برای ایجاد خودکار User Profile" را پیدا کنید
   - این بخش را دوباره اجرا کنید:

```sql
-- Function برای ایجاد خودکار User Profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, is_email_verified)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.email_confirmed_at IS NOT NULL
    );
    
    -- ایجاد اشتراک رایگان پیش‌فرض
    INSERT INTO public.user_subscriptions (user_id, plan_id, is_active)
    SELECT NEW.id, plan_id, TRUE
    FROM public.subscription_plans
    WHERE plan_code = 'free'
    LIMIT 1;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger برای ایجاد خودکار profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
```

2. **بررسی وجود subscription_plans**
   - اگر پلن 'free' وجود نداشته باشد، trigger خطا می‌دهد
   - این کوئری را اجرا کنید:

```sql
SELECT * FROM public.subscription_plans WHERE plan_code = 'free';
```

   - اگر نتیجه خالی است، این را اجرا کنید:

```sql
INSERT INTO public.subscription_plans (plan_code, plan_name, max_vehicles, allow_csv_export, allow_pdf_export, allow_sms_reminder, monthly_price)
VALUES ('free', 'رایگان', 1, TRUE, FALSE, FALSE, NULL)
ON CONFLICT (plan_code) DO NOTHING;
```

---

## ❌ مشکل: خطای "Row Level Security policy violation"

### علل احتمالی:

1. **RLS فعال است اما policies وجود ندارند**
   - ✅ **راه‌حل**: Migration 002 را اجرا کنید

2. **کاربر لاگین نشده است**
   - ✅ **راه‌حل**: بررسی کنید که session معتبر است:
   ```typescript
   const { data: { session } } = await supabase.auth.getSession();
   console.log('Session:', session);
   ```

3. **Token منقضی شده است**
   - ✅ **راه‌حل**: دوباره لاگین کنید

---

## ❌ مشکل: خطای "relation does not exist"

### علل احتمالی:

1. **Migration ها اجرا نشده‌اند**
   - ✅ **راه‌حل**: Migration 001 را اجرا کنید

2. **Schema اشتباه است**
   - ✅ **راه‌حل**: بررسی کنید که جداول در schema `public` هستند:
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

---

## ❌ مشکل: خطای "Missing Supabase environment variables"

### راه‌حل:

1. **بررسی وجود فایل `.env`**
   ```bash
   ls -la frontend/.env
   ```

2. **بررسی محتوای `.env`**
   ```bash
   cat frontend/.env
   ```
   - باید `VITE_SUPABASE_URL` و `VITE_SUPABASE_ANON_KEY` وجود داشته باشند

3. **Restart سرور**
   - پس از تغییر `.env`، حتماً سرور را restart کنید:
   ```bash
   # متوقف کردن سرور (Ctrl+C)
   # سپس دوباره اجرا کنید:
   npm run dev
   ```

---

## ❌ مشکل: کاربر ثبت می‌شود اما پروفایل ایجاد نمی‌شود

### بررسی دستی:

1. **بررسی وجود کاربر در auth.users**
   ```sql
   SELECT id, email, created_at 
   FROM auth.users 
   ORDER BY created_at DESC 
   LIMIT 5;
   ```

2. **بررسی وجود پروفایل**
   ```sql
   SELECT * FROM public.user_profiles 
   WHERE id = 'USER_ID_HERE';
   ```

3. **اجرای دستی trigger**
   ```sql
   -- اگر trigger کار نمی‌کند، می‌توانید دستی اجرا کنید:
   SELECT public.handle_new_user();
   ```

### راه‌حل موقت:

اگر trigger کار نمی‌کند، می‌توانید دستی پروفایل ایجاد کنید:

```sql
-- پیدا کردن کاربر بدون پروفایل
SELECT u.id, u.email
FROM auth.users u
LEFT JOIN public.user_profiles p ON u.id = p.id
WHERE p.id IS NULL;

-- ایجاد پروفایل برای کاربر
INSERT INTO public.user_profiles (id, email, is_email_verified)
VALUES ('USER_ID', 'user@example.com', true);

-- ایجاد subscription
INSERT INTO public.user_subscriptions (user_id, plan_id, is_active)
SELECT 'USER_ID', plan_id, TRUE
FROM public.subscription_plans
WHERE plan_code = 'free'
LIMIT 1;
```

---

## ✅ چک‌لیست عیب‌یابی

قبل از درخواست کمک، این موارد را بررسی کنید:

- [ ] فایل `.env` وجود دارد و مقادیر درست را دارد
- [ ] سرور Frontend را restart کرده‌اید
- [ ] Migration 001 اجرا شده است
- [ ] Migration 002 اجرا شده است
- [ ] Trigger `on_auth_user_created` وجود دارد
- [ ] پلن 'free' در `subscription_plans` وجود دارد
- [ ] Console مرورگر را برای خطاها بررسی کرده‌اید
- [ ] Network tab را برای درخواست‌های ناموفق بررسی کرده‌اید

---

## 🔍 کوئری‌های مفید برای Debug

### بررسی وضعیت کاربران:

```sql
-- لیست کاربران و پروفایل‌هایشان
SELECT 
    u.id,
    u.email,
    u.created_at as user_created,
    p.first_name,
    p.last_name,
    p.is_active,
    s.plan_id,
    sp.plan_code
FROM auth.users u
LEFT JOIN public.user_profiles p ON u.id = p.id
LEFT JOIN public.user_subscriptions s ON u.id = s.user_id AND s.is_active = true
LEFT JOIN public.subscription_plans sp ON s.plan_id = sp.plan_id
ORDER BY u.created_at DESC;
```

### بررسی Trigger:

```sql
-- بررسی trigger
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_timing,
    action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public' 
   OR event_object_schema = 'auth';
```

### بررسی RLS Policies:

```sql
-- لیست تمام policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

---

## 📞 درخواست کمک

اگر مشکل حل نشد:

1. **لاگ‌های Supabase**: Dashboard → Logs → API
2. **Console مرورگر**: تمام خطاها را کپی کنید
3. **Network Tab**: درخواست‌های ناموفق را بررسی کنید
4. **SQL Editor**: کوئری‌های بالا را اجرا کنید و نتایج را ذخیره کنید

---

**آخرین به‌روزرسانی:** ۱۴۰۴/۰۹/XX

