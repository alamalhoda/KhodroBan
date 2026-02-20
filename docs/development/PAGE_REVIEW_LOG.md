# لاگ بررسی صفحات (Page Review Log)

خروجی چک‌لیست هر صفحه در اینجا ثبت می‌شود. مرجع قالب: [PAGE_CHECKLIST_TEMPLATE.md](./PAGE_CHECKLIST_TEMPLATE.md).

---

## آخرین همگام‌سازی

- **تاریخ:** 2026-02-20
- **مبنای بازبینی:** برنچ `develop`، وضعیت واقعی تست‌ها (131 backend + 287 frontend)

---

## Login

- **۱. ساختار:** مطابق قوانین (View + store + service)
- **۲. تست frontend:** دارد — auth.test.js, LoginView از طریق store
- **۳. ارتباط با backend:** فقط Django (وقتی VITE_BACKEND_TYPE=django) — POST /api/token/
- **۴. زیرساخت Django:** MyTokenObtainPairView, MeView — کافی
- **۵. تست backend:** دارد — test_auth.py (login, token refresh)
- **۶. مدیریت خطا:** یکپارچه (api interceptor + store error)
- **۷. i18n:** ناقص — پیام‌ها در store/fa؛ نیاز به بررسی locale
- **۸. a11y:** نیاز به بهبود — فرم ورود
- **۹. قرارداد API:** ثبت شده — API_CONTRACT_REGISTRY
- **وضعیت flow:** بدون باگ بحرانی (با timeout/race قبلاً بهبود یافته)
- **اقدامات بعدی:** —

---

## SignUp

- **۱. ساختار:** مطابق قوانین
- **۲. تست frontend:** ناقص — store auth تست شده؛ View جدا ندارد
- **۳. ارتباط با backend:** فقط Django — POST /api/register/
- **۴. زیرساخت Django:** RegisterView — کافی
- **۵. تست backend:** دارد — test_auth.py (register)
- **۶. مدیریت خطا:** یکپارچه
- **۷. i18n:** ناقص
- **۸. a11y:** نیاز به بهبود
- **۹. قرارداد API:** ثبت شده
- **وضعیت flow:** بدون باگ بحرانی
- **اقدامات بعدی:** —

---

## AuthCallback

- **۱. ساختار:** مطابق (صفحه callback OAuth)
- **۲. تست frontend:** ندارد
- **۳. ارتباط با backend:** فقط Supabase (OAuth callback با hash) — برای Django بعداً
- **۴. زیرساخت Django:** ندارد (OAuth در Django پیاده نشده)
- **۵. تست backend:** —
- **۶. مدیریت خطا:** ناقص در حالت Supabase
- **۷. i18n:** ناقص
- **۸. a11y:** —
- **۹. قرارداد API:** در انتظار (Django OAuth)
- **وضعیت flow:** باگ بحرانی در دمو Django ندارد اگر از login با username/password استفاده شود
- **اقدامات بعدی:** برای دمو Django فعلاً از login معمولی استفاده شود؛ OAuth Django در backlog

---

## Dashboard

- **۱. ساختار:** مطابق (DashboardView + stores متعدد)
- **۲. تست frontend:** دارد — DashboardView.test.js
- **۳. ارتباط با backend:** فقط Django (vehicle, service, reminder, expense از shared با Django impl)
- **۴. زیرساخت Django:** VehicleViewSet, ServiceViewSet, ReminderViewSet, DailyExpenseViewSet — کافی
- **۵. تست backend:** دارد — test_api_vehicles، test_api_services، test_api_expenses، test_api_reminders
- **۶. مدیریت خطا:** یکپارچه
- **۷. i18n:** ناقص
- **۸. a11y:** نیاز به بهبود
- **۹. قرارداد API:** ثبت شده
- **وضعیت flow:** بدون باگ بحرانی
- **اقدامات بعدی:** تست API برای services/expenses/reminders در PRهای بعدی

---

## Vehicle List

- **۱. ساختار:** مطابق (VehicleListView + vehicle store)
- **۲. تست frontend:** ناقص — vehicle.test.js دارد؛ View جدا ندارد
- **۳. ارتباط با backend:** فقط Django — GET /api/vehicles/
- **۴. زیرساخت Django:** VehicleViewSet — کافی
- **۵. تست backend:** دارد — test_api_vehicles.py (list, create, update, km, km-history)
- **۶. مدیریت خطا:** یکپارچه
- **۷. i18n:** ناقص
- **۸. a11y:** نیاز به بهبود
- **۹. قرارداد API:** ثبت شده
- **وضعیت flow:** بدون باگ بحرانی
- **اقدامات بعدی:** —

