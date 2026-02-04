import { ref, nextTick } from 'vue'

/**
 * Composable for programmatic focus management
 * Provides utilities for focusing elements and managing focus state
 * 
 * @example
 * const { focus, focusFirst, focusLast, blur } = useFocus()
 * focus(elementRef.value)
 * focusFirst(containerRef.value)
 */
export function useFocus() {
  const focusedElement = ref(null)

  /**
   * Focus an element
   * @param {HTMLElement|string} element - Element to focus (HTMLElement or selector)
   * @param {Object} options - Focus options (preventScroll)
   */
  const focus = async (element, options = {}) => {
    await nextTick()

    let targetElement = null

    if (typeof element === 'string') {
      // If it's a selector, find the element
      targetElement = document.querySelector(element)
    } else if (element instanceof HTMLElement) {
      targetElement = element
    } else if (element?.value instanceof HTMLElement) {
      // If it's a ref
      targetElement = element.value
    }

    if (!targetElement) {
      console.warn('Focus: Element not found', element)
      return false
    }

    // Check if element is focusable
    if (!isFocusable(targetElement)) {
      console.warn('Focus: Element is not focusable', targetElement)
      return false
    }

    try {
      targetElement.focus(options)
      focusedElement.value = targetElement
      return true
    } catch (error) {
      console.warn('Focus: Failed to focus element', error)
      return false
    }
  }

  /**
   * Blur the currently focused element
   */
  const blur = () => {
    if (document.activeElement && document.activeElement.blur) {
      document.activeElement.blur()
      focusedElement.value = null
    }
  }

  /**
   * Check if an element is focusable
   * @param {HTMLElement} element - Element to check
   * @returns {boolean}
   */
  const isFocusable = (element) => {
    if (!element) return false

    // Check if element has tabindex
    const tabIndex = element.getAttribute('tabindex')
    if (tabIndex !== null) {
      return tabIndex !== '-1'
    }

    // Check if element is naturally focusable
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[contenteditable="true"]'
    ]

    return focusableSelectors.some(selector => {
      try {
        return element.matches(selector)
      } catch {
        return false
      }
    })
  }

  /**
   * Focus the first focusable element in a container
   * @param {HTMLElement|string} container - Container element
   */
  const focusFirst = async (container) => {
    await nextTick()

    let containerElement = null

    if (typeof container === 'string') {
      containerElement = document.querySelector(container)
    } else if (container instanceof HTMLElement) {
      containerElement = container
    } else if (container?.value instanceof HTMLElement) {
      containerElement = container.value
    }

    if (!containerElement) {
      console.warn('FocusFirst: Container not found', container)
      return false
    }

    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ')

    const focusableElements = Array.from(
      containerElement.querySelectorAll(focusableSelectors)
    ).filter(el => {
      const style = window.getComputedStyle(el)
      return style.display !== 'none' && style.visibility !== 'hidden'
    })

    if (focusableElements.length === 0) {
      console.warn('FocusFirst: No focusable elements found')
      return false
    }

    return focus(focusableElements[0])
  }

  /**
   * Focus the last focusable element in a container
   * @param {HTMLElement|string} container - Container element
   */
  const focusLast = async (container) => {
    await nextTick()

    let containerElement = null

    if (typeof container === 'string') {
      containerElement = document.querySelector(container)
    } else if (container instanceof HTMLElement) {
      containerElement = container
    } else if (container?.value instanceof HTMLElement) {
      containerElement = container.value
    }

    if (!containerElement) {
      console.warn('FocusLast: Container not found', container)
      return false
    }

    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ')

    const focusableElements = Array.from(
      containerElement.querySelectorAll(focusableSelectors)
    ).filter(el => {
      const style = window.getComputedStyle(el)
      return style.display !== 'none' && style.visibility !== 'hidden'
    })

    if (focusableElements.length === 0) {
      console.warn('FocusLast: No focusable elements found')
      return false
    }

    return focus(focusableElements[focusableElements.length - 1])
  }

  /**
   * Get the currently focused element
   * @returns {HTMLElement|null}
   */
  const getFocused = () => {
    return document.activeElement
  }

  return {
    focusedElement,
    focus,
    blur,
    focusFirst,
    focusLast,
    isFocusable,
    getFocused
  }
}

