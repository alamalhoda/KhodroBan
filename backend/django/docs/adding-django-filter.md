
```markdown
# راهنمای اضافه کردن django-filter به پروژه خودروبان

این سند مراحل دقیق و گام‌به‌گام اضافه کردن کتابخانه **django-filter** به پروژه Django/DRF را توضیح می‌دهد.  
هدف: امکان فیلتر پیشرفته، جستجو و مرتب‌سازی در APIها (مثل لیست خودروها، سرویس‌ها، نوتیفیکیشن‌ها و ...)

**آخرین به‌روزرسانی:** ژانویه ۲۰۲۶  
**نسخه پیشنهادی django-filter:** 24.3 یا بالاتر

## ۱. چرا django-filter؟

- فیلتر کردن لیست‌ها با query parameterهای ساده و قدرتمند
- پشتیبانی از lookupهای مختلف (exact, icontains, gte, lte, in و ...)
- ادغام عالی با DRF ViewSetها
- امکان جستجو (search) و مرتب‌سازی (ordering) همزمان
- کاهش کد تکراری در viewها

## ۲. مراحل نصب و تنظیم اولیه

### مرحله ۱: نصب پکیج

```bash
pip install django-filter
```

**یا** اگر از requirements استفاده می‌کنید:

```text
# requirements.txt یا requirements-dev.txt
django-filter>=24.3
```

### مرحله ۲: اضافه کردن به INSTALLED_APPS

فایل `settings.py`:

```python
INSTALLED_APPS = [
    # ... بقیه اپ‌ها
    'django_filters',               # ← این خط را اضافه کنید
    'rest_framework',
    'khodroban.apps.KhodrobanConfig',
    # ...
]
```

### مرحله ۳: تنظیم پیش‌فرض در DRF (توصیه‌شده)

در همان `settings.py`، backend فیلتر را به صورت پیش‌فرض فعال کنید:

```python
REST_FRAMEWORK = {
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    # بقیه تنظیمات قبلی...
}
```

این کار باعث می‌شود تمام ViewSetها به صورت خودکار از فیلتر پشتیبانی کنند.

## ۳. ساخت فایل فیلترها

پیشنهاد می‌شود تمام FilterSetها را در یک فایل جداگانه بگذارید:

ایجاد فایل جدید: `khodroban/filters.py`

```python
# khodroban/filters.py
from django_filters import rest_framework as filters
from .models import (
    Vehicle, Service, DailyExpense, Notification, ReminderSetting
)


class VehicleFilter(filters.FilterSet):
    model = filters.CharFilter(lookup_expr='icontains')
    plate_number = filters.CharFilter(lookup_expr='icontains')
    year = filters.NumberFilter()
    year__gte = filters.NumberFilter(field_name='year', lookup_expr='gte')
    year__lte = filters.NumberFilter(field_name='year', lookup_expr='lte')
    current_km__gte = filters.NumberFilter(field_name='current_km', lookup_expr='gte')
    current_km__lte = filters.NumberFilter(field_name='current_km', lookup_expr='lte')

    class Meta:
        model = Vehicle
        fields = [
            'model', 'plate_number', 'year', 'current_km',
        ]


class ServiceFilter(filters.FilterSet):
    service_date__gte = filters.DateFilter(field_name='service_date_gregorian', lookup_expr='gte')
    service_date__lte = filters.DateFilter(field_name='service_date_gregorian', lookup_expr='lte')
    total_cost__gte = filters.NumberFilter(field_name='total_cost', lookup_expr='gte')
    total_cost__lte = filters.NumberFilter(field_name='total_cost', lookup_expr='lte')

    class Meta:
        model = Service
        fields = ['service_date_gregorian', 'total_cost']


class NotificationFilter(filters.FilterSet):
    type = filters.ChoiceFilter(choices=Notification.type.field.choices)
    read = filters.BooleanFilter()
    created_after = filters.DateTimeFilter(field_name='created_at', lookup_expr='gte')
    created_before = filters.DateTimeFilter(field_name='created_at', lookup_expr='lte')

    class Meta:
        model = Notification
        fields = ['type', 'read', 'created_at']


