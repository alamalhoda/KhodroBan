# khodroban/models.py
"""
مدل‌های دامنه خدروبان.

قرارداد کلید اصلی:
- نام فیلد PK برای همه مدل‌ها «id» است (به‌جز UserProfile که PK آن رابطه OneToOne با User است).
- نوع PK:
  - BigAutoField: برای جدول‌هایی که احتمال رشد زیاد رکورد دارند (Service, ServiceItem, Vehicle, ...).
  - AutoField: برای جدول‌های مرجع کوچک (SubscriptionPlan, ServiceType, ServicePreset, ExpenseCategory).
  - UUIDField: برای موجودیت‌هایی که نیاز به شناسه یکتا در سطح توزیع‌شده یا عدم پیش‌بینی پذیری دارند (Reminder, Notification, TelegramSetting).
  استفاده از انواع مختلف مشکلی ایجاد نمی‌کند؛ هر مدل با توجه به نیازش انتخاب شده است.
"""
from pathlib import Path

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
import uuid


class SubscriptionPlan(models.Model):
    id = models.AutoField(primary_key=True)
    plan_code = models.CharField(max_length=20, unique=True)
    plan_name = models.CharField(max_length=100)
    max_vehicles = models.IntegerField(null=True, blank=True)
    allow_csv_export = models.BooleanField(default=True)
    allow_pdf_export = models.BooleanField(default=False)
    allow_sms_reminder = models.BooleanField(default=False)
    monthly_price = models.BigIntegerField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name = _("Subscription Plan")
        verbose_name_plural = _("Subscription Plans")

    def __str__(self):
        return self.plan_name

    def save(self, *args, **kwargs):
        self.updated_at = timezone.now()
        super().save(*args, **kwargs)


class UserProfile(models.Model):
    """کلید اصلی این مدل همان user (OneToOne با User) است تا با request.user.userprofile سازگار بماند."""
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name="userprofile",
    )
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    is_email_verified = models.BooleanField(default=False)
    tier = models.CharField(
        max_length=20,
        choices=[('free', 'Free'), ('pro', 'Pro'), ('pro+', 'Pro+')],
        default='free'
    )
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = _("User Profile")
        verbose_name_plural = _("User Profiles")
        indexes = [models.Index(fields=['tier'])]

    def __str__(self):
        return f"{self.user.username} ({self.tier})"

    def save(self, *args, **kwargs):
        self.updated_at = timezone.now()
        super().save(*args, **kwargs)


class UserSubscription(models.Model):
    id = models.BigAutoField(primary_key=True)
    user_profile = models.ForeignKey(
        UserProfile,
        on_delete=models.PROTECT,
        related_name="subscriptions",
    )
    plan = models.ForeignKey(
        SubscriptionPlan,
        on_delete=models.PROTECT,
        related_name="user_subscriptions",
    )
    start_date = models.DateField(default=timezone.now)
    end_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    auto_renew = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name = _("User Subscription")
        verbose_name_plural = _("User Subscriptions")

    def __str__(self):
        return f"{self.user_profile} - {self.plan.plan_code}"

    def save(self, *args, **kwargs):
        self.updated_at = timezone.now()
        super().save(*args, **kwargs)


class Vehicle(models.Model):
    id = models.BigAutoField(primary_key=True)
    user_profile = models.ForeignKey(
        UserProfile,
        on_delete=models.PROTECT,
        related_name="vehicles",
    )
    model = models.CharField(max_length=100)
    year = models.IntegerField()
    plate_number = models.CharField(max_length=20)
    current_km = models.IntegerField(default=0)
    description = models.TextField(blank=True, null=True)
    icon_name = models.CharField(max_length=50, blank=True, null=True, help_text=_("FontAwesome icon name, e.g. car"))
    icon_style = models.CharField(max_length=20, blank=True, null=True, default='solid', help_text=_("FontAwesome style: solid, regular, brands"))
    icon_color = models.CharField(max_length=20, blank=True, null=True, help_text=_("Hex color, e.g. #FF5733"))
    icon_color_secondary = models.CharField(max_length=20, blank=True, null=True, help_text=_("Duotone secondary layer hex color"))
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ('user_profile', 'plate_number')
        verbose_name = _("Vehicle")
        verbose_name_plural = _("Vehicles")
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.model} ({self.plate_number})"

    def clean(self):
        if self.year < 1300 or self.year > 1500:
            raise ValidationError(_("Year must be between 1300 and 1500"))
        if self.current_km < 0:
            raise ValidationError(_("Current KM cannot be negative"))

    def save(self, *args, **kwargs):
        self.full_clean()
        self.updated_at = timezone.now()
        super().save(*args, **kwargs)


