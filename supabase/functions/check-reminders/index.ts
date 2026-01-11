import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// ایجاد Supabase client با Service Role Key برای دسترسی کامل
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * بررسی یادآورها و ایجاد نوتیفیکیشن‌ها
 * 
 * این تابع فقط:
 * 1. یادآورهای نیازمند را بررسی می‌کند (Reminder Logic)
 * 2. نوتیفیکیشن‌ها را در جدول notifications ایجاد می‌کند (Notification Creation)
 * 
 * ⚠️ توجه: این تابع اعلان ارسال نمی‌کند!
 * ارسال اعلان‌ها توسط Edge Function جداگانه send-notifications انجام می‌شود.
 */
async function checkRemindersAndCreateNotifications() {
  console.log("=".repeat(50));
  console.log("شروع بررسی یادآوری‌های سرویس دوره‌ای...");

  try {
    // دریافت خودروهای نیازمند یادآوری از تابع دیتابیس
    const { data: vehicles, error: vehiclesError } = await supabase.rpc(
      "get_vehicles_for_reminder"
    );

    if (vehiclesError) {
      throw new Error(`Error fetching vehicles: ${vehiclesError.message}`);
    }

    if (!vehicles || vehicles.length === 0) {
      console.log("هیچ خودرویی برای یادآوری پیدا نشد");
      return { success: true, processed: 0 };
    }

    console.log(`تعداد ${vehicles.length} خودرو برای بررسی`);

    let processed = 0;
    let notificationsCreated = 0;

    for (const vehicle of vehicles) {
      try {
        // خواندن آخرین سرویس
        const { data: lastServiceData, error: serviceError } = await supabase
          .from("services")
          .select("*")
          .eq("vehicle_id", vehicle.vehicle_id)
          .order("service_date_gregorian", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (serviceError) {
          console.error(
            `❌ Error fetching service for vehicle ${vehicle.vehicle_id}:`,
            serviceError
          );
          continue;
        }

        if (!lastServiceData) {
          console.warn(
            `خودرو ${vehicle.model} - سرویسی ثبت نشده`
          );
          continue;
        }

        // محاسبه روزهای مانده (Reminder Logic)
        const lastDate = new Date(lastServiceData.service_date_gregorian);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        lastDate.setHours(0, 0, 0, 0);

        const daysSinceLast = Math.floor(
          (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        const intervalDays = vehicle.interval_days;
        const daysUntilDue = intervalDays - daysSinceLast;
        const warningDays = vehicle.warning_days_before;

        // بررسی آیا در بازه هشدار است؟ (Reminder Check)
        if (daysUntilDue > 0 && daysUntilDue <= warningDays) {
          // بررسی اینکه قبلاً برای این موعد نوتیفیکیشن ایجاد نشده باشد
          const dueDate = new Date(lastDate);
          dueDate.setDate(dueDate.getDate() + intervalDays);

          const { data: existingNotifications, error: existingError } =
            await supabase
              .from("notifications")
              .select("*")
              .eq("vehicle_id", vehicle.vehicle_id)
              .eq("type", "reminder")
              .eq("read", false)
              .gte(
                "created_at",
                new Date(Date.now() - (warningDays + 1) * 24 * 60 * 60 * 1000)
                  .toISOString()
              )
              .execute();

          // بررسی اینکه آیا نوتیفیکیشن با همان days_until_due وجود دارد
          let notificationExists = false;
          if (existingNotifications) {
            for (const notif of existingNotifications) {
              const metadata = notif.metadata || {};
              if (metadata.days_until_due === daysUntilDue) {
                notificationExists = true;
                break;
              }
            }
          }

          if (notificationExists) {
            console.log(
              `✅ نوتیفیکیشن قبلاً ایجاد شده: ${vehicle.model} - ${daysUntilDue} روز مانده`
            );
            continue;
          }

          // ایجاد نوتیفیکیشن (Notification Creation)
          const notification = {
            user_id: vehicle.user_id,
            vehicle_id: vehicle.vehicle_id,
            title: "یادآوری سرویس دوره‌ای",
            body: `خودرو ${vehicle.model} (${vehicle.plate_number}) نیاز به سرویس دوره‌ای دارد. ${daysUntilDue} روز تا موعد (${intervalDays} روز) باقی مانده است.`,
            type: "reminder",
            metadata: {
              vehicle_model: vehicle.model,
              plate_number: vehicle.plate_number,
              days_until_due: daysUntilDue,
              interval_days: intervalDays,
              last_service_date: lastServiceData.service_date_gregorian,
              due_date: dueDate.toISOString().split("T")[0],
            },
          };

          const { data: notificationResult, error: notificationError } =
            await supabase.from("notifications").insert(notification).select().single();

          if (notificationError) {
            console.error(
              `❌ Error creating notification for ${vehicle.model}:`,
              notificationError
            );
            continue;
          }

          if (notificationResult) {
            notificationsCreated++;
            console.log(
              `✅ نوتیفیکیشن ایجاد شد: ${vehicle.model} - ${daysUntilDue} روز مانده (موعد: ${intervalDays} روز)`
            );
            // توجه: ارسال اعلان توسط Edge Function جداگانه send-notifications انجام می‌شود
          }
        }

        processed++;
      } catch (error) {
        console.error(
          `❌ Error processing vehicle ${vehicle.model || "unknown"}:`,
          error
        );
        continue;
      }
    }

    console.log("✅ پایان بررسی یادآوری‌ها");
    console.log(`📊 خلاصه: ${processed} خودرو بررسی شد، ${notificationsCreated} نوتیفیکیشن ایجاد شد`);
    console.log("=".repeat(50));

    return {
      success: true,
      processed,
      notificationsCreated,
    };
  } catch (error) {
    console.error("❌ Error in checkRemindersAndCreateNotifications:", error);
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
    const result = await checkRemindersAndCreateNotifications();
    return new Response(
      JSON.stringify({
        message: "Reminders checked and notifications created (not sent yet)",
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
