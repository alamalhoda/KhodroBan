# 🔄 استراتژی مدیریت کنترل ورژن

این سند استراتژی مدیریت کنترل ورژن (Version Control Strategy) پروژه KhodroBan (خودروبان) را توضیح می‌دهد.

---

## 📋 خلاصه

پروژه KhodroBan (خودروبان) از **Monorepo** (یک Repository مشترک) برای مدیریت کنترل ورژن استفاده می‌کند. تمام بخش‌های پروژه (Backend، Frontend، و Docs) در یک Git repository قرار دارند.

**نکات کلیدی**:

- هر پروژه می‌تواند `.gitignore` خودش را داشته باشد
- هر پروژه می‌تواند قوانین Cursor (`.cursor/rules/`) خودش را داشته باشد
- قوانین به صورت سلسله‌مراتبی اعمال می‌شوند (root → پروژه خاص)

---

## 🎯 چرا Monorepo را انتخاب کردیم؟

### ✅ مزایای کلیدی

#### 1. **هماهنگی تغییرات API و Frontend**

وقتی API در Backend تغییر می‌کند، تغییرات مربوطه در Frontend می‌تواند در یک commit انجام شود:

```bash
# مثال: یک commit شامل تغییرات backend و frontend
git commit -m "feat: اضافه کردن endpoint جدید برای ثبت خودرو

- Backend: اضافه کردن API endpoint POST /api/cars/
- Frontend: اضافه کردن فرم ثبت خودرو
- Docs: به‌روزرسانی مستندات API"
```

این روش باعث می‌شود:

- تغییرات مرتبط با هم commit شوند
- تاریخچه پروژه واضح‌تر باشد
- Refactoring آسان‌تر باشد

#### 2. **مستندات در کنار کد**

مستندات پروژه (`docs/`) در کنار کد قرار دارد و تغییرات مستندات و کد همزمان commit می‌شوند:

```
KhodroBan/
├── docs/
│   └── technical/
│       └── api/          # مستندات API در کنار کد backend
├── backend/              # کد Backend
└── frontend/             # کد Frontend
```

#### 3. **CI/CD ساده‌تر**

یک workflow برای کل پروژه:

```yaml
# .github/workflows/ci.yml
- تست Backend
- تست Frontend
- Build هر دو پروژه
- Deploy هماهنگ
```

#### 4. **مدیریت آسان‌تر برای تیم کوچک**

برای پروژه MVP و تیم کوچک، Monorepo مدیریت ساده‌تری دارد:

- یک repository برای clone کردن
- یک branch strategy
- یک تاریخچه Git

#### 5. **انعطاف‌پذیری برای آینده**

اگر در آینده نیاز به جدا کردن پروژه‌ها باشد، می‌توان از **Git Submodules** استفاده کرد (بخش بعدی را ببینید).

---

## 🗂️ ساختار Repository

```
KhodroBan/                    # Root Git Repository
├── .git/                      # Git repository اصلی
├── .gitignore                 # Gitignore اصلی (عمومی)
├── .cursor/                   # قوانین Cursor عمومی (اختیاری)
│   └── rules/
├── README.md                  # README اصلی پروژه
│
├── 📂 docs/                   # مستندات پروژه
│   └── ...
│
├── 📂 backend/                # پروژه Backend
│   ├── .gitignore            # ⚠️ Gitignore خاص Backend
│   ├── .cursor/              # ⚠️ قوانین Cursor خاص Backend
│   │   └── rules/
│   ├── src/
│   ├── tests/
│   └── README.md
│
├── 📂 frontend/               # پروژه Frontend
│   ├── .gitignore            # ⚠️ Gitignore خاص Frontend
│   ├── .cursor/              # ⚠️ قوانین Cursor خاص Frontend
│   │   └── rules/
│   ├── src/
│   ├── public/
│   └── README.md
│
└── 📂 scripts/                # اسکریپت‌های کمکی
    └── ...
```

---

## ⚠️ Gitignore های جداگانه

**نکته مهم**: هر پروژه می‌تواند (و باید) `.gitignore` خودش را داشته باشد!

### چرا؟

هر پروژه وابستگی‌ها و فایل‌های تولید شده متفاوتی دارد:

#### Backend (Python/Django)

```gitignore
# backend/.gitignore
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
venv/
env/
*.db
*.sqlite3
.DS_Store
```

#### Frontend (Node.js/Svelte)

```gitignore
# frontend/.gitignore
node_modules/
dist/
build/
.DS_Store
*.log
.env.local
.env.*.local
```

### نحوه کار

Git به صورت سلسله‌مراتبی `.gitignore` ها را بررسی می‌کند:

1. ابتدا `.gitignore` اصلی (در root) بررسی می‌شود
2. سپس `.gitignore` در هر پوشه بررسی می‌شود
3. قوانین خاص‌تر (در پوشه‌های عمیق‌تر) اولویت دارند

**مثال**:

```
KhodroBan/
├── .gitignore              # قوانین عمومی
├── backend/
│   └── .gitignore         # قوانین خاص Python
└── frontend/
    └── .gitignore         # قوانین خاص Node.js
```

### توصیه

- **Root `.gitignore`**: فایل‌های مشترک (مثل `.DS_Store`, `*.log`)
- **Backend `.gitignore`**: فایل‌های خاص Python (`__pycache__/`, `venv/`)
- **Frontend `.gitignore`**: فایل‌های خاص Node.js (`node_modules/`, `dist/`)

---

## 🤖 Cursor Rules در Monorepo

**بله! شما می‌توانید برای هر پروژه قوانین Cursor جداگانه داشته باشید.**

### نحوه کار

Cursor از سیستم **Project Rules** استفاده می‌کند که امکان تعریف قوانین جداگانه برای هر بخش از Monorepo را فراهم می‌کند.

### ساختار پیشنهادی

