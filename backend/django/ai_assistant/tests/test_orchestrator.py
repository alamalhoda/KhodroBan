"""Tests for orchestrator and provider factory (mocked)."""
from unittest.mock import patch, MagicMock
from django.contrib.auth.models import User
from django.test import TestCase
from datetime import date

from ai_assistant.models import ChatSession, ChatMessage
from ai_assistant.services.memory_service import memory_service
from ai_assistant.services.context_builder import context_builder
from ai_assistant.services.orchestrator import assistant_orchestrator


class ContextBuilderTest(TestCase):
    def test_build_prompt_no_history(self):
        messages = context_builder.build_prompt(history=[], user_context="", message="سلام")
        self.assertGreaterEqual(len(messages), 2)
        self.assertEqual(messages[0]["role"], "system")
        self.assertEqual(messages[-1]["role"], "user")
        self.assertEqual(messages[-1]["content"], "سلام")

    def test_build_prompt_with_history(self):
        history = [
            {"role": "user", "content": "پژو 206 دارم"},
            {"role": "assistant", "content": "خوب است."},
        ]
        messages = context_builder.build_prompt(history=history, user_context="", message="کی روغن عوض کنم؟")
        self.assertEqual(messages[-1]["content"], "کی روغن عوض کنم؟")
        roles = [m["role"] for m in messages]
        self.assertIn("user", roles)
        self.assertIn("assistant", roles)

    def test_build_user_context_empty_without_profile(self):
        user = User.objects.create_user(username="noprofile", password="test")
        self.assertEqual(context_builder.build_user_context(user), "")

    def test_build_user_context_includes_services_no_expenses(self):
        from khodroban.models import Vehicle, Service
        user = User.objects.create_user(username="ctxuser", password="test", email="ctx@test.local")
        profile = user.userprofile
        vehicle = Vehicle.objects.create(
            user_profile=profile, model="پژو ۲۰۶", year=1400, plate_number="12ج34567", current_km=80000
        )
        Service.objects.create(
            vehicle=vehicle,
            service_date=date(1400, 5, 1),
            service_date_gregorian=date(2021, 7, 23),
            service_km=75000,
            total_cost=500000,
        )
        ctx = context_builder.build_user_context(user)
        self.assertIn("آخرین سرویس‌های ثبت‌شده", ctx)
        self.assertIn("نوع سرویس", ctx)
        self.assertIn("500,000", ctx)
        self.assertIn("تاریخ:", ctx)
        self.assertNotIn("خودرو: پژو", ctx)

    def test_build_user_context_includes_expenses_when_present(self):
        from khodroban.models import Vehicle, DailyExpense, ExpenseCategory
        user = User.objects.create_user(username="ctxexp", password="test", email="ctxexp@test.local")
        profile = user.userprofile
        vehicle = Vehicle.objects.create(
            user_profile=profile, model="تیبا", year=1401, plate_number="33ج12345", current_km=50000
        )
        cat = ExpenseCategory.objects.filter(is_active=True).first()
        if not cat:
            ExpenseCategory.objects.create(code="testcat", name="تست", group_name="عمومی", icon="fa")
            cat = ExpenseCategory.objects.get(code="testcat")
        DailyExpense.objects.create(
            vehicle=vehicle,
            category=cat,
            expense_date=date(1401, 1, 15),
            expense_date_gregorian=date(2022, 4, 5),
            amount=300000,
        )
        ctx = context_builder.build_user_context(user)
        self.assertIn("آخرین هزینه‌های ثبت‌شده", ctx)
        self.assertIn("300,000", ctx)
        self.assertIn("دسته:", ctx)
        self.assertNotIn("خودرو: تیبا", ctx)

    def test_build_user_context_includes_selected_vehicle(self):
        from khodroban.models import Vehicle
        user = User.objects.create_user(username="ctxuser2", password="test", email="ctx2@test.local")
        profile = user.userprofile
        vehicle = Vehicle.objects.create(
            user_profile=profile, model="سمند", year=1399, plate_number="22ب11111", current_km=120000
        )
        ctx = context_builder.build_user_context(user, selected_vehicle_id=vehicle.id)
        self.assertIn("خودروی انتخاب‌شده", ctx)
        self.assertIn("سمند", ctx)
        self.assertIn("1399", ctx)
        self.assertIn("120000", ctx)


class MemoryServiceTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="memuser", password="test")
        self.session = ChatSession.objects.create(user=self.user, title="Test")

    def test_save_and_get_recent(self):
        memory_service.save_interaction(
            str(self.session.id),
            self.user,
            "سلام",
            "درود",
            {"provider": "openai", "model": "gpt-3.5", "latency_ms": 100},
        )
        recent = memory_service.get_recent_messages(str(self.session.id), limit=10)
        self.assertEqual(len(recent), 2)
        self.assertEqual(recent[0]["role"], "user")
        self.assertEqual(recent[0]["content"], "سلام")
        self.assertEqual(recent[1]["role"], "assistant")
        self.assertEqual(recent[1]["content"], "درود")


class OrchestratorTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="orchuser", password="test")
        self.session = ChatSession.objects.create(user=self.user, title="Test")

    @patch("ai_assistant.services.orchestrator.get_provider")
    def test_handle_message_returns_content_and_meta(self, mock_get_provider):
        mock_provider = MagicMock()
        mock_provider.generate.return_value = ("پاسخ تست", {"provider": "openai", "model": "gpt-3.5", "latency_ms": 50})
        mock_get_provider.return_value = mock_provider

        orch = assistant_orchestrator()
        result = orch.handle_message(user=self.user, session_id=str(self.session.id), message="سلام")

        self.assertEqual(result["content"], "پاسخ تست")
        self.assertEqual(result["provider"], "openai")
        self.assertEqual(result["latency_ms"], 50)
        mock_provider.generate.assert_called_once()
        call_kw = mock_provider.generate.call_args[1]
        self.assertIn("messages", call_kw)
        self.assertGreater(len(call_kw["messages"]), 0)
