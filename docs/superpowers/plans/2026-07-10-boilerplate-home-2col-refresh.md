# Home 2-col refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Recalcar `DashboardPage` para que sea pixel-perfect contra el home actual del live (`bookings.conceptoneagency.com`): fila de dos columnas Novedades+Eventos, badge de fecha calendario, sin chips de estado, tarjeta de novedad compacta.

**Architecture:** Cambios presentacionales en React/Tailwind. Se añade un componente aislado `DateBadge`, se rediseñan `UpcomingEvents` y `NewsCard`, se ajusta el header/tag de `NewsFeed`, y `DashboardPage` recompone el layout envolviendo Novedades+Eventos en un grid de 2 columnas. Sin cambios de datos ni persistencia.

**Tech Stack:** React 19, react-router 7, Tailwind 3, lucide-react, Vitest + Testing Library.

## Global Constraints

- **Todo presentacional, sin persistencia:** nada crea/edita/borra datos; controles inertes.
- **No tocar los tokens de color** `news-card` / `news-border` (ya coinciden visualmente con el live).
- **No adoptar el brand gris del live**: mantener la identidad violeta de nuestra app; usar tokens neutros (`slate-*`) donde el live usa su brand gris.
- Comandos de verificación por tarea: `npm run lint`, `npx tsc --noEmit`, `npm test` (vitest run) deben quedar en verde.
- El dash de `timeRange` es un guión largo `–` (U+2013), no `-`; los splits usan `/[–-]/`.
- Referencias visuales: `docs/references/home-2col-refresh/` (viewport 1440×900, deviceScaleFactor 2).

---

### Task 1: Componente `DateBadge`

**Files:**
- Create: `src/components/ui/DateBadge.tsx`
- Modify: `src/components/ui/index.ts` (añadir export)
- Test: `src/components/ui/DateBadge.test.tsx`

**Interfaces:**
- Produces: `DateBadge({ date }: { date: string }): JSX.Element` y `parseDateBadge(date: string): { day: string; month: string }`, ambos exportados desde `@/components/ui`.
- `parseDateBadge('15 jul 2026')` → `{ day: '15', month: 'JUL' }`.

- [ ] **Step 1: Escribir el test que falla**

Crear `src/components/ui/DateBadge.test.tsx`:

```tsx
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DateBadge, parseDateBadge } from './DateBadge';

describe('parseDateBadge', () => {
  it('splits a "15 jul 2026" date into day and uppercase month', () => {
    expect(parseDateBadge('15 jul 2026')).toEqual({ day: '15', month: 'JUL' });
  });
});

describe('DateBadge', () => {
  it('renders the day and uppercase month', () => {
    render(<DateBadge date="18 jul 2026" />);
    expect(screen.getByText('18')).toBeInTheDocument();
    expect(screen.getByText('JUL')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Ejecutar el test y verlo fallar**

Run: `npx vitest run src/components/ui/DateBadge.test.tsx`
Expected: FAIL — `Failed to resolve import './DateBadge'`.

- [ ] **Step 3: Implementar el componente**

Crear `src/components/ui/DateBadge.tsx`:

```tsx
export function parseDateBadge(date: string): { day: string; month: string } {
  const [day = '', month = ''] = date.trim().split(/\s+/);
  return { day, month: month.toUpperCase() };
}

export interface DateBadgeProps {
  date: string;
}

export function DateBadge({ date }: DateBadgeProps) {
  const { day, month } = parseDateBadge(date);
  return (
    <span className="flex w-12 shrink-0 flex-col items-center overflow-hidden rounded-lg border border-slate-200 bg-white text-center">
      <span className="w-full bg-slate-50 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {month}
      </span>
      <span className="py-1 text-lg font-bold leading-none text-slate-800">{day}</span>
    </span>
  );
}
```

- [ ] **Step 4: Añadir el export al barrel**

En `src/components/ui/index.ts`, añadir al final:

```ts
export * from './DateBadge';
```

- [ ] **Step 5: Ejecutar el test y verlo pasar**

Run: `npx vitest run src/components/ui/DateBadge.test.tsx`
Expected: PASS (3 asserts).

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/DateBadge.tsx src/components/ui/DateBadge.test.tsx src/components/ui/index.ts
git commit -m "feat(home): DateBadge — calendar-style date chip for events"
```

