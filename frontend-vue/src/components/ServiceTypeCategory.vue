<!--
  یک دسته‌بندی قابل گسترش در انتخاب نوع سرویس (آیکون، عنوان، لیست سرویس‌ها با چک‌باکس)
-->
<script setup>
import { useI18n } from 'vue-i18n'

const props = defineProps({
  /** دسته‌بندی (id, title, icon, color, services[]) */
  category: { type: Object, required: true },
  /** آیا دسته باز است */
  isExpanded: { type: Boolean, default: false },
  /** آرایه موارد انتخاب‌شده { id, title } */
  selectedServiceTypes: { type: Array, default: () => [] }
})

const emit = defineEmits(['toggle', 'select-service'])
const { t } = useI18n()

const getColorClasses = (color) => {
  const colorMap = {
    orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    slate: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    teal: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400'
  }
  return colorMap[color] || colorMap.blue
}

const isServiceSelected = (serviceId, serviceTitle) => {
  return props.selectedServiceTypes.some(
    (s) => s.id === serviceId && s.title === serviceTitle
  )
}

const handleToggle = () => {
  emit('toggle', props.category.id)
}

const handleSelectService = (serviceId, serviceTitle) => {
  emit('select-service', { id: serviceId, title: serviceTitle })
}
</script>

<template>
  <div
    class="border-b border-gray-100 dark:border-gray-800 last:border-b-0"
  >
    <button
      type="button"
      class="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group text-right"
      :aria-expanded="isExpanded"
      :aria-controls="`category-${category.id}`"
      :id="`category-btn-${category.id}`"
      @click="handleToggle"
    >
      <div class="flex items-center gap-4">
        <div
          :class="[
            'size-12 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform',
            getColorClasses(category.color)
          ]"
        >
          <span class="material-symbols-outlined text-2xl" aria-hidden="true">{{ category.icon }}</span>
        </div>
        <div class="flex flex-col gap-0.5">
          <h3 class="font-bold text-gray-900 dark:text-white text-base group-hover:text-primary transition-colors">
            {{ category.title }}
          </h3>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ category.services.length }} {{ t('services.selectType.servicesAvailable', 'سرویس موجود') }}
          </p>
        </div>
      </div>
      <span class="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors" aria-hidden="true">
        {{ isExpanded ? 'expand_less' : 'expand_more' }}
      </span>
    </button>
    <div
      v-if="isExpanded"
      :id="`category-${category.id}`"
      role="region"
      :aria-labelledby="`category-btn-${category.id}`"
      class="bg-gray-50/50 dark:bg-gray-900/30 px-4 pb-4 pt-1"
    >
      <div class="flex flex-col gap-2 border-r-2 border-gray-200 dark:border-gray-700 mr-6 pr-4 py-2">
        <label
          v-for="service in category.services"
          :key="`${category.id}-${service.id}-${service.title}`"
          class="relative flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all hover:shadow-sm"
          :class="
            isServiceSelected(service.id, service.title)
              ? 'bg-white dark:bg-gray-800 border-2 border-primary/20 dark:border-primary/40 shadow-sm'
              : 'bg-white dark:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-700'
          "
        >
          <div class="flex items-center gap-3">
            <div class="relative flex items-center">
              <input
                :checked="isServiceSelected(service.id, service.title)"
                class="peer h-5 w-5 border-gray-300 text-primary focus:ring-primary"
                type="checkbox"
                :aria-label="service.title"
                @click.stop
                @change="handleSelectService(service.id, service.title)"
              />
            </div>
            <div class="flex flex-col">
              <span class="text-sm font-bold text-gray-900 dark:text-white">{{ service.title }}</span>
              <span class="text-xs text-gray-500 dark:text-gray-400">{{ service.description }}</span>
            </div>
          </div>
          <span
            v-if="isServiceSelected(service.id, service.title)"
            class="text-xs font-bold text-primary dark:text-blue-400 bg-primary/10 px-2 py-1 rounded-md"
          >
            {{ t('common.selected', 'انتخاب شده') }}
          </span>
        </label>
      </div>
    </div>
  </div>
</template>
