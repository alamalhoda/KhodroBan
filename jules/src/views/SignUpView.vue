<script setup>
</script>

<template>
  <div class="bg-background-light dark:bg-background-dark text-slate-900 min-h-screen flex items-center justify-center p-4 lg:p-8 relative overflow-hidden">
    <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-400/20 rounded-full blur-[120px] pointer-events-none"></div>
    <div class="w-full max-w-[1280px] h-full min-h-[800px] grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white/90 backdrop-blur-xl dark:bg-[#1a2634]/90 rounded-2xl shadow-2xl overflow-hidden border border-white/50 relative z-10">
      <div class="hidden lg:flex lg:col-span-5 relative flex-col justify-between bg-primary p-12 overflow-hidden">
        <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(#ffffff 2px, transparent 2px); background-size: 24px 24px;"></div>
        <div class="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black/20 to-transparent z-0"></div>
        <div class="relative z-10">
          <div class="flex items-center gap-3 text-white mb-12">
            <span class="material-symbols-outlined text-4xl">directions_car</span>
            <h1 class="text-2xl font-bold tracking-tight">خودروبان</h1>
          </div>
          <h2 class="text-white text-4xl font-extrabold leading-tight mb-6">
            مدیریت هوشمند<br />
            هزینه‌ها و سرویس‌های<br />
            خودروی شما
          </h2>
          <p class="text-white/80 text-lg font-light leading-relaxed max-w-sm">
            با خودروبان، دیگر نگران فراموش کردن زمان تعویض روغن یا تمدید بیمه نباشید. ما هوای خودروی شما را داریم.
          </p>
        </div>
        <div class="relative z-10 mt-auto w-full aspect-video rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg flex items-center justify-center group">
          <img alt="Car Dashboard" class="object-cover w-full h-full opacity-80 mix-blend-overlay group-hover:scale-105 transition-transform duration-700" data-alt="Modern car interior dashboard view showing high tech navigation" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAt6fPYpyRtIAJQk5Skv2h_VvlcxN8VEaAPhcDPcK1VeHQE0a7xRgp_jCo4yUsZe9gxRUc3J4A6cQsaOxAz9mgAyIehn2glyGwYQvAE4Blh0cjksLFhX7yBbGAignSAOUFz0qnhRBtpqD9_enSOmK_2mcOzg9t6iCBVoi0dIiKbayUTjl_V9FOYv8djeshCUbwf8mcssICUG8RwgzUHJGbZy7vO1Xf_OjfK3GJGXkJAPPJyRKSeIdyh2DHMW3h3M8zb-ZCNCYLpVEc" />
          <div class="absolute inset-0 bg-gradient-to-t from-primary to-transparent opacity-60"></div>
          <div class="absolute bottom-4 right-4 text-white font-medium flex items-center gap-2">
            <span class="material-symbols-outlined text-sm">verified_user</span>
            <span>امنیت بالا و دسترسی آسان</span>
          </div>
        </div>
      </div>
      <div class="col-span-1 lg:col-span-7 p-6 md:p-12 lg:p-16 flex flex-col justify-center overflow-y-auto">
        <div class="lg:hidden flex items-center gap-2 text-primary mb-8 justify-center">
          <span class="material-symbols-outlined text-3xl">directions_car</span>
          <h2 class="text-xl font-bold">خودروبان</h2>
        </div>
        <div class="max-w-[520px] mx-auto w-full">
          <div class="mb-8 text-center lg:text-right">
            <h3 class="text-3xl font-bold text-slate-900 dark:text-white mb-3">ساخت حساب کاربری</h3>
            <p class="text-slate-500 dark:text-slate-400 text-base">اطلاعات خود را وارد کنید تا به خانواده بزرگ خودروبان بپیوندید.</p>
          </div>
          <button class="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-medium h-12 rounded-xl transition-all duration-200 mb-6 group">
            <svg class="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            <span>ثبت‌نام با گوگل</span>
          </button>
          <div class="relative flex py-2 items-center mb-6">
            <div class="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
            <span class="flex-shrink-0 mx-4 text-slate-400 text-sm">یا با ایمیل</span>
            <div class="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
          </div>
          <form class="space-y-5">
            <div class="flex flex-col md:flex-row gap-5">
              <div class="flex-1 space-y-2">
                <label class="text-sm font-medium text-slate-700 dark:text-slate-300 mr-1" for="firstName">نام</label>
                <input class="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" id="firstName" placeholder="نام خود را وارد کنید" type="text" />
              </div>
              <div class="flex-1 space-y-2">
                <label class="text-sm font-medium text-slate-700 dark:text-slate-300 mr-1" for="lastName">نام خانوادگی</label>
                <input class="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" id="lastName" placeholder="نام خانوادگی" type="text" />
              </div>
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700 dark:text-slate-300 mr-1" for="email">ایمیل</label>
              <div class="relative">
                <input class="w-full h-12 pl-4 pr-10 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-left" dir="ltr" id="email" placeholder="example@email.com" type="email" />
                <span class="material-symbols-outlined absolute right-3 top-3 text-slate-400 pointer-events-none">mail</span>
              </div>
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700 dark:text-slate-300 mr-1" for="phoneNumber">شماره تلفن</label>
              <div class="relative">
                <input class="w-full h-12 pl-4 pr-10 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-left" dir="ltr" id="phoneNumber" placeholder="0912 345 6789" type="tel" />
                <span class="material-symbols-outlined absolute right-3 top-3 text-slate-400 pointer-events-none">smartphone</span>
              </div>
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700 dark:text-slate-300 mr-1" for="password">رمز عبور</label>
              <div class="relative group/pass">
                <input class="w-full h-12 pl-4 pr-10 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-left" dir="ltr" id="password" placeholder="********" type="password" />
                <span class="material-symbols-outlined absolute right-3 top-3 text-slate-400 pointer-events-none group-focus-within/pass:text-primary transition-colors">lock</span>
              </div>
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700 dark:text-slate-300 mr-1" for="confirm-password">تکرار رمز عبور</label>
              <div class="relative group/confirm">
                <input class="w-full h-12 pl-4 pr-10 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-left" dir="ltr" id="confirm-password" placeholder="********" type="password" />
                <span class="material-symbols-outlined absolute right-3 top-3 text-slate-400 pointer-events-none group-focus-within/confirm:text-primary transition-colors">lock_reset</span>
              </div>
            </div>
            <div class="flex items-start gap-3 mt-2">
              <div class="flex items-center h-5">
                <input class="w-4 h-4 border border-slate-300 rounded bg-slate-50 focus:ring-3 focus:ring-primary/30 dark:bg-slate-700 dark:border-slate-600 dark:focus:ring-primary/60 dark:ring-offset-slate-800 text-primary" id="terms" type="checkbox" />
              </div>
              <label class="text-sm font-light text-slate-500 dark:text-slate-400" for="terms">
                با <a class="font-medium text-primary hover:underline hover:text-primary-dark" href="#">قوانین و مقررات</a> خودروبان موافقم.
              </label>
            </div>
            <button class="w-full bg-primary hover:bg-primary-dark text-white font-bold h-12 rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 flex items-center justify-center gap-2 mt-4" type="button">
              <span>ثبت‌نام</span>
              <span class="material-symbols-outlined text-sm">arrow_back</span>
            </button>
          </form>
          <div class="text-center mt-8">
            <p class="text-sm text-slate-500 dark:text-slate-400">
              قبلاً ثبت‌نام کرده‌اید؟
              <a class="font-bold text-primary hover:text-primary-dark hover:underline transition-colors" href="#">وارد شوید</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
