# CRUDA (calco pixel-perfect) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the CRUDA module as a pixel-perfect, presentational-only calco of `https://bookings.conceptoneagency.com/cruda`, `/cruda/catalogo` and `/cruda/analitica`.

**Architecture:** Replace the placeholder `CrudaShell` (`ModuleShell`) with a real `AppLayout` + `<Outlet/>` shell and three nested routes. Each page is a React component driven by local UI state (`useState`/`useMemo`) over hardcoded seed data. Nothing persists; every button, form, stepper and chip editor mutates in-memory UI state only. Reuse the existing `src/components/ui` library; add two additive, non-breaking extensions.

**Tech Stack:** React 19, react-router v7, TypeScript, TailwindCSS v3 (custom `brand`/`status` tokens), lucide-react, Vitest + Testing Library.

## Global Constraints

- **Presentational only.** No persistence, no repository writes, no network. All actions mutate local `useState` / in-memory copies of seed. Copied verbatim from spec §Restricción invariable.
- **Spanish currency format:** thousands separator (`.`) appears only for values ≥ 10000: `6650,00 €`, `15.614,85 €`, `2540,25 €`, `0,00 €`. Always 2 decimals, comma decimal separator, trailing ` €`.
- **Order status palette (exact):** Borrador `text-slate-700 bg-slate-200`; Confirmado `text-blue-700 bg-blue-100`; En producción `text-amber-700 bg-amber-100`; Enviado `text-indigo-700 bg-indigo-100`; Entregado `text-emerald-700 bg-emerald-100`; Facturado `text-white bg-emerald-600`; Cancelado/Anulado `text-slate-400 bg-slate-100`.
- **Routes:** Pedidos `/cruda` (index), Catálogo `/cruda/catalogo`, Analítica `/cruda/analitica`. Analítica is reached via a header `BarChart2` `iconAction`, NOT a text tab. Text tabs: Pedidos, Catálogo.
- **File/pattern parity:** follow the existing `src/features/euphoric/` structure and the `src/components/ui` component APIs. Reference captures live in `docs/references/cruda/`.
- **Import alias:** `@/` maps to `src/`. UI components import from `@/components/ui`.

---

## File Structure

```
src/features/cruda/
  data/
    types.ts        # OrderStatus, Order, OrderLine, Product, Variant, Extra, ProductVariables, PhaseAccum, ...
    format.ts       # eur(value) -> "6650,00 €" / "15.614,85 €"
    seed.ts         # orders, product(s), extras, collections, variables, phaseAccum, orderSummary, salesByMonth
  components/
    CrudaStatusChip.tsx
    PhaseAccumCards.tsx
    OrderSummaryPanel.tsx
    OrderList.tsx
    OrderLinesTable.tsx
    OrderDetail.tsx
    NewOrderForm.tsx
    CollectionChips.tsx
    ProductsTable.tsx
    TopProductsTable.tsx
    StockAlerts.tsx
    ExtrasTable.tsx
    VariableChips.tsx
    ProductModal.tsx
    SalesByMonthChart.tsx
  pages/
    PedidosPage.tsx
    CatalogoPage.tsx
    AnaliticaPage.tsx
src/features/modules/CrudaShell.tsx   # rewrite
src/app/router.tsx                    # nest /cruda routes
src/components/ui/Badge.tsx           # add 'indigo' variant (additive)
src/components/ui/ProgressBar.tsx     # add optional fillClassName (additive)
```

Each `.tsx` component/page gets a colocated `*.test.tsx` in the same folder, matching the euphoric pattern.

---

### Task 1: Data layer (types, format, seed)

**Files:**
- Create: `src/features/cruda/data/types.ts`
- Create: `src/features/cruda/data/format.ts`
- Create: `src/features/cruda/data/seed.ts`
- Test: `src/features/cruda/data/format.test.ts`, `src/features/cruda/data/seed.test.ts`

**Interfaces:**
- Produces `eur(value: number): string`.
- Produces types: `OrderStatus`, `BusinessLine`, `OrderLine`, `Order`, `Variant`, `Product`, `Extra`, `ProductVariables`, `PhaseAccum`, `OrderSummary`, `MonthSales`.
- Produces seed: `orders: Order[]`, `products: Product[]`, `extras: Extra[]`, `collections: string[]`, `variables: ProductVariables`, `phaseAccum: PhaseAccum[]`, `orderSummary: OrderSummary`, `salesByYear: Record<number, MonthSales[]>`, `ORDER_STATUSES: OrderStatus[]`, `lineNetUnit(l)`, `lineSubtotal(l)`, `orderLinesTotal(lines)`.

- [ ] **Step 1: Write the failing test for `eur`**

Create `src/features/cruda/data/format.test.ts`:

```ts
import { test, expect } from 'vitest';
import { eur } from './format';

test('formats amounts with es grouping only from 10000', () => {
  expect(eur(0)).toBe('0,00 €');
  expect(eur(6650)).toBe('6650,00 €');
  expect(eur(2540.25)).toBe('2540,25 €');
  expect(eur(6424.6)).toBe('6424,60 €');
  expect(eur(15614.85)).toBe('15.614,85 €');
  expect(eur(14708.35)).toBe('14.708,35 €');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/cruda/data/format.test.ts`
Expected: FAIL — cannot find module `./format`.

- [ ] **Step 3: Implement `format.ts`**

Create `src/features/cruda/data/format.ts`:

```ts
/**
 * CRUDA currency format. Matches the reference app: 2 decimals, comma decimal
 * separator, and a thousands dot ONLY when the integer part has >= 5 digits
 * (i.e. value >= 10000). e.g. 6650 -> "6650,00 €", 15614.85 -> "15.614,85 €".
 */
export function eur(value: number): string {
  const sign = value < 0 ? '-' : '';
  const fixed = Math.abs(value).toFixed(2);
  const [intPart, decPart] = fixed.split('.');
  const grouped =
    intPart.length >= 5 ? intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : intPart;
  return `${sign}${grouped},${decPart} €`;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/cruda/data/format.test.ts`
Expected: PASS (6 assertions).

- [ ] **Step 5: Create `types.ts`**

Create `src/features/cruda/data/types.ts`:

```ts
export type OrderStatus =
  | 'Borrador'
  | 'Confirmado'
  | 'En producción'
  | 'Enviado'
  | 'Entregado'
  | 'Facturado'
  | 'Cancelado'
  | 'Anulado';

export type BusinessLine = 'Colección' | 'Producción';

export interface OrderLine {
  id: string;
  description: string;
  sku: string;
  size: string; // Talla
  color: string;
  qty: number; // Cant.
  price: number; // Precio € (unit, pre-discount)
  discountPct: number; // Dto %
  pvp: number; // PVP € (informative)
  multiplier: number; // × (informative)
  extrasPerUnit: number; // € per unit added by line extras
  extrasCount: number; // count shown in "Extras (n)"
}

export interface Order {
  id: string; // 'CR00103'
  client: string; // 'New Era' | 'Sin cliente'
  dateLabel: string; // '07 jul 2026'
  businessLine: BusinessLine;
  status: OrderStatus;
  reposicion?: boolean;
  amount: number; // amount shown in the list row
  headerTotal: number; // total shown in the detail header (may differ from lines total)
  responsible?: string;
  lines: OrderLine[];
}

export interface Variant {
  id: string;
  sku: string;
  finish: string; // Acabado
  size: string;
  color: string;
  price: number;
  cost: number;
  pvp: number;
  multiplier: number;
  stock: number;
  min: number;
}

export interface Product {
  id: string;
  name: string;
  collection: string; // 'Top Sales' | 'Sin colección'
  type: 'variantes' | 'unico';
  active: boolean;
  notes: string;
  variants: Variant[];
  soldUnits: number;
  soldValue: number;
}

export interface Extra {
  id: string;
  name: string;
  type: string; // 'Packaging' | 'Personalización' | 'Etiqueta'
  mode: string; // 'Por unidad (× prendas)'
  price: number;
}

export interface ProductVariables {
  finishes: string[]; // Acabados
  sizes: string[]; // Tallas
  colors: string[]; // Colores
}

export interface PhaseAccum {
  status: OrderStatus;
  count: number;
  amount: number;
}

export interface OrderSummary {
  activeAmount: number; // En curso (activos)
  activeCount: number;
  invoicedAmount: number; // Facturado
  coleccionAmount: number;
  produccionAmount: number;
}

export interface MonthSales {
  label: string; // 'Ene' ... 'Dic'
  value: number;
}
```

- [ ] **Step 6: Create `seed.ts`**

Create `src/features/cruda/data/seed.ts`:

