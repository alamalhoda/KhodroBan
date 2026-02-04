<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="modal-overlay"
        :class="{ 'modal-overlay-blur': blur }"
        role="dialog"
        :aria-modal="true"
        :aria-labelledby="titleId"
        :aria-describedby="descriptionId"
        @click.self="handleOverlayClick"
        @keydown.esc="handleEscape"
      >
        <div
          ref="trapRef"
          :class="['modal', `modal-${size}`, className]"
          :role="role"
          @click.stop
        >
          <header v-if="title || $slots.header || showClose" class="modal-header">
            <slot name="header">
              <h2 v-if="title" :id="titleId" class="modal-title">{{ title }}</h2>
              <button
                v-if="showClose"
                type="button"
                class="modal-close"
                :aria-label="$t('common.close')"
                @click="handleClose"
              >
                <span class="material-symbols-outlined">close</span>
              </button>
            </slot>
          </header>
          
          <div :id="descriptionId" class="modal-body">
            <slot />
          </div>
          
          <footer v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFocusTrap, useFocus, useKeyboardNavigation } from '@/composables'

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl', 'full'].includes(value)
  },
  showClose: {
    type: Boolean,
    default: true
  },
  closeOnOverlay: {
    type: Boolean,
    default: true
  },
  closeOnEscape: {
    type: Boolean,
    default: true
  },
  blur: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    default: 'dialog'
  },
  className: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:open', 'close'])

const { t } = useI18n()

// Accessibility composables
const { trapRef, activate, deactivate } = useFocusTrap()
const { focusFirst } = useFocus()
const { onKeyPress } = useKeyboardNavigation()

const titleId = computed(() => `modal-title-${Math.random().toString(36).substr(2, 9)}`)
const descriptionId = computed(() => `modal-description-${Math.random().toString(36).substr(2, 9)}`)

const handleClose = () => {
  emit('update:open', false)
  emit('close')
}

const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    handleClose()
  }
}

const handleEscape = (event) => {
  if (props.closeOnEscape && event.key === 'Escape') {
    handleClose()
  }
}

// Lock body scroll when modal is open and manage focus trap
watch(() => props.open, async (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
    // Activate focus trap and focus first element
    await nextTick()
    activate()
    focusFirst(trapRef.value)
  } else {
    document.body.style.overflow = ''
    deactivate()
  }
})

// Handle Escape key with composable
onKeyPress('Escape', () => {
  if (props.open && props.closeOnEscape) {
    handleClose()
  }
}, { preventDefault: true })

// Cleanup on unmount
onUnmounted(() => {
  document.body.style.overflow = ''
  deactivate()
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9998;
  padding: 1rem;
  overflow-y: auto;
}

.modal-overlay-blur {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.modal {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  width: 100%;
  margin: auto;
  overflow: hidden;
}

.dark .modal {
  background: #1e293b;
  color: #f3f4f6;
}

/* Sizes */
.modal-sm {
  max-width: 24rem;
}

.modal-md {
  max-width: 32rem;
}

.modal-lg {
  max-width: 48rem;
}

.modal-xl {
  max-width: 64rem;
}

.modal-full {
  max-width: 100%;
  max-height: 100%;
  border-radius: 0;
}

/* Header */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.dark .modal-header {
  border-bottom-color: #374151;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #121317;
  margin: 0;
}

.dark .modal-title {
  color: #f3f4f6;
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  background: transparent;
  color: #6b7280;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
}

.modal-close:hover {
  background: #f3f4f6;
  color: #121317;
}

.dark .modal-close:hover {
  background: #374151;
  color: #f3f4f6;
}

.modal-close:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.modal-close .material-symbols-outlined {
  font-size: 20px;
}

/* Body */
.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

/* Footer */
.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.dark .modal-footer {
  border-top-color: #374151;
}

[dir='rtl'] .modal-footer {
  justify-content: flex-start;
}

/* Animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal,
.modal-leave-active .modal {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal,
.modal-leave-to .modal {
  transform: scale(0.95) translateY(-20px);
  opacity: 0;
}

/* Responsive */
@media (max-width: 640px) {
  .modal {
    max-width: 100%;
    max-height: 100%;
    border-radius: 0;
    margin: 0;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1rem;
  }
}
</style>

