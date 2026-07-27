# Incidencias Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Calcar pixel-perfect el módulo **Incidencias** (`/incidencias`) del live: bandeja de reportes enviados desde el panel global de Ayuda — H2 + subtítulo, 5 tarjetas-stat que actúan como filtro exclusivo por estado, y una lista de 8 filas con badge de estado, chip "Idea", texto truncado, adjunto, ruta de origen y avatar del reportante.

**Architecture:** `IncidenciasShell` (nuevo, patrón `MiTrabajoShell`: `AppLayout` sin prop `module`, sin sub-navegación) → `IncidenciasPage`, que lee el seed fijo de `data/incidencias.ts` y mantiene `estadoFilter: IncidenciaEstado | null` en estado local. Componentes pequeños: `IncidenciaStatFilter` (tarjeta-stat toggle), `IncidenciaAvatar` (círculo 18px con iniciales o silueta gris), `IncidenciaRow` (fila de lista), `IncidenciaList` (contenedor + estado vacío). `Badge` (`@/components/ui`) gana la variante `'violet'` para el chip "Idea" en vez de duplicarlo.

**Tech Stack:** React 19, react-router 7, Tailwind 3, Vitest + Testing Library, TypeScript strict (target ES2020, `noUnusedLocals`, lint `--max-warnings 0`).

## Global Constraints

- **FIEL AL LIVE (pixel-perfect).** Fuente de verdad: capturas en `docs/references/incidencias/live-incidencias*.png` + `live-incidencias-tokens.json` (incluye el bloque `ADDENDUM_manual_dom_inspection` con clases exactas extraídas del DOM real — es la referencia de estilos más precisa, úsala por encima de aproximaciones visuales). Verificación final Playwright ours↔live obligatoria en las 6 vistas.
- Presentacional/in-memory: prohibido mutar el live; nunca hay red ni persistencia real. Modelo de datos espeja una tabla Supabase `incidencias` (`reporterName`/`reporterInitials`/`reporterColor` denormalizados desde una futura tabla `users`, documentado como snapshot).
- **Reusar primitivos compartidos**: `Badge` de `@/components/ui` (gana variante `'violet'`, no se duplica el chip "Idea" a mano). `StatCard`/`Avatar` existentes **no** se reutilizan para las tarjetas-stat ni el avatar de reportante porque su forma visual e interactiva no coincide con el live (documentado como no-reuso intencional, igual que en Mixmag Fase C con `StageBox`/`CampaignCard`).
- Sin clases `brand-*` en los grises/negros del live; paleta de estado limitada a `rose`/`sky`/`slate`/`emerald`/`violet` tal cual el live.
- es-ES. Target ES2020: NO `Array.prototype.at()`.
- Ubicación `src/features/incidencias/` (datos `data/incidencias.ts`, componentes `components/`, página `pages/IncidenciasPage.tsx`). Shell nuevo en `src/features/modules/IncidenciasShell.tsx` (patrón `MiTrabajoShell`).
- Cada test importa `'@testing-library/jest-dom'`. Un commit por tarea.
- Fila de lista (`IncidenciaRow`) queda **inerte** al click (`onClick` no-op documentado) — el live probablemente abre un detalle no explorado por la regla de no-navegar a lo desconocido. No se inventa ningún filtro de "solo mis reportes"; "Mis avisos" del `HelpPanel` solo enlaza a `/incidencias` (mismo destino que en el live).

---

### Task 1: Modelo de datos + helpers (`incidencias.ts`)

**Files:**
- Create: `src/features/incidencias/data/incidencias.ts`
- Test: `src/features/incidencias/data/incidencias.test.ts`

**Interfaces:**
- Produces:
  - `type IncidenciaEstado = 'nueva' | 'auto' | 'en_curso' | 'resuelta' | 'descartada'`
  - `type IncidenciaTipo = 'idea'`
  - `interface Incidencia { id: string; estado: IncidenciaEstado; tipo?: IncidenciaTipo; texto: string; hasAttachment: boolean; routePath: string; reporterName?: string; reporterInitials?: string; reporterColor?: string }`
  - `INCIDENCIA_ESTADOS: { id: IncidenciaEstado; label: string }[]` (orden fijo: nueva/NUEVAS, auto/AUTO, en_curso/EN CURSO, resuelta/RESUELTAS, descartada/DESCARTADAS)
  - `listIncidencias(): Incidencia[]`
  - `countByEstado(list: Incidencia[]): Record<IncidenciaEstado, number>`
  - `filterByEstado(list: Incidencia[], estado: IncidenciaEstado | null): Incidencia[]`

- [ ] **Step 1: Write the failing test**

