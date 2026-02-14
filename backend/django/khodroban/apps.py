# khodroban/apps.py
from django.apps import AppConfig


class KhodrobanConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'khodroban'
    verbose_name = 'خودروبان'

    def ready(self):
        import khodroban.signals  # noqa: F401
