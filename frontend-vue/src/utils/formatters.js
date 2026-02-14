/**
 * توابع فرمت‌دهی برای اعداد، ارز و تاریخ
 * @module utils/formatters
 */

import { isoToJalaliStr } from './dateUtils'

/**
 * فرمت ارز با اعداد فارسی (fa-IR)
 * @param {number|string} amount - مبلغ
 * @returns {string} رشته فرمت‌شده (مثلاً "۱٬۲۳۴٬۵۶۷") یا "۰" برای null/undefined
 */
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '۰'
  return new Intl.NumberFormat('fa-IR').format(amount)
}

/**
 * فرمت عدد با اعداد فارسی (fa-IR)
 * @param {number|string} num - عدد
 * @returns {string} رشته فرمت‌شده یا "۰" برای null/undefined
 */
export const formatNumber = (num) => {
  if (!num && num !== 0) return '۰'
  return new Intl.NumberFormat('fa-IR').format(num)
}

/**
 * فرمت تاریخ به YYYY/MM/DD (میلادی)
 * @param {string} dateString - رشته تاریخ (ISO یا قابل parse توسط Date)
 * @returns {string} رشته به صورت سال/ماه/روز یا "-" برای خالی، یا همان ورودی برای تاریخ نامعتبر
 */
export const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString
  try {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}/${month}/${day}`
  } catch {
    return date.toISOString().split('T')[0]
  }
}

/**
 * فرمت تاریخ بر اساس زبان: فارسی → شمسی YYYY/MM/DD، غیرفارسی → میلادی YYYY/MM/DD
 * @param {string} dateString - رشته تاریخ (ISO یا شمسی)
 * @param {string} locale - کد زبان (fa, en, ar, ...)
 * @returns {string} رشته فرمت‌شده یا "-" برای خالی
 */
export const formatDateByLocale = (dateString, locale) => {
  if (!dateString) return '-'
  if (locale === 'fa') {
    const jalali = isoToJalaliStr(dateString)
    return jalali || '-'
  }
  return formatDate(dateString)
}

/**
 * زمان نسبی به فارسی (امروز، فردا، X روز دیگر، X هفته دیگر، X ماه دیگر، X روز گذشته)
 * @param {string} dateString - رشته تاریخ
 * @returns {string} متن زمان نسبی یا "" برای خالی
 */
export const getRelativeTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = date - now
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return `${Math.abs(diffDays)} روز گذشته`
  } else if (diffDays === 0) {
    return 'امروز'
  } else if (diffDays === 1) {
    return 'فردا'
  } else if (diffDays <= 7) {
    return `${diffDays} روز دیگر`
  } else if (diffDays <= 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks} هفته دیگر`
  } else {
    const months = Math.floor(diffDays / 30)
    return `${months} ماه دیگر`
  }
}
