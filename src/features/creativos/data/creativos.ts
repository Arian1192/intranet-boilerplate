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
