<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import MainLayout from '../components/MainLayout.vue'
import Card from '../components/Card.vue'
import { Button, LoadingSpinner } from '../components/ui'
import { DashboardHeader, DashboardRightColumn, RemindersSection, VehiclesSection, QuickStatsCard } from '../components/dashboard'
import { useDashboardStore } from '../stores/dashboard'
import { useUIStore } from '../stores/ui'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const { t } = useI18n()
const dashboardStore = useDashboardStore()
const uiStore = useUIStore()
const authStore = useAuthStore()

// Computed
const summary = computed(() => dashboardStore.dashboardSummary)
const quickStats = computed(() => dashboardStore.quickStats)
const isLoading = computed(() => dashboardStore.isLoading)
const error = computed(() => dashboardStore.error)
const vehicles = computed(() => summary.value?.vehicles || [])
const reminders = computed(() => summary.value?.reminders || [])
const recentServices = computed(() => summary.value?.recentServices || [])
const upcomingReminders = computed(() => summary.value?.upcomingReminders || [])

// User name from auth store
const userName = computed(() => {
  const user = authStore.user
  if (user?.firstName) {
    return user.firstName
  }
  if (user?.name) {
    return user.name.split(' ')[0]
  }
  return 'کاربر'
})

// Actions
const handleRefresh = async () => {
  try {
    await dashboardStore.refreshDashboard()
    uiStore.success(t('dashboard.refresh'))
  } catch (err) {
    uiStore.error(err.message || t('dashboard.loadingError'))
  }
}

const handleAddService = () => {
  router.push({ name: 'add-service' })
}

const handleAddExpense = () => {
  router.push({ name: 'add-service', query: { tab: 'expense' } })
}

const handleAddVehicle = () => {
  router.push({ name: 'vehicle-management', query: { action: 'add' } })
}

const handleViewVehicle = (vehicleId) => {
  router.push({ name: 'vehicle-details', params: { id: vehicleId } })
}

const handleViewAllVehicles = () => {
  router.push({ name: 'vehicle-list' })
}

const handleViewAllReminders = () => {
  router.push({ name: 'reminders' })
}

const handleViewReports = () => {
  router.push({ name: 'reports' })
}

// Lifecycle
onMounted(async () => {
  try {
    await dashboardStore.fetchDashboardData()
  } catch (err) {
    uiStore.error(err.message || t('dashboard.loadingError'))
  }
})
</script>

<template>
  <MainLayout>
    <!-- Loading State -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <LoadingSpinner size="lg" :show-text="true" :text="t('common.loading')" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex flex-col items-center justify-center min-h-[400px] gap-4 p-6">
      <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 max-w-md w-full text-center">
        <span class="material-symbols-outlined text-red-500 text-5xl mb-4 block">error</span>
        <h3 class="text-lg font-bold text-red-700 dark:text-red-400 mb-2">{{ t('common.error') }}</h3>
        <p class="text-sm text-red-600 dark:text-red-300 mb-4">{{ error }}</p>
        <Button @click="handleRefresh" variant="primary" :aria-label="t('dashboard.refresh')">
          {{ t('dashboard.refresh') }}
        </Button>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="flex flex-col gap-8">
      <DashboardHeader
        :user-name="userName"
        :summary="summary"
        @add-service="handleAddService"
        @add-expense="handleAddExpense"
        @add-vehicle="handleAddVehicle"
      />

      <!-- Main Grid -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <!-- Left Column (2/3 width) -->
        <div class="xl:col-span-2 flex flex-col gap-6">
          <QuickStatsCard :next-service-due="quickStats?.nextServiceDue" />

          <RemindersSection
            :reminders="reminders"
            @view-all="handleViewAllReminders"
          />

          <VehiclesSection
            :vehicles="vehicles"
            :reminders="reminders"
            @view-vehicle="handleViewVehicle"
            @add-vehicle="handleAddVehicle"
            @view-all="handleViewAllVehicles"
          />
        </div>

        <DashboardRightColumn
          :quick-stats="quickStats"
          :recent-services="recentServices"
          @add-service="handleAddService"
          @add-expense="handleAddExpense"
          @view-reports="handleViewReports"
        />
      </div>

      <!-- Footer -->
      <div class="flex justify-center py-6 text-xs text-[#666e85] opacity-60">
        <p>© ۱۴۰۳ شرکت خودروبان. تمامی حقوق محفوظ است.</p>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
.glass-panel {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.dark .glass-panel {
  background: rgba(30, 41, 59, 0.7);
}
</style>
