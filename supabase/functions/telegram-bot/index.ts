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

