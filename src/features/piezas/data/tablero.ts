import type { BadgeProps } from '@/components/ui';
import type { AprobacionCliente, CreativePiece, PiecePriority, PieceStatus } from './seed';

export type CreativosFilter =
  | 'Todas' | 'Mías' | 'Diseño' | 'Vídeo' | 'Pend. aprobar' | 'Correcciones' | 'Atrasadas';

export const FILTERS: CreativosFilter[] = [
  'Todas', 'Mías', 'Diseño', 'Vídeo', 'Pend. aprobar', 'Correcciones', 'Atrasadas',
];

export const STATUS_COLUMNS: PieceStatus[] = [
  'Briefing', 'En producción', 'Revisión', 'Cambios', 'Aprobado',
];

export const STATUS_VARIANT: Record<PieceStatus, BadgeProps['variant']> = {
  'Briefing': 'neutral',
  'En producción': 'sky',
  'Revisión': 'amber',
  'Cambios': 'rose',
  'Aprobado': 'emerald',
};

export const PRIORITY_VARIANT: Record<PiecePriority, BadgeProps['variant']> = {
  'Alta': 'rose',
  'Media': 'amber',
  'Baja': 'neutral',
};

export const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const MONTH_ABBR_ES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

/**
 * Pasa el deadline tal y como lo escribe el live (`10 jul 2026`) a ISO (`2026-07-10`), que es
 * la clave con la que la rejilla de Euphoric identifica cada día. Devuelve `null` si no encaja.
 */
export function deadlineToIso(deadline: string): string | null {
  const match = /^(\d{1,2})\s+([a-zá-ú]{3})\.?\s+(\d{4})$/i.exec(deadline.trim());
  if (!match) return null;
  const month = MONTH_ABBR_ES.indexOf(match[2].toLowerCase());
  if (month < 0) return null;
  return `${match[3]}-${String(month + 1).padStart(2, '0')}-${match[1].padStart(2, '0')}`;
}

/**
 * Fecha a la que se fija el calco. El live deriva en horas, así que el tablero se pinta contra la
 * foto del barrido (30-jul-2026) y no contra `new Date()`: si no, los tonos del deadline cambiarían
 * solos y los tests dejarían de ser deterministas. Mismo criterio que ya usaba euphoric con su
 * `todayIso`.
 */
export const HOY_ISO = '2026-07-30';

export type TonoDeadline = 'vencido' | 'proximo' | 'holgado' | 'sin-urgencia';

/**
 * Días que el live considera «próximo». **No es derivable de la captura**: el único par que lo
 * acota es `04 ago` (+5 días, ámbar) frente a `11 ago` (+12 días, esmeralda), así que el umbral
 * está en algún punto entre 6 y 11. Se elige 7 por ser el corte natural de una semana y queda
 * declarado como supuesto: si aparece evidencia, se ajusta aquí.
 */
const DIAS_PROXIMO = 7;

/**
 * Tono del badge de deadline. Verificado contra las 10 tarjetas de
 * `docs/references/tablero-piezas-2026-07-30/kanban-detalle.json`: los 3 «sin urgencia» del live
 * son exactamente las 3 creatividades **Aprobado**, dos de ellas con el deadline ya pasado — o
 * sea que aprobar anula la urgencia, gane o no la fecha.
 */
export function tonoDeadline(piece: Pick<CreativePiece, 'deadline' | 'status'>): TonoDeadline {
  if (piece.status === 'Aprobado') return 'sin-urgencia';
  const iso = deadlineToIso(piece.deadline);
  if (iso === null) return 'sin-urgencia';
  if (iso < HOY_ISO) return 'vencido';
  const dias = Math.round(
    (Date.parse(`${iso}T00:00:00Z`) - Date.parse(`${HOY_ISO}T00:00:00Z`)) / 86_400_000
  );
  return dias <= DIAS_PROXIMO ? 'proximo' : 'holgado';
}

/** Valor por defecto de la aprobación: el live lo trae preseleccionado en el panel de alta. */
export const APROBACION_DEFECTO: AprobacionCliente = 'Sin enviar';

/** Resuelve la aprobación de una pieza. Úsalo siempre en vez de leer el campo a pelo. */
export function aprobacion(piece: Pick<CreativePiece, 'clientApproval'>): AprobacionCliente {
  return piece.clientApproval ?? APROBACION_DEFECTO;
}

/**
 * `'Sin enviar'` no pinta badge: en la tarjeta no aparece nada y en la tabla sale la raya.
 * Los otros tres sí lo pintan.
 *
 * SUPUESTO DECLARADO: de los tres valores «positivos», el live solo nos ha enseñado
 * `'Pendiente cliente'`, en ámbar. `'Aprobado cliente'` y `'Cambios cliente'` no aparecen en
 * ninguna de las 10 creatividades capturadas, así que **su color no está verificado** y de momento
 * heredan el mismo ámbar. Si aparece evidencia de que llevan tono propio, se ajusta aquí.
 */
export function pintaAprobacion(piece: Pick<CreativePiece, 'clientApproval'>): boolean {
  return aprobacion(piece) !== APROBACION_DEFECTO;
}

/** Atrasada = el badge sale en rojo. Es la misma cuenta que el live pinta en el indicador. */
export function isOverdue(piece: Pick<CreativePiece, 'deadline' | 'status'>): boolean {
  return tonoDeadline(piece) === 'vencido';
}

export function filterPieces(
  list: CreativePiece[],
  filter: CreativosFilter,
  currentUser: string,
): CreativePiece[] {
  switch (filter) {
    case 'Mías':
      return list.filter((p) => p.assignee === currentUser);
    case 'Diseño':
      return list.filter((p) => p.type !== 'Vídeo');
    case 'Vídeo':
      return list.filter((p) => p.type === 'Vídeo');
    case 'Pend. aprobar':
      return list.filter((p) => p.status === 'Revisión');
    case 'Correcciones':
      return list.filter((p) => p.status === 'Cambios');
    case 'Atrasadas':
      return list.filter(isOverdue);
    case 'Todas':
    default:
      return list;
  }
}

export function groupByStatus(list: CreativePiece[]): Record<PieceStatus, CreativePiece[]> {
  const groups = {} as Record<PieceStatus, CreativePiece[]>;
  STATUS_COLUMNS.forEach((s) => (groups[s] = []));
  list.forEach((p) => groups[p.status].push(p));
  return groups;
}

export function deriveStats(list: CreativePiece[]) {
  return {
    activas: list.filter((p) => p.status !== 'Aprobado').length,
    pendAprobar: list.filter((p) => p.status === 'Revisión').length,
    correcciones: list.filter((p) => p.status === 'Cambios').length,
    atrasadas: list.filter(isOverdue).length,
  };
}
