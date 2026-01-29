# TODO: تبدیل group_name به کد انگلیسی

## وضعیت فعلی
در حال حاضر `group_name` در جداول `service_types` و `expense_categories` به صورت فارسی ذخیره می‌شود:
- `'موتور و روغن'`
- `'چرخ و تعلیق'`
- `'سوخت'`
- و غیره...

## هدف
تبدیل `group_name` به کدهای انگلیسی برای:
- پشتیبانی بهتر از چندزبانه بودن
- ترجمه‌های بهتر در i18n
- سازگاری بیشتر با استانداردهای بین‌المللی

## پیشنهاد کدها

### Service Types Groups:
- `'موتور و روغن'` → `'engine_oil'`
- `'ترمز و ایمنی'` → `'brakes_safety'`
- `'چرخ و تعلیق'` → `'wheels_suspension'`
- `'باتری و برق'` → `'battery_electrical'`
- `'برق و الکترونیک'` → `'electrical_electronics'`
- `'گیربکس و اگزوز'` → `'transmission_exhaust'`
- `'بدنه و شیشه'` → `'body_glass'`
- `'سایر'` → `'other'`

### Expense Categories Groups:
- `'سوخت'` → `'fuel'`
- `'نگهداری و سرویس'` → `'maintenance_service'`
- `'اجباری و قانونی'` → `'legal_mandatory'`
- `'جریمه و عوارض'` → `'fines_tolls'`
- `'قطعات و دستمزد'` → `'parts_labor'`
- `'پارکینگ'` → `'parking'`
- `'تعمیرات'` → `'repairs'`
- `'سایر'` → `'other'`

## مراحل پیاده‌سازی

### 1. ایجاد Migration
```sql
-- Migration: Convert group_name to English codes
UPDATE service_types SET group_name = 'engine_oil' WHERE group_name = 'موتور و روغن';
UPDATE service_types SET group_name = 'brakes_safety' WHERE group_name = 'ترمز و ایمنی';
-- ... و غیره
```

### 2. به‌روزرسانی Store
- در `serviceType.js`: تغییر کلید i18n از `services.selectType.categories.${group_name}` به `services.selectType.categoryGroups.${group_name}`
- در `expenseCategory.js`: تغییر کلید i18n از `expenses.categoryGroups.${group_name}` به `expenses.categoryGroups.${group_name}`

### 3. به‌روزرسانی i18n Files
- اضافه کردن کلیدهای جدید در `fa.json`, `en.json`, `ar.json`:
```json
{
  "services": {
    "selectType": {
      "categoryGroups": {
        "engine_oil": "موتور و روغن",
        "brakes_safety": "ترمز و ایمنی",
        ...
      }
    }
  }
}
```

### 4. تست
- تست تغییر زبان
- تست نمایش گروه‌ها
- تست فیلتر بر اساس گروه

## فایل‌های نیازمند تغییر
- `supabase/migrations/006_convert_group_names_to_codes.sql` (جدید)
- `frontend-vue/src/stores/serviceType.js`
- `frontend-vue/src/stores/expenseCategory.js`
- `frontend-vue/src/locales/fa.json`
- `frontend-vue/src/locales/en.json`
- `frontend-vue/src/locales/ar.json`

## تاریخ هدف
- **اولویت**: متوسط
- **زمان تخمینی**: 2-3 ساعت
- **وابستگی**: ندارد

