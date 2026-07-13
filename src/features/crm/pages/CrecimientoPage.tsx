import { useMemo, useState } from 'react';
import { orgs } from '../data/seed';
import { opportunities } from '../data/pipeline';
import { crossSell, atRisk, RISK_OPTIONS } from '../data/crecimiento';
import { CrossSellTable } from '../components/CrossSellTable';
import { AtRiskTable } from '../components/AtRiskTable';

export function CrecimientoPage() {
  const [months, setMonths] = useState(6);
  const cross = useMemo(() => crossSell(orgs), []);
  const risk = useMemo(() => atRisk(orgs, opportunities, months), [months]);

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-800">Crecimiento</h1>
        <p className="text-sm text-slate-500">Oportunidades de venta cruzada entre empresas del grupo y clientes en riesgo por inactividad.</p>
      </div>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold tracking-wide text-slate-400">VENTA CRUZADA (CROSS-SELL)</h2>
        <p className="text-sm text-slate-500">Clientes que hoy solo trabajan con una empresa del grupo. Candidatos a ofrecerles los otros servicios.</p>
        <CrossSellTable rows={cross.rows} />
        <p className="text-sm text-slate-400">Además, {cross.unassignedCount} clientes sin ninguna empresa asignada — conviene revisarlos en el CRM.</p>
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold tracking-wide text-slate-400">CLIENTES EN RIESGO (INACTIVOS)</h2>
          <select
            aria-label="Umbral de inactividad"
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="h-9 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 focus:border-brand-400 focus:outline-none"
          >
            {RISK_OPTIONS.map((m) => <option key={m} value={m}>Sin actividad en {m} meses</option>)}
          </select>
        </div>
        <p className="text-sm text-slate-500">Actividad medida por oportunidades del CRM (creación o cierre). Ideal para campañas de reactivación.</p>
        <AtRiskTable rows={risk} />
      </section>
    </div>
  );
}
