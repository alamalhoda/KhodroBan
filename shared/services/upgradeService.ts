/**
 * Upgrade Service
 * مدیریت ارتقا به نسخه Pro و ارتباط با backend
 */

import { supabase } from './supabase';

export interface UpgradeResponse {
  redirectUrl: string;
  sessionId?: string;
}

export interface UserProfile {
  tier: 'free' | 'pro' | 'pro+';
  name: string;
  email: string;
}

/**
 * سرویس ارتقا به نسخه Pro
 */
export const upgradeService = {
  /**
   * ارتقا به نسخه Pro یا Pro+
   * @param plan - نوع طرح: 'pro' یا 'pro+'
   * @returns redirectUrl برای درگاه پرداخت
   */
  async upgrade(plan: 'pro' | 'pro+'): Promise<UpgradeResponse> {
    // دریافت اطلاعات کاربر جاری
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('کاربر لاگین نکرده است');
    }

    // در نسخه واقعی: ایجاد session پرداخت
    // اینجا ما یک mock response برمی‌گردانیم
    
    // const { data, error } = await supabase.rpc('create_checkout_session', {
    //   plan_type: plan,
    //   user_id: user.id
    // });
    
    // if (error) throw error;
    
    // return { redirectUrl: data.url, sessionId: data.session_id };
    
    // نسخه دمو:
    return {
      redirectUrl: `https://payment.example.com/checkout?plan=${plan}&user=${user.id}`,
      sessionId: `demo-session-${Date.now()}`
    };
  },

  /**
   * دریافت پلان فعلی کاربر
   * @returns پلان فعلی کاربر
   */
  async getCurrentPlan(): Promise<UserProfile> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('کاربر لاگین نکرده است');
    }

    // دریافت پروفایل کاربر
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('first_name, last_name, email')
      .eq('id', user.id)
      .single();

    // دریافت اشتراک فعال کاربر
    const { data: subscription, error: subError } = await supabase
      .from('user_subscriptions')
      .select(`
        is_active,
        subscription_plans:plan_id (plan_code)
      `)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .maybeSingle();

    // تعیین tier بر اساس اشتراک
    let tier: 'free' | 'pro' | 'pro+' = 'free';
    if (subscription && !subError) {
      const planCode = (subscription as any).subscription_plans?.plan_code;
      if (planCode === 'pro') tier = 'pro';
      if (planCode === 'pro+') tier = 'pro+';
    }

    // اگر پروفایل وجود نداشت، از اطلاعات auth استفاده کن
    if (profileError && profileError.code !== 'PGRST116') {
      throw profileError;
    }

    return {
      tier,
      name: profile 
        ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'کاربر'
        : (user.user_metadata?.name || 'کاربر'),
      email: profile?.email || user.email || ''
    };
  },

  /**
   * بررسی وضعیت پرداخت
   * @param sessionId - شناسه session پرداخت
   * @returns وضعیت پرداخت
   */
  async checkPaymentStatus(sessionId: string): Promise<{ status: 'pending' | 'success' | 'failed' }> {
    // در نسخه واقعی: بررسی وضعیت پرداخت از backend
    // const { data, error } = await supabase
    //   .from('payment_sessions')
    //   .select('status')
    //   .eq('session_id', sessionId)
    //   .single();
    
    // if (error) throw error;
    // return { status: data.status };
    
    // نسخه دمو:
    return { status: 'success' };
  },

  /**
   * لغو اشتراک
   * @returns نتیجه عملیات
   */
  async cancelSubscription(): Promise<{ success: boolean }> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('کاربر لاگین نکرده است');
    }

    // در نسخه واقعی: ایجاد درخواست لغو
    // const { error } = await supabase
    //   .from('cancellation_requests')
    //   .insert({
    //     user_id: user.id,
    //     reason: 'user_initiated',
    //     created_at: new Date().toISOString()
    //   });
    
    // if (error) throw error;
    
    return { success: true };
  },

  /**
   * دریافت تاریخچه پرداخت‌ها
   * @returns لیست پرداخت‌ها
   */
  async getPaymentHistory() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('کاربر لاگین نکرده است');
    }

    const { data: payments, error } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return payments || [];
  },

  /**
   * ارتقای آزمایشی (برای تست)
   * @param plan - نوع طرح
   * @returns نتیجه
   */
  async trialUpgrade(plan: 'pro' | 'pro+'): Promise<{ success: boolean; tier: string }> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('کاربر لاگین نکرده است');
    }

    // دریافت plan_id بر اساس plan_code
    const { data: planData, error: planError } = await supabase
      .from('subscription_plans')
      .select('plan_id')
      .eq('plan_code', plan)
      .single();

    if (planError) throw planError;

    // غیرفعال کردن اشتراک‌های فعلی
    await supabase
      .from('user_subscriptions')
      .update({ is_active: false })
      .eq('user_id', user.id);

    // ایجاد اشتراک جدید
    const { error } = await supabase
      .from('user_subscriptions')
      .insert({
        user_id: user.id,
        plan_id: planData.plan_id,
        is_active: true,
        start_date: new Date().toISOString().split('T')[0],
        auto_renew: false,
      });

    if (error) throw error;

    return { success: true, tier: plan };
  }
};
