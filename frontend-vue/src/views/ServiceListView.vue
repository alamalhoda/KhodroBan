<script setup>
/**
 * صفحه لیست سرویس‌ها
 *
 * TODO (لیست کارهای بعدی این صفحه):
 * - جستجو و فیلتر (از جمله فیلتر خودرو، نوع سرویس، بازه تاریخ)
 */
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useServiceStore } from '../stores/service'
import { useVehicleStore } from '../stores/vehicle'
import { useToast } from '../composables/useToast'
import { useFormatDate } from '../composables/useFormatDate'
import MainLayout from '../components/MainLayout.vue'
import VehicleFilterSelect from '../components/VehicleFilterSelect.vue'
import { Button, Card, LoadingSpinner, Modal } from '../components/ui'
import { formatCurrency } from '@/utils/formatters'
import { DEFAULT_VEHICLE_ICON, DEFAULT_VEHICLE_ICON_STYLE, DEFAULT_VEHICLE_ICON_COLOR, getEffectiveIconStyle, getVehicleIconDuotoneStyle } from '../config/vehicleIcons'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const serviceStore = useServiceStore()
const vehicleStore = useVehicleStore()
const toast = useToast()
const formatDate = useFormatDate()

// آیکون نوع سرویس برای نمایش در جدول (Material Symbols)
const SERVICE_TYPE_ICONS = {
  oil_change: 'oil_barrel',
  filter: 'filter_alt',
  brakes: 'security',
  battery: 'battery_charging_full',
  tire: 'tire_repair',
  other: 'build'
}

// State
const isLoading = ref(false)
const showDeleteModal = ref(false)
const serviceToDelete = ref(null)

// لیست سرویس‌های صفحه‌بندی‌شده از store
const displayedServices = computed(() => serviceStore.paginatedServices)

const totalPages = computed(() => serviceStore.totalPages)
const currentPage = computed(() => serviceStore.currentPage)
const totalItems = computed(() => serviceStore.totalItems)
const pageSize = computed(() => serviceStore.pageSize)

/** برچسب خودرو برای نمایش در جدول */
function getVehicleLabel(vehicleId) {
  if (!vehicleId) return '—'
  const v = vehicleStore.vehicles.find(v => String(v.id) === String(vehicleId))
  return v ? `${v.model} - ${v.year}` : '—'
}

/** خودرو از روی id (برای آیکون و رنگ) */
function getVehicleById(vehicleId) {
  if (!vehicleId) return null
  return vehicleStore.vehicles.find(v => String(v.id) === String(vehicleId)) || null
}

/** کلاس آیکون FontAwesome برای خودرو */
function vehicleIconClass(vehicle) {
  if (!vehicle) return `fa fa-${getEffectiveIconStyle(DEFAULT_VEHICLE_ICON_STYLE)} fa-${DEFAULT_VEHICLE_ICON}`
  const style = vehicle.iconStyle || DEFAULT_VEHICLE_ICON_STYLE
  const name = vehicle.iconName || DEFAULT_VEHICLE_ICON
  return `fa fa-${getEffectiveIconStyle(style)} fa-${name}`
}

/** استایل دو رنگ آیکون Duotone خودرو */
function vehicleIconStyle(vehicle) {
  return getVehicleIconDuotoneStyle(vehicle?.iconColor, vehicle?.iconColorSecondary)
}

/** آیکون نوع سرویس */
function getServiceTypeIcon(type) {
  return SERVICE_TYPE_ICONS[type] || 'build'
}

// Methods
const fetchServices = async (vehicleId) => {
  isLoading.value = true
  try {
    await serviceStore.fetchServices(vehicleId ?? undefined)
  } catch (error) {
    console.error('Error fetching services:', error)
    toast.error(t('services.add.error'))
  } finally {
    isLoading.value = false
  }
}

const handleVehicleChange = (vehicleId) => {
  const id = vehicleId === '' || vehicleId == null ? null : String(vehicleId)
  serviceStore.setFilterVehicle(id)
  if (id != null) {
    router.replace({ query: { ...route.query, vehicleId: id } })
  } else {
    const { vehicleId: _, ...rest } = route.query
    router.replace({ query: rest })
  }
  fetchServices(id ?? undefined)
}

const handleEdit = (service) => {
  router.push({ name: 'add-service', query: { edit: service.id } })
}

