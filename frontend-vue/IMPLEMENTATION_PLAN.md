# برنامه عملیاتی اجرایی‌سازی واسط کاربری جدید

## 📋 خلاصه وضعیت فعلی

### ✅ کارهای انجام شده
- [x] ایجاد کامپوننت `MainLayout` با سایدبار و هدر
- [x] تبدیل صفحات اصلی به قالب یکسان:
  - DashboardView
  - VehicleListView
  - RemindersView
  - ReportsView
  - SettingsView
- [x] اصلاح لینک‌های سایدبار با `router-link`
- [x] ساختار پایه State Management با Pinia
- [x] **احراز هویت (Authentication)**
  - [x] اتصال `authStore.login()` به `authService` با Supabase
  - [x] اتصال `authStore.register()` به `authService`
  - [x] اتصال `authStore.logout()` به `authService`
  - [x] پیاده‌سازی `authStore.loginWithGoogle()` برای OAuth
  - [x] ایجاد `AuthCallbackView` برای handle کردن OAuth callback
  - [x] بهبود error handling برای خطاهای شبکه در authService
  - [x] مدیریت Session و Token Storage
  - [x] اتصال فرم Login به `authStore.login()`
  - [x] اتصال فرم Login به `authStore.loginWithGoogle()`
- [x] Route Guards برای صفحات محافظت شده
- [x] محلی‌سازی فونت Material Symbols Outlined
- [x] **پشتیبانی چندزبانه (i18n Infrastructure)**
  - [x] نصب و پیکربندی vue-i18n
  - [x] ایجاد فایل‌های ترجمه (fa.json, en.json, ar.json)
  - [x] پیکربندی i18n در main.js با مدیریت RTL/LTR
  - [x] ایجاد کامپوننت LanguageSwitcher و LanguageSwitcherCard
  - [x] چندزبانه کردن صفحات Login و SignUp
  - [x] ذخیره زبان انتخابی در localStorage
  - [x] بارگذاری زبان از localStorage در startup
- [x] **Toast Component**
  - [x] ایجاد کامپوننت Toast.vue با پشتیبانی از ۴ نوع (success, error, warning, info)
  - [x] ایجاد کامپوننت ToastContainer.vue برای نمایش چند Toast همزمان
  - [x] بهبود UI Store با helper methods (success, error, warning, info)
  - [x] ایجاد composable useToast برای استفاده آسان‌تر
  - [x] پشتیبانی از RTL/LTR و Dark Mode
  - [x] انیمیشن‌های smooth و Progress bar
  - [x] Accessibility (ARIA attributes)
  - [x] Responsive Design
  - [x] تست در صفحات Login/SignUp
- [x] **Semantic HTML Components**
  - [x] ایجاد کامپوننت Button.vue با Semantic HTML
  - [x] ایجاد کامپوننت Input.vue با Semantic HTML
  - [x] ایجاد کامپوننت Select.vue با Semantic HTML
  - [x] بهبود کامپوننت Card.vue با Semantic HTML
  - [x] ایجاد کامپوننت Form.vue با Semantic HTML
  - [x] یکپارچه‌سازی در صفحات Login و SignUp
  - [x] پشتیبانی از Accessibility (ARIA attributes)
  - [x] پشتیبانی از RTL/LTR
  - [x] تست در صفحات Login/SignUp
- [x] **Accessibility Utilities**
  - [x] ایجاد composable useKeyboardNavigation برای مدیریت keyboard navigation
  - [x] ایجاد composable useFocusTrap برای trap کردن focus در modalها
  - [x] ایجاد composable useFocus برای مدیریت focus programmatically
  - [x] ایجاد composable useSkipLink برای ایجاد skip links
  - [x] ایجاد composable useAria برای helper ARIA attributes
  - [x] ایجاد composable useReducedMotion برای پشتیبانی از prefers-reduced-motion
  - [x] ایجاد composable useColorContrast برای بررسی color contrast
  - [x] ایجاد فایل index.js برای export مرکزی
  - [x] ایجاد مستندات ACCESSIBILITY.md
  - [x] یکپارچه‌سازی در App.vue (Skip Links, Reduced Motion)
  - [x] یکپارچه‌سازی در Modal.vue (Focus Trap, Keyboard Navigation)
  - [x] یکپارچه‌سازی در LoginView.vue (Keyboard Navigation, Auto Focus)
  - [x] تست و رفع باگ‌ها
- [x] **بهبود انطباق با قوانین و Testing** (۱۴۰۳/۰۹)
  - [x] افزودن JSDoc به کامپوننت‌های UI (Button, Input, Card, Modal, Select, LoadingSpinner, Toast) برای props و emits
  - [x] نصب و پیکربندی rollup-plugin-visualizer برای تحلیل Bundle Size؛ گزارش در `dist/stats.html`
  - [x] ایجاد `src/utils/formatters.js` (formatCurrency, formatNumber, formatDate, getRelativeTime) و به‌روزرسانی DashboardView، VehicleDetailsView، ServiceListView، RemindersView
  - [x] راه‌اندازی Testing Infrastructure: Vitest، @vue/test-utils، @vitest/ui، jsdom؛ اسکریپت‌های test، test:ui، test:run، test:coverage، test:watch؛ تکمیل vitest.config.js
  - [x] تست واحد Utilities: `src/utils/formatters.test.js` (formatCurrency، formatNumber، formatDate، getRelativeTime)
  - [x] تست واحد کامپوننت‌های UI: Button، Input، Card، Modal (`src/components/ui/*.test.js`)
  - [x] تست واحد Stores: auth، vehicle، ui، dashboard (`src/stores/*.test.js`) با mock کردن سرویس‌ها
  - [x] تست واحد Views: DashboardView (`src/views/DashboardView.test.js`)
  - [x] Refactoring DashboardView: تقسیم به DashboardHeader، QuickStatsCard، RemindersSection، VehiclesSection، DashboardRightColumn در `src/components/dashboard/`؛ کاهش از ~۵۹۵ به زیر ۲۰۰ خط
  - [x] Refactoring ServiceTypeSelector: تقسیم به ServiceTypeCategory، ServiceTypeSelectorFooter؛ کاهش از ~۲۷۲ به زیر ۲۰۰ خط
- [x] **صفحه گزارش‌ها (Reports) با داده واقعی** (۱۴۰۳/۱۱)
  - [x] Backend: ReportSummaryView با فیلتر `date_from`/`date_to` و `vehicle_id`، خروجی `totalKm` و `costByMonth` فیلترشده؛ تست در `test_reports.py`
  - [x] Shared: reportService پیاده Django (getSummary، exportCSV سمت کلاینت، getMonthlyTrend از خلاصه)
  - [x] report store: فیلتر بازه (۳۰ روز/امسال/سال گذشته) و خودرو، fetchReportData، exportReport('csv')
  - [x] ReportsView: دراپ‌دان خودرو و بازه، چهار کارت خلاصه، نمودار روند ماهانه، تفکیک هزینه، جدول هزینه‌های اخیر، دکمه دانلود CSV، حالت بارگذاری و خطا
  - [x] مستندات: API_CONTRACT_REGISTRY، PAGE_REVIEW_LOG، DEMO_SCENARIO به‌روز شده؛ PR به develop ادغام شده

### ⚠️ کارهای ناتمام

#### Testing
- [ ] تست واحد برای Composables
- [ ] تست Integration برای جریان‌های اصلی کاربر
- [ ] تست E2E با Playwright یا Cypress
- [ ] **تست‌های Backend Integration (اولویت بالا)** ⭐
  - [ ] تست‌های ارتباط با Supabase (دریافت/ارسال اطلاعات، Authentication، Real-time)
  - [ ] تست‌های ارتباط با Django REST API (دریافت/ارسال اطلاعات، Authentication، Error Handling)
  - [ ] تست‌های Cross-Backend Compatibility
  - [ ] پیکربندی Test Infrastructure برای Backend Testing

#### Features
- [ ] تکمیل ترجمه‌های باقی‌مانده در صفحات Service، Expense، Settings
- [ ] بهبود UX ایجاد یادآور پس از ثبت سرویس/هزینه
- [ ] بهبود فرم یادآور - تبدیل فیلد تاریخ محاسبه شده به Date Picker قابل ویرایش
- [ ] پیاده‌سازی کانال‌های یادآوری چندگانه (SMS، Telegram، Push Notification)

#### PWA
- [ ] جایگزینی Icons placeholder با Icons واقعی برای PWA
- [ ] تست PWA در Lighthouse
- [ ] تست Add to Home Screen روی Android/iOS/Desktop

---

## 🎯 استراتژی پیاده‌سازی: رویکرد ترکیبی (Hybrid Approach)

### استراتژی: **"Foundation First, Feature Complete"**

این برنامه از رویکرد ترکیبی استفاده می‌کند که بهترین هر دو رویکرد Feature-Based و Task-Based را ترکیب می‌کند.

### 📊 تحلیل رویکردها

#### رویکرد ۱: Feature-Based (صفحه‌محور)
**مثال:** تکمیل کامل صفحه Login با تمام ویژگی‌ها

**✅ مزایا:**
- تست کامل: می‌توانید یک صفحه را به طور کامل تست کنید
- رضایت فوری: نتیجه قابل مشاهده و استفاده است
- Context حفظ می‌شود: همه کارهای مرتبط با یک صفحه در یک جا
- MVP سریع‌تر: صفحات قابل استفاده زودتر آماده می‌شوند

**❌ معایب:**
- تکرار کد: ممکن است کد مشابه در صفحات مختلف نوشته شود
- Inconsistency: ممکن است صفحات مختلف رفتار متفاوتی داشته باشند
- Refactoring دشوار: اگر بعداً بخواهید یک pattern را تغییر دهید، باید همه صفحات را تغییر دهید

