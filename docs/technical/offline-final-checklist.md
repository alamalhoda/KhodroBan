# چک لیست نهایی اجرای آفلاین (Strict Offline)

این چک لیست معیار نهایی «قبول/رد» برای آفلاین بودن پروژه است.

استفاده پیشنهادی:
- یک بار روی سیستم آنلاین (برای آماده سازی bundle)
- یک بار روی سیستم کاملا آفلاین (برای تایید نهایی)

---

## A) آماده سازی بسته آفلاین

- [ ] سورس پروژه از commit مشخص خروجی گرفته شده (`git archive` یا zip)
- [ ] وابستگی Node برای `frontend-vue` آماده و منتقل شده (`node_modules` + `package-lock.json`)
- [ ] در صورت نیاز، وابستگی Node برای `shared` هم آماده شده
- [ ] wheelhouse پایتون برای `backend/django/requirements.txt` آماده شده
- [ ] wheelhouse پایتون برای `backend/django/requirements-dev.txt` آماده شده
- [ ] wheelhouse پایتون برای `reminder-service/requirements.txt` آماده شده (در صورت نیاز)
- [ ] wheelhouse پایتون برای `reminder-service/telegram_requirements.txt` آماده شده (در صورت نیاز)
- [ ] فایل های env نمونه/واقعی برای محیط مقصد آماده شده

---

## B) دارایی های محلی (fonts/icons/images)

- [ ] فایل `frontend-vue/public/fonts/vazirmatn-local.css` موجود است
- [ ] فایل `frontend-vue/public/fonts/material-symbols-local.css` موجود است
- [ ] فایل `frontend-vue/public/fonts/MaterialSymbolsOutlined.woff2` موجود است
- [ ] تمام فایل های `Vazirmatn-*.woff2` موجود است
- [ ] پوشه **Font Awesome Pro** (`frontend-vue/public/fontawesome-pro-7.1.0-web/`) موجود است و شامل `css/` و `webfonts/` است (در Git نیست؛ از بسته آفلاین کپی شود)
- [ ] (اختیاری) برای بازتولید لیست آیکون‌های انتخابگر در محیط آفلاین: پوشه `metadata/` با `icons.json` یا `icons.yml` در همان پوشه Font Awesome موجود است؛ سپس `npm run generate:fa-icons` قابل اجرا است
- [ ] هیچ asset ضروری UI فقط از CDN لود نمی شود
- [ ] تصاویر استفاده شده در `src/views` به مسیرهای محلی (`/images/...`) اشاره می کنند

---

## C) اجرای آفلاین Backend

- [ ] محیط مجازی ساخته و فعال شده است (`backend/django/venv`)
- [ ] نصب پکیج ها فقط با `--no-index --find-links` انجام شده
- [ ] `python manage.py migrate` بدون خطا اجرا شده
- [ ] `python manage.py runserver` بدون خطا اجرا شده
- [ ] API روی `http://127.0.0.1:8000` در دسترس است

---

## D) اجرای آفلاین Frontend

- [ ] `frontend-vue/node_modules` بدون اینترنت در دسترس است
- [ ] `.env.local` آفلاین تنظیم شده:
  - [ ] `VITE_BACKEND_TYPE=django` یا `mock`
  - [ ] `VITE_API_URL=http://127.0.0.1:8000/api` (در حالت django)
  - [ ] `VITE_AI_USE_MOCK=true` (در محیط بدون AI provider)
  - [ ] `VITE_OFFLINE_MODE=true`
- [ ] `npm run dev` بدون نیاز به دانلود جدید اجرا می شود
- [ ] UI اصلی روی `http://localhost:5174` بدون خرابی فونت/آیکون نمایش داده می شود (فونت‌های متنی، Material Symbols، Font Awesome Pro Duotone)

---

## E) تست Strict Offline (اینترنت کاملا قطع)

- [ ] اینترنت سیستم مقصد کامل قطع شده است
- [ ] Login/Dashboard/Vehicles/Services/Reminders/Reports باز می شوند
- [ ] عملیات پایه CRUD با backend محلی انجام می شود
- [ ] در Network tab مرورگر هیچ درخواست `https://...` بیرونی ثبت نمی شود
- [ ] خطای بارگذاری فونت/تصویر خارجی دیده نمی شود

---

## F) قابلیت های آنلاین که باید کنترل شوند

- [ ] مسیر Supabase در محیط آفلاین فعال نیست (یا backend روی django/mock است)
- [ ] قابلیت های Telegram در محیط آفلاین disable یا fail-safe هستند
- [ ] AI provider واقعی (OpenAI/OpenRouter/...) در محیط آفلاین mock/disable شده است

---

## G) ممیزی نهایی URL خارجی

- [ ] خروجی این دستور برای runtime اصلی بررسی شده:

```bash
rg "https://|fonts.googleapis.com|fonts.gstatic.com|cdn.tailwindcss.com|googleusercontent.com|transparenttextures.com" frontend-vue/src frontend-vue/index.html
```

- [ ] هر match باقی مانده یا حذف شده یا به عنوان «غیر runtime/غیر critical» مستند شده است

---

## H) خروجی تحویل

- [ ] مستند `docs/technical/offline-setup.md` به روز است
- [ ] این چک لیست تکمیل و تایید شده است
- [ ] branch/PR آفلاین شامل توضیح تست های انجام شده است

