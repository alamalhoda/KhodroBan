# AI Rules Index - Frontend Development

منبع جامع و کامل برای قوانین توسعه Frontend توسط AI. این مجموعه ترکیبی از بهترین شیوه‌ها و استانداردهای توسعه رابط کاربری تحت وب است.

> **نکته:** این فایل فقط برای مرجع و فهرست‌بندی است. قوانین واقعی در فایل‌های `.mdc` قرار دارند که توسط Cursor به صورت خودکار اعمال می‌شوند.

## Core

اصول پایه‌ای و قوانین کلی برای توسعه Frontend:

- [core/ai-behavior.mdc](./core/ai-behavior.mdc) - دستورالعمل‌های کلی رفتار AI و اولویت‌های اجرایی
- [core/code-quality.mdc](./core/code-quality.mdc) - استانداردهای کیفیت کد و قراردادهای نام‌گذاری
- [core/meta-principles.mdc](./core/meta-principles.mdc) - فرا-اصول طراحی و معماری
- [core/git-workflow.mdc](./core/git-workflow.mdc) - استراتژی شاخه‌بندی و قراردادهای commit message

## Architecture

اصول معماری و طراحی سیستم:

- [architecture/component-design.mdc](./architecture/component-design.mdc) - اصول طراحی کامپوننت و Atomic Design
- [architecture/project-structure.mdc](./architecture/project-structure.mdc) - ساختار پروژه و سازماندهی فایل‌ها
- [architecture/separation-of-concerns.mdc](./architecture/separation-of-concerns.mdc) - جداسازی دغدغه‌ها (UI/Logic/Data)
- [architecture/solid.mdc](./architecture/solid.mdc) - اصول SOLID برای کامپوننت‌ها
- [architecture/atomic-design.mdc](./architecture/atomic-design.mdc) - اصول Atomic Design (Atoms, Molecules, Organisms, Templates, Pages)

## UI/UX

راهنمای طراحی رابط کاربری و تجربه کاربری:

- [ui-ux/accessibility.mdc](./ui-ux/accessibility.mdc) - دسترسی‌پذیری (WCAG 2.1 AA)
- [ui-ux/responsive-design.mdc](./ui-ux/responsive-design.mdc) - طراحی واکنش‌گرا و Mobile-First
- [ui-ux/user-feedback.mdc](./ui-ux/user-feedback.mdc) - بازخورد به کاربر (Loading, Error, Success)
- [ui-ux/interaction-patterns.mdc](./ui-ux/interaction-patterns.mdc) - الگوهای تعامل (Form Validation, Optimistic UI, Animations)
- [ui-ux/styling.mdc](./ui-ux/styling.mdc) - استراتژی استایل‌دهی و مدیریت تم‌ها

## Frontend

الگوها و قوانین توسعه Frontend:

- [frontend/component-patterns.mdc](./frontend/component-patterns.mdc) - الگوهای کامپوننت و ساختار استاندارد
- [frontend/reactivity.mdc](./frontend/reactivity.mdc) - اصول reactivity و reactive declarations
- [frontend/anti-patterns.mdc](./frontend/anti-patterns.mdc) - الگوهای نادرست و راه‌حل‌های صحیح
- [frontend/api-integration.mdc](./frontend/api-integration.mdc) - یکپارچه‌سازی API و مدیریت وضعیت‌ها
- [frontend/props-events.mdc](./frontend/props-events.mdc) - مدیریت Props و Events

## State

مدیریت State و داده‌های برنامه:

- [state/state-management.mdc](./state/state-management.mdc) - مدیریت state (Local, Global, Persistent)
- [state/local-vs-global.mdc](./state/local-vs-global.mdc) - تصمیم‌گیری برای Local vs Global State

## Performance

بهینه‌سازی عملکرد و سرعت:

- [performance/bundle-size.mdc](./performance/bundle-size.mdc) - مدیریت حجم bundle و Performance Budget
- [performance/core-web-vitals.mdc](./performance/core-web-vitals.mdc) - Core Web Vitals (LCP, FID, CLS)
- [performance/runtime.mdc](./performance/runtime.mdc) - بهینه‌سازی runtime (Virtual Scrolling, Debouncing, Memoization)
- [performance/optimization.mdc](./performance/optimization.mdc) - تکنیک‌های بهینه‌سازی کلی
- [performance/asset-management.mdc](./performance/asset-management.mdc) - مدیریت Assets (Images, Fonts, Icons)

## Testing

استراتژی و قوانین تست:

- [testing/strategy.mdc](./testing/strategy.mdc) - استراتژی تست و Testing Pyramid
- [testing/unit-testing.mdc](./testing/unit-testing.mdc) - تست واحد (Component, Store, Utility)
- [testing/e2e-testing.mdc](./testing/e2e-testing.mdc) - تست end-to-end و Visual Regression

## Tool-Specific

قوانین خاص برای ابزارهای توسعه:

- [tools/svelte/index.mdc](./tools/svelte/index.mdc) - قوانین و بهترین شیوه‌های Svelte
- [tools/vite/index.mdc](./tools/vite/index.mdc) - پیکربندی و بهینه‌سازی Vite

---

## ویژگی‌های این مجموعه

### جامعیت
این مجموعه ترکیبی از دو منبع اصلی است و شامل:
- **31 فایل** راهنمای قوانین (`.mdc`)
- **تمام دسته‌بندی‌های مهم** Frontend Development
- **ترکیب بهترین شیوه‌ها** از هر دو منبع

### عمق و جزئیات
- **Performance Budget** با اعداد مشخص (170KB bundle, 1.8s FCP)
- **Core Web Vitals** با تکنیک‌های بهینه‌سازی
- **Testing Strategy** با اهداف مشخص (70% unit, 20% integration, 10% E2E)
- **SOLID Principles** برای معماری
- **Atomic Design** برای ساختار UI

### عملی و قابل اجرا
- مثال‌های ❌/✅ برای الگوهای نادرست و صحیح
- Code snippets آماده استفاده
- Checklist‌های عملی
- قوانین تصمیم‌گیری واضح

### استانداردها و Compliance
- **WCAG 2.1 AA** برای Accessibility
- **Mobile-First** Approach
- **Performance Budget** سخت‌گیرانه
- **Git Workflow** استاندارد

---

## نحوه استفاده

1. **برای شروع:** با فایل‌های `core/` شروع کن تا با اصول پایه آشنا شوی
2. **برای معماری:** فایل‌های `architecture/` را مطالعه کن
3. **برای UI/UX:** از فایل‌های `ui-ux/` برای طراحی استفاده کن
4. **برای بهینه‌سازی:** فایل‌های `performance/` را برای بهبود عملکرد بررسی کن
5. **برای تست:** از `testing/` برای استراتژی تست استفاده کن

---

## اولویت‌های اجرایی

1. **UI/UX First** - تجربه کاربر در اولویت
2. **Accessibility First** - دسترسی‌پذیری الزامی است
3. **Mobile-First** - طراحی از موبایل شروع می‌شود
4. **Performance First** - عملکرد با بودجه مشخص
5. **Maintainability** - قابلیت نگهداری کد

---

## Performance Budget

**الزامات سخت:**
- Initial JS bundle: **<170KB** (gzipped)
- Initial CSS: **<50KB** (gzipped)
- Total page weight: **<1MB**
- LCP: **<2.5s**
- FID: **<100ms**
- CLS: **<0.1**

---

این مجموعه برای استفاده در پروژه‌های طراحی واسط کاربری تحت وب طراحی شده است و تمام جنبه‌های مهم توسعه Frontend را پوشش می‌دهد.
