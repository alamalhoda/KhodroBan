import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { serviceTypeService } from '../services/serviceTypeService'
import { useI18n } from 'vue-i18n'

/**
 * Service Type Store
 * 
 * مدیریت انواع سرویس از دیتابیس
 * ترکیب داده‌های دیتابیس با ترجمه‌های i18n
 */
export const useServiceTypeStore = defineStore('serviceType', () => {
  const { t } = useI18n()
  
  // State
  const serviceTypes = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const lastFetched = ref(null)
  const cacheDuration = 5 * 60 * 1000 // 5 minutes

  // Getters
  /**
   * دریافت انواع سرویس با ترجمه
   * ترکیب داده‌های دیتابیس با ترجمه‌های i18n
   */
  const serviceTypesWithTranslation = computed(() => {
    return serviceTypes.value.map(type => {
      // ترجمه نام از i18n
      const translatedName = t(`services.types.${type.code}`, type.code)
      
      // ترجمه نام گروه از i18n
      // TODO: بعداً باید group_name را به کد انگلیسی تبدیل کنیم (مثل 'engine_oil' به جای 'موتور و روغن')
      // و در i18n از کلید services.selectType.categoryGroups.engine_oil استفاده کنیم
      const translatedGroup = t(`services.selectType.categories.${type.group_name}`, type.group_name)
      
      return {
        ...type,
        name: translatedName,
        groupName: translatedGroup,
        // برای سازگاری با کد موجود
        value: type.code,
        label: translatedName,
        category: type.group_name
      }
    })
  })

  /**
   * انواع سرویس گروه‌بندی شده با ترجمه
   */
  const groupedServiceTypes = computed(() => {
    const grouped = {}
    
    serviceTypesWithTranslation.value.forEach(type => {
      const groupKey = type.group_name
      if (!grouped[groupKey]) {
        grouped[groupKey] = {
          id: groupKey,
          title: type.groupName,
          icon: getGroupIcon(type.group_name),
          color: getGroupColor(type.group_name),
          services: []
        }
      }
      
      grouped[groupKey].services.push({
        id: type.code,
        title: type.name,
        value: type.code,
        label: type.name,
        description: t(`services.selectType.descriptions.${type.code}`, ''),
        icon: type.icon
      })
    })

    return Object.values(grouped)
  })

  /**
   * لیست ساده انواع سرویس برای autocomplete و dropdown
   */
  const serviceTypeOptions = computed(() => {
    return serviceTypesWithTranslation.value.map(type => ({
      value: type.code,
      label: type.name,
      category: type.group_name,
      icon: type.icon
    }))
  })

  /**
   * دریافت نام ترجمه شده یک نوع سرویس
   */
  const getServiceTypeLabel = computed(() => (code) => {
    const type = serviceTypesWithTranslation.value.find(t => t.code === code)
    return type ? type.name : code
  })

  // Helper functions
  const getGroupIcon = (groupName) => {
    const iconMap = {
      'موتور و روغن': 'oil_barrel',
      'چرخ و تعلیق': 'tire_repair',
      'ترمز و ایمنی': 'security',
      'باتری و برق': 'battery_charging_full',
      'برق و الکترونیک': 'bolt',
      'گیربکس و اگزوز': 'settings',
      'بدنه و شیشه': 'square',
      'سایر': 'more_horiz'
    }
    return iconMap[groupName] || 'build'
  }

  const getGroupColor = (groupName) => {
    const colorMap = {
      'موتور و روغن': 'orange',
      'چرخ و تعلیق': 'blue',
      'ترمز و ایمنی': 'green',
      'باتری و برق': 'red',
      'برق و الکترونیک': 'purple',
      'گیربکس و اگزوز': 'teal',
      'بدنه و شیشه': 'slate',
      'سایر': 'gray'
    }
    return colorMap[groupName] || 'blue'
  }

  // Actions
  /**
   * دریافت انواع سرویس از دیتابیس
   * با کش برای جلوگیری از درخواست‌های مکرر
   */
  const fetchServiceTypes = async (force = false) => {
    // بررسی کش
    if (!force && serviceTypes.value.length > 0 && lastFetched.value) {
      const now = Date.now()
      if (now - lastFetched.value < cacheDuration) {
        return serviceTypes.value
      }
    }

    isLoading.value = true
    error.value = null

    try {
      const data = await serviceTypeService.getAll()
      serviceTypes.value = data
      lastFetched.value = Date.now()
      return data
    } catch (err) {
      error.value = err.message || 'خطا در دریافت انواع سرویس'
      console.error('Error fetching service types:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * پاک کردن کش
   */
  const clearCache = () => {
    serviceTypes.value = []
    lastFetched.value = null
  }

  /**
   * دریافت یک نوع سرویس بر اساس کد
   */
  const getServiceTypeByCode = async (code) => {
    // ابتدا در کش جستجو کن
    const cached = serviceTypes.value.find(t => t.code === code)
    if (cached) {
      return {
        ...cached,
        name: t(`services.types.${cached.code}`, cached.code),
        groupName: t(`services.selectType.categories.${cached.group_name}`, cached.group_name)
      }
    }

    // اگر در کش نبود، از دیتابیس بگیر
    try {
      const data = await serviceTypeService.getByCode(code)
      if (data) {
        return {
          ...data,
          name: t(`services.types.${data.code}`, data.code),
          groupName: t(`services.selectType.categories.${data.group_name}`, data.group_name)
        }
      }
      return null
    } catch (err) {
      console.error('Error fetching service type by code:', err)
      return null
    }
  }

  return {
    // State
    serviceTypes,
    isLoading,
    error,
    // Getters
    serviceTypesWithTranslation,
    groupedServiceTypes,
    serviceTypeOptions,
    getServiceTypeLabel,
    // Actions
    fetchServiceTypes,
    clearCache,
    getServiceTypeByCode
  }
})

