# 🌐 راهنمای Frontend - KhodroBan (خودروبان)

> **⚠️ نکته:** این سند در ابتدا برای Vite + Svelte نوشته شد. **وضعیت فعلی پروژه:** مسیر اصلی محصول روی **Vue 3 + Vite + Pinia** است. مرجع اجرایی: `frontend-vue/README.md` و `frontend-vue/IMPLEMENTATION_PLAN.md`.

این سند راهنمای انتخاب تکنولوژی و نقشه راه پیاده‌سازی Frontend را حفظ می‌کند (بخش‌های تطبیق‌پذیر هنوز معتبرند).

---

## 🎯 تصمیم تکنولوژی (تاریخچه)

### انتخاب نهایی: **Vue 3 + Vite** (وضعیت فعلی) — قبلاً Vite + Svelte در نظر بود

### استراتژی پلتفرم

**MVP و فاز ۱**: وب‌اپلیکیشن کاملاً واکنش‌گرا که روی همه دستگاه‌ها کار می‌کند:

- ✅ موبایل اندروید (از طریق مرورگر)
- ✅ موبایل iOS (از طریق مرورگر)
- ✅ تبلت
- ✅ دسکتاپ

**فاز ۲**: تبدیل به Progressive Web App (PWA) برای تجربه بهتر

### چرا این انتخاب؟

#### ✅ مزایا برای توسعه‌دهندگان با تجربه کم

1. **سادگی یادگیری**

   - Syntax ساده‌تر از React
   - نیاز به boilerplate کمتر
   - مفاهیم ساده‌تر برای درک
2. **سرعت توسعه بالا**

   - Vite با HMR (Hot Module Replacement) فوق‌العاده سریع
   - Build time بسیار سریع
   - Developer experience عالی
3. **مناسب برای نیاز پروژه**

   - وب‌اپلیکیشن واکنش‌گرا برای همه دستگاه‌ها
   - SPA (Single Page Application) کافی است
   - قابلیت تبدیل آسان به PWA
   - یک کدبیس برای همه پلتفرم‌ها
4. **مستندات و جامعه**

   - مستندات جامع و واضح
   - جامعه فعال و پاسخگو
   - مثال‌های فراوان

#### ❌ چرا Astro اضافه نمی‌کنیم؟

- پیچیدگی اضافی برای یادگیری
- نیاز به SEO نداریم (داشبورد داخلی)
- نیاز به SSR نداریم
- می‌توانیم بعداً اضافه کنیم اگر نیاز بود

---

## 📦 تکنولوژی‌ها

### هسته اصلی

- **Vite**: Build tool و development server
- **Svelte**: Framework برای ساخت کامپوننت‌های UI
- **JavaScript/TypeScript**: زبان برنامه‌نویسی (TypeScript توصیه می‌شود)

### کتابخانه‌های پیشنهادی (برای مراحل بعدی)

- **Svelte Stores**: State management (built-in Svelte)
- **Axios** یا **fetch API**: برای ارتباط با Django REST API
- **Tailwind CSS** یا **UnoCSS**: برای استایل‌دهی (اختیاری)
- **Vite-plugin-svelte**: پلاگین Vite برای Svelte

---

## 📁 ساختار پیشنهادی

