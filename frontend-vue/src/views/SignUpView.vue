<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useUIStore } from '../stores/ui'
import { useI18n } from 'vue-i18n'
import LanguageSwitcherCard from '../components/LanguageSwitcherCard.vue'
import { Input, Button, Select, Form } from '../components/ui'

const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUIStore()
const { t } = useI18n()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const phoneNumber = ref('')
const password = ref('')
const confirmPassword = ref('')
const terms = ref(false)
const errors = ref({})

const isLoading = computed(() => authStore.isLoading)

const validateForm = () => {
  errors.value = {}
  
  if (!firstName.value.trim()) {
    errors.value.firstName = t('validation.required')
    return false
  }
  
  if (!lastName.value.trim()) {
    errors.value.lastName = t('validation.required')
    return false
  }
  
  if (!email.value.trim()) {
    errors.value.email = t('validation.required')
    return false
  }
  
  if (!email.value.includes('@')) {
    errors.value.email = t('validation.email')
    return false
  }
  
  if (!phoneNumber.value.trim()) {
    errors.value.phoneNumber = t('validation.required')
    return false
  }
  
  if (!password.value || password.value.length < 6) {
    errors.value.password = t('validation.minLength', { count: 6 })
    return false
  }
  
  if (password.value !== confirmPassword.value) {
    errors.value.confirmPassword = t('auth.passwordsDoNotMatch')
    return false
  }
  
  if (!terms.value) {
    uiStore.showToast({
      message: t('auth.acceptTerms'),
      type: 'warning'
    })
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
    await authStore.register({
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      email: email.value.trim(),
      phoneNumber: phoneNumber.value.trim(),
      password: password.value
    })
    
    uiStore.showToast({
      message: t('auth.registerSuccess'),
      type: 'success'
    })
    
    router.push('/login')
  } catch (error) {
    uiStore.showToast({
      message: error.message || t('auth.registerError'),
      type: 'error'
    })
  }
}

const handleGoogleRegister = async () => {
  try {
    await authStore.loginWithGoogle()
  } catch (error) {
    uiStore.showToast({
      message: t('auth.registerError'),
      type: 'error'
    })
  }
}
</script>

