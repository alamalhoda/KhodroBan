# راهنمای تست PWA

این راهنما شامل مراحل کامل برای تست PWA و اطمینان از عملکرد صحیح آن است.

---

## 🧪 تست‌های پیش از Production

### ۱. تست در Development

```bash
# اجرای development server
npm run dev
```

**بررسی‌ها:**
- [ ] Service Worker ثبت شده است
- [ ] Manifest قابل دسترسی است
- [ ] Icons نمایش داده می‌شوند
- [ ] Cache کار می‌کند

**بررسی در Chrome DevTools:**
1. F12 → Application
2. Service Workers → بررسی status: "activated and is running"
3. Manifest → بررسی تمام فیلدها
4. Storage → Cache Storage → بررسی cache ها

---

### ۲. تست در Production Build

```bash
# Build production
npm run build

# Preview production
npm run preview
```

**بررسی‌ها:**
- [ ] Build بدون خطا انجام شده
- [ ] Service Worker در `dist/` ایجاد شده
- [ ] Manifest در `dist/` ایجاد شده
- [ ] Icons در `dist/` کپی شده‌اند

---

## 📊 تست با Lighthouse

### مراحل:

1. **Build و Preview:**
   ```bash
   npm run build
   npm run preview
   ```

2. **باز کردن در Chrome:**
   - آدرس: `http://localhost:4173` (یا port preview)
   - استفاده از Chrome (بهترین پشتیبانی)

3. **اجرای Lighthouse:**
   - F12 → تب **Lighthouse**
   - انتخاب **Progressive Web App**
   - انتخاب **Desktop** یا **Mobile**
   - کلیک روی **Generate report**

4. **بررسی نتایج:**
   - امتیاز PWA باید > 90 باشد
   - تمام audits باید پاس شوند

### Audits مهم:

#### ✅ Installable
- [ ] Manifest valid
- [ ] Service Worker registered
- [ ] HTTPS (یا localhost)
- [ ] Icons provided

#### ✅ PWA Optimized
- [ ] Page load is fast enough
- [ ] Works offline
- [ ] Responsive design
- [ ] Viewport configured

---

## 📱 تست Add to Home Screen

### Android (Chrome)

#### مراحل:
1. باز کردن اپلیکیشن در Chrome
2. منوی مرورگر (سه نقطه در بالا سمت راست)
3. انتخاب **"Add to Home screen"** یا **"Install app"**
4. تایید نام اپلیکیشن
5. کلیک روی **"Add"** یا **"Install"**

#### بررسی‌ها:
- [ ] آیکون در صفحه اصلی نمایش داده می‌شود
- [ ] با کلیک روی آیکون، اپلیکیشن باز می‌شود
- [ ] اپلیکیشن در حالت standalone اجرا می‌شود (بدون address bar)
- [ ] Splash screen نمایش داده می‌شود

#### تست Offline:
1. نصب اپلیکیشن
2. فعال کردن Airplane Mode
3. باز کردن اپلیکیشن
4. بررسی که static assets بارگذاری می‌شوند

---

### iOS (Safari)

#### مراحل:
1. باز کردن اپلیکیشن در Safari
2. دکمه **Share** (مربع با فلش بالا)
3. انتخاب **"Add to Home Screen"**
4. تایید نام (می‌توانید تغییر دهید)
5. کلیک روی **"Add"**

#### بررسی‌ها:
- [ ] آیکون در صفحه اصلی نمایش داده می‌شود
- [ ] با کلیک روی آیکون، اپلیکیشن باز می‌شود
- [ ] اپلیکیشن در حالت standalone اجرا می‌شود
- [ ] Status bar به درستی نمایش داده می‌شود

#### محدودیت‌های iOS:
- ⚠️ Service Worker محدودیت‌هایی دارد
- ⚠️ Push Notifications پشتیبانی محدودی دارد
- ⚠️ Cache محدود است

---

### Desktop (Chrome/Edge)

#### مراحل:
1. باز کردن اپلیکیشن در Chrome یا Edge
2. مشاهده آیکون نصب در address bar (سمت راست)
3. کلیک روی آیکون
4. کلیک روی **"Install"**

