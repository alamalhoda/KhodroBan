<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useServiceStore } from '../stores/service'
import { useVehicleStore } from '../stores/vehicle'
import { useServiceTypeStore } from '../stores/serviceType'
import { servicePresetService } from '../services/servicePresetService'
import { useExpenseCategoryStore } from '../stores/expenseCategory'
import { useExpenseStore } from '../stores/expense'
import { useReminderStore } from '../stores/reminder'
import { useToast } from '../composables/useToast'
import MainLayout from '../components/MainLayout.vue'
import { Button, Input, Select, Card, LoadingSpinner, Modal, PersianDatePicker } from '../components/ui'
import { getTodayJalaliStr, isoToJalaliStr } from '../utils/dateUtils'
import VehicleFilterSelect from '../components/VehicleFilterSelect.vue'
import ServiceTypeSelector from '../components/ServiceTypeSelector.vue'

const router = useRouter()
const route = useRoute()
const { t, locale } = useI18n()
const isPersianLocale = computed(() => locale.value === 'fa')
const serviceStore = useServiceStore()
const vehicleStore = useVehicleStore()
const serviceTypeStore = useServiceTypeStore()
const expenseCategoryStore = useExpenseCategoryStore()
const expenseStore = useExpenseStore()
const reminderStore = useReminderStore()
const toast = useToast()

// Form state — تاریخ: فارسی = شمسی YYYY/MM/DD، غیرفارسی = ISO YYYY-MM-DD (backend هر دو را قبول می‌کند)
const getInitialDate = () => (locale.value === 'fa' ? getTodayJalaliStr() : new Date().toISOString().split('T')[0])
const formData = ref({
  vehicleId: '',
  date: getInitialDate(),
  km: '',
  cost: '',
  type: '',
  types: [], // For services
  category: '', // For expenses
  note: '',
  shopName: ''
})

// Reminder state
const createReminderAfterService = ref(false)
const reminderInterval = ref({ days: 90, km: 5000 })

const formErrors = ref({})
const isSubmitting = ref(false)
const isLoadingEdit = ref(false)
const activeTab = ref('service') // 'service' or 'expense'
const showServiceTypeModal = ref(false)
const serviceTypeSelectorKey = ref(0)

// حالت ویرایش سرویس (از لیست سرویس‌ها با query edit=id)
const editingServiceId = computed(() => route.query.edit || null)
const isEditMode = computed(() => !!editingServiceId.value)

// Autocomplete state
const autocompleteQuery = ref('')
const showAutocompleteDropdown = ref(false)
const autocompleteFocusedIndex = ref(-1)

// All available service types from store (database + i18n)
const allServiceTypes = computed(() => {
  return serviceTypeStore.serviceTypeOptions
})

// All available expense categories from store (database + i18n)
const allExpenseCategories = computed(() => {
  return expenseCategoryStore.expenseCategoryOptions
})

// Current options based on active tab
const currentOptions = computed(() => {
  return activeTab.value === 'service' ? allServiceTypes.value : allExpenseCategories.value
})

// Filtered options for autocomplete
const filteredOptions = computed(() => {
  const selectedValues = activeTab.value === 'service' 
    ? formData.value.types 
    : (formData.value.category ? [formData.value.category] : [])
  
  if (!autocompleteQuery.value.trim()) {
    return currentOptions.value.filter(opt => !selectedValues.includes(opt.value))
  }
  
  const query = autocompleteQuery.value.toLowerCase().trim()
  return currentOptions.value.filter(opt => 
    !selectedValues.includes(opt.value) &&
    (opt.label.toLowerCase().includes(query) || opt.value.toLowerCase().includes(query))
  )
})

// گروه‌بندی گزینه‌های فیلترشده (برای تب سرویس)
const groupedFilteredOptions = computed(() => {
  if (activeTab.value !== 'service') {
    return [
      {
        id: 'default',
        title: '',
        options: filteredOptions.value
      }
    ]
  }

  const groups = {}
  filteredOptions.value.forEach((opt) => {
    const key = opt.category || 'other'
    if (!groups[key]) {
      groups[key] = {
        id: key,
        title: serviceTypeStore.serviceTypesWithTranslation.find(t => t.group_name === key)?.groupName || key,
        options: []
      }
    }
    groups[key].options.push(opt)
  })
  return Object.values(groups)
})

// پیش‌تعریف‌های انتخاب سریع (از API، توسط ادمین تعریف شده)
const servicePresets = ref([])

// Get label by value based on active tab
const getLabel = (value) => {
  if (activeTab.value === 'service') {
    return serviceTypeStore.getServiceTypeLabel(value)
  } else {
    return expenseCategoryStore.getExpenseCategoryLabel(value)
  }
}

