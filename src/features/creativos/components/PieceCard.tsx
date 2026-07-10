import { Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { CreativePiece } from '../data/seed';
import { PRIORITY_VARIANT } from '../data/creativos';

export interface PieceCardProps {
  piece: CreativePiece;
}

export function PieceCard({ piece }: PieceCardProps) {
  return (
    <button
      type="button"
      className={cn(
        'block w-full rounded-lg border bg-white p-2.5 text-left hover:shadow-sm',
        piece.isOverdue ? 'border-red-300 ring-1 ring-red-100' : 'border-slate-200',
      )}
    >
      <div className="flex items-center gap-1.5">
        <span
          aria-hidden
          className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-slate-200 text-[9px] font-medium text-slate-600"
        >
          {piece.assignee.charAt(0)}
        </span>
        <span className="text-[11px] font-medium text-slate-600">{piece.assignee}</span>
      </div>
      <p className="mt-1 truncate text-sm font-medium text-slate-800">{piece.title}</p>
      <p className="mt-0.5 truncate text-xs text-slate-400">
        {piece.client} · {piece.type} · {piece.version}
      </p>
      <div className="mt-2 flex items-center gap-2">
        <Badge variant={PRIORITY_VARIANT[piece.priority]} size="sm">
          {piece.priority}
        </Badge>
        <span className={cn('text-[10px]', piece.isOverdue ? 'font-semibold text-rose-600' : 'text-slate-500')}>
          📅 {piece.deadline}
        </span>
        {piece.checklist && (
          <span className="text-[10px] text-slate-500">
            ☑ {piece.checklist.done}/{piece.checklist.total}
          </span>
        )}
      </div>
    </button>
  );
}
