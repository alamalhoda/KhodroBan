# راهنمای تست Accessibility Utilities

این راهنمای عملی برای تست composableهای Accessibility در کامپوننت‌های موجود است.

## 🧪 تست‌های پیشنهادی

### 1. تست useSkipLink در App.vue
**هدف:** اضافه کردن skip links برای navigation

**مراحل:**
1. Skip links به صورت خودکار در App.vue اضافه می‌شوند
2. با Tab key در ابتدای صفحه، skip link ظاهر می‌شود
3. با Enter می‌توانید به main content یا navigation بروید

**نحوه تست:**
- صفحه را باز کنید
- Tab را بزنید
- باید skip link در بالای صفحه ظاهر شود
- Enter را بزنید تا به main content بروید

---

### 2. تست useKeyboardNavigation در LoginView
**هدف:** مدیریت keyboard navigation در فرم Login

**مراحل:**
1. Escape key برای بستن/لغو
2. Enter key برای submit (در صورت focus روی button)
3. Arrow keys برای navigation در لیست‌ها (اگر وجود داشته باشد)

**نحوه تست:**
- به صفحه Login بروید
- Escape را بزنید (اگر modal یا dropdown باز است)
- Enter را روی دکمه Login بزنید

---

### 3. تست useFocusTrap در Modal
**هدف:** Trap کردن focus در modal

**مراحل:**
1. وقتی modal باز می‌شود، focus trap فعال می‌شود
2. Tab key فقط در داخل modal حرکت می‌کند
3. Shift+Tab برای حرکت به عقب

**نحوه تست:**
- یک modal باز کنید
- Tab را بزنید - باید فقط در داخل modal حرکت کند
- Shift+Tab را بزنید - باید به عقب برگردد
- Escape را بزنید - modal باید بسته شود

---

### 4. تست useFocus در کامپوننت‌ها
**هدف:** مدیریت programmatic focus

**مراحل:**
1. Focus کردن روی input بعد از باز شدن modal
2. Focus کردن روی اولین element در container
3. Focus کردن روی آخرین element در container

**نحوه تست:**
- یک modal با input باز کنید
- باید به صورت خودکار روی اولین input focus شود
- Tab را بزنید تا به element بعدی بروید

---

### 5. تست useAria در Button
**هدف:** بهبود ARIA attributes

**مراحل:**
1. Button با icon-only باید aria-label داشته باشد
2. Button در حالت loading باید aria-busy داشته باشد
3. Button disabled باید aria-disabled داشته باشد

**نحوه تست:**
- یک Button با icon-only را با Screen Reader تست کنید
- یک Button در حالت loading را تست کنید
- یک Button disabled را تست کنید

---

### 6. تست useReducedMotion در App.vue
**هدف:** احترام به ترجیحات کاربر برای reduced motion

**مراحل:**
1. سیستم را روی "Reduce Motion" تنظیم کنید
2. انیمیشن‌ها باید غیرفعال شوند

**نحوه تست:**
- در macOS: System Preferences > Accessibility > Display > Reduce Motion
- در Windows: Settings > Ease of Access > Display > Show animations
- صفحه را refresh کنید
- انیمیشن‌ها باید غیرفعال شوند

---

### 7. تست useColorContrast
**هدف:** بررسی color contrast برای WCAG compliance

**مراحل:**
1. استفاده از utility functions برای بررسی contrast
2. تست رنگ‌های مختلف در کامپوننت‌ها

**نحوه تست:**
- در console مرورگر:
```javascript
import { useColorContrast } from '@/composables'
const { getContrastRatio, isAACompliant } = useColorContrast()

// تست contrast
getContrastRatio('#000000', '#ffffff') // باید 21:1 باشد
isAACompliant('#000000', '#ffffff', 'normal') // باید true باشد
```

---

## 🎯 چک‌لیست تست

- [ ] Skip links کار می‌کنند
- [ ] Keyboard navigation در Login کار می‌کند
- [ ] Focus trap در Modal کار می‌کند
- [ ] Programmatic focus کار می‌کند
- [ ] ARIA attributes در Button درست هستند
- [ ] Reduced motion کار می‌کند
- [ ] Color contrast قابل بررسی است

---

## 🔧 ابزارهای تست

### Screen Reader
- **macOS:** VoiceOver (Cmd+F5)
- **Windows:** NVDA (رایگان) یا JAWS
- **Chrome:** ChromeVox Extension

### Keyboard Navigation
- Tab: حرکت به جلو
- Shift+Tab: حرکت به عقب
- Enter/Space: فعال‌سازی
- Escape: بستن modal/dropdown
- Arrow keys: حرکت در لیست‌ها

### Browser DevTools
- **Accessibility Panel:** Chrome DevTools > Elements > Accessibility
- **Lighthouse:** Chrome DevTools > Lighthouse > Accessibility

---

## 📝 گزارش باگ

اگر مشکلی پیدا کردید:
1. مرورگر و نسخه را مشخص کنید
2. مراحل بازتولید را بنویسید
3. Screenshot یا video اضافه کنید
4. Console errors را کپی کنید

