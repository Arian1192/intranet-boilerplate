import { Plug } from 'lucide-react';
import { formatCurrency, formatCurrencyPrecise } from '@/lib/format';
import type { Integration, IntegrationUsageSnapshot } from '../data/uso';

const DOT: Record<Integration['statusDot'], string> = {
  green: 'bg-emerald-500',
  amber: 'bg-amber-500',
  red: 'bg-rose-500',
  slate: 'bg-slate-300',
};

export interface IntegrationRowProps {
  integration: Integration;
  snapshot?: IntegrationUsageSnapshot;
}

export function IntegrationRow({ integration, snapshot }: IntegrationRowProps) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-50 text-slate-400">
          <Plug className="h-4 w-4" />
        </span>
        <span className={`h-2 w-2 shrink-0 rounded-full ${DOT[integration.statusDot]}`} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-800">{integration.name}</span>
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
              {integration.pricingModel === 'cuota' ? `cuota ${formatCurrency(integration.monthlyFee ?? 0)}/mes` : 'por uso'}
            </span>
          </div>
          <p className="truncate text-sm text-slate-400">
            {integration.provider} · {integration.statusLabel}
          </p>
          {snapshot?.includedNote && <p className="text-xs text-slate-400">{snapshot.includedNote}</p>}
        </div>
        <div className="flex shrink-0 items-start gap-6 text-right">
          {snapshot?.usos !== undefined && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Usos</p>
              <p className="font-semibold text-slate-800">{snapshot.usos}</p>
            </div>
          )}
          {snapshot?.tarda && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Tarda</p>
              <p className="font-semibold text-slate-800">{snapshot.tarda}</p>
            </div>
          )}
          {snapshot?.errors !== undefined && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Errores</p>
              <p className="font-semibold text-rose-600">{snapshot.errors}</p>
            </div>
          )}
          {snapshot?.tokensLabel && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Tokens</p>
              <p className="font-semibold text-slate-800">{snapshot.tokensLabel}</p>
            </div>
          )}
          {snapshot?.spend !== undefined && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Gasto</p>
              <p className="font-semibold text-slate-800">
                {integration.id === 'ia'
                  ? formatCurrencyPrecise(snapshot.spend, 4)
                  : formatCurrency(snapshot.spend)}
              </p>
            </div>
          )}
          {snapshot && 'perUse' in snapshot && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Por uso</p>
              <p className="font-semibold text-slate-800">
                {snapshot.perUse == null ? '—' : snapshot.perUse < 1 ? formatCurrencyPrecise(snapshot.perUse, 4) : formatCurrency(snapshot.perUse)}
              </p>
            </div>
          )}
        </div>
      </div>
      {integration.subfunctions && (
        <div className="mt-3 space-y-1.5 border-t border-slate-50 pt-3">
          {integration.subfunctions.map((s) => (
            <div key={s.id} className="flex flex-wrap items-center justify-between text-sm">
              <span className="text-slate-700">
                {s.label} <span className="text-xs text-slate-400">{s.model}</span>
              </span>
              <span className="flex items-center gap-4 text-slate-500">
                <span>{s.usos} usos</span>
                <span>{s.tokensIn} → {s.tokensOut}</span>
                <span className="font-medium text-slate-700">{formatCurrencyPrecise(s.spend, 4)}</span>
              </span>
            </div>
          ))}
        </div>
      )}
      {integration.detailRows && (
        <div className="mt-3 divide-y divide-slate-50 border-t border-slate-50 pt-2">
          {integration.detailRows.map((row) => (
            <div key={row.id} className="flex flex-wrap items-center justify-between gap-3 py-1.5 text-sm">
              <span className="text-slate-700">
                {row.label} <span className="text-slate-400">—</span>
              </span>
              <span className="flex items-center gap-5 text-slate-500">
                {row.usos !== undefined && <span>{row.usos} usos</span>}
                {row.errors !== undefined && <span className="text-rose-600">{row.errors} err.</span>}
                {row.spend !== undefined && <span className="font-medium text-slate-700">{formatCurrency(row.spend)}</span>}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
