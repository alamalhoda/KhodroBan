<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import MainLayout from '../components/MainLayout.vue'
import { useVehicleStore } from '../stores/vehicle'
import { useUIStore } from '../stores/ui'

const route = useRoute()
const router = useRouter()
const vehicleStore = useVehicleStore()
const uiStore = useUIStore()
const { t } = useI18n()

const isEditMode = computed(() => route.query.action === 'edit' && route.query.id)
const vehicleId = computed(() => route.query.id)

// Form state
const formData = ref({
  model: '',
  year: 1403, // سال شمسی فعلی
  plateNumber: '',
  currentKm: 0,
  note: ''
})

const formErrors = ref({})
const isSubmitting = ref(false)

// Computed
const isFormValid = computed(() => {
  const hasModel = formData.value.model && formData.value.model.trim().length > 0
  // سال شمسی: از 1370 تا 1410
  const hasValidYear = formData.value.year && 
                       formData.value.year >= 1370 && 
                       formData.value.year <= 1410
  const hasPlate = formData.value.plateNumber && formData.value.plateNumber.trim().length > 0
  const hasValidKm = formData.value.currentKm !== null && 
                     formData.value.currentKm !== undefined && 
                     Number(formData.value.currentKm) >= 0
  
  return hasModel && hasValidYear && hasPlate && hasValidKm
})

const pageTitle = computed(() => isEditMode.value ? t('vehicles.form.editTitle') : t('vehicles.form.addTitle'))
const submitButtonText = computed(() => isSubmitting.value ? t('vehicles.form.submitting') : (isEditMode.value ? t('vehicles.form.submitEditing') : t('vehicles.form.submit')))

