import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// ایجاد Supabase client با Service Role Key برای دسترسی کامل
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * فراخوانی Edge Function send-telegram-notification برای ارسال اعلان تلگرام
 */
async function sendNotificationViaTelegram(notificationId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const functionUrl = `${supabaseUrl}/functions/v1/send-telegram-notification`;
    
    const response = await fetch(functionUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${supabaseServiceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ notificationId }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`❌ Error calling send-telegram-notification: ${response.status} - ${error}`);
      return { success: false, error: `HTTP ${response.status}: ${error}` };
    }

    const result = await response.json();
    return { success: result.success, error: result.error };
  } catch (error) {
    console.error(`❌ Error calling send-telegram-notification:`, error);
    return { success: false, error: error.message || "Unknown error" };
  }
}

/**
 * پردازش و ارسال اعلان‌های ارسال نشده
 * 
 * این تابع:
 * 1. نوتیفیکیشن‌های ارسال نشده را از جدول notifications می‌خواند
 * 2. برای هر کانال، Edge Function مستقل مربوطه را فراخوانی می‌کند
 *    - تلگرام: send-telegram-notification
 *    - SMS: send-sms-notification (آینده)
 *    - Email: send-email-notification (آینده)
 *    - Push: send-push-notification (آینده)
 *    - API: send-api-notification (آینده)
 * 
 * ⚠️ توجه: این تابع خودش اعلان ارسال نمی‌کند!
 * فقط Edge Function‌های کانال‌ها را فراخوانی می‌کند.
 * هر Edge Function کانال، خودش وضعیت را در notification_channels به‌روزرسانی می‌کند.
 */
async function processAndSendNotifications() {
  console.log("=".repeat(50));
  console.log("شروع پردازش و ارسال اعلان‌ها...");

  try {
    // دریافت نوتیفیکیشن‌های ارسال نشده (sent_at IS NULL)
    // محدود به 100 تا برای جلوگیری از timeout
    const { data: notifications, error: notificationsError } = await supabase
      .from("notifications")
      .select("*")
      .is("sent_at", null)
      .order("created_at", { ascending: true })
      .limit(100);

    if (notificationsError) {
      throw new Error(`Error fetching notifications: ${notificationsError.message}`);
    }

    if (!notifications || notifications.length === 0) {
      console.log("هیچ نوتیفیکیشن ارسال نشده‌ای پیدا نشد");
      return { success: true, processed: 0 };
    }

    console.log(`تعداد ${notifications.length} نوتیفیکیشن برای ارسال`);

    let processed = 0;
    let telegramSent = 0;
    let telegramFailed = 0;

    for (const notification of notifications) {
      try {
        // بررسی اینکه آیا قبلاً از طریق تلگرام ارسال شده یا نه
        const channels = notification.notification_channels || {};
        const telegramStatus = channels.telegram?.status;

        // اگر قبلاً ارسال نشده یا failed بود، دوباره تلاش کن
        if (!telegramStatus || telegramStatus === "failed") {
          const result = await sendNotificationViaTelegram(notification.id);
          if (result.success) {
            telegramSent++;
          } else {
            telegramFailed++;
            console.error(`❌ Failed to send telegram notification for ${notification.id}: ${result.error}`);
          }
        } else {
          console.log(`ℹ️ نوتیفیکیشن ${notification.id} قبلاً از طریق تلگرام ارسال شده`);
        }

        // TODO: در آینده کانال‌های دیگر را اضافه کنید:
        // - SMS: await sendNotificationViaSMS(notification.id);
        // - Email: await sendNotificationViaEmail(notification.id);
        // - Push: await sendNotificationViaPush(notification.id);
        // - API: await sendNotificationViaAPI(notification.id);

        processed++;
      } catch (error) {
        console.error(
          `❌ Error processing notification ${notification.id}:`,
          error
        );
        continue;
      }
    }

    console.log("✅ پایان پردازش اعلان‌ها");
    console.log(`📊 خلاصه: ${processed} نوتیفیکیشن پردازش شد، ${telegramSent} اعلان تلگرام ارسال شد، ${telegramFailed} ناموفق`);
    console.log("=".repeat(50));

    return {
      success: true,
      processed,
      telegramSent,
      telegramFailed,
    };
  } catch (error) {
    console.error("❌ Error in processAndSendNotifications:", error);
    throw error;
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
    const result = await processAndSendNotifications();
    return new Response(
      JSON.stringify({
        message: "Notifications processed and sent",
        ...result,
      }),
      {
        status: 200,
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