#### رویکرد ۲: Task-Based (وظیفه‌محور)
**مثال:** پیاده‌سازی i18n در همه صفحات

**✅ مزایا:**
- Consistency: همه صفحات یکسان رفتار می‌کنند
- Reusability: کامپوننت‌ها و utilities یکبار نوشته می‌شوند
- Pattern یکسان: یک الگو در همه جا اعمال می‌شود
- Refactoring آسان: تغییر در یک جا، همه جا اعمال می‌شود

**❌ معایب:**
- عدم تکمیل: هیچ صفحه‌ای به طور کامل آماده نمی‌شود
- تست دشوار: نمی‌توانید یک صفحه را به طور کامل تست کنید
- MVP کندتر: صفحات قابل استفاده دیرتر آماده می‌شوند

### 🎯 رویکرد ترکیبی پیشنهادی

**استراتژی:** ابتدا Foundation (زیرساخت مشترک)، سپس Feature Complete (تکمیل صفحات)

#### فاز ۱: Foundation (Infrastructure) - Task-Based
**هدف:** ایجاد زیرساخت مشترک برای همه صفحات

**کارهای Foundation:**
1. ✅ **i18n Infrastructure** (یکبار برای همه) - ۱-۲ روز (تکمیل شده)
2. ✅ **Toast Component** (یکبار برای همه) - ۰.۵ روز (تکمیل شده)
3. ✅ **Semantic HTML Components** (یکبار برای همه) - ۱-۲ روز (تکمیل شده)
4. **Accessibility Utilities** (یکبار برای همه) - ۱ روز (گام بعدی)
5. **PWA Foundation** (اولویت بالا) - ۱ روز

**جمع Foundation:** ۴.۵-۶.۵ روز (۳.۵-۴.۵ روز تکمیل شده)

#### فاز ۲: Feature Complete (صفحه‌محور)
**هدف:** تکمیل کامل هر صفحه با استفاده از Foundation

**ترتیب پیشنهادی:**
1. **صفحه Login** (اولویت بالا) - ۱-۲ روز
   - ساده‌ترین صفحه، پایه برای سایر صفحات
2. **صفحه Dashboard** (اولویت بالا) - ۲-۳ روز
   - صفحه اصلی کاربر، نیاز به داده‌های واقعی
3. **صفحات Vehicle** (اولویت بالا) - ۳-۴ روز
   - Core Feature اصلی، CRUD کامل
4. **صفحات Service** (اولویت بالا) - ۲-۳ روز
   - Multi-step form flow

### 📊 مقایسه زمانی

| رویکرد | زمان | نتیجه |
|--------|------|-------|
| Feature-Based خالص | ۱۲ روز برای ۳ صفحه | بدون Foundation |
| Task-Based خالص | ۱۲ روز | هیچ صفحه‌ای کامل نیست |
| **Hybrid (پیشنهادی)** | **۱۱.۵ روز** | **۳ صفحه کامل + Foundation** |

**نتیجه:** سریع‌تر + کامل‌تر + کم خطاتر ✅

### 📋 چک‌لیست اجرایی

#### مرحله ۱: Foundation (هفته ۱)
```
✅ i18n Infrastructure (تکمیل شده)
✅ Toast Component (تکمیل شده)
✅ Semantic HTML Components (Button, Input, Card, Form) (تکمیل شده)
✅ Accessibility Utilities (تکمیل شده)
✅ PWA Foundation (Service Worker, Manifest) ⭐ (تکمیل شده)
```

#### مرحله ۲: Feature Complete (هفته ۲-۴)
```
✅ Login Page (کامل)
✅ Dashboard Page (کامل)
□ Vehicle Pages (کامل) ⭐ گام بعدی
□ Service Pages (کامل)
```

#### مرحله ۳: تکمیل باقی Features (هفته ۵-۸)
```
□ Reminders
□ Expenses
✅ Reports (اتصال به API، فیلتر، نمودار، CSV)
□ Settings
```

### 🎯 چرا این رویکرد بهینه است؟

1. **سریع‌تر**: Foundation یکبار نوشته می‌شود، صفحات بعدی سریع‌تر تکمیل می‌شوند
2. **کم خطاتر**: Foundation تست می‌شود و در همه جا استفاده می‌شود
3. **MVP سریع‌تر**: صفحات قابل استفاده زودتر آماده می‌شوند
4. **یادگیری بهتر**: Foundation را یکبار یاد می‌گیرید، Pattern را در صفحه اول کامل می‌کنید
5. **Motivation بیشتر**: نتیجه قابل مشاهده است، صفحات کامل می‌شوند

---

## 🎯 فاز ۱: یکپارچه‌سازی قالب (Layout Integration)

### ۱.۱ تبدیل صفحات باقی‌مانده به MainLayout
- [ ] **AddServiceView.vue** - تبدیل به MainLayout
- [ ] **VehicleDetailsView.vue** - تبدیل به MainLayout
- [ ] **VehicleManagementView.vue** - تبدیل به MainLayout
- [ ] **UpgradeProView.vue** - تبدیل به MainLayout
- [ ] **SmartAssistantView.vue** - تبدیل به MainLayout
- [ ] **SelectServiceTypeView.vue** - تبدیل به MainLayout
- [ ] **SelectServiceDetailsView.vue** - تبدیل به MainLayout
- [ ] **SelectServiceTypeVariant5View.vue** - تبدیل به MainLayout
- [ ] **SelectServiceDetailsVariant15View.vue** - تبدیل به MainLayout
- [ ] **DashboardVariant3View.vue** - بررسی نیاز به تبدیل
- [ ] **DashboardVariant16View.vue** - بررسی نیاز به تبدیل

**اولویت:** بالا  
**زمان تخمینی:** ۲-۳ روز

### ۱.۲ بهبود کامپوننت‌های مشترک
- [ ] بهبود `Header.vue` - اضافه کردن جستجو و نوتیفیکیشن
- [ ] بهبود `Sidebar.vue` - اضافه کردن حالت فعال برای لینک‌ها
- [ ] ایجاد کامپوننت `Breadcrumb` برای ناوبری
- [ ] ایجاد کامپوننت `PageHeader` برای عنوان صفحات

**اولویت:** متوسط  
**زمان تخمینی:** ۱ روز

## 🔐 فاز ۲: احراز هویت و امنیت (Authentication & Security)

### ۲.۱ پیاده‌سازی Authentication Store
- [x] اتصال `authStore.login()` به `authService`
- [x] اتصال `authStore.register()` به `authService`
- [x] اتصال `authStore.logout()` به `authService`
- [x] پیاده‌سازی `authStore.loginWithGoogle()` برای OAuth با Google
- [x] مدیریت Session و Token Storage
- [x] بهبود error handling برای خطاهای شبکه (ERR_CONNECTION_CLOSED, ERR_NETWORK_CHANGED, etc.)
- [ ] پیاده‌سازی `authStore.refreshToken()` (optional - برای آینده)
- [ ] پیاده‌سازی Auto-logout در صورت انقضای Token (optional - برای آینده)

**اولویت:** خیلی بالا  
**وضعیت:** ✅ تکمیل شده

### ۲.۲ Route Guards
- [x] ایجاد `router/beforeEach` guard برای صفحات محافظت شده
- [x] Redirect به `/login` در صورت عدم احراز هویت
- [x] Redirect به `/dashboard` در صورت احراز هویت (برای صفحات login/signup)
- [x] ایجاد route `/auth/callback` برای OAuth callback
- [ ] مدیریت دسترسی بر اساس Tier (Free/Pro)
- [ ] ایجاد Middleware برای صفحات Pro-only

**اولویت:** خیلی بالا  
**وضعیت:** ✅ تکمیل شده (به جز Tier-based access control)

### ۲.۳ صفحات Login و SignUp
- [x] اتصال فرم Login به `authStore.login()`
- [x] اتصال فرم Login به `authStore.loginWithGoogle()` (دکمه ورود با گوگل)
- [x] اتصال فرم SignUp به `authStore.register()`
- [x] اضافه کردن اعتبارسنجی فرم‌ها
- [x] نمایش پیام‌های خطا (از طریق toast و error state)
- [x] مدیریت Loading States
- [x] ایجاد `AuthCallbackView` برای handle کردن OAuth callback از Google
- [ ] اضافه کردن "فراموشی رمز عبور" (optional - برای آینده)

**اولویت:** خیلی بالا  
**وضعیت:** ✅ تکمیل شده (به جز فراموشی رمز عبور)

## 🚗 فاز ۳: مدیریت خودروها (Vehicle Management) ✅ تکمیل شده

### ۳.۱ Vehicle Store
- [x] اتصال `vehicleStore.fetchVehicles()` به `vehicleService`
- [x] اتصال `vehicleStore.createVehicle()` به `vehicleService`
- [x] اتصال `vehicleStore.updateVehicle()` به `vehicleService`
- [x] اتصال `vehicleStore.deleteVehicle()` به `vehicleService`
- [x] اضافه کردن Cache و State Management
- [x] اضافه کردن Loading states
- [x] اضافه کردن Error handling

**اولویت:** بالا ⭐  
**وضعیت:** ✅ تکمیل شده

### ۳.۲ صفحات خودرو
- [x] **VehicleListView.vue** - اتصال به API و نمایش داده‌های واقعی
  - [x] استفاده از i18n (فارسی، انگلیسی، عربی)
  - [x] استفاده از Toast برای notifications
  - [x] استفاده از Semantic Components (Modal, Button)
  - [x] Loading states و Empty states
  - [x] Error handling
  - [x] Responsive design
  - [x] Accessibility features
  - [x] نمایش Usage Status برای Free Tier
  - [x] Upgrade Banner برای کاربران با ۳+ خودرو
