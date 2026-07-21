# Home v2 — Recalco pixel-perfect (home + TopNav + panel Ayuda) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Recalcar el home del live (hero + grid de espacios agrupado en pills + inbox-zero + novedades), recalcar la TopNav global a colorimetría fiel con dropdown "Espacios", y añadir el panel Ayuda global — todo presentacional con navegación real.

**Architecture:** Refactor sobre lo existente. `constants.ts MODULES` pasa a ser la **única fuente canónica** de los 12 módulos (id, slug, name, icon, category, accent) y la consumen tanto el grid del home como el dropdown. `ModuleGrid` cambia de tarjetas-grid a **pills compactas agrupadas**. `MockRepository.getDashboard` devuelve los módulos desde `MODULES` + festivo/clima/inbox-zero. TopNav y AppLayout se recalcan a fiel; se añade `HelpPanel` global.

**Tech Stack:** React 19 + react-router 7, TypeScript, Tailwind, Vitest + React Testing Library, lucide-react.

## Global Constraints

- **Colorimetría 100% fiel al live**: nada de clases `brand-*` en las superficies que toca esta fase (home, TopNav, HelpPanel). Usar los grises/negros del live.
- **Presentacional (mock) + navegación real**: pills de espacios y dropdown "Espacios" navegan; el resto de controles (Confirmar asistencia, Enviar de Ayuda, +Novedad, Reportar con captura, Mis avisos) inertes.
- **Tokens exactos** medidos en `docs/references/home-v2/` (spec `docs/superpowers/specs/2026-07-21-home-v2-recalco-design.md` §3). No aproximar.
- **Delta intencional**: wordmark propio (no el logo real de Black Moose), restilado a neutro.
- **Gate por tarea**: `npm test` verde, `npm run lint` = 0, `npx tsc --noEmit` limpio antes de commit.
- Iconos: Mixmag/TAGMAG = `Sparkles`; Herramientas = `BarChart3` (paths verificados en `live-home-modules.json`).

---

### Task 1: Tipos + fuente canónica de módulos (12) + iconos

**Files:**
- Modify: `src/types/index.ts:20` (Module.category) y `:51-59` (Dashboard.festivoNotice)
- Modify: `src/lib/constants.ts` (MODULES → 12 canónicos)
- Modify: `src/lib/icons.ts` (añadir mixmag/tagmag/herramientas)
- Modify: `src/components/layout/ModuleSelector.tsx:13` (filtro 'business' → 'workspace', para que compile)
- Test: `src/lib/constants.test.ts` (nuevo)

**Interfaces:**
- Produces: `MODULES: Module[]` (12 entradas) con `category: 'workspace' | 'management' | 'tools'` y `accent` hex. `Module.category` = `'workspace' | 'management' | 'tools'`. `Dashboard.festivoNotice?: string`. `MODULE_ICONS` incluye `mixmag`, `tagmag`, `herramientas`.

- [ ] **Step 1: Escribir el test que falla**

Crear `src/lib/constants.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { MODULES } from './constants';
import { MODULE_ICONS } from './icons';

describe('MODULES (fuente canónica)', () => {
  it('tiene los 12 módulos del live con sus acentos exactos', () => {
    expect(MODULES).toHaveLength(12);
    const bySlug = Object.fromEntries(MODULES.map((m) => [m.slug, m]));
    expect(bySlug.conceptone.accent).toBe('#773C9F');
    expect(bySlug.mixmag.accent).toBe('#E11D48');
    expect(bySlug.tagmag.accent).toBe('#0EA5E9');
    expect(bySlug.crm.accent).toBe('#0D9488');
    expect(bySlug.personal.accent).toBe('#0F172A');
    expect(bySlug.herramientas.accent).toBe('#16834D');
    expect(bySlug.configuracion.accent).toBe('#475569');
  });

  it('agrupa en workspace/management/tools', () => {
    const by = (c: string) => MODULES.filter((m) => m.category === c).map((m) => m.slug);
    expect(by('workspace')).toEqual([
      'conceptone', 'etra', 'produccion', 'euphoric', 'mixmag', 'tagmag', 'creativos', 'cruda',
    ]);
    expect(by('management')).toEqual(['crm', 'personal']);
    expect(by('tools')).toEqual(['herramientas', 'configuracion']);
  });

  it('cada módulo tiene un icono registrado', () => {
    for (const m of MODULES) expect(MODULE_ICONS[m.id]).toBeTruthy();
  });
});
```

- [ ] **Step 2: Ejecutar para verificar que falla**

Run: `npx vitest run src/lib/constants.test.ts`
Expected: FAIL (MODULES tiene 7, no 12; falta `mixmag`/etc.)

- [ ] **Step 3: Actualizar tipos**

En `src/types/index.ts`, reemplazar la línea 20:
```ts
  category: 'workspace' | 'management' | 'tools';
```
Y en la interface `Dashboard` (tras `weather: string;`) añadir:
```ts
  festivoNotice?: string;
```

- [ ] **Step 4: Reescribir `src/lib/constants.ts`**

