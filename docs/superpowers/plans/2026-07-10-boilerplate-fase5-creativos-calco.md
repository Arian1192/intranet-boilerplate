# Fase 5 — Creativos (calco pixel-perfect) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir la vista real `/creativos` (tablero de piezas del equipo de diseño) calcándola pixel-perfect contra el live, reemplazando el stub actual.

**Architecture:** Módulo self-contained bajo `src/features/creativos/`, siguiendo el patrón del módulo más reciente (cruda): un **shell real** (`AppLayout` + `module` tabs + `<Outlet/>`) y una **página** que importa datos mock de un **`data/seed.ts` local** (no el `MockRepository`). Componentes presentacionales aislados (stat card, filtros, tarjeta, kanban, tabla) + helpers puros para filtrar/agrupar/derivar stats. El filtro activo vive en la página y alimenta tanto el kanban como la tabla.

**Tech Stack:** React 19, react-router 7, Tailwind 3, lucide-react, Vitest + Testing Library.

## Global Constraints

- **Todo presentacional, sin persistencia:** mock estático; nada crea/edita/borra; `+ Nueva pieza`, chips `Asignar a`, tarjetas y `Recursos: Editar` son **inertes**. Los **filtros SÍ funcionan** (filtrado en cliente).
- **Marca:** mantener el brand violeta de nuestra app (`Button variant="primary"` y pill de filtro activa `bg-brand-600`); NO adoptar el gris del live. Resto de colores = tokens semánticos exactos medidos.
- **Primitivos:** usar componentes `Card`/`Button`/`Badge` existentes. `Card` por defecto es `border-slate-100`; donde el live usa borde más marcado, override a `border-slate-200`.
- Repo enforcea `npm run lint --max-warnings 0`, `npx tsc --noEmit`, y `npm test` deben quedar en verde.
- Referencias visuales: `docs/references/creativos/` (viewport 1440×900, deviceScaleFactor 2).
- Tokens de color medidos (RGB de referencia): amber-600 `#D97706`, rose-600 `#E11D48`, sky-700 `#0369A1`, amber-700 `#B45309`, rose-700 `#BE123C`, emerald-700 `#047857`, slate-600 `#475569`, slate-400 `#94A3B8`.

---

### Task 1: Variante `rose` en `Badge`

**Files:**
- Modify: `src/components/ui/Badge.tsx`
- Test: `src/components/ui/Badge.test.tsx`

**Interfaces:**
- Produces: `Badge` acepta `variant="rose"` → `bg-rose-100 text-rose-700`. Se usará para estado `Cambios` y prioridad `Alta`.

- [ ] **Step 1: Añadir el caso de test (debe fallar)**

En `src/components/ui/Badge.test.tsx`, añadir dentro del `describe` existente:

```tsx
it('renders the rose variant', () => {
  render(<Badge variant="rose">Cambios</Badge>);
  expect(screen.getByText('Cambios')).toHaveClass('bg-rose-100', 'text-rose-700');
});
```

- [ ] **Step 2: Ejecutar y ver fallar**

Run: `npx vitest run src/components/ui/Badge.test.tsx`
Expected: FAIL — `rose` no es un variant válido (TS) / no aplica las clases.

- [ ] **Step 3: Implementar**

En `src/components/ui/Badge.tsx`: (a) añadir `'rose'` a la unión `variant?:`; (b) añadir la línea al mapa de clases, junto a las demás:

```tsx
'bg-rose-100 text-rose-700': variant === 'rose',
```

- [ ] **Step 4: Ejecutar y ver pasar**

Run: `npx vitest run src/components/ui/Badge.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/Badge.tsx src/components/ui/Badge.test.tsx
git commit -m "feat(ui): Badge rose variant for Creativos states"
```

---

### Task 2: Datos mock + helpers puros

**Files:**
- Create: `src/features/creativos/data/seed.ts`
- Create: `src/features/creativos/data/creativos.ts` (helpers puros + metadatos)
- Test: `src/features/creativos/data/creativos.test.ts`

**Interfaces:**
- Produces (desde `./seed`): tipos `PieceStatus`, `PiecePriority`, `PieceType`, `CreativePiece`; const `pieces: CreativePiece[]`; const `CURRENT_USER = 'Carlos'`.
- Produces (desde `./creativos`):
  - type `CreativosFilter = 'Todas' | 'Mías' | 'Diseño' | 'Vídeo' | 'Pend. aprobar' | 'Correcciones' | 'Atrasadas'`; const `FILTERS: CreativosFilter[]`.
  - const `STATUS_COLUMNS: PieceStatus[]` (orden del kanban).
  - const `STATUS_VARIANT: Record<PieceStatus, BadgeProps['variant']>` y `PRIORITY_VARIANT: Record<PiecePriority, BadgeProps['variant']>`.
  - `filterPieces(pieces: CreativePiece[], filter: CreativosFilter, currentUser: string): CreativePiece[]`.
  - `groupByStatus(pieces: CreativePiece[]): Record<PieceStatus, CreativePiece[]>`.
  - `deriveStats(pieces: CreativePiece[]): { activas: number; pendAprobar: number; correcciones: number; atrasadas: number }`.

