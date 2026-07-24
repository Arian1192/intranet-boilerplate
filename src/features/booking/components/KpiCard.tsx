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
  contract: 'bg-blue-500',
  'pending-payment': 'bg-rose-500',
  'pending-settlement': 'bg-indigo-600',
  done: 'bg-emerald-600',
};

export function KpiCard({ kpi }: KpiCardProps) {
  const navigate = useNavigate();
  const label = etapaLabel(kpi.status);

  return (
    <button
      type="button"
      title={`Ver shows en ${label}`}
      className={`rounded-xl px-3 py-2.5 text-left text-white transition-transform hover:-translate-y-0.5 ${statusStyles[kpi.status]}`}
      onClick={() => navigate(`/shows?status=${kpi.status}`)}
    >
      <div className="text-lg font-bold leading-tight">{formatCurrency(kpi.amount)}</div>
      <div className="text-[11px] font-medium uppercase tracking-wide opacity-90">{label}</div>
      <div className="text-[11px] opacity-80">
        {kpi.count} {kpi.count === 1 ? 'show' : 'shows'}
      </div>
    </button>
  );
}
