# ConceptOne Recalco · Fase B (Shows) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reescribir `/shows` como el live: modelo `Show` rico sembrado con los 14 shows reales, lista de `ShowCard`, buscador, selector de rango y drawer de Filtros (Etapa/Fase/Estado de pago/Artista), conservando el deep-link `?status=` de los tiles del dashboard.

**Architecture:** Nuevo tipo `Show` (+ `DealType`/`PaymentStatus`/`ArtStatus`/`ShowFase`) en `@/types`; `getShows()` del `MockRepository` siembra los 14 shows; `ShowsPage` orquesta búsqueda+rango+filtros sobre componentes nuevos (`ShowCard`, `ShowsToolbar`, `RangoPopover`, `FiltrosDrawer`); se retira `DataTable`. Datos en memoria. Los tiles del dashboard NO se tocan (quedan standalone, spec D1).

**Tech Stack:** React 19, react-router 7, Tailwind, Vitest + RTL + jest-dom, TypeScript.

## Global Constraints

- Es-ES; `formatCurrency` de `@/lib/format.ts` (€, coma decimal). Un commit por tarea; cada tarea verde: `npx vitest run`, `npx tsc --noEmit`, `npm run lint` (0 warnings).
- Fuente de verdad: spec `docs/superpowers/specs/2026-07-24-conceptone-fase-b-shows-design.md` + capturas `scratchpad/recon-conceptone/` (`c1-shows.png`, `c1-shows-filtros.png`, `range-open2.png`, `c1-shows-filtros.json`, `fase-map.json`, `range-options.json`).
- **Seed = los 14 shows del §3 de la spec, valores EXACTOS** (código, fee/bf/mf, etapa, fase, pago, arte). `fase` según spec §3.1 (evidencia del filtro Fase) — no inferir.
- **Etapa** reutiliza el enum existente `ShowStatus`. **Fase** es enum nuevo `ShowFase`. Deep-link `?status=<etapa>` de los tiles debe seguir funcionando (pre-selecciona el filtro Etapa).
- **NO tocar** los tiles del dashboard ni `getBookingDashboard()` (spec D1: standalone). **HOY fijo = '2026-07-24'** para el filtro de rango (spec D4). Moneda única € y fila de show inerte (spec D5).
- Reusar primitivos de `@/components/ui` (`Card`, `Input`, `Select`, `Button`, `Badge`). Si no hay `Drawer`/`Popover`, construir un panel/popover propio con Tailwind siguiendo el patrón del repo (p.ej. el drawer de Filtros de otros módulos si existe — verificar con grep antes).

---

### Task 1: Modelo `Show` rico + seed de 14 shows + `ShowCard` + `ShowsPage` (lista) — swap del modelo

Es el cambio atómico: sustituir el `Show` pobre por el rico obliga a actualizar seed, página y a retirar `DataTable` en la misma tarea para que el árbol compile.

**Files:**
- Modify: `src/types/index.ts` (reemplazar `interface Show`; añadir `DealType`/`PaymentStatus`/`ArtStatus`/`ShowFase`)
- Modify: `src/repositories/MockRepository.ts` (`getShows()` → 14 shows)
- Modify: `src/repositories/MockRepository.test.ts` (o el fichero donde se testee `getShows`)
- Create: `src/features/booking/data/artistas.ts` (lista de artistas para el filtro)
- Create: `src/features/booking/components/ShowCard.tsx` + `ShowCard.test.tsx`
- Modify: `src/features/booking/pages/ShowsPage.tsx` + `ShowsPage.test.tsx`
- Modify: `src/features/booking/components/index.ts` (exportar `ShowCard`, retirar `DataTable`)
- Delete: `src/features/booking/components/DataTable.tsx` + `DataTable.test.tsx` (si el único consumidor era `ShowsPage`; verificar con grep)

**Interfaces:**
- Produces: `Show` (spec §2.1), `getShows(): Promise<Show[]>` con 14 shows, `ShowCard({ show }: { show: Show })`, `artistasDisponibles: string[]`.