---

### Task 2: Rediseñar `UpcomingEvents`

**Files:**
- Modify: `src/features/dashboard/UpcomingEvents.tsx`
- Test: `src/features/dashboard/UpcomingEvents.test.tsx`

**Interfaces:**
- Consumes: `DateBadge` de `@/components/ui`.
- `UpcomingEvents({ events }: { events: Event[] })` — firma sin cambios.
- `Event` = `{ id; title; date; timeRange; location; status }`.

- [ ] **Step 1: Actualizar el test (debe fallar)**

Reemplazar el contenido de `src/features/dashboard/UpcomingEvents.test.tsx` por:

```tsx
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect } from 'vitest';
import { UpcomingEvents } from './UpcomingEvents';
import type { Event } from '@/types';

const events: Event[] = [
  {
    id: 'event-1',
    title: 'Mixmag Intimate Sessions: BLOND:ISH',
    date: '15 jul 2026',
    timeRange: '20:00–21:30',
    location: 'Soho Farmhouse, Ibiza',
    status: 'confirmed',
  },
  {
    id: 'event-2',
    title: 'Please Quiet x SIGHT',
    date: '18 jul 2026',
    timeRange: '18:00–23:00',
    location: 'Cósmico - SLS Barcelona, Barcelona',
    status: 'in-production',
  },
];

describe('UpcomingEvents', () => {
  it('links each event to its produccion detail', () => {
    render(
      <MemoryRouter>
        <UpcomingEvents events={events} />
      </MemoryRouter>
    );
    const link = screen.getByRole('link', { name: /Mixmag Intimate Sessions/ });
    expect(link).toHaveAttribute('href', '/produccion/event-1');
  });

  it('shows a date badge with month and day, not the raw date', () => {
    render(
      <MemoryRouter>
        <UpcomingEvents events={events} />
      </MemoryRouter>
    );
    expect(screen.getByText('JUL', { selector: 'span' })).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('shows only start time and location in the subtitle (no date, no range, no status chip)', () => {
    render(
      <MemoryRouter>
        <UpcomingEvents events={events} />
      </MemoryRouter>
    );
    expect(screen.getByText('20:00 · Soho Farmhouse, Ibiza')).toBeInTheDocument();
    expect(screen.queryByText(/20:00–21:30/)).not.toBeInTheDocument();
    expect(screen.queryByText('Confirmado')).not.toBeInTheDocument();
    expect(screen.queryByText('En producción')).not.toBeInTheDocument();
  });

  it('has a "Ver todos" link to produccion', () => {
    render(
      <MemoryRouter>
        <UpcomingEvents events={events} />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: 'Ver todos' })).toHaveAttribute('href', '/produccion');
  });
});
```

- [ ] **Step 2: Ejecutar y verlo fallar**

Run: `npx vitest run src/features/dashboard/UpcomingEvents.test.tsx`
Expected: FAIL — el subtítulo aún es `15 jul 2026 · 20:00–21:30 · ...` y sigue habiendo chips de estado.

- [ ] **Step 3: Reescribir el componente**

Reemplazar `src/features/dashboard/UpcomingEvents.tsx` por:

```tsx
import { DateBadge } from '@/components/ui';
import type { Event } from '@/types';
import { Link } from 'react-router';

export interface UpcomingEventsProps {
  events: Event[];
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  return (
    <section className="min-w-0">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Próximos eventos
        </h2>
        <Link to="/produccion" className="shrink-0 text-xs text-brand-600 hover:underline">
          Ver todos
        </Link>
      </div>
      <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {events.map((event) => {
          const start = event.timeRange.split(/[–-]/)[0].trim();
          return (
            <li key={event.id}>
              <Link
                to={`/produccion/${event.id}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50"
              >
                <DateBadge date={event.date} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-slate-800">
                    {event.title}
                  </span>
                  <span className="block truncate text-xs text-slate-400">
                    {start} · {event.location}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
