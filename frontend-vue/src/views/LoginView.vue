<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useUIStore } from '../stores/ui'
import { useI18n } from 'vue-i18n'
import LanguageSwitcherCard from '../components/LanguageSwitcherCard.vue'
import { Input, Button } from '../components/ui'
import { useKeyboardNavigation, useFocus } from '../composables'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const uiStore = useUIStore()
const { t } = useI18n()

const email = ref('')
const password = ref('')
const errors = ref({})

const isLoading = computed(() => authStore.isLoading)
const errorMessage = computed(() => authStore.error)

// Accessibility composables
const { onKeyPress } = useKeyboardNavigation()
const { focus } = useFocus()

const validateForm = () => {
  errors.value = {}
  
  if (!email.value || !email.value.trim()) {
    errors.value.email = t('validation.required')
    return false
  }
  
  if (!email.value.includes('@')) {
    errors.value.email = t('validation.email')
    return false
  }
  
  if (!password.value || password.value.length < 6) {
    errors.value.password = t('validation.minLength', { count: 6 })
    return false
  }
  
  return true
}

const handleSubmit = async (e) => {
  e.preventDefault()
  
  if (!validateForm()) {
    return
  }
  
  try {
    await authStore.login({
      email: email.value.trim(),
      password: password.value
    })
    
    uiStore.showToast({
      message: t('auth.welcomeBack'),
      type: 'success'
    })
    
    // Redirect to intended page or dashboard
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  } catch (error) {
    // Error is already set in store, but we can show a toast
    uiStore.showToast({
      message: error.message || t('auth.loginError'),
      type: 'error'
    })
  }
}

const handleGoogleLogin = async () => {
  try {
    await authStore.loginWithGoogle()
  } catch (error) {
    uiStore.showToast({
      message: t('auth.loginError'),
      type: 'error'
    })
  }
}

// Focus email input on mount for better accessibility
onMounted(() => {
  // Small delay to ensure DOM is ready
  setTimeout(() => {
    const emailInput = document.querySelector('#email')
    if (emailInput) {
      focus(emailInput)
    }
  }, 100)
})

// Handle Enter key on form inputs
onKeyPress('Enter', (event) => {
  // Only handle if focus is on an input (not on button)
  if (event.target.tagName === 'INPUT' && !isLoading.value) {
    const form = event.target.closest('form')
    if (form) {
      event.preventDefault()
      form.requestSubmit()
    }
  }
}, { preventDefault: false })
</script>

<template>
  <div class="bg-background-light dark:bg-background-dark font-display text-[#121317] dark:text-white min-h-screen overflow-y-auto selection:bg-primary selection:text-white flex items-center justify-center relative py-8">
    <div class="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
      <div class="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px]"></div>
      <div class="absolute bottom-[-10%] left-[-10%] w-[700px] h-[700px] bg-blue-400/10 rounded-full blur-[120px]"></div>
      <div class="absolute top-[40%] left-[20%] w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[80px]"></div>
    </div>
    <main class="w-full max-w-md p-6 relative z-10 my-auto">
      <div class="glass-panel p-8 rounded-3xl shadow-2xl flex flex-col gap-8 border-t border-white/80 dark:border-white/10">
        <!-- Language Switcher at the top -->
        <LanguageSwitcherCard />
        
        <div class="text-center flex flex-col items-center">
          <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-light shadow-lg shadow-primary/30 flex items-center justify-center mb-6 text-white rotate-3 hover:rotate-6 transition-transform duration-300">
            <span class="material-symbols-outlined text-[40px] flip-rtl">local_taxi</span>
          </div>
          <h1 class="text-3xl font-black text-[#121317] dark:text-white tracking-tight mb-2">{{ t('auth.subtitle') }}</h1>
          <p class="text-[#666e85] dark:text-gray-400 text-sm font-medium">{{ t('auth.welcome') }}</p>
        </div>
        
        <!-- Error Message -->
        <div v-if="errorMessage" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
          {{ errorMessage }}
        </div>
        
        <form @submit="handleSubmit" class="flex flex-col gap-5">
          <Input
            v-model="email"
            :label="t('auth.email')"
            name="email"
            type="email"
            :placeholder="t('auth.email')"
            :error="errors.email"
            :disabled="isLoading"
            :required="true"
            icon="mail"
            dir="ltr"
            input-class="bg-white/60 dark:bg-black/20"
          />
          
          <div class="space-y-1.5">
            <div class="flex justify-between items-center">
              <label class="block text-sm font-bold text-[#121317] dark:text-gray-200" for="password">{{ t('auth.password') }}</label>
              <a class="text-xs font-bold text-primary hover:text-primary-light transition-colors" href="#">{{ t('auth.forgotPassword') }}</a>
            </div>
            <Input
              v-model="password"
              name="password"
              type="password"
              placeholder="••••••••"
              :error="errors.password"
              :disabled="isLoading"
              :required="true"
              icon="lock"
              dir="rtl"
              input-class="bg-white/60 dark:bg-black/20"
            />
          </div>
          
          <div class="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              :disabled="isLoading"
              :loading="isLoading"
              :full-width="true"
              :icon="!isLoading ? 'arrow_right_alt' : ''"
              :aria-label="isLoading ? t('common.loading') : t('auth.login')"
              className="shadow-lg shadow-primary/25"
            >
              {{ isLoading ? t('common.loading') : t('auth.login') }}
            </Button>
          </div>
        </form>
        
        <div class="relative flex items-center py-2">
          <div class="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
          <div class="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
        </div>
        
        <Button
          type="button"
          variant="outline"
          size="md"
          :disabled="isLoading"
          :full-width="true"
          @click="handleGoogleLogin"
          :aria-label="t('auth.loginWithGoogle')"
          className="bg-white dark:bg-[#1e293b] border-gray-200 dark:border-gray-700"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
          </svg>
          {{ t('auth.loginWithGoogle') }}
        </Button>
        
        <div class="text-center">
          <p class="text-sm text-[#666e85] dark:text-gray-400 font-medium">
            {{ t('auth.registerPrompt') }}
            <router-link class="font-bold text-primary hover:text-primary-light mr-1 underline decoration-primary/30 underline-offset-4 hover:decoration-primary transition-all" to="/signup">{{ t('auth.register') }}</router-link>
          </p>
        </div>
      </div>
      <p class="text-center text-xs text-gray-400 mt-8 opacity-60">
        © ۱۴۰۲ خودرو‌بان. تمامی حقوق محفوظ است.
      </p>
    </main>
  </div>
</template>