/** تبدیل رشته تاریخ (شمسی یا میلادی) به YYYY-MM-DD برای input type="date" */
async function toDateInputValue(dateStr) {
  if (!dateStr) return ''
  const s = String(dateStr).trim()
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10)
  const parts = s.split(/[\/\-]/)
  if (parts.length === 3 && parseInt(parts[0], 10) > 1300) {
    try {
      const PersianDate = (await import('persian-date')).default
      const pd = new PersianDate().parse(s.replace(/\//g, '-'))
      const d = pd.toDate()
      if (d && !isNaN(d.getTime())) return d.toISOString().split('T')[0]
    } catch (e) {
      console.warn('toDateInputValue jalali parse failed:', e)
    }
  }
  const d = new Date(s)
  if (!isNaN(d.getTime())) return d.toISOString().split('T')[0]
  return s
}

// Computed
const selectedVehicle = computed(() => {
  if (!formData.value.vehicleId) return null
  return vehicleStore.vehicles.find(v => v.id === formData.value.vehicleId)
})

const isFormValid = computed(() => {
  const hasBasicFields = formData.value.vehicleId && 
         formData.value.date && 
         formData.value.cost
  
  if (activeTab.value === 'service') {
    return hasBasicFields && 
           formData.value.km && 
           formData.value.types.length > 0
  } else {
    return hasBasicFields && 
           formData.value.category
  }
})

// Methods
const validateForm = () => {
  const errors = {}
  
  if (!formData.value.vehicleId) {
    errors.vehicleId = t('services.add.validation.vehicleRequired')
  }
  
  if (!formData.value.date) {
    errors.date = t('services.add.validation.dateRequired')
  }
  
  if (!formData.value.cost || formData.value.cost <= 0) {
    errors.cost = t('services.add.validation.costRequired')
  } else if (isNaN(parseInt(formData.value.cost))) {
    errors.cost = t('services.add.validation.costInvalid')
  }
  
  if (activeTab.value === 'service') {
    if (formData.value.types.length === 0) {
      errors.type = t('services.add.validation.typeRequired')
    }
    if (!formData.value.km || formData.value.km <= 0) {
      errors.km = t('services.add.validation.kmRequired')
    } else if (isNaN(parseInt(formData.value.km))) {
      errors.km = t('services.add.validation.kmInvalid')
    }
  } else {
    if (!formData.value.category) {
      errors.category = t('expenses.add.validation.categoryRequired', 'انتخاب دسته‌بندی الزامی است')
    }
  }
  
  formErrors.value = errors
  return Object.keys(errors).length === 0
}

/** تاریخ سرویس از API را به ISO YYYY-MM-DD نرمال می‌کند (برای نمایش در فرم) */
async function normalizeApiDateToIso(raw) {
  if (raw == null || raw === '') return ''
  const s = String(raw).trim()
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10)
  return await toDateInputValue(s) || ''
}

const loadServiceForEdit = async () => {
  const id = editingServiceId.value
  if (!id) return
  isLoadingEdit.value = true
  try {
    const service = await serviceStore.fetchServiceById(id)
    formData.value.vehicleId = String(service.vehicleId)
    const rawDate = service.date ?? service.serviceDate ?? ''
    const isoDate = await normalizeApiDateToIso(rawDate)
    if (locale.value === 'fa') {
      const jalaliStr = isoToJalaliStr(isoDate) || isoToJalaliStr(rawDate) || getTodayJalaliStr()
      formData.value.date = jalaliStr
    } else {
      const enDate = isoDate || (rawDate ? await toDateInputValue(rawDate) : '')
      formData.value.date = enDate || new Date().toISOString().split('T')[0]
    }
    formData.value.km = service.km?.toString() ?? ''
    formData.value.cost = service.cost?.toString() ?? ''
    formData.value.types = (service.types && service.types.length) ? [...service.types] : (service.type ? [service.type] : [])
    formData.value.type = service.type || (formData.value.types[0] || '')
    formData.value.note = service.note ?? ''
    activeTab.value = 'service'
  } catch (error) {
    console.error('Error loading service for edit:', error)
    toast.error(t('services.edit.error'))
    router.push({ name: 'service-list' })
  } finally {
    isLoadingEdit.value = false
  }
}

