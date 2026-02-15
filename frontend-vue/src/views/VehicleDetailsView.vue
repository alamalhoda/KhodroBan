<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import MainLayout from '../components/MainLayout.vue'
import Modal from '../components/ui/Modal.vue'
import { useFormatDate } from '../composables/useFormatDate'
import { formatCurrency } from '@/utils/formatters'
import { useVehicleStore } from '../stores/vehicle'
import { useServiceStore } from '../stores/service'
import { useExpenseStore } from '../stores/expense'
import { useReminderStore } from '../stores/reminder'
import { useUIStore } from '../stores/ui'
import { vehicleGalleryService } from '../services'
import { DEFAULT_VEHICLE_ICON, DEFAULT_VEHICLE_ICON_STYLE, DEFAULT_VEHICLE_ICON_COLOR, getEffectiveIconStyle, getVehicleIconDuotoneStyle } from '../config/vehicleIcons'

const route = useRoute()
const router = useRouter()
const vehicleStore = useVehicleStore()
const serviceStore = useServiceStore()
const expenseStore = useExpenseStore()
const reminderStore = useReminderStore()
const uiStore = useUIStore()
const { t } = useI18n()
const formatDate = useFormatDate()

const showDeleteConfirm = ref(false)
const showKmModal = ref(false)
const newKmValue = ref(0)
const isSubmittingKm = ref(false)
const galleryImages = ref([])
const galleryLoading = ref(false)
const galleryUploading = ref(false)
const galleryFileInput = ref(null)

const vehicleId = computed(() => route.params.id)
const vehicle = computed(() => vehicleStore.vehicleById(vehicleId.value))
const isEditMode = computed(() => route.query.edit === 'true')
const activeTab = ref('services')

const servicesForVehicle = computed(() => {
  if (!vehicleId.value) return []
  return serviceStore.servicesByVehicle(vehicleId.value)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
})

/** خلاصه هزینه فقط برای همین خودرو (سرویس‌ها؛ بعداً هزینه‌ها هم اضافه می‌شود) */
const summaryCostThisVehicle = computed(() => {
  const services = servicesForVehicle.value
  return services.reduce((sum, s) => sum + (Number(s.cost) || 0), 0)
})

/** هزینه‌های همین خودرو (از store؛ در onMounted با fetchExpenses(vehicleId) پر شده) */
const expensesForThisVehicle = computed(() => {
  if (!vehicleId.value) return []
  return expenseStore.expensesByVehicle(vehicleId.value)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
})

/** هزینه‌های دسته سوخت همین خودرو */
const fuelExpensesForVehicle = computed(() => {
  return expensesForThisVehicle.value.filter(e => e.category === 'fuel')
})

/** یادآورهای همین خودرو */
const remindersForThisVehicle = computed(() => {
  if (!vehicleId.value) return []
  return reminderStore.remindersByVehicle(vehicleId.value)
})

/** تصویر پیش‌فرض گالری (اول پیش‌فرض، وگرنه اولین تصویر) */
const defaultGalleryImage = computed(() => {
  const list = galleryImages.value
  return list.find(img => img.isDefault) || list[0] || null
})

/** آیکون و رنگ خودرو برای نمایش (با مقادیر پیش‌فرض) */
const vehicleIconClass = computed(() => {
  const name = vehicle.value?.iconName || DEFAULT_VEHICLE_ICON
  const style = vehicle.value?.iconStyle || DEFAULT_VEHICLE_ICON_STYLE
  return `fa fa-${getEffectiveIconStyle(style)} fa-${name}`
})
const vehicleIconStyle = computed(() =>
  getVehicleIconDuotoneStyle(vehicle.value?.iconColor, vehicle.value?.iconColorSecondary)
)

const MAX_GALLERY_IMAGES = 15