- [x] **VehicleDetailsView.vue** - اتصال به API
  - [x] استفاده از i18n (فارسی، انگلیسی، عربی)
  - [x] استفاده از Semantic Components (Modal, Button)
  - [x] Loading states
  - [x] Error handling
  - [x] نمایش تاریخچه سرویس‌ها
  - [x] Tabs برای Services, Fuel, Expenses
  - [x] Breadcrumb navigation
- [x] **VehicleManagementView.vue** - اتصال به API
  - [x] فرم افزودن خودرو - اتصال به API
  - [x] فرم ویرایش خودرو - اتصال به API
  - [x] اعتبارسنجی فرم‌ها (client-side validation)
  - [x] استفاده از i18n (فارسی، انگلیسی، عربی)
  - [x] استفاده از Toast برای success/error messages
  - [x] Loading state هنگام submit
- [x] حذف خودرو با تایید (Modal) - در VehicleListView و VehicleDetailsView

**اولویت:** بالا ⭐  
**وضعیت:** ✅ تکمیل شده

## 🔧 فاز ۴: مدیریت سرویس‌ها (Service Management) ✅ تکمیل شده

### ۴.۱ Service Store
- [x] اتصال کامل `serviceStore` به `serviceService`
- [x] اضافه کردن فیلتر و جستجو
- [x] اضافه کردن Pagination

**اولویت:** بالا  
**وضعیت:** ✅ تکمیل شده

### ۴.۲ صفحات سرویس
- [x] **AddServiceView.vue** - اتصال کامل به API
  - [x] تبدیل به MainLayout
  - [x] استفاده از i18n (فارسی، انگلیسی، عربی)
  - [x] استفاده از Toast برای notifications
  - [x] استفاده از Semantic Components (Button, Input, Select, Card, Modal)
  - [x] Loading/Error/Empty states
  - [x] Responsive design (mobile-first)
  - [x] Accessibility features (ARIA attributes, Keyboard navigation, Screen reader support)
  - [x] Tab navigation با ARIA support
  - [x] Autocomplete با ARIA listbox
- [x] **ServiceListView.vue** - اتصال کامل به API
  - [x] تبدیل به MainLayout
  - [x] استفاده از i18n
  - [x] استفاده از Toast برای notifications
  - [x] استفاده از Semantic Components
  - [x] Loading/Error/Empty states
  - [x] Responsive design (Table برای Desktop، Card برای Mobile)
  - [x] Accessibility features (ARIA attributes, Keyboard navigation)
  - [x] ویرایش و حذف سرویس با Modal تایید
- [x] **SelectServiceTypeView.vue** - تبدیل به MainLayout
- [x] لیست سرویس‌ها در Dashboard (از قبل موجود)
- [x] ویرایش و حذف سرویس

**اولویت:** بالا  
**وضعیت:** ✅ تکمیل شده

## 💰 فاز ۵: مدیریت هزینه‌ها (Expense Management)

### ۵.۱ Expense Store
- [ ] اتصال کامل `expenseStore` به `expenseService`
- [ ] محاسبه آمار هزینه‌ها
- [ ] فیلتر بر اساس تاریخ و خودرو

**اولویت:** متوسط  
**زمان تخمینی:** ۱ روز

### ۵.۲ صفحات هزینه
- [ ] فرم افزودن هزینه
- [ ] لیست هزینه‌ها
- [ ] ویرایش و حذف هزینه
- [x] نمودارهای هزینه در Reports (تکمیل شده در ReportsView)

**اولویت:** متوسط  
**زمان تخمینی:** ۲ روز

## 🔔 فاز ۶: یادآورها و نوتیفیکیشن‌ها (Reminders & Notifications) ✅ تکمیل شده

### ۶.۱ Reminder Store
- [x] اتصال کامل `reminderStore` به `reminderService`
- [x] محاسبه یادآورهای فعال و معوقه
- [x] فیلتر بر اساس وضعیت

**اولویت:** بالا  
**وضعیت:** ✅ تکمیل شده

### ۶.۲ Notification Service
- [x] اتصال `notificationService` به Supabase Realtime
- [x] نمایش نوتیفیکیشن‌های جدید
- [x] مدیریت وضعیت خوانده/نخوانده
- [x] Badge در Sidebar برای نوتیفیکیشن‌های خوانده نشده
- [x] ایجاد `notificationStore` برای مدیریت state
- [x] ایجاد کامپوننت `NotificationBell` برای نمایش نوتیفیکیشن‌ها

**اولویت:** بالا  
**وضعیت:** ✅ تکمیل شده

### ۶.۳ کانال‌های یادآوری چندگانه (Multi-Channel Notifications)
- [ ] پیاده‌سازی پشتیبانی از کانال‌های مختلف:
  - [ ] اعلان درون برنامه (In-App) ✅ موجود
  - [ ] پیامک (SMS) - نیاز به سرویس SMS Provider
  - [ ] اعلان از طریق تلگرام (Telegram Bot)
  - [ ] Push Notification (Browser/Web Push)
- [ ] ایجاد UI برای انتخاب کانال‌های یادآوری در تنظیمات
- [ ] ذخیره تنظیمات کانال‌های یادآوری کاربر
- [ ] اتصال به سرویس‌های خارجی (SMS Gateway, Telegram Bot API)
- [ ] مدیریت مجوزهای Push Notification
- [ ] تست ارسال یادآوری از طریق هر کانال

**اولویت:** بالا  
**زمان تخمینی:** ۴ روز

### ۶.۴ صفحات یادآور
- [x] **RemindersView.vue** - اتصال کامل به API
- [x] ویرایش و حذف یادآور
- [x] علامت‌گذاری به عنوان انجام شده
- [x] فیلتر بر اساس وضعیت (فعال، معوقه، نزدیک به موعد)
- [x] فیلتر بر اساس خودرو
- [x] استفاده از i18n (فارسی، انگلیسی، عربی)
- [x] استفاده از Toast برای notifications
- [x] استفاده از Semantic Components (Card, Button, Modal)
- [x] Loading/Error/Empty states
- [x] Responsive design
- [ ] فرم افزودن یادآور با انتخاب کانال‌های یادآوری (گام بعدی)
- [ ] نمایش کانال یادآوری برای هر یادآور (گام بعدی)
- [ ] بهبود UX ایجاد یادآور پس از ثبت سرویس/هزینه:
  - [ ] گزینه ۱: مودال پس از ثبت موفقیت‌آمیز سرویس/هزینه
  - [ ] گزینه ۲: مودال با checkbox (انتخاب checkbox → باز شدن مودال)
  - [ ] پیش‌پر کردن فرم یادآور با اطلاعات پیش‌فرض بر اساس سرویس/هزینه
  - [ ] امکان ویرایش و تایید یادآور قبل از ایجاد
- [ ] بهبود و رفع اشکال فرم یادآور - تاریخ محاسبه شده:
  - [ ] تبدیل فیلد تاریخ محاسبه شده به Date Picker (تقویم) قابل ویرایش
  - [ ] رفع اشکال به‌روزرسانی خودکار تاریخ با تغییر بازه زمانی سفارشی
  - [ ] رفع اشکال به‌روزرسانی تاریخ با تغییر نوع واحد (روز/هفته/ماه)

**اولویت:** بالا  
**وضعیت:** ✅ تکمیل شده (به جز فرم افزودن یادآور و بهبود UX)

## 📊 فاز ۷: گزارش‌ها و آمار (Reports & Analytics) ✅ تکمیل شده

### ۷.۱ Report Store
- [x] اتصال کامل `reportStore` به `reportService` (Django: getSummary با فیلتر)
- [x] محاسبه آمار و نمودارها از پاسخ API (costByMonth، costByCategory، totalKm)
- [x] فیلتر بر اساس بازه زمانی (۳۰ روز / امسال / سال گذشته) و خودرو

**اولویت:** متوسط  
**وضعیت:** ✅ تکمیل شده

### ۷.۲ صفحات گزارش
- [x] **ReportsView.vue** - اتصال کامل به API
- [x] نمودار روند ماهانه هزینه‌ها (costByMonth)
- [x] تفکیک هزینه‌ها (costByCategory) با درصد
- [x] چهار کارت خلاصه (کل هزینه، سوخت، سرویس، هزینه به کیلومتر)
- [x] جدول هزینه‌های اخیر (ادغام سرویس و هزینه، ۲۰ رکورد)
- [x] خروجی CSV (ساخته‌شده سمت کلاینت از لیست سرویس/هزینه)
- [ ] گزارش‌های PDF (Pro-only، backlog)

**اولویت:** متوسط  
**وضعیت:** ✅ تکمیل شده (به جز PDF)

## 🤖 فاز ۸: مشاور هوشمند (AI Assistant)

### ۸.۱ AI Store
- [ ] اتصال کامل `aiStore` به `aiService`
- [ ] مدیریت تاریخچه چت
- [ ] تبدیل توصیه‌ها به سرویس/یادآور

**اولویت:** پایین  
**زمان تخمینی:** ۱ روز

### ۸.۲ صفحه مشاور
- [ ] **SmartAssistantView.vue** - اتصال کامل به API
- [ ] رابط چت
- [ ] انتخاب خودرو برای مشاوره
- [ ] تبدیل توصیه‌ها به اقدامات

**اولویت:** پایین  
**زمان تخمینی:** ۳ روز

## ⚙️ فاز ۹: تنظیمات (Settings)