<template>
  <div class="bg-background-light dark:bg-background-dark text-slate-900 min-h-screen flex items-center justify-center p-4 lg:p-8 relative overflow-hidden">
    <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-400/20 rounded-full blur-[120px] pointer-events-none"></div>
    <div class="w-full max-w-[1280px] h-full min-h-[800px] grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white/90 backdrop-blur-xl dark:bg-[#1a2634]/90 rounded-2xl shadow-2xl overflow-hidden border border-white/50 relative z-10">
      <!-- Left Side - Info Panel -->
      <div class="hidden lg:flex lg:col-span-5 relative flex-col justify-between bg-primary p-12 overflow-hidden">
        <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(#ffffff 2px, transparent 2px); background-size: 24px 24px;"></div>
        <div class="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black/20 to-transparent z-0"></div>
        <div class="relative z-10">
          <div class="flex items-center gap-3 text-white mb-12">
            <span class="material-symbols-outlined text-4xl">directions_car</span>
            <h1 class="text-2xl font-bold tracking-tight">{{ t('auth.subtitle') }}</h1>
          </div>
          <h2 class="text-white text-4xl font-extrabold leading-tight mb-6">
            {{ t('auth.heroTitle1') }}<br />
            {{ t('auth.heroTitle2') }}<br />
            {{ t('auth.heroTitle3') }}
          </h2>
          <p class="text-white/80 text-lg font-light leading-relaxed max-w-sm">
            {{ t('auth.heroDescription') }}
          </p>
        </div>
        <div class="relative z-10 mt-auto w-full aspect-video rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg flex items-center justify-center group">
          <img alt="Car Dashboard" class="object-cover w-full h-full opacity-80 mix-blend-overlay group-hover:scale-105 transition-transform duration-700" data-alt="Modern car interior dashboard view showing high tech navigation" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAt6fPYpyRtIAJQk5Skv2h_VvlcxN8VEaAPhcDPcK1VeHQE0a7xRgp_jCo4yUsZe9gxRUc3J4A6cQsaOxAz9mgAyIehn2glyGwYQvAE4Blh0cjksLFhX7yBbGAignSAOUFz0qnhRBtpqD9_enSOmK_2mcOzg9t6iCBVoi0dIiKbayUTjl_V9FOYv8djeshCUbwf8mcssICUG8RwgzUHJGbZy7vO1Xf_OjfK3GJGXkJAPPJyRKSeIdyh2DHMW3h3M8zb-ZCNCYLpVEc" />
          <div class="absolute inset-0 bg-gradient-to-t from-primary to-transparent opacity-60"></div>
          <div class="absolute bottom-4 right-4 text-white font-medium flex items-center gap-2">
            <span class="material-symbols-outlined text-sm">verified_user</span>
            <span>{{ t('auth.heroFeature') }}</span>
          </div>
        </div>
      </div>
      
      <!-- Right Side - Form -->
      <div class="col-span-1 lg:col-span-7 p-6 md:p-12 lg:p-16 flex flex-col justify-center overflow-y-auto">
        <div class="lg:hidden flex items-center gap-2 text-primary mb-8 justify-center">
          <span class="material-symbols-outlined text-3xl">directions_car</span>
          <h2 class="text-xl font-bold">{{ t('auth.subtitle') }}</h2>
        </div>
        
        <div class="max-w-[520px] mx-auto w-full">
          <!-- Language Switcher -->
          <LanguageSwitcherCard />
          
          <div class="mb-8 text-center lg:text-right mt-6">
            <h3 class="text-3xl font-bold text-slate-900 dark:text-white mb-3">{{ t('auth.register') }}</h3>
            <p class="text-slate-500 dark:text-slate-400 text-base">{{ t('auth.subtitle') }}</p>
          </div>
          
          <Button
            type="button"
            variant="outline"
            size="md"
            :disabled="isLoading"
            :full-width="true"
            @click="handleGoogleRegister"
            :aria-label="t('auth.loginWithGoogle')"
            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 mb-6"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            {{ t('auth.loginWithGoogle') }}
          </Button>
          
          <div class="relative flex py-2 items-center mb-6">
            <div class="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
            <span class="flex-shrink-0 mx-4 text-slate-400 text-sm">{{ t('auth.or') }} {{ t('auth.email') }}</span>
            <div class="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
          </div>
          
          <Form @submit="handleSubmit" class="space-y-5">
            <div class="flex flex-col md:flex-row gap-5">
              <Input
                v-model="firstName"
                :label="t('auth.firstName')"
                name="firstName"
                type="text"
                :placeholder="t('auth.firstName')"
                :error="errors.firstName"
                :required="true"
                wrapper-class="flex-1"
                input-class="bg-slate-50 dark:bg-slate-800"
              />
              <Input
                v-model="lastName"
                :label="t('auth.lastName')"
                name="lastName"
                type="text"
                :placeholder="t('auth.lastName')"
                :error="errors.lastName"
                :required="true"
                wrapper-class="flex-1"
                input-class="bg-slate-50 dark:bg-slate-800"
              />
            </div>
            
            <Input
              v-model="email"
              :label="t('auth.email')"
              name="email"
              type="email"
              :placeholder="t('auth.email')"
              :error="errors.email"
              :required="true"
              icon="mail"
              dir="ltr"
              input-class="bg-slate-50 dark:bg-slate-800"
            />
            
            <Input
              v-model="phoneNumber"
              :label="t('auth.phone')"
              name="phoneNumber"
              type="tel"
              placeholder="0912 345 6789"
              :error="errors.phoneNumber"
              :required="true"
              icon="smartphone"
              dir="ltr"
              input-class="bg-slate-50 dark:bg-slate-800"
            />
            
            <Input
              v-model="password"
              :label="t('auth.password')"
              name="password"
              type="password"
              placeholder="********"
              :error="errors.password"
              :required="true"
              icon="lock"
              dir="ltr"
              input-class="bg-slate-50 dark:bg-slate-800"
            />
            
            <Input
              v-model="confirmPassword"
              :label="t('auth.confirmPassword')"
              name="confirmPassword"
              type="password"
              placeholder="********"
              :error="errors.confirmPassword"
              :required="true"
              icon="lock_reset"
              dir="ltr"
              input-class="bg-slate-50 dark:bg-slate-800"
            />
            
            <div class="flex items-start gap-3 mt-2">
              <div class="flex items-center h-5">
                <input 
                  v-model="terms"
                  class="w-4 h-4 border border-slate-300 rounded bg-slate-50 focus:ring-3 focus:ring-primary/30 dark:bg-slate-700 dark:border-slate-600 dark:focus:ring-primary/60 dark:ring-offset-slate-800 text-primary" 
                  id="terms" 
                  type="checkbox"
                  :required="true"
                  :aria-invalid="!terms ? 'true' : undefined"
                />
              </div>
              <label class="text-sm font-light text-slate-500 dark:text-slate-400" for="terms">
                {{ t('auth.termsPrefix') }} <a class="font-medium text-primary hover:underline hover:text-primary-dark" href="#">{{ t('auth.terms') }}</a> {{ t('auth.termsSuffix') }}
              </label>
            </div>
            
            <div class="mt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                :disabled="isLoading"
                :loading="isLoading"
                :full-width="true"
                :icon="!isLoading ? 'arrow_back' : ''"
                :aria-label="isLoading ? t('common.loading') : t('auth.register')"
                className="shadow-lg shadow-primary/30"
              >
                {{ isLoading ? t('common.loading') : t('auth.register') }}
              </Button>
            </div>
          </Form>
          
          <div class="text-center mt-8">
            <p class="text-sm text-slate-500 dark:text-slate-400">
              {{ t('auth.alreadyHaveAccount') }}
              <router-link class="font-bold text-primary hover:text-primary-dark hover:underline transition-colors" to="/login">{{ t('auth.login') }}</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
