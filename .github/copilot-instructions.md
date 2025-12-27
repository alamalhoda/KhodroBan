# KhodroBan - AI Agent Instructions

This document provides essential guidance for AI coding agents working on the KhodroBan project - a Persian car maintenance management web application.

## 🏗️ Project Architecture

### Big Picture
KhodroBan is a **Svelte 5 + TypeScript** web application built with **Vite + SvelteKit**. The project follows a **service-based architecture** with clear separation between UI components, business logic services, and data layers.

### Core Structure
```
frontend/
├── src/
│   ├── lib/
│   │   ├── components/     # UI components (Atomic Design)
│   │   │   ├── common/     # Reusable primitives (Button, Input, Card, etc.)
│   │   │   ├── layout/     # Layout components (Header, Sidebar, etc.)
│   │   │   └── features/   # Feature-specific components (LoginForm, etc.)
│   │   ├── services/       # API layer with mock implementations
│   │   │   ├── authService.ts
│   │   │   ├── expenseService.ts
│   │   │   ├── vehicleService.ts
│   │   │   └── base/       # Service router and interfaces
│   │   ├── stores/         # Svelte 5 runes-based state management
│   │   ├── utils/          # Helpers, validation, config
│   │   ├── types/          # TypeScript interfaces
│   │   └── i18n/           # Persian/English localization
│   ├── routes/             # SvelteKit pages
│   └── test/               # Vitest tests
```

### Key Design Decisions

1. **Dual Backend Support**: Services can work with **Supabase** or **Mock Data**
   - Controlled by `VITE_BACKEND_TYPE` environment variable
   - Mock mode enabled by default for development
   - Each service exports both Supabase and Mock implementations

2. **Svelte 5 Runes**: Modern reactive state management
   - `$state()` for reactive variables
   - `$derived()` for computed values
   - `$effect()` for side effects
   - `$props()` for component props

3. **Persian-First Design**: 
   - RTL layout support
   - Jalali (Persian) date handling
   - Vazirmatn font for Persian text
   - All UI text in Persian by default

## 🔧 Critical Developer Workflows

### Development Setup
```bash
cd frontend
npm install
npm run dev  # Starts on http://localhost:5173
```

### Testing Strategy
```bash
# Quick smoke tests (2 seconds)
npm run test:smoke

# All tests
npm run test

# Type checking
npm run check

# Linting
npm run lint

# Format check
npm run format:check
```

### Build & Deploy
```bash
# Standard build
npm run build

# GitHub Pages build
npm run chabokan:build

# Preview
npm run preview
```

### Environment Variables
Create `.env` file in `frontend/`:
```env
VITE_BACKEND_TYPE=mock  # or 'supabase'
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_NAME=خودروبان
```

## 🎯 Project-Specific Conventions

### 1. Service Pattern
All services follow this pattern:
```typescript
// services/vehicleService.ts
import { supabase } from '../supabase';
import api from './api';
import type { Vehicle, VehicleFormData } from '../types';
import { selectService } from './base/router';
import type { IVehicleService } from './base/types';

// MOCK IMPLEMENTATION
const mockVehicles: Vehicle[] = [...];

const vehicleServiceMock: IVehicleService = {
  async getAll(): Promise<Vehicle[]> { ... },
  async create(data: VehicleFormData): Promise<Vehicle> { ... },
  // ... other methods
};

// SUPABASE IMPLEMENTATION  
const vehicleServiceSupabase: IVehicleService = {
  async getAll(): Promise<Vehicle[]> {
    const { data, error } = await supabase.from('vehicles').select('*');
    if (error) throw error;
    return data;
  },
  // ... other methods
};

// EXPORT with router selection
export const vehicleService = selectService<VehicleFormData, Vehicle>(
  vehicleServiceMock,
  vehicleServiceSupabase
);
```

### 2. Type Definitions
All types are centralized in `src/lib/types/index.ts`:
```typescript
export interface Vehicle {
  id: string;
  userId: string;
  model: string;
  year: number;
  plateNumber: string;
  currentKm: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
}
```

