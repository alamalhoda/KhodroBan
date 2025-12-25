<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { supabase } from '$lib/supabase';
  import { navigateTo } from '$lib/utils/navigation';
  import { authStore, toastStore } from '$lib/stores';
  import { authService } from '$lib/services';
  import type { User } from '$lib/types';

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

  onMount(async () => {
    try {
      // دریافت session از URL (Supabase خودش session را در URL قرار می‌دهد)
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        throw error;
      }

      if (!session || !session.user) {
        throw new Error('خطا در دریافت اطلاعات کاربر');
      }

      // تبدیل به User type اپلیکیشن
      const user = await mapSupabaseUserToAppUser(session.user);
      const token = session.access_token;
      
      // ذخیره در store
      authStore.loginSuccess(user, token);
      toastStore.success('خوش آمدید!');
      
      // Redirect به dashboard
      await navigateTo('/dashboard');
    } catch (error: any) {
      console.error('OAuth callback error:', error);
      const message = error?.message || 'خطا در ورود با Google. لطفاً دوباره تلاش کنید.';
      toastStore.error(message);
      await navigateTo('/login');
    }
  });
</script>

<div class="callback-page">
  <div class="loading-container">
    <div class="spinner"></div>
    <p>در حال ورود...</p>
  </div>
</div>

<style>
  .callback-page {
    min-height: 100vh;
    min-height: 100dvh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--color-bg) 0%, var(--color-bg-dark) 100%);
  }

  .loading-container {
    text-align: center;
  }

  .spinner {
    width: 48px;
    height: 48px;
    border: 4px solid rgba(30, 58, 138, 0.2);
    border-top-color: var(--color-primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 1rem;
  }

  .loading-container p {
    color: var(--color-text);
    font-size: 1rem;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>

