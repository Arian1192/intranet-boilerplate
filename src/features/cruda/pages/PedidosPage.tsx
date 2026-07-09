import { useState } from 'react';
import { OrderList } from '../components/OrderList';
import { OrderSummaryPanel } from '../components/OrderSummaryPanel';
import { PhaseAccumCards } from '../components/PhaseAccumCards';
import { orders, orderSummary, phaseAccum } from '../data/seed';

export function PedidosPage() {
  // Local UI mode: list | detail | new. Detail/new wired in a later task.
  const [, setSelectedId] = useState<string | null>(null);
  const [, setCreating] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Pedidos</h1>
        <p className="text-slate-500">Hojas de pedido de CRUDA: producto, cantidades y estado.</p>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
        <OrderList orders={orders} onSelect={setSelectedId} onNew={() => setCreating(true)} />
        <div className="space-y-6">
          <OrderSummaryPanel summary={orderSummary} />
          <PhaseAccumCards items={phaseAccum} />
        </div>
      </div>
    </div>
  );
}
