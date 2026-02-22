# 🔄 راهنمای کامل Git و کنترل ورژن

این سند مرجع آموزشی استراتژی Git، Monorepo و Git Flow پروژه KhodroBan است. برای قوانین اجرایی به [gitflow-branch-policy](../../.cursor/rules/share/gitflow-branch-policy.mdc) مراجعه کنید.

---

## 📋 فهرست

1. [استراتژی Monorepo](#۱-استراتژی-monorepo)
2. [Git Flow و انواع برنچ](#۲-git-flow-و-انواع-برنچ)
3. [کار با Feature Branch](#۳-کار-با-feature-branch)
4. [Release، Bugfix، Hotfix](#۴-release-bugfix-hotfix)
5. [دستورات مفید و چک‌لیست](#۵-دستورات-مفید-و-چکلیست)

---

## ۱. استراتژی Monorepo

### خلاصه

پروژه از **Monorepo** استفاده می‌کند. Backend، Frontend و Docs در یک Git repository قرار دارند.

- هر پروژه می‌تواند `.gitignore` و `.cursor/rules/` خودش را داشته باشد
- قوانین به صورت سلسله‌مراتبی اعمال می‌شوند

### چرا Monorepo؟

- **هماهنگی تغییرات**: API و Frontend در یک commit
- **مستندات در کنار کد**: تغییرات docs و کد همزمان
- **CI/CD ساده**: یک workflow برای کل پروژه
- **مدیریت آسان**: برای تیم کوچک و MVP

### اصل کلیدی: Feature-Based Branching

- ✅ **یک Feature = یک برنچ** (حتی اگر هم Frontend و هم Backend را تغییر دهد)
- ✅ **چند Commit با Scope مشخص** در یک برنچ
- ❌ نه یک برنچ برای هر بخش (مثل `develop/frontend`)

### ساختار برنچ‌ها

```bash
main                    # Production-ready
├── develop             # Integration branch
│   ├── feature/*      # Feature branches
│   ├── bugfix/*       # Bug fix branches
│   └── hotfix/*       # Urgent fixes
```

برای جزئیات Cursor Rules، Gitignore و Git Submodules به بخش «منابع بیشتر» در انتها مراجعه کنید.

---

## ۲. Git Flow و انواع برنچ

### ساختار برنچ‌ها

```
main                     # نسخه production (همیشه stable)
└── develop              # نسخه integration
    ├── feature/*       # توسعه قابلیت جدید
    ├── bugfix/*        # رفع باگ در محیط توسعه
    ├── release/*       # آماده‌سازی release
    └── hotfix/*        # رفع باگ فوری در production
```

### چرخه حیات برنچ‌ها

| نوع برنچ | ایجاد از | ادغام به | هدف |
|----------|----------|----------|-----|
| **Feature** | `develop` | `develop` | توسعه قابلیت جدید |
| **Bugfix** | `develop` | `develop` | رفع باگ در develop |
| **Release** | `develop` | `main` + `develop` + تگ | آماده‌سازی نسخه |
| **Hotfix** | **`main`** | `main` + `develop` + تگ | رفع فوری باگ production |

### چک‌لیست تصمیم‌گیری

- **در production** → Hotfix (از main)
- **در develop/staging** → Bugfix (از develop)
- **افزودن قابلیت** → Feature (از develop)
- **آماده‌سازی نسخه** → Release (از develop)

---

## ۳. کار با Feature Branch

### مراحل کامل (روش توصیه‌شده: به‌روزرسانی قبل از PR)

#### مرحله ۱ – همیشه از develop به‌روز شروع کن

```bash
git checkout develop
git pull origin develop
```

#### مرحله ۲ – ایجاد برنچ جدید

```bash
git checkout -b feature/add-user-profile-page
```

**نام‌گذاری:** `feature/نام-کوتاه` یا `feature/123-توضیح`

#### مرحله ۳ – توسعه و Commit

```bash
git add frontend-vue/src/auth/
git commit -m "feat(frontend): اضافه کردن صفحه لاگین"

git add backend/django/
git commit -m "feat(backend): اضافه کردن API احراز هویت"
```

#### مرحله ۴ – به‌روزرسانی با develop (قبل از PR)

```bash
git checkout feature/add-user-profile-page
git fetch origin
git merge origin/develop   # یا: git rebase origin/develop
```

**Merge** → ساده‌تر. **Rebase** → تاریخچه خطی‌تر (اگر برنچ share نشده).

**حل conflict:**
1. فایل‌ها را ویرایش کن
2. `git add <فایل>`
3. `git merge --continue` یا `git rebase --continue`

#### مرحله ۵ – Push

```bash
# معمولی
git push origin feature/add-user-profile-page

# بعد از rebase
git push --force-with-lease
```

#### مرحله ۶ – Pull Request

- **From:** feature/...
- **To:** develop
- توضیحات کامل، چک‌لیست، اسکرین‌شات

#### مرحله ۷ – بعد از Merge

```bash
git checkout develop
git pull origin develop
git branch -d feature/add-user-profile-page
git push origin --delete feature/add-user-profile-page
```

### قانون ادغام دو برنچ

> **برنچ فعلی** = مقصد. **برنچ نوشته‌شده** = منبع.

```bash
git checkout main
git merge feature/login   # تغییرات feature/login می‌آید داخل main
```

---

## ۴. Release، Bugfix، Hotfix

### Bugfix

```bash
git checkout develop
git checkout -b bugfix/login-validation-error
# رفع باگ، commit، PR به develop
```

### Release

```bash
git checkout develop
git checkout -b release/v1.2.0
# به‌روزرسانی version، changelog، تست
git checkout main
git merge --no-ff release/v1.2.0
git tag -a v1.2.0 -m "Release 1.2.0"
# merge به develop
```

### Hotfix (از main!)

```bash
git checkout main
git checkout -b hotfix/security-patch
# رفع باگ، commit
git checkout main
git merge --no-ff hotfix/security-patch
git tag -a v1.2.1 -m "Hotfix: ..."
# merge به develop
```

---

## ۵. دستورات مفید و چک‌لیست

### دستورات روزمره

```bash
# وضعیت برنچ‌ها
git branch -a
git branch --merged develop

# پاکسازی
git branch --merged develop | grep -v "\*\|main\|develop" | xargs -n 1 git branch -d
git fetch --prune
```

### چک‌لیست قبل از PR

- [ ] `git pull origin develop` زدم
- [ ] feature را با `merge` یا `rebase` به‌روز کردم
- [ ] conflictها حل شدند
- [ ] build و تست موفق است

### نکات حیاتی

1. همیشه `develop` را قبل از ایجاد برنچ جدید `pull` کنید
2. از `develop` برای feature/bugfix استفاده کنید، نه از `main`
3. از `--force-with-lease` به جای `--force` بعد از rebase
4. بعد از merge PR، برنچ را حذف کنید

---

## 📚 منابع بیشتر

- [راهنمای Pull Request](../tutorials/pull-request-guide.md)
- [Gitflow Branch Policy](../../.cursor/rules/share/gitflow-branch-policy.mdc)
- [ساختار پروژه](../PROJECT_STRUCTURE.md)

---

**آخرین به‌روزرسانی:** 2026-02-22 — ادغام از `Git-flow.md`، `Git-flow-branch.md`، `version-control-strategy.md`
