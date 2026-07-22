# Mixmag/TAGMAG Fase B — Contenidos Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar el placeholder de la pestaña Contenidos de Mixmag/TAGMAG por un calco fiel y funcional (vistas Panel + Kanban) parametrizado por revista.

**Architecture:** Una `ContenidosPage` lee `useOutletContext<Magazine>` y obtiene estados/piezas desde un módulo de datos separado `contenidos.ts` (keyed por `magazine.id`, patrón espejo de `crm/data/pipeline.ts`). Componentes pequeños y aislados: toolbar, cajas de estado, filas (Panel), tabs+columnas+tarjetas (Kanban). Interactividad de filtros/vista in-memory; nunca muta el live ni persiste.

**Tech Stack:** React 19, react-router 7, Tailwind 3, lucide-react, Vitest + Testing Library, TypeScript strict (target ES2020, `noUnusedLocals`, lint `--max-warnings 0`).

## Global Constraints

- Prohibido mutar el live; todo presentacional/in-memory, sin persistencia Supabase.
- Modelo de datos espeja tablas Supabase (FKs `statusId`/`campaignId`; `campaignName`/`dueLabel` denormalizados/snapshot documentados).
- Pixel-perfect contra `docs/references/mixmag/live-{mixmag,tagmag}-contenidos-{panel,kanban}.png`.
- Sin clases `brand-*` en los grises/negros del live. Botón `+ Contenido` = `#44444C`.
- es-ES en toda la copy. Target ES2020: NO usar `Array.prototype.at()` (usar índices).
- Ubicación: `src/features/redaccion/` (datos en `data/contenidos.ts`, componentes en `components/`, página en `pages/`).
- Cada test importa `'@testing-library/jest-dom'`. Commits frecuentes (uno por tarea).

---

### Task 1: Modelo de datos + helpers (`contenidos.ts`)

**Files:**
- Create: `src/features/redaccion/data/contenidos.ts`
- Test: `src/features/redaccion/data/contenidos.test.ts`

**Interfaces:**
- Produces:
  - `type ContentTeam = 'redes' | 'web' | 'revista'`
  - `type MagazineId = 'mixmag' | 'tagmag'`
  - `interface ContentStatus { id: string; magazine: MagazineId; label: string; order: number; teamsOnly?: ContentTeam[]; tone: 'plain'|'slate'|'amber' }`
  - `interface ContentPiece { id: string; magazine: MagazineId; team: ContentTeam; statusId: string; title: string; type: string; campaignId?: string; campaignName?: string; dueLabel: string; ownerInitials?: string; ownerColor?: string; mine: boolean }`
  - `STATUSES: ContentStatus[]`, `pieces: ContentPiece[]`
  - `TEAMS: { id: ContentTeam; label: string; chip: string }[]`
  - `statusesFor(magazine: MagazineId): ContentStatus[]`
  - `statusesForTeam(magazine: MagazineId, team: ContentTeam): ContentStatus[]`
  - `piecesFor(magazine: MagazineId): ContentPiece[]`
  - `interface PieceFilter { query?: string; mine?: boolean; scope?: 'todo'|'campana'|'organico'; team?: ContentTeam; statusId?: string }`
  - `filterPieces(list: ContentPiece[], f: PieceFilter): ContentPiece[]`
  - `groupByTeam(list: ContentPiece[]): Record<ContentTeam, ContentPiece[]>`
  - `countByStatus(list: ContentPiece[], statuses: ContentStatus[]): Record<string, number>`
  - `teamCounts(list: ContentPiece[]): { todos: number; redes: number; web: number; revista: number }`

- [ ] **Step 1: Write the failing test**

