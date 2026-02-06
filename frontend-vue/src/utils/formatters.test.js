/**
 * Unit tests for formatters (formatCurrency, formatNumber, formatDate, getRelativeTime)
 */
import { describe, it, expect } from 'vitest'
import { formatCurrency, formatNumber, formatDate, getRelativeTime } from './formatters'

describe('formatters', () => {
  describe('formatCurrency', () => {
    it('formats positive numbers with Persian digits', () => {
      expect(formatCurrency(1234567)).toMatch(/[\d۰-۹٬]+/)
      expect(formatCurrency(1000)).toBe('۱٬۰۰۰')
    })

    it('returns Persian zero for zero', () => {
      expect(formatCurrency(0)).toBe('۰')
    })

    it('returns Persian zero for null and undefined', () => {
      expect(formatCurrency(null)).toBe('۰')
      expect(formatCurrency(undefined)).toBe('۰')
    })

    it('formats large numbers', () => {
      const result = formatCurrency(10000000)
      expect(result).toMatch(/[\d۰-۹٬]+/)
    })

    it('accepts string numbers', () => {
      expect(formatCurrency('1234')).toMatch(/[\d۰-۹٬]+/)
    })
  })

  describe('formatNumber', () => {
    it('formats positive numbers with Persian digits', () => {
      expect(formatNumber(1234)).toMatch(/[\d۰-۹٬]+/)
    })

    it('returns Persian zero for zero', () => {
      expect(formatNumber(0)).toBe('۰')
    })

    it('returns Persian zero for null and undefined', () => {
      expect(formatNumber(null)).toBe('۰')
      expect(formatNumber(undefined)).toBe('۰')
    })

    it('formats decimal numbers', () => {
      const result = formatNumber(1234.56)
      expect(result).toMatch(/[\d۰-۹٬\.]+/)
    })
  })

  describe('formatDate', () => {
    it('returns "-" for empty string', () => {
      expect(formatDate('')).toBe('-')
    })

    it('returns "-" for null and undefined', () => {
      expect(formatDate(null)).toBe('-')
      expect(formatDate(undefined)).toBe('-')
    })

    it('formats valid ISO date string to YYYY/MM/DD', () => {
      expect(formatDate('2024-03-15')).toBe('2024/03/15')
      expect(formatDate('2024-01-01T00:00:00.000Z')).toMatch(/^\d{4}\/\d{2}\/\d{2}$/)
    })

    it('returns original string for invalid date', () => {
      expect(formatDate('not-a-date')).toBe('not-a-date')
    })

    it('handles date with single-digit month and day', () => {
      const result = formatDate('2024-01-05')
      expect(result).toBe('2024/01/05')
    })
  })

  describe('getRelativeTime', () => {
    it('returns empty string for empty input', () => {
      expect(getRelativeTime('')).toBe('')
      expect(getRelativeTime(null)).toBe('')
      expect(getRelativeTime(undefined)).toBe('')
    })

    it('returns "امروز" for today', () => {
      const today = new Date()
      today.setHours(12, 0, 0, 0)
      expect(getRelativeTime(today.toISOString())).toBe('امروز')
    })

    it('returns "فردا" for tomorrow', () => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(12, 0, 0, 0)
      expect(getRelativeTime(tomorrow.toISOString())).toBe('فردا')
    })

    it('returns "X روز دیگر" for within 7 days', () => {
      const in3Days = new Date()
      in3Days.setDate(in3Days.getDate() + 3)
      in3Days.setHours(12, 0, 0, 0)
      expect(getRelativeTime(in3Days.toISOString())).toBe('3 روز دیگر')
    })

    it('returns "X هفته دیگر" for within 30 days', () => {
      const in14Days = new Date()
      in14Days.setDate(in14Days.getDate() + 14)
      in14Days.setHours(12, 0, 0, 0)
      const result = getRelativeTime(in14Days.toISOString())
      expect(result).toMatch(/هفته دیگر/)
    })

    it('returns "X ماه دیگر" for more than 30 days', () => {
      const in60Days = new Date()
      in60Days.setDate(in60Days.getDate() + 60)
      in60Days.setHours(12, 0, 0, 0)
      const result = getRelativeTime(in60Days.toISOString())
      expect(result).toMatch(/ماه دیگر/)
    })

    it('returns "X روز گذشته" for past dates', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      yesterday.setHours(12, 0, 0, 0)
      expect(getRelativeTime(yesterday.toISOString())).toBe('1 روز گذشته')
    })
  })
})
