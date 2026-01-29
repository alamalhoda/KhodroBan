# راهنمای ساخت Icons برای PWA

## 🎨 اطلاعات برند

- **نام:** خودروبان
- **آیکون:** 🚗 (local_taxi - Material Symbols)
- **رنگ اصلی:** #3b82f6 (آبی)
- **رنگ ثانویه:** #60a5fa (آبی روشن)
- **سبک:** مدرن، ساده، قابل تشخیص

---

## 📋 Icons مورد نیاز

### 1. PWA Icons
- **pwa-192x192.png** - 192x192 pixels (PNG)
- **pwa-512x512.png** - 512x512 pixels (PNG)

### 2. Apple Touch Icon
- **apple-touch-icon.png** - 180x180 pixels (PNG, بدون transparency)

### 3. Favicon
- **favicon.ico** - 16x16, 32x32, 48x48 pixels (ICO)

---

## 🛠️ روش‌های ساخت Icons

### روش ۱: استفاده از PWA Asset Generator (پیشنهادی) ⭐

#### گام ۱: نصب ابزار
```bash
npm install -g pwa-asset-generator
```

#### گام ۲: ایجاد Icon اصلی
یک فایل SVG یا PNG با سایز 512x512 ایجاد کنید که شامل:
- آیکون تاکسی (🚗 یا Material Symbol `local_taxi`)
- پس‌زمینه با رنگ #3b82f6
- متن "خودروبان" (اختیاری)

#### گام ۳: تولید Icons
```bash
# در پوشه frontend-vue
pwa-asset-generator icon-source.png public/ \
  --icon-only \
  --favicon \
  --type png \
  --padding "20%" \
  --background "#3b82f6"
```

این دستور به صورت خودکار تمام icons را ایجاد می‌کند.

---

### روش ۲: استفاده از RealFaviconGenerator (آنلاین)

1. **رفتن به:** https://realfavicongenerator.net/
2. **آپلود تصویر:** یک تصویر 512x512 با آیکون تاکسی
3. **تنظیمات:**
   - iOS: 180x180, بدون transparency
   - Android Chrome: 192x192, 512x512
   - Favicon: 16x16, 32x32, 48x48
4. **دانلود:** دانلود فایل‌های تولید شده
5. **جایگزینی:** جایگزینی در پوشه `public/`

---

### روش ۳: استفاده از Favicon.io (ساده)

1. **رفتن به:** https://favicon.io/
2. **انتخاب:** Text to Favicon
3. **متن:** 🚗 یا "خ"
4. **رنگ پس‌زمینه:** #3b82f6
5. **دانلود:** دانلود و استخراج فایل‌ها

---

### روش ۴: ساخت دستی با Figma/Photoshop

#### طراحی Icon:
1. ایجاد یک canvas 512x512
2. پس‌زمینه: #3b82f6
3. اضافه کردن آیکون تاکسی (Material Symbol `local_taxi`)
4. ذخیره به عنوان PNG

#### ساخت Icons مختلف:
- **512x512:** برای pwa-512x512.png
- **192x192:** برای pwa-192x192.png (resize از 512x512)
- **180x180:** برای apple-touch-icon.png (resize از 512x512)
- **Favicon:** استفاده از ابزار آنلاین برای تبدیل PNG به ICO

---

## 🎨 پیشنهاد طراحی Icon

### طرح پیشنهادی:
```
┌─────────────────┐
│                 │
│   [🚗 Icon]     │  ← Material Symbol: local_taxi
│                 │
│   خودروبان      │  ← متن (اختیاری)
│                 │
└─────────────────┘
```

### مشخصات:
- **پس‌زمینه:** #3b82f6 (آبی)
- **آیکون:** سفید یا #ffffff
- **Border Radius:** 20% (برای rounded corners)
- **Padding:** 20% از هر طرف
- **سایز آیکون:** 60% از canvas

---

## 📝 مراحل جایگزینی

### ۱. ساخت Icons
با استفاده از یکی از روش‌های بالا، icons را ایجاد کنید.

### ۲. نام‌گذاری
- `pwa-192x192.png`
- `pwa-512x512.png`
- `apple-touch-icon.png`
- `favicon.ico`

### ۳. جایگزینی
فایل‌ها را در پوشه `public/` جایگزین کنید:

```bash
# در پوشه frontend-vue
cp path/to/pwa-192x192.png public/
cp path/to/pwa-512x512.png public/
cp path/to/apple-touch-icon.png public/
cp path/to/favicon.ico public/
```

### ۴. تست
```bash
npm run build
npm run preview
```

سپس در Chrome DevTools:
- Application → Manifest → بررسی icons
- Application → Service Workers → بررسی cache

---

## ✅ چک‌لیست

- [ ] Icon اصلی طراحی شده (512x512)
- [ ] pwa-192x192.png ایجاد شده
- [ ] pwa-512x512.png ایجاد شده
- [ ] apple-touch-icon.png ایجاد شده (180x180)
- [ ] favicon.ico ایجاد شده
- [ ] فایل‌ها در `public/` جایگزین شده‌اند
- [ ] Build و تست انجام شده
- [ ] Icons در Manifest نمایش داده می‌شوند
- [ ] Icons در Add to Home Screen نمایش داده می‌شوند

---

## 🔗 منابع مفید

- [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [Favicon.io](https://favicon.io/)
- [Material Symbols](https://fonts.google.com/icons?selected=Material+Symbols+Outlined:local_taxi:FILL@0;wght@400;GRAD@0;opsz@24)
- [PWA Icon Guidelines](https://web.dev/add-manifest/#icons)

---

## 💡 نکات مهم

1. **سایز:** Icons باید دقیقاً در سایزهای مشخص شده باشند
2. **فرمت:** PNG برای همه (به جز favicon که ICO است)
3. **Transparency:** Apple Touch Icon نباید transparency داشته باشد
4. **کیفیت:** Icons باید واضح و قابل تشخیص باشند
5. **برند:** Icons باید با برند "خودروبان" هماهنگ باشند

---

**آخرین به‌روزرسانی:** ۱۴۰۳/۰۹/۱۴