---

## Vehicle Details

- **۱. ساختار:** مطابق (VehicleDetailsView + vehicle, service stores)
- **۲. تست frontend:** ناقص
- **۳. ارتباط با backend:** فقط Django — GET /api/vehicles/<id>/، PATCH km، km-history
- **۴. زیرساخت Django:** VehicleViewSet + actions km, km-history — کافی
- **۵. تست backend:** دارد
- **۶. مدیریت خطا:** یکپارچه
- **۷. i18n:** ناقص
- **۸. a11y:** نیاز به بهبود
- **۹. قرارداد API:** ثبت شده
- **وضعیت flow:** بدون باگ بحرانی
- **اقدامات بعدی:** —

---

## Vehicle Management

- **۱. ساختار:** مطابق (VehicleManagementView + vehicle store)
- **۲. تست frontend:** ناقص
- **۳. ارتباط با backend:** فقط Django — POST /api/vehicles/، PATCH /api/vehicles/<id>/
- **۴. زیرساخت Django:** VehicleViewSet — کافی
- **۵. تست backend:** دارد
- **۶. مدیریت خطا:** یکپارچه
- **۷. i18n:** ناقص
- **۸. a11y:** نیاز به بهبود
- **۹. قرارداد API:** ثبت شده
- **وضعیت flow:** بدون باگ بحرانی
- **اقدامات بعدی:** —

---

## Add Service

- **۱. ساختار:** مطابق (AddServiceView + service, vehicle, serviceType, expenseCategory stores)
- **۲. تست frontend:** ناقص
- **۳. ارتباط با backend:** فقط Django (سرویس/هزینه، نوع سرویس، دسته‌بندی هزینه از Django)
- **۴. زیرساخت Django:** ServiceViewSet با types/items، ServiceItem، seed service_types و expense_categories، DailyExpenseViewSet، latest — کافی
- **۵. تست backend:** دارد (test_api_services: create با types/items، VehicleKmHistory، Jalali date)
- **۶. مدیریت خطا:** یکپارچه
- **۷. i18n:** ناقص
- **۸. a11y:** نیاز به بهبود
- **۹. قرارداد API:** ثبت شده
- **وضعیت flow:** بدون باگ بحرانی؛ اتصال service-types/expense-categories به Django انجام شده
- **اقدامات بعدی:** —

---

## Service List

- **۱. ساختار:** مطابق (ServiceListView + service store)
- **۲. تست frontend:** دارد — `ServiceListView.test.js` + تست store
- **۳. ارتباط با backend:** فقط Django — GET /api/services/
- **۴. زیرساخت Django:** ServiceViewSet — کافی
- **۵. تست backend:** دارد — `test_api_services.py`
- **۶. مدیریت خطا:** یکپارچه
- **۷. i18n:** ناقص
- **۸. a11y:** نیاز به بهبود
- **۹. قرارداد API:** ثبت شده
- **وضعیت flow:** پایدار؛ فیلتر خودرو + pagination + edit/delete تکمیل شده
- **اقدامات بعدی:** —

---

## Reminders

- **۱. ساختار:** مطابق (RemindersView + reminder store)
- **۲. تست frontend:** دارد — `RemindersView.test.js`, `ReminderForm.test.js`, `reminder.test.js`
- **۳. ارتباط با backend:** فقط Django — GET /api/reminders/، GET /api/reminders/user/
- **۴. زیرساخت Django:** ReminderViewSet + dismiss, by_vehicle, user — کافی
- **۵. تست backend:** دارد — `test_api_reminders.py` (CRUD + dismiss + by_vehicle + user)
- **۶. مدیریت خطا:** یکپارچه
- **۷. i18n:** ناقص
- **۸. a11y:** نیاز به بهبود
- **۹. قرارداد API:** ثبت شده
- **وضعیت flow:** پایدار؛ فاز ۱/۲ باگ‌فیکس و Date Picker شمسی تکمیل شده
- **اقدامات بعدی:** —

---

## Reminder Management

- **۱. ساختار:** مطابق (ReminderManagementView + reminder store)
- **۲. تست frontend:** نسبی — تست store/form دارد، تست مستقیم view هنوز محدود است
- **۳. ارتباط با backend:** فقط Django — POST/PATCH/DELETE /api/reminders/، POST dismiss
- **۴. زیرساخت Django:** ReminderViewSet — کافی
- **۵. تست backend:** دارد — `test_api_reminders.py`
- **۶. مدیریت خطا:** یکپارچه
- **۷. i18n:** ناقص
- **۸. a11y:** نیاز به بهبود
- **۹. قرارداد API:** ثبت شده
- **وضعیت flow:** بدون باگ بحرانی
- **اقدامات بعدی:** —

