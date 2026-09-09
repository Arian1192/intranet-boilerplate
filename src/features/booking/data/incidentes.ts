/**
 * Datos de `/management/incidentes`.
 *
 * Calcados de la evidencia `f1-management--incidentes*` (live capturado el
 * 2026-09-09 a las 10:09 CEST). Las cuatro vistas de la foto —tabla, tablero,
 * timeline y el despliegue de «+ Más filtros»— fijan literales, orden y colores.
 */

export type SeveridadIncidente = 'baja' | 'media' | 'alta' | 'critica';
export type EstadoIncidente = 'abierta' | 'en_curso' | 'bloqueada' | 'resuelta' | 'cerrada';
export type VistaIncidentes = 'tabla' | 'tablero' | 'timeline';

export interface Incidente {
  codigo: string;
  titulo: string;
  departamento: string;
  /** `null` se pinta como «—» en la tabla. */
  categoria: string | null;
  severidad: SeveridadIncidente;
  estado: EstadoIncidente;
  /** `null` se pinta como «Sin asignar». */
  owner: string | null;
  /** Fecha de reporte, la que agrupa el timeline. */
  fechaReporte: string;
  /** Lleva el candado 🔒 en la tabla. */
  confidencial: boolean;
  /**
   * `null` = «sin dato». La analítica dice «1 de 1 con dato», y esa única
   * clasificada es la séptima incidencia, que no sale en esta pantalla.
   */
  preventable: boolean | null;
  escalado: boolean;
  conRelacionados: boolean;
  /** La analítica del live da todo el impacto a cero: «Sin impacto registrado.». */
  impactoEconomico: number | null;
  /** Se lee del propio título; el live lo filtra aparte. */
  artista: string | null;
  /** Promotor, venue o proveedor. No es atribuible desde la foto. */
  contraparte: string | null;
}

export interface EstadoIncidenteMeta {
  valor: EstadoIncidente;
  etiqueta: string;
  badge: string;
}

/** Los cinco estados, en el orden de las columnas del tablero. */
export const ESTADOS_INCIDENTE: EstadoIncidenteMeta[] = [
  { valor: 'abierta', etiqueta: 'Abierta', badge: 'bg-amber-100 text-amber-700' },
  { valor: 'en_curso', etiqueta: 'En curso', badge: 'bg-sky-100 text-sky-700' },
  { valor: 'bloqueada', etiqueta: 'Bloqueada', badge: 'bg-rose-100 text-rose-700' },
  { valor: 'resuelta', etiqueta: 'Resuelta', badge: 'bg-emerald-100 text-emerald-700' },
  { valor: 'cerrada', etiqueta: 'Cerrada', badge: 'bg-slate-100 text-slate-500' },
];

export interface SeveridadIncidenteMeta {
  valor: SeveridadIncidente;
  etiqueta: string;
  badge: string;
  /** Punto de color del timeline. */
  punto: string;
}

/**
 * Las cuatro severidades en el orden del `<select>` del live.
 *
 * De la foto salen `media` (`bg-sky-100 text-sky-700`) y `alta`
 * (`bg-amber-100 text-amber-800`): son las únicas que aparecen en las 6 filas.
 * `baja` y `critica` **no se llegaron a ver** — se les da la rampa que el propio
 * live usa para «menos grave» y «más grave» en los estados (slate y rose).
 */
export const SEVERIDADES_INCIDENTE: SeveridadIncidenteMeta[] = [
  {
    valor: 'baja',
    etiqueta: 'Baja',
    badge: 'bg-slate-100 text-slate-500',
    punto: 'bg-slate-100',
  },
  { valor: 'media', etiqueta: 'Media', badge: 'bg-sky-100 text-sky-700', punto: 'bg-sky-100' },
  { valor: 'alta', etiqueta: 'Alta', badge: 'bg-amber-100 text-amber-800', punto: 'bg-amber-100' },
  {
    valor: 'critica',
    etiqueta: 'Crítica',
    badge: 'bg-rose-100 text-rose-700',
    punto: 'bg-rose-100',
  },
];

/** De menos a más grave, para ordenar la tabla por `SEVERIDAD ↓`. */
const PESO_SEVERIDAD: Record<SeveridadIncidente, number> = {
  baja: 0,
  media: 1,
  alta: 2,
  critica: 3,
};

export const CATEGORIAS_INCIDENTE: string[] = [
  'Viaje y logística',
  'Técnico y producción',
  'Contractual',
  'Pago',
  'Conducta del artista',
  'Conducta de promotor/comprador',
  'Venue y operaciones del evento',
  'Media y PR',
  'Staff e interno',
  'Legal y compliance',
  'Salud y seguridad',
];

