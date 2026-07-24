import { cn } from '@/lib/utils';
import type { CalendarEvent } from '@/types';

export interface MonthGridProps {
  year: number;
  month: number; // 0-indexed
  events: CalendarEvent[];
}

const WEEKDAYS = ['LU', 'MA', 'MI', 'JU', 'VI', 'SÁ', 'DO'];

function chipClasses(event: CalendarEvent): string {
  if (event.type === 'hold') return 'border-amber-400 bg-amber-50 text-amber-800 italic';
  if (event.paymentStatus === 'Liquidado') return 'border-emerald-400 bg-emerald-50 text-emerald-800';
  if (event.paymentStatus === 'Parcialmente abonado') return 'border-amber-400 bg-amber-50 text-amber-800';
  return 'border-blue-400 bg-blue-50 text-blue-800';
}

function chipText(event: CalendarEvent): string {
  const secondary = event.city ?? event.holdTitle ?? null;
  return secondary ? `${event.artist} · ${secondary}` : event.artist;
}

export function MonthGrid({ year, month, events }: MonthGridProps) {
  const firstDay = new Date(year, month, 1).getDay(); // 0=domingo
  const leadingBlanks = (firstDay + 6) % 7; // semana empieza en lunes
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const eventsByDay = new Map<number, CalendarEvent[]>();
  for (const e of events) {
    const day = Number(e.date.slice(8, 10));
    const list = eventsByDay.get(day) ?? [];
    list.push(e);
    eventsByDay.set(day, list);
  }

  return (
    <div className="px-4 pb-4">
      <div className="grid grid-cols-7 border-b border-slate-100 pb-2 text-center text-xs font-medium text-slate-400">
        {WEEKDAYS.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day, idx) => (
          <div
            key={idx}
            className="min-h-[92px] border-b border-r border-slate-100 p-1.5 first:border-l"
          >
            {day !== null && (
              <>
                <div className="mb-1 text-right text-xs text-slate-400">{day}</div>
                <div className="space-y-1">
                  {(eventsByDay.get(day) ?? []).map((e) => (
                    <div
                      key={e.id}
                      className={cn(
                        'truncate rounded border-l-2 px-1.5 py-0.5 text-[11px] font-medium',
                        chipClasses(e)
                      )}
                      title={chipText(e)}
                    >
                      {chipText(e)}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
