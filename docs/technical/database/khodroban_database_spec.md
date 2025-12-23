# مستندات ساختار دیتابیس KhodroBan (خودروبان)

**نام دیتابیس:** khodroban_db
**نسخه:** 1.0 (MVP)
**تاریخ آخرین به‌روزرسانی:** ۲۴ آذر ۱۴۰۴
**توضیح کلی دیتابیس:** دیتابیس وب‌اپلیکیشن KhodroBan (خودروبان) برای مدیریت خودرو، ثبت سوابق سرویس، هزینه‌های روزانه و یادآوری‌های دو معیاری (زمان/کیلومتر). این دیتابیس از مدل فریمیوم (Free/Pro) پشتیبانی می‌کند.

---

## جداول

### Users

**توضیح مختصر جدول:** ذخیره اطلاعات کاربران سیستم شامل احراز هویت و پروفایل پایه

#### فیلدها

| نام انگلیسی فیلد | نام فارسی فیلد | اجباری/اختیاری | نوع داده | اندازه | کلید اصلی (PK) | کلید خارجی (FK) | پیش‌فرض | توضیحات |
| ------------------------------ | -------------------------- | --------------------------- | --------------- | ------------ | ---------------------- | ------------------------ | ----------------- | -------------------------------------------- |
| user_id                        | شناسه کاربر      | اجباری                | SERIAL/BIGINT   | -            | بله                 | -                        | AUTO_INCREMENT    | شناسه یکتای کاربر             |
| email                          | ایمیل                 | اجباری                | VARCHAR         | 255          | خیر                 | -                        | -                 | ایمیل کاربر (برای ورود)        |
| password_hash                  | هش پسورد        | اجباری                | VARCHAR         | 255          | خیر                 | -                        | -                 | پسورد رمزنگاری شده (bcrypt/argon2) |
| first_name                     | نام                 | اختیاری                | VARCHAR         | 100          | خیر                 | -                        | NULL              | نام کاربر                        |
| last_name                      | نام خانوادگی    | اختیاری                | VARCHAR         | 100          | خیر                 | -                        | NULL              | نام خانوادگی کاربر             |
| is_active                      | فعال/غیرفعال    | اجباری                | BOOLEAN         | -            | خیر                 | -                        | TRUE              | وضعیت فعال بودن حساب کاربری    |
| is_email_verified               | تأیید ایمیل      | اجباری                | BOOLEAN         | -            | خیر                 | -                        | FALSE             | وضعیت تأیید ایمیل              |
| created_at                     | تاریخ ایجاد      | اجباری                | TIMESTAMP       | -            | خیر                 | -                        | CURRENT_TIMESTAMP | تاریخ و زمان ثبت‌نام           |
| updated_at                     | تاریخ به‌روزرسانی | اجباری                | TIMESTAMP       | -            | خیر                 | -                        | CURRENT_TIMESTAMP | تاریخ و زمان آخرین به‌روزرسانی |
| last_login                     | آخرین ورود       | اختیاری                | TIMESTAMP       | -            | خیر                 | -                        | NULL              | تاریخ و زمان آخرین ورود موفق   |

#### روابط جدول

- **یک به چند (One-to-Many):** 
  - این جدول با جدول `Vehicles` رابطه یک به چند دارد (یک کاربر می‌تواند چندین خودرو داشته باشد)
  - این جدول با جدول `Services` رابطه یک به چند دارد (از طریق Vehicles)
  - این جدول با جدول `DailyExpenses` رابطه یک به چند دارد (از طریق Vehicles)
  - این جدول با جدول `ReminderSettings` رابطه یک به چند دارد (یک کاربر می‌تواند تنظیمات یادآوری برای خودروهای مختلف داشته باشد)
  - این جدول با جدول `UserSubscriptions` رابطه یک به چند دارد

#### ایندکس‌ها

- PRIMARY KEY روی `user_id`
- UNIQUE INDEX روی `email`
- INDEX روی `created_at` (برای گزارش‌گیری)
- INDEX روی `is_active` (برای فیلتر کاربران فعال)

---

### Vehicles

**توضیح مختصر جدول:** ذخیره اطلاعات خودروهای ثبت‌شده توسط کاربران

#### فیلدها

| نام انگلیسی فیلد | نام فارسی فیلد | اجباری/اختیاری | نوع داده | اندازه | کلید اصلی (PK) | کلید خارجی (FK) | پیش‌فرض | توضیحات |
| ------------------------------ | -------------------------- | --------------------------- | --------------- | ------------ | ---------------------- | ------------------------ | ----------------- | -------------------------------------------- |
| vehicle_id                     | شناسه خودرو      | اجباری                | SERIAL/BIGINT   | -            | بله                 | -                        | AUTO_INCREMENT    | شناسه یکتای خودرو             |
| user_id                        | شناسه کاربر      | اجباری                | BIGINT          | -            | خیر                 | Users.user_id (ON DELETE CASCADE) | -                 | شناسه کاربر مالک خودرو        |
| model                          | مدل خودرو        | اجباری                | VARCHAR         | 100          | خیر                 | -                        | -                 | مدل خودرو (مثلاً پژو ۲۰۶)      |
| year                           | سال ساخت         | اجباری                | INTEGER         | 4            | خیر                 | -                        | -                 | سال ساخت خودرو (مثلاً ۱۳۹۵)    |
| plate_number                   | شماره پلاک       | اجباری                | VARCHAR         | 20           | خیر                 | -                        | -                 | شماره پلاک خودرو              |
| current_km                     | کیلومتر فعلی     | اجباری                | INTEGER         | -            | خیر                 | -                        | 0                 | کیلومتر فعلی خودرو            |
| description                    | توضیحات          | اختیاری                | TEXT            | -            | خیر                 | -                        | NULL              | توضیحات اضافی درباره خودرو     |
| created_at                     | تاریخ ایجاد      | اجباری                | TIMESTAMP       | -            | خیر                 | -                        | CURRENT_TIMESTAMP | تاریخ و زمان ثبت خودرو         |
| updated_at                     | تاریخ به‌روزرسانی | اجباری                | TIMESTAMP       | -            | خیر                 | -                        | CURRENT_TIMESTAMP | تاریخ و زمان آخرین به‌روزرسانی |

