import { ref, computed, onMounted, onUnmounted } from 'vue'

/**
 * Composable for respecting user's reduced motion preference
 * Detects and respects prefers-reduced-motion media query
 * 
 * @example
 * const { prefersReducedMotion, shouldReduceMotion } = useReducedMotion()
 * if (shouldReduceMotion.value) {
 *   // Use simpler animations
 * }
 */
export function useReducedMotion() {
  const prefersReducedMotion = ref(false)
  let mediaQuery = null

  /**
   * Check if user prefers reduced motion
   * @returns {boolean}
   */
  const checkReducedMotion = () => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return false
    }

    try {
      mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      return mediaQuery.matches
    } catch (error) {
      console.warn('Error checking reduced motion preference:', error)
      return false
    }
  }

  /**
   * Handle media query changes
   */
  const handleChange = (event) => {
    prefersReducedMotion.value = event.matches
  }

  /**
   * Initialize reduced motion detection
   */
  const init = () => {
    prefersReducedMotion.value = checkReducedMotion()

    if (mediaQuery && mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
    } else if (mediaQuery && mediaQuery.addListener) {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange)
    }
  }

  /**
   * Cleanup
   */
  const cleanup = () => {
    if (mediaQuery) {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange)
      } else if (mediaQuery.removeListener) {
        // Fallback for older browsers
        mediaQuery.removeListener(handleChange)
      }
    }
  }

  // Initialize on mount
  onMounted(() => {
    init()
  })

  // Cleanup on unmount
  onUnmounted(() => {
    cleanup()
  })

  // Computed property for easier access
  const shouldReduceMotion = computed(() => prefersReducedMotion.value)

  return {
    prefersReducedMotion,
    shouldReduceMotion,
    checkReducedMotion,
    init,
    cleanup
  }
}

