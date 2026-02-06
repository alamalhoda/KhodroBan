<!--
  بخش یادآورهای فعال داشبورد
-->
<script setup>
import { useI18n } from 'vue-i18n'
import Card from '@/components/ui/Card.vue'
import { formatNumber, getRelativeTime } from '@/utils/formatters'

const props = defineProps({
  /** آرایه یادآورها */
  reminders: { type: Array, default: () => [] }
})

const emit = defineEmits(['view-all'])

const { t } = useI18n()

const getReminderStatus = (reminder) => {
  if (!reminder) return 'ok'
  if (reminder.status === 'overdue') return 'overdue'
  if (reminder.status === 'near') return 'near'
  return 'ok'
}

const getReminderStatusLabel = (status) => {
  const labels = { overdue: 'فوری', near: 'بزودی', ok: 'عادی' }
  return labels[status] || 'عادی'
}

const getReminderCardClass = (reminder) => {
  const status = getReminderStatus(reminder)
  const baseClass = 'border-r-4'
  if (status === 'overdue') return `${baseClass} border-r-red-500`
  if (status === 'near') return `${baseClass} border-r-yellow-500`
  return `${baseClass} border-r-green-500`
}

const getReminderIconClass = (reminder) => {
  const status = getReminderStatus(reminder)
  if (status === 'overdue') return 'p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
  if (status === 'near') return 'p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
  return 'p-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
}

const getReminderBadgeClass = (reminder) => {
  const status = getReminderStatus(reminder)
  if (status === 'overdue') return 'text-xs font-bold px-2 py-1 rounded-full text-red-500 bg-red-100 dark:bg-red-900/30'
  if (status === 'near') return 'text-xs font-bold px-2 py-1 rounded-full text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30'
  return 'text-xs font-bold px-2 py-1 rounded-full text-green-600 bg-green-100 dark:bg-green-900/30'
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h3 class="text-xl font-bold text-[#121317] dark:text-white flex items-center gap-2">
        <span class="material-symbols-outlined text-orange-500">notifications_active</span>
        {{ t('dashboard.activeReminders') }}
      </h3>
      <button
        v-if="reminders.length > 0"
        type="button"
        class="text-sm font-medium text-primary hover:underline"
        :aria-label="t('dashboard.viewAll')"
        @click="emit('view-all')"
      >
        {{ t('dashboard.viewAll') }}
      </button>
    </div>

    <Card v-if="reminders.length === 0" class="p-8 text-center">
      <span class="material-symbols-outlined text-5xl text-gray-400 mb-4 block" aria-hidden="true">notifications_off</span>
      <h4 class="text-lg font-bold text-[#121317] dark:text-white mb-2">{{ t('dashboard.noActiveReminders') }}</h4>
      <p class="text-sm text-[#666e85] dark:text-gray-400">{{ t('dashboard.noData') }}</p>
    </Card>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card
        v-for="reminder in reminders.slice(0, 4)"
        :key="reminder.id"
        :class="getReminderCardClass(reminder)"
      >
        <div class="flex justify-between items-start mb-3">
          <div :class="getReminderIconClass(reminder)">
            <span class="material-symbols-outlined" aria-hidden="true">notifications</span>
          </div>
          <span :class="getReminderBadgeClass(reminder)">
            {{ getReminderStatusLabel(getReminderStatus(reminder)) }}
          </span>
        </div>
        <h4 class="text-lg font-bold text-[#121317] dark:text-white mb-1">
          {{ reminder.title }}
        </h4>
        <p v-if="reminder.vehicleName" class="text-sm text-[#666e85] dark:text-gray-400 mb-4">
          {{ reminder.vehicleName }}
          <template v-if="reminder.dueKm"> • {{ formatNumber(reminder.dueKm) }} کیلومتر</template>
        </p>
        <p v-else-if="reminder.description" class="text-sm text-[#666e85] dark:text-gray-400 mb-4">
          {{ reminder.description }}
        </p>
        <div v-if="reminder.dueDate" class="flex items-center gap-2 text-xs font-medium text-[#666e85] bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg">
          <span class="material-symbols-outlined text-[16px]" aria-hidden="true">schedule</span>
          <span>{{ getRelativeTime(reminder.dueDate) }}</span>
        </div>
      </Card>
    </div>
  </div>
</template>
