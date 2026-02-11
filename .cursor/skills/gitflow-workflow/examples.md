# مثال‌های عملی GitFlow

## سناریو ۱: شروع یک Feature جدید

ابتدا وضعیت فعلی را ببین، بعد از `develop` یک branch جدید بساز:

```bash
git status
git branch --show-current
git checkout develop
git pull origin develop
git checkout -b feature/add-service-history develop
```

## سناریو ۲: همگام‌سازی branch قبل از PR

قبل از PR، branch را با `origin/develop` sync کن:

```bash
git checkout feature/add-service-history
git fetch origin
git merge origin/develop
```

## سناریو ۳: جریان Rebase با Push امن

اگر rebase انجام دادی، push امن فقط با `--force-with-lease`:

```bash
git checkout feature/add-service-history
git fetch origin
git rebase origin/develop
git push --force-with-lease origin feature/add-service-history
```

## سناریو ۴: قانون Merge (مقصد/منبع)

مدل ذهنی درست:
- branch فعلی (checked-out) = مقصد merge
- branchی که بعد از `git merge <branch>` می‌آید = منبع merge

نمونه صحیح برای بردن feature به develop:

```bash
git checkout develop
git pull origin develop
git merge feature/add-service-history
git push origin develop
```
