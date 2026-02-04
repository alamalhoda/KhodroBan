import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUpgradeStore = defineStore('upgrade', () => {
  // State
  const currentTier = ref('free')
  const paymentInProgress = ref(false)
  const availablePlans = ref([])
  const error = ref(null)

  // Getters
  const isPro = computed(() => currentTier.value === 'pro' || currentTier.value === 'pro+')
  const isProPlus = computed(() => currentTier.value === 'pro+')
  const canAccessFeature = computed(() => (feature) => {
    const featureRequirements = {
      'unlimited-vehicles': ['pro', 'pro+'],
      'advanced-reports': ['pro', 'pro+'],
      'ai-advisor': ['pro+'],
      'export-data': ['pro', 'pro+']
    }
    
    const requiredTiers = featureRequirements[feature] || ['free']
    return requiredTiers.includes(currentTier.value)
  })

  // Actions
  const fetchPlans = async () => {
    // Implementation will be added in later tasks
    console.log('Fetch upgrade plans action placeholder')
  }

  const initiateUpgrade = async (planId) => {
    // Implementation will be added in later tasks
    console.log('Initiate upgrade action placeholder', planId)
  }

  const processPayment = async (paymentData) => {
    // Implementation will be added in later tasks
    console.log('Process payment action placeholder', paymentData)
  }

  const checkFeatureAccess = (feature) => {
    return canAccessFeature.value(feature)
  }

  return {
    // State
    currentTier,
    paymentInProgress,
    availablePlans,
    error,
    // Getters
    isPro,
    isProPlus,
    canAccessFeature,
    // Actions
    fetchPlans,
    initiateUpgrade,
    processPayment,
    checkFeatureAccess
  }
})