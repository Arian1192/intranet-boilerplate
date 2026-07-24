import { cn } from '@/lib/utils';
import type { PaymentStatus } from '@/types';

const pagoChip: Record<PaymentStatus, string> = {
  'No abonado': 'bg-slate-100 text-slate-500',
  'Parcialmente abonado': 'bg-amber-50 text-amber-700',
  'Pendiente liquidar': 'bg-indigo-50 text-indigo-700',
  Liquidado: 'bg-green-50 text-green-700',
  Incidencia: 'bg-red-50 text-red-700',
};

export interface PaymentChipProps {
  status: PaymentStatus;
  className?: string;
}

export function PaymentChip({ status, className }: PaymentChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        pagoChip[status],
        className
      )}
    >
      {status}
    </span>
  );
}