### ۹.۱ Settings Store
- [ ] اتصال کامل `settingsStore` به API
- [ ] مدیریت تنظیمات کاربر
- [ ] مدیریت تنظیمات یادآورها

**اولویت:** متوسط  
**زمان تخمینی:** ۱ روز

### ۹.۲ صفحه تنظیمات
- [ ] **SettingsView.vue** - اتصال کامل به API
- [ ] فرم ویرایش پروفایل
- [ ] تنظیمات یادآورهای هوشمند
- [ ] تنظیمات اعلان‌ها و کانال‌های یادآوری
  - [ ] انتخاب کانال‌های فعال (SMS, Telegram, Push, In-App)
  - [ ] تنظیمات Telegram Bot (اتصال به ربات)
  - [ ] تنظیمات Push Notification (مجوزها)
  - [ ] تنظیمات SMS (شماره تلفن)
- [ ] تغییر رمز عبور
- [ ] حذف حساب کاربری

**اولویت:** متوسط  
**زمان تخمینی:** ۳ روز

## 💎 فاز ۱۰: ارتقا حساب (Upgrade)

### ۱۰.۱ Upgrade Store
- [ ] اتصال کامل `upgradeStore` به `upgradeService`
- [ ] مدیریت وضعیت اشتراک

**اولویت:** پایین  
**زمان تخمینی:** ۱ روز

### ۱۰.۲ صفحه ارتقا
- [ ] **UpgradeProView.vue** - اتصال کامل به API
- [ ] نمایش طرح‌های مختلف
- [ ] پرداخت و ارتقا
- [ ] مدیریت اشتراک

**اولویت:** پایین  
**زمان تخمینی:** ۲ روز

## 🎨 فاز ۱۱: بهبود تجربه کاربری (UX Improvements)

### ۱۱.۱ Loading States
- [ ] اضافه کردن Skeleton Loaders
- [ ] اضافه کردن Loading Spinners
- [ ] مدیریت Loading در تمام صفحات

**اولویت:** متوسط  
**زمان تخمینی:** ۲ روز

### ۱۱.۲ Error Handling
- [ ] نمایش پیام‌های خطا به کاربر
- [ ] مدیریت خطاهای شبکه
- [ ] Retry Mechanism
- [ ] Error Boundaries

**اولویت:** بالا  
**زمان تخمینی:** ۲ روز

### ۱۱.۳ اعتبارسنجی فرم‌ها
- [ ] ایجاد کامپوننت‌های فرم قابل استفاده مجدد
- [ ] اعتبارسنجی سمت کلاینت
- [ ] نمایش پیام‌های خطا در فرم‌ها
- [ ] اعتبارسنجی Real-time

**اولویت:** بالا  
**زمان تخمینی:** ۳ روز

### ۱۱.۴ Toast Notifications
- [x] ایجاد کامپوننت Toast
- [x] ایجاد کامپوننت ToastContainer
- [x] بهبود UI Store با helper methods
- [x] ایجاد composable useToast
- [x] نمایش پیام‌های موفقیت
- [x] نمایش پیام‌های خطا
- [x] نمایش پیام‌های اطلاعاتی
- [x] نمایش پیام‌های هشدار
- [x] پشتیبانی از RTL/LTR
- [x] پشتیبانی از Dark Mode
- [x] انیمیشن‌های smooth
- [x] Progress bar برای نمایش زمان
- [x] Accessibility (ARIA attributes)
- [x] Responsive Design
- [x] یکپارچه‌سازی با i18n

**اولویت:** متوسط  
**وضعیت:** ✅ تکمیل شده

### ۱۱.۵ Modal و Dialog
- [ ] ایجاد کامپوننت Modal قابل استفاده مجدد
- [ ] ایجاد کامپوننت Dialog برای تایید
- [ ] استفاده در حذف‌ها و عملیات مهم

**اولویت:** متوسط  
**زمان تخمینی:** ۱ روز

## 📱 فاز ۱۲: Responsive و Mobile

### ۱۲.۱ Mobile Menu
- [ ] ایجاد منوی موبایل برای Sidebar
- [ ] Hamburger Menu
- [ ] بهبود ناوبری در موبایل

**اولویت:** متوسط  
**زمان تخمینی:** ۲ روز

### ۱۲.۲ Responsive Design
- [ ] بررسی و بهبود تمام صفحات در موبایل
- [ ] بهبود جداول در موبایل
- [ ] بهبود فرم‌ها در موبایل
- [ ] بهبود نمودارها در موبایل

**اولویت:** متوسط  
**زمان تخمینی:** ۳ روز

## 🧪 فاز ۱۳: تست و کیفیت (Testing & Quality)

### ۱۳.۱ Smoke Tests
- [ ] ایجاد Smoke Tests برای بررسی عملکرد اولیه سیستم
- [ ] تست بارگذاری صفحات اصلی
- [ ] تست اتصال به API
- [ ] تست Navigation پایه
- [ ] پیکربندی اجرای خودکار Smoke Tests در CI/CD

**اولویت:** بالا  
**زمان تخمینی:** ۲ روز

### ۱۳.۲ Unit Tests
- [x] تست Store ها (auth، vehicle، ui با mock سرویس‌ها)
- [x] تست کامپوننت‌های UI (Button، Input، Card، Modal)
- [x] تست Utility Functions (`src/utils/formatters.js`)
- [ ] تست سایر Stores و Service Wrappers
- [x] پیکربندی Coverage و vitest.config.js
- [ ] اجرای خودکار Unit Tests در CI/CD

**اولویت:** بالا  
**زمان تخمینی:** ۵ روز

### ۱۳.۳ Integration Tests
- [ ] تست جریان‌های اصلی کاربر
- [ ] تست Authentication Flow (Login, Register, Logout)
- [ ] تست CRUD Operations (Vehicles, Services, Expenses)
- [ ] تست Navigation بین صفحات
- [ ] تست تعامل Store-Component
- [ ] پیکربندی اجرای خودکار Integration Tests در CI/CD

**اولویت:** متوسط  
**زمان تخمینی:** ۳ روز

### ۱۳.۴ E2E Tests
- [ ] نصب و پیکربندی Playwright یا Cypress
- [ ] تست سناریوهای کامل کاربر
- [ ] تست در مرورگرهای مختلف (Chrome, Firefox, Safari)
- [ ] تست Responsive Design
- [ ] تست Performance در سناریوهای واقعی
- [ ] پیکربندی اجرای خودکار E2E Tests در CI/CD

**اولویت:** متوسط  
**زمان تخمینی:** ۴ روز

### ۱۳.۶ Backend Integration Tests (تست‌های ارتباط با سرور)

#### ۱۳.۶.۱ تست‌های Supabase Backend
- [ ] ایجاد تست‌های Integration برای اتصال به Supabase
- [ ] تست دریافت اطلاعات از Supabase (Vehicles, Services, Expenses, Reminders)
- [ ] تست ارسال اطلاعات به Supabase (Create, Update, Delete operations)
- [ ] تست Authentication با Supabase (Login, Register, OAuth)
- [ ] تست Real-time Subscriptions (Notifications, Updates)
- [ ] تست Error Handling برای خطاهای Supabase
- [ ] تست Performance و Latency در ارتباط با Supabase
- [ ] تست Pagination و Filtering در Supabase queries
- [ ] تست RLS (Row Level Security) Policies
- [ ] تست File Upload/Download با Supabase Storage (در صورت نیاز)
- [ ] پیکربندی Test Environment برای Supabase (Test Database)
- [ ] ایجاد Mock Data برای تست‌های Supabase
- [ ] تست Cleanup بعد از هر تست (Database cleanup)

**اولویت:** بالا ⭐  
**زمان تخمینی:** ۳-۴ روز

#### ۱۳.۶.۲ تست‌های Django REST API Backend
- [ ] ایجاد تست‌های Integration برای اتصال به Django REST API
- [ ] تست دریافت اطلاعات از Django API (Vehicles, Services, Expenses, Reminders)
- [ ] تست ارسال اطلاعات به Django API (Create, Update, Delete operations)
- [ ] تست Authentication با Django (Token-based, Session-based)
- [ ] تست API Endpoints مختلف (GET, POST, PUT, PATCH, DELETE)
- [ ] تست Error Handling برای خطاهای Django API (400, 401, 403, 404, 500)
- [ ] تست Performance و Latency در ارتباط با Django API
- [ ] تست Pagination و Filtering در Django API responses
- [ ] تست CORS و Security Headers
- [ ] تست Rate Limiting (در صورت پیاده‌سازی)
- [ ] تست File Upload/Download با Django API (در صورت نیاز)
- [ ] پیکربندی Test Environment برای Django API (Test Server)
- [ ] ایجاد Mock Data برای تست‌های Django API
- [ ] تست Cleanup بعد از هر تست (API cleanup)

**اولویت:** بالا ⭐  
**زمان تخمینی:** ۳-۴ روز

#### ۱۳.۶.۳ تست‌های Cross-Backend Compatibility
- [ ] تست سازگاری کد بین Supabase و Django Backend
- [ ] تست Switch بین Backend Types (mock, supabase, django)
- [ ] تست یکسان بودن Response Format بین Backends
- [ ] تست Error Handling یکسان بین Backends
- [ ] تست Performance مقایسه‌ای بین Backends
- [ ] مستندسازی تفاوت‌های Backend‌ها

**اولویت:** متوسط  
**زمان تخمینی:** ۲ روز

