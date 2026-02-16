"""
Context Builder: build user context and compose prompt/messages with sanitization.
شامل: خودروی انتخاب‌شده، آخرین سرویس‌ها (با نوع سرویس، بدون تکرار خودرو) و آخرین هزینه‌ها (بدون تکرار خودرو).
"""
from .providers.base import OPENAI_ROLES

MAX_SERVICES = 5
MAX_EXPENSES = 10


class ContextBuilder:
    BASE_SYSTEM = (
        "شما یک مشاور خودرو هستید. به سوالات کاربر درباره خودرو، سرویس، تعمیر و هزینه‌ها به زبان فارسی پاسخ دهید. مختصر و مفید باشید."
    )
    MAX_CONTEXT_CHARS = 4000

    def build_user_context(self, user, selected_vehicle_id=None):
        """Build context: selected vehicle (if any) + last services + last expenses (no vehicle name per row)."""
        try:
            from khodroban.models import Vehicle, Service, DailyExpense
        except ImportError:
            return ""
        profile = getattr(user, "userprofile", None)
        if not profile:
            return ""
        parts = []

        if selected_vehicle_id:
            vehicle = Vehicle.objects.filter(
                id=selected_vehicle_id, user_profile=profile
            ).first()
            if vehicle:
                parts.append(
                    f"خودروی انتخاب‌شده برای سوال کاربر: {vehicle.model} ({vehicle.year})، "
                    f"کیلومتر فعلی: {vehicle.current_km or '-'}"
                )
                parts.append("")

        services = (
            Service.objects.filter(vehicle__user_profile=profile)
            .prefetch_related("items__service_type")
            .order_by("-service_date_gregorian")[:MAX_SERVICES]
        )
        if services:
            parts.append("آخرین سرویس‌های ثبت‌شده (حداکثر ۵ مورد):")
            for s in services:
                type_names = [item.service_type.name for item in s.items.all() if item.service_type]
                type_str = "، ".join(type_names) if type_names else "سرویس"
                note = (s.general_note or s.description or "")[:80].strip()
                note_str = f"، یادداشت: {note}" if note else ""
                parts.append(
                    f"- تاریخ: {s.service_date}، کیلومتر: {s.service_km}، "
                    f"نوع سرویس: {type_str}، هزینه کل: {s.total_cost:,} تومان{note_str}"
                )
            parts.append("")

        expenses = (
            DailyExpense.objects.filter(vehicle__user_profile=profile)
            .select_related("category")
            .order_by("-expense_date_gregorian")[:MAX_EXPENSES]
        )
        if expenses:
            parts.append("آخرین هزینه‌های ثبت‌شده (حداکثر ۱۰ مورد):")
            for e in expenses:
                cat = e.category.name if e.category else "نامشخص"
                desc = (e.description or "")[:60].strip()
                desc_str = f"، توضیح: {desc}" if desc else ""
                km_str = f"، کیلومتر: {e.km_at_expense}" if e.km_at_expense is not None else ""
                parts.append(
                    f"- دسته: {cat}، تاریخ: {e.expense_date}، مبلغ: {e.amount:,} تومان{km_str}{desc_str}"
                )
            parts.append("")

        if not parts:
            return ""
        text = "\n".join(parts)
        if len(text) > self.MAX_CONTEXT_CHARS:
            return text[: self.MAX_CONTEXT_CHARS] + "..."
        return text

    def build_prompt(self, history, user_context, message):
        """Build list of messages for OpenAI-compatible API."""
        messages = [{"role": OPENAI_ROLES.SYSTEM, "content": self.BASE_SYSTEM}]
        if user_context:
            messages.append({"role": OPENAI_ROLES.SYSTEM, "content": "اطلاعات خودروی انتخاب‌شده و سوابق سرویس کاربر:\n" + user_context})
        for h in history:
            role = h.get("role")
            if role == "assistant":
                role = OPENAI_ROLES.ASSISTANT
            elif role == "user":
                role = OPENAI_ROLES.USER
            else:
                continue
            content = (h.get("content") or "").strip()
            if content:
                messages.append({"role": role, "content": content})
        messages.append({"role": OPENAI_ROLES.USER, "content": message})
        return messages


context_builder = ContextBuilder()
