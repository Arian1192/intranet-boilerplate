import { formatCurrency } from '@/lib/format';

/** Fecha del barrido del live: las etiquetas D±n y los vencimientos se leen contra ella. */
export const HOY = '2026-07-29';

export interface Cobro {
  id: string;
  show: string;
  /** ISO de la fecha del show. */
  fechaShow: string;
  artista: string;
  total: number;
  pagado: number;
  /** ISO del vencimiento del plan de pagos; null si el show aún no tiene plan. */
  vencimiento: string | null;
  cliente: string | null;
  /** Referencia de la factura emitida en Holded; null mientras no se ha facturado. */
  factura: string | null;
}

/** Espejo del live (29 jul 2026): 7 shows por cobrar, ninguno cobrado todavía. */
export const cobros: Cobro[] = [
  {
    id: 'the-next',
    show: 'The Next',
    fechaShow: '2026-07-26',
    artista: 'Pau Guilera',
    total: 1016.4,
    pagado: 0,
    vencimiento: '2026-07-06',
    cliente: 'Recaba Inversiones Turisticas, S.L.',
    factura: 'Proforma PRO260314',
  },
  {
    id: 'solart-fest',
    show: 'Solart Fest',
    fechaShow: '2026-08-01',
    artista: 'Los Canarios',
    total: 2904,
    pagado: 0,
    vencimiento: '2026-07-12',
    cliente: null,
    factura: null,
  },
  {
    id: 'load',
    show: 'LOAD',
    fechaShow: '2026-08-01',
    artista: 'Pau Guilera',
    total: 484,
    pagado: 0,
    vencimiento: '2026-07-12',
    cliente: 'LIMBER 1968 SL',
    factura: null,
  },
  {
    id: 'more-amor',
    show: 'More Amor',
    fechaShow: '2026-07-18',
    artista: 'Bizza',
    total: 1161.6,
    pagado: 0,
    vencimiento: '2026-07-18',
    cliente: 'STRATENEX, S.L.',
    factura: null,
  },
  {
    id: 'homies',
    show: 'Homies',
    fechaShow: '2026-08-07',
    artista: 'Pau Guilera',
    total: 1161.6,
    pagado: 0,
    vencimiento: '2026-07-18',
    cliente: 'MAXIMILIANO REGALDO',
    factura: null,
  },
  {
    id: 'sanity',
    show: 'SANITY',
    fechaShow: '2026-10-03',
    artista: 'Pau Guilera',
    total: 1452,
    pagado: 0,
    vencimiento: '2026-09-13',
    cliente: null,
    factura: null,
  },
  {
    id: 'summer-opening-festival',
    show: 'Summer Opening Festival',
    fechaShow: '2026-07-25',
    artista: 'Florentia',
    total: 1452,
    pagado: 0,
    vencimiento: null,
    cliente: null,
    factura: null,
  },
];

const MESES = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sept',
  'oct',
  'nov',
  'dic',
];

/** '2026-09-13' → '13 sept 2026' (como el live). */
export function formatFechaCorta(iso: string): string {
  const [year, month, day] = iso.split('-');
  return `${day} ${MESES[Number(month) - 1]} ${year}`;
}

/**
 * Importes en euros como los escribe el live: agrupación es-ES (que no separa
 * los millares de 4 dígitos: '9631,60 €' pero '11.433,78 €') y espacio normal
 * antes del símbolo, no el duro que mete Intl.
 */
/**
 * Importes como los escribe el live: agrupación `es-ES` —que **no** separa los
 * millares de cuatro dígitos— y **espacio duro** (`U+00A0`) antes del símbolo.
 *
 * Este `replace` metía un espacio normal y era un error: medido el 2026-09-09
 * sobre las capturas de las dos pantallas que usan este formateador, el live
 * pone espacio duro en **949 de 949** importes (587 en `/cobros`, 362 en
 * `/gastos`), sin una sola excepción.
 *
 * La agrupación tampoco es un detalle: el live escribe `6421,40 €` sin punto y
 * `10.000,00 €` con él. No es un umbral raro suyo, es el `minimumGroupingDigits`
 * de `es-ES`, así que `Intl` lo hace solo — verificado en 10 pares
 * valor↔pantalla, todos exactos.
 *
 * `formatImporteLiquidacion` en `liquidaciones.ts` ya llegó a esta misma
 * conclusión por su cuenta y dejó dicho que no reutilizaba éste «que mete un
 * espacio normal». Ahora los dos coinciden; unificarlos es tarea aparte, porque
 * ese fichero es de otro lote.
 */
