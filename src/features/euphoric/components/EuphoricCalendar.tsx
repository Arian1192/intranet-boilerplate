import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export interface EuphoricCalendarToday {
  year: number;
  month: number; // 0-11
  day: number;
}

export interface EuphoricCalendarProps {
  year: number;
  month: number; // 0-11
  monthLabel: string;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  today?: EuphoricCalendarToday;
  /** Render the content of a day cell, keyed by ISO date ('YYYY-MM-DD'). */
  renderDay?: (isoDate: string) => ReactNode;
}

interface CalendarCell {
  year: number;
  month: number;
  day: number;
  inMonth: boolean;
}

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

function shiftMonth(year: number, month: number, delta: number): { year: number; month: number } {
  const total = year * 12 + month + delta;
  return { year: Math.floor(total / 12), month: ((total % 12) + 12) % 12 };
}

function buildWeeks(year: number, month: number): CalendarCell[][] {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const mondayIndex = (firstDay.getDay() + 6) % 7; // Monday = 0

  const cells: CalendarCell[] = [];

  const prevMonthDays = new Date(year, month, 0).getDate();
  const prev = shiftMonth(year, month, -1);
  for (let i = mondayIndex - 1; i >= 0; i--) {
    cells.push({ year: prev.year, month: prev.month, day: prevMonthDays - i, inMonth: false });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ year, month, day, inMonth: true });
  }

  const next = shiftMonth(year, month, 1);
  let trailDay = 1;
  while (cells.length % 7 !== 0) {
    cells.push({ year: next.year, month: next.month, day: trailDay, inMonth: false });
    trailDay++;
  }

  const weeks: CalendarCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

/**
 * Euphoric-specific month calendar, matching the original bookings.conceptoneagency.com/euphoric
 * calco pixel-for-pixel (bare-arrow nav, uppercase weekday headers, rich day cells, brand "today"
 * circle). Presentational only — callers supply per-day content via `renderDay`.
 *
 * This is intentionally separate from `src/components/ui/MonthCalendar`, which is shared by
 * Etra/Producción and must not be modified for this calco.
 */
export function EuphoricCalendar({
  year,
  month,
  monthLabel,
  onPrevMonth,
  onNextMonth,
  today,
  renderDay,
}: EuphoricCalendarProps) {
  const weeks = buildWeeks(year, month);

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrevMonth}
          aria-label="Mes anterior"
          className="rounded-md px-2 py-1 text-sm text-slate-400 hover:bg-slate-50 hover:text-slate-600"
        >
          ←
        </button>
        <h3 className="text-base font-semibold text-slate-900">{monthLabel}</h3>
        <button
          type="button"
          onClick={onNextMonth}
          aria-label="Mes siguiente"
          className="rounded-md px-2 py-1 text-sm text-slate-400 hover:bg-slate-50 hover:text-slate-600"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 text-center text-xs uppercase text-slate-400">
        {WEEKDAYS.map((day) => (
          <div key={day} className="pb-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 border-l border-t border-slate-100">
        {weeks.flatMap((week, weekIndex) =>
          week.map((cell) => {
            const isoDate = `${cell.year}-${pad2(cell.month + 1)}-${pad2(cell.day)}`;
            const isToday =
              !!today && today.year === cell.year && today.month === cell.month && today.day === cell.day;

            return (
              <div
                key={`${weekIndex}-${isoDate}-${cell.inMonth ? 'in' : 'out'}`}
                className={cn(
                  'min-h-[124px] cursor-pointer border-b border-r border-slate-100 p-1.5',
                  cell.inMonth ? 'bg-white hover:bg-brand-50/30' : 'bg-slate-50/40'
                )}
              >
                <div className={cn('mb-1 text-right text-xs', cell.inMonth ? 'text-slate-500' : 'text-slate-300')}>
                  {isToday ? (
                    <span className="inline-grid h-5 w-5 place-items-center rounded-full bg-brand-600 text-white">
                      {cell.day}
                    </span>
                  ) : (
                    cell.day
                  )}
                </div>
                <div className="space-y-1.5">{renderDay?.(isoDate)}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export interface PublicationCellProps {
  name: string;
  account: string;
  location: string;
  typeLabel: string;
  statusLabel: string;
  title: string;
  onClick?: () => void;
}

/** Rich publication card used inside a day cell, e.g. "Set Times" on Contenido → Calendario. */
export function PublicationCell({
  name,
  account,
  location,
  typeLabel,
  statusLabel,
  title,
  onClick,
}: PublicationCellProps) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="block w-full space-y-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-left leading-snug hover:border-brand-300 hover:shadow-sm"
    >
      <span className="block truncate text-[11px] font-semibold text-slate-800">{name}</span>
      <span className="block truncate text-[10px] text-slate-400">{account}</span>
      <span className="flex items-start gap-0.5 text-[10px] text-rose-500">
        <span className="shrink-0">📍</span>
        <span className="line-clamp-2">{location}</span>
      </span>
      <span className="flex flex-wrap items-center gap-1 pt-0.5">
        <span className="inline-flex items-center rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-medium text-slate-500">
          {typeLabel}
        </span>
        <span className="inline-flex items-center rounded-full bg-blue-50 px-1.5 py-0.5 text-[9px] font-medium text-blue-600">
          {statusLabel}
        </span>
      </span>
    </button>
  );
}

export interface EventPillProps {
  name: string;
  /** rose = producción (default), violet = marketing */
  tone?: 'rose' | 'violet';
}

/** Compact event pill used inside a day cell for Contenido/Eventos calendars. */
export function EventPill({ name, tone = 'rose' }: EventPillProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-1 rounded-md border-l-2 px-1.5 py-1 text-[10px]',
        tone === 'violet' ? 'border-brand-400 bg-brand-50 text-brand-700' : 'border-rose-400 bg-rose-50 text-rose-600'
      )}
    >
      <span className="shrink-0">📍</span>
      <span className="line-clamp-2">{name}</span>
    </div>
  );
}
