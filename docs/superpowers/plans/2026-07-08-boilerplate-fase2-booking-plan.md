# Boilerplate Intranet — Fase 2: Módulo Booking & Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Booking & Management module as a visual reference, including a KPI dashboard, data table, task list, card grid, and analytics placeholders, using generic mock data and the repository pattern.

**Architecture:** Extend the Fase 1 repository abstraction with booking-specific queries. Pages live under `src/features/booking/` and consume data via hooks. The `ConceptOneShell` becomes a real module shell with nested React Router tabs.

**Tech Stack:** Vite 6, React 19, TypeScript 5, Tailwind CSS 3, React Router 7, Lucide React.

## Global Constraints

- All code is TypeScript with strict mode enabled.
- No component fetches directly from external services; all data access goes through the repository context.
- No real brand names, credentials, production URLs, or real person/event data are committed.
- The active data adapter is controlled by `VITE_DATA_ADAPTER` (valid values: `mock`, `supabase`, `rest`).
- Brand colors are Tailwind config tokens (`brand-*`) and CSS variables, not hardcoded hex values in components.
- Module names and app name are constants in `src/lib/constants.ts`.
- Every task ends with a git commit.
- Fase 2 content is generic example data; booking-specific terms are labels only.

---

## Task 1: Extend Repository Types and Mock Fixtures for Booking

**Files:**
- Modify: `src/repositories/types.ts`
- Modify: `src/types/index.ts`
- Modify: `src/repositories/MockRepository.ts`
- Modify: `src/repositories/adapters/SupabaseAdapter.ts`
- Modify: `src/repositories/adapters/RestAdapter.ts`
- Create: `src/repositories/MockRepository.booking.test.ts`

**Interfaces:**
- Consumes: existing `Repository` interface.
- Produces: extended `Repository` with booking methods and new domain types.

- [ ] **Step 1: Add booking domain types to `src/types/index.ts`**

Append to `src/types/index.ts`:

```ts
export type ShowStatus =
  | 'tentative'
  | 'offer'
  | 'confirmed'
  | 'contract'
  | 'pending-payment'
  | 'pending-settlement'
  | 'done';

export interface Kpi {
  id: string;
  label: string;
  amount: number;
  count: number;
  status: ShowStatus;
}

export interface ShowSummary {
  id: string;
  title: string;
  date: string;
  daysLeft: number;
  badges: string[];
}

export interface BookingDashboard {
  kpis: Kpi[];
  advancing: ShowSummary[];
  logistics: ShowSummary[];
  upcomingShows: ShowSummary[];
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

- [ ] **Step 2: Extend Repository interface**

Modify `src/repositories/types.ts`:

```ts
import type {
  AnalyticsSummary,
  Artist,
  BookingDashboard,
  Dashboard,
  LogisticsItem,
  Show,
  User,
  UserSession,
} from '@/types';

export interface Repository {
  login(email: string, password: string): Promise<UserSession>;
  getCurrentUser(): Promise<User | null>;
  logout(): Promise<void>;
  getDashboard(): Promise<Dashboard>;

