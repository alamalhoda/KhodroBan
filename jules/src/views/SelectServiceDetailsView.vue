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
      <div class="w-full max-w-[1200px] flex flex-col gap-6">
        <div class="flex flex-wrap justify-between items-end gap-4">
          <div class="flex flex-col gap-1">
            <h1 class="text-[#121317] dark:text-white tracking-tight text-[32px] font-bold leading-tight">انتخاب جزئیات سرویس</h1>
            <p class="text-[#666e85] dark:text-gray-400 text-sm font-normal leading-normal">دسته‌بندی و خدمات مورد نظر خود را انتخاب کنید</p>
          </div>
          <div class="flex items-center gap-2 bg-white dark:bg-gray-800 p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <span class="material-symbols-outlined text-gray-500 ms-2">directions_car</span>
            <span class="text-sm font-semibold text-slate-700 dark:text-gray-200 px-2 py-1">پژو ۲۰۶ تیپ ۵ - ۱۴۰۱</span>
          </div>
        </div>
        <div class="flex flex-col lg:flex-row gap-6 items-start">
          <aside class="w-full lg:w-1/4 shrink-0 flex flex-col gap-3">
            <h3 class="text-sm font-bold text-gray-500 dark:text-gray-400 px-2 mb-1">دسته‌بندی‌ها</h3>
            <button class="w-full group flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-[#1A202C] border-2 border-primary shadow-sm transition-all relative overflow-hidden">
              <div class="absolute inset-0 bg-blue-50 dark:bg-blue-900/10 opacity-100 transition-opacity"></div>
              <div class="relative z-10 size-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-xl">oil_barrel</span>
              </div>
              <span class="relative z-10 font-bold text-slate-800 dark:text-white text-base">روغن موتور</span>
              <span class="relative z-10 material-symbols-outlined mr-auto text-primary">chevron_left</span>
            </button>
            <button class="w-full group flex items-center gap-3 p-3 rounded-xl bg-transparent border border-transparent hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm text-gray-600 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-200 transition-all">
              <div class="size-10 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 flex items-center justify-center shrink-0 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                <span class="material-symbols-outlined text-xl">tire_repair</span>
              </div>
              <span class="font-medium text-base">تایر و چرخ</span>
            </button>
            <button class="w-full group flex items-center gap-3 p-3 rounded-xl bg-transparent border border-transparent hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm text-gray-600 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-200 transition-all">
              <div class="size-10 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 flex items-center justify-center shrink-0 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                <span class="material-symbols-outlined text-xl">battery_charging_full</span>
              </div>
              <span class="font-medium text-base">باتری و برق</span>
            </button>
            <button class="w-full group flex items-center gap-3 p-3 rounded-xl bg-transparent border border-transparent hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm text-gray-600 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-200 transition-all">
              <div class="size-10 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 flex items-center justify-center shrink-0 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 group-hover:text-slate-700 dark:group-hover:text-white transition-colors">
                <span class="material-symbols-outlined text-xl">settings_b_roll</span>
              </div>
              <span class="font-medium text-base">گیربکس</span>
            </button>
            <button class="w-full group flex items-center gap-3 p-3 rounded-xl bg-transparent border border-transparent hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm text-gray-600 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-200 transition-all">
              <div class="size-10 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 flex items-center justify-center shrink-0 group-hover:bg-green-100 dark:group-hover:bg-green-900/30 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                <span class="material-symbols-outlined text-xl">security</span>
              </div>
              <span class="font-medium text-base">ترمز و ایمنی</span>
            </button>
            <button class="w-full group flex items-center gap-3 p-3 rounded-xl bg-transparent border border-transparent hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm text-gray-600 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-200 transition-all">
              <div class="size-10 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 flex items-center justify-center shrink-0 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                <span class="material-symbols-outlined text-xl">ac_unit</span>
              </div>
              <span class="font-medium text-base">تهویه مطبوع</span>
            </button>
            <button class="w-full group flex items-center gap-3 p-3 rounded-xl bg-transparent border border-transparent hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm text-gray-600 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-200 transition-all">
              <div class="size-10 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 flex items-center justify-center shrink-0 group-hover:bg-teal-100 dark:group-hover:bg-teal-900/30 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                <span class="material-symbols-outlined text-xl">car_crash</span>
              </div>
              <span class="font-medium text-base">بدنه و ظاهر</span>
            </button>
          </aside>
          <section class="flex-1 w-full bg-white dark:bg-[#1A202C] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col">
            <div class="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span class="material-symbols-outlined text-orange-500">oil_barrel</span>
                  خدمات روغن موتور
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">آیتم‌های سرویس مورد نظر را انتخاب کنید</p>
              </div>
              <div class="relative w-full sm:w-64">
                <span class="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[20px]">search</span>
                <input class="w-full h-10 pr-10 pl-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all" placeholder="جستجو در خدمات..." type="text" />
              </div>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label class="cursor-pointer relative group">
                  <input checked class="peer sr-only" type="checkbox" />
                  <div class="h-full p-4 rounded-xl border-2 border-primary bg-blue-50/30 dark:bg-blue-900/10 dark:border-primary/50 flex items-start gap-4 transition-all">
                    <div class="flex-1">
                      <div class="flex items-center justify-between mb-1">
                        <h4 class="font-bold text-gray-900 dark:text-white">تعویض روغن موتور</h4>
                        <span class="text-primary dark:text-blue-400 material-symbols-outlined">check_circle</span>
                      </div>
                      <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">شامل تخلیه روغن قدیمی و تعویض با روغن جدید</p>
                    </div>
                  </div>
                </label>
                <label class="cursor-pointer relative group">
                  <input class="peer sr-only" type="checkbox" />
                  <div class="h-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary dark:hover:border-primary peer-checked:border-primary peer-checked:bg-blue-50/30 dark:peer-checked:bg-blue-900/10 flex items-start gap-4 transition-all">
                    <div class="flex-1">
                      <div class="flex items-center justify-between mb-1">
                        <h4 class="font-bold text-gray-900 dark:text-white">تعویض فیلتر روغن</h4>
                        <span class="text-gray-300 dark:text-gray-600 peer-checked:text-primary dark:peer-checked:text-blue-400 material-symbols-outlined">circle</span>
                      </div>
                      <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">پیشنهاد می‌شود با هر بار تعویض روغن انجام شود</p>
                    </div>
                  </div>
                </label>
                <label class="cursor-pointer relative group">
                  <input class="peer sr-only" type="checkbox" />
                  <div class="h-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary dark:hover:border-primary peer-checked:border-primary peer-checked:bg-blue-50/30 dark:peer-checked:bg-blue-900/10 flex items-start gap-4 transition-all">
                    <div class="flex-1">
                      <div class="flex items-center justify-between mb-1">
                        <h4 class="font-bold text-gray-900 dark:text-white">تعویض فیلتر هوا</h4>
                        <span class="text-gray-300 dark:text-gray-600 peer-checked:text-primary dark:peer-checked:text-blue-400 material-symbols-outlined">circle</span>
                      </div>
                      <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">برای بهبود مصرف سوخت و عملکرد موتور</p>
                    </div>
                  </div>
                </label>
                <label class="cursor-pointer relative group">
                  <input class="peer sr-only" type="checkbox" />
                  <div class="h-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary dark:hover:border-primary peer-checked:border-primary peer-checked:bg-blue-50/30 dark:peer-checked:bg-blue-900/10 flex items-start gap-4 transition-all">
                    <div class="flex-1">
                      <div class="flex items-center justify-between mb-1">
                        <h4 class="font-bold text-gray-900 dark:text-white">تعویض فیلتر کابین</h4>
                        <span class="text-gray-300 dark:text-gray-600 peer-checked:text-primary dark:peer-checked:text-blue-400 material-symbols-outlined">circle</span>
                      </div>
                      <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">جلوگیری از ورود گرد و غبار به اتاق خودرو</p>
                    </div>
                  </div>
                </label>
                <label class="cursor-pointer relative group">
                  <input class="peer sr-only" type="checkbox" />
                  <div class="h-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary dark:hover:border-primary peer-checked:border-primary peer-checked:bg-blue-50/30 dark:peer-checked:bg-blue-900/10 flex items-start gap-4 transition-all">
                    <div class="flex-1">
                      <div class="flex items-center justify-between mb-1">
                        <h4 class="font-bold text-gray-900 dark:text-white">تعویض صافی بنزین</h4>
                        <span class="text-gray-300 dark:text-gray-600 peer-checked:text-primary dark:peer-checked:text-blue-400 material-symbols-outlined">circle</span>
                      </div>
                      <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">هر ۲۰,۰۰۰ کیلومتر پیشنهاد می‌شود</p>
                    </div>
                  </div>
                </label>
                <label class="cursor-pointer relative group">
                  <input class="peer sr-only" type="checkbox" />
                  <div class="h-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary dark:hover:border-primary peer-checked:border-primary peer-checked:bg-blue-50/30 dark:peer-checked:bg-blue-900/10 flex items-start gap-4 transition-all">
                    <div class="flex-1">
                      <div class="flex items-center justify-between mb-1">
                        <h4 class="font-bold text-gray-900 dark:text-white">شستشوی موتور</h4>
                        <span class="text-gray-300 dark:text-gray-600 peer-checked:text-primary dark:peer-checked:text-blue-400 material-symbols-outlined">circle</span>
                      </div>
                      <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">شستشو با مواد نانو مخصوص موتور</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
            <div class="mt-auto p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 rounded-b-2xl flex justify-between items-center">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">۱ مورد انتخاب شده</span>
              <div class="flex gap-3">
                <button class="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  بازگشت
                </button>
                <button class="px-6 py-2.5 rounded-xl bg-primary hover:bg-blue-800 text-white font-medium shadow-md shadow-blue-500/20 transition-all flex items-center gap-2">
                  <span>مرحله بعد</span>
                  <span class="material-symbols-outlined text-lg rtl:rotate-180">arrow_forward</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>
