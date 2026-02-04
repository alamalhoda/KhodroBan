<template>
  <div class="language-switcher">
    <div class="language-buttons">
      <button
        v-for="lang in languages"
        :key="lang.code"
        @click="changeLanguage(lang.code)"
        :class="[
          'language-button',
          { 'active': locale === lang.code }
        ]"
        type="button"
      >
        <span class="flag">{{ lang.flag }}</span>
        <span class="name">{{ lang.name }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLocale } from '@/i18n'

const { locale, t } = useI18n()

const languages = computed(() => [
  { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' }
])

const changeLanguage = (langCode) => {
  setLocale(langCode)
}
</script>

<style scoped>
.language-switcher {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
  width: 100%;
}

.language-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #666e85;
  text-align: center;
}

.language-buttons {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
}

.language-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: 0.75rem;
  border: 2px solid transparent;
  background: rgba(255, 255, 255, 0.6);
  color: #121317;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.dark .language-button {
  background: rgba(30, 41, 59, 0.6);
  color: white;
}

.language-button:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: translateY(-2px);
}

.dark .language-button:hover {
  background: rgba(30, 41, 59, 0.8);
}

.language-button.active {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
}

.dark .language-button.active {
  background: rgba(59, 130, 246, 0.25);
  color: #60a5fa;
}

.flag {
  font-size: 1.25em;
  line-height: 1;
}

.name {
  font-weight: 600;
}

/* RTL support */
[dir='rtl'] .language-switcher {
  align-items: center;
}

/* Responsive */
@media (max-width: 640px) {
  .language-buttons {
    flex-direction: row;
    gap: 0.375rem;
  }

  .language-button {
    padding: 0.5rem 0.75rem;
    font-size: 0.8125rem;
  }
}
</style>