#### روابط جدول

- **چند به یک (Many-to-One):** این جدول به جدول `Users` از طریق `user_id` متصل است
- **یک به چند (One-to-Many):** 
  - این جدول با جدول `Services` رابطه یک به چند دارد (یک خودرو می‌تواند چندین سرویس داشته باشد)
  - این جدول با جدول `DailyExpenses` رابطه یک به چند دارد (یک خودرو می‌تواند چندین هزینه روزانه داشته باشد)
  - این جدول با جدول `ReminderSettings` رابطه یک به چند دارد (یک خودرو می‌تواند تنظیمات یادآوری داشته باشد)

#### ایندکس‌ها

- PRIMARY KEY روی `vehicle_id`
- INDEX روی `user_id` (برای جستجوی سریع خودروهای یک کاربر)
- INDEX روی `current_km` (برای محاسبه یادآوری‌ها)
- INDEX ترکیبی روی `(user_id, plate_number)` (برای اطمینان از یکتایی پلاک در هر کاربر)

---

### Services

**توضیح مختصر جدول:** ذخیره سوابق سرویس و تعویض روغن خودروها

#### فیلدها

| نام انگلیسی فیلد | نام فارسی فیلد | اجباری/اختیاری | نوع داده | اندازه | کلید اصلی (PK) | کلید خارجی (FK) | پیش‌فرض | توضیحات |
| ------------------------------ | -------------------------- | --------------------------- | --------------- | ------------ | ---------------------- | ------------------------ | ----------------- | -------------------------------------------- |
| service_id                      | شناسه سرویس      | اجباری                | SERIAL/BIGINT   | -            | بله                 | -                        | AUTO_INCREMENT    | شناسه یکتای سرویس             |
| vehicle_id                     | شناسه خودرو      | اجباری                | BIGINT          | -            | خیر                 | Vehicles.vehicle_id (ON DELETE CASCADE) | -                 | شناسه خودروی مربوطه          |
| service_date                   | تاریخ سرویس      | اجباری                | DATE            | -            | خیر                 | -                        | -                 | تاریخ انجام سرویس (شمسی)      |
| service_date_gregorian         | تاریخ میلادی     | اجباری                | DATE            | -            | خیر                 | -                        | -                 | تاریخ انجام سرویس (میلادی برای محاسبات) |
| service_km                      | کیلومتر سرویس    | اجباری                | INTEGER         | -            | خیر                 | -                        | -                 | کیلومتر خودرو در زمان سرویس   |
| cost                           | هزینه (تومان)    | اجباری                | BIGINT          | -            | خیر                 | -                        | 0                 | هزینه سرویس به تومان          |
| service_type                   | نوع سرویس        | اجباری                | VARCHAR         | 50           | خیر                 | -                        | 'oil_change'      | نوع سرویس (oil_change, general, ...) |
| description                    | توضیحات          | اختیاری                | TEXT            | -            | خیر                 | -                        | NULL              | توضیحات اضافی درباره سرویس     |
| created_at                     | تاریخ ایجاد      | اجباری                | TIMESTAMP       | -            | خیر                 | -                        | CURRENT_TIMESTAMP | تاریخ و زمان ثبت سرویس         |
| updated_at                     | تاریخ به‌روزرسانی | اجباری                | TIMESTAMP       | -            | خیر                 | -                        | CURRENT_TIMESTAMP | تاریخ و زمان آخرین به‌روزرسانی |

#### روابط جدول

- **چند به یک (Many-to-One):** این جدول به جدول `Vehicles` از طریق `vehicle_id` متصل است

#### ایندکس‌ها

- PRIMARY KEY روی `service_id`
- INDEX روی `vehicle_id` (برای جستجوی سریع سرویس‌های یک خودرو)
- INDEX روی `service_date_gregorian` (برای مرتب‌سازی و فیلتر بر اساس تاریخ)
- INDEX روی `service_km` (برای محاسبه یادآوری‌ها)
- INDEX ترکیبی روی `(vehicle_id, service_date_gregorian DESC)` (برای دریافت آخرین سرویس)

---

### DailyExpenses

**توضیح مختصر جدول:** ذخیره هزینه‌های روزانه خودرو (سوخت، کارواش، پارکینگ، عوارض، تعمیر جزئی و ...)

#### فیلدها

| نام انگلیسی فیلد | نام فارسی فیلد | اجباری/اختیاری | نوع داده | اندازه | کلید اصلی (PK) | کلید خارجی (FK) | پیش‌فرض | توضیحات |
| ------------------------------ | -------------------------- | --------------------------- | --------------- | ------------ | ---------------------- | ------------------------ | ----------------- | -------------------------------------------- |
| expense_id                     | شناسه هزینه      | اجباری                | SERIAL/BIGINT   | -            | بله                 | -                        | AUTO_INCREMENT    | شناسه یکتای هزینه             |
| vehicle_id                     | شناسه خودرو      | اجباری                | BIGINT          | -            | خیر                 | Vehicles.vehicle_id (ON DELETE CASCADE) | -                 | شناسه خودروی مربوطه          |
| expense_date                   | تاریخ هزینه      | اجباری                | DATE            | -            | خیر                 | -                        | -                 | تاریخ هزینه (شمسی)            |
| expense_date_gregorian         | تاریخ میلادی     | اجباری                | DATE            | -            | خیر                 | -                        | -                 | تاریخ هزینه (میلادی برای محاسبات) |
| amount                         | مبلغ (تومان)     | اجباری                | BIGINT          | -            | خیر                 | -                        | -                 | مبلغ هزینه به تومان           |
| category                       | دسته‌بندی        | اجباری                | VARCHAR         | 50           | خیر                 | -                        | -                 | دسته‌بندی: fuel, carwash, parking, toll, repair, other |
| km_at_expense                  | کیلومتر در زمان هزینه | اختیاری                | INTEGER         | -            | خیر                 | -                        | NULL              | کیلومتر خودرو در زمان ثبت هزینه |
| description                    | توضیحات          | اختیاری                | TEXT            | -            | خیر                 | -                        | NULL              | توضیحات اضافی درباره هزینه     |
| created_at                     | تاریخ ایجاد      | اجباری                | TIMESTAMP       | -            | خیر                 | -                        | CURRENT_TIMESTAMP | تاریخ و زمان ثبت هزینه         |
| updated_at                     | تاریخ به‌روزرسانی | اجباری                | TIMESTAMP       | -            | خیر                 | -                        | CURRENT_TIMESTAMP | تاریخ و زمان آخرین به‌روزرسانی |

