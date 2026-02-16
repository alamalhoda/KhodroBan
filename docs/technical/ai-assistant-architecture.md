# معماری و اجزای مشاور هوشمند (AI Assistant)

این سند معماری، اجزا، جریان داده و قراردادهای API مشاور هوشمند را به‌طور کامل شرح می‌دهد.

**آخرین به‌روزرسانی:** 2026-02-16

---

## ۱. نمای کلی

مشاور هوشمند یک چت‌بات مبتنی بر مدل زبانی (LLM) است که در پاسخ به سوالات کاربر درباره خودرو، سرویس، تعمیر و هزینه‌ها از **context** کاربر (خودروی انتخاب‌شده، سرویس‌ها و هزینه‌های اخیر) و **تاریخچه گفتگو** استفاده می‌کند. معماری به‌صورت **backend-first** است: تمام منطق ساخت پرامپت، انتخاب provider و ذخیره تاریخچه در بک‌اند Django انجام می‌شود و فرانت فقط API را فراخوانی می‌کند.

### اهداف طراحی

- **جداسازی مسئولیت‌ها:** API فقط اعتبارسنجی و فراخوانی سرویس؛ منطق در لایه سرویس.
- **قابلیت تعویض provider:** پشتیبانی از OpenAI، OpenRouter و Z.ai از طریق یک رابط یکسان.
- **Context غنی:** خودروی انتخاب‌شده، آخرین سرویس‌ها (با نوع سرویس) و آخرین هزینه‌ها در هر درخواست به مدل ارسال می‌شود.
- **تاریخچه پایدار:** هر گفتگو به‌صورت سشن و پیام در دیتابیس ذخیره می‌شود و کاربر می‌تواند گفتگوهای قبلی را ببیند و بین آن‌ها جابه‌جا شود.

---

## ۲. نمودار معماری (سطح بالا)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              فرانت (Vue 3 + Pinia)                            │
├─────────────────────────────────────────────────────────────────────────────┤
│  SmartAssistantView.vue  →  useAIStore (ai.js)  →  aiAssistantService.js    │
│  (UI: چت، انتخاب خودرو، تاریخچه گفتگوها، گفتگوی جدید)                          │
└───────────────────────────────────────────┬─────────────────────────────────┘
                                             │ HTTP (axios + JWT)
                                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         API (Django REST Framework)                          │
├─────────────────────────────────────────────────────────────────────────────┤
│  ChatSessionViewSet  │  IsAuthenticated  │  Throttle 30/min (send_message)   │
│  • list / create / retrieve  │  • messages  │  • send_message                │
└───────────────────────────────────────────┬─────────────────────────────────┘
                                             │
                                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        لایه سرویس (ai_assistant.services)                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  AssistantOrchestrator.handle_message(user, session_id, message, vehicle_id)   │
│       │                                                                       │
│       ├──► MemoryService.get_recent_messages(session_id)   ← ChatMessage     │
│       ├──► ContextBuilder.build_user_context(user, selected_vehicle_id)      │
│       │         ← Vehicle, Service, DailyExpense (khodroban)                   │
│       ├──► ContextBuilder.build_prompt(history, user_context, message)        │
│       ├──► get_provider()  →  provider.generate(messages)                     │
│       └──► MemoryService.save_interaction(...)   → ChatMessage (user+assistant)│
└───────────────────────────────────────────┬─────────────────────────────────┘
                                             │
                    ┌────────────────────────┼────────────────────────┐
                    ▼                        ▼                        ▼
           ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
           │ OpenAI Provider │    │ OpenRouter       │    │ Z.ai Provider   │
           │ (api.openai.com │    │ (openrouter.ai)  │    │ (configurable)   │
           │  or proxy)      │    │                  │    │                  │
           └─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## ۳. اجزای بک‌اند

### ۳.۱ مدل‌های دیتابیس (`ai_assistant.models`)

| مدل | توضیح | فیلدهای مهم |
|-----|--------|--------------|
| **ChatSession** | یک گفتگوی چت برای یک کاربر | `user`, `title`, `created_at`, `updated_at` |
| **ChatMessage** | یک پیام در یک سشن (کاربر یا دستیار) | `session`, `role` (user/assistant), `content`, `provider`, `model`, `usage_json`, `latency_ms`, `created_at` |

