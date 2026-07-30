import { Badge, Card } from '@/components/ui';
import type { CreativePiece } from '../data/seed';
import { STATUS_VARIANT, tonoDeadline } from '../data/tablero';
import { DeadlineBadge } from './DeadlineBadge';

export interface PiecesTableProps {
  pieces: CreativePiece[];
}

/**
 * Tabla bajo el kanban, calcada de
 * `docs/references/tablero-piezas-2026-07-30/live-creativos-main.html`.
 * Las cabeceras van en capitalización normal y las sube el `uppercase` del `<tr>`, igual que el
 * live. El badge de deadline es el mismo de la tarjeta pero a 12px.
 */
const HEADERS = ['Creatividad', 'Cliente', 'Tipo', 'Deadline', 'Estado', 'Cliente aprob.'];

export function PiecesTable({ pieces }: PiecesTableProps) {
  return (
    <Card className="overflow-hidden border-slate-200 p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400">
              {HEADERS.map((h) => (
                <th key={h} className="px-4 py-2 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pieces.map((piece) => (
              <tr key={piece.id} className="cursor-pointer hover:bg-slate-50">
                <td className="px-4 py-2 font-medium text-slate-800">
                  {piece.title}{' '}
                  <span className="text-xs font-normal text-slate-400">{piece.version}</span>
                </td>
                <td className="px-4 py-2 text-slate-500">{piece.client}</td>
                <td className="px-4 py-2 text-slate-500">{piece.type}</td>
                <td className="whitespace-nowrap px-4 py-2">
                  {piece.deadline !== '—' && (
                    <DeadlineBadge
                      deadline={piece.deadline}
                      tono={tonoDeadline(piece)}
                      size="table"
                    />
                  )}
                </td>
                <td className="px-4 py-2">
                  <Badge variant={STATUS_VARIANT[piece.status]}>{piece.status}</Badge>
                </td>
                <td className="px-4 py-2">
                  {piece.clientApproval ? (
                    <Badge variant="amber">{piece.clientApproval}</Badge>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
