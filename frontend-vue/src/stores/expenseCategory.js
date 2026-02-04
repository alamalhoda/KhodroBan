import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { expenseCategoryService } from '../services/expenseCategoryService'
import { useI18n } from 'vue-i18n'

/**
 * Expense Category Store
 * 
 * مدیریت دسته‌بندی هزینه‌ها از دیتابیس
 * ترکیب داده‌های دیتابیس با ترجمه‌های i18n
 */
export const useExpenseCategoryStore = defineStore('expenseCategory', () => {
  const { t } = useI18n()
  
  // State
  const expenseCategories = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const lastFetched = ref(null)
  const cacheDuration = 5 * 60 * 1000 // 5 minutes

  // Getters
  /**
   * دریافت دسته‌بندی‌ها با ترجمه
   * ترکیب داده‌های دیتابیس با ترجمه‌های i18n
   */
  const expenseCategoriesWithTranslation = computed(() => {
    return expenseCategories.value.map(category => {
      // ترجمه نام از i18n
      const translatedName = t(`expenses.categories.${category.code}`, category.code)
      
      // ترجمه نام گروه از i18n
      // TODO: بعداً باید group_name را به کد انگلیسی تبدیل کنیم (مثل 'fuel' به جای 'سوخت')
      // و در i18n از کلید expenses.categoryGroups.fuel استفاده کنیم
      const translatedGroup = t(`expenses.categoryGroups.${category.group_name}`, category.group_name)
      
      return {
        ...category,
        name: translatedName,
        groupName: translatedGroup,
        // برای سازگاری با کد موجود
        value: category.code,
        label: translatedName
      }
    })
  })

  /**
   * دسته‌بندی‌ها گروه‌بندی شده با ترجمه
   */
  const groupedExpenseCategories = computed(() => {
    const grouped = {}
    
    expenseCategoriesWithTranslation.value.forEach(category => {
      const groupKey = category.group_name
      if (!grouped[groupKey]) {
        grouped[groupKey] = {
          id: groupKey,
          title: category.groupName,
          icon: getGroupIcon(category.group_name),
          color: getGroupColor(category.group_name),
          categories: []
        }
      }
      
      grouped[groupKey].categories.push({
        id: category.code,
        title: category.name,
        value: category.code,
        label: category.name,
        icon: category.icon
      })
    })

    return Object.values(grouped)
  })

  /**
   * لیست ساده دسته‌بندی‌ها برای dropdown
   */
  const expenseCategoryOptions = computed(() => {
    return expenseCategoriesWithTranslation.value.map(category => ({
      value: category.code,
      label: category.name,
      group: category.group_name,
      icon: category.icon
    }))
  })

  /**
   * دریافت نام ترجمه شده یک دسته‌بندی
   */
  const getExpenseCategoryLabel = computed(() => (code) => {
    const category = expenseCategoriesWithTranslation.value.find(c => c.code === code)
    return category ? category.name : code
  })

  // Helper functions
  const getGroupIcon = (groupName) => {
    const iconMap = {
      'سوخت': 'local_gas_station',
      'نگهداری و سرویس': 'build',
      'اجباری و قانونی': 'gavel',
      'جریمه و عوارض': 'money_off',
      'قطعات و دستمزد': 'construction',
      'پارکینگ': 'local_parking',
      'تعمیرات': 'handyman',
      'سایر': 'more_horiz'
    }
    return iconMap[groupName] || 'receipt'
  }

  const getGroupColor = (groupName) => {
    const colorMap = {
      'سوخت': 'orange',
      'نگهداری و سرویس': 'blue',
      'اجباری و قانونی': 'red',
      'جریمه و عوارض': 'yellow',
      'قطعات و دستمزد': 'green',
      'پارکینگ': 'purple',
      'تعمیرات': 'teal',
      'سایر': 'gray'
    }
    return colorMap[groupName] || 'blue'
  }

  // Actions
  /**
   * دریافت دسته‌بندی‌ها از دیتابیس
   * با کش برای جلوگیری از درخواست‌های مکرر
   */
  const fetchExpenseCategories = async (force = false) => {
    // بررسی کش
    if (!force && expenseCategories.value.length > 0 && lastFetched.value) {
      const now = Date.now()
      if (now - lastFetched.value < cacheDuration) {
        return expenseCategories.value
      }
    }

    isLoading.value = true
    error.value = null

    try {
      const data = await expenseCategoryService.getAll()
      expenseCategories.value = data
      lastFetched.value = Date.now()
      return data
    } catch (err) {
      error.value = err.message || 'خطا در دریافت دسته‌بندی هزینه‌ها'
      console.error('Error fetching expense categories:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * پاک کردن کش
   */
  const clearCache = () => {
    expenseCategories.value = []
    lastFetched.value = null
  }

  /**
   * دریافت یک دسته‌بندی بر اساس کد
   */
  const getExpenseCategoryByCode = async (code) => {
    // ابتدا در کش جستجو کن
    const cached = expenseCategories.value.find(c => c.code === code)
    if (cached) {
      return {
        ...cached,
        name: t(`expenses.categories.${cached.code}`, cached.code),
        groupName: t(`expenses.categoryGroups.${cached.group_name}`, cached.group_name)
      }
    }

    // اگر در کش نبود، از دیتابیس بگیر
    try {
      const data = await expenseCategoryService.getByCode(code)
      if (data) {
        return {
          ...data,
          name: t(`expenses.categories.${data.code}`, data.code),
          groupName: t(`expenses.categoryGroups.${data.group_name}`, data.group_name)
        }
      }
      return null
    } catch (err) {
      console.error('Error fetching expense category by code:', err)
      return null
    }
  }

  return {
    // State
    expenseCategories,
    isLoading,
    error,
    // Getters
    expenseCategoriesWithTranslation,
    groupedExpenseCategories,
    expenseCategoryOptions,
    getExpenseCategoryLabel,
    // Actions
    fetchExpenseCategories,
    clearCache,
    getExpenseCategoryByCode
  }
})

