import { useState } from 'react';
import { Card } from '@/components/ui';
import { eur } from '../data/format';
import { orderSummary, phaseAccum, products, salesForYear } from '../data/seed';
import { PhaseAccumCards } from '../components/PhaseAccumCards';
import { TopProductsTable } from '../components/TopProductsTable';
import { StockAlerts } from '../components/StockAlerts';
import { SalesByMonthChart } from '../components/SalesByMonthChart';

const YEARS = [2023, 2024, 2025, 2026, 2027];

export function AnaliticaPage() {
  const [year, setYear] = useState(2026);

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Analítica CRUDA</h1>
          <p className="text-slate-500">Ventas, líneas de negocio, productos y stock.</p>
        </div>
        <select aria-label="Año" value={year} onChange={(e) => setYear(Number(e.target.value))}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800">
          {YEARS.map((y) => (<option key={y} value={y}>{y}</option>))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatBlock label="En curso (activos)" value={eur(orderSummary.activeAmount)} caption={`${orderSummary.activeCount} pedidos`} />
        <StatBlock label="Facturado (histórico)" value={eur(orderSummary.invoicedAmount)} valueClass="text-emerald-600" />
        <StatBlock label="Colección" value={eur(orderSummary.coleccionAmount)} caption="en curso" />
        <StatBlock label="Producción (custom)" value={eur(orderSummary.produccionAmount)} caption="en curso" />
      </div>

      <SalesByMonthChart data={salesForYear(year)} year={year} />

      <PhaseAccumCards items={phaseAccum} fullWidth />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TopProductsTable products={products} />
        <StockAlerts products={products} />
      </div>
    </div>
  );
}

function StatBlock({ label, value, caption, valueClass }: { label: string; value: string; caption?: string; valueClass?: string }) {
  return (
    <Card className="p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${valueClass ?? 'text-slate-800'}`}>{value}</p>
      {caption && <p className="mt-0.5 text-xs text-slate-400">{caption}</p>}
    </Card>
  );
}
