import { Badge } from '@/components/ui';
import type { BadgeProps } from '@/components/ui/Badge';

/**
 * «En producción» y «Cambios» estaban mal: el live los pinta en sky-100/700 y rose-100/700, no en
 * las variantes `info` (blue-50/700) y `danger` (red-50/700) que tenían aquí. Verificado con doble
 * medida (getComputedStyle + muestreo PIL) el 30-jul. Coinciden ya con el tablero compartido.
 */
const MAP: Record<string, BadgeProps['variant']> = {
  'En curso': 'info', 'En producción': 'sky', 'Activa': 'success',
  'Pausada': 'warning', 'Finalizada': 'success', 'Cancelada': 'danger', 'Planificada': 'neutral',
  'Briefing': 'neutral', 'Revisión': 'amber', 'Cambios': 'rose', 'Aprobado': 'emerald',
};

export function StatusChip({ status }: { status: string }) {
  return <Badge variant={MAP[status] ?? 'neutral'}>{status}</Badge>;
}
