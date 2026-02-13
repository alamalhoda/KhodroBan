<!--
  تقویم شمسی نمایشی — wrapper حول vue3-jalali-calendar
  قرارداد با backend/frontend: تاریخ‌ها به صورت YYYY/MM/DD (شمسی)
-->
<script setup>
import { computed } from 'vue'
import { jalaliCalendar } from 'vue3-jalali-calendar'
import moment from 'jalali-moment'
/* استایل تقویم داخل باندل vue3-jalali-calendar تزریق می‌شود */

const props = defineProps({
  /** تاریخ اولیه نمایش تقویم — شمسی YYYY/MM/DD یا خالی برای امروز */
  initialDate: { type: String, default: '' },
  /** نمای نمایش: ماهانه (پیش‌فرض) یا هفتگی */
  displayPeriod: { type: String, default: 'month', validator: (v) => ['month', 'week'].includes(v) },
  /** لیست رویدادها — هر آیتم: { startDate, endDate?, title, color? } — تاریخ‌ها ISO یا YYYY/MM/DD */
  events: { type: Array, default: () => [] },
  /** لیست تعطیلات — هر آیتم: { date: YYYY/MM/DD, title } */
  vacations: { type: Array, default: () => [] },
  /** غیرفعال کردن دکمه/علامت امروز */
  disableToday: { type: Boolean, default: false },
  /** مخفی کردن دکمه تغییر دوره (ماه/هفته) */
  disablePeriod: { type: Boolean, default: false },
  /** مخفی کردن زمان رویدادها */
  hideEventTimes: { type: Boolean, default: false },
  /** غیرفعال بودن روزهای گذشته برای کلیک */
  disablePastDays: { type: Boolean, default: false },
  /** نمایش دکمه افزودن رویداد (emit روز کلیک‌شده) */
  addEventButton: { type: Boolean, default: false },
  /** حداقل تاریخ قابل نمایش — YYYY/MM/DD */
  minDate: { type: String, default: '' },
  /** حداکثر تاریخ قابل نمایش — YYYY/MM/DD */
  maxDate: { type: String, default: '' },
})

const emit = defineEmits(['day-select', 'event-click', 'display-period-change'])

/** تبدیل YYYY/MM/DD یا ISO به jalali-moment */
function toMoment(value) {
  if (!value) return null
  const s = String(value).trim()
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return moment(s)
  const parts = s.replace(/-/g, '/').split('/')
  if (parts.length >= 3 && parseInt(parts[0], 10) > 1300)
    return moment(s, 'jYYYY/jMM/jDD')
  return moment(s)
}

/** jalali-moment به YYYY/MM/DD */
function toJalaliString(m) {
  if (!m || !m.format) return ''
  return m.format('jYYYY/jMM/jDD')
}

const showDate = computed(() => {
  const d = props.initialDate ? toMoment(props.initialDate) : moment()
  return d && d.isValid() ? d : moment()
})

const minDateMoment = computed(() =>
  props.minDate ? toMoment(props.minDate) : null
)
const maxDateMoment = computed(() =>
  props.maxDate ? toMoment(props.maxDate) : null
)

const eventsList = computed(() => {
  return props.events.map((ev) => {
    const start = toMoment(ev.startDate || ev.start)
    const end = toMoment(ev.endDate || ev.end || ev.startDate || ev.start)
    if (!start || !start.isValid()) return null
    const startDateTime = start.clone().startOf('day')
    const endDateTime = (end && end.isValid() ? end.clone() : start.clone()).endOf('day')
    return {
      startDateTime,
      endDateTime,
      title: ev.title || '',
      color: ev.color || '#29B6F6',
      ...(ev.classes && { classes: ev.classes }),
    }
  }).filter(Boolean)
})

const vacationsList = computed(() => {
  return props.vacations.map((v) => {
    const m = toMoment(v.date)
    if (!m || !m.isValid()) return null
    return {
      date: m,
      title: v.title || v.description || '',
    }
  }).filter(Boolean)
})

function onDayClick(m) {
  if (m && m.format) emit('day-select', toJalaliString(m))
}

function onEventClick(ev) {
  if (!ev) return
  const payload = {
    ...ev,
    startDate: ev.startDateTime ? toJalaliString(ev.startDateTime) : '',
    endDate: ev.endDateTime ? toJalaliString(ev.endDateTime) : '',
  }
  emit('event-click', payload)
}

function onDisplayPeriodChange(period) {
  emit('display-period-change', period)
}
</script>

<template>
  <div class="persian-calendar-wrapper" dir="rtl">
    <component
      :is="jalaliCalendar"
      :show-date="showDate"
      :display-period="displayPeriod"
      :events-list="eventsList"
      :vacations-list="vacationsList"
      :min-date="minDateMoment"
      :max-date="maxDateMoment"
      :disable-today="disableToday"
      :disable-period="disablePeriod"
      :hide-event-times="hideEventTimes"
      :disable-past-days="disablePastDays"
      :add-event-button="addEventButton"
      date-format="jYYYY/jMM/jDD"
      @on-day-click="onDayClick"
      @on-event-click="onEventClick"
      @on-display-period-change="onDisplayPeriodChange"
    ></component>
  </div>
</template>

<style scoped>
.persian-calendar-wrapper {
  --vpc-primary: var(--color-primary, #1e3b8a);
}
.persian-calendar-wrapper :deep(#persian-calendar) {
  max-width: 100%;
}
/* تطبیق با تم پروژه — دکمه‌ها و رنگ امروز */
.persian-calendar-wrapper :deep(.vpc_control-btn),
.persian-calendar-wrapper :deep(.vpc_today-btn),
.persian-calendar-wrapper :deep(.vpc_period-btn) {
  background-color: var(--color-primary, #1e3b8a) !important;
}
.persian-calendar-wrapper :deep(.vpc_day.vpc_today .vpc_day-number) {
  background-color: var(--color-primary-dark, #0d6ebd) !important;
}
</style>
