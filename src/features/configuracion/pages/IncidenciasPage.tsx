import { useState } from 'react';
import {
  listIncidencias,
  countByEstado,
  filterByEstado,
  INCIDENCIA_ESTADOS,
} from '@/features/incidencias/data/incidencias';
import type { Incidencia, IncidenciaEstado } from '@/features/incidencias/data/incidencias';
import { IncidenciaStatFilter } from '@/features/incidencias/components/IncidenciaStatFilter';
import { IncidenciaList } from '@/features/incidencias/components/IncidenciaList';
import { IncidenciaDetailDialog } from '@/features/incidencias/components/IncidenciaDetailDialog';
import { ConfigPageHeader } from '../components/ConfigPageHeader';

export function IncidenciasPage() {
  const [estadoFilter, setEstadoFilter] = useState<IncidenciaEstado | null>(null);
  const [abierta, setAbierta] = useState<Incidencia | null>(null);

  const list = listIncidencias();
  const counts = countByEstado(list);
  const filtered = filterByEstado(list, estadoFilter);

  const toggle = (estado: IncidenciaEstado) => {
    setEstadoFilter((current) => (current === estado ? null : estado));
  };

  return (
    <div className="space-y-4">
      <ConfigPageHeader
        title="Incidencias"
        subtitle="Lo que el equipo reporta desde el panel de ayuda. Responder es lo que hace que sigan reportando."
      />
      <div role="group" aria-label="Filtrar por estado" className="flex flex-wrap gap-2">
        {INCIDENCIA_ESTADOS.map((estado) => (
          <IncidenciaStatFilter
            key={estado.id}
            estado={estado.id}
            label={estado.label}
            count={counts[estado.id]}
            selected={estadoFilter === estado.id}
            onToggle={() => toggle(estado.id)}
          />
        ))}
      </div>
      <IncidenciaList items={filtered} onOpen={setAbierta} />
      {abierta && <IncidenciaDetailDialog incidencia={abierta} onClose={() => setAbierta(null)} />}
    </div>
  );
}
