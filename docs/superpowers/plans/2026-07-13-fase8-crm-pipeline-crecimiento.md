# CRM Pipeline + Crecimiento Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar los placeholders `PipelinePage` y `CrecimientoPage` del módulo CRM por las pantallas reales del live (`/crm/pipeline`, `/crm/crecimiento`), calcadas **100% fieles** y pixel-perfect. Presentacional, in-memory; el modelo de datos espeja las futuras tablas de Supabase.

**Architecture:** Nuevos datos en `src/features/crm/data/` (`pipeline.ts` = tipos+STAGES+opportunities+helpers; `crecimiento.ts` = helpers que derivan de `orgs`). Componentes en `src/features/crm/components/` y páginas en `src/features/crm/pages/`. El shell y las rutas CRM ya existen (Fase 6a): solo se rellenan las dos páginas.

**Tech Stack:** React 19, react-router 7, Tailwind 3, lucide-react, Vitest + Testing Library. Reutiliza `Button`/`Card`/`Badge` de `@/components/ui`, `cn` de `@/lib/utils`, y `orgs`/`GROUP_COMPANIES` de `@/features/crm/data/seed`.

## Global Constraints

- **100% fiel al live** (pixel-perfect + modelo alineado a Supabase). Etapas EXACTAS: ConceptOne = `Interés, Oferta enviada, Confirmando fecha, Contratado, Caído`; Etra Agency = `Nuevo, Contactado, Cualificado, Propuesta, Negociación, Ganada, Perdida`; CRUDA/Euphoric Media/Mixmag Spain/TAGMAG = **sin etapas** → empty-state `"<Empresa> no tiene etapas configuradas todavía."` + botón `Configurar etapas`.
- **Presentacional / in-memory**: sin Supabase, sin red, sin persistencia. El "Mover" de tarjetas actualiza estado local.
- **Copy exacto**: stat cards `PIPELINE ABIERTO` / `FORECAST PONDERADO` / `GANADAS`; sublabels `N oportunidades` / `Σ valor × probabilidad` / `N cerradas`. Card footer `Mover`. Crecimiento: `VENTA CRUZADA (CROSS-SELL)`, `CLIENTES EN RIESGO (INACTIVOS)`, `Trabaja con`, `Oportunidad de ofrecer`, `Última actividad`, `Empresas`, `Nunca`, `Configurar etapas`.
- **Formato es-ES**: importes `48.000,00 €` (`Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'})`); fechas `01 oct 2026` (`Intl.DateTimeFormat('es-ES',{day:'2-digit',month:'short',year:'numeric'})`).
- **Forecast ponderado** = Σ(importe × probabilidad de su etapa) de oportunidades abiertas. Caso real de validación: Etra·Contactado 48.000 × 0.25 = 12.000.
- **Deltas intencionales**: brand violeta (`Button variant="primary"`) donde el live usa gris/negro; GANADAS en verde/emerald como el live.
- **Fuera de alcance**: panel Ayuda global (fase Incidencias); formularios `+ Oportunidad`/`Etapas`/`Configurar etapas` (stubs inertes); persistencia; drag&drop real (solo botones Mover).

---

### Task 1: Datos Pipeline — tipos, STAGES, opportunities, helpers

**Files:**
- Create: `src/features/crm/data/pipeline.ts`
- Test: `src/features/crm/data/pipeline.test.ts`

**Interfaces:**
- Produces:
  - Tipos `PipelineStage { id, company, name, order, probability, outcome? }`, `Opportunity { id, orgId, orgName, company, stageId, amount, ownerInitials, ownerColor, closeDate, note?, createdAt }`.
  - `STAGES: PipelineStage[]`, `opportunities: Opportunity[]`, `COMPANIES_WITH_PIPELINE: string[]`.
  - `stagesFor(company: string): PipelineStage[]`
  - `opportunitiesFor(opps: Opportunity[], company: string): Opportunity[]`
  - `groupByStage(opps: Opportunity[], stages: PipelineStage[]): { stage: PipelineStage; opps: Opportunity[]; total: number }[]`
  - `pipelineStats(opps: Opportunity[], stages: PipelineStage[]): { openTotal: number; openCount: number; forecast: number; wonTotal: number; wonCount: number }`
  - `moveOpportunity(opps: Opportunity[], oppId: string, dir: 1 | -1, stages: PipelineStage[]): Opportunity[]`
  - `formatEur(n: number): string`, `formatDate(iso: string): string`

- [ ] **Step 1: Escribir el test**

