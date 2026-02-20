"""
API layer for AI Assistant.
ViewSets only handle auth, validation, and delegation to services.
"""
import logging
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import UserRateThrottle

from . import serializers

logger = logging.getLogger(__name__)


class AIAssistantThrottle(UserRateThrottle):
    rate = "30/min"


def api_response(data, status_code=200, headers=None):
    """Envelope consistent with backend: { success: true, data: ... }"""
    return Response({"success": True, "data": data}, status=status_code, headers=headers or {})


class ApiResponseMixin:
    """Mixin for ViewSets to return success/data envelope."""

    def _wrap(self, data, status_code=200):
        return api_response(data, status_code=status_code)


class ChatSessionViewSet(ApiResponseMixin, viewsets.GenericViewSet):
    """
    Sessions and messages for AI Assistant.
    Endpoints: list, create, retrieve; nested: messages list, send message.
    """
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == "create":
            return serializers.ChatSessionCreateSerializer
        if self.action == "messages":
            return serializers.ChatMessageListSerializer
        if self.action == "send_message":
            return serializers.SendMessageSerializer
        return serializers.ChatSessionSerializer

    def get_queryset(self):
        from .models import ChatSession
        return ChatSession.objects.filter(user=self.request.user).order_by("-updated_at")

    def list(self, request):
        queryset = self.get_queryset()
        serializer = serializers.ChatSessionSerializer(queryset, many=True)
        return self._wrap(serializer.data)

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        session = serializer.save(user=request.user)
        out = serializers.ChatSessionSerializer(session)
        return self._wrap(out.data, status_code=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        from .models import ChatSession
        session = ChatSession.objects.filter(pk=pk, user=request.user).first()
        if not session:
            return Response(
                {"success": False, "errors": ["سشن یافت نشد."]},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = serializers.ChatSessionSerializer(session)
        return self._wrap(serializer.data)

    @action(detail=True, methods=["get"], url_path="messages")
    def messages(self, request, pk=None):
        """List messages for a session."""
        from .models import ChatSession, ChatMessage
        session = ChatSession.objects.filter(pk=pk, user=request.user).first()
        if not session:
            return Response(
                {"success": False, "errors": ["سشن یافت نشد."]},
                status=status.HTTP_404_NOT_FOUND,
            )
        msgs = ChatMessage.objects.filter(session=session).order_by("created_at")
        serializer = serializers.ChatMessageSerializer(msgs, many=True)
        return self._wrap(serializer.data)

    @action(detail=True, methods=["post"], url_path="messages/send", throttle_classes=[AIAssistantThrottle])
    def send_message(self, request, pk=None):
        """Send user message and return assistant reply (orchestrator)."""
        from .models import ChatSession
        from .services.orchestrator import assistant_orchestrator

        session = ChatSession.objects.filter(pk=pk, user=request.user).first()
        if not session:
            return Response(
                {"success": False, "errors": ["سشن یافت نشد."]},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        content = serializer.validated_data.get("content", "").strip()
        vehicle_id = serializer.validated_data.get("vehicle_id")
        if not content:
            return Response(
                {"success": False, "errors": ["متن پیام نمی‌تواند خالی باشد."]},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            orchestrator = assistant_orchestrator()
            result = orchestrator.handle_message(
                user=request.user,
                session_id=str(session.id),
                message=content,
                vehicle_id=vehicle_id,
            )
            return self._wrap(result)
        except RuntimeError as e:
            msg = str(e)
            if "429" in msg or "rate" in msg.lower():
                return Response(
                    {"success": False, "errors": ["محدودیت تعداد درخواست. لطفاً کمی بعد تلاش کنید."]},
                    status=status.HTTP_429_TOO_MANY_REQUESTS,
                )
            if "timeout" in msg.lower() or "timed out" in msg.lower():
                return Response(
                    {"success": False, "errors": ["زمان درخواست به پایان رسید. لطفاً دوباره تلاش کنید."]},
                    status=status.HTTP_504_GATEWAY_TIMEOUT,
                )
            logger.warning("AI assistant error: %s", msg)
            return Response(
                {"success": False, "errors": [msg or "خطا در سرویس هوش مصنوعی."]},
                status=status.HTTP_502_BAD_GATEWAY,
            )
        except Exception as e:
            logger.exception("AI assistant unexpected error")
            return Response(
                {"success": False, "errors": ["خطای غیرمنتظره. لطفاً بعداً تلاش کنید."]},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class AIProviderInfoViewSet(ApiResponseMixin, viewsets.ViewSet):
    """Diagnostic: list allowed/active AI providers."""
    permission_classes = [IsAuthenticated]

    def list(self, request):
        from .services.provider_factory import get_active_provider_info
        info = get_active_provider_info()
        return self._wrap(info)
