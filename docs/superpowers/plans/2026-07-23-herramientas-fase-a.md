# Herramientas · Fase A (shell + landing + lista + Acuerdo) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar el placeholder `/herramientas` por el módulo real: shell con sub-nav de verdad, landing, lista de Proyecciones (alta/duplicar/borrar en memoria) y la tab Acuerdo del detalle, con las fórmulas de negocio verificadas al céntimo contra el live.

**Architecture:** `src/features/herramientas/` con `data/` (tipos, semilla, funciones puras de cálculo y CRUD, Context compartido), `components/` (piezas del detalle) y `pages/` (landing, lista, detalle). Estado 100% en memoria (React Context), sin red. `HerramientasShell` copia el patrón de `TeamShell` (AppLayout + tabs reales + `Outlet`).

**Tech Stack:** React 19, react-router 7, Tailwind, Vitest + React Testing Library + `@testing-library/jest-dom`, TypeScript (ES2020 target, sin `Array.prototype.at()`).

## Global Constraints

- Es-ES en todos los textos y formatos (`Intl.NumberFormat('es-ES', ...)`); usar `formatCurrency` de `@/lib/format.ts`, no reinventarlo.
- Un commit por tarea. Cada tarea termina en verde (test nuevo pasa, suite completa sigue en verde).
- No usar `Array.prototype.at()` (target ES2020). Usar indexación normal o `.slice(-1)[0]`.
- No llamadas de red: todo el estado vive en memoria vía `ProyeccionesProvider` (React Context — primer uso de Context en el repo, justificado en el spec).
- Reusar primitivos existentes de `@/components/ui` (`Button`, `Card`, `Badge`, `SegmentedControl`, `UnderlineTabs`, `Select`, `Input`, `Avatar`) — no crear nuevos primitivos genéricos sin comprobar antes si Team/Configuración ya añadieron algo equivalente (ver spec).
- Fuente de verdad de textos/valores: `docs/references/herramientas/recon-notas.md` + los ficheros de esa carpeta. Los valores exactos de la semilla ya están verificados en este plan (ver Tarea 1) — no re-derivarlos a mano.
- Alcance explícito de Fase A: shell, landing, lista, cabecera del detalle (con botones de Fase C **visibles pero inertes**), tab **Acuerdo** funcional, tabs Previsión/Real como placeholder. Ver spec `docs/superpowers/specs/2026-07-23-herramientas-fase-a-design.md`.

---

## Nota de fidelidad importante (leer antes de la Tarea 1)

Al extraer los valores exactos del live para la semilla, se descubrió que **"Total ticketing" que muestra el live (4.600,00 €, 600 entradas) no coincide con la suma literal de sus filas** (Σ entradas×precio de las 7 filas observadas da 6.125,00 €). Se comprobó dos veces con lectura directa del DOM (no es un error de transcripción). Todo lo demás (Mesas VIP, Barras/Comida/Merch, Gastos) sí cuadra exactamente con la suma de sus filas.

Como el motor de Ticketing/Previsión es Fase B (aquí Previsión es un placeholder), y necesitamos que el tab Acuerdo de Fase A muestre las cifras **exactas del live** (6.330,14 € / -5.470,00 € / 860,14 € / 13.6%), la Tarea 1 introduce un campo `acuerdoBrutos` con los 5 brutos **como constantes verificadas** en vez de derivarlos de `ticketing[]`/`mesasVip[]`/`barrasComidaMerch` en esta fase. Fase B, cuando construya el motor real de escenarios (que aparentemente escala las entradas por el multiplicador antes de sumar, con un redondeo por fila que no hemos podido reproducir exactamente desde fuera), deberá sustituir `acuerdoBrutos` por el cálculo real y reconciliar esta discrepancia. Se deja un comentario en el código señalándolo.

---

### Task 1: Tipos de dominio + semilla de datos

**Files:**
- Create: `src/features/herramientas/data/types.ts`
- Create: `src/features/herramientas/data/seed.ts`
- Test: `src/features/herramientas/data/seed.test.ts`

**Interfaces:**
- Produces: `Proyeccion`, `ProyeccionEstado`, `TramoAcuerdoConfig`, `AcuerdoConfig`, `AcuerdoBrutos`, `Responsable`, `Comentario`, `Gasto`, `CategoriaGasto`, `BaseGasto`, `QuienPaga`, `TicketingRelease`, `MesaVip`, `CajaRealLinea`, `BarrasComidaMerchConfig`, `AjustesEscenarios`, `ViaBreakeven`, `EventoAforo`, `ResultadoReal` (todos exportados desde `types.ts`); `seedProyecciones: Proyeccion[]` (desde `seed.ts`).

- [ ] **Step 1: Escribir el test de la semilla (fallará: los módulos no existen)**

```ts
// src/features/herramientas/data/seed.test.ts
import { describe, it, expect } from 'vitest';
import { seedProyecciones } from './seed';

describe('seedProyecciones', () => {
  const p = seedProyecciones[0];

  it('tiene exactamente 1 proyección sembrada, fiel al live', () => {
    expect(seedProyecciones.length).toBe(1);
    expect(p.nombre).toBe('PQ @ SLS Barcelona');
    expect(p.estado).toBe('aprobada');
    expect(p.reunionFecha).toBe('2026-07-20');
  });

  it('tiene 2 responsables sembrados (Jack y Tony)', () => {
    expect(p.responsables.map((r) => r.nombre)).toEqual(['Jack', 'Tony']);
    expect(p.responsables.find((r) => r.nombre === 'Tony')?.iniciales).toBe('TC');
  });

  it('evento y aforo coincide con el live', () => {
    expect(p.eventoAforo).toEqual({
      nombre: 'PQ @ SLS Barcelona',
      fecha: '2026-07-18',
      venue: 'Cósmico @ SLS Barcelona',
      aforoMaximo: 600,
      duracionHoras: 6,
      invitaciones: 50,
      ivaTicketingPct: 10,
      ivaBarrasComidaVipPct: 10,
    });
  });

  it('el acuerdo tiene los 5 tramos fijos con los valores exactos del live', () => {
    expect(p.acuerdo.aplicarAcuerdo).toBe(true);
    expect(p.acuerdo.ticketing).toEqual({ nosLlevamosPct: 100, sobreBase: 'neto', deduccionFijaEur: 0, deduccionPct: 0 });
    expect(p.acuerdo.mesasVip).toEqual({ nosLlevamosPct: 10, sobreBase: 'neto', deduccionFijaEur: 0, deduccionPct: 18 });
    expect(p.acuerdo.barras).toEqual({ nosLlevamosPct: 10, sobreBase: 'neto', deduccionFijaEur: 0, deduccionPct: 18 });
    expect(p.acuerdo.comida).toEqual({ nosLlevamosPct: 10, sobreBase: 'neto', deduccionFijaEur: 0, deduccionPct: 25 });
    expect(p.acuerdo.merchandising).toEqual({ nosLlevamosPct: 100, sobreBase: 'neto', deduccionFijaEur: 0, deduccionPct: 0 });
  });

  it('acuerdoBrutos son las cifras verificadas del live (ver nota de fidelidad)', () => {
    expect(p.acuerdoBrutos).toEqual({ ticketing: 4600, mesasVip: 12790, barras: 15000, comida: 1125, merchandising: 0 });
  });

  it('los 7 gastos suman -5.470,00 € y son todos "nosotros"', () => {
    expect(p.gastos.length).toBe(7);
    expect(p.gastos.every((g) => g.paga === 'nosotros')).toBe(true);
    const total = p.gastos.reduce((a, g) => a + g.valor, 0);
    expect(total).toBe(5470);
  });

  it('gasto por categoría agrega correctamente (Artística 2400, Promoción 1500, Publicidad 1300, Staff 270)', () => {
    const porCategoria: Record<string, number> = {};
    p.gastos.forEach((g) => { porCategoria[g.categoria] = (porCategoria[g.categoria] ?? 0) + g.valor; });
    expect(porCategoria).toEqual({ Artística: 2400, Promoción: 1500, Publicidad: 1300, Staff: 270 });
  });

  it('resultadoReal guarda la cifra real observada del live (Fase C la recalculará)', () => {
    expect(p.resultadoReal).toEqual({ beneficioNeto: -4792.73 });
  });

  it('ticketing y mesasVip guardan las filas observadas (para Fase B)', () => {
    expect(p.ticketing.length).toBe(7);
    expect(p.ticketing[0]).toEqual({ id: 'tk-1', orden: 0, release: 'Early Access - acceso antes de las 7:30pm', entradas: 100, precio: 8 });
    expect(p.mesasVip.length).toBe(3);
    expect(p.mesasVip.map((v) => v.zona)).toEqual(['Zona 1', 'Zona 2', 'Zona 3']);
  });
});
```

- [ ] **Step 2: Ejecutar el test para comprobar que falla**

Run: `npx vitest run src/features/herramientas/data/seed.test.ts`
Expected: FAIL — `Cannot find module './seed'`

- [ ] **Step 3: Crear `types.ts`**

```ts
// src/features/herramientas/data/types.ts
export type ProyeccionEstado = 'borrador' | 'en_junta' | 'aprobada' | 'rechazada';
export type BaseCalculoAcuerdo = 'bruto' | 'neto';
export type QuienPaga = 'nosotros' | 'venue';
export type CategoriaGasto =
  | 'Artística' | 'Publicidad' | 'Promoción' | 'Staff' | 'Alquileres'
  | 'Sonido' | 'Iluminación' | 'Efectos' | 'Producción' | 'Seguridad'
  | 'Barras' | 'Comida' | 'Ticketing' | 'Otros';
export type BaseGasto =
  | 'importe_fijo' | 'pct_facturacion_neta' | 'pct_ticketing_neto'
  | 'pct_vip_neto' | 'pct_barras_neto' | 'pct_comida_neta' | 'pct_merch_neto';
export type ViaBreakeven = 'ticketing' | 'mesas_vip' | 'barras' | 'comida' | 'merchandising';

export interface Responsable {
  id: string;
  nombre: string;
  iniciales: string;
}

export interface Comentario {
  id: string;
  autor: string;
  texto: string;
  fecha: string;
}

export interface TramoAcuerdoConfig {
  nosLlevamosPct: number;
  sobreBase: BaseCalculoAcuerdo;
  deduccionFijaEur: number;
  deduccionPct: number;
}

export interface AcuerdoConfig {
  aplicarAcuerdo: boolean;
  ticketing: TramoAcuerdoConfig;
  mesasVip: TramoAcuerdoConfig;
  barras: TramoAcuerdoConfig;
  comida: TramoAcuerdoConfig;
  merchandising: TramoAcuerdoConfig;
}

/**
 * Brutos por tramo usados por Acuerdo para "NUESTRO INGRESO". Fase A los trata como
 * constantes verificadas del live (ver nota de fidelidad del plan de Fase A): el bruto
 * de ticketing NO coincide con Σ(entradas×precio) de `ticketing[]` porque el live parece
 * escalar las entradas por el multiplicador de escenario antes de sumar. Fase B, al
 * construir el motor real de Previsión, sustituirá esto por el cálculo en vivo.
 */
export interface AcuerdoBrutos {
  ticketing: number;
  mesasVip: number;
  barras: number;
  comida: number;
  merchandising: number;
}

export interface Gasto {
  id: string;
  categoria: CategoriaGasto;
  concepto: string;
  base: BaseGasto;
  valor: number; // magnitud positiva; se muestra siempre con signo "-" delante
  paga: QuienPaga;
}

export interface TicketingRelease {
  id: string;
  orden: number;
  release: string;
  entradas: number;
  precio: number;
  entradasReal?: number;
}

export interface MesaVip {
  id: string;
  zona: string;
  mesas: number;
  probabilidadPct: number;
  precio: number;
  mesasReal?: number;
}

export interface CajaRealLinea {
  id: string;
  fuente: string;
  importe: number;
}

export interface BarrasComidaMerchConfig {
  barras: { consumicionesHora: number; precioMedio: number };
  comida: { pctQueConsume: number; ticketMedio: number };
  merch: { pctConversion: number; precioMedio: number };
}

export interface AjustesEscenarios {
  multiplicadorPesimistaPct: number;
  multiplicadorBasePct: number;
  multiplicadorOptimistaPct: number;
  viasBreakeven: ViaBreakeven[];
}

export interface EventoAforo {
  nombre: string;
  fecha: string;
  venue: string;
  aforoMaximo: number;
  duracionHoras: number;
  invitaciones: number;
  ivaTicketingPct: number;
  ivaBarrasComidaVipPct: number;
  asistenciaForzada?: number;
}

/** Resultado real de la tab Real. Fase A/B lo tratan como constante verificada del
 * live (mismo motivo que `acuerdoBrutos`); Fase C lo calculará de verdad a partir de
 * `cajaReal` + entradas/mesas reales. */
export interface ResultadoReal {
  beneficioNeto: number;
}

export interface Proyeccion {
  id: string;
  nombre: string;
  estado: ProyeccionEstado;
  reunionFecha: string;
  responsables: Responsable[];
  comentarios: Comentario[];
  eventoAforo: EventoAforo;
  acuerdo: AcuerdoConfig;
  acuerdoBrutos: AcuerdoBrutos;
  ajustesEscenarios: AjustesEscenarios;
  ticketing: TicketingRelease[];
  desglosarPorTicketera: boolean;
  mesasVip: MesaVip[];
  barrasComidaMerch: BarrasComidaMerchConfig;
  cajaReal: CajaRealLinea[];
  gastos: Gasto[];
  resultadoReal: ResultadoReal | null;
  creadoEn: string;
  actualizadoEn?: string;
}
```

