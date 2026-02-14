<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import MainLayout from '../components/MainLayout.vue'
import VehicleFilterSelect from '../components/VehicleFilterSelect.vue'
import Card from '../components/ui/Card.vue'
import Modal from '../components/ui/Modal.vue'
import Button from '../components/ui/Button.vue'
import LoadingSpinner from '../components/ui/LoadingSpinner.vue'
import { useFormatDate } from '../composables/useFormatDate'
import { getDaysRemaining as getDaysRemainingUtil } from '../utils/reminderDateUtils'
import { useReminderStore } from '../stores/reminder'
import { useVehicleStore } from '../stores/vehicle'
import { useUIStore } from '../stores/ui'

const router = useRouter()
const { t } = useI18n()
const formatDate = useFormatDate()
const reminderStore = useReminderStore()
const vehicleStore = useVehicleStore()
const uiStore = useUIStore()

// State
const activeFilter = ref('all') // 'all', 'overdue', 'near', 'active'
const selectedVehicleId = ref(null)
const showDeleteModal = ref(false)
const reminderToDelete = ref(null)

// Computed
const filteredReminders = computed(() => {
  let reminders = reminderStore.reminders.filter(r => !r.dismissed)

  // Filter by status
  if (activeFilter.value === 'overdue') {
    reminders = reminders.filter(r => r.status === 'overdue')
  } else if (activeFilter.value === 'near') {
    reminders = reminders.filter(r => r.status === 'near')
  } else if (activeFilter.value === 'active') {
    reminders = reminders.filter(r => r.status === 'ok' || r.status === 'near')
  }

  // Filter by vehicle
  if (selectedVehicleId.value) {
    reminders = reminders.filter(r => String(r.vehicleId) === String(selectedVehicleId.value))
  }

  // Sort by status priority: overdue > near > ok
  return reminders.sort((a, b) => {
    const statusOrder = { overdue: 0, near: 1, ok: 2 }
    return statusOrder[a.status] - statusOrder[b.status]
  })
})

// Methods
const handleFilterChange = (filter) => {
  activeFilter.value = filter
}

const handleVehicleChange = (vehicleId) => {
  selectedVehicleId.value = vehicleId || null
}

const handleAddReminder = () => {
  router.push({ name: 'reminder-management', query: { action: 'add' } })
}

const handleEdit = (reminderId) => {
  router.push({ name: 'reminder-management', query: { action: 'edit', id: reminderId } })
}

const handleDeleteClick = (reminderId) => {
  reminderToDelete.value = reminderId
  showDeleteModal.value = true
}

const handleDeleteConfirm = async () => {
  if (!reminderToDelete.value) return

  try {
    await reminderStore.deleteReminder(reminderToDelete.value)
    uiStore.success(t('reminders.deleteSuccess'))
    reminderToDelete.value = null
    showDeleteModal.value = false
  } catch (error) {
    uiStore.error(error.message || t('reminders.deleteError'))
  }
}

const handleDeleteCancel = () => {
  reminderToDelete.value = null
  showDeleteModal.value = false
}

const handleMarkCompleted = async (reminderId) => {
  try {
    await reminderStore.markCompleted(reminderId)
    uiStore.success(t('reminders.markCompletedSuccess'))
  } catch (error) {
    uiStore.error(error.message || t('reminders.markCompletedError'))
  }
}

const handleRetry = async () => {
  reminderStore.clearError()
  try {
    await reminderStore.fetchReminders(selectedVehicleId.value || undefined)
  } catch (error) {
    uiStore.error(error.message || t('reminders.loadingError'))
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case 'overdue':
      return 'red'
    case 'near':
      return 'yellow'
    case 'ok':
      return 'blue'
    default:
      return 'gray'
  }
}

