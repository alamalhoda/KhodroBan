<!--
  کارت سرویس بعدی (Next Service Due) در داشبورد
-->
<script setup>
import { useI18n } from 'vue-i18n'
import Card from '@/components/ui/Card.vue'
import { formatNumber, getRelativeTime } from '@/utils/formatters'

defineProps({
  /** شیء nextServiceDue از quickStats */
  nextServiceDue: { type: Object, default: null }
})

const { t } = useI18n()
</script>

<template>
  <Card
    v-if="nextServiceDue"
    class="p-6 rounded-2xl shadow-sm border border-primary/20 relative overflow-hidden bg-gradient-to-l from-primary/5 to-transparent"
  >
    <div class="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-white/20 to-transparent pointer-events-none" aria-hidden="true" />
    <div class="flex justify-between items-center mb-4 relative z-10">
      <div class="flex items-center gap-3">
        <div class="bg-blue-100 dark:bg-blue-900/30 p-2.5 rounded-xl text-primary">
          <span class="material-symbols-outlined text-[24px]" aria-hidden="true">next_plan</span>
        </div>
        <div>
          <h3 class="text-lg font-bold text-[#121317] dark:text-white">{{ t('dashboard.nextServiceDue') }}</h3>
          <p class="text-xs text-[#666e85]">بر اساس کیلومتر کارکرد تخمینی</p>
        </div>
      </div>
      <span
        v-if="nextServiceDue.dueDate"
        class="bg-blue-50 text-primary px-3 py-1 rounded-full text-xs font-bold border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800"
      >
        {{ getRelativeTime(nextServiceDue.dueDate) }}
      </span>
    </div>
    <div class="flex flex-col md:flex-row gap-6 relative z-10">
      <div class="flex-1">
        <div class="flex justify-between items-end mb-2">
          <span class="text-sm font-bold text-[#121317] dark:text-white">
            {{ nextServiceDue.title }}
          </span>
          <span v-if="nextServiceDue.vehicleName" class="text-xs text-[#666e85]">
            {{ nextServiceDue.vehicleName }}
            <template v-if="nextServiceDue.dueKm"> • {{ formatNumber(nextServiceDue.dueKm) }} کیلومتر</template>
          </span>
        </div>
        <div v-if="nextServiceDue.dueKm" class="w-full bg-gray-200 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden">
          <div class="bg-primary h-full rounded-full" style="width: 85%" />
        </div>
        <p v-if="nextServiceDue.description" class="text-xs text-[#666e85] mt-2">
          {{ nextServiceDue.description }}
        </p>
      </div>
    </div>
  </Card>
</template>
