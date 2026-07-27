import { useState } from 'react';
import { StatCard } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import { calcularResultadoAcuerdo } from '../data/calculos-acuerdo';
import {
  calcularBrutosEscenario, calcularEscenariosComparativa, entradasObjetivo, type Escenario,
} from '../data/calculos-escenarios';
import { calcularBreakeven } from '../data/calculos-breakeven';
import { ResultadoAcuerdoCard } from './ResultadoAcuerdoCard';
import { EscenarioSelector } from './EscenarioSelector';
import { EscenariosTable } from './EscenariosTable';
import { GastoPorCategoriaCard } from './GastoPorCategoriaCard';
import { AjustesEscenariosCard } from './AjustesEscenariosCard';
import { EventoAforoCard } from './EventoAforoCard';
import { TicketingTable } from './TicketingTable';
import { MesasVipTable } from './MesasVipTable';
import { BarrasComidaMerchCards } from './BarrasComidaMerchCards';
import { GastosTable } from './GastosTable';
import type { Proyeccion } from '../data/types';

interface Props {
  proyeccion: Proyeccion;
  onUpdate: (patch: Partial<Proyeccion>) => void;
}

export function PrevisionTab({ proyeccion, onUpdate }: Props) {
  const [escenario, setEscenario] = useState<Escenario>('base');

  const brutos = calcularBrutosEscenario(proyeccion, escenario);
  const resultado = calcularResultadoAcuerdo(proyeccion.acuerdo, brutos, proyeccion.eventoAforo, proyeccion.gastos);
  const breakeven = calcularBreakeven(proyeccion);
  const objetivo = entradasObjetivo(
    proyeccion.ticketing, proyeccion.ajustesEscenarios, escenario,
    proyeccion.eventoAforo.invitaciones, proyeccion.eventoAforo.asistenciaForzada
  );
  const asistencia = objetivo + proyeccion.eventoAforo.invitaciones;
  const ocupacionPct = proyeccion.eventoAforo.aforoMaximo > 0
    ? Math.round((asistencia / proyeccion.eventoAforo.aforoMaximo) * 100)
    : 0;
  const totalBrutos = brutos.ticketing + brutos.mesasVip + brutos.barras + brutos.comida + brutos.merchandising;
  const totalGastos = proyeccion.gastos.reduce((a, g) => a + g.valor, 0);

  return (
    <div className="space-y-6">
      <EscenarioSelector ajustes={proyeccion.ajustesEscenarios} value={escenario} onChange={setEscenario} />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard
          label="Ingresos por acuerdo"
          value={formatCurrency(resultado.nuestrosIngresos)}
          caption={`Total ${formatCurrency(totalBrutos)}`}
        />
        <StatCard
          label="Inversión que asumimos"
          value={formatCurrency(resultado.gastosQueAsumimos)}
          valueClassName="text-red-600"
          caption={`Total ${formatCurrency(-totalGastos)}`}
        />
        <StatCard
          label="Beneficio por acuerdo"
          value={formatCurrency(resultado.beneficioPorAcuerdo)}
          valueClassName={resultado.beneficioPorAcuerdo < 0 ? 'text-red-600' : 'text-emerald-600'}
          caption={`Total ${formatCurrency(resultado.eventoCompletoBeneficio)}`}
        />
        <StatCard label="Margen por acuerdo" value={`${resultado.margenSobreIngresos.toFixed(1)}%`} />
        <StatCard
          label="Punto de equilibrio"
          value={breakeven ? `${breakeven.pctVentaProyectada}%` : '—'}
          caption={breakeven ? `${breakeven.entradasNecesarias} entradas` : undefined}
        />
        <StatCard
          label="Asistencia"
          value={`${asistencia} / ${proyeccion.eventoAforo.aforoMaximo}`}
          caption={`${ocupacionPct}% ocupación`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ResultadoAcuerdoCard resultado={resultado} />
        <EscenariosTable filas={calcularEscenariosComparativa(proyeccion)} />
        <GastoPorCategoriaCard gastos={proyeccion.gastos} />
      </div>

      <AjustesEscenariosCard proyeccion={proyeccion} onUpdate={onUpdate} />
      <EventoAforoCard proyeccion={proyeccion} onUpdate={onUpdate} />
      <TicketingTable proyeccion={proyeccion} escenario={escenario} onUpdate={onUpdate} />
      <MesasVipTable proyeccion={proyeccion} escenario={escenario} onUpdate={onUpdate} />
      <BarrasComidaMerchCards proyeccion={proyeccion} escenario={escenario} onUpdate={onUpdate} />
      <GastosTable
        gastos={proyeccion.gastos}
        brutos={brutos}
        eventoAforo={proyeccion.eventoAforo}
        onUpdate={(gastos) => onUpdate({ gastos })}
      />
    </div>
  );
}
