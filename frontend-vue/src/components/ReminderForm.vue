<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useVehicleStore } from '../stores/vehicle'
import { Input, Select, Button } from './ui'
import VehicleFilterSelect from './VehicleFilterSelect.vue'
import ReminderTimeIntervalFields from './ReminderTimeIntervalFields.vue'
import ReminderKmIntervalFields from './ReminderKmIntervalFields.vue'

const props = defineProps({
  vehicleId: {
    type: String,
    default: null
  },
  serviceId: {
    type: String,
    default: null
  },
  defaultInterval: {
    type: Object,
    default: () => ({ days: 90, km: 5000 })
  },
  mode: {
    type: String,
    default: 'manual' // 'manual' | 'auto'
  },
  initialData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['submit', 'cancel'])

const { t } = useI18n()
const vehicleStore = useVehicleStore()

// State
const formData = ref({
  title: '',
  description: '',
  vehicleId: null,
  
  // بازه زمانی — فقط preset و تاریخ موعد (بدون فیلد تعداد/نوع)
  timeIntervalPreset: '30', // '1'|'2'|'7'|'30'|'60'|'90'|'180'|'365'|'custom'
  dueDate: null,
  
  // بازه کیلومتری
  kmInterval: 5000,
  dueKm: null,
  
  // هشدار
  warningDaysBefore: 7,
  warningKmBefore: 500,
  
  // نوع یادآور
  type: null
})

// Computed
const selectedVehicle = computed(() => {
  const vehicleId = formData.value.vehicleId || props.vehicleId
  if (!vehicleId) return null
  return vehicleStore.vehicles.find(v => v.id === vehicleId)
})

const currentKm = computed(() => {
  return selectedVehicle.value?.currentKm || 0
})

// Determine reminder type automatically based on filled fields
const reminderType = computed(() => {
  const hasTime = !!formData.value.timeIntervalPreset
  const hasKm = formData.value.kmInterval && formData.value.vehicleId

  if (hasTime && hasKm) return 'both'
  if (hasTime) return 'time'
  if (hasKm) return 'km'
  return 'both' // default
})

// تاریخ موعد بر اساس preset: عدد = امروز + N روز؛ custom = همان formData.dueDate یا پیش‌فرض
const calculatedDueDate = computed(() => {
  if (formData.value.timeIntervalPreset === 'custom') {
    return formData.value.dueDate || getDefaultDueDate()
  }
  const days = parseInt(formData.value.timeIntervalPreset, 10) || 30
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().split('T')[0]
})

function getDefaultDueDate() {
  const date = new Date()
  date.setDate(date.getDate() + 30)
  return date.toISOString().split('T')[0]
}

const calculatedDueKm = computed(() => {
  const vehicleId = formData.value.vehicleId || props.vehicleId
  if (!vehicleId || !formData.value.kmInterval) return null
  return currentKm.value + formData.value.kmInterval
})

// Two-way binding for reusable interval components
const timeIntervalModel = computed({
  get: () => ({
    timeIntervalPreset: formData.value.timeIntervalPreset,
    dueDate: formData.value.dueDate,
    warningDaysBefore: formData.value.warningDaysBefore
  }),
  set: (v) => {
    if (v.timeIntervalPreset != null) formData.value.timeIntervalPreset = v.timeIntervalPreset
    if (v.dueDate != null) formData.value.dueDate = v.dueDate
    if (v.warningDaysBefore != null) formData.value.warningDaysBefore = v.warningDaysBefore
  }
})

const kmIntervalModel = computed({
  get: () => ({
    kmInterval: formData.value.kmInterval,
    warningKmBefore: formData.value.warningKmBefore
  }),
  set: (v) => {
    if (v.kmInterval != null) formData.value.kmInterval = v.kmInterval
    if (v.warningKmBefore != null) formData.value.warningKmBefore = v.warningKmBefore
  }
})

// Initialize form
onMounted(() => {
  // Load vehicles if not loaded
  if (vehicleStore.vehicles.length === 0) {
    vehicleStore.fetchVehicles()
  }
  
  // Set default values
  if (props.defaultInterval) {
    const days = props.defaultInterval.days || 30
    const presetMap = { 1: '1', 2: '2', 7: '7', 30: '30', 60: '60', 90: '90', 180: '180', 365: '365' }
    formData.value.timeIntervalPreset = presetMap[days] || '30'
    formData.value.kmInterval = props.defaultInterval.km || 5000
  }
  
  // Set vehicleId from props if provided
  if (props.vehicleId) {
    formData.value.vehicleId = props.vehicleId
  }
  
  // Load initial data if editing
  if (props.initialData) {
    formData.value.title = props.initialData.title || ''
    formData.value.description = props.initialData.description || ''
    formData.value.vehicleId = props.initialData.vehicleId || props.vehicleId || null
    formData.value.dueDate = props.initialData.dueDate || null
    formData.value.dueKm = props.initialData.dueKm || null
    formData.value.warningDaysBefore = props.initialData.warningDaysBefore || 7
    formData.value.warningKmBefore = props.initialData.warningKmBefore || 500
    formData.value.type = props.initialData.type || null
    formData.value.timeIntervalPreset = 'custom' // ویرایش: تاریخ ذخیره‌شده در فیلد نمایش داده می‌شود
  } else {
    if (!props.defaultInterval) formData.value.timeIntervalPreset = '30'
    formData.value.dueDate = calculatedDueDate.value
  }
})

// Methods
const handleSubmit = () => {
  if (!formData.value.title.trim()) {
    return
  }
  
  const dueDateForSubmit = formData.value.dueDate || calculatedDueDate.value

  const reminderData = {
    title: formData.value.title.trim(),
    description: formData.value.description?.trim() || null,
    vehicleId: formData.value.vehicleId || props.vehicleId || null,
    serviceId: props.serviceId || null,
    source: props.mode,
    type: formData.value.type || null,
    
    // بازه زمانی
    ...(reminderType.value === 'time' || reminderType.value === 'both' ? {
      dueDate: dueDateForSubmit
    } : {}),
    
    // بازه کیلومتری
    ...(reminderType.value === 'km' || reminderType.value === 'both' ? {
      dueKm: calculatedDueKm.value
    } : {}),
    
    // هشدار
    warningDaysBefore: formData.value.warningDaysBefore,
    warningKmBefore: formData.value.warningKmBefore
  }
  
  emit('submit', reminderData)
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<template>
  <div class="reminder-form space-y-4">
    <!-- Basic Info -->
    <div class="space-y-3">
      <!-- Title -->
      <div>
        <label class="block text-xs font-medium mb-1.5 text-[#121317] dark:text-white">
          {{ t('reminders.form.title') }} <span class="text-red-500">*</span>
        </label>
        <Input
          v-model="formData.title"
          :placeholder="t('reminders.form.titlePlaceholder')"
          required
          class="w-full text-sm"
        />
      </div>

      <!-- Vehicle Selection (فیلتر انتخاب خودرو) -->
      <div>
        <label class="block text-xs font-medium mb-1.5 text-[#121317] dark:text-white">
          {{ t('vehicles.selectVehicle') }}
        </label>
        <VehicleFilterSelect
          :model-value="formData.vehicleId ?? ''"
          :show-all-option="false"
          :placeholder="t('vehicles.selectVehicle')"
          wrapper-class="w-full text-sm"
          @update:model-value="formData.vehicleId = $event || null"
        />
      </div>
    </div>

    <!-- Intervals Section: reusable time + km components -->
    <div v-if="reminderType === 'both'" class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div class="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-3 space-y-2.5 border border-gray-100 dark:border-gray-700">
        <ReminderTimeIntervalFields v-model="timeIntervalModel" />
      </div>
      <div class="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-3 space-y-2.5 border border-gray-100 dark:border-gray-700">
        <ReminderKmIntervalFields
          :vehicle-id="formData.vehicleId || vehicleId"
          v-model="kmIntervalModel"
        />
      </div>
    </div>
    <div v-else-if="reminderType === 'time'" class="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-3 space-y-2.5 border border-gray-100 dark:border-gray-700">
      <ReminderTimeIntervalFields v-model="timeIntervalModel" />
    </div>
    <div v-else-if="reminderType === 'km'" class="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-3 space-y-2.5 border border-gray-100 dark:border-gray-700">
      <ReminderKmIntervalFields
        :vehicle-id="formData.vehicleId || vehicleId"
        v-model="kmIntervalModel"
      />
    </div>

    <!-- Description -->
    <div>
      <label class="block text-xs font-medium mb-1.5 text-[#121317] dark:text-white">
        {{ t('reminders.form.description') }}
      </label>
      <textarea
        v-model="formData.description"
        class="w-full p-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-[#1e293b] text-[#121317] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
        rows="2"
        :placeholder="t('reminders.form.descriptionPlaceholder')"
      />
    </div>

    <!-- Actions -->
    <div class="flex gap-2 justify-end pt-3 border-t border-gray-200 dark:border-gray-700">
      <Button @click="handleCancel" variant="outline" size="sm" class="px-4">
        {{ t('common.cancel') }}
      </Button>
      <Button 
        @click="handleSubmit" 
        :disabled="!formData.title.trim()"
        size="sm"
        class="px-4"
      >
        {{ t('common.save') }}
      </Button>
    </div>
  </div>
</template>

<style scoped>
.reminder-form {
  max-width: 100%;
}

/* Smaller input fields */
.reminder-form :deep(.input) {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  min-height: 2.25rem;
}

.reminder-form :deep(.select) {
  padding: 0.5rem 2.5rem 0.5rem 0.75rem;
  font-size: 0.875rem;
  min-height: 2.25rem;
}

.reminder-form :deep(.input-label),
.reminder-form :deep(.select-label) {
  font-size: 0.75rem;
  margin-bottom: 0.375rem;
}
</style>

