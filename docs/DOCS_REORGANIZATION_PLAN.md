# 📋 طرح مرتب‌سازی پوشه docs

این سند حاوی تحلیل فایل‌های مستندات، پیشنهاد ادغام، و لیست فایل‌های قابل حذف یا آرشیو است.

**تاریخ تحلیل:** 2026-02-22

---

## ۱. فایل‌های قابل ادغام (Consolidation)

### ۱.۱ مستندات Git / Version Control
**وضعیت فعلی:** سه فایل جداگانه با محتوای همپوشان زیاد

| فایل | محتوا | خطوط تقریبی |
|------|-------|-------------|
| `technical/Git-flow.md` | راهنمای کامل Git Flow | ~526 |
| `technical/Git-flow-branch.md` | تمرکز روی Feature Branch + merge | ~258 |
| `technical/version-control-strategy.md` | Monorepo + استراتژی برنچ | ~1000 |

**پیشنهاد:** ادغام در یک فایل با ساختار زیر:
- **`technical/git-workflow.md`** (فایل جدید)
  - بخش ۱: استراتژی Monorepo (از version-control-strategy)
  - بخش ۲: Git Flow و انواع برنچ (از Git-flow)
  - بخش ۳: کار با Feature Branch گام‌به‌گام (از Git-flow-branch)
  - بخش ۴: دستورات مفید و چک‌لیست

**نکته:** rule رسمی پروژه در `.cursor/rules/share/gitflow-branch-policy.mdc` است و این doc مرجع آموزشی می‌ماند. بعد از ادغام، `Git-flow.md`، `Git-flow-branch.md` و `version-control-strategy.md` حذف شوند.

---

### ۱.۲ مستندات تلگرام
**وضعیت فعلی:** ۱۲ فایل با ایندکس و خلاصه‌های تکراری

| فایل | نقش | پیشنهاد |
|------|-----|----------|
| `TELEGRAM_README_INDEX.md` | ایندکس کامل | **حذف** — با README ادغام |
| `TELEGRAM_INDEX.md` | ایندکس ساده‌تر | **حذف** — با README ادغام |
| `START_HERE.md` | نقطه ورود سریع | **ادغام** در README |
| `telegram-quick-start.md` | راهنمای ۵ مرحله | **نگه داشتن** |
| `telegram-summary.md` | خلاصه | **حذف** |
| `telegram-summary-final.md` | خلاصه نهایی | **حذف** — ادغام در README |
| `telegram-notification-system.md` | مستند کامل | **نگه داشتن** |
| `telegram-complete-guide.md` | راهنمای کامل | **ادغام** یا حذف (همپوشانی با notification-system) |
| `telegram-key-points.md` | نکات کلیدی | **ادغام** در notification-system یا حذف |
| `telegram-files-list.md` | لیست فایل‌ها | **ادغام** در README |
| `telegram-checklist.md` | چک‌لیست | **نگه داشتن** |
| `telegram-vs-current.md` | مقایسه با سیستم فعلی | **نگه داشتن** یا آرشیو |
| `telegram-connection-guide.md` | راهنمای اتصال | **ادغام** در quick-start |

**ساختار پیشنهادی نهایی `telegram/`:**
```
telegram/
├── README.md              # ایندکس + شروع سریع (از START_HERE + summaries)
├── telegram-quick-start.md
├── telegram-notification-system.md
├── telegram-checklist.md
└── telegram-vs-current.md (اختیاری)
```

---

### ۱.۳ مستندات Supabase
**وضعیت فعلی:** هفت فایل

| فایل | پیشنهاد |
|------|----------|
| `supabase-quick-start.md` | ادغام در `supabase-setup.md` به عنوان بخش «شروع سریع» |
| `supabase-setup.md` | **نگه داشتن** به عنوان مرجع اصلی |
| `supabase-frontend-integration.md` | ادغام در setup یا نگه داشتن به عنوان بخش جدا |
| `supabase-troubleshooting.md` | **نگه داشتن** |
| `supabase-email-configuration.md` | **نگه داشتن** (موضوع خاص) |
| `supabase-google-oauth-setup.md` | **نگه داشتن** (موضوع خاص) |
| `test-supabase-connection.md` | ادغام در troubleshooting |

---

### ۱.۴ مستندات Vue / Frontend
**وضعیت فعلی:** دو فایل

| فایل | پیشنهاد |
|------|----------|
| `vue-frontend-implementation.md` | **نگه داشتن** — مرجع اصلی |
| `VUE_FRONTEND_README.md` | **حذف** — محتوای آن فقط لینک به implementation است؛ این محتوا در بخش intro فایل implementation یا در README اصلی فرانت قرار گیرد |

---

### ۱.۵ آموزش‌های مدیریت پروژه (tutorials)
**وضعیت فعلی:** سه فایل جداگانه

| فایل | محتوا |
|------|--------|
| `LINEAR_GUIDE.md` | راهنمای Linear |
| `GITHUB_PROJECTS_GUIDE.md` | راهنمای GitHub Projects |
| `TODO_MANAGEMENT.md` | راهنمای مدیریت TODO |

**پیشنهاد:** ادغام در یک فایل **`task-management-guide.md`** با سه بخش، یا نگه داشتن سه فایل و اضافه کردن یک `README.md` در tutorials که توضیح دهد هر کدام چه زمانی استفاده شود.

