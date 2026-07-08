import { cn } from '@/lib/utils';

export interface MonthCalendarEvent {
  id: string;
  isoDate: string; // 'YYYY-MM-DD'
  label: string;
  toneClassName: string; // e.g. 'bg-blue-100 text-blue-700'
}

export interface MonthCalendarProps {
  year: number;
  month: number; // 0-11
  monthLabel: string;
  events: MonthCalendarEvent[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

function buildDays(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const mondayIndex = (firstDay.getDay() + 6) % 7; // Monday = 0
  const days: (number | null)[] = Array(mondayIndex).fill(null);
  for (let day = 1; day <= daysInMonth; day++) days.push(day);
  return days;
}

export function MonthCalendar({ year, month, monthLabel, events, onPrevMonth, onNextMonth }: MonthCalendarProps) {
  const days = buildDays(year, month);
  const eventsByDay = new Map<number, MonthCalendarEvent[]>();
  events.forEach((event) => {
    const eventDate = new Date(event.isoDate);
    // Only include events that match the currently displayed year and month
    if (eventDate.getFullYear() === year && eventDate.getMonth() === month) {
      const day = eventDate.getDate();
      const list = eventsByDay.get(day) ?? [];
      list.push(event);
      eventsByDay.set(day, list);
    }
  });

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <button type="button" onClick={onPrevMonth} className="text-sm font-medium text-slate-500 hover:text-slate-700">
          ← Anterior
        </button>
        <h3 className="text-base font-semibold text-slate-900">{monthLabel}</h3>
        <button type="button" onClick={onNextMonth} className="text-sm font-medium text-slate-500 hover:text-slate-700">
          Siguiente →
        </button>
      </div>
      <div className="grid grid-cols-7 text-center text-xs font-medium text-slate-400">
        {WEEKDAYS.map((day) => (
          <div key={day} className="pb-2">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-slate-50">
        {days.map((day, index) => (
          <div key={index} className="min-h-[80px] bg-white p-1 text-xs">
            {day && (
              <>
                <div className="mb-1 text-slate-400">{day}</div>
                <div className="space-y-1">
                  {(eventsByDay.get(day) ?? []).map((event) => (
                    <div key={event.id} className={cn('truncate rounded px-1 py-0.5', event.toneClassName)}>
                      {event.label}
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