- [ ] **Step 1: Reemplazar el tipo `Show` en `src/types/index.ts`**

Sustituir la interfaz `Show` actual (`{ id, name, client, date, status, amount }`) por:
```ts
export type DealType = 'All In' | 'Landed' | '+++';
export type PaymentStatus =
  | 'No abonado' | 'Parcialmente abonado' | 'Pendiente liquidar' | 'Liquidado' | 'Incidencia';
export type ArtStatus = 'Arte no subido' | 'Arte pendiente' | 'Arte subido';
export type ShowFase =
  | 'tentative' | 'confirmed' | 'contract' | 'pagos' | 'liquidacion' | 'liquidado' | 'cancelado';

export interface Show {
  id: string;
  code: string;
  date: string | null;
  artist: string;
  event: string;
  venue: string | null;
  country: string | null;
  etapa: ShowStatus;
  fase: ShowFase;
  dealType: DealType;
  fee: number;
  bf: number;
  mf: number;
  paymentStatus: PaymentStatus;
  artStatus: ArtStatus;
  exception: boolean;
}
```
(No tocar `ShowStatus` ni `ShowSummary`.)

- [ ] **Step 2: Escribir el test del seed (fallará)**

En el fichero de test del repositorio para `getShows` (crear el bloque si no existe, junto a `MockRepository.booking.test.ts` o en `MockRepository.test.ts`):
```ts
it('getShows devuelve los 14 shows del live con datos exactos', async () => {
  const repo = new MockRepository();
  const shows = await repo.getShows();
  expect(shows).toHaveLength(14);
  const s6 = shows.find((s) => s.code === 'C1-2026-006')!;
  expect(s6).toMatchObject({
    artist: 'Los Canarios', event: 'FUEGO', etapa: 'confirmed', fase: 'confirmed',
    dealType: 'Landed', fee: 3000, bf: 600, mf: 449.58, paymentStatus: 'No abonado',
    artStatus: 'Arte no subido', exception: true,
  });
  const s5 = shows.find((s) => s.code === 'C1-2026-005')!;
  expect(s5).toMatchObject({ fase: 'liquidado', etapa: 'done', venue: null, country: null, paymentStatus: 'Parcialmente abonado' });
  const s7 = shows.find((s) => s.code === 'C1-2026-007')!;
  expect(s7).toMatchObject({ fase: 'tentative', etapa: 'tentative', date: null });
  // fase por evidencia (spec §3.1)
  const fasePorCodigo = Object.fromEntries(shows.map((s) => [s.code, s.fase]));
  expect(fasePorCodigo['C1-2026-014']).toBe('liquidado');
  expect(fasePorCodigo['C1-2026-011']).toBe('confirmed');
});
```

- [ ] **Step 3: Ejecutar → falla.** Run: `npx vitest run src/repositories` → FAIL (getShows devuelve 4 placeholders del modelo viejo / tsc rompe).

- [ ] **Step 4: Sembrar los 14 shows en `MockRepository.getShows()`**

