# راهنمای کامل راه اندازی آفلاین پروژه KhodroBan (OilChenger)

این سند برای زمانی است که **سیستم مقصد هیچ اینترنتی ندارد**.  
هدف این است که پروژه را به صورت کامل (Backend + Frontend + وابستگی ها) روی سیستم آفلاین بالا بیاورید.

چک لیست نهایی پذیرش:
- `docs/technical/offline-final-checklist.md`

---

## 1) سناریوی استاندارد

برای راه اندازی آفلاین، همیشه از مدل دو سیستم استفاده کنید:

1. **سیستم A (آنلاین)**: جمع آوری وابستگی ها و ساخت بسته آفلاین
2. **سیستم B (آفلاین)**: نصب از روی بسته منتقل شده (USB / شبکه داخلی)

> مهم: بهتر است سیستم A و B از نظر OS / معماری CPU / نسخه Python و Node همسان باشند.

---

## 2) چیزهایی که در Git نیستند (و باید جداگانه منتقل شوند)

با توجه به `.gitignore`:

- `node_modules/` ها commit نمی شوند
- `venv/` ها commit نمی شوند
- فایل های env محلی مثل `.env.local` commit نمی شوند
- پوشه **Font Awesome** در `public` commit نمی شود:
  - `frontend-vue/public/fontawesome-pro-7.1.0-web/` (نسخه Pro 7.1.0 – تنها منبع آیکون‌ها؛ فقط استایل Duotone استفاده می‌شود؛ در صورت وجود پوشه `metadata/` با `icons.json` یا `icons.yml` می‌توان لیست آیکون‌ها را با `npm run generate:fa-icons` بازتولید کرد)

همچنین برای اجرای کامل UI به فایل های فونت محلی نیاز دارید (در `frontend-vue/public/fonts/`) که ممکن است روی clone جدید وجود نداشته باشند.

---

## 3) پیش نیازهای سیستم آفلاین

- Node.js (پیشنهاد: نسخه 20 یا بالاتر)
- npm
- Python 3.11+
- ابزار unzip/tar

> نصب Node/Python روی سیستم آفلاین باید از installer آفلاین انجام شود (فایل نصاب را از سیستم آنلاین منتقل کنید).

---

## 4) آماده سازی بسته آفلاین روی سیستم آنلاین (A)

در ریشه پروژه اجرا کنید:

```bash
mkdir -p offline-bundle/source
mkdir -p offline-bundle/node
mkdir -p offline-bundle/python/backend
mkdir -p offline-bundle/python/backend-dev
mkdir -p offline-bundle/python/reminder
mkdir -p offline-bundle/python/reminder-telegram
mkdir -p offline-bundle/python/bootstrap
mkdir -p offline-bundle/assets/fonts
mkdir -p offline-bundle/env
```

### 4.1) بسته سورس کد

```bash
git archive --format=tar.gz --output offline-bundle/source/OilChenger-src.tar.gz HEAD
```

(یا به جای `git archive`، کل پوشه پروژه را zip کنید.)

### 4.2) وابستگی های Node (روش پیشنهادی: انتقال مستقیم node_modules)

```bash
cd frontend-vue
npm ci
tar -czf ../offline-bundle/node/frontend-vue-node_modules.tar.gz node_modules package.json package-lock.json

cd ../shared
npm ci
tar -czf ../offline-bundle/node/shared-node_modules.tar.gz node_modules package.json package-lock.json

cd ..
```

> اگر فقط اجرای UI لازم است، بسته `frontend-vue` کافی است.  
> بسته `shared` برای توسعه/تست های مستقل shared مفید است.

### 4.3) وابستگی های Python (wheelhouse آفلاین)

طبق policy پروژه، قبل از هر دستور Python محیط مجازی را فعال کنید:

```bash
python3 -m venv backend/django/venv
source backend/django/venv/bin/activate

python -m pip install --upgrade pip wheel setuptools
pip download pip setuptools wheel -d offline-bundle/python/bootstrap

pip download -r backend/django/requirements.txt -d offline-bundle/python/backend
pip download -r backend/django/requirements-dev.txt -d offline-bundle/python/backend-dev
pip download -r reminder-service/requirements.txt -d offline-bundle/python/reminder
pip download -r reminder-service/telegram_requirements.txt -d offline-bundle/python/reminder-telegram

deactivate
```

### 4.4) فایل های env و config محلی

فایل های env شما در Git نیستند. نمونه ها را کپی و سفارشی کنید، سپس داخل bundle بگذارید:

```bash
cp frontend-vue/.env.example offline-bundle/env/frontend-vue.env.local.example
cp reminder-service/.env.example offline-bundle/env/reminder-service.env.example
```

برای اجرای آفلاین Frontend بهتر است env واقعی بسازید (بخش 6.3 را ببینید).

### 4.5) Assets برای حالت آفلاین کامل

این فایل ها را حتما در bundle بگذارید:

