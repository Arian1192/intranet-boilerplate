/**
 * Datos de `/management/incidentes/analitica`.
 *
 * Calcados de `f1-management--incidentes--analitica` (live capturado el
 * 2026-09-09 a las 10:09 CEST). Las cifras son las de esa franja.
 *
 * **Cuentan las 7 incidencias, no las 6 de la pantalla anterior.** La séptima
 * (cerrada, categoría `Pago`, severidad media, resuelta en 3 días y la única
 * clasificada como preventable) nunca se llegó a ver como fila, así que esta
 * pantalla lleva sus propios totales calcados en vez de derivarlos de
 * `incidentes.ts` — que es justo lo que pide la regla de «una pantalla, un
 * fichero de datos propio».
 */

export interface KpiAnalitica {
  etiqueta: string;
  valor: string;
  pie?: string;
  tono?: 'rose';
}

export interface SerieAnalitica {
  etiqueta: string;
  valor: number;
}

export interface MediaAnalitica {
  etiqueta: string;
  /** `null` se pinta como «—». */
  valor: string | null;
  casos: number;
}

/**
 * Importes tal como los escribe esta pantalla: agrupación es-ES y **espacio
 * duro** (U+00A0) antes del €, que es lo que sale en el DOM (`0,00&nbsp;€`).
 *
 * Ojo: no es el `formatImporte` de `cobros.ts`, que cambia ese espacio duro por
 * uno normal porque allí el live lo escribe así.
 */
export function formatImporteAnalitica(importe: number): string {
  const cifra = importe.toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${cifra}\u00a0€`;
}

export const KPIS_ANALITICA: KpiAnalitica[] = [
  { etiqueta: 'Incidentes (rango)', valor: '7', pie: 'de 7 totales' },
  { etiqueta: 'Resolución media', valor: '3 d', pie: '1 resueltos' },
  { etiqueta: '% preventables', valor: '100%', pie: '1 de 1 con dato' },
  { etiqueta: 'Impacto neto', valor: formatImporteAnalitica(0), tono: 'rose' },
];

export interface CifraImpacto {
  etiqueta: string;
  valor: number;
  clase: string;
}

/** Las cuatro cifras de la cabecera del bloque rosa. */
export const IMPACTO_ECONOMICO: CifraImpacto[] = [
  { etiqueta: 'Coste incurrido', valor: 0, clase: 'text-slate-800' },
  { etiqueta: 'Ingreso perdido', valor: 0, clase: 'text-amber-700' },
  { etiqueta: 'Recuperado', valor: 0, clase: 'text-emerald-700' },
  { etiqueta: 'Neto', valor: 0, clase: 'text-rose-700 text-2xl font-bold' },
];

export const LEYENDA_IMPACTO =
  'Coste incurrido + ingreso perdido − recuperado. El neto es lo que estos incidentes le han costado a la casa.';

/** Las dos tablas de impacto están hoy vacías en el live. Se calca el vacío. */
export const VACIO_IMPACTO = 'Sin impacto registrado.';

export const CABECERAS_IMPACTO = ['', 'Coste', 'Perdido', 'Recup.', 'Neto'];

export const incidentesPorCategoria: SerieAnalitica[] = [
  { etiqueta: 'Sin categoría', valor: 3 },
  { etiqueta: 'Pago', valor: 2 },
  { etiqueta: 'Conducta del artista', valor: 1 },
  { etiqueta: 'Staff e interno', valor: 1 },
];

export const incidentesPorDepartamento: SerieAnalitica[] = [
  { etiqueta: 'ConceptOne (booking)', valor: 7 },
];

export const incidentesPorMes: SerieAnalitica[] = [
  { etiqueta: 'jul 26', valor: 1 },
  { etiqueta: 'ago 26', valor: 5 },
  { etiqueta: 'sep 26', valor: 1 },
];

/** El eje del live llega a 8 con marca cada 2, aunque el máximo sea 5. */
export const MAX_EJE_MES = 8;
export const TICKS_EJE_MES = [0, 2, 4, 6, 8];

export const resolucionPorSeveridad: MediaAnalitica[] = [
  { etiqueta: 'Baja', valor: null, casos: 0 },
  { etiqueta: 'Media', valor: '3 d', casos: 1 },
  { etiqueta: 'Alta', valor: null, casos: 0 },
  { etiqueta: 'Crítica', valor: null, casos: 0 },
];

export const resolucionPorDepartamento: MediaAnalitica[] = [
  { etiqueta: 'ConceptOne (booking)', valor: '3 d', casos: 1 },
];

export const preventables = {
  porcentaje: 100,
  clasificados: 1,
  porMes: [{ etiqueta: 'ago 26', valor: 100 }] as SerieAnalitica[],
};

export const TICKS_EJE_PREVENTABLES = [0, 25, 50, 75, 100];

export interface Counterparty {
  nombre: string;
  tipo: string;
  valor: number;
}

export const counterpartiesRecurrentes: Counterparty[] = [
  { nombre: 'Marina Beach Club', tipo: 'Venue', valor: 1 },
  { nombre: 'Joe Coe', tipo: 'Staff', valor: 1 },
];

export interface IncidenciaEnCola {
  codigo: string;
  titulo: string;
  /** Con espacio: el live escribe «46 d» aquí y «46d» en la tabla. */
  dias: string;
}

export interface GrupoCola {
  owner: string;
  total: number;
  incidencias: IncidenciaEnCola[];
}

export const abiertosMasDe14Dias: GrupoCola[] = [
  {
    owner: 'Sin owner',
    total: 4,
    incidencias: [
      {
        codigo: '#2',
        titulo: '(Test) Problema con la logística de Sebastian Ledher',
        dias: '46 d',
      },
      {
        codigo: '#5',
        titulo: 'La pareja de Jose Fajardo se ha peleado con la novia del promotor.',
        dias: '37 d',
      },
      { codigo: '#6', titulo: 'LondonGround confusión de management fee', dias: '37 d' },
      { codigo: '#7', titulo: 'Flyer sin aprobar se sube', dias: '29 d' },
    ],
  },
];

export const lagPorDepartamento: MediaAnalitica[] = [
  { etiqueta: 'ConceptOne (booking)', valor: '0 d', casos: 3 },
];

/** El rosa con el que el live pinta todas las barras de esta pantalla. */
export const ROSA_BARRA = '#e11d48';
