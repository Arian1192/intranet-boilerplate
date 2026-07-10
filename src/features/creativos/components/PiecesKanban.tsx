import { Badge } from '@/components/ui';
import type { CreativePiece } from '../data/seed';
import { STATUS_COLUMNS, STATUS_VARIANT, groupByStatus } from '../data/creativos';
import { PieceCard } from './PieceCard';

export interface PiecesKanbanProps {
  pieces: CreativePiece[];
}

export function PiecesKanban({ pieces }: PiecesKanbanProps) {
  const groups = groupByStatus(pieces);
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
      {STATUS_COLUMNS.map((status) => {
        const items = groups[status];
        return (
          <div key={status}>
            <div className="mb-2 flex items-center justify-between px-1">
              <Badge variant={STATUS_VARIANT[status]}>{status}</Badge>
              <span className="text-xs font-medium text-slate-400">{items.length}</span>
            </div>
            {items.length === 0 ? (
              <p className="px-1 text-sm text-slate-300">—</p>
            ) : (
              <div className="space-y-2">
                {items.map((piece) => (
                  <PieceCard key={piece.id} piece={piece} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