```ts
import type {
  Order,
  OrderLine,
  Product,
  Extra,
  ProductVariables,
  PhaseAccum,
  OrderSummary,
  OrderStatus,
  MonthSales,
} from './types';

export const ORDER_STATUSES: OrderStatus[] = [
  'Borrador',
  'Confirmado',
  'En producción',
  'Enviado',
  'Entregado',
  'Facturado',
  'Cancelado',
];

export const collections: string[] = ['Top Sales'];

export const variables: ProductVariables = {
  finishes: ['Algodón', 'Ripstop', 'Lino'],
  sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  colors: ['Crudo', 'Azul'],
};

export const products: Product[] = [
  {
    id: 'p1',
    name: '(Test) Camiseta A&F',
    collection: 'Top Sales',
    type: 'variantes',
    active: true,
    notes: '',
    soldUnits: 860,
    soldValue: 14708.35,
    variants: [
      { id: 'v1', sku: '4878test01', finish: 'Algodón', size: 'S', color: 'Crudo', price: 16.5, cost: 8, pvp: 41.03, multiplier: 2.49, stock: 150, min: 50 },
      { id: 'v2', sku: '4878test02', finish: 'Algodón', size: 'M', color: 'Crudo', price: 16.5, cost: 8, pvp: 45, multiplier: 2.73, stock: 150, min: 50 },
      { id: 'v3', sku: '4878test03', finish: 'Algodón', size: 'L', color: 'Crudo', price: 16.5, cost: 8, pvp: 45, multiplier: 2.73, stock: 40, min: 50 },
    ],
  },
];

export const extras: Extra[] = [
  { id: 'e1', name: 'Bolsa Cierre Zip', type: 'Packaging', mode: 'Por unidad (× prendas)', price: 0.7 },
  { id: 'e2', name: 'Bordado', type: 'Personalización', mode: 'Por unidad (× prendas)', price: 2.5 },
  { id: 'e3', name: 'Etiqueta Bordada Personalizada', type: 'Etiqueta', mode: 'Por unidad (× prendas)', price: 0.15 },
];

const cr00103Lines: OrderLine[] = [
  { id: 'l1', description: '(Test) Camiseta A&F · Algodón', sku: '4878test01', size: 'S', color: 'Crudo', qty: 100, price: 16.5, discountPct: 0, pvp: 45, multiplier: 2.73, extrasPerUnit: 2.5, extrasCount: 1 },
  { id: 'l2', description: '(Test) Camiseta A&F · Algodón', sku: '4878test02', size: 'M', color: 'Crudo', qty: 200, price: 16.5, discountPct: 0, pvp: 45, multiplier: 2.73, extrasPerUnit: 2.5, extrasCount: 1 },
  { id: 'l3', description: '(Test) Camiseta A&F · Algodón', sku: '4878test03', size: 'L', color: 'Crudo', qty: 50, price: 16.5, discountPct: 0, pvp: 45, multiplier: 2.73, extrasPerUnit: 2.5, extrasCount: 1 },
];

export const orders: Order[] = [
  { id: 'CR00103', client: 'New Era', dateLabel: '07 jul 2026', businessLine: 'Colección', status: 'Confirmado', amount: 6650, headerTotal: 5782.5, responsible: 'Israel Cuenca', lines: cr00103Lines },
  { id: 'CR00102', client: 'TAGMAG', dateLabel: '06 jul 2026', businessLine: 'Colección', status: 'Borrador', reposicion: true, amount: 3730, headerTotal: 3730, lines: [] },
  { id: 'CR00101', client: 'TAGMAG', dateLabel: '06 jul 2026', businessLine: 'Colección', status: 'Facturado', amount: 2540.25, headerTotal: 2540.25, lines: [] },
  { id: 'CR00100', client: 'Sin cliente', dateLabel: '06 jul 2026', businessLine: 'Colección', status: 'Borrador', amount: 2694.6, headerTotal: 2694.6, lines: [] },
];

export const orderSummary: OrderSummary = {
  activeAmount: 15614.85,
  activeCount: 4,
  invoicedAmount: 2540.25,
  coleccionAmount: 15614.85,
  produccionAmount: 0,
};

export const phaseAccum: PhaseAccum[] = [
  { status: 'Borrador', count: 2, amount: 6424.6 },
  { status: 'Confirmado', count: 1, amount: 6650 },
  { status: 'En producción', count: 0, amount: 0 },
  { status: 'Enviado', count: 0, amount: 0 },
  { status: 'Entregado', count: 0, amount: 0 },
  { status: 'Facturado', count: 1, amount: 2540.25 },
];

const emptyYear: MonthSales[] = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'].map(
  (label) => ({ label, value: 0 })
);

export const salesByYear: Record<number, MonthSales[]> = {
  2026: emptyYear.map((m) => (m.label === 'Jul' ? { ...m, value: 2540.25 } : m)),
};

export function salesForYear(year: number): MonthSales[] {
  return salesByYear[year] ?? emptyYear;
}

/** Net unit price after discount (Neto €). */
export function lineNetUnit(l: OrderLine): number {
  return Math.round(l.price * (1 - l.discountPct / 100) * 100) / 100;
}

/** Line subtotal = qty × (net unit + extras per unit). */
export function lineSubtotal(l: OrderLine): number {
  return Math.round(l.qty * (lineNetUnit(l) + l.extrasPerUnit) * 100) / 100;
}

export function orderLinesTotal(lines: OrderLine[]): number {
  return Math.round(lines.reduce((sum, l) => sum + lineSubtotal(l), 0) * 100) / 100;
}
```

- [ ] **Step 7: Write the seed integrity test**

Create `src/features/cruda/data/seed.test.ts`:

```ts
import { test, expect } from 'vitest';
import { orders, orderLinesTotal, lineSubtotal, products } from './seed';

test('CR00103 line subtotals and total match the reference', () => {
  const cr = orders.find((o) => o.id === 'CR00103')!;
  expect(cr.lines.map((l) => lineSubtotal(l))).toEqual([1900, 3800, 950]);
  expect(orderLinesTotal(cr.lines)).toBe(6650);
});

test('seed has one product with three variants', () => {
  expect(products).toHaveLength(1);
  expect(products[0].variants).toHaveLength(3);
  expect(products[0].variants[2].stock).toBe(40);
});
```

- [ ] **Step 8: Run the data tests**

Run: `npx vitest run src/features/cruda/data/`
Expected: PASS (all tests in format.test.ts and seed.test.ts).

- [ ] **Step 9: Commit**

```bash
git add src/features/cruda/data
git commit -m "feat(cruda): data layer — types, es currency format, seed"
```

---

### Task 2: Badge indigo variant + CrudaStatusChip

**Files:**
- Modify: `src/components/ui/Badge.tsx` (add `indigo` variant)
- Create: `src/features/cruda/components/CrudaStatusChip.tsx`
- Test: `src/features/cruda/components/CrudaStatusChip.test.tsx`

**Interfaces:**
- Consumes: `OrderStatus` from `../data/types`.
- Produces: `<CrudaStatusChip status={OrderStatus} />`.

- [ ] **Step 1: Write the failing test**

Create `src/features/cruda/components/CrudaStatusChip.test.tsx`:

```tsx
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import { CrudaStatusChip } from './CrudaStatusChip';

test('renders status text with the exact palette classes', () => {
  const { rerender } = render(<CrudaStatusChip status="Confirmado" />);
  expect(screen.getByText('Confirmado').className).toContain('bg-blue-100');
  expect(screen.getByText('Confirmado').className).toContain('text-blue-700');

  rerender(<CrudaStatusChip status="Enviado" />);
  expect(screen.getByText('Enviado').className).toContain('bg-indigo-100');

  rerender(<CrudaStatusChip status="Facturado" />);
  const facturado = screen.getByText('Facturado');
  expect(facturado.className).toContain('bg-emerald-600');
  expect(facturado.className).toContain('text-white');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/cruda/components/CrudaStatusChip.test.tsx`
Expected: FAIL — cannot find module `./CrudaStatusChip`.

- [ ] **Step 3: Add the `indigo` variant to Badge**

In `src/components/ui/Badge.tsx`, add `'indigo'` to the `variant` union in `BadgeProps` (after `'sky'`), and add this line inside the class map object (after the `sky` line):

```tsx
          'bg-indigo-100 text-indigo-700': variant === 'indigo',
```

The union becomes: `... | 'sky' | 'indigo' | 'pink';`

- [ ] **Step 4: Implement `CrudaStatusChip.tsx`**

Create `src/features/cruda/components/CrudaStatusChip.tsx`:

```tsx
import { Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { OrderStatus } from '../data/types';
import type { BadgeProps } from '@/components/ui/Badge';

const VARIANT: Partial<Record<OrderStatus, BadgeProps['variant']>> = {
  Borrador: 'neutral',
  Confirmado: 'blue',
  'En producción': 'amber',
  Enviado: 'indigo',
  Entregado: 'emerald',
};

export function CrudaStatusChip({ status }: { status: OrderStatus }) {
  if (status === 'Facturado') {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-600 px-2.5 py-0.5 text-xs font-medium text-white">
        Facturado
      </span>
    );
  }
  if (status === 'Cancelado' || status === 'Anulado') {
    return (
      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-400">
        {status}
      </span>
    );
  }
  // Borrador must be slate-200 / slate-700 (not the lighter neutral default).
  if (status === 'Borrador') {
    return (
      <span className="inline-flex items-center rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-700">
        Borrador
      </span>
    );
  }
  return <Badge variant={VARIANT[status] ?? 'neutral'} className={cn()}>{status}</Badge>;
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/features/cruda/components/CrudaStatusChip.test.tsx src/components/ui/Badge.test.tsx`
Expected: PASS (new chip test + existing Badge tests still green).

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/Badge.tsx src/features/cruda/components/CrudaStatusChip.tsx src/features/cruda/components/CrudaStatusChip.test.tsx
git commit -m "feat(cruda): CrudaStatusChip + additive Badge indigo variant"
```

---

### Task 3: Shell + router + stub pages

**Files:**
- Modify: `src/features/modules/CrudaShell.tsx` (rewrite)
- Modify: `src/app/router.tsx` (nest /cruda routes)
- Create: `src/features/cruda/pages/PedidosPage.tsx` (stub)
- Create: `src/features/cruda/pages/CatalogoPage.tsx` (stub)
- Create: `src/features/cruda/pages/AnaliticaPage.tsx` (stub)
- Test: `src/features/cruda/CrudaShell.test.tsx`

**Interfaces:**
- Consumes: `AppLayout` from `@/components/layout`, `BarChart2` from `lucide-react`.
- Produces: `CrudaShell`, `PedidosPage`, `CatalogoPage`, `AnaliticaPage` (stubs, filled in later tasks).

- [ ] **Step 1: Write the failing shell test**

Create `src/features/cruda/CrudaShell.test.tsx`:

```tsx
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { test, expect } from 'vitest';
import { CrudaShell } from '@/features/modules/CrudaShell';
import { PedidosPage } from './pages/PedidosPage';

