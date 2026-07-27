# Herramientas · Fase B (tab Previsión — motor de escenarios) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sustituir el placeholder de la tab Previsión por el motor real de escenarios (Pesimista/Base/Optimista), breakeven, ticketing en cascada, mesas VIP, barras/comida/merch y Gastos-CRUD completo — reproduciendo al céntimo las cifras verificadas del live (ver spec `docs/superpowers/specs/2026-07-23-herramientas-fase-b-prevision-design.md`), y sustituyendo el campo estático `acuerdoBrutos` de Fase A por el cálculo derivado real.

**Architecture:** nuevos módulos puros en `src/features/herramientas/data/` (`calculos-escenarios.ts`, `calculos-breakeven.ts`), extensión de `calculos-acuerdo.ts` (Fase A), nuevos componentes en `components/`, orquestador `PrevisionTab.tsx` integrado en `ProyeccionDetailPage`.

**Tech Stack:** React 19, react-router 7, Tailwind, Vitest + RTL + jest-dom, TypeScript ES2020.

## Global Constraints

- Es-ES en todos los textos; reusar `formatCurrency` de `@/lib/format.ts`; porcentajes con `.toFixed(1)` + `%` (patrón ya usado por `ResultadoAcuerdoCard`, punto decimal, no coma — así es como aparece en el live: "13.6%").
- Un commit por tarea. Cada tarea termina en verde (`npx vitest run`, `npx tsc --noEmit`, `npx lint` si aplica — usar el mismo comando de lint que el resto del repo).
- No usar `Array.prototype.at()` (ES2020).
- Reusar primitivos de `@/components/ui` (`Card`, `Button`, `SegmentedControl`, `Select`, `Input`, `StatCard`, `ProgressBar`, `Badge`) — solo crear primitivo nuevo (`CollapsibleSection`) si de verdad no hay nada parecido (confirmado: no lo hay).
- Fuente de verdad: `docs/references/herramientas/recon-notas.md` + capturas/snapshots. Las fórmulas del motor están ya verificadas en la spec (§3) — no re-derivarlas.
- Alcance: solo la tab Previsión + la sustitución de `acuerdoBrutos`. No tocar tab Real ni los extras de cabecera (Comentarios/picker responsables/exports/botón "i") — Fase C.

---

### Task 1: Retirar `acuerdoBrutos` estático — preparar el terreno

**Files:**
- Modify: `src/features/herramientas/data/types.ts`
- Modify: `src/features/herramientas/data/seed.ts`
- Modify: `src/features/herramientas/data/seed.test.ts`
- Modify: `src/features/herramientas/data/proyecciones-crud.ts`

**Interfaces:**
- `Proyeccion` pierde el campo `acuerdoBrutos`. `AcuerdoBrutos` se mantiene exportada (ahora es el tipo de retorno de `calcularBrutosEscenario`, Task 2). `TicketingRelease` gana `canales?: string[]`.

- [ ] **Step 1: Actualizar el test de la semilla (fallará: `seed.ts` aún tiene el campo, pero el test ya no debe usarlo)**

En `seed.test.ts`, sustituir el test `'acuerdoBrutos son las cifras verificadas del live...'` por uno que solo compruebe que el campo **no** existe en el objeto y que `ticketing`/`mesasVip`/`barrasComidaMerch` siguen teniendo los valores crudos (ya cubierto por otro test existente). Añadir:

```ts
it('ya no expone acuerdoBrutos (Fase B lo deriva de ticketing/mesasVip/barrasComidaMerch)', () => {
  expect((p as any).acuerdoBrutos).toBeUndefined();
});
```

- [ ] **Step 2: Ejecutar el test para comprobar que falla**

Run: `npx vitest run src/features/herramientas/data/seed.test.ts`
Expected: FAIL — `p.acuerdoBrutos` sigue definido en `seed.ts`.

- [ ] **Step 3: Quitar el campo de `types.ts`, `seed.ts`, `proyecciones-crud.ts`**

`types.ts`: quitar la línea `acuerdoBrutos: AcuerdoBrutos;` de `Proyeccion`; actualizar el comentario de `AcuerdoBrutos` (ya no es "constante verificada de Fase A", ahora es el tipo de retorno de `calcularBrutosEscenario`, Fase B); añadir `canales?: string[];` a `TicketingRelease`.

`seed.ts`: quitar la línea `acuerdoBrutos: { ... }` (y su comentario `// Ver nota de fidelidad...`).

`proyecciones-crud.ts`: quitar `acuerdoBrutos: { ticketing: 0, ... }` de `createBlankProyeccion`.

- [ ] **Step 4: Ejecutar el test para comprobar que pasa (y que rompe temporalmente otros consumidores — esperado)**

Run: `npx tsc --noEmit`
Expected: FAIL — `AcuerdoTab.tsx`, `ProyeccionRow.tsx`, `calculos-acuerdo.test.ts`, `ResultadoAcuerdoCard.test.tsx` referencian `proyeccion.acuerdoBrutos` / `p.acuerdoBrutos`, que ya no existe. Esto se resuelve en la Task 4 (cuando exista `calcularBrutosEscenario`). Por ahora, dejar constancia en el commit de este Task de que `tsc` fallará hasta la Task 4 — **no** hacer commit de este estado roto; en su lugar, fusionar los Steps 1-4 en un solo commit junto con un stub mínimo de `calcularBrutosEscenario` (Task 2) antes de commitear. Reordenar: ejecutar primero la Task 2 completa, luego volver aquí para el Step 5.

- [ ] **Step 5 (tras Task 2): Actualizar consumidores**

Ver Task 4 (que agrupa esta actualización junto con la extensión de `calculos-acuerdo.ts`, porque ambas tocan los mismos ficheros consumidores). Este Task 1 se commitea junto con la Task 2 en la práctica (mismo commit `types.ts`+`seed.ts`+`proyecciones-crud.ts`+`calculos-escenarios.ts`), para no dejar el árbol roto entre commits.

- [ ] **Step 6: Commit (junto con Task 2 — ver ahí)**

---

### Task 2: Motor de escenarios (`calculos-escenarios.ts`)

**Files:**
- Create: `src/features/herramientas/data/calculos-escenarios.ts`
- Create: `src/features/herramientas/data/calculos-escenarios.test.ts`
- (combina el Task 1 de arriba en el mismo commit)

