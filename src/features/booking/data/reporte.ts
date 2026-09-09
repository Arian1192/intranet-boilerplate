/**
 * Datos de `/reporte` (la pantalla se titula «Analítica»).
 *
 * Calcados de `f1-reporte`, `f1-reporte--comisiones-agentes` y
 * `f1-reporte--reparto-artistas` (live capturado el 2026-09-09, 10:09 CEST).
 *
 * Las tablas, los catálogos y el reparto salen del volcado del `<main>`
 * extraídos del DOM. Las dos series del gráfico apilado no están en el texto:
 * se decodifican de la geometría de sus barras, y el resultado cuadra al
 * céntimo con los KPI de la cabecera —6450,00 € de booking, y Los Canarios con
 * BF 1300,00 € / MF 947,47 €—, que es la segunda medida que lo confirma.
 */

export const PESTANAS_REPORTE = [
  'Resumen',
  'Comisiones de agentes',
  'Reparto de artistas',
] as const;

export type PestanaReporte = (typeof PESTANAS_REPORTE)[number];

/** El filtro `Estado`, que sólo se ve en la pestaña `Resumen`. */
export const ESTADOS_REPORTE = ['Liquidados', 'Pendientes de liquidar', 'Todos'];

/**
 * Importes como los escribe esta pantalla: agrupación es-ES —que no separa los
 * millares de cuatro cifras: «4200,00 €» pero «22.650,00 €»— y **espacio duro**
 * (U+00A0) antes del €, que es lo que hay en el DOM (`6450,00&nbsp;€`).
 */
export function formatEurosReporte(importe: number): string {
  const cifra = importe.toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: importe >= 10000,
  });
  return `${cifra}\u00a0€`;
}

export interface KpiReporte {
  etiqueta: string;
  valor: string;
  /** Las líneas pequeñas de debajo del valor. */
  pies?: string[];
  clase: string;
}

export const kpisDashboard: KpiReporte[] = [
  { etiqueta: 'Shows liquidados', valor: '23', clase: 'text-slate-800' },
  { etiqueta: 'Booking fees', valor: formatEurosReporte(6450), clase: 'text-brand-700' },
  { etiqueta: 'Management fees', valor: formatEurosReporte(1512.83), clase: 'text-brand-700' },
  { etiqueta: 'Total gastado', valor: formatEurosReporte(1806.98), clase: 'text-amber-600' },
  {
    etiqueta: 'Artista más rentable',
    valor: 'Los Canarios',
    pies: [`BF ${formatEurosReporte(1300)}`, `MF ${formatEurosReporte(947.47)}`],
    clase: 'text-slate-800',
  },
];

export interface FeeArtista {
  artista: string;
  booking: number;
  management: number;
}

/** Las dos series apiladas, decodificadas de la geometría del gráfico. */
export const feesPorArtista: FeeArtista[] = [
  { artista: 'Los Canarios', booking: 1300, management: 947.47 },
  { artista: 'Brenda Serna', booking: 1710, management: 0 },
  { artista: 'Marcel BS', booking: 740, management: 0 },
  { artista: 'Sebastian Ledher', booking: 440, management: 165.37 },
  { artista: 'Rivellino', booking: 200, management: 400 },
  { artista: 'Tomi & Kesh', booking: 560, management: 0 },
  { artista: 'Pau Guilera', booking: 300, management: 0 },
  { artista: 'Bizza', booking: 200, management: 0 },
  { artista: 'Florentia', booking: 200, management: 0 },
  { artista: 'LA CINTIA', booking: 200, management: 0 },
  { artista: 'Londonground', booking: 200, management: 0 },
  { artista: 'Jose Fajardo', booking: 200, management: 0 },
  { artista: 'Marian Ariss', booking: 200, management: 0 },
];

export const TICKS_FEES = [0, 600, 1200, 1800, 2400];

/**
 * Los dos colores del gráfico van literales, como en el SVG del live: el
 * carbón de la casa y el ámbar. No son clases `brand-*`, así que aquí no
 * aplica la regla de dejárselas a `apx.css`.
 */
export const COLOR_BOOKING = '#44444c';
export const COLOR_MANAGEMENT = '#f59e0b';

export const kpisPorAgente: KpiReporte[] = [
  { etiqueta: 'Total comisiones', valor: formatEurosReporte(1747.5), clase: 'text-brand-700' },
  {
    etiqueta: 'Agente top (comisión)',
    valor: 'Yenifer Bernardo',
    pies: [formatEurosReporte(1227.5)],
    clase: 'text-slate-800',
  },
  {
    etiqueta: 'Más fechas cerradas',
    valor: 'Yenifer Bernardo',
    pies: ['14 cierres'],
    clase: 'text-slate-800',
  },
  { etiqueta: 'Agentes activos', valor: '5', clase: 'text-slate-800' },
];

export const TICKS_COMISION = [0, 350, 700, 1050, 1400];

export const CABECERAS_AGENTES = [
  'Agente',
  'Cierres',
  'Fee bruto',
  'Fee medio',
  'Booking fees',
  'Comisión',
];

export interface FilaAgente {
  agente: string;
  cierres: number;
  feeBruto: number;
  feeMedio: number;
  bookingFees: number;
  comision: number;
}

export const tablaAgentes: FilaAgente[] = [
  {
    agente: 'Yenifer Bernardo',
    cierres: 14,
    feeBruto: 22650,
    feeMedio: 1617.86,
    bookingFees: 4810,
    comision: 1227.5,
  },
  {
    agente: 'Alex González',
    cierres: 3,
    feeBruto: 4200,
    feeMedio: 1400,
    bookingFees: 940,
    comision: 235,
  },
  {
    agente: 'Aldo Messina',
    cierres: 3,
    feeBruto: 2000,
    feeMedio: 666.67,
    bookingFees: 400,
    comision: 210,
  },
  {
    agente: 'Patricia Pareja Casalí',
    cierres: 2,
    feeBruto: 2000,
    feeMedio: 1000,
    bookingFees: 200,
    comision: 50,
  },
  {
    agente: 'Oscar Buch',
    cierres: 1,
    feeBruto: 500,
    feeMedio: 500,
    bookingFees: 100,
    comision: 25,
  },
];

