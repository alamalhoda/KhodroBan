import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'

/**
 * Composable for trapping focus within a container (e.g., modal, dropdown)
 * Ensures keyboard navigation stays within the container
 * 
 * @example
 * const { trapRef, activate, deactivate } = useFocusTrap()
 * activate() // Start trapping focus
 * deactivate() // Stop trapping focus
 */
export function useFocusTrap() {
  const trapRef = ref(null)
  const isActive = ref(false)
  let previousActiveElement = null
  let firstFocusableElement = null
  let lastFocusableElement = null

  /**
   * Get all focusable elements within the trap container
   * @param {HTMLElement} container - Container element
   * @returns {HTMLElement[]} Array of focusable elements
   */
  const getFocusableElements = (container) => {
    if (!container) return []

    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ')

    return Array.from(container.querySelectorAll(focusableSelectors))
      .filter(el => {
        // Filter out hidden elements
        const style = window.getComputedStyle(el)
        return style.display !== 'none' && style.visibility !== 'hidden'
      })
  }

  /**
   * Handle Tab key to trap focus
   */
  const handleTabKey = (event) => {
    if (!isActive.value || !trapRef.value) return

    const focusableElements = getFocusableElements(trapRef.value)
    
    if (focusableElements.length === 0) {
      event.preventDefault()
      return
    }

    firstFocusableElement = focusableElements[0]
    lastFocusableElement = focusableElements[focusableElements.length - 1]

    if (event.shiftKey) {
      // Shift + Tab: move backwards
      if (document.activeElement === firstFocusableElement) {
        event.preventDefault()
        lastFocusableElement.focus()
      }
    } else {
      // Tab: move forwards
      if (document.activeElement === lastFocusableElement) {
        event.preventDefault()
        firstFocusableElement.focus()
      }
    }
  }

  /**
   * Activate focus trap
   */
  const activate = async () => {
    if (isActive.value) return

    await nextTick()
    
    if (!trapRef.value) {
      console.warn('Focus trap: trapRef is not set')
      return
    }

    // Store the previously focused element
    previousActiveElement = document.activeElement

    // Get focusable elements
    const focusableElements = getFocusableElements(trapRef.value)
    
    if (focusableElements.length === 0) {
      console.warn('Focus trap: No focusable elements found')
      return
    }

    firstFocusableElement = focusableElements[0]
    lastFocusableElement = focusableElements[focusableElements.length - 1]

    // Focus the first element
    firstFocusableElement.focus()

    // Add event listener
    document.addEventListener('keydown', handleTabKey)
    
    isActive.value = true
  }

  /**
   * Deactivate focus trap
   */
  const deactivate = () => {
    if (!isActive.value) return

    // Remove event listener
    document.removeEventListener('keydown', handleTabKey)
    
    // Restore focus to previous element
    if (previousActiveElement && previousActiveElement.focus) {
      previousActiveElement.focus()
    }
    
    previousActiveElement = null
    firstFocusableElement = null
    lastFocusableElement = null
    isActive.value = false
  }

  // Watch for changes in trapRef
  watch(trapRef, (newRef) => {
    if (newRef && isActive.value) {
      // Reactivate if already active
      deactivate()
      activate()
    }
  })

  // Cleanup on unmount
  onUnmounted(() => {
    deactivate()
  })

  return {
    trapRef,
    isActive,
    activate,
    deactivate
  }
}

