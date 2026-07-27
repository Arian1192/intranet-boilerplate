# ConceptOne Recalco · Fase A (reestructura sub-nav planas + Dashboard financiero) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dejar la navegación de ConceptOne fiel al live (5 tabs en **rutas planas**: Dashboard/Shows/Calendario/Disponibilidad/Contactos) y reconstruir el Dashboard como financiero de **6 tiles**, con Calendario/Disponibilidad/Contactos como stubs y Shows intacto hasta Fase B.

**Architecture:** `ConceptOneShell` pasa a ser un *layout route sin prefijo* que envuelve rutas planas. El dashboard reduce sus KPI tiles de 7 a 6 (quita OFERTA, relabela Pendiente cobro / Liquidado) con los valores exactos del live. Se eliminan las páginas y hooks de Logística/Artistas/Analítica. Datos en memoria vía `MockRepository`.

**Tech Stack:** React 19, react-router 7, Tailwind, Vitest + RTL + jest-dom, TypeScript.

## Global Constraints

- Es-ES en todos los textos; `formatCurrency` de `@/lib/format.ts` (€, coma decimal, miles con punto).
- Un commit por tarea. Cada tarea termina en verde: `npx vitest run`, `npx tsc --noEmit`, `npm run lint` (eslint `--max-warnings 0`).
- **Rutas planas** (decisión de Arian, spec §D1): `/conceptone` (Dashboard), `/shows`, `/calendario-c1`, `/disponibilidad`, `/contactos`. Verificado sin colisión con rutas raíz existentes.
- **Enum `status` NO cambia** (spec §D3): solo se ajusta el diccionario de labels de `KpiCard` (quitar OFERTA del seed, relabel `pending-payment`→"Pendiente cobro", `done`→"Liquidado"). El Record `statusLabels`/`statusStyles` MANTIENE la clave `offer` (TS exige Record exhaustivo sobre `Kpi['status']`).
- **6 tiles con valores exactos del live** (spec §3.1, evidencia): Tentative 5.679,48€/7 · Confirmado 10.200,00€/8 · Contrato 0,00€/0 · Pendiente cobro 0,00€/0 · Pendiente liquidar 1.850,00€/3 · Liquidado 3.500,00€/2.
- Fuente de verdad: spec `docs/superpowers/specs/2026-07-24-conceptone-fase-a-design.md` + capturas `scratchpad/recon-conceptone/` (`c1-dashboard.png`, etc.).
- Alcance: solo Fase A. NO tocar el interior de Shows (Fase B); Calendario/Disponibilidad/Contactos son stubs (Fases C/D). El detalle fino de filas de las 4 secciones se cierra en la verificación ours-vs-live de cierre de módulo (tras Fase D).

---

### Task 1: Rutas planas + tabs del shell + 3 stub pages

**Files:**
- Create: `src/features/booking/pages/CalendarioStubPage.tsx`
- Create: `src/features/booking/pages/DisponibilidadStubPage.tsx`
- Create: `src/features/booking/pages/ContactosStubPage.tsx`
- Create: `src/features/booking/pages/ConceptOneStubs.test.tsx`
- Modify: `src/features/booking/pages/index.ts`
- Modify: `src/features/modules/ConceptOneShell.tsx`
- Modify: `src/app/router.tsx`

**Interfaces:**
- Produces: `CalendarioStubPage`, `DisponibilidadStubPage`, `ContactosStubPage` (componentes sin props). El shell envuelve 5 rutas planas.

- [ ] **Step 1: Crear los 3 stubs**

