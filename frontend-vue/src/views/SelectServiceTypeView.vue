<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import MainLayout from '../components/MainLayout.vue'
import ServiceTypeSelector from '../components/ServiceTypeSelector.vue'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const handleServiceTypeSelect = (data) => {
  // Navigate to add service with selected types
  const queryParams = new URLSearchParams()
  queryParams.set('types', data.types.join(','))
  if (data.vehicleId) {
    queryParams.set('vehicleId', data.vehicleId)
  }
  
  router.push(`/add-service?${queryParams.toString()}`)
}

const handleServiceTypeCancel = () => {
  router.back()
}
</script>

<template>
  <MainLayout>
    <div class="w-full max-w-[800px] mx-auto">
      <ServiceTypeSelector
        :vehicle-id="route.query.vehicleId"
        @select="handleServiceTypeSelect"
        @cancel="handleServiceTypeCancel"
      />
    </div>
  </MainLayout>
</template>
