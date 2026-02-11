# چک‌لیست استاندارد هر صفحه (SSOT)

این سند منبع یکتا (SSOT) برای ارزیابی هر صفحه در برنامه پایداری MVP است. برای هر صفحه از قالب زیر استفاده کنید.

---

## قالب

```
صفحه: [نام]
۱. ساختار: [ ] مطابق قوانین  [ ] نیاز به بازنگری — توضیح: …
۲. تست frontend: [ ] دارد  [ ] ناقص  [ ] ندارد — نوع: …
۳. ارتباط با backend: [ ] فقط Django  [ ] ترکیب  [ ] فقط Supabase — endpointها: …
۴. زیرساخت Django: مدل/ViewSet/Serializer: … — [ ] کافی  [ ] نیاز به بهبود
۵. تست backend: [ ] دارد  [ ] ناقص  [ ] ندارد
۶. مدیریت خطا: [ ] یکپارچه و مشخص  [ ] ناقص  [ ] ندارد — توضیح: …
۷. i18n: [ ] کامل  [ ] ناقص  [ ] ندارد — توضیح: …
۸. a11y حداقلی: [ ] بررسی شده  [ ] نیاز به بهبود — توضیح: …
۹. قرارداد API (Django): [ ] ثبت شده  [ ] در انتظار — مسیرها: …
وضعیت flow: [ ] بدون باگ بحرانی  [ ] با باگ — باگها: …
اقدامات بعدی: …
```

---

## لیست صفحات هدف (ترتیب flow)

| # | صفحه | مسیر | وضعیت چک‌لیست |
|---|------|------|----------------|
| 1 | Login | `/login` | — |
| 2 | SignUp | `/signup` | — |
| 3 | AuthCallback | `/auth/callback` | — |
| 4 | Dashboard | `/` | — |
| 5 | Vehicle List | `/vehicle-list` | — |
| 6 | Vehicle Details | `/vehicle-details/:id` | — |
| 7 | Vehicle Management | `/vehicle-management` | — |
| 8 | Add Service | `/add-service` | — |
| 9 | Service List | `/service-list` | — |
| 10 | Reminders | `/reminders` | — |
| 11 | Reminder Management | `/reminder-management` | — |
| 12 | Reports | `/reports` | — |
| 13 | Settings | `/settings` | — |
| 14 | Smart Assistant | `/smart-assistant` | — |
| 15 | Upgrade Pro | `/upgrade-pro` | — |

---

## مرجع قوانین

- Frontend: `.cursor/rules/frontend/`
- Backend: `.cursor/rules/backend/`
- مشترک: `.cursor/rules/share/`
- GitFlow: `.cursor/rules/share/gitflow-branch-policy.mdc`
