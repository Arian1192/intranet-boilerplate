# Mixmag/TAGMAG Fase C — Campañas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar el placeholder de la pestaña Campañas de Mixmag/TAGMAG por un calco fiel y funcional (Embudo + Kanban) parametrizado por revista.

**Architecture:** `CampanasPage` lee `useOutletContext<Magazine>` y obtiene etapas/campañas desde `campanas.ts` (keyed por `magazine.id`, espejo de `contenidos.ts`/`pipeline.ts`). Componentes pequeños: toolbar, cajas de etapa (Embudo), filas (Embudo), tarjetas + columnas (Kanban). Reusa `formatCurrency` (`@/lib/format`) y `SegmentedControl` (`@/components/ui`).

**Tech Stack:** React 19, react-router 7, Tailwind 3, Vitest + Testing Library, TypeScript strict (target ES2020, `noUnusedLocals`, lint `--max-warnings 0`).

## Global Constraints

- **FIEL AL LIVE (pixel-perfect).** Tokens contra `docs/references/mixmag/live-{mixmag,tagmag}-campanas-{embudo,kanban}.png`. Verificación final Playwright ours↔live obligatoria.
- Prohibido mutar el live; todo presentacional/in-memory, sin persistencia. Modelo espeja tablas Supabase (FKs `stageId`/`clientId`; `client`/`untilLabel` denormalizado/snapshot).
- Sin clases `brand-*` en grises/negros. Botón `+ Campaña` = `#44444C`. ACEPTADA en emerald (=live).
- **Reusar** `formatCurrency` de `@/lib/format` y `SegmentedControl` de `@/components/ui` (NO duplicar).
- es-ES. Target ES2020: NO `Array.prototype.at()`. `formatCurrency` usa NBSP antes de € → en tests, matchear con regex sobre la parte numérica (p.ej. `/1\.500,00/`), nunca un literal con € y NBSP.
- Ubicación `src/features/redaccion/` (datos `data/campanas.ts`, componentes `components/`, página `pages/`). Cada test importa `'@testing-library/jest-dom'`. Un commit por tarea.

---

### Task 1: Modelo de datos + helpers (`campanas.ts`)

**Files:**
- Create: `src/features/redaccion/data/campanas.ts`
- Test: `src/features/redaccion/data/campanas.test.ts`

**Interfaces:**
- Consumes: `MagazineId` de `./contenidos`.
- Produces:
  - `interface CampaignStage { id: string; magazine: MagazineId; label: string; order: number; bucket: 'aire'|'ganado'; tone: 'slate'|'emerald' }`
  - `interface Campaign { id: string; magazine: MagazineId; stageId: string; name: string; client: string; clientId?: string; amount: number; untilLabel: string }`
  - `STAGES: CampaignStage[]`, `campaigns: Campaign[]`
  - `stagesFor(magazine): CampaignStage[]`, `campaignsFor(magazine): Campaign[]`
  - `interface CampaignFilter { query?: string; stageId?: string }`
  - `filterCampaigns(list, f): Campaign[]`
  - `groupByStage(list, stages): { stage: CampaignStage; items: Campaign[] }[]`
  - `countByStage(list, stages): Record<string, number>`
  - `sumByStage(list, stages): Record<string, number>`
  - `campaignStats(list, stages): { enElAire: number; ganado: number }`

- [ ] **Step 1: Write the failing test**

