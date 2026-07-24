# Herramientas · Fase C (cierre: tab Real · Comentarios · Responsables · Exports · Info) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cerrar el módulo Herramientas: construir la tab **Real** con motor propio (`calculos-real.ts`) que reproduce al céntimo las cifras del live, cablear **Comentarios**, **picker de responsables**, botón **"i"** ("¿Cómo se calcula?") y los **exports en MOCK FIEL**, y eliminar el último hardcode (`resultadoReal`) — todo según la spec `docs/superpowers/specs/2026-07-24-herramientas-fase-c-cierre-design.md`.

**Architecture:** nuevo módulo puro `data/calculos-real.ts` (reusa `calcularResultadoAcuerdo` de Fase A, cero duplicación), datos `data/personas.ts` y `data/textos-info.ts`; nuevos componentes `RealTab`, `CajaRealTable`, `ComentariosPanel`, `ResponsablesPicker`, `InfoComoSeCalcula`; `TicketingTable`/`MesasVipTable` ganan prop `modo`; la cabecera del detalle se parte en `ProyeccionToolbar` (flotante) + `ProyeccionEstadoCard` (tarjeta) para hospedar fielmente los paneles.

**Tech Stack:** React 19, react-router 7, Tailwind, Vitest + RTL + jest-dom, TypeScript ES2020.

## Global Constraints

- Es-ES en todos los textos; reusar `formatCurrency` de `@/lib/format.ts`; porcentajes con `.toFixed(1)` + `%` (punto decimal, "−707.7%"); el paréntesis "evento completo" usa `Math.round` sin decimales ("(-708%)"). Patrón ya en `ResultadoAcuerdoCard`/`PrevisionTab`.
- Un commit por tarea. Cada tarea termina en verde: `npx vitest run`, `npx tsc --noEmit`, `npm run lint` (eslint `--max-warnings 0`).
- No usar `Array.prototype.at()` (ES2020). Reusar primitivos de `@/components/ui` (`Card`, `Button`, `SegmentedControl`, `Select`, `Input`, `Textarea`, `StatCard`, `Badge`, `Avatar`).
- Fuente de verdad: spec de Fase C + `docs/references/herramientas/` (en especial `live-proyeccion-detalle-real.png` RE-CAPTURADO, `live-info-como-se-calcula.png`, `live-panel-comentarios.png`, `live-picker-responsables.png`). Los `entradasReal` del seed son evidencia del live (spec §3.2) — no cambiarlos.
- Alcance: solo Fase C. No re-derivar el motor de Previsión/Acuerdo (ya verificado en Fase B). Exports = MOCK (no libs PDF/Excel).
- Exports = **MOCK FIEL** (delta consciente, spec D5): botones presentes e idénticos, sin generar fichero. Repetir esta nota en la descripción de la PR.

---

### Task 1: Motor real `calculos-real.ts` + siembra de inputs reales

**Files:**
- Create: `src/features/herramientas/data/calculos-real.ts`
- Create: `src/features/herramientas/data/calculos-real.test.ts`
- Modify: `src/features/herramientas/data/seed.ts` (añadir `entradasReal` a releases y `mesasReal: 0` a zonas VIP; **mantener** `resultadoReal` por ahora — se retira en Task 2 para no romper el árbol)
- Modify: `src/features/herramientas/data/seed.test.ts` (aserciones de los nuevos campos reales)

**Interfaces:**
- Consumes: `Proyeccion`, `AcuerdoBrutos`, `ResultadoAcuerdo` (de `./types` / `./calculos-acuerdo`), `calcularResultadoAcuerdo` (de `./calculos-acuerdo`).
- Produces:
  - `calcularBrutosReal(p: Proyeccion): AcuerdoBrutos`
  - `asistenciaReal(p: Proyeccion): number`
  - `tieneDatosReal(p: Proyeccion): boolean`
  - `calcularResultadoReal(p: Proyeccion): ResultadoAcuerdo | null`

- [ ] **Step 1: Sembrar los inputs reales en `seed.ts`**

En el array `ticketing`, añadir `entradasReal` (evidencia del live, spec §3.2) — respetar el orden existente:
```ts
{ id: 'tk-1', orden: 0, release: 'Early Access - acceso antes de las 7:30pm', entradas: 100, precio: 8, entradasReal: 20 },
{ id: 'tk-2', orden: 1, release: 'Online · Release 1', entradas: 200, precio: 10, entradasReal: 20 },
{ id: 'tk-3', orden: 2, release: 'Online · Release 3', entradas: 150, precio: 12, entradasReal: 0 },
{ id: 'tk-4', orden: 3, release: 'Online · Release 2', entradas: 50, precio: 15, entradasReal: 9 },
{ id: 'tk-5', orden: 4, release: 'Pack 2 Entradas', entradas: 50, precio: 7.5, entradasReal: 28 },
{ id: 'tk-6', orden: 5, release: 'Pack 5 Entradas', entradas: 50, precio: 8, entradasReal: 5 },
{ id: 'tk-7', orden: 6, release: 'Taquilla', entradas: 0, precio: 0, entradasReal: 0 },
```
En `mesasVip`, añadir `mesasReal: 0` a las 3 zonas. Dejar `cajaReal: []` como está. **No** tocar `resultadoReal` todavía.

- [ ] **Step 2: Escribir el test del motor (fallará: el módulo no existe)**

