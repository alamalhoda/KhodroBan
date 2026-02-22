# 🚀 راهنمای کامل Linear

این راهنما توضیح می‌دهد که Linear چیست، چطور به شما کمک می‌کند، و چطور از آن استفاده کنید.

---

## 🎯 Linear چیست؟

**Linear** یک ابزار مدیریت پروژه و issue tracking است که **مخصوص تیم‌های توسعه نرم‌افزار** طراحی شده است. برخلاف ابزارهای عمومی مثل Trello یا Jira، Linear با تمرکز بر **سرعت**، **کارایی**، و **تجربه کاربری عالی** ساخته شده است.

### ویژگی‌های کلیدی:
- ⚡ **سریع و کارآمد**: طراحی شده برای کار سریع
- 🤖 **AI-Assisted**: با هوش مصنوعی برای پیشنهادات و خودکارسازی
- 🔗 **یکپارچگی قوی**: با GitHub، Cursor، و ابزارهای دیگر
- 📊 **Project Management**: مدیریت پروژه‌ها و roadmaps
- 🎯 **Issue Tracking**: ردیابی باگ‌ها و featureها
- 📈 **Insights**: گزارش‌ها و آمار پیشرفت

---

## 💡 چطور به شما کمک می‌کند؟

### ۱. مدیریت Issues و Tasks
- ایجاد و مدیریت issues به صورت سریع
- اولویت‌بندی و سازماندهی کارها
- Tracking پیشرفت هر issue

### ۲. Project Planning
- ایجاد و مدیریت پروژه‌ها
- Roadmap planning
- Milestone tracking
- Progress insights

### ۳. AI-Assisted Development
- پیشنهادات خودکار برای assignee
- پیشنهادات برای labels و projects
- Triage Intelligence برای مدیریت باگ‌ها
- یکپارچگی با Cursor برای code generation

### ۴. یکپارچگی با Cursor
- ایجاد issues مستقیم از Cursor
- تبدیل TODO comments به issues
- مدیریت issues در محیط توسعه
- AI-assisted issue creation

### ۵. Collaboration (اگر تیمی شدید)
- همکاری تیمی
- Real-time updates
- Comments و discussions
- Notifications

---

## 🔗 یکپارچگی با Cursor

از آنجایی که شما Linear را با Cursor متصل کرده‌اید، می‌توانید:

### ✅ کارهایی که می‌توانید انجام دهید:
1. **ایجاد Issue از Cursor**: می‌توانید issues را مستقیماً از Cursor ایجاد کنید
2. **مدیریت Issues**: لیست issues را در Cursor ببینید
3. **تبدیل TODO به Issue**: TODO comments در کد را به issues تبدیل کنید
4. **AI-Assisted**: Cursor می‌تواند با استفاده از Linear context بهتری داشته باشد

---

## 🚀 نحوه استفاده - راهنمای گام به گام

### گام ۱: ورود به Linear

