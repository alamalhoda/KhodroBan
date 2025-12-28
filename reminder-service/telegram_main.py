import os
import requests
from supabase import create_client, Client
from datetime import datetime, timedelta
import schedule
import time
import logging
from dotenv import load_dotenv
import sys

# بارگذاری متغیرهای محیطی
load_dotenv()

# تنظیمات لاگ
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)

# متغیرها
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
TELEGRAM_BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN")
CRON_TIME = os.environ.get("CRON_TIME", "08:00")

# بررسی متغیرهای ضروری
if not TELEGRAM_BOT_TOKEN:
    logging.error("❌ خطا: متغیر TELEGRAM_BOT_TOKEN تنظیم نشده است")
    sys.exit(1)

# ایجاد کلاینت Supabase
try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    logging.info("✅ اتصال به Supabase برقرار شد")
except Exception as e:
    logging.error(f"❌ خطا در اتصال به Supabase: {str(e)}")
    sys.exit(1)

def send_telegram_message(chat_id, message, buttons=None):
    """
    ارسال پیام به تلگرام
    """
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    
    payload = {
        "chat_id": chat_id,
        "text": message,
        "parse_mode": "HTML"
    }
    
    # اضافه کردن دکمه‌ها (اختیاری)
    if buttons:
        payload["reply_markup"] = {"inline_keyboard": buttons}
    
    try:
        response = requests.post(url, json=payload, timeout=10)
        return response.json()
    except Exception as e:
        logging.error(f"❌ خطا در ارسال به تلگرام: {str(e)}")
        return None

def check_reminders_and_send_telegram():
    """
    بررسی یادآورها و ارسال به تلگرام
    """
    logging.info("=" * 60)
    logging.info("شروع بررسی یادآورهای تلگرام...")
    
    try:
        # خواندن خودروهای فعال
        vehicles_response = supabase.rpc('get_vehicles_for_reminder').execute()
        
        if not vehicles_response.data:
            logging.info("هیچ خودرویی برای یادآوری پیدا نشد")
            return
        
        logging.info(f"تعداد {len(vehicles_response.data)} خودرو برای بررسی")
        
        for vehicle in vehicles_response.data:
            try:
                # خواندن آخرین سرویس
                last_service = supabase.table("services") \
                    .select("*") \
                    .eq("vehicle_id", vehicle["vehicle_id"]) \
                    .order("service_date_gregorian", desc=True) \
                    .limit(1) \
                    .execute()
                
                if not last_service.data:
                    logging.warning(f"خودرو {vehicle['model']} - سرویسی ثبت نشده")
                    continue
                
                last_date = datetime.strptime(
                    last_service.data[0]["service_date_gregorian"], 
                    "%Y-%m-%d"
                ).date()
                
                # محاسبه روزهای مانده
                days_since_last = (datetime.now().date() - last_date).days
                interval_days = vehicle["interval_days"]
                days_until_due = interval_days - days_since_last
                warning_days = vehicle["warning_days_before"]
                
                if 0 < days_until_due <= warning_days:
                    # بررسی تکرار
                    existing = supabase.table("notifications") \
                        .select("*") \
                        .eq("vehicle_id", vehicle["vehicle_id"]) \
                        .eq("type", "reminder") \
                        .eq("read", False) \
                        .gte("created_at", (datetime.now() - timedelta(days=warning_days + 1)).isoformat()) \
                        .execute()
                    
                    notification_exists = False
                    if existing.data:
                        for notif in existing.data:
                            metadata = notif.get("metadata", {})
                            if metadata.get("days_until_due") == days_until_due:
                                notification_exists = True
                                break
                    
                    if notification_exists:
                        logging.info(f"✅ یادآوری قبلاً ارسال شده: {vehicle['model']}")
                        continue
                    
                    # ایجاد نوتیفیکیشن در دیتابیس
                    notification = {
                        "user_id": vehicle["user_id"],
                        "vehicle_id": vehicle["vehicle_id"],
                        "title": "یادآوری سرویس دوره‌ای",
                        "body": f"خودرو {vehicle['model']} ({vehicle['plate_number']}) نیاز به سرویس دارد. {days_until_due} روز مانده.",
                        "type": "reminder",
                        "metadata": {
                            "vehicle_model": vehicle["model"],
                            "plate_number": vehicle["plate_number"],
                            "days_until_due": days_until_due,
                            "interval_days": interval_days,
                            "last_service_date": last_service.data[0]["service_date_gregorian"],
                            "due_date": (last_date + timedelta(days=interval_days)).isoformat()
                        }
                    }
                    
                    result = supabase.table("notifications").insert(notification).execute()
                    
                    if result.data:
                        # ارسال به تلگرام
                        telegram_users = supabase.table("telegram_users") \
                            .select("*") \
                            .eq("user_id", vehicle["user_id"]) \
                            .eq("is_active", True) \
                            .execute()
                        
                        if telegram_users.data:
                            for user in telegram_users.data:
                                chat_id = user["chat_id"]
                                
                                # پیام زیبا
                                message = f"""
🔔 <b>یادآوری سرویس دوره‌ای</b>

🚗 <b>خودرو:</b> {vehicle['model']}
📋 <b>پلاک:</b> {vehicle['plate_number']}
⏰ <b>روزهای مانده:</b> {days_until_due} روز
📅 <b>موعد سرویس:</b> هر {interval_days} روز

لطفاً برای سرویس دوره‌ای اقدام کنید.
                                """
                                
                                # دکمه‌ها
                                buttons = [
                                    [
                                        {"text": "✅ انجام شد", "callback_data": f"done_{vehicle['vehicle_id']}_{days_until_due}"},
                                        {"text": "ℹ️ جزئیات", "callback_data": f"details_{vehicle['vehicle_id']}"}
                                    ]
                                ]
                                
                                response = send_telegram_message(chat_id, message, buttons)
                                
                                if response and response.get("ok"):
                                    logging.info(f"✅ تلگرام ارسال شد: {vehicle['model']} به {chat_id}")
                                else:
                                    logging.error(f"❌ خطا در ارسال: {response}")
                        else:
                            logging.warning(f"⚠️ کاربر تلگرامی برای {vehicle['model']} ثبت نشده")
                    
            except Exception as e:
                logging.error(f"❌ خطا در پردازش خودرو {vehicle.get('model', 'unknown')}: {str(e)}")
                continue
        
        logging.info("✅ پایان بررسی")
        logging.info("=" * 60)
    
    except Exception as e:
        logging.error(f"❌ خطا: {str(e)}")

def main():
    logging.info("سرویس یادآوری تلگرام شروع شد...")
    logging.info(f"زمان اجرا: {CRON_TIME}")
    
    # تنظیم Cron Job
    schedule.every().day.at(CRON_TIME).do(check_reminders_and_send_telegram)
    
    # اجرای اولیه برای تست
    logging.info("اجرای اولیه برای تست...")
    check_reminders_and_send_telegram()
    
    # حلقه اصلی
    while True:
        schedule.run_pending()
        time.sleep(60)

if __name__ == "__main__":
    main()

