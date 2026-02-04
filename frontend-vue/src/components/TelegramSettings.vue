<template>
  <div class="telegram-settings">
    <div class="flex items-center gap-3 mb-4">
      <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-primary">
        <span class="material-symbols-outlined text-2xl">send</span>
      </div>
      <div>
        <h3 class="text-[#111318] dark:text-white text-xl font-bold">
          {{ $t('telegram.title') }}
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ $t('telegram.description') }}
        </p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="telegramStore.isLoading" class="flex items-center justify-center py-8">
      <div class="flex flex-col items-center gap-2">
        <span class="material-symbols-outlined animate-spin text-primary text-3xl">sync</span>
        <p class="text-gray-500 dark:text-gray-400">{{ $t('telegram.loading') }}</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="telegramStore.error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-4">
      <div class="flex items-start gap-3">
        <span class="material-symbols-outlined text-red-500 text-xl">error</span>
        <div class="flex-1">
          <p class="text-red-700 dark:text-red-400 font-medium">{{ $t('telegram.error') }}</p>
          <p class="text-red-600 dark:text-red-500 text-sm mt-1">{{ telegramStore.error }}</p>
        </div>
        <button
          @click="telegramStore.clearError()"
          class="text-red-500 hover:text-red-700 dark:hover:text-red-400"
          :aria-label="$t('telegram.closeError')"
        >
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
    </div>

    <!-- Connected State -->
    <div v-else-if="telegramStore.isConnected" class="space-y-4">
      <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined text-green-500 text-2xl">check_circle</span>
          <div class="flex-1">
            <p class="text-green-700 dark:text-green-400 font-bold">{{ $t('telegram.connected') }}</p>
            <p class="text-green-600 dark:text-green-500 text-sm mt-1">
              {{ $t('telegram.connectedDescription') }}
            </p>
          </div>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-3">
        <Button
          variant="danger"
          @click="handleDisconnect"
          :loading="telegramStore.isLoading"
          class="flex-1"
        >
          <span class="material-symbols-outlined mr-2">link_off</span>
          {{ $t('telegram.disconnect') }}
        </Button>
        <Button
          variant="outline"
          @click="openTelegram"
          class="flex-1"
        >
          <span class="material-symbols-outlined mr-2">open_in_new</span>
          {{ $t('telegram.openBot') }}
        </Button>
      </div>
    </div>

    <!-- Not Connected State -->
    <div v-else class="space-y-4">
      <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined text-yellow-500 text-2xl">info</span>
          <div class="flex-1">
            <p class="text-yellow-700 dark:text-yellow-400 font-bold">{{ $t('telegram.notConnected') }}</p>
            <p class="text-yellow-600 dark:text-yellow-500 text-sm mt-1">
              {{ $t('telegram.notConnectedDescription') }}
            </p>
          </div>
        </div>
      </div>

      <!-- Connection Steps -->
      <div class="bg-white dark:bg-[#1a202e] border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-3">
        <h4 class="text-[#111318] dark:text-white font-bold mb-3">{{ $t('telegram.stepsTitle') }}</h4>
        
        <div class="flex items-start gap-3">
          <div class="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
            ۱
          </div>
          <p class="text-gray-700 dark:text-gray-300 text-sm flex-1 pt-1">
            {{ $t('telegram.step1') }}
          </p>
        </div>

        <div class="flex items-start gap-3">
          <div class="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
            ۲
          </div>
          <p class="text-gray-700 dark:text-gray-300 text-sm flex-1 pt-1">
            {{ $t('telegram.step2') }}
          </p>
        </div>

        <div class="flex items-start gap-3">
          <div class="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
            ۳
          </div>
          <p class="text-gray-700 dark:text-gray-300 text-sm flex-1 pt-1">
            {{ $t('telegram.step3') }}
          </p>
        </div>
      </div>

      <!-- Connection Code (if available) -->
      <div v-if="telegramStore.hasConnectionCode && telegramStore.connectionCode" class="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">{{ $t('telegram.codeLabel') }}</p>
        <div class="flex items-center gap-2">
          <code class="flex-1 bg-white dark:bg-[#1a202e] border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-lg font-bold text-primary text-center font-mono">
            {{ telegramStore.connectionCode }}
          </code>
          <Button
            variant="success"
            size="sm"
            @click="copyCode"
            :aria-label="$t('telegram.copyCode')"
          >
            <span class="material-symbols-outlined">{{ copied ? 'check' : 'content_copy' }}</span>
          </Button>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {{ $t('telegram.codeHint') }}
        </p>
      </div>

      <!-- Connect Button -->
      <Button
        variant="primary"
        size="lg"
        @click="handleConnect"
        :loading="telegramStore.isLoading"
        class="w-full"
      >
        <span class="material-symbols-outlined mr-2">send</span>
        {{ $t('telegram.connectButton') }}
      </Button>

      <!-- Regenerate Link Button -->
      <Button
        variant="outline"
        @click="handleRegenerateLink"
        :loading="telegramStore.isLoading"
        class="w-full"
      >
        <span class="material-symbols-outlined mr-2">refresh</span>
        {{ $t('telegram.regenerateLink') }}
      </Button>
    </div>

    <!-- Info Box -->
    <div class="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
      <div class="flex items-start gap-3">
        <span class="material-symbols-outlined text-blue-500 text-xl flex-shrink-0">lightbulb</span>
        <div class="flex-1">
          <p class="text-blue-700 dark:text-blue-400 font-bold mb-2">{{ $t('telegram.infoTitle') }}</p>
          <ul class="text-blue-600 dark:text-blue-500 text-sm space-y-1 list-disc list-inside">
            <li>{{ $t('telegram.info1') }}</li>
            <li>{{ $t('telegram.info2') }}</li>
            <li>{{ $t('telegram.info3') }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useTelegramStore } from '../stores/telegram'
