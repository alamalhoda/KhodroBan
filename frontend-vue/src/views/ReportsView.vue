<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import MainLayout from '../components/MainLayout.vue'
import { useReportStore } from '../stores/report'
import { useVehicleStore } from '../stores/vehicle'
import { serviceService, expenseService } from '../services'
import { formatCurrency, formatDate } from '@/utils/formatters'

const reportStore = useReportStore()
const vehicleStore = useVehicleStore()

const recentItems = ref([])
const recentLoading = ref(false)

const categoryLabelMap = {
  fuel: 'سوخت',
  wash: 'شستشو',
  parking: 'پارک',
  toll: 'عوارض',
  minor_repair: 'تعمیر',
  other: 'سایر'
}

const serviceTypeLabelMap = {
  oil_change: 'تعویض روغن',
  filter: 'فیلتر',
  brakes: 'ترمز',
  battery: 'باتری',
  tire: 'لاستیک',
  alignment: 'فرمان',
  suspension: 'تعلیق',
  transmission: 'گیربکس',
  cooling: 'خنک‌کننده',
  electrical: 'برق',
  ac: 'کولر',
  exhaust: 'اگزوز',
  clutch: 'کلاچ',
  body: 'بدنه',
  glass: 'شیشه',
  lighting: 'روشنایی',
  other: 'سایر'
}

function getCategoryLabel(key) {
  if (!key) return '—'
  if (key.startsWith('service_')) return 'سرویس'
  if (serviceTypeLabelMap[key]) return serviceTypeLabelMap[key]
  return categoryLabelMap[key] || key
}

const summary = computed(() => reportStore.reportData || {})
const costByMonth = computed(() => summary.value.costByMonth || [])
const costByCategory = computed(() => summary.value.costByCategory || {})
const totalCost = computed(() => summary.value.totalCost ?? 0)
const totalKm = computed(() => summary.value.totalKm ?? 0)

const fuelCost = computed(() => {
  const key = Object.keys(costByCategory.value).find(k => k === 'fuel' || k.includes('fuel'))
  return key ? costByCategory.value[key] : 0
})

const serviceCost = computed(() => {
  return Object.entries(costByCategory.value)
    .filter(([k]) => k.startsWith('service_'))
    .reduce((sum, [, v]) => sum + v, 0)
})

const costPerKm = computed(() => {
  if (!totalKm.value || totalKm.value <= 0) return null
  return Math.round(totalCost.value / totalKm.value)
})

const categoryWithPercent = computed(() => {
  const total = totalCost.value || 1
  return Object.entries(costByCategory.value).map(([key, amount]) => ({
    key,
    label: getCategoryLabel(key),
    amount,
    percent: Math.round((amount / total) * 100)
  })).sort((a, b) => b.percent - a.percent)
})

const maxMonthAmount = computed(() => {
  if (!costByMonth.value.length) return 1
  return Math.max(...costByMonth.value.map(m => m.amount), 1)
})

async function loadRecentItems() {
  recentLoading.value = true
  try {
    const vehicleId = reportStore.filters.vehicleId || undefined
    const [services, expenses] = await Promise.all([
      serviceService.getAll(vehicleId),
      expenseService.getAll(vehicleId)
    ])
    const merged = [
      ...services.map(s => ({ type: 'service', date: s.date, category: typeof s.type === 'string' ? s.type : (s.types && s.types[0]) || 'other', amount: s.cost, vehicleId: s.vehicleId })),
      ...expenses.map(e => ({ type: 'expense', date: e.date, category: e.category || 'other', amount: e.amount, vehicleId: e.vehicleId }))
    ]
    merged.sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    recentItems.value = merged.slice(0, 20)
  } catch {
    recentItems.value = []
  } finally {
    recentLoading.value = false
  }
}

function vehicleName(id) {
  if (!id) return '—'
  const v = vehicleStore.vehicles.find(x => x.id === String(id))
  return v ? (v.model || v.plateNumber || id) : id
}

onMounted(async () => {
  if (!vehicleStore.vehicles.length) await vehicleStore.fetchVehicles().catch(() => {})
  await reportStore.fetchReportData().catch(() => {})
  loadRecentItems()
})

