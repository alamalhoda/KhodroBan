# Test Gap Analysis — وضعیت پس از اجرا

**تاریخ به‌روزرسانی:** 2026-02-19  
**هدف:** نشان‌دادن gapهای اولیه، موارد تکمیل‌شده، و gapهای باقیمانده بعد از کارهای این PR.

---

## 1. Baseline و وضعیت فعلی

| شاخص | Baseline | وضعیت فعلی |
|------|----------|------------|
| Frontend tests | 21 فایل / 200 تست | **31 فایل / 287 تست** |
| Frontend E2E | 0 سناریو | **2 سناریو Playwright** |
| Backend smoke flow | ندارد | **1 smoke flow فعال** |

> Baseline از ابتدای همین فاز گرفته شده و وضعیت فعلی بر اساس آخرین اجرای موفق تست‌هاست.

---

## 2. وضعیت gapهای اولویت بالا (انجام‌شده)

### 2.1 Frontend Views حیاتی
| مورد | وضعیت | شواهد |
|------|--------|-------|
| `LoginView` | ✅ تکمیل | `frontend-vue/src/views/LoginView.test.js` |
| `ReportsView` | ✅ تکمیل | `frontend-vue/src/views/ReportsView.test.js` |
| `SmartAssistantView` | ✅ تکمیل | `frontend-vue/src/views/SmartAssistantView.test.js` |

پوشش رفتاری: success/error/loading/empty state برای مسیرهای اصلی UI-flow.

### 2.2 FE↔BE Service Contracts
| مورد | وضعیت | شواهد |
|------|--------|-------|
| Auth contract | ✅ تکمیل | `authService.contract.test.js` |
| Vehicle contract | ✅ تکمیل | `vehicleService.contract.test.js` |
| Reports contract | ✅ تکمیل | `reportService.contract.test.js` |
| AI contract (legacy/proxy) | ✅ تکمیل | `aiService.contract.test.js` |
| AI assistant session/message contract | ✅ تکمیل | `aiAssistantService.test.js` |

پوشش edge codeها: `400/401/403/404/429/500` + `timeout`.

### 2.3 Cross-stack integration/E2E
| مورد | وضعیت | شواهد |
|------|--------|-------|
| Backend smoke flow | ✅ تکمیل | `backend/django/khodroban/tests/test_smoke_flow.py` |
| Playwright setup | ✅ تکمیل | `frontend-vue/playwright.config.js` + scripts |
| E2E smoke (login→vehicle→expense→reports→AI) | ✅ تکمیل | `frontend-vue/e2e/smoke.cross-stack.spec.js` |
| E2E مسیر مدیریت/ویرایش خودرو | ✅ تکمیل | همان فایل E2E |

---

## 3. وضعیت gapهای متوسط/پایین (باقی‌مانده)

### Stores
| Store | اولویت فعلی | وضعیت |
|-------|-------------|-------|
| `notification.js` | متوسط | ⏳ نیازمند تست مستقیم بیشتر |
| `smartAssistant.js` | متوسط | ⏳ wrapper-level تست تکمیلی |
| `settings.js` | پایین | ⏳ باقی‌مانده |
| `telegram.js` | پایین | ⏳ باقی‌مانده |
| `serviceType.js`, `expenseCategory.js`, `upgrade.js` | پایین | ⏳ باقی‌مانده |

### Views
| View | اولویت فعلی | وضعیت |
|------|-------------|-------|
| `VehicleListView`, `VehicleDetailsView`, `VehicleManagementView` | متوسط | ⏳ unit/view tests تکمیلی |
| `SignUpView`, `AuthCallbackView` | متوسط | ⏳ باقی‌مانده |
| `ReminderManagementView`, `SettingsView` | پایین | ⏳ باقی‌مانده |

### Contracts
| Contract | اولویت فعلی | وضعیت |
|----------|-------------|-------|
| Notifications (`unread_count`, list behaviors) | متوسط | ⏳ FE contract test صریح ندارد |
| Reminder-specific FE contract scenarios | متوسط | ⏳ تکمیل نشده |

---

## 4. ریسک‌ها/مشاهدات جدید از اجرای واقعی

1. **AI provider config در بعضی envها وجود ندارد**  
   endpoint پیام AI می‌تواند `502` برگرداند؛ UI رفتار خطا را مدیریت می‌کند.
2. **third-party warnings**  
   warningهای ساختاری HTML از `vue3-persian-datepicker` non-blocking هستند.
3. **مورد مشاهده‌شده در لاگ E2E**  
   درخواست `api/vehicles/undefined/images` به‌صورت موردی دیده شد (non-blocking، اما مناسب bugfix جداگانه).

---

## 5. نقشه ادامه کار (پیشنهاد)

### Phase بعدی (پیشنهادی)
1. افزودن test مستقیم برای `VehicleDetailsView` و `VehicleManagementView` (سطح unit/view)
2. افزودن FE contract tests برای notifications/reminders
3. افزودن E2E سناریوی service-tab (جدا از expense-tab) برای تکمیل ماتریس سرویس/هزینه
4. رسیدگی به مورد `undefined/images` در یک PR کوچک bugfix

---

## 6. Security Checklist

- ✅ credential-like literal حساس در تست‌های جدید hard-code نشده
- ✅ Backend runtime credential generation رعایت شده (`get_random_string`)
- ✅ Frontend runtime/value-safe patterns رعایت شده (`crypto.randomUUID()` و داده‌های غیرحساس)