import { useUIStore } from '../stores/ui'
import { useI18n } from 'vue-i18n'
import Button from './ui/Button.vue'

const { t } = useI18n()
const telegramStore = useTelegramStore()
const uiStore = useUIStore()

const copied = ref(false)
let connectionCheckInterval = null

// Lifecycle
onMounted(async () => {
  await telegramStore.loadStatus()
  
  // اگر متصل نیست و کد دارد، هر 3 ثانیه چک کن
  if (!telegramStore.isConnected && telegramStore.hasConnectionCode) {
    connectionCheckInterval = setInterval(async () => {
      const isConnected = await telegramStore.checkConnection()
      if (isConnected) {
        clearInterval(connectionCheckInterval)
        uiStore.success(t('telegram.connectionSuccess'))
      }
    }, 3000) // هر 3 ثانیه
  }
})

onUnmounted(() => {
  if (connectionCheckInterval) {
    clearInterval(connectionCheckInterval)
  }
})

// Methods
const handleConnect = () => {
  if (telegramStore.telegramLink) {
    // استخراج نام ربات و کد اتصال از لینک
    const urlMatch = telegramStore.telegramLink.match(/https:\/\/t\.me\/([^?]+)(?:\?start=(.+))?/)
    if (urlMatch) {
      const botUsername = urlMatch[1]
      const startCode = urlMatch[2] || ''
      
      // ساخت لینک tg:// برای باز شدن مستقیم در اپلیکیشن تلگرام
      const tgProtocolLink = startCode 
        ? `tg://resolve?domain=${botUsername}&start=${startCode}`
        : `tg://resolve?domain=${botUsername}`
      
      // بررسی اینکه آیا در موبایل هستیم یا نه
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      
      if (isMobile) {
        // در موبایل: تلاش برای باز کردن در اپلیکیشن تلگرام
        // اگر اپلیکیشن نصب باشد، باز می‌شود
        // اگر نصب نباشد، مرورگر به صفحه وب تلگرام می‌رود
        window.location.href = tgProtocolLink
      } else {
        // در دسکتاپ: باز کردن لینک https در همان تب (نه تب جدید)
        // این کار باعث می‌شود صفحه تلگرام وب باز شود
        window.location.href = telegramStore.telegramLink
      }
    } else {
      // اگر فرمت لینک درست نبود، همان لینک اصلی را باز کن
      window.location.href = telegramStore.telegramLink
    }
    
    // شروع چک کردن اتصال
    if (!connectionCheckInterval) {
      connectionCheckInterval = setInterval(async () => {
        const isConnected = await telegramStore.checkConnection()
        if (isConnected) {
          clearInterval(connectionCheckInterval)
          uiStore.success(t('telegram.connectionSuccess'))
        }
      }, 3000)
    }
  }
}

const handleDisconnect = async () => {
  if (!confirm(t('telegram.disconnectConfirm'))) {
    return
  }

  try {
    await telegramStore.disconnect()
    uiStore.success(t('telegram.disconnected'))
  } catch (error) {
    uiStore.error(error.message || t('telegram.disconnectError'))
  }
}

const handleRegenerateLink = async () => {
  try {
    await telegramStore.generateLink()
    uiStore.success(t('telegram.linkRegenerated'))
  } catch (error) {
    uiStore.error(error.message || t('telegram.regenerateError'))
  }
}

const copyCode = async () => {
  if (!telegramStore.connectionCode) return

  try {
    await navigator.clipboard.writeText(telegramStore.connectionCode)
    copied.value = true
    uiStore.success(t('telegram.codeCopied'))
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (error) {
    uiStore.error(t('telegram.copyError'))
  }
}

const openTelegram = () => {
  const botUsername = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'your_bot'
  window.open(`https://t.me/${botUsername}`, '_blank')
}
</script>

<style scoped>
.telegram-settings {
  @apply w-full;
}
</style>

