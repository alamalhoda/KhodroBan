"""
Base interface for OpenAI-compatible AI providers.
"""
from abc import ABC, abstractmethod


class OPENAI_ROLES:
    SYSTEM = "system"
    USER = "user"
    ASSISTANT = "assistant"


class BaseAIProvider(ABC):
    @abstractmethod
    def generate(self, messages, **kwargs):
        """
        Call provider and return (response_text, meta_dict).
        meta_dict: provider, model, usage, latency_ms, etc.
        """
        pass
