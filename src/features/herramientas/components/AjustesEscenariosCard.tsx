import { CollapsibleSection } from './CollapsibleSection';
import { calcularBreakeven } from '../data/calculos-breakeven';
import type { AjustesEscenarios, Proyeccion, ViaBreakeven } from '../data/types';

interface Props {
  proyeccion: Proyeccion;
  onUpdate: (patch: Partial<Proyeccion>) => void;
}

const VIAS: { value: ViaBreakeven; label: string }[] = [
  { value: 'ticketing', label: 'Ticketing' },
  { value: 'mesas_vip', label: 'Mesas VIP' },
  { value: 'barras', label: 'Barras' },
  { value: 'comida', label: 'Comida' },
  { value: 'merchandising', label: 'Merchandising' },
];

export function AjustesEscenariosCard({ proyeccion, onUpdate }: Props) {
  const { ajustesEscenarios } = proyeccion;
  const breakeven = calcularBreakeven(proyeccion);

  const setAjustes = (patch: Partial<AjustesEscenarios>) => {
    onUpdate({ ajustesEscenarios: { ...ajustesEscenarios, ...patch } });
  };

  const toggleVia = (via: ViaBreakeven) => {
    const activa = ajustesEscenarios.viasBreakeven.includes(via);
    const viasBreakeven = activa
      ? ajustesEscenarios.viasBreakeven.filter((v) => v !== via)
      : [...ajustesEscenarios.viasBreakeven, via];
    setAjustes({ viasBreakeven });
  };

  const inputClass = 'h-9 w-full rounded-lg border border-slate-200 px-2 text-sm';

  return (
    <CollapsibleSection
      title="Ajustes de escenarios y breakeven"
      summary={`Base ${ajustesEscenarios.multiplicadorBasePct}% · BE ${breakeven ? `${breakeven.pctVentaProyectada}%` : '—'}`}
    >
      <div className="space-y-6">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase text-slate-400">Multiplicador por escenario</p>
          <div className="grid grid-cols-3 gap-3">
            <label className="text-xs">
              <span className="mb-1 block uppercase text-slate-400">Pesimista %</span>
              <input
                type="number"
                aria-label="PESIMISTA %"
                value={ajustesEscenarios.multiplicadorPesimistaPct}
                onChange={(e) => setAjustes({ multiplicadorPesimistaPct: Number(e.target.value) })}
                className={inputClass}
              />
            </label>
            <label className="text-xs">
              <span className="mb-1 block uppercase text-slate-400">Base %</span>
              <input
                type="number"
                aria-label="BASE %"
                value={ajustesEscenarios.multiplicadorBasePct}
                onChange={(e) => setAjustes({ multiplicadorBasePct: Number(e.target.value) })}
                className={inputClass}
              />
            </label>
            <label className="text-xs">
              <span className="mb-1 block uppercase text-slate-400">Optimista %</span>
              <input
                type="number"
                aria-label="OPTIMISTA %"
                value={ajustesEscenarios.multiplicadorOptimistaPct}
                onChange={(e) => setAjustes({ multiplicadorOptimistaPct: Number(e.target.value) })}
                className={inputClass}
              />
            </label>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase text-slate-400">Breakeven · vías que cuentan</p>
          <div className="flex flex-wrap gap-4">
            {VIAS.map((via) => (
              <label key={via.value} className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  aria-label={via.label}
                  checked={ajustesEscenarios.viasBreakeven.includes(via.value)}
                  onChange={() => toggleVia(via.value)}
                />
                {via.label}
              </label>
            ))}
          </div>
        </div>

        <p className="text-sm text-slate-600">
          {breakeven
            ? `% de venta proyectada ${breakeven.pctVentaProyectada}% · Entradas necesarias ${breakeven.entradasNecesarias} · Asistencia necesaria ${breakeven.asistenciaNecesaria}`
            : 'No se alcanza el punto de equilibrio con las vías seleccionadas.'}
        </p>
      </div>
    </CollapsibleSection>
  );
}
