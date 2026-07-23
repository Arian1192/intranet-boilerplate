import { User } from 'lucide-react';
import type { Incidencia, IncidenciaEstado } from '@/features/incidencias/data/incidencias';

const STATUS_CHIP: Record<IncidenciaEstado, string> = {
  nueva: 'bg-red-100 text-red-700',
  auto: 'bg-sky-100 text-sky-700',
  en_curso: 'bg-slate-100 text-slate-400',
  resuelta: 'bg-emerald-100 text-emerald-700',
  descartada: 'bg-slate-100 text-slate-500',
};

const STATUS_LABEL: Record<IncidenciaEstado, string> = {
  nueva: 'NUEVA',
  auto: 'AUTO',
  en_curso: 'EN CURSO',
  resuelta: 'RESUELTA',
  descartada: 'DESCARTADA',
};

export interface IncidenciaRowProps {
  incidencia: Incidencia;
}

function capitalizeType(tipo?: string): string {
  if (!tipo) return 'Idea';
  return tipo.charAt(0).toUpperCase() + tipo.slice(1);
}

export function IncidenciaRow({ incidencia }: IncidenciaRowProps) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-100 px-2 py-3 text-sm last:border-b-0">
      <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${STATUS_CHIP[incidencia.estado]}`}>
        {STATUS_LABEL[incidencia.estado]}
      </span>
      <span className="shrink-0 rounded bg-violet-100 px-1.5 py-0.5 text-[10px] font-medium text-violet-600">{capitalizeType(incidencia.tipo)}</span>
      <span className="flex-1 truncate text-slate-700">{incidencia.texto}</span>
      <span className="w-40 shrink-0 truncate font-mono text-xs text-slate-400">{incidencia.routePath ?? '—'}</span>
      {incidencia.reporterInitials ? (
        <span
          className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
          style={{ backgroundColor: incidencia.reporterColor ?? '#64748b' }}
          title={incidencia.reporterInitials}
        >
          {incidencia.reporterInitials}
        </span>
      ) : (
        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <User className="h-3.5 w-3.5" />
        </span>
      )}
    </div>
  );
}
