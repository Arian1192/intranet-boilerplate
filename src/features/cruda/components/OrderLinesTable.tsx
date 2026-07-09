import { Select } from '@/components/ui';
import { eur } from '../data/format';
import { lineNetUnit, lineSubtotal, orderLinesTotal, products } from '../data/seed';
import type { OrderLine } from '../data/types';

interface Props {
  lines: OrderLine[];
  onChange: (lines: OrderLine[]) => void;
}

export function OrderLinesTable({ lines, onChange }: Props) {
  const update = (id: string, patch: Partial<OrderLine>) =>
    onChange(lines.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  const remove = (id: string) => onChange(lines.filter((l) => l.id !== id));

  const num = (v: string) => (v === '' ? 0 : Number(v));
  const total = orderLinesTotal(lines);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
              <th className="px-2 py-2 font-medium">Descripción</th>
              <th className="px-2 py-2 font-medium">SKU</th>
              <th className="px-2 py-2 font-medium">Talla</th>
              <th className="px-2 py-2 font-medium">Color</th>
              <th className="px-2 py-2 font-medium">Cant.</th>
              <th className="px-2 py-2 font-medium">Precio €</th>
              <th className="px-2 py-2 font-medium">Dto %</th>
              <th className="px-2 py-2 font-medium">Neto €</th>
              <th className="px-2 py-2 font-medium">PVP €</th>
              <th className="px-2 py-2 font-medium">×</th>
              <th className="px-2 py-2 font-medium">Subtotal</th>
              <th className="px-2 py-2 font-medium">Extras</th>
              <th className="px-2 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {lines.map((l) => (
              <tr key={l.id}>
                <td className="px-2 py-2 text-slate-700">{l.description}</td>
                <td className="px-2 py-2 text-slate-500">{l.sku}</td>
                <td className="px-2 py-2 text-slate-500">{l.size}</td>
                <td className="px-2 py-2 text-slate-500">{l.color}</td>
                <td className="px-2 py-2">
                  <input aria-label="Cantidad" type="number" value={l.qty}
                    onChange={(e) => update(l.id, { qty: num(e.target.value) })}
                    className="h-8 w-16 rounded-md border border-slate-200 px-2 text-sm" />
                </td>
                <td className="px-2 py-2 text-slate-600">{eur(l.price)}</td>
                <td className="px-2 py-2">
                  <input aria-label="Descuento" type="number" value={l.discountPct}
                    onChange={(e) => update(l.id, { discountPct: num(e.target.value) })}
                    className="h-8 w-14 rounded-md border border-slate-200 px-2 text-sm" />
                </td>
                <td className="px-2 py-2 text-slate-600" title="Precio unitario tras descuento">{eur(lineNetUnit(l))}</td>
                <td className="px-2 py-2">
                  <input aria-label="PVP" type="number" value={l.pvp}
                    onChange={(e) => update(l.id, { pvp: num(e.target.value) })}
                    className="h-8 w-16 rounded-md border border-slate-200 px-2 text-sm" />
                </td>
                <td className="px-2 py-2">
                  <input aria-label="Multiplicador" type="number" value={l.multiplier}
                    onChange={(e) => update(l.id, { multiplier: num(e.target.value) })}
                    className="h-8 w-14 rounded-md border border-slate-200 px-2 text-sm" />
                </td>
                <td className="px-2 py-2 font-medium text-slate-800">{eur(lineSubtotal(l))}</td>
                <td className="px-2 py-2">
                  <button type="button" className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50">
                    Extras ({l.extrasCount})
                  </button>
                </td>
                <td className="px-2 py-2">
                  <button type="button" aria-label="Eliminar línea" onClick={() => remove(l.id)}
                    className="text-slate-400 hover:text-red-500">✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddLineRow />

      <div className="mt-4 flex justify-end gap-6 text-sm">
        <span className="text-slate-500">Bruto: <span className="font-medium text-slate-700">{eur(total)}</span></span>
        <span className="text-slate-500">Total: <span className="font-semibold text-slate-900">{eur(total)}</span></span>
      </div>
    </div>
  );
}

function AddLineRow() {
  return (
    <div className="mt-4 rounded-lg border border-slate-100 p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Añadir línea</p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
        <Select label="Producto" defaultValue="">
          <option value="">Libre…</option>
          {products.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
        </Select>
        <Select label="Variante" disabled>
          <option>Sin variantes</option>
        </Select>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Descripción *</label>
          <input className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Cant.</label>
          <input type="number" defaultValue={1} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Precio</label>
          <input type="number" defaultValue={0} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" />
        </div>
      </div>
      <button type="button" className="mt-3 inline-flex h-10 items-center rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white hover:bg-brand-700">
        + Añadir línea
      </button>
    </div>
  );
}