def vehicle_image_upload_path(instance, filename):
    """مسیر ذخیره: vehicles/<vehicle_id>/<uuid>.<ext>"""
    ext = Path(filename).suffix.lower() if filename else '.jpg'
    return f"vehicles/{instance.vehicle_id}/{uuid.uuid4().hex}{ext}"


class VehicleImage(models.Model):
    """تصویر گالری خودرو. حداکثر ۱۵ تصویر به‌ازای هر خودرو؛ JPG/PNG/WebP؛ حداکثر ۵ مگابایت."""
    MAX_IMAGES_PER_VEHICLE = 15
    MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB
    ALLOWED_EXTENSIONS = ('.jpg', '.jpeg', '.png', '.webp')

    id = models.BigAutoField(primary_key=True)
    vehicle = models.ForeignKey(
        Vehicle,
        on_delete=models.CASCADE,
        related_name="images",
    )
    image = models.ImageField(
        upload_to=vehicle_image_upload_path,
        max_length=255,
        help_text=_("JPG/PNG/WebP, max 5MB"),
    )
    display_order = models.PositiveSmallIntegerField(default=0)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name = _("Vehicle Image")
        verbose_name_plural = _("Vehicle Images")
        ordering = ['display_order', 'created_at']
        constraints = [
            models.UniqueConstraint(
                fields=['vehicle', 'is_default'],
                condition=models.Q(is_default=True),
                name='unique_vehicle_default_image',
            ),
        ]

    def __str__(self):
        return f"Image for {self.vehicle} (order={self.display_order}, default={self.is_default})"

    def clean(self):
        if self.image:
            ext = Path(self.image.name).suffix.lower()
            if ext not in self.ALLOWED_EXTENSIONS:
                raise ValidationError(
                    _("Only JPG, PNG and WebP formats are allowed. Got: %(ext)s") % {'ext': ext}
                )
            if self.image.size > self.MAX_FILE_SIZE_BYTES:
                raise ValidationError(
                    _("File size must not exceed 5 MB. Current: %(size)s bytes")
                    % {'size': self.image.size}
                )
        if self.vehicle_id and self._state.adding:
            count = VehicleImage.objects.filter(vehicle_id=self.vehicle_id).count()
            if count >= self.MAX_IMAGES_PER_VEHICLE:
                raise ValidationError(
                    _("Maximum %(max)s images per vehicle allowed.") % {'max': self.MAX_IMAGES_PER_VEHICLE}
                )

    def save(self, *args, **kwargs):
        # قبل از full_clean() بقیهٔ پیش‌فرض‌ها را بردار تا constraint نقض نشود
        if self.is_default and self.vehicle_id:
            VehicleImage.objects.filter(vehicle_id=self.vehicle_id).exclude(pk=self.pk).update(is_default=False)
        self.full_clean()
        super().save(*args, **kwargs)


class ServiceType(models.Model):
    id = models.AutoField(primary_key=True)
    code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    group_name = models.CharField(max_length=50)
    icon = models.CharField(max_length=10)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name = _("Service Type")
        verbose_name_plural = _("Service Types")

    def __str__(self):
        return self.name