#### ۱۳.۶.۴ پیکربندی و Infrastructure
- [ ] ایجاد Test Utilities برای Backend Testing
- [ ] پیکربندی Environment Variables برای Test Backends
- [ ] ایجاد Test Fixtures و Seed Data
- [ ] پیکربندی CI/CD برای اجرای Backend Integration Tests
- [ ] ایجاد Test Reports برای Backend Tests
- [ ] پیکربندی Test Timeout و Retry Logic
- [ ] مستندسازی نحوه اجرای Backend Integration Tests

**اولویت:** بالا  
**زمان تخمینی:** ۲ روز

### ۱۳.۷ CI/CD Integration
- [ ] پیکربندی GitHub Actions یا GitLab CI
- [ ] اجرای خودکار تست‌ها در هر Commit/Pull Request
- [ ] اجرای Smoke Tests در هر Push
- [ ] اجرای Unit Tests در هر Commit
- [ ] اجرای Integration Tests در Pull Request
- [ ] اجرای Backend Integration Tests در Pull Request (با Test Backends)
- [ ] اجرای E2E Tests در Merge به main
- [ ] گزارش Coverage در Pull Request
- [ ] Block Merge در صورت Fail شدن تست‌های Critical
- [ ] پیکربندی Test Matrix برای تست با Backend‌های مختلف (Supabase, Django)

**اولویت:** بالا  
**زمان تخمینی:** ۲ روز

## 🚀 فاز ۱۴: بهینه‌سازی و Performance

### ۱۴.۱ Performance Optimization
- [x] Lazy Loading برای Route ها
- [x] Code Splitting
- [ ] Image Optimization
- [x] Bundle Size Optimization (rollup-plugin-visualizer؛ گزارش `npm run build` → `dist/stats.html`)

**اولویت:** متوسط  
**زمان تخمینی:** ۲ روز

### ۱۴.۲ Caching
- [ ] Cache API Responses
- [ ] Cache در Store ها
- [ ] مدیریت Cache Invalidation

**اولویت:** متوسط  
**زمان تخمینی:** ۲ روز

## 🌐 فاز ۱۵: پشتیبانی چندزبانه (Internationalization - i18n)

### ۱۵.۱ راه‌اندازی i18n
- [x] نصب و پیکربندی vue-i18n یا vue-i18n-next
- [x] ایجاد ساختار پوشه‌ای برای فایل‌های ترجمه
- [x] ایجاد فایل‌های ترجمه برای فارسی (fa.json)
- [x] ایجاد فایل‌های ترجمه برای انگلیسی (en.json)
- [x] ایجاد فایل‌های ترجمه برای عربی (ar.json)
- [x] پیکربندی i18n در main.js
- [x] ایجاد composable برای استفاده از i18n در کامپوننت‌ها
- [x] مدیریت RTL/LTR بر اساس زبان
- [x] ذخیره زبان انتخابی در localStorage
- [x] بارگذاری زبان از localStorage در startup

**اولویت:** بالا  
**وضعیت:** ✅ تکمیل شده

### ۱۵.۲ پیاده‌سازی در کامپوننت‌ها
- [x] ایجاد کامپوننت LanguageSwitcher
- [x] ایجاد کامپوننت LanguageSwitcherCard (برای صفحات Auth)
- [x] اضافه کردن LanguageSwitcher به Header
- [x] ترجمه کامپوننت‌های Layout (Header)
- [x] ترجمه کامپوننت‌های Auth (Login, Register)
- [x] ترجمه کامپوننت‌های Dashboard
- [x] ترجمه کامپوننت‌های Vehicle (VehicleListView, VehicleDetailsView, VehicleManagementView)
- [ ] ترجمه کامپوننت‌های Service
- [ ] ترجمه کامپوننت‌های Expense
- [ ] ترجمه کامپوننت‌های Reminder
- [ ] ترجمه کامپوننت‌های Settings

**اولویت:** بالا  
**وضعیت:** 🔄 در حال انجام (صفحات Auth، Dashboard و Vehicle تکمیل شده)

### ۱۵.۳ پیاده‌سازی در Views
- [x] ترجمه LoginView
- [x] ترجمه SignUpView
- [x] ترجمه DashboardView
- [x] ترجمه VehicleListView, VehicleDetailsView, VehicleManagementView
- [ ] ترجمه Service Views
- [ ] ترجمه Expense Views
- [ ] ترجمه RemindersView
- [ ] ترجمه ReportsView
- [ ] ترجمه SettingsView
- [ ] ترجمه UpgradeProView
- [ ] ترجمه SmartAssistantView
- [x] ترجمه پیام‌های خطا و موفقیت (در Dashboard و Vehicle pages)
- [x] ترجمه فرم‌ها و اعتبارسنجی (VehicleManagementView)
- [x] ترجمه فرم‌ها و اعتبارسنجی (VehicleManagementView)
- [ ] ترجمه فرم‌ها و اعتبارسنجی (باقی فرم‌ها)
- [ ] ترجمه تاریخ و اعداد (فرمت‌بندی)

**اولویت:** بالا  
**وضعیت:** 🔄 در حال انجام (صفحات Auth، Dashboard و Vehicle تکمیل شده)

### ۱۵.۴ بهینه‌سازی و بهبود
- [ ] Lazy Loading برای فایل‌های ترجمه
- [ ] بررسی و تکمیل ترجمه‌های ناقص
- [ ] تست تغییر زبان در runtime
- [ ] تست RTL/LTR در تمام صفحات
- [ ] مستندسازی نحوه افزودن زبان جدید

**اولویت:** متوسط  
**زمان تخمینی:** ۲ روز

## ♿ فاز ۱۶: دسترسی‌پذیری (Accessibility - WCAG 2.1 AA)

### ۱۶.۱ پیاده‌سازی Semantic HTML
- [x] بررسی و اصلاح تمام کامپوننت‌ها برای استفاده از Semantic HTML
- [x] استفاده از `<button>` به جای `<div>` برای دکمه‌ها (Button Component)
- [x] استفاده از `<input>`, `<select>`, `<form>` با Semantic HTML (Input, Select, Form Components)
- [x] بهبود کامپوننت Card با Semantic HTML (header, body, footer slots)
- [x] یکپارچه‌سازی در صفحات Login و SignUp
- [ ] استفاده از `<nav>`, `<main>`, `<header>`, `<footer>` در Layout (باقی‌مانده)
- [ ] Heading hierarchy صحیح (h1 → h2 → h3) در تمام صفحات
- [ ] Landmarks برای navigation

**اولویت:** بالا  
**وضعیت:** 🔄 در حال انجام (کامپوننت‌های پایه تکمیل شده)

### ۱۶.۲ ARIA Attributes و Screen Reader Support
- [ ] اضافه کردن `aria-label` برای icon-only buttons
- [ ] اضافه کردن `aria-describedby` برای help text
- [ ] اضافه کردن `aria-expanded` برای dropdowns
- [ ] اضافه کردن `aria-live` برای dynamic updates
- [ ] تست با Screen Reader (NVDA/JAWS/VoiceOver)
- [ ] Alt text برای تمام تصاویر

**اولویت:** بالا  
**زمان تخمینی:** ۲ روز

### ۱۶.۳ Keyboard Navigation
- [x] ایجاد composable useKeyboardNavigation (تکمیل شده)
- [x] ایجاد composable useFocusTrap (تکمیل شده)
- [x] ایجاد composable useSkipLink (تکمیل شده)
- [ ] اطمینان از keyboard accessibility تمام interactive elements (یکپارچه‌سازی)
- [ ] Focus indicators واضح و قابل مشاهده در کامپوننت‌ها
- [ ] Focus trap در modal ها (یکپارچه‌سازی)
- [ ] Skip links برای navigation (یکپارچه‌سازی)
- [ ] Arrow keys برای لیست‌ها و منوها (یکپارچه‌سازی)
- [ ] Escape برای بستن modal/dropdown (یکپارچه‌سازی)

**اولویت:** بالا  
**وضعیت:** 🔄 در حال انجام (Utilities تکمیل شده، یکپارچه‌سازی باقی‌مانده)

### ۱۶.۴ Color Contrast و Visual Accessibility
- [ ] بررسی Color Contrast (حداقل 4.5:1 برای متن)
- [ ] پشتیبانی از `prefers-reduced-motion`
- [ ] پشتیبانی از `prefers-contrast`
- [ ] استفاده از patterns و icons در کنار رنگ
- [ ] تست با Color Blindness Simulator

**اولویت:** متوسط  
**زمان تخمینی:** ۱ روز

## 📱 فاز ۱۷: Progressive Web App (PWA) و Native App Conversion

> **⚠️ اولویت بسیار بالا:** تبدیل این برنامه به اپلیکیشن قابل نصب روی موبایل (Android و iOS) از اولویت‌های اصلی پروژه است. تمام تصمیم‌های طراحی و پیاده‌سازی باید با در نظر گیری PWA و Native App انجام شود.

### ۱۷.۱ Service Worker و Offline Support
- [x] نصب و پیکربندی `vite-plugin-pwa`
- [x] ایجاد Service Worker برای caching
- [x] پیاده‌سازی Offline Strategy (Cache First, Network First)
- [x] Cache کردن static assets (HTML, CSS, JS, Images)
- [x] Cache کردن API responses برای کار آفلاین
- [ ] **نمایش Offline Indicator در UI** (اولویت متوسط)
  - [ ] ایجاد composable useNetworkStatus
  - [ ] ایجاد کامپوننت OfflineIndicator.vue
  - [ ] یکپارچه‌سازی در App.vue یا Header.vue
  - [ ] تست نمایش در حالت offline
- [ ] مدیریت Sync برای داده‌های آفلاین (اختیاری)
- [ ] Background Sync برای ارسال داده‌های pending (اختیاری)