```ts
import type { Module } from '@/types';

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Intranet';
export const APP_SHORT_NAME = import.meta.env.VITE_APP_SHORT_NAME || 'Intranet';

export const MODULES: Module[] = [
  { id: 'conceptone', slug: 'conceptone', name: 'ConceptOne', icon: 'Headphones', category: 'workspace', accent: '#773C9F',
    shortDescription: 'Gestiona shows y su calculadora, liquidaciones, fichas de artistas, logística y reportes.' },
  { id: 'etra', slug: 'etra', name: 'Etra', icon: 'Megaphone', category: 'workspace', accent: '#2563EB',
    shortDescription: 'Cuentas de PR, acciones del equipo y seeding a influencers.' },
  { id: 'produccion', slug: 'produccion', name: 'Producción', icon: 'Clapperboard', category: 'workspace', accent: '#BE123C',
    shortDescription: 'Base de datos de eventos y producciones: calendario, tareas, responsables y presupuesto.' },
  { id: 'euphoric', slug: 'euphoric', name: 'Euphoric Media', icon: 'Sparkles', category: 'workspace', accent: '#DB2777',
    shortDescription: 'Marketing del grupo: cuentas, campañas y calendario de contenido.' },
  { id: 'mixmag', slug: 'mixmag', name: 'Mixmag', icon: 'Sparkles', category: 'workspace', accent: '#E11D48',
    shortDescription: 'Redacción Mixmag: contenidos, campañas y revistas.' },
  { id: 'tagmag', slug: 'tagmag', name: 'TAGMAG', icon: 'Sparkles', category: 'workspace', accent: '#0EA5E9',
    shortDescription: 'Redacción TAGMAG: contenidos, campañas y revistas.' },
  { id: 'creativos', slug: 'creativos', name: 'Creativos', icon: 'Palette', category: 'workspace', accent: '#7C3AED',
    shortDescription: 'Tablero de piezas del equipo de diseño.' },
  { id: 'cruda', slug: 'cruda', name: 'CRUDA', icon: 'Shirt', category: 'workspace', accent: '#171717',
    shortDescription: 'Catálogo, pedidos y control de stock de ropa y merch.' },
  { id: 'crm', slug: 'crm', name: 'CRM', icon: 'Target', category: 'management', accent: '#0D9488',
    shortDescription: 'Clientes y contactos, pipeline de oportunidades, KPIs comerciales.' },
  { id: 'personal', slug: 'personal', name: 'Team', icon: 'Users', category: 'management', accent: '#0F172A',
    shortDescription: 'Quién es quién, contacto y organigrama del equipo.' },
  { id: 'herramientas', slug: 'herramientas', name: 'Herramientas', icon: 'BarChart3', category: 'tools', accent: '#16834D',
    shortDescription: 'Utilidades transversales del grupo: proyecciones y P&L de eventos.' },
  { id: 'configuracion', slug: 'configuracion', name: 'Configuración', icon: 'Settings', category: 'tools', accent: '#475569',
    shortDescription: 'Plantillas de correo, notificaciones y ajustes generales.' },
];
```

- [ ] **Step 5: Actualizar `src/lib/icons.ts`**

Añadir `BarChart3` al import de lucide-react y estas tres entradas al `MODULE_ICONS`:
```ts
  euphoric: Sparkles,
  mixmag: Sparkles,
  tagmag: Sparkles,
  creativos: Palette,
  cruda: Shirt,
  crm: Target,
  personal: Users,
  herramientas: BarChart3,
  configuracion: Settings,
```
(Import: añadir `BarChart3,` a la lista de `lucide-react`.)

- [ ] **Step 6: Arreglar `ModuleSelector.tsx` para que compile**

En `src/components/layout/ModuleSelector.tsx:13` cambiar:
```ts
      {MODULES.filter((m) => m.category === 'workspace').map((module) => {
```

- [ ] **Step 7: Ejecutar tests + tsc**

Run: `npx vitest run src/lib/constants.test.ts && npx tsc --noEmit`
Expected: PASS + tsc sin errores.

- [ ] **Step 8: Commit**

```bash
git add src/types/index.ts src/lib/constants.ts src/lib/icons.ts src/components/layout/ModuleSelector.tsx src/lib/constants.test.ts
git commit -m "feat(home-v2): fuente canónica de 12 módulos + categorías workspace/management/tools"
```

---

### Task 2: MockRepository.getDashboard → 12 módulos, festivo, clima, inbox-zero

**Files:**
- Modify: `src/repositories/MockRepository.ts:56-186` (getDashboard)
- Test: `src/repositories/MockRepository.test.ts` (añadir casos)

**Interfaces:**
- Consumes: `MODULES` (Task 1).
- Produces: `getDashboard()` devuelve `modules` = los 12 de `MODULES`, `festivoNotice` string, `weather` "Barcelona · 31° / 25°", `reminders: []` (dispara inbox-zero).

- [ ] **Step 1: Escribir el test que falla**

Añadir a `src/repositories/MockRepository.test.ts` (dentro del describe existente o uno nuevo):
```ts
  it('getDashboard devuelve los 12 módulos, festivo y sin recordatorios', async () => {
    const repo = new MockRepository();
    const d = await repo.getDashboard();
    expect(d.modules).toHaveLength(12);
    expect(d.festivoNotice).toMatch(/festivo/i);
    expect(d.weather).toContain('Barcelona');
    expect(d.reminders).toEqual([]);
  });
```
(Si el import de `MockRepository` no está en el fichero, añadir `import { MockRepository } from './MockRepository';`.)

- [ ] **Step 2: Ejecutar para verificar que falla**

