# Euphoric Media (calco) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Euphoric Media module as a pixel-perfect visual calco of the reference web, with 7 views (Resumen, Campañas, Contenido, Piezas, Eventos, Cuentas, Analítica), replacing the current `EuphoricShell` placeholder.

**Architecture:** Follow the existing module pattern (`ConceptOneShell`/`EtraShell`): a shell with `AppLayout` + nested routes, one page component per view under `src/features/euphoric/pages/`, module-specific components under `src/features/euphoric/components/`, and hardcoded seed data under `src/features/euphoric/data/`. All interactivity (forms, toggles, filters, segmented controls) is presentational local state — nothing persists. The shared `TopNav` gains one additive optional `iconAction` slot for the Analítica chart icon.

**Tech Stack:** React 18 + TypeScript, react-router, TailwindCSS, Vitest + Testing Library, lucide-react icons, Vite. Playwright (MCP) for pixel verification against the live reference.

**Spec:** `docs/superpowers/specs/2026-07-09-euphoric-media-calco-design.md` (read it — it holds the per-view pixel detail and exact seed values).

## Global Constraints

- **Presentational only.** No repository mutations, no persistence. `Guardar`, `+ Nueva …`, filters, toggles, segmented controls mutate local React state only. Never create/edit/read-mutate real data.
- **Header unchanged** except the additive optional `iconAction` slot on `ModuleHeader`/`TopNav`. Other modules pass no `iconAction`; their header must render identically to today.
- **Seed data is provisional** (replaced when the Supabase SQL arrives). Real names (`SIGHT`, `Genérico Julio`, `Set Times`, `Black Moose`, artists) are kept verbatim — no brand neutralization in this phase.
- **Reuse before create.** Use existing `src/components/ui` primitives (`Card`, `StatCard`, `Badge`, `SegmentedControl`, `MonthCalendar`, `MasterDetailList`, `Select`, `Input`, `Textarea`, `Button`, `Modal`) before writing new ones. Exact signatures are in each task's Interfaces block.
- **Design tokens** (`.stitch/DESIGN.md`): page bg `slate-50`; cards `bg-white border-slate-100 rounded-xl shadow-sm`; brand `brand-600` (`#7C3AED`); section labels `text-xs font-semibold uppercase tracking-wide text-slate-400`; container `max-w-[1248px]`.
- **Pixel calco source of truth:** the live web `https://bookings.conceptoneagency.com/euphoric` (read-only) + the 11 captures in `/Users/arian/Desktop/Euphoric_Media/`. Every page task ends with a Playwright comparison step; tune spacing/color/typography until it matches. Do not click destructive/save controls on the live site.

### Reusable component signatures (verbatim)

```ts
// StatCard: { label: string; value: string; change?; caption?: string; valueClassName?: string }
// Badge:   variant?: 'info'|'success'|'warning'|'danger'|'neutral'|'blue'|'amber'|'fuchsia'|'emerald'|'sky'|'pink'; size?: 'sm'|'md'
// Button:  variant?: 'primary'|'secondary'|'ghost'|'danger'; size?: 'sm'|'md'|'lg'
// SegmentedControl<T extends string>: { options: {label:string; value:T}[]; value:T; onChange:(v:T)=>void; fullWidth?; className? }
// MasterDetailList<T extends {id:string}>: { items; renderRow:(item,isSelected)=>node; renderDetail:(item)=>node; emptyState?; selectedId?; onSelect?; listTop?; detailOverride? }
// MonthCalendar: { year:number; month:number; monthLabel:string; events:{id;isoDate:'YYYY-MM-DD';label;toneClassName}[]; onPrevMonth?; onNextMonth? }
// Modal: { open:boolean; onClose; title?; children; className? }
// Select/Input/Textarea: native props + label?
```

---

## File Structure

```
src/features/euphoric/
  data/types.ts            # UI types for the module
  data/seed.ts             # hardcoded seed matching the reference
  pages/ResumenPage.tsx
  pages/CampanasPage.tsx
  pages/ContenidoPage.tsx
  pages/PiezasPage.tsx
  pages/EventosPage.tsx
  pages/CuentasPage.tsx
  pages/AnaliticaPage.tsx
  components/StatusChip.tsx        # shared status/priority pill helper
  components/CampaignBoard.tsx
  components/PieceBoard.tsx
  components/PieceDrawer.tsx
  components/EventForm.tsx
  components/AccountForm.tsx
  components/RetainerBarChart.tsx
src/features/modules/EuphoricShell.tsx   # rewrite (placeholder -> real shell)
src/components/layout/TopNav.tsx          # add optional iconAction slot
src/app/router.tsx                        # nested euphoric routes
```

---

### Task 1: Add optional `iconAction` slot to shared `TopNav`

**Files:**
- Modify: `src/components/layout/TopNav.tsx`
- Test: `src/components/layout/TopNav.test.tsx` (create)

**Interfaces:**
- Produces: `ModuleHeader.iconAction?: { icon: LucideIcon; href: string; label: string }`. When present, `TopNav` renders an icon-only `NavLink` immediately before the notifications bell.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/layout/TopNav.test.tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { BarChart2 } from 'lucide-react';
import { TopNav } from './TopNav';
import type { User } from '@/types';

const user: User = { id: '1', email: 't@e.com', name: 'Test', role: 'Admin' };

function renderNav(module?: Parameters<typeof TopNav>[0]['module']) {
  return render(
    <MemoryRouter>
      <TopNav user={user} module={module} />
    </MemoryRouter>
  );
}

