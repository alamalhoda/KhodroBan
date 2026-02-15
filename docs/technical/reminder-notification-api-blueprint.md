# Reminder/Notification API Blueprint (Django)

Team-ready API contract specification for the Django Reminder/Notification architecture. Preserves legacy Telegram behavior and enables multi-channel delivery with clean domain separation.

**Last updated:** 2026-02-15

---

## 1. Current-State Audit (Backward Compatibility)

### 1.1 Reminder API (Django)

| FE expectation (shared/services/reminderService.ts) | Django path | Status |
|-----------------------------------------------------|-------------|--------|
| GET list | GET `/api/reminders/` | ✅ |
| GET one | GET `/api/reminders/<id>/` | ✅ |
| GET by vehicle | GET `/api/reminders/vehicle/<vehicleId>/` | ✅ |
| GET user reminders | GET `/api/reminders/user/` | ✅ |
| POST create | POST `/api/reminders/` | ✅ |
| PATCH update | PATCH `/api/reminders/<id>/` | ✅ |
| DELETE | DELETE `/api/reminders/<id>/` | ✅ |
| POST dismiss | POST `/api/reminders/<id>/dismiss/` | ✅ |
| GET/PATCH settings | GET/PATCH `/api/reminder-settings/` (per-vehicle) | ✅ |

**Reminder payload (camelCase for FE):**

- Request (create/update): `vehicleId`, `title`, `description`, `dueDate`, `dueKm`, `warningDaysBefore`, `warningKmBefore`, `source`, `type`.
- Response: `id`, `userId`, `vehicleId`, `vehicleName`, `title`, `description`, `dueDate`, `dueKm`, `warningDaysBefore`, `warningKmBefore`, `status`, `message`, `source`, `dismissed`, `createdAt`, `updatedAt`.

**Auth:** JWT required (`IsAuthenticated`). Ownership: reminders filtered by `user_profile`.

---

### 1.2 Notification API (Django)

| FE expectation (shared/services/notificationService.ts) | Django path | Status |
|---------------------------------------------------------|-------------|--------|
| GET list | GET `/api/notifications/` | ✅ |
| POST mark_as_read | POST `/api/notifications/<id>/mark_as_read/` | ✅ |
| GET unread count | GET `/api/notifications/unread_count/` | ✅ |
| POST mark_all_read | POST `/api/notifications/mark_all_read/` | ✅ |
| DELETE | DELETE `/api/notifications/<id>/` | ✅ |
| GET all (read + unread) | GET `/api/notifications/` (no filter) | ✅ |

**Notification payload (current Django serializer):**

- Response: `id`, `user_profile`, `vehicle`, `title`, `body`, `type`, `read`, `metadata`, `notification_channels`, `sent_at`, `created_at`, `updated_at`. FE expects camelCase for UI; envelope `{ success, data }` via `ApiResponseMixin`.

**Auth:** JWT required. Ownership: notifications filtered by `user_profile`.

---

### 1.3 Telegram API (Django)

| FE / Bot expectation | Django path | Status |
|----------------------|-------------|--------|
| CRUD telegram_settings | GET/POST/PATCH `/api/telegram-settings/` | ✅ |
| generate_code | POST `/api/telegram-settings/generate_code/` | ✅ |
| Webhook (message) | POST `/telegram/webhook/` | ✅ (`/start`, `/status`) |
| Webhook (callback_query) | POST `/telegram/webhook/` | ❌ (not implemented in Django) |
| Webhook setup / health | — | ❌ (no dedicated health) |

**Legacy reminder-service (telegram_bot_server.py):**

- Handles `callback_query`: `done_<vehicle_id>_<days_until_due>`, `details_<vehicle_id>`.
- Commands: `/start [user_id]`, `/status`, `/help` with Persian replies.
- Uses Supabase `telegram_users`; Django uses `TelegramSetting` (user_profile, chat_id, connection_code, is_enabled).

---

### 1.4 Response Envelope and Errors

- Success: `{ "success": true, "data": ... }` (ApiResponseMixin).
- Errors: DRF 400 (validation), 401 (unauthorized), 403 (forbidden), 404 (not found), 500 (server). No idempotency keys in current API.

---

### 1.5 Frontend Store/Components (frozen expectations)

