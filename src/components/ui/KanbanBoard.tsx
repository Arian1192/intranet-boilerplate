import { Card } from './Card';
import { cn } from '@/lib/utils';

export interface KanbanColumnData {
  id: string;
  label: string;
  accentClassName: string;
  count?: number;
  children?: React.ReactNode;
}

export interface KanbanBoardProps {
  columns: KanbanColumnData[];
  className?: string;
}

export function KanbanBoard({ columns, className }: KanbanBoardProps) {
  return (
    <div
      className={cn('grid gap-4', className)}
      style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(240px, 1fr))` }}
    >
      {columns.map((column) => (
        <KanbanColumn
          key={column.id}
          label={column.label}
          accentClassName={column.accentClassName}
          count={column.count}
        >
          {column.children}
        </KanbanColumn>
      ))}
    </div>
  );
}

export interface KanbanColumnProps {
  label: string;
  accentClassName: string;
  count?: number;
  children?: React.ReactNode;
}

export function KanbanColumn({ label, accentClassName, count, children }: KanbanColumnProps) {
  return (
    <Card className={cn('overflow-hidden border-t-4 p-0', accentClassName)}>
      <div className="flex items-center justify-between px-4 py-3">
        <h3 className="text-sm font-semibold text-slate-800">{label}</h3>
        {count !== undefined && (
          <span className="text-xs font-medium text-slate-400">{count}</span>
        )}
      </div>
      <div className="space-y-3 px-4 pb-4">
        {children ?? <p className="py-6 text-center text-slate-300">—</p>}
      </div>
    </Card>
  );
}

export interface KanbanCardProps {
  children: React.ReactNode;
  className?: string;
}

export function KanbanCard({ children, className }: KanbanCardProps) {
  return (
    <div className={cn('rounded-lg border border-slate-100 bg-white p-3 shadow-sm', className)}>
      {children}
    </div>
  );
}
