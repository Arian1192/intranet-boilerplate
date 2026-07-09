import { useState } from 'react';
import { OrderList } from '../components/OrderList';
import { OrderSummaryPanel } from '../components/OrderSummaryPanel';
import { PhaseAccumCards } from '../components/PhaseAccumCards';
import { OrderDetail } from '../components/OrderDetail';
import { NewOrderForm } from '../components/NewOrderForm';
import { orders, orderSummary, phaseAccum } from '../data/seed';

type Mode = { kind: 'list' } | { kind: 'detail'; id: string } | { kind: 'new' };

export function PedidosPage() {
  const [mode, setMode] = useState<Mode>({ kind: 'list' });

  const header = (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Pedidos</h1>
      <p className="text-slate-500">Hojas de pedido de CRUDA: producto, cantidades y estado.</p>
    </div>
  );

  if (mode.kind === 'detail') {
    const order = orders.find((o) => o.id === mode.id)!;
    return (
      <div className="space-y-6">
        {header}
        <OrderDetail order={order} onBack={() => setMode({ kind: 'list' })} />
      </div>
    );
  }

  if (mode.kind === 'new') {
    return (
      <div className="space-y-6">
        {header}
        <button type="button" onClick={() => setMode({ kind: 'list' })} className="text-sm font-medium text-brand-700 hover:text-brand-800">
          ← Todos los pedidos
        </button>
        <NewOrderForm onCancel={() => setMode({ kind: 'list' })} onCreate={() => setMode({ kind: 'list' })} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {header}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
        <OrderList orders={orders} onSelect={(id) => setMode({ kind: 'detail', id })} onNew={() => setMode({ kind: 'new' })} />
        <div className="space-y-6">
          <OrderSummaryPanel summary={orderSummary} />
          <PhaseAccumCards items={phaseAccum} />
        </div>
      </div>
    </div>
  );
}
