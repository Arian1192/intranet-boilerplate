import type { ContentPiece, ContentStatus } from '../data/contenidos';
import { KanbanCard } from './KanbanCard';

const TONE_HEADER: Record<'plain' | 'slate' | 'amber', string> = {
  plain: 'text-slate-600',
  slate: 'bg-slate-100 text-slate-500 rounded px-1.5 py-0.5',
  amber: 'bg-amber-100 text-amber-700 rounded px-1.5 py-0.5',
};

export interface KanbanColumnProps {
  status: ContentStatus;
  pieces: ContentPiece[];
}

export function KanbanColumn({ status, pieces }: KanbanColumnProps) {
  const collapsed = pieces.length === 0;
  if (collapsed) {
    return (
      <div data-testid="kanban-column" data-collapsed="true" className="flex w-10 shrink-0 justify-center rounded-lg bg-slate-50 py-4">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 [writing-mode:vertical-rl] rotate-180">
          {status.label}
        </span>
      </div>
    );
  }
  return (
    <div data-testid="kanban-column" data-collapsed="false" className="w-64 shrink-0">
      <div className="flex items-center justify-between px-1">
        <span className={`text-[11px] font-semibold uppercase tracking-wide ${TONE_HEADER[status.tone]}`}>{status.label}</span>
        <span className="text-xs text-slate-400">{pieces.length}</span>
      </div>
      <div className="mt-2 space-y-2 rounded-lg bg-slate-50 p-2">
        {pieces.map((p) => <KanbanCard key={p.id} piece={p} />)}
      </div>
    </div>
  );
}