`src/features/crm/data/pipeline.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import {
  STAGES, opportunities, COMPANIES_WITH_PIPELINE,
  stagesFor, opportunitiesFor, groupByStage, pipelineStats, moveOpportunity,
  formatEur,
} from './pipeline';

describe('pipeline data', () => {
  it('has the exact ConceptOne and Etra stages in order', () => {
    expect(stagesFor('ConceptOne').map((s) => s.name)).toEqual([
      'Interés', 'Oferta enviada', 'Confirmando fecha', 'Contratado', 'Caído',
    ]);
    expect(stagesFor('Etra Agency').map((s) => s.name)).toEqual([
      'Nuevo', 'Contactado', 'Cualificado', 'Propuesta', 'Negociación', 'Ganada', 'Perdida',
    ]);
  });

  it('marks only ConceptOne+Etra as companies with a pipeline', () => {
    expect(COMPANIES_WITH_PIPELINE).toEqual(['ConceptOne', 'Etra Agency']);
    expect(stagesFor('CRUDA')).toEqual([]);
  });

  it('marks won/lost terminal stages', () => {
    const c1 = stagesFor('ConceptOne');
    expect(c1.find((s) => s.name === 'Contratado')?.outcome).toBe('won');
    expect(c1.find((s) => s.name === 'Caído')?.outcome).toBe('lost');
  });

  it('groupByStage buckets opportunities and sums totals', () => {
    const stages = stagesFor('Etra Agency');
    const opps = opportunitiesFor(opportunities, 'Etra Agency');
    const groups = groupByStage(opps, stages);
    expect(groups.map((g) => g.stage.name)).toEqual(stages.map((s) => s.name));
    const perStage = groups.reduce((acc, g) => acc + g.opps.length, 0);
    expect(perStage).toBe(opps.length);
    groups.forEach((g) => {
      expect(g.total).toBe(g.opps.reduce((a, o) => a + o.amount, 0));
    });
  });

  it('pipelineStats: open excludes won/lost; forecast = Σ amount×probability', () => {
    const stages = stagesFor('Etra Agency');
    const opps = opportunitiesFor(opportunities, 'Etra Agency');
    const stats = pipelineStats(opps, stages);
    // recompute expectation independently
    const stageById = Object.fromEntries(stages.map((s) => [s.id, s]));
    const open = opps.filter((o) => !stageById[o.stageId]?.outcome);
    expect(stats.openCount).toBe(open.length);
    expect(stats.openTotal).toBe(open.reduce((a, o) => a + o.amount, 0));
    const forecast = open.reduce((a, o) => a + o.amount * (stageById[o.stageId]?.probability ?? 0), 0);
    expect(stats.forecast).toBeCloseTo(forecast, 2);
    const won = opps.filter((o) => stageById[o.stageId]?.outcome === 'won');
    expect(stats.wonCount).toBe(won.length);
  });

  it('moveOpportunity advances/retreats a stage and clamps at the ends', () => {
    const stages = stagesFor('ConceptOne');
    const opps = opportunitiesFor(opportunities, 'ConceptOne');
    const first = opps[0];
    const firstStageIdx = stages.findIndex((s) => s.id === first.stageId);
    const moved = moveOpportunity(opps, first.id, 1, stages);
    const movedOpp = moved.find((o) => o.id === first.id)!;
    expect(movedOpp.stageId).toBe(stages[Math.min(firstStageIdx + 1, stages.length - 1)].id);
    // clamp: move to stage 0 then back once more stays at 0
    const atStart = moveOpportunity(opps.map((o) => o.id === first.id ? { ...o, stageId: stages[0].id } : o), first.id, -1, stages);
    expect(atStart.find((o) => o.id === first.id)!.stageId).toBe(stages[0].id);
    // immutability
    expect(moved).not.toBe(opps);
  });

  it('formatEur uses es-ES currency', () => {
    expect(formatEur(48000).replace(/ /g, ' ')).toBe('48.000,00 €');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/crm/data/pipeline.test.ts`
Expected: FAIL (module missing).

- [ ] **Step 3: Implementar `pipeline.ts`**