### 3. Component Props
Use TypeScript interfaces for props:
```typescript
// Button.svelte
<script lang="ts">
  interface Props {
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    onclick?: () => void;
    children: any;
  }
  
  let { variant = 'primary', size = 'md', disabled = false, onclick, children }: Props = $props();
</script>
```

### 4. Accessibility Requirements
- All interactive elements must have keyboard handlers
- ARIA labels for screen readers
- Semantic HTML elements
- Focus management for modals

### 5. CSS & Styling
- **Glassmorphism** design system
- CSS variables for theming
- Mobile-first responsive design
- Utility classes for common patterns

## 🔌 Integration Points

### Supabase Integration
- **URL**: `VITE_SUPABASE_URL`
- **Anon Key**: `VITE_SUPABASE_ANON_KEY`
- **Tables**: `user_profiles`, `user_subscriptions`, `subscription_plans`, `vehicles`, `services`, `expenses`
- **Auth**: JWT-based with Google OAuth support

### External Dependencies
- `@supabase/supabase-js` - Database & Auth
- `axios` - HTTP client (for custom API)
- `persian-date` - Jalali date handling
- `svelte-i18n` - Internationalization
- `chart.js` - Data visualization (optional)

## ⚠️ Current Technical Debt (Priority Order)

### 1. Type Safety Issues
- **80+** `any` types in services (authService, expenseService, etc.)
- **30+** unused variables
- **45** TypeScript errors in type checking

### 2. Svelte 5 Migration
- **15+** deprecated `<slot>` usages (need `{@render}` tags)
- **10+** accessibility warnings
- **15+** unused CSS selectors

### 3. Test Infrastructure
- Missing `@testing-library/user-event` dependency
- Missing `svelte-i18n` dependency
- Mock implementations need proper type definitions

### 4. CI/CD Configuration
- Checks are currently **non-blocking** (continue-on-error: true)
- Need to fix all errors before making blocking

## 📋 Development Checklist

### Before Committing
1. ✅ Run `npm run check` - fix TypeScript errors
2. ✅ Run `npm run lint` - fix lint warnings
3. ✅ Run `npm run test` - ensure tests pass
4. ✅ Run `npm run format:check` - verify formatting

### Adding New Features
1. Define types in `src/lib/types/index.ts`
2. Create service in `src/lib/services/` with mock + Supabase
3. Build UI components in `src/lib/components/`
4. Add routes in `src/routes/`
5. Write tests in `src/lib/components/__tests__/`
6. Update documentation

### Fixing Existing Issues
1. **Unused variables**: Prefix with `_` or remove
2. **`any` types**: Define proper interfaces
3. **Deprecated slots**: Use `{@render children()}` syntax
4. **Accessibility**: Add ARIA attributes and keyboard handlers
5. **Unused CSS**: Remove or use in components

## 🎯 Success Metrics

- **Type Safety**: 0 TypeScript errors
- **Code Quality**: 0 ESLint warnings
- **Test Coverage**: All critical paths tested
- **Performance**: < 2s build time, < 100ms page loads
- **Accessibility**: WCAG 2.1 AA compliance

## 🔗 Key Files Reference

- **Configuration**: `vite.config.ts`, `tsconfig.json`, `.eslintrc.cjs`
- **Types**: `src/lib/types/index.ts`
- **Services**: `src/lib/services/` (all services)
- **Components**: `src/lib/components/ui/` (primitives)
- **Tests**: `src/test/smoke/` (quick checks)
- **CI**: `.github/workflows/ci-frontend.yml`
- **TODO**: `frontend/TODO.md` (current issues)

## 💡 Pro Tips

1. **Mock Mode**: Always develop with `VITE_BACKEND_TYPE=mock` first
2. **Svelte 5**: Use runes (`$state`, `$derived`) not `let` + `export`
3. **Persian**: Use `persian-date` library for all date operations
4. **Testing**: Use `test:smoke` for quick feedback during development
5. **Git**: Follow the workflow in `frontend/.cursor/rules/core/git-workflow.mdc`

---

**Last Updated**: 2025-12-27  
**Project Status**: MVP Development - Active  
**Next Milestone**: Fix CI blocking checks