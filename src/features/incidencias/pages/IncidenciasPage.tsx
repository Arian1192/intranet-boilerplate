import { useState } from 'react';
import { listIncidencias, countByEstado, filterByEstado, INCIDENCIA_ESTADOS } from '../data/incidencias';
import type { IncidenciaEstado } from '../data/incidencias';
import { IncidenciaStatFilter } from '../components/IncidenciaStatFilter';
import { IncidenciaList } from '../components/IncidenciaList';

export function IncidenciasPage() {
  const [estadoFilter, setEstadoFilter] = useState<IncidenciaEstado | null>(null);

  const all = listIncidencias();
  const counts = countByEstado(all);
  const filtered = filterByEstado(all, estadoFilter);

  const toggle = (estado: IncidenciaEstado) => {
    setEstadoFilter((cur) => (cur === estado ? null : estado));
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">Incidencias</h2>
        <p className="text-sm text-slate-500">
          Lo que el equipo reporta desde el panel de ayuda. Responder es lo que hace que sigan reportando.
        </p>
      </div>
      <div role="group" aria-label="Filtrar por estado" className="flex flex-wrap gap-2">
        {INCIDENCIA_ESTADOS.map((e) => (
          <IncidenciaStatFilter
            key={e.id}
            estado={e.id}
            label={e.label}
            count={counts[e.id]}
            selected={estadoFilter === e.id}
            onToggle={() => toggle(e.id)}
          />
        ))}
      </div>
      <IncidenciaList items={filtered} />
    </div>
  );
}
