import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { analyzeCarIssue } from '../services'
import { useVehicleStore } from './vehicle'
import { useServiceStore } from './service'
import { useExpenseStore } from './expense'

function generateId() {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

export const useAIStore = defineStore('ai', () => {
  const vehicleStore = useVehicleStore()
  const serviceStore = useServiceStore()
  const expenseStore = useExpenseStore()

  // State: لیست پیام‌های چت (user / model)
  const messages = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const currentConsultation = ref(null)

  // Getters
  const recentConsultations = computed(() =>
    messages.value
      .filter((m) => m.role === 'user')
      .slice(-10)
      .reverse()
  )

  /** ساخت userContext برای AI از خودروها و سوابق */
  function buildUserContext() {
    const vehicles = (vehicleStore.vehicles || []).map((v) => ({
      id: v.id,
      model: v.model,
      year: v.year,
      plateNumber: v.plateNumber,
      currentKm: v.currentKm ?? 0,
      note: v.note,
    }))
    const vehicleById = (id) => (vehicleStore.vehicles || []).find((v) => v.id === id)
    const recentServices = (serviceStore.recentServices || []).map((s) => ({
      date: s.date,
      km: s.km,
      cost: s.cost,
      type: s.type,
      types: s.types,
      note: s.note,
      vehicleModel: vehicleById(s.vehicleId)?.model || 'نامشخص',
    }))
    const recentExpenses = (expenseStore.recentExpenses || []).map((e) => ({
      date: e.date,
      amount: e.amount,
      category: e.category,
      km: e.km,
      note: e.note,
      vehicleModel: vehicleById(e.vehicleId)?.model || 'نامشخص',
    }))
    return { vehicles, recentServices, recentExpenses }
  }

  /** ارسال پیام کاربر و دریافت پاسخ از AI */
  const sendMessage = async (text) => {
    const trimmed = (text || '').trim()
    if (!trimmed) return

    error.value = null
    const userMsg = {
      id: generateId(),
      role: 'user',
      text: trimmed,
      timestamp: new Date().toISOString(),
    }
    messages.value.push(userMsg)

    isLoading.value = true
    try {
      const lastMessages = messages.value
        .slice(-20)
        .map((m) => ({ role: m.role, text: m.text }))
      const userContext = buildUserContext()

      const response = await analyzeCarIssue({
        prompt: trimmed,
        mode: 'fast',
        userContext: userContext.vehicles?.length ? userContext : undefined,
        conversationContext: {
          messages: lastMessages,
          maxHistoryMessages: 10,
        },
      })

      const modelMsg = {
        id: generateId(),
        role: 'model',
        text: response.text || '',
        timestamp: new Date().toISOString(),
        metadata: response.metadata,
      }
      messages.value.push(modelMsg)
      return modelMsg
    } catch (err) {
      error.value = err?.message || 'خطا در ارتباط با مشاور هوشمند'
      const errMsg = {
        id: generateId(),
        role: 'model',
        text: error.value,
        timestamp: new Date().toISOString(),
        isError: true,
      }
      messages.value.push(errMsg)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const startConsultation = async (problemDescription) => {
    return sendMessage(problemDescription)
  }

  const convertToService = async (recommendation) => {
    console.log('Convert AI recommendation to service action placeholder', recommendation)
  }

  const convertToReminder = async (recommendation) => {
    console.log('Convert AI recommendation to reminder action placeholder', recommendation)
  }

  const clearHistory = () => {
    messages.value = []
    error.value = null
  }

  return {
    messages,
    isLoading,
    error,
    currentConsultation,
    recentConsultations,
    sendMessage,
    startConsultation,
    convertToService,
    convertToReminder,
    clearHistory,
  }
})
