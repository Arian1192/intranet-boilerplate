# Mixmag/TAGMAG Fase A — shell parametrizado + Resumen + Revistas · Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir el módulo "Redacción" parametrizado (compartido por Mixmag y TAGMAG) con sus pestañas Resumen y Revistas pixel-perfect; Contenidos/Campañas quedan como placeholder "en construcción" (Fases B/C).

**Architecture:** Feature `src/features/redaccion/`. Un `RedaccionShell({ magazine })` pasa el config vía `<Outlet context={magazine}>`; las páginas lo leen con `useOutletContext<Magazine>()`. `MixmagShell`/`TagmagShell` son envoltorios finos con su config. Las mismas páginas sirven ambas rutas.

**Tech Stack:** React 19, react-router 7, TypeScript, Tailwind, Vitest + RTL, lucide-react.

## Global Constraints

- **Colorimetría 100% fiel al live**: NO clases `brand-*`. Botón primario del módulo `bg-[#44444C] hover:bg-[#3a3a41]` (gris exacto del live, NO slate-800). Accent por revista (Mixmag `#E11D48`, TAGMAG `#0EA5E9`) en el punto/chips.
- **Tokens exactos** del spec `docs/superpowers/specs/2026-07-21-mixmag-tagmag-fase-a-design.md` §3. No aproximar.
- **Parametrización**: las MISMAS páginas sirven Mixmag y TAGMAG; el dato viene del `Magazine` config vía Outlet context. Nada hardcodeado a un solo módulo.
- **Presentacional (mock)**: "+ Edición", clics en cards, etc. inertes. Portadas de revista = placeholder (no fotos reales).
- **Gate por tarea**: `npx vitest run <ficheros>` verde, `npm run lint` = 0, `npx tsc --noEmit` limpio antes de commit.

---

### Task 1: Modelo de datos + seeds (Mixmag/TAGMAG)

**Files:**
- Create: `src/features/redaccion/data/types.ts`
- Create: `src/features/redaccion/data/seed.ts`
- Test: `src/features/redaccion/data/seed.test.ts`

**Interfaces:**
- Produces: `Magazine`, `MagazineEdition` (types); `MIXMAG: Magazine`, `TAGMAG: Magazine`.

- [ ] **Step 1: Escribir el test que falla**

`src/features/redaccion/data/seed.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { MIXMAG, TAGMAG } from './seed';

describe('seeds de redacción', () => {
  it('MIXMAG espeja el live', () => {
    expect(MIXMAG.name).toBe('Mixmag');
    expect(MIXMAG.spaceName).toBe('Mixmag Spain');
    expect(MIXMAG.accent).toBe('#E11D48');
    expect(MIXMAG.basePath).toBe('/mixmag');
    expect(MIXMAG.resumen.enCurso).toBe(4);
    expect(MIXMAG.resumen.revistaAbierta).toBe('Patrick Topping (Agosto 2026)');
    expect(MIXMAG.editions).toHaveLength(1);
    expect(MIXMAG.editions[0]).toMatchObject({
      number: 29, title: 'Patrick Topping', monthLabel: 'Agosto 2026',
      status: 'En preparación', readyCount: 0, totalCount: 1, percent: 0,
    });
  });

  it('TAGMAG es gemela con datos propios', () => {
    expect(TAGMAG.name).toBe('TAGMAG');
    expect(TAGMAG.spaceName).toBe('TAGMAG');
    expect(TAGMAG.accent).toBe('#0EA5E9');
    expect(TAGMAG.basePath).toBe('/tagmag');
    expect(TAGMAG.resumen.enCurso).toBe(0);
    expect(TAGMAG.resumen.revistaAbierta).toBeUndefined();
    expect(TAGMAG.editions).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Ejecutar para verificar que falla**

Run: `npx vitest run src/features/redaccion/data/seed.test.ts`
Expected: FAIL ("Cannot find module './seed'").

- [ ] **Step 3: Crear `types.ts`**

```ts
export interface MagazineEdition {
  id: string;
  number: number;
  title: string;
  monthLabel: string;
  status: string;
  readyCount: number;
  totalCount: number;
  percent: number;
}

export interface Magazine {
  id: 'mixmag' | 'tagmag';
  name: string;
  spaceName: string;
  region: string;
  hasMagazine: boolean;
  accent: string;
  basePath: string;
  resumen: {
    llevasTu: number;
    atrasados: number;
    pendientes: number;
    enCurso: number;
    revistaAbierta?: string;
  };
  editions: MagazineEdition[];
}
```

- [ ] **Step 4: Crear `seed.ts`**

```ts
import type { Magazine } from './types';

