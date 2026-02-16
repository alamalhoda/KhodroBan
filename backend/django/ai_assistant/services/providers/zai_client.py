"""Z.ai provider: OpenAI-compatible API."""
from .openai_client import OpenAICompatibleClient


def get_zai_client(base_url=None, api_key=None, model=None, connect_timeout=5, read_timeout=30):
    """Z.ai uses OpenAI-compatible endpoint; base_url and api_key must be set in env."""
    return OpenAICompatibleClient(
        base_url=base_url or "",
        api_key=api_key or "",
        model=model or "gpt-3.5-turbo",
        connect_timeout=connect_timeout,
        read_timeout=read_timeout,
    )