export const OWNERS_INCIDENTE: string[] = [
  'Alba G',
  'Alberto Egea',
  'Aldo Messina',
  'Alex González',
  'Carlos Pego',
  'Fran Hinojosa Veredas',
  'Israel Cuenca',
  'Jack Howell',
  'Jassi Gonzalez Montes',
  'Joe Coe',
  'Juan (Staff Level Test)',
  'Maf',
  'Meritxell Pareja Casalí',
  'Oscar Buch',
  'Patricia Pareja Casalí',
  'Sadkiel',
  'test',
  'Tony Carrerira',
  'Yenifer Bernardo',
];

/** El desplegable `Departamento` que sólo asoma en la vista Timeline. */
export const DEPARTAMENTOS_INCIDENTE: string[] = [
  'ConceptOne (booking)',
  'ConceptOne (management)',
  'SIGHT',
  'KU Barcelona',
  'Pantheøn',
  'ETRA Agency',
  'Euphoric Media',
  'Mixmag España',
  'TAG Mag',
  'Blackmoose (grupo)',
];

export interface FiltroGuardado {
  id: string;
  etiqueta: string;
  /** `rose` es el único tono especial de la foto: «Sin asignar». */
  tono?: 'rose';
}

/**
 * Ocho filtros guardados. El noveno botón de la fila («Limpiar filtros») no es
 * un filtro guardado: es el que los quita.
 */
export const FILTROS_GUARDADOS: FiltroGuardado[] = [
  { id: 'sin-cerrar', etiqueta: 'Todas (sin cerrar)' },
  { id: 'mis-abiertos', etiqueta: 'Mis abiertos' },
  { id: 'sin-resolver-7', etiqueta: 'Sin resolver +7 días' },
  { id: 'criticos-altos', etiqueta: 'Críticos y Altos' },
  { id: 'sin-asignar', etiqueta: 'Sin asignar', tono: 'rose' },
  { id: 'este-mes', etiqueta: 'Este mes' },
  { id: 'preventables-90', etiqueta: 'Preventables 90 días' },
  { id: 'recurrentes', etiqueta: 'Recurrentes' },
];

/**
 * El live dice «6 de 7 incidentes»: hay una séptima que el filtro guardado por
 * defecto («Todas (sin cerrar)») deja fuera. De la analítica se sabe que está
 * cerrada, es de categoría `Pago`, severidad media, se resolvió en 3 días y es
 * la única clasificada como preventable — pero **su código y su título nunca se
 * vieron**, así que no se inventa una fila: el total va como constante y la
 * analítica lleva sus propias cifras.
 */
export const TOTAL_INCIDENTES = 7;

/** Fecha de la foto: es la que hace que las edades den 37d, 1d, 14d, 29d, 46d. */
export const HOY_INCIDENTES = '2026-09-09';

/**
 * Las 6 incidencias visibles, en código descendente — el orden natural del
 * live: la tabla lo reordena por severidad y el timeline por fecha, y ambos
 * ordenamientos son estables sobre éste.
 */
export const incidentes: Incidente[] = [
  {
    codigo: '#9',
    titulo: 'Vidaloca TIKTOK not sincronized correctly on songstats',
    departamento: 'ConceptOne (booking)',
    categoria: null,
    severidad: 'media',
    estado: 'abierta',
    owner: null,
    fechaReporte: '2026-09-08',
    confidencial: false,
    preventable: null,
    escalado: false,
    conRelacionados: false,
    impactoEconomico: null,
    artista: 'Vidaloca',
    contraparte: null,
  },
  {
    codigo: '#8',
    titulo: 'Incidencia · Brenda Serna @ Alcazar de San Juan',
    departamento: 'ConceptOne (booking)',
    categoria: null,
    severidad: 'media',
    estado: 'abierta',
    owner: null,
    fechaReporte: '2026-08-26',
    confidencial: false,
    preventable: null,
    escalado: false,
    conRelacionados: false,
    impactoEconomico: null,
    artista: 'Brenda Serna',
    contraparte: null,
  },
  {
    codigo: '#7',
    titulo: 'Flyer sin aprobar se sube',
    departamento: 'ConceptOne (booking)',
    categoria: 'Staff e interno',
    severidad: 'media',
    estado: 'abierta',
    owner: null,
    fechaReporte: '2026-08-11',
    confidencial: true,
    preventable: null,
    escalado: false,
    conRelacionados: false,
    impactoEconomico: null,
    artista: null,
    contraparte: null,
  },
  {
    codigo: '#6',
    titulo: 'LondonGround confusión de management fee',
    departamento: 'ConceptOne (booking)',
    categoria: 'Pago',
    severidad: 'media',
    estado: 'abierta',
    owner: null,
    fechaReporte: '2026-08-03',
    confidencial: false,
    preventable: null,
    escalado: false,
    conRelacionados: false,
    impactoEconomico: null,
    artista: 'Londonground',
    contraparte: null,
  },
  {
    codigo: '#5',
    titulo: 'La pareja de Jose Fajardo se ha peleado con la novia del promotor.',
    departamento: 'ConceptOne (booking)',
    categoria: 'Conducta del artista',
    severidad: 'alta',
    estado: 'abierta',
    owner: null,
    fechaReporte: '2026-08-03',
    confidencial: false,
    preventable: null,
    escalado: false,
    conRelacionados: false,
    impactoEconomico: null,
    artista: 'Jose Fajardo',
    contraparte: null,
  },
  {
    codigo: '#2',
    titulo: '(Test) Problema con la logística de Sebastian Ledher',
    departamento: 'ConceptOne (booking)',
    categoria: null,
    severidad: 'media',
    estado: 'abierta',
    owner: null,
    fechaReporte: '2026-07-25',
    confidencial: false,
    preventable: null,
    escalado: false,
    conRelacionados: false,
    impactoEconomico: null,
    artista: 'Sebastian Ledher',
    contraparte: null,
  },
];

