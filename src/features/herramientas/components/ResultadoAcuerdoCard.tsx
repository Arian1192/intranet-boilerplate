import { Card } from '@/components/ui';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/format';
import type { ResultadoAcuerdo } from '../data/calculos-acuerdo';

export function ResultadoAcuerdoCard({ resultado }: { resultado: ResultadoAcuerdo }) {
  const beneficioPositivo = resultado.beneficioPorAcuerdo >= 0;
  return (
    <Card className="p-4">
      <h3 className="mb-3 text-sm font-semibold text-slate-800">Resultado por acuerdo</h3>
      {/* Lista vertical (label izquierda, valor derecha), fiel al live: el BENEFICIO va en
          una caja resaltada (roja si es negativo, verde si es positivo). */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase text-slate-400">Nuestros ingresos</span>
          <span className="text-sm font-semibold text-slate-900">{formatCurrency(resultado.nuestrosIngresos)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase text-slate-400">Gastos que asumimos</span>
          <span className="text-sm font-semibold text-red-600">{formatCurrency(resultado.gastosQueAsumimos)}</span>
        </div>
        <div
          className={cn(
            'flex items-center justify-between rounded-lg px-3 py-2',
            beneficioPositivo ? 'bg-emerald-50' : 'bg-red-50'
          )}
        >
          <span className="text-xs font-semibold uppercase text-slate-600">Beneficio por acuerdo</span>
          <span className={cn('text-lg font-semibold', beneficioPositivo ? 'text-emerald-600' : 'text-red-600')}>
            {formatCurrency(resultado.beneficioPorAcuerdo)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase text-slate-400">Margen s/ ingresos</span>
          <span className="text-sm font-semibold text-slate-900">{resultado.margenSobreIngresos.toFixed(1)}%</span>
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-500">
        Evento completo: {formatCurrency(resultado.eventoCompletoBeneficio)} ({Math.round(resultado.margenEventoCompleto)}%).
      </p>
    </Card>
  );
}