watch(() => reportStore.filters.vehicleId, () => {
  reportStore.fetchReportData().catch(() => {})
  loadRecentItems()
})

watch(() => reportStore.filters.dateRange, () => {
  reportStore.fetchReportData().catch(() => {})
})
</script>

<template>
  <MainLayout>
    <div class="flex flex-col gap-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div class="flex flex-wrap gap-2">
          <a class="text-[#666e85] dark:text-gray-400 hover:text-primary text-sm font-medium leading-normal" href="#">خانه</a>
          <span class="text-[#666e85] dark:text-gray-600 text-sm font-medium leading-normal">/</span>
          <span class="text-[#121317] dark:text-white text-sm font-medium leading-normal">گزارش‌ها</span>
        </div>
        <div class="flex gap-3">
          <div class="relative">
            <select
              :value="reportStore.filters.vehicleId ?? ''"
              class="appearance-none bg-white dark:bg-[#1e2330] border border-[#dcdfe4] dark:border-[#2a2f3d] text-[#121317] dark:text-white text-sm rounded-lg pl-3 pr-8 py-2 focus:ring-primary focus:border-primary text-right w-full min-w-[160px]"
              dir="rtl"
              @change="reportStore.updateFilters({ vehicleId: $event.target.value || null })"
            >
              <option value="">همه خودروها</option>
              <option v-for="v in vehicleStore.vehicles" :key="v.id" :value="v.id">{{ v.model || v.plateNumber || v.id }}</option>
            </select>
            <span class="material-symbols-outlined absolute left-2 top-2.5 text-gray-500 pointer-events-none text-[20px]">expand_more</span>
          </div>
          <div class="relative">
            <select
              :value="reportStore.filters.dateRange"
              class="appearance-none bg-white dark:bg-[#1e2330] border border-[#dcdfe4] dark:border-[#2a2f3d] text-[#121317] dark:text-white text-sm rounded-lg pl-3 pr-8 py-2 focus:ring-primary focus:border-primary text-right w-full min-w-[160px]"
              dir="rtl"
              @change="reportStore.updateFilters({ dateRange: $event.target.value })"
            >
              <option value="last30days">۳۰ روز گذشته</option>
              <option value="thisYear">امسال (تا امروز)</option>
              <option value="lastYear">سال گذشته</option>
            </select>
            <span class="material-symbols-outlined absolute left-2 top-2.5 text-gray-500 pointer-events-none text-[20px]">calendar_today</span>
          </div>
        </div>
      </div>

      <div v-if="reportStore.error" class="glass-panel border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center justify-between">
        <p class="text-red-600 dark:text-red-400 text-sm">{{ reportStore.error }}</p>
        <button type="button" class="text-primary text-sm font-medium hover:underline" @click="reportStore.fetchReportData()">تلاش مجدد</button>
      </div>
      <div v-if="reportStore.isLoading" class="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">در حال بارگذاری گزارش…</div>
      <template v-else>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="glass-panel border border-[#dcdfe4] dark:border-[#2a2f3d] rounded-xl p-5 shadow-sm">
              <div class="flex justify-between items-start mb-4">
                <div class="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-primary">
                  <span class="material-symbols-outlined">payments</span>
                </div>
              </div>
              <p class="text-[#666e85] dark:text-gray-400 text-sm font-medium">کل هزینه‌ها</p>
              <h3 class="text-[#121317] dark:text-white text-2xl font-bold mt-1">{{ formatCurrency(totalCost) }} تومان</h3>
            </div>
            <div class="glass-panel border border-[#dcdfe4] dark:border-[#2a2f3d] rounded-xl p-5 shadow-sm">
              <div class="flex justify-between items-start mb-4">
                <div class="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600">
                  <span class="material-symbols-outlined">local_gas_station</span>
                </div>
              </div>
              <p class="text-[#666e85] dark:text-gray-400 text-sm font-medium">هزینه سوخت</p>
              <h3 class="text-[#121317] dark:text-white text-2xl font-bold mt-1">{{ formatCurrency(fuelCost) }} تومان</h3>
            </div>
            <div class="glass-panel border border-[#dcdfe4] dark:border-[#2a2f3d] rounded-xl p-5 shadow-sm">
              <div class="flex justify-between items-start mb-4">
                <div class="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600">
                  <span class="material-symbols-outlined">build</span>
                </div>
              </div>
              <p class="text-[#666e85] dark:text-gray-400 text-sm font-medium">سرویس و نگهداری</p>
              <h3 class="text-[#121317] dark:text-white text-2xl font-bold mt-1">{{ formatCurrency(serviceCost) }} تومان</h3>
            </div>
            <div class="glass-panel border border-[#dcdfe4] dark:border-[#2a2f3d] rounded-xl p-5 shadow-sm">
              <div class="flex justify-between items-start mb-4">
                <div class="p-2 bg-teal-50 dark:bg-teal-900/20 rounded-lg text-teal-600">
                  <span class="material-symbols-outlined">speed</span>
                </div>
              </div>
              <p class="text-[#666e85] dark:text-gray-400 text-sm font-medium">هزینه به ازای کیلومتر</p>
              <h3 class="text-[#121317] dark:text-white text-2xl font-bold mt-1">{{ costPerKm != null ? formatCurrency(costPerKm) + ' تومان' : '—' }}</h3>
            </div>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 glass-panel border border-[#dcdfe4] dark:border-[#2a2f3d] rounded-xl p-6 shadow-sm">
              <h3 class="text-[#121317] dark:text-white text-lg font-bold mb-6">روندهای ماهانه هزینه‌ها</h3>
              <div v-if="!costByMonth.length" class="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">داده‌ای وجود ندارد</div>
              <div v-else class="relative h-64 w-full flex items-end justify-between gap-2 md:gap-4 pt-8">
                <div class="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
                  <div class="w-full h-px bg-gray-100 dark:bg-gray-700 border-t border-dashed border-gray-200 dark:border-gray-700"></div>
                  <div class="w-full h-px bg-gray-100 dark:bg-gray-700 border-t border-dashed border-gray-200 dark:border-gray-700"></div>
                  <div class="w-full h-px bg-gray-100 dark:bg-gray-700 border-t border-dashed border-gray-200 dark:border-gray-700"></div>
                  <div class="w-full h-px bg-gray-200 dark:bg-gray-600"></div>
                </div>
                <div v-for="(item, i) in costByMonth" :key="item.month || i" class="flex flex-col items-center flex-1 gap-2 z-10 group">
                  <div
                    class="w-full max-w-[40px] rounded-t-md transition-colors relative flex items-end justify-center"
                    :class="item.amount >= maxMonthAmount ? 'bg-primary shadow-lg' : 'bg-primary/20 dark:bg-primary/40 hover:bg-primary/80'"
                    :style="{ height: Math.max(8, (item.amount / maxMonthAmount) * 100) + '%' }"
                  >
                    <div class="opacity-0 group-hover:opacity-100 absolute -top-8 bg-black text-white text-xs px-2 py-1 rounded transition-opacity whitespace-nowrap z-20">{{ formatCurrency(item.amount) }}</div>
                  </div>
                  <span class="text-xs text-gray-500 dark:text-gray-400 truncate max-w-full">{{ item.month }}</span>
                </div>
              </div>
            </div>
            <div class="lg:col-span-1 glass-panel border border-[#dcdfe4] dark:border-[#2a2f3d] rounded-xl p-6 shadow-sm flex flex-col">
              <h3 class="text-[#121317] dark:text-white text-lg font-bold mb-6">تفکیک هزینه‌ها</h3>
              <div v-if="!categoryWithPercent.length" class="text-gray-500 dark:text-gray-400 text-sm py-4">داده‌ای وجود ندارد</div>
              <div v-else class="flex flex-col gap-5 justify-center flex-1">
                <div v-for="(cat, idx) in categoryWithPercent" :key="cat.key">
                  <div class="flex justify-between text-sm mb-2">
                    <div class="flex items-center gap-2">
                      <div class="size-3 rounded-full" :class="['bg-orange-500', 'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-teal-500', 'bg-gray-400'][idx % 6]"></div>
                      <span class="text-gray-600 dark:text-gray-300">{{ cat.label }}</span>
                    </div>
                    <span class="font-bold text-[#121317] dark:text-white">{{ cat.percent }}٪</span>
                  </div>
                  <div class="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                    <div
                      class="h-2 rounded-full"
                      :class="['bg-orange-500', 'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-teal-500', 'bg-gray-400'][idx % 6]"
                      :style="{ width: cat.percent + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 flex flex-col gap-4">
              <h3 class="text-[#121317] dark:text-white text-lg font-bold">هزینه‌های اخیر</h3>
              <div class="bg-white dark:bg-[#1e2330] rounded-xl border border-[#dcdfe4] dark:border-[#2a2f3d] shadow-sm overflow-hidden">
                <div v-if="recentLoading" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400 text-sm">در حال بارگذاری…</div>
                <div v-else class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-[#252a38]">
                      <tr>
                        <th class="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">تاریخ</th>
                        <th class="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">دسته‌بندی</th>
                        <th class="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">خودرو</th>
                        <th class="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">مبلغ</th>
                      </tr>
                    </thead>
                    <tbody class="bg-white dark:bg-[#1e2330] divide-y divide-gray-200 dark:divide-gray-700">
                      <tr v-for="(row, i) in recentItems" :key="i">
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium text-start">{{ formatDate(row.date) }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-start">{{ getCategoryLabel(row.category) }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-start">{{ vehicleName(row.vehicleId) }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white text-start">{{ formatCurrency(row.amount) }} تومان</td>
                      </tr>
                      <tr v-if="!recentItems.length">
                        <td colspan="4" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400 text-sm">هزینه‌ای ثبت نشده است.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div v-if="recentItems.length" class="bg-gray-50 dark:bg-[#252a38] px-6 py-3 border-t border-gray-200 dark:border-gray-700">
                  <p class="text-sm text-gray-500 dark:text-gray-400">نمایش {{ recentItems.length }} رکورد اخیر</p>
                </div>
              </div>
            </div>
            <div class="lg:col-span-1 flex flex-col gap-6">
              <h3 class="text-[#121317] dark:text-white text-lg font-bold">صادرات گزارش‌ها</h3>
              <div class="bg-white dark:bg-[#1e2330] rounded-xl border border-[#dcdfe4] dark:border-[#2a2f3d] shadow-sm p-5">
                <div class="flex items-center gap-3 mb-3">
                  <div class="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg text-green-700 dark:text-green-400">
                    <span class="material-symbols-outlined">table_view</span>
                  </div>
                  <div>
                    <h4 class="font-bold text-[#121317] dark:text-white">خروجی CSV</h4>
                    <p class="text-xs text-gray-500 dark:text-gray-400">فرمت صفحه گسترده پایه</p>
                  </div>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  دانلود لیست کاملی از هزینه‌های شما سازگار با اکسل و گوگل شیت.
                </p>
                <button
                  type="button"
                  class="w-full py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-[#121317] dark:text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  @click="reportStore.exportReport('csv')"
                >
                  <span class="material-symbols-outlined text-[18px]">download</span>
                  دانلود CSV
                </button>
              </div>
              <div class="bg-gradient-to-br from-[#121620] to-[#1e3b8a] rounded-xl shadow-lg p-5 text-white relative overflow-hidden group">
                <div class="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-700"></div>
                <div class="relative z-10">
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-2 text-yellow-400">
                      <span class="material-symbols-outlined">star</span>
                      <span class="text-xs font-bold uppercase tracking-wider">Pro</span>
                    </div>
                    <span class="material-symbols-outlined text-white/50">lock</span>
                  </div>
                  <div class="flex items-center gap-3 mb-2">
                    <div class="bg-white/10 p-2 rounded-lg text-white">
                      <span class="material-symbols-outlined">picture_as_pdf</span>
                    </div>
                    <h4 class="font-bold text-white text-lg">گزارش‌های PDF</h4>
                  </div>
                  <p class="text-sm text-gray-300 mb-4">ایجاد گزارش‌های حرفه‌ای PDF مناسب برای ادعای بیمه یا فروش خودرو.</p>
                  <button class="w-full py-2.5 bg-white text-[#121620] text-sm font-bold rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                    ارتقا برای باز کردن قفل
                  </button>
                </div>
              </div>
            </div>
          </div>
      </template>
    </div>
  </MainLayout>
</template>
