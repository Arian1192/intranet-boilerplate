import { useMemo, useState } from 'react';
import { Button, Input, Modal, SegmentedControl, Select, Textarea } from '@/components/ui';
import { eur } from '../data/format';
import { products, variables } from '../data/seed';
import type { Variant } from '../data/types';

const EMPTY_VARIANT: Omit<Variant, 'id'> = {
  sku: '', finish: '—', size: '—', color: '—', price: 0, cost: 0, pvp: 0, multiplier: 0, stock: 0, min: 0,
};

export function ProductModal({ open, productId, onClose }: { open: boolean; productId: string | null; onClose: () => void }) {
  const product = useMemo(() => products.find((p) => p.id === productId) ?? null, [productId]);

  const [name, setName] = useState(product?.name ?? '');
  const [type, setType] = useState<'variantes' | 'unico'>(product?.type ?? 'variantes');
  const [active, setActive] = useState(product?.active ?? true);
  const [variants, setVariants] = useState<Variant[]>(product?.variants ?? []);

  const stockTotal = variants.reduce((s, v) => s + v.stock, 0);
  const num = (v: string) => (v === '' ? 0 : Number(v));
  const update = (id: string, patch: Partial<Variant>) => setVariants(variants.map((v) => (v.id === id ? { ...v, ...patch } : v)));
  const remove = (id: string) => setVariants(variants.filter((v) => v.id !== id));

  return (
    <Modal open={open} onClose={onClose} className="max-w-4xl">
      <div className="space-y-5">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Producto</h3>
          <p className="text-sm text-slate-400">La prenda "madre" solo lleva nombre, colección e imagen. El SKU, precio y coste van en cada variante (salvo que sea un producto único).</p>
        </div>

        <Input label="Nombre *" value={name} onChange={(e) => setName(e.target.value)} />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Tipo de producto</label>
          <SegmentedControl
            value={type}
            onChange={setType}
            options={[{ label: 'Con variantes', value: 'variantes' }, { label: 'Producto único', value: 'unico' }]}
          />
          <p className="mt-1 text-xs text-slate-400">Con variantes: cada combinación de acabado/talla/color con su SKU, precio y coste. Único: talla y acabado únicos, datos en el propio producto.</p>
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} /> Activo
        </label>

        <Textarea label="Notas" defaultValue={product?.notes ?? ''} />

        <div>
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-700">Variantes</h4>
            <span className="text-sm text-slate-400">Stock total: {stockTotal} uds</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-2 py-2 font-medium">SKU</th>
                  <th className="px-2 py-2 font-medium">Acabado</th>
                  <th className="px-2 py-2 font-medium">Talla</th>
                  <th className="px-2 py-2 font-medium">Color</th>
                  <th className="px-2 py-2 font-medium">Precio €</th>
                  <th className="px-2 py-2 font-medium">Coste €</th>
                  <th className="px-2 py-2 font-medium">Margen</th>
                  <th className="px-2 py-2 font-medium">Stock</th>
                  <th className="px-2 py-2 font-medium">Mín.</th>
                  <th className="px-2 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {variants.map((v) => (
                  <tr key={v.id}>
                    <td className="px-2 py-2">
                      <input value={v.sku} onChange={(e) => update(v.id, { sku: e.target.value })} className="h-8 w-24 rounded-md border border-slate-200 px-2 text-sm" />
                    </td>
                    <td className="px-2 py-2">
                      <Select className="h-8 w-24" value={v.finish} onChange={(e) => update(v.id, { finish: e.target.value })}>
                        <option>—</option>{variables.finishes.map((f) => <option key={f}>{f}</option>)}
                      </Select>
                    </td>
                    <td className="px-2 py-2">
                      <Select className="h-8 w-20" value={v.size} onChange={(e) => update(v.id, { size: e.target.value })}>
                        <option>—</option>{variables.sizes.map((s) => <option key={s}>{s}</option>)}
                      </Select>
                    </td>
                    <td className="px-2 py-2">
                      <Select className="h-8 w-24" value={v.color} onChange={(e) => update(v.id, { color: e.target.value })}>
                        <option>—</option>{variables.colors.map((c) => <option key={c}>{c}</option>)}
                      </Select>
                    </td>
                    <td className="px-2 py-2">
                      <input type="number" value={v.price} onChange={(e) => update(v.id, { price: num(e.target.value) })} className="h-8 w-20 rounded-md border border-slate-200 px-2 text-sm" />
                    </td>
                    <td className="px-2 py-2">
                      <input type="number" value={v.cost} onChange={(e) => update(v.id, { cost: num(e.target.value) })} className="h-8 w-20 rounded-md border border-slate-200 px-2 text-sm" />
                    </td>
                    <td className="px-2 py-2 text-emerald-600" title="Margen (precio - coste)">{eur(v.price - v.cost)}</td>
                    <td className="px-2 py-2">
                      <input type="number" value={v.stock} onChange={(e) => update(v.id, { stock: num(e.target.value) })} className="h-8 w-16 rounded-md border border-slate-200 px-2 text-sm" />
                    </td>
                    <td className="px-2 py-2">
                      <input type="number" value={v.min} onChange={(e) => update(v.id, { min: num(e.target.value) })} className="h-8 w-16 rounded-md border border-slate-200 px-2 text-sm" />
                    </td>
                    <td className="px-2 py-2">
                      <button type="button" aria-label="Eliminar variante" onClick={() => remove(v.id)} className="text-slate-400 hover:text-red-500">✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" onClick={() => setVariants([...variants, { ...EMPTY_VARIANT, id: `v${Date.now()}` }])}
            className="mt-2 grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">+</button>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="flex items-center gap-3">
            <Button onClick={onClose}>Guardar</Button>
            <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          </div>
          <Button variant="danger">Eliminar</Button>
        </div>
      </div>
    </Modal>
  );
}
