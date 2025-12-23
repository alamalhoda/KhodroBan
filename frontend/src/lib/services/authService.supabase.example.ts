/**
 * مثال: به‌روزرسانی authService برای استفاده از Supabase
 * 
 * این فایل یک مثال از نحوه به‌روزرسانی authService.ts برای استفاده از Supabase است.
 * 
 * مراحل:
 * 1. این فایل را مطالعه کنید
 * 2. authService.ts را به‌روزرسانی کنید
 * 3. این فایل را حذف کنید
 */

import { supabase } from '../supabase';
import type { User, LoginCredentials, RegisterData } from '../types';
import { authStore } from '../stores/auth';

/**
 * تبدیل Supabase User به User type اپلیکیشن
 */
function mapSupabaseUserToAppUser(supabaseUser: any, profile: any): User {
  // دریافت subscription plan
  const subscription = profile?.subscription || { plan_code: 'free' };
  
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || supabaseUser.email || '',
    tier: subscription.plan_code === 'pro' ? 'pro' : 'free',
    createdAt: supabaseUser.created_at || new Date().toISOString(),
    updatedAt: profile?.updated_at || new Date().toISOString(),
  };
}

export const authService = {
  /**
   * ورود کاربر
   */
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    try {
      // ورود با Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        throw new Error(error.message || 'ایمیل یا رمز عبور اشتباه است');
      }

      if (!data.user || !data.session) {
        throw new Error('خطا در ورود. لطفاً دوباره تلاش کنید.');
      }

      // دریافت پروفایل کاربر
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*, subscription:user_subscriptions!inner(plan:subscription_plans(*))')
        .eq('id', data.user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError);
      }

      // تبدیل به User type
      const user = mapSupabaseUserToAppUser(data.user, profile);

      // ذخیره token
      const token = data.session.access_token;
      localStorage.setItem('token', token);

      return { user, token };
    } catch (error: any) {
      throw new Error(error.message || 'خطا در ورود');
    }
  },

  /**
   * ثبت‌نام کاربر جدید
   */
  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    try {
      // ثبت‌نام با Supabase Auth
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.name.split(' ')[0] || '',
            last_name: data.name.split(' ').slice(1).join(' ') || '',
          },
        },
      });

      if (error) {
        throw new Error(error.message || 'خطا در ثبت‌نام');
      }

      if (!authData.user || !authData.session) {
        throw new Error('خطا در ثبت‌نام. لطفاً دوباره تلاش کنید.');
      }

      // منتظر می‌مانیم تا trigger پروفایل را ایجاد کند
      // (trigger در migration 001 این کار را انجام می‌دهد)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // دریافت پروفایل کاربر
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*, subscription:user_subscriptions!inner(plan:subscription_plans(*))')
        .eq('id', authData.user.id)
        .single();

      // تبدیل به User type
      const user = mapSupabaseUserToAppUser(authData.user, profile);

      // ذخیره token
      const token = authData.session.access_token;
      localStorage.setItem('token', token);

      return { user, token };
    } catch (error: any) {
      throw new Error(error.message || 'خطا در ثبت‌نام');
    }
  },

  /**
   * خروج کاربر
   */
  async logout(): Promise<void> {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('token');
      authStore.logout();
    } catch (error: any) {
      throw new Error(error.message || 'خطا در خروج');
    }
  },

  /**
   * دریافت کاربر فعلی
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        return null;
      }

      // دریافت پروفایل کاربر
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*, subscription:user_subscriptions!inner(plan:subscription_plans(*))')
        .eq('id', user.id)
        .single();

      if (!profile) {
        return null;
      }

      return mapSupabaseUserToAppUser(user, profile);
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  /**
   * بررسی وضعیت احراز هویت
   */
  async checkAuth(): Promise<User | null> {
    try {
      const session = await supabase.auth.getSession();
      
      if (!session.data.session) {
        return null;
      }

      return await this.getCurrentUser();
    } catch (error) {
      console.error('Error checking auth:', error);
      return null;
    }
  },

  /**
   * به‌روزرسانی پروفایل کاربر
   */
  async updateProfile(updates: { firstName?: string; lastName?: string }): Promise<User> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('کاربر لاگین نشده است');
      }

      const { data: profile, error } = await supabase
        .from('user_profiles')
        .update({
          first_name: updates.firstName,
          last_name: updates.lastName,
        })
        .eq('id', user.id)
        .select('*, subscription:user_subscriptions!inner(plan:subscription_plans(*))')
        .single();

      if (error) {
        throw new Error(error.message || 'خطا در به‌روزرسانی پروفایل');
      }

      return mapSupabaseUserToAppUser(user, profile);
    } catch (error: any) {
      throw new Error(error.message || 'خطا در به‌روزرسانی پروفایل');
    }
  },

  /**
   * تغییر رمز عبور
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      // Supabase تغییر رمز عبور را از طریق email انجام می‌دهد
      // برای تغییر مستقیم، باید از updateUser استفاده کنیم
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw new Error(error.message || 'خطا در تغییر رمز عبور');
      }
    } catch (error: any) {
      throw new Error(error.message || 'خطا در تغییر رمز عبور');
    }
  },

  /**
   * فراموشی رمز عبور
   */
  async forgotPassword(email: string): Promise<void> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw new Error(error.message || 'خطا در ارسال ایمیل بازیابی رمز');
      }
    } catch (error: any) {
      throw new Error(error.message || 'خطا در ارسال ایمیل بازیابی رمز');
    }
  },
};

