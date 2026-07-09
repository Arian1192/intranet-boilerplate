import { useState } from 'react';
import { Card } from '@/components/ui';
import { eur } from '../data/format';
import type { Product } from '../data/types';

export function ProductsTable({ products, onOpen }: { products: Product[]; onOpen: (id: string) => void }) {
  const [query, setQuery] = useState('');
  const filtered = products.filter((p) => {
    const q = query.trim().toLowerCase();
    return !q || p.name.toLowerCase().includes(q) || p.variants.some((v) => v.sku.toLowerCase().includes(q));
  });
  const stock = (p: Product) => p.variants.reduce((s, v) => s + v.stock, 0);

  return (
    <div className="space-y-3">
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por nombre o SKU…"
        className="h-11 w-full rounded-lg border border-slate-200 px-4 text-sm" />
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3 font-medium">Producto</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Colección</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Precio</th>
              <th className="px-4 py-3 font-medium text-right">Margen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((p) => {
              const v0 = p.variants[0];
              return (
                <tr key={p.id} onClick={() => onOpen(p.id)} className="cursor-pointer hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-3">
                      <span className="grid h-8 w-8 place-items-center rounded-md bg-slate-100 text-slate-400">👕</span>
                      <span className="font-medium text-slate-800">{p.name}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{p.type === 'variantes' ? `${p.variants.length} variantes` : 'Producto único'}</td>
                  <td className="px-4 py-3 text-slate-500">{p.collection}</td>
                  <td className="px-4 py-3 text-slate-500">{stock(p)} uds</td>
                  <td className="px-4 py-3 text-slate-700">{eur(v0.price)}</td>
                  <td className="px-4 py-3 text-right font-medium text-emerald-600">{eur(v0.price - v0.cost)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
