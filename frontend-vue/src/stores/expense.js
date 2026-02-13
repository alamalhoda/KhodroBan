import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { expenseService } from '../services'

export const useExpenseStore = defineStore('expense', () => {
  // State
  const expenses = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const expensesByVehicle = computed(() => (vehicleId) =>
    expenses.value.filter(e => String(e.vehicleId) === String(vehicleId))
  )
  const totalExpenses = computed(() =>
    expenses.value.reduce((total, expense) => total + (expense.amount || 0), 0)
  )
  const recentExpenses = computed(() =>
    expenses.value
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10)
  )

  // Actions
  const fetchExpenses = async (vehicleId = null) => {
    isLoading.value = true
    error.value = null
    try {
      const data = await expenseService.getAll(vehicleId ?? undefined)
      expenses.value = data ?? []
      return expenses.value
    } catch (err) {
      error.value = err.message || 'خطا در دریافت لیست هزینه‌ها'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const createExpense = async (data) => {
    // Implementation will be added in later tasks
    console.log('Create expense action placeholder', data)
  }

  const updateExpense = async (id, data) => {
    // Implementation will be added in later tasks
    console.log('Update expense action placeholder', id, data)
  }

  const deleteExpense = async (id) => {
    // Implementation will be added in later tasks
    console.log('Delete expense action placeholder', id)
  }

  return {
    // State
    expenses,
    isLoading,
    error,
    // Getters
    expensesByVehicle,
    totalExpenses,
    recentExpenses,
    // Actions
    fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense
  }
})