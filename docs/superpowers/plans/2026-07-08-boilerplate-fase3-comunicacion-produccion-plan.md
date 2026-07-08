# Boilerplate Intranet — Fase 3: Comunicación & PR + Producción Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Comunicación & PR and Producción modules as pixel-perfect, brand-neutral visual references (dashboard, kanban, master-detail, month calendar, segmented-view list), reusing a small set of new generic UI primitives so the same shapes can be repurposed for Fase 4 and other verticals. Also correct a verified design-token discrepancy (brand purple, heading color) affecting every module shipped so far.

**Architecture:** New generic primitives go in `src/components/ui/` (Badge extended, SegmentedControl, KanbanBoard/Column/Card, MasterDetailList, MonthCalendar, ActivityListItem, StatCard promoted from booking). Feature code lives in `src/features/etra/` and `src/features/produccion/`, following the exact pattern established in Fase 2's `src/features/booking/`. A new shared `useRepositoryQuery` hook removes the copy-pasted fetch/loading/error boilerplate that Fase 2 repeated five times.

**Tech Stack:** Vite 6, React 19, TypeScript 5, Tailwind CSS 3, React Router 7, Lucide React. No new runtime dependencies.

## Global Constraints

- All code is TypeScript with strict mode enabled.
- No component fetches directly from external services; all data access goes through the repository context.
- No real brand names, credentials, production URLs, or real person/event/client data are committed. See §8 of the spec for the exact real→generic mapping.
- The active data adapter is controlled by `VITE_DATA_ADAPTER` (valid values: `mock`, `supabase`, `rest`).
- Brand colors are Tailwind config tokens (`brand-*`) and CSS variables, not hardcoded hex values in components.
- Module names and app name are constants in `src/lib/constants.ts`.
- Every task ends with a git commit.
- No interactivity behind "+ Nueva/o ..." buttons, "Modificar cuenta", filters, or search inputs — they render but do nothing (visual reference only, same convention as Fase 1-2). Kanban drag-and-drop is not implemented; column membership is fixed by fixture data.
- This plan runs on branch `feature/fase3-comunicacion-produccion` (already created, branched from `feature/fase2-booking`). Do not merge to `main` — Fase 1/2/3 will be merged together later, per user instruction.

---

## Task 1: Correct Design Tokens (Brand Color + Style Guide)

**Files:**
- Modify: `tailwind.config.js`
- Modify: `docs/STYLE_GUIDE.md`

**Interfaces:**
- Consumes: nothing new.
- Produces: corrected `brand-50`/`brand-600`/`brand-700` Tailwind tokens used by every subsequent task and by all already-shipped Fase 1-2 code.

- [ ] **Step 1: Update the verified brand tokens in `tailwind.config.js`**

Change only these three lines (leave `100`-`500`, `800`, `900` untouched — they were not contradicted by the live reference and are barely used):

```js
        brand: {
          50: '#F7F3FB',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#773C9F',
          700: '#633383',
          800: '#5B21B6',
          900: '#4C1D95',
        },
```

- [ ] **Step 2: Update `docs/STYLE_GUIDE.md`**

In the Colors table, change the `brand-600` and `brand-700` rows to:

```markdown
| `brand-600` | `#773C9F` | Primary buttons, links, active nav |
| `brand-700` | `#633383` | Primary hover |
```

In the Typography section, change:

```markdown
- Font: `Inter`, fallback `system-ui`.
```

to:

```markdown
- Font: system font stack (`ui-sans-serif, system-ui, sans-serif`) — no web font is loaded.
```

Also add a `text-primary` row note under Colors → Neutrals: change any reference to slate-900 for headings to slate-800 (verified: real heading color is `#1E293B`, not `#0F172A`). If the doc doesn't have a literal `text-primary` row (Fase 2's version doesn't), add one sentence under Neutrals: `Headings use \`slate-800\` (\`#1E293B\`), not slate-900 — verified against the reference app.`

- [ ] **Step 3: Verify nothing else hardcodes the old hex value**

```bash
grep -rn "7C3AED\|6D28D9" src/ docs/
```

Expected: no matches (only `tailwind.config.js`'s `500`/`800`/`900` steps remain, which use different hex values and are unaffected).

- [ ] **Step 4: Run build to confirm no regressions**

```bash
npm run build
```

Expected: succeeds with no TypeScript or Tailwind errors.

- [ ] **Step 5: Commit**

```bash
git add tailwind.config.js docs/STYLE_GUIDE.md
git commit -m "fix: correct brand purple and heading color tokens to match reference"
```

---

## Task 2: Extend `Badge` With New Tones

**Files:**
- Modify: `src/components/ui/Badge.tsx`
- Create: `src/components/ui/Badge.test.tsx`

**Interfaces:**
- Consumes: `cn` from `@/lib/utils`.
- Produces: `Badge` component with `variant` extended to include `'blue' | 'amber' | 'fuchsia' | 'emerald'` and a new `size?: 'sm' | 'md'` prop (default `'md'`). Existing variants (`info`, `success`, `warning`, `danger`, `neutral`) and their colors are unchanged — this only adds new options, so Fase 1-2 usages are unaffected.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/ui/Badge.test.tsx
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders the blue variant with the verified reference color', () => {
    render(<Badge variant="blue">Confirmado</Badge>);
    expect(screen.getByText('Confirmado')).toHaveClass('bg-blue-100', 'text-blue-700');
  });

  it('renders the amber variant', () => {
    render(<Badge variant="amber">En producción</Badge>);
    expect(screen.getByText('En producción')).toHaveClass('bg-amber-100', 'text-amber-700');
  });

  it('renders the fuchsia variant at small size', () => {
    render(<Badge variant="fuchsia" size="sm">Promotor</Badge>);
    expect(screen.getByText('Promotor')).toHaveClass('bg-fuchsia-100', 'text-fuchsia-700', 'text-[10px]');
  });

  it('renders the emerald variant', () => {
    render(<Badge variant="emerald">Activa</Badge>);
    expect(screen.getByText('Activa')).toHaveClass('bg-emerald-100', 'text-emerald-700');
  });

  it('still renders existing variants unchanged', () => {
    render(<Badge variant="warning">Legacy</Badge>);
    expect(screen.getByText('Legacy')).toHaveClass('bg-yellow-50', 'text-yellow-700');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npx vitest run src/components/ui/Badge.test.tsx
```

Expected: FAIL — `variant="blue"` etc. don't exist yet, and `size` prop has no effect.

- [ ] **Step 3: Implement the extended `Badge`**

Replace `src/components/ui/Badge.tsx` entirely:

```tsx
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'info'
    | 'success'
    | 'warning'
    | 'danger'
    | 'neutral'
    | 'blue'
    | 'amber'
    | 'fuchsia'
    | 'emerald';
  size?: 'sm' | 'md';
}

export function Badge({ className, variant = 'neutral', size = 'md', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-xs',
        {
          'bg-blue-50 text-blue-700': variant === 'info',
          'bg-green-50 text-green-700': variant === 'success',
          'bg-yellow-50 text-yellow-700': variant === 'warning',
          'bg-red-50 text-red-700': variant === 'danger',
          'bg-slate-100 text-slate-600': variant === 'neutral',
          'bg-blue-100 text-blue-700': variant === 'blue',
          'bg-amber-100 text-amber-700': variant === 'amber',
          'bg-fuchsia-100 text-fuchsia-700': variant === 'fuchsia',
          'bg-emerald-100 text-emerald-700': variant === 'emerald',
        },
        className
      )}
      {...props}
    />
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npx vitest run src/components/ui/Badge.test.tsx
```

Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/Badge.tsx src/components/ui/Badge.test.tsx
git commit -m "feat: add blue/amber/fuchsia/emerald tones and size prop to Badge"
```

---

## Task 3: `SegmentedControl` Primitive

**Files:**
- Create: `src/components/ui/SegmentedControl.tsx`
- Create: `src/components/ui/SegmentedControl.test.tsx`
- Modify: `src/components/ui/index.ts`

**Interfaces:**
- Consumes: `cn` from `@/lib/utils`.
- Produces: `SegmentedControl<T extends string>({ options, value, onChange, className? })` — a generic pill-toggle used by `SeedingPage` (Etra) and `EventsPage` (Producción) in later tasks.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/ui/SegmentedControl.test.tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SegmentedControl } from './SegmentedControl';