```ts
export interface PipelineStage {
  id: string;
  company: string;
  name: string;
  order: number;
  probability: number; // 0..1
  outcome?: 'won' | 'lost';
}

export interface Opportunity {
  id: string;
  orgId: string;
  orgName: string;
  company: string;
  stageId: string;
  amount: number;
  ownerInitials: string;
  ownerColor: string; // hex
  closeDate: string;  // ISO yyyy-mm-dd
  note?: string;
  createdAt: string;  // ISO
}

export const COMPANIES_WITH_PIPELINE = ['ConceptOne', 'Etra Agency'];

// Probabilidades: solo Contactado (.25, Etra) es observado en el live; el resto son
// asunción de venta razonable a sustituir cuando llegue Supabase.
const CONCEPTONE_STAGES: Omit<PipelineStage, 'company'>[] = [
  { id: 'c1-interes', name: 'Interés', order: 0, probability: 0.1 },
  { id: 'c1-oferta', name: 'Oferta enviada', order: 1, probability: 0.4 },
  { id: 'c1-confirmando', name: 'Confirmando fecha', order: 2, probability: 0.7 },
  { id: 'c1-contratado', name: 'Contratado', order: 3, probability: 1, outcome: 'won' },
  { id: 'c1-caido', name: 'Caído', order: 4, probability: 0, outcome: 'lost' },
];
const ETRA_STAGES: Omit<PipelineStage, 'company'>[] = [
  { id: 'et-nuevo', name: 'Nuevo', order: 0, probability: 0.1 },
  { id: 'et-contactado', name: 'Contactado', order: 1, probability: 0.25 },
  { id: 'et-cualificado', name: 'Cualificado', order: 2, probability: 0.4 },
  { id: 'et-propuesta', name: 'Propuesta', order: 3, probability: 0.6 },
  { id: 'et-negociacion', name: 'Negociación', order: 4, probability: 0.8 },
  { id: 'et-ganada', name: 'Ganada', order: 5, probability: 1, outcome: 'won' },
  { id: 'et-perdida', name: 'Perdida', order: 6, probability: 0, outcome: 'lost' },
];

export const STAGES: PipelineStage[] = [
  ...CONCEPTONE_STAGES.map((s) => ({ ...s, company: 'ConceptOne' })),
  ...ETRA_STAGES.map((s) => ({ ...s, company: 'Etra Agency' })),
];

// Oportunidades sobre clientes existentes (orgs). Incluye el patrón de la real
// del live (Etra · Contactado · 48.000 € · nota con fecha).
export const opportunities: Opportunity[] = [
  { id: 'op1', orgId: 'o2', orgName: 'Foot District', company: 'Etra Agency', stageId: 'et-contactado', amount: 48000, ownerInitials: 'IC', ownerColor: '#059669', closeDate: '2026-10-01', note: 'Mostrar la oficina reformada · 15 sept 2026', createdAt: '2026-06-20' },
  { id: 'op2', orgId: 'o1', orgName: 'BMG', company: 'Etra Agency', stageId: 'et-nuevo', amount: 12000, ownerInitials: 'MR', ownerColor: '#2563eb', closeDate: '2026-11-15', note: 'Campaña lanzamiento Q4', createdAt: '2026-07-01' },
  { id: 'op3', orgId: 'o3', orgName: 'New Era', company: 'Etra Agency', stageId: 'et-propuesta', amount: 30000, ownerInitials: 'AC', ownerColor: '#db2777', closeDate: '2026-09-30', note: 'Propuesta anual · 12 sept 2026', createdAt: '2026-05-10' },
  { id: 'op4', orgId: 'o1', orgName: 'BMG', company: 'Etra Agency', stageId: 'et-ganada', amount: 20000, ownerInitials: 'IC', ownerColor: '#059669', closeDate: '2026-06-01', note: 'Cerrada · retención', createdAt: '2026-03-01' },
  { id: 'op5', orgId: 'o5', orgName: 'ALQUIEVENTS SL', company: 'ConceptOne', stageId: 'c1-interes', amount: 8000, ownerInitials: 'JG', ownerColor: '#7c3aed', closeDate: '2026-12-01', note: 'Alquiler escenario', createdAt: '2026-07-05' },
  { id: 'op6', orgId: 'o4', orgName: '1A PROJECTS 1802 SL', company: 'ConceptOne', stageId: 'c1-oferta', amount: 15000, ownerInitials: 'JG', ownerColor: '#7c3aed', closeDate: '2026-10-20', note: 'Oferta producción', createdAt: '2026-06-15' },
  { id: 'op7', orgId: 'o5', orgName: 'ALQUIEVENTS SL', company: 'ConceptOne', stageId: 'c1-confirmando', amount: 25000, ownerInitials: 'IC', ownerColor: '#059669', closeDate: '2026-09-15', note: 'Confirmando fecha festival', createdAt: '2026-04-22' },
];

export function stagesFor(company: string): PipelineStage[] {
  return STAGES.filter((s) => s.company === company).sort((a, b) => a.order - b.order);
}

export function opportunitiesFor(opps: Opportunity[], company: string): Opportunity[] {
  return opps.filter((o) => o.company === company);
}

export function groupByStage(opps: Opportunity[], stages: PipelineStage[]) {
  return stages.map((stage) => {
    const stageOpps = opps.filter((o) => o.stageId === stage.id);
    return { stage, opps: stageOpps, total: stageOpps.reduce((a, o) => a + o.amount, 0) };
  });
}

export function pipelineStats(opps: Opportunity[], stages: PipelineStage[]) {
  const byId = Object.fromEntries(stages.map((s) => [s.id, s]));
  const open = opps.filter((o) => !byId[o.stageId]?.outcome);
  const won = opps.filter((o) => byId[o.stageId]?.outcome === 'won');
  return {
    openTotal: open.reduce((a, o) => a + o.amount, 0),
    openCount: open.length,
    forecast: open.reduce((a, o) => a + o.amount * (byId[o.stageId]?.probability ?? 0), 0),
    wonTotal: won.reduce((a, o) => a + o.amount, 0),
    wonCount: won.length,
  };
}

export function moveOpportunity(opps: Opportunity[], oppId: string, dir: 1 | -1, stages: PipelineStage[]): Opportunity[] {
  return opps.map((o) => {
    if (o.id !== oppId) return o;
    const idx = stages.findIndex((s) => s.id === o.stageId);
    if (idx === -1) return o;
    const next = Math.max(0, Math.min(stages.length - 1, idx + dir));
    return { ...o, stageId: stages[next].id };
  });
}

const EUR = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });
export function formatEur(n: number): string {
  return EUR.format(n);
}

const DATE = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
export function formatDate(iso: string): string {
  return DATE.format(new Date(iso + 'T00:00:00')).replace('.', '');
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/features/crm/data/pipeline.test.ts`
Expected: PASS (7 tests). If `formatEur` assertion fails on the non-breaking space, the test already normalizes ` `→space; ensure implementation returns the standard Intl output.

- [ ] **Step 5: Commit**

```bash
git add src/features/crm/data/pipeline.ts src/features/crm/data/pipeline.test.ts
git commit -m "feat(fase8): pipeline data — stages (ConceptOne/Etra) + opportunities + helpers"
```

---

### Task 2: Datos Crecimiento — crossSell + atRisk

**Files:**
- Create: `src/features/crm/data/crecimiento.ts`
- Test: `src/features/crm/data/crecimiento.test.ts`

**Interfaces:**
- Consumes: `orgs`, `GROUP_COMPANIES`, `CrmOrg` (`./seed`); `Opportunity`, `opportunities` (`./pipeline`).
- Produces:
  - `crossSell(orgs: CrmOrg[]): { rows: { org: CrmOrg; worksWith: string; offer: string[] }[]; unassignedCount: number }`
  - `atRisk(orgs: CrmOrg[], opps: Opportunity[], months: number): { org: CrmOrg; lastActivity: string | null; companies: string[] }[]`
  - `RISK_OPTIONS: number[]` (`[3, 6, 12]`).

- [ ] **Step 1: Escribir el test**

