# راهنمای کامل کار با **Feature Branch**

(برای اعضای جدید تیم توسعه)

این مستند فقط روی **Feature Branch** تمرکز دارد و به طور خاص روش **به‌روزرسانی فیچر قبل از ایجاد Pull Request** را توضیح می‌دهد.این روش در بسیاری از تیم‌های حرفه‌ای استفاده می‌شود چون باعث می‌شود:

- کانفلیکت‌ها زودتر و در محیط محلی حل شوند
- Pull Request تمیزتر و قابل‌بررسی‌تر باشد
- احتمال شکست CI/CD روی سرور کمتر شود

---

## نام‌گذاری Feature Branch

نام برنچ باید معنی‌دار و قابل جستجو باشد. الگوهای رایج:

```
feature/نام-کوتاه-فیچر
feature/شماره-تیکت-توضیح-کوتاه
feature/نام-کاربر-توضیح
```

مثال‌های خوب:

```
feature/add-user-profile-page
feature/124-login-with-google
feature/payment-refund-support
feature/improve-mobile-navbar
```

---

## مراحل کامل کار با Feature Branch

(روش پیشنهادی: به‌روزرسانی فیچر قبل از PR)

### مرحله ۱ – همیشه از develop به‌روز شروع کن

قبل از شروع هر کار جدید:

```bash
git checkout develop
git pull origin develop
```

این کار تضمین می‌کند که برنچ جدید شما از آخرین وضعیت تیم شروع می‌شود.

### مرحله ۲ – ایجاد برنچ جدید

```bash
# دو روش رایج:

# روش ۱ (تک خطی – توصیه بیشتر)
git checkout -b feature/add-user-profile-page

# روش ۲ (واضح‌تر برای افراد جدید)
git checkout develop
git checkout -b feature/add-user-profile-page
```

### مرحله ۳ – توسعه و Commit کردن

تغییرات را در commitهای کوچک و معنی‌دار انجام دهید:

```bash
git add src/components/ProfileCard.tsx
git commit -m "feat(profile): add profile card component"

git add src/pages/ProfilePage.tsx
git commit -m "feat(profile): create profile page layout"

git add src/api/user.ts tests/user.test.ts
git commit -m "feat(profile): add user data fetching + unit tests"

git add README.md docs/profile.md
git commit -m "docs: update documentation for user profile feature"
```

**نکته مهم برای تازه‌واردان:**
هر commit باید یک تغییر منطقی و قابل‌فهم باشد (نه همه تغییرات یکجا).

### مرحله ۴ – به‌روزرسانی فیچر با آخرین تغییرات develop (مهم‌ترین مرحله!)

قبل از اینکه Pull Request بزنید، حتماً برنچ فیچر خود را با develop هماهنگ کنید.

```bash
# برو به برنچ فیچر
git checkout feature/add-user-profile-page

# آخرین تغییرات را از سرور بکش
git fetch origin

# حالا دو انتخاب داری:

# انتخاب A – Merge (ساده‌تر برای شروع)
git merge origin/develop

# انتخاب B – Rebase (تاریخچه خطی‌تر – کمی پیشرفته‌تر)
git rebase origin/develop
```

**اگر conflict پیش آمد:**

1. گیت بهت می‌گوید کدام فایل‌ها مشکل دارند
2. فایل‌ها را باز کن → قسمت‌های <<<<< و ===== و >>>>> را ویرایش کن
3. بعد از حل کردن:

```bash
git add <فایل-حل-شده>
```

4. ادامه بده:

```bash
# اگر merge بود:
git merge --continue

# اگر rebase بود:
git rebase --continue
```

5. همه commitها را دوباره چک کن و تست بزن

### مرحله ۵ – Push کردن برنچ به‌روزشده

```bash
# حالت معمولی
git push origin feature/add-user-profile-page

# اگر rebase کردی و قبلاً push کرده بودی:
git push --force-with-lease
```

**توجه:** `--force-with-lease` ایمن‌تر از `--force` است و فقط وقتی push می‌کند که کسی دیگر روی برنچ تو تغییر نداده باشد.

### مرحله ۶ – ایجاد Pull Request

به GitHub / GitLab / Azure DevOps برو و Pull Request بساز:

- **From:** feature/add-user-profile-page
- **To:** develop

**عنوان خوب PR:**

```
feat: اضافه کردن صفحه پروفایل کاربر و API مربوطه
```

**توضیحات پیشنهادی برای PR:**

```markdown
**هدف این PR:**
اضافه کردن صفحه پروفایل کاربر با نمایش اطلاعات پایه، آواتار و آمار فعالیت

**تغییرات اصلی:**
- کامپوننت ProfileCard
- صفحه ProfilePage با layout responsive
- endpoint جدید GET /user/profile
- unit test برای کامپوننت و API

**چک‌لیست:**
- [x] تست محلی انجام شد
- [x] تست‌ها پاس شدند (npm test / pytest)
- [x] build موفق بود
- [x] با آخرین develop هماهنگ شده است

**اسکرین‌شات‌ها:**
(اگر UI تغییر کرده حتما بگذارید)

Closes #124
```

### مرحله ۷ – بعد از Merge شدن PR

وقتی PR merge شد (معمولاً با **Squash and merge** یا **Merge commit**):

```bash
# به‌روزرسانی لوکال
git checkout develop
git pull origin develop

# حذف برنچ فیچر (تمیزکاری مهم است!)
git branch -d feature/add-user-profile-page
git push origin --delete feature/add-user-profile-page
```

---

## چک‌لیست سریع برای اعضای جدید

قبل از ایجاد Pull Request حتماً این موارد را چک کن:

- [ ] `git pull origin develop` را اخیراً زدی؟
- [ ] فیچر را با `git merge origin/develop` یا `git rebase origin/develop` به‌روز کردی؟
- [ ] تمام conflictها را حل کردی؟
- [ ] پروژه build می‌شود؟ (npm run build / gradle build / ...)
- [ ] تست‌ها پاس می‌شوند؟ (npm test / pytest / ...)
- [ ] حداقل یک بار پروژه را دستی اجرا کردی؟
- [ ] پیام‌های commit خوانا و معنی‌دار هستند؟
- [ ] توضیحات PR کامل و مفید است؟

---

## خلاصه تصویری گردش کار (روش پیشنهادی)

```
1. git checkout develop
   git pull

2. git checkout -b feature/...

3. توسعه + commitهای کوچک

          ↓

4. git fetch
   git merge origin/develop   (یا git rebase origin/develop)

          ↓

5. حل conflict (در صورت وجود) → تست → push

          ↓

6. ایجاد Pull Request → منتظر review

          ↓

7. Merge (توسط خودت یا reviewer)

          ↓

8. git checkout develop
   git pull
   git branch -d feature/...
```
