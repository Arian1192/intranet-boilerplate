import { Badge } from '@/components/ui';
import type { CreativePiece } from '../data/seed';
import { STATUS_COLUMNS, STATUS_VARIANT, groupByStatus } from '../data/tablero';
import { PieceCard } from './PieceCard';

export interface PiecesKanbanProps {
  pieces: CreativePiece[];
}

/**
 * Kanban de 5 columnas, calcado de
 * `docs/references/tablero-piezas-2026-07-30/live-creativos-main.html`.
 * Cada columna es una zona gris con alto mínimo — es el destino del arrastre, y por eso se ve
 * también cuando está vacía.
 */
export function PiecesKanban({ pieces }: PiecesKanbanProps) {
  const groups = groupByStatus(pieces);
  return (
    <div
      role="region"
      aria-label="Tablero de creatividades"
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5"
    >
      {STATUS_COLUMNS.map((status) => {
        const items = groups[status];
        return (
          <div key={status} className="min-w-0">
            <div className="mb-2 flex items-center justify-between px-1">
              <Badge variant={STATUS_VARIANT[status]}>{status}</Badge>
              <span className="rounded-full bg-slate-100 px-2 text-xs text-slate-500">
                {items.length}
              </span>
            </div>
            <div className="min-h-[80px] space-y-2 rounded-lg bg-slate-50 p-2">
              {items.length === 0 ? (
                <p className="px-1 py-3 text-center text-xs text-slate-300">—</p>
              ) : (
                items.map((piece) => <PieceCard key={piece.id} piece={piece} />)
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