Cada fichero (sustituir el título por el de cada pantalla: "Calendario", "Disponibilidad", "Contactos"):
```tsx
// CalendarioStubPage.tsx
export function CalendarioStubPage() {
  return (
    <div>
      <h1 className="mb-5 text-2xl font-semibold leading-8 text-slate-800">Calendario</h1>
      <p className="py-16 text-center text-sm text-slate-400">Próximamente.</p>
    </div>
  );
}
```
```tsx
// DisponibilidadStubPage.tsx
export function DisponibilidadStubPage() {
  return (
    <div>
      <h1 className="mb-5 text-2xl font-semibold leading-8 text-slate-800">Disponibilidad</h1>
      <p className="py-16 text-center text-sm text-slate-400">Próximamente.</p>
    </div>
  );
}
```
```tsx
// ContactosStubPage.tsx
export function ContactosStubPage() {
  return (
    <div>
      <h1 className="mb-5 text-2xl font-semibold leading-8 text-slate-800">Contactos</h1>
      <p className="py-16 text-center text-sm text-slate-400">Próximamente.</p>
    </div>
  );
}
```

- [ ] **Step 2: Escribir el test del shell + stubs (fallará)**

`src/features/booking/pages/ConceptOneStubs.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ConceptOneShell } from '@/features/modules/ConceptOneShell';
import { CalendarioStubPage, DisponibilidadStubPage, ContactosStubPage } from './index';

describe('ConceptOne stubs', () => {
  it('cada stub muestra su título', () => {
    render(<MemoryRouter><CalendarioStubPage /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Calendario' })).toBeInTheDocument();
  });
});

describe('ConceptOneShell (tabs planas)', () => {
  it('muestra las 5 tabs del live y ninguna de las viejas', () => {
    render(<MemoryRouter initialEntries={['/conceptone']}><ConceptOneShell /></MemoryRouter>);
    for (const t of ['Dashboard', 'Shows', 'Calendario', 'Disponibilidad', 'Contactos']) {
      expect(screen.getByRole('link', { name: t })).toBeInTheDocument();
    }
    expect(screen.queryByRole('link', { name: 'Logística' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Artistas' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Analítica' })).not.toBeInTheDocument();
  });
  it('los hrefs son rutas planas', () => {
    render(<MemoryRouter initialEntries={['/conceptone']}><ConceptOneShell /></MemoryRouter>);
    expect(screen.getByRole('link', { name: 'Shows' })).toHaveAttribute('href', '/shows');
    expect(screen.getByRole('link', { name: 'Calendario' })).toHaveAttribute('href', '/calendario-c1');
    expect(screen.getByRole('link', { name: 'Disponibilidad' })).toHaveAttribute('href', '/disponibilidad');
    expect(screen.getByRole('link', { name: 'Contactos' })).toHaveAttribute('href', '/contactos');
  });
});
```
(Si `ConceptOneShell` renderiza `<Outlet/>` y `AppLayout` requiere contexto extra, envolver como haga falta siguiendo el patrón de otros tests de shell del repo; el objetivo es aseverar los `link` de tabs.)

- [ ] **Step 3: Actualizar `pages/index.ts`**
```ts
export * from './BookingDashboardPage';
export * from './ShowsPage';
export * from './CalendarioStubPage';
export * from './DisponibilidadStubPage';
export * from './ContactosStubPage';
```
(Se retiran los export de `LogisticsPage`/`ArtistsPage`/`AnalyticsPage`; sus ficheros se borran en Task 3.)

- [ ] **Step 4: Actualizar los tabs de `ConceptOneShell.tsx`**
```tsx
const tabs = [
  { label: 'Dashboard', href: '/conceptone' },
  { label: 'Shows', href: '/shows' },
  { label: 'Calendario', href: '/calendario-c1' },
  { label: 'Disponibilidad', href: '/disponibilidad' },
  { label: 'Contactos', href: '/contactos' },
];
```

- [ ] **Step 5: Reescribir el bloque de rutas en `router.tsx`**

