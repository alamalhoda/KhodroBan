<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import MainLayout from '../components/MainLayout.vue'
import Modal from '../components/ui/Modal.vue'
import { useVehicleStore } from '../stores/vehicle'
import { useServiceStore } from '../stores/service'
import { useUIStore } from '../stores/ui'

const route = useRoute()
const router = useRouter()
const vehicleStore = useVehicleStore()
const serviceStore = useServiceStore()
const uiStore = useUIStore()
const { t } = useI18n()

const showDeleteConfirm = ref(false)

const vehicleId = computed(() => route.params.id)
const vehicle = computed(() => vehicleStore.vehicleById(vehicleId.value))
const isEditMode = computed(() => route.query.edit === 'true')
const activeTab = ref('services')

const servicesForVehicle = computed(() => {
  if (!vehicleId.value) return []
  return serviceStore.servicesByVehicle(vehicleId.value)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
})

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
  }
})

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

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) {
    return dateString // Return original string if invalid date
  }
  try {
    // Simple date format: YYYY-MM-DD or DD/MM/YYYY
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}/${month}/${day}`
  } catch (error) {
    // Fallback to ISO string
    return date.toISOString().split('T')[0]
  }
}

const formatCurrency = (amount) => {
  if (!amount) return '۰'
  return new Intl.NumberFormat('fa-IR').format(amount)
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
              <div class="size-24 sm:size-32 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0 border border-gray-200 dark:border-gray-600">
                <span class="material-symbols-outlined text-5xl sm:text-6xl text-gray-400">directions_car</span>
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
              @click="handleEdit"
              class="text-primary text-sm font-bold hover:underline"
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
          <div v-if="activeTab === 'fuel'" class="bg-white dark:bg-[#1e2330] rounded-xl border border-[#dcdfe4] dark:border-[#2a2f3d] shadow-sm p-6 text-center">
            <span class="material-symbols-outlined text-5xl text-gray-400 mb-4">local_gas_station</span>
            <p class="text-gray-500 dark:text-gray-400">{{ t('vehicles.details.fuelComingSoon') }}</p>
          </div>

          <!-- Expenses Tab Content -->
          <div v-if="activeTab === 'expenses'" class="bg-white dark:bg-[#1e2330] rounded-xl border border-[#dcdfe4] dark:border-[#2a2f3d] shadow-sm p-6 text-center">
            <span class="material-symbols-outlined text-5xl text-gray-400 mb-4">attach_money</span>
            <p class="text-gray-500 dark:text-gray-400">{{ t('vehicles.details.expensesComingSoon') }}</p>
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
            <div class="flex flex-col gap-3">
              <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 text-center">
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('vehicles.details.remindersComingSoon') }}</p>
              </div>
            </div>
          </div>

          <!-- Summary Card -->
          <div class="bg-white dark:bg-[#1e2330] rounded-xl border border-[#dcdfe4] dark:border-[#2a2f3d] shadow-sm p-5">
            <h3 class="text-[#121317] dark:text-white text-base font-bold mb-4">{{ t('vehicles.details.summaryTitle') }}</h3>
            <div class="flex items-end gap-2 mb-4">
              <span class="text-3xl font-black text-[#121317] dark:text-white">{{ formatCurrency(serviceStore.totalServiceCost) }}</span>
              <span class="text-sm text-gray-500 dark:text-gray-400 mb-1">تومان</span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ t('vehicles.details.summaryDescription') }}</p>
          </div>
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