const handleSubmit = async () => {
  if (!validateForm()) {
    toast.warning(t('validation.required'))
    return
  }
  
  isSubmitting.value = true
  
  try {
    if (activeTab.value === 'service') {
      const serviceData = {
        vehicleId: formData.value.vehicleId,
        date: formData.value.date,
        km: parseInt(formData.value.km),
        cost: parseInt(formData.value.cost),
        type: formData.value.types[0] || formData.value.type,
        types: formData.value.types.length > 0 ? formData.value.types : [],
        note: formData.value.note || undefined
      }

      if (isEditMode.value) {
        await serviceStore.updateService(editingServiceId.value, serviceData)
        toast.success(t('services.edit.success'))
        router.push({ name: 'service-list' })
        return
      }

      // Create service
      const createdService = await serviceStore.createService(serviceData)
      toast.success(t('services.add.success'))
      
      // Create reminder if requested
      if (createReminderAfterService.value && createdService?.id) {
        try {
          const serviceType = serviceData.types[0] || serviceData.type
          const serviceTypeLabel = serviceTypeStore.getServiceTypeLabel(serviceType)
          
          // Get default intervals based on service type
          const defaultIntervals = getDefaultIntervalsForServiceType(serviceType)
          
          const reminderData = {
            title: t('reminders.autoReminder') + ': ' + serviceTypeLabel,
            description: serviceData.note || null,
            vehicleId: serviceData.vehicleId,
            serviceId: createdService.id,
            source: 'auto',
            type: serviceType,
            dueDate: calculateDueDate(reminderInterval.value.days),
            dueKm: calculateDueKm(serviceData.km, reminderInterval.value.km),
            warningDaysBefore: 7,
            warningKmBefore: 500
          }
          
          await reminderStore.createReminder(reminderData)
          toast.success(t('reminders.createFromService'))
        } catch (reminderError) {
          console.error('Error creating reminder:', reminderError)
          // Don't show error to user - service was created successfully
        }
      }
    } else {
      // Create expense
      const expenseData = {
        vehicleId: formData.value.vehicleId,
        date: formData.value.date, // Will be converted in service layer
        amount: parseInt(formData.value.cost),
        category: formData.value.category,
        description: formData.value.note || undefined
      }
      
      const createdExpense = await expenseStore.createExpense(expenseData)
      toast.success(t('expenses.add.success', 'هزینه با موفقیت ثبت شد'))
      
      // Create reminder if requested
      if (createReminderAfterService.value && createdExpense?.id) {
        try {
          const expenseCategoryLabel = expenseCategoryStore.getExpenseCategoryLabel(formData.value.category)
          
          // Get current km from vehicle
          const selectedVehicle = vehicleStore.vehicles.find(v => v.id === formData.value.vehicleId)
          const currentKm = selectedVehicle?.currentKm || 0
          
          const reminderData = {
            title: t('reminders.autoReminder') + ': ' + expenseCategoryLabel,
            description: formData.value.note || undefined,
            vehicleId: formData.value.vehicleId,
            serviceId: null,
            source: 'auto',
            dueDate: calculateDueDate(reminderInterval.value.days),
            dueKm: currentKm > 0 ? calculateDueKm(currentKm.toString(), reminderInterval.value.km) : null,
            warningDaysBefore: 7,
            warningKmBefore: 500
          }
          
          await reminderStore.createReminder(reminderData)
          toast.success(t('reminders.createFromService'))
        } catch (reminderError) {
          console.error('Error creating reminder:', reminderError)
          // Don't show error to user - expense was created successfully
        }
      }
    }
    
    // Navigate back to dashboard
    router.push('/')
  } catch (error) {
    console.error('Error creating record:', error)
    const errorMessage = activeTab.value === 'service' 
      ? (error?.message || t('services.add.error'))
      : (error?.message || t('expenses.add.error', 'خطا در ثبت هزینه'))
    toast.error(errorMessage)
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  router.back()
}

// Helper functions for reminders
const getDefaultIntervalsForServiceType = (serviceType) => {
  // Default intervals based on service type
  const defaults = {
    'oil_change': { days: 90, km: 5000 },
    'filter': { days: 180, km: 10000 },
    'brakes': { days: 365, km: 20000 },
    'battery': { days: 730, km: 50000 },
    'tire': { days: 1095, km: 50000 },
    'alignment': { days: 365, km: 20000 },
    'suspension': { days: 365, km: 20000 },
    'transmission': { days: 365, km: 30000 },
    'cooling': { days: 730, km: 40000 },
    'electrical': { days: 365, km: 20000 },
    'ac': { days: 365, km: 20000 },
    'exhaust': { days: 730, km: 50000 },
    'clutch': { days: 1095, km: 60000 },
    'body': { days: 1095, km: 50000 },
    'glass': { days: 1095, km: 50000 },
    'lighting': { days: 365, km: 20000 },
    'other': { days: 90, km: 5000 }
  }
  
  return defaults[serviceType] || defaults['other']
}

const calculateDueDate = (days) => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().split('T')[0]
}

const calculateDueKm = (currentKm, intervalKm) => {
  return parseInt(currentKm) + parseInt(intervalKm)
}

// Watch service type to update reminder intervals
watch(() => formData.value.types, (newTypes) => {
  if (newTypes.length > 0 && createReminderAfterService.value) {
    const serviceType = newTypes[0]
    const intervals = getDefaultIntervalsForServiceType(serviceType)
    reminderInterval.value = intervals
  }
}, { immediate: true })

const handleRefresh = async () => {
  try {
    if (vehicleStore.vehicles.length === 0) {
      await vehicleStore.fetchVehicles()
    }
    if (serviceTypeStore.serviceTypes.length === 0) {
      await serviceTypeStore.fetchServiceTypes()
    }
    if (expenseCategoryStore.expenseCategories.length === 0) {
      await expenseCategoryStore.fetchExpenseCategories()
    }
  } catch (error) {
    console.error('Error refreshing data:', error)
    toast.error(t('common.error'))
  }
}

const switchTab = (tab) => {
  activeTab.value = tab
  // Reset form data when switching tabs
  if (tab === 'service') {
    formData.value.category = ''
  } else {
    formData.value.types = []
    formData.value.type = ''
    formData.value.km = ''
  }
  autocompleteQuery.value = ''
  showAutocompleteDropdown.value = false
}