Sustituir el bloque anidado actual:
```tsx
      <Route path="/conceptone" element={<ConceptOneShell />}>
        <Route index element={<BookingDashboardPage />} />
        <Route path="shows" element={<ShowsPage />} />
        <Route path="logistica" element={<LogisticsPage />} />
        <Route path="artistas" element={<ArtistsPage />} />
        <Route path="analitica" element={<AnalyticsPage />} />
      </Route>
```
por el layout route sin prefijo con rutas planas:
```tsx
      <Route element={<ConceptOneShell />}>
        <Route path="/conceptone" element={<BookingDashboardPage />} />
        <Route path="/shows" element={<ShowsPage />} />
        <Route path="/calendario-c1" element={<CalendarioStubPage />} />
        <Route path="/disponibilidad" element={<DisponibilidadStubPage />} />
        <Route path="/contactos" element={<ContactosStubPage />} />
      </Route>
```
Actualizar el import de páginas: quitar `LogisticsPage, ArtistsPage, AnalyticsPage`, añadir `CalendarioStubPage, DisponibilidadStubPage, ContactosStubPage` (el import viene de `@/features/booking/pages`).

- [ ] **Step 6: Ejecutar tests + tsc + lint → verde**

Run: `npx vitest run src/features/booking/pages/ConceptOneStubs.test.tsx && npx tsc --noEmit && npm run lint`
Expected: PASS. (Si `tsc` se queja por `LogisticsPage`/etc. aún importados en algún sitio, se resuelve en Task 3 — para este paso basta con que router y shell compilen; si hay ref colgando, comentar temporalmente NO; mejor completar Task 3. Si el árbol no compila, seguir a Task 3 antes de commit.)

- [ ] **Step 7: Commit**
```bash
git add src/features/booking/pages/CalendarioStubPage.tsx src/features/booking/pages/DisponibilidadStubPage.tsx src/features/booking/pages/ContactosStubPage.tsx src/features/booking/pages/ConceptOneStubs.test.tsx src/features/booking/pages/index.ts src/features/modules/ConceptOneShell.tsx src/app/router.tsx
git commit -m "feat(conceptone): sub-nav planas fieles al live (Dashboard/Shows/Calendario/Disponibilidad/Contactos) + stubs"
```

---

### Task 2: Dashboard financiero — 6 tiles con valores del live

**Files:**
- Modify: `src/repositories/MockRepository.ts:110-118` (array `kpis`)
- Modify: `src/repositories/MockRepository.booking.test.ts`
- Modify: `src/features/booking/components/KpiCard.tsx`
- Modify: `src/features/booking/components/KpiCard.test.tsx`
- Modify: `src/features/booking/pages/BookingDashboardPage.tsx` (grid de tiles)

**Interfaces:**
- Consumes: `Kpi` (`{ id, label, amount, count, status }`), `getBookingDashboard()`.
- Produces: dashboard con 6 tiles; `KpiCard` navega a `/shows?status=<status>`.

- [ ] **Step 1: Actualizar el test del repositorio (fallará)**

En `src/repositories/MockRepository.booking.test.ts`, cambiar la aserción de longitud y fijar los valores del live:
```ts
it('returns booking dashboard with 6 kpis and lists', async () => {
  const repo = new MockRepository();
  const data = await repo.getBookingDashboard();
  expect(data.kpis.length).toBe(6);
  expect(data.kpis.map((k) => k.status)).toEqual([
    'tentative', 'confirmed', 'contract', 'pending-payment', 'pending-settlement', 'done',
  ]);
  const tentative = data.kpis[0];
  expect(tentative.amount).toBeCloseTo(5679.48, 2);
  expect(tentative.count).toBe(7);
  const liquidado = data.kpis[5];
  expect(liquidado.amount).toBe(3500);
  expect(liquidado.count).toBe(2);
  expect(data.kpis.some((k) => k.status === 'offer')).toBe(false);
});
```
(Ajustar cualquier otra aserción del mismo fichero que asuma 7 tiles.)

- [ ] **Step 2: Ejecutar → falla.** Run: `npx vitest run src/repositories/MockRepository.booking.test.ts` → FAIL (length 7 ≠ 6).

- [ ] **Step 3: Actualizar el seed en `MockRepository.ts`**