- [ ] **Step 4: Crear `seed.ts`**

```ts
// src/features/herramientas/data/seed.ts
import type { Proyeccion } from './types';

export const seedProyecciones: Proyeccion[] = [
  {
    id: 'pq-sls-barcelona',
    nombre: 'PQ @ SLS Barcelona',
    estado: 'aprobada',
    reunionFecha: '2026-07-20',
    responsables: [
      { id: 'resp-jack', nombre: 'Jack', iniciales: 'JH' },
      { id: 'resp-tony', nombre: 'Tony', iniciales: 'TC' },
    ],
    comentarios: [],
    eventoAforo: {
      nombre: 'PQ @ SLS Barcelona',
      fecha: '2026-07-18',
      venue: 'Cósmico @ SLS Barcelona',
      aforoMaximo: 600,
      duracionHoras: 6,
      invitaciones: 50,
      ivaTicketingPct: 10,
      ivaBarrasComidaVipPct: 10,
    },
    acuerdo: {
      aplicarAcuerdo: true,
      ticketing: { nosLlevamosPct: 100, sobreBase: 'neto', deduccionFijaEur: 0, deduccionPct: 0 },
      mesasVip: { nosLlevamosPct: 10, sobreBase: 'neto', deduccionFijaEur: 0, deduccionPct: 18 },
      barras: { nosLlevamosPct: 10, sobreBase: 'neto', deduccionFijaEur: 0, deduccionPct: 18 },
      comida: { nosLlevamosPct: 10, sobreBase: 'neto', deduccionFijaEur: 0, deduccionPct: 25 },
      merchandising: { nosLlevamosPct: 100, sobreBase: 'neto', deduccionFijaEur: 0, deduccionPct: 0 },
    },
    // Ver nota de fidelidad: ticketing NO es Σ(entradas×precio) de `ticketing` de abajo.
    acuerdoBrutos: { ticketing: 4600, mesasVip: 12790, barras: 15000, comida: 1125, merchandising: 0 },
    ajustesEscenarios: {
      multiplicadorPesimistaPct: 50,
      multiplicadorBasePct: 75,
      multiplicadorOptimistaPct: 100,
      viasBreakeven: ['ticketing', 'barras'],
    },
    ticketing: [
      { id: 'tk-1', orden: 0, release: 'Early Access - acceso antes de las 7:30pm', entradas: 100, precio: 8 },
      { id: 'tk-2', orden: 1, release: 'Online · Release 1', entradas: 200, precio: 10 },
      { id: 'tk-3', orden: 2, release: 'Online · Release 3', entradas: 150, precio: 12 },
      { id: 'tk-4', orden: 3, release: 'Online · Release 2', entradas: 50, precio: 15 },
      { id: 'tk-5', orden: 4, release: 'Pack 2 Entradas', entradas: 50, precio: 7.5 },
      { id: 'tk-6', orden: 5, release: 'Pack 5 Entradas', entradas: 50, precio: 8 },
      { id: 'tk-7', orden: 6, release: 'Taquilla', entradas: 0, precio: 0 },
    ],
    desglosarPorTicketera: false,
    mesasVip: [
      { id: 'vip-1', zona: 'Zona 1', mesas: 5, probabilidadPct: 85, precio: 1200 },
      { id: 'vip-2', zona: 'Zona 2', mesas: 6, probabilidadPct: 75, precio: 900 },
      { id: 'vip-3', zona: 'Zona 3', mesas: 8, probabilidadPct: 65, precio: 700 },
    ],
    barrasComidaMerch: {
      barras: { consumicionesHora: 0.5, precioMedio: 10 },
      comida: { pctQueConsume: 15, ticketMedio: 15 },
      merch: { pctConversion: 0, precioMedio: 0 },
    },
    cajaReal: [],
    gastos: [
      { id: 'gasto-1', categoria: 'Artística', concepto: 'US TWO - AF', base: 'importe_fijo', valor: 2000, paga: 'nosotros' },
      { id: 'gasto-2', categoria: 'Artística', concepto: 'US TWO - BF', base: 'importe_fijo', valor: 400, paga: 'nosotros' },
      { id: 'gasto-3', categoria: 'Promoción', concepto: 'PleaseQuiet', base: 'importe_fijo', valor: 1500, paga: 'nosotros' },
      { id: 'gasto-4', categoria: 'Staff', concepto: 'Fotografía / Vídeo', base: 'importe_fijo', valor: 150, paga: 'nosotros' },
      { id: 'gasto-5', categoria: 'Staff', concepto: 'Taquilla - Patricia', base: 'importe_fijo', valor: 120, paga: 'nosotros' },
      { id: 'gasto-6', categoria: 'Publicidad', concepto: 'Inversión Meta', base: 'importe_fijo', valor: 1000, paga: 'nosotros' },
      { id: 'gasto-7', categoria: 'Publicidad', concepto: 'Euphoric Media Fee', base: 'importe_fijo', valor: 300, paga: 'nosotros' },
    ],
    // Ver nota de fidelidad: cifra real observada, Fase C la calculará de verdad.
    resultadoReal: { beneficioNeto: -4792.73 },
    creadoEn: '2026-06-01T00:00:00.000Z',
  },
];
```

- [ ] **Step 5: Ejecutar el test para comprobar que pasa**

Run: `npx vitest run src/features/herramientas/data/seed.test.ts`
Expected: PASS (9 tests)

- [ ] **Step 6: Commit**

```bash
git add src/features/herramientas/data/types.ts src/features/herramientas/data/seed.ts src/features/herramientas/data/seed.test.ts
git commit -m "feat(herramientas): tipos de dominio + semilla de Proyecciones"
```

---

### Task 2: Funciones puras de cálculo del Acuerdo

**Files:**
- Create: `src/features/herramientas/data/calculos-acuerdo.ts`
- Test: `src/features/herramientas/data/calculos-acuerdo.test.ts`

**Interfaces:**
- Consumes: `AcuerdoConfig`, `AcuerdoBrutos`, `EventoAforo`, `Gasto`, `TramoAcuerdoConfig` (de `./types`), `seedProyecciones` (de `./seed`, solo en el test).
- Produces: `netoDeIva(bruto: number, ivaPct: number): number`, `baseParaTramo(cfg, bruto, ivaPct): number`, `ingresoTramo(cfg, bruto, ivaPct): number`, `interface ResultadoAcuerdo { nuestrosIngresos, gastosQueAsumimos, beneficioPorAcuerdo, margenSobreIngresos, eventoCompletoBeneficio, margenEventoCompleto }`, `calcularResultadoAcuerdo(acuerdo, brutos, eventoAforo, gastos): ResultadoAcuerdo`.

- [ ] **Step 1: Escribir el test (fallará: el módulo no existe)**

```ts
// src/features/herramientas/data/calculos-acuerdo.test.ts
import { describe, it, expect } from 'vitest';
import { netoDeIva, ingresoTramo, calcularResultadoAcuerdo } from './calculos-acuerdo';
import { seedProyecciones } from './seed';

describe('netoDeIva', () => {
  it('divide el bruto por (1 + iva/100)', () => {
    expect(netoDeIva(4600, 10)).toBeCloseTo(4181.818, 2);
    expect(netoDeIva(100, 0)).toBe(100);
  });
});

describe('ingresoTramo', () => {
  it('calcula el ingreso de Mesas VIP del seed exacto (10%/neto/0/18, iva 10%): 953,44€', () => {
    const cfg = { nosLlevamosPct: 10, sobreBase: 'neto' as const, deduccionFijaEur: 0, deduccionPct: 18 };
    expect(ingresoTramo(cfg, 12790, 10)).toBeCloseTo(953.44, 1);
  });

  it('calcula el ingreso de Barras del seed exacto (10%/neto/0/18, iva 10%): 1.118,18€', () => {
    const cfg = { nosLlevamosPct: 10, sobreBase: 'neto' as const, deduccionFijaEur: 0, deduccionPct: 18 };
    expect(ingresoTramo(cfg, 15000, 10)).toBeCloseTo(1118.18, 1);
  });

  it('calcula el ingreso de Comida del seed exacto (10%/neto/0/25, iva 10%): 76,70€', () => {
    const cfg = { nosLlevamosPct: 10, sobreBase: 'neto' as const, deduccionFijaEur: 0, deduccionPct: 25 };
    expect(ingresoTramo(cfg, 1125, 10)).toBeCloseTo(76.70, 1);
  });

  it('con bruto 0 el ingreso es 0 (Merchandising del seed)', () => {
    const cfg = { nosLlevamosPct: 100, sobreBase: 'neto' as const, deduccionFijaEur: 0, deduccionPct: 0 };
    expect(ingresoTramo(cfg, 0, 10)).toBe(0);
  });
});

describe('calcularResultadoAcuerdo — reproduce exactamente el "Resultado por acuerdo" del live', () => {
  const p = seedProyecciones[0];
  const resultado = calcularResultadoAcuerdo(p.acuerdo, p.acuerdoBrutos, p.eventoAforo, p.gastos);

  it('NUESTROS INGRESOS = 6.330,14€', () => {
    expect(resultado.nuestrosIngresos).toBeCloseTo(6330.14, 1);
  });
  it('GASTOS QUE ASUMIMOS = -5.470,00€', () => {
    expect(resultado.gastosQueAsumimos).toBe(-5470);
  });
  it('BENEFICIO POR ACUERDO = 860,14€', () => {
    expect(resultado.beneficioPorAcuerdo).toBeCloseTo(860.14, 1);
  });
  it('MARGEN S/INGRESOS = 13.6%', () => {
    expect(resultado.margenSobreIngresos).toBeCloseTo(13.6, 1);
  });
  it('Evento completo: 24.998,18€ (82%)', () => {
    expect(resultado.eventoCompletoBeneficio).toBeCloseTo(24998.18, 1);
    expect(Math.round(resultado.margenEventoCompleto)).toBe(82);
  });
});
```

- [ ] **Step 2: Ejecutar el test para comprobar que falla**

Run: `npx vitest run src/features/herramientas/data/calculos-acuerdo.test.ts`
Expected: FAIL — `Cannot find module './calculos-acuerdo'`

- [ ] **Step 3: Implementar `calculos-acuerdo.ts`**

