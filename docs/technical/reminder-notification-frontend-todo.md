# کارهای فرانت‌اند در حوزه یادآوری و نوتیفیکیشن

پس از انجام فازهای ۱–۴ در backend، این سند کارهای باقی‌مانده در **واسط کاربری (Frontend)** را برای حوزه reminder و notification فهرست می‌کند.

**مرجع معماری:** `docs/technical/reminder-system-status.md` و `reminder-notification-api-blueprint.md`

---

## وضعیت فعلی فرانت (خلاصه)

| قابلیت | وضعیت | توضیح |
|--------|--------|--------|
| لیست و مدیریت یادآورها | ✅ موجود | RemindersView، ReminderManagementView، reminder store، اتصال به API |
| نوتیفیکیشن درون‌برنامه (زنگوله) | ✅ موجود | NotificationBell در Header، notification store، notificationServiceDjango |
| اتصال تلگرام در تنظیمات | ✅ موجود | TelegramSettings، telegram store، generate_code / disconnect |
| تنظیمات پیش‌فرض یادآور (بازه کیلومتر/زمان) | ❌ اتصال به API ندارند | اسلایدرها در SettingsView ثابت هستند |
| روش‌های اطلاع‌رسانی (ایمیل/پیامک) در تنظیمات | ❌ فقط استاتیک | سوئیچ‌ها به API ترجیحات نوتیفیکیشن وصل نیستند |
| صفحه «همه اعلان‌ها» | ❌ وجود ندارد | دکمه «مشاهده همه» در زنگوله به مسیر مشخصی نمی‌رود |
| رفتن از اعلان به خودرو | ❌ غیرفعال | در NotificationBell کلیک روی اعلان به جزئیات خودرو نمی‌رود |

---

## ۱) نوتیفیکیشن (Notification)

### ۱.۱ صفحه «همه اعلان‌ها»
- **کار:** اضافه کردن یک View (مثلاً `NotificationsView.vue`) برای نمایش لیست کامل اعلان‌ها با امکان mark as read، mark all read و حذف.
- **مسیر پیشنهادی:** `/notifications` با نام `notifications` در router.
- **اتصال:** همان `notificationStore` و `notificationService` (در حالت Django از API موجود استفاده می‌کند).
- **خروجی:** دکمه «مشاهده همه» در `NotificationBell.vue` به این مسیر لینک شود (`router-link` یا `router.push`).

### ۱.۲ رفتن از اعلان به خودرو (Deep link)
- **کار:** در `NotificationBell.vue` تابع `handleNotificationClick` در صورت وجود `notification.vehicle_id` کاربر را به صفحه جزئیات خودرو (`vehicle-details`) هدایت کند.
- **وضعیت فعلی:** کد `router.push` کامنت شده است؛ فقط با فعال کردن و اطمینان از وجود `vehicle_id` در payload پاسخ API انجام می‌شود.

### ۱.۳ بهبودهای اختیاری نوتیفیکیشن
- نمایش حالت خالی/خطا یکسان در زنگوله و صفحه همه اعلان‌ها.
- در حالت Django، اطمینان از interval مناسب short-poll (مثلاً ۳۰–۶۰ ثانیه) برای به‌روزرسانی تعداد خوانده‌نشده.

---

## ۲) یادآور (Reminder)

### ۲.۱ اتصال «یادآورهای هوشمند» در تنظیمات به API
- **کار:** بخش «یادآورهای هوشمند» در `SettingsView.vue` (اسلایدرهای بازه کیلومتر و بازه زمانی و روزهای هشدار) به داده واقعی وصل شود.
- **نکته backend:** در Django مدل `ReminderSetting` به **خودرو** وابسته است (per-vehicle). مسیر API: `GET/PATCH /api/reminder-settings/` (فیلتر بر اساس vehicle).
- **گزینه‌های طراحی:**
  - **الف)** نمایش تنظیمات به‌ازای هر خودرو (لیست خودروها + تنظیمات هر کدام) و فراخوانی `reminder-settings` برای هر خودرو یا لیست.
  - **ب)** در صورت تعریف «الگوی پیش‌فرض» در backend، یک درخواست برای پیش‌فرض سراسری و اعمال آن روی خودروهای جدید.
