"""OpenRouter provider: OpenAI-compatible API."""
from .openai_client import OpenAICompatibleClient


def get_openrouter_client(base_url=None, api_key=None, model=None, connect_timeout=5, read_timeout=30):
    base_url = base_url or "https://openrouter.ai/api/v1"
    return OpenAICompatibleClient(
        base_url=base_url,
        api_key=api_key or "",
        model=model or "anthropic/claude-3-haiku",
        connect_timeout=connect_timeout,
        read_timeout=read_timeout,
    )
