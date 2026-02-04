/**
 * Composable for checking color contrast ratios
 * Helps ensure WCAG 2.1 AA compliance (4.5:1 for normal text, 3:1 for large text)
 * 
 * @example
 * const { checkContrast, getContrastRatio, isAACompliant } = useColorContrast()
 * const ratio = getContrastRatio('#000000', '#ffffff') // 21:1
 * const isCompliant = isAACompliant('#000000', '#ffffff', 'normal') // true
 */

/**
 * Convert hex color to RGB
 * @param {string} hex - Hex color (e.g., '#ffffff' or 'ffffff')
 * @returns {Object} RGB object with r, g, b values
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null
}

/**
 * Convert RGB to relative luminance
 * @param {number} r - Red value (0-255)
 * @param {number} g - Green value (0-255)
 * @param {number} b - Blue value (0-255)
 * @returns {number} Relative luminance (0-1)
 */
function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(val => {
    val = val / 255
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

/**
 * Get contrast ratio between two colors
 * @param {string} color1 - First color (hex)
 * @param {string} color2 - Second color (hex)
 * @returns {number} Contrast ratio (1-21)
 */
function getContrastRatio(color1, color2) {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)

  if (!rgb1 || !rgb2) {
    console.warn('Invalid color format. Use hex colors (e.g., #ffffff)')
    return 0
  }

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b)
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b)

  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)

  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Check if contrast ratio meets WCAG 2.1 AA standards
 * @param {string} foreground - Foreground color (hex)
 * @param {string} background - Background color (hex)
 * @param {string} textSize - 'normal' | 'large' (default: 'normal')
 * @returns {boolean} True if compliant
 */
function isAACompliant(foreground, background, textSize = 'normal') {
  const ratio = getContrastRatio(foreground, background)
  const requiredRatio = textSize === 'large' ? 3 : 4.5
  return ratio >= requiredRatio
}

/**
 * Check if contrast ratio meets WCAG 2.1 AAA standards
 * @param {string} foreground - Foreground color (hex)
 * @param {string} background - Background color (hex)
 * @param {string} textSize - 'normal' | 'large' (default: 'normal')
 * @returns {boolean} True if compliant
 */
function isAAACompliant(foreground, background, textSize = 'normal') {
  const ratio = getContrastRatio(foreground, background)
  const requiredRatio = textSize === 'large' ? 4.5 : 7
  return ratio >= requiredRatio
}

/**
 * Get contrast level description
 * @param {number} ratio - Contrast ratio
 * @returns {string} Level description
 */
function getContrastLevel(ratio) {
  if (ratio >= 7) return 'AAA (Enhanced)'
  if (ratio >= 4.5) return 'AA (Standard)'
  if (ratio >= 3) return 'AA (Large Text)'
  return 'Fail'
}

/**
 * Find a compliant color by adjusting brightness
 * @param {string} foreground - Foreground color (hex)
 * @param {string} background - Background color (hex)
 * @param {string} textSize - 'normal' | 'large' (default: 'normal')
 * @returns {string|null} Adjusted color or null if already compliant
 */
function findCompliantColor(foreground, background, textSize = 'normal') {
  if (isAACompliant(foreground, background, textSize)) {
    return null // Already compliant
  }

  const rgb = hexToRgb(foreground)
  if (!rgb) return null

  const requiredRatio = textSize === 'large' ? 3 : 4.5
  const bgRgb = hexToRgb(background)
  if (!bgRgb) return null

  const bgLum = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b)

  // Try to find a darker or lighter version
  // This is a simplified approach - in practice, you might want more sophisticated color adjustment
  const currentRatio = getContrastRatio(foreground, background)
  const needsToBeDarker = bgLum > 0.5

  // Simple adjustment: make color darker or lighter
  let adjustedRgb = { ...rgb }
  const step = needsToBeDarker ? -10 : 10

  for (let i = 0; i < 20; i++) {
    adjustedRgb = {
      r: Math.max(0, Math.min(255, adjustedRgb.r + step)),
      g: Math.max(0, Math.min(255, adjustedRgb.g + step)),
      b: Math.max(0, Math.min(255, adjustedRgb.b + step))
    }

    const adjustedHex = `#${[adjustedRgb.r, adjustedRgb.g, adjustedRgb.b]
      .map(x => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
      })
      .join('')}`

    const newRatio = getContrastRatio(adjustedHex, background)
    if (newRatio >= requiredRatio) {
      return adjustedHex
    }
  }

  return null
}

export function useColorContrast() {
  return {
    getContrastRatio,
    isAACompliant,
    isAAACompliant,
    getContrastLevel,
    findCompliantColor,
    hexToRgb,
    getLuminance
  }
}

