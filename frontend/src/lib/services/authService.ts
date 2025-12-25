import { supabase } from '../supabase';
import api from './api';
import type { User, LoginCredentials, RegisterData, ApiResponse } from '../types';
import { authStore } from '../stores/auth';
import { selectService } from './base/router';
import type { IAuthService } from './base/types';
import { config } from '../utils/config';

// ============================================
// Helper Functions
// ============================================

/**
 * تبدیل Supabase User به User type اپلیکیشن
 */
async function mapSupabaseUserToAppUser(supabaseUser: any): Promise<User> {
  // دریافت پروفایل کاربر
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', supabaseUser.id)
    .single();

  // دریافت subscription فعال کاربر
  const { data: subscription } = await supabase
    .from('user_subscriptions')
    .select('plan_id')
    .eq('user_id', supabaseUser.id)
    .eq('is_active', true)
    .single();

  // دریافت plan_code
  let planCode = 'free';
  const subscriptionData = subscription as any;
  if (subscriptionData?.plan_id) {
    const { data: plan } = await supabase
      .from('subscription_plans')
      .select('plan_code')
      .eq('plan_id', subscriptionData.plan_id)
      .single();
    
    planCode = (plan as any)?.plan_code || 'free';
  }
  
  const profileData = profile as any;
  
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: `${profileData?.first_name || ''} ${profileData?.last_name || ''}`.trim() || supabaseUser.email || '',
    tier: planCode === 'pro' ? 'pro' : 'free',
    createdAt: supabaseUser.created_at || new Date().toISOString(),
    updatedAt: profileData?.updated_at || new Date().toISOString(),
  };
}

// ============================================
// MOCK IMPLEMENTATION
// ============================================

const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  name: 'کاربر تست',
  tier: 'free',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

const authServiceMock: IAuthService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (credentials.email && credentials.password) {
      const token = 'mock-jwt-token-' + Date.now();
      return { user: mockUser, token };
    }
    throw new Error('ایمیل یا رمز عبور اشتباه است');
  },

  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newUser: User = {
      ...mockUser,
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
    };
    const token = 'mock-jwt-token-' + Date.now();
    return { user: newUser, token };
  },

  async loginWithGoogle(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Mock: redirect به dashboard (در واقعیت این کار را Supabase انجام می‌دهد)
    const token = 'mock-jwt-token-' + Date.now();
    localStorage.setItem('token', token);
    authStore.loginSuccess(mockUser, token);
  },

  async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    localStorage.removeItem('token');
    authStore.logout();
  },

  async getProfile(): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockUser;
  },

  async updateProfile(data: Partial<{ firstName: string; lastName: string }>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...mockUser, ...data };
  },

  async forgotPassword(_email: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Mock: همیشه موفق است
  },

  async resetPassword(_token: string, _password: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Mock: همیشه موفق است
  },

  async upgradeToPro(): Promise<{ redirectUrl: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { redirectUrl: 'https://payment.example.com/checkout' };
  },
};

// ============================================
// SUPABASE IMPLEMENTATION
// ============================================