Reemplazar el array de `getShows()` por los 14 shows (etapa: Tentative→'tentative', Confirmado→'confirmed', Liquidado→'done'; fase spec §3.1). Copiar EXACTO de la tabla del spec §3:
```ts
async getShows(): Promise<Show[]> {
  return this.delay([
    { id: 's12', code: 'C1-2026-012', date: '18 jul 2026', artist: 'Abdon', event: 'FUNDAYS', venue: 'Bassment', country: 'España', etapa: 'tentative', fase: 'tentative', dealType: 'All In', fee: 0, bf: 0, mf: 0, paymentStatus: 'No abonado', artStatus: 'Arte no subido', exception: false },
    { id: 's06', code: 'C1-2026-006', date: '18 jul 2026', artist: 'Los Canarios', event: 'FUEGO', venue: 'Edén Ibiza', country: 'España', etapa: 'confirmed', fase: 'confirmed', dealType: 'Landed', fee: 3000, bf: 600, mf: 449.58, paymentStatus: 'No abonado', artStatus: 'Arte no subido', exception: true },
    { id: 's15', code: 'C1-2026-015', date: '21 jul 2026', artist: 'Test Artist', event: 'SIGHT', venue: 'Ku Barcelona', country: 'España', etapa: 'confirmed', fase: 'confirmed', dealType: 'All In', fee: 0, bf: 0, mf: 0, paymentStatus: 'No abonado', artStatus: 'Arte no subido', exception: false },
    { id: 's14', code: 'C1-2026-014', date: '25 jul 2026', artist: 'Florentia', event: 'Summer Opening Festival', venue: 'Paseo de Santiago, Torreperogil', country: 'España', etapa: 'done', fase: 'liquidado', dealType: 'Landed', fee: 1000, bf: 200, mf: 0, paymentStatus: 'Liquidado', artStatus: 'Arte pendiente', exception: false },
    { id: 's19', code: 'C1-2026-019', date: '26 jul 2026', artist: 'Pau Guilera', event: 'the next', venue: 'Marina Beach Club', country: 'España', etapa: 'confirmed', fase: 'confirmed', dealType: 'Landed', fee: 700, bf: 140, mf: 0, paymentStatus: 'No abonado', artStatus: 'Arte no subido', exception: false },
    { id: 's21', code: 'C1-2026-021', date: '26 jul 2026', artist: 'Abdon', event: 'SIGHT', venue: 'Ku Barcelona', country: 'España', etapa: 'confirmed', fase: 'confirmed', dealType: 'All In', fee: 1000, bf: 200, mf: 200, paymentStatus: 'No abonado', artStatus: 'Arte no subido', exception: false },
    { id: 's18', code: 'C1-2026-018', date: '01 ago 2026', artist: 'Milan', event: 'Casa del Mar', venue: 'Casa del Mar', country: 'USA', etapa: 'tentative', fase: 'tentative', dealType: 'All In', fee: 350.56, bf: 70.11, mf: 0, paymentStatus: 'No abonado', artStatus: 'Arte no subido', exception: false },
    { id: 's20', code: 'C1-2026-020', date: '01 ago 2026', artist: 'Los Canarios', event: 'Solart Fest', venue: 'Hangar 37', country: 'España', etapa: 'confirmed', fase: 'confirmed', dealType: '+++', fee: 2000, bf: 400, mf: 400, paymentStatus: 'No abonado', artStatus: 'Arte no subido', exception: false },
    { id: 's05', code: 'C1-2026-005', date: '04 sept 2026', artist: 'Brenda Serna', event: 'Alcazar de San Juan', venue: null, country: null, etapa: 'done', fase: 'liquidado', dealType: 'All In', fee: 2500, bf: 500, mf: 0, paymentStatus: 'Parcialmente abonado', artStatus: 'Arte no subido', exception: false },
    { id: 's13', code: 'C1-2026-013', date: '18 sept 2026', artist: 'Sergio Saffe', event: 'el Tebo', venue: 'el Tebo', country: 'Chile', etapa: 'tentative', fase: 'tentative', dealType: 'All In', fee: 875, bf: 175, mf: 0, paymentStatus: 'No abonado', artStatus: 'Arte no subido', exception: false },
    { id: 's16', code: 'C1-2026-016', date: '25 sept 2026', artist: 'Marian Ariss', event: 'Kevin de Vries Cordoba', venue: 'La Fábrica', country: 'Argentina', etapa: 'tentative', fase: 'tentative', dealType: 'All In', fee: 1226.96, bf: 245.39, mf: 0, paymentStatus: 'No abonado', artStatus: 'Arte no subido', exception: false },
    { id: 's17', code: 'C1-2026-017', date: '26 sept 2026', artist: 'Marian Ariss', event: 'Kevin de Vries Buenos Aires', venue: 'Mandarine Park', country: 'Argentina', etapa: 'tentative', fase: 'tentative', dealType: 'All In', fee: 1226.96, bf: 245.39, mf: 0, paymentStatus: 'No abonado', artStatus: 'Arte no subido', exception: false },
    { id: 's11', code: 'C1-2026-011', date: '26 sept 2026', artist: 'ART NO LOGIA', event: 'Jiwa', venue: 'Boho Beer Garden', country: 'Reino Unido', etapa: 'confirmed', fase: 'confirmed', dealType: 'All In', fee: 1800, bf: 360, mf: 272, paymentStatus: 'No abonado', artStatus: 'Arte no subido', exception: false },
    { id: 's07', code: 'C1-2026-007', date: null, artist: 'Andrea Castells', event: 'Sephora Opening', venue: null, country: null, etapa: 'tentative', fase: 'tentative', dealType: 'All In', fee: 2000, bf: 400, mf: 0, paymentStatus: 'No abonado', artStatus: 'Arte no subido', exception: false },
  ]);
}
```