**اولویت:** خیلی بالا ⭐  
**وضعیت:** ✅ تکمیل شده (به جز Offline Indicator - اختیاری)

### ۱۷.۲ Web App Manifest
- [x] ایجاد `manifest.json` با اطلاعات کامل (از طریق vite-plugin-pwa)
- [x] اضافه کردن Icons در سایزهای مختلف (192x192, 512x512, و سایزهای iOS)
- [x] تنظیم Theme Color و Background Color
- [x] تنظیم Display Mode (standalone, fullscreen)
- [x] تنظیم Orientation (portrait, landscape)
- [x] اضافه کردن لینک manifest به index.html
- [x] پشتیبانی از "Add to Home Screen"
- [ ] **جایگزینی Icons placeholder با Icons واقعی** ⭐ (اولویت بالا)
  - [ ] طراحی Icon اصلی (512x512) با آیکون تاکسی و رنگ #3b82f6
  - [ ] ساخت pwa-192x192.png
  - [ ] ساخت pwa-512x512.png
  - [ ] ساخت apple-touch-icon.png (180x180)
  - [ ] ساخت favicon.ico
  - [ ] جایگزینی فایل‌ها در public/
  - [ ] تست نمایش icons در manifest
- [ ] **تست PWA در Lighthouse** ⭐ (اولویت بالا)
  - [ ] Build production
  - [ ] اجرای Lighthouse با گزینه PWA
  - [ ] بررسی امتیاز PWA (هدف: > 90)
  - [ ] رفع مشکلات احتمالی
- [ ] **تست Add to Home Screen** ⭐ (اولویت بالا)
  - [ ] تست روی Android (Chrome)
  - [ ] تست روی iOS (Safari)
  - [ ] تست روی Desktop (Chrome, Edge)
  - [ ] بررسی عملکرد در حالت standalone
  - [ ] تست Offline mode

**اولویت:** خیلی بالا ⭐  
**وضعیت:** ✅ Foundation تکمیل شده - در انتظار Icons واقعی و تست

### ۱۷.۳ Push Notifications (PWA)
- [ ] پیاده‌سازی Web Push API
- [ ] مدیریت مجوزهای Push Notification
- [ ] اتصال به Backend برای ارسال Push
- [ ] نمایش Push Notifications در Service Worker
- [ ] مدیریت Click events روی Push Notifications
- [ ] پشتیبانی از Badge API
- [ ] پشتیبانی از Action Buttons در Notifications
- [ ] تست Push Notifications روی Android
- [ ] تست Push Notifications روی iOS (با محدودیت‌های Safari)

**اولویت:** بالا  
**زمان تخمینی:** ۲ روز

### ۱۷.۴ Native App Conversion با Capacitor
- [ ] نصب و پیکربندی Capacitor
- [ ] ایجاد پروژه Capacitor برای Android
- [ ] ایجاد پروژه Capacitor برای iOS
- [ ] پیکربندی Capacitor Config
- [ ] اضافه کردن Native Plugins:
  - [ ] Camera Plugin (برای عکس فاکتورها)
  - [ ] File System Plugin (برای ذخیره محلی)
  - [ ] Network Plugin (برای تشخیص وضعیت شبکه)
  - [ ] Storage Plugin (برای ذخیره محلی)
  - [ ] Push Notifications Plugin (Native)
- [ ] Build Android APK/AAB
- [ ] Build iOS IPA
- [ ] تست روی دستگاه‌های واقعی Android
- [ ] تست روی دستگاه‌های واقعی iOS
- [ ] بهینه‌سازی برای Native Performance

**اولویت:** خیلی بالا ⭐  
**زمان تخمینی:** ۴-۵ روز

### ۱۷.۵ App Store Deployment
- [ ] آماده‌سازی برای Google Play Store:
  - [ ] ایجاد App Icon و Screenshots
  - [ ] نوشتن Description
  - [ ] تنظیم Privacy Policy
  - [ ] ایجاد Signed APK/AAB
- [ ] آماده‌سازی برای Apple App Store:
  - [ ] ایجاد App Icon و Screenshots
  - [ ] نوشتن Description
  - [ ] تنظیم Privacy Policy
  - [ ] ایجاد Signed IPA
  - [ ] تنظیم App Store Connect
- [ ] تست Beta در TestFlight (iOS) و Internal Testing (Android)

**اولویت:** بالا  
**زمان تخمینی:** ۳-۴ روز

## 📊 فاز ۱۸: Analytics و Monitoring

### ۱۸.۱ Error Logging و Monitoring
- [ ] نصب و پیکربندی Sentry یا مشابه
- [ ] Logging خطاهای Frontend
- [ ] ارسال Error Reports به Monitoring Service
- [ ] Grouping و Categorization خطاها
- [ ] Alerting برای خطاهای Critical
- [ ] Source Maps برای Debugging

**اولویت:** بالا  
**زمان تخمینی:** ۲ روز

### ۱۸.۲ Performance Monitoring
- [ ] پیاده‌سازی Performance Metrics Collection
- [ ] اندازه‌گیری Core Web Vitals (LCP, FID, CLS)
- [ ] اندازه‌گیری Page Load Time
- [ ] اندازه‌گیری API Response Time
- [ ] ارسال Metrics به Analytics Service
- [ ] Dashboard برای Performance Monitoring

**اولویت:** متوسط  
**زمان تخمینی:** ۲ روز

### ۱۸.۳ User Analytics
- [ ] نصب و پیکربندی Google Analytics یا Plausible
- [ ] Tracking Page Views
- [ ] Tracking User Actions (Button Clicks, Form Submissions)
- [ ] Tracking Custom Events
- [ ] User Journey Tracking
- [ ] Privacy-compliant Analytics (GDPR)

**اولویت:** متوسط  
**زمان تخمینی:** ۲ روز

## 🔒 فاز ۱۹: امنیت (Security Enhancements)

### ۱۹.۱ Content Security Policy (CSP)
- [ ] تنظیم CSP Headers
- [ ] Whitelist کردن منابع مجاز
- [ ] Block کردن Inline Scripts (در صورت امکان)
- [ ] تست CSP در Development و Production

**اولویت:** بالا  
**زمان تخمینی:** ۱ روز

### ۱۹.۲ XSS Protection
- [ ] Sanitization ورودی‌های کاربر
- [ ] استفاده از `v-html` با احتیاط
- [ ] Encoding داده‌ها قبل از نمایش
- [ ] استفاده از DOMPurify برای HTML Content

**اولویت:** بالا  
**زمان تخمینی:** ۱ روز

### ۱۹.۳ Rate Limiting و Request Throttling
- [ ] پیاده‌سازی Rate Limiting در Frontend
- [ ] Throttling درخواست‌های API
- [ ] Debouncing برای Search و Input
- [ ] جلوگیری از Spam Requests

**اولویت:** متوسط  
**زمان تخمینی:** ۱ روز

## 🎨 فاز ۲۰: بهبودهای UX پیشرفته

### ۲۰.۱ Dark Mode کامل
- [ ] پیاده‌سازی Dark Mode در تمام کامپوننت‌ها
- [ ] ذخیره Theme Preference در localStorage
- [ ] پشتیبانی از System Preference (`prefers-color-scheme`)
- [ ] Smooth Transition بین Themes
- [ ] تست Dark Mode در تمام صفحات

**اولویت:** متوسط  
**زمان تخمینی:** ۲ روز

### ۲۰.۲ Keyboard Shortcuts
- [ ] پیاده‌سازی Global Keyboard Shortcuts
- [ ] Shortcuts برای Navigation (Ctrl+K برای Search)
- [ ] Shortcuts برای Actions (Ctrl+S برای Save)
- [ ] نمایش Help Modal با لیست Shortcuts
- [ ] Customizable Shortcuts (اختیاری)

**اولویت:** پایین  
**زمان تخمینی:** ۲ روز

### ۲۰.۳ Global Search
- [ ] ایجاد کامپوننت Global Search
- [ ] جستجو در Vehicles, Services, Expenses
- [ ] جستجوی Fuzzy Search
- [ ] نمایش نتایج با Highlight
- [ ] Keyboard Navigation در نتایج
- [ ] Shortcut برای باز کردن Search (Ctrl+K)

**اولویت:** متوسط  
**زمان تخمینی:** ۳ روز

### ۲۰.۴ Bulk Operations
- [ ] پیاده‌سازی Select Multiple Items
- [ ] Bulk Delete برای Vehicles, Services, Expenses
- [ ] Bulk Edit (اختیاری)
- [ ] Bulk Export (اختیاری)
- [ ] UI برای Bulk Actions

**اولویت:** پایین  
**زمان تخمینی:** ۲ روز

## 💾 فاز ۲۱: Data Management

### ۲۱.۱ Data Export
- [ ] Export Vehicles به CSV/JSON
- [ ] Export Services به CSV/JSON
- [ ] Export Expenses به CSV/JSON
- [ ] Export Reports به PDF
- [ ] Export کامل Data (Backup)

**اولویت:** متوسط  
**زمان تخمینی:** ۲ روز

### ۲۱.۲ Data Import
- [ ] Import Vehicles از CSV/JSON
- [ ] Import Services از CSV/JSON
- [ ] Import Expenses از CSV/JSON
- [ ] Validation برای Import Data
- [ ] Preview قبل از Import
- [ ] Error Handling برای Import

**اولویت:** پایین  
**زمان تخمینی:** ۳ روز

### ۲۱.۳ Advanced Caching Strategy
- [ ] پیاده‌سازی Cache Layer پیشرفته
- [ ] Cache Invalidation Strategy
- [ ] Cache برای API Responses
- [ ] Cache برای Static Data
- [ ] مدیریت Cache Size
- [ ] Cache Persistence در IndexedDB

