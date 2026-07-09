import { Card, ProgressBar } from '@/components/ui';
import { cn } from '@/lib/utils';
import { eur } from '../data/format';
import type { PhaseAccum } from '../data/types';

interface Props {
  items: PhaseAccum[];
  /** When true, lay the cards out as a full-width responsive grid (Analítica). */
  fullWidth?: boolean;
  className?: string;
}

export function PhaseAccumCards({ items, fullWidth = false, className }: Props) {
  const max = Math.max(...items.map((i) => i.amount), 1);
  return (
    <div className={className}>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Dinero acumulado por fase</p>
      <div
        className={cn(
          fullWidth
            ? 'grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6'
            : 'flex gap-3 overflow-x-auto pb-1'
        )}
      >
        {items.map((item) => (
          <Card key={item.status} className={cn('p-4', !fullWidth && 'min-w-[180px] shrink-0')}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">{item.status}</span>
              <span className="text-xs text-slate-400">{item.count}</span>
            </div>
            <p className="mt-2 text-lg font-semibold text-slate-800">{eur(item.amount)}</p>
            <ProgressBar
              value={item.amount}
              max={max}
              className="mt-2 h-1.5"
              fillClassName="bg-brand-600"
            />
          </Card>
        ))}
      </div>
    </div>
  );
}