```
KhodroBan/                           # Root workspace
├── .cursor/                          # قوانین عمومی (اختیاری)
│   └── rules/
│       └── general.mdc              # قوانین عمومی برای کل پروژه
│
├── backend/
│   └── .cursor/                     # ⚠️ قوانین خاص Backend
│       └── rules/
│           ├── django.mdc          # قوانین Django/Python
│           └── api.mdc             # قوانین API development
│
├── frontend/
│   └── .cursor/                     # ⚠️ قوانین خاص Frontend
│       └── rules/
│           ├── svelte.mdc          # قوانین Svelte
│           ├── ui-ux.mdc           # قوانین UI/UX
│           └── performance.mdc     # قوانین Performance
│
└── docs/
    └── .cursor/                     # قوانین خاص مستندات (اختیاری)
        └── rules/
            └── documentation.mdc
```

### فرمت فایل‌های قوانین

هر فایل قوانین با پسوند `.mdc` شامل:

1. **YAML Frontmatter**: metadata شامل:

   - `description`: توضیح کوتاه درباره قوانین
   - `globs`: الگوهای فایل‌ها (مثل `backend/**/*.py` یا `frontend/src/**/*.svelte`)
   - `alwaysApply`: آیا همیشه اعمال شود یا فقط برای فایل‌های matching
2. **Markdown Content**: محتوای قوانین

### مثال: قوانین Backend

```markdown
---
description: Django backend development guidelines
globs: 
  - backend/**/*.py
  - backend/**/*.md
alwaysApply: false
---

# Django Backend Guidelines

## Code Style
- Follow PEP 8 conventions
- Use type hints for all functions
- Write docstrings for all classes and functions

## Django Specific
- Use Django REST Framework for API endpoints
- Follow Django's naming conventions
- Use migrations for all database changes

## Testing
- Write unit tests for all views and models
- Use pytest for testing
- Maintain at least 80% code coverage
```

### مثال: قوانین Frontend

```markdown
---
description: Svelte frontend development guidelines
globs:
  - frontend/src/**/*.svelte
  - frontend/src/**/*.ts
  - frontend/src/**/*.js
alwaysApply: false
---

# Svelte Frontend Guidelines

## Component Structure
- Use Svelte 5 syntax with runes
- Keep components small and focused (max 200 lines)
- Use TypeScript for type safety

## Styling
- Use Tailwind CSS for styling
- Follow mobile-first responsive design
- Ensure accessibility (WCAG 2.1 AA compliance)

## State Management
- Use Svelte stores for global state
- Keep local state in components when possible
- Avoid prop drilling beyond 2 levels
```

### قوانین عمومی (Root)

می‌توانید قوانین عمومی برای کل workspace در root تعریف کنید:

```markdown
---
description: General project guidelines
globs:
  - "**/*"
alwaysApply: true
---

# KhodroBan (خودروبان) General Guidelines

## Git Workflow
- Use conventional commit messages
- Create feature branches from develop
- Keep commits focused and atomic

## Code Quality
- Write self-documenting code
- Add comments for complex logic only
- Follow SOLID principles
```

### نحوه اعمال قوانین

Cursor به صورت خودکار:

1. قوانین root (`.cursor/rules/`) را برای همه فایل‌ها اعمال می‌کند
2. قوانین خاص هر پروژه را برای فایل‌های matching آن پروژه اعمال می‌کند
3. قوانین `alwaysApply: true` همیشه اعمال می‌شوند

### Best Practices

1. **قوانین را Focused نگه دارید**: هر فایل قوانین باید به یک موضوع خاص بپردازد
2. **از Glob Patterns استفاده کنید**: قوانین را دقیقاً به فایل‌های مرتبط محدود کنید
3. **Version Control**: فایل‌های `.cursor/rules/` را در Git commit کنید تا تیم همه قوانین را داشته باشد
4. **تست کنید**: بعد از اضافه کردن قوانین جدید، مطمئن شوید که به درستی اعمال می‌شوند

### نکات مهم

- ⚠️ فایل `.cursorrules` (legacy) هنوز پشتیبانی می‌شود اما deprecated است
- ✅ استفاده از `.cursor/rules/*.mdc` روش توصیه شده است
- 🔍 Cursor به صورت خودکار قوانین را بر اساس فایل فعلی که باز است، اعمال می‌کند
- 📝 می‌توانید در هر سطح از سلسله‌مراتب پروژه قوانین تعریف کنید

---

## 🔀 Git Submodules (برای آینده)

اگر در آینده نیاز به جدا کردن پروژه‌ها باشد، می‌توان از **Git Submodules** استفاده کرد.

### Git Submodules چیست؟

Git Submodules امکان قرار دادن یک Git repository داخل repository دیگر را فراهم می‌کند. این روش برای زمانی مناسب است که:

- پروژه‌ها بخواهند مستقل deploy شوند
- تیم‌های مختلف روی هر پروژه کار کنند
- دسترسی‌های جداگانه لازم باشد

### ساختار با Submodules (مثال)

```
KhodroBan/                    # Main Repository
├── .git/
├── .gitmodules               # فایل تنظیمات submodules
├── docs/                     # مستندات (در main repo)
├── backend/                  # ⚠️ Submodule
│   └── .git/                # Git repository جداگانه
└── frontend/                 # ⚠️ Submodule
    └── .git/                # Git repository جداگانه
```

### مزایای Submodules

- استقلال: هر پروژه repository جداگانه دارد
- انعطاف‌پذیری: می‌توان نسخه خاصی از هر submodule را استفاده کرد
- دسترسی: دسترسی‌های جداگانه به هر repository

### معایب Submodules

- پیچیدگی بیشتر: کار با submodules سخت‌تر است
- هماهنگی کمتر: تغییرات باید در چند repository commit شوند
- نیاز به دستورات خاص: `git submodule update`, `git submodule add`

