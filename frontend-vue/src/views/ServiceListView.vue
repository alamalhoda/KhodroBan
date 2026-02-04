<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useServiceStore } from '../stores/service'
import { useVehicleStore } from '../stores/vehicle'
import { useToast } from '../composables/useToast'
import MainLayout from '../components/MainLayout.vue'
import { Button, Select, Card, LoadingSpinner, Modal } from '../components/ui'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const serviceStore = useServiceStore()
const vehicleStore = useVehicleStore()
const toast = useToast()

// State
const services = ref([])
const isLoading = ref(false)
const showDeleteModal = ref(false)
const showEditModal = ref(false)
const serviceToDelete = ref(null)
const serviceToEdit = ref(null)
const selectedVehicleId = ref(null)

// Edit form
const editForm = ref({
  date: '',
  km: '',
  cost: '',
  type: '',
  note: ''
})

const editFormErrors = ref({})

// Service type options
const serviceTypes = computed(() => [
  { value: 'oil_change', label: t('services.types.oil_change') },
  { value: 'filter', label: t('services.types.filter') },
  { value: 'brakes', label: t('services.types.brakes') },
  { value: 'battery', label: t('services.types.battery') },
  { value: 'tire', label: t('services.types.tire') },
  { value: 'other', label: t('services.types.other') }
])

// Computed
const selectedVehicle = computed(() => {
  if (!selectedVehicleId.value) return null
  // Compare as strings to handle both string and number IDs
  return vehicleStore.vehicles.find(v => String(v.id) === String(selectedVehicleId.value))
})

const vehicleOptions = computed(() => {
  return [
    { value: '', label: t('services.allVehicles') },
    ...vehicleStore.vehicles.map(v => ({
      value: v.id,
      label: `${v.model} - ${v.year}`
    }))
  ]
})

const filteredServices = computed(() => {
  // If a vehicle is selected, show only its services
  if (selectedVehicleId.value) {
    // Use servicesByVehicle which filters by vehicleId
    const vehicleServices = serviceStore.servicesByVehicle(selectedVehicleId.value)
    return vehicleServices
  }
  // Otherwise show all services (no filter)
  return serviceStore.services
})

// Methods
const fetchServices = async () => {
  isLoading.value = true
  try {
    await serviceStore.fetchServices(selectedVehicleId.value || undefined)
    services.value = serviceStore.services
  } catch (error) {
    console.error('Error fetching services:', error)
    toast.error(t('services.add.error'))
  } finally {
    isLoading.value = false
  }
}

