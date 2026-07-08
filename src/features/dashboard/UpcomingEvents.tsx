import { Card, Badge } from '@/components/ui';
import type { Event } from '@/types';
import { Ticket } from 'lucide-react';

export interface UpcomingEventsProps {
  events: Event[];
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  return (
    <section>
      <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
        Próximos eventos
      </h2>
      <Card className="divide-y divide-slate-100">
        {events.map((event) => (
          <div
            key={event.id}
            className="flex items-start gap-3 p-4 hover:bg-slate-50"
          >
            <div className="mt-0.5 text-slate-400">
              <Ticket className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-slate-900">{event.title}</h3>
              <p className="text-sm text-slate-500">
                {event.date} · {event.timeRange} · {event.location}
              </p>
            </div>
            <Badge variant={event.status === 'confirmed' ? 'success' : 'warning'}>
              {event.status === 'confirmed' ? 'Confirmado' : 'En producción'}
            </Badge>
          </div>
        ))}
      </Card>
    </section>
  );
}
