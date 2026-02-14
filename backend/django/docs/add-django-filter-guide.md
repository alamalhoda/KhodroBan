# راهنمای کامل اضافه کردن django-filter به پروژه

**آخرین به‌روزرسانی:** ژانویه ۲۰۲۶
**هدف:** فعال‌سازی فیلترهای پیشرفته و کاربرپسند در APIهای پروژه (جستجو، فیلتر عددی، تاریخ، انتخابی و ...)

## چرا django-filter را اضافه کنیم؟

- امکان فیلتر کردن لیست‌ها با query parameterهای ساده و خوانامثال: `/api/vehicles/?model=پژو&year__gte=1398&current_km__lte=100000`
- پشتیبانی کامل از DRF و ادغام بسیار راحت
- امکان فیلتر روی تمام انواع فیلد (CharField, IntegerField, DateField, JSONField و ...)
- ساخت فیلترهای سفارشی بسیار راحت
- تجربه کاربری بهتری برای frontend و تست با Postman

## مراحل اضافه کردن (گام به گام)

### مرحله ۱ – نصب پکیج

```bash
pip install django-filter
```


### مرحله ۲ – اضافه کردن به INSTALLED_APPS

INSTALLED_APPS = [
    # ... بقیه اپ‌ها
    'django_filters',               # ← این خط را اضافه کنید
    'rest_framework',
    'khodroban.apps.KhodrobanConfig',
    # ...
]


### مرحله ۳ – تنظیمات پیشنهادی در settings.py (توصیه می‌شود)


# settings.py

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        # ...
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    # اضافه کردن backend فیلتر به صورت پیش‌فرض
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    # اختیاری - نام پارامترهای فیلتر در url
    'SEARCH_PARAM': 'search',
    'ORDERING_PARAM': 'ordering',
}



### مرحله ۴ – ساخت فایل فیلترها (پیشنهاد ساختار)



mkdir -p khodroban/filters
touch khodroban/filters/__init__.py
touch khodroban/filters/vehicles.py
touch khodroban/filters/notifications.py

# و سایر مدل‌ها...

**نمونه – khodroban/filters/vehicles.py**


import django_filters
from khodroban.models import Vehicle

class VehicleFilter(django_filters.FilterSet):
    # جستجوی متنی (شامل)
    model = django_filters.CharFilter(lookup_expr='icontains')
    plate_number = django_filters.CharFilter(lookup_expr='icontains')

    # فیلتر عددی (بزرگ‌تر مساوی، کوچک‌تر مساوی)
    year__gte = django_filters.NumberFilter(field_name='year', lookup_expr='gte')
    year__lte = django_filters.NumberFilter(field_name='year', lookup_expr='lte')

    current_km__gte = django_filters.NumberFilter(field_name='current_km', lookup_expr='gte')
    current_km__lte = django_filters.NumberFilter(field_name='current_km', lookup_expr='lte')

    # فیلتر انتخابی (دقیق)
    user_profile = django_filters.ModelChoiceFilter(queryset=UserProfile.objects.all())

    class Meta:
        model = Vehicle
        fields = [
            # فیلدهایی که می‌خواهید فیلتر شوند
            'model',
            'plate_number',
            'year',
            'current_km',
            'user_profile',
        ]

    # می‌توانید متدهای سفارشی هم اضافه کنید
    # مثال:
    # def filter_custom(self, queryset, name, value):
    #     ...



### مرحله ۵ – استفاده در ViewSetها


# khodroban/views.py

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from .filters import VehicleFilter

class VehicleViewSet(viewsets.ModelViewSet):
    serializer_class = VehicleSerializer
    permission_classes = [IsAuthenticated]

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_class = VehicleFilter                # ← فیلتر اصلی
    search_fields = ['model', 'plate_number']      # جستجو
    ordering_fields = ['year', 'current_km', 'updated_at']
    ordering = ['-updated_at']

    def get_queryset(self):
        return Vehicle.objects.filter(user_profile=self.request.user.userprofile)


### مرحله ۶ – تست کردن فیلترها (چند نمونه درخواست)

GET /api/vehicles/?model=پژو
GET /api/vehicles/?year__gte=1398&year__lte=1403
GET /api/vehicles/?current_km__gte=50000&current_km__lte=120000
GET /api/vehicles/?search=206&ordering=-current_km
GET /api/vehicles/?plate_number__icontains=ب


### مرحله ۷ – پیشنهادهای تکمیلی (اختیاری ولی توصیه‌شده)


1. **فیلتر تاریخ شمسی**
   اگر از تاریخ شمسی استفاده می‌کنید، می‌توانید از **django-jalali** + فیلتر سفارشی استفاده کنید.
2. **فیلتر روی JSONField**
   مثال برای metadata در Notification:
   **Python**

   ```
   metadata__has_key = django_filters.CharFilter(field_name='metadata', lookup_expr='has_key')
   metadata__contains = django_filters.CharFilter(field_name='metadata', lookup_expr='contains')
   ```
3. **فیلتر انتخابی پیشرفته (ChoiceFilter)**
   برای فیلدهایی مثل status در Reminder:
   **Python**

   ```
   status = django_filters.ChoiceFilter(choices=Reminder.STATUS_CHOICES)
   ```

### چک لیست نهایی بعد از اضافه کردن

* پکیج نصب شده باشد
* به INSTALLED_APPS اضافه شده باشد
* DEFAULT_FILTER_BACKENDS در REST_FRAMEWORK تنظیم شده باشد
* حداقل یک FilterSet ساخته شده باشد
* حداقل یک ViewSet از filterset_class استفاده کند
* با Postman یا مرورگر چند فیلتر تست شده باشد