// کلاس‌های ثابت برای هر وضعیت تا Tailwind آن‌ها را در خروجی نگه دارد (بدون dynamic class)
const STATUS_CLASSES = {
  red: {
    cardBorder: 'border-r-4 border-r-red-500',
    iconWrapper: 'w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400 shadow-inner',
    statusBox: 'flex items-center gap-2 mb-4 bg-red-50 dark:bg-red-900/10 p-3 rounded-xl border border-red-100 dark:border-red-900/30',
    statusIcon: 'material-symbols-outlined text-red-500 text-[20px]',
    statusLabel: 'text-xs text-red-600 dark:text-red-400 font-bold uppercase tracking-wider',
    progressPercent: 'font-bold text-red-600',
    progressBar: 'bg-red-500 h-full rounded-full transition-all',
    actionButton: 'flex-1 bg-red-500 text-white'
  },
  yellow: {
    cardBorder: 'border-r-4 border-r-yellow-500',
    iconWrapper: 'w-12 h-12 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center text-yellow-600 dark:text-yellow-400 shadow-inner',
    statusBox: 'flex items-center gap-2 mb-4 bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-xl border border-yellow-100 dark:border-yellow-900/30',
    statusIcon: 'material-symbols-outlined text-yellow-500 text-[20px]',
    statusLabel: 'text-xs text-yellow-600 dark:text-yellow-400 font-bold uppercase tracking-wider',
    progressPercent: 'font-bold text-yellow-600',
    progressBar: 'bg-yellow-500 h-full rounded-full transition-all',
    actionButton: 'flex-1 bg-yellow-500 text-white'
  },
  blue: {
    cardBorder: 'border-r-4 border-r-blue-500',
    iconWrapper: 'w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner',
    statusBox: 'flex items-center gap-2 mb-4 bg-blue-50 dark:bg-blue-900/10 p-3 rounded-xl border border-blue-100 dark:border-blue-900/30',
    statusIcon: 'material-symbols-outlined text-blue-500 text-[20px]',
    statusLabel: 'text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider',
    progressPercent: 'font-bold text-blue-600',
    progressBar: 'bg-blue-500 h-full rounded-full transition-all',
    actionButton: 'flex-1 bg-blue-500 text-white'
  },
  gray: {
    cardBorder: 'border-r-4 border-r-gray-500',
    iconWrapper: 'w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-900/20 flex items-center justify-center text-gray-600 dark:text-gray-400 shadow-inner',
    statusBox: 'flex items-center gap-2 mb-4 bg-gray-50 dark:bg-gray-900/10 p-3 rounded-xl border border-gray-100 dark:border-gray-900/30',
    statusIcon: 'material-symbols-outlined text-gray-500 text-[20px]',
    statusLabel: 'text-xs text-gray-600 dark:text-gray-400 font-bold uppercase tracking-wider',
    progressPercent: 'font-bold text-gray-600',
    progressBar: 'bg-gray-500 h-full rounded-full transition-all',
    actionButton: 'flex-1 bg-gray-500 text-white'
  }
}

const getStatusClasses = (status) => STATUS_CLASSES[getStatusColor(status)] || STATUS_CLASSES.gray

const getDaysRemainingTextClass = (days) => {
  if (days === null || days === undefined) return 'text-gray-600 dark:text-gray-400'
  if (days < 0) return 'text-red-600 dark:text-red-400'
  if (days <= 7) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-blue-600 dark:text-blue-400'
}

// محاسبه روز باقی‌مانده تا موعد (منطق تست‌شده در utils/reminderDateUtils)
const getDaysRemaining = (reminder) => getDaysRemainingUtil(reminder?.dueDate)

// Format days remaining text (i18n)
const formatDaysRemaining = (days) => {
  if (days === null || days === undefined) return ''
  const count = Math.abs(days)
  if (days < 0) {
    return t('reminders.daysRemaining.daysAgo', { count: count.toLocaleString('fa-IR') })
  }
  if (days === 0) return t('reminders.daysRemaining.today')
  if (days === 1) return t('reminders.daysRemaining.tomorrow')
  return t('reminders.daysRemaining.daysLater', { count: days.toLocaleString('fa-IR') })
}