  // Booking module
  getBookingDashboard(): Promise<BookingDashboard>;
  getShows(): Promise<Show[]>;
  getLogistics(): Promise<LogisticsItem[]>;
  getArtists(): Promise<Artist[]>;
  getAnalytics(): Promise<AnalyticsSummary>;
}
```

- [ ] **Step 3: Add fixtures to MockRepository**

Append these private helpers and public methods to `src/repositories/MockRepository.ts`:

```ts
  async getBookingDashboard(): Promise<BookingDashboard> {
    return this.delay({
      kpis: [
        { id: '1', label: 'TENTATIVE', amount: 0, count: 0, status: 'tentative' },
        { id: '2', label: 'OFERTA', amount: 0, count: 0, status: 'offer' },
        { id: '3', label: 'CONFIRMADO', amount: 7000, count: 4, status: 'confirmed' },
        { id: '4', label: 'CONTRATO', amount: 0, count: 0, status: 'contract' },
        { id: '5', label: 'PENDIENTE PAGO', amount: 800, count: 1, status: 'pending-payment' },
        { id: '6', label: 'PENDIENTE LIQUIDAR', amount: 0, count: 0, status: 'pending-settlement' },
        { id: '7', label: 'CELEBRADO', amount: 0, count: 0, status: 'done' },
      ],
      advancing: [
        {
          id: 'a1',
          title: 'Los Canarios @ FUEGO',
          date: '18 jul 2026',
          daysLeft: 10,
          badges: ['Contrato sin firmar', 'Depósito pendiente', 'Falta firmante'],
        },
        {
          id: 'a2',
          title: 'Bizza @ Paradise - Bunker',
          date: '25 jul 2026',
          daysLeft: 17,
          badges: ['Contrato sin firmar', 'Depósito pendiente', 'Falta firmante'],
        },
        {
          id: 'a3',
          title: 'Brenda Serna @ Alcazar de San Juan',
          date: '04 sept 2026',
          daysLeft: 58,
          badges: ['Contrato sin firmar', 'Falta firmante'],
        },
      ],
      logistics: [
        {
          id: 'l1',
          title: 'Los Canarios @ FUEGO',
          date: '18 jul 2026',
          daysLeft: 10,
          badges: ['Pendiente logística', 'Sin set times', 'Gastos sin cerrar'],
        },
        {
          id: 'l2',
          title: 'Bizza @ Paradise - Bunker',
          date: '25 jul 2026',
          daysLeft: 17,
          badges: ['Pendiente logística', 'Sin set times', 'Gastos sin cerrar'],
        },
        {
          id: 'l3',
          title: 'Brenda Serna @ Alcazar de San Juan',
          date: '04 sept 2026',
          daysLeft: 58,
          badges: ['Pendiente logística', 'Sin set times'],
        },
      ],
      upcomingShows: [
        {
          id: 'u1',
          title: 'Los Canarios @ FUEGO',
          date: '18 jul 2026',
          daysLeft: 10,
          badges: ['Confirmado', 'No abonado'],
        },
        {
          id: 'u2',
          title: 'Bizza @ Paradise - Bunker',
          date: '25 jul 2026',
          daysLeft: 17,
          badges: ['Confirmado', 'No abonado'],
        },
        {
          id: 'u3',
          title: 'Brenda Serna @ Alcazar de San Juan',
          date: '04 sept 2026',
          daysLeft: 58,
          badges: ['Confirmado', 'No abonado'],
        },
      ],
    });
  }

  async getShows(): Promise<Show[]> {
    return this.delay([
      { id: 's1', name: 'Evento Primavera', client: 'Cliente A', date: '15 jul 2026', status: 'confirmed', amount: 3500 },
      { id: 's2', name: 'Proyecto Q3', client: 'Cliente B', date: '18 jul 2026', status: 'pending-payment', amount: 800 },
      { id: 's3', name: 'Campaña Verano', client: 'Cliente C', date: '25 jul 2026', status: 'confirmed', amount: 2200 },
      { id: 's4', name: 'Lanzamiento Producto', client: 'Cliente D', date: '04 sept 2026', status: 'contract', amount: 1500 },
    ]);
  }

  async getLogistics(): Promise<LogisticsItem[]> {
    return this.delay([
      {
        id: 'log1',
        title: 'Evento Primavera',
        tasks: [
          { id: 't1', label: 'Confirmar itinerario', done: false },
          { id: 't2', label: 'Reservar vuelos', done: false },
          { id: 't3', label: 'Definir set times', done: true },
        ],
      },
      {
        id: 'log2',
        title: 'Proyecto Q3',
        tasks: [
          { id: 't4', label: 'Confirmar itinerario', done: false },
          { id: 't5', label: 'Reservar alojamiento', done: false },
        ],
      },
    ]);
  }

  async getArtists(): Promise<Artist[]> {
    return this.delay([
      { id: 'ar1', name: 'Ana López', role: 'Directora', email: 'ana@example.com' },
      { id: 'ar2', name: 'Carlos Ruiz', role: 'Productor', email: 'carlos@example.com' },
      { id: 'ar3', name: 'María García', role: 'Técnica', email: 'maria@example.com' },
      { id: 'ar4', name: 'Laura Domènech', role: 'Manager', email: 'laura@example.com' },
    ]);
  }

  async getAnalytics(): Promise<AnalyticsSummary> {
    return this.delay({
      stats: [
        { label: 'Shows este mes', value: '12', change: '+20%' },
        { label: 'Ingresos', value: '18.400 €', change: '+8%' },
        { label: 'Pendientes', value: '3', change: '-1' },
        { label: 'Confirmados', value: '7', change: '+2' },
      ],
    });
  }
```

- [ ] **Step 4: Update adapter stubs**

Add these methods to `src/repositories/adapters/SupabaseAdapter.ts` and `src/repositories/adapters/RestAdapter.ts`:

```ts
  async getBookingDashboard(): Promise<BookingDashboard> {
    throw new Error('SupabaseAdapter not implemented in Fase 2');
  }

  async getShows(): Promise<Show[]> {
    throw new Error('SupabaseAdapter not implemented in Fase 2');
  }

  async getLogistics(): Promise<LogisticsItem[]> {
    throw new Error('SupabaseAdapter not implemented in Fase 2');
  }

  async getArtists(): Promise<Artist[]> {
    throw new Error('SupabaseAdapter not implemented in Fase 2');
  }

  async getAnalytics(): Promise<AnalyticsSummary> {
    throw new Error('SupabaseAdapter not implemented in Fase 2');
  }
