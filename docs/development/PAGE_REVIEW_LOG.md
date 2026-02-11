# لاگ بررسی صفحات (Page Review Log)

خروجی چک‌لیست هر صفحه در اینجا ثبت می‌شود. مرجع قالب: [PAGE_CHECKLIST_TEMPLATE.md](./PAGE_CHECKLIST_TEMPLATE.md).

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
- **۵. تست backend:** ناقص — فقط vehicles و auth؛ services/expenses/reminders بدون تست API
- **۶. مدیریت خطا:** یکپارچه
- **۷. i18n:** ناقص
- **۸. a11y:** نیاز به بهبود
- **۹. قرارداد API:** ثبت شده
- **وضعیت flow:** بدون باگ بحرانی
- **اقدامات بعدی:** تست API برای services/expenses/reminders در PRهای بعدی
