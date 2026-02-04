import { setErrorHandlers } from '@services/api'
import { useUIStore } from '@/stores/ui'
import router from '@/router'

export function setupErrorHandlers() {
  setErrorHandlers({
    onAuthError: (error) => {
      console.error('Authentication error:', error)
      
      // Get UI store for toast notifications
      const uiStore = useUIStore()
      
      // Redirect to login
      router.push('/auth/login')
      
      // Show toast notification
      uiStore.showToast({
        message: 'لطفا مجدداً وارد شوید',
        type: 'warning'
      })
    },
    
    onNetworkError: (error) => {
      console.error('Network error:', error)
      
      const uiStore = useUIStore()
      uiStore.showToast({
        message: 'خطا در اتصال به سرور. لطفا اتصال اینترنت خود را بررسی کنید.',
        type: 'error'
      })
    },
    
    onValidationError: (error) => {
      console.error('Validation error:', error)
      
      const uiStore = useUIStore()
      uiStore.showToast({
        message: error.message || 'داده‌های ورودی نامعتبر است',
        type: 'error'
      })
    },
    
    onServerError: (error) => {
      console.error('Server error:', error)
      
      const uiStore = useUIStore()
      uiStore.showToast({
        message: 'خطای سرور. لطفا دوباره تلاش کنید.',
        type: 'error'
      })
    },
    
    onUnknownError: (error) => {
      console.error('Unknown error:', error)
      
      const uiStore = useUIStore()
      uiStore.showToast({
        message: 'خطای غیرمنتظره رخ داده است',
        type: 'error'
      })
    }
  })
}