```ts
// src/features/redaccion/data/campanas.test.ts
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import {
  STAGES, campaigns,
  stagesFor, campaignsFor, filterCampaigns,
  groupByStage, countByStage, sumByStage, campaignStats,
} from './campanas';

describe('campanas data', () => {
  it('cada revista tiene las 6 etapas del embudo en orden con buckets/tones correctos', () => {
    for (const mag of ['mixmag', 'tagmag'] as const) {
      const s = stagesFor(mag);
      expect(s.map((x) => x.label)).toEqual([
        'TENTATIVA', 'PROPUESTA ENVIADA', 'NEGOCIACIÓN', 'ACEPTADA', 'EN CURSO', 'COMPLETADA',
      ]);
      const aceptada = s.find((x) => x.label === 'ACEPTADA')!;
      expect(aceptada.bucket).toBe('ganado');
      expect(aceptada.tone).toBe('emerald');
      expect(s.find((x) => x.label === 'TENTATIVA')!.bucket).toBe('aire');
      expect(s.filter((x) => x.tone === 'emerald')).toHaveLength(1); // solo ACEPTADA
    }
  });

  it('siembra una campaña por revista (Campaña Test 1, ACEPTADA, 1500)', () => {
    for (const mag of ['mixmag', 'tagmag'] as const) {
      const c = campaignsFor(mag);
      expect(c).toHaveLength(1);
      expect(c[0].name).toBe('Campaña Test 1');
      expect(c[0].client).toBe('Cold Cloud SL');
      expect(c[0].amount).toBe(1500);
      expect(c[0].untilLabel).toBe('hasta 29 jul');
      const aceptada = stagesFor(mag).find((s) => s.label === 'ACEPTADA')!;
      expect(c[0].stageId).toBe(aceptada.id);
    }
  });

  it('campaignStats: en el aire 0, ganado 1500', () => {
    const mag = 'mixmag';
    const stats = campaignStats(campaignsFor(mag), stagesFor(mag));
    expect(stats.enElAire).toBe(0);
    expect(stats.ganado).toBe(1500);
  });

  it('countByStage y sumByStage: ACEPTADA 1 / 1500, resto 0', () => {
    const mag = 'mixmag';
    const stages = stagesFor(mag);
    const c = campaignsFor(mag);
    const aceptada = stages.find((s) => s.label === 'ACEPTADA')!.id;
    const tentativa = stages.find((s) => s.label === 'TENTATIVA')!.id;
    expect(countByStage(c, stages)[aceptada]).toBe(1);
    expect(sumByStage(c, stages)[aceptada]).toBe(1500);
    expect(countByStage(c, stages)[tentativa]).toBe(0);
    expect(sumByStage(c, stages)[tentativa]).toBe(0);
  });

  it('filterCampaigns por query (name/client) y stageId; inmutable', () => {
    const c = campaignsFor('mixmag');
    expect(filterCampaigns(c, { query: 'test' })).toHaveLength(1);
    expect(filterCampaigns(c, { query: 'cold' })).toHaveLength(1); // matchea cliente
    expect(filterCampaigns(c, { query: 'zzz' })).toHaveLength(0);
    const aceptada = stagesFor('mixmag').find((s) => s.label === 'ACEPTADA')!.id;
    expect(filterCampaigns(c, { stageId: aceptada })).toHaveLength(1);
    expect(filterCampaigns(c, {})).not.toBe(c);
  });

  it('groupByStage devuelve las etapas en orden con sus campañas', () => {
    const stages = stagesFor('mixmag');
    const groups = groupByStage(campaignsFor('mixmag'), stages);
    expect(groups.map((g) => g.stage.label)).toEqual(stages.map((s) => s.label));
    const aceptada = groups.find((g) => g.stage.label === 'ACEPTADA')!;
    expect(aceptada.items).toHaveLength(1);
  });

  it('STAGES y campaigns poblados (uso bajo noUnusedLocals)', () => {
    expect(STAGES.length).toBe(12); // 6 mixmag + 6 tagmag
    expect(campaigns.length).toBe(2);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/redaccion/data/campanas.test.ts`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```ts
// src/features/redaccion/data/campanas.ts
import type { MagazineId } from './contenidos';

export interface CampaignStage {
  id: string;
  magazine: MagazineId;
  label: string;
  order: number;
  bucket: 'aire' | 'ganado';
  tone: 'slate' | 'emerald';
}

export interface Campaign {
  id: string;
  magazine: MagazineId;
  stageId: string;
  name: string;
  client: string;
  clientId?: string;
  amount: number;
  untilLabel: string;
}

const stagesForMagazine = (magazine: MagazineId, prefix: string): CampaignStage[] => [
  { id: `${prefix}-tentativa`, magazine, label: 'TENTATIVA', order: 1, bucket: 'aire', tone: 'slate' },
  { id: `${prefix}-propuesta`, magazine, label: 'PROPUESTA ENVIADA', order: 2, bucket: 'aire', tone: 'slate' },
  { id: `${prefix}-negociacion`, magazine, label: 'NEGOCIACIÓN', order: 3, bucket: 'aire', tone: 'slate' },
  { id: `${prefix}-aceptada`, magazine, label: 'ACEPTADA', order: 4, bucket: 'ganado', tone: 'emerald' },
  { id: `${prefix}-encurso`, magazine, label: 'EN CURSO', order: 5, bucket: 'ganado', tone: 'slate' },
  { id: `${prefix}-completada`, magazine, label: 'COMPLETADA', order: 6, bucket: 'ganado', tone: 'slate' },
];

export const STAGES: CampaignStage[] = [
  ...stagesForMagazine('mixmag', 'mix'),
  ...stagesForMagazine('tagmag', 'tag'),
];

export const campaigns: Campaign[] = [
  { id: 'cm1', magazine: 'mixmag', stageId: 'mix-aceptada', name: 'Campaña Test 1', client: 'Cold Cloud SL', amount: 1500, untilLabel: 'hasta 29 jul' },
  { id: 'ct1', magazine: 'tagmag', stageId: 'tag-aceptada', name: 'Campaña Test 1', client: 'Cold Cloud SL', amount: 1500, untilLabel: 'hasta 29 jul' },
];

export function stagesFor(magazine: MagazineId): CampaignStage[] {
  return STAGES.filter((s) => s.magazine === magazine).sort((a, b) => a.order - b.order);
}

export function campaignsFor(magazine: MagazineId): Campaign[] {
  return campaigns.filter((c) => c.magazine === magazine);
}

export interface CampaignFilter {
  query?: string;
  stageId?: string;
}

export function filterCampaigns(list: Campaign[], f: CampaignFilter): Campaign[] {
  return list.filter((c) => {
    if (f.query) {
      const q = f.query.toLowerCase();
      if (!c.name.toLowerCase().includes(q) && !c.client.toLowerCase().includes(q)) return false;
    }
    if (f.stageId && c.stageId !== f.stageId) return false;
    return true;
  });
}

export function groupByStage(list: Campaign[], stages: CampaignStage[]): { stage: CampaignStage; items: Campaign[] }[] {
  return stages.map((stage) => ({ stage, items: list.filter((c) => c.stageId === stage.id) }));
}

export function countByStage(list: Campaign[], stages: CampaignStage[]): Record<string, number> {
  const out: Record<string, number> = {};
  stages.forEach((s) => (out[s.id] = 0));
  list.forEach((c) => { if (c.stageId in out) out[c.stageId] += 1; });
  return out;
}

export function sumByStage(list: Campaign[], stages: CampaignStage[]): Record<string, number> {
  const out: Record<string, number> = {};
  stages.forEach((s) => (out[s.id] = 0));
  list.forEach((c) => { if (c.stageId in out) out[c.stageId] += c.amount; });
  return out;
}

export function campaignStats(list: Campaign[], stages: CampaignStage[]): { enElAire: number; ganado: number } {
  const bucketOf: Record<string, 'aire' | 'ganado'> = {};
  stages.forEach((s) => (bucketOf[s.id] = s.bucket));
  let enElAire = 0;
  let ganado = 0;
  list.forEach((c) => {
    if (bucketOf[c.stageId] === 'aire') enElAire += c.amount;
    else if (bucketOf[c.stageId] === 'ganado') ganado += c.amount;
  });
  return { enElAire, ganado };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/redaccion/data/campanas.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/redaccion/data/campanas.ts src/features/redaccion/data/campanas.test.ts
git commit -m "feat(mixmag): modelo Campañas + seeds/helpers (Fase C)"
```

