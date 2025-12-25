# 🚗 خودروبان (Khodroban) - Frontend

<div dir="rtl" align="right">

**خودروبان** یک وب‌اپلیکیشن واکنش‌گرا برای مدیریت هوشمند نگهداری خودرو است. این اپلیکیشن به کاربران ایرانی کمک می‌کند تا سرویس‌ها، هزینه‌ها و یادآورهای خودرو خود را مدیریت کنند.

## ✨ ویژگی‌ها

- 📱 **طراحی Mobile-First** - کاملاً واکنش‌گرا برای موبایل، تبلت و دسکتاپ
- 🎨 **تم Glassmorphism** - طراحی مدرن با افکت‌های شیشه‌ای
- 📅 **تقویم شمسی** - پشتیبانی کامل از تاریخ جلالی
- 🔔 **یادآورهای هوشمند** - بر اساس زمان و کیلومتر
- 📊 **گزارش‌های جامع** - با قابلیت خروجی CSV و PDF
- 🔐 **احراز هویت JWT** - ورود و ثبت‌نام امن
- 💎 **مدل Freemium** - نسخه رایگان و Pro

## 🛠️ تکنولوژی‌ها

- **Vite** - Build tool سریع
- **Svelte 5** - با قابلیت‌های جدید Runes
- **TypeScript** - تایپ‌گذاری قوی
- **Axios** - ارتباط با API
- **Persian Date** - تقویم شمسی
- **Chart.js** - نمودارها (در صورت نیاز)

## 📁 ساختار پروژه

</div>

```
frontend/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── common/          # Button, Input, Card, Modal, etc.
│   │   │   └── layout/          # Header, Sidebar, BottomNav
│   │   ├── routes/              # Pages: Login, Dashboard, etc.
│   │   ├── stores/              # Svelte stores for state
│   │   ├── services/            # API services
│   │   ├── utils/               # Helpers, validation, constants
│   │   └── types/               # TypeScript types
│   ├── styles/
│   │   └── global.css           # Global styles + Glassmorphism
│   ├── App.svelte               # Root component with router
│   └── main.ts                  # Entry point
├── public/
│   └── favicon.svg
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

<div dir="rtl" align="right">

## 🚀 شروع سریع

### پیش‌نیازها

- Node.js 18+ 
- npm یا pnpm

### نصب و راه‌اندازی

</div>

```bash
# Clone the repository
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

<div dir="rtl" align="right">

سرور توسعه در آدرس `http://localhost:5173` اجرا می‌شود.

## 🔧 تنظیمات

### متغیرهای محیطی

فایل `.env` را در ریشه پروژه ایجاد کنید:

</div>

```env
# Backend Configuration
VITE_BACKEND_TYPE=supabase
VITE_API_URL=http://localhost:8000/api

# Supabase Configuration
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE

# App Configuration
VITE_APP_NAME=خودروبان
VITE_APP_VERSION=1.0.0

# Redirect URLs (برای OAuth)
VITE_REDIRECT_BASE_URL=http://localhost:3000
```

<div dir="rtl" align="right">

### اتصال به Backend

Backend باید در آدرس `http://localhost:8000` در دسترس باشد. Proxy در `vite.config.ts` تنظیم شده است.

**نکته:** در حالت فعلی از Mock Data استفاده می‌شود. برای اتصال به API واقعی، در فایل‌های سرویس متغیر `USE_MOCK` را به `false` تغییر دهید.

## 📱 صفحات

| صفحه | مسیر | توضیح |
|------|------|-------|
| ورود | `/login` | فرم ورود با ایمیل و رمز عبور |
| ثبت‌نام | `/register` | فرم ثبت‌نام کاربر جدید |
| داشبورد | `/dashboard` | نمای کلی خودروها و یادآورها |
| خودروها | `/vehicles` | لیست و مدیریت خودروها |
| جزئیات خودرو | `/vehicles/:id` | سرویس‌ها و هزینه‌های یک خودرو |
| ثبت جدید | `/add` | ثبت سرویس یا هزینه جدید |
| گزارش‌ها | `/reports` | گزارش‌های مالی و آماری |
| تنظیمات | `/settings` | پروفایل و تنظیمات یادآور |

## 🎨 سیستم طراحی

### رنگ‌ها

- **Primary (آبی تیره):** `#1E3A8A` - اعتماد و حرفه‌ای
- **Success (سبز):** `#10B981` - وضعیت عادی
- **Warning (نارنجی):** `#F59E0B` - نزدیک موعد
- **Danger (قرمز):** `#EF4444` - گذشته از موعد

### Glassmorphism

</div>

```css
.glass {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}
```

<div dir="rtl" align="right">

### فونت

از فونت **Vazirmatn** برای متون فارسی استفاده می‌شود که از Google Fonts لود می‌شود.

## 🔄 وضعیت‌های یادآور

| وضعیت | رنگ | توضیح |
|-------|-----|-------|
| عادی | سبز | سرویس بعدی دور است |
| نزدیک موعد | نارنجی | کمتر از ۱۰۰۰ کیلومتر یا ۷ روز |
| گذشته از موعد | قرمز | موعد سرویس گذشته |

## 💎 نسخه Pro

ویژگی‌های نسخه Pro:
- خودروهای نامحدود (نسخه رایگان: ۲ خودرو)
- همگام‌سازی ابری
- خروجی PDF
- یادآور پیامکی
- گزارش‌های پیشرفته

## 🧪 تست

</div>

```bash
# Type checking
npm run check
```

<div dir="rtl" align="right">

## 📦 Build و Deploy

</div>

```bash
# Build for production
npm run build

# Output will be in 'dist' folder
```

<div dir="rtl" align="right">

### Deploy به Vercel

</div>

```bash
npm install -g vercel
vercel
```

<div dir="rtl" align="right">

### Deploy به Netlify

**نکته مهم:** برای عملکرد صحیح OAuth (ورود با گوگل)، باید متغیر محیطی زیر را در Netlify dashboard تنظیم کنید:

- `VITE_REDIRECT_BASE_URL` = `https://your-site-name.netlify.app`

</div>

```bash
npm install -g netlify-cli
netlify deploy --prod
```

<div dir="rtl" align="right">

**گام‌های تنظیم Netlify:**

1. به [Netlify Dashboard](https://app.netlify.com) بروید
2. پروژه خود را انتخاب کنید
3. به بخش **Site settings** → **Environment variables** بروید
4. متغیر `VITE_REDIRECT_BASE_URL` را با URL واقعی سایت خود تنظیم کنید

</div>

<div dir="rtl" align="right">

## 📝 یادداشت‌های توسعه

### Mock Data

برای توسعه بدون نیاز به Backend، از Mock Data استفاده می‌شود. برای استفاده از API واقعی:

1. در فایل‌های سرویس (`src/lib/services/`) متغیر `USE_MOCK` را به `false` تغییر دهید
2. مطمئن شوید Backend در حال اجرا است

### Svelte 5 Runes

این پروژه از Svelte 5 با قابلیت‌های Runes استفاده می‌کند:
- `$state` برای reactive state
- `$derived` برای computed values
- `$effect` برای side effects
- `$props` برای component props

## 🤝 مشارکت

1. Fork کنید
2. Branch جدید بسازید (`git checkout -b feature/amazing-feature`)
3. تغییرات را Commit کنید (`git commit -m 'Add amazing feature'`)
4. Push کنید (`git push origin feature/amazing-feature`)
5. Pull Request بسازید

## 📄 لایسنس

این پروژه تحت لایسنس MIT منتشر شده است.

---

ساخته شده با ❤️ برای رانندگان ایرانی

</div>
