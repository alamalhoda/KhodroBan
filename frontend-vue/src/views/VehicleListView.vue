<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import MainLayout from '../components/MainLayout.vue'
import Modal from '../components/ui/Modal.vue'
import { useVehicleStore } from '../stores/vehicle'
import { useUIStore } from '../stores/ui'

const router = useRouter()
const vehicleStore = useVehicleStore()
const uiStore = useUIStore()
const { t } = useI18n()

const showDeleteConfirm = ref(null)
const vehicleToDelete = ref(null)

onMounted(async () => {
  if (vehicleStore.vehicles.length === 0) {
    try {
      await vehicleStore.fetchVehicles()
    } catch (error) {
      uiStore.showToast({
        message: error.message || t('vehicles.management.error'),
        type: 'error'
      })
    }
  }
})

const handleDeleteClick = (vehicleId) => {
  vehicleToDelete.value = vehicleId
  showDeleteConfirm.value = true
}

const handleDeleteConfirm = async () => {
  if (!vehicleToDelete.value) return

  try {
    await vehicleStore.deleteVehicle(vehicleToDelete.value)
    uiStore.showToast({
      message: t('vehicles.management.deleteSuccess'),
      type: 'success'
    })
    vehicleToDelete.value = null
    showDeleteConfirm.value = false
  } catch (error) {
    uiStore.showToast({
      message: error.message || t('vehicles.management.deleteError'),
      type: 'error'
    })
  }
}

const handleDeleteCancel = () => {
  vehicleToDelete.value = null
  showDeleteConfirm.value = false
}

const handleEdit = (vehicleId) => {
  router.push({ name: 'vehicle-details', params: { id: vehicleId }, query: { edit: 'true' } })
}

const handleViewDetails = (vehicleId) => {
  router.push({ name: 'vehicle-details', params: { id: vehicleId } })
}

const handleAddVehicle = () => {
  router.push({ name: 'vehicle-management', query: { action: 'add' } })
}

// محاسبه درصد استفاده از خودروها (برای Free tier: حداکثر 3 خودرو)
const vehicleUsagePercent = () => {
  const maxVehicles = 3 // Free tier limit
  return Math.min((vehicleStore.vehicleCount / maxVehicles) * 100, 100)
}
</script>