**Interfaces:**
- Consumes: `Proyeccion`, `TicketingRelease`, `MesaVip`, `AjustesEscenarios`, `AcuerdoBrutos`, `EventoAforo` (de `./types`).
- Produces: `type Escenario = 'pesimista' | 'base' | 'optimista'`, `ESCENARIOS: Escenario[]`, `multiplicadorPct(ajustes, escenario): number`, `entradasObjetivo(ticketing, ajustes, escenario, invitaciones, asistenciaForzada?): number`, `ticketingBrutoWaterfall(ticketing, entradasObjetivo): number`, `vipBruto(mesasVip): number`, `calcularBrutosEscenario(p: Proyeccion, escenario: Escenario): AcuerdoBrutos`, `calcularEscenariosComparativa(p: Proyeccion): { escenario: Escenario; label: string; beneficio: number; margen: number }[]`, `calcularGastoPorCategoria(gastos: Gasto[]): { categoria: string; importe: number; pct: number }[]`.

- [ ] **Step 1: Escribir el test (fallará: el módulo no existe)**

```ts
// src/features/herramientas/data/calculos-escenarios.test.ts
import { describe, it, expect } from 'vitest';
import {
  ticketingBrutoWaterfall, vipBruto, calcularBrutosEscenario,
  calcularEscenariosComparativa, calcularGastoPorCategoria,
} from './calculos-escenarios';
import { calcularResultadoAcuerdo } from './calculos-acuerdo';
import { seedProyecciones } from './seed';

const p = seedProyecciones[0];

describe('ticketingBrutoWaterfall', () => {
  it('agota los releases en orden hasta cubrir el objetivo, exacto en el borde de una fila', () => {
    // Early Access(100)+Release1(200)+Release3(150) = 450 exacto
    expect(ticketingBrutoWaterfall(p.ticketing, 450)).toBeCloseTo(4600, 2);
  });

  it('corta a mitad de fila (caso no ejercitado por el seed): objetivo 470 toma 20 de la 4ª fila (precio 15)', () => {
    // 450 acumuladas + 20 de "Online · Release 2" (precio 15) = 300
    expect(ticketingBrutoWaterfall(p.ticketing, 470)).toBeCloseTo(4600 + 20 * 15, 2);
  });

  it('objetivo 0 da bruto 0; objetivo mayor que el total configurado satura en el total (6125)', () => {
    expect(ticketingBrutoWaterfall(p.ticketing, 0)).toBe(0);
    expect(ticketingBrutoWaterfall(p.ticketing, 10000)).toBeCloseTo(6125, 2);
  });
});

describe('vipBruto', () => {
  it('es la suma cruda mesas×prob×precio, SIN multiplicador de escenario (ver spec §3.3)', () => {
    expect(vipBruto(p.mesasVip)).toBeCloseTo(12790, 2);
  });
});

describe('calcularBrutosEscenario — reproduce exactamente los 3 escenarios del live', () => {
  it('Base (75%): ticketing 4.600€, vip 12.790€, barras 15.000€, comida 1.125€, merch 0€', () => {
    const b = calcularBrutosEscenario(p, 'base');
    expect(b.ticketing).toBeCloseTo(4600, 2);
    expect(b.mesasVip).toBeCloseTo(12790, 2);
    expect(b.barras).toBeCloseTo(15000, 2);
    expect(b.comida).toBeCloseTo(1125, 2);
    expect(b.merchandising).toBe(0);
  });

  it('Pesimista (50%): ticketing 2.800€, barras 10.500€, comida 787,50€', () => {
    const b = calcularBrutosEscenario(p, 'pesimista');
    expect(b.ticketing).toBeCloseTo(2800, 2);
    expect(b.barras).toBeCloseTo(10500, 2);
    expect(b.comida).toBeCloseTo(787.5, 2);
  });

  it('Optimista (100%): ticketing 6.125€ (todo el configurado), barras 19.500€, comida 1.462,50€', () => {
    const b = calcularBrutosEscenario(p, 'optimista');
    expect(b.ticketing).toBeCloseTo(6125, 2);
    expect(b.barras).toBeCloseTo(19500, 2);
    expect(b.comida).toBeCloseTo(1462.5, 2);
  });

  it('el Beneficio por acuerdo resultante reproduce EXACTAMENTE la tabla Escenarios del live', () => {
    const beneficio = (escenario: 'pesimista' | 'base' | 'optimista') =>
      calcularResultadoAcuerdo(p.acuerdo, calcularBrutosEscenario(p, escenario), p.eventoAforo, p.gastos).beneficioPorAcuerdo;
    expect(beneficio('pesimista')).toBeCloseTo(-1134.69, 1);
    expect(beneficio('base')).toBeCloseTo(860.14, 1);
    expect(beneficio('optimista')).toBeCloseTo(2604.97, 1);
  });
});

describe('calcularEscenariosComparativa', () => {
  it('devuelve las 3 filas con beneficio y margen exactos', () => {
    const filas = calcularEscenariosComparativa(p);
    expect(filas).toHaveLength(3);
    expect(filas[0]).toMatchObject({ escenario: 'pesimista', label: 'Pesimista' });
    expect(filas[0].beneficio).toBeCloseTo(-1134.69, 1);
    expect(filas[0].margen).toBeCloseTo(-26.2, 0);
    expect(filas[1].beneficio).toBeCloseTo(860.14, 1);
    expect(filas[2].beneficio).toBeCloseTo(2604.97, 1);
  });
});

describe('calcularGastoPorCategoria', () => {
  it('agrega por categoría, ordena descendente y calcula % redondeado (suma 100)', () => {
    const filas = calcularGastoPorCategoria(p.gastos);
    expect(filas).toEqual([
      { categoria: 'Artística', importe: 2400, pct: 44 },
      { categoria: 'Promoción', importe: 1500, pct: 27 },
      { categoria: 'Publicidad', importe: 1300, pct: 24 },
      { categoria: 'Staff', importe: 270, pct: 5 },
    ]);
  });
});
```

- [ ] **Step 2: Ejecutar el test para comprobar que falla**

Run: `npx vitest run src/features/herramientas/data/calculos-escenarios.test.ts`
Expected: FAIL — `Cannot find module './calculos-escenarios'`

- [ ] **Step 3: Implementar `calculos-escenarios.ts`**