const handleEdit = (service) => {
  serviceToEdit.value = service
  editForm.value = {
    date: service.date || '',
    km: service.km?.toString() || '',
    cost: service.cost?.toString() || '',
    type: service.type || '',
    note: service.note || ''
  }
  editFormErrors.value = {}
  showEditModal.value = true
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

const validateEditForm = () => {
  const errors = {}
  
  if (!editForm.value.date) {
    errors.date = t('services.add.validation.dateRequired')
  }
  
  if (!editForm.value.km || editForm.value.km <= 0) {
    errors.km = t('services.add.validation.kmRequired')
  } else if (isNaN(parseInt(editForm.value.km))) {
    errors.km = t('services.add.validation.kmInvalid')
  }
  
  if (!editForm.value.cost || editForm.value.cost <= 0) {
    errors.cost = t('services.add.validation.costRequired')
  } else if (isNaN(parseInt(editForm.value.cost))) {
    errors.cost = t('services.add.validation.costInvalid')
  }
  
  if (!editForm.value.type) {
    errors.type = t('services.add.validation.typeRequired')
  }
  
  editFormErrors.value = errors
  return Object.keys(errors).length === 0
}

const handleEditSubmit = async () => {
  if (!validateEditForm() || !serviceToEdit.value) return
  
  try {
    await serviceStore.updateService(serviceToEdit.value.id, {
      date: editForm.value.date,
      km: parseInt(editForm.value.km),
      cost: parseInt(editForm.value.cost),
      type: editForm.value.type,
      note: editForm.value.note || undefined
    })
    
    toast.success(t('services.edit.success'))
    showEditModal.value = false
    serviceToEdit.value = null
    await fetchServices()
  } catch (error) {
    console.error('Error updating service:', error)
    toast.error(t('services.edit.error'))
  }
}

const handleEditCancel = () => {
  showEditModal.value = false
  serviceToEdit.value = null
  editForm.value = {
    date: '',
    km: '',
    cost: '',
    type: '',
    note: ''
  }
  editFormErrors.value = {}
}

const handleBack = () => {
  router.back()
}

const handleRefresh = async () => {
  try {
    if (vehicleStore.vehicles.length === 0) {
      await vehicleStore.fetchVehicles()
    }
    await fetchServices()
  } catch (error) {
    console.error('Error refreshing data:', error)
    toast.error(t('common.error'))
  }
}

const formatDate = (date) => {
  if (!date) return ''
  return date
}

const formatCurrency = (amount) => {
  if (!amount) return '0'
  return new Intl.NumberFormat('fa-IR').format(amount)
}

// Methods for vehicle selection
const handleVehicleChange = (vehicleId) => {
  // Convert empty string to null
  const normalizedId = vehicleId === '' || !vehicleId ? null : vehicleId
  selectedVehicleId.value = normalizedId
  // Update route query without navigation
  if (normalizedId) {
    router.replace({ query: { ...route.query, vehicleId: normalizedId } })
  } else {
    const { vehicleId: _, ...rest } = route.query
    router.replace({ query: rest })
  }
  // Fetch services for the selected vehicle or all services
  fetchServices()
}

// Lifecycle
onMounted(async () => {
  // Fetch vehicles first
  if (vehicleStore.vehicles.length === 0) {
    try {
      await vehicleStore.fetchVehicles()
    } catch (error) {
      console.error('Error fetching vehicles:', error)
      toast.error(t('vehicles.management.error'))
    }
  }
  
  // Get vehicle ID from route query
  if (route.query.vehicleId) {
    selectedVehicleId.value = String(route.query.vehicleId)
  } else {
    selectedVehicleId.value = null
  }
  // Don't set default vehicle - show all services if no vehicle is selected
  
  // Fetch services (will fetch all if no vehicleId is set)
  await fetchServices()
})

// Watch for route query changes
watch(() => route.query.vehicleId, (newVehicleId) => {
  if (newVehicleId) {
    selectedVehicleId.value = String(newVehicleId)
  } else {
    selectedVehicleId.value = null
  }
  fetchServices()
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
        <Select
          :model-value="selectedVehicleId || ''"
          @update:model-value="handleVehicleChange"
          :options="vehicleOptions"
          icon="directions_car"
          class="w-full sm:w-auto min-w-[200px]"
          :aria-label="$t('services.allVehicles')"
        />
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
      <Card v-else-if="filteredServices.length > 0" class="overflow-hidden p-0">
        <div class="overflow-x-auto">
          <table 
            class="w-full"
            role="table"
            aria-label="$t('services.serviceList')"
          >
            <thead class="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th scope="col" class="px-4 sm:px-6 py-4 text-right text-sm font-bold text-gray-900 dark:text-white">{{ $t('services.date') }}</th>
                <th scope="col" class="px-4 sm:px-6 py-4 text-right text-sm font-bold text-gray-900 dark:text-white">{{ $t('services.serviceType') }}</th>
                <th scope="col" class="px-4 sm:px-6 py-4 text-right text-sm font-bold text-gray-900 dark:text-white hidden sm:table-cell">{{ $t('services.mileage') }}</th>
                <th scope="col" class="px-4 sm:px-6 py-4 text-right text-sm font-bold text-gray-900 dark:text-white">{{ $t('services.cost') }}</th>
                <th scope="col" class="px-4 sm:px-6 py-4 text-right text-sm font-bold text-gray-900 dark:text-white hidden md:table-cell">{{ $t('services.description') }}</th>
                <th scope="col" class="px-4 sm:px-6 py-4 text-center text-sm font-bold text-gray-900 dark:text-white">{{ $t('common.actions', 'عملیات') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr 
                v-for="service in filteredServices" 
                :key="service.id" 
                class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td class="px-4 sm:px-6 py-4 text-sm text-gray-900 dark:text-white">{{ formatDate(service.date) }}</td>
                <td class="px-4 sm:px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{{ $t(`services.types.${service.type}`, service.type) }}</td>
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
        
        <!-- Mobile Card View -->
        <div class="sm:hidden divide-y divide-gray-200 dark:divide-gray-700">
          <div 
            v-for="service in filteredServices" 
            :key="service.id"
            class="p-4 space-y-3"
          >
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">{{ $t(`services.types.${service.type}`, service.type) }}</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ formatDate(service.date) }}</p>
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
    
    <!-- Edit Service Modal -->
    <Modal
      v-model:open="showEditModal"
      :title="$t('services.edit.title')"
      size="lg"
      :close-on-overlay="false"
    >
      <form @submit.prevent="handleEditSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label class="flex flex-col gap-2">
            <span class="text-[#121317] dark:text-gray-200 text-sm font-medium leading-normal">{{ $t('services.add.serviceDate') }}</span>
            <input 
              v-model="editForm.date"
              class="form-input w-full rounded-xl border border-[#dcdfe4] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#121317] dark:text-white h-12 px-4 focus:border-primary focus:ring-1 focus:ring-primary transition-shadow text-end" 
              :class="{ 'border-red-500': editFormErrors.date }"
              type="date" 
            />
            <p v-if="editFormErrors.date" class="text-red-500 text-xs mt-1">{{ editFormErrors.date }}</p>
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-[#121317] dark:text-gray-200 text-sm font-medium leading-normal">{{ $t('services.add.currentKm') }}</span>
            <div class="relative">
              <input 
                v-model="editForm.km"
                class="form-input w-full rounded-xl border border-[#dcdfe4] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#121317] dark:text-white h-12 pe-4 ps-12 focus:border-primary focus:ring-1 focus:ring-primary transition-shadow dir-ltr text-right" 
                :class="{ 'border-red-500': editFormErrors.km }"
                :placeholder="$t('services.add.currentKmPlaceholder')" 
                type="number" 
              />
              <span class="absolute left-4 top-3 text-gray-400 text-sm">km</span>
              <p v-if="editFormErrors.km" class="text-red-500 text-xs mt-1">{{ editFormErrors.km }}</p>
            </div>
          </label>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label class="flex flex-col gap-2">
            <span class="text-[#121317] dark:text-gray-200 text-sm font-medium leading-normal">{{ $t('services.add.serviceType') }}</span>
            <select 
              v-model="editForm.type"
              class="form-select w-full rounded-xl border border-[#dcdfe4] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#121317] dark:text-white h-12 px-4 focus:border-primary focus:ring-1 focus:ring-primary transition-shadow bg-[position:left_0.5rem_center] ps-4 pe-10"
              :class="{ 'border-red-500': editFormErrors.type }"
            >
              <option value="">{{ $t('services.add.selectServiceType') }}</option>
              <option 
                v-for="serviceType in serviceTypes" 
                :key="serviceType.value" 
                :value="serviceType.value"
              >
                {{ serviceType.label }}
              </option>
            </select>
            <p v-if="editFormErrors.type" class="text-red-500 text-xs mt-1">{{ editFormErrors.type }}</p>
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-[#121317] dark:text-gray-200 text-sm font-medium leading-normal">{{ $t('services.add.totalCost') }}</span>
            <div class="relative">
              <span class="absolute left-4 top-3 text-gray-500 dark:text-gray-400 text-sm font-medium">{{ $t('common.currency') }}</span>
              <input 
                v-model="editForm.cost"
                class="form-input w-full rounded-xl border border-[#dcdfe4] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#121317] dark:text-white h-12 pe-4 ps-16 focus:border-primary focus:ring-1 focus:ring-primary transition-shadow dir-ltr text-right" 
                :class="{ 'border-red-500': editFormErrors.cost }"
                placeholder="۰" 
                type="number" 
              />
              <p v-if="editFormErrors.cost" class="text-red-500 text-xs mt-1">{{ editFormErrors.cost }}</p>
            </div>
          </label>
        </div>
        
        <label class="flex flex-col gap-2">
          <span class="text-[#121317] dark:text-gray-200 text-sm font-medium leading-normal">{{ $t('services.add.note') }}</span>
          <textarea 
            v-model="editForm.note"
            class="form-textarea w-full rounded-xl border border-[#dcdfe4] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#121317] dark:text-white min-h-[100px] p-4 focus:border-primary focus:ring-1 focus:ring-primary transition-shadow resize-y" 
            :placeholder="$t('services.add.notePlaceholder')"
          ></textarea>
        </label>
        
        <div class="flex justify-end gap-4 pt-4">
          <Button
            @click="handleEditCancel"
            variant="outline"
          >
            {{ $t('services.add.cancel') }}
          </Button>
          <Button
            type="submit"
            variant="primary"
            icon="save"
          >
            {{ $t('services.edit.submit') }}
          </Button>
        </div>
      </form>
    </Modal>
  </MainLayout>
</template>

