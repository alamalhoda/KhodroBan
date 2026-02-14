<!--
  هدر داشبورد: خوش‌آمد، خلاصه وضعیت و دکمه‌های اقدام سریع
-->
<script setup>
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui'

defineProps({
  /** نام کاربر */
  userName: { type: String, default: 'کاربر' },
  /** خلاصه داشبورد (overdueReminders, activeReminders) */
  summary: { type: Object, default: null }
})

const emit = defineEmits(['add-service', 'add-expense', 'add-vehicle'])
const { t } = useI18n()
</script>

<template>
  <section class="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-end">
    <div class="flex flex-col gap-2">
      <h1 class="text-3xl md:text-4xl font-black text-[#121317] dark:text-white tracking-tight">
        {{ t('dashboard.welcome') }}، {{ userName }} 👋
      </h1>
      <p class="text-[#666e85] dark:text-gray-400 text-lg">
        <template v-if="summary?.overdueReminders > 0">
          شما <span class="text-primary font-bold">{{ summary.overdueReminders }} وظیفه فوری</span> دارید که نیاز به توجه دارند.
        </template>
        <template v-else-if="summary?.activeReminders > 0">
          شما <span class="text-primary font-bold">{{ summary.activeReminders }} وظیفه در انتظار</span> دارید که نیاز به توجه دارند.
        </template>
        <template v-else>
          همه چیز در وضعیت خوبی است! 🎉
        </template>
      </p>
    </div>
    <div class="glass-panel p-2 rounded-2xl flex items-center gap-2 shadow-sm">
      <Button
        variant="ghost"
        size="sm"
        class="flex items-center gap-2"
        :aria-label="t('dashboard.addService')"
        @click="emit('add-service')"
      >
        <span class="bg-primary/10 p-1.5 rounded-lg text-primary">
          <span class="material-symbols-outlined text-[18px]">build</span>
        </span>
        <span class="text-sm font-bold">{{ t('dashboard.addService') }}</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        class="flex items-center gap-2"
        :aria-label="t('dashboard.addExpense')"
        @click="emit('add-expense')"
      >
        <span class="bg-green-500/10 p-1.5 rounded-lg text-green-600">
          <span class="material-symbols-outlined text-[18px]">attach_money</span>
        </span>
        <span class="text-sm font-bold">{{ t('dashboard.addExpense') }}</span>
      </Button>
      <Button
        variant="primary"
        size="sm"
        class="flex items-center justify-center w-10 h-10"
        :aria-label="t('dashboard.addVehicle')"
        @click="emit('add-vehicle')"
      >
        <span class="material-symbols-outlined">add</span>
      </Button>
    </div>
  </section>
</template>

<style scoped>
.glass-panel {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
.dark .glass-panel {
  background: rgba(30, 41, 59, 0.7);
}
</style>