#### روابط جدول

- **چند به یک (Many-to-One):** این جدول به جدول `Vehicles` از طریق `vehicle_id` متصل است

#### ایندکس‌ها

- PRIMARY KEY روی `expense_id`
- INDEX روی `vehicle_id` (برای جستجوی سریع هزینه‌های یک خودرو)
- INDEX روی `expense_date_gregorian` (برای مرتب‌سازی و فیلتر بر اساس تاریخ)
- INDEX روی `category` (برای فیلتر بر اساس دسته‌بندی)
- INDEX ترکیبی روی `(vehicle_id, expense_date_gregorian DESC)` (برای گزارش‌گیری)

---

### ReminderSettings

**توضیح مختصر جدول:** ذخیره تنظیمات یادآوری برای هر خودرو (فاصله کیلومتر، فاصله زمانی، روزهای هشدار)

#### فیلدها

| نام انگلیسی فیلد | نام فارسی فیلد | اجباری/اختیاری | نوع داده | اندازه | کلید اصلی (PK) | کلید خارجی (FK) | پیش‌فرض | توضیحات |
| ------------------------------ | -------------------------- | --------------------------- | --------------- | ------------ | ---------------------- | ------------------------ | ----------------- | -------------------------------------------- |
| reminder_setting_id            | شناسه تنظیمات    | اجباری                | SERIAL/BIGINT   | -            | بله                 | -                        | AUTO_INCREMENT    | شناسه یکتای تنظیمات           |
| vehicle_id                     | شناسه خودرو      | اجباری                | BIGINT          | -            | خیر                 | Vehicles.vehicle_id (ON DELETE CASCADE) | -                 | شناسه خودروی مربوطه          |
| interval_km                    | فاصله کیلومتر     | اجباری                | INTEGER         | -            | خیر                 | -                        | 5000              | فاصله کیلومتر برای یادآوری (مثلاً ۵۰۰۰) |
| interval_days                  | فاصله زمانی (روز) | اجباری                | INTEGER         | -            | خیر                 | -                        | 90                | فاصله زمانی برای یادآوری (مثلاً ۹۰ روز = ۳ ماه) |
| warning_days_before            | روزهای هشدار قبل از موعد | اجباری                | INTEGER         | -            | خیر                 | -                        | 7                 | تعداد روزهای قبل از موعد برای هشدار |
| warning_km_before              | کیلومتر هشدار قبل از موعد | اجباری                | INTEGER         | -            | خیر                 | -                        | 500               | تعداد کیلومتر قبل از موعد برای هشدار |
| enable_email_reminder          | فعال بودن یادآوری ایمیل | اجباری                | BOOLEAN         | -            | خیر                 | -                        | TRUE              | فعال/غیرفعال بودن یادآوری از طریق ایمیل |
| enable_sms_reminder            | فعال بودن یادآوری SMS | اجباری                | BOOLEAN         | -            | خیر                 | -                        | FALSE             | فعال/غیرفعال بودن یادآوری از طریق SMS (Pro) |
| created_at                     | تاریخ ایجاد      | اجباری                | TIMESTAMP       | -            | خیر                 | -                        | CURRENT_TIMESTAMP | تاریخ و زمان ایجاد تنظیمات     |
| updated_at                     | تاریخ به‌روزرسانی | اجباری                | TIMESTAMP       | -            | خیر                 | -                        | CURRENT_TIMESTAMP | تاریخ و زمان آخرین به‌روزرسانی |

#### روابط جدول

- **چند به یک (Many-to-One):** این جدول به جدول `Vehicles` از طریق `vehicle_id` متصل است

#### ایندکس‌ها

- PRIMARY KEY روی `reminder_setting_id`
- UNIQUE INDEX روی `vehicle_id` (هر خودرو فقط یک تنظیمات یادآوری دارد)
- INDEX روی `enable_email_reminder` (برای فیلتر یادآوری‌های فعال)

---

### SubscriptionPlans

**توضیح مختصر جدول:** ذخیره اطلاعات پلن‌های اشتراک (Free و Pro)

#### فیلدها

| نام انگلیسی فیلد | نام فارسی فیلد | اجباری/اختیاری | نوع داده | اندازه | کلید اصلی (PK) | کلید خارجی (FK) | پیش‌فرض | توضیحات |
| ------------------------------ | -------------------------- | --------------------------- | --------------- | ------------ | ---------------------- | ------------------------ | ----------------- | -------------------------------------------- |
| plan_id                        | شناسه پلن          | اجباری                | SERIAL/BIGINT   | -            | بله                 | -                        | AUTO_INCREMENT    | شناسه یکتای پلن               |
| plan_code                      | کد پلن            | اجباری                | VARCHAR         | 20           | خیر                 | -                        | -                 | کد پلن (free, pro)             |
| plan_name                      | نام پلن            | اجباری                | VARCHAR         | 100          | خیر                 | -                        | -                 | نام پلن (رایگان، حرفه‌ای)      |
| max_vehicles                   | حداکثر تعداد خودرو | اجباری                | INTEGER         | -            | خیر                 | -                        | -                 | حداکثر تعداد خودرو (NULL = نامحدود) |
| allow_csv_export               | اجازه خروجی CSV   | اجباری                | BOOLEAN         | -            | خیر                 | -                        | -                 | اجازه خروجی CSV                |
| allow_pdf_export               | اجازه خروجی PDF   | اجباری                | BOOLEAN         | -            | خیر                 | -                        | -                 | اجازه خروجی PDF (Pro)          |
| allow_sms_reminder             | اجازه یادآوری SMS | اجباری                | BOOLEAN         | -            | خیر                 | -                        | -                 | اجازه یادآوری SMS (Pro)        |
| monthly_price                  | قیمت ماهانه (تومان) | اختیاری                | BIGINT          | -            | خیر                 | -                        | NULL              | قیمت ماهانه پلن (NULL = رایگان) |
| is_active                      | فعال/غیرفعال      | اجباری                | BOOLEAN         | -            | خیر                 | -                        | TRUE              | وضعیت فعال بودن پلن           |
| created_at                     | تاریخ ایجاد      | اجباری                | TIMESTAMP       | -            | خیر                 | -                        | CURRENT_TIMESTAMP | تاریخ و زمان ایجاد پلن         |
| updated_at                     | تاریخ به‌روزرسانی | اجباری                | TIMESTAMP       | -            | خیر                 | -                        | CURRENT_TIMESTAMP | تاریخ و زمان آخرین به‌روزرسانی |

