<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import { useSmartAssistantStore } from '../stores/smartAssistant';

const assistantStore = useSmartAssistantStore();

const userInput = ref('');
const chatContainer = ref(null);

const messages = computed(() => assistantStore.messages);
const isLoading = computed(() => assistantStore.isLoading);

const handleSendMessage = async () => {
  if (userInput.value.trim() === '') return;

  const prompt = userInput.value;
  userInput.value = ''; // Clear input immediately

  try {
    await assistantStore.sendMessage(prompt);
  } catch (error) {
    // The store handles the error state, but you could add
    // additional UI feedback here (e.g., a toast notification)
    console.error("Failed to send message:", error);
  }
};

// Auto-scroll to the bottom of the chat container when new messages are added
watch(messages, () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
}, { deep: true });

// Helper to format timestamp
const formatTime = (date) => {
  return new Intl.DateTimeFormat('fa-IR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date);
};
</script>

<template>
  <div class="bg-background-light text-text-main font-body h-screen overflow-hidden flex selection:bg-primary/20">
    <!-- Sidebar Navigation (Right Side) -->
    <aside class="hidden lg:flex w-72 flex-col justify-between bg-surface border-l border-border h-full z-20 shadow-[rgba(0,_0,_0,_0.05)_0px_0px_10px]">
      <!-- Top Section: User & Nav -->
      <div class="flex flex-col p-6 gap-8 overflow-y-auto">
        <!-- User Profile -->
        <div class="flex items-center gap-3">
          <div class="bg-center bg-no-repeat bg-cover rounded-full size-12 shrink-0 border border-border" data-alt="User profile picture placeholder, generic avatar" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCYK67hIrVvZPA6r3QI0QyYhZ0oFBbp3QP7_pSN44-D1pt8xDWiV82q_5SskzmjDPOE0sFij6Ej234tkR-4WQmK197iJsel7bXvsVQzWak5wVTDcxtsAiLfANXCSFmtyw8-rsQLgt22Hf25G6Clfq7u1LoXjtgUZzAR8QEXLS95D5Qwb4e9z1SeoOugAH5655QC3n-AgepdhYCWaM46dbUvLT8MbuAImEnWaDBGvDHE7Om7MxHcjE1uGe_gDZMGmmWTSdm9dYQXsrA");'>
          </div>
          <div class="flex flex-col overflow-hidden">
            <h1 class="text-text-main text-base font-bold leading-tight truncate">علی محمدی</h1>
            <p class="text-text-muted text-xs font-normal leading-normal truncate">کاربر عادی</p>
          </div>
        </div>
        <!-- Navigation Links -->
        <nav class="flex flex-col gap-2">
          <a class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-background-light transition-colors group" href="#">
            <span class="material-symbols-outlined text-text-muted group-hover:text-text-main transition-colors">dashboard</span>
            <span class="text-text-muted text-sm font-medium group-hover:text-text-main transition-colors">داشبورد</span>
          </a>
          <a class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-background-light transition-colors group" href="#">
            <span class="material-symbols-outlined text-text-muted group-hover:text-text-main transition-colors">directions_car</span>
            <span class="text-text-muted text-sm font-medium group-hover:text-text-main transition-colors">خودروها</span>
          </a>
          <a class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-background-light transition-colors group" href="#">
            <span class="material-symbols-outlined text-text-muted group-hover:text-text-main transition-colors">build</span>
            <span class="text-text-muted text-sm font-medium group-hover:text-text-main transition-colors">سرویس‌ها</span>
          </a>
          <!-- Active Link -->
          <a class="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary border border-primary/20" href="#">
            <span class="material-symbols-outlined fill-current">smart_toy</span>
            <span class="text-sm font-bold">مشاور هوشمند</span>
          </a>
          <a class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-background-light transition-colors group" href="#">
            <span class="material-symbols-outlined text-text-muted group-hover:text-text-main transition-colors">settings</span>
            <span class="text-text-muted text-sm font-medium group-hover:text-text-main transition-colors">تنظیمات</span>
          </a>
        </nav>
      </div>
      <!-- Bottom Section: Limits -->
      <div class="p-6 border-t border-border bg-background-light/30">
        <div class="flex flex-col gap-3">
          <div class="flex gap-2 justify-between items-end">
            <p class="text-text-main text-sm font-bold">سوالات روزانه</p>
            <p class="text-text-muted text-xs font-medium dir-ltr">3 / 5</p>
          </div>
          <!-- Progress Bar -->
          <div class="rounded-full bg-border h-2 w-full overflow-hidden">
            <div class="h-full bg-primary rounded-full transition-all duration-500 ease-out" style="width: 60%;"></div>
          </div>
          <button class="mt-2 text-primary text-xs font-bold hover:underline self-start">
            ارتقا به حساب ویژه ✨
          </button>
        </div>
      </div>
    </aside>
    <!-- Main Content Area -->
    <main class="flex-1 flex flex-col h-full relative overflow-hidden">
      <!-- Header (Glassmorphism) -->
      <header class="glass sticky top-0 z-10 border-b border-border flex flex-col gap-4 px-6 py-4 md:px-10 md:py-5">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex flex-col gap-1">
            <div class="flex items-center gap-2">
              <h2 class="text-text-main text-2xl font-black tracking-tight">مشاور هوشمند</h2>
              <span class="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold border border-green-200">آنلاین</span>
            </div>
            <p class="text-text-muted text-sm">دستیار هوش مصنوعی برای عیب‌یابی و نگهداری خودرو</p>
          </div>
          <!-- Mobile Menu Toggle (Visible on small screens) -->
          <button class="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-text-main">
            <span class="material-symbols-outlined">menu</span>
          </button>
        </div>
        <!-- Vehicle Context Selector (Chips) -->
        <div class="flex gap-2 overflow-x-auto pb-1 no-scrollbar mask-gradient">
          <button class="flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary text-white px-4 shadow-sm shadow-primary/30 transition-transform active:scale-95">
            <span class="material-symbols-outlined text-[18px]">directions_car</span>
            <span class="text-xs font-bold">پژو ۲۰۶ - ۱۴۰۱</span>
          </button>
          <button class="flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg bg-white border border-border px-4 hover:bg-gray-50 transition-colors text-text-muted hover:text-text-main">
            <span class="text-xs font-medium">پراید ۱۳۱ - ۱۳۹۹</span>
          </button>
          <button class="flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg bg-white border border-dashed border-border px-4 hover:border-primary/50 hover:text-primary transition-colors text-text-muted">
            <span class="material-symbols-outlined text-[18px]">add</span>
            <span class="text-xs font-medium">افزودن خودرو</span>
          </button>
        </div>
      </header>

      <!-- Chat Viewport -->
      <div ref="chatContainer" class="flex-1 overflow-y-auto px-4 py-6 md:px-10 md:py-8 flex flex-col gap-6">
        <!-- Date Separator -->
        <div class="flex justify-center">
          <span class="bg-gray-100 text-text-muted text-[10px] px-3 py-1 rounded-full font-medium">امروز</span>
        </div>

        <!-- Dynamic Messages -->
        <template v-for="message in messages" :key="message.id">
          <!-- AI Message -->
          <div v-if="message.role === 'ai'" class="flex gap-4 max-w-[85%] md:max-w-[70%] self-start group">
            <div class="bg-gradient-to-br from-primary to-blue-600 rounded-2xl size-10 shrink-0 flex items-center justify-center shadow-lg shadow-blue-200">
              <span class="material-symbols-outlined text-white text-xl">smart_toy</span>
            </div>
            <div class="flex flex-col gap-1 w-full">
              <span class="text-text-main text-xs font-bold mr-1">مشاور هوشمند</span>
              <div class="bg-white p-4 rounded-2xl rounded-tr-none shadow-sm text-sm leading-7 text-gray-700 border border-border" :class="{'border-red-300 bg-red-50': message.isError}">
                <p v-if="message.text" class="whitespace-pre-wrap">{{ message.text }}</p>
                <!-- Typing Indicator -->
                <div v-if="message.typing" class="flex items-center gap-2">
                  <span class="size-2 bg-gray-400 rounded-full animate-pulse delay-0"></span>
                  <span class="size-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
                  <span class="size-2 bg-gray-400 rounded-full animate-pulse delay-300"></span>
                </div>
              </div>
            </div>
          </div>

          <!-- User Message -->
          <div v-if="message.role === 'user'" class="flex gap-3 max-w-[85%] md:max-w-[70%] self-end flex-row-reverse">
            <div class="bg-gray-200 rounded-2xl size-10 shrink-0 flex items-center justify-center overflow-hidden" data-alt="User avatar thumbnail" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuBLkh4MEzPsZAtHbLEVP5_SzQgSzlEKXtaPVqkxkpx2r877FOQXscAJFDVGCHBk5oHScxpwAMjByVfLhphr0Xq26L7J4T-a029BJMseyXWGl6QjWmvhYpanHpa3q9ZjvdnDzC3VxDG90WUOD08niqE0A-Yh71yfBSYHQWswO4EZdyw7S7kWAsDKatOgPEu5kr1NvzAnDqmzTgq3WFX_bq7kn9oZMUDwMyUgZXh77t1EtdMCt3h07Ffm4QJ7qB1KqsmmyFuA0HzGo-k"); background-size: cover;'>
            </div>
            <div class="flex flex-col gap-1 items-end">
              <div class="bg-primary text-white p-4 rounded-2xl rounded-tl-none shadow-md shadow-blue-100 text-sm leading-relaxed">
                <p>{{ message.text }}</p>
              </div>
              <span class="text-text-muted text-[10px] dir-ltr mr-1">{{ formatTime(message.timestamp) }}</span>
            </div>
          </div>
        </template>
      </div>

      <!-- Input Area (Sticky Bottom) -->
      <div class="p-4 md:p-6 pb-6 relative z-20">
        <!-- Suggestion Chips (Floating above input) -->
        <div class="absolute bottom-full left-0 right-0 px-6 pb-2 flex gap-2 overflow-x-auto no-scrollbar mask-gradient-top pointer-events-none">
          <div class="flex gap-2 pointer-events-auto">
            <button class="bg-white/90 backdrop-blur border border-border text-text-muted hover:text-primary hover:border-primary/50 px-3 py-1.5 rounded-lg text-xs transition-all shadow-sm">
              هزینه تعویض لنت چقدره؟
            </button>
            <button class="bg-white/90 backdrop-blur border border-border text-text-muted hover:text-primary hover:border-primary/50 px-3 py-1.5 rounded-lg text-xs transition-all shadow-sm">
              نزدیکترین تعمیرگاه مجاز کجاست؟
            </button>
          </div>
        </div>
        <!-- Input Container -->
        <div class="glass border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-2 flex items-end gap-2 relative ring-1 ring-black/5 focus-within:ring-primary/50 transition-all">
          <!-- Attachment Button -->
          <button class="p-3 text-text-muted hover:text-primary hover:bg-blue-50 rounded-xl transition-colors shrink-0" title="افزودن عکس یا فایل">
            <span class="material-symbols-outlined">attach_file</span>
          </button>
          <!-- Text Area -->
          <textarea
            v-model="userInput"
            @keydown.enter.prevent="handleSendMessage"
            :disabled="isLoading"
            class="w-full bg-transparent border-none focus:ring-0 p-3 text-sm text-text-main placeholder:text-gray-400 resize-none max-h-32 min-h-[44px]"
            placeholder="سوال خود را اینجا بنویسید..."
            rows="1"
            style="field-sizing: content;"
          ></textarea>
          <!-- Voice Input -->
          <button class="p-3 text-text-muted hover:text-primary hover:bg-blue-50 rounded-xl transition-colors shrink-0" title="ورودی صوتی">
            <span class="material-symbols-outlined">mic</span>
          </button>
          <!-- Send Button -->
          <button
            @click="handleSendMessage"
            :disabled="isLoading"
            class="bg-primary hover:bg-blue-600 text-white p-3 rounded-xl shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all active:scale-95 shrink-0 flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
            title="ارسال پیام"
          >
            <span v-if="!isLoading" class="material-symbols-outlined -rotate-180">send</span>
            <svg v-else class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </button>
        </div>
        <p class="text-center text-[10px] text-text-muted mt-3">
          هوش مصنوعی ممکن است اشتباه کند. برای موارد ایمنی حتما با مکانیک مشورت کنید.
        </p>
      </div>
    </main>
    <!-- Overlay Gradient for better aesthetic -->
    <div class="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_top_left,_rgba(19,146,236,0.05),_transparent_70%)]"></div>
  </div>
</template>
