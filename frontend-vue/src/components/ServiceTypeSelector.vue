<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useVehicleStore } from '../stores/vehicle'
import { useServiceTypeStore } from '../stores/serviceType'
import { useToast } from '../composables/useToast'

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
const expandedCategories = ref([]) // Will be populated from store

// Service categories and types from store (database + i18n)
const serviceCategories = computed(() => {
  const grouped = serviceTypeStore.groupedServiceTypes
  
  // Set first category as expanded by default
  if (grouped.length > 0 && expandedCategories.value.length === 0) {
    expandedCategories.value = [grouped[0].id]
  }
  
  return grouped.map(category => ({
    id: category.id,
    title: category.title,
    icon: category.icon,
    color: category.color,
    services: category.services.map(service => ({
      id: service.id,
      title: service.title,
      description: service.description || ''
    }))
  }))
})

// Computed
const selectedVehicle = computed(() => {
  if (props.vehicleId) {
    return vehicleStore.vehicles.find(v => String(v.id) === String(props.vehicleId))
  }
  return vehicleStore.selectedVehicle || vehicleStore.vehicles[0]
})

const filteredCategories = computed(() => {
  if (!searchQuery.value) return serviceCategories.value
  
  const query = searchQuery.value.toLowerCase()
  return serviceCategories.value.map(category => ({
    ...category,
    services: category.services.filter(service => 
      service.title.toLowerCase().includes(query) || 
      service.description.toLowerCase().includes(query)
    )
  })).filter(category => category.services.length > 0)
})

const hasSelectedServices = computed(() => {
  return selectedServiceTypes.value.length > 0
})

const selectedServicesText = computed(() => {
  if (selectedServiceTypes.value.length === 0) return ''
  if (selectedServiceTypes.value.length === 1) return selectedServiceTypes.value[0].title
  return `${selectedServiceTypes.value.length} ${t('services.selectType.selectedCount', 'مورد انتخاب شده')}`
})

// Methods
const toggleCategory = (categoryId) => {
  const index = expandedCategories.value.indexOf(categoryId)
  if (index > -1) {
    expandedCategories.value.splice(index, 1)
  } else {
    expandedCategories.value.push(categoryId)
  }
}

const isCategoryExpanded = (categoryId) => {
  return expandedCategories.value.includes(categoryId)
}

const selectService = (serviceId, serviceTitle) => {
  const existingIndex = selectedServiceTypes.value.findIndex(s => s.id === serviceId && s.title === serviceTitle)
  
  if (existingIndex > -1) {
    selectedServiceTypes.value.splice(existingIndex, 1)
  } else {
    selectedServiceTypes.value.push({ id: serviceId, title: serviceTitle })
  }
}

const isServiceSelected = (serviceId, serviceTitle) => {
  return selectedServiceTypes.value.some(s => s.id === serviceId && s.title === serviceTitle)
}

const getColorClasses = (color) => {
  const colorMap = {
    orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    slate: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    teal: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400'
  }
  return colorMap[color] || colorMap.blue
}

const handleConfirm = () => {
  if (selectedServiceTypes.value.length === 0) {
    toast.warning(t('services.selectType.noSelection'))
    return
  }
  
  // Emit selected service types
  const serviceTypes = selectedServiceTypes.value.map(s => s.id)
  emit('select', {
    types: serviceTypes,
    vehicleId: selectedVehicle.value?.id || props.vehicleId
  })
}

const handleCancel = () => {
  emit('cancel')
}

// Lifecycle
onMounted(async () => {
  // Fetch service types from database if not already loaded
  if (serviceTypeStore.serviceTypes.length === 0) {
    try {
      await serviceTypeStore.fetchServiceTypes()
    } catch (error) {
      console.error('Error fetching service types:', error)
      toast.error(t('services.error', 'خطا در دریافت انواع سرویس'))
    }
  }
  
  // Fetch vehicles if not already loaded
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
            class="w-full h-12 pr-12 pl-4 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-primary text-sm transition-shadow" 
            :placeholder="$t('services.selectType.searchPlaceholder')" 
            type="text" 
          />
        </div>
      </div>
      <div class="flex flex-col max-h-[600px] overflow-y-auto">
        <div 
          v-for="category in filteredCategories" 
          :key="category.id"
          class="border-b border-gray-100 dark:border-gray-800 last:border-b-0"
        >
          <button 
            @click="toggleCategory(category.id)"
            class="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group text-right"
          >
            <div class="flex items-center gap-4">
              <div :class="['size-12 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform', getColorClasses(category.color)]">
                <span class="material-symbols-outlined text-2xl">{{ category.icon }}</span>
              </div>
              <div class="flex flex-col gap-0.5">
                <h3 class="font-bold text-gray-900 dark:text-white text-base group-hover:text-primary transition-colors">{{ category.title }}</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ category.services.length }} {{ $t('services.selectType.servicesAvailable', 'سرویس موجود') }}</p>
              </div>
            </div>
            <span class="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">
              {{ isCategoryExpanded(category.id) ? 'expand_less' : 'expand_more' }}
            </span>
          </button>
          <div v-if="isCategoryExpanded(category.id)" class="bg-gray-50/50 dark:bg-gray-900/30 px-4 pb-4 pt-1">
            <div class="flex flex-col gap-2 border-r-2 border-gray-200 dark:border-gray-700 mr-6 pr-4 py-2">
              <label 
                v-for="service in category.services" 
                :key="`${category.id}-${service.id}-${service.title}`"
                class="relative flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all hover:shadow-sm"
                :class="isServiceSelected(service.id, service.title) 
                  ? 'bg-white dark:bg-gray-800 border-2 border-primary/20 dark:border-primary/40 shadow-sm' 
                  : 'bg-white dark:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-700'"
                @click="selectService(service.id, service.title)"
              >
                <div class="flex items-center gap-3">
                  <div class="relative flex items-center">
                    <input 
                      :checked="isServiceSelected(service.id, service.title)"
                      class="peer h-5 w-5 border-gray-300 text-primary focus:ring-primary" 
                      name="service_selection" 
                      type="checkbox" 
                      @click.stop
                    />
                  </div>
                  <div class="flex flex-col">
                    <span class="text-sm font-bold text-gray-900 dark:text-white">{{ service.title }}</span>
                    <span class="text-xs text-gray-500 dark:text-gray-400">{{ service.description }}</span>
                  </div>
                </div>
                <span v-if="isServiceSelected(service.id, service.title)" class="text-xs font-bold text-primary dark:text-blue-400 bg-primary/10 px-2 py-1 rounded-md">{{ $t('common.selected', 'انتخاب شده') }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-gray-50 dark:bg-gray-800/50 p-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-gray-100 dark:border-gray-800">
        <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span class="font-medium text-gray-900 dark:text-white">{{ $t('services.selectType.selected') }}:</span>
          <span>{{ selectedServicesText || $t('services.selectType.noSelection') }}</span>
        </div>
        <div class="flex gap-3 w-full sm:w-auto">
          <button 
            @click="handleCancel"
            class="flex-1 sm:flex-none px-6 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-white dark:hover:bg-gray-700 transition-colors"
          >
            {{ $t('services.selectType.back') }}
          </button>
          <button 
            @click="handleConfirm"
            class="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-primary hover:bg-blue-800 text-white font-medium shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
            :disabled="!hasSelectedServices"
            :class="{ 'opacity-50 cursor-not-allowed': !hasSelectedServices }"
          >
            <span>{{ $t('services.selectType.continue') }}</span>
            <span class="material-symbols-outlined text-lg rtl:rotate-180">arrow_back</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