Reemplazar el array `kpis` (líneas ~111-117) por los **6** tiles del live:
```ts
      kpis: [
        { id: '1', label: 'TENTATIVE', amount: 5679.48, count: 7, status: 'tentative' },
        { id: '2', label: 'CONFIRMADO', amount: 10200, count: 8, status: 'confirmed' },
        { id: '3', label: 'CONTRATO', amount: 0, count: 0, status: 'contract' },
        { id: '4', label: 'PENDIENTE COBRO', amount: 0, count: 0, status: 'pending-payment' },
        { id: '5', label: 'PENDIENTE LIQUIDAR', amount: 1850, count: 3, status: 'pending-settlement' },
        { id: '6', label: 'LIQUIDADO', amount: 3500, count: 2, status: 'done' },
      ],
```

- [ ] **Step 4: Ejecutar → verde.** Run: `npx vitest run src/repositories/MockRepository.booking.test.ts` → PASS.

- [ ] **Step 5: Actualizar `KpiCard.test.tsx` (fallará)**

Añadir aserciones de los relabels y de la navegación plana:
```tsx
it('relabela pending-payment como "Pendiente cobro" y done como "Liquidado"', () => {
  render(<MemoryRouter><KpiCard kpi={{ id: 'x', label: '', amount: 0, count: 0, status: 'pending-payment' }} /></MemoryRouter>);
  expect(screen.getByText('Pendiente cobro')).toBeInTheDocument();
});
it('done se muestra como "Liquidado"', () => {
  render(<MemoryRouter><KpiCard kpi={{ id: 'y', label: '', amount: 0, count: 0, status: 'done' }} /></MemoryRouter>);
  expect(screen.getByText('Liquidado')).toBeInTheDocument();
});
```
(Asegurar `MemoryRouter` en el render porque `KpiCard` usa `useNavigate`; si el test existente ya lo envuelve, seguir ese patrón.)

- [ ] **Step 6: Ejecutar → falla.** Run: `npx vitest run src/features/booking/components/KpiCard.test.tsx` → FAIL.

- [ ] **Step 7: Actualizar `KpiCard.tsx`**

En `statusLabels`, relabelar (MANTENER la clave `offer` para el Record exhaustivo):
```tsx
const statusLabels: Record<Kpi['status'], string> = {
  tentative: 'Tentative',
  offer: 'Oferta',
  confirmed: 'Confirmado',
  contract: 'Contrato',
  'pending-payment': 'Pendiente cobro',
  'pending-settlement': 'Pendiente liquidar',
  done: 'Liquidado',
};
```
Y cambiar la navegación a la ruta plana de Shows:
```tsx
      onClick={() => navigate(`/shows?status=${kpi.status}`)}
```

- [ ] **Step 8: Ajustar el grid de tiles en `BookingDashboardPage.tsx`**

Cambiar la clase del grid de tiles de 7 a 6 columnas:
```tsx
      <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
```
(era `sm:grid-cols-4 lg:grid-cols-7`.)

- [ ] **Step 9: Ejecutar todo → verde**

Run: `npx vitest run src/features/booking src/repositories/MockRepository.booking.test.ts && npx tsc --noEmit && npm run lint`
Expected: PASS.

- [ ] **Step 10: Commit**
```bash
git add src/repositories/MockRepository.ts src/repositories/MockRepository.booking.test.ts src/features/booking/components/KpiCard.tsx src/features/booking/components/KpiCard.test.tsx src/features/booking/pages/BookingDashboardPage.tsx
git commit -m "feat(conceptone): dashboard financiero 6 tiles con valores del live + relabels cobro/liquidado"
```

---

### Task 3: Eliminar Logística/Artistas/Analítica (páginas, hooks y componentes huérfanos)

**Files:**
- Delete: `src/features/booking/pages/LogisticsPage.tsx`, `ArtistsPage.tsx`, `AnalyticsPage.tsx`
- Delete: `src/features/booking/hooks/useLogistics.ts`, `useArtists.ts`, `useAnalytics.ts`
- Delete (si quedan huérfanos, verificar antes): `src/features/booking/components/ArtistCard.tsx`, `ChartPlaceholder.tsx`, `TaskList.tsx` (+ sus `.test.tsx`)
- Modify: `src/features/booking/components/index.ts`, `src/features/booking/hooks/index.ts` (si existe), y cualquier otro `index.ts` que los exporte

