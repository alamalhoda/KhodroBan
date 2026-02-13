<!-- SmartAssistantView.vue -->
<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import MainLayout from '../components/MainLayout.vue'
import VehicleFilterSelect from '../components/VehicleFilterSelect.vue'
import { useAIStore } from '../stores/ai'
import { useAuthStore } from '../stores/auth'
import { useVehicleStore } from '../stores/vehicle'

const { t } = useI18n()
const aiStore = useAIStore()
const authStore = useAuthStore()
const vehicleStore = useVehicleStore()

const userInput = ref('')
const chatContainerRef = ref(null)

const userName = computed(() => {
  const user = authStore.user
  if (user?.firstName) return user.firstName
  if (user?.name) return user.name.split(' ')[0] || 'کاربر'
  return t('common.user')
})

const selectedVehicle = computed(() => vehicleStore.selectedVehicle)
const vehicles = computed(() => vehicleStore.vehicles || [])
const selectedVehicleLabel = computed(() => {
  const v = selectedVehicle.value
  if (!v) return t('smartAssistant.noVehicle')
  return `${v.model || ''} - ${v.year || ''}`.trim() || v.model
})

const messages = computed(() => aiStore.messages)
const isLoading = computed(() => aiStore.isLoading)
const error = computed(() => aiStore.error)

const welcomeMessage = computed(() => {
  const name = userName.value
  const vehicle = selectedVehicleLabel.value
  const v = vehicle && vehicle !== t('smartAssistant.noVehicle') ? vehicle : t('smartAssistant.noVehicle')
  return t('smartAssistant.welcome', { name, vehicle: v })
})

const suggestionChips = computed(() => [
  t('smartAssistant.suggestions.brakeCost'),
  t('smartAssistant.suggestions.nearestShop'),
])

function selectVehicle(id) {
  vehicleStore.selectVehicle(id)
}

async function sendMessage(text) {
  const toSend = (text || userInput.value || '').trim()
  if (!toSend) return
  userInput.value = ''
  try {
    await aiStore.sendMessage(toSend)
    await nextTick()
    scrollChatToBottom()
  } catch {
    // خطا در استور و در UI نمایش داده می‌شود
  }
}

function onSuggestionClick(suggestion) {
  sendMessage(suggestion)
}

function scrollChatToBottom() {
  nextTick(() => {
    const el = chatContainerRef.value
    if (el) el.scrollTop = el.scrollHeight
  })
}

onMounted(() => {
  if (vehicles.value.length && !selectedVehicle.value) {
    vehicleStore.selectVehicle(vehicles.value[0].id)
  }
})
</script>

