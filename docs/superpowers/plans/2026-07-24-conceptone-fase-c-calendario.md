# ConceptOne Recalco · Fase C (Calendario) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir `/calendario-c1` como el live: grid mensual de shows y holds + agenda por día, con navegación de mes, sobre un modelo `CalendarEvent` propio sembrado con los 16 eventos reales (Jul/Ago/Sept 2026).

**Architecture:** Nuevo tipo `CalendarEvent` en `@/types`; seed + helpers en `src/features/booking/data/calendar.ts`; componentes `MonthNav`/`MonthGrid`/`DayAgenda`/`AgendaShowCard`/`AgendaHoldCard`; `CalendarioPage` reemplaza a `CalendarioStubPage`. Holds y "+ Hold" inertes (mock). Datos en memoria, independientes de `Show` (spec D1).

**Tech Stack:** React 19, react-router 7, Tailwind, Vitest + RTL + jest-dom, TypeScript.

## Global Constraints

- Es-ES; encabezados de agenda con `toLocaleDateString('es-ES', { weekday:'long', day:'numeric', month:'long' })` → "miércoles, 15 de julio". Un commit por tarea; cada tarea verde: `npx vitest run`, `npx tsc --noEmit`, `npm run lint` (0 warnings).
- Fuente de verdad: spec `docs/superpowers/specs/2026-07-24-conceptone-fase-c-calendario-design.md` + capturas `scratchpad/recon-conceptone/` (`c1-calendario.png`, `c1-cal-agosto.png`, `c1-cal-septiembre.png`).
- **Seed = los 16 eventos del §3 de la spec, EXACTOS** (incl. grafías literales "Marmarela"/"Mamarela"; Brenda Serna 4-sept con venue/city null; Bizza 15-jul). Datos = evidencia (spec D4), no inferir.
- **CalendarEvent es seed propio** (spec D1): NO tocar `Show`/`getShows()` ni el dashboard. **Holds y "+ Hold" inertes** (spec D2). **Default julio 2026**; meses sin datos → estado vacío (spec D3).
- Semana empieza en **lunes** (LU MA MI JU VI SÁ DO). Reusar `@/components/ui` + helper `etapaLabel` de Fase B para el badge del hold.

---

### Task 1: Modelo `CalendarEvent` + seed de 16 eventos + helper de mes

**Files:**
- Modify: `src/types/index.ts` (añadir `CalendarEventType` + `CalendarEvent`)
- Create: `src/features/booking/data/calendar.ts` + `calendar.test.ts`

**Interfaces:**
- Produces: `CalendarEvent`, `calendarEvents: CalendarEvent[]` (16), `eventsForMonth(year: number, month: number): CalendarEvent[]` (month 0-indexed), `eventsForDay(dateISO: string): CalendarEvent[]`.

- [ ] **Step 1: Añadir el tipo en `src/types/index.ts`** (reutiliza `PaymentStatus` y `ShowStatus` ya existentes):
```ts
export type CalendarEventType = 'show' | 'hold';
export interface CalendarEvent {
  id: string;
  date: string;                  // 'YYYY-MM-DD'
  type: CalendarEventType;
  artist: string;
  venue?: string | null;
  city?: string | null;
  event?: string;
  paymentStatus?: PaymentStatus;
  holdTitle?: string;
  etapa?: ShowStatus;
}
```

- [ ] **Step 2: Escribir `calendar.test.ts` (fallará)**
```ts
import { describe, it, expect } from 'vitest';
import { calendarEvents, eventsForMonth, eventsForDay } from './calendar';

describe('calendar seed (evidencia del live Jul-Sept 2026)', () => {
  it('tiene 16 eventos: 15 shows + 1 hold', () => {
    expect(calendarEvents).toHaveLength(16);
    expect(calendarEvents.filter((e) => e.type === 'hold')).toHaveLength(1);
  });
  it('el hold es Test Artist / Dentista / etapa confirmed el 2026-07-23', () => {
    const hold = calendarEvents.find((e) => e.type === 'hold')!;
    expect(hold).toMatchObject({ date: '2026-07-23', artist: 'Test Artist', holdTitle: 'Dentista', etapa: 'confirmed' });
  });
  it('conserva las grafías literales del live (Marmarela/Mamarela)', () => {
    const e = calendarEvents.find((x) => x.date === '2026-08-02')!;
    expect(e).toMatchObject({ venue: 'Marmarela', event: 'Mamarela', city: 'Alicante' });
  });
  it('Brenda Serna 4-sept sin venue/ciudad', () => {
    const e = calendarEvents.find((x) => x.date === '2026-09-04')!;
    expect(e).toMatchObject({ artist: 'Brenda Serna', venue: null, city: null, event: 'Alcazar de San Juan', paymentStatus: 'Parcialmente abonado' });
  });
  it('eventsForMonth(2026, 6) [julio] devuelve 8 eventos', () => {
    expect(eventsForMonth(2026, 6)).toHaveLength(8);
  });
  it('eventsForMonth(2026, 5) [junio] está vacío', () => {
    expect(eventsForMonth(2026, 5)).toHaveLength(0);
  });
  it('eventsForDay agrupa el 18-jul (2 shows) y el 26-jul (2 shows)', () => {
    expect(eventsForDay('2026-07-18')).toHaveLength(2);
    expect(eventsForDay('2026-07-26')).toHaveLength(2);
  });
});
```