#### بررسی‌ها:
- [ ] اپلیکیشن در Start Menu (Windows) یا Applications (Mac) نمایش داده می‌شود
- [ ] با کلیک روی آیکون، اپلیکیشن در پنجره جداگانه باز می‌شود
- [ ] اپلیکیشن در حالت standalone اجرا می‌شود

---

## 🔍 تست Service Worker

### بررسی در Chrome DevTools:

1. **F12 → Application → Service Workers**
   - Status: "activated and is running"
   - Source: `sw.js` یا `workbox-*.js`
   - Clients: تعداد clients

2. **F12 → Application → Cache Storage**
   - بررسی cache های ایجاد شده
   - بررسی محتوای cache
   - تست clear cache

3. **F12 → Network**
   - بررسی که requests از cache می‌آیند
   - بررسی Service Worker در waterfall

### تست Offline:

1. **F12 → Network → Throttling**
   - انتخاب "Offline"
   - Refresh صفحه
   - بررسی که static assets بارگذاری می‌شوند

2. **Console:**
   ```javascript
   // بررسی Service Worker
   navigator.serviceWorker.getRegistrations().then(regs => {
     console.log('Service Workers:', regs)
   })
   
   // بررسی Cache
   caches.keys().then(names => {
     console.log('Caches:', names)
   })
   ```

---

## 📋 چک‌لیست کامل تست

### قبل از Production:

#### Foundation:
- [ ] Service Worker ثبت شده
- [ ] Manifest valid است
- [ ] Icons موجود هستند
- [ ] HTTPS فعال است (یا localhost)

#### Functionality:
- [ ] Cache کار می‌کند
- [ ] Offline mode کار می‌کند
- [ ] Add to Home Screen کار می‌کند
- [ ] Splash screen نمایش داده می‌شود

#### Testing:
- [ ] Lighthouse PWA score > 90
- [ ] تست روی Android موفق است
- [ ] تست روی iOS موفق است
- [ ] تست روی Desktop موفق است

#### Performance:
- [ ] Load time قابل قبول است
- [ ] Cache size مناسب است
- [ ] Service Worker update کار می‌کند

---

## 🐛 رفع مشکلات رایج

### مشکل ۱: Service Worker ثبت نمی‌شود

**علت:** HTTPS نیست یا خطا در Service Worker

**راه‌حل:**
```javascript
// بررسی در Console
navigator.serviceWorker.getRegistrations().then(regs => {
  if (regs.length === 0) {
    console.error('No service worker registered')
  }
})
```

### مشکل ۲: Manifest invalid

**علت:** فیلدهای required موجود نیستند

**راه‌حل:**
- بررسی `manifest.webmanifest`
- اطمینان از وجود `name`, `short_name`, `icons`
- استفاده از [Manifest Validator](https://manifest-validator.appspot.com/)

### مشکل ۳: Icons نمایش داده نمی‌شوند

**علت:** مسیر اشتباه یا سایز نامعتبر

**راه‌حل:**
- بررسی مسیر icons در manifest
- اطمینان از وجود فایل‌ها در `public/`
- بررسی سایز icons (باید دقیق باشد)

### مشکل ۴: Add to Home Screen کار نمی‌کند

**علت:** Manifest یا Service Worker مشکل دارد

**راه‌حل:**
- بررسی Lighthouse PWA audit
- اطمینان از HTTPS
- بررسی که تمام requirements برآورده شده‌اند

---

## 📊 معیارهای موفقیت

### PWA Score:
- **هدف:** > 90
- **حداقل:** > 80

### Installable:
- ✅ Manifest valid
- ✅ Service Worker registered
- ✅ HTTPS
- ✅ Icons provided

### Offline:
- ✅ Static assets cache می‌شوند
- ✅ اپلیکیشن در offline کار می‌کند
- ✅ Cache strategy مناسب است

---

## 🔗 منابع مفید

- [PWA Checklist](https://web.dev/pwa-checklist/)
- [Lighthouse PWA Audit](https://developer.chrome.com/docs/lighthouse/pwa/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)

---

**آخرین به‌روزرسانی:** ۱۴۰۳/۰۹/۱۴