- هر کاربر چندین سشن دارد؛ سشن‌ها بر اساس `updated_at` نزولی مرتب می‌شوند.
- هر پیام به یک سشن تعلق دارد؛ نقش آن یا `user` است یا `assistant`. پیام‌های سیستمی در دیتابیس ذخیره نمی‌شوند و فقط در زمان ساخت پرامپت به مدل فرستاده می‌شوند.

### ۳.۲ API و ViewSetها (`ai_assistant.views`)

**Base URL (در پروژه):** `/api/ai/`

| متد | مسیر | توضیح |
|-----|------|--------|
| GET | `/sessions/` | لیست سشن‌های کاربر (فقط سشن‌های خودش) |
| POST | `/sessions/` | ایجاد سشن جدید (بدن: `{ "title": "گفتگوی جدید" }`) |
| GET | `/sessions/:id/` | جزئیات یک سشن |
| GET | `/sessions/:id/messages/` | لیست پیام‌های آن سشن |
| POST | `/sessions/:id/messages/send/` | ارسال پیام کاربر و دریافت پاسخ مدل (بدن: `{ "content": "...", "vehicle_id": عدد یا null }`) |
| GET | `/providers/` | تشخیصی: لیست providerهای مجاز و provider فعال |

- همه endpointها نیاز به **احراز هویت (JWT)** دارند (`IsAuthenticated`).
- روی **send_message** محدودیت **۳۰ درخواست در دقیقه** به ازای هر کاربر (UserRateThrottle) اعمال می‌شود.

**قالب پاسخ موفق:** `{ "success": true, "data": ... }`  
**قالب خطا:** `{ "success": false, "errors": ["پیام خطا"] }`

خطاهای خاص (۴۲۹، timeout، ۵۰۲/۵۰۳) به پیام فارسی مناسب (محدودیت درخواست، زمان به پایان رسید، خطای سرویس) نگاشت می‌شوند.

### ۳.۳ Serializerها (`ai_assistant.serializers`)

- **ChatSessionSerializer:** خروجی سشن؛ فیلدها: `id`, `title`, `created_at`, `updated_at`.
- **ChatSessionCreateSerializer:** ورودی ایجاد سشن؛ فیلد: `title` (اختیاری).
- **ChatMessageSerializer:** خروجی هر پیام؛ فیلدها: `id`, `role`, `content`, `provider`, `model`, `usage_json`, `latency_ms`, `created_at`.
- **SendMessageSerializer:** ورودی ارسال پیام؛ فیلدهای اجباری: `content` (غیر خالی، حداکثر ۱۶٬۰۰۰ کاراکتر)؛ اختیاری: `vehicle_id` (عدد یا null).

---

## ۴. لایه سرویس (Services)

### ۴.۱ Orchestrator (`services.orchestrator`)

**نقش:** هماهنگ‌کننده اصلی؛ برای هر پیام کاربر ترتیب کارها را اجرا می‌کند.

**ورودی `handle_message`:**  
`user`, `session_id`, `message`, `vehicle_id=None`

**جریان:**

1. **تاریخچه:** `memory_service.get_recent_messages(session_id)` — آخرین N جفت user/assistant (پنجره لغزان، حداکثر ۲۰ پیام در کل).
2. **Context کاربر:** `context_builder.build_user_context(user, selected_vehicle_id=vehicle_id)` — متن شامل خودروی انتخاب‌شده (در صورت ارسال vehicle_id)، آخرین سرویس‌ها و آخرین هزینه‌ها.
3. **ساخت پرامپت:** `context_builder.build_prompt(history, user_context, message)` — آرایهٔ پیام‌های OpenAI (system + user_context + history + message فعلی).
4. **فراخوانی مدل:** `get_provider().generate(messages=messages)` — ارسال به provider و دریافت متن پاسخ و meta (provider, model, usage, latency_ms).
5. **ذخیره:** `memory_service.save_interaction(session_id, user, message, response_text, meta)` — ذخیره یک پیام user و یک پیام assistant در دیتابیس و به‌روزرسانی `session.updated_at`.

**خروجی:**  
`{ "content", "provider", "model", "usage", "latency_ms" }`

### ۴.۲ Context Builder (`services.context_builder`)

**نقش:** ساخت context متنی کاربر و مونتاژ نهایی لیست پیام‌ها برای API چت.

- **ثابت‌ها:**  
  - `MAX_SERVICES = 5`  
  - `MAX_EXPENSES = 10`  
  - `MAX_CONTEXT_CHARS = 4000`