- [ ] **Step 3: Ejecutar → falla.** Run: `npx vitest run src/features/booking/data/calendar.test.ts` → FAIL (no existe).

- [ ] **Step 4: Implementar `src/features/booking/data/calendar.ts`** con los 16 eventos (copiar EXACTO de spec §3):
```ts
import type { CalendarEvent } from '@/types';

export const calendarEvents: CalendarEvent[] = [
  // Julio 2026
  { id: 'ce-01', date: '2026-07-15', type: 'show', artist: 'Bizza', venue: 'Hï', city: 'Illes Balears', event: 'Paradise - Bunker', paymentStatus: 'No abonado' },
  { id: 'ce-02', date: '2026-07-18', type: 'show', artist: 'Los Canarios', venue: 'Edén Ibiza', city: 'Sant Antoni de Portmany', event: 'FUEGO', paymentStatus: 'No abonado' },
  { id: 'ce-03', date: '2026-07-18', type: 'show', artist: 'Abdon', venue: 'Bassment', city: 'Madrid', event: 'FUNDAYS', paymentStatus: 'No abonado' },
  { id: 'ce-04', date: '2026-07-21', type: 'show', artist: 'Test Artist', venue: 'Ku Barcelona', city: 'Barcelona', event: 'SIGHT', paymentStatus: 'No abonado' },
  { id: 'ce-05', date: '2026-07-23', type: 'hold', artist: 'Test Artist', holdTitle: 'Dentista', etapa: 'confirmed' },
  { id: 'ce-06', date: '2026-07-25', type: 'show', artist: 'Florentia', venue: 'Paseo de Santiago, Torreperogil', city: 'Torreperogil', event: 'Summer Opening Festival', paymentStatus: 'Liquidado' },
  { id: 'ce-07', date: '2026-07-26', type: 'show', artist: 'Abdon', venue: 'Ku Barcelona', city: 'Barcelona', event: 'SIGHT', paymentStatus: 'No abonado' },
  { id: 'ce-08', date: '2026-07-26', type: 'show', artist: 'Pau Guilera', venue: 'Marina Beach Club', city: 'Valencia', event: 'the next', paymentStatus: 'No abonado' },
  // Agosto 2026
  { id: 'ce-09', date: '2026-08-01', type: 'show', artist: 'Milan', venue: 'Casa del Mar', city: 'Isla Santa Catalina', event: 'Casa del Mar', paymentStatus: 'No abonado' },
  { id: 'ce-10', date: '2026-08-01', type: 'show', artist: 'Los Canarios', venue: 'Hangar 37', city: 'San Bartolomé de Tirajana', event: 'Solart Fest', paymentStatus: 'No abonado' },
  { id: 'ce-11', date: '2026-08-02', type: 'show', artist: 'Los Canarios', venue: 'Marmarela', city: 'Alicante', event: 'Mamarela', paymentStatus: 'No abonado' },
  // Septiembre 2026
  { id: 'ce-12', date: '2026-09-04', type: 'show', artist: 'Brenda Serna', venue: null, city: null, event: 'Alcazar de San Juan', paymentStatus: 'Parcialmente abonado' },
  { id: 'ce-13', date: '2026-09-18', type: 'show', artist: 'Sergio Saffe', venue: 'el Tebo', city: 'Valparaiso', event: 'el Tebo', paymentStatus: 'No abonado' },
  { id: 'ce-14', date: '2026-09-25', type: 'show', artist: 'Marian Ariss', venue: 'La Fábrica', city: 'Cordoba', event: 'Kevin de Vries Cordoba', paymentStatus: 'No abonado' },
  { id: 'ce-15', date: '2026-09-26', type: 'show', artist: 'ART NO LOGIA', venue: 'Boho Beer Garden', city: 'Birmingham', event: 'Jiwa', paymentStatus: 'No abonado' },
  { id: 'ce-16', date: '2026-09-26', type: 'show', artist: 'Marian Ariss', venue: 'Mandarine Park', city: 'Buenos Aires', event: 'Kevin de Vries Buenos Aires', paymentStatus: 'No abonado' },
];

/** month 0-indexed (enero=0). */
export function eventsForMonth(year: number, month: number): CalendarEvent[] {
  const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  return calendarEvents.filter((e) => e.date.startsWith(prefix));
}

export function eventsForDay(dateISO: string): CalendarEvent[] {
  return calendarEvents.filter((e) => e.date === dateISO);
}
```

