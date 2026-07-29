import { cn } from '@/lib/utils';

export interface DeadlineBadgeProps {
  deadline: string;
  /**
   * Atrasada = deadline vencido y estado distinto de "Aprobado" (ver DD1 de la spec y el
   * hallazgo P2 del diff dirigido). En el live el badge sale rosa solo en ese caso; la
   * creatividad aprobada, aun con el deadline pasado, lo lleva en pizarra.
   */
  overdue?: boolean;
  className?: string;
}

/** Badge de deadline del live: rectángulo redondeado, no píldora (esa es la del estado). */
export function DeadlineBadge({ deadline, overdue, className }: DeadlineBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-semibold',
        overdue ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-600',
        className
      )}
    >
      {deadline}
    </span>
  );
}
