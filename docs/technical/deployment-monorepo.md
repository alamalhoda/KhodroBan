# 🚀 Deploy بخش‌های Monorepo به سرورهای جداگانه

این سند راهنمای کامل برای deploy کردن بخش‌های جداگانه یک Monorepo (Backend یا Frontend) به سرورهای مختلف است.

---

## 📋 مشکل

در Monorepo، همه بخش‌ها (Backend، Frontend، Docs) در یک Git repository هستند. اما برای deploy، ممکن است بخواهید:
- **Frontend** را به Replit یا Vercel deploy کنید
- **Backend** را به Hugging Face Spaces یا Railway deploy کنید

---

## ✅ راه‌حل‌ها

### روش 1: Deploy مستقیم از Monorepo (توصیه می‌شود)

ساده‌ترین روش: فقط پوشه مورد نظر را deploy کنید.

#### برای Frontend (Replit, Vercel, Netlify)

```bash
# در Replit یا Vercel
# Root directory را روی frontend/ تنظیم کنید
```

**مزایا:**
- ✅ ساده و مستقیم
- ✅ نیاز به تغییر ساختار ندارد
- ✅ تغییرات در همان repository

**نحوه کار:**
1. در Replit/Vercel، root directory را `frontend/` تنظیم کنید
2. Platform به صورت خودکار فقط فایل‌های `frontend/` را استفاده می‌کند

---

### روش 2: Git Subtree (برای پروژه‌های پیچیده)

اگر نیاز به repository جداگانه دارید، می‌توانید از Git Subtree استفاده کنید.

#### ایجاد Subtree برای Frontend

```bash
# 1. ایجاد یک branch جدید برای subtree
git subtree push --prefix=frontend origin frontend-deploy

# 2. ایجاد repository جداگانه (مثلاً در GitHub)
# frontend-only-repo

# 3. Push subtree به repository جداگانه
git subtree push --prefix=frontend git@github.com:user/frontend-only-repo.git main
```

#### به‌روزرسانی بعد از تغییرات

```bash
# بعد از هر تغییر در frontend/
git subtree push --prefix=frontend git@github.com:user/frontend-only-repo.git main
```

**نکته:** این روش پیچیده است و فقط برای موارد خاص توصیه می‌شود.

---

### روش 3: GitHub Actions / CI/CD (بهترین برای Production)

استفاده از GitHub Actions برای deploy خودکار.

#### مثال: Deploy Frontend به Vercel

```yaml
# .github/workflows/deploy-frontend.yml
name: Deploy Frontend

on:
  push:
    branches: [main]
    paths:
      - 'frontend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./frontend
```

#### مثال: Deploy Backend به Hugging Face

```yaml
# .github/workflows/deploy-backend.yml
name: Deploy Backend

on:
  push:
    branches: [main]
    paths:
      - 'backend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Hugging Face
        uses: huggingface/huggingface_hub@main
        with:
          hf_token: ${{ secrets.HF_TOKEN }}
          hf_space: your-username/oilchenger-backend
          working-directory: ./backend
```

---

## 🔧 راهنمای عملی

### Deploy Frontend به Replit

#### روش 1: Direct Deploy (ساده)

1. **در Replit:**
   - Create new Repl
   - Import from GitHub
   - Repository: `your-username/KhodroBan (خودروبان)`
   - Root directory: `frontend/`

2. **تنظیمات:**
   ```json
   {
     "run": "cd frontend && npm install && npm run dev",
     "root": "frontend"
   }
   ```

### Deploy Frontend به Deno Deploy

#### راه‌اندازی Deno Deploy

Deno Deploy یک پلتفرم serverless است که از Deno runtime استفاده می‌کند و برای SvelteKit کاملاً مناسب است.

**مراحل تنظیم:**

1. **در Deno Deploy:**
   - به https://deno.com/deploy بروید
   - حساب خود را ایجاد کنید
   - یک پروژه جدید بسازید

2. **اتصال به GitHub:**
   - روی "Connect to Git" کلیک کنید
   - Repository خود را انتخاب کنید
   - Branch مورد نظر را انتخاب کنید (مثلاً `fix-deno-deploy`)

3. **تنظیمات Build:**
   - **Root Directory:** `frontend/`
   - **Entry Point:** `index.html` (یا خالی بگذارید)
   - **Build Command:** `deno task build`
   - **Serve Directory:** `build/`

4. **Environment Variables:**
   ```env
   DENO_REGION=true
   DENO_DEPLOY=true
   VITE_BACKEND_TYPE=supabase
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

**نکته مهم:** مطمئن شوید که فایل‌های `deno.jsonc` و `import_map.json` در پوشه `frontend/` وجود دارند.

#### فایل‌های مورد نیاز برای Deno Deploy

```json
// frontend/deno.jsonc
{
  "tasks": {
    "build": "deno run --allow-read --allow-write --allow-env --allow-net npm:vite@^5.4.0 build",
    "dev": "deno run --allow-read --allow-write --allow-env --allow-net npm:vite@^5.4.0 dev"
  },
  "importMap": "./import_map.json"
}
```

```json
// frontend/import_map.json
{
  "imports": {
    "svelte": "npm:svelte@^5.0.0",
    "svelte/": "npm:svelte@^5.0.0/",
    "@sveltejs/kit": "npm:@sveltejs/kit@^2.0.0",
    "vite": "npm:vite@^5.4.0",
    "@supabase/supabase-js": "npm:@supabase/supabase-js@^2.89.0"
    // ... سایر dependencies
  }
}
```

#### روش 2: با Git Subtree (برای repository جداگانه)

```bash
# در terminal محلی
git subtree push --prefix=frontend origin frontend-only

