import { Card } from '@/components/ui';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/format';
import type { FilaEscenario } from '../data/calculos-escenarios';

export function EscenariosTable({ filas }: { filas: FilaEscenario[] }) {
  return (
    <Card className="p-4">
      <h3 className="mb-3 text-sm font-semibold text-slate-800">Escenarios</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-slate-400">
            <th className="pb-2 font-medium">ESCENARIO</th>
            <th className="pb-2 font-medium">Bº POR ACUERDO</th>
            <th className="pb-2 font-medium">MARGEN</th>
          </tr>
        </thead>
        <tbody>
          {filas.map((fila) => (
            <tr key={fila.escenario} className="border-t border-slate-100">
              <td className="py-2 text-slate-700">{fila.label}</td>
              <td className={cn('py-2 font-medium', fila.beneficio < 0 ? 'text-red-600' : 'text-emerald-600')}>
                {formatCurrency(fila.beneficio)}
              </td>
              <td className={cn('py-2', fila.beneficio < 0 ? 'text-red-600' : 'text-emerald-600')}>
                {fila.margen.toFixed(1)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
