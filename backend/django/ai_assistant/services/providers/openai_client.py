"""
OpenAI-compatible HTTP client (openai, openrouter, z.ai).
"""
import os
import time
import logging
import requests
from .base import BaseAIProvider

logger = logging.getLogger(__name__)

DEFAULT_CONNECT_TIMEOUT = 5
DEFAULT_READ_TIMEOUT = 30
MAX_RETRIES = 2


class OpenAICompatibleClient(BaseAIProvider):
    def __init__(self, base_url, api_key, model="gpt-3.5-turbo", connect_timeout=None, read_timeout=None):
        self.base_url = (base_url or "").rstrip("/")
        self.api_key = api_key or ""
        self.model = model
        self.connect_timeout = connect_timeout or DEFAULT_CONNECT_TIMEOUT
        self.read_timeout = read_timeout or DEFAULT_READ_TIMEOUT

    def generate(self, messages, **kwargs):
        model = kwargs.get("model") or self.model
        url = f"{self.base_url}/chat/completions"
        headers = {"Content-Type": "application/json"}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"
        payload = {"model": model, "messages": messages}
        last_error = None
        for attempt in range(MAX_RETRIES + 1):
            start = time.monotonic()
            try:
                r = requests.post(
                    url,
                    json=payload,
                    headers=headers,
                    timeout=(self.connect_timeout, self.read_timeout),
                )
                elapsed_ms = int((time.monotonic() - start) * 1000)
                data = r.json() if r.content else {}
                if not r.ok:
                    err_msg = data.get("error", {}).get("message") or data.get("error") or r.text or r.reason
                    if r.status_code in (429, 500, 502, 503) and attempt < MAX_RETRIES:
                        last_error = err_msg
                        continue
                    raise RuntimeError(err_msg or f"HTTP {r.status_code}")
                content = (data.get("choices") or [{}])[0].get("message", {}).get("content") or ""
                usage = (data.get("choices") or [{}])[0].get("usage") or data.get("usage")
                return content, {
                    "provider": "openai_compatible",
                    "model": data.get("model") or model,
                    "usage": usage,
                    "latency_ms": elapsed_ms,
                }
            except requests.RequestException as e:
                last_error = str(e)
                if attempt < MAX_RETRIES:
                    continue
                raise RuntimeError(last_error or "خطا در ارتباط با سرویس هوش مصنوعی")
        raise RuntimeError(last_error or "خطا در ارتباط با سرویس هوش مصنوعی")