const openServiceTypeModal = () => {
  serviceTypeSelectorKey.value++
  showServiceTypeModal.value = true
}

const handleServiceTypeSelect = (data) => {
  formData.value.types = data.types
  formData.value.type = data.types[0] // Set first type as primary
  if (data.vehicleId) {
    formData.value.vehicleId = data.vehicleId
  }
  showServiceTypeModal.value = false
  toast.success(t('services.selectType.selected') + ' ' + data.types.length + ' ' + t('services.selectType.selectedCount'))
}

const handleServiceTypeCancel = () => {
  showServiceTypeModal.value = false
}

// Autocomplete methods
const handleAutocompleteInput = (event) => {
  autocompleteQuery.value = event.target.value
  showAutocompleteDropdown.value = true
  autocompleteFocusedIndex.value = -1
}

const handleAutocompleteFocus = () => {
  if (filteredOptions.value.length > 0) {
    showAutocompleteDropdown.value = true
  }
}

const handleAutocompleteBlur = () => {
  // Delay to allow click on dropdown items
  setTimeout(() => {
    showAutocompleteDropdown.value = false
    autocompleteQuery.value = ''
  }, 200)
}

const selectOption = (option) => {
  if (activeTab.value === 'service') {
    if (!formData.value.types.includes(option.value)) {
      formData.value.types.push(option.value)
      formData.value.type = option.value // Set as primary type
    }
  } else {
    formData.value.category = option.value
  }
  autocompleteQuery.value = ''
  showAutocompleteDropdown.value = false
}

const removeServiceType = (value) => {
  const index = formData.value.types.indexOf(value)
  if (index > -1) {
    formData.value.types.splice(index, 1)
    // Update primary type if removed
    if (formData.value.type === value) {
      formData.value.type = formData.value.types[0] || ''
    }
  }
}

const removeExpenseCategory = () => {
  formData.value.category = ''
}

const handleAutocompleteKeydown = (event) => {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    if (autocompleteFocusedIndex.value < filteredOptions.value.length - 1) {
      autocompleteFocusedIndex.value++
    }
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    if (autocompleteFocusedIndex.value > 0) {
      autocompleteFocusedIndex.value--
    }
  } else if (event.key === 'Enter' && autocompleteFocusedIndex.value >= 0) {
    event.preventDefault()
    const selected = filteredOptions.value[autocompleteFocusedIndex.value]
    if (selected) {
      selectOption(selected)
    }
  } else if (event.key === 'Escape') {
    showAutocompleteDropdown.value = false
    autocompleteQuery.value = ''
  }
}

/** اعمال یک preset انتخاب سریع (سرویس‌های تعریف‌شده توسط ادمین) */
const applyServicePreset = (preset) => {
  if (activeTab.value !== 'service' || !preset?.service_type_codes?.length) return
  formData.value.types = [...preset.service_type_codes]
  formData.value.type = preset.service_type_codes[0] || ''
}

