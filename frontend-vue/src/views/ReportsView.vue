<script setup>
import MainLayout from '../components/MainLayout.vue'
</script>

<template>
  <MainLayout>
    <div class="flex flex-col gap-6">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div class="flex flex-wrap gap-2">
              <a class="text-[#666e85] dark:text-gray-400 hover:text-primary text-sm font-medium leading-normal" href="#">خانه</a>
              <span class="text-[#666e85] dark:text-gray-600 text-sm font-medium leading-normal">/</span>
              <span class="text-[#121317] dark:text-white text-sm font-medium leading-normal">گزارش‌ها</span>
            </div>
            <div class="flex gap-3">
              <div class="relative">
                <select class="appearance-none bg-white dark:bg-[#1e2330] border border-[#dcdfe4] dark:border-[#2a2f3d] text-[#121317] dark:text-white text-sm rounded-lg pl-3 pr-8 py-2 focus:ring-primary focus:border-primary text-right" dir="rtl">
                  <option>همه خودروها</option>
                  <option>۲۰۱۹ تویوتا کمری SE</option>
                  <option>۲۰۲۲ تسلا مدل ۳</option>
                </select>
                <span class="material-symbols-outlined absolute left-2 top-2.5 text-gray-500 pointer-events-none text-[20px]">expand_more</span>
              </div>
              <div class="relative">
                <select class="appearance-none bg-white dark:bg-[#1e2330] border border-[#dcdfe4] dark:border-[#2a2f3d] text-[#121317] dark:text-white text-sm rounded-lg pl-3 pr-8 py-2 focus:ring-primary focus:border-primary text-right" dir="rtl">
                  <option>۳۰ روز گذشته</option>
                  <option>امسال (تا امروز)</option>
                  <option>سال گذشته</option>
                </select>
                <span class="material-symbols-outlined absolute left-2 top-2.5 text-gray-500 pointer-events-none text-[20px]">calendar_today</span>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="glass-panel border border-[#dcdfe4] dark:border-[#2a2f3d] rounded-xl p-5 shadow-sm">
              <div class="flex justify-between items-start mb-4">
                <div class="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-primary">
                  <span class="material-symbols-outlined">payments</span>
                </div>
                <span class="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">+۱۲٪</span>
              </div>
              <p class="text-[#666e85] dark:text-gray-400 text-sm font-medium">کل هزینه‌ها</p>
              <h3 class="text-[#121317] dark:text-white text-2xl font-bold mt-1">۴,۲۵۰,۰۰۰ تومان</h3>
            </div>
            <div class="glass-panel border border-[#dcdfe4] dark:border-[#2a2f3d] rounded-xl p-5 shadow-sm">
              <div class="flex justify-between items-start mb-4">
                <div class="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600">
                  <span class="material-symbols-outlined">local_gas_station</span>
                </div>
                <span class="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">میانگین</span>
              </div>
              <p class="text-[#666e85] dark:text-gray-400 text-sm font-medium">هزینه سوخت</p>
              <h3 class="text-[#121317] dark:text-white text-2xl font-bold mt-1">۲,۱۴۵,۰۰۰ تومان</h3>
            </div>
            <div class="glass-panel border border-[#dcdfe4] dark:border-[#2a2f3d] rounded-xl p-5 shadow-sm">
              <div class="flex justify-between items-start mb-4">
                <div class="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600">
                  <span class="material-symbols-outlined">build</span>
                </div>
                <span class="text-xs font-bold text-red-600 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-full">+۵٪</span>
              </div>
              <p class="text-[#666e85] dark:text-gray-400 text-sm font-medium">سرویس و نگهداری</p>
              <h3 class="text-[#121317] dark:text-white text-2xl font-bold mt-1">۸۵۰,۰۰۰ تومان</h3>
            </div>
            <div class="glass-panel border border-[#dcdfe4] dark:border-[#2a2f3d] rounded-xl p-5 shadow-sm">
              <div class="flex justify-between items-start mb-4">
                <div class="p-2 bg-teal-50 dark:bg-teal-900/20 rounded-lg text-teal-600">
                  <span class="material-symbols-outlined">speed</span>
                </div>
              </div>
              <p class="text-[#666e85] dark:text-gray-400 text-sm font-medium">هزینه به ازای کیلومتر</p>
              <h3 class="text-[#121317] dark:text-white text-2xl font-bold mt-1">۲۴۰ تومان</h3>
            </div>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 glass-panel border border-[#dcdfe4] dark:border-[#2a2f3d] rounded-xl p-6 shadow-sm">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-[#121317] dark:text-white text-lg font-bold">روندهای ماهانه هزینه‌ها</h3>
                <button class="text-primary text-sm font-medium hover:underline">مشاهده جزئیات</button>
              </div>
              <div class="relative h-64 w-full flex items-end justify-between gap-2 md:gap-4 pt-8">
                <div class="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
                  <div class="w-full h-px bg-gray-100 dark:bg-gray-700 dashed border-t border-dashed border-gray-200 dark:border-gray-700"></div>
                  <div class="w-full h-px bg-gray-100 dark:bg-gray-700 dashed border-t border-dashed border-gray-200 dark:border-gray-700"></div>
                  <div class="w-full h-px bg-gray-100 dark:bg-gray-700 dashed border-t border-dashed border-gray-200 dark:border-gray-700"></div>
                  <div class="w-full h-px bg-gray-100 dark:bg-gray-700 dashed border-t border-dashed border-gray-200 dark:border-gray-700"></div>
                  <div class="w-full h-px bg-gray-200 dark:bg-gray-600"></div>
                </div>
                <div class="flex flex-col items-center flex-1 gap-2 z-10 group">
                  <div class="w-full max-w-[40px] bg-primary/20 dark:bg-primary/40 rounded-t-md hover:bg-primary/80 transition-colors relative flex items-end justify-center" style="height: 40%">
                    <div class="opacity-0 group-hover:opacity-100 absolute -top-8 bg-black text-white text-xs px-2 py-1 rounded transition-opacity whitespace-nowrap">۴۰۰</div>
                  </div>
                  <span class="text-xs text-gray-500 dark:text-gray-400">فروردین</span>
                </div>
                <div class="flex flex-col items-center flex-1 gap-2 z-10 group">
                  <div class="w-full max-w-[40px] bg-primary/20 dark:bg-primary/40 rounded-t-md hover:bg-primary/80 transition-colors relative flex items-end justify-center" style="height: 35%">
                    <div class="opacity-0 group-hover:opacity-100 absolute -top-8 bg-black text-white text-xs px-2 py-1 rounded transition-opacity whitespace-nowrap">۳۵۰</div>
                  </div>
                  <span class="text-xs text-gray-500 dark:text-gray-400">اردیبهشت</span>
                </div>
                <div class="flex flex-col items-center flex-1 gap-2 z-10 group">
                  <div class="w-full max-w-[40px] bg-primary/20 dark:bg-primary/40 rounded-t-md hover:bg-primary/80 transition-colors relative flex items-end justify-center" style="height: 55%">
                    <div class="opacity-0 group-hover:opacity-100 absolute -top-8 bg-black text-white text-xs px-2 py-1 rounded transition-opacity whitespace-nowrap">۵۵۰</div>
                  </div>
                  <span class="text-xs text-gray-500 dark:text-gray-400">خرداد</span>
                </div>
                <div class="flex flex-col items-center flex-1 gap-2 z-10 group">
                  <div class="w-full max-w-[40px] bg-primary/20 dark:bg-primary/40 rounded-t-md hover:bg-primary/80 transition-colors relative flex items-end justify-center" style="height: 45%">
                    <div class="opacity-0 group-hover:opacity-100 absolute -top-8 bg-black text-white text-xs px-2 py-1 rounded transition-opacity whitespace-nowrap">۴۵۰</div>
                  </div>
                  <span class="text-xs text-gray-500 dark:text-gray-400">تیر</span>
                </div>
                <div class="flex flex-col items-center flex-1 gap-2 z-10 group">
                  <div class="w-full max-w-[40px] bg-primary rounded-t-md shadow-lg relative flex items-end justify-center" style="height: 80%">
                    <div class="opacity-0 group-hover:opacity-100 absolute -top-8 bg-black text-white text-xs px-2 py-1 rounded transition-opacity whitespace-nowrap">۸۰۰</div>
                  </div>
                  <span class="text-xs text-gray-800 dark:text-gray-200 font-bold">مرداد</span>
                </div>
                <div class="flex flex-col items-center flex-1 gap-2 z-10 group">
                  <div class="w-full max-w-[40px] bg-primary/20 dark:bg-primary/40 rounded-t-md hover:bg-primary/80 transition-colors relative flex items-end justify-center" style="height: 30%">
                    <div class="opacity-0 group-hover:opacity-100 absolute -top-8 bg-black text-white text-xs px-2 py-1 rounded transition-opacity whitespace-nowrap">۳۰۰</div>
                  </div>
                  <span class="text-xs text-gray-500 dark:text-gray-400">شهریور</span>
                </div>
              </div>
            </div>
            <div class="lg:col-span-1 glass-panel border border-[#dcdfe4] dark:border-[#2a2f3d] rounded-xl p-6 shadow-sm flex flex-col">
              <h3 class="text-[#121317] dark:text-white text-lg font-bold mb-6">تفکیک هزینه‌ها</h3>
              <div class="flex flex-col gap-5 justify-center flex-1">
                <div>
                  <div class="flex justify-between text-sm mb-2">
                    <div class="flex items-center gap-2">
                      <div class="size-3 rounded-full bg-orange-500"></div>
                      <span class="text-gray-600 dark:text-gray-300">سوخت</span>
                    </div>
                    <span class="font-bold text-[#121317] dark:text-white">۵۰٪</span>
                  </div>
                  <div class="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                    <div class="bg-orange-500 h-2 rounded-full" style="width: 50%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-sm mb-2">
                    <div class="flex items-center gap-2">
                      <div class="size-3 rounded-full bg-blue-500"></div>
                      <span class="text-gray-600 dark:text-gray-300">سرویس</span>
                    </div>
                    <span class="font-bold text-[#121317] dark:text-white">۲۰٪</span>
                  </div>
                  <div class="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                    <div class="bg-blue-500 h-2 rounded-full" style="width: 20%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-sm mb-2">
                    <div class="flex items-center gap-2">
                      <div class="size-3 rounded-full bg-purple-500"></div>
                      <span class="text-gray-600 dark:text-gray-300">قطعات</span>
                    </div>
                    <span class="font-bold text-[#121317] dark:text-white">۱۵٪</span>
                  </div>
                  <div class="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                    <div class="bg-purple-500 h-2 rounded-full" style="width: 15%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-sm mb-2">
                    <div class="flex items-center gap-2">
                      <div class="size-3 rounded-full bg-green-500"></div>
                      <span class="text-gray-600 dark:text-gray-300">بیمه</span>
                    </div>
                    <span class="font-bold text-[#121317] dark:text-white">۱۰٪</span>
                  </div>
                  <div class="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                    <div class="bg-green-500 h-2 rounded-full" style="width: 10%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-sm mb-2">
                    <div class="flex items-center gap-2">
                      <div class="size-3 rounded-full bg-gray-400"></div>
                      <span class="text-gray-600 dark:text-gray-300">سایر</span>
                    </div>
                    <span class="font-bold text-[#121317] dark:text-white">۵٪</span>
                  </div>
                  <div class="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                    <div class="bg-gray-400 h-2 rounded-full" style="width: 5%"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 flex flex-col gap-4">
              <h3 class="text-[#121317] dark:text-white text-lg font-bold">هزینه‌های اخیر</h3>
              <div class="bg-white dark:bg-[#1e2330] rounded-xl border border-[#dcdfe4] dark:border-[#2a2f3d] shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-[#252a38]">
                      <tr>
                        <th class="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">تاریخ</th>
                        <th class="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">دسته‌بندی</th>
                        <th class="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">خودرو</th>
                        <th class="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">مبلغ</th>
                        <th class="relative px-6 py-3" scope="col"><span class="sr-only">عملیات</span></th>
                      </tr>
                    </thead>
                    <tbody class="bg-white dark:bg-[#1e2330] divide-y divide-gray-200 dark:divide-gray-700">
                      <tr>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium text-start">۴ خرداد ۱۴۰۳</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-start">
                          <div class="flex items-center gap-2">
                            <span class="material-symbols-outlined text-orange-500 text-[18px]">local_gas_station</span>
                            سوخت‌گیری
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-start">تویوتا کمری</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white text-start">۶۵,۰۰۰ تومان</td>
                        <td class="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                          <a class="text-gray-400 hover:text-primary" href="#"><span class="material-symbols-outlined">more_vert</span></a>
                        </td>
                      </tr>
                      <tr>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium text-start">۲۶ اردیبهشت ۱۴۰۳</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-start">
                          <div class="flex items-center gap-2">
                            <span class="material-symbols-outlined text-blue-500 text-[18px]">water_drop</span>
                            تعویض روغن
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-start">تویوتا کمری</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white text-start">۱۲۰,۰۰۰ تومان</td>
                        <td class="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                          <a class="text-gray-400 hover:text-primary" href="#"><span class="material-symbols-outlined">more_vert</span></a>
                        </td>
                      </tr>
                      <tr>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium text-start">۹ اردیبهشت ۱۴۰۳</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-start">
                          <div class="flex items-center gap-2">
                            <span class="material-symbols-outlined text-green-500 text-[18px]">verified_user</span>
                            بیمه
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-start">تسلا مدل ۳</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white text-start">۳۵۰,۰۰۰ تومان</td>
                        <td class="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                          <a class="text-gray-400 hover:text-primary" href="#"><span class="material-symbols-outlined">more_vert</span></a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="bg-gray-50 dark:bg-[#252a38] px-6 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <p class="text-sm text-gray-500 dark:text-gray-400">نمایش ۳ از ۴۸ رکورد</p>
                  <button class="text-sm text-primary font-medium hover:underline">مشاهده همه سوابق</button>
                </div>
              </div>
            </div>
            <div class="lg:col-span-1 flex flex-col gap-6">
              <h3 class="text-[#121317] dark:text-white text-lg font-bold">صادرات گزارش‌ها</h3>
              <div class="bg-white dark:bg-[#1e2330] rounded-xl border border-[#dcdfe4] dark:border-[#2a2f3d] shadow-sm p-5">
                <div class="flex items-center gap-3 mb-3">
                  <div class="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg text-green-700 dark:text-green-400">
                    <span class="material-symbols-outlined">table_view</span>
                  </div>
                  <div>
                    <h4 class="font-bold text-[#121317] dark:text-white">خروجی CSV</h4>
                    <p class="text-xs text-gray-500 dark:text-gray-400">فرمت صفحه گسترده پایه</p>
                  </div>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  دانلود لیست کاملی از هزینه‌های شما سازگار با اکسل و گوگل شیت.
                </p>
                <button class="w-full py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-[#121317] dark:text-white text-sm font-medium transition-colors flex items-center justify-center gap-2">
                  <span class="material-symbols-outlined text-[18px]">download</span>
                  دانلود CSV
                </button>
              </div>
              <div class="bg-gradient-to-br from-[#121620] to-[#1e3b8a] rounded-xl shadow-lg p-5 text-white relative overflow-hidden group">
                <div class="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-700"></div>
                <div class="relative z-10">
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-2 text-yellow-400">
                      <span class="material-symbols-outlined">star</span>
                      <span class="text-xs font-bold uppercase tracking-wider">Pro</span>
                    </div>
                    <span class="material-symbols-outlined text-white/50">lock</span>
                  </div>
                  <div class="flex items-center gap-3 mb-2">
                    <div class="bg-white/10 p-2 rounded-lg text-white">
                      <span class="material-symbols-outlined">picture_as_pdf</span>
                    </div>
                    <h4 class="font-bold text-white text-lg">گزارش‌های PDF</h4>
                  </div>
                  <p class="text-sm text-gray-300 mb-4">ایجاد گزارش‌های حرفه‌ای PDF مناسب برای ادعای بیمه یا فروش خودرو.</p>
                  <button class="w-full py-2.5 bg-white text-[#121620] text-sm font-bold rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                    ارتقا برای باز کردن قفل
                  </button>
                </div>
              </div>
            </div>
          </div>
    </div>
  </MainLayout>
</template>