---

### ۱.۶ پرامپت‌های تحلیل رقبا
**وضعیت فعلی:** چهار فایل با نقش‌های مختلف

| فایل | نقش | پیشنهاد |
|------|-----|----------|
| `identify-competitors.md` | پرامپت شناسایی رقبا | **نگه داشتن** |
| `analyze-competitors-slim.md` | پرامپت تحلیل خلاصه | **نگه داشتن** |
| `analyze-competitors-full.md` | پرامپت تحلیل کامل | **نگه داشتن** |
| `analyze-competitors-quik.md` | چارچوب/چک‌لیست تحلیل (متفاوت از slim) | **نگه داشتن** — نقش متفاوت دارد |

---

## ۲. فایل‌های قابل حذف یا آرشیو

### ۲.۱ احتمالاً منسوخ یا قدیمی

| فایل | دلیل |
|------|------|
| `UPGRADE_PAGE_IMPLEMENTATION.md` | اشاره به Svelte (`frontend/src/routes/`)؛ پروژه فعلی Vue است. اگر آن مسیرها دیگر وجود ندارند، این doc منسوخ است. |
| `docs/product/RECONSTRUCTION_GUIDE.md` | بسیار بلند (~۲۳۰۰ خط)، همپوشانی با `COMPLETE_TECHNICAL_DOCUMENTATION.md`. پیشنهاد: آرشیو در `docs/archive/` یا ادغام انتخابی در COMPLETE_TECHNICAL_DOCUMENTATION. |
| `docs/product/AI_RECONSTRUCTION_SUMMARY.md` | احتمالاً خروجی قدیمی AI؛ در صورت عدم مرجع، آرشیو شود. |

### ۲.۲ خروجی‌های موقتی / وضعیتی

| فایل | دلیل |
|------|------|
| `development/PR_READY_OUTPUT.md` | خروجی مربوط به یک PR خاص؛ بعد از merge می‌توان آرشیو کرد. |
| `development/TEST_GAP_ANALYSIS.md` | در صورت به‌روز نشدن مداوم، می‌توان به `development/archive/` منتقل کرد. |

### ۲.۳ اسکریپت پایتون در research
| فایل | پیشنهاد |
|------|----------|
| `research/competitors/analyses/download_screenshots.py` | اسکریپت است، نه doc؛ انتقال به `scripts/` منطقی‌تر است. |

---

## ۳. ساختار پیشنهادی نهایی docs

```
docs/
├── README.md                          # ایندکس اصلی docs
├── PROJECT_STRUCTURE.md
├── DOCS_REORGANIZATION_PLAN.md        # این فایل
│
├── product/
│   ├── overview.md
│   ├── COMPLETE_TECHNICAL_DOCUMENTATION.md
│   └── prompt/
│
├── strategy/
├── deployment/
├── development/
│   ├── API_CONTRACT_REGISTRY.md
│   ├── PAGE_REVIEW_LOG.md
│   ├── CHANGE_LEDGER.md
│   ├── REGRESSION_GATE.md
│   ├── PAGE_CHECKLIST_TEMPLATE.md
│   ├── DEMO_SCENARIO.md
│   └── archive/                       # خروجی‌های موقتی
│
├── technical/
│   ├── git-workflow.md                # ادغام Git-flow + version-control + Git-flow-branch
│   ├── supabase-setup.md              # شامل quick-start
│   ├── supabase-*.md                  # troubleshooting, email, oauth
│   ├── vue-frontend-implementation.md
│   ├── telegram/
│   │   ├── README.md
│   │   ├── telegram-quick-start.md
│   │   ├── telegram-notification-system.md
│   │   └── telegram-checklist.md
│   ├── database/
│   └── ...
│
├── tutorials/
│   ├── README.md
│   ├── pull-request-guide.md
│   ├── pr-quick-start.md
│   └── task-management-guide.md       # ادغام LINEAR + GITHUB_PROJECTS + TODO (اختیاری)
│
├── presentations/
├── research/
└── سند مقدس/
```

---

## ۴. چک‌لیست اجرا

برای اعمال پیشنهادات به ترتیب زیر عمل شود:

- [x] **فاز ۱ – Git:** ادغام و ایجاد `technical/git-workflow.md`، حذف سه فایل قدیمی
- [x] **فاز ۲ – تلگرام:** ایجاد `telegram/README.md`، حذف فایل‌های ایندکس و خلاصه تکراری
- [x] **فاز ۳ – Supabase:** ادغام quick-start و test-connection در setup/troubleshooting
- [x] **فاز ۴ – Vue:** حذف VUE_FRONTEND_README و به‌روزرسانی لینک‌ها
- [x] **فاز ۵ – Tutorials:** ادغام یا ایندکس task-management
- [x] **فاز ۶ – آرشیو:** انتقال فایل‌های منسوخ/موقتی به `archive/`؛ انتقال `download_screenshots.py` به `scripts/`
- [x] **فاز ۷ – به‌روزرسانی لینک‌ها:** اصلاح ارجاعات در READMEها و فایل‌های دیگر

---

**یادآوری:** قبل از حذف یا جابه‌جایی هر فایل، با `grep` بررسی کنید که کجاها به آن ارجاع شده است.