- **notification.js (Pinia):** `fetchNotifications(onlyUnread)`, `getAllNotifications()`, `markAsRead(id)`, `markAllAsRead()`, `deleteNotification(id)`, `getUnreadCount()`, `subscribeToRealtime(callback)`.
- **notificationService (shared):** Same method names; Supabase uses `user_id`, `read`; Django must expose equivalent (e.g. list with `?read=false`, mark-as-read, mark-all-read, delete, unread count). Realtime: Supabase channel; Django mode: short-poll first, SSE/WebSocket optional later.

---

## 2. Target Domain Boundaries and Outbox Contract

### 2.1 Domain Split (same Django project)

- **Reminders app (`reminders`):**
  - Responsibility: due/status evaluation (time/km/both), **event emission only**.
  - No direct call to notification send; only writes to **ReminderDueEventOutbox** (same DB).
  - Models: Reminder, ReminderSetting (or moved here from khodroban), ReminderDueEventOutbox.

- **Notifications app (`notifications`):**
  - Responsibility: consume outbox, create Notification aggregate, queue/dispatch, delivery attempts, retries, delivery log.
  - Models: Notification, NotificationDelivery, NotificationPreference, PushDeviceToken (future).
  - Workers: OutboxConsumerWorker, ChannelDispatcher (Telegram, Push, Email, SMS).

### 2.2 Internal Event Contract: `reminder.due.detected.v1`

- **Producer:** Reminders domain (e.g. Huey periodic task or Django management command) after evaluating ReminderSetting + last Service per vehicle.
- **Storage:** Outbox table in same DB (e.g. `reminders_reminderdueeventoutbox` or `notifications_outbox`).
- **Payload (schema v1):**

```json
{
  "event_type": "reminder.due.detected.v1",
  "event_id": "uuid",
  "occurred_at": "ISO8601",
  "idempotency_key": "string",
  "payload": {
    "user_profile_id": "int",
    "vehicle_id": "int",
    "reminder_setting_id": "int",
    "due_type": "time|km|both",
    "days_until_due": "int|null",
    "km_until_due": "int|null",
    "last_service_date": "date|null",
    "last_service_km": "int|null",
    "interval_days": "int",
    "interval_km": "int|null",
    "warning_days_before": "int",
    "warning_km_before": "int",
    "vehicle_model": "string",
    "plate_number": "string"
  }
}
```

- **Idempotency key:** e.g. `reminder_due:{user_id}:{vehicle_id}:{due_window_start}:{channel_group}`. Uniqueness enforced in DB to avoid duplicate events.
- **Consumer responsibility:** Single consumer (OutboxConsumerWorker) marks event as processed, creates one Notification (if not already created for same idempotency), enqueues for dispatch. At-most-once processing per key; consumer must be idempotent when creating Notification (e.g. unique constraint on idempotency_key on Notification or outbox processed flag).
- **Producer responsibility:** Only append to outbox; no direct Notification creation in reminders domain.

---

## 3. Public API Contract (Endpoint-by-Endpoint)

Base URL: `/api/`. All authenticated endpoints require JWT; responses use envelope `{ "success": true, "data": ... }` unless noted.

### 3.1 Reminder API

| Method | Path | Request | Response | Status codes | Idempotency |
|--------|------|---------|----------|--------------|-------------|
| GET | `/api/reminders/` | — | List of reminders (camelCase) | 200 | N/A |
| GET | `/api/reminders/<id>/` | — | Single reminder | 200, 404 | N/A |
| GET | `/api/reminders/vehicle/<vehicleId>/` | — | List for vehicle | 200 | N/A |
| GET | `/api/reminders/user/` | — | List for user | 200 | N/A |
| POST | `/api/reminders/` | Body: vehicleId, title, description, dueDate, dueKm, warningDaysBefore, warningKmBefore, source?, type? | Created reminder | 201, 400 | Optional: Idempotency-Key header → 201 same body on replay |
| PATCH | `/api/reminders/<id>/` | Partial camelCase | Updated reminder | 200, 400, 404 | N/A |
| DELETE | `/api/reminders/<id>/` | — | 204 no content | 204, 404 | N/A |
| POST | `/api/reminders/<id>/dismiss/` | — | `{ status: "dismissed" }` | 200, 404 | Idempotent (dismiss again → 200) |

**Errors:** 400 validation (serializer.errors), 401 missing/invalid token, 403 not owner, 404 not found.

### 3.2 Notification API