**اولویت:** متوسط  
**زمان تخمینی:** ۲ روز

## 📝 فاز ۲۲: مستندسازی (Documentation)

### ۱۶.۱ مستندات کد
- [x] JSDoc برای کامپوننت‌های UI (Button، Input، Card، Modal، Select، LoadingSpinner، Toast) — props و emits
- [ ] JSDoc برای سایر Functions و composables
- [ ] کامنت‌های توضیحی
- [ ] README برای کامپوننت‌ها

**اولویت:** پایین  
**زمان تخمینی:** ۳ روز

### ۱۶.۲ مستندات کاربری
- [ ] راهنمای استفاده
- [ ] FAQ
- [ ] Video Tutorials

**اولویت:** پایین  
**زمان تخمینی:** ۲ روز

---

## 📅 جدول زمانی پیشنهادی

### هفته ۱-۲: فازهای ۱ و ۲ (Layout + Auth)
- تبدیل صفحات به MainLayout
- پیاده‌سازی Authentication کامل
- Route Guards

### هفته ۳-۴: فازهای ۳ و ۴ (Vehicles + Services) ⭐ در حال انجام
- ✅ مدیریت خودروها (تکمیل شده)
- مدیریت سرویس‌ها (گام بعدی)

### هفته ۵-۶: فازهای ۵ و ۶ (Expenses + Reminders)
- مدیریت هزینه‌ها
- یادآورها و نوتیفیکیشن‌ها

### هفته ۷: فازهای ۷ و ۹ (Reports + Settings)
- گزارش‌ها ✅ (تکمیل شده: داده واقعی، فیلتر، نمودار، CSV)
- تنظیمات

### هفته ۸: فازهای ۱۱ و ۱۲ (UX + Mobile)
- بهبود تجربه کاربری
- Responsive Design

### هفته ۹-۱۰: فازهای ۱۳، ۱۴ و ۱۵ (Testing + Optimization + i18n)
- تست‌ها (Smoke, Unit, Integration, E2E)
- **Backend Integration Tests** ⭐ (Supabase و Django)
- CI/CD Integration
- بهینه‌سازی
- پیاده‌سازی i18n
- کانال‌های یادآوری چندگانه

### هفته ۱۱-۱۲: فاز ۱۷ (PWA و Native App) ⭐ اولویت بالا
- Progressive Web App (Service Worker, Manifest)
- Push Notifications
- Native App Conversion با Capacitor
- تست روی دستگاه‌های واقعی

### هفته ۱۳-۱۴: فازهای ۱۶ و ۱۸ (Accessibility + Monitoring)
- دسترسی‌پذیری (WCAG 2.1 AA)
- Error Logging و Analytics

### هفته ۱۳-۱۴: فازهای ۱۹، ۲۰ و ۲۱ (Security + UX + Data Management)
- امنیت (CSP, XSS Protection)
- بهبودهای UX (Dark Mode, Shortcuts, Search)
- Data Export/Import

---

## 🎯 اولویت‌بندی کلی

### 🔴 اولویت خیلی بالا (باید فوراً انجام شود)
1. ✅ Authentication و Route Guards (تکمیل شده)
2. ✅ صفحات Login/SignUp (تکمیل شده)
   - Login با email/password
   - Login با Google OAuth
   - Register
   - Logout
3. ✅ Dashboard Page (تکمیل شده)
   - اتصال به API
   - نمایش داده‌های واقعی
   - i18n, Toast, Semantic Components
   - Loading, Error, Empty states
   - Responsive, Accessibility
4. ✅ Vehicle Management (CRUD) (تکمیل شده) ⭐
5. Service Management (CRUD) ⭐ گام بعدی

### 🟠 اولویت بالا
5. **PWA و Native App Conversion** ⭐ (اولویت بسیار بالا)
   - Service Worker و Offline Support
   - Web App Manifest
   - Push Notifications
   - Native App با Capacitor (Android + iOS)
   - App Store Deployment
6. Reminders Management
7. Notifications (Multi-Channel: SMS, Telegram, Push)
8. Error Handling
9. Form Validation
10. ✅ Internationalization (i18n Infrastructure) - فارسی، عربی، انگلیسی (تکمیل شده)
    - ✅ نصب و پیکربندی vue-i18n
    - ✅ فایل‌های ترجمه (fa.json, en.json, ar.json)
    - ✅ کامپوننت LanguageSwitcher
    - ✅ چندزبانه کردن صفحات Login و SignUp
    - ✅ چندزبانه کردن صفحه Dashboard
    - ⏳ باقی صفحات (در حال انجام)
11. Testing Infrastructure (Smoke, Unit, Integration, E2E)
12. **Backend Integration Tests** ⭐ (اولویت بالا)
    - تست‌های ارتباط با Supabase (دریافت/ارسال اطلاعات، Authentication، Real-time)
    - تست‌های ارتباط با Django REST API (دریافت/ارسال اطلاعات، Authentication، Error Handling)
    - تست‌های Cross-Backend Compatibility
    - پیکربندی Test Infrastructure برای Backend Testing
13. CI/CD Integration

### 🟡 اولویت متوسط
9. Reports ✅ (تکمیل شده)
10. Settings
11. Loading States
12. Toast Notifications
13. Responsive Design
14. Accessibility (WCAG 2.1 AA)
15. Error Logging و Monitoring
16. Performance Monitoring
17. PWA (Progressive Web App)
18. Security Enhancements
19. Dark Mode
20. Global Search
21. Data Export/Import

### 🟢 اولویت پایین
14. AI Assistant
15. Upgrade
16. Testing
17. Documentation

---

## 📊 متریک‌های موفقیت

- [ ] تمام صفحات به MainLayout تبدیل شده‌اند
- [ ] Authentication کامل کار می‌کند
- [ ] تمام CRUD Operations کار می‌کنند
- [ ] Real-time Notifications کار می‌کند
- [ ] تمام فرم‌ها اعتبارسنجی دارند
- [ ] Error Handling کامل است
- [ ] Responsive در تمام صفحات
- [ ] Performance قابل قبول (< 3s load time)
- [ ] پشتیبانی از چند زبان (فارسی، عربی، انگلیسی)
- [ ] کانال‌های یادآوری چندگانه کار می‌کنند
- [ ] تست‌های خودکار در CI/CD اجرا می‌شوند
- [ ] Coverage حداقل 80% است
- [ ] **تست‌های Backend Integration برای Supabase و Django اجرا می‌شوند** ⭐
- [ ] دسترسی‌پذیری WCAG 2.1 AA رعایت شده
- [ ] **PWA قابل نصب است و آفلاین کار می‌کند** ⭐
- [ ] **Native App برای Android و iOS آماده است** ⭐
- [ ] **اپلیکیشن در Google Play و App Store منتشر شده** ⭐
- [ ] Push Notifications در PWA و Native App کار می‌کند
- [ ] Error Logging و Monitoring فعال است
- [ ] Analytics پیاده‌سازی شده
- [ ] Security Headers (CSP) تنظیم شده
- [ ] Dark Mode کامل کار می‌کند
- [ ] Global Search پیاده‌سازی شده

---

## 🔄 فرآیند کار

1. **بررسی و برنامه‌ریزی:** بررسی دقیق هر فاز قبل از شروع
2. **توسعه:** پیاده‌سازی با توجه به Best Practices
3. **بررسی:** Code Review و Testing
4. **Merge:** Merge به main branch
5. **مستندسازی:** به‌روزرسانی مستندات

---

## 🚀 شروع کار - گام‌های اولیه

### گام ۱: Foundation (اولویت اول)
بیایید با Foundation شروع کنیم:

1. ✅ **i18n Infrastructure** (تکمیل شده) - ۱-۲ روز
   - ✅ نصب و پیکربندی vue-i18n
   - ✅ ایجاد فایل‌های ترجمه (fa.json, en.json, ar.json)
   - ✅ پیکربندی i18n در main.js
   - ✅ مدیریت RTL/LTR
   - ✅ ذخیره زبان در localStorage
   - ✅ ایجاد کامپوننت LanguageSwitcher و LanguageSwitcherCard
   - ✅ چندزبانه کردن صفحات Login و SignUp
2. ✅ **Toast Component** (تکمیل شده) - ۰.۵ روز
   - ✅ ایجاد کامپوننت Toast.vue
   - ✅ ایجاد کامپوننت ToastContainer.vue
   - ✅ بهبود UI Store با helper methods
   - ✅ ایجاد composable useToast
   - ✅ پشتیبانی از RTL/LTR و Dark Mode
   - ✅ انیمیشن‌ها و Accessibility
   - ✅ تست در صفحات Login/SignUp
3. ✅ **Semantic HTML Components** (تکمیل شده) - ۱-۲ روز
   - ✅ ایجاد کامپوننت Button.vue
   - ✅ ایجاد کامپوننت Input.vue
   - ✅ ایجاد کامپوننت Select.vue
   - ✅ بهبود کامپوننت Card.vue
   - ✅ ایجاد کامپوننت Form.vue
   - ✅ یکپارچه‌سازی در صفحات Login و SignUp
   - ✅ پشتیبانی از Accessibility
