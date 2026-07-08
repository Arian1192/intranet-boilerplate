# Boilerplate Intranet — Fase 2: Módulo Booking & Management (Referencia Visual)

> **Status:** Draft pending review  
> **Owner:** Pi Agent + User  
> **Date:** 2026-07-08

---

## 1. Goal

Implement the Booking & Management module as a reusable visual reference for the boilerplate. The module will expose common UI patterns (KPI dashboard, data table, task list, card grid, analytics placeholders) using generic mock data. The content must remain business-agnostic so the boilerplate can be adapted to other domains.

## 2. Scope

### In scope (Fase 2)

- Replace the `ConceptOneShell` placeholder with a real Booking module shell.
- Implement the Booking Dashboard page with KPI cards, Advancing list, Logistics list, upcoming shows list, and urgent notes.
- Implement the Shows page with a generic data table.
- Implement the Logistics page with a task/checklist view.
- Implement the Artists page with a card grid.
- Implement the Analytics page with stat cards and chart placeholders.
- Extend the `Repository` interface with booking-related queries.
- Add generic mock fixtures to `MockRepository`.
- Keep `SupabaseAdapter` and `RestAdapter` as stubs.
- New reusable components: `KpiCard`, `StatusBadge`, `ShowListItem`, `DataTable`, `TaskList`, `ArtistCard`, `StatCard`, `ChartPlaceholder`.
- Update module tabs in `TopNav` so the active tab is highlighted.

### Out of scope

- Real backend integration.
- Interactive forms beyond the urgent-notes input.
- Real chart libraries (charts are placeholders).
- Filtering, sorting, pagination on tables.
- Authentication or protected routes.

## 3. Architecture

The module lives under `src/features/booking/`:

```
src/features/booking/
├── components/        # Module-specific UI pieces
│   ├── KpiCard.tsx
│   ├── StatusBadge.tsx
│   ├── ShowListItem.tsx
│   ├── DataTable.tsx
│   ├── TaskList.tsx
│   ├── ArtistCard.tsx
│   ├── StatCard.tsx
│   └── ChartPlaceholder.tsx
├── pages/
│   ├── BookingDashboardPage.tsx
│   ├── ShowsPage.tsx
│   ├── LogisticsPage.tsx
│   ├── ArtistsPage.tsx
│   └── AnalyticsPage.tsx
├── hooks/
│   └── useBooking.ts
└── index.ts
```

Data flow:
- Pages consume hooks that call the repository context.
- The repository exposes typed methods for booking data.
- `MockRepository` returns fixtures.

## 4. Tech Stack

Same as Fase 1: Vite 6, React 19, TypeScript 5, Tailwind CSS 3, React Router 7, Lucide React.

No new runtime dependencies. Chart placeholders are plain divs/CSS.

## 5. Design System

Reuses Fase 1 tokens:
- `brand-*` for primary accents.
- `slate-*` for neutrals.
- `status-*` for semantic colors.

### Status colors for KPIs and badges

| Status | Color | Tailwind usage |
|--------|-------|----------------|
| Tentative | slate | `bg-slate-500` |
| Offer | sky | `bg-sky-400` |
| Confirmed | cyan/sky | `bg-sky-500` |
| Contract | blue | `bg-blue-500` |
| Pending payment | red/rose | `bg-rose-500` |
| Pending settlement | indigo | `bg-indigo-500` |
| Done/Celebrated | emerald | `bg-emerald-500` |

## 6. File Structure

```
src/
├── components/
│   └── ui/            # Existing shared components
├── components/layout/
│   └── TopNav.tsx     # Update active tab highlight
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── modules/
│   │   └── ConceptOneShell.tsx   # Replace with Booking module shell
│   └── booking/
│       ├── components/
│       │   ├── KpiCard.tsx
│       │   ├── StatusBadge.tsx
│       │   ├── ShowListItem.tsx
│       │   ├── DataTable.tsx
│       │   ├── TaskList.tsx
│       │   ├── ArtistCard.tsx
│       │   ├── StatCard.tsx
│       │   └── ChartPlaceholder.tsx
│       ├── pages/
│       │   ├── BookingDashboardPage.tsx
│       │   ├── ShowsPage.tsx
│       │   ├── LogisticsPage.tsx
│       │   ├── ArtistsPage.tsx
│       │   └── AnalyticsPage.tsx
│       ├── hooks/
│       │   └── useBooking.ts
│       └── index.ts
├── repositories/
│   ├── types.ts       # Extend Repository
│   ├── MockRepository.ts
│   └── adapters/      # Stubs unchanged
└── app/
    └── router.tsx     # Update /conceptone sub-routes
```