- [ ] **Step 5: Crear `src/features/booking/data/artistas.ts`**

La lista alfabética de artistas del filtro. **Extraer la lista EXACTA de `scratchpad/recon-conceptone/c1-shows-filtros.json`** (campo body, entre "Todos los artistas" y la primera fila de show). Es esta (verificar contra el JSON, ~70 nombres):
```ts
export const artistasDisponibles: string[] = [
  'Aaron Martin', 'Abdon', 'ACA', 'Alexanders Som', 'Andrea Castells', 'ART NO LOGIA', 'Ballesteros',
  'Bassel Darwish', 'Bianca Lif', 'Bizza', 'Brenda Serna', 'CAAL', 'Claptone', 'Claudia Tejeda',
  'De La Swing', 'DH Moon', 'Dhuna', 'Dontbedaft', 'Florentia', 'Fran Hernandez', 'Francisco Valentín',
  'Freddy Bello', 'Funk Off', 'Galgo', 'Gaston Zani', 'Gordo', 'Guille Placencia', 'Harvy Valencia',
  'Hector Janse', 'Jose Fajardo', 'Kevin de Vries', 'Koleto', 'LA CINTIA', 'Levi', 'Local Support',
  'Londonground', 'Los Canarios', 'Luka Kuhnow', 'Marcel BS', 'Marian Ariss', 'Miane', 'Miganova',
  'Milan', 'Nacho Scoppa', 'Nicole Moudaber', 'Olivia Bass', 'Omy Cid', 'Parsa Jafari', 'Patrick Topping',
  'Pau Guilera', 'Prophecy', 'Rivellino', 'Rooléh', 'Rubenus', 'Saldivar', 'Sebastian Ledher',
  'Sera De Villalta', 'Sergio Saffe', 'Shakti', 'SOVA', 'SUMIA', 'TBA', 'Test Artist', 'Tom Nolan',
  'Tomi & Kesh', 'Vidaloca', 'Vite', 'Wes Colstock',
];
```

- [ ] **Step 6: Escribir el test de `ShowCard` (fallará)**
```tsx
import { render, screen } from '@testing-library/react';
import { ShowCard } from './ShowCard';
import type { Show } from '@/types';

const base: Show = { id: 's06', code: 'C1-2026-006', date: '18 jul 2026', artist: 'Los Canarios', event: 'FUEGO', venue: 'Edén Ibiza', country: 'España', etapa: 'confirmed', fase: 'confirmed', dealType: 'Landed', fee: 3000, bf: 600, mf: 449.58, paymentStatus: 'No abonado', artStatus: 'Arte no subido', exception: true };

it('pinta código, artista@evento, deal, fee/BF/MF, pago, arte y "● Excepción"', () => {
  render(<ShowCard show={base} />);
  expect(screen.getByText('C1-2026-006')).toBeInTheDocument();
  expect(screen.getByText(/Los Canarios/)).toBeInTheDocument();
  expect(screen.getByText(/FUEGO/)).toBeInTheDocument();
  expect(screen.getByText(/Edén Ibiza, España/)).toBeInTheDocument();
  expect(screen.getByText(/All In|Landed|\+\+\+/)).toBeInTheDocument();
  expect(screen.getByText(/3\.?000,00\s?€/)).toBeInTheDocument(); // moneda NBSP → \s?
  expect(screen.getByText(/BF/)).toBeInTheDocument();
  expect(screen.getByText('No abonado')).toBeInTheDocument();
  expect(screen.getByText('Arte no subido')).toBeInTheDocument();
  expect(screen.getByText(/Excepción/)).toBeInTheDocument();
});
it('sin venue no muestra la línea de ubicación y sin fecha muestra "—"', () => {
  render(<ShowCard show={{ ...base, code: 'C1-2026-007', venue: null, country: null, date: null, exception: false }} />);
  expect(screen.queryByText(/Excepción/)).not.toBeInTheDocument();
  expect(screen.getByText('—')).toBeInTheDocument();
});
```

