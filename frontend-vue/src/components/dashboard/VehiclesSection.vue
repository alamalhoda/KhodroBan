<!--
  بخش خودروهای من در داشبورد
  نمایش تصویر پیش‌فرض خودرو و آیکون رنگی (FontAwesome) در هر کارت.
-->
<script setup>
import { useI18n } from 'vue-i18n'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import { formatNumber } from '@/utils/formatters'
import { DEFAULT_VEHICLE_ICON, DEFAULT_VEHICLE_ICON_STYLE, DEFAULT_VEHICLE_ICON_COLOR, getEffectiveIconStyle } from '@/config/vehicleIcons'

const props = defineProps({
  /** آرایه خودروها (هر خودرو می‌تواند defaultImageUrl و iconName/iconStyle/iconColor داشته باشد) */
  vehicles: { type: Array, default: () => [] },
  /** آرایه یادآورها (برای نمایش نقطه وضعیت روی هر خودرو) */
  reminders: { type: Array, default: () => [] }
})

const emit = defineEmits(['view-vehicle', 'add-vehicle', 'view-all'])

const { t } = useI18n()

const hasReminderForVehicle = (vehicleId) => props.reminders.some(r => r.vehicleId === vehicleId)

function vehicleIconClass(vehicle) {
  if (!vehicle) return `fa fa-${getEffectiveIconStyle(DEFAULT_VEHICLE_ICON_STYLE)} fa-${DEFAULT_VEHICLE_ICON}`
  const style = vehicle.iconStyle || DEFAULT_VEHICLE_ICON_STYLE
  const name = vehicle.iconName || DEFAULT_VEHICLE_ICON
  return `fa fa-${getEffectiveIconStyle(style)} fa-${name}`
}

function vehicleIconColor(vehicle) {
  return vehicle?.iconColor || DEFAULT_VEHICLE_ICON_COLOR
}
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
        class="p-4 cursor-pointer hover:shadow-lg transition-shadow"
        :clickable="true"
        :aria-label="`مشاهده جزئیات ${vehicle.model}`"
        @click="emit('view-vehicle', vehicle.id)"
      >
        <!-- wrapper برای یک سطر: اطلاعات و تصویر کنار هم (card-body به‌صورت block است) -->
        <div class="flex flex-row gap-4 items-center w-full">
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-center gap-2">
              <div class="flex items-center gap-2 min-w-0">
                <span
                  class="flex items-center justify-center w-7 h-7 shrink-0 rounded-full bg-gray-100 dark:bg-gray-700"
                  :style="{ color: vehicleIconColor(vehicle) }"
                  :title="hasReminderForVehicle(vehicle.id) ? t('dashboard.activeReminders') : t('dashboard.normal')"
                  aria-hidden="true"
                >
                  <i :class="vehicleIconClass(vehicle)" class="text-sm" aria-hidden="true"></i>
                </span>
                <h4 class="text-lg font-bold text-[#121317] dark:text-white truncate">{{ vehicle.model }}</h4>
              </div>
              <span class="material-symbols-outlined text-gray-300 hover:text-primary shrink-0 pointer-events-none" aria-hidden="true">more_vert</span>
            </div>
            <p class="text-sm text-[#666e85] dark:text-gray-400 mb-2 mt-1">
              {{ vehicle.year }}
              <template v-if="vehicle.plateNumber"> • {{ vehicle.plateNumber }}</template>
            </p>
            <div class="flex items-center gap-2">
              <div class="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-xs font-mono font-bold text-[#121317] dark:text-white" dir="ltr">
                {{ formatNumber(vehicle.currentKm) }} km
              </div>
            </div>
          </div>
          <div class="w-24 h-24 shrink-0 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden flex items-center justify-center">
            <img
              v-if="vehicle.defaultImageUrl"
              :src="vehicle.defaultImageUrl"
              :alt="vehicle.model"
              class="w-full h-full object-cover"
            />
            <span v-else class="material-symbols-outlined text-4xl text-gray-400" aria-hidden="true">directions_car</span>
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
