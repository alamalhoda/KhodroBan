import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Lazy load components for better performance
// Critical routes (loaded immediately)
const LoginView = () => import('../views/LoginView.vue')
const AuthCallbackView = () => import('../views/AuthCallbackView.vue')
const SignUpView = () => import('../views/SignUpView.vue')

// Main app routes (lazy loaded)
const DashboardView = () => import('../views/DashboardView.vue')
const VehicleListView = () => import('../views/VehicleListView.vue')
const VehicleDetailsView = () => import('../views/VehicleDetailsView.vue')
const VehicleManagementView = () => import('../views/VehicleManagementView.vue')
const RemindersView = () => import('../views/RemindersView.vue')
const ReminderManagementView = () => import('../views/ReminderManagementView.vue')
const ReportsView = () => import('../views/ReportsView.vue')
const SettingsView = () => import('../views/SettingsView.vue')
const AddServiceView = () => import('../views/AddServiceView.vue')
const SelectServiceTypeView = () => import('../views/SelectServiceTypeView.vue')
const ServiceListView = () => import('../views/ServiceListView.vue')
const SmartAssistantView = () => import('../views/SmartAssistantView.vue')
const UpgradeProView = () => import('../views/UpgradeProView.vue')

// Variant views (lazy loaded, lower priority)
const DashboardVariant3View = () => import('../views/DashboardVariant3View.vue')
const DashboardVariant16View = () => import('../views/DashboardVariant16View.vue')
const SelectServiceTypeVariant5View = () => import('../views/SelectServiceTypeVariant5View.vue')
const SelectServiceDetailsVariant15View = () => import('../views/SelectServiceDetailsVariant15View.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresGuest: true }
    },
    {
      path: '/auth/callback',
      name: 'auth-callback',
      component: AuthCallbackView
    },
    {
      path: '/select-service',
      name: 'select-service',
      component: SelectServiceTypeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/dashboard-variant-3',
      name: 'dashboard-variant-3',
      component: DashboardVariant3View
    },
    {
      path: '/vehicle-management',
      name: 'vehicle-management',
      component: VehicleManagementView
    },
    {
      path: '/select-service-variant-5',
      name: 'select-service-variant-5',
      component: SelectServiceTypeVariant5View
    },
    {
      path: '/reminders',
      name: 'reminders',
      component: RemindersView,
      meta: { requiresAuth: true }
    },
    {
      path: '/reminder-management',
      name: 'reminder-management',
      component: ReminderManagementView,
      meta: { requiresAuth: true }
    },
    {
      path: '/service-list',
      name: 'service-list',
      component: ServiceListView,
      meta: { requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/add-service',
      name: 'add-service',
      component: AddServiceView,
      meta: { requiresAuth: true }
    },
    {
      path: '/vehicle-list',
      name: 'vehicle-list',
      component: VehicleListView,
      meta: { requiresAuth: true }
    },
    {
      path: '/reports',
      name: 'reports',
      component: ReportsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUpView,
      meta: { requiresGuest: true }
    },
    {
      path: '/upgrade-pro',
      name: 'upgrade-pro',
      component: UpgradeProView,
      meta: { requiresAuth: true }
    },
    {
      path: '/select-service-details-variant-15',
      name: 'select-service-details-variant-15',
      component: SelectServiceDetailsVariant15View
    },
    {
      path: '/dashboard-variant-16',
      name: 'dashboard-variant-16',
      component: DashboardVariant16View
    },
    {
      path: '/vehicle-details/:id',
      name: 'vehicle-details',
      component: VehicleDetailsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/smart-assistant',
      name: 'smart-assistant',
      component: SmartAssistantView,
      meta: { requiresAuth: true }
    }
  ]
})

// Navigation Guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Initialize auth store on first navigation
  // Check if we have a token but no user (e.g., after page refresh)
  if (!authStore.user && (authStore.token || localStorage.getItem('token'))) {
    try {
      // Use a longer timeout and let initialize handle its own race conditions
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Router guard timeout')), 12000) // Increased to 12 seconds
      )
      
      await Promise.race([
        authStore.initialize(),
        timeoutPromise
      ])
      
      // After initialization, check if user was successfully loaded
      // If not, it might be a network issue - don't clear token immediately
      // The initialize function will handle token clearing for auth errors
    } catch (err) {
      // If initialization fails or times out, check if it's a real auth error
      console.debug('Auth initialization failed or timeout in router guard:', err.message || err)
      
      // Only clear token if it's an authentication error, not just a timeout
      const isAuthError = err.message?.includes('کاربر لاگین نشده') || 
                          err.message?.includes('Invalid') ||
                          err.message?.includes('JWT') ||
                          err.message?.includes('Unauthorized');
      
      if (isAuthError) {
        authStore.saveToken(null)
      }
      // Continue navigation - user will be redirected to login if route requires auth
    }
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }

  // Check if route requires guest (redirect to dashboard if already logged in)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: 'dashboard' })
    return
  }

  next()
})

export default router