- [ ] **Step 7: Ejecutar → falla.** Run: `npx vitest run src/features/booking/components/ShowCard.test.tsx` → FAIL (no existe).

- [ ] **Step 8: Implementar `ShowCard.tsx`** según spec §4.1 (fila con separadores; badge de etapa por color reusando `Badge`/mapa de etiquetas; `formatCurrency` para fee; sub-línea `BF {bf} · MF {mf}`; chip de pago; texto de arte; "● Excepción" en rojo si `exception`; ubicación solo si `venue`). Ver `c1-shows.png` para spacing/tokens. Etiqueta de etapa: reusar el diccionario de labels (Tentative/Confirmado/…); si está en `KpiCard`, extraer a un helper compartido `etapaLabel(status)` en `data/` para no duplicar (DRY).

- [ ] **Step 9: Reescribir `ShowsPage.tsx`** para renderizar la lista de `ShowCard` (sin toolbar/filtros aún — llegan en Tasks 2-4), manteniendo el deep-link `?status=` para un filtro básico de etapa (ya existe; adaptarlo al nuevo `show.etapa`). Actualizar `ShowsPage.test.tsx`: renderiza 14 cards; `?status=confirmed` muestra solo los de etapa confirmed. Quitar el uso de `DataTable`.

- [ ] **Step 10: Retirar `DataTable`.** `grep -rn "DataTable" src` → si solo lo usaba `ShowsPage`, borrar `DataTable.tsx`/`.test.tsx` y su export en `components/index.ts`. Añadir export de `ShowCard`.

- [ ] **Step 11: Verde total.** Run: `npx vitest run && npx tsc --noEmit && npm run lint` → PASS.

- [ ] **Step 12: Commit**
```bash
git add -A
git commit -m "feat(conceptone): modelo Show rico + seed 14 shows del live + ShowCard + ShowsPage (lista); retira DataTable"
```

---

### Task 2: `ShowsToolbar` (header + contador + buscador) + búsqueda funcional

**Files:**
- Create: `src/features/booking/components/ShowsToolbar.tsx` + `ShowsToolbar.test.tsx`
- Modify: `src/features/booking/pages/ShowsPage.tsx` + `ShowsPage.test.tsx`
- Modify: `src/features/booking/components/index.ts`

**Interfaces:**
- `ShowsToolbar({ count, query, onQueryChange, onOpenFiltros, rango, onRangoChange })` — en esta tarea solo se cablea header+contador+buscador; los props de rango/filtros se añaden vacíos y se completan en Tasks 3-4 (o añadir los props aquí y dejar los botones inertes hasta su tarea).

- [ ] **Step 1: Test (fallará)**
```tsx
it('muestra "Shows", el contador y filtra por artista/evento/venue al escribir', () => {
  render(<MemoryRouter><ShowsPage /></MemoryRouter>);
  // esperar carga (14 shows)
  expect(screen.getByRole('heading', { name: 'Shows' })).toBeInTheDocument();
  expect(screen.getByText('14 shows')).toBeInTheDocument();
  fireEvent.change(screen.getByPlaceholderText('Buscar artista, evento, venue…'), { target: { value: 'Florentia' } });
  expect(screen.getByText('1 show')).toBeInTheDocument();
  expect(screen.getByText('C1-2026-014')).toBeInTheDocument();
});
```
(Usar `findBy`/`waitFor` para la carga async de `useShows` según el patrón de tests del repo.)

