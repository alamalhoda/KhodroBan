<script setup>\n</script>\n\n<template>
  <div class="flex h-screen w-full relative">
    <!-- Sidebar (Right side in RTL) -->
    <aside class="hidden lg:flex w-72 flex-col justify-between border-l border-white/5 bg-[#111b22] p-6 shrink-0 z-20">
      <div class="flex flex-col gap-8">
        <!-- User Profile Summary -->
        <div class="flex items-center gap-4 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
          <div class="relative">
            <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 ring-2 ring-primary/20 group-hover:ring-primary transition-all" data-alt="User profile picture showing a smiling man" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCRT_3eYt3zDY_9vB-sSOyaiIDD4O0jyfqka-gkKa0h-ayfLiICXbgeKj8_H6c7400gPv7QMd7PGPfuaxTtc00Z0cwJX46AC3bEkglUfzrmNXyi2M1q6arWtr1x2tpjjVNm_UzYqW-ajmaSCtdyGYMNAXuMJ9S5nAD9NsEXFYzm_WbbYupGd0j2GteQJIaodRL6bc8Q_RRzjWsn-GlbngabOWUSTEys0N57rKCuxy1gRrKbBTtCVcTWWcEaYkJohtTGv91xRNIrY9g");'>
            </div>
            <div class="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-[#111b22]"></div>
          </div>
          <div class="flex flex-col">
            <h1 class="text-white text-lg font-bold leading-tight">علی محمدی</h1>
            <p class="text-[#92b2c9] text-xs font-normal">کاربر ویژه</p>
          </div>
        </div>
        <!-- Navigation -->
        <nav class="flex flex-col gap-2">
          <a class="flex items-center gap-4 px-4 py-3 rounded-xl bg-primary text-white shadow-lg shadow-primary/20 group transition-all" href="#">
            <span class="material-symbols-outlined">dashboard</span>
            <span class="text-sm font-bold">داشبورد</span>
          </a>
          <a class="flex items-center gap-4 px-4 py-3 rounded-xl text-[#92b2c9] hover:bg-white/5 hover:text-white transition-all" href="#">
            <span class="material-symbols-outlined">directions_car</span>
            <span class="text-sm font-medium">گاراژ من</span>
          </a>
          <a class="flex items-center gap-4 px-4 py-3 rounded-xl text-[#92b2c9] hover:bg-white/5 hover:text-white transition-all" href="#">
            <span class="material-symbols-outlined">receipt_long</span>
            <span class="text-sm font-medium">هزینه‌ها</span>
          </a>
          <a class="flex items-center gap-4 px-4 py-3 rounded-xl text-[#92b2c9] hover:bg-white/5 hover:text-white transition-all" href="#">
            <span class="material-symbols-outlined">notifications</span>
            <div class="flex flex-1 justify-between items-center">
              <span class="text-sm font-medium">یادآورها</span>
              <span class="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">۲</span>
            </div>
          </a>
        </nav>
      </div>
      <div class="flex flex-col gap-2">
        <a class="flex items-center gap-4 px-4 py-3 rounded-xl text-[#92b2c9] hover:bg-white/5 hover:text-white transition-all" href="#">
          <span class="material-symbols-outlined">settings</span>
          <span class="text-sm font-medium">تنظیمات</span>
        </a>
        <!-- Freemium Banner Mini -->
        <div class="mt-4 p-4 rounded-xl bg-gradient-to-br from-primary/20 to-transparent border border-primary/20">
          <div class="flex items-start gap-3">
            <span class="material-symbols-outlined text-primary">workspace_premium</span>
            <div>
              <p class="text-white text-sm font-bold mb-1">ارتقا به نسخه حرفه‌ای</p>
              <p class="text-[#92b2c9] text-xs mb-3">مدیریت نامحدود خودروها</p>
              <button class="text-xs bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary/90 transition">مشاهده پلن‌ها</button>
            </div>
          </div>
        </div>
      </div>
    </aside>
    <!-- Main Content Area -->
    <main class="flex-1 h-full overflow-y-auto relative">
      <!-- Background Elements -->
      <div class="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none z-0"></div>
      <div class="relative z-10 p-6 md:p-10 max-w-7xl mx-auto flex flex-col gap-8">
        <!-- Header -->
        <header class="flex flex-wrap justify-between items-end gap-4">
          <div>
            <p class="text-[#92b2c9] text-sm mb-1">۱۴ آبان ۱۴۰۳ - دوشنبه</p>
            <h2 class="text-3xl md:text-4xl font-black text-white tracking-tight">سلام، علی 👋</h2>
          </div>
          <div class="flex gap-3">
            <button class="glass-panel size-10 flex items-center justify-center rounded-full text-white hover:bg-white/10 transition">
              <span class="material-symbols-outlined">search</span>
            </button>
            <button class="lg:hidden glass-panel size-10 flex items-center justify-center rounded-full text-white hover:bg-white/10 transition">
              <span class="material-symbols-outlined">menu</span>
            </button>
          </div>
        </header>
        <!-- Hero Section: Critical Reminder -->
        <section class="w-full">
          <div class="glass-panel rounded-2xl p-6 md:p-8 relative overflow-hidden group">
            <!-- Abstract bg decoration -->
            <div class="absolute -right-20 -top-20 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none"></div>
            <div class="absolute right-0 top-0 h-full w-2/3 bg-gradient-to-l from-[#192833] via-transparent to-transparent pointer-events-none z-0 opacity-50"></div>
            <div class="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
              <div class="flex-1 flex flex-col gap-4">
                <div class="flex items-center gap-2">
                  <span class="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-full border border-red-500/20 animate-pulse">اقدام فوری</span>
                  <span class="text-[#92b2c9] text-sm font-medium">سرویس دوره‌ای</span>
                </div>
                <div>
                  <h3 class="text-2xl md:text-4xl font-bold text-white mb-2">تعویض روغن موتور</h3>
                  <p class="text-lg text-[#92b2c9]">پژو ۲۰۶ - سفید (۱۲ | ۳۴۵ ب ۶۷)</p>
                </div>
                <div class="w-full max-w-md bg-white/10 h-2 rounded-full overflow-hidden mt-2">
                  <div class="bg-gradient-to-l from-red-500 to-orange-500 h-full w-[90%] rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                </div>
                <p class="text-sm text-[#92b2c9]">کارکرد فعلی: ۹۸,۵۰۰ کیلومتر (۵۰۰ کیلومتر گذشته از موعد)</p>
              </div>
              <div class="flex flex-col items-end gap-4 shrink-0 w-full md:w-auto">
                <div class="text-center md:text-left bg-surface-dark/50 p-4 rounded-xl border border-white/5 backdrop-blur-sm w-full md:w-auto">
                  <p class="text-[#92b2c9] text-xs mb-1">زمان باقی‌مانده</p>
                  <p class="text-3xl font-black text-white tabular-nums">۳ <span class="text-base font-normal text-[#92b2c9]">روز تا سررسید</span></p>
                </div>
                <div class="flex gap-3 w-full md:w-auto">
                  <button class="flex-1 md:flex-none h-12 px-6 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-primary/25">
                    <span class="material-symbols-outlined">check_circle</span>
                    ثبت سرویس
                  </button>
                  <button class="h-12 w-12 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition">
                    <span class="material-symbols-outlined">snooze</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <!-- Left Column: Quick Actions & Vehicles -->
          <div class="lg:col-span-8 flex flex-col gap-8">
            <!-- Quick Actions Grid -->
            <section>
              <h4 class="text-white text-lg font-bold mb-4 flex items-center gap-2">
                <span class="w-1 h-6 bg-primary rounded-full"></span>
                دسترسی سریع
              </h4>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <button class="group glass-panel p-4 rounded-xl flex flex-col items-center justify-center gap-3 hover:bg-white/5 transition-all hover:-translate-y-1">
                  <div class="size-12 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span class="material-symbols-outlined">add_card</span>
                  </div>
                  <span class="text-white text-sm font-medium">هزینه جدید</span>
                </button>
                <button class="group glass-panel p-4 rounded-xl flex flex-col items-center justify-center gap-3 hover:bg-white/5 transition-all hover:-translate-y-1">
                  <div class="size-12 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span class="material-symbols-outlined">build</span>
                  </div>
                  <span class="text-white text-sm font-medium">سرویس جدید</span>
                </button>
                <button class="group glass-panel p-4 rounded-xl flex flex-col items-center justify-center gap-3 hover:bg-white/5 transition-all hover:-translate-y-1">
                  <div class="size-12 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span class="material-symbols-outlined">notification_add</span>
                  </div>
                  <span class="text-white text-sm font-medium">یادآور جدید</span>
                </button>
                <button class="group glass-panel p-4 rounded-xl flex flex-col items-center justify-center gap-3 hover:bg-white/5 transition-all hover:-translate-y-1 border-dashed border-2 border-white/20">
                  <div class="size-12 rounded-full bg-white/5 text-white/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span class="material-symbols-outlined">add</span>
                  </div>
                  <span class="text-white/70 text-sm font-medium">افزودن خودرو</span>
                </button>
              </div>
            </section>
            <!-- Vehicles List -->
            <section>
              <div class="flex items-center justify-between mb-4">
                <h4 class="text-white text-lg font-bold flex items-center gap-2">
                  <span class="w-1 h-6 bg-primary rounded-full"></span>
                  خودروهای من
                </h4>
                <a class="text-primary text-sm font-medium hover:underline" href="#">مشاهده همه</a>
              </div>
              <div class="flex flex-col gap-4">
                <!-- Car Card 1 -->
                <div class="glass-panel p-4 rounded-xl flex flex-col sm:flex-row items-center gap-4 hover:border-primary/50 transition cursor-pointer group relative overflow-hidden">
                  <div class="absolute left-0 top-0 h-full w-1 bg-primary"></div>
                  <div class="w-full sm:w-48 aspect-video rounded-lg bg-cover bg-center shrink-0" data-alt="White Peugeot 206 parked on a street" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDpV7uXuXOg5zAwf62Sp_ZfojTJSA1MhdMrfZZs_3GCViYZd9nFrep4UHJ_rKvaop_b-1ullzg6FG1FZ7Eg5-d8kqU7fRfJvCkmndztrLQF5FS8fEKjlg-ifRCwcSgGYVuvg1LgA9MFGE_Lg3HumOnx7t1VpgtmEVpgqhT_0WcK0v6mKlDlPQuSUQaZv7Y6t7cM2DE_9erV4Gqw6u2Q9tDrf8_SMLDMrOu69yKKia43hTr83mamP--sEwiRWJghgWC7ilvjQA7V3CA");'>
                  </div>
                  <div class="flex-1 flex flex-col gap-2 w-full text-center sm:text-right">
                    <div class="flex flex-col sm:flex-row justify-between items-center">
                      <h5 class="text-white font-bold text-lg">پژو ۲۰۶</h5>
                      <span class="px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded-md border border-red-500/20 mt-1 sm:mt-0">نیاز به سرویس</span>
                    </div>
                    <p class="text-[#92b2c9] text-sm dir-ltr text-center sm:text-right font-mono">12 | 345 B 67</p>
                    <div class="flex items-center justify-center sm:justify-start gap-4 mt-1 text-xs text-white/60">
                      <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">speed</span> 98,500 km</span>
                      <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">local_gas_station</span> 7.2 L/100</span>
                    </div>
                  </div>
                  <button class="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white self-center sm:self-center transition opacity-0 group-hover:opacity-100 focus:opacity-100">
                    <span class="material-symbols-outlined">chevron_left</span>
                  </button>
                </div>
                <!-- Car Card 2 -->
                <div class="glass-panel p-4 rounded-xl flex flex-col sm:flex-row items-center gap-4 hover:border-primary/50 transition cursor-pointer group">
                  <div class="w-full sm:w-48 aspect-video rounded-lg bg-cover bg-center shrink-0 grayscale hover:grayscale-0 transition duration-500" data-alt="Black luxury sedan car front view" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuAfU3FKFnjdmt2K74EGyYPvLALURPoApuxHiSxNj5sZ79P2IZ8Q16nmuUHOVfbCobomaXtOwW-wx4ipfvvEzFlWcsSI1-LL70tHWd4dAdXK6033VC-Xh1pkSnV9fernypA9lyUZOjRs1C05JKMlw1t4DYgygbz5EDWsW5gEs2qJS1H1KUMQfx3ufKZzwm9-RiSlhllo2H0Sp8Il5yagiziG94JfpKLc1bqSEqKZb4EbpBh5CZIwCpf7xRWiDPVWVbF3KXq3zumQW_4");'>
                  </div>
                  <div class="flex-1 flex flex-col gap-2 w-full text-center sm:text-right">
                    <div class="flex flex-col sm:flex-row justify-between items-center">
                      <h5 class="text-white font-bold text-lg">دنا پلاس</h5>
                      <span class="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-md border border-green-500/20 mt-1 sm:mt-0">وضعیت عالی</span>
                    </div>
                    <p class="text-[#92b2c9] text-sm dir-ltr text-center sm:text-right font-mono">68 | 912 J 11</p>
                    <div class="flex items-center justify-center sm:justify-start gap-4 mt-1 text-xs text-white/60">
                      <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">speed</span> 14,200 km</span>
                      <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">water_drop</span> سالم</span>
                    </div>
                  </div>
                  <button class="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white self-center sm:self-center transition opacity-0 group-hover:opacity-100 focus:opacity-100">
                    <span class="material-symbols-outlined">chevron_left</span>
                  </button>
                </div>
              </div>
            </section>
          </div>
          <!-- Right Column: Recent Activity Feed -->
          <div class="lg:col-span-4 flex flex-col gap-4">
            <div class="glass-panel p-6 rounded-2xl h-full">
              <h4 class="text-white text-lg font-bold mb-6 flex items-center gap-2">
                <span class="material-symbols-outlined text-[#92b2c9]">history</span>
                فعالیت‌های اخیر
              </h4>
              <div class="relative pl-4 border-r border-white/10 space-y-8 pr-2">
                <!-- Timeline Item -->
                <div class="relative">
                  <div class="absolute top-1 -right-[13px] size-3 bg-green-500 rounded-full ring-4 ring-[#192833]"></div>
                  <p class="text-xs text-[#92b2c9] mb-1">امروز، ۱۰:۳۰</p>
                  <p class="text-white font-medium text-sm">سوخت‌گیری کامل</p>
                  <p class="text-white/50 text-xs mt-1">دنا پلاس - ۴۵ لیتر - ۵۴۰,۰۰۰ تومان</p>
                </div>
                <!-- Timeline Item -->
                <div class="relative">
                  <div class="absolute top-1 -right-[13px] size-3 bg-primary rounded-full ring-4 ring-[#192833]"></div>
                  <p class="text-xs text-[#92b2c9] mb-1">دیروز</p>
                  <p class="text-white font-medium text-sm">تمدید بیمه شخص ثالث</p>
                  <p class="text-white/50 text-xs mt-1">پژو ۲۰۶ - بیمه ایران</p>
                </div>
                <!-- Timeline Item -->
                <div class="relative">
                  <div class="absolute top-1 -right-[13px] size-3 bg-gray-500 rounded-full ring-4 ring-[#192833]"></div>
                  <p class="text-xs text-[#92b2c9] mb-1">۱ آبان ۱۴۰۳</p>
                  <p class="text-white font-medium text-sm">کارواش و نظافت</p>
                  <p class="text-white/50 text-xs mt-1">دنا پلاس</p>
                </div>
                <!-- Timeline Item -->
                <div class="relative">
                  <div class="absolute top-1 -right-[13px] size-3 bg-gray-500 rounded-full ring-4 ring-[#192833]"></div>
                  <p class="text-xs text-[#92b2c9] mb-1">۲۵ مهر ۱۴۰۳</p>
                  <p class="text-white font-medium text-sm">تنظیم باد لاستیک‌ها</p>
                  <p class="text-white/50 text-xs mt-1">پژو ۲۰۶</p>
                </div>
              </div>
              <button class="w-full mt-8 py-2 text-sm text-primary hover:text-primary/80 font-medium border border-primary/20 rounded-xl hover:bg-primary/5 transition">
                مشاهده تاریخچه کامل
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
