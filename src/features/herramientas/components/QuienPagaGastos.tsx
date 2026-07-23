import { SegmentedControl } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import type { CategoriaGasto, Gasto, QuienPaga } from '../data/types';

interface Props {
  gastos: Gasto[];
  onTogglePagaLinea: (id: string, paga: QuienPaga) => void;
  onTogglePagaCategoria: (categoria: CategoriaGasto, paga: QuienPaga) => void;
}

const PAGA_OPTIONS: { label: string; value: QuienPaga }[] = [
  { label: 'Nosotros', value: 'nosotros' },
  { label: 'Venue', value: 'venue' },
];

export function QuienPagaGastos({ gastos, onTogglePagaLinea, onTogglePagaCategoria }: Props) {
  const categorias = Array.from(new Set(gastos.map((g) => g.categoria)));
  const pagamosNosotros = gastos.filter((g) => g.paga === 'nosotros').reduce((a, g) => a + g.valor, 0);
  const pagaElVenue = gastos.filter((g) => g.paga === 'venue').reduce((a, g) => a + g.valor, 0);

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-800">¿Quién paga cada gasto?</h3>
      <p className="mb-3 text-xs text-slate-500">Asigna quién paga por categoría (toda de golpe) o línea a línea.</p>
      {categorias.map((categoria) => {
        const lineas = gastos.filter((g) => g.categoria === categoria);
        const subtotal = lineas.reduce((a, g) => a + g.valor, 0);
        const pagaComun = lineas.every((l) => l.paga === lineas[0].paga) ? lineas[0].paga : 'nosotros';
        return (
          <div key={categoria} className="border-b border-slate-100 py-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-500">{categoria}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">-{formatCurrency(subtotal)}</span>
                <SegmentedControl options={PAGA_OPTIONS} value={pagaComun} onChange={(paga) => onTogglePagaCategoria(categoria, paga)} />
              </div>
            </div>
            {lineas.map((g) => (
              <div key={g.id} className="mt-1 flex items-center justify-between pl-4">
                <span className="text-sm text-slate-600">{g.concepto}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">-{formatCurrency(g.valor)}</span>
                  <SegmentedControl options={PAGA_OPTIONS} value={g.paga} onChange={(paga) => onTogglePagaLinea(g.id, paga)} />
                </div>
              </div>
            ))}
          </div>
        );
      })}
      <div className="mt-3 flex justify-end gap-6 text-sm">
        <span>Pagamos nosotros <strong>-{formatCurrency(pagamosNosotros)}</strong></span>
        <span>Paga el venue <strong>-{formatCurrency(pagaElVenue)}</strong></span>
      </div>
    </div>
  );
}
