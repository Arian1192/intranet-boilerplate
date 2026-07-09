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
 * Single-series column chart: one wide bar per account, pink-600 accent,
 * dashed horizontal + vertical gridlines, currency-formatted axis. No
 * legend needed (one series — the panel title already names what's
 * plotted), per the dataviz skill.
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
      <div className="relative flex flex-1 items-end gap-8 pl-4">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex flex-col justify-between py-1">
          {ticks.map((tick) => (
            <div key={tick} className="border-t border-dashed border-[#f1f5f9]" />
          ))}
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex justify-between">
          <div className="h-full border-l border-dashed border-[#f1f5f9]" />
          <div className="h-full border-l border-dashed border-[#f1f5f9]" />
          <div className="h-full border-l border-dashed border-[#f1f5f9]" />
        </div>
        {data.map((item) => {
          const heightPct = max > 0 ? Math.min(Math.max((item.value / max) * 100, 0), 100) : 0;
          return (
            <div key={item.label} className="relative z-10 flex h-full flex-1 flex-col items-center justify-end gap-2">
              <span className="text-xs font-medium tabular-nums text-slate-600">{formatCurrencyEs(item.value)}</span>
              <div
                className="w-3/4 bg-[#db2777]"
                style={{ height: `${heightPct}%` }}
                title={`${item.label}: ${formatCurrencyEs(item.value)}`}
              />
              <span className="origin-right -rotate-[20deg] text-right text-xs text-slate-500">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
