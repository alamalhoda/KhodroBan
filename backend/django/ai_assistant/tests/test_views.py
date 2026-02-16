"""API tests for ai_assistant endpoints."""
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase

from ai_assistant.models import ChatSession, ChatMessage


class ChatSessionAPITestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass123")
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