```

- [ ] **Step 4: Ejecutar y verlo pasar**

Run: `npx vitest run src/features/dashboard/UpcomingEvents.test.tsx`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/features/dashboard/UpcomingEvents.tsx src/features/dashboard/UpcomingEvents.test.tsx
git commit -m "feat(home): events column — date badge, no status chips, start-time subtitle"
```

---

### Task 3: Compactar `NewsCard` al live

**Files:**
- Modify: `src/features/dashboard/NewsCard.tsx`
- Test: `src/features/dashboard/NewsCard.test.tsx`

**Interfaces:**
- Consumes: `Button` de `@/components/ui`, iconos `ArrowRight`, `ChevronDown`, `ChevronUp` de `lucide-react`.
- `NewsCard({ item }: { item: NewsItem })` — firma sin cambios. `NewsItem` = `{ id; author; scope; date; title; content?; scheduledFor?; actionLabel? }`.
- Produce un `<li>` (para consumo dentro del `<ul>` de `NewsFeed`, Task 4).

- [ ] **Step 1: Actualizar el test (debe fallar)**

En `src/features/dashboard/NewsCard.test.tsx`, cambiar SOLO la primera aserción del primer test: el título pasa de `font-semibold` a `font-medium`. Y añadir una aserción de que el scope se renderiza como pill. Reemplazar el bloque `describe` por:

```tsx
describe('NewsCard', () => {
  it('renders the title with medium weight and the scope as a pill; hides content when collapsed', () => {
    render(<NewsCard item={item} />);
    expect(screen.getByText(item.title)).toHaveClass('font-medium');
    expect(screen.getByText('Grupo')).toHaveClass('rounded-full');
    expect(screen.queryByText('Detalle completo de la novedad.')).not.toBeInTheDocument();
    expect(screen.queryByText('Editar')).not.toBeInTheDocument();
  });

  it('reveals content and Editar/Eliminar when the chevron is clicked', () => {
    render(<NewsCard item={item} />);
    fireEvent.click(screen.getByRole('button', { name: 'Expandir' }));
    expect(screen.getByText('Detalle completo de la novedad.')).toBeInTheDocument();
    expect(screen.getByText('Editar')).toBeInTheDocument();
    expect(screen.getByText('Eliminar')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Colapsar' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Ejecutar y verlo fallar**

Run: `npx vitest run src/features/dashboard/NewsCard.test.tsx`
Expected: FAIL — el título aún tiene `font-semibold` y "Grupo" es texto plano.

- [ ] **Step 3: Reescribir el componente**

Reemplazar `src/features/dashboard/NewsCard.tsx` por:

```tsx
import { useState } from 'react';
import { Button } from '@/components/ui';
import type { NewsItem } from '@/types';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

export interface NewsCardProps {
  item: NewsItem;
}

