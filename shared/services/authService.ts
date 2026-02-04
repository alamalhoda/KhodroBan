import { supabase } from './supabase';
import api from './api';
import type { User, LoginCredentials, RegisterData, ApiResponse } from '../types';
import { selectService } from './base/router';
import type { IAuthService } from './base/types';
import { config } from './config';

// ============================================
// Helper Functions
// ============================================

/**
 * تبدیل Supabase User به User type اپلیکیشن
 */
async function mapSupabaseUserToAppUser(supabaseUser: any): Promise<User> {
  if (!supabase) {
    throw new Error('Supabase client not available');
  }

  let profileData: any = null;
  let planCode = 'free';

  try {
    // دریافت پروفایل کاربر
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .maybeSingle();

    // اگر خطای شبکه یا خطای غیر از "no rows found" وجود داشت، لاگ کن
    if (profileError) {
      // PGRST116 = no rows returned
      if (profileError.code !== 'PGRST116') {
        console.warn('Error fetching profile:', profileError);
      }
    } else if (profile) {
      profileData = profile;
    }
  } catch (error: any) {
    // Handle network errors - اگر خطای شبکه بود، از مقادیر پیش‌فرض استفاده کن
    const isNetworkError = 
      error.message?.includes('Failed to fetch') ||
      error.message?.includes('ERR_NETWORK_CHANGED') ||
      error.message?.includes('ERR_NAME_NOT_RESOLVED') ||
      error.message?.includes('ERR_CONNECTION_CLOSED') ||
      error.name === 'TypeError';
    
    if (isNetworkError) {
      console.warn('Network error while fetching profile, using defaults:', error);
    } else {
      console.warn('Error fetching profile, using defaults:', error);
    }
  }

  try {
    // دریافت subscription فعال کاربر
    const { data: subscription, error: subscriptionError } = await supabase
      .from('user_subscriptions')
      .select('plan_id')
      .eq('user_id', supabaseUser.id)
      .eq('is_active', true)
      .maybeSingle();

    // اگر خطای شبکه یا خطای غیر از "no rows found" وجود داشت، لاگ کن
    if (subscriptionError) {
      // PGRST116 = no rows returned
      if (subscriptionError.code !== 'PGRST116') {
        console.warn('Error fetching subscription:', subscriptionError);
      }
    } else if (subscription?.plan_id) {
      try {
        // Add timeout for subscription_plans query (3 seconds)
        // اگر این query timeout شود، از free tier استفاده می‌کنیم
        const timeoutPromise = new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Subscription plan query timeout')), 3000)
        );
        
        const planQuery = supabase
          .from('subscription_plans')
          .select('plan_code')
          .eq('plan_id', subscription.plan_id)
          .maybeSingle();

        const queryPromise = Promise.resolve(planQuery).then(result => result).catch((err: any) => ({ error: err, data: null }));

        const result = await Promise.race([
          queryPromise,
          timeoutPromise
        ]) as any;

        // Check if result is from timeout (error thrown) or from query
        if (result && result.error) {
          // Check if it's a timeout error
          if (result.error.message?.includes('timeout') || result.error.message?.includes('Timeout')) {
            console.debug('Subscription plan query timeout, using free tier');
          } else if (result.error.code !== 'PGRST116') {
            // Only log non-"no rows found" errors
            console.warn('Error fetching plan:', result.error);
          }
        } else if (result && result.data) {
          // Query succeeded
          const plan = result.data;
          if (plan) {
            planCode = (plan as any)?.plan_code || 'free';
          }
        }
      } catch (error: any) {
        // Handle timeout errors - silently use free tier
        const isTimeout = error.message?.includes('timeout') || error.message?.includes('Timeout');
        const isNetworkError = 
          error.message?.includes('Failed to fetch') ||
          error.message?.includes('ERR_NETWORK_CHANGED') ||
          error.message?.includes('ERR_NAME_NOT_RESOLVED') ||
          error.message?.includes('ERR_CONNECTION_CLOSED') ||
          error.name === 'TypeError';
        
        if (isTimeout || isNetworkError) {
          // Silently use free tier - this is expected behavior
          console.debug('Subscription plan query timeout or network error, using free tier');
        } else {
          console.warn('Error fetching plan, using free tier:', error);
        }
      }
    }
  } catch (error: any) {
    // Handle network errors - اگر خطای شبکه بود، از free tier استفاده کن
    const isNetworkError = 
      error.message?.includes('Failed to fetch') ||
      error.message?.includes('ERR_NETWORK_CHANGED') ||
      error.message?.includes('ERR_NAME_NOT_RESOLVED') ||
      error.message?.includes('ERR_CONNECTION_CLOSED') ||
      error.name === 'TypeError';
    
    if (isNetworkError) {
      console.warn('Network error while fetching subscription, using free tier:', error);
    } else {
      console.warn('Error fetching subscription, using free tier:', error);
    }
  }

  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name:
      `${profileData?.first_name || ''} ${profileData?.last_name || ''}`.trim() ||
      supabaseUser.email ||
      '',
    tier: (planCode === 'pro' || planCode === 'pro+') ? planCode : 'free',
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
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (credentials.email && credentials.password) {
      const token = 'mock-jwt-token-' + Date.now();
      return { user: mockUser, token };
    }
    throw new Error('ایمیل یا رمز عبور اشتباه است');
  },

  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    await new Promise((resolve) => setTimeout(resolve, 800));

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
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Mock: redirect به dashboard (در واقعیت این کار را Supabase انجام می‌دهد)
    const token = 'mock-jwt-token-' + Date.now();
    localStorage.setItem('token', token);
    // Note: Store update should be handled by framework-specific wrapper
  },

  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    localStorage.removeItem('token');
    // Note: Store update should be handled by framework-specific wrapper
  },

  async getProfile(): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockUser;
  },

  async updateProfile(data: Partial<{ firstName: string; lastName: string }>): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { ...mockUser, ...data };
  },

  async forgotPassword(_email: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Mock: همیشه موفق است
  },

  async resetPassword(_token: string, _password: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Mock: همیشه موفق است
  },

  async upgradeToPro(): Promise<{ redirectUrl: string }> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { redirectUrl: 'https://payment.example.com/checkout' };
  },
};

