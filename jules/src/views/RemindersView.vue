<script setup>
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'
import Card from '../components/Card.vue'
</script>

<template>
  <div class="bg-background-light dark:bg-background-dark font-display text-[#121317] dark:text-white h-screen overflow-hidden selection:bg-primary selection:text-white">
    <div class="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
      <div class="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]"></div>
      <div class="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[120px]"></div>
    </div>
    <div class="flex h-full w-full">
      <Sidebar />
      <main class="flex-1 flex flex-col h-full overflow-hidden relative">
        <Header />
        <div class="flex-1 overflow-y-auto px-8 pb-8 pt-2">
          <div class="max-w-7xl mx-auto flex flex-col gap-6">
            <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white/30 dark:bg-black/10 p-4 rounded-2xl glass-panel">
              <div class="flex p-1 bg-gray-100 dark:bg-slate-800/80 rounded-xl overflow-x-auto max-w-full gap-1">
                <button class="px-5 py-2 rounded-lg bg-white dark:bg-slate-700 shadow-sm text-primary dark:text-white font-bold text-sm whitespace-nowrap">
                  همه یادآورها
                </button>
                <button class="px-5 py-2 rounded-lg hover:bg-white/50 dark:hover:bg-slate-700/50 text-[#666e85] dark:text-gray-400 font-medium text-sm transition-all whitespace-nowrap flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-red-500"></span>
                  معوقه
                </button>
                <button class="px-5 py-2 rounded-lg hover:bg-white/50 dark:hover:bg-slate-700/50 text-[#666e85] dark:text-gray-400 font-medium text-sm transition-all whitespace-nowrap flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-yellow-500"></span>
                  نزدیک به موعد
                </button>
                <button class="px-5 py-2 rounded-lg hover:bg-white/50 dark:hover:bg-slate-700/50 text-[#666e85] dark:text-gray-400 font-medium text-sm transition-all whitespace-nowrap">
                  فعال
                </button>
              </div>
              <div class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <div class="relative min-w-[160px]">
                  <button class="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-gray-700 text-[#121317] dark:text-white text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-all">
                    <div class="flex items-center gap-2">
                      <span class="material-symbols-outlined text-gray-500">directions_car</span>
                      همه خودروها
                    </div>
                    <span class="material-symbols-outlined text-gray-400 text-sm">expand_more</span>
                  </button>
                </div>
                <button class="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary-light transition-all shadow-lg shadow-primary/20 whitespace-nowrap">
                  <span class="material-symbols-outlined text-[18px]">add_alert</span>
                  <span>افزودن یادآور</span>
                </button>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <Card class="border-r-4 border-r-red-500">
                <div class="flex justify-between items-start mb-4">
                  <div class="flex gap-3">
                    <div class="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400 shadow-inner">
                      <span class="material-symbols-outlined text-[24px]">oil_barrel</span>
                    </div>
                    <div>
                      <h4 class="font-bold text-lg text-[#121317] dark:text-white">تعویض روغن موتور</h4>
                      <p class="text-xs font-medium text-[#666e85] flex items-center gap-1">
                        پژو ۲۰۷
                        <span class="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span class="font-mono">۶۸ل۳۴۵</span>
                      </p>
                    </div>
                  </div>
                  <button class="text-gray-400 hover:text-primary p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <span class="material-symbols-outlined">more_vert</span>
                  </button>
                </div>
                <div class="flex items-center gap-2 mb-4 bg-red-50 dark:bg-red-900/10 p-3 rounded-xl border border-red-100 dark:border-red-900/30">
                  <span class="material-symbols-outlined text-red-500 text-[20px]">warning</span>
                  <div>
                    <p class="text-xs text-red-600 dark:text-red-400 font-bold uppercase tracking-wider">فوری</p>
                    <p class="text-sm font-medium text-[#121317] dark:text-white">گذشته از موعد: <span class="text-red-600 font-bold">۴۵۰ کیلومتر</span></p>
                  </div>
                </div>
                <div class="mt-auto">
                  <div class="flex justify-between text-xs mb-1.5 text-[#666e85]">
                    <span>هدف: ۱۲۵،۰۰۰ کیلومتر</span>
                    <span class="font-bold text-red-600">۱۰۵٪</span>
                  </div>
                  <div class="w-full bg-gray-100 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden mb-5">
                    <div class="bg-red-500 h-full rounded-full striped-bar" style="width: 100%"></div>
                  </div>
                  <div class="flex gap-3">
                    <button class="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-bold text-[#666e85] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                      <span class="material-symbols-outlined text-[18px]">edit</span>
                      ویرایش
                    </button>
                    <button class="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-light transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                      <span class="material-symbols-outlined text-[18px]">check</span>
                      انجام شد
                    </button>
                  </div>
                </div>
              </Card>
              <Card class="border-r-4 border-r-yellow-500">
                <div class="flex justify-between items-start mb-4">
                  <div class="flex gap-3">
                    <div class="w-12 h-12 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center text-yellow-600 dark:text-yellow-400 shadow-inner">
                      <span class="material-symbols-outlined text-[24px]">verified_user</span>
                    </div>
                    <div>
                      <h4 class="font-bold text-lg text-[#121317] dark:text-white">تمدید بیمه شخص ثالث</h4>
                      <p class="text-xs font-medium text-[#666e85] flex items-center gap-1">
                        سانتافه
                        <span class="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span class="font-mono">۱۲ب۹۹۱</span>
                      </p>
                    </div>
                  </div>
                  <button class="text-gray-400 hover:text-primary p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <span class="material-symbols-outlined">more_vert</span>
                  </button>
                </div>
                <div class="flex items-center gap-2 mb-4 bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-xl border border-yellow-100 dark:border-yellow-900/30">
                  <span class="material-symbols-outlined text-yellow-600 text-[20px]">schedule</span>
                  <div>
                    <p class="text-xs text-yellow-700 dark:text-yellow-500 font-bold uppercase tracking-wider">نزدیک به موعد</p>
                    <p class="text-sm font-medium text-[#121317] dark:text-white">انقضا در <span class="text-yellow-600 font-bold">۱۵ روز</span></p>
                  </div>
                </div>
                <div class="mt-auto">
                  <div class="flex justify-between text-xs mb-1.5 text-[#666e85]">
                    <span>۲۴ آبان ۱۴۰۲</span>
                    <span class="font-bold text-yellow-600">۹۰٪</span>
                  </div>
                  <div class="w-full bg-gray-100 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden mb-5">
                    <div class="bg-yellow-500 h-full rounded-full" style="width: 90%"></div>
                  </div>
                  <div class="flex gap-3">
                    <button class="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-bold text-[#666e85] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                      <span class="material-symbols-outlined text-[18px]">edit</span>
                      ویرایش
                    </button>
                    <button class="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-light transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                      <span class="material-symbols-outlined text-[18px]">check</span>
                      تمدید
                    </button>
                  </div>
                </div>
              </Card>
              <Card class="border-r-4 border-r-blue-500">
                <div class="flex justify-between items-start mb-4">
                  <div class="flex gap-3">
                    <div class="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner">
                      <span class="material-symbols-outlined text-[24px]">tire_repair</span>
                    </div>
                    <div>
                      <h4 class="font-bold text-lg text-[#121317] dark:text-white">جابجایی لاستیک‌ها</h4>
                      <p class="text-xs font-medium text-[#666e85] flex items-center gap-1">
                        پژو ۲۰۷
                        <span class="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span class="font-mono">۶۸ل۳۴۵</span>
                      </p>
                    </div>
                  </div>
                  <button class="text-gray-400 hover:text-primary p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <span class="material-symbols-outlined">more_vert</span>
                  </button>
                </div>
                <div class="flex items-center gap-2 mb-4 bg-blue-50 dark:bg-blue-900/10 p-3 rounded-xl border border-blue-100 dark:border-blue-900/30">
                  <span class="material-symbols-outlined text-blue-500 text-[20px]">check_circle</span>
                  <div>
                    <p class="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">فعال</p>
                    <p class="text-sm font-medium text-[#121317] dark:text-white"><span class="font-bold">۴،۰۰۰ کیلومتر</span> باقی‌مانده</p>
                  </div>
                </div>
                <div class="mt-auto">
                  <div class="flex justify-between text-xs mb-1.5 text-[#666e85]">
                    <span>هدف: ۱۳۰،۰۰۰ کیلومتر</span>
                    <span class="font-bold text-blue-600">۶۰٪</span>
                  </div>
                  <div class="w-full bg-gray-100 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden mb-5">
                    <div class="bg-blue-500 h-full rounded-full" style="width: 60%"></div>
                  </div>
                  <div class="flex gap-3">
                    <button class="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-bold text-[#666e85] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                      <span class="material-symbols-outlined text-[18px]">edit</span>
                      ویرایش
                    </button>
                    <button class="flex-1 py-2.5 rounded-xl text-primary bg-primary/10 hover:bg-primary/20 text-sm font-bold transition-colors flex items-center justify-center gap-2">
                      <span class="material-symbols-outlined text-[18px]">check</span>
                      زودتر
                    </button>
                  </div>
                </div>
              </Card>
              <Card class="border-r-4 border-r-purple-500">
                <div class="flex justify-between items-start mb-4">
                  <div class="flex gap-3">
                    <div class="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-inner">
                      <span class="material-symbols-outlined text-[24px]">battery_charging_full</span>
                    </div>
                    <div>
                      <h4 class="font-bold text-lg text-[#121317] dark:text-white">بررسی باتری</h4>
                      <p class="text-xs font-medium text-[#666e85] flex items-center gap-1">
                        سانتافه
                        <span class="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span class="font-mono">۱۲ب۹۹۱</span>
                      </p>
                    </div>
                  </div>
                  <button class="text-gray-400 hover:text-primary p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <span class="material-symbols-outlined">more_vert</span>
                  </button>
                </div>
                <div class="flex items-center gap-2 mb-4 bg-purple-50 dark:bg-purple-900/10 p-3 rounded-xl border border-purple-100 dark:border-purple-900/30">
                  <span class="material-symbols-outlined text-purple-500 text-[20px]">calendar_month</span>
                  <div>
                    <p class="text-xs text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider">زمان‌بندی شده</p>
                    <p class="text-sm font-medium text-[#121317] dark:text-white"><span class="font-bold">۲ ماه</span> باقی‌مانده</p>
                  </div>
                </div>
                <div class="mt-auto">
                  <div class="flex justify-between text-xs mb-1.5 text-[#666e85]">
                    <span>آخرین بازدید: دی ۱۴۰۱</span>
                    <span class="font-bold text-purple-600">۳۰٪</span>
                  </div>
                  <div class="w-full bg-gray-100 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden mb-5">
                    <div class="bg-purple-500 h-full rounded-full" style="width: 30%"></div>
                  </div>
                  <div class="flex gap-3">
                    <button class="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-bold text-[#666e85] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                      <span class="material-symbols-outlined text-[18px]">edit</span>
                      ویرایش
                    </button>
                    <button class="flex-1 py-2.5 rounded-xl text-primary bg-primary/10 hover:bg-primary/20 text-sm font-bold transition-colors flex items-center justify-center gap-2">
                      <span class="material-symbols-outlined text-[18px]">check</span>
                      انجام شد
                    </button>
                  </div>
                </div>
              </Card>
              <Card class="border-r-4 border-r-gray-300 dark:border-r-gray-600 opacity-80 hover:opacity-100">
                <div class="flex justify-between items-start mb-4">
                  <div class="flex gap-3">
                    <div class="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 shadow-inner">
                      <span class="material-symbols-outlined text-[24px]">construction</span>
                    </div>
                    <div>
                      <h4 class="font-bold text-lg text-[#121317] dark:text-white">تعویض تسمه تایم</h4>
                      <p class="text-xs font-medium text-[#666e85] flex items-center gap-1">
                        پژو ۲۰۷
                        <span class="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span class="font-mono">۶۸ل۳۴۵</span>
                      </p>
                    </div>
                  </div>
                  <button class="text-gray-400 hover:text-primary p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <span class="material-symbols-outlined">more_vert</span>
                  </button>
                </div>
                <div class="flex items-center gap-2 mb-4 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                  <span class="material-symbols-outlined text-gray-400 text-[20px]">upcoming</span>
                  <div>
                    <p class="text-xs text-gray-500 font-bold uppercase tracking-wider">طولانی مدت</p>
                    <p class="text-sm font-medium text-[#121317] dark:text-white"><span class="font-bold">۲۵،۰۰۰ کیلومتر</span> باقی‌مانده</p>
                  </div>
                </div>
                <div class="mt-auto">
                  <div class="flex justify-between text-xs mb-1.5 text-[#666e85]">
                    <span>هدف: ۱۵۰،۰۰۰ کیلومتر</span>
                    <span class="font-bold text-gray-500">۱۵٪</span>
                  </div>
                  <div class="w-full bg-gray-100 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden mb-5">
                    <div class="bg-gray-400 h-full rounded-full" style="width: 15%"></div>
                  </div>
                  <div class="flex gap-3">
                    <button class="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-bold text-[#666e85] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                      <span class="material-symbols-outlined text-[18px]">edit</span>
                      ویرایش
                    </button>
                    <button class="flex-1 py-2.5 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-gray-400 text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      جزئیات
                    </button>
                  </div>
                </div>
              </Card>
              <div class="p-5 rounded-2xl border-2 border-dashed border-primary/30 dark:border-primary/20 hover:border-primary hover:bg-primary/5 transition-all group flex flex-col h-full items-center justify-center cursor-pointer min-h-[300px]">
                <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  <span class="material-symbols-outlined text-[32px]">add_alert</span>
                </div>
                <h4 class="font-bold text-lg text-primary">ایجاد یادآور جدید</h4>
                <p class="text-sm text-[#666e85] text-center mt-2 px-8">تنظیم هشدارهای سفارشی برای کیلومتر یا تاریخ</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