const MESES_CORTOS = [
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

const MESES_LARGOS = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

/** '2026-09-08' → '08 sept 2026', como las fechas del timeline. */
export function formatFechaIncidente(iso: string): string {
  const [year, month, day] = iso.split('-');
  return `${day} ${MESES_CORTOS[Number(month) - 1]} ${year}`;
}

const MS_DIA = 24 * 60 * 60 * 1000;

export function edadDias(incidente: Incidente, hoy: string = HOY_INCIDENTES): number {
  return Math.round((Date.parse(hoy) - Date.parse(incidente.fechaReporte)) / MS_DIA);
}

export function etiquetaEdad(dias: number): string {
  return `${dias}d`;
}

/**
 * A partir de 15 días la edad va en rojo. El corte lo confirma el bloque
 * «ABIERTOS CON MÁS DE 14 DÍAS» de la analítica: entran 46d, 37d, 37d y 29d, y
 * se queda fuera la de 14d.
 */
export function edadEsVieja(dias: number): boolean {
  return dias > 14;
}

export interface FiltrosIncidentes {
  /** '' = Todos · '__abierto__' = Abiertos (sin resolver) · o un estado. */
  estado: '' | '__abierto__' | EstadoIncidente;
  severidad: '' | SeveridadIncidente;
  categoria: string;
  artista: string;
  owner: string;
  desde: string;
  hasta: string;
  texto: string;
  departamento: string;
  preventable: boolean;
  escalado: boolean;
  confidencial: boolean;
  conRelacionados: boolean;
  impactoMinimo: number | null;
}

export const FILTROS_INCIDENTES_VACIO: FiltrosIncidentes = {
  estado: '',
  severidad: '',
  categoria: '',
  artista: '',
  owner: '',
  desde: '',
  hasta: '',
  texto: '',
  departamento: '',
  preventable: false,
  escalado: false,
  confidencial: false,
  conRelacionados: false,
  impactoMinimo: null,
};

function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

const ESTADOS_SIN_RESOLVER: EstadoIncidente[] = ['abierta', 'en_curso', 'bloqueada'];

export function filterIncidentes(lista: Incidente[], filtros: FiltrosIncidentes): Incidente[] {
  return lista.filter((incidente) => {
    if (filtros.estado === '__abierto__') {
      if (!ESTADOS_SIN_RESOLVER.includes(incidente.estado)) return false;
    } else if (filtros.estado && incidente.estado !== filtros.estado) {
      return false;
    }
    if (filtros.severidad && incidente.severidad !== filtros.severidad) return false;
    if (filtros.categoria && incidente.categoria !== filtros.categoria) return false;
    if (filtros.departamento && incidente.departamento !== filtros.departamento) return false;
    if (filtros.owner && incidente.owner !== filtros.owner) return false;
    if (filtros.artista) {
      const artista = incidente.artista ? normalizar(incidente.artista) : '';
      if (!artista.includes(normalizar(filtros.artista))) return false;
    }
    if (filtros.desde && incidente.fechaReporte < filtros.desde) return false;
    if (filtros.hasta && incidente.fechaReporte > filtros.hasta) return false;
    if (filtros.texto) {
      const aguja = normalizar(filtros.texto);
      const pajar = normalizar(`${incidente.titulo} ${incidente.contraparte ?? ''}`);
      if (!pajar.includes(aguja)) return false;
    }
    if (filtros.preventable && incidente.preventable !== true) return false;
    if (filtros.escalado && !incidente.escalado) return false;
    if (filtros.confidencial && !incidente.confidencial) return false;
    if (filtros.conRelacionados && !incidente.conRelacionados) return false;
    if (filtros.impactoMinimo !== null) {
      if (incidente.impactoEconomico === null) return false;
      if (incidente.impactoEconomico < filtros.impactoMinimo) return false;
    }
    return true;
  });
}

/** `SEVERIDAD ↓`: primero las más graves, estable sobre el orden de origen. */
export function ordenarPorSeveridad(lista: Incidente[]): Incidente[] {
  return [...lista].sort((a, b) => PESO_SEVERIDAD[b.severidad] - PESO_SEVERIDAD[a.severidad]);
}

export interface ColumnaIncidentes {
  estado: EstadoIncidenteMeta;
  incidentes: Incidente[];
}

/** El tablero pinta siempre las cinco columnas; las vacías dicen «Vacío». */
export function agruparPorEstado(lista: Incidente[]): ColumnaIncidentes[] {
  const ordenadas = ordenarPorSeveridad(lista);
  return ESTADOS_INCIDENTE.map((estado) => ({
    estado,
    incidentes: ordenadas.filter((incidente) => incidente.estado === estado.valor),
  }));
}

export interface MesIncidentes {
  clave: string;
  /** 'septiembre de 2026'; el live lo sube con `capitalize`. */
  etiqueta: string;
  incidentes: Incidente[];
}

export function agruparPorMes(lista: Incidente[]): MesIncidentes[] {
  const porFecha = [...lista].sort((a, b) => {
    if (a.fechaReporte === b.fechaReporte) return 0;
    return a.fechaReporte < b.fechaReporte ? 1 : -1;
  });
  const meses: MesIncidentes[] = [];
  for (const incidente of porFecha) {
    const [year, month] = incidente.fechaReporte.split('-');
    const clave = `${year}-${month}`;
    let mes = meses.find((m) => m.clave === clave);
    if (!mes) {
      mes = {
        clave,
        etiqueta: `${MESES_LARGOS[Number(month) - 1]} de ${year}`,
        incidentes: [],
      };
      meses.push(mes);
    }
    mes.incidentes.push(incidente);
  }
  return meses;
}

export function severidadMeta(valor: SeveridadIncidente): SeveridadIncidenteMeta {
  return SEVERIDADES_INCIDENTE.find((s) => s.valor === valor)!;
}

export function estadoMeta(valor: EstadoIncidente): EstadoIncidenteMeta {
  return ESTADOS_INCIDENTE.find((e) => e.valor === valor)!;
}

/** El usuario de la sesión con la que se capturó el live. */
export const USUARIO_ACTUAL = 'test';

/**
 * Aplica uno de los ocho filtros guardados de la fila de píldoras.
 *
 * Sus criterios no son visibles en el DOM: se leen de su propia etiqueta, que
 * es lo único que da el live. Los cuatro que no dejan ninguna fila —«Mis
 * abiertos», «Preventables 90 días», «Recurrentes» y, con estos datos, también
 * «Sin asignar» al revés— salen así porque las seis incidencias visibles están
 * sin asignar, sin clasificar como preventables y sin contraparte atribuida.
 */
export function aplicarFiltroGuardado(
  lista: Incidente[],
  id: string | null,
  hoy: string = HOY_INCIDENTES
): Incidente[] {
  if (!id) return lista;
  const sinResolver = (i: Incidente) => ESTADOS_SIN_RESOLVER.includes(i.estado);
  switch (id) {
    case 'sin-cerrar':
      return lista.filter((i) => i.estado !== 'cerrada');
    case 'mis-abiertos':
      return lista.filter((i) => sinResolver(i) && i.owner === USUARIO_ACTUAL);
    case 'sin-resolver-7':
      return lista.filter((i) => sinResolver(i) && edadDias(i, hoy) > 7);
    case 'criticos-altos':
      return lista.filter((i) => i.severidad === 'alta' || i.severidad === 'critica');
    case 'sin-asignar':
      return lista.filter((i) => i.owner === null);
    case 'este-mes':
      return lista.filter((i) => i.fechaReporte.slice(0, 7) === hoy.slice(0, 7));
    case 'preventables-90':
      return lista.filter((i) => i.preventable === true && edadDias(i, hoy) <= 90);
    case 'recurrentes': {
      const veces = new Map<string, number>();
      for (const i of lista) {
        if (i.contraparte) veces.set(i.contraparte, (veces.get(i.contraparte) ?? 0) + 1);
      }
      return lista.filter((i) => i.contraparte !== null && (veces.get(i.contraparte) ?? 0) > 1);
    }
    default:
      return lista;
  }
}
