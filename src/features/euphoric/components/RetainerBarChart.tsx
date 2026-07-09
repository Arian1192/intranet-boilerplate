import { formatCurrencyEs } from '../data/format';

const TICK_COUNT = 5;

export interface RetainerBarChartDatum {
  label: string;
  value: number;
}

export interface RetainerBarChartProps {
  data: RetainerBarChartDatum[];
  max: number;
}

/**
 * Single-series column chart: one bar per account, rose accent, dotted
 * gridlines, currency-formatted axis. No legend needed (one series — the
 * panel title already names what's plotted), per the dataviz skill.
 */
export function RetainerBarChart({ data, max }: RetainerBarChartProps) {
  const ticks = Array.from({ length: TICK_COUNT }, (_, i) => (max * (TICK_COUNT - 1 - i)) / (TICK_COUNT - 1));
  const summary = data.map((item) => `${item.label}: ${formatCurrencyEs(item.value)}`).join(', ');

  return (
    <div
      className="flex h-64 gap-3"
      role="img"
      aria-label={`Retainer mensual por cuenta. ${summary || 'Sin datos.'}`}
    >
      <div className="flex w-20 shrink-0 flex-col justify-between py-1 text-right text-xs tabular-nums text-slate-400">
        {ticks.map((tick) => (
          <span key={tick}>{formatCurrencyEs(tick)}</span>
        ))}
      </div>
      <div className="relative flex flex-1 items-end gap-8 border-l border-slate-100 pl-4">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex flex-col justify-between py-1">
          {ticks.map((tick) => (
            <div key={tick} className="border-t border-dotted border-slate-300" />
          ))}
        </div>
        {data.map((item) => {
          const heightPct = max > 0 ? Math.min(Math.max((item.value / max) * 100, 0), 100) : 0;
          return (
            <div key={item.label} className="relative z-10 flex h-full w-16 flex-col items-center justify-end gap-2">
              <span className="text-xs font-medium tabular-nums text-slate-600">{formatCurrencyEs(item.value)}</span>
              <div
                className="w-6 rounded-t-[4px] bg-rose-500"
                style={{ height: `${heightPct}%` }}
                title={`${item.label}: ${formatCurrencyEs(item.value)}`}
              />
              <span className="text-xs font-medium text-slate-500 -rotate-45">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
