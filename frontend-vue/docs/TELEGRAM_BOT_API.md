
# راهنمای کامل Telegram Bot API

## مقدمه

Telegram Bot API یک رابط برنامه‌نویسی (API) قدرتمند است که به شما اجازه می‌دهد تا به صورت برنامه‌نویسی، ربات‌های تلگرامی خود را کنترل کنید. در حالی که `@BotFather` برای تنظیمات اولیه عالی است، استفاده مستقیم از API به شما امکان می‌دهد تا:

* **اتوماسیون کامل:** تمام تنظیمات ربات (توضیحات، دستورات، وب‌هوک و غیره) را از طریق کد و اسکریپت‌های خود مدیریت کنید.
* **کنترل پویا:** در حین اجرای برنامه، نام ربات، توضیحات یا دستورات را تغییر دهید.
* **یکپارچه‌سازی با CI/CD:** فرآیند deployment را به گونه‌ای خودکار کنید که با هر بار آپدیت کد، تنظیمات ربات نیز به‌روزرسانی شوند.
* **دسترسی به تمام قابلیت‌ها:** به تمام ویژگی‌های پیشرفته تلگرام (مانند کیبوردهای تعاملی، پرداخت، بازی و غیره) دسترسی داشته باشید.

این راهنما به شما نشان می‌دهد که چگونه با استفاده از درخواست‌های HTTP (مانند `curl`) یا هر کتابخانه HTTP در زبان برنامه‌نویسی مورد نظر خود، با ربات خود تعامل کنید.

**پیش‌نیازها:**

1. **توکن ربات (Bot Token):** که از `@BotFather` دریافت کرده‌اید.
2. **یک کلاینت HTTP:** مانند `curl` برای خط فرمان، یا کتابخانه‌هایی مانند `axios` در JavaScript یا `requests` در Python.

---

## فهرست مطالب

