# راه‌اندازی ربات تلگرام با Supabase Edge Functions

این مستند راهنمای کامل راه‌اندازی ربات تلگرام برای ارسال یادآوری‌های سرویس دوره‌ای خودروها با استفاده از Supabase Edge Functions است.

---

## 📋 فهرست مطالب

1. [مراحل راه‌اندازی ربات در BotFather](#مراحل-راه‌اندازی-ربات-در-botfather)
2. [ایجاد Edge Function برای ربات](#ایجاد-edge-function-برای-ربات)
3. [تنظیمات Secrets در Supabase](#تنظیمات-secrets-در-supabase)
4. [Deploy و راه‌اندازی](#deploy-و-راه‌اندازی)
5. [تنظیمات Frontend](#تنظیمات-frontend)
6. [تست سیستم](#تست-سیستم)
7. [عیب‌یابی](#عیب‌یابی)

---

## 🤖 مراحل راه‌اندازی ربات در BotFather

### مرحله ۱: ایجاد ربات جدید

1. **باز کردن BotFather در تلگرام:**

   - به `@BotFather` در تلگرام پیام بدهید
   - دستور `/start` را بزنید
2. **ایجاد ربات جدید:**

   ```
   /newbot
   ```
3. **تنظیم نام ربات:**

   - نام نمایشی: `KhodroBan Reminder Bot` (یا هر نام دیگری)
   - نام کاربری: `KhodroBanReminderBot` (باید به `bot` ختم شود)
4. **دریافت توکن:**

   - BotFather یک توکن به شما می‌دهد، مثل:
     ```
     123456789:ABCdefGHIjklMNOpqrsTUVwxyz
     ```
   - **این توکن را در جایی امن نگه دارید** - بعداً در Supabase Vault استفاده می‌شود
5. **تنظیمات اختیاری ربات:**

   ```
   /setdescription
   ```

   توضیحات: `ربات یادآوری سرویس دوره‌ای خودرو - KhodroBan`

   ```
   /setabouttext
   ```

   درباره: `با اتصال به این ربات، یادآوری سرویس دوره‌ای خودروهای خود را در تلگرام دریافت کنید.`
6. **تنظیم دستورات ربات (اختیاری):**

   ```
   /setcommands
   ```

   سپس این دستورات را اضافه کنید:

   ```
   start - اتصال به حساب KhodroBan
   status - بررسی وضعیت اتصال
   ```

---

## ⚙️ ایجاد Edge Function برای ربات

### مرحله ۲: ایجاد فایل Edge Function

**فایل: `supabase/functions/telegram-bot/index.ts`**

این Edge Function به عنوان Webhook برای ربات تلگرام عمل می‌کند و دستورات `/start` و `/status` را پردازش می‌کند.

```typescript
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// ایجاد Supabase client با Service Role Key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from?: {
      id: number;
      is_bot: boolean;
      first_name: string;
      username?: string;
    };
    chat: {
      id: number;
      type: string;
    };
    text?: string;
    date: number;
  };
}

/**
 * ارسال پیام به تلگرام
 */
async function sendTelegramMessage(
  chatId: number,
  text: string,
  parseMode: "HTML" | "Markdown" = "HTML"
): Promise<boolean> {
  const botToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
  if (!botToken) {
    console.error("TELEGRAM_BOT_TOKEN not configured");
    return false;
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: parseMode,
        }),
      }
    );

    if (response.ok) {
      console.log(`✅ Telegram message sent to ${chatId}`);
      return true;
    } else {
      const error = await response.text();
      console.error(`❌ Telegram error: ${response.status} - ${error}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Telegram send error:`, error);
    return false;
  }
}

/**
 * پردازش دستور /start
 */
async function handleStartCommand(
  chatId: number,
  connectionCode?: string
): Promise<void> {
  if (!connectionCode) {
    // اگر کد ارسال نشده باشد
    await sendTelegramMessage(
      chatId,
      `سلام! 👋\n\n` +
        `برای اتصال ربات به حساب KhodroBan خود:\n` +
        `1. به برنامه KhodroBan بروید\n` +
        `2. به بخش تنظیمات تلگرام بروید\n` +
        `3. روی 'اتصال به ربات تلگرام' کلیک کنید\n` +
        `4. دکمه Start رو بزنید\n\n` +
        `اتصال به صورت خودکار انجام می‌شود!`
    );
    return;
  }

  // پیدا کردن کاربر با کد یکتا
  const { data: settings, error } = await supabase
    .from("telegram_settings")
    .select("user_id")
    .eq("connection_code", connectionCode)
    .eq("is_enabled", false)
    .maybeSingle();

  if (error || !settings) {
    await sendTelegramMessage(
      chatId,
      `❌ کد نامعتبر یا منقضی شده است.\n\n` +
        `لطفاً دوباره در برنامه KhodroBan اقدام کنید:\n` +
        `1. به بخش تنظیمات تلگرام بروید\n` +
        `2. روی 'اتصال به ربات تلگرام' کلیک کنید\n` +
        `3. دکمه Start رو در تلگرام بزنید`
    );
    return;
  }

  const userId = settings.user_id;

  // ذخیره chat_id و فعال‌سازی
  const { error: updateError } = await supabase
    .from("telegram_settings")
    .update({
      chat_id: chatId.toString(),
      is_enabled: true,
      connection_code: null, // پاک کردن کد بعد از استفاده
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  if (updateError) {
    console.error("Error updating telegram settings:", updateError);
    await sendTelegramMessage(
      chatId,
      `❌ خطا در اتصال. لطفاً دوباره تلاش کنید.`
    );
    return;
  }

  console.log(`✅ کاربر ${userId} با chat_id ${chatId} متصل شد`);

  await sendTelegramMessage(
    chatId,
    `✅ اتصال با موفقیت انجام شد!\n\n` +
      `حالا هر روز یادآوری سرویس دوره‌ای خودرو رو در تلگرام دریافت می‌کنید.\n` +
      `می‌توانید از طریق برنامه KhodroBan وضعیت رو مدیریت کنید.`
  );
}

/**
 * پردازش دستور /status
 */
async function handleStatusCommand(chatId: number): Promise<void> {
  // پیدا کردن کاربر با chat_id
  const { data: settings, error } = await supabase
    .from("telegram_settings")
    .select("user_id, is_enabled")
    .eq("chat_id", chatId.toString())
    .eq("is_enabled", true)
    .maybeSingle();

  if (error || !settings) {
    await sendTelegramMessage(
      chatId,
      `❌ وضعیت اتصال: غیرفعال\n\n` +
        `لطفاً از برنامه KhodroBan مجدداً اقدام کنید.`
    );
    return;
  }

  await sendTelegramMessage(
    chatId,
    `✅ وضعیت اتصال: فعال\n\n` +
      `کاربر: ${settings.user_id}\n` +
      `حالا یادآوری‌ها رو دریافت می‌کنید!`
  );
}

/**
 * پردازش پیام‌های دریافتی
 */
async function handleMessage(update: TelegramUpdate): Promise<void> {
  const message = update.message;
  if (!message || !message.text) {
    return;
  }

  const chatId = message.chat.id;
  const text = message.text.trim();

  // پردازش دستورات
  if (text.startsWith("/start")) {
    const parts = text.split(" ");
    const connectionCode = parts.length > 1 ? parts[1] : undefined;
    await handleStartCommand(chatId, connectionCode);
  } else if (text.startsWith("/status")) {
    await handleStatusCommand(chatId);
  } else {
    // پیام‌های دیگر را نادیده بگیریم
    await sendTelegramMessage(
      chatId,
      `برای شروع، از دستور /start استفاده کنید.`
    );
  }
}

Deno.serve(async (req) => {
  // فقط POST requests را قبول می‌کنیم
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const update: TelegramUpdate = await req.json();

    // پردازش پیام
    if (update.message) {
      await handleMessage(update);
    }

    return new Response(
      JSON.stringify({ ok: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing update:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
```

---

## 🔐 تنظیمات Secrets در Supabase

### مرحله ۳: تنظیم Secrets

⚠️ **مهم:** Secrets باید در **دو جا** تنظیم شوند:
1. **Project Settings > Vault** (برای استفاده عمومی)
2. **Edge Functions > telegram-bot > Secrets** (برای استفاده در Edge Function)

#### الف) تنظیم Secrets در Vault (اختیاری اما توصیه می‌شود)

1. به [Supabase Dashboard](https://supabase.com/dashboard) بروید
2. پروژه خود را انتخاب کنید
3. به **Project Settings** > **Vault** بروید
4. این Secrets را اضافه کنید:

**Secret 1: TELEGRAM_BOT_TOKEN**

- Name: `TELEGRAM_BOT_TOKEN`
- Value: توکن ربات تلگرام از BotFather
  ```
  123456789:ABCdefGHIjklMNOpqrsTUVwxyz
  ```

**Secret 2: SERVICE_ROLE_KEY** (اگر قبلاً تنظیم نشده)

- Name: `SERVICE_ROLE_KEY`
- Value: Service Role Key از **Settings** > **API** > **service_role key**

#### ب) تنظیم Secrets در Edge Function (ضروری)

1. به **Edge Functions** > **telegram-bot** بروید
2. روی تب **Secrets** کلیک کنید
3. Secret `TELEGRAM_BOT_TOKEN` را اضافه کنید:
   - **Name:** `TELEGRAM_BOT_TOKEN`
   - **Value:** توکن ربات تلگرام شما (همان توکنی که از BotFather دریافت کردید)
4. روی **Save** کلیک کنید

**نکته:** اگر Secret را فقط در Vault اضافه کنید اما در Edge Functions > Secrets اضافه نکنید، Edge Function نمی‌تواند به آن دسترسی داشته باشد و خطای "TELEGRAM_BOT_TOKEN not configured" دریافت خواهید کرد.

---

## 🚀 Deploy و راه‌اندازی

### مرحله ۴: Deploy Edge Function

#### روش A: از Dashboard (پیشنهادی)

1. به **Edge Functions** > **New Function** بروید
2. در صفحه Editor:
   - **Function name**: `telegram-bot`
   - **File name**: `index.ts`
   - کد موجود در `supabase/functions/telegram-bot/index.ts` را کپی کنید
3. **مهم:** قبل از Deploy، حتماً Secrets را در تب **Secrets** تنظیم کنید:
   - به تب **Secrets** بروید
   - Secret `TELEGRAM_BOT_TOKEN` را اضافه کنید
   - روی **Save** کلیک کنید
4. روی **Deploy function** کلیک کنید

#### روش B: از CLI

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy function
supabase functions deploy telegram-bot
```

**نکته:** `PROJECT_REF` را از URL Dashboard می‌توانید بگیرید:

```
https://supabase.com/dashboard/project/YOUR_PROJECT_REF
```

### مرحله ۵: تنظیم Webhook در BotFather

بعد از deploy function، باید Webhook را در BotFather تنظیم کنید:

1. **دریافت URL Edge Function:**

   ```
   https://YOUR_PROJECT_REF.supabase.co/functions/v1/telegram-bot
   ```
2. **تنظیم Webhook از BotFather:**

   - به `@BotFather` در تلگرام پیام بدهید
   - دستور زیر را بزنید (URL را جایگزین کنید):

     ```
     /setwebhook
     ```
   - سپس URL را ارسال کنید:

     ```
     https://YOUR_PROJECT_REF.supabase.co/functions/v1/telegram-bot
     ```
3. **بررسی Webhook:**

   ```
   /getwebhookinfo
   ```

   باید URL و وضعیت Webhook را نمایش دهد

اگر در تلگرام /webhook  را پیدا نکردی از روش زیر استفاده کن:

- فراخوانی مستقیم API برای تنظیم webhook

  ```
   curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://<PROJECT_REF>.supabase.co/functions/v1/telegram-bot"
  ```

‍```
   در پاسخ:

```
   {"ok":true,"result":true,"description":"Webhook was set"}
```

### مدیریت کامل وب‌هوک از طریق API تلگرام

با استفاده از API مستقیم تلگرام، می‌توانید کنترل کاملی روی وب‌هوک ربات خود داشته باشید. این روش برای اسکریپت‌های خودکار (CI/CD) نیز بسیار کاربردی است.

#### ۱. مشاهده وب‌هوک فعلی (Get Webhook Info)

برای دیدن اطلاعات کامل وب‌هوک فعلی ربات خود، از متد `getWebhookInfo` استفاده کنید. این کار به شما نشان می‌دهد که آیا وب‌هوک فعال است، به چه آدرسی تنظیم شده و آیا خطایی وجود دارد یا خیر.

**دستور curl:**

```bash
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo"
```

به جای `<YOUR_BOT_TOKEN>` توکن ربات خود را قرار دهید.

**پاسخ نمونه:**

```json
{
  "ok": true,
  "result": {
    "url": "https://<PROJECT_REF>.supabase.co/functions/v1/telegram-bot",
    "has_custom_certificate": false,
    "pending_update_count": 0,
    "last_error_date": null,
    "last_error_message": null,
    "max_connections": 40,
    "ip_address": "xx.xx.xx.xx"
  }
}
```

**تفسیر پاسخ:**

- **url**: آدرسی که وب‌هوک به آن متصل است.
- **pending_update_count**: تعداد پیام‌هایی که در صف منتظر ارسال به سرور شما هستند. اگر این عدد زیاد و صفر نیست، یعنی سرور شما در دریافت پیام‌ها مشکل دارد.
- **last_error_message**: آخرین خطایی که هنگام ارسال پیام به سرور شما رخ داده است. اگر این مقدار `null` باشد، همه چیز عالی است.

#### ۲. تغییر یا حذف وب‌هوک (Set/Delete Webhook)

##### الف) تغییر وب‌هوک (Set Webhook)

اگر بخواهید آدرس وب‌هوک را تغییر دهید (مثلاً به یک تابع جدید یا پروژه دیگر)، کافی است دوباره از متد `setWebhook` با URL جدید استفاده کنید.

**دستور curl:**

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://<NEW_PROJECT_REF>.supabase.co/functions/v1/new-telegram-bot"
```

به جای `<NEW_PROJECT_REF>` آدرس جدید خود را قرار دهید.

پس از اجرای این دستور، وب‌هوک شما به آدرس جدید تغییر می‌کند.

##### ب) حذف وب‌هوک (Delete Webhook)

اگر بخواهید وب‌هوک را به طور کامل غیرفعال کنید و ربات به حالت Polling برگردد (یعنی به طور مداوم از سرورهای تلگرام پیام جدید بگیرد)، از متد `deleteWebhook` استفاده کنید. این کار برای تست محلی بسیار مفید است.

**دستور curl:**

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/deleteWebhook"
```

**پاسخ نمونه:**

```json
{"ok":true,"result":true,"description":"Webhook was deleted"}
```

پس از اجرای این دستور، ربات شما دیگر به Supabase متصل نخواهد بود.

#### 📋 خلاصه دستورات

| عملیات                       | دستور curl                                                             |
| ---------------------------------- | --------------------------------------------------------------------------- |
| مشاهده وب‌هوک          | `curl "https://api.telegram.org/bot<TOKEN>/getWebhookInfo"`               |
| تنظیم/تغییر وب‌هوک | `curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook?url=<URL>"` |
| حذف وب‌هوک                | `curl -X POST "https://api.telegram.org/bot<TOKEN>/deleteWebhook"`        |

با این دستورات شما کنترل کامل روی وب‌هوک ربات خود دارید و دیگر نیازی به تعامل با @BotFather برای این کارها نخواهید داشت. این روش برای اسکریپت‌های خودکار (CI/CD) نیز بسیار کاربردی است.

**نکته:** اگر می‌خواهید از Polling استفاده کنید (برای تست)، می‌توانید Webhook را حذف کنید:

```
/deletewebhook
```

---

## 🎨 تنظیمات Frontend

### مرحله ۶: افزودن متغیر محیطی

**فایل: `.env` در `frontend-vue/`**

```bash
VITE_TELEGRAM_BOT_USERNAME=KhodroBanReminderBot
```

**نکته:** نام کاربری ربات را بدون `@` وارد کنید.

### مرحله ۷: اجرای Migration

Migration `010_telegram_settings.sql` را در Supabase SQL Editor اجرا کنید:

```sql
-- فایل supabase/migrations/010_telegram_settings.sql را اجرا کنید
```

یا از CLI:

```bash
supabase migration up
```

---

## 🧪 تست سیستم

### تست ۱: تست دستی Edge Function

```bash
# تست با curl
curl -X POST \
  'https://YOUR_PROJECT_REF.supabase.co/functions/v1/telegram-bot' \
  -H 'Content-Type: application/json' \
  -d '{
    "update_id": 123456789,
    "message": {
      "message_id": 1,
      "from": {
        "id": 123456789,
        "is_bot": false,
        "first_name": "Test"
      },
      "chat": {
        "id": 123456789,
        "type": "private"
      },
      "text": "/start TESTCODE123",
      "date": 1234567890
    }
  }'
```

### تست ۲: اتصال از Frontend

1. **اجرای Frontend:**

   ```bash
   cd frontend-vue
   npm run dev
   ```
2. **لاگین در برنامه:**

   - وارد حساب کاربری شوید
3. **رفتن به تنظیمات:**

   - به صفحه Settings بروید
   - بخش "اتصال به تلگرام" را پیدا کنید
4. **کلیک روی "اتصال به ربات تلگرام":**

   - لینک تلگرام باز می‌شود
   - دکمه **Start** را بزنید
5. **بررسی:**

   - در تلگرام باید پیام "✅ اتصال با موفقیت انجام شد!" نمایش داده شود
   - در برنامه باید وضعیت "متصل" نمایش داده شود
   - در Supabase، جدول `telegram_settings` باید `chat_id` و `is_enabled = true` داشته باشد

### تست ۳: بررسی دستور /status

در تلگرام، به ربات پیام بدهید:

```
/status
```

باید وضعیت اتصال را نمایش دهد.

### تست ۴: ارسال یادآوری

1. **ایجاد یادآوری تست:**

   - یک خودرو اضافه کنید
   - یک سرویس با تاریخ ۲۵ روز پیش ثبت کنید
   - تنظیمات یادآوری: ۳۰ روز، هشدار ۷ روز قبل
2. **اجرای Edge Function check-reminders:**

   - از SQL Editor: `SELECT public.test_check_reminders();`
   - یا از HTTP Request
3. **بررسی:**

   - ✅ نوتیفیکیشن در داشبورد
   - ✅ پیام در تلگرام
   - ✅ لاگ‌ها در Edge Functions

---

## 🔧 عیب‌یابی

### مشکل ۱: Webhook تنظیم نمی‌شود

**بررسی:**

```bash
# بررسی Webhook از BotFather
/getwebhookinfo
```

**راه‌حل:**

- مطمئن شوید URL صحیح است
- مطمئن شوید Edge Function deploy شده است
- بررسی کنید که Secrets تنظیم شده‌اند

### مشکل ۲: ربات پیام نمی‌دهد

**بررسی:**

1. لاگ‌های Edge Function را در Dashboard ببینید
2. بررسی کنید `TELEGRAM_BOT_TOKEN` در Secrets تنظیم شده باشد
3. تست دستی با curl انجام دهید

**راه‌حل:**

- Secrets را دوباره چک کنید
- Edge Function را دوباره deploy کنید

### مشکل ۳: کد اتصال کار نمی‌کند

**بررسی:**

```sql
-- بررسی کد در دیتابیس
SELECT * FROM telegram_settings 
WHERE connection_code = 'YOUR_CODE' 
AND is_enabled = false;
```

**راه‌حل:**

- در Frontend، روی "دریافت لینک جدید" کلیک کنید
- لینک جدید را باز کنید و Start بزنید
- مطمئن شوید کد در URL وجود دارد: `?start=CODE`

### مشکل ۴: پیام تلگرام ارسال نمی‌شود

**بررسی:**

1. `chat_id` در `telegram_settings` ذخیره شده باشد
2. `is_enabled = true` باشد
3. `TELEGRAM_BOT_TOKEN` در Secrets تنظیم شده باشد

**راه‌حل:**

```sql
-- بررسی تنظیمات تلگرام
SELECT * FROM telegram_settings WHERE is_enabled = true;
```

### مشکل ۵: خطای "TELEGRAM_BOT_TOKEN not configured"

**علت:** Secret در Edge Functions تنظیم نشده

**راه‌حل:**

⚠️ **مهم:** Secrets باید در بخش **Edge Functions** اضافه شوند، نه فقط در Project Settings > Vault.

1. به **Edge Functions** > **telegram-bot** بروید
2. روی تب **Secrets** کلیک کنید
3. Secret `TELEGRAM_BOT_TOKEN` را اضافه کنید:
   - **Name:** `TELEGRAM_BOT_TOKEN`
   - **Value:** توکن ربات تلگرام شما (مثال: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)
4. روی **Save** کلیک کنید
5. Edge Function را دوباره deploy کنید (یا منتظر بمانید تا به‌صورت خودکار اعمال شود)

**نکته:** اگر Secret را در Project Settings > Vault اضافه کرده‌اید اما هنوز خطا می‌گیرید، حتماً آن را در بخش Edge Functions > Secrets نیز اضافه کنید.

---

## 📊 مانیتورینگ

### مشاهده لاگ‌های Edge Function

1. به **Edge Functions** > **telegram-bot** > **Logs** بروید
2. لاگ‌های real-time را مشاهده کنید

### بررسی Webhook Status

از BotFather:

```
/getwebhookinfo
```

### بررسی اتصالات کاربران

```sql
-- تعداد کاربران متصل
SELECT COUNT(*) FROM telegram_settings WHERE is_enabled = true;

-- لیست کاربران متصل
SELECT user_id, chat_id, created_at, updated_at 
FROM telegram_settings 
WHERE is_enabled = true;
```

---

## ✅ چک‌لیست نهایی

- [ ] ربات در BotFather ایجاد شد
- [ ] توکن ربات دریافت شد
- [ ] Edge Function `telegram-bot` ایجاد و deploy شد
- [ ] Secrets در Vault تنظیم شدند (`TELEGRAM_BOT_TOKEN`, `SERVICE_ROLE_KEY`) - اختیاری
- [ ] **Secrets در Edge Functions > telegram-bot > Secrets تنظیم شد** (`TELEGRAM_BOT_TOKEN`) - **ضروری**
- [ ] Webhook در BotFather تنظیم شد
- [ ] Migration `010_telegram_settings.sql` اجرا شد
- [ ] Frontend متغیر `VITE_TELEGRAM_BOT_USERNAME` دارد
- [ ] تست اتصال از Frontend موفق بود
- [ ] دستور `/start` کار می‌کند
- [ ] دستور `/status` کار می‌کند
- [ ] تست ارسال یادآوری موفق بود

---

## 📝 نکات مهم

1. **امنیت:**

   - هرگز توکن ربات را در کد commit نکنید
   - از Supabase Vault برای نگهداری Secrets استفاده کنید
   - Service Role Key فقط در Backend استفاده شود
2. **محدودیت‌ها:**

   - تلگرام: ۳۰ پیام/ثانیه
   - کد اتصال: یک‌بار مصرف (بعد از استفاده پاک می‌شود)
   - Webhook: باید HTTPS باشد
3. **بهینه‌سازی:**

   - از Webhook به جای Polling استفاده کنید (پیشنهادی)
   - لاگ‌ها را به صورت منظم بررسی کنید
   - Rate limiting را در نظر بگیرید
4. **توسعه:**

   - برای تست، می‌توانید از Polling استفاده کنید
   - برای production، حتماً Webhook را تنظیم کنید

---

## 🔄 تفاوت با Python Bot

| ویژگی             | Python Bot                            | Supabase Edge Function            |
| ---------------------- | ------------------------------------- | --------------------------------- |
| سرور               | نیاز به سرور جداگانه | در Supabase (بدون سرور) |
| مدیریت           | نیاز به systemd/supervisor      | مدیریت خودکار         |
| هزینه             | هزینه سرور                   | فقط هزینه Supabase        |
| مقیاس‌پذیری | دستی                              | خودکار                      |
| امنیت             | مدیریت دستی Secrets         | Supabase Vault                    |

---

**تاریخ ایجاد:** ۱۴۰۴/۱۱/۰۵
**وضعیت:** ✅ آماده استفاده
**جایگزین:** Python Bot (`bot.py`)