export const MIXMAG: Magazine = {
  id: 'mixmag',
  name: 'Mixmag',
  spaceName: 'Mixmag Spain',
  region: 'España',
  hasMagazine: true,
  accent: '#E11D48',
  basePath: '/mixmag',
  resumen: { llevasTu: 0, atrasados: 0, pendientes: 0, enCurso: 4, revistaAbierta: 'Patrick Topping (Agosto 2026)' },
  editions: [
    { id: 'mix-29', number: 29, title: 'Patrick Topping', monthLabel: 'Agosto 2026', status: 'En preparación', readyCount: 0, totalCount: 1, percent: 0 },
  ],
};

export const TAGMAG: Magazine = {
  id: 'tagmag',
  name: 'TAGMAG',
  spaceName: 'TAGMAG',
  region: 'España',
  hasMagazine: true,
  accent: '#0EA5E9',
  basePath: '/tagmag',
  resumen: { llevasTu: 0, atrasados: 0, pendientes: 0, enCurso: 0, revistaAbierta: undefined },
  editions: [],
};
```

- [ ] **Step 5: Ejecutar tests + tsc**

Run: `npx vitest run src/features/redaccion/data/seed.test.ts && npx tsc --noEmit`
Expected: PASS + tsc limpio.

- [ ] **Step 6: Commit**

```bash
git add src/features/redaccion/data/types.ts src/features/redaccion/data/seed.ts src/features/redaccion/data/seed.test.ts
git commit -m "feat(mixmag): modelo Magazine + seeds Mixmag/TAGMAG (Fase A)"
```

---

### Task 2: Componentes hoja (PublicationCard, EditionCard, EnConstruccionPage)

**Files:**
- Create: `src/features/redaccion/components/PublicationCard.tsx`
- Create: `src/features/redaccion/components/EditionCard.tsx`
- Create: `src/features/redaccion/pages/EnConstruccionPage.tsx`
- Test: `src/features/redaccion/components/PublicationCard.test.tsx`, `EditionCard.test.tsx`

**Interfaces:**
- Consumes: `Magazine`, `MagazineEdition`, `Badge`, `ProgressBar`.
- Produces: `<PublicationCard magazine={Magazine} />`, `<EditionCard edition={MagazineEdition} />`, `<EnConstruccionPage />`.

- [ ] **Step 1: Escribir los tests que fallan**

`src/features/redaccion/components/PublicationCard.test.tsx`:
```tsx
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PublicationCard } from './PublicationCard';
import { MIXMAG, TAGMAG } from '../data/seed';

describe('PublicationCard', () => {
  it('muestra spaceName, en curso y revista abierta (Mixmag)', () => {
    render(<PublicationCard magazine={MIXMAG} />);
    expect(screen.getByText('Mixmag Spain')).toBeInTheDocument();
    expect(screen.getByText('España · con revista')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('Revista abierta: Patrick Topping (Agosto 2026)')).toBeInTheDocument();
  });

  it('sin revista abierta (TAGMAG) no muestra esa línea', () => {
    render(<PublicationCard magazine={TAGMAG} />);
    expect(screen.getByText('TAGMAG')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.queryByText(/Revista abierta:/)).toBeNull();
  });
});
```
`src/features/redaccion/components/EditionCard.test.tsx`:
```tsx
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EditionCard } from './EditionCard';
import { MIXMAG } from '../data/seed';

