# 📜 اسکریپت‌های کمکی

این پوشه شامل اسکریپت‌های کمکی برای ساده‌سازی کارهای روزمره توسعه است.

## 🚀 اسکریپت‌های موجود

### `manage-branches.sh`

اسکریپت کمکی برای مدیریت برنچ‌ها در Monorepo.

#### نحوه استفاده

```bash
# نمایش وضعیت برنچ‌ها
./scripts/manage-branches.sh status

# ایجاد برنچ develop
./scripts/manage-branches.sh create-develop

# ایجاد feature branch
./scripts/manage-branches.sh create-feature user-authentication

# پاکسازی برنچ‌های merge شده
./scripts/manage-branches.sh cleanup

# همگام‌سازی با remote
./scripts/manage-branches.sh sync

# نمایش راهنما
./scripts/manage-branches.sh help
```

#### دستورات موجود

- `status`: نمایش وضعیت برنچ‌ها (محلی، remote، merge شده، merge نشده)
- `cleanup`: پاکسازی برنچ‌های merge شده با develop
- `sync`: همگام‌سازی develop و main با remote
- `create-develop`: ایجاد برنچ develop از main
- `create-feature <name>`: ایجاد feature branch از develop
- `help`: نمایش راهنما

#### مثال

```bash
# 1. بررسی وضعیت فعلی
./scripts/manage-branches.sh status

# 2. ایجاد برنچ develop (اگر وجود ندارد)
./scripts/manage-branches.sh create-develop

# 3. ایجاد feature branch جدید
./scripts/manage-branches.sh create-feature user-auth

# 4. بعد از merge PR، پاکسازی
./scripts/manage-branches.sh cleanup
```

---

### `create-pr.sh`

اسکریپت کمکی برای ایجاد Pull Request به صورت خودکار.

#### نحوه استفاده

```bash
# از root پروژه:
./scripts/create-pr.sh

# یا از هر جای پروژه:
bash scripts/create-pr.sh
```

#### چه کاری انجام می‌دهد؟

1. بررسی می‌کند که روی branch اصلی (main) نیستید
2. بررسی می‌کند که همه تغییرات commit شده‌اند
3. Branch را به GitHub push می‌کند
4. لینک ایجاد PR را نمایش می‌دهد
5. اگر `gh` CLI نصب باشد، می‌تواند PR را به صورت خودکار ایجاد کند

#### مثال

```bash
# 1. ایجاد branch جدید
git checkout -b feature/user-authentication

# 2. انجام تغییرات و commit
git add .
git commit -m "feat: اضافه کردن سیستم احراز هویت"

# 3. اجرای اسکریپت
./scripts/create-pr.sh

# 4. اسکریپت branch را push می‌کند و لینک PR را نمایش می‌دهد
```

#### پیش‌نیازها

- Git نصب شده باشد
- Repository به GitHub متصل باشد
- (اختیاری) `gh` CLI برای ایجاد خودکار PR

#### نصب GitHub CLI (gh)

```bash
# macOS
brew install gh

# Linux
# بسته به توزیع، دستورات متفاوت است

# بعد از نصب، احراز هویت کنید:
gh auth login
```

---

### `download-competitor-screenshots.py`

اسکریپت Python برای دانلود تصاویر اپلیکیشن‌های رقبا از کافه‌بازار و مایکت. خروجی در `docs/research/competitors/analyses/<competitor_id>/` ذخیره می‌شود.

```bash
# از root پروژه (نیاز به requests و beautifulsoup4)
python scripts/download-competitor-screenshots.py
```

---

## 🔧 افزودن اسکریپت جدید

اگر اسکریپت جدیدی اضافه می‌کنید:

1. فایل را در این پوشه قرار دهید
2. دسترسی اجرا بدهید: `chmod +x scripts/نام-اسکریپت.sh`
3. این README را به‌روزرسانی کنید
4. مستندات را در `docs/` اضافه کنید (در صورت نیاز)

---

## 📚 منابع بیشتر

- [راهنمای کامل Pull Request](../docs/tutorials/pull-request-guide.md)
- [استراتژی کنترل ورژن](../docs/technical/git-workflow.md)

