import { computed, ref } from 'vue'

/**
 * Composable for managing ARIA attributes
 * Provides utilities for setting and managing ARIA attributes for accessibility
 * 
 * @example
 * const { setAriaLabel, setAriaExpanded, setAriaLive } = useAria()
 * setAriaLabel(buttonRef.value, 'Close dialog')
 * setAriaExpanded(dropdownRef.value, isOpen.value)
 */
export function useAria() {
  /**
   * Set aria-label on an element
   * @param {HTMLElement|string} element - Element or selector
   * @param {string} label - Label text
   */
  const setAriaLabel = (element, label) => {
    const el = getElement(element)
    if (el) {
      el.setAttribute('aria-label', label)
    }
  }

  /**
   * Set aria-labelledby on an element
   * @param {HTMLElement|string} element - Element or selector
   * @param {string} id - ID of the labelling element
   */
  const setAriaLabelledBy = (element, id) => {
    const el = getElement(element)
    if (el) {
      el.setAttribute('aria-labelledby', id)
    }
  }

  /**
   * Set aria-describedby on an element
   * @param {HTMLElement|string} element - Element or selector
   * @param {string} id - ID of the describing element
   */
  const setAriaDescribedBy = (element, id) => {
    const el = getElement(element)
    if (el) {
      el.setAttribute('aria-describedby', id)
    }
  }

  /**
   * Set aria-expanded on an element
   * @param {HTMLElement|string} element - Element or selector
   * @param {boolean} expanded - Expanded state
   */
  const setAriaExpanded = (element, expanded) => {
    const el = getElement(element)
    if (el) {
      el.setAttribute('aria-expanded', String(expanded))
    }
  }

  /**
   * Set aria-hidden on an element
   * @param {HTMLElement|string} element - Element or selector
   * @param {boolean} hidden - Hidden state
   */
  const setAriaHidden = (element, hidden) => {
    const el = getElement(element)
    if (el) {
      el.setAttribute('aria-hidden', String(hidden))
    }
  }

  /**
   * Set aria-live on an element
   * @param {HTMLElement|string} element - Element or selector
   * @param {string} politeness - 'off' | 'polite' | 'assertive'
   */
  const setAriaLive = (element, politeness = 'polite') => {
    const el = getElement(element)
    if (el) {
      el.setAttribute('aria-live', politeness)
    }
  }

  /**
   * Set aria-busy on an element
   * @param {HTMLElement|string} element - Element or selector
   * @param {boolean} busy - Busy state
   */
  const setAriaBusy = (element, busy) => {
    const el = getElement(element)
    if (el) {
      el.setAttribute('aria-busy', String(busy))
    }
  }

  /**
   * Set aria-invalid on an element
   * @param {HTMLElement|string} element - Element or selector
   * @param {boolean|string} invalid - Invalid state or 'grammar' | 'spelling'
   */
  const setAriaInvalid = (element, invalid) => {
    const el = getElement(element)
    if (el) {
      if (typeof invalid === 'boolean') {
        el.setAttribute('aria-invalid', String(invalid))
      } else {
        el.setAttribute('aria-invalid', invalid)
      }
    }
  }

  /**
   * Set aria-required on an element
   * @param {HTMLElement|string} element - Element or selector
   * @param {boolean} required - Required state
   */
  const setAriaRequired = (element, required) => {
    const el = getElement(element)
    if (el) {
      el.setAttribute('aria-required', String(required))
    }
  }

  /**
   * Set role on an element
   * @param {HTMLElement|string} element - Element or selector
   * @param {string} role - Role name
   */
  const setRole = (element, role) => {
    const el = getElement(element)
    if (el) {
      el.setAttribute('role', role)
    }
  }

  /**
   * Get element from various input types
   * @param {HTMLElement|string|Object} element - Element, selector, or ref
   * @returns {HTMLElement|null}
   */
  const getElement = (element) => {
    if (!element) return null

    if (typeof element === 'string') {
      return document.querySelector(element)
    }

    if (element instanceof HTMLElement) {
      return element
    }

    if (element?.value instanceof HTMLElement) {
      return element.value
    }

    return null
  }

  /**
   * Create computed ARIA attributes object
   * @param {Object} props - ARIA properties
   * @returns {Object} Computed ARIA attributes
   */
  const createAriaAttrs = (props) => {
    return computed(() => {
      const attrs = {}
      
      if (props.label) attrs['aria-label'] = props.label
      if (props.labelledBy) attrs['aria-labelledby'] = props.labelledBy
      if (props.describedBy) attrs['aria-describedby'] = props.describedBy
      if (props.expanded !== undefined) attrs['aria-expanded'] = String(props.expanded)
      if (props.hidden !== undefined) attrs['aria-hidden'] = String(props.hidden)
      if (props.live) attrs['aria-live'] = props.live
      if (props.busy !== undefined) attrs['aria-busy'] = String(props.busy)
      if (props.invalid !== undefined) {
        attrs['aria-invalid'] = typeof props.invalid === 'boolean' 
          ? String(props.invalid) 
          : props.invalid
      }
      if (props.required !== undefined) attrs['aria-required'] = String(props.required)
      if (props.role) attrs.role = props.role

      return attrs
    })
  }

  return {
    setAriaLabel,
    setAriaLabelledBy,
    setAriaDescribedBy,
    setAriaExpanded,
    setAriaHidden,
    setAriaLive,
    setAriaBusy,
    setAriaInvalid,
    setAriaRequired,
    setRole,
    createAriaAttrs,
    getElement
  }
}

