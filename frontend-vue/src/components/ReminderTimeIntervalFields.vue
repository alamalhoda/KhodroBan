<script setup>
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Input, Select, PersianDatePicker } from './ui'
import { isoToJalaliStr, jalaliToIso } from '../utils/dateUtils'

const props = defineProps({
  /** { timeIntervalPreset, dueDate, warningDaysBefore } — dueDate: ISO YYYY-MM-DD or jalali */
  modelValue: {
    type: Object,
    default: () => ({
      timeIntervalPreset: '30',
      dueDate: null,
      warningDaysBefore: 7
    })
  }
})

const emit = defineEmits(['update:modelValue'])

const { t, locale } = useI18n()
const isPersianLocale = computed(() => locale.value === 'fa')

const timePresets = computed(() => [
  { value: '1', label: t('reminders.presets.tomorrow') },
  { value: '2', label: t('reminders.presets.dayAfter') },
  { value: '7', label: t('reminders.presets.oneWeek') },
  { value: '30', label: t('reminders.presets.oneMonth') },
  { value: '60', label: t('reminders.presets.twoMonths') },
  { value: '90', label: t('reminders.presets.threeMonths') },
  { value: '180', label: t('reminders.presets.sixMonths') },
  { value: '365', label: t('reminders.presets.oneYear') },
  { value: 'custom', label: t('reminders.presets.custom') }
])

function getCalculatedDueDateIso(preset) {
  const days = parseInt(preset, 10)
  if (Number.isNaN(days) || days < 0) return null
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().split('T')[0]
}

const calculatedDueDateIso = computed(() => {
  if (props.modelValue.timeIntervalPreset === 'custom') return props.modelValue.dueDate || getCalculatedDueDateIso('30')
  return getCalculatedDueDateIso(props.modelValue.timeIntervalPreset)
})

watch(
  () => props.modelValue.timeIntervalPreset,
  (preset) => {
    if (preset && preset !== 'custom') {
      const next = getCalculatedDueDateIso(preset)
      if (next) emit('update:modelValue', { ...props.modelValue, dueDate: next })
    }
  },
  { immediate: true }
)

function update(partial) {
  emit('update:modelValue', { ...props.modelValue, ...partial })
}
</script>

<template>
  <div class="reminder-time-interval-fields space-y-3">
    <Select
      :model-value="modelValue.timeIntervalPreset"
      :label="t('reminders.form.timeInterval')"
      :options="timePresets"
      value-key="value"
      label-key="label"
      @update:model-value="(v) => update({ timeIntervalPreset: v })"
    />
    <div class="flex flex-col gap-1">
      <span class="text-sm font-medium text-[#121317] dark:text-gray-200">
        {{ t('reminders.form.calculatedDateLabel') }}
      </span>
      <template v-if="modelValue.timeIntervalPreset === 'custom'">
        <PersianDatePicker
          v-if="isPersianLocale"
          :model-value="isoToJalaliStr(modelValue.dueDate) || ''"
          :placeholder="t('reminders.form.dueDatePlaceholder')"
          @update:model-value="(v) => update({ dueDate: jalaliToIso(v) || v })"
        />
        <Input
          v-else
          :model-value="modelValue.dueDate || ''"
          type="date"
          @update:model-value="(v) => update({ dueDate: v })"
        />
      </template>
      <span v-else class="text-sm text-[#666e85] dark:text-gray-400">
        {{ isPersianLocale ? (modelValue.dueDate ? isoToJalaliStr(modelValue.dueDate) : calculatedDueDateIso) : calculatedDueDateIso }}
      </span>
    </div>
    <Input
      :model-value="String(modelValue.warningDaysBefore ?? 7)"
      type="number"
      min="0"
      :label="t('reminders.form.warningDaysBefore')"
      @update:model-value="(v) => update({ warningDaysBefore: parseInt(v, 10) || 0 })"
    />
  </div>
</template>