#### روابط جدول

- **یک به چند (One-to-Many):** این جدول با جدول `UserSubscriptions` رابطه یک به چند دارد

#### ایندکس‌ها

- PRIMARY KEY روی `plan_id`
- UNIQUE INDEX روی `plan_code`
- INDEX روی `is_active` (برای فیلتر پلن‌های فعال)

---

### UserSubscriptions

**توضیح مختصر جدول:** ذخیره اشتراک‌های کاربران و تاریخ شروع/پایان

#### فیلدها

| نام انگلیسی فیلد | نام فارسی فیلد | اجباری/اختیاری | نوع داده | اندازه | کلید اصلی (PK) | کلید خارجی (FK) | پیش‌فرض | توضیحات |
| ------------------------------ | -------------------------- | --------------------------- | --------------- | ------------ | ---------------------- | ------------------------ | ----------------- | -------------------------------------------- |
| subscription_id                 | شناسه اشتراک      | اجباری                | SERIAL/BIGINT   | -            | بله                 | -                        | AUTO_INCREMENT    | شناسه یکتای اشتراک            |
| user_id                        | شناسه کاربر      | اجباری                | BIGINT          | -            | خیر                 | Users.user_id (ON DELETE CASCADE) | -                 | شناسه کاربر                   |
| plan_id                        | شناسه پلن          | اجباری                | BIGINT          | -            | خیر                 | SubscriptionPlans.plan_id (ON DELETE RESTRICT) | -                 | شناسه پلن اشتراک              |
| start_date                     | تاریخ شروع        | اجباری                | DATE            | -            | خیر                 | -                        | CURRENT_DATE      | تاریخ شروع اشتراک             |
| end_date                       | تاریخ پایان        | اختیاری                | DATE            | -            | خیر                 | -                        | NULL              | تاریخ پایان اشتراک (NULL = نامحدود) |
| is_active                      | فعال/غیرفعال      | اجباری                | BOOLEAN         | -            | خیر                 | -                        | TRUE              | وضعیت فعال بودن اشتراک         |
| auto_renew                     | تمدید خودکار      | اجباری                | BOOLEAN         | -            | خیر                 | -                        | FALSE             | تمدید خودکار اشتراک           |
| created_at                     | تاریخ ایجاد      | اجباری                | TIMESTAMP       | -            | خیر                 | -                        | CURRENT_TIMESTAMP | تاریخ و زمان ثبت اشتراک         |
| updated_at                     | تاریخ به‌روزرسانی | اجباری                | TIMESTAMP       | -            | خیر                 | -                        | CURRENT_TIMESTAMP | تاریخ و زمان آخرین به‌روزرسانی |

#### روابط جدول

- **چند به یک (Many-to-One):** 
  - این جدول به جدول `Users` از طریق `user_id` متصل است
  - این جدول به جدول `SubscriptionPlans` از طریق `plan_id` متصل است

#### ایندکس‌ها

- PRIMARY KEY روی `subscription_id`
- INDEX روی `user_id` (برای جستجوی سریع اشتراک‌های یک کاربر)
- INDEX روی `plan_id` (برای گزارش‌گیری)
- INDEX روی `is_active` (برای فیلتر اشتراک‌های فعال)
- INDEX ترکیبی روی `(user_id, is_active, end_date)` (برای بررسی اشتراک فعال کاربر)

---

### ReminderLogs

**توضیح مختصر جدول:** ذخیره لاگ یادآوری‌های ارسال‌شده (برای جلوگیری از ارسال تکراری و گزارش‌گیری)

#### فیلدها

| نام انگلیسی فیلد | نام فارسی فیلد | اجباری/اختیاری | نوع داده | اندازه | کلید اصلی (PK) | کلید خارجی (FK) | پیش‌فرض | توضیحات |
| ------------------------------ | -------------------------- | --------------------------- | --------------- | ------------ | ---------------------- | ------------------------ | ----------------- | -------------------------------------------- |
| reminder_log_id                | شناسه لاگ          | اجباری                | SERIAL/BIGINT   | -            | بله                 | -                        | AUTO_INCREMENT    | شناسه یکتای لاگ               |
| vehicle_id                     | شناسه خودرو      | اجباری                | BIGINT          | -            | خیر                 | Vehicles.vehicle_id (ON DELETE CASCADE) | -                 | شناسه خودروی مربوطه          |
| reminder_type                  | نوع یادآوری      | اجباری                | VARCHAR         | 20           | خیر                 | -                        | -                 | نوع: in_app, email, sms       |
| reminder_status                | وضعیت یادآوری    | اجباری                | VARCHAR         | 20           | خیر                 | -                        | -                 | وضعیت: pending, sent, failed  |
| due_date                       | تاریخ موعد        | اجباری                | DATE            | -            | خیر                 | -                        | -                 | تاریخ موعد سرویس              |
| due_km                         | کیلومتر موعد      | اجباری                | INTEGER         | -            | خیر                 | -                        | -                 | کیلومتر موعد سرویس            |
| sent_at                        | تاریخ ارسال       | اختیاری                | TIMESTAMP       | -            | خیر                 | -                        | NULL              | تاریخ و زمان ارسال یادآوری     |
| error_message                  | پیام خطا          | اختیاری                | TEXT            | -            | خیر                 | -                        | NULL              | پیام خطا در صورت عدم ارسال موفق |
| created_at                     | تاریخ ایجاد      | اجباری                | TIMESTAMP       | -            | خیر                 | -                        | CURRENT_TIMESTAMP | تاریخ و زمان ایجاد لاگ         |