class ServicePreset(models.Model):
    """
    پیش‌تعریف انتخاب سریع سرویس (مثلاً «سرویس ۵۰۰۰» شامل روغن موتور و فیلتر).
    توسط ادمین تعریف می‌شود؛ کاربر با یک کلیک همه انواع سرویس داخل preset را انتخاب می‌کند.
    """
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    display_order = models.PositiveSmallIntegerField(default=0)
    service_types = models.ManyToManyField(
        ServiceType,
        related_name="presets",
        blank=True,
        help_text=_("انواع سرویس‌ای که با انتخاب این preset انتخاب می‌شوند"),
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name = _("Service Preset")
        verbose_name_plural = _("Service Presets")
        ordering = ["display_order", "name"]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        self.updated_at = timezone.now()
        super().save(*args, **kwargs)


class ExpenseCategory(models.Model):
    """دسته‌بندی هزینه (مثل سوخت، کارواش) — مرجع خواندنی برای فرانت."""
    id = models.AutoField(primary_key=True)
    code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    group_name = models.CharField(max_length=50)
    icon = models.CharField(max_length=10)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name = _("Expense Category")
        verbose_name_plural = _("Expense Categories")

    def __str__(self):
        return self.name


class Service(models.Model):
    id = models.BigAutoField(primary_key=True)
    vehicle = models.ForeignKey(
        Vehicle,
        on_delete=models.CASCADE,
        related_name="services",
    )
    service_date = models.DateField()
    service_date_gregorian = models.DateField()
    service_km = models.IntegerField()
    total_cost = models.BigIntegerField(default=0)
    general_note = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name = _("Service")
        verbose_name_plural = _("Services")
        ordering = ['-service_date_gregorian']

    def __str__(self):
        return f"Service {self.service_date} - {self.vehicle}"

    def clean(self):
        if self.service_km < 0:
            raise ValidationError(_("Service KM cannot be negative"))
        if self.total_cost < 0:
            raise ValidationError(_("Total cost cannot be negative"))

    def save(self, *args, **kwargs):
        self.full_clean()
        self.updated_at = timezone.now()
        super().save(*args, **kwargs)


class ServiceItem(models.Model):
    id = models.BigAutoField(primary_key=True)
    service = models.ForeignKey(
        Service,
        on_delete=models.CASCADE,
        related_name="items",
    )
    service_type = models.ForeignKey(
        ServiceType,
        on_delete=models.PROTECT,
        related_name="service_items",
    )
    cost = models.BigIntegerField(default=0)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ('service', 'service_type')
        verbose_name = _("Service Item")
        verbose_name_plural = _("Service Items")

    def __str__(self):
        return f"{self.service_type} - {self.service}"

    def clean(self):
        if self.cost < 0:
            raise ValidationError(_("Cost cannot be negative"))

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)


class DailyExpense(models.Model):
    id = models.BigAutoField(primary_key=True)
    vehicle = models.ForeignKey(
        Vehicle,
        on_delete=models.CASCADE,
        related_name="daily_expenses",
    )
    category = models.ForeignKey(
        ExpenseCategory,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="daily_expenses",
    )
    expense_date = models.DateField()
    expense_date_gregorian = models.DateField()
    amount = models.BigIntegerField()
    km_at_expense = models.IntegerField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name = _("Daily Expense")
        verbose_name_plural = _("Daily Expenses")
        ordering = ['-expense_date_gregorian']

    def __str__(self):
        return f"Expense {self.expense_date} - {self.amount:,}"

    def clean(self):
        if self.amount <= 0:
            raise ValidationError(_("Amount must be positive"))
        if self.km_at_expense is not None and self.km_at_expense < 0:
            raise ValidationError(_("KM at expense cannot be negative"))

    def save(self, *args, **kwargs):
        self.full_clean()
        self.updated_at = timezone.now()
        super().save(*args, **kwargs)


class ReminderSetting(models.Model):
    id = models.BigAutoField(primary_key=True)
    vehicle = models.OneToOneField(
        Vehicle,
        on_delete=models.CASCADE,
        related_name="reminder_setting",
    )
    interval_km = models.IntegerField(default=5000)
    interval_days = models.IntegerField(default=90)
    warning_km_before = models.IntegerField(default=500)
    warning_days_before = models.IntegerField(default=7)
    reminder_mode = models.CharField(
        max_length=20,
        choices=[('km', 'KM-based'), ('time', 'Time-based'), ('both', 'Both')],
        default='time'
    )
    is_enabled = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name = _("Reminder Setting")
        verbose_name_plural = _("Reminder Settings")

    def __str__(self):
        return f"Reminder for {self.vehicle}"

    def save(self, *args, **kwargs):
        self.updated_at = timezone.now()
        super().save(*args, **kwargs)