onMounted(async () => {
  // Fetch vehicle if not in store
  if (!vehicle.value && vehicleId.value) {
    try {
      await vehicleStore.getVehicleById(vehicleId.value)
    } catch (error) {
      uiStore.showToast({
        message: error.message || t('vehicles.details.error'),
        type: 'error'
      })
      router.push('/vehicle-list')
      return
    }
  }

  // Fetch services for this vehicle
  if (vehicleId.value) {
    try {
      await serviceStore.fetchServices(vehicleId.value)
    } catch (error) {
      console.error('Error fetching services:', error)
    }
    try {
      await expenseStore.fetchExpenses(vehicleId.value)
    } catch (error) {
      console.error('Error fetching expenses:', error)
    }
    try {
      await reminderStore.fetchReminders(vehicleId.value)
    } catch (error) {
      console.error('Error fetching reminders:', error)
    }
    try {
      galleryLoading.value = true
      galleryImages.value = await vehicleGalleryService.listByVehicleId(vehicleId.value)
    } catch (error) {
      console.error('Error fetching gallery:', error)
      galleryImages.value = []
    } finally {
      galleryLoading.value = false
    }
  }
})

const loadGallery = async () => {
  if (!vehicleId.value) return
  galleryLoading.value = true
  try {
    galleryImages.value = await vehicleGalleryService.listByVehicleId(vehicleId.value)
  } catch (error) {
    uiStore.showToast({ message: error.message || t('vehicles.galleryError'), type: 'error' })
  } finally {
    galleryLoading.value = false
  }
}

const handleGalleryUpload = async (event) => {
  const file = event.target?.files?.[0]
  if (!file || !vehicleId.value) return
  if (galleryImages.value.length >= MAX_GALLERY_IMAGES) {
    uiStore.showToast({ message: t('vehicles.galleryMaxReached', { max: MAX_GALLERY_IMAGES }), type: 'warning' })
    return
  }
  galleryUploading.value = true
  try {
    await vehicleGalleryService.upload(vehicleId.value, file, { isDefault: galleryImages.value.length === 0 })
    await loadGallery()
    uiStore.showToast({ message: t('vehicles.galleryUploadSuccess'), type: 'success' })
  } catch (error) {
    uiStore.showToast({ message: error.message || t('vehicles.galleryError'), type: 'error' })
  } finally {
    galleryUploading.value = false
    event.target.value = ''
  }
}

const handleGalleryDelete = async (imageId) => {
  try {
    await vehicleGalleryService.delete(imageId)
    await loadGallery()
    uiStore.showToast({ message: t('vehicles.galleryDeleteSuccess'), type: 'success' })
  } catch (error) {
    uiStore.showToast({ message: error.message || t('vehicles.galleryError'), type: 'error' })
  }
}

const handleGallerySetDefault = async (imageId) => {
  try {
    await vehicleGalleryService.setDefault(imageId)
    await loadGallery()
    uiStore.showToast({ message: t('vehicles.gallerySetDefaultSuccess'), type: 'success' })
  } catch (error) {
    uiStore.showToast({ message: error.message || t('vehicles.galleryError'), type: 'error' })
  }
}

const handleEdit = () => {
  router.push({ 
    name: 'vehicle-management', 
    query: { action: 'edit', id: vehicleId.value } 
  })
}

const handleDeleteClick = () => {
  showDeleteConfirm.value = true
}

const handleDeleteConfirm = async () => {
  try {
    await vehicleStore.deleteVehicle(vehicleId.value)
    uiStore.showToast({
      message: t('vehicles.details.deleteSuccess'),
      type: 'success'
    })
    showDeleteConfirm.value = false
    router.push('/vehicle-list')
  } catch (error) {
    uiStore.showToast({
      message: error.message || t('vehicles.details.deleteError'),
      type: 'error'
    })
  }
}

const handleDeleteCancel = () => {
  showDeleteConfirm.value = false
}

const handleAddRecord = () => {
  router.push({ 
    name: 'add-service', 
    query: { vehicleId: vehicleId.value } 
  })
}

const handleAddExpense = () => {
  router.push({ 
    name: 'add-service', 
    query: { vehicleId: vehicleId.value, tab: 'expense' } 
  })
}

const handleOpenKmModal = () => {
  newKmValue.value = vehicle.value?.currentKm ?? 0
  showKmModal.value = true
}

const handleCloseKmModal = () => {
  showKmModal.value = false
}

