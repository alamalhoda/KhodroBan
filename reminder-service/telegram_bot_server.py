from flask import Flask, request, jsonify
from supabase import create_client
import os
import logging
import requests

app = Flask(__name__)

# تنظیمات
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
logging.basicConfig(level=logging.INFO)

def send_message(chat_id, text):
    """ارسال پیام به تلگرام"""
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    requests.post(url, json={"chat_id": chat_id, "text": text, "parse_mode": "HTML"})

@app.route('/webhook', methods=['POST'])
def webhook():
    """دریافت پیام‌های تلگرام"""
    data = request.json
    message = data.get("message", {})
    callback_query = data.get("callback_query")
    
    # اگر دکمه‌ای زده شد
    if callback_query:
        chat_id = callback_query["message"]["chat"]["id"]
        data_callback = callback_query["data"]
        user = callback_query["from"]
        
        logging.info(f"دکمه زده شد: {data_callback} توسط {user['id']}")
        
        # پردازش دکمه‌ها
        if data_callback.startswith("done_"):
            parts = data_callback.split("_")
            vehicle_id = parts[1]
            days_until_due = parts[2]
            
            # ثبت انجام سرویس (اختیاری)
            send_message(chat_id, f"✅ سرویس خودرو {vehicle_id} ثبت شد!")
        
        elif data_callback.startswith("details_"):
            vehicle_id = data_callback.split("_")[1]
            send_message(chat_id, f"ℹ️ جزئیات خودرو {vehicle_id}")
        
        return jsonify({"status": "ok"})
    
    # اگر پیام متنی بود
    chat = message.get("chat", {})
    chat_id = chat.get("id")
    text = message.get("text", "")
    user = message.get("from", {})
    
    logging.info(f"پیام از: {chat_id}, متن: {text}")
    
    # دستور /start
    if text.startswith("/start"):
        parts = text.split(" ")
        user_id = None
        if len(parts) > 1:
            user_id = parts[1]
        
        if not user_id:
            send_message(chat_id, """
سلام! 👋

برای فعال‌سازی یادآوری:
1. به داشبورد بروید
2. به بخش "اتصال تلگرام" بروید
3. روی دکمه کلیک کنید
            """)
            return jsonify({"status": "ok"})
        
        # ذخیره در دیتابیس
        try:
            supabase.table("telegram_users").upsert({
                "user_id": user_id,
                "chat_id": chat_id,
                "username": user.get("username"),
                "first_name": user.get("first_name"),
                "is_active": True
            }).execute()
            
            send_message(chat_id, """
✅ **اتصال موفق!**

از این به بعد:
- هر روز یادآوری سرویس دوره‌ای دریافت خواهید کرد
- همه چیز خودکار است
- می‌توانید هر لحظه دستور `/status` بزنید

موفق باشید! 🚗
            """)
            
        except Exception as e:
            logging.error(f"خطا: {e}")
            send_message(chat_id, "❌ خطا در ذخیره اطلاعات")
    
    # دستور /status
    elif text == "/status":
        send_message(chat_id, "وضعیت: در حال بررسی...")
    
    # دستور /help
    elif text == "/help":
        send_message(chat_id, """
راهنما:

/start [user_id] - اتصال حساب
/status - وضعیت یادآوری‌ها
/help - این راهنما
        """)
    
    return jsonify({"status": "ok"})

@app.route('/set_webhook', methods=['GET'])
def set_webhook():
    """تنظیم Webhook (یک‌بار اجرا کنید)"""
    webhook_url = os.getenv("WEBHOOK_URL")
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/setWebhook"
    response = requests.post(url, json={"url": webhook_url})
    return jsonify(response.json())

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

