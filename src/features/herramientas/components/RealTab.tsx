import { StatCard } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import { calcularBrutosReal, asistenciaReal, calcularResultadoReal } from '../data/calculos-real';
import { ResultadoAcuerdoCard } from './ResultadoAcuerdoCard';
import { GastoPorCategoriaCard } from './GastoPorCategoriaCard';
import { EventoAforoCard } from './EventoAforoCard';
import { TicketingTable } from './TicketingTable';
import { MesasVipTable } from './MesasVipTable';
import { CajaRealTable } from './CajaRealTable';
import { GastosTable } from './GastosTable';
import type { Proyeccion } from '../data/types';

interface Props {
  proyeccion: Proyeccion;
  onUpdate: (patch: Partial<Proyeccion>) => void;
}

/**
 * Tab Real (Fase C): cuenta de explotación con cifras ejecutadas. Espeja `PrevisionTab`
 * pero sin escenarios/breakeven (solo de planificación) y con el motor real. Reusa las
 * mismas tarjetas de resultado/gastos y las tablas de sección en `modo="real"`.
 */
export function RealTab({ proyeccion, onUpdate }: Props) {
  const brutos = calcularBrutosReal(proyeccion);
  const resultado = calcularResultadoReal(proyeccion);
  const asistencia = asistenciaReal(proyeccion);
  const ocupacionPct = proyeccion.eventoAforo.aforoMaximo > 0
    ? Math.round((asistencia / proyeccion.eventoAforo.aforoMaximo) * 100)
    : 0;
  const totalBrutos = brutos.ticketing + brutos.mesasVip + brutos.barras + brutos.comida + brutos.merchandising;
  const totalGastos = proyeccion.gastos.reduce((a, g) => a + g.valor, 0);

  // Sin datos reales, `calcularResultadoReal` es null; mostramos ceros en ese caso.
  const nuestrosIngresos = resultado?.nuestrosIngresos ?? 0;
  const gastosQueAsumimos = resultado?.gastosQueAsumimos ?? 0;
  const beneficio = resultado?.beneficioPorAcuerdo ?? 0;
  const margen = resultado?.margenSobreIngresos ?? 0;
  const eventoCompleto = resultado?.eventoCompletoBeneficio ?? 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard
          label="Ingresos por acuerdo"
          value={formatCurrency(nuestrosIngresos)}
          caption={`Total ${formatCurrency(totalBrutos)}`}
        />
        <StatCard
          label="Inversión que asumimos"
          value={formatCurrency(gastosQueAsumimos)}
          valueClassName="text-red-600"
          caption={`Total ${formatCurrency(-totalGastos)}`}
        />
        <StatCard
          label="Beneficio por acuerdo"
          value={formatCurrency(beneficio)}
          valueClassName={beneficio < 0 ? 'text-red-600' : 'text-emerald-600'}
          caption={`Total ${formatCurrency(eventoCompleto)}`}
        />
        <StatCard label="Margen por acuerdo" value={`${margen.toFixed(1)}%`} />
        <StatCard
          label="Asistencia real"
          value={`${asistencia} / ${proyeccion.eventoAforo.aforoMaximo}`}
          caption={`${ocupacionPct}% ocupación`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {resultado && <ResultadoAcuerdoCard resultado={resultado} />}
        <GastoPorCategoriaCard gastos={proyeccion.gastos} />
      </div>

      <EventoAforoCard proyeccion={proyeccion} onUpdate={onUpdate} modo="real" />
      <TicketingTable proyeccion={proyeccion} escenario="base" modo="real" onUpdate={onUpdate} />
      <MesasVipTable proyeccion={proyeccion} escenario="base" modo="real" onUpdate={onUpdate} />
      <CajaRealTable proyeccion={proyeccion} onUpdate={onUpdate} />
      <GastosTable
        gastos={proyeccion.gastos}
        brutos={brutos}
        eventoAforo={proyeccion.eventoAforo}
        onUpdate={(gastos) => onUpdate({ gastos })}
      />
    </div>
  );
}