```ts
// src/features/incidencias/data/incidencias.test.ts
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { INCIDENCIA_ESTADOS, listIncidencias, countByEstado, filterByEstado } from './incidencias';
import type { Incidencia } from './incidencias';

describe('incidencias data', () => {
  it('INCIDENCIA_ESTADOS declara los 5 estados en el orden fijo del live', () => {
    expect(INCIDENCIA_ESTADOS.map((e) => e.id)).toEqual([
      'nueva', 'auto', 'en_curso', 'resuelta', 'descartada',
    ]);
    expect(INCIDENCIA_ESTADOS.map((e) => e.label)).toEqual([
      'NUEVAS', 'AUTO', 'EN CURSO', 'RESUELTAS', 'DESCARTADAS',
    ]);
  });

  it('listIncidencias devuelve las 8 filas semilla en el orden exacto del live', () => {
    const list = listIncidencias();
    expect(list).toHaveLength(8);
    expect(list.map((i) => i.estado)).toEqual([
      'descartada', 'resuelta', 'descartada', 'descartada', 'nueva', 'descartada', 'resuelta', 'auto',
    ]);
    expect(list[0].texto).toBe(
      'viendo como crear un cliente y pone una dirección de correo. Puede haber más de un contacto, si es Marketing, Dirección o administración?'
    );
    expect(list[0].tipo).toBe('idea');
    expect(list[0].hasAttachment).toBe(false);
    expect(list[0].routePath).toBe('/');
    expect(list[0].reporterInitials).toBe('FV');
    expect(list[0].reporterColor).toBe('#EA580C');
    expect(list[1].tipo).toBeUndefined();
    expect(list[1].hasAttachment).toBe(true);
    expect(list[1].routePath).toBe('/euphoric/calendario');
    expect(list[1].reporterInitials).toBe('AG');
    expect(list[1].reporterColor).toBe('#16A34A');
    expect(list[4].reporterInitials).toBe('JC');
    expect(list[4].routePath).toBe('/shows/nuevo');
    expect(list[3].reporterInitials).toBeUndefined();
    expect(list[3].reporterName).toBeUndefined();
    expect(list[3].reporterColor).toBeUndefined();
    expect(list[6].routePath).toBe('/shows/08ea3304-af17-4722-84d5-d3b63347fe74');
    expect(list[7].routePath).toBe('/shows/08ea3304-af17-4722-84d5-d3b63347fe74');
  });

  it('listIncidencias es inmutable: mutar el array devuelto no afecta la siguiente llamada', () => {
    const first = listIncidencias();
    const extra: Incidencia = { id: 'x', estado: 'nueva', texto: 'x', hasAttachment: false, routePath: '/' };
    first.push(extra);
    first[0].texto = 'mutado';
    expect(listIncidencias()).toHaveLength(8);
    expect(listIncidencias()[0].texto).not.toBe('mutado');
    expect(listIncidencias()).not.toBe(first);
  });

  it('countByEstado: nueva 1, auto 1, en_curso 0, resuelta 2, descartada 4', () => {
    expect(countByEstado(listIncidencias())).toEqual({
      nueva: 1, auto: 1, en_curso: 0, resuelta: 2, descartada: 4,
    });
  });

  it('filterByEstado filtra por cada estado y null devuelve las 8 sin filtrar', () => {
    const list = listIncidencias();
    expect(filterByEstado(list, null)).toHaveLength(8);
    expect(filterByEstado(list, 'nueva')).toHaveLength(1);
    expect(filterByEstado(list, 'auto')).toHaveLength(1);
    expect(filterByEstado(list, 'en_curso')).toHaveLength(0);
    expect(filterByEstado(list, 'resuelta')).toHaveLength(2);
    expect(filterByEstado(list, 'descartada')).toHaveLength(4);
  });

  it('filterByEstado no muta la lista original', () => {
    const list = listIncidencias();
    filterByEstado(list, 'nueva');
    expect(list).toHaveLength(8);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/incidencias/data/incidencias.test.ts`
Expected: FAIL (Cannot find module './incidencias').

- [ ] **Step 3: Write minimal implementation**

```ts
// src/features/incidencias/data/incidencias.ts
export type IncidenciaEstado = 'nueva' | 'auto' | 'en_curso' | 'resuelta' | 'descartada';
export type IncidenciaTipo = 'idea';

export interface Incidencia {
  id: string;
  estado: IncidenciaEstado;
  tipo?: IncidenciaTipo;
  texto: string;
  hasAttachment: boolean;
  routePath: string;
  reporterName?: string;
  reporterInitials?: string;
  reporterColor?: string;
}

export const INCIDENCIA_ESTADOS: { id: IncidenciaEstado; label: string }[] = [
  { id: 'nueva', label: 'NUEVAS' },
  { id: 'auto', label: 'AUTO' },
  { id: 'en_curso', label: 'EN CURSO' },
  { id: 'resuelta', label: 'RESUELTAS' },
  { id: 'descartada', label: 'DESCARTADAS' },
];

// Seed exacto del live (orden de llegada, sin filtrar). reporterName/Initials/Color
// denormalizados desde una futura tabla `users` (FK conceptual reporterId no confirmable
// sin datos adicionales del live); ausentes = reportante anónimo/desconocido.
const incidencias: Incidencia[] = [
  {
    id: 'inc-1',
    estado: 'descartada',
    tipo: 'idea',
    texto:
      'viendo como crear un cliente y pone una dirección de correo. Puede haber más de un contacto, si es Marketing, Dirección o administración?',
    hasAttachment: false,
    routePath: '/',
    reporterName: 'Fran Hinojosa Veredas',
    reporterInitials: 'FV',
    reporterColor: '#EA580C',
  },
  {
    id: 'inc-2',
    estado: 'resuelta',
    texto:
      'Me gustaría hacer la solicitud de 2 cosas: 1. Que se pudiera crear un nuevo evento haciendo clic en el calendario, 2. opción de catalán, 3. arreglar generación de copys por IA',
    hasAttachment: true,
    routePath: '/euphoric/calendario',
    reporterName: 'Alba Gelabert',
    reporterInitials: 'AG',
    reporterColor: '#16A34A',
  },
  {
    id: 'inc-3',
    estado: 'descartada',
    tipo: 'idea',
    texto:
      'Me gustaría hacer la solicitud de 2 cosas: 1. Que se pudiera crear un nuevo evento haciendo clic en el calendario, 2. opción de catalán',
    hasAttachment: false,
    routePath: '/',
    reporterName: 'Alba Gelabert',
    reporterInitials: 'AG',
    reporterColor: '#16A34A',
  },
  {
    id: 'inc-4',
    estado: 'descartada',
    texto: 'Esto debería estar enlazado con no...',
    hasAttachment: true,
    routePath: '/euphoric/campanas',
  },
  {
    id: 'inc-5',
    estado: 'nueva',
    tipo: 'idea',
    texto: 'En el apartat de contactes del Signer/Buyer molaria afegir la opcio de posar TEL',
    hasAttachment: false,
    routePath: '/shows/nuevo',
    reporterName: 'JC',
    reporterInitials: 'JC',
    reporterColor: '#2563EB',
  },
  {
    id: 'inc-6',
    estado: 'descartada',
    tipo: 'idea',
    texto: 'Esto podrías darle color por favor, en cada pestaña igual.',
    hasAttachment: true,
    routePath: '/shows/95a152d1-d546-400b-904d-195f84400c66',
  },
  {
    id: 'inc-7',
    estado: 'resuelta',
    tipo: 'idea',
    texto:
      'En logística del deal si se selecciona traslados internos tiene que salir siempre predefinido coche privado',
    hasAttachment: true,
    routePath: '/shows/08ea3304-af17-4722-84d5-d3b63347fe74',
  },
  {
    id: 'inc-8',
    estado: 'auto',
    tipo: 'idea',
    texto: '¿por qué no puedo seleccionar ida y vuelta en la estimación de vuelo?',
    hasAttachment: false,
    routePath: '/shows/08ea3304-af17-4722-84d5-d3b63347fe74',
  },
];

export function listIncidencias(): Incidencia[] {
  return incidencias.map((i) => ({ ...i }));
}

export function countByEstado(list: Incidencia[]): Record<IncidenciaEstado, number> {
  const out: Record<IncidenciaEstado, number> = { nueva: 0, auto: 0, en_curso: 0, resuelta: 0, descartada: 0 };
  list.forEach((i) => {
    out[i.estado] += 1;
  });
  return out;
}

export function filterByEstado(list: Incidencia[], estado: IncidenciaEstado | null): Incidencia[] {
  if (estado === null) return [...list];
  return list.filter((i) => i.estado === estado);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/incidencias/data/incidencias.test.ts`
