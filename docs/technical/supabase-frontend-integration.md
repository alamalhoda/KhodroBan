# 🔗 راهنمای اتصال Frontend به Supabase

این سند راهنمای کامل اتصال Frontend (SvelteKit) به Supabase است.

---

## 📋 فهرست مطالب

1. [نصب وابستگی‌ها](#نصب-وابستگی‌ها)
2. [تنظیمات Environment Variables](#تنظیمات-environment-variables)
3. [ایجاد Supabase Client](#ایجاد-supabase-client)
4. [به‌روزرسانی Service ها](#به‌روزرسانی-service-ها)
5. [به‌روزرسانی Store ها](#به‌روزرسانی-store-ها)
6. [استفاده در Components](#استفاده-در-components)

---

## نصب وابستگی‌ها

```bash
cd frontend
npm install @supabase/supabase-js
```

---

## تنظیمات Environment Variables

### 1. کپی فایل .env.example

```bash
cp .env.example .env
```

### 2. ویرایش فایل .env

مقادیر را از Supabase Dashboard دریافت کنید:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
VITE_API_URL=https://YOUR_PROJECT_REF.supabase.co/rest/v1
```

---

## ایجاد Supabase Client

فایل `frontend/src/lib/supabase.ts` قبلاً ایجاد شده است. این فایل client Supabase را برای استفاده در کل اپلیکیشن فراهم می‌کند.

### استفاده پایه:

```typescript
import { supabase } from '$lib/supabase';

// Authentication
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});

// Database Query
const { data, error } = await supabase
  .from('vehicles')
  .select('*')
  .eq('user_id', userId);
```

---

## به‌روزرسانی Service ها

### مثال: authService

فایل `authService.supabase.example.ts` را مطالعه کنید و سپس `authService.ts` را به‌روزرسانی کنید.

### مثال: vehicleService

```typescript
import { supabase } from '../supabase';
import type { Vehicle, VehicleFormData } from '../types';

export const vehicleService = {
  /**
   * دریافت تمام خودروهای کاربر
   */
  async getAll(): Promise<Vehicle[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('کاربر لاگین نشده است');
    }

    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message || 'خطا در دریافت خودروها');
    }

    // تبدیل به Vehicle type
    return data.map(v => ({
      id: v.vehicle_id.toString(),
      userId: v.user_id,
      model: v.model,
      year: v.year,
      plateNumber: v.plate_number,
      currentKm: v.current_km,
      note: v.description || undefined,
      createdAt: v.created_at,
      updatedAt: v.updated_at,
    }));
  },

  /**
   * ایجاد خودرو جدید
   */
  async create(formData: VehicleFormData): Promise<Vehicle> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('کاربر لاگین نشده است');
    }

    const { data, error } = await supabase
      .from('vehicles')
      .insert({
        user_id: user.id,
        model: formData.model,
        year: formData.year,
        plate_number: formData.plateNumber,
        current_km: formData.currentKm,
        description: formData.note || null,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message || 'خطا در ایجاد خودرو');
    }

    // تبدیل به Vehicle type
    return {
      id: data.vehicle_id.toString(),
      userId: data.user_id,
      model: data.model,
      year: data.year,
      plateNumber: data.plate_number,
      currentKm: data.current_km,
      note: data.description || undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  /**
   * به‌روزرسانی خودرو
   */
  async update(id: string, formData: Partial<VehicleFormData>): Promise<Vehicle> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('کاربر لاگین نشده است');
    }

    const updates: any = {};
    if (formData.model) updates.model = formData.model;
    if (formData.year) updates.year = formData.year;
    if (formData.plateNumber) updates.plate_number = formData.plateNumber;
    if (formData.currentKm !== undefined) updates.current_km = formData.currentKm;
    if (formData.note !== undefined) updates.description = formData.note;

    const { data, error } = await supabase
      .from('vehicles')
      .update(updates)
      .eq('vehicle_id', id)
      .eq('user_id', user.id) // اطمینان از مالکیت
      .select()
      .single();

    if (error) {
      throw new Error(error.message || 'خطا در به‌روزرسانی خودرو');
    }

    // تبدیل به Vehicle type
    return {
      id: data.vehicle_id.toString(),
      userId: data.user_id,
      model: data.model,
      year: data.year,
      plateNumber: data.plate_number,
      currentKm: data.current_km,
      note: data.description || undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  /**
   * حذف خودرو
   */
  async delete(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('کاربر لاگین نشده است');
    }

    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('vehicle_id', id)
      .eq('user_id', user.id); // اطمینان از مالکیت

    if (error) {
      throw new Error(error.message || 'خطا در حذف خودرو');
    }
  },
};
```

---

## به‌روزرسانی Store ها

### مثال: authStore

```typescript
import { writable } from 'svelte/store';
import { supabase, onAuthStateChange } from '../supabase';
import type { User } from '../types';