export function formatImporte(amount: number): string {
  return formatCurrency(amount);
}

const MS_DIA = 24 * 60 * 60 * 1000;

function diffDias(desde: string, hasta: string): number {
  return Math.round((Date.parse(hasta) - Date.parse(desde)) / MS_DIA);
}

/** 'D-3' si el show está por venir, 'D+3' si ya pasó. */
export function diaRelativo(fechaShow: string, hoy: string = HOY): string {
  const dias = diffDias(hoy, fechaShow);
  return dias >= 0 ? `D-${dias}` : `D+${Math.abs(dias)}`;
}

export function pendiente(cobro: Cobro): number {
  return cobro.total - cobro.pagado;
}

export function estaVencido(cobro: Cobro, hoy: string = HOY): boolean {
  if (!cobro.vencimiento) return false;
  return diffDias(hoy, cobro.vencimiento) < 0 && pendiente(cobro) > 0;
}

export function venceEstaSemana(cobro: Cobro, hoy: string = HOY): boolean {
  if (!cobro.vencimiento) return false;
  const dias = diffDias(hoy, cobro.vencimiento);
  return dias >= 0 && dias <= 7 && pendiente(cobro) > 0;
}

export interface CobrosKpis {
  showsPorCobrar: number;
  pendienteTotal: number;
  fueraDePlazoImporte: number;
  fueraDePlazoShows: number;
  venceSemanaImporte: number;
  venceSemanaShows: number;
}

export function cobrosKpis(list: Cobro[], hoy: string = HOY): CobrosKpis {
  const porCobrar = list.filter((cobro) => pendiente(cobro) > 0);
  const vencidos = porCobrar.filter((cobro) => estaVencido(cobro, hoy));
  const semana = porCobrar.filter((cobro) => venceEstaSemana(cobro, hoy));
  const suma = (items: Cobro[]) => items.reduce((acc, cobro) => acc + pendiente(cobro), 0);

  return {
    showsPorCobrar: porCobrar.length,
    pendienteTotal: suma(porCobrar),
    fueraDePlazoImporte: suma(vencidos),
    fueraDePlazoShows: vencidos.length,
    venceSemanaImporte: suma(semana),
    venceSemanaShows: semana.length,
  };
}

export type CobrosVista = 'show' | 'factura';
export type CobrosFiltro = 'Todos' | 'Vencidos';

export function filterCobros(
  list: Cobro[],
  filtro: CobrosFiltro,
  hoy: string = HOY
): Cobro[] {
  return filtro === 'Vencidos' ? list.filter((cobro) => estaVencido(cobro, hoy)) : list;
}

export interface FacturaAgrupada {
  factura: string;
  cliente: string | null;
  shows: string[];
  total: number;
  pagado: number;
}

/** Agrupa por factura emitida; los shows sin facturar no entran. */
export function agruparPorFactura(list: Cobro[]): FacturaAgrupada[] {
  const porFactura = new Map<string, FacturaAgrupada>();

  for (const cobro of list) {
    if (!cobro.factura) continue;
    const actual = porFactura.get(cobro.factura);
    if (actual) {
      actual.shows.push(cobro.show);
      actual.total += cobro.total;
      actual.pagado += cobro.pagado;
    } else {
      porFactura.set(cobro.factura, {
        factura: cobro.factura,
        cliente: cobro.cliente,
        shows: [cobro.show],
        total: cobro.total,
        pagado: cobro.pagado,
      });
    }
  }

  return [...porFactura.values()];
}

/** '1 show' / '3 shows', como la coletilla de cada factura en el live. */
export function etiquetaShows(shows: string[]): string {
  return `${shows.length} ${shows.length === 1 ? 'show' : 'shows'}`;
}
