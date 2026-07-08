# Boilerplate Intranet — Fase 1: Fundación + Shell

> **Status:** Draft pending review  
> **Owner:** Pi Agent + User  
> **Date:** 2026-07-08

---

## 1. Goal

Create a clean, brand-neutral boilerplate based on the reference intranet application. This first phase delivers the project foundation, visual design system, authentication shell, dashboard home, and a database-agnostic data layer. The result must be cloneable from GitHub and runnable with mock data, with clear extension points for real backends.

## 2. Scope

### In scope (Fase 1)

- Project setup: Vite + React + TypeScript + Tailwind CSS + React Router.
- Shared design system and reusable UI components.
- Visual login page (UI only, no real backend call).
- Main layout shell: top navigation, module selector, user menu, notifications.
- Dashboard home page with mock data.
- Placeholder routes for future modules (`/conceptone`, `/etra`, `/produccion`, `/cruda`, `/crm`, `/personal`, `/configuracion`).
- Database-agnostic data abstraction layer using the Repository pattern.
- Mock repository adapter with typed data fixtures.
- Adapter stubs for Supabase/REST (extension point for Postgres, Prisma, etc. in future phases).
- `STYLE_GUIDE.md` documenting visual rules and component usage for future agents.
- GitHub-ready repo structure: `README.md`, `.env.example`, `.gitignore`.

### Out of scope (future phases)

- Full feature implementation of Booking & Management, PR, Production, CRUDA, CRM, Team, or Settings modules.
- Real authentication flow or protected routes logic.
- Real database connections or API integrations.
- Tests beyond the minimum smoke tests for the repository layer.

## 3. Architecture

The application follows a layered architecture:

```
┌─────────────────────────────────────┐
│  Pages / Features                   │
│  (Login, Dashboard, Module shells)  │
├─────────────────────────────────────┤
│  UI Components + Hooks              │
├─────────────────────────────────────┤
│  Repository Context                 │
│  (injected data adapter)            │
├─────────────────────────────────────┤
│  Adapters: Mock | Supabase | REST   │
└─────────────────────────────────────┘
```

- **Components** never call external services directly.
- **Hooks** consume the repository through React context.
- **Repository** is an interface/abstract class exposing typed methods such as `login`, `getCurrentUser`, `getDashboard`, `getModules`, `getUpcomingEvents`, `getNews`.
- **Adapters** implement the repository interface. The default adapter is `MockRepository`; future adapters (Supabase, REST, tRPC, Prisma) swap in via configuration.

## 4. Tech Stack

| Layer | Technology |
|-------|------------|
| Build tool | Vite 6 |
| Framework | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Routing | React Router 7 |
| Icons | Lucide React |
| State (local) | React hooks + Context |
| Lint/Format | ESLint + Prettier |

## 5. Design System

Based on the reference application. All values must be documented in `docs/STYLE_GUIDE.md`.

### 5.1 Colors

| Token | Value | Usage |
|-------|-------|-------|
| `bg-page` | `#F8FAFC` | Page background |
| `bg-surface` | `#FFFFFF` | Cards, panels |
| `text-primary` | `#0F172A` | Headings, primary text |
| `text-secondary` | `#64748B` | Descriptions, meta text |
| `brand-50` | `#F5F3FF` | Hover backgrounds |
| `brand-100` | `#EDE9FE` | Light accents |
| `brand-600` | `#7C3AED` | Primary buttons, links, active states |
| `brand-700` | `#6D28D9` | Hover primary |
| `status-info` | `#3B82F6` | Info badges |
| `status-success` | `#10B981` | Success, confirmed |
| `status-warning` | `#F59E0B` | Warning, pending |
| `status-danger` | `#EF4444` | Danger, overdue |
| `status-neutral` | `#94A3B8` | Tentative, inactive |

### 5.2 Typography

- Font family: `Inter`, system-ui, sans-serif.
- Base size: `16px` / `1rem`.
- Headings: `font-semibold` to `font-bold`.
- Body: `font-normal`, `leading-relaxed`.
- Labels/captions: `text-xs`, `font-medium`, uppercase tracking.

### 5.3 Spacing & Shapes

- Page padding: `p-6` to `p-8`.
- Card padding: `p-5` to `p-6`.
- Card border radius: `rounded-xl` (`1rem`).
- Card shadow: `shadow-sm` with subtle border `border-slate-100`.
- Button radius: `rounded-lg`.
- Avatar radius: `rounded-full`.

### 5.4 Core Components

- `Button`: variants `primary`, `secondary`, `ghost`, `danger`; sizes `sm`, `md`, `lg`.
- `Card`: container with consistent padding, radius, shadow, border.
- `Badge`: variants mapping to status colors.
- `Input`: text, email, password, with label and error state.
- `Avatar`: image fallback to initials.
- `NavItem`: top-nav item with active/hover states.
- `ModuleCard`: large card with icon, title, description.
- `EventRow`: event list item with date, title, location, status badge.
- `NewsItem`: announcement row with author, scope, date, action button.

## 6. File Structure

