import { Badge } from '@/components/ui';
import type { BadgeProps } from '@/components/ui/Badge';

const MAP: Record<string, BadgeProps['variant']> = {
  'En curso': 'info', 'En producción': 'info', 'Activa': 'success',
  'Pausada': 'warning', 'Finalizada': 'success', 'Cancelada': 'danger', 'Planificada': 'neutral',
};

export function StatusChip({ status }: { status: string }) {
  return <Badge variant={MAP[status] ?? 'neutral'}>{status}</Badge>;
}