```
frontend/
├── src/
│   ├── lib/
│   │   ├── components/           # کامپوننت‌های قابل استفاده مجدد
│   │   │   ├── common/          # کامپوننت‌های عمومی (Button, Input, Card)
│   │   │   ├── layout/          # کامپوننت‌های layout (Header, Sidebar, Footer)
│   │   │   └── features/        # کامپوننت‌های خاص ویژگی‌ها
│   │   │
│   │   ├── stores/              # Svelte stores برای state management
│   │   │   ├── auth.js         # Store برای احراز هویت
│   │   │   ├── vehicles.js     # Store برای مدیریت خودروها
│   │   │   └── services.js     # Store برای سرویس‌ها
│   │   │
│   │   ├── services/            # سرویس‌ها برای ارتباط با API
│   │   │   ├── api.js          # تنظیمات کلی API (base URL, interceptors)
│   │   │   ├── authService.js  # سرویس احراز هویت
│   │   │   ├── vehicleService.js
│   │   │   └── serviceService.js
│   │   │
│   │   ├── utils/               # توابع کمکی
│   │   │   ├── format.js       # فرمت‌دهی تاریخ، عدد و...
│   │   │   ├── validation.js   # اعتبارسنجی فرم‌ها
│   │   │   └── constants.js    # ثوابت
│   │   │
│   │   └── routes/              # صفحات (اگر از routing استفاده کنیم)
│   │       ├── Home.svelte
│   │       ├── Vehicles.svelte
│   │       └── Services.svelte
│   │
│   ├── App.svelte               # کامپوننت اصلی
│   ├── main.js                  # نقطه ورود اپلیکیشن
│   │
│   └── styles/                  # استایل‌های global
│       └── global.css
│
├── public/                      # فایل‌های استاتیک
│   ├── favicon.ico
│   └── assets/                 # تصاویر و فایل‌های دیگر
│
├── vite.config.js               # تنظیمات Vite
├── svelte.config.js             # تنظیمات Svelte
├── package.json                 # وابستگی‌ها
├── tsconfig.json                # تنظیمات TypeScript (اختیاری)
└── README.md                    # راهنمای Frontend
```

---

## 🗺️ نقشه راه پیاده‌سازی

### فاز ۱: راه‌اندازی اولیه (Setup)

**هدف**: ایجاد پروژه پایه با Vite + Svelte

**مراحل**:

1. **ایجاد پروژه**

   ```bash
   npm create vite@latest frontend -- --template svelte
   cd frontend
   npm install
   ```
2. **نصب وابستگی‌های اصلی**

   ```bash
   npm install axios
   # اگر TypeScript می‌خواهید:
   npm install -D typescript @types/node @sveltejs/tsconfig
   ```
3. **پیکربندی اولیه**

   - تنظیم `vite.config.js` برای proxy به Django backend
   - تنظیم متغیرهای محیطی (`.env`)
   - ایجاد ساختار پوشه‌ها
4. **ایجاد فایل‌های پایه**

   - `src/services/api.js`: تنظیمات کلی API
   - `src/lib/utils/constants.js`: ثوابت (API URL و...)

**خروجی**: پروژه آماده با ساختار اولیه

---

### فاز ۲: طراحی واکنش‌گرا (Responsive Design)

**هدف**: اطمینان از کارکرد کامل روی همه دستگاه‌ها

**مراحل**:

1. **Mobile-First Design**
   - شروع طراحی از موبایل
   - استفاده از CSS Grid و Flexbox
   - Breakpoints مناسب برای موبایل، تبلت و دسکتاپ
2. **تست روی دستگاه‌های مختلف**
   - تست روی مرورگرهای مختلف (Chrome, Firefox, Safari, Edge)
   - تست روی اندازه‌های مختلف صفحه (موبایل، تبلت، دسکتاپ)
   - تست روی دستگاه‌های واقعی اندروید و iOS
3. **بهینه‌سازی Touch Events**
   - دکمه‌ها و لینک‌های مناسب برای لمس
   - Gesture support (swipe, pinch)
4. **بهینه‌سازی Performance**
   - Lazy loading تصاویر
   - Code splitting
   - بهینه‌سازی Bundle size

**خروجی**: وب‌اپلیکیشن کاملاً واکنش‌گرا که روی همه دستگاه‌ها به درستی کار می‌کند

---

### فاز ۳: احراز هویت (Authentication)

**هدف**: پیاده‌سازی سیستم login/logout

**مراحل**:

1. **ایجاد Auth Store**

   - `src/lib/stores/auth.js`
   - مدیریت token و user state
2. **ایجاد Auth Service**

   - `src/services/authService.js`
   - توابع login, logout, register
