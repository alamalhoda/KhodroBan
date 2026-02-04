import { useUIStore } from '@/stores/ui'

/**
 * Composable for easy toast notifications
 * 
 * @example
 * const toast = useToast()
 * toast.success('Operation successful!')
 * toast.error('Something went wrong')
 * toast.warning('Please check your input')
 * toast.info('New update available')
 */
export function useToast() {
  const uiStore = useUIStore()

  return {
    /**
     * Show a success toast
     * @param {string} message - The message to display
     * @param {number} duration - Duration in milliseconds (default: 5000)
     * @returns {string} Toast ID
     */
    success: (message, duration = 5000) => {
      return uiStore.success(message, duration)
    },

    /**
     * Show an error toast
     * @param {string} message - The message to display
     * @param {number} duration - Duration in milliseconds (default: 5000)
     * @returns {string} Toast ID
     */
    error: (message, duration = 5000) => {
      return uiStore.error(message, duration)
    },

    /**
     * Show a warning toast
     * @param {string} message - The message to display
     * @param {number} duration - Duration in milliseconds (default: 5000)
     * @returns {string} Toast ID
     */
    warning: (message, duration = 5000) => {
      return uiStore.warning(message, duration)
    },

    /**
     * Show an info toast
     * @param {string} message - The message to display
     * @param {number} duration - Duration in milliseconds (default: 5000)
     * @returns {string} Toast ID
     */
    info: (message, duration = 5000) => {
      return uiStore.info(message, duration)
    },

    /**
     * Show a custom toast
     * @param {Object} toast - Toast configuration
     * @param {string} toast.message - The message to display
     * @param {string} toast.type - Toast type: 'success' | 'error' | 'warning' | 'info'
     * @param {number} toast.duration - Duration in milliseconds (default: 5000)
     * @param {boolean} toast.showProgress - Show progress bar (default: true)
     * @returns {string} Toast ID
     */
    show: (toast) => {
      return uiStore.showToast(toast)
    },

    /**
     * Hide a toast by ID
     * @param {string} id - Toast ID
     */
    hide: (id) => {
      uiStore.hideToast(id)
    }
  }
}

