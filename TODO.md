# TODO: کارهای باقی‌مانده

این فایل مرکزی برای tracking همه TODOهای پروژه است. همه TODOهای پراکنده در فایل‌های مختلف باید در اینجا ثبت شوند.

> **نکته مهم**: برای هر TODO جدید، یک issue در GitHub ایجاد کنید و لینک آن را در اینجا قرار دهید.

## 🔗 رابطه با سایر فایل‌ها

- **[IMPLEMENTATION_PLAN.md](./frontend-vue/IMPLEMENTATION_PLAN.md)**: برنامه جامع و بلندمدت پیاده‌سازی (Roadmap)
  - این فایل شامل **استراتژی کلی**، **فازها**، و **چک‌لیست‌های جامع** است
  - برای **برنامه‌ریزی بلندمدت** و **دیدن تصویر کلی** استفاده می‌شود
  
- **TODO.md** (این فایل): لیست مرکزی کارهای باقی‌مانده (Task List)
  - این فایل شامل **کارهای مشخص** با **اولویت** و **وضعیت** است
  - برای **tracking روزانه** و **مدیریت کارهای فوری** استفاده می‌شود

**تفاوت:**
- `IMPLEMENTATION_PLAN.md` = نقشه راه (Roadmap) - "چه کارهایی باید انجام شود؟"
- `TODO.md` = لیست کارها (Task List) - "چه کارهایی الان باید انجام شود؟"

---

## 📋 دسته‌بندی TODOها

### 🔴 اولویت بالا (High Priority)
کارهایی که باید در اسرع وقت انجام شوند.

### 🟡 اولویت متوسط (Medium Priority)
کارهایی که مهم هستند اما می‌توانند بعداً انجام شوند.

### 🟢 اولویت پایین (Low Priority)
کارهایی که می‌توانند در آینده انجام شوند.

### 📝 Technical Debt
بدهی‌های فنی که باید رفع شوند.

---

## 🔴 اولویت بالا

### 1. تبدیل group_name به کد انگلیسی
**فایل:** `frontend-vue/TODO_GROUP_NAME_MIGRATION.md`  
**وضعیت:** 📝 در انتظار  
**اولویت:** 🟡 متوسط  
**زمان تخمینی:** 2-3 ساعت

**توضیحات:**
- تبدیل `group_name` در جداول `service_types` و `expense_categories` از فارسی به کد انگلیسی
- به‌روزرسانی stores و i18n files
- ایجاد migration جدید

**لینک:** [TODO_GROUP_NAME_MIGRATION.md](./frontend-vue/TODO_GROUP_NAME_MIGRATION.md)

---

## 🟡 اولویت متوسط

### 1. تکمیل Service Management (فاز ۴)
**فاز:** فاز ۴ از IMPLEMENTATION_PLAN  
**وضعیت:** 📝 در انتظار  
**اولویت:** 🟡 متوسط  
**زمان تخمینی:** 2-3 روز

**توضیحات:**
کارهای باقی‌مانده برای تکمیل مدیریت سرویس‌ها:

1. **UI برای Pagination در ServiceListView**
   - Store پشتیبانی می‌کند اما UI برای pagination وجود ندارد
   - اضافه کردن دکمه‌های Previous/Next
   - نمایش شماره صفحه و تعداد کل صفحات

2. **UI برای فیلترهای پیشرفته در ServiceListView**
   - Store پشتیبانی می‌کند اما UI وجود ندارد
   - فیلتر بر اساس نوع سرویس (filterType)
   - فیلتر بر اساس بازه تاریخ (filterDateFrom, filterDateTo)
   - فیلتر جستجو (searchQuery)

3. **بهبود UX در AddServiceView**
   - بهبود validation و error messages
   - بهبود loading states
   - بهبود responsive design برای موبایل

4. **بهبود ServiceListView**
   - بهبود responsive design برای موبایل
   - بهبود accessibility features
   - اضافه کردن empty state بهتر

5. **تست کامل Service Management**
   - تست CRUD operations
   - تست فیلترها و جستجو
   - تست pagination
   - تست validation

