/**
 * Unit tests for dateUtils (شمسی: getTodayJalaliStr, isoToJalaliStr)
 */
import { describe, it, expect } from 'vitest'
import { getTodayJalaliStr, isoToJalaliStr, jalaliToIso } from './dateUtils'

describe('dateUtils', () => {
  describe('getTodayJalaliStr', () => {
    it('returns string in YYYY/MM/DD format', () => {
      const result = getTodayJalaliStr()
      expect(typeof result).toBe('string')
      expect(result).toMatch(/^\d{4}\/\d{2}\/\d{2}$/)
    })

    it('returns Jalali year in 1300–1500 range', () => {
      const result = getTodayJalaliStr()
      const [y] = result.split('/').map(Number)
      expect(y).toBeGreaterThanOrEqual(1300)
      expect(y).toBeLessThanOrEqual(1500)
    })

    it('returns zero-padded month and day', () => {
      const result = getTodayJalaliStr()
      const parts = result.split('/')
      expect(parts[1].length).toBe(2)
      expect(parts[2].length).toBe(2)
    })
  })

  describe('isoToJalaliStr', () => {
    it('returns empty string for null or undefined', () => {
      expect(isoToJalaliStr(null)).toBe('')
      expect(isoToJalaliStr(undefined)).toBe('')
    })

    it('returns empty string for empty string', () => {
      expect(isoToJalaliStr('')).toBe('')
      expect(isoToJalaliStr('   ')).toBe('')
    })

    it('converts ISO date (YYYY-MM-DD) to Jalali YYYY/MM/DD', () => {
      // 2024-09-06 = 1403/06/16 شمسی (تقریبی)
      const result = isoToJalaliStr('2024-09-06')
      expect(result).toMatch(/^\d{4}\/\d{2}\/\d{2}$/)
      const [y] = result.split('/').map(Number)
      expect(y).toBeGreaterThanOrEqual(1300)
      expect(y).toBeLessThanOrEqual(1500)
    })

    it('normalizes already Jalali string (YYYY/MM/DD) with zero-pad', () => {
      const result = isoToJalaliStr('1403/7/15')
      expect(result).toBe('1403/07/15')
    })

    it('passes through valid Jalali YYYY/MM/DD unchanged format', () => {
      const result = isoToJalaliStr('1403/06/16')
      expect(result).toBe('1403/06/16')
    })

    it('returns empty string for non-parseable string (no valid ISO or Jalali)', () => {
      expect(isoToJalaliStr('invalid')).toBe('')
      expect(isoToJalaliStr('abc')).toBe('')
    })

    it('returns empty string for slash-separated string with Gregorian year (not 1300–1500)', () => {
      expect(isoToJalaliStr('2024/09/06')).toBe('')
    })

    it('accepts Jalali with slash only (contract: YYYY/MM/DD)', () => {
      expect(isoToJalaliStr('1403/06/16')).toBe('1403/06/16')
    })
  })

  describe('jalaliToIso', () => {
    it('returns empty string for null, undefined, empty', () => {
      expect(jalaliToIso(null)).toBe('')
      expect(jalaliToIso(undefined)).toBe('')
      expect(jalaliToIso('')).toBe('')
    })

    it('converts Jalali YYYY/MM/DD to ISO YYYY-MM-DD', () => {
      const result = jalaliToIso('1403/06/16')
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(new Date(result).getTime()).not.toBeNaN()
    })

    it('accepts Jalali with dashes', () => {
      const result = jalaliToIso('1403-07-15')
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })

    it('returns empty string for invalid or non-Jalali string', () => {
      expect(jalaliToIso('invalid')).toBe('')
      expect(jalaliToIso('2024-01-15')).toBe('')
    })
  })
})
