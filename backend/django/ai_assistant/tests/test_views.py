"""API tests for ai_assistant endpoints."""
from unittest.mock import patch, MagicMock
from django.contrib.auth.models import User
from django.utils.crypto import get_random_string
from rest_framework import status
from rest_framework.test import APITestCase

from ai_assistant.models import ChatSession, ChatMessage


class ChatSessionAPITestCase(APITestCase):
    def setUp(self):
        self._password = get_random_string(12)
        self.user = User.objects.create_user(username="testuser", password=self._password)
        self.client.force_authenticate(user=self.user)

    def test_list_sessions_empty(self):
        response = self.client.get("/api/ai/sessions/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data.get("success"))
        self.assertEqual(response.data.get("data"), [])

    def test_create_session(self):
        response = self.client.post("/api/ai/sessions/", {"title": "تست"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data.get("success"))
        data = response.data.get("data", {})
        self.assertIn("id", data)
        self.assertEqual(data.get("title"), "تست")
        self.assertEqual(ChatSession.objects.filter(user=self.user).count(), 1)

    def test_retrieve_session(self):
        session = ChatSession.objects.create(user=self.user, title="سشن تست")
        response = self.client.get(f"/api/ai/sessions/{session.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["data"]["id"], session.id)
        self.assertEqual(response.data["data"]["title"], "سشن تست")

    def test_messages_list_empty(self):
        session = ChatSession.objects.create(user=self.user, title="سشن")
        response = self.client.get(f"/api/ai/sessions/{session.id}/messages/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["data"], [])

    @patch("ai_assistant.services.orchestrator.get_provider")
    def test_send_message_success(self, mock_get_provider):
        mock_provider = MagicMock()
        mock_provider.generate.return_value = ("پاسخ تست از مدل", {"provider": "openai", "model": "gpt-3.5", "latency_ms": 100})
        mock_get_provider.return_value = mock_provider

        session = ChatSession.objects.create(user=self.user, title="سشن")
        response = self.client.post(
            f"/api/ai/sessions/{session.id}/messages/send/",
            {"content": "سلام، کی روغن عوض کنم؟"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data.get("success"))
        data = response.data.get("data", {})
        self.assertEqual(data.get("content"), "پاسخ تست از مدل")
        self.assertEqual(data.get("provider"), "openai")

        msgs = list(ChatMessage.objects.filter(session=session).order_by("created_at"))
        self.assertEqual(len(msgs), 2)
        self.assertEqual(msgs[0].role, ChatMessage.Role.USER)
        self.assertEqual(msgs[0].content, "سلام، کی روغن عوض کنم؟")
        self.assertEqual(msgs[1].role, ChatMessage.Role.ASSISTANT)
        self.assertEqual(msgs[1].content, "پاسخ تست از مدل")

    @patch("ai_assistant.services.orchestrator.get_provider")
    def test_send_message_with_vehicle_id(self, mock_get_provider):
        mock_provider = MagicMock()
        mock_provider.generate.return_value = ("خوب است.", {"provider": "openai", "model": "gpt-3.5", "latency_ms": 50})
        mock_get_provider.return_value = mock_provider

        session = ChatSession.objects.create(user=self.user, title="سشن")
        response = self.client.post(
            f"/api/ai/sessions/{session.id}/messages/send/",
            {"content": "وضعیت خودرو چطوره؟", "vehicle_id": 999},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data.get("success"))

    def test_send_message_empty_content_returns_400(self):
        session = ChatSession.objects.create(user=self.user, title="سشن")
        response = self.client.post(
            f"/api/ai/sessions/{session.id}/messages/send/",
            {"content": "   "},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data.get("success"))

    def test_send_message_session_not_found_returns_404(self):
        other_password = get_random_string(12)
        other_user = User.objects.create_user(username="other", password=other_password, email="other@test.local")
        session = ChatSession.objects.create(user=other_user, title="سشن دیگر")
        response = self.client.post(
            f"/api/ai/sessions/{session.id}/messages/send/",
            {"content": "سلام"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_providers_list(self):
        response = self.client.get("/api/ai/providers/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data.get("success"))
        data = response.data.get("data", {})
        self.assertIn("allowed", data)
        self.assertIn("active", data)
        self.assertIsInstance(data["allowed"], list)
