import { calcularResultadoAcuerdo } from '../data/calculos-acuerdo';
import { calcularBrutosEscenario } from '../data/calculos-escenarios';
import { AcuerdoTramoCard } from './AcuerdoTramoCard';
import { QuienPagaGastos } from './QuienPagaGastos';
import { ResultadoAcuerdoCard } from './ResultadoAcuerdoCard';
import type { AcuerdoConfig, Proyeccion, TramoAcuerdoConfig } from '../data/types';

interface Props {
  proyeccion: Proyeccion;
  onUpdate: (patch: Partial<Proyeccion>) => void;
}

type TramoKey = 'ticketing' | 'mesasVip' | 'barras' | 'comida' | 'merchandising';

export function AcuerdoTab({ proyeccion, onUpdate }: Props) {
  const { acuerdo, eventoAforo, gastos } = proyeccion;
  // Acuerdo no tiene selector de escenario propio: usa siempre el multiplicador Base
  // (mismo criterio que el live — ver spec de Fase B §3.5).
  const acuerdoBrutos = calcularBrutosEscenario(proyeccion, 'base');
  const resultado = calcularResultadoAcuerdo(acuerdo, acuerdoBrutos, eventoAforo, gastos);

  const setTramo = (tramo: TramoKey, config: TramoAcuerdoConfig) => {
    const nextAcuerdo: AcuerdoConfig = { ...acuerdo, [tramo]: config };
    onUpdate({ acuerdo: nextAcuerdo });
  };

  const ivaResto = eventoAforo.ivaBarrasComidaVipPct;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-100 bg-white p-4">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={acuerdo.aplicarAcuerdo}
            onChange={(e) => onUpdate({ acuerdo: { ...acuerdo, aplicarAcuerdo: e.target.checked } })}
          />
          Aplicar acuerdo (si no, el resultado es el 100% del evento)
        </label>
        <h3 className="mb-1 mt-4 text-sm font-semibold text-slate-800">Acuerdo con el venue / promotor</h3>
        <AcuerdoTramoCard titulo="Ticketing" config={acuerdo.ticketing} bruto={acuerdoBrutos.ticketing} ivaPct={eventoAforo.ivaTicketingPct} onChange={(c) => setTramo('ticketing', c)} />
        <AcuerdoTramoCard titulo="Mesas VIP" config={acuerdo.mesasVip} bruto={acuerdoBrutos.mesasVip} ivaPct={ivaResto} onChange={(c) => setTramo('mesasVip', c)} />
        <AcuerdoTramoCard titulo="Barras" config={acuerdo.barras} bruto={acuerdoBrutos.barras} ivaPct={ivaResto} onChange={(c) => setTramo('barras', c)} />
        <AcuerdoTramoCard titulo="Comida" config={acuerdo.comida} bruto={acuerdoBrutos.comida} ivaPct={ivaResto} onChange={(c) => setTramo('comida', c)} />
        <AcuerdoTramoCard titulo="Merchandising" config={acuerdo.merchandising} bruto={acuerdoBrutos.merchandising} ivaPct={ivaResto} onChange={(c) => setTramo('merchandising', c)} />
        <p className="mt-3 text-xs text-slate-500">
          Ej. PQ @ SLS: ticketing 100%; barras y VIP 10% sobre bruto tras descontar el % de coste del venue.
        </p>
      </div>

      <div className="rounded-xl border border-slate-100 bg-white p-4">
        <QuienPagaGastos
          gastos={gastos}
          onTogglePagaLinea={(id, paga) => onUpdate({ gastos: gastos.map((g) => (g.id === id ? { ...g, paga } : g)) })}
          onTogglePagaCategoria={(categoria, paga) => onUpdate({ gastos: gastos.map((g) => (g.categoria === categoria ? { ...g, paga } : g)) })}
        />
      </div>

      <ResultadoAcuerdoCard resultado={resultado} />
    </div>
  );
}
