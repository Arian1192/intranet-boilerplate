import { ArrowRight, Info, X } from 'lucide-react';
import { Card, Badge, Button, Select } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import type { Delivery } from '@/types';

export function DeliveryRow({ delivery }: { delivery: Delivery }) {
  return (
    <Card className="flex items-center justify-between gap-4 p-4">
      <div>
        <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span>
            {delivery.date} · {delivery.account}
          </span>
          {delivery.method === 'internal' ? (
            <Badge variant="amber" size="sm">Uso interno</Badge>
          ) : (
            <Badge variant="sky" size="sm">Envío MRW</Badge>
          )}
          {delivery.method !== 'internal' && delivery.status === 'delivered' && (
            <Badge variant="emerald" size="sm">Entregado</Badge>
          )}
          {delivery.published && <Badge variant="emerald" size="sm">Publicado</Badge>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-slate-800">{delivery.recipient}</span>
          {delivery.method !== 'internal' && <Info className="h-3.5 w-3.5 text-slate-300" />}
          <ArrowRight className="h-3.5 w-3.5 text-slate-300" />
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
            {delivery.itemsSummary}
          </span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {delivery.method === 'internal' ? (
          <Button variant="secondary" size="sm">Editar</Button>
        ) : (
          <>
            <span className="text-sm text-slate-500">{formatCurrency(delivery.cost)}</span>
            <Select defaultValue={delivery.status} className="h-9 w-36">
              <option value="prepared">Preparado</option>
              <option value="shipped">Enviado</option>
              <option value="delivered">Entregado</option>
            </Select>
          </>
        )}
        <button type="button" aria-label="Eliminar entrega" className="text-slate-300 hover:text-slate-500">
          <X className="h-4 w-4" />
        </button>
      </div>
    </Card>
  );
}
