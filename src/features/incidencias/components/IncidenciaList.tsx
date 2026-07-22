import { IncidenciaRow } from './IncidenciaRow';
import type { Incidencia } from '../data/incidencias';

export interface IncidenciaListProps {
  items: Incidencia[];
}

export function IncidenciaList({ items }: IncidenciaListProps) {
  if (items.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white py-10 text-center text-sm text-slate-400">
        Nada en este estado.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="divide-y divide-slate-50">
        {items.map((i) => (
          <IncidenciaRow key={i.id} incidencia={i} />
        ))}
      </div>
    </div>
  );
}
