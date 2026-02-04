# 🚀 پرامپت پیاده‌سازی پروژه Vue.js

این پرامپت برای استفاده با AI Assistant (مثل Cursor AI) طراحی شده است تا به صورت منظم و ساختاریافته پروژه Vue.js را توسعه دهد.

---

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

## ساختار Store پیشنهادی:

```javascript
// src/stores/example.js
import { defineStore } from 'pinia';
import { exampleService } from '../services';
import { ref, computed } from 'vue';

export const useExampleStore = defineStore('example', () => {
  // State
  const items = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  // Getters
  const itemCount = computed(() => items.value.length);

  // Actions
  async function fetchItems() {
    isLoading.value = true;
    error.value = null;
    try {
      items.value = await exampleService.getAll();
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    // State
    items,
    isLoading,
    error,
    // Getters
    itemCount,
    // Actions
    fetchItems,
  };
});
```

## ساختار کامپوننت پیشنهادی:

```vue
<template>
  <div>
    <!-- UI Content -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useExampleStore } from '../stores/example';
import { useUIStore } from '../stores/ui';

const exampleStore = useExampleStore();
const uiStore = useUIStore();

const isLoading = computed(() => exampleStore.isLoading);

async function loadData() {
  try {
    await exampleStore.fetchItems();
  } catch (error) {
    uiStore.error('خطا در بارگذاری داده‌ها');
  }
}

onMounted(() => {
  loadData();
});
</script>
```

لطفا در ادامه کار، این دستورالعمل‌ها را رعایت کن و از الگوهای معماری موجود استفاده کن.
```

---

## 📝 نحوه استفاده

1. این پرامپت را در ابتدای هر جلسه کاری با AI Assistant کپی کنید
2. یا آن را در فایل `.cursorrules` یا تنظیمات AI Assistant ذخیره کنید
3. برای هر task جدید، این پرامپت را به عنوان context ارائه دهید

---

## 🔄 به‌روزرسانی

این پرامپت باید با پیشرفت پروژه به‌روزرسانی شود. هر تغییر مهم در معماری یا ساختار پروژه باید در این پرامپت منعکس شود.