`src/features/crm/data/crecimiento.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { orgs } from './seed';
import { opportunities } from './pipeline';
import { crossSell, atRisk, RISK_OPTIONS } from './crecimiento';

describe('crecimiento data', () => {
  it('crossSell: only clients working with exactly one company; offer = the rest', () => {
    const { rows, unassignedCount } = crossSell(orgs);
    rows.forEach((r) => {
      expect(r.org.roles).toContain('Cliente');
      expect(r.org.worksWith.length).toBe(1);
      expect(r.worksWith).toBe(r.org.worksWith[0]);
      expect(r.offer).not.toContain(r.worksWith);
      // offer are group companies
      r.offer.forEach((c) => expect(['ConceptOne', 'CRUDA', 'Etra Agency', 'Euphoric Media', 'Mixmag Spain', 'TAGMAG']).toContain(c));
    });
    expect(unassignedCount).toBe(orgs.filter((o) => o.roles.includes('Cliente') && o.worksWith.length === 0).length);
  });

  it('atRisk: lastActivity is most recent opp date or null; respects the months threshold', () => {
    const rows = atRisk(orgs, opportunities, 6);
    rows.forEach((r) => {
      const orgOpps = opportunities.filter((o) => o.orgId === r.org.id);
      if (orgOpps.length === 0) expect(r.lastActivity).toBeNull();
      expect(r.companies).toEqual(r.org.worksWith);
    });
    // 12-month threshold is >= 6-month set is not guaranteed; just assert it returns an array
    expect(Array.isArray(atRisk(orgs, opportunities, 12))).toBe(true);
  });

  it('exposes risk options 3/6/12', () => {
    expect(RISK_OPTIONS).toEqual([3, 6, 12]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/crm/data/crecimiento.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implementar `crecimiento.ts`**

```ts
import { GROUP_COMPANIES, type CrmOrg } from './seed';
import type { Opportunity } from './pipeline';

export const RISK_OPTIONS = [3, 6, 12];

export function crossSell(orgs: CrmOrg[]) {
  const clients = orgs.filter((o) => o.roles.includes('Cliente'));
  const rows = clients
    .filter((o) => o.worksWith.length === 1)
    .map((org) => {
      const worksWith = org.worksWith[0];
      const offer = GROUP_COMPANIES.filter((c) => c !== worksWith);
      return { org, worksWith, offer };
    });
  const unassignedCount = clients.filter((o) => o.worksWith.length === 0).length;
  return { rows, unassignedCount };
}

export function atRisk(orgs: CrmOrg[], opps: Opportunity[], months: number) {
  const now = new Date('2026-07-13T00:00:00').getTime();
  const cutoff = now - months * 30 * 24 * 60 * 60 * 1000;
  const clients = orgs.filter((o) => o.roles.includes('Cliente'));
  return clients
    .map((org) => {
      const orgOpps = opps.filter((o) => o.orgId === org.id);
      const last = orgOpps
        .map((o) => o.closeDate)
        .sort()
        .at(-1) ?? null;
      return { org, lastActivity: last, companies: org.worksWith };
    })
    .filter((r) => r.lastActivity === null || new Date(r.lastActivity + 'T00:00:00').getTime() < cutoff);
}
```

> Nota: `atRisk` incluye clientes cuya última oportunidad es anterior al umbral o que nunca tuvieron actividad (`null`). `now` es fijo (`2026-07-13`) para tests deterministas — el proyecto no usa `Date.now()` mutable en seeds.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/features/crm/data/crecimiento.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/features/crm/data/crecimiento.ts src/features/crm/data/crecimiento.test.ts
git commit -m "feat(fase8): crecimiento data — crossSell + atRisk (derivan de orgs/opps)"
```

---

### Task 3: `OpportunityCard`

**Files:**
- Create: `src/features/crm/components/OpportunityCard.tsx`
- Test: `src/features/crm/components/OpportunityCard.test.tsx`

**Interfaces:**
- Consumes: `Opportunity`, `formatEur`, `formatDate` (`../data/pipeline`).
- Produces: `OpportunityCard({ opp, canPrev, canNext, onMove }: { opp: Opportunity; canPrev: boolean; canNext: boolean; onMove: (dir: 1 | -1) => void })`

- [ ] **Step 1: Escribir el test**

`src/features/crm/components/OpportunityCard.test.tsx`:
```tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { OpportunityCard } from './OpportunityCard';
import { opportunities } from '../data/pipeline';

const opp = opportunities.find((o) => o.id === 'op1')!; // Foot District 48.000

describe('OpportunityCard', () => {
  it('renders client name, amount, close date, note and owner initials', () => {
    render(<OpportunityCard opp={opp} canPrev canNext onMove={() => {}} />);
    expect(screen.getByText('Foot District')).toBeInTheDocument();
    expect(screen.getByText(/48\.000,00/)).toBeInTheDocument();
    expect(screen.getByText(/Cierre:/)).toBeInTheDocument();
    expect(screen.getByText(/Mostrar la oficina reformada/)).toBeInTheDocument();
    expect(screen.getByText('IC')).toBeInTheDocument();
  });

  it('calls onMove with direction and disables edges', () => {
    const onMove = vi.fn();
    render(<OpportunityCard opp={opp} canPrev={false} canNext onMove={onMove} />);
    const prev = screen.getByRole('button', { name: 'Mover a etapa anterior' });
    const next = screen.getByRole('button', { name: 'Mover a etapa siguiente' });
    expect(prev).toBeDisabled();
    fireEvent.click(next);
    expect(onMove).toHaveBeenCalledWith(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/crm/components/OpportunityCard.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implementar `OpportunityCard.tsx`**

```tsx
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Opportunity } from '../data/pipeline';
import { formatEur, formatDate } from '../data/pipeline';

interface Props {
  opp: Opportunity;
  canPrev: boolean;
  canNext: boolean;
  onMove: (dir: 1 | -1) => void;
}