// Methods
const validateForm = () => {
  const errors = {}
  
  if (!formData.value.model.trim()) {
    errors.model = t('vehicles.form.errors.modelRequired')
  }
  
  if (!formData.value.year || formData.value.year < 1370 || formData.value.year > 1410) {
    errors.year = t('vehicles.form.errors.yearInvalid')
  }
  
  if (!formData.value.plateNumber.trim()) {
    errors.plateNumber = t('vehicles.form.errors.plateRequired')
  }
  
  if (formData.value.currentKm < 0) {
    errors.currentKm = t('vehicles.form.errors.kmInvalid')
  }
  
  formErrors.value = errors
  return Object.keys(errors).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  isSubmitting.value = true
  
  try {
    const vehicleData = {
      model: formData.value.model.trim(),
      year: parseInt(formData.value.year),
      plateNumber: formData.value.plateNumber.trim(),
      currentKm: parseInt(formData.value.currentKm) || 0,
      note: formData.value.note.trim() || undefined
    }
    
    if (isEditMode.value && vehicleId.value) {
      await vehicleStore.updateVehicle(vehicleId.value, vehicleData)
      uiStore.showToast({
        message: t('vehicles.form.success.updated'),
        type: 'success'
      })
      router.push({ name: 'vehicle-details', params: { id: vehicleId.value } })
    } else {
      await vehicleStore.createVehicle(vehicleData)
      uiStore.showToast({
        message: t('vehicles.form.success.created'),
        type: 'success'
      })
      router.push('/vehicle-list')
    }
  } catch (error) {
    uiStore.showToast({
      message: error.message || t('vehicles.form.error'),
      type: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  if (isEditMode.value && vehicleId.value) {
    router.push({ name: 'vehicle-details', params: { id: vehicleId.value } })
  } else {
    router.push('/vehicle-list')
  }
}

// Lifecycle
onMounted(async () => {
  // Fetch vehicles if not already loaded
  if (vehicleStore.vehicles.length === 0) {
    try {
      await vehicleStore.fetchVehicles()
    } catch (error) {
      console.error('Error fetching vehicles:', error)
    }
  }

  // If edit mode, load vehicle data
  if (isEditMode.value && vehicleId.value) {
    try {
      const vehicle = await vehicleStore.getVehicleById(vehicleId.value)
      if (vehicle) {
        formData.value = {
          model: vehicle.model || '',
          year: vehicle.year || new Date().getFullYear(),
          plateNumber: vehicle.plateNumber || '',
          currentKm: vehicle.currentKm || 0,
          note: vehicle.note || ''
        }
      }
    } catch (error) {
      uiStore.showToast({
        message: error.message || t('vehicles.details.error'),
        type: 'error'
      })
      router.push('/vehicle-list')
    }
  }
})
</script>

<template>
  <MainLayout>
    <div class="flex flex-col gap-8">
      <!-- Header -->
      <div class="flex flex-col gap-1">
        <h1 class="text-[#121317] dark:text-white tracking-tight text-[28px] md:text-[32px] font-bold leading-tight">{{ pageTitle }}</h1>
        <p class="text-[#666e85] dark:text-gray-400 text-sm font-normal leading-normal">
          {{ isEditMode ? t('vehicles.form.editSubtitle') : t('vehicles.form.addSubtitle') }}
        </p>
      </div>

      <!-- Form -->
      <div class="bg-white dark:bg-[#1A202C] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <form @submit.prevent="handleSubmit" class="p-6 sm:p-8 space-y-8">
          <!-- Model and Year -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label class="flex flex-col gap-2">
              <span class="text-[#121317] dark:text-gray-200 text-sm font-medium leading-normal">
                {{ t('vehicles.form.model') }} <span class="text-red-500">{{ t('vehicles.form.required') }}</span>
              </span>
              <div class="relative">
                <span class="material-symbols-outlined absolute start-4 top-3 text-gray-400 text-[20px]">directions_car</span>
                <input 
                  v-model="formData.model"
                  class="form-input w-full rounded-xl border border-[#dcdfe4] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#121317] dark:text-white h-12 ps-11 pe-4 focus:border-primary focus:ring-1 focus:ring-primary transition-shadow" 
                  :class="{ 'border-red-500': formErrors.model }"
                  :placeholder="t('vehicles.form.modelPlaceholder')" 
                  type="text" 
                />
                <p v-if="formErrors.model" class="text-red-500 text-xs mt-1">{{ formErrors.model }}</p>
              </div>
            </label>
            
            <label class="flex flex-col gap-2">
              <span class="text-[#121317] dark:text-gray-200 text-sm font-medium leading-normal">
                {{ t('vehicles.form.year') }} <span class="text-red-500">{{ t('vehicles.form.required') }}</span>
              </span>
              <div class="relative">
                <span class="material-symbols-outlined absolute start-4 top-3 text-gray-400 text-[20px]">calendar_today</span>
                <input 
                  v-model.number="formData.year"
                  class="form-input w-full rounded-xl border border-[#dcdfe4] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#121317] dark:text-white h-12 ps-11 pe-4 focus:border-primary focus:ring-1 focus:ring-primary transition-shadow dir-ltr text-right" 
                  :class="{ 'border-red-500': formErrors.year }"
                  :placeholder="t('vehicles.form.yearPlaceholder')" 
                  type="number"
                  :min="1370"
                  :max="1410"
                />
                <p v-if="formErrors.year" class="text-red-500 text-xs mt-1">{{ formErrors.year }}</p>
              </div>
            </label>
          </div>

          <!-- Plate Number and Current KM -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label class="flex flex-col gap-2">
              <span class="text-[#121317] dark:text-gray-200 text-sm font-medium leading-normal">
                {{ t('vehicles.form.plateNumber') }} <span class="text-red-500">{{ t('vehicles.form.required') }}</span>
              </span>
              <div class="relative">
                <span class="material-symbols-outlined absolute start-4 top-3 text-gray-400 text-[20px]">badge</span>
                <input 
                  v-model="formData.plateNumber"
                  class="form-input w-full rounded-xl border border-[#dcdfe4] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#121317] dark:text-white h-12 ps-11 pe-4 focus:border-primary focus:ring-1 focus:ring-primary transition-shadow" 
                  :class="{ 'border-red-500': formErrors.plateNumber }"
                  :placeholder="t('vehicles.form.plateNumberPlaceholder')" 
                  type="text" 
                />
                <p v-if="formErrors.plateNumber" class="text-red-500 text-xs mt-1">{{ formErrors.plateNumber }}</p>
              </div>
            </label>
            
            <label class="flex flex-col gap-2">
              <span class="text-[#121317] dark:text-gray-200 text-sm font-medium leading-normal">
                {{ t('vehicles.form.currentKm') }}
              </span>
              <div class="relative">
                <span class="material-symbols-outlined absolute start-4 top-3 text-gray-400 text-[20px]">speed</span>
                <input 
                  v-model.number="formData.currentKm"
                  class="form-input w-full rounded-xl border border-[#dcdfe4] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#121317] dark:text-white h-12 ps-11 pe-4 focus:border-primary focus:ring-1 focus:ring-primary transition-shadow dir-ltr text-right font-mono" 
                  :class="{ 'border-red-500': formErrors.currentKm }"
                  :placeholder="t('vehicles.form.currentKmPlaceholder')" 
                  type="number"
                  :min="0"
                />
                <span class="absolute left-16 top-3 text-gray-400 text-sm">km</span>
                <p v-if="formErrors.currentKm" class="text-red-500 text-xs mt-1">{{ formErrors.currentKm }}</p>
              </div>
            </label>
          </div>

          <!-- Note -->
          <label class="flex flex-col gap-2">
            <span class="text-[#121317] dark:text-gray-200 text-sm font-medium leading-normal">{{ t('vehicles.form.note') }}</span>
            <textarea 
              v-model="formData.note"
              class="form-textarea w-full rounded-xl border border-[#dcdfe4] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#121317] dark:text-white min-h-[100px] p-4 focus:border-primary focus:ring-1 focus:ring-primary transition-shadow resize-y" 
              :placeholder="t('vehicles.form.notePlaceholder')"
            ></textarea>
          </label>
          
          <!-- Error display -->
          <div v-if="vehicleStore.error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p class="text-red-700 dark:text-red-400 text-sm">{{ vehicleStore.error }}</p>
          </div>
          
          <!-- Actions -->
          <div class="pt-4 flex flex-col sm:flex-row justify-end gap-4 border-t border-gray-200 dark:border-gray-700">
            <button 
              @click="handleCancel"
              class="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#dcdfe4] dark:border-gray-600 text-[#121317] dark:text-white font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" 
              type="button"
              :disabled="isSubmitting"
            >
              {{ t('vehicles.form.cancel') }}
            </button>
            <button 
              class="w-full sm:w-auto px-8 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" 
              type="submit"
              :disabled="!isFormValid || isSubmitting"
            >
              <span v-if="isSubmitting" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
              <span v-else class="material-symbols-outlined text-[18px]">save</span>
              {{ submitButtonText }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </MainLayout>
</template>
