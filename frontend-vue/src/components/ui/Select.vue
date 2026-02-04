<template>
  <div class="select-wrapper" :class="wrapperClass">
    <label
      v-if="label"
      :for="selectId"
      class="select-label"
      :class="{ 'select-label-required': required }"
    >
      {{ label }}
      <span v-if="required" class="select-required-mark" aria-label="required">*</span>
    </label>
    
    <div class="select-container" :class="{ 'select-error': error, 'select-disabled': disabled }">
      <select
        :id="selectId"
        :name="name"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        :class="[
          'select',
          {
            'select-error': error,
            'select-disabled': disabled
          },
          selectClass
        ]"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined"
        @change="handleChange"
        @blur="handleBlur"
        @focus="handleFocus"
      >
        <option v-if="placeholder" value="" disabled>
          {{ placeholder }}
        </option>
        <option
          v-for="option in options"
          :key="getOptionValue(option)"
          :value="getOptionValue(option)"
        >
          {{ getOptionLabel(option) }}
        </option>
      </select>
      
      <span class="select-icon" aria-hidden="true">
        <span class="material-symbols-outlined">expand_more</span>
      </span>
    </div>
    
    <div v-if="hint && !error" :id="`${selectId}-hint`" class="select-hint">
      {{ hint }}
    </div>
    
    <div
      v-if="error"
      :id="`${selectId}-error`"
      class="select-error-message"
      role="alert"
      aria-live="polite"
    >
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  options: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(option => {
        if (typeof option === 'string') return true
        if (typeof option === 'object') {
          return 'value' in option && 'label' in option
        }
        return false
      })
    }
  },
  placeholder: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  wrapperClass: {
    type: String,
    default: ''
  },
  selectClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'blur', 'focus'])

const selectId = computed(() => {
  return props.name || `select-${Math.random().toString(36).substr(2, 9)}`
})

const getOptionValue = (option) => {
  if (typeof option === 'string') {
    return option
  }
  return option.value
}

const getOptionLabel = (option) => {
  if (typeof option === 'string') {
    return option
  }
  return option.label
}

const handleChange = (event) => {
  const value = event.target.value
  emit('update:modelValue', value)
  emit('change', value)
}

const handleBlur = (event) => {
  emit('blur', event)
}

const handleFocus = (event) => {
  emit('focus', event)
}
</script>

<style scoped>
.select-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.select-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #121317;
  margin-bottom: 0.25rem;
}

.dark .select-label {
  color: #f3f4f6;
}

.select-label-required {
  position: relative;
}

.select-required-mark {
  color: #ef4444;
  margin-left: 0.25rem;
}

.select-container {
  position: relative;
  display: flex;
  align-items: center;
}

.select {
  width: 100%;
  padding: 0.75rem 2.75rem 0.75rem 1rem;
  font-size: 0.9375rem;
  font-weight: 500;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.6);
  color: #121317;
  transition: all 0.2s ease;
  outline: none;
  appearance: none;
  cursor: pointer;
}

.dark .select {
  background: rgba(0, 0, 0, 0.2);
  border-color: #374151;
  color: #f3f4f6;
}

.select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.select:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #f3f4f6;
}

.dark .select:disabled {
  background: rgba(0, 0, 0, 0.1);
}

.select-icon {
  position: absolute;
  right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  pointer-events: none;
  z-index: 1;
}

.select-icon .material-symbols-outlined {
  font-size: 20px;
  transition: transform 0.2s ease;
}

.select:focus ~ .select-icon {
  color: #3b82f6;
}

.select-error {
  border-color: #ef4444;
}

.select-error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
}

.select-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.select-hint {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: -0.25rem;
}

.dark .select-hint {
  color: #9ca3af;
}

.select-error-message {
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: -0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.select-error-message::before {
  content: '⚠';
  font-size: 0.875rem;
}

/* RTL Support */
[dir='rtl'] .select {
  padding-right: 1rem;
  padding-left: 2.75rem;
}

[dir='rtl'] .select-icon {
  right: auto;
  left: 1rem;
}
</style>

