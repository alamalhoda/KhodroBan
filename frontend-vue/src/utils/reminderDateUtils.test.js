/**
 * Unit tests for reminder due-date calculation (مدت زمان باقی‌مانده تا موعد یادآور)
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getDaysRemaining } from './reminderDateUtils'

describe('reminderDateUtils.getDaysRemaining', () => {
  const today = new Date()
  const toYMD = (d) => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  it('returns null when dueDate is null or undefined', () => {
    expect(getDaysRemaining(null)).toBe(null)
    expect(getDaysRemaining(undefined)).toBe(null)
  })

  it('returns null when dueDate is empty string', () => {
    expect(getDaysRemaining('')).toBe(null)
  })

  it('returns null when dueDate is invalid', () => {
    expect(getDaysRemaining('invalid')).toBe(null)
    expect(getDaysRemaining('2025-13-45')).toBe(null)
  })

  it('returns 0 when due date is today', () => {
    const todayStr = toYMD(today)
    expect(getDaysRemaining(todayStr)).toBe(0)
  })

  it('returns 1 when due date is tomorrow', () => {
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    expect(getDaysRemaining(toYMD(tomorrow))).toBe(1)
  })

  it('returns positive days when due date is in the future', () => {
    const in7 = new Date(today)
    in7.setDate(in7.getDate() + 7)
    expect(getDaysRemaining(toYMD(in7))).toBe(7)

    const in30 = new Date(today)
    in30.setDate(in30.getDate() + 30)
    expect(getDaysRemaining(toYMD(in30))).toBe(30)
  })

  it('returns negative days when due date is in the past', () => {
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    expect(getDaysRemaining(toYMD(yesterday))).toBe(-1)

    const past7 = new Date(today)
    past7.setDate(past7.getDate() - 7)
    expect(getDaysRemaining(toYMD(past7))).toBe(-7)
  })

  it('uses date-only comparison (ignores time)', () => {
    const tomorrowLate = new Date(today)
    tomorrowLate.setDate(tomorrowLate.getDate() + 1)
    tomorrowLate.setHours(23, 59, 59, 999)
    expect(getDaysRemaining(tomorrowLate.toISOString().split('T')[0])).toBe(1)
  })
})
