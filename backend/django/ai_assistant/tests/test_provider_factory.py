"""Tests for provider factory (with settings override)."""
from unittest.mock import patch
from django.test import TestCase
from django.conf import settings as django_settings

from ai_assistant.services.provider_factory import get_active_provider_info, ALLOWED_PROVIDERS


class ProviderFactoryTest(TestCase):
    def test_get_active_provider_info(self):
        info = get_active_provider_info()
        self.assertIn("allowed", info)
        self.assertEqual(info["allowed"], list(ALLOWED_PROVIDERS))
        self.assertIn("active", info)
