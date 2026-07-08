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
    <div className={`flex h-[76px] flex-col justify-between rounded-[10px] px-3 py-2.5 text-white ${statusStyles[kpi.status]}`}>
      <p className="text-xl font-semibold leading-6">{formatCurrency(kpi.amount)}</p>
      <div>
        <p className="text-xs font-medium uppercase leading-4 tracking-wide">{kpi.label}</p>
        <p className="text-xs leading-4 opacity-90">{kpi.count} shows</p>
      </div>
    </div>
  );
}
