import { Link, useParams } from 'react-router';
import { Card, Badge, Button } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import { ActionBreakdownCard, ActionCommentsCard } from '../components';
import { usePrActions } from '../hooks/usePrActions';
import type { ActionStatus } from '@/types';

const STATUS_LABEL: Record<ActionStatus, { label: string; variant: 'blue' | 'amber' | 'emerald' | 'neutral' }> = {
  planned: { label: 'Planificada', variant: 'blue' },
  'in-progress': { label: 'En curso', variant: 'amber' },
  done: { label: 'Hecha', variant: 'emerald' },
  cancelled: { label: 'Cancelada', variant: 'neutral' },
};

export function ActionDetailPage() {
  const { actionId } = useParams();
  const { data, isLoading, error } = usePrActions();

  if (isLoading) {
    return <div className="py-12 text-center text-slate-500">Cargando...</div>;
  }

  if (error || !data) {
    return <div className="py-12 text-center text-red-600">Error: {error || 'No data'}</div>;
  }

  const backLink = (
    <Link to="/etra/tareas" className="text-sm text-slate-500 hover:text-slate-700">
      ← Volver a acciones
    </Link>
  );

  const action = data.find((item) => item.id === actionId);
  if (!action) {
    return (
      <div className="space-y-6">
        {backLink}
        <p className="py-12 text-center text-slate-400">Acción no encontrada.</p>
      </div>
    );
  }

  const status = STATUS_LABEL[action.status];

  return (
    <div className="space-y-6">
      {backLink}

      <Card className="flex items-start justify-between p-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">{action.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
            <Badge variant={status.variant}>{status.label}</Badge>
            <span className="text-slate-600">{action.type}</span>
            <span className="text-slate-400">
              Responsable: <span className="text-slate-600">{action.responsible ?? 'Sin asignar'}</span>
            </span>
            <span className="text-slate-400">
              Límite: <span className="text-slate-600">{action.date}</span>
            </span>
            {action.amount > 0 && (
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                Budget {formatCurrency(action.amount)} · {action.commissionPct ?? 0}%
              </span>
            )}
          </div>
        </div>
        <Button variant="secondary" size="sm">Modificar acción</Button>
      </Card>

      <ActionBreakdownCard action={action} />
      <ActionCommentsCard />
    </div>
  );
}