Expected: PASS (7 tests).

- [ ] **Step 5: Commit**

```bash
git add src/features/incidencias/data/incidencias.ts src/features/incidencias/data/incidencias.test.ts
git commit -m "feat(incidencias): modelo de datos + seeds/helpers"
```

---

### Task 2: `Badge` gana la variante `'violet'`

**Files:**
- Modify: `src/components/ui/Badge.tsx`
- Modify (test): `src/components/ui/Badge.test.tsx`

**Interfaces:**
- Produces: `BadgeProps['variant']` amplía la unión con `'violet'` → clases `bg-violet-100 text-violet-700`.

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

  it('renders the rose variant', () => {
    render(<Badge variant="rose">Cambios</Badge>);
    expect(screen.getByText('Cambios')).toHaveClass('bg-rose-100', 'text-rose-700');
  });

  it('renders the violet variant', () => {
    render(<Badge variant="violet" size="sm">Idea</Badge>);
    expect(screen.getByText('Idea')).toHaveClass('bg-violet-100', 'text-violet-700');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/ui/Badge.test.tsx`
Expected: FAIL (el test "renders the violet variant" falla: falta la clase `bg-violet-100`/`text-violet-700`, `variant="violet"` no es un valor válido de `BadgeProps['variant']` → error de tipos en `tsc`).

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/components/ui/Badge.tsx
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
    | 'emerald'
    | 'sky'
    | 'indigo'
    | 'pink'
    | 'rose'
    | 'violet';
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
          'bg-sky-100 text-sky-700': variant === 'sky',
          'bg-indigo-100 text-indigo-700': variant === 'indigo',
          'bg-pink-50 text-pink-600': variant === 'pink',
          'bg-rose-100 text-rose-700': variant === 'rose',
          'bg-violet-100 text-violet-700': variant === 'violet',
        },
        className
      )}
      {...props}
    />
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/ui/Badge.test.tsx`
Expected: PASS (8 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/Badge.tsx src/components/ui/Badge.test.tsx
git commit -m "feat(ui): Badge gana la variante violet (chip 'Idea' de Incidencias)"
```

---

### Task 3: `IncidenciaAvatar`

**Files:**
- Create: `src/features/incidencias/components/IncidenciaAvatar.tsx`
- Test: `src/features/incidencias/components/IncidenciaAvatar.test.tsx`

**Interfaces:**
- Consumes: `User` de `lucide-react`.
- Produces: `IncidenciaAvatar(props: { reporterName?: string; reporterInitials?: string; reporterColor?: string }): JSX.Element` — círculo 18px con iniciales blancas sobre `reporterColor` cuando hay `reporterInitials`, o silueta gris genérica (icono `User`) si no. `aria-label={reporterName ?? 'Reportante desconocido'}`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/features/incidencias/components/IncidenciaAvatar.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IncidenciaAvatar } from './IncidenciaAvatar';

describe('IncidenciaAvatar', () => {
  it('muestra iniciales blancas sobre el color del reportante', () => {
    render(
      <IncidenciaAvatar reporterName="Fran Hinojosa Veredas" reporterInitials="FV" reporterColor="#EA580C" />
    );
    const avatar = screen.getByLabelText('Fran Hinojosa Veredas');
    expect(avatar).toHaveTextContent('FV');
    expect(avatar).toHaveStyle({ backgroundColor: '#EA580C' });
  });

  it('fallback a silueta gris genérica con aria-label "Reportante desconocido" cuando no hay identidad', () => {
    render(<IncidenciaAvatar />);
    const avatar = screen.getByLabelText('Reportante desconocido');
    expect(avatar).toHaveClass('bg-slate-200');
    expect(avatar.querySelector('svg')).not.toBeNull();
    expect(avatar).not.toHaveTextContent(/./);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/incidencias/components/IncidenciaAvatar.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/features/incidencias/components/IncidenciaAvatar.tsx
import { User } from 'lucide-react';

export interface IncidenciaAvatarProps {
  reporterName?: string;
  reporterInitials?: string;
  reporterColor?: string;
}

export function IncidenciaAvatar({ reporterName, reporterInitials, reporterColor }: IncidenciaAvatarProps) {
  const label = reporterName ?? 'Reportante desconocido';

  if (reporterInitials && reporterColor) {
    return (
      <span
        aria-label={label}
        className="grid shrink-0 place-items-center rounded-full font-semibold text-white"
        style={{ width: 18, height: 18, fontSize: 8, backgroundColor: reporterColor }}
      >
        {reporterInitials}
      </span>
    );
  }

  return (
    <span
      aria-label={label}
      className="grid shrink-0 place-items-center rounded-full bg-slate-200 text-slate-400"
      style={{ width: 18, height: 18 }}
    >
      <User style={{ width: 10, height: 10 }} />
    </span>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/incidencias/components/IncidenciaAvatar.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/incidencias/components/IncidenciaAvatar.tsx src/features/incidencias/components/IncidenciaAvatar.test.tsx
git commit -m "feat(incidencias): IncidenciaAvatar (iniciales por color + silueta gris)"
```

---

### Task 4: `IncidenciaStatFilter`

**Files:**
- Create: `src/features/incidencias/components/IncidenciaStatFilter.tsx`
- Test: `src/features/incidencias/components/IncidenciaStatFilter.test.tsx`

**Interfaces:**
- Consumes: `IncidenciaEstado` de `../data/incidencias`.
- Produces: `IncidenciaStatFilter(props: { estado: IncidenciaEstado; label: string; count: number; selected: boolean; onToggle: () => void }): JSX.Element`

- [ ] **Step 1: Write the failing test**

```tsx
// src/features/incidencias/components/IncidenciaStatFilter.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IncidenciaStatFilter } from './IncidenciaStatFilter';

describe('IncidenciaStatFilter', () => {
  it('con count>0 sin seleccionar: borde normal, badge de acento, número oscuro', () => {
    render(<IncidenciaStatFilter estado="nueva" label="NUEVAS" count={1} selected={false} onToggle={() => {}} />);
    const btn = screen.getByRole('button', { name: /NUEVAS/ });
    expect(btn).toHaveClass('border-slate-200', 'bg-white');
    expect(screen.getByText('NUEVAS')).toHaveClass('bg-rose-100', 'text-rose-700');
    expect(screen.getByText('1')).toHaveClass('text-slate-900');
    expect(btn).toHaveAttribute('aria-pressed', 'false');
  });

  it('con count=0 sin seleccionar: atenuada (borde y badge distintos) — caso EN CURSO', () => {
    render(<IncidenciaStatFilter estado="en_curso" label="EN CURSO" count={0} selected={false} onToggle={() => {}} />);
    const btn = screen.getByRole('button', { name: /EN CURSO/ });
    expect(btn).toHaveClass('border-slate-100', 'bg-slate-50/60');
    expect(screen.getByText('EN CURSO')).toHaveClass('bg-transparent', 'text-slate-300');
    expect(screen.getByText('0')).toHaveClass('text-slate-300');
  });

  it('seleccionada: borde y fondo de selección, aria-pressed true; con count=0 el badge sigue atenuado', () => {
    render(<IncidenciaStatFilter estado="en_curso" label="EN CURSO" count={0} selected onToggle={() => {}} />);
    const btn = screen.getByRole('button', { name: /EN CURSO/ });
    expect(btn).toHaveClass('border-slate-800', 'bg-white', 'shadow-sm');
    expect(btn).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('EN CURSO')).toHaveClass('bg-transparent', 'text-slate-300');
  });

  it('dispara onToggle al click', async () => {
    const onToggle = vi.fn();
    render(<IncidenciaStatFilter estado="resuelta" label="RESUELTAS" count={2} selected={false} onToggle={onToggle} />);
    await userEvent.click(screen.getByRole('button', { name: /RESUELTAS/ }));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/incidencias/components/IncidenciaStatFilter.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/features/incidencias/components/IncidenciaStatFilter.tsx
import type { IncidenciaEstado } from '../data/incidencias';

const ESTADO_ACCENT: Record<IncidenciaEstado, string> = {
  nueva: 'bg-rose-100 text-rose-700',
  auto: 'bg-sky-100 text-sky-700',
  en_curso: 'bg-slate-100 text-slate-500',
  resuelta: 'bg-emerald-100 text-emerald-700',
  descartada: 'bg-slate-100 text-slate-500',
};

export interface IncidenciaStatFilterProps {
  estado: IncidenciaEstado;
  label: string;
  count: number;
  selected: boolean;
  onToggle: () => void;
}

export function IncidenciaStatFilter({ estado, label, count, selected, onToggle }: IncidenciaStatFilterProps) {
  const hasCount = count > 0;
  const cardClass = selected
    ? 'border-slate-800 bg-white shadow-sm'
    : hasCount
      ? 'border-slate-200 bg-white hover:border-slate-300'
      : 'border-slate-100 bg-slate-50/60';
  const badgeClass = hasCount ? ESTADO_ACCENT[estado] : 'bg-transparent text-slate-300';
  const countClass = hasCount ? 'text-slate-900' : 'text-slate-300';

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={`min-w-[92px] rounded-lg border px-2.5 py-1.5 text-left transition ${cardClass}`}
    >
      <span
        className={`block truncate rounded px-1 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${badgeClass}`}
      >
        {label}
      </span>
      <span className={`block text-lg font-semibold ${countClass}`}>{count}</span>
    </button>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/incidencias/components/IncidenciaStatFilter.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/incidencias/components/IncidenciaStatFilter.tsx src/features/incidencias/components/IncidenciaStatFilter.test.tsx
git commit -m "feat(incidencias): IncidenciaStatFilter (tarjeta-stat toggle exclusivo)"
```

---

### Task 5: `IncidenciaRow`

**Files:**
- Create: `src/features/incidencias/components/IncidenciaRow.tsx`
- Test: `src/features/incidencias/components/IncidenciaRow.test.tsx`

**Interfaces:**
- Consumes: `Incidencia`, `IncidenciaEstado`, `INCIDENCIA_ESTADOS` de `../data/incidencias`; `Badge` de `@/components/ui`; `IncidenciaAvatar` de `./IncidenciaAvatar`.
- Produces: `IncidenciaRow(props: { incidencia: Incidencia }): JSX.Element`

- [ ] **Step 1: Write the failing test**

```tsx
// src/features/incidencias/components/IncidenciaRow.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IncidenciaRow } from './IncidenciaRow';
import { listIncidencias } from '../data/incidencias';

const seed = listIncidencias();

describe('IncidenciaRow', () => {
  it('fila con tipo "idea", sin adjunto: badge DESCARTADAS, chip Idea, texto, ruta "/", guion, avatar con iniciales', () => {
    render(<IncidenciaRow incidencia={seed[0]} />);
    expect(screen.getByText('DESCARTADAS')).toHaveClass('w-24', 'bg-slate-100', 'text-slate-500');
    expect(screen.getByText('Idea')).toHaveClass('bg-violet-100', 'text-violet-700');
    expect(screen.getByText(seed[0].texto)).toBeInTheDocument();
    expect(screen.queryByText('📎')).toBeNull();
    expect(screen.getByText('/')).toBeInTheDocument();
    expect(screen.getByText('—')).toBeInTheDocument();
    expect(screen.getByLabelText('Fran Hinojosa Veredas')).toBeInTheDocument();
  });

  it('fila sin tipo, con adjunto: sin chip Idea, 📎 presente, badge RESUELTAS emerald', () => {
    render(<IncidenciaRow incidencia={seed[1]} />);
    expect(screen.queryByText('Idea')).toBeNull();
    expect(screen.getByText('📎')).toBeInTheDocument();
    expect(screen.getByText('RESUELTAS')).toHaveClass('bg-emerald-100', 'text-emerald-700');
    expect(screen.getByText('/euphoric/calendario')).toBeInTheDocument();
  });

  it('fila con reportante anónimo: avatar con aria-label "Reportante desconocido"', () => {
    render(<IncidenciaRow incidencia={seed[3]} />);
    expect(screen.getByLabelText('Reportante desconocido')).toBeInTheDocument();
  });

  it('la fila es un botón inerte (no lanza al hacer click)', async () => {
    render(<IncidenciaRow incidencia={seed[0]} />);
    const row = screen.getByRole('button');
    expect(row).toHaveAttribute('type', 'button');
    await userEvent.click(row);
    expect(screen.getByText(seed[0].texto)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/incidencias/components/IncidenciaRow.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/features/incidencias/components/IncidenciaRow.tsx
import { Badge } from '@/components/ui';
import { IncidenciaAvatar } from './IncidenciaAvatar';
import { INCIDENCIA_ESTADOS } from '../data/incidencias';
import type { Incidencia, IncidenciaEstado } from '../data/incidencias';

const ESTADO_BADGE: Record<IncidenciaEstado, string> = {
  nueva: 'bg-rose-100 text-rose-700',
  auto: 'bg-sky-100 text-sky-700',
  en_curso: 'bg-transparent text-slate-300',
  resuelta: 'bg-emerald-100 text-emerald-700',
  descartada: 'bg-slate-100 text-slate-500',
};

const ESTADO_LABEL: Record<IncidenciaEstado, string> = INCIDENCIA_ESTADOS.reduce(
  (acc, e) => ({ ...acc, [e.id]: e.label }),
  {} as Record<IncidenciaEstado, string>
);

export interface IncidenciaRowProps {
  incidencia: Incidencia;
}

export function IncidenciaRow({ incidencia }: IncidenciaRowProps) {
  const { estado, tipo, texto, hasAttachment, routePath, reporterName, reporterInitials, reporterColor } =
    incidencia;

  return (
    <button
      type="button"
      // Inerte a propósito: el live probablemente abre un detalle/drawer al pulsar
      // la fila, no explorado por la regla de no-navegar a lo desconocido (ver plan, Global Constraints).
      onClick={() => {}}
      className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-slate-50"
    >
      <span
        className={`w-24 shrink-0 truncate rounded px-1.5 py-0.5 text-center text-[10px] font-semibold uppercase tracking-wide ${ESTADO_BADGE[estado]}`}
      >
        {ESTADO_LABEL[estado]}
      </span>
      {tipo === 'idea' && (
        <Badge variant="violet" size="sm">
          Idea
        </Badge>
      )}
      <span className="min-w-0 flex-1 truncate text-sm text-slate-800">{texto}</span>
      {hasAttachment && <span className="shrink-0 text-[11px] text-slate-400">📎</span>}
      <span className="hidden w-40 shrink-0 truncate text-[11px] text-slate-400 lg:block">{routePath}</span>
      <span className="w-20 shrink-0 text-right text-[11px] text-slate-400">—</span>
      <IncidenciaAvatar reporterName={reporterName} reporterInitials={reporterInitials} reporterColor={reporterColor} />
    </button>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/incidencias/components/IncidenciaRow.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/incidencias/components/IncidenciaRow.tsx src/features/incidencias/components/IncidenciaRow.test.tsx
git commit -m "feat(incidencias): IncidenciaRow (fila de lista, inerte al click)"
```

---

### Task 6: `IncidenciaList`

**Files:**
- Create: `src/features/incidencias/components/IncidenciaList.tsx`
- Test: `src/features/incidencias/components/IncidenciaList.test.tsx`

**Interfaces:**
- Consumes: `Incidencia` de `../data/incidencias`; `IncidenciaRow` de `./IncidenciaRow`.
- Produces: `IncidenciaList(props: { items: Incidencia[] }): JSX.Element`

- [ ] **Step 1: Write the failing test**

```tsx
// src/features/incidencias/components/IncidenciaList.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IncidenciaList } from './IncidenciaList';
import { listIncidencias } from '../data/incidencias';

describe('IncidenciaList', () => {
  it('renderiza una fila por cada item', () => {
    render(<IncidenciaList items={listIncidencias()} />);
    expect(screen.getAllByRole('button')).toHaveLength(8);
    expect(screen.getByText('¿por qué no puedo seleccionar ida y vuelta en la estimación de vuelo?')).toBeInTheDocument();
  });

  it('lista vacía: muestra "Nada en este estado." sin filas ni icono', () => {
    render(<IncidenciaList items={[]} />);
    expect(screen.getByText('Nada en este estado.')).toBeInTheDocument();
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/incidencias/components/IncidenciaList.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/features/incidencias/components/IncidenciaList.tsx
import { IncidenciaRow } from './IncidenciaRow';
import type { Incidencia } from '../data/incidencias';

export interface IncidenciaListProps {
  items: Incidencia[];
}

export function IncidenciaList({ items }: IncidenciaListProps) {
  if (items.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white py-10 text-center text-sm text-slate-400">
        Nada en este estado.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="divide-y divide-slate-50">
        {items.map((i) => (
          <IncidenciaRow key={i.id} incidencia={i} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/incidencias/components/IncidenciaList.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/incidencias/components/IncidenciaList.tsx src/features/incidencias/components/IncidenciaList.test.tsx
git commit -m "feat(incidencias): IncidenciaList (contenedor + estado vacío)"
```

---

### Task 7: `IncidenciasPage` + `IncidenciasShell` + wiring del router + delta "Mis avisos"

**Files:**
- Create: `src/features/incidencias/pages/IncidenciasPage.tsx`
- Test: `src/features/incidencias/pages/IncidenciasPage.test.tsx`
- Create: `src/features/modules/IncidenciasShell.tsx`
- Test: `src/features/modules/IncidenciasShell.test.tsx`
- Modify: `src/app/router.tsx` (añadir ruta `/incidencias`)
- Modify: `src/components/layout/HelpPanel.tsx` ("Mis avisos" pasa de `<button>` inerte a `<Link to="/incidencias">`)
- Modify (test): `src/components/layout/HelpPanel.test.tsx` (envolver en `MemoryRouter`, asserar `href`)

**Interfaces:**
- Consumes (página): `listIncidencias`, `countByEstado`, `filterByEstado`, `INCIDENCIA_ESTADOS`, `IncidenciaEstado` de `../data/incidencias`; `IncidenciaStatFilter`, `IncidenciaList`.
- Consumes (shell): `AppLayout` de `@/components/layout`; `User` de `@/types`.
- Produces: `IncidenciasPage(): JSX.Element`, `IncidenciasShell(): JSX.Element`.

- [ ] **Step 1: Write the failing tests**

```tsx
// src/features/incidencias/pages/IncidenciasPage.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IncidenciasPage } from './IncidenciasPage';

describe('IncidenciasPage', () => {
  it('sin filtro: título, subtítulo, 5 stats con conteos 1/1/0/2/4 y 8 filas', () => {
    render(<IncidenciasPage />);
    expect(screen.getByRole('heading', { name: 'Incidencias' })).toBeInTheDocument();
    expect(
      screen.getByText('Lo que el equipo reporta desde el panel de ayuda. Responder es lo que hace que sigan reportando.')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /NUEVAS/ })).toHaveTextContent('1');
    expect(screen.getByRole('button', { name: /AUTO/ })).toHaveTextContent('1');
    expect(screen.getByRole('button', { name: /EN CURSO/ })).toHaveTextContent('0');
    expect(screen.getByRole('button', { name: /RESUELTAS/ })).toHaveTextContent('2');
    expect(screen.getByRole('button', { name: /DESCARTADAS/ })).toHaveTextContent('4');
    // 5 stat-cards + 8 filas = 13 botones
    expect(screen.getAllByRole('button')).toHaveLength(13);
  });

  it('click en NUEVAS filtra a 1 fila; segundo click limpia el filtro (vuelve a 8)', async () => {
    render(<IncidenciasPage />);
    await userEvent.click(screen.getByRole('button', { name: /NUEVAS/ }));
    expect(screen.getAllByRole('button')).toHaveLength(6); // 5 stats + 1 fila
    expect(
      screen.getByText('En el apartat de contactes del Signer/Buyer molaria afegir la opcio de posar TEL')
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /NUEVAS/ }));
    expect(screen.getAllByRole('button')).toHaveLength(13);
  });

  it('click en EN CURSO muestra el estado vacío "Nada en este estado."', async () => {
    render(<IncidenciasPage />);
    await userEvent.click(screen.getByRole('button', { name: /EN CURSO/ }));
    expect(screen.getByText('Nada en este estado.')).toBeInTheDocument();
  });

  it('click en DESCARTADAS filtra a las 4 filas exactas; solo un filtro activo a la vez', async () => {
    render(<IncidenciasPage />);
    await userEvent.click(screen.getByRole('button', { name: /DESCARTADAS/ }));
    expect(screen.getAllByRole('button')).toHaveLength(9); // 5 stats + 4 filas
    await userEvent.click(screen.getByRole('button', { name: /RESUELTAS/ }));
    // cambia de filtro sin acumular: 5 stats + 2 filas
    expect(screen.getAllByRole('button')).toHaveLength(7);
  });

  it('no usa clases brand-*', () => {
    const { container } = render(<IncidenciasPage />);
    expect(container.querySelector('[class*="brand-"]')).toBeNull();
  });
});
```

```tsx
// src/features/modules/IncidenciasShell.test.tsx
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect } from 'vitest';
import { IncidenciasShell } from './IncidenciasShell';

describe('IncidenciasShell', () => {
  it('renderiza IncidenciasPage dentro del AppLayout', () => {
    render(
      <MemoryRouter>
        <IncidenciasShell />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: 'Incidencias' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /NUEVAS/ })).toBeInTheDocument();
  });
});
```

Modificar `src/components/layout/HelpPanel.test.tsx` (envolver en `MemoryRouter` y asserar el `href` de "Mis avisos"):

```tsx
// src/components/layout/HelpPanel.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import '@testing-library/jest-dom';
import { HelpPanel } from './HelpPanel';

function renderPanel() {
  return render(
    <MemoryRouter>
      <HelpPanel />
    </MemoryRouter>
  );
}

describe('HelpPanel', () => {
  it('renderiza el panel con Enviar, Reportar con captura y Mis avisos', () => {
    renderPanel();
    expect(screen.getByText('Ayuda')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Enviar' })).toBeInTheDocument();
    expect(screen.getByText('Reportar con captura')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Mis avisos' })).toHaveAttribute('href', '/incidencias');
  });

  it('se colapsa al pulsar cerrar', async () => {
    const user = userEvent.setup();
    renderPanel();
    await user.click(screen.getByRole('button', { name: /Cerrar ayuda/ }));
    expect(screen.queryByRole('button', { name: 'Enviar' })).toBeNull();
  });

  it('abre el modal Reportar, envía y muestra el toast', async () => {
    const user = userEvent.setup();
    renderPanel();
    await user.click(screen.getByRole('button', { name: 'Reportar con captura' }));
    expect(screen.getByRole('heading', { name: 'Reportar' })).toBeInTheDocument();
    // el panel de ayuda ya no está visible
    expect(screen.queryByText('Reportar con captura')).toBeNull();
    await user.type(screen.getByRole('textbox'), 'no carga la página');
    await user.click(screen.getByRole('button', { name: 'Enviar' }));
    expect(screen.queryByRole('heading', { name: 'Reportar' })).toBeNull();
    expect(screen.getByText('Gracias, hemos recibido tu incidencia.')).toBeInTheDocument();
  });

  it('Cancelar vuelve al panel de ayuda', async () => {
    const user = userEvent.setup();
    renderPanel();
    await user.click(screen.getByRole('button', { name: 'Reportar con captura' }));
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.getByPlaceholderText('Pregunta o cuenta qué falla…')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/features/incidencias/pages/IncidenciasPage.test.tsx src/features/modules/IncidenciasShell.test.tsx src/components/layout/HelpPanel.test.tsx`
Expected: FAIL — `IncidenciasPage`/`IncidenciasShell` module not found; `HelpPanel` primer test falla porque "Mis avisos" sigue siendo `<button>` sin `role="link"`/`href`.

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/features/incidencias/pages/IncidenciasPage.tsx
import { useState } from 'react';
import { listIncidencias, countByEstado, filterByEstado, INCIDENCIA_ESTADOS } from '../data/incidencias';
import type { IncidenciaEstado } from '../data/incidencias';
import { IncidenciaStatFilter } from '../components/IncidenciaStatFilter';
import { IncidenciaList } from '../components/IncidenciaList';

export function IncidenciasPage() {
  const [estadoFilter, setEstadoFilter] = useState<IncidenciaEstado | null>(null);

  const all = listIncidencias();
  const counts = countByEstado(all);
  const filtered = filterByEstado(all, estadoFilter);

  const toggle = (estado: IncidenciaEstado) => {
    setEstadoFilter((cur) => (cur === estado ? null : estado));
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">Incidencias</h2>
        <p className="text-sm text-slate-500">
          Lo que el equipo reporta desde el panel de ayuda. Responder es lo que hace que sigan reportando.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {INCIDENCIA_ESTADOS.map((e) => (
          <IncidenciaStatFilter
            key={e.id}
            estado={e.id}
            label={e.label}
            count={counts[e.id]}
            selected={estadoFilter === e.id}
            onToggle={() => toggle(e.id)}
          />
        ))}
      </div>
      <IncidenciaList items={filtered} />
    </div>
  );
}
```

```tsx
// src/features/modules/IncidenciasShell.tsx
import { AppLayout } from '@/components/layout';
import type { User } from '@/types';
import { IncidenciasPage } from '@/features/incidencias/pages/IncidenciasPage';

const mockUser: User = { id: '1', email: 'test@example.com', name: 'Test User', role: 'Admin' };

export function IncidenciasShell() {
  return (
    <AppLayout user={mockUser}>
      <IncidenciasPage />
    </AppLayout>
  );
}
```

Modificar `src/components/layout/HelpPanel.tsx` (delta mínimo: importar `Link` y sustituir el `<button>` de "Mis avisos"):

```tsx
// src/components/layout/HelpPanel.tsx
import { useEffect, useState } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { Link } from 'react-router';
import { ReportDialog } from './ReportDialog';

export function HelpPanel() {
  const [open, setOpen] = useState(true);
  const [reporting, setReporting] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!sent) return;
    const timer = setTimeout(() => setSent(false), 3000);
    return () => clearTimeout(timer);
  }, [sent]);

  if (reporting) {
    return (
      <ReportDialog
        onCancel={() => setReporting(false)}
        onSend={() => {
          setReporting(false);
          setSent(true);
        }}
      />
    );
  }

  return (
    <>
      {open ? (
        <div className="fixed bottom-4 left-4 z-30 w-[352px] rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <HelpCircle className="h-4 w-4 text-slate-500" />
              Ayuda
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-slate-400 hover:text-slate-600"
              aria-label="Cerrar ayuda"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm text-slate-500">
            Pregunta lo que quieras de esta pantalla, o cuenta qué está fallando.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <input
              type="text"
              placeholder="Pregunta o cuenta qué falla…"
              className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
            <button
              type="button"
              className="shrink-0 rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-900"
            >
              Enviar
            </button>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <button
              type="button"
              onClick={() => setReporting(true)}
              className="hover:text-slate-600"
            >
              Reportar con captura
            </button>
            <Link to="/incidencias" className="hover:text-slate-600">
              Mis avisos
            </Link>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-4 left-4 z-30 grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-lg hover:text-slate-800"
          aria-label="Abrir ayuda"
        >
          <HelpCircle className="h-5 w-5" />
        </button>
      )}
      {sent && (
        <div className="fixed bottom-4 left-4 z-50 rounded-lg bg-slate-800 px-4 py-2.5 text-sm text-white shadow-lg">
          Gracias, hemos recibido tu incidencia.
        </div>
      )}
    </>
  );
}
```

Modificar `src/app/router.tsx`: añadir el import y la ruta `/incidencias` (sin rutas hijas, igual que `/mi-trabajo`):

```tsx
// src/app/router.tsx (delta)
import { MiTrabajoShell } from '@/features/modules/MiTrabajoShell';
import { IncidenciasShell } from '@/features/modules/IncidenciasShell';
// ...resto de imports sin cambios...

