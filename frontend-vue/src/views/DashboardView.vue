<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import MainLayout from '../components/MainLayout.vue'
import Card from '../components/Card.vue'
import { Button, LoadingSpinner } from '../components/ui'
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

// Format helpers
const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '۰'
  return new Intl.NumberFormat('fa-IR').format(amount)
}

const formatNumber = (num) => {
  if (!num && num !== 0) return '۰'
  return new Intl.NumberFormat('fa-IR').format(num)
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString
  try {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}/${month}/${day}`
  } catch {
    return date.toISOString().split('T')[0]
  }
}

const getRelativeTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = date - now
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) {
    return `${Math.abs(diffDays)} روز گذشته`
  } else if (diffDays === 0) {
    return 'امروز'
  } else if (diffDays === 1) {
    return 'فردا'
  } else if (diffDays <= 7) {
    return `${diffDays} روز دیگر`
  } else if (diffDays <= 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks} هفته دیگر`
  } else {
    const months = Math.floor(diffDays / 30)
    return `${months} ماه دیگر`
  }
}

const getReminderStatus = (reminder) => {
  if (!reminder) return 'ok'
  if (reminder.status === 'overdue') return 'overdue'
  if (reminder.status === 'near') return 'near'
  return 'ok'
}

const getReminderStatusLabel = (status) => {
  const labels = {
    overdue: 'فوری',
    near: 'بزودی',
    ok: 'عادی'
  }
  return labels[status] || 'عادی'
}

const getReminderStatusColor = (status) => {
  const colors = {
    overdue: 'red',
    near: 'yellow',
    ok: 'green'
  }
  return colors[status] || 'gray'
}

const getReminderCardClass = (reminder) => {
  const status = getReminderStatus(reminder)
  const baseClass = 'border-r-4'
  if (status === 'overdue') return `${baseClass} border-r-red-500`
  if (status === 'near') return `${baseClass} border-r-yellow-500`
  return `${baseClass} border-r-green-500`
}

const getReminderIconClass = (reminder) => {
  const status = getReminderStatus(reminder)
  if (status === 'overdue') {
    return 'p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
  }
  if (status === 'near') {
    return 'p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
  }
  return 'p-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
}

