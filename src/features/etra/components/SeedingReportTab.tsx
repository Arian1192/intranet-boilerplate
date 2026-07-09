import { Input, Button, StatCard } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import type { SeedingReportRow } from '@/types';

export function SeedingReportTab({ rows }: { rows: SeedingReportRow[] }) {
  const pieces = rows.reduce((sum, row) => sum + row.pieces, 0);
  const productCost = rows.reduce((sum, row) => sum + row.productCost, 0);
  const shippingCost = rows.reduce((sum, row) => sum + row.shippingCost, 0);
  const published = rows.filter((row) => row.publicationStatus === 'Publicado').length;
  const returnPct = rows.length > 0 ? Math.round((published / rows.length) * 100) : 0;
  const reach = rows.reduce((sum, row) => sum + (row.reach ?? 0), 0);
  const costPerPublication = published > 0 ? (productCost + shippingCost) / published : 0;
  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-4">
        <div className="w-56">
          <Input label="Cliente" placeholder="Todos los clientes..." />
        </div>
        <div className="w-40">
          <Input label="Desde" type="date" defaultValue={`${currentYear}-01-01`} />
        </div>
        <div className="w-40">
          <Input label="Hasta" type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
        </div>
        <div className="ml-auto">
          <Button size="sm">Exportar PDF</Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="ENVÍOS" value={String(rows.length)} caption={`${pieces} piezas`} />
        <StatCard label="COSTE PRODUCTO REGALADO" value={formatCurrency(productCost)} />
        <StatCard label="GASTO MRW" value={formatCurrency(shippingCost)} caption={`Total ${formatCurrency(shippingCost)}`} />
        <StatCard
          label="RETORNO"
          value={`${returnPct}%`}
          valueClassName="text-emerald-600"
          caption={`${published} de ${rows.length} publicados`}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="ALCANCE TOTAL" value={String(reach)} />
        <StatCard label="COSTE POR PUBLICACIÓN" value={formatCurrency(costPerPublication)} />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-medium uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Influencer</th>
              <th className="px-4 py-3 text-right">Piezas</th>
              <th className="px-4 py-3 text-right">Coste prod.</th>
              <th className="px-4 py-3 text-right">Envío</th>
              <th className="px-4 py-3">Publicación</th>
              <th className="px-4 py-3 text-right">Alcance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, index) => (
              <tr key={index}>
                <td className="px-4 py-3 text-slate-500">{row.date}</td>
                <td className="px-4 py-3 font-medium text-slate-800">{row.influencer}</td>
                <td className="px-4 py-3 text-right text-slate-700">{row.pieces}</td>
                <td className="px-4 py-3 text-right text-slate-700">{formatCurrency(row.productCost)}</td>
                <td className="px-4 py-3 text-right text-slate-700">{formatCurrency(row.shippingCost)}</td>
                <td className="px-4 py-3 text-slate-500">{row.publicationStatus}</td>
                <td className="px-4 py-3 text-right text-slate-400">{row.reach ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
