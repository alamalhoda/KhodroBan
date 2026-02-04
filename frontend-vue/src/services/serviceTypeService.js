import { supabase } from './index'

/**
 * Service Type Service
 * 
 * دریافت انواع سرویس از دیتابیس
 * کدها و metadata از دیتابیس، ترجمه‌ها از i18n
 */

export const serviceTypeService = {
  /**
   * دریافت همه انواع سرویس فعال از دیتابیس
   * @returns {Promise<Array>} لیست انواع سرویس با کد، icon، group_name
   */
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('service_types')
        .select('code, icon, group_name, is_active')
        .eq('is_active', true)
        .order('group_name', { ascending: true })
        .order('code', { ascending: true })

      if (error) {
        console.error('Error fetching service types:', error)
        throw new Error(error.message || 'خطا در دریافت انواع سرویس')
      }

      return data || []
    } catch (error) {
      console.error('Error in serviceTypeService.getAll:', error)
      throw error
    }
  },

  /**
   * دریافت انواع سرویس بر اساس گروه
   * @returns {Promise<Object>} انواع سرویس گروه‌بندی شده
   */
  async getGrouped() {
    try {
      const allTypes = await this.getAll()
      
      // گروه‌بندی بر اساس group_name
      const grouped = {}
      allTypes.forEach(type => {
        if (!grouped[type.group_name]) {
          grouped[type.group_name] = []
        }
        grouped[type.group_name].push(type)
      })

      return grouped
    } catch (error) {
      console.error('Error in serviceTypeService.getGrouped:', error)
      throw error
    }
  },

  /**
   * دریافت یک نوع سرویس بر اساس کد
   * @param {string} code - کد نوع سرویس
   * @returns {Promise<Object|null>} اطلاعات نوع سرویس
   */
  async getByCode(code) {
    try {
      const { data, error } = await supabase
        .from('service_types')
        .select('code, icon, group_name, is_active')
        .eq('code', code)
        .eq('is_active', true)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null
        }
        console.error('Error fetching service type:', error)
        throw new Error(error.message || 'خطا در دریافت نوع سرویس')
      }

      return data
    } catch (error) {
      console.error('Error in serviceTypeService.getByCode:', error)
      throw error
    }
  }
}

