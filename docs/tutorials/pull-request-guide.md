# 🔀 راهنمای کامل استفاده از Pull Request

این راهنمای عملی برای استفاده از Pull Request (PR) در پروژه KhodroBan (خودروبان) است. این راهنما به شما کمک می‌کند تا به عنوان یک Solo Developer از PR برای مدیریت بهتر کد استفاده کنید.

---

## 📚 فهرست مطالب

1. [چرا Pull Request؟](#چرا-pull-request)
2. [آماده‌سازی اولیه](#آماده‌سازی-اولیه)
3. [Workflow کامل PR](#workflow-کامل-pr)
4. [ایجاد Pull Request](#ایجاد-pull-request)
5. [Review و Merge](#review-و-merge)
6. [Best Practices](#best-practices)
7. [دستورات مفید](#دستورات-مفید)

---

## 🎯 چرا Pull Request؟

### مزایای استفاده از PR برای Solo Developer

1. **📝 تاریخچه واضح‌تر**: هر PR یک داستان کامل از تغییرات است
2. **🔍 بررسی کد قبل از merge**: فرصت دوباره نگاه کردن به کد قبل از merge
3. **📚 مستندسازی خودکار**: PR description به عنوان مستندات تغییرات عمل می‌کند
4. **🔄 امکان Rollback آسان**: اگر مشکلی پیش آمد، می‌توانید PR را revert کنید
5. **🚀 آماده‌سازی برای تیم**: اگر در آینده تیمی شدید، workflow آماده است
6. **✅ CI/CD Integration**: می‌توانید تست‌های خودکار را قبل از merge اجرا کنید

---

## 🛠️ آماده‌سازی اولیه

### 1. اطمینان از اتصال به GitHub

```bash
# بررسی remote repository
git remote -v

# باید خروجی مشابه این را ببینید:
# origin  https://github.com/alamalhoda/KhodroBan.git (fetch)
# origin  https://github.com/alamalhoda/KhodroBan.git (push)
```

### 2. به‌روزرسانی branch اصلی

```bash
# اطمینان از به‌روز بودن main
git checkout main
git pull origin main
```

---

## 🔄 Workflow کامل PR

### مرحله 1: ایجاد Branch جدید

```bash
# از main branch یک branch جدید برای feature بسازید
git checkout main
git pull origin main  # اطمینان از به‌روز بودن
git checkout -b feature/نام-feature

# مثال‌های نام‌گذاری:
git checkout -b feature/user-authentication
git checkout -b fix/login-bug
git checkout -b refactor/cleanup-api-code
git checkout -b docs/update-api-documentation
```

**نکته**: از prefix مناسب استفاده کنید:
- `feature/` - برای features جدید
- `fix/` - برای رفع باگ
- `refactor/` - برای بازنویسی کد
- `docs/` - برای تغییرات مستندات
- `test/` - برای اضافه کردن تست
- `chore/` - برای کارهای maintenance

### مرحله 2: انجام تغییرات و Commit

```bash
# انجام تغییرات در کد
# ... کد نویسی ...

# اضافه کردن فایل‌های تغییر یافته
git add .

# یا فقط فایل‌های خاص:
git add backend/src/views.py
git add frontend/src/components/Login.svelte

# Commit با پیام واضح
git commit -m "feat(backend): اضافه کردن endpoint احراز هویت"

# یا برای تغییرات چند بخشی:
git commit -m "feat: اضافه کردن سیستم لاگین

- Backend: اضافه کردن API endpoint POST /api/auth/login
- Frontend: اضافه کردن فرم لاگین
- Docs: به‌روزرسانی مستندات API"
```

**فرمت Commit Messages** (Conventional Commits):
- `feat:` - feature جدید
- `fix:` - رفع باگ
- `refactor:` - بازنویسی کد
- `docs:` - تغییرات مستندات
- `test:` - اضافه کردن تست
- `chore:` - کارهای maintenance
- `style:` - تغییرات فرمت (نه منطق)
- `perf:` - بهبود performance

### مرحله 3: Push کردن Branch

```bash
# اولین بار که branch را push می‌کنید:
git push -u origin feature/نام-feature

# دفعات بعدی (بعد از commit های بیشتر):
git push
```

### مرحله 4: ایجاد Pull Request

بعد از push، GitHub یک لینک برای ایجاد PR نشان می‌دهد. دو روش دارید:

#### روش 1: از طریق لینک GitHub

بعد از `git push`، در terminal یک لینک مشابه این می‌بینید:
```
remote: Create a pull request for 'feature/user-auth' on GitHub by visiting:
remote:      https://github.com/alamalhoda/KhodroBan/pull/new/feature/user-auth
```

روی این لینک کلیک کنید یا در مرورگر باز کنید.

#### روش 2: از طریق GitHub Website

1. به repository در GitHub بروید: `https://github.com/alamalhoda/KhodroBan`
2. یک بنر زرد با متن "Compare & pull request" می‌بینید
3. روی آن کلیک کنید
4. فرم PR را پر کنید (بخش بعدی)

### مرحله 5: پر کردن فرم PR

از template PR استفاده کنید (که در `.github/PULL_REQUEST_TEMPLATE.md` قرار دارد) یا به صورت دستی:

**عنوان PR**: واضح و مختصر
```
feat: اضافه کردن سیستم احراز هویت کاربر
```

**توضیحات PR**: شامل:
- **چه تغییری انجام شده؟**
- **چرا این تغییر لازم بود؟**
- **چطور تست شده؟**
- **چک‌لیست تغییرات**

مثال:
```markdown
## 📝 توضیحات
این PR سیستم احراز هویت کاربر را اضافه می‌کند.

## 🎯 هدف
اجازه دادن به کاربران برای ورود به سیستم و دسترسی به پنل کاربری.

## 🔄 تغییرات
- [x] Backend: اضافه کردن API endpoint POST /api/auth/login
- [x] Backend: اضافه کردن JWT token authentication
- [x] Frontend: اضافه کردن فرم لاگین
- [x] Frontend: اضافه کردن state management برای user session
- [x] Docs: به‌روزرسانی مستندات API

## ✅ تست‌ها
- [x] تست واحد برای login endpoint
- [x] تست integration برای flow کامل لاگین
- [x] تست UI برای فرم لاگین

## 📸 Screenshots (اگر UI تغییر کرده)
[در صورت نیاز screenshot اضافه کنید]

## 🔗 Issues مرتبط
Closes #123
```

### مرحله 6: Review و Merge

1. **Review خودتان**: PR را باز کنید و تغییرات را بررسی کنید
2. **بررسی Diff**: مطمئن شوید همه تغییرات درست هستند
3. **Merge**: اگر همه چیز درست بود:
   - روی "Merge pull request" کلیک کنید
   - نوع merge را انتخاب کنید (معمولاً "Create a merge commit")
   - روی "Confirm merge" کلیک کنید

**انواع Merge**:
- **Create a merge commit**: یک commit merge ایجاد می‌کند (توصیه می‌شود)
- **Squash and merge**: همه commit ها را در یک commit ترکیب می‌کند
- **Rebase and merge**: commit ها را rebase می‌کند (برای history خطی)

### مرحله 7: پاکسازی بعد از Merge

```bash
# برگشت به main
git checkout main

# دریافت آخرین تغییرات (شامل merge شده PR)
git pull origin main

# حذف branch محلی (اختیاری)
git branch -d feature/نام-feature

# حذف branch از GitHub (اختیاری)
git push origin --delete feature/نام-feature
```

---

## 📋 Best Practices

### 1. اندازه PR

- **کوچک نگه دارید**: PR های کوچک راحت‌تر review می‌شوند
- **یک موضوع در هر PR**: هر PR باید یک feature یا fix باشد
- **حداکثر 400-500 خط تغییر**: اگر بیشتر شد، PR را تقسیم کنید

### 2. Commit Messages

```bash
# خوب ✅
git commit -m "feat(backend): اضافه کردن endpoint ثبت خودرو"
git commit -m "fix(frontend): رفع باگ نمایش تاریخ در موبایل"
git commit -m "docs: به‌روزرسانی راهنمای نصب"

# بد ❌
git commit -m "تغییرات"
git commit -m "fix"
git commit -m "update"
```

### 3. PR Description

- همیشه توضیحات واضح بنویسید
- از checklist استفاده کنید
- Screenshot اضافه کنید اگر UI تغییر کرده
- Issues مرتبط را link کنید

### 4. Branch Naming

```bash
# خوب ✅
feature/user-authentication
fix/login-validation-error
refactor/api-response-handling
docs/update-installation-guide

# بد ❌
new-feature
fix
test
branch1
```

### 5. قبل از ایجاد PR

- [ ] کد را تست کرده‌اید
- [ ] Linter errors ندارید
- [ ] Commit messages واضح هستند
- [ ] Branch به‌روز است (از main pull کرده‌اید)
- [ ] Conflicts ندارید

---

## 🛠️ دستورات مفید

### مشاهده Branch های محلی و Remote

```bash
# همه branch های محلی
git branch

# همه branch های remote
git branch -r

# همه branch ها (محلی + remote)
git branch -a
```

### تغییر Branch

```bash
# رفتن به branch دیگر
git checkout main
git checkout feature/نام-feature

# یا با git switch (جدیدتر)
git switch main
git switch feature/نام-feature
```

### به‌روزرسانی Branch از main

```bash
# در حالی که روی feature branch هستید:
git checkout feature/نام-feature
git fetch origin
git merge origin/main

# یا با rebase (برای history تمیزتر):
git rebase origin/main
```

### مشاهده تفاوت‌ها

```bash
# تفاوت با main
git diff main

# تفاوت با remote
git diff origin/main

# فقط فایل‌های تغییر یافته
git diff --name-only main
```

### مشاهده تاریخچه

```bash
# تاریخچه commit ها
git log

# تاریخچه به صورت graph
git log --graph --oneline --all

# تاریخچه یک فایل خاص
git log -- frontend/src/App.svelte
```

### حذف Branch

```bash
# حذف branch محلی (بعد از merge)
git branch -d feature/نام-feature

# حذف اجباری (اگر merge نشده)
git branch -D feature/نام-feature

# حذف branch از GitHub
git push origin --delete feature/نام-feature
```

---

## 🚀 Workflow سریع (Quick Reference)

```bash
# 1. شروع کار
git checkout main
git pull origin main
git checkout -b feature/my-feature

# 2. کد نویسی و commit
git add .
git commit -m "feat: توضیح تغییرات"
git push -u origin feature/my-feature

# 3. ایجاد PR در GitHub (از طریق لینک یا website)

# 4. بعد از merge
git checkout main
git pull origin main
git branch -d feature/my-feature
```

---

## 📚 منابع بیشتر

- [GitHub Pull Request Documentation](https://docs.github.com/en/pull-requests)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Branching Strategies](https://www.atlassian.com/git/tutorials/comparing-workflows)

---

**آخرین به‌روزرسانی**: این راهنما برای استفاده با repository `alamalhoda/KhodroBan` نوشته شده است. نام پروژه: **KhodroBan (خودروبان)**

