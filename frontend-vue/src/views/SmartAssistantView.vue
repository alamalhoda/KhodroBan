<!-- SmartAssistantView.vue -->
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
  <MainLayout>
    <!-- فقط محتوای اصلی صفحه اینجا قرار می‌گیرد -->
    <!-- Header و Sidebar توسط MainLayout رندر می‌شوند -->

    <div class="flex flex-col gap-6 md:gap-8 px-4 md:px-6 lg:px-8 pt-2 pb-8 max-w-7xl mx-auto">

      <!-- عنوان صفحه + توضیح کوتاه -->
      <div class="flex flex-col gap-1">
        <h1 class="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-text-main">
          مشاور هوشمند
        </h1>
        <p class="text-sm md:text-base text-text-muted">
          دستیار هوش مصنوعی برای عیب‌یابی و نگهداری خودرو
        </p>
      </div>

      <!-- انتخاب خودرو (chips) -->
      <div class="flex flex-wrap gap-2.5 pb-1 overflow-x-auto mask-gradient">
        <button
          v-for="vehicle in vehicleStore.vehicles"
          :key="vehicle.id"
          @click="handleVehicleChange(vehicle.id)"
          class="flex h-9 shrink-0 items-center gap-2 px-4 rounded-lg text-sm font-medium transition-all active:scale-95"
          :class="{
            'bg-primary text-white shadow-sm shadow-primary/30': activeVehicle === vehicle.id,
            'bg-white dark:bg-[#1e293b] border border-border hover:bg-gray-50 dark:hover:bg-gray-800 text-text-muted hover:text-text-main': activeVehicle !== vehicle.id
          }"
        >
          <span class="material-symbols-outlined text-[18px]">directions_car</span>
          {{ vehicle.model }} – {{ vehicle.year }}
        </button>

        <button
          @click="router.push({ name: 'vehicle-management', query: { action: 'add' } })"
          class="flex h-9 shrink-0 items-center gap-2 px-4 rounded-lg border-2 border-dashed border-border text-sm font-medium text-text-muted hover:border-primary/60 hover:text-primary transition-colors"
        >
          <span class="material-symbols-outlined text-[18px]">add</span>
          افزودن خودرو
        </button>
      </div>

      <!-- کارت وضعیت تاریخچه چت -->
      <div class="bg-white dark:bg-[#1e293b] rounded-xl border border-border/50 p-5 shadow-sm">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="bg-blue-50 dark:bg-blue-900/30 p-2.5 rounded-lg text-primary">
              <span class="material-symbols-outlined">history</span>
            </div>
            <div>
              <div class="text-sm font-semibold text-text-main">تاریخچه گفتگو</div>
              <div class="text-xs text-text-muted">{{ messages.length }} پیام</div>
            </div>
          </div>
          <button
            @click="assistantStore.resetChat()"
            class="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
          >
            پاک کردن تاریخچه
          </button>
        </div>
      </div>

      <!-- ناحیه چت -->
      <div class="flex-1 flex flex-col bg-white dark:bg-[#1e293b] rounded-2xl border border-border/50 shadow-sm overflow-hidden min-h-[50vh]">

        <!-- پیام‌ها -->
        <div
          ref="chatContainer"
          class="flex-1 overflow-y-auto p-5 md:p-6 space-y-6"
        >
          <!-- پیام خوش‌آمدگویی وقتی چت خالی است -->
          <div v-if="messages.length === 0" class="flex flex-col items-center justify-center h-full text-center py-12">
            <div class="bg-blue-50 dark:bg-blue-900/30 p-5 rounded-full mb-5">
              <span class="material-symbols-outlined text-5xl text-primary">smart_toy</span>
            </div>
            <h3 class="text-xl font-bold text-text-main mb-3">به مشاور هوشمند خوش آمدید</h3>
            <p class="text-text-muted max-w-md leading-relaxed">
              درباره خودروهای خود سوال بپرسید، عیب‌یابی کنید، هزینه‌ها را تخمین بزنید یا برنامه سرویس دوره‌ای دریافت کنید.
            </p>
          </div>

          <!-- رندر پیام‌ها (همان ساختار قبلی) -->
          <template v-for="message in messages" :key="message.id">
            <!-- پیام هوش مصنوعی -->
            <div v-if="message.role === 'ai'" class="flex gap-4 max-w-[85%] self-start">
              <!-- ... همان ساختار قبلی ... -->
            </div>

            <!-- پیام کاربر -->
            <div v-if="message.role === 'user'" class="flex gap-4 max-w-[85%] self-end flex-row-reverse">
              <!-- ... همان ساختار قبلی ... -->
            </div>
          </template>
        </div>

        <!-- ناحیه ورودی (پایین صفحه) -->
        <div class="border-t border-border/50 p-4 md:p-5 bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-sm">
          <div class="flex items-end gap-3">
            <button class="p-3 text-text-muted hover:text-primary rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors shrink-0">
              <span class="material-symbols-outlined">attach_file</span>
            </button>

            <textarea
              v-model="userInput"
              @keydown.enter.prevent="handleSendMessage"
              :disabled="isLoading"
              rows="1"
              placeholder="سوال خود را اینجا بنویسید..."
              class="flex-1 resize-none bg-transparent border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/70 transition-all min-h-[48px] max-h-[140px]"
            />

            <button
              @click="handleSendMessage"
              :disabled="isLoading || !userInput.trim()"
              class="p-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shrink-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[48px] min-h-[48px]"
            >
              <span v-if="!isLoading" class="material-symbols-outlined">send</span>
              <div v-else class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </button>
          </div>

          <p class="text-[11px] text-center text-text-muted/80 mt-3">
            هوش مصنوعی ممکن است اشتباه کند. برای موارد ایمنی حتماً با مکانیک مشورت کنید.
          </p>
        </div>
      </div>

    </div>
  </MainLayout>
</template>