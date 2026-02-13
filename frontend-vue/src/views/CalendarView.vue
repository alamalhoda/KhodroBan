<!-- صفحه تقویم شمسی — نمای ماهانه/هفتگی -->
<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import MainLayout from '../components/MainLayout.vue'
import { PersianCalendar } from '../components/ui'

const { t } = useI18n()
const displayPeriod = ref('month')
const selectedDate = ref('')

// نمونه رویدادها و تعطیلات برای نمایش (اختیاری)
const sampleEvents = ref([
  { startDate: '1403/07/15', title: 'سرویس دوره‌ای', color: '#29B6F6' },
  { startDate: '1403/07/20', endDate: '1403/07/21', title: 'یادآوری روغن', color: '#66BB6A' },
])
const sampleVacations = ref([
  { date: '1403/07/16', title: 'روز جهانی کودک' },
])

function onDaySelect(dateStr) {
  selectedDate.value = dateStr
}

function onEventClick(ev) {
  selectedDate.value = ev?.startDate || ''
}

function onDisplayPeriodChange(period) {
  displayPeriod.value = period
}
</script>

<template>
  <MainLayout>
    <div class="calendar-view p-4 md:p-6 max-w-5xl mx-auto">
      <h1 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
        {{ t('calendar.title', 'تقویم شمسی') }}
      </h1>
      <div class="mb-4 flex flex-wrap gap-2 items-center">
        <span class="text-sm text-gray-600 dark:text-gray-400">
          {{ displayPeriod === 'month' ? t('calendar.monthView', 'نمای ماهانه') : t('calendar.weekView', 'نمای هفتگی') }}
        </span>
        <span v-if="selectedDate" class="text-sm text-primary">
          {{ t('calendar.selected', 'انتخاب شده:') }} {{ selectedDate }}
        </span>
      </div>
      <PersianCalendar
        display-period="month"
        :events="sampleEvents"
        :vacations="sampleVacations"
        add-event-button
        @day-select="onDaySelect"
        @event-click="onEventClick"
        @display-period-change="onDisplayPeriodChange"
      />
    </div>
  </MainLayout>
</template>

<style scoped>
.calendar-view {
  direction: rtl;
}
</style>