```ts
// src/features/redaccion/data/contenidos.test.ts
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import {
  STATUSES, pieces, TEAMS,
  statusesFor, statusesForTeam, piecesFor,
  filterPieces, groupByTeam, countByStatus, teamCounts,
} from './contenidos';

describe('contenidos data', () => {
  it('Mixmag tiene 9 estados en orden, MAQUETACIÓN solo en revista', () => {
    const s = statusesFor('mixmag');
    expect(s.map((x) => x.label)).toEqual([
      'IDEA', 'BORRADOR', 'EN CURSO', 'CORRECCIONES', 'MAQUETACIÓN',
      'PENDIENTE DE APROBACIÓN', 'APROBADO', 'PROGRAMADO', 'PUBLICADO',
    ]);
    const maq = s.find((x) => x.label === 'MAQUETACIÓN')!;
    expect(maq.teamsOnly).toEqual(['revista']);
    expect(statusesForTeam('mixmag', 'redes').map((x) => x.label)).not.toContain('MAQUETACIÓN');
    expect(statusesForTeam('mixmag', 'revista').map((x) => x.label)).toContain('MAQUETACIÓN');
  });

  it('TAGMAG tiene los 6 estados del flujo robot', () => {
    expect(statusesFor('tagmag').map((x) => x.label)).toEqual([
      'PENDIENTE DE REVISIÓN', 'APROBADO (A ESCRIBIR)', 'BORRADOR',
      'CORRECCIONES', 'PROGRAMADO', 'PUBLICADO',
    ]);
    // TAGMAG no siembra piezas
    expect(piecesFor('tagmag')).toEqual([]);
  });

  it('Mixmag siembra 6 piezas con recuentos por equipo 2/2/2', () => {
    const p = piecesFor('mixmag');
    expect(p).toHaveLength(6);
    expect(teamCounts(p)).toEqual({ todos: 6, redes: 2, web: 2, revista: 2 });
    const soho = p.find((x) => x.title === 'Artículo Soho Farmhouse Ibiza')!;
    expect(soho.campaignId).toBeUndefined(); // orgánico
    expect(soho.ownerInitials).toBeTruthy();  // tiene avatar
  });

  it('countByStatus: IDEA 2, BORRADOR 3, EN CURSO 1', () => {
    const p = piecesFor('mixmag');
    const c = countByStatus(p, statusesFor('mixmag'));
    const byLabel = (label: string) => c[statusesFor('mixmag').find((s) => s.label === label)!.id];
    expect(byLabel('IDEA')).toBe(2);
    expect(byLabel('BORRADOR')).toBe(3);
    expect(byLabel('EN CURSO')).toBe(1);
  });

  it('filterPieces compone query/mine/scope/team/status', () => {
    const p = piecesFor('mixmag');
    expect(filterPieces(p, { query: 'soho' })).toHaveLength(1);
    expect(filterPieces(p, { scope: 'organico' })).toHaveLength(1);
    expect(filterPieces(p, { scope: 'campana' })).toHaveLength(5);
    expect(filterPieces(p, { team: 'revista' })).toHaveLength(2);
    const idea = statusesFor('mixmag').find((s) => s.label === 'IDEA')!.id;
    expect(filterPieces(p, { statusId: idea })).toHaveLength(2);
    // inmutable
    expect(filterPieces(p, {})).not.toBe(p);
  });

  it('groupByTeam agrupa en orden redes, web, revista', () => {
    const g = groupByTeam(piecesFor('mixmag'));
    expect(Object.keys(g)).toEqual(['redes', 'web', 'revista']);
    expect(g.redes).toHaveLength(2);
  });

  it('TEAMS y STATUSES poblados (uso bajo noUnusedLocals)', () => {
    expect(TEAMS.map((t) => t.id)).toEqual(['redes', 'web', 'revista']);
    expect(STATUSES.length).toBe(15); // 9 mixmag + 6 tagmag
    expect(pieces.length).toBe(6);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/redaccion/data/contenidos.test.ts`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```ts
// src/features/redaccion/data/contenidos.ts
export type ContentTeam = 'redes' | 'web' | 'revista';
export type MagazineId = 'mixmag' | 'tagmag';

export interface ContentStatus {
  id: string;
  magazine: MagazineId;
  label: string;
  order: number;
  teamsOnly?: ContentTeam[];
  tone: 'plain' | 'slate' | 'amber';
}

export interface ContentPiece {
  id: string;
  magazine: MagazineId;
  team: ContentTeam;
  statusId: string;
  title: string;
  type: string;
  campaignId?: string;
  campaignName?: string;
  dueLabel: string;
  ownerInitials?: string;
  ownerColor?: string;
  mine: boolean;
}

export const TEAMS: { id: ContentTeam; label: string; chip: string }[] = [
  { id: 'redes', label: 'Redes', chip: 'bg-violet-100 text-violet-700' },
  { id: 'web', label: 'Web', chip: 'bg-rose-100 text-rose-700' },
  { id: 'revista', label: 'Revista', chip: 'bg-emerald-100 text-emerald-700' },
];

const M = (id: string, label: string, order: number, tone: ContentStatus['tone'], teamsOnly?: ContentTeam[]): ContentStatus =>
  ({ id, magazine: 'mixmag', label, order, tone, teamsOnly });
const T = (id: string, label: string, order: number, tone: ContentStatus['tone']): ContentStatus =>
  ({ id, magazine: 'tagmag', label, order, tone });

export const STATUSES: ContentStatus[] = [
  M('mix-idea', 'IDEA', 1, 'plain'),
  M('mix-borrador', 'BORRADOR', 2, 'slate'),
  M('mix-encurso', 'EN CURSO', 3, 'amber'),
  M('mix-correcciones', 'CORRECCIONES', 4, 'slate'),
  M('mix-maquetacion', 'MAQUETACIÓN', 5, 'slate', ['revista']),
  M('mix-pend-aprob', 'PENDIENTE DE APROBACIÓN', 6, 'slate'),
  M('mix-aprobado', 'APROBADO', 7, 'slate'),
  M('mix-programado', 'PROGRAMADO', 8, 'slate'),
  M('mix-publicado', 'PUBLICADO', 9, 'slate'),
  T('tag-pend-rev', 'PENDIENTE DE REVISIÓN', 1, 'slate'),
  T('tag-aprob-escribir', 'APROBADO (A ESCRIBIR)', 2, 'slate'),
  T('tag-borrador', 'BORRADOR', 3, 'slate'),
  T('tag-correcciones', 'CORRECCIONES', 4, 'slate'),
  T('tag-programado', 'PROGRAMADO', 5, 'slate'),
  T('tag-publicado', 'PUBLICADO', 6, 'slate'),
];

const CAMP = { id: 'cmp-test-1', name: 'Campaña Test 1' };

export const pieces: ContentPiece[] = [
  { id: 'c1', magazine: 'mixmag', team: 'redes', statusId: 'mix-idea', title: 'Campaña Test 1 · Story', type: 'Stories', campaignId: CAMP.id, campaignName: CAMP.name, dueLabel: '29 jul 2026', mine: false },
  { id: 'c2', magazine: 'mixmag', team: 'redes', statusId: 'mix-borrador', title: 'Campaña Test 1 · Post en redes', type: 'Post (IG/FB)', campaignId: CAMP.id, campaignName: CAMP.name, dueLabel: '29 jul 2026', mine: false },
  { id: 'c3', magazine: 'mixmag', team: 'web', statusId: 'mix-idea', title: 'Campaña Test 1 · Artículo patrocinado', type: 'Artículo', campaignId: CAMP.id, campaignName: CAMP.name, dueLabel: '29 jul 2026', mine: false },
  { id: 'c4', magazine: 'mixmag', team: 'web', statusId: 'mix-encurso', title: 'Campaña Test 1 · Artículo patrocinado', type: 'Noticia', campaignId: CAMP.id, campaignName: CAMP.name, dueLabel: '29 jul 2026', mine: false },
  { id: 'c5', magazine: 'mixmag', team: 'revista', statusId: 'mix-borrador', title: 'Artículo Soho Farmhouse Ibiza', type: 'Artículo', dueLabel: 'hoy', ownerInitials: 'A', ownerColor: '#64748b', mine: true },
  { id: 'c6', magazine: 'mixmag', team: 'revista', statusId: 'mix-borrador', title: 'Campaña Test 1 · Publirreportaje', type: 'Artículo', campaignId: CAMP.id, campaignName: CAMP.name, dueLabel: '29 jul 2026', mine: false },
];

export function statusesFor(magazine: MagazineId): ContentStatus[] {
  return STATUSES.filter((s) => s.magazine === magazine).sort((a, b) => a.order - b.order);
}

export function statusesForTeam(magazine: MagazineId, team: ContentTeam): ContentStatus[] {
  return statusesFor(magazine).filter((s) => !s.teamsOnly || s.teamsOnly.includes(team));
}

export function piecesFor(magazine: MagazineId): ContentPiece[] {
  return pieces.filter((p) => p.magazine === magazine);
}

export interface PieceFilter {
  query?: string;
  mine?: boolean;
  scope?: 'todo' | 'campana' | 'organico';
  team?: ContentTeam;
  statusId?: string;
}

export function filterPieces(list: ContentPiece[], f: PieceFilter): ContentPiece[] {
  return list.filter((p) => {
    if (f.query && !p.title.toLowerCase().includes(f.query.toLowerCase())) return false;
    if (f.mine && !p.mine) return false;
    if (f.scope === 'campana' && !p.campaignId) return false;
    if (f.scope === 'organico' && p.campaignId) return false;
    if (f.team && p.team !== f.team) return false;
    if (f.statusId && p.statusId !== f.statusId) return false;
    return true;
  });
}

export function groupByTeam(list: ContentPiece[]): Record<ContentTeam, ContentPiece[]> {
  return {
    redes: list.filter((p) => p.team === 'redes'),
    web: list.filter((p) => p.team === 'web'),
    revista: list.filter((p) => p.team === 'revista'),
  };
}

export function countByStatus(list: ContentPiece[], statuses: ContentStatus[]): Record<string, number> {
  const out: Record<string, number> = {};
  statuses.forEach((s) => (out[s.id] = 0));
  list.forEach((p) => { if (p.statusId in out) out[p.statusId] += 1; });
  return out;
}

export function teamCounts(list: ContentPiece[]): { todos: number; redes: number; web: number; revista: number } {
  return {
    todos: list.length,
    redes: list.filter((p) => p.team === 'redes').length,
    web: list.filter((p) => p.team === 'web').length,
    revista: list.filter((p) => p.team === 'revista').length,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/redaccion/data/contenidos.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/redaccion/data/contenidos.ts src/features/redaccion/data/contenidos.test.ts
git commit -m "feat(mixmag): modelo Contenidos + seeds/helpers (Fase B)"
```

