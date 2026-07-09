# Boilerplate Intranet — Fase 3b: Etra UI Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the Comunicación & PR module (`/etra`) to be pixel-perfect against the 16 new reference screenshots: richer Acciones kanban with an inline creation panel and a brand-new action-detail route, Seeding with underline tabs / stats / modals / expandable influencer cards / a 6-stat report, and Cuentas with a rebuilt left column, a "Nueva cuenta" form, and 4 fully-fleshed detail tabs.

**Architecture:** New generic primitives (`Select`, `Textarea`, `UnderlineTabs`, `Modal`, `ProgressBar`) go in `src/components/ui/`; existing primitives (`Badge`, `SegmentedControl`, `StatCard`, `KanbanBoard`, `MasterDetailList`) gain small additive options. Feature components live in `src/features/etra/components/` (plus `account-tabs/`), pages in `src/features/etra/pages/`. Data stays behind the repository context — no new repository methods; the action detail and per-account action lists are derived client-side from `getPrActions()`.

**Tech Stack:** Vite 6, React 19, TypeScript 5, Tailwind CSS 3, React Router 7, Lucide React, Vitest + Testing Library. No new runtime dependencies.

**Spec:** `docs/superpowers/specs/2026-07-09-boilerplate-fase3b-etra-ui-refresh-design.md` (colors in §3.4 are pixel-verified against the captures — use them verbatim).

## Global Constraints

- Interactivity is **"visual + aperturas"**: modals/panels open and close with local React state, the action detail is a real route, influencer cards expand — but no form persists anything, filters are decorative, and selects use `defaultValue` (uncontrolled). Same convention as Fase 1-3 otherwise.
- **Brand neutrality:** no real names (New Era, TATTOOX, Eduard Torres, Marià Casals, Carlos Pego, 59FIFTY, TAGMAG, blackmoose, "Etra" in **new** user-visible strings). Use the mapping in spec §8. Pre-existing identifiers (`/etra` route, `EtraShell`, folder names) stay.
- Amounts/dates/counters copied exactly from the captures; `formatCurrency` (es-ES) already produces the capture format (`10.000,00 €`, `2000,00 €` — no thousands separator below 10.000, matching the captures).
- Every task ends with a green `npm run test` and a git commit. Branch: `feature/fase3-comunicacion-produccion`.
- Commit trailer on every commit:

```
Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
```

---

## Task 1: `Select` and `Textarea` primitives

**Files:**
- Create: `src/components/ui/Select.tsx`
- Create: `src/components/ui/Textarea.tsx`
- Create: `src/components/ui/Select.test.tsx`
- Modify: `src/components/ui/index.ts`

**Interfaces:**
- Produces: `Select` (native `<select>` styled like `Input`, optional `label`, options via `children`) and `Textarea` (optional `label`). Used by every form in Tasks 9-16.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/ui/Select.test.tsx
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Select } from './Select';
import { Textarea } from './Textarea';

