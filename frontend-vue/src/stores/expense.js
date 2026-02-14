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
    isLoading.value = true
    error.value = null
    try {
      const newExpense = await expenseService.create(data)
      expenses.value.unshift(newExpense)
      return newExpense
    } catch (err) {
      error.value = err.message || 'خطا در ثبت هزینه'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateExpense = async (id, data) => {
    isLoading.value = true
    error.value = null
    try {
      const updatedExpense = await expenseService.update(id, data)
      const index = expenses.value.findIndex(e => String(e.id) === String(id))
      if (index !== -1) {
        expenses.value[index] = updatedExpense
      }
      return updatedExpense
    } catch (err) {
      error.value = err.message || 'خطا در به‌روزرسانی هزینه'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteExpense = async (id) => {
    isLoading.value = true
    error.value = null
    try {
      await expenseService.delete(id)
      const index = expenses.value.findIndex(e => String(e.id) === String(id))
      if (index !== -1) {
        expenses.value.splice(index, 1)
      }
    } catch (err) {
      error.value = err.message || 'خطا در حذف هزینه'
      throw err
    } finally {
      isLoading.value = false
    }
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