```ts
// src/features/herramientas/data/calculos-escenarios.ts
import type { AcuerdoBrutos, AjustesEscenarios, EventoAforo, Gasto, MesaVip, Proyeccion, TicketingRelease } from './types';

export type Escenario = 'pesimista' | 'base' | 'optimista';
export const ESCENARIOS: Escenario[] = ['pesimista', 'base', 'optimista'];
const ESCENARIO_LABEL: Record<Escenario, string> = { pesimista: 'Pesimista', base: 'Base', optimista: 'Optimista' };

export function multiplicadorPct(ajustes: AjustesEscenarios, escenario: Escenario): number {
  return {
    pesimista: ajustes.multiplicadorPesimistaPct,
    base: ajustes.multiplicadorBasePct,
    optimista: ajustes.multiplicadorOptimistaPct,
  }[escenario];
}

export function entradasObjetivo(
  ticketing: TicketingRelease[],
  ajustes: AjustesEscenarios,
  escenario: Escenario,
  invitaciones: number,
  asistenciaForzada?: number
): number {
  if (asistenciaForzada !== undefined) return Math.max(0, asistenciaForzada - invitaciones);
  const totalRaw = ticketing.reduce((a, r) => a + r.entradas, 0);
  return Math.round((totalRaw * multiplicadorPct(ajustes, escenario)) / 100);
}

export function ticketingBrutoWaterfall(ticketing: TicketingRelease[], objetivo: number): number {
  const ordenado = [...ticketing].sort((a, b) => a.orden - b.orden);
  let cum = 0;
  let bruto = 0;
  for (const r of ordenado) {
    if (cum >= objetivo) break;
    const tomadas = Math.min(r.entradas, objetivo - cum);
    bruto += tomadas * r.precio;
    cum += tomadas;
  }
  return bruto;
}

export function vipBruto(mesasVip: MesaVip[]): number {
  return mesasVip.reduce((a, z) => a + z.mesas * (z.probabilidadPct / 100) * z.precio, 0);
}

export function calcularBrutosEscenario(p: Proyeccion, escenario: Escenario): AcuerdoBrutos {
  const objetivo = entradasObjetivo(
    p.ticketing, p.ajustesEscenarios, escenario, p.eventoAforo.invitaciones, p.eventoAforo.asistenciaForzada
  );
  const asistencia = objetivo + p.eventoAforo.invitaciones;
  const { barras, comida, merch } = p.barrasComidaMerch;
  return {
    ticketing: ticketingBrutoWaterfall(p.ticketing, objetivo),
    mesasVip: vipBruto(p.mesasVip),
    barras: barras.consumicionesHora * p.eventoAforo.duracionHoras * barras.precioMedio * asistencia,
    comida: (comida.pctQueConsume / 100) * comida.ticketMedio * asistencia,
    merchandising: (merch.pctConversion / 100) * merch.precioMedio * asistencia,
  };
}

export interface FilaEscenario {
  escenario: Escenario;
  label: string;
  beneficio: number;
  margen: number;
}

export function calcularEscenariosComparativa(p: Proyeccion): FilaEscenario[] {
  // import diferido para evitar ciclo de módulos en el punto de entrada del fichero
  // (calculos-acuerdo.ts no importa calculos-escenarios.ts, así que un import normal ya vale)
  return ESCENARIOS.map((escenario) => {
    const brutos = calcularBrutosEscenario(p, escenario);
    const resultado = calcularResultadoAcuerdoLazy(p, brutos);
    return { escenario, label: ESCENARIO_LABEL[escenario], beneficio: resultado.beneficioPorAcuerdo, margen: resultado.margenSobreIngresos };
  });
}

// Evita el import circular declarándolo al final; ver Step 3b si TypeScript se queja
// (en la práctica, importar calcularResultadoAcuerdo arriba junto al resto es más simple —
// no hay ciclo real: calculos-acuerdo.ts no depende de este fichero).
import { calcularResultadoAcuerdo } from './calculos-acuerdo';
function calcularResultadoAcuerdoLazy(p: Proyeccion, brutos: AcuerdoBrutos) {
  return calcularResultadoAcuerdo(p.acuerdo, brutos, p.eventoAforo, p.gastos);
}

export interface FilaGastoCategoria {
  categoria: string;
  importe: number;
  pct: number;
}

export function calcularGastoPorCategoria(gastos: Gasto[]): FilaGastoCategoria[] {
  const totales = new Map<string, number>();
  gastos.forEach((g) => totales.set(g.categoria, (totales.get(g.categoria) ?? 0) + g.valor));
  const total = Array.from(totales.values()).reduce((a, v) => a + v, 0);
  return Array.from(totales.entries())
    .map(([categoria, importe]) => ({ categoria, importe, pct: total === 0 ? 0 : Math.round((importe / total) * 100) }))
    .sort((a, b) => b.importe - a.importe);
}
```

**Nota de implementación:** simplificar el Step 3 quitando el comentario/patrón "lazy" innecesario — un `import { calcularResultadoAcuerdo } from './calculos-acuerdo';` normal al principio del fichero funciona sin ciclo (verificar con `tsc`/`vitest`; si apareciera un ciclo real, mover `calcularEscenariosComparativa` a un tercer fichero `calculos-comparativa.ts` que importe de ambos). Escribir el código final limpio, sin el rodeo mostrado arriba (se deja aquí solo como nota de la duda a resolver durante la implementación).

- [ ] **Step 4: Ejecutar el test para comprobar que pasa**

Run: `npx vitest run src/features/herramientas/data/calculos-escenarios.test.ts`
Expected: PASS (12 tests)

- [ ] **Step 5: Actualizar consumidores de `acuerdoBrutos` (cierra la Task 1)**

`AcuerdoTab.tsx`: sustituir `const { acuerdo, acuerdoBrutos, eventoAforo, gastos } = proyeccion;` por:
```ts
import { calcularBrutosEscenario } from '../data/calculos-escenarios';
// ...
const { acuerdo, eventoAforo, gastos } = proyeccion;
const acuerdoBrutos = calcularBrutosEscenario(proyeccion, 'base');
```
(el resto del componente no cambia — sigue leyendo `acuerdoBrutos.ticketing` etc. de la variable local).

`ProyeccionRow.tsx`: sustituir `proyeccion.acuerdoBrutos` por `calcularBrutosEscenario(proyeccion, 'base')` en la llamada a `calcularResultadoAcuerdo`.

`calculos-acuerdo.test.ts`: sustituir `p.acuerdoBrutos` por `calcularBrutosEscenario(p, 'base')` (import nuevo).

`ResultadoAcuerdoCard.test.tsx`: mismo cambio.

- [ ] **Step 6: Ejecutar la suite completa + tsc**

Run: `npx vitest run && npx tsc --noEmit`
Expected: 0 errores, todos los tests en verde (incluida la Task 1)

- [ ] **Step 7: Commit (agrupa Task 1 + Task 2)**

```bash
git add src/features/herramientas/data/types.ts src/features/herramientas/data/seed.ts src/features/herramientas/data/seed.test.ts src/features/herramientas/data/proyecciones-crud.ts src/features/herramientas/data/calculos-escenarios.ts src/features/herramientas/data/calculos-escenarios.test.ts src/features/herramientas/components/AcuerdoTab.tsx src/features/herramientas/components/ProyeccionRow.tsx src/features/herramientas/data/calculos-acuerdo.test.ts src/features/herramientas/components/ResultadoAcuerdoCard.test.tsx
git commit -m "feat(herramientas): motor real de escenarios — sustituye acuerdoBrutos estático por cálculo derivado"
```