`calculos-real.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { seedProyecciones } from './seed';
import { calcularBrutosReal, asistenciaReal, tieneDatosReal, calcularResultadoReal } from './calculos-real';

const p = seedProyecciones[0];

describe('calculos-real (evidencia del live PQ @ SLS Barcelona)', () => {
  it('ticketing bruto real = Σ entradasReal × precio = 745,00€', () => {
    expect(calcularBrutosReal(p).ticketing).toBeCloseTo(745, 2);
  });
  it('VIP real = 0 (mesasReal 0) y no usa probabilidad', () => {
    expect(calcularBrutosReal(p).mesasVip).toBe(0);
  });
  it('asistencia real = Σ entradasReal (82) + invitaciones (50) = 132', () => {
    expect(asistenciaReal(p)).toBe(132);
  });
  it('nuestros ingresos reales = 677,27€ (745/1,1, ticketing 100% neto)', () => {
    expect(calcularResultadoReal(p)!.nuestrosIngresos).toBeCloseTo(677.27, 2);
  });
  it('beneficio real = -4792,73€', () => {
    expect(calcularResultadoReal(p)!.beneficioPorAcuerdo).toBeCloseTo(-4792.73, 2);
  });
  it('margen real = -707.7% (toFixed 1)', () => {
    expect(calcularResultadoReal(p)!.margenSobreIngresos.toFixed(1)).toBe('-707.7');
  });
  it('evento completo real = -4792,73€ (-708% redondeado)', () => {
    const r = calcularResultadoReal(p)!;
    expect(r.eventoCompletoBeneficio).toBeCloseTo(-4792.73, 2);
    expect(Math.round(r.margenEventoCompleto)).toBe(-708);
  });
  it('tieneDatosReal true con entradasReal sembradas', () => {
    expect(tieneDatosReal(p)).toBe(true);
  });
  it('tieneDatosReal false sin ningún input real', () => {
    const vacio = { ...p, ticketing: p.ticketing.map((r) => ({ ...r, entradasReal: undefined })), mesasVip: p.mesasVip.map((z) => ({ ...z, mesasReal: undefined })), cajaReal: [] };
    expect(tieneDatosReal(vacio)).toBe(false);
    expect(calcularResultadoReal(vacio)).toBeNull();
  });
  it('caja real suma al bucket barras (impacto nulo si vacío; no nulo si hay líneas)', () => {
    const conCaja = { ...p, cajaReal: [{ id: 'c1', fuente: 'Barra 1', importe: 100 }] };
    expect(calcularBrutosReal(conCaja).barras).toBe(100);
  });
});
```

- [ ] **Step 3: Ejecutar el test para comprobar que falla**

Run: `npx vitest run src/features/herramientas/data/calculos-real.test.ts`
Expected: FAIL — `calculos-real` no existe.

- [ ] **Step 4: Implementar `calculos-real.ts`**

```ts
import { calcularResultadoAcuerdo, type ResultadoAcuerdo } from './calculos-acuerdo';
import type { AcuerdoBrutos, Proyeccion } from './types';

/**
 * Motor de la tab Real (Fase C). A diferencia de Previsión (proyección en cascada por
 * escenario), aquí los brutos salen de datos EJECUTADOS: entradas/mesas realmente vendidas
 * y la caja real. Reusa `calcularResultadoAcuerdo` (Fase A) — cero duplicación de la lógica
 * de acuerdo/IVA/gastos. Reproduce al céntimo el seed del live (spec §3).
 */
export function calcularBrutosReal(p: Proyeccion): AcuerdoBrutos {
  const ticketing = p.ticketing.reduce((a, r) => a + (r.entradasReal ?? 0) * r.precio, 0);
  const mesasVip = p.mesasVip.reduce((a, z) => a + (z.mesasReal ?? 0) * z.precio, 0);
  // "Caja real" es una tabla libre indiferenciada; se pliega en el bucket `barras`
  // (mismo IVA que comida/VIP). Impacto nulo en el seed (cajaReal vacío).
  const barras = p.cajaReal.reduce((a, l) => a + l.importe, 0);
  return { ticketing, mesasVip, barras, comida: 0, merchandising: 0 };
}

export function asistenciaReal(p: Proyeccion): number {
  const entradas = p.ticketing.reduce((a, r) => a + (r.entradasReal ?? 0), 0);
  return entradas + p.eventoAforo.invitaciones;
}

export function tieneDatosReal(p: Proyeccion): boolean {
  return (
    p.ticketing.some((r) => r.entradasReal !== undefined && r.entradasReal !== 0) ||
    p.mesasVip.some((z) => z.mesasReal !== undefined && z.mesasReal !== 0) ||
    p.cajaReal.length > 0
  );
}

export function calcularResultadoReal(p: Proyeccion): ResultadoAcuerdo | null {
  if (!tieneDatosReal(p)) return null;
  return calcularResultadoAcuerdo(p.acuerdo, calcularBrutosReal(p), p.eventoAforo, p.gastos);
}
```
(Verificar que `calculos-acuerdo.ts` re-exporta el tipo `ResultadoAcuerdo`; ya lo hace — es `export interface ResultadoAcuerdo`.)

- [ ] **Step 5: Actualizar `seed.test.ts`** con aserciones de los nuevos campos:
```ts
it('siembra entradasReal (evidencia del live) que dan 745,00€ de ticketing real', () => {
  const real = p.ticketing.map((r) => r.entradasReal);
  expect(real).toEqual([20, 20, 0, 9, 28, 5, 0]);
});
it('mesasReal = 0 en las 3 zonas VIP', () => {
  expect(p.mesasVip.map((z) => z.mesasReal)).toEqual([0, 0, 0]);
});
```

- [ ] **Step 6: Ejecutar tests + tsc**

Run: `npx vitest run src/features/herramientas/data/ && npx tsc --noEmit`
Expected: PASS (todos verdes; `resultadoReal` sigue existiendo, nada roto).

