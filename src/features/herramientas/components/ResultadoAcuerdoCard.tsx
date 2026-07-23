import { Card } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import type { ResultadoAcuerdo } from '../data/calculos-acuerdo';

export function ResultadoAcuerdoCard({ resultado }: { resultado: ResultadoAcuerdo }) {
  return (
    <Card className="p-4">
      <h3 className="mb-3 text-sm font-semibold text-slate-800">Resultado por acuerdo</h3>
      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <dt className="text-xs uppercase text-slate-400">Nuestros ingresos</dt>
          <dd className="text-lg font-semibold text-slate-900">{formatCurrency(resultado.nuestrosIngresos)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-slate-400">Gastos que asumimos</dt>
          <dd className="text-lg font-semibold text-red-600">{formatCurrency(resultado.gastosQueAsumimos)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-slate-400">Beneficio por acuerdo</dt>
          <dd className="text-lg font-semibold text-emerald-600">{formatCurrency(resultado.beneficioPorAcuerdo)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-slate-400">Margen s/ingresos</dt>
          <dd className="text-lg font-semibold text-slate-900">{resultado.margenSobreIngresos.toFixed(1)}%</dd>
        </div>
      </dl>
      <p className="mt-3 text-sm text-slate-500">
        Evento completo: {formatCurrency(resultado.eventoCompletoBeneficio)} ({Math.round(resultado.margenEventoCompleto)}%).
      </p>
    </Card>
  );
}
