import { Card, Button } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import { calcularBrutosEscenario } from '../data/calculos-escenarios';
import type { CajaRealLinea, Proyeccion } from '../data/types';

interface Props {
  proyeccion: Proyeccion;
  onUpdate: (patch: Partial<Proyeccion>) => void;
}

/**
 * Tab Real — "Caja real (barras, comida, extras)": tabla libre de una línea por fuente
 * (cada TPV de barra, guardarropa, comida…). Sustituye a `BarrasComidaMerchCards`
 * (que es fija, de previsión). "Rellenar con previsión" siembra líneas a partir del
 * consumo proyectado del escenario base.
 */
export function CajaRealTable({ proyeccion, onUpdate }: Props) {
  const { cajaReal } = proyeccion;

  const setCaja = (next: CajaRealLinea[]) => onUpdate({ cajaReal: next });

  const patchRow = (id: string, patch: Partial<CajaRealLinea>) =>
    setCaja(cajaReal.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  const borrar = (id: string) => setCaja(cajaReal.filter((l) => l.id !== id));

  const anadir = () => setCaja([...cajaReal, { id: crypto.randomUUID(), fuente: '', importe: 0 }]);

  const rellenarConPrevision = () => {
    const b = calcularBrutosEscenario(proyeccion, 'base');
    const lineas: CajaRealLinea[] = [
      { fuente: 'Barras', importe: b.barras },
      { fuente: 'Comida', importe: b.comida },
      { fuente: 'Merch', importe: b.merchandising },
    ]
      .filter((l) => l.importe > 0)
      .map((l) => ({ id: crypto.randomUUID(), ...l }));
    setCaja(lineas);
  };

  const totalCaja = cajaReal.reduce((a, l) => a + l.importe, 0);
  const inputClass = 'h-9 w-full rounded-lg border border-slate-200 px-2 text-sm';

  return (
    <Card className="p-4">
      <div className="mb-1 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-800">Caja real (barras, comida, extras)</h3>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={rellenarConPrevision}>Rellenar con previsión</Button>
          <Button variant="secondary" size="sm" onClick={anadir}>+ Añadir</Button>
        </div>
      </div>
      <p className="mb-3 text-xs text-slate-400">
        Una línea por fuente: cada TPV de barra o datáfono, guardarropa, comida, shishas…
      </p>

      {cajaReal.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-400">Sin líneas todavía. Añade o rellena con la previsión.</p>
      ) : (
        cajaReal.map((l) => (
          <div key={l.id} className="grid grid-cols-12 items-center gap-2 border-b border-slate-100 py-2 last:border-0">
            <input
              type="text"
              aria-label="Fuente"
              value={l.fuente}
              onChange={(e) => patchRow(l.id, { fuente: e.target.value })}
              className={`col-span-8 ${inputClass}`}
            />
            <input
              type="number"
              aria-label="Importe"
              value={l.importe}
              onChange={(e) => patchRow(l.id, { importe: Number(e.target.value) })}
              className={`col-span-3 ${inputClass}`}
            />
            <div className="col-span-1 flex justify-end">
              <button type="button" aria-label="×" onClick={() => borrar(l.id)}>×</button>
            </div>
          </div>
        ))
      )}

      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="text-slate-500">Total caja neto</span>
        <span className="font-semibold text-slate-900">{formatCurrency(totalCaja)}</span>
      </div>
    </Card>
  );
}