const authServiceSupabase: IAuthService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    try {
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

      const user = await mapSupabaseUserToAppUser(data.user);
      const token = data.session.access_token;
      localStorage.setItem('token', token);

      return { user, token };
    } catch (error: any) {
      throw new Error(error.message || 'خطا در ورود');
    }
  },

  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    try {
      const nameParts = data.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) {
        throw new Error(error.message || 'خطا در ثبت‌نام');
      }

      if (!authData.user) {
        throw new Error('خطا در ثبت‌نام. لطفاً دوباره تلاش کنید.');
      }

      // منتظر می‌مانیم تا trigger پروفایل را ایجاد کند
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (!authData.session) {
        throw new Error('حساب شما ایجاد شد. لطفاً وارد شوید. (اگر email confirmation فعال است، ابتدا ایمیل خود را تأیید کنید)');
      }

      const user = await mapSupabaseUserToAppUser(authData.user as any);
      const token = authData.session.access_token;
      localStorage.setItem('token', token);

      return { user, token };
    } catch (error: any) {
      throw new Error(error.message || 'خطا در ثبت‌نام');
    }
  },

  async loginWithGoogle(): Promise<void> {
    try {
      const redirectBaseUrl = config.redirectBaseUrl;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${redirectBaseUrl}/auth/callback`,
        },
      });

      if (error) {
        throw new Error(error.message || 'خطا در ورود با Google');
      }

      // Supabase خودش redirect می‌کند، پس نیازی به return نیست
    } catch (error: any) {
      throw new Error(error.message || 'خطا در ورود با Google');
    }
  },

  async logout(): Promise<void> {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('token');
      authStore.logout();
    } catch (error: any) {
      console.error('Error logging out:', error);
      localStorage.removeItem('token');
      authStore.logout();
    }
  },

  async getProfile(): Promise<User> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        throw new Error('کاربر لاگین نشده است');
      }

      return await mapSupabaseUserToAppUser(user);
    } catch (error: any) {
      throw new Error(error.message || 'خطا در دریافت پروفایل');
    }
  },

  async updateProfile(data: Partial<{ firstName: string; lastName: string }>): Promise<User> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('کاربر لاگین نشده است');
      }

      const updates: { first_name?: string; last_name?: string } = {};
      if (data.firstName !== undefined) updates.first_name = data.firstName;
      if (data.lastName !== undefined) updates.last_name = data.lastName;

      const { error } = await supabase
        .from('user_profiles')
        // @ts-ignore - Supabase type inference issue with dynamic updates
        .update(updates)
        .eq('id', user.id);

      if (error) {
        throw new Error(error.message || 'خطا در به‌روزرسانی پروفایل');
      }

      return await mapSupabaseUserToAppUser(user);
    } catch (error: any) {
      throw new Error(error.message || 'خطا در به‌روزرسانی پروفایل');
    }
  },

  async forgotPassword(email: string): Promise<void> {
    try {
      const redirectBaseUrl = config.redirectBaseUrl;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${redirectBaseUrl}/reset-password`,
      });

      if (error) {
        throw new Error(error.message || 'خطا در ارسال ایمیل بازیابی رمز');
      }
    } catch (error: any) {
      throw new Error(error.message || 'خطا در ارسال ایمیل بازیابی رمز');
    }
  },

  async resetPassword(_token: string, password: string): Promise<void> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        throw new Error(error.message || 'خطا در تغییر رمز عبور');
      }
    } catch (error: any) {
      throw new Error(error.message || 'خطا در تغییر رمز عبور');
    }
  },

  async upgradeToPro(): Promise<{ redirectUrl: string }> {
    // TODO: پیاده‌سازی پرداخت
    throw new Error('این قابلیت هنوز پیاده‌سازی نشده است');
  },
};

// ============================================
// DJANGO IMPLEMENTATION (Placeholder)
// ============================================

const authServiceDjango: IAuthService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const response = await api.post<ApiResponse<{ user: User; token: string }>>(
      '/auth/login/',
      credentials
    );
    const token = response.data.data.token;
    localStorage.setItem('token', token);
    return response.data.data;
  },

  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    const response = await api.post<ApiResponse<{ user: User; token: string }>>(
      '/auth/register/',
      data
    );
    const token = response.data.data.token;
    localStorage.setItem('token', token);
    return response.data.data;
  },

  async loginWithGoogle(): Promise<void> {
    // Django implementation - redirect به endpoint Django
    window.location.href = '/api/auth/google/login/';
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout/');
    } catch {
      // Ignore logout errors
    }
    localStorage.removeItem('token');
    authStore.logout();
  },

  async getProfile(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/auth/profile/');
    return response.data.data;
  },

  async updateProfile(data: Partial<{ firstName: string; lastName: string }>): Promise<User> {
    const response = await api.patch<ApiResponse<User>>('/auth/profile/', data);
    return response.data.data;
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password/', { email });
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await api.post('/auth/reset-password/', { token, password });
  },

  async upgradeToPro(): Promise<{ redirectUrl: string }> {
    const response = await api.post<ApiResponse<{ redirectUrl: string }>>('/auth/upgrade/');
    return response.data.data;
  },
};

// ============================================
// EXPORTED SERVICE (Router)
// ============================================

export const authService = selectService(
  authServiceMock,
  authServiceSupabase,
  authServiceDjango
);
