<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'btn',
      `btn-${variant}`,
      `btn-${size}`,
      {
        'btn-full': fullWidth,
        'btn-loading': loading,
        'btn-icon-only': icon && !$slots.default
      },
      className
    ]"
    :aria-label="ariaLabel || (icon && !$slots.default ? icon : undefined)"
    :aria-busy="loading"
    @click="handleClick"
  >
    <span v-if="loading" class="btn-spinner" aria-hidden="true">
      <span class="material-symbols-outlined animate-spin">sync</span>
    </span>
    <span v-else-if="icon" class="btn-icon" aria-hidden="true">
      <span class="material-symbols-outlined">{{ icon }}</span>
    </span>
    <span v-if="$slots.default" class="btn-content">
      <slot />
    </span>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'danger', 'warning', 'ghost', 'outline'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  fullWidth: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: ''
  },
  ariaLabel: {
    type: String,
    default: ''
  },
  className: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['click'])

const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  outline: none;
  position: relative;
  white-space: nowrap;
}

.btn:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

/* Sizes */
.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  min-height: 2rem;
}

.btn-md {
  padding: 0.625rem 1.25rem;
  font-size: 0.9375rem;
  min-height: 2.5rem;
}

.btn-lg {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  min-height: 3rem;
}

/* Icon sizes */
.btn-sm .btn-icon .material-symbols-outlined,
.btn-sm .btn-spinner .material-symbols-outlined {
  font-size: 18px;
}

.btn-md .btn-icon .material-symbols-outlined,
.btn-md .btn-spinner .material-symbols-outlined {
  font-size: 20px;
}

.btn-lg .btn-icon .material-symbols-outlined,
.btn-lg .btn-spinner .material-symbols-outlined {
  font-size: 24px;
}

/* Icon only button */
.btn-icon-only {
  aspect-ratio: 1;
  padding: 0.625rem;
}

.btn-icon-only.btn-sm {
  padding: 0.5rem;
}

.btn-icon-only.btn-lg {
  padding: 0.75rem;
}

/* Variants */
.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-primary:active:not(:disabled) {
  background: #1d4ed8;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #4b5563;
}

.btn-success {
  background: #10b981;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #059669;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
}

.btn-warning {
  background: #f59e0b;
  color: white;
}

.btn-warning:hover:not(:disabled) {
  background: #d97706;
}

.btn-ghost {
  background: transparent;
  color: #6b7280;
}

.btn-ghost:hover:not(:disabled) {
  background: rgba(107, 114, 128, 0.1);
}

.btn-outline {
  background: transparent;
  color: #3b82f6;
  border: 2px solid #3b82f6;
}

.btn-outline:hover:not(:disabled) {
  background: #3b82f6;
  color: white;
}

/* Full width */
.btn-full {
  width: 100%;
}

/* Loading state */
.btn-loading {
  cursor: wait;
}

.btn-spinner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Dark mode */
.dark .btn-primary {
  background: #2563eb;
}

.dark .btn-primary:hover:not(:disabled) {
  background: #1d4ed8;
}

.dark .btn-secondary {
  background: #4b5563;
}

.dark .btn-secondary:hover:not(:disabled) {
  background: #374151;
}

.dark .btn-ghost {
  color: #9ca3af;
}

.dark .btn-ghost:hover:not(:disabled) {
  background: rgba(156, 163, 175, 0.1);
}

.dark .btn-outline {
  color: #60a5fa;
  border-color: #60a5fa;
}

.dark .btn-outline:hover:not(:disabled) {
  background: #60a5fa;
  color: white;
}
</style>

