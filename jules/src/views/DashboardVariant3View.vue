<script setup>
</script>

<template>
  <div class="bg-background-dark text-white h-screen flex overflow-hidden selection:bg-primary selection:text-white">
    <!-- Right Sidebar -->
    <aside class="w-80 flex-shrink-0 flex flex-col justify-between border-l border-white/5 bg-[#111b22] h-full overflow-y-auto relative z-20">
      <!-- Logo & Nav -->
      <div class="p-6 flex flex-col gap-8">
        <!-- Branding -->
        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center shadow-lg shadow-primary/20">
              <span class="material-symbols-outlined text-white" style="font-size: 24px;">directions_car</span>
            </div>
            <h1 class="text-xl font-bold tracking-tight text-white">خودروبان</h1>
          </div>
          <p class="text-secondary-text text-xs pr-[52px]">مدیریت هوشمند خودرو</p>
        </div>
        <!-- Navigation -->
        <nav class="flex flex-col gap-2">
          <a class="flex items-center gap-4 px-4 py-3 rounded-xl bg-primary/10 text-primary transition-all duration-200 border border-primary/20" href="#">
            <span class="material-symbols-outlined filled">dashboard</span>
            <span class="font-medium">داشبورد</span>
          </a>
          <a class="flex items-center gap-4 px-4 py-3 rounded-xl text-secondary-text hover:text-white hover:bg-white/5 transition-all duration-200" href="#">
            <span class="material-symbols-outlined">garage_home</span>
            <span class="font-medium">خودروهای من</span>
          </a>
          <a class="flex items-center gap-4 px-4 py-3 rounded-xl text-secondary-text hover:text-white hover:bg-white/5 transition-all duration-200" href="#">
            <span class="material-symbols-outlined">receipt_long</span>
            <span class="font-medium">هزینه‌ها</span>
          </a>
          <a class="flex items-center gap-4 px-4 py-3 rounded-xl text-secondary-text hover:text-white hover:bg-white/5 transition-all duration-200" href="#">
            <span class="material-symbols-outlined">notifications_active</span>
            <span class="font-medium">یادآورها</span>
            <span class="mr-auto bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold">3</span>
          </a>
          <a class="flex items-center gap-4 px-4 py-3 rounded-xl text-secondary-text hover:text-white hover:bg-white/5 transition-all duration-200" href="#">
            <span class="material-symbols-outlined">settings</span>
            <span class="font-medium">تنظیمات</span>
          </a>
        </nav>
      </div>
      <!-- Sidebar Footer & Widget -->
      <div class="p-6 flex flex-col gap-6 pb-8">
        <!-- Next Service Widget (Glassmorphism) -->
        <div class="glass-card-primary rounded-2xl p-4 relative overflow-hidden group cursor-pointer transition-transform hover:scale-[1.02]">
          <div class="absolute -right-4 -top-4 w-20 h-20 bg-primary/20 rounded-full blur-2xl"></div>
          <div class="flex items-center justify-between mb-3 relative z-10">
            <span class="text-xs font-bold text-primary uppercase tracking-wider">سرویس بعدی</span>
            <span class="material-symbols-outlined text-primary" style="font-size: 20px;">build_circle</span>
          </div>
          <h3 class="text-white font-bold text-lg mb-1 relative z-10">تعویض روغن موتور</h3>
          <p class="text-white/80 text-sm mb-4 relative z-10">پژو ۲۰۶ - ۸۴۹ ط ۵۶</p>
          <div class="flex items-center gap-2 bg-black/20 rounded-lg p-2 backdrop-blur-sm relative z-10">
            <span class="material-symbols-outlined text-orange-400" style="font-size: 20px;">timer</span>
            <span class="text-sm font-bold text-white">۳ روز مانده</span>
          </div>
        </div>
        <!-- Premium Button -->
        <button class="w-full h-12 rounded-xl bg-gradient-to-r from-[#233948] to-[#1d2f3d] border border-white/5 text-secondary-text text-sm font-medium hover:text-white hover:border-white/10 transition-all flex items-center justify-center gap-2 group">
          <span class="material-symbols-outlined group-hover:text-yellow-400 transition-colors">diamond</span>
          <span>ارتقا به نسخه پریمیوم</span>
        </button>
      </div>
    </aside>
    <!-- Main Content Area -->
    <main class="flex-1 flex flex-col h-full overflow-hidden relative">
      <!-- Background Gradient -->
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-[#111b22] to-[#111b22] pointer-events-none"></div>
      <!-- Header -->
      <header class="h-20 flex-shrink-0 px-8 flex items-center justify-between relative z-10 border-b border-white/5">
        <div class="flex flex-col">
          <h2 class="text-xl font-bold text-white">سلام علی، روز بخیر</h2>
          <p class="text-sm text-secondary-text">امروز ۳ یادآور فعال دارید</p>
        </div>
        <div class="flex items-center gap-4">
          <button class="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all relative">
            <span class="material-symbols-outlined">notifications</span>
            <span class="absolute top-2.5 left-2.5 w-2 h-2 bg-red-500 rounded-full border border-[#111b22]"></span>
          </button>
          <div class="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/50 cursor-pointer">
            <img alt="User Profile" class="w-full h-full object-cover" data-alt="User profile picture showing a smiling man" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDI6XyTMz9Sb28dm0awX_MGeQz3SpoBc8-WbTddl0R31sbouTrkDu9g3VwGa8iTApiHg9nmvSGGPJv0yg304o_gpkmy-E2qGVIdiUULl5Avao-x4Jkb4n6tcOOjyQ1x7v-d4bGYuBQEQ1PjRaFSaABQo6yZdX9Q1xJZiGyBkI9DN2n-0YnCscxniqUqY8BHGkMSTuOmNV3aQxsgZoQ-JcxlWfRIuAl9D6ssQL2cgO_eSht1nTSHblf8bVw8vSyj8OBV-c_drMadmRg" />
          </div>
        </div>
      </header>
      <!-- Scrollable Content -->
      <div class="flex-1 overflow-y-auto p-8 flex flex-col gap-8 relative z-10">
        <!-- Quick Actions -->
        <section>
          <h3 class="text-white text-lg font-bold mb-4 flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">bolt</span>
            دسترسی سریع
          </h3>
          <div class="grid grid-cols-4 gap-4">
            <button class="glass-panel h-28 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 hover:bg-primary/20 hover:border-primary/40 transition-all duration-300 group">
              <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <span class="material-symbols-outlined text-primary group-hover:text-white text-2xl">add_road</span>
              </div>
              <span class="text-white font-medium text-sm">ثبت سرویس</span>
            </button>
            <button class="glass-panel h-28 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 hover:bg-green-500/20 hover:border-green-500/40 transition-all duration-300 group">
              <div class="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center group-hover:bg-green-600 group-hover:scale-110 transition-all duration-300">
                <span class="material-symbols-outlined text-green-500 group-hover:text-white text-2xl">receipt_long</span>
              </div>
              <span class="text-white font-medium text-sm">ثبت هزینه</span>
            </button>
            <button class="glass-panel h-28 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 hover:bg-orange-500/20 hover:border-orange-500/40 transition-all duration-300 group">
              <div class="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500 group-hover:scale-110 transition-all duration-300">
                <span class="material-symbols-outlined text-orange-500 group-hover:text-white text-2xl">alarm_add</span>
              </div>
              <span class="text-white font-medium text-sm">یادآور جدید</span>
            </button>
            <button class="glass-panel h-28 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 hover:bg-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group">
              <div class="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500 group-hover:scale-110 transition-all duration-300">
                <span class="material-symbols-outlined text-purple-500 group-hover:text-white text-2xl">directions_car</span>
              </div>
              <span class="text-white font-medium text-sm">افزودن خودرو</span>
            </button>
          </div>
        </section>
        <div class="flex gap-8 items-start">
          <!-- Left Column (Active Reminders) -->
          <div class="flex-1 flex flex-col gap-6">
            <div class="flex items-center justify-between">
              <h3 class="text-white text-lg font-bold">یادآورهای فعال</h3>
              <a class="text-sm text-primary hover:text-primary/80 transition-colors" href="#">مشاهده همه</a>
            </div>
            <div class="grid grid-cols-1 gap-4">
              <!-- Reminder Card 1 -->
              <div class="bg-[#1d2830] rounded-xl p-4 border border-white/5 flex items-center justify-between group hover:border-primary/30 transition-all">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                    <span class="material-symbols-outlined">health_and_safety</span>
                  </div>
                  <div class="flex flex-col gap-1">
                    <h4 class="text-white font-bold text-base">تمدید بیمه شخص ثالث</h4>
                    <span class="text-xs text-secondary-text">پژو ۲۰۶ • سررسید: ۱۴۰۳/۰۸/۱۵</span>
                  </div>
                </div>
                <div class="flex flex-col items-end gap-1">
                  <span class="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-md font-bold">ضروری</span>
                  <span class="text-secondary-text text-sm">۵ روز مانده</span>
                </div>
              </div>
              <!-- Reminder Card 2 -->
              <div class="bg-[#1d2830] rounded-xl p-4 border border-white/5 flex items-center justify-between group hover:border-primary/30 transition-all">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                    <span class="material-symbols-outlined">tire_repair</span>
                  </div>
                  <div class="flex flex-col gap-1">
                    <h4 class="text-white font-bold text-base">تنظیم باد لاستیک‌ها</h4>
                    <span class="text-xs text-secondary-text">دنا پلاس • سررسید: ۱۴۰۳/۰۸/۲۰</span>
                  </div>
                </div>
                <div class="flex flex-col items-end gap-1">
                  <span class="bg-orange-500/20 text-orange-400 text-xs px-2 py-1 rounded-md font-bold">متوسط</span>
                  <span class="text-secondary-text text-sm">۱۰ روز مانده</span>
                </div>
              </div>
              <!-- Reminder Card 3 -->
              <div class="bg-[#1d2830] rounded-xl p-4 border border-white/5 flex items-center justify-between group hover:border-primary/30 transition-all">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <span class="material-symbols-outlined">local_car_wash</span>
                  </div>
                  <div class="flex flex-col gap-1">
                    <h4 class="text-white font-bold text-base">کارواش و صفرشویی</h4>
                    <span class="text-xs text-secondary-text">پژو ۲۰۶ • یادآور دوره‌ای</span>
                  </div>
                </div>
                <div class="flex flex-col items-end gap-1">
                  <span class="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-md font-bold">عادی</span>
                  <span class="text-secondary-text text-sm">فردا</span>
                </div>
              </div>
            </div>
          </div>
          <!-- Right Column (My Cars List) - Visually Left due to RTL -->
          <div class="w-[400px] flex flex-col gap-6">
            <div class="flex items-center justify-between">
              <h3 class="text-white text-lg font-bold">خودروهای من</h3>
              <button class="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all">
                <span class="material-symbols-outlined text-sm">add</span>
              </button>
            </div>
            <div class="flex flex-col gap-4">
              <!-- Car Card 1 -->
              <div class="bg-[#1d2830] rounded-2xl overflow-hidden border border-white/5 hover:border-primary/40 transition-all group">
                <div class="h-32 bg-cover bg-center relative" data-alt="Silver Peugeot 206 parked on street" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDQTk2hpUZ-_jb3Sa7bBDgR1XrSwbs9B88hxE59DQjATc9_MF-hBIXCYvZHDH-yRJgnl2nOAIhRxu5TWjpqjj6C09Hhz8xDkSyKqaHOPv9brSdfhg3jcqMcV6InG9ecaYzzJ7o7Sb13m77AC9lpRRSYH8RfHBqFjWzTySfHCmmhyt90IDuFGoML4q-4_jv9hHqjmf2kiDckCJ_NCh3YAVqUjA8hfkK3iT5bCpqNRnNj1_Aub3pAT8ZoyvXzls1h6PKkkaXBjWSW_Qo');">
                  <div class="absolute inset-0 bg-gradient-to-t from-[#1d2830] to-transparent"></div>
                  <div class="absolute bottom-3 right-3">
                    <h4 class="text-white font-bold text-lg shadow-black drop-shadow-md">پژو ۲۰۶ تیپ ۵</h4>
                    <p class="text-white/80 text-xs">پلاک: ۸۴۹ ط ۵۶ | ایران ۱۱</p>
                  </div>
                  <div class="absolute top-3 left-3 bg-green-500/20 backdrop-blur-md px-2 py-1 rounded-md border border-green-500/30">
                    <span class="text-green-400 text-xs font-bold">فعال</span>
                  </div>
                </div>
                <div class="p-4 flex flex-col gap-3">
                  <div class="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                    <span class="text-secondary-text">کیلومتر فعلی</span>
                    <span class="text-white font-mono dir-ltr">124,500 km</span>
                  </div>
                  <div class="flex justify-between items-center text-sm">
                    <span class="text-secondary-text">آخرین سرویس</span>
                    <span class="text-white">۲ هفته پیش</span>
                  </div>
                  <button class="mt-2 w-full py-2 bg-white/5 hover:bg-white/10 text-primary text-sm font-medium rounded-lg transition-colors">
                    مدیریت خودرو
                  </button>
                </div>
              </div>
              <!-- Car Card 2 -->
              <div class="bg-[#1d2830] rounded-2xl overflow-hidden border border-white/5 hover:border-primary/40 transition-all group opacity-80 hover:opacity-100">
                <div class="h-32 bg-cover bg-center relative" data-alt="White sedan car in a modern garage" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuCjWFZkAHc-UXDtmy_Kq8RyoJmtfnt6SEfrKjQhpMVyCTuavQjr_jpmv6vMonc9LNfMJ2jANZ8cFtXIiZqRRZLBN2RLM0br5a804LpGGjcQLJlaSR7aowvKuWS7wd7OLczFKb7LYrBuUVIukS0t4zLNdWnrqIjPOQDZIJxxoBS2B-OJRG5qpo_g8PzofwXLjCeJFhkMDk2t-KPZgENGgI6yflXDr3Tx-1H9wA8LKo7Ojs3_BoRWhoIl4jToGyx8tdFnmBIpQ_fC1wM');">
                  <div class="absolute inset-0 bg-gradient-to-t from-[#1d2830] to-transparent"></div>
                  <div class="absolute bottom-3 right-3">
                    <h4 class="text-white font-bold text-lg shadow-black drop-shadow-md">دنا پلاس توربو</h4>
                    <p class="text-white/80 text-xs">پلاک: ۲۲۱ ج ۹۸ | ایران ۴۴</p>
                  </div>
                </div>
                <div class="p-4 flex flex-col gap-3">
                  <div class="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                    <span class="text-secondary-text">کیلومتر فعلی</span>
                    <span class="text-white font-mono dir-ltr">42,100 km</span>
                  </div>
                  <div class="flex justify-between items-center text-sm">
                    <span class="text-secondary-text">آخرین سرویس</span>
                    <span class="text-white">۱ ماه پیش</span>
                  </div>
                  <button class="mt-2 w-full py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors">
                    مدیریت خودرو
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