- **`build_user_context(user, selected_vehicle_id=None)`**
  - وابسته به اپ `khodroban`: مدل‌های `Vehicle`, `Service`, `DailyExpense` و رابطه با `UserProfile`.
  - اگر `selected_vehicle_id` داده شده و خودرو متعلق به همان کاربر باشد: یک بلوک «خودروی انتخاب‌شده برای سوال کاربر: مدل (سال)، کیلومتر فعلی: …».
  - بلوک **آخرین سرویس‌ها:** حداکثر ۵ سرویس (مرتب بر اساس تاریخ)، هر خط: تاریخ، کیلومتر، **نوع سرویس** (از `ServiceItem.service_type`)، هزینه کل، یادداشت؛ بدون تکرار نام خودرو در هر خط.
  - بلوک **آخرین هزینه‌ها:** حداکثر ۱۰ هزینه؛ هر خط: دسته، تاریخ، مبلغ، کیلومتر (در صورت وجود)، توضیح؛ بدون تکرار نام خودرو.
  - اگر طول کل از `MAX_CONTEXT_CHARS` بیشتر شود، متن قطع و با «…» تمام می‌شود.

- **`build_prompt(history, user_context, message)`**
  - پیام اول: نقش `system` با متن ثابت «شما یک مشاور خودرو هستید…».
  - در صورت وجود `user_context`: پیام دوم `system` با متن «اطلاعات خودروی انتخاب‌شده و سوابق سرویس کاربر» + `user_context`.
  - سپس به‌ترتیب پیام‌های `history` (فقط user و assistant با content غیر خالی).
  - در پایان پیام `user` با محتوای `message`.
  - خروجی: آرایهٔ دیکشنری‌های `{ "role", "content" }` سازگار با OpenAI Chat Completions.

### ۴.۳ Memory Service (`services.memory_service`)

**نقش:** خواندن و نوشتن تاریخچه چت با پنجره لغزان.

- **`get_recent_messages(session_id, limit=None)`**  
  - پیش‌فرض `limit = MAX_HISTORY_MESSAGES` (۲۰).  
  - آخرین `limit * 2` پیام (جفت user+assistant) را برمی‌گرداند؛ خروجی لیست `{ "role", "content" }`.

- **`save_interaction(session_id, user, user_message, assistant_message, meta=None)`**  
  - فقط اگر سشن متعلق به همان کاربر باشد: دو رکورد `ChatMessage` (یکی user، یکی assistant) ایجاد می‌کند و `session.save()` برای به‌روزرسانی `updated_at`.

### ۴.۴ Provider Factory و Providerها (`services.provider_factory` + `services.providers`)

**نقش:** انتخاب provider فعال از تنظیمات و بازگرداندن نمونهٔ سازگار با رابط `BaseAIProvider`.

- **Providerهای مجاز:** `openai`, `openrouter`, `zai`.
- **تنظیمات (Django settings / env):**
  - `AI_DEFAULT_PROVIDER`: نام provider پیش‌فرض.
  - `AI_OPENAI_BASE_URL`, `AI_OPENAI_API_KEY` (برای openai).
  - `AI_OPENROUTER_BASE_URL`, `AI_OPENROUTER_API_KEY` (پیش‌فرض base: openrouter.ai).
  - `AI_ZAI_BASE_URL`, `AI_ZAI_API_KEY` برای zai.
  - `AI_BASE_URL`, `AI_API_KEY`: fallback عمومی.
  - `AI_MODEL`: مدل پیش‌فرض (مثلاً gpt-3.5-turbo؛ برای openrouter در صورت خالی بودن از Claude Haiku استفاده می‌شود).

- **رابط `BaseAIProvider`:** متد `generate(self, messages, **kwargs)` که برمی‌گرداند: `(response_text: str, meta: dict)`.  
  - `meta` شامل: `provider`, `model`, `usage`, `latency_ms` و در صورت نیاز فیلدهای دیگر.

- **پیاده‌سازی‌ها:**
  - **OpenAICompatibleClient** (`openai_client.py`): درخواست POST به `{base_url}/chat/completions` با timeout و حداکثر ۲ بار retry برای خطاهای ۴۲۹/۵xx.
  - **OpenRouter** و **Z.ai**: کلاینتهای اختصاصی که از همان رابط استفاده می‌کنند.

- **`get_active_provider_info()`:** برای endpoint تشخیصی؛ برمی‌گرداند `{ "allowed": [...], "active": "..." }`.

---

## ۵. جریان کامل داده (ارسال یک پیام)