---

### Task 3: Breakeven (`calculos-breakeven.ts`)

**Files:**
- Create: `src/features/herramientas/data/calculos-breakeven.ts`
- Create: `src/features/herramientas/data/calculos-breakeven.test.ts`

**Interfaces:**
- Consumes: `Proyeccion`, `ViaBreakeven` (de `./types`), `ingresoTramo` (de `./calculos-acuerdo`), `entradasObjetivo`/`ticketingBrutoWaterfall`/`vipBruto` (de `./calculos-escenarios`).
- Produces: `interface ResultadoBreakeven { pctVentaProyectada: number; entradasNecesarias: number; asistenciaNecesaria: number }`, `calcularBreakeven(p: Proyeccion): ResultadoBreakeven | null`.

- [ ] **Step 1: Escribir el test**

```ts
// src/features/herramientas/data/calculos-breakeven.test.ts
import { describe, it, expect } from 'vitest';
import { calcularBreakeven } from './calculos-breakeven';
import { seedProyecciones } from './seed';
import type { Proyeccion } from './types';

const p = seedProyecciones[0];

describe('calcularBreakeven', () => {
  it('reproduce exactamente el breakeven del live con las vías del seed (ticketing+barras): 77% · 461 · 511', () => {
    const r = calcularBreakeven(p);
    expect(r).not.toBeNull();
    expect(r!.pctVentaProyectada).toBe(77);
    expect(r!.entradasNecesarias).toBe(461);
    expect(r!.asistenciaNecesaria).toBe(511);
  });

  it('devuelve null si no hay vías marcadas (nada que sumar, no se puede alcanzar el punto de equilibrio)', () => {
    const sinVias: Proyeccion = { ...p, ajustesEscenarios: { ...p.ajustesEscenarios, viasBreakeven: [] } };
    expect(calcularBreakeven(sinVias)).toBeNull();
  });

  it('devuelve null si los gastos superan lo alcanzable incluso al 100% de las vías marcadas', () => {
    const gastosEnormes: Proyeccion = {
      ...p,
      gastos: [{ id: 'g', categoria: 'Otros', concepto: 'x', base: 'importe_fijo', valor: 1_000_000, paga: 'nosotros' }],
    };
    expect(calcularBreakeven(gastosEnormes)).toBeNull();
  });

  it('si los gastos ya están cubiertos con 0 ventas (gastos=0), el breakeven es 0%', () => {
    const sinGastos: Proyeccion = { ...p, gastos: [] };
    const r = calcularBreakeven(sinGastos);
    expect(r).not.toBeNull();
    expect(r!.pctVentaProyectada).toBe(0);
  });
});
```

- [ ] **Step 2: Ejecutar el test para comprobar que falla**

Run: `npx vitest run src/features/herramientas/data/calculos-breakeven.test.ts`
Expected: FAIL — `Cannot find module './calculos-breakeven'`

- [ ] **Step 3: Implementar `calculos-breakeven.ts`**

```ts
// src/features/herramientas/data/calculos-breakeven.ts
import { ingresoTramo, calcularResultadoAcuerdo } from './calculos-acuerdo';
import { calcularBrutosEscenario, ticketingBrutoWaterfall, vipBruto } from './calculos-escenarios';
import type { Proyeccion, ViaBreakeven } from './types';

export interface ResultadoBreakeven {
  pctVentaProyectada: number;
  entradasNecesarias: number;
  asistenciaNecesaria: number;
}

function totalIngresoParaN(p: Proyeccion, n: number, vias: ViaBreakeven[]): number {
  const asistencia = n + p.eventoAforo.invitaciones;
  const { barras, comida, merch } = p.barrasComidaMerch;
  const ivaTicketing = p.eventoAforo.ivaTicketingPct;
  const ivaResto = p.eventoAforo.ivaBarrasComidaVipPct;
  let total = 0;
  if (vias.includes('ticketing')) {
    total += ingresoTramo(p.acuerdo.ticketing, ticketingBrutoWaterfall(p.ticketing, n), ivaTicketing);
  }
  if (vias.includes('mesas_vip')) {
    total += ingresoTramo(p.acuerdo.mesasVip, vipBruto(p.mesasVip), ivaResto);
  }
  if (vias.includes('barras')) {
    const bruto = barras.consumicionesHora * p.eventoAforo.duracionHoras * barras.precioMedio * asistencia;
    total += ingresoTramo(p.acuerdo.barras, bruto, ivaResto);
  }
  if (vias.includes('comida')) {
    const bruto = (comida.pctQueConsume / 100) * comida.ticketMedio * asistencia;
    total += ingresoTramo(p.acuerdo.comida, bruto, ivaResto);
  }
  if (vias.includes('merchandising')) {
    const bruto = (merch.pctConversion / 100) * merch.precioMedio * asistencia;
    total += ingresoTramo(p.acuerdo.merchandising, bruto, ivaResto);
  }
  return total;
}

export function calcularBreakeven(p: Proyeccion): ResultadoBreakeven | null {
  const vias = p.ajustesEscenarios.viasBreakeven;
  if (vias.length === 0) return null;

  const totalRawEntradas = p.ticketing.reduce((a, r) => a + r.entradas, 0);
  // Gastos como coste fijo: se evalúan una sola vez, a brutos de escenario Base (ver spec §3.8).
  const gastosQueAsumimos = calcularResultadoAcuerdo(
    p.acuerdo, calcularBrutosEscenario(p, 'base'), p.eventoAforo, p.gastos
  ).gastosQueAsumimos;
  const objetivo = -gastosQueAsumimos; // gastosQueAsumimos es <= 0

  if (objetivo <= 0) {
    // Ya cubierto sin vender nada (gastos nulos o positivos por algún ajuste raro).
    return { pctVentaProyectada: 0, entradasNecesarias: 0, asistenciaNecesaria: p.eventoAforo.invitaciones };
  }

  if (totalRawEntradas <= 0) return null;

  const alcanzableAl100 = totalIngresoParaN(p, totalRawEntradas, vias);
  if (alcanzableAl100 < objetivo) return null;

  let lo = 0;
  let hi = totalRawEntradas;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (totalIngresoParaN(p, mid, vias) < objetivo) lo = mid; else hi = mid;
  }
  const n = (lo + hi) / 2;
  const entradasNecesarias = Math.round(n);
  return {
    pctVentaProyectada: Math.round((n / totalRawEntradas) * 100),
    entradasNecesarias,
    asistenciaNecesaria: entradasNecesarias + p.eventoAforo.invitaciones,
  };
}
```

