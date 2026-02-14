# khodroban/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import UserProfile, SubscriptionPlan, UserSubscription


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        profile = UserProfile.objects.create(
            user=instance,
            email=instance.email,
            first_name=instance.first_name,
            last_name=instance.last_name,
            is_email_verified=False,
        )
        free_plan = SubscriptionPlan.objects.filter(plan_code='free').first()
        if free_plan:
            UserSubscription.objects.create(
                user_profile=profile,
                plan=free_plan,
                is_active=True
            )
