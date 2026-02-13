/**
 * توابع کمکی برای تاریخ شمسی (ورودی/خروجی فرم و backend)
 * قرارداد: رشته شمسی YYYY/MM/DD
 */

import PersianDate from 'persian-date'

const JALALI_FORMAT = 'YYYY/MM/DD'

/**
 * امروز به صورت رشته شمسی YYYY/MM/DD
 * @returns {string}
 */
export function getTodayJalaliStr() {
  const pd = new PersianDate()
  const y = pd.year()
  const m = String(pd.month()).padStart(2, '0')
  const d = String(pd.date()).padStart(2, '0')
  return `${y}/${m}/${d}`
}

/**
 * تبدیل تاریخ میلادی (ISO YYYY-MM-DD) به رشته شمسی YYYY/MM/DD
 * اگر ورودی از قبل شمسی باشد (سال 1300–1500) بدون تغییر برمی‌گرداند.
 * @param {string} dateStr - ISO (YYYY-MM-DD) یا شمسی (YYYY/MM/DD)
 * @returns {string} YYYY/MM/DD یا '' برای نامعتبر
 */
export function isoToJalaliStr(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return ''
  const s = dateStr.trim()
  if (!s) return ''
  if (s.indexOf('-') >= 0 && s.length >= 10) {
    try {
      const [y, m, d] = s.slice(0, 10).split('-').map(Number)
      const pd = new PersianDate(new Date(y, m - 1, d))
      const jy = pd.year()
      const jm = String(pd.month()).padStart(2, '0')
      const jd = String(pd.date()).padStart(2, '0')
      return `${jy}/${jm}/${jd}`
    } catch (e) {
      return ''
    }
  }
  const parts = s.split(/[/-]/)
  if (parts.length >= 3) {
    const y = parseInt(parts[0], 10)
    if (y >= 1300 && y <= 1500) {
      const normalized = `${parts[0]}/${String(parts[1]).padStart(2, '0')}/${String(parts[2]).padStart(2, '0')}`
      return normalized
    }
  }
  return ''
}

/**
 * تبدیل رشته شمسی YYYY/MM/DD به ISO YYYY-MM-DD برای API
 * @param {string} jalaliStr - رشته شمسی (YYYY/MM/DD یا YYYY-MM-DD)
 * @returns {string} ISO YYYY-MM-DD یا '' برای نامعتبر
 */
export function jalaliToIso(jalaliStr) {
  if (!jalaliStr || typeof jalaliStr !== 'string') return ''
  const parts = jalaliStr.trim().split(/[/-]/).map((p) => parseInt(p, 10))
  if (parts.length < 3 || parts[0] < 1300 || parts[0] > 1500) return ''
  try {
    const [y, m, day] = parts
    const pd = new PersianDate([y, m, day])
    const dateObj = pd.toDate()
    if (!dateObj || isNaN(dateObj.getTime())) return ''
    return dateObj.toISOString().split('T')[0]
  } catch (e) {
    return ''
  }
}
