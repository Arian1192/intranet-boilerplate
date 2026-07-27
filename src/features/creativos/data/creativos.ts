import type { BadgeProps } from '@/components/ui';
import type { CreativePiece, PiecePriority, PieceStatus } from './seed';

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
      return list.filter((p) => p.isOverdue);
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
    atrasadas: list.filter((p) => p.isOverdue).length,
  };
}
