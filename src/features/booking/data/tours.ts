/**
 * Seed de `/tours`, calcado del live del 2026-09-09 (10:08-10:14 CEST).
 *
 * Evidencia: `docs/references/conceptone-v3-2026-09-09/f1-tours*.{png,txt,main.html}`.
 * Las tres giras del live están en `Planificando` y ninguna tiene gastos de tour.
 */

export type TourEstado = 'planificando' | 'confirmado' | 'cerrado' | 'cancelado';

/** Las cuatro casillas de cada parada ciclan ○ pendiente → • reservado → ✓ confirmado. */
export type LogisticaEstado = 'pendiente' | 'reservado' | 'confirmado';

export interface LogisticaParada {
  vuelo: LogisticaEstado;
  hotel: LogisticaEstado;
  ground: LogisticaEstado;
  visado: LogisticaEstado;
}

export interface TourShow {
  /** Id del show en `/shows`, tal cual lo enlaza el live. */
  id: string;
  /** ISO de la fecha del show. */
  fecha: string;
  ciudad: string;
  venue: string;
  /** Caché bruto pactado con el promotor, en la divisa del tour. */
  cache: number;
  lat: number;
  lng: number;
  logistica: LogisticaParada;
}

export interface Tour {
  /** UUID del live: `/tours/:tourId` usa este mismo id. */
  id: string;
  nombre: string;
  artista: string;
  territorio: string;
  /** ISO; null cuando la gira todavía no tiene fecha de inicio. */
  desde: string | null;
  hasta: string | null;
  estado: TourEstado;
  /** Divisa del P&L: `EUR` o `USD` en el live de hoy. */
  moneda: string;
  /** Gastos que no cuelgan de ningún show. Hoy ninguna gira tiene. */
  gastosArtista: number;
  gastosAgencia: number;
  shows: TourShow[];
}

/** El live cobra un 20 % de booking fee sobre el caché bruto. */
export const BOOKING_FEE_PCT = 0.2;

/** Tipo de cambio que el live imprime al pie del P&L en dólares. */
export const USD_EUR = 0.8583;

const SIN_LOGISTICA: LogisticaParada = {
  vuelo: 'pendiente',
  hotel: 'pendiente',
  ground: 'pendiente',
  visado: 'pendiente',
};

export const tours: Tour[] = [
  {
    id: '5c5f62d8-83a3-422c-86de-733e1d8241e5',
    nombre: 'Spain Sept 2026',
    artista: 'Milan Torne',
    territorio: 'Spain',
    desde: '2026-10-30',
    hasta: '2026-11-11',
    estado: 'planificando',
    moneda: 'EUR',
    gastosArtista: 0,
    gastosAgencia: 0,
    shows: [],
  },
  {
    id: 'c68ade2f-5f01-4686-869c-34e744cf445a',
    nombre: 'LATAM Sept 2026',
    artista: 'Claudia Tejeda',
    territorio: 'Latinoamérica',
    desde: '2026-09-17',
    hasta: null,
    estado: 'planificando',
    moneda: 'USD',
    gastosArtista: 0,
    gastosAgencia: 0,
    shows: [
      {
        id: 'bd007a8d-328e-4a58-95fa-075e28380629',
        fecha: '2026-09-18',
        ciudad: 'Pozos, Costa Rica',
        venue: 'Zouk',
        cache: 1450,
        lat: 9.9632989,
        lng: -84.1984541,
        logistica: { ...SIN_LOGISTICA },
      },
      {
        id: 'ab202a59-b3db-4ce4-88b5-2284e8b2dbef',
        fecha: '2026-09-19',
        ciudad: 'Rionegro, Colombia',
        venue: 'Piket’ando',
        cache: 1500,
        lat: 6.1498368,
        lng: -75.4195036,
        logistica: { ...SIN_LOGISTICA },
      },
      {
        id: 'aa39fcf2-0b6c-4e98-8104-5c71daa7759e',
        fecha: '2026-09-26',
        ciudad: 'San José, Costa Rica',
        venue: 'Palio Sabana',
        cache: 1450,
        lat: 9.9324583,
        lng: -84.1026894,
        logistica: { ...SIN_LOGISTICA },
      },
    ],
  },
  {
    id: 'db6247ed-d98e-476d-a0fb-3b0ab4675267',
    nombre: 'ART NO LOGIA Sept 2026',
    artista: 'ART NO LOGIA',
    territorio: 'Latinoamérica',
    desde: null,
    hasta: null,
    estado: 'planificando',
    moneda: 'USD',
    gastosArtista: 0,
    gastosAgencia: 0,
    shows: [
      {
        id: '746ccaf1-b4e1-4379-9849-e22ad16b21fd',
        fecha: '2026-10-09',
        ciudad: 'Las Condes, Chile',
        venue: 'Sala Omnium',
        cache: 1725,
        lat: -33.411617,
        lng: -70.577876,
        logistica: { ...SIN_LOGISTICA },
      },
      {
        id: '6b724767-113f-492d-870d-0d3b90dff0d7',
        fecha: '2026-10-16',
        ciudad: 'Caracas, Venezuela',
        venue: 'Modo Caracas',
        cache: 2000,
        lat: 10.4971113,
        lng: -66.8544581,
        logistica: { ...SIN_LOGISTICA },
      },
      {
        id: '9b71120c-269a-45f3-8d67-2a015ee17de7',
        fecha: '2026-10-17',
        ciudad: 'Pozos, Costa Rica',
        venue: 'Zouk CR',
        cache: 2200,
        lat: 9.9632989,
        lng: -84.1984541,
        logistica: { ...SIN_LOGISTICA },
      },
    ],
  },
];