```
کاربر در UI متن را وارد و ارسال می‌کند
         │
         ▼
SmartAssistantView: sendMessage(toSend) با vehicleId = selectedVehicle?.id
         │
         ▼
aiStore.sendMessage(toSend, vehicleId)
         │  • ensureSession() در صورت نبود سشن
         │  • اضافه کردن پیام کاربر به messages (optimistic)
         │  • isLoading = true
         ▼
aiAssistantService.sendMessage(sessionId, content, vehicleId)
         │  POST /api/ai/sessions/:id/messages/send/
         │  body: { content, vehicle_id? }
         ▼
ChatSessionViewSet.send_message
         │  • اعتبارسنجی سشن و serializer
         │  • استخراج content و vehicle_id
         ▼
assistant_orchestrator().handle_message(user, session_id, content, vehicle_id)
         │
         ├─ memory_service.get_recent_messages(session_id)
         ├─ context_builder.build_user_context(user, selected_vehicle_id=vehicle_id)
         │     • خواندن Vehicle (در صورت vehicle_id)، Service، DailyExpense از khodroban
         ├─ context_builder.build_prompt(history, user_context, content)
         ├─ get_provider().generate(messages)
         │     • درخواست HTTP به provider (OpenAI/OpenRouter/Z.ai)
         └─ memory_service.save_interaction(session_id, user, content, response_text, meta)
         │
         ▼
Response: { success: true, data: { content, provider, model, usage, latency_ms } }
         │
         ▼
aiStore: اضافه کردن پیام مدل به messages، isLoading = false
         │
         ▼
UI: نمایش پاسخ و scroll به پایین
```

---

## ۶. فرانت‌اند

### ۶.۱ سرویس (`frontend-vue/src/services/aiAssistantService.js`)

- از axios مشترک (با JWT) استفاده می‌کند؛ base مسیر: `/ai` (نسبت به base URL API).
- **listSessions()** → `GET /ai/sessions/` → آرایهٔ سشن‌ها.
- **createSession(payload)** → `POST /ai/sessions/` → یک سشن.
- **listMessages(sessionId)** → `GET /ai/sessions/:id/messages/` → آرایهٔ پیام‌ها.
- **sendMessage(sessionId, content, vehicleId)** → `POST /ai/sessions/:id/messages/send/` با `{ content, vehicle_id? }` → `{ content, provider, model, usage, latency_ms }`.
- **getProviders()** → `GET /ai/providers/` → `{ allowed, active }`.

### ۶.۲ استور (`frontend-vue/src/stores/ai.js`)

- **State:** `sessions`, `currentSessionId`, `messages`, `isLoading`, `error`.
- **Computed:** `currentSession`, `recentConsultations`.
- **عملیات اصلی:**
  - `loadSessions()`: بارگذاری لیست سشن‌ها؛ در صورت خالی بودن currentSessionId، انتخاب اولین سشن.
  - `loadMessages(sessionId)`: بارگذاری پیام‌های یک سشن و نگاشت به فرمت نمایش (role مدل = `model`).
  - `ensureSession()`: اگر سشنی نباشد، ایجاد یک سشن و تنظیم آن به‌عنوان جاری.
  - `sendMessage(text, selectedVehicleId)`: اطمینان از وجود سشن، فراخوانی sendMessage سرویس با vehicleId، به‌روزرسانی messages و error.
  - `setCurrentSession(sessionId)`: تنظیم سشن جاری و بارگذاری پیام‌های آن.
  - `startNewSession()`: ایجاد سشن جدید، قرار دادن آن در ابتدای لیست و خالی کردن messages.
- **initialize():** بارگذاری سشن‌ها، ensureSession و loadMessages برای سشن جاری.

### ۶.۳ ویو (`frontend-vue/src/views/SmartAssistantView.vue`)

- **صفحه مشاور هوشمند:** لیست پیام‌ها، ورودی متن، انتخاب خودرو، پیشنهادهای سریع (chips).
- **تاریخچه گفتگوها:** دکمه «تاریخچه گفتگوها» با دراپ‌داون لیست سشن‌ها (عنوان + تاریخ به‌روزرسانی)؛ با کلیک روی یک سشن، `setCurrentSession` و بارگذاری پیام‌ها.
- **گفتگوی جدید:** دکمه «گفتگوی جدید» برای `startNewSession()`.
- **ارسال پیام:** با ارسال، `vehicleId = selectedVehicle?.id` به `sendMessage` پاس داده می‌شود تا در context خودروی انتخاب‌شده لحاظ شود.

