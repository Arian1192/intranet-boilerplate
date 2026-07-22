export type IncidenciaEstado = 'nueva' | 'auto' | 'en_curso' | 'resuelta' | 'descartada';
export type IncidenciaTipo = 'idea';

export interface Incidencia {
  id: string;
  estado: IncidenciaEstado;
  tipo?: IncidenciaTipo;
  texto: string;
  hasAttachment: boolean;
  routePath: string;
  reporterName?: string;
  reporterInitials?: string;
  reporterColor?: string;
}

export const INCIDENCIA_ESTADOS: { id: IncidenciaEstado; label: string }[] = [
  { id: 'nueva', label: 'NUEVAS' },
  { id: 'auto', label: 'AUTO' },
  { id: 'en_curso', label: 'EN CURSO' },
  { id: 'resuelta', label: 'RESUELTAS' },
  { id: 'descartada', label: 'DESCARTADAS' },
];

// Seed exacto del live (orden de llegada, sin filtrar). reporterName/Initials/Color
// denormalizados desde una futura tabla `users` (FK conceptual reporterId no confirmable
// sin datos adicionales del live); ausentes = reportante anónimo/desconocido.
const incidencias: Incidencia[] = [
  {
    id: 'inc-1',
    estado: 'descartada',
    tipo: 'idea',
    texto:
      'viendo como crear un cliente y pone una dirección de correo. Puede haber más de un contacto, si es Marketing, Dirección o administración?',
    hasAttachment: false,
    routePath: '/',
    reporterName: 'Fran Hinojosa Veredas',
    reporterInitials: 'FV',
    reporterColor: '#EA580C',
  },
  {
    id: 'inc-2',
    estado: 'resuelta',
    texto:
      'Me gustaría hacer la solicitud de 2 cosas: 1. Que se pudiera crear un nuevo evento haciendo clic en el calendario, 2. opción de catalán, 3. arreglar generación de copys por IA',
    hasAttachment: true,
    routePath: '/euphoric/calendario',
    reporterName: 'Alba Gelabert',
    reporterInitials: 'AG',
    reporterColor: '#16A34A',
  },
  {
    id: 'inc-3',
    estado: 'descartada',
    tipo: 'idea',
    texto:
      'Me gustaría hacer la solicitud de 2 cosas: 1. Que se pudiera crear un nuevo evento haciendo clic en el calendario, 2. opción de catalán',
    hasAttachment: false,
    routePath: '/',
    reporterName: 'Alba Gelabert',
    reporterInitials: 'AG',
    reporterColor: '#16A34A',
  },
  {
    id: 'inc-4',
    estado: 'descartada',
    texto: 'Esto debería estar enlazado con no...',
    hasAttachment: true,
    routePath: '/euphoric/campanas',
  },
  {
    id: 'inc-5',
    estado: 'nueva',
    tipo: 'idea',
    texto: 'En el apartat de contactes del Signer/Buyer molaria afegir la opcio de posar TEL',
    hasAttachment: false,
    routePath: '/shows/nuevo',
    reporterName: 'JC',
    reporterInitials: 'JC',
    reporterColor: '#2563EB',
  },
  {
    id: 'inc-6',
    estado: 'descartada',
    tipo: 'idea',
    texto: 'Esto podrías darle color por favor, en cada pestaña igual.',
    hasAttachment: true,
    routePath: '/shows/95a152d1-d546-400b-904d-195f84400c66',
  },
  {
    id: 'inc-7',
    estado: 'resuelta',
    tipo: 'idea',
    texto:
      'En logística del deal si se selecciona traslados internos tiene que salir siempre predefinido coche privado',
    hasAttachment: true,
    routePath: '/shows/08ea3304-af17-4722-84d5-d3b63347fe74',
  },
  {
    id: 'inc-8',
    estado: 'auto',
    tipo: 'idea',
    texto: '¿por qué no puedo seleccionar ida y vuelta en la estimación de vuelo?',
    hasAttachment: false,
    routePath: '/shows/08ea3304-af17-4722-84d5-d3b63347fe74',
  },
];

export function listIncidencias(): Incidencia[] {
  return incidencias.map((i) => ({ ...i }));
}

export function countByEstado(list: Incidencia[]): Record<IncidenciaEstado, number> {
  const out: Record<IncidenciaEstado, number> = { nueva: 0, auto: 0, en_curso: 0, resuelta: 0, descartada: 0 };
  list.forEach((i) => {
    out[i.estado] += 1;
  });
  return out;
}

export function filterByEstado(list: Incidencia[], estado: IncidenciaEstado | null): Incidencia[] {
  if (estado === null) return [...list];
  return list.filter((i) => i.estado === estado);
}