---

### Task 2: `StageBox` (caja de etapa del embudo)

**Files:**
- Create: `src/features/redaccion/components/StageBox.tsx`
- Test: `src/features/redaccion/components/StageBox.test.tsx`

**Interfaces:**
- Produces: `StageBox(props: { label: string; count: number; amount?: number; tone: 'slate'|'emerald'; selected?: boolean; onClick?: () => void }): JSX.Element` — `amount` (ya formateado con `formatCurrency` por el padre) se muestra junto al número solo si se pasa.

- [ ] **Step 1: Write the failing test**

```tsx
// src/features/redaccion/components/StageBox.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StageBox } from './StageBox';

describe('StageBox', () => {
  it('muestra label y contador; con count>0 resalta el número', () => {
    render(<StageBox label="ACEPTADA" count={1} tone="emerald" />);
    expect(screen.getByText('ACEPTADA')).toHaveClass('text-emerald-600');
    expect(screen.getByText('1')).toHaveClass('text-slate-800');
  });

  it('muestra el importe formateado cuando se pasa', () => {
    render(<StageBox label="ACEPTADA" count={1} amount="1.500,00 €" tone="emerald" />);
    expect(screen.getByText('1.500,00 €')).toBeInTheDocument();
  });

  it('con count 0 atenúa y no muestra importe', () => {
    render(<StageBox label="TENTATIVA" count={0} tone="slate" />);
    expect(screen.getByText('0')).toHaveClass('text-slate-300');
  });

  it('es button con aria-pressed y dispara onClick', async () => {
    const onClick = vi.fn();
    render(<StageBox label="ACEPTADA" count={1} tone="emerald" selected onClick={onClick} />);
    const btn = screen.getByRole('button', { name: /ACEPTADA/ });
    expect(btn).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/redaccion/components/StageBox.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/features/redaccion/components/StageBox.tsx
const TONE_LABEL: Record<'slate' | 'emerald', string> = {
  slate: 'text-slate-600',
  emerald: 'text-emerald-600',
};

export interface StageBoxProps {
  label: string;
  count: number;
  amount?: string;
  tone: 'slate' | 'emerald';
  selected?: boolean;
  onClick?: () => void;
}

export function StageBox({ label, count, amount, tone, selected, onClick }: StageBoxProps) {
  const has = count > 0;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={!!selected}
      className={`rounded-lg border px-3 py-2 text-center transition ${
        selected ? 'border-slate-800' : has && tone === 'emerald' ? 'border-emerald-300' : 'border-slate-200'
      } ${has ? 'bg-white' : 'bg-slate-50'}`}
    >
      <div className={`text-[10px] font-semibold uppercase tracking-wide ${has ? TONE_LABEL[tone] : 'text-slate-300'}`}>
        {label}
      </div>
      <div className="flex items-baseline justify-center gap-1">
        <span className={`text-lg font-bold ${has ? 'text-slate-800' : 'text-slate-300'}`}>{count}</span>
        {has && amount && <span className="text-xs text-slate-500">{amount}</span>}
      </div>
    </button>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/redaccion/components/StageBox.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/redaccion/components/StageBox.tsx src/features/redaccion/components/StageBox.test.tsx
git commit -m "feat(mixmag): StageBox (caja de etapa del embudo)"
```

