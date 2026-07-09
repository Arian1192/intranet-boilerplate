import { useState } from 'react';
import { Card, Input, Select, Button } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import { DeliveryRow } from './DeliveryRow';
import { DeliveryFormModal } from './DeliveryFormModal';
import type { Delivery } from '@/types';

export function SeedingDeliveriesTab({ deliveries }: { deliveries: Delivery[] }) {
  const [showModal, setShowModal] = useState(false);

  const totalPieces = deliveries.reduce((sum, d) => sum + d.piecesCount, 0);
  const mrwCost = deliveries.reduce((sum, d) => sum + d.cost, 0);
  const published = deliveries.filter((d) => d.published).length;
  const shipped = deliveries.filter((d) => d.method !== 'internal').length;
  const returnPct = shipped > 0 ? Math.round((published / shipped) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex flex-wrap items-center gap-x-2 text-sm text-slate-500">
          <span className="font-semibold text-slate-800">{deliveries.length}</span> entregas
          <span className="font-semibold text-slate-800">{totalPieces}</span> piezas
          <span>
            Gasto MRW <span className="font-semibold text-slate-800">{formatCurrency(mrwCost)}</span>
          </span>
          <span className="font-semibold text-slate-800">{published}</span> publicados ·{' '}
          <span className="font-semibold text-slate-800">{returnPct}%</span> retorno
        </p>
        <Button size="sm" onClick={() => setShowModal(true)}>+ Nueva entrega</Button>
      </div>

      <Card className="flex flex-wrap items-center gap-3 p-4">
        <Select className="w-44">
          <option>Todos los métodos</option>
        </Select>
        <Select className="min-w-64 flex-1">
          <option>Todos los clientes</option>
        </Select>
        <Select className="w-48">
          <option>Todos los influencers</option>
        </Select>
        <Input placeholder="Filtrar por modelo..." className="w-48" />
      </Card>

      <div className="space-y-3">
        {deliveries.map((delivery) => (
          <DeliveryRow key={delivery.id} delivery={delivery} />
        ))}
      </div>

      <DeliveryFormModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
