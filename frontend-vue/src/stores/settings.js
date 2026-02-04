import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  // State
  const userProfile = ref({})
  const notificationSettings = ref({
    email: true,
    push: true,
    sms: false,
    reminders: true,
    marketing: false
  })
  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const profileComplete = computed(() => {
    const profile = userProfile.value
    return !!(profile.name && profile.email && profile.phone)
  })

  // Actions
  const fetchProfile = async () => {
    // Implementation will be added in later tasks
    console.log('Fetch profile action placeholder')
  }

  const updateProfile = async (data) => {
    // Implementation will be added in later tasks
    console.log('Update profile action placeholder', data)
  }

  const updateNotificationSettings = async (settings) => {
    // Implementation will be added in later tasks
    console.log('Update notification settings action placeholder', settings)
  }

  const changePassword = async (currentPassword, newPassword) => {
    // Implementation will be added in later tasks
    console.log('Change password action placeholder')
  }

  return {
    // State
    userProfile,
    notificationSettings,
    isLoading,
    error,
    // Getters
    profileComplete,
    // Actions
    fetchProfile,
    updateProfile,
    updateNotificationSettings,
    changePassword
  }
})