test('renders Pedidos/Catálogo tabs and an Analítica icon action', () => {
  render(
    <MemoryRouter initialEntries={['/cruda']}>
      <Routes>
        <Route path="/cruda" element={<CrudaShell />}>
          <Route index element={<PedidosPage />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
  expect(screen.getByRole('link', { name: 'Pedidos' })).toHaveAttribute('href', '/cruda');
  expect(screen.getByRole('link', { name: 'Catálogo' })).toHaveAttribute('href', '/cruda/catalogo');
  expect(screen.getByRole('link', { name: 'Analítica' })).toHaveAttribute('href', '/cruda/analitica');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/cruda/CrudaShell.test.tsx`
Expected: FAIL — cannot find module `./pages/PedidosPage` / rewritten shell.

- [ ] **Step 3: Create stub pages**

Create `src/features/cruda/pages/PedidosPage.tsx`:

```tsx
export function PedidosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Pedidos</h1>
        <p className="text-slate-500">Hojas de pedido de CRUDA: producto, cantidades y estado.</p>
      </div>
    </div>
  );
}
```

Create `src/features/cruda/pages/CatalogoPage.tsx`:

```tsx
export function CatalogoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Catálogo</h1>
        <p className="text-slate-500">Colecciones y productos de CRUDA.</p>
      </div>
    </div>
  );
}
```

Create `src/features/cruda/pages/AnaliticaPage.tsx`:

```tsx
export function AnaliticaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Analítica CRUDA</h1>
        <p className="text-slate-500">Ventas, líneas de negocio, productos y stock.</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Rewrite `CrudaShell.tsx`**

Replace the contents of `src/features/modules/CrudaShell.tsx` with:

```tsx
import { Outlet } from 'react-router';
import { BarChart2 } from 'lucide-react';
import { AppLayout } from '@/components/layout';
import type { User } from '@/types';

const mockUser: User = { id: '1', email: 'test@example.com', name: 'Test User', role: 'Admin' };

const tabs = [
  { label: 'Pedidos', href: '/cruda' },
  { label: 'Catálogo', href: '/cruda/catalogo' },
];

export function CrudaShell() {
  return (
    <AppLayout
      user={mockUser}
      module={{
        name: 'CRUDA',
        href: '/cruda',
        tabs,
        iconActions: [{ icon: BarChart2, href: '/cruda/analitica', label: 'Analítica' }],
      }}
    >
      <Outlet />
    </AppLayout>
  );
}
```

- [ ] **Step 5: Nest the routes in `router.tsx`**

In `src/app/router.tsx`, add these imports near the other feature imports:

```tsx
import { PedidosPage } from '@/features/cruda/pages/PedidosPage';
import { CatalogoPage } from '@/features/cruda/pages/CatalogoPage';
import { AnaliticaPage } from '@/features/cruda/pages/AnaliticaPage';
```

Replace the line `<Route path="/cruda" element={<CrudaShell />} />` with:

```tsx
      <Route path="/cruda" element={<CrudaShell />}>
        <Route index element={<PedidosPage />} />
        <Route path="catalogo" element={<CatalogoPage />} />
        <Route path="analitica" element={<AnaliticaPage />} />
      </Route>
```

- [ ] **Step 6: Run test + typecheck**

Run: `npx vitest run src/features/cruda/CrudaShell.test.tsx && npx tsc --noEmit`
Expected: PASS and no type errors.

- [ ] **Step 7: Commit**

```bash
git add src/features/cruda/pages src/features/modules/CrudaShell.tsx src/app/router.tsx src/features/cruda/CrudaShell.test.tsx
git commit -m "feat(cruda): real shell + nested routes + stub pages"
```

---

### Task 4: PhaseAccumCards + ProgressBar fillClassName

**Files:**
- Modify: `src/components/ui/ProgressBar.tsx` (add optional `fillClassName`)
- Create: `src/features/cruda/components/PhaseAccumCards.tsx`
- Test: `src/features/cruda/components/PhaseAccumCards.test.tsx`

**Interfaces:**
- Consumes: `phaseAccum` from `../data/seed`, `PhaseAccum` from `../data/types`, `eur`, `CrudaStatusChip`.
- Produces: `<PhaseAccumCards items={PhaseAccum[]} />` (horizontal scroll row on Pedidos; full-width grid on Analítica via `className`).
- Produces: `ProgressBar` now accepts `fillClassName?: string`.

- [ ] **Step 1: Write the failing test**

Create `src/features/cruda/components/PhaseAccumCards.test.tsx`:

```tsx
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import { PhaseAccumCards } from './PhaseAccumCards';
import { phaseAccum } from '../data/seed';

test('renders a card per phase with count and amount', () => {
  render(<PhaseAccumCards items={phaseAccum} />);
  expect(screen.getByText('Borrador')).toBeInTheDocument();
  expect(screen.getByText('6424,60 €')).toBeInTheDocument();
  expect(screen.getByText('6650,00 €')).toBeInTheDocument();
  // count badge for Borrador
  expect(screen.getByText('2')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/cruda/components/PhaseAccumCards.test.tsx`
Expected: FAIL — cannot find module `./PhaseAccumCards`.

- [ ] **Step 3: Add `fillClassName` to ProgressBar**

In `src/components/ui/ProgressBar.tsx`, add `fillClassName?: string;` to `ProgressBarProps`, destructure it (default `undefined`), and change the inner fill div to:

```tsx
      <div className={cn('h-full rounded-full', fillClassName ?? 'bg-emerald-500')} style={{ width: `${percent}%` }} />
```

Full updated file:

```tsx
import { cn } from '@/lib/utils';

export interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  fillClassName?: string;
}

export function ProgressBar({ value, max, className, fillClassName }: ProgressBarProps) {
  const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuenow={value}
      aria-valuemax={max}
      className={cn('h-2 w-full overflow-hidden rounded-full bg-slate-200', className)}
    >
      <div className={cn('h-full rounded-full', fillClassName ?? 'bg-emerald-500')} style={{ width: `${percent}%` }} />
    </div>
  );
}
```

- [ ] **Step 4: Implement `PhaseAccumCards.tsx`**

Create `src/features/cruda/components/PhaseAccumCards.tsx`:

```tsx
import { Card, ProgressBar } from '@/components/ui';
import { cn } from '@/lib/utils';
import { eur } from '../data/format';
import type { PhaseAccum } from '../data/types';

interface Props {
  items: PhaseAccum[];
  /** When true, lay the cards out as a full-width responsive grid (Analítica). */
  fullWidth?: boolean;
  className?: string;
}

export function PhaseAccumCards({ items, fullWidth = false, className }: Props) {
  const max = Math.max(...items.map((i) => i.amount), 1);
  return (
    <div className={className}>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Dinero acumulado por fase</p>
      <div
        className={cn(
          fullWidth
            ? 'grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6'
            : 'flex gap-3 overflow-x-auto pb-1'
        )}
      >
        {items.map((item) => (
          <Card key={item.status} className={cn('p-4', !fullWidth && 'min-w-[180px] shrink-0')}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">{item.status}</span>
              <span className="text-xs text-slate-400">{item.count}</span>
            </div>
            <p className="mt-2 text-lg font-semibold text-slate-800">{eur(item.amount)}</p>
            <ProgressBar
              value={item.amount}
              max={max}
              className="mt-2 h-1.5"
              fillClassName="bg-brand-600"
            />
          </Card>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/features/cruda/components/PhaseAccumCards.test.tsx src/components/ui/ProgressBar.test.tsx`
Expected: PASS (new test + existing ProgressBar tests still green).

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/ProgressBar.tsx src/features/cruda/components/PhaseAccumCards.tsx src/features/cruda/components/PhaseAccumCards.test.tsx
git commit -m "feat(cruda): PhaseAccumCards + additive ProgressBar fillClassName"
```

---

### Task 5: Pedidos list view (OrderSummaryPanel + OrderList + PedidosPage list mode)

**Files:**
- Create: `src/features/cruda/components/OrderSummaryPanel.tsx`
- Create: `src/features/cruda/components/OrderList.tsx`
- Modify: `src/features/cruda/pages/PedidosPage.tsx` (list mode)
- Test: `src/features/cruda/pages/PedidosPage.test.tsx`

**Interfaces:**
- Consumes: `orders`, `orderSummary`, `phaseAccum`, `ORDER_STATUSES` from `../data/seed`; `eur`; `CrudaStatusChip`; `PhaseAccumCards`; `Order` type.
- Produces: `<OrderSummaryPanel summary={OrderSummary} />`; `<OrderList orders={Order[]} onSelect={(id)=>void} onNew={()=>void} />`.

- [ ] **Step 1: Write the failing test**

Create `src/features/cruda/pages/PedidosPage.test.tsx`:

```tsx
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { test, expect } from 'vitest';
import { PedidosPage } from './PedidosPage';

test('renders order list, summary and phase cards', () => {
  render(<MemoryRouter><PedidosPage /></MemoryRouter>);
  expect(screen.getByRole('heading', { name: 'Pedidos', level: 1 })).toBeInTheDocument();
  expect(screen.getByText('CR00103 · New Era')).toBeInTheDocument();
  expect(screen.getByText('En curso (activos)')).toBeInTheDocument();
  expect(screen.getByText('15.614,85 €')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '+ Nuevo pedido' })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/cruda/pages/PedidosPage.test.tsx`
Expected: FAIL — the stub page has no list/summary text.

- [ ] **Step 3: Implement `OrderSummaryPanel.tsx`**

Create `src/features/cruda/components/OrderSummaryPanel.tsx`:

```tsx
import { Card } from '@/components/ui';
import { eur } from '../data/format';
import type { OrderSummary } from '../data/types';

export function OrderSummaryPanel({ summary }: { summary: OrderSummary }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card className="p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">En curso (activos)</p>
        <p className="mt-2 text-2xl font-semibold text-slate-800">{eur(summary.activeAmount)}</p>
        <p className="mt-0.5 text-xs text-slate-400">{summary.activeCount} pedidos</p>
      </Card>
      <Card className="p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Facturado</p>
        <p className="mt-2 text-2xl font-semibold text-emerald-600">{eur(summary.invoicedAmount)}</p>
      </Card>
      <Card className="p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Por línea de negocio</p>
        <p className="mt-2 text-sm text-slate-600">
          Colección <span className="font-semibold text-slate-800">{eur(summary.coleccionAmount)}</span>
        </p>
        <p className="text-sm text-slate-600">
          Producción <span className="font-semibold text-slate-800">{eur(summary.produccionAmount)}</span>
        </p>
      </Card>
    </div>
  );
}
```

- [ ] **Step 4: Implement `OrderList.tsx`**

Create `src/features/cruda/components/OrderList.tsx`:

```tsx
import { useMemo, useState } from 'react';
import { Button, Card, Input, Select } from '@/components/ui';
import { eur } from '../data/format';
import { CrudaStatusChip } from './CrudaStatusChip';
import { ORDER_STATUSES } from '../data/seed';
import type { Order } from '../data/types';

