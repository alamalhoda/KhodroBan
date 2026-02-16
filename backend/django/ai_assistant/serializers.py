"""
Serializers for AI Assistant API.
Validation only; business logic in services.
"""
from rest_framework import serializers
from .models import ChatSession, ChatMessage


class ChatSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatSession
        fields = ["id", "title", "created_at", "updated_at"]


class ChatSessionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatSession
        fields = ["title"]

    def create(self, validated_data):
        user = self.context["request"].user
        title = validated_data.get("title") or "گفتگوی جدید"
        return ChatSession.objects.create(user=user, title=title)


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = [
            "id",
            "role",
            "content",
            "provider",
            "model",
            "usage_json",
            "latency_ms",
            "created_at",
        ]


class ChatMessageListSerializer(serializers.Serializer):
    """Placeholder for list params if needed."""
    pass


class SendMessageSerializer(serializers.Serializer):
    content = serializers.CharField(allow_blank=False, trim_whitespace=True, max_length=16_000)
    vehicle_id = serializers.IntegerField(required=False, allow_null=True)