- [ ] **Step 1: Escribir el seed**

Crear `src/features/creativos/data/seed.ts`:

```ts
export type PieceStatus = 'Briefing' | 'En producción' | 'Revisión' | 'Cambios' | 'Aprobado';
export type PiecePriority = 'Alta' | 'Media' | 'Baja';
export type PieceType = 'Estático' | 'Vídeo' | 'Animado';

export interface CreativePiece {
  id: string;
  assignee: string;
  title: string;
  client: string;
  type: PieceType;
  version: string;
  priority: PiecePriority;
  deadline: string;
  status: PieceStatus;
  checklist?: { done: number; total: number };
  clientApproval?: string;
  isOverdue?: boolean;
}

export const CURRENT_USER = 'Carlos';

export const pieces: CreativePiece[] = [
  {
    id: 'p1', assignee: 'Carlos', title: 'Pack Sold Out · Pack Sold Out',
    client: 'SIGHT', type: 'Vídeo', version: 'v1', priority: 'Media',
    deadline: '10 jul 2026', status: 'Briefing', checklist: { done: 2, total: 3 },
  },
  {
    id: 'p2', assignee: 'Carlos', title: 'Pack Sold Out · Pack Sold Out',
    client: 'SIGHT', type: 'Estático', version: 'v1', priority: 'Media',
    deadline: '10 jul 2026', status: 'En producción', checklist: { done: 0, total: 3 },
  },
  {
    id: 'p3', assignee: 'Carlos', title: 'Test',
    client: 'SIGHT', type: 'Estático', version: 'v1', priority: 'Alta',
    deadline: '09 jul 2026', status: 'Revisión', isOverdue: true,
  },
];
```

- [ ] **Step 2: Escribir los tests de helpers (deben fallar)**

Crear `src/features/creativos/data/creativos.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { pieces, CURRENT_USER } from './seed';
import { filterPieces, groupByStatus, deriveStats, STATUS_COLUMNS, FILTERS } from './creativos';

describe('creativos helpers', () => {
  it('exposes the 7 filters and 5 status columns in order', () => {
    expect(FILTERS).toEqual(['Todas', 'Mías', 'Diseño', 'Vídeo', 'Pend. aprobar', 'Correcciones', 'Atrasadas']);
    expect(STATUS_COLUMNS).toEqual(['Briefing', 'En producción', 'Revisión', 'Cambios', 'Aprobado']);
  });

  it('filterPieces: Todas returns all; Vídeo keeps only video; Diseño excludes video', () => {
    expect(filterPieces(pieces, 'Todas', CURRENT_USER)).toHaveLength(3);
    expect(filterPieces(pieces, 'Vídeo', CURRENT_USER).map((p) => p.id)).toEqual(['p1']);
    expect(filterPieces(pieces, 'Diseño', CURRENT_USER).map((p) => p.id)).toEqual(['p2', 'p3']);
  });

  it('filterPieces: Atrasadas keeps overdue; Pend. aprobar keeps Revisión; Correcciones keeps Cambios', () => {
    expect(filterPieces(pieces, 'Atrasadas', CURRENT_USER).map((p) => p.id)).toEqual(['p3']);
    expect(filterPieces(pieces, 'Pend. aprobar', CURRENT_USER).map((p) => p.id)).toEqual(['p3']);
    expect(filterPieces(pieces, 'Correcciones', CURRENT_USER)).toHaveLength(0);
  });

  it('groupByStatus buckets pieces into every column', () => {
    const g = groupByStatus(pieces);
    expect(g['Briefing'].map((p) => p.id)).toEqual(['p1']);
    expect(g['En producción'].map((p) => p.id)).toEqual(['p2']);
    expect(g['Revisión'].map((p) => p.id)).toEqual(['p3']);
    expect(g['Cambios']).toEqual([]);
    expect(g['Aprobado']).toEqual([]);
  });

  it('deriveStats matches the live counts', () => {
    expect(deriveStats(pieces)).toEqual({ activas: 3, pendAprobar: 1, correcciones: 0, atrasadas: 1 });
  });
});
```

- [ ] **Step 3: Ejecutar y ver fallar**

Run: `npx vitest run src/features/creativos/data/creativos.test.ts`
Expected: FAIL — `./creativos` no existe.

- [ ] **Step 4: Implementar los helpers**

