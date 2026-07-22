import { IncidenciaRow } from './IncidenciaRow';
import type { Incidencia } from '../data/incidencias';

export interface IncidenciaListProps {
  items: Incidencia[];
  onOpen?: (incidencia: Incidencia) => void;
}

export function IncidenciaList({ items, onOpen }: IncidenciaListProps) {
  if (items.length === 0) {
    // El live no envuelve el estado vacío en la tarjeta: el texto flota sobre el fondo
    // de la página, sin borde ni fondo blanco (ver live-incidencias-en-curso.png).
    return <div className="py-16 text-center text-sm text-slate-400">Nada en este estado.</div>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="divide-y divide-slate-50">
        {items.map((i) => (
          <IncidenciaRow key={i.id} incidencia={i} onOpen={onOpen ? () => onOpen(i) : undefined} />
        ))}
      </div>
    </div>
  );
}
