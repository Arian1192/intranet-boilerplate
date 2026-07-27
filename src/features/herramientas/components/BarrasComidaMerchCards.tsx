import { Card } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import { ingresoTramo } from '../data/calculos-acuerdo';
import { entradasObjetivo, type Escenario } from '../data/calculos-escenarios';
import type { BarrasComidaMerchConfig, Proyeccion } from '../data/types';

interface Props {
  proyeccion: Proyeccion;
  escenario: Escenario;
  onUpdate: (patch: Partial<Proyeccion>) => void;
}

export function BarrasComidaMerchCards({ proyeccion, escenario, onUpdate }: Props) {
  const { barrasComidaMerch, acuerdo, eventoAforo, ticketing, ajustesEscenarios } = proyeccion;
  const { barras, comida, merch } = barrasComidaMerch;

  const objetivo = entradasObjetivo(
    ticketing, ajustesEscenarios, escenario, eventoAforo.invitaciones, eventoAforo.asistenciaForzada
  );
  const asistencia = objetivo + eventoAforo.invitaciones;
  const ivaResto = eventoAforo.ivaBarrasComidaVipPct;

  const barrasBruto = barras.consumicionesHora * eventoAforo.duracionHoras * barras.precioMedio * asistencia;
  const comidaBruto = (comida.pctQueConsume / 100) * comida.ticketMedio * asistencia;
  const merchBruto = (merch.pctConversion / 100) * merch.precioMedio * asistencia;

  const barrasPorAcuerdo = ingresoTramo(acuerdo.barras, barrasBruto, ivaResto);
  const comidaPorAcuerdo = ingresoTramo(acuerdo.comida, comidaBruto, ivaResto);
  const merchPorAcuerdo = ingresoTramo(acuerdo.merchandising, merchBruto, ivaResto);

  const totalBruto = barrasBruto + comidaBruto + merchBruto;
  const totalPorAcuerdo = barrasPorAcuerdo + comidaPorAcuerdo + merchPorAcuerdo;

  const setConfig = (patch: Partial<BarrasComidaMerchConfig>) => {
    onUpdate({ barrasComidaMerch: { ...barrasComidaMerch, ...patch } });
  };

  const inputClass = 'h-9 w-full rounded-lg border border-slate-200 px-2 text-sm';

  return (
    <Card className="p-4">
      <h3 className="mb-3 text-sm font-semibold text-slate-800">Barras, comida y merch</h3>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-100 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-medium text-slate-800">Barras</span>
            <span className="text-sm font-semibold text-slate-900">{formatCurrency(barrasBruto)}</span>
          </div>
          <p className="mb-2 text-xs text-slate-400">Por acuerdo <span className="font-medium text-slate-600">{formatCurrency(barrasPorAcuerdo)}</span></p>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs">
              <span className="mb-1 block uppercase text-slate-400">Consumiciones / hora</span>
              <input
                type="number"
                aria-label="CONSUMICIONES / HORA"
                value={barras.consumicionesHora}
                onChange={(e) => setConfig({ barras: { ...barras, consumicionesHora: Number(e.target.value) } })}
                className={inputClass}
              />
            </label>
            <label className="text-xs">
              <span className="mb-1 block uppercase text-slate-400">Precio medio €</span>
              <input
                type="number"
                aria-label="PRECIO MEDIO € (BARRAS)"
                value={barras.precioMedio}
                onChange={(e) => setConfig({ barras: { ...barras, precioMedio: Number(e.target.value) } })}
                className={inputClass}
              />
            </label>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            {(barras.consumicionesHora * eventoAforo.duracionHoras).toFixed(1)} cons./pax en {eventoAforo.duracionHoras}h
          </p>
        </div>

        <div className="rounded-lg border border-slate-100 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-medium text-slate-800">Comida</span>
            <span className="text-sm font-semibold text-slate-900">{formatCurrency(comidaBruto)}</span>
          </div>
          <p className="mb-2 text-xs text-slate-400">Por acuerdo <span className="font-medium text-slate-600">{formatCurrency(comidaPorAcuerdo)}</span></p>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs">
              <span className="mb-1 block uppercase text-slate-400">% que consume</span>
              <input
                type="number"
                aria-label="% QUE CONSUME"
                value={comida.pctQueConsume}
                onChange={(e) => setConfig({ comida: { ...comida, pctQueConsume: Number(e.target.value) } })}
                className={inputClass}
              />
            </label>
            <label className="text-xs">
              <span className="mb-1 block uppercase text-slate-400">Ticket medio €</span>
              <input
                type="number"
                aria-label="TICKET MEDIO €"
                value={comida.ticketMedio}
                onChange={(e) => setConfig({ comida: { ...comida, ticketMedio: Number(e.target.value) } })}
                className={inputClass}
              />
            </label>
          </div>
        </div>

        <div className="rounded-lg border border-slate-100 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-medium text-slate-800">Merch</span>
            <span className="text-sm font-semibold text-slate-900">{formatCurrency(merchBruto)}</span>
          </div>
          <p className="mb-2 text-xs text-slate-400">Por acuerdo <span className="font-medium text-slate-600">{formatCurrency(merchPorAcuerdo)}</span></p>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs">
              <span className="mb-1 block uppercase text-slate-400">% conversión</span>
              <input
                type="number"
                aria-label="% CONVERSIÓN"
                value={merch.pctConversion}
                onChange={(e) => setConfig({ merch: { ...merch, pctConversion: Number(e.target.value) } })}
                className={inputClass}
              />
            </label>
            <label className="text-xs">
              <span className="mb-1 block uppercase text-slate-400">Precio medio €</span>
              <input
                type="number"
                aria-label="PRECIO MEDIO € (MERCH)"
                value={merch.precioMedio}
                onChange={(e) => setConfig({ merch: { ...merch, precioMedio: Number(e.target.value) } })}
                className={inputClass}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="text-slate-500">Barras, comida y merch</span>
        <div className="flex items-center gap-4">
          <span className="font-semibold text-slate-900">{formatCurrency(totalBruto)}</span>
          <span className="text-slate-400">Por acuerdo <span className="font-medium text-slate-700">{formatCurrency(totalPorAcuerdo)}</span></span>
        </div>
      </div>
    </Card>
  );
}
