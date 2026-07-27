import { Card, ProgressBar } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import { calcularGastoPorCategoria } from '../data/calculos-escenarios';
import type { Gasto } from '../data/types';

export function GastoPorCategoriaCard({ gastos }: { gastos: Gasto[] }) {
  const filas = calcularGastoPorCategoria(gastos);
  const max = filas.length > 0 ? filas[0].importe : 0;

  return (
    <Card className="p-4">
      <h3 className="mb-3 text-sm font-semibold text-slate-800">Gasto por categoría</h3>
      <div className="space-y-3">
        {filas.map((fila) => (
          <div key={fila.categoria}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-slate-700">{fila.categoria}</span>
              <span className="text-slate-500">
                {formatCurrency(fila.importe)} · {fila.pct}%
              </span>
            </div>
            <ProgressBar value={fila.importe} max={max} />
          </div>
        ))}
      </div>
    </Card>
  );
}