- [ ] **Step 7: Commit**
```bash
git add src/features/herramientas/data/calculos-real.ts src/features/herramientas/data/calculos-real.test.ts src/features/herramientas/data/seed.ts src/features/herramientas/data/seed.test.ts
git commit -m "feat(herramientas): motor real (calculos-real) + siembra entradasReal del live"
```

---

### Task 2: Retirar el hardcode `resultadoReal` y migrar `ProyeccionRow` a lo derivado

**Files:**
- Modify: `src/features/herramientas/data/types.ts` (quitar `resultadoReal` de `Proyeccion` y la interfaz `ResultadoReal`)
- Modify: `src/features/herramientas/data/seed.ts` (quitar la línea `resultadoReal: {...}`)
- Modify: `src/features/herramientas/data/proyecciones-crud.ts` (quitar `resultadoReal: null`)
- Modify: `src/features/herramientas/components/ProyeccionRow.tsx`
- Modify: `src/features/herramientas/components/ProyeccionRow.test.tsx`

**Interfaces:**
- `Proyeccion` pierde `resultadoReal`. `ProyeccionRow` usa `tieneDatosReal(p)` (badge "Real") y `calcularResultadoReal(p)?.beneficioPorAcuerdo` (cifra REAL, o "—" si null).

- [ ] **Step 1: Actualizar `ProyeccionRow.test.tsx` (fallará)**

Sustituir cualquier aserción/props que dependa de `resultadoReal`. Añadir:
```ts
it('muestra el badge "Real" y el beneficio real derivado (-4792,73 €) para el seed', () => {
  render(<MemoryRouter><ProyeccionRow proyeccion={seedProyecciones[0]} onDuplicate={() => {}} onDelete={() => {}} /></MemoryRouter>);
  expect(screen.getByText('Real')).toBeInTheDocument();
  // moneda es-ES usa NBSP → regex \s?, convención del repo (ver PrevisionTab.test.tsx)
  expect(screen.getByText(/^-4\.?792,73\s?€$/)).toBeInTheDocument();
});
it('sin datos reales muestra "—" y ningún badge Real', () => {
  const sinReal = { ...seedProyecciones[0], ticketing: seedProyecciones[0].ticketing.map((r) => ({ ...r, entradasReal: undefined })), mesasVip: seedProyecciones[0].mesasVip.map((z) => ({ ...z, mesasReal: undefined })), cajaReal: [] };
  render(<MemoryRouter><ProyeccionRow proyeccion={sinReal} onDuplicate={() => {}} onDelete={() => {}} /></MemoryRouter>);
  expect(screen.queryByText('Real')).not.toBeInTheDocument();
  expect(screen.getByText('—')).toBeInTheDocument();
});
```
(Asegurar imports: `seedProyecciones` de `../data/seed`, `MemoryRouter` de `react-router`.)

- [ ] **Step 2: Ejecutar test → falla**

Run: `npx vitest run src/features/herramientas/components/ProyeccionRow.test.tsx`
Expected: FAIL — `ProyeccionRow` aún usa `proyeccion.resultadoReal`.

- [ ] **Step 3: Migrar `ProyeccionRow.tsx`**

Reemplazar los usos de `proyeccion.resultadoReal`:
```tsx
import { calcularResultadoReal, tieneDatosReal } from '../data/calculos-real';
// ...
const real = calcularResultadoReal(proyeccion);
// badge:
{tieneDatosReal(proyeccion) && <Badge variant="sky">Real</Badge>}
// cifra REAL:
<p className={cn('font-semibold', (real?.beneficioPorAcuerdo ?? 0) < 0 ? 'text-red-600' : 'text-emerald-600')}>
  {real ? formatCurrency(real.beneficioPorAcuerdo) : '—'}
</p>
```

- [ ] **Step 4: Quitar el campo del modelo**

`types.ts`: eliminar `resultadoReal: ResultadoReal | null;` de `Proyeccion` y la interfaz `ResultadoReal` (con su comentario). `seed.ts`: quitar `resultadoReal: { beneficioNeto: -4792.73 }` y su comentario. `proyecciones-crud.ts`: quitar `resultadoReal: null`.

- [ ] **Step 5: Ejecutar todo → verde**

Run: `npx vitest run src/features/herramientas && npx tsc --noEmit && npm run lint`
Expected: PASS. (Buscar cualquier otro consumidor de `resultadoReal`/`ResultadoReal` con `grep -rn resultadoReal src` → no debe quedar ninguno.)

- [ ] **Step 6: Commit**
```bash
git add src/features/herramientas
git commit -m "refactor(herramientas): elimina hardcode resultadoReal; ProyeccionRow usa el motor real"
```

---

### Task 3: `TicketingTable` gana `modo: 'prevision' | 'real'`

**Files:**
- Modify: `src/features/herramientas/components/TicketingTable.tsx`
- Modify: `src/features/herramientas/components/TicketingTable.test.tsx`

**Interfaces:**
- `TicketingTable` props ganan `modo?: 'prevision' | 'real'` (default `'prevision'`). En `'real'`: cabecera "ENTRADAS" → "ENTRADAS PREV."; se **oculta** la columna "FACTURACIÓN"; se añade columna editable **"ENTRADAS REAL"** (spinbutton, `onUpdate` de `entradasReal`); bajo cada fila, sub-línea derecha "Facturación real {entradasReal×precio}"; pie "Total ticketing · {Σ entradasReal} entradas" · "{Σ facturación real}" · "Por acuerdo {ingresoTramo real}".