// ============================================
// SUPABASE IMPLEMENTATION
// ============================================

// Helper to ensure supabase is available
function ensureSupabase() {
  if (!supabase) throw new Error('Supabase client not available. Check VITE_BACKEND_TYPE and environment variables.');
}

/**
 * Helper function to get user with timeout
 */
async function getUserWithTimeout(timeoutMs: number = 5000) {
  ensureSupabase();
  
  const timeoutPromise = new Promise<never>((_, reject) => 
    setTimeout(() => reject(new Error('Authentication timeout')), timeoutMs)
  );
  
  const getUserPromise = supabase!.auth.getUser();
  
  try {
    return await Promise.race([
      getUserPromise,
      timeoutPromise
    ]);
  } catch (error: any) {
    // If timeout or network error, throw a more user-friendly error
    const isTimeout = error.message?.includes('timeout') || error.message?.includes('Timeout');
    const isNetworkError = 
      error.message?.includes('Failed to fetch') ||
      error.message?.includes('ERR_NETWORK_CHANGED') ||
      error.message?.includes('ERR_NAME_NOT_RESOLVED') ||
      error.message?.includes('ERR_CONNECTION_CLOSED') ||
      error.name === 'TypeError';
    
    if (isTimeout || isNetworkError) {
      throw new Error('خطا در اتصال به سرور. لطفاً اتصال اینترنت خود را بررسی کنید.');
    }
    throw error;
  }
}

const authServiceSupabase: IAuthService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    ensureSupabase();
    try {
      // Add timeout for login request (10 seconds)
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Login timeout')), 10000)
      );
      
      const loginPromise = supabase!.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      const { data, error } = await Promise.race([
        loginPromise,
        timeoutPromise
      ]) as any;

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
      // Handle network errors and timeout
      const isTimeout = error.message?.includes('timeout') || error.message?.includes('Timeout');
      const isNetworkError = 
        error.message?.includes('Failed to fetch') || 
        error.message?.includes('ERR_CONNECTION_CLOSED') ||
        error.message?.includes('ERR_NETWORK_CHANGED') ||
        error.message?.includes('ERR_NAME_NOT_RESOLVED') ||
        error.message?.includes('NetworkError') ||
        error.name === 'TypeError';
      
      if (isTimeout || isNetworkError) {
        throw new Error('خطا در اتصال به سرور. لطفاً اتصال اینترنت خود را بررسی کنید و دوباره تلاش کنید.');
      }
      throw new Error(error.message || 'خطا در ورود');
    }
  },

  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    ensureSupabase();
    try {
      const nameParts = data.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const { data: authData, error } = await supabase!.auth.signUp({
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
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (!authData.session) {
        throw new Error(
          'حساب شما ایجاد شد. لطفاً وارد شوید. (اگر email confirmation فعال است، ابتدا ایمیل خود را تأیید کنید)'
        );
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
    ensureSupabase();
    try {
      const redirectBaseUrl = config.redirectBaseUrl;

      const { error } = await supabase!.auth.signInWithOAuth({
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
    ensureSupabase();
    try {
      await supabase!.auth.signOut();
      localStorage.removeItem('token');
      // Note: Store update should be handled by framework-specific wrapper
    } catch (error: any) {
      console.error('Error logging out:', error);
      localStorage.removeItem('token');
      // Note: Store update should be handled by framework-specific wrapper
    }
  },

  async getProfile(): Promise<User> {
    try {
      const {
        data: { user },
        error,
      } = await getUserWithTimeout(5000); // 5 second timeout

      if (error || !user) {
        throw new Error('کاربر لاگین نشده است');
      }

      return await mapSupabaseUserToAppUser(user);
    } catch (error: any) {
      // Re-throw with better error message if it's already a user-friendly error
      if (error.message?.includes('اتصال به سرور')) {
        throw error;
      }
      throw new Error(error.message || 'خطا در دریافت پروفایل');
    }
  },

  async updateProfile(data: Partial<{ firstName: string; lastName: string }>): Promise<User> {
    try {
      const {
        data: { user },
        error: getUserError,
      } = await getUserWithTimeout(5000); // 5 second timeout

      if (getUserError || !user) {
        throw new Error('کاربر لاگین نشده است');
      }

      const updates: { first_name?: string; last_name?: string } = {};
      if (data.firstName !== undefined) updates.first_name = data.firstName;
      if (data.lastName !== undefined) updates.last_name = data.lastName;

      const { error } = await supabase!
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
    ensureSupabase();
    try {
      const redirectBaseUrl = config.redirectBaseUrl;

      const { error } = await supabase!.auth.resetPasswordForEmail(email, {
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
    ensureSupabase();
    try {
      const { error } = await supabase!.auth.updateUser({
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
    // Note: Store update should be handled by framework-specific wrapper
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

export const authService = selectService(authServiceMock, authServiceSupabase, authServiceDjango);
