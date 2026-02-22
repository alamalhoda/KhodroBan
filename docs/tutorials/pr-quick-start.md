# ⚡ راهنمای سریع Pull Request

این یک راهنمای سریع برای شروع استفاده از Pull Request است. برای راهنمای کامل به [راهنمای کامل PR](./pull-request-guide.md) مراجعه کنید.

---

## 🚀 شروع سریع (5 دقیقه)

### گام 1: ایجاد Branch جدید

```bash
git checkout main
git pull origin main
git checkout -b feature/نام-feature
```

**مثال**:
```bash
git checkout -b feature/add-login-page
```

### گام 2: کد نویسی و Commit

```bash
# انجام تغییرات
# ... کد نویسی ...

# Commit
git add .
git commit -m "feat: اضافه کردن صفحه لاگین"
```

### گام 3: Push و ایجاد PR

#### روش 1: استفاده از اسکریپت (ساده‌تر)

```bash
./scripts/create-pr.sh
```

#### روش 2: دستی

```bash
# Push branch
git push -u origin feature/نام-feature

# سپس به GitHub بروید و PR ایجاد کنید
# یا از لینکی که در terminal نمایش داده می‌شود استفاده کنید
```

### گام 4: Merge در GitHub

1. به repository در GitHub بروید
2. PR را باز کنید
3. بررسی کنید
4. روی "Merge pull request" کلیک کنید

### گام 5: پاکسازی

```bash
git checkout main
git pull origin main
git branch -d feature/نام-feature
```

---

## 📋 چک‌لیست سریع

قبل از ایجاد PR:

- [ ] Branch از main ساخته شده
- [ ] همه تغییرات commit شده‌اند
- [ ] Commit messages واضح هستند
- [ ] کد تست شده است
- [ ] Branch به GitHub push شده

---

## 🎯 مثال کامل

```bash
# 1. شروع
git checkout main
git pull origin main
git checkout -b feature/user-dashboard

# 2. کد نویسی
# ... تغییرات در frontend/src/Dashboard.svelte ...

# 3. Commit
git add frontend/src/Dashboard.svelte
git commit -m "feat(frontend): اضافه کردن داشبورد کاربر"

# 4. Push و PR
./scripts/create-pr.sh

# 5. بعد از merge در GitHub
git checkout main
git pull origin main
git branch -d feature/user-dashboard
```

---

## ❓ سوالات متداول

### چرا باید از PR استفاده کنم؟

- تاریخچه واضح‌تر
- امکان review قبل از merge
- آماده‌سازی برای کار تیمی
- مستندسازی بهتر

### آیا می‌توانم مستقیماً روی main commit کنم؟

بله، اما استفاده از PR توصیه می‌شود چون:
- فرصت review دارید
- تاریخچه بهتر می‌شود
- اگر مشکلی پیش آمد، راحت‌تر revert می‌شود

### PR را چطور merge کنم؟

در GitHub:
1. PR را باز کنید
2. بررسی کنید
3. "Merge pull request" را کلیک کنید
4. "Confirm merge" را کلیک کنید

---

## 📚 مراجع

- [راهنمای کامل PR](./pull-request-guide.md) - راهنمای جامع با جزئیات
- [راهنمای Git و کنترل ورژن](../technical/git-workflow.md) - استراتژی کلی پروژه

---

**نکته**: این راهنمای سریع برای شروع است. برای جزئیات بیشتر به راهنمای کامل مراجعه کنید.

