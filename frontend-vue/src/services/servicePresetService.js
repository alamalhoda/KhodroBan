import { api } from './index'

const isDjango = () => import.meta.env.VITE_BACKEND_TYPE === 'django'

/**
 * سرویس پیش‌تعریف‌های انتخاب سریع سرویس (فقط وقتی backend نوع django است).
 * هر preset توسط ادمین تعریف شده و شامل لیستی از کد انواع سرویس است.
 */

export const servicePresetService = {
  /**
   * دریافت همه presetهای فعال
   * @returns {Promise<Array<{ preset_id: number, name: string, display_order: number, service_type_codes: string[] }>>}
   */
  async getAll() {
    if (!isDjango()) {
      return []
    }
    try {
      const response = await api.get('/service-presets/')
      const raw = response.data?.data ?? []
      return raw.map((r) => ({
        preset_id: r.preset_id,
        name: r.name,
        display_order: r.display_order ?? 0,
        service_type_codes: Array.isArray(r.service_type_codes) ? r.service_type_codes : []
      }))
    } catch (error) {
      console.error('Error fetching service presets:', error)
      return []
    }
  }
}
