# راهنمای استفاده از فونت Vazirmatn

این پروژه از فونت Vazirmatn به صورت **محلی** (Local) استفاده می‌کند و Google Fonts به عنوان **fallback** (پشتیبان) در نظر گرفته شده است.

## 🎯 مزایای این روش

- ✅ **کار آفلاین**: در صورت عدم دسترسی به اینترنت، فونت از فایل‌های محلی لود می‌شود
- ✅ **سرعت بیشتر**: فونت‌های محلی سریع‌تر از Google Fonts لود می‌شوند
- ✅ **Fallback خودکار**: اگر فایل‌های محلی وجود نداشته باشند، از Google Fonts استفاده می‌شود
- ✅ **قابلیت اطمینان**: همیشه یک منبع فونت در دسترس است

## 📥 نصب فونت‌ها

برای دانلود فایل‌های فونت Vazirmatn، دستور زیر را اجرا کنید:

```bash
npm run download-fonts
```

این دستور تمام وزن‌های فونت (100 تا 900) را از Google Fonts دانلود کرده و در پوشه `public/fonts/` ذخیره می‌کند.

### فایل‌های دانلود شده

پس از اجرای دستور، فایل‌های زیر در `public/fonts/` ایجاد می‌شوند:

- `Vazirmatn-Thin.woff2` (weight: 100)
- `Vazirmatn-ExtraLight.woff2` (weight: 200)
- `Vazirmatn-Light.woff2` (weight: 300)
- `Vazirmatn-Regular.woff2` (weight: 400)
- `Vazirmatn-Medium.woff2` (weight: 500)
- `Vazirmatn-SemiBold.woff2` (weight: 600)
- `Vazirmatn-Bold.woff2` (weight: 700)
- `Vazirmatn-ExtraBold.woff2` (weight: 800)
- `Vazirmatn-Black.woff2` (weight: 900)

## 🔧 نحوه کار

### 1. لود فونت‌ها

در فایل `index.html`، ترتیب لود فونت‌ها به این صورت است:

1. **اول**: فونت محلی از `/fonts/vazirmatn-local.css` لود می‌شود
2. **بعد**: اگر فایل‌های محلی وجود نداشته باشند، از Google Fonts استفاده می‌شود

### 2. فایل CSS محلی

فایل `public/fonts/vazirmatn-local.css` شامل تعریف تمام وزن‌های فونت با استفاده از `@font-face` است.

### 3. Fallback در CSS

در فایل `src/style.css`، فونت Vazirmatn به عنوان فونت پیش‌فرض تنظیم شده و fallback فونت‌ها (Tahoma, Arial) نیز تعریف شده‌اند.

## 🚀 استفاده در پروژه

پس از دانلود فونت‌ها، پروژه به صورت خودکار از فونت‌های محلی استفاده می‌کند. نیازی به تغییر کد نیست.

### تست آفلاین

برای تست کارکرد آفلاین:

1. فونت‌ها را دانلود کنید: `npm run download-fonts`
2. اینترنت را قطع کنید
3. پروژه را اجرا کنید: `npm run dev`
4. فونت باید به درستی نمایش داده شود

## 📝 نکات مهم

- **اولین بار**: حتماً دستور `npm run download-fonts` را اجرا کنید
- **Git**: فایل‌های فونت را به Git اضافه کنید تا در همه محیط‌ها در دسترس باشند
- **Build**: فایل‌های فونت در build نهایی نیز کپی می‌شوند
- **حجم**: مجموع فایل‌های فونت حدود 1-2 MB است

## 🔍 عیب‌یابی

### فونت لود نمی‌شود

1. بررسی کنید که فایل‌های فونت در `public/fonts/` وجود دارند
2. Console مرورگر را برای خطاها بررسی کنید
3. Network tab را بررسی کنید که فایل‌های فونت لود می‌شوند

### فونت از Google Fonts لود می‌شود

اگر فایل‌های محلی وجود نداشته باشند، به صورت خودکار از Google Fonts استفاده می‌شود. این رفتار طبیعی است و مشکلی ایجاد نمی‌کند.

## 📚 منابع

- [Vazirmatn Font](https://github.com/rastikerdar/vazirmatn)
- [Google Fonts - Vazirmatn](https://fonts.google.com/specimen/Vazirmatn)

