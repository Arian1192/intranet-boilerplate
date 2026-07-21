import { Card } from '@/components/ui';
import type { crossSell } from '../data/crecimiento';

type Rows = ReturnType<typeof crossSell>['rows'];

function CompanyChip({ name }: { name: string }) {
  return <span className="inline-flex items-center rounded-full bg-blue-600/10 px-2.5 py-0.5 text-xs font-medium text-blue-600">{name}</span>;
}
function OfferChip({ name }: { name: string }) {
  return <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-500">{name}</span>;
}

export function CrossSellTable({ rows }: { rows: Rows }) {
  return (
    <Card className="overflow-hidden border-slate-200 p-0">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-left text-sm font-semibold text-slate-400">
            <th className="px-4 py-3">Cliente</th>
            <th className="px-4 py-3">Trabaja con</th>
            <th className="px-4 py-3">Oportunidad de ofrecer</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map(({ org, worksWith, offer }) => (
            <tr key={org.id}>
              <td className="px-4 py-3 text-slate-800">{org.name}</td>
              <td className="px-4 py-3"><CompanyChip name={worksWith} /></td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1.5">
                  {offer.map((c) => <OfferChip key={c} name={c} />)}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
