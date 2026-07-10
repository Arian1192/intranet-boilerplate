import { DateBadge } from '@/components/ui';
import type { Event } from '@/types';
import { Link } from 'react-router';

export interface UpcomingEventsProps {
  events: Event[];
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  return (
    <section className="min-w-0">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Próximos eventos
        </h2>
        <Link to="/produccion" className="shrink-0 text-xs text-brand-600 hover:underline">
          Ver todos
        </Link>
      </div>
      <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {events.map((event) => {
          const start = event.timeRange.split(/[–-]/)[0].trim();
          return (
            <li key={event.id}>
              <Link
                to={`/produccion/${event.id}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50"
              >
                <DateBadge date={event.date} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-slate-800">
                    {event.title}
                  </span>
                  <span className="block truncate text-xs text-slate-400">
                    {start} · {event.location}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
