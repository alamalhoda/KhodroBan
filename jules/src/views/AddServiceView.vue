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
            <h1 class="text-[#121317] dark:text-white tracking-tight text-[32px] font-bold leading-tight">ثبت فعالیت جدید</h1>
            <p class="text-[#666e85] dark:text-gray-400 text-sm font-normal leading-normal">ثبت سرویس یا هزینه جدید برای خودروی شما</p>
          </div>
          <div class="flex items-center gap-2 bg-white dark:bg-gray-800 p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <span class="material-symbols-outlined text-gray-500 ms-2">directions_car</span>
            <select class="bg-transparent border-none text-sm font-semibold text-slate-700 dark:text-gray-200 focus:ring-0 cursor-pointer pe-8 ps-2 py-1 bg-[position:left_0.5rem_center]">
              <option>پژو ۲۰۶ تیپ ۵ - ۱۴۰۱</option>
              <option>هیوندای سانتافه ۲۰۱۷</option>
              <option>پراید ۱۳۱ مدل ۹۸</option>
            </select>
          </div>
        </div>
        <div class="bg-white dark:bg-[#1A202C] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div class="flex border-b border-[#dcdfe4] dark:border-gray-700">
            <button class="flex-1 flex flex-col items-center justify-center border-b-[3px] border-b-primary text-primary dark:text-blue-400 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[20px]">build</span>
                <p class="text-sm font-bold leading-normal tracking-[0.015em]">سرویس دوره‌ای</p>
              </div>
            </button>
            <button class="flex-1 flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#666e85] dark:text-gray-400 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[20px]">receipt_long</span>
                <p class="text-sm font-bold leading-normal tracking-[0.015em]">هزینه جانبی</p>
              </div>
            </button>
          </div>
          <div class="p-6 sm:p-8 space-y-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label class="flex flex-col gap-2">
                <span class="text-[#121317] dark:text-gray-200 text-sm font-medium leading-normal">تاریخ انجام</span>
                <div class="relative">
                  <input class="form-input w-full rounded-xl border border-[#dcdfe4] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#121317] dark:text-white h-12 px-4 focus:border-primary focus:ring-1 focus:ring-primary transition-shadow text-end" type="date" value="2023-10-27" />
                </div>
              </label>
              <label class="flex flex-col gap-2">
                <span class="text-[#121317] dark:text-gray-200 text-sm font-medium leading-normal">کارکرد فعلی (کیلومتر)</span>
                <div class="relative">
                  <input class="form-input w-full rounded-xl border border-[#dcdfe4] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#121317] dark:text-white h-12 pe-4 ps-12 focus:border-primary focus:ring-1 focus:ring-primary transition-shadow dir-ltr text-right" placeholder="مثال: ۵۴,۲۰۰" type="number" />
                  <span class="absolute left-4 top-3 text-gray-400 text-sm">km</span>
                </div>
              </label>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <label class="flex flex-col gap-2 md:col-span-2">
                <span class="text-[#121317] dark:text-gray-200 text-sm font-medium leading-normal">نوع سرویس</span>
                <select class="form-select w-full rounded-xl border border-[#dcdfe4] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#121317] dark:text-white h-12 px-4 focus:border-primary focus:ring-1 focus:ring-primary transition-shadow bg-[position:left_0.5rem_center] ps-4 pe-10">
                  <option disabled selected value="">انتخاب نوع سرویس...</option>
                  <option value="oil">تعویض روغن موتور</option>
                  <option value="tire">تایر و بالانس</option>
                  <option value="battery">باتری و دینام</option>
                  <option value="brake">لنت ترمز</option>
                  <option value="inspection">معاینه فنی</option>
                  <option value="other">سایر</option>
                </select>
              </label>
              <label class="flex flex-col gap-2">
                <span class="text-[#121317] dark:text-gray-200 text-sm font-medium leading-normal">مبلغ کل</span>
                <div class="relative">
                  <span class="absolute left-4 top-3 text-gray-500 dark:text-gray-400 text-sm font-medium">تومان</span>
                  <input class="form-input w-full rounded-xl border border-[#dcdfe4] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#121317] dark:text-white h-12 pe-4 ps-16 focus:border-primary focus:ring-1 focus:ring-primary transition-shadow dir-ltr text-right" placeholder="۰" type="number" />
                </div>
              </label>
            </div>
            <div class="space-y-6">
              <label class="flex flex-col gap-2">
                <span class="text-[#121317] dark:text-gray-200 text-sm font-medium leading-normal">نام تعمیرگاه / سرویس‌کار <span class="text-gray-400 font-normal">(اختیاری)</span></span>
                <div class="relative">
                  <span class="material-symbols-outlined absolute start-4 top-3 text-gray-400 text-[20px]">storefront</span>
                  <input class="form-input w-full rounded-xl border border-[#dcdfe4] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#121317] dark:text-white h-12 ps-11 pe-4 focus:border-primary focus:ring-1 focus:ring-primary transition-shadow" placeholder="مثال: اتوسرویس مرکزی" type="text" />
                </div>
              </label>
              <label class="flex flex-col gap-2">
                <span class="text-[#121317] dark:text-gray-200 text-sm font-medium leading-normal">توضیحات تکمیلی</span>
                <textarea class="form-textarea w-full rounded-xl border border-[#dcdfe4] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#121317] dark:text-white min-h-[100px] p-4 focus:border-primary focus:ring-1 focus:ring-primary transition-shadow resize-y" placeholder="جزئیات بیشتر درباره سرویس انجام شده..."></textarea>
              </label>
            </div>
            <div class="h-px w-full bg-[#f1f1f4] dark:bg-gray-700"></div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div class="flex flex-col gap-3">
                <div class="flex justify-between items-center">
                  <span class="text-[#121317] dark:text-gray-200 text-sm font-medium leading-normal">تصویر فاکتور / رسید</span>
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r from-amber-200 to-yellow-400 text-yellow-900 uppercase tracking-wider">حرفه‌ای</span>
                </div>
                <div class="border-2 border-dashed border-[#dcdfe4] dark:border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group">
                  <div class="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
                    <span class="material-symbols-outlined text-primary dark:text-blue-400">cloud_upload</span>
                  </div>
                  <p class="text-sm text-[#121317] dark:text-gray-300 font-medium">برای آپلود کلیک کنید</p>
                  <p class="text-xs text-[#666e85] dark:text-gray-500 mt-1">فرمت‌های JPG، PNG یا PDF (حداکثر ۵ مگابایت)</p>
                </div>
              </div>
              <div class="flex flex-col gap-4">
                <div class="flex items-center justify-between">
                  <div class="flex flex-col">
                    <span class="text-[#121317] dark:text-gray-200 text-sm font-medium leading-normal">تنظیم یادآور</span>
                    <span class="text-xs text-[#666e85] dark:text-gray-500">برای سرویس بعدی به من یادآوری کن</span>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer" dir="ltr">
                    <input checked class="sr-only peer" type="checkbox" value="" />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div class="bg-background-light dark:bg-gray-800/50 p-4 rounded-lg flex flex-col gap-3 border border-transparent dark:border-gray-700">
                  <div class="flex items-center gap-2 text-sm text-[#121317] dark:text-gray-300">
                    <span class="material-symbols-outlined text-[18px] text-primary dark:text-blue-400">notifications_active</span>
                    <span>یادآوری بر اساس:</span>
                  </div>
                  <div class="flex gap-3">
                    <div class="flex-1">
                      <input class="w-full text-sm rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-slate-900 dark:text-white px-3 py-2" placeholder="۵۰۰۰" type="number" />
                      <span class="text-[10px] text-gray-500 uppercase font-semibold mt-1 block">کیلومتر کارکرد</span>
                    </div>
                    <div class="flex items-center text-gray-400 text-xs font-bold uppercase">یا</div>
                    <div class="flex-1">
                      <select class="w-full text-sm rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-slate-900 dark:text-white px-3 py-2 bg-[position:left_0.5rem_center]">
                        <option>۳ ماه</option>
                        <option selected>۶ ماه</option>
                        <option>۱ سال</option>
                      </select>
                      <span class="text-[10px] text-gray-500 uppercase font-semibold mt-1 block">زمان سپری شده</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="pt-4 flex flex-col sm:flex-row justify-end gap-4">
              <button class="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#dcdfe4] dark:border-gray-600 text-[#121317] dark:text-white font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" type="button">
                انصراف
              </button>
              <button class="w-full sm:w-auto px-8 py-3 rounded-xl bg-primary hover:bg-blue-900 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2" type="button">
                <span class="material-symbols-outlined text-[18px]">save</span>
                ثبت و ذخیره
              </button>
            </div>
          </div>
        </div>
        <div class="text-center py-4">
          <p class="text-sm text-gray-400 dark:text-gray-600">در انتخاب دسته‌بندی مشکل دارید؟ <a class="text-primary dark:text-blue-400 hover:underline" href="#">مشاهده راهنما</a></p>
        </div>
      </div>
    </main>
  </div>
</template>
