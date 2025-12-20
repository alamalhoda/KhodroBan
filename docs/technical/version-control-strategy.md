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
