import { supabase } from './index'

/**
 * Expense Category Service
 * 
 * دریافت دسته‌بندی هزینه‌ها از دیتابیس
 * کدها و metadata از دیتابیس، ترجمه‌ها از i18n
 */

export const expenseCategoryService = {
  /**
   * دریافت همه دسته‌بندی هزینه‌های فعال از دیتابیس
   * @returns {Promise<Array>} لیست دسته‌بندی‌ها با کد، icon، group_name
   */
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('expense_categories')
        .select('code, icon, group_name, is_active')
        .eq('is_active', true)
        .order('group_name', { ascending: true })
        .order('code', { ascending: true })

      if (error) {
        console.error('Error fetching expense categories:', error)
        throw new Error(error.message || 'خطا در دریافت دسته‌بندی هزینه‌ها')
      }

      return data || []
    } catch (error) {
      console.error('Error in expenseCategoryService.getAll:', error)
      throw error
    }
  },

  /**
   * دریافت دسته‌بندی‌ها بر اساس گروه
   * @returns {Promise<Object>} دسته‌بندی‌ها گروه‌بندی شده
   */
  async getGrouped() {
    try {
      const allCategories = await this.getAll()
      
      // گروه‌بندی بر اساس group_name
      const grouped = {}
      allCategories.forEach(category => {
        if (!grouped[category.group_name]) {
          grouped[category.group_name] = []
        }
        grouped[category.group_name].push(category)
      })

      return grouped
    } catch (error) {
      console.error('Error in expenseCategoryService.getGrouped:', error)
      throw error
    }
  },

  /**
   * دریافت یک دسته‌بندی بر اساس کد
   * @param {string} code - کد دسته‌بندی
   * @returns {Promise<Object|null>} اطلاعات دسته‌بندی
   */
  async getByCode(code) {
    try {
      const { data, error } = await supabase
        .from('expense_categories')
        .select('code, icon, group_name, is_active')
        .eq('code', code)
        .eq('is_active', true)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null
        }
        console.error('Error fetching expense category:', error)
        throw new Error(error.message || 'خطا در دریافت دسته‌بندی هزینه')
      }

      return data
    } catch (error) {
      console.error('Error in expenseCategoryService.getByCode:', error)
      throw error
    }
  }
}