---

### Task 2: `StatusBox` (caja de estado clicable)

**Files:**
- Create: `src/features/redaccion/components/StatusBox.tsx`
- Test: `src/features/redaccion/components/StatusBox.test.tsx`

**Interfaces:**
- Produces: `StatusBox(props: { label: string; count: number; tone: 'plain'|'slate'|'amber'; selected?: boolean; onClick?: () => void }): JSX.Element`
- Consumes: nothing.

- [ ] **Step 1: Write the failing test**

```tsx
// src/features/redaccion/components/StatusBox.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StatusBox } from './StatusBox';

describe('StatusBox', () => {
  it('muestra label y contador; con count>0 resalta el número', () => {
    render(<StatusBox label="BORRADOR" count={3} tone="slate" />);
    expect(screen.getByText('BORRADOR')).toBeInTheDocument();
    const n = screen.getByText('3');
    expect(n).toHaveClass('text-slate-800');
  });

  it('con count 0 atenúa el número', () => {
    render(<StatusBox label="APROBADO" count={0} tone="slate" />);
    expect(screen.getByText('0')).toHaveClass('text-slate-300');
  });

  it('es un button con aria-pressed reflejando selected y dispara onClick', async () => {
    const onClick = vi.fn();
    render(<StatusBox label="IDEA" count={1} tone="plain" selected onClick={onClick} />);
    const btn = screen.getByRole('button', { name: /IDEA/ });
    expect(btn).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/redaccion/components/StatusBox.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/features/redaccion/components/StatusBox.tsx
const TONE_LABEL: Record<'plain' | 'slate' | 'amber', string> = {
  plain: 'text-slate-600',
  slate: 'text-slate-600',
  amber: 'text-amber-600',
};

export interface StatusBoxProps {
  label: string;
  count: number;
  tone: 'plain' | 'slate' | 'amber';
  selected?: boolean;
  onClick?: () => void;
}

export function StatusBox({ label, count, tone, selected, onClick }: StatusBoxProps) {
  const has = count > 0;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={!!selected}
      className={`min-w-[92px] rounded-lg border px-3 py-2 text-center transition ${
        selected ? 'border-slate-800' : 'border-slate-200'
      } ${has ? 'bg-white' : 'bg-slate-50'}`}
    >
      <div className={`text-[10px] font-semibold uppercase tracking-wide ${has ? TONE_LABEL[tone] : 'text-slate-300'}`}>
        {label}
      </div>
      <div className={`text-lg font-bold ${has ? 'text-slate-800' : 'text-slate-300'}`}>{count}</div>
    </button>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/redaccion/components/StatusBox.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/redaccion/components/StatusBox.tsx src/features/redaccion/components/StatusBox.test.tsx
git commit -m "feat(mixmag): StatusBox (caja de estado clicable)"
```

---

### Task 3: `ContentRow` (fila de pieza en Panel)

**Files:**
- Create: `src/features/redaccion/components/ContentRow.tsx`
- Test: `src/features/redaccion/components/ContentRow.test.tsx`

