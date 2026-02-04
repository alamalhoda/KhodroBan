<template>
  <Teleport to="body">
    <div
      :class="[
        'toast-container',
        { 'toast-container-rtl': isRTL }
      ]"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      <TransitionGroup
        :name="transitionGroupName"
        tag="div"
        class="toast-list"
      >
        <Toast
          v-for="toast in activeToasts"
          :key="toast.id"
          :id="toast.id"
          :message="toast.message"
          :type="toast.type"
          :duration="toast.duration"
          :visible="toast.visible"
          :show-progress="toast.showProgress !== false"
          @close="handleClose"
        />
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUIStore } from '@/stores/ui'
import Toast from './Toast.vue'

const { locale } = useI18n()
const uiStore = useUIStore()

const isRTL = computed(() => locale.value === 'fa' || locale.value === 'ar')

const activeToasts = computed(() => uiStore.activeToasts)

const transitionGroupName = computed(() => {
  return isRTL.value ? 'toast-group-rtl' : 'toast-group-ltr'
})

const handleClose = (id) => {
  uiStore.hideToast(id)
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  pointer-events: none;
  max-width: 100%;
  padding: 0 1rem;
}

.toast-container-rtl {
  direction: rtl;
}

.toast-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  pointer-events: none;
}

.toast-list > * {
  pointer-events: auto;
}

/* Transition Group Animations */
.toast-group-ltr-move,
.toast-group-ltr-enter-active,
.toast-group-ltr-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-group-ltr-enter-from {
  opacity: 0;
  transform: translateX(-100%) translateY(-20px);
}

.toast-group-ltr-leave-to {
  opacity: 0;
  transform: translateX(-100%) translateY(-20px);
}

.toast-group-ltr-leave-active {
  position: absolute;
  width: 100%;
}

.toast-group-rtl-move,
.toast-group-rtl-enter-active,
.toast-group-rtl-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-group-rtl-enter-from {
  opacity: 0;
  transform: translateX(100%) translateY(-20px);
}

.toast-group-rtl-leave-to {
  opacity: 0;
  transform: translateX(100%) translateY(-20px);
}

.toast-group-rtl-leave-active {
  position: absolute;
  width: 100%;
}

/* Responsive */
@media (max-width: 640px) {
  .toast-container {
    top: 1rem;
    left: 1rem;
    right: 1rem;
    transform: none;
    padding: 0;
  }
  
  .toast-list {
    align-items: stretch;
  }
}
</style>

