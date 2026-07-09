import { Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { OrderStatus } from '../data/types';
import type { BadgeProps } from '@/components/ui/Badge';

const VARIANT: Partial<Record<OrderStatus, BadgeProps['variant']>> = {
  Borrador: 'neutral',
  Confirmado: 'blue',
  'En producción': 'amber',
  Enviado: 'indigo',
  Entregado: 'emerald',
};

export function CrudaStatusChip({ status }: { status: OrderStatus }) {
  if (status === 'Facturado') {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-600 px-2.5 py-0.5 text-xs font-medium text-white">
        Facturado
      </span>
    );
  }
  if (status === 'Cancelado' || status === 'Anulado') {
    return (
      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-400">
        {status}
      </span>
    );
  }
  // Borrador must be slate-200 / slate-700 (not the lighter neutral default).
  if (status === 'Borrador') {
    return (
      <span className="inline-flex items-center rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-700">
        Borrador
      </span>
    );
  }
  return <Badge variant={VARIANT[status] ?? 'neutral'} className={cn()}>{status}</Badge>;
}