- [ ] **Step 4: Ejecutar el test para comprobar que pasa**

Run: `npx vitest run src/features/herramientas/data/calculos-breakeven.test.ts`
Expected: PASS (4 tests)

- [ ] **Step 5: Suite completa + tsc**

Run: `npx vitest run && npx tsc --noEmit`

- [ ] **Step 6: Commit**

```bash
git add src/features/herramientas/data/calculos-breakeven.ts src/features/herramientas/data/calculos-breakeven.test.ts
git commit -m "feat(herramientas): motor de breakeven (búsqueda binaria sobre vías seleccionadas)"
```

---

### Task 4: Gastos-CRUD — generalizar `Gasto.base` (`calcularImporteGasto`)

**Files:**
- Modify: `src/features/herramientas/data/calculos-acuerdo.ts`
- Modify: `src/features/herramientas/data/calculos-acuerdo.test.ts`

**Interfaces:**
- Produces (nuevo): `calcularImporteGasto(g: Gasto, brutos: AcuerdoBrutos, eventoAforo: EventoAforo): number`.
- Modifica: `calcularResultadoAcuerdo` — la línea `gastosQueAsumimos` pasa a usar `calcularImporteGasto` en vez de `-g.valor`.

- [ ] **Step 1: Escribir el test (fallará: `calcularImporteGasto` no existe)**

```ts
// añadir a calculos-acuerdo.test.ts
import { calcularImporteGasto } from './calculos-acuerdo'; // (añadir al import existente)

describe('calcularImporteGasto', () => {
  const brutos = { ticketing: 4600, mesasVip: 12790, barras: 15000, comida: 1125, merchandising: 0 };
  const eventoAforo = seedProyecciones[0].eventoAforo;

  it('importe_fijo: usa el valor tal cual, en negativo', () => {
    const g = { id: '1', categoria: 'Otros' as const, concepto: 'x', base: 'importe_fijo' as const, valor: 200, paga: 'nosotros' as const };
    expect(calcularImporteGasto(g, brutos, eventoAforo)).toBe(-200);
  });

  it('pct_ticketing_neto: % sobre el neto de IVA del bruto de ticketing', () => {
    const g = { id: '2', categoria: 'Otros' as const, concepto: 'x', base: 'pct_ticketing_neto' as const, valor: 10, paga: 'nosotros' as const };
    // neto ticketing = 4600/1.1 = 4181.818...; 10% = 418.1818
    expect(calcularImporteGasto(g, brutos, eventoAforo)).toBeCloseTo(-418.18, 1);
  });

  it('pct_facturacion_neta: % sobre la suma de todos los netos', () => {
    const g = { id: '3', categoria: 'Otros' as const, concepto: 'x', base: 'pct_facturacion_neta' as const, valor: 10, paga: 'nosotros' as const };
    // suma netos = 4181.818+11627.273+13636.364+1022.727+0 = 30468.182; 10% = 3046.82
    expect(calcularImporteGasto(g, brutos, eventoAforo)).toBeCloseTo(-3046.82, 1);
  });
});
```

También añadir, dentro del `describe('calcularResultadoAcuerdo ...')` existente, una comprobación de que sigue dando los mismos 4 valores exactos usando `calcularBrutosEscenario(p, 'base')` (ya hecho en Task 2 Step 5 — no repetir, solo confirmar que no ha regresado).

- [ ] **Step 2: Ejecutar el test para comprobar que falla**

Run: `npx vitest run src/features/herramientas/data/calculos-acuerdo.test.ts`
Expected: FAIL — `calcularImporteGasto` no exportado.

- [ ] **Step 3: Implementar en `calculos-acuerdo.ts`**

```ts
import type { AcuerdoConfig, AcuerdoBrutos, EventoAforo, Gasto, TramoAcuerdoConfig, BaseGasto } from './types';

// ... (netoDeIva, baseParaTramo, ingresoTramo sin cambios)

export function calcularImporteGasto(g: Gasto, brutos: AcuerdoBrutos, eventoAforo: EventoAforo): number {
  const netoTicketing = netoDeIva(brutos.ticketing, eventoAforo.ivaTicketingPct);
  const netoVip = netoDeIva(brutos.mesasVip, eventoAforo.ivaBarrasComidaVipPct);
  const netoBarras = netoDeIva(brutos.barras, eventoAforo.ivaBarrasComidaVipPct);
  const netoComida = netoDeIva(brutos.comida, eventoAforo.ivaBarrasComidaVipPct);
  const netoMerch = netoDeIva(brutos.merchandising, eventoAforo.ivaBarrasComidaVipPct);
  const netoFacturacion = netoTicketing + netoVip + netoBarras + netoComida + netoMerch;

  const baseMap: Record<BaseGasto, number> = {
    importe_fijo: g.valor,
    pct_facturacion_neta: (g.valor / 100) * netoFacturacion,
    pct_ticketing_neto: (g.valor / 100) * netoTicketing,
    pct_vip_neto: (g.valor / 100) * netoVip,
    pct_barras_neto: (g.valor / 100) * netoBarras,
    pct_comida_neta: (g.valor / 100) * netoComida,
    pct_merch_neto: (g.valor / 100) * netoMerch,
  };
  return -baseMap[g.base];
}
```

Y en `calcularResultadoAcuerdo`, sustituir:

```ts
const gastosQueAsumimos = -gastos
  .filter((g) => g.paga === 'nosotros')
  .reduce((a, g) => a + g.valor, 0);
```

por:

```ts
const gastosQueAsumimos = gastos
  .filter((g) => g.paga === 'nosotros')
  .reduce((a, g) => a + calcularImporteGasto(g, brutos, eventoAforo), 0);
```

- [ ] **Step 4: Ejecutar el test para comprobar que pasa (incluye toda la suite existente de calculos-acuerdo, que no debe regresar)**

Run: `npx vitest run src/features/herramientas/data/calculos-acuerdo.test.ts`
Expected: PASS (todos, incluidos los heredados de Fase A: 6.330,14€/-5.470,00€/860,14€/13.6%/24.998,18€ (82%) sin cambios, porque los 7 gastos del seed son `importe_fijo`)

- [ ] **Step 5: Suite completa + tsc + lint**

- [ ] **Step 6: Commit**

```bash
git add src/features/herramientas/data/calculos-acuerdo.ts src/features/herramientas/data/calculos-acuerdo.test.ts
git commit -m "feat(herramientas): calcularImporteGasto — generaliza Gasto.base a las 7 variantes del live"
```

---