<template>
  <MainLayout>
    <div class="flex flex-col h-full -m-2 md:-m-4 bg-background-light dark:bg-background-dark text-text-main font-body overflow-hidden rounded-xl">
      <!-- Header چت -->
      <header class="glass dark:bg-white/5 sticky top-0 z-10 border-b border-border flex flex-col gap-4 px-4 py-4 md:px-6 md:py-5 shrink-0">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex flex-col gap-1">
            <div class="flex items-center gap-2">
              <h2 class="text-text-main dark:text-white text-xl md:text-2xl font-black tracking-tight">
                {{ t('smartAssistant.title') }}
              </h2>
              <span class="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] px-2 py-0.5 rounded-full font-bold border border-green-200 dark:border-green-800">
                {{ t('smartAssistant.online') }}
              </span>
            </div>
            <p class="text-text-muted dark:text-gray-400 text-sm">
              {{ t('smartAssistant.subtitle') }}
            </p>
          </div>
        </div>
        <!-- انتخاب خودرو -->
        <div class="flex flex-wrap items-center gap-2">
          <VehicleFilterSelect
            :model-value="selectedVehicle?.id ?? ''"
            :show-all-option="true"
            :all-option-label="t('smartAssistant.noVehicle')"
            @update:model-value="(id) => vehicleStore.selectVehicle(id || null)"
            min-width="min-w-[180px]"
          />
          <router-link
            to="/vehicle-list"
            class="flex h-[42px] shrink-0 items-center justify-center gap-2 rounded-xl bg-white dark:bg-white/10 border border-dashed border-border px-4 hover:border-primary/50 hover:text-primary text-text-muted dark:text-gray-400 text-xs font-medium transition-colors"
          >
            <span class="material-symbols-outlined text-[18px]">add</span>
            {{ t('smartAssistant.addVehicle') }}
          </router-link>
        </div>
      </header>

      <!-- ناحیه چت -->
      <div
        ref="chatContainerRef"
        role="log"
        aria-live="polite"
        aria-label="لیست پیام‌های چت با مشاور هوشمند"
        class="flex-1 overflow-y-auto px-4 py-6 md:px-6 md:py-8 flex flex-col gap-6"
      >
        <!-- جداکننده تاریخ -->
        <div class="flex justify-center shrink-0">
          <span class="bg-gray-100 dark:bg-gray-700/50 text-text-muted dark:text-gray-400 text-[10px] px-3 py-1 rounded-full font-medium">
            {{ t('smartAssistant.today') }}
          </span>
        </div>

        <!-- پیام خوش‌آمد (فقط وقتی هیچ پیامی نیست) -->
        <div
          v-if="messages.length === 0"
          class="flex gap-4 max-w-[85%] md:max-w-[70%] self-start group"
        >
          <div class="bg-gradient-to-br from-primary to-blue-600 rounded-2xl size-10 shrink-0 flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-blue-900/30" aria-hidden="true">
            <span class="material-symbols-outlined text-white text-xl">smart_toy</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-text-main dark:text-white text-xs font-bold mr-1">{{ t('smartAssistant.agentName') }}</span>
            <div class="bg-white dark:bg-white/10 p-4 rounded-2xl rounded-tr-none shadow-sm text-sm leading-7 text-gray-700 dark:text-gray-300 border border-border dark:border-white/10">
              <p>{{ welcomeMessage }}</p>
            </div>
          </div>
        </div>

        <!-- لیست پیام‌ها -->
        <template v-for="msg in messages" :key="msg.id">
          <!-- پیام کاربر -->
          <div
            v-if="msg.role === 'user'"
            class="flex gap-3 max-w-[85%] md:max-w-[70%] self-end flex-row-reverse"
          >
            <div class="bg-gray-200 dark:bg-gray-600 rounded-2xl size-10 shrink-0 flex items-center justify-center overflow-hidden" aria-hidden="true">
              <span class="material-symbols-outlined text-gray-600 dark:text-gray-300">person</span>
            </div>
            <div class="flex flex-col gap-1 items-end">
              <div class="bg-primary text-white p-4 rounded-2xl rounded-tl-none shadow-md text-sm leading-relaxed">
                <p>{{ msg.text }}</p>
              </div>
              <span class="text-text-muted dark:text-gray-500 text-[10px] dir-ltr mr-1">
                {{ new Date(msg.timestamp).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }) }}
              </span>
            </div>
          </div>

          <!-- پیام مدل / خطا -->
          <div
            v-else
            class="flex gap-4 max-w-[85%] md:max-w-[70%] self-start items-end"
          >
            <div class="bg-gradient-to-br from-primary to-blue-600 rounded-2xl size-10 shrink-0 flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-blue-900/30 mb-1" aria-hidden="true">
              <span class="material-symbols-outlined text-white text-xl">smart_toy</span>
            </div>
            <div class="flex flex-col gap-2 w-full">
              <div
                class="bg-white dark:bg-white/10 p-4 rounded-2xl rounded-tr-none shadow-sm text-sm leading-7 border border-border dark:border-white/10"
                :class="msg.isError ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'"
              >
                <p class="whitespace-pre-wrap">{{ msg.text }}</p>
              </div>
            </div>
          </div>
        </template>

        <!-- وضعیت در حال تایپ -->
        <div
          v-if="isLoading"
          class="flex gap-4 max-w-[85%] md:max-w-[70%] self-start items-end"
        >
          <div class="bg-gradient-to-br from-primary to-blue-600 rounded-2xl size-10 shrink-0 flex items-center justify-center shadow-lg mb-1" aria-hidden="true">
            <span class="material-symbols-outlined text-white text-xl">smart_toy</span>
          </div>
          <div class="bg-white dark:bg-white/10 p-4 rounded-2xl rounded-tr-none shadow-sm border border-border dark:border-white/10 text-text-muted dark:text-gray-400 text-sm">
            {{ t('smartAssistant.loading') }}
          </div>
        </div>
      </div>

      <!-- نوار ورودی -->
      <div class="p-4 md:p-6 pb-6 relative z-20 shrink-0">
        <div class="absolute bottom-full left-0 right-0 px-6 pb-2 flex gap-2 overflow-x-auto no-scrollbar mask-gradient-top pointer-events-none">
          <div class="flex gap-2 pointer-events-auto">
            <button
              v-for="(chip, i) in suggestionChips"
              :key="i"
              type="button"
              class="bg-white/90 dark:bg-white/10 backdrop-blur border border-border text-text-muted hover:text-primary hover:border-primary/50 px-3 py-1.5 rounded-lg text-xs transition-all shadow-sm"
              @click="onSuggestionClick(chip)"
            >
              {{ chip }}
            </button>
          </div>
        </div>
        <div class="glass dark:bg-white/5 border border-white/50 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-2 flex items-end gap-2 relative ring-1 ring-black/5 focus-within:ring-primary/50 transition-all">
          <button
            type="button"
            class="p-3 text-text-muted hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors shrink-0"
            :title="t('smartAssistant.attach')"
            aria-label="افزودن عکس یا فایل"
          >
            <span class="material-symbols-outlined">attach_file</span>
          </button>
          <textarea
            v-model="userInput"
            class="w-full bg-transparent border-none focus:ring-0 p-3 text-sm text-text-main dark:text-white placeholder:text-gray-400 dark:placeholder-gray-500 resize-none max-h-32 min-h-[44px]"
            :placeholder="t('smartAssistant.placeholder')"
            rows="1"
            style="field-sizing: content;"
            aria-label="متن پیام"
            @keydown.enter.exact.prevent="sendMessage()"
          />
          <button
            type="button"
            class="p-3 text-text-muted hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors shrink-0"
            :title="t('smartAssistant.voice')"
            aria-label="ورودی صوتی"
          >
            <span class="material-symbols-outlined">mic</span>
          </button>
          <button
            type="button"
            class="bg-primary hover:bg-blue-600 text-white p-3 rounded-xl shadow-lg shadow-blue-200 dark:shadow-blue-900/30 hover:shadow-blue-300 transition-all active:scale-95 shrink-0 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            :title="t('smartAssistant.send')"
            :disabled="isLoading || !userInput.trim()"
            aria-label="ارسال پیام"
            @click="sendMessage()"
          >
            <span class="material-symbols-outlined -rotate-180">send</span>
          </button>
        </div>
        <p class="text-center text-[10px] text-text-muted dark:text-gray-500 mt-3">
          {{ t('smartAssistant.disclaimer') }}
        </p>
      </div>
    </div>
  </MainLayout>
</template>