---

### Task 3: `CampaignRow` (fila de campaña en Embudo)

**Files:**
- Create: `src/features/redaccion/components/CampaignRow.tsx`
- Test: `src/features/redaccion/components/CampaignRow.test.tsx`

**Interfaces:**
- Consumes: `Campaign`, `CampaignStage` de `../data/campanas`; `formatCurrency` de `@/lib/format`.
- Produces: `CampaignRow(props: { campaign: Campaign; stage?: CampaignStage }): JSX.Element`

- [ ] **Step 1: Write the failing test**

```tsx
// src/features/redaccion/components/CampaignRow.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CampaignRow } from './CampaignRow';
import { campaignsFor, stagesFor } from '../data/campanas';

const c = campaignsFor('mixmag')[0];
const stage = stagesFor('mixmag').find((s) => s.id === c.stageId);

describe('CampaignRow', () => {
  it('muestra etapa, nombre, cliente, hasta e importe', () => {
    render(<CampaignRow campaign={c} stage={stage} />);
    expect(screen.getByText('ACEPTADA')).toBeInTheDocument();
    expect(screen.getByText('Campaña Test 1')).toBeInTheDocument();
    expect(screen.getByText('Cold Cloud SL')).toBeInTheDocument();
    expect(screen.getByText('hasta 29 jul')).toBeInTheDocument();
    expect(screen.getByText(/1\.500,00/)).toBeInTheDocument();
  });

  it('aplica tinte emerald cuando la etapa es emerald', () => {
    const { container } = render(<CampaignRow campaign={c} stage={stage} />);
    expect(container.querySelector('[class*="emerald"]')).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/redaccion/components/CampaignRow.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/features/redaccion/components/CampaignRow.tsx
import { formatCurrency } from '@/lib/format';
import type { Campaign, CampaignStage } from '../data/campanas';

const CHIP: Record<'slate' | 'emerald', string> = {
  slate: 'bg-slate-100 text-slate-500',
  emerald: 'bg-emerald-100 text-emerald-700',
};

export interface CampaignRowProps {
  campaign: Campaign;
  stage?: CampaignStage;
}

export function CampaignRow({ campaign, stage }: CampaignRowProps) {
  const tone = stage?.tone ?? 'slate';
  const emerald = tone === 'emerald';
  return (
    <div className={`flex items-center gap-4 rounded-lg border p-4 ${emerald ? 'border-emerald-200 bg-emerald-50/40' : 'border-slate-200 bg-white'}`}>
      <span className={`inline-flex shrink-0 items-center rounded px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${CHIP[tone]}`}>
        {stage?.label ?? ''}
      </span>
      <span className="flex-1 truncate font-medium text-slate-800">{campaign.name}</span>
      <span className="shrink-0 text-sm text-slate-400">{campaign.client}</span>
      <span className="shrink-0 text-sm text-slate-400">{campaign.untilLabel}</span>
      <span className="shrink-0 font-bold text-slate-800">{formatCurrency(campaign.amount)}</span>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/redaccion/components/CampaignRow.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/redaccion/components/CampaignRow.tsx src/features/redaccion/components/CampaignRow.test.tsx
git commit -m "feat(mixmag): CampaignRow (fila de campaña en Embudo)"
```

