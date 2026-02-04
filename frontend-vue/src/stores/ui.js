import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUIStore = defineStore('ui', () => {
  // State
  const sidebarCollapsed = ref(false)
  const theme = ref('light')
  const toasts = ref([])
  const modals = ref([])

  // Getters
  const activeToasts = computed(() => toasts.value.filter(toast => toast.visible))
  const activeModals = computed(() => modals.value.filter(modal => modal.visible))

  // Actions
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  const setTheme = (newTheme) => {
    theme.value = newTheme
    // Apply theme to document
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const showToast = (toast) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const newToast = {
      id,
      message: toast.message,
      type: toast.type || 'info',
      duration: toast.duration || 5000,
      visible: true,
      showProgress: toast.showProgress !== false
    }
    
    toasts.value.push(newToast)
    
    // Auto hide after duration (only if duration > 0)
    if (newToast.duration > 0) {
      setTimeout(() => {
        hideToast(id)
      }, newToast.duration)
    }
    
    return id
  }

  const hideToast = (id) => {
    const toastIndex = toasts.value.findIndex(toast => toast.id === id)
    if (toastIndex > -1) {
      toasts.value[toastIndex].visible = false
      // Remove after animation
      setTimeout(() => {
        toasts.value.splice(toastIndex, 1)
      }, 300)
    }
  }

  // Helper methods for different toast types
  const success = (message, duration = 5000) => {
    return showToast({ message, type: 'success', duration })
  }

  const error = (message, duration = 5000) => {
    return showToast({ message, type: 'error', duration })
  }

  const warning = (message, duration = 5000) => {
    return showToast({ message, type: 'warning', duration })
  }

  const info = (message, duration = 5000) => {
    return showToast({ message, type: 'info', duration })
  }

  const showModal = (modal) => {
    const id = Date.now().toString()
    const newModal = {
      id,
      component: modal.component,
      props: modal.props || {},
      visible: true
    }
    
    modals.value.push(newModal)
  }

  const hideModal = (id) => {
    const modalIndex = modals.value.findIndex(modal => modal.id === id)
    if (modalIndex > -1) {
      modals.value[modalIndex].visible = false
      // Remove after animation
      setTimeout(() => {
        modals.value.splice(modalIndex, 1)
      }, 300)
    }
  }

  return {
    // State
    sidebarCollapsed,
    theme,
    toasts,
    modals,
    // Getters
    activeToasts,
    activeModals,
    // Actions
    toggleSidebar,
    setTheme,
    showToast,
    hideToast,
    success,
    error,
    warning,
    info,
    showModal,
    hideModal
  }
})