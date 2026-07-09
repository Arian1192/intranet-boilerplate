import { Card } from '@/components/ui';
import { eur } from '../data/format';
import type { Product } from '../data/types';

export function TopProductsTable({ products }: { products: Product[] }) {
  return (
    <Card className="p-5">
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">Productos más vendidos</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
            <th className="pb-2 font-medium">Producto</th>
            <th className="pb-2 font-medium text-right">Unidades</th>
            <th className="pb-2 font-medium text-right">Valor</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t border-slate-100">
              <td className="py-2 text-slate-700">{p.name}</td>
              <td className="py-2 text-right text-slate-600">{p.soldUnits}</td>
              <td className="py-2 text-right font-medium text-slate-800">{eur(p.soldValue)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