const handleSubmitKmModal = async () => {
  const km = Number(newKmValue.value)
  if (isNaN(km) || km < 0) {
    uiStore.showToast({ message: t('vehicles.form.errors.kmInvalid'), type: 'error' })
    return
  }
  isSubmittingKm.value = true
  try {
    await vehicleStore.updateKm(vehicleId.value, km)
    uiStore.showToast({ message: t('vehicles.details.updateKmSuccess'), type: 'success' })
    showKmModal.value = false
  } catch (error) {
    uiStore.showToast({ message: error.message || t('vehicles.details.error'), type: 'error' })
  } finally {
    isSubmittingKm.value = false
  }
}

</script>

<template>
  <MainLayout>
    <div class="flex flex-col gap-8">
      <!-- Breadcrumb -->
      <div class="flex flex-wrap gap-2">
        <router-link to="/" class="text-[#666e85] dark:text-gray-400 hover:text-primary text-sm font-medium">{{ t('common.back') }}</router-link>
        <span class="text-[#666e85] dark:text-gray-600 text-sm">/</span>
        <router-link to="/vehicle-list" class="text-[#666e85] dark:text-gray-400 hover:text-primary text-sm font-medium">{{ t('vehicles.vehicleList') }}</router-link>
        <span class="text-[#666e85] dark:text-gray-600 text-sm">/</span>
        <span class="text-[#121317] dark:text-white text-sm font-medium">{{ vehicle?.model || t('vehicles.details.loading') }}</span>
      </div>

      <!-- Loading State -->
      <div v-if="vehicleStore.isLoading && !vehicle" class="flex justify-center items-center py-12">
        <div class="flex flex-col items-center gap-4">
          <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p class="text-gray-500 dark:text-gray-400">{{ t('vehicles.details.loading') }}</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="!vehicle" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
        {{ t('vehicles.details.notFound') }}
        <router-link to="/vehicle-list" class="mr-2 text-primary hover:underline">{{ t('vehicles.details.backToList') }}</router-link>
      </div>

      <!-- Vehicle Details -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Vehicle Info Card -->
        <div class="lg:col-span-2 rounded-xl border border-[#dcdfe4] dark:border-[#2a2f3d] bg-white dark:bg-[#1e2330] p-5 shadow-sm">
          <div class="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center h-full">
            <div class="flex gap-5 items-center">
              <div class="size-24 sm:size-32 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0 border border-gray-200 dark:border-gray-600 overflow-hidden">
                <img
                  v-if="defaultGalleryImage?.url"
                  :src="defaultGalleryImage.url"
                  :alt="vehicle.model"
                  class="w-full h-full object-cover"
                />
                <i
                  v-else
                  :class="vehicleIconClass"
                  class="text-4xl sm:text-5xl"
                  :style="vehicleIconStyle"
                  aria-hidden="true"
                ></i>
              </div>
              <div class="flex flex-col gap-1">
                <div class="flex items-center gap-2">
                  <h1 class="text-[#121317] dark:text-white text-2xl sm:text-3xl font-bold leading-tight tracking-tight">{{ vehicle.model }}</h1>
                  <span class="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs px-2 py-1 rounded-full font-bold">{{ t('vehicles.details.condition') }}</span>
                </div>
                <p class="text-[#666e85] dark:text-gray-400 text-sm font-normal">{{ t('vehicles.plateNumber') }}: <span class="text-[#121317] dark:text-gray-200 font-medium">{{ vehicle.plateNumber }}</span></p>
                <p class="text-[#666e85] dark:text-gray-400 text-sm font-normal">{{ t('vehicles.year') }}: <span class="text-[#121317] dark:text-gray-200 font-medium">{{ vehicle.year }}</span></p>
                <div class="flex gap-2 mt-2">
                  <button 
                    @click="handleEdit"
                    class="text-sm text-primary font-medium hover:underline flex items-center gap-1"
                  >
                    <span class="material-symbols-outlined text-[18px]">edit</span> {{ t('vehicles.details.editDetails') }}
                  </button>
                  <button 
                    @click="handleDeleteClick"
                    class="text-sm text-red-600 dark:text-red-400 font-medium hover:underline flex items-center gap-1"
                  >
                    <span class="material-symbols-outlined text-[18px]">delete</span> {{ t('vehicles.details.delete') }}
                  </button>
                </div>
              </div>
            </div>
            <div class="flex flex-row sm:flex-col gap-3 w-full sm:w-auto">
              <button 
                @click="handleAddRecord"
                class="flex-1 sm:flex-none flex items-center justify-center rounded-xl h-10 px-4 bg-primary text-white text-sm font-bold leading-normal hover:bg-primary/90 transition-colors shadow-sm gap-2"
              >
                <span class="material-symbols-outlined text-[20px]">add</span>
                <span>{{ t('vehicles.details.addRecord') }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Current KM Card -->
        <div class="lg:col-span-1 flex flex-col justify-center rounded-xl border border-[#dcdfe4] dark:border-[#2a2f3d] bg-white dark:bg-[#1e2330] p-6 shadow-sm relative overflow-hidden group">
          <div class="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all"></div>
          <div class="flex items-center gap-3 mb-2">
            <div class="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-primary">
              <span class="material-symbols-outlined">speed</span>
            </div>
            <h3 class="text-[#666e85] dark:text-gray-400 text-sm font-bold uppercase tracking-wider">{{ t('vehicles.details.currentKm') }}</h3>
          </div>
          <div class="flex items-baseline gap-1 my-3">
            <span class="text-[#121317] dark:text-white text-4xl font-black tracking-tight dir-ltr font-mono">{{ vehicle.currentKm.toLocaleString() }}</span>
            <span class="text-[#666e85] dark:text-gray-400 text-lg font-medium">{{ t('vehicles.management.km') }}</span>
          </div>
          <div class="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
            <p class="text-[#666e85] dark:text-gray-500 text-xs font-normal">{{ t('vehicles.details.lastUpdate') }}</p>
            <button 
              @click="handleOpenKmModal"
              type="button"
              class="text-primary text-sm font-bold hover:underline"
              :aria-label="t('vehicles.details.updateKm')"
            >
              {{ t('vehicles.details.updateKm') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Tabs and Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 flex flex-col gap-4">
          <!-- Tabs -->
          <div class="border-b border-gray-200 dark:border-gray-700">
            <nav aria-label="Tabs" class="-mb-px flex gap-8">
              <button 
                @click="activeTab = 'services'"
                :class="[
                  'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium flex items-center gap-2 transition-colors',
                  activeTab === 'services' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200'
                ]"
              >
                <span class="material-symbols-outlined text-[18px]">build</span>
                {{ t('vehicles.details.services') }}
              </button>
              <button 
                @click="activeTab = 'fuel'"
                :class="[
                  'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium flex items-center gap-2 transition-colors',
                  activeTab === 'fuel' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200'
                ]"
              >
                <span class="material-symbols-outlined text-[18px]">local_gas_station</span>
                {{ t('vehicles.details.fuel') }}
              </button>
              <button 
                @click="activeTab = 'expenses'"
                :class="[
                  'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium flex items-center gap-2 transition-colors',
                  activeTab === 'expenses' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200'
                ]"
              >
                <span class="material-symbols-outlined text-[18px]">attach_money</span>
                {{ t('vehicles.details.expenses') }}
              </button>
            </nav>
          </div>

          <!-- Services Tab Content -->
          <div v-if="activeTab === 'services'" class="bg-white dark:bg-[#1e2330] rounded-xl border border-[#dcdfe4] dark:border-[#2a2f3d] shadow-sm overflow-hidden">
            <div v-if="serviceStore.isLoading" class="flex justify-center items-center py-12">
              <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div v-else-if="servicesForVehicle.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
              <span class="material-symbols-outlined text-5xl text-gray-400 mb-4">build</span>
              <p class="text-gray-500 dark:text-gray-400">{{ t('vehicles.details.noServices') }}</p>
              <button 
                @click="handleAddRecord"
                class="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors"
              >
                {{ t('vehicles.details.addFirstService') }}
              </button>
            </div>
            <div v-else class="overflow-x-auto">
              <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h4 class="text-sm font-bold text-gray-900 dark:text-white">{{ t('vehicles.details.services') }}</h4>
                <router-link 
                  :to="{ name: 'service-list', query: { vehicleId: vehicleId.value } }"
                  class="text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                >
                  {{ t('vehicles.details.viewAllServices') }}
                  <span class="material-symbols-outlined text-[16px]">arrow_back</span>
                </router-link>
              </div>
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-[#252a38]">
                  <tr>
                    <th class="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">{{ t('vehicles.details.tableDate') }}</th>
                    <th class="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">{{ t('vehicles.details.tableService') }}</th>
                    <th class="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">{{ t('vehicles.details.tableMileage') }}</th>
                    <th class="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">{{ t('vehicles.details.tableCost') }}</th>
                    <th class="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">{{ t('vehicles.details.tableStatus') }}</th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-[#1e2330] divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="service in servicesForVehicle" :key="service.id">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium text-start">{{ formatDate(service.date) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-start">
                      <div class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-gray-400 text-[18px]">build</span>
                        {{ service.types?.join(', ') || service.type || t('vehicles.details.serviceDefault') }}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-start dir-ltr font-mono">{{ service.km.toLocaleString() }} {{ t('vehicles.management.km') }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white text-start">{{ formatCurrency(service.cost) }} {{ t('common.currency') }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-start">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">{{ t('vehicles.details.completed') }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Fuel Tab Content -->
          <div v-if="activeTab === 'fuel'" class="bg-white dark:bg-[#1e2330] rounded-xl border border-[#dcdfe4] dark:border-[#2a2f3d] shadow-sm overflow-hidden">
            <div v-if="expenseStore.isLoading" class="flex justify-center items-center py-12">
              <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div v-else-if="fuelExpensesForVehicle.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
              <span class="material-symbols-outlined text-5xl text-gray-400 mb-4">local_gas_station</span>
              <p class="text-gray-500 dark:text-gray-400">{{ t('vehicles.details.noFuelRecords') }}</p>
            </div>
            <div v-else class="overflow-x-auto">
              <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h4 class="text-sm font-bold text-gray-900 dark:text-white">{{ t('vehicles.details.fuel') }}</h4>
              </div>
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-[#252a38]">
                  <tr>
                    <th class="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">{{ t('vehicles.details.tableDate') }}</th>
                    <th class="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">{{ t('vehicles.details.tableAmount') }}</th>
                    <th class="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">{{ t('vehicles.details.tableMileage') }}</th>
                    <th class="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">{{ t('vehicles.details.tableNote') }}</th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-[#1e2330] divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="exp in fuelExpensesForVehicle" :key="exp.id">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium text-start">{{ formatDate(exp.date) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white text-start">{{ formatCurrency(exp.amount) }} {{ t('common.currency') }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-start dir-ltr font-mono">{{ exp.km != null ? exp.km.toLocaleString() : '—' }} {{ t('vehicles.management.km') }}</td>
                    <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 text-start max-w-[12rem] truncate">{{ exp.note || '—' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Expenses Tab Content -->
          <div v-if="activeTab === 'expenses'" class="bg-white dark:bg-[#1e2330] rounded-xl border border-[#dcdfe4] dark:border-[#2a2f3d] shadow-sm overflow-hidden">
            <div v-if="expenseStore.isLoading" class="flex justify-center items-center py-12">
              <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div v-else-if="expensesForThisVehicle.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
              <span class="material-symbols-outlined text-5xl text-gray-400 mb-4">attach_money</span>
              <p class="text-gray-500 dark:text-gray-400">{{ t('vehicles.details.noExpenses') }}</p>
              <button
                @click="handleAddExpense"
                class="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors"
              >
                {{ t('vehicles.details.addFirstExpense') }}
              </button>
            </div>
            <div v-else class="overflow-x-auto">
              <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h4 class="text-sm font-bold text-gray-900 dark:text-white">{{ t('vehicles.details.expenses') }}</h4>
                <button
                  @click="handleAddExpense"
                  type="button"
                  class="text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                >
                  {{ t('common.add') }} {{ t('vehicles.details.expenses') }}
                  <span class="material-symbols-outlined text-[16px]">add</span>
                </button>
              </div>
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-[#252a38]">
                  <tr>
                    <th class="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">{{ t('vehicles.details.tableDate') }}</th>
                    <th class="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">{{ t('vehicles.details.tableCategory') }}</th>
                    <th class="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">{{ t('vehicles.details.tableAmount') }}</th>
                    <th class="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">{{ t('vehicles.details.tableMileage') }}</th>
                    <th class="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">{{ t('vehicles.details.tableNote') }}</th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-[#1e2330] divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="exp in expensesForThisVehicle" :key="exp.id">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium text-start">{{ formatDate(exp.date) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-start">{{ exp.category || '—' }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white text-start">{{ formatCurrency(exp.amount) }} {{ t('common.currency') }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-start dir-ltr font-mono">{{ exp.km != null ? exp.km.toLocaleString() : '—' }} {{ t('vehicles.management.km') }}</td>
                    <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 text-start max-w-[12rem] truncate">{{ exp.note || '—' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1 flex flex-col gap-6">
          <!-- Reminders Card -->
          <div class="bg-white dark:bg-[#1e2330] rounded-xl border border-[#dcdfe4] dark:border-[#2a2f3d] shadow-sm p-5">
            <h3 class="text-[#121317] dark:text-white text-base font-bold mb-4 flex items-center gap-2">
              <span class="material-symbols-outlined text-yellow-500">notifications_active</span>
              {{ t('vehicles.details.reminders') }}
            </h3>
            <div v-if="reminderStore.isLoading" class="flex justify-center py-4">
              <div class="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div v-else class="flex flex-col gap-3">
              <div v-if="remindersForThisVehicle.length === 0" class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 text-center">
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('vehicles.details.noReminders') }}</p>
              </div>
              <div v-else class="space-y-2">
                <div
                  v-for="rem in remindersForThisVehicle"
                  :key="rem.id"
                  class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700"
                >
                  <p class="text-sm font-medium text-[#121317] dark:text-white">{{ rem.title || rem.message }}</p>
                  <p v-if="rem.message && rem.title !== rem.message" class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ rem.message }}</p>
                  <span
                    v-if="rem.status"
                    :class="[
                      'inline-block mt-2 px-2 py-0.5 rounded text-xs font-medium',
                      rem.status === 'overdue' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : '',
                      rem.status === 'near' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : '',
                      rem.status === 'ok' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : ''
                    ]"
                  >
                    {{ rem.status === 'overdue' ? t('reminders.statusOverdue', 'گذشته') : rem.status === 'near' ? t('reminders.statusNear', 'نزدیک') : t('reminders.statusOk', 'طبیعی') }}
                  </span>
                </div>
              </div>
              <router-link
                :to="{ name: 'reminder-management', query: { vehicleId: vehicleId } }"
                class="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1 mt-2"
              >
                {{ t('vehicles.details.viewReminders') }}
                <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
              </router-link>
            </div>
          </div>

          <!-- Summary Card -->
          <div class="bg-white dark:bg-[#1e2330] rounded-xl border border-[#dcdfe4] dark:border-[#2a2f3d] shadow-sm p-5">
            <h3 class="text-[#121317] dark:text-white text-base font-bold mb-4">{{ t('vehicles.details.summaryTitle') }}</h3>
            <div class="flex items-end gap-2 mb-4">
              <span class="text-3xl font-black text-[#121317] dark:text-white">{{ formatCurrency(summaryCostThisVehicle) }}</span>
              <span class="text-sm text-gray-500 dark:text-gray-400 mb-1">تومان</span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ t('vehicles.details.summaryDescription') }}</p>
          </div>
        </div>
      </div>

      <!-- Gallery (ردیف جدا تا با تب‌ها روی هم نیفتد) -->
      <div class="bg-white dark:bg-[#1e2330] rounded-xl border border-[#dcdfe4] dark:border-[#2a2f3d] shadow-sm p-5 overflow-hidden">
        <h3 class="text-sm font-bold text-[#121317] dark:text-white mb-3">{{ t('vehicles.galleryTitle') }}</h3>
        <div v-if="galleryLoading" class="flex justify-center py-4">
          <div class="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div v-else class="flex flex-wrap gap-3 items-start">
          <div
            v-for="img in galleryImages"
            :key="img.id"
            class="relative group w-20 h-20 shrink-0 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden bg-gray-50 dark:bg-gray-800"
          >
            <img :src="img.url" :alt="''" class="w-full h-full object-cover" />
            <span v-if="img.isDefault" class="absolute bottom-0 left-0 right-0 bg-primary/80 text-white text-xs py-0.5 text-center">{{ t('vehicles.galleryDefault') }}</span>
            <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
              <button
                v-if="!img.isDefault"
                type="button"
                class="p-1.5 rounded bg-white/90 text-gray-800 hover:bg-white text-sm"
                :title="t('vehicles.gallerySetDefault')"
                :aria-label="t('vehicles.gallerySetDefault')"
                @click="handleGallerySetDefault(img.id)"
              >
                <span class="material-symbols-outlined text-[18px]">star</span>
              </button>
              <button
                type="button"
                class="p-1.5 rounded bg-red-500/90 text-white hover:bg-red-600 text-sm"
                :title="t('common.delete')"
                :aria-label="t('common.delete')"
                @click="handleGalleryDelete(img.id)"
              >
                <span class="material-symbols-outlined text-[18px]">delete</span>
              </button>
            </div>
          </div>
          <label
            v-if="galleryImages.length < MAX_GALLERY_IMAGES"
            class="w-20 h-20 shrink-0 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <input
              ref="galleryFileInput"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              class="hidden"
              :disabled="galleryUploading"
              @change="handleGalleryUpload"
            />
            <span v-if="galleryUploading" class="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
            <span v-else class="material-symbols-outlined text-3xl text-gray-400">add_photo_alternate</span>
          </label>
        </div>
        <p v-if="galleryImages.length === 0 && !galleryLoading" class="text-sm text-gray-500 dark:text-gray-400 mt-2">{{ t('vehicles.galleryEmpty') }}</p>
      </div>

      <!-- Update KM Modal -->
      <Modal
        v-model:open="showKmModal"
        :title="t('vehicles.details.updateKmModalTitle')"
        size="sm"
        show-close
        @close="handleCloseKmModal"
      >
        <form @submit.prevent="handleSubmitKmModal" class="space-y-4">
          <label class="block">
            <span class="text-sm font-medium text-[#121317] dark:text-gray-200">{{ t('vehicles.details.updateKmModalLabel') }}</span>
            <input
              v-model.number="newKmValue"
              type="number"
              min="0"
              step="1"
              class="mt-2 w-full rounded-xl border border-[#dcdfe4] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#121317] dark:text-white h-12 px-4 dir-ltr text-right font-mono focus:border-primary focus:ring-1 focus:ring-primary"
              :aria-label="t('vehicles.details.updateKmModalLabel')"
            />
          </label>
        </form>
        <template #footer>
          <button
            type="button"
            @click="handleCloseKmModal"
            class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            {{ t('vehicles.form.cancel') }}
          </button>
          <button
            type="button"
            @click="handleSubmitKmModal"
            class="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white transition-colors font-medium"
            :disabled="isSubmittingKm"
          >
            {{ isSubmittingKm ? t('vehicles.form.submitting') : t('vehicles.details.updateKm') }}
          </button>
        </template>
      </Modal>

      <!-- Delete Confirmation Modal -->
      <Modal
        v-model:open="showDeleteConfirm"
        :title="t('vehicles.management.deleteConfirmTitle')"
        size="md"
        :close-on-overlay="false"
      >
        <p class="text-gray-700 dark:text-gray-300 mb-6">
          {{ t('vehicles.management.deleteConfirmMessage') }}
        </p>
        <template #footer>
          <button
            @click="handleDeleteCancel"
            class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            {{ t('vehicles.management.deleteCancelButton') }}
          </button>
          <button
            @click="handleDeleteConfirm"
            class="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors font-medium"
            :disabled="vehicleStore.isLoading"
          >
            {{ t('vehicles.management.deleteConfirmButton') }}
          </button>
        </template>
      </Modal>
    </div>
  </MainLayout>
</template>
