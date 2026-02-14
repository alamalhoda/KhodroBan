<!--
  فوتر انتخاب نوع سرویس: تعداد انتخاب‌شده و دکمه‌های انصراف / ادامه
-->
<script setup>
import { useI18n } from 'vue-i18n'

defineProps({
  /** متن خلاصه انتخاب‌ها (مثلاً "۳ مورد انتخاب شده") */
  selectedServicesText: { type: String, default: '' },
  /** آیا حداقل یک مورد انتخاب شده */
  hasSelectedServices: { type: Boolean, default: false }
})

const emit = defineEmits(['confirm', 'cancel'])
const { t } = useI18n()
</script>

<template>
  <div class="bg-gray-50 dark:bg-gray-800/50 p-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-gray-100 dark:border-gray-800">
    <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      <span class="font-medium text-gray-900 dark:text-white">{{ t('services.selectType.selected') }}:</span>
      <span>{{ selectedServicesText || t('services.selectType.noSelection') }}</span>
    </div>
    <div class="flex gap-3 w-full sm:w-auto">
      <button
        type="button"
        class="flex-1 sm:flex-none px-6 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-white dark:hover:bg-gray-700 transition-colors"
        :aria-label="t('services.selectType.back')"
        @click="emit('cancel')"
      >
        {{ t('services.selectType.back') }}
      </button>
      <button
        type="button"
        class="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-primary hover:bg-blue-800 text-white font-medium shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="!hasSelectedServices"
        :aria-label="t('services.selectType.continue')"
        @click="emit('confirm')"
      >
        <span>{{ t('services.selectType.continue') }}</span>
        <span class="material-symbols-outlined text-lg rtl:rotate-180" aria-hidden="true">arrow_back</span>
      </button>
    </div>
  </div>
</template>