### ⚠️ توصیه فعلی

**فعلاً از Submodules استفاده نکنید!**

برای MVP و فاز اول، Monorepo ساده کافی است. اگر در آینده نیاز به جدا کردن بود، می‌توانید با ابزارهای Git repository را split کنید.

---

## 📝 Best Practices

### 1. Commit Messages

از commit message های واضح استفاده کنید و پروژه مربوطه را مشخص کنید:

```bash
# خوب ✅
git commit -m "feat(backend): اضافه کردن endpoint ثبت خودرو"
git commit -m "fix(frontend): رفع باگ نمایش تاریخ سرویس"
git commit -m "docs: به‌روزرسانی مستندات API"

# بد ❌
git commit -m "تغییرات"
git commit -m "fix"
```

### 2. Branch Strategy

از یک branch strategy مشترک استفاده کنید:

```bash
main              # branch اصلی (production-ready)
develop           # branch توسعه (integrated features)
feature/*         # feature branches (مثال: feature/user-auth)
bugfix/*          # bug fix branches
hotfix/*          # urgent fixes
```

برای راهنمای کامل مدیریت برنچ‌ها در Monorepo، به بخش [مدیریت برنچ‌ها در Monorepo](#-مدیریت-برنچ‌ها-در-monorepo) مراجعه کنید.

### 3. Pull Requests

برای راهنمای کامل استفاده از Pull Request، به [راهنمای Pull Request](../tutorials/pull-request-guide.md) مراجعه کنید.

**خلاصه**:

- از branch های جداگانه برای هر feature استفاده کنید
- PR description را کامل و واضح بنویسید
- از template PR استفاده کنید (`.github/PULL_REQUEST_TEMPLATE.md`)
- قبل از merge، PR را review کنید

وقتی PR ایجاد می‌کنید، مشخص کنید کدام بخش‌ها تغییر کرده‌اند:

```markdown
## تغییرات
- [ ] Backend
- [ ] Frontend
- [ ] Docs
- [ ] Tests

## توضیحات
...
```

### 4. Gitignore ها

- همیشه `.gitignore` مناسب برای هر پروژه داشته باشید
- فایل‌های حساس (مثل `.env`) را ignore کنید
- dependency directories (مثل `node_modules/`, `venv/`) را ignore کنید

### 5. Cursor Rules

- قوانین Cursor را برای هر پروژه جداگانه تعریف کنید (`.cursor/rules/`)
- از Glob patterns برای محدود کردن قوانین به فایل‌های مرتبط استفاده کنید
- قوانین را در Git commit کنید تا تیم همه قوانین را داشته باشد
- قوانین عمومی را در root workspace قرار دهید

---

## 🌿 مدیریت برنچ‌ها در Monorepo

این بخش راهنمای عملی برای مدیریت بهینه برنچ‌ها در یک Monorepo است.

### 🎯 اصل کلیدی: Feature-Based Branching

**قانون طلایی**: 
- ✅ **یک Feature = یک برنچ** (حتی اگر هم Frontend و هم Backend را تغییر دهد)
- ✅ **چند Commit با Scope مشخص** در یک برنچ (هر بخش یک commit جداگانه)
- ❌ **نه** یک برنچ برای هر بخش (مثل `develop/frontend` و `develop/backend`)

**مثال درست:**
```bash
feature/user-authentication/          # یک برنچ
├── commit 1: feat(frontend): ...    # Commit با scope frontend
├── commit 2: feat(backend): ...      # Commit با scope backend
└── commit 3: docs: ...               # Commit برای مستندات
```

**مثال نادرست:**
```bash
develop/frontend/                     # ❌ برنچ جداگانه برای Frontend
develop/backend/                      # ❌ برنچ جداگانه برای Backend
```

### 📊 ساختار پیشنهادی برای Monorepo

برای یک Monorepo با چند بخش (مثل Frontend و Backend)، **توصیه می‌شود** از ساختار زیر استفاده کنید:

```bash
main                    # Production-ready code
├── develop             # Integration branch (همه تغییرات اینجا merge می‌شوند)
│   ├── feature/*      # Feature branches (از develop منشعب می‌شوند)
│   ├── bugfix/*       # Bug fix branches
│   └── hotfix/*       # Urgent fixes
```

**⚠️ مهم**: در Monorepo، **نباید** از ساختار `develop/frontend` و `develop/backend` استفاده کنید!

### ❌ چرا `develop/frontend` و `develop/backend` مناسب نیست؟

ساختار پیشنهادی شما:
```bash
main
├── develop
│   ├── develop/frontend
│   └── develop/backend
```

**مشکلات این ساختار:**

1. **پیچیدگی Merge**: وقتی یک feature هم Frontend و هم Backend را تغییر می‌دهد، باید در دو برنچ جداگانه merge شود
2. **هماهنگی مشکل**: تغییرات مرتبط با هم در برنچ‌های جداگانه قرار می‌گیرند
3. **Conflict Management**: مدیریت conflict بین برنچ‌ها پیچیده می‌شود
4. **CI/CD پیچیده**: باید برای هر برنچ جداگانه CI/CD تنظیم شود
5. **تاریخچه Git پیچیده**: تاریخچه Git نامرتب و پیچیده می‌شود

### ✅ ساختار پیشنهادی (بهترین روش)

```bash
main                    # Production-ready
│
develop                 # Integration branch (تک برنچ برای همه تغییرات)
│
├── feature/user-auth  # Feature: هم Frontend و هم Backend
├── feature/dashboard  # Feature: فقط Frontend
├── feature/api-cars   # Feature: فقط Backend
├── bugfix/login-error # Bug fix
└── hotfix/security    # Urgent fix
```

**مزایا:**

- ✅ **هماهنگی**: تغییرات مرتبط در یک برنچ
- ✅ **سادگی**: یک برنچ develop برای همه
- ✅ **CI/CD ساده**: یک workflow برای کل پروژه
- ✅ **تاریخچه واضح**: تاریخچه Git ساده و قابل فهم

### 🎯 استراتژی پیشنهادی: Feature-Based Branching

**اصل کلیدی**: هر **feature** یک برنچ جداگانه دارد، نه هر بخش از پروژه!

#### مثال عملی:

```bash
# ✅ خوب: یک feature که هم Frontend و هم Backend را تغییر می‌دهد
feature/user-authentication
  ├── frontend-vue/src/auth/     # تغییرات Frontend
  ├── backend/src/auth/          # تغییرات Backend
  └── docs/technical/auth.md     # مستندات

# ✅ خوب: یک feature فقط Frontend
feature/dashboard-ui
  └── frontend-vue/src/dashboard/

# ✅ خوب: یک feature فقط Backend
feature/api-vehicles
  └── backend/src/api/vehicles/
```

### 📝 قوانین نام‌گذاری برنچ‌ها

```bash
# Feature branches
feature/user-authentication      # ✅ خوب: کوتاه و واضح
feature/add-telegram-bot        # ✅ خوب
feature/frontend-dashboard      # ⚠️ قابل قبول اما بهتر است فقط feature/dashboard

# Bug fix branches
bugfix/login-error              # ✅ خوب
bugfix/api-timeout              # ✅ خوب

# Hotfix branches
hotfix/security-patch           # ✅ خوب
hotfix/critical-bug             # ✅ خوب

# ❌ بد: از نام‌های مبهم پرهیز کنید
feature/changes                 # ❌ خیلی کلی
fix/bug                        # ❌ نامشخص
test                           # ❌ نامشخص
```

### 🔄 Workflow پیشنهادی

#### 1. ایجاد برنچ develop (اگر وجود ندارد)

```bash
# از main یک برنچ develop ایجاد کنید
git checkout main
git pull origin main
git checkout -b develop
git push -u origin develop
```

#### 2. کار روی یک Feature

```bash
# 1. از develop برنچ جدید ایجاد کنید
git checkout develop
git pull origin develop
git checkout -b feature/user-authentication

# 2. تغییرات را انجام دهید (Frontend، Backend، Docs)
# ...

# 3. Commit کنید (با scope مشخص)
git add frontend-vue/
git commit -m "feat(frontend): اضافه کردن صفحه لاگین"

git add backend/
git commit -m "feat(backend): اضافه کردن API احراز هویت"

git add docs/
git commit -m "docs: به‌روزرسانی مستندات احراز هویت"

# 4. Push کنید
git push -u origin feature/user-authentication

# 5. Pull Request به develop ایجاد کنید
```

#### 3. Merge به develop

```bash
# بعد از approve شدن PR:
# 1. PR را merge کنید (از GitHub/GitLab)
# 2. برنچ محلی را پاک کنید
git checkout develop
git pull origin develop
git branch -d feature/user-authentication
```

#### 4. Deploy به Production

```bash
# وقتی develop آماده شد:
git checkout main
git pull origin main
git merge develop
git push origin main

# یا از GitHub/GitLab Release ایجاد کنید
```

---

## 📖 راهنمای گام‌به‌گام: کار با Feature Branches

این بخش راهنمای عملی و کامل برای کار با feature branches در Monorepo است.

### 1️⃣ ایجاد Feature Branch جدید

#### گام 1: همگام‌سازی با develop

همیشه قبل از ایجاد feature branch جدید، مطمئن شوید که برنچ `develop` به‌روز است:

```bash
# به برنچ develop بروید
git checkout develop

# آخرین تغییرات را از remote دریافت کنید
git pull origin develop

# بررسی کنید که همه چیز به‌روز است
git status
```

**نکته مهم**: همیشه از `develop` برای ایجاد feature branches استفاده کنید، نه از `main`!

#### گام 2: ایجاد برنچ جدید

```bash
# ایجاد و switch به برنچ جدید
git checkout -b feature/user-authentication

# یا به صورت جداگانه:
git branch feature/user-authentication  # ایجاد برنچ
git checkout feature/user-authentication  # switch به برنچ
```

**قوانین نام‌گذاری:**
- ✅ `feature/user-authentication` - خوب
- ✅ `feature/add-telegram-bot` - خوب
- ✅ `bugfix/login-error` - خوب
- ❌ `feature/changes` - خیلی کلی
- ❌ `fix` - نامشخص

#### گام 3: بررسی وضعیت

```bash
# بررسی کنید که روی برنچ درست هستید
git branch

# باید خروجی شبیه این باشد:
# * feature/user-authentication
#   develop
#   main
```

### 2️⃣ کار روی Feature

#### گام 1: انجام تغییرات

تغییرات خود را انجام دهید. به یاد داشته باشید:
- یک Feature = یک برنچ (حتی اگر هم Frontend و هم Backend را تغییر دهد)
- Commit‌ها را با scope مشخص کنید

#### گام 2: Stage کردن تغییرات

```bash
# Stage کردن تغییرات یک بخش (توصیه می‌شود)
git add frontend-vue/src/auth/

# یا همه تغییرات
git add .

# بررسی تغییرات staged شده
git status
```

#### گام 3: Commit کردن با Scope مشخص

**مثال: Feature که هم Frontend و هم Backend را تغییر می‌دهد**

```bash
# Commit 1: تغییرات Frontend
git add frontend-vue/src/auth/
git commit -m "feat(frontend): اضافه کردن صفحه لاگین

- اضافه کردن کامپوننت LoginForm
- اضافه کردن صفحه /login
- اضافه کردن validation فرم"

# Commit 2: تغییرات Backend
git add backend/django/khodroban/views.py
git add backend/django/khodroban/serializers.py
git commit -m "feat(backend): اضافه کردن API احراز هویت

- اضافه کردن endpoint POST /api/auth/login
- اضافه کردن serializer برای login
- اضافه کردن JWT token generation"

# Commit 3: تست‌ها
git add frontend-vue/tests/auth.test.js
git add backend/django/khodroban/tests/test_auth.py
git commit -m "test: اضافه کردن تست‌های احراز هویت

- تست‌های unit برای کامپوننت LoginForm
- تست‌های integration برای API login"

# Commit 4: مستندات
git add docs/technical/api/auth.md
git commit -m "docs: به‌روزرسانی مستندات API احراز هویت"
```

**چرا چند Commit؟**

- ✅ **تاریخچه واضح**: می‌توانید ببینید چه بخشی در چه زمانی تغییر کرده
- ✅ **Review آسان‌تر**: Reviewer می‌تواند هر commit را جداگانه بررسی کند
- ✅ **Rollback راحت‌تر**: می‌توانید یک commit خاص را revert کنید
- ✅ **Blame دقیق‌تر**: `git blame` دقیق‌تر عمل می‌کند

#### گام 4: Push کردن به Remote

**اولین بار (با `-u` برای tracking):**

```bash
git push -u origin feature/user-authentication
```

**دفعات بعدی (بدون `-u`):**

```bash
git push
```

**اگر conflict داشتید:**

```bash
# ابتدا از develop pull کنید
git checkout develop
git pull origin develop

# به برنچ خود برگردید
git checkout feature/user-authentication

# تغییرات develop را merge کنید
git merge develop

# یا rebase کنید (اگر ترجیح می‌دهید)
git rebase develop

# بعد از حل conflict، push کنید
git push
```

#### گام 5: ایجاد Pull Request

**از GitHub:**

1. به repository بروید
2. روی "Compare & pull request" کلیک کنید
3. Base branch را `develop` انتخاب کنید
4. Compare branch را `feature/user-authentication` انتخاب کنید
5. Title و Description را پر کنید:

```markdown
## 📝 توضیحات
اضافه کردن سیستم احراز هویت کامل شامل Frontend و Backend

## 🎯 هدف
اجازه دادن به کاربران برای ورود به سیستم و استفاده از قابلیت‌های اپلیکیشن

## 🔄 تغییرات
- [x] Backend
- [x] Frontend
- [x] Tests
- [x] Docs

### جزئیات تغییرات

**Backend:**
- اضافه کردن endpoint POST /api/auth/login
- اضافه کردن JWT token generation
- اضافه کردن serializer برای login

**Frontend:**
- اضافه کردن کامپوننت LoginForm
- اضافه کردن صفحه /login
- اضافه کردن validation فرم

**Tests:**
- تست‌های unit برای کامپوننت LoginForm
- تست‌های integration برای API login

## ✅ تست‌ها
- [x] تست واحد (Unit Tests)
- [x] تست integration
- [x] تست دستی (Manual Testing)
- [x] تست در محیط development

## 🔗 Issues مرتبط
Closes #123
```

**از Command Line (با GitHub CLI):**

```bash
# اگر gh CLI نصب دارید
gh pr create --base develop --head feature/user-authentication --title "feat: اضافه کردن سیستم احراز هویت" --body "توضیحات PR"
```

**نکات مهم برای PR:**

- ✅ Base branch همیشه `develop` باشد
- ✅ Title واضح و توصیفی باشد
- ✅ Description کامل باشد (از template استفاده کنید)
- ✅ بخش‌های تغییر کرده را مشخص کنید
- ✅ Screenshots اضافه کنید (اگر UI تغییر کرده)
- ✅ Issues مرتبط را link کنید

### 3️⃣ مدیریت برنچ‌ها (با Git Commands)

#### مشاهده وضعیت برنچ‌ها

```bash
# لیست برنچ‌های محلی
git branch

# لیست همه برنچ‌ها (محلی + remote)
git branch -a

# لیست برنچ‌های merge شده با develop
git branch --merged develop

# لیست برنچ‌های merge نشده با develop
git branch --no-merged develop

# مشاهده آخرین commit هر برنچ
git branch -v

# مشاهده تاریخچه به صورت گرافیکی
git log --oneline --graph --all --decorate -15
```

#### همگام‌سازی با Remote

```bash
# دریافت همه برنچ‌های remote
git fetch --all

# حذف برنچ‌های remote که دیگر وجود ندارند
git fetch --prune

# همگام‌سازی develop با remote
git checkout develop
git pull origin develop

# همگام‌سازی main با remote
git checkout main
git pull origin main
```

#### پاکسازی برنچ‌های Merge شده

**پاک کردن برنچ محلی:**

```bash
# پاک کردن برنچ merge شده (safe)
git branch -d feature/user-authentication

# پاک کردن برنچ بدون توجه به merge status (force)
git branch -D feature/user-authentication
```

**پاک کردن برنچ‌های متعدد:**

```bash
# پاک کردن همه برنچ‌های merge شده با develop (به جز main و develop)
git branch --merged develop | grep -v "\*\|main\|develop" | xargs -n 1 git branch -d
```

**پاک کردن برنچ Remote:**

```bash
# حذف برنچ از remote
git push origin --delete feature/user-authentication

# یا
git push origin :feature/user-authentication
```

#### به‌روزرسانی Feature Branch از develop

اگر در حین کار روی feature، تغییرات جدیدی به `develop` اضافه شد:

```bash
# روش 1: Merge (توصیه می‌شود)
git checkout feature/user-authentication
git fetch origin
git merge origin/develop

# حل conflict (در صورت وجود)
# ... حل conflict ...
git add .
git commit -m "merge: همگام‌سازی با develop"

# روش 2: Rebase (برای تاریخچه تمیزتر)
git checkout feature/user-authentication
git fetch origin
git rebase origin/develop

# حل conflict (در صورت وجود)
# ... حل conflict ...
git add .
git rebase --continue

# بعد از rebase، باید force push کنید
git push --force-with-lease origin feature/user-authentication
```

**⚠️ نکته مهم**: از `--force-with-lease` به جای `--force` استفاده کنید تا از overwrite کردن تغییرات دیگران جلوگیری شود.

#### مشاهده تفاوت‌ها

```bash
# تفاوت بین برنچ فعلی و develop
git diff develop

# تفاوت بین دو برنچ
git diff develop..feature/user-authentication

# فایل‌های تغییر کرده
git diff --name-only develop..feature/user-authentication

# خلاصه تغییرات (stat)
git diff --stat develop..feature/user-authentication
```

#### تغییر نام برنچ

```bash
# تغییر نام برنچ محلی
git branch -m feature/old-name feature/new-name

# تغییر نام برنچ remote
git push origin :feature/old-name feature/new-name
git push origin -u feature/new-name
```

### 🔒 Git Hooks برای جلوگیری از خطاها

برای جلوگیری از ایجاد feature branches از `main` به صورت تصادفی، می‌توانید از Git hooks استفاده کنید.

#### نصب Git Hook

یک hook به نام `pre-checkout` در `.git/hooks/` ایجاد کنید:

```bash
# ایجاد فایل hook
touch .git/hooks/pre-checkout
chmod +x .git/hooks/pre-checkout
```

**محتوای Hook:**

```bash
#!/bin/bash
# .git/hooks/pre-checkout
# Git Hook برای جلوگیری از ایجاد feature branches از main

# اگر در حال checkout کردن یک برنچ جدید هستیم
if [[ "$3" == "1" ]]; then
    CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "")
    TARGET_BRANCH="$2"
    
    # بررسی اینکه آیا از main در حال ایجاد برنچ جدید هستیم
    if [[ "$CURRENT_BRANCH" == "main" ]] && [[ -n "$TARGET_BRANCH" ]]; then
        # بررسی اینکه آیا برنچ جدید feature/bugfix است (نه hotfix)
        if [[ "$TARGET_BRANCH" =~ ^(feature|bugfix)/ ]] && [[ "$TARGET_BRANCH" != "hotfix/"* ]]; then
            echo ""
            echo "================================================"
            echo "⚠️  هشدار: در حال ایجاد برنچ جدید از main هستید!"
            echo "================================================"
            echo ""
            echo "🔧 در Git Flow استاندارد، باید:"
            echo "   1. از develop برای features/bugfixes استفاده کنید"
            echo "   2. فقط برای hotfix از main استفاده کنید"
            echo ""
            echo "📋 برنچ هدف: $TARGET_BRANCH"
            echo ""
            read -p "آیا مطمئن هستید که می‌خواهید ادامه دهید؟ (y/N): " -n 1 -r
            echo ""
            
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                echo ""
                echo "❌ ایجاد برنچ لغو شد."
                echo ""
                echo "💡 دستورات پیشنهادی:"
                echo "   git checkout develop"
                echo "   git pull origin develop"
                echo "   git checkout -b $TARGET_BRANCH"
                echo ""
                exit 1
            fi
        fi
    fi
fi

exit 0
```

**نکات مهم:**

- ⚠️ Git hooks در `.git/hooks/` به صورت پیش‌فرض در Git commit نمی‌شوند
- ✅ می‌توانید hook را در یک پوشه جداگانه نگه دارید و به تیم share کنید
- ✅ Hook فقط هشدار می‌دهد و می‌توانید با `y` ادامه دهید (برای موارد خاص)
- ✅ Hook فقط برای `feature/` و `bugfix/` فعال است، `hotfix/` از main مجاز است

**نصب Hook برای تیم:**

اگر می‌خواهید hook را با تیم share کنید:

```bash
# ایجاد پوشه برای hooks
mkdir -p scripts/git-hooks

# کپی hook
cp .git/hooks/pre-checkout scripts/git-hooks/pre-checkout

# اضافه کردن به Git
git add scripts/git-hooks/pre-checkout
git commit -m "chore: اضافه کردن Git hook برای جلوگیری از ایجاد feature branches از main"
```

**نصب Hook توسط سایر اعضای تیم:**

```bash
# کپی hook به .git/hooks/
cp scripts/git-hooks/pre-checkout .git/hooks/pre-checkout
chmod +x .git/hooks/pre-checkout
```

### ⚠️ نکات مهم

#### 1. همیشه از develop برای ایجاد feature branches استفاده کنید

```bash
# ✅ درست
git checkout develop
git pull origin develop
git checkout -b feature/new-feature

# ❌ اشتباه
git checkout main
git checkout -b feature/new-feature
```

#### 2. یک Feature = یک برنچ

حتی اگر یک feature هم Frontend و هم Backend را تغییر دهد، همه تغییرات در یک برنچ و یک PR قرار می‌گیرند:

```bash
# ✅ درست: یک برنچ برای feature کامل
feature/user-authentication/
├── commit 1: feat(frontend): ...
├── commit 2: feat(backend): ...
└── commit 3: docs: ...

# ❌ اشتباه: دو برنچ جداگانه
feature/frontend-auth/
feature/backend-auth/
```

#### 3. Commit‌ها را با Scope مشخص کنید

```bash
# ✅ خوب
git commit -m "feat(frontend): اضافه کردن صفحه لاگین"
git commit -m "feat(backend): اضافه کردن API login"
git commit -m "docs: به‌روزرسانی مستندات"

# ❌ بد
git commit -m "تغییرات"
git commit -m "fix"
git commit -m "update"
```

**Scope‌های رایج:**
- `feat(frontend):` - ویژگی جدید در Frontend
- `feat(backend):` - ویژگی جدید در Backend
- `fix(frontend):` - رفع باگ در Frontend
- `fix(backend):` - رفع باگ در Backend
- `docs:` - تغییرات مستندات
- `test:` - تغییرات تست‌ها
- `refactor:` - بازنویسی کد
- `chore:` - کارهای جانبی (config، dependencies)

#### 4. بعد از merge PR، برنچ را حذف کنید

```bash
# بعد از merge PR در GitHub/GitLab:

# 1. به develop بروید و pull کنید
git checkout develop
git pull origin develop

# 2. برنچ محلی را حذف کنید
git branch -d feature/user-authentication

# 3. برنچ remote را حذف کنید (اگر خودکار حذف نشد)
git push origin --delete feature/user-authentication
```

#### 5. Commit‌های کوچک و متمرکز

```bash
# ✅ خوب: Commit‌های کوچک و متمرکز
git add frontend-vue/src/auth/LoginForm.vue
git commit -m "feat(frontend): اضافه کردن کامپوننت LoginForm"

git add frontend-vue/src/auth/LoginPage.vue
git commit -m "feat(frontend): اضافه کردن صفحه Login"

# ❌ بد: یک commit بزرگ با همه چیز
git add .
git commit -m "feat: اضافه کردن سیستم احراز هویت کامل"
```

#### 6. Pull قبل از Push

همیشه قبل از push، از remote pull کنید:

```bash
# ✅ خوب
git pull origin develop
git push

# ❌ ممکن است مشکل ایجاد کند
git push  # بدون pull
```

### 📋 Checklist کار با Feature Branch

#### قبل از شروع کار

- [ ] از `develop` pull کرده‌ام: `git checkout develop && git pull origin develop`
- [ ] برنچ جدید از `develop` ایجاد کرده‌ام
- [ ] نام برنچ واضح و توصیفی است

#### در حین کار

- [ ] Commit‌ها با scope مشخص هستند (`feat(frontend):`، `feat(backend):`)
- [ ] Commit‌ها کوچک و متمرکز هستند
- [ ] Commit messages واضح و توصیفی هستند

#### قبل از Push

- [ ] همه تغییرات commit شده‌اند: `git status`
- [ ] تست‌ها pass می‌شوند
- [ ] Linter errors ندارم

#### بعد از Push

- [ ] PR ایجاد کرده‌ام
- [ ] Base branch را `develop` انتخاب کرده‌ام
- [ ] PR description کامل است
- [ ] Reviewer‌ها را اضافه کرده‌ام

#### بعد از Merge

- [ ] PR merge شده است
- [ ] برنچ محلی را حذف کرده‌ام: `git branch -d feature/name`
- [ ] برنچ remote را حذف کرده‌ام (در صورت نیاز)

### 🛠️ دستورات مفید برای مدیریت برنچ‌ها

#### مشاهده وضعیت برنچ‌ها

```bash
# لیست برنچ‌های محلی
git branch

# لیست همه برنچ‌ها (محلی + remote)
git branch -a

# لیست برنچ‌های merge شده
git branch --merged

# لیست برنچ‌های merge نشده
git branch --no-merged

# مشاهده آخرین commit هر برنچ
git branch -v
```

#### پاکسازی برنچ‌های قدیمی

```bash
# پاک کردن برنچ‌های merge شده (محلی)
git branch --merged develop | grep -v "\*\|main\|develop" | xargs -n 1 git branch -d

# پاک کردن برنچ‌های remote که دیگر وجود ندارند
git remote prune origin

# حذف برنچ remote
git push origin --delete feature/old-feature
```

#### همگام‌سازی با Remote

```bash
# دریافت همه برنچ‌های remote
git fetch --all --prune

# همگام‌سازی develop با remote
git checkout develop
git pull origin develop

# همگام‌سازی main با remote
git checkout main
git pull origin main
```

### 📋 Checklist مدیریت برنچ‌ها

#### هفتگی (Weekly Cleanup)

- [ ] برنچ‌های merge شده را پاک کنید
- [ ] برنچ‌های remote قدیمی را حذف کنید
- [ ] develop را با main همگام کنید
- [ ] برنچ‌های feature قدیمی را بررسی کنید

#### قبل از ایجاد Feature جدید

- [ ] از develop pull کنید: `git checkout develop && git pull origin develop`
- [ ] برنچ جدید از develop ایجاد کنید
- [ ] نام برنچ واضح و توصیفی باشد

#### بعد از Merge PR

- [ ] برنچ محلی را پاک کنید: `git branch -d feature/name`
- [ ] برنچ remote را حذف کنید (از GitHub/GitLab)
- [ ] develop را pull کنید

### 🎨 سناریوهای خاص

#### سناریو 1: Feature فقط Frontend

```bash
git checkout develop
git pull origin develop
git checkout -b feature/dashboard-ui

# فقط تغییرات frontend-vue/
git add frontend-vue/
git commit -m "feat(frontend): اضافه کردن داشبورد"

git push -u origin feature/dashboard-ui
# PR به develop
```

#### سناریو 2: Feature فقط Backend

```bash
git checkout develop
git pull origin develop
git checkout -b feature/api-vehicles

# فقط تغییرات backend/
git add backend/
git commit -m "feat(backend): اضافه کردن API مدیریت خودروها"

git push -u origin feature/api-vehicles
# PR به develop
```

#### سناریو 3: Feature هم Frontend و هم Backend

**🎯 اصل مهم**: یک Feature = یک برنچ = یک PR، اما **چند Commit با Scope مشخص**

```bash
git checkout develop
git pull origin develop
git checkout -b feature/user-authentication

# ✅ خوب: Commit با Scope مشخص برای Frontend
git add frontend-vue/src/auth/
git commit -m "feat(frontend): اضافه کردن صفحه لاگین"

# ✅ خوب: Commit با Scope مشخص برای Backend
git add backend/src/auth/
git commit -m "feat(backend): اضافه کردن API احراز هویت"

# ✅ خوب: Commit برای مستندات
git add docs/technical/auth.md
git commit -m "docs: به‌روزرسانی مستندات احراز هویت"

# ✅ خوب: Commit برای تست‌ها
git add frontend-vue/tests/auth.test.js backend/tests/test_auth.py
git commit -m "test: اضافه کردن تست‌های احراز هویت"

git push -u origin feature/user-authentication
# یک PR به develop (شامل همه تغییرات: Frontend + Backend + Docs + Tests)
```

**چرا این روش بهتر است؟**

- ✅ **تاریخچه واضح**: می‌توانید ببینید چه بخشی در چه زمانی تغییر کرده
- ✅ **Review آسان‌تر**: Reviewer می‌تواند تغییرات هر بخش را جداگانه بررسی کند
- ✅ **Rollback راحت‌تر**: اگر نیاز به revert یک بخش باشد، می‌توانید commit خاص را revert کنید
- ✅ **Blame دقیق‌تر**: `git blame` می‌تواند دقیق‌تر نشان دهد چه کسی چه بخشی را تغییر داده

### ⚠️ نکات مهم

1. **یک Feature = یک برنچ = یک PR**: حتی اگر هم Frontend و هم Backend را تغییر می‌دهد
2. **Commit Messages با Scope**: از `feat(frontend):` و `feat(backend):` استفاده کنید
3. **چند Commit در یک برنچ**: در یک feature branch، می‌توانید چند commit با scope‌های مختلف داشته باشید
4. **برنچ‌های کوتاه عمر**: بعد از merge، برنچ را حذف کنید
5. **همگام‌سازی منظم**: develop را مرتباً با main همگام کنید
6. **Pull قبل از Push**: همیشه قبل از push، از remote pull کنید

### 📝 مثال عملی: Commit Strategy در یک Feature Branch

فرض کنید می‌خواهید یک feature کامل برای "مدیریت خودروها" پیاده‌سازی کنید:

```bash
# 1. ایجاد برنچ
git checkout develop
git pull origin develop
git checkout -b feature/vehicle-management

# 2. شروع با Backend (API)
git add backend/src/api/vehicles/
git commit -m "feat(backend): اضافه کردن API endpoints مدیریت خودروها"

# 3. اضافه کردن تست‌های Backend
git add backend/tests/test_vehicles.py
git commit -m "test(backend): اضافه کردن تست‌های API خودروها"

# 4. پیاده‌سازی Frontend
git add frontend-vue/src/views/vehicles/
git commit -m "feat(frontend): اضافه کردن صفحه مدیریت خودروها"

# 5. اضافه کردن کامپوننت‌های UI
git add frontend-vue/src/components/VehicleCard.vue
git commit -m "feat(frontend): اضافه کردن کامپوننت کارت خودرو"

# 6. اضافه کردن Store برای State Management
git add frontend-vue/src/stores/vehicles.js
git commit -m "feat(frontend): اضافه کردن store مدیریت خودروها"

# 7. به‌روزرسانی مستندات
git add docs/technical/api/vehicles.md
git commit -m "docs: به‌روزرسانی مستندات API خودروها"

# 8. Push و ایجاد PR
git push -u origin feature/vehicle-management
# یک PR شامل همه تغییرات بالا
```

**نکات مهم این مثال:**

- ✅ هر commit یک scope مشخص دارد (`frontend` یا `backend`)
- ✅ Commit‌ها منطقی و مرتب هستند (اول Backend، بعد Frontend)
- ✅ همه commit‌ها در یک برنچ هستند
- ✅ یک PR شامل همه تغییرات است
- ✅ تاریخچه Git واضح و قابل دنبال کردن است

### 🔗 منابع بیشتر

- [Git Branching Strategies](https://www.atlassian.com/git/tutorials/comparing-workflows)
- [Monorepo Best Practices](https://monorepo.tools/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## 🔧 دستورات مفید

### نگاه کلی به تغییرات

```bash
# تمام تغییرات در repository
git status

# تغییرات در یک پوشه خاص
git status backend/
git status frontend/
```

### Commit کردن تغییرات یک بخش

```bash
# فقط تغییرات backend را commit کنید
git add backend/
git commit -m "feat(backend): ..."

# یا همه تغییرات
git add .
git commit -m "feat: تغییرات هماهنگ backend و frontend"
```

### مشاهده تاریخچه

```bash
# تاریخچه کامل
git log

# تاریخچه یک پوشه خاص
git log -- backend/
git log -- frontend/
```

---

## 📚 منابع بیشتر

- [Git Documentation - Submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules)
- [Monorepo vs Polyrepo](https://www.atlassian.com/git/tutorials/monorepos)
- [Gitignore Patterns](https://git-scm.com/docs/gitignore)
- [Cursor Rules Documentation](https://docs.cursor.com/en/context/rules) - راهنمای کامل Project Rules

---

## 🔄 تغییر استراتژی در آینده

اگر در آینده تصمیم گرفتید از Submodules استفاده کنید:

1. مطالعه کنید: [Git Submodules Documentation](https://git-scm.com/book/en/v2/Git-Tools-Submodules)
2. برنامه‌ریزی کنید: کدام پروژه‌ها باید جدا شوند؟
3. تست کنید: در یک branch جداگانه آزمایش کنید
4. مستندات را به‌روزرسانی کنید: این فایل را به‌روز کنید

---

## 🚀 Deploy بخش‌های Monorepo

برای deploy کردن بخش‌های جداگانه (مثلاً Frontend به Replit یا Backend به Hugging Face) به [راهنمای Deploy Monorepo](./deployment-monorepo.md) مراجعه کنید.

---

**آخرین به‌روزرسانی**: این مستند بر اساس تصمیم اولیه پروژه نوشته شده است و در صورت تغییر استراتژی، به‌روزرسانی خواهد شد.
