import { useNavigate } from 'react-router';
import { formatCurrency } from '@/lib/format';
import type { Kpi } from '@/types';
import { etapaLabel } from '../data/etapaLabels';

export interface KpiCardProps {
  kpi: Kpi;
}

const statusStyles: Record<Kpi['status'], string> = {
  tentative: 'bg-slate-500',
  offer: 'bg-sky-400',
  confirmed: 'bg-sky-500',
  contract: 'bg-amber-500',
  'pending-payment': 'bg-rose-500',
  'pending-settlement': 'bg-indigo-600',
  done: 'bg-emerald-600',
};

/**
 * Los tiles de la tira de pipeline del dashboard.
 *
 * Recalco del 2026-09-09: el live los pinta con el rótulo **arriba y el importe
 * debajo** —de ahí el `lg:flex-col-reverse`— y el recuento **pegado al importe
 * en la misma línea, como `· 100`**, no en una línea aparte diciendo «100
 * shows». Los seis colores ya coincidían.
 */
export function KpiCard({ kpi }: KpiCardProps) {
  const navigate = useNavigate();
  const label = etapaLabel(kpi.status);

  return (
    <button
      type="button"
      title={`Ver shows en ${label}`}
      className={`flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-white transition-transform hover:-translate-y-0.5 lg:flex-col-reverse lg:items-start ${statusStyles[kpi.status]}`}
      onClick={() => navigate(`/shows?status=${kpi.status}`)}
    >
      <div className="text-[11px] font-medium uppercase tracking-wide opacity-90">{label}</div>
      <div className="shrink-0 whitespace-nowrap text-right lg:text-left">
        <span className="text-lg font-bold leading-tight">{formatCurrency(kpi.amount)}</span>
        <span className="ml-1 text-[11px] opacity-80">· {kpi.count}</span>
      </div>
    </button>
  );
}
