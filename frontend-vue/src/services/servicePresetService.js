import { api } from './index'

const isDjango = (env = import.meta.env) => env?.VITE_BACKEND_TYPE === 'django'

/**
 * سرویس پیش‌تعریف‌های انتخاب سریع سرویس (فقط وقتی backend نوع django است).
 * هر preset توسط ادمین تعریف شده و شامل لیستی از کد انواع سرویس است.
 */

export const servicePresetService = {
  /**
   * دریافت همه presetهای فعال
   * @param {object} [env] - برای تست؛ پیش‌فرض: import.meta.env
   * @returns {Promise<Array<{ preset_id: number, name: string, display_order: number, service_type_codes: string[] }>>}
   */
  async getAll(env = import.meta.env) {
    if (!isDjango(env)) {
      return []
    }
    try {
      const response = await api.get('/service-presets/')
      const raw = response.data?.data ?? []
      return raw.map((r) => ({
        preset_id: r.id ?? r.preset_id,
        id: r.id,
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