**Interfaces:**
- Consumes: `ContentPiece`, `ContentStatus` (de `../data/contenidos`).
- Produces: `ContentRow(props: { piece: ContentPiece; status?: ContentStatus }): JSX.Element`

- [ ] **Step 1: Write the failing test**

```tsx
// src/features/redaccion/components/ContentRow.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ContentRow } from './ContentRow';
import { piecesFor, statusesFor } from '../data/contenidos';

const p = piecesFor('mixmag');
const statuses = statusesFor('mixmag');
const byId = (id: string) => statuses.find((s) => s.id === id);

describe('ContentRow', () => {
  it('muestra estado, título, tipo, campaña y fecha', () => {
    const piece = p.find((x) => x.id === 'c1')!;
    render(<ContentRow piece={piece} status={byId(piece.statusId)} />);
    expect(screen.getByText('IDEA')).toBeInTheDocument();
    expect(screen.getByText('Campaña Test 1 · Story')).toBeInTheDocument();
    expect(screen.getByText('Stories')).toBeInTheDocument();
    expect(screen.getByText('Campaña Test 1')).toBeInTheDocument();
    expect(screen.getByText('29 jul 2026')).toBeInTheDocument();
  });

  it('muestra avatar cuando la pieza tiene owner (orgánica)', () => {
    const piece = p.find((x) => x.id === 'c5')!; // Soho, orgánico, con owner
    render(<ContentRow piece={piece} status={byId(piece.statusId)} />);
    expect(screen.getByText('hoy')).toBeInTheDocument();
    expect(screen.getByTestId('row-avatar')).toBeInTheDocument();
    // orgánica: no muestra nombre de campaña
    expect(screen.queryByText('Campaña Test 1')).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/redaccion/components/ContentRow.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/features/redaccion/components/ContentRow.tsx
import type { ContentPiece, ContentStatus } from '../data/contenidos';

const TONE_CHIP: Record<'plain' | 'slate' | 'amber', string> = {
  plain: 'bg-slate-100 text-slate-500',
  slate: 'bg-slate-100 text-slate-500',
  amber: 'bg-amber-100 text-amber-700',
};

export interface ContentRowProps {
  piece: ContentPiece;
  status?: ContentStatus;
}

export function ContentRow({ piece, status }: ContentRowProps) {
  const tone = status?.tone ?? 'slate';
  return (
    <div className="flex items-center gap-3 border-t border-slate-100 py-2 text-sm">
      <span className={`inline-flex w-32 shrink-0 justify-center rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${TONE_CHIP[tone]}`}>
        {status?.label ?? ''}
      </span>
      <span className="flex-1 truncate font-medium text-slate-800">{piece.title}</span>
      <span className="w-28 shrink-0 text-right text-xs text-slate-400">{piece.type}</span>
      <span className="w-32 shrink-0 text-right text-xs text-slate-400">{piece.campaignName ?? ''}</span>
      <span className="w-24 shrink-0 text-right text-xs text-slate-400">{piece.dueLabel}</span>
      {piece.ownerInitials ? (
        <span
          data-testid="row-avatar"
          className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[9px] font-semibold text-white"
          style={{ backgroundColor: piece.ownerColor ?? '#64748b' }}
        >
          {piece.ownerInitials}
        </span>
      ) : (
        <span className="w-5 shrink-0" aria-hidden="true" />
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/redaccion/components/ContentRow.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/redaccion/components/ContentRow.tsx src/features/redaccion/components/ContentRow.test.tsx
git commit -m "feat(mixmag): ContentRow (fila de pieza en Panel)"
```

---

### Task 4: `TeamGroup` (grupo de equipo en Panel)

**Files:**
- Create: `src/features/redaccion/components/TeamGroup.tsx`
- Test: `src/features/redaccion/components/TeamGroup.test.tsx`

**Interfaces:**
- Consumes: `StatusBox`, `ContentRow`, `ContentPiece`, `ContentStatus`, `ContentTeam`.
- Produces: `TeamGroup(props: { team: ContentTeam; teamLabel: string; teamChip: string; count: number; statuses: ContentStatus[]; counts: Record<string, number>; pieces: ContentPiece[]; selectedStatusId?: string; onStatusClick?: (id: string) => void }): JSX.Element`

- [ ] **Step 1: Write the failing test**