---

### Task 4: `CampaignCard` (tarjeta en Kanban)

**Files:**
- Create: `src/features/redaccion/components/CampaignCard.tsx`
- Test: `src/features/redaccion/components/CampaignCard.test.tsx`

**Interfaces:**
- Consumes: `Campaign` de `../data/campanas`; `formatCurrency` de `@/lib/format`.
- Produces: `CampaignCard(props: { campaign: Campaign }): JSX.Element`

- [ ] **Step 1: Write the failing test**

```tsx
// src/features/redaccion/components/CampaignCard.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CampaignCard } from './CampaignCard';
import { campaignsFor } from '../data/campanas';

describe('CampaignCard', () => {
  it('muestra nombre, cliente, importe y hasta', () => {
    render(<CampaignCard campaign={campaignsFor('mixmag')[0]} />);
    expect(screen.getByText('Campaña Test 1')).toBeInTheDocument();
    expect(screen.getByText('Cold Cloud SL')).toBeInTheDocument();
    expect(screen.getByText(/1\.500,00/)).toBeInTheDocument();
    expect(screen.getByText('hasta 29 jul')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/redaccion/components/CampaignCard.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/features/redaccion/components/CampaignCard.tsx
import { formatCurrency } from '@/lib/format';
import type { Campaign } from '../data/campanas';

export interface CampaignCardProps {
  campaign: Campaign;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="font-medium text-slate-800">{campaign.name}</p>
      <p className="text-sm text-slate-400">{campaign.client}</p>
      <p className="mt-2 font-bold text-slate-800">{formatCurrency(campaign.amount)}</p>
      <p className="text-sm text-slate-400">{campaign.untilLabel}</p>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/redaccion/components/CampaignCard.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/redaccion/components/CampaignCard.tsx src/features/redaccion/components/CampaignCard.test.tsx
git commit -m "feat(mixmag): CampaignCard (tarjeta de campaña)"
```

---

### Task 5: `CampanaKanbanColumn` (columna: expandida / colapsada)

**Files:**
- Create: `src/features/redaccion/components/CampanaKanbanColumn.tsx`
- Test: `src/features/redaccion/components/CampanaKanbanColumn.test.tsx`

**Interfaces:**
- Consumes: `CampaignCard`, `Campaign`, `CampaignStage`.
- Produces: `CampanaKanbanColumn(props: { stage: CampaignStage; items: Campaign[] }): JSX.Element` — colapsada (label vertical) cuando `items` vacío; expandida (`flex-1`) cuando tiene campañas.

- [ ] **Step 1: Write the failing test**