Run: `npx vitest run src/repositories/MockRepository.test.ts`
Expected: FAIL (modules tiene 9, no 12; `festivoNotice` undefined).

- [ ] **Step 3: Editar `getDashboard`**

En `src/repositories/MockRepository.ts`, añadir el import al principio del fichero (junto a los demás imports):
```ts
import { MODULES } from '@/lib/constants';
```
Reemplazar el cuerpo del `return this.delay({ … })` de `getDashboard` (líneas 57-186) para que empiece así:
```ts
    return this.delay({
      greeting: 'Hola, Test',
      festivoNotice: 'Faltan 25 días para el próximo festivo (L’Assumpció) 🎉',
      weather: '☁️ Barcelona · 31° / 25°',
      modules: MODULES,
```
Eliminar el array literal de `modules:` (todo el bloque `[ {id:'conceptone'…}, …, {id:'configuracion'…} ]`) y dejar `modules: MODULES,`. Mantener `news`, `upcomingEvents` tal cual y `reminders: []`. Eliminar la línea `birthdayNotice: …`.

- [ ] **Step 4: Ejecutar tests**

Run: `npx vitest run src/repositories/MockRepository.test.ts && npx tsc --noEmit`
Expected: PASS + tsc limpio.

- [ ] **Step 5: Commit**

```bash
git add src/repositories/MockRepository.ts src/repositories/MockRepository.test.ts
git commit -m "feat(home-v2): getDashboard con 12 módulos, festivo, clima Barcelona e inbox-zero"
```

---

### Task 3: ModuleGrid → pills compactas agrupadas

**Files:**
- Modify: `src/features/dashboard/ModuleGrid.tsx` (reescribir render)
- Test: `src/features/dashboard/ModuleGrid.test.tsx` (reescribir)

**Interfaces:**
- Consumes: `Module` (con `accent`, `icon`, `slug`), `MODULE_ICONS`.
- Produces: `<ModuleGrid title={string} modules={Module[]} />` renderiza una `<section>` con etiqueta uppercase + `flex flex-wrap gap-2` de pills `<a href="/{slug}">`. Exporta también `tint(hex, alpha)`.

- [ ] **Step 1: Reescribir el test**

Reemplazar `src/features/dashboard/ModuleGrid.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ModuleGrid } from './ModuleGrid';
import type { Module } from '@/types';

const mods: Module[] = [
  { id: 'conceptone', slug: 'conceptone', name: 'ConceptOne', shortDescription: '', icon: 'Headphones', category: 'workspace', accent: '#773C9F' },
  { id: 'cruda', slug: 'cruda', name: 'CRUDA', shortDescription: '', icon: 'Shirt', category: 'workspace', accent: '#171717' },
];

describe('ModuleGrid', () => {
  it('renderiza la etiqueta del grupo y una pill por módulo con href', () => {
    render(
      <MemoryRouter>
        <ModuleGrid title="Espacios de trabajo" modules={mods} />
      </MemoryRouter>
    );
    expect(screen.getByText('Espacios de trabajo')).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /ConceptOne/ });
    expect(link).toHaveAttribute('href', '/conceptone');
  });

  it('la pill lleva el badge del icono con el acento a 8%', () => {
    const { container } = render(
      <MemoryRouter>
        <ModuleGrid title="X" modules={mods} />
      </MemoryRouter>
    );
    const badge = container.querySelector('span[style*="background-color"]') as HTMLElement;
    expect(badge.getAttribute('style')).toContain('rgba(119, 60, 159, 0.08)');
  });
});
```

- [ ] **Step 2: Ejecutar para verificar que falla**

Run: `npx vitest run src/features/dashboard/ModuleGrid.test.tsx`
Expected: FAIL (aún son tarjetas con descripción; el badge usa 40px, no coincide el assert de link name limpio).

- [ ] **Step 3: Reescribir `ModuleGrid.tsx`**

```tsx
import { MODULE_ICONS } from '@/lib/icons';
import type { Module } from '@/types';
import { Link } from 'react-router';

export interface ModuleGridProps {
  modules: Module[];
  title: string;
}

const DEFAULT_ACCENT = '#64748B';

/** Convert a #rrggbb hex color to an rgba() string at the given alpha. */
export function tint(hex: string, alpha: number): string {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function ModuleGrid({ modules, title }: ModuleGridProps) {
  return (
    <section>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        {title}
      </h2>
      <div className="flex flex-wrap gap-2">
        {modules.map((module) => {
          const Icon = MODULE_ICONS[module.id];
          return (
            <Link
              key={module.id}
              to={`/${module.slug}`}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-700 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50"
            >
              <span
                className="grid h-7 w-7 shrink-0 place-items-center rounded-md"
                style={{ backgroundColor: tint(module.accent ?? DEFAULT_ACCENT, 0.08) }}
              >
                {Icon && (
                  <Icon className="shrink-0 text-slate-500" width={20} height={20} strokeWidth={1.75} aria-hidden="true" />
                )}
              </span>
              {module.name}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Ejecutar tests**

Run: `npx vitest run src/features/dashboard/ModuleGrid.test.tsx && npx tsc --noEmit`
Expected: PASS + tsc limpio.

- [ ] **Step 5: Commit**

```bash
git add src/features/dashboard/ModuleGrid.tsx src/features/dashboard/ModuleGrid.test.tsx
git commit -m "feat(home-v2): ModuleGrid en pills compactas (icono badge accent@8% + nombre)"
```

---

### Task 4: Componente InboxZero

**Files:**
- Create: `src/features/dashboard/InboxZero.tsx`
- Test: `src/features/dashboard/InboxZero.test.tsx`

**Interfaces:**
- Produces: `<InboxZero />` (sin props) renderiza la tarjeta "No te toca nada ahora mismo".

- [ ] **Step 1: Escribir el test que falla**

`src/features/dashboard/InboxZero.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InboxZero } from './InboxZero';

