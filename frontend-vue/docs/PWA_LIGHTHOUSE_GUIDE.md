# راهنمای رفع مشکلات PWA در Lighthouse

این راهنما مشکلات رایج PWA در گزارش Lighthouse را پوشش می‌دهد و راه‌حل‌های آن‌ها را ارائه می‌دهد.

## 📊 مشکلات رایج و راه‌حل‌ها

### 1. ❌ Manifest not linked in HTML

**مشکل:** لینک manifest در HTML وجود ندارد.

**راه‌حل:**
```html
<link rel="manifest" href="/manifest.webmanifest" />
```

**وضعیت:** ✅ حل شده - لینک manifest به `index.html` اضافه شده است.

---

### 2. ❌ Icons are not provided

**مشکل:** آیکون‌های PWA وجود ندارند یا ناقص هستند.

**راه‌حل:**
- ایجاد آیکون‌های واقعی در سایزهای:
  - `192x192` (pwa-192x192.png)
  - `512x512` (pwa-512x512.png)
  - `180x180` (apple-touch-icon.png)

**وضعیت:** ⏳ در حال انجام - آیکون‌های placeholder موجود است، باید با آیکون‌های واقعی جایگزین شوند.

---

### 3. ❌ Service Worker not registered

**مشکل:** Service Worker ثبت نشده است.

**راه‌حل:**
- بررسی کنید که `vite-plugin-pwa` به درستی نصب شده است
- بررسی کنید که `registerType: 'autoUpdate'` در `vite.config.js` تنظیم شده است
- در Chrome DevTools > Application > Service Workers بررسی کنید

**وضعیت:** ✅ حل شده - Service Worker به صورت خودکار توسط `vite-plugin-pwa` ثبت می‌شود.

---

### 4. ❌ Does not provide a valid apple-touch-icon

**مشکل:** آیکون Apple Touch Icon وجود ندارد.

**راه‌حل:**
```html
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
```

**وضعیت:** ✅ حل شده - لینک‌های apple-touch-icon به `index.html` اضافه شده‌اند.

---

### 5. ❌ Does not set a theme-color for the address bar

**مشکل:** Theme color تنظیم نشده است.

**راه‌حل:**
```html
<meta name="theme-color" content="#3b82f6" />
```

**وضعیت:** ✅ حل شده - Theme color در `index.html` تنظیم شده است.

---

### 6. ❌ Does not provide a valid maskable icon

**مشکل:** آیکون maskable وجود ندارد.

**راه‌حل:**
در `vite.config.js`:
```javascript
icons: [
  {
    src: 'pwa-512x512.png',
    sizes: '512x512',
    type: 'image/png',
    purpose: 'maskable' // این مهم است
  }
]
```

**وضعیت:** ✅ حل شده - آیکون maskable در manifest تنظیم شده است.

---

### 7. ❌ Content is not sized correctly for the viewport

**مشکل:** محتوا برای viewport به درستی اندازه‌گیری نشده است.

**راه‌حل:**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
```

**وضعیت:** ✅ حل شده - Viewport meta tag در `index.html` تنظیم شده است.

---

### 8. ❌ Does not redirect HTTP traffic to HTTPS

**مشکل:** در production باید HTTPS استفاده شود.

**راه‌حل:**
- استفاده از HTTPS در production
- تنظیم HSTS headers در سرور

**وضعیت:** ⚠️ نیاز به تنظیم در production

---

### 9. ❌ Page load is not fast enough on 3G

**مشکل:** زمان بارگذاری صفحه در 3G کند است.

**راه‌حل:**
- بهینه‌سازی bundle size
- Lazy loading برای route ها
- Code splitting
- Image optimization

**وضعیت:** ⏳ نیاز به بهینه‌سازی بیشتر

---

### 10. ❌ Does not register a service worker that controls page and start_url

**مشکل:** Service Worker صفحه و start_url را کنترل نمی‌کند.

**راه‌حل:**
- بررسی کنید که Service Worker در root directory ثبت شده است
- بررسی کنید که `scope: '/'` در manifest تنظیم شده است

**وضعیت:** ✅ حل شده - Service Worker به درستی تنظیم شده است.

---

## 🧪 چک‌لیست تست PWA

### قبل از تست:
- [ ] Build production: `npm run build`
- [ ] Preview production: `npm run preview`
- [ ] بررسی Service Worker در Chrome DevTools
- [ ] بررسی Manifest در Chrome DevTools

### تست در Chrome DevTools:
1. F12 را بزنید
2. به تب **Lighthouse** بروید
3. **Progressive Web App** را انتخاب کنید
4. **Generate report** را بزنید
5. امتیاز باید بالای 90 باشد

### تست Add to Home Screen:

#### Android (Chrome):
1. منوی مرورگر را باز کنید (سه نقطه)
2. **Add to Home screen** را انتخاب کنید
3. نام را تایید کنید
4. **Add** را بزنید

#### iOS (Safari):
1. دکمه Share را بزنید
2. **Add to Home Screen** را انتخاب کنید
3. نام را تایید کنید
4. **Add** را بزنید

---

## 📝 نکات مهم

1. **HTTPS Required:** PWA فقط روی HTTPS کار می‌کند (یا localhost در development)
2. **Service Worker Update:** Service Worker به صورت خودکار update می‌شود
3. **Clear Cache:** برای پاک کردن cache در Chrome DevTools > Application > Clear storage
4. **Icons:** آیکون‌های placeholder باید با آیکون‌های واقعی جایگزین شوند

---

## 🔧 تنظیمات فعلی

### vite.config.js:
- ✅ `vite-plugin-pwa` نصب و پیکربندی شده
- ✅ Service Worker با `autoUpdate` فعال است
- ✅ Manifest با اطلاعات کامل تنظیم شده
- ✅ Runtime caching برای Supabase و Google Fonts تنظیم شده

### index.html:
- ✅ Theme color تنظیم شده
- ✅ Viewport تنظیم شده
- ✅ Apple touch icons اضافه شده
- ✅ Manifest link اضافه شده

### public/:
- ✅ pwa-192x192.png (placeholder)
- ✅ pwa-512x512.png (placeholder)
- ✅ apple-touch-icon.png (placeholder)
- ⏳ نیاز به جایگزینی با آیکون‌های واقعی

---

## 🚀 گام‌های بعدی

1. **ایجاد آیکون‌های واقعی:**
   - طراحی آیکون در سایز 512x512
   - ایجاد نسخه‌های مختلف (192x192, 512x512, apple-touch-icon)
   - جایگزینی placeholder ها

2. **تست کامل:**
   - تست در Chrome DevTools
   - تست Add to Home Screen در Android
   - تست Add to Home Screen در iOS
   - تست در Desktop (Chrome, Edge)

3. **بهینه‌سازی:**
   - بهینه‌سازی bundle size
   - Lazy loading
   - Image optimization

---

**آخرین به‌روزرسانی:** ۱۴۰۳/۰۹/XX