function createAuthStore() {
  const { subscribe, set, update } = writable<{
    user: User | null;
    token: string | null;
    isLoading: boolean;
  }>({
    user: null,
    token: null,
    isLoading: true,
  });

  // گوش دادن به تغییرات authentication
  onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
      // دریافت پروفایل کاربر
      loadUserProfile(session.user.id).then(user => {
        set({
          user,
          token: session.access_token,
          isLoading: false,
        });
      });
    } else if (event === 'SIGNED_OUT') {
      set({
        user: null,
        token: null,
        isLoading: false,
      });
    }
  });

  return {
    subscribe,
    login: async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    },
    logout: async () => {
      await supabase.auth.signOut();
      set({ user: null, token: null, isLoading: false });
    },
  };
}

export const authStore = createAuthStore();
```

---

## استفاده در Components

### مثال: صفحه Login

```svelte
<script lang="ts">
  import { authStore } from '$lib/stores';
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';

  let email = '';
  let password = '';
  let loading = false;
  let error = '';

  async function handleLogin() {
    loading = true;
    error = '';
    
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        error = authError.message;
        return;
      }

      // هدایت به داشبورد
      goto('/dashboard');
    } catch (e: any) {
      error = e.message || 'خطا در ورود';
    } finally {
      loading = false;
    }
  }
</script>

<form on:submit|preventDefault={handleLogin}>
  <input type="email" bind:value={email} placeholder="ایمیل" />
  <input type="password" bind:value={password} placeholder="رمز عبور" />
  {#if error}
    <p class="error">{error}</p>
  {/if}
  <button type="submit" disabled={loading}>
    {loading ? 'در حال ورود...' : 'ورود'}
  </button>
</form>
```

---

## Real-time Subscriptions

Supabase از Real-time subscriptions پشتیبانی می‌کند:

```typescript
import { supabase } from '../supabase';

// گوش دادن به تغییرات جدول vehicles
const subscription = supabase
  .channel('vehicles-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'vehicles',
      filter: `user_id=eq.${userId}`,
    },
    (payload) => {
      console.log('Change received!', payload);
      // به‌روزرسانی store یا UI
    }
  )
  .subscribe();

// برای توقف subscription
subscription.unsubscribe();
```

---

## نکات مهم

### 1. امنیت

- **هرگز** `service_role` key را در Frontend استفاده نکنید
- همیشه از `anon` key استفاده کنید
- RLS Policies را همیشه فعال نگه دارید

### 2. Error Handling

همیشه خطاها را به درستی handle کنید:

```typescript
const { data, error } = await supabase
  .from('vehicles')
  .select('*');

if (error) {
  // Handle error
  console.error('Error:', error.message);
  throw new Error(error.message);
}
```

### 3. Type Safety

از TypeScript types استفاده کنید:

```typescript
import type { Database } from '../types/supabase';

const { data } = await supabase
  .from('vehicles')
  .select('*')
  .returns<Database['public']['Tables']['vehicles']['Row']>();
```

---

## منابع

- [Supabase JavaScript Client Docs](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Supabase Realtime Guide](https://supabase.com/docs/guides/realtime)

---

**آخرین به‌روزرسانی:** ۱۴۰۴/۰۹/XX