interface Props {
  orders: Order[];
  onSelect: (id: string) => void;
  onNew: () => void;
}

export function OrderList({ orders, onSelect, onNew }: Props) {
  const [query, setQuery] = useState('');
  const [line, setLine] = useState('');
  const [status, setStatus] = useState('');

  const filtered = useMemo(
    () =>
      orders.filter((o) => {
        const q = query.trim().toLowerCase();
        const matchesQuery = !q || o.id.toLowerCase().includes(q) || o.client.toLowerCase().includes(q);
        const matchesLine = !line || o.businessLine === line;
        const matchesStatus = !status || o.status === status;
        return matchesQuery && matchesLine && matchesStatus;
      }),
    [orders, query, line, status]
  );

  return (
    <div className="space-y-4">
      <Button className="w-full" onClick={onNew}>+ Nuevo pedido</Button>
      <Card className="space-y-3 p-3">
        <Input placeholder="Buscar por código o cliente…" value={query} onChange={(e) => setQuery(e.target.value)} />
        <Select value={line} onChange={(e) => setLine(e.target.value)}>
          <option value="">Todas las líneas de negocio</option>
          <option value="Colección">Colección</option>
          <option value="Producción">Producción (custom)</option>
        </Select>
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Todos los estados</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
          <option value="Anulado">Anulado</option>
        </Select>
      </Card>
      <Card className="divide-y divide-slate-100 p-0">
        {filtered.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onSelect(o.id)}
            className="block w-full px-4 py-3 text-left transition-colors hover:bg-slate-50"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-slate-900">{o.id} · {o.client}</p>
                <p className="text-sm text-slate-500">{o.dateLabel} · {o.businessLine}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1">
                  {o.reposicion && <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-700">Reposición</span>}
                  <CrudaStatusChip status={o.status} />
                </div>
                <span className="text-sm text-slate-500">{eur(o.amount)}</span>
              </div>
            </div>
          </button>
        ))}
      </Card>
    </div>
  );
}
```

- [ ] **Step 5: Implement `PedidosPage.tsx` (list mode only)**

Replace `src/features/cruda/pages/PedidosPage.tsx` with:

```tsx
import { useState } from 'react';
import { OrderList } from '../components/OrderList';
import { OrderSummaryPanel } from '../components/OrderSummaryPanel';
import { PhaseAccumCards } from '../components/PhaseAccumCards';
import { orders, orderSummary, phaseAccum } from '../data/seed';

