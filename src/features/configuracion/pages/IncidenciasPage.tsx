import { listIncidencias, countByEstado } from '@/features/incidencias/data/incidencias';
import { ConfigPageHeader } from '../components/ConfigPageHeader';
import { IncidentCountPill } from '../components/IncidentCountPill';
import { IncidenciaRow } from '../components/IncidenciaRow';

export function IncidenciasPage() {
  const list = listIncidencias();
  const counts = countByEstado(list);

  return (
    <div className="space-y-4">
      <ConfigPageHeader
        title="Incidencias"
        subtitle="Lo que el equipo reporta desde el panel de ayuda. Responder es lo que hace que sigan reportando."
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <IncidentCountPill label="NUEVAS" count={counts.nueva} tone="red" />
        <IncidentCountPill label="AUTO" count={counts.auto} tone="sky" />
        <IncidentCountPill label="EN CURSO" count={counts.en_curso} tone="neutral" />
        <IncidentCountPill label="RESUELTAS" count={counts.resuelta} tone="emerald" />
        <IncidentCountPill label="DESCARTADAS" count={counts.descartada} tone="neutral" />
      </div>
      <div className="rounded-xl border border-slate-100 bg-white">
        {list.map((i) => (
          <IncidenciaRow key={i.id} incidencia={i} />
        ))}
      </div>
    </div>
  );
}