#### روابط جدول

- **چند به یک (Many-to-One):** این جدول به جدول `Vehicles` از طریق `vehicle_id` متصل است

#### ایندکس‌ها

- PRIMARY KEY روی `reminder_log_id`
- INDEX روی `vehicle_id` (برای جستجوی لاگ‌های یک خودرو)
- INDEX روی `reminder_status` (برای فیلتر یادآوری‌های ارسال‌شده)
- INDEX روی `sent_at` (برای گزارش‌گیری)
- INDEX ترکیبی روی `(vehicle_id, reminder_type, sent_at DESC)` (برای بررسی آخرین یادآوری)

---

## دیکشنری داده‌ها (Data Dictionary)

| نام جدول | ستون | نوع داده | طول | کلید اصلی/خارجی | مقادیر مجاز | توضیحات |
| --------------- | -------- | --------------- | ------ | ---------------------------- | --------------------- | -------------- |
| **Users** | user_id | SERIAL/BIGINT | - | PK (Auto Increment) | - | شناسه یکتای کاربر |
| | email | VARCHAR | 255 | UNIQUE, NOT NULL | ایمیل معتبر | ایمیل کاربر برای ورود |
| | password_hash | VARCHAR | 255 | NOT NULL | - | پسورد رمزنگاری شده |
| | first_name | VARCHAR | 100 | NULL | - | نام کاربر |
| | last_name | VARCHAR | 100 | NULL | - | نام خانوادگی کاربر |
| | is_active | BOOLEAN | - | NOT NULL, DEFAULT TRUE | TRUE/FALSE | وضعیت فعال بودن حساب |
| | is_email_verified | BOOLEAN | - | NOT NULL, DEFAULT FALSE | TRUE/FALSE | وضعیت تأیید ایمیل |
| | created_at | TIMESTAMP | - | NOT NULL, DEFAULT CURRENT_TIMESTAMP | - | تاریخ ایجاد |
| | updated_at | TIMESTAMP | - | NOT NULL, DEFAULT CURRENT_TIMESTAMP | - | تاریخ به‌روزرسانی |
| | last_login | TIMESTAMP | - | NULL | - | آخرین ورود موفق |
| **Vehicles** | vehicle_id | SERIAL/BIGINT | - | PK (Auto Increment) | - | شناسه یکتای خودرو |
| | user_id | BIGINT | - | FK → Users.user_id (ON DELETE CASCADE), NOT NULL | - | شناسه کاربر مالک |
| | model | VARCHAR | 100 | NOT NULL | - | مدل خودرو |
| | year | INTEGER | 4 | NOT NULL | 1300-1500 (شمسی) | سال ساخت |
| | plate_number | VARCHAR | 20 | NOT NULL | - | شماره پلاک |
| | current_km | INTEGER | - | NOT NULL, DEFAULT 0 | >= 0 | کیلومتر فعلی |
| | description | TEXT | - | NULL | - | توضیحات اضافی |
| | created_at | TIMESTAMP | - | NOT NULL, DEFAULT CURRENT_TIMESTAMP | - | تاریخ ایجاد |
| | updated_at | TIMESTAMP | - | NOT NULL, DEFAULT CURRENT_TIMESTAMP | - | تاریخ به‌روزرسانی |
| **Services** | service_id | SERIAL/BIGINT | - | PK (Auto Increment) | - | شناسه یکتای سرویس |
| | vehicle_id | BIGINT | - | FK → Vehicles.vehicle_id (ON DELETE CASCADE), NOT NULL | - | شناسه خودرو |
| | service_date | DATE | - | NOT NULL | تاریخ شمسی معتبر | تاریخ سرویس (شمسی) |
| | service_date_gregorian | DATE | - | NOT NULL | تاریخ میلادی معتبر | تاریخ سرویس (میلادی) |
| | service_km | INTEGER | - | NOT NULL | >= 0 | کیلومتر در زمان سرویس |
| | cost | BIGINT | - | NOT NULL, DEFAULT 0 | >= 0 | هزینه به تومان |
| | service_type | VARCHAR | 50 | NOT NULL, DEFAULT 'oil_change' | oil_change, general, ... | نوع سرویس |
| | description | TEXT | - | NULL | - | توضیحات اضافی |
| | created_at | TIMESTAMP | - | NOT NULL, DEFAULT CURRENT_TIMESTAMP | - | تاریخ ایجاد |
| | updated_at | TIMESTAMP | - | NOT NULL, DEFAULT CURRENT_TIMESTAMP | - | تاریخ به‌روزرسانی |
| **DailyExpenses** | expense_id | SERIAL/BIGINT | - | PK (Auto Increment) | - | شناسه یکتای هزینه |
| | vehicle_id | BIGINT | - | FK → Vehicles.vehicle_id (ON DELETE CASCADE), NOT NULL | - | شناسه خودرو |
| | expense_date | DATE | - | NOT NULL | تاریخ شمسی معتبر | تاریخ هزینه (شمسی) |
| | expense_date_gregorian | DATE | - | NOT NULL | تاریخ میلادی معتبر | تاریخ هزینه (میلادی) |
| | amount | BIGINT | - | NOT NULL | > 0 | مبلغ به تومان |
| | category | VARCHAR | 50 | NOT NULL | fuel, carwash, parking, toll, repair, other | دسته‌بندی هزینه |
| | km_at_expense | INTEGER | - | NULL | >= 0 | کیلومتر در زمان هزینه |
| | description | TEXT | - | NULL | - | توضیحات اضافی |
| | created_at | TIMESTAMP | - | NOT NULL, DEFAULT CURRENT_TIMESTAMP | - | تاریخ ایجاد |
| | updated_at | TIMESTAMP | - | NOT NULL, DEFAULT CURRENT_TIMESTAMP | - | تاریخ به‌روزرسانی |
| **ReminderSettings** | reminder_setting_id | SERIAL/BIGINT | - | PK (Auto Increment) | - | شناسه یکتای تنظیمات |
| | vehicle_id | BIGINT | - | FK → Vehicles.vehicle_id (ON DELETE CASCADE), UNIQUE, NOT NULL | - | شناسه خودرو |
| | interval_km | INTEGER | - | NOT NULL, DEFAULT 5000 | > 0 | فاصله کیلومتر |
| | interval_days | INTEGER | - | NOT NULL, DEFAULT 90 | > 0 | فاصله زمانی (روز) |
| | warning_days_before | INTEGER | - | NOT NULL, DEFAULT 7 | >= 0 | روزهای هشدار قبل از موعد |
| | warning_km_before | INTEGER | - | NOT NULL, DEFAULT 500 | >= 0 | کیلومتر هشدار قبل از موعد |
| | enable_email_reminder | BOOLEAN | - | NOT NULL, DEFAULT TRUE | TRUE/FALSE | فعال بودن یادآوری ایمیل |
| | enable_sms_reminder | BOOLEAN | - | NOT NULL, DEFAULT FALSE | TRUE/FALSE | فعال بودن یادآوری SMS |
| | created_at | TIMESTAMP | - | NOT NULL, DEFAULT CURRENT_TIMESTAMP | - | تاریخ ایجاد |
| | updated_at | TIMESTAMP | - | NOT NULL, DEFAULT CURRENT_TIMESTAMP | - | تاریخ به‌روزرسانی |
| **SubscriptionPlans** | plan_id | SERIAL/BIGINT | - | PK (Auto Increment) | - | شناسه یکتای پلن |
| | plan_code | VARCHAR | 20 | UNIQUE, NOT NULL | free, pro | کد پلن |
| | plan_name | VARCHAR | 100 | NOT NULL | - | نام پلن |
| | max_vehicles | INTEGER | - | NULL | NULL یا > 0 | حداکثر تعداد خودرو |
| | allow_csv_export | BOOLEAN | - | NOT NULL | TRUE/FALSE | اجازه خروجی CSV |
| | allow_pdf_export | BOOLEAN | - | NOT NULL | TRUE/FALSE | اجازه خروجی PDF |
| | allow_sms_reminder | BOOLEAN | - | NOT NULL | TRUE/FALSE | اجازه یادآوری SMS |
| | monthly_price | BIGINT | - | NULL | NULL یا >= 0 | قیمت ماهانه (تومان) |
| | is_active | BOOLEAN | - | NOT NULL, DEFAULT TRUE | TRUE/FALSE | وضعیت فعال بودن |
| | created_at | TIMESTAMP | - | NOT NULL, DEFAULT CURRENT_TIMESTAMP | - | تاریخ ایجاد |
| | updated_at | TIMESTAMP | - | NOT NULL, DEFAULT CURRENT_TIMESTAMP | - | تاریخ به‌روزرسانی |
| **UserSubscriptions** | subscription_id | SERIAL/BIGINT | - | PK (Auto Increment) | - | شناسه یکتای اشتراک |
| | user_id | BIGINT | - | FK → Users.user_id (ON DELETE CASCADE), NOT NULL | - | شناسه کاربر |
| | plan_id | BIGINT | - | FK → SubscriptionPlans.plan_id (ON DELETE RESTRICT), NOT NULL | - | شناسه پلن |
| | start_date | DATE | - | NOT NULL, DEFAULT CURRENT_DATE | تاریخ معتبر | تاریخ شروع |
| | end_date | DATE | - | NULL | تاریخ معتبر یا NULL | تاریخ پایان |
| | is_active | BOOLEAN | - | NOT NULL, DEFAULT TRUE | TRUE/FALSE | وضعیت فعال بودن |
| | auto_renew | BOOLEAN | - | NOT NULL, DEFAULT FALSE | TRUE/FALSE | تمدید خودکار |
| | created_at | TIMESTAMP | - | NOT NULL, DEFAULT CURRENT_TIMESTAMP | - | تاریخ ایجاد |
| | updated_at | TIMESTAMP | - | NOT NULL, DEFAULT CURRENT_TIMESTAMP | - | تاریخ به‌روزرسانی |
| **ReminderLogs** | reminder_log_id | SERIAL/BIGINT | - | PK (Auto Increment) | - | شناسه یکتای لاگ |
| | vehicle_id | BIGINT | - | FK → Vehicles.vehicle_id (ON DELETE CASCADE), NOT NULL | - | شناسه خودرو |
| | reminder_type | VARCHAR | 20 | NOT NULL | in_app, email, sms | نوع یادآوری |
| | reminder_status | VARCHAR | 20 | NOT NULL | pending, sent, failed | وضعیت یادآوری |
| | due_date | DATE | - | NOT NULL | تاریخ معتبر | تاریخ موعد |
| | due_km | INTEGER | - | NOT NULL | >= 0 | کیلومتر موعد |
| | sent_at | TIMESTAMP | - | NULL | - | تاریخ ارسال |
| | error_message | TEXT | - | NULL | - | پیام خطا |
| | created_at | TIMESTAMP | - | NOT NULL, DEFAULT CURRENT_TIMESTAMP | - | تاریخ ایجاد |