export const NOTA_AGENTES =
  'Cierres = fechas que trae el agente (de origen, o el oficial del artista si no hay agente de origen). La comisión incluye lo que gana como oficial y como origen en todos los shows del filtro.';

export const PLACEHOLDER_VISTA_ARTISTA = 'Selecciona un artista…';
export const VACIO_VISTA_ARTISTA = 'Selecciona un artista para ver su detalle.';

/** El catálogo largo del desplegable «Vista por artista»: 193 nombres. */
export const artistasSelect: string[] = [
  'Aaron Martin',
  'Abdon',
  'ACA',
  'ADDMOR',
  'Adrian Oliver',
  'Agoria',
  'Agus',
  'Agustin Montes',
  'AIIVIIK',
  'Alex Now',
  'Alexanders Som',
  'Alvaro Prieto',
  'Alvaro Varen',
  'Andrea Castells',
  'Andrew Azara',
  'ART NO LOGIA',
  'Ballesteros',
  'Bassel Darwish',
  'Bianca Lif',
  'Bicar',
  'Bizza',
  'Bliezt',
  'Brenda Serna',
  'CAAL',
  'Cannon',
  'Carlos Chaparro',
  'Caste',
  'Cesar Alamdena',
  'Cesar Almena',
  'Chinonegro',
  'Chrlyfst',
  'CHUS SOS',
  'Claptone',
  'Claudia Tejeda',
  'Crixx',
  'Cuartero',
  'D.O.D',
  'Dani Berenguel',
  'Dani Corral',
  'Danny Gomez',
  'Dany Gomez',
  'De La Swing',
  'Delatorre',
  'Delum',
  'Denis Cruz',
  'Detleft',
  'DH Moon',
  'Dhuna',
  'Dimmish',
  'Disciples',
  'Dj Equis',
  'Dontbedaft',
  'Dunmore Brothers',
  'Erick Sierra',
  'ERRE',
  'Ezziolino',
  'Felipe Nogueira',
  'Fletch',
  'Fleur Shore',
  'Florentia',
  'Fran Hernandez',
  'Francisco Allendes',
  'Francisco Valentín',
  'Freddy Bello',
  'Funk Off',
  'Gala',
  'Galgo',
  'Gaston Zani',
  'GoldRed',
  'Gonzz',
  'Gordo',
  'Guille Placencia',
  'Harvy Valencia',
  'Hector',
  'Hector Couto',
  'HoneyLuv',
  'Ian Margalef',
  'Ivan Dive',
  'James Hype',
  'Jan',
  'Janse',
  'Jay De Lys',
  'JESS',
  'JNJS',
  'Joey Daniel',
  'JORGESYN',
  'Jose Fajardo',
  'Jp Candela',
  'Kaeru',
  'Kavi jr',
  'Kele',
  'Kevin de Vries',
  'Kevin.Wav',
  'KevLb',
  'Kidoo',
  'Kirik',
  'KOKO',
  'Koleto',
  'Korolova',
  'LA CINTIA',
  'Larida',
  'Levi',
  'Leyo',
  'Linxes',
  'Local Support',
  'Londonground',
  'Los Campos',
  'Los Canarios',
  'Lucas Rios',
  'Lucor',
  'Luka Kuhnow',
  'Luke Vose',
  'Mamen',
  'Manclus',
  'Manda Moor',
  'Marcel BS',
  'Marian',
  'Marian Ariss',
  'Matthias Tanzmann',
  'MAZIUS&CALE',
  'metaraph',
  'Miane',
  'Michael Stiven',
  'Miganova',
  'Milan Torne',
  'Mr. Belt & Wezol',
  'Nacho Lara',
  'Nacho Scoppa',
  'Nick Curly',
  'Nico Loco',
  'Nicole Moudaber',
  'Oden & Fatzo',
  'Olivia Bass',
  'Ollie BC',
  'Omy Cid',
  'Orquesta Tropicanas',
  'Oscar Buch',
  'Palo Main',
  'Parsa Jafari',
  'Patrick Topping',
  'Pau Guilera',
  'Paul Woolford',
  'Paulina Di Mundo',
  'Portega',
  'Prophecy',
  'Rayconen',
  'Residente',
  'Rivellino',
  'Rooléh',
  'Rubenus',
  'S MARIO',
  'S.A.M.',
  'Sacchi',
  'Sadkiel',
  'Saldivar',
  'Salvi Fernandez',
  'Sante Sansone',
  'Savai',
  'Sebastian Ledher',
  'Selecta',
  'Sem Jacobs',
  'Sera De Villalta',
  'Sergio Leon',
  'Sergio Saffe',
  'Shakti',
  'SHOKË',
  'Simas',
  'Sirlof',
  'Sirolf',
  'Sirus Hood',
  'Solardo',
  'Sonno Sossego',
  'Sonny Fodera',
  'SOVA',
  'Spaceray',
  'Stella',
  'SUMIA',
  'TBA',
  'Tenax',
  'Test Artist',
  'Thinkpink',
  'Tom Nolan',
  'Tomi & Kesh',
  'Tony Guerra',
  'UGOTGLENN',
  'Vengui',
  'Vidaloca',
  'Vite',
  'Vito UK',
  'Vitor',
  'Werninghaus',
  'Wes Colstock',
  'Xandro',
];

export const kpisComisiones: KpiReporte[] = [
  { etiqueta: 'Devengado total', valor: formatEurosReporte(1747.5), clase: 'text-slate-800' },
  { etiqueta: 'Abonado', valor: formatEurosReporte(0), clase: 'text-emerald-600' },
  { etiqueta: 'Pendiente de abonar', valor: formatEurosReporte(1747.5), clase: 'text-rose-600' },
];

export interface ComisionAgente {
  agente: string;
  pie: string;
  devengado: number;
  abonado: number;
  pendiente: number;
}

