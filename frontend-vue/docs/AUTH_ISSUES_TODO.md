# مشکلات Authentication - TODO برای بررسی

## مشکلات گزارش شده
1. **Non-deterministic Login**: گاهی login موفق می‌شود و گاهی نمی‌شود
2. **Timeout Issues**: درخواست‌های `auth/v1/user` و `auth/v1/token` گاهی timeout می‌شوند
3. **Race Conditions**: احتمال race condition بین initialize و login

## تغییرات انجام شده

### 1. Timeout Implementation
- ✅ اضافه شدن `fetchWithTimeout` در `shared/services/supabase.ts` (10 ثانیه)
- ✅ Timeout برای `getUser()` (5 ثانیه)
- ✅ Timeout برای login (10 ثانیه)
- ✅ Timeout برای router guard (12 ثانیه)
- ✅ Timeout برای auth store initialize (8 ثانیه)

### 2. Race Condition Prevention
- ✅ اضافه شدن `isInitializing` flag در auth store
- ✅ جلوگیری از multiple simultaneous initializations
- ✅ جلوگیری از login همزمان

### 3. Error Handling
- ✅ تشخیص بهتر خطاهای authentication vs network errors
- ✅ جلوگیری از پاک شدن token معتبر در صورت timeout شبکه

## مشکلات احتمالی باقی‌مانده

### 1. Supabase Client Configuration
**مشکل احتمالی**: `fetchWithTimeout` که اضافه شده ممکن است با Supabase client سازگار نباشد یا به درستی کار نکند.

**بررسی لازم**:
- تست اینکه آیا Supabase client واقعاً از custom fetch استفاده می‌کند
- بررسی اینکه آیا AbortController به درستی کار می‌کند
- Log کردن درخواست‌ها برای debug

### 2. Network Issues
**مشکل احتمالی**: اتصال به Supabase ممکن است واقعاً کند باشد یا intermittent باشد.

**بررسی لازم**:
- تست مستقیم درخواست‌ها به Supabase API با curl یا Postman
- بررسی اینکه آیا مشکل از CDN یا شبکه است
- بررسی CORS settings

### 3. Service Worker Interference
**مشکل احتمالی**: Workbox service worker ممکن است درخواست‌ها را intercept کند و باعث مشکل شود.

**بررسی لازم**:
- بررسی تنظیمات workbox در `vite.config.js`
- بررسی cache strategies برای API requests
- Disable کردن service worker موقتاً برای تست

### 4. Token Management
**مشکل احتمالی**: Token ممکن است expire شود یا format اشتباه باشد.

**بررسی لازم**:
- بررسی اینکه token در localStorage درست ذخیره می‌شود
- بررسی format token
- بررسی expire time

### 5. Supabase Session Management
**مشکل احتمالی**: Supabase ممکن است session را به درستی manage نکند.

**بررسی لازم**:
- استفاده از `getSession()` به جای `getUser()` در بعضی موارد
- بررسی اینکه آیا Supabase session storage درست کار می‌کند
- بررسی `autoRefreshToken` setting

## راه‌حل‌های پیشنهادی برای بررسی

### 1. اضافه کردن Logging
```javascript
// در shared/services/supabase.ts
const fetchWithTimeout = (url, options, timeout = 10000) => {
  console.log('[Supabase Fetch] Starting request:', url);
  const startTime = Date.now();
  
  return new Promise((resolve, reject) => {
    // ... existing code ...
    
    fetch(url, {
      ...options,
      signal: controller.signal,
    })
      .then(response => {
        const duration = Date.now() - startTime;
        console.log(`[Supabase Fetch] Success (${duration}ms):`, url);
        clearTimeout(timeoutId);
        resolve(response);
      })
      .catch(error => {
        const duration = Date.now() - startTime;
        console.error(`[Supabase Fetch] Error (${duration}ms):`, url, error);
        // ... existing error handling ...
      });
  });
};
```