describe('EditionCard', () => {
  it('muestra número, título, mes, estado y progreso', () => {
    render(<EditionCard edition={MIXMAG.editions[0]} />);
    expect(screen.getByText('#29')).toBeInTheDocument();
    expect(screen.getByText('Patrick Topping')).toBeInTheDocument();
    expect(screen.getByText('Agosto 2026')).toBeInTheDocument();
    expect(screen.getByText('En preparación')).toBeInTheDocument();
    expect(screen.getByText('0 de 1 listos')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Ejecutar para verificar que fallan**

Run: `npx vitest run src/features/redaccion/components/PublicationCard.test.tsx src/features/redaccion/components/EditionCard.test.tsx`
Expected: FAIL (módulos no existen).

- [ ] **Step 3: Crear `PublicationCard.tsx`**

```tsx
import type { Magazine } from '../data/types';

export interface PublicationCardProps {
  magazine: Magazine;
}

export function PublicationCard({ magazine }: PublicationCardProps) {
  const { spaceName, region, accent, resumen } = magazine;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: accent }} aria-hidden="true" />
        <span className="text-base font-semibold text-slate-800">{spaceName}</span>
      </div>
      <p className="mt-1 text-sm text-slate-500">{region} · con revista</p>
      <p className="mt-3">
        <span className="text-xl font-semibold text-slate-800">{resumen.enCurso}</span>
        <span className="ml-1 text-sm text-slate-500">en curso</span>
      </p>
      {resumen.revistaAbierta && (
        <p className="mt-2 text-sm text-slate-500">Revista abierta: {resumen.revistaAbierta}</p>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Crear `EditionCard.tsx`**

```tsx
import { ImageIcon } from 'lucide-react';
import { Badge, ProgressBar } from '@/components/ui';
import type { MagazineEdition } from '../data/types';

export interface EditionCardProps {
  edition: MagazineEdition;
}

export function EditionCard({ edition }: EditionCardProps) {
  return (
    <button
      type="button"
      className="overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="grid aspect-[3/4] place-items-center bg-slate-100">
        <ImageIcon className="h-8 w-8 text-slate-300" aria-hidden="true" />
      </div>
      <div className="p-3">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="min-w-0 truncate font-semibold text-slate-800">
            <span className="text-slate-400">#{edition.number} </span>
            {edition.title}
          </h3>
          <span className="shrink-0 text-xs text-slate-400">{edition.monthLabel}</span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Badge variant="neutral">{edition.status}</Badge>
          <span className="text-xs text-slate-400">
            {edition.readyCount} de {edition.totalCount} listos
          </span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <ProgressBar value={edition.readyCount} max={edition.totalCount} fillClassName="bg-slate-800" className="flex-1" />
          <span className="shrink-0 text-xs text-slate-400">{edition.percent}%</span>
        </div>
      </div>
    </button>
  );
}
```

- [ ] **Step 5: Crear `EnConstruccionPage.tsx`**

```tsx
export function EnConstruccionPage() {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 p-12 text-center">
      <p className="text-sm font-medium text-slate-600">En construcción</p>
      <p className="mt-1 text-xs text-slate-400">Esta sección llega en una próxima fase.</p>
    </div>
  );
}
```

- [ ] **Step 6: Ejecutar tests + gate**

Run: `npx vitest run src/features/redaccion/components/PublicationCard.test.tsx src/features/redaccion/components/EditionCard.test.tsx && npm run lint && npx tsc --noEmit`
Expected: PASS + lint 0 + tsc limpio.

- [ ] **Step 7: Commit**

```bash
git add src/features/redaccion/components/PublicationCard.tsx src/features/redaccion/components/EditionCard.tsx src/features/redaccion/pages/EnConstruccionPage.tsx src/features/redaccion/components/PublicationCard.test.tsx src/features/redaccion/components/EditionCard.test.tsx
git commit -m "feat(mixmag): PublicationCard + EditionCard + placeholder En construcción"
```

---

### Task 3: ResumenPage

**Files:**
- Create: `src/features/redaccion/pages/ResumenPage.tsx`
- Test: `src/features/redaccion/pages/ResumenPage.test.tsx`

**Interfaces:**
- Consumes: `useOutletContext<Magazine>()`, `StatCard`, `PublicationCard`.
- Produces: `<ResumenPage />` (lee el magazine del Outlet context).

- [ ] **Step 1: Escribir el test que falla**

`src/features/redaccion/pages/ResumenPage.test.tsx`:
```tsx
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route, Outlet } from 'react-router';
import { ResumenPage } from './ResumenPage';
import { MIXMAG, TAGMAG } from '../data/seed';
import type { Magazine } from '../data/types';

function renderWithMagazine(magazine: Magazine) {
  return render(
    <MemoryRouter>
      <Routes>
        <Route element={<Outlet context={magazine} />}>
          <Route index element={<ResumenPage />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe('ResumenPage', () => {
  it('muestra las 3 stat cards y la publicación (Mixmag)', () => {
    renderWithMagazine(MIXMAG);
    expect(screen.getByText('LO QUE LLEVAS TÚ')).toBeInTheDocument();
    expect(screen.getByText('ATRASADOS')).toBeInTheDocument();
    expect(screen.getByText('PENDIENTES DE APROBAR')).toBeInTheDocument();
    expect(screen.getByText('Publicaciones')).toBeInTheDocument();
    expect(screen.getByText('Mixmag Spain')).toBeInTheDocument();
    expect(screen.getByText('Revista abierta: Patrick Topping (Agosto 2026)')).toBeInTheDocument();
  });

  it('usa los datos de TAGMAG cuando ese es el context', () => {
    renderWithMagazine(TAGMAG);
    expect(screen.getByText('TAGMAG')).toBeInTheDocument();
    expect(screen.queryByText(/Revista abierta:/)).toBeNull();
  });
});
```

- [ ] **Step 2: Ejecutar para verificar que falla**

Run: `npx vitest run src/features/redaccion/pages/ResumenPage.test.tsx`
Expected: FAIL ("Cannot find module './ResumenPage'").

- [ ] **Step 3: Crear `ResumenPage.tsx`**

```tsx
import { useOutletContext } from 'react-router';
import { StatCard } from '@/components/ui';
import { PublicationCard } from '../components/PublicationCard';
import type { Magazine } from '../data/types';

export function ResumenPage() {
  const magazine = useOutletContext<Magazine>();
  const { resumen } = magazine;
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="LO QUE LLEVAS TÚ" value={String(resumen.llevasTu)} />
        <StatCard label="ATRASADOS" value={String(resumen.atrasados)} />
        <StatCard label="PENDIENTES DE APROBAR" value={String(resumen.pendientes)} />
      </div>
      <h2 className="mb-3 mt-6 text-sm font-semibold text-slate-800">Publicaciones</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <PublicationCard magazine={magazine} />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Ejecutar tests + gate**

Run: `npx vitest run src/features/redaccion/pages/ResumenPage.test.tsx && npm run lint && npx tsc --noEmit`
Expected: PASS + lint 0 + tsc limpio.

- [ ] **Step 5: Commit**

```bash
git add src/features/redaccion/pages/ResumenPage.tsx src/features/redaccion/pages/ResumenPage.test.tsx
git commit -m "feat(mixmag): ResumenPage (3 stat cards + Publicaciones) parametrizada"
```

---

### Task 4: RevistasPage

**Files:**
- Create: `src/features/redaccion/pages/RevistasPage.tsx`
- Test: `src/features/redaccion/pages/RevistasPage.test.tsx`

**Interfaces:**
- Consumes: `useOutletContext<Magazine>()`, `EditionCard`.
- Produces: `<RevistasPage />`.

- [ ] **Step 1: Escribir el test que falla**

`src/features/redaccion/pages/RevistasPage.test.tsx`:
```tsx
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route, Outlet } from 'react-router';
import { RevistasPage } from './RevistasPage';
import { MIXMAG, TAGMAG } from '../data/seed';
import type { Magazine } from '../data/types';

function renderWithMagazine(magazine: Magazine) {
  return render(
    <MemoryRouter>
      <Routes>
        <Route element={<Outlet context={magazine} />}>
          <Route index element={<RevistasPage />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe('RevistasPage', () => {
  it('muestra el header, el botón y la edición (Mixmag)', () => {
    renderWithMagazine(MIXMAG);
    expect(screen.getByText('Mixmag Spain')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Edición/ })).toBeInTheDocument();
    expect(screen.getByText('Patrick Topping')).toBeInTheDocument();
    expect(screen.queryByText('Ninguna edición todavía.')).toBeNull();
  });

  it('muestra el empty-state cuando no hay ediciones (TAGMAG)', () => {
    renderWithMagazine(TAGMAG);
    expect(screen.getByText('Ninguna edición todavía.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Edición/ })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Ejecutar para verificar que falla**

Run: `npx vitest run src/features/redaccion/pages/RevistasPage.test.tsx`
Expected: FAIL ("Cannot find module './RevistasPage'").

- [ ] **Step 3: Crear `RevistasPage.tsx`**

```tsx
import { useOutletContext } from 'react-router';
import { Plus } from 'lucide-react';
import { EditionCard } from '../components/EditionCard';
import type { Magazine } from '../data/types';

export function RevistasPage() {
  const magazine = useOutletContext<Magazine>();
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: magazine.accent }} aria-hidden="true" />
          <span className="text-base font-semibold text-slate-800">{magazine.spaceName}</span>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-lg bg-[#44444C] px-4 py-2 text-sm font-medium text-white hover:bg-[#3a3a41]"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Edición
        </button>
      </div>

      {magazine.editions.length > 0 ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {magazine.editions.map((edition) => (
            <EditionCard key={edition.id} edition={edition} />
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-400">
          Ninguna edición todavía.
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Ejecutar tests + gate**

Run: `npx vitest run src/features/redaccion/pages/RevistasPage.test.tsx && npm run lint && npx tsc --noEmit`
Expected: PASS + lint 0 + tsc limpio.

- [ ] **Step 5: Commit**

```bash
git add src/features/redaccion/pages/RevistasPage.tsx src/features/redaccion/pages/RevistasPage.test.tsx
git commit -m "feat(mixmag): RevistasPage (ediciones + empty-state) parametrizada"
```

---

### Task 5: RedaccionShell + shells finos + router anidado

**Files:**
- Create: `src/features/redaccion/RedaccionShell.tsx`
- Modify: `src/features/modules/MixmagShell.tsx`, `src/features/modules/TagmagShell.tsx`
- Modify: `src/app/router.tsx`
- Test: `src/features/redaccion/RedaccionShell.test.tsx`

**Interfaces:**
- Consumes: `AppLayout`, `Outlet`, `Magazine`, `MIXMAG`/`TAGMAG`, `ResumenPage`/`RevistasPage`/`EnConstruccionPage`.
- Produces: `<RedaccionShell magazine={Magazine} />`; rutas `/mixmag` y `/tagmag` anidadas.

- [ ] **Step 1: Escribir el test que falla**

`src/features/redaccion/RedaccionShell.test.tsx`:
```tsx
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { RedaccionShell } from './RedaccionShell';
import { ResumenPage } from './pages/ResumenPage';
import { RevistasPage } from './pages/RevistasPage';
import { MIXMAG } from './data/seed';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/mixmag" element={<RedaccionShell magazine={MIXMAG} />}>
          <Route index element={<ResumenPage />} />
          <Route path="revistas" element={<RevistasPage />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe('RedaccionShell', () => {
  it('renderiza las 4 pestañas y el Resumen en el index', () => {
    renderAt('/mixmag');
    for (const tab of ['Resumen', 'Contenidos', 'Campañas', 'Revistas']) {
      expect(screen.getByRole('link', { name: tab })).toBeInTheDocument();
    }
    expect(screen.getByText('Publicaciones')).toBeInTheDocument();
  });

  it('la pestaña Revistas apunta a basePath/revistas y renderiza esa página', () => {
    renderAt('/mixmag/revistas');
    expect(screen.getByRole('link', { name: 'Revistas' })).toHaveAttribute('href', '/mixmag/revistas');
    expect(screen.queryByText('Ninguna edición todavía.')).toBeNull();
    expect(screen.getByText('Patrick Topping')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Ejecutar para verificar que falla**

Run: `npx vitest run src/features/redaccion/RedaccionShell.test.tsx`
Expected: FAIL ("Cannot find module './RedaccionShell'").

- [ ] **Step 3: Crear `RedaccionShell.tsx`**

```tsx
import { Outlet } from 'react-router';
import { AppLayout } from '@/components/layout';
import type { Magazine } from './data/types';
import type { User } from '@/types';

const mockUser: User = { id: '1', email: 'test@example.com', name: 'Test User', role: 'Admin' };

export function RedaccionShell({ magazine }: { magazine: Magazine }) {
  const tabs = [
    { label: 'Resumen', href: magazine.basePath },
    { label: 'Contenidos', href: `${magazine.basePath}/contenidos` },
    { label: 'Campañas', href: `${magazine.basePath}/campanas` },
    { label: 'Revistas', href: `${magazine.basePath}/revistas` },
  ];
  return (
    <AppLayout user={mockUser} module={{ name: magazine.name, href: magazine.basePath, tabs }}>
      <Outlet context={magazine} />
    </AppLayout>
  );
}
```

- [ ] **Step 4: Reescribir los shells finos**

`src/features/modules/MixmagShell.tsx`:
```tsx
import { RedaccionShell } from '@/features/redaccion/RedaccionShell';
import { MIXMAG } from '@/features/redaccion/data/seed';

export function MixmagShell() {
  return <RedaccionShell magazine={MIXMAG} />;
}
```
`src/features/modules/TagmagShell.tsx`:
```tsx
import { RedaccionShell } from '@/features/redaccion/RedaccionShell';
import { TAGMAG } from '@/features/redaccion/data/seed';

export function TagmagShell() {
  return <RedaccionShell magazine={TAGMAG} />;
}
```

- [ ] **Step 5: Anidar las rutas en `router.tsx`**

Añadir imports (junto a los de páginas):
```tsx
import { ResumenPage as RedaccionResumenPage } from '@/features/redaccion/pages/ResumenPage';
import { RevistasPage as RedaccionRevistasPage } from '@/features/redaccion/pages/RevistasPage';
import { EnConstruccionPage } from '@/features/redaccion/pages/EnConstruccionPage';
```
Reemplazar las dos líneas planas `<Route path="/mixmag" element={<MixmagShell />} />` y `<Route path="/tagmag" element={<TagmagShell />} />` por:
```tsx
      <Route path="/mixmag" element={<MixmagShell />}>
        <Route index element={<RedaccionResumenPage />} />
        <Route path="contenidos" element={<EnConstruccionPage />} />
        <Route path="campanas" element={<EnConstruccionPage />} />
        <Route path="revistas" element={<RedaccionRevistasPage />} />
      </Route>
      <Route path="/tagmag" element={<TagmagShell />}>
        <Route index element={<RedaccionResumenPage />} />
        <Route path="contenidos" element={<EnConstruccionPage />} />
        <Route path="campanas" element={<EnConstruccionPage />} />
        <Route path="revistas" element={<RedaccionRevistasPage />} />
      </Route>
```
(Los alias en el import evitan colisión con `ResumenPage`/`RevistasPage` de otras features ya importadas en `router.tsx`. Verifica los nombres realmente importados y ajusta los alias si no colisionan.)

- [ ] **Step 6: Ejecutar tests + gate completo**

Run: `npx vitest run src/features/redaccion/RedaccionShell.test.tsx && npm test -- --run && npm run lint && npx tsc --noEmit`
Expected: PASS + suite completa verde + lint 0 + tsc limpio. Si algún test previo de `MixmagShell`/`TagmagShell` (creado en Home v2, esperaba `ModuleShell` "en desarrollo") se rompe, actualízalo al nuevo shell.

- [ ] **Step 7: Commit**

```bash
git add src/features/redaccion/RedaccionShell.tsx src/features/modules/MixmagShell.tsx src/features/modules/TagmagShell.tsx src/app/router.tsx src/features/redaccion/RedaccionShell.test.tsx
git commit -m "feat(mixmag): RedaccionShell + rutas anidadas Mixmag/TAGMAG (Resumen/Revistas reales)"
```

---

### Task 6: Verificación final (suite + Playwright ours↔live)

- [ ] **Step 1: Suite completa + lint + tsc**

Run: `npm test -- --run && npm run lint && npx tsc --noEmit`
Expected: todos verdes, lint 0, tsc limpio. Si algo falla, arreglar y commit `fix(mixmag): …`.

- [ ] **Step 2: Comparar contra el live**

Levantar `npm run dev`; con Playwright navegar a `/mixmag` y `/tagmag` (Resumen + Revistas), screenshots a `docs/references/mixmag/ours-{mixmag,tagmag}-{resumen,revistas}.png`. Checklist pixel-perfect contra `live-mixmag-{resumen,revistas}.png` y `live-tagmag-*`:
  - Resumen: 3 stat cards (labels uppercase, valores), "Publicaciones" + card (punto accent, spaceName, "4 en curso", revista abierta / TAGMAG sin ella).
  - Revistas: header (punto + spaceName + "+ Edición" `#44444C`) + card de edición (portada placeholder, "#29 Patrick Topping", "Agosto 2026", "En preparación", "0 de 1 listos", 0%) / empty-state en TAGMAG.
  - Pestañas navegan; Contenidos/Campañas muestran "En construcción".
  Anotar desviaciones y corregir (commit `fix(mixmag): ajuste pixel-perfect …`).

- [ ] **Step 3: Commit de capturas**

```bash
git add docs/references/mixmag/ours-*.png
git commit -m "test(mixmag): capturas ours Resumen/Revistas (Fase A)"
```

---

## Notas de ejecución
- `MixmagShell`/`TagmagShell` ya existen (stubs de Home v2 sobre `ModuleShell`) — los reescribes en Task 5; si tienen test (`NewModuleShells.test.tsx`) que asume el placeholder "en desarrollo", actualízalo (el heading sigue siendo "Mixmag"/"TAGMAG" pero ahora vía el shell real, que renderiza el nombre en la TopNav, no un `<h1>`; ajusta el test a un aserto que siga siendo cierto, p.ej. presencia de la pestaña "Resumen").
- Reusa `StatCard`, `Badge` (`variant="neutral"`), `ProgressBar` de `@/components/ui`. Para las cards de publicación/edición usa `border-slate-200` explícito (el `Card` genérico usa `border-slate-100`).
- Ninguna clase `brand-*`; botón primario `bg-[#44444C]`.
