import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { reportService } from '../services'

function dateRangeToStartEnd(dateRange) {
  const now = new Date()
  const today = now.toISOString().slice(0, 10)
  if (dateRange === 'last30days') {
    const d = new Date(now)
    d.setDate(d.getDate() - 30)
    return { startDate: d.toISOString().slice(0, 10), endDate: today }
  }
  if (dateRange === 'thisYear') {
    const y = now.getFullYear()
    return { startDate: `${y}-01-01`, endDate: today }
  }
  if (dateRange === 'lastYear') {
    const y = now.getFullYear() - 1
    return { startDate: `${y}-01-01`, endDate: `${y}-12-31` }
  }
  return { startDate: undefined, endDate: undefined }
}

export const useReportStore = defineStore('report', () => {
  const reportData = ref({})
  const filters = ref({
    dateRange: 'last30days',
    vehicleId: null,
    category: 'all'
  })
  const isLoading = ref(false)
  const error = ref(null)

  const filteredData = computed(() => reportData.value)

  const fetchReportData = async () => {
    isLoading.value = true
    error.value = null
    try {
      const { startDate, endDate } = dateRangeToStartEnd(filters.value.dateRange)
      const filter = {
        vehicleId: filters.value.vehicleId || undefined,
        startDate,
        endDate
      }
      const data = await reportService.getSummary(filter)
      reportData.value = data
      return data
    } catch (err) {
      error.value = err.message || 'خطا در بارگذاری گزارش'
      reportData.value = {}
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const exportReport = async (format) => {
    const { startDate, endDate } = dateRangeToStartEnd(filters.value.dateRange)
    const filter = {
      vehicleId: filters.value.vehicleId || undefined,
      startDate,
      endDate
    }
    if (format === 'csv') {
      const blob = await reportService.exportCSV(filter)
      reportService.downloadFile(blob, 'report.csv')
    }
  }

  return {
    reportData,
    filters,
    isLoading,
    error,
    filteredData,
    fetchReportData,
    updateFilters,
    exportReport
  }
})