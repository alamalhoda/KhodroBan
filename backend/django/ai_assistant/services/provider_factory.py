"""
Provider factory: select OpenAI-compatible provider from settings/env.
"""
import logging
from django.conf import settings as django_settings
from .providers.openai_client import OpenAICompatibleClient
from .providers.openrouter_client import get_openrouter_client
from .providers.zai_client import get_zai_client

logger = logging.getLogger(__name__)

ALLOWED_PROVIDERS = ("openai", "openrouter", "zai")


def _get_setting(key, default=None):
    return getattr(django_settings, key, default)


def get_provider():
    """Return configured provider instance (OpenAI-compatible)."""
    name = _get_setting("AI_DEFAULT_PROVIDER", "openai").lower()
    if name not in ALLOWED_PROVIDERS:
        name = "openai"
    base_url = _get_setting(f"AI_{name.upper()}_BASE_URL") or _get_setting("AI_BASE_URL")
    api_key = _get_setting(f"AI_{name.upper()}_API_KEY") or _get_setting("AI_API_KEY")
    model = _get_setting("AI_MODEL", "gpt-3.5-turbo")
    if name == "openrouter":
        if not base_url:
            base_url = "https://openrouter.ai/api/v1"
        if not model or model == "gpt-3.5-turbo":
            model = "anthropic/claude-3-haiku"
        return get_openrouter_client(base_url=base_url, api_key=api_key, model=model)
    if name == "zai":
        return get_zai_client(base_url=base_url, api_key=api_key, model=model)
    if name == "openai":
        if not base_url:
            base_url = "https://api.openai.com/v1"
        if not base_url or not api_key:
            raise RuntimeError("AI assistant not configured: set AI_OPENAI_BASE_URL and AI_OPENAI_API_KEY")
        return OpenAICompatibleClient(base_url=base_url, api_key=api_key, model=model)
    if not base_url or not api_key:
        raise RuntimeError("AI assistant not configured: set AI_DEFAULT_PROVIDER, AI_*_BASE_URL, AI_*_API_KEY")
    return OpenAICompatibleClient(base_url=base_url, api_key=api_key, model=model)


def get_active_provider_info():
    """Return list of allowed/active provider names for diagnostic endpoint."""
    return {"allowed": list(ALLOWED_PROVIDERS), "active": _get_setting("AI_DEFAULT_PROVIDER", "openai")}