| Method | Path | Request | Response | Status codes | Idempotency |
|--------|------|---------|----------|--------------|-------------|
| GET | `/api/notifications/` | Query: `read` (true/false), `limit`, `offset` | List (camelCase optional) | 200 | N/A |
| GET | `/api/notifications/unread_count/` | — | `{ "count": number }` | 200 | N/A |
| GET | `/api/notifications/<id>/` | — | Single notification | 200, 404 | N/A |
| POST | `/api/notifications/<id>/mark_as_read/` | — | `{ "status": "read" }` | 200, 404 | Idempotent |
| POST | `/api/notifications/mark_all_read/` | — | `{ "status": "read", "count": number }` | 200 | Idempotent |
| DELETE | `/api/notifications/<id>/` | — | 204 no content | 204, 404 | N/A |

**Response shape (list item):** id, user_profile (or userId), vehicle (or vehicleId), title, body, type, read, metadata, notification_channels, sent_at, created_at, updated_at. FE may expect camelCase; backend can expose via serializer or middleware.

**Errors:** 400, 401, 403, 404 as above.

### 3.3 Telegram API

| Method | Path | Request | Response | Status codes |
|--------|------|---------|----------|--------------|
| GET | `/api/telegram-settings/` | — | List (single item per user) | 200 |
| POST | `/api/telegram-settings/` | — | Create default | 201 |
| GET | `/api/telegram-settings/<id>/` | — | Single (or get_or_create singleton) | 200 |
| PATCH | `/api/telegram-settings/<id>/` | is_enabled?, etc. | Updated | 200, 404 |
| POST | `/api/telegram-settings/generate_code/` | — | `{ connection_code, message }` | 200 |
| POST | `/telegram/webhook/` | Telegram Update JSON | `{ "ok": true }` | 200, 500 |

**Webhook (public, no JWT):** CSRF exempt, POST only. Handles `message` (text) and `callback_query`. See §4 for parity behaviors.

**Health:** GET `/telegram/webhook/health/` or GET `/api/telegram-settings/webhook_health/` → 200 when bot token configured and optionally webhook set; 503 if misconfigured.

---

## 4. Telegram Parity (Legacy reminder-service)

Behaviors to preserve in Django webhook.

### 4.1 Commands (message.text)

- **`/start`** (no args): Reply: سلام! برای اتصال ربات به حساب خود، کد اتصال را از برنامه وارد کنید. دستور: /start [کد اتصال]
- **`/start <code>`:** Resolve `TelegramSetting` by `connection_code`; set `chat_id`, clear `connection_code`, set `is_enabled=True`. Reply: اتصال با موفقیت انجام شد! از این پس یادآوری‌ها را در تلگرام دریافت خواهید کرد. ✓ If code invalid: کد نامعتبر یا منقضی شده است.
- **`/status`:** If TelegramSetting exists for chat_id and is_enabled: وضعیت: فعال ✓ Else: وضعیت: غیرفعال ✗
- **`/help`:** Reply: راهنما: /start [کد اتصال] - اتصال حساب، /status - وضعیت یادآوری‌ها، /help - این راهنما.

### 4.2 Callback query (inline buttons)

- **Payload format:** `data_callback` from `callback_query.data`.
- **`done_<vehicle_id>_<days_until_due>`:** Confirm service done for vehicle. Backend: optional (e.g. mark reminder dismissed or log). Reply to user: ✅ سرویس خودرو <vehicle_id> ثبت شد! (or localized). **Authorization:** Ensure chat_id is linked to user who owns vehicle_id; else reply "دسترسی مجاز نیست."
- **`details_<vehicle_id>`:** Show vehicle details. Reply: ℹ️ جزئیات خودرو <vehicle_id> (or fetch vehicle and format short summary). **Authorization:** Same ownership check.

**Callback response:** Answer callback_query (Telegram API) to remove loading state; then send_message for reply text.

### 4.3 Message templates and versioning

- Template version in metadata (e.g. `template_version: "1"`) for future changes.
- Callback payload: support `done_` and `details_` prefixes; version suffix optional (e.g. `details_123_v1`) for future.

### 4.4 Audit

- Log callback_query: chat_id, data, user_id (Telegram user id), timestamp, ownership check result. Store in audit table or structured logs for operator replay.

---

## 5. Data Model Contract (Multi-Channel)

### 5.1 Notification (aggregate root)