- [ ] **Step 1: Escribir el test del modo real (fallará)**
```ts
it('modo="real": muestra ENTRADAS PREV., ENTRADAS REAL y facturación real 745,00€', () => {
  render(<TicketingTable proyeccion={seedProyecciones[0]} escenario="base" modo="real" onUpdate={() => {}} />);
  expect(screen.getByText('ENTRADAS PREV.')).toBeInTheDocument();
  expect(screen.getByText('ENTRADAS REAL')).toBeInTheDocument();
  expect(screen.queryByText('FACTURACIÓN')).not.toBeInTheDocument();
  expect(screen.getByText(/^745,00\s?€$/)).toBeInTheDocument(); // moneda NBSP → \s?
  expect(screen.getByText(/82 entradas/)).toBeInTheDocument();
});
it('modo="prevision" (default) no muestra ENTRADAS REAL', () => {
  render(<TicketingTable proyeccion={seedProyecciones[0]} escenario="base" onUpdate={() => {}} />);
  expect(screen.queryByText('ENTRADAS REAL')).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Ejecutar → falla.** Run: `npx vitest run src/features/herramientas/components/TicketingTable.test.tsx` → FAIL.

- [ ] **Step 3: Implementar el `modo`** en `TicketingTable.tsx`: añadir la prop; condicionar cabeceras/columnas; en modo real, editar `entradasReal` (spinbutton que hace `onUpdate` del array `ticketing` con el release actualizado); calcular `facturaciónReal = entradasReal×precio` por fila y `Σ` en el pie; "Por acuerdo" en modo real usa `ingresoTramo(p.acuerdo.ticketing, brutoRealTicketing, ivaTicketing)` (importar de `../data/calculos-acuerdo`). Mantener reordenar/borrar/añadir. Verificar contra `live-proyeccion-detalle-real.png` (columnas y sub-línea "Facturación real").

- [ ] **Step 4: Ejecutar → verde.** Run: `npx vitest run src/features/herramientas/components/TicketingTable.test.tsx && npx tsc --noEmit` → PASS.

- [ ] **Step 5: Commit**
```bash
git add src/features/herramientas/components/TicketingTable.*
git commit -m "feat(herramientas): TicketingTable modo real (ENTRADAS PREV./REAL + facturación real)"
```

---

### Task 4: `MesasVipTable` gana `modo: 'prevision' | 'real'`

**Files:**
- Modify: `src/features/herramientas/components/MesasVipTable.tsx`
- Modify: `src/features/herramientas/components/MesasVipTable.test.tsx`

**Interfaces:**
- Props ganan `modo?: 'prevision' | 'real'`. En `'real'`: se añade columna editable **"MESAS REAL"** (`mesasReal`, spinbutton); **sin** sub-línea de facturación por fila; pie "Total VIP {Σ mesasReal×precio}" · "Por acuerdo {ingresoTramo real}". En el seed, todo 0 → "0,00 €".

- [ ] **Step 1: Test (fallará)**
```ts
it('modo="real": añade MESAS REAL y total real 0,00€ (mesasReal 0)', () => {
  render(<MesasVipTable proyeccion={seedProyecciones[0]} escenario="base" modo="real" onUpdate={() => {}} />);
  expect(screen.getByText('MESAS REAL')).toBeInTheDocument();
  // "0,00 €" aparece varias veces (total real + por acuerdo) → getAllByText; moneda NBSP → \s?
  expect(screen.getAllByText(/^0,00\s?€$/).length).toBeGreaterThan(0);
});
```
- [ ] **Step 2: Ejecutar → falla.**
- [ ] **Step 3: Implementar** análogo a Task 3 (columna MESAS REAL editando `mesasReal`, total real = Σ mesasReal×precio, "Por acuerdo" real). Verificar contra el PNG.
- [ ] **Step 4: Ejecutar → verde** (`vitest` del fichero + `tsc`).
- [ ] **Step 5: Commit** `feat(herramientas): MesasVipTable modo real (columna MESAS REAL)`

---

### Task 5: `CajaRealTable` (nuevo)

**Files:**
- Create: `src/features/herramientas/components/CajaRealTable.tsx`
- Create: `src/features/herramientas/components/CajaRealTable.test.tsx`

**Interfaces:**
- `CajaRealTable({ proyeccion, onUpdate })`: tabla libre de `cajaReal: CajaRealLinea[]`. Copy exacto (spec §4.1): título "Caja real (barras, comida, extras)", subtítulo "Una línea por fuente: cada TPV de barra o datáfono, guardarropa, comida, shishas…", botones "Rellenar con previsión" y "+ Añadir", estado vacío "Sin líneas todavía. Añade o rellena con la previsión.", pie "Total caja neto {Σ importe}". "Rellenar con previsión" genera líneas Barras/Comida/Merch desde `calcularBrutosEscenario(p,'base')` (importar de `../data/calculos-escenarios`).

- [ ] **Step 1: Test (fallará)**
```ts
it('estado vacío muestra el copy del live y total 0,00€', () => {
  render(<CajaRealTable proyeccion={seedProyecciones[0]} onUpdate={() => {}} />);
  expect(screen.getByText('Sin líneas todavía. Añade o rellena con la previsión.')).toBeInTheDocument();
  expect(screen.getByText(/Total caja neto/)).toBeInTheDocument();
});
it('"Rellenar con previsión" crea líneas desde la previsión base', () => {
  const onUpdate = vi.fn();
  render(<CajaRealTable proyeccion={seedProyecciones[0]} onUpdate={onUpdate} />);
  fireEvent.click(screen.getByText('Rellenar con previsión'));
  expect(onUpdate).toHaveBeenCalled();
  const arg = onUpdate.mock.calls[0][0].cajaReal;
  expect(arg.length).toBeGreaterThan(0);
});
```
- [ ] **Step 2: Ejecutar → falla.**
- [ ] **Step 3: Implementar** `CajaRealTable.tsx` reusando `CollapsibleSection` (abierto en Real) + `Card`. Cada línea: `Input` fuente + `Input` number importe + borrar. "+ Añadir" agrega `{ id, fuente:'', importe:0 }` (id con `crypto.randomUUID()` como el resto del repo — verificar patrón existente en `MesasVipTable`/`TicketingTable`). "Rellenar con previsión" → `onUpdate({ cajaReal: [ {fuente:'Barras', importe: brutos.barras}, {fuente:'Comida', importe: brutos.comida}, {fuente:'Merch', importe: brutos.merchandising} ].filter(l=>l.importe>0).map(l=>({id:crypto.randomUUID(),...l})) })`.
- [ ] **Step 4: Ejecutar → verde.**
- [ ] **Step 5: Commit** `feat(herramientas): CajaRealTable (tabla libre + rellenar con previsión)`

---

### Task 6: `RealTab` orquestador + integración en `ProyeccionDetailPage`

**Files:**
- Create: `src/features/herramientas/components/RealTab.tsx`
- Create: `src/features/herramientas/components/RealTab.test.tsx`
- Modify: `src/features/herramientas/pages/ProyeccionDetailPage.tsx` (reemplazar `<TabPlaceholder fase="C" />` por `<RealTab .../>`)
- Modify: `src/features/herramientas/pages/ProyeccionDetailPage.test.tsx`

**Interfaces:**
- `RealTab({ proyeccion, onUpdate })`. Consume `calcularBrutosReal`, `asistenciaReal`, `calcularResultadoReal` (Task 1), `ResultadoAcuerdoCard`, `GastoPorCategoriaCard`, `EventoAforoCard`, `TicketingTable modo="real"`, `MesasVipTable modo="real"`, `CajaRealTable`, `GastosTable`.

- [ ] **Step 1: Test (fallará)** — reproduce los agregados del live en pantalla:
```ts
it('muestra los 5 KPIs reales del live (677,27 / -5470 / -4792,73 / -707.7% / 132)', () => {
  render(<RealTab proyeccion={seedProyecciones[0]} onUpdate={() => {}} />);
  // varios de estos valores se repiten (KPI + Resultado card + pie de tablas) → getAllByText; moneda NBSP → \s?
  expect(screen.getAllByText(/^677,27\s?€$/).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/^-4\.?792,73\s?€$/).length).toBeGreaterThan(0);
  expect(screen.getAllByText('-707.7%').length).toBeGreaterThan(0);
  expect(screen.getByText('132 / 600')).toBeInTheDocument();
  expect(screen.getByText('22% ocupación')).toBeInTheDocument();
  expect(screen.getByText('Asistencia real')).toBeInTheDocument();
  expect(screen.queryByText('Punto de equilibrio')).not.toBeInTheDocument();
});
```
- [ ] **Step 2: Ejecutar → falla.**
- [ ] **Step 3: Implementar `RealTab.tsx`** copiando la estructura de `PrevisionTab` pero: sin `EscenarioSelector`/`EscenariosTable`/`AjustesEscenariosCard`; grid de **5** `StatCard` (spec §4, KPI 5 = "Asistencia real" con `asistenciaReal(p)` y ocupación `Math.round(asistenciaReal/aforo*100)`); `resultado = calcularResultadoReal(p)!` (RealTab solo se muestra con datos reales; si fuera null, mostrar los ceros — pero el seed siempre tiene datos); reusar `ResultadoAcuerdoCard`/`GastoPorCategoriaCard`; secciones `EventoAforoCard` + `TicketingTable modo="real"` + `MesasVipTable modo="real"` + `CajaRealTable` + `GastosTable`. Los captions de los StatCard: Ingresos `Total {formatCurrency(Σ brutosReal)}`, Inversión `Total {formatCurrency(-totalGastos)}`, Beneficio `Total {formatCurrency(eventoCompletoBeneficio)}`.
- [ ] **Step 4: Integrar en `ProyeccionDetailPage.tsx`**: `{tab === 'real' && <RealTab proyeccion={proyeccion} onUpdate={handleUpdate} />}`; quitar el import de `TabPlaceholder` si ya no se usa. Añadir/ajustar test de la página que verifica que la tab Real ya no muestra el placeholder.
- [ ] **Step 5: Ejecutar → verde** (`vitest` de RealTab + página, `tsc`, `lint`).
- [ ] **Step 6: Commit** `feat(herramientas): RealTab (cuenta de explotación real) integrada en el detalle`

---

### Task 7: `personas.ts` (evidencia del live) + `ResponsablesPicker`

**Files:**
- Create: `src/features/herramientas/data/personas.ts`
- Create: `src/features/herramientas/components/ResponsablesPicker.tsx`
- Create: `src/features/herramientas/components/ResponsablesPicker.test.tsx`
- Add (evidencia): `docs/references/herramientas/live-picker-responsables-full.png`

**Interfaces:**
- `personas.ts`: `export const personasDisponibles: Responsable[]` (pool local, spec D4 — **lista EXACTA capturada del live**, mismos nombres y orden; cada uno `{ id, nombre, iniciales }`). `export function buscarPersonas(query: string): Responsable[]`.

- [ ] **Step 0 (D4 — re-captura SOLO LECTURA, ANTES de sembrar):** con el script Playwright del proyecto (patrón de la re-captura de la tab Real), loguear `test@blackmoose.es` en `https://bookings.conceptoneagency.com`, abrir la proyección, pulsar **"＋ Añadir"** (abre el desplegable — acción de solo-lectura, no muta nada), y **extraer del DOM la lista completa de personas (nombres + orden + iniciales)** además de un screenshot `live-picker-responsables-full.png`. **NO** seleccionar a nadie, **NO** guardar, cerrar con Escape. Sembrar `personas.ts` con esa lista exacta (respetando el orden del live y marcando iniciales tal como las muestra). Commit del PNG + `personas.ts` puede ir junto al resto de la Task.
- `ResponsablesPicker({ asignados: Responsable[], onAdd: (r: Responsable) => void, onClose: () => void })`: `Input` "Buscar persona…" + lista; asignados con "✓" y no clicables; clic en no asignado → `onAdd`.

