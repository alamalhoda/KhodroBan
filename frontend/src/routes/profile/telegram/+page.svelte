<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import { authStore } from '$lib/stores/auth';
  
  let telegramConnected = false;
  let chatId: number | null = null;
  let loading = false;
  let link = '';
  let botUsername = 'OilChengerReminderBot'; // تغییر دهید
  
  $: user = $authStore.user;
  
  onMount(async () => {
    if (user?.id) {
      await checkTelegramStatus();
    }
  });
  
  async function checkTelegramStatus() {
    if (!supabase) return;
    
    const { data } = await supabase
      .from('telegram_users')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();
    
    if (data) {
      telegramConnected = true;
      chatId = data.chat_id;
    }
  }
  
  async function connectTelegram() {
    loading = true;
    
    // ایجاد لینک اختصاصی
    link = `https://t.me/${botUsername}?start=${user.id}`;
    
    // باز کردن تلگرام
    window.open(link, '_blank');
    loading = false;
    
    // چک کردن وضعیت هر ۵ ثانیه
    const interval = setInterval(async () => {
      await checkTelegramStatus();
      if (telegramConnected) {
        clearInterval(interval);
      }
    }, 5000);
  }
  
  async function disconnectTelegram() {
    if (!confirm('آیا مطمئن هستید که می‌خواهید اتصال را قطع کنید؟')) return;
    
    if (!supabase) return;
    
    await supabase
      .from('telegram_users')
      .update({ is_active: false })
      .eq('user_id', user.id);
    
    telegramConnected = false;
    chatId = null;
    link = '';
  }
</script>

<div class="container">
  <div class="card">
    <h2>📱 اتصال تلگرام</h2>
    
    {#if telegramConnected}
      <div class="success-box">
        <div class="icon">✅</div>
        <h3>تلگرام متصل است</h3>
        <p class="info">Chat ID: <code>{chatId}</code></p>
        <p class="note">یادآوری‌ها به صورت خودکار به تلگرام شما ارسال می‌شود.</p>
        <button on:click={disconnectTelegram} class="btn-danger">
          قطع اتصال
        </button>
      </div>
    {:else}
      <div class="connect-box">
        <div class="icon">🔔</div>
        <h3>اتصال به تلگرام</h3>
        <p>برای دریافت یادآوری در تلگرام، ربات را استارت کنید:</p>
        
        <button on:click={connectTelegram} disabled={loading}>
          {loading ? 'در حال انتظار...' : 'اتصال به تلگرام'}
        </button>
        
        <div class="steps">
          <p><strong>مراحل:</strong></p>
          <ol>
            <li>روی دکمه کلیک کنید</li>
            <li>در تلگرام، دکمه "Start" را بزنید</li>
            <li>اتصال به صورت خودکار انجام می‌شود</li>
          </ol>
        </div>
        
        {#if link}
          <div class="link-box">
            <p>لینک جایگزین (اگر دکمه کار نکرد):</p>
            <a href={link} target="_blank">{link}</a>
          </div>
        {/if}
      </div>
    {/if}
    
    <div class="info-box">
      <h4>💡 مزایا:</h4>
      <ul>
        <li>✅ کاملاً رایگان</li>
        <li>✅ ارسال فوری</li>
        <li>✅ بدون مشکل فیلترینگ</li>
        <li>✅ قابل تعامل (دکمه‌ها)</li>
      </ul>
    </div>
  </div>
</div>

<style>
  .container {
    max-width: 600px;
    margin: 2rem auto;
    padding: 1rem;
  }
  
  .card {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  
  h2 {
    margin: 0 0 1.5rem 0;
    color: #1a1a1a;
  }
  
  .icon {
    font-size: 3rem;
    margin-bottom: 0.5rem;
  }
  
  .success-box {
    background: #d4edda;
    border: 1px solid #c3e6cb;
    border-radius: 8px;
    padding: 1.5rem;
    text-align: center;
  }
  
  .success-box h3 {
    color: #155724;
    margin: 0.5rem 0;
  }
  
  .info {
    font-family: monospace;
    background: white;
    padding: 0.5rem;
    border-radius: 4px;
    margin: 0.5rem 0;
  }
  
  .connect-box {
    background: #fff3cd;
    border: 1px solid #ffeaa7;
    border-radius: 8px;
    padding: 1.5rem;
    text-align: center;
  }
  
  button {
    background: #007bff;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
    margin: 1rem 0;
    transition: background 0.2s;
  }
  
  button:hover:not(:disabled) {
    background: #0056b3;
  }
  
  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .btn-danger {
    background: #dc3545;
  }
  
  .btn-danger:hover {
    background: #c82333;
  }
  
  .steps {
    text-align: right;
    margin-top: 1rem;
    padding: 1rem;
    background: white;
    border-radius: 6px;
  }
  
  .steps ol {
    margin: 0.5rem 0;
    padding-right: 1.5rem;
  }
  
  .link-box {
    margin-top: 1rem;
    padding: 1rem;
    background: white;
    border-radius: 6px;
    word-break: break-all;
  }
  
  .link-box a {
    color: #007bff;
    font-size: 0.9rem;
  }
  
  .info-box {
    margin-top: 1.5rem;
    padding: 1rem;
    background: #e7f3ff;
    border-radius: 8px;
    border: 1px solid #b3d9ff;
  }
  
  .info-box h4 {
    margin: 0 0 0.5rem 0;
    color: #004085;
  }
  
  .info-box ul {
    margin: 0;
    padding-right: 1.5rem;
    color: #004085;
  }
  
  .note {
    color: #666;
    font-size: 0.9rem;
    margin: 0.5rem 0;
  }
</style>

