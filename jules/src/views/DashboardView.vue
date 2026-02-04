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
          <div class="max-w-7xl mx-auto flex flex-col gap-8">
            <section class="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-end">
              <div class="flex flex-col gap-2">
                <h1 class="text-3xl md:text-4xl font-black text-[#121317] dark:text-white tracking-tight">خوش آمدید، آرش 👋</h1>
                <p class="text-[#666e85] dark:text-gray-400 text-lg">شما <span class="text-primary font-bold">۲ وظیفه در انتظار</span> دارید که نیاز به توجه دارند.</p>
              </div>
              <div class="glass-panel p-2 rounded-2xl flex items-center gap-2 shadow-sm">
                <button class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#1e293b] hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-[#121317] dark:text-white border border-gray-100 dark:border-gray-700 shadow-sm group">
                  <span class="bg-primary/10 p-1.5 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <span class="material-symbols-outlined text-[18px]">build</span>
                  </span>
                  <span class="text-sm font-bold">افزودن سرویس</span>
                </button>
                <button class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#1e293b] hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-[#121317] dark:text-white border border-gray-100 dark:border-gray-700 shadow-sm group">
                  <span class="bg-green-500/10 p-1.5 rounded-lg text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                    <span class="material-symbols-outlined text-[18px]">attach_money</span>
                  </span>
                  <span class="text-sm font-bold">ثبت هزینه</span>
                </button>
                <button class="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-white hover:bg-primary-light shadow-lg shadow-primary/20 transition-all">
                  <span class="material-symbols-outlined">add</span>
                </button>
              </div>
            </section>
            <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div class="xl:col-span-2 flex flex-col gap-6">
                <Card class="p-6 rounded-2xl shadow-sm border border-primary/20 relative overflow-hidden bg-gradient-to-l from-primary/5 to-transparent">
                  <div class="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-white/20 to-transparent pointer-events-none"></div>
                  <div class="flex justify-between items-center mb-4 relative z-10">
                    <div class="flex items-center gap-3">
                      <div class="bg-blue-100 dark:bg-blue-900/30 p-2.5 rounded-xl text-primary">
                        <span class="material-symbols-outlined text-[24px]">next_plan</span>
                      </div>
                      <div>
                        <h3 class="text-lg font-bold text-[#121317] dark:text-white">سرویس بعدی سررسید</h3>
                        <p class="text-xs text-[#666e85]">بر اساس کیلومتر کارکرد تخمینی</p>
                      </div>
                    </div>
                    <span class="bg-blue-50 text-primary px-3 py-1 rounded-full text-xs font-bold border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800">۱۵ روز مانده</span>
                  </div>
                  <div class="flex flex-col md:flex-row gap-6 relative z-10">
                    <div class="flex-1">
                      <div class="flex justify-between items-end mb-2">
                        <span class="text-sm font-bold text-[#121317] dark:text-white">تعویض تسمه تایم</span>
                        <span class="text-xs text-[#666e85]">پژو ۲۰۷ • ۶۰,۰۰۰ کیلومتر</span>
                      </div>
                      <div class="w-full bg-gray-200 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden">
                        <div class="bg-primary h-full rounded-full" style="width: 85%"></div>
                      </div>
                      <div class="flex justify-between mt-2 text-xs text-[#666e85]">
                        <span>شروع: ۵۰,۰۰۰</span>
                        <span>هدف: ۶۰,۰۰۰</span>
                      </div>
                    </div>
                    <div class="md:border-r md:border-gray-200 dark:md:border-gray-700 md:pr-6 flex items-center gap-4">
                      <div class="text-center">
                        <p class="text-xs text-[#666e85] mb-1">هزینه تخمینی</p>
                        <p class="text-lg font-black text-[#121317] dark:text-white">۲,۵۰۰,۰۰۰ <span class="text-xs font-normal text-[#666e85]">تومان</span></p>
                      </div>
                      <button class="bg-primary hover:bg-primary-light text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors shadow-lg shadow-primary/20">
                        رزرو وقت
                      </button>
                    </div>
                  </div>
                </Card>
                <div class="flex flex-col gap-4">
                  <div class="flex items-center justify-between">
                    <h3 class="text-xl font-bold text-[#121317] dark:text-white flex items-center gap-2">
                      <span class="material-symbols-outlined text-orange-500">notifications_active</span>
                      یادآورهای فعال
                    </h3>
                    <a class="text-sm font-medium text-primary hover:underline" href="#">مشاهده همه</a>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card class="border-r-4 border-r-red-500">
                      <div class="flex justify-between items-start mb-3">
                        <div class="bg-red-50 dark:bg-red-900/20 p-2 rounded-lg text-red-600 dark:text-red-400">
                          <span class="material-symbols-outlined">oil_barrel</span>
                        </div>
                        <span class="text-xs font-bold text-red-500 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-full">فوری</span>
                      </div>
                      <h4 class="text-lg font-bold text-[#121317] dark:text-white mb-1">تعویض روغن موتور</h4>
                      <p class="text-sm text-[#666e85] dark:text-gray-400 mb-4">پژو ۲۰۷ • ۱۲۵,۴۰۰ کیلومتر</p>
                      <div class="flex items-center gap-2 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 p-2 rounded-lg">
                        <span class="material-symbols-outlined text-[16px]">warning</span>
                        <span>۴۰۰ کیلومتر گذشته</span>
                      </div>
                    </Card>
                    <Card class="border-r-4 border-r-yellow-500">
                      <div class="flex justify-between items-start mb-3">
                        <div class="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-lg text-yellow-600 dark:text-yellow-400">
                          <span class="material-symbols-outlined">health_and_safety</span>
                        </div>
                        <span class="text-xs font-bold text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-full">بزودی</span>
                      </div>
                      <h4 class="text-lg font-bold text-[#121317] dark:text-white mb-1">تمدید بیمه شخص ثالث</h4>
                      <p class="text-sm text-[#666e85] dark:text-gray-400 mb-4">هیوندای سانتافه • انقضا در ۱۵ روز</p>
                      <div class="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                        <div class="bg-yellow-500 h-full rounded-full" style="width: 75%"></div>
                      </div>
                      <p class="text-xs text-left mt-1 text-[#666e85]">۲ هفته باقی‌مانده</p>
                    </Card>
                  </div>
                </div>
                <div class="flex flex-col gap-4 mt-2">
                  <div class="flex items-center justify-between">
                    <h3 class="text-xl font-bold text-[#121317] dark:text-white flex items-center gap-2">
                      <span class="material-symbols-outlined text-primary">garage_home</span>
                      گاراژ من
                    </h3>
                    <button class="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                      <span class="material-symbols-outlined text-[18px]">add</span>
                      افزودن خودرو
                    </button>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card class="p-4 flex gap-4 items-center">
                      <div class="w-24 h-24 shrink-0 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden relative">
                        <div class="w-full h-full bg-center bg-cover" data-alt="White Peugeot 207 parked on a street" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuBnH0eDobq8QxdoQIqIs8Otc-HAXHrDKuszl9PWy3GMvchruv9wYXZM9nrpBxVeGD2rXjro5z-Ya95Camixwia8pZw4aTgbx5sTrAzHi3DmvWhTZhtmhGOI1i5wGUJNAE9b80laE7V0HkYxXS1ymucyhGz-8f7kXbsIrNVryWdh5jgsNT4wpqueteCUnZ3nSygiJDJZ_uNbssMw8pMkaKHSIZ-7sTShSOPd2JBoK0qbzO_EpbMlqloki26F2AYpXqZfdMwQyrGHbP8");'></div>
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex justify-between items-start">
                          <h4 class="text-lg font-bold text-[#121317] dark:text-white truncate">پژو ۲۰۷ آی</h4>
                          <span class="material-symbols-outlined text-gray-300 hover:text-primary cursor-pointer">more_vert</span>
                        </div>
                        <p class="text-sm text-[#666e85] dark:text-gray-400 mb-2">دنده‌ای • ۱۴۰۰</p>
                        <div class="flex items-center gap-2">
                          <div class="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-xs font-mono font-bold text-[#121317] dark:text-white" dir="ltr">
                            68 L 345 - 10
                          </div>
                          <span class="w-2 h-2 rounded-full bg-red-500" title="نیازمند توجه"></span>
                        </div>
                      </div>
                    </Card>
                    <Card class="p-4 flex gap-4 items-center">
                      <div class="w-24 h-24 shrink-0 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden relative">
                        <div class="w-full h-full bg-center bg-cover" data-alt="Silver SUV car side view" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDSFqRFpPt0H2j_ixx3r3MX77cg3jCdrXPMGypK-UKIEXYFOMLTeRextscIPVvuXRPKMFfdpjMtzYlTfZqTfBGSZ0U37HCfhS-H6X-o5bX8-HBTc2QKZCBSUSRlCTcdTpO9VqwWJfTxw5zOPJiQNVrI3n3dI_Qjn3kYCniSLCgOlv-ybX0u4eoxD4rPNEafJwNdujKzy9aqYfqmVsZHrucBdJLz_BN6h5hwQpmqi4ss2WfjqOCostnMPhGVHLTSOZhsfi6rc8xuROI");'></div>
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex justify-between items-start">
                          <h4 class="text-lg font-bold text-[#121317] dark:text-white truncate">هیوندای سانتافه</h4>
                          <span class="material-symbols-outlined text-gray-300 hover:text-primary cursor-pointer">more_vert</span>
                        </div>
                        <p class="text-sm text-[#666e85] dark:text-gray-400 mb-2">اتوماتیک • ۱۳۹۷</p>
                        <div class="flex items-center gap-2">
                          <div class="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-xs font-mono font-bold text-[#121317] dark:text-white" dir="ltr">
                            12 B 991 - 44
                          </div>
                          <span class="w-2 h-2 rounded-full bg-green-500" title="سالم"></span>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
              <div class="xl:col-span-1 flex flex-col gap-6">
                <Card class="p-6 rounded-3xl relative overflow-hidden">
                  <div class="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-10 -mt-10 blur-2xl pointer-events-none"></div>
                  <h3 class="text-lg font-bold text-[#121317] dark:text-white mb-4 flex items-center gap-2">
                    <span class="material-symbols-outlined text-gray-400">monitoring</span>
                    هزینه‌ها
                  </h3>
                  <div class="flex flex-col gap-1 mb-6">
                    <p class="text-sm text-[#666e85] dark:text-gray-400">مجموع این ماه</p>
                    <div class="flex items-baseline gap-1">
                      <span class="text-3xl font-black text-[#121317] dark:text-white tracking-tight">۴,۲۵۰,۰۰۰</span>
                      <span class="text-xs font-normal text-[#666e85] mr-1">تومان</span>
                      <span class="text-sm font-medium text-green-500 flex items-center mr-auto" dir="ltr">
                        <span class="material-symbols-outlined text-[16px]">arrow_downward</span>
                        12%
                      </span>
                    </div>
                  </div>
                  <div class="flex items-end gap-2 h-32 w-full mt-4" dir="ltr">
                    <div class="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                      <div class="w-full bg-primary/20 rounded-t-lg h-[40%] group-hover:bg-primary/40 transition-all relative">
                        <div class="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg transition-opacity">120</div>
                      </div>
                      <span class="text-xs text-[#666e85]">ش</span>
                    </div>
                    <div class="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                      <div class="w-full bg-primary/20 rounded-t-lg h-[65%] group-hover:bg-primary/40 transition-all relative"></div>
                      <span class="text-xs text-[#666e85]">ی</span>
                    </div>
                    <div class="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                      <div class="w-full bg-primary/20 rounded-t-lg h-[30%] group-hover:bg-primary/40 transition-all relative"></div>
                      <span class="text-xs text-[#666e85]">د</span>
                    </div>
                    <div class="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                      <div class="w-full bg-primary rounded-t-lg h-[85%] shadow-lg shadow-primary/20 relative"></div>
                      <span class="text-xs font-bold text-primary">س</span>
                    </div>
                    <div class="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                      <div class="w-full bg-primary/20 rounded-t-lg h-[50%] group-hover:bg-primary/40 transition-all relative"></div>
                      <span class="text-xs text-[#666e85]">چ</span>
                    </div>
                    <div class="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                      <div class="w-full bg-primary/20 rounded-t-lg h-[20%] group-hover:bg-primary/40 transition-all relative"></div>
                      <span class="text-xs text-[#666e85]">پ</span>
                    </div>
                    <div class="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                      <div class="w-full bg-primary/20 rounded-t-lg h-[20%] group-hover:bg-primary/40 transition-all relative"></div>
                      <span class="text-xs text-[#666e85]">ج</span>
                    </div>
                  </div>
                </Card>
                <Card class="p-5 rounded-3xl flex-1">
                  <h3 class="text-lg font-bold text-[#121317] dark:text-white mb-4">فعالیت‌های اخیر</h3>
                  <div class="flex flex-col gap-4">
                    <div class="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-gray-700/50 last:border-0 last:pb-0">
                      <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <span class="material-symbols-outlined text-[20px]">local_gas_station</span>
                      </div>
                      <div class="flex-1">
                        <p class="text-sm font-bold text-[#121317] dark:text-white">سوخت‌گیری</p>
                        <p class="text-xs text-[#666e85]">پژو ۲۰۷ • ۴۵ لیتر</p>
                      </div>
                      <p class="text-sm font-bold text-[#121317] dark:text-white text-left" dir="ltr">-۴۵,۰۰۰</p>
                    </div>
                    <div class="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-gray-700/50 last:border-0 last:pb-0">
                      <div class="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                        <span class="material-symbols-outlined text-[20px]">local_car_wash</span>
                      </div>
                      <div class="flex-1">
                        <p class="text-sm font-bold text-[#121317] dark:text-white">کارواش</p>
                        <p class="text-xs text-[#666e85]">سانتافه</p>
                      </div>
                      <p class="text-sm font-bold text-[#121317] dark:text-white text-left" dir="ltr">-۱۵۰,۰۰۰</p>
                    </div>
                    <div class="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-gray-700/50 last:border-0 last:pb-0">
                      <div class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400">
                        <span class="material-symbols-outlined text-[20px]">add</span>
                      </div>
                      <div class="flex-1">
                        <p class="text-sm font-bold text-[#121317] dark:text-white">سرویس جدید</p>
                        <p class="text-xs text-[#666e85]">اضافه شده دستی</p>
                      </div>
                      <p class="text-xs font-medium text-[#666e85]">دیروز</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
            <div class="flex justify-center py-6 text-xs text-[#666e85] opacity-60">
              <p>© ۱۴۰۳ شرکت خودروبان. تمامی حقوق محفوظ است.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
