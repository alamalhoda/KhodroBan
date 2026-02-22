# 📘 مستند کامل پیاده‌سازی پروژه واسط کاربری Vue.js

راهنمای پیاده‌سازی و توسعه Frontend با Vue.js 3. برای شروع: بخش [مقدمه و هدف](#مقدمه-و-هدف) و سپس [راهنمای پیاده‌سازی](#راهنمای-پیادهسازی). پرامپت AI: [product/prompt/vue-frontend-prompt.md](../product/prompt/vue-frontend-prompt.md).

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
- ✅ **اکوسیستم قوی**: Vue Router، Pinia، و ابزارهای توسعه
- ✅ **یادگیری آسان**: Syntax ساده و قابل فهم
- ✅ **قابلیت استفاده مجدد**: کامپوننت‌های قابل استفاده مجدد
- ✅ **TypeScript Support**: پشتیبانی کامل از TypeScript

### اهداف فنی
1. استفاده از سرویس‌های اشتراکی موجود (`shared/services`)
2. پیاده‌سازی State Management با Pinia
3. Routing با Vue Router
4. Styling با Tailwind CSS
4. پشتیبانی از TypeScript (اختیاری)
5. ساختار قابل نگهداری و مقیاس‌پذیر

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
- گزارش‌های آماری
- تحلیل هزینه‌ها

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
│   └── vite.svg
│
├── src/
│   ├── assets/            # تصاویر و فایل‌های استاتیک
│   │   └── vue.svg
│   │
│   ├── components/         # کامپوننت‌های قابل استفاده مجدد
│   │   ├── Card.vue
│   │   ├── Header.vue
│   │   ├── Sidebar.vue
│   │   └── HelloWorld.vue
│   │
│   ├── views/             # صفحات اصلی (Route Components)
│   │   ├── LoginView.vue
│   │   ├── SignUpView.vue
│   │   ├── DashboardView.vue
│   │   ├── VehicleListView.vue
│   │   ├── VehicleDetailsView.vue
│   │   ├── RemindersView.vue
│   │   ├── ReportsView.vue
│   │   ├── SettingsView.vue
│   │   └── ...
│   │
│   ├── stores/            # Pinia Stores
│   │   ├── auth.js        # Store برای Authentication
│   │   ├── vehicles.js     # Store برای Vehicles
│   │   ├── services.js    # Store برای Services
│   │   ├── expenses.js    # Store برای Expenses
│   │   └── ui.js          # Store برای UI State (Toast, Modal, etc.)
│   │
│   ├── services/          # Service Wrappers
│   │   └── index.js       # Re-export از shared/services
│   │
│   ├── router/            # Vue Router Configuration
│   │   └── index.js       # Route definitions
│   │
│   ├── composables/       # Vue Composables (اختیاری)
│   │   ├── useAuth.js
│   │   ├── useVehicles.js
│   │   └── ...
│   │
│   ├── utils/             # Utility Functions (اختیاری)
│   │   ├── format.js      # Formatting functions
│   │   ├── validation.js # Validation helpers
│   │   └── constants.js   # Constants
│   │
│   ├── App.vue            # Root Component
│   ├── main.js            # Entry Point
│   └── style.css          # Global Styles
│
├── ux/                    # UX Mockups و Designs
│   ├── auth/
│   ├── dashboard/
│   ├── vehicles/
│   └── ...
│
├── index.html             # HTML Entry Point
├── package.json           # Dependencies
├── vite.config.js         # Vite Configuration
├── tailwind.config.js     # Tailwind Configuration
└── postcss.config.js      # PostCSS Configuration
```

### پیکربندی Vite

فایل `vite.config.js` شامل aliasهای زیر است:

```javascript
{
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

---

## 🚀 راهنمای پیاده‌سازی

### مرحله 1: راه‌اندازی اولیه

#### 1.1 نصب Dependencies

```bash
cd frontend-vue
npm install
```

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

```javascript
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const routes = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: () => import('../views/SignUpView.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/vehicles',
    name: 'Vehicles',
    component: () => import('../views/VehicleListView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/vehicles/:id',
    name: 'VehicleDetails',
    component: () => import('../views/VehicleDetailsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/reminders',
    name: 'Reminders',
    component: () => import('../views/RemindersView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('../views/ReportsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/SettingsView.vue'),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: 'Dashboard' });
  } else {
    next();
  }
});

export default router;
```

### مرحله 4: پیاده‌سازی Service Wrapper

```javascript
// src/services/index.js
import { setErrorHandlers } from '@services/api';
import { useAuthStore } from '../stores/auth';
import { useUIStore } from '../stores/ui';

// Setup error handlers برای shared services
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
6. **reportService**: گزارش‌ها و آمار
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
- [ ] نصب Dependencies
- [ ] پیکربندی Environment Variables
- [ ] راه‌اندازی Vite و Tailwind
- [ ] پیکربندی Aliasها

### فاز 2: State Management
- [ ] پیاده‌سازی Auth Store
- [ ] پیاده‌سازی Vehicle Store
- [ ] پیاده‌سازی Service Store
- [ ] پیاده‌سازی Expense Store
- [ ] پیاده‌سازی Reminder Store
- [ ] پیاده‌سازی UI Store

### فاز 3: Routing
- [ ] تعریف Routes
- [ ] Navigation Guards
- [ ] Route Protection

### فاز 4: کامپوننت‌ها
- [ ] Layout Components
- [ ] UI Components (Button, Card, Input, etc.)
- [ ] Form Components
- [ ] Modal Components
- [ ] Toast Component

### فاز 5: صفحات اصلی
- [ ] Login/SignUp Pages
- [ ] Dashboard
- [ ] Vehicle List/Details
- [ ] Service Management
- [ ] Expense Management
- [ ] Reminders
- [ ] Reports
- [ ] Settings

### فاز 6: یکپارچه‌سازی
- [ ] اتصال به Shared Services
- [ ] Error Handling
- [ ] Loading States
- [ ] Toast Notifications
- [ ] Realtime Updates (Notifications)

### فاز 7: تست و بهینه‌سازی
- [ ] تست عملکرد
- [ ] بهینه‌سازی Performance
- [ ] Responsive Design
- [ ] Accessibility

---

## 📚 منابع و مراجع

### مستندات رسمی
- [Vue.js 3 Documentation](https://vuejs.org/)
- [Vue Router Documentation](https://router.vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

### فایل‌های پروژه
- `shared/README.md` - مستندات سرویس‌های اشتراکی
- `frontend-vue/README.md` - مستندات پروژه Vue
- `docs/technical/` - مستندات فنی دیگر

---

## 🎯 نتیجه‌گیری

این مستند راهنمای کامل برای پیاده‌سازی پروژه واسط کاربری Vue.js است که از سرویس‌های اشتراکی موجود استفاده می‌کند. با دنبال کردن این راهنما و استفاده از پرامپت ارائه شده، می‌توانید به صورت منظم و ساختاریافته پروژه را توسعه دهید.

**نکته مهم**: همیشه از سرویس‌های اشتراکی استفاده کنید و هرگز منطق API را در کامپوننت‌ها یا stores پیاده‌سازی نکنید. این رویکرد باعث می‌شود کد شما قابل نگهداری، قابل تست، و قابل استفاده مجدد باشد.

---

**آخرین به‌روزرسانی**: 2024
**نسخه**: 1.0.0

