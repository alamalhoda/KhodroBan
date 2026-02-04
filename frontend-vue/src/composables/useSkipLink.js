import { onMounted, onUnmounted } from 'vue'

/**
 * Composable for creating skip links for keyboard navigation
 * Skip links allow users to skip repetitive navigation and jump to main content
 * 
 * @example
 * const { addSkipLink, removeSkipLink } = useSkipLink()
 * addSkipLink('main-content', 'Skip to main content')
 */
export function useSkipLink() {
  const skipLinks = new Map()

  /**
   * Add a skip link
   * @param {string} targetId - ID of the target element
   * @param {string} label - Label for the skip link
   * @param {Object} options - Options (position, className)
   * @returns {Function} Remove function
   */
  const addSkipLink = (targetId, label, options = {}) => {
    const {
      position = 'top-left',
      className = 'skip-link'
    } = options

    // Check if skip link already exists
    if (skipLinks.has(targetId)) {
      console.warn(`Skip link for "${targetId}" already exists`)
      return () => {}
    }

    // Create skip link element
    const skipLink = document.createElement('a')
    skipLink.href = `#${targetId}`
    skipLink.textContent = label
    skipLink.className = className
    skipLink.setAttribute('aria-label', label)
    
    // Add styles for skip link (only visible when focused)
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 0;
      background: #000;
      color: #fff;
      padding: 8px 16px;
      text-decoration: none;
      z-index: 10000;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s, top 0.2s;
    `

    // Show on focus
    skipLink.addEventListener('focus', () => {
      skipLink.style.opacity = '1'
      skipLink.style.top = '0'
      skipLink.style.pointerEvents = 'auto'
    })

    // Hide on blur
    skipLink.addEventListener('blur', () => {
      skipLink.style.opacity = '0'
      skipLink.style.top = '-40px'
      skipLink.style.pointerEvents = 'none'
    })

    // Handle click
    skipLink.addEventListener('click', (e) => {
      e.preventDefault()
      const target = document.getElementById(targetId)
      if (target) {
        target.focus()
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })

    // Position the skip link
    const positionStyles = {
      'top-left': { top: '-40px', left: '0' },
      'top-right': { top: '-40px', right: '0' },
      'top-center': { top: '-40px', left: '50%', transform: 'translateX(-50%)' }
    }

    const pos = positionStyles[position] || positionStyles['top-left']
    Object.assign(skipLink.style, pos)

    // Insert at the beginning of body
    document.body.insertBefore(skipLink, document.body.firstChild)

    // Store for cleanup
    skipLinks.set(targetId, skipLink)

    // Return remove function
    return () => {
      removeSkipLink(targetId)
    }
  }

  /**
   * Remove a skip link
   * @param {string} targetId - ID of the target element
   */
  const removeSkipLink = (targetId) => {
    const skipLink = skipLinks.get(targetId)
    if (skipLink && skipLink.parentNode) {
      skipLink.parentNode.removeChild(skipLink)
      skipLinks.delete(targetId)
    }
  }

  /**
   * Add default skip links (main content, navigation)
   */
  const addDefaultSkipLinks = () => {
    // Skip to main content
    const mainContent = document.querySelector('main, [role="main"]')
    if (mainContent && !mainContent.id) {
      mainContent.id = 'main-content'
    }
    if (mainContent) {
      addSkipLink('main-content', 'Skip to main content')
    }

    // Skip to navigation
    const navigation = document.querySelector('nav, [role="navigation"]')
    if (navigation && !navigation.id) {
      navigation.id = 'main-navigation'
    }
    if (navigation) {
      addSkipLink('main-navigation', 'Skip to navigation')
    }
  }

  /**
   * Remove all skip links
   */
  const removeAllSkipLinks = () => {
    skipLinks.forEach((skipLink, targetId) => {
      removeSkipLink(targetId)
    })
  }

  // Cleanup on unmount
  onUnmounted(() => {
    removeAllSkipLinks()
  })

  return {
    addSkipLink,
    removeSkipLink,
    addDefaultSkipLinks,
    removeAllSkipLinks
  }
}

