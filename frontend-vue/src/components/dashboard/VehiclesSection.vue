<!--
  بخش خودروهای من در داشبورد
-->
<script setup>
import { useI18n } from 'vue-i18n'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import { formatNumber } from '@/utils/formatters'

const props = defineProps({
  /** آرایه خودروها */
  vehicles: { type: Array, default: () => [] },
  /** آرایه یادآورها (برای نمایش نقطه وضعیت روی هر خودرو) */
  reminders: { type: Array, default: () => [] }
})

const emit = defineEmits(['view-vehicle', 'add-vehicle', 'view-all'])

const { t } = useI18n()

const hasReminderForVehicle = (vehicleId) => props.reminders.some(r => r.vehicleId === vehicleId)
</script>

<template>
  <div class="flex flex-col gap-4 mt-2">
    <div class="flex items-center justify-between">
      <h3 class="text-xl font-bold text-[#121317] dark:text-white flex items-center gap-2">
        <span class="material-symbols-outlined text-primary">garage_home</span>
        {{ t('dashboard.myVehicles') }}
      </h3>
      <button
        type="button"
        class="text-sm font-medium text-primary hover:underline flex items-center gap-1"
        :aria-label="t('dashboard.addVehicle')"
        @click="emit('add-vehicle')"
      >
        <span class="material-symbols-outlined text-[18px]" aria-hidden="true">add</span>
        {{ t('dashboard.addVehicle') }}
      </button>
    </div>

    <Card v-if="vehicles.length === 0" class="p-8 text-center">
      <span class="material-symbols-outlined text-5xl text-gray-400 mb-4 block" aria-hidden="true">directions_car</span>
      <h4 class="text-lg font-bold text-[#121317] dark:text-white mb-2">{{ t('dashboard.noVehicles') }}</h4>
      <p class="text-sm text-[#666e85] dark:text-gray-400 mb-4">{{ t('dashboard.noData') }}</p>
      <Button variant="primary" :aria-label="t('dashboard.addVehicle')" @click="emit('add-vehicle')">
        {{ t('dashboard.addVehicle') }}
      </Button>
    </Card>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card
        v-for="vehicle in vehicles.slice(0, 4)"
        :key="vehicle.id"
        class="p-4 flex gap-4 items-center cursor-pointer hover:shadow-lg transition-shadow"
        role="button"
        tabindex="0"
        :aria-label="`مشاهده جزئیات ${vehicle.model}`"
        @click="emit('view-vehicle', vehicle.id)"
        @keydown.enter="emit('view-vehicle', vehicle.id)"
        @keydown.space.prevent="emit('view-vehicle', vehicle.id)"
      >
        <div class="w-24 h-24 shrink-0 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden relative flex items-center justify-center">
          <span class="material-symbols-outlined text-4xl text-gray-400" aria-hidden="true">directions_car</span>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-start">
            <h4 class="text-lg font-bold text-[#121317] dark:text-white truncate">{{ vehicle.model }}</h4>
            <span class="material-symbols-outlined text-gray-300 hover:text-primary cursor-pointer" aria-hidden="true">more_vert</span>
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
              v-if="hasReminderForVehicle(vehicle.id)"
              class="w-2 h-2 rounded-full bg-red-500"
              :title="t('dashboard.activeReminders')"
              aria-hidden="true"
            />
            <span
              v-else
              class="w-2 h-2 rounded-full bg-green-500"
              :title="t('dashboard.normal')"
              aria-hidden="true"
            />
          </div>
        </div>
      </Card>
    </div>

    <div v-if="vehicles.length > 4" class="text-center">
      <button
        type="button"
        class="text-sm font-medium text-primary hover:underline"
        :aria-label="t('dashboard.viewAll')"
        @click="emit('view-all')"
      >
        {{ t('dashboard.viewAll') }} ({{ vehicles.length }})
      </button>
    </div>
  </div>
</template>