**فونت‌های متنی و آیکون Material:**
- `frontend-vue/public/fonts/vazirmatn-local.css`
- `frontend-vue/public/fonts/material-symbols-local.css`
- همه فایل های فونت:
  - `Vazirmatn-*.woff2`
  - `MaterialSymbolsOutlined.woff2`

**Font Awesome Pro (آیکون‌های خودرو و UI):**  
پکیج npm Font Awesome حذف شده؛ آیکون‌ها از پوشه محلی لود می‌شوند. کل پوشه را در bundle بگذارید:
- `frontend-vue/public/fontawesome-pro-7.1.0-web/` (شامل `css/` و `webfonts/`؛ برای بازتولید لیست آیکون‌های انتخابگر در محیط آفلاین اختیاری است: پوشه `metadata/` با `icons.json` یا `icons.yml`)

نمونه کپی به bundle:

```bash
# فونت‌های متنی و Material Symbols
cp frontend-vue/public/fonts/*.css offline-bundle/assets/fonts/
cp frontend-vue/public/fonts/*.woff2 offline-bundle/assets/fonts/

# Font Awesome Pro (کل پوشه؛ در Git نیست)
cp -R frontend-vue/public/fontawesome-pro-7.1.0-web offline-bundle/assets/
```

اگر فونت های متنی را ندارید، ابتدا طبق `frontend-vue/docs/FONT_DOWNLOAD_GUIDE.md` دانلود کنید. پوشه Font Awesome Pro را از داشتن لایسنس معتبر تهیه و در `frontend-vue/public/` قرار دهید.

در صورت نیاز به صفحات UX قدیمی:

- فایل های `frontend-vue/ux/**/index.html` از Google Fonts و `cdn.tailwindcss.com` استفاده می کنند
- برای آفلاین باید یا:
  1) URLها را به فایل محلی تغییر دهید، یا
  2) از این صفحات در محیط آفلاین استفاده نکنید (اپ اصلی Vue از این صفحات استفاده نمی کند)

---

## 5) انتقال به سیستم آفلاین (B)

کل پوشه `offline-bundle/` را به سیستم B منتقل کنید.  
پیشنهاد: checksum بگیرید تا از سلامت فایل ها مطمئن شوید.

---

## 6) راه اندازی روی سیستم آفلاین (B)

### 6.1) استخراج سورس

```bash
mkdir -p ~/Projects/OilChenger
tar -xzf /PATH/TO/offline-bundle/source/OilChenger-src.tar.gz -C ~/Projects/OilChenger
cd ~/Projects/OilChenger
```

### 6.2) Backend Django (بدون اینترنت)

```bash
python3 -m venv backend/django/venv
source backend/django/venv/bin/activate

python -m pip install --no-index --find-links /PATH/TO/offline-bundle/python/bootstrap --upgrade pip setuptools wheel
pip install --no-index --find-links /PATH/TO/offline-bundle/python/backend -r backend/django/requirements.txt

cd backend/django
python manage.py migrate
python manage.py runserver
```

Backend روی `http://127.0.0.1:8000` بالا می آید.

### 6.3) Frontend Vue (بدون اینترنت)

1) node_modules آماده را extract کنید:

```bash
cd ~/Projects/OilChenger/frontend-vue
tar -xzf /PATH/TO/offline-bundle/node/frontend-vue-node_modules.tar.gz
```

(اختیاری برای shared)

```bash
cd ~/Projects/OilChenger/shared
tar -xzf /PATH/TO/offline-bundle/node/shared-node_modules.tar.gz
```

2) env آفلاین بسازید:

```bash
cat > .env.local <<'EOF'
VITE_BACKEND_TYPE=django
VITE_API_URL=http://127.0.0.1:8000/api
VITE_AI_USE_MOCK=true
VITE_OFFLINE_MODE=true
EOF
```

3) دارایی‌های محلی را کپی کنید (در repo نیستند):

```bash
# فونت‌های متنی و Material Symbols
cp -R /PATH/TO/offline-bundle/assets/fonts/* ~/Projects/OilChenger/frontend-vue/public/fonts/

# Font Awesome Pro (آیکون‌های Duotone)
cp -R /PATH/TO/offline-bundle/assets/fontawesome-pro-7.1.0-web ~/Projects/OilChenger/frontend-vue/public/
```

4) اجرا:

```bash
npm run dev
```

Frontend روی `http://localhost:5174` بالا می آید.

> اگر بعضی قابلیت ها به Supabase/Telegram/OpenAI وابسته باشند، در حالت کاملا آفلاین کار نمی کنند؛ برای توسعه آفلاین از backend محلی Django و AI mock استفاده کنید.

### 6.4) reminder-service (اختیاری)

```bash
cd ~/Projects/OilChenger
python3 -m venv reminder-service/venv
source reminder-service/venv/bin/activate

python -m pip install --no-index --find-links /PATH/TO/offline-bundle/python/bootstrap --upgrade pip setuptools wheel
pip install --no-index --find-links /PATH/TO/offline-bundle/python/reminder -r reminder-service/requirements.txt
pip install --no-index --find-links /PATH/TO/offline-bundle/python/reminder-telegram -r reminder-service/telegram_requirements.txt
```