- **سرویس فرانت:** در حالت Django از مسیر صحیح API استفاده شود. در `shared/services/reminderService.ts` متدهای `getSettings` / `updateSettings` برای Django به مسیر `reminder-settings` (یا همانی که backend ارائه می‌دهد) نگاشت شوند؛ در حال حاضر ممکن است مسیر `reminders/settings/` استفاده شود که با `reminder-settings` در backend متفاوت است و باید هماهنگ شود.

### ۲.۲ بهبودهای اختیاری یادآور
- در صفحات یادآور (مثلاً RemindersView)، نمایش واضح حالت «خوانده‌شده/تکمیل شده» (dismissed) در صورت پشتیبانی API.
- لینک مستقیم از کارت یادآور به جزئیات خودروی مربوطه (در صورت نبود).

---

## ۳) تنظیمات کانال‌های اطلاع‌رسانی

### ۳.۱ سوئیچ کانال‌ها (تلگرام / ایمیل / پیامک / درون‌برنامه)
- **وضعیت backend:** مدل `NotificationPreference` (per user/event/channel) وجود دارد و از طریق **Admin** قابل تنظیم است؛ در حال حاضر **API عمومی (REST) برای خواندن/ویرایش ترجیحات نوتیفیکیشن توسط کاربر لاگین‌شده** در blueprint فاز ۳ تعریف نشده است.
- **کار فرانت (گزینه‌ها):**
  - **الف)** اگر backend یک API برای `GET/PATCH` ترجیحات نوتیفیکیشن کاربر (مثلاً `/api/notification-preferences/`) اضافه کند، در Settings یک بخش «روش‌های اطلاع‌رسانی» با سوئیچ برای هر کانال (درون‌برنامه، تلگرام، ایمیل، پیامک) بسازید و به این API وصل کنید.
  - **ب)** تا زمان وجود API: همان UI فعلی را با توضیح کوتاه (مثلاً «تنظیم کانال‌ها از طریق پشتیبانی» یا «به‌زودی») به‌صورت placeholder نگه دارید و لینک به مستندات یا پشتیبانی بدهید.

### ۳.۲ تلگرام
- **وضعیت:** کامپوننت `TelegramSettings` و store تلگرام موجود و به API وصل است (اتصال، قطع، تولید کد).
- **بهبودهای اختیاری:** پیام خطای شفاف‌تر در صورت عدم دسترسی به ربات، به‌روزرسانی دوره‌ای وضعیت اتصال پس از بازگشت به تب تنظیمات.

---

## ۴) یکپارچگی و تست

### ۴.۱ حالت Django
- اطمینان از اینکه با `VITE_BACKEND_TYPE=django` و `VITE_API_URL` صحیح:
  - لیست یادآورها و نوتیفیکیشن‌ها از Django بارگذاری می‌شوند.
  - mark as read / mark all read / حذف اعلان در UI منعکس می‌شود.
  - اتصال/قطع تلگرام از همان backend انجام می‌شود.

### ۴.۲ تست‌های مربوط
- در صورت اضافه شدن `NotificationsView` یا تغییر در NotificationBell، تست واحد/یکپارچگی برای بارگذاری لیست و اقدامات (mark read، حذف، ناوبری به خودرو) توصیه می‌شود.

---

## اولویت‌بندی پیشنهادی

| اولویت | کار | وابستگی |
|--------|-----|---------|
| بالا | صفحه «همه اعلان‌ها» + لینک «مشاهده همه» | فقط فرانت |
| بالا | فعال‌سازی deep link از اعلان به جزئیات خودرو | فقط فرانت (و اطمینان از vehicle_id در API) |
| متوسط | اتصال بخش یادآورهای هوشمند در Settings به API reminder-settings | هماهنگی مسیر API در shared و طراحی per-vehicle یا پیش‌فرض |
| متوسط | API ترجیحات نوتیفیکیشن در backend + UI سوئیچ کانال‌ها در Settings | ابتدا backend (اختیاری)، سپس فرانت |
| پایین | بهبود پیام خطا و وضعیت اتصال تلگرام، تست‌های اضافه | — |

---

## مراجع

- **Backend API:** `docs/technical/reminder-notification-api-blueprint.md`، `docs/development/API_CONTRACT_REGISTRY.md`
- **وضعیت سیستم:** `docs/technical/reminder-system-status.md`
- **فرانت:** `frontend-vue/src/stores/notification.js`، `frontend-vue/src/stores/reminder.js`، `shared/services/notificationService.ts`، `shared/services/reminderService.ts`

**آخرین به‌روزرسانی:** 2026-02-15
