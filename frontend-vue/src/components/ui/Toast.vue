<template>
  <Transition
    :name="transitionName"
    @enter="onEnter"
    @leave="onLeave"
  >
    <div
      v-if="visible"
      :class="[
        'toast',
        `toast-${type}`,
        { 'toast-rtl': isRTL }
      ]"
      role="alert"
      :aria-live="type === 'error' ? 'assertive' : 'polite'"
      :aria-atomic="true"
    >
      <div class="toast-content">
        <span class="toast-icon" :aria-hidden="true">
          <span class="material-symbols-outlined">{{ icon }}</span>
        </span>
        <span class="toast-message">{{ message }}</span>
        <button
          class="toast-close"
          @click="handleClose"
          :aria-label="$t('common.close')"
          type="button"
        >
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <div
        v-if="showProgress"
        class="toast-progress"
        :style="{ animationDuration: `${duration}ms` }"
      ></div>
    </div>
  </Transition>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  duration: {
    type: Number,
    default: 5000
  },
  visible: {
    type: Boolean,
    default: true
  },
  showProgress: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close'])

const { locale } = useI18n()

const isRTL = computed(() => locale.value === 'fa' || locale.value === 'ar')

const icons = {
  success: 'check_circle',
  error: 'error',
  warning: 'warning',
  info: 'info'
}

const icon = computed(() => icons[props.type] || icons.info)

const transitionName = computed(() => {
  return isRTL.value ? 'toast-slide-rtl' : 'toast-slide-ltr'
})

const handleClose = () => {
  emit('close', props.id)
}

const onEnter = (el) => {
  // Trigger animation
  requestAnimationFrame(() => {
    el.style.opacity = '1'
    el.style.transform = 'translateY(0)'
  })
}

const onLeave = (el) => {
  el.style.opacity = '0'
  el.style.transform = isRTL.value 
    ? 'translateX(100%)' 
    : 'translateX(-100%)'
}
</script>

<style scoped>
.toast {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 300px;
  max-width: 500px;
  padding: 1rem 1.25rem;
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  overflow: hidden;
  margin-bottom: 0.75rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
  z-index: 1;
}

.toast-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
}

.toast-icon .material-symbols-outlined {
  font-size: 18px;
  line-height: 1;
}

.toast-message {
  flex: 1;
  font-size: 0.9375rem;
  line-height: 1.5;
  font-weight: 500;
}

.toast-close {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: inherit;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.2s ease;
  padding: 0;
}

.toast-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.toast-close:focus {
  outline: 2px solid rgba(255, 255, 255, 0.5);
  outline-offset: 2px;
}

.toast-close .material-symbols-outlined {
  font-size: 18px;
  line-height: 1;
}

.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
  transform-origin: left;
  animation: toast-progress linear forwards;
}

.toast-rtl .toast-progress {
  transform-origin: right;
}

/* Toast Types */
.toast-success {
  background: rgba(16, 185, 129, 0.95);
  color: white;
}

.toast-error {
  background: rgba(239, 68, 68, 0.95);
  color: white;
}

.toast-warning {
  background: rgba(245, 158, 11, 0.95);
  color: white;
}

.toast-info {
  background: rgba(59, 130, 246, 0.95);
  color: white;
}

/* Dark Mode */
.dark .toast-success {
  background: rgba(16, 185, 129, 0.9);
}

.dark .toast-error {
  background: rgba(239, 68, 68, 0.9);
}

.dark .toast-warning {
  background: rgba(245, 158, 11, 0.9);
}

.dark .toast-info {
  background: rgba(59, 130, 246, 0.9);
}

/* Animations */
.toast-slide-ltr-enter-active,
.toast-slide-ltr-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-slide-ltr-enter-from {
  opacity: 0;
  transform: translateX(-100%);
}

.toast-slide-ltr-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

.toast-slide-rtl-enter-active,
.toast-slide-rtl-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-slide-rtl-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-slide-rtl-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

@keyframes toast-progress {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}

/* Responsive */
@media (max-width: 640px) {
  .toast {
    min-width: auto;
    max-width: calc(100vw - 2rem);
    padding: 0.875rem 1rem;
  }
  
  .toast-message {
    font-size: 0.875rem;
  }
}
</style>

