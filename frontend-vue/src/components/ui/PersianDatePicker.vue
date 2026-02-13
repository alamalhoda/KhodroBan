<!--
  انتخابگر تاریخ شمسی برای فرم‌ها — v-model به صورت YYYY/MM/DD (سازگار با backend)
-->
<script setup>
import { computed } from 'vue'
import DatePicker from 'vue3-persian-datepicker'

const props = defineProps({
  /** مقدار تاریخ — رشته شمسی YYYY/MM/DD */
  modelValue: { type: String, default: '' },
  /** برچسب فیلد (مثل Input) */
  label: { type: String, default: '' },
  /** پیام خطا */
  error: { type: String, default: '' },
  /** placeholder */
  placeholder: { type: String, default: '۱۴۰۳/۰۱/۰۱' },
  /** نمایش همیشه باز (inline) */
  inline: { type: Boolean, default: false },
  /** فرمت نمایش/ورودی — پیش‌فرض YYYY/MM/DD */
  format: { type: String, default: 'YYYY/MM/DD' },
  /** اجباری (نمایش ستاره) */
  required: { type: Boolean, default: false },
  /** نام input */
  name: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])

const inputId = computed(() => `persian-datepicker-${Math.random().toString(36).slice(2, 9)}`)

function onInput(value) {
  emit('update:modelValue', value || '')
}
</script>

<template>
  <div class="persian-datepicker-wrapper" :class="{ 'has-error': error }">
    <label
      v-if="label"
      :for="inputId"
      class="persian-datepicker-label"
      :class="{ 'persian-datepicker-label-required': required }"
    >
      {{ label }}
      <span v-if="required" class="required-mark" aria-hidden="true">*</span>
    </label>
    <div class="persian-datepicker-container">
      <DatePicker
        :key="modelValue || 'empty'"
        :id="inputId"
        :modelValue="modelValue"
        :name="name"
        :placeholder="placeholder"
        :format="format"
        :inline="inline"
        class="persian-datepicker-input"
        @update:model-value="onInput"
      />
    </div>
    <p v-if="error" :id="`${inputId}-error`" class="persian-datepicker-error" role="alert">
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
.persian-datepicker-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  width: 100%;
}
.persian-datepicker-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-main, #121317);
}
.persian-datepicker-label-required .required-mark {
  color: var(--color-danger, #dc2626);
}
.persian-datepicker-container {
  width: 100%;
}
.persian-datepicker-error {
  font-size: 0.75rem;
  color: var(--color-danger, #dc2626);
}
.persian-datepicker-wrapper :deep(.datePicker) {
  width: 100%;
}
.persian-datepicker-wrapper :deep(.datePicker input) {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 0.5rem;
  font-size: 1rem;
  font-family: inherit;
  background: var(--color-background-light, #fff);
  color: var(--color-text-main, #121317);
}
.persian-datepicker-wrapper.has-error :deep(.datePicker input) {
  border-color: var(--color-danger, #dc2626);
}
.persian-datepicker-wrapper :deep(.datePicker .datePicker--active),
.persian-datepicker-wrapper :deep(.datePicker table tr td.datePicker__td--active) {
  background-color: var(--color-primary, #1e3b8a) !important;
}
.persian-datepicker-wrapper :deep(.datePicker .datePicker__button button) {
  background-color: var(--color-primary, #1e3b8a) !important;
}
</style>
