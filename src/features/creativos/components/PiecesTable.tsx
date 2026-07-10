import { Badge } from '@/components/ui';
import type { CreativePiece } from '../data/seed';
import { STATUS_VARIANT, PRIORITY_VARIANT } from '../data/creativos';

export interface PiecesTableProps {
  pieces: CreativePiece[];
}

const HEADERS = ['PIEZA', 'CLIENTE', 'TIPO', 'PRIORIDAD', 'DEADLINE', 'ESTADO', 'CLIENTE APROB.'];

export function PiecesTable({ pieces }: PiecesTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400">
            {HEADERS.map((h) => (
              <th key={h} className="px-4 py-2 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pieces.map((piece) => (
            <tr key={piece.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
              <td className="px-4 py-3 text-sm">
                <span className="text-slate-800">{piece.title}</span>{' '}
                <span className="text-slate-400">{piece.version}</span>
              </td>
              <td className="px-4 py-3 text-sm text-slate-600">{piece.client}</td>
              <td className="px-4 py-3 text-sm text-slate-600">{piece.type}</td>
              <td className="px-4 py-3">
                <Badge variant={PRIORITY_VARIANT[piece.priority]}>{piece.priority}</Badge>
              </td>
              <td className="px-4 py-3 text-sm text-slate-600">{piece.deadline}</td>
              <td className="px-4 py-3">
                <Badge variant={STATUS_VARIANT[piece.status]}>{piece.status}</Badge>
              </td>
              <td className="px-4 py-3 text-sm text-slate-300">{piece.clientApproval ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
