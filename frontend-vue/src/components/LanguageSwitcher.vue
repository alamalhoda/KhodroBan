<template>
  <div class="relative">
    <button @click="toggleDropdown" class="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
      <span class="material-symbols-outlined">language</span>
      <span class="hidden md:inline">{{ currentLanguageName }}</span>
    </button>
    <div v-if="isOpen" class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
      <a
        v-for="lang in languages"
        :key="lang.code"
        @click.prevent="switchLanguage(lang.code)"
        href="#"
        class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        :class="{ 'font-bold': locale === lang.code }"
      >
        {{ lang.name }}
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLocale } from '@/i18n'

const { locale } = useI18n()
const isOpen = ref(false)

const languages = [
  { code: 'fa', name: 'فارسی' },
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'العربية' }
]

const currentLanguageName = computed(() => {
  const currentLang = languages.find(lang => lang.code === locale.value)
  return currentLang ? currentLang.name : ''
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const switchLanguage = (langCode) => {
  setLocale(langCode)
  isOpen.value = false
}

// Optional: Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (isOpen.value && !e.target.closest('.relative')) {
    isOpen.value = false
  }
})
</script>

<style scoped>
/* You can add component-specific styles here if needed */
</style>

