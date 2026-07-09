import { Badge } from '@/components/ui';
import type { Event } from '@/types';
import { Link } from 'react-router';

export interface UpcomingEventsProps {
  events: Event[];
}

const STATUS_META: Record<Event['status'], { label: string; variant: 'blue' | 'amber' | 'neutral' }> = {
  confirmed: { label: 'Confirmado', variant: 'blue' },
  'in-production': { label: 'En producción', variant: 'amber' },
  tentative: { label: 'Tentativo', variant: 'neutral' },
};

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Próximos eventos
        </h2>
        <Link to="/produccion" className="text-xs text-brand-600 hover:underline">
          Ver todos
        </Link>
      </div>
      <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
        {events.map((event) => {
          const status = STATUS_META[event.status];
          return (
            <li key={event.id}>
              <Link to={`/produccion/${event.id}`} className="block hover:bg-slate-50">
                <div className="flex items-center gap-3 px-4 py-2.5">
                  <span className="text-lg">🎫</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-slate-800">
                      {event.title}
                    </span>
                    <span className="text-xs text-slate-400">
                      {event.date} · {event.timeRange} · {event.location}
                    </span>
                  </span>
                  <Badge variant={status.variant} className="shrink-0">
                    {status.label}
                  </Badge>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
