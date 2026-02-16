"""
Memory Service: read/write chat history with sliding window.
"""
from ..models import ChatSession, ChatMessage


class MemoryService:
    MAX_HISTORY_MESSAGES = 20

    def get_recent_messages(self, session_id, limit=None):
        limit = limit or self.MAX_HISTORY_MESSAGES
        session = ChatSession.objects.filter(id=session_id).first()
        if not session:
            return []
        qs = ChatMessage.objects.filter(session=session).order_by("created_at")
        messages = list(qs[: limit * 2])  # user+assistant pairs
        return [{"role": m.role, "content": m.content} for m in messages[-limit * 2 :]]

    def save_interaction(self, session_id, user, user_message, assistant_message, meta=None):
        session = ChatSession.objects.filter(id=session_id, user=user).first()
        if not session:
            return
        meta = meta or {}
        ChatMessage.objects.create(
            session=session,
            role=ChatMessage.Role.USER,
            content=user_message,
        )
        ChatMessage.objects.create(
            session=session,
            role=ChatMessage.Role.ASSISTANT,
            content=assistant_message,
            provider=meta.get("provider", ""),
            model=meta.get("model", ""),
            usage_json=meta.get("usage"),
            latency_ms=meta.get("latency_ms"),
        )
        session.save()  # touch updated_at


memory_service = MemoryService()
