import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { reminderService } from '../services'

export const useReminderStore = defineStore('reminder', () => {
  // State
  const reminders = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const activeReminders = computed(() => 
    reminders.value.filter(r => r.status !== 'ok' && !r.dismissed)
  )
  
  const overdueReminders = computed(() => 
    reminders.value.filter(r => 
      r.status === 'overdue' && !r.dismissed
    )
  )
  
  const nearReminders = computed(() => 
    reminders.value.filter(r => 
      r.status === 'near' && !r.dismissed
    )
  )
  
  const upcomingReminders = computed(() => 
    reminders.value.filter(r => 
      (r.status === 'near' || r.status === 'ok') && !r.dismissed
    ).sort((a, b) => {
      // Sort by dueKm if available, otherwise by dueDate
      if (a.dueKm && b.dueKm) {
        return a.dueKm - b.dueKm
      }
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate)
      }
      return 0
    })
  )
  
  const remindersByVehicle = computed(() => (vehicleId) => 
    reminders.value.filter(r => 
      String(r.vehicleId) === String(vehicleId) && !r.dismissed
    )
  )

  // Actions
  const fetchReminders = async (vehicleId = null) => {
    isLoading.value = true
    error.value = null
    
    try {
      let data
      if (vehicleId) {
        data = await reminderService.getByVehicle(vehicleId)
      } else {
        data = await reminderService.getAll()
      }
      reminders.value = data
      return data
    } catch (err) {
      error.value = err.message || 'خطا در دریافت لیست یادآورها'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const getReminderById = async (id) => {
    isLoading.value = true
    error.value = null
    
    try {
      const reminder = await reminderService.getById(id)
      // Update in list if exists
      const index = reminders.value.findIndex(r => r.id === id)
      if (index !== -1) {
        reminders.value[index] = reminder
      }
      return reminder
    } catch (err) {
      error.value = err.message || 'خطا در دریافت اطلاعات یادآور'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const createReminder = async (data) => {
    isLoading.value = true
    error.value = null
    
    try {
      const newReminder = await reminderService.create(data)
      reminders.value.unshift(newReminder)
      return newReminder
    } catch (err) {
      error.value = err.message || 'خطا در افزودن یادآور'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateReminder = async (id, data) => {
    isLoading.value = true
    error.value = null
    
    try {
      const updatedReminder = await reminderService.update(id, data)
      const index = reminders.value.findIndex(r => r.id === id)
      if (index !== -1) {
        reminders.value[index] = updatedReminder
      }
      return updatedReminder
    } catch (err) {
      error.value = err.message || 'خطا در به‌روزرسانی یادآور'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteReminder = async (id) => {
    isLoading.value = true
    error.value = null
    
    try {
      await reminderService.delete(id)
      const index = reminders.value.findIndex(r => r.id === id)
      if (index !== -1) {
        reminders.value.splice(index, 1)
      }
    } catch (err) {
      error.value = err.message || 'خطا در حذف یادآور'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const markCompleted = async (id) => {
    isLoading.value = true
    error.value = null
    
    try {
      await reminderService.dismiss(id)
      const index = reminders.value.findIndex(r => r.id === id)
      if (index !== -1) {
        reminders.value[index].dismissed = true
      }
    } catch (err) {
      error.value = err.message || 'خطا در علامت‌گذاری یادآور'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const refreshReminders = async () => {
    return await fetchReminders()
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    reminders,
    isLoading,
    error,
    // Getters
    activeReminders,
    overdueReminders,
    nearReminders,
    upcomingReminders,
    remindersByVehicle,
    // Actions
    fetchReminders,
    getReminderById,
    createReminder,
    updateReminder,
    deleteReminder,
    markCompleted,
    refreshReminders,
    clearError
  }
})