- [ ] **Step 5: Ejecutar → verde.** Run: `npx vitest run src/features/booking/data/calendar.test.ts && npx tsc --noEmit` → PASS.

- [ ] **Step 6: Commit**
```bash
git add src/types/index.ts src/features/booking/data/calendar.ts src/features/booking/data/calendar.test.ts
git commit -m "feat(conceptone): modelo CalendarEvent + seed 16 eventos del live (Jul-Sept) + helpers de mes"
```

---

### Task 2: `MonthNav` + `MonthGrid` + `CalendarioPage` (grid navegable) + swap del stub

**Files:**
- Create: `src/features/booking/components/MonthNav.tsx` + `MonthNav.test.tsx`
- Create: `src/features/booking/components/MonthGrid.tsx` + `MonthGrid.test.tsx`
- Create: `src/features/booking/pages/CalendarioPage.tsx` + `CalendarioPage.test.tsx`
- Modify: `src/features/booking/pages/index.ts` (exportar `CalendarioPage`, retirar `CalendarioStubPage`)
- Modify: `src/app/router.tsx` (`/calendario-c1` → `<CalendarioPage />`)
- Delete: `src/features/booking/pages/CalendarioStubPage.tsx`
- Modify: `src/features/booking/components/index.ts` (exportar los nuevos)

**Interfaces:**
- `MonthNav({ year, month, onPrev, onNext })` — muestra "{Mes} {Año}" (es-ES, capitalizado) entre ‹ ›.
- `MonthGrid({ year, month, events })` — cabecera LU..DO + celdas; en cada día, chips "{artist} · {city}" (o solo artist si city null). Semana empieza en lunes.
- `CalendarioPage` — estado `{ year, month }` inicial `{ 2026, 6 }`; usa `eventsForMonth`.

- [ ] **Step 1: Test de `MonthGrid` (fallará)**
```tsx
import { render, screen } from '@testing-library/react';
import { MonthGrid } from './MonthGrid';
import { eventsForMonth } from '../data/calendar';

it('julio 2026: cabeceras LU..DO y chips en sus días', () => {
  render(<MonthGrid year={2026} month={6} events={eventsForMonth(2026, 6)} />);
  ['LU', 'MA', 'MI', 'JU', 'VI', 'SÁ', 'DO'].forEach((d) => expect(screen.getByText(d)).toBeInTheDocument());
  expect(screen.getByText(/Bizza · Illes Balears/)).toBeInTheDocument();
  expect(screen.getByText(/Pau Guilera · Valencia/)).toBeInTheDocument();
  // día 1 presente
  expect(screen.getByText('1')).toBeInTheDocument();
});
```

- [ ] **Step 2: Test de `MonthNav` (fallará)**
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MonthNav } from './MonthNav';