const handleDelete = (service) => {
  serviceToDelete.value = service
  showDeleteModal.value = true
}

const handleDeleteConfirm = async () => {
  if (!serviceToDelete.value) return
  
  try {
    await serviceStore.deleteService(serviceToDelete.value.id)
    toast.success(t('services.delete.success'))
    showDeleteModal.value = false
    serviceToDelete.value = null
    await fetchServices()
  } catch (error) {
    console.error('Error deleting service:', error)
    toast.error(t('services.delete.error'))
  }
}

const handleDeleteCancel = () => {
  showDeleteModal.value = false
  serviceToDelete.value = null
}

const handleBack = () => {
  router.back()
}

const handleRefresh = async () => {
  try {
    if (vehicleStore.vehicles.length === 0) {
      await vehicleStore.fetchVehicles()
    }
    await fetchServices(serviceStore.filterVehicleId ?? undefined)
  } catch (error) {
    console.error('Error refreshing data:', error)
    toast.error(t('common.error'))
  }
}

const handleAddService = () => {
  router.push({ name: 'add-service' })
}

const handlePageChange = (page) => {
  serviceStore.setPage(page)
}

// Lifecycle
onMounted(async () => {
  if (vehicleStore.vehicles.length === 0) {
    try {
      await vehicleStore.fetchVehicles()
    } catch (error) {
      console.error('Error fetching vehicles:', error)
      toast.error(t('vehicles.management.error'))
    }
  }
  if (route.query.vehicleId) {
    const id = String(route.query.vehicleId)
    serviceStore.setFilterVehicle(id)
    await fetchServices(id)
  } else {
    await fetchServices(undefined)
  }
})

watch(() => route.query.vehicleId, (newVehicleId) => {
  if (newVehicleId) {
    serviceStore.setFilterVehicle(String(newVehicleId))
    fetchServices(String(newVehicleId))
  } else {
    serviceStore.setFilterVehicle(null)
    fetchServices(undefined)
  }
}, { immediate: false })

</script>

