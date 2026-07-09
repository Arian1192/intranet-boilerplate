import { useState } from 'react';
import { Badge, Button, Card } from '@/components/ui';
import { cn } from '@/lib/utils';
import { eur } from '../data/format';
import { ORDER_STATUSES } from '../data/seed';
import { OrderLinesTable } from './OrderLinesTable';
import type { Order, OrderLine, OrderStatus } from '../data/types';

export function OrderDetail({ order, onBack }: { order: Order; onBack: () => void }) {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [lines, setLines] = useState<OrderLine[]>(order.lines);

  return (
    <div className="space-y-6">
      <button type="button" onClick={onBack} className="text-sm font-medium text-brand-700 hover:text-brand-800">
        ← Todos los pedidos
      </button>

      <Card className="space-y-4 p-6">
        <div className="flex items-start justify-between">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
            {order.id}
            <Badge variant="neutral">{order.businessLine}</Badge>
          </h2>
          <span className="text-xl font-semibold text-slate-900">{eur(order.headerTotal)}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {ORDER_STATUSES.map((s) => (
            <button key={s} type="button" onClick={() => setStatus(s)}
              className={cn(
                'rounded-full border px-3 py-1 text-sm transition-colors',
                s === status ? 'border-brand-400 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
              )}>
              {s}
            </button>
          ))}
          <button type="button" className="ml-auto text-sm text-slate-400 hover:text-slate-600">Anular</button>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50">Descontar del stock</button>
          <button type="button" className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50">Hoja de pedido (PDF)</button>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Badge variant="neutral">{order.businessLine}</Badge>
            <span className="font-medium text-slate-800">{order.client}</span>
            <span>Fecha: {order.dateLabel}</span>
            {order.responsible && <span>Resp.: {order.responsible}</span>}
          </div>
          <Button variant="secondary">Modificar</Button>
        </div>
      </Card>

      <Card className="space-y-4 p-6">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Líneas del pedido</h3>
        <OrderLinesTable lines={lines} onChange={setLines} />
      </Card>

      <Card className="space-y-3 p-6">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Portal de reposiciones (CRUDA)</h3>
        <p className="text-sm text-slate-500">Da acceso a este cliente para que pida sus reposiciones de forma autónoma. Verá solo su catálogo y sus pedidos.</p>
        <div className="flex gap-2">
          <input placeholder="email@cliente.com" className="h-10 flex-1 rounded-lg border border-slate-200 px-3 text-sm" />
          <Button variant="secondary">Invitar</Button>
        </div>
        <p className="text-xs text-slate-400">Se le enviará un email para crear su contraseña. Requiere permiso de gestión de usuarios.</p>
      </Card>
    </div>
  );
}
