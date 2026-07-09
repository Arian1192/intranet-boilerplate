import { Card, Badge } from '@/components/ui';
import type { BadgeProps } from '@/components/ui/Badge';
import type { Publication } from '../data/types';

const APPROVAL_VARIANT: Record<string, BadgeProps['variant']> = {
  Aprobado: 'success',
  Pendiente: 'warning',
};

const STATUS_VARIANT: Record<string, BadgeProps['variant']> = {
  'En producción': 'info',
};

export function PublicationTable({ publications }: { publications: Publication[] }) {
  return (
    <Card className="overflow-hidden p-0">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs font-medium uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">FECHA</th>
            <th className="px-4 py-3">PUBLICACIÓN</th>
            <th className="px-4 py-3">CANAL</th>
            <th className="px-4 py-3">CUENTA</th>
            <th className="px-4 py-3">EVENTO</th>
            <th className="px-4 py-3">TEXTO</th>
            <th className="px-4 py-3">IMAGEN</th>
            <th className="px-4 py-3">ESTADO</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {publications.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-4 py-6 text-center text-slate-300">
                Sin publicaciones.
              </td>
            </tr>
          ) : (
            publications.map((pub) => (
              <tr key={pub.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-500">
                  {pub.isoDate} {pub.time}
                </td>
                <td className="px-4 py-3 font-medium text-slate-900">{pub.name}</td>
                <td className="px-4 py-3 text-slate-500">{pub.channel}</td>
                <td className="px-4 py-3 text-slate-500">{pub.account}</td>
                <td className="px-4 py-3 text-red-500">{pub.eventName ? `📍 ${pub.eventName}` : '—'}</td>
                <td className="px-4 py-3">
                  <Badge variant={APPROVAL_VARIANT[pub.textApproval] ?? 'neutral'}>{pub.textApproval}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={APPROVAL_VARIANT[pub.imageApproval] ?? 'neutral'}>{pub.imageApproval}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={STATUS_VARIANT[pub.status] ?? 'neutral'}>{pub.status}</Badge>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Card>
  );
}
