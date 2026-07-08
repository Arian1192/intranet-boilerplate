# Boilerplate Intranet — Fase 3: Comunicación & PR + Producción (Referencia Visual Pixel-Perfect)

> **Status:** Draft pending review
> **Owner:** Pi Agent + User
> **Date:** 2026-07-08

---

## 1. Goal

Implement the Comunicación & PR and Producción modules as pixel-perfect, brand-neutral visual references, reusing a small set of generic UI primitives (badge, kanban, master-detail, month calendar, segmented control) so that the same shapes can be repurposed for Fase 4 and for future non-booking verticals. This phase also corrects a design-token discrepancy found while validating the reference (brand purple, heading color, font stack) that affects every module already shipped.

This design was produced against the live reference application (read-only: navigation, accessibility snapshots, screenshots, and `getComputedStyle` inspection only — no create/edit/delete actions were performed). All real client names, people, venues, and business-line names observed during that inspection are excluded from this document and from the implementation; only structure, layout, and exact style values are carried over.

## 2. Scope

### In scope (Fase 3)

**Task 0 — Design token correction (cross-cutting, affects Fase 1-2 too):**
- Correct `brand-600`/`brand-700`/`brand-50` in `tailwind.config.js` to match the verified reference values.
- Update `docs/STYLE_GUIDE.md`: font stack (system-ui, not Inter — code already matches this, the doc doesn't), heading text color (slate-800, not slate-900).
- Visually re-verify Login, Dashboard, and Booking module after the token change (they should look the same shape, slightly less saturated purple).

**Comunicación & PR module (`/etra`):**
- Replace the `EtraShell` placeholder with a real module shell (dashboard + 3 tabs).
- Dashboard: 3 KPI stats + two list panels ("Próximas acciones" / "Cobertura reciente").
- Acciones page: Kanban board with 4 status columns and filter bar.
- Seeding page: 4 internal sub-tabs (Inventario, Entregas, Influencers, Reporte).
- Cuentas page: master-detail list with a 5-tab account detail panel.

**Producción module (`/produccion`):**
- Replace the `ProduccionShell` placeholder with a real module shell.
- Eventos page: segmented control (Listado / Calendario / Kanban) over the same event fixtures, plus a filter bar.

**New generic UI primitives** (in `src/components/ui/`, shared across modules and future phases): `Badge` (tone-based), `SegmentedControl`, `KanbanBoard`/`KanbanColumn`/`KanbanCard`, `MasterDetailList`, `MonthCalendar`, `ActivityListItem`.

- Extend `Repository` with Comunicación & PR and Producción queries; extend `MockRepository` with brand-neutral fixtures; extend adapter stubs.
- Update routing for `/etra` (with `/etra/tareas`, `/etra/seeding`, `/etra/cuentas`) and `/produccion`.

### Out of scope

- Event/account/action detail pages beyond what's shown in the list/kanban/calendar views and the account detail tabs (no click-through to a dedicated route).
- Any real interactivity behind "+ Nueva acción / entrega / entrada / influencer / evento / cuenta" and "Modificar cuenta" — these render but do nothing (visual reference only, consistent with Fase 1-2).
- Drag-and-drop in Kanban boards — status is fixed by fixture data, not user-editable.
- Real PDF export, real file uploads, real date-range filtering logic.
- Filtering/search/sorting actually filtering the fixture arrays (inputs render, but are decorative, same as Fase 2's tables).
- Authentication or protected routes (still Fase 5).

## 3. Verified Design Token Corrections

Captured via `getComputedStyle` on three independent live elements (Etra "Ver cuentas" button, Booking "+ Añadir show" button, active module tab): all three resolve to the same purple family, which does **not** match the current `tailwind.config.js`.

| Token | Current value | Verified real value | Elements confirmed on |
|---|---|---|---|
| `brand-600` | `#7C3AED` | **`#773C9F`** `rgb(119,60,159)` | primary buttons, active-tab text base |
| `brand-50` (active tab bg) | `#F5F3FF` | **`#F7F3FB`** `rgb(247,243,251)` | active module tab background |
| active tab text | — | **`#633383`** `rgb(99,51,131)` | active module tab text |
| heading color (`text-primary`) | `#0F172A` (slate-900) | **`#1E293B`** (slate-800) `rgb(30,41,59)` | h1 "Etra Agency", KPI numbers |
| font stack | `Inter, system-ui` (doc only; code already fixed) | `ui-sans-serif, system-ui, sans-serif` | body, all text |
| page background | `#F8FAFC` | confirmed unchanged | `body` |

Status badge tones confirmed:

| Status text seen | bg | text | Tailwind equivalent |
|---|---|---|---|
| Confirmado | `#DBEAFE` | `#1D4ED8` | `bg-blue-100 text-blue-700` |
| En producción / En curso | `#FEF3C7` | `#B45309` | `bg-amber-100 text-amber-700` |
| Promotor (smaller, 10px) | `#FAE8FF` | `#A21CAF` | `bg-fuchsia-100 text-fuchsia-700` |
| Activa (account/inventory) | light green | dark green | `bg-emerald-100 text-emerald-700` |

Kanban column accent colors (top border / header pill), by generic status:
- "Planificada"/"Idea" → slate/blue neutral
- "En curso"/"En producción" → amber
- "Hecha"/"Confirmado" → green/blue
- "Cancelada"/"Cerrado" → gray

Inputs/selects: `border-slate-300`, `rounded-lg` (8px), `px-3 py-2` (`8px 12px`), `text-sm` (14px), white background — matches existing `Input` component, no changes needed there.

## 4. Architecture

```
src/features/etra/
├── components/
│   ├── ActionKanbanCard.tsx
│   ├── InventoryCard.tsx
│   ├── DeliveryRow.tsx
│   ├── InfluencerCard.tsx
│   └── index.ts
├── pages/
│   ├── EtraDashboardPage.tsx
│   ├── ActionsPage.tsx
│   ├── SeedingPage.tsx        # internal sub-tabs: Inventario, Entregas, Influencers, Reporte
│   ├── AccountsPage.tsx
│   └── index.ts
├── hooks/
│   └── use*.ts (one per query, same pattern as booking)
└── index.ts

src/features/produccion/
├── pages/
│   └── EventsPage.tsx         # internal segmented control: Listado, Calendario, Kanban
├── hooks/
│   └── useProductionEvents.ts
└── index.ts

src/components/ui/
├── Badge.tsx            # tone-based, replaces ad-hoc colored spans
├── SegmentedControl.tsx
├── KanbanBoard.tsx / KanbanColumn.tsx / KanbanCard.tsx
├── MasterDetailList.tsx
├── MonthCalendar.tsx
├── ActivityListItem.tsx
├── StatCard.tsx          # promoted from src/features/booking/components/StatCard.tsx (moved, not duplicated)
└── index.ts (extended)
```

`StatCard` already exists under `src/features/booking/components/` (Fase 2). It's generic enough (label/value/change) to serve the PR dashboard's 3 KPIs and the Seeding Reporte page's 5 stat cards, so this phase **moves** it to `src/components/ui/` and updates the booking module's import — no new component, no duplication.

`EtraShell` and `ProduccionShell` (in `src/features/modules/`) become real shells with nested `<Outlet />` routes, following the exact pattern already established by `ConceptOneShell` in Fase 2. `ModuleShell` remains for the still-unbuilt Fase 4 modules (CRUDA, CRM, Team, Configuración).

## 5. Tech Stack

Same as Fase 1-2: Vite 6, React 19, TypeScript 5, Tailwind CSS 3, React Router 7, Lucide React. No new runtime dependencies — the month calendar and kanban board are plain divs/CSS grid, no calendar or DnD library.

## 6. Data Abstraction Layer

### 6.1 New types (`src/types/index.ts`)

```ts
// Comunicación & PR
export type ActionStatus = 'planned' | 'in-progress' | 'done' | 'cancelled';
export interface PrAction {
  id: string;
  title: string;
  account: string;
  type: string;
  amount: number;
  status: ActionStatus;
  date: string;
}

export type DeliveryTag = 'internal-use' | 'mrw-shipment' | 'delivered' | 'published';
export interface Delivery {
  id: string;
  date: string;
  account: string;
  tags: DeliveryTag[];
  recipient: string;
  itemsSummary: string;
  amount: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  variant: string; // e.g. "8 · Rojo"
  ref: string;
  quantity: number;
}

export interface Influencer {
  id: string;
  name: string;
  initials: string;
  instagramFollowers?: number;
  tiktokFollowers?: number;
}

export interface SeedingReportRow {
  date: string;
  influencer: string;
  pieces: number;
  productCost: number;
  shippingCost: number;
  publicationStatus: string;
}

export type AccountStatus = 'active' | 'paused' | 'inactive';
export interface PrAccount {
  id: string;
  name: string;
  status: AccountStatus;
  manager: string;
  crmClient: string;
  contact: string;
}

export interface ActivityItem {
  id: string;
  date: string;
  title: string;
  meta: string;
  badge?: string;
}

export interface PrDashboard {
  activeAccounts: number;
  totalAccounts: number;
  billingThisMonth: number;
  upcomingActions: ActivityItem[];
  recentCoverage: ActivityItem[];
}

// Producción
export type EventStatus = 'idea' | 'confirmed' | 'in-production' | 'in-progress' | 'closed';
export interface ProductionEvent {
  id: string;
  title: string;
  icon: string;
  date: string; // display date, e.g. "15 jul 2026"
  isoDate: string; // for calendar placement, e.g. "2026-07-15"
  time: string;
  venue: string;
  businessLines: string[];
  manager?: string;
  isHome: boolean;
  role?: 'promoter';
  status: EventStatus;
}
```

### 6.2 Extended Repository interface

```ts
export interface Repository {
  // ... existing methods (auth, dashboard, booking)

  // Comunicación & PR
  getPrDashboard(): Promise<PrDashboard>;
  getPrActions(): Promise<PrAction[]>;
  getInventory(): Promise<InventoryItem[]>;
  getDeliveries(): Promise<Delivery[]>;
  getInfluencers(): Promise<Influencer[]>;
  getSeedingReport(): Promise<SeedingReportRow[]>;
  getPrAccounts(): Promise<PrAccount[]>;

  // Producción
  getProductionEvents(): Promise<ProductionEvent[]>;
}
```

`MockRepository` implements all of these with brand-neutral fixtures (see §9). `SupabaseAdapter`/`RestAdapter` throw `Error('Not implemented in Fase 3')`, same convention as Fase 2.

## 7. Routes

| Route | Page | Notes |
|---|---|---|
| `/etra` | `EtraDashboardPage` | 3 KPIs + 2 activity panels |
| `/etra/tareas` | `ActionsPage` | Kanban, 4 columns |
| `/etra/seeding` | `SeedingPage` | internal state for the 4 sub-tabs, not sub-routes (matches reference: URL doesn't change on sub-tab click) |
| `/etra/cuentas` | `AccountsPage` | master-detail, internal state for selected account + its 5 detail tabs |
| `/produccion` | `EventsPage` | internal state for Listado/Calendario/Kanban (matches reference: URL doesn't change on view toggle) |

`EtraShell` tabs: **Acciones** (`/etra/tareas`), **Seeding** (`/etra/seeding`), **Cuentas** (`/etra/cuentas`) — three tabs only. Unlike `ConceptOneShell` (which has an explicit "Dashboard" pill alongside its other 4 tabs), the reference has **no "Dashboard" tab** for Etra: the breadcrumb module-name text itself (`Etra`) is the link back to `/etra`. Reuse the same `NavLink` + active-highlight mechanism as `ConceptOneShell`, just with a 3-item `tabs` array and the breadcrumb acting as the implicit "home" link (already how `TopNav`'s `ModuleHeader.name` renders — verify it's a link to `module.href ?? '/' + moduleSlug`, adding that prop if `TopNav` doesn't already support a clickable module name).

`ProduccionShell` tabs: **one** — "Eventos" (`/produccion`), structurally a real tab (inside the same `nav` element as Etra's tabs, rendered as a pill), just with a single item. The "Producción" breadcrumb text is separate from this tab, same pattern as Etra's breadcrumb. `EventsPage` is the sole page.

## 8. Brand Neutrality

Everything observed on the live reference that identifies the real client must be replaced with the same style of generic placeholder already used in Fase 2:

| Real (reference) | Generic (boilerplate) |
|---|---|
| "Black Moose Group" wordmark | already replaced by `APP_NAME` + placeholder logo |
| "Etra Agency" | module label stays "Comunicación & PR"; no sub-brand name needed |
| Real clients ("New Era", "TATTOOX") | "Cliente A", "Cliente B" |
| Real people (Carlos Pego, Eduard Torres, Marià Casals, Israel B Gras Cuenca...) | reuse Fase 2's fake roster (Ana López, Carlos Ruiz, María García, Laura Domènech) plus 1-2 new fake names if needed |
| Real venues/events (Soho Farmhouse Ibiza, Mixmag Intimate Sessions, Cósmico - SLS Barcelona...) | reuse Fase 2's fake event names ("Evento Primavera", "Sala Norte") |
| Real business lines (Mixmag Spain, Euphoric Media, TAGMAG, ConceptOne) | "Línea A", "Línea B", "Línea C" |
| Real product refs/emails/domains | generic refs (`REF-0001`), `@example.com` emails |

## 9. Components Detail

### Badge (`ui/Badge.tsx`)
`tone`: `'blue' | 'amber' | 'fuchsia' | 'emerald' | 'slate' | 'indigo'`. Renders `bg-{tone}-100 text-{tone}-700`, `rounded-full px-2.5 py-0.5 text-xs font-medium` (10px variant via `size="sm"` for tags like "Promotor"). Each feature maps its own status enum to a tone via a local `Record<Status, BadgeTone>` — the component itself knows nothing about booking/PR/production semantics.

### SegmentedControl (`ui/SegmentedControl.tsx`)
Props: `options: {label, value}[]`, `value`, `onChange`. Container `bg-slate-100 rounded-lg p-1`; active option `bg-white shadow-sm rounded-md text-slate-800`; inactive `text-slate-500`.

### KanbanBoard / KanbanColumn / KanbanCard (`ui/Kanban*.tsx`)
`KanbanBoard` takes `columns: {id, label, accentColor, items}[]` and renders a horizontal `grid` of `KanbanColumn`s. `KanbanColumn` has a colored top border (`border-t-4`) matching `accentColor`, a header with label + count pill, and a scrollable card stack (or an em-dash placeholder when empty, matching the reference's "—"). `KanbanCard` is a generic card slot (render-prop or `children`) so both PR actions and production events can supply their own card content.

### MasterDetailList (`ui/MasterDetailList.tsx`)
Two-column layout: left `list` of clickable rows (title + optional badge), right detail panel. Takes `items`, `selectedId`, `onSelect`, `renderDetail(item)`, and an `emptyState` string (defaults to "Selecciona un elemento o crea uno nuevo."). Used by `AccountsPage`.

### MonthCalendar (`ui/MonthCalendar.tsx`)
Props: `month`, `year`, `events: {isoDate, label, tone}[]`, `onPrevMonth`, `onNextMonth`. Renders week-day header (Lun-Dom) + 6-row grid, each day cell showing the day number and up to N event chips (`bg-{tone}-100 text-{tone}-700 text-xs truncate rounded px-1`).

### ActivityListItem (`ui/ActivityListItem.tsx`)
Generic version of Fase 2's `ShowListItem`: date/meta on one side, title + optional badges, badge/status on the other. Booking's `ShowListItem` is left untouched (already shipped); new modules use `ActivityListItem`.

## 10. Error Handling

Same convention as Fase 1-2: hooks expose `{data, isLoading, error}`; pages render a loading state, an error state, or the content. No new error patterns introduced.

## 11. Testing

- Smoke tests for the 6 new `ui/` primitives (one render test each, verifying key text/props render).
- Smoke test for `SeedingPage` sub-tab switching (renders Inventario by default, switches to Entregas on click).
- Smoke test for `EventsPage` view switching (Listado default, switches to Kanban/Calendario on click).
- Existing Fase 1-2 tests must still pass after the token correction (Task 0) — re-run `npm run test` after that change specifically, before building new pages.

## 12. Acceptance Criteria

- [ ] `brand-600/700/50` corrected to the verified values; `STYLE_GUIDE.md` updated (font stack, heading color); Login/Dashboard/Booking visually re-checked and unbroken.
- [ ] `/etra` dashboard matches the reference layout (3 KPIs, 2 activity panels, "Ver cuentas" button).
- [ ] `/etra/tareas` renders a 4-column kanban with the exact accent colors and filter bar.
- [ ] `/etra/seeding` renders all 4 sub-tabs with their respective layouts (Inventario, Entregas, Influencers, Reporte).
- [ ] `/etra/cuentas` renders the master-detail list with a 5-tab account detail panel.
- [ ] `/produccion` renders all 3 views (Listado, Calendario, Kanban) over the same fixture data, matching exact badge/tag colors.
- [ ] No real brand names, people, venues, business lines, credentials, or production URLs anywhere in the diff.
- [ ] `npm run dev`, `npm run lint`, `npm run test`, `npm run build` all pass.
- [ ] Repository interface extended; `MockRepository` provides fixtures for every new method; adapter stubs updated.

## 13. Future Phases (not part of this spec)

- Fase 4: CRUDA, CRM, Team, and Configuración modules (CRUDA introduces a new "stage progress bar" shape not yet covered by any Fase 3 primitive; Configuración introduces a left-sidebar layout instead of top tabs — both will need their own design pass).
- Fase 5: Real auth integration and protected routes.