### Task 5: `CollapsibleSection` (primitivo local)

**Files:**
- Create: `src/features/herramientas/components/CollapsibleSection.tsx`
- Create: `src/features/herramientas/components/CollapsibleSection.test.tsx`

**Interfaces:** `CollapsibleSection({ title, summary?, defaultOpen?, children }): JSX.Element`.

- [ ] **Step 1: Test**

```tsx
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CollapsibleSection } from './CollapsibleSection';

describe('CollapsibleSection', () => {
  it('arranca colapsado por defecto, muestra el resumen, y expande al clicar el título', async () => {
    render(
      <CollapsibleSection title="Ajustes de escenarios y breakeven" summary="Base 75% · BE 77%">
        <p>contenido interior</p>
      </CollapsibleSection>
    );
    expect(screen.getByText('Base 75% · BE 77%')).toBeInTheDocument();
    expect(screen.queryByText('contenido interior')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /Ajustes de escenarios y breakeven/ }));
    expect(screen.getByText('contenido interior')).toBeInTheDocument();
  });

  it('defaultOpen=true arranca expandido', () => {
    render(<CollapsibleSection title="X" defaultOpen>contenido</CollapsibleSection>);
    expect(screen.getByText('contenido')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2:** Run test → FAIL (no existe el módulo).

- [ ] **Step 3: Implementar**

```tsx
import { useState, type ReactNode } from 'react';
import { Card } from '@/components/ui';

interface Props {
  title: string;
  summary?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function CollapsibleSection({ title, summary, defaultOpen = false, children }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card className="p-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-left"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <span aria-hidden>{open ? '▾' : '▸'}</span>
          <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        </span>
        {!open && summary && <span className="text-xs text-slate-400">{summary}</span>}
      </button>
      {open && <div className="mt-4">{children}</div>}
    </Card>
  );
}
```

- [ ] **Step 4:** Run test → PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/features/herramientas/components/CollapsibleSection.tsx src/features/herramientas/components/CollapsibleSection.test.tsx
git commit -m "feat(herramientas): CollapsibleSection (primitivo local de acordeón)"
```

---

### Task 6: `EscenarioSelector`

**Files:** Create `components/EscenarioSelector.tsx` + `.test.tsx`.

**Interfaces:** `EscenarioSelector({ ajustes: AjustesEscenarios, value: Escenario, onChange: (e: Escenario) => void }): JSX.Element`.

- [ ] **Step 1: Test** — renderiza 3 botones con label "Pesimista · 50%"/"Base · 75%"/"Optimista · 100%" (usando los multiplicadores reales de `ajustes`, no hardcoded), el activo tiene estilo distinto (verificar vía `aria-pressed`), clic en uno llama `onChange` con el valor correcto. Incluye el texto estático "Ves el resultado por acuerdo."

- [ ] **Step 2:** Run → FAIL.

- [ ] **Step 3: Implementar** con `SegmentedControl`-like pattern manual (los labels son dinámicos por lo que no encaja directo en el `SegmentedControl` genérico de opciones estáticas; usar botones propios con `aria-pressed`).

- [ ] **Step 4:** Run → PASS.

- [ ] **Step 5: Commit** `feat(herramientas): EscenarioSelector (Pesimista/Base/Optimista con multiplicador en vivo)`

---

### Task 7: `EscenariosTable`

**Files:** Create `components/EscenariosTable.tsx` + `.test.tsx`.

**Interfaces:** `EscenariosTable({ filas: FilaEscenario[] }): JSX.Element` (consume `calcularEscenariosComparativa`, invocada por el padre `PrevisionTab`).

- [ ] **Step 1: Test** — tabla con cabecera ESCENARIO/Bº POR ACUERDO/MARGEN y 3 filas con los valores exactos del seed (-1.134,69€/-26.2%, 860,14€/13.6%, 2.604,97€/32.3%), colores (rojo si beneficio<0, verde si >0 — mismo patrón ya usado en `ProyeccionRow`/`cn`).

- [ ] **Step 2-5:** TDD estándar, commit `feat(herramientas): EscenariosTable (comparativa Pesimista/Base/Optimista)`.

---

### Task 8: `GastoPorCategoriaCard`

**Files:** Create `components/GastoPorCategoriaCard.tsx` + `.test.tsx`.

**Interfaces:** `GastoPorCategoriaCard({ gastos: Gasto[] }): JSX.Element` (llama `calcularGastoPorCategoria` internamente).

- [ ] **Step 1: Test** — renderiza las 4 categorías del seed con importe y "· NN%", y una `ProgressBar` por fila con `value=importe, max=totalMáximo` (la barra más larga es Artística).

- [ ] **Step 2-5:** TDD estándar, commit `feat(herramientas): GastoPorCategoriaCard`.

---

### Task 9: `AjustesEscenariosCard`

**Files:** Create `components/AjustesEscenariosCard.tsx` + `.test.tsx`.

**Interfaces:** `AjustesEscenariosCard({ proyeccion: Proyeccion, onUpdate: (patch: Partial<Proyeccion>) => void }): JSX.Element`. Usa `CollapsibleSection` con `summary` = `"Base {basePct}% · BE {breakeven?.pctVentaProyectada ?? '—'}%"`.

- [ ] **Step 1: Test** — 3 inputs numéricos (Pesimista/Base/Optimista %) que al cambiar llaman `onUpdate({ ajustesEscenarios: { ...} })`; 5 checkboxes (Ticketing/Mesas VIP/Barras/Comida/Merchandising) reflejando `viasBreakeven` y toggleando correctamente (añadir/quitar del array); línea de resultado "% de venta proyectada 77% · Entradas necesarias 461 · Asistencia necesaria 511" con los datos del seed; resumen colapsado "Base 75% · BE 77%".

- [ ] **Step 2-5:** TDD estándar, commit `feat(herramientas): AjustesEscenariosCard (multiplicadores + vías de breakeven)`.

---

### Task 10: `EventoAforoCard`

**Files:** Create `components/EventoAforoCard.tsx` + `.test.tsx`.

**Interfaces:** `EventoAforoCard({ proyeccion: Proyeccion, onUpdate }): JSX.Element`.

- [ ] **Step 1: Test** — inputs NOMBRE/FECHA/VENUE(texto)/AFORO MÁXIMO/DURACIÓN (HORAS)/INVITACIONES/IVA TICKETING %/IVA BARRAS-COMIDA-VIP % editables vía `onUpdate({ eventoAforo: {...} })`; checkbox "Forzar a mano" + input numérico ligado a `asistenciaForzada` (al desmarcar, `asistenciaForzada` vuelve a `undefined`); nota "Asistencia proyectada 500 = entradas + invitaciones · PAX de pago 450" calculada con `entradasObjetivo(...,'base',...)`; resumen colapsado "18 jul 2026 · 600 · 6h · 500 pax".

