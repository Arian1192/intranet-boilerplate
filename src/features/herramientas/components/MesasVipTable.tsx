import { Card, Button } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import { ingresoTramo } from '../data/calculos-acuerdo';
import { vipBruto, type Escenario } from '../data/calculos-escenarios';
import type { MesaVip, Proyeccion } from '../data/types';

interface Props {
  proyeccion: Proyeccion;
  escenario: Escenario;
  onUpdate: (patch: Partial<Proyeccion>) => void;
  /** 'real' añade la columna MESAS REAL y calcula el total con mesas ejecutadas (Fase C). */
  modo?: 'prevision' | 'real';
}

export function MesasVipTable({ proyeccion, escenario: _escenario, onUpdate, modo = 'prevision' }: Props) {
  const { mesasVip, acuerdo, eventoAforo } = proyeccion;
  const esReal = modo === 'real';

  const setMesasVip = (next: MesaVip[]) => onUpdate({ mesasVip: next });

  const patchRow = (id: string, patch: Partial<MesaVip>) => {
    setMesasVip(mesasVip.map((z) => (z.id === id ? { ...z, ...patch } : z)));
  };

  const borrar = (id: string) => setMesasVip(mesasVip.filter((z) => z.id !== id));

  const anadir = () => {
    const nueva: MesaVip = { id: `vip-${Date.now()}`, zona: '', mesas: 0, probabilidadPct: 0, precio: 0 };
    setMesasVip([...mesasVip, nueva]);
  };

  // Previsión: bruto = Σ mesas × prob% × precio (no escala por escenario, spec §3.3).
  // Real: bruto = Σ mesasReal × precio (mesas realmente vendidas, sin probabilidad).
  const total = esReal
    ? mesasVip.reduce((a, z) => a + (z.mesasReal ?? 0) * z.precio, 0)
    : vipBruto(mesasVip);
  const porAcuerdo = ingresoTramo(acuerdo.mesasVip, total, eventoAforo.ivaBarrasComidaVipPct);

  const inputClass = 'h-9 w-full rounded-lg border border-slate-200 px-2 text-sm';

  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800">Mesas VIP</h3>
        <Button variant="secondary" size="sm" onClick={anadir}>+ Añadir</Button>
      </div>

      <div className="grid grid-cols-12 gap-2 pb-1 text-xs uppercase text-slate-400">
        <span className="col-span-3">Zona</span>
        <span className="col-span-2">Mesas</span>
        <span className="col-span-2">Prob. %</span>
        <span className="col-span-2">Precio €</span>
        {esReal ? <span className="col-span-2">Mesas real</span> : <span className="col-span-2">Facturación</span>}
        <span className="col-span-1" />
      </div>

      {mesasVip.map((z) => (
        <div key={z.id} className="grid grid-cols-12 items-center gap-2 border-b border-slate-100 py-2 last:border-0">
          <input
            type="text"
            aria-label="Zona"
            value={z.zona}
            onChange={(e) => patchRow(z.id, { zona: e.target.value })}
            className={`col-span-3 ${inputClass}`}
          />
          <input
            type="number"
            aria-label="Mesas"
            value={z.mesas}
            onChange={(e) => patchRow(z.id, { mesas: Number(e.target.value) })}
            className={`col-span-2 ${inputClass}`}
          />
          <input
            type="number"
            aria-label="Prob. %"
            value={z.probabilidadPct}
            onChange={(e) => patchRow(z.id, { probabilidadPct: Number(e.target.value) })}
            className={`col-span-2 ${inputClass}`}
          />
          <input
            type="number"
            aria-label="Precio"
            value={z.precio}
            onChange={(e) => patchRow(z.id, { precio: Number(e.target.value) })}
            className={`col-span-2 ${inputClass}`}
          />
          {esReal ? (
            <input
              type="number"
              aria-label="Mesas real"
              value={z.mesasReal ?? 0}
              onChange={(e) => patchRow(z.id, { mesasReal: Number(e.target.value) })}
              className={`col-span-2 ${inputClass}`}
            />
          ) : (
            <span className="col-span-2 text-sm font-medium text-slate-800">
              {formatCurrency(z.mesas * (z.probabilidadPct / 100) * z.precio)}
            </span>
          )}
          <div className="col-span-1 flex justify-end">
            <button type="button" aria-label="×" onClick={() => borrar(z.id)}>×</button>
          </div>
        </div>
      ))}

      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="text-slate-500">Total VIP</span>
        <div className="flex items-center gap-4">
          <span className="font-semibold text-emerald-600">{formatCurrency(total)}</span>
          <span className="text-slate-400">Por acuerdo <span className="font-medium text-slate-700">{formatCurrency(porAcuerdo)}</span></span>
        </div>
      </div>
    </Card>
  );
}