Crear `src/features/creativos/data/creativos.ts`:

```ts
import type { BadgeProps } from '@/components/ui';
import type { CreativePiece, PiecePriority, PieceStatus } from './seed';

export type CreativosFilter =
  | 'Todas' | 'Mías' | 'Diseño' | 'Vídeo' | 'Pend. aprobar' | 'Correcciones' | 'Atrasadas';

export const FILTERS: CreativosFilter[] = [
  'Todas', 'Mías', 'Diseño', 'Vídeo', 'Pend. aprobar', 'Correcciones', 'Atrasadas',
];

export const STATUS_COLUMNS: PieceStatus[] = [
  'Briefing', 'En producción', 'Revisión', 'Cambios', 'Aprobado',
];

export const STATUS_VARIANT: Record<PieceStatus, BadgeProps['variant']> = {
  'Briefing': 'neutral',
  'En producción': 'sky',
  'Revisión': 'amber',
  'Cambios': 'rose',
  'Aprobado': 'emerald',
};

export const PRIORITY_VARIANT: Record<PiecePriority, BadgeProps['variant']> = {
  'Alta': 'rose',
  'Media': 'amber',
  'Baja': 'neutral',
};

export function filterPieces(
  list: CreativePiece[],
  filter: CreativosFilter,
  currentUser: string,
): CreativePiece[] {
  switch (filter) {
    case 'Mías':
      return list.filter((p) => p.assignee === currentUser);
    case 'Diseño':
      return list.filter((p) => p.type !== 'Vídeo');
    case 'Vídeo':
      return list.filter((p) => p.type === 'Vídeo');
    case 'Pend. aprobar':
      return list.filter((p) => p.status === 'Revisión');
    case 'Correcciones':
      return list.filter((p) => p.status === 'Cambios');
    case 'Atrasadas':
      return list.filter((p) => p.isOverdue);
    case 'Todas':
    default:
      return list;
  }
}

export function groupByStatus(list: CreativePiece[]): Record<PieceStatus, CreativePiece[]> {
  const groups = {} as Record<PieceStatus, CreativePiece[]>;
  STATUS_COLUMNS.forEach((s) => (groups[s] = []));
  list.forEach((p) => groups[p.status].push(p));
  return groups;
}

export function deriveStats(list: CreativePiece[]) {
  return {
    activas: list.filter((p) => p.status !== 'Aprobado').length,
    pendAprobar: list.filter((p) => p.status === 'Revisión').length,
    correcciones: list.filter((p) => p.status === 'Cambios').length,
    atrasadas: list.filter((p) => p.isOverdue).length,
  };
}
```

Nota: requiere que `@/components/ui` exporte el tipo `BadgeProps` (ya se exporta vía `export * from './Badge'`).

- [ ] **Step 5: Ejecutar y ver pasar**

Run: `npx vitest run src/features/creativos/data/creativos.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 6: Commit**

```bash
git add src/features/creativos/data/
git commit -m "feat(creativos): mock seed + pure filter/group/stats helpers"
```

---

### Task 3: `CreativosStatCard`

**Files:**
- Create: `src/features/creativos/components/CreativosStatCard.tsx`
- Test: `src/features/creativos/components/CreativosStatCard.test.tsx`

**Interfaces:**
- Produces: `CreativosStatCard({ value, label, valueClassName }: { value: number | string; label: string; valueClassName?: string })`.

- [ ] **Step 1: Test (debe fallar)**

Crear `src/features/creativos/components/CreativosStatCard.test.tsx`:

```tsx
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CreativosStatCard } from './CreativosStatCard';

describe('CreativosStatCard', () => {
  it('renders value above label and applies the value color class', () => {
    render(<CreativosStatCard value={1} label="Atrasadas" valueClassName="text-rose-600" />);
    expect(screen.getByText('1')).toHaveClass('text-2xl', 'font-semibold', 'text-rose-600');
    expect(screen.getByText('Atrasadas')).toHaveClass('text-xs', 'text-slate-500');
  });
});
```

- [ ] **Step 2: Ejecutar y ver fallar**

Run: `npx vitest run src/features/creativos/components/CreativosStatCard.test.tsx`
Expected: FAIL — módulo inexistente.

- [ ] **Step 3: Implementar**

Crear `src/features/creativos/components/CreativosStatCard.tsx`:

```tsx
import { Card } from '@/components/ui';
import { cn } from '@/lib/utils';

export interface CreativosStatCardProps {
  value: number | string;
  label: string;
  valueClassName?: string;
}

