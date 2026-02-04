<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useNotificationStore } from '../stores/notification'
import { useUIStore } from '../stores/ui'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const notificationStore = useNotificationStore()
const uiStore = useUIStore()

const isOpen = ref(false)
const dropdownRef = ref(null)

// Computed
const unreadCount = computed(() => notificationStore.unreadCount)
const recentNotifications = computed(() => notificationStore.recentNotifications)

// Methods
const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value && unreadCount.value > 0) {
    // Load all notifications when opening
    notificationStore.getAllNotifications()
  }
}

const handleMarkAsRead = async (notificationId) => {
  try {
    await notificationStore.markAsRead(notificationId)
    uiStore.success(t('notifications.markedAsRead'))
  } catch (err) {
    uiStore.error(err.message || t('notifications.markError'))
  }
}

const handleMarkAllAsRead = async () => {
  try {
    await notificationStore.markAllAsRead()
    uiStore.success(t('notifications.allMarkedAsRead'))
  } catch (err) {
    uiStore.error(err.message || t('notifications.markError'))
  }
}

const handleDelete = async (notificationId) => {
  try {
    await notificationStore.deleteNotification(notificationId)
    uiStore.success(t('notifications.deleted'))
  } catch (err) {
    uiStore.error(err.message || t('notifications.deleteError'))
  }
}

const handleNotificationClick = (notification) => {
  // Mark as read when clicked
  if (!notification.read) {
    handleMarkAsRead(notification.id)
  }
  
  // Navigate to relevant page if needed
  if (notification.vehicle_id) {
    // Could navigate to vehicle details
    // router.push({ name: 'vehicle-details', params: { id: notification.vehicle_id } })
  }
}

const getNotificationIcon = (type) => {
  switch (type) {
    case 'reminder':
      return 'notifications'
    case 'warning':
      return 'warning'
    case 'info':
      return 'info'
    case 'subscription':
      return 'diamond'
    default:
      return 'notifications'
  }
}

const getNotificationColor = (type) => {
  switch (type) {
    case 'reminder':
      return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
    case 'warning':
      return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
    case 'info':
      return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
    case 'subscription':
      return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
    default:
      return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20'
  }
}

const formatTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return t('notifications.justNow')
  if (minutes < 60) return t('notifications.minutesAgo', { count: minutes })
  if (hours < 24) return t('notifications.hoursAgo', { count: hours })
  if (days < 7) return t('notifications.daysAgo', { count: days })
  return date.toLocaleDateString('fa-IR')
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

// Lifecycle
onMounted(async () => {
  try {
    await notificationStore.fetchNotifications(true) // Only unread
    await notificationStore.getUnreadCount()
    
    // Subscribe to realtime notifications
    notificationStore.subscribeToRealtime((newNotification) => {
      // Show toast for new notifications
      uiStore.info(newNotification.title, newNotification.body)
    })
  } catch (err) {
    console.error('Error loading notifications:', err)
  }

  // Add click outside listener
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  notificationStore.unsubscribeFromRealtime()
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="relative" ref="dropdownRef">
    <!-- Bell Icon Button -->
    <button
      @click="toggleDropdown"
      class="relative p-2 rounded-lg hover:bg-white/50 dark:hover:bg-white/5 transition-colors"
      :aria-label="t('notifications.title')"
      :aria-expanded="isOpen"
    >
      <span class="material-symbols-outlined text-gray-600 dark:text-gray-300 text-2xl">
        notifications
      </span>
      <!-- Badge -->
      <span
        v-if="unreadCount > 0"
        class="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-[#121620]"
      >
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
    </button>

    <!-- Dropdown -->
    <div
      v-if="isOpen"
      class="absolute left-0 top-full mt-2 w-80 md:w-96 bg-white dark:bg-[#1e293b] rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-[600px] flex flex-col"
    >
      <!-- Header -->
      <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h3 class="font-bold text-lg text-[#121317] dark:text-white">
          {{ t('notifications.title') }}
        </h3>
        <div class="flex items-center gap-2">
          <button
            v-if="unreadCount > 0"
            @click="handleMarkAllAsRead"
            class="text-xs text-primary hover:text-primary-light font-medium"
          >
            {{ t('notifications.markAllAsRead') }}
          </button>
          <button
            @click="isOpen = false"
            class="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            :aria-label="t('common.close')"
          >
            <span class="material-symbols-outlined text-gray-500 text-lg">close</span>
          </button>
        </div>
      </div>

      <!-- Notifications List -->
      <div class="flex-1 overflow-y-auto">
        <div v-if="notificationStore.isLoading" class="p-8 text-center">
          <span class="material-symbols-outlined animate-spin text-primary text-3xl">refresh</span>
          <p class="text-sm text-gray-500 mt-2">{{ t('common.loading') }}</p>
        </div>

        <div
          v-else-if="recentNotifications.length === 0"
          class="p-8 text-center"
        >
          <span class="material-symbols-outlined text-gray-400 text-4xl mb-2">notifications_off</span>
          <p class="text-sm text-gray-500">{{ t('notifications.empty') }}</p>
        </div>

        <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
          <button
            v-for="notification in recentNotifications"
            :key="notification.id"
            @click="handleNotificationClick(notification)"
            class="w-full p-4 text-right hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            :class="{ 'bg-blue-50 dark:bg-blue-900/10': !notification.read }"
          >
            <div class="flex items-start gap-3">
              <!-- Icon -->
              <div
                class="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                :class="getNotificationColor(notification.type)"
              >
                <span class="material-symbols-outlined text-lg">
                  {{ getNotificationIcon(notification.type) }}
                </span>
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2 mb-1">
                  <h4
                    class="font-bold text-sm text-[#121317] dark:text-white"
                    :class="{ 'font-semibold': !notification.read }"
                  >
                    {{ notification.title }}
                  </h4>
                  <span
                    v-if="!notification.read"
                    class="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-1"
                  ></span>
                </div>
                <p class="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                  {{ notification.body }}
                </p>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-500">
                    {{ formatTime(notification.created_at) }}
                  </span>
                  <div class="flex items-center gap-2">
                    <button
                      v-if="!notification.read"
                      @click.stop="handleMarkAsRead(notification.id)"
                      class="text-xs text-primary hover:text-primary-light"
                      :aria-label="t('notifications.markAsRead')"
                    >
                      {{ t('notifications.markAsRead') }}
                    </button>
                    <button
                      @click.stop="handleDelete(notification.id)"
                      class="text-xs text-red-500 hover:text-red-600"
                      :aria-label="t('common.delete')"
                    >
                      <span class="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div
        v-if="recentNotifications.length > 0"
        class="p-3 border-t border-gray-200 dark:border-gray-700 text-center"
      >
        <button
          class="text-xs text-primary hover:text-primary-light font-medium"
          @click="$router.push({ name: 'reminders' })"
        >
          {{ t('notifications.viewAll') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