test('renders iconAction link when provided', () => {
  renderNav({ name: 'Euphoric Media', iconAction: { icon: BarChart2, href: '/euphoric/analitica', label: 'Analítica' } });
  const link = screen.getByRole('link', { name: 'Analítica' });
  expect(link).toHaveAttribute('href', '/euphoric/analitica');
});

test('omits iconAction link when not provided', () => {
  renderNav({ name: 'ConceptOne' });
  expect(screen.queryByRole('link', { name: 'Analítica' })).toBeNull();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/components/layout/TopNav.test.tsx`
Expected: FAIL (no link named "Analítica").

- [ ] **Step 3: Implement the slot**

In `src/components/layout/TopNav.tsx`:
1. Add import: `import type { LucideIcon } from 'lucide-react';`
2. Extend the interface:

```tsx
export interface ModuleHeader {
  name: string;
  href?: string;
  tabs?: { label: string; href: string }[];
  actionLabel?: string;
  iconAction?: { icon: LucideIcon; href: string; label: string };
}
```

3. In the right-side `<div className="flex items-center gap-4">`, immediately before the notifications `<button>`, add:

```tsx
{module?.iconAction && (
  <NavLink
    to={module.iconAction.href}
    aria-label={module.iconAction.label}
    className={({ isActive }) =>
      cn(
        'grid h-9 w-9 place-items-center rounded-lg transition-colors',
        isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-500 hover:bg-slate-100'
      )
    }
  >
    <module.iconAction.icon className="h-5 w-5" />
  </NavLink>
)}
```

Also make the "Resumen" tab active-matching generic: in the existing `NavLink` for tabs, change `end={tab.href === '/conceptone' || tab.href === module.href}` to `end={tab.href === module.href || tab.href === '/euphoric'}` — or better, pass the index href through `module.href`. Set `module.href = '/euphoric'` in the shell (Task 2) and use `end={tab.href === module.href}`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/components/layout/TopNav.test.tsx`
Expected: PASS (both tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/TopNav.tsx src/components/layout/TopNav.test.tsx
git commit -m "feat: add optional iconAction slot to TopNav"
```

---

### Task 2: Rewrite `EuphoricShell` + nested routes + page stubs

**Files:**
- Modify: `src/features/modules/EuphoricShell.tsx` (rewrite)
- Modify: `src/app/router.tsx`
- Create: `src/features/euphoric/pages/{Resumen,Campanas,Contenido,Piezas,Eventos,Cuentas,Analitica}Page.tsx` (stubs)
- Test: `src/features/euphoric/EuphoricShell.test.tsx` (create)

**Interfaces:**
- Consumes: `ModuleHeader.iconAction` (Task 1).
- Produces: page components exported as `ResumenPage`, `CampanasPage`, `ContenidoPage`, `PiezasPage`, `EventosPage`, `CuentasPage`, `AnaliticaPage`. Shell renders `AppLayout` + `<Outlet/>`.

- [ ] **Step 1: Create stub pages** — one per view, e.g.:

```tsx
// src/features/euphoric/pages/ResumenPage.tsx
export function ResumenPage() {
  return <div>Resumen</div>;
}
```

Repeat for `CampanasPage`, `ContenidoPage`, `PiezasPage`, `EventosPage`, `CuentasPage`, `AnaliticaPage` (each returns its label text). These get fleshed out in later tasks.

- [ ] **Step 2: Rewrite the shell**

```tsx
// src/features/modules/EuphoricShell.tsx
import { Outlet } from 'react-router';
import { BarChart2 } from 'lucide-react';
import { AppLayout } from '@/components/layout';
import type { User } from '@/types';

const mockUser: User = { id: '1', email: 'test@example.com', name: 'Test User', role: 'Admin' };

const tabs = [
  { label: 'Resumen', href: '/euphoric' },
  { label: 'Campañas', href: '/euphoric/campanas' },
  { label: 'Contenido', href: '/euphoric/calendario' },
  { label: 'Piezas', href: '/euphoric/piezas' },
  { label: 'Eventos', href: '/euphoric/eventos' },
  { label: 'Cuentas', href: '/euphoric/cuentas' },
];

export function EuphoricShell() {
  return (
    <AppLayout
      user={mockUser}
      module={{
        name: 'Euphoric Media',
        href: '/euphoric',
        tabs,
        iconAction: { icon: BarChart2, href: '/euphoric/analitica', label: 'Analítica' },
      }}
    >
      <Outlet />
    </AppLayout>
  );
}
```

- [ ] **Step 3: Wire nested routes** — in `src/app/router.tsx` replace `<Route path="/euphoric" element={<EuphoricShell />} />` with the nested block and add the page imports:

```tsx
import { ResumenPage } from '@/features/euphoric/pages/ResumenPage';
import { CampanasPage } from '@/features/euphoric/pages/CampanasPage';
import { ContenidoPage } from '@/features/euphoric/pages/ContenidoPage';
import { PiezasPage } from '@/features/euphoric/pages/PiezasPage';
import { EventosPage } from '@/features/euphoric/pages/EventosPage';
import { CuentasPage } from '@/features/euphoric/pages/CuentasPage';
import { AnaliticaPage } from '@/features/euphoric/pages/AnaliticaPage';
// ...
<Route path="/euphoric" element={<EuphoricShell />}>
  <Route index element={<ResumenPage />} />
  <Route path="campanas" element={<CampanasPage />} />
  <Route path="calendario" element={<ContenidoPage />} />
  <Route path="piezas" element={<PiezasPage />} />
  <Route path="eventos" element={<EventosPage />} />
  <Route path="cuentas" element={<CuentasPage />} />
  <Route path="analitica" element={<AnaliticaPage />} />
</Route>
```

- [ ] **Step 4: Write the failing test**

```tsx
// src/features/euphoric/EuphoricShell.test.tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { EuphoricShell } from '@/features/modules/EuphoricShell';
import { ResumenPage } from './pages/ResumenPage';

test('renders module tabs and Analítica icon', () => {
  render(
    <MemoryRouter initialEntries={['/euphoric']}>
      <Routes>
        <Route path="/euphoric" element={<EuphoricShell />}>
          <Route index element={<ResumenPage />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
  expect(screen.getByRole('link', { name: 'Campañas' })).toHaveAttribute('href', '/euphoric/campanas');
  expect(screen.getByRole('link', { name: 'Contenido' })).toHaveAttribute('href', '/euphoric/calendario');
  expect(screen.getByRole('link', { name: 'Analítica' })).toHaveAttribute('href', '/euphoric/analitica');
});
```

- [ ] **Step 5: Run tests + typecheck**

Run: `npm test -- src/features/euphoric/EuphoricShell.test.tsx` → PASS
Run: `npm run build` → no TS errors.

- [ ] **Step 6: Commit**

```bash
git add src/features/modules/EuphoricShell.tsx src/app/router.tsx src/features/euphoric/pages src/features/euphoric/EuphoricShell.test.tsx
git commit -m "feat: real EuphoricShell with nested routes and page stubs"
```

---

### Task 3: Seed data + types

**Files:**
- Create: `src/features/euphoric/data/types.ts`
- Create: `src/features/euphoric/data/seed.ts`
- Test: `src/features/euphoric/data/seed.test.ts` (create)

**Interfaces:**
- Produces: types `Account, Campaign, Piece, EventItem, Publication` and const arrays `accounts, campaigns, pieces, events, publications`, plus `analytics` summary object. Later pages import these.

- [ ] **Step 1: Types**

```ts
// src/features/euphoric/data/types.ts
export type CampaignStatus = 'planificada' | 'en-curso' | 'pausada' | 'finalizada' | 'cancelada';
export type PieceStatus = 'briefing' | 'en-produccion' | 'revision' | 'cambios' | 'aprobado';
export type PiecePriority = 'baja' | 'media' | 'alta';
export type EventKind = 'marketing' | 'produccion';

export interface Account {
  id: string; name: string; kind: string; services: string[];
  status: 'Activa' | 'Pausada' | 'Inactiva'; retainer: number;
}
export interface Campaign {
  id: string; name: string; account: string; type: string;
  startLabel: string; endLabel: string; status: CampaignStatus; owner: string; budget: number; spent: number;
}
export interface Piece {
  id: string; title: string; client: string; type: string; priority: PiecePriority;
  deadlineLabel: string; status: PieceStatus; owner: string;
  clientApproval: string; checklistDone: number; checklistTotal: number;
}
export interface EventItem {
  id: string; name: string; dateLabel: string; isoDate: string; city: string;
  kind: EventKind; euphoricCount?: number;
}
export interface Publication {
  id: string; name: string; dateLabel: string; isoDate: string; channel: string;
  account: string; status: string; type: string; eventName?: string;
}
```

- [ ] **Step 2: Seed** (values verbatim from spec §4)

```ts
// src/features/euphoric/data/seed.ts
import type { Account, Campaign, Piece, EventItem, Publication } from './types';

export const accounts: Account[] = [
  { id: 'acc-sight', name: 'SIGHT', kind: 'Cliente', services: ['Redes sociales', 'Paid media', 'Contenido'], status: 'Activa', retainer: 800 },
];

export const campaigns: Campaign[] = [
  { id: 'cmp-generico-julio', name: 'Genérico Julio', account: 'SIGHT', type: 'Paid media', startLabel: '10 jul 2026', endLabel: '31 ago 2026', status: 'en-curso', owner: 'Sin asignar', budget: 600, spent: 0 },
];

export const pieces: Piece[] = [
  { id: 'pz-1', title: 'Pack Sold Out · Pack Sold Out', client: 'SIGHT', type: 'Estático', priority: 'media', deadlineLabel: '10 jul 2026', status: 'revision', owner: 'Carlos', clientApproval: '—', checklistDone: 0, checklistTotal: 3 },
  { id: 'pz-2', title: 'Pack Sold Out · Pack Sold Out', client: 'SIGHT', type: 'Vídeo', priority: 'media', deadlineLabel: '10 jul 2026', status: 'briefing', owner: 'Carlos', clientApproval: '—', checklistDone: 0, checklistTotal: 3 },
  { id: 'pz-3', title: 'Test', client: 'SIGHT', type: 'Estático', priority: 'alta', deadlineLabel: '09 jul 2026', status: 'en-produccion', owner: 'Carlos', clientApproval: '—', checklistDone: 0, checklistTotal: 0 },
];

export const events: EventItem[] = [
  { id: 'ev-oden', name: 'SIGHT: Oden & Fatzo, KOKO b2b Bizza, Jan, Caste', dateLabel: '19 jul 2026', isoDate: '2026-07-19', city: 'Barcelona', kind: 'marketing', euphoricCount: 1 },
  { id: 'ev-quiet', name: 'Please Quiet x SIGHT', dateLabel: '18 jul 2026', isoDate: '2026-07-18', city: 'Barcelona', kind: 'produccion' },
  { id: 'ev-mixmag', name: 'Mixmag Intimate Sessions: BLOND:ISH', dateLabel: '15 jul 2026', isoDate: '2026-07-15', city: 'Ibiza', kind: 'produccion' },
  { id: 'ev-patrick', name: 'SIGHT: Patrick Topping, ACA, Luca 606, Nicholls', dateLabel: '12 jul 2026', isoDate: '2026-07-12', city: 'Barcelona', kind: 'marketing', euphoricCount: 3 },
];

export const publications: Publication[] = [
  { id: 'pub-settimes', name: 'Set Times', dateLabel: '10 jul 2026', isoDate: '2026-07-10', channel: 'Instagram', account: 'SIGHT', status: 'En producción', type: 'Post', eventName: 'SIGHT: Patrick Topping, ACA, Luca 606, Nicholls' },
];

export const analytics = {
  mrr: 800,
  activeAccounts: 1,
  totalAccounts: 1,
  campaignBudget: 600,
  campaignSpent: 0,
  contentByStatus: [
    { label: 'Idea', count: 0 }, { label: 'En producción', count: 1 }, { label: 'Revisión', count: 0 },
    { label: 'Aprobado', count: 0 }, { label: 'Programado', count: 0 }, { label: 'Publicado', count: 0 },
  ],
  contentByChannel: [{ label: 'Instagram', count: 1 }],
};
```

- [ ] **Step 3: Failing test**

```ts
// src/features/euphoric/data/seed.test.ts
import { accounts, campaigns, pieces, events, publications, analytics } from './seed';

test('seed matches reference counts', () => {
  expect(accounts).toHaveLength(1);
  expect(campaigns).toHaveLength(1);
  expect(pieces).toHaveLength(3);
  expect(events).toHaveLength(4);
  expect(publications).toHaveLength(1);
  expect(pieces.filter((p) => p.status === 'briefing')).toHaveLength(1);
  expect(analytics.mrr).toBe(800);
});
```

- [ ] **Step 4: Run** → `npm test -- src/features/euphoric/data/seed.test.ts` PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/euphoric/data
git commit -m "feat: euphoric seed data and types"
```

---

### Task 4: `StatusChip` helper + `ResumenPage`

**Files:**
- Create: `src/features/euphoric/components/StatusChip.tsx`
- Modify: `src/features/euphoric/pages/ResumenPage.tsx`
- Test: `src/features/euphoric/pages/ResumenPage.test.tsx` (create)

**Interfaces:**
- Produces: `StatusChip({ status }: { status: string })` mapping labels → `Badge` variant. Map: `En curso`/`En producción`→`info`; `Activa`→`success`; `Pausada`→`warning`; `Cancelada`→`danger`; default `neutral`.

- [ ] **Step 1: StatusChip**

```tsx
// src/features/euphoric/components/StatusChip.tsx
import { Badge } from '@/components/ui';
import type { BadgeProps } from '@/components/ui/Badge';

const MAP: Record<string, BadgeProps['variant']> = {
  'En curso': 'info', 'En producción': 'info', 'Activa': 'success',
  'Pausada': 'warning', 'Finalizada': 'success', 'Cancelada': 'danger', 'Planificada': 'neutral',
};

export function StatusChip({ status }: { status: string }) {
  return <Badge variant={MAP[status] ?? 'neutral'}>{status}</Badge>;
}
```

- [ ] **Step 2: Build ResumenPage** — layout per spec §5.1. Skeleton (tune classes against live web in Step 5):

```tsx
// src/features/euphoric/pages/ResumenPage.tsx
import { Link } from 'react-router';
import { StatCard, Card } from '@/components/ui';
import { StatusChip } from '../components/StatusChip';
import { accounts, campaigns, publications } from '../data/seed';

export function ResumenPage() {
  const cmp = campaigns[0];
  const pub = publications[0];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Euphoric Media</h1>
        <p className="text-slate-500">Marketing del grupo: cuentas, campañas y calendario de contenido.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link to="/euphoric/cuentas"><StatCard label="Cuentas activas" value={`${accounts.length}`} caption="de 1" /></Link>
        <StatCard label="Campañas en curso" value="1" />
        <StatCard label="Publicaciones (7 días)" value="1" />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Campañas en curso</p>
          <Link to="/euphoric/campanas" className="mt-3 flex items-center justify-between rounded-lg border border-slate-100 p-3">
            <div>
              <p className="font-medium text-slate-900">{cmp.name}</p>
              <p className="text-sm text-slate-500">{cmp.account} · hasta {cmp.endLabel}</p>
            </div>
            <StatusChip status="En curso" />
          </Link>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Próximas publicaciones</p>
          <Link to="/euphoric/calendario" className="mt-3 flex items-center justify-between rounded-lg border border-slate-100 p-3">
            <div>
              <p className="font-medium text-slate-900">{pub.name}</p>
              <p className="text-sm text-slate-500">{pub.dateLabel} · {pub.channel} · {pub.account}</p>
            </div>
            <StatusChip status="En producción" />
          </Link>
        </Card>
      </div>
      <p className="text-sm text-slate-400">Campañas y calendario de contenido se gestionan en las siguientes fases del espacio.</p>
    </div>
  );
}
```

- [ ] **Step 3: Failing test**

```tsx
// src/features/euphoric/pages/ResumenPage.test.tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ResumenPage } from './ResumenPage';

test('renders KPIs and reference panels', () => {
  render(<MemoryRouter><ResumenPage /></MemoryRouter>);
  expect(screen.getByRole('heading', { name: 'Euphoric Media' })).toBeInTheDocument();
  expect(screen.getByText('Cuentas activas')).toBeInTheDocument();
  expect(screen.getByText('Genérico Julio')).toBeInTheDocument();
  expect(screen.getByText('Set Times')).toBeInTheDocument();
});
```

- [ ] **Step 4: Run** → PASS.

- [ ] **Step 5: Pixel verification** — Start dev server (`npm run dev`), navigate Playwright to `http://localhost:5173/euphoric` at 1440px, compare against live `https://bookings.conceptoneagency.com/euphoric` and capture `.../16.01.20.png`. Adjust spacing/typography/badge tones until matched.

- [ ] **Step 6: Commit**

```bash
git add src/features/euphoric/components/StatusChip.tsx src/features/euphoric/pages/ResumenPage.tsx src/features/euphoric/pages/ResumenPage.test.tsx
git commit -m "feat: Euphoric Resumen page calco"
```

---

### Task 5: `CampanasPage` + `CampaignBoard`

**Files:**
- Create: `src/features/euphoric/components/CampaignBoard.tsx`
- Modify: `src/features/euphoric/pages/CampanasPage.tsx`
- Test: `src/features/euphoric/pages/CampanasPage.test.tsx` (create)

**Interfaces:**
- Consumes: `campaigns` seed, `SegmentedControl`, `StatusChip`, `Card`, `Button`.
- Produces: `CampaignBoard({ campaigns }: { campaigns: Campaign[] })` — 5 status columns with header count chips and cards.

- [ ] **Step 1: Build CampaignBoard** — 5 columns `Planificada/En curso/Pausada/Finalizada/Cancelada` with count chips (colors: neutral/blue/amber/emerald/danger). Column with matching campaigns renders a card (`Sin asignar` / name / `account · type` / `start → end`); empty columns render a centered `—`.

- [ ] **Step 2: Build CampanasPage** — per spec §5.2: H1 `Campañas` + subtitle; top-right `+ Nueva campaña` (`Button`) + `SegmentedControl` `Tablero|Cronograma|Gestión` (local state, default `tablero`). `tablero` view → `CampaignBoard` + table (`CAMPAÑA·CUENTA·TIPO·FECHAS·ESTADO`). `cronograma`/`gestion` views → placeholder now; calco from live web during this task (navigate Playwright to `/euphoric/campanas`, switch the segmented control, replicate).

- [ ] **Step 3: Failing test**

```tsx
// src/features/euphoric/pages/CampanasPage.test.tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { CampanasPage } from './CampanasPage';

test('shows board columns and the campaign row', () => {
  render(<MemoryRouter><CampanasPage /></MemoryRouter>);
  expect(screen.getByRole('heading', { name: 'Campañas' })).toBeInTheDocument();
  expect(screen.getByText('Planificada')).toBeInTheDocument();
  expect(screen.getAllByText('Genérico Julio').length).toBeGreaterThan(0);
  expect(screen.getByText('Paid media')).toBeInTheDocument();
});
```

- [ ] **Step 4: Run** → PASS.

- [ ] **Step 5: Pixel verification** — compare `/euphoric/campanas` (Tablero, Cronograma, Gestión) against live web + capture `16.01.28.png`.

- [ ] **Step 6: Commit**

```bash
git add src/features/euphoric/components/CampaignBoard.tsx src/features/euphoric/pages/CampanasPage.tsx src/features/euphoric/pages/CampanasPage.test.tsx
git commit -m "feat: Euphoric Campañas page calco"
```

---

### Task 6: `ContenidoPage` (calendar)

**Files:**
- Modify: `src/features/euphoric/pages/ContenidoPage.tsx`
- Test: `src/features/euphoric/pages/ContenidoPage.test.tsx` (create)

**Interfaces:**
- Consumes: `MonthCalendar`, `SegmentedControl`, `Select`, `publications`, `events` seed.

- [ ] **Step 1: Build ContenidoPage** — per spec §5.3. H1 `Contenido` + subtitle; top-right `Select` `Todos los canales`; filter chips `Todas`(active)/`SIGHT`; `SegmentedControl` `Calendario|Lista|Kanban` (local state default `calendario`); month bar `← Julio 2026 →`, `● Eventos` toggle + `Hoy`. Build `MonthCalendarEvent[]` from `publications` (Set Times, day 10, blue tone) + `events` (days 12/15/18/19, red tone `bg-red-50 text-red-600`). Use `year={2026} month={6} monthLabel="Julio 2026"`. `Lista`/`Kanban` views calco from live web in this task.

> Note: the reference shows the Set Times detail popover on day 9 (today). If `MonthCalendar` can't render a rich popover, render the pill on its real date (10) and match visual; capture live behavior and replicate as closely as the primitive allows. Extend `MonthCalendar` only if needed and cheap.

- [ ] **Step 2: Failing test**

```tsx
// src/features/euphoric/pages/ContenidoPage.test.tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ContenidoPage } from './ContenidoPage';

test('renders month calendar with content controls', () => {
  render(<MemoryRouter><ContenidoPage /></MemoryRouter>);
  expect(screen.getByRole('heading', { name: 'Contenido' })).toBeInTheDocument();
  expect(screen.getByText('Julio 2026')).toBeInTheDocument();
  expect(screen.getByText('Todas')).toBeInTheDocument();
});
```

- [ ] **Step 3: Run** → PASS.

- [ ] **Step 4: Pixel verification** — compare `/euphoric/calendario` (Calendario/Lista/Kanban) against live web + capture `16.01.43.png`.

- [ ] **Step 5: Commit**

```bash
git add src/features/euphoric/pages/ContenidoPage.tsx src/features/euphoric/pages/ContenidoPage.test.tsx
git commit -m "feat: Euphoric Contenido calendar page calco"
```

---

### Task 7: `PiezasPage` + `PieceBoard`

**Files:**
- Create: `src/features/euphoric/components/PieceBoard.tsx`
- Modify: `src/features/euphoric/pages/PiezasPage.tsx`
- Test: `src/features/euphoric/pages/PiezasPage.test.tsx` (create)

**Interfaces:**
- Consumes: `pieces` seed, `StatCard`, `Badge`, `SegmentedControl`/chips, `Button`, `Avatar`.
- Produces: `PieceBoard({ pieces }: { pieces: Piece[] })` — 5 status columns (`Briefing/En producción/Revisión/Cambios/Aprobado`) with count headers and piece cards (avatar+owner, title, `client · type · v1`, priority chip, 📅 deadline, ✓ checklist `n/total`).

- [ ] **Step 1: PieceBoard** — columns keyed by `PieceStatus`, header count chips; card layout per spec §5.4.

- [ ] **Step 2: PiezasPage** — per spec §5.4: H1 + subtitle; top-right `Asignar a: [+ Alba] [+ Carlos]` (outline chips) + `+ Nueva pieza` (`Button`, opens drawer in Task 8 — for now toggles local `drawerOpen` state); 4 `StatCard`s (`3 Piezas activas`, `1 Pend. aprobar` amber, `0 En correcciones` red, `0 Atrasadas` red — use `valueClassName`); filter chips row `Todas`(active)/`Mías`/`Diseño`/`Vídeo`/`Pend. aprobar`/`Correcciones`/`Atrasadas` + right `Recursos: — Editar`; `PieceBoard`; table `PIEZA·CLIENTE·TIPO·PRIORIDAD·DEADLINE·ESTADO·CLIENTE APROB.` with the 3 rows (`v1` suffix in slate on the name).

- [ ] **Step 3: Failing test**

```tsx
// src/features/euphoric/pages/PiezasPage.test.tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { PiezasPage } from './PiezasPage';

test('renders KPIs, board and table', () => {
  render(<MemoryRouter><PiezasPage /></MemoryRouter>);
  expect(screen.getByRole('heading', { name: 'Piezas' })).toBeInTheDocument();
  expect(screen.getByText('Piezas activas')).toBeInTheDocument();
  expect(screen.getByText('Briefing')).toBeInTheDocument();
  expect(screen.getAllByText(/Pack Sold Out/).length).toBeGreaterThan(0);
});
```

- [ ] **Step 4: Run** → PASS.

- [ ] **Step 5: Pixel verification** — compare `/euphoric/piezas` against live web + capture `16.01.52.png`.

- [ ] **Step 6: Commit**

```bash
git add src/features/euphoric/components/PieceBoard.tsx src/features/euphoric/pages/PiezasPage.tsx src/features/euphoric/pages/PiezasPage.test.tsx
git commit -m "feat: Euphoric Piezas page calco"
```

---

### Task 8: `PieceDrawer` (Nueva pieza slide-over)

**Files:**
- Create: `src/features/euphoric/components/PieceDrawer.tsx`
- Modify: `src/features/euphoric/pages/PiezasPage.tsx` (wire `drawerOpen`)
- Test: `src/features/euphoric/components/PieceDrawer.test.tsx` (create)

**Interfaces:**
- Consumes: `Input`, `Select`, `Textarea`, `Button`, `SegmentedControl`.
- Produces: `PieceDrawer({ open, onClose }: { open: boolean; onClose: () => void })` — right slide-over (~640px, dim backdrop), all fields from spec §6.1, footer `Cerrar`/`Guardar`. `Guardar` and `Cerrar` both call `onClose`; no persistence.

- [ ] **Step 1: Build PieceDrawer** — fixed right panel, `open` controls visibility, backdrop click → `onClose`. Fields in order (spec §6.1): Nombre, Responsable/Aprueba add-chips, Tipo/Departamento/Estado/Versión selects, Prioridad segmented (`Baja|Media|Alta`, default `media`, local state), Deadline date, Tamaños/ratios toggle chips (local state Set), Adaptaciones panel + `+ Añadir adaptación`, ¿Para quién? 3 cols, Evento input, Campaña/Publicación selects, Brief toolbar (visual) + textarea, Enlace al asset input, Adjuntos `+ Adjuntar`, Aprobación cliente chips (local state, default `Sin enviar`), Checklist `+ Añadir tarea`, Notas textarea. Sticky footer.

- [ ] **Step 2: Wire into PiezasPage** — `const [drawerOpen, setDrawerOpen] = useState(false)`; `+ Nueva pieza` → `setDrawerOpen(true)`; render `<PieceDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />`.

- [ ] **Step 3: Failing test**

```tsx
// src/features/euphoric/components/PieceDrawer.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PieceDrawer } from './PieceDrawer';

test('shows fields when open and closes on Cerrar', async () => {
  const onClose = vi.fn();
  render(<PieceDrawer open onClose={onClose} />);
  expect(screen.getByText('Nueva pieza')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Ej: Reel lanzamiento v2')).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: 'Cerrar' }));
  expect(onClose).toHaveBeenCalled();
});

test('renders nothing when closed', () => {
  render(<PieceDrawer open={false} onClose={() => {}} />);
  expect(screen.queryByText('Nueva pieza')).toBeNull();
});
```

- [ ] **Step 4: Run** → PASS.

- [ ] **Step 5: Pixel verification** — open drawer, compare against captures `16.02.11.png` + `16.02.18.png` (two scroll positions) and live web.

- [ ] **Step 6: Commit**

```bash
git add src/features/euphoric/components/PieceDrawer.tsx src/features/euphoric/pages/PiezasPage.tsx src/features/euphoric/components/PieceDrawer.test.tsx
git commit -m "feat: Euphoric Nueva pieza drawer calco"
```

---

### Task 9: `EventosPage` + `EventForm`

**Files:**
- Create: `src/features/euphoric/components/EventForm.tsx`
- Modify: `src/features/euphoric/pages/EventosPage.tsx`
- Test: `src/features/euphoric/pages/EventosPage.test.tsx` (create)

**Interfaces:**
- Consumes: `MasterDetailList`, `MonthCalendar`, `SegmentedControl`, `Button`, `Input`, `Textarea`, `events` seed.
- Produces: `EventForm({ onSave }: { onSave?: () => void })` — card form per spec §6.2.

- [ ] **Step 1: EventForm** — fields: Nombre (`Ej: OFF BCN · Ku · 12 jul`), Fecha inicio/Fecha fin (opc.) dates, Ciudad/Venue (CRM), Descripción textarea, checkbox `La produce Black Moose` + helper, `Guardar` (bottom-right). `Guardar` → `onSave?.()`; no persistence.

- [ ] **Step 2: EventosPage** — per spec §5.5. `SegmentedControl` `Lista|Calendario` (default `lista`) + `+ Nuevo evento` (sets local `creating=true`). `lista` → `MasterDetailList` with search `listTop`, rows (name, `date · city · Nº en Euphoric`, `Marketing`/`Producción` badge via `StatusChip`-like), empty state `Selecciona un evento o crea uno nuevo.`; when `creating`, pass `detailOverride={<EventForm onSave={...} />}`. `calendario` → big `MonthCalendar` (days 12/15/18/19 pills; marketing violet `bg-brand-50 text-brand-700`, produccion red) + helper `Toca un evento del calendario para editarlo, o «+ Nuevo evento».`

- [ ] **Step 3: Failing test**

```tsx
// src/features/euphoric/pages/EventosPage.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { EventosPage } from './EventosPage';

test('lists events and opens the new-event form', async () => {
  render(<MemoryRouter><EventosPage /></MemoryRouter>);
  expect(screen.getByText('Please Quiet x SIGHT')).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: '+ Nuevo evento' }));
  expect(screen.getByText('La produce Black Moose')).toBeInTheDocument();
});
```

- [ ] **Step 4: Run** → PASS.

- [ ] **Step 5: Pixel verification** — compare `/euphoric/eventos` list + form + calendar against captures `16.02.36.png`, `16.02.43.png`, `16.03.14.png` and live web.

- [ ] **Step 6: Commit**

```bash
git add src/features/euphoric/components/EventForm.tsx src/features/euphoric/pages/EventosPage.tsx src/features/euphoric/pages/EventosPage.test.tsx
git commit -m "feat: Euphoric Eventos page calco"
```

---

### Task 10: `CuentasPage` + `AccountForm`

**Files:**
- Create: `src/features/euphoric/components/AccountForm.tsx`
- Modify: `src/features/euphoric/pages/CuentasPage.tsx`
- Test: `src/features/euphoric/pages/CuentasPage.test.tsx` (create)

**Interfaces:**
- Consumes: `MasterDetailList`, `Button`, `Input`, `Select`, `Textarea`, `Badge`, `accounts` seed.
- Produces: `AccountForm({ onSave }: { onSave?: () => void })` per spec §6.3.

- [ ] **Step 1: AccountForm** — fields: Nombre de la cuenta (`Nombre del cliente o marca`), checkbox `Cuenta interna del grupo (no es cliente externo)`, Cliente en el CRM (`Buscar o crear cliente…`) + helper, Estado select (`Activa`)/Retainer mensual (€) input (`Opcional`), Servicios toggle chips `Redes sociales|Paid media|Contenido`, Responsable/Resp. de aprobar selects (`Sin asignar`) + helper `Se autocompleta en las piezas de esta cuenta.`, Notas textarea, `Guardar`.

- [ ] **Step 2: CuentasPage** — per spec §5.6: H1 + subtitle; `MasterDetailList` with `listTop` = full-width `+ Nueva cuenta` `Button`, rows = account card (`SIGHT` / `Cliente · Redes sociales, Paid media, Contenido` + `Activa` badge success), empty state `Selecciona una cuenta o crea una nueva.`; `+ Nueva cuenta` → `detailOverride={<AccountForm />}`.

- [ ] **Step 3: Failing test**

```tsx
// src/features/euphoric/pages/CuentasPage.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { CuentasPage } from './CuentasPage';

test('lists accounts and opens new-account form', async () => {
  render(<MemoryRouter><CuentasPage /></MemoryRouter>);
  expect(screen.getByText('SIGHT')).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: '+ Nueva cuenta' }));
  expect(screen.getByText('Cuenta interna del grupo (no es cliente externo)')).toBeInTheDocument();
});
```

- [ ] **Step 4: Run** → PASS.

- [ ] **Step 5: Pixel verification** — compare `/euphoric/cuentas` list + form against captures `16.03.23.png`, `16.03.33.png` and live web.

- [ ] **Step 6: Commit**

```bash
git add src/features/euphoric/components/AccountForm.tsx src/features/euphoric/pages/CuentasPage.tsx src/features/euphoric/pages/CuentasPage.test.tsx
git commit -m "feat: Euphoric Cuentas page calco"
```

---

### Task 11: `AnaliticaPage` + `RetainerBarChart`

**Files:**
- Create: `src/features/euphoric/components/RetainerBarChart.tsx`
- Modify: `src/features/euphoric/pages/AnaliticaPage.tsx`
- Test: `src/features/euphoric/pages/AnaliticaPage.test.tsx` (create)

**Interfaces:**
- Consumes: `StatCard`, `Card`, `Badge`, `accounts`, `campaigns`, `analytics` seed.
- Produces: `RetainerBarChart({ data }: { data: { label: string; value: number }[]; max: number })` — inline SVG/flex bar chart.

> Before writing the chart, read the `dataviz` skill for color/axis/label guidance.

- [ ] **Step 1: RetainerBarChart** — Y axis `0,00 €`…`800,00 €` (5 ticks), one bar per account (SIGHT → 800), bar color rose (`#F43F5E`/`fill-rose-500`), dotted horizontal gridlines, category label rotated below. Format euros as `n,00 €`.

- [ ] **Step 2: AnaliticaPage** — per spec §5.7: H1 `Analítica` + subtitle; 4 `StatCard`s (`MRR (retainers activos)` → `800,00 €` with `valueClassName="text-rose-500"`; `Cuentas activas` `1` caption `de 1`; `Presupuesto campañas` `600,00 €`; `Inversión campañas` `0,00 €` caption `0% del presupuesto`); panel `Retainer mensual por cuenta` → `RetainerBarChart`; 2-col grid: left `Por cuenta` table (`CUENTA·ESTADO·RETAINER·CAMPAÑAS·INVERSIÓN·PUBLICACIONES` → SIGHT/Activa/800,00 €/1/—/1), right stacked panels `Contenido por estado` (6 rows from `analytics.contentByStatus`) + `Contenido por canal` (`Instagram 1`).

- [ ] **Step 3: Failing test**

```tsx
// src/features/euphoric/pages/AnaliticaPage.test.tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { AnaliticaPage } from './AnaliticaPage';

test('renders analytics KPIs and tables', () => {
  render(<MemoryRouter><AnaliticaPage /></MemoryRouter>);
  expect(screen.getByRole('heading', { name: 'Analítica' })).toBeInTheDocument();
  expect(screen.getByText('MRR (retainers activos)')).toBeInTheDocument();
  expect(screen.getAllByText('800,00 €').length).toBeGreaterThan(0);
  expect(screen.getByText('Contenido por canal')).toBeInTheDocument();
});
```

- [ ] **Step 4: Run** → PASS.

- [ ] **Step 5: Pixel verification** — compare `/euphoric/analitica` against live web (no capture exists; the live page is the reference).

- [ ] **Step 6: Commit**

```bash
git add src/features/euphoric/components/RetainerBarChart.tsx src/features/euphoric/pages/AnaliticaPage.tsx src/features/euphoric/pages/AnaliticaPage.test.tsx
git commit -m "feat: Euphoric Analítica page calco"
```

---

### Task 12: Full-module verification pass

**Files:** none (verification only; small fixes as needed).

- [ ] **Step 1: Typecheck + full test suite**

Run: `npm run build` → no errors. Run: `npm test` → all green.

- [ ] **Step 2: Cross-view Playwright sweep** — at 1440px, walk all 7 views + drawer + both forms on `http://localhost:5173/euphoric`, side-by-side with the live reference. Verify active tab states, the Analítica icon active state, badge tones, spacing, and typography. File any residual mismatch as a small fix commit.

- [ ] **Step 3: Regression check on other modules** — navigate `/conceptone`, `/etra`, `/produccion`; confirm their header is unchanged (no Analítica icon, no layout shift).

- [ ] **Step 4: Final commit (if fixes were made)**

```bash
git add -A
git commit -m "fix: pixel-perfect polish across Euphoric views"
```

---

## Self-Review Notes

- **Spec coverage:** §1 routes→Task 2; §3 header slot→Task 1; §4 seed→Task 3; §5.1→Task 4; §5.2→Task 5; §5.3→Task 6; §5.4→Task 7; §6.1 drawer→Task 8; §5.5/§6.2→Task 9; §5.6/§6.3→Task 10; §5.7→Task 11; §8 verification→each page task + Task 12.
- **Alternate views** (Campañas Cronograma/Gestión, Contenido Lista/Kanban) are explicitly calqued from the live web within Tasks 5 and 6 (per user decision).
- **Type consistency:** `PieceStatus`/`CampaignStatus`/`PiecePriority` defined in Task 3 are reused verbatim in Tasks 5/7/8/11. `StatusChip` (Task 4) is reused by Resumen/Campañas/Eventos.
- **Presentational constraint** honored: every form's `Guardar`/`Cerrar` only toggles local state.
