
# راهنمای کامل مدیریت Cron Jobs در Supabase با pg_cron

## مقدمه

Cron Jobs به شما اجازه می‌دهند تا وظایف مختلفی را به صورت خودکار و در زمان‌های مشخصی تکرار شوید. این قابلیت برای کارهایی مانند **ارسال یادآوری‌های روزانه**، **پاک‌سازی داده‌های قدیمی**، **生成 گزارش‌های دوره‌ای** و **بررسی وضعیت سرویس‌ها** بسیار کاربردی است.

در Supabase، این قابلیت از طریق افزونه `pg_cron` در دیتابیس PostgreSQL فراهم می‌شود. با ترکیب آن با افزونه `pg_net`، شما می‌توانید توابع Supabase Edge Functions خود را در زمان‌های مشخص فراخوانی کرده و یک سیستم خودکار کامل بسازید.

این راهنما به شما نشان می‌دهد که چگونه Cron Jobs را در پروژه Supabase خود مدیریت کنید.

---

## فهرست مطالب

1. [پیش‌نیازها](#۱-پیشنیازها)
2. [فعال‌سازی افزونه‌های مورد نیاز](#۲-فعالسازی-افزونههای-مورد-نیاز)
3. [منطق زمان‌بندی (Cron Syntax)](#۳-منطق-زمانبندی-cron-syntax)
4. [ایجاد یک Cron Job](#۴-ایجاد-یک-cron-job)
5. [مدیریت Cron Jobs (مشاهده، ویرایش، حذف)](#۵-مدیریت-cron-jobs-مشاهده-ویرایش-حذف)
6. [مکان اجرای دستورات](#۶-مکان-اجرای-دستورات)
7. [نکات مهم و عیب‌یابی](#۷-نکات-مهم-و-عیبیابی)
8. [برگه تقلب سریع](#۸-برگه-تقلب-سریع)

---

### ۱. پیش‌نیازها

* یک پروژه فعال در Supabase.
* دسترسی به SQL Editor در داشبورد Supabase یا استفاده از Supabase CLI.
* آشنایی اولیه با دستورات SQL.

---

### ۲. فعال‌سازی افزونه‌های مورد نیاز

قبل از ایجاد هر Cron Job، باید افزونه‌های `pg_cron` و `pg_net` را در پروژه خود فعال کنید. این کار فقط یک بار نیاز به انجام دارد.

به **SQL Editor** در داشبورد Supabase بروید و دستورات زیر را اجرا کنید:

```sql
-- فعال‌سازی افزونه زمان‌بندی Cron
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- فعال‌سازی افزونه ارسال درخواست‌های HTTP
CREATE EXTENSION IF NOT EXISTS pg_net;
```

---

### ۳. منطق زمان‌بندی (Cron Syntax)

زمان‌بندی در Cron با یک رشته متنی ۵ قسمتی تعریف می‌شود که هر بخش معرف یک واحد زمانی است.

```
* * * * *
│ │ │ │ │
│ │ │ │ └─── روز هفته (0 - 7) (0 و 7 = یکشنبه)
│ │ │ └───── ماه (1 - 12)
│ │ └─────── روز ماه (1 - 31)
│ └───────── ساعت (0 - 23)
└─────────── دقیقه (0 - 59)
```

**کاراکترهای ویژه:**

* `*` (ستاره): به معنی "هر مقدار" (مثلاً هر دقیقه، هر ساعت).
* `,` (کاما): برای جدا کردن چند مقدار (مثلاً `1,15` به معنی دقیقه ۱ و ۱۵).
* `-` (خط تیره): برای مشخص کردن یک محدوده (مثلاً `9-17` به معنی ساعت ۹ تا ۱۷).
* `/` (اسلش): برای مشخص کردن گام‌ها (مثلاً `*/10` به معنی "هر ۱۰ دقیقه").

**مثال‌های کاربردی:**

| زمان‌بندی | توضیح                                           |
| :----------------- | :--------------------------------------------------- |
| `* * * * *`      | هر دقیقه                                      |
| `*/5 * * * *`    | هر ۵ دقیقه                                   |
| `0 * * * *`      | هر ساعت، در دقیقه صفر               |
| `0 9 * * *`      | هر روز ساعت ۹:۰۰ صبح                  |
| `30 14 * * 1-5`  | از دوشنبه تا جمعه، ساعت ۱۴:۳۰ |
| `0 0 1 * *`      | اولین روز هر ماه، نیمه‌شب       |
| `0 0 * * 0`      | هر یکشنبه، نیمه‌شب                   |
| `0 6 1 * *`      | اولین روز هر ماه، ساعت ۶ صبح   |

> **نکته مهم:** زمان‌بندی `pg_cron` بر اساس **منطقه زمانی UTC** سرور دیتابیس شما عمل می‌کند. هنگام تنظیم زمان، این موضوع را در نظر بگیرید.

---

### ۴. ایجاد یک Cron Job

برای ایجاد یک job جدید، از تابع `cron.schedule()` استفاده می‌کنید. این تابع سه آرگومان می‌گیرد: نام job، زمان‌بندی و دستور SQL برای اجرا.

**مثال:** فرض کنید می‌خواهیم هر روز ساعت ۸:۳۰ صبح، Edge Function به نام `send-reminders` را فراخوانی کنیم تا یادآوری‌های آن روز را برای کاربران ارسال کند.

```sql
SELECT cron.schedule(
  'send-daily-reminders',  -- ۱. نام منحصر به فرد برای job
  '30 8 * * *',             -- ۲. زمان‌بندی: هر روز ساعت ۸:۳۰ صبح
  $$                         -- ۳. دستور SQL برای اجرا
    -- فراخوانی Edge Function با استفاده از pg_net
    SELECT net.http_post(
      url := 'https://<PROJECT_REF>.supabase.co/functions/v1/send-reminders',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'ANON_KEY')
      ),
      body := '{"source": "daily-cron-job"}'::jsonb
    );
  $$
);
```

**توضیح کد:**

1. **نام job:** `send-daily-reminders` یک نام یکتا برای شناسایی این job است.
2. **زمان‌بندی:** `'30 8 * * *'` مشخص می‌کند که job باید هر روز ساعت ۸:۳۰ (UTC) اجرا شود.
3. **دستور اجرایی:**
   * از `net.http_post` برای ارسال یک درخواست POST به Edge Function استفاده می‌کنیم.
   * **`url`**: آدرس تابع خود را جایگزین `<PROJECT_REF>` کنید.
   * **`headers`**: برای احراز هویت، یک توکن (مانند `ANON_KEY`) را به عنوان هدر ارسال می‌کنیم. **بهترین روش** این است که کلید را در Supabase Vault ذخیره کرده و آن را اینجا فراخوانی کنید.
   * **`body`**: یک بدنه JSON اختیاری برای ارسال به تابع.

---

### ۵. مدیریت Cron Jobs (مشاهده، ویرایش، حذف)

#### مشاهده تمام Jobها

برای دیدن لیست تمام Cron Jobs فعال و اطلاعات آن‌ها:

```sql
SELECT jobid, schedule, command, nodename, nodeport, database, username, active, jobname 
FROM cron.job;
```

#### ویرایش یک Cron Job

**ویرایش به معنای جایگزینی است.** برای تغییر زمان‌بندی یا دستور یک job، کافی است مجدداً تابع `cron.schedule()` را با **نام یکسان job قبلی** اجرا کنید. Supabase به طور خودکار job قدیمی را با اطلاعات جدید جایگزین می‌کند.

**مثال:** تغییر زمان `send-daily-reminders` به ساعت ۹ صبح:

```sql
SELECT cron.schedule(
  'send-daily-reminders',  -- همان نام job قبلی
  '0 9 * * *',             -- زمان‌بندی جدید
  $$
    -- دستور می‌تواند جدید باشد یا ثابت بماند
    SELECT net.http_post(
      url := 'https://<PROJECT_REF>.supabase.co/functions/v1/send-reminders',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'ANON_KEY')
      ),
      body := '{"source": "updated-cron-job"}'::jsonb
    );
  $$
);
```

#### حذف یک Cron Job

برای حذف کامل یک job از زمان‌بندی، از تابع `cron.unschedule()` استفاده کنید و نام job را به آن بدهید.

```sql
SELECT cron.unschedule('send-daily-reminders');
```

---

### ۶. مکان اجرای دستورات

شما می‌توانید این دستورات SQL را در دو مکان اصلی اجرا کنید:

1. **Supabase Dashboard (SQL Editor) - روش پیشنهادی:**

   * وارد داشبورد شوید > به `SQL Editor` بروید > `New query` را بزنید > دستور خود را کپی و اجرا کنید. این روش برای مدیریت دستی سریع و آسان است.
2. **Supabase CLI:**

   * برای مدیریت کد (Infrastructure as Code)، دستورات را در فایل‌های migration (مثلاً `supabase/migrations/...`) ذخیره کرده و با `supabase db push` آن‌ها را اعمال کنید.

---

### ۷. نکات مهم و عیب‌یابی

* **لاگ‌ها:** اگر یک Cron Job با شکست مواجه شود، می‌توانید لاگ‌های مربوط به خطای SQL را در لاگ‌های دیتابیس پیدا کنید. اگر Edge Function شما با خطا مواجه شود، باید لاگ‌های آن را در بخش `Edge Functions > Logs` در داشبورد بررسی کنید.
* **Timezone (منطقه زمانی):** همیشه به خاطر داشته باشید که زمان‌بندی بر اساس **UTC** است. اگر برای کاربران ایرانی ساعت ۹ صبح را در نظر می‌گیرید، باید آن را به UTC تبدیل کنید (مثلاً ۴:۳۰ صبح بسته به ساعت رسمی کشور).
* **محدودیت زمانی (Timeout):** `pg_cron` به طور پیش‌فرض یک محدودیت زمانی برای اجرای jobها دارد. اگر عملیات شما بیش از چند دقیقه طول می‌کشد، ممکن است با خطا مواجه شود. برای کارهای سنگین و طولانی، بهتر است از الگوی **صف (Queue)** استفاده کنید.
* **امنیت:** هرگز کلیدهای API یا توکن‌های محرمانه را مستقیماً در دستور `cron.schedule` ننویسید. همیشه از **Supabase Vault** برای نگهداری و فراخوانی امن آن‌ها استفاده کنید.

---

### ۸. برگه تقلب سریع

| عملیات                                       | دستور SQL                                                     |
| :------------------------------------------------- | :----------------------------------------------------------------- |
| **ایجاد/ویرایش Job**              | `SELECT cron.schedule('job-name', 'schedule', $$ YOUR_CODE $$);` |
| **مشاهده همه Jobها**              | `SELECT * FROM cron.job;`                                        |
| **حذف Job**                               | `SELECT cron.unschedule('job-name');`                            |
| **مثال: هر ۵ دقیقه**             | `SELECT cron.schedule('my-job', '*/5 * * * *', $$ SELECT 1 $$);` |
| **مثال: هر روز ساعت ۹ صبح** | `SELECT cron.schedule('my-job', '0 9 * * *', $$ SELECT 1 $$);`   |

---

### ۹. مثال‌های واقعی از پروژه

در این پروژه، دو Cron Job اصلی برای سیستم یادآوری سرویس خودروها استفاده می‌شود:

#### Cron Job 1: بررسی یادآورها (`check-reminders`)

این Cron Job هر روز ساعت ۹ صبح (UTC) اجرا می‌شود و یادآورهای سرویس خودروها را بررسی می‌کند:

```sql
SELECT cron.schedule(
  'check-reminders',
  '0 9 * * *', -- هر روز ساعت ۹ صبح UTC
  $$
  SELECT net.http_post(
    url := public.get_supabase_function_url('check-reminders'),
    headers := jsonb_build_object(
      'Authorization', public.get_auth_header(),
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  );
  $$
);
```

**عملکرد:**
- بررسی خودروهای نیازمند یادآوری (۷ روز قبل از موعد سرویس)
- ایجاد نوتیفیکیشن‌ها در جدول `notifications` (با `sent_at = NULL`)
- این function فقط بررسی می‌کند و اعلان ارسال نمی‌کند

#### Cron Job 2: ارسال اعلان‌ها (`send-notifications`)

این Cron Job هر ۵۰ دقیقه یکبار اجرا می‌شود و اعلان‌های ایجاد شده را ارسال می‌کند:

```sql
SELECT cron.schedule(
  'send-notifications',
  '*/50 * * * *', -- هر ۵۰ دقیقه
  $$
  SELECT net.http_post(
    url := public.get_supabase_function_url('send-notifications'),
    headers := jsonb_build_object(
      'Authorization', public.get_auth_header(),
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  );
  $$
);
```

**عملکرد:**
- خواندن نوتیفیکیشن‌های ارسال نشده (`sent_at IS NULL`)
- ارسال از طریق کانال‌های مختلف (تلگرام، Push Notification، و غیره)
- به‌روزرسانی `sent_at` پس از ارسال موفق

#### استفاده از Supabase Vault برای Secrets

برای امنیت بیشتر، از Supabase Vault برای ذخیره Secrets استفاده می‌شود:

1. به **Supabase Dashboard** > **Project Settings** > **Vault** بروید
2. Secrets زیر را اضافه کنید:

   **Secret 1: SERVICE_ROLE_KEY**
   - **Name**: `SERVICE_ROLE_KEY`
   - **Value**: Service Role Key از Settings > API

   **Secret 2: SUPABASE_URL**
   - **Name**: `SUPABASE_URL`
   - **Value**: Project ID یا URL کامل (بدون https://)
     - مثال: `zwrzokyzjwircrhrtyyi.supabase.co`
     - یا: `https://zwrzokyzjwircrhrtyyi.supabase.co` (تابع خودش https:// را اضافه می‌کند)

سپس در کد Cron Job، از توابع کمکی استفاده کنید:
```sql
-- برای ساخت URL Edge Function
public.get_supabase_function_url('check-reminders')

-- برای ساخت Authorization Header
public.get_auth_header()

-- مثال کامل:
SELECT net.http_post(
  url := public.get_supabase_function_url('check-reminders'),
  headers := jsonb_build_object(
    'Authorization', public.get_auth_header(),
    'Content-Type', 'application/json'
  ),
  body := '{}'::jsonb
);
```

#### مشاهده لاگ‌های Cron Job

برای بررسی اجرای Cron Job‌ها:

```sql
-- مشاهده لاگ‌های check-reminders
SELECT * FROM cron.job_run_details 
WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'check-reminders')
ORDER BY start_time DESC 
LIMIT 10;

-- مشاهده لاگ‌های send-notifications
SELECT * FROM cron.job_run_details 
WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'send-notifications')
ORDER BY start_time DESC 
LIMIT 10;
```

---

## جمع‌بندی

با استفاده از `pg_cron` و `pg_net` در Supabase، شما می‌توانید سیستم‌های خودکار و قدرتمندی بسازید بدون اینکه نیازی به سرور یا سرویس جانبی داشته باشید. این قابلیت، Supabase را به یک پلتفرم کامل برای توسعه اپلیکیشن‌های مدرن تبدیل می‌کند.

## منابع بیشتر

- [فایل‌های Migration مربوط به Cron Jobs](../migrations/011_setup_reminder_cron.sql)
- [Edge Function: check-reminders](../functions/check-reminders/README.md)
- [Edge Function: send-notifications](../functions/send-notifications/README.md)