---

## Reports

- **۱. ساختار:** مطابق (ReportsView + report store + reportService)
- **۲. تست frontend:** دارد — ReportsView.test.js
- **۳. ارتباط با backend:** فقط Django — GET /api/reports/summary/ (فیلتر vehicle_id, date_from, date_to)، GET /api/services/ و GET /api/expenses/ برای جدول هزینه‌های اخیر و خروجی CSV سمت کلاینت
- **۴. زیرساخت Django:** ReportSummaryView (فیلتر تاریخ، totalKm، costByMonth فیلترشده) — کافی برای MVP
- **۵. تست backend:** دارد — test_reports.py (احراز هویت، پاسخ خالی، فیلتر vehicle_id، فیلتر date_from/date_to)
- **۶. مدیریت خطا:** یکپارچه (store error + تلاش مجدد)
- **۷. i18n:** ناقص
- **۸. a11y:** نیاز به بهبود
- **۹. قرارداد API:** ثبت شده (فیلترها و totalKm در API_CONTRACT_REGISTRY)
- **وضعیت flow:** بدون باگ بحرانی؛ صفحه با داده واقعی (دراپ‌دان خودرو/بازه، کارت‌ها، نمودار ماهانه، تفکیک هزینه، جدول اخیر، دانلود CSV)
- **اقدامات بعدی:** تست واحد/e2e فرانت برای ReportsView در صورت نیاز

---

## Settings

- **۱. ساختار:** مطابق (SettingsView + TelegramSettings)
- **۲. تست frontend:** ناقص
- **۳. ارتباط با backend:** ترکیب — تلگرام: Django /api/telegram-settings/
- **۴. زیرساخت Django:** TelegramSettingViewSet — کافی
- **۵. تست backend:** ناقص
- **۶. مدیریت خطا:** یکپارچه
- **۷. i18n:** ناقص
- **۸. a11y:** نیاز به بهبود
- **۹. قرارداد API:** ثبت شده
- **وضعیت flow:** بدون باگ بحرانی
- **اقدامات بعدی:** —

---

## Smart Assistant

- **۱. ساختار:** مطابق (SmartAssistantView + ai store + aiAssistantService)
- **۲. تست frontend:** دارد — SmartAssistantView.test.js؛ store و service از Django تست شده
- **۳. ارتباط با backend:** فقط Django — GET/POST `/api/ai/sessions/`، GET `/api/ai/sessions/<id>/messages/`، POST `/api/ai/sessions/<id>/messages/send/` (با `content` و اختیاری `vehicle_id`)، GET `/api/ai/providers/`
- **۴. زیرساخت Django:** اپ `ai_assistant` (ChatSessionViewSet، send_message با orchestrator، context builder، memory، provider factory)
- **۵. تست backend:** دارد — ai_assistant.tests (orchestrator، context_builder، views، provider_factory)
- **۶. مدیریت خطا:** یکپارچه (throttle، timeout، ۵۰۲/۵۰۳ به پیام فارسی)
- **۷. i18n:** دارد — smartAssistant (newChat، chatHistory، chatHistoryEmpty و بقیه)
- **۸. a11y:** نیاز به بهبود
- **۹. قرارداد API:** ثبت شده — API_CONTRACT_REGISTRY (بخش AI Assistant)
- **وضعیت flow:** بدون باگ بحرانی؛ تاریخچه گفتگوها و گفتگوی جدید فعال
- **اقدامات بعدی:** افزایش پوشش تست view در صورت نیاز

---

## Upgrade Pro

- **۱. ساختار:** مطابق (UpgradeProView)
- **۲. تست frontend:** ناقص
- **۳. ارتباط با backend:** فعلاً Supabase-only (MVP: non-blocking)
- **۴. زیرساخت Django:** ندارد (MVP: بعداً)
- **۵. تست backend:** —
- **۶. مدیریت خطا:** ناقص
- **۷. i18n:** ناقص
- **۸. a11y:** نیاز به بهبود
- **۹. قرارداد API:** در انتظار
- **وضعیت flow:** بدون باگ بحرانی برای دمو (صفحه نمایشی؛ پرداخت در backlog)
- **اقدامات بعدی:** —
