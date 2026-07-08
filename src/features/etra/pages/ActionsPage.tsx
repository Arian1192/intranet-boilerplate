import { KanbanBoard, KanbanCard, Badge } from '@/components/ui';
import { usePrActions } from '../hooks/usePrActions';
import type { PrAction, ActionStatus } from '@/types';

const COLUMNS: { id: ActionStatus; label: string; accentClassName: string }[] = [
  { id: 'planned', label: 'Planificada', accentClassName: 'border-t-blue-400' },
  { id: 'in-progress', label: 'En curso', accentClassName: 'border-t-amber-400' },
  { id: 'done', label: 'Hecha', accentClassName: 'border-t-emerald-400' },
  { id: 'cancelled', label: 'Cancelada', accentClassName: 'border-t-slate-300' },
];

function ActionCard({ action }: { action: PrAction }) {
  return (
    <KanbanCard>
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium text-slate-800">{action.title}</p>
        <span className="shrink-0 text-xs text-slate-400">{action.date}</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <Badge variant="neutral" size="sm">{action.account}</Badge>
        <Badge variant="neutral" size="sm">{action.type}</Badge>
      </div>
    </KanbanCard>
  );
}

export function ActionsPage() {
  const { data, isLoading, error } = usePrActions();

  if (isLoading) {
    return <div className="py-12 text-center text-slate-500">Cargando...</div>;
  }

  if (error || !data) {
    return <div className="py-12 text-center text-red-600">Error: {error || 'No data'}</div>;
  }

  const columns = COLUMNS.map((column) => {
    const items = data.filter((action) => action.status === column.id);
    return {
      id: column.id,
      label: column.label,
      accentClassName: column.accentClassName,
      count: items.length,
      children:
        items.length > 0 ? (
          <>
            {items.map((action) => (
              <ActionCard key={action.id} action={action} />
            ))}
          </>
        ) : undefined,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">Acciones</h1>
        <button
          type="button"
          className="inline-flex h-9 items-center rounded-lg bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700"
        >
          + Nueva acción
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <select className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800">
          <option>Todas las cuentas</option>
        </select>
        <select className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800">
          <option>Cualquier responsable</option>
        </select>
        <select className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800">
          <option>Todos los tipos</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-brand-600" />
          Solo mías
        </label>
      </div>
      <KanbanBoard columns={columns} />
    </div>
  );
}