```tsx
// src/features/redaccion/components/TeamGroup.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TeamGroup } from './TeamGroup';
import { piecesFor, statusesForTeam, countByStatus, groupByTeam } from '../data/contenidos';

function renderGroup(team: 'redes' | 'web' | 'revista', pieces = piecesFor('mixmag')) {
  const grouped = groupByTeam(pieces)[team];
  const statuses = statusesForTeam('mixmag', team);
  return render(
    <TeamGroup
      team={team}
      teamLabel={team.toUpperCase()}
      teamChip="bg-violet-100 text-violet-700"
      count={grouped.length}
      statuses={statuses}
      counts={countByStatus(grouped, statuses)}
      pieces={grouped}
    />
  );
}

describe('TeamGroup', () => {
  it('REVISTA muestra la caja MAQUETACIÓN y sus 2 piezas', () => {
    renderGroup('revista');
    expect(screen.getByText('MAQUETACIÓN')).toBeInTheDocument();
    expect(screen.getByText('Artículo Soho Farmhouse Ibiza')).toBeInTheDocument();
    expect(screen.getByText('Campaña Test 1 · Publirreportaje')).toBeInTheDocument();
  });

  it('REDES no muestra MAQUETACIÓN', () => {
    renderGroup('redes');
    expect(screen.queryByText('MAQUETACIÓN')).toBeNull();
  });

  it('muestra empty-state cuando el equipo no tiene piezas', () => {
    render(
      <TeamGroup
        team="redes"
        teamLabel="REDES"
        teamChip="bg-violet-100 text-violet-700"
        count={0}
        statuses={statusesForTeam('tagmag', 'redes')}
        counts={{}}
        pieces={[]}
      />
    );
    expect(screen.getByText('Nada pendiente en este canal.')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/redaccion/components/TeamGroup.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/features/redaccion/components/TeamGroup.tsx
import type { ContentPiece, ContentStatus, ContentTeam } from '../data/contenidos';
import { StatusBox } from './StatusBox';
import { ContentRow } from './ContentRow';

export interface TeamGroupProps {
  team: ContentTeam;
  teamLabel: string;
  teamChip: string;
  count: number;
  statuses: ContentStatus[];
  counts: Record<string, number>;
  pieces: ContentPiece[];
  selectedStatusId?: string;
  onStatusClick?: (id: string) => void;
}

export function TeamGroup({ teamLabel, teamChip, count, statuses, counts, pieces, selectedStatusId, onStatusClick }: TeamGroupProps) {
  const statusById = Object.fromEntries(statuses.map((s) => [s.id, s]));
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${teamChip}`}>
            {teamLabel}
          </span>
          <span className="text-sm text-slate-400">{count}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {statuses.map((s) => (
            <StatusBox
              key={s.id}
              label={s.label}
              count={counts[s.id] ?? 0}
              tone={s.tone}
              selected={selectedStatusId === s.id}
              onClick={onStatusClick ? () => onStatusClick(s.id) : undefined}
            />
          ))}
        </div>
      </div>
      <div className="mt-3">
        {pieces.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400">Nada pendiente en este canal.</p>
        ) : (
          pieces.map((p) => <ContentRow key={p.id} piece={p} status={statusById[p.statusId]} />)
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/redaccion/components/TeamGroup.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/redaccion/components/TeamGroup.tsx src/features/redaccion/components/TeamGroup.test.tsx
git commit -m "feat(mixmag): TeamGroup (grupo de equipo en Panel + empty-state)"
```

---

### Task 5: `KanbanCard` (tarjeta en Kanban)

**Files:**
- Create: `src/features/redaccion/components/KanbanCard.tsx`
- Test: `src/features/redaccion/components/KanbanCard.test.tsx`

**Interfaces:**
- Consumes: `ContentPiece`, `TEAMS` (de `../data/contenidos`).
- Produces: `KanbanCard(props: { piece: ContentPiece }): JSX.Element`

- [ ] **Step 1: Write the failing test**

```tsx
// src/features/redaccion/components/KanbanCard.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KanbanCard } from './KanbanCard';
import { piecesFor } from '../data/contenidos';

const p = piecesFor('mixmag');

describe('KanbanCard', () => {
  it('muestra título, chip de equipo, chip de tipo y fecha', () => {
    render(<KanbanCard piece={p.find((x) => x.id === 'c1')!} />); // Redes / Stories
    expect(screen.getByText('Campaña Test 1 · Story')).toBeInTheDocument();
    expect(screen.getByText('Redes')).toBeInTheDocument();
    expect(screen.getByText('Stories')).toBeInTheDocument();
    expect(screen.getByText('29 jul 2026')).toBeInTheDocument();
  });

  it('muestra avatar solo cuando hay owner', () => {
    render(<KanbanCard piece={p.find((x) => x.id === 'c5')!} />); // con owner
    expect(screen.getByTestId('card-avatar')).toBeInTheDocument();
  });

  it('no muestra avatar sin owner', () => {
    render(<KanbanCard piece={p.find((x) => x.id === 'c1')!} />);
    expect(screen.queryByTestId('card-avatar')).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/redaccion/components/KanbanCard.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/features/redaccion/components/KanbanCard.tsx
import type { ContentPiece } from '../data/contenidos';
import { TEAMS } from '../data/contenidos';

export interface KanbanCardProps {
  piece: ContentPiece;
}

export function KanbanCard({ piece }: KanbanCardProps) {
  const team = TEAMS.find((t) => t.id === piece.team)!;
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <p className="text-sm font-medium text-slate-800">{piece.title}</p>
      <div className="mt-2 flex flex-wrap items-center gap-1">
        <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium ${team.chip}`}>
          {team.label}
        </span>
        <span className="inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
          {piece.type}
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-slate-400">{piece.dueLabel}</span>
        {piece.ownerInitials && (
          <span
            data-testid="card-avatar"
            className="grid h-5 w-5 place-items-center rounded-full text-[9px] font-semibold text-white"
            style={{ backgroundColor: piece.ownerColor ?? '#64748b' }}
          >
            {piece.ownerInitials}
          </span>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/redaccion/components/KanbanCard.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/redaccion/components/KanbanCard.tsx src/features/redaccion/components/KanbanCard.test.tsx
git commit -m "feat(mixmag): KanbanCard (tarjeta de contenido)"
```

---

### Task 6: `KanbanColumn` (columna normal / colapsada)

**Files:**
- Create: `src/features/redaccion/components/KanbanColumn.tsx`
- Test: `src/features/redaccion/components/KanbanColumn.test.tsx`

**Interfaces:**
- Consumes: `KanbanCard`, `ContentPiece`, `ContentStatus`.
- Produces: `KanbanColumn(props: { status: ContentStatus; pieces: ContentPiece[] }): JSX.Element` — colapsada (label vertical) cuando `pieces` está vacío.

- [ ] **Step 1: Write the failing test**

```tsx
// src/features/redaccion/components/KanbanColumn.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KanbanColumn } from './KanbanColumn';
import { piecesFor, statusesFor, filterPieces } from '../data/contenidos';

const idea = statusesFor('mixmag').find((s) => s.label === 'IDEA')!;
const aprobado = statusesFor('mixmag').find((s) => s.label === 'APROBADO')!;

describe('KanbanColumn', () => {
  it('columna con piezas muestra label, contador y tarjetas', () => {
    const cards = filterPieces(piecesFor('mixmag'), { statusId: idea.id });
    render(<KanbanColumn status={idea} pieces={cards} />);
    expect(screen.getByText('IDEA')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByTestId('kanban-column')).not.toHaveAttribute('data-collapsed', 'true');
    expect(screen.getAllByText(/Artículo patrocinado|Story/).length).toBeGreaterThan(0);
  });

  it('columna vacía se colapsa (data-collapsed)', () => {
    render(<KanbanColumn status={aprobado} pieces={[]} />);
    expect(screen.getByTestId('kanban-column')).toHaveAttribute('data-collapsed', 'true');
    expect(screen.getByText('APROBADO')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/redaccion/components/KanbanColumn.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/features/redaccion/components/KanbanColumn.tsx
import type { ContentPiece, ContentStatus } from '../data/contenidos';
import { KanbanCard } from './KanbanCard';

const TONE_HEADER: Record<'plain' | 'slate' | 'amber', string> = {
  plain: 'text-slate-600',
  slate: 'bg-slate-100 text-slate-500 rounded px-1.5 py-0.5',
  amber: 'bg-amber-100 text-amber-700 rounded px-1.5 py-0.5',
};

export interface KanbanColumnProps {
  status: ContentStatus;
  pieces: ContentPiece[];
}

export function KanbanColumn({ status, pieces }: KanbanColumnProps) {
  const collapsed = pieces.length === 0;
  if (collapsed) {
    return (
      <div data-testid="kanban-column" data-collapsed="true" className="flex w-10 shrink-0 justify-center rounded-lg bg-slate-50 py-4">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 [writing-mode:vertical-rl] rotate-180">
          {status.label}
        </span>
      </div>
    );
  }
  return (
    <div data-testid="kanban-column" data-collapsed="false" className="w-64 shrink-0">
      <div className="flex items-center justify-between px-1">
        <span className={`text-[11px] font-semibold uppercase tracking-wide ${TONE_HEADER[status.tone]}`}>{status.label}</span>
        <span className="text-xs text-slate-400">{pieces.length}</span>
      </div>
      <div className="mt-2 space-y-2 rounded-lg bg-slate-50 p-2">
        {pieces.map((p) => <KanbanCard key={p.id} piece={p} />)}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/redaccion/components/KanbanColumn.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/redaccion/components/KanbanColumn.tsx src/features/redaccion/components/KanbanColumn.test.tsx
git commit -m "feat(mixmag): KanbanColumn (normal + colapsada vertical)"
```

---

### Task 7: `TeamTabs` (tabs de equipo en Kanban)

**Files:**
- Create: `src/features/redaccion/components/TeamTabs.tsx`
- Test: `src/features/redaccion/components/TeamTabs.test.tsx`

**Interfaces:**
- Consumes: `ContentTeam` (de `../data/contenidos`).
- Produces: `TeamTabs(props: { counts: { todos: number; redes: number; web: number; revista: number }; active: ContentTeam | 'todos'; onSelect: (t: ContentTeam | 'todos') => void }): JSX.Element`

- [ ] **Step 1: Write the failing test**

```tsx
// src/features/redaccion/components/TeamTabs.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TeamTabs } from './TeamTabs';

describe('TeamTabs', () => {
  const counts = { todos: 6, redes: 2, web: 2, revista: 2 };

  it('muestra los 4 tabs con sus contadores y marca el activo', () => {
    render(<TeamTabs counts={counts} active="todos" onSelect={() => {}} />);
    expect(screen.getByRole('button', { name: /Todos/ })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /Redes/ })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByText('6')).toBeInTheDocument();
  });

  it('dispara onSelect con el equipo pulsado', async () => {
    const onSelect = vi.fn();
    render(<TeamTabs counts={counts} active="todos" onSelect={onSelect} />);
    await userEvent.click(screen.getByRole('button', { name: /Revista/ }));
    expect(onSelect).toHaveBeenCalledWith('revista');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/redaccion/components/TeamTabs.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/features/redaccion/components/TeamTabs.tsx
import type { ContentTeam } from '../data/contenidos';

export interface TeamTabsProps {
  counts: { todos: number; redes: number; web: number; revista: number };
  active: ContentTeam | 'todos';
  onSelect: (t: ContentTeam | 'todos') => void;
}

const TABS: { id: ContentTeam | 'todos'; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'redes', label: 'Redes' },
  { id: 'web', label: 'Web' },
  { id: 'revista', label: 'Revista' },
];

export function TeamTabs({ counts, active, onSelect }: TeamTabsProps) {
  return (
    <div className="flex gap-2">
      {TABS.map((t) => {
        const on = active === t.id;
        return (
          <button
            key={t.id}
            type="button"
            aria-pressed={on}
            onClick={() => onSelect(t.id)}
            className={`rounded-md px-3 py-1 text-sm ${on ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            {t.label} <span className="ml-1 text-xs opacity-60">{counts[t.id]}</span>
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/redaccion/components/TeamTabs.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/redaccion/components/TeamTabs.tsx src/features/redaccion/components/TeamTabs.test.tsx
git commit -m "feat(mixmag): TeamTabs (filtro de equipo en Kanban)"
```

---

### Task 8: `ContenidosToolbar` (barra superior)

**Files:**
- Create: `src/features/redaccion/components/ContenidosToolbar.tsx`
- Test: `src/features/redaccion/components/ContenidosToolbar.test.tsx`

**Interfaces:**
- Produces: `ContenidosToolbar(props: { spaceName: string; accent: string; query: string; onQuery: (v: string) => void; mine: boolean; onMine: (v: boolean) => void; scope: 'todo'|'campana'|'organico'; onScope: (v: 'todo'|'campana'|'organico') => void; view: 'panel'|'kanban'; onView: (v: 'panel'|'kanban') => void }): JSX.Element`

- [ ] **Step 1: Write the failing test**

```tsx
// src/features/redaccion/components/ContenidosToolbar.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContenidosToolbar } from './ContenidosToolbar';

function setup(overrides = {}) {
  const props = {
    spaceName: 'Mixmag Spain', accent: '#E11D48',
    query: '', onQuery: vi.fn(),
    mine: false, onMine: vi.fn(),
    scope: 'todo' as const, onScope: vi.fn(),
    view: 'panel' as const, onView: vi.fn(),
    ...overrides,
  };
  render(<ContenidosToolbar {...props} />);
  return props;
}

describe('ContenidosToolbar', () => {
  it('muestra espacio, búsqueda, segmentos y botón inerte + Contenido', () => {
    setup();
    expect(screen.getByText('Mixmag Spain')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Buscar por título o texto/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+ Contenido' })).toHaveAttribute('type', 'button');
  });

  it('escribir en la búsqueda emite onQuery', async () => {
    const { onQuery } = setup();
    await userEvent.type(screen.getByPlaceholderText(/Buscar por título o texto/), 'soho');
    expect(onQuery).toHaveBeenCalled();
  });

  it('pulsar Kanban emite onView', async () => {
    const { onView } = setup();
    await userEvent.click(screen.getByRole('button', { name: 'Kanban' }));
    expect(onView).toHaveBeenCalledWith('kanban');
  });

  it('pulsar De campaña emite onScope', async () => {
    const { onScope } = setup();
    await userEvent.click(screen.getByRole('button', { name: 'De campaña' }));
    expect(onScope).toHaveBeenCalledWith('campana');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/redaccion/components/ContenidosToolbar.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/features/redaccion/components/ContenidosToolbar.tsx
type Scope = 'todo' | 'campana' | 'organico';
type View = 'panel' | 'kanban';

export interface ContenidosToolbarProps {
  spaceName: string;
  accent: string;
  query: string;
  onQuery: (v: string) => void;
  mine: boolean;
  onMine: (v: boolean) => void;
  scope: Scope;
  onScope: (v: Scope) => void;
  view: View;
  onView: (v: View) => void;
}

const SCOPES: { id: Scope; label: string }[] = [
  { id: 'todo', label: 'Todo' },
  { id: 'campana', label: 'De campaña' },
  { id: 'organico', label: 'Orgánico' },
];

function Segment<T extends string>({ items, active, onSelect }: { items: { id: T; label: string }[]; active: T; onSelect: (v: T) => void }) {
  return (
    <div className="inline-flex rounded-lg bg-slate-100 p-0.5">
      {items.map((it) => (
        <button
          key={it.id}
          type="button"
          aria-pressed={active === it.id}
          onClick={() => onSelect(it.id)}
          className={`rounded-md px-3 py-1 text-sm ${active === it.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}

export function ContenidosToolbar({ spaceName, accent, query, onQuery, mine, onMine, scope, onScope, view, onView }: ContenidosToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: accent }} aria-hidden="true" />
        <span className="text-sm font-semibold text-slate-800">{spaceName}</span>
      </div>
      <input
        value={query}
        onChange={(e) => onQuery(e.target.value)}
        placeholder="Buscar por título o texto…"
        className="h-9 w-64 rounded-lg border border-slate-200 px-3 text-sm"
      />
      <button
        type="button"
        aria-pressed={mine}
        onClick={() => onMine(!mine)}
        className={`text-sm ${mine ? 'font-semibold text-slate-800' : 'text-slate-500'}`}
      >
        Solo lo mío
      </button>
      <Segment items={SCOPES} active={scope} onSelect={onScope} />
      <div className="ml-auto flex items-center gap-3">
        <Segment items={[{ id: 'panel', label: 'Panel' }, { id: 'kanban', label: 'Kanban' }]} active={view} onSelect={onView} />
        <button type="button" className="rounded-lg px-4 py-2 text-sm font-medium text-white" style={{ backgroundColor: '#44444C' }}>
          + Contenido
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/redaccion/components/ContenidosToolbar.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/redaccion/components/ContenidosToolbar.tsx src/features/redaccion/components/ContenidosToolbar.test.tsx
git commit -m "feat(mixmag): ContenidosToolbar (búsqueda + segmentos + vista + Contenido inerte)"
```

---

### Task 9: `ContenidosPage` + wiring del router

**Files:**
- Create: `src/features/redaccion/pages/ContenidosPage.tsx`
- Test: `src/features/redaccion/pages/ContenidosPage.test.tsx`
- Modify: `src/app/router.tsx` (reemplazar `EnConstruccionPage` por `ContenidosPage` en las rutas `contenidos` de ambos gemelos)

**Interfaces:**
- Consumes: `useOutletContext<Magazine>`, todos los componentes anteriores, helpers de `contenidos.ts`, `TEAMS`.
- Produces: `ContenidosPage(): JSX.Element` (default+named export según convención del repo — usar `export function ContenidosPage`).

- [ ] **Step 1: Write the failing test**

```tsx
// src/features/redaccion/pages/ContenidosPage.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route, Outlet } from 'react-router';
import { ContenidosPage } from './ContenidosPage';
import { MIXMAG, TAGMAG } from '../data/seed';
import type { Magazine } from '../data/types';

function renderPage(magazine: Magazine) {
  return render(
    <MemoryRouter>
      <Routes>
        <Route element={<Outlet context={magazine} />}>
          <Route index element={<ContenidosPage />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe('ContenidosPage', () => {
  it('Mixmag Panel: 3 grupos con piezas y MAQUETACIÓN solo en revista', () => {
    renderPage(MIXMAG);
    expect(screen.getByText('REDES')).toBeInTheDocument();
    expect(screen.getByText('WEB')).toBeInTheDocument();
    expect(screen.getByText('REVISTA')).toBeInTheDocument();
    expect(screen.getByText('Artículo Soho Farmhouse Ibiza')).toBeInTheDocument();
    // MAQUETACIÓN aparece una vez (solo revista)
    expect(screen.getAllByText('MAQUETACIÓN')).toHaveLength(1);
  });

  it('cambia a Kanban y muestra tabs de equipo + columnas', async () => {
    renderPage(MIXMAG);
    await userEvent.click(screen.getByRole('button', { name: 'Kanban' }));
    expect(screen.getByRole('button', { name: /Todos/ })).toBeInTheDocument();
    // columna IDEA con contador 2
    expect(screen.getByText('IDEA')).toBeInTheDocument();
  });

  it('la búsqueda filtra las piezas visibles', async () => {
    renderPage(MIXMAG);
    await userEvent.type(screen.getByPlaceholderText(/Buscar por título o texto/), 'soho');
    expect(screen.getByText('Artículo Soho Farmhouse Ibiza')).toBeInTheDocument();
    expect(screen.queryByText('Campaña Test 1 · Story')).toBeNull();
  });

  it('TAGMAG muestra empty-states en Panel (flujo robot, sin piezas)', () => {
    renderPage(TAGMAG);
    expect(screen.getAllByText('Nada pendiente en este canal.')).toHaveLength(3);
    // el estado aparece como StatusBox en cada uno de los 3 equipos
    expect(screen.getAllByText('PENDIENTE DE REVISIÓN')).toHaveLength(3);
  });

  it('no usa clases brand-* (delta gris del live)', () => {
    const { container } = renderPage(MIXMAG);
    expect(container.querySelector('[class*="brand-"]')).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/redaccion/pages/ContenidosPage.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/features/redaccion/pages/ContenidosPage.tsx
import { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router';
import type { Magazine } from '../data/types';
import {
  TEAMS, statusesFor, statusesForTeam, piecesFor, filterPieces,
  countByStatus, teamCounts,
  type ContentTeam,
} from '../data/contenidos';
import { ContenidosToolbar } from '../components/ContenidosToolbar';
import { TeamGroup } from '../components/TeamGroup';
import { TeamTabs } from '../components/TeamTabs';
import { KanbanColumn } from '../components/KanbanColumn';

export function ContenidosPage() {
  const magazine = useOutletContext<Magazine>();
  const [view, setView] = useState<'panel' | 'kanban'>('panel');
  const [query, setQuery] = useState('');
  const [mine, setMine] = useState(false);
  const [scope, setScope] = useState<'todo' | 'campana' | 'organico'>('todo');
  const [teamTab, setTeamTab] = useState<ContentTeam | 'todos'>('todos');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  const all = useMemo(() => piecesFor(magazine.id), [magazine.id]);
  const base = useMemo(
    () => filterPieces(all, { query, mine, scope }),
    [all, query, mine, scope]
  );

  const toggleStatus = (id: string) => setStatusFilter((cur) => (cur === id ? undefined : id));

  return (
    <div className="space-y-4">
      <ContenidosToolbar
        spaceName={magazine.spaceName}
        accent={magazine.accent}
        query={query}
        onQuery={setQuery}
        mine={mine}
        onMine={setMine}
        scope={scope}
        onScope={setScope}
        view={view}
        onView={setView}
      />

      {view === 'panel' ? (
        <div className="space-y-4">
          {TEAMS.map((t) => {
            const statuses = statusesForTeam(magazine.id, t.id);
            const teamPieces = filterPieces(base, { team: t.id, statusId: statusFilter });
            const teamAll = filterPieces(base, { team: t.id });
            return (
              <TeamGroup
                key={t.id}
                team={t.id}
                teamLabel={t.label.toUpperCase()}
                teamChip={t.chip}
                count={teamAll.length}
                statuses={statuses}
                counts={countByStatus(teamAll, statuses)}
                pieces={teamPieces}
                selectedStatusId={statusFilter}
                onStatusClick={toggleStatus}
              />
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          <TeamTabs counts={teamCounts(base)} active={teamTab} onSelect={setTeamTab} />
          <div className="flex gap-3 overflow-x-auto pb-4">
            {statusesFor(magazine.id).map((s) => {
              const cards = filterPieces(base, {
                statusId: s.id,
                team: teamTab === 'todos' ? undefined : teamTab,
              });
              return <KanbanColumn key={s.id} status={s} pieces={cards} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/redaccion/pages/ContenidosPage.test.tsx`
Expected: PASS.

- [ ] **Step 5: Wire the router**

En `src/app/router.tsx`: añadir import `import { ContenidosPage } from '@/features/redaccion/pages/ContenidosPage';` y reemplazar, en las rutas de `/mixmag` y `/tagmag`, `<Route path="contenidos" element={<EnConstruccionPage />} />` por `<Route path="contenidos" element={<ContenidosPage />} />` (dejar `campanas` en `EnConstruccionPage`).

- [ ] **Step 6: Run full gate**

Run: `npx vitest run && npx tsc --noEmit && npx eslint . --max-warnings 0`
Expected: todo verde.

- [ ] **Step 7: Commit**

```bash
git add src/features/redaccion/pages/ContenidosPage.tsx src/features/redaccion/pages/ContenidosPage.test.tsx src/app/router.tsx
git commit -m "feat(mixmag): ContenidosPage (Panel+Kanban) + rutas contenidos ambos gemelos"
```

---

## Verificación final (fuera de tareas, en review de rama)

- Playwright ours↔live en `/mixmag/contenidos` y `/tagmag/contenidos`, vistas Panel y Kanban; ajustar tokens (tints de equipo, tono de estados, colapsado vertical) contra `docs/references/mixmag/live-*-contenidos-*.png`. 0 errores de consola.
- Confirmar recuentos (REDES/WEB/REVISTA 2/2/2; IDEA 2 / BORRADOR 3 / EN CURSO 1) y empty-states TAGMAG.
