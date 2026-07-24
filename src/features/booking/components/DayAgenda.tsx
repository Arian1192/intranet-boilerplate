import type { CalendarEvent } from '@/types';
import { AgendaShowCard } from './AgendaShowCard';
import { AgendaHoldCard } from './AgendaHoldCard';

export interface DayAgendaProps {
  events: CalendarEvent[];
}

function encabezado(dateISO: string): string {
  return new Date(`${dateISO}T00:00:00`).toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export function DayAgenda({ events }: DayAgendaProps) {
  const dias = Array.from(new Set(events.map((e) => e.date))).sort();

  return (
    <div className="mt-8 space-y-6">
      {dias.map((dia) => (
        <div key={dia}>
          <h3 className="mb-2 text-sm font-semibold text-slate-800">{encabezado(dia)}</h3>
          <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
            {events
              .filter((e) => e.date === dia)
              .map((e) =>
                e.type === 'hold' ? (
                  <AgendaHoldCard key={e.id} event={e} />
                ) : (
                  <AgendaShowCard key={e.id} event={e} />
                )
              )}
          </div>
        </div>
      ))}
    </div>
  );
}
