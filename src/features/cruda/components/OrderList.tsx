import { useMemo, useState } from 'react';
import { Button, Card, Input, Select } from '@/components/ui';
import { eur } from '../data/format';
import { CrudaStatusChip } from './CrudaStatusChip';
import { ORDER_STATUSES } from '../data/seed';
import type { Order } from '../data/types';

interface Props {
  orders: Order[];
  onSelect: (id: string) => void;
  onNew: () => void;
}

export function OrderList({ orders, onSelect, onNew }: Props) {
  const [query, setQuery] = useState('');
  const [line, setLine] = useState('');
  const [status, setStatus] = useState('');

  const filtered = useMemo(
    () =>
      orders.filter((o) => {
        const q = query.trim().toLowerCase();
        const matchesQuery = !q || o.id.toLowerCase().includes(q) || o.client.toLowerCase().includes(q);
        const matchesLine = !line || o.businessLine === line;
        const matchesStatus = !status || o.status === status;
        return matchesQuery && matchesLine && matchesStatus;
      }),
    [orders, query, line, status]
  );

  return (
    <div className="space-y-4">
      <Button className="w-full" onClick={onNew}>+ Nuevo pedido</Button>
      <Card className="space-y-3 p-3">
        <Input placeholder="Buscar por código o cliente…" value={query} onChange={(e) => setQuery(e.target.value)} />
        <Select value={line} onChange={(e) => setLine(e.target.value)}>
          <option value="">Todas las líneas de negocio</option>
          <option value="Colección">Colección</option>
          <option value="Producción">Producción (custom)</option>
        </Select>
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Todos los estados</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
          <option value="Anulado">Anulado</option>
        </Select>
      </Card>
      <Card className="divide-y divide-slate-100 p-0">
        {filtered.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onSelect(o.id)}
            className="block w-full px-4 py-3 text-left transition-colors hover:bg-slate-50"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-slate-900">{o.id} · {o.client}</p>
                <p className="text-sm text-slate-500">{o.dateLabel} · {o.businessLine}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1">
                  {o.reposicion && <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-700">Reposición</span>}
                  <CrudaStatusChip status={o.status} />
                </div>
                <span className="text-sm text-slate-500">{eur(o.amount)}</span>
              </div>
            </div>
          </button>
        ))}
      </Card>
    </div>
  );
}
