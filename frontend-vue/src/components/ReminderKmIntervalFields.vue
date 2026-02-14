<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useVehicleStore } from '../stores/vehicle'
import { Input } from './ui'

const props = defineProps({
  vehicleId: {
    type: String,
    default: null
  },
  /** { kmInterval, warningKmBefore } */
  modelValue: {
    type: Object,
    default: () => ({
      kmInterval: 5000,
      warningKmBefore: 500
    })
  }
})

const emit = defineEmits(['update:modelValue'])

const { t } = useI18n()
const vehicleStore = useVehicleStore()

const selectedVehicle = computed(() => {
  if (!props.vehicleId) return null
  return vehicleStore.vehicles.find(v => v.id === props.vehicleId)
})

const currentKm = computed(() => selectedVehicle.value?.currentKm ?? 0)

const calculatedDueKm = computed(() => {
  if (!props.vehicleId || !props.modelValue.kmInterval) return null
  return currentKm.value + (Number(props.modelValue.kmInterval) || 0)
})

function update(partial) {
  emit('update:modelValue', { ...props.modelValue, ...partial })
}
</script>

<template>
  <div class="reminder-km-interval-fields space-y-3">
    <div
      v-if="vehicleId && currentKm > 0"
      class="flex items-center justify-between text-xs py-1.5 px-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800"
    >
      <span class="text-blue-700 dark:text-blue-300">
        {{ t('reminders.form.currentKm') }}
      </span>
      <span class="font-semibold text-blue-600 dark:text-blue-400">
        {{ currentKm.toLocaleString('fa-IR') }} {{ t('common.km') }}
      </span>
    </div>

    <div class="flex gap-2 items-center flex-wrap">
      <div class="flex-1 min-w-[100px]">
        <Input
          :model-value="String(modelValue.kmInterval ?? 5000)"
          type="number"
          min="1"
          :label="t('reminders.form.kmInterval')"
          :placeholder="t('reminders.form.kmIntervalPlaceholder')"
          :disabled="!vehicleId"
          @update:model-value="(v) => update({ kmInterval: parseInt(v, 10) || 0 })"
        />
      </div>
      <span class="px-2.5 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 self-end whitespace-nowrap">
        {{ t('common.km') }}
      </span>
      <div
        v-if="calculatedDueKm !== null"
        class="flex items-center justify-between text-xs py-1.5 px-2 bg-white dark:bg-[#1e293b] rounded border border-gray-200 dark:border-gray-700 min-w-[120px]"
      >
        <span class="text-gray-600 dark:text-gray-400">
          {{ t('reminders.form.calculatedKm', { km: calculatedDueKm.toLocaleString('fa-IR') }) }}
        </span>
      </div>
    </div>

    <Input
      :model-value="String(modelValue.warningKmBefore ?? 500)"
      type="number"
      min="0"
      :label="t('reminders.form.warningKmBefore')"
      @update:model-value="(v) => update({ warningKmBefore: parseInt(v, 10) || 0 })"
    />

    <p
      v-if="!vehicleId"
      class="text-xs text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 p-1.5 rounded border border-orange-200 dark:border-orange-800"
    >
      {{ t('reminders.form.selectVehicleForKm') }}
    </p>
  </div>
</template>