- [ ] **Step 1: Test (fallará)**
```ts
it('lista personas, marca asignados con ✓ y añade al hacer clic en uno libre', () => {
  const onAdd = vi.fn();
  render(<ResponsablesPicker asignados={[{ id: 'resp-jack', nombre: 'Jack', iniciales: 'JH' }]} onAdd={onAdd} onClose={() => {}} />);
  fireEvent.change(screen.getByPlaceholderText('Buscar persona…'), { target: { value: 'Alba' } });
  fireEvent.click(screen.getByText('Alba Gelabert'));
  expect(onAdd).toHaveBeenCalledWith(expect.objectContaining({ nombre: 'Alba Gelabert' }));
});
```
- [ ] **Step 2: Ejecutar → falla.**
- [ ] **Step 3: Implementar** `personas.ts` (pool sembrado con los nombres cortos del live + iniciales) y `ResponsablesPicker.tsx` (dropdown con `Input` + lista filtrada; asignados con "✓"; `onClose` en Escape/blur). Reusar `Avatar` de `@/components/ui` para las iniciales.
- [ ] **Step 4: Ejecutar → verde.**
- [ ] **Step 5: Commit** `feat(herramientas): personas + ResponsablesPicker`

---

### Task 8: Partir la cabecera (`ProyeccionToolbar` + `ProyeccionEstadoCard`) y cablear el picker

