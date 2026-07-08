import { formatCurrency } from '@/lib/format';
import type { Kpi } from '@/types';

export interface KpiCardProps {
  kpi: Kpi;
}

const statusStyles: Record<Kpi['status'], string> = {
  tentative: 'bg-slate-500',
  offer: 'bg-sky-400',
  confirmed: 'bg-sky-500',
  contract: 'bg-blue-500',
  'pending-payment': 'bg-rose-500',
  'pending-settlement': 'bg-indigo-500',
  done: 'bg-emerald-500',
};

export function KpiCard({ kpi }: KpiCardProps) {
  return (
    <div className={`flex min-h-20 flex-col justify-between rounded-xl p-4 text-white ${statusStyles[kpi.status]}`}>
      <p className="text-lg font-semibold leading-normal">{formatCurrency(kpi.amount)}</p>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide">{kpi.label}</p>
        <p className="text-xs opacity-90">{kpi.count} shows</p>
      </div>
    </div>
  );
}
