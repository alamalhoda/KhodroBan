# 📘 مستند کامل پیاده‌سازی پروژه واسط کاربری Vue.js

## 📋 فهرست مطالب

1. [مقدمه و هدف](#مقدمه-و-هدف)
2. [معماری پروژه](#معماری-پروژه)
3. [سرویس‌های اشتراکی](#سرویسهای-اشتراکی)
4. [ساختار پروژه Vue.js](#ساختار-پروژه-vuejs)
5. [راهنمای پیاده‌سازی](#راهنمای-پیادهسازی)
6. [الگوهای معماری](#الگوهای-معماری)
7. [پرامپت ادامه کار](#پرامپت-ادامه-کار)

---

## 🎯 مقدمه و هدف

### هدف کلی
پیاده‌سازی یک پروژه واسط کاربری جدید با استفاده از **Vue.js 3** که از سرویس‌های اشتراکی موجود در پروژه استفاده می‌کند. این پروژه به عنوان یک **SPA (Single Page Application)** طراحی شده و مستقل از پروژه اصلی SvelteKit عمل می‌کند.

### مزایای استفاده از Vue.js
- ✅ **Performance بالا**: Vue 3 با Composition API و Reactivity System بهینه
- ✅ **اکوسیستم قوی**: Vue Router، Pinia، vue-i18n، و ابزارهای توسعه
- ✅ **یادگیری آسان**: Syntax ساده و قابل فهم
- ✅ **قابلیت استفاده مجدد**: کامپوننت‌های قابل استفاده مجدد
- ✅ **PWA Ready**: پشتیبانی کامل از Progressive Web App
- ✅ **Accessibility**: composables مخصوص برای دسترس‌پذیری
- ✅ **Internationalization**: پشتیبانی از چندزبانه
- ✅ **Testing**: پشتیبانی از Vitest برای تست واحد

### اهداف فنی
1. استفاده از سرویس‌های اشتراکی موجود (`shared/services`)
2. پیاده‌سازی State Management با Pinia
3. Routing با Vue Router و Lazy Loading
4. Styling با Tailwind CSS و پشتیبانی از Dark Mode
5. Internationalization (i18n) با vue-i18n (پشتیبانی از فارسی، انگلیسی، عربی)
6. Progressive Web App (PWA) با vite-plugin-pwa
7. Accessibility (a11y) با composables مخصوص
8. Testing با Vitest
9. Error Handling مرکزی
10. ساختار قابل نگهداری و مقیاس‌پذیر

---

## 🏗️ معماری پروژه

### ساختار کلی Monorepo

```
OilChenger/
├── shared/              # سرویس‌های اشتراکی (بدون وابستگی به Framework)
│   ├── services/        # API Services
│   ├── types/           # TypeScript Types
│   └── utils/           # Utility Functions
│
├── frontend/            # پروژه SvelteKit (موجود)
│   └── src/
│
└── frontend-vue/        # پروژه Vue.js جدید
    ├── src/
    │   ├── components/  # کامپوننت‌های Vue
    │   ├── views/       # صفحات اصلی
    │   ├── stores/      # Pinia Stores
    │   ├── services/    # Service Wrappers
    │   └── router/      # Vue Router
    └── package.json
```

### جریان داده (Data Flow)

```
┌─────────────────┐
│  Vue Component  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Pinia Store    │ ◄─── State Management
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Service Wrapper │ ◄─── Framework-specific logic
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Shared Service  │ ◄─── Business Logic (Framework-agnostic)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  API / Supabase │ ◄─── Backend
└─────────────────┘
```

---

## 📦 سرویس‌های اشتراکی

### لیست سرویس‌های موجود

پروژه `shared/` شامل سرویس‌های زیر است که بدون وابستگی به Framework کار می‌کنند:

#### 1. **authService** (`shared/services/authService.ts`)
- `login(credentials)` - ورود با ایمیل و رمز عبور
- `register(data)` - ثبت‌نام کاربر جدید
- `loginWithGoogle()` - ورود با Google OAuth
- `logout()` - خروج از حساب کاربری
- `getProfile()` - دریافت پروفایل کاربر
- `updateProfile(data)` - به‌روزرسانی پروفایل
- `forgotPassword(email)` - فراموشی رمز عبور
- `resetPassword(token, password)` - تغییر رمز عبور
- `upgradeToPro()` - ارتقا به نسخه Pro

#### 2. **vehicleService** (`shared/services/vehicleService.ts`)
- مدیریت خودروها (CRUD operations)
- دریافت لیست خودروها
- افزودن، ویرایش، حذف خودرو

#### 3. **serviceService** (`shared/services/serviceService.ts`)
- مدیریت سرویس‌های خودرو
- انواع سرویس (تعویض روغن، فیلتر، و غیره)
- تاریخچه سرویس‌ها

#### 4. **expenseService** (`shared/services/expenseService.ts`)
- مدیریت هزینه‌های خودرو
- ثبت و ردیابی هزینه‌ها

#### 5. **reminderService** (`shared/services/reminderService.ts`)
- مدیریت یادآوری‌های سرویس
- تنظیمات یادآوری

#### 6. **reportService** (`shared/services/reportService.ts`)
- گزارش‌های آماری و تحلیل هزینه‌ها
- **Django:** `getSummary(vehicleId?, date_from?, date_to?)` → خلاصه با totalCost، totalKm، costByCategory، costByMonth
- **exportCSV:** ساخته‌شده سمت کلاینت از لیست سرویس و هزینه (GET services/expenses)
- **getMonthlyTrend:** از costByMonth پاسخ getSummary

#### 7. **upgradeService** (`shared/services/upgradeService.ts`)
- مدیریت ارتقا به نسخه Pro
- پرداخت و اشتراک

#### 8. **notificationService** (`shared/services/notificationService.ts`)
- مدیریت نوتیفیکیشن‌ها
- Realtime notifications

#### 9. **AI Service** (`shared/services/ai/`)
- تحلیل مشکلات خودرو
- Smart Advisor
- پشتیبانی از چندین Provider (OpenAI, Gemini)

### پیکربندی Backend

سرویس‌ها از طریق `config.ts` پشتیبانی از سه نوع Backend را دارند:

```typescript
type BackendType = 'mock' | 'supabase' | 'django';
```

- **mock**: برای توسعه و تست (بدون نیاز به Backend)
- **supabase**: استفاده از Supabase (پیش‌فرض)
- **django**: استفاده از Django REST API

پیکربندی از طریق Environment Variable:
```bash
VITE_BACKEND_TYPE=supabase  # یا mock یا django
```

---

## 📁 ساختار پروژه Vue.js

### ساختار دایرکتوری‌ها

```
frontend-vue/
├── public/                 # فایل‌های استاتیک
│   ├── fonts/              # فونت‌های محلی (Vazirmatn, Material Symbols)
│   ├── pwa-192x192.png     # آیکون PWA
│   ├── pwa-512x512.png     # آیکون PWA
│   ├── apple-touch-icon.png
│   └── favicon.ico
│
├── src/
│   ├── assets/            # تصاویر و فایل‌های استاتیک
│   │   └── vue.svg
│   │
│   ├── components/         # کامپوننت‌های قابل استفاده مجدد
│   │   ├── ui/             # کامپوننت‌های UI پایه
│   │   │   ├── Button.vue
│   │   │   ├── Button.test.js
│   │   │   ├── Card.vue
│   │   │   ├── Card.test.js
│   │   │   ├── Input.vue
│   │   │   ├── Input.test.js
│   │   │   ├── Select.vue
│   │   │   ├── Modal.vue
│   │   │   ├── Modal.test.js
│   │   │   ├── Toast.vue
│   │   │   ├── ToastContainer.vue
│   │   │   ├── LoadingSpinner.vue
│   │   │   └── Form.vue
│   │   ├── dashboard/      # زیرکامپوننت‌های Dashboard
│   │   │   ├── index.js
│   │   │   ├── DashboardHeader.vue
│   │   │   ├── DashboardRightColumn.vue
│   │   │   ├── QuickStatsCard.vue
│   │   │   ├── RemindersSection.vue
│   │   │   └── VehiclesSection.vue
│   │   ├── ServiceTypeCategory.vue      # زیرکامپوننت انتخاب نوع سرویس
│   │   ├── ServiceTypeSelectorFooter.vue # Footer برای ServiceTypeSelector
│   │   ├── layout/         # کامپوننت‌های Layout
│   │   │   └── index.js
│   │   ├── features/       # کامپوننت‌های Feature
│   │   │   └── index.js
│   │   ├── Header.vue      # Header اصلی
│   │   ├── Sidebar.vue     # Sidebar اصلی
│   │   ├── MainLayout.vue  # Layout اصلی
│   │   ├── LanguageSwitcher.vue
│   │   ├── LanguageSwitcherCard.vue
│   │   ├── NotificationBell.vue
│   │   ├── ReminderForm.vue
│   │   ├── ServiceTypeSelector.vue
│   │   └── TelegramSettings.vue
│   │
│   ├── views/             # صفحات اصلی (Route Components)
│   │   ├── LoginView.vue
│   │   ├── SignUpView.vue
│   │   ├── AuthCallbackView.vue  # Callback برای OAuth
│   │   ├── DashboardView.vue
│   │   ├── DashboardView.test.js
│   │   ├── DashboardVariant3View.vue
│   │   ├── DashboardVariant16View.vue
│   │   ├── VehicleListView.vue
│   │   ├── VehicleDetailsView.vue
│   │   ├── VehicleManagementView.vue
│   │   ├── RemindersView.vue
│   │   ├── ReminderManagementView.vue
│   │   ├── ReportsView.vue
│   │   ├── SettingsView.vue
│   │   ├── AddServiceView.vue
│   │   ├── SelectServiceTypeView.vue
│   │   ├── SelectServiceTypeVariant5View.vue
│   │   ├── SelectServiceDetailsVariant15View.vue
│   │   ├── ServiceListView.vue
│   │   ├── SmartAssistantView.vue
│   │   └── UpgradeProView.vue
│   │
│   ├── utils/             # توابع کمکی (جداسازی از views)
│   │   ├── index.js       # Barrel export
│   │   ├── formatters.js  # formatCurrency, formatNumber, formatDate, getRelativeTime
│   │   └── formatters.test.js
│   │
│   ├── stores/            # Pinia Stores
│   │   ├── index.js       # Export مرکزی stores
│   │   ├── auth.js        # Store برای Authentication
│   │   ├── auth.test.js
│   │   ├── vehicle.js     # Store برای Vehicles
│   │   ├── vehicle.test.js
│   │   ├── service.js     # Store برای Services
│   │   ├── serviceType.js # Store برای Service Types
│   │   ├── expense.js     # Store برای Expenses
│   │   ├── expenseCategory.js # Store برای Expense Categories
│   │   ├── reminder.js    # Store برای Reminders
│   │   ├── report.js      # Store برای Reports
│   │   ├── ai.js          # Store برای AI Assistant
│   │   ├── dashboard.js   # Store برای Dashboard
│   │   ├── dashboard.test.js
│   │   ├── notification.js # Store برای Notifications
│   │   ├── telegram.js    # Store برای Telegram Integration
│   │   ├── settings.js    # Store برای Settings
│   │   ├── upgrade.js     # Store برای Upgrade to Pro
│   │   ├── smartAssistant.js # Store برای Smart Assistant (AI)
│   │   ├── ui.js          # Store برای UI State (Toast, Modal, etc.)
│   │   └── ui.test.js
│   │
│   ├── services/          # Service Wrappers
│   │   ├── index.js       # Re-export از shared/services
│   │   ├── dashboardService.js
│   │   ├── serviceTypeService.js
│   │   ├── expenseCategoryService.js
│   │   ├── telegramService.js
│   │   └── errorHandler.js # Error Handling مرکزی
│   │
│   ├── router/            # Vue Router Configuration
│   │   └── index.js       # Route definitions با Lazy Loading
│   │
│   ├── composables/       # Vue Composables
│   │   ├── index.js       # Export مرکزی composables
│   │   ├── useToast.js    # Toast notifications
│   │   ├── useAria.js     # ARIA attributes
│   │   ├── useColorContrast.js # Color contrast
│   │   ├── useFocus.js    # Focus management
│   │   ├── useFocusTrap.js # Focus trap
│   │   ├── useKeyboardNavigation.js # Keyboard navigation
│   │   ├── useReducedMotion.js # Reduced motion
│   │   └── useSkipLink.js # Skip links
│   │
│   ├── i18n/              # Internationalization
│   │   └── index.js       # i18n configuration
│   │
│   ├── locales/           # فایل‌های ترجمه
│   │   ├── fa.json        # فارسی
│   │   ├── en.json        # انگلیسی
│   │   └── ar.json        # عربی
│   │
│   ├── test/              # تست‌ها
│   │   ├── setup.js       # Test setup (Vitest، jsdom، Pinia)
│   │   └── utils.js       # Test utilities
│   │
│   ├── App.vue            # Root Component
│   ├── main.js            # Entry Point
│   └── style.css          # Global Styles
│
├── docs/                  # مستندات پروژه
│   ├── VUE_FRONTEND_README.md
│   ├── TESTING_ACCESSIBILITY.md
│   ├── LIGHTHOUSE_ANALYSIS.md
│   ├── PWA_*.md           # مستندات PWA
│   ├── TELEGRAM_*.md      # مستندات Telegram
│   └── ...
│
├── ux/                    # UX Mockups و Designs
│   ├── auth/
│   ├── dashboard/
│   ├── vehicles/
│   ├── services/
│   ├── expenses/
│   ├── reminder/
│   ├── report/
│   ├── settings/
│   ├── smart-advisor/
│   └── upgrade/
│
├── index.html             # HTML Entry Point
├── package.json           # Dependencies
├── vite.config.js         # Vite Configuration (با PWA)
├── vitest.config.js       # Vitest Configuration
├── tailwind.config.js     # Tailwind Configuration (با Dark Mode)
└── postcss.config.js      # PostCSS Configuration
```

### پیکربندی Vite

فایل `vite.config.js` شامل موارد زیر است:

#### Aliasها

```javascript
{
  '@': './src',
  '@shared': '../shared',
  '@services': '../shared/services',
  '@types': '../shared/types',
  '@utils': '../shared/utils'
}
```

این aliasها امکان import مستقیم از shared را فراهم می‌کنند:

```javascript
import { authService } from '@services/authService';
import type { User } from '@types';
```

#### پیکربندی PWA

پروژه از `vite-plugin-pwa` برای تبدیل به Progressive Web App استفاده می‌کند:

- **Auto Update**: به‌روزرسانی خودکار Service Worker
- **Manifest**: پیکربندی کامل manifest.json
- **Workbox**: استراتژی‌های caching برای فونت‌ها و API calls
- **Icons**: آیکون‌های PWA در اندازه‌های مختلف

#### بهینه‌سازی Build

- **Code Splitting**: تقسیم خودکار کد به chunks
- **Manual Chunks**: تقسیم vendor libraries به chunks جداگانه
- **Lazy Loading**: بارگذاری lazy برای views
- **Asset Optimization**: بهینه‌سازی فایل‌های استاتیک

#### پیکربندی Development Server

- **Port**: 5174 (متفاوت از SvelteKit)
- **HMR**: Hot Module Replacement فعال

---

## 🚀 راهنمای پیاده‌سازی

### مرحله 1: راه‌اندازی اولیه

#### 1.1 نصب Dependencies

```bash
cd frontend-vue
npm install
```

### Dependencies اصلی

- **vue**: ^3.5.24 - Framework اصلی
- **vue-router**: ^4.6.4 - Routing
- **pinia**: ^3.0.4 - State Management
- **vue-i18n**: ^9.14.5 - Internationalization
- **@supabase/supabase-js**: ^2.89.0 - Supabase Client
- **axios**: ^1.13.2 - HTTP Client
- **persian-date**: ^1.1.0 - تاریخ شمسی

### Dev Dependencies

- **vite**: ^7.2.4 - Build Tool
- **@vitejs/plugin-vue**: ^6.0.1 - Vue Plugin
- **vite-plugin-pwa**: ^1.2.0 - PWA Support
- **tailwindcss**: ^3.4.17 - CSS Framework
- **vitest**: ^2.1.8 - Testing Framework
- **@vue/test-utils**: ^2.4.6 - Vue Test Utils

#### 1.2 پیکربندی Environment Variables

ایجاد فایل `.env`:

```bash
# Backend Type: mock | supabase | django
VITE_BACKEND_TYPE=supabase

# Supabase Configuration (اگر از Supabase استفاده می‌کنید)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Redirect Base URL (برای OAuth)
VITE_REDIRECT_BASE_URL=http://localhost:5174
```

#### 1.3 اجرای Development Server

```bash
npm run dev
```

سرور روی پورت **5174** اجرا می‌شود.

#### 1.4 Scripts موجود

```bash
# Development
npm run dev              # اجرای development server

# Build
npm run build            # Build برای production
npm run preview          # Preview build

# Testing
npm run test             # اجرای تست‌ها (watch)
npm run test:run         # اجرای یک‌بار تست‌ها
npm run test:ui          # اجرای Vitest UI
npm run test:watch       # اجرای تست‌ها با watch mode
npm run test:coverage    # اجرای تست‌ها با coverage

# Fonts
npm run download-fonts   # دانلود فونت‌ها
npm run get-font-urls    # دریافت URL فونت‌ها
```

### مرحله 1.5: پیکربندی Entry Point

فایل `main.js` شامل پیکربندی کامل است:

```javascript
// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { setupErrorHandlers } from './services/errorHandler'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)

// Setup error handlers after Pinia is initialized
setupErrorHandlers()

app.mount('#app')
```

### مرحله 2: پیاده‌سازی State Management (Pinia)

#### 2.1 ایجاد Auth Store

```javascript
// src/stores/auth.js
import { defineStore } from 'pinia';
import { authService } from '../services';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null);
  const token = ref(localStorage.getItem('token') || null);
  const isLoading = ref(false);

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const userName = computed(() => user.value?.name || 'کاربر');

  // Actions
  async function login(credentials) {
    isLoading.value = true;
    try {
      const result = await authService.login(credentials);
      user.value = result.user;
      token.value = result.token;
      localStorage.setItem('token', result.token);
      return result;
    } finally {
      isLoading.value = false;
    }
  }

  async function register(data) {
    isLoading.value = true;
    try {
      const result = await authService.register(data);
      user.value = result.user;
      token.value = result.token;
      localStorage.setItem('token', result.token);
      return result;
    } finally {
      isLoading.value = false;
    }
  }

  async function logout() {
    await authService.logout();
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
  }

  async function loadProfile() {
    if (!token.value) return;
    try {
      user.value = await authService.getProfile();
    } catch (error) {
      console.error('Error loading profile:', error);
      await logout();
    }
  }

  return {
    // State
    user,
    token,
    isLoading,
    // Getters
    isAuthenticated,
    userName,
    // Actions
    login,
    register,
    logout,
    loadProfile,
  };
});
```

#### 2.2 ایجاد Vehicle Store

```javascript
// src/stores/vehicles.js
import { defineStore } from 'pinia';
import { vehicleService } from '../services';
import { ref } from 'vue';

export const useVehicleStore = defineStore('vehicles', () => {
  const vehicles = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  async function fetchVehicles() {
    isLoading.value = true;
    error.value = null;
    try {
      vehicles.value = await vehicleService.getAll();
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function addVehicle(vehicleData) {
    isLoading.value = true;
    try {
      const newVehicle = await vehicleService.create(vehicleData);
      vehicles.value.push(newVehicle);
      return newVehicle;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateVehicle(id, vehicleData) {
    isLoading.value = true;
    try {
      const updated = await vehicleService.update(id, vehicleData);
      const index = vehicles.value.findIndex(v => v.id === id);
      if (index !== -1) {
        vehicles.value[index] = updated;
      }
      return updated;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteVehicle(id) {
    isLoading.value = true;
    try {
      await vehicleService.delete(id);
      vehicles.value = vehicles.value.filter(v => v.id !== id);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    vehicles,
    isLoading,
    error,
    fetchVehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle,
  };
});
```

#### 2.3 ایجاد UI Store (Toast, Modal, etc.)

```javascript
// src/stores/ui.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUIStore = defineStore('ui', () => {
  const toast = ref(null);
  const showModal = ref(false);
  const modalContent = ref(null);

  function showToast(message, type = 'info') {
    toast.value = { message, type, id: Date.now() };
    setTimeout(() => {
      toast.value = null;
    }, 3000);
  }

  function success(message) {
    showToast(message, 'success');
  }

  function error(message) {
    showToast(message, 'error');
  }

  function warning(message) {
    showToast(message, 'warning');
  }

  function info(message) {
    showToast(message, 'info');
  }

  function openModal(content) {
    modalContent.value = content;
    showModal.value = true;
  }

  function closeModal() {
    showModal.value = false;
    modalContent.value = null;
  }

  return {
    toast,
    showModal,
    modalContent,
    showToast,
    success,
    error,
    warning,
    info,
    openModal,
    closeModal,
  };
});
```

### مرحله 3: پیاده‌سازی Router

Router از Lazy Loading برای بهینه‌سازی performance استفاده می‌کند:

```javascript
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Critical routes (loaded immediately)
const LoginView = () => import('../views/LoginView.vue')
const AuthCallbackView = () => import('../views/AuthCallbackView.vue')
const SignUpView = () => import('../views/SignUpView.vue')

// Main app routes (lazy loaded)
const DashboardView = () => import('../views/DashboardView.vue')
const VehicleListView = () => import('../views/VehicleListView.vue')
const VehicleDetailsView = () => import('../views/VehicleDetailsView.vue')
const VehicleManagementView = () => import('../views/VehicleManagementView.vue')
const RemindersView = () => import('../views/RemindersView.vue')
const ReminderManagementView = () => import('../views/ReminderManagementView.vue')
const ReportsView = () => import('../views/ReportsView.vue')
const SettingsView = () => import('../views/SettingsView.vue')
const AddServiceView = () => import('../views/AddServiceView.vue')
const SelectServiceTypeView = () => import('../views/SelectServiceTypeView.vue')
const ServiceListView = () => import('../views/ServiceListView.vue')
const SmartAssistantView = () => import('../views/SmartAssistantView.vue')
const UpgradeProView = () => import('../views/UpgradeProView.vue')

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresGuest: true }
  },
  {
    path: '/auth/callback',
    name: 'auth-callback',
    component: AuthCallbackView
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignUpView,
    meta: { requiresGuest: true }
  },
  {
    path: '/vehicle-list',
    name: 'vehicle-list',
    component: VehicleListView,
    meta: { requiresAuth: true }
  },
  {
    path: '/vehicle-details/:id',
    name: 'vehicle-details',
    component: VehicleDetailsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/vehicle-management',
    name: 'vehicle-management',
    component: VehicleManagementView,
    meta: { requiresAuth: true }
  },
  {
    path: '/reminders',
    name: 'reminders',
    component: RemindersView,
    meta: { requiresAuth: true }
  },
  {
    path: '/reminder-management',
    name: 'reminder-management',
    component: ReminderManagementView,
    meta: { requiresAuth: true }
  },
  {
    path: '/reports',
    name: 'reports',
    component: ReportsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/add-service',
    name: 'add-service',
    component: AddServiceView,
    meta: { requiresAuth: true }
  },
  {
    path: '/select-service',
    name: 'select-service',
    component: SelectServiceTypeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/service-list',
    name: 'service-list',
    component: ServiceListView,
    meta: { requiresAuth: true }
  },
  {
    path: '/smart-assistant',
    name: 'smart-assistant',
    component: SmartAssistantView,
    meta: { requiresAuth: true }
  },
  {
    path: '/upgrade-pro',
    name: 'upgrade-pro',
    component: UpgradeProView,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation Guards با پشتیبانی از initialization
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Initialize auth store if needed
  if (!authStore.user && (authStore.token || localStorage.getItem('token'))) {
    try {
      await authStore.initialize()
    } catch (err) {
      console.debug('Auth initialization failed:', err)
    }
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }

  // Check if route requires guest
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: 'dashboard' })
    return
  }

  next()
})

export default router
```

### مرحله 4: پیاده‌سازی Service Wrapper

```javascript
// src/services/index.js
// Re-export services from shared
export { default as api, getErrorMessage, setErrorHandlers } from '@services/api';
export { authService } from '@services/authService';
export { vehicleService } from '@services/vehicleService';
export { serviceService } from '@services/serviceService';
export { expenseService } from '@services/expenseService';
export { reminderService } from '@services/reminderService';
export { reportService } from '@services/reportService';
export { upgradeService } from '@services/upgradeService';
export { notificationService } from '@services/notificationService';
export { supabase } from '@services/supabase';

// Local services
export { dashboardService } from './dashboardService';
export { serviceTypeService } from './serviceTypeService';
export { expenseCategoryService } from './expenseCategoryService';
export { telegramService } from './telegramService';
```

### مرحله 4.1: Error Handler Service

```javascript
// src/services/errorHandler.js
import { useAuthStore } from '../stores/auth';
import { useUIStore } from '../stores/ui';
import { setErrorHandlers } from '@services/api';

export function setupErrorHandlers() {
  setErrorHandlers({
    onAuthError: () => {
      const authStore = useAuthStore();
      authStore.logout();
      // Redirect به login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    },
    onToast: (message, type = 'info') => {
      const uiStore = useUIStore();
      if (type === 'error') {
        uiStore.error(message);
      } else if (type === 'warning') {
        uiStore.warning(message);
      } else {
        uiStore.info(message);
      }
    },
  });
}
```

### مرحله 5: پیاده‌سازی کامپوننت‌ها

#### 5.1 کامپوننت Layout

```vue
<!-- src/components/Layout.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <Header />
    <div class="flex">
      <Sidebar />
      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
    <Toast v-if="toast" :message="toast.message" :type="toast.type" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import Header from './Header.vue';
import Sidebar from './Sidebar.vue';
import Toast from './Toast.vue';

const uiStore = useUIStore();
const toast = computed(() => uiStore.toast);
</script>
```

#### 5.2 کامپوننت Login

```vue
<!-- src/views/LoginView.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
      <h2 class="text-2xl font-bold text-center">ورود به حساب کاربری</h2>
      
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">ایمیل</label>
          <input
            v-model="email"
            type="email"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">رمز عبور</label>
          <input
            v-model="password"
            type="password"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {{ isLoading ? 'در حال ورود...' : 'ورود' }}
        </button>
      </form>
      
      <div class="text-center">
        <button @click="loginWithGoogle" class="text-blue-600 hover:underline">
          ورود با Google
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useUIStore } from '../stores/ui';
import { authService } from '../services';

const router = useRouter();
const authStore = useAuthStore();
const uiStore = useUIStore();

const email = ref('');
const password = ref('');
const isLoading = ref(false);

async function handleLogin() {
  isLoading.value = true;
  try {
    await authStore.login({
      email: email.value,
      password: password.value,
    });
    const redirect = router.currentRoute.value.query.redirect || '/dashboard';
    router.push(redirect);
    uiStore.success('با موفقیت وارد شدید');
  } catch (error) {
    uiStore.error(error.message || 'خطا در ورود');
  } finally {
    isLoading.value = false;
  }
}

async function loginWithGoogle() {
  try {
    await authService.loginWithGoogle();
  } catch (error) {
    uiStore.error(error.message || 'خطا در ورود با Google');
  }
}
</script>
```

### مرحله 6: پیاده‌سازی صفحات اصلی

#### 6.1 Dashboard

```vue
<!-- src/views/DashboardView.vue -->
<template>
  <Layout>
    <div class="space-y-6">
      <h1 class="text-3xl font-bold">داشبورد</h1>
      
      <div v-if="isLoading" class="text-center py-8">
        <p>در حال بارگذاری...</p>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="تعداد خودروها" :value="vehicles.length" />
        <Card title="سرویس‌های فعال" :value="activeServices" />
        <Card title="یادآوری‌ها" :value="reminders.length" />
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import Layout from '../components/Layout.vue';
import Card from '../components/Card.vue';
import { useVehicleStore } from '../stores/vehicles';
import { useReminderStore } from '../stores/reminders';

const vehicleStore = useVehicleStore();
const reminderStore = useReminderStore();

const vehicles = computed(() => vehicleStore.vehicles);
const reminders = computed(() => reminderStore.reminders);
const isLoading = computed(() => vehicleStore.isLoading || reminderStore.isLoading);
const activeServices = computed(() => {
  // محاسبه تعداد سرویس‌های فعال
  return 0; // TODO: پیاده‌سازی
});

onMounted(async () => {
  await Promise.all([
    vehicleStore.fetchVehicles(),
    reminderStore.fetchReminders(),
  ]);
});
</script>
```

---

## 🎨 الگوهای معماری

### 1. Composition API Pattern

استفاده از Composition API برای منطق قابل استفاده مجدد:

```javascript
// src/composables/useAuth.js
import { computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

export function useAuth() {
  const authStore = useAuthStore();
  const router = useRouter();

  const isAuthenticated = computed(() => authStore.isAuthenticated);
  const user = computed(() => authStore.user);

  async function login(credentials) {
    try {
      await authStore.login(credentials);
      router.push('/dashboard');
    } catch (error) {
      throw error;
    }
  }

  async function logout() {
    await authStore.logout();
    router.push('/login');
  }

  return {
    isAuthenticated,
    user,
    login,
    logout,
  };
}
```

### 2. Service Layer Pattern

جداسازی منطق کسب‌وکار از کامپوننت‌ها:

```javascript
// src/services/vehicleServiceWrapper.js
import { vehicleService } from '@services/vehicleService';
import { useVehicleStore } from '../stores/vehicles';
import { useUIStore } from '../stores/ui';

export async function createVehicleWithNotification(vehicleData) {
  const vehicleStore = useVehicleStore();
  const uiStore = useUIStore();
  
  try {
    const vehicle = await vehicleStore.addVehicle(vehicleData);
    uiStore.success('خودرو با موفقیت اضافه شد');
    return vehicle;
  } catch (error) {
    uiStore.error('خطا در افزودن خودرو');
    throw error;
  }
}
```

### 3. Error Handling Pattern

مدیریت خطاها به صورت مرکزی:

```javascript
// src/utils/errorHandler.js
import { useUIStore } from '../stores/ui';

export function handleError(error, defaultMessage = 'خطایی رخ داد') {
  const uiStore = useUIStore();
  const message = error?.message || defaultMessage;
  uiStore.error(message);
  console.error('Error:', error);
}
```

---

## 🌐 Internationalization (i18n)

پروژه از `vue-i18n` برای پشتیبانی از چندزبانه استفاده می‌کند.

### زبان‌های پشتیبانی شده

- **فارسی (fa)**: زبان پیش‌فرض
- **انگلیسی (en)**: زبان دوم
- **عربی (ar)**: زبان سوم

### ساختار فایل‌های ترجمه

فایل‌های ترجمه در `src/locales/` قرار دارند:

```json
// src/locales/fa.json
{
  "welcome": "خوش آمدید",
  "login": "ورود",
  "logout": "خروج"
}
```

### استفاده در کامپوننت‌ها

```vue
<script setup>
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

// تغییر زبان
function changeLanguage(lang) {
  locale.value = lang
}
</script>

<template>
  <h1>{{ t('welcome') }}</h1>
  <button @click="changeLanguage('en')">English</button>
</template>
```

### کامپوننت LanguageSwitcher

کامپوننت `LanguageSwitcher` برای تغییر زبان در دسترس است:

```vue
<LanguageSwitcher />
```

### RTL/LTR Support

سیستم به صورت خودکار `dir` و `lang` attribute های HTML را بر اساس زبان انتخاب شده تنظیم می‌کند.

---

## 📱 Progressive Web App (PWA)

پروژه به عنوان یک Progressive Web App پیکربندی شده است.

### ویژگی‌های PWA

- ✅ **Service Worker**: برای caching و offline support
- ✅ **Web App Manifest**: برای نصب روی دستگاه
- ✅ **Icons**: آیکون‌های مختلف برای پلتفرم‌های مختلف
- ✅ **Auto Update**: به‌روزرسانی خودکار Service Worker

### پیکربندی

پیکربندی PWA در `vite.config.js` انجام شده است:

```javascript
VitePWA({
  registerType: 'autoUpdate',
  manifest: {
    name: 'خودروبان - مدیریت سرویس خودرو',
    short_name: 'خودروبان',
    theme_color: '#3b82f6',
    icons: [...]
  },
  workbox: {
    runtimeCaching: [...]
  }
})
```

### Caching Strategy

- **Fonts**: CacheFirst با expiration 1 سال
- **Supabase API**: NetworkFirst با expiration 24 ساعت
- **Static Assets**: Precached

### مستندات PWA

برای اطلاعات بیشتر به مستندات زیر مراجعه کنید:
- `docs/PWA_ARCHITECTURE.md`
- `docs/PWA_SETUP.md`
- `docs/PWA_COMPLETE_GUIDE.md`

---

## ♿ Accessibility (a11y)

پروژه از composables مخصوص برای بهبود دسترس‌پذیری استفاده می‌کند.

### Composables موجود

#### 1. `useAria`
مدیریت ARIA attributes:

```javascript
import { useAria } from '@/composables'

const { ariaLabel, ariaDescribedBy } = useAria({
  label: 'دکمه ورود',
  description: 'برای ورود به حساب کاربری کلیک کنید'
})
```

#### 2. `useFocus`
مدیریت focus:

```javascript
import { useFocus } from '@/composables'

const { focus, blur, focusFirst, focusLast } = useFocus()
```

#### 3. `useFocusTrap`
تله‌گذاری focus در modal:

```javascript
import { useFocusTrap } from '@/composables'

const { trapFocus, releaseFocus } = useFocusTrap()
```

#### 4. `useKeyboardNavigation`
ناوبری با کیبورد:

```javascript
import { useKeyboardNavigation } from '@/composables'

const { handleKeyDown } = useKeyboardNavigation({
  onEnter: () => submit(),
  onEscape: () => close()
})
```

#### 5. `useSkipLink`
Skip links برای دسترسی سریع:

```javascript
import { useSkipLink } from '@/composables'

const { addSkipLink } = useSkipLink()
```

#### 6. `useReducedMotion`
پشتیبانی از reduced motion:

```javascript
import { useReducedMotion } from '@/composables'

const prefersReducedMotion = useReducedMotion()
```

#### 7. `useColorContrast`
بررسی contrast رنگ‌ها:

```javascript
import { useColorContrast } from '@/composables'

const { checkContrast } = useColorContrast()
```

### مستندات Accessibility

برای اطلاعات بیشتر به `docs/TESTING_ACCESSIBILITY.md` مراجعه کنید.

---

## 🧪 Testing

پروژه از **Vitest** و **@vue/test-utils** برای تست واحد استفاده می‌کند.

### پیکربندی

پیکربندی تست در `vitest.config.js`:

- `environment: 'jsdom'`
- `setupFiles: ['./src/test/setup.js']`
- Path aliasها مطابق با Vite
- Coverage با thresholdهای قابل تنظیم

### اسکریپت‌های تست

| اسکریپت | توضیح |
|--------|--------|
| `npm run test` | اجرای تست‌ها (حالت watch) |
| `npm run test:run` | اجرای یک‌بار تست‌ها |
| `npm run test:ui` | اجرای Vitest UI |
| `npm run test:watch` | اجرای تست‌ها با watch mode |
| `npm run test:coverage` | اجرای تست‌ها با گزارش پوشش |

### تست‌های پیاده‌سازی‌شده

- **Utilities:** `src/utils/formatters.test.js` — formatCurrency، formatNumber، formatDate، getRelativeTime
- **کامپوننت‌های UI:** `src/components/ui/Button.test.js`، `Input.test.js`، `Card.test.js`، `Modal.test.js`
- **Stores:** `src/stores/auth.test.js`، `vehicle.test.js`، `ui.test.js`، `dashboard.test.js` (با mock کردن سرویس‌ها)
- **Views:** `src/views/DashboardView.test.js` — تست Dashboard View

### ساختار تست

```
src/
├── test/
│   ├── setup.js         # Setup برای تست‌ها (Pinia، jsdom)
│   └── utils.js         # Utilities برای تست‌ها
├── utils/
│   └── formatters.test.js
├── components/ui/
│   ├── Button.test.js
│   ├── Input.test.js
│   ├── Card.test.js
│   └── Modal.test.js
├── stores/
│   ├── auth.test.js
│   ├── vehicle.test.js
│   ├── ui.test.js
│   └── dashboard.test.js
└── views/
    └── DashboardView.test.js
```

---

## 🎨 Dark Mode

پروژه از Tailwind CSS برای پشتیبانی از Dark Mode استفاده می‌کند.

### پیکربندی

در `tailwind.config.js`:

```javascript
{
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "background-dark": "#121620",
        "surface-dark": "#192833",
        // ...
      }
    }
  }
}
```

### استفاده

```vue
<template>
  <div class="bg-white dark:bg-background-dark">
    <!-- محتوا -->
  </div>
</template>
```

---

## 🔧 Error Handling

پروژه از یک سیستم Error Handling مرکزی استفاده می‌کند.

### Error Handler Service

فایل `src/services/errorHandler.js` شامل:

```javascript
import { setupErrorHandlers } from './services/errorHandler'

// در main.js
setupErrorHandlers()
```

### ویژگی‌ها

- مدیریت خطاهای Authentication
- نمایش Toast برای خطاها
- Logging خطاها
- Redirect خودکار در صورت نیاز

---

## 📦 Stores (Pinia)

پروژه شامل 16 Store مختلف است:

### لیست Stores

1. **auth.js**: مدیریت احراز هویت
2. **vehicle.js**: مدیریت خودروها
3. **service.js**: مدیریت سرویس‌ها
4. **serviceType.js**: مدیریت انواع سرویس
5. **expense.js**: مدیریت هزینه‌ها
6. **expenseCategory.js**: مدیریت دسته‌بندی هزینه‌ها
7. **reminder.js**: مدیریت یادآوری‌ها
8. **report.js**: مدیریت گزارش‌ها (فیلتر بازه/خودرو، fetchReportData، exportReport؛ اتصال به reportService و API خلاصه)
9. **ai.js**: مدیریت AI Assistant
10. **dashboard.js**: مدیریت Dashboard
11. **notification.js**: مدیریت نوتیفیکیشن‌ها
12. **telegram.js**: مدیریت یکپارچه‌سازی Telegram
13. **settings.js**: مدیریت تنظیمات
14. **upgrade.js**: مدیریت ارتقا به Pro
15. **smartAssistant.js**: مدیریت Smart Assistant (AI)
16. **ui.js**: مدیریت UI State (Toast, Modal, etc.)

### تست‌های Stores

تست‌های واحد برای stores زیر پیاده‌سازی شده‌اند:
- ✅ `auth.test.js`: تست Authentication Store
- ✅ `vehicle.test.js`: تست Vehicle Store
- ✅ `ui.test.js`: تست UI Store
- ✅ `dashboard.test.js`: تست Dashboard Store

### Export مرکزی

تمام stores از `src/stores/index.js` export می‌شوند:

```javascript
import { useAuthStore, useVehicleStore } from '@/stores'
```

---

## 🔌 Services

پروژه شامل services زیر است:

### Shared Services

از `shared/services` استفاده می‌شود:
- `authService`
- `vehicleService`
- `serviceService`
- `expenseService`
- `reminderService`
- `reportService`
- `upgradeService`
- `notificationService`

### Local Services

Services مخصوص Vue Frontend:
- `dashboardService.js`: منطق Dashboard
- `serviceTypeService.js`: مدیریت انواع سرویس
- `expenseCategoryService.js`: مدیریت دسته‌بندی هزینه‌ها
- `telegramService.js`: یکپارچه‌سازی Telegram
- `errorHandler.js`: مدیریت خطاها

### Export مرکزی

تمام services از `src/services/index.js` export می‌شوند:

```javascript
import { authService, vehicleService } from '@/services'
```

---

## 🎯 Composables

پروژه شامل composables زیر است:

### Toast
- `useToast.js`: مدیریت Toast notifications

### Accessibility
- `useAria.js`: ARIA attributes
- `useColorContrast.js`: بررسی contrast
- `useFocus.js`: مدیریت focus
- `useFocusTrap.js`: تله‌گذاری focus
- `useKeyboardNavigation.js`: ناوبری با کیبورد
- `useReducedMotion.js`: پشتیبانی از reduced motion
- `useSkipLink.js`: Skip links

### Export مرکزی

تمام composables از `src/composables/index.js` export می‌شوند:

```javascript
import { useToast, useFocus } from '@/composables'
```

---

## 📝 پرامپت ادامه کار

### پرامپت برای AI Assistant

```
من در حال پیاده‌سازی یک پروژه واسط کاربری با Vue.js 3 هستم که از سرویس‌های اشتراکی موجود در پروژه استفاده می‌کند.

## وضعیت فعلی پروژه:

### ساختار پروژه:
- پروژه Vue.js در مسیر `frontend-vue/` قرار دارد
- سرویس‌های اشتراکی در مسیر `shared/services/` قرار دارند
- پروژه از Vite، Vue Router، Pinia، و Tailwind CSS استفاده می‌کند

### سرویس‌های اشتراکی موجود:
1. **authService**: مدیریت احراز هویت (login, register, logout, profile)
2. **vehicleService**: مدیریت خودروها (CRUD)
3. **serviceService**: مدیریت سرویس‌های خودرو
4. **expenseService**: مدیریت هزینه‌ها
5. **reminderService**: مدیریت یادآوری‌ها
6. **reportService**: گزارش‌ها و آمار (Django: getSummary با فیلتر، exportCSV سمت کلاینت، getMonthlyTrend از خلاصه)
7. **upgradeService**: ارتقا به نسخه Pro
8. **notificationService**: نوتیفیکیشن‌ها
9. **AI Service**: تحلیل مشکلات خودرو با AI

### پیکربندی Backend:
- پشتیبانی از سه نوع Backend: `mock`, `supabase`, `django`
- پیکربندی از طریق `VITE_BACKEND_TYPE` environment variable
- پیش‌فرض: `supabase`

### ساختار فعلی:
```
frontend-vue/
├── src/
│   ├── components/     # کامپوننت‌های Vue
│   ├── views/          # صفحات اصلی
│   ├── stores/         # Pinia Stores
│   ├── services/       # Service Wrappers (از shared استفاده می‌کند)
│   └── router/         # Vue Router
```

### الگوهای معماری:
- استفاده از Composition API
- State Management با Pinia
- Service Layer Pattern
- Error Handling مرکزی

### Aliasهای Vite:
- `@shared` → `../shared`
- `@services` → `../shared/services`
- `@types` → `../shared/types`
- `@utils` → `../shared/utils`

## دستورالعمل‌ها:

1. **همیشه از سرویس‌های اشتراکی استفاده کن**: هرگز منطق API را در کامپوننت‌ها یا stores پیاده‌سازی نکن. از سرویس‌های موجود در `shared/services` استفاده کن.

2. **State Management**: از Pinia برای مدیریت state استفاده کن. هر store باید منطق state مربوط به خود را داشته باشد.

3. **Error Handling**: از `setErrorHandlers` در `src/services/index.js` برای مدیریت خطاها استفاده کن. این handlers به صورت خودکار خطاهای authentication را مدیریت می‌کنند.

4. **Routing**: از Vue Router برای navigation استفاده کن. Navigation guards برای محافظت از routes که نیاز به authentication دارند.

5. **Styling**: از Tailwind CSS برای styling استفاده کن. از کامپوننت‌های موجود در `src/components` به عنوان پایه استفاده کن.

6. **TypeScript**: اگر نیاز به type safety داری، می‌توانی از types موجود در `shared/types` استفاده کنی.

7. **Composables**: برای منطق قابل استفاده مجدد، از Vue Composables استفاده کن (در `src/composables/`).

8. **UX Mockups**: از فایل‌های موجود در `ux/` به عنوان مرجع برای طراحی UI استفاده کن.

## نکات مهم:

- هرگز وابستگی به Framework (Vue) را در سرویس‌های shared اضافه نکن
- از Service Wrappers در `src/services/` برای اتصال stores به shared services استفاده کن
- همیشه error handling مناسب را پیاده‌سازی کن
- از async/await برای API calls استفاده کن
- Loading states را در stores مدیریت کن
- Toast notifications را برای feedback به کاربر استفاده کن

## مثال استفاده:

```javascript
// در یک کامپوننت Vue
import { useVehicleStore } from '../stores/vehicles';
import { useUIStore } from '../stores/ui';

const vehicleStore = useVehicleStore();
const uiStore = useUIStore();

async function loadVehicles() {
  try {
    await vehicleStore.fetchVehicles();
  } catch (error) {
    uiStore.error('خطا در بارگذاری خودروها');
  }
}
```

لطفا در ادامه کار، این دستورالعمل‌ها را رعایت کن و از الگوهای معماری موجود استفاده کن.
```

---

## ✅ چک‌لیست پیاده‌سازی

### فاز 1: راه‌اندازی اولیه
- [x] نصب Dependencies
- [x] پیکربندی Environment Variables
- [x] راه‌اندازی Vite و Tailwind
- [x] پیکربندی Aliasها
- [x] پیکربندی PWA
- [x] پیکربندی i18n
- [x] پیکربندی Vitest

### فاز 2: State Management
- [x] پیاده‌سازی Auth Store
- [x] پیاده‌سازی Vehicle Store
- [x] پیاده‌سازی Service Store
- [x] پیاده‌سازی ServiceType Store
- [x] پیاده‌سازی Expense Store
- [x] پیاده‌سازی ExpenseCategory Store
- [x] پیاده‌سازی Reminder Store
- [x] پیاده‌سازی Report Store
- [x] پیاده‌سازی AI Store
- [x] پیاده‌سازی Dashboard Store
- [x] پیاده‌سازی Notification Store
- [x] پیاده‌سازی Telegram Store
- [x] پیاده‌سازی Settings Store
- [x] پیاده‌سازی Upgrade Store
- [x] پیاده‌سازی UI Store

### فاز 3: Routing
- [x] تعریف Routes
- [x] Navigation Guards
- [x] Route Protection
- [x] Lazy Loading برای Views
- [x] Auth Callback Route

### فاز 4: کامپوننت‌ها
- [x] Layout Components (MainLayout)
- [x] UI Components (Button, Card, Input, Select, Modal, Toast, LoadingSpinner, Form)
- [x] Header Component
- [x] Sidebar Component
- [x] LanguageSwitcher Component
- [x] NotificationBell Component
- [x] ReminderForm Component
- [x] ServiceTypeSelector Component (با زیرکامپوننت‌های ServiceTypeCategory و ServiceTypeSelectorFooter)
- [x] TelegramSettings Component
- [x] Dashboard Components (DashboardHeader, QuickStatsCard, RemindersSection, VehiclesSection, DashboardRightColumn)

### فاز 5: صفحات اصلی
- [x] Login/SignUp Pages
- [x] AuthCallback Page
- [x] Dashboard (با Variants)
- [x] Vehicle List/Details/Management
- [x] Service Management (Add, Select Type, List)
- [x] Reminders (با Management)
- [x] Reports (اتصال به API با داده واقعی: فیلتر خودرو/بازه، کارت‌های خلاصه، نمودار ماهانه، تفکیک هزینه، جدول هزینه‌های اخیر، دانلود CSV)
- [x] Settings
- [x] Smart Assistant
- [x] Upgrade Pro

### فاز 6: یکپارچه‌سازی
- [x] اتصال به Shared Services
- [x] Error Handling مرکزی
- [x] Loading States
- [x] Toast Notifications
- [x] i18n Integration
- [x] PWA Integration
- [x] Telegram Integration

### فاز 7: Composables
- [x] useToast
- [x] useAria
- [x] useColorContrast
- [x] useFocus
- [x] useFocusTrap
- [x] useKeyboardNavigation
- [x] useReducedMotion
- [x] useSkipLink

### فاز 8: تست و بهینه‌سازی
- [x] پیکربندی Vitest و @vue/test-utils
- [x] Test Setup Files و vitest.config.js
- [x] تست واحد برای Stores (auth، vehicle، ui، dashboard)
- [x] تست واحد برای Views (DashboardView)
- [ ] تست واحد برای Composables
- [x] تست واحد برای Components (Button، Input، Card، Modal)
- [x] تست واحد برای Utils (formatters.js)
- [x] بهینه‌سازی Performance (Code Splitting, Lazy Loading)
- [x] Bundle Size تحلیل (rollup-plugin-visualizer)
- [x] Responsive Design
- [x] Accessibility (Composables)
- [x] Dark Mode Support
- [x] Font Optimization (Local Fonts)

---

## 📚 منابع و مراجع

### مستندات رسمی
- [Vue.js 3 Documentation](https://vuejs.org/)
- [Vue Router Documentation](https://router.vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

### مستندات داخل مخزن
- `shared/README.md` – مستندات سرویس‌های اشتراکی
- `frontend-vue/README.md` – معرفی و شروع سریع Vue UI
- `frontend-vue/docs/VUE_FRONTEND_README.md` – نمای کلی و فهرست مستندات Vue Frontend
- `frontend-vue/docs/TESTING_ACCESSIBILITY.md` – راهنمای تست و دسترس‌پذیری
- `frontend-vue/docs/LIGHTHOUSE_ANALYSIS.md` – تحلیل Lighthouse و بهینه‌سازی
- `frontend-vue/docs/PWA_ARCHITECTURE.md` و سایر فایل‌های `PWA_*.md` – معماری و تنظیمات PWA
- `frontend-vue/docs/TELEGRAM_BOT_API.md` و فایل‌های مرتبط – یکپارچه‌سازی ربات تلگرام
- `frontend-vue/docs/TODO_GROUP_NAME_MIGRATION.md` – نکات مهاجرت نام گروه‌ها و TODOها
- `frontend-vue/docs/vue-frontend-prompt.md` – پرامپت AI مخصوص توسعه Vue Frontend

---

## 🎯 نتیجه‌گیری

این مستند راهنمای کامل برای پیاده‌سازی پروژه واسط کاربری Vue.js است که از سرویس‌های اشتراکی موجود استفاده می‌کند. پروژه شامل ویژگی‌های زیر است:

### ویژگی‌های پیاده‌سازی شده

- ✅ **Vue 3 + Composition API**: استفاده از آخرین ویژگی‌های Vue 3
- ✅ **Pinia State Management**: 16 Store مختلف برای مدیریت state (auth، vehicle، service، serviceType، expense، expenseCategory، reminder، report، ai، dashboard، notification، telegram، settings، upgrade، smartAssistant، ui)
- ✅ **صفحه گزارش‌ها (Reports)**: اتصال به API با داده واقعی (Django ReportSummary)، فیلتر خودرو و بازه، کارت‌های خلاصه، نمودار ماهانه، تفکیک هزینه، جدول هزینه‌های اخیر، دانلود CSV
- ✅ **Vue Router**: Routing با Lazy Loading و Navigation Guards
- ✅ **Tailwind CSS**: Styling با پشتیبانی از Dark Mode
- ✅ **Internationalization**: پشتیبانی از فارسی، انگلیسی، و عربی
- ✅ **Progressive Web App**: پیکربندی کامل PWA با Service Worker
- ✅ **Accessibility**: Composables مخصوص برای بهبود دسترس‌پذیری
- ✅ **Testing**: Vitest + @vue/test-utils؛ تست‌های واحد برای utils (formatters)، UI (Button/Input/Card/Modal)، Stores (auth/vehicle/ui/dashboard)، Views (DashboardView)
- ✅ **Error Handling**: سیستم مرکزی برای مدیریت خطاها
- ✅ **Telegram Integration**: یکپارچه‌سازی با Telegram Bot
- ✅ **Font Optimization**: استفاده از فونت‌های محلی (Vazirmatn)

### نکات مهم

1. **استفاده از سرویس‌های اشتراکی**: همیشه از سرویس‌های اشتراکی استفاده کنید و هرگز منطق API را در کامپوننت‌ها یا stores پیاده‌سازی نکنید.

2. **State Management**: از Pinia برای مدیریت state استفاده کنید. هر store باید منطق state مربوط به خود را داشته باشد.

3. **Error Handling**: از `errorHandler.js` برای مدیریت مرکزی خطاها استفاده کنید.

4. **i18n**: از `vue-i18n` برای ترجمه استفاده کنید و همیشه متن‌ها را در فایل‌های locale قرار دهید.

5. **Accessibility**: از composables مخصوص برای بهبود دسترس‌پذیری استفاده کنید.

6. **Performance**: از Lazy Loading برای views استفاده کنید و از Code Splitting بهره ببرید.

7. **Testing**: تست‌های واحد برای stores (auth، vehicle، ui، dashboard)، components (Button، Input، Card، Modal)، views (DashboardView)، و utils (formatters) پیاده‌سازی شده‌اند؛ برای composables و سایر بخش‌ها گسترش دهید.

**تکمیل‌های اخیر (انطباق با قوانین و Testing):**
- JSDoc برای کامپوننت‌های UI؛ `src/utils/formatters.js` و استفاده در views؛ تحلیل Bundle با rollup-plugin-visualizer
- Refactoring: DashboardView → زیرکامپوننت‌ها در `components/dashboard/` (DashboardHeader، QuickStatsCard، RemindersSection، VehiclesSection، DashboardRightColumn)؛ ServiceTypeSelector → ServiceTypeCategory، ServiceTypeSelectorFooter (هر کامپوننت <۲۰۰ خط)
- تست واحد برای Dashboard Store و Dashboard View
- تکمیل صفحات Service و Reminder با اتصال به API

این رویکرد باعث می‌شود کد شما قابل نگهداری، قابل تست، و قابل استفاده مجدد باشد.

---

**آخرین به‌روزرسانی**: فوریه 2026
**نسخه**: 1.3.0