**Files:**
- Create: `src/features/herramientas/components/ProyeccionToolbar.tsx` (barra flotante: Volver, nombre, "i", Guardado, Comentarios, PDF Ventas/Explotación, Excel, Guardar)
- Create: `src/features/herramientas/components/ProyeccionEstadoCard.tsx` (tarjeta: ESTADO, REUNIÓN, RESPONSABLES + picker, Convertir en evento)
- Modify: `src/features/herramientas/pages/ProyeccionDetailPage.tsx` (usa los dos nuevos en vez de `ProyeccionHeader`)
- Delete: `src/features/herramientas/components/ProyeccionHeader.tsx` + `.test.tsx` (reemplazados) — o mantener y re-exportar; preferible partir.
- Create: `ProyeccionToolbar.test.tsx`, `ProyeccionEstadoCard.test.tsx`

**Interfaces (spec D2):** el live muestra la toolbar **flotando** (sin tarjeta) y ESTADO/RESPONSABLES en su propia `Card`. `ProyeccionEstadoCard` recibe `onOpenPicker`/`pickerAbierto` y renderiza `ResponsablesPicker` al abrir "＋ Añadir".

- [ ] **Step 1: Tests (fallarán)** — que `ProyeccionEstadoCard` abre el picker y añade un responsable:
```ts
it('"＋ Añadir" abre el picker y añadir invoca onUpdate con el nuevo responsable', () => {
  const onUpdate = vi.fn();
  render(<ProyeccionEstadoCard proyeccion={seedProyecciones[0]} onUpdate={onUpdate} />);
  fireEvent.click(screen.getByText(/Añadir/));
  fireEvent.click(screen.getByText('Alba Gelabert'));
  expect(onUpdate).toHaveBeenCalledWith(expect.objectContaining({ responsables: expect.arrayContaining([expect.objectContaining({ nombre: 'Alba Gelabert' })]) }));
});
```
Y que `ProyeccionToolbar` renderiza los botones (Comentarios, PDF Ventas, PDF Explotación, Excel, Guardar, "i") y **no** está envuelta en `Card` (verificar clase/estructura).
- [ ] **Step 2: Ejecutar → falla.**
- [ ] **Step 3: Implementar** partiendo `ProyeccionHeader.tsx` en los dos componentes (mover el JSX correspondiente; la toolbar sin borde/tarjeta, tal como el live). `ProyeccionToolbar` recibe callbacks `onToggleComentarios`, `onToggleInfo`, `onGuardar`, flags `comentariosAbierto`/`infoAbierta`, y los handlers de export (Task 11). `ProyeccionEstadoCard` gestiona su `pickerAbierto` interno.
- [ ] **Step 4: Actualizar `ProyeccionDetailPage.tsx`** para componer: `<ProyeccionToolbar/>`, luego (condicional) `<ComentariosPanel/>` (Task 9), luego `<ProyeccionEstadoCard/>`, luego tabs, luego (condicional) `<InfoComoSeCalcula/>` (Task 10), luego contenido de tab. Añadir estado `comentariosAbierto`/`infoAbierta`. Migrar/retirar `ProyeccionHeader` y su test.
- [ ] **Step 5: Ejecutar → verde** (`vitest` de los nuevos + página, `tsc`, `lint`; `grep -rn ProyeccionHeader src` → sin referencias colgando).
- [ ] **Step 6: Commit** `refactor(herramientas): parte la cabecera del detalle (toolbar flotante + estado card) y cablea el picker`

---

### Task 9: `ComentariosPanel` + toggle "Comentarios"