1. به [linear.app](https://linear.app) بروید
2. با اکانت خود وارد شوید
3. Workspace خود را انتخاب کنید

### گام ۲: ایجاد Team (اختیاری)

اگر پروژه شما چند بخش دارد:
1. به Settings → Teams بروید
2. Team جدید ایجاد کنید (مثلاً "Frontend", "Backend", "DevOps")

### گام ۳: ایجاد Project

1. به بخش **Projects** بروید
2. روی **"New Project"** کلیک کنید
3. نام Project: `OilChenger Development`
4. Description: توضیحات پروژه
5. Team: تیم مربوطه را انتخاب کنید

### گام ۴: ایجاد Issue

#### روش ۱: از Linear Web App
1. روی **"Create Issue"** کلیک کنید
2. عنوان را وارد کنید (مثلاً: "تبدیل group_name به کد انگلیسی")
3. Description: توضیحات کامل
4. Assignee: خودتان را assign کنید
5. Project: Project مربوطه را انتخاب کنید
6. Labels: labels مناسب اضافه کنید
7. Priority: اولویت را تنظیم کنید

#### روش ۲: از Cursor (با یکپارچگی)
1. در Cursor، از command palette استفاده کنید
2. دستور مربوط به Linear را جستجو کنید
3. Issue جدید ایجاد کنید

### گام ۵: مدیریت Issues

#### Views مختلف:
- **Board View**: Kanban board (مثل GitHub Projects)
- **List View**: لیست ساده
- **Timeline View**: timeline و milestones

#### فیلترها:
- بر اساس Project
- بر اساس Assignee
- بر اساس Labels
- بر اساس Priority
- بر اساس Status

---

## 📊 ساختار پیشنهادی برای OilChenger

### Projects:
```
1. OilChenger Development
   - Frontend (Vue)
   - Backend (Python)
   - Database (Supabase)
   - PWA & Native App
   - DevOps
```

### Labels:
```
priority:
  - priority:high
  - priority:medium
  - priority:low

type:
  - type:bug
  - type:feature
  - type:enhancement
  - type:technical-debt
  - type:documentation

area:
  - area:frontend
  - area:backend
  - area:database
  - area:pwa
```

### Milestones:
```
- v1.0.0 - MVP
- Service Management (فاز ۴)
- PWA & Native App (فاز ۱۷)
- Authentication Fixes
```

---

## 🤖 ویژگی‌های AI در Linear

### ۱. Triage Intelligence
- پیشنهادات خودکار برای assignee
- پیشنهادات برای labels
- تشخیص duplicate issues
- پیشنهادات برای projects

### ۲. Suggestions
- پیشنهاد assignee بر اساس تاریخچه
- پیشنهاد project بر اساس محتوای issue
- پیشنهاد labels بر اساس محتوا

### ۳. Linear MCP (با Cursor)
- اتصال Linear به Cursor
- استفاده از Linear context در Cursor
- AI-assisted code generation با context از Linear

---

## 🔄 Workflow پیشنهادی

### ۱. ایجاد Issue برای TODO
```markdown
Title: تبدیل group_name به کد انگلیسی
Description: 
- تبدیل group_name در جداول service_types و expense_categories
- به‌روزرسانی stores و i18n files
- ایجاد migration جدید

Project: OilChenger Development
Labels: priority:medium, type:enhancement, area:database
Assignee: خودتان
Priority: Medium
```

### ۲. شروع کار
- Status را به "In Progress" تغییر دهید
- در Cursor شروع به کار کنید

### ۳. اتمام کار
- Status را به "Done" تغییر دهید
- Issue را close کنید
- در TODO.md وضعیت را به‌روز کنید

---

## 📋 مقایسه Linear با GitHub Projects

| ویژگی | Linear | GitHub Projects |
|-------|--------|----------------|
| **سرعت** | ⚡ بسیار سریع | 🐢 متوسط |
| **AI Features** | ✅ دارد | ❌ ندارد |
| **یکپارچگی Cursor** | ✅ کامل | ⚠️ محدود |
| **UI/UX** | ⭐⭐⭐⭐⭐ عالی | ⭐⭐⭐ خوب |
| **رایگان** | ✅ بله (محدود) | ✅ بله |
| **GitHub Integration** | ✅ کامل | ✅ کامل |
| **Mobile App** | ✅ دارد | ❌ ندارد |

### کدام را استفاده کنیم؟

**Linear:**
- ✅ اگر می‌خواهید تجربه بهتر و سریع‌تر
- ✅ اگر می‌خواهید از AI features استفاده کنید
- ✅ اگر با Cursor کار می‌کنید
- ✅ اگر می‌خواهید mobile app داشته باشید

**GitHub Projects:**
- ✅ اگر می‌خواهید همه چیز در GitHub باشد
- ✅ اگر تیم کوچک هستید و نیاز به ابزار ساده دارید
- ✅ اگر نمی‌خواهید ابزار جدید یاد بگیرید

**پیشنهاد:** می‌توانید از **هر دو** استفاده کنید:
- **Linear**: برای مدیریت روزانه و tracking
- **GitHub Projects**: برای نمایش در GitHub repository

---

## 🎨 مثال عملی: راه‌اندازی Linear برای OilChenger

### گام ۱: ایجاد Workspace
1. به Linear بروید و workspace ایجاد کنید
2. نام: `OilChenger`

### گام ۲: ایجاد Project
```
Name: OilChenger Development
Description: Development and maintenance of OilChenger project
Status: Active
```

### گام ۳: ایجاد Labels
Labels پیشنهادی را ایجاد کنید (priority, type, area)

### گام ۴: ایجاد Issues از TODO.md
برای هر TODO در `TODO.md`:
1. Issue در Linear ایجاد کنید
2. لینک Issue را در TODO.md اضافه کنید

### گام ۵: استفاده روزانه
- هر روز صبح: Linear را باز کنید و issues را ببینید
- هنگام شروع کار: Status را به "In Progress" تغییر دهید
- هنگام اتمام: Status را به "Done" تغییر دهید

---

## 🔧 تنظیمات پیشرفته

### ۱. Custom Fields
می‌توانید فیلدهای سفارشی اضافه کنید:
- زمان تخمینی (Estimated Time)
- فاز (Phase)
- و غیره

### ۲. Workflows
می‌توانید workflow سفارشی تنظیم کنید:
```
Backlog → To Do → In Progress → Review → Done
```

### ۳. Cycles (Sprints)
می‌توانید Cycles ایجاد کنید برای sprint planning:
```
Cycle 1: هفته ۱-۲
Cycle 2: هفته ۳-۴
```

### ۴. Integrations
Linear با ابزارهای زیادی یکپارچه می‌شود:
- GitHub (اتوماتیک)
- Cursor (از طریق MCP)
- Slack
- Figma
- و غیره

---

## 📱 Linear Mobile App

Linear یک mobile app عالی دارد:
- ✅ ایجاد و مدیریت issues
- ✅ Notifications
- ✅ Comments و discussions
- ✅ Project views

**نکته:** برای استفاده از mobile app، باید اکانت Linear داشته باشید.

---

## 💰 Pricing

### Free Plan:
- ✅ Unlimited issues
- ✅ Unlimited projects
- ✅ Basic integrations
- ✅ Mobile app
- ⚠️ محدودیت در تعداد team members
- ⚠️ محدودیت در برخی features پیشرفته

### Paid Plans:
- برای تیم‌های بزرگ
- Features پیشرفته‌تر
- Support بهتر

**نکته:** برای استفاده شخصی (solo developer)، Free plan کافی است.

---

## 🎯 Best Practices

### ۱. نام‌گذاری Issues
```
✅ خوب: "تبدیل group_name به کد انگلیسی"
❌ بد: "bug fix"
```

### ۲. Description کامل
همیشه description کامل بنویسید:
- چه کاری باید انجام شود
- چرا باید انجام شود
- چگونه باید انجام شود

### ۳. استفاده از Labels
از labels برای سازماندهی استفاده کنید:
- Priority labels
- Type labels
- Area labels

### ۴. Regular Updates
وضعیت issues را به‌روز نگه دارید:
- وقتی شروع می‌کنید → "In Progress"
- وقتی تمام می‌کنید → "Done"

### ۵. یکپارچگی با TODO.md
- Issues را در Linear ایجاد کنید
- لینک Issue را در TODO.md اضافه کنید
- هر دو را همزمان به‌روز کنید

---

## 🔗 لینک‌های مفید

- [Linear Documentation](https://linear.app/docs)
- [Linear Integrations](https://linear.app/integrations)
- [Linear API](https://developers.linear.app)
- [Linear MCP (Cursor Integration)](https://cursor.com/dashboard?tab=integrations)

---

## ❓ سوالات متداول

### آیا Linear رایگان است؟
**بله!** برای استفاده شخصی و تیم‌های کوچک رایگان است.

### آیا می‌توانم Linear را با GitHub sync کنم?
**بله!** Linear به صورت خودکار با GitHub sync می‌شود.

### آیا می‌توانم از Linear و GitHub Projects همزمان استفاده کنم?
**بله!** می‌توانید از هر دو استفاده کنید. Linear برای مدیریت روزانه و GitHub Projects برای نمایش در repository.

### چطور Linear را با Cursor متصل کنم?
از طریق [Cursor Dashboard → Integrations](https://cursor.com/dashboard?tab=integrations) می‌توانید Linear را متصل کنید.

---

## 📝 مثال: ایجاد Issue برای TODO موجود

فرض کنید می‌خواهید TODO "تبدیل group_name به کد انگلیسی" را به Linear اضافه کنید:

### در Linear:
```
Title: تبدیل group_name به کد انگلیسی
Description: 
تبدیل group_name در جداول service_types و expense_categories از فارسی به کد انگلیسی

مراحل:
- [ ] ایجاد migration
- [ ] به‌روزرسانی stores
- [ ] به‌روزرسانی i18n files
- [ ] تست

Project: OilChenger Development
Labels: priority:medium, type:enhancement, area:database
Priority: Medium
Estimated Time: 2-3 hours
```

### در TODO.md:
```markdown
### 1. تبدیل group_name به کد انگلیسی
**Linear Issue:** [OIL-123](https://linear.app/...)
**وضعیت:** 📝 در انتظار
**اولویت:** 🟡 متوسط
```

---

**نکته:** Linear یک ابزار قدرتمند است که می‌تواند workflow شما را بسیار بهبود بخشد. با یکپارچگی Cursor، می‌توانید مستقیماً از محیط توسعه issues را مدیریت کنید!

