# 🚀 شروع سریع سرویس تلگرام

## ۳ دقیقه تا اولین پیام!

---

## ۱. نصب (۱ دقیقه)

```bash
cd reminder-service
pip install -r telegram_requirements.txt
```

---

## ۲. تنظیم (۱ دقیقه)

```bash
cp telegram_env.example .env
# سپس .env را ویرایش کنید:
# - SUPABASE_URL
# - SUPABASE_SERVICE_ROLE_KEY
# - TELEGRAM_BOT_TOKEN (از @BotFather)
```

---

## ۳. اجرا (۱ دقیقه)

**ترمینال ۱:**
```bash
python telegram_main.py
```

**ترمینال ۲:**
```bash
python telegram_bot_server.py
```

**مرورگر:**
```
http://localhost:5000/set_webhook
```

---

## ✅ تمام!

**حالا:**
1. وارد داشبورد شوید
2. بروید به `/profile/telegram`
3. اتصال تلگرام را انجام دهید
4. پیام دریافت کنید!

---

## 📚 مستندات

- **کامل:** `../docs/technical/telegram-notification-system.md`
- **سریع:** `../docs/technical/telegram-quick-start.md`
- **چک‌لیست:** `../docs/technical/telegram-checklist.md`

---

**موفق باشید! 🚀**

