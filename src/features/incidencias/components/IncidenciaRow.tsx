import { Badge } from '@/components/ui';
import { IncidenciaAvatar } from './IncidenciaAvatar';
import { INCIDENCIA_ESTADOS } from '../data/incidencias';
import type { Incidencia, IncidenciaEstado } from '../data/incidencias';

const ESTADO_BADGE: Record<IncidenciaEstado, string> = {
  nueva: 'bg-rose-100 text-rose-700',
  auto: 'bg-sky-100 text-sky-700',
  en_curso: 'bg-transparent text-slate-300',
  resuelta: 'bg-emerald-100 text-emerald-700',
  descartada: 'bg-slate-100 text-slate-500',
};

const ESTADO_LABEL: Record<IncidenciaEstado, string> = INCIDENCIA_ESTADOS.reduce(
  (acc, e) => ({ ...acc, [e.id]: e.label }),
  {} as Record<IncidenciaEstado, string>
);

export interface IncidenciaRowProps {
  incidencia: Incidencia;
  /** Abre el detalle. En el live la fila abre un modal con el reporte completo. */
  onOpen?: () => void;
}

export function IncidenciaRow({ incidencia, onOpen }: IncidenciaRowProps) {
  const {
    estado,
    tipo,
    texto,
    hasAttachment,
    routePath,
    reporterName,
    reporterInitials,
    reporterColor,
    reporterAvatarUrl,
  } = incidencia;

  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-slate-50"
    >
      <span
        className={`w-24 shrink-0 truncate rounded px-1.5 py-0.5 text-center text-[10px] font-semibold uppercase tracking-wide ${ESTADO_BADGE[estado]}`}
      >
        {ESTADO_LABEL[estado]}
      </span>
      {tipo === 'idea' && (
        <Badge variant="violet" size="sm">
          Idea
        </Badge>
      )}
      <span className="min-w-0 flex-1 truncate text-sm text-slate-800">{texto}</span>
      {hasAttachment && <span className="shrink-0 text-[11px] text-slate-400">📎</span>}
      <span className="hidden w-40 shrink-0 truncate text-[11px] text-slate-400 lg:block">{routePath}</span>
      <span className="w-20 shrink-0 text-right text-[11px] text-slate-400">—</span>
      <IncidenciaAvatar
        reporterName={reporterName}
        reporterInitials={reporterInitials}
        reporterColor={reporterColor}
        reporterAvatarUrl={reporterAvatarUrl}
      />
    </button>
  );
}
