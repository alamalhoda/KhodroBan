<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import MainLayout from '../components/MainLayout.vue'
import ReminderForm from '../components/ReminderForm.vue'
import Card from '../components/ui/Card.vue'
import LoadingSpinner from '../components/ui/LoadingSpinner.vue'
import { useReminderStore } from '../stores/reminder'
import { useUIStore } from '../stores/ui'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const reminderStore = useReminderStore()
const uiStore = useUIStore()

const mode = computed(() => route.query.action) // 'add' | 'edit'
const reminderId = computed(() => route.query.id)
const vehicleId = computed(() => route.query.vehicleId)
const serviceId = computed(() => route.query.serviceId)

const isLoading = ref(false)
const initialData = ref(null)

// Load reminder data if editing
onMounted(async () => {
  if (mode.value === 'edit' && reminderId.value) {
    isLoading.value = true
    try {
      initialData.value = await reminderStore.getReminderById(reminderId.value)
    } catch (error) {
      uiStore.error(error.message || t('reminders.loadingError'))
      router.push({ name: 'reminders' })
    } finally {
      isLoading.value = false
    }
  }
})

const handleSubmit = async (reminderData) => {
  isLoading.value = true
  try {
    if (mode.value === 'edit' && reminderId.value) {
      await reminderStore.updateReminder(reminderId.value, reminderData)
      uiStore.success(t('reminders.updateSuccess'))
    } else {
      await reminderStore.createReminder(reminderData)
      uiStore.success(t('reminders.createSuccess'))
    }
    router.push({ name: 'reminders' })
  } catch (error) {
    uiStore.error(error.message || (mode.value === 'edit' ? t('reminders.updateError') : t('reminders.createError')))
  } finally {
    isLoading.value = false
  }
}

const handleCancel = () => {
  router.push({ name: 'reminders' })
}

const pageTitle = computed(() => {
  return mode.value === 'edit' ? t('reminders.editReminder') : t('reminders.addReminder')
})
</script>

<template>
  <MainLayout>
    <div class="flex flex-col gap-4">
      <!-- Header -->
      <div class="flex flex-col gap-1">
        <h1 class="text-[#121317] dark:text-white tracking-tight text-xl md:text-2xl font-bold leading-tight">
          {{ pageTitle }}
        </h1>
        <p class="text-[#666e85] dark:text-gray-400 text-xs font-normal leading-normal">
          {{ mode === 'edit' ? t('reminders.editReminderDescription') : t('reminders.addReminderDescription') }}
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading && mode === 'edit'" class="flex justify-center items-center py-8">
        <LoadingSpinner />
      </div>

      <!-- Form -->
      <Card v-else class="p-4">
        <ReminderForm
          :vehicle-id="vehicleId"
          :service-id="serviceId"
          :mode="mode === 'edit' ? 'manual' : 'manual'"
          :initial-data="initialData"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
      </Card>
    </div>
  </MainLayout>
</template>