```
boilerplate-intranet/
├── docs/
│   ├── STYLE_GUIDE.md
│   └── superpowers/
│       └── specs/
│           └── 2026-07-08-boilerplate-fase1-shell-design.md
├── public/
│   └── logo-placeholder.svg
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── router.tsx
│   │   └── providers/
│   │       └── RepositoryProvider.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Avatar.tsx
│   │   │   └── index.ts
│   │   └── layout/
│   │       ├── TopNav.tsx
│   │       ├── ModuleSelector.tsx
│   │       ├── UserMenu.tsx
│   │       └── AppLayout.tsx
│   ├── features/
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   └── hooks/useLogin.ts
│   │   ├── dashboard/
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── ModuleGrid.tsx
│   │   │   ├── NewsFeed.tsx
│   │   │   ├── UpcomingEvents.tsx
│   │   │   └── Reminders.tsx
│   │   └── modules/
│   │       ├── ConceptOneShell.tsx
│   │       ├── EtraShell.tsx
│   │       ├── ProduccionShell.tsx
│   │       ├── CrudaShell.tsx
│   │       ├── CRMShell.tsx
│   │       ├── TeamShell.tsx
│   │       └── ConfigShell.tsx
│   ├── repositories/
│   │   ├── types.ts
│   │   ├── RepositoryContext.ts
│   │   ├── MockRepository.ts
│   │   └── adapters/
│   │       ├── SupabaseAdapter.ts
│   │       └── RestAdapter.ts
│   ├── lib/
│   │   ├── utils.ts
│   │   └── constants.ts
│   ├── styles/
│   │   └── index.css
│   ├── types/
│   │   └── index.ts
│   └── main.tsx
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 7. Data Abstraction Layer

### 7.1 Repository Interface

```ts
export interface Repository {
  // Auth
  login(email: string, password: string): Promise<UserSession>;
  getCurrentUser(): Promise<User | null>;
  logout(): Promise<void>;

  // Dashboard
  getDashboard(): Promise<Dashboard>;
  getModules(): Promise<Module[]>;
  getNews(): Promise<NewsItem[]>;
  getUpcomingEvents(): Promise<Event[]>;
  getReminders(): Promise<Reminder[]>;
}
```

### 7.2 Configuration

The active adapter is selected via environment variable:

```env
VITE_DATA_ADAPTER=mock
```

Valid values: `mock`, `supabase`, `rest`.

### 7.3 Mock Adapter

`MockRepository` returns typed fixtures matching the reference UI. It must:
- Accept configurable latency to simulate network.
- Throw predictable errors for testing error states.
- Be fully typed.

### 7.4 Future Adapters

`SupabaseAdapter` and `RestAdapter` are stubs implementing `Repository`. They throw `new Error("Not implemented in Fase 1")` or return empty typed results, providing the extension point without adding dependencies.

## 8. Brand Neutrality

- Logo: replace the reference logo with `public/logo-placeholder.svg`.
- App name: configurable via `VITE_APP_NAME` and `VITE_APP_SHORT_NAME`.
- Module names: stored in `lib/constants.ts` as constants, not hardcoded in components.
- Brand colors: defined as Tailwind config colors `brand-*`; changing the hex values in `tailwind.config.js` rebrands the entire app.
- No reference brand names, real person names, or real event data in committed fixtures.

## 9. Routing

| Route | Page | Notes |
|-------|------|-------|
| `/login` | `LoginPage` | Public visual login |
| `/` | `DashboardPage` | Home dashboard |
| `/conceptone` | `ConceptOneShell` | Placeholder module shell |
| `/etra` | `EtraShell` | Placeholder module shell |
| `/produccion` | `ProduccionShell` | Placeholder module shell |
| `/cruda` | `CrudaShell` | Placeholder module shell |
| `/crm` | `CRMShell` | Placeholder module shell |
| `/personal` | `TeamShell` | Placeholder module shell |
| `/configuracion` | `ConfigShell` | Placeholder module shell |

Protected route logic is out of scope for Fase 1; navigation is visual only.

## 10. Error Handling

- Repository methods return typed errors as rejected promises.
- UI components show a generic error fallback (`ErrorBoundary` stub) for unexpected errors.
- Form validation on login uses local HTML5 validation + basic length checks.

## 11. Testing

Minimum testing for Fase 1:

- Unit test: `MockRepository` returns expected dashboard shape.
- Component smoke test: `Button` renders all variants.
- No E2E tests in this phase.

## 12. GitHub Boilerplate Setup

- `README.md` with: clone, install, run, configure adapter, project structure.
- `.env.example` with all configurable variables and comments.
- `.gitignore` excluding `node_modules`, `dist`, `.env`, `.env.local`.
- `package.json` with standard scripts: `dev`, `build`, `preview`, `lint`, `format`.

## 13. Acceptance Criteria

- [ ] `npm install && npm run dev` starts the app without errors.
- [ ] Login page matches the reference layout visually (no logo/brand).
- [ ] Dashboard home displays modules, news, upcoming events, and reminders with mock data.
- [ ] All placeholder module routes render inside the shared layout.
- [ ] `MockRepository` can be swapped to `SupabaseAdapter` via env var without TypeScript errors.
- [ ] `docs/STYLE_GUIDE.md` exists and documents colors, typography, spacing, and core components.
- [ ] No real brand names, credentials, or backend URLs are committed.
- [ ] Repo is committed to GitHub as a public/private template.

## 14. Future Phases (not part of this spec)

- Fase 2: Booking & Management module (shows, logistics, artists, analytics).
- Fase 3: Comunicación & PR and Producción modules.
- Fase 4: CRUDA, CRM, Team, and Configuración modules.
- Fase 5: Real auth integration and protected routes.
