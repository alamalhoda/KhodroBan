<script setup>
</script>

<template>
  <div class="flex h-screen w-full flex-row overflow-hidden">
    <aside class="w-80 flex-shrink-0 flex flex-col justify-between bg-white dark:bg-[#1a202e] border-l border-[#dbdee6] dark:border-gray-800 h-full p-6 z-20 shadow-sm">
      <div class="flex flex-col gap-6">
        <div class="flex gap-4 items-center p-3 rounded-xl bg-background-light dark:bg-background-dark/50">
          <div class="relative">
            <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 shadow-sm border-2 border-white dark:border-gray-700" data-alt="User profile picture of a man with a beard" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuBYEsN-vh7_rGY0L282TKIu7KcW718azqR_JWvzj3aidI0rg4w2inSRo2UgviIBeC7srUS-vS6z6d5Bysx0pUHR5BpC6qb2HHA_mZhpV5rIdCHjlRSbUu7hqESkfDCF195wNvhyMcvHUUUhAF7NwHIh6KWs2AQSjjznUJvlI0jP29yi81GJdyfhUDG2KL9CC_xPOfshLlKjFoz9fDraAuwzgB0BlNq-RiEPK870p6EE0wD7swn1oaG9ogzePdYmxP8C5m09o2j6GTA");'>
            </div>
            <div class="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
          </div>
          <div class="flex flex-col">
            <h1 class="text-[#111318] dark:text-white text-lg font-bold leading-tight">آرش صادقی</h1>
            <p class="text-[#616c89] dark:text-gray-400 text-xs font-medium px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 w-fit mt-1">طرح رایگان</p>
          </div>
        </div>
        <nav class="flex flex-col gap-2">
          <a class="flex items-center gap-4 px-4 py-3 rounded-xl bg-primary/10 text-primary transition-all" href="#">
            <span class="material-symbols-outlined text-[24px]">person</span>
            <p class="text-sm font-bold leading-normal">تنظیمات پروفایل</p>
          </a>
          <a class="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-[#616c89] dark:text-gray-400 hover:text-[#111318] dark:hover:text-white transition-all" href="#">
            <span class="material-symbols-outlined text-[24px]">garage_home</span>
            <p class="text-sm font-medium leading-normal">خودروهای من</p>
          </a>
          <a class="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-[#616c89] dark:text-gray-400 hover:text-[#111318] dark:hover:text-white transition-all" href="#">
            <span class="material-symbols-outlined text-[24px]">notifications_active</span>
            <p class="text-sm font-medium leading-normal">یادآورها</p>
          </a>
          <a class="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-[#616c89] dark:text-gray-400 hover:text-[#111318] dark:hover:text-white transition-all" href="#">
            <span class="material-symbols-outlined text-[24px]">workspace_premium</span>
            <div class="flex flex-1 justify-between items-center">
              <p class="text-sm font-medium leading-normal">اشتراک</p>
              <span class="text-[10px] font-bold text-white bg-gradient-to-r from-orange-400 to-pink-500 px-2 py-0.5 rounded-full">PRO</span>
            </div>
          </a>
          <a class="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-[#616c89] dark:text-gray-400 hover:text-[#111318] dark:hover:text-white transition-all" href="#">
            <span class="material-symbols-outlined text-[24px]">shield</span>
            <p class="text-sm font-medium leading-normal">امنیت</p>
          </a>
        </nav>
      </div>
      <button class="flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl h-12 px-4 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400 text-sm font-bold leading-normal transition-colors mt-auto">
        <span class="material-symbols-outlined text-[20px]">logout</span>
        <span class="truncate">خروج از حساب</span>
      </button>
    </aside>
    <main class="flex-1 flex flex-col h-full overflow-hidden relative">
      <header class="flex-shrink-0 px-8 py-6 bg-white/50 dark:bg-[#1a202e]/50 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 z-10 sticky top-0">
        <div class="max-w-[1000px] mx-auto w-full">
          <div class="flex flex-col gap-2">
            <h1 class="text-[#111318] dark:text-white text-3xl font-black leading-tight tracking-tight">تنظیمات</h1>
            <p class="text-[#616c89] dark:text-gray-400 text-base font-normal">مدیریت حساب کاربری، تنظیمات خودرو و اعلان‌ها.</p>
          </div>
        </div>
      </header>
      <div class="flex-1 overflow-y-auto p-8">
        <div class="max-w-[1000px] mx-auto w-full flex flex-col gap-8 pb-20">
          <section class="bg-white dark:bg-[#1a202e] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-[#111318] dark:text-white text-xl font-bold">اطلاعات کاربری</h2>
              <button class="text-primary text-sm font-bold hover:underline">ویرایش تصویر</button>
            </div>
            <div class="flex flex-wrap gap-6">
              <label class="flex flex-col flex-1 min-w-[280px] gap-2">
                <span class="text-[#111318] dark:text-gray-200 text-sm font-medium">نام و نام خانوادگی</span>
                <div class="relative">
                  <input class="w-full rounded-xl border border-[#dbdee6] dark:border-gray-700 bg-background-light dark:bg-background-dark h-12 pr-12 pl-4 text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all dark:text-white" value="آرش صادقی" />
                  <span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">person</span>
                </div>
              </label>
              <label class="flex flex-col flex-1 min-w-[280px] gap-2">
                <span class="text-[#111318] dark:text-gray-200 text-sm font-medium">شماره موبایل</span>
                <div class="relative">
                  <input class="w-full rounded-xl border border-[#dbdee6] dark:border-gray-700 bg-background-light dark:bg-background-dark h-12 pr-12 pl-4 text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all dark:text-white text-left" dir="ltr" value="+98 912 345 6789" />
                  <span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">phone</span>
                </div>
              </label>
            </div>
            <div class="mt-6">
              <label class="flex flex-col w-full max-w-[48%] min-w-[280px] gap-2">
                <span class="text-[#111318] dark:text-gray-200 text-sm font-medium">آدرس ایمیل</span>
                <div class="relative">
                  <input class="w-full rounded-xl border border-[#dbdee6] dark:border-gray-700 bg-background-light dark:bg-background-dark h-12 pr-12 pl-4 text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all dark:text-white text-left" dir="ltr" value="arash.sadeghi@example.com" />
                  <span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">mail</span>
                </div>
              </label>
            </div>
          </section>
          <section class="bg-white dark:bg-[#1a202e] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <div class="flex items-center gap-3 mb-6">
              <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-primary">
                <span class="material-symbols-outlined text-[24px]">commute</span>
              </div>
              <div>
                <h2 class="text-[#111318] dark:text-white text-xl font-bold">یادآورهای هوشمند</h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">تنظیم بازه‌های پیش‌فرض برای خودروها.</p>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="flex flex-col gap-4">
                <div class="flex justify-between items-center">
                  <label class="text-sm font-bold text-gray-700 dark:text-gray-200">سرویس دوره‌ای پیش‌فرض</label>
                  <span class="text-xs font-medium bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300">۵,۰۰۰ کیلومتر</span>
                </div>
                <input class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary dark:bg-gray-700" max="20000" min="1000" step="500" type="range" value="5000" />
                <div class="flex justify-between text-xs text-gray-400">
                  <span>۱,۰۰۰ ک.م</span>
                  <span>۲۰,۰۰۰ ک.م</span>
                </div>
              </div>
              <div class="flex flex-col gap-4">
                <div class="flex justify-between items-center">
                  <label class="text-sm font-bold text-gray-700 dark:text-gray-200">بازه‌ی زمانی</label>
                  <span class="text-xs font-medium bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300">۶ ماه</span>
                </div>
                <input class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary dark:bg-gray-700" max="12" min="1" step="1" type="range" value="6" />
                <div class="flex justify-between text-xs text-gray-400">
                  <span>۱ ماه</span>
                  <span>۱ سال</span>
                </div>
              </div>
            </div>
            <div class="h-px w-full bg-gray-100 dark:bg-gray-800 my-6"></div>
            <div class="flex flex-col gap-4">
              <h3 class="text-sm font-bold text-gray-900 dark:text-white">روش‌های اطلاع‌رسانی</h3>
              <label class="flex items-center justify-between cursor-pointer group">
                <div class="flex items-center gap-3">
                  <span class="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">mail</span>
                  <div class="flex flex-col">
                    <span class="text-sm font-medium text-gray-900 dark:text-white">ایمیل</span>
                    <span class="text-xs text-gray-500">دریافت گزارش‌های ماهانه و هشدارهای مهم.</span>
                  </div>
                </div>
                <div class="relative inline-flex items-center cursor-pointer">
                  <input checked class="sr-only peer" type="checkbox" value="" />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </div>
              </label>
              <label class="flex items-center justify-between cursor-pointer group">
                <div class="flex items-center gap-3">
                  <span class="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">sms</span>
                  <div class="flex flex-col">
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-medium text-gray-900 dark:text-white">پیامک (SMS)</span>
                      <span class="text-[10px] font-bold text-white bg-gradient-to-r from-orange-400 to-pink-500 px-1.5 py-0.5 rounded">PRO</span>
                    </div>
                    <span class="text-xs text-gray-500">یادآوری فوری تعویض روغن و سرویس‌ها روی موبایل.</span>
                  </div>
                </div>
                <div class="relative inline-flex items-center cursor-pointer opacity-60">
                  <input class="sr-only peer" disabled type="checkbox" value="" />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </div>
              </label>
            </div>
          </section>
          <section class="relative overflow-hidden rounded-2xl shadow-lg border border-primary/20 bg-white dark:bg-[#1a202e]">
            <div class="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 pointer-events-none"></div>
            <div class="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
            <div class="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 gap-6">
              <div class="flex flex-col gap-3 max-w-lg">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-primary to-purple-600 text-white w-fit shadow-md shadow-primary/20">
                  <span class="material-symbols-outlined text-[16px]">star</span>
                  <span class="text-xs font-bold tracking-wide uppercase">ارتقا به نسخه حرفه‌ای</span>
                </div>
                <h2 class="text-2xl font-black text-[#111318] dark:text-white">دنیایی از امکانات نامحدود</h2>
                <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                  مدیریت خودروهای نامحدود، یادآور پیامکی، گزارش‌گیری پیشرفته، خروجی اکسل و حذف کامل تبلیغات.
                </p>
                <div class="flex gap-4 mt-2">
                  <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span class="material-symbols-outlined text-green-500 text-[18px]">check_circle</span>
                    تعداد خودرو نامحدود
                  </div>
                  <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span class="material-symbols-outlined text-green-500 text-[18px]">check_circle</span>
                    خروجی گرفتن از اطلاعات
                  </div>
                </div>
              </div>
              <div class="flex-shrink-0">
                <button class="group relative flex items-center gap-3 px-8 py-4 bg-[#111318] dark:bg-white text-white dark:text-[#111318] rounded-xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <span>ارتقا حساب</span>
                  <span class="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
                </button>
                <p class="text-center text-xs text-gray-500 mt-3">۷ روز استفاده رایگان، لغو در هر زمان.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div class="border-t border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#1a202e]/80 backdrop-blur p-4 flex justify-end gap-3 z-30 absolute bottom-0 w-full">
        <button class="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          انصراف
        </button>
        <button class="px-8 py-2.5 rounded-lg bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:bg-blue-700 transition-colors flex items-center gap-2">
          <span class="material-symbols-outlined text-[18px]">save</span>
          ذخیره تغییرات
        </button>
      </div>
    </main>
  </div>
</template>
