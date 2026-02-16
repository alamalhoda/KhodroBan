/**
 * AI Assistant service: backend-first API (Django ai_assistant).
 * Uses shared api (axios) with auth.
 */
import api from '@services/api'

const BASE = '/ai'

/**
 * @returns {Promise<{ id, title, created_at, updated_at }[]>}
 */
export async function listSessions() {
  const res = await api.get(`${BASE}/sessions/`)
  const data = res.data?.data
  return Array.isArray(data) ? data : []
}

/**
 * @param {{ title?: string }} payload
 * @returns {Promise<{ id, title, created_at, updated_at }>}
 */
export async function createSession(payload = {}) {
  const res = await api.post(`${BASE}/sessions/`, { title: payload.title || 'گفتگوی جدید' })
  return res.data?.data
}

/**
 * @param {string} sessionId
 * @returns {Promise<{ id, role, content, provider, model, created_at }[]>}
 */
export async function listMessages(sessionId) {
  const res = await api.get(`${BASE}/sessions/${sessionId}/messages/`)
  const data = res.data?.data
  return Array.isArray(data) ? data : []
}

/**
 * @param {string} sessionId
 * @param {string} content
 * @param {number|null|undefined} [vehicleId] - خودروی انتخاب‌شده برای قرار گرفتن در context
 * @returns {Promise<{ content, provider, model, usage, latency_ms }>}
 */
export async function sendMessage(sessionId, content, vehicleId) {
  const body = { content: content.trim() }
  if (vehicleId != null) body.vehicle_id = vehicleId
  const res = await api.post(`${BASE}/sessions/${sessionId}/messages/send/`, body)
  return res.data?.data
}

/**
 * @returns {Promise<{ allowed: string[], active: string }>}
 */
export async function getProviders() {
  const res = await api.get(`${BASE}/providers/`)
  return res.data?.data || { allowed: [], active: '' }
}

export const aiAssistantService = {
  listSessions,
  createSession,
  listMessages,
  sendMessage,
  getProviders,
}