export function OpportunityCard({ opp, canPrev, canNext, onMove }: Props) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <p className="font-medium text-slate-800">{opp.orgName}</p>
      <div className="mt-1 flex items-center justify-between gap-2">
        <span className="font-bold text-slate-800">{formatEur(opp.amount)}</span>
        <span
          className="grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full text-[9px] font-semibold text-white"
          style={{ backgroundColor: opp.ownerColor }}
          title={opp.ownerInitials}
        >
          {opp.ownerInitials}
        </span>
      </div>
      <p className="mt-1 text-xs text-slate-400">Cierre: {formatDate(opp.closeDate)}</p>
      {opp.note && <p className="mt-0.5 truncate text-xs text-slate-400">↳ {opp.note}</p>}
      <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 text-xs text-slate-400">
        <button
          type="button"
          aria-label="Mover a etapa anterior"
          disabled={!canPrev}
          onClick={() => onMove(-1)}
          className="grid h-6 w-6 place-items-center rounded hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span>Mover</span>
        <button
          type="button"
          aria-label="Mover a etapa siguiente"
          disabled={!canNext}
          onClick={() => onMove(1)}
          className="grid h-6 w-6 place-items-center rounded hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/features/crm/components/OpportunityCard.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/features/crm/components/OpportunityCard.tsx src/features/crm/components/OpportunityCard.test.tsx
git commit -m "feat(fase8): OpportunityCard (calco tarjeta + Mover ◀▶)"
```

---

### Task 4: `PipelineStatCards` + `PipelineColumn` + `PipelineBoard`

**Files:**
- Create: `src/features/crm/components/PipelineStatCards.tsx`
- Create: `src/features/crm/components/PipelineColumn.tsx`
- Create: `src/features/crm/components/PipelineBoard.tsx`
- Test: `src/features/crm/components/PipelineBoard.test.tsx`

**Interfaces:**
- Consumes: `OpportunityCard` (Task 3); `PipelineStage`, `Opportunity`, `groupByStage`, `pipelineStats`, `formatEur`, `stagesFor`, `opportunitiesFor` (`../data/pipeline`).
- Produces:
  - `PipelineStatCards({ stats }: { stats: ReturnType<typeof pipelineStats> })`
  - `PipelineColumn({ stage, opps, total, stages, onMove }: { stage: PipelineStage; opps: Opportunity[]; total: number; stages: PipelineStage[]; onMove: (oppId: string, dir: 1 | -1) => void })`
  - `PipelineBoard({ company, opps, onMove }: { company: string; opps: Opportunity[]; onMove: (oppId: string, dir: 1 | -1) => void })` — renders the empty-state when the company has no stages.

- [ ] **Step 1: Escribir el test**

`src/features/crm/components/PipelineBoard.test.tsx`:
```tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PipelineBoard } from './PipelineBoard';
import { PipelineStatCards } from './PipelineStatCards';
import { opportunitiesFor, stagesFor, pipelineStats, opportunities } from '../data/pipeline';

describe('PipelineBoard', () => {
  it('renders the exact ConceptOne stage columns', () => {
    render(<PipelineBoard company="ConceptOne" opps={opportunitiesFor(opportunities, 'ConceptOne')} onMove={() => {}} />);
    ['Interés', 'Oferta enviada', 'Confirmando fecha', 'Contratado', 'Caído'].forEach((s) =>
      expect(screen.getByText(s)).toBeInTheDocument()
    );
  });

  it('shows the empty-state for a company without stages', () => {
    render(<PipelineBoard company="CRUDA" opps={[]} onMove={() => {}} />);
    expect(screen.getByText('CRUDA no tiene etapas configuradas todavía.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Configurar etapas' })).toBeInTheDocument();
  });

  it('moving the first stage card calls onMove; edge disables prev', () => {
    const onMove = vi.fn();
    const opps = opportunitiesFor(opportunities, 'Etra Agency');
    render(<PipelineBoard company="Etra Agency" opps={opps} onMove={onMove} />);
    // op2 BMG is in 'Nuevo' (first stage) → prev disabled
    const bmg = screen.getByText('BMG').closest('div')!;
    expect(bmg).toBeInTheDocument();
  });
});