/** آیا انتخاب فعلی با این preset یکسان است؟ */
const presetMatchesSelection = (preset) => {
  const codes = preset?.service_type_codes ?? []
  const current = formData.value.types ?? []
  if (codes.length !== current.length) return false
  const set = new Set(codes)
  return current.every((c) => set.has(c))
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

  // Fetch expense categories from database if not already loaded
  if (expenseCategoryStore.expenseCategories.length === 0) {
    try {
      await expenseCategoryStore.fetchExpenseCategories()
    } catch (error) {
      console.error('Error fetching expense categories:', error)
      toast.error(t('expenses.error', 'خطا در دریافت دسته‌بندی هزینه‌ها'))
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

  // پیش‌تعریف‌های انتخاب سریع (فقط وقتی backend Django است)
  try {
    servicePresets.value = await servicePresetService.getAll()
  } catch (error) {
    console.warn('Could not load service presets:', error)
    servicePresets.value = []
  }

  // حالت ویرایش: بارگذاری سرویس از query edit=id
  if (editingServiceId.value) {
    await loadServiceForEdit()
    return
  }

  // Check for query parameters (from SelectServiceTypeView)
  if (route.query.types) {
    const types = route.query.types.split(',')
    formData.value.types = types
    formData.value.type = types[0] || ''
  }

  if (route.query.vehicleId) {
    formData.value.vehicleId = route.query.vehicleId
  }

  if (route.query.tab === 'expense') {
    activeTab.value = 'expense'
  }

  // Set first vehicle as default if available and not set from query
  if (vehicleStore.vehicles.length > 0 && !formData.value.vehicleId) {
    formData.value.vehicleId = vehicleStore.vehicles[0].id
  }
})

watch(() => route.query.edit, (newEditId) => {
  if (newEditId) {
    loadServiceForEdit()
  } else {
    formData.value = {
      vehicleId: vehicleStore.vehicles.length > 0 ? vehicleStore.vehicles[0].id : '',
      date: getInitialDate(),
      km: '',
      cost: '',
      type: '',
      types: [],
      category: '',
      note: '',
      shopName: ''
    }
    activeTab.value = 'service'
  }
}, { immediate: false })
</script>

<template>
  <MainLayout>
    <div class="flex flex-col gap-6">
        <div class="flex flex-wrap justify-between items-end gap-4">
          <header class="flex flex-col gap-1">
            <h1 class="text-[#121317] dark:text-white tracking-tight text-2xl sm:text-[32px] font-bold leading-tight">{{ isEditMode ? $t('services.edit.title') : $t('services.add.title') }}</h1>
            <p class="text-[#666e85] dark:text-gray-400 text-sm font-normal leading-normal">{{ isEditMode ? $t('services.edit.subtitle', 'ویرایش اطلاعات سرویس') : $t('services.add.subtitle') }}</p>
          </header>
          <VehicleFilterSelect
            v-model="formData.vehicleId"
            :show-all-option="false"
            :placeholder="$t('services.add.selectVehicle')"
            :error="formErrors.vehicleId"
            wrapper-class="w-full sm:w-auto min-w-[200px]"
          />
        </div>
      
      <!-- Loading state -->
      <div v-if="vehicleStore.isLoading || serviceTypeStore.isLoading || expenseCategoryStore.isLoading || isLoadingEdit" class="flex justify-center py-12">
        <LoadingSpinner size="lg" :show-text="true" :text="$t('common.loading')" />
      </div>
      
      <!-- Error state -->
      <Card v-else-if="vehicleStore.error || serviceTypeStore.error || expenseCategoryStore.error" variant="danger" class="p-6">
        <div class="flex flex-col items-center gap-4 text-center">
          <span class="material-symbols-outlined text-5xl text-red-500">error</span>
          <div>
            <h3 class="text-lg font-bold text-red-700 dark:text-red-400 mb-2">{{ $t('common.error') }}</h3>
            <p class="text-sm text-red-600 dark:text-red-300">
              {{ vehicleStore.error || serviceTypeStore.error || expenseCategoryStore.error }}
            </p>
          </div>
          <Button @click="handleRefresh" variant="primary">
            {{ $t('common.retry') }}
          </Button>
        </div>
      </Card>
      
      <!-- Form -->
      <Card v-else class="overflow-hidden">
        <div 
          role="tablist" 
          aria-label="$t('services.add.selectTab')"
          class="flex border-b border-[#dcdfe4] dark:border-gray-700"
        >
          <button 
            @click="switchTab('service')"
            @keydown.enter="switchTab('service')"
            @keydown.space.prevent="switchTab('service')"
            role="tab"
            :aria-selected="activeTab === 'service'"
            :aria-controls="activeTab === 'service' ? 'service-tabpanel' : undefined"
            :tabindex="activeTab === 'service' ? 0 : -1"
            :id="activeTab === 'service' ? 'service-tab' : undefined"
            :class="[
              'flex-1 flex flex-col items-center justify-center py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
              activeTab === 'service' 
                ? 'border-b-[3px] border-b-primary text-primary dark:text-blue-400' 
                : 'border-b-[3px] border-b-transparent text-[#666e85] dark:text-gray-400'
            ]"
          >
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[20px]" aria-hidden="true">build</span>
              <p class="text-sm font-bold leading-normal tracking-[0.015em]">{{ $t('services.add.serviceTab') }}</p>
            </div>
          </button>
          <button 
            @click="switchTab('expense')"
            @keydown.enter="switchTab('expense')"
            @keydown.space.prevent="switchTab('expense')"
            role="tab"
            :aria-selected="activeTab === 'expense'"
            :aria-controls="activeTab === 'expense' ? 'expense-tabpanel' : undefined"
            :tabindex="activeTab === 'expense' ? 0 : -1"
            :id="activeTab === 'expense' ? 'expense-tab' : undefined"
            :class="[
              'flex-1 flex flex-col items-center justify-center py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
              activeTab === 'expense' 
                ? 'border-b-[3px] border-b-primary text-primary dark:text-blue-400' 
                : 'border-b-[3px] border-b-transparent text-[#666e85] dark:text-gray-400'
            ]"
          >
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[20px]" aria-hidden="true">receipt_long</span>
              <p class="text-sm font-bold leading-normal tracking-[0.015em]">{{ $t('expenses.add.expenseTab') }}</p>
            </div>
          </button>
        </div>
          
        <form 
          @submit.prevent="handleSubmit" 
          class="p-6 sm:p-8 space-y-8"
          :aria-labelledby="activeTab === 'service' ? 'service-tab' : 'expense-tab'"
        >
          <div 
            v-if="activeTab === 'service'"
            role="tabpanel"
            id="service-tabpanel"
            :aria-labelledby="'service-tab'"
            tabindex="0"
          >
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <PersianDatePicker
              v-if="isPersianLocale"
              :model-value="formData.date"
              @update:model-value="(v) => { formData.date = v }"
              :label="$t('services.add.serviceDate')"
              :error="formErrors.date"
              required
              :placeholder="$t('services.add.serviceDatePlaceholder', '۱۴۰۳/۰۱/۰۱')"
            />
            <Input
              v-else
              v-model="formData.date"
              :label="$t('services.add.serviceDate')"
              type="date"
              :error="formErrors.date"
              required
              :aria-required="true"
            />
            <div v-if="activeTab === 'service'" class="flex flex-col gap-2">
              <Input
                v-model="formData.km"
                :label="$t('services.add.currentKm')"
                type="number"
                :placeholder="$t('services.add.currentKmPlaceholder')"
                :error="formErrors.km"
                required
                :aria-required="true"
                dir="ltr"
                class="text-right"
              />
            </div>
          </div>
            
            <!-- Service Type (for service tab) -->
            <div v-if="activeTab === 'service'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <label class="flex flex-col gap-2 md:col-span-2">
                <span class="text-[#121317] dark:text-gray-200 text-sm font-medium leading-normal">{{ $t('services.add.serviceType') }}</span>
                <!-- انتخاب سریع (پیش‌تعریف‌های ادمین) -->
                <div v-if="servicePresets.length > 0" class="flex flex-wrap gap-2 mb-2">
                  <button
                    v-for="preset in servicePresets"
                    :key="preset.preset_id"
                    type="button"
                    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs transition-colors"
                    :class="presetMatchesSelection(preset)
                      ? 'bg-primary text-white border-primary dark:bg-blue-500 dark:border-blue-500'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'"
                    @click="applyServicePreset(preset)"
                  >
                    <span class="material-symbols-outlined text-[16px]" aria-hidden="true">build</span>
                    <span>{{ preset.name }}</span>
                  </button>
                </div>
                <div class="relative">
                  <div
                    class="flex flex-wrap items-center gap-2 min-h-[48px] p-2 pe-12 rounded-xl border border-[#dcdfe4] dark:border-gray-700 bg-white dark:bg-gray-800 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-shadow"
                    :class="{ 'border-red-500': formErrors.type }"
                  >
                    <!-- Selected service type tags -->
                    <span 
                      v-for="(type, index) in formData.types" 
                      :key="index"
                      class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary dark:text-blue-400 text-sm font-medium"
                    >
                      {{ getLabel(type) }}
                      <button
                        @click.stop="removeServiceType(type)"
                        type="button"
                        class="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                        :aria-label="$t('common.close')"
                      >
                        <span class="material-symbols-outlined text-sm">close</span>
                      </button>
                    </span>
                    <!-- Autocomplete input -->
                    <input
                      v-model="autocompleteQuery"
                      @input="handleAutocompleteInput"
                      @focus="handleAutocompleteFocus"
                      @blur="handleAutocompleteBlur"
                      @keydown="handleAutocompleteKeydown"
                      role="combobox"
                      :aria-label="$t('services.add.selectServiceType')"
                      :aria-expanded="showAutocompleteDropdown"
                      :aria-controls="showAutocompleteDropdown ? 'service-type-autocomplete' : undefined"
                      :aria-autocomplete="'list'"
                      class="flex-1 min-w-[120px] h-8 border-none bg-transparent text-[#121317] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500"
                      :placeholder="formData.types.length === 0 ? $t('services.add.selectServiceType') : ''"
                      type="text"
                    />
                    <!-- Alternative: Open modal button -->
                    <button
                      @click.stop="openServiceTypeModal"
                      type="button"
                      :aria-label="$t('services.add.selectFromModal')"
                      class="absolute left-2 top-1/2 -translate-y-1/2 px-2 py-1.5 rounded-lg text-gray-400 hover:text-primary dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary flex items-center gap-1"
                      :title="$t('services.add.selectFromModal')"
                    >
                      <span class="material-symbols-outlined text-lg" aria-hidden="true">tune</span>
                      <span class="hidden sm:inline text-xs">{{ $t('services.add.selectFromModal') }}</span>
                    </button>
                  </div>
                  <!-- Autocomplete dropdown -->
                  <Transition name="fade">
                    <div 
                      v-if="showAutocompleteDropdown && filteredOptions.length > 0"
                      id="service-type-autocomplete"
                      role="listbox"
                      class="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-60 overflow-y-auto"
                      @mousedown.prevent
                    >
                      <div
                        v-for="group in groupedFilteredOptions"
                        :key="group.id"
                        class="border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                      >
                        <div v-if="group.title" class="px-4 pt-2 pb-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {{ group.title }}
                        </div>
                        <button
                          v-for="(option, index) in group.options"
                          :key="option.value"
                          @click="selectOption(option)"
                          @mouseenter="autocompleteFocusedIndex = index"
                          type="button"
                          role="option"
                          :aria-selected="autocompleteFocusedIndex === index"
                          class="w-full px-4 py-3 text-right hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between gap-2"
                          :class="{ 'bg-gray-50 dark:bg-gray-700': autocompleteFocusedIndex === index }"
                        >
                          <div class="flex items-center gap-2">
                            <span
                              v-if="option.icon"
                              class="material-symbols-outlined text-primary/70 dark:text-blue-300 text-lg"
                              aria-hidden="true"
                            >
                              {{ option.icon }}
                            </span>
                            <span class="text-sm font-medium text-[#121317] dark:text-white">{{ option.label }}</span>
                          </div>
                          <span class="material-symbols-outlined text-gray-400 text-lg">add</span>
                        </button>
                      </div>
                    </div>
                  </Transition>
                </div>
                <p v-if="formErrors.type" class="text-red-500 text-xs mt-1">{{ formErrors.type }}</p>
              </label>
              <div class="flex flex-col gap-2">
                <label class="text-[#121317] dark:text-gray-200 text-sm font-medium leading-normal">
                  {{ $t('services.add.totalCost') }} <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <span class="absolute left-4 top-3 text-gray-500 dark:text-gray-400 text-sm font-medium">{{ $t('common.currency') }}</span>
                  <Input
                    v-model="formData.cost"
                    type="number"
                    placeholder="۰"
                    :error="formErrors.cost"
                    required
                    dir="ltr"
                    class="text-right ps-16"
                  />
                </div>
              </div>
            </div>
            
            <!-- Reminder Section (only for service tab) -->
            <div v-if="activeTab === 'service'" class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl">
              <div class="flex items-start gap-3">
                <input
                  id="create-reminder"
                  v-model="createReminderAfterService"
                  type="checkbox"
                  class="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <div class="flex-1">
                  <label for="create-reminder" class="text-sm font-medium text-[#121317] dark:text-white cursor-pointer">
                    {{ t('reminders.createFromService') }}
                  </label>
                  <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {{ t('reminders.createFromServiceDescription') }}
                  </p>
                  
                  <!-- Reminder intervals (shown when checkbox is checked) -->
                  <div v-if="createReminderAfterService" class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                        {{ t('reminders.form.timeInterval') }}
                      </label>
                      <div class="flex gap-2">
                        <Input
                          v-model.number="reminderInterval.days"
                          type="number"
                          min="1"
                          class="flex-1"
                        />
                        <span class="text-xs text-gray-500 self-center">{{ t('reminders.form.days') }}</span>
                      </div>
                    </div>
                    <div>
                      <label class="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                        {{ t('reminders.form.kmInterval') }}
                      </label>
                      <div class="flex gap-2">
                        <Input
                          v-model.number="reminderInterval.km"
                          type="number"
                          min="1"
                          class="flex-1"
                        />
                        <span class="text-xs text-gray-500 self-center">{{ t('common.km') }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
          
          <div 
            v-else
            role="tabpanel"
            id="expense-tabpanel"
            :aria-labelledby="'expense-tab'"
            tabindex="0"
          >
            <!-- Expense Category (for expense tab) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <label class="flex flex-col gap-2 md:col-span-2">
                <span class="text-[#121317] dark:text-gray-200 text-sm font-medium leading-normal">{{ $t('expenses.category') }}</span>
                <div class="relative">
                  <div class="flex flex-wrap items-center gap-2 min-h-[48px] p-2 pe-12 rounded-xl border border-[#dcdfe4] dark:border-gray-700 bg-white dark:bg-gray-800 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-shadow"
                    :class="{ 'border-red-500': formErrors.category }"
                  >
                    <!-- Selected expense category tag -->
                    <span 
                      v-if="formData.category"
                      class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary dark:text-blue-400 text-sm font-medium"
                    >
                      {{ getLabel(formData.category) }}
                      <button
                        @click.stop="removeExpenseCategory"
                        type="button"
                        class="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                        :aria-label="$t('common.close')"
                      >
                        <span class="material-symbols-outlined text-sm">close</span>
                      </button>
                    </span>
                    <!-- Autocomplete input -->
                    <input
                      v-model="autocompleteQuery"
                      @input="handleAutocompleteInput"
                      @focus="handleAutocompleteFocus"
                      @blur="handleAutocompleteBlur"
                      @keydown="handleAutocompleteKeydown"
                      :aria-label="$t('expenses.selectCategory', 'انتخاب دسته‌بندی...')"
                      :aria-expanded="showAutocompleteDropdown"
                      :aria-controls="showAutocompleteDropdown ? 'expense-category-autocomplete' : undefined"
                      :aria-autocomplete="'list'"
                      class="flex-1 min-w-[120px] h-8 border-none bg-transparent text-[#121317] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500"
                      :placeholder="!formData.category ? $t('expenses.selectCategory', 'انتخاب دسته‌بندی...') : ''"
                      type="text"
                    />
                  </div>
                  <!-- Autocomplete dropdown -->
                  <Transition name="fade">
                    <ul 
                      v-if="showAutocompleteDropdown && filteredOptions.length > 0"
                      id="expense-category-autocomplete"
                      role="listbox"
                      class="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-60 overflow-y-auto"
                      @mousedown.prevent
                    >
                      <li
                        v-for="(option, index) in filteredOptions"
                        :key="option.value"
                        role="option"
                        :aria-selected="autocompleteFocusedIndex === index"
                        :id="`expense-option-${index}`"
                      >
                        <button
                          @click="selectOption(option)"
                          @mouseenter="autocompleteFocusedIndex = index"
                          type="button"
                          class="w-full px-4 py-3 text-right hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between gap-2 focus:outline-none focus:ring-2 focus:ring-primary"
                          :class="{ 'bg-gray-50 dark:bg-gray-700': autocompleteFocusedIndex === index }"
                        >
                          <span class="text-sm font-medium text-[#121317] dark:text-white">{{ option.label }}</span>
                          <span class="material-symbols-outlined text-gray-400 text-lg" aria-hidden="true">add</span>
                        </button>
                      </li>
                    </ul>
                  </Transition>
                </div>
                <p v-if="formErrors.category" class="text-red-500 text-xs mt-1" role="alert" aria-live="polite">{{ formErrors.category }}</p>
              </label>
              <div class="flex flex-col gap-2">
                <label class="text-[#121317] dark:text-gray-200 text-sm font-medium leading-normal">
                  {{ $t('expenses.amount') }} <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <span class="absolute left-4 top-3 text-gray-500 dark:text-gray-400 text-sm font-medium">{{ $t('common.currency') }}</span>
                  <Input
                    v-model="formData.cost"
                    type="number"
                    placeholder="۰"
                    :error="formErrors.cost"
                    required
                    dir="ltr"
                    class="text-right ps-16"
                  />
                </div>
              </div>
            </div>
          </div>
            
          <div class="space-y-6">
            <Input
              v-model="formData.shopName"
              :label="$t('services.add.shopName') + ' (' + $t('common.optional') + ')'"
              :placeholder="$t('services.add.shopNamePlaceholder')"
              icon="storefront"
            />
            <label class="flex flex-col gap-2">
              <span class="text-[#121317] dark:text-gray-200 text-sm font-medium leading-normal">{{ $t('services.add.note') }}</span>
              <textarea 
                v-model="formData.note"
                class="form-textarea w-full rounded-xl border border-[#dcdfe4] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#121317] dark:text-white min-h-[100px] p-4 focus:border-primary focus:ring-1 focus:ring-primary transition-shadow resize-y" 
                :placeholder="$t('services.add.notePlaceholder')"
              ></textarea>
            </label>
          </div>
          
          <!-- Reminder Section (for expense tab) -->
          <div v-if="activeTab === 'expense'" class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl">
            <div class="flex items-start gap-3">
              <input
                id="create-reminder-expense"
                v-model="createReminderAfterService"
                type="checkbox"
                class="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <div class="flex-1">
                <label for="create-reminder-expense" class="text-sm font-medium text-[#121317] dark:text-white cursor-pointer">
                  {{ t('reminders.createFromService') }}
                </label>
                <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {{ t('reminders.createFromServiceDescription') }}
                </p>
                
                <!-- Reminder intervals (shown when checkbox is checked) -->
                <div v-if="createReminderAfterService" class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                      {{ t('reminders.form.timeInterval') }}
                    </label>
                    <div class="flex gap-2">
                      <Input
                        v-model.number="reminderInterval.days"
                        type="number"
                        min="1"
                        class="flex-1"
                      />
                      <span class="text-xs text-gray-500 self-center">{{ t('reminders.form.days') }}</span>
                    </div>
                  </div>
                  <div>
                    <label class="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                      {{ t('reminders.form.kmInterval') }}
                    </label>
                    <div class="flex gap-2">
                      <Input
                        v-model.number="reminderInterval.km"
                        type="number"
                        min="1"
                        class="flex-1"
                      />
                      <span class="text-xs text-gray-500 self-center">{{ t('common.km') }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Error display -->
          <div v-if="serviceStore.error || expenseStore.error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p class="text-red-700 dark:text-red-400 text-sm">{{ serviceStore.error || expenseStore.error }}</p>
          </div>
          
          <div class="pt-4 flex flex-col sm:flex-row justify-end gap-4">
            <Button 
              @click="handleCancel"
              variant="outline"
              :disabled="isSubmitting"
              :aria-label="$t('services.add.cancel')"
            >
              {{ $t('services.add.cancel') }}
            </Button>
            <Button 
              type="submit"
              :loading="isSubmitting"
              :disabled="!isFormValid || isSubmitting"
              icon="save"
              :aria-label="isSubmitting ? (isEditMode ? $t('services.edit.submitting') : $t('services.add.submitting')) : (isEditMode ? $t('services.edit.submit') : $t('services.add.submit'))"
            >
              {{ isSubmitting ? (isEditMode ? $t('services.edit.submitting') : $t('services.add.submitting')) : (isEditMode ? $t('services.edit.submit') : $t('services.add.submit')) }}
            </Button>
          </div>
        </form>
      </Card>
      
      <div class="text-center py-4">
        <p class="text-sm text-gray-400 dark:text-gray-600">
          {{ $t('services.add.helpText') }} 
          <button @click="openServiceTypeModal" class="text-primary dark:text-blue-400 hover:underline">
            {{ $t('services.add.helpLink') }}
          </button>
        </p>
      </div>
    </div>
    
    <!-- Service Type Selection Modal -->
    <Modal
      v-model:open="showServiceTypeModal"
      size="lg"
      :title="$t('services.selectType.title')"
    >
      <ServiceTypeSelector
        :key="serviceTypeSelectorKey"
        :vehicle-id="formData.vehicleId"
        :selected-types="formData.types"
        @select="handleServiceTypeSelect"
        @cancel="handleServiceTypeCancel"
      />
    </Modal>
  </MainLayout>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