class ReminderSettingFilter(filters.FilterSet):
    reminder_mode = filters.ChoiceFilter(choices=ReminderSetting.reminder_mode.field.choices)
    is_enabled = filters.BooleanFilter()

    class Meta:
        model = ReminderSetting
        fields = ['reminder_mode', 'is_enabled']
```

## ۴. استفاده در ViewSetها

هر ViewSet که می‌خواهید فیلتر داشته باشد، این سه خط را اضافه کنید:

```python
from .filters import VehicleFilter, NotificationFilter  # یا هر فیلتر دیگری

class VehicleViewSet(viewsets.ModelViewSet):
    serializer_class = VehicleSerializer
    permission_classes = [IsAuthenticated]
    
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = VehicleFilter                       # ← فیلتر اصلی
    search_fields = ['model', 'plate_number']             # جستجوی متنی
    ordering_fields = ['year', 'current_km', 'updated_at'] # مرتب‌سازی مجاز
    ordering = ['-updated_at']                            # پیش‌فرض مرتب‌سازی

    def get_queryset(self):
        return Vehicle.objects.filter(user_profile=self.request.user.userprofile)
```

همین کار را برای بقیه ViewSetها (مثل NotificationViewSet، ServiceViewSet و ...) تکرار کنید.

## ۵. مثال درخواست‌های فیلتر در API

| درخواست نمونه                                              | توضیحات                                                |
|-------------------------------------------------------------|--------------------------------------------------------|
| `/api/vehicles/?model=پژو&year__gte=1398`                    | خودروهای پژو از سال ۱۳۹۸ به بعد                      |
| `/api/vehicles/?current_km__lte=100000&ordering=-current_km` | خودروهایی با کمتر از ۱۰۰ هزار کیلومتر، مرتب نزولی    |
| `/api/notifications/?read=false&type=reminder`              | نوتیفیکیشن‌های خوانده‌نشده از نوع یادآوری           |
| `/api/services/?service_date__gte=2025-01-01`               | سرویس‌های از ابتدای سال ۲۰۲۵ به بعد                  |

## ۶. نکات مهم و بهترین تمرین‌ها

- از `select_related` و `prefetch_related` در get_queryset استفاده کنید تا N+1 query پیش نیاید.
- برای فیلدهای JSONField (مثل metadata در Notification) از `filters.JSONFieldFilter` یا `filters.LookupChoiceFilter` استفاده کنید.
- اگر تاریخ شمسی دارید، از پکیج `django-jalali` یا تبدیل دستی استفاده کنید.
- در محیط تولید rate limiting را فعال کنید تا از درخواست‌های سنگین جلوگیری شود.
- تست‌های فیلتر را فراموش نکنید (مثلاً در `test_api_vehicles.py`):

```python
def test_vehicle_filter_by_model(self):
    self.client.force_authenticate(self.user)
    response = self.client.get('/api/vehicles/?model=پژو')
    self.assertEqual(response.status_code, 200)
```

## ۷. عیب‌یابی رایج

| مشکل                              | راه‌حل احتمالی                                      |
|------------------------------------|-------------------------------------------------------|
| فیلتر کار نمی‌کند                 | مطمئن شوید `filterset_class` یا `filter_backends` تنظیم شده |
| خطای "Invalid filter"             | نام فیلتر اشتباه است یا lookup پشتیبانی نمی‌شود     |
| کندی زیاد در لیست بزرگ            | از `select_related` و `prefetch_related` استفاده کنید |
| تاریخ شمسی فیلتر نمی‌شود         | تاریخ را به میلادی تبدیل کنید قبل از فیلتر          |

اگر سؤالی در پیاده‌سازی یا نوشتن فیلتر خاص (مثلاً برای Reminder یا ServiceItem) داشتی، بپرس تا دقیق کمک کنم.

موفق باشی!
```

این فایل راهنما را می‌توانید مستقیماً در پروژه ذخیره کنید و هر زمان که نیاز به یادآوری یا اضافه کردن هم‌تیمی داشتید، از آن استفاده کنید.  
اگر بخشی نیاز به گسترش یا تغییر دارد (مثلاً مثال فیلتر برای مدل خاصی)، بگو تا اصلاح کنم.