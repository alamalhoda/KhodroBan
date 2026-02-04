<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useVehicleStore } from '../stores/vehicle'
import { Input, Select, Button } from './ui'

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
  
  // بازه زمانی
  timeIntervalPreset: 'custom', // '10', '30', '90', 'custom'
  timeInterval: 90,
  timeIntervalType: 'days', // 'days' | 'weeks' | 'months'
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

// Preset options
const timePresets = computed(() => [
  { value: '10', label: t('reminders.presets.10days') },
  { value: '30', label: t('reminders.presets.30days') },
  { value: '90', label: t('reminders.presets.90days') },
  { value: 'custom', label: t('reminders.presets.custom') }
])

// Vehicle options
const vehicleOptions = computed(() => {
  const options = vehicleStore.vehicles.map(v => ({
    value: v.id,
    label: `${v.model} - ${v.year}`
  }))
  return [{ value: '', label: t('vehicles.selectVehicle') }, ...options]
})

// Time unit options
const timeUnitOptions = computed(() => [
  { value: 'days', label: t('reminders.form.days') },
  { value: 'weeks', label: t('reminders.form.weeks') },
  { value: 'months', label: t('reminders.form.months') }
])

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
  const hasTime = formData.value.timeIntervalPreset && formData.value.timeInterval
  const hasKm = formData.value.kmInterval && formData.value.vehicleId
  
  if (hasTime && hasKm) return 'both'
  if (hasTime) return 'time'
  if (hasKm) return 'km'
  return 'both' // default
})

const calculatedDueDate = computed(() => {
  if (formData.value.timeIntervalPreset === 'custom' && formData.value.dueDate) {
    return formData.value.dueDate
  }
  
  if (formData.value.timeIntervalPreset === 'custom') {
    // Calculate from interval
    const date = new Date()
    const interval = formData.value.timeInterval
    
    if (formData.value.timeIntervalType === 'days') {
      date.setDate(date.getDate() + interval)
    } else if (formData.value.timeIntervalType === 'weeks') {
      date.setDate(date.getDate() + (interval * 7))
    } else if (formData.value.timeIntervalType === 'months') {
      date.setMonth(date.getMonth() + interval)
    }
    
    return date.toISOString().split('T')[0]
  }
  
  // Use preset
  const days = parseInt(formData.value.timeIntervalPreset) || formData.value.timeInterval
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().split('T')[0]
})

const calculatedDueKm = computed(() => {
  const vehicleId = formData.value.vehicleId || props.vehicleId
  if (!vehicleId || !formData.value.kmInterval) return null
  return currentKm.value + formData.value.kmInterval
})

// Watch for preset changes
watch(() => formData.value.timeIntervalPreset, (newVal) => {
  if (newVal !== 'custom') {
    formData.value.timeInterval = parseInt(newVal)
    formData.value.dueDate = null // Clear custom date when preset is selected
  }
})

watch(() => formData.value.timeInterval, () => {
  if (formData.value.timeIntervalPreset === 'custom') {
    formData.value.dueDate = calculatedDueDate.value
  }
})

watch(() => formData.value.timeIntervalType, () => {
  if (formData.value.timeIntervalPreset === 'custom') {
    formData.value.dueDate = calculatedDueDate.value
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
    formData.value.timeInterval = props.defaultInterval.days || 90
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
  } else {
    // Set default due date
    formData.value.dueDate = calculatedDueDate.value
  }
})