# در Replit: Import از branch frontend-only
```

---

### Deploy Backend به Hugging Face Spaces

#### روش 1: Direct Deploy

1. **در Hugging Face:**
   - Create new Space
   - Git Repository: `your-username/KhodroBan (خودروبان)`
   - Root directory: `backend/`

2. **تنظیمات `backend/README.md`:**
   ```markdown
   ---
   sdk: docker  # یا python
   app_port: 8000
   ---
   ```

#### روش 2: با GitHub Actions

```yaml
# .github/workflows/deploy-backend-hf.yml
name: Deploy Backend to HF

on:
  push:
    branches: [main]
    paths:
      - 'backend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.9'
      
      - name: Deploy to HF
        env:
          HF_TOKEN: ${{ secrets.HF_TOKEN }}
        run: |
          cd backend
          pip install huggingface_hub
          huggingface-cli upload your-username/oilchenger-backend ./ --repo-type=space
```

---

## 📝 Best Practices

### 1. استفاده از Environment Variables

برای هر deploy، environment variables جداگانه تعریف کنید:

**Frontend (.env.production):**
```env
VITE_API_URL=https://your-backend.hf.space
```

**Backend (.env.production):**
```env
DATABASE_URL=postgresql://...
SECRET_KEY=...
ALLOWED_HOSTS=your-backend.hf.space
```

### 2. Separate Deploy Scripts

ایجاد اسکریپت‌های جداگانه برای هر بخش:

**`scripts/deploy-frontend.sh`:**
```bash
#!/bin/bash
cd frontend
npm install
npm run build
# Deploy logic here
```

**`scripts/deploy-backend.sh`:**
```bash
#!/bin/bash
cd backend
pip install -r requirements.txt
python manage.py collectstatic --noinput
# Deploy logic here
```

### 3. استفاده از Path-based Triggers در CI/CD

فقط زمانی deploy کنید که فایل‌های مرتبط تغییر کرده‌اند:

```yaml
on:
  push:
    paths:
      - 'frontend/**'  # فقط تغییرات frontend
      - '.github/workflows/deploy-frontend.yml'
```

---

## 🔄 Workflow پیشنهادی

### برای Development

1. تغییرات در Monorepo
2. Commit و Push به GitHub
3. CI/CD به صورت خودکار deploy می‌کند

### برای Manual Deploy

```bash
# 1. تغییرات را commit کنید
git add .
git commit -m "feat: update frontend"

# 2. Push کنید
git push origin main

# 3. CI/CD به صورت خودکار deploy می‌کند
# یا دستی:
cd frontend
npm run build
# Deploy manually
```

---

## ⚠️ نکات مهم

### 1. Path Dependencies

اگر frontend به backend نیاز دارد (مثل API URL):

```javascript
// frontend/src/config.js
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
```

### 2. Shared Code

اگر کد مشترک دارید (مثل types، utils):

**گزینه 1:** Copy به هر پروژه (ساده اما duplicate)

**گزینه 2:** استفاده از monorepo tools (Lerna, Nx) - پیچیده

**گزینه 3:** Separate package (برای آینده)

### 3. Version Alignment

اطمینان حاصل کنید که frontend و backend با هم compatible هستند:

```json
// frontend/package.json
{
  "version": "1.0.0",
  "config": {
    "apiVersion": "1.0.0"
  }
}
```

---

## 📚 مثال‌های کامل

### مثال 1: Replit Frontend

**`frontend/.replit`:**
```toml
language = "nodejs"
run = "npm run dev"

[deploy]
deployTarget = "cloudrun"
deployFlags = ["--region", "us-central1"]
```

### مثال 2: Hugging Face Backend

**`backend/app.py` (برای HF Spaces):**
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # یا domain frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "KhodroBan (خودروبان) Backend API"}

# ... سایر endpoints
```

---

## 🎯 توصیه نهایی

برای پروژه شما (KhodroBan (خودروبان)):

1. **برای MVP:** از روش 1 (Direct Deploy) استفاده کنید
   - Frontend → Replit/Vercel با root directory: `frontend/`
   - Backend → Hugging Face/Railway با root directory: `backend/`

2. **برای Production:** از GitHub Actions استفاده کنید
   - Deploy خودکار بعد از push
   - Path-based triggers برای بهینه‌سازی

3. **از Git Subtree اجتناب کنید** مگر اینکه واقعاً repository جداگانه نیاز باشد

---

## 🔗 منابع بیشتر

- [Git Subtree Documentation](https://git-scm.com/book/en/v2/Git-Tools-Submodules)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Monorepo Guide](https://vercel.com/docs/concepts/monorepos)
- [Hugging Face Spaces Guide](https://huggingface.co/docs/hub/spaces)

---

**آخرین به‌روزرسانی**: این راهنما برای پروژه KhodroBan (خودروبان) و Monorepo structure نوشته شده است.