## 7. Data Abstraction Layer

### 7.1 Extended Repository interface

```ts
export interface Repository {
  // ... existing methods

  // Booking module
  getBookingDashboard(): Promise<BookingDashboard>;
  getShows(): Promise<Show[]>;
  getLogistics(): Promise<LogisticsItem[]>;
  getArtists(): Promise<Artist[]>;
  getAnalytics(): Promise<AnalyticsSummary>;
}
```

### 7.2 Types

```ts
export interface BookingDashboard {
  kpis: Kpi[];
  advancing: ShowSummary[];
  logistics: ShowSummary[];
  upcomingShows: ShowSummary[];
}

export interface Kpi {
  id: string;
  label: string;
  amount: number;
  count: number;
  status: ShowStatus;
}

export type ShowStatus =
  | 'tentative'
  | 'offer'
  | 'confirmed'
  | 'contract'
  | 'pending-payment'
  | 'pending-settlement'
  | 'done';

export interface ShowSummary {
  id: string;
  title: string;
  date: string;
  daysLeft: number;
  badges: string[];
}

export interface Show {
  id: string;
  name: string;
  client: string;
  date: string;
  status: ShowStatus;
  amount: number;
}

export interface LogisticsItem {
  id: string;
  title: string;
  tasks: { id: string; label: string; done: boolean }[];
}

export interface Artist {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar?: string;
}

export interface AnalyticsSummary {
  stats: { label: string; value: string; change?: string }[];
}
```

## 8. Routes

The `/conceptone` route will have nested tabs:

| Route | Page |
|-------|------|
| `/conceptone` | `BookingDashboardPage` |
| `/conceptone/shows` | `ShowsPage` |
| `/conceptone/logistica` | `LogisticsPage` |
| `/conceptone/artistas` | `ArtistsPage` |
| `/conceptone/analitica` | `AnalyticsPage` |

Use React Router nested routes inside `ConceptOneShell`.

## 9. Brand Neutrality

- No real person names, brands, venues, or events.
- Use generic placeholders: "Evento Primavera", "Proyecto Q3", "Sala Norte", "Cliente A", "Ana López".
- The module name "Booking & Management" stays as a label but the data is generic.

## 10. Components Detail

### KpiCard

- Rounded card with colored top/left bar or full background.
- Shows amount, label, and count.
- Matches reference visual.

### StatusBadge

- Maps `ShowStatus` to colors.
- Small rounded badge.

### ShowListItem

- Row with D-X badge, title, date, and status badges.
- Used in Advancing, Logistics, and Upcoming Shows.

### DataTable

- Generic table with header and rows.
- Columns: Name, Client, Date, Status, Amount.

### TaskList

- Grouped tasks with checkboxes.
- Read-only for the boilerplate.

### ArtistCard

- Avatar, name, role, email.

### StatCard / ChartPlaceholder

- Simple stat with label/value.
- Chart placeholder as colored bar/area div.

## 11. Error Handling

- Pages show loading and error states.
- Notes input is local state only.

## 12. Testing

- Smoke test for `KpiCard` rendering.
- Smoke test for `DataTable` with mock rows.
- Existing tests must still pass.

## 13. Acceptance Criteria

- [ ] `/conceptone` displays the Booking Dashboard matching the reference layout.
- [ ] All five tabs render with generic example content.
- [ ] KPI cards use correct status colors.
- [ ] Module tabs highlight the active tab.
- [ ] `npm run dev`, `npm run lint`, `npm run test`, `npm run build` all pass.
- [ ] No real brand names, credentials, or production data committed.
- [ ] Repository interface extended; `MockRepository` provides fixtures.

## 14. Future Phases (not part of this spec)

- Fase 3: Comunicación & PR and Producción modules.
- Fase 4: CRUDA, CRM, Team, and Configuración modules.
- Fase 5: Real auth integration and protected routes.