const getStatusInfo = (reminder) => {
  const status = reminder.status
  const daysRemaining = getDaysRemaining(reminder)
  
  if (status === 'overdue') {
    // Check for km-based overdue
    if (reminder.dueKm && reminder.currentKm) {
      const overdue = reminder.currentKm - reminder.dueKm
      return {
        label: t('reminders.status.overdue'),
        message: t('reminders.overdueKm', { km: overdue.toLocaleString('fa-IR') }),
        icon: 'warning',
        color: 'red'
      }
    }
    // Check for date-based overdue
    if (reminder.dueDate && daysRemaining !== null && daysRemaining < 0) {
      return {
        label: t('reminders.status.overdue'),
        message: t('reminders.daysRemaining.daysPastDue', { count: Math.abs(daysRemaining).toLocaleString('fa-IR') }),
        icon: 'warning',
        color: 'red'
      }
    }
    return {
      label: t('reminders.status.overdue'),
      message: t('reminders.overdue'),
      icon: 'warning',
      color: 'red'
    }
  } else if (status === 'near') {
    // Check for km-based near
    if (reminder.dueKm && reminder.currentKm) {
      const remaining = reminder.dueKm - reminder.currentKm
      return {
        label: t('reminders.status.near'),
        message: t('reminders.remainingKm', { km: remaining.toLocaleString('fa-IR') }),
        icon: 'schedule',
        color: 'yellow'
      }
    }
    // Check for date-based near
    if (reminder.dueDate && daysRemaining !== null && daysRemaining >= 0) {
      return {
        label: t('reminders.status.near'),
        message: formatDaysRemaining(daysRemaining),
        icon: 'schedule',
        color: 'yellow'
      }
    }
    return {
      label: t('reminders.status.near'),
      message: t('reminders.near'),
      icon: 'schedule',
      color: 'yellow'
    }
  } else {
    // Check for km-based ok
    if (reminder.dueKm && reminder.currentKm) {
      const remaining = reminder.dueKm - reminder.currentKm
      return {
        label: t('reminders.status.ok'),
        message: t('reminders.remainingKm', { km: remaining.toLocaleString('fa-IR') }),
        icon: 'check_circle',
        color: 'blue'
      }
    }
    // Check for date-based ok
    if (reminder.dueDate && daysRemaining !== null && daysRemaining >= 0) {
      return {
        label: t('reminders.status.ok'),
        message: formatDaysRemaining(daysRemaining),
        icon: 'check_circle',
        color: 'blue'
      }
    }
    return {
      label: t('reminders.status.ok'),
      message: t('reminders.active'),
      icon: 'check_circle',
      color: 'blue'
    }
  }
}

const getProgressPercent = (reminder) => {
  if (!reminder.dueKm || !reminder.currentKm || !reminder.lastServiceKm) {
    return 0
  }
  const total = reminder.dueKm - reminder.lastServiceKm
  const current = reminder.currentKm - reminder.lastServiceKm
  return Math.min(Math.max((current / total) * 100, 0), 100)
}

// Lifecycle
onMounted(async () => {
  try {
    // Load vehicles if not loaded
    if (vehicleStore.vehicles.length === 0) {
      await vehicleStore.fetchVehicles()
    }
    
    // Load reminders
    await reminderStore.fetchReminders()
  } catch (error) {
    uiStore.error(error.message || t('reminders.loadingError'))
  }
})
</script>

