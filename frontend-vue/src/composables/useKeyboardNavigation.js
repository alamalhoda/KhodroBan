import { onMounted, onUnmounted } from 'vue'

/**
 * Composable for managing keyboard navigation
 * Provides utilities for handling keyboard events and navigation
 * 
 * @example
 * const { onKeyPress, onKeyDown, onKeyUp } = useKeyboardNavigation()
 * onKeyPress('Escape', () => closeModal())
 * onKeyPress('Enter', () => submitForm())
 */
export function useKeyboardNavigation() {
  const handlers = new Map()

  /**
   * Register a keyboard event handler
   * @param {string|string[]} keys - Key or array of keys to listen for (e.g., 'Escape', 'Enter', ['ArrowUp', 'ArrowDown'])
   * @param {Function} callback - Callback function to execute
   * @param {Object} options - Options (preventDefault, stopPropagation, once)
   * @returns {Function} Unregister function
   */
  const onKeyPress = (keys, callback, options = {}) => {
    const {
      preventDefault = false,
      stopPropagation = false,
      once = false
    } = options

    const keyArray = Array.isArray(keys) ? keys : [keys]
    const normalizedKeys = keyArray.map(key => key ? key.toLowerCase() : '').filter(Boolean)

    const handler = (event) => {
      if (!event || !event.key) return
      const eventKey = event.key.toLowerCase()
      
      if (normalizedKeys.includes(eventKey)) {
        if (preventDefault) {
          event.preventDefault()
        }
        if (stopPropagation) {
          event.stopPropagation()
        }
        
        callback(event)
        
        if (once) {
          unregister(handler)
        }
      }
    }

    const unregister = () => {
      document.removeEventListener('keydown', handler)
      handlers.delete(handler)
    }

    document.addEventListener('keydown', handler)
    handlers.set(handler, unregister)

    return unregister
  }

  /**
   * Register a keydown event handler
   */
  const onKeyDown = (keys, callback, options = {}) => {
    return onKeyPress(keys, callback, options)
  }

  /**
   * Register a keyup event handler
   */
  const onKeyUp = (keys, callback, options = {}) => {
    const {
      preventDefault = false,
      stopPropagation = false,
      once = false
    } = options

    const keyArray = Array.isArray(keys) ? keys : [keys]
    const normalizedKeys = keyArray.map(key => key ? key.toLowerCase() : '').filter(Boolean)

    const handler = (event) => {
      if (!event || !event.key) return
      const eventKey = event.key.toLowerCase()
      
      if (normalizedKeys.includes(eventKey)) {
        if (preventDefault) {
          event.preventDefault()
        }
        if (stopPropagation) {
          event.stopPropagation()
        }
        
        callback(event)
        
        if (once) {
          unregister(handler)
        }
      }
    }

    const unregister = () => {
      document.removeEventListener('keyup', handler)
      handlers.delete(handler)
    }

    document.addEventListener('keyup', handler)
    handlers.set(handler, unregister)

    return unregister
  }

  /**
   * Handle arrow key navigation in a list
   * @param {Object} options - Options (onUp, onDown, onLeft, onRight, preventDefault)
   */
  const handleArrowKeys = (options = {}) => {
    const {
      onUp,
      onDown,
      onLeft,
      onRight,
      preventDefault = true
    } = options

    return onKeyPress(
      ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'],
      (event) => {
        switch (event.key) {
          case 'ArrowUp':
            onUp?.(event)
            break
          case 'ArrowDown':
            onDown?.(event)
            break
          case 'ArrowLeft':
            onLeft?.(event)
            break
          case 'ArrowRight':
            onRight?.(event)
            break
        }
      },
      { preventDefault }
    )
  }

  /**
   * Cleanup all handlers
   */
  const cleanup = () => {
    handlers.forEach(unregister => unregister())
    handlers.clear()
  }

  // Cleanup on unmount
  onUnmounted(() => {
    cleanup()
  })

  return {
    onKeyPress,
    onKeyDown,
    onKeyUp,
    handleArrowKeys,
    cleanup
  }
}

