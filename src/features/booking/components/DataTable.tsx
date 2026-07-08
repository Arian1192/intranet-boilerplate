import { formatCurrency } from '@/lib/format';
import { StatusBadge } from './StatusBadge';
import type { Show } from '@/types';

export interface DataTableProps {
  shows: Show[];
}

const statusLabels: Record<Show['status'], string> = {
  tentative: 'Tentative',
  offer: 'Oferta',
  confirmed: 'Confirmado',
  contract: 'Contrato',
  'pending-payment': 'Pendiente pago',
  'pending-settlement': 'Pendiente liquidar',
  done: 'Celebrado',
};

export function DataTable({ shows }: DataTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs font-medium uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Nombre</th>
            <th className="px-4 py-3">Cliente</th>
            <th className="px-4 py-3">Fecha</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3 text-right">Importe</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {shows.map((show) => (
            <tr key={show.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-normal text-slate-900">{show.name}</td>
              <td className="px-4 py-3 text-slate-500">{show.client}</td>
              <td className="px-4 py-3 text-slate-500">{show.date}</td>
              <td className="px-4 py-3">
                <StatusBadge status={show.status}>{statusLabels[show.status]}</StatusBadge>
              </td>
              <td className="px-4 py-3 text-right font-medium text-slate-700">
                {formatCurrency(show.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