export const comisionesPorAgente: ComisionAgente[] = [
  {
    agente: 'Yenifer Bernardo',
    pie: '15 shows liquidados · 0 abonos',
    devengado: 1227.5,
    abonado: 0,
    pendiente: 1227.5,
  },
  {
    agente: 'Alex González',
    pie: '3 shows liquidados · 0 abonos',
    devengado: 235,
    abonado: 0,
    pendiente: 235,
  },
  {
    agente: 'Aldo Messina',
    pie: '4 shows liquidados · 0 abonos',
    devengado: 210,
    abonado: 0,
    pendiente: 210,
  },
  {
    agente: 'Patricia Pareja Casalí',
    pie: '2 shows liquidados · 0 abonos',
    devengado: 50,
    abonado: 0,
    pendiente: 50,
  },
  {
    agente: 'Oscar Buch',
    pie: '1 show liquidado · 0 abonos',
    devengado: 25,
    abonado: 0,
    pendiente: 25,
  },
];

export const ROLES_REPARTO = ['Agentes', 'Advancing', 'Logística'] as const;

export type RolReparto = (typeof ROLES_REPARTO)[number];

export interface FilaCarga {
  nombre: string;
  bolos: number;
  artistas: number;
}

export interface GrupoCarga {
  rol: RolReparto;
  /** '8 pers. · 41 artistas' */
  meta: string;
  filas: FilaCarga[];
  /** El aviso rosa del final; sólo lo lleva Advancing. */
  sinAsignar?: { artistas: number; bolos: number };
}

export const cargaPorPersona: GrupoCarga[] = [
  {
    rol: 'Agentes',
    meta: '8 pers. · 41 artistas',
    filas: [
      { nombre: 'Yenifer Bernardo', bolos: 32, artistas: 17 },
      { nombre: 'Aldo Messina', bolos: 32, artistas: 13 },
      { nombre: 'Alex González', bolos: 5, artistas: 6 },
      { nombre: 'Carlos Pego', bolos: 0, artistas: 1 },
      { nombre: 'Jassi Gonzalez Montes', bolos: 0, artistas: 1 },
      { nombre: 'Oscar Buch', bolos: 0, artistas: 1 },
      { nombre: 'Patricia Pareja Casalí', bolos: 0, artistas: 1 },
      { nombre: 'Sadkiel', bolos: 0, artistas: 1 },
    ],
  },
  {
    rol: 'Advancing',
    meta: '2 pers. · 41 artistas',
    filas: [
      { nombre: 'Joe Coe', bolos: 69, artistas: 39 },
      { nombre: 'Carlos Pego', bolos: 0, artistas: 1 },
    ],
    sinAsignar: { artistas: 1, bolos: 0 },
  },
  {
    rol: 'Logística',
    meta: '4 pers. · 41 artistas',
    filas: [
      { nombre: 'Meritxell Pareja Casalí', bolos: 65, artistas: 40 },
      { nombre: 'Alex González', bolos: 46, artistas: 31 },
      { nombre: 'Oscar Buch', bolos: 23, artistas: 8 },
      { nombre: 'Carlos Pego', bolos: 0, artistas: 1 },
    ],
  },
];

export interface PersonaChip {
  /** Lo que se lee en la pastilla: el nombre de pila. */
  corto: string;
  completo: string;
}

export interface RepartoArtista {
  nombre: string;
  booking: boolean;
  management: boolean;
  /** Los «N 🎫» de bolos próximos; `null` si el artista no tiene. */
  bolos: number | null;
  roles: Record<RolReparto, PersonaChip[]>;
}

