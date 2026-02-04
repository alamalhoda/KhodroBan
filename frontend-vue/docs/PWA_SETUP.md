# راهنمای PWA Setup

این فایل راهنمای کامل برای تنظیم و استفاده از PWA (Progressive Web App) در پروژه است.

## ✅ کارهای انجام شده

### 1. نصب و پیکربندی
- ✅ نصب `vite-plugin-pwa`
- ✅ پیکربندی Service Worker
- ✅ ایجاد Web App Manifest
- ✅ پیکربندی Caching Strategy

### 2. فایل‌های ایجاد شده
- `dist/sw.js` - Service Worker
- `dist/workbox-*.js` - Workbox runtime
- `dist/manifest.webmanifest` - Web App Manifest
- `dist/registerSW.js` - Service Worker Registration

## 📱 Web App Manifest

Manifest شامل اطلاعات زیر است:
- **Name:** خودروبان - مدیریت سرویس خودرو
- **Short Name:** خودروبان
- **Theme Color:** #3b82f6 (آبی)
- **Background Color:** #ffffff (سفید)
- **Display Mode:** standalone
- **Orientation:** portrait
- **Language:** fa (فارسی)
- **Direction:** rtl

## 🎨 Icons

برای تکمیل PWA، باید icons زیر را اضافه کنید:

### Icons مورد نیاز:
1. **pwa-192x192.png** - 192x192 pixels (PNG)
2. **pwa-512x512.png** - 512x512 pixels (PNG)
3. **apple-touch-icon.png** - 180x180 pixels (PNG, بدون transparency)
4. **favicon.ico** - 16x16, 32x32, 48x48 pixels (ICO)

### محل قرارگیری:
همه icons باید در پوشه `public/` قرار گیرند.

### ابزارهای پیشنهادی برای ساخت Icons:
- [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [Favicon.io](https://favicon.io/)

## 🔧 Service Worker Configuration

### Caching Strategy:
1. **Static Assets:** CacheFirst
   - JS, CSS, HTML, Images
   - Cache برای 1 سال

2. **Supabase API:** NetworkFirst
   - API calls به Supabase
   - Cache برای 24 ساعت
   - Fallback به cache در صورت offline

3. **Google Fonts:** CacheFirst
   - Fonts از Google Fonts
   - Cache برای 1 سال

### Offline Support:
- Static assets در حالت offline در دسترس هستند
- API calls با NetworkFirst strategy مدیریت می‌شوند

## 🧪 تست PWA

### 1. تست در Development:
```bash
npm run dev
```
PWA در حالت development فعال است.

### 2. تست در Production:
```bash
npm run build
npm run preview
```

### 3. تست در مرورگر:

#### Chrome DevTools:
1. F12 را بزنید
2. به تب **Application** بروید
3. در سمت چپ:
   - **Service Workers** - بررسی Service Worker
   - **Manifest** - بررسی Manifest
   - **Storage** - بررسی Cache

#### Lighthouse:
1. F12 را بزنید
2. به تب **Lighthouse** بروید
3. **Progressive Web App** را انتخاب کنید
4. **Generate report** را بزنید

### 4. تست Add to Home Screen:

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

## 📝 نکات مهم

### 1. HTTPS Required:
PWA فقط روی HTTPS کار می‌کند (یا localhost در development).

### 2. Service Worker Update:
Service Worker به صورت خودکار update می‌شود. برای force update:
```javascript
// در console مرورگر
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(registration => registration.update())
})
```

### 3. Clear Cache:
برای پاک کردن cache:
```javascript
// در console مرورگر
caches.keys().then(names => {
  names.forEach(name => caches.delete(name))
})
```

### 4. Icons:
فایل‌های placeholder در `public/` قرار دارند. باید با icons واقعی جایگزین شوند.

## 🚀 مراحل بعدی

1. **ایجاد Icons واقعی:**
   - طراحی icon برای اپلیکیشن
   - ساخت icons در سایزهای مختلف
   - جایگزینی placeholder files

2. **Push Notifications (اختیاری):**
   - پیاده‌سازی Web Push API
   - مدیریت مجوزهای Push Notification
   - اتصال به Backend

3. **Offline Features:**
   - بهبود offline experience
   - Sync data when online
   - Offline indicators

4. **App Store Deployment:**
   - آماده‌سازی برای Google Play Store
   - آماده‌سازی برای Apple App Store
   - استفاده از Capacitor برای Native App

## 📚 منابع

- [Vite PWA Plugin Documentation](https://vite-pwa-org.netlify.app/)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