- Keep existing: id (UUID), user_profile_id, vehicle_id (nullable), title, body, type, read, metadata (JSON), notification_channels (JSON), sent_at, created_at, updated_at.
- Add (optional for Phase 2): `idempotency_key` (unique, nullable) for dedup from outbox.

### 5.2 NotificationDelivery (per-channel attempt)

- Fields: id, notification_id (FK), channel (e.g. telegram, push, email, sms), status (queued, retrying, sent, failed, cancelled), attempt_number, provider_message_id (e.g. Telegram message_id), provider_response (JSON), failure_reason (text), sent_at, created_at, updated_at.
- Unique constraint: (notification_id, channel, attempt_number) or (notification_id, channel) with status for latest attempt.
- Idempotency: per-delivery key (e.g. notification_id + channel + attempt_window) for retries.

### 5.3 NotificationPreference (per user/event/channel)

- Fields: user_profile_id, event_type (e.g. reminder.due), channel (telegram, push, email, sms), is_enabled, created_at, updated_at.
- Unique: (user_profile_id, event_type, channel). Admin can disable channel globally or per event.

### 5.4 PushDeviceToken (future)

- Fields: user_profile_id, token, platform (ios/android/web), last_used_at, created_at, updated_at. Lifecycle: register, refresh, revoke.

### 5.5 State machine (delivery)

- **Notification:** logical state: draft → queued → (partially) sent. No formal state field; infer from NotificationDelivery rows.
- **NotificationDelivery:** queued → retrying → sent | failed | cancelled. Terminal: sent, failed, cancelled. Retry policy: max_attempts (e.g. 3), backoff (e.g. 1m, 5m, 15m).

### 5.6 Legacy migration

- **telegram_users (Supabase) → TelegramSetting (Django):** Map user_id → UserProfile; chat_id, is_active → TelegramSetting (chat_id, is_enabled). connection_code not in legacy; leave null. One-time migration script.

---

## 6. Workers and Operations

### 6.1 Runtime topology

- **Django API process:** Serves REST + webhook; no long-running consumer in same process.
- **Huey consumer/scheduler:** Same host or separate; Redis as broker. Tasks: `check_reminders` (periodic), `process_pending_notifications` (periodic), `send_telegram` (task), future OutboxConsumer, ChannelDispatcher.
- **Redis:** Required for Huey; health check required.

### 6.2 Retries and DLQ

- **Outbox consumer:** Process event once per idempotency_key; on failure retry with backoff; after max retries move to DLQ (table or queue) and mark event as failed. Operator replay: endpoint or management command to re-enqueue by event_id.
- **Delivery (send_telegram etc.):** Retry up to N times with backoff; then mark NotificationDelivery as failed; optional DLQ for manual replay.

### 6.3 Health endpoints

- **Scheduler:** GET `/huey-health/` → 200 if Huey connected, 503 otherwise. (Already present.)
- **Dispatcher:** GET `/api/notifications/dispatcher_health/` or `/health/dispatcher/` → 200 if workers can dequeue, 503 if Redis down or queue blocked.
- **Webhook:** GET `/telegram/webhook/health/` → 200 if TELEGRAM_BOT_TOKEN set (and optionally webhook URL set), 503 otherwise.

### 6.4 Observability

- **Structured logs:** trace_id, event_id, notification_id, channel, attempt. Same format for all workers.
- **Metrics:** send_rate (per channel), success_rate, failure_rate, queue_lag (outbox/notification queue depth). Export via Prometheus or logging pipeline.
- **Failed-queue monitoring:** Dashboard or alert on DLQ depth and failed delivery count; playbook: replay by event_id or notification_id, fix config, then replay.

---

## 7. Frontend Compatibility (Django Mode)

### 7.1 notificationServiceDjango contract

When `VITE_BACKEND_TYPE=django`, FE uses API base `VITE_DJANGO_API_URL` and expects:

- **getNotifications(userId, onlyUnread):** GET `/api/notifications/?read=false` (or true) with auth. Returns list; shape same as current (camelCase if backend provides it or FE maps).
- **getAllNotifications(userId):** GET `/api/notifications/` (no read filter). Returns list.
- **markAsRead(notificationId):** POST `/api/notifications/<id>/mark_as_read/`.
- **markAllAsRead(userId):** POST `/api/notifications/mark_all_read/`.
- **deleteNotification(notificationId):** DELETE `/api/notifications/<id>/`.
- **getUnreadCount(userId):** GET `/api/notifications/unread_count/` → `{ count: number }`.
- **subscribeToNotifications(userId, callback):** No Supabase; short-poll: FE polls GET `/api/notifications/?read=false&limit=10` on interval (e.g. 30s). Optional later: SSE or WebSocket endpoint; FE subscribes and calls callback on new notification.

