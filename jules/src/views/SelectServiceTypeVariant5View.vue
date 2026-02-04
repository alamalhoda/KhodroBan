<script setup>
</script>

<template>
  <div class="relative flex min-h-screen w-full flex-col overflow-x-hidden">
    <header class="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f1f1f4] dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-4 sm:px-10 py-3 transition-colors duration-200">
      <div class="flex items-center gap-4 text-[#121317] dark:text-white">
        <div class="size-8 flex items-center justify-center text-primary dark:text-blue-400">
          <span class="material-symbols-outlined text-3xl">local_taxi</span>
        </div>
        <h2 class="text-[#121317] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">مدیریت خودرو</h2>
      </div>
      <div class="flex flex-1 justify-end gap-4 sm:gap-8 items-center">
        <nav class="hidden md:flex items-center gap-9">
          <a class="text-[#121317] dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 text-sm font-medium leading-normal transition-colors" href="#">داشبورد</a>
          <a class="text-[#121317] dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 text-sm font-medium leading-normal transition-colors" href="#">خودروها</a>
          <a class="text-[#121317] dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 text-sm font-medium leading-normal transition-colors" href="#">گزارش‌ها</a>
        </nav>
        <div class="h-8 w-[1px] bg-gray-200 dark:bg-gray-700 hidden md:block"></div>
        <div class="flex items-center gap-3">
          <div class="hidden sm:flex flex-col items-end">
            <span class="text-sm font-semibold dark:text-white">امیرحسین رضایی</span>
            <span class="text-xs text-gray-500 dark:text-gray-400">طرح حرفه‌ای</span>
          </div>
          <div class="bg-center bg-no-repeat bg-cover rounded-full size-10 ring-2 ring-white dark:ring-gray-800 shadow-sm" data-alt="User profile avatar" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCIlggVSiSEjowXShmlBOMiJpm3691nnKwqshmId0bNFRe8rFFsivfCXxRDq_VEbZxJ7i8qvc_Nmmlcp9sE5-WE6ZkX4_3mA1CyJBoV3DQuTJH-Vb-_fOgKQBc1Hf9MrMYnt0GQ1I_XS_6f_4emIHw0ATsHs2YaQXJH5KwanY48_6-Lit_0R_qjSeEpTNeMYSGD-q00G1L7mz-uBqeRYJubAzGNMVTVNrSdGHnXz-0Eq04m0su5ZHRH7Z-BpUo_LF74VbTzlkepb68");'></div>
        </div>
      </div>
    </header>
    <main class="flex-grow flex justify-center py-6 px-4 sm:px-6 lg:px-8">
      <div class="w-full max-w-[960px] flex flex-col gap-6">
        <div class="flex flex-wrap justify-between items-end gap-4">
          <div class="flex flex-col gap-1">
            <h1 class="text-[#121317] dark:text-white tracking-tight text-[32px] font-bold leading-tight">انتخاب نوع سرویس</h1>
            <p class="text-[#666e85] dark:text-gray-400 text-sm font-normal leading-normal">لطفاً دسته‌بندی سرویس مورد نظر خود را انتخاب کنید</p>
          </div>
          <div class="flex items-center gap-2 bg-white dark:bg-gray-800 p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <span class="material-symbols-outlined text-gray-500 ms-2">directions_car</span>
            <span class="text-sm font-semibold text-slate-700 dark:text-gray-200 px-2 py-1">پژو ۲۰۶ تیپ ۵ - ۱۴۰۱</span>
          </div>
        </div>
        <div class="bg-white dark:bg-[#1A202C] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 sm:p-8">
          <div class="relative mb-6">
            <span class="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 material-symbols-outlined">search</span>
            <input class="w-full h-12 pr-12 pl-4 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary text-sm" placeholder="جستجوی سرویس..." type="text" />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="group cursor-pointer p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-200 flex items-center gap-4">
              <div class="size-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-2xl">oil_barrel</span>
              </div>
              <div class="flex flex-col">
                <h3 class="font-bold text-[#121317] dark:text-white group-hover:text-primary dark:group-hover:text-blue-400 transition-colors">روغن موتور</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">تعویض روغن و فیلترها</p>
              </div>
            </div>
            <div class="group cursor-pointer p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-200 flex items-center gap-4">
              <div class="size-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-2xl">tire_repair</span>
              </div>
              <div class="flex flex-col">
                <h3 class="font-bold text-[#121317] dark:text-white group-hover:text-primary dark:group-hover:text-blue-400 transition-colors">تایر و چرخ</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">تعویض، بالانس و پنچری</p>
              </div>
            </div>
            <div class="group cursor-pointer p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-200 flex items-center gap-4">
              <div class="size-12 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-2xl">battery_charging_full</span>
              </div>
              <div class="flex flex-col">
                <h3 class="font-bold text-[#121317] dark:text-white group-hover:text-primary dark:group-hover:text-blue-400 transition-colors">باتری و برق</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">باتری، دینام و سیستم برقی</p>
              </div>
            </div>
            <div class="group cursor-pointer p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-200 flex items-center gap-4">
              <div class="size-12 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-2xl">settings_b_roll</span>
              </div>
              <div class="flex flex-col">
                <h3 class="font-bold text-[#121317] dark:text-white group-hover:text-primary dark:group-hover:text-blue-400 transition-colors">گیربکس</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">روغن گیربکس و صفحه کلاچ</p>
              </div>
            </div>
            <div class="group cursor-pointer p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-200 flex items-center gap-4">
              <div class="size-12 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-2xl">security</span>
              </div>
              <div class="flex flex-col">
                <h3 class="font-bold text-[#121317] dark:text-white group-hover:text-primary dark:group-hover:text-blue-400 transition-colors">ترمز و ایمنی</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">لنت، دیسک و روغن ترمز</p>
              </div>
            </div>
            <div class="group cursor-pointer p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-200 flex items-center gap-4">
              <div class="size-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-2xl">ac_unit</span>
              </div>
              <div class="flex flex-col">
                <h3 class="font-bold text-[#121317] dark:text-white group-hover:text-primary dark:group-hover:text-blue-400 transition-colors">تهویه مطبوع</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">گاز کولر و بخاری</p>
              </div>
            </div>
            <div class="group cursor-pointer p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-200 flex items-center gap-4">
              <div class="size-12 rounded-lg bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-2xl">car_crash</span>
              </div>
              <div class="flex flex-col">
                <h3 class="font-bold text-[#121317] dark:text-white group-hover:text-primary dark:group-hover:text-blue-400 transition-colors">بدنه و ظاهر</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">کارواش، صافکاری و نقاشی</p>
              </div>
            </div>
            <div class="group cursor-pointer p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-200 flex items-center gap-4">
              <div class="size-12 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-2xl">assignment</span>
              </div>
              <div class="flex flex-col">
                <h3 class="font-bold text-[#121317] dark:text-white group-hover:text-primary dark:group-hover:text-blue-400 transition-colors">بیمه و مدارک</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">بیمه شخص ثالث و بدنه</p>
              </div>
            </div>
            <div class="group cursor-pointer p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-200 flex items-center gap-4">
              <div class="size-12 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-2xl">more_horiz</span>
              </div>
              <div class="flex flex-col">
                <h3 class="font-bold text-[#121317] dark:text-white group-hover:text-primary dark:group-hover:text-blue-400 transition-colors">سایر موارد</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">سرویس‌های متفرقه</p>
              </div>
            </div>
          </div>
          <div class="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end">
            <button class="px-6 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              بازگشت
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