- [ ] **Step 2: Ejecutar → falla.**
- [ ] **Step 3: Implementar `ShowsToolbar`** (header "Shows" + "{count} {count===1?'show':'shows'}" + `Input type="search"` con el placeholder exacto) y cablear en `ShowsPage` el estado `query` + el filtro de búsqueda (match case-insensitive en `artist`/`event`/`venue`). El contador refleja los resultados.
- [ ] **Step 4: Ejecutar → verde** (`vitest` del fichero + `tsc` + `lint`).
- [ ] **Step 5: Commit** `feat(conceptone): ShowsToolbar (header+contador+buscador) + búsqueda funcional`

---

### Task 3: `FiltrosDrawer` (Etapa/Fase/Estado de pago/Artista) + filtrado + deep-link

**Files:**
- Create: `src/features/booking/components/FiltrosDrawer.tsx` + `FiltrosDrawer.test.tsx`
- Modify: `src/features/booking/pages/ShowsPage.tsx` + `ShowsPage.test.tsx`

**Interfaces:**
- `FiltrosDrawer({ abierto, filtros, onChange, onClose })` con `filtros = { etapa, fase, pago, artista }` (cada uno string, '' = "todas"). 4 `<select>` con las opciones exactas de spec §4.3.

- [ ] **Step 1: Test (fallará)**
```tsx
it('el drawer filtra por Fase y por Estado de pago', () => {
  render(<MemoryRouter><ShowsPage /></MemoryRouter>);
  fireEvent.click(screen.getByRole('button', { name: 'Filtros' }));
  fireEvent.change(screen.getByLabelText('Fase'), { target: { value: 'liquidado' } });
  expect(screen.getByText('2 shows')).toBeInTheDocument(); // 005 y 014
  fireEvent.change(screen.getByLabelText('Estado de pago'), { target: { value: 'Parcialmente abonado' } });
  expect(screen.getByText('1 show')).toBeInTheDocument(); // solo 005
});
it('deep-link ?status=confirmed pre-selecciona Etapa=Confirmado', () => {
  render(<MemoryRouter initialEntries={['/shows?status=confirmed']}><ShowsPage /></MemoryRouter>);
  expect(screen.getByText('6 shows')).toBeInTheDocument();
});
```

- [ ] **Step 2: Ejecutar → falla.**
- [ ] **Step 3: Implementar `FiltrosDrawer`** (panel lateral; 4 `<select>` con `<label>` asociado — "Etapa"/"Fase"/"Estado de pago"/"Artista" — y las opciones exactas de spec §4.3; Artista se rellena con `artistasDisponibles`). En `ShowsPage`: estado `filtros`, botón "Filtros" que abre el drawer, aplicar los 4 criterios (AND) sobre la lista ya buscada; inicializar `filtros.etapa` desde `?status=` (mapear el valor del enum a la opción). El botón "Filtros" puede mostrar un punto/contador si hay filtros activos (como el live, si el PNG lo muestra).
- [ ] **Step 4: Ejecutar → verde.**
- [ ] **Step 5: Commit** `feat(conceptone): FiltrosDrawer (Etapa/Fase/Pago/Artista) + filtrado + deep-link ?status=`

---

### Task 4: `RangoPopover` (Desde/Hasta) + filtrado por rango

**Files:**
- Create: `src/features/booking/components/RangoPopover.tsx` + `RangoPopover.test.tsx`
- Modify: `src/features/booking/pages/ShowsPage.tsx` + `ShowsPage.test.tsx`

**Interfaces:**
- `RangoPopover({ abierto, rango, onChange, onClose })` con `rango = { desde, hasta }`. 2 `<select>` con las opciones de spec §4.2. Botón de la toolbar muestra "{desde} → {hasta}".
- Helper `dentroDeRango(dateStr, rango, HOY)` en `data/` con `HOY = '2026-07-24'` (spec D4).

