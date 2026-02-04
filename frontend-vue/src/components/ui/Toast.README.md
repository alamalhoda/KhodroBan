# Toast Component

کامپوننت Toast برای نمایش پیام‌های اطلاع‌رسانی به کاربر استفاده می‌شود.

## ویژگی‌ها

- ✅ پشتیبانی از ۴ نوع: success, error, warning, info
- ✅ انیمیشن‌های smooth برای ورود و خروج
- ✅ پشتیبانی از RTL/LTR
- ✅ پشتیبانی از Dark Mode
- ✅ Progress bar برای نمایش زمان باقی‌مانده
- ✅ امکان بستن دستی
- ✅ پشتیبانی از چند Toast همزمان
- ✅ Responsive Design
- ✅ Accessibility (ARIA attributes)

## استفاده

### روش ۱: استفاده از Store (مستقیم)

```javascript
import { useUIStore } from '@/stores/ui'

const uiStore = useUIStore()

// روش‌های مختلف
uiStore.success('عملیات با موفقیت انجام شد')
uiStore.error('خطایی رخ داد')
uiStore.warning('لطفاً ورودی‌ها را بررسی کنید')
uiStore.info('اطلاعیه جدید')

// یا با استفاده از showToast
uiStore.showToast({
  message: 'پیام سفارشی',
  type: 'success',
  duration: 3000,
  showProgress: true
})
```

### روش ۲: استفاده از Composable (توصیه می‌شود)

```javascript
import { useToast } from '@/composables/useToast'

const toast = useToast()

// روش‌های مختلف
toast.success('عملیات با موفقیت انجام شد')
toast.error('خطایی رخ داد')
toast.warning('لطفاً ورودی‌ها را بررسی کنید')
toast.info('اطلاعیه جدید')

// یا با استفاده از show
toast.show({
  message: 'پیام سفارشی',
  type: 'success',
  duration: 3000,
  showProgress: true
})
```

## مثال‌های استفاده

### در یک کامپوننت Vue

```vue
<script setup>
import { useToast } from '@/composables/useToast'

const toast = useToast()

const handleSubmit = async () => {
  try {
    await saveData()
    toast.success('داده‌ها با موفقیت ذخیره شد')
  } catch (error) {
    toast.error('خطا در ذخیره داده‌ها')
  }
}
</script>
```

### با i18n

```javascript
import { useToast } from '@/composables/useToast'
import { useI18n } from 'vue-i18n'

const toast = useToast()
const { t } = useI18n()

toast.success(t('auth.loginSuccess'))
toast.error(t('auth.loginError'))
```

## تنظیمات

### duration
مدت زمان نمایش Toast به میلی‌ثانیه (پیش‌فرض: 5000)

```javascript
toast.success('پیام', 3000) // 3 ثانیه
toast.error('خطا', 0) // بدون auto-dismiss
```

### showProgress
نمایش progress bar (پیش‌فرض: true)

```javascript
toast.show({
  message: 'در حال پردازش...',
  type: 'info',
  duration: 0, // بدون auto-dismiss
  showProgress: false // بدون progress bar
})
```

## موقعیت نمایش

Toast‌ها در بالای صفحه و در مرکز نمایش داده می‌شوند. در موبایل، از لبه‌های صفحه فاصله دارند.

## Accessibility

- استفاده از `role="alert"` برای پیام‌های مهم
- استفاده از `aria-live` برای به‌روزرسانی‌های زنده
- پشتیبانی از keyboard navigation
- Label مناسب برای دکمه بستن

## استایل‌ها

Toast‌ها به صورت خودکار با تم Dark/Light سازگار می‌شوند و از Material Symbols Icons استفاده می‌کنند.