// Methods
const handleSubmit = () => {
  if (!formData.value.title.trim()) {
    return
  }
  
  const reminderData = {
    title: formData.value.title.trim(),
    description: formData.value.description?.trim() || null,
    vehicleId: formData.value.vehicleId || props.vehicleId || null,
    serviceId: props.serviceId || null,
    source: props.mode,
    type: formData.value.type || null,
    
    // بازه زمانی
    ...(reminderType.value === 'time' || reminderType.value === 'both' ? {
      dueDate: calculatedDueDate.value
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

      <!-- Vehicle Selection -->
      <div>
        <label class="block text-xs font-medium mb-1.5 text-[#121317] dark:text-white">
          {{ t('vehicles.selectVehicle') }}
        </label>
        <Select 
          v-model="formData.vehicleId" 
          :options="vehicleOptions"
          class="w-full text-sm"
        />
      </div>
    </div>

    <!-- Intervals Section - Two Columns -->
    <div v-if="reminderType === 'both'" class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <!-- Time Interval Section -->
      <div class="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-3 space-y-2.5 border border-gray-100 dark:border-gray-700">
        <div class="flex items-center justify-between pb-1.5 border-b border-gray-200 dark:border-gray-700">
          <span class="text-xs font-semibold text-[#121317] dark:text-white">
            {{ t('reminders.form.timeInterval') }}
          </span>
        </div>

        <!-- Preset Dropdown and Due Date in one row -->
        <div class="flex gap-2 items-center">
          <div class="flex-1">
            <Select 
              v-model="formData.timeIntervalPreset" 
              :options="timePresets"
              class="w-full text-sm"
            />
          </div>
          <div class="flex items-center justify-between text-xs py-1.5 px-2 bg-white dark:bg-[#1e293b] rounded border border-gray-200 dark:border-gray-700 min-w-[140px]">
            <span class="text-gray-600 dark:text-gray-400 mr-1">
              {{ t('reminders.form.calculatedDate') }}
            </span>
            <span class="font-semibold text-primary">
              {{ calculatedDueDate }}
            </span>
          </div>
        </div>

        <!-- Custom Interval -->
        <div v-if="formData.timeIntervalPreset === 'custom'" class="flex gap-2">
          <div class="flex-1">
            <Input
              v-model.number="formData.timeInterval"
              type="number"
              min="1"
              class="w-full text-sm"
              :placeholder="t('reminders.form.timeInterval')"
            />
          </div>
          <div class="w-28">
            <Select 
              v-model="formData.timeIntervalType" 
              :options="timeUnitOptions"
              class="w-full text-sm"
            />
          </div>
        </div>

        <!-- Warning Days -->
        <div>
          <label class="block text-xs font-medium mb-1 text-[#121317] dark:text-white">
            {{ t('reminders.form.warningDaysBefore') }}
          </label>
          <Input
            v-model.number="formData.warningDaysBefore"
            type="number"
            min="0"
            class="w-full text-sm"
          />
        </div>
      </div>

      <!-- Distance Interval Section -->
      <div class="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-3 space-y-2.5 border border-gray-100 dark:border-gray-700">
        <div class="flex items-center justify-between pb-1.5 border-b border-gray-200 dark:border-gray-700">
          <span class="text-xs font-semibold text-[#121317] dark:text-white">
            {{ t('reminders.form.kmInterval') }}
          </span>
        </div>

        <!-- Current Km Display -->
        <div v-if="formData.vehicleId && currentKm > 0" class="flex items-center justify-between text-xs py-1.5 px-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
          <span class="text-blue-700 dark:text-blue-300">
            {{ t('reminders.form.currentKm') }}
          </span>
          <span class="font-semibold text-blue-600 dark:text-blue-400">
            {{ currentKm.toLocaleString('fa-IR') }} {{ t('common.km') }}
          </span>
        </div>

        <!-- Interval Input and Due Km in one row -->
        <div class="flex gap-2 items-center">
          <div class="flex gap-2 flex-1">
            <div class="flex-1">
              <Input
                v-model.number="formData.kmInterval"
                type="number"
                min="1"
                class="w-full text-sm"
                :placeholder="t('reminders.form.kmIntervalPlaceholder')"
                :disabled="!formData.vehicleId"
              />
            </div>
            <span class="px-2.5 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 self-center whitespace-nowrap">
              {{ t('common.km') }}
            </span>
          </div>
          <div v-if="calculatedDueKm" class="flex items-center justify-between text-xs py-1.5 px-2 bg-white dark:bg-[#1e293b] rounded border border-gray-200 dark:border-gray-700 min-w-[140px]">
            <span class="text-gray-600 dark:text-gray-400 mr-1">
              {{ t('reminders.form.calculatedKm') }}
            </span>
            <span class="font-semibold text-primary">
              {{ calculatedDueKm.toLocaleString('fa-IR') }}
            </span>
          </div>
        </div>

        <!-- Warning Km -->
        <div>
          <label class="block text-xs font-medium mb-1 text-[#121317] dark:text-white">
            {{ t('reminders.form.warningKmBefore') }}
          </label>
          <Input
            v-model.number="formData.warningKmBefore"
            type="number"
            min="0"
            class="w-full text-sm"
          />
        </div>

        <!-- Vehicle Selection Hint -->
        <p v-if="!formData.vehicleId" class="text-xs text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 p-1.5 rounded border border-orange-200 dark:border-orange-800">
          {{ t('reminders.form.selectVehicleForKm') }}
        </p>
      </div>
    </div>

    <!-- Time Only Section -->
    <div v-else-if="reminderType === 'time'" class="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-3 space-y-2.5 border border-gray-100 dark:border-gray-700">
      <div class="flex items-center justify-between pb-1.5 border-b border-gray-200 dark:border-gray-700">
        <span class="text-xs font-semibold text-[#121317] dark:text-white">
          {{ t('reminders.form.timeInterval') }}
        </span>
      </div>

      <!-- Preset Dropdown and Due Date in one row -->
      <div class="flex gap-2 items-center">
        <div class="flex-1">
          <Select 
            v-model="formData.timeIntervalPreset" 
            :options="timePresets"
            class="w-full text-sm"
          />
        </div>
        <div class="flex items-center justify-between text-xs py-1.5 px-2 bg-white dark:bg-[#1e293b] rounded border border-gray-200 dark:border-gray-700 min-w-[140px]">
          <span class="text-gray-600 dark:text-gray-400 mr-1">
            {{ t('reminders.form.calculatedDate') }}
          </span>
          <span class="font-semibold text-primary">
            {{ calculatedDueDate }}
          </span>
        </div>
      </div>

      <!-- Custom Interval -->
      <div v-if="formData.timeIntervalPreset === 'custom'" class="flex gap-2">
        <div class="flex-1">
          <Input
            v-model.number="formData.timeInterval"
            type="number"
            min="1"
            class="w-full text-sm"
            :placeholder="t('reminders.form.timeInterval')"
          />
        </div>
        <div class="w-28">
          <Select 
            v-model="formData.timeIntervalType" 
            :options="timeUnitOptions"
            class="w-full text-sm"
          />
        </div>
      </div>

      <!-- Warning Days -->
      <div>
        <label class="block text-xs font-medium mb-1 text-[#121317] dark:text-white">
          {{ t('reminders.form.warningDaysBefore') }}
        </label>
        <Input
          v-model.number="formData.warningDaysBefore"
          type="number"
          min="0"
          class="w-full text-sm"
        />
      </div>
    </div>

    <!-- Distance Only Section -->
    <div v-else-if="reminderType === 'km'" class="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-3 space-y-2.5 border border-gray-100 dark:border-gray-700">
      <div class="flex items-center justify-between pb-1.5 border-b border-gray-200 dark:border-gray-700">
        <span class="text-xs font-semibold text-[#121317] dark:text-white">
          {{ t('reminders.form.kmInterval') }}
        </span>
      </div>

      <!-- Current Km Display -->
      <div v-if="formData.vehicleId && currentKm > 0" class="flex items-center justify-between text-xs py-1.5 px-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
        <span class="text-blue-700 dark:text-blue-300">
          {{ t('reminders.form.currentKm') }}
        </span>
        <span class="font-semibold text-blue-600 dark:text-blue-400">
          {{ currentKm.toLocaleString('fa-IR') }} {{ t('common.km') }}
        </span>
      </div>

      <!-- Interval Input and Due Km in one row -->
      <div class="flex gap-2 items-center">
        <div class="flex gap-2 flex-1">
          <div class="flex-1">
            <Input
              v-model.number="formData.kmInterval"
              type="number"
              min="1"
              class="w-full text-sm"
              :placeholder="t('reminders.form.kmIntervalPlaceholder')"
              :disabled="!formData.vehicleId"
            />
          </div>
          <span class="px-2.5 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 self-center whitespace-nowrap">
            {{ t('common.km') }}
          </span>
        </div>
        <div v-if="calculatedDueKm" class="flex items-center justify-between text-xs py-1.5 px-2 bg-white dark:bg-[#1e293b] rounded border border-gray-200 dark:border-gray-700 min-w-[140px]">
          <span class="text-gray-600 dark:text-gray-400 mr-1">
            {{ t('reminders.form.calculatedKm') }}
          </span>
          <span class="font-semibold text-primary">
            {{ calculatedDueKm.toLocaleString('fa-IR') }}
          </span>
        </div>
      </div>

      <!-- Warning Km -->
      <div>
        <label class="block text-xs font-medium mb-1 text-[#121317] dark:text-white">
          {{ t('reminders.form.warningKmBefore') }}
        </label>
        <Input
          v-model.number="formData.warningKmBefore"
          type="number"
          min="0"
          class="w-full text-sm"
        />
      </div>

      <!-- Vehicle Selection Hint -->
      <p v-if="!formData.vehicleId" class="text-xs text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 p-1.5 rounded border border-orange-200 dark:border-orange-800">
        {{ t('reminders.form.selectVehicleForKm') }}
      </p>
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

