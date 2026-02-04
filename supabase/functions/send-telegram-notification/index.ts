import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const telegramBotToken = Deno.env.get("TELEGRAM_BOT_TOKEN");

// ایجاد Supabase client با Service Role Key برای دسترسی کامل
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * ساخت پیام تلگرام از نوتیفیکیشن
 */
function buildTelegramMessage(notification: any): string {
  const metadata = notification.metadata || {};
  const vehicleModel = metadata.vehicle_model || "نامشخص";
  const plateNumber = metadata.plate_number || "نامشخص";
  const daysUntilDue = metadata.days_until_due;
  const intervalDays = metadata.interval_days;
  const lastServiceDate = metadata.last_service_date;

  return `🚨 <b>یادآوری سرویس دوره‌ای خودرو</b> 🚨

🚗 <b>خودرو:</b> ${vehicleModel}
🔢 <b>پلاک:</b> ${plateNumber}
📅 <b>روزهای باقی‌مانده:</b> ${daysUntilDue} روز
⏱️ <b>موعد اصلی:</b> ${intervalDays} روز
📝 <b>آخرین سرویس:</b> ${lastServiceDate}

⚠️ لطفاً برای سرویس دوره‌ای اقدام کنید!`;
}

/**
 * ارسال پیام به تلگرام
 */
async function sendTelegramMessage(chatId: string, message: string): Promise<{ success: boolean; error?: string }> {
  if (!telegramBotToken) {
    return { success: false, error: "TELEGRAM_BOT_TOKEN not configured" };
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
        }),
      }
    );

    if (response.ok) {
      console.log(`✅ Telegram message sent to ${chatId}`);
      return { success: true };
    } else {
      const error = await response.text();
      console.error(`❌ Telegram error: ${response.status} - ${error}`);
      return { success: false, error: `HTTP ${response.status}: ${error}` };
    }
  } catch (error) {
    console.error(`❌ Telegram send error:`, error);
    return { success: false, error: error.message || "Unknown error" };
  }
}

/**
 * ارسال اعلان تلگرام برای یک نوتیفیکیشن
 * 
 * این تابع **فقط و فقط** مسئولیت ارسال اعلان تلگرام را دارد:
 * 1. دریافت نوتیفیکیشن از دیتابیس (با notificationId)
 * 2. بررسی تنظیمات تلگرام کاربر
 * 3. ساخت پیام از metadata نوتیفیکیشن
 * 4. ارسال از طریق API تلگرام
 * 5. به‌روزرسانی notification_channels و sent_at در دیتابیس
 * 
 * ⚠️ توجه: این تابع:
 * - از زمان‌بندی اطلاع ندارد
 * - از سایر کانال‌ها اطلاع ندارد
 * - فقط و فقط ارسال تلگرام را انجام می‌دهد
 */
async function sendTelegramNotificationForNotification(notificationId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // دریافت نوتیفیکیشن
    const { data: notification, error: notificationError } = await supabase
      .from("notifications")
      .select("*")
      .eq("id", notificationId)
      .single();

    if (notificationError || !notification) {
      return { success: false, error: `Notification not found: ${notificationId}` };
    }

    // دریافت تنظیمات تلگرام کاربر
    const { data: telegramSettings, error: telegramError } = await supabase
      .from("telegram_settings")
      .select("chat_id")
      .eq("user_id", notification.user_id)
      .eq("is_enabled", true)
      .maybeSingle();

    if (telegramError) {
      console.error(`❌ Error fetching telegram settings for user ${notification.user_id}:`, telegramError);
      return { success: false, error: `Error fetching telegram settings: ${telegramError.message}` };
    }

    if (!telegramSettings?.chat_id) {
      console.log(`ℹ️ کاربر ${notification.user_id} تنظیمات تلگرام ندارد یا غیرفعال است`);
      return { success: false, error: "Telegram settings not found or disabled" };
    }

    // ساخت و ارسال پیام
    const chatId = telegramSettings.chat_id;
    const message = buildTelegramMessage(notification);
    const result = await sendTelegramMessage(chatId, message);

    // به‌روزرسانی notification_channels در دیتابیس
    const channels = notification.notification_channels || {};
    channels.telegram = {
      sent_at: result.success ? new Date().toISOString() : null,
      status: result.success ? "sent" : "failed",
      error: result.error || null,
    };

    const updateData: any = {
      notification_channels: channels,
      updated_at: new Date().toISOString(),
    };

    // اگر اولین ارسال موفق بود، sent_at را تنظیم کن
    if (result.success && !notification.sent_at) {
      updateData.sent_at = new Date().toISOString();
    }

    const { error: updateError } = await supabase
      .from("notifications")
      .update(updateData)
      .eq("id", notification.id);

    if (updateError) {
      console.error(`❌ Error updating notification ${notification.id}:`, updateError);
      return { success: false, error: `Error updating notification: ${updateError.message}` };
    }

    return result;
  } catch (error) {
    console.error(`❌ Error in sendTelegramNotificationForNotification:`, error);
    return { success: false, error: error.message || "Unknown error" };
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
    const body = await req.json();
    const { notificationId } = body;

    if (!notificationId) {
      return new Response(
        JSON.stringify({ error: "notificationId is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const result = await sendTelegramNotificationForNotification(notificationId);

    return new Response(
      JSON.stringify({
        success: result.success,
        message: result.success ? "Telegram notification sent" : "Failed to send telegram notification",
        error: result.error,
      }),
      {
        status: result.success ? 200 : 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
