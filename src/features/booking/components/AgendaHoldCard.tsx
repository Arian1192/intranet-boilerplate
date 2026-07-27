import type { CalendarEvent } from '@/types';
import { etapaLabel } from '../data/etapaLabels';

export interface AgendaHoldCardProps {
  event: CalendarEvent;
}

/**
 * Tarjeta de hold en la agenda. Botones "Subir a show" / "Editar" / "✕" INERTES
 * (spec D2: mock documentado, presentes e idénticos al live pero sin mutar estado).
 */
export function AgendaHoldCard({ event }: AgendaHoldCardProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-l-2 border-amber-400 bg-amber-50/40 px-4 py-3">
      <div className="flex min-w-0 items-center gap-2 text-sm">
        <span className="shrink-0 rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
          Calendario
        </span>
        <span className="truncate text-slate-500">
          <span className="font-semibold text-slate-800">{event.artist}</span>
          {` · ${event.holdTitle} (del artista)`}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-3 text-sm">
        {event.etapa && (
          <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
            {etapaLabel(event.etapa)}
          </span>
        )}
        <button type="button" className="font-medium text-slate-600 hover:text-slate-900">
          Subir a show
        </button>
        <button type="button" className="text-slate-500 hover:text-slate-700">
          Editar
        </button>
        <button type="button" aria-label="Descartar hold" className="text-slate-400 hover:text-slate-600">
          ✕
        </button>
      </div>
    </div>
  );
}