```

Use `RestAdapter` in the other file with the same methods.

- [ ] **Step 5: Add repository tests**

Create `src/repositories/MockRepository.booking.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { MockRepository } from './MockRepository';

describe('MockRepository booking', () => {
  it('returns booking dashboard with kpis and lists', async () => {
    const repo = new MockRepository();
    const data = await repo.getBookingDashboard();
    expect(data.kpis.length).toBe(7);
    expect(data.advancing.length).toBeGreaterThan(0);
    expect(data.logistics.length).toBeGreaterThan(0);
    expect(data.upcomingShows.length).toBeGreaterThan(0);
  });

  it('returns shows', async () => {
    const repo = new MockRepository();
    const shows = await repo.getShows();
    expect(shows.length).toBeGreaterThan(0);
    expect(shows[0].amount).toBeDefined();
  });

  it('returns artists', async () => {
    const repo = new MockRepository();
    const artists = await repo.getArtists();
    expect(artists.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 6: Run tests**

```bash
npm run test
```

Expected: all tests pass.

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: extend repository with booking module types and fixtures"
```

---

## Task 2: Update Module Shell and Routing for Nested Tabs

**Files:**
- Modify: `src/app/router.tsx`
- Modify: `src/features/modules/ConceptOneShell.tsx`
- Modify: `src/components/layout/TopNav.tsx`
- Modify: `src/components/layout/AppLayout.tsx`
- Create: `src/features/modules/index.ts`

**Interfaces:**
- Consumes: `ModuleHeader` type from `TopNav`.
- Produces: nested routes under `/conceptone` and active tab highlighting.

- [ ] **Step 1: Update AppLayout to accept active tab**

Modify `src/components/layout/AppLayout.tsx`:

```tsx
import { TopNav } from './TopNav';
import type { ModuleHeader } from './TopNav';
import type { User } from '@/types';

export interface AppLayoutProps {
  user: User;
  children: React.ReactNode;
  module?: ModuleHeader;
}

export function AppLayout({ user, children, module }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <TopNav user={user} notificationCount={7} module={module} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
```

- [ ] **Step 2: Update TopNav to render tabs as NavLink**

Modify `src/components/layout/TopNav.tsx` to import `NavLink` and render tabs with active state:

```tsx
import { Bell } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import { UserMenu } from './UserMenu';
import { NavLink } from 'react-router';
import type { User } from '@/types';
import { cn } from '@/lib/utils';

export interface ModuleHeader {
  name: string;
  tabs: { label: string; href: string }[];
}

export interface TopNavProps {
  user: User;
  notificationCount?: number;
  module?: ModuleHeader;
}

export function TopNav({ user, notificationCount = 0, module }: TopNavProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white font-bold">
              {APP_NAME.charAt(0)}
            </div>
            <span className="text-lg font-medium text-slate-900">{APP_NAME}</span>
          </div>

          {module && (
            <nav className="hidden items-center gap-1 md:flex" aria-label={`Pestañas de ${module.name}`}>
              <span className="mr-2 text-sm font-semibold text-slate-400">/</span>
              <span className="mr-3 text-sm font-semibold text-slate-900">{module.name}</span>
              {module.tabs.map((tab) => (
                <NavLink
                  key={tab.href}
                  to={tab.href}
                  end={tab.href === '/conceptone'}
                  className={({ isActive }) =>
                    cn(
                      'rounded-lg px-3 py-2 text-sm font-normal transition-colors',
                      isActive
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-slate-600 hover:bg-slate-100'
                    )
                  }
                >
                  {tab.label}
                </NavLink>
              ))}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="relative grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100"
            aria-label="Notificaciones"
          >
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-medium text-white">
                {notificationCount}
              </span>
            )}
          </button>
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Update ConceptOneShell with nested Outlet**

Replace `src/features/modules/ConceptOneShell.tsx`:

```tsx
import { Outlet } from 'react-router';
import { AppLayout } from '@/components/layout';
import type { User } from '@/types';

const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'Admin',
};

const tabs = [
  { label: 'Dashboard', href: '/conceptone' },
  { label: 'Shows', href: '/conceptone/shows' },
  { label: 'Logística', href: '/conceptone/logistica' },
  { label: 'Artistas', href: '/conceptone/artistas' },
  { label: 'Analítica', href: '/conceptone/analitica' },
];

export function ConceptOneShell() {
  return (
    <AppLayout user={mockUser} module={{ name: 'Booking & Management', tabs }}>
      <Outlet />
    </AppLayout>
  );
}
```

- [ ] **Step 4: Update router with nested routes**

Modify `src/app/router.tsx`:

```tsx
import { Routes, Route } from 'react-router';
import { LoginPage } from '@/features/auth/LoginPage';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { ConceptOneShell } from '@/features/modules/ConceptOneShell';
import { EtraShell } from '@/features/modules/EtraShell';
import { ProduccionShell } from '@/features/modules/ProduccionShell';
import { CrudaShell } from '@/features/modules/CrudaShell';
import { CRMShell } from '@/features/modules/CRMShell';
import { TeamShell } from '@/features/modules/TeamShell';
import { ConfigShell } from '@/features/modules/ConfigShell';
import { BookingDashboardPage } from '@/features/booking/pages/BookingDashboardPage';
import { ShowsPage } from '@/features/booking/pages/ShowsPage';
import { LogisticsPage } from '@/features/booking/pages/LogisticsPage';
import { ArtistsPage } from '@/features/booking/pages/ArtistsPage';
import { AnalyticsPage } from '@/features/booking/pages/AnalyticsPage';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<DashboardPage />} />
      <Route path="/conceptone" element={<ConceptOneShell />}>
        <Route index element={<BookingDashboardPage />} />
        <Route path="shows" element={<ShowsPage />} />
        <Route path="logistica" element={<LogisticsPage />} />
        <Route path="artistas" element={<ArtistsPage />} />
        <Route path="analitica" element={<AnalyticsPage />} />
      </Route>
      <Route path="/etra" element={<EtraShell />} />
      <Route path="/produccion" element={<ProduccionShell />} />
      <Route path="/cruda" element={<CrudaShell />} />
      <Route path="/crm" element={<CRMShell />} />
      <Route path="/personal" element={<TeamShell />} />
      <Route path="/configuracion" element={<ConfigShell />} />
    </Routes>
  );
}
```

- [ ] **Step 5: Remove old ModuleShell usage in ConceptOneShell if needed**

The old `ConceptOneShell.tsx` imported `ModuleShell`. The new version does not. Verify `ModuleShell.tsx` is still used by other modules (yes, EtraShell, etc.).

- [ ] **Step 6: Create placeholder booking pages**

Create minimal placeholder files so the router compiles:

`src/features/booking/pages/BookingDashboardPage.tsx`:
```tsx
export function BookingDashboardPage() {
  return <div>Booking Dashboard</div>;
}
```

Create similar placeholders for `ShowsPage.tsx`, `LogisticsPage.tsx`, `ArtistsPage.tsx`, `AnalyticsPage.tsx`.

- [ ] **Step 7: Verify dev server and tab navigation**

```bash
npm run dev
```

Navigate to `/conceptone`, `/conceptone/shows`, etc., and confirm tabs highlight correctly.

- [ ] **Step 8: Commit**

```bash
git add .
git commit -m "feat: add nested routes and active tab highlighting for booking module"
```

---

## Task 3: Create Shared Booking Components

**Files:**
- Create: `src/features/booking/components/KpiCard.tsx`
- Create: `src/features/booking/components/StatusBadge.tsx`
- Create: `src/features/booking/components/ShowListItem.tsx`
- Create: `src/features/booking/components/DataTable.tsx`
- Create: `src/features/booking/components/TaskList.tsx`
- Create: `src/features/booking/components/ArtistCard.tsx`
- Create: `src/features/booking/components/StatCard.tsx`
- Create: `src/features/booking/components/ChartPlaceholder.tsx`
- Create: `src/features/booking/components/index.ts`
- Create: `src/lib/format.ts`

**Interfaces:**
- Consumes: `Kpi`, `ShowStatus`, `ShowSummary`, `Show`, `LogisticsItem`, `Artist`, `AnalyticsSummary` types.
- Produces: reusable presentational components.

- [ ] **Step 1: Create format utility**

`src/lib/format.ts`:

```ts
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(amount);
}
```

- [ ] **Step 2: Create StatusBadge**

`src/features/booking/components/StatusBadge.tsx`:

```tsx
import { cn } from '@/lib/utils';
import type { ShowStatus } from '@/types';

export interface StatusBadgeProps {
  status: ShowStatus;
  children: React.ReactNode;
  className?: string;
}

const statusStyles: Record<ShowStatus, string> = {
  tentative: 'bg-slate-500',
  offer: 'bg-sky-400',
  confirmed: 'bg-sky-500',
  contract: 'bg-blue-500',
  'pending-payment': 'bg-rose-500',
  'pending-settlement': 'bg-indigo-500',
  done: 'bg-emerald-500',
};

export function StatusBadge({ status, children, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex rounded-md px-2 py-1 text-xs font-medium text-white',
        statusStyles[status],
        className
      )}
    >
      {children}
    </span>
  );
}
```

- [ ] **Step 3: Create KpiCard**

`src/features/booking/components/KpiCard.tsx`:

```tsx
import { formatCurrency } from '@/lib/format';
import type { Kpi } from '@/types';

export interface KpiCardProps {
  kpi: Kpi;
}

const statusStyles: Record<Kpi['status'], string> = {
  tentative: 'bg-slate-500',
  offer: 'bg-sky-400',
  confirmed: 'bg-sky-500',
  contract: 'bg-blue-500',
  'pending-payment': 'bg-rose-500',
  'pending-settlement': 'bg-indigo-500',
  done: 'bg-emerald-500',
};

export function KpiCard({ kpi }: KpiCardProps) {
  return (
    <div className={`flex flex-col justify-between rounded-xl p-4 text-white ${statusStyles[kpi.status]}`}>
      <p className="text-lg font-semibold">{formatCurrency(kpi.amount)}</p>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide">{kpi.label}</p>
        <p className="text-xs opacity-90">{kpi.count} shows</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create ShowListItem**

`src/features/booking/components/ShowListItem.tsx`:

```tsx
import { Badge } from '@/components/ui';
import type { ShowSummary } from '@/types';

export interface ShowListItemProps {
  item: ShowSummary;
}

export function ShowListItem({ item }: ShowListItemProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <Badge variant="warning" className="rounded-md px-1.5 py-0.5 text-[10px] font-bold">
            D-{item.daysLeft}
          </Badge>
          <h4 className="font-normal text-slate-900">{item.title}</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {item.badges.map((badge) => (
            <span
              key={badge}
              className="rounded-md border border-slate-100 bg-slate-50 px-2 py-0.5 text-xs text-slate-600"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
      <span className="text-xs text-slate-400">{item.date}</span>
    </div>
  );
}
```

- [ ] **Step 5: Create DataTable**

`src/features/booking/components/DataTable.tsx`:

```tsx
import { formatCurrency } from '@/lib/format';
import { StatusBadge } from './StatusBadge';
import type { Show } from '@/types';

export interface DataTableProps {
  shows: Show[];
}

export function DataTable({ shows }: DataTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs font-medium uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Nombre</th>
            <th className="px-4 py-3">Cliente</th>
            <th className="px-4 py-3">Fecha</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3 text-right">Importe</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {shows.map((show) => (
            <tr key={show.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-normal text-slate-900">{show.name}</td>
              <td className="px-4 py-3 text-slate-500">{show.client}</td>
              <td className="px-4 py-3 text-slate-500">{show.date}</td>
              <td className="px-4 py-3">
                <StatusBadge status={show.status}>{show.status}</StatusBadge>
              </td>
              <td className="px-4 py-3 text-right font-medium text-slate-700">
                {formatCurrency(show.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 6: Create TaskList**

`src/features/booking/components/TaskList.tsx`:

```tsx
import { Card } from '@/components/ui';
import type { LogisticsItem } from '@/types';

export interface TaskListProps {
  items: LogisticsItem[];
}

export function TaskList({ items }: TaskListProps) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id} className="p-4">
          <h4 className="mb-3 font-medium text-slate-900">{item.title}</h4>
          <ul className="space-y-2">
            {item.tasks.map((task) => (
              <li key={task.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={task.done}
                  readOnly
                  className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <span className={`text-sm ${task.done ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                  {task.label}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
}
```

- [ ] **Step 7: Create ArtistCard**

`src/features/booking/components/ArtistCard.tsx`:

```tsx
import { Avatar, Card } from '@/components/ui';
import type { Artist } from '@/types';

export interface ArtistCardProps {
  artist: Artist;
}

export function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <Card className="flex items-center gap-3 p-4">
      <Avatar fallback={artist.name} size="lg" src={artist.avatar} />
      <div className="min-w-0">
        <p className="font-medium text-slate-900">{artist.name}</p>
        <p className="text-xs text-slate-500">{artist.role}</p>
        <p className="truncate text-xs text-slate-400">{artist.email}</p>
      </div>
    </Card>
  );
}
```

- [ ] **Step 8: Create StatCard and ChartPlaceholder**

`src/features/booking/components/StatCard.tsx`:

```tsx
import { Card } from '@/components/ui';

export interface StatCardProps {
  label: string;
  value: string;
  change?: string;
}

export function StatCard({ label, value, change }: StatCardProps) {
  return (
    <Card className="p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-2xl font-semibold text-slate-900">{value}</p>
      {change && <p className="text-xs text-emerald-600">{change}</p>}
    </Card>
  );
}
```

`src/features/booking/components/ChartPlaceholder.tsx`:

```tsx
export interface ChartPlaceholderProps {
  title: string;
}

export function ChartPlaceholder({ title }: ChartPlaceholderProps) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <p className="mb-4 text-sm font-medium text-slate-700">{title}</p>
      <div className="flex h-40 items-end gap-2">
        {[40, 70, 50, 90, 60, 80, 45, 75, 55, 85].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t bg-brand-200"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 9: Create barrel export**

`src/features/booking/components/index.ts`:

```ts
export * from './KpiCard';
export * from './StatusBadge';
export * from './ShowListItem';
export * from './DataTable';
export * from './TaskList';
export * from './ArtistCard';
export * from './StatCard';
export * from './ChartPlaceholder';
```

- [ ] **Step 10: Verify lint and build**

```bash
npm run lint
npm run build
```

- [ ] **Step 11: Commit**

```bash
git add .
git commit -m "feat: add shared booking module components"
```

---

## Task 4: Implement Booking Dashboard Page

**Files:**
- Create: `src/features/booking/pages/BookingDashboardPage.tsx`
- Create: `src/features/booking/hooks/useBookingDashboard.ts`
- Modify: `src/features/booking/pages/index.ts`

**Interfaces:**
- Consumes: `BookingDashboard`, `KpiCard`, `ShowListItem`, `Card`, `Badge`, `Input`, `Button`.
- Produces: complete dashboard page.

- [ ] **Step 1: Create useBookingDashboard hook**

`src/features/booking/hooks/useBookingDashboard.ts`:

```ts
import { useEffect, useState } from 'react';
import { useRepository } from '@/repositories';
import type { BookingDashboard } from '@/types';

export function useBookingDashboard() {
  const repository = useRepository();
  const [data, setData] = useState<BookingDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    repository
      .getBookingDashboard()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Error');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [repository]);

  return { data, isLoading, error };
}
```

- [ ] **Step 2: Implement BookingDashboardPage**

`src/features/booking/pages/BookingDashboardPage.tsx`:

```tsx
import { useState } from 'react';
import { Card, Input, Button } from '@/components/ui';
import { KpiCard, ShowListItem } from '@/features/booking/components';
import { useBookingDashboard } from '../hooks/useBookingDashboard';

export function BookingDashboardPage() {
  const { data, isLoading, error } = useBookingDashboard();
  const [note, setNote] = useState('');

  if (isLoading) {
    return <div className="py-12 text-center text-slate-500">Cargando...</div>;
  }

  if (error || !data) {
    return <div className="py-12 text-center text-red-600">Error: {error || 'No data'}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        {data.kpis.map((kpi) => (
          <KpiCard key={kpi.id} kpi={kpi} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-orange-400" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Advancing
            </h2>
            <span className="text-xs text-slate-400">· Contrato · pagos · detalles</span>
            <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
              {data.advancing.length}
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {data.advancing.map((item) => (
              <ShowListItem key={item.id} item={item} />
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-sky-400" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Logística
            </h2>
            <span className="text-xs text-slate-400">· Itinerario · vuelos · set times</span>
            <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
              {data.logistics.length}
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {data.logistics.map((item) => (
              <ShowListItem key={item.id} item={item} />
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Próximos shows
          </h2>
          <div className="divide-y divide-slate-100">
            {data.upcomingShows.map((item) => (
              <ShowListItem key={item.id} item={item} />
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Notas urgentes
          </h2>
          <div className="flex gap-2">
            <Input
              placeholder="Añadir nota..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="flex-1"
            />
            <Button type="button" size="sm">
              +
            </Button>
          </div>
          <p className="mt-4 text-center text-sm text-slate-400">Sin notas pendientes.</p>
        </Card>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create pages barrel export**

`src/features/booking/pages/index.ts`:

```ts
export * from './BookingDashboardPage';
export * from './ShowsPage';
export * from './LogisticsPage';
export * from './ArtistsPage';
export * from './AnalyticsPage';
```

- [ ] **Step 4: Verify dashboard renders**

```bash
npm run dev
```

Navigate to `/conceptone` and confirm the dashboard matches the reference layout.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: add booking dashboard page"
```

---

## Task 5: Implement Shows Page

**Files:**
- Create: `src/features/booking/hooks/useShows.ts`
- Modify: `src/features/booking/pages/ShowsPage.tsx`

**Interfaces:**
- Consumes: `Show[]`, `DataTable`, `useRepository`.
- Produces: Shows page with data table.

- [ ] **Step 1: Create useShows hook**

`src/features/booking/hooks/useShows.ts`:

```ts
import { useEffect, useState } from 'react';
import { useRepository } from '@/repositories';
import type { Show } from '@/types';

export function useShows() {
  const repository = useRepository();
  const [shows, setShows] = useState<Show[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    repository
      .getShows()
      .then((result) => {
        if (!cancelled) setShows(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Error');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [repository]);

  return { shows, isLoading, error };
}
```

- [ ] **Step 2: Implement ShowsPage**

`src/features/booking/pages/ShowsPage.tsx`:

```tsx
import { DataTable } from '@/features/booking/components';
import { useShows } from '../hooks/useShows';

export function ShowsPage() {
  const { shows, isLoading, error } = useShows();

  if (isLoading) {
    return <div className="py-12 text-center text-slate-500">Cargando...</div>;
  }

  if (error) {
    return <div className="py-12 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Shows</h1>
      <DataTable shows={shows} />
    </div>
  );
}
```

- [ ] **Step 3: Verify**

```bash
npm run dev
```

Navigate to `/conceptone/shows`.

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: add shows page with data table"
```

---

## Task 6: Implement Logistics Page

**Files:**
- Create: `src/features/booking/hooks/useLogistics.ts`
- Modify: `src/features/booking/pages/LogisticsPage.tsx`

**Interfaces:**
- Consumes: `LogisticsItem[]`, `TaskList`.
- Produces: Logistics page.

- [ ] **Step 1: Create useLogistics hook**

`src/features/booking/hooks/useLogistics.ts`:

```ts
import { useEffect, useState } from 'react';
import { useRepository } from '@/repositories';
import type { LogisticsItem } from '@/types';

export function useLogistics() {
  const repository = useRepository();
  const [items, setItems] = useState<LogisticsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    repository
      .getLogistics()
      .then((result) => {
        if (!cancelled) setItems(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Error');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [repository]);

  return { items, isLoading, error };
}
```

- [ ] **Step 2: Implement LogisticsPage**

`src/features/booking/pages/LogisticsPage.tsx`:

```tsx
import { TaskList } from '@/features/booking/components';
import { useLogistics } from '../hooks/useLogistics';

export function LogisticsPage() {
  const { items, isLoading, error } = useLogistics();

  if (isLoading) {
    return <div className="py-12 text-center text-slate-500">Cargando...</div>;
  }

  if (error) {
    return <div className="py-12 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Logística</h1>
      <TaskList items={items} />
    </div>
  );
}
```

- [ ] **Step 3: Verify and commit**

```bash
npm run dev
```

Navigate to `/conceptone/logistica`.

```bash
git add .
git commit -m "feat: add logistics page with task list"
```

---

## Task 7: Implement Artists Page

**Files:**
- Create: `src/features/booking/hooks/useArtists.ts`
- Modify: `src/features/booking/pages/ArtistsPage.tsx`

**Interfaces:**
- Consumes: `Artist[]`, `ArtistCard`.
- Produces: Artists page.

- [ ] **Step 1: Create useArtists hook**

`src/features/booking/hooks/useArtists.ts`:

```ts
import { useEffect, useState } from 'react';
import { useRepository } from '@/repositories';
import type { Artist } from '@/types';

export function useArtists() {
  const repository = useRepository();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    repository
      .getArtists()
      .then((result) => {
        if (!cancelled) setArtists(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Error');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [repository]);

  return { artists, isLoading, error };
}
```

- [ ] **Step 2: Implement ArtistsPage**

`src/features/booking/pages/ArtistsPage.tsx`:

```tsx
import { ArtistCard } from '@/features/booking/components';
import { useArtists } from '../hooks/useArtists';

export function ArtistsPage() {
  const { artists, isLoading, error } = useArtists();

  if (isLoading) {
    return <div className="py-12 text-center text-slate-500">Cargando...</div>;
  }

  if (error) {
    return <div className="py-12 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Artistas</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {artists.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify and commit**

```bash
npm run dev
```

Navigate to `/conceptone/artistas`.

```bash
git add .
git commit -m "feat: add artists page with card grid"
```

---

## Task 8: Implement Analytics Page

**Files:**
- Create: `src/features/booking/hooks/useAnalytics.ts`
- Modify: `src/features/booking/pages/AnalyticsPage.tsx`

**Interfaces:**
- Consumes: `AnalyticsSummary`, `StatCard`, `ChartPlaceholder`.
- Produces: Analytics page.

- [ ] **Step 1: Create useAnalytics hook**

`src/features/booking/hooks/useAnalytics.ts`:

```ts
import { useEffect, useState } from 'react';
import { useRepository } from '@/repositories';
import type { AnalyticsSummary } from '@/types';

export function useAnalytics() {
  const repository = useRepository();
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    repository
      .getAnalytics()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Error');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [repository]);

  return { data, isLoading, error };
}
```

- [ ] **Step 2: Implement AnalyticsPage**

`src/features/booking/pages/AnalyticsPage.tsx`:

```tsx
import { StatCard, ChartPlaceholder } from '@/features/booking/components';
import { useAnalytics } from '../hooks/useAnalytics';

export function AnalyticsPage() {
  const { data, isLoading, error } = useAnalytics();

  if (isLoading) {
    return <div className="py-12 text-center text-slate-500">Cargando...</div>;
  }

  if (error || !data) {
    return <div className="py-12 text-center text-red-600">Error: {error || 'No data'}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Analítica</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.stats.map((stat, index) => (
          <StatCard key={index} label={stat.label} value={stat.value} change={stat.change} />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartPlaceholder title="Evolución mensual" />
        <ChartPlaceholder title="Distribución por estado" />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify and commit**

```bash
npm run dev
```

Navigate to `/conceptone/analitica`.

```bash
git add .
git commit -m "feat: add analytics page with stat cards and chart placeholders"
```

---

## Task 9: Tests and Final Verification

**Files:**
- Create: `src/features/booking/components/KpiCard.test.tsx`
- Create: `src/features/booking/components/DataTable.test.tsx`
- Modify: `package.json` (if needed)

**Interfaces:**
- Produces: passing test suite and green build.

- [ ] **Step 1: Add KpiCard test**

`src/features/booking/components/KpiCard.test.tsx`:

```tsx
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { KpiCard } from './KpiCard';

const mockKpi = {
  id: '1',
  label: 'CONFIRMADO',
  amount: 7000,
  count: 4,
  status: 'confirmed' as const,
};

describe('KpiCard', () => {
  it('renders amount, label and count', () => {
    render(<KpiCard kpi={mockKpi} />);
    expect(screen.getByText('7.000,00 €')).toBeInTheDocument();
    expect(screen.getByText('CONFIRMADO')).toBeInTheDocument();
    expect(screen.getByText('4 shows')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Add DataTable test**

`src/features/booking/components/DataTable.test.tsx`:

```tsx
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DataTable } from './DataTable';

const mockShows = [
  {
    id: '1',
    name: 'Evento Primavera',
    client: 'Cliente A',
    date: '15 jul 2026',
    status: 'confirmed' as const,
    amount: 3500,
  },
];

describe('DataTable', () => {
  it('renders show rows', () => {
    render(<DataTable shows={mockShows} />);
    expect(screen.getByText('Evento Primavera')).toBeInTheDocument();
    expect(screen.getByText('Cliente A')).toBeInTheDocument();
    expect(screen.getByText('3.500,00 €')).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run full verification**

```bash
npm run test
npm run lint
npm run build
```

Expected: all tests pass, lint clean, build succeeds.

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "test: add booking component smoke tests"
```

---

## Task 10: Push Feature Branch

**Files:**
- Modify: remote git repository

**Interfaces:**
- Produces: `feature/fase2-booking` pushed to origin.

- [ ] **Step 1: Push branch**

```bash
git push -u origin feature/fase2-booking
```

- [ ] **Step 2: Verify branch on GitHub**

```bash
gh repo view --json url
```

Report the branch URL to the user.

---

## Plan Self-Review

### Spec coverage

- Repository extension and fixtures: Task 1.
- Nested routing and active tabs: Task 2.
- Shared booking components: Task 3.
- Booking Dashboard: Task 4.
- Shows page: Task 5.
- Logistics page: Task 6.
- Artists page: Task 7.
- Analytics page: Task 8.
- Tests and verification: Task 9.
- GitHub push: Task 10.

### Placeholder scan

No TBD/TODO/fill-in-later steps. All code is provided.

### Type consistency

- `ShowStatus`, `Kpi`, `ShowSummary`, `Show`, `LogisticsItem`, `Artist`, `AnalyticsSummary` defined in `src/types/index.ts`.
- `Repository` interface extended consistently.
- Adapters implement the same extended interface.