export function PedidosPage() {
  // Local UI mode: list | detail | new. Detail/new wired in a later task.
  const [, setSelectedId] = useState<string | null>(null);
  const [, setCreating] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Pedidos</h1>
        <p className="text-slate-500">Hojas de pedido de CRUDA: producto, cantidades y estado.</p>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
        <OrderList orders={orders} onSelect={setSelectedId} onNew={() => setCreating(true)} />
        <div className="space-y-6">
          <OrderSummaryPanel summary={orderSummary} />
          <PhaseAccumCards items={phaseAccum} />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Run test + typecheck**

Run: `npx vitest run src/features/cruda/pages/PedidosPage.test.tsx && npx tsc --noEmit`
Expected: PASS and no type errors.

- [ ] **Step 7: Commit**

```bash
git add src/features/cruda/components/OrderSummaryPanel.tsx src/features/cruda/components/OrderList.tsx src/features/cruda/pages/PedidosPage.tsx src/features/cruda/pages/PedidosPage.test.tsx
git commit -m "feat(cruda): Pedidos list view — order list, summary, phase cards"
```

---

### Task 6: Order detail (OrderLinesTable + OrderDetail)

**Files:**
- Create: `src/features/cruda/components/OrderLinesTable.tsx`
- Create: `src/features/cruda/components/OrderDetail.tsx`
- Test: `src/features/cruda/components/OrderDetail.test.tsx`

**Interfaces:**
- Consumes: `Order`, `OrderLine`, `OrderStatus` types; `lineNetUnit`, `lineSubtotal`, `orderLinesTotal`, `ORDER_STATUSES`, `products` from `../data/seed`; `eur`; `CrudaStatusChip`.
- Produces: `<OrderDetail order={Order} onBack={()=>void} />`; `<OrderLinesTable lines={OrderLine[]} onChange={(lines)=>void} />`.

- [ ] **Step 1: Write the failing test**

Create `src/features/cruda/components/OrderDetail.test.tsx`:

```tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { test, expect, vi } from 'vitest';
import { OrderDetail } from './OrderDetail';
import { orders } from '../data/seed';

const cr = orders.find((o) => o.id === 'CR00103')!;

test('shows header, stepper, lines and totals; editing qty recalculates', () => {
  render(<OrderDetail order={cr} onBack={vi.fn()} />);
  expect(screen.getByRole('heading', { name: /CR00103/ })).toBeInTheDocument();
  expect(screen.getByText('Israel Cuenca', { exact: false })).toBeInTheDocument();
  // three line subtotals
  expect(screen.getByText('1900,00 €')).toBeInTheDocument();
  // total
  expect(screen.getAllByText('6650,00 €').length).toBeGreaterThan(0);

  // edit first qty 100 -> 10, subtotal becomes 10*19 = 190,00 €
  const qtyInputs = screen.getAllByLabelText('Cantidad');
  fireEvent.change(qtyInputs[0], { target: { value: '10' } });
  expect(screen.getByText('190,00 €')).toBeInTheDocument();
});

test('back button fires onBack', () => {
  const onBack = vi.fn();
  render(<OrderDetail order={cr} onBack={onBack} />);
  fireEvent.click(screen.getByRole('button', { name: '← Todos los pedidos' }));
  expect(onBack).toHaveBeenCalled();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/cruda/components/OrderDetail.test.tsx`
Expected: FAIL — cannot find module `./OrderDetail`.

- [ ] **Step 3: Implement `OrderLinesTable.tsx`**

Create `src/features/cruda/components/OrderLinesTable.tsx`:

```tsx
import { Select } from '@/components/ui';
import { eur } from '../data/format';
import { lineNetUnit, lineSubtotal, orderLinesTotal, products } from '../data/seed';
import type { OrderLine } from '../data/types';

interface Props {
  lines: OrderLine[];
  onChange: (lines: OrderLine[]) => void;
}

export function OrderLinesTable({ lines, onChange }: Props) {
  const update = (id: string, patch: Partial<OrderLine>) =>
    onChange(lines.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  const remove = (id: string) => onChange(lines.filter((l) => l.id !== id));

  const num = (v: string) => (v === '' ? 0 : Number(v));
  const total = orderLinesTotal(lines);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
              <th className="px-2 py-2 font-medium">Descripción</th>
              <th className="px-2 py-2 font-medium">SKU</th>
              <th className="px-2 py-2 font-medium">Talla</th>
              <th className="px-2 py-2 font-medium">Color</th>
              <th className="px-2 py-2 font-medium">Cant.</th>
              <th className="px-2 py-2 font-medium">Precio €</th>
              <th className="px-2 py-2 font-medium">Dto %</th>
              <th className="px-2 py-2 font-medium">Neto €</th>
              <th className="px-2 py-2 font-medium">PVP €</th>
              <th className="px-2 py-2 font-medium">×</th>
              <th className="px-2 py-2 font-medium">Subtotal</th>
              <th className="px-2 py-2 font-medium">Extras</th>
              <th className="px-2 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {lines.map((l) => (
              <tr key={l.id}>
                <td className="px-2 py-2 text-slate-700">{l.description}</td>
                <td className="px-2 py-2 text-slate-500">{l.sku}</td>
                <td className="px-2 py-2 text-slate-500">{l.size}</td>
                <td className="px-2 py-2 text-slate-500">{l.color}</td>
                <td className="px-2 py-2">
                  <input aria-label="Cantidad" type="number" value={l.qty}
                    onChange={(e) => update(l.id, { qty: num(e.target.value) })}
                    className="h-8 w-16 rounded-md border border-slate-200 px-2 text-sm" />
                </td>
                <td className="px-2 py-2 text-slate-600">{eur(l.price)}</td>
                <td className="px-2 py-2">
                  <input aria-label="Descuento" type="number" value={l.discountPct}
                    onChange={(e) => update(l.id, { discountPct: num(e.target.value) })}
                    className="h-8 w-14 rounded-md border border-slate-200 px-2 text-sm" />
                </td>
                <td className="px-2 py-2 text-slate-600" title="Precio unitario tras descuento">{eur(lineNetUnit(l))}</td>
                <td className="px-2 py-2">
                  <input aria-label="PVP" type="number" value={l.pvp}
                    onChange={(e) => update(l.id, { pvp: num(e.target.value) })}
                    className="h-8 w-16 rounded-md border border-slate-200 px-2 text-sm" />
                </td>
                <td className="px-2 py-2">
                  <input aria-label="Multiplicador" type="number" value={l.multiplier}
                    onChange={(e) => update(l.id, { multiplier: num(e.target.value) })}
                    className="h-8 w-14 rounded-md border border-slate-200 px-2 text-sm" />
                </td>
                <td className="px-2 py-2 font-medium text-slate-800">{eur(lineSubtotal(l))}</td>
                <td className="px-2 py-2">
                  <button type="button" className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50">
                    Extras ({l.extrasCount})
                  </button>
                </td>
                <td className="px-2 py-2">
                  <button type="button" aria-label="Eliminar línea" onClick={() => remove(l.id)}
                    className="text-slate-400 hover:text-red-500">✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddLineRow />

      <div className="mt-4 flex justify-end gap-6 text-sm">
        <span className="text-slate-500">Bruto: <span className="font-medium text-slate-700">{eur(total)}</span></span>
        <span className="text-slate-500">Total: <span className="font-semibold text-slate-900">{eur(total)}</span></span>
      </div>
    </div>
  );
}

function AddLineRow() {
  return (
    <div className="mt-4 rounded-lg border border-slate-100 p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Añadir línea</p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
        <Select label="Producto" defaultValue="">
          <option value="">Libre…</option>
          {products.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
        </Select>
        <Select label="Variante" disabled>
          <option>Sin variantes</option>
        </Select>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Descripción *</label>
          <input className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Cant.</label>
          <input type="number" defaultValue={1} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Precio</label>
          <input type="number" defaultValue={0} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" />
        </div>
      </div>
      <button type="button" className="mt-3 inline-flex h-10 items-center rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white hover:bg-brand-700">
        + Añadir línea
      </button>
    </div>
  );
}
```

- [ ] **Step 4: Implement `OrderDetail.tsx`**

Create `src/features/cruda/components/OrderDetail.tsx`:

```tsx
import { useState } from 'react';
import { Badge, Button, Card } from '@/components/ui';
import { cn } from '@/lib/utils';
import { eur } from '../data/format';
import { ORDER_STATUSES } from '../data/seed';
import { OrderLinesTable } from './OrderLinesTable';
import type { Order, OrderLine, OrderStatus } from '../data/types';

export function OrderDetail({ order, onBack }: { order: Order; onBack: () => void }) {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [lines, setLines] = useState<OrderLine[]>(order.lines);

  return (
    <div className="space-y-6">
      <button type="button" onClick={onBack} className="text-sm font-medium text-brand-700 hover:text-brand-800">
        ← Todos los pedidos
      </button>

      <Card className="space-y-4 p-6">
        <div className="flex items-start justify-between">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
            {order.id}
            <Badge variant="neutral">{order.businessLine}</Badge>
          </h2>
          <span className="text-xl font-semibold text-slate-900">{eur(order.headerTotal)}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {ORDER_STATUSES.map((s) => (
            <button key={s} type="button" onClick={() => setStatus(s)}
              className={cn(
                'rounded-full border px-3 py-1 text-sm transition-colors',
                s === status ? 'border-brand-400 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
              )}>
              {s}
            </button>
          ))}
          <button type="button" className="ml-auto text-sm text-slate-400 hover:text-slate-600">Anular</button>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50">Descontar del stock</button>
          <button type="button" className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50">Hoja de pedido (PDF)</button>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Badge variant="neutral">{order.businessLine}</Badge>
            <span className="font-medium text-slate-800">{order.client}</span>
            <span>Fecha: {order.dateLabel}</span>
            {order.responsible && <span>Resp.: {order.responsible}</span>}
          </div>
          <Button variant="secondary">Modificar</Button>
        </div>
      </Card>

      <Card className="space-y-4 p-6">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Líneas del pedido</h3>
        <OrderLinesTable lines={lines} onChange={setLines} />
      </Card>

      <Card className="space-y-3 p-6">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Portal de reposiciones (CRUDA)</h3>
        <p className="text-sm text-slate-500">Da acceso a este cliente para que pida sus reposiciones de forma autónoma. Verá solo su catálogo y sus pedidos.</p>
        <div className="flex gap-2">
          <input placeholder="email@cliente.com" className="h-10 flex-1 rounded-lg border border-slate-200 px-3 text-sm" />
          <Button variant="secondary">Invitar</Button>
        </div>
        <p className="text-xs text-slate-400">Se le enviará un email para crear su contraseña. Requiere permiso de gestión de usuarios.</p>
      </Card>
    </div>
  );
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/features/cruda/components/OrderDetail.test.tsx`
Expected: PASS (both tests).

- [ ] **Step 6: Commit**

```bash
git add src/features/cruda/components/OrderLinesTable.tsx src/features/cruda/components/OrderDetail.tsx src/features/cruda/components/OrderDetail.test.tsx
git commit -m "feat(cruda): order detail — status stepper, editable lines, totals, portal"
```

---

### Task 7: New order form + wire PedidosPage mode swap

**Files:**
- Create: `src/features/cruda/components/NewOrderForm.tsx`
- Modify: `src/features/cruda/pages/PedidosPage.tsx` (wire list/detail/new)
- Modify: `src/features/cruda/pages/PedidosPage.test.tsx` (add swap tests)

**Interfaces:**
- Consumes: `SegmentedControl`, `Select`, `Input`, `Textarea`, `Button`, `Card` from `@/components/ui`; `collections` from `../data/seed`.
- Produces: `<NewOrderForm onCancel={()=>void} onCreate={()=>void} />`.

- [ ] **Step 1: Extend the failing test**

Append to `src/features/cruda/pages/PedidosPage.test.tsx`:

```tsx
import { fireEvent } from '@testing-library/react';

test('selecting an order shows its detail; back returns to the list', () => {
  render(<MemoryRouter><PedidosPage /></MemoryRouter>);
  fireEvent.click(screen.getByText('CR00103 · New Era'));
  expect(screen.getByRole('heading', { name: /CR00103/ })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: '← Todos los pedidos' }));
  expect(screen.getByText('En curso (activos)')).toBeInTheDocument();
});

test('new order button shows the creation form', () => {
  render(<MemoryRouter><PedidosPage /></MemoryRouter>);
  fireEvent.click(screen.getByRole('button', { name: '+ Nuevo pedido' }));
  expect(screen.getByRole('heading', { name: 'Nuevo pedido' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Crear pedido' })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/cruda/pages/PedidosPage.test.tsx`
Expected: FAIL — detail/new not wired yet.

- [ ] **Step 3: Implement `NewOrderForm.tsx`**

Create `src/features/cruda/components/NewOrderForm.tsx`:

```tsx
import { useState } from 'react';
import { Button, Card, Input, SegmentedControl, Select, Textarea } from '@/components/ui';
import { collections } from '../data/seed';

export function NewOrderForm({ onCancel, onCreate }: { onCancel: () => void; onCreate: () => void }) {
  const [line, setLine] = useState<'coleccion' | 'produccion'>('coleccion');

  return (
    <Card className="space-y-5 p-6">
      <h2 className="text-xl font-bold text-slate-900">Nuevo pedido</h2>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Línea de negocio</label>
        <SegmentedControl
          fullWidth
          value={line}
          onChange={setLine}
          options={[{ label: 'Colección', value: 'coleccion' }, { label: 'Producción (custom)', value: 'produccion' }]}
        />
        <p className="mt-1 text-xs text-slate-400">Colección = venta de prenda ya confeccionada (a veces en stock). Producción = merch a medida.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">Cliente</label>
            <span className="text-sm text-brand-700">Abrir CRM ↗</span>
          </div>
          <Input placeholder="Buscar o crear cliente…" />
        </div>
        <Select label="Colección" defaultValue="">
          <option value="">—</option>
          {collections.map((c) => (<option key={c} value={c}>{c}</option>))}
        </Select>
        <Input label="Fecha" type="date" defaultValue="2026-07-09" />
        <Input label="Entrega prevista" type="date" placeholder="dd/mm/aaaa" />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Responsable</label>
          <button type="button" className="flex h-10 items-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 text-sm text-slate-500">
            <span className="grid h-5 w-5 place-items-center rounded-full border border-slate-300">+</span> Asignar
          </button>
        </div>
        <Input label="Descuento global (%)" type="number" defaultValue={0} />
      </div>

      <Input label="Dirección de envío" placeholder="Dirección de envío" />
      <Textarea label="Notas" />

      <div className="flex items-center gap-3">
        <Button onClick={onCreate}>Crear pedido</Button>
        <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
      </div>
      <p className="text-xs text-slate-400">Guarda los datos para empezar a añadir líneas, gestionar el estado y el stock.</p>
    </Card>
  );
}
```

- [ ] **Step 4: Wire `PedidosPage.tsx`**

Replace `src/features/cruda/pages/PedidosPage.tsx` with:

```tsx
import { useState } from 'react';
import { OrderList } from '../components/OrderList';
import { OrderSummaryPanel } from '../components/OrderSummaryPanel';
import { PhaseAccumCards } from '../components/PhaseAccumCards';
import { OrderDetail } from '../components/OrderDetail';
import { NewOrderForm } from '../components/NewOrderForm';
import { orders, orderSummary, phaseAccum } from '../data/seed';

type Mode = { kind: 'list' } | { kind: 'detail'; id: string } | { kind: 'new' };

export function PedidosPage() {
  const [mode, setMode] = useState<Mode>({ kind: 'list' });

  const header = (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Pedidos</h1>
      <p className="text-slate-500">Hojas de pedido de CRUDA: producto, cantidades y estado.</p>
    </div>
  );

  if (mode.kind === 'detail') {
    const order = orders.find((o) => o.id === mode.id)!;
    return (
      <div className="space-y-6">
        {header}
        <OrderDetail order={order} onBack={() => setMode({ kind: 'list' })} />
      </div>
    );
  }

  if (mode.kind === 'new') {
    return (
      <div className="space-y-6">
        {header}
        <button type="button" onClick={() => setMode({ kind: 'list' })} className="text-sm font-medium text-brand-700 hover:text-brand-800">
          ← Todos los pedidos
        </button>
        <NewOrderForm onCancel={() => setMode({ kind: 'list' })} onCreate={() => setMode({ kind: 'list' })} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {header}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
        <OrderList orders={orders} onSelect={(id) => setMode({ kind: 'detail', id })} onNew={() => setMode({ kind: 'new' })} />
        <div className="space-y-6">
          <OrderSummaryPanel summary={orderSummary} />
          <PhaseAccumCards items={phaseAccum} />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Run tests + typecheck**

Run: `npx vitest run src/features/cruda/pages/PedidosPage.test.tsx && npx tsc --noEmit`
Expected: PASS (all 4 tests) and no type errors.

- [ ] **Step 6: Commit**

```bash
git add src/features/cruda/components/NewOrderForm.tsx src/features/cruda/pages/PedidosPage.tsx src/features/cruda/pages/PedidosPage.test.tsx
git commit -m "feat(cruda): new order form + Pedidos list/detail/new view swap"
```

---

### Task 8: Catálogo page (chips, tables, variable editors)

**Files:**
- Create: `src/features/cruda/components/CollectionChips.tsx`
- Create: `src/features/cruda/components/ProductsTable.tsx`
- Create: `src/features/cruda/components/TopProductsTable.tsx`
- Create: `src/features/cruda/components/StockAlerts.tsx`
- Create: `src/features/cruda/components/ExtrasTable.tsx`
- Create: `src/features/cruda/components/VariableChips.tsx`
- Modify: `src/features/cruda/pages/CatalogoPage.tsx`
- Test: `src/features/cruda/pages/CatalogoPage.test.tsx`, `src/features/cruda/components/VariableChips.test.tsx`

**Interfaces:**
- Consumes: `products`, `extras`, `collections`, `variables` from `../data/seed`; `eur`; `Product`, `Extra` types; `Card`, `Button`, `Input`.
- Produces: `<CollectionChips collections onSelect />`, `<ProductsTable products onOpen />`, `<TopProductsTable products />`, `<StockAlerts products />`, `<ExtrasTable extras />`, `<VariableChips label values />`.

- [ ] **Step 1: Write the failing VariableChips test**

Create `src/features/cruda/components/VariableChips.test.tsx`:

```tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { test, expect } from 'vitest';
import { VariableChips } from './VariableChips';

test('adds and removes chips in local state', () => {
  render(<VariableChips label="Acabados" initial={['Algodón', 'Lino']} />);
  expect(screen.getByText('Algodón')).toBeInTheDocument();

  fireEvent.change(screen.getByPlaceholderText('Añadir…'), { target: { value: 'Seda' } });
  fireEvent.click(screen.getByRole('button', { name: '+' }));
  expect(screen.getByText('Seda')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Quitar Algodón' }));
  expect(screen.queryByText('Algodón')).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/cruda/components/VariableChips.test.tsx`
Expected: FAIL — cannot find module `./VariableChips`.

- [ ] **Step 3: Implement `VariableChips.tsx`**

Create `src/features/cruda/components/VariableChips.tsx`:

```tsx
import { useState } from 'react';
import { Card } from '@/components/ui';

export function VariableChips({ label, initial }: { label: string; initial: string[] }) {
  const [values, setValues] = useState<string[]>(initial);
  const [draft, setDraft] = useState('');

  const add = () => {
    const v = draft.trim();
    if (v && !values.includes(v)) setValues([...values, v]);
    setDraft('');
  };

  return (
    <Card className="p-4">
      <p className="mb-3 text-sm font-medium text-slate-700">{label}</p>
      <div className="mb-3 flex flex-wrap gap-2">
        {values.map((v) => (
          <span key={v} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-sm text-slate-600">
            {v}
            <button type="button" aria-label={`Quitar ${v}`} onClick={() => setValues(values.filter((x) => x !== v))}
              className="text-slate-400 hover:text-red-500">✕</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Añadir…"
          className="h-9 flex-1 rounded-lg border border-slate-200 px-3 text-sm" />
        <button type="button" aria-label="+" onClick={add}
          className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">+</button>
      </div>
    </Card>
  );
}
```

- [ ] **Step 4: Run the VariableChips test**

Run: `npx vitest run src/features/cruda/components/VariableChips.test.tsx`
Expected: PASS.

- [ ] **Step 5: Implement `CollectionChips.tsx`**

Create `src/features/cruda/components/CollectionChips.tsx`:

```tsx
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function CollectionChips({ collections, onSelect }: { collections: string[]; onSelect?: (c: string) => void }) {
  const [active, setActive] = useState('Todas');
  const pick = (c: string) => { setActive(c); onSelect?.(c); };
  const chip = (c: string, count?: number) => (
    <button key={c} type="button" onClick={() => pick(c)}
      className={cn('inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium',
        active === c ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')}>
      {c}{count !== undefined && <span className="opacity-70">{count}</span>}
    </button>
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chip('Todas', collections.length)}
      {collections.map((c) => (
        <span key={c} className="inline-flex items-center gap-1">
          {chip(c, 1)}
          <button type="button" aria-label={`Editar ${c}`} className="text-slate-400 hover:text-slate-600">✎</button>
        </span>
      ))}
      {chip('Sin colección')}
    </div>
  );
}
```

- [ ] **Step 6: Implement `ProductsTable.tsx`**

Create `src/features/cruda/components/ProductsTable.tsx`:

```tsx
import { useState } from 'react';
import { Card } from '@/components/ui';
import { eur } from '../data/format';
import type { Product } from '../data/types';

export function ProductsTable({ products, onOpen }: { products: Product[]; onOpen: (id: string) => void }) {
  const [query, setQuery] = useState('');
  const filtered = products.filter((p) => {
    const q = query.trim().toLowerCase();
    return !q || p.name.toLowerCase().includes(q) || p.variants.some((v) => v.sku.toLowerCase().includes(q));
  });
  const stock = (p: Product) => p.variants.reduce((s, v) => s + v.stock, 0);

  return (
    <div className="space-y-3">
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por nombre o SKU…"
        className="h-11 w-full rounded-lg border border-slate-200 px-4 text-sm" />
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3 font-medium">Producto</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Colección</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Precio</th>
              <th className="px-4 py-3 font-medium text-right">Margen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((p) => {
              const v0 = p.variants[0];
              return (
                <tr key={p.id} onClick={() => onOpen(p.id)} className="cursor-pointer hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-3">
                      <span className="grid h-8 w-8 place-items-center rounded-md bg-slate-100 text-slate-400">👕</span>
                      <span className="font-medium text-slate-800">{p.name}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{p.type === 'variantes' ? `${p.variants.length} variantes` : 'Producto único'}</td>
                  <td className="px-4 py-3 text-slate-500">{p.collection}</td>
                  <td className="px-4 py-3 text-slate-500">{stock(p)} uds</td>
                  <td className="px-4 py-3 text-slate-700">{eur(v0.price)}</td>
                  <td className="px-4 py-3 text-right font-medium text-emerald-600">{eur(v0.price - v0.cost)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
```

- [ ] **Step 7: Implement `TopProductsTable.tsx`**

Create `src/features/cruda/components/TopProductsTable.tsx`:

```tsx
import { Card } from '@/components/ui';
import { eur } from '../data/format';
import type { Product } from '../data/types';

export function TopProductsTable({ products }: { products: Product[] }) {
  return (
    <Card className="p-5">
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">Productos más vendidos</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
            <th className="pb-2 font-medium">Producto</th>
            <th className="pb-2 font-medium text-right">Unidades</th>
            <th className="pb-2 font-medium text-right">Valor</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t border-slate-100">
              <td className="py-2 text-slate-700">{p.name}</td>
              <td className="py-2 text-right text-slate-600">{p.soldUnits}</td>
              <td className="py-2 text-right font-medium text-slate-800">{eur(p.soldValue)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
```

- [ ] **Step 8: Implement `StockAlerts.tsx`**

Create `src/features/cruda/components/StockAlerts.tsx`:

```tsx
import { Card } from '@/components/ui';
import { eur } from '../data/format';
import type { Product } from '../data/types';

export function StockAlerts({ products }: { products: Product[] }) {
  const variants = products.flatMap((p) => p.variants.map((v) => ({ p, v })));
  const totalUnits = variants.reduce((s, { v }) => s + v.stock, 0);
  const totalCost = variants.reduce((s, { v }) => s + v.stock * v.cost, 0);
  const low = variants.filter(({ v }) => v.stock <= v.min);

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Alertas de stock</h2>
        <span className="text-xs text-slate-400">{totalUnits} uds · valor a coste {eur(totalCost)}</span>
      </div>
      <p className="mb-3 text-sm text-red-600">{low.length} variante(s) en o por debajo del mínimo:</p>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
            <th className="pb-2 font-medium">Variante</th>
            <th className="pb-2 font-medium text-right">Stock</th>
            <th className="pb-2 font-medium text-right">Mín.</th>
          </tr>
        </thead>
        <tbody>
          {low.map(({ p, v }) => (
            <tr key={v.id} className="border-t border-slate-100">
              <td className="py-2 text-slate-700">{p.name} <span className="text-slate-400">· {v.finish} / {v.size} / {v.color}</span></td>
              <td className="py-2 text-right font-medium text-red-600">{v.stock}</td>
              <td className="py-2 text-right text-slate-500">{v.min}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
```

- [ ] **Step 9: Implement `ExtrasTable.tsx`**

Create `src/features/cruda/components/ExtrasTable.tsx`:

```tsx
import { Card } from '@/components/ui';
import { eur } from '../data/format';
import type { Extra } from '../data/types';

export function ExtrasTable({ extras }: { extras: Extra[] }) {
  return (
    <Card className="overflow-hidden p-0">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
            <th className="px-4 py-3 font-medium">Extra</th>
            <th className="px-4 py-3 font-medium">Tipo</th>
            <th className="px-4 py-3 font-medium">Modo</th>
            <th className="px-4 py-3 font-medium text-right">Precio</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {extras.map((e) => (
            <tr key={e.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-medium text-slate-800">{e.name}</td>
              <td className="px-4 py-3 text-slate-500">{e.type}</td>
              <td className="px-4 py-3 text-slate-500">{e.mode}</td>
              <td className="px-4 py-3 text-right text-slate-700">{eur(e.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
```

- [ ] **Step 10: Write the failing CatalogoPage test**

Create `src/features/cruda/pages/CatalogoPage.test.tsx`:

```tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { test, expect } from 'vitest';
import { CatalogoPage } from './CatalogoPage';

test('renders all catalog sections', () => {
  render(<CatalogoPage />);
  expect(screen.getByRole('heading', { name: 'Catálogo', level: 1 })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Colecciones' })).toBeInTheDocument();
  expect(screen.getByText('(Test) Camiseta A&F')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Productos más vendidos' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Alertas de stock' })).toBeInTheDocument();
  expect(screen.getByText('Bolsa Cierre Zip')).toBeInTheDocument();
  expect(screen.getByText('Acabados')).toBeInTheDocument();
  expect(screen.getByText('Tallas')).toBeInTheDocument();
  expect(screen.getByText('Colores')).toBeInTheDocument();
});

test('opening a product row shows the product modal', () => {
  render(<CatalogoPage />);
  fireEvent.click(screen.getByText('(Test) Camiseta A&F'));
  expect(screen.getByRole('dialog')).toBeInTheDocument();
});
```

- [ ] **Step 11: Implement `CatalogoPage.tsx` (ProductModal wired in Task 9)**

Replace `src/features/cruda/pages/CatalogoPage.tsx` with:

```tsx
import { useState } from 'react';
import { Button } from '@/components/ui';
import { CollectionChips } from '../components/CollectionChips';
import { ProductsTable } from '../components/ProductsTable';
import { TopProductsTable } from '../components/TopProductsTable';
import { StockAlerts } from '../components/StockAlerts';
import { ExtrasTable } from '../components/ExtrasTable';
import { VariableChips } from '../components/VariableChips';
import { ProductModal } from '../components/ProductModal';
import { products, extras, collections, variables } from '../data/seed';

export function CatalogoPage() {
  const [openProductId, setOpenProductId] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Catálogo</h1>
        <p className="text-slate-500">Colecciones y productos de CRUDA.</p>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Colecciones</h2>
          <span className="text-sm text-brand-700">+ Nueva colección</span>
        </div>
        <CollectionChips collections={collections} />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Productos</h2>
          <Button onClick={() => setOpenProductId('new')}>+ Nuevo producto</Button>
        </div>
        <ProductsTable products={products} onOpen={setOpenProductId} />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TopProductsTable products={products} />
        <StockAlerts products={products} />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Extras (packaging, personalización…)</h2>
          <Button variant="secondary">+ Nuevo extra</Button>
        </div>
        <ExtrasTable extras={extras} />
      </section>

      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Variables de producto</h2>
        <p className="text-sm text-slate-400">Valores permitidos para las variantes. Al crear una variante se eligen de aquí, así fábrica recibe siempre los mismos términos.</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <VariableChips label="Acabados" initial={variables.finishes} />
          <VariableChips label="Tallas" initial={variables.sizes} />
          <VariableChips label="Colores" initial={variables.colors} />
        </div>
      </section>

      <ProductModal
        open={openProductId !== null}
        productId={openProductId}
        onClose={() => setOpenProductId(null)}
      />
    </div>
  );
}
```

> Note: `ProductModal` is created in Task 9. To keep this task independently testable, create a minimal placeholder now and flesh it out next. Create `src/features/cruda/components/ProductModal.tsx` with the stub in Task 9 Step 3 BEFORE running this task's tests — or reorder so Task 9 precedes running Task 8's `CatalogoPage.test.tsx`. Recommended: run Task 8 tests except the "modal" test, then complete Task 9, then run both.

- [ ] **Step 12: Create a temporary ProductModal stub so Catálogo compiles**

Create `src/features/cruda/components/ProductModal.tsx` (temporary; replaced in Task 9):

```tsx
import { Modal } from '@/components/ui';

export function ProductModal({ open, onClose }: { open: boolean; productId: string | null; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Producto">
      <div />
    </Modal>
  );
}
```

- [ ] **Step 13: Run tests + typecheck**

Run: `npx vitest run src/features/cruda/pages/CatalogoPage.test.tsx src/features/cruda/components/VariableChips.test.tsx && npx tsc --noEmit`
Expected: PASS and no type errors.

- [ ] **Step 14: Commit**

```bash
git add src/features/cruda/components/CollectionChips.tsx src/features/cruda/components/ProductsTable.tsx src/features/cruda/components/TopProductsTable.tsx src/features/cruda/components/StockAlerts.tsx src/features/cruda/components/ExtrasTable.tsx src/features/cruda/components/VariableChips.tsx src/features/cruda/components/ProductModal.tsx src/features/cruda/pages/CatalogoPage.tsx src/features/cruda/pages/CatalogoPage.test.tsx src/features/cruda/components/VariableChips.test.tsx
git commit -m "feat(cruda): Catálogo page — chips, products/extras tables, stock alerts, variable editors"
```

---

### Task 9: Product modal (form + variants table)

**Files:**
- Modify: `src/features/cruda/components/ProductModal.tsx` (replace stub)
- Test: `src/features/cruda/components/ProductModal.test.tsx`

**Interfaces:**
- Consumes: `Modal`, `Input`, `Select`, `Textarea`, `Button`, `SegmentedControl` from `@/components/ui`; `products`, `variables` from `../data/seed`; `eur`; `Product`, `Variant` types.
- Produces: `<ProductModal open productId onClose />` (productId `'new'` = empty form; an existing id = prefilled).

- [ ] **Step 1: Write the failing test**

Create `src/features/cruda/components/ProductModal.test.tsx`:

```tsx
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { test, expect, vi } from 'vitest';
import { ProductModal } from './ProductModal';

test('prefills an existing product and lists its variants', () => {
  render(<ProductModal open productId="p1" onClose={vi.fn()} />);
  expect(screen.getByDisplayValue('(Test) Camiseta A&F')).toBeInTheDocument();
  expect(screen.getByText('Stock total: 340 uds')).toBeInTheDocument();
  expect(screen.getByDisplayValue('4878test01')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Guardar' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Eliminar' })).toBeInTheDocument();
});

test('renders empty form for a new product', () => {
  render(<ProductModal open productId="new" onClose={vi.fn()} />);
  expect(screen.getByText('Con variantes')).toBeInTheDocument();
  expect(screen.getByText('Producto único')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/cruda/components/ProductModal.test.tsx`
Expected: FAIL — stub modal has no fields.

- [ ] **Step 3: Replace `ProductModal.tsx`**

Replace `src/features/cruda/components/ProductModal.tsx` with:

```tsx
import { useMemo, useState } from 'react';
import { Button, Input, Modal, SegmentedControl, Select, Textarea } from '@/components/ui';
import { eur } from '../data/format';
import { products, variables } from '../data/seed';
import type { Variant } from '../data/types';

const EMPTY_VARIANT: Omit<Variant, 'id'> = {
  sku: '', finish: '—', size: '—', color: '—', price: 0, cost: 0, pvp: 0, multiplier: 0, stock: 0, min: 0,
};

export function ProductModal({ open, productId, onClose }: { open: boolean; productId: string | null; onClose: () => void }) {
  const product = useMemo(() => products.find((p) => p.id === productId) ?? null, [productId]);

  const [name, setName] = useState(product?.name ?? '');
  const [type, setType] = useState<'variantes' | 'unico'>(product?.type ?? 'variantes');
  const [active, setActive] = useState(product?.active ?? true);
  const [variants, setVariants] = useState<Variant[]>(product?.variants ?? []);

  const stockTotal = variants.reduce((s, v) => s + v.stock, 0);
  const num = (v: string) => (v === '' ? 0 : Number(v));
  const update = (id: string, patch: Partial<Variant>) => setVariants(variants.map((v) => (v.id === id ? { ...v, ...patch } : v)));
  const remove = (id: string) => setVariants(variants.filter((v) => v.id !== id));

  return (
    <Modal open={open} onClose={onClose} className="max-w-4xl">
      <div className="space-y-5">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Producto</h3>
          <p className="text-sm text-slate-400">La prenda "madre" solo lleva nombre, colección e imagen. El SKU, precio y coste van en cada variante (salvo que sea un producto único).</p>
        </div>

        <Input label="Nombre *" value={name} onChange={(e) => setName(e.target.value)} />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Tipo de producto</label>
          <SegmentedControl
            value={type}
            onChange={setType}
            options={[{ label: 'Con variantes', value: 'variantes' }, { label: 'Producto único', value: 'unico' }]}
          />
          <p className="mt-1 text-xs text-slate-400">Con variantes: cada combinación de acabado/talla/color con su SKU, precio y coste. Único: talla y acabado únicos, datos en el propio producto.</p>
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} /> Activo
        </label>

        <Textarea label="Notas" defaultValue={product?.notes ?? ''} />

        <div>
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-700">Variantes</h4>
            <span className="text-sm text-slate-400">Stock total: {stockTotal} uds</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-2 py-2 font-medium">SKU</th>
                  <th className="px-2 py-2 font-medium">Acabado</th>
                  <th className="px-2 py-2 font-medium">Talla</th>
                  <th className="px-2 py-2 font-medium">Color</th>
                  <th className="px-2 py-2 font-medium">Precio €</th>
                  <th className="px-2 py-2 font-medium">Coste €</th>
                  <th className="px-2 py-2 font-medium">Margen</th>
                  <th className="px-2 py-2 font-medium">Stock</th>
                  <th className="px-2 py-2 font-medium">Mín.</th>
                  <th className="px-2 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {variants.map((v) => (
                  <tr key={v.id}>
                    <td className="px-2 py-2">
                      <input value={v.sku} onChange={(e) => update(v.id, { sku: e.target.value })} className="h-8 w-24 rounded-md border border-slate-200 px-2 text-sm" />
                    </td>
                    <td className="px-2 py-2">
                      <Select className="h-8 w-24" value={v.finish} onChange={(e) => update(v.id, { finish: e.target.value })}>
                        <option>—</option>{variables.finishes.map((f) => <option key={f}>{f}</option>)}
                      </Select>
                    </td>
                    <td className="px-2 py-2">
                      <Select className="h-8 w-20" value={v.size} onChange={(e) => update(v.id, { size: e.target.value })}>
                        <option>—</option>{variables.sizes.map((s) => <option key={s}>{s}</option>)}
                      </Select>
                    </td>
                    <td className="px-2 py-2">
                      <Select className="h-8 w-24" value={v.color} onChange={(e) => update(v.id, { color: e.target.value })}>
                        <option>—</option>{variables.colors.map((c) => <option key={c}>{c}</option>)}
                      </Select>
                    </td>
                    <td className="px-2 py-2">
                      <input type="number" value={v.price} onChange={(e) => update(v.id, { price: num(e.target.value) })} className="h-8 w-20 rounded-md border border-slate-200 px-2 text-sm" />
                    </td>
                    <td className="px-2 py-2">
                      <input type="number" value={v.cost} onChange={(e) => update(v.id, { cost: num(e.target.value) })} className="h-8 w-20 rounded-md border border-slate-200 px-2 text-sm" />
                    </td>
                    <td className="px-2 py-2 text-emerald-600" title="Margen (precio - coste)">{eur(v.price - v.cost)}</td>
                    <td className="px-2 py-2">
                      <input type="number" value={v.stock} onChange={(e) => update(v.id, { stock: num(e.target.value) })} className="h-8 w-16 rounded-md border border-slate-200 px-2 text-sm" />
                    </td>
                    <td className="px-2 py-2">
                      <input type="number" value={v.min} onChange={(e) => update(v.id, { min: num(e.target.value) })} className="h-8 w-16 rounded-md border border-slate-200 px-2 text-sm" />
                    </td>
                    <td className="px-2 py-2">
                      <button type="button" aria-label="Eliminar variante" onClick={() => remove(v.id)} className="text-slate-400 hover:text-red-500">✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" onClick={() => setVariants([...variants, { ...EMPTY_VARIANT, id: `v${Date.now()}` }])}
            className="mt-2 grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">+</button>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="flex items-center gap-3">
            <Button onClick={onClose}>Guardar</Button>
            <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          </div>
          <Button variant="danger">Eliminar</Button>
        </div>
      </div>
    </Modal>
  );
}
```

- [ ] **Step 4: Run tests + typecheck**

Run: `npx vitest run src/features/cruda/components/ProductModal.test.tsx src/features/cruda/pages/CatalogoPage.test.tsx && npx tsc --noEmit`
Expected: PASS and no type errors.

- [ ] **Step 5: Commit**

```bash
git add src/features/cruda/components/ProductModal.tsx src/features/cruda/components/ProductModal.test.tsx
git commit -m "feat(cruda): product modal — form + editable variants table"
```

---

### Task 10: Analítica page (stat cards + SalesByMonthChart + reuse)

**Files:**
- Create: `src/features/cruda/components/SalesByMonthChart.tsx`
- Modify: `src/features/cruda/pages/AnaliticaPage.tsx`
- Test: `src/features/cruda/pages/AnaliticaPage.test.tsx`

**Interfaces:**
- Consumes: `orderSummary`, `phaseAccum`, `products`, `salesForYear` from `../data/seed`; `eur`; `StatCard`, `Select`, `Card`; `PhaseAccumCards`, `TopProductsTable`, `StockAlerts`.
- Produces: `<SalesByMonthChart data={MonthSales[]} year={number} />`.

- [ ] **Step 1: Write the failing test**

Create `src/features/cruda/pages/AnaliticaPage.test.tsx`:

```tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { test, expect } from 'vitest';
import { AnaliticaPage } from './AnaliticaPage';

test('renders stat cards, chart and reused panels', () => {
  render(<AnaliticaPage />);
  expect(screen.getByRole('heading', { name: 'Analítica CRUDA', level: 1 })).toBeInTheDocument();
  expect(screen.getByText('En curso (activos)')).toBeInTheDocument();
  expect(screen.getByText('Facturado (histórico)')).toBeInTheDocument();
  expect(screen.getByText('Ventas facturadas por mes · 2026')).toBeInTheDocument();
  expect(screen.getByText('Jul')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Productos más vendidos' })).toBeInTheDocument();
});

test('changing the year with no data zeroes the chart heading', () => {
  render(<AnaliticaPage />);
  fireEvent.change(screen.getByLabelText('Año'), { target: { value: '2025' } });
  expect(screen.getByText('Ventas facturadas por mes · 2025')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/cruda/pages/AnaliticaPage.test.tsx`
Expected: FAIL — stub page lacks stat cards/chart.

- [ ] **Step 3: Implement `SalesByMonthChart.tsx`**

Create `src/features/cruda/components/SalesByMonthChart.tsx`:

```tsx
import { Card } from '@/components/ui';
import { eur } from '../data/format';
import type { MonthSales } from '../data/types';

function kLabel(value: number): string {
  if (value <= 0) return '·';
  return value >= 1000 ? `${Math.round(value / 1000)}K€` : `${Math.round(value)}€`;
}

export function SalesByMonthChart({ data, year }: { data: MonthSales[]; year: number }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <Card className="p-5">
      <h2 className="mb-6 text-xs font-semibold uppercase tracking-wide text-slate-400">Ventas facturadas por mes · {year}</h2>
      <div className="flex h-48 items-end gap-2">
        {data.map((m) => (
          <div key={m.label} className="flex flex-1 flex-col items-center gap-2">
            <span className="text-[10px] text-slate-400" title={eur(m.value)}>{kLabel(m.value)}</span>
            <div className="flex w-full flex-1 items-end">
              <div
                className="w-full rounded-t"
                style={{ height: `${(m.value / max) * 100}%`, backgroundColor: 'rgba(141,78,182,0.8)' }}
              />
            </div>
            <span className="text-xs text-slate-400">{m.label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
```

- [ ] **Step 4: Implement `AnaliticaPage.tsx`**

Replace `src/features/cruda/pages/AnaliticaPage.tsx` with:

```tsx
import { useState } from 'react';
import { Card } from '@/components/ui';
import { eur } from '../data/format';
import { orderSummary, phaseAccum, products, salesForYear } from '../data/seed';
import { PhaseAccumCards } from '../components/PhaseAccumCards';
import { TopProductsTable } from '../components/TopProductsTable';
import { StockAlerts } from '../components/StockAlerts';
import { SalesByMonthChart } from '../components/SalesByMonthChart';

const YEARS = [2023, 2024, 2025, 2026, 2027];

export function AnaliticaPage() {
  const [year, setYear] = useState(2026);

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Analítica CRUDA</h1>
          <p className="text-slate-500">Ventas, líneas de negocio, productos y stock.</p>
        </div>
        <select aria-label="Año" value={year} onChange={(e) => setYear(Number(e.target.value))}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800">
          {YEARS.map((y) => (<option key={y} value={y}>{y}</option>))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatBlock label="En curso (activos)" value={eur(orderSummary.activeAmount)} caption={`${orderSummary.activeCount} pedidos`} />
        <StatBlock label="Facturado (histórico)" value={eur(orderSummary.invoicedAmount)} valueClass="text-emerald-600" />
        <StatBlock label="Colección" value={eur(orderSummary.coleccionAmount)} caption="en curso" />
        <StatBlock label="Producción (custom)" value={eur(orderSummary.produccionAmount)} caption="en curso" />
      </div>

      <SalesByMonthChart data={salesForYear(year)} year={year} />

      <PhaseAccumCards items={phaseAccum} fullWidth />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TopProductsTable products={products} />
        <StockAlerts products={products} />
      </div>
    </div>
  );
}

function StatBlock({ label, value, caption, valueClass }: { label: string; value: string; caption?: string; valueClass?: string }) {
  return (
    <Card className="p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${valueClass ?? 'text-slate-800'}`}>{value}</p>
      {caption && <p className="mt-0.5 text-xs text-slate-400">{caption}</p>}
    </Card>
  );
}
```

- [ ] **Step 5: Run tests + typecheck + full suite**

Run: `npx vitest run src/features/cruda && npx tsc --noEmit`
Expected: PASS (all CRUDA tests) and no type errors.

- [ ] **Step 6: Commit**

```bash
git add src/features/cruda/components/SalesByMonthChart.tsx src/features/cruda/pages/AnaliticaPage.tsx src/features/cruda/pages/AnaliticaPage.test.tsx
git commit -m "feat(cruda): Analítica page — stat cards, monthly sales chart, reused panels"
```

---

### Task 11: Visual verification pass against reference captures

**Files:** none (verification only; small fixes as needed)

- [ ] **Step 1: Build + run the app**

Run: `npm run build && npm run dev`
Open `/cruda`, `/cruda/catalogo`, `/cruda/analitica`.

- [ ] **Step 2: Compare side-by-side with `docs/references/cruda/`**

For each route, compare against the matching PNG (`cruda-pedidos-list.png`, `cruda-pedido-detail.png`, `cruda-nuevo-pedido.png`, `cruda-catalogo.png`, `cruda-producto-detail.png`, `cruda-analitica.png`). Check: header (tabs + BarChart2 icon active state), spacing, status chip colors, currency formatting (grouping only ≥10000), phase-card purple bars, chart bar, table columns/order.

- [ ] **Step 3: Apply pixel fixes**

Adjust Tailwind classes where they diverge from the captures. Keep changes presentational. Re-run `npx vitest run src/features/cruda` after any change.

- [ ] **Step 4: Full lint + test + typecheck**

Run: `npm run lint && npx tsc --noEmit && npm test`
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "fix(cruda): pixel-perfect adjustments vs reference captures"
```

---

## Self-Review Notes

- **Spec coverage:** §1 routes → Task 3; §2 file structure → all tasks; §3.1 Pedidos (list/detail/new) → Tasks 5–7; §3.2 Catálogo + ProductModal → Tasks 8–9; §3.3 Analítica → Task 10; §4 Badge/ProgressBar additive extensions → Tasks 2, 4; §5 status palette → Task 2 (+ Global Constraints); §6 seed → Task 1; §7 presentational behavior → enforced per component; §8 testing → each task; §9 out-of-scope respected (Extras popover is a button-only, images/PDF/invite are no-ops). Task 11 covers the pixel-perfect verification the calco goal implies.
- **Type consistency:** `OrderLine` (with `extrasPerUnit`/`extrasCount`), `Order.headerTotal`, `lineNetUnit`/`lineSubtotal`/`orderLinesTotal`, `salesForYear`, `PhaseAccumCards({items, fullWidth})`, `ProductModal({open, productId, onClose})` are defined in Task 1/4/9 and consumed consistently.
- **Known reference quirk:** CR00103 header shows `5782,50 €` while its lines total `6650,00 €`; both are reproduced verbatim (`headerTotal` vs computed total), as noted in spec §6.
