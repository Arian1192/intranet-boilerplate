import { cn } from '@/lib/utils';
import { multiplicadorPct, type Escenario } from '../data/calculos-escenarios';
import type { AjustesEscenarios } from '../data/types';

interface Props {
  ajustes: AjustesEscenarios;
  value: Escenario;
  onChange: (escenario: Escenario) => void;
}

const OPCIONES: { value: Escenario; label: string }[] = [
  { value: 'pesimista', label: 'Pesimista' },
  { value: 'base', label: 'Base' },
  { value: 'optimista', label: 'Optimista' },
];

export function EscenarioSelector({ ajustes, value, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-xs font-semibold uppercase text-slate-400">Escenario</span>
      <div className="flex gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
        {OPCIONES.map((op) => {
          const activo = op.value === value;
          return (
            <button
              key={op.value}
              type="button"
              aria-pressed={activo}
              onClick={() => onChange(op.value)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                activo ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              )}
            >
              {op.label} · {multiplicadorPct(ajustes, op.value)}%
            </button>
          );
        })}
      </div>
      <span className="text-sm text-brand-600">Ves el resultado por acuerdo.</span>
    </div>
  );
}