1. [شروع کار: ساخت اولین درخواست](#۱-شروع-کار-ساخت-اولین-درخواست)
2. [مدیریت اصلی ربات (جایگزین BotFather)](#۲-مدیریت-اصلی-ربات-جایگزین-botfather)
   * [تنظیم و مدیریت وب‌هوک](#تنظیم-و-مدیریت-وبهوک)
   * [تنظیم و مدیریت دستورات (Commands)](#تنظیم-و-مدیریت-دستورات-commands)
   * [تنظیم توضیحات و نام ربات](#تنظیم-توضیحات-و-نام-ربات)
3. [ارسال پیام](#۳-ارسال-پیام)
   * [ارسال پیام متنی با فرمت‌بندی](#ارسال-پیام-متنی-با-فرمتبندی)
   * [انواع دیگر پیام‌ها](#انواع-دیگر-پیامها)
4. [دریافت آپدیت‌ها (وب‌هوک در مقابل Polling)](#۴-دریافت-آپدیتها-وبهوک-در-مقابل-polling)
5. [کار با کاربران و چت‌ها](#۵-کار-با-کاربران-و-چتها)
6. [ویژگی‌های پیشرفته: تعامل با کاربر](#۶-ویژگیهای-پیشرفته-تعامل-با-کاربر)
   * [کیبوردهای تعاملی (Inline Keyboards)](#کیبوردهای-تعاملی-inline-keyboards)
   * [پاسخ به کلیک روی دکمه‌ها (Callback Queries)](#پاسخ-به-کلیک-روی-دکمهها-callback-queries)
7. [مدیریت خطا و نکات کلیدی](#۷-مدیریت-خطا-و-نکات-کلیدی)
8. [ابزارها و کتابخانه‌های مفید](#۸-ابزارها-و-کتابخانههای-مفید)

---

### ۱. شروع کار: ساخت اولین درخواست

تمام درخواست‌ها به API تلگرام به این فرمت هستند:

```
https://api.telegram.org/bot<TOKEN>/METHOD_NAME
```

* `<TOKEN>`: توکن ربات شما.
* `METHOD_NAME`: نام متدی که می‌خواهید فراخوانی کنید (مثلاً `getMe`).

**مثال: دریافت اطلاعات ربات (`getMe`)**
این ساده‌ترین متد برای تست اتصال است.

```bash
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getMe"
```

**پاسخ موفق:**

```json
{
  "ok": true,
  "result": {
    "id": 123456789,
    "is_bot": true,
    "first_name": "KhodroBan Reminder",
    "username": "KhodroBanReminderBot",
    "can_join_groups": true,
    "can_read_all_group_messages": false,
    "supports_inline_queries": false
  }
}
```

---

### ۲. مدیریت اصلی ربات (جایگزین BotFather)

در این بخش تمام کارهایی را که با BotFather انجام می‌دادید، از طریق API انجام می‌دهیم.

#### تنظیم و مدیریت وب‌هوک

* **تنظیم وب‌هوک (`setWebhook`):**

  ```bash
  curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://<PROJECT_REF>.supabase.co/functions/v1/telegram-bot"
  ```
* **مشاهده اطلاعات وب‌هوک (`getWebhookInfo`):**

  ```bash
  curl "https://api.telegram.org/bot<TOKEN>/getWebhookInfo"
  ```
* **حذف وب‌هوک (`deleteWebhook`):** (برای بازگشت به حالت Polling)

  ```bash
  curl -X POST "https://api.telegram.org/bot<TOKEN>/deleteWebhook"
  ```

#### تنظیم و مدیریت دستورات (Commands)

* **تنظیم لیست دستورات (`setMyCommands`):**

  ```bash
  curl -X POST "https://api.telegram.org/bot<TOKEN>/setMyCommands" \
  -H "Content-Type: application/json" \
  -d '{
    "commands": [
      {"command": "start", "description": "اتصال به حساب KhodroBan"},
      {"command": "status", "description": "بررسی وضعیت اتصال"},
      {"command": "help", "description": "راهنما"}
    ]
  }'
  ```
* **مشاهده دستورات (`getMyCommands`):**

  ```bash
  curl "https://api.telegram.org/bot<TOKEN>/getMyCommands"
  ```

#### تنظیم توضیحات و نام ربات

* **تنظیم توضیحات کوتاه (`setMyShortDescription`):** (نمایش داده می‌شود وقتی کاربر با ربات چت جدیدی شروع می‌کند)

  ```bash
  curl -X POST "https://api.telegram.org/bot<TOKEN>/setMyShortDescription" \
  -H "Content-Type: application/json" \
  -d '{"short_description": "ربات هوشمند یادآوری سرویس خودرو"}'
  ```
* **تنظیم توضیحات کامل (`setMyDescription`):** (نمایش داده می‌شود در بخش «About» ربات)

  ```bash
  curl -X POST "https://api.telegram.org/bot<TOKEN>/setMyDescription" \
  -H "Content-Type: application/json" \
  -d '{"description": "با این ربات، یادآوری‌های سرویس دوره‌ای خودروی خود را در تلگرام دریافت کنید. برای اتصال، به اپلیکیشن KhodroBan مراجعه کنید."}'
  ```
* **تغییر نام ربات (`setMyName`):**

  ```bash
  curl -X POST "https://api.telegram.org/bot<TOKEN>/setMyName" \
  -H "Content-Type: application/json" \
  -d '{"name": "KhodroBan Smart Reminder"}'
  ```

---

### ۳. ارسال پیام

#### ارسال پیام متنی با فرمت‌بندی

از متد `sendMessage` استفاده کنید. می‌توانید پیام خود را با HTML یا Markdown فرمت‌بندی کنید.

```bash
curl -X POST "https://api.telegram.org/bot<TOKEN>/sendMessage" \
-H "Content-Type: application/json" \
-d '{
  "chat_id": 123456789,
  "text": "<b>یادآوری مهم</b>\n\nسرویس خودروی شما <i>فردا</i> سر می‌رسد.",
  "parse_mode": "HTML"
}'
```

* `chat_id`: شناسه عددی چت کاربر.
* `parse_mode`: می‌تواند `"HTML"` یا `"Markdown"` باشد.

#### انواع دیگر پیام‌ها

API متدهای مشابهی برای ارسال انواع محتوا دارد:

* `sendPhoto`: برای ارسال عکس
* `sendAudio`: برای ارسال فایل صوتی
* `sendDocument`: برای ارسال فایل
* `sendLocation`: برای ارسال موقعیت مکانی

---

### ۴. دریافت آپدیت‌ها (وب‌هوک در مقابل Polling)

شما دو راه برای دریافت پیام‌های کاربران دارید:

1. **Webhook (توصیه شده):** تلگرام آپدیت‌ها را به صورت خودکار برای شما ارسال می‌کند. این روش فوری و بهینه است. شما از آن برای Edge Function خود استفاده کردید.
2. **Polling:** شما به طور مداوم از تلگرام می‌پرسید که آیا پیام جدیدی وجود دارد یا نه. این روش برای تست محلی مناسب است.

**دریافت آپدیت‌ها با Polling (`getUpdates`):**

```bash
curl "https://api.telegram.org/bot<TOKEN>/getUpdates"
```

---

### ۵. کار با کاربران و چت‌ها

* **دریافت اطلاعات کامل یک چت (`getChat`):**

  ```bash
  curl "https://api.telegram.org/bot<TOKEN>/getChat?chat_id=123456789"
  ```
* **دریافت اطلاعات یک عضو در چت (`getChatMember`):**

  ```bash
  curl "https://api.telegram.org/bot<TOKEN>/getChatMember?chat_id=-100123456789&user_id=987654321"
  ```
* **خروج ربات از یک گروه (`leaveChat`):**

  ```bash
  curl "X POST "https://api.telegram.org/bot<TOKEN>/leaveChat?chat_id=-100123456789"
  ```

---

### ۶. ویژگی‌های پیشرفته: تعامل با کاربر

#### کیبوردهای تعاملی (Inline Keyboards)

این دکمه‌ها زیر پیام شما نمایش داده می‌شوند و به کاربر اجازه می‌دهند با یک کلیک اقدامی را انجام دهد.

```bash
curl -X POST "https://api.telegram.org/bot<TOKEN>/sendMessage" \
-H "Content-Type: application/json" \
-d '{
  "chat_id": 123456789,
  "text": "لطفاً یکی از گزینه‌ها را انتخاب کنید:",
  "reply_markup": {
    "inline_keyboard": [
      [
        {"text": "✅ تایید", "callback_data": "confirm_reminder"},
        {"text": "❌ لغو", "callback_data": "cancel_reminder"}
      ],
      [
        {"text": "مشاهده در وب‌سایت", "url": "https://khodroban.com/reminders/123"}
      ]
    ]
  }
}'
```

* `callback_data`: داده‌ای که وقتی کاربر روی دکمه کلیک می‌کند، برای شما ارسال می‌شود.
* `url`: با کلیک روی این دکمه، کاربر به این URL هدایت می‌شود.

#### پاسخ به کلیک روی دکمه‌ها (Callback Queries)

وقتی کاربر روی دکمه‌ای با `callback_data` کلیک می‌کند، تلگرام یک آپدیت از نوع `callback_query` برای شما ارسال می‌کند. شما باید با متد `answerCallbackQuery` به آن پاسخ دهید تا دکمه از حالت لودینگ خارج شود.

```bash
curl -X POST "https://api.telegram.org/bot<TOKEN>/answerCallbackQuery" \
-H "Content-Type: application/json" \
-d '{
  "callback_query_id": "UNIQUE_CALLBACK_QUERY_ID",
  "text": "یادآوری با موفقیت تایید شد!",
  "show_alert": false
}'
```

* `callback_query_id`: مقداری که در آپدیت `callback_query` دریافت می‌کنید.
* `show_alert`: اگر `true` باشد، یک پیام پاپ‌آپ به کاربر نمایش داده می‌شود.

---

### ۷. مدیریت خطا و نکات کلیدی

* **ساختار پاسخ خطا:** اگر درخواست شما با خطا مواجه شود، تلگرام JSON زیر را برمی‌گرداند:

  ```json
  {
    "ok": false,
    "error_code": 400,
    "description": "Bad Request: chat not found"
  }
  ```
* **محدودیت نرخ (Rate Limiting):** تلگرام محدودیت‌هایی دارد. مثلاً نمی‌توانید بیش از ۳۰ پیام در ثانیه به یک کاربر خاص ارسال کنید. اگر از این محدودیت عبور کنید، خطای `429 Too Many Requests` دریافت خواهید کرد.
* **امنیت:** هرگز توکن ربات خود را در کد سمت کلاینت (Frontend) یا در مکان‌های عمومی قرار ندهید. همیشه از متغیرهای محیطی (Environment Variables) یا سرویس‌هایی مانند Supabase Vault استفاده کنید.

---

### ۸. ابزارها و کتابخانه‌های مفید

اگرچه می‌توانید با `curl` کار کنید، استفاده از کتابخانه‌های آماده فرآیند را بسیار ساده‌تر می‌کند:

* **Python:** `python-telegram-bot`, `aiogram`
* **JavaScript/Node.js:** `node-telegram-bot-api`, `grammy` (برای Node.js و Deno)
* **Go:** `go-telegram-bot-api`
* **PHP:** `telegram-bot-sdk`

**منابع رسمی:**

* **مستندات کامل API:** [https://core.telegram.org/bots/api](https://core.telegram.org/bots/api)
* **ربات API برای تست:** [@BotAPI](https://t.me/BotAPI) (یک ربات که به شما اجازه می‌دهد متدهای API را مستقیماً در تلگرام تست کنید).

---

## نتیجه‌گیری

Telegram Bot API به شما قدرت کنترل کامل و برنامه‌نویسی ربات‌های خود را می‌دهد. با تسلط بر این API، شما می‌توانید ربات‌های تعاملی، هوشمند و کاملاً یکپارچه با سیستم‌های دیگر بسازید. این راهنما نقطه شروع شما بود؛ حالا نوبت شماست که با آزمون و خطا، ربات رویایی خود را بسازید.v
