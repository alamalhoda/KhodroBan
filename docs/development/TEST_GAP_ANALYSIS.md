# Test Gap Analysis (PR-ready)

**تاریخ:** 2026-02-19  
**هدف:** تکمیل تست‌ها برای PR-ready با تمرکز روی gapهای واقعی و flowهای حیاتی.

---

## 1. وضعیت فعلی

| سطح | وضعیت | Coverage |
|-----|--------|----------|
| Backend | 150 passed | 89% |
| Frontend | 21 files, 200 tests | - |

### پوشش Backend مهم
- `khodroban/huey_tasks.py` = 100%
- `khodroban/models.py` = 94%
- `khodroban/serializers.py` = 92%
- `khodroban/views.py` = **69%** ← نیاز به بهبود

---

## 2. Gapهای Frontend

### Stores بدون تست
| Store | اولویت | دلیل |
|-------|--------|------|
| `report.js` | **بالا** | flow گزارش و خلاصه |
| `ai.js` | **بالا** | AI assistant flow |
| `smartAssistant.js` | متوسط | wrapper روی ai |
| `upgrade.js` | پایین | - |
| `notification.js` | متوسط | نوتیفیکیشن‌ها |
| `settings.js` | پایین | - |
| `serviceType.js` | پایین | - |
| `expenseCategory.js` | پایین | - |
| `telegram.js` | پایین | - |

### Services بدون تست
| Service | اولویت |
|---------|--------|
| `aiAssistantService.js` | **بالا** – قرارداد با AI backend |
| `dashboardService.js` | متوسط |
| `serviceTypeService.js` | پایین |
| `expenseCategoryService.js` | پایین |
| `telegramService.js` | پایین |

### Views بدون تست
| View | اولویت |
|------|--------|
| LoginView | **بالا** |
| VehicleListView | **بالا** |
| ReportsView | **بالا** |
| SmartAssistantView | **بالا** |
| SignUpView, AuthCallbackView | متوسط |
| VehicleDetailsView, VehicleManagementView | متوسط |
| ReminderManagementView, SettingsView | پایین |

---

## 3. Contractهای FE↔BE بدون تست صریح

| Contract | تست Backend | تست Frontend |
|----------|-------------|--------------|
| Auth: login/register/refresh | ✅ | ❌ contract test در FE |
| Vehicle CRUD + km/km-history | ✅ | ❌ contract test در FE |
| Service/Expense list/detail | ✅ | ❌ |
| Reports summary | ✅ | ❌ |
| AI send message | ✅ | ❌ |
| Notifications unread_count | ✅ | ❌ |

---

## 4. Edge Cases مورد نیاز

| کد | توضیح | Backend | Frontend |
|----|-------|---------|----------|
| 400 | Bad Request / Validation | بخشی | contract test |
| 401 | Unauthorized | ✅ | contract test |
| 403 | Forbidden | بخشی | - |
| 404 | Not Found | بخشی | - |
| 429 | Rate limit (AI) | - | - |
| 500 | Server error | - | error envelope |
| Timeout | Network timeout | - | error handling |

---

## 5. اولویت پیاده‌سازی

### Phase 1 (این PR)
1. **aiAssistantService.test.js** – contract tests (success/error envelope, field shape)
2. **ai.test.js** (store) – با mocked aiAssistantService
3. **report.test.js** (store) – با mocked reportService
4. **Backend:** تست‌های اضافی برای views (گزارش، km-history، AI throttle)
5. **Smoke flow:** یک integration test انتها-به-انتها در backend

### Phase 2 (بعدی)
- LoginView, ReportsView, SmartAssistantView tests
- Contract tests برای auth/vehicle/service layers
- E2E با Playwright (اگر setup شود)

---

## 6. Security Checklist

- ✅ هیچ credential-like literal در تست‌ها
- ✅ Backend: `get_random_string(12)` برای password در runtime
- ✅ Frontend: از مقادیر runtime (مثلاً `crypto.randomUUID()` یا mock) استفاده شود