describe('Select', () => {
  it('renders a labelled select with its options', () => {
    render(
      <Select label="Tipo" defaultValue="evento">
        <option value="prensa">Nota de prensa</option>
        <option value="evento">Evento</option>
      </Select>
    );
    expect(screen.getByText('Tipo')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveValue('evento');
  });
});

describe('Textarea', () => {
  it('renders a labelled textarea', () => {
    render(<Textarea label="Notas" placeholder="Escribe..." />);
    expect(screen.getByText('Notas')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Escribe...')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/ui/Select.test.tsx`
Expected: FAIL — `Cannot find module './Select'`.

- [ ] **Step 3: Implement `Select`**

```tsx
// src/components/ui/Select.tsx
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, children, ...props }, ref) => {
    const control = (
      <select
        ref={ref}
        className={cn(
          'h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      >
        {children}
      </select>
    );
    if (!label) return control;
    return (
      <div className="w-full">
        <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
        {control}
      </div>
    );
  }
);
Select.displayName = 'Select';
```

- [ ] **Step 4: Implement `Textarea`**

```tsx
// src/components/ui/Textarea.tsx
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, ...props }, ref) => {
    const control = (
      <textarea
        ref={ref}
        className={cn(
          'min-h-[80px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
    );
    if (!label) return control;
    return (
      <div className="w-full">
        <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
        {control}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
```

- [ ] **Step 5: Export from the barrel**

Add to `src/components/ui/index.ts` (after the `Input` line):

```ts
export * from './Select';
export * from './Textarea';
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npx vitest run src/components/ui/Select.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 7: Commit**

```bash
git add src/components/ui/Select.tsx src/components/ui/Textarea.tsx src/components/ui/Select.test.tsx src/components/ui/index.ts
git commit -m "feat: add Select and Textarea ui primitives"
```

---

## Task 2: `UnderlineTabs` primitive

**Files:**
- Create: `src/components/ui/UnderlineTabs.tsx`
- Create: `src/components/ui/UnderlineTabs.test.tsx`
- Modify: `src/components/ui/index.ts`

**Interfaces:**
- Produces: `UnderlineTabs<T>` with the same `{options, value, onChange}` API as `SegmentedControl`. Active tab: `text-brand-700` + 2px `border-brand-600` underline (pixel-verified `#773C9F`). Used by `SeedingPage` and the account detail.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/ui/UnderlineTabs.test.tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { UnderlineTabs } from './UnderlineTabs';

describe('UnderlineTabs', () => {
  it('underlines the active tab and calls onChange on click', () => {
    const onChange = vi.fn();
    render(
      <UnderlineTabs
        options={[
          { label: 'Inventario', value: 'inventario' },
          { label: 'Entregas', value: 'entregas' },
        ]}
        value="inventario"
        onChange={onChange}
      />
    );
    expect(screen.getByRole('button', { name: 'Inventario' })).toHaveClass('border-brand-600');
    expect(screen.getByRole('button', { name: 'Entregas' })).not.toHaveClass('border-brand-600');

    fireEvent.click(screen.getByRole('button', { name: 'Entregas' }));
    expect(onChange).toHaveBeenCalledWith('entregas');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/ui/UnderlineTabs.test.tsx`
Expected: FAIL — `Cannot find module './UnderlineTabs'`.

- [ ] **Step 3: Implement**

```tsx
// src/components/ui/UnderlineTabs.tsx
import { cn } from '@/lib/utils';

export interface UnderlineTabsOption<T extends string> {
  label: string;
  value: T;
}

export interface UnderlineTabsProps<T extends string> {
  options: UnderlineTabsOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function UnderlineTabs<T extends string>({
  options,
  value,
  onChange,
  className,
}: UnderlineTabsProps<T>) {
  return (
    <div className={cn('flex gap-6 border-b border-slate-200', className)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            '-mb-px border-b-2 pb-2.5 text-sm font-medium transition-colors',
            value === option.value
              ? 'border-brand-600 text-brand-700'
              : 'border-transparent text-slate-600 hover:text-slate-800'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Export from the barrel**

Add to `src/components/ui/index.ts` (after the `SegmentedControl` line):

```ts
export * from './UnderlineTabs';
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/components/ui/UnderlineTabs.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/UnderlineTabs.tsx src/components/ui/UnderlineTabs.test.tsx src/components/ui/index.ts
git commit -m "feat: add UnderlineTabs ui primitive"
```

---

## Task 3: `Modal` primitive

**Files:**
- Create: `src/components/ui/Modal.tsx`
- Create: `src/components/ui/Modal.test.tsx`
- Modify: `src/components/ui/index.ts`

**Interfaces:**
- Produces: `Modal` — `{open, title?, onClose, children, className?}`. Renders nothing when closed; overlay click closes, panel click doesn't. Used by delivery and influencer modals.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/ui/Modal.test.tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Modal } from './Modal';

describe('Modal', () => {
  it('renders nothing when closed and content when open', () => {
    const { rerender } = render(
      <Modal open={false} title="Nueva entrega" onClose={() => {}}>
        <p>Contenido</p>
      </Modal>
    );
    expect(screen.queryByText('Nueva entrega')).not.toBeInTheDocument();

    rerender(
      <Modal open title="Nueva entrega" onClose={() => {}}>
        <p>Contenido</p>
      </Modal>
    );
    expect(screen.getByText('Nueva entrega')).toBeInTheDocument();
    expect(screen.getByText('Contenido')).toBeInTheDocument();
  });

  it('calls onClose when the overlay is clicked but not the panel', () => {
    const onClose = vi.fn();
    render(
      <Modal open title="Nueva entrega" onClose={onClose}>
        <p>Contenido</p>
      </Modal>
    );
    fireEvent.click(screen.getByText('Contenido'));
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('presentation'));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/ui/Modal.test.tsx`
Expected: FAIL — `Cannot find module './Modal'`.

- [ ] **Step 3: Implement**

```tsx
// src/components/ui/Modal.tsx
import { cn } from '@/lib/utils';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  if (!open) return null;
  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
        className={cn(
          'max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl',
          className
        )}
      >
        {title && <h2 className="mb-4 text-lg font-semibold text-slate-800">{title}</h2>}
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Export from the barrel**

Add to `src/components/ui/index.ts`:

```ts
export * from './Modal';
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/components/ui/Modal.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/Modal.tsx src/components/ui/Modal.test.tsx src/components/ui/index.ts
git commit -m "feat: add Modal ui primitive"
```

---

## Task 4: `ProgressBar` primitive

**Files:**
- Create: `src/components/ui/ProgressBar.tsx`
- Create: `src/components/ui/ProgressBar.test.tsx`
- Modify: `src/components/ui/index.ts`

**Interfaces:**
- Produces: `ProgressBar` — `{value, max, className?}`, emerald fill (`#10B981` pixel-verified) on `bg-slate-200` track. Used by the action breakdown and account obligations.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/ui/ProgressBar.test.tsx
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  it('exposes value and max and sizes the fill proportionally', () => {
    render(<ProgressBar value={3540} max={8000} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '3540');
    expect(bar).toHaveAttribute('aria-valuemax', '8000');
    expect(bar.firstElementChild).toHaveStyle({ width: '44.25%' });
  });

  it('clamps to 0% when max is 0', () => {
    render(<ProgressBar value={5} max={0} />);
    expect(screen.getByRole('progressbar').firstElementChild).toHaveStyle({ width: '0%' });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/ui/ProgressBar.test.tsx`
Expected: FAIL — `Cannot find module './ProgressBar'`.

- [ ] **Step 3: Implement**

```tsx
// src/components/ui/ProgressBar.tsx
import { cn } from '@/lib/utils';

export interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
}

export function ProgressBar({ value, max, className }: ProgressBarProps) {
  const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuenow={value}
      aria-valuemax={max}
      className={cn('h-2 w-full overflow-hidden rounded-full bg-slate-200', className)}
    >
      <div className="h-full rounded-full bg-emerald-500" style={{ width: `${percent}%` }} />
    </div>
  );
}
```

- [ ] **Step 4: Export from the barrel**

Add to `src/components/ui/index.ts`:

```ts
export * from './ProgressBar';
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/components/ui/ProgressBar.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/ProgressBar.tsx src/components/ui/ProgressBar.test.tsx src/components/ui/index.ts
git commit -m "feat: add ProgressBar ui primitive"
```

---

## Task 5: Extend `Badge`, `SegmentedControl`, `StatCard`

**Files:**
- Modify: `src/components/ui/Badge.tsx`
- Modify: `src/components/ui/Badge.test.tsx`
- Modify: `src/components/ui/SegmentedControl.tsx`
- Modify: `src/components/ui/SegmentedControl.test.tsx`
- Modify: `src/components/ui/StatCard.tsx`
- Modify: `src/components/ui/StatCard.test.tsx`

**Interfaces:**
- `Badge` gains variants `sky` (`bg-sky-100 text-sky-700` — "Envío MRW", pixel-verified `#E0F2FE/#0369A1`) and `pink` (`bg-pink-50 text-pink-600` — IG chip, `#FDF2F8/#DB2777`).
- `SegmentedControl` gains `fullWidth?: boolean` (equal-width segments spanning the container — the modal "Método" switcher).
- `StatCard` gains `caption?: string` (small slate-400 line under the value) and `valueClassName?: string` (RETORNO renders emerald); value color corrected `text-slate-900` → `text-slate-800` (verified heading color).

- [ ] **Step 1: Extend the Badge test**

Add inside the existing `describe` in `src/components/ui/Badge.test.tsx`:

```tsx
  it('renders the sky and pink variants', () => {
    render(
      <>
        <Badge variant="sky">Envío MRW</Badge>
        <Badge variant="pink" size="sm">IG · 245K</Badge>
      </>
    );
    expect(screen.getByText('Envío MRW')).toHaveClass('bg-sky-100', 'text-sky-700');
    expect(screen.getByText('IG · 245K')).toHaveClass('bg-pink-50', 'text-pink-600');
  });
```

Run: `npx vitest run src/components/ui/Badge.test.tsx` — expected FAIL (variant not applied / type error).

- [ ] **Step 2: Extend `Badge`**

In `src/components/ui/Badge.tsx`, add to the `variant` union after `'emerald'`:

```ts
    | 'sky'
    | 'pink';
```

and add to the class map after the `emerald` line:

```ts
          'bg-sky-100 text-sky-700': variant === 'sky',
          'bg-pink-50 text-pink-600': variant === 'pink',
```

Run: `npx vitest run src/components/ui/Badge.test.tsx` — expected PASS.

- [ ] **Step 3: Extend the SegmentedControl test**

Add inside the existing `describe` in `src/components/ui/SegmentedControl.test.tsx`:

```tsx
  it('spreads segments across the full width when fullWidth is set', () => {
    render(
      <SegmentedControl
        fullWidth
        options={[
          { label: 'Envío MRW', value: 'mrw' },
          { label: 'Uso interno', value: 'internal' },
        ]}
        value="mrw"
        onChange={() => {}}
      />
    );
    expect(screen.getByRole('button', { name: 'Envío MRW' }).parentElement).toHaveClass('grid');
  });
```

Run: `npx vitest run src/components/ui/SegmentedControl.test.tsx` — expected FAIL.

- [ ] **Step 4: Extend `SegmentedControl`**

Replace `src/components/ui/SegmentedControl.tsx` with:

```tsx
import { cn } from '@/lib/utils';

export interface SegmentedControlOption<T extends string> {
  label: string;
  value: T;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  fullWidth?: boolean;
  className?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  fullWidth = false,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      className={cn(
        'rounded-lg bg-slate-100 p-1',
        fullWidth ? 'grid w-full auto-cols-fr grid-flow-col gap-1' : 'inline-flex items-center gap-1',
        className
      )}
    >
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

Run: `npx vitest run src/components/ui/SegmentedControl.test.tsx` — expected PASS (2 tests).

- [ ] **Step 5: Extend the StatCard test**

Add inside the existing `describe` in `src/components/ui/StatCard.test.tsx`:

```tsx
  it('renders caption and applies valueClassName', () => {
    render(<StatCard label="RETORNO" value="100%" caption="2 de 2 publicados" valueClassName="text-emerald-600" />);
    expect(screen.getByText('2 de 2 publicados')).toBeInTheDocument();
    expect(screen.getByText('100%')).toHaveClass('text-emerald-600');
  });
```

Run: `npx vitest run src/components/ui/StatCard.test.tsx` — expected FAIL.

- [ ] **Step 6: Extend `StatCard`**

Replace `src/components/ui/StatCard.tsx` with:

```tsx
import { Card } from './Card';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  caption?: string;
  valueClassName?: string;
}

export function StatCard({ label, value, change, caption, valueClassName }: StatCardProps) {
  return (
    <Card className="p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={cn('text-2xl font-semibold text-slate-800', valueClassName)}>{value}</p>
      {caption && <p className="mt-0.5 text-xs text-slate-400">{caption}</p>}
      {change && <p className="text-xs text-emerald-600">{change}</p>}
    </Card>
  );
}
```

Run: `npx vitest run src/components/ui/StatCard.test.tsx` — expected PASS.

- [ ] **Step 7: Full test run and commit**

```bash
npx vitest run
git add src/components/ui/Badge.tsx src/components/ui/Badge.test.tsx src/components/ui/SegmentedControl.tsx src/components/ui/SegmentedControl.test.tsx src/components/ui/StatCard.tsx src/components/ui/StatCard.test.tsx
git commit -m "feat: extend Badge, SegmentedControl and StatCard for Fase 3b screens"
```

---

## Task 6: Extend `KanbanBoard` and `MasterDetailList`

**Files:**
- Modify: `src/components/ui/KanbanBoard.tsx`
- Modify: `src/components/ui/KanbanBoard.test.tsx`
- Modify: `src/components/ui/MasterDetailList.tsx`
- Modify: `src/components/ui/MasterDetailList.test.tsx`

**Interfaces:**
- `KanbanColumn` count becomes plain text (`text-xs font-medium text-slate-400`, no pill) — pixel-verified; accents/`border-t-4` are already correct and stay.
- `MasterDetailList` gains: optional controlled selection (`selectedId`, `onSelect`), `listTop?: ReactNode` (rendered above the list card, left column), `detailOverride?: ReactNode` (replaces the detail panel content — used by the "Nueva cuenta" form), selected-row highlight `bg-brand-50/60` (pixel-verified `#FAF8FD`), left column widened to 400px, top-aligned panels.

- [ ] **Step 1: Update the Kanban test (also removes a real brand name from the repo)**

Replace `src/components/ui/KanbanBoard.test.tsx` content — the current file leaks the real "59FIFTY Madrid" string, which violates the neutrality constraint:

```tsx
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { KanbanBoard, KanbanCard } from './KanbanBoard';

describe('KanbanBoard', () => {
  it('renders columns with plain-text counts and an empty-state dash when there are no items', () => {
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
            children: <KanbanCard>Acción de prensa Cliente A</KanbanCard>,
          },
        ]}
      />
    );

    expect(screen.getByText('Planificada')).toBeInTheDocument();
    expect(screen.getByText('—')).toBeInTheDocument();
    expect(screen.getByText('Acción de prensa Cliente A')).toBeInTheDocument();
    expect(screen.getByText('1')).not.toHaveClass('bg-slate-100');
  });
});
```

Run: `npx vitest run src/components/ui/KanbanBoard.test.tsx` — expected FAIL (count still has `bg-slate-100`).

- [ ] **Step 2: Update `KanbanColumn`**

In `src/components/ui/KanbanBoard.tsx`, replace the count `<span>`:

```tsx
        {count !== undefined && (
          <span className="text-xs font-medium text-slate-400">{count}</span>
        )}
```

Run: `npx vitest run src/components/ui/KanbanBoard.test.tsx` — expected PASS.

- [ ] **Step 3: Update the MasterDetailList test**

Replace `src/components/ui/MasterDetailList.test.tsx` with:

```tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MasterDetailList } from './MasterDetailList';

interface Item {
  id: string;
  name: string;
}

const items: Item[] = [
  { id: '1', name: 'Cliente A' },
  { id: '2', name: 'Cliente B' },
];

describe('MasterDetailList', () => {
  it('shows the empty state until an item is selected, then renders its detail', () => {
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

  it('supports controlled selection, listTop content and a detail override', () => {
    const onSelect = vi.fn();
    const { rerender } = render(
      <MasterDetailList
        items={items}
        selectedId="2"
        onSelect={onSelect}
        listTop={<button type="button">+ Nueva cuenta</button>}
        renderRow={(item) => <span>{item.name}</span>}
        renderDetail={(item) => <p>Detalle de {item.name}</p>}
      />
    );

    expect(screen.getByText('+ Nueva cuenta')).toBeInTheDocument();
    expect(screen.getByText('Detalle de Cliente B')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Cliente A'));
    expect(onSelect).toHaveBeenCalledWith('1');

    rerender(
      <MasterDetailList
        items={items}
        selectedId={null}
        onSelect={onSelect}
        detailOverride={<p>Formulario de alta</p>}
        renderRow={(item) => <span>{item.name}</span>}
        renderDetail={(item) => <p>Detalle de {item.name}</p>}
      />
    );
    expect(screen.getByText('Formulario de alta')).toBeInTheDocument();
  });
});
```

Run: `npx vitest run src/components/ui/MasterDetailList.test.tsx` — expected FAIL (new props unknown).

- [ ] **Step 4: Extend `MasterDetailList`**

Replace `src/components/ui/MasterDetailList.tsx` with:

```tsx
import { useState } from 'react';
import { Card } from './Card';
import { cn } from '@/lib/utils';

export interface MasterDetailListProps<T extends { id: string }> {
  items: T[];
  renderRow: (item: T, isSelected: boolean) => React.ReactNode;
  renderDetail: (item: T) => React.ReactNode;
  emptyState?: string;
  className?: string;
  /** Controlled selection. When omitted, selection is internal state. */
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  /** Rendered above the list card in the left column (e.g. a create button + filters). */
  listTop?: React.ReactNode;
  /** When provided, replaces the right panel entirely (e.g. a creation form). */
  detailOverride?: React.ReactNode;
}

export function MasterDetailList<T extends { id: string }>({
  items,
  renderRow,
  renderDetail,
  emptyState = 'Selecciona un elemento o crea uno nuevo.',
  className,
  selectedId: controlledSelectedId,
  onSelect,
  listTop,
  detailOverride,
}: MasterDetailListProps<T>) {
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null);
  const selectedId = controlledSelectedId !== undefined ? controlledSelectedId : internalSelectedId;
  const selected = items.find((item) => item.id === selectedId) ?? null;

  const handleSelect = (id: string) => {
    if (onSelect) {
      onSelect(id);
    } else {
      setInternalSelectedId(id);
    }
  };

  return (
    <div className={cn('grid items-start gap-6 lg:grid-cols-[400px_1fr]', className)}>
      <div className="space-y-4">
        {listTop}
        <Card className="divide-y divide-slate-100 p-0">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.id)}
              className={cn(
                'block w-full px-4 py-3 text-left transition-colors hover:bg-slate-50',
                selectedId === item.id && 'bg-brand-50/60'
              )}
            >
              {renderRow(item, selectedId === item.id)}
            </button>
          ))}
        </Card>
      </div>
      {detailOverride ? (
        <Card className="p-6">{detailOverride}</Card>
      ) : selected ? (
        <Card className="p-6">{renderDetail(selected)}</Card>
      ) : (
        <Card className="flex min-h-[200px] items-center justify-center p-6">
          <p className="text-slate-400">{emptyState}</p>
        </Card>
      )}
    </div>
  );
}
```

Run: `npx vitest run src/components/ui/MasterDetailList.test.tsx` — expected PASS (2 tests).

- [ ] **Step 5: Full test run and commit**

```bash
npx vitest run
git add src/components/ui/KanbanBoard.tsx src/components/ui/KanbanBoard.test.tsx src/components/ui/MasterDetailList.tsx src/components/ui/MasterDetailList.test.tsx
git commit -m "feat: extend KanbanBoard and MasterDetailList for Fase 3b layouts"
```

---

## Task 7: Types + MockRepository fixtures (capture-exact numbers)

**Files:**
- Modify: `src/types/index.ts`
- Modify: `src/repositories/MockRepository.ts`
- Modify: `src/repositories/MockRepository.fase3.test.ts`
- Modify: `src/features/etra/pages/SeedingPage.tsx` (minimal compile fix only — full rewrite comes in Tasks 11-13)

**Interfaces:**
- Produces the extended domain types from spec §4 and fixtures that reproduce the captures exactly: one in-progress action of 10.000 € at 20% with 4 budget lines summing 3540; 3 deliveries / 4 pieces / 2 published; account billing Ene-Jul 2026 with retainer 5500 and a 2000 € commission in July; obligation "Notas de prensa 0/4"; coverage worth 1000 €.
- **Breaking type change:** `Delivery` loses `tags`/`amount` (replaced by `method`/`status`/`published`/`cost`/`piecesCount`) and `DeliveryTag` is deleted; `SeedingReportRow` gains required `reach`; `PrAccount` gains required `obligations`/`coverage`/`billing`. `SeedingPage` is patched in this task so the build stays green.

- [ ] **Step 1: Update the fixture test to the new shape**

Replace the body of `describe('MockRepository — Comunicación & PR', ...)` in `src/repositories/MockRepository.fase3.test.ts` with:

```ts
  it('returns the PR dashboard with kpis and activity lists', async () => {
    const repo = new MockRepository();
    const data = await repo.getPrDashboard();
    expect(data.activeAccounts).toBe(2);
    expect(data.upcomingActions.length).toBeGreaterThan(0);
    expect(data.recentCoverage.length).toBeGreaterThan(0);
  });

  it('returns the capture-exact in-progress action with budget lines summing 3540', async () => {
    const repo = new MockRepository();
    const actions = await repo.getPrActions();
    expect(actions).toHaveLength(1);
    const [action] = actions;
    expect(action.status).toBe('in-progress');
    expect(action.amount).toBe(10000);
    expect(action.commissionPct).toBe(20);
    const spent = (action.budgetLines ?? []).reduce((sum, line) => sum + line.amount, 0);
    expect(spent).toBe(3540);
  });

  it('returns 3 deliveries with 4 pieces and 2 published MRW shipments', async () => {
    const repo = new MockRepository();
    const deliveries = await repo.getDeliveries();
    expect(deliveries).toHaveLength(3);
    expect(deliveries.reduce((sum, d) => sum + d.piecesCount, 0)).toBe(4);
    expect(deliveries.filter((d) => d.published)).toHaveLength(2);
    expect(deliveries.filter((d) => d.method === 'internal')).toHaveLength(1);
  });

  it('returns accounts with obligations, coverage and monthly billing', async () => {
    const repo = new MockRepository();
    const [account] = await repo.getPrAccounts();
    expect(account.obligations[0]).toMatchObject({ label: 'Notas de prensa', done: 0, target: 4 });
    expect(account.coverage[0].value).toBe(1000);
    expect(account.billing.defaultRetainer).toBe(5500);
    expect(account.billing.months).toHaveLength(7);
    const retainerTotal = account.billing.months.reduce((sum, m) => sum + m.retainer, 0);
    expect(retainerTotal).toBe(38500);
  });

  it('returns inventory, influencers and a seeding report with reach', async () => {
    const repo = new MockRepository();
    expect((await repo.getInventory()).length).toBeGreaterThan(0);
    const influencers = await repo.getInfluencers();
    expect(influencers[0].email).toBeTruthy();
    const report = await repo.getSeedingReport();
    expect(report.length).toBeGreaterThan(0);
    expect(report[0]).toHaveProperty('reach');
  });
```

Run: `npx vitest run src/repositories/MockRepository.fase3.test.ts` — expected FAIL.

- [ ] **Step 2: Extend the types**

In `src/types/index.ts`, replace the `PrAction` block (keep `ActionStatus` as is) with:

```ts
export type ActionStatus = 'planned' | 'in-progress' | 'done' | 'cancelled';
export type BudgetLineStatus = 'proposed' | 'pending-payment' | 'paid';
export interface ActionBudgetLine {
  id: string;
  description: string;
  amount: number;
  status: BudgetLineStatus;
}
export interface PrAction {
  id: string;
  title: string;
  account: string;
  type: string;
  amount: number;
  status: ActionStatus;
  date: string;
  responsible?: string;
  commissionPct?: number;
  includedInFee?: boolean;
  budgetLines?: ActionBudgetLine[];
}
```

Replace the `DeliveryTag`/`Delivery` block with:

```ts
export type DeliveryMethod = 'mrw' | 'hand' | 'internal';
export type DeliveryStatus = 'prepared' | 'shipped' | 'delivered';
export interface Delivery {
  id: string;
  date: string;
  account: string;
  method: DeliveryMethod;
  status: DeliveryStatus;
  published: boolean;
  recipient: string;
  itemsSummary: string;
  piecesCount: number;
  cost: number;
}
```

Add `email?: string;` to `Influencer`, and `reach: number | null;` to `SeedingReportRow`.

Replace the `PrAccount` block with:

```ts
export interface AccountObligation {
  id: string;
  label: string;
  cadence: string;
  period: string;
  done: number;
  target: number;
}
export interface CoverageItem {
  id: string;
  date: string;
  title: string;
  outlet: string;
  channel: string;
  value: number;
}
export interface AccountBillingMonth {
  id: string;
  label: string;
  retainer: number;
  commissions: number | null;
  others: number;
}
export type AccountStatus = 'active' | 'paused' | 'inactive';
export interface PrAccount {
  id: string;
  name: string;
  status: AccountStatus;
  manager: string;
  crmClient: string;
  contact: string;
  signupDate?: string;
  email?: string;
  phone?: string;
  notes?: string;
  obligations: AccountObligation[];
  coverage: CoverageItem[];
  billing: {
    defaultRetainer: number;
    defaultCommissionPct: number;
    months: AccountBillingMonth[];
  };
}
```

- [ ] **Step 3: Update the MockRepository fixtures**

In `src/repositories/MockRepository.ts` (imports at the top of the file: remove `DeliveryTag` if imported; the rest already imports the changed interfaces), replace `getPrActions`, `getDeliveries`, `getInfluencers`, `getSeedingReport`, and `getPrAccounts` with:

```ts
  async getPrActions(): Promise<PrAction[]> {
    return this.delay([
      {
        id: 'act1',
        title: 'Acción de prensa Cliente A',
        account: 'Cliente A',
        type: 'Evento',
        amount: 10000,
        status: 'in-progress',
        date: '16 jul 2026',
        responsible: 'Sin asignar',
        commissionPct: 20,
        includedInFee: true,
        budgetLines: [
          { id: 'bl1', description: 'Foto / Vídeo (Ana)', amount: 400, status: 'paid' },
          { id: 'bl2', description: 'Staff', amount: 140, status: 'pending-payment' },
          { id: 'bl3', description: 'Talent', amount: 1500, status: 'pending-payment' },
          { id: 'bl4', description: 'Talent', amount: 1500, status: 'proposed' },
        ],
      },
    ]);
  }

  async getDeliveries(): Promise<Delivery[]> {
    return this.delay([
      {
        id: 'del1',
        date: '07 jul 2026',
        account: 'Cliente A',
        method: 'internal',
        status: 'delivered',
        published: false,
        recipient: 'Ana López',
        itemsSummary: '1× Gorra Edición Limitada · 8',
        piecesCount: 1,
        cost: 0,
      },
      {
        id: 'del2',
        date: '07 jul 2026',
        account: 'Cliente A',
        method: 'mrw',
        status: 'delivered',
        published: true,
        recipient: 'Carlos Ruiz',
        itemsSummary: '2× Gorra Edición Limitada · 8',
        piecesCount: 2,
        cost: 0,
      },
      {
        id: 'del3',
        date: '06 jul 2026',
        account: 'Cliente A',
        method: 'mrw',
        status: 'delivered',
        published: true,
        recipient: 'Carlos Ruiz',
        itemsSummary: '1× Gorra Edición Limitada · 8',
        piecesCount: 1,
        cost: 0,
      },
    ]);
  }

  async getInfluencers(): Promise<Influencer[]> {
    return this.delay([
      {
        id: 'inf1',
        name: 'Carlos Ruiz',
        initials: 'CR',
        instagramFollowers: 245000,
        tiktokFollowers: 26200,
        email: 'carlos.ruiz@example.com',
      },
      { id: 'inf2', name: 'María García', initials: 'MG', instagramFollowers: 335000 },
    ]);
  }

  async getSeedingReport(): Promise<SeedingReportRow[]> {
    return this.delay([
      { date: '07 jul 2026', influencer: 'Carlos Ruiz', pieces: 2, productCost: 0, shippingCost: 0, publicationStatus: 'Publicado', reach: null },
      { date: '06 jul 2026', influencer: 'Carlos Ruiz', pieces: 1, productCost: 0, shippingCost: 0, publicationStatus: 'Publicado', reach: null },
    ]);
  }

  async getPrAccounts(): Promise<PrAccount[]> {
    return this.delay([
      {
        id: 'acc1',
        name: 'Cliente A',
        status: 'active',
        manager: 'Ana López',
        crmClient: 'Cliente A',
        contact: 'Jack Contacto',
        signupDate: '01 ene 2026',
        email: 'contacto@cliente-a.example.com',
        phone: '+34 600 000 001',
        obligations: [
          { id: 'ob1', label: 'Notas de prensa', cadence: 'Mensual', period: '2026-07', done: 0, target: 4 },
        ],
        coverage: [
          { id: 'cov1', date: '08 jul 2026', title: 'Mención en medios', outlet: 'Prensa Digital', channel: 'Online', value: 1000 },
        ],
        billing: {
          defaultRetainer: 5500,
          defaultCommissionPct: 20,
          months: [
            { id: 'm7', label: 'Jul 2026', retainer: 5500, commissions: 2000, others: 0 },
            { id: 'm6', label: 'Jun 2026', retainer: 5500, commissions: null, others: 0 },
            { id: 'm5', label: 'May 2026', retainer: 5500, commissions: null, others: 0 },
            { id: 'm4', label: 'Abr 2026', retainer: 5500, commissions: null, others: 0 },
            { id: 'm3', label: 'Mar 2026', retainer: 5500, commissions: null, others: 0 },
            { id: 'm2', label: 'Feb 2026', retainer: 5500, commissions: null, others: 0 },
            { id: 'm1', label: 'Ene 2026', retainer: 5500, commissions: null, others: 0 },
          ],
        },
      },
      {
        id: 'acc2',
        name: 'Cliente B',
        status: 'active',
        manager: 'Carlos Ruiz',
        crmClient: 'Cliente B',
        contact: 'Laura Contacto',
        obligations: [],
        coverage: [],
        billing: { defaultRetainer: 0, defaultCommissionPct: 20, months: [] },
      },
    ]);
  }
```

Note: `getInventory`, `getPrDashboard`, and `getProductionEvents` are unchanged.

- [ ] **Step 4: Minimal compile fix in `SeedingPage`**

The `entregas` block still uses the removed `tags`/`DELIVERY_TAG_LABEL`. In `src/features/etra/pages/SeedingPage.tsx`:

1. Delete the `DELIVERY_TAG_LABEL` constant and the `import type { DeliveryTag } from '@/types';` line.
2. Replace the tag-badges block inside the entregas map with:

```tsx
                {delivery.method === 'internal' ? (
                  <Badge variant="amber" size="sm">Uso interno</Badge>
                ) : (
                  <Badge variant="sky" size="sm">Envío MRW</Badge>
                )}
                {delivery.method !== 'internal' && delivery.status === 'delivered' && (
                  <Badge variant="emerald" size="sm">Entregado</Badge>
                )}
                {delivery.published && <Badge variant="emerald" size="sm">Publicado</Badge>}
```

(This is throwaway glue — Task 11 rewrites the whole tab.)

- [ ] **Step 5: Verify everything is green**

```bash
npx tsc --noEmit && npx vitest run
```

Expected: type-check clean, all tests pass (including the updated fase3 fixture tests).

- [ ] **Step 6: Commit**

```bash
git add src/types/index.ts src/repositories/MockRepository.ts src/repositories/MockRepository.fase3.test.ts src/features/etra/pages/SeedingPage.tsx
git commit -m "feat: extend PR domain types and fixtures with capture-exact Fase 3b data"
```

---

## Task 8: EtraShell "Resumen" tab

**Files:**
- Modify: `src/features/modules/EtraShell.tsx`
- Modify: `src/components/layout/TopNav.tsx`

**Interfaces:**
- The reference nav shows 4 tabs: **Resumen · Acciones · Seeding · Cuentas**. "Resumen" points at `/etra` and must only be active on the index route, so `TopNav`'s hardcoded `end={tab.href === '/conceptone'}` is generalized to also match the module's own href.

- [ ] **Step 1: Add the tab**

In `src/features/modules/EtraShell.tsx` replace the `tabs` array with:

```tsx
const tabs = [
  { label: 'Resumen', href: '/etra' },
  { label: 'Acciones', href: '/etra/tareas' },
  { label: 'Seeding', href: '/etra/seeding' },
  { label: 'Cuentas', href: '/etra/cuentas' },
];
```

- [ ] **Step 2: Generalize NavLink `end` matching**

In `src/components/layout/TopNav.tsx` line 47, replace:

```tsx
                  end={tab.href === '/conceptone'}
```

with:

```tsx
                  end={tab.href === '/conceptone' || tab.href === module.href}
```

(ConceptOne passes no `module.href`, so its behaviour is unchanged; Etra passes `href: '/etra'`, making "Resumen" exact-match.)

- [ ] **Step 3: Verify manually and run tests**

```bash
npx vitest run
```

Expected: PASS. Optionally `npm run dev` and check `/etra/tareas` shows "Resumen" inactive, "Acciones" active.

- [ ] **Step 4: Commit**

```bash
git add src/features/modules/EtraShell.tsx src/components/layout/TopNav.tsx
git commit -m "feat: add Resumen tab to Etra shell nav"
```

---

## Task 9: Acciones page — subtitle, filters, inline "Nueva tarea" panel, richer cards

**Files:**
- Create: `src/features/etra/components/NewActionPanel.tsx`
- Create: `src/features/etra/components/ActionKanbanCard.tsx`
- Create: `src/features/etra/components/index.ts`
- Create: `src/features/etra/pages/ActionsPage.test.tsx`
- Modify: `src/features/etra/pages/ActionsPage.tsx`

**Interfaces:**
- `NewActionPanel({ onClose })` — the inline "Nueva tarea" card. Decorative form; only the X closes it (and the page's toggle button).
- `ActionKanbanCard({ action })` — kanban card that links to `/etra/tareas/${action.id}` and shows `account` badge + plain-text type + amount.

- [ ] **Step 1: Write the failing page test**

```tsx
// src/features/etra/pages/ActionsPage.test.tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { ActionsPage } from './ActionsPage';

vi.mock('../hooks/usePrActions', () => ({
  usePrActions: () => ({
    isLoading: false,
    error: null,
    data: [
      {
        id: 'act1',
        title: 'Acción de prensa Cliente A',
        account: 'Cliente A',
        type: 'Evento',
        amount: 10000,
        status: 'in-progress',
        date: '16 jul 2026',
      },
    ],
  }),
}));

describe('ActionsPage', () => {
  it('toggles the Nueva tarea panel from the header button', () => {
    render(
      <MemoryRouter>
        <ActionsPage />
      </MemoryRouter>
    );
    expect(screen.queryByText('Nueva tarea')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '+ Nueva acción' }));
    expect(screen.getByText('Nueva tarea')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Crear y abrir' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar' }));
    expect(screen.queryByText('Nueva tarea')).not.toBeInTheDocument();
  });

  it('renders the card with amount and links it to the action detail', () => {
    render(
      <MemoryRouter>
        <ActionsPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/Evento · 10\.000,00/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Acción de prensa Cliente A/ })).toHaveAttribute(
      'href',
      '/etra/tareas/act1'
    );
  });
});
```

Run: `npx vitest run src/features/etra/pages/ActionsPage.test.tsx` — expected FAIL.

- [ ] **Step 2: Implement `NewActionPanel`**

```tsx
// src/features/etra/components/NewActionPanel.tsx
import { X } from 'lucide-react';
import { Card, Input, Select, Button } from '@/components/ui';

export function NewActionPanel({ onClose }: { onClose: () => void }) {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-slate-800">Nueva tarea</h2>
        <button
          type="button"
          aria-label="Cerrar"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <Input label="Título" />
        </div>
        <Select label="Cuenta" defaultValue="">
          <option value="">Selecciona...</option>
          <option>Cliente A</option>
          <option>Cliente B</option>
        </Select>
        <Select label="Tipo" defaultValue="Nota de prensa">
          <option>Nota de prensa</option>
          <option>Evento</option>
          <option>Campaña</option>
        </Select>
        <Select label="Responsable" defaultValue="Sin asignar">
          <option>Sin asignar</option>
          <option>Ana López</option>
          <option>Carlos Ruiz</option>
        </Select>
        <Input label="Fecha límite" type="date" />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            defaultChecked
            className="h-4 w-4 rounded border-slate-300 text-brand-600"
          />
          Incluida en el fee
        </label>
        <Button>Crear y abrir</Button>
      </div>
    </Card>
  );
}
```

- [ ] **Step 3: Implement `ActionKanbanCard`**

```tsx
// src/features/etra/components/ActionKanbanCard.tsx
import { Link } from 'react-router';
import { KanbanCard, Badge } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import type { PrAction } from '@/types';

export function ActionKanbanCard({ action }: { action: PrAction }) {
  return (
    <Link to={`/etra/tareas/${action.id}`} className="block">
      <KanbanCard className="transition-shadow hover:shadow-md">
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium text-slate-800">{action.title}</p>
          <span className="shrink-0 text-xs text-slate-400">{action.date}</span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <Badge variant="neutral" size="sm">{action.account}</Badge>
          <span>
            {action.type}
            {action.amount > 0 && <> · {formatCurrency(action.amount)}</>}
          </span>
        </div>
      </KanbanCard>
    </Link>
  );
}
```

- [ ] **Step 4: Create the components barrel**

```ts
// src/features/etra/components/index.ts
export * from './NewActionPanel';
export * from './ActionKanbanCard';
```

- [ ] **Step 5: Rewrite `ActionsPage`**

```tsx
// src/features/etra/pages/ActionsPage.tsx
import { useState } from 'react';
import { KanbanBoard, Select } from '@/components/ui';
import { NewActionPanel, ActionKanbanCard } from '../components';
import { usePrActions } from '../hooks/usePrActions';
import type { ActionStatus } from '@/types';

const COLUMNS: { id: ActionStatus; label: string; accentClassName: string }[] = [
  { id: 'planned', label: 'Planificada', accentClassName: 'border-t-blue-400' },
  { id: 'in-progress', label: 'En curso', accentClassName: 'border-t-amber-400' },
  { id: 'done', label: 'Hecha', accentClassName: 'border-t-emerald-400' },
  { id: 'cancelled', label: 'Cancelada', accentClassName: 'border-t-slate-300' },
];

export function ActionsPage() {
  const { data, isLoading, error } = usePrActions();
  const [showNewPanel, setShowNewPanel] = useState(false);

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
              <ActionKanbanCard key={action.id} action={action} />
            ))}
          </>
        ) : undefined,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Acciones</h1>
          <p className="text-sm text-slate-500">
            El trabajo diario del equipo de PR. Arrastra las tarjetas para cambiar su estado.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowNewPanel((open) => !open)}
          className="inline-flex h-9 items-center rounded-lg bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700"
        >
          + Nueva acción
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Select className="w-auto">
          <option>Todas las cuentas</option>
        </Select>
        <Select className="w-auto">
          <option>Cualquier responsable</option>
        </Select>
        <Select className="w-auto">
          <option>Todos los tipos</option>
        </Select>
        <label className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-600">
          <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-brand-600" />
          Solo mías
        </label>
      </div>
      {showNewPanel && <NewActionPanel onClose={() => setShowNewPanel(false)} />}
      <KanbanBoard columns={columns} />
    </div>
  );
}
```

- [ ] **Step 6: Run the tests**

Run: `npx vitest run src/features/etra/pages/ActionsPage.test.tsx`
Expected: PASS (2 tests). Then `npx vitest run` — all green.

- [ ] **Step 7: Commit**

```bash
git add src/features/etra/components src/features/etra/pages/ActionsPage.tsx src/features/etra/pages/ActionsPage.test.tsx
git commit -m "feat: rebuild Acciones page with Nueva tarea panel and linked kanban cards"
```

---

## Task 10: Action detail page (`/etra/tareas/:actionId`)

**Files:**
- Create: `src/features/etra/components/ActionBreakdownCard.tsx`
- Create: `src/features/etra/components/ActionCommentsCard.tsx`
- Create: `src/features/etra/pages/ActionDetailPage.tsx`
- Create: `src/features/etra/pages/ActionDetailPage.test.tsx`
- Modify: `src/features/etra/components/index.ts`
- Modify: `src/app/router.tsx`

**Interfaces:**
- `ActionBreakdownCard({ action })` — derives `commission = amount × commissionPct/100`, `available = amount − commission`, `spent = Σ budgetLines` (proposals **included** — capture shows 3540), `remaining = available − spent`. Five stat boxes, progress bar, one row per line, add-line row.
- `ActionCommentsCard()` — static comments card.
- `ActionDetailPage` — reads `:actionId` with `useParams`, finds the action in `usePrActions()` data; unknown id → "Acción no encontrada." + back link.

- [ ] **Step 1: Write the failing page test**

```tsx
// src/features/etra/pages/ActionDetailPage.test.tsx
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { ActionDetailPage } from './ActionDetailPage';

vi.mock('../hooks/usePrActions', () => ({
  usePrActions: () => ({
    isLoading: false,
    error: null,
    data: [
      {
        id: 'act1',
        title: 'Acción de prensa Cliente A',
        account: 'Cliente A',
        type: 'Evento',
        amount: 10000,
        status: 'in-progress',
        date: '16 jul 2026',
        responsible: 'Sin asignar',
        commissionPct: 20,
        includedInFee: true,
        budgetLines: [
          { id: 'bl1', description: 'Foto / Vídeo (Ana)', amount: 400, status: 'paid' },
          { id: 'bl2', description: 'Staff', amount: 140, status: 'pending-payment' },
          { id: 'bl3', description: 'Talent', amount: 1500, status: 'pending-payment' },
          { id: 'bl4', description: 'Talent', amount: 1500, status: 'proposed' },
        ],
      },
    ],
  }),
}));

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/etra/tareas/:actionId" element={<ActionDetailPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('ActionDetailPage', () => {
  it('renders the capture-exact breakdown figures', () => {
    renderAt('/etra/tareas/act1');
    expect(screen.getByText('Desglose de la activación')).toBeInTheDocument();
    expect(screen.getByText('10.000,00 €')).toBeInTheDocument(); // Budget
    expect(screen.getByText('8000,00 €')).toBeInTheDocument(); // Disponible
    expect(screen.getByText('4460,00 €')).toBeInTheDocument(); // Restante
    expect(screen.getByText(/Queda 4460,00 € de 8000,00 €/)).toBeInTheDocument();
    expect(screen.getByText('Comentarios')).toBeInTheDocument();
  });

  it('shows a not-found state for unknown ids', () => {
    renderAt('/etra/tareas/nope');
    expect(screen.getByText('Acción no encontrada.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Volver a acciones/ })).toBeInTheDocument();
  });
});
```

Run: `npx vitest run src/features/etra/pages/ActionDetailPage.test.tsx` — expected FAIL.

- [ ] **Step 2: Implement `ActionBreakdownCard`**

```tsx
// src/features/etra/components/ActionBreakdownCard.tsx
import { MessageCircle, Paperclip, X } from 'lucide-react';
import { Card, Input, Select, Button, ProgressBar } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { PrAction, BudgetLineStatus } from '@/types';

const LINE_STATUS: Record<BudgetLineStatus, { label: string; className: string }> = {
  paid: { label: 'Abonado', className: 'bg-emerald-100 text-emerald-700' },
  'pending-payment': { label: 'Pendiente abonar', className: 'bg-amber-100 text-amber-700' },
  proposed: { label: 'Propuesto', className: 'bg-white text-slate-700' },
};

export function ActionBreakdownCard({ action }: { action: PrAction }) {
  const budget = action.amount;
  const commissionPct = action.commissionPct ?? 0;
  const commission = (budget * commissionPct) / 100;
  const available = budget - commission;
  const lines = action.budgetLines ?? [];
  const spent = lines.reduce((sum, line) => sum + line.amount, 0);
  const remaining = available - spent;

  const boxes = [
    { label: 'Budget', value: formatCurrency(budget), boxClassName: '', valueClassName: 'text-slate-800' },
    { label: `Comisión agencia (${commissionPct}%)`, value: formatCurrency(-commission), boxClassName: '', valueClassName: 'text-slate-800' },
    { label: 'Disponible', value: formatCurrency(available), boxClassName: 'border-blue-100 bg-blue-50', valueClassName: 'text-blue-700' },
    { label: 'Gastado', value: formatCurrency(-spent), boxClassName: '', valueClassName: 'text-slate-800' },
    { label: 'Restante', value: formatCurrency(remaining), boxClassName: 'border-emerald-100 bg-emerald-50', valueClassName: 'text-emerald-700' },
  ];

  return (
    <Card className="space-y-5 p-6">
      <h2 className="font-semibold text-slate-800">Desglose de la activación</h2>

      <div className="grid gap-3 md:grid-cols-5">
        {boxes.map((box) => (
          <div
            key={box.label}
            className={cn('rounded-xl border border-slate-100 p-4 text-center', box.boxClassName)}
          >
            <p className={cn('font-semibold', box.valueClassName)}>{box.value}</p>
            <p className="mt-1 text-xs text-slate-500">{box.label}</p>
          </div>
        ))}
      </div>

      <div>
        <ProgressBar value={spent} max={available} />
        <div className="mt-1.5 flex items-center justify-between text-xs text-slate-400">
          <span>Gastado {formatCurrency(spent)}</span>
          <span>
            Queda {formatCurrency(remaining)} de {formatCurrency(available)}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {lines.map((line) => (
          <div key={line.id} className="flex items-center gap-3">
            <div className="flex h-10 flex-1 items-center rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-800">
              {line.description}
            </div>
            <div className="flex h-10 w-28 items-center justify-end rounded-lg border border-slate-200 px-3 text-sm text-slate-800">
              {line.amount}
            </div>
            <span className="text-sm text-slate-400">€</span>
            <Select
              defaultValue={line.status}
              className={cn('h-9 w-44', LINE_STATUS[line.status].className)}
            >
              <option value="paid">Abonado</option>
              <option value="pending-payment">Pendiente abonar</option>
              <option value="proposed">Propuesto</option>
            </Select>
            <button type="button" aria-label="Comentar línea" className="text-slate-300 hover:text-slate-500">
              <MessageCircle className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600"
            >
              <Paperclip className="h-3.5 w-3.5" />
              adjuntar
            </button>
            <button type="button" aria-label="Eliminar línea" className="text-slate-300 hover:text-slate-500">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="space-y-3 border-t border-slate-100 pt-4">
        <div className="grid gap-3 md:grid-cols-[2fr_1fr_1.2fr_1.2fr_1.2fr]">
          <Input placeholder="Descripción" />
          <Input defaultValue="0" />
          <Select defaultValue="proposed">
            <option value="proposed">Propuesto</option>
            <option value="pending-payment">Pendiente abonar</option>
            <option value="paid">Abonado</option>
          </Select>
          <Input placeholder="Proveedor" />
          <Input placeholder="Enlace" />
        </div>
        <div className="flex gap-3">
          <Input placeholder="Notas internas (opcional)" className="flex-1" />
          <Button>Añadir línea</Button>
        </div>
      </div>
    </Card>
  );
}
```

- [ ] **Step 3: Implement `ActionCommentsCard`**

```tsx
// src/features/etra/components/ActionCommentsCard.tsx
import { Card, Textarea, Button } from '@/components/ui';

export function ActionCommentsCard() {
  return (
    <Card className="space-y-4 p-6">
      <h2 className="font-semibold text-slate-800">Comentarios</h2>
      <p className="text-sm text-slate-500">Sin comentarios. Menciona a alguien con @Nombre.</p>
      <div className="flex items-end gap-3">
        <Textarea
          placeholder="Escribe un comentario... usa @Nombre para mencionar"
          className="flex-1"
        />
        <Button>Enviar</Button>
      </div>
    </Card>
  );
}
```

- [ ] **Step 4: Implement `ActionDetailPage`**

```tsx
// src/features/etra/pages/ActionDetailPage.tsx
import { Link, useParams } from 'react-router';
import { Card, Badge, Button } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import { ActionBreakdownCard, ActionCommentsCard } from '../components';
import { usePrActions } from '../hooks/usePrActions';
import type { ActionStatus } from '@/types';

const STATUS_LABEL: Record<ActionStatus, { label: string; variant: 'blue' | 'amber' | 'emerald' | 'neutral' }> = {
  planned: { label: 'Planificada', variant: 'blue' },
  'in-progress': { label: 'En curso', variant: 'amber' },
  done: { label: 'Hecha', variant: 'emerald' },
  cancelled: { label: 'Cancelada', variant: 'neutral' },
};

export function ActionDetailPage() {
  const { actionId } = useParams();
  const { data, isLoading, error } = usePrActions();

  if (isLoading) {
    return <div className="py-12 text-center text-slate-500">Cargando...</div>;
  }

  if (error || !data) {
    return <div className="py-12 text-center text-red-600">Error: {error || 'No data'}</div>;
  }

  const backLink = (
    <Link to="/etra/tareas" className="text-sm text-slate-500 hover:text-slate-700">
      ← Volver a acciones
    </Link>
  );

  const action = data.find((item) => item.id === actionId);
  if (!action) {
    return (
      <div className="space-y-6">
        {backLink}
        <p className="py-12 text-center text-slate-400">Acción no encontrada.</p>
      </div>
    );
  }

  const status = STATUS_LABEL[action.status];

  return (
    <div className="space-y-6">
      {backLink}

      <Card className="flex items-start justify-between p-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">{action.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
            <Badge variant={status.variant}>{status.label}</Badge>
            <span className="text-slate-600">{action.type}</span>
            <span className="text-slate-400">
              Responsable: <span className="text-slate-600">{action.responsible ?? 'Sin asignar'}</span>
            </span>
            <span className="text-slate-400">
              Límite: <span className="text-slate-600">{action.date}</span>
            </span>
            {action.amount > 0 && (
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                Budget {formatCurrency(action.amount)} · {action.commissionPct ?? 0}%
              </span>
            )}
          </div>
        </div>
        <Button variant="secondary" size="sm">Modificar acción</Button>
      </Card>

      <ActionBreakdownCard action={action} />
      <ActionCommentsCard />
    </div>
  );
}
```

- [ ] **Step 5: Export and route**

Add to `src/features/etra/components/index.ts`:

```ts
export * from './ActionBreakdownCard';
export * from './ActionCommentsCard';
```

In `src/app/router.tsx`, import the page and add the route inside the `/etra` block after the `tareas` route:

```tsx
import { ActionDetailPage } from '@/features/etra/pages/ActionDetailPage';
// ...
        <Route path="tareas/:actionId" element={<ActionDetailPage />} />
```

- [ ] **Step 6: Run the tests**

Run: `npx vitest run src/features/etra/pages/ActionDetailPage.test.tsx` — expected PASS (2 tests). Then `npx vitest run` — all green.

- [ ] **Step 7: Commit**

```bash
git add src/features/etra/components src/features/etra/pages/ActionDetailPage.tsx src/features/etra/pages/ActionDetailPage.test.tsx src/app/router.tsx
git commit -m "feat: add action detail page with activation breakdown and comments"
```

---

## Task 11: Seeding — underline tabs + rich Entregas tab

**Files:**
- Create: `src/features/etra/components/DeliveryRow.tsx`
- Create: `src/features/etra/components/DeliveryFormModal.tsx`
- Create: `src/features/etra/components/SeedingDeliveriesTab.tsx`
- Create: `src/features/etra/pages/SeedingPage.test.tsx`
- Modify: `src/features/etra/components/index.ts`
- Modify: `src/features/etra/pages/SeedingPage.tsx`

**Interfaces:**
- `SeedingPage` switches from `SegmentedControl` to `UnderlineTabs`; the entregas view moves to `SeedingDeliveriesTab({ deliveries })`.
- `DeliveryRow({ delivery })` — method/status badges (`amber`/`sky`/`emerald`), recipient + info icon + arrow + pieces chip; right side per method (internal → "Editar" + X; otherwise cost + status select + X).
- `DeliveryFormModal({ open, onClose })` — "Nueva entrega" with the 3-way method switcher changing the visible fields.

- [ ] **Step 1: Write the failing test**

```tsx
// src/features/etra/pages/SeedingPage.test.tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SeedingPage } from './SeedingPage';

vi.mock('../hooks/useInventory', () => ({
  useInventory: () => ({
    isLoading: false,
    error: null,
    data: [{ id: 'inv1', name: 'Gorra Edición Limitada', variant: '8 · Rojo', ref: 'REF-0001', quantity: 6 }],
  }),
}));
vi.mock('../hooks/useDeliveries', () => ({
  useDeliveries: () => ({
    isLoading: false,
    error: null,
    data: [
      { id: 'del1', date: '07 jul 2026', account: 'Cliente A', method: 'internal', status: 'delivered', published: false, recipient: 'Ana López', itemsSummary: '1× Gorra Edición Limitada · 8', piecesCount: 1, cost: 0 },
      { id: 'del2', date: '07 jul 2026', account: 'Cliente A', method: 'mrw', status: 'delivered', published: true, recipient: 'Carlos Ruiz', itemsSummary: '2× Gorra Edición Limitada · 8', piecesCount: 2, cost: 0 },
      { id: 'del3', date: '06 jul 2026', account: 'Cliente A', method: 'mrw', status: 'delivered', published: true, recipient: 'Carlos Ruiz', itemsSummary: '1× Gorra Edición Limitada · 8', piecesCount: 1, cost: 0 },
    ],
  }),
}));
vi.mock('../hooks/useInfluencers', () => ({
  useInfluencers: () => ({
    isLoading: false,
    error: null,
    data: [
      { id: 'inf1', name: 'Carlos Ruiz', initials: 'CR', instagramFollowers: 245000, tiktokFollowers: 26200, email: 'carlos.ruiz@example.com' },
      { id: 'inf2', name: 'María García', initials: 'MG', instagramFollowers: 335000 },
    ],
  }),
}));
vi.mock('../hooks/useSeedingReport', () => ({
  useSeedingReport: () => ({
    isLoading: false,
    error: null,
    data: [
      { date: '07 jul 2026', influencer: 'Carlos Ruiz', pieces: 2, productCost: 0, shippingCost: 0, publicationStatus: 'Publicado', reach: null },
      { date: '06 jul 2026', influencer: 'Carlos Ruiz', pieces: 1, productCost: 0, shippingCost: 0, publicationStatus: 'Publicado', reach: null },
    ],
  }),
}));

describe('SeedingPage — Entregas', () => {
  it('shows the stats line and delivery rows on the Entregas tab', () => {
    render(<SeedingPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Entregas' }));

    expect(screen.getByText('3')).toBeInTheDocument(); // entregas count
    expect(screen.getByText(/100%/)).toBeInTheDocument(); // retorno
    expect(screen.getByText('Uso interno')).toBeInTheDocument();
    expect(screen.getAllByText('Envío MRW').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Publicado').length).toBe(2);
  });

  it('opens the Nueva entrega modal and switches fields per method', () => {
    render(<SeedingPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Entregas' }));
    fireEvent.click(screen.getByRole('button', { name: '+ Nueva entrega' }));

    expect(screen.getByText('Nueva entrega')).toBeInTheDocument();
    expect(screen.getByText('Transportista')).toBeInTheDocument(); // MRW default

    fireEvent.click(screen.getByRole('button', { name: 'Uso interno' }));
    expect(screen.queryByText('Transportista')).not.toBeInTheDocument();
    expect(screen.getByText('¿Quién se lo queda? *')).toBeInTheDocument();
  });
});
```

Run: `npx vitest run src/features/etra/pages/SeedingPage.test.tsx` — expected FAIL.

- [ ] **Step 2: Implement `DeliveryRow`**

```tsx
// src/features/etra/components/DeliveryRow.tsx
import { ArrowRight, Info, X } from 'lucide-react';
import { Card, Badge, Button, Select } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import type { Delivery } from '@/types';

export function DeliveryRow({ delivery }: { delivery: Delivery }) {
  return (
    <Card className="flex items-center justify-between gap-4 p-4">
      <div>
        <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span>
            {delivery.date} · {delivery.account}
          </span>
          {delivery.method === 'internal' ? (
            <Badge variant="amber" size="sm">Uso interno</Badge>
          ) : (
            <Badge variant="sky" size="sm">Envío MRW</Badge>
          )}
          {delivery.method !== 'internal' && delivery.status === 'delivered' && (
            <Badge variant="emerald" size="sm">Entregado</Badge>
          )}
          {delivery.published && <Badge variant="emerald" size="sm">Publicado</Badge>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-slate-800">{delivery.recipient}</span>
          {delivery.method !== 'internal' && <Info className="h-3.5 w-3.5 text-slate-300" />}
          <ArrowRight className="h-3.5 w-3.5 text-slate-300" />
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
            {delivery.itemsSummary}
          </span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {delivery.method === 'internal' ? (
          <Button variant="secondary" size="sm">Editar</Button>
        ) : (
          <>
            <span className="text-sm text-slate-500">{formatCurrency(delivery.cost)}</span>
            <Select defaultValue={delivery.status} className="h-9 w-36">
              <option value="prepared">Preparado</option>
              <option value="shipped">Enviado</option>
              <option value="delivered">Entregado</option>
            </Select>
          </>
        )}
        <button type="button" aria-label="Eliminar entrega" className="text-slate-300 hover:text-slate-500">
          <X className="h-4 w-4" />
        </button>
      </div>
    </Card>
  );
}
```

- [ ] **Step 3: Implement `DeliveryFormModal`**

```tsx
// src/features/etra/components/DeliveryFormModal.tsx
import { useState } from 'react';
import { Modal, SegmentedControl, Input, Select, Button } from '@/components/ui';
import type { DeliveryMethod } from '@/types';

const METHOD_OPTIONS: { label: string; value: DeliveryMethod }[] = [
  { label: 'Envío MRW', value: 'mrw' },
  { label: 'Entrega en mano', value: 'hand' },
  { label: 'Uso interno', value: 'internal' },
];

const today = () => new Date().toISOString().slice(0, 10);

export function DeliveryFormModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [method, setMethod] = useState<DeliveryMethod>('mrw');

  return (
    <Modal open={open} onClose={onClose} title="Nueva entrega">
      <div className="space-y-4">
        <div>
          <p className="mb-1.5 text-sm font-medium text-slate-700">Método</p>
          <SegmentedControl fullWidth options={METHOD_OPTIONS} value={method} onChange={setMethod} />
        </div>

        <Input label="Cliente / campaña" placeholder="Cliente (opcional)..." />

        {method === 'internal' ? (
          <div className="space-y-2">
            <Select label="¿Quién se lo queda? *" defaultValue="">
              <option value="">Persona del equipo...</option>
              <option>Ana López</option>
              <option>Carlos Ruiz</option>
            </Select>
            <Input placeholder="...o escribe un nombre" />
          </div>
        ) : (
          <Select label="Influencer *" defaultValue="">
            <option value="">Selecciona...</option>
            <option>Carlos Ruiz</option>
            <option>María García</option>
          </Select>
        )}

        <div>
          <p className="mb-1.5 text-sm font-medium text-slate-700">Piezas</p>
          <div className="flex gap-3">
            <Select defaultValue="" className="flex-1">
              <option value="">Referencia...</option>
              <option>REF-0001 · Gorra Edición Limitada</option>
            </Select>
            <Input defaultValue="1" className="w-20" />
          </div>
          <button type="button" className="mt-2 text-sm text-brand-600 hover:text-brand-700">
            + Añadir pieza
          </button>
        </div>

        {method === 'internal' ? (
          <Input label="Fecha" type="date" defaultValue={today()} />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Input label="Fecha" type="date" defaultValue={today()} />
            <Select label="Estado" defaultValue="prepared">
              <option value="prepared">Preparado</option>
              <option value="shipped">Enviado</option>
              <option value="delivered">Entregado</option>
            </Select>
          </div>
        )}

        {method === 'mrw' && (
          <div className="grid grid-cols-3 gap-3">
            <Input label="Transportista" defaultValue="MRW" />
            <Input label="Tracking" />
            <Input label="Coste (€)" defaultValue="0" />
          </div>
        )}

        <Input label={method === 'hand' ? 'Notas (lugar / evento...)' : 'Notas'} />

        <div className="flex gap-3">
          <Button>Crear entrega</Button>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        </div>
      </div>
    </Modal>
  );
}
```

- [ ] **Step 4: Implement `SeedingDeliveriesTab`**

```tsx
// src/features/etra/components/SeedingDeliveriesTab.tsx
import { useState } from 'react';
import { Card, Input, Select, Button } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import { DeliveryRow } from './DeliveryRow';
import { DeliveryFormModal } from './DeliveryFormModal';
import type { Delivery } from '@/types';

export function SeedingDeliveriesTab({ deliveries }: { deliveries: Delivery[] }) {
  const [showModal, setShowModal] = useState(false);

  const totalPieces = deliveries.reduce((sum, d) => sum + d.piecesCount, 0);
  const mrwCost = deliveries.reduce((sum, d) => sum + d.cost, 0);
  const published = deliveries.filter((d) => d.published).length;
  const shipped = deliveries.filter((d) => d.method !== 'internal').length;
  const returnPct = shipped > 0 ? Math.round((published / shipped) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex flex-wrap items-center gap-x-2 text-sm text-slate-500">
          <span className="font-semibold text-slate-800">{deliveries.length}</span> entregas
          <span className="font-semibold text-slate-800">{totalPieces}</span> piezas
          <span>
            Gasto MRW <span className="font-semibold text-slate-800">{formatCurrency(mrwCost)}</span>
          </span>
          <span className="font-semibold text-slate-800">{published}</span> publicados ·{' '}
          <span className="font-semibold text-slate-800">{returnPct}%</span> retorno
        </p>
        <Button size="sm" onClick={() => setShowModal(true)}>+ Nueva entrega</Button>
      </div>

      <Card className="flex flex-wrap items-center gap-3 p-4">
        <Select className="w-44">
          <option>Todos los métodos</option>
        </Select>
        <Select className="min-w-64 flex-1">
          <option>Todos los clientes</option>
        </Select>
        <Select className="w-48">
          <option>Todos los influencers</option>
        </Select>
        <Input placeholder="Filtrar por modelo..." className="w-48" />
      </Card>

      <div className="space-y-3">
        {deliveries.map((delivery) => (
          <DeliveryRow key={delivery.id} delivery={delivery} />
        ))}
      </div>

      <DeliveryFormModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
```

- [ ] **Step 5: Rewire `SeedingPage`**

Replace `src/features/etra/pages/SeedingPage.tsx` with (influencers/reporte keep their current simple rendering for now — Tasks 12-13 replace them):

```tsx
import { useState } from 'react';
import { UnderlineTabs, Card, Badge } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import { SeedingDeliveriesTab } from '../components';
import { useInventory } from '../hooks/useInventory';
import { useDeliveries } from '../hooks/useDeliveries';
import { useInfluencers } from '../hooks/useInfluencers';
import { useSeedingReport } from '../hooks/useSeedingReport';

type SeedingTab = 'inventario' | 'entregas' | 'influencers' | 'reporte';

const TABS: { label: string; value: SeedingTab }[] = [
  { label: 'Inventario', value: 'inventario' },
  { label: 'Entregas', value: 'entregas' },
  { label: 'Influencers', value: 'influencers' },
  { label: 'Reporte', value: 'reporte' },
];

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

      <UnderlineTabs options={TABS} value={tab} onChange={setTab} />

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
        <>
          {deliveries.isLoading && <p className="text-slate-500">Cargando...</p>}
          {deliveries.data && <SeedingDeliveriesTab deliveries={deliveries.data} />}
        </>
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
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === 'reporte' && (
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
      )}
    </div>
  );
}
```

- [ ] **Step 6: Export the new components**

Add to `src/features/etra/components/index.ts`:

```ts
export * from './DeliveryRow';
export * from './DeliveryFormModal';
export * from './SeedingDeliveriesTab';
```

- [ ] **Step 7: Run the tests**

Run: `npx vitest run src/features/etra/pages/SeedingPage.test.tsx` — expected PASS (2 tests). Then `npx vitest run` — all green.

- [ ] **Step 8: Commit**

```bash
git add src/features/etra/components src/features/etra/pages/SeedingPage.tsx src/features/etra/pages/SeedingPage.test.tsx
git commit -m "feat: rebuild Seeding Entregas tab with stats, filters, rich rows and modal"
```

---

## Task 12: Seeding — Influencers directory with expandable cards + form modal

**Files:**
- Create: `src/features/etra/components/InfluencerCard.tsx`
- Create: `src/features/etra/components/InfluencerFormModal.tsx`
- Create: `src/features/etra/components/SeedingInfluencersTab.tsx`
- Modify: `src/features/etra/components/index.ts`
- Modify: `src/features/etra/pages/SeedingPage.tsx`
- Modify: `src/features/etra/pages/SeedingPage.test.tsx`

**Interfaces:**
- `InfluencerCard({ influencer, onEdit })` — collapsed: avatar + name + IG (`pink`) / TT (`neutral`) chips + chevron. Expanded: email row + "Editar" (calls `onEdit`) / "Eliminar" links.
- `InfluencerFormModal({ open, onClose, influencer? })` — "Nuevo influencer" / "Editar influencer"; dynamic social-network rows; prefilled from `influencer` when editing.
- `SeedingInfluencersTab({ influencers })` — search input + count + add button + 2-col grid.

- [ ] **Step 1: Add the failing tests**

Append to `src/features/etra/pages/SeedingPage.test.tsx`:

```tsx
describe('SeedingPage — Influencers', () => {
  it('expands a card to reveal email and edit/delete actions', () => {
    render(<SeedingPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Influencers' }));

    expect(screen.getByText('2 en el directorio')).toBeInTheDocument();
    expect(screen.getByText('IG · 245K')).toBeInTheDocument();
    expect(screen.queryByText('carlos.ruiz@example.com')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Expandir Carlos Ruiz' }));
    expect(screen.getByText('carlos.ruiz@example.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Editar' })).toBeInTheDocument();
  });

  it('opens the influencer form modal in create and edit modes', () => {
    render(<SeedingPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Influencers' }));

    fireEvent.click(screen.getByRole('button', { name: '+ Añadir influencer' }));
    expect(screen.getByText('Nuevo influencer')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

    fireEvent.click(screen.getByRole('button', { name: 'Expandir Carlos Ruiz' }));
    fireEvent.click(screen.getByRole('button', { name: 'Editar' }));
    expect(screen.getByText('Editar influencer')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Carlos Ruiz')).toBeInTheDocument();
  });
});
```

Run: `npx vitest run src/features/etra/pages/SeedingPage.test.tsx` — expected FAIL (2 new tests).

- [ ] **Step 2: Implement `InfluencerCard`**

Follower chips reuse the existing display convention (`245K`, `26,2K` — `toLocaleString('es-ES')` of thousands with one decimal when needed):

```tsx
// src/features/etra/components/InfluencerCard.tsx
import { useState } from 'react';
import { ChevronDown, ChevronUp, Mail } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import type { Influencer } from '@/types';

function formatFollowers(count: number): string {
  const thousands = count / 1000;
  const rounded = Number.isInteger(thousands) ? String(thousands) : thousands.toFixed(1).replace('.', ',');
  return `${rounded}K`;
}

export function InfluencerCard({
  influencer,
  onEdit,
}: {
  influencer: Influencer;
  onEdit: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-medium text-brand-700">
          {influencer.initials}
        </div>
        <div className="flex-1">
          <p className="font-medium text-slate-800">{influencer.name}</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {influencer.instagramFollowers !== undefined && (
              <Badge variant="pink" size="sm">IG · {formatFollowers(influencer.instagramFollowers)}</Badge>
            )}
            {influencer.tiktokFollowers !== undefined && (
              <Badge variant="neutral" size="sm">TT · {formatFollowers(influencer.tiktokFollowers)}</Badge>
            )}
          </div>
        </div>
        <button
          type="button"
          aria-label={`Expandir ${influencer.name}`}
          onClick={() => setExpanded((open) => !open)}
          className="text-slate-300 hover:text-slate-500"
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
          {influencer.email && (
            <p className="flex items-center gap-2 text-sm text-slate-600">
              <Mail className="h-3.5 w-3.5 text-slate-300" />
              {influencer.email}
            </p>
          )}
          <div className="flex gap-3 text-sm">
            <button type="button" onClick={onEdit} className="font-medium text-brand-600 hover:text-brand-700">
              Editar
            </button>
            <button type="button" className="text-slate-400 hover:text-slate-600">
              Eliminar
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}
```

- [ ] **Step 3: Implement `InfluencerFormModal`**

```tsx
// src/features/etra/components/InfluencerFormModal.tsx
import { useState } from 'react';
import { UserRound, X } from 'lucide-react';
import { Modal, Input, Select, Textarea, Button } from '@/components/ui';
import type { Influencer } from '@/types';

interface SocialRow {
  network: 'Instagram' | 'TikTok';
  url: string;
  followers: string;
}

function initialSocials(influencer?: Influencer): SocialRow[] {
  if (!influencer) return [{ network: 'Instagram', url: '', followers: '' }];
  const rows: SocialRow[] = [];
  if (influencer.instagramFollowers !== undefined) {
    rows.push({ network: 'Instagram', url: '', followers: String(influencer.instagramFollowers) });
  }
  if (influencer.tiktokFollowers !== undefined) {
    rows.push({ network: 'TikTok', url: '', followers: String(influencer.tiktokFollowers) });
  }
  return rows.length > 0 ? rows : [{ network: 'Instagram', url: '', followers: '' }];
}

export function InfluencerFormModal({
  open,
  onClose,
  influencer,
}: {
  open: boolean;
  onClose: () => void;
  influencer?: Influencer;
}) {
  const [socials, setSocials] = useState<SocialRow[]>(() => initialSocials(influencer));

  return (
    <Modal open={open} onClose={onClose} title={influencer ? 'Editar influencer' : 'Nuevo influencer'}>
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center gap-1">
            <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-50">
              <UserRound className="h-7 w-7 text-slate-300" />
              <span className="absolute inset-x-0 bottom-0 bg-slate-800/60 py-0.5 text-center text-[10px] text-white">
                Hacer foto
              </span>
            </div>
            <span className="text-xs text-slate-400">Foto</span>
          </div>
          <div className="flex-1">
            <Input label="Nombre *" defaultValue={influencer?.name} autoFocus className="focus:ring-brand-500" />
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-700">Redes sociales</p>
          <p className="mb-2 text-xs text-slate-400">
            Los seguidores se actualizan a mano; se guarda la fecha automáticamente.
          </p>
          <div className="space-y-2">
            {socials.map((row, index) => (
              <div key={index} className="flex items-center gap-2">
                <Select defaultValue={row.network} className="w-32">
                  <option>Instagram</option>
                  <option>TikTok</option>
                </Select>
                <Input placeholder="@handle o URL" defaultValue={row.url} className="flex-1" />
                <Input placeholder="Seguid." defaultValue={row.followers} className="w-24" />
                {socials.length > 1 && (
                  <button
                    type="button"
                    aria-label="Eliminar red"
                    onClick={() => setSocials((rows) => rows.filter((_, i) => i !== index))}
                    className="text-slate-300 hover:text-slate-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setSocials((rows) => [...rows, { network: 'Instagram', url: '', followers: '' }])}
            className="mt-2 text-sm text-brand-600 hover:text-brand-700"
          >
            + Añadir red
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Input label="Talla ropa" placeholder="S/M/L..." />
          <Input label="Talla gorra" placeholder="7⅜ / M-L..." />
          <Input label="Talla calzado" placeholder="43..." />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input label="Email" defaultValue={influencer?.email} />
          <Input label="Teléfono" />
        </div>

        <Input label="Dirección de envío" />
        <Textarea label="Notas" className="min-h-[60px]" />

        <div className="flex gap-3">
          <Button>Guardar</Button>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        </div>
      </div>
    </Modal>
  );
}
```

- [ ] **Step 4: Implement `SeedingInfluencersTab`**

```tsx
// src/features/etra/components/SeedingInfluencersTab.tsx
import { useState } from 'react';
import { Input, Button } from '@/components/ui';
import { InfluencerCard } from './InfluencerCard';
import { InfluencerFormModal } from './InfluencerFormModal';
import type { Influencer } from '@/types';

export function SeedingInfluencersTab({ influencers }: { influencers: Influencer[] }) {
  const [modal, setModal] = useState<{ open: boolean; influencer?: Influencer }>({ open: false });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <Input placeholder="Buscar influencer..." className="w-64" />
        <span className="text-sm text-slate-400">{influencers.length} en el directorio</span>
        <div className="ml-auto">
          <Button size="sm" onClick={() => setModal({ open: true })}>+ Añadir influencer</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {influencers.map((influencer) => (
          <InfluencerCard
            key={influencer.id}
            influencer={influencer}
            onEdit={() => setModal({ open: true, influencer })}
          />
        ))}
      </div>

      <InfluencerFormModal
        key={modal.influencer?.id ?? 'new'}
        open={modal.open}
        onClose={() => setModal({ open: false })}
        influencer={modal.influencer}
      />
    </div>
  );
}
```

- [ ] **Step 5: Wire into `SeedingPage`**

In `src/features/etra/pages/SeedingPage.tsx`, add `SeedingInfluencersTab` to the `../components` import and replace the entire `{tab === 'influencers' && (...)}` block with:

```tsx
      {tab === 'influencers' && (
        <>
          {influencers.isLoading && <p className="text-slate-500">Cargando...</p>}
          {influencers.data && <SeedingInfluencersTab influencers={influencers.data} />}
        </>
      )}
```

- [ ] **Step 6: Export the new components**

Add to `src/features/etra/components/index.ts`:

```ts
export * from './InfluencerCard';
export * from './InfluencerFormModal';
export * from './SeedingInfluencersTab';
```

- [ ] **Step 7: Run the tests**

Run: `npx vitest run src/features/etra/pages/SeedingPage.test.tsx` — expected PASS (4 tests). Then `npx vitest run` — all green.

- [ ] **Step 8: Commit**

```bash
git add src/features/etra/components src/features/etra/pages/SeedingPage.tsx src/features/etra/pages/SeedingPage.test.tsx
git commit -m "feat: rebuild Seeding Influencers tab with expandable cards and form modal"
```

---

## Task 13: Seeding — Reporte tab with filters, 6 stat cards and Alcance column

**Files:**
- Create: `src/features/etra/components/SeedingReportTab.tsx`
- Modify: `src/features/etra/components/index.ts`
- Modify: `src/features/etra/pages/SeedingPage.tsx`
- Modify: `src/features/etra/pages/SeedingPage.test.tsx`

**Interfaces:**
- `SeedingReportTab({ rows })` — all stats derived from `rows`: ENVÍOS = row count (caption `Σ pieces piezas`), COSTE PRODUCTO REGALADO = `Σ productCost`, GASTO MRW = `Σ shippingCost` (caption `Total …`), RETORNO = % rows with `publicationStatus === 'Publicado'` (emerald value, caption `N de M publicados`), ALCANCE TOTAL = `Σ reach ?? 0`, COSTE POR PUBLICACIÓN = `(Σ productCost + Σ shippingCost) / publicados` (0 when none).

- [ ] **Step 1: Add the failing test**

Append to `src/features/etra/pages/SeedingPage.test.tsx`:

```tsx
describe('SeedingPage — Reporte', () => {
  it('renders the six stat cards and the Alcance column', () => {
    render(<SeedingPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Reporte' }));

    expect(screen.getByText('ENVÍOS')).toBeInTheDocument();
    expect(screen.getByText('RETORNO')).toBeInTheDocument();
    expect(screen.getByText('100%')).toHaveClass('text-emerald-600');
    expect(screen.getByText('2 de 2 publicados')).toBeInTheDocument();
    expect(screen.getByText('COSTE POR PUBLICACIÓN')).toBeInTheDocument();
    expect(screen.getByText('Alcance')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Exportar PDF' })).toBeInTheDocument();
  });
});
```

Run: `npx vitest run src/features/etra/pages/SeedingPage.test.tsx` — expected FAIL.

- [ ] **Step 2: Implement `SeedingReportTab`**

```tsx
// src/features/etra/components/SeedingReportTab.tsx
import { Input, Button, StatCard } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import type { SeedingReportRow } from '@/types';

export function SeedingReportTab({ rows }: { rows: SeedingReportRow[] }) {
  const pieces = rows.reduce((sum, row) => sum + row.pieces, 0);
  const productCost = rows.reduce((sum, row) => sum + row.productCost, 0);
  const shippingCost = rows.reduce((sum, row) => sum + row.shippingCost, 0);
  const published = rows.filter((row) => row.publicationStatus === 'Publicado').length;
  const returnPct = rows.length > 0 ? Math.round((published / rows.length) * 100) : 0;
  const reach = rows.reduce((sum, row) => sum + (row.reach ?? 0), 0);
  const costPerPublication = published > 0 ? (productCost + shippingCost) / published : 0;
  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-4">
        <Input label="Cliente" placeholder="Todos los clientes..." className="w-56" />
        <Input label="Desde" type="date" defaultValue={`${currentYear}-01-01`} className="w-40" />
        <Input label="Hasta" type="date" defaultValue={new Date().toISOString().slice(0, 10)} className="w-40" />
        <div className="ml-auto">
          <Button size="sm">Exportar PDF</Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="ENVÍOS" value={String(rows.length)} caption={`${pieces} piezas`} />
        <StatCard label="COSTE PRODUCTO REGALADO" value={formatCurrency(productCost)} />
        <StatCard label="GASTO MRW" value={formatCurrency(shippingCost)} caption={`Total ${formatCurrency(shippingCost)}`} />
        <StatCard
          label="RETORNO"
          value={`${returnPct}%`}
          valueClassName="text-emerald-600"
          caption={`${published} de ${rows.length} publicados`}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="ALCANCE TOTAL" value={String(reach)} />
        <StatCard label="COSTE POR PUBLICACIÓN" value={formatCurrency(costPerPublication)} />
      </div>

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
              <th className="px-4 py-3 text-right">Alcance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, index) => (
              <tr key={index}>
                <td className="px-4 py-3 text-slate-500">{row.date}</td>
                <td className="px-4 py-3 font-medium text-slate-800">{row.influencer}</td>
                <td className="px-4 py-3 text-right text-slate-700">{row.pieces}</td>
                <td className="px-4 py-3 text-right text-slate-700">{formatCurrency(row.productCost)}</td>
                <td className="px-4 py-3 text-right text-slate-700">{formatCurrency(row.shippingCost)}</td>
                <td className="px-4 py-3 text-slate-500">{row.publicationStatus}</td>
                <td className="px-4 py-3 text-right text-slate-400">{row.reach ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

Note: the table header row in the capture uses title-case "Alcance" etc. — the `uppercase` class on `<thead>` handles display; the test matches the DOM text "Alcance".

- [ ] **Step 3: Wire into `SeedingPage`**

Add `SeedingReportTab` to the `../components` import and replace the entire `{tab === 'reporte' && (...)}` block (the old inline table) with:

```tsx
      {tab === 'reporte' && (
        <>
          {report.isLoading && <p className="text-slate-500">Cargando...</p>}
          {report.data && <SeedingReportTab rows={report.data} />}
        </>
      )}
```

The `formatCurrency` import in `SeedingPage.tsx` is now unused — remove it.

- [ ] **Step 4: Export, run tests**

Add to `src/features/etra/components/index.ts`:

```ts
export * from './SeedingReportTab';
```

Run: `npx vitest run src/features/etra/pages/SeedingPage.test.tsx` — expected PASS (5 tests). Then `npx vitest run` — all green.

- [ ] **Step 5: Commit**

```bash
git add src/features/etra/components src/features/etra/pages/SeedingPage.tsx src/features/etra/pages/SeedingPage.test.tsx
git commit -m "feat: rebuild Seeding Reporte tab with stat cards and reach column"
```

---

## Task 14: Cuentas — left column, Nueva cuenta form, underline detail tabs, Datos

**Files:**
- Create: `src/features/etra/components/AccountForm.tsx`
- Create: `src/features/etra/pages/AccountsPage.test.tsx`
- Modify: `src/features/etra/components/index.ts`
- Modify: `src/features/etra/pages/AccountsPage.tsx`

**Interfaces:**
- `AccountForm({ onCancel })` — the "Nueva cuenta" panel form (decorative; both buttons return to browse mode via `onCancel`).
- `AccountsPage` — page-level state `{ mode: 'browse' | 'new', selectedId }`; uses `MasterDetailList` with `listTop` (full-width "+ Nueva cuenta" button + Estado filter card) and `detailOverride={<AccountForm/>}` when `mode === 'new'`. Detail header + `UnderlineTabs` with 5 tabs; **Datos** renders inline; the other four render placeholder text in this task and are implemented in Tasks 15-16.

- [ ] **Step 1: Write the failing page test**

```tsx
// src/features/etra/pages/AccountsPage.test.tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AccountsPage } from './AccountsPage';

const accounts = [
  {
    id: 'acc1',
    name: 'Cliente A',
    status: 'active',
    manager: 'Ana López',
    crmClient: 'Cliente A',
    contact: 'Jack Contacto',
    signupDate: '01 ene 2026',
    email: 'contacto@cliente-a.example.com',
    phone: '+34 600 000 001',
    obligations: [
      { id: 'ob1', label: 'Notas de prensa', cadence: 'Mensual', period: '2026-07', done: 0, target: 4 },
    ],
    coverage: [
      { id: 'cov1', date: '08 jul 2026', title: 'Mención en medios', outlet: 'Prensa Digital', channel: 'Online', value: 1000 },
    ],
    billing: {
      defaultRetainer: 5500,
      defaultCommissionPct: 20,
      months: [
        { id: 'm7', label: 'Jul 2026', retainer: 5500, commissions: 2000, others: 0 },
        { id: 'm6', label: 'Jun 2026', retainer: 5500, commissions: null, others: 0 },
      ],
    },
  },
];

vi.mock('../hooks/usePrAccounts', () => ({
  usePrAccounts: () => ({ isLoading: false, error: null, data: accounts }),
}));
vi.mock('../hooks/usePrActions', () => ({
  usePrActions: () => ({
    isLoading: false,
    error: null,
    data: [
      {
        id: 'act1',
        title: 'Acción de prensa Cliente A',
        account: 'Cliente A',
        type: 'Evento',
        amount: 10000,
        status: 'in-progress',
        date: '16 jul 2026',
      },
    ],
  }),
}));

describe('AccountsPage', () => {
  it('shows the Nueva cuenta form and returns to browse on cancel', () => {
    render(<AccountsPage />);
    fireEvent.click(screen.getByRole('button', { name: '+ Nueva cuenta' }));

    expect(screen.getByText('Nueva cuenta')).toBeInTheDocument();
    expect(screen.getByText('Nombre (marca) *')).toBeInTheDocument();
    expect(screen.getByText('Abrir CRM ↗')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.getByText('Selecciona una cuenta o crea una nueva.')).toBeInTheDocument();
  });

  it('selects an account and shows the underline detail tabs with Datos', () => {
    render(<AccountsPage />);
    fireEvent.click(screen.getAllByText('Cliente A')[0]);

    expect(screen.getByRole('button', { name: 'Obligaciones' })).toBeInTheDocument();
    expect(screen.getByText('Ana López')).toBeInTheDocument(); // Datos tab content
    expect(screen.getByText('contacto@cliente-a.example.com')).toBeInTheDocument();
  });
});
```

Run: `npx vitest run src/features/etra/pages/AccountsPage.test.tsx` — expected FAIL.

- [ ] **Step 2: Implement `AccountForm`**

```tsx
// src/features/etra/components/AccountForm.tsx
import { Input, Select, Textarea, Button } from '@/components/ui';

export function AccountForm({ onCancel }: { onCancel: () => void }) {
  return (
    <div>
      <h2 className="mb-5 text-lg font-semibold text-slate-800">Nueva cuenta</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Nombre (marca) *" />
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Cliente del CRM</span>
            <button type="button" className="text-xs text-brand-600 hover:text-brand-700">
              Abrir CRM ↗
            </button>
          </div>
          <Input placeholder="Buscar o crear cliente..." />
          <p className="mt-1 text-xs text-slate-400">
            Busca el cliente del CRM. Si no existe, escríbelo y créalo al momento.
          </p>
        </div>
        <Input label="Responsable" />
        <Select label="Estado" defaultValue="Activa">
          <option>Activa</option>
          <option>Pausada</option>
          <option>Baja</option>
        </Select>
        <Input label="Fecha de alta" type="date" />
        <Input label="Contacto" />
        <Input label="Email de contacto" />
        <Input label="Teléfono de contacto" />
        <div className="md:col-span-2">
          <Textarea label="Notas" />
        </div>
      </div>
      <div className="mt-5 flex gap-3">
        <Button onClick={onCancel}>Guardar</Button>
        <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Rewrite `AccountsPage`**

```tsx
// src/features/etra/pages/AccountsPage.tsx
import { useState } from 'react';
import { MasterDetailList, Badge, Button, Card, Select, UnderlineTabs } from '@/components/ui';
import { AccountForm } from '../components';
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

function AccountDatosTab({ account }: { account: PrAccount }) {
  const rows: { label: string; value?: string }[] = [
    { label: 'Resp.', value: account.manager },
    { label: 'Cliente CRM', value: account.crmClient },
    { label: 'Contacto', value: account.contact },
    { label: 'Fecha de alta', value: account.signupDate },
    { label: 'Email', value: account.email },
    { label: 'Teléfono', value: account.phone },
    { label: 'Notas', value: account.notes },
  ];
  return (
    <dl className="space-y-1 text-sm">
      {rows
        .filter((row) => row.value)
        .map((row) => (
          <div key={row.label} className="flex gap-2">
            <dt className="text-slate-400">{row.label}:</dt>
            <dd className="text-slate-700">{row.value}</dd>
          </div>
        ))}
    </dl>
  );
}

function AccountDetail({ account }: { account: PrAccount }) {
  const [tab, setTab] = useState<AccountDetailTab>('datos');

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">{account.name}</h2>
        <Badge variant="emerald">{STATUS_LABEL[account.status]}</Badge>
      </div>
      <UnderlineTabs options={DETAIL_TABS} value={tab} onChange={setTab} className="mb-5" />
      {tab === 'datos' && <AccountDatosTab account={account} />}
      {tab === 'acciones' && (
        <p className="py-8 text-center text-slate-400">Pendiente (Task 15).</p>
      )}
      {tab === 'obligaciones' && (
        <p className="py-8 text-center text-slate-400">Pendiente (Task 15).</p>
      )}
      {tab === 'cobertura' && (
        <p className="py-8 text-center text-slate-400">Pendiente (Task 16).</p>
      )}
      {tab === 'facturacion' && (
        <p className="py-8 text-center text-slate-400">Pendiente (Task 16).</p>
      )}
    </div>
  );
}

export function AccountsPage() {
  const { data, isLoading, error } = usePrAccounts();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<'browse' | 'new'>('browse');

  if (isLoading) {
    return <div className="py-12 text-center text-slate-500">Cargando...</div>;
  }

  if (error || !data) {
    return <div className="py-12 text-center text-red-600">Error: {error || 'No data'}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Cuentas</h1>
        <p className="text-sm text-slate-500">
          Cuentas y marcas que gestiona el equipo: acciones de PR, cobertura y facturación.
        </p>
      </div>
      <MasterDetailList
        items={data}
        selectedId={mode === 'new' ? null : selectedId}
        onSelect={(id) => {
          setSelectedId(id);
          setMode('browse');
        }}
        listTop={
          <>
            <Button
              className="w-full"
              onClick={() => {
                setMode('new');
                setSelectedId(null);
              }}
            >
              + Nueva cuenta
            </Button>
            <Card className="p-4">
              <Select label="Estado">
                <option>Todas</option>
                <option>Activa</option>
                <option>Pausada</option>
                <option>Baja</option>
              </Select>
            </Card>
          </>
        }
        detailOverride={mode === 'new' ? <AccountForm onCancel={() => setMode('browse')} /> : undefined}
        emptyState="Selecciona una cuenta o crea una nueva."
        renderRow={(account) => (
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-800">{account.name}</p>
              <p className="text-xs text-slate-400">{account.crmClient}</p>
            </div>
            <Badge variant="emerald" size="sm">
              {STATUS_LABEL[account.status]}
            </Badge>
          </div>
        )}
        renderDetail={(account) => <AccountDetail key={account.id} account={account} />}
      />
    </div>
  );
}
```

- [ ] **Step 4: Export `AccountForm`**

Add to `src/features/etra/components/index.ts`:

```ts
export * from './AccountForm';
```

- [ ] **Step 5: Run the tests**

Run: `npx vitest run src/features/etra/pages/AccountsPage.test.tsx` — expected PASS (2 tests). Then `npx vitest run` — all green.

- [ ] **Step 6: Commit**

```bash
git add src/features/etra/components src/features/etra/pages/AccountsPage.tsx src/features/etra/pages/AccountsPage.test.tsx
git commit -m "feat: rebuild Cuentas page with list column, Nueva cuenta form and underline tabs"
```

---

## Task 15: Account tabs — Acciones + Obligaciones

**Files:**
- Create: `src/features/etra/components/account-tabs/AccountActionsTab.tsx`
- Create: `src/features/etra/components/account-tabs/AccountObligationsTab.tsx`
- Modify: `src/features/etra/components/index.ts`
- Modify: `src/features/etra/pages/AccountsPage.tsx`
- Modify: `src/features/etra/pages/AccountsPage.test.tsx`

**Interfaces:**
- `AccountActionsTab({ account })` — creation form card + list of `usePrActions()` filtered by `action.account === account.name`.
- `AccountObligationsTab({ account })` — "KPIS / OBLIGACIONES" header + "Modificar obligaciones" button + one card per obligation with `ProgressBar` and a numeric input.

- [ ] **Step 1: Add the failing tests**

Append to `src/features/etra/pages/AccountsPage.test.tsx`:

```tsx
describe('AccountsPage — detail tabs (Acciones, Obligaciones)', () => {
  it('renders the per-account action form and list', () => {
    render(<AccountsPage />);
    fireEvent.click(screen.getAllByText('Cliente A')[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Acciones' }));

    expect(screen.getByText('Título de la acción')).toBeInTheDocument();
    expect(screen.getByText('Incluida en fee')).toBeInTheDocument();
    expect(screen.getByText('Acción de prensa Cliente A')).toBeInTheDocument();
    expect(screen.getByText('En curso')).toBeInTheDocument();
  });

  it('renders obligations with a progress bar and target', () => {
    render(<AccountsPage />);
    fireEvent.click(screen.getAllByText('Cliente A')[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Obligaciones' }));

    expect(screen.getByText('KPIS / OBLIGACIONES')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Modificar obligaciones' })).toBeInTheDocument();
    expect(screen.getByText('Notas de prensa')).toBeInTheDocument();
    expect(screen.getByText('Mensual · 2026-07')).toBeInTheDocument();
    expect(screen.getByText('/ 4')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
```

Run: `npx vitest run src/features/etra/pages/AccountsPage.test.tsx` — expected FAIL.

- [ ] **Step 2: Implement `AccountActionsTab`**

```tsx
// src/features/etra/components/account-tabs/AccountActionsTab.tsx
import { Card, Input, Select, Button, Badge } from '@/components/ui';
import { usePrActions } from '../../hooks/usePrActions';
import type { PrAccount, ActionStatus } from '@/types';

const STATUS_BADGE: Record<ActionStatus, { label: string; variant: 'blue' | 'amber' | 'emerald' | 'neutral' }> = {
  planned: { label: 'Planificada', variant: 'blue' },
  'in-progress': { label: 'En curso', variant: 'amber' },
  done: { label: 'Hecha', variant: 'emerald' },
  cancelled: { label: 'Cancelada', variant: 'neutral' },
};

export function AccountActionsTab({ account }: { account: PrAccount }) {
  const { data, isLoading } = usePrActions();
  const actions = (data ?? []).filter((action) => action.account === account.name);

  return (
    <div className="space-y-4">
      <Card className="space-y-4 p-5">
        <div className="grid gap-4 md:grid-cols-[2fr_1fr_1fr]">
          <Input label="Título de la acción" />
          <Select label="Tipo" defaultValue="Nota de prensa">
            <option>Nota de prensa</option>
            <option>Evento</option>
            <option>Campaña</option>
          </Select>
          <Input label="Fecha límite" type="date" />
        </div>
        <div className="grid items-end gap-4 md:grid-cols-[2fr_1fr_1fr]">
          <Select label="Responsable" defaultValue="Sin asignar">
            <option>Sin asignar</option>
            <option>Ana López</option>
            <option>Carlos Ruiz</option>
          </Select>
          <label className="flex h-10 items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-brand-600" />
            Incluida en fee
          </label>
          <Button>Crear</Button>
        </div>
      </Card>

      {isLoading && <p className="text-slate-500">Cargando...</p>}
      <div className="space-y-3">
        {actions.map((action) => (
          <Card key={action.id} className="flex items-center gap-4 p-4">
            <span className="w-24 shrink-0 text-xs text-slate-400">{action.date}</span>
            <div className="flex-1">
              <p className="font-medium text-slate-800">{action.title}</p>
              <p className="text-xs text-slate-400">{action.type}</p>
            </div>
            <Badge variant={STATUS_BADGE[action.status].variant} size="sm">
              {STATUS_BADGE[action.status].label}
            </Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Implement `AccountObligationsTab`**

```tsx
// src/features/etra/components/account-tabs/AccountObligationsTab.tsx
import { Card, Button, ProgressBar } from '@/components/ui';
import type { PrAccount } from '@/types';

export function AccountObligationsTab({ account }: { account: PrAccount }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          KPIS / OBLIGACIONES
        </p>
        <Button variant="secondary" size="sm">Modificar obligaciones</Button>
      </div>

      {account.obligations.length === 0 && (
        <p className="py-8 text-center text-slate-400">Sin obligaciones definidas.</p>
      )}

      {account.obligations.map((obligation) => (
        <Card key={obligation.id} className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-medium text-slate-800">{obligation.label}</p>
            <p className="text-xs text-slate-400">
              {obligation.cadence} · {obligation.period}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ProgressBar value={obligation.done} max={obligation.target} className="flex-1" />
            <input
              type="number"
              defaultValue={obligation.done}
              className="h-9 w-16 rounded-lg border border-slate-200 px-2 text-right text-sm text-slate-800"
            />
            <span className="text-sm text-slate-400">/ {obligation.target}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Wire the tabs into `AccountsPage`**

In `src/features/etra/pages/AccountsPage.tsx`, add to the components import:

```tsx
import { AccountForm, AccountActionsTab, AccountObligationsTab } from '../components';
```

and in `AccountDetail`, replace the two placeholders:

```tsx
      {tab === 'acciones' && <AccountActionsTab account={account} />}
      {tab === 'obligaciones' && <AccountObligationsTab account={account} />}
```

- [ ] **Step 5: Export the tab components**

Add to `src/features/etra/components/index.ts`:

```ts
export * from './account-tabs/AccountActionsTab';
export * from './account-tabs/AccountObligationsTab';
```

- [ ] **Step 6: Run the tests**

Run: `npx vitest run src/features/etra/pages/AccountsPage.test.tsx` — expected PASS (4 tests). Then `npx vitest run` — all green.

- [ ] **Step 7: Commit**

```bash
git add src/features/etra/components src/features/etra/pages/AccountsPage.tsx src/features/etra/pages/AccountsPage.test.tsx
git commit -m "feat: add Acciones and Obligaciones account detail tabs"
```

---

## Task 16: Account tabs — Cobertura + Facturación

**Files:**
- Create: `src/features/etra/components/account-tabs/AccountCoverageTab.tsx`
- Create: `src/features/etra/components/account-tabs/AccountBillingTab.tsx`
- Modify: `src/features/etra/components/index.ts`
- Modify: `src/features/etra/pages/AccountsPage.tsx`
- Modify: `src/features/etra/pages/AccountsPage.test.tsx`

**Interfaces:**
- `AccountCoverageTab({ account })` — add-coverage form card, right-aligned total (`Σ coverage.value`), list rows with value + delete X.
- `AccountBillingTab({ account })` — defaults card (retainer + commission + Guardar + two-line help), formula banner, monthly table with editable retainer/others inputs, computed month totals and a bold Total row, footnote.

- [ ] **Step 1: Add the failing tests**

Append to `src/features/etra/pages/AccountsPage.test.tsx`:

```tsx
describe('AccountsPage — detail tabs (Cobertura, Facturación)', () => {
  it('renders coverage items with the total value', () => {
    render(<AccountsPage />);
    fireEvent.click(screen.getAllByText('Cliente A')[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Cobertura' }));

    expect(screen.getByText(/Valor total de cobertura:/)).toBeInTheDocument();
    expect(screen.getByText('Mención en medios')).toBeInTheDocument();
    expect(screen.getByText('Prensa Digital · Online')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Añadir' })).toBeInTheDocument();
  });

  it('renders the billing defaults, formula banner and monthly totals', () => {
    render(<AccountsPage />);
    fireEvent.click(screen.getAllByText('Cliente A')[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Facturación' }));

    expect(screen.getByText('Retainer mensual (por defecto)')).toBeInTheDocument();
    expect(screen.getByText(/Ingresos =/)).toBeInTheDocument();
    // Jul 2026: 5500 + 2000 = 7500; Jun 2026: 5500. Total: 11000 + 2000 = 13.000
    expect(screen.getByText('7500,00 €')).toBeInTheDocument();
    expect(screen.getByText('13.000,00 €')).toBeInTheDocument();
    expect(screen.getByText(/Las comisiones se calculan solas desde las acciones/)).toBeInTheDocument();
  });
});
```

Run: `npx vitest run src/features/etra/pages/AccountsPage.test.tsx` — expected FAIL.

- [ ] **Step 2: Implement `AccountCoverageTab`**

```tsx
// src/features/etra/components/account-tabs/AccountCoverageTab.tsx
import { X } from 'lucide-react';
import { Card, Input, Select, Button } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import type { PrAccount } from '@/types';

export function AccountCoverageTab({ account }: { account: PrAccount }) {
  const total = account.coverage.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-4">
      <Card className="space-y-4 p-5">
        <div className="grid gap-4 md:grid-cols-[1.2fr_1.5fr_1fr_0.8fr]">
          <Input label="Medio" />
          <Input label="Título" />
          <Select label="Tipo" defaultValue="Online">
            <option>Online</option>
            <option>Prensa</option>
            <option>Radio / TV</option>
          </Select>
          <Input label="Valor (€)" defaultValue="0" />
        </div>
        <div className="grid items-end gap-4 md:grid-cols-[1.2fr_2.5fr_0.8fr]">
          <Input label="Fecha" type="date" />
          <Input label="Enlace" placeholder="https://..." />
          <Button>Añadir</Button>
        </div>
      </Card>

      <p className="text-right text-xs text-slate-400">
        Valor total de cobertura: <span className="font-semibold text-slate-800">{formatCurrency(total)}</span>
      </p>

      <div className="space-y-3">
        {account.coverage.map((item) => (
          <Card key={item.id} className="flex items-center gap-4 p-4">
            <span className="w-24 shrink-0 text-xs text-slate-400">{item.date}</span>
            <div className="flex-1">
              <p className="font-medium text-slate-800">{item.title}</p>
              <p className="text-xs text-slate-400">
                {item.outlet} · {item.channel}
              </p>
            </div>
            <span className="text-sm font-medium text-slate-800">{formatCurrency(item.value)}</span>
            <button type="button" aria-label="Eliminar cobertura" className="text-slate-300 hover:text-slate-500">
              <X className="h-4 w-4" />
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Implement `AccountBillingTab`**

```tsx
// src/features/etra/components/account-tabs/AccountBillingTab.tsx
import { Card, Input, Button } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import type { PrAccount, AccountBillingMonth } from '@/types';

function monthTotal(month: AccountBillingMonth): number {
  return month.retainer + (month.commissions ?? 0) + month.others;
}

export function AccountBillingTab({ account }: { account: PrAccount }) {
  const { billing } = account;
  const retainerTotal = billing.months.reduce((sum, m) => sum + m.retainer, 0);
  const commissionsTotal = billing.months.reduce((sum, m) => sum + (m.commissions ?? 0), 0);
  const othersTotal = billing.months.reduce((sum, m) => sum + m.others, 0);
  const grandTotal = billing.months.reduce((sum, m) => sum + monthTotal(m), 0);

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <div className="grid items-end gap-4 md:grid-cols-[1fr_1fr_auto]">
          <Input label="Retainer mensual (por defecto)" defaultValue={String(billing.defaultRetainer)} />
          <Input label="Comisión por budget (por defecto) %" defaultValue={String(billing.defaultCommissionPct)} />
          <Button>Guardar</Button>
        </div>
        <p className="mt-3 text-xs text-slate-400">
          El retainer es el fee mensual pactado (se aplica cada mes activo; puedes ajustar un mes concreto en la
          tabla de abajo). La comisión por defecto se aplica a las acciones nuevas con budget de esta cuenta, y
          sigue siendo editable en cada acción.
        </p>
      </Card>

      <p className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
        Ingresos = <span className="font-semibold text-slate-800">retainer</span> (
        {formatCurrency(billing.defaultRetainer)}/mes por defecto) +{' '}
        <span className="font-semibold text-slate-800">comisiones</span> de acciones con budget + otros.
      </p>

      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-medium uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3">Mes</th>
              <th className="px-4 py-3 text-right">Retainer</th>
              <th className="px-4 py-3 text-right">Comisiones</th>
              <th className="px-4 py-3 text-right">Otros</th>
              <th className="px-4 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {billing.months.map((month) => (
              <tr key={month.id}>
                <td className="px-4 py-2.5 text-slate-700">{month.label}</td>
                <td className="px-4 py-2.5 text-right">
                  <input
                    type="number"
                    defaultValue={month.retainer}
                    className="h-9 w-24 rounded-lg border border-slate-200 px-2 text-right text-sm text-slate-800"
                  />
                </td>
                <td className="px-4 py-2.5 text-right text-slate-700">
                  {month.commissions !== null ? formatCurrency(month.commissions) : '—'}
                </td>
                <td className="px-4 py-2.5 text-right">
                  <input
                    type="number"
                    defaultValue={month.others}
                    className="h-9 w-20 rounded-lg border border-slate-200 px-2 text-right text-sm text-slate-800"
                  />
                </td>
                <td className="px-4 py-2.5 text-right font-medium text-slate-800">
                  {formatCurrency(monthTotal(month))}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-slate-200 font-semibold text-slate-800">
              <td className="px-4 py-3">Total</td>
              <td className="px-4 py-3 text-right">{formatCurrency(retainerTotal)}</td>
              <td className="px-4 py-3 text-right">{formatCurrency(commissionsTotal)}</td>
              <td className="px-4 py-3 text-right">{formatCurrency(othersTotal)}</td>
              <td className="px-4 py-3 text-right">{formatCurrency(grandTotal)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <p className="text-xs text-slate-400">
        El retainer y &quot;otros&quot; son editables por mes (otros admite negativos para restar). Las comisiones
        se calculan solas desde las acciones.
      </p>
    </div>
  );
}
```

- [ ] **Step 4: Wire the tabs into `AccountsPage`**

Extend the components import in `src/features/etra/pages/AccountsPage.tsx`:

```tsx
import {
  AccountForm,
  AccountActionsTab,
  AccountObligationsTab,
  AccountCoverageTab,
  AccountBillingTab,
} from '../components';
```

and replace the two remaining placeholders in `AccountDetail`:

```tsx
      {tab === 'cobertura' && <AccountCoverageTab account={account} />}
      {tab === 'facturacion' && <AccountBillingTab account={account} />}
```

- [ ] **Step 5: Export the tab components**

Add to `src/features/etra/components/index.ts`:

```ts
export * from './account-tabs/AccountCoverageTab';
export * from './account-tabs/AccountBillingTab';
```

- [ ] **Step 6: Run the tests**

Run: `npx vitest run src/features/etra/pages/AccountsPage.test.tsx` — expected PASS (6 tests). Then `npx vitest run` — all green.

- [ ] **Step 7: Commit**

```bash
git add src/features/etra/components src/features/etra/pages/AccountsPage.tsx src/features/etra/pages/AccountsPage.test.tsx
git commit -m "feat: add Cobertura and Facturación account detail tabs"
```

---

## Task 17: Final verification — lint, tests, build, neutrality grep, visual comparison

**Files:** none created; fixes only if a check fails.

- [ ] **Step 1: Full pipeline**

```bash
npm run lint && npx vitest run && npm run build
```

Expected: all three pass. Fix any failure before continuing.

- [ ] **Step 2: Brand-neutrality grep**

```bash
grep -rniE "new era|tattoox|eduard|marià|maria casals|pego|59fifty|tagmag|blackmoose|conceptone(agency)?\.com|etra agency" src/
```

Expected: **no matches**. (Pre-existing identifiers like the `/etra` route or `EtraShell` are allowed and don't match this pattern.)

- [ ] **Step 3: Visual comparison against the captures**

```bash
npm run dev
```

Compare each screen side-by-side with its capture (`/mnt/c/Users/Arian/Documents/Capturas de pantalla/...`):

1. `/etra/tareas` vs `Etra_Acciones_Pulsar_Nueva_Accion` — with the "Nueva tarea" panel open.
2. `/etra/tareas/act1` vs `Etra_Acciones_pulsar_en_Accion_ya_creada` — breakdown figures must read 10.000,00 / −2000,00 / 8000,00 / −3540,00 / 4460,00 €.
3. `/etra/seeding` → Entregas (+ modal in its 3 method variants) vs `Etra_Seeding_Entregas`.
4. `/etra/seeding` → Influencers (expandida + modal alta/edición) vs `Etra_Seeding_Influencers`.
5. `/etra/seeding` → Reporte vs `Etra_Seeding_Reporte`.
6. `/etra/cuentas` → cada tab + formulario Nueva cuenta vs `Etra_Cuentas`.

Check spacing, radii, badge tones (spec §3.4), and the 4-tab nav (Resumen inactive outside `/etra`). Fix discrepancies and amend the relevant task's commit or add a `fix:` commit.

- [ ] **Step 4: Final commit (if fixes were needed) and wrap-up**

```bash
git status
```

Expected: clean tree, all work committed on `feature/fase3-comunicacion-produccion`. Do not merge to `main`.

---

## Self-review checklist (done at planning time)

- **Spec coverage:** shell tab (T8), Acciones page + panel + cards (T9), action detail route (T10), Seeding tabs/Entregas/Influencers/Reporte (T11-13), Cuentas column/form/tabs (T14-16), primitives (T1-6), data (T7), colorimetry §3.4 encoded in the class names above, neutrality grep (T17). Inventario/Datos/Resumen intentionally unchanged (spec §9).
- **Type consistency:** `BudgetLineStatus` values (`proposed`/`pending-payment`/`paid`), `DeliveryMethod` (`mrw`/`hand`/`internal`), `PrAccount.billing.months` and component prop names match between Task 7 types, fixtures, and Tasks 9-16 usage.
- **No placeholders:** the only intentional placeholder text is the two `Pendiente (Task 15/16)` strings in Task 14's `AccountDetail`, which Tasks 15-16 replace — they exist so Task 14 ships compiling and tested on its own.
- **Test queries:** account rows render "Cliente A" twice (name + crmClient subtitle), so the AccountsPage tests select rows with `getAllByText('Cliente A')[0]` instead of `getByText`.