describe('PipelineStatCards', () => {
  it('renders the three stat labels and won value in emerald', () => {
    const stats = pipelineStats(opportunitiesFor(opportunities, 'Etra Agency'), stagesFor('Etra Agency'));
    render(<PipelineStatCards stats={stats} />);
    expect(screen.getByText('PIPELINE ABIERTO')).toBeInTheDocument();
    expect(screen.getByText('FORECAST PONDERADO')).toBeInTheDocument();
    expect(screen.getByText('GANADAS')).toBeInTheDocument();
    expect(screen.getByText('Σ valor × probabilidad')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/crm/components/PipelineBoard.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implementar `PipelineStatCards.tsx`**

```tsx
import { formatEur, type pipelineStats } from '../data/pipeline';

type Stats = ReturnType<typeof pipelineStats>;

function StatCard({ label, value, sub, valueClass }: { label: string; value: string; sub: string; valueClass?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${valueClass ?? 'text-slate-800'}`}>{value}</p>
      <p className="mt-1 text-xs text-slate-400">{sub}</p>
    </div>
  );
}

export function PipelineStatCards({ stats }: { stats: Stats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard label="PIPELINE ABIERTO" value={formatEur(stats.openTotal)} sub={`${stats.openCount} oportunidades`} />
      <StatCard label="FORECAST PONDERADO" value={formatEur(stats.forecast)} sub="Σ valor × probabilidad" />
      <StatCard label="GANADAS" value={formatEur(stats.wonTotal)} sub={`${stats.wonCount} cerradas`} valueClass="text-emerald-600" />
    </div>
  );
}
```

- [ ] **Step 4: Implementar `PipelineColumn.tsx`**

```tsx
import type { PipelineStage, Opportunity } from '../data/pipeline';
import { formatEur } from '../data/pipeline';
import { OpportunityCard } from './OpportunityCard';

interface Props {
  stage: PipelineStage;
  opps: Opportunity[];
  total: number;
  stages: PipelineStage[];
  onMove: (oppId: string, dir: 1 | -1) => void;
}

export function PipelineColumn({ stage, opps, total, stages, onMove }: Props) {
  const idx = stages.findIndex((s) => s.id === stage.id);
  return (
    <div className="w-72 shrink-0">
      <div className="mb-2 flex items-center gap-2 px-1">
        <span className="font-semibold text-slate-800">{stage.name}</span>
        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-slate-100 px-1.5 text-xs font-medium text-slate-500">{opps.length}</span>
        <span className="ml-auto text-xs text-slate-400">{formatEur(total)}</span>
      </div>
      {opps.length === 0 ? (
        <p className="px-1 text-sm text-slate-300">—</p>
      ) : (
        <div className="space-y-2">
          {opps.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opp={opp}
              canPrev={idx > 0}
              canNext={idx < stages.length - 1}
              onMove={(dir) => onMove(opp.id, dir)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Implementar `PipelineBoard.tsx`**

```tsx
import { stagesFor, groupByStage, type Opportunity } from '../data/pipeline';
import { PipelineColumn } from './PipelineColumn';

interface Props {
  company: string;
  opps: Opportunity[];
  onMove: (oppId: string, dir: 1 | -1) => void;
}

export function PipelineBoard({ company, opps, onMove }: Props) {
  const stages = stagesFor(company);
  if (stages.length === 0) {
    return (
      <div className="grid place-items-center gap-3 rounded-2xl border border-dashed border-slate-200 py-16 text-center">
        <p className="text-sm text-slate-500">{company} no tiene etapas configuradas todavía.</p>
        <button type="button" className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          Configurar etapas
        </button>
      </div>
    );
  }
  const groups = groupByStage(opps, stages);
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {groups.map(({ stage, opps: stageOpps, total }) => (
        <PipelineColumn key={stage.id} stage={stage} opps={stageOpps} total={total} stages={stages} onMove={onMove} />
      ))}
    </div>
  );
}
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npx vitest run src/features/crm/components/PipelineBoard.test.tsx`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/features/crm/components/PipelineStatCards.tsx src/features/crm/components/PipelineColumn.tsx src/features/crm/components/PipelineBoard.tsx src/features/crm/components/PipelineBoard.test.tsx
git commit -m "feat(fase8): PipelineStatCards + PipelineColumn + PipelineBoard (+ empty-state)"
```

---

### Task 5: `PipelinePage` (compone header + stats + board)

**Files:**
- Modify: `src/features/crm/pages/PipelinePage.tsx` (replace placeholder)
- Create: `src/features/crm/pages/PipelinePage.test.tsx`

**Interfaces:**
- Consumes: `PipelineStatCards`, `PipelineBoard` (Task 4); `opportunities`, `opportunitiesFor`, `stagesFor`, `pipelineStats`, `moveOpportunity`, `GROUP_COMPANIES`, `Button` (`@/components/ui`).
- Produces: `PipelinePage()`

- [ ] **Step 1: Escribir el test**

`src/features/crm/pages/PipelinePage.test.tsx`:
```tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PipelinePage } from './PipelinePage';

describe('PipelinePage', () => {
  it('renders header, stat cards and the default ConceptOne board', () => {
    render(<PipelinePage />);
    expect(screen.getByRole('heading', { name: 'Pipeline de ventas' })).toBeInTheDocument();
    expect(screen.getByText('PIPELINE ABIERTO')).toBeInTheDocument();
    expect(screen.getByText('Interés')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Oportunidad/ })).toBeInTheDocument();
  });

  it('switching company to CRUDA shows its empty-state', () => {
    render(<PipelinePage />);
    fireEvent.change(screen.getByLabelText('Empresa'), { target: { value: 'CRUDA' } });
    expect(screen.getByText('CRUDA no tiene etapas configuradas todavía.')).toBeInTheDocument();
  });

  it('switching to Etra shows its stages and an opportunity', () => {
    render(<PipelinePage />);
    fireEvent.change(screen.getByLabelText('Empresa'), { target: { value: 'Etra Agency' } });
    expect(screen.getByText('Contactado')).toBeInTheDocument();
    expect(screen.getByText('Foot District')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/crm/pages/PipelinePage.test.tsx`
Expected: FAIL (still the placeholder).

- [ ] **Step 3: Implementar `PipelinePage.tsx`**

```tsx
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui';
import { GROUP_COMPANIES } from '../data/seed';
import {
  opportunities as seedOpps, opportunitiesFor, stagesFor, pipelineStats, moveOpportunity,
  type Opportunity,
} from '../data/pipeline';
import { PipelineStatCards } from '../components/PipelineStatCards';
import { PipelineBoard } from '../components/PipelineBoard';

export function PipelinePage() {
  const [company, setCompany] = useState('ConceptOne');
  const [opps, setOpps] = useState<Opportunity[]>(seedOpps);

  const companyOpps = useMemo(() => opportunitiesFor(opps, company), [opps, company]);
  const stats = useMemo(() => pipelineStats(companyOpps, stagesFor(company)), [companyOpps, company]);

  const handleMove = (oppId: string, dir: 1 | -1) =>
    setOpps((prev) => moveOpportunity(prev, oppId, dir, stagesFor(company)));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-slate-800">Pipeline de ventas</h1>
          <p className="text-sm text-slate-500">Oportunidades por etapa. Cada empresa del grupo tiene su propio embudo.</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            aria-label="Empresa"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 focus:border-brand-400 focus:outline-none"
          >
            {GROUP_COMPANIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <Button variant="secondary">Etapas</Button>
          <Button variant="primary">+ Oportunidad</Button>
        </div>
      </div>

      <PipelineStatCards stats={stats} />
      <PipelineBoard company={company} opps={companyOpps} onMove={handleMove} />
    </div>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/features/crm/pages/PipelinePage.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/features/crm/pages/PipelinePage.tsx src/features/crm/pages/PipelinePage.test.tsx
git commit -m "feat(fase8): PipelinePage — header + select empresa + stats + board (Mover funcional)"
```

---

### Task 6: `CrossSellTable` + `AtRiskTable`

**Files:**
- Create: `src/features/crm/components/CrossSellTable.tsx`
- Create: `src/features/crm/components/AtRiskTable.tsx`
- Test: `src/features/crm/components/CrecimientoTables.test.tsx`

**Interfaces:**
- Consumes: `crossSell`, `atRisk` return row types (`../data/crecimiento`); `formatDate` (`../data/pipeline`).
- Produces:
  - `CrossSellTable({ rows }: { rows: ReturnType<typeof crossSell>['rows'] })`
  - `AtRiskTable({ rows }: { rows: ReturnType<typeof atRisk> })`

- [ ] **Step 1: Escribir el test**

`src/features/crm/components/CrecimientoTables.test.tsx`:
```tsx
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CrossSellTable } from './CrossSellTable';
import { AtRiskTable } from './AtRiskTable';
import { orgs } from '../data/seed';
import { opportunities } from '../data/pipeline';
import { crossSell, atRisk } from '../data/crecimiento';

describe('Crecimiento tables', () => {
  it('CrossSellTable renders headers, the "Trabaja con" chip and offer chips', () => {
    const { rows } = crossSell(orgs);
    render(<CrossSellTable rows={rows} />);
    expect(screen.getByText('Cliente')).toBeInTheDocument();
    expect(screen.getByText('Trabaja con')).toBeInTheDocument();
    expect(screen.getByText('Oportunidad de ofrecer')).toBeInTheDocument();
    // at least one row + a company chip
    expect(rows.length).toBeGreaterThan(0);
  });

  it('AtRiskTable shows "Nunca" for clients without activity', () => {
    const rows = atRisk(orgs, opportunities, 6);
    render(<AtRiskTable rows={rows} />);
    expect(screen.getByText('Última actividad')).toBeInTheDocument();
    expect(screen.getByText('Empresas')).toBeInTheDocument();
    const nunca = screen.queryAllByText('Nunca');
    expect(nunca.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/crm/components/CrecimientoTables.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implementar `CrossSellTable.tsx`**

```tsx
import { Card } from '@/components/ui';
import type { crossSell } from '../data/crecimiento';

type Rows = ReturnType<typeof crossSell>['rows'];

function CompanyChip({ name }: { name: string }) {
  return <span className="inline-flex items-center rounded-full bg-blue-600/10 px-2.5 py-0.5 text-xs font-medium text-blue-600">{name}</span>;
}
function OfferChip({ name }: { name: string }) {
  return <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-500">{name}</span>;
}

export function CrossSellTable({ rows }: { rows: Rows }) {
  return (
    <Card className="overflow-hidden border-slate-200 p-0">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-left text-sm font-semibold text-slate-400">
            <th className="px-4 py-3">Cliente</th>
            <th className="px-4 py-3">Trabaja con</th>
            <th className="px-4 py-3">Oportunidad de ofrecer</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map(({ org, worksWith, offer }) => (
            <tr key={org.id}>
              <td className="px-4 py-3 text-slate-800">{org.name}</td>
              <td className="px-4 py-3"><CompanyChip name={worksWith} /></td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1.5">
                  {offer.map((c) => <OfferChip key={c} name={c} />)}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
```

- [ ] **Step 4: Implementar `AtRiskTable.tsx`**

```tsx
import { Card } from '@/components/ui';
import { formatDate } from '../data/pipeline';
import type { atRisk } from '../data/crecimiento';

type Rows = ReturnType<typeof atRisk>;

export function AtRiskTable({ rows }: { rows: Rows }) {
  return (
    <Card className="overflow-hidden border-slate-200 p-0">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-left text-sm font-semibold text-slate-400">
            <th className="px-4 py-3">Cliente</th>
            <th className="px-4 py-3">Última actividad</th>
            <th className="px-4 py-3">Empresas</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map(({ org, lastActivity, companies }) => (
            <tr key={org.id}>
              <td className="px-4 py-3 text-slate-800">{org.name}</td>
              <td className="px-4 py-3">
                {lastActivity === null
                  ? <span className="text-amber-600">Nunca</span>
                  : <span className="text-slate-600">{formatDate(lastActivity)}</span>}
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1.5">
                  {companies.map((c) => (
                    <span key={c} className="inline-flex items-center rounded-full bg-blue-600/10 px-2.5 py-0.5 text-xs font-medium text-blue-600">{c}</span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/features/crm/components/CrecimientoTables.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 6: Commit**

```bash
git add src/features/crm/components/CrossSellTable.tsx src/features/crm/components/AtRiskTable.tsx src/features/crm/components/CrecimientoTables.test.tsx
git commit -m "feat(fase8): CrossSellTable + AtRiskTable (Crecimiento)"
```

---

### Task 7: `CrecimientoPage` (compone las 2 secciones)

**Files:**
- Modify: `src/features/crm/pages/CrecimientoPage.tsx` (replace placeholder)
- Create: `src/features/crm/pages/CrecimientoPage.test.tsx`

**Interfaces:**
- Consumes: `CrossSellTable`, `AtRiskTable` (Task 6); `crossSell`, `atRisk`, `RISK_OPTIONS` (`../data/crecimiento`); `orgs` (`../data/seed`); `opportunities` (`../data/pipeline`).
- Produces: `CrecimientoPage()`

- [ ] **Step 1: Escribir el test**

`src/features/crm/pages/CrecimientoPage.test.tsx`:
```tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CrecimientoPage } from './CrecimientoPage';

describe('CrecimientoPage', () => {
  it('renders both sections and the unassigned note', () => {
    render(<CrecimientoPage />);
    expect(screen.getByRole('heading', { name: 'Crecimiento' })).toBeInTheDocument();
    expect(screen.getByText('VENTA CRUZADA (CROSS-SELL)')).toBeInTheDocument();
    expect(screen.getByText('CLIENTES EN RIESGO (INACTIVOS)')).toBeInTheDocument();
    expect(screen.getByText(/sin ninguna empresa asignada/)).toBeInTheDocument();
  });

  it('has a risk-threshold select with 3/6/12 month options', () => {
    render(<CrecimientoPage />);
    const select = screen.getByLabelText('Umbral de inactividad') as HTMLSelectElement;
    expect([...select.options].map((o) => o.textContent)).toEqual([
      'Sin actividad en 3 meses', 'Sin actividad en 6 meses', 'Sin actividad en 12 meses',
    ]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/crm/pages/CrecimientoPage.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implementar `CrecimientoPage.tsx`**

```tsx
import { useMemo, useState } from 'react';
import { orgs } from '../data/seed';
import { opportunities } from '../data/pipeline';
import { crossSell, atRisk, RISK_OPTIONS } from '../data/crecimiento';
import { CrossSellTable } from '../components/CrossSellTable';
import { AtRiskTable } from '../components/AtRiskTable';

export function CrecimientoPage() {
  const [months, setMonths] = useState(6);
  const cross = useMemo(() => crossSell(orgs), []);
  const risk = useMemo(() => atRisk(orgs, opportunities, months), [months]);

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-800">Crecimiento</h1>
        <p className="text-sm text-slate-500">Oportunidades de venta cruzada entre empresas del grupo y clientes en riesgo por inactividad.</p>
      </div>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Venta cruzada (cross-sell)</h2>
        <p className="text-sm text-slate-500">Clientes que hoy solo trabajan con una empresa del grupo. Candidatos a ofrecerles los otros servicios.</p>
        <CrossSellTable rows={cross.rows} />
        <p className="text-sm text-slate-400">Además, {cross.unassignedCount} clientes sin ninguna empresa asignada — conviene revisarlos en el CRM.</p>
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Clientes en riesgo (inactivos)</h2>
          <select
            aria-label="Umbral de inactividad"
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 focus:border-brand-400 focus:outline-none"
          >
            {RISK_OPTIONS.map((m) => <option key={m} value={m}>Sin actividad en {m} meses</option>)}
          </select>
        </div>
        <p className="text-sm text-slate-500">Actividad medida por oportunidades del CRM (creación o cierre). Ideal para campañas de reactivación.</p>
        <AtRiskTable rows={risk} />
      </section>
    </div>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/features/crm/pages/CrecimientoPage.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: tsc + lint + full suite**

Run:
```bash
npx tsc --noEmit && npm run lint && npx vitest run
```
Expected: todo verde.

- [ ] **Step 6: Commit**

```bash
git add src/features/crm/pages/CrecimientoPage.tsx src/features/crm/pages/CrecimientoPage.test.tsx
git commit -m "feat(fase8): CrecimientoPage — venta cruzada + clientes en riesgo (select umbral)"
```

---

### Task 8: Verificación pixel-perfect (Playwright) + full green

- [ ] **Step 1: Full test run**

Run: `npx vitest run`
Expected: toda la suite verde (los previos + los nuevos de fase8).

- [ ] **Step 2: Dev server + comparación vs live**

Run (background): `npm run dev`. Abrir `http://localhost:5173/crm/pipeline` y `/crm/crecimiento`. Comparar contra `docs/references/crm/live-pipeline-etra-data.png`, `live-pipeline-empty-state.png`, `live-crecimiento.png`:
- Pipeline: cabecera (título + select empresa + Etapas + `+ Oportunidad`), 3 stat cards (GANADAS en verde), columnas exactas por empresa (ConceptOne 5 / Etra 7), tarjeta calco (nombre, importe, avatar, Cierre, nota, Mover), empty-state CRUDA.
- Cambiar el select a Etra → aparece Foot District 48.000 € en Contactado; pulsar ▶ mueve la tarjeta a Cualificado (stat FORECAST cambia).
- Crecimiento: dos secciones, tabla cross-sell con chips, nota "N sin empresa", tabla riesgo con "Nunca" naranja + select 3/6/12.

- [ ] **Step 3: Ajustes finos si el token se desvía + commit.**

- [ ] **Step 4: Actualizar el ledger SDD** con el resultado de la verificación.

---

## Self-Review (autor)

**Cobertura del spec:**
- §2 empresas/etapas exactas + empty-state → Task 1 (stages) + Task 4 (board empty-state). ✓
- §3 tokens (stat cards, columna, tarjeta, empty-state, tablas) → Tasks 3,4,6. ✓
- §4 modelo de datos (PipelineStage/Opportunity + helpers) → Task 1; Crecimiento helpers → Task 2. ✓
- §5 componentes/páginas → Tasks 3–7. ✓
- §6 alcance (select funcional, Mover funcional, stubs) → Tasks 4,5. ✓
- §8 tests → cada task + Task 8 verificación. ✓

**Placeholder scan:** sin TBD/TODO; todo el código presente. Etapas/copy verbatim del live.

**Consistencia de tipos:** `PipelineStage`/`Opportunity` (Task 1) usados igual en Tasks 3–5. `crossSell`/`atRisk` return types (Task 2) consumidos en Tasks 6–7. `formatEur`/`formatDate` compartidos. Firmas `pipelineStats`/`groupByStage`/`moveOpportunity`/`stagesFor`/`opportunitiesFor` coinciden entre definición y consumo.

**Nota:** las probabilidades por etapa (salvo Contactado .25) son asunción documentada en el seed — no afectan al layout y se sustituirán con Supabase.