- [ ] **Step 2-5:** TDD estándar, commit `feat(herramientas): EventoAforoCard (aforo, IVAs, asistencia forzada a mano)`.

---

### Task 11: `TicketingTable` (incl. desglose por ticketera)

**Files:** Create `components/TicketingTable.tsx` + `.test.tsx`.

**Interfaces:** `TicketingTable({ proyeccion: Proyeccion, escenario: Escenario, onUpdate }): JSX.Element`.

- [ ] **Step 1: Test** — 7 filas del seed con RELEASE/ENTRADAS/PRECIO/FACTURACIÓN (`entradas×precio`, fila individual); editar un input llama `onUpdate({ ticketing: [...] })` con el valor cambiado; ↑/↓ reordena (recalcula `orden`), primera fila tiene ↑ deshabilitado, última tiene ↓ deshabilitado; × borra la fila; "+ Añadir" agrega una fila nueva con `orden` al final; checkbox "Desglosar por ticketera" muestra, al marcarlo, una sub-fila por release con chips de `canales` + botón "+ ticketera" (añade un canal nombrado `Ticketera {n}` editable) + × por canal; footer "Total ticketing · {Σentradas} entradas" + `Σ(entradas×precio)` + "Por acuerdo" (`ingresoTramo` sobre `ticketingBrutoWaterfall` del escenario recibido — verificar que con `escenario='base'` da 4.181,82€).

- [ ] **Step 2-5:** TDD estándar, commit `feat(herramientas): TicketingTable (CRUD + reordenar + desglose por ticketera)`.

---

### Task 12: `MesasVipTable`

**Files:** Create `components/MesasVipTable.tsx` + `.test.tsx`.

**Interfaces:** `MesasVipTable({ proyeccion: Proyeccion, escenario: Escenario, onUpdate }): JSX.Element`.

- [ ] **Step 1: Test** — 3 filas del seed (ZONA/MESAS/PROB.%/PRECIO/FACTURACIÓN calculada); editar, borrar, "+ Añadir"; total 12.790,00€ + "Por acuerdo" 953,44€ (constante, no depende del escenario recibido — verificar explícitamente que pasar `'pesimista'` u `'optimista'` da el mismo "Por acuerdo", documentando en un comentario el hallazgo de la spec §3.3).

- [ ] **Step 2-5:** TDD estándar, commit `feat(herramientas): MesasVipTable`.

---

### Task 13: `BarrasComidaMerchCards`

**Files:** Create `components/BarrasComidaMerchCards.tsx` + `.test.tsx`.

**Interfaces:** `BarrasComidaMerchCards({ proyeccion: Proyeccion, escenario: Escenario, onUpdate }): JSX.Element`.

- [ ] **Step 1: Test** — 3 tarjetas con sus 2 inputs cada una; con escenario `'base'`: Barras 15.000,00€/"Por acuerdo" 1.118,18€ + nota "3.0 cons./pax en 6h"; Comida 1.125,00€/76,70€; Merch 0,00€/0,00€; total "Barras, comida y merch" 16.125,00€ + "Por acuerdo" 1.194,89€ (Σ de los 3 "por acuerdo"). Editar un input llama `onUpdate({ barrasComidaMerch: {...} })`.

- [ ] **Step 2-5:** TDD estándar, commit `feat(herramientas): BarrasComidaMerchCards (consumo escalado por asistencia)`.

---

### Task 14: `GastosTable` (CRUD completo, distinto de `QuienPagaGastos`)

**Files:** Create `components/GastosTable.tsx` + `.test.tsx`.

**Interfaces:** `GastosTable({ gastos: Gasto[], brutos: AcuerdoBrutos, eventoAforo: EventoAforo, onUpdate: (gastos: Gasto[]) => void }): JSX.Element`.

- [ ] **Step 1: Test** — 7 filas del seed (CATEGORÍA select 14 opciones/CONCEPTO texto/BASE select 7 opciones/VALOR número/IMPORTE calculado vía `calcularImporteGasto`/PAGA `SegmentedControl`/×); "+ Añadir" agrega fila con defaults (`Artística`/`''`/`importe_fijo`/`0`/`nosotros`); cambiar BASE a `pct_ticketing_neto` con VALOR 10 recalcula IMPORTE en vivo; total -5.470,00€ con el seed sin tocar nada.

- [ ] **Step 2-5:** TDD estándar, commit `feat(herramientas): GastosTable (CRUD completo con las 7 bases de cálculo)`.

---

### Task 15: `PrevisionTab` — orquestador + integración

**Files:**
- Create: `src/features/herramientas/components/PrevisionTab.tsx`
- Create: `src/features/herramientas/components/PrevisionTab.test.tsx`
- Modify: `src/features/herramientas/pages/ProyeccionDetailPage.tsx`

**Interfaces:** `PrevisionTab({ proyeccion: Proyeccion, onUpdate: (patch: Partial<Proyeccion>) => void }): JSX.Element`.

- [ ] **Step 1: Test** — con el seed: renderiza el selector de escenario (Base activo por defecto), la franja de 6 `StatCard` con las cifras exactas de Base (6.330,14€/Total 33.515,00€, -5.470,00€, 860,14€/Total 24.998,18€, 13.6%, 77%/461 entradas, 500/600 · 83% ocupación); clicar "Pesimista" cambia el beneficio a -1.134,69€ y el margen a -26.2%; clicar "Optimista" da 2.604,97€/32.3%; las secciones Ticketing/MesasVip/BarrasComidaMerch/Gastos se renderizan con sus totales; editar un campo de Ticketing dispara `onUpdate`.

- [ ] **Step 2:** Run → FAIL (no existe el módulo).

- [ ] **Step 3: Implementar**