describe('SegmentedControl', () => {
  it('highlights the active option and calls onChange on click', () => {
    const onChange = vi.fn();
    render(
      <SegmentedControl
        options={[
          { label: 'Listado', value: 'list' },
          { label: 'Kanban', value: 'kanban' },
        ]}
        value="list"
        onChange={onChange}
      />
    );
    expect(screen.getByRole('button', { name: 'Listado' })).toHaveClass('bg-white');
    expect(screen.getByRole('button', { name: 'Kanban' })).not.toHaveClass('bg-white');

    fireEvent.click(screen.getByRole('button', { name: 'Kanban' }));
    expect(onChange).toHaveBeenCalledWith('kanban');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npx vitest run src/components/ui/SegmentedControl.test.tsx
```

Expected: FAIL — module doesn't exist.

- [ ] **Step 3: Implement `SegmentedControl`**

```tsx
// src/components/ui/SegmentedControl.tsx
import { cn } from '@/lib/utils';

export interface SegmentedControlOption<T extends string> {
  label: string;
  value: T;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div className={cn('inline-flex items-center gap-1 rounded-lg bg-slate-100 p-1', className)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            'rounded-md px-3 py-1 text-sm font-medium transition-colors',
            value === option.value ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Export it from the barrel**

Add to `src/components/ui/index.ts`:

```ts
export * from './SegmentedControl';
```

- [ ] **Step 5: Run the test to verify it passes**

```bash
npx vitest run src/components/ui/SegmentedControl.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/SegmentedControl.tsx src/components/ui/SegmentedControl.test.tsx src/components/ui/index.ts
git commit -m "feat: add SegmentedControl primitive"
```

---

## Task 4: Kanban Primitives (`KanbanBoard` / `KanbanColumn` / `KanbanCard`)

**Files:**
- Create: `src/components/ui/KanbanBoard.tsx`
- Create: `src/components/ui/KanbanBoard.test.tsx`
- Modify: `src/components/ui/index.ts`

**Interfaces:**
- Consumes: `Card` from `./Card`, `cn` from `@/lib/utils`.
- Produces: `KanbanBoard({ columns, className? })`, `KanbanColumnData { id, label, accentClassName, count?, children? }`, and standalone `KanbanCard({ children, className? })` used directly by page code to build column content. Used by `ActionsPage` (Etra) and `EventsPage` Kanban view (Producción) in later tasks.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/ui/KanbanBoard.test.tsx
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { KanbanBoard, KanbanCard } from './KanbanBoard';

describe('KanbanBoard', () => {
  it('renders columns with counts and an empty-state dash when there are no items', () => {
    render(
      <KanbanBoard
        columns={[
          {
            id: 'planned',
            label: 'Planificada',
            accentClassName: 'border-t-blue-400',
            count: 0,
          },
          {
            id: 'in-progress',
            label: 'En curso',
            accentClassName: 'border-t-amber-400',
            count: 1,
            children: <KanbanCard>59FIFTY Madrid</KanbanCard>,
          },
        ]}
      />
    );

    expect(screen.getByText('Planificada')).toBeInTheDocument();
    expect(screen.getByText('—')).toBeInTheDocument();
    expect(screen.getByText('59FIFTY Madrid')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npx vitest run src/components/ui/KanbanBoard.test.tsx
```

Expected: FAIL — module doesn't exist.

- [ ] **Step 3: Implement the Kanban primitives**

```tsx
// src/components/ui/KanbanBoard.tsx
import { Card } from './Card';
import { cn } from '@/lib/utils';

export interface KanbanColumnData {
  id: string;
  label: string;
  accentClassName: string;
  count?: number;
  children?: React.ReactNode;
}

export interface KanbanBoardProps {
  columns: KanbanColumnData[];
  className?: string;
}

export function KanbanBoard({ columns, className }: KanbanBoardProps) {
  return (
    <div
      className={cn('grid gap-4', className)}
      style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(240px, 1fr))` }}
    >
      {columns.map((column) => (
        <KanbanColumn
          key={column.id}
          label={column.label}
          accentClassName={column.accentClassName}
          count={column.count}
        >
          {column.children}
        </KanbanColumn>
      ))}
    </div>
  );
}

export interface KanbanColumnProps {
  label: string;
  accentClassName: string;
  count?: number;
  children?: React.ReactNode;
}

export function KanbanColumn({ label, accentClassName, count, children }: KanbanColumnProps) {
  return (
    <Card className={cn('overflow-hidden border-t-4 p-0', accentClassName)}>
      <div className="flex items-center justify-between px-4 py-3">
        <h3 className="text-sm font-semibold text-slate-800">{label}</h3>
        {count !== undefined && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
            {count}
          </span>
        )}
      </div>
      <div className="space-y-3 px-4 pb-4">
        {children ?? <p className="py-6 text-center text-slate-300">—</p>}
      </div>
    </Card>
  );
}

export interface KanbanCardProps {
  children: React.ReactNode;
  className?: string;
}

export function KanbanCard({ children, className }: KanbanCardProps) {
  return (
    <div className={cn('rounded-lg border border-slate-100 bg-white p-3 shadow-sm', className)}>
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Export from the barrel**

Add to `src/components/ui/index.ts`:

```ts
export * from './KanbanBoard';
```

- [ ] **Step 5: Run the test to verify it passes**

```bash
npx vitest run src/components/ui/KanbanBoard.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/KanbanBoard.tsx src/components/ui/KanbanBoard.test.tsx src/components/ui/index.ts
git commit -m "feat: add KanbanBoard/KanbanColumn/KanbanCard primitives"
```

---

## Task 5: `MasterDetailList` Primitive

**Files:**
- Create: `src/components/ui/MasterDetailList.tsx`
- Create: `src/components/ui/MasterDetailList.test.tsx`
- Modify: `src/components/ui/index.ts`

**Interfaces:**
- Consumes: `Card` from `./Card`, `cn` from `@/lib/utils`.
- Produces: `MasterDetailList<T extends { id: string }>({ items, renderRow, renderDetail, emptyState?, className? })`. Used by `AccountsPage` (Etra) in a later task, and reusable by Fase 4's CRM/Team modules.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/ui/MasterDetailList.test.tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MasterDetailList } from './MasterDetailList';

interface Item {
  id: string;
  name: string;
}

describe('MasterDetailList', () => {
  it('shows the empty state until an item is selected, then renders its detail', () => {
    const items: Item[] = [
      { id: '1', name: 'Cliente A' },
      { id: '2', name: 'Cliente B' },
    ];

    render(
      <MasterDetailList
        items={items}
        renderRow={(item) => <span>{item.name}</span>}
        renderDetail={(item) => <p>Detalle de {item.name}</p>}
      />
    );

    expect(screen.getByText('Selecciona un elemento o crea uno nuevo.')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Cliente A'));

    expect(screen.getByText('Detalle de Cliente A')).toBeInTheDocument();
    expect(screen.queryByText('Selecciona un elemento o crea uno nuevo.')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npx vitest run src/components/ui/MasterDetailList.test.tsx
```

Expected: FAIL — module doesn't exist.

- [ ] **Step 3: Implement `MasterDetailList`**

```tsx
// src/components/ui/MasterDetailList.tsx
import { useState } from 'react';
import { Card } from './Card';
import { cn } from '@/lib/utils';

export interface MasterDetailListProps<T extends { id: string }> {
  items: T[];
  renderRow: (item: T, isSelected: boolean) => React.ReactNode;
  renderDetail: (item: T) => React.ReactNode;
  emptyState?: string;
  className?: string;
}

export function MasterDetailList<T extends { id: string }>({
  items,
  renderRow,
  renderDetail,
  emptyState = 'Selecciona un elemento o crea uno nuevo.',
  className,
}: MasterDetailListProps<T>) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = items.find((item) => item.id === selectedId) ?? null;

  return (
    <div className={cn('grid gap-6 lg:grid-cols-[320px_1fr]', className)}>
      <Card className="divide-y divide-slate-100 p-0">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedId(item.id)}
            className={cn(
              'block w-full px-4 py-3 text-left transition-colors hover:bg-slate-50',
              selectedId === item.id && 'bg-slate-50'
            )}
          >
            {renderRow(item, selectedId === item.id)}
          </button>
        ))}
      </Card>
      <Card className="flex min-h-[200px] items-center justify-center p-6">
        {selected ? <div className="w-full">{renderDetail(selected)}</div> : (
          <p className="text-slate-400">{emptyState}</p>
        )}
      </Card>
    </div>
  );
}
```

- [ ] **Step 4: Export from the barrel**

Add to `src/components/ui/index.ts`:

```ts
export * from './MasterDetailList';
```

- [ ] **Step 5: Run the test to verify it passes**

```bash
npx vitest run src/components/ui/MasterDetailList.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/MasterDetailList.tsx src/components/ui/MasterDetailList.test.tsx src/components/ui/index.ts
git commit -m "feat: add MasterDetailList primitive"
```

---

## Task 6: `MonthCalendar` Primitive

**Files:**
- Create: `src/components/ui/MonthCalendar.tsx`
- Create: `src/components/ui/MonthCalendar.test.tsx`
- Modify: `src/components/ui/index.ts`

**Interfaces:**
- Consumes: `cn` from `@/lib/utils`.
- Produces: `MonthCalendar({ year, month, monthLabel, events, onPrevMonth, onNextMonth })`, `MonthCalendarEvent { id, isoDate, label, toneClassName }`. Used by `EventsPage`'s Calendario view (Producción) in a later task.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/ui/MonthCalendar.test.tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MonthCalendar } from './MonthCalendar';

describe('MonthCalendar', () => {
  it('renders the month label, weekday header, and an event chip on its day', () => {
    const onNextMonth = vi.fn();
    render(
      <MonthCalendar
        year={2026}
        month={6}
        monthLabel="Julio de 2026"
        events={[{ id: 'e1', isoDate: '2026-07-15', label: 'Evento Primavera', toneClassName: 'bg-blue-100 text-blue-700' }]}
        onPrevMonth={() => {}}
        onNextMonth={onNextMonth}
      />
    );

    expect(screen.getByText('Julio de 2026')).toBeInTheDocument();
    expect(screen.getByText('Lun')).toBeInTheDocument();
    expect(screen.getByText('Evento Primavera')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Siguiente →'));
    expect(onNextMonth).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npx vitest run src/components/ui/MonthCalendar.test.tsx
```

Expected: FAIL — module doesn't exist.

- [ ] **Step 3: Implement `MonthCalendar`**

```tsx
// src/components/ui/MonthCalendar.tsx
import { cn } from '@/lib/utils';

export interface MonthCalendarEvent {
  id: string;
  isoDate: string; // 'YYYY-MM-DD'
  label: string;
  toneClassName: string; // e.g. 'bg-blue-100 text-blue-700'
}

export interface MonthCalendarProps {
  year: number;
  month: number; // 0-11
  monthLabel: string;
  events: MonthCalendarEvent[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

function buildDays(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const mondayIndex = (firstDay.getDay() + 6) % 7; // Monday = 0
  const days: (number | null)[] = Array(mondayIndex).fill(null);
  for (let day = 1; day <= daysInMonth; day++) days.push(day);
  return days;
}

export function MonthCalendar({ year, month, monthLabel, events, onPrevMonth, onNextMonth }: MonthCalendarProps) {
  const days = buildDays(year, month);
  const eventsByDay = new Map<number, MonthCalendarEvent[]>();
  events.forEach((event) => {
    const day = Number(event.isoDate.split('-')[2]);
    const list = eventsByDay.get(day) ?? [];
    list.push(event);
    eventsByDay.set(day, list);
  });

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <button type="button" onClick={onPrevMonth} className="text-sm font-medium text-slate-500 hover:text-slate-700">
          ← Anterior
        </button>
        <h3 className="text-base font-semibold text-slate-900">{monthLabel}</h3>
        <button type="button" onClick={onNextMonth} className="text-sm font-medium text-slate-500 hover:text-slate-700">
          Siguiente →
        </button>
      </div>
      <div className="grid grid-cols-7 text-center text-xs font-medium text-slate-400">
        {WEEKDAYS.map((day) => (
          <div key={day} className="pb-2">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-slate-50">
        {days.map((day, index) => (
          <div key={index} className="min-h-[80px] bg-white p-1 text-xs">
            {day && (
              <>
                <div className="mb-1 text-slate-400">{day}</div>
                <div className="space-y-1">
                  {(eventsByDay.get(day) ?? []).map((event) => (
                    <div key={event.id} className={cn('truncate rounded px-1 py-0.5', event.toneClassName)}>
                      {event.label}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Export from the barrel**

Add to `src/components/ui/index.ts`:

```ts
export * from './MonthCalendar';
```

- [ ] **Step 5: Run the test to verify it passes**

```bash
npx vitest run src/components/ui/MonthCalendar.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/MonthCalendar.tsx src/components/ui/MonthCalendar.test.tsx src/components/ui/index.ts
git commit -m "feat: add MonthCalendar primitive"
```

---

## Task 7: `ActivityListItem` Primitive

**Files:**
- Create: `src/components/ui/ActivityListItem.tsx`
- Create: `src/components/ui/ActivityListItem.test.tsx`
- Modify: `src/components/ui/index.ts`

**Interfaces:**
- Consumes: `Badge`, `BadgeProps` from `./Badge`.
- Produces: `ActivityListItem({ date, title, meta?, badge? })`. Used by `EtraDashboardPage` in a later task. Does not replace booking's existing `ShowListItem` (left untouched).

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/ui/ActivityListItem.test.tsx
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ActivityListItem } from './ActivityListItem';

describe('ActivityListItem', () => {
  it('renders date, title, meta and an optional badge', () => {
    render(
      <ActivityListItem
        date="16 jul 2026"
        title="Acción de prensa Cliente A"
        meta="Cliente A · Evento"
        badge={{ label: 'En curso', variant: 'amber' }}
      />
    );

    expect(screen.getByText('16 jul 2026')).toBeInTheDocument();
    expect(screen.getByText('Acción de prensa Cliente A')).toBeInTheDocument();
    expect(screen.getByText('Cliente A · Evento')).toBeInTheDocument();
    expect(screen.getByText('En curso')).toHaveClass('bg-amber-100', 'text-amber-700');
  });

  it('renders without a badge or meta', () => {
    render(<ActivityListItem date="08 jul 2026" title="Mención en medios" />);
    expect(screen.getByText('Mención en medios')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npx vitest run src/components/ui/ActivityListItem.test.tsx
```

Expected: FAIL — module doesn't exist.

- [ ] **Step 3: Implement `ActivityListItem`**

```tsx
// src/components/ui/ActivityListItem.tsx
import { Badge } from './Badge';
import type { BadgeProps } from './Badge';

export interface ActivityListItemProps {
  date: string;
  title: string;
  meta?: string;
  badge?: { label: string; variant: BadgeProps['variant'] };
}

export function ActivityListItem({ date, title, meta, badge }: ActivityListItemProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="min-w-0">
        <p className="text-xs text-slate-400">{date}</p>
        <h4 className="truncate text-base font-medium text-slate-700">{title}</h4>
        {meta && <p className="text-xs text-slate-400">{meta}</p>}
      </div>
      {badge && (
        <Badge variant={badge.variant} className="shrink-0">
          {badge.label}
        </Badge>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Export from the barrel**

Add to `src/components/ui/index.ts`:

```ts
export * from './ActivityListItem';
```

- [ ] **Step 5: Run the test to verify it passes**

```bash
npx vitest run src/components/ui/ActivityListItem.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/ActivityListItem.tsx src/components/ui/ActivityListItem.test.tsx src/components/ui/index.ts
git commit -m "feat: add ActivityListItem primitive"
```

---

## Task 8: Promote `StatCard` to `src/components/ui/`

**Files:**
- Create: `src/components/ui/StatCard.tsx`
- Create: `src/components/ui/StatCard.test.tsx`
- Modify: `src/components/ui/index.ts`
- Delete: `src/features/booking/components/StatCard.tsx`
- Modify: `src/features/booking/components/index.ts`
- Modify: `src/features/booking/pages/AnalyticsPage.tsx`

**Interfaces:**
- Consumes: `Card` from `./Card`.
- Produces: `StatCard({ label, value, change? })` at `src/components/ui/StatCard.tsx` (same API as before — this is a move, not a rewrite). Used by `AnalyticsPage` (already, updated import) and by `EtraDashboardPage`/`SeedingPage`'s Reporte tab in later tasks.

- [ ] **Step 1: Create the promoted component**

```tsx
// src/components/ui/StatCard.tsx
import { Card } from './Card';

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

- [ ] **Step 2: Add a smoke test**

```tsx
// src/components/ui/StatCard.test.tsx
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StatCard } from './StatCard';

describe('StatCard', () => {
  it('renders label, value and change', () => {
    render(<StatCard label="Cuentas activas" value="2" change="+1" />);
    expect(screen.getByText('Cuentas activas')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('+1')).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Delete the old file and its export**

```bash
rm src/features/booking/components/StatCard.tsx
```

Remove this line from `src/features/booking/components/index.ts`:

```ts
export * from './StatCard';
```

- [ ] **Step 4: Export from the `ui` barrel**

Add to `src/components/ui/index.ts`:

```ts
export * from './StatCard';
```

- [ ] **Step 5: Update `AnalyticsPage`'s import**

In `src/features/booking/pages/AnalyticsPage.tsx`, change:

```tsx
import { StatCard, ChartPlaceholder } from '@/features/booking/components';
```

to:

```tsx
import { StatCard } from '@/components/ui';
import { ChartPlaceholder } from '@/features/booking/components';
```

- [ ] **Step 6: Run the full test suite and build**

```bash
npm run test
npm run build
```

Expected: all tests pass (including the existing `AnalyticsPage`-adjacent tests), build succeeds.

- [ ] **Step 7: Commit**

```bash
git add -A src/components/ui src/features/booking
git commit -m "refactor: promote StatCard to shared ui primitives"
```

---

## Task 9: Fase 3 Domain Types

**Files:**
- Modify: `src/types/index.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `ActionStatus`, `PrAction`, `DeliveryTag`, `Delivery`, `InventoryItem`, `Influencer`, `SeedingReportRow`, `AccountStatus`, `PrAccount`, `ActivityItem`, `PrDashboard`, `EventStatus`, `ProductionEvent` — consumed by Task 10 (repository) and Tasks 12-16 (pages).

- [ ] **Step 1: Append the new types**

Append to the end of `src/types/index.ts`:

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
  variant: string;
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
  meta?: string;
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
  date: string;
  isoDate: string;
  time: string;
  venue: string;
  businessLines: string[];
  manager?: string;
  isHome: boolean;
  role?: 'promoter';
  status: EventStatus;
}
```

- [ ] **Step 2: Verify the project still type-checks**

```bash
npx tsc --noEmit
```

Expected: no errors (these are additive-only types, nothing consumes them yet).

- [ ] **Step 3: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: add Comunicación & PR and Producción domain types"
```

---

## Task 10: Extend Repository, `MockRepository` Fixtures, and Adapter Stubs

**Files:**
- Modify: `src/repositories/types.ts`
- Modify: `src/repositories/MockRepository.ts`
- Modify: `src/repositories/adapters/SupabaseAdapter.ts`
- Modify: `src/repositories/adapters/RestAdapter.ts`
- Create: `src/repositories/MockRepository.fase3.test.ts`

**Interfaces:**
- Consumes: types from Task 9.
- Produces: `Repository.getPrDashboard/getPrActions/getInventory/getDeliveries/getInfluencers/getSeedingReport/getPrAccounts/getProductionEvents`, all implemented in `MockRepository` with brand-neutral fixtures. Consumed by Task 11's `useRepositoryQuery`-based hooks.

- [ ] **Step 1: Extend the `Repository` interface**

In `src/repositories/types.ts`, update the import list and interface:

```ts
import type {
  AnalyticsSummary,
  Artist,
  BookingDashboard,
  Dashboard,
  Delivery,
  Influencer,
  InventoryItem,
  LogisticsItem,
  PrAccount,
  PrAction,
  PrDashboard,
  ProductionEvent,
  SeedingReportRow,
  Show,
  User,
  UserSession,
} from '@/types';

export interface Repository {
  login(email: string, password: string): Promise<UserSession>;
  getCurrentUser(): Promise<User | null>;
  logout(): Promise<void>;
  getDashboard(): Promise<Dashboard>;

  getBookingDashboard(): Promise<BookingDashboard>;
  getShows(): Promise<Show[]>;
  getLogistics(): Promise<LogisticsItem[]>;
  getArtists(): Promise<Artist[]>;
  getAnalytics(): Promise<AnalyticsSummary>;

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

- [ ] **Step 2: Add fixtures to `MockRepository`**

Add this import to the top of `src/repositories/MockRepository.ts` (merge with the existing `@/types` import):

```ts
import type {
  AnalyticsSummary,
  Artist,
  BookingDashboard,
  Dashboard,
  Delivery,
  Influencer,
  InventoryItem,
  LogisticsItem,
  PrAccount,
  PrAction,
  PrDashboard,
  ProductionEvent,
  SeedingReportRow,
  Show,
  User,
  UserSession,
} from '@/types';
```

Append these methods inside the `MockRepository` class, right before its closing `}`:

```ts
  async getPrDashboard(): Promise<PrDashboard> {
    return this.delay({
      activeAccounts: 2,
      totalAccounts: 2,
      billingThisMonth: 0,
      upcomingActions: [
        {
          id: 'pa1',
          date: '16 jul 2026',
          title: 'Acción de prensa Cliente A',
          meta: 'Cliente A · Evento',
          badge: 'En curso',
        },
      ],
      recentCoverage: [
        {
          id: 'rc1',
          date: '08 jul 2026',
          title: 'Mención en medios',
          meta: 'Cliente A · Prensa Digital',
        },
      ],
    });
  }

  async getPrActions(): Promise<PrAction[]> {
    return this.delay([
      { id: 'act1', title: 'Preparar dossier de prensa', account: 'Cliente A', type: 'Evento', amount: 0, status: 'planned', date: '20 jul 2026' },
      { id: 'act2', title: 'Acción de prensa Cliente A', account: 'Cliente A', type: 'Evento', amount: 10000, status: 'in-progress', date: '16 jul 2026' },
      { id: 'act3', title: 'Cierre de campaña Cliente B', account: 'Cliente B', type: 'Campaña', amount: 0, status: 'done', date: '01 jul 2026' },
    ]);
  }

  async getInventory(): Promise<InventoryItem[]> {
    return this.delay([
      { id: 'inv1', name: 'Gorra Edición Limitada', variant: '8 · Rojo', ref: 'REF-0001', quantity: 6 },
      { id: 'inv2', name: 'Camiseta Colección', variant: 'M · Negro', ref: 'REF-0002', quantity: 12 },
    ]);
  }

  async getDeliveries(): Promise<Delivery[]> {
    return this.delay([
      {
        id: 'del1',
        date: '07 jul 2026',
        account: 'Cliente A',
        tags: ['internal-use'],
        recipient: 'Ana López',
        itemsSummary: '1x Gorra Edición Limitada · 8',
        amount: 0,
      },
      {
        id: 'del2',
        date: '07 jul 2026',
        account: 'Cliente A',
        tags: ['mrw-shipment', 'delivered', 'published'],
        recipient: 'Carlos Ruiz',
        itemsSummary: '2x Gorra Edición Limitada · 8',
        amount: 0,
      },
      {
        id: 'del3',
        date: '06 jul 2026',
        account: 'Cliente A',
        tags: ['mrw-shipment', 'delivered', 'published'],
        recipient: 'Carlos Ruiz',
        itemsSummary: '1x Gorra Edición Limitada · 8',
        amount: 0,
      },
    ]);
  }

  async getInfluencers(): Promise<Influencer[]> {
    return this.delay([
      { id: 'inf1', name: 'Carlos Ruiz', initials: 'CR', instagramFollowers: 245000, tiktokFollowers: 26200 },
      { id: 'inf2', name: 'María García', initials: 'MG', instagramFollowers: 335000 },
    ]);
  }

  async getSeedingReport(): Promise<SeedingReportRow[]> {
    return this.delay([
      { date: '07 jul 2026', influencer: 'Carlos Ruiz', pieces: 2, productCost: 0, shippingCost: 0, publicationStatus: 'Publicado' },
      { date: '06 jul 2026', influencer: 'Carlos Ruiz', pieces: 1, productCost: 0, shippingCost: 0, publicationStatus: 'Publicado' },
    ]);
  }

  async getPrAccounts(): Promise<PrAccount[]> {
    return this.delay([
      { id: 'acc1', name: 'Cliente A', status: 'active', manager: 'Ana López', crmClient: 'Cliente A', contact: 'Jack Contacto' },
      { id: 'acc2', name: 'Cliente B', status: 'active', manager: 'Carlos Ruiz', crmClient: 'Cliente B', contact: 'Laura Contacto' },
    ]);
  }

  async getProductionEvents(): Promise<ProductionEvent[]> {
    return this.delay([
      {
        id: 'ev1',
        title: 'Evento Primavera',
        icon: '🎫',
        date: '15 jul 2026',
        isoDate: '2026-07-15',
        time: '20:00–21:30',
        venue: 'Sala Norte, Madrid',
        businessLines: ['Línea A'],
        manager: 'Ana López',
        isHome: true,
        status: 'confirmed',
      },
      {
        id: 'ev2',
        title: 'Proyecto Q3',
        icon: '🎫',
        date: '18 jul 2026',
        isoDate: '2026-07-18',
        time: '18:00–23:00',
        venue: 'Espacio Central, Valencia',
        businessLines: ['Línea B', 'Línea A'],
        manager: 'Carlos Ruiz',
        isHome: true,
        role: 'promoter',
        status: 'in-production',
      },
    ]);
  }
```

- [ ] **Step 3: Add stubs to `SupabaseAdapter` and `RestAdapter`**

In both `src/repositories/adapters/SupabaseAdapter.ts` and `src/repositories/adapters/RestAdapter.ts`, update the `@/types` import to include `Delivery, Influencer, InventoryItem, PrAccount, PrAction, PrDashboard, ProductionEvent, SeedingReportRow` (same list as Step 1), and append (replacing `SupabaseAdapter`/`RestAdapter` in the error message with the correct class name for each file):

```ts
  async getPrDashboard(): Promise<PrDashboard> {
    throw new Error('SupabaseAdapter not implemented in Fase 3');
  }

  async getPrActions(): Promise<PrAction[]> {
    throw new Error('SupabaseAdapter not implemented in Fase 3');
  }

  async getInventory(): Promise<InventoryItem[]> {
    throw new Error('SupabaseAdapter not implemented in Fase 3');
  }

  async getDeliveries(): Promise<Delivery[]> {
    throw new Error('SupabaseAdapter not implemented in Fase 3');
  }

  async getInfluencers(): Promise<Influencer[]> {
    throw new Error('SupabaseAdapter not implemented in Fase 3');
  }

  async getSeedingReport(): Promise<SeedingReportRow[]> {
    throw new Error('SupabaseAdapter not implemented in Fase 3');
  }

  async getPrAccounts(): Promise<PrAccount[]> {
    throw new Error('SupabaseAdapter not implemented in Fase 3');
  }

  async getProductionEvents(): Promise<ProductionEvent[]> {
    throw new Error('SupabaseAdapter not implemented in Fase 3');
  }
```

(Use `'RestAdapter not implemented in Fase 3'` in `RestAdapter.ts`.)

- [ ] **Step 4: Add repository tests**

```ts
// src/repositories/MockRepository.fase3.test.ts
import { describe, it, expect } from 'vitest';
import { MockRepository } from './MockRepository';

describe('MockRepository — Comunicación & PR', () => {
  it('returns the PR dashboard with kpis and activity lists', async () => {
    const repo = new MockRepository();
    const data = await repo.getPrDashboard();
    expect(data.activeAccounts).toBe(2);
    expect(data.upcomingActions.length).toBeGreaterThan(0);
    expect(data.recentCoverage.length).toBeGreaterThan(0);
  });

  it('returns PR actions across multiple statuses', async () => {
    const repo = new MockRepository();
    const actions = await repo.getPrActions();
    const statuses = new Set(actions.map((action) => action.status));
    expect(statuses.size).toBeGreaterThan(1);
  });

  it('returns inventory, deliveries, influencers, seeding report, and accounts', async () => {
    const repo = new MockRepository();
    expect((await repo.getInventory()).length).toBeGreaterThan(0);
    expect((await repo.getDeliveries()).length).toBeGreaterThan(0);
    expect((await repo.getInfluencers()).length).toBeGreaterThan(0);
    expect((await repo.getSeedingReport()).length).toBeGreaterThan(0);
    expect((await repo.getPrAccounts()).length).toBeGreaterThan(0);
  });
});

describe('MockRepository — Producción', () => {
  it('returns production events with distinct statuses', async () => {
    const repo = new MockRepository();
    const events = await repo.getProductionEvents();
    expect(events.length).toBeGreaterThan(0);
    expect(events[0].isoDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
```

- [ ] **Step 5: Run tests**

```bash
npm run test
```

Expected: all tests pass, including the new ones.

- [ ] **Step 6: Commit**

```bash
git add src/repositories src/types
git commit -m "feat: extend repository with Fase 3 domain fixtures and adapter stubs"
```

---

## Task 11: Shared `useRepositoryQuery` Hook

**Files:**
- Create: `src/repositories/useRepositoryQuery.ts`
- Create: `src/repositories/useRepositoryQuery.test.ts`
- Modify: `src/repositories/index.ts`

**Interfaces:**
- Consumes: `useRepository` from `./RepositoryContext`, `Repository` from `./types`.
- Produces: `useRepositoryQuery<T>(query: (repository: Repository) => Promise<T>): { data: T | null; isLoading: boolean; error: string | null }`. Consumed by all 8 new Fase 3 hooks in Task 12-16 (Fase 1-2 hooks are intentionally left as-is — refactoring them is out of scope for this phase).

- [ ] **Step 1: Write the failing test**

```ts
// src/repositories/useRepositoryQuery.test.ts
import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createElement } from 'react';
import { useRepositoryQuery } from './useRepositoryQuery';
import { RepositoryContext } from './RepositoryContext';
import type { Repository } from './types';

function wrapper(repository: Partial<Repository>) {
  return ({ children }: { children: React.ReactNode }) =>
    createElement(RepositoryContext.Provider, { value: repository as Repository }, children);
}

describe('useRepositoryQuery', () => {
  it('resolves data from the given query function', async () => {
    const query = vi.fn((repository: Repository) => repository.getPrAccounts());
    const repository: Partial<Repository> = {
      getPrAccounts: () => Promise.resolve([{ id: 'a1', name: 'Cliente A', status: 'active', manager: 'X', crmClient: 'X', contact: 'X' }]),
    };

    const { result } = renderHook(() => useRepositoryQuery(query), { wrapper: wrapper(repository) });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toHaveLength(1);
    expect(result.current.error).toBeNull();
  });

  it('captures errors from a rejected query', async () => {
    const query = vi.fn((repository: Repository) => repository.getPrAccounts());
    const repository: Partial<Repository> = {
      getPrAccounts: () => Promise.reject(new Error('boom')),
    };

    const { result } = renderHook(() => useRepositoryQuery(query), { wrapper: wrapper(repository) });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBe('boom');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npx vitest run src/repositories/useRepositoryQuery.test.ts
```

Expected: FAIL — module doesn't exist.

- [ ] **Step 3: Implement `useRepositoryQuery`**

```ts
// src/repositories/useRepositoryQuery.ts
import { useEffect, useState } from 'react';
import { useRepository } from './RepositoryContext';
import type { Repository } from './types';

export interface RepositoryQueryResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export function useRepositoryQuery<T>(
  query: (repository: Repository) => Promise<T>
): RepositoryQueryResult<T> {
  const repository = useRepository();
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    query(repository)
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
  }, [repository, query]);

  return { data, isLoading, error };
}
```

- [ ] **Step 4: Export from the barrel**

Add to `src/repositories/index.ts`:

```ts
export * from './useRepositoryQuery';
```

- [ ] **Step 5: Run the test to verify it passes**

```bash
npx vitest run src/repositories/useRepositoryQuery.test.ts
```

Expected: PASS (2 tests). Note: this requires `@testing-library/react`'s `renderHook`/`waitFor`, already a project dependency.

- [ ] **Step 6: Commit**

```bash
git add src/repositories/useRepositoryQuery.ts src/repositories/useRepositoryQuery.test.ts src/repositories/index.ts
git commit -m "feat: add shared useRepositoryQuery hook"
```

---

## Task 12: Fase 3 Feature Hooks

**Files:**
- Create: `src/features/etra/hooks/usePrDashboard.ts`
- Create: `src/features/etra/hooks/usePrActions.ts`
- Create: `src/features/etra/hooks/useInventory.ts`
- Create: `src/features/etra/hooks/useDeliveries.ts`
- Create: `src/features/etra/hooks/useInfluencers.ts`
- Create: `src/features/etra/hooks/useSeedingReport.ts`
- Create: `src/features/etra/hooks/usePrAccounts.ts`
- Create: `src/features/produccion/hooks/useProductionEvents.ts`

**Interfaces:**
- Consumes: `useRepositoryQuery` from `@/repositories`, `Repository` from `@/repositories`.
- Produces: one hook per query method, each returning `{ data, isLoading, error }`. Consumed by the pages built in Tasks 13-16.

- [ ] **Step 1: Create the Etra hooks**

```ts
// src/features/etra/hooks/usePrDashboard.ts
import { useRepositoryQuery } from '@/repositories';
import type { Repository } from '@/repositories';

const query = (repository: Repository) => repository.getPrDashboard();

export function usePrDashboard() {
  return useRepositoryQuery(query);
}
```

```ts
// src/features/etra/hooks/usePrActions.ts
import { useRepositoryQuery } from '@/repositories';
import type { Repository } from '@/repositories';

const query = (repository: Repository) => repository.getPrActions();

export function usePrActions() {
  return useRepositoryQuery(query);
}
```

```ts
// src/features/etra/hooks/useInventory.ts
import { useRepositoryQuery } from '@/repositories';
import type { Repository } from '@/repositories';

const query = (repository: Repository) => repository.getInventory();

export function useInventory() {
  return useRepositoryQuery(query);
}
```

```ts
// src/features/etra/hooks/useDeliveries.ts
import { useRepositoryQuery } from '@/repositories';
import type { Repository } from '@/repositories';

const query = (repository: Repository) => repository.getDeliveries();

export function useDeliveries() {
  return useRepositoryQuery(query);
}
```

```ts
// src/features/etra/hooks/useInfluencers.ts
import { useRepositoryQuery } from '@/repositories';
import type { Repository } from '@/repositories';

const query = (repository: Repository) => repository.getInfluencers();

export function useInfluencers() {
  return useRepositoryQuery(query);
}
```

```ts
// src/features/etra/hooks/useSeedingReport.ts
import { useRepositoryQuery } from '@/repositories';
import type { Repository } from '@/repositories';

const query = (repository: Repository) => repository.getSeedingReport();

export function useSeedingReport() {
  return useRepositoryQuery(query);
}
```

```ts
// src/features/etra/hooks/usePrAccounts.ts
import { useRepositoryQuery } from '@/repositories';
import type { Repository } from '@/repositories';

const query = (repository: Repository) => repository.getPrAccounts();

export function usePrAccounts() {
  return useRepositoryQuery(query);
}
```

- [ ] **Step 2: Create the Producción hook**

```ts
// src/features/produccion/hooks/useProductionEvents.ts
import { useRepositoryQuery } from '@/repositories';
import type { Repository } from '@/repositories';

const query = (repository: Repository) => repository.getProductionEvents();

export function useProductionEvents() {
  return useRepositoryQuery(query);
}
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/features/etra/hooks src/features/produccion/hooks
git commit -m "feat: add Fase 3 feature hooks over useRepositoryQuery"
```

---

## Task 13: `TopNav` Clickable Module Name + Router + Shells

**Files:**
- Modify: `src/components/layout/TopNav.tsx`
- Modify: `src/features/modules/EtraShell.tsx`
- Modify: `src/features/modules/ProduccionShell.tsx`
- Modify: `src/app/router.tsx`
- Create: `src/features/etra/pages/EtraDashboardPage.tsx` (placeholder, filled in Task 14)
- Create: `src/features/etra/pages/ActionsPage.tsx` (placeholder, filled in Task 15)
- Create: `src/features/etra/pages/SeedingPage.tsx` (placeholder, filled in Task 16)
- Create: `src/features/etra/pages/AccountsPage.tsx` (placeholder, filled in Task 17)
- Create: `src/features/produccion/pages/EventsPage.tsx` (placeholder, filled in Task 18)

**Interfaces:**
- Consumes: `ModuleHeader` type (extended), `AppLayout`.
- Produces: `/etra` and `/produccion` routes wired up with real shells and nested routes; placeholder pages so the router compiles before Tasks 14-18 fill them in.

- [ ] **Step 1: Add an optional `href` to `ModuleHeader` and render it as a link**

In `src/components/layout/TopNav.tsx`, add `Link` to the existing `react-router` import:

```tsx
import { Link, NavLink } from 'react-router';
```

Update the interface:

```tsx
export interface ModuleHeader {
  name: string;
  href?: string;
  tabs?: { label: string; href: string }[];
  actionLabel?: string;
}
```

Replace the module-name `<span>` with a conditional link:

```tsx
          {module.href ? (
            <Link to={module.href} className="mr-3 text-sm font-semibold text-slate-900 hover:text-slate-700">
              {module.name}
            </Link>
          ) : (
            <span className="mr-3 text-sm font-semibold text-slate-900">{module.name}</span>
          )}
```

(This replaces the single line `<span className="mr-3 text-sm font-semibold text-slate-900">{module.name}</span>` that currently sits right after the `/` separator span.)

- [ ] **Step 2: Rewrite `EtraShell`**

```tsx
// src/features/modules/EtraShell.tsx
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
  { label: 'Acciones', href: '/etra/tareas' },
  { label: 'Seeding', href: '/etra/seeding' },
  { label: 'Cuentas', href: '/etra/cuentas' },
];

export function EtraShell() {
  return (
    <AppLayout user={mockUser} module={{ name: 'Comunicación & PR', href: '/etra', tabs }}>
      <Outlet />
    </AppLayout>
  );
}
```

- [ ] **Step 3: Rewrite `ProduccionShell`**

```tsx
// src/features/modules/ProduccionShell.tsx
import { Outlet } from 'react-router';
import { AppLayout } from '@/components/layout';
import type { User } from '@/types';

const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'Admin',
};

const tabs = [{ label: 'Eventos', href: '/produccion' }];

export function ProduccionShell() {
  return (
    <AppLayout user={mockUser} module={{ name: 'Producción', href: '/produccion', tabs }}>
      <Outlet />
    </AppLayout>
  );
}
```

- [ ] **Step 4: Create placeholder pages so the router compiles**

```tsx
// src/features/etra/pages/EtraDashboardPage.tsx
export function EtraDashboardPage() {
  return <div>Comunicación & PR — Dashboard</div>;
}
```

```tsx
// src/features/etra/pages/ActionsPage.tsx
export function ActionsPage() {
  return <div>Acciones</div>;
}
```

```tsx
// src/features/etra/pages/SeedingPage.tsx
export function SeedingPage() {
  return <div>Seeding</div>;
}
```

```tsx
// src/features/etra/pages/AccountsPage.tsx
export function AccountsPage() {
  return <div>Cuentas</div>;
}
```

```tsx
// src/features/produccion/pages/EventsPage.tsx
export function EventsPage() {
  return <div>Eventos</div>;
}
```

- [ ] **Step 5: Update the router**

In `src/app/router.tsx`, add these imports:

```tsx
import { EtraDashboardPage } from '@/features/etra/pages/EtraDashboardPage';
import { ActionsPage } from '@/features/etra/pages/ActionsPage';
import { SeedingPage } from '@/features/etra/pages/SeedingPage';
import { AccountsPage } from '@/features/etra/pages/AccountsPage';
import { EventsPage } from '@/features/produccion/pages/EventsPage';
```

Replace the two lines:

```tsx
      <Route path="/etra" element={<EtraShell />} />
      <Route path="/produccion" element={<ProduccionShell />} />
```

with:

```tsx
      <Route path="/etra" element={<EtraShell />}>
        <Route index element={<EtraDashboardPage />} />
        <Route path="tareas" element={<ActionsPage />} />
        <Route path="seeding" element={<SeedingPage />} />
        <Route path="cuentas" element={<AccountsPage />} />
      </Route>
      <Route path="/produccion" element={<ProduccionShell />}>
        <Route index element={<EventsPage />} />
      </Route>
```

- [ ] **Step 6: Verify the dev server and navigation**

```bash
npm run dev
```

Navigate to `/etra`, `/etra/tareas`, `/etra/seeding`, `/etra/cuentas`, and `/produccion`. Confirm: the "Comunicación & PR" / "Producción" breadcrumb text is a working link back to the dashboard, the three Etra tabs highlight correctly, and no console errors appear.

- [ ] **Step 7: Commit**

```bash
git add src/components/layout/TopNav.tsx src/features/modules/EtraShell.tsx src/features/modules/ProduccionShell.tsx src/app/router.tsx src/features/etra/pages src/features/produccion/pages
git commit -m "feat: wire up Etra and Producción shells with nested routes"
```

---

## Task 14: Etra Dashboard Page

**Files:**
- Modify: `src/features/etra/pages/EtraDashboardPage.tsx`

**Interfaces:**
- Consumes: `usePrDashboard`, `StatCard`, `ActivityListItem` from `@/components/ui`, `formatCurrency` from `@/lib/format`.
- Produces: complete Etra dashboard page.

- [ ] **Step 1: Implement the page**

```tsx
// src/features/etra/pages/EtraDashboardPage.tsx
import { Link } from 'react-router';
import { StatCard, ActivityListItem } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import { usePrDashboard } from '../hooks/usePrDashboard';

export function EtraDashboardPage() {
  const { data, isLoading, error } = usePrDashboard();

  if (isLoading) {
    return <div className="py-12 text-center text-slate-500">Cargando...</div>;
  }

  if (error || !data) {
    return <div className="py-12 text-center text-red-600">Error: {error || 'No data'}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Comunicación & PR</h1>
          <p className="text-sm text-slate-500">Resumen del espacio de PR y comunicación.</p>
        </div>
        <Link
          to="/etra/cuentas"
          className="inline-flex h-9 items-center rounded-lg bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700"
        >
          Ver cuentas
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Cuentas activas" value={String(data.activeAccounts)} />
        <StatCard label="Cuentas totales" value={String(data.totalAccounts)} />
        <StatCard label="Facturación este mes" value={formatCurrency(data.billingThisMonth)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">Próximas acciones</h2>
          <div className="divide-y divide-slate-100 rounded-xl border border-slate-100 bg-white px-4 shadow-sm">
            {data.upcomingActions.map((item) => (
              <ActivityListItem
                key={item.id}
                date={item.date}
                title={item.title}
                meta={item.meta}
                badge={item.badge ? { label: item.badge, variant: 'amber' } : undefined}
              />
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">Cobertura reciente</h2>
          <div className="divide-y divide-slate-100 rounded-xl border border-slate-100 bg-white px-4 shadow-sm">
            {data.recentCoverage.map((item) => (
              <ActivityListItem key={item.id} date={item.date} title={item.title} meta={item.meta} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify in the browser**

```bash
npm run dev
```

Navigate to `/etra` and confirm the 3 stat cards, both activity panels, and the "Ver cuentas" button render.

- [ ] **Step 3: Commit**

```bash
git add src/features/etra/pages/EtraDashboardPage.tsx
git commit -m "feat: implement Etra dashboard page"
```

---

## Task 15: Acciones Page (Kanban)

**Files:**
- Modify: `src/features/etra/pages/ActionsPage.tsx`

**Interfaces:**
- Consumes: `usePrActions`, `KanbanBoard`, `KanbanCard`, `Badge` from `@/components/ui`.
- Produces: complete Acciones page.

- [ ] **Step 1: Implement the page**

```tsx
// src/features/etra/pages/ActionsPage.tsx
import { KanbanBoard, KanbanCard, Badge } from '@/components/ui';
import { usePrActions } from '../hooks/usePrActions';
import type { PrAction, ActionStatus } from '@/types';

const COLUMNS: { id: ActionStatus; label: string; accentClassName: string }[] = [
  { id: 'planned', label: 'Planificada', accentClassName: 'border-t-blue-400' },
  { id: 'in-progress', label: 'En curso', accentClassName: 'border-t-amber-400' },
  { id: 'done', label: 'Hecha', accentClassName: 'border-t-emerald-400' },
  { id: 'cancelled', label: 'Cancelada', accentClassName: 'border-t-slate-300' },
];

function ActionCard({ action }: { action: PrAction }) {
  return (
    <KanbanCard>
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium text-slate-800">{action.title}</p>
        <span className="shrink-0 text-xs text-slate-400">{action.date}</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <Badge variant="neutral" size="sm">{action.account}</Badge>
        <Badge variant="neutral" size="sm">{action.type}</Badge>
      </div>
    </KanbanCard>
  );
}

export function ActionsPage() {
  const { data, isLoading, error } = usePrActions();

  if (isLoading) {
    return <div className="py-12 text-center text-slate-500">Cargando...</div>;
  }

  if (error || !data) {
    return <div className="py-12 text-center text-red-600">Error: {error || 'No data'}</div>;
  }

  const columns = COLUMNS.map((column) => {
    const items = data.filter((action) => action.status === column.id);
    return {
      id: column.id,
      label: column.label,
      accentClassName: column.accentClassName,
      count: items.length,
      children:
        items.length > 0 ? (
          <>
            {items.map((action) => (
              <ActionCard key={action.id} action={action} />
            ))}
          </>
        ) : undefined,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">Acciones</h1>
        <button
          type="button"
          className="inline-flex h-9 items-center rounded-lg bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700"
        >
          + Nueva acción
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <select className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800">
          <option>Todas las cuentas</option>
        </select>
        <select className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800">
          <option>Cualquier responsable</option>
        </select>
        <select className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800">
          <option>Todos los tipos</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-brand-600" />
          Solo mías
        </label>
      </div>
      <KanbanBoard columns={columns} />
    </div>
  );
}
```

- [ ] **Step 2: Verify in the browser**

```bash
npm run dev
```

Navigate to `/etra/tareas` and confirm all 4 columns render with correct counts and accent colors, and the single "in-progress" action appears in the "En curso" column.

- [ ] **Step 3: Run lint**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/features/etra/pages/ActionsPage.tsx
git commit -m "feat: implement Acciones kanban page"
```

---

## Task 16: Seeding Page (4 Internal Sub-Tabs)

**Files:**
- Modify: `src/features/etra/pages/SeedingPage.tsx`

**Interfaces:**
- Consumes: `useInventory`, `useDeliveries`, `useInfluencers`, `useSeedingReport`, `SegmentedControl`, `Card`, `Badge` from `@/components/ui`, `formatCurrency` from `@/lib/format`.
- Produces: complete Seeding page with Inventario/Entregas/Influencers/Reporte switching locally (no route change, matching the verified reference behavior).

- [ ] **Step 1: Implement the page**

```tsx
// src/features/etra/pages/SeedingPage.tsx
import { useState } from 'react';
import { SegmentedControl, Card, Badge } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import { useInventory } from '../hooks/useInventory';
import { useDeliveries } from '../hooks/useDeliveries';
import { useInfluencers } from '../hooks/useInfluencers';
import { useSeedingReport } from '../hooks/useSeedingReport';
import type { DeliveryTag } from '@/types';

type SeedingTab = 'inventario' | 'entregas' | 'influencers' | 'reporte';

const TABS: { label: string; value: SeedingTab }[] = [
  { label: 'Inventario', value: 'inventario' },
  { label: 'Entregas', value: 'entregas' },
  { label: 'Influencers', value: 'influencers' },
  { label: 'Reporte', value: 'reporte' },
];

const DELIVERY_TAG_LABEL: Record<DeliveryTag, string> = {
  'internal-use': 'Uso interno',
  'mrw-shipment': 'Envío MRW',
  delivered: 'Entregado',
  published: 'Publicado',
};

export function SeedingPage() {
  const [tab, setTab] = useState<SeedingTab>('inventario');
  const inventory = useInventory();
  const deliveries = useDeliveries();
  const influencers = useInfluencers();
  const report = useSeedingReport();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Seeding</h1>
        <p className="text-sm text-slate-500">
          Inventario de producto de cliente, envíos a influencers y directorio.
        </p>
      </div>

      <SegmentedControl options={TABS} value={tab} onChange={setTab} />

      {tab === 'inventario' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {inventory.isLoading && <p className="text-slate-500">Cargando...</p>}
          {inventory.data?.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-slate-800">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.variant}</p>
                  <p className="text-xs text-slate-400">Ref. {item.ref}</p>
                </div>
                <Badge variant="emerald">{item.quantity} uds.</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === 'entregas' && (
        <div className="space-y-3">
          {deliveries.isLoading && <p className="text-slate-500">Cargando...</p>}
          {deliveries.data?.map((delivery) => (
            <Card key={delivery.id} className="p-4">
              <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span>
                  {delivery.date} · {delivery.account}
                </span>
                {delivery.tags.map((tagValue) => (
                  <Badge key={tagValue} variant="emerald" size="sm">
                    {DELIVERY_TAG_LABEL[tagValue]}
                  </Badge>
                ))}
              </div>
              <p className="font-medium text-slate-800">{delivery.recipient}</p>
              <p className="text-sm text-slate-500">{delivery.itemsSummary}</p>
            </Card>
          ))}
        </div>
      )}

      {tab === 'influencers' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {influencers.isLoading && <p className="text-slate-500">Cargando...</p>}
          {influencers.data?.map((influencer) => (
            <Card key={influencer.id} className="flex items-center gap-3 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-sm font-medium text-brand-700">
                {influencer.initials}
              </div>
              <div>
                <p className="font-medium text-slate-800">{influencer.name}</p>
                <div className="flex gap-2 text-xs text-slate-500">
                  {influencer.instagramFollowers && (
                    <span>IG · {(influencer.instagramFollowers / 1000).toFixed(0)}K</span>
                  )}
                  {influencer.tiktokFollowers && (
                    <span>TT · {(influencer.tiktokFollowers / 1000).toFixed(1)}K</span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === 'reporte' && (
        <div className="space-y-4">
          {report.isLoading && <p className="text-slate-500">Cargando...</p>}
          <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-medium uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Influencer</th>
                  <th className="px-4 py-3 text-right">Piezas</th>
                  <th className="px-4 py-3 text-right">Coste prod.</th>
                  <th className="px-4 py-3 text-right">Envío</th>
                  <th className="px-4 py-3">Publicación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {report.data?.map((row, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-slate-500">{row.date}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{row.influencer}</td>
                    <td className="px-4 py-3 text-right text-slate-700">{row.pieces}</td>
                    <td className="px-4 py-3 text-right text-slate-700">{formatCurrency(row.productCost)}</td>
                    <td className="px-4 py-3 text-right text-slate-700">{formatCurrency(row.shippingCost)}</td>
                    <td className="px-4 py-3 text-slate-500">{row.publicationStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify in the browser**

```bash
npm run dev
```

Navigate to `/etra/seeding` and click through all 4 sub-tabs, confirming each renders its fixture data without a URL change.

- [ ] **Step 3: Commit**

```bash
git add src/features/etra/pages/SeedingPage.tsx
git commit -m "feat: implement Seeding page with 4 internal sub-tabs"
```

---

## Task 17: Cuentas Page (Master-Detail)

**Files:**
- Modify: `src/features/etra/pages/AccountsPage.tsx`

**Interfaces:**
- Consumes: `usePrAccounts`, `MasterDetailList`, `Badge`, `SegmentedControl` from `@/components/ui`.
- Produces: complete Cuentas page with a 5-tab account detail panel (only "Datos" has fixture content; the other 4 show a placeholder, matching the "no detail data explored beyond Datos" scope decision).

- [ ] **Step 1: Implement the page**

```tsx
// src/features/etra/pages/AccountsPage.tsx
import { useState } from 'react';
import { MasterDetailList, Badge, SegmentedControl } from '@/components/ui';
import { usePrAccounts } from '../hooks/usePrAccounts';
import type { PrAccount } from '@/types';

const STATUS_LABEL: Record<PrAccount['status'], string> = {
  active: 'Activa',
  paused: 'Pausada',
  inactive: 'Baja',
};

type AccountDetailTab = 'datos' | 'acciones' | 'obligaciones' | 'cobertura' | 'facturacion';

const DETAIL_TABS: { label: string; value: AccountDetailTab }[] = [
  { label: 'Datos', value: 'datos' },
  { label: 'Acciones', value: 'acciones' },
  { label: 'Obligaciones', value: 'obligaciones' },
  { label: 'Cobertura', value: 'cobertura' },
  { label: 'Facturación', value: 'facturacion' },
];

function AccountDetail({ account }: { account: PrAccount }) {
  const [tab, setTab] = useState<AccountDetailTab>('datos');

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">{account.name}</h2>
        <Badge variant="emerald">{STATUS_LABEL[account.status]}</Badge>
      </div>
      <div className="mb-4 border-b border-slate-100 pb-2">
        <SegmentedControl options={DETAIL_TABS} value={tab} onChange={setTab} />
      </div>
      {tab === 'datos' ? (
        <dl className="space-y-1 text-sm">
          <div className="flex gap-2">
            <dt className="text-slate-400">Resp.:</dt>
            <dd className="text-slate-700">{account.manager}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-slate-400">Cliente CRM:</dt>
            <dd className="text-slate-700">{account.crmClient}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-slate-400">Contacto:</dt>
            <dd className="text-slate-700">{account.contact}</dd>
          </div>
        </dl>
      ) : (
        <p className="py-8 text-center text-slate-400">Sin datos de ejemplo para esta pestaña.</p>
      )}
    </div>
  );
}

export function AccountsPage() {
  const { data, isLoading, error } = usePrAccounts();

  if (isLoading) {
    return <div className="py-12 text-center text-slate-500">Cargando...</div>;
  }

  if (error || !data) {
    return <div className="py-12 text-center text-red-600">Error: {error || 'No data'}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">Cuentas</h1>
        <button
          type="button"
          className="inline-flex h-9 items-center rounded-lg bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700"
        >
          + Nueva cuenta
        </button>
      </div>
      <MasterDetailList
        items={data}
        emptyState="Selecciona una cuenta o crea una nueva."
        renderRow={(account) => (
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-800">{account.name}</span>
            <Badge variant="emerald" size="sm">
              {STATUS_LABEL[account.status]}
            </Badge>
          </div>
        )}
        renderDetail={(account) => <AccountDetail account={account} />}
      />
    </div>
  );
}
```

- [ ] **Step 2: Verify in the browser**

```bash
npm run dev
```

Navigate to `/etra/cuentas`, confirm the empty state shows initially, clicking "Cliente A" shows its detail with the "Datos" tab active, and switching to "Acciones"/"Obligaciones"/etc. shows the placeholder text.

- [ ] **Step 3: Commit**

```bash
git add src/features/etra/pages/AccountsPage.tsx
git commit -m "feat: implement Cuentas master-detail page"
```

---

## Task 18: Producción Eventos Page (Listado / Calendario / Kanban)

**Files:**
- Modify: `src/features/produccion/pages/EventsPage.tsx`

**Interfaces:**
- Consumes: `useProductionEvents`, `SegmentedControl`, `Badge`, `KanbanBoard`, `KanbanCard`, `MonthCalendar`, `Input` from `@/components/ui`.
- Produces: complete Eventos page with all 3 views over the same fixture data.

- [ ] **Step 1: Implement the page**

```tsx
// src/features/produccion/pages/EventsPage.tsx
import { useState } from 'react';
import { SegmentedControl, Badge, KanbanBoard, KanbanCard, MonthCalendar, Input } from '@/components/ui';
import { useProductionEvents } from '../hooks/useProductionEvents';
import type { ProductionEvent, EventStatus } from '@/types';

type EventsView = 'listado' | 'calendario' | 'kanban';

const VIEW_OPTIONS: { label: string; value: EventsView }[] = [
  { label: 'Listado', value: 'listado' },
  { label: 'Calendario', value: 'calendario' },
  { label: 'Kanban', value: 'kanban' },
];

const STATUS_LABEL: Record<EventStatus, string> = {
  idea: 'Idea',
  confirmed: 'Confirmado',
  'in-production': 'En producción',
  'in-progress': 'En curso',
  closed: 'Cerrado',
};

const STATUS_BADGE_VARIANT: Record<EventStatus, 'neutral' | 'blue' | 'amber'> = {
  idea: 'neutral',
  confirmed: 'blue',
  'in-production': 'amber',
  'in-progress': 'amber',
  closed: 'neutral',
};

const KANBAN_COLUMNS: { id: EventStatus; accentClassName: string }[] = [
  { id: 'idea', accentClassName: 'border-t-slate-300' },
  { id: 'confirmed', accentClassName: 'border-t-blue-400' },
  { id: 'in-production', accentClassName: 'border-t-amber-400' },
  { id: 'in-progress', accentClassName: 'border-t-indigo-400' },
  { id: 'closed', accentClassName: 'border-t-emerald-400' },
];

const MONTH_TONE: Record<EventStatus, string> = {
  idea: 'bg-slate-100 text-slate-600',
  confirmed: 'bg-blue-100 text-blue-700',
  'in-production': 'bg-amber-100 text-amber-700',
  'in-progress': 'bg-indigo-100 text-indigo-700',
  closed: 'bg-emerald-100 text-emerald-700',
};

function EventRow({ event }: { event: ProductionEvent }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className="text-lg">{event.icon}</span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="truncate text-base font-medium text-slate-700">{event.title}</h4>
            {event.isHome && (
              <Badge variant="amber" size="sm">
                ★ Home
              </Badge>
            )}
            {event.role === 'promoter' && (
              <Badge variant="fuchsia" size="sm">
                Promotor
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-400">
            {event.date} · {event.time} · {event.venue}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {event.businessLines.map((line) => (
          <span key={line} className="text-xs text-slate-600">
            {line}
          </span>
        ))}
        <Badge variant={STATUS_BADGE_VARIANT[event.status]}>{STATUS_LABEL[event.status]}</Badge>
      </div>
    </div>
  );
}

export function EventsPage() {
  const { data, isLoading, error } = useProductionEvents();
  const [view, setView] = useState<EventsView>('listado');
  const [monthOffset, setMonthOffset] = useState(0);

  if (isLoading) {
    return <div className="py-12 text-center text-slate-500">Cargando...</div>;
  }

  if (error || !data) {
    return <div className="py-12 text-center text-red-600">Error: {error || 'No data'}</div>;
  }

  const baseDate = new Date(2026, 6, 1); // Julio 2026, matches fixture dates
  const viewDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + monthOffset, 1);
  const monthLabel = viewDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  const calendarEvents = data.map((event) => ({
    id: event.id,
    isoDate: event.isoDate,
    label: event.title,
    toneClassName: MONTH_TONE[event.status],
  }));

  const kanbanColumns = KANBAN_COLUMNS.map((column) => {
    const items = data.filter((event) => event.status === column.id);
    return {
      id: column.id,
      label: STATUS_LABEL[column.id],
      accentClassName: column.accentClassName,
      count: items.length,
      children:
        items.length > 0 ? (
          <>
            {items.map((event) => (
              <KanbanCard key={event.id}>
                <p className="font-medium text-slate-800">
                  {event.icon} {event.title}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {event.date} · {event.time}
                </p>
                <p className="text-xs text-slate-400">{event.venue}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {event.businessLines.map((line) => (
                    <Badge key={line} variant="neutral" size="sm">
                      {line}
                    </Badge>
                  ))}
                </div>
              </KanbanCard>
            ))}
          </>
        ) : undefined,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Eventos</h1>
          <p className="text-sm text-slate-500">Base de datos de eventos y producciones del grupo.</p>
        </div>
        <button
          type="button"
          className="inline-flex h-9 items-center rounded-lg bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700"
        >
          + Nuevo evento
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SegmentedControl options={VIEW_OPTIONS} value={view} onChange={setView} />
        <Input placeholder="Buscar..." className="max-w-xs" />
        <select className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800">
          <option>Todos los tipos</option>
        </select>
        <select className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800">
          <option>Todas las líneas</option>
        </select>
      </div>

      {view === 'listado' && (
        <div className="divide-y divide-slate-100 rounded-xl border border-slate-100 bg-white shadow-sm">
          {data.map((event) => (
            <EventRow key={event.id} event={event} />
          ))}
        </div>
      )}

      {view === 'calendario' && (
        <MonthCalendar
          year={viewDate.getFullYear()}
          month={viewDate.getMonth()}
          monthLabel={monthLabel}
          events={calendarEvents}
          onPrevMonth={() => setMonthOffset((offset) => offset - 1)}
          onNextMonth={() => setMonthOffset((offset) => offset + 1)}
        />
      )}

      {view === 'kanban' && <KanbanBoard columns={kanbanColumns} />}
    </div>
  );
}
```

- [ ] **Step 2: Verify in the browser**

```bash
npm run dev
```

Navigate to `/produccion` and confirm all 3 views render over the same 2 fixture events, with correct business-line tags, "★ Home"/"Promotor" badges, and status colors matching Task 1's verified tones.

- [ ] **Step 3: Commit**

```bash
git add src/features/produccion/pages/EventsPage.tsx
git commit -m "feat: implement Producción eventos page with 3 views"
```

---

## Task 19: Final Verification and Push

**Files:** none (verification only).

**Interfaces:** none.

- [ ] **Step 1: Run the full verification suite**

```bash
npm run test
npm run lint
npm run build
```

Expected: all three succeed with zero errors and zero warnings.

- [ ] **Step 2: Grep for leftover real names or the old brand hex**

```bash
grep -rniE "black ?moose|conceptoneagency|blackmoose\.es|new era|tattoox|carlos pego|eduard torres|marià casals|israel b gras|soho farmhouse|mixmag|tagmag|euphoric media|7C3AED|6D28D9" src/ docs/
```

Expected: no matches. If any appear, replace them with the generic equivalents from spec §8 before proceeding.

- [ ] **Step 3: Push the branch**

```bash
git push -u origin feature/fase3-comunicacion-produccion
```

- [ ] **Step 4: Report the branch URL**

```bash
gh repo view --json url
```

Report the branch URL and a summary of what changed to the user. Do not open a PR or merge — per project convention, Fase 1/2/3 will be merged together later.

---

## Plan Self-Review

### Spec coverage

- Design token correction: Task 1.
- Badge tones/sizes: Task 2.
- SegmentedControl, KanbanBoard/Column/Card, MasterDetailList, MonthCalendar, ActivityListItem primitives: Tasks 3-7.
- StatCard promotion: Task 8.
- Domain types: Task 9.
- Repository + fixtures + adapter stubs: Task 10.
- Shared query hook (DRY improvement over Fase 2's repeated pattern): Task 11.
- Feature hooks: Task 12.
- Shells, TopNav link, routing: Task 13.
- Etra dashboard, Acciones, Seeding, Cuentas pages: Tasks 14-17.
- Producción Eventos (3 views): Task 18.
- Final verification, brand-neutrality grep, push: Task 19.

### Placeholder scan

No TBD/TODO/"implement later" steps. All code blocks are complete and runnable as written.

### Type consistency

- `ActionStatus`, `PrAction`, `DeliveryTag`, `Delivery`, `InventoryItem`, `Influencer`, `SeedingReportRow`, `AccountStatus`, `PrAccount`, `ActivityItem`, `PrDashboard`, `EventStatus`, `ProductionEvent` are defined once in Task 9 and consumed with matching names/shapes in Tasks 10-18 (verified: `PrDashboard.upcomingActions`/`recentCoverage` are `ActivityItem[]`, matching `ActivityListItem`'s `date/title/meta/badge` props; `KanbanColumnData.accentClassName` matches the string literal classes used in Tasks 15 and 18; `MonthCalendarEvent.toneClassName` matches `MONTH_TONE` records in Task 18).
- `Repository` method names match exactly between Task 10's interface, `MockRepository`, both adapter stubs, and Task 12's hooks (`getPrDashboard`, `getPrActions`, `getInventory`, `getDeliveries`, `getInfluencers`, `getSeedingReport`, `getPrAccounts`, `getProductionEvents`).
- `ModuleHeader.href` (Task 13) is optional, so `ConceptOneShell`, `CRMShell`, etc. (which don't pass it) keep rendering the plain `<span>` — no regression.
