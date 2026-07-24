import type { CalendarEvent } from '@/types';
import { PaymentChip } from './PaymentChip';

export interface AgendaShowCardProps {
  event: CalendarEvent;
}

export function AgendaShowCard({ event }: AgendaShowCardProps) {
  const detalles = [event.venue, event.city, event.event].filter(Boolean);

  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-4 py-3 last:border-b-0">
      <div className="flex min-w-0 items-center gap-2 text-sm">
        <span className="shrink-0 rounded-md bg-slate-900 px-2 py-0.5 text-xs font-medium text-white">
          Show
        </span>
        <span className="truncate">
          <span className="font-semibold text-slate-800">{event.artist}</span>
          {detalles.map((d) => (
            <span key={d} className="text-slate-500"> · {d}</span>
          ))}
        </span>
      </div>
      {event.paymentStatus && <PaymentChip status={event.paymentStatus} className="shrink-0" />}
    </div>
  );
}