// dentro de <Routes>, junto a la ruta de /mi-trabajo:
      <Route path="/mi-trabajo" element={<MiTrabajoShell />} />
      <Route path="/incidencias" element={<IncidenciasShell />} />
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/features/incidencias/pages/IncidenciasPage.test.tsx src/features/modules/IncidenciasShell.test.tsx src/components/layout/HelpPanel.test.tsx`
Expected: PASS.

- [ ] **Step 5: Run full gate**

Run: `npx vitest run && npx tsc --noEmit && npx eslint . --max-warnings 0`
Expected: todo verde.

- [ ] **Step 6: Commit**

```bash
git add src/features/incidencias/pages/IncidenciasPage.tsx src/features/incidencias/pages/IncidenciasPage.test.tsx \
        src/features/modules/IncidenciasShell.tsx src/features/modules/IncidenciasShell.test.tsx \
        src/app/router.tsx src/components/layout/HelpPanel.tsx src/components/layout/HelpPanel.test.tsx
git commit -m "feat(incidencias): IncidenciasPage + IncidenciasShell + ruta /incidencias + Mis avisos enlaza al módulo"
```

---

## Verificación final (fuera de tareas, en review de rama)

- **FIEL AL LIVE:** Playwright ours↔live en `/incidencias` para las 6 vistas — sin filtro, NUEVAS, AUTO, EN CURSO (vacío), RESUELTAS, DESCARTADAS — comparando contra `docs/references/incidencias/live-incidencias*.png`. Ajustar tokens finos (paddings `px-2.5 py-1.5` de la tarjeta-stat, `w-24`/`w-40`/`w-20` de las columnas de fila, tamaño 18px/8px del avatar) contra el bloque `ADDENDUM_manual_dom_inspection` de `live-incidencias-tokens.json` si algún detalle no calca a pixel. 0 errores de consola en las 6 vistas.
- Confirmar conteos exactos 1/1/0/2/4, orden de las 8 filas, toggle exclusivo (un único filtro activo, segundo click limpia), estado vacío "Nada en este estado." solo en EN CURSO, fila inerte al click (no navega, no lanza error), y que "Mis avisos" del `HelpPanel` (visible en cualquier pantalla) navega a `/incidencias`.
- Confirmar que ninguna clase `brand-*` aparece en el árbol renderizado de `/incidencias`.

## Self-review (cobertura spec → tarea)

- Modelo de datos (`IncidenciaEstado`/`IncidenciaTipo`/`Incidencia`, `INCIDENCIA_ESTADOS`, seed de 8 filas, `listIncidencias`/`countByEstado`/`filterByEstado`) → **Task 1**. Cubre "Modelo de datos (espejo Supabase)" y "Helpers" del spec.
- Delta "Badge gana la variante `'violet'`" (spec, sección Arquitectura y Deltas) → **Task 2**, reutilizado en Task 5 sin duplicar el chip "Idea".
- `IncidenciaAvatar` (iniciales por color / silueta gris genérica, `aria-label`) → **Task 3**. Cubre "Componentes #2" y el criterio de aceptación 4 (avatar correcto por fila).
- `IncidenciaStatFilter` (normal / seleccionada / atenuada count=0, badge interno acento vs atenuado, toggle) → **Task 4**. Cubre "Componentes #1" y criterio de aceptación 3.
- `IncidenciaRow` (badge de estado `w-24`, chip Idea condicional, texto truncado, 📎 condicional, `routePath` condicional, guion fijo, avatar, inerte al click) → **Task 5**. Cubre "Componentes #3" y criterios 4 y 7.
- `IncidenciaList` (contenedor `divide-y` + estado vacío "Nada en este estado.") → **Task 6**. Cubre "Componentes #4" y criterio 6.
- `IncidenciasPage` (H2 + subtítulo, 5 stat-cards, toggle exclusivo, filtrado en memoria) + `IncidenciasShell` (patrón `AppLayout` sin tabs) + ruta `/incidencias` + delta "Mis avisos" → `Link` → **Task 7**. Cubre "Componentes #5", "Arquitectura" (ruta y registro), "Interactividad", y los criterios de aceptación 1, 2, 5, 8.
- Criterio de aceptación 9 (suite verde, lint 0, `tsc` limpio, sin `brand-*`, `Badge` reutilizado) → verificado en el gate de Task 7 (Step 5) y en la Verificación final.
- Fuera de alcance del spec (detalle de fila, sub-filtro "solo mis reportes", acciones de responder/asignar/exportar) → deliberadamente no implementado en ninguna tarea; documentado inline en `IncidenciaRow` (comentario del `onClick` no-op) y en Global Constraints.