export const repartoPorArtista: RepartoArtista[] = [
  {
    nombre: 'Aaron Martin',
    booking: true,
    management: true,
    bolos: 3,
    roles: {
      Agentes: [{ corto: 'Aldo', completo: 'Aldo Messina' }],
      Advancing: [{ corto: 'Joe', completo: 'Joe Coe' }],
      Logística: [
        { corto: 'Alex', completo: 'Alex González' },
        { corto: 'Meritxell', completo: 'Meritxell Pareja Casalí' },
      ],
    },
  },
  {
    nombre: 'Abdon',
    booking: true,
    management: true,
    bolos: 2,
    roles: {
      Agentes: [{ corto: 'Yenifer', completo: 'Yenifer Bernardo' }],
      Advancing: [{ corto: 'Joe', completo: 'Joe Coe' }],
      Logística: [
        { corto: 'Oscar', completo: 'Oscar Buch' },
        { corto: 'Meritxell', completo: 'Meritxell Pareja Casalí' },
      ],
    },
  },
  {
    nombre: 'ACA',
    booking: true,
    management: false,
    bolos: 3,
    roles: {
      Agentes: [{ corto: 'Yenifer', completo: 'Yenifer Bernardo' }],
      Advancing: [{ corto: 'Joe', completo: 'Joe Coe' }],
      Logística: [
        { corto: 'Alex', completo: 'Alex González' },
        { corto: 'Meritxell', completo: 'Meritxell Pareja Casalí' },
      ],
    },
  },
  {
    nombre: 'Andrea Castells',
    booking: true,
    management: false,
    bolos: null,
    roles: {
      Agentes: [{ corto: 'Alex', completo: 'Alex González' }],
      Advancing: [{ corto: 'Joe', completo: 'Joe Coe' }],
      Logística: [
        { corto: 'Alex', completo: 'Alex González' },
        { corto: 'Meritxell', completo: 'Meritxell Pareja Casalí' },
      ],
    },
  },
  {
    nombre: 'ART NO LOGIA',
    booking: true,
    management: true,
    bolos: 8,
    roles: {
      Agentes: [{ corto: 'Aldo', completo: 'Aldo Messina' }],
      Advancing: [{ corto: 'Joe', completo: 'Joe Coe' }],
      Logística: [
        { corto: 'Alex', completo: 'Alex González' },
        { corto: 'Meritxell', completo: 'Meritxell Pareja Casalí' },
      ],
    },
  },
  {
    nombre: 'Bassel Darwish',
    booking: true,
    management: false,
    bolos: 4,
    roles: {
      Agentes: [{ corto: 'Aldo', completo: 'Aldo Messina' }],
      Advancing: [{ corto: 'Joe', completo: 'Joe Coe' }],
      Logística: [{ corto: 'Alex', completo: 'Alex González' }],
    },
  },
  {
    nombre: 'Bizza',
    booking: true,
    management: true,
    bolos: 3,
    roles: {
      Agentes: [{ corto: 'Aldo', completo: 'Aldo Messina' }],
      Advancing: [{ corto: 'Joe', completo: 'Joe Coe' }],
      Logística: [
        { corto: 'Alex', completo: 'Alex González' },
        { corto: 'Meritxell', completo: 'Meritxell Pareja Casalí' },
      ],
    },
  },
  {
    nombre: 'Brenda Serna',
    booking: true,
    management: false,
    bolos: 3,
    roles: {
      Agentes: [{ corto: 'Yenifer', completo: 'Yenifer Bernardo' }],
      Advancing: [{ corto: 'Joe', completo: 'Joe Coe' }],
      Logística: [
        { corto: 'Oscar', completo: 'Oscar Buch' },
        { corto: 'Meritxell', completo: 'Meritxell Pareja Casalí' },
      ],
    },
  },
  {
    nombre: 'Claudia Tejeda',
    booking: true,
    management: true,
    bolos: 6,
    roles: {
      Agentes: [{ corto: 'Yenifer', completo: 'Yenifer Bernardo' }],
      Advancing: [{ corto: 'Joe', completo: 'Joe Coe' }],
      Logística: [
        { corto: 'Alex', completo: 'Alex González' },
        { corto: 'Meritxell', completo: 'Meritxell Pareja Casalí' },
      ],
    },
  },
  {
    nombre: 'DH Moon',
    booking: true,
    management: true,
    bolos: 1,
    roles: {
      Agentes: [{ corto: 'Aldo', completo: 'Aldo Messina' }],
      Advancing: [{ corto: 'Joe', completo: 'Joe Coe' }],
      Logística: [
        { corto: 'Alex', completo: 'Alex González' },
        { corto: 'Meritxell', completo: 'Meritxell Pareja Casalí' },
      ],
    },
  },
  {
    nombre: 'Dhuna',
    booking: true,
    management: false,
    bolos: null,
    roles: {
      Agentes: [{ corto: 'Yenifer', completo: 'Yenifer Bernardo' }],
      Advancing: [{ corto: 'Joe', completo: 'Joe Coe' }],
      Logística: [
        { corto: 'Alex', completo: 'Alex González' },
        { corto: 'Meritxell', completo: 'Meritxell Pareja Casalí' },
      ],
    },
  },
  {
    nombre: 'Florentia',
    booking: true,
    management: false,
    bolos: null,
    roles: {
      Agentes: [{ corto: 'Yenifer', completo: 'Yenifer Bernardo' }],
      Advancing: [{ corto: 'Joe', completo: 'Joe Coe' }],
      Logística: [
        { corto: 'Alex', completo: 'Alex González' },
        { corto: 'Meritxell', completo: 'Meritxell Pareja Casalí' },
      ],
    },
  },
  {
    nombre: 'Fran Hernandez',
    booking: true,
    management: false,
    bolos: null,
    roles: {
      Agentes: [{ corto: 'Aldo', completo: 'Aldo Messina' }],
      Advancing: [{ corto: 'Joe', completo: 'Joe Coe' }],
      Logística: [
        { corto: 'Alex', completo: 'Alex González' },
        { corto: 'Meritxell', completo: 'Meritxell Pareja Casalí' },
      ],
    },
  },
  {
    nombre: 'Freddy Bello',
    booking: true,
    management: true,
    bolos: 3,
    roles: {
      Agentes: [{ corto: 'Yenifer', completo: 'Yenifer Bernardo' }],
      Advancing: [{ corto: 'Joe', completo: 'Joe Coe' }],
      Logística: [
        { corto: 'Oscar', completo: 'Oscar Buch' },
        { corto: 'Meritxell', completo: 'Meritxell Pareja Casalí' },
      ],
    },
  },
  {
    nombre: 'Gaston Zani',
    booking: true,
    management: true,
    bolos: 1,
    roles: {
      Agentes: [{ corto: 'Yenifer', completo: 'Yenifer Bernardo' }],
      Advancing: [{ corto: 'Joe', completo: 'Joe Coe' }],
      Logística: [
        { corto: 'Alex', completo: 'Alex González' },
        { corto: 'Meritxell', completo: 'Meritxell Pareja Casalí' },
      ],
    },
  },
  {
    nombre: 'Janse',
    booking: true,
    management: true,
    bolos: null,
    roles: {
      Agentes: [{ corto: 'Oscar', completo: 'Oscar Buch' }],
      Advancing: [{ corto: 'Joe', completo: 'Joe Coe' }],
      Logística: [
        { corto: 'Oscar', completo: 'Oscar Buch' },
        { corto: 'Meritxell', completo: 'Meritxell Pareja Casalí' },
      ],
    },
  },
  {
    nombre: 'Jose Fajardo',
    booking: true,
    management: false,
    bolos: 1,
    roles: {
      Agentes: [{ corto: 'Yenifer', completo: 'Yenifer Bernardo' }],
      Advancing: [{ corto: 'Joe', completo: 'Joe Coe' }],
      Logística: [
        { corto: 'Alex', completo: 'Alex González' },
        { corto: 'Meritxell', completo: 'Meritxell Pareja Casalí' },
      ],
    },
  },
  {
    nombre: 'Koleto',
    booking: true,
    management: false,
    bolos: null,
    roles: {
      Agentes: [{ corto: 'Aldo', completo: 'Aldo Messina' }],
      Advancing: [{ corto: 'Joe', completo: 'Joe Coe' }],
      Logística: [
        { corto: 'Alex', completo: 'Alex González' },
        { corto: 'Meritxell', completo: 'Meritxell Pareja Casalí' },
      ],
    },
  },
  {
    nombre: 'LA CINTIA',
    booking: true,
    management: false,
    bolos: null,
    roles: {
      Agentes: [{ corto: 'Yenifer', completo: 'Yenifer Bernardo' }],
      Advancing: [{ corto: 'Joe', completo: 'Joe Coe' }],
      Logística: [
        { corto: 'Alex', completo: 'Alex González' },
        { corto: 'Meritxell', completo: 'Meritxell Pareja Casalí' },
      ],
    },
  },
  {
    nombre: 'Londonground',
    booking: true,
    management: true,
    bolos: 1,
    roles: {
      Agentes: [{ corto: 'Aldo', completo: 'Aldo Messina' }],
      Advancing: [{ corto: 'Joe', completo: 'Joe Coe' }],
      Logística: [
        { corto: 'Oscar', completo: 'Oscar Buch' },
        { corto: 'Meritxell', completo: 'Meritxell Pareja Casalí' },
      ],
    },
  },
  {
    nombre: 'Los Canarios',
    booking: true,
    management: true,
    bolos: 5,
    roles: {
      Agentes: [{ corto: 'Yenifer', completo: 'Yenifer Bernardo' }],
      Advancing: [{ corto: 'Joe', completo: 'Joe Coe' }],
      Logística: [
        { corto: 'Oscar', completo: 'Oscar Buch' },
        { corto: 'Meritxell', completo: 'Meritxell Pareja Casalí' },
      ],
    },
  },
  {
    nombre: 'Marcel BS',
    booking: true,
    management: true,
    bolos: 2,
    roles: {
      Agentes: [{ corto: 'Alex', completo: 'Alex González' }],
      Advancing: [{ corto: 'Joe', completo: 'Joe Coe' }],
      Logística: [
        { corto: 'Alex', completo: 'Alex González' },
        { corto: 'Meritxell', completo: 'Meritxell Pareja Casalí' },
      ],
    },
  },
  {
    nombre: 'Marian Ariss',
    booking: true,
    management: false,
    bolos: 3,
    roles: {
      Agentes: [{ corto: 'Alex', completo: 'Alex González' }],
      Advancing: [{ corto: 'Joe', completo: 'Joe Coe' }],
      Logística: [
        { corto: 'Alex', completo: 'Alex González' },
        { corto: 'Meritxell', completo: 'Meritxell Pareja Casalí' },
      ],
    },
  },
  {
    nombre: 'Milan Torne',
    booking: true,
    management: true,
    bolos: 1,
    roles: {
      Agentes: [{ corto: 'Aldo', completo: 'Aldo Messina' }],
      Advancing: [{ corto: 'Joe', completo: 'Joe Coe' }],
      Logística: [
        { corto: 'Alex', completo: 'Alex González' },
        { corto: 'Meritxell', completo: 'Meritxell Pareja Casalí' },
      ],
    },
  },
  {
    nombre: 'Nacho Scoppa',
    booking: true,
    management: false,
    bolos: null,
    roles: {
      Agentes: [{ corto: 'Aldo', completo: 'Aldo Messina' }],
      Advancing: [{ corto: 'Joe', completo: 'Joe Coe' }],
      Logística: [
        { corto: 'Alex', completo: 'Alex González' },
        { corto: 'Meritxell', completo: 'Meritxell Pareja Casalí' },
      ],
    },
  },
  {
    nombre: 'Olivia Bass',
    booking: true,
    management: false,
    bolos: 2,
    roles: {
      Agentes: [{ corto: 'Yenifer', completo: 'Yenifer Bernardo' }],
      Advancing: [{ corto: 'Joe', completo: 'Joe Coe' }],
      Logística: [
        { corto: 'Alex', completo: 'Alex González' },
        { corto: 'Meritxell', completo: 'Meritxell Pareja Casalí' },
      ],
    },
  },
  {
    nombre: 'Parsa Jafari',
    booking: true,
    management: false,
    bolos: null,
    roles: {
      Agentes: [{ corto: 'Yenifer', completo: 'Yenifer Bernardo' }],
      Advancing: [{ corto: 'Joe', completo: 'Joe Coe' }],
      Logística: [
        { corto: 'Alex', completo: 'Alex González' },
        { corto: 'Meritxell', completo: 'Meritxell Pareja Casalí' },
      ],
    },
  },
  {
    nombre: 'Pau Guilera',
    booking: true,
    management: false,
    bolos: 2,
    roles: {
      Agentes: [{ corto: 'Yenifer', completo: 'Yenifer Bernardo' }],
      Advancing: [{ corto: 'Joe', completo: 'Joe Coe' }],
      Logística: [
        { corto: 'Oscar', completo: 'Oscar Buch' },
        { corto: 'Meritxell', completo: 'Meritxell Pareja Casalí' },
      ],
    },
  },
  {
    nombre: 'Prophecy',
    booking: true,
    management: false,
    bolos: null,
    roles: {
      Agentes: [{ corto: 'Alex', completo: 'Alex González' }],
      Advancing: [{ corto: 'Joe', completo: 'Joe Coe' }],
      Logística: [
        { corto: 'Alex', completo: 'Alex González' },
        { corto: 'Meritxell', completo: 'Meritxell Pareja Casalí' },
      ],
    },
  },
  {
    nombre: 'Rivellino',
    booking: true,
    management: true,
    bolos: null,
    roles: {
      Agentes: [{ corto: 'Patricia', completo: 'Patricia Pareja Casalí' }],
      Advancing: [{ corto: 'Joe', completo: 'Joe Coe' }],
      Logística: [
        { corto: 'Alex', completo: 'Alex González' },
        { corto: 'Meritxell', completo: 'Meritxell Pareja Casalí' },
      ],
    },
  },
  {
    nombre: 'Rubenus',
    booking: true,
    management: false,
    bolos: null,
    roles: {
      Agentes: [{ corto: 'Alex', completo: 'Alex González' }],
      Advancing: [{ corto: 'Joe', completo: 'Joe Coe' }],
      Logística: [
        { corto: 'Alex', completo: 'Alex González' },
        { corto: 'Meritxell', completo: 'Meritxell Pareja Casalí' },
      ],
    },
  },
  {
    nombre: 'Sadkiel',
    booking: true,
    management: false,
    bolos: null,
    roles: {
      Agentes: [{ corto: 'Sadkiel', completo: 'Sadkiel' }],
      Advancing: [],
      Logística: [{ corto: 'Meritxell', completo: 'Meritxell Pareja Casalí' }],
    },
  },
  {
    nombre: 'Saldivar',
    booking: true,
    management: false,
    bolos: null,
    roles: {
      Agentes: [{ corto: 'Alex', completo: 'Alex González' }],
      Advancing: [{ corto: 'Joe', completo: 'Joe Coe' }],
      Logística: [
        { corto: 'Alex', completo: 'Alex González' },
        { corto: 'Meritxell', completo: 'Meritxell Pareja Casalí' },
      ],
    },
  },
  {
    nombre: 'Sebastian Ledher',
    booking: true,
    management: true,
    bolos: 3,
    roles: {
      Agentes: [{ corto: 'Aldo', completo: 'Aldo Messina' }],
      Advancing: [{ corto: 'Joe', completo: 'Joe Coe' }],
      Logística: [
        { corto: 'Alex', completo: 'Alex González' },
        { corto: 'Meritxell', completo: 'Meritxell Pareja Casalí' },
      ],
    },
  },
  {
    nombre: 'Sera De Villalta',
    booking: true,
    management: false,
    bolos: 7,
    roles: {
      Agentes: [{ corto: 'Aldo', completo: 'Aldo Messina' }],
      Advancing: [{ corto: 'Joe', completo: 'Joe Coe' }],
      Logística: [
        { corto: 'Oscar', completo: 'Oscar Buch' },
        { corto: 'Meritxell', completo: 'Meritxell Pareja Casalí' },
      ],
    },
  },
  {
    nombre: 'Sergio Saffe',
    booking: true,
    management: false,
    bolos: 1,
    roles: {
      Agentes: [{ corto: 'Aldo', completo: 'Aldo Messina' }],
      Advancing: [{ corto: 'Joe', completo: 'Joe Coe' }],
      Logística: [
        { corto: 'Alex', completo: 'Alex González' },
        { corto: 'Meritxell', completo: 'Meritxell Pareja Casalí' },
      ],
    },
  },
  {
    nombre: 'SUMIA',
    booking: true,
    management: false,
    bolos: null,
    roles: {
      Agentes: [{ corto: 'Yenifer', completo: 'Yenifer Bernardo' }],
      Advancing: [{ corto: 'Joe', completo: 'Joe Coe' }],
      Logística: [
        { corto: 'Alex', completo: 'Alex González' },
        { corto: 'Meritxell', completo: 'Meritxell Pareja Casalí' },
      ],
    },
  },
  {
    nombre: 'Test Artist',
    booking: true,
    management: false,
    bolos: null,
    roles: {
      Agentes: [{ corto: 'Carlos', completo: 'Carlos Pego' }],
      Advancing: [{ corto: 'Carlos', completo: 'Carlos Pego' }],
      Logística: [
        { corto: 'Carlos', completo: 'Carlos Pego' },
        { corto: 'Meritxell', completo: 'Meritxell Pareja Casalí' },
      ],
    },
  },
  {
    nombre: 'Tomi & Kesh',
    booking: true,
    management: false,
    bolos: 3,
    roles: {
      Agentes: [{ corto: 'Yenifer', completo: 'Yenifer Bernardo' }],
      Advancing: [{ corto: 'Joe', completo: 'Joe Coe' }],
      Logística: [
        { corto: 'Alex', completo: 'Alex González' },
        { corto: 'Meritxell', completo: 'Meritxell Pareja Casalí' },
      ],
    },
  },
  {
    nombre: 'Tony Guerra',
    booking: true,
    management: true,
    bolos: null,
    roles: {
      Agentes: [{ corto: 'Jassi', completo: 'Jassi Gonzalez Montes' }],
      Advancing: [{ corto: 'Joe', completo: 'Joe Coe' }],
      Logística: [
        { corto: 'Alex', completo: 'Alex González' },
        { corto: 'Meritxell', completo: 'Meritxell Pareja Casalí' },
      ],
    },
  },
  {
    nombre: 'Vidaloca',
    booking: true,
    management: true,
    bolos: 1,
    roles: {
      Agentes: [{ corto: 'Yenifer', completo: 'Yenifer Bernardo' }],
      Advancing: [{ corto: 'Joe', completo: 'Joe Coe' }],
      Logística: [
        { corto: 'Alex', completo: 'Alex González' },
        { corto: 'Meritxell', completo: 'Meritxell Pareja Casalí' },
      ],
    },
  },
];

