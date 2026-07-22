import type { ContentPiece } from '../data/contenidos';
import { TEAMS } from '../data/contenidos';

export interface KanbanCardProps {
  piece: ContentPiece;
}

export function KanbanCard({ piece }: KanbanCardProps) {
  const team = TEAMS.find((t) => t.id === piece.team)!;
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <p className="text-sm font-medium text-slate-800">{piece.title}</p>
      <div className="mt-2 flex flex-wrap items-center gap-1">
        <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium ${team.chip}`}>
          {team.label}
        </span>
        <span className="inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
          {piece.type}
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-slate-400">{piece.dueLabel}</span>
        {piece.ownerInitials && (
          <span
            data-testid="card-avatar"
            className="grid h-5 w-5 place-items-center rounded-full text-[9px] font-semibold text-white"
            style={{ backgroundColor: piece.ownerColor ?? '#64748b' }}
          >
            {piece.ownerInitials}
          </span>
        )}
      </div>
    </div>
  );
}
