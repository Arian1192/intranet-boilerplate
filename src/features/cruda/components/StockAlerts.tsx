import { Card } from '@/components/ui';
import { eur } from '../data/format';
import type { Product } from '../data/types';

export function StockAlerts({ products }: { products: Product[] }) {
  const variants = products.flatMap((p) => p.variants.map((v) => ({ p, v })));
  const totalUnits = variants.reduce((s, { v }) => s + v.stock, 0);
  const totalCost = variants.reduce((s, { v }) => s + v.stock * v.cost, 0);
  const low = variants.filter(({ v }) => v.stock <= v.min);

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Alertas de stock</h2>
        <span className="text-xs text-slate-400">{totalUnits} uds · valor a coste {eur(totalCost)}</span>
      </div>
      <p className="mb-3 text-sm text-red-600">{low.length} variante(s) en o por debajo del mínimo:</p>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
            <th className="pb-2 font-medium">Variante</th>
            <th className="pb-2 font-medium text-right">Stock</th>
            <th className="pb-2 font-medium text-right">Mín.</th>
          </tr>
        </thead>
        <tbody>
          {low.map(({ p, v }) => (
            <tr key={v.id} className="border-t border-slate-100">
              <td className="py-2 text-slate-700">{p.name} <span className="text-slate-400">· {v.finish} / {v.size} / {v.color}</span></td>
              <td className="py-2 text-right font-medium text-red-600">{v.stock}</td>
              <td className="py-2 text-right text-slate-500">{v.min}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
