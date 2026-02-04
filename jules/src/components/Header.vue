<template>
  <header class="h-20 flex items-center justify-between px-8 py-4 z-10 sticky top-0">
    <button class="md:hidden p-2 text-[#666e85]">
      <span class="material-symbols-outlined">menu</span>
    </button>
    <div class="hidden md:flex flex-col">
      <h2 class="text-xl font-bold text-[#121317] dark:text-white">نمای کلی</h2>
      <p class="text-sm text-[#666e85]">چهارشنبه، ۲ آبان</p>
    </div>
    <div class="flex items-center gap-4 mr-auto">
      <button class="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-[#1e293b] text-[#666e85] hover:text-primary shadow-sm transition-colors border border-gray-100 dark:border-gray-700">
        <span class="material-symbols-outlined text-[20px]">search</span>
      </button>
      <button class="relative flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-[#1e293b] text-[#666e85] hover:text-primary shadow-sm transition-colors border border-gray-100 dark:border-gray-700">
        <span class="material-symbols-outlined text-[20px]">notifications</span>
        <span class="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
      </button>
      <div class="h-8 w-[1px] bg-gray-200 dark:bg-gray-700 mx-2"></div>
      <div class="flex items-center gap-3 cursor-pointer p-1 pr-3 rounded-full hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
        <div class="bg-center bg-no-repeat bg-cover rounded-full w-10 h-10 border-2 border-white shadow-sm" data-alt="Portrait of a smiling man with a beard" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDxE5qQ11AHN6uy5UbhV0VvNkPLZvtiXsVyERcl1l3CaG7p0uljzEVLqe8WVuZ2tOTIkdn0URfJqLzIFaSZiCJsfX4xv9-BohQxMvTzp_P4cJTd9HHsx8bMqrjus0lBXeZpienrLnmiJs49uDJ66qYeFfzqueSbB02uZul6Ljfk3HsmXF7KbzTUAzWJGzcDv-GtPUl0FbIicGF9xe5QVGz2q0xhS6raGTHp3BSBS-RWTRlqfvkiurBUDvSZORqKPResescoKN6Ej5k");'></div>
        <div class="hidden lg:block">
          <p class="text-sm font-bold text-[#121317] dark:text-white leading-tight">آرش م.</p>
          <p class="text-xs text-[#666e85]">طرح رایگان</p>
        </div>
        <span class="material-symbols-outlined text-[#666e85] text-sm">expand_more</span>
      </div>
    </div>
  </header>
</template>
