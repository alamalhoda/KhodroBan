import { createI18n } from 'vue-i18n'
import fa from '@/locales/fa.json'
import en from '@/locales/en.json'
import ar from '@/locales/ar.json'

/**
 * Load locale setting from localStorage.
 *
 * @returns {string}
 */
function getInitialLocale() {
  const savedLocale = localStorage.getItem('locale')
  if (savedLocale) {
    return savedLocale
  }
  // Fallback to browser language if no locale is saved
  const browserLang = navigator.language.split('-')[0]
  if (['fa', 'en', 'ar'].includes(browserLang)) {
    return browserLang
  }
  return 'fa' // Default locale
}

/**
 * Sets the HTML dir attribute based on the locale.
 * @param {string} locale - The current locale.
 */
function setDocumentDirection(locale) {
  const dir = locale === 'ar' || locale === 'fa' ? 'rtl' : 'ltr'
  document.documentElement.setAttribute('dir', dir)
  document.documentElement.setAttribute('lang', locale)
}

const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: getInitialLocale(),
  fallbackLocale: 'en',
  messages: {
    fa,
    en,
    ar
  },
  globalInjection: true,
  // Enable named format for interpolation
  interpolation: {
    escapeValue: false // Already escaped by Vue
  }
})

// Set initial direction
setDocumentDirection(i18n.global.locale.value)

// Create a function to set the locale and save it
export const setLocale = (locale) => {
  if (i18n.global.locale.value !== locale) {
    i18n.global.locale.value = locale
    localStorage.setItem('locale', locale)
    setDocumentDirection(locale)
  }
}

export default i18n

