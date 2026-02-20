import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { aiAssistantService } from '../services/aiAssistantService'

function generateId() {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

export const useAIStore = defineStore('ai', () => {
  const sessions = ref([])
  const currentSessionId = ref(null)
  const messages = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  const currentSession = computed(() =>
    sessions.value.find((s) => String(s.id) === String(currentSessionId.value))
  )

  const recentConsultations = computed(() =>
    messages.value
      .filter((m) => m.role === 'user')
      .slice(-10)
      .reverse()
  )

  async function loadSessions() {
    try {
      const list = await aiAssistantService.listSessions()
      sessions.value = list
      if (list.length && !currentSessionId.value) {
        currentSessionId.value = list[0].id
      }
    } catch (err) {
      error.value = err?.response?.data?.errors?.[0] || err?.message || 'خطا در بارگذاری سشن‌ها'
      sessions.value = []
    }
  }

  async function loadMessages(sessionId) {
    const id = sessionId ?? currentSessionId.value
    if (!id) {
      messages.value = []
      return
    }
    try {
      const list = await aiAssistantService.listMessages(id)
      messages.value = list.map((m) => ({
        id: m.id,
        role: m.role === 'assistant' ? 'model' : m.role,
        text: m.content,
        timestamp: m.created_at,
        metadata: m.provider ? { provider: m.provider, model: m.model } : undefined,
      }))
    } catch (err) {
      error.value = err?.response?.data?.errors?.[0] || err?.message || 'خطا در بارگذاری پیام‌ها'
      messages.value = []
    }
  }

  async function ensureSession() {
    if (sessions.value.length > 0) return
    try {
      const session = await aiAssistantService.createSession({ title: 'گفتگوی جدید' })
      sessions.value = [session]
      currentSessionId.value = session.id
    } catch (err) {
      error.value = err?.response?.data?.errors?.[0] || err?.message || 'خطا در ایجاد سشن'
    }
  }

  async function sendMessage(text, selectedVehicleId = null) {
    const trimmed = (text || '').trim()
    if (!trimmed) return

    await ensureSession()
    const sessionId = currentSessionId.value
    if (!sessionId) {
      error.value = 'سشنی انتخاب نشده است.'
      return
    }

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
      const data = await aiAssistantService.sendMessage(sessionId, trimmed, selectedVehicleId)
      const modelMsg = {
        id: generateId(),
        role: 'model',
        text: data.content || '',
        timestamp: new Date().toISOString(),
        metadata: data.provider ? { provider: data.provider, model: data.model, usage: data.usage } : undefined,
      }
      messages.value.push(modelMsg)
      return modelMsg
    } catch (err) {
      const errMsg =
        err?.response?.data?.errors?.[0] ||
        err?.message ||
        'خطا در ارتباط با مشاور هوشمند'
      error.value = errMsg
      const errEntry = {
        id: generateId(),
        role: 'model',
        text: errMsg,
        timestamp: new Date().toISOString(),
        isError: true,
      }
      messages.value.push(errEntry)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function setCurrentSession(sessionId) {
    currentSessionId.value = sessionId
    await loadMessages(sessionId)
  }

  async function startNewSession() {
    try {
      const session = await aiAssistantService.createSession({ title: 'گفتگوی جدید' })
      sessions.value = [session, ...sessions.value]
      currentSessionId.value = session.id
      messages.value = []
      error.value = null
    } catch (err) {
      error.value = err?.response?.data?.errors?.[0] || err?.message || 'خطا در ایجاد سشن جدید'
    }
  }

  function clearHistory() {
    messages.value = []
    error.value = null
  }

  async function initialize() {
    error.value = null
    await loadSessions()
    await ensureSession()
    await loadMessages()
  }

  return {
    sessions,
    currentSessionId,
    currentSession,
    messages,
    isLoading,
    error,
    recentConsultations,
    loadSessions,
    loadMessages,
    ensureSession,
    sendMessage,
    setCurrentSession,
    startNewSession,
    clearHistory,
    initialize,
    startConsultation: sendMessage,
    convertToService: async (recommendation) => {
      console.log('Convert AI recommendation to service action placeholder', recommendation)
    },
    convertToReminder: async (recommendation) => {
      console.log('Convert AI recommendation to reminder action placeholder', recommendation)
    },
  }
})
