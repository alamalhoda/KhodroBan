<!--
  ستون راست داشبورد: کارت هزینه ماه، سرویس‌های اخیر، اقدامات سریع
-->
<script setup>
import { useI18n } from 'vue-i18n'
import Card from '@/components/ui/Card.vue'
import { Button } from '@/components/ui'
import { useFormatDate } from '@/composables/useFormatDate'
import { formatCurrency, formatNumber } from '@/utils/formatters'

defineProps({
  /** آمار سریع (thisMonthExpenses, servicesThisMonth, avgMonthlyExpense) */
  quickStats: { type: Object, default: null },
  /** آرایه سرویس‌های اخیر */
  recentServices: { type: Array, default: () => [] }
})

const emit = defineEmits(['add-service', 'add-expense', 'view-reports'])
const { t } = useI18n()
const formatDate = useFormatDate()
</script>

<template>
  <div class="xl:col-span-1 flex flex-col gap-6">
    <!-- Expenses Card -->
    <Card class="p-6 rounded-3xl relative overflow-hidden">
      <div class="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-10 -mt-10 blur-2xl pointer-events-none" aria-hidden="true" />
      <h3 class="text-lg font-bold text-[#121317] dark:text-white mb-4 flex items-center gap-2">
        <span class="material-symbols-outlined text-gray-400" aria-hidden="true">monitoring</span>
        {{ t('dashboard.thisMonthExpenses') }}
      </h3>
      <div class="flex flex-col gap-1 mb-6">
        <p class="text-sm text-[#666e85] dark:text-gray-400">{{ t('dashboard.thisMonthExpenses') }}</p>
        <div class="flex items-baseline gap-1">
          <span class="text-3xl font-black text-[#121317] dark:text-white tracking-tight">
            {{ formatCurrency(quickStats?.thisMonthExpenses || 0) }}
          </span>
          <span class="text-xs font-normal text-[#666e85] mr-1">تومان</span>
        </div>
      </div>
      <div class="flex flex-col gap-2 text-sm">
        <div class="flex justify-between items-center">
          <span class="text-[#666e85] dark:text-gray-400">{{ t('dashboard.servicesThisMonth') }}</span>
          <span class="font-bold text-[#121317] dark:text-white">{{ formatNumber(quickStats?.servicesThisMonth || 0) }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-[#666e85] dark:text-gray-400">{{ t('dashboard.avgMonthlyExpense') }}</span>
          <span class="font-bold text-[#121317] dark:text-white">{{ formatCurrency(quickStats?.avgMonthlyExpense || 0) }}</span>
        </div>
      </div>
    </Card>

    <!-- Recent Activities Card -->
    <Card class="p-5 rounded-3xl flex-1">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-[#121317] dark:text-white">{{ t('dashboard.recentServices') }}</h3>
        <router-link
          v-if="recentServices.length > 0"
          to="/service-list"
          class="text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
        >
          {{ t('dashboard.viewAll') }}
          <span class="material-symbols-outlined text-[16px]" aria-hidden="true">arrow_back</span>
        </router-link>
      </div>

      <div v-if="recentServices.length === 0" class="text-center py-8">
        <span class="material-symbols-outlined text-4xl text-gray-400 mb-2 block" aria-hidden="true">history</span>
        <p class="text-sm text-[#666e85] dark:text-gray-400">{{ t('dashboard.noData') }}</p>
      </div>

      <div v-else class="flex flex-col gap-4">
        <div
          v-for="service in recentServices.slice(0, 5)"
          :key="service.id"
          class="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-gray-700/50 last:border-0 last:pb-0"
        >
          <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <span class="material-symbols-outlined text-[20px]" aria-hidden="true">build</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold text-[#121317] dark:text-white truncate">
              {{ service.types?.join('، ') || service.type || 'سرویس' }}
            </p>
            <p class="text-xs text-[#666e85] dark:text-gray-400">
              {{ formatDate(service.date) }}
              <template v-if="service.km"> • {{ formatNumber(service.km) }} km</template>
            </p>
          </div>
          <p class="text-sm font-bold text-[#121317] dark:text-white text-left whitespace-nowrap" dir="ltr">
            {{ formatCurrency(service.cost) }}
          </p>
        </div>
      </div>
    </Card>

    <!-- Quick Actions Card -->
    <Card class="p-5 rounded-3xl">
      <h3 class="text-lg font-bold text-[#121317] dark:text-white mb-4">{{ t('dashboard.quickActions') }}</h3>
      <div class="flex flex-col gap-2">
        <Button
          variant="outline"
          full-width
          class="justify-start"
          :aria-label="t('dashboard.addService')"
          @click="emit('add-service')"
        >
          <span class="material-symbols-outlined mr-2" aria-hidden="true">build</span>
          {{ t('dashboard.addService') }}
        </Button>
        <Button
          variant="outline"
          full-width
          class="justify-start"
          :aria-label="t('dashboard.addExpense')"
          @click="emit('add-expense')"
        >
          <span class="material-symbols-outlined mr-2" aria-hidden="true">attach_money</span>
          {{ t('dashboard.addExpense') }}
        </Button>
        <Button
          variant="outline"
          full-width
          class="justify-start"
          :aria-label="t('dashboard.reports')"
          @click="emit('view-reports')"
        >
          <span class="material-symbols-outlined mr-2" aria-hidden="true">assessment</span>
          {{ t('dashboard.reports') }}
        </Button>
      </div>
    </Card>
  </div>
</template>
