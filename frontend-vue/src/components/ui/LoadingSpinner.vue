<template>
  <div
    :class="['loading-spinner', `loading-spinner-${size}`, className]"
    :role="role"
    :aria-label="ariaLabel || $t('common.loading')"
    :aria-busy="true"
  >
    <span class="spinner-circle" aria-hidden="true"></span>
    <span v-if="showText" class="spinner-text">{{ text || $t('common.loading') }}</span>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  text: {
    type: String,
    default: ''
  },
  showText: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    default: 'status'
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

const { t } = useI18n()
</script>

<style scoped>
.loading-spinner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.loading-spinner-sm {
  gap: 0.5rem;
}

.loading-spinner-lg {
  gap: 1rem;
}

.spinner-circle {
  display: inline-block;
  border: 3px solid rgba(59, 130, 246, 0.2);
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loading-spinner-sm .spinner-circle {
  width: 1rem;
  height: 1rem;
  border-width: 2px;
}

.loading-spinner-md .spinner-circle {
  width: 1.5rem;
  height: 1.5rem;
  border-width: 3px;
}

.loading-spinner-lg .spinner-circle {
  width: 2rem;
  height: 2rem;
  border-width: 4px;
}

.spinner-text {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.dark .spinner-text {
  color: #9ca3af;
}

.loading-spinner-sm .spinner-text {
  font-size: 0.75rem;
}

.loading-spinner-lg .spinner-text {
  font-size: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

