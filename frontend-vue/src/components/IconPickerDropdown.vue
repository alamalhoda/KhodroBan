<script setup>
/**
 * Dropdown انتخاب آیکون با جستجو؛ لیست کامل آیکون‌های Font Awesome را نمایش می‌دهد.
 */
import { ref, computed, watch, onUnmounted } from 'vue'
import { getEffectiveIconStyle, getVehicleIconDuotoneStyle } from '../config/vehicleIcons'

const props = defineProps({
  modelValue: { type: String, default: '' },
  iconNames: { type: Array, required: true },
  /** آیکون‌هایی که در ابتدای لیست نمایش داده شوند (مثلاً automotive). ترتیب آرایه حفظ می‌شود. */
  preferredIconNames: { type: Array, default: () => [] },
  iconStyle: { type: String, default: 'duotone' },
  iconColor: { type: String, default: '#6b7280' },
  iconColorSecondary: { type: String, default: '#9ca3af' },
  placeholderLabel: { type: String, default: 'آیکون خودرو' },
  searchPlaceholder: { type: String, default: 'جستجوی آیکون...' },
  noResultsLabel: { type: String, default: 'آیکونی یافت نشد.' }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const searchQuery = ref('')

const effectiveStyle = computed(() => getEffectiveIconStyle(props.iconStyle))
const iconDuotoneStyle = computed(() =>
  getVehicleIconDuotoneStyle(props.iconColor, props.iconColorSecondary)
)

const filteredIcons = computed(() => {
  const q = (searchQuery.value || '').trim().toLowerCase()
  let list = q
    ? props.iconNames.filter((name) => (name || '').toLowerCase().includes(q))
    : [...props.iconNames]

  const preferred = props.preferredIconNames?.filter(Boolean) || []
  if (preferred.length === 0) return list

  const preferredSet = new Set(preferred)
  const inPreferred = list.filter((name) => preferredSet.has(name))
  const rest = list.filter((name) => !preferredSet.has(name))
  const orderOfPreferred = new Map(preferred.map((name, i) => [name, i]))
  inPreferred.sort((a, b) => (orderOfPreferred.get(a) ?? 0) - (orderOfPreferred.get(b) ?? 0))
  rest.sort((a, b) => a.localeCompare(b, 'en'))
  return [...inPreferred, ...rest]
})

const rootRef = ref(null)

function select(name) {
  emit('update:modelValue', name)
  isOpen.value = false
}

function handleClickOutside(event) {
  if (!rootRef.value || !rootRef.value.contains(event.target)) isOpen.value = false
}

watch(isOpen, (open) => {
  if (!open) {
    searchQuery.value = ''
    document.removeEventListener('click', handleClickOutside)
  } else {
    setTimeout(() => document.addEventListener('click', handleClickOutside), 0)
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="rootRef" class="icon-picker-dropdown relative">
    <button
      type="button"
      class="w-full rounded-xl border border-[#dcdfe4] dark:border-gray-600 bg-white dark:bg-gray-800 h-12 px-4 flex items-center gap-3 focus:border-primary focus:ring-1 focus:ring-primary transition-shadow text-left"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      :aria-label="placeholderLabel"
      @click="isOpen = !isOpen"
    >
      <span
        v-if="modelValue"
        class="w-9 h-9 shrink-0 rounded-lg border-2 border-primary/30 bg-primary/5 flex items-center justify-center"
        :style="iconDuotoneStyle"
      >
        <i :class="['fa', 'fa-' + effectiveStyle, 'fa-' + modelValue]" class="fa-fw text-lg" aria-hidden="true"></i>
      </span>
      <span v-else class="w-9 h-9 shrink-0 rounded-lg border border-dashed border-gray-400 dark:border-gray-500 flex items-center justify-center text-gray-400">
        <span class="material-symbols-outlined text-[20px]">image</span>
      </span>
      <span class="flex-1 truncate text-sm text-[#121317] dark:text-white">
        {{ modelValue || placeholderLabel }}
      </span>
      <span class="material-symbols-outlined text-gray-400 text-[20px] transition-transform" :class="{ 'rotate-180': isOpen }">expand_more</span>
    </button>

    <div
      v-show="isOpen"
      role="listbox"
      class="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1A202C] shadow-lg overflow-hidden"
      :aria-label="placeholderLabel"
    >
      <div class="p-2 border-b border-gray-200 dark:border-gray-700">
        <div class="relative">
          <span class="material-symbols-outlined absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]" aria-hidden="true">search</span>
          <input
            v-model.trim="searchQuery"
            type="search"
            class="w-full rounded-lg border border-[#dcdfe4] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#121317] dark:text-white h-9 ps-9 pe-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
            :placeholder="searchPlaceholder"
            :aria-label="searchPlaceholder"
            autocomplete="off"
          />
        </div>
      </div>
      <div class="icon-picker-grid max-h-64 overflow-y-auto overflow-x-hidden p-2" role="group">
        <template v-if="filteredIcons.length">
          <button
            v-for="name in filteredIcons"
            :key="name"
            type="button"
            role="option"
            :aria-selected="modelValue === name"
            :class="[
              'w-10 h-10 shrink-0 rounded-lg border-2 flex items-center justify-center transition-colors',
              modelValue === name
                ? 'border-primary bg-primary/10'
                : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
            ]"
            :style="modelValue === name ? iconDuotoneStyle : undefined"
            :title="name"
            @click="select(name)"
          >
            <i :class="['fa', 'fa-' + effectiveStyle, 'fa-' + name]" class="fa-fw text-base" aria-hidden="true"></i>
          </button>
        </template>
        <p v-else class="text-gray-500 dark:text-gray-400 text-sm py-4 text-center" role="status">
          {{ noResultsLabel }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* گرید آیکون‌ها: چند ستون در هر سطر بدون اسکرول افقی */
.icon-picker-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(2.5rem, 1fr));
  gap: 0.25rem;
}
</style>