```ts
// src/features/herramientas/data/calculos-acuerdo.ts
import type { AcuerdoConfig, AcuerdoBrutos, EventoAforo, Gasto, TramoAcuerdoConfig } from './types';

export function netoDeIva(bruto: number, ivaPct: number): number {
  return bruto / (1 + ivaPct / 100);
}

export function baseParaTramo(cfg: TramoAcuerdoConfig, bruto: number, ivaPct: number): number {
  return cfg.sobreBase === 'neto' ? netoDeIva(bruto, ivaPct) : bruto;
}

export function ingresoTramo(cfg: TramoAcuerdoConfig, bruto: number, ivaPct: number): number {
  const base = baseParaTramo(cfg, bruto, ivaPct);
  return (base - cfg.deduccionFijaEur) * (1 - cfg.deduccionPct / 100) * (cfg.nosLlevamosPct / 100);
}

export interface ResultadoAcuerdo {
  nuestrosIngresos: number;
  gastosQueAsumimos: number;
  beneficioPorAcuerdo: number;
  margenSobreIngresos: number;
  eventoCompletoBeneficio: number;
  margenEventoCompleto: number;
}

export function calcularResultadoAcuerdo(
  acuerdo: AcuerdoConfig,
  brutos: AcuerdoBrutos,
  eventoAforo: EventoAforo,
  gastos: Gasto[]
): ResultadoAcuerdo {
  const ivaTicketing = eventoAforo.ivaTicketingPct;
  const ivaResto = eventoAforo.ivaBarrasComidaVipPct;

  const nuestrosIngresos =
    ingresoTramo(acuerdo.ticketing, brutos.ticketing, ivaTicketing) +
    ingresoTramo(acuerdo.mesasVip, brutos.mesasVip, ivaResto) +
    ingresoTramo(acuerdo.barras, brutos.barras, ivaResto) +
    ingresoTramo(acuerdo.comida, brutos.comida, ivaResto) +
    ingresoTramo(acuerdo.merchandising, brutos.merchandising, ivaResto);

  const gastosQueAsumimos = -gastos
    .filter((g) => g.paga === 'nosotros')
    .reduce((a, g) => a + g.valor, 0);

  const beneficioPorAcuerdo = nuestrosIngresos + gastosQueAsumimos;
  const margenSobreIngresos = nuestrosIngresos === 0 ? 0 : (beneficioPorAcuerdo / nuestrosIngresos) * 100;

  const totalNetoEvento =
    netoDeIva(brutos.ticketing, ivaTicketing) +
    netoDeIva(brutos.mesasVip, ivaResto) +
    netoDeIva(brutos.barras, ivaResto) +
    netoDeIva(brutos.comida, ivaResto) +
    netoDeIva(brutos.merchandising, ivaResto);

  const eventoCompletoBeneficio = totalNetoEvento + gastosQueAsumimos;
  const margenEventoCompleto = totalNetoEvento === 0 ? 0 : (eventoCompletoBeneficio / totalNetoEvento) * 100;

  return {
    nuestrosIngresos,
    gastosQueAsumimos,
    beneficioPorAcuerdo,
    margenSobreIngresos,
    eventoCompletoBeneficio,
    margenEventoCompleto,
  };
}
```

- [ ] **Step 4: Ejecutar el test para comprobar que pasa**

Run: `npx vitest run src/features/herramientas/data/calculos-acuerdo.test.ts`
Expected: PASS (10 tests)

- [ ] **Step 5: Commit**

```bash
git add src/features/herramientas/data/calculos-acuerdo.ts src/features/herramientas/data/calculos-acuerdo.test.ts
git commit -m "feat(herramientas): fórmulas de Resultado por acuerdo verificadas contra el live"
```

---

### Task 3: CRUD puro de proyecciones

**Files:**
- Create: `src/features/herramientas/data/proyecciones-crud.ts`
- Test: `src/features/herramientas/data/proyecciones-crud.test.ts`

**Interfaces:**
- Consumes: `Proyeccion` (de `./types`).
- Produces: `createBlankProyeccion(): Proyeccion`, `duplicateProyeccion(p: Proyeccion): Proyeccion`, `removeProyeccion(list: Proyeccion[], id: string): Proyeccion[]`, `updateProyeccion(list: Proyeccion[], id: string, patch: Partial<Proyeccion>): Proyeccion[]`.

- [ ] **Step 1: Escribir el test**

```ts
// src/features/herramientas/data/proyecciones-crud.test.ts
import { describe, it, expect } from 'vitest';
import { createBlankProyeccion, duplicateProyeccion, removeProyeccion, updateProyeccion } from './proyecciones-crud';
import { seedProyecciones } from './seed';

describe('createBlankProyeccion', () => {
  it('crea una proyección en blanco con estado borrador y los defaults del live', () => {
    const p = createBlankProyeccion();
    expect(p.id).toBeTruthy();
    expect(p.nombre).toBe('Nuevo evento');
    expect(p.estado).toBe('borrador');
    expect(p.responsables).toEqual([]);
    expect(p.gastos).toEqual([]);
    expect(p.eventoAforo.duracionHoras).toBe(6);
    expect(p.eventoAforo.ivaTicketingPct).toBe(10);
    expect(p.ajustesEscenarios).toEqual({
      multiplicadorPesimistaPct: 75, multiplicadorBasePct: 100, multiplicadorOptimistaPct: 115, viasBreakeven: [],
    });
    expect(p.resultadoReal).toBeNull();
  });

  it('cada llamada produce un id distinto', () => {
    const a = createBlankProyeccion();
    const b = createBlankProyeccion();
    expect(a.id).not.toBe(b.id);
  });
});

describe('duplicateProyeccion', () => {
  it('copia todos los datos con un id nuevo, estado borrador y nombre con sufijo', () => {
    const original = seedProyecciones[0];
    const copia = duplicateProyeccion(original);
    expect(copia.id).not.toBe(original.id);
    expect(copia.nombre).toBe('PQ @ SLS Barcelona (copia)');
    expect(copia.estado).toBe('borrador');
    expect(copia.gastos).toEqual(original.gastos);
    expect(copia.actualizadoEn).toBeUndefined();
  });
});

describe('removeProyeccion', () => {
  it('quita solo la proyección con ese id', () => {
    const lista = [createBlankProyeccion(), createBlankProyeccion()];
    const result = removeProyeccion(lista, lista[0].id);
    expect(result).toEqual([lista[1]]);
  });
});

describe('updateProyeccion', () => {
  it('mezcla el patch y actualiza actualizadoEn solo en la proyección con ese id', () => {
    const lista = seedProyecciones;
    const [p] = lista;
    const result = updateProyeccion(lista, p.id, { estado: 'rechazada' });
    expect(result[0].estado).toBe('rechazada');
    expect(result[0].actualizadoEn).toBeTruthy();
    expect(result[0].nombre).toBe(p.nombre);
  });

  it('no muta el array ni el objeto originales', () => {
    const lista = seedProyecciones;
    const result = updateProyeccion(lista, lista[0].id, { estado: 'rechazada' });
    expect(result).not.toBe(lista);
    expect(lista[0].estado).toBe('aprobada');
  });
});
```

**Nota sobre los defaults de "Nueva proyección":** `docs/references/herramientas/live-nueva-proyeccion-form-vacio.json` muestra `ESCENARIO Pesimista · 75% Base · 100% Optimista · 115%` para un borrador nuevo (distintos de los 50/75/100 del seed real ya sembrado) — el live parece variar los defaults de escenario ligeramente entre proyecciones; usamos los observados en el formulario vacío para `createBlankProyeccion`.

- [ ] **Step 2: Ejecutar el test para comprobar que falla**

Run: `npx vitest run src/features/herramientas/data/proyecciones-crud.test.ts`
Expected: FAIL — `Cannot find module './proyecciones-crud'`

- [ ] **Step 3: Implementar `proyecciones-crud.ts`**

```ts
// src/features/herramientas/data/proyecciones-crud.ts
import type { Proyeccion } from './types';

export function createBlankProyeccion(): Proyeccion {
  return {
    id: crypto.randomUUID(),
    nombre: 'Nuevo evento',
    estado: 'borrador',
    reunionFecha: '',
    responsables: [],
    comentarios: [],
    eventoAforo: {
      nombre: 'Nuevo evento',
      fecha: '',
      venue: '',
      aforoMaximo: 0,
      duracionHoras: 6,
      invitaciones: 0,
      ivaTicketingPct: 10,
      ivaBarrasComidaVipPct: 10,
    },
    acuerdo: {
      aplicarAcuerdo: true,
      ticketing: { nosLlevamosPct: 0, sobreBase: 'neto', deduccionFijaEur: 0, deduccionPct: 0 },
      mesasVip: { nosLlevamosPct: 0, sobreBase: 'neto', deduccionFijaEur: 0, deduccionPct: 0 },
      barras: { nosLlevamosPct: 0, sobreBase: 'neto', deduccionFijaEur: 0, deduccionPct: 0 },
      comida: { nosLlevamosPct: 0, sobreBase: 'neto', deduccionFijaEur: 0, deduccionPct: 0 },
      merchandising: { nosLlevamosPct: 0, sobreBase: 'neto', deduccionFijaEur: 0, deduccionPct: 0 },
    },
    acuerdoBrutos: { ticketing: 0, mesasVip: 0, barras: 0, comida: 0, merchandising: 0 },
    ajustesEscenarios: {
      multiplicadorPesimistaPct: 75,
      multiplicadorBasePct: 100,
      multiplicadorOptimistaPct: 115,
      viasBreakeven: [],
    },
    ticketing: [],
    desglosarPorTicketera: false,
    mesasVip: [],
    barrasComidaMerch: {
      barras: { consumicionesHora: 0, precioMedio: 0 },
      comida: { pctQueConsume: 0, ticketMedio: 0 },
      merch: { pctConversion: 0, precioMedio: 0 },
    },
    cajaReal: [],
    gastos: [],
    resultadoReal: null,
    creadoEn: new Date().toISOString(),
  };
}

export function duplicateProyeccion(p: Proyeccion): Proyeccion {
  return {
    ...p,
    id: crypto.randomUUID(),
    nombre: `${p.nombre} (copia)`,
    estado: 'borrador',
    creadoEn: new Date().toISOString(),
    actualizadoEn: undefined,
  };
}

export function removeProyeccion(list: Proyeccion[], id: string): Proyeccion[] {
  return list.filter((p) => p.id !== id);
}

export function updateProyeccion(list: Proyeccion[], id: string, patch: Partial<Proyeccion>): Proyeccion[] {
  return list.map((p) => (p.id === id ? { ...p, ...patch, actualizadoEn: new Date().toISOString() } : p));
}
```

- [ ] **Step 4: Ejecutar el test para comprobar que pasa**

Run: `npx vitest run src/features/herramientas/data/proyecciones-crud.test.ts`
Expected: PASS (6 tests)

- [ ] **Step 5: Commit**

```bash
git add src/features/herramientas/data/proyecciones-crud.ts src/features/herramientas/data/proyecciones-crud.test.ts
git commit -m "feat(herramientas): CRUD puro de proyecciones (crear/duplicar/borrar/actualizar)"
```

---

### Task 4: Context compartido `ProyeccionesProvider`

**Files:**
- Create: `src/features/herramientas/data/proyecciones-context.tsx`
- Test: `src/features/herramientas/data/proyecciones-context.test.tsx`

**Interfaces:**
- Consumes: `seedProyecciones` (de `./seed`), `createBlankProyeccion`, `duplicateProyeccion`, `removeProyeccion`, `updateProyeccion` (de `./proyecciones-crud`), `Proyeccion` (de `./types`).
- Produces: `ProyeccionesProvider({ children }): JSX.Element`, `useProyecciones(): { proyecciones: Proyeccion[]; crear(): Proyeccion; duplicar(id: string): void; borrar(id: string): void; actualizar(id: string, patch: Partial<Proyeccion>): void }`.

- [ ] **Step 1: Escribir el test**

```tsx
// src/features/herramientas/data/proyecciones-context.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProyeccionesProvider, useProyecciones } from './proyecciones-context';

function TestConsumer() {
  const { proyecciones, crear, duplicar, borrar, actualizar } = useProyecciones();
  return (
    <div>
      <p data-testid="count">{proyecciones.length}</p>
      <ul>
        {proyecciones.map((p) => (
          <li key={p.id}>{p.nombre} — {p.estado}</li>
        ))}
      </ul>
      <button onClick={() => crear()}>crear</button>
      <button onClick={() => duplicar(proyecciones[0].id)}>duplicar</button>
      <button onClick={() => borrar(proyecciones[0].id)}>borrar</button>
      <button onClick={() => actualizar(proyecciones[0].id, { estado: 'rechazada' })}>actualizar</button>
    </div>
  );
}

function renderConsumer() {
  return render(
    <ProyeccionesProvider>
      <TestConsumer />
    </ProyeccionesProvider>
  );
}

describe('ProyeccionesProvider / useProyecciones', () => {
  it('arranca con la semilla (1 proyección)', () => {
    renderConsumer();
    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });

  it('crear() añade una proyección nueva', async () => {
    renderConsumer();
    await userEvent.click(screen.getByText('crear'));
    expect(screen.getByTestId('count')).toHaveTextContent('2');
  });

  it('duplicar() añade una copia', async () => {
    renderConsumer();
    await userEvent.click(screen.getByText('duplicar'));
    expect(screen.getByTestId('count')).toHaveTextContent('2');
    expect(screen.getByText(/PQ @ SLS Barcelona \(copia\)/)).toBeInTheDocument();
  });

  it('borrar() quita la proyección', async () => {
    renderConsumer();
    await userEvent.click(screen.getByText('borrar'));
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });

  it('actualizar() cambia un campo', async () => {
    renderConsumer();
    await userEvent.click(screen.getByText('actualizar'));
    expect(screen.getByText(/PQ @ SLS Barcelona — rechazada/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Ejecutar el test para comprobar que falla**

Run: `npx vitest run src/features/herramientas/data/proyecciones-context.test.tsx`
Expected: FAIL — `Cannot find module './proyecciones-context'`

- [ ] **Step 3: Implementar `proyecciones-context.tsx`**

```tsx
// src/features/herramientas/data/proyecciones-context.tsx
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Proyeccion } from './types';
import { seedProyecciones } from './seed';
import { createBlankProyeccion, duplicateProyeccion, removeProyeccion, updateProyeccion } from './proyecciones-crud';