---

## 7) راهکار آفلاین برای CDN و منابع اینترنتی

### 7.1) Frontend runtime اصلی (`frontend-vue/index.html`)

- **Font Awesome:** دیگر از پکیج npm استفاده نمی‌شود؛ از پوشه محلی `public/fontawesome-pro-7.1.0-web/` لود می‌شود (`fontawesome.min.css` + `duotone.min.css`). این پوشه در Git نیست و باید در بسته آفلاین و روی سیستم مقصد قرار گیرد.
- منابع اینترنتی احتمالی دیگر: `fonts.googleapis.com` / `fonts.gstatic.com` (در صورت وجود لینک fallback).

راهکار آفلاین:

1. فونت های محلی (`public/fonts/*.woff2`) و پوشه **Font Awesome Pro** (`public/fontawesome-pro-7.1.0-web/`) را کامل تامین کنید.
2. برای حالت **strict offline**، لینک های fallback گوگل را از `index.html` حذف یا comment کنید تا هیچ تلاش شبکه بیرونی انجام نشود.

### 7.2) صفحات UX استاتیک (`frontend-vue/ux/**/index.html`)

منابع اینترنتی فعلی:

- Google Fonts
- `https://cdn.tailwindcss.com?plugins=forms,container-queries`

راهکار آفلاین:

- اگر این صفحات فقط reference طراحی هستند، از چرخه اجرای آفلاین حذفشان کنید.
- اگر باید اجرا شوند:
  1) فایل Tailwind CDN را یک بار روی سیستم آنلاین دانلود و local serve کنید.
  2) فونت ها را local کنید.
  3) `script/link` های هر صفحه UX را به مسیر محلی تغییر دهید.

### 7.3) تصاویر خارجی در برخی Viewها

برخی فایل های `src/views` از آدرس های بیرونی مثل `lh3.googleusercontent.com` و `transparenttextures.com` استفاده می کنند.  
برای آفلاین واقعی:

1. تصاویر را دانلود کنید.
2. در `frontend-vue/public/images/` قرار دهید.
3. URLها را به مسیر محلی (`/images/...`) تغییر دهید.

---

## 8) چک سریع قبل از تحویل سیستم آفلاین

- [ ] Backend با `python manage.py runserver` بدون خطا بالا می آید
- [ ] Frontend با `npm run dev` بدون نصب جدید npm بالا می آید
- [ ] صفحه login/dashboard بدون فونت یا icon خراب نمایش داده نمی شود
- [ ] `VITE_BACKEND_TYPE=django` یا `mock` تنظیم شده است
- [ ] `VITE_OFFLINE_MODE=true` برای قطع قابلیت های آنلاین تنظیم شده است
- [ ] قابلیت های آنلاین (Supabase/Telegram/AI Real) برای حالت آفلاین غیرفعال یا mock شده اند

---

## 9) عیب یابی رایج

### خطای `pip install` در حالت آفلاین

- wheel مناسب platform/py-version ندارید
- wheelها باید روی سیستم همسان با مقصد دانلود شوند

### خطای `npm` درباره package missing

- `node_modules` کامل منتقل نشده
- tar در مسیر درست extract نشده
- lock/package mismatch است (از همان commit استفاده کنید)

### آیکون Material Symbols نمایش داده نمی شود

- فایل `frontend-vue/public/fonts/MaterialSymbolsOutlined.woff2` وجود ندارد

### آیکون‌های Font Awesome (خودرو/UI) نمایش داده نمی شوند

- پوشه `frontend-vue/public/fontawesome-pro-7.1.0-web/` وجود ندارد یا ناقص است
- زیرپوشه‌های `css/` و `webfonts/` باید در همان مسیر باشند (مسیر نسبی در CSS: `../webfonts/`)
- لیست آیکون‌های انتخابگر در فرم خودرو از `src/config/fontAwesomeIconNames.js` خوانده می‌شود (در Git است). برای بازتولید این لیست در محیط آفلاین، پوشه `metadata/` با `icons.json` یا `icons.yml` لازم است؛ سپس `npm run generate:fa-icons` را اجرا کنید.

### فونت Vazirmatn اعمال نمی شود

- فایل های `Vazirmatn-*.woff2` موجود نیستند
- `vazirmatn-local.css` موجود است ولی فایل های font کنار آن نیستند

---

## 10) دستور audit برای کشف منابع خارجی

برای پیدا کردن URLهای بیرونی:

```bash
rg "https://|cdn.tailwindcss.com|fonts.googleapis.com|fonts.gstatic.com|googleusercontent.com|transparenttextures.com" frontend-vue
```

این دستور را قبل از تحویل نهایی سیستم آفلاین اجرا کنید.

