# راهنمای تنظیم Google OAuth در Supabase

این مستند راهنمای کامل برای فعال‌سازی ورود با Google در Supabase است.

## مراحل تنظیم در Supabase Dashboard

### 1. ایجاد Google OAuth Credentials

1. به [Google Cloud Console](https://console.cloud.google.com/) بروید
2. یک پروژه جدید ایجاد کنید یا پروژه موجود را انتخاب کنید
3. به **APIs & Services** > **Credentials** بروید
4. روی **Create Credentials** > **OAuth client ID** کلیک کنید
5. Application type را **Web application** انتخاب کنید
6. **Authorized redirect URIs** را اضافه کنید:
   ```
   https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
   ```
   > **نکته:** `YOUR_PROJECT_REF` را با Project Reference خود در Supabase جایگزین کنید

7. **Client ID** و **Client Secret** را کپی کنید

### 2. تنظیم در Supabase Dashboard

1. به [Supabase Dashboard](https://app.supabase.com/) بروید
2. پروژه خود را انتخاب کنید
3. به **Authentication** > **Providers** بروید
4. **Google** را پیدا کنید و آن را **Enable** کنید
5. **Client ID** و **Client Secret** را از Google Cloud Console وارد کنید
6. **Save** کنید

### 3. تنظیم Redirect URL

در Supabase Dashboard:
1. به **Authentication** > **URL Configuration** بروید
2. **Redirect URLs** را بررسی کنید
3. مطمئن شوید که URL زیر در لیست است:
   ```
   http://localhost:5173/auth/callback
   ```
   (برای development)

   و برای production:
   ```
   https://yourdomain.com/auth/callback
   ```

### 4. بررسی تنظیمات Environment Variables

مطمئن شوید که متغیرهای زیر در `.env` شما تنظیم شده‌اند:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## تست

1. به صفحه `/login` بروید
2. روی دکمه **"ورود با Google"** کلیک کنید
3. باید به صفحه Google redirect شوید
4. بعد از تایید، به `/auth/callback` redirect می‌شوید
5. سپس به `/dashboard` redirect می‌شوید

## عیب‌یابی

### مشکل: "redirect_uri_mismatch"

**راه حل:**
- مطمئن شوید که redirect URI در Google Cloud Console دقیقاً با URL در Supabase یکسان است
- فرمت باید این باشد: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`

### مشکل: "invalid_client"

**راه حل:**
- Client ID و Client Secret را دوباره بررسی کنید
- مطمئن شوید که Google OAuth در Supabase فعال است

### مشکل: کاربر لاگین می‌شود اما به dashboard نمی‌رود

**راه حل:**
- مطمئن شوید که route `/auth/callback` وجود دارد
- Console را برای خطاها بررسی کنید
- مطمئن شوید که `user_profiles` table و trigger آن درست کار می‌کند

## نکات مهم

1. **تولید (Production):**
   - حتماً redirect URL های production را در Google Cloud Console اضافه کنید
   - از HTTPS استفاده کنید

2. **امنیت:**
   - Client Secret را هرگز در frontend قرار ندهید
   - Supabase خودش Client Secret را مدیریت می‌کند

3. **پروفایل کاربر:**
   - بعد از اولین ورود با Google، یک رکورد در `user_profiles` ایجاد می‌شود
   - مطمئن شوید که trigger `handle_new_user` درست کار می‌کند

## منابع

- [Supabase OAuth Documentation](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)