4. ✅ **Accessibility Utilities** (تکمیل شده) - ۱ روز
   - ✅ ایجاد composable useKeyboardNavigation
   - ✅ ایجاد composable useFocusTrap
   - ✅ ایجاد composable useFocus
   - ✅ ایجاد composable useSkipLink
   - ✅ ایجاد composable useAria
   - ✅ ایجاد composable useReducedMotion
   - ✅ ایجاد composable useColorContrast
   - ✅ ایجاد فایل index.js برای export مرکزی
   - ✅ ایجاد مستندات ACCESSIBILITY.md
   - ✅ یکپارچه‌سازی در App.vue (Skip Links, Reduced Motion)
   - ✅ یکپارچه‌سازی در Modal.vue (Focus Trap, Keyboard Navigation)
   - ✅ یکپارچه‌سازی در LoginView.vue (Keyboard Navigation, Auto Focus)
   - ✅ تست و رفع باگ‌ها
5. ✅ **PWA Foundation** (Foundation تکمیل شده) ⭐ - ۱ روز
   - ✅ نصب و پیکربندی vite-plugin-pwa
   - ✅ ایجاد Service Worker برای caching
   - ✅ پیاده‌سازی Offline Strategy (Cache First, Network First)
   - ✅ Cache کردن static assets (HTML, CSS, JS, Images)
   - ✅ Cache کردن API responses برای کار آفلاین
   - ✅ ایجاد Web App Manifest با اطلاعات کامل
   - ✅ اضافه کردن Icons placeholder در سایزهای مختلف (192x192, 512x512)
   - ✅ تنظیم Theme Color و Background Color
   - ✅ تنظیم Display Mode (standalone)
   - ✅ تنظیم Orientation (portrait)
   - ✅ اضافه کردن لینک manifest به index.html
   - ✅ پشتیبانی از "Add to Home Screen"
   - ✅ ایجاد راهنمای ساخت Icons (PWA_ICONS_GUIDE.md)
   - ✅ ایجاد راهنمای تست PWA (PWA_TESTING_GUIDE.md)
   - ⏳ **جایگزینی Icons placeholder با Icons واقعی** (اولویت بالا)
   - ⏳ **تست PWA در Lighthouse** (اولویت بالا)
   - ⏳ **تست Add to Home Screen** روی Android/iOS/Desktop (اولویت بالا)
   - ⏳ نمایش Offline Indicator در UI (اولویت متوسط - اختیاری)

### گام ۲: Feature Complete (بعد از Foundation) ⭐
**وضعیت:** آماده برای شروع  
**هدف:** تکمیل کامل صفحات با استفاده از Foundation

#### ۲.۱ صفحه Login (اولویت بالا)
**وضعیت:** ✅ تقریباً کامل (Foundation یکپارچه شده)

**تکمیل شده:**
1. ✅ استفاده از i18n در Login
2. ✅ استفاده از Toast در Login
3. ✅ استفاده از Semantic Components در Login
4. ✅ استفاده از Accessibility در Login
   - ✅ Auto focus روی email input
   - ✅ Keyboard navigation (Enter key)
   - ✅ Skip links
   - ✅ Reduced motion support

**باقی‌مانده (اختیاری):**
- [ ] تست کامل Login (E2E)
- [ ] بهبود UX (loading states, error handling)

#### ۲.۲ صفحه Dashboard (اولویت بالا) ⭐
**وضعیت:** ✅ تکمیل شده

**تکمیل شده:**
1. ✅ اتصال Dashboard به API (dashboardService)
2. ✅ اتصال dashboardStore به dashboardService
3. ✅ نمایش داده‌های واقعی (vehicles, services, expenses, reminders)
4. ✅ استفاده از i18n (تمام متون ترجمه شده)
5. ✅ استفاده از Toast برای notifications
6. ✅ استفاده از Semantic Components (Button, Card, LoadingSpinner)
7. ✅ استفاده از Accessibility features (aria-label, keyboard navigation)
8. ✅ Responsive design (mobile-first, breakpoints)
9. ✅ Loading states (LoadingSpinner)
10. ✅ Error handling (error state با retry button)
11. ✅ Empty states (برای reminders, vehicles, recentServices)
12. ✅ بهبود Header با نمایش نام کاربر و tier
13. ✅ ترجمه‌های عربی و انگلیسی برای dashboard

**Refactoring انجام‌شده (انطباق با قوانین <۲۰۰ خط):**
- [x] تقسیم DashboardView به زیرکامپوننت‌ها در `src/components/dashboard/`: DashboardHeader، QuickStatsCard، RemindersSection، VehiclesSection، DashboardRightColumn
- [x] DashboardView از ~۵۹۵ خط به زیر ۲۰۰ خط کاهش یافت

**باقی‌مانده (اختیاری):**
- [ ] تست کامل Dashboard (E2E)
- [ ] بهبود UX (skeleton loaders به جای spinner)

---

**وضعیت:** Foundation تکمیل شده ✅ - Feature Complete در حال انجام - Testing و Refactoring تکمیل شده ✅  
**استراتژی:** Foundation First, Feature Complete (Hybrid Approach)  
**پیشرفت:** ۵ از ۵ مرحله Foundation تکمیل شده ✅  
- ✅ i18n Infrastructure  
- ✅ Toast Component  
- ✅ Semantic HTML Components  
- ✅ Accessibility Utilities (با یکپارچه‌سازی و تست)  
- ✅ PWA Foundation (Foundation تکمیل شده) ⭐  

**Testing و کیفیت کد :** ✅
- ✅ JSDoc برای کامپوننت‌های UI  
- ✅ Utils: `src/utils/formatters.js` و تست‌های واحد  
- ✅ Unit Tests: formatters، UI (Button/Input/Card/Modal)، Stores (auth/vehicle/ui/dashboard)، Views (DashboardView)  
- ✅ Bundle analyzer (rollup-plugin-visualizer)  
- ✅ Refactoring: DashboardView و ServiceTypeSelector به زیرکامپوننت‌ها (<۲۰۰ خط)
- ⏳ Unit Tests برای Composables (گام بعدی)  

**پیشرفت Feature Complete:** ۴ از ۵ صفحه اصلی تکمیل شده ✅
- ✅ Login Page
- ✅ Dashboard Page
- ✅ Vehicle Pages (VehicleListView, VehicleDetailsView, VehicleManagementView)
- ✅ Service Pages (AddServiceView, ServiceListView, SelectServiceTypeView)
- ✅ Reminder Pages (RemindersView, ReminderManagementView)

**PWA Foundation:** ✅ تکمیل شده
- ✅ Service Worker با Workbox
- ✅ Web App Manifest
- ✅ Caching Strategy
- ✅ Offline Support
- ⏳ Icons واقعی (بعداً - placeholder موجود است)
- ⏳ تست PWA (بعداً - راهنما: PWA_TESTING_GUIDE.md)

**Feature Complete Progress:**
- ✅ Login Page (کامل)
- ✅ Dashboard Page (کامل)
- ✅ Vehicle Pages (کامل) ⭐
- ✅ Service Pages (کامل) ⭐
- ✅ Reminder Pages (کامل) ⭐

**تکمیل شده در Vehicle Pages:**
- ✅ Vehicle Store (اتصال کامل به vehicleService)
  - ✅ CRUD operations (fetchVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle)
  - ✅ Loading states (isLoading)
  - ✅ Error handling (error, clearError)
  - ✅ Getters (vehicleCount, vehicleById)
- ✅ VehicleListView (کامل)
  - ✅ اتصال به API از طریق vehicleStore
  - ✅ i18n (فارسی، انگلیسی، عربی)
  - ✅ Toast notifications (success/error)
  - ✅ Semantic Components (Modal, Button)
  - ✅ Loading, Error, Empty states
  - ✅ Responsive design
  - ✅ Accessibility features
  - ✅ Usage Status Card برای Free Tier
  - ✅ Upgrade Banner برای کاربران با ۳+ خودرو
- ✅ VehicleDetailsView (کامل)
  - ✅ اتصال به API (vehicleStore, serviceStore)
  - ✅ نمایش جزئیات خودرو و تاریخچه سرویس
  - ✅ i18n (فارسی، انگلیسی، عربی)
  - ✅ Modal تایید حذف
  - ✅ Tabs (Services, Fuel, Expenses)
  - ✅ Loading/Error states
  - ✅ Breadcrumb navigation
- ✅ VehicleManagementView (کامل)
  - ✅ فرم افزودن/ویرایش خودرو
  - ✅ اعتبارسنجی فرم (client-side)
  - ✅ i18n (فارسی، انگلیسی، عربی)
  - ✅ Toast notifications (success/error)
  - ✅ Loading state هنگام submit
- ✅ حذف خودرو با Modal تایید (در VehicleListView و VehicleDetailsView)

**تکمیل شده در Service Pages:**
- ✅ Service Store (اتصال کامل به serviceService)
- ✅ AddServiceView (اتصال به API، i18n، Toast، Components، MainLayout)
- ✅ ServiceListView (اتصال به API، i18n، Toast، Components، MainLayout)
- ✅ SelectServiceTypeView (اتصال به API، MainLayout)
- ✅ ویرایش و حذف سرویس با Modal تایید

**تکمیل شده در Reminder Pages:**
- ✅ Reminder Store (اتصال کامل به reminderService)
- ✅ RemindersView (اتصال به API، i18n، Toast، Components)
- ✅ ReminderManagementView (اتصال به API، i18n، Toast، Components)
- ✅ ویرایش و حذف یادآور
- ✅ علامت‌گذاری به عنوان انجام شده
- ✅ فیلتر بر اساس وضعیت و خودرو

**گام بعدی:** 🔧 تکمیل باقی Features
- Expense Management
- ~~Reports~~ ✅ (اتصال به API با داده واقعی، فیلتر، نمودار، CSV)
- Settings (با کانال‌های یادآوری چندگانه)
- AI Assistant
- Upgrade Pro

**زمان تخمینی:** ۵-۷ روز