```tsx
// src/features/redaccion/components/CampanaKanbanColumn.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CampanaKanbanColumn } from './CampanaKanbanColumn';
import { campaignsFor, stagesFor } from '../data/campanas';

const stages = stagesFor('mixmag');
const aceptada = stages.find((s) => s.label === 'ACEPTADA')!;
const tentativa = stages.find((s) => s.label === 'TENTATIVA')!;
const items = campaignsFor('mixmag').filter((c) => c.stageId === aceptada.id);

describe('CampanaKanbanColumn', () => {
  it('columna con campañas: label, contador y tarjeta (no colapsada)', () => {
    render(<CampanaKanbanColumn stage={aceptada} items={items} />);
    expect(screen.getByText('ACEPTADA')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Campaña Test 1')).toBeInTheDocument();
    expect(screen.getByTestId('campana-column')).toHaveAttribute('data-collapsed', 'false');
  });

  it('columna vacía se colapsa', () => {
    render(<CampanaKanbanColumn stage={tentativa} items={[]} />);
    expect(screen.getByTestId('campana-column')).toHaveAttribute('data-collapsed', 'true');
    expect(screen.getByText('TENTATIVA')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/redaccion/components/CampanaKanbanColumn.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/features/redaccion/components/CampanaKanbanColumn.tsx
import type { Campaign, CampaignStage } from '../data/campanas';
import { CampaignCard } from './CampaignCard';

const CHIP: Record<'slate' | 'emerald', string> = {
  slate: 'bg-slate-100 text-slate-500',
  emerald: 'bg-emerald-100 text-emerald-700',
};

export interface CampanaKanbanColumnProps {
  stage: CampaignStage;
  items: Campaign[];
}

export function CampanaKanbanColumn({ stage, items }: CampanaKanbanColumnProps) {
  const collapsed = items.length === 0;
  if (collapsed) {
    return (
      <div data-testid="campana-column" data-collapsed="true" className="flex w-10 shrink-0 justify-center rounded-lg bg-slate-50 py-4">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 [writing-mode:vertical-rl] rotate-180">
          {stage.label}
        </span>
      </div>
    );
  }
  return (
    <div data-testid="campana-column" data-collapsed="false" className="min-w-[16rem] flex-1">
      <div className="flex items-center justify-between px-1">
        <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${CHIP[stage.tone]}`}>
          {stage.label}
        </span>
        <span className="text-xs text-slate-400">{items.length}</span>
      </div>
      <div className="mt-2 space-y-2 rounded-lg bg-slate-50 p-2">
        {items.map((c) => <CampaignCard key={c.id} campaign={c} />)}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/redaccion/components/CampanaKanbanColumn.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/redaccion/components/CampanaKanbanColumn.tsx src/features/redaccion/components/CampanaKanbanColumn.test.tsx
git commit -m "feat(mixmag): CampanaKanbanColumn (expandida + colapsada vertical)"
```

---

### Task 6: `CampanasToolbar` (barra superior)

**Files:**
- Create: `src/features/redaccion/components/CampanasToolbar.tsx`
- Test: `src/features/redaccion/components/CampanasToolbar.test.tsx`

**Interfaces:**
- Consumes: `formatCurrency` de `@/lib/format`; `SegmentedControl` de `@/components/ui`.
- Produces: `CampanasToolbar(props: { query: string; onQuery: (v: string) => void; enElAire: number; ganado: number; view: 'embudo'|'kanban'; onView: (v: 'embudo'|'kanban') => void }): JSX.Element`

- [ ] **Step 1: Write the failing test**

```tsx
// src/features/redaccion/components/CampanasToolbar.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CampanasToolbar } from './CampanasToolbar';

function setup(overrides = {}) {
  const props = {
    query: '', onQuery: vi.fn(),
    enElAire: 0, ganado: 1500,
    view: 'embudo' as const, onView: vi.fn(),
    ...overrides,
  };
  render(<CampanasToolbar {...props} />);
  return props;
}

