import { Avatar, Badge, Card } from '@/components/ui';
import type { BadgeProps } from '@/components/ui/Badge';
import type { Piece, PiecePriority, PieceStatus } from '../data/types';
import { pieceStatusLabel } from '../data/labels';
import { StatusChip } from './StatusChip';

const COLUMN_ORDER: PieceStatus[] = ['briefing', 'en-produccion', 'revision', 'cambios', 'aprobado'];

const PRIORITY_VARIANT: Record<PiecePriority, BadgeProps['variant']> = {
  baja: 'neutral',
  media: 'amber',
  alta: 'danger',
};

const PRIORITY_LABEL: Record<PiecePriority, string> = {
  baja: 'Baja',
  media: 'Media',
  alta: 'Alta',
};

export function PieceBoard({ pieces }: { pieces: Piece[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {COLUMN_ORDER.map((status) => {
        const items = pieces.filter((piece) => piece.status === status);
        return (
          <div key={status} className="space-y-3">
            <div className="flex items-center justify-between">
              <StatusChip status={pieceStatusLabel[status]} />
              <span className="text-sm text-slate-400">{items.length}</span>
            </div>
            <div className="space-y-3">
              {items.length === 0 ? (
                <p className="py-6 text-center text-slate-300">—</p>
              ) : (
                items.map((piece) => (
                  <Card key={piece.id} className="p-4">
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-100 py-1 pl-1 pr-3">
                      <Avatar fallback={piece.owner} size="sm" />
                      <span className="text-sm font-medium text-slate-700">{piece.owner}</span>
                    </div>
                    <p className="font-semibold text-slate-900">{piece.title}</p>
                    <p className="text-sm text-slate-400">
                      {piece.client} · {piece.type} · v1
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                      <Badge variant={PRIORITY_VARIANT[piece.priority]}>{PRIORITY_LABEL[piece.priority]}</Badge>
                      <span>📅 {piece.deadlineLabel}</span>
                      {piece.checklistTotal > 0 && (
                        <span>
                          ✓ {piece.checklistDone}/{piece.checklistTotal}
                        </span>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
