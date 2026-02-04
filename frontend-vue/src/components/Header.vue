<template>
  <header class="h-20 flex items-center justify-between px-8 py-4 z-10 sticky top-0 bg-background-light dark:bg-background-dark border-b border-gray-100 dark:border-gray-800">
    <button class="md:hidden p-2 text-[#666e85]">
      <span class="material-symbols-outlined">menu</span>
    </button>
    <div class="hidden md:flex flex-col">
      <h2 class="text-xl font-bold text-[#121317] dark:text-white">{{ t('dashboard.title') }}</h2>
      <p class="text-sm text-[#666e85]">{{ currentDate }}</p>
    </div>
    <div class="flex items-center gap-4">
      <LanguageSwitcher />
      <button class="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-[#1e293b] text-[#666e85] hover:text-primary shadow-sm transition-colors border border-gray-100 dark:border-gray-700">
        <span class="material-symbols-outlined text-[20px]">search</span>
      </button>
      <NotificationBell />
      <div class="h-8 w-[1px] bg-gray-200 dark:bg-gray-700 mx-2"></div>
      <div class="relative">
        <div 
          class="flex items-center gap-3 cursor-pointer p-1 pr-3 rounded-full hover:bg-white/50 dark:hover:bg-white/5 transition-colors"
          @click="toggleUserMenu"
        >
          <div 
            class="bg-center bg-no-repeat bg-cover rounded-full w-10 h-10 border-2 border-white dark:border-gray-700 shadow-sm bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
            :style="userAvatarStyle"
          >
            <span v-if="!userAvatar" class="material-symbols-outlined text-gray-500 dark:text-gray-400 text-[20px]">account_circle</span>
          </div>
          <div class="hidden lg:block">
            <p class="text-sm font-bold text-[#121317] dark:text-white leading-tight">{{ displayName }}</p>
            <p class="text-xs text-[#666e85]">{{ tierLabel }}</p>
          </div>
          <span class="material-symbols-outlined text-[#666e85] text-sm transition-transform" :class="{ 'rotate-180': showUserMenu }">expand_more</span>
        </div>
        
        <!-- User Menu Dropdown -->
        <div 
          v-if="showUserMenu"
          class="absolute top-full right-0 mt-2 bg-white dark:bg-[#1e293b] rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-2 min-w-[200px] z-50"
          @click.stop
        >
          <router-link 
            to="/settings" 
            class="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-right"
            @click="showUserMenu = false"
          >
            <span class="material-symbols-outlined text-[#666e85] text-[20px]">settings</span>
            <span class="text-sm text-[#121317] dark:text-white">{{ t('common.settings') }}</span>
          </router-link>
          <div class="h-[1px] bg-gray-100 dark:bg-gray-700 my-1"></div>
          <button 
            @click="handleLogout"
            class="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-right"
          >
            <span class="material-symbols-outlined text-red-500 text-[20px]">logout</span>
            <span class="text-sm text-red-500">{{ t('auth.logout') }}</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from './LanguageSwitcher.vue'
import NotificationBell from './NotificationBell.vue'
import { useAuthStore } from '../stores/auth'
import { useUIStore } from '../stores/ui'

const router = useRouter()
const { t } = useI18n()
const authStore = useAuthStore()
const uiStore = useUIStore()

const showUserMenu = ref(false)

// Computed properties
const displayName = computed(() => {
  if (!authStore.user) return t('common.user')
  
  const user = authStore.user
  // User object has 'name' field which is full name
  if (user.name) {
    const nameParts = user.name.trim().split(' ')
    if (nameParts.length > 1) {
      // Return first name + first letter of last name
      return `${nameParts[0]} ${nameParts[1].charAt(0)}.`
    }
    return nameParts[0]
  }
  if (user.email) {
    return user.email.split('@')[0]
  }
  return t('common.user')
})

const tierLabel = computed(() => {
  const tier = authStore.userTier
  if (tier === 'pro') return t('subscription.tier.pro')
  if (tier === 'pro+') return t('subscription.tier.proPlus')
  return t('subscription.tier.free')
})

const userAvatar = computed(() => {
  return authStore.user?.avatarUrl || authStore.user?.photoURL || null
})

const userAvatarStyle = computed(() => {
  if (userAvatar.value) {
    return {
      backgroundImage: `url(${userAvatar.value})`
    }
  }
  return {}
})

const currentDate = computed(() => {
  const now = new Date()
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  return new Intl.DateTimeFormat('fa-IR', options).format(now)
})

// Methods
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    uiStore.success(t('auth.loggedOut'))
    router.push({ name: 'login' })
  } catch (error) {
    uiStore.error(error.message || 'خطا در خروج از سیستم')
  }
  showUserMenu.value = false
}

// Close menu when clicking outside
const handleClickOutside = (event) => {
  if (showUserMenu.value && !event.target.closest('.relative')) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>