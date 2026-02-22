# KhodroBan - AI Agent Instructions

This guide is the practical source of truth for AI coding agents working on this repository.
Keep suggestions and changes aligned with the current codebase, not historical docs.

## Project Snapshot (Current Reality)

- Monorepo name: `OilChenger`
- Product: Persian car maintenance platform (services, expenses, reminders, reports, AI assistant)
- Primary runtime path: `Django + Vue` (django-first in active product flow)
- Frontend: `Vue 3 + Vite + Pinia + Vue Router + Vitest`
- Backend: `Django + DRF + Huey` with reminder/notification pipelines
- Optional modes still exist for some frontend services: `mock` and `supabase`

## Canonical Repository Layout

```text
OilChenger/
├── backend/
│   └── django/                    # Django apps, APIs, management commands
├── frontend-vue/                  # Vue 3 app (active frontend)
├── shared/                        # Shared services/types/utils
├── docs/                          # Product/technical/deployment docs
├── scripts/                       # Automation and helper scripts
└── .github/                       # Workflows and templates
```

## Non-Negotiable Path Rules

- Use `frontend-vue/` (not `frontend/`).
- Use `frontend-vue/src/...` for UI code references.
- Use `backend/django/...` for backend references.
- Do not assume Svelte/SvelteKit structure (`src/lib`, `src/routes`, `+page.svelte`) in new guidance.

## Development Setup

### Backend (Django)

```bash
source backend/django/venv/bin/activate
cd backend/django
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Backend URL: `http://127.0.0.1:8000`

### Frontend (Vue)

```bash
cd frontend-vue
npm install
npm run dev
```

Frontend URL (default): `http://localhost:5174`

## Environment Configuration

Frontend env file: `frontend-vue/.env.local` (or `.env`).

Typical local django-first setup:

```env
VITE_BACKEND_TYPE=django
VITE_API_URL=http://127.0.0.1:8000/api
```

Supported backend modes:

- `VITE_BACKEND_TYPE=django` (primary active flow)
- `VITE_BACKEND_TYPE=mock` (test/development isolation)
- `VITE_BACKEND_TYPE=supabase` (legacy/optional flow)

## Frontend Commands (Actual Scripts)

Run these from `frontend-vue/`:

```bash
npm run dev
npm run build
npm run preview
npm run test
npm run test:run
npm run test:watch
npm run test:coverage
npm run test:e2e
```

## Backend Commands (Common)

Run these from `backend/django/` with virtualenv active:

```bash
pytest
python manage.py run_huey
python manage.py run_check_reminders
python manage.py run_process_outbox
python manage.py run_process_pending_notifications
python manage.py load_sample_data
```

## Architecture Conventions

### Frontend (`frontend-vue/src`)

- `components/`: reusable UI and feature components
- `views/`: route-level pages
- `stores/`: Pinia state modules
- `services/`: API and business-logic facades
- `router/`: Vue Router config
- `i18n/`, `locales/`: internationalization

Preferred style:

- Keep business/data access logic in `services/`, not in views.
- Keep stateful cross-view behavior in Pinia stores.
- Add/maintain tests for stores/services/views when behavior changes.
- Respect offline-first constraints (no new runtime CDN dependency).

### Backend (`backend/django`)

Key apps:

- `khodroban`: core domain models and APIs (auth, vehicles, services, expenses, reminders, reports)
- `reminders`: periodic reminder checks and outbox emission
- `notifications`: outbox consumption, dispatching, and delivery handlers
- `ai_assistant`: chat sessions/messages, context building, AI provider orchestration

### Reminder/Notification Flow

High-level pipeline:

1. `check_reminders` finds due reminders
2. Outbox events are created
3. `process_outbox` consumes events
4. Dispatcher routes to providers/channels
5. Notification records and delivery attempts are tracked

## Testing Expectations

- Frontend CI uses `VITE_BACKEND_TYPE=mock` for tests.
- Frontend build checks in CI use `VITE_BACKEND_TYPE=django`.
- Backend uses `pytest` and should be run from the activated virtualenv.
- For behavior-critical changes (API contract, auth, reminders, notification dispatch), include or update tests.

## CI/CD Reality in `.github/workflows`

- Active CI: `ci-frontend-vue.yml` (path-aware for `frontend-vue/**`)
- Utility workflow: `check-todos.yml`
- `deploy-github-pages.yml` and `deploy-deno.yml` contain legacy `frontend/` references and are not reliable as architecture references.

## Git Workflow Guidance

- Do not propose direct development on `main`/`develop`.
- Use GitFlow branches:
  - `feature/*` for new work
  - `bugfix/*` for fixes
- Use conventional commit style:
  - `feat(scope): ...`
  - `fix(scope): ...`
  - `docs(scope): ...`
  - `refactor(scope): ...`
  - `test(scope): ...`
  - `chore(scope): ...`

## Documentation Sync Rule

When behavior or contracts change, update related docs in the same change window. Typical targets:

- `README.md`
- `frontend-vue/README.md`
- `backend/django/README.md`
- `docs/development/API_CONTRACT_REGISTRY.md`
- `docs/development/PAGE_REVIEW_LOG.md`
- `TODO.md` (if priorities/status changed)

## Common Mistakes to Avoid

- Referring to `frontend/` instead of `frontend-vue/`
- Recommending Svelte/SvelteKit patterns in a Vue code path
- Running python/pip/pytest without activating `backend/django/venv`
- Hardcoding secrets/tokens in code or workflow examples
- Mixing transport/UI logic with domain logic in components/views

## Key References

- Root: `README.md`
- Frontend: `frontend-vue/README.md`
- Backend: `backend/django/README.md`
- Project structure: `docs/PROJECT_STRUCTURE.md`
- Django management commands: `docs/technical/django-management-commands.md`
- Workflow file list: `.github/workflows/`

---

Last Updated: 2026-02-20
Status: Active, django-first product flow