const getReminderBadgeClass = (reminder) => {
  const status = getReminderStatus(reminder)
  if (status === 'overdue') {
    return 'text-xs font-bold px-2 py-1 rounded-full text-red-500 bg-red-100 dark:bg-red-900/30'
  }
  if (status === 'near') {
    return 'text-xs font-bold px-2 py-1 rounded-full text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30'
  }
  return 'text-xs font-bold px-2 py-1 rounded-full text-green-600 bg-green-100 dark:bg-green-900/30'
}

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
      <!-- Header Section -->
      <section class="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-end">
        <div class="flex flex-col gap-2">
          <h1 class="text-3xl md:text-4xl font-black text-[#121317] dark:text-white tracking-tight">
            {{ t('dashboard.welcome') }}، {{ userName }} 👋
          </h1>
          <p class="text-[#666e85] dark:text-gray-400 text-lg">
            <template v-if="summary?.overdueReminders > 0">
              شما <span class="text-primary font-bold">{{ summary.overdueReminders }} وظیفه فوری</span> دارید که نیاز به توجه دارند.
            </template>
            <template v-else-if="summary?.activeReminders > 0">
              شما <span class="text-primary font-bold">{{ summary.activeReminders }} وظیفه در انتظار</span> دارید که نیاز به توجه دارند.
            </template>
            <template v-else>
              همه چیز در وضعیت خوبی است! 🎉
            </template>
          </p>
        </div>
        <div class="glass-panel p-2 rounded-2xl flex items-center gap-2 shadow-sm">
          <Button
            @click="handleAddService"
            variant="ghost"
            size="sm"
            class="flex items-center gap-2"
            :aria-label="t('dashboard.addService')"
          >
            <span class="bg-primary/10 p-1.5 rounded-lg text-primary">
              <span class="material-symbols-outlined text-[18px]">build</span>
            </span>
            <span class="text-sm font-bold">{{ t('dashboard.addService') }}</span>
          </Button>
          <Button
            @click="handleAddExpense"
            variant="ghost"
            size="sm"
            class="flex items-center gap-2"
            :aria-label="t('dashboard.addExpense')"
          >
            <span class="bg-green-500/10 p-1.5 rounded-lg text-green-600">
              <span class="material-symbols-outlined text-[18px]">attach_money</span>
            </span>
            <span class="text-sm font-bold">{{ t('dashboard.addExpense') }}</span>
          </Button>
          <Button
            @click="handleAddVehicle"
            variant="primary"
            size="sm"
            class="flex items-center justify-center w-10 h-10"
            :aria-label="t('dashboard.addVehicle')"
          >
            <span class="material-symbols-outlined">add</span>
          </Button>
        </div>
      </section>

      <!-- Main Grid -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <!-- Left Column (2/3 width) -->
        <div class="xl:col-span-2 flex flex-col gap-6">
          <!-- Next Service Due Card -->
          <Card 
            v-if="quickStats?.nextServiceDue"
            class="p-6 rounded-2xl shadow-sm border border-primary/20 relative overflow-hidden bg-gradient-to-l from-primary/5 to-transparent"
          >
            <div class="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-white/20 to-transparent pointer-events-none"></div>
            <div class="flex justify-between items-center mb-4 relative z-10">
              <div class="flex items-center gap-3">
                <div class="bg-blue-100 dark:bg-blue-900/30 p-2.5 rounded-xl text-primary">
                  <span class="material-symbols-outlined text-[24px]">next_plan</span>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-[#121317] dark:text-white">{{ t('dashboard.nextServiceDue') }}</h3>
                  <p class="text-xs text-[#666e85]">بر اساس کیلومتر کارکرد تخمینی</p>
                </div>
              </div>
              <span 
                v-if="quickStats.nextServiceDue.dueDate"
                class="bg-blue-50 text-primary px-3 py-1 rounded-full text-xs font-bold border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800"
              >
                {{ getRelativeTime(quickStats.nextServiceDue.dueDate) }}
              </span>
            </div>
            <div class="flex flex-col md:flex-row gap-6 relative z-10">
              <div class="flex-1">
                <div class="flex justify-between items-end mb-2">
                  <span class="text-sm font-bold text-[#121317] dark:text-white">
                    {{ quickStats.nextServiceDue.title }}
                  </span>
                  <span v-if="quickStats.nextServiceDue.vehicleName" class="text-xs text-[#666e85]">
                    {{ quickStats.nextServiceDue.vehicleName }}
                    <template v-if="quickStats.nextServiceDue.dueKm">
                      • {{ formatNumber(quickStats.nextServiceDue.dueKm) }} کیلومتر
                    </template>
                  </span>
                </div>
                <div v-if="quickStats.nextServiceDue.dueKm" class="w-full bg-gray-200 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden">
                  <div class="bg-primary h-full rounded-full" style="width: 85%"></div>
                </div>
                <p v-if="quickStats.nextServiceDue.description" class="text-xs text-[#666e85] mt-2">
                  {{ quickStats.nextServiceDue.description }}
                </p>
              </div>
            </div>
          </Card>

          <!-- Active Reminders Section -->
          <div class="flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-bold text-[#121317] dark:text-white flex items-center gap-2">
                <span class="material-symbols-outlined text-orange-500">notifications_active</span>
                {{ t('dashboard.activeReminders') }}
              </h3>
              <button
                v-if="reminders.length > 0"
                @click="handleViewAllReminders"
                class="text-sm font-medium text-primary hover:underline"
                :aria-label="t('dashboard.viewAll')"
              >
                {{ t('dashboard.viewAll') }}
              </button>
            </div>

            <!-- Empty State for Reminders -->
            <Card v-if="reminders.length === 0" class="p-8 text-center">
              <span class="material-symbols-outlined text-5xl text-gray-400 mb-4 block">notifications_off</span>
              <h4 class="text-lg font-bold text-[#121317] dark:text-white mb-2">{{ t('dashboard.noActiveReminders') }}</h4>
              <p class="text-sm text-[#666e85] dark:text-gray-400">{{ t('dashboard.noData') }}</p>
            </Card>

            <!-- Reminders Grid -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card
                v-for="reminder in reminders.slice(0, 4)"
                :key="reminder.id"
                :class="getReminderCardClass(reminder)"
              >
                <div class="flex justify-between items-start mb-3">
                  <div :class="getReminderIconClass(reminder)">
                    <span class="material-symbols-outlined">notifications</span>
                  </div>
                  <span :class="getReminderBadgeClass(reminder)">
                    {{ getReminderStatusLabel(getReminderStatus(reminder)) }}
                  </span>
                </div>
                <h4 class="text-lg font-bold text-[#121317] dark:text-white mb-1">
                  {{ reminder.title }}
                </h4>
                <p v-if="reminder.vehicleName" class="text-sm text-[#666e85] dark:text-gray-400 mb-4">
                  {{ reminder.vehicleName }}
                  <template v-if="reminder.dueKm">
                    • {{ formatNumber(reminder.dueKm) }} کیلومتر
                  </template>
                </p>
                <p v-else-if="reminder.description" class="text-sm text-[#666e85] dark:text-gray-400 mb-4">
                  {{ reminder.description }}
                </p>
                <div v-if="reminder.dueDate" class="flex items-center gap-2 text-xs font-medium text-[#666e85] bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg">
                  <span class="material-symbols-outlined text-[16px]">schedule</span>
                  <span>{{ getRelativeTime(reminder.dueDate) }}</span>
                </div>
              </Card>
            </div>
          </div>

          <!-- My Vehicles Section -->
          <div class="flex flex-col gap-4 mt-2">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-bold text-[#121317] dark:text-white flex items-center gap-2">
                <span class="material-symbols-outlined text-primary">garage_home</span>
                {{ t('dashboard.myVehicles') }}
              </h3>
              <button
                @click="handleAddVehicle"
                class="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                :aria-label="t('dashboard.addVehicle')"
              >
                <span class="material-symbols-outlined text-[18px]">add</span>
                {{ t('dashboard.addVehicle') }}
              </button>
            </div>

            <!-- Empty State for Vehicles -->
            <Card v-if="vehicles.length === 0" class="p-8 text-center">
              <span class="material-symbols-outlined text-5xl text-gray-400 mb-4 block">directions_car</span>
              <h4 class="text-lg font-bold text-[#121317] dark:text-white mb-2">{{ t('dashboard.noVehicles') }}</h4>
              <p class="text-sm text-[#666e85] dark:text-gray-400 mb-4">{{ t('dashboard.noData') }}</p>
              <Button @click="handleAddVehicle" variant="primary">
                {{ t('dashboard.addVehicle') }}
              </Button>
            </Card>

            <!-- Vehicles Grid -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card
                v-for="vehicle in vehicles.slice(0, 4)"
                :key="vehicle.id"
                class="p-4 flex gap-4 items-center cursor-pointer hover:shadow-lg transition-shadow"
                @click="handleViewVehicle(vehicle.id)"
                :aria-label="`مشاهده جزئیات ${vehicle.model}`"
                role="button"
                tabindex="0"
                @keydown.enter="handleViewVehicle(vehicle.id)"
                @keydown.space.prevent="handleViewVehicle(vehicle.id)"
              >
                <div class="w-24 h-24 shrink-0 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden relative flex items-center justify-center">
                  <span class="material-symbols-outlined text-4xl text-gray-400">directions_car</span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex justify-between items-start">
                    <h4 class="text-lg font-bold text-[#121317] dark:text-white truncate">{{ vehicle.model }}</h4>
                    <span class="material-symbols-outlined text-gray-300 hover:text-primary cursor-pointer">more_vert</span>
                  </div>
                  <p class="text-sm text-[#666e85] dark:text-gray-400 mb-2">
                    {{ vehicle.year }}
                    <template v-if="vehicle.plateNumber"> • {{ vehicle.plateNumber }}</template>
                  </p>
                  <div class="flex items-center gap-2">
                    <div class="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-xs font-mono font-bold text-[#121317] dark:text-white" dir="ltr">
                      {{ formatNumber(vehicle.currentKm) }} km
                    </div>
                    <span 
                      v-if="reminders.find(r => r.vehicleId === vehicle.id)"
                      class="w-2 h-2 rounded-full bg-red-500"
                      :title="t('dashboard.activeReminders')"
                    ></span>
                    <span
                      v-else
                      class="w-2 h-2 rounded-full bg-green-500"
                      :title="t('dashboard.normal')"
                    ></span>
                  </div>
                </div>
              </Card>
            </div>

            <!-- View All Vehicles Link -->
            <div v-if="vehicles.length > 4" class="text-center">
              <button
                @click="handleViewAllVehicles"
                class="text-sm font-medium text-primary hover:underline"
                :aria-label="t('dashboard.viewAll')"
              >
                {{ t('dashboard.viewAll') }} ({{ vehicles.length }})
              </button>
            </div>
          </div>
        </div>

        <!-- Right Column (1/3 width) -->
        <div class="xl:col-span-1 flex flex-col gap-6">
          <!-- Expenses Card -->
          <Card class="p-6 rounded-3xl relative overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-10 -mt-10 blur-2xl pointer-events-none"></div>
            <h3 class="text-lg font-bold text-[#121317] dark:text-white mb-4 flex items-center gap-2">
              <span class="material-symbols-outlined text-gray-400">monitoring</span>
              {{ t('dashboard.thisMonthExpenses') }}
            </h3>
            <div class="flex flex-col gap-1 mb-6">
              <p class="text-sm text-[#666e85] dark:text-gray-400">{{ t('dashboard.thisMonthExpenses') }}</p>
              <div class="flex items-baseline gap-1">
                <span class="text-3xl font-black text-[#121317] dark:text-white tracking-tight">
                  {{ formatCurrency(quickStats?.thisMonthExpenses || 0) }}
                </span>
                <span class="text-xs font-normal text-[#666e85] mr-1">تومان</span>
              </div>
            </div>
            <div class="flex flex-col gap-2 text-sm">
              <div class="flex justify-between items-center">
                <span class="text-[#666e85] dark:text-gray-400">{{ t('dashboard.servicesThisMonth') }}</span>
                <span class="font-bold text-[#121317] dark:text-white">{{ formatNumber(quickStats?.servicesThisMonth || 0) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-[#666e85] dark:text-gray-400">{{ t('dashboard.avgMonthlyExpense') }}</span>
                <span class="font-bold text-[#121317] dark:text-white">{{ formatCurrency(quickStats?.avgMonthlyExpense || 0) }}</span>
              </div>
            </div>
          </Card>

          <!-- Recent Activities Card -->
          <Card class="p-5 rounded-3xl flex-1">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-bold text-[#121317] dark:text-white">{{ t('dashboard.recentServices') }}</h3>
              <router-link 
                v-if="recentServices.length > 0"
                to="/service-list"
                class="text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
              >
                {{ t('dashboard.viewAll') }}
                <span class="material-symbols-outlined text-[16px]">arrow_back</span>
              </router-link>
            </div>
            
            <!-- Empty State -->
            <div v-if="recentServices.length === 0" class="text-center py-8">
              <span class="material-symbols-outlined text-4xl text-gray-400 mb-2 block">history</span>
              <p class="text-sm text-[#666e85] dark:text-gray-400">{{ t('dashboard.noData') }}</p>
            </div>

            <!-- Recent Services List -->
            <div v-else class="flex flex-col gap-4">
              <div
                v-for="service in recentServices.slice(0, 5)"
                :key="service.id"
                class="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-gray-700/50 last:border-0 last:pb-0"
              >
                <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <span class="material-symbols-outlined text-[20px]">build</span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-bold text-[#121317] dark:text-white truncate">
                    {{ service.types?.join('، ') || service.type || 'سرویس' }}
                  </p>
                  <p class="text-xs text-[#666e85] dark:text-gray-400">
                    {{ formatDate(service.date) }}
                    <template v-if="service.km"> • {{ formatNumber(service.km) }} km</template>
                  </p>
                </div>
                <p class="text-sm font-bold text-[#121317] dark:text-white text-left whitespace-nowrap" dir="ltr">
                  {{ formatCurrency(service.cost) }}
                </p>
              </div>
            </div>
          </Card>

          <!-- Quick Actions Card -->
          <Card class="p-5 rounded-3xl">
            <h3 class="text-lg font-bold text-[#121317] dark:text-white mb-4">{{ t('dashboard.quickActions') }}</h3>
            <div class="flex flex-col gap-2">
              <Button
                @click="handleAddService"
                variant="outline"
                full-width
                class="justify-start"
                :aria-label="t('dashboard.addService')"
              >
                <span class="material-symbols-outlined mr-2">build</span>
                {{ t('dashboard.addService') }}
              </Button>
              <Button
                @click="handleAddExpense"
                variant="outline"
                full-width
                class="justify-start"
                :aria-label="t('dashboard.addExpense')"
              >
                <span class="material-symbols-outlined mr-2">attach_money</span>
                {{ t('dashboard.addExpense') }}
              </Button>
              <Button
                @click="handleViewReports"
                variant="outline"
                full-width
                class="justify-start"
                :aria-label="t('dashboard.reports')"
              >
                <span class="material-symbols-outlined mr-2">assessment</span>
                {{ t('dashboard.reports') }}
              </Button>
            </div>
          </Card>
        </div>
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