export function NewsCard({ item }: NewsCardProps) {
  const [expanded, setExpanded] = useState(false);
  const toggle = () => setExpanded((v) => !v);

  return (
    <li className="overflow-hidden rounded-xl border border-news-border bg-news-card px-4 py-3">
      <div className="mb-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
        <span
          aria-hidden
          className="grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full bg-slate-200 text-[10px] font-medium text-slate-600"
        >
          {item.author.charAt(0)}
        </span>
        <span className="font-medium text-slate-600">{item.author}</span>
        <ArrowRight className="h-3 w-3 text-slate-400" />
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-500">{item.scope}</span>
        <span>·</span>
        <span className="text-slate-400">{item.date}</span>
        {item.scheduledFor && (
          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-brand-700">
            {item.scheduledFor}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          className="min-w-0 flex-1 truncate text-left text-base font-medium text-slate-800"
        >
          {item.title}
        </button>
        <button
          type="button"
          onClick={toggle}
          className="shrink-0 text-slate-300 hover:text-slate-500"
          aria-label={expanded ? 'Colapsar' : 'Expandir'}
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {expanded && item.content && (
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.content}</p>
      )}
      {expanded && (
        <div className="mt-4 flex items-center justify-between">
          <div>
            {item.actionLabel && (
              <Button variant="primary" size="sm">
                {item.actionLabel}
              </Button>
            )}
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <button type="button" className="hover:text-slate-600">
              Editar
            </button>
            <button type="button" className="hover:text-slate-600">
              Eliminar
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
```

- [ ] **Step 4: Ejecutar y verlo pasar**

Run: `npx vitest run src/features/dashboard/NewsCard.test.tsx`
Expected: PASS (2 tests).

Nota: el título ahora es un `<button>`; el primer test usa `screen.getByText(item.title)`, que devuelve el nodo del texto — sigue funcionando. El expandir se dispara con el chevron (`name: 'Expandir'`), que sigue existiendo.

- [ ] **Step 5: Commit**

```bash
git add src/features/dashboard/NewsCard.tsx src/features/dashboard/NewsCard.test.tsx
git commit -m "feat(home): compact NewsCard — inline avatar, scope pill, medium title"
```

---

### Task 4: `NewsFeed` — header unificado y lista `ul`

**Files:**
- Modify: `src/features/dashboard/NewsFeed.tsx`
- Test: `src/features/dashboard/NewsFeed.test.tsx` (sin cambios; se ejecuta para confirmar que sigue en verde)

**Interfaces:**
- Consumes: `NewsCard` (ahora un `<li>`, Task 3), `NewsForm` (sin cambios).
- `NewsFeed({ items }: { items: NewsItem[] })` — firma sin cambios.

- [ ] **Step 1: Modificar el componente**

En `src/features/dashboard/NewsFeed.tsx`: (a) cambiar el `h2` de `text-xs ... tracking-wider` a `text-sm ... tracking-wide`, y (b) cambiar la lista de `<div className="space-y-3">` a `<ul className="space-y-2">`. Resultado:

```tsx
import { useState } from 'react';
import type { NewsItem } from '@/types';
import { NewsCard } from './NewsCard';
import { NewsForm } from './NewsForm';

export interface NewsFeedProps {
  items: NewsItem[];
}

export function NewsFeed({ items }: NewsFeedProps) {
  const [showForm, setShowForm] = useState(false);

  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Novedades
        </h2>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="grid h-5 w-5 place-items-center rounded-full bg-slate-100 text-sm font-medium text-slate-500 hover:bg-brand-50 hover:text-brand-600"
          aria-label="Añadir novedad"
        >
          +
        </button>
      </div>
      {showForm && (
        <div className="mb-3">
          <NewsForm onClose={() => setShowForm(false)} />
        </div>
      )}
      <ul className="space-y-2">
        {items.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 2: Ejecutar los tests de NewsFeed y verlos pasar**

Run: `npx vitest run src/features/dashboard/NewsFeed.test.tsx`
Expected: PASS (2 tests — renderiza una card por ítem; toggle del form).

- [ ] **Step 3: Commit**

```bash
git add src/features/dashboard/NewsFeed.tsx
git commit -m "feat(home): NewsFeed — unified section header + ul list"
```

---

### Task 5: `DashboardPage` — layout de dos columnas

**Files:**
- Modify: `src/features/dashboard/DashboardPage.tsx`

**Interfaces:**
- Consumes: `NewsFeed`, `UpcomingEvents`, `ModuleGrid`, `Reminders`, `AppLayout`, `useDashboard` — todos existentes.

- [ ] **Step 1: Modificar el layout**

En `src/features/dashboard/DashboardPage.tsx`, dentro del `return` principal (bloque `<div className="space-y-8">`): (a) cambiar el `h1` del saludo de `text-slate-900` a `text-slate-800`; (b) reemplazar el `<NewsFeed .../>` suelto y el `<UpcomingEvents .../>` del final por una única fila grid con ambos. El cuerpo queda:

```tsx
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-slate-800">
            {dashboard.greeting} 👋🏼
          </h1>
          {dashboard.birthdayNotice && (
            <p className="mt-1 text-slate-500">{dashboard.birthdayNotice}</p>
          )}
          <p className="mt-1 text-sm text-slate-400">{dashboard.weather}</p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-2">
          <NewsFeed items={dashboard.news} />
          <UpcomingEvents events={dashboard.upcomingEvents} />
        </div>

        <ModuleGrid modules={businessModules} title="Tus espacios" />
        <ModuleGrid modules={internalModules} title="Uso interno" />

        {dashboard.reminders.length > 0 && <Reminders reminders={dashboard.reminders} />}
      </div>
```

(Los imports de `NewsFeed`, `UpcomingEvents`, `ModuleGrid`, `Reminders` ya existen en el fichero; no se añaden ni quitan.)

- [ ] **Step 2: Typecheck + lint + suite completa**

Run: `npx tsc --noEmit && npm run lint && npm test`
Expected: tsc sin errores; lint 0 warnings; vitest todos los tests en verde.

- [ ] **Step 3: Commit**

```bash
git add src/features/dashboard/DashboardPage.tsx
git commit -m "feat(home): two-column Novedades + Próximos Eventos layout"
```

---

### Task 6: Verificación pixel-perfect

**Files:** ninguno (solo verificación; capturas van al scratchpad, no al repo salvo que se quiera actualizar referencias).

- [ ] **Step 1: Levantar el dev server** (si no está)

Run (background): `npm run dev` → sirve en `http://localhost:5173/`.

- [ ] **Step 2: Capturar nuestro home con Playwright**

Usar el chromium de caché (`/home/arian/.npm/_npx/e41f203b7505f1fb/node_modules/playwright`), viewport 1440×900, `deviceScaleFactor: 2`, `fullPage: true`. Si la app pide login, rellenar `test@example.com` / `password` y pulsar "Entrar" (adaptador mock). Guardar en el scratchpad.

- [ ] **Step 3: Comparar contra las referencias**

Contrastar contra `docs/references/home-2col-refresh/live-home-full.png` y confirmar:
- Novedades (izq) + Próximos Eventos (der) en fila de 2 columnas, `gap` 24px, encima de los módulos.
- Cada evento: `DateBadge` (mes + día), título, subtítulo `hora · lugar`, sin chip de estado.
- Tarjeta de novedad compacta (`px-4 py-3`, avatar 18px inline, scope pill, título 16px medium).
- Cabeceras de sección homogéneas (`text-sm`).
- Módulos, saludo y Reminders correctos.

- [ ] **Step 4 (opcional): verificar estado expandido de la novedad**

Comparar el estado expandido de la tarjeta de novedad contra el live (requiere click en el chevron del live con Playwright). Si difiere materialmente, abrir follow-up; no bloquea esta fase.

- [ ] **Step 5: Actualizar la memoria de estado**

Actualizar/crear la memoria de estado del proyecto (ver `MEMORY.md`) anotando: microfase home 2-col completada en `feature/home-2col-refresh`, spec/plan/refs, y la decisión de mantener la rama sin fusionar (patrón de fases previas).

---

## Notas de auto-revisión (cobertura del spec)

- Reflow 2-col → Task 5. Próximos Eventos (badge, sin chips, subtítulo) → Tasks 1+2. NewsCard compacta → Task 3. Cabeceras unificadas → Tasks 2/4 (+ ya OK en módulos). Saludo slate-800 → Task 5. Reminders conservado → Task 5. Verificación pixel-perfect + expandido → Task 6.
- Sin placeholders: todo el código va literal en cada step.
- Consistencia de tipos: `DateBadge`/`parseDateBadge` definidos en Task 1 y consumidos en Task 2 con la misma firma; `NewsCard` produce `<li>` (Task 3) consumido por el `<ul>` de `NewsFeed` (Task 4).
