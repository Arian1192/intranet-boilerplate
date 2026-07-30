import { cn } from '@/lib/utils';
import type { TonoDeadline } from '../data/tablero';

export interface DeadlineBadgeProps {
  deadline: string;
  tono: TonoDeadline;
  /** El live usa 11px en la tarjeta y 12px en la tabla; el resto es idéntico. */
  size?: 'card' | 'table';
}

/**
 * Badge de deadline: rectángulo redondeado, no píldora (esa es la del estado).
 * Cuatro tonos, verificados contra `docs/references/tablero-piezas-2026-07-30/kanban-detalle.json`.
 * Ojo con `proximo`: el texto es **amber-800**, no el amber-700 de las pastillas de estado.
 */
const TONO: Record<TonoDeadline, string> = {
  vencido: 'bg-rose-100 text-rose-700',
  proximo: 'bg-amber-100 text-amber-800',
  holgado: 'bg-emerald-100 text-emerald-700',
  'sin-urgencia': 'bg-slate-100 text-slate-500',
};

export function DeadlineBadge({ deadline, tono, size = 'card' }: DeadlineBadgeProps) {
  return (
    <span
      className={cn(
        'rounded px-1.5 py-0.5 font-semibold',
        size === 'card' ? 'text-[11px]' : 'text-xs',
        TONO[tono]
      )}
    >
      {deadline}
    </span>
  );
}
