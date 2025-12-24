# ⚡ راهنمای سریع راه‌اندازی Supabase

این راهنمای سریع برای کسانی است که می‌خواهند سریع شروع کنند.

## 🎯 مراحل ۵ دقیقه‌ای

### 1️⃣ ایجاد حساب و پروژه (2 دقیقه)

1. به [supabase.com](https://supabase.com) بروید و ثبت‌نام کنید
2. روی "New Project" کلیک کنید
3. اطلاعات را پر کنید:
   - Name: `khodroban`
   - Password: یک رمز قوی (ذخیره کنید!)
   - Region: نزدیک‌ترین منطقه
4. منتظر بمانید تا پروژه آماده شود

### 2️⃣ دریافت API Keys (1 دقیقه)

1. در Dashboard → Settings → API
2. این مقادیر را کپی کنید:
   - **Project URL**
   - **anon public key**

### 3️⃣ اعمال Schema (1 دقیقه)

1. به **SQL Editor** بروید
2. فایل `supabase/migrations/001_initial_schema.sql` را باز کنید
3. محتوا را کپی و در SQL Editor پیست کنید
4. روی "Run" کلیک کنید
5. همین کار را برای `002_row_level_security.sql` تکرار کنید

### 4️⃣ تنظیم Frontend (1 دقیقه)

```bash
cd frontend

# نصب Supabase Client
npm install @supabase/supabase-js

# کپی فایل .env.example
cp .env.example .env

# ویرایش .env و وارد کردن مقادیر
```

فایل `.env` را ویرایش کنید:
```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

### 5️⃣ تست (30 ثانیه)

```bash
cd frontend
npm run dev
```

به `http://localhost:5173` بروید و ثبت‌نام کنید!

---

## ✅ بررسی صحت نصب

### در Supabase Dashboard:

1. **Authentication → Users**: باید کاربر جدید را ببینید
2. **Table Editor → user_profiles**: باید پروفایل کاربر را ببینید
3. **Table Editor → subscription_plans**: باید دو پلن (free, pro) را ببینید

### در Frontend:

1. ثبت‌نام کنید
2. وارد شوید
3. بررسی کنید که لاگین موفق است

---

## 🆘 مشکلات رایج

### خطا: "Missing Supabase environment variables"
- بررسی کنید که فایل `.env` وجود دارد
- بررسی کنید که متغیرها با `VITE_` شروع می‌شوند
- سرور را restart کنید

### خطا: "Row Level Security policy violation"
- بررسی کنید که migration `002_row_level_security.sql` اجرا شده است
- بررسی کنید که کاربر لاگین کرده است

### خطا: "relation does not exist"
- بررسی کنید که migration `001_initial_schema.sql` اجرا شده است
- در SQL Editor این کوئری را اجرا کنید:
  ```sql
  SELECT table_name FROM information_schema.tables 
  WHERE table_schema = 'public';
  ```

---

## 📚 مراحل بعدی

پس از راه‌اندازی اولیه:

1. [مستندات کامل راه‌اندازی](./supabase-setup.md) را مطالعه کنید
2. Service های Frontend را به‌روزرسانی کنید
3. تست‌های امنیتی را انجام دهید

---

**زمان کل:** ~5 دقیقه ⏱️

