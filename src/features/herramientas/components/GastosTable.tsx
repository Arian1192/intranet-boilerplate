import { Card, Button, Select, SegmentedControl } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import { calcularImporteGasto } from '../data/calculos-acuerdo';
import type { AcuerdoBrutos, BaseGasto, CategoriaGasto, EventoAforo, Gasto, QuienPaga } from '../data/types';

interface Props {
  gastos: Gasto[];
  brutos: AcuerdoBrutos;
  eventoAforo: EventoAforo;
  onUpdate: (gastos: Gasto[]) => void;
}

const CATEGORIAS: CategoriaGasto[] = [
  'Artística', 'Publicidad', 'Promoción', 'Staff', 'Alquileres',
  'Sonido', 'Iluminación', 'Efectos', 'Producción', 'Seguridad',
  'Barras', 'Comida', 'Ticketing', 'Otros',
];

const BASES: { value: BaseGasto; label: string }[] = [
  { value: 'importe_fijo', label: 'Importe fijo €' },
  { value: 'pct_facturacion_neta', label: '% facturación neta' },
  { value: 'pct_ticketing_neto', label: '% ticketing neto' },
  { value: 'pct_vip_neto', label: '% VIP neto' },
  { value: 'pct_barras_neto', label: '% barras neto' },
  { value: 'pct_comida_neta', label: '% comida neta' },
  { value: 'pct_merch_neto', label: '% merch neto' },
];

const PAGA_OPTIONS: { label: string; value: QuienPaga }[] = [
  { label: 'Nosotros', value: 'nosotros' },
  { label: 'Venue', value: 'venue' },
];

export function GastosTable({ gastos, brutos, eventoAforo, onUpdate }: Props) {
  const patchRow = (id: string, patch: Partial<Gasto>) => {
    onUpdate(gastos.map((g) => (g.id === id ? { ...g, ...patch } : g)));
  };

  const borrar = (id: string) => onUpdate(gastos.filter((g) => g.id !== id));

  const anadir = () => {
    const nuevo: Gasto = {
      id: `gasto-${Date.now()}`,
      categoria: 'Artística',
      concepto: '',
      base: 'importe_fijo',
      valor: 0,
      paga: 'nosotros',
    };
    onUpdate([...gastos, nuevo]);
  };

  const total = gastos.reduce((a, g) => a + calcularImporteGasto(g, brutos, eventoAforo), 0);

  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800">Gastos</h3>
        <Button variant="secondary" size="sm" onClick={anadir}>+ Añadir</Button>
      </div>

      <div className="grid grid-cols-12 gap-2 pb-1 text-xs uppercase text-slate-400">
        <span className="col-span-2">Categoría</span>
        <span className="col-span-3">Concepto</span>
        <span className="col-span-2">Base</span>
        <span className="col-span-1">Valor</span>
        <span className="col-span-2">Importe</span>
        <span className="col-span-2">Paga</span>
      </div>

      {gastos.map((g) => (
        <div key={g.id} className="grid grid-cols-12 items-center gap-2 border-b border-slate-100 py-2 last:border-0">
          <div className="col-span-2">
            <Select
              aria-label="Categoría"
              value={g.categoria}
              onChange={(e) => patchRow(g.id, { categoria: e.target.value as CategoriaGasto })}
            >
              {CATEGORIAS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </div>
          <input
            type="text"
            aria-label="Concepto"
            value={g.concepto}
            onChange={(e) => patchRow(g.id, { concepto: e.target.value })}
            className="col-span-3 h-10 w-full rounded-lg border border-slate-200 px-2 text-sm"
          />
          <div className="col-span-2">
            <Select
              aria-label="Base"
              value={g.base}
              onChange={(e) => patchRow(g.id, { base: e.target.value as BaseGasto })}
            >
              {BASES.map((b) => (
                <option key={b.value} value={b.value}>{b.label}</option>
              ))}
            </Select>
          </div>
          <input
            type="number"
            aria-label="Valor"
            value={g.valor}
            onChange={(e) => patchRow(g.id, { valor: Number(e.target.value) })}
            className="col-span-1 h-10 w-full rounded-lg border border-slate-200 px-2 text-sm"
          />
          <span className="col-span-2 text-sm font-medium text-red-600">
            {formatCurrency(calcularImporteGasto(g, brutos, eventoAforo))}
          </span>
          <div className="col-span-2 flex items-center justify-between gap-2">
            <SegmentedControl options={PAGA_OPTIONS} value={g.paga} onChange={(paga) => patchRow(g.id, { paga })} />
            <button type="button" aria-label="×" onClick={() => borrar(g.id)}>×</button>
          </div>
        </div>
      ))}

      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="text-slate-500">Total gastos</span>
        <span className="font-semibold text-red-600">{formatCurrency(total)}</span>
      </div>
    </Card>
  );
}
