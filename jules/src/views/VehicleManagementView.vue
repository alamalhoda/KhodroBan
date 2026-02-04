<script setup>
</script>

<template>
  <div class="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display text-slate-900 dark:text-white overflow-x-hidden">
    <!-- Navbar -->
    <nav class="sticky top-0 z-50 glass-panel border-b border-glass-border px-4 py-3 lg:px-8">
      <div class="max-w-[1440px] mx-auto flex items-center justify-between">
        <!-- Logo & Search (Right Side in RTL) -->
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-3 text-primary">
            <span class="material-symbols-outlined text-4xl">directions_car</span>
            <h1 class="text-xl font-bold tracking-tight">خودروبان</h1>
          </div>
          <div class="hidden md:flex relative group">
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
              <span class="material-symbols-outlined">search</span>
            </div>
            <input class="block w-full min-w-[300px] p-2.5 pr-10 text-sm bg-surface-dark/50 border border-glass-border rounded-xl placeholder-slate-400 text-white focus:ring-primary focus:border-primary transition-all" placeholder="جستجو در سرویس‌ها، خودروها..." type="text" />
          </div>
        </div>
        <!-- Nav Links & Profile (Left Side in RTL) -->
        <div class="flex items-center gap-4 lg:gap-6">
          <div class="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
            <a class="text-white hover:text-primary transition-colors" href="#">داشبورد</a>
            <a class="hover:text-primary transition-colors" href="#">خودروها</a>
            <a class="hover:text-primary transition-colors" href="#">گزارشات مالی</a>
          </div>
          <div class="h-6 w-px bg-glass-border hidden lg:block"></div>
          <div class="flex items-center gap-4">
            <button class="relative p-2 text-slate-300 hover:text-white transition-colors rounded-full hover:bg-white/5">
              <span class="material-symbols-outlined">notifications</span>
              <span class="absolute top-2 left-2 size-2 bg-danger rounded-full animate-pulse"></span>
            </button>
            <button class="flex items-center gap-2 bg-gradient-to-r from-primary to-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
              <span class="material-symbols-outlined text-[20px]">diamond</span>
              <span class="hidden sm:inline">ارتقا به حرفه‌ای</span>
            </button>
            <div class="size-10 rounded-full bg-cover bg-center border-2 border-primary cursor-pointer hover:scale-105 transition-transform" data-alt="User profile avatar of a smiling man" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAiba5_e600F0fIJtUHHZ0_EA94trJNV3_Gw4CRCCXFnCAH2IsH9cjspy8lCvk0H3cFxD07WLgAJ8U8Aa1S80L-MEgQxCnm_vXCsC0IP0-ZeaKu349EUa-qHEqRJ3-jVCe06V5gPrAGTwsi1BIV04EBfXcG-NrC2jnToLIQ51-9xcBAyrN8M3QXW6beAk3Mtt1hMvoxylMUxBeaqLrbKaEPMoNAJBlERmg8eXOPFZ66ZTWhSTWnuS7TG4H9Wkh6vGULsedcKPfkb28');">
            </div>
          </div>
        </div>
      </div>
    </nav>
    <!-- Main Content Layout (3 Columns) -->
    <main class="flex-1 w-full max-w-[1440px] mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- RIGHT COLUMN: Urgency & Reminders (Priority in RTL) -->
      <section class="lg:col-span-3 flex flex-col gap-6 order-1">
        <!-- Urgent Service Widget -->
        <div class="glass-panel rounded-2xl p-5 shadow-glass relative overflow-hidden group">
          <div class="absolute -left-10 -top-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-all"></div>
          <div class="flex justify-between items-start mb-4 relative z-10">
            <div>
              <span class="inline-flex items-center gap-1 bg-danger/20 text-danger text-xs px-2 py-1 rounded-md font-bold mb-2">
                <span class="material-symbols-outlined text-[14px]">priority_high</span>
                فوری
              </span>
              <h3 class="text-lg font-bold text-white">تعویض روغن موتور</h3>
              <p class="text-slate-400 text-sm mt-1">پژو ۲۰۶ - ۸۴۶ب۳۴</p>
            </div>
            <div class="bg-surface-dark rounded-lg p-2 text-primary">
              <span class="material-symbols-outlined">oil_barrel</span>
            </div>
          </div>
          <div class="relative z-10">
            <div class="flex justify-between text-sm mb-2">
              <span class="text-slate-300">مهلت باقی‌مانده</span>
              <span class="text-white font-bold">۳ روز</span>
            </div>
            <div class="w-full bg-surface-dark rounded-full h-2.5">
              <div class="bg-danger h-2.5 rounded-full" style="width: 85%"></div>
            </div>
            <button class="w-full mt-5 bg-white/10 hover:bg-white/20 text-white py-2 rounded-xl text-sm font-medium transition-colors border border-white/10">
              مشاهده جزئیات و رزرو
            </button>
          </div>
        </div>
        <!-- Reminders List -->
        <div class="glass-panel rounded-2xl p-5 shadow-glass h-full min-h-[400px]">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-bold text-white">یادآورهای پیش‌رو</h3>
            <button class="text-primary text-sm hover:underline">مشاهده همه</button>
          </div>
          <div class="space-y-4">
            <!-- Reminder Item 1 -->
            <div class="flex items-center gap-3 p-3 bg-surface-dark/50 rounded-xl border border-glass-border hover:border-primary/50 transition-colors cursor-pointer group">
              <div class="size-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined">health_and_safety</span>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">تمدید بیمه شخص ثالث</h4>
                <p class="text-xs text-slate-400 mt-1">سررسید: ۱۵ مهر ۱۴۰۳</p>
              </div>
              <div class="size-2 rounded-full bg-warning shrink-0" title="نزدیک"></div>
            </div>
            <!-- Reminder Item 2 -->
            <div class="flex items-center gap-3 p-3 bg-surface-dark/50 rounded-xl border border-glass-border hover:border-primary/50 transition-colors cursor-pointer group">
              <div class="size-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined">build_circle</span>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">بازدید دوره‌ای تایرها</h4>
                <p class="text-xs text-slate-400 mt-1">سررسید: ۱ آبان ۱۴۰۳</p>
              </div>
              <div class="size-2 rounded-full bg-success shrink-0" title="عادی"></div>
            </div>
            <!-- Reminder Item 3 -->
            <div class="flex items-center gap-3 p-3 bg-surface-dark/50 rounded-xl border border-glass-border hover:border-primary/50 transition-colors cursor-pointer group">
              <div class="size-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined">cleaning_services</span>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">کارواش و نظافت</h4>
                <p class="text-xs text-slate-400 mt-1">پیشنهاد هوشمند</p>
              </div>
              <div class="size-2 rounded-full bg-slate-500 shrink-0" title="کم اهمیت"></div>
            </div>
            <!-- Add Reminder Button -->
            <button class="w-full py-3 border border-dashed border-slate-600 rounded-xl text-slate-400 text-sm flex items-center justify-center gap-2 hover:bg-white/5 hover:text-white hover:border-slate-400 transition-all">
              <span class="material-symbols-outlined text-lg">add_circle</span>
              افزودن یادآور جدید
            </button>
          </div>
        </div>
      </section>
      <!-- MIDDLE COLUMN: Vehicle Fleet (Main Content) -->
      <section class="lg:col-span-6 flex flex-col gap-6 order-2">
        <!-- Quick Stats Row -->
        <div class="grid grid-cols-3 gap-4">
          <div class="glass-panel p-4 rounded-xl text-center">
            <span class="text-3xl font-bold text-white">۳</span>
            <p class="text-xs text-slate-400 mt-1">خودروهای فعال</p>
          </div>
          <div class="glass-panel p-4 rounded-xl text-center">
            <span class="text-3xl font-bold text-white">۲</span>
            <p class="text-xs text-slate-400 mt-1">سرویس معوقه</p>
          </div>
          <div class="glass-panel p-4 rounded-xl text-center">
            <span class="text-3xl font-bold text-white font-mono dir-ltr">1.2M</span>
            <p class="text-xs text-slate-400 mt-1">هزینه ماه (تومان)</p>
          </div>
        </div>
        <!-- Vehicles Tabs -->
        <div class="glass-panel rounded-2xl p-1 flex">
          <button class="flex-1 py-2.5 rounded-xl bg-primary text-white font-medium text-sm shadow-md transition-all">خودروهای من</button>
          <button class="flex-1 py-2.5 rounded-xl text-slate-400 font-medium text-sm hover:text-white transition-all">خودروهای خانواده</button>
          <button class="flex-1 py-2.5 rounded-xl text-slate-400 font-medium text-sm hover:text-white transition-all">بایگانی</button>
        </div>
        <!-- Vehicle Card 1 (Main Car) -->
        <div class="glass-panel rounded-2xl p-5 border border-primary/30 relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
          <div class="flex flex-col sm:flex-row gap-5">
            <!-- Car Image -->
            <div class="w-full sm:w-48 h-32 rounded-xl bg-cover bg-center shrink-0 border border-glass-border relative" data-alt="White Peugeot 206 parked on a street" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAELjXSzDz84yyHAdYdnr7Uj7xSUTLEGSiS8u41QPxBYJ61yiAe-4IAShmY1uEVryRvs8fkY5zXr-77eIK6bRDSH6iq07rhDnbDp4e_IYn7kFN6JIyPC8D7oFmQo65LWIQ4yH-ZWNHzjiwrEtNN7lV5UMEhyC24Xl_LI-wF5hn1mATddLTbChuffuDj9qy0X4SXze44c013-sXbeNjHpqcy2YOtG1v4FrunUEVOztgSqEAX8RdmoRVyvq00BPt8aGUHXoI6ri9Tg8k');">
              <div class="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-xs font-mono text-white border border-white/10">
                ۸۴۶ ب ۳۴
              </div>
            </div>
            <!-- Car Details -->
            <div class="flex-1 flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-start">
                  <h2 class="text-xl font-bold text-white">پژو ۲۰۶ تیپ ۵</h2>
                  <span class="bg-success/20 text-success text-xs px-2.5 py-1 rounded-full font-bold border border-success/20">سالم</span>
                </div>
                <p class="text-slate-400 text-sm mt-1">کارکرد: ۱۲۰,۰۰۰ کیلومتر</p>
              </div>
              <div class="grid grid-cols-2 gap-3 mt-4">
                <div class="bg-surface-dark/50 rounded-lg p-2 border border-glass-border">
                  <p class="text-[10px] text-slate-400">آخرین تعویض روغن</p>
                  <p class="text-sm text-white font-medium mt-0.5">۲ ماه پیش</p>
                </div>
                <div class="bg-surface-dark/50 rounded-lg p-2 border border-glass-border">
                  <p class="text-[10px] text-slate-400">میانگین مصرف سوخت</p>
                  <p class="text-sm text-white font-medium mt-0.5">۸.۵ لیتر/۱۰۰</p>
                </div>
              </div>
            </div>
          </div>
          <!-- Actions Footer -->
          <div class="mt-5 pt-4 border-t border-glass-border flex justify-between items-center">
            <div class="flex -space-x-2 space-x-reverse">
              <div class="size-8 rounded-full bg-surface-dark border border-slate-600 flex items-center justify-center text-xs text-slate-400" title="راننده اصلی">MA</div>
            </div>
            <div class="flex gap-2">
              <button class="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors">تاریخچه</button>
              <button class="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20">مدیریت</button>
            </div>
          </div>
        </div>
        <!-- Vehicle Card 2 (Secondary Car) -->
        <div class="glass-panel rounded-2xl p-5 opacity-90 hover:opacity-100 transition-opacity">
          <div class="flex flex-col sm:flex-row gap-5">
            <!-- Car Image -->
            <div class="w-full sm:w-48 h-32 rounded-xl bg-cover bg-center shrink-0 border border-glass-border grayscale hover:grayscale-0 transition-all duration-500 relative" data-alt="Dark Kia Cerato front view" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAwrh8yahqkIMAtc2gHGBi4Oh-0xoL4MvCy7Blqb0fTILlhyTTxLmBDVk7HNtWPnDKLy6ITkotCp14Zw9qv0C9kMYZGmBayt-IG5yD0kSCTjSiV6uaXhonENOBbNSufvasTHdiHUUUGTJ-75wempxsLsEUzueNeuMqcR2dh_YOl-IIEgtmyFYY80Sgdsg-G-m53N13UBiCCJ_MtCGb99NNR2eNlrL-lDZ3yTHdW473DOXvQHipWN418xmdCNzeppH96Gadn5wUf0M8');">
              <div class="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-xs font-mono text-white border border-white/10">
                ۱۲ س ۹۹۸
              </div>
            </div>
            <!-- Car Details -->
            <div class="flex-1 flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-start">
                  <h2 class="text-xl font-bold text-white">کیا سراتو ۲۰۲۰</h2>
                  <span class="bg-warning/20 text-warning text-xs px-2.5 py-1 rounded-full font-bold border border-warning/20">سرویس نزدیک</span>
                </div>
                <p class="text-slate-400 text-sm mt-1">کارکرد: ۴۵,۰۰۰ کیلومتر</p>
              </div>
              <div class="w-full bg-surface-dark rounded-full h-1.5 mt-6 mb-2">
                <div class="bg-warning h-1.5 rounded-full" style="width: 70%"></div>
              </div>
              <p class="text-xs text-slate-400">۷۰٪ تا سرویس دوره ای بعدی</p>
            </div>
          </div>
          <!-- Actions Footer -->
          <div class="mt-5 pt-4 border-t border-glass-border flex justify-end">
            <button class="px-4 py-2 bg-white/5 text-white text-sm font-medium rounded-lg hover:bg-white/10 transition-colors">مدیریت</button>
          </div>
        </div>
      </section>
      <!-- LEFT COLUMN: Actions & Analytics (Utilities) -->
      <section class="lg:col-span-3 flex flex-col gap-6 order-3">
        <!-- Quick Actions Grid -->
        <div class="glass-panel rounded-2xl p-5">
          <h3 class="text-lg font-bold text-white mb-4">دسترسی سریع</h3>
          <div class="grid grid-cols-2 gap-3">
            <button class="flex flex-col items-center justify-center gap-2 p-4 bg-primary rounded-xl hover:bg-primary-dark transition-colors text-white shadow-lg shadow-primary/20 group">
              <span class="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform">add_task</span>
              <span class="text-sm font-medium">سرویس جدید</span>
            </button>
            <button class="flex flex-col items-center justify-center gap-2 p-4 bg-surface-dark border border-glass-border rounded-xl hover:bg-white/5 transition-colors text-slate-300 hover:text-white group">
              <span class="material-symbols-outlined text-3xl text-success group-hover:scale-110 transition-transform">payments</span>
              <span class="text-sm font-medium">ثبت هزینه</span>
            </button>
            <button class="flex flex-col items-center justify-center gap-2 p-4 bg-surface-dark border border-glass-border rounded-xl hover:bg-white/5 transition-colors text-slate-300 hover:text-white group">
              <span class="material-symbols-outlined text-3xl text-warning group-hover:scale-110 transition-transform">garage</span>
              <span class="text-sm font-medium">افزودن خودرو</span>
            </button>
            <button class="flex flex-col items-center justify-center gap-2 p-4 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl hover:opacity-90 transition-opacity text-white shadow-lg group relative overflow-hidden">
              <div class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span class="material-symbols-outlined text-3xl text-yellow-300 group-hover:rotate-12 transition-transform">workspace_premium</span>
              <span class="text-sm font-medium">نسخه طلایی</span>
            </button>
          </div>
        </div>
        <!-- Expense Summary Chart (Mini) -->
        <div class="glass-panel rounded-2xl p-5">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-base font-bold text-white">هزینه‌های این ماه</h3>
            <button class="text-slate-400 hover:text-white"><span class="material-symbols-outlined">more_horiz</span></button>
          </div>
          <!-- Simulated Donut Chart using CSS conic-gradient -->
          <div class="flex items-center justify-center py-4">
            <div class="size-40 rounded-full bg-surface-dark relative flex items-center justify-center" style="background: conic-gradient(#1392ec 0% 45%, #ff9f1c 45% 70%, #ff4d4d 70% 85%, #233948 85% 100%);">
              <div class="size-28 bg-[#151f28] rounded-full flex flex-col items-center justify-center z-10">
                <span class="text-xs text-slate-400">مجموع</span>
                <span class="text-lg font-bold text-white font-mono dir-ltr">1.2M</span>
              </div>
            </div>
          </div>
          <!-- Legend -->
          <div class="space-y-2 mt-2">
            <div class="flex justify-between items-center text-sm">
              <div class="flex items-center gap-2">
                <div class="size-3 rounded-full bg-primary"></div>
                <span class="text-slate-300">سرویس دوره‌ای</span>
              </div>
              <span class="text-white font-mono">۴۵%</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <div class="flex items-center gap-2">
                <div class="size-3 rounded-full bg-warning"></div>
                <span class="text-slate-300">سوخت</span>
              </div>
              <span class="text-white font-mono">۲۵%</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <div class="flex items-center gap-2">
                <div class="size-3 rounded-full bg-danger"></div>
                <span class="text-slate-300">تعمیرات</span>
              </div>
              <span class="text-white font-mono">۱۵%</span>
            </div>
          </div>
          <button class="w-full mt-5 text-xs text-slate-400 hover:text-white underline">مشاهده گزارش کامل</button>
        </div>
        <!-- Tip of the day -->
        <div class="glass-panel rounded-2xl p-4 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
          <div class="flex items-start gap-3">
            <span class="material-symbols-outlined text-primary text-2xl">lightbulb</span>
            <div>
              <h4 class="text-sm font-bold text-white mb-1">نکته روز</h4>
              <p class="text-xs text-slate-300 leading-relaxed">فشار باد تایرها را ماهی یکبار چک کنید تا مصرف سوخت شما تا ۵٪ کاهش یابد.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