---

## روابط کلی دیتابیس

```
Users (1) ──→ (N) Vehicles
  │
  ├──→ (N) UserSubscriptions
  │
  └──→ (N) Services (از طریق Vehicles)
  └──→ (N) DailyExpenses (از طریق Vehicles)
  └──→ (N) ReminderSettings (از طریق Vehicles)
  └──→ (N) ReminderLogs (از طریق Vehicles)

Vehicles (1) ──→ (N) Services
Vehicles (1) ──→ (N) DailyExpenses
Vehicles (1) ──→ (1) ReminderSettings
Vehicles (1) ──→ (N) ReminderLogs

SubscriptionPlans (1) ──→ (N) UserSubscriptions
```

**توضیح روابط:**

1. **Users → Vehicles**: یک کاربر می‌تواند چندین خودرو داشته باشد. کلید خارجی: `Vehicles.user_id` → `Users.user_id` (ON DELETE CASCADE)

2. **Users → UserSubscriptions**: یک کاربر می‌تواند چندین اشتراک (تاریخی) داشته باشد. کلید خارجی: `UserSubscriptions.user_id` → `Users.user_id` (ON DELETE CASCADE)

3. **Vehicles → Services**: یک خودرو می‌تواند چندین سرویس داشته باشد. کلید خارجی: `Services.vehicle_id` → `Vehicles.vehicle_id` (ON DELETE CASCADE)