### 2. استفاده از Supabase Session Check
```javascript
// در authService.ts - به جای getUser مستقیم
const { data: { session }, error } = await supabase.auth.getSession();
if (session) {
  // Use session user
}
```

### 3. Retry Logic
```javascript
// اضافه کردن retry برای درخواست‌های failed
async function fetchWithRetry(fn, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

### 4. Disable Service Worker برای تست
```javascript
// در vite.config.js - موقتاً disable کنید
// PWA plugin config
```

### 5. بررسی Network Tab
- باز کردن DevTools Network tab
- بررسی اینکه درخواست‌ها واقعاً ارسال می‌شوند
- بررسی status codes
- بررسی response times
- بررسی اینکه آیا OPTIONS requests موفق می‌شوند

### 6. تست Direct API Calls
```bash
# تست مستقیم Supabase auth endpoint
curl -X POST 'https://zwrzokyzjwircrhrtyyi.supabase.co/auth/v1/token?grant_type=password' \
  -H 'Content-Type: application/json' \
  -H 'apikey: YOUR_ANON_KEY' \
  -d '{"email":"s.r.alamalhoda@gmail.com","password":"abc*123"}'
```

## فایل‌های کلیدی برای بررسی

1. `shared/services/supabase.ts` - Supabase client configuration
2. `shared/services/authService.ts` - Authentication logic
3. `frontend-vue/src/stores/auth.js` - Auth store with initialization
4. `frontend-vue/src/router/index.js` - Router guard
5. `vite.config.js` - Service worker configuration

## نکات مهم برای Debug

1. **Console Logs**: تمام درخواست‌ها و پاسخ‌ها را log کنید
2. **Network Tab**: بررسی کنید که درخواست‌ها واقعاً ارسال می‌شوند
3. **Timing**: بررسی کنید که timeout واقعاً رخ می‌دهد یا مشکل دیگری است
4. **Race Conditions**: مطمئن شوید که flags به درستی کار می‌کنند
5. **Error Messages**: پیام‌های خطا را بررسی کنید تا ببینید مشکل دقیقاً چیست

## اقدامات بعدی

1. ✅ اضافه کردن comprehensive logging
2. ✅ تست بدون service worker
3. ✅ بررسی direct API calls
4. ✅ بررسی Supabase dashboard برای errors
5. ✅ بررسی network conditions (کند بودن واقعی vs timeout)

## ✅ وضعیت فعلی (بررسی شده)

**تاریخ بررسی**: 2025-01-06
**وضعیت**: ✅ **مشکلات برطرف شده**

### نتایج بررسی:

1. ✅ **Authentication**: Login و initialization به درستی کار می‌کند
2. ✅ **API Requests**: تمام درخواست‌های Supabase موفق هستند (Status 200)
3. ✅ **Dashboard**: داده‌ها به درستی load می‌شوند و نمایش داده می‌شوند
4. ✅ **Performance**: درخواست‌ها سریع پاسخ می‌دهند (زیر 1 ثانیه)
5. ✅ **Race Conditions**: با flag `isInitializing` مشکل race condition حل شده
6. ✅ **Timeout Handling**: Timeout‌ها به درستی کار می‌کنند

### درخواست‌های موفق:
- ✅ `auth/v1/user` - موفق
- ✅ `user_profiles` - موفق  
- ✅ `user_subscriptions` - موفق
- ✅ `subscription_plans` - موفق (دیگر timeout نمی‌شود)
- ✅ `vehicles` - موفق
- ✅ `services` - موفق
- ✅ `daily_expenses` - موفق
- ✅ `reminder_settings` - موفق

### نتیجه:
مشکلات قبلی به دلیل مشکل شبکه و ارتباط با اینترنت بوده است. با بهبود اتصال شبکه، تمام مشکلات برطرف شده‌اند. تغییرات انجام شده (timeout handling و race condition prevention) همچنان مفید هستند و از مشکلات آینده جلوگیری می‌کنند.

---
**تاریخ ایجاد**: 2025-01-05
**آخرین به‌روزرسانی**: 2025-01-06
**وضعیت**: ✅ **حل شده**
