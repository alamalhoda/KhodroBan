<script setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useUIStore } from '../stores/ui'
import { supabase, authService } from '../services'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const uiStore = useUIStore()

onMounted(async () => {
  try {
    // Handle OAuth callback from Supabase
    // Supabase stores the session in URL hash, getSession() will parse it
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      throw error
    }
    
    if (data.session) {
      // Save token
      authStore.saveToken(data.session.access_token)
      
      // Get user profile and update store
      const profile = await authService.getProfile()
      authStore.user = profile
      
      uiStore.showToast({
        message: 'خوش آمدید!',
        type: 'success'
      })
      
      // Redirect to dashboard or intended page
      const redirect = route.query.redirect || '/'
      router.push(redirect)
    } else {
      throw new Error('هیچ session یافت نشد')
    }
  } catch (error) {
    console.error('Auth callback error:', error)
    uiStore.showToast({
      message: error.message || 'خطا در ورود با Google',
      type: 'error'
    })
    router.push('/login')
  }
})
</script>

<template>
  <div class="bg-background-light dark:bg-background-dark font-display text-[#121317] dark:text-white h-screen overflow-hidden flex items-center justify-center">
    <div class="text-center">
      <div class="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p class="text-lg font-medium text-gray-600 dark:text-gray-400">در حال ورود...</p>
    </div>
  </div>
</template>

