import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { notificationService } from '../services'
import { useAuthStore } from './auth'

export const useNotificationStore = defineStore('notification', () => {
  // State
  const notifications = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const realtimeChannel = ref(null)

  // Getters
  const unreadNotifications = computed(() => 
    notifications.value.filter(n => !n.read)
  )
  
  const unreadCount = computed(() => unreadNotifications.value.length)
  
  const notificationsByType = computed(() => (type) => 
    notifications.value.filter(n => n.type === type)
  )
  
  const recentNotifications = computed(() => 
    notifications.value
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 10)
  )

  // Actions
  const fetchNotifications = async (onlyUnread = false) => {
    const authStore = useAuthStore()
    if (!authStore.user) {
      return []
    }

    isLoading.value = true
    error.value = null
    
    try {
      const data = await notificationService.getNotifications(
        authStore.user.id,
        onlyUnread
      )
      notifications.value = data
      return data
    } catch (err) {
      error.value = err.message || 'خطا در دریافت نوتیفیکیشن‌ها'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const getAllNotifications = async () => {
    const authStore = useAuthStore()
    if (!authStore.user) {
      return []
    }

    isLoading.value = true
    error.value = null
    
    try {
      const data = await notificationService.getAllNotifications(authStore.user.id)
      notifications.value = data
      return data
    } catch (err) {
      error.value = err.message || 'خطا در دریافت نوتیفیکیشن‌ها'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const markAsRead = async (notificationId) => {
    isLoading.value = true
    error.value = null
    
    try {
      await notificationService.markAsRead(notificationId)
      const index = notifications.value.findIndex(n => n.id === notificationId)
      if (index !== -1) {
        notifications.value[index].read = true
      }
    } catch (err) {
      error.value = err.message || 'خطا در علامت‌گذاری نوتیفیکیشن'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const markAllAsRead = async () => {
    const authStore = useAuthStore()
    if (!authStore.user) {
      return
    }

    isLoading.value = true
    error.value = null
    
    try {
      await notificationService.markAllAsRead(authStore.user.id)
      notifications.value.forEach(n => {
        n.read = true
      })
    } catch (err) {
      error.value = err.message || 'خطا در علامت‌گذاری همه نوتیفیکیشن‌ها'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteNotification = async (notificationId) => {
    isLoading.value = true
    error.value = null
    
    try {
      await notificationService.deleteNotification(notificationId)
      const index = notifications.value.findIndex(n => n.id === notificationId)
      if (index !== -1) {
        notifications.value.splice(index, 1)
      }
    } catch (err) {
      error.value = err.message || 'خطا در حذف نوتیفیکیشن'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const getUnreadCount = async () => {
    const authStore = useAuthStore()
    if (!authStore.user) {
      return 0
    }

    try {
      const count = await notificationService.getUnreadCount(authStore.user.id)
      return count
    } catch (err) {
      console.error('Error getting unread count:', err)
      return 0
    }
  }

  const subscribeToRealtime = (callback) => {
    const authStore = useAuthStore()
    if (!authStore.user) {
      return null
    }

    // Unsubscribe from previous channel if exists
    if (realtimeChannel.value) {
      unsubscribeFromRealtime()
    }

    const channel = notificationService.subscribeToNotifications(
      authStore.user.id,
      (newNotification) => {
        // Add new notification to the beginning of the list
        notifications.value.unshift(newNotification)
        // Call the callback if provided
        if (callback) {
          callback(newNotification)
        }
      }
    )

    realtimeChannel.value = channel
    return channel
  }

  const unsubscribeFromRealtime = () => {
    if (realtimeChannel.value) {
      // Note: Supabase channel cleanup is handled by the service
      realtimeChannel.value = null
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    notifications,
    isLoading,
    error,
    realtimeChannel,
    // Getters
    unreadNotifications,
    unreadCount,
    notificationsByType,
    recentNotifications,
    // Actions
    fetchNotifications,
    getAllNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getUnreadCount,
    subscribeToRealtime,
    unsubscribeFromRealtime,
    clearError
  }
})