4. **Vehicles → DailyExpenses**: یک خودرو می‌تواند چندین هزینه روزانه داشته باشد. کلید خارجی: `DailyExpenses.vehicle_id` → `Vehicles.vehicle_id` (ON DELETE CASCADE)

5. **Vehicles → ReminderSettings**: هر خودرو فقط یک تنظیمات یادآوری دارد (رابطه یک به یک). کلید خارجی: `ReminderSettings.vehicle_id` → `Vehicles.vehicle_id` (ON DELETE CASCADE)

6. **Vehicles → ReminderLogs**: یک خودرو می‌تواند چندین لاگ یادآوری داشته باشد. کلید خارجی: `ReminderLogs.vehicle_id` → `Vehicles.vehicle_id` (ON DELETE CASCADE)

7. **SubscriptionPlans → UserSubscriptions**: یک پلن می‌تواند در چندین اشتراک استفاده شود. کلید خارجی: `UserSubscriptions.plan_id` → `SubscriptionPlans.plan_id` (ON DELETE RESTRICT)

---

## محدودیت‌ها (Constraints)

### محدودیت‌های NOT NULL
- تمام فیلدهای اجباری در تمام جداول با NOT NULL تعریف شده‌اند

### محدودیت‌های UNIQUE
- `Users.email`: ایمیل باید یکتا باشد
- `Vehicles.(user_id, plate_number)`: شماره پلاک باید در هر کاربر یکتا باشد (می‌تواند در کاربران مختلف تکراری باشد)
- `ReminderSettings.vehicle_id`: هر خودرو فقط یک تنظیمات یادآوری دارد
- `SubscriptionPlans.plan_code`: کد پلن باید یکتا باشد

### محدودیت‌های CHECK
- `Vehicles.current_km >= 0`: کیلومتر فعلی نمی‌تواند منفی باشد
- `Vehicles.year BETWEEN 1300 AND 1500`: سال ساخت باید در بازه معقول شمسی باشد
- `Services.service_km >= 0`: کیلومتر سرویس نمی‌تواند منفی باشد
- `Services.cost >= 0`: هزینه سرویس نمی‌تواند منفی باشد
- `DailyExpenses.amount > 0`: مبلغ هزینه باید مثبت باشد
- `DailyExpenses.category IN ('fuel', 'carwash', 'parking', 'toll', 'repair', 'other')`: دسته‌بندی باید از مقادیر مجاز باشد
- `ReminderSettings.interval_km > 0`: فاصله کیلومتر باید مثبت باشد
- `ReminderSettings.interval_days > 0`: فاصله زمانی باید مثبت باشد
- `ReminderSettings.warning_days_before >= 0`: روزهای هشدار نمی‌تواند منفی باشد
- `ReminderSettings.warning_km_before >= 0`: کیلومتر هشدار نمی‌تواند منفی باشد
- `ReminderLogs.reminder_type IN ('in_app', 'email', 'sms')`: نوع یادآوری باید از مقادیر مجاز باشد
- `ReminderLogs.reminder_status IN ('pending', 'sent', 'failed')`: وضعیت یادآوری باید از مقادیر مجاز باشد

### محدودیت‌های FOREIGN KEY
- تمام کلیدهای خارجی با رفتار مناسب تعریف شده‌اند:
  - `ON DELETE CASCADE`: برای روابطی که با حذف والد، فرزند نیز باید حذف شود (مثل Vehicles → Services)
  - `ON DELETE RESTRICT`: برای روابطی که نباید اجازه حذف والد را بدهیم (مثل SubscriptionPlans → UserSubscriptions)

---

## رویه‌ها و توابع ذخیره‌شده (Stored Procedures & Functions)

| نام | نوع | پارامترها | خروجی | توضیحات |
| ------ | ------ | ------------------ | ---------- | -------------- |
| `sp_GetUserVehicles` | Procedure | @userId BIGINT | TABLE (لیست خودروها) | دریافت تمام خودروهای یک کاربر مشخص |
| `sp_GetVehicleServices` | Procedure | @vehicleId BIGINT | TABLE (لیست سرویس‌ها) | دریافت تمام سرویس‌های یک خودرو به ترتیب تاریخ نزولی |
| `sp_GetVehicleExpenses` | Procedure | @vehicleId BIGINT, @startDate DATE, @endDate DATE | TABLE (لیست هزینه‌ها) | دریافت هزینه‌های یک خودرو در بازه تاریخ مشخص |
| `sp_GetLastService` | Function | @vehicleId BIGINT | RECORD (service_date, service_km) | دریافت آخرین سرویس یک خودرو |
| `sp_CalculateNextServiceDue` | Function | @vehicleId BIGINT | RECORD (due_date, due_km, status) | محاسبه موعد سرویس بعدی و وضعیت (OK/نزدیک/گذشته) |
| `sp_GetActiveReminders` | Procedure | @userId BIGINT | TABLE (لیست یادآوری‌های فعال) | دریافت تمام یادآوری‌های فعال (نزدیک/گذشته از موعد) برای کاربر |
| `fn_GetUserActivePlan` | Function | @userId BIGINT | RECORD (plan_code, max_vehicles, ...) | دریافت پلن فعال کاربر |
| `fn_CheckVehicleLimit` | Function | @userId BIGINT | BOOLEAN | بررسی اینکه آیا کاربر می‌تواند خودرو جدید اضافه کند (بر اساس پلن) |