describe('CampanasToolbar', () => {
  it('muestra buscador, stats formateadas y botón inerte + Campaña', () => {
    setup();
    expect(screen.getByPlaceholderText(/Buscar campaña o anuncian/)).toBeInTheDocument();
    expect(screen.getByText('En el aire')).toBeInTheDocument();
    expect(screen.getByText('Ganado')).toBeInTheDocument();
    expect(screen.getByText(/1\.500,00/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+ Campaña' })).toHaveAttribute('type', 'button');
  });

  it('escribir en el buscador emite onQuery', async () => {
    const { onQuery } = setup();
    await userEvent.type(screen.getByPlaceholderText(/Buscar campaña o anuncian/), 'test');
    expect(onQuery).toHaveBeenCalled();
  });

  it('pulsar Kanban emite onView', async () => {
    const { onView } = setup();
    await userEvent.click(screen.getByRole('button', { name: 'Kanban' }));
    expect(onView).toHaveBeenCalledWith('kanban');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/redaccion/components/CampanasToolbar.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/features/redaccion/components/CampanasToolbar.tsx
import { formatCurrency } from '@/lib/format';
import { SegmentedControl } from '@/components/ui';

type View = 'embudo' | 'kanban';

export interface CampanasToolbarProps {
  query: string;
  onQuery: (v: string) => void;
  enElAire: number;
  ganado: number;
  view: View;
  onView: (v: View) => void;
}

export function CampanasToolbar({ query, onQuery, enElAire, ganado, view, onView }: CampanasToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <input
        value={query}
        onChange={(e) => onQuery(e.target.value)}
        placeholder="Buscar campaña o anuncian…"
        className="h-9 w-56 rounded-lg border border-slate-200 px-3 text-sm"
      />
      <span className="text-sm text-slate-500">En el aire <span className="font-bold text-slate-800">{formatCurrency(enElAire)}</span></span>
      <span className="text-sm text-slate-500">Ganado <span className="font-bold text-slate-800">{formatCurrency(ganado)}</span></span>
      <div className="ml-auto flex items-center gap-3">
        <SegmentedControl
          options={[{ label: 'Embudo', value: 'embudo' }, { label: 'Kanban', value: 'kanban' }]}
          value={view}
          onChange={onView}
        />
        <button type="button" className="rounded-lg px-4 py-2 text-sm font-medium text-white" style={{ backgroundColor: '#44444C' }}>
          + Campaña
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/redaccion/components/CampanasToolbar.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/redaccion/components/CampanasToolbar.tsx src/features/redaccion/components/CampanasToolbar.test.tsx
git commit -m "feat(mixmag): CampanasToolbar (buscar + stats + toggle + Campaña inerte)"
```

---

### Task 7: `CampanasPage` + wiring del router

**Files:**
- Create: `src/features/redaccion/pages/CampanasPage.tsx`
- Test: `src/features/redaccion/pages/CampanasPage.test.tsx`
- Modify: `src/app/router.tsx` (reemplazar `EnConstruccionPage` por `CampanasPage` en las rutas `campanas` de ambos gemelos)

**Interfaces:**
- Consumes: `useOutletContext<Magazine>`, componentes anteriores, helpers de `campanas.ts`, `formatCurrency`.
- Produces: `CampanasPage(): JSX.Element`

- [ ] **Step 1: Write the failing test**

```tsx
// src/features/redaccion/pages/CampanasPage.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route, Outlet } from 'react-router';
import { CampanasPage } from './CampanasPage';
import { MIXMAG, TAGMAG } from '../data/seed';
import type { Magazine } from '../data/types';

function renderPage(magazine: Magazine) {
  return render(
    <MemoryRouter>
      <Routes>
        <Route element={<Outlet context={magazine} />}>
          <Route index element={<CampanasPage />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe('CampanasPage', () => {
  it('Embudo Mixmag: stats, 6 cajas de etapa, fila de campaña', () => {
    renderPage(MIXMAG);
    expect(screen.getByText('En el aire')).toBeInTheDocument();
    // ganado 1.500,00 € aparece (toolbar). ACEPTADA como caja y como chip de fila.
    expect(screen.getAllByText('ACEPTADA').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('Campaña Test 1')).toBeInTheDocument();
    expect(screen.getByText('Cold Cloud SL')).toBeInTheDocument();
    expect(screen.getByText('COMPLETADA')).toBeInTheDocument(); // caja de etapa vacía
  });

  it('cambia a Kanban: columna ACEPTADA con tarjeta', async () => {
    renderPage(MIXMAG);
    await userEvent.click(screen.getByRole('button', { name: 'Kanban' }));
    // hay 6 columnas (5 colapsadas + ACEPTADA expandida); localizamos la expandida
    const cols = screen.getAllByTestId('campana-column');
    expect(cols).toHaveLength(6);
    const expanded = cols.find((c) => c.getAttribute('data-collapsed') === 'false')!;
    expect(within(expanded).getByText('Campaña Test 1')).toBeInTheDocument();
  });

  it('la búsqueda filtra las campañas visibles', async () => {
    renderPage(MIXMAG);
    await userEvent.type(screen.getByPlaceholderText(/Buscar campaña o anuncian/), 'zzz');
    expect(screen.queryByText('Campaña Test 1')).toBeNull();
  });

  it('parametrización: TAGMAG también muestra su Campaña Test 1', () => {
    renderPage(TAGMAG);
    expect(screen.getByText('Campaña Test 1')).toBeInTheDocument();
  });

  it('no usa clases brand-*', () => {
    const { container } = renderPage(MIXMAG);
    expect(container.querySelector('[class*="brand-"]')).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/redaccion/pages/CampanasPage.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/features/redaccion/pages/CampanasPage.tsx
import { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router';
import { formatCurrency } from '@/lib/format';
import type { Magazine } from '../data/types';
import {
  stagesFor, campaignsFor, filterCampaigns,
  groupByStage, countByStage, sumByStage, campaignStats,
} from '../data/campanas';
import { CampanasToolbar } from '../components/CampanasToolbar';
import { StageBox } from '../components/StageBox';
import { CampaignRow } from '../components/CampaignRow';
import { CampanaKanbanColumn } from '../components/CampanaKanbanColumn';

export function CampanasPage() {
  const magazine = useOutletContext<Magazine>();
  const [view, setView] = useState<'embudo' | 'kanban'>('embudo');
  const [query, setQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<string | undefined>(undefined);

  const stages = useMemo(() => stagesFor(magazine.id), [magazine.id]);
  const all = useMemo(() => campaignsFor(magazine.id), [magazine.id]);
  const base = useMemo(() => filterCampaigns(all, { query }), [all, query]);
  // stats, contadores y sumas derivan de `base` (post-búsqueda) → buscar filtra todo, fiel al live.
  const stats = useMemo(() => campaignStats(base, stages), [base, stages]);

  const counts = countByStage(base, stages);
  const sums = sumByStage(base, stages);
  const stageById = Object.fromEntries(stages.map((s) => [s.id, s]));

  const filtered = filterCampaigns(base, { stageId: stageFilter });
  const toggleStage = (id: string) => setStageFilter((cur) => (cur === id ? undefined : id));

  return (
    <div className="space-y-4">
      <CampanasToolbar
        query={query}
        onQuery={setQuery}
        enElAire={stats.enElAire}
        ganado={stats.ganado}
        view={view}
        onView={(v) => { setView(v); setStageFilter(undefined); }}
      />

      {view === 'embudo' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {stages.map((s) => (
              <StageBox
                key={s.id}
                label={s.label}
                count={counts[s.id] ?? 0}
                amount={sums[s.id] ? formatCurrency(sums[s.id]) : undefined}
                tone={s.tone}
                selected={stageFilter === s.id}
                onClick={() => toggleStage(s.id)}
              />
            ))}
          </div>
          <div className="space-y-2">
            {filtered.map((c) => <CampaignRow key={c.id} campaign={c} stage={stageById[c.stageId]} />)}
          </div>
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {groupByStage(base, stages).map((g) => (
            <CampanaKanbanColumn key={g.stage.id} stage={g.stage} items={g.items} />
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/redaccion/pages/CampanasPage.test.tsx`
Expected: PASS.

- [ ] **Step 5: Wire the router**

En `src/app/router.tsx`: añadir `import { CampanasPage } from '@/features/redaccion/pages/CampanasPage';` y reemplazar, en `/mixmag` y `/tagmag`, `<Route path="campanas" element={<EnConstruccionPage />} />` por `<Route path="campanas" element={<CampanasPage />} />`. (`contenidos` ya usa `ContenidosPage`; `revistas`/`index` intactas; `EnConstruccionPage` puede quedar sin uso si ya no lo referencia nada — si `eslint`/`tsc` marca el import como no usado, elimínalo del router.)

- [ ] **Step 6: Run full gate**

Run: `npx vitest run && npx tsc --noEmit && npx eslint . --max-warnings 0`
Expected: todo verde.

- [ ] **Step 7: Commit**

```bash
git add src/features/redaccion/pages/CampanasPage.tsx src/features/redaccion/pages/CampanasPage.test.tsx src/app/router.tsx
git commit -m "feat(mixmag): CampanasPage (Embudo+Kanban) + rutas campanas ambos gemelos"
```

---

## Verificación final (fuera de tareas, en review de rama)

- **FIEL AL LIVE:** Playwright ours↔live en `/mixmag/campanas` y `/tagmag/campanas`, vistas Embudo y Kanban; ajustar tokens (cajas de etapa, tinte emerald ACEPTADA, columna expandida flex-1, colapsadas verticales) contra `docs/references/mixmag/live-*-campanas-*.png`. 0 errores de consola.
- Confirmar stats "En el aire 0,00 € / Ganado 1.500,00 €", ACEPTADA 1/1500, fila y tarjeta correctas, parametrización idéntica en ambos gemelos.

## Self-review (cobertura)

- Modelo/stats/etapas → Task 1 · StageBox → Task 2 · CampaignRow → Task 3 · CampaignCard → Task 4 · CampanaKanbanColumn → Task 5 · CampanasToolbar → Task 6 · CampanasPage + router → Task 7. Reutilización `formatCurrency`/`SegmentedControl` fijada en Tasks 3/4/6. Sin placeholders; tipos consistentes (`CampaignStage`/`Campaign`/`bucket`/`tone` uniformes).