---

## ۷. ساختار فایل‌ها (مرجع)

```
backend/django/
├── ai_assistant/
│   ├── models.py           # ChatSession, ChatMessage
│   ├── serializers.py      # Session, Message, SendMessage
│   ├── views.py            # ChatSessionViewSet, AIProviderInfoViewSet
│   ├── urls.py             # router: sessions, providers
│   ├── services/
│   │   ├── orchestrator.py      # AssistantOrchestrator
│   │   ├── context_builder.py  # ContextBuilder
│   │   ├── memory_service.py   # MemoryService
│   │   ├── provider_factory.py # get_provider, get_active_provider_info
│   │   └── providers/
│   │       ├── base.py         # BaseAIProvider, OPENAI_ROLES
│   │       ├── openai_client.py # OpenAICompatibleClient
│   │       ├── openrouter_client.py
│   │       └── zai_client.py
│   └── tests/
│       ├── test_orchestrator.py
│       ├── test_views.py
│       └── test_provider_factory.py

frontend-vue/src/
├── services/aiAssistantService.js   # API فراخوانی‌ها
├── stores/ai.js                     # Pinia store مشاور هوشمند
└── views/SmartAssistantView.vue     # UI چت و تاریخچه
```

در پروژهٔ Django، مسیر `/api/ai/` از طریق `khodroban.urls` با `include('ai_assistant.urls')` اضافه می‌شود.

---

## ۸. امنیت و محدودیت‌ها

- **احراز هویت:** تمام endpointهای مشاور هوشمند فقط برای کاربر لاگین‌شده (JWT) در دسترس هستند.
- **مالکیت داده:** سشن‌ها و پیام‌ها با `user=request.user` فیلتر می‌شوند؛ کاربر فقط به سشن و پیام‌های خودش دسترسی دارد.
- **اعتبار vehicle_id:** در context فقط در صورتی خودرو اضافه می‌شود که `Vehicle` با آن `id` متعلق به `user_profile` همان کاربر باشد.
- **Throttling:** حداکثر ۳۰ درخواست send_message در دقیقه به ازای هر کاربر.
- **طول پیام:** حداکثر ۱۶٬۰۰۰ کاراکتر برای فیلد `content` در ارسال پیام.

---

## ۹. سوالات غیرمرتبط با خودرو

**امکان دارد کاربر سوالاتی غیرمرتبط با خودرو بپرسد (مثلاً آب‌وهوا، اخبار، دستور پخت).**

### رفتار فعلی سیستم

- **بک‌اند:** هیچ فیلتر یا اعتبارسنجی روی محتوای پیام (موضوع یا کلیدواژه) انجام نمی‌شود. هر متنی که غیر خالی و حداکثر ۱۶٬۰۰۰ کاراکتر باشد پذیرفته و به مدل ارسال می‌شود.
- **پرامپت سیستمی:** مدل با این نقش و دستورالعمل راه می‌افتد که «مشاور خودرو» است و به سوالات درباره خودرو، سرویس، تعمیر و هزینه‌ها پاسخ دهد. علاوه بر آن به مدل گفته شده است: **اگر سوال به خودرو مربوط نبود، مؤدبانه توضیح بده که حوزهٔ تخصص شما خودرو است و ترجیح می‌دهی روی همان موضوع کمک کنی.**
- **نتیجه:** مدل معمولاً سوالات غیرمرتبط را با یک جملهٔ مؤدبانه به سمت موضوع خودرو برمی‌گرداند، بدون اینکه محتوای نامناسب تولید کند یا نقش مشاور خودرو را ترک کند. رفتار دقیق به مدل (و گاهی به فرمولاسیون سوال) وابسته است.

اگر در آینده بخواهید سوالات کاملاً نامرتبط را در لایهٔ API رد کنید (مثلاً با یک classifier یا لیست کلیدواژه)، می‌توان آن را به‌صورت یک مرحلهٔ اعتبارسنجی قبل از فراخوانی orchestrator اضافه کرد.

---

## ۱۰. اسناد مرتبط

- **Baseline و KPI:** `docs/technical/ai-assistant-baseline-kpi.md` — سناریوهای تست دستی و معیارهای مهاجرت.
- **تنظیم provider (Mimo):** `docs/technical/ai-provider-setup-mimo.md`.
- **Proxy و زیرساخت:** `docs/technical/ai-proxy-setup.md`.
