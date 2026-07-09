import { Card } from '@/components/ui';
import { eur } from '../data/format';
import type { MonthSales } from '../data/types';

function kLabel(value: number): string {
  if (value <= 0) return '·';
  return value >= 1000 ? `${Math.round(value / 1000)}K€` : `${Math.round(value)}€`;
}

export function SalesByMonthChart({ data, year }: { data: MonthSales[]; year: number }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <Card className="p-5">
      <h2 className="mb-6 text-xs font-semibold uppercase tracking-wide text-slate-400">Ventas facturadas por mes · {year}</h2>
      <div className="flex h-48 items-end gap-2">
        {data.map((m) => (
          <div key={m.label} className="flex flex-1 flex-col items-center gap-2">
            <span className="text-[10px] text-slate-400" title={eur(m.value)}>{kLabel(m.value)}</span>
            <div className="flex w-full flex-1 items-end">
              <div
                className="w-full rounded-t"
                style={{ height: `${(m.value / max) * 100}%`, backgroundColor: 'rgba(141,78,182,0.8)' }}
              />
            </div>
            <span className="text-xs text-slate-400">{m.label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