**لینک:** [فاز ۴: مدیریت سرویس‌ها](./frontend-vue/IMPLEMENTATION_PLAN.md#-فاز-۴-مدیریت-سرویسها-service-management)

---

### 2. بهبودهای پیشرفته Service Management (فاز ۴ - آینده)
**فاز:** فاز ۴ از IMPLEMENTATION_PLAN  
**وضعیت:** 📝 در انتظار  
**اولویت:** 🟢 پایین  
**زمان تخمینی:** 5-7 روز

**توضیحات:**
بهبودهای پیشنهادی برای مدیریت سرویس‌ها:

#### 2.1. انتخاب موقعیت مکانی با Google Maps
- **هدف:** امکان انتخاب موقعیت تعمیرگاه/سرویس‌کار از روی نقشه
- **نیازمندی‌ها:**
  - نصب Google Maps JavaScript API
  - دریافت API Key از Google Cloud Console
  - Migration: اضافه کردن فیلدهای `latitude` و `longitude` به جدول `services`
  - Migration: اضافه کردن فیلد `shop_address` (اختیاری)
  - کامپوننت Google Maps Picker
  - ذخیره مختصات در دیتابیس
  - نمایش موقعیت در ServiceListView
- **نکات:**
  - نیاز به Google Maps API Key (ممکن است هزینه داشته باشد)
  - بهتر است از Places API برای autocomplete آدرس استفاده شود
  - در صورت عدم دسترسی به Maps API، می‌توان از OpenStreetMap استفاده کرد

#### 2.2. ترتیب نمایش (Display Order)
- **هدف:** امکان تعریف ترتیب نمایش برای گروه‌ها و زیرگروه‌ها
- **نیازمندی‌ها:**
  - Migration: اضافه کردن فیلد `display_order` به `service_types`
  - Migration: اضافه کردن فیلد `display_order` به `expense_categories`
  - Migration: اضافه کردن فیلد `display_order` به گروه‌ها (یا استفاده از meta JSON)
  - به‌روزرسانی Store برای sort کردن بر اساس `display_order`
  - UI برای مدیریت ترتیب (drag & drop - اختیاری)
- **نکات:**
  - می‌توان از `meta` JSON برای انعطاف‌پذیری بیشتر استفاده کرد
  - ترتیب پیش‌فرض: بر اساس `created_at` یا `code` alphabetically

#### 2.3. رنگ پس‌زمینه برای سرویس‌ها/هزینه‌ها
- **هدف:** امکان تعریف رنگ پس‌زمینه برای هر سرویس/هزینه
- **نیازمندی‌ها:**
  - Migration: اضافه کردن فیلد `meta` (JSONB) به `service_types`
  - Migration: اضافه کردن فیلد `meta` (JSONB) به `expense_categories`
  - ذخیره `background_color` در `meta` JSON
  - به‌روزرسانی Store برای خواندن `meta`
  - به‌روزرسانی UI برای نمایش رنگ در تگ‌ها و لیست‌ها
- **نکات:**
  - استفاده از `meta` JSON برای انعطاف‌پذیری (می‌توان بعداً فیلدهای دیگر اضافه کرد)
  - رنگ پیش‌فرض: رنگ گروه یا رنگ ثابت

#### 2.4. یکپارچه‌سازی تگ و مودال انتخاب سرویس
- **هدف:** همگام‌سازی انتخاب تگ‌ها با مودال انتخاب سرویس
- **نیازمندی‌ها:**
  - به‌روزرسانی `ServiceTypeSelector.vue` برای دریافت `selectedTypes` به عنوان prop
  - به‌روزرسانی `AddServiceView.vue` برای پاس دادن `formData.types` به مودال
  - همگام‌سازی state بین تگ‌ها و مودال
  - به‌روزرسانی UI برای نمایش انتخاب‌های موجود در مودال
- **نکات:**
  - این یک بهبود UX است که تجربه کاربری را بهتر می‌کند
  - باید state management بین دو کامپوننت همگام باشد

#### 2.5. توضیحات پیش‌فرض برای سرویس‌ها/هزینه‌ها
- **هدف:** اضافه کردن خودکار توضیحات پیش‌فرض هنگام انتخاب سرویس/هزینه
- **نیازمندی‌ها:**
  - ذخیره `default_description_template` در `meta` JSON
  - به‌روزرسانی Store برای خواندن `default_description_template`
  - به‌روزرسانی `AddServiceView.vue` برای auto-fill کردن توضیحات
  - مدیریت merge کردن با توضیحات موجود (append یا replace)
- **مثال‌ها:**
  - تعویض روغن → "شرکت و نوع روغن: "
  - تنظیم باد لاستیک → "فشار لاستیک‌ها: "
  - تعویض باتری → "برند و ظرفیت باتری: "
- **نکات:**
  - بهتر است از template string استفاده شود (مثلاً با `{{variable}}`)
  - کاربر باید بتواند توضیحات را ویرایش کند

#### 2.6. فیلد Meta JSON برای انعطاف‌پذیری
- **هدف:** ایجاد فیلد `meta` (JSONB) برای ذخیره اطلاعات اضافی
- **نیازمندی‌ها:**
  - Migration: اضافه کردن فیلد `meta JSONB` به `service_types`
  - Migration: اضافه کردن فیلد `meta JSONB` به `expense_categories`
  - ساختار پیشنهادی `meta`:
    ```json
    {
      "display_order": 1,
      "background_color": "#3b82f6",
      "text_color": "#ffffff",
      "default_description_template": "شرکت و نوع روغن: ",
      "default_fields": ["brand", "type"],
      "custom_fields": []
    }
    ```
  - به‌روزرسانی Store برای خواندن و نوشتن `meta`
  - TypeScript types برای `meta` structure
- **مزایا:**
  - انعطاف‌پذیری برای اضافه کردن فیلدهای جدید بدون migration
  - امکان ذخیره تنظیمات خاص برای هر سرویس/هزینه
  - امکان اضافه کردن custom fields در آینده
- **نکات:**
  - باید validation برای `meta` JSON اضافه شود
  - بهتر است از schema validation استفاده شود (مثلاً Zod)

**Migration پیشنهادی:**
```sql
-- Migration: Add meta JSONB field and location fields
ALTER TABLE public.service_types 
ADD COLUMN IF NOT EXISTS meta JSONB DEFAULT '{}'::jsonb;

ALTER TABLE public.expense_categories 
ADD COLUMN IF NOT EXISTS meta JSONB DEFAULT '{}'::jsonb;

ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS shop_address TEXT;

-- Index for meta queries
CREATE INDEX IF NOT EXISTS idx_service_types_meta ON public.service_types USING GIN (meta);
CREATE INDEX IF NOT EXISTS idx_expense_categories_meta ON public.expense_categories USING GIN (meta);
```

**لینک:** [فاز ۴: مدیریت سرویس‌ها](./frontend-vue/IMPLEMENTATION_PLAN.md#-فاز-۴-مدیریت-سرویسها-service-management)

---

### 3. رفع مشکلات Authentication
**فایل:** `frontend-vue/AUTH_ISSUES_TODO.md`  
**وضعیت:** 🔍 در حال بررسی  
**اولویت:** 🔴 بالا  
**زمان تخمینی:** 4-6 ساعت

**توضیحات:**
- رفع مشکلات non-deterministic login
- رفع timeout issues
- رفع race conditions

**لینک:** [AUTH_ISSUES_TODO.md](./frontend-vue/AUTH_ISSUES_TODO.md)

---

### 4. بهبود UX ایجاد یادآور پس از ثبت سرویس/هزینه (فاز ۶)
**فاز:** فاز ۶ از IMPLEMENTATION_PLAN  
**وضعیت:** 📝 در انتظار  
**اولویت:** 🟡 متوسط  
**زمان تخمینی:** 2-3 روز

**توضیحات:**
بهبود تجربه کاربری برای ایجاد یادآور پس از ثبت سرویس یا هزینه. در حال حاضر یک checkbox ساده وجود دارد که یادآور را با تنظیمات پیش‌فرض ایجاد می‌کند. این بهبود دو گزینه پیشنهادی دارد:

#### گزینه ۱: مودال پس از ثبت
- **هدف:** بعد از ثبت موفقیت‌آمیز سرویس/هزینه، یک مودال برای تعریف یادآور باز شود
- **نیازمندی‌ها:**
  - ایجاد کامپوننت `ReminderModal.vue` یا استفاده از `ReminderForm` در مودال
  - نمایش مودال پس از ثبت موفقیت‌آمیز سرویس/هزینه
  - پیش‌پر کردن فرم یادآور با اطلاعات پیش‌فرض:
    - عنوان: بر اساس نوع سرویس/هزینه (مثلاً "یادآور خودکار: تعویض روغن")
    - توضیحات: از توضیحات سرویس/هزینه
    - خودرو: خودروی انتخاب شده
    - بازه زمانی: بر اساس نوع سرویس (از `getDefaultIntervalsForServiceType`)
    - بازه کیلومتری: بر اساس نوع سرویس
  - کاربر می‌تواند اطلاعات را ویرایش و تایید کند
  - در صورت تایید، یادآور ایجاد می‌شود
  - در صورت لغو، مودال بسته می‌شود و یادآور ایجاد نمی‌شود

#### گزینه ۲: مودال با checkbox
- **هدف:** checkbox برای ایجاد یادآور وجود داشته باشد، اما با انتخاب آن یک مودال کامل باز شود
- **نیازمندی‌ها:**
  - نگه داشتن checkbox در فرم `AddServiceView`
  - با انتخاب checkbox، مودال `ReminderForm` باز شود
  - پیش‌پر کردن فرم با اطلاعات پیش‌فرض (مشابه گزینه ۱)
  - کاربر می‌تواند اطلاعات را ویرایش کند
  - در صورت تایید در مودال، یادآور ایجاد می‌شود
  - در صورت لغو، checkbox غیرفعال می‌شود

#### مزایای هر دو گزینه:
- **تجربه کاربری بهتر:** کاربر می‌تواند یادآور را قبل از ایجاد ببیند و ویرایش کند
- **انعطاف‌پذیری بیشتر:** امکان تغییر بازه‌های زمانی و کیلومتری
- **کنترل بیشتر:** کاربر می‌تواند عنوان و توضیحات را شخصی‌سازی کند

#### فایل‌های مرتبط:
- `frontend-vue/src/views/AddServiceView.vue` - فرم ثبت سرویس/هزینه
- `frontend-vue/src/components/ReminderForm.vue` - فرم یادآور (می‌توان در مودال استفاده شود)
- `frontend-vue/src/components/ui/Modal.vue` - کامپوننت مودال

#### تصمیم‌گیری:
- باید تصمیم بگیریم که کدام گزینه بهتر است یا می‌توان هر دو را به عنوان تنظیمات کاربر ارائه داد
- گزینه ۱: ساده‌تر و مستقیم‌تر (کاربر همیشه می‌تواند یادآور ایجاد کند)
- گزینه ۲: انعطاف‌پذیرتر (کاربر می‌تواند انتخاب کند که یادآور ایجاد کند یا نه)

**لینک:** [فاز ۶: یادآورها و نوتیفیکیشن‌ها](./frontend-vue/IMPLEMENTATION_PLAN.md#-فاز-۶-یادآورها-و-نوتیفیکیشنها-reminders--notifications--تکمیل-شده)

---

### 5. بهبود و رفع اشکال فرم یادآور - تاریخ محاسبه شده (فاز ۶)
**فاز:** فاز ۶ از IMPLEMENTATION_PLAN  
**وضعیت:** 📝 در انتظار  
**اولویت:** 🟡 متوسط  
**زمان تخمینی:** 1-2 روز

**توضیحات:**
بهبود و رفع اشکال در فرم یادآور (`ReminderForm.vue`) مربوط به مدیریت تاریخ محاسبه شده:

#### 5.1. تبدیل فیلد تاریخ محاسبه شده به Date Picker
- **مشکل فعلی:** تاریخ محاسبه شده فقط به صورت متن نمایش داده می‌شود و قابل ویرایش نیست
- **هدف:** تبدیل فیلد تاریخ محاسبه شده به یک Date Picker (تقویم) که کاربر بتواند تاریخ را تغییر دهد
- **نیازمندی‌ها:**
  - نصب یا استفاده از یک Date Picker component (مثلاً `vue-datepicker` یا `@vuepic/vue-datepicker`)
  - یا استفاده از native HTML5 `<input type="date">` با استایل مناسب
  - جایگزینی نمایش متن تاریخ با Date Picker
  - حفظ قابلیت محاسبه خودکار تاریخ بر اساس بازه زمانی
  - امکان ویرایش دستی تاریخ توسط کاربر
  - همگام‌سازی تاریخ ویرایش شده با `formData.dueDate`
  - نمایش تاریخ به فرمت مناسب (مثلاً شمسی یا میلادی)

#### 5.2. رفع اشکال به‌روزرسانی تاریخ در بازه زمانی سفارشی
- **مشکل فعلی:** وقتی بازه زمانی "سفارشی" انتخاب می‌شود و کاربر مقدار بازه زمانی (روز/هفته/ماه) را تغییر می‌دهد، تاریخ محاسبه شده به‌روز نمی‌شود
- **هدف:** با تغییر مقدار بازه زمانی یا نوع واحد (روز/هفته/ماه)، تاریخ محاسبه شده باید به‌صورت خودکار به‌روز شود
- **نیازمندی‌ها:**
  - بررسی و رفع `watch` برای `timeInterval` در `ReminderForm.vue`
  - بررسی و رفع `watch` برای `timeIntervalType` (روز/هفته/ماه)
  - اطمینان از اینکه `calculatedDueDate` computed property به‌درستی reactive است
  - تست تغییر مقدار بازه زمانی و بررسی به‌روزرسانی تاریخ
  - تست تغییر نوع واحد (روز به هفته، هفته به ماه) و بررسی به‌روزرسانی تاریخ
  - در صورت ویرایش دستی تاریخ توسط کاربر، محاسبه خودکار غیرفعال شود (یا با هشدار)

#### فایل‌های مرتبط:
- `frontend-vue/src/components/ReminderForm.vue` - فرم یادآور
- `frontend-vue/src/components/ui/` - کامپوننت‌های UI (در صورت نیاز به Date Picker component)

#### نکات پیاده‌سازی:
- اگر از Date Picker library استفاده می‌شود، باید با i18n سازگار باشد (پشتیبانی از فارسی)
- بهتر است از یک Date Picker استفاده شود که از تقویم شمسی پشتیبانی می‌کند
- در صورت استفاده از native `<input type="date">`، باید استایل آن با طراحی کلی هماهنگ باشد
- باید مطمئن شویم که وقتی کاربر تاریخ را دستی تغییر می‌دهد، بازه زمانی به‌روز نمی‌شود (یا vice versa)

**لینک:** [فاز ۶: یادآورها و نوتیفیکیشن‌ها](./frontend-vue/IMPLEMENTATION_PLAN.md#-فاز-۶-یادآورها-و-نوتیفیکیشنها-reminders--notifications--تکمیل-شده)

---

## 📝 Technical Debt

### 1. رفع Type Check و Lint Issues
**فایل:** `frontend/TODO.md`  
**وضعیت:** 📝 در انتظار  
**اولویت:** 🟡 متوسط  
**زمان تخمینی:** 3-4 PR

**توضیحات:**
- رفع 116 خطای Type check
- رفع 31 warning Type check
- رفع 183 warning Lint

**لینک:** [frontend/TODO.md](./frontend/TODO.md)

---

## 📅 تاریخچه

- **2025-01-XX**: ایجاد فایل TODO مرکزی
- **2025-01-XX**: اضافه شدن TODO تبدیل group_name
- **2025-01-XX**: ایجاد سیستم مدیریت TODO مرکزی
- **2025-01-XX**: اضافه شدن کارهای باقی‌مانده Service Management (فاز ۴)
- **2025-01-XX**: اضافه شدن بهبودهای پیشرفته Service Management (Google Maps, Meta JSON, Order, Colors, etc.)
- **2025-01-XX**: اضافه شدن بهبود UX ایجاد یادآور پس از ثبت سرویس/هزینه (فاز ۶)
- **2025-01-XX**: اضافه شدن بهبود و رفع اشکال فرم یادآور - تاریخ محاسبه شده (فاز ۶)

---

## 🔗 لینک‌های مفید

- [GitHub Issues](https://github.com/your-org/OilChenger/issues) - برای tracking issues
- [IMPLEMENTATION_PLAN.md](./frontend-vue/IMPLEMENTATION_PLAN.md) - برنامه جامع پیاده‌سازی (Roadmap)
- [ROADMAP.md](./ROADMAP.md) - برنامه‌ریزی بلندمدت (در صورت وجود)

---

## 📝 نحوه استفاده

1. **برای TODO جدید:**
   - یک issue در GitHub ایجاد کنید
   - TODO را در این فایل اضافه کنید با لینک به issue
   - اگر TODO در فایل جداگانه است، لینک به آن فایل را اضافه کنید

2. **برای به‌روزرسانی TODO:**
   - وضعیت را به‌روز کنید (✅ انجام شد، 🔍 در حال انجام، 📝 در انتظار)
   - تاریخ به‌روزرسانی را در بخش تاریخچه اضافه کنید

3. **برای حذف TODO:**
   - TODO را به بخش "انجام شده" منتقل کنید
   - یا کاملاً حذف کنید اگر دیگر لازم نیست

---

**آخرین به‌روزرسانی:** 2025-01-XX

