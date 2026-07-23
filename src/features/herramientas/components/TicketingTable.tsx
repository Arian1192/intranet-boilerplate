import { Card, Button } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import { ingresoTramo } from '../data/calculos-acuerdo';
import { entradasObjetivo, ticketingBrutoWaterfall, type Escenario } from '../data/calculos-escenarios';
import type { Proyeccion, TicketingRelease } from '../data/types';

interface Props {
  proyeccion: Proyeccion;
  escenario: Escenario;
  onUpdate: (patch: Partial<Proyeccion>) => void;
}

export function TicketingTable({ proyeccion, escenario, onUpdate }: Props) {
  const { ticketing, desglosarPorTicketera, acuerdo, eventoAforo, ajustesEscenarios } = proyeccion;
  const ordenado = [...ticketing].sort((a, b) => a.orden - b.orden);

  const setTicketing = (next: TicketingRelease[]) => onUpdate({ ticketing: next });

  const patchRow = (id: string, patch: Partial<TicketingRelease>) => {
    setTicketing(ticketing.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const mover = (id: string, dir: -1 | 1) => {
    const idx = ordenado.findIndex((r) => r.id === id);
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= ordenado.length) return;
    const reordenado = [...ordenado];
    [reordenado[idx], reordenado[swapIdx]] = [reordenado[swapIdx], reordenado[idx]];
    setTicketing(reordenado.map((r, i) => ({ ...r, orden: i })));
  };

  const borrar = (id: string) => setTicketing(ticketing.filter((r) => r.id !== id));

  const anadir = () => {
    const nueva: TicketingRelease = {
      id: `tk-${Date.now()}`,
      orden: ticketing.length,
      release: '',
      entradas: 0,
      precio: 0,
    };
    setTicketing([...ticketing, nueva]);
  };

  const anadirCanal = (id: string) => {
    const fila = ticketing.find((r) => r.id === id);
    const canales = [...(fila?.canales ?? []), `Ticketera ${(fila?.canales?.length ?? 0) + 1}`];
    patchRow(id, { canales });
  };

  const quitarCanal = (id: string, idx: number) => {
    const fila = ticketing.find((r) => r.id === id);
    const canales = (fila?.canales ?? []).filter((_, i) => i !== idx);
    patchRow(id, { canales });
  };

  const totalEntradas = ticketing.reduce((a, r) => a + r.entradas, 0);
  const totalFacturacion = ticketing.reduce((a, r) => a + r.entradas * r.precio, 0);

  const objetivo = entradasObjetivo(
    ticketing, ajustesEscenarios, escenario, eventoAforo.invitaciones, eventoAforo.asistenciaForzada
  );
  const brutoEscenario = ticketingBrutoWaterfall(ticketing, objetivo);
  const porAcuerdo = ingresoTramo(acuerdo.ticketing, brutoEscenario, eventoAforo.ivaTicketingPct);

  const inputClass = 'h-9 w-full rounded-lg border border-slate-200 px-2 text-sm';

  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800">Ticketing</h3>
        <Button variant="secondary" size="sm" onClick={anadir}>+ Añadir</Button>
      </div>
      <label className="mb-3 flex items-center gap-2 text-sm text-slate-600">
        <input
          type="checkbox"
          aria-label="Desglosar por ticketera (Fourvenues, RA, DICE…)"
          checked={desglosarPorTicketera}
          onChange={(e) => onUpdate({ desglosarPorTicketera: e.target.checked })}
        />
        Desglosar por ticketera (Fourvenues, RA, DICE…)
      </label>

      <div className="grid grid-cols-12 gap-2 pb-1 text-xs uppercase text-slate-400">
        <span className="col-span-4">Release</span>
        <span className="col-span-2">Entradas</span>
        <span className="col-span-2">Precio €</span>
        <span className="col-span-2">Facturación</span>
        <span className="col-span-2" />
      </div>

      {ordenado.map((r, idx) => (
        <div key={r.id} className="border-b border-slate-100 py-2 last:border-0">
          <div className="grid grid-cols-12 items-center gap-2">
            <input
              type="text"
              aria-label="Release"
              value={r.release}
              onChange={(e) => patchRow(r.id, { release: e.target.value })}
              className={`col-span-4 ${inputClass}`}
            />
            <input
              type="number"
              aria-label="Entradas"
              value={r.entradas}
              onChange={(e) => patchRow(r.id, { entradas: Number(e.target.value) })}
              className={`col-span-2 ${inputClass}`}
            />
            <input
              type="number"
              aria-label="Precio"
              value={r.precio}
              onChange={(e) => patchRow(r.id, { precio: Number(e.target.value) })}
              className={`col-span-2 ${inputClass}`}
            />
            <span className="col-span-2 text-sm font-medium text-slate-800">
              {formatCurrency(r.entradas * r.precio)}
            </span>
            <div className="col-span-2 flex items-center justify-end gap-1">
              <button type="button" aria-label="↑" onClick={() => mover(r.id, -1)} disabled={idx === 0} className="disabled:opacity-30">↑</button>
              <button type="button" aria-label="↓" onClick={() => mover(r.id, 1)} disabled={idx === ordenado.length - 1} className="disabled:opacity-30">↓</button>
              <button type="button" aria-label="×" onClick={() => borrar(r.id)}>×</button>
            </div>
          </div>
          {desglosarPorTicketera && (
            <div className="col-span-12 mt-1 flex flex-wrap items-center gap-2 pl-1 text-xs text-slate-500">
              <span>Reparto ticketeras: 0 / {r.canales?.length ?? 0}</span>
              {(r.canales ?? []).map((canal, i) => (
                <span key={i} className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5">
                  {canal}
                  <button type="button" aria-label={`Quitar ${canal}`} onClick={() => quitarCanal(r.id, i)}>×</button>
                </span>
              ))}
              <Button variant="ghost" size="sm" onClick={() => anadirCanal(r.id)}>+ ticketera</Button>
            </div>
          )}
        </div>
      ))}

      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="text-slate-500">Total ticketing · {totalEntradas} entradas</span>
        <div className="flex items-center gap-4">
          <span className="font-semibold text-slate-900">{formatCurrency(totalFacturacion)}</span>
          <span className="text-slate-400">Por acuerdo <span className="font-medium text-slate-700">{formatCurrency(porAcuerdo)}</span></span>
        </div>
      </div>
    </Card>
  );
}