**Files:**
- Create: `src/features/herramientas/components/ComentariosPanel.tsx`
- Create: `src/features/herramientas/components/ComentariosPanel.test.tsx`
- Modify: `src/features/herramientas/pages/ProyeccionDetailPage.tsx` (render condicional entre toolbar y estado card)

**Interfaces:**
- `ComentariosPanel({ comentarios, onEnviar })`. `onEnviar(texto: string)`. Copy: título "Notas y comentarios"; estado vacío "Sin comentarios todavía."; `Textarea` "Escribe un comentario…" + botón "Enviar". `autor` = "Tú", `fecha` ISO → formato corto es-ES (spec D3).

- [ ] **Step 1: Test (fallará)**
```ts
it('estado vacío + enviar un comentario invoca onEnviar con el texto', () => {
  const onEnviar = vi.fn();
  render(<ComentariosPanel comentarios={[]} onEnviar={onEnviar} />);
  expect(screen.getByText('Sin comentarios todavía.')).toBeInTheDocument();
  fireEvent.change(screen.getByPlaceholderText('Escribe un comentario…'), { target: { value: 'Ojo con el aforo' } });
  fireEvent.click(screen.getByText('Enviar'));
  expect(onEnviar).toHaveBeenCalledWith('Ojo con el aforo');
});
it('no envía texto vacío/espacios', () => {
  const onEnviar = vi.fn();
  render(<ComentariosPanel comentarios={[]} onEnviar={onEnviar} />);
  fireEvent.click(screen.getByText('Enviar'));
  expect(onEnviar).not.toHaveBeenCalled();
});
```
- [ ] **Step 2: Ejecutar → falla.**
- [ ] **Step 3: Implementar** `ComentariosPanel.tsx` (Card "Notas y comentarios", lista o vacío, `Textarea` controlada + "Enviar" que hace trim y limpia). En `ProyeccionDetailPage`, `onEnviar={(texto) => handleUpdate({ comentarios: [...proyeccion.comentarios, { id: crypto.randomUUID(), autor: 'Tú', texto, fecha: new Date().toISOString() }] })}` y render condicional a `comentariosAbierto`. Mostrar `fecha` con helper de formato corto es-ES (reusar de `@/lib/format`; si no existe uno de fecha, formatear con `toLocaleDateString('es-ES', { day:'numeric', month:'short', year:'numeric' })` — mismo patrón que el commit 58ddc70 "fecha corta es-ES").
- [ ] **Step 4: Ejecutar → verde.**
- [ ] **Step 5: Commit** `feat(herramientas): panel Comentarios (Notas y comentarios) cableado`

---

### Task 10: `textos-info.ts` + `InfoComoSeCalcula` + toggle "i"

**Files:**
- Create: `src/features/herramientas/data/textos-info.ts`
- Create: `src/features/herramientas/components/InfoComoSeCalcula.tsx`
- Create: `src/features/herramientas/components/InfoComoSeCalcula.test.tsx`
- Modify: `src/features/herramientas/pages/ProyeccionDetailPage.tsx` (render condicional bajo las tabs)

**Interfaces:**
- `textos-info.ts`: `export const seccionesInfo: { titulo: string; texto: string }[]` con las 6 secciones (copy exacto de `live-info-como-se-calcula.png`, transcrito abajo).
- `InfoComoSeCalcula({ onClose })`: caja "¿Cómo se calcula?" con "×" y grid 3×2 de las 6 secciones.

Copy exacto (transcrito del live) para `textos-info.ts`:
```ts
export const seccionesInfo = [
  { titulo: 'ASISTENCIA', texto: 'Se calcula sumando las entradas vendidas + las invitaciones. Puedes forzarla a mano si ya conoces el dato real. El aforo máximo solo sirve para el % de ocupación.' },
  { titulo: 'BRUTO Y NETO (IVA)', texto: 'El bruto es la caja con IVA incluido. El neto = bruto ÷ (1 + IVA%). El beneficio y los márgenes se calculan siempre sobre el NETO. Un gasto definido como % se aplica sobre el neto de su base (ticketing, barras…).' },
  { titulo: 'VIP: PROBABILIDAD VS ESCENARIO', texto: 'La "Prob. %" de cada zona es la probabilidad de que SUS mesas se vendan (mesas vendidas = mesas × prob). El escenario (Pesimista/Base/Optimista) es una palanca GLOBAL que multiplica a la vez todo el volumen de venta —entradas, probabilidad VIP y consumo—. Es decir: la prob. VIP es tu expectativa base y el escenario la estresa arriba o abajo.' },
  { titulo: 'CONSUMO', texto: 'Barras = consumiciones/hora × duración × precio medio × asistencia. Comida = % que consume × ticket medio × asistencia. Merch = % de conversión × precio medio × asistencia.' },
  { titulo: 'PUNTO DE EQUILIBRIO (BREAKEVEN)', texto: 'Es el % de la venta proyectada (solo de las vías que elijas) necesario para que el beneficio sea 0. Con acuerdo activo se calcula sobre NUESTRO beneficio y solo cuenta los gastos que asumimos.' },
  { titulo: 'ACUERDO: BMG VS VENUE', texto: 'Nuestro ingreso por vía = nuestro % sobre (bruto o neto) tras descontar la deducción previa (fija + %). Un gasto marcado BMG lo pagamos nosotros y resta de nuestro beneficio; uno marcado Venue lo cubre el local y NO resta de lo nuestro.' },
];
```
- [ ] **Step 1: Test (fallará)**
```ts
it('muestra el título y las 6 secciones; "×" cierra', () => {
  const onClose = vi.fn();
  render(<InfoComoSeCalcula onClose={onClose} />);
  expect(screen.getByText('¿Cómo se calcula?')).toBeInTheDocument();
  expect(screen.getByText('ASISTENCIA')).toBeInTheDocument();
  expect(screen.getByText('ACUERDO: BMG VS VENUE')).toBeInTheDocument();
  fireEvent.click(screen.getByLabelText(/cerrar/i));
  expect(onClose).toHaveBeenCalled();
});
```
- [ ] **Step 2: Ejecutar → falla.**
- [ ] **Step 3: Implementar** `textos-info.ts` + `InfoComoSeCalcula.tsx` (Card con título + botón "×" `aria-label="Cerrar"`, grid `md:grid-cols-3` de secciones: título en `text-xs font-semibold uppercase` + texto `text-sm text-slate-500`). En `ProyeccionDetailPage`, render condicional a `infoAbierta` bajo `<UnderlineTabs>`. El botón "i" de la toolbar togglea `infoAbierta` y pasa a círculo relleno oscuro cuando `infoAbierta` (variar clases).
- [ ] **Step 4: Ejecutar → verde.**
- [ ] **Step 5: Commit** `feat(herramientas): panel "¿Cómo se calcula?" (botón i) cableado`

