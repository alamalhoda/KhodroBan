<script setup>
/**
 * فیلتر/انتخاب خودرو با آیکون رنگی کنار هر گزینه در لیست.
 * در همهٔ صفحاتی که فیلتر یا انتخاب خودرو وجود دارد استفاده شود.
 */
import { ref, computed, watch, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useVehicleStore } from '../stores/vehicle'
import { DEFAULT_VEHICLE_ICON, DEFAULT_VEHICLE_ICON_STYLE, DEFAULT_VEHICLE_ICON_COLOR, getEffectiveIconStyle, getVehicleIconDuotoneStyle } from '../config/vehicleIcons'

const props = defineProps({
  /** مقدار انتخاب‌شده: id خودرو یا ''/null برای «همه» */
  modelValue: {
    type: [String, Number],
    default: ''
  },
  /** نمایش گزینه «همه خودروها» */
  showAllOption: {
    type: Boolean,
    default: true
  },
  /** متن گزینه «همه» (وقتی showAllOption=true) */
  allOptionLabel: {
    type: String,
    default: ''
  },
  /** متن وقتی هیچ خودرویی انتخاب نشده و showAllOption=false */
  placeholder: {
    type: String,
    default: ''
  },
  /** پیام خطا (validation) */
  error: {
    type: String,
    default: ''
  },
  /** کلاس اضافی برای wrapper */
  wrapperClass: {
    type: String,
    default: ''
  },
  /** حداقل عرض (مثلاً min-w-[220px]) */
  minWidth: {
    type: String,
    default: 'min-w-[220px]'
  },
  /** غیرفعال */
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const { t } = useI18n()
const vehicleStore = useVehicleStore()

const isOpen = ref(false)
const containerRef = ref(null)

const resolvedAllLabel = computed(() => props.allOptionLabel || t('services.allVehicles'))

const selectedVehicle = computed(() => {
  const id = props.modelValue
  if (id === '' || id == null) return null
  return vehicleStore.vehicles.find(v => String(v.id) === String(id)) || null
})

function vehicleIconClass(vehicle) {
  if (!vehicle) return `fa fa-${getEffectiveIconStyle(DEFAULT_VEHICLE_ICON_STYLE)} fa-${DEFAULT_VEHICLE_ICON}`
  const style = vehicle.iconStyle || DEFAULT_VEHICLE_ICON_STYLE
  const name = vehicle.iconName || DEFAULT_VEHICLE_ICON
  return `fa fa-${getEffectiveIconStyle(style)} fa-${name}`
}

function vehicleIconStyle(vehicle) {
  return getVehicleIconDuotoneStyle(vehicle?.iconColor, vehicle?.iconColorSecondary)
}

function selectValue(value) {
  const id = value === '' || value == null ? '' : String(value)
  emit('update:modelValue', id)
  isOpen.value = false
}

function closeOnClickOutside(event) {
  if (containerRef.value && !containerRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

watch(isOpen, (open) => {
  if (open) {
    requestAnimationFrame(() => document.addEventListener('click', closeOnClickOutside))
  } else {
    document.removeEventListener('click', closeOnClickOutside)
  }
})

onUnmounted(() => {
  document.removeEventListener('click', closeOnClickOutside)
})
</script>

<template>
  <div ref="containerRef" class="relative w-full sm:w-auto" :class="[minWidth, wrapperClass]">
    <button
      type="button"
      class="vehicle-filter-wrap flex items-center gap-2 w-full rounded-xl border-2 ps-2 pe-10 py-2.5 text-start transition-all focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
      :class="[
        error
          ? 'border-red-500 dark:border-red-500 focus:ring-red-500/20'
          : 'border-[#e5e7eb] dark:border-gray-600 bg-white/60 dark:bg-black/20 hover:border-gray-300 dark:hover:border-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20',
        isOpen && 'border-primary ring-2 ring-primary/20'
      ]"
      :aria-expanded="isOpen"
      :aria-haspopup="true"
      :aria-label="resolvedAllLabel"
      :disabled="disabled"
      @click="!disabled && (isOpen = !isOpen)"
    >
      <span class="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-700 shrink-0" aria-hidden="true">
        <i
          v-if="selectedVehicle"
          :class="vehicleIconClass(selectedVehicle)"
          class="text-lg"
          :style="vehicleIconStyle(selectedVehicle)"
        ></i>
        <span v-else class="material-symbols-outlined text-lg text-gray-500">directions_car</span>
      </span>
      <span class="flex-1 min-w-0 truncate text-sm font-medium text-[#121317] dark:text-white">
        <template v-if="selectedVehicle">{{ selectedVehicle.model }} - {{ selectedVehicle.year }}</template>
        <template v-else>{{ showAllOption ? resolvedAllLabel : (placeholder || resolvedAllLabel) }}</template>
      </span>
      <span class="absolute end-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
        <span class="material-symbols-outlined text-[20px]" :class="{ 'rotate-180': isOpen }">expand_more</span>
      </span>
    </button>
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-show="isOpen"
        class="absolute top-full start-0 end-0 z-20 mt-1 py-1 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#1e2330] shadow-lg max-h-64 overflow-y-auto"
        role="listbox"
        :aria-label="resolvedAllLabel"
      >
        <button
          v-if="showAllOption"
          type="button"
          role="option"
          class="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-start hover:bg-gray-100 dark:hover:bg-gray-700/80 transition-colors"
          :class="{ 'bg-primary/10 text-primary dark:bg-primary/20': (modelValue === '' || modelValue == null) }"
          :aria-selected="modelValue === '' || modelValue == null"
          @click="selectValue('')"
        >
          <span class="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 shrink-0">
            <span class="material-symbols-outlined text-base text-gray-500">directions_car</span>
          </span>
          <span>{{ resolvedAllLabel }}</span>
        </button>
        <button
          v-for="v in vehicleStore.vehicles"
          :key="v.id"
          type="button"
          role="option"
          class="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-start hover:bg-gray-100 dark:hover:bg-gray-700/80 transition-colors"
          :class="{ 'bg-primary/10 text-primary dark:bg-primary/20': modelValue === String(v.id) }"
          :aria-selected="modelValue === String(v.id)"
          @click="selectValue(v.id)"
        >
          <span class="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 shrink-0" :style="vehicleIconStyle(v)">
            <i :class="vehicleIconClass(v)" class="text-base" aria-hidden="true"></i>
          </span>
          <span class="truncate">{{ v.model }} - {{ v.year }}</span>
        </button>
      </div>
    </Transition>
    <p v-if="error" class="mt-1 text-xs text-red-500 dark:text-red-400">{{ error }}</p>
  </div>
</template>

<style scoped>
.vehicle-filter-wrap .rotate-180 {
  transform: rotate(180deg);
}
</style>