### 7.2 Response envelope and naming

- Envelope: `{ success: true, data: ... }`. On error, DRF response (e.g. 400 with body); FE treats non-2xx as error.
- Field names: Backend may send snake_case; FE converts to camelCase in notificationServiceDjango if needed, or backend sends camelCase for notification list/detail.

### 7.3 Realtime strategy

- **Phase 1:** Short-poll only (getUnreadCount or getNotifications every 30–60s when tab focused).
- **Later:** Optional SSE/WebSocket for live updates; FE falls back to short-poll if not available.

---

## 8. Phased Implementation Plan

### Phase 1 (Immediate) — ✅ Done (2026-02-15)

- **Scope:** Contract-complete Notification API (list, unread_count, mark_read, mark_all_read, delete), notificationServiceDjango in FE (shared + Vue) with short-poll; dedup for reminder checks (idempotency key for notification creation in Huey); Telegram callback support in Django webhook (done_, details_, /help).
- **Milestones:** Notification endpoints implemented and covered by contract tests; FE branch uses notificationServiceDjango when backend=django; webhook handles callback_query with ownership checks.
- **Risks:** FE still expects realtime; clarify that Django mode uses poll until Phase 2+.
- **Acceptance:** All Notification API status codes and idempotency behavior tested; Telegram callbacks tested; no duplicate notifications under retry.

### Phase 2 — ✅ Done (2026-02-15)

- **Scope:** Split reminders vs notifications domains; introduce Outbox and `reminder.due.detected.v1`; OutboxConsumer creates Notification from event; integration tests: reminder due → outbox → notification → dispatch.
- **Milestones:** Two Django apps (or clear boundaries), outbox table and consumer, integration tests green.
- **Risks:** Data migration for existing Notification creation path.
- **Acceptance:** No direct Notification create from reminder evaluation; all creation via outbox.

### Phase 3 — ✅ Done (2026-02-15)

- **Scope:** Email/SMS/Push handlers; admin channel enable/disable; priority order (telegram → push → email → sms) with fallback.
- **Milestones:** NotificationDelivery per channel; dispatcher chooses channel by preference and order; admin toggles.
- **Acceptance:** Delivery log and state transitions tested; fallback order respected.

### Phase 4 — ✅ Done (2026-02-15)

- **Scope:** Deprecate reminder-service; cut old cron/webhook path; migrate legacy telegram_users to Django; archive legacy docs (README, TELEGRAM_README).
- **Milestones:** Single code path for reminders and notifications; legacy service read-only/archived.
- **Acceptance:** No production dependency on reminder-service; docs updated.

---

## 9. Documentation Update Checklist

- [x] **docs/technical/reminder-system-status.md** — Update architecture to Django + outbox + multi-channel; reflect current FE (Vue) and Django API; mark legacy reminder-service as deprecated.
- [x] **docs/development/API_CONTRACT_REGISTRY.md** — Add Notification unread_count, mark_all_read, delete; align with this blueprint.
- [x] **docs/technical/mvp-project-spec.md** — Align reminder/notification section with blueprint and phases (§7.4).
- [ ] **backend/django/README.md** — Document Huey tasks, outbox consumer, health endpoints, env (TELEGRAM_BOT_TOKEN, Redis).
- [ ] **README.md** (repo root) — Short note on reminder/notification architecture and link to this blueprint.
- [x] **reminder-service/README.md** — Mark as deprecated/archived; point to Django and this blueprint.
- [x] **reminder-service/TELEGRAM_README.md** — Mark deprecated; point to Django webhook and §4 of this blueprint.

---

## References

- Backend: `backend/django/khodroban/views.py`, `serializers.py`, `urls.py`, `models.py`, `huey_tasks.py`
- FE: `shared/services/reminderService.ts`, `notificationService.ts`; `frontend-vue/src/stores/notification.js`, `NotificationBell.vue`
- Legacy: `reminder-service/telegram_main.py`, `telegram_bot_server.py`, `TELEGRAM_README.md`
- Docs: `docs/technical/reminder-system-status.md`, `docs/development/API_CONTRACT_REGISTRY.md`