it('muestra el mes/año y dispara onPrev/onNext', () => {
  const onPrev = vi.fn(), onNext = vi.fn();
  render(<MonthNav year={2026} month={6} onPrev={onPrev} onNext={onNext} />);
  expect(screen.getByText('Julio 2026')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /anterior|‹/i }));
  fireEvent.click(screen.getByRole('button', { name: /siguiente|›/i }));
  expect(onPrev).toHaveBeenCalled();
  expect(onNext).toHaveBeenCalled();
});
```

- [ ] **Step 3: Ejecutar → fallan.** Run: `npx vitest run src/features/booking/components/MonthGrid.test.tsx src/features/booking/components/MonthNav.test.tsx` → FAIL.

- [ ] **Step 4: Implementar `MonthNav.tsx`** (nombre de mes: `new Date(year, month, 1).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })` → "julio de 2026"; capitalizar y quitar "de" para "Julio 2026" — o construir con un array de meses `['Enero',…]`; usar el array para control exacto). Botones con `aria-label="Mes anterior"`/`"Mes siguiente"` y símbolos ‹ ›.

- [ ] **Step 5: Implementar `MonthGrid.tsx`**: cabecera de 7 columnas LU..DO; calcular `primerDia = new Date(year, month, 1).getDay()`; offset lunes = `(primerDia + 6) % 7`; nº de días = `new Date(year, month + 1, 0).getDate()`; render de celdas con huecos iniciales; en cada día, filtrar `events` cuyo `date` termine en ese día (`-DD`) y pintar chips "{artist}{city ? ' · ' + city : ''}". Ver `c1-calendario.png` para tokens.

- [ ] **Step 6: Implementar `CalendarioPage.tsx`**: header "Calendario" + subtítulo "Shows y holds de artista en un solo sitio. Un hold puede subir a show sin duplicar." + botón "+ Hold" (inerte, `type="button"`, sin onClick que mute); estado `[{year, month}, setMes]` inicial `{2026,6}`; `MonthNav` con `onPrev`/`onNext` que decrementan/incrementan (manejar cambio de año); `MonthGrid` con `eventsForMonth(year, month)`. (La agenda llega en Task 3.)

- [ ] **Step 7: Swap del stub en router + index**: en `router.tsx`, `/calendario-c1` → `<CalendarioPage />`; en `pages/index.ts`, exportar `CalendarioPage` y quitar `CalendarioStubPage`; borrar `CalendarioStubPage.tsx`. Test de `CalendarioPage` que verifica header + subtítulo + "Julio 2026" + un chip, y que `onNext` pasa a "Agosto 2026" y muestra un evento de agosto.

- [ ] **Step 8: Ejecutar → verde.** Run: `npx vitest run src/features/booking && npx tsc --noEmit && npm run lint` → PASS. (`grep -rn CalendarioStubPage src` → sin refs.)

- [ ] **Step 9: Commit**
```bash
git add -A
git commit -m "feat(conceptone): Calendario — grid mensual navegable (MonthNav+MonthGrid+CalendarioPage), retira stub"
```

---

### Task 3: `DayAgenda` + `AgendaShowCard` + `AgendaHoldCard` (inerte)

**Files:**
- Create: `src/features/booking/components/DayAgenda.tsx` + `DayAgenda.test.tsx`
- Create: `src/features/booking/components/AgendaShowCard.tsx` + `AgendaHoldCard.tsx` (+ tests, o un solo `.test.tsx`)
- Modify: `src/features/booking/pages/CalendarioPage.tsx` + `CalendarioPage.test.tsx`
- Modify: `src/features/booking/components/index.ts`

**Interfaces:**
- `AgendaShowCard({ event })` — "Show" + `{artist} · {venue} · {city} · {event}` (omitir venue/city null) + chip de pago.
- `AgendaHoldCard({ event })` — "Calendario" + `{artist} · {holdTitle} (del artista)` + badge `etapaLabel(etapa)` + botones "Subir a show"/"Editar"/"✕" (inertes: `type="button"`, sin handler mutante).
- `DayAgenda({ year, month, events })` — agrupa `events` por día (asc) y renderiza encabezado "{weekday}, {D} de {mes}" + las tarjetas del día.

- [ ] **Step 1: Test de tarjetas (fallará)**
```tsx
it('AgendaShowCard pinta artista/venue/ciudad/evento y el pago', () => {
  render(<AgendaShowCard event={{ id: 'x', date: '2026-07-18', type: 'show', artist: 'Los Canarios', venue: 'Edén Ibiza', city: 'Sant Antoni de Portmany', event: 'FUEGO', paymentStatus: 'No abonado' }} />);
  expect(screen.getByText(/Los Canarios/)).toBeInTheDocument();
  expect(screen.getByText(/Edén Ibiza/)).toBeInTheDocument();
  expect(screen.getByText(/Sant Antoni de Portmany/)).toBeInTheDocument();
  expect(screen.getByText('No abonado')).toBeInTheDocument();
});
it('AgendaHoldCard pinta "(del artista)", el badge y 3 botones inertes', () => {
  render(<AgendaHoldCard event={{ id: 'h', date: '2026-07-23', type: 'hold', artist: 'Test Artist', holdTitle: 'Dentista', etapa: 'confirmed' }} />);
  expect(screen.getByText(/Dentista \(del artista\)/)).toBeInTheDocument();
  expect(screen.getByText('Confirmado')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Subir a show' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Editar' })).toBeInTheDocument();
});
```

- [ ] **Step 2: Test de `DayAgenda` (fallará)**
```tsx
it('agrupa julio por día con encabezados es-ES', () => {
  render(<DayAgenda year={2026} month={6} events={eventsForMonth(2026, 6)} />);
  expect(screen.getByText('miércoles, 15 de julio')).toBeInTheDocument();
  expect(screen.getByText('jueves, 23 de julio')).toBeInTheDocument(); // el hold
  expect(screen.getAllByText(/Show|Calendario/).length).toBeGreaterThan(0);
});
```

- [ ] **Step 3: Ejecutar → fallan.**

- [ ] **Step 4: Implementar** `AgendaShowCard`, `AgendaHoldCard` (botones inertes — comentar el delta mock D2) y `DayAgenda` (obtener los días únicos ordenados; por día, encabezado con `new Date(dateISO + 'T00:00:00').toLocaleDateString('es-ES', { weekday:'long', day:'numeric', month:'long' })`; renderizar `AgendaShowCard`/`AgendaHoldCard` según `type`).

- [ ] **Step 5: Integrar en `CalendarioPage`**: bajo el `MonthGrid`, `<DayAgenda year month events={eventsForMonth(year, month)} />`. Actualizar su test: julio muestra "miércoles, 15 de julio" y el hold del 23; agosto muestra "Los Canarios · Marmarela · Alicante · Mamarela".

- [ ] **Step 6: Ejecutar → verde.** Run: `npx vitest run src/features/booking && npx tsc --noEmit && npm run lint` → PASS.

- [ ] **Step 7: Commit**
```bash
git add -A
git commit -m "feat(conceptone): Calendario — agenda por día (DayAgenda + AgendaShowCard + AgendaHoldCard inerte)"
```

---

### Task 4: Estado vacío + cierre de Fase C

**Files:**
- Modify: `src/features/booking/pages/CalendarioPage.tsx` + `CalendarioPage.test.tsx`

- [ ] **Step 1: Test del estado vacío (fallará)**
```tsx
it('un mes sin eventos (junio 2026) muestra el estado vacío', () => {
  render(<MemoryRouter><CalendarioPage /></MemoryRouter>);
  fireEvent.click(screen.getByRole('button', { name: /anterior/i })); // julio → junio
  expect(screen.getByText('Sin shows ni holds este mes.')).toBeInTheDocument();
});
```

- [ ] **Step 2: Ejecutar → falla.**
- [ ] **Step 3: Implementar** en `CalendarioPage`: si `eventsForMonth(year, month).length === 0`, `DayAgenda` (o la página) muestra "Sin shows ni holds este mes." bajo el grid. El grid del mes se pinta igual (vacío).
- [ ] **Step 4: Ejecutar → verde.**
- [ ] **Step 5: Verde total del módulo.** Run: `npx vitest run && npx tsc --noEmit && npm run lint` → PASS, 0 warnings, `git status` limpio. Anotar nº de tests (debe superar los 318 de Fase B).
- [ ] **Step 6: Sanity visual local (no bloqueante).** `npm run dev`, `/calendario-c1`: grid julio + agenda + hold; nav a agosto/septiembre; nav a junio (vacío). (Playwright ours-vs-live formal = cierre de módulo, tras Fase D.)
- [ ] **Step 7: Commit (si hubo cambios en Step 3)** `feat(conceptone): Calendario — estado vacío de mes sin eventos`
- [ ] **Step 8: Avisar al coordinador por herdr**
`herdr agent prompt w1:p1 "[w4:p1 · conceptone] HITO: Fase C (Calendario) cerrada y verde (N tests). Grid mensual + agenda + holds inertes, seed 16 eventos Jul-Sept. Sin PR. Espero Fase D (Disponibilidad+Contactos) o indicación."`
No abrir PR (una sola PR al cierre del módulo, tras Fase D).

---

## Notas de decisión (de la spec §5)
- **D1** CalendarEvent seed propio — no toca `Show`/dashboard. **D2** holds y "+ Hold" inertes (mock documentado). **D3** default julio 2026, meses sin datos → estado vacío. **D4** datos = evidencia (grafías literales incluidas).
- Reusar `etapaLabel` de Fase B para el badge del hold (DRY). Si `@/components/ui` tiene un chip de estado de pago reutilizable de Fase B (`ShowCard`), reusarlo en `AgendaShowCard`.
```