3. **ایجاد کامپوننت‌های Auth**

   - `Login.svelte`
   - `Register.svelte` (اگر نیاز باشد)
4. **ایجاد Route Guard**

   - محافظت از صفحات که نیاز به login دارند

**خروجی**: کاربر می‌تواند login کند و token ذخیره شود

---

### فاز ۴: Layout و Navigation

**هدف**: ایجاد layout اصلی و navigation

**مراحل**:

1. **کامپوننت‌های Layout**

   - `Header.svelte`
   - `Sidebar.svelte` (اگر داشبورد نیاز دارد)
   - `Layout.svelte`
2. **Navigation**

   - Routing (می‌توان از svelte-spa-router یا svelte-navigator استفاده کرد)
   - منوی navigation
3. **کامپوننت‌های عمومی**

   - `Button.svelte`
   - `Input.svelte`
   - `Card.svelte`

**خروجی**: Layout اصلی و navigation آماده است

---

### فاز ۵: بهبود UI/UX

**هدف**: بهبود ظاهر و تجربه کاربری

**مراحل**:

1. **افزودن CSS Framework** (اختیاری)

   - Tailwind CSS یا UnoCSS
   - یا استفاده از CSS خالص
2. **Loading States**

   - نمایش loading در زمان fetch داده
3. **Error Handling**

   - نمایش خطاها به صورت user-friendly
4. **Toast Notifications**

   - نمایش پیام‌های موفقیت/خطا
5. **بهینه‌سازی برای موبایل**

   - دکمه‌های بزرگ و قابل لمس
   - Navigation مناسب برای موبایل
   - بهینه‌سازی فونت‌ها و اندازه‌ها

**خروجی**: UI/UX بهتر و حرفه‌ای‌تر برای همه دستگاه‌ها

---

### فاز ۶: بهینه‌سازی و Production

**هدف**: آماده‌سازی برای production

**مراحل**:

1. **Performance Optimization**

   - Lazy loading کامپوننت‌ها
   - Code splitting
   - بهینه‌سازی تصاویر
2. **Testing** (اختیاری)

   - Unit tests
   - Component tests
3. **Build Configuration**

   - تنظیمات build برای production
   - Environment variables
4. **Deployment**

   - آماده‌سازی برای deploy (Netlify, Vercel, یا سرور خودتان)

**خروجی**: اپلیکیشن آماده برای production

---

## 🔗 ارتباط با Backend

### تنظیمات API

```javascript
// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor برای اضافه کردن token به header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### مثال استفاده از API

```javascript
// src/services/vehicleService.js
import api from './api.js';

export const getVehicles = async () => {
  const response = await api.get('/vehicles/');
  return response.data;
};