class Reminder(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_profile = models.ForeignKey(
        UserProfile,
        on_delete=models.PROTECT,
        related_name="reminders",
    )
    vehicle = models.ForeignKey(
        Vehicle,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reminders",
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    due_date = models.DateTimeField(null=True, blank=True)
    due_km = models.IntegerField(null=True, blank=True)
    warning_days_before = models.IntegerField(default=7)
    warning_km_before = models.IntegerField(default=500)
    status = models.CharField(max_length=20, default='ok')
    message = models.TextField(blank=True, null=True)
    source = models.CharField(max_length=20, default='manual')
    dismissed = models.BooleanField(default=False)
    type = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name = _("Reminder")
        verbose_name_plural = _("Reminders")
        indexes = [
            models.Index(fields=['user_profile']),
            models.Index(fields=['vehicle']),
            models.Index(fields=['due_date']),
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return self.title

    def update_status_and_message(self):
        current_km = self.vehicle.current_km if self.vehicle else None
        status = 'ok'
        message = self.title

        if self.due_date:
            days_remaining = (self.due_date - timezone.now()).days
            if days_remaining <= 0:
                status = 'overdue'
                message = f"{self.title} - موعد گذشته است!"
            elif days_remaining <= self.warning_days_before:
                status = 'near'
                message = f"{self.title} - {days_remaining} روز دیگر"

        if self.due_km and current_km is not None and status != 'overdue':
            km_remaining = self.due_km - current_km
            if km_remaining <= 0:
                status = 'overdue'
                message = f"{self.title} - کیلومتر گذشته است!"
            elif km_remaining <= self.warning_km_before:
                status = 'near'
                message = f"{self.title} - {km_remaining} کیلومتر دیگر"

        self.status = status
        self.message = message

    def save(self, *args, **kwargs):
        self.update_status_and_message()
        self.updated_at = timezone.now()
        super().save(*args, **kwargs)


class Notification(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_profile = models.ForeignKey(
        UserProfile,
        on_delete=models.PROTECT,
        related_name="notifications",
    )
    vehicle = models.ForeignKey(
        Vehicle,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="notifications",
    )
    title = models.TextField()
    body = models.TextField(blank=True, null=True)
    type = models.CharField(
        max_length=50,
        choices=[('reminder', 'Reminder'), ('warning', 'Warning'), ('info', 'Info'), ('subscription', 'Subscription')]
    )
    read = models.BooleanField(default=False)
    metadata = models.JSONField(default=dict, blank=True, null=True)
    notification_channels = models.JSONField(default=dict, blank=True, null=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name = _("Notification")
        verbose_name_plural = _("Notifications")
        indexes = [
            models.Index(fields=['user_profile', 'read']),
            models.Index(fields=['sent_at']),
            models.Index(fields=['-created_at']),
        ]

    def __str__(self):
        return self.title[:50]

    def save(self, *args, **kwargs):
        self.updated_at = timezone.now()
        super().save(*args, **kwargs)


class TelegramSetting(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_profile = models.OneToOneField(
        UserProfile,
        on_delete=models.PROTECT,
        related_name="telegram_setting",
    )
    chat_id = models.CharField(max_length=64, blank=True, null=True, unique=True)
    connection_code = models.CharField(max_length=32, blank=True, null=True, unique=True)
    is_enabled = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name = _("Telegram Setting")
        verbose_name_plural = _("Telegram Settings")

    def __str__(self):
        return f"Telegram for {self.user_profile}"

    def save(self, *args, **kwargs):
        self.updated_at = timezone.now()
        super().save(*args, **kwargs)


class VehicleKmHistory(models.Model):
    id = models.BigAutoField(primary_key=True)
    vehicle = models.ForeignKey(
        Vehicle,
        on_delete=models.CASCADE,
        related_name="km_histories",
    )
    km = models.IntegerField()
    recorded_at = models.DateTimeField(default=timezone.now)
    source_type = models.CharField(
        max_length=20,
        choices=[('manual', 'Manual'), ('service', 'Service'), ('expense', 'Expense'), ('initial', 'Initial')]
    )
    source_id = models.BigIntegerField(null=True, blank=True)
    note = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name = _("Vehicle KM History")
        verbose_name_plural = _("Vehicle KM Histories")
        ordering = ['-recorded_at']

    def __str__(self):
        return f"{self.vehicle} - {self.km} km"

    def clean(self):
        if self.km < 0:
            raise ValidationError(_("KM cannot be negative"))

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