export function tourPorId(id: string): Tour | undefined {
  return tours.find((tour) => tour.id === id);
}

/** Atajo para los tests y las fixtures: busca la gira por su nombre del live. */
export function tourPorNombre(nombre: string): Tour | undefined {
  return tours.find((tour) => tour.nombre === nombre);
}

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

/** `2026-09-18` → `18 sept`, como cada parada del itinerario. */
export function formatFechaTour(iso: string): string {
  const [, mes, dia] = iso.split('-');
  return `${dia} ${MESES[Number(mes) - 1]}`;
}

/** `2026-09-18` → `18 sept 2026`, como la cabecera de la gira. */
export function formatFechaTourLarga(iso: string): string {
  return `${formatFechaTour(iso)} ${iso.slice(0, 4)}`;
}

/** Rango de la gira: `desde → hasta`, sólo `desde`, o vacío si no tiene fechas. */
export function formatRangoTour(tour: Tour): string {
  if (!tour.desde) return '';
  if (!tour.hasta) return formatFechaTourLarga(tour.desde);
  return `${formatFechaTourLarga(tour.desde)} → ${formatFechaTourLarga(tour.hasta)}`;
}

const SIMBOLO: Record<string, string> = { EUR: '€', USD: 'US$' };

/** `1450` en USD → `1450,00 US$`. El live no separa los miles con punto aquí. */
export function formatImporteTour(amount: number, moneda: string): string {
  const fijo = amount.toFixed(2).replace('.', ',');
  // El live separa el importe del símbolo con un espacio duro (`&nbsp;`).
  return `${fijo}\u00A0${SIMBOLO[moneda] ?? moneda}`;
}

/** Suma de los cachés brutos pactados con los promotores. */
export function cachesBrutos(tour: Tour): number {
  return tour.shows.reduce((acc, show) => acc + show.cache, 0);
}

export interface TourPnl {
  cachesNetos: number;
  gastosArtista: number;
  netoArtista: number;
  bookingFee: number;
  gastosAgencia: number;
  margenAgencia: number;
}

/** El P&L de la gira en dos bloques: lo que se lleva el artista y el margen de la agencia. */
export function tourPnl(tour: Tour): TourPnl {
  const brutos = cachesBrutos(tour);
  const bookingFee = redondea(brutos * BOOKING_FEE_PCT);
  const cachesNetos = redondea(brutos - bookingFee);
  return {
    cachesNetos,
    gastosArtista: tour.gastosArtista,
    netoArtista: redondea(cachesNetos - tour.gastosArtista),
    bookingFee,
    gastosAgencia: tour.gastosAgencia,
    margenAgencia: redondea(bookingFee - tour.gastosAgencia),
  };
}

function redondea(n: number): number {
  return Math.round(n * 100) / 100;
}

export interface TramoTour {
  desde: TourShow;
  hasta: TourShow;
  km: number;
  millas: number;
  horas: number;
  huecoDias: number;
}

const RADIO_TIERRA_KM = 6371;
const KM_POR_MILLA = 1.609344;
/** El live modela el salto como 2,5 h de aeropuerto más el vuelo a 750 km/h. */
export const HORAS_FIJAS_VUELO = 2.5;
export const VELOCIDAD_VUELO_KMH = 750;

function distanciaKm(a: TourShow, b: TourShow): number {
  const rad = (grados: number) => (grados * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * RADIO_TIERRA_KM * Math.asin(Math.sqrt(h));
}

function diasEntre(isoA: string, isoB: string): number {
  const ms = Date.parse(`${isoB}T00:00:00Z`) - Date.parse(`${isoA}T00:00:00Z`);
  return Math.round(ms / 86_400_000);
}

/** Un tramo por cada salto entre paradas consecutivas. */
export function tramosDelTour(tour: Tour): TramoTour[] {
  const tramos: TramoTour[] = [];
  for (let i = 1; i < tour.shows.length; i += 1) {
    const desde = tour.shows[i - 1];
    const hasta = tour.shows[i];
    // Las millas y las horas salen de la distancia sin redondear: si se
    // calculan sobre los km ya redondeados, el tramo de 4898 km da 3043 mi y el
    // live imprime 3044.
    const exacta = distanciaKm(desde, hasta);
    tramos.push({
      desde,
      hasta,
      km: Math.round(exacta),
      millas: Math.round(exacta / KM_POR_MILLA),
      horas: Math.round((HORAS_FIJAS_VUELO + exacta / VELOCIDAD_VUELO_KMH) * 10) / 10,
      huecoDias: diasEntre(desde.fecha, hasta.fecha),
    });
  }
  return tramos;
}

/** `3.9` se queda igual; `14.0` pierde el decimal, como en el live. */
export function formatHoras(horas: number): string {
  const redondeado = Math.round(horas * 10) / 10;
  return Number.isInteger(redondeado) ? String(redondeado) : redondeado.toFixed(1);
}

/** El hueco entre dos paradas; vacío cuando son días consecutivos sin holgura. */
export function formatHueco(dias: number): string {
  if (dias <= 0) return '';
  return `· ${dias} ${dias === 1 ? 'día' : 'días'} de hueco`;
}

/** El pie de cambio sólo aparece cuando la gira no va en euros. */
export function notaDivisa(moneda: string): string {
  if (moneda === 'EUR') return '';
  return `En ${moneda}: 1 ${moneda} = ${USD_EUR} EUR. Cachés = caché − booking fee (el management fee y los gastos de cada show se ven en su liquidación).`;
}
