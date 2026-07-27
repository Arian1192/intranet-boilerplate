import type { CreativePiece } from '../data/seed';
import { DeadlineBadge } from './DeadlineBadge';

export interface PieceCardProps {
  piece: CreativePiece;
}

/**
 * Tarjeta del kanban, calcada del live del 27-jul: sin badge de prioridad, sin borde rojo en
 * las atrasadas (el rojo vive solo en el badge de deadline) y sin el emoji 📅 que ours pintaba.
 * Clases del contenedor tomadas literalmente de `live-2026-07-27-20-board-structure.json`.
 */
export function PieceCard({ piece }: PieceCardProps) {
  return (
    <button
      type="button"
      className="block w-full rounded-lg border border-slate-200 bg-white p-2.5 text-left hover:border-brand-300 hover:shadow-sm"
    >
      <div className="flex items-center justify-between gap-1.5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 py-0.5 pl-0.5 pr-2">
          <span
            aria-hidden
            className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-slate-200 text-[9px] font-medium text-slate-600"
          >
            {piece.assignee.charAt(0)}
          </span>
          <span className="text-[11px] font-medium text-slate-600">{piece.assignee}</span>
        </span>
        {piece.icon && <span className="shrink-0 text-[11px] leading-none">{piece.icon}</span>}
      </div>
      <p className="mt-1 truncate text-sm font-medium text-slate-800">{piece.title}</p>
      <p className="mt-0.5 truncate text-xs text-slate-400">
        {piece.client} · {piece.type} · {piece.version}
      </p>
      <div className="mt-2 flex items-center gap-2">
        <DeadlineBadge deadline={piece.deadline} overdue={piece.isOverdue} />
        {piece.checklist && (
          <span className="text-[10px] text-slate-500">
            ☑ {piece.checklist.done}/{piece.checklist.total}
          </span>
        )}
      </div>
    </button>
  );
}