interface ProyeccionesContextValue {
  proyecciones: Proyeccion[];
  crear: () => Proyeccion;
  duplicar: (id: string) => void;
  borrar: (id: string) => void;
  actualizar: (id: string, patch: Partial<Proyeccion>) => void;
}

const ProyeccionesContext = createContext<ProyeccionesContextValue | null>(null);

export function ProyeccionesProvider({ children }: { children: ReactNode }) {
  const [proyecciones, setProyecciones] = useState<Proyeccion[]>(seedProyecciones);

  const value = useMemo<ProyeccionesContextValue>(
    () => ({
      proyecciones,
      crear: () => {
        const nueva = createBlankProyeccion();
        setProyecciones((prev) => [...prev, nueva]);
        return nueva;
      },
      duplicar: (id) => {
        setProyecciones((prev) => {
          const original = prev.find((p) => p.id === id);
          return original ? [...prev, duplicateProyeccion(original)] : prev;
        });
      },
      borrar: (id) => setProyecciones((prev) => removeProyeccion(prev, id)),
      actualizar: (id, patch) => setProyecciones((prev) => updateProyeccion(prev, id, patch)),
    }),
    [proyecciones]
  );

  return <ProyeccionesContext.Provider value={value}>{children}</ProyeccionesContext.Provider>;
}

export function useProyecciones(): ProyeccionesContextValue {
  const ctx = useContext(ProyeccionesContext);
  if (!ctx) throw new Error('useProyecciones debe usarse dentro de <ProyeccionesProvider>');
  return ctx;
}
```

**Nota:** `crear()` devuelve la proyección creada de forma síncrona; como `setProyecciones` es asíncrono, el valor devuelto se usa directamente (no se lee de vuelta del array) para poder navegar a `/herramientas/proyecciones/${nueva.id}` inmediatamente (ver Tarea 7).

- [ ] **Step 4: Ejecutar el test para comprobar que pasa**

Run: `npx vitest run src/features/herramientas/data/proyecciones-context.test.tsx`
Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add src/features/herramientas/data/proyecciones-context.tsx src/features/herramientas/data/proyecciones-context.test.tsx
git commit -m "feat(herramientas): ProyeccionesProvider (Context compartido lista/detalle)"
```

---

### Task 5: `HerramientasShell` real + rutas anidadas

**Files:**
- Modify: `src/features/modules/HerramientasShell.tsx`
- Create: `src/features/modules/HerramientasShell.test.tsx`
- Modify: `src/app/router.tsx`

**Interfaces:**
- Consumes: `AppLayout` (de `@/components/layout`), `ProyeccionesProvider` (de `@/features/herramientas/data/proyecciones-context`), `User` (de `@/types`).
- Produces: `HerramientasShell(): JSX.Element` (sin props). Las páginas de las Tareas 6/7/14 se registran como hijas de la ruta `/herramientas`.

- [ ] **Step 1: Escribir el test (fallará: `HerramientasShell` sigue siendo el placeholder sin tabs/Outlet)**

```tsx
// src/features/modules/HerramientasShell.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { HerramientasShell } from './HerramientasShell';

function renderShell(initialEntry = '/herramientas') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/herramientas" element={<HerramientasShell />}>
          <Route index element={<div data-testid="resumen-page">Resumen</div>} />
          <Route path="proyecciones" element={<div data-testid="proyecciones-page">Proyecciones</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe('HerramientasShell', () => {
  it('renders module tabs', () => {
    renderShell();
    expect(screen.getByRole('link', { name: 'Herramientas' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Proyecciones' })).toBeInTheDocument();
  });

  it('renders the outlet child', () => {
    renderShell('/herramientas/proyecciones');
    expect(screen.getByTestId('proyecciones-page')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Ejecutar el test para comprobar que falla**

Run: `npx vitest run src/features/modules/HerramientasShell.test.tsx`
Expected: FAIL — no hay ningún `link` con nombre "Proyecciones" (el placeholder actual no renderiza tabs ni `Outlet`)

- [ ] **Step 3: Reescribir `HerramientasShell.tsx`**

```tsx
// src/features/modules/HerramientasShell.tsx
import { Outlet } from 'react-router';
import { AppLayout } from '@/components/layout';
import { ProyeccionesProvider } from '@/features/herramientas/data/proyecciones-context';
import type { User } from '@/types';

const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'Admin',
};

export function HerramientasShell() {
  const tabs = [
    { label: 'Herramientas', href: '/herramientas' },
    { label: 'Proyecciones', href: '/herramientas/proyecciones' },
  ];
  return (
    <AppLayout user={mockUser} module={{ name: 'Herramientas', href: '/herramientas', tabs }}>
      <ProyeccionesProvider>
        <Outlet />
      </ProyeccionesProvider>
    </AppLayout>
  );
}
```

- [ ] **Step 4: Ejecutar el test para comprobar que pasa**

Run: `npx vitest run src/features/modules/HerramientasShell.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: Anidar las rutas en `router.tsx`**

En `src/app/router.tsx`, añadir los imports de las páginas nuevas junto a los de `crm`/`team` (las páginas de las Tareas 6/7/14 se crean después; este import se completa en la Tarea 14 — de momento importar solo lo que ya existe):

```tsx
import { HerramientasResumenPage } from '@/features/herramientas/pages/HerramientasResumenPage';
import { ProyeccionesListPage } from '@/features/herramientas/pages/ProyeccionesListPage';
import { ProyeccionDetailPage } from '@/features/herramientas/pages/ProyeccionDetailPage';
```

Y sustituir la ruta plana:

```tsx
      <Route path="/herramientas" element={<HerramientasShell />} />
```

por:

```tsx
      <Route path="/herramientas" element={<HerramientasShell />}>
        <Route index element={<HerramientasResumenPage />} />
        <Route path="proyecciones" element={<ProyeccionesListPage />} />
        <Route path="proyecciones/:id" element={<ProyeccionDetailPage />} />
      </Route>
```

**Nota:** este Step 5 dejará `tsc`/build rotos temporalmente porque esas 3 páginas aún no existen — es intencional para fijar el punto de inserción ahora; el Step 6 crea stubs mínimos SOLO para que compile, y las Tareas 6/7/14 los sustituyen por la implementación real con sus propios tests.

- [ ] **Step 6: Crear stubs mínimos para que compile (se sustituyen en Tareas 6/7/14)**

```tsx
// src/features/herramientas/pages/HerramientasResumenPage.tsx
export function HerramientasResumenPage() {
  return null;
}
```

```tsx
// src/features/herramientas/pages/ProyeccionesListPage.tsx
export function ProyeccionesListPage() {
  return null;
}
```

```tsx
// src/features/herramientas/pages/ProyeccionDetailPage.tsx
export function ProyeccionDetailPage() {
  return null;
}
```

- [ ] **Step 7: Verificar que compila y la suite completa sigue en verde**

Run: `npx tsc --noEmit && npx vitest run`
Expected: 0 errores de tipos, todos los tests en verde

- [ ] **Step 8: Commit**

```bash
git add src/features/modules/HerramientasShell.tsx src/features/modules/HerramientasShell.test.tsx src/app/router.tsx src/features/herramientas/pages/
git commit -m "feat(herramientas): HerramientasShell real con sub-nav + rutas anidadas"
```

---

### Task 6: `HerramientasResumenPage` (landing)

**Files:**
- Modify: `src/features/herramientas/pages/HerramientasResumenPage.tsx` (sustituye el stub de la Tarea 5)
- Create: `src/features/herramientas/pages/HerramientasResumenPage.test.tsx`

**Interfaces:**
- Consumes: `Card` (de `@/components/ui`), `Link` (de `react-router`).
- Produces: `HerramientasResumenPage(): JSX.Element`.

- [ ] **Step 1: Escribir el test**

```tsx
// src/features/herramientas/pages/HerramientasResumenPage.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { HerramientasResumenPage } from './HerramientasResumenPage';

describe('HerramientasResumenPage', () => {
  it('renders the H1, subtitle and the Proyecciones card link', () => {
    render(<MemoryRouter><HerramientasResumenPage /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Utilidades del grupo' })).toBeInTheDocument();
    expect(screen.getByText(/Calculadoras y herramientas transversales del equipo/)).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /Proyecciones · P&L de eventos/ });
    expect(link).toHaveAttribute('href', '/herramientas/proyecciones');
    expect(screen.getByText(/Cuenta de explotación por aforo, ventas y gastos/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Ejecutar el test para comprobar que falla**

Run: `npx vitest run src/features/herramientas/pages/HerramientasResumenPage.test.tsx`
Expected: FAIL — el stub devuelve `null`

- [ ] **Step 3: Implementar la página**

```tsx
// src/features/herramientas/pages/HerramientasResumenPage.tsx
import { Link } from 'react-router';
import { Card } from '@/components/ui';

export function HerramientasResumenPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Utilidades del grupo</h1>
        <p className="text-slate-500">
          Calculadoras y herramientas transversales del equipo. Se irán sumando más con el tiempo.
        </p>
      </div>
      <Link to="/herramientas/proyecciones" className="block">
        <Card className="p-6 transition-shadow hover:shadow-md">
          <h2 className="text-lg font-semibold text-slate-900">Proyecciones · P&L de eventos</h2>
          <p className="mt-1 text-sm text-slate-500">
            Cuenta de explotación por aforo, ventas y gastos. Escenarios, punto de equilibrio selectivo e informes PDF/Excel.
          </p>
        </Card>
      </Link>
    </div>
  );
}
```

- [ ] **Step 4: Ejecutar el test para comprobar que pasa**

Run: `npx vitest run src/features/herramientas/pages/HerramientasResumenPage.test.tsx`
Expected: PASS (1 test)

- [ ] **Step 5: Commit**

```bash
git add src/features/herramientas/pages/HerramientasResumenPage.tsx src/features/herramientas/pages/HerramientasResumenPage.test.tsx
git commit -m "feat(herramientas): landing Utilidades del grupo"
```

---

### Task 7: `ProyeccionRow` + `ProyeccionesListPage`

**Files:**
- Create: `src/features/herramientas/components/ProyeccionRow.tsx`
- Test: `src/features/herramientas/components/ProyeccionRow.test.tsx`
- Modify: `src/features/herramientas/pages/ProyeccionesListPage.tsx` (sustituye el stub de la Tarea 5)
- Create: `src/features/herramientas/pages/ProyeccionesListPage.test.tsx`

**Interfaces:**
- Consumes: `Proyeccion` (de `../data/types`), `calcularResultadoAcuerdo` (de `../data/calculos-acuerdo`), `formatCurrency` (de `@/lib/format`), `Badge`/`Button` (de `@/components/ui`), `useProyecciones` (de `../data/proyecciones-context`).
- Produces: `ProyeccionRow({ proyeccion, onDuplicate, onDelete }): JSX.Element`.

- [ ] **Step 1: Escribir el test de `ProyeccionRow`**

```tsx
// src/features/herramientas/components/ProyeccionRow.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { ProyeccionRow } from './ProyeccionRow';
import { seedProyecciones } from '../data/seed';