export const createVehicle = async (vehicleData) => {
  const response = await api.post('/vehicles/', vehicleData);
  return response.data;
};
```

---

## 🚀 دستورالعمل‌های توسعه

### اجرای محیط توسعه

```bash
cd frontend
npm install
npm run dev
```

### Build برای production

```bash
npm run build
```

### Preview build

```bash
npm run preview
```

---

## 📚 منابع یادگیری

### مستندات رسمی

- [Vite Documentation](https://vitejs.dev/)
- [Svelte Documentation](https://svelte.dev/docs)
- [Svelte Tutorial](https://svelte.dev/tutorial/basics)

### آموزش‌های پیشنهادی

- شروع با Svelte: ابتدا tutorial رسمی Svelte را کامل کنید
- Vite: یادگیری اصولی Vite و configuration

---

## ⚠️ نکات مهم

1. **CORS**: مطمئن شوید Django backend CORS را برای frontend فعال کرده باشد
2. **Environment Variables**: از `.env` برای متغیرهای محیطی استفاده کنید
3. **Token Management**: token را در localStorage یا cookie ذخیره کنید
4. **Error Handling**: همیشه خطاها را handle کنید

---

## 📱 طراحی واکنش‌گرا (Responsive Design)

### استراتژی Mobile-First

1. **شروع از موبایل**
   - طراحی اولیه برای صفحه کوچک (۳۲۰px+)
   - سپس گسترش به تبلت و دسکتاپ
2. **Breakpoints پیشنهادی**
   ```css
   /* Mobile */
   @media (min-width: 320px) { }

   /* Tablet */
   @media (min-width: 768px) { }

   /* Desktop */
   @media (min-width: 1024px) { }

   /* Large Desktop */
   @media (min-width: 1440px) { }
   ```
3. **تست روی دستگاه‌های واقعی**
   - تست روی موبایل‌های اندروید و iOS
   - استفاده از Chrome DevTools Device Mode
   - تست روی مرورگرهای مختلف

### نکات مهم برای واکنش‌گرایی

- استفاده از واحدهای نسبی (rem, em, %) به جای px
- تصاویر responsive با `srcset` و `sizes`
- Touch-friendly buttons (حداقل ۴۴x۴۴px)
- Navigation مناسب برای موبایل (مثلاً Hamburger Menu)
- بهینه‌سازی فونت‌ها برای خوانایی در همه اندازه‌ها

---

## 🔄 به‌روزرسانی‌های آینده

### امکان اضافه شدن در آینده

- **SvelteKit**: اگر نیاز به routing پیشرفته یا SSR پیدا کردیم
- **Astro**: اگر نیاز به SEO یا صفحات استاتیک پیدا کردیم
- **State Management پیشرفته**: اگر نیاز به state management پیچیده‌تری داشتیم
- **اپلیکیشن‌های موبایل بومی**: در صورت نیاز (Flutter یا Native)

---

## 📝 Checklist پیاده‌سازی

### قبل از شروع

- [ ] Node.js و npm نصب شده باشد
- [ ] Backend API آماده و در دسترس باشد
- [ ] مستندات API بررسی شده باشد

### فاز ۱: Setup

- [ ] پروژه با Vite + Svelte ایجاد شده
- [ ] ساختار پوشه‌ها ایجاد شده
- [ ] وابستگی‌های اولیه نصب شده
- [ ] تنظیمات اولیه انجام شده

### فاز ۲: Responsive Design

- [ ] Mobile-First design پیاده‌سازی شده
- [ ] Breakpoints مناسب تنظیم شده
- [ ] تست روی دستگاه‌های مختلف انجام شده
- [ ] Touch events بهینه شده

### فاز ۳: Authentication

- [ ] Auth store ایجاد شده
- [ ] Auth service ایجاد شده
- [ ] کامپوننت‌های login/logout ایجاد شده

### فاز ۴: Layout

- [ ] Layout اصلی ایجاد شده
- [ ] Navigation آماده است (واکنش‌گرا)
- [ ] کامپوننت‌های عمومی آماده است

### فاز ۵: Core Pages

- [ ] صفحه Dashboard (واکنش‌گرا)
- [ ] صفحه Vehicles (واکنش‌گرا)
- [ ] صفحه Services (واکنش‌گرا)
- [ ] صفحه Notifications (واکنش‌گرا)

### فاز ۶: UI/UX

- [ ] Design system اعمال شده
- [ ] Responsive design کامل
- [ ] Loading و error states
- [ ] Toast notifications
- [ ] بهینه‌سازی برای موبایل

### فاز ۷: PWA

- [ ] Service Worker پیاده‌سازی شده
- [ ] Web App Manifest ایجاد شده
- [ ] Add to Home Screen کار می‌کند
- [ ] Push Notifications (اختیاری)

### فاز ۸: Production

- [ ] Optimization انجام شده
- [ ] Lighthouse Score بالای ۹۰
- [ ] Build برای production تست شده
- [ ] تست روی دستگاه‌های واقعی
- [ ] آماده deploy

---

## 📞 پشتیبانی

اگر در حین پیاده‌سازی به مشکل برخوردید:

1. مستندات رسمی را بررسی کنید
2. Stack Overflow و GitHub Issues را جستجو کنید
3. از جامعه Svelte در Discord استفاده کنید