<template>
  <MainLayout>
    <div class="flex flex-col gap-6">
      <header class="flex flex-wrap justify-between items-end gap-4">
        <div class="flex flex-col gap-1">
          <h1 class="text-[#121317] dark:text-white tracking-tight text-2xl sm:text-[32px] font-bold leading-tight">{{ $t('services.serviceList') }}</h1>
          <p class="text-[#666e85] dark:text-gray-400 text-sm font-normal leading-normal">{{ $t('services.selectDetails.subtitle') }}</p>
        </div>
        <div class="flex flex-wrap items-center gap-4">
          <VehicleFilterSelect
            :model-value="serviceStore.filterVehicleId ?? ''"
            :show-all-option="true"
            @update:model-value="handleVehicleChange"
          />
          <Button
            @click="handleAddService"
            variant="primary"
            icon="add"
          >
            {{ $t('services.addService') }}
          </Button>
        </div>
      </header>
      
      <!-- Loading state -->
      <div v-if="isLoading || serviceStore.isLoading || vehicleStore.isLoading" class="flex justify-center py-12">
        <LoadingSpinner size="lg" :show-text="true" :text="$t('common.loading')" />
      </div>
      
      <!-- Error state -->
      <Card v-else-if="serviceStore.error || vehicleStore.error" variant="danger" class="p-6">
        <div class="flex flex-col items-center gap-4 text-center">
          <span class="material-symbols-outlined text-5xl text-red-500">error</span>
          <div>
            <h3 class="text-lg font-bold text-red-700 dark:text-red-400 mb-2">{{ $t('common.error') }}</h3>
            <p class="text-sm text-red-600 dark:text-red-300">
              {{ serviceStore.error || vehicleStore.error }}
            </p>
          </div>
          <Button @click="handleRefresh" variant="primary">
            {{ $t('common.retry') }}
          </Button>
        </div>
      </Card>
      
      <!-- Services list - Desktop Table -->
      <Card v-else-if="totalItems > 0" class="overflow-hidden p-0">
        <div class="overflow-x-auto">
          <table 
            class="w-full"
            role="table"
            :aria-label="$t('services.serviceList')"
          >
            <thead class="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th scope="col" class="px-4 sm:px-6 py-4 text-right text-sm font-bold text-gray-900 dark:text-white">{{ $t('services.date') }}</th>
                <th scope="col" class="px-4 sm:px-6 py-4 text-right text-sm font-bold text-gray-900 dark:text-white hidden sm:table-cell">{{ $t('vehicles.management.vehicle', 'خودرو') }}</th>
                <th scope="col" class="px-4 sm:px-6 py-4 text-right text-sm font-bold text-gray-900 dark:text-white">{{ $t('services.serviceType') }}</th>
                <th scope="col" class="px-4 sm:px-6 py-4 text-right text-sm font-bold text-gray-900 dark:text-white hidden sm:table-cell">{{ $t('services.mileage') }}</th>
                <th scope="col" class="px-4 sm:px-6 py-4 text-right text-sm font-bold text-gray-900 dark:text-white">{{ $t('services.cost') }}</th>
                <th scope="col" class="px-4 sm:px-6 py-4 text-right text-sm font-bold text-gray-900 dark:text-white hidden md:table-cell">{{ $t('services.description') }}</th>
                <th scope="col" class="px-4 sm:px-6 py-4 text-center text-sm font-bold text-gray-900 dark:text-white">{{ $t('common.actions', 'عملیات') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr 
                v-for="service in displayedServices" 
                :key="service.id" 
                class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td class="px-4 sm:px-6 py-4 text-sm text-gray-900 dark:text-white">{{ formatDate(service.date) }}</td>
                <td class="px-4 sm:px-6 py-4 text-sm text-gray-700 dark:text-gray-300 hidden sm:table-cell">
                  <span class="inline-flex items-center gap-2">
                    <span
                      v-if="getVehicleById(service.vehicleId)"
                      class="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 shrink-0"
                      aria-hidden="true"
                    >
                      <i
                        :class="vehicleIconClass(getVehicleById(service.vehicleId))"
                        class="text-base"
                        :style="vehicleIconStyle(getVehicleById(service.vehicleId))"
                      ></i>
                    </span>
                    <span v-else class="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 shrink-0">
                      <span class="material-symbols-outlined text-base text-gray-500">directions_car</span>
                    </span>
                    {{ getVehicleLabel(service.vehicleId) }}
                  </span>
                </td>
                <td class="px-4 sm:px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                  <span class="inline-flex items-center gap-2">
                    <span class="material-symbols-outlined text-lg text-gray-500 dark:text-gray-400" aria-hidden="true">{{ getServiceTypeIcon(service.type) }}</span>
                    {{ $t(`services.types.${service.type}`, service.type) }}
                  </span>
                </td>
                <td class="px-4 sm:px-6 py-4 text-sm text-gray-700 dark:text-gray-300 hidden sm:table-cell">{{ formatCurrency(service.km) }} {{ $t('vehicles.management.km') }}</td>
                <td class="px-4 sm:px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{{ formatCurrency(service.cost) }} {{ $t('common.currency') }}</td>
                <td class="px-4 sm:px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate hidden md:table-cell">{{ service.note || '-' }}</td>
                <td class="px-4 sm:px-6 py-4 text-center">
                  <div class="flex items-center justify-center gap-2">
                    <Button
                      @click="handleEdit(service)"
                      variant="ghost"
                      size="sm"
                      icon="edit"
                      :aria-label="$t('services.editService') + ' ' + formatDate(service.date)"
                    />
                    <Button
                      @click="handleDelete(service)"
                      variant="ghost"
                      size="sm"
                      icon="delete"
                      :aria-label="$t('services.deleteService') + ' ' + formatDate(service.date)"
                      class="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex flex-wrap items-center justify-between gap-4 px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ $t('common.showing', 'نمایش') }}
            {{ (currentPage - 1) * pageSize + 1 }}
            {{ $t('common.to', 'تا') }}
            {{ Math.min(currentPage * pageSize, totalItems) }}
            {{ $t('common.of', 'از') }}
            {{ totalItems }}
          </p>
          <nav class="flex items-center gap-2" aria-label="Pagination">
            <Button
              variant="outline"
              size="sm"
              icon="chevron_left"
              :disabled="currentPage <= 1"
              :aria-label="$t('common.previousPage', 'صفحه قبل')"
              @click="handlePageChange(currentPage - 1)"
            />
            <span class="text-sm text-gray-700 dark:text-gray-300 px-2">
              {{ currentPage }} / {{ totalPages }}
            </span>
            <Button
              variant="outline"
              size="sm"
              icon="chevron_right"
              :disabled="currentPage >= totalPages"
              :aria-label="$t('common.nextPage', 'صفحه بعد')"
              @click="handlePageChange(currentPage + 1)"
            />
          </nav>
        </div>
        
        <!-- Mobile Card View -->
        <div class="sm:hidden divide-y divide-gray-200 dark:divide-gray-700">
          <div 
            v-for="service in displayedServices" 
            :key="service.id"
            class="p-4 space-y-3"
          >
            <div class="flex justify-between items-start">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-gray-500 dark:text-gray-400 shrink-0" aria-hidden="true">{{ getServiceTypeIcon(service.type) }}</span>
                <span
                  v-if="getVehicleById(service.vehicleId)"
                  class="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 shrink-0"
                  aria-hidden="true"
                >
                  <i
                    :class="vehicleIconClass(getVehicleById(service.vehicleId))"
                    class="text-sm"
                    :style="vehicleIconStyle(getVehicleById(service.vehicleId))"
                  ></i>
                </span>
                <span v-else class="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 shrink-0">
                  <span class="material-symbols-outlined text-sm text-gray-500">directions_car</span>
                </span>
                <div class="min-w-0">
                  <h3 class="text-sm font-bold text-gray-900 dark:text-white">{{ $t(`services.types.${service.type}`, service.type) }}</h3>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ formatDate(service.date) }} · {{ getVehicleLabel(service.vehicleId) }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <Button
                  @click="handleEdit(service)"
                  variant="ghost"
                  size="sm"
                  icon="edit"
                  :aria-label="$t('services.editService')"
                />
                <Button
                  @click="handleDelete(service)"
                  variant="ghost"
                  size="sm"
                  icon="delete"
                  :aria-label="$t('services.deleteService')"
                  class="text-red-600 dark:text-red-400"
                />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span class="text-gray-500 dark:text-gray-400">{{ $t('services.mileage') }}:</span>
                <span class="text-gray-900 dark:text-white font-medium ms-2">{{ formatCurrency(service.km) }} {{ $t('vehicles.management.km') }}</span>
              </div>
              <div>
                <span class="text-gray-500 dark:text-gray-400">{{ $t('services.cost') }}:</span>
                <span class="text-gray-900 dark:text-white font-medium ms-2">{{ formatCurrency(service.cost) }} {{ $t('common.currency') }}</span>
              </div>
            </div>
            <div v-if="service.note" class="text-sm text-gray-500 dark:text-gray-400">
              <span class="font-medium">{{ $t('services.description') }}:</span>
              <span class="ms-2">{{ service.note }}</span>
            </div>
          </div>
        </div>
      </Card>
      
      <!-- Empty state -->
      <Card v-else class="p-12 text-center">
        <span class="material-symbols-outlined text-5xl text-gray-400 mb-4 block">build</span>
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">{{ $t('services.noServices') }}</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">{{ $t('vehicles.details.noServices') }}</p>
        <Button
          @click="$router.push('/add-service')"
          variant="primary"
          icon="add"
        >
          {{ $t('services.addService') }}
        </Button>
      </Card>
      
      <!-- Back button -->
      <div class="flex justify-end">
        <Button
          @click="handleBack"
          variant="outline"
        >
          {{ $t('services.selectDetails.back') }}
        </Button>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <Modal
      v-model:open="showDeleteModal"
      :title="$t('services.delete.confirmTitle')"
      size="md"
      :close-on-overlay="false"
    >
      <p class="text-gray-700 dark:text-gray-300 mb-6">
        {{ $t('services.delete.confirmMessage') }}
      </p>
      <template #footer>
        <Button
          @click="handleDeleteCancel"
          variant="outline"
        >
          {{ $t('services.delete.cancelButton') }}
        </Button>
        <Button
          @click="handleDeleteConfirm"
          variant="danger"
          :loading="serviceStore.isLoading"
        >
          {{ $t('services.delete.confirmButton') }}
        </Button>
      </template>
    </Modal>
  </MainLayout>
</template>

<style scoped>
.vehicle-filter-wrap .rotate-180 {
  transform: rotate(180deg);
}
</style>

