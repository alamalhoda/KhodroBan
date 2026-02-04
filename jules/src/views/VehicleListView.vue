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
          <a class="text-primary dark:text-blue-400 font-bold text-sm leading-normal transition-colors" href="#">خودروها</a>
          <a class="text-[#121317] dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 text-sm font-medium leading-normal transition-colors" href="#">گزارش‌ها</a>
        </nav>
        <div class="h-8 w-[1px] bg-gray-200 dark:bg-gray-700 hidden md:block"></div>
        <div class="flex items-center gap-3">
          <div class="hidden sm:flex flex-col items-end">
            <span class="text-sm font-semibold dark:text-white">امیرحسین رضایی</span>
            <span class="text-xs text-gray-500 dark:text-gray-400">طرح رایگان</span>
          </div>
          <div class="bg-center bg-no-repeat bg-cover rounded-full size-10 ring-2 ring-white dark:ring-gray-800 shadow-sm" data-alt="User profile avatar" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCIlggVSiSEjowXShmlBOMiJpm3691nnKwqshmId0bNFRe8rFFsivfCXxRDq_VEbZxJ7i8qvc_Nmmlcp9sE5-WE6ZkX4_3mA1CyJBoV3DQuTJH-Vb-_fOgKQBc1Hf9MrMYnt0GQ1I_XS_6f_4emIHw0ATsHs2YaQXJH5KwanY48_6-Lit_0R_qjSeEpTNeMYSGD-q00G1L7mz-uBqeRYJubAzGNMVTVNrSdGHnXz-0Eq04m0su5ZHRH7Z-BpUo_LF74VbTzlkepb68");'></div>
        </div>
      </div>
    </header>
    <main class="flex-grow flex justify-center py-6 px-4 sm:px-6 lg:px-8">
      <div class="w-full max-w-[1100px] flex flex-col gap-8">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div class="flex flex-col gap-1">
            <h1 class="text-[#121317] dark:text-white tracking-tight text-[28px] md:text-[32px] font-bold leading-tight">مدیریت خودروها</h1>
            <p class="text-[#666e85] dark:text-gray-400 text-sm font-normal leading-normal">مدیریت لیست خودروها، پیگیری کارکرد و وضعیت سرویس‌ها</p>
          </div>
          <button class="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400">
            <span class="material-symbols-outlined text-[20px]">add_circle</span>
            <span class="font-bold text-sm">افزودن خودرو جدید</span>
          </button>
        </div>
        <div class="w-full bg-white dark:bg-[#1A202C] rounded-xl border border-blue-100 dark:border-gray-700 p-4 md:px-6 md:py-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm relative overflow-hidden">
          <div class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-primary"></div>
          <div class="flex items-center gap-3 w-full md:w-auto">
            <div class="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg text-primary dark:text-blue-400">
              <span class="material-symbols-outlined">inventory_2</span>
            </div>
            <div class="flex flex-col">
              <span class="text-sm font-bold text-[#121317] dark:text-white">وضعیت طرح رایگان</span>
              <span class="text-xs text-gray-500 dark:text-gray-400">شما از ۲ خودرو از ۳ خودروی مجاز استفاده کرده‌اید.</span>
            </div>
          </div>
          <div class="flex items-center gap-4 w-full md:w-auto flex-1 md:max-w-xs">
            <div class="flex-1 h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div class="h-full bg-primary w-[66%] rounded-full relative">
                <div class="absolute inset-0 bg-white/20 animate-[pulse_2s_infinite]"></div>
              </div>
            </div>
            <span class="text-xs font-bold text-primary dark:text-blue-400 whitespace-nowrap">۶۶٪ پر شده</span>
          </div>
          <a class="text-xs font-bold text-primary dark:text-blue-400 hover:text-primary-hover dark:hover:text-blue-300 underline underline-offset-4 cursor-pointer whitespace-nowrap hidden md:block" href="#">
            ارتقا به طرح حرفه‌ای
          </a>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="group bg-white dark:bg-[#1A202C] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
            <div class="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
            <div class="p-5 flex flex-col gap-4">
              <div class="flex justify-between items-start">
                <div class="flex items-center gap-3">
                  <div class="size-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300">
                    <span class="material-symbols-outlined text-[28px]">directions_car</span>
                  </div>
                  <div>
                    <h3 class="font-bold text-lg text-[#121317] dark:text-white leading-tight">پژو ۲۰۶ تیپ ۵</h3>
                    <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">مدل ۱۴۰۱</span>
                  </div>
                </div>
                <div class="flex gap-1">
                  <button class="p-1.5 text-gray-400 hover:text-primary dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" title="ویرایش">
                    <span class="material-symbols-outlined text-[20px]">edit</span>
                  </button>
                  <button class="p-1.5 text-gray-400 hover:text-danger transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20" title="حذف">
                    <span class="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </div>
              <div class="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                <span class="material-symbols-outlined text-gray-400 text-[20px]">speed</span>
                <div class="flex flex-col">
                  <span class="text-[10px] uppercase text-gray-400 font-bold tracking-wider">کارکرد فعلی</span>
                  <span class="text-sm font-bold text-[#121317] dark:text-white dir-ltr text-right font-mono">54,200 km</span>
                </div>
              </div>
              <div class="flex items-center justify-between mt-1">
                <span class="text-xs font-medium text-gray-500 dark:text-gray-400">وضعیت سرویس:</span>
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                  <span class="size-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  عادی
                </span>
              </div>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800/30 px-5 py-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <span class="text-xs text-gray-500">آخرین سرویس: تعویض روغن</span>
              <span class="text-xs font-medium text-[#121317] dark:text-gray-300">۲ هفته پیش</span>
            </div>
          </div>
          <div class="group bg-white dark:bg-[#1A202C] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
            <div class="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-amber-300 to-amber-500"></div>
            <div class="p-5 flex flex-col gap-4">
              <div class="flex justify-between items-start">
                <div class="flex items-center gap-3">
                  <div class="size-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300">
                    <span class="material-symbols-outlined text-[28px]">airport_shuttle</span>
                  </div>
                  <div>
                    <h3 class="font-bold text-lg text-[#121317] dark:text-white leading-tight">هیوندای سانتافه</h3>
                    <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">مدل ۲۰۱۷</span>
                  </div>
                </div>
                <div class="flex gap-1">
                  <button class="p-1.5 text-gray-400 hover:text-primary dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" title="ویرایش">
                    <span class="material-symbols-outlined text-[20px]">edit</span>
                  </button>
                  <button class="p-1.5 text-gray-400 hover:text-danger transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20" title="حذف">
                    <span class="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </div>
              <div class="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                <span class="material-symbols-outlined text-gray-400 text-[20px]">speed</span>
                <div class="flex flex-col">
                  <span class="text-[10px] uppercase text-gray-400 font-bold tracking-wider">کارکرد فعلی</span>
                  <span class="text-sm font-bold text-[#121317] dark:text-white dir-ltr text-right font-mono">118,500 km</span>
                </div>
              </div>
              <div class="flex items-center justify-between mt-1">
                <span class="text-xs font-medium text-gray-500 dark:text-gray-400">وضعیت سرویس:</span>
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                  <span class="size-1.5 rounded-full bg-amber-500"></span>
                  نزدیک سرویس
                </span>
              </div>
            </div>
            <div class="bg-amber-50 dark:bg-amber-900/10 px-5 py-3 border-t border-amber-100 dark:border-amber-900/30 flex justify-between items-center">
              <span class="text-xs text-amber-700 dark:text-amber-500 font-medium flex items-center gap-1">
                <span class="material-symbols-outlined text-[16px]">warning</span>
                بیمه شخص ثالث
              </span>
              <span class="text-xs font-bold text-amber-700 dark:text-amber-500">۱۰ روز مانده</span>
            </div>
          </div>
          <button class="group relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 p-5 text-center hover:border-primary dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all duration-300 min-h-[240px]">
            <div class="flex size-16 items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
              <span class="material-symbols-outlined text-3xl text-gray-400 group-hover:text-primary dark:group-hover:text-blue-400">add</span>
            </div>
            <div class="space-y-1">
              <h3 class="font-bold text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-blue-400 transition-colors">افزودن خودرو جدید</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 max-w-[200px] mx-auto">یک جایگاه خالی باقی مانده است</p>
            </div>
          </button>
        </div>
        <div class="rounded-2xl bg-gradient-to-br from-primary to-blue-900 p-6 sm:p-10 text-white relative overflow-hidden shadow-lg mt-4">
          <div class="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
            <div class="absolute -top-[50%] -left-[20%] w-[500px] h-[500px] rounded-full bg-white blur-[100px]"></div>
            <div class="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-blue-400 blur-[80px]"></div>
          </div>
          <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="flex flex-col gap-2 text-center md:text-right">
              <h3 class="text-xl font-bold">ناوگان بزرگتری دارید؟</h3>
              <p class="text-blue-100 text-sm max-w-md leading-relaxed">با ارتقا به طرح سازمانی، بدون محدودیت خودرو اضافه کنید و از قابلیت‌های پیشرفته گزارش‌گیری بهره‌مند شوید.</p>
            </div>
            <button class="whitespace-nowrap rounded-xl bg-white/20 backdrop-blur-sm px-6 py-3 font-bold text-white shadow-lg hover:bg-white hover:text-primary transition-all duration-300 flex items-center gap-2 border border-white/30">
              <span class="material-symbols-outlined">diamond</span>
              مشاهده طرح‌های اشتراک
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
