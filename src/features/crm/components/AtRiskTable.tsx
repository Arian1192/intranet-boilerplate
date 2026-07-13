import { Card } from '@/components/ui';
import { formatDate } from '../data/pipeline';
import type { atRisk } from '../data/crecimiento';

type Rows = ReturnType<typeof atRisk>;

export function AtRiskTable({ rows }: { rows: Rows }) {
  return (
    <Card className="overflow-hidden border-slate-200 p-0">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-left text-sm font-semibold text-slate-400">
            <th className="px-4 py-3">Cliente</th>
            <th className="px-4 py-3">Última actividad</th>
            <th className="px-4 py-3">Empresas</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map(({ org, lastActivity, companies }) => (
            <tr key={org.id}>
              <td className="px-4 py-3 text-slate-800">{org.name}</td>
              <td className="px-4 py-3">
                {lastActivity === null
                  ? <span className="text-amber-600">Nunca</span>
                  : <span className="text-slate-600">{formatDate(lastActivity)}</span>}
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1.5">
                  {companies.map((c) => (
                    <span key={c} className="inline-flex items-center rounded-full bg-blue-600/10 px-2.5 py-0.5 text-xs font-medium text-blue-600">{c}</span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