---

## نمایه‌ها (Views)

| نام ویو | جداول مرجع | هدف |
| ------------- | ------------------- | ------ |
| `vw_VehicleSummary` | Vehicles, Services, DailyExpenses | نمایش خلاصه هر خودرو شامل: کیلومتر فعلی، آخرین سرویس، تعداد سرویس‌ها، مجموع هزینه‌ها |
| `vw_UserDashboard` | Users, Vehicles, Services, ReminderSettings | نمایش داشبورد کاربر شامل: لیست خودروها با وضعیت یادآوری (OK/نزدیک/گذشته) |
| `vw_ServiceHistory` | Vehicles, Services | نمایش تاریخچه سرویس‌ها با اطلاعات خودرو |
| `vw_ExpenseReport` | Vehicles, DailyExpenses | نمایش گزارش هزینه‌ها با امکان فیلتر بر اساس خودرو، تاریخ و دسته‌بندی |
| `vw_ReminderStatus` | Vehicles, Services, ReminderSettings, ReminderLogs | نمایش وضعیت یادآوری‌ها برای هر خودرو با محاسبه موعد و وضعیت |

---

## امنیت و دسترسی‌ها (Security & Access)

| نقش کاربری | دسترسی به جداول | سطح دسترسی | توضیحات |
| ------------------- | ---------------------------- | ------------------- | -------------- |
| `admin` | تمام جداول | CRUD کامل + مدیریت نقش‌ها | دسترسی کامل به سیستم (برای مدیریت و پشتیبانی) |
| `user` | Users (خودش), Vehicles (خودش), Services (خودش), DailyExpenses (خودش), ReminderSettings (خودش), UserSubscriptions (خودش) | CRUD محدود به داده‌های خودش | کاربر فقط به داده‌های خودش دسترسی دارد (Row-Level Security) |
| `readonly` | تمام جداول (فقط خواندن) | Read-only | برای گزارش‌گیری و آنالیتیکس (بدون امکان تغییر) |

**نکات امنیتی:**

1. **Row-Level Security (RLS)**: کاربران فقط می‌توانند به داده‌های خودشان دسترسی داشته باشند. این محدودیت در سطح Application (Django) و در صورت نیاز در سطح Database (PostgreSQL RLS) پیاده‌سازی می‌شود.

2. **رمزنگاری پسورد**: پسوردها با الگوریتم‌های ایمن (bcrypt یا argon2) رمزنگاری می‌شوند و هرگز به صورت plain text ذخیره نمی‌شوند.

3. **Rate Limiting**: برای جلوگیری از حملات brute force، محدودیت نرخ برای لاگین و ثبت‌نام اعمال می‌شود.

4. **SQL Injection Prevention**: استفاده از Parameterized Queries و ORM Django برای جلوگیری از SQL Injection.

5. **XSS Prevention**: تمام ورودی‌های کاربر باید sanitize شوند.

---

## نکات اضافی

### تریگرها (Triggers)

- **به‌روزرسانی خودکار `updated_at`**: برای تمام جداول، یک تریگر تعریف می‌شود که هنگام UPDATE، فیلد `updated_at` را به‌روزرسانی می‌کند.

- **به‌روزرسانی `current_km` در Vehicles**: هنگام ثبت سرویس جدید، اگر `service_km` از `current_km` بیشتر باشد، `current_km` به‌روزرسانی می‌شود (اختیاری - می‌تواند در Application انجام شود).

- **ایجاد خودکار ReminderSettings**: هنگام ایجاد خودرو جدید، یک تنظیمات یادآوری پیش‌فرض ایجاد می‌شود (می‌تواند در Application انجام شود).

### گسترش‌پذیری

طراحی به گونه‌ای است که به راحتی بتوان ویژگی‌های زیر را اضافه کرد:

- **Notifications**: جدول برای ذخیره نوتیفیکیشن‌های داخل اپ
- **ServiceTemplates**: تمپلیت‌های آماده برای انواع سرویس‌ها
- **ServiceProviders**: مراکز ارائه خدمات (برای فاز ۳)
- **Appointments**: نوبت‌های رزرو شده (برای فاز ۳)
- **Invoices**: فاکتورهای دریافتی از مراکز (برای فاز ۳)
- **Reviews**: نظرات و امتیازدهی به مراکز (برای فاز ۳)
- **VehiclePhotos**: تصاویر خودروها
- **Documents**: اسناد مرتبط (بیمه، کارت خودرو و ...)

### پشتیبان‌گیری

- **بکاپ روزانه**: توصیه به بکاپ روزانه از تمام جداول اصلی
- **بکاپ قبل از Migration**: همیشه قبل از اجرای Migration‌ها، بکاپ گرفته شود
- **Retention Policy**: نگهداری بکاپ‌ها برای حداقل ۳۰ روز
- **Point-in-Time Recovery**: در صورت امکان، استفاده از Point-in-Time Recovery برای PostgreSQL

### بهینه‌سازی

- **Indexing Strategy**: ایندکس‌ها برای جستجوهای متداول (user_id, vehicle_id, تاریخ‌ها) تعریف شده‌اند
- **Partitioning**: در صورت رشد زیاد داده‌ها، می‌توان جداول بزرگ (Services, DailyExpenses, ReminderLogs) را بر اساس تاریخ Partition کرد
- **Archiving**: لاگ‌های قدیمی (ReminderLogs) می‌توانند به جداول آرشیو منتقل شوند

### Migration Strategy

- استفاده از Django Migrations برای مدیریت تغییرات Schema
- Version Control برای تمام Migration‌ها
- تست Migration‌ها در محیط Development قبل از Production

---

**تاریخ ایجاد:** ۲۴ آذر ۱۴۰۴  
**آخرین بازبینی:** ۲۴ آذر ۱۴۰۴  
**نسخه:** 1.0 (MVP)

