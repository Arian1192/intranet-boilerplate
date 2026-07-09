import { Card } from '@/components/ui';
import { eur } from '../data/format';
import type { Extra } from '../data/types';

export function ExtrasTable({ extras }: { extras: Extra[] }) {
  return (
    <Card className="overflow-hidden p-0">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
            <th className="px-4 py-3 font-medium">Extra</th>
            <th className="px-4 py-3 font-medium">Tipo</th>
            <th className="px-4 py-3 font-medium">Modo</th>
            <th className="px-4 py-3 font-medium text-right">Precio</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {extras.map((e) => (
            <tr key={e.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-medium text-slate-800">{e.name}</td>
              <td className="px-4 py-3 text-slate-500">{e.type}</td>
              <td className="px-4 py-3 text-slate-500">{e.mode}</td>
              <td className="px-4 py-3 text-right text-slate-700">{eur(e.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
