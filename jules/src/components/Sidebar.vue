<template>
  <aside class="hidden md:flex w-72 flex-col glass-panel border-l border-white/50 h-full transition-all duration-300 z-20">
    <div class="p-6 flex flex-col gap-1">
      <h1 class="text-primary dark:text-white text-2xl font-black tracking-tight flex items-center gap-2">
        <span class="material-symbols-outlined text-primary text-3xl">local_taxi</span>
        خودروبان
      </h1>
      <p class="text-[#666e85] dark:text-gray-400 text-xs font-medium pr-10">مدیریت هوشمند ناوگان</p>
    </div>
    <nav class="flex-1 flex flex-col gap-2 px-4 mt-4">
      <a class="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]" href="#">
        <span class="material-symbols-outlined">dashboard</span>
        <span class="font-medium text-sm">داشبورد</span>
      </a>
      <a class="flex items-center gap-3 px-4 py-3 rounded-xl text-[#666e85] dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/5 transition-all group" href="#">
        <span class="material-symbols-outlined group-hover:text-primary transition-colors">directions_car</span>
        <span class="font-medium text-sm group-hover:text-primary dark:group-hover:text-white transition-colors">گاراژ من</span>
      </a>
      <a class="flex items-center gap-3 px-4 py-3 rounded-xl text-[#666e85] dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/5 transition-all group" href="#">
        <span class="material-symbols-outlined group-hover:text-primary transition-colors">credit_card</span>
        <span class="font-medium text-sm group-hover:text-primary dark:group-hover:text-white transition-colors">هزینه‌ها</span>
      </a>
      <a class="flex items-center gap-3 px-4 py-3 rounded-xl text-[#666e85] dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/5 transition-all group" href="#">
        <div class="relative">
          <span class="material-symbols-outlined group-hover:text-primary transition-colors">notifications</span>
          <span class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#121620]"></span>
        </div>
        <span class="font-medium text-sm group-hover:text-primary dark:group-hover:text-white transition-colors">یادآورها</span>
      </a>
      <a class="flex items-center gap-3 px-4 py-3 rounded-xl text-[#666e85] dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/5 transition-all group" href="#">
        <span class="material-symbols-outlined group-hover:text-primary transition-colors">settings</span>
        <span class="font-medium text-sm group-hover:text-primary dark:group-hover:text-white transition-colors">تنظیمات</span>
      </a>
    </nav>
    <div class="p-4 mt-auto">
      <div class="glass-panel p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10">
        <div class="flex items-center gap-3 mb-2">
          <div class="bg-primary/20 p-2 rounded-lg text-primary">
            <span class="material-symbols-outlined text-[20px]">diamond</span>
          </div>
          <div>
            <p class="text-sm font-bold text-[#121317] dark:text-white">طرح حرفه‌ای</p>
            <p class="text-xs text-[#666e85]">دریافت تحلیل‌های پیشرفته</p>
          </div>
        </div>
        <button class="w-full mt-2 py-2 text-xs font-bold text-white bg-primary rounded-lg hover:bg-primary-light transition-colors">ارتقا حساب</button>
      </div>
    </div>
  </aside>
</template>
