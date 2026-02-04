<template>
  <div class="input-wrapper" :class="wrapperClass">
    <label
      v-if="label"
      :for="inputId"
      class="input-label"
      :class="{ 'input-label-required': required }"
    >
      {{ label }}
      <span v-if="required" class="input-required-mark" aria-label="required">*</span>
    </label>
    
    <div class="input-container" :class="{ 'input-error': error, 'input-disabled': disabled }">
      <span
        v-if="icon"
        class="input-icon"
        :aria-hidden="true"
      >
        <span class="material-symbols-outlined">{{ icon }}</span>
      </span>
      
      <input
        :id="inputId"
        :name="name"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :readonly="readonly"
        :min="min"
        :max="max"
        :minlength="minLength"
        :maxlength="maxLength"
        :pattern="pattern"
        :autocomplete="autocomplete"
        :dir="dir"
        :class="[
          'input',
          {
            'input-with-icon': icon,
            'input-error': error,
            'input-disabled': disabled
          },
          inputClass
        ]"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      
      <button
        v-if="clearable && modelValue && !disabled"
        type="button"
        class="input-clear"
        :aria-label="$t('common.close')"
        @click="handleClear"
      >
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>
    
    <div v-if="hint && !error" :id="`${inputId}-hint`" class="input-hint">
      {{ hint }}
    </div>
    
    <div
      v-if="error"
      :id="`${inputId}-error`"
      class="input-error-message"
      role="alert"
      aria-live="polite"
    >
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

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
  type: {
    type: String,
    default: 'text'
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
  readonly: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: ''
  },
  clearable: {
    type: Boolean,
    default: false
  },
  min: {
    type: [String, Number],
    default: undefined
  },
  max: {
    type: [String, Number],
    default: undefined
  },
  minLength: {
    type: Number,
    default: undefined
  },
  maxLength: {
    type: Number,
    default: undefined
  },
  pattern: {
    type: String,
    default: undefined
  },
  autocomplete: {
    type: String,
    default: undefined
  },
  dir: {
    type: String,
    default: undefined
  },
  wrapperClass: {
    type: String,
    default: ''
  },
  inputClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus', 'clear'])

const { t } = useI18n()

const inputId = computed(() => {
  return props.name || `input-${Math.random().toString(36).substr(2, 9)}`
})

const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
}

const handleBlur = (event) => {
  emit('blur', event)
}

const handleFocus = (event) => {
  emit('focus', event)
}

const handleClear = () => {
  emit('update:modelValue', '')
  emit('clear')
}
</script>

<style scoped>
.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.input-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #121317;
  margin-bottom: 0.25rem;
}

.dark .input-label {
  color: #f3f4f6;
}

.input-label-required {
  position: relative;
}

.input-required-mark {
  color: #ef4444;
  margin-left: 0.25rem;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.9375rem;
  font-weight: 500;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.6);
  color: #121317;
  transition: all 0.2s ease;
  outline: none;
}

.dark .input {
  background: rgba(0, 0, 0, 0.2);
  border-color: #374151;
  color: #f3f4f6;
}

.input::placeholder {
  color: #9ca3af;
}

.dark .input::placeholder {
  color: #6b7280;
}

.input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.input-with-icon {
  padding-right: 2.75rem;
}

.input-icon {
  position: absolute;
  right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  pointer-events: none;
  z-index: 1;
}

.input-icon .material-symbols-outlined {
  font-size: 20px;
}

.input:focus ~ .input-icon {
  color: #3b82f6;
}

.input-clear {
  position: absolute;
  left: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border: none;
  background: rgba(107, 114, 128, 0.1);
  color: #6b7280;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
}

.input-clear:hover {
  background: rgba(107, 114, 128, 0.2);
  color: #374151;
}

.input-clear .material-symbols-outlined {
  font-size: 18px;
}

.input-error {
  border-color: #ef4444;
}

.input-error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
}

.input-disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #f3f4f6;
}

.dark .input-disabled {
  background: rgba(0, 0, 0, 0.1);
}

.input-disabled .input {
  cursor: not-allowed;
}

.input-hint {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: -0.25rem;
}

.dark .input-hint {
  color: #9ca3af;
}

.input-error-message {
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: -0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.input-error-message::before {
  content: '⚠';
  font-size: 0.875rem;
}

/* RTL Support */
[dir='rtl'] .input-with-icon {
  padding-right: 1rem;
  padding-left: 2.75rem;
}

[dir='rtl'] .input-icon {
  right: auto;
  left: 1rem;
}

[dir='rtl'] .input-clear {
  left: auto;
  right: 0.75rem;
}
</style>

