import { useState } from 'react';
import { Button, Card, Input, SegmentedControl, Select, Textarea } from '@/components/ui';
import { collections } from '../data/seed';

export function NewOrderForm({ onCancel, onCreate }: { onCancel: () => void; onCreate: () => void }) {
  const [line, setLine] = useState<'coleccion' | 'produccion'>('coleccion');

  return (
    <Card className="space-y-5 p-6">
      <h2 className="text-xl font-bold text-slate-900">Nuevo pedido</h2>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Línea de negocio</label>
        <SegmentedControl
          fullWidth
          value={line}
          onChange={setLine}
          options={[{ label: 'Colección', value: 'coleccion' }, { label: 'Producción (custom)', value: 'produccion' }]}
        />
        <p className="mt-1 text-xs text-slate-400">Colección = venta de prenda ya confeccionada (a veces en stock). Producción = merch a medida.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">Cliente</label>
            <span className="text-sm text-brand-700">Abrir CRM ↗</span>
          </div>
          <Input placeholder="Buscar o crear cliente…" />
        </div>
        <Select label="Colección" defaultValue="">
          <option value="">—</option>
          {collections.map((c) => (<option key={c} value={c}>{c}</option>))}
        </Select>
        <Input label="Fecha" type="date" defaultValue="2026-07-09" />
        <Input label="Entrega prevista" type="date" placeholder="dd/mm/aaaa" />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Responsable</label>
          <button type="button" className="flex h-10 items-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 text-sm text-slate-500">
            <span className="grid h-5 w-5 place-items-center rounded-full border border-slate-300">+</span> Asignar
          </button>
        </div>
        <Input label="Descuento global (%)" type="number" defaultValue={0} />
      </div>

      <Input label="Dirección de envío" placeholder="Dirección de envío" />
      <Textarea label="Notas" />

      <div className="flex items-center gap-3">
        <Button onClick={onCreate}>Crear pedido</Button>
        <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
      </div>
      <p className="text-xs text-slate-400">Guarda los datos para empezar a añadir líneas, gestionar el estado y el stock.</p>
    </Card>
  );
}
