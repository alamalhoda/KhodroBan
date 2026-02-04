import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { dashboardService } from '../services/dashboardService'
import { useVehicleStore } from './vehicle'
import { useServiceStore } from './service'
import { useReminderStore } from './reminder'
import { useExpenseStore } from './expense'

export const useDashboardStore = defineStore('dashboard', () => {
  // State
  const isLoading = ref(false)
  const error = ref(null)
  const lastUpdated = ref(null)
  const summary = ref(null)

  // Get other stores
  const vehicleStore = useVehicleStore()
  const serviceStore = useServiceStore()
  const reminderStore = useReminderStore()
  const expenseStore = useExpenseStore()

  // Getters
  const dashboardSummary = computed(() => {
    // اگر summary از API داریم، از آن استفاده می‌کنیم
    if (summary.value) {
      return summary.value
    }
    
    // در غیر این صورت از stores محلی استفاده می‌کنیم (fallback)
    return {
      totalVehicles: vehicleStore.vehicleCount,
      totalExpenses: expenseStore.totalExpenses,
      activeReminders: reminderStore.activeReminders?.length || 0,
      overdueReminders: reminderStore.overdueReminders?.length || 0,
      recentServices: serviceStore.recentServices || [],
      upcomingReminders: (reminderStore.upcomingReminders || []).slice(0, 3),
      vehicles: vehicleStore.vehicles || [],
      reminders: reminderStore.activeReminders || [],
    }
  })

  const quickStats = computed(() => {
    if (summary.value) {
      return {
        thisMonthExpenses: summary.value.thisMonthExpenses || 0,
        servicesThisMonth: summary.value.servicesThisMonth || 0,
        avgMonthlyExpense: summary.value.avgMonthlyExpense || 0,
        nextServiceDue: summary.value.nextServiceDue || null
      }
    }
    return {
      thisMonthExpenses: 0,
      servicesThisMonth: 0,
      avgMonthlyExpense: 0,
      nextServiceDue: null
    }
  })

  // Actions
  const fetchDashboardData = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const data = await dashboardService.getSummary()
      summary.value = data
      lastUpdated.value = new Date().toISOString()
      
      // همچنین stores محلی را هم به‌روزرسانی کنیم
      if (data.vehicles) {
        vehicleStore.vehicles = data.vehicles
      }
      
      return data
    } catch (err) {
      error.value = err.message || 'خطا در بارگذاری داده‌های dashboard'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const refreshDashboard = async () => {
    return fetchDashboardData()
  }

  return {
    // State
    isLoading,
    error,
    lastUpdated,
    summary,
    // Getters
    dashboardSummary,
    quickStats,
    // Actions
    refreshDashboard,
    fetchDashboardData
  }
})