```tsx
import { useState } from 'react';
import { StatCard } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import { calcularResultadoAcuerdo } from '../data/calculos-acuerdo';
import { calcularBrutosEscenario, calcularEscenariosComparativa, calcularGastoPorCategoria, entradasObjetivo, type Escenario } from '../data/calculos-escenarios';
import { calcularBreakeven } from '../data/calculos-breakeven';
import { ResultadoAcuerdoCard } from './ResultadoAcuerdoCard';
import { EscenarioSelector } from './EscenarioSelector';
import { EscenariosTable } from './EscenariosTable';
import { GastoPorCategoriaCard } from './GastoPorCategoriaCard';
import { AjustesEscenariosCard } from './AjustesEscenariosCard';
import { EventoAforoCard } from './EventoAforoCard';
import { TicketingTable } from './TicketingTable';
import { MesasVipTable } from './MesasVipTable';
import { BarrasComidaMerchCards } from './BarrasComidaMerchCards';
import { GastosTable } from './GastosTable';
import type { Proyeccion } from '../data/types';

interface Props {
  proyeccion: Proyeccion;
  onUpdate: (patch: Partial<Proyeccion>) => void;
}

export function PrevisionTab({ proyeccion, onUpdate }: Props) {
  const [escenario, setEscenario] = useState<Escenario>('base');

  const brutos = calcularBrutosEscenario(proyeccion, escenario);
  const resultado = calcularResultadoAcuerdo(proyeccion.acuerdo, brutos, proyeccion.eventoAforo, proyeccion.gastos);
  const breakeven = calcularBreakeven(proyeccion);
  const objetivo = entradasObjetivo(
    proyeccion.ticketing, proyeccion.ajustesEscenarios, escenario,
    proyeccion.eventoAforo.invitaciones, proyeccion.eventoAforo.asistenciaForzada
  );
  const asistencia = objetivo + proyeccion.eventoAforo.invitaciones;
  const ocupacionPct = proyeccion.eventoAforo.aforoMaximo > 0
    ? Math.round((asistencia / proyeccion.eventoAforo.aforoMaximo) * 100)
    : 0;
  const totalBrutos = brutos.ticketing + brutos.mesasVip + brutos.barras + brutos.comida + brutos.merchandising;
  const totalGastos = proyeccion.gastos.reduce((a, g) => a + g.valor, 0);

  return (
    <div className="space-y-6">
      <EscenarioSelector ajustes={proyeccion.ajustesEscenarios} value={escenario} onChange={setEscenario} />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Ingresos por acuerdo" value={formatCurrency(resultado.nuestrosIngresos)} caption={`Total ${formatCurrency(totalBrutos)}`} />
        <StatCard label="Inversión que asumimos" value={formatCurrency(resultado.gastosQueAsumimos)} valueClassName="text-red-600" caption={`Total ${formatCurrency(-totalGastos)}`} />
        <StatCard label="Beneficio por acuerdo" value={formatCurrency(resultado.beneficioPorAcuerdo)} valueClassName="text-emerald-600" caption={`Total ${formatCurrency(resultado.eventoCompletoBeneficio)}`} />
        <StatCard label="Margen por acuerdo" value={`${resultado.margenSobreIngresos.toFixed(1)}%`} />
        <StatCard label="Punto de equilibrio" value={breakeven ? `${breakeven.pctVentaProyectada}%` : '—'} caption={breakeven ? `${breakeven.entradasNecesarias} entradas` : undefined} />
        <StatCard label="Asistencia" value={`${asistencia} / ${proyeccion.eventoAforo.aforoMaximo}`} caption={`${ocupacionPct}% ocupación`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ResultadoAcuerdoCard resultado={resultado} />
        <EscenariosTable filas={calcularEscenariosComparativa(proyeccion)} />
        <GastoPorCategoriaCard gastos={proyeccion.gastos} />
      </div>

      <AjustesEscenariosCard proyeccion={proyeccion} onUpdate={onUpdate} />
      <EventoAforoCard proyeccion={proyeccion} onUpdate={onUpdate} />
      <TicketingTable proyeccion={proyeccion} escenario={escenario} onUpdate={onUpdate} />
      <MesasVipTable proyeccion={proyeccion} escenario={escenario} onUpdate={onUpdate} />
      <BarrasComidaMerchCards proyeccion={proyeccion} escenario={escenario} onUpdate={onUpdate} />
      <GastosTable
        gastos={proyeccion.gastos}
        brutos={brutos}
        eventoAforo={proyeccion.eventoAforo}
        onUpdate={(gastos) => onUpdate({ gastos })}
      />
    </div>
  );
}
```

**Nota:** Verificar durante la implementación real la caption exacta de "Inversión que asumimos" (`Total -5.470,00€` con el seed — con `totalGastos` sumando todos los `valor` crudos sin pasar por `calcularImporteGasto`, que es una aproximación aceptada y documentada en la spec §5.3; si al implementar se prefiere usar `calcularImporteGasto` para esa caption también, hacerlo y actualizar el test — no cambia el resultado con el seed actual).

- [ ] **Step 4: Ejecutar el test para comprobar que pasa**

- [ ] **Step 5: Integrar en `ProyeccionDetailPage.tsx`**

```tsx
import { PrevisionTab } from '../components/PrevisionTab';
// ...
{tab === 'prevision' && <PrevisionTab proyeccion={proyeccion} onUpdate={handleUpdate} />}
{tab === 'real' && <TabPlaceholder fase="C" />}
```

- [ ] **Step 6: Suite completa + tsc + lint**

Run: `npx vitest run && npx tsc --noEmit && npm run lint`
Expected: 0 errores, todo verde.

- [ ] **Step 7: Commit**

```bash
git add src/features/herramientas/components/PrevisionTab.tsx src/features/herramientas/components/PrevisionTab.test.tsx src/features/herramientas/pages/ProyeccionDetailPage.tsx
git commit -m "feat(herramientas): PrevisionTab — integra el motor de escenarios en el detalle de la proyección"
```

---

### Task 16: Verificación visual final + cierre de fase

- [ ] Levantar el dev server (`npm run dev`) y comparar a ojo `/herramientas/proyecciones/pq-sls-barcelona` (tab Previsión) contra `docs/references/herramientas/live-prevision-full-page.png` y `live-proyeccion-detalle-prevision-escenarios.png`: selector de escenario, franja de KPIs, 3 tarjetas, ajustes/breakeven, evento y aforo, ticketing, VIP, barras/comida/merch, gastos.
- [ ] Clicar los 3 botones de escenario y confirmar en pantalla los 3 juegos de cifras exactos (-1.134,69€/-26.2%, 860,14€/13.6%, 2.604,97€/32.3%).
- [ ] Ejecutar `npx vitest run`, `npx tsc --noEmit`, `npm run lint` una última vez sobre el árbol completo.
- [ ] Confirmar que no queda ninguna discrepancia sin documentar: la nota de fidelidad de Fase A sobre `acuerdoBrutos`/redondeo queda **resuelta** (no es un problema de redondeo, es el modelo waterfall — ver spec §3); si durante la implementación real aparece alguna diferencia de céntimos no prevista aquí, documentarla en un comentario junto al código afectado y en un apéndice de esta sección, siguiendo el mismo criterio que Fase A.
- [ ] No hacer `git push` ni abrir PR — el módulo completo (Fases A+B+C) se fusiona en una sola PR al final, cuando Fase C esté cerrada.
