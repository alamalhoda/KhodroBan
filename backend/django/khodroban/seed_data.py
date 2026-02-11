# khodroban/seed_data.py
"""
داده‌های مرجع seed برای service_types و expense_categories.
منبع: supabase/migrations/005_service_types_and_multi_select.sql (خطوط ۱۰۵–۱۶۴).
یک منبع حقیقت برای هم‌ترازی با Supabase و فرانت.
"""

# ۱۶ نوع سرویس — مطابق Supabase 005
SERVICE_TYPES_SEED = [
    {"code": "oil_change", "name": "تعویض روغن", "group_name": "موتور و روغن", "icon": "🔧", "is_active": True},
    {"code": "filter", "name": "فیلتر (هوا/روغن/بنزین)", "group_name": "موتور و روغن", "icon": "🔧", "is_active": True},
    {"code": "battery", "name": "باتری", "group_name": "موتور و روغن", "icon": "🔋", "is_active": True},
    {"code": "cooling", "name": "سیستم خنک‌کننده", "group_name": "موتور و روغن", "icon": "❄️", "is_active": True},
    {"code": "brakes", "name": "ترمز (لنت/دیسک)", "group_name": "ترمز و ایمنی", "icon": "🛡️", "is_active": True},
    {"code": "clutch", "name": "کلاچ", "group_name": "ترمز و ایمنی", "icon": "🛡️", "is_active": True},
    {"code": "tire", "name": "لاستیک", "group_name": "چرخ و تعلیق", "icon": "🚗", "is_active": True},
    {"code": "alignment", "name": "همراستایی", "group_name": "چرخ و تعلیق", "icon": "🚗", "is_active": True},
    {"code": "suspension", "name": "تعلیق", "group_name": "چرخ و تعلیق", "icon": "🚗", "is_active": True},
    {"code": "electrical", "name": "برق", "group_name": "برق و الکترونیک", "icon": "⚡", "is_active": True},
    {"code": "ac", "name": "کولر", "group_name": "برق و الکترونیک", "icon": "⚡", "is_active": True},
    {"code": "lighting", "name": "چراغ", "group_name": "برق و الکترونیک", "icon": "⚡", "is_active": True},
    {"code": "transmission", "name": "گیربکس", "group_name": "گیربکس و اگزوز", "icon": "⚙️", "is_active": True},
    {"code": "exhaust", "name": "اگزوز", "group_name": "گیربکس و اگزوز", "icon": "⚙️", "is_active": True},
    {"code": "body", "name": "بدنه", "group_name": "بدنه و شیشه", "icon": "🔲", "is_active": True},
    {"code": "glass", "name": "شیشه", "group_name": "بدنه و شیشه", "icon": "🔲", "is_active": True},
    {"code": "other", "name": "سایر", "group_name": "سایر", "icon": "📋", "is_active": True},
]

# ۱۷ دسته هزینه — مطابق Supabase 005
EXPENSE_CATEGORIES_SEED = [
    {"code": "fuel", "name": "سوخت", "group_name": "سوخت", "icon": "⛽", "is_active": True},
    {"code": "wash", "name": "کارواش", "group_name": "نگهداری و سرویس", "icon": "🚿", "is_active": True},
    {"code": "maintenance", "name": "نگهداری", "group_name": "نگهداری و سرویس", "icon": "🛠️", "is_active": True},
    {"code": "service", "name": "سرویس", "group_name": "نگهداری و سرویس", "icon": "⚙️", "is_active": True},
    {"code": "insurance", "name": "بیمه", "group_name": "اجباری و قانونی", "icon": "🛡️", "is_active": True},
    {"code": "tax", "name": "مالیات", "group_name": "اجباری و قانونی", "icon": "📄", "is_active": True},
    {"code": "registration", "name": "ثبت‌نام", "group_name": "اجباری و قانونی", "icon": "📋", "is_active": True},
    {"code": "fine", "name": "جریمه", "group_name": "جریمه و عوارض", "icon": "💸", "is_active": True},
    {"code": "toll", "name": "عوارض", "group_name": "جریمه و عوارض", "icon": "🛣️", "is_active": True},
    {"code": "parts", "name": "قطعات", "group_name": "قطعات و دستمزد", "icon": "🔩", "is_active": True},
    {"code": "labor", "name": "دستمزد", "group_name": "قطعات و دستمزد", "icon": "👷", "is_active": True},
    {"code": "accessories", "name": "لوازم جانبی", "group_name": "قطعات و دستمزد", "icon": "🎒", "is_active": True},
    {"code": "parking", "name": "پارکینگ", "group_name": "پارکینگ", "icon": "🅿️", "is_active": True},
    {"code": "minor_repair", "name": "تعمیرات جزئی", "group_name": "تعمیرات", "icon": "🔧", "is_active": True},
    {"code": "diagnostic", "name": "دیاگ", "group_name": "تعمیرات", "icon": "🔍", "is_active": True},
    {"code": "other", "name": "سایر", "group_name": "سایر", "icon": "📎", "is_active": True},
]