describe('ProyeccionRow', () => {
  const proyeccion = seedProyecciones[0];

  it('renders name, badges, dates and PREVISIÓN/REAL amounts', () => {
    render(<MemoryRouter><ProyeccionRow proyeccion={proyeccion} onDuplicate={vi.fn()} onDelete={vi.fn()} /></MemoryRouter>);
    expect(screen.getByText('PQ @ SLS Barcelona')).toBeInTheDocument();
    expect(screen.getByText('Aprobada')).toBeInTheDocument();
    expect(screen.getByText('Real')).toBeInTheDocument();
    expect(screen.getByText(/860,14/)).toBeInTheDocument();
    expect(screen.getByText(/-4792,73|-4\.792,73/)).toBeInTheDocument();
  });

  it('links to the detail route', () => {
    render(<MemoryRouter><ProyeccionRow proyeccion={proyeccion} onDuplicate={vi.fn()} onDelete={vi.fn()} /></MemoryRouter>);
    expect(screen.getByRole('link')).toHaveAttribute('href', `/herramientas/proyecciones/${proyeccion.id}`);
  });

  it('calls onDuplicate / onDelete with the id when clicked', async () => {
    const onDuplicate = vi.fn();
    const onDelete = vi.fn();
    render(<MemoryRouter><ProyeccionRow proyeccion={proyeccion} onDuplicate={onDuplicate} onDelete={onDelete} /></MemoryRouter>);
    await userEvent.click(screen.getByText('Duplicar'));
    await userEvent.click(screen.getByText('Borrar'));
    expect(onDuplicate).toHaveBeenCalledWith(proyeccion.id);
    expect(onDelete).toHaveBeenCalledWith(proyeccion.id);
  });

  it('no muestra el badge "Real" ni la columna REAL si resultadoReal es null', () => {
    const sinReal = { ...proyeccion, resultadoReal: null };
    render(<MemoryRouter><ProyeccionRow proyeccion={sinReal} onDuplicate={vi.fn()} onDelete={vi.fn()} /></MemoryRouter>);
    expect(screen.queryByText('Real')).not.toBeInTheDocument();
    expect(screen.getByText('—')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Ejecutar el test para comprobar que falla**

Run: `npx vitest run src/features/herramientas/components/ProyeccionRow.test.tsx`
Expected: FAIL — `Cannot find module './ProyeccionRow'`

- [ ] **Step 3: Implementar `ProyeccionRow.tsx`**

```tsx
// src/features/herramientas/components/ProyeccionRow.tsx
import { Link } from 'react-router';
import { Badge, Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/format';
import { calcularResultadoAcuerdo } from '../data/calculos-acuerdo';
import type { Proyeccion, ProyeccionEstado } from '../data/types';

const ESTADO_LABEL: Record<ProyeccionEstado, string> = {
  borrador: 'Borrador',
  en_junta: 'En junta',
  aprobada: 'Aprobada',
  rechazada: 'Rechazada',
};

const ESTADO_VARIANT: Record<ProyeccionEstado, 'neutral' | 'info' | 'success' | 'danger'> = {
  borrador: 'neutral',
  en_junta: 'info',
  aprobada: 'success',
  rechazada: 'danger',
};

interface Props {
  proyeccion: Proyeccion;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ProyeccionRow({ proyeccion, onDuplicate, onDelete }: Props) {
  const resultado = calcularResultadoAcuerdo(
    proyeccion.acuerdo,
    proyeccion.acuerdoBrutos,
    proyeccion.eventoAforo,
    proyeccion.gastos
  );

  return (
    <div className="group flex items-center justify-between gap-4 border-b border-slate-100 px-4 py-4 last:border-0">
      <Link to={`/herramientas/proyecciones/${proyeccion.id}`} className="flex flex-1 items-center gap-3">
        <span className="font-semibold text-slate-900">{proyeccion.nombre}</span>
        {proyeccion.resultadoReal && <Badge variant="sky">Real</Badge>}
        <Badge variant={ESTADO_VARIANT[proyeccion.estado]}>{ESTADO_LABEL[proyeccion.estado]}</Badge>
        <span className="text-sm text-slate-400">
          {proyeccion.eventoAforo.fecha || 'sin fecha'} · actualizado {proyeccion.actualizadoEn ?? '—'}
        </span>
      </Link>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-xs uppercase text-slate-400">Previsión</p>
          <p className="font-semibold text-emerald-600">{formatCurrency(resultado.beneficioPorAcuerdo)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase text-slate-400">Real</p>
          <p className={cn('font-semibold', (proyeccion.resultadoReal?.beneficioNeto ?? 0) < 0 ? 'text-red-600' : 'text-emerald-600')}>
            {proyeccion.resultadoReal ? formatCurrency(proyeccion.resultadoReal.beneficioNeto) : '—'}
          </p>
        </div>
        <div className="hidden items-center gap-2 group-hover:flex">
          <Button variant="secondary" size="sm" onClick={() => onDuplicate(proyeccion.id)}>Duplicar</Button>
          <Button variant="danger" size="sm" onClick={() => onDelete(proyeccion.id)}>Borrar</Button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Ejecutar el test para comprobar que pasa**

Run: `npx vitest run src/features/herramientas/components/ProyeccionRow.test.tsx`
Expected: PASS (4 tests)

- [ ] **Step 5: Escribir el test de `ProyeccionesListPage`**

```tsx
// src/features/herramientas/pages/ProyeccionesListPage.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router';
import { ProyeccionesProvider } from '../data/proyecciones-context';
import { ProyeccionesListPage } from './ProyeccionesListPage';

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/herramientas/proyecciones']}>
      <ProyeccionesProvider>
        <Routes>
          <Route path="/herramientas/proyecciones" element={<ProyeccionesListPage />} />
          <Route path="/herramientas/proyecciones/:id" element={<div data-testid="detail">detalle</div>} />
        </Routes>
      </ProyeccionesProvider>
    </MemoryRouter>
  );
}

describe('ProyeccionesListPage', () => {
  it('renders the title, subtitle and the seeded row', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: 'Cuenta de explotación de eventos' })).toBeInTheDocument();
    expect(screen.getByText('PQ @ SLS Barcelona')).toBeInTheDocument();
  });

  it('clicking "Nueva proyección" creates a draft and navigates to its detail', async () => {
    renderPage();
    await userEvent.click(screen.getByRole('button', { name: 'Nueva proyección' }));
    expect(screen.getByTestId('detail')).toBeInTheDocument();
  });

  it('deleting the only row shows the empty state', async () => {
    renderPage();
    // hover actions are always in the DOM (solo ocultas con CSS), así que el botón es clicable en jsdom
    await userEvent.click(screen.getByText('Borrar'));
    expect(screen.getByText('Todavía no hay proyecciones.')).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Ejecutar el test para comprobar que falla**

Run: `npx vitest run src/features/herramientas/pages/ProyeccionesListPage.test.tsx`
Expected: FAIL — el stub devuelve `null`

- [ ] **Step 7: Implementar `ProyeccionesListPage.tsx`**

```tsx
// src/features/herramientas/pages/ProyeccionesListPage.tsx
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui';
import { useProyecciones } from '../data/proyecciones-context';
import { ProyeccionRow } from '../components/ProyeccionRow';

export function ProyeccionesListPage() {
  const navigate = useNavigate();
  const { proyecciones, crear, duplicar, borrar } = useProyecciones();

  const handleNueva = () => {
    const nueva = crear();
    navigate(`/herramientas/proyecciones/${nueva.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Cuenta de explotación de eventos</h1>
          <p className="text-slate-500">
            Acuerdo, previsión y seguimiento real de un evento, con reparto por deal, escenarios y punto de equilibrio.
          </p>
        </div>
        <Button variant="primary" onClick={handleNueva}>Nueva proyección</Button>
      </div>
      {proyecciones.length === 0 ? (
        <p className="py-12 text-center text-slate-400">Todavía no hay proyecciones.</p>
      ) : (
        <div className="rounded-xl border border-slate-100 bg-white">
          {proyecciones.map((p) => (
            <ProyeccionRow key={p.id} proyeccion={p} onDuplicate={duplicar} onDelete={borrar} />
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 8: Ejecutar el test para comprobar que pasa**

Run: `npx vitest run src/features/herramientas/pages/ProyeccionesListPage.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 9: Commit**

```bash
git add src/features/herramientas/components/ProyeccionRow.tsx src/features/herramientas/components/ProyeccionRow.test.tsx src/features/herramientas/pages/ProyeccionesListPage.tsx src/features/herramientas/pages/ProyeccionesListPage.test.tsx
git commit -m "feat(herramientas): lista de proyecciones (alta/duplicar/borrar)"
```

---

### Task 8: `ResponsablesChips`

**Files:**
- Create: `src/features/herramientas/components/ResponsablesChips.tsx`
- Test: `src/features/herramientas/components/ResponsablesChips.test.tsx`

**Interfaces:**
- Consumes: `Responsable` (de `../data/types`), `Avatar`/`Button` (de `@/components/ui`).
- Produces: `ResponsablesChips({ responsables, onRemove }): JSX.Element`.

- [ ] **Step 1: Escribir el test**

```tsx
// src/features/herramientas/components/ResponsablesChips.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResponsablesChips } from './ResponsablesChips';

const responsables = [
  { id: 'resp-jack', nombre: 'Jack', iniciales: 'JH' },
  { id: 'resp-tony', nombre: 'Tony', iniciales: 'TC' },
];

describe('ResponsablesChips', () => {
  it('renders a chip per responsable and the inert "＋ Añadir" button', () => {
    render(<ResponsablesChips responsables={responsables} onRemove={vi.fn()} />);
    expect(screen.getByText('Jack')).toBeInTheDocument();
    expect(screen.getByText('Tony')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '＋ Añadir' })).toBeInTheDocument();
  });

  it('calls onRemove with the responsable id', async () => {
    const onRemove = vi.fn();
    render(<ResponsablesChips responsables={responsables} onRemove={onRemove} />);
    await userEvent.click(screen.getByRole('button', { name: 'Quitar Jack' }));
    expect(onRemove).toHaveBeenCalledWith('resp-jack');
  });
});
```

- [ ] **Step 2: Ejecutar el test para comprobar que falla**

Run: `npx vitest run src/features/herramientas/components/ResponsablesChips.test.tsx`
Expected: FAIL — `Cannot find module './ResponsablesChips'`

- [ ] **Step 3: Implementar**

```tsx
// src/features/herramientas/components/ResponsablesChips.tsx
import { Avatar, Button } from '@/components/ui';
import type { Responsable } from '../data/types';

interface Props {
  responsables: Responsable[];
  onRemove: (id: string) => void;
}

export function ResponsablesChips({ responsables, onRemove }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {responsables.map((r) => (
        <span
          key={r.id}
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 py-1 pl-1 pr-2 text-sm text-slate-700"
        >
          <Avatar fallback={r.iniciales} size="sm" />
          {r.nombre}
          <button
            type="button"
            aria-label={`Quitar ${r.nombre}`}
            onClick={() => onRemove(r.id)}
            className="text-slate-400 hover:text-red-500"
          >
            ✕
          </button>
        </span>
      ))}
      {/* Picker inerte esta fase — se activa en Fase C */}
      <Button variant="ghost" size="sm">＋ Añadir</Button>
    </div>
  );
}
```

- [ ] **Step 4: Ejecutar el test para comprobar que pasa**

Run: `npx vitest run src/features/herramientas/components/ResponsablesChips.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/features/herramientas/components/ResponsablesChips.tsx src/features/herramientas/components/ResponsablesChips.test.tsx
git commit -m "feat(herramientas): chips de responsables (quitar funcional, añadir inerte)"
```

---

### Task 9: `ProyeccionHeader`

**Files:**
- Create: `src/features/herramientas/components/ProyeccionHeader.tsx`
- Test: `src/features/herramientas/components/ProyeccionHeader.test.tsx`

**Interfaces:**
- Consumes: `Proyeccion`, `ProyeccionEstado` (de `../data/types`), `ResponsablesChips` (de `./ResponsablesChips`), `Button`/`SegmentedControl` (de `@/components/ui`), `Link` (de `react-router`).
- Produces: `ProyeccionHeader({ proyeccion, isDirty, onUpdate, onGuardar }): JSX.Element`.

- [ ] **Step 1: Escribir el test**

```tsx
// src/features/herramientas/components/ProyeccionHeader.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { ProyeccionHeader } from './ProyeccionHeader';
import { seedProyecciones } from '../data/seed';

function renderHeader(overrides = {}) {
  const onUpdate = vi.fn();
  const onGuardar = vi.fn();
  render(
    <MemoryRouter>
      <ProyeccionHeader proyeccion={{ ...seedProyecciones[0], ...overrides }} isDirty={false} onUpdate={onUpdate} onGuardar={onGuardar} />
    </MemoryRouter>
  );
  return { onUpdate, onGuardar };
}

describe('ProyeccionHeader', () => {
  it('renders name, Volver link, estado activo y responsables', () => {
    renderHeader();
    expect(screen.getByText('PQ @ SLS Barcelona')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '← Volver' })).toHaveAttribute('href', '/herramientas/proyecciones');
    expect(screen.getByRole('button', { name: 'Aprobada' })).toHaveClass(/bg-white|shadow/); // activo dentro del SegmentedControl
    expect(screen.getByText('Jack')).toBeInTheDocument();
  });

  it('shows "Guardado" or "Cambios sin guardar" depending on isDirty', () => {
    renderHeader();
    expect(screen.getByText('Guardado')).toBeInTheDocument();
  });

  it('clicking an Estado option calls onUpdate with the new estado', async () => {
    const { onUpdate } = renderHeader();
    await userEvent.click(screen.getByRole('button', { name: 'Rechazada' }));
    expect(onUpdate).toHaveBeenCalledWith({ estado: 'rechazada' });
  });

  it('renders the inert Fase C buttons (Comentarios, PDF, Excel, i, Convertir en evento)', () => {
    renderHeader();
    ['i', 'Comentarios', 'PDF Ventas', 'PDF Explotación', 'Excel', 'Convertir en evento →'].forEach((label) => {
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument();
    });
  });

  it('clicking Guardar calls onGuardar', async () => {
    const { onGuardar } = renderHeader();
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(onGuardar).toHaveBeenCalled();
  });
});
```

**Nota sobre el matcher de la clase activa:** el test de "estado activo" usa una regexp laxa porque `SegmentedControl` aplica `bg-white text-slate-800 shadow-sm` (tone claro) al valor activo — si al implementar cambia el detalle exacto de clases, ajustar el matcher, no el criterio (debe verificarse que el botón activo tiene una clase visualmente distinta del resto).

- [ ] **Step 2: Ejecutar el test para comprobar que falla**

Run: `npx vitest run src/features/herramientas/components/ProyeccionHeader.test.tsx`
Expected: FAIL — `Cannot find module './ProyeccionHeader'`

- [ ] **Step 3: Implementar**

```tsx
// src/features/herramientas/components/ProyeccionHeader.tsx
import { Link } from 'react-router';
import { Button, SegmentedControl } from '@/components/ui';
import { ResponsablesChips } from './ResponsablesChips';
import type { Proyeccion, ProyeccionEstado } from '../data/types';

const ESTADO_OPTIONS: { label: string; value: ProyeccionEstado }[] = [
  { label: 'Borrador', value: 'borrador' },
  { label: 'En junta', value: 'en_junta' },
  { label: 'Aprobada', value: 'aprobada' },
  { label: 'Rechazada', value: 'rechazada' },
];

interface Props {
  proyeccion: Proyeccion;
  isDirty: boolean;
  onUpdate: (patch: Partial<Proyeccion>) => void;
  onGuardar: () => void;
}

export function ProyeccionHeader({ proyeccion, isDirty, onUpdate, onGuardar }: Props) {
  return (
    <div className="space-y-4 rounded-xl border border-slate-100 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link to="/herramientas/proyecciones" className="text-sm text-slate-500 hover:text-slate-700">← Volver</Link>
          <span className="text-lg font-semibold text-slate-900">{proyeccion.nombre}</span>
          {/* Info "¿Cómo se calcula?" — Fase C */}
          <Button variant="ghost" size="sm" aria-label="i">i</Button>
          <span className="text-sm text-slate-400">{isDirty ? 'Cambios sin guardar' : 'Guardado'}</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Botones de Fase C: visibles, sin onClick (inertes) */}
          <Button variant="secondary" size="sm">Comentarios</Button>
          <Button variant="secondary" size="sm">PDF Ventas</Button>
          <Button variant="secondary" size="sm">PDF Explotación</Button>
          <Button variant="secondary" size="sm">Excel</Button>
          <Button variant="primary" size="sm" onClick={onGuardar}>Guardar</Button>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase text-slate-400">Estado</p>
            <SegmentedControl options={ESTADO_OPTIONS} value={proyeccion.estado} onChange={(estado) => onUpdate({ estado })} />
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase text-slate-400">Reunión</p>
            <input
              type="date"
              aria-label="Reunión"
              value={proyeccion.reunionFecha}
              onChange={(e) => onUpdate({ reunionFecha: e.target.value })}
              className="h-9 rounded-lg border border-slate-200 px-2 text-sm"
            />
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase text-slate-400">Responsables</p>
            <ResponsablesChips
              responsables={proyeccion.responsables}
              onRemove={(id) => onUpdate({ responsables: proyeccion.responsables.filter((r) => r.id !== id) })}
            />
          </div>
        </div>
        {/* Cross-módulo, siempre inerte en este calco */}
        <Button variant="primary" size="sm">Convertir en evento →</Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Ejecutar el test para comprobar que pasa**

Run: `npx vitest run src/features/herramientas/components/ProyeccionHeader.test.tsx`
Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add src/features/herramientas/components/ProyeccionHeader.tsx src/features/herramientas/components/ProyeccionHeader.test.tsx
git commit -m "feat(herramientas): cabecera del detalle (Estado/Reunión/Responsables funcionales)"
```

---

### Task 10: `ResultadoAcuerdoCard`

**Files:**
- Create: `src/features/herramientas/components/ResultadoAcuerdoCard.tsx`
- Test: `src/features/herramientas/components/ResultadoAcuerdoCard.test.tsx`

**Interfaces:**
- Consumes: `ResultadoAcuerdo` (de `../data/calculos-acuerdo`), `Card` (de `@/components/ui`), `formatCurrency` (de `@/lib/format`).
- Produces: `ResultadoAcuerdoCard({ resultado }): JSX.Element`.

- [ ] **Step 1: Escribir el test**

```tsx
// src/features/herramientas/components/ResultadoAcuerdoCard.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResultadoAcuerdoCard } from './ResultadoAcuerdoCard';
import { calcularResultadoAcuerdo } from '../data/calculos-acuerdo';
import { seedProyecciones } from '../data/seed';

describe('ResultadoAcuerdoCard', () => {
  it('renders the exact live figures for the seed', () => {
    const p = seedProyecciones[0];
    const resultado = calcularResultadoAcuerdo(p.acuerdo, p.acuerdoBrutos, p.eventoAforo, p.gastos);
    render(<ResultadoAcuerdoCard resultado={resultado} />);
    expect(screen.getByText('Resultado por acuerdo')).toBeInTheDocument();
    expect(screen.getByText(/6\.330,14/)).toBeInTheDocument();
    expect(screen.getByText(/-5\.470,00/)).toBeInTheDocument();
    expect(screen.getByText(/860,14/)).toBeInTheDocument();
    expect(screen.getByText('13.6%')).toBeInTheDocument();
    expect(screen.getByText(/Evento completo: 24\.998,18\s?€ \(82%\)\./)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Ejecutar el test para comprobar que falla**

Run: `npx vitest run src/features/herramientas/components/ResultadoAcuerdoCard.test.tsx`
Expected: FAIL — `Cannot find module './ResultadoAcuerdoCard'`

- [ ] **Step 3: Implementar**

```tsx
// src/features/herramientas/components/ResultadoAcuerdoCard.tsx
import { Card } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import type { ResultadoAcuerdo } from '../data/calculos-acuerdo';

export function ResultadoAcuerdoCard({ resultado }: { resultado: ResultadoAcuerdo }) {
  return (
    <Card className="p-4">
      <h3 className="mb-3 text-sm font-semibold text-slate-800">Resultado por acuerdo</h3>
      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <dt className="text-xs uppercase text-slate-400">Nuestros ingresos</dt>
          <dd className="text-lg font-semibold text-slate-900">{formatCurrency(resultado.nuestrosIngresos)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-slate-400">Gastos que asumimos</dt>
          <dd className="text-lg font-semibold text-red-600">{formatCurrency(resultado.gastosQueAsumimos)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-slate-400">Beneficio por acuerdo</dt>
          <dd className="text-lg font-semibold text-emerald-600">{formatCurrency(resultado.beneficioPorAcuerdo)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-slate-400">Margen s/ingresos</dt>
          <dd className="text-lg font-semibold text-slate-900">{resultado.margenSobreIngresos.toFixed(1)}%</dd>
        </div>
      </dl>
      <p className="mt-3 text-sm text-slate-500">
        Evento completo: {formatCurrency(resultado.eventoCompletoBeneficio)} ({Math.round(resultado.margenEventoCompleto)}%).
      </p>
    </Card>
  );
}
```

- [ ] **Step 4: Ejecutar el test para comprobar que pasa**

Run: `npx vitest run src/features/herramientas/components/ResultadoAcuerdoCard.test.tsx`
Expected: PASS (1 test)

- [ ] **Step 5: Commit**

```bash
git add src/features/herramientas/components/ResultadoAcuerdoCard.tsx src/features/herramientas/components/ResultadoAcuerdoCard.test.tsx
git commit -m "feat(herramientas): tarjeta Resultado por acuerdo"
```

---

### Task 11: `AcuerdoTramoCard`

**Files:**
- Create: `src/features/herramientas/components/AcuerdoTramoCard.tsx`
- Test: `src/features/herramientas/components/AcuerdoTramoCard.test.tsx`

**Interfaces:**
- Consumes: `TramoAcuerdoConfig` (de `../data/types`), `ingresoTramo` (de `../data/calculos-acuerdo`), `SegmentedControl` (de `@/components/ui`), `formatCurrency` (de `@/lib/format`).
- Produces: `AcuerdoTramoCard({ titulo, config, bruto, ivaPct, onChange }): JSX.Element`.

- [ ] **Step 1: Escribir el test**

```tsx
// src/features/herramientas/components/AcuerdoTramoCard.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AcuerdoTramoCard } from './AcuerdoTramoCard';

describe('AcuerdoTramoCard', () => {
  const config = { nosLlevamosPct: 10, sobreBase: 'neto' as const, deduccionFijaEur: 0, deduccionPct: 18 };

  it('renders the título and the computed "Nuestro ingreso" (Barras del seed: 1.118,18€)', () => {
    render(<AcuerdoTramoCard titulo="Barras" config={config} bruto={15000} ivaPct={10} onChange={vi.fn()} />);
    expect(screen.getByText('Barras')).toBeInTheDocument();
    expect(screen.getByText(/1\.118,18/)).toBeInTheDocument();
  });

  it('editing "Nos llevamos %" calls onChange with the patched config', async () => {
    const onChange = vi.fn();
    render(<AcuerdoTramoCard titulo="Barras" config={config} bruto={15000} ivaPct={10} onChange={onChange} />);
    const input = screen.getByLabelText('Nos llevamos %');
    await userEvent.clear(input);
    await userEvent.type(input, '20');
    expect(onChange).toHaveBeenLastCalledWith({ ...config, nosLlevamosPct: 20 });
  });

  it('toggling Bruto/Neto calls onChange', async () => {
    const onChange = vi.fn();
    render(<AcuerdoTramoCard titulo="Barras" config={config} bruto={15000} ivaPct={10} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Bruto' }));
    expect(onChange).toHaveBeenCalledWith({ ...config, sobreBase: 'bruto' });
  });
});
```

- [ ] **Step 2: Ejecutar el test para comprobar que falla**

Run: `npx vitest run src/features/herramientas/components/AcuerdoTramoCard.test.tsx`
Expected: FAIL — `Cannot find module './AcuerdoTramoCard'`

- [ ] **Step 3: Implementar**

```tsx
// src/features/herramientas/components/AcuerdoTramoCard.tsx
import { SegmentedControl } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import { ingresoTramo } from '../data/calculos-acuerdo';
import type { BaseCalculoAcuerdo, TramoAcuerdoConfig } from '../data/types';

interface Props {
  titulo: string;
  config: TramoAcuerdoConfig;
  bruto: number;
  ivaPct: number;
  onChange: (config: TramoAcuerdoConfig) => void;
}

const SOBRE_OPTIONS: { label: string; value: BaseCalculoAcuerdo }[] = [
  { label: 'Bruto', value: 'bruto' },
  { label: 'Neto', value: 'neto' },
];

export function AcuerdoTramoCard({ titulo, config, bruto, ivaPct, onChange }: Props) {
  const ingreso = ingresoTramo(config, bruto, ivaPct);
  const inputClass = 'h-9 w-full rounded-lg border border-slate-200 px-2 text-sm';

  return (
    <div className="grid grid-cols-2 gap-3 border-b border-slate-100 py-4 last:border-0 sm:grid-cols-5">
      <p className="col-span-2 self-center font-medium text-slate-800 sm:col-span-1">{titulo}</p>
      <label className="text-xs">
        <span className="mb-1 block uppercase text-slate-400">Nos llevamos %</span>
        <input
          type="number"
          value={config.nosLlevamosPct}
          onChange={(e) => onChange({ ...config, nosLlevamosPct: Number(e.target.value) })}
          className={inputClass}
        />
      </label>
      <div className="text-xs">
        <span className="mb-1 block uppercase text-slate-400">Sobre</span>
        <SegmentedControl options={SOBRE_OPTIONS} value={config.sobreBase} onChange={(sobreBase) => onChange({ ...config, sobreBase })} />
      </div>
      <label className="text-xs">
        <span className="mb-1 block uppercase text-slate-400">Deduc. fija €</span>
        <input
          type="number"
          value={config.deduccionFijaEur}
          onChange={(e) => onChange({ ...config, deduccionFijaEur: Number(e.target.value) })}
          className={inputClass}
        />
      </label>
      <label className="text-xs">
        <span className="mb-1 block uppercase text-slate-400">Deduc. %</span>
        <input
          type="number"
          value={config.deduccionPct}
          onChange={(e) => onChange({ ...config, deduccionPct: Number(e.target.value) })}
          className={inputClass}
        />
      </label>
      <div className="col-span-2 text-right text-xs sm:col-span-5">
        <span className="uppercase text-slate-400">Nuestro ingreso </span>
        <span className="font-semibold text-slate-900">{formatCurrency(ingreso)}</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Ejecutar el test para comprobar que pasa**

Run: `npx vitest run src/features/herramientas/components/AcuerdoTramoCard.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/features/herramientas/components/AcuerdoTramoCard.tsx src/features/herramientas/components/AcuerdoTramoCard.test.tsx
git commit -m "feat(herramientas): tarjeta de tramo del Acuerdo (editable + ingreso en vivo)"
```

---

### Task 12: `QuienPagaGastos`

**Files:**
- Create: `src/features/herramientas/components/QuienPagaGastos.tsx`
- Test: `src/features/herramientas/components/QuienPagaGastos.test.tsx`

**Interfaces:**
- Consumes: `Gasto`, `CategoriaGasto`, `QuienPaga` (de `../data/types`), `SegmentedControl` (de `@/components/ui`), `formatCurrency` (de `@/lib/format`).
- Produces: `QuienPagaGastos({ gastos, onTogglePagaLinea, onTogglePagaCategoria }): JSX.Element`.

- [ ] **Step 1: Escribir el test**

```tsx
// src/features/herramientas/components/QuienPagaGastos.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuienPagaGastos } from './QuienPagaGastos';
import { seedProyecciones } from '../data/seed';

describe('QuienPagaGastos', () => {
  const gastos = seedProyecciones[0].gastos;

  it('agrupa por categoría con subtotal y muestra cada línea', () => {
    render(<QuienPagaGastos gastos={gastos} onTogglePagaLinea={vi.fn()} onTogglePagaCategoria={vi.fn()} />);
    expect(screen.getByText('Artística')).toBeInTheDocument();
    expect(screen.getByText(/-2\.400,00/)).toBeInTheDocument(); // subtotal Artística
    expect(screen.getByText('US TWO - AF')).toBeInTheDocument();
    expect(screen.getByText('US TWO - BF')).toBeInTheDocument();
  });

  it('muestra el pie con Pagamos nosotros / Paga el venue', () => {
    render(<QuienPagaGastos gastos={gastos} onTogglePagaLinea={vi.fn()} onTogglePagaCategoria={vi.fn()} />);
    expect(screen.getByText(/Pagamos nosotros/)).toBeInTheDocument();
    expect(screen.getByText(/-5\.470,00/)).toBeInTheDocument();
    expect(screen.getByText(/Paga el venue/)).toBeInTheDocument();
  });

  it('clicking a line toggle calls onTogglePagaLinea with the gasto id', async () => {
    const onTogglePagaLinea = vi.fn();
    render(<QuienPagaGastos gastos={gastos} onTogglePagaLinea={onTogglePagaLinea} onTogglePagaCategoria={vi.fn()} />);
    const venueButtons = screen.getAllByRole('button', { name: 'Venue' });
    await userEvent.click(venueButtons[1]); // primera línea (US TWO - AF) tras el toggle de categoría
    expect(onTogglePagaLinea).toHaveBeenCalledWith('gasto-1', 'venue');
  });

  it('clicking the category toggle calls onTogglePagaCategoria with the categoria', async () => {
    const onTogglePagaCategoria = vi.fn();
    render(<QuienPagaGastos gastos={gastos} onTogglePagaLinea={vi.fn()} onTogglePagaCategoria={onTogglePagaCategoria} />);
    const venueButtons = screen.getAllByRole('button', { name: 'Venue' });
    await userEvent.click(venueButtons[0]); // primer toggle = el de categoría (Artística)
    expect(onTogglePagaCategoria).toHaveBeenCalledWith('Artística', 'venue');
  });
});
```

- [ ] **Step 2: Ejecutar el test para comprobar que falla**

Run: `npx vitest run src/features/herramientas/components/QuienPagaGastos.test.tsx`
Expected: FAIL — `Cannot find module './QuienPagaGastos'`

- [ ] **Step 3: Implementar**

```tsx
// src/features/herramientas/components/QuienPagaGastos.tsx
import { SegmentedControl } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import type { CategoriaGasto, Gasto, QuienPaga } from '../data/types';

interface Props {
  gastos: Gasto[];
  onTogglePagaLinea: (id: string, paga: QuienPaga) => void;
  onTogglePagaCategoria: (categoria: CategoriaGasto, paga: QuienPaga) => void;
}

const PAGA_OPTIONS: { label: string; value: QuienPaga }[] = [
  { label: 'Nosotros', value: 'nosotros' },
  { label: 'Venue', value: 'venue' },
];

export function QuienPagaGastos({ gastos, onTogglePagaLinea, onTogglePagaCategoria }: Props) {
  const categorias = Array.from(new Set(gastos.map((g) => g.categoria)));
  const pagamosNosotros = gastos.filter((g) => g.paga === 'nosotros').reduce((a, g) => a + g.valor, 0);
  const pagaElVenue = gastos.filter((g) => g.paga === 'venue').reduce((a, g) => a + g.valor, 0);

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-800">¿Quién paga cada gasto?</h3>
      <p className="mb-3 text-xs text-slate-500">Asigna quién paga por categoría (toda de golpe) o línea a línea.</p>
      {categorias.map((categoria) => {
        const lineas = gastos.filter((g) => g.categoria === categoria);
        const subtotal = lineas.reduce((a, g) => a + g.valor, 0);
        const pagaComun = lineas.every((l) => l.paga === lineas[0].paga) ? lineas[0].paga : 'nosotros';
        return (
          <div key={categoria} className="border-b border-slate-100 py-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-500">{categoria}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">-{formatCurrency(subtotal)}</span>
                <SegmentedControl options={PAGA_OPTIONS} value={pagaComun} onChange={(paga) => onTogglePagaCategoria(categoria, paga)} />
              </div>
            </div>
            {lineas.map((g) => (
              <div key={g.id} className="mt-1 flex items-center justify-between pl-4">
                <span className="text-sm text-slate-600">{g.concepto}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">-{formatCurrency(g.valor)}</span>
                  <SegmentedControl options={PAGA_OPTIONS} value={g.paga} onChange={(paga) => onTogglePagaLinea(g.id, paga)} />
                </div>
              </div>
            ))}
          </div>
        );
      })}
      <div className="mt-3 flex justify-end gap-6 text-sm">
        <span>Pagamos nosotros <strong>-{formatCurrency(pagamosNosotros)}</strong></span>
        <span>Paga el venue <strong>-{formatCurrency(pagaElVenue)}</strong></span>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Ejecutar el test para comprobar que pasa**

Run: `npx vitest run src/features/herramientas/components/QuienPagaGastos.test.tsx`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/features/herramientas/components/QuienPagaGastos.tsx src/features/herramientas/components/QuienPagaGastos.test.tsx
git commit -m "feat(herramientas): sección Quién paga cada gasto (categoría + línea)"
```

---

### Task 13: `AcuerdoTab`

**Files:**
- Create: `src/features/herramientas/components/AcuerdoTab.tsx`
- Test: `src/features/herramientas/components/AcuerdoTab.test.tsx`

**Interfaces:**
- Consumes: `Proyeccion`, `AcuerdoConfig` (de `../data/types`), `calcularResultadoAcuerdo` (de `../data/calculos-acuerdo`), `AcuerdoTramoCard`, `QuienPagaGastos`, `ResultadoAcuerdoCard` (de este mismo directorio).
- Produces: `AcuerdoTab({ proyeccion, onUpdate }): JSX.Element`.

- [ ] **Step 1: Escribir el test**

```tsx
// src/features/herramientas/components/AcuerdoTab.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AcuerdoTab } from './AcuerdoTab';
import { seedProyecciones } from '../data/seed';

describe('AcuerdoTab', () => {
  it('renders the 5 tramos, the help paragraph, gastos and the Resultado card', () => {
    render(<AcuerdoTab proyeccion={seedProyecciones[0]} onUpdate={vi.fn()} />);
    ['Ticketing', 'Mesas VIP', 'Barras', 'Comida', 'Merchandising'].forEach((titulo) => {
      expect(screen.getByText(titulo)).toBeInTheDocument();
    });
    expect(screen.getByText(/Ej\. PQ @ SLS: ticketing 100%/)).toBeInTheDocument();
    expect(screen.getByText('¿Quién paga cada gasto?')).toBeInTheDocument();
    expect(screen.getByText('Resultado por acuerdo')).toBeInTheDocument();
    expect(screen.getByLabelText(/Aplicar acuerdo/)).toBeChecked();
  });

  it('editing a tramo calls onUpdate with the patched acuerdo', async () => {
    const onUpdate = vi.fn();
    render(<AcuerdoTab proyeccion={seedProyecciones[0]} onUpdate={onUpdate} />);
    const inputs = screen.getAllByLabelText('Nos llevamos %');
    await userEvent.clear(inputs[0]); // Ticketing es el primer tramo renderizado
    await userEvent.type(inputs[0], '50');
    const lastCall = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
    expect(lastCall.acuerdo.ticketing.nosLlevamosPct).toBe(50);
    expect(lastCall.acuerdo.mesasVip).toEqual(seedProyecciones[0].acuerdo.mesasVip); // el resto de tramos no cambia
  });

  it('toggling "Aplicar acuerdo" calls onUpdate', async () => {
    const onUpdate = vi.fn();
    render(<AcuerdoTab proyeccion={seedProyecciones[0]} onUpdate={onUpdate} />);
    await userEvent.click(screen.getByLabelText(/Aplicar acuerdo/));
    expect(onUpdate).toHaveBeenCalledWith({ acuerdo: { ...seedProyecciones[0].acuerdo, aplicarAcuerdo: false } });
  });
});
```

- [ ] **Step 2: Ejecutar el test para comprobar que falla**

Run: `npx vitest run src/features/herramientas/components/AcuerdoTab.test.tsx`
Expected: FAIL — `Cannot find module './AcuerdoTab'`

- [ ] **Step 3: Implementar**

```tsx
// src/features/herramientas/components/AcuerdoTab.tsx
import { calcularResultadoAcuerdo } from '../data/calculos-acuerdo';
import { AcuerdoTramoCard } from './AcuerdoTramoCard';
import { QuienPagaGastos } from './QuienPagaGastos';
import { ResultadoAcuerdoCard } from './ResultadoAcuerdoCard';
import type { AcuerdoConfig, Proyeccion, TramoAcuerdoConfig } from '../data/types';

interface Props {
  proyeccion: Proyeccion;
  onUpdate: (patch: Partial<Proyeccion>) => void;
}

type TramoKey = 'ticketing' | 'mesasVip' | 'barras' | 'comida' | 'merchandising';

export function AcuerdoTab({ proyeccion, onUpdate }: Props) {
  const { acuerdo, acuerdoBrutos, eventoAforo, gastos } = proyeccion;
  const resultado = calcularResultadoAcuerdo(acuerdo, acuerdoBrutos, eventoAforo, gastos);

  const setTramo = (tramo: TramoKey, config: TramoAcuerdoConfig) => {
    const nextAcuerdo: AcuerdoConfig = { ...acuerdo, [tramo]: config };
    onUpdate({ acuerdo: nextAcuerdo });
  };

  const ivaResto = eventoAforo.ivaBarrasComidaVipPct;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-100 bg-white p-4">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={acuerdo.aplicarAcuerdo}
            onChange={(e) => onUpdate({ acuerdo: { ...acuerdo, aplicarAcuerdo: e.target.checked } })}
          />
          Aplicar acuerdo (si no, el resultado es el 100% del evento)
        </label>
        <h3 className="mb-1 mt-4 text-sm font-semibold text-slate-800">Acuerdo con el venue / promotor</h3>
        <AcuerdoTramoCard titulo="Ticketing" config={acuerdo.ticketing} bruto={acuerdoBrutos.ticketing} ivaPct={eventoAforo.ivaTicketingPct} onChange={(c) => setTramo('ticketing', c)} />
        <AcuerdoTramoCard titulo="Mesas VIP" config={acuerdo.mesasVip} bruto={acuerdoBrutos.mesasVip} ivaPct={ivaResto} onChange={(c) => setTramo('mesasVip', c)} />
        <AcuerdoTramoCard titulo="Barras" config={acuerdo.barras} bruto={acuerdoBrutos.barras} ivaPct={ivaResto} onChange={(c) => setTramo('barras', c)} />
        <AcuerdoTramoCard titulo="Comida" config={acuerdo.comida} bruto={acuerdoBrutos.comida} ivaPct={ivaResto} onChange={(c) => setTramo('comida', c)} />
        <AcuerdoTramoCard titulo="Merchandising" config={acuerdo.merchandising} bruto={acuerdoBrutos.merchandising} ivaPct={ivaResto} onChange={(c) => setTramo('merchandising', c)} />
        <p className="mt-3 text-xs text-slate-500">
          Ej. PQ @ SLS: ticketing 100%; barras y VIP 10% sobre bruto tras descontar el % de coste del venue.
        </p>
      </div>

      <div className="rounded-xl border border-slate-100 bg-white p-4">
        <QuienPagaGastos
          gastos={gastos}
          onTogglePagaLinea={(id, paga) => onUpdate({ gastos: gastos.map((g) => (g.id === id ? { ...g, paga } : g)) })}
          onTogglePagaCategoria={(categoria, paga) => onUpdate({ gastos: gastos.map((g) => (g.categoria === categoria ? { ...g, paga } : g)) })}
        />
      </div>

      <ResultadoAcuerdoCard resultado={resultado} />
    </div>
  );
}
```

- [ ] **Step 4: Ejecutar el test para comprobar que pasa**

Run: `npx vitest run src/features/herramientas/components/AcuerdoTab.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/features/herramientas/components/AcuerdoTab.tsx src/features/herramientas/components/AcuerdoTab.test.tsx
git commit -m "feat(herramientas): tab Acuerdo completa (tramos + quién paga + resultado)"
```

---

### Task 14: `TabPlaceholder` + `ProyeccionDetailPage`

**Files:**
- Create: `src/features/herramientas/components/TabPlaceholder.tsx`
- Test: `src/features/herramientas/components/TabPlaceholder.test.tsx`
- Modify: `src/features/herramientas/pages/ProyeccionDetailPage.tsx` (sustituye el stub de la Tarea 5)
- Create: `src/features/herramientas/pages/ProyeccionDetailPage.test.tsx`

**Interfaces:**
- Consumes: `Card` (de `@/components/ui`), `UnderlineTabs` (de `@/components/ui`), `useProyecciones` (de `../data/proyecciones-context`), `ProyeccionHeader`, `AcuerdoTab`, `TabPlaceholder`, `useParams`/`Link` (de `react-router`).
- Produces: `TabPlaceholder({ fase }): JSX.Element`, `ProyeccionDetailPage(): JSX.Element`.

- [ ] **Step 1: Escribir el test de `TabPlaceholder`**

```tsx
// src/features/herramientas/components/TabPlaceholder.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TabPlaceholder } from './TabPlaceholder';

describe('TabPlaceholder', () => {
  it('shows which phase will build this view', () => {
    render(<TabPlaceholder fase="B" />);
    expect(screen.getByText('Esta vista se construye en la Fase B.')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Ejecutar el test para comprobar que falla**

Run: `npx vitest run src/features/herramientas/components/TabPlaceholder.test.tsx`
Expected: FAIL — `Cannot find module './TabPlaceholder'`

- [ ] **Step 3: Implementar `TabPlaceholder.tsx`**

```tsx
// src/features/herramientas/components/TabPlaceholder.tsx
import { Card } from '@/components/ui';

export function TabPlaceholder({ fase }: { fase: 'B' | 'C' }) {
  return (
    <Card className="p-12 text-center">
      <p className="text-slate-500">Esta vista se construye en la Fase {fase}.</p>
    </Card>
  );
}
```

- [ ] **Step 4: Ejecutar el test para comprobar que pasa**

Run: `npx vitest run src/features/herramientas/components/TabPlaceholder.test.tsx`
Expected: PASS (1 test)

- [ ] **Step 5: Escribir el test de `ProyeccionDetailPage`**

```tsx
// src/features/herramientas/pages/ProyeccionDetailPage.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router';
import { ProyeccionesProvider } from '../data/proyecciones-context';
import { ProyeccionDetailPage } from './ProyeccionDetailPage';
import { seedProyecciones } from '../data/seed';

function renderDetail(id = seedProyecciones[0].id) {
  return render(
    <MemoryRouter initialEntries={[`/herramientas/proyecciones/${id}`]}>
      <ProyeccionesProvider>
        <Routes>
          <Route path="/herramientas/proyecciones/:id" element={<ProyeccionDetailPage />} />
        </Routes>
      </ProyeccionesProvider>
    </MemoryRouter>
  );
}

describe('ProyeccionDetailPage', () => {
  it('renders the header and the Acuerdo tab by default', () => {
    renderDetail();
    expect(screen.getByText('PQ @ SLS Barcelona')).toBeInTheDocument();
    expect(screen.getByText('Resultado por acuerdo')).toBeInTheDocument();
  });

  it('switching to Previsión/Real shows their placeholders', async () => {
    renderDetail();
    await userEvent.click(screen.getByRole('button', { name: 'Previsión' }));
    expect(screen.getByText('Esta vista se construye en la Fase B.')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Real' }));
    expect(screen.getByText('Esta vista se construye en la Fase C.')).toBeInTheDocument();
  });

  it('editing the header marks it dirty, and Guardar clears it', async () => {
    renderDetail();
    expect(screen.getByText('Guardado')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Rechazada' }));
    expect(screen.getByText('Cambios sin guardar')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(screen.getByText('Guardado')).toBeInTheDocument();
  });

  it('shows "Proyección no encontrada" for an unknown id', () => {
    renderDetail('id-inexistente');
    expect(screen.getByText('Proyección no encontrada.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Volver a la lista' })).toHaveAttribute('href', '/herramientas/proyecciones');
  });
});
```

- [ ] **Step 6: Ejecutar el test para comprobar que falla**

Run: `npx vitest run src/features/herramientas/pages/ProyeccionDetailPage.test.tsx`
Expected: FAIL — el stub devuelve `null`

- [ ] **Step 7: Implementar `ProyeccionDetailPage.tsx`**

```tsx
// src/features/herramientas/pages/ProyeccionDetailPage.tsx
import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { UnderlineTabs } from '@/components/ui';
import { useProyecciones } from '../data/proyecciones-context';
import { ProyeccionHeader } from '../components/ProyeccionHeader';
import { AcuerdoTab } from '../components/AcuerdoTab';
import { TabPlaceholder } from '../components/TabPlaceholder';
import type { Proyeccion } from '../data/types';

type Tab = 'acuerdo' | 'prevision' | 'real';

const TAB_OPTIONS: { label: string; value: Tab }[] = [
  { label: 'Acuerdo', value: 'acuerdo' },
  { label: 'Previsión', value: 'prevision' },
  { label: 'Real', value: 'real' },
];

export function ProyeccionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { proyecciones, actualizar } = useProyecciones();
  const [tab, setTab] = useState<Tab>('acuerdo');
  const [isDirty, setIsDirty] = useState(false);

  const proyeccion = proyecciones.find((p) => p.id === id);

  if (!proyeccion) {
    return (
      <div className="space-y-4 py-12 text-center">
        <p className="text-slate-500">Proyección no encontrada.</p>
        <Link to="/herramientas/proyecciones" className="text-brand-600 underline">Volver a la lista</Link>
      </div>
    );
  }

  const handleUpdate = (patch: Partial<Proyeccion>) => {
    actualizar(proyeccion.id, patch);
    setIsDirty(true);
  };

  return (
    <div className="space-y-6">
      <ProyeccionHeader proyeccion={proyeccion} isDirty={isDirty} onUpdate={handleUpdate} onGuardar={() => setIsDirty(false)} />
      <UnderlineTabs options={TAB_OPTIONS} value={tab} onChange={setTab} />
      {tab === 'acuerdo' && <AcuerdoTab proyeccion={proyeccion} onUpdate={handleUpdate} />}
      {tab === 'prevision' && <TabPlaceholder fase="B" />}
      {tab === 'real' && <TabPlaceholder fase="C" />}
    </div>
  );
}
```

- [ ] **Step 8: Ejecutar el test para comprobar que pasa**

Run: `npx vitest run src/features/herramientas/pages/ProyeccionDetailPage.test.tsx`
Expected: PASS (4 tests)

- [ ] **Step 9: Commit**

```bash
git add src/features/herramientas/components/TabPlaceholder.tsx src/features/herramientas/components/TabPlaceholder.test.tsx src/features/herramientas/pages/ProyeccionDetailPage.tsx src/features/herramientas/pages/ProyeccionDetailPage.test.tsx
git commit -m "feat(herramientas): página de detalle (cabecera + tabs + placeholders)"
```

---

### Task 15: Integración final, verificación visual y cierre de Fase A

**Files:** ninguno nuevo — solo verificación y housekeeping.

- [ ] **Step 1: Suite completa + lint + typecheck**

```bash
npx vitest run
npx tsc --noEmit
npm run lint
```

Expected: todo en verde, `lint` con 0 warnings (`--max-warnings 0` ya configurado).

- [ ] **Step 2: Levantar el dev server y comparar visualmente contra las referencias**

```bash
npm run dev
```

Abrir `http://localhost:5173/herramientas`, `/herramientas/proyecciones` y `/herramientas/proyecciones/pq-sls-barcelona`. Comparar a ojo contra `docs/references/herramientas/live-herramientas.png`, `live-proyecciones-lista.png`, `live-proyeccion-acuerdo-snapshot.txt` y `live-info-como-se-calcula.png` (para el copy del checkbox/ayuda). Confirmar que:
- La landing y la lista coinciden en textos/estructura.
- La cabecera del detalle muestra todos los botones (aunque los de Fase C sean inertes).
- El tab Acuerdo muestra los 5 tramos y las cifras 6.330,14 € / -5.470,00 € / 860,14 € / 13.6% / "Evento completo: 24.998,18 € (82%)."
- Previsión/Real muestran el placeholder de su fase.

Si algo diverge del live, corregir aquí (no dejarlo para Fase B/C salvo que sea, explícitamente, alcance de esa fase).

- [ ] **Step 3: Actualizar el comentario del worktree**

```bash
orca worktree set --worktree active --comment "Fase A de Herramientas completa: shell+landing+lista+Acuerdo, verde total. Empezando Fase B (Previsión) o abriendo PR — ver docs/superpowers/plans/2026-07-23-herramientas-fase-a.md"
```

- [ ] **Step 4: Commit final de housekeeping si el Step 2 generó cambios**

Si el Step 2 no requirió cambios, no hay commit en este paso (los 14 commits anteriores ya cierran la fase). Si sí, seguir el mismo patrón `git add <archivos tocados> && git commit -m "fix(herramientas): ajustes de fidelidad tras verificación visual de Fase A"`.

---

## Self-Review (completado por quien escribió el plan)

**1. Cobertura del spec:** todas las secciones de `2026-07-23-herramientas-fase-a-design.md` tienen tarea — arquitectura/rutas (Tarea 5), modelo de datos (Tareas 1-4), páginas/componentes (Tareas 6-14), testing (todas las tareas son TDD), edge cases (lista vacía: Tarea 7; proyección no encontrada: Tarea 14). Fuera de alcance explícito (Previsión/Real/exports/comentarios/picker/Supabase) no tiene tareas — correcto, es la Fase B/C.

**2. Placeholders:** ninguno — cada step tiene código completo y comandos con salida esperada. La única mención de "placeholder" es el componente `TabPlaceholder` en sí, que es un requisito funcional del spec (no un placeholder de este plan).

**3. Consistencia de tipos:** verificado que `AcuerdoConfig`/`TramoAcuerdoConfig`/`AcuerdoBrutos`/`ResultadoReal` (Tarea 1) se usan con los mismos nombres de campo en `calculos-acuerdo.ts` (Tarea 2), `proyecciones-crud.ts` (Tarea 3), `ProyeccionRow`/`AcuerdoTramoCard`/`QuienPagaGastos`/`AcuerdoTab` (Tareas 7, 11-13) y en los tests. `ResultadoAcuerdo` (Tarea 2) se consume igual en `ResultadoAcuerdoCard` (Tarea 10) y `AcuerdoTab` (Tarea 13). `useProyecciones()` (Tarea 4) expone `{ proyecciones, crear, duplicar, borrar, actualizar }` y así se usa en `ProyeccionesListPage` (Tarea 7) y `ProyeccionDetailPage` (Tarea 14) — nombres consistentes en todo el plan.
