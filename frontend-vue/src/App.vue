<template>
  <router-view />
  <ToastContainer />
</template>

<script setup>
import { onMounted } from 'vue'
import ToastContainer from './components/ui/ToastContainer.vue'
import { useSkipLink, useReducedMotion } from './composables'

// Initialize skip links for accessibility
const { addDefaultSkipLinks } = useSkipLink()

// Respect user's reduced motion preference
const { shouldReduceMotion } = useReducedMotion()

// Add skip links on mount
onMounted(() => {
  addDefaultSkipLinks()
  
  // Apply reduced motion class to body if needed
  if (shouldReduceMotion.value) {
    document.body.classList.add('reduce-motion')
  }
})
</script>

<style>
/* Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

.reduce-motion *,
.reduce-motion *::before,
.reduce-motion *::after {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
  scroll-behavior: auto !important;
}
</style>