export function CreativosStatCard({ value, label, valueClassName }: CreativosStatCardProps) {
  return (
    <Card className="border-slate-200 px-4 py-3">
      <p className={cn('text-2xl font-semibold text-slate-800', valueClassName)}>{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </Card>
  );
}
```

- [ ] **Step 4: Ejecutar y ver pasar**

Run: `npx vitest run src/features/creativos/components/CreativosStatCard.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/creativos/components/CreativosStatCard.tsx src/features/creativos/components/CreativosStatCard.test.tsx
git commit -m "feat(creativos): CreativosStatCard (value-over-label)"
```

---

### Task 4: `FilterChips`

**Files:**
- Create: `src/features/creativos/components/FilterChips.tsx`
- Test: `src/features/creativos/components/FilterChips.test.tsx`

**Interfaces:**
- Consumes: `FILTERS`, `CreativosFilter` de `../data/creativos`.
- Produces: `FilterChips({ active, onChange }: { active: CreativosFilter; onChange: (f: CreativosFilter) => void })`.

- [ ] **Step 1: Test (debe fallar)**

Crear `src/features/creativos/components/FilterChips.test.tsx`:

```tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FilterChips } from './FilterChips';

describe('FilterChips', () => {
  it('renders all 7 filters and marks the active one', () => {
    render(<FilterChips active="Todas" onChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Todas' })).toHaveClass('bg-brand-600', 'text-white');
    expect(screen.getByRole('button', { name: 'Vídeo' })).toHaveClass('bg-slate-100', 'text-slate-600');
    expect(screen.getAllByRole('button')).toHaveLength(7);
  });

  it('calls onChange with the clicked filter', () => {
    const onChange = vi.fn();
    render(<FilterChips active="Todas" onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Atrasadas' }));
    expect(onChange).toHaveBeenCalledWith('Atrasadas');
  });
});
```

- [ ] **Step 2: Ejecutar y ver fallar**

Run: `npx vitest run src/features/creativos/components/FilterChips.test.tsx`
Expected: FAIL — módulo inexistente.

- [ ] **Step 3: Implementar**

Crear `src/features/creativos/components/FilterChips.tsx`:

```tsx
import { cn } from '@/lib/utils';
import { FILTERS, type CreativosFilter } from '../data/creativos';

export interface FilterChipsProps {
  active: CreativosFilter;
  onChange: (filter: CreativosFilter) => void;
}

export function FilterChips({ active, onChange }: FilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {FILTERS.map((filter) => (
        <button
          key={filter}
          type="button"
          onClick={() => onChange(filter)}
          className={cn(
            'rounded-full px-3 py-1 text-xs font-medium',
            filter === active
              ? 'bg-brand-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
          )}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Ejecutar y ver pasar**

Run: `npx vitest run src/features/creativos/components/FilterChips.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/features/creativos/components/FilterChips.tsx src/features/creativos/components/FilterChips.test.tsx
git commit -m "feat(creativos): FilterChips filter bar"
```

---

### Task 5: `PieceCard`

**Files:**
- Create: `src/features/creativos/components/PieceCard.tsx`
- Test: `src/features/creativos/components/PieceCard.test.tsx`

**Interfaces:**
- Consumes: `CreativePiece` de `../data/seed`; `PRIORITY_VARIANT` de `../data/creativos`; `Badge` de `@/components/ui`.
- Produces: `PieceCard({ piece }: { piece: CreativePiece })` → un `<button type="button">` inerte.

- [ ] **Step 1: Test (debe fallar)**

Crear `src/features/creativos/components/PieceCard.test.tsx`:

```tsx
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PieceCard } from './PieceCard';
import type { CreativePiece } from '../data/seed';

const overdue: CreativePiece = {
  id: 'p3', assignee: 'Carlos', title: 'Test', client: 'SIGHT', type: 'Estático',
  version: 'v1', priority: 'Alta', deadline: '09 jul 2026', status: 'Revisión', isOverdue: true,
};
const normal: CreativePiece = {
  id: 'p1', assignee: 'Carlos', title: 'Pack Sold Out · Pack Sold Out', client: 'SIGHT',
  type: 'Vídeo', version: 'v1', priority: 'Media', deadline: '10 jul 2026',
  status: 'Briefing', checklist: { done: 2, total: 3 },
};

describe('PieceCard', () => {
  it('shows assignee, title, meta line, and the priority badge', () => {
    render(<PieceCard piece={normal} />);
    expect(screen.getByText('Carlos')).toBeInTheDocument();
    expect(screen.getByText('Pack Sold Out · Pack Sold Out')).toBeInTheDocument();
    expect(screen.getByText('SIGHT · Vídeo · v1')).toBeInTheDocument();
    expect(screen.getByText('Media')).toHaveClass('bg-amber-100', 'text-amber-700');
    expect(screen.getByText(/2\/3/)).toBeInTheDocument(); // rendered as "☑ 2/3"
  });

  it('highlights overdue pieces and shows the priority "Alta" in rose', () => {
    render(<PieceCard piece={overdue} />);
    const button = screen.getByRole('button', { name: /Test/ });
    expect(button).toHaveClass('border-red-300', 'ring-1', 'ring-red-100');
    expect(screen.getByText('Alta')).toHaveClass('bg-rose-100', 'text-rose-700');
  });
});
```

- [ ] **Step 2: Ejecutar y ver fallar**

Run: `npx vitest run src/features/creativos/components/PieceCard.test.tsx`
Expected: FAIL — módulo inexistente.

- [ ] **Step 3: Implementar**

Crear `src/features/creativos/components/PieceCard.tsx`:

```tsx
import { Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { CreativePiece } from '../data/seed';
import { PRIORITY_VARIANT } from '../data/creativos';

export interface PieceCardProps {
  piece: CreativePiece;
}

export function PieceCard({ piece }: PieceCardProps) {
  return (
    <button
      type="button"
      className={cn(
        'block w-full rounded-lg border bg-white p-2.5 text-left hover:shadow-sm',
        piece.isOverdue ? 'border-red-300 ring-1 ring-red-100' : 'border-slate-200',
      )}
    >
      <div className="flex items-center gap-1.5">
        <span
          aria-hidden
          className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-slate-200 text-[9px] font-medium text-slate-600"
        >
          {piece.assignee.charAt(0)}
        </span>
        <span className="text-[11px] font-medium text-slate-600">{piece.assignee}</span>
      </div>
      <p className="mt-1 truncate text-sm font-medium text-slate-800">{piece.title}</p>
      <p className="mt-0.5 truncate text-xs text-slate-400">
        {piece.client} · {piece.type} · {piece.version}
      </p>
      <div className="mt-2 flex items-center gap-2">
        <Badge variant={PRIORITY_VARIANT[piece.priority]} size="sm">
          {piece.priority}
        </Badge>
        <span className={cn('text-[10px]', piece.isOverdue ? 'font-semibold text-rose-600' : 'text-slate-500')}>
          📅 {piece.deadline}
        </span>
        {piece.checklist && (
          <span className="text-[10px] text-slate-500">
            ☑ {piece.checklist.done}/{piece.checklist.total}
          </span>
        )}
      </div>
    </button>
  );
}
```

- [ ] **Step 4: Ejecutar y ver pasar**

Run: `npx vitest run src/features/creativos/components/PieceCard.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/features/creativos/components/PieceCard.tsx src/features/creativos/components/PieceCard.test.tsx
git commit -m "feat(creativos): PieceCard with overdue highlight + priority badge"
```

---

### Task 6: `PiecesKanban`

**Files:**
- Create: `src/features/creativos/components/PiecesKanban.tsx`
- Test: `src/features/creativos/components/PiecesKanban.test.tsx`

**Interfaces:**
- Consumes: `CreativePiece` de `../data/seed`; `STATUS_COLUMNS`, `STATUS_VARIANT`, `groupByStatus` de `../data/creativos`; `Badge` de `@/components/ui`; `PieceCard`.
- Produces: `PiecesKanban({ pieces }: { pieces: CreativePiece[] })`.

- [ ] **Step 1: Test (debe fallar)**

Crear `src/features/creativos/components/PiecesKanban.test.tsx`:

```tsx
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PiecesKanban } from './PiecesKanban';
import { pieces } from '../data/seed';

describe('PiecesKanban', () => {
  it('renders the 5 status columns with colored header badges and counts', () => {
    render(<PiecesKanban pieces={pieces} />);
    expect(screen.getByText('Briefing')).toHaveClass('bg-slate-100', 'text-slate-600');
    expect(screen.getByText('En producción')).toHaveClass('bg-sky-100', 'text-sky-700');
    expect(screen.getByText('Cambios')).toHaveClass('bg-rose-100', 'text-rose-700');
    expect(screen.getByText('Aprobado')).toHaveClass('bg-emerald-100', 'text-emerald-700');
  });

  it('shows a dash for empty columns and the piece in its column', () => {
    render(<PiecesKanban pieces={pieces} />);
    // "Test" (Revisión) is rendered as a card
    expect(screen.getByText('Test')).toBeInTheDocument();
    // Cambios + Aprobado are empty → two em-dash placeholders
    expect(screen.getAllByText('—')).toHaveLength(2);
  });
});
```

- [ ] **Step 2: Ejecutar y ver fallar**

Run: `npx vitest run src/features/creativos/components/PiecesKanban.test.tsx`
Expected: FAIL — módulo inexistente.

- [ ] **Step 3: Implementar**

Crear `src/features/creativos/components/PiecesKanban.tsx`:

```tsx
import { Badge } from '@/components/ui';
import type { CreativePiece } from '../data/seed';
import { STATUS_COLUMNS, STATUS_VARIANT, groupByStatus } from '../data/creativos';
import { PieceCard } from './PieceCard';

export interface PiecesKanbanProps {
  pieces: CreativePiece[];
}

export function PiecesKanban({ pieces }: PiecesKanbanProps) {
  const groups = groupByStatus(pieces);
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
      {STATUS_COLUMNS.map((status) => {
        const items = groups[status];
        return (
          <div key={status}>
            <div className="mb-2 flex items-center justify-between px-1">
              <Badge variant={STATUS_VARIANT[status]}>{status}</Badge>
              <span className="text-xs font-medium text-slate-400">{items.length}</span>
            </div>
            {items.length === 0 ? (
              <p className="px-1 text-sm text-slate-300">—</p>
            ) : (
              <div className="space-y-2">
                {items.map((piece) => (
                  <PieceCard key={piece.id} piece={piece} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 4: Ejecutar y ver pasar**

Run: `npx vitest run src/features/creativos/components/PiecesKanban.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/features/creativos/components/PiecesKanban.tsx src/features/creativos/components/PiecesKanban.test.tsx
git commit -m "feat(creativos): PiecesKanban — 5 header-pill columns"
```

---

### Task 7: `PiecesTable`

**Files:**
- Create: `src/features/creativos/components/PiecesTable.tsx`
- Test: `src/features/creativos/components/PiecesTable.test.tsx`

**Interfaces:**
- Consumes: `CreativePiece` de `../data/seed`; `STATUS_VARIANT`, `PRIORITY_VARIANT` de `../data/creativos`; `Badge`, `Card` de `@/components/ui`.
- Produces: `PiecesTable({ pieces }: { pieces: CreativePiece[] })` → `<table>` semántica.

- [ ] **Step 1: Test (debe fallar)**

Crear `src/features/creativos/components/PiecesTable.test.tsx`:

```tsx
import '@testing-library/jest-dom';
import { render, screen, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PiecesTable } from './PiecesTable';
import { pieces } from '../data/seed';

describe('PiecesTable', () => {
  it('renders the 7 column headers', () => {
    render(<PiecesTable pieces={pieces} />);
    ['PIEZA', 'CLIENTE', 'TIPO', 'PRIORIDAD', 'DEADLINE', 'ESTADO', 'CLIENTE APROB.'].forEach((h) =>
      expect(screen.getByRole('columnheader', { name: h })).toBeInTheDocument(),
    );
  });

  it('renders a row with estado + prioridad badges and a dash for empty client approval', () => {
    render(<PiecesTable pieces={pieces} />);
    const row = screen.getByText('Test').closest('tr')!;
    expect(within(row).getByText('Alta')).toHaveClass('bg-rose-100', 'text-rose-700');
    expect(within(row).getByText('Revisión')).toHaveClass('bg-amber-100', 'text-amber-700');
    expect(within(row).getByText('—')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Ejecutar y ver fallar**

Run: `npx vitest run src/features/creativos/components/PiecesTable.test.tsx`
Expected: FAIL — módulo inexistente.

- [ ] **Step 3: Implementar**

Crear `src/features/creativos/components/PiecesTable.tsx`:

```tsx
import { Badge } from '@/components/ui';
import type { CreativePiece } from '../data/seed';
import { STATUS_VARIANT, PRIORITY_VARIANT } from '../data/creativos';

export interface PiecesTableProps {
  pieces: CreativePiece[];
}

const HEADERS = ['PIEZA', 'CLIENTE', 'TIPO', 'PRIORIDAD', 'DEADLINE', 'ESTADO', 'CLIENTE APROB.'];

export function PiecesTable({ pieces }: PiecesTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400">
            {HEADERS.map((h) => (
              <th key={h} className="px-4 py-2 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pieces.map((piece) => (
            <tr key={piece.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
              <td className="px-4 py-3 text-sm">
                <span className="text-slate-800">{piece.title}</span>{' '}
                <span className="text-slate-400">{piece.version}</span>
              </td>
              <td className="px-4 py-3 text-sm text-slate-600">{piece.client}</td>
              <td className="px-4 py-3 text-sm text-slate-600">{piece.type}</td>
              <td className="px-4 py-3">
                <Badge variant={PRIORITY_VARIANT[piece.priority]}>{piece.priority}</Badge>
              </td>
              <td className="px-4 py-3 text-sm text-slate-600">{piece.deadline}</td>
              <td className="px-4 py-3">
                <Badge variant={STATUS_VARIANT[piece.status]}>{piece.status}</Badge>
              </td>
              <td className="px-4 py-3 text-sm text-slate-300">{piece.clientApproval ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 4: Ejecutar y ver pasar**

Run: `npx vitest run src/features/creativos/components/PiecesTable.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/features/creativos/components/PiecesTable.tsx src/features/creativos/components/PiecesTable.test.tsx
git commit -m "feat(creativos): PiecesTable — semantic table with estado/priority badges"
```

---

### Task 8: `CreativosPage` (composición + estado de filtro)

**Files:**
- Create: `src/features/creativos/pages/CreativosPage.tsx`
- Test: `src/features/creativos/pages/CreativosPage.test.tsx`

**Interfaces:**
- Consumes: `pieces`, `CURRENT_USER` de `../data/seed`; `filterPieces`, `deriveStats`, `type CreativosFilter` de `../data/creativos`; `CreativosStatCard`, `FilterChips`, `PiecesKanban`, `PiecesTable`; `Button` de `@/components/ui`.
- Produces: `CreativosPage()` — página completa (sin `AppLayout`; el shell lo aporta).

- [ ] **Step 1: Test (debe fallar)**

Crear `src/features/creativos/pages/CreativosPage.test.tsx`:

```tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CreativosPage } from './CreativosPage';

describe('CreativosPage', () => {
  it('renders header, the 4 stat cards with live counts, and the Nueva pieza action', () => {
    render(<CreativosPage />);
    expect(screen.getByRole('heading', { name: 'Creativos', level: 1 })).toBeInTheDocument();
    expect(screen.getByText('Piezas activas')).toBeInTheDocument();
    expect(screen.getByText('Pend. aprobar')).toBeInTheDocument();
    expect(screen.getByText('En correcciones')).toBeInTheDocument();
    expect(screen.getByText('Atrasadas')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Nueva pieza/ })).toBeInTheDocument();
  });

  it('filtering by "Vídeo" narrows both the kanban and the table to the video piece', () => {
    render(<CreativosPage />);
    // Before: the table has 3 data rows
    expect(screen.getAllByText('SIGHT').length).toBeGreaterThan(1);
    fireEvent.click(screen.getByRole('button', { name: 'Vídeo' }));
    // After: only the vídeo piece (p1) remains — its meta line is unique to video
    expect(screen.queryByText('Test')).not.toBeInTheDocument();
    const table = screen.getByRole('table');
    expect(within(table).getAllByRole('row')).toHaveLength(2); // header + 1 data row
  });
});
```

- [ ] **Step 2: Ejecutar y ver fallar**

Run: `npx vitest run src/features/creativos/pages/CreativosPage.test.tsx`
Expected: FAIL — módulo inexistente.

- [ ] **Step 3: Implementar**

Crear `src/features/creativos/pages/CreativosPage.tsx`:

```tsx
import { useState } from 'react';
import { Button } from '@/components/ui';
import { pieces as allPieces, CURRENT_USER } from '../data/seed';
import { filterPieces, deriveStats, type CreativosFilter } from '../data/creativos';
import { CreativosStatCard } from '../components/CreativosStatCard';
import { FilterChips } from '../components/FilterChips';
import { PiecesKanban } from '../components/PiecesKanban';
import { PiecesTable } from '../components/PiecesTable';

export function CreativosPage() {
  const [filter, setFilter] = useState<CreativosFilter>('Todas');
  const stats = deriveStats(allPieces);
  const visible = filterPieces(allPieces, filter, CURRENT_USER);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Creativos</h1>
          <p className="text-sm text-slate-500">
            Tablero de piezas del equipo de diseño: Euphoric, clientes del CRM y empresas internas.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">Asignar a:</span>
          {['Alba', 'Carlos'].map((name) => (
            <button
              key={name}
              type="button"
              className="rounded-full border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-600 hover:border-brand-400 hover:text-brand-600"
            >
              + {name}
            </button>
          ))}
          <Button variant="primary" size="sm">
            + Nueva pieza
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <CreativosStatCard value={stats.activas} label="Piezas activas" />
        <CreativosStatCard value={stats.pendAprobar} label="Pend. aprobar" valueClassName="text-amber-600" />
        <CreativosStatCard value={stats.correcciones} label="En correcciones" valueClassName="text-rose-600" />
        <CreativosStatCard value={stats.atrasadas} label="Atrasadas" valueClassName="text-rose-600" />
      </div>

      <div className="flex items-center justify-between">
        <FilterChips active={filter} onChange={setFilter} />
        <span className="text-xs text-slate-400">
          Recursos: — <span className="text-brand-600 hover:underline">Editar</span>
        </span>
      </div>

      <PiecesKanban pieces={visible} />
      <PiecesTable pieces={visible} />
    </div>
  );
}
```

- [ ] **Step 4: Ejecutar y ver pasar**

Run: `npx vitest run src/features/creativos/pages/CreativosPage.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/features/creativos/pages/CreativosPage.tsx src/features/creativos/pages/CreativosPage.test.tsx
git commit -m "feat(creativos): CreativosPage — compose stats, filters, kanban, table"
```

---

### Task 9: Shell real + wiring del router

**Files:**
- Modify: `src/features/modules/CreativosShell.tsx`
- Modify: `src/app/router.tsx`

**Interfaces:**
- Consumes: `AppLayout` de `@/components/layout`; `CreativosPage`; `Outlet` de react-router.
- El shell replica el patrón de `CrudaShell` (`AppLayout` con `module` + `<Outlet/>`).

- [ ] **Step 1: Reescribir `CreativosShell` como shell real**

Reemplazar `src/features/modules/CreativosShell.tsx` por:

```tsx
import { Outlet } from 'react-router';
import { AppLayout } from '@/components/layout';
import type { User } from '@/types';

const mockUser: User = { id: '1', email: 'test@example.com', name: 'Test User', role: 'Admin' };

const tabs = [{ label: 'Piezas', href: '/creativos' }];

export function CreativosShell() {
  return (
    <AppLayout
      user={mockUser}
      module={{
        name: 'Creativos',
        href: '/creativos',
        tabs,
      }}
    >
      <Outlet />
    </AppLayout>
  );
}
```

- [ ] **Step 2: Cablear la ruta anidada**

En `src/app/router.tsx`: (a) añadir el import `import { CreativosPage } from '@/features/creativos/pages/CreativosPage';` junto a los demás imports de páginas; (b) convertir la ruta leaf en anidada. Reemplazar:

```tsx
      <Route path="/creativos" element={<CreativosShell />} />
```

por:

```tsx
      <Route path="/creativos" element={<CreativosShell />}>
        <Route index element={<CreativosPage />} />
      </Route>
```

- [ ] **Step 3: Verificación completa (tsc + lint + suite)**

Run: `npx tsc --noEmit && npm run lint && npm test`
Expected: tsc sin errores; lint 0 warnings; vitest todos en verde.

- [ ] **Step 4: Commit**

```bash
git add src/features/modules/CreativosShell.tsx src/app/router.tsx
git commit -m "feat(creativos): real shell + nested /creativos route"
```

---

### Task 10: Verificación pixel-perfect

**Files:** ninguno (solo verificación; capturas al scratchpad).

- [ ] **Step 1: Dev server** (si no está): `npm run dev` → `http://localhost:5173/`.
- [ ] **Step 2: Capturar `/creativos`** con Playwright (chromium de caché `/home/arian/.npm/_npx/e41f203b7505f1fb/...`, viewport 1440×900, dSF 2). Login mock (`test@example.com`/`password`) si hace falta; navegar a `/creativos`; `fullPage`.
- [ ] **Step 3: Contrastar** contra `docs/references/creativos/live-creativos-full.png` y confirmar: header + acciones; 4 stat cards con colores (slate/amber/rose/rose); pills de filtro (Todas activa); kanban 5 columnas con cabeceras de color + contadores + `—` en vacías; tarjeta (avatar+meta+prioridad+📅+☑, atrasada resaltada en rojo); tabla con pills de estado/prioridad y `—`.
- [ ] **Step 4: Probar un filtro** (p. ej. "Vídeo", "Atrasadas") y confirmar que kanban y tabla se reducen coherentemente.
- [ ] **Step 5: Actualizar memoria** de estado del proyecto (ver `MEMORY.md`): microfase Fase 5 Creativos completada en `feature/fase5-creativos`, spec/plan/refs, decisión de rama sin fusionar / PR sobre `home-2col-refresh`.

---

## Notas de auto-revisión (cobertura del spec)

- Header + acciones → Task 8. Stat cards valor→label coloreados → Tasks 3 + 8. Filtros funcionales → Tasks 2 (helpers) + 4 (UI) + 8 (estado). Kanban 5 columnas header-pill + tarjetas + atrasada + vacías → Tasks 5 + 6. Tabla `<table>` con pills → Task 7. Variante `rose` (Cambios/Alta) → Task 1. Shell real + ruta + breadcrumb "Creativos/Piezas" → Task 9. Verificación pixel + filtros → Task 10.
- Datos: se usa `data/seed.ts` local (patrón cruda/euphoric), **no** el `MockRepository` — desviación consciente del spec (que mencionaba MockRepository/hook) para seguir el patrón vigente de módulos self-contained.
- Sin placeholders: código literal en cada step.
- Consistencia de tipos: `CreativePiece`/`PieceStatus`/`PiecePriority` definidos en Task 2 y consumidos por Tasks 5–8; `STATUS_VARIANT`/`PRIORITY_VARIANT` (Task 2) usan `BadgeProps['variant']` incluida la nueva `rose` (Task 1); `CreativosFilter` (Task 2) consumido por Tasks 4 y 8.
