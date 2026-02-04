import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import SelectServiceTypeView from '../views/SelectServiceTypeView.vue'
import DashboardVariant3View from '../views/DashboardVariant3View.vue'
import VehicleManagementView from '../views/VehicleManagementView.vue'
import SelectServiceTypeVariant5View from '../views/SelectServiceTypeVariant5View.vue'
import RemindersView from '../views/RemindersView.vue'
import SelectServiceDetailsView from '../views/SelectServiceDetailsView.vue'
import SettingsView from '../views/SettingsView.vue'
import AddServiceView from '../views/AddServiceView.vue'
import VehicleListView from '../views/VehicleListView.vue'
import ReportsView from '../views/ReportsView.vue'
import SignUpView from '../views/SignUpView.vue'
import UpgradeProView from '../views/UpgradeProView.vue'
import SelectServiceDetailsVariant15View from '../views/SelectServiceDetailsVariant15View.vue'
import DashboardVariant16View from '../views/DashboardVariant16View.vue'
import VehicleDetailsView from '../views/VehicleDetailsView.vue'
import SmartAssistantView from '../views/SmartAssistantView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/select-service',
      name: 'select-service',
      component: SelectServiceTypeView
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
      component: RemindersView
    },
    {
      path: '/select-service-details',
      name: 'select-service-details',
      component: SelectServiceDetailsView
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView
    },
    {
      path: '/add-service',
      name: 'add-service',
      component: AddServiceView
    },
    {
      path: '/vehicle-list',
      name: 'vehicle-list',
      component: VehicleListView
    },
    {
      path: '/reports',
      name: 'reports',
      component: ReportsView
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUpView
    },
    {
      path: '/upgrade-pro',
      name: 'upgrade-pro',
      component: UpgradeProView
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
      path: '/vehicle-details',
      name: 'vehicle-details',
      component: VehicleDetailsView
    },
    {
      path: '/smart-assistant',
      name: 'smart-assistant',
      component: SmartAssistantView
    }
  ]
})

export default router
