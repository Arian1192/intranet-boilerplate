import { Card } from '@/components/ui';
import { eur } from '../data/format';
import type { OrderSummary } from '../data/types';

export function OrderSummaryPanel({ summary }: { summary: OrderSummary }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card className="p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">En curso (activos)</p>
        <p className="mt-2 text-2xl font-semibold text-slate-800">{eur(summary.activeAmount)}</p>
        <p className="mt-0.5 text-xs text-slate-400">{summary.activeCount} pedidos</p>
      </Card>
      <Card className="p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Facturado</p>
        <p className="mt-2 text-2xl font-semibold text-emerald-600">{eur(summary.invoicedAmount)}</p>
      </Card>
      <Card className="p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Por línea de negocio</p>
        <p className="mt-2 text-sm text-slate-600">
          Colección <span className="font-semibold text-slate-800">{eur(summary.coleccionAmount)}</span>
        </p>
        <p className="text-sm text-slate-600">
          Producción <span className="font-semibold text-slate-800">{eur(summary.produccionAmount)}</span>
        </p>
      </Card>
    </div>
  );
}