describe('InboxZero', () => {
  it('muestra el estado sin pendientes', () => {
    render(<InboxZero />);
    expect(screen.getByText('No te toca nada ahora mismo')).toBeInTheDocument();
    expect(screen.getByText(/Está todo al día/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Ejecutar para verificar que falla**

Run: `npx vitest run src/features/dashboard/InboxZero.test.tsx`
Expected: FAIL ("Cannot find module './InboxZero'").

- [ ] **Step 3: Crear `InboxZero.tsx`**

```tsx
import { Check } from 'lucide-react';

export function InboxZero() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-6 py-10 text-center">
      <Check className="mx-auto h-6 w-6 text-slate-400" aria-hidden="true" />
      <p className="mt-3 text-sm font-medium text-slate-700">No te toca nada ahora mismo</p>
      <p className="mt-1 text-xs text-slate-400">
        Ni alertas, ni creatividades, ni aprobaciones. Está todo al día.
      </p>
    </div>
  );
}
```

- [ ] **Step 4: Ejecutar tests**

Run: `npx vitest run src/features/dashboard/InboxZero.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/dashboard/InboxZero.tsx src/features/dashboard/InboxZero.test.tsx
git commit -m "feat(home-v2): tarjeta inbox-zero 'No te toca nada ahora mismo'"
```

---

### Task 5: NewsCard/NewsFeed restyle a fiel

**Files:**
- Modify: `src/features/dashboard/NewsCard.tsx`
- Modify: `src/features/dashboard/NewsFeed.tsx:16,22` (labels/hover a slate)
- Test: `src/features/dashboard/NewsCard.test.tsx` (ajustar), `NewsFeed.test.tsx` (si asertaba brand)

**Interfaces:**
- Consumes: `NewsItem`.
- Produces: `NewsCard` con card blanca `border-slate-200`, chip `scheduledFor` en slate, y botón `actionLabel` (p.ej. "Confirmar Asistencia") **visible en la fila colapsada**, estilo `bg-slate-800 text-white`.

- [ ] **Step 1: Ajustar el test**

En `src/features/dashboard/NewsCard.test.tsx`, asegurar (añadir o ajustar) un caso:
```tsx
  it('muestra el botón de acción en la fila (colapsada) sin acentos brand', () => {
    render(<NewsCard item={{ id: '1', author: 'Carlos Pego', scope: 'Grupo', date: '20 jul 2026', title: 'Black Moose Summer Lunch', actionLabel: 'Confirmar Asistencia' }} />);
    const btn = screen.getByRole('button', { name: 'Confirmar Asistencia' });
    expect(btn.className).not.toMatch(/brand/);
  });
```
(Ajustar imports `render, screen` de `@testing-library/react` si faltan.)

- [ ] **Step 2: Ejecutar para verificar que falla**

Run: `npx vitest run src/features/dashboard/NewsCard.test.tsx`
Expected: FAIL (el botón solo aparece expandido y usa Button brand).

- [ ] **Step 3: Editar `NewsCard.tsx`**

Cambiar el `<li>` raíz (línea 15) a card neutra:
```tsx
    <li className="overflow-hidden rounded-xl border border-slate-200 bg-white px-4 py-3">
```
Cambiar el chip `scheduledFor` (líneas 28-32) a slate:
```tsx
        {item.scheduledFor && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-500">
            {item.scheduledFor}
          </span>
        )}
```
Reemplazar el bloque de la fila del título (líneas 35-53) para incluir el botón de acción inline antes del chevron:
```tsx
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          aria-expanded={expanded}
          className="min-w-0 flex-1 truncate text-left text-base font-medium text-slate-800"
        >
          {item.title}
        </button>
        {item.actionLabel && (
          <button
            type="button"
            className="hidden shrink-0 rounded-lg bg-slate-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-900 sm:inline-flex"
          >
            {item.actionLabel}
          </button>
        )}
        <button
          type="button"
          onClick={toggle}
          aria-expanded={expanded}
          className="shrink-0 text-slate-300 hover:text-slate-500"
          aria-label={expanded ? 'Colapsar' : 'Expandir'}
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>
```
Eliminar el bloque expandido que repetía el `Button` de acción (líneas 58-66 del `Button variant="primary"`), dejando solo Editar/Eliminar en el pie expandido. Quitar el import de `Button` si queda sin usar.

- [ ] **Step 4: Editar `NewsFeed.tsx`**

Cambiar el `+` (líneas 22): quitar `hover:bg-brand-50 hover:text-brand-600` → `hover:bg-slate-200 hover:text-slate-700`. La etiqueta "Novedades" (línea 16) ya es slate; mantener.

- [ ] **Step 5: Ejecutar tests**

Run: `npx vitest run src/features/dashboard/NewsCard.test.tsx src/features/dashboard/NewsFeed.test.tsx && npx tsc --noEmit`
Expected: PASS + tsc limpio. (Si `NewsFeed.test.tsx` asertaba clases brand, actualizarlo a slate.)

- [ ] **Step 6: Commit**

```bash
git add src/features/dashboard/NewsCard.tsx src/features/dashboard/NewsFeed.tsx src/features/dashboard/NewsCard.test.tsx src/features/dashboard/NewsFeed.test.tsx
git commit -m "feat(home-v2): novedades a colorimetría fiel (card slate, botón acción inline slate-800)"
```

---

### Task 6: DashboardPage — hero + grid agrupado + inbox-zero + novedades

**Files:**
- Modify: `src/features/dashboard/DashboardPage.tsx`
- Test: `src/features/dashboard/DashboardPage.test.tsx` (nuevo)

**Interfaces:**
- Consumes: `useDashboard`, `ModuleGrid`, `InboxZero`, `NewsFeed`, `Reminders`.
- Produces: home con hero (greeting+festivo+clima), 3 grupos (workspace en fila propia; management+tools lado a lado), inbox-zero (si `reminders` vacío) y novedades.

- [ ] **Step 1: Escribir el test que falla**

`src/features/dashboard/DashboardPage.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { RepositoryProvider, MockRepository } from '@/repositories';
import { DashboardPage } from './DashboardPage';

function renderHome() {
  return render(
    <RepositoryProvider repository={new MockRepository()}>
      <MemoryRouter><DashboardPage /></MemoryRouter>
    </RepositoryProvider>
  );
}

describe('DashboardPage (home v2)', () => {
  it('muestra hero con festivo y clima, los 3 grupos, inbox-zero y novedades', async () => {
    renderHome();
    expect(await screen.findByRole('heading', { name: /Hola, Test/ })).toBeInTheDocument();
    expect(screen.getByText(/festivo/i)).toBeInTheDocument();
    expect(screen.getByText(/Barcelona/)).toBeInTheDocument();
    expect(screen.getByText('Espacios de trabajo')).toBeInTheDocument();
    expect(screen.getByText('Gestión interna')).toBeInTheDocument();
    expect(screen.getByText('Herramientas y ajustes')).toBeInTheDocument();
    expect(screen.getByText('No te toca nada ahora mismo')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Mixmag/ })).toHaveAttribute('href', '/mixmag');
  });
});
```

- [ ] **Step 2: Ejecutar para verificar que falla**

Run: `npx vitest run src/features/dashboard/DashboardPage.test.tsx`
Expected: FAIL (aún usa business/internal + 2-col + birthdayNotice).

- [ ] **Step 3: Reescribir el cuerpo de `DashboardPage.tsx`**

Reemplazar desde la línea `const businessModules …` hasta el cierre del `return`:
```tsx
  const workspace = dashboard.modules.filter((m) => m.category === 'workspace');
  const management = dashboard.modules.filter((m) => m.category === 'management');
  const tools = dashboard.modules.filter((m) => m.category === 'tools');
  const displayName = dashboard.greeting.replace(/^Hola,\s*/, '');

  return (
    <AppLayout user={{ id: '1', email: 'test@example.com', name: displayName, role: 'Admin' }}>
      <div className="space-y-8">
        <div className="mt-2 mb-6 text-center">
          <h1 className="text-3xl font-semibold text-slate-800">{dashboard.greeting} 👋🏼</h1>
          {dashboard.festivoNotice && (
            <p className="mt-1 text-sm text-slate-500">{dashboard.festivoNotice}</p>
          )}
          <p className="mt-1 text-xs text-slate-400">{dashboard.weather}</p>
        </div>

        <div className="space-y-6">
          <ModuleGrid title="Espacios de trabajo" modules={workspace} />
          <div className="flex flex-wrap gap-x-12 gap-y-6">
            <ModuleGrid title="Gestión interna" modules={management} />
            <ModuleGrid title="Herramientas y ajustes" modules={tools} />
          </div>
        </div>

        {dashboard.reminders.length > 0 ? (
          <Reminders reminders={dashboard.reminders} />
        ) : (
          <InboxZero />
        )}

        <div className="max-w-2xl">
          <NewsFeed items={dashboard.news} />
        </div>
      </div>
    </AppLayout>
  );
```
Ajustar imports en la cabecera del fichero: quitar `UpcomingEvents` (queda sin uso); **mantener `Card`** (lo siguen usando las ramas de loading/error); añadir `import { InboxZero } from './InboxZero';`. Mantener `ModuleGrid`, `NewsFeed`, `Reminders`.

- [ ] **Step 4: Ejecutar tests**

Run: `npx vitest run src/features/dashboard/DashboardPage.test.tsx && npx tsc --noEmit`
Expected: PASS + tsc limpio.

- [ ] **Step 5: Commit**

```bash
git add src/features/dashboard/DashboardPage.tsx src/features/dashboard/DashboardPage.test.tsx
git commit -m "feat(home-v2): home reensamblado (hero festivo+clima, 3 grupos, inbox-zero, novedades)"
```

---

### Task 7: EspaciosDropdown (dropdown de módulos)

**Files:**
- Create: `src/components/layout/EspaciosDropdown.tsx`
- Modify: `src/components/layout/index.ts` (export)
- Test: `src/components/layout/EspaciosDropdown.test.tsx`

**Interfaces:**
- Consumes: `MODULES`, `MODULE_ICONS`.
- Produces: `<EspaciosDropdown />` — botón "Espacios" que abre/cierra un menú con los 12 módulos como enlaces.

- [ ] **Step 1: Escribir el test que falla**

`src/components/layout/EspaciosDropdown.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { EspaciosDropdown } from './EspaciosDropdown';

describe('EspaciosDropdown', () => {
  it('abre el menú y lista los 12 módulos con enlaces', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><EspaciosDropdown /></MemoryRouter>);
    expect(screen.queryByRole('link', { name: /ConceptOne/ })).toBeNull();
    await user.click(screen.getByRole('button', { name: /Espacios/ }));
    expect(screen.getByRole('link', { name: /ConceptOne/ })).toHaveAttribute('href', '/conceptone');
    expect(screen.getAllByRole('link')).toHaveLength(12);
  });
});
```

- [ ] **Step 2: Ejecutar para verificar que falla**

Run: `npx vitest run src/components/layout/EspaciosDropdown.test.tsx`
Expected: FAIL ("Cannot find module './EspaciosDropdown'").

- [ ] **Step 3: Crear `EspaciosDropdown.tsx`**

```tsx
import { useState } from 'react';
import { Link } from 'react-router';
import { ChevronDown } from 'lucide-react';
import { MODULES } from '@/lib/constants';
import { MODULE_ICONS } from '@/lib/icons';

export function EspaciosDropdown() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      >
        Espacios
        <ChevronDown className="h-3.5 w-3.5 opacity-70" aria-hidden="true" />
      </button>
      {open && (
        <>
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 z-20 mt-1 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
            {MODULES.map((m) => {
              const Icon = MODULE_ICONS[m.id];
              return (
                <Link
                  key={m.id}
                  to={`/${m.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  {Icon && <Icon className="h-4 w-4 text-slate-500" aria-hidden="true" />}
                  {m.name}
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Exportar en `index.ts`**

Añadir a `src/components/layout/index.ts`:
```ts
export * from './EspaciosDropdown';
```

- [ ] **Step 5: Ejecutar tests**

Run: `npx vitest run src/components/layout/EspaciosDropdown.test.tsx && npx tsc --noEmit`
Expected: PASS + tsc limpio.

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/EspaciosDropdown.tsx src/components/layout/index.ts src/components/layout/EspaciosDropdown.test.tsx
git commit -m "feat(home-v2): dropdown Espacios (12 módulos navegables) en la TopNav"
```

---

### Task 8: TopNav recalco a fiel + AppLayout max-w-7xl

**Files:**
- Modify: `src/components/layout/TopNav.tsx`
- Modify: `src/components/layout/AppLayout.tsx`
- Test: `src/components/layout/TopNav.test.tsx` (ajustar)

**Interfaces:**
- Consumes: `EspaciosDropdown` (Task 7), `MODULE_ICONS`.
- Produces: TopNav con logo neutro + dropdown "Espacios" + maletín/campana(9+)/usuario, sin clases `brand-*`. Badge muestra "9+" cuando `notificationCount > 9`.

- [ ] **Step 1: Ajustar el test**

En `src/components/layout/TopNav.test.tsx` añadir/ajustar:
```tsx
  it('muestra el dropdown Espacios y el badge 9+ sin acentos brand', () => {
    const { container } = render(
      <MemoryRouter>
        <TopNav user={{ id: '1', email: 'a@b.c', name: 'Test', role: 'Admin' }} notificationCount={12} />
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: /Espacios/ })).toBeInTheDocument();
    expect(screen.getByText('9+')).toBeInTheDocument();
    expect(container.innerHTML).not.toMatch(/brand-/);
  });
```
(Asegurar imports `MemoryRouter`, `render`, `screen`.)

- [ ] **Step 2: Ejecutar para verificar que falla**

Run: `npx vitest run src/components/layout/TopNav.test.tsx`
Expected: FAIL (no hay dropdown; logo usa `bg-brand-600`; badge muestra el número crudo).

- [ ] **Step 3: Editar `TopNav.tsx`**

- Import: añadir `import { EspaciosDropdown } from './EspaciosDropdown';`
- Header (línea 25): `border-slate-100 bg-white/80 backdrop-blur-sm` → `border-slate-200 bg-white/90 backdrop-blur`; `z-30` → `z-20`.
- Contenedor (línea 26): `max-w-[1248px] … justify-between … xl:px-0` → `max-w-7xl … gap-4 px-4` (quitar `justify-between`, se usará `ml-auto` en el cluster derecho).
- Logo (líneas 28-33): sustituir el cuadro brand por neutro:
```tsx
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-sm font-bold text-white">
              {APP_NAME.charAt(0)}
            </div>
            <span className="text-lg font-semibold text-slate-900">{APP_NAME}</span>
          </Link>
          <span className="hidden items-center gap-2 sm:flex">
            <span className="text-slate-300">/</span>
            <EspaciosDropdown />
          </span>
```
- Pestañas de módulo activo (líneas 45-61): cambiar el estado activo `bg-brand-50 text-brand-700` → `bg-slate-100 text-slate-900`.
- Botón de acción del módulo (líneas 68-73): `bg-brand-600 … shadow-brand-600/20 hover:bg-brand-700` → `bg-slate-800 hover:bg-slate-900` (quitar la sombra brand).
- iconActions activos (línea 83): `bg-brand-50 text-brand-700` → `bg-slate-100 text-slate-800`.
- Cluster derecho: envolver el bloque de acciones (maletín + campana + UserMenu) en un contenedor con `ml-auto`. Cambiar la línea 66 `<div className="flex items-center gap-4">` → `<div className="ml-auto flex items-center gap-3">`.
- Badge de notificaciones (líneas 103-107): mostrar "9+" con cap:
```tsx
            {notificationCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
```

- [ ] **Step 4: Editar `AppLayout.tsx`**

```tsx
import { TopNav } from './TopNav';
import { HelpPanel } from './HelpPanel';
import type { ModuleHeader } from './TopNav';
import type { User } from '@/types';

export interface AppLayoutProps {
  user: User;
  children: React.ReactNode;
  module?: ModuleHeader;
}

export function AppLayout({ user, children, module }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <TopNav user={user} notificationCount={12} module={module} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">{children}</main>
      <HelpPanel />
    </div>
  );
}
```
(El import de `HelpPanel` se resuelve en Task 9; si se ejecuta Task 8 antes que 9, crear primero el archivo de Task 9 o reordenar. **Recomendado: ejecutar Task 9 antes que el Step 4 de Task 8**, o dejar el import comentado hasta Task 9.)

- [ ] **Step 5: Ejecutar tests**

Run: `npx vitest run src/components/layout/TopNav.test.tsx && npx tsc --noEmit`
Expected: PASS + tsc limpio.

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/TopNav.tsx src/components/layout/AppLayout.tsx src/components/layout/TopNav.test.tsx
git commit -m "feat(home-v2): TopNav a colorimetría fiel + dropdown Espacios + badge 9+; max-w-7xl"
```

---

### Task 9: Panel Ayuda global (HelpPanel)

**Files:**
- Create: `src/components/layout/HelpPanel.tsx`
- Modify: `src/components/layout/index.ts` (export)
- Test: `src/components/layout/HelpPanel.test.tsx`

> **Nota de orden:** ejecutar esta tarea **antes** del Step 4 de Task 8 (AppLayout importa `HelpPanel`).

**Interfaces:**
- Produces: `<HelpPanel />` — panel fijo abajo-izquierda, colapsable; "Enviar" inerte.

- [ ] **Step 1: Escribir el test que falla**

`src/components/layout/HelpPanel.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HelpPanel } from './HelpPanel';

describe('HelpPanel', () => {
  it('renderiza el panel con Enviar, Reportar con captura y Mis avisos', () => {
    render(<HelpPanel />);
    expect(screen.getByText('Ayuda')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Enviar' })).toBeInTheDocument();
    expect(screen.getByText('Reportar con captura')).toBeInTheDocument();
    expect(screen.getByText('Mis avisos')).toBeInTheDocument();
  });

  it('se colapsa al pulsar cerrar', async () => {
    const user = userEvent.setup();
    render(<HelpPanel />);
    await user.click(screen.getByRole('button', { name: /Cerrar ayuda/ }));
    expect(screen.queryByRole('button', { name: 'Enviar' })).toBeNull();
  });
});
```

- [ ] **Step 2: Ejecutar para verificar que falla**

Run: `npx vitest run src/components/layout/HelpPanel.test.tsx`
Expected: FAIL ("Cannot find module './HelpPanel'").

- [ ] **Step 3: Crear `HelpPanel.tsx`**

```tsx
import { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';

export function HelpPanel() {
  const [open, setOpen] = useState(true);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-30 grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-lg hover:text-slate-800"
        aria-label="Abrir ayuda"
      >
        <HelpCircle className="h-5 w-5" />
      </button>
    );
  }

  return (
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
        <button type="button" className="hover:text-slate-600">Reportar con captura</button>
        <button type="button" className="hover:text-slate-600">Mis avisos</button>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Exportar en `index.ts`**

Añadir a `src/components/layout/index.ts`:
```ts
export * from './HelpPanel';
```

- [ ] **Step 5: Ejecutar tests**

Run: `npx vitest run src/components/layout/HelpPanel.test.tsx && npx tsc --noEmit`
Expected: PASS + tsc limpio.

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/HelpPanel.tsx src/components/layout/index.ts src/components/layout/HelpPanel.test.tsx
git commit -m "feat(home-v2): panel Ayuda global (fijo abajo-izquierda, colapsable, inerte)"
```

---

### Task 10: Stubs de ruta Mixmag / TAGMAG / Herramientas

**Files:**
- Create: `src/features/modules/MixmagShell.tsx`, `TagmagShell.tsx`, `HerramientasShell.tsx`
- Modify: `src/app/router.tsx`
- Test: `src/app/router.test.tsx` (o test de navegación) — ver Step 1

**Interfaces:**
- Consumes: `ModuleShell`.
- Produces: rutas `/mixmag`, `/tagmag`, `/herramientas` que renderizan un shell placeholder navegable.

- [ ] **Step 1: Escribir el test que falla**

Crear `src/features/modules/NewModuleShells.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { MixmagShell } from './MixmagShell';
import { TagmagShell } from './TagmagShell';
import { HerramientasShell } from './HerramientasShell';

describe('Nuevos shells stub', () => {
  it.each([
    [MixmagShell, 'Mixmag'],
    [TagmagShell, 'TAGMAG'],
    [HerramientasShell, 'Herramientas'],
  ])('%s renderiza su título', (Shell, title) => {
    render(<MemoryRouter><Shell /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Ejecutar para verificar que falla**

Run: `npx vitest run src/features/modules/NewModuleShells.test.tsx`
Expected: FAIL ("Cannot find module './MixmagShell'").

- [ ] **Step 3: Crear los 3 shells**

`src/features/modules/MixmagShell.tsx`:
```tsx
import { ModuleShell } from './ModuleShell';

export function MixmagShell() {
  return (
    <ModuleShell
      title="Mixmag"
      description="Redacción Mixmag: contenidos, campañas y revistas."
      tabs={['Resumen', 'Contenidos', 'Campañas', 'Revistas']}
    />
  );
}
```
`src/features/modules/TagmagShell.tsx`:
```tsx
import { ModuleShell } from './ModuleShell';

export function TagmagShell() {
  return (
    <ModuleShell
      title="TAGMAG"
      description="Redacción TAGMAG: contenidos, campañas y revistas."
      tabs={['Resumen', 'Contenidos', 'Campañas', 'Revistas']}
    />
  );
}
```
`src/features/modules/HerramientasShell.tsx`:
```tsx
import { ModuleShell } from './ModuleShell';

export function HerramientasShell() {
  return (
    <ModuleShell
      title="Herramientas"
      description="Utilidades transversales del grupo: proyecciones y P&L de eventos."
      tabs={['Herramientas', 'Proyecciones']}
    />
  );
}
```

- [ ] **Step 4: Registrar las rutas en `router.tsx`**

Añadir los imports (junto a los demás Shell) y las rutas (junto a `/personal`, `/configuracion`, `/mi-trabajo`):
```tsx
import { MixmagShell } from '@/features/modules/MixmagShell';
import { TagmagShell } from '@/features/modules/TagmagShell';
import { HerramientasShell } from '@/features/modules/HerramientasShell';
```
```tsx
      <Route path="/mixmag" element={<MixmagShell />} />
      <Route path="/tagmag" element={<TagmagShell />} />
      <Route path="/herramientas" element={<HerramientasShell />} />
```

- [ ] **Step 5: Ejecutar tests**

Run: `npx vitest run src/features/modules/NewModuleShells.test.tsx && npx tsc --noEmit`
Expected: PASS + tsc limpio.

- [ ] **Step 6: Commit**

```bash
git add src/features/modules/MixmagShell.tsx src/features/modules/TagmagShell.tsx src/features/modules/HerramientasShell.tsx src/app/router.tsx src/features/modules/NewModuleShells.test.tsx
git commit -m "feat(home-v2): stubs navegables /mixmag /tagmag /herramientas"
```

---

### Task 11: Verificación final (suite completa + Playwright ours↔live)

**Files:**
- (Sin cambios de código salvo fixes que surjan.)

- [ ] **Step 1: Suite completa + lint + tsc**

Run: `npm test -- --run && npm run lint && npx tsc --noEmit`
Expected: todos verdes, lint 0, tsc limpio. Si algo falla, arreglar y commit `fix(home-v2): …`.

- [ ] **Step 2: Levantar dev y capturar nuestro home**

Run (fondo): `npm run dev` y con Playwright (patrón de `docs/references/home-v2/scan-*.mjs`) navegar a `http://localhost:5173/`, screenshot `docs/references/home-v2/ours-home.png`.

- [ ] **Step 3: Comparar contra el live**

Abrir `docs/references/home-v2/live-home.png` y `ours-home.png` lado a lado. Checklist pixel-perfect:
  - Hero: h1 30px/600 slate-800; festivo `text-sm` slate-500; clima `text-xs` slate-400; centrado.
  - Pills: `rounded-lg border-slate-200 bg-white px-2.5 py-1.5`, badge 28px accent@8%, icono 20px slate-500; grupos con etiqueta uppercase slate-400; workspace en fila propia, management+tools lado a lado.
  - Inbox-zero: card blanca `rounded-xl border-slate-200 py-10`, ✓ + textos slate-700/slate-400.
  - TopNav: `h-14 max-w-7xl bg-white/90 backdrop-blur border-slate-200`, dropdown Espacios, badge rojo "9+", sin violeta.
  - Panel Ayuda abajo-izquierda.
  Anotar cualquier desviación y corregir (commit `fix(home-v2): ajuste pixel-perfect …`).

- [ ] **Step 4: Commit de capturas**

```bash
git add docs/references/home-v2/ours-home.png
git commit -m "test(home-v2): captura ours para verificación pixel-perfect"
```

---

## Notas de ejecución
- El ModuleSelector queda sin uso real (solo re-exportado); se mantiene compilando con el filtro `'workspace'`. Si se prefiere, borrarlo en Task 1 (y su export) en vez de arreglarlo — decisión del ejecutor.
- Si `NewsFeed.test.tsx`/`NewsCard.test.tsx` existentes asertan clases `brand-*` o el layout viejo, actualizarlos en Task 5 al nuevo estilo.
- Orden recomendado: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 9 → 8 → 10 → 11 (Task 9 antes del Step 4 de Task 8 por el import de HelpPanel).
