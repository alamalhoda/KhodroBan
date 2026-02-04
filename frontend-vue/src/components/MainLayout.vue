<script setup>
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'
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
          <div class="max-w-7xl mx-auto">
            <slot></slot>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