/** El botón «Solo sin asignar»: artistas a los que les falta algún rol. */
export function artistasSinAsignar(lista: RepartoArtista[]): RepartoArtista[] {
  return lista.filter((artista) => ROLES_REPARTO.some((rol) => artista.roles[rol].length === 0));
}

/**
 * Iniciales de la pastilla de persona: la del nombre y la del último apellido
 * («Meritxell Pareja Casalí» → `MC`).
 *
 * Con un solo nombre —Sadkiel— el live no lo enseña, porque ahí sirve una foto;
 * se aplica la misma regla que él usa en `/artistas` cuando no hay foto: las
 * dos primeras letras.
 */
export function inicialesPersona(nombre: string): string {
  const partes = nombre.trim().split(/\s+/);
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

export interface DatosReporte {
  kpisDashboard: KpiReporte[];
  feesPorArtista: FeeArtista[];
  ticksFees: number[];
  /** Los dos KPI de la cabecera, en número: son la contraprueba del gráfico. */
  totalBooking: number;
  totalManagement: number;
  kpisPorAgente: KpiReporte[];
  ticksComision: number[];
  tablaAgentes: FilaAgente[];
}

/**
 * El filtro `Estado` **no es decorativo**: cambia los KPI, los dos gráficos y
 * la tabla de agentes, y hasta el rótulo del primer KPI («Shows liquidados» /
 * «Shows pendientes» / «Shows»).
 *
 * Medido y capturado en el live el 2026-09-09 a las 12:06 CEST
 * (`f1d-reporte--estado-pendientes` y `f1d-reporte--estado-todos`), después de
 * que el coordinador avisara de que en otras pantallas los contadores cuentan
 * lo filtrado. Aquí cuentan lo filtrado, y de qué manera.
 */
export const REPORTE_POR_ESTADO: Record<string, DatosReporte> = {
  Liquidados: {
    kpisDashboard,
    feesPorArtista,
    ticksFees: TICKS_FEES,
    totalBooking: 6450,
    totalManagement: 1512.83,
    kpisPorAgente,
    ticksComision: TICKS_COMISION,
    tablaAgentes,
  },
  'Pendientes de liquidar': {
    kpisDashboard: [
      { etiqueta: 'Shows pendientes', valor: '228', clase: 'text-slate-800' },
      { etiqueta: 'Booking fees', valor: formatEurosReporte(36004.43), clase: 'text-brand-700' },
      { etiqueta: 'Management fees', valor: formatEurosReporte(16154.38), clase: 'text-brand-700' },
      { etiqueta: 'Total gastado', valor: formatEurosReporte(11502.14), clase: 'text-amber-600' },
      {
        etiqueta: 'Artista más rentable',
        valor: 'Bizza',
        pies: [`BF ${formatEurosReporte(7965.86)}`, `MF ${formatEurosReporte(5067.47)}`],
        clase: 'text-slate-800',
      },
    ],
    feesPorArtista: [
      { artista: 'Bizza', booking: 7965.86, management: 5067.47 },
      { artista: 'Los Canarios', booking: 3890.0, management: 3248.15 },
      { artista: 'Aaron Martin', booking: 3896.33, management: 2084.0 },
      { artista: 'ART NO LOGIA', booking: 4067.28, management: 1402.78 },
      { artista: 'Sebastian Ledher', booking: 1802.68, management: 451.69 },
      { artista: 'Claudia Tejeda', booking: 1158.25, management: 966.6 },
      { artista: 'Brenda Serna', booking: 1820.0, management: 0.0 },
      { artista: 'Sera De Villalta', booking: 1615.61, management: 0.0 },
      { artista: 'Freddy Bello', booking: 840.0, management: 760.0 },
      { artista: 'Abdon', booking: 980.0, management: 560.0 },
      { artista: 'Marcel BS', booking: 820.0, management: 450.99 },
      { artista: 'Bassel Darwish', booking: 1195.28, management: 0.0 },
      { artista: 'Milan Torne', booking: 673.36, management: 219.51 },
      { artista: 'Marian Ariss', booking: 890.78, management: 0.0 },
      { artista: 'DH Moon', booking: 423.99, management: 379.19 },
      { artista: 'Gaston Zani', booking: 300.0, management: 300.0 },
      { artista: 'Vidaloca', booking: 300.0, management: 264.0 },
      { artista: 'Tomi & Kesh', booking: 520.0, management: 0.0 },
      { artista: 'Andrea Castells', booking: 400.0, management: 0.0 },
      { artista: 'Olivia Bass', booking: 400.0, management: 0.0 },
      { artista: 'Fran Hernandez', booking: 380.0, management: 0.0 },
      { artista: 'Jose Fajardo', booking: 340.0, management: 0.0 },
      { artista: 'Pau Guilera', booking: 320.0, management: 0.0 },
      { artista: 'Rivellino', booking: 230.0, management: 0.0 },
      { artista: 'ACA', booking: 200.0, management: 0.0 },
      { artista: 'Dhuna', booking: 200.0, management: 0.0 },
      { artista: 'Test Artist', booking: 200.0, management: 0.0 },
      { artista: 'Sergio Saffe', booking: 175.0, management: 0.0 },
    ],
    ticksFees: [0, 3500, 7000, 10500, 14000],
    totalBooking: 36004.43,
    totalManagement: 16154.38,
    kpisPorAgente: [
      { etiqueta: 'Total comisiones', valor: formatEurosReporte(9722.35), clase: 'text-brand-700' },
      {
        etiqueta: 'Agente top (comisión)',
        valor: 'Aldo Messina',
        pies: [formatEurosReporte(5598.85)],
        clase: 'text-slate-800',
      },
      {
        etiqueta: 'Más fechas cerradas',
        valor: 'Aldo Messina',
        pies: ['134 cierres'],
        clase: 'text-slate-800',
      },
      { etiqueta: 'Agentes activos', valor: '7', clase: 'text-slate-800' },
    ],
    ticksComision: [0, 1500, 3000, 4500, 6000],
    tablaAgentes: [
      {
        agente: 'Aldo Messina',
        cierres: 134,
        feeBruto: 104038.43,
        feeMedio: 776.41,
        bookingFees: 20730.44,
        comision: 5598.85,
      },
      {
        agente: 'Yenifer Bernardo',
        cierres: 69,
        feeBruto: 53241.27,
        feeMedio: 771.61,
        bookingFees: 10648.25,
        comision: 2917.06,
      },
      {
        agente: 'Alex González',
        cierres: 12,
        feeBruto: 13853.92,
        feeMedio: 1154.49,
        bookingFees: 2770.78,
        comision: 692.7,
      },
      {
        agente: 'Oscar Buch',
        cierres: 10,
        feeBruto: 7524.76,
        feeMedio: 752.48,
        bookingFees: 1504.95,
        comision: 376.24,
      },
      {
        agente: 'Patricia Pareja Casalí',
        cierres: 2,
        feeBruto: 1150.0,
        feeMedio: 575.0,
        bookingFees: 230.0,
        comision: 57.5,
      },
      {
        agente: 'Carlos Pego',
        cierres: 0,
        feeBruto: 0.0,
        feeMedio: 0.0,
        bookingFees: 0.0,
        comision: 50.0,
      },
      {
        agente: 'Jassi Gonzalez Montes',
        cierres: 1,
        feeBruto: 600.0,
        feeMedio: 600.0,
        bookingFees: 120.0,
        comision: 30.0,
      },
    ],
  },
  Todos: {
    kpisDashboard: [
      { etiqueta: 'Shows', valor: '251', clase: 'text-slate-800' },
      { etiqueta: 'Booking fees', valor: formatEurosReporte(42454.43), clase: 'text-brand-700' },
      { etiqueta: 'Management fees', valor: formatEurosReporte(17667.21), clase: 'text-brand-700' },
      { etiqueta: 'Total gastado', valor: formatEurosReporte(13309.12), clase: 'text-amber-600' },
      {
        etiqueta: 'Artista más rentable',
        valor: 'Bizza',
        pies: [`BF ${formatEurosReporte(8165.86)}`, `MF ${formatEurosReporte(5067.47)}`],
        clase: 'text-slate-800',
      },
    ],
    feesPorArtista: [
      { artista: 'Bizza', booking: 8165.86, management: 5067.47 },
      { artista: 'Los Canarios', booking: 5190.0, management: 4195.62 },
      { artista: 'Aaron Martin', booking: 3896.33, management: 2084.0 },
      { artista: 'ART NO LOGIA', booking: 4067.28, management: 1402.78 },
      { artista: 'Brenda Serna', booking: 3530.0, management: 0.0 },
      { artista: 'Sebastian Ledher', booking: 2242.68, management: 617.06 },
      { artista: 'Claudia Tejeda', booking: 1158.25, management: 966.6 },
      { artista: 'Marcel BS', booking: 1560.0, management: 450.99 },
      { artista: 'Sera De Villalta', booking: 1615.61, management: 0.0 },
      { artista: 'Freddy Bello', booking: 840.0, management: 760.0 },
      { artista: 'Abdon', booking: 980.0, management: 560.0 },
      { artista: 'Bassel Darwish', booking: 1195.28, management: 0.0 },
      { artista: 'Marian Ariss', booking: 1090.78, management: 0.0 },
      { artista: 'Tomi & Kesh', booking: 1080.0, management: 0.0 },
      { artista: 'Milan Torne', booking: 673.36, management: 219.51 },
      { artista: 'Rivellino', booking: 430.0, management: 400.0 },
      { artista: 'DH Moon', booking: 423.99, management: 379.19 },
      { artista: 'Pau Guilera', booking: 620.0, management: 0.0 },
      { artista: 'Gaston Zani', booking: 300.0, management: 300.0 },
      { artista: 'Vidaloca', booking: 300.0, management: 264.0 },
      { artista: 'Jose Fajardo', booking: 540.0, management: 0.0 },
      { artista: 'Andrea Castells', booking: 400.0, management: 0.0 },
      { artista: 'Olivia Bass', booking: 400.0, management: 0.0 },
      { artista: 'Fran Hernandez', booking: 380.0, management: 0.0 },
      { artista: 'Florentia', booking: 200.0, management: 0.0 },
      { artista: 'ACA', booking: 200.0, management: 0.0 },
      { artista: 'LA CINTIA', booking: 200.0, management: 0.0 },
      { artista: 'Dhuna', booking: 200.0, management: 0.0 },
      { artista: 'Londonground', booking: 200.0, management: 0.0 },
      { artista: 'Test Artist', booking: 200.0, management: 0.0 },
      { artista: 'Sergio Saffe', booking: 175.0, management: 0.0 },
    ],
    ticksFees: [0, 3500, 7000, 10500, 14000],
    totalBooking: 42454.43,
    totalManagement: 17667.21,
    kpisPorAgente: [
      {
        etiqueta: 'Total comisiones',
        valor: formatEurosReporte(11469.85),
        clase: 'text-brand-700',
      },
      {
        etiqueta: 'Agente top (comisión)',
        valor: 'Aldo Messina',
        pies: [formatEurosReporte(5808.85)],
        clase: 'text-slate-800',
      },
      {
        etiqueta: 'Más fechas cerradas',
        valor: 'Aldo Messina',
        pies: ['137 cierres'],
        clase: 'text-slate-800',
      },
      { etiqueta: 'Agentes activos', valor: '7', clase: 'text-slate-800' },
    ],
    ticksComision: [0, 1500, 3000, 4500, 6000],
    tablaAgentes: [
      {
        agente: 'Aldo Messina',
        cierres: 137,
        feeBruto: 106038.43,
        feeMedio: 774.0,
        bookingFees: 21130.44,
        comision: 5808.85,
      },
      {
        agente: 'Yenifer Bernardo',
        cierres: 83,
        feeBruto: 75891.27,
        feeMedio: 914.35,
        bookingFees: 15458.25,
        comision: 4144.56,
      },
      {
        agente: 'Alex González',
        cierres: 15,
        feeBruto: 18053.92,
        feeMedio: 1203.59,
        bookingFees: 3710.78,
        comision: 927.7,
      },
      {
        agente: 'Oscar Buch',
        cierres: 11,
        feeBruto: 8024.76,
        feeMedio: 729.52,
        bookingFees: 1604.95,
        comision: 401.24,
      },
      {
        agente: 'Patricia Pareja Casalí',
        cierres: 4,
        feeBruto: 3150.0,
        feeMedio: 787.5,
        bookingFees: 430.0,
        comision: 107.5,
      },
      {
        agente: 'Carlos Pego',
        cierres: 0,
        feeBruto: 0.0,
        feeMedio: 0.0,
        bookingFees: 0.0,
        comision: 50.0,
      },
      {
        agente: 'Jassi Gonzalez Montes',
        cierres: 1,
        feeBruto: 600.0,
        feeMedio: 600.0,
        bookingFees: 120.0,
        comision: 30.0,
      },
    ],
  },
};

export function datosReporte(estado: string): DatosReporte {
  return REPORTE_POR_ESTADO[estado] ?? REPORTE_POR_ESTADO[ESTADOS_REPORTE[0]];
}
