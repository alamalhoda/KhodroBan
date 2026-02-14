/**
 * Composable برای فرمت تاریخ بر اساس زبان فعلی
 * زبان فارسی → شمسی YYYY/MM/DD، غیرفارسی → میلادی YYYY/MM/DD
 */
import { useI18n } from 'vue-i18n'
import { formatDateByLocale } from '@/utils/formatters'

/**
 * @returns {(dateString: string) => string} تابع فرمت تاریخ با زبان فعلی
 */
export function useFormatDate() {
  const { locale } = useI18n()
  return (dateString) => formatDateByLocale(dateString, locale.value)
}
