/**
 * محاسبه تعداد روز باقی‌مانده تا موعد یادآور (بر اساس تاریخ موعد).
 * برای استفاده در RemindersView و تست واحد.
 * هر دو تاریخ به صورت نیمه‌شب محلی مقایسه می‌شوند تا در هر timezone نتیجه یکسان باشد.
 *
 * @param {string|null|undefined} dueDateStr - تاریخ موعد (ISO YYYY-MM-DD)
 * @returns {number|null} تعداد روز (مثبت = در آینده، صفر = امروز، منفی = گذشته) یا null
 */
export function getDaysRemaining(dueDateStr) {
  if (!dueDateStr) return null
  const parts = String(dueDateStr).trim().split('-')
  if (parts.length < 3) return null
  const y = parseInt(parts[0], 10)
  const m = parseInt(parts[1], 10) - 1
  const d = parseInt(parts[2], 10)
  const dueDate = new Date(y, m, d)
  if (isNaN(dueDate.getTime()) || dueDate.getFullYear() !== y || dueDate.getMonth() !== m || dueDate.getDate() !== d) return null
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const diff = Math.ceil((dueDate.getTime() - todayStart.getTime()) / (1000 * 60 * 60 * 24))
  return diff
}