**Interfaces:** ninguna nueva; es limpieza. Al terminar, `grep` no debe encontrar referencias vivas a estos símbolos.

- [ ] **Step 1: Localizar consumidores de cada símbolo a borrar**

Run:
```bash
grep -rnE "LogisticsPage|ArtistsPage|AnalyticsPage|useLogistics|useArtists|useAnalytics|ArtistCard|ChartPlaceholder|TaskList" src
```
Anotar quién usa cada uno. Las páginas/hooks ya no se referencian desde `router.tsx`/`index.ts` tras Task 1. Un componente (`ArtistCard`/`ChartPlaceholder`/`TaskList`) solo se borra si su ÚNICO consumidor era una de las páginas eliminadas (si `TaskList` lo usa el dashboard u otra vista viva, NO se borra).

- [ ] **Step 2: Borrar los ficheros huérfanos** (páginas + hooks + los componentes que el paso 1 confirme sin consumidores vivos) y sus `.test.tsx` asociados. Retirar sus líneas de export en `components/index.ts` y en el `hooks/index.ts` correspondiente.

- [ ] **Step 3: Verificar que no quedan referencias colgando**

Run:
```bash
grep -rnE "LogisticsPage|ArtistsPage|AnalyticsPage|useLogistics|useArtists|useAnalytics" src
```
Expected: sin resultados (0 líneas). Para los componentes, repetir el grep solo de los que se hayan borrado.

- [ ] **Step 4: Suite completa verde**

Run: `npx vitest run && npx tsc --noEmit && npm run lint`
Expected: PASS, 0 warnings. Anotar el nº de tests.

- [ ] **Step 5: Commit**
```bash
git add -A
git commit -m "refactor(conceptone): elimina Logística/Artistas/Analítica (páginas, hooks y componentes huérfanos)"
```

---

### Task 4: Cierre de Fase A (verificación + aviso al coordinador)

**Files:** ninguno de producción (salvo fixes menores que surjan).

- [ ] **Step 1: Verde total del módulo**

Run: `npx vitest run && npx tsc --noEmit && npm run lint`
Expected: PASS, 0 warnings, árbol limpio (`git status`).

- [ ] **Step 2: Sanity visual local (no bloqueante de Fase A)**

Levantar `npm run dev`, navegar `/conceptone` (6 tiles + 4 secciones), `/shows` (intacto), y `/calendario-c1` · `/disponibilidad` · `/contactos` (stubs bajo el shell con las 5 tabs). Confirmar que la tab activa marca `aria-current`. NO hace falta Playwright ours-vs-live todavía: la verificación formal es al **cierre del módulo** (tras Fase D).

- [ ] **Step 3: Avisar al coordinador por herdr**

`herdr agent prompt w1:p1 "RECIBIDO/HITO: Fase A de ConceptOne cerrada y verde (N tests). Sub-nav planas + dashboard 6 tiles + stubs + limpieza. Sigo con Fase B (Shows) o espero indicación."`
No abrir PR todavía: el patrón es **una sola PR al cierre del módulo** (tras Fase D), como Herramientas/Mixmag.

---

## Notas de decisión (de la spec §5)
- **D1 rutas planas** — Task 1. **D2 Shows intacto** — no se toca `ShowsPage` en Fase A. **D3 enum sin cambios** — Task 2 solo relabela el diccionario. **D4 valores = evidencia del live** — Task 2 (tiles) + verificación de cierre (filas de secciones).
- Si al implementar Task 1 el layout route sin prefijo diera problemas con `AppLayout`/tab activa, alternativa: mantener el `Route path="/conceptone"` como wrapper y declarar las otras 4 como rutas hermanas que también renderizan `ConceptOneShell` — pero la opción del layout route sin prefijo es la limpia y la preferida.
```
