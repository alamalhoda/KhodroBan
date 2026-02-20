"""
Assistant Orchestrator: coordinates context, memory, and provider.
"""
import logging
from .memory_service import memory_service
from .context_builder import context_builder
from .provider_factory import get_provider

logger = logging.getLogger(__name__)


def assistant_orchestrator():
    """Return singleton orchestrator instance."""
    return _orchestrator


class AssistantOrchestrator:
    def handle_message(self, user, session_id, message, vehicle_id=None):
        user_id = getattr(user, "id", None)
        logger.info(
            "AI assistant handle_message start",
            extra={"user_id": user_id, "session_id": session_id, "message_len": len(message or "")},
        )
        history = memory_service.get_recent_messages(session_id)
        user_context = context_builder.build_user_context(user, selected_vehicle_id=vehicle_id)
        messages = context_builder.build_prompt(history=history, user_context=user_context, message=message)
        provider = get_provider()
        response_text, meta = provider.generate(messages=messages)
        memory_service.save_interaction(session_id, user, message, response_text, meta)
        latency_ms = meta.get("latency_ms")
        usage = meta.get("usage")
        logger.info(
            "AI assistant handle_message ok",
            extra={
                "user_id": user_id,
                "session_id": session_id,
                "provider": meta.get("provider"),
                "model": meta.get("model"),
                "latency_ms": latency_ms,
                "token_usage": str(usage) if usage else None,
            },
        )
        return {
            "content": response_text,
            "provider": meta.get("provider", ""),
            "model": meta.get("model", ""),
            "usage": meta.get("usage"),
            "latency_ms": meta.get("latency_ms"),
        }


_orchestrator = AssistantOrchestrator()