<template>
  <MainLayout>
    <div class="flex flex-col gap-6">
      <!-- Header with Filters -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white/30 dark:bg-black/10 p-4 rounded-2xl glass-panel">
        <!-- Status Filters -->
        <div class="flex p-1 bg-gray-100 dark:bg-slate-800/80 rounded-xl overflow-x-auto max-w-full gap-1">
          <button
            @click="handleFilterChange('all')"
            :class="[
              'px-5 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all',
              activeFilter === 'all'
                ? 'bg-white dark:bg-slate-700 shadow-sm text-primary dark:text-white font-bold'
                : 'hover:bg-white/50 dark:hover:bg-slate-700/50 text-[#666e85] dark:text-gray-400'
            ]"
          >
            {{ t('reminders.allReminders') }}
          </button>
          <button
            @click="handleFilterChange('overdue')"
            :class="[
              'px-5 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all flex items-center gap-2',
              activeFilter === 'overdue'
                ? 'bg-white dark:bg-slate-700 shadow-sm text-primary dark:text-white font-bold'
                : 'hover:bg-white/50 dark:hover:bg-slate-700/50 text-[#666e85] dark:text-gray-400'
            ]"
          >
            <span class="w-2 h-2 rounded-full bg-red-500"></span>
            {{ t('reminders.overdue') }}
          </button>
          <button
            @click="handleFilterChange('near')"
            :class="[
              'px-5 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all flex items-center gap-2',
              activeFilter === 'near'
                ? 'bg-white dark:bg-slate-700 shadow-sm text-primary dark:text-white font-bold'
                : 'hover:bg-white/50 dark:hover:bg-slate-700/50 text-[#666e85] dark:text-gray-400'
            ]"
          >
            <span class="w-2 h-2 rounded-full bg-yellow-500"></span>
            {{ t('reminders.near') }}
          </button>
          <button
            @click="handleFilterChange('active')"
            :class="[
              'px-5 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all',
              activeFilter === 'active'
                ? 'bg-white dark:bg-slate-700 shadow-sm text-primary dark:text-white font-bold'
                : 'hover:bg-white/50 dark:hover:bg-slate-700/50 text-[#666e85] dark:text-gray-400'
            ]"
          >
            {{ t('reminders.active') }}
          </button>
        </div>

        <!-- Vehicle Filter and Add Button -->
        <div class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <VehicleFilterSelect
            :model-value="selectedVehicleId ?? ''"
            :show-all-option="true"
            @update:model-value="handleVehicleChange"
          />
          <Button
            @click="handleAddReminder"
            class="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary-light transition-all shadow-lg shadow-primary/20 whitespace-nowrap"
          >
            <span class="material-symbols-outlined text-[18px]">add_alert</span>
            <span>{{ t('reminders.addReminder') }}</span>
          </Button>
        </div>
      </div>

      <!-- Error State with Retry -->
      <div v-if="reminderStore.error" class="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800">
        <span class="material-symbols-outlined text-red-500 text-5xl mb-3">error</span>
        <p class="text-red-700 dark:text-red-400 font-medium mb-2">{{ reminderStore.error }}</p>
        <div class="flex gap-3 items-center">
          <Button @click="handleRetry" class="bg-red-500 text-white hover:bg-red-600">
            <span class="material-symbols-outlined text-[18px]">refresh</span>
            {{ t('reminders.retry') }}
          </Button>
          <button @click="reminderStore.clearError()" class="text-sm text-red-600 dark:text-red-400 hover:underline">
            {{ t('common.cancel') }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else-if="reminderStore.isLoading && filteredReminders.length === 0" class="flex flex-col justify-center items-center py-12 gap-3">
        <LoadingSpinner />
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('reminders.loading') }}</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredReminders.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
        <span class="material-symbols-outlined text-gray-400 text-6xl mb-4">notifications_off</span>
        <h3 class="text-lg font-bold text-[#121317] dark:text-white mb-2">{{ t('reminders.empty') }}</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">{{ t('reminders.emptyDescription') }}</p>
        <Button @click="handleAddReminder" class="bg-primary text-white">
          {{ t('reminders.addReminder') }}
        </Button>
      </div>

      <!-- Reminders Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <!-- Reminder Cards -->
        <Card
          v-for="reminder in filteredReminders"
          :key="reminder.id"
          :class="getStatusClasses(reminder.status).cardBorder"
        >
          <div class="flex justify-between items-start mb-4">
            <div class="flex gap-3">
              <div
                :class="getStatusClasses(reminder.status).iconWrapper"
              >
                <span class="material-symbols-outlined text-[24px]">
                  {{ reminder.type === 'oil_change' ? 'oil_barrel' : 'build' }}
                </span>
              </div>
              <div>
                <h4 class="font-bold text-lg text-[#121317] dark:text-white">{{ reminder.title }}</h4>
                <p v-if="reminder.vehicleName" class="text-xs font-medium text-[#666e85] flex items-center gap-1">
                  {{ reminder.vehicleName }}
                  <span v-if="reminder.description" class="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span v-if="reminder.description" class="font-mono">{{ reminder.description }}</span>
                </p>
              </div>
            </div>
            <button
              @click="handleDeleteClick(reminder.id)"
              class="text-gray-400 hover:text-primary p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              :aria-label="t('common.delete')"
            >
              <span class="material-symbols-outlined">more_vert</span>
            </button>
          </div>

          <!-- Status Badge -->
          <div
            :class="getStatusClasses(reminder.status).statusBox"
          >
            <span
              :class="getStatusClasses(reminder.status).statusIcon"
            >
              {{ getStatusInfo(reminder).icon }}
            </span>
            <div>
              <p
                :class="getStatusClasses(reminder.status).statusLabel"
              >
                {{ getStatusInfo(reminder).label }}
              </p>
              <p class="text-sm font-medium text-[#121317] dark:text-white">
                {{ getStatusInfo(reminder).message }}
              </p>
            </div>
          </div>

          <!-- Date Information (if applicable) -->
          <div v-if="reminder.dueDate" class="mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-sm text-gray-500 dark:text-gray-400">event</span>
                <span class="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {{ t('reminders.form.dueDate') }}
                </span>
              </div>
              <span class="text-sm font-bold text-[#121317] dark:text-white">
                {{ formatDate(reminder.dueDate) }}
              </span>
            </div>
            <div v-if="getDaysRemaining(reminder) !== null" class="flex items-center gap-2">
              <span class="material-symbols-outlined text-sm text-gray-500 dark:text-gray-400">schedule</span>
              <span :class="['text-xs font-medium', getDaysRemainingTextClass(getDaysRemaining(reminder))]">
                {{ formatDaysRemaining(getDaysRemaining(reminder)) }}
              </span>
            </div>
          </div>

          <!-- Progress Bar (if applicable) -->
          <div v-if="reminder.dueKm && reminder.currentKm" class="mb-4">
            <div class="flex justify-between text-xs mb-1.5 text-[#666e85]">
              <span>{{ t('reminders.targetKm', { km: reminder.dueKm.toLocaleString('fa-IR') }) }}</span>
              <span :class="getStatusClasses(reminder.status).progressPercent">
                {{ Math.round(getProgressPercent(reminder)) }}٪
              </span>
            </div>
            <div class="w-full bg-gray-100 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden">
              <div
                :class="getStatusClasses(reminder.status).progressBar"
                :style="{ width: Math.min(getProgressPercent(reminder), 100) + '%' }"
              ></div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 mt-auto">
            <Button
              @click="handleEdit(reminder.id)"
              variant="outline"
              class="flex-1"
            >
              <span class="material-symbols-outlined text-[18px]">edit</span>
              {{ t('common.edit') }}
            </Button>
            <Button
              @click="handleMarkCompleted(reminder.id)"
              :class="getStatusClasses(reminder.status).actionButton"
            >
              <span class="material-symbols-outlined text-[18px]">check</span>
              {{ t('reminders.completed') }}
            </Button>
          </div>
        </Card>

        <!-- Add New Reminder Card -->
        <div
          @click="handleAddReminder"
          class="p-5 rounded-2xl border-2 border-dashed border-primary/30 dark:border-primary/20 hover:border-primary hover:bg-primary/5 transition-all group flex flex-col h-full items-center justify-center cursor-pointer min-h-[300px]"
        >
          <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
            <span class="material-symbols-outlined text-[32px]">add_alert</span>
          </div>
          <h4 class="font-bold text-lg text-primary">{{ t('reminders.addReminder') }}</h4>
          <p class="text-sm text-[#666e85] text-center mt-2 px-8">{{ t('reminders.addReminderDescription') }}</p>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <Modal
      :open="showDeleteModal"
      @close="handleDeleteCancel"
      :title="t('common.confirm')"
    >
      <p class="text-gray-700 dark:text-gray-300 mb-4">{{ t('reminders.deleteConfirm') }}</p>
      <div class="flex gap-3 justify-end">
        <Button @click="handleDeleteCancel" variant="outline">
          {{ t('common.cancel') }}
        </Button>
        <Button @click="handleDeleteConfirm" class="bg-red-500 text-white">
          {{ t('common.delete') }}
        </Button>
      </div>
    </Modal>
  </MainLayout>
</template>