- [ ] **Step 1: Test (fallará)**
```ts
it('rango por defecto (Última semana → Todo el futuro) muestra los 14', () => {
  render(<MemoryRouter><ShowsPage /></MemoryRouter>);
  expect(screen.getByText('14 shows')).toBeInTheDocument();
});
it('"Hasta hoy" (2026-07-24) deja fuera los shows futuros', () => {
  render(<MemoryRouter><ShowsPage /></MemoryRouter>);
  fireEvent.click(screen.getByRole('button', { name: /→/ }));
  fireEvent.change(screen.getByLabelText('Hasta'), { target: { value: 'hasta-hoy' } });
  // 18/21 jul quedan dentro; el resto (25 jul+) fuera; el de date:null se mantiene
  expect(screen.getByText(/shows?/)).toBeInTheDocument();
});
```
(Ajustar las cuentas exactas al implementar el parseo de fechas; el objetivo del test es que "Hasta hoy" reduce el conteo respecto a los 14 y que `date:null` no se filtra.)

- [ ] **Step 2: Ejecutar → falla.**
- [ ] **Step 3: Implementar** `RangoPopover` (2 `<select>` Desde/Hasta con opciones exactas de spec §4.2, valores por defecto "Última semana"/"Todo el futuro") y el helper `dentroDeRango` (parsear "DD mmm YYYY" es-ES → Date con un mapa de meses; convertir cada opción Desde/Hasta a límites relativos a `HOY='2026-07-24'`; `date:null` siempre pasa). Cablear en `ShowsPage` como criterio adicional. El botón de la toolbar muestra la etiqueta dinámica.
- [ ] **Step 4: Ejecutar → verde.**
- [ ] **Step 5: Commit** `feat(conceptone): RangoPopover (Desde/Hasta) + filtrado por rango (HOY fijo)`

---

### Task 5: Ayuda contextual (minor) + cierre de Fase B

**Files:**
- (Opcional) Modify: `ShowsToolbar.tsx` (tooltip "?" con el copy de spec §4.4) si el live lo muestra en la toolbar.

- [ ] **Step 1: (Opcional) Ayuda "?"** — si `c1-shows.png` muestra un icono "?" en la toolbar, añadir un tooltip/popover con los 2 textos de spec §4.4 (test: al abrirlo aparece "El fee va en la moneda del deal"). Si no está en la toolbar, **omitir y documentar** el delta menor (no inventar UI).

- [ ] **Step 2: Verde total del módulo.** Run: `npx vitest run && npx tsc --noEmit && npm run lint` → PASS, 0 warnings, `git status` limpio. Anotar nº de tests (debe superar los 302 de Fase A).

- [ ] **Step 3: Sanity visual local (no bloqueante).** `npm run dev`, `/shows`: 14 cards, buscador, rango, drawer Filtros; probar `?status=confirmed`. (Playwright ours-vs-live formal = cierre de módulo, tras Fase D.)

- [ ] **Step 4: Avisar al coordinador por herdr**
`herdr agent prompt w1:p1 "[w4:p1 · conceptone] HITO: Fase B (Shows) cerrada y verde (N tests). Modelo rico + 14 shows + buscador + Filtros + Rango + deep-link. Sin PR (una PR al cierre del módulo). Espero Fase C o indicación."`
No abrir PR (una sola PR al cierre del módulo, tras Fase D).

---

## Notas de decisión (de la spec §6)
- **D1** tiles standalone — Fase B NO toca el dashboard. **D2** `fase` por evidencia (§3.1). **D3** deep-link `?status=` conservado (Task 1 + Task 3). **D4** `HOY='2026-07-24'` (Task 4). **D5** moneda € y fila inerte.
- Si `@/components/ui` ya tiene un `Drawer`/`Popover` reutilizable, úsalo en Tasks 3-4 en vez de construirlo a mano (grep antes). Mantener DRY el diccionario de etiquetas de etapa entre `KpiCard` y `ShowCard`.
```
