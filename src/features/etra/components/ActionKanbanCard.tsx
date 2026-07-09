import { Link } from 'react-router';
import { KanbanCard, Badge } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import type { PrAction } from '@/types';

export function ActionKanbanCard({ action }: { action: PrAction }) {
  return (
    <Link to={`/etra/tareas/${action.id}`} className="block">
      <KanbanCard className="transition-shadow hover:shadow-md">
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium text-slate-800">{action.title}</p>
          <span className="shrink-0 text-xs text-slate-400">{action.date}</span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <Badge variant="neutral" size="sm">{action.account}</Badge>
          <span>
            {action.type}
            {action.amount > 0 && <> · {formatCurrency(action.amount)}</>}
          </span>
        </div>
      </KanbanCard>
    </Link>
  );
}