<template>
  <MainLayout>
    <div class="flex flex-col gap-8">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div class="flex flex-col gap-1">
          <h1 class="text-[#121317] dark:text-white tracking-tight text-[28px] md:text-[32px] font-bold leading-tight">{{ t('vehicles.management.title') }}</h1>
          <p class="text-[#666e85] dark:text-gray-400 text-sm font-normal leading-normal">{{ t('vehicles.management.subtitle') }}</p>
        </div>
        <button 
          @click="handleAddVehicle"
          class="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          <span class="material-symbols-outlined text-[20px]">add_circle</span>
          <span class="font-bold text-sm">{{ t('vehicles.management.addNew') }}</span>
        </button>
      </div>

      <!-- Error Message -->
      <div v-if="vehicleStore.error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
        {{ vehicleStore.error }}
        <button @click="vehicleStore.clearError()" class="mr-2 text-red-500 hover:text-red-700">✕</button>
      </div>

      <!-- Usage Status Card (Free Tier) -->
      <div class="w-full bg-white dark:bg-[#1A202C] rounded-xl border border-blue-100 dark:border-gray-700 p-4 md:px-6 md:py-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm relative overflow-hidden">
        <div class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-primary"></div>
        <div class="flex items-center gap-3 w-full md:w-auto">
          <div class="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg text-primary dark:text-blue-400">
            <span class="material-symbols-outlined">inventory_2</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm font-bold text-[#121317] dark:text-white">{{ t('vehicles.management.usageStatus') }}</span>
            <span class="text-xs text-gray-500 dark:text-gray-400">{{ t('vehicles.management.usageDescription', { count: vehicleStore.vehicleCount }) }}</span>
          </div>
        </div>
        <div class="flex items-center gap-4 w-full md:w-auto flex-1 md:max-w-xs">
          <div class="flex-1 h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              class="h-full bg-primary rounded-full relative transition-all duration-300"
              :style="{ width: vehicleUsagePercent() + '%' }"
            >
              <div class="absolute inset-0 bg-white/20 animate-[pulse_2s_infinite]"></div>
            </div>
          </div>
          <span class="text-xs font-bold text-primary dark:text-blue-400 whitespace-nowrap">{{ Math.round(vehicleUsagePercent()) }}٪ {{ t('vehicles.management.usagePercent') }}</span>
        </div>
        <router-link to="/upgrade-pro" class="text-xs font-bold text-primary dark:text-blue-400 hover:text-primary-hover dark:hover:text-blue-300 underline underline-offset-4 cursor-pointer whitespace-nowrap hidden md:block">
          {{ t('vehicles.management.viewPlans') }}
        </router-link>
      </div>

      <!-- Loading State -->
      <div v-if="vehicleStore.isLoading && vehicleStore.vehicles.length === 0" class="flex justify-center items-center py-12">
        <div class="flex flex-col items-center gap-4">
          <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p class="text-gray-500 dark:text-gray-400">{{ t('vehicles.management.loading') }}</p>
        </div>
      </div>

      <!-- Vehicles Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Vehicle Cards -->
        <div 
          v-for="vehicle in vehicleStore.vehicles" 
          :key="vehicle.id"
          @click="handleViewDetails(vehicle.id)"
          class="group bg-white dark:bg-[#1A202C] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden cursor-pointer"
        >
          <div class="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
          <div class="p-5 flex flex-col gap-4">
            <div class="flex justify-between items-start">
              <div class="flex items-center gap-3">
                <div class="size-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300">
                  <span class="material-symbols-outlined text-[28px]">directions_car</span>
                </div>
                <div>
                  <h3 class="font-bold text-lg text-[#121317] dark:text-white leading-tight">{{ vehicle.model }}</h3>
                  <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">{{ t('vehicles.year') }} {{ vehicle.year }}</span>
                </div>
              </div>
              <div class="flex gap-1" @click.stop>
                <button 
                  @click="handleEdit(vehicle.id)"
                  class="p-1.5 text-gray-400 hover:text-primary dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" 
                  title="ویرایش"
                >
                  <span class="material-symbols-outlined text-[20px]">edit</span>
                </button>
                <button 
                  @click="handleDeleteClick(vehicle.id)"
                  class="p-1.5 text-gray-400 hover:text-danger transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20" 
                  :title="t('vehicles.management.delete')"
                  :aria-label="t('vehicles.management.delete')"
                >
                  <span class="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </div>
            </div>
            <div class="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
              <span class="material-symbols-outlined text-gray-400 text-[20px]">speed</span>
              <div class="flex flex-col">
                <span class="text-[10px] uppercase text-gray-400 font-bold tracking-wider">{{ t('vehicles.details.currentKm') }}</span>
                <span class="text-sm font-bold text-[#121317] dark:text-white dir-ltr text-right font-mono">{{ vehicle.currentKm.toLocaleString('fa-IR') }} km</span>
              </div>
            </div>
            <div class="flex items-center justify-between mt-1">
              <span class="text-xs font-medium text-gray-500 dark:text-gray-400">{{ t('vehicles.management.serviceStatus') }}:</span>
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                <span class="size-1.5 rounded-full bg-green-500 animate-pulse"></span>
                {{ t('vehicles.management.normal') }}
              </span>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-800/30 px-5 py-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <span class="text-xs text-gray-500">{{ t('vehicles.plateNumber') }}: {{ vehicle.plateNumber }}</span>
            <span class="text-xs font-medium text-[#121317] dark:text-gray-300">{{ t('vehicles.management.viewDetails') }}</span>
          </div>
        </div>

        <!-- Add Vehicle Button -->
        <button 
          v-if="vehicleStore.vehicleCount < 3"
          @click="handleAddVehicle"
          class="group relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 p-5 text-center hover:border-primary dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all duration-300 min-h-[240px]"
        >
          <div class="flex size-16 items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
            <span class="material-symbols-outlined text-3xl text-gray-400 group-hover:text-primary dark:group-hover:text-blue-400">add</span>
          </div>
          <div class="space-y-1">
            <h3 class="font-bold text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-blue-400 transition-colors">{{ t('vehicles.management.addNew') }}</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 max-w-[200px] mx-auto">{{ t('vehicles.management.slotsRemaining', { count: 3 - vehicleStore.vehicleCount }) }}</p>
          </div>
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="!vehicleStore.isLoading && vehicleStore.vehicles.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
        <div class="size-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
          <span class="material-symbols-outlined text-4xl text-gray-400">directions_car</span>
        </div>
        <h3 class="text-lg font-bold text-[#121317] dark:text-white mb-2">{{ t('vehicles.management.emptyTitle') }}</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">{{ t('vehicles.management.emptyDescription') }}</p>
        <button 
          @click="handleAddVehicle"
          class="px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all"
        >
          {{ t('vehicles.management.emptyAddButton') }}
        </button>
      </div>

      <!-- Upgrade Banner -->
      <div v-if="vehicleStore.vehicleCount >= 3" class="rounded-2xl bg-gradient-to-br from-primary to-blue-900 p-6 sm:p-10 text-white relative overflow-hidden shadow-lg mt-4">
        <div class="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
          <div class="absolute -top-[50%] -left-[20%] w-[500px] h-[500px] rounded-full bg-white blur-[100px]"></div>
          <div class="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-blue-400 blur-[80px]"></div>
        </div>
        <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="flex flex-col gap-2 text-center md:text-right">
            <h3 class="text-xl font-bold">{{ t('vehicles.management.upgradePrompt') }}</h3>
            <p class="text-blue-100 text-sm max-w-md leading-relaxed">{{ t('vehicles.management.upgradeDescription') }}</p>
          </div>
          <router-link to="/upgrade-pro" class="whitespace-nowrap rounded-xl bg-white/20 backdrop-blur-sm px-6 py-3 font-bold text-white shadow-lg hover:bg-white hover:text-primary transition-all duration-300 flex items-center gap-2 border border-white/30">
            <span class="material-symbols-outlined">diamond</span>
            {{ t('vehicles.management.viewPlans') }}
          </router-link>
        </div>
      </div>

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