---

### Task 11: Exports = BOTONES INERTES (delta consciente D5)

**Files:**
- Modify: `src/features/herramientas/components/ProyeccionToolbar.tsx`
- Modify: `src/features/herramientas/components/ProyeccionToolbar.test.tsx`

**Interfaces (D5, decisión de Arian):** los 3 botones (PDF Ventas / PDF Explotación / Excel) presentes e **idénticos al live** en posición/etiqueta/icono, **sin `onClick` / sin acción al pulsar** (cero ruido). **NO** se añade aviso "Próximamente" ni feedback alguno — el live no lo muestra y prima la fidelidad al píxel. En la práctica esta Task es sobre todo **verificación**: si en Task 8 la toolbar ya renderiza los 3 botones inertes, aquí solo se asegura el test y el comentario del delta.

- [ ] **Step 1: Test (fallará si aún no están los 3 botones inertes)**
```ts
it('renderiza los 3 exports inertes (presentes, sin acción — delta consciente D5)', () => {
  render(<ProyeccionToolbar proyeccion={seedProyecciones[0]} {...noopHandlers} />);
  for (const label of ['PDF Ventas', 'PDF Explotación', 'Excel']) {
    const btn = screen.getByText(label);
    expect(btn).toBeInTheDocument();
    // inerte: pulsarlos no cambia nada ni lanza (sin onClick)
    fireEvent.click(btn);
  }
  // no aparece ningún aviso tipo "Próximamente" (el live no lo muestra)
  expect(screen.queryByText(/Próximamente/i)).not.toBeInTheDocument();
});
```
- [ ] **Step 2: Ejecutar → verificar (falla solo si faltan botones o hay aviso).**
- [ ] **Step 3: Implementar/ajustar** en `ProyeccionToolbar.tsx`: los 3 `Button variant="secondary" size="sm"` **sin `onClick`**. Añadir un comentario que documente el delta: `{/* Exports en mock (D5): botones fieles al live pero inertes; sin generar fichero ni aviso. Ver spec §7. */}`.
- [ ] **Step 4: Ejecutar → verde.**
- [ ] **Step 5: Commit** `feat(herramientas): exports fieles al live pero inertes (delta consciente D5)`

---

### Task 12: Verificación de cierre (regresión + Playwright ours-vs-live) + PR

**Files:** ninguno de producción (salvo fixes que surjan de la comparación).

- [ ] **Step 1: Suite completa verde**

Run: `npx vitest run && npx tsc --noEmit && npm run lint`
Expected: PASS, 0 warnings. Anotar el nº de tests (debe superar los 511 de Fase B).

- [ ] **Step 2: Árbol limpio.** Run: `git status` → limpio (todos los commits hechos).

- [ ] **Step 3: Playwright ours-vs-live (formal, cierre de módulo)**

Levantar `npm run dev`; con Playwright a 1440px, navegar a `/herramientas/proyecciones/<id>` en local y a `https://bookings.conceptoneagency.com/herramientas/proyecciones/...` (login `test@blackmoose.es`, **solo lectura**), tab Real. Comparar contra `docs/references/herramientas/live-proyeccion-detalle-real.png`, `live-info-como-se-calcula.png`, `live-panel-comentarios.png`, `live-picker-responsables.png`. Ajustar spacing/tokens/typography hasta que coincida (muestrear píxeles del PNG si falta un token). NO pulsar Guardar/crear/editar/borrar en el live.

- [ ] **Step 4: Fixes de fidelidad** (si los hay) con su propio commit `fix(herramientas): fidelidad ours-vs-live tab Real/paneles`.

- [ ] **Step 5: Avisar al coordinador (herdr) y abrir la PR**

Una sola PR (A+B+C) con base `feature/mixmag-tagmag`. En la descripción: resumen de las 3 fases, la tabla de verificación al céntimo, y el **delta consciente de exports (MOCK FIEL, D5)** explícito (como el adjunto de Incidencias). Terminar el cuerpo con la firma de Claude Code.

---

## Notas de decisión (de la spec §7)
- **D2** (partir la cabecera) va incluido (Task 8) por ser necesario para hospedar Comentarios fielmente. Si el coordinador lo rechaza, degradar a insertar el panel Comentarios tras la tarjeta única actual (ajuste menor).
- **D3** autor "Tú" / fecha corta es-ES (Task 9). **D4** pool local `personas.ts` con nombres cortos del live (Task 7). **D5** exports mock (Task 11).
