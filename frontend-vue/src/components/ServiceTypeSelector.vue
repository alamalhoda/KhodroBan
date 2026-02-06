<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useVehicleStore } from '../stores/vehicle'
import { useServiceTypeStore } from '../stores/serviceType'
import { useToast } from '../composables/useToast'
import ServiceTypeCategory from './ServiceTypeCategory.vue'
import ServiceTypeSelectorFooter from './ServiceTypeSelectorFooter.vue'

const props = defineProps({
  vehicleId: {
    type: [String, Number],
    default: null
  },
  compact: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select', 'cancel'])

const { t } = useI18n()
const vehicleStore = useVehicleStore()
const serviceTypeStore = useServiceTypeStore()
const toast = useToast()

// State
const selectedServiceTypes = ref([])
const searchQuery = ref('')
const expandedCategories = ref([])

// Service categories and types from store (database + i18n)
const serviceCategories = computed(() => {
  const grouped = serviceTypeStore.groupedServiceTypes
  if (grouped.length > 0 && expandedCategories.value.length === 0) {
    expandedCategories.value = [grouped[0].id]
  }
  return grouped.map((category) => ({
    id: category.id,
    title: category.title,
    icon: category.icon,
    color: category.color,
    services: category.services.map((service) => ({
      id: service.id,
      title: service.title,
      description: service.description || ''
    }))
  }))
})

const selectedVehicle = computed(() => {
  if (props.vehicleId) {
    return vehicleStore.vehicles.find((v) => String(v.id) === String(props.vehicleId))
  }
  return vehicleStore.selectedVehicle || vehicleStore.vehicles[0]
})

const filteredCategories = computed(() => {
  if (!searchQuery.value) return serviceCategories.value
  const query = searchQuery.value.toLowerCase()
  return serviceCategories.value
    .map((category) => ({
      ...category,
      services: category.services.filter(
        (service) =>
          service.title.toLowerCase().includes(query) ||
          service.description.toLowerCase().includes(query)
      )
    }))
    .filter((category) => category.services.length > 0)
})

const hasSelectedServices = computed(() => selectedServiceTypes.value.length > 0)

const selectedServicesText = computed(() => {
  if (selectedServiceTypes.value.length === 0) return ''
  if (selectedServiceTypes.value.length === 1) return selectedServiceTypes.value[0].title
  return `${selectedServiceTypes.value.length} ${t('services.selectType.selectedCount', 'مورد انتخاب شده')}`
})

const toggleCategory = (categoryId) => {
  const index = expandedCategories.value.indexOf(categoryId)
  if (index > -1) {
    expandedCategories.value.splice(index, 1)
  } else {
    expandedCategories.value.push(categoryId)
  }
}

const isCategoryExpanded = (categoryId) => expandedCategories.value.includes(categoryId)

const selectService = ({ id: serviceId, title: serviceTitle }) => {
  const existingIndex = selectedServiceTypes.value.findIndex(
    (s) => s.id === serviceId && s.title === serviceTitle
  )
  if (existingIndex > -1) {
    selectedServiceTypes.value.splice(existingIndex, 1)
  } else {
    selectedServiceTypes.value.push({ id: serviceId, title: serviceTitle })
  }
}

const handleConfirm = () => {
  if (selectedServiceTypes.value.length === 0) {
    toast.warning(t('services.selectType.noSelection'))
    return
  }
  emit('select', {
    types: selectedServiceTypes.value.map((s) => s.id),
    vehicleId: selectedVehicle.value?.id || props.vehicleId
  })
}

const handleCancel = () => {
  emit('cancel')
}

onMounted(async () => {
  if (serviceTypeStore.serviceTypes.length === 0) {
    try {
      await serviceTypeStore.fetchServiceTypes()
    } catch (error) {
      console.error('Error fetching service types:', error)
      toast.error(t('services.error', 'خطا در دریافت انواع سرویس'))
    }
  }
  if (vehicleStore.vehicles.length === 0) {
    try {
      await vehicleStore.fetchVehicles()
    } catch (error) {
      console.error('Error fetching vehicles:', error)
      toast.error(t('vehicles.management.error'))
    }
  }
})
</script>

<template>
  <div class="flex flex-col gap-6" :class="{ 'gap-4': compact }">
    <div v-if="!compact" class="flex flex-wrap justify-between items-end gap-4">
      <div class="flex flex-col gap-1">
        <h1 class="text-[#121317] dark:text-white tracking-tight text-[32px] font-bold leading-tight">{{ $t('services.selectType.title') }}</h1>
        <p class="text-[#666e85] dark:text-gray-400 text-sm font-normal leading-normal">{{ $t('services.selectType.subtitle') }}</p>
      </div>
      <div v-if="selectedVehicle" class="flex items-center gap-2 bg-white dark:bg-gray-800 p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <span class="material-symbols-outlined text-gray-500 ms-2">directions_car</span>
        <span class="text-sm font-semibold text-slate-700 dark:text-gray-200 px-2 py-1">{{ selectedVehicle.model }} - {{ selectedVehicle.year }}</span>
      </div>
    </div>
    <div class="bg-white dark:bg-[#1A202C] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-1 overflow-hidden flex flex-col">
      <div class="p-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-[#1A202C] z-10">
        <div class="relative">
          <span class="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 material-symbols-outlined">search</span>
          <input
            v-model="searchQuery"
            type="search"
            class="w-full h-12 pr-12 pl-4 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-primary text-sm transition-shadow"
            :placeholder="$t('services.selectType.searchPlaceholder')"
            :aria-label="$t('services.selectType.searchPlaceholder')"
          />
        </div>
      </div>
      <div class="flex flex-col max-h-[600px] overflow-y-auto">
        <ServiceTypeCategory
          v-for="category in filteredCategories"
          :key="category.id"
          :category="category"
          :is-expanded="isCategoryExpanded(category.id)"
          :selected-service-types="selectedServiceTypes"
          @toggle="toggleCategory"
          @select-service="selectService"
        />
      </div>
      <ServiceTypeSelectorFooter
        :selected-services-text="selectedServicesText"
        :has-selected-services="hasSelectedServices"
        @confirm="handleConfirm"
        @cancel="handleCancel"
      />
    </div>
  </div>